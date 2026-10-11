// Orchestrator for the full Luxosa Test E2E pipeline (receive -> validate
// -> normalize -> identity reconcile -> atomic claim -> contact update ->
// PDF -> upload -> email -> finalize). Every side effect is sequenced
// through the ledger so a failed phase is visible, never silently skipped
// or faked as success.

import { createHash } from 'node:crypto';
import { validateSubmission } from './submissionSchema';
import { reconcileIdentity as realReconcileIdentity } from './identity';
import { getLedger, type Ledger } from './ledger';
import type { LedgerStatus } from './ledger';
import { buildLuxosaTestResult } from '../../src/lib/luxosaTest/result';
import { generateDossierPdf as realGenerateDossierPdf, buildDossierFileName } from './pdfGeneration';
import { findCustomFieldValue } from './customFields';
import { archiveDossier, type ArchiveDeps } from './documentsArchive';
import type { LockClient } from './distributedLock';
import {
  getContact as realGetContact,
  updateContact as realUpdateContact,
  createContact as realCreateContact,
  uploadDocument as realUploadDocument,
  sendDossierEmail as realSendDossierEmail,
  GhlScopeBlockedError,
  EmailSendTimeoutError,
  isTestMode,
  SANDBOX_CONTACT_ID,
  SANDBOX_LOCATION_ID,
  FIELD_ULTIMA_DATA,
  FIELD_CONSENSO_MARKETING,
  CONSENSO_MARKETING_OPTION,
} from './ghlClient';

export interface SubmissionOutcome {
  submissionId: string;
  status: LedgerStatus;
  contactId: string | null;
  errorMessage?: string;
  emailMessageId?: string | null;
}

// Injectable collaborators — defaulted to the real GHL/PDF/ledger
// implementations. Tests override individual entries (e.g. a
// generateDossierPdf that throws) to exercise FAILED_PDF/FAILED_UPLOAD/
// FAILED_EMAIL deterministically, with no network and no module mocking.
export interface SubmissionDeps {
  ledger: Ledger;
  reconcileIdentity: typeof realReconcileIdentity;
  getContact: typeof realGetContact;
  updateContact: typeof realUpdateContact;
  createContact: typeof realCreateContact;
  generateDossierPdf: typeof realGenerateDossierPdf;
  uploadDocument: typeof realUploadDocument;
  sendDossierEmail: typeof realSendDossierEmail;
  // Tests inject an in-memory fake; production leaves it undefined so the
  // Documenti lock falls back to the real Upstash client.
  lockClient?: LockClient;
}

// Each default is resolved lazily and only when not overridden, so tests
// that inject a fake ledger/client never pay for (or risk throwing from)
// constructing the real one — e.g. getLedger() throwing when no provider
// is configured must never surface just because a test supplied its own
// InMemoryLedger via overrides.
function resolveDeps(overrides: Partial<SubmissionDeps>): SubmissionDeps {
  return {
    ledger: overrides.ledger ?? getLedger(),
    reconcileIdentity: overrides.reconcileIdentity ?? realReconcileIdentity,
    getContact: overrides.getContact ?? realGetContact,
    updateContact: overrides.updateContact ?? realUpdateContact,
    createContact: overrides.createContact ?? realCreateContact,
    generateDossierPdf: overrides.generateDossierPdf ?? realGenerateDossierPdf,
    uploadDocument: overrides.uploadDocument ?? realUploadDocument,
    sendDossierEmail: overrides.sendDossierEmail ?? realSendDossierEmail,
    lockClient: overrides.lockClient,
  };
}

function hashResult(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 16);
}

function buildDossierEmailContent(firstName: string, percorsoName: string): { subject: string; html: string } {
  return {
    subject: 'Il tuo Luxosa Test è pronto',
    html: `
      <p>Ciao ${firstName},</p>
      <p>in allegato trovi il tuo dossier Luxosa Test completo, con il tuo orientamento personalizzato verso <strong>${percorsoName}</strong>.</p>
      <p>Resta un orientamento preliminare: il percorso definitivo sarà confermato durante la Consulenza Luxosa in presenza.</p>
      <p>Per qualsiasi domanda siamo a tua disposizione su WhatsApp.</p>
      <p>— Luxosa</p>
    `.trim(),
  };
}

