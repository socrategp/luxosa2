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
import {
  getContact as realGetContact,
  updateContact as realUpdateContact,
  createContact as realCreateContact,
  uploadDocument as realUploadDocument,
  sendDossierEmail as realSendDossierEmail,
  GhlScopeBlockedError,
  isTestMode,
  SANDBOX_CONTACT_ID,
  SANDBOX_LOCATION_ID,
  FIELD_ULTIMA_DATA,
  FIELD_DOCUMENTI,
  FIELD_CONSENSO_MARKETING,
  CONSENSO_MARKETING_OPTION,
} from './ghlClient';

export interface SubmissionOutcome {
  submissionId: string;
  status: LedgerStatus;
  contactId: string | null;
  errorMessage?: string;
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
  };
}

function hashResult(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 16);
}

function extractUploadedDocumentId(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null;
  const maybe = body as Record<string, unknown>;
  const direct = maybe.documentId ?? maybe.id;
  return typeof direct === 'string' ? direct : null;
}

function findCustomFieldValue(contact: { customFields?: { id: string; value: unknown }[] } | null, fieldId: string): unknown {
  return contact?.customFields?.find(f => f.id === fieldId)?.value ?? null;
}

function fileAlreadyUploaded(documentiValue: unknown, fileName: string): boolean {
  if (!documentiValue || typeof documentiValue !== 'object') return false;
  return Object.values(documentiValue as Record<string, unknown>).some(entry => {
    const meta = (entry as { meta?: { originalname?: string } } | undefined)?.meta;
    return meta?.originalname === fileName;
  });
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
    const fileName = buildDossierFileName(data.firstName, data.lastName, submittedAt);
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

    const alreadyUploaded = fileAlreadyUploaded(findCustomFieldValue(currentContact, FIELD_DOCUMENTI), fileName);
    let uploadDocumentId: string | null = null;
    if (!alreadyUploaded) {
      try {
        const uploadResult = await deps.uploadDocument(contactId, fileName, pdfBuffer, 'application/pdf');
        uploadDocumentId = extractUploadedDocumentId(uploadResult.body);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        await ledger.update(data.submissionId, { status: 'FAILED_UPLOAD', errorMessage: message });
        return { submissionId: data.submissionId, status: 'FAILED_UPLOAD', contactId, errorMessage: message };
      }
    }
    await ledger.update(data.submissionId, { status: 'ARCHIVED', uploadDocumentId });

    await ledger.update(data.submissionId, { status: 'EMAIL_SENDING' });
    try {
      await deps.sendDossierEmail();
    } catch (err) {
      if (err instanceof GhlScopeBlockedError) {
        await ledger.update(data.submissionId, { status: 'BLOCKED_EMAIL_SCOPE', errorMessage: err.message });
        return { submissionId: data.submissionId, status: 'BLOCKED_EMAIL_SCOPE', contactId, errorMessage: err.message };
      }
      const message = err instanceof Error ? err.message : String(err);
      await ledger.update(data.submissionId, { status: 'FAILED_EMAIL', errorMessage: message });
      return { submissionId: data.submissionId, status: 'FAILED_EMAIL', contactId, errorMessage: message };
    }

    // Unreachable until the email scope is added — kept for when it is.
    await deps.updateContact(contactId, {
      customFields: [{ id: FIELD_ULTIMA_DATA, value: submittedAt.toISOString().slice(0, 10) }],
    });
    await ledger.update(data.submissionId, { status: 'COMPLETED' });
    return { submissionId: data.submissionId, status: 'COMPLETED', contactId };
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