export async function processSubmission(
  rawPayload: unknown,
  overrides: Partial<SubmissionDeps> = {},
): Promise<SubmissionOutcome> {
  const deps: SubmissionDeps = resolveDeps(overrides);
  const validation = validateSubmission(rawPayload);
  if (!validation.ok) {
    const submissionId =
      typeof rawPayload === 'object' && rawPayload !== null && typeof (rawPayload as Record<string, unknown>).submissionId === 'string'
        ? ((rawPayload as Record<string, unknown>).submissionId as string)
        : 'unknown';
    return { submissionId, status: 'FAILED_VALIDATION', contactId: null, errorMessage: validation.errors.join('; ') };
  }

  const data = validation.data;

  // Server-side authority for the privacy gate — never trust that the
  // browser's own submit-button guard actually ran.
  if (!data.privacyAcknowledged) {
    return {
      submissionId: data.submissionId,
      status: 'FAILED_VALIDATION',
      contactId: null,
      errorMessage: 'privacyAcknowledged is required',
    };
  }

  const ledger = deps.ledger;

  const identity = await deps.reconcileIdentity(data.email, data.phoneE164);

  if (identity.kind === 'conflict') {
    return {
      submissionId: data.submissionId,
      status: 'FAILED_IDENTITY_CONFLICT',
      contactId: null,
      errorMessage: `email resolves to ${identity.emailContactId}, phone resolves to ${identity.phoneContactId}`,
    };
  }
  if (identity.kind === 'ambiguous') {
    return { submissionId: data.submissionId, status: 'UNKNOWN', contactId: null, errorMessage: identity.reason };
  }

  let contactId: string;
  if (identity.kind === 'no_match') {
    if (isTestMode()) {
      // TEST MODE never creates a real Contact — an unmatched identity is
      // exercised against the authorized sandbox so reconciliation can
      // still be observed end to end without any out-of-sandbox write.
      contactId = SANDBOX_CONTACT_ID;
    } else {
      const created = await deps.createContact({
        locationId: SANDBOX_LOCATION_ID,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phoneE164,
      });
      contactId = created.id;
    }
  } else {
    contactId = identity.contactId;
  }

  if (isTestMode() && contactId !== SANDBOX_CONTACT_ID) {
    // Should be unreachable — ghlClient's own guard would already have
    // thrown on the first write attempt. Fails fast here too.
    return {
      submissionId: data.submissionId,
      status: 'UNKNOWN',
      contactId,
      errorMessage: 'invariant violated: non-sandbox contactId reached the orchestrator in TEST MODE',
    };
  }

  const claim = await ledger.claim(data.submissionId, contactId);
  if (!claim.claimed) {
    const existing = claim.existing!;
    return {
      submissionId: data.submissionId,
      status: existing.status,
      contactId: existing.contactId,
      errorMessage: existing.errorMessage ?? undefined,
    };
  }

  try {
    const currentContact = await deps.getContact(contactId);
    const previousUltimaData = findCustomFieldValue(currentContact, FIELD_ULTIMA_DATA) as string | null;
    const result = buildLuxosaTestResult(data.answers);
    const resultHash = hashResult(result);
    await ledger.update(data.submissionId, { status: 'VALIDATED', previousUltimaData, resultHash });

    const customFieldsPatch: { id: string; value: unknown }[] = [];
    if (data.marketingConsent) {
      customFieldsPatch.push({ id: FIELD_CONSENSO_MARKETING, value: [CONSENSO_MARKETING_OPTION] });
    }
    // marketingConsent === false => NO ACTION on the field (no entry pushed,
    // no DND, no clearing of a prior consent).

    await deps.updateContact(contactId, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phoneE164,
      ...(customFieldsPatch.length ? { customFields: customFieldsPatch } : {}),
    });
    await ledger.update(data.submissionId, { status: 'CONTACT_RESOLVED' });

    let pdfBuffer: Buffer;
    const submittedAt = new Date();
    const fileName = buildDossierFileName(data.firstName, data.lastName, submittedAt, data.submissionId);
    try {
      const generated = await deps.generateDossierPdf(
        result,
        { nome: data.firstName, cognome: data.lastName, email: data.email, whatsapp: data.phoneE164 },
        submittedAt,
      );
      pdfBuffer = generated.buffer;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await ledger.update(data.submissionId, { status: 'FAILED_PDF', errorMessage: message });
      return { submissionId: data.submissionId, status: 'FAILED_PDF', contactId, errorMessage: message };
    }
    await ledger.update(data.submissionId, { status: 'PDF_READY' });

    // Archive preservation — verified empirically on the real sandbox
    // (2026-10-10, controlled matrix) that forms/upload-custom-files is
    // reliable ONLY for a single file per request, where it always REPLACES
    // the field's entire value (4/4 single-file calls observed). Sending
    // multiple files in one request was empirically INCONSISTENT (1 replace,
    // 1 append across 2 attempts, no controlling variable identified) and is
    // therefore never relied upon. archiveDossier() owns the full
    // lock-protected, snapshot-recoverable read-modify-write this requires
    // (see documentsArchive.ts for why a lock and a pre-upload snapshot are
    // both necessary).
    const archiveDeps: ArchiveDeps = {
      getContact: deps.getContact,
      updateContact: deps.updateContact,
      uploadDocument: deps.uploadDocument,
    };
    const archiveResult = await archiveDossier({
      contactId,
      fileName,
      pdfBuffer,
      submissionId: data.submissionId,
      ledger,
      deps: archiveDeps,
      lockClient: deps.lockClient,
    });
    if (archiveResult.status === 'FAILED_UPLOAD') {
      await ledger.update(data.submissionId, { status: 'FAILED_UPLOAD', errorMessage: archiveResult.errorMessage });
      return {
        submissionId: data.submissionId,
        status: 'FAILED_UPLOAD',
        contactId,
        errorMessage: archiveResult.errorMessage,
      };
    }
    const { uploadDocumentId, attachmentUrl } = archiveResult;
    await ledger.update(data.submissionId, { status: 'ARCHIVED', uploadDocumentId });

    const { subject, html } = buildDossierEmailContent(data.firstName, result.percorsoName);

    await ledger.update(data.submissionId, { status: 'EMAIL_SENDING' });
    let emailMessageId: string | null = null;
    try {
      const sendResult = await deps.sendDossierEmail({
        contactId,
        subject,
        html,
        attachmentUrls: attachmentUrl ? [attachmentUrl] : undefined,
      });
      emailMessageId = sendResult.messageId;
    } catch (err) {
      if (err instanceof GhlScopeBlockedError) {
        await ledger.update(data.submissionId, { status: 'BLOCKED_EMAIL_SCOPE', errorMessage: err.message });
        return { submissionId: data.submissionId, status: 'BLOCKED_EMAIL_SCOPE', contactId, errorMessage: err.message };
      }
      if (err instanceof EmailSendTimeoutError) {
        // Ambiguous — GHL may or may not have sent it. No automatic resend.
        await ledger.update(data.submissionId, { status: 'EMAIL_UNKNOWN', errorMessage: err.message });
        return { submissionId: data.submissionId, status: 'EMAIL_UNKNOWN', contactId, errorMessage: err.message };
      }
      const message = err instanceof Error ? err.message : String(err);
      await ledger.update(data.submissionId, { status: 'FAILED_EMAIL', errorMessage: message });
      return { submissionId: data.submissionId, status: 'FAILED_EMAIL', contactId, errorMessage: message };
    }
    await ledger.update(data.submissionId, { status: 'EMAIL_SENT', emailProviderMessageId: emailMessageId });

    await deps.updateContact(contactId, {
      customFields: [{ id: FIELD_ULTIMA_DATA, value: submittedAt.toISOString().slice(0, 10) }],
    });
    await ledger.update(data.submissionId, { status: 'COMPLETED' });
    return { submissionId: data.submissionId, status: 'COMPLETED', contactId, emailMessageId };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    try {
      await ledger.update(data.submissionId, { status: 'UNKNOWN', errorMessage: message });
    } catch {
      // ledger itself unavailable — nothing more we can record
    }
    return { submissionId: data.submissionId, status: 'UNKNOWN', contactId, errorMessage: message };
  }
}
