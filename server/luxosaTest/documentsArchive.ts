// The Documenti critical section — isolated from submission.ts because it
// is the one part of the pipeline where two different executions can race
// on shared state (the same Contact's multi-file custom field), and where
// a crash mid-way can silently lose history if not handled carefully.
//
// Why a lock is needed at all: GHL's upload-custom-files endpoint always
// REPLACES the whole field value (verified empirically, see submission.ts
// history), so preserving previous dossiers requires a read-modify-write
// (read current value, upload, merge, PUT). Two submissions for the same
// Contact doing this concurrently would race on both the read and the PUT.
//
// Why a ledger snapshot is needed too: if the process crashes after the
// upload (which already replaced the field with just the new file) but
// before the final merge-PUT, a naive retry that re-reads the live field
// would see only the new file and believe that's the entire history. The
// snapshot taken and persisted BEFORE the upload is what lets a retry
// reconstruct previous+new correctly instead.

import type { Ledger } from './ledger';
import { acquireLock, releaseLock, DOCUMENTS_LOCK_PREFIX, type LockClient } from './distributedLock';
import { findCustomFieldValue, asDocumentiMap, fileAlreadyUploaded, extractEntryByFileName, type DocumentiMap } from './customFields';
import { FIELD_DOCUMENTI } from './ghlClient';
import type {
  getContact as realGetContact,
  updateContact as realUpdateContact,
  uploadDocument as realUploadDocument,
} from './ghlClient';

// "Up to 10 historical dossiers" per the archive requirement — reaching it
// blocks/flags rather than silently dropping anything; rotation/deletion
// policy beyond this point is explicitly out of scope here.
export const MAX_DOCUMENTI_HISTORY = 10;

export interface ArchiveDeps {
  getContact: typeof realGetContact;
  updateContact: typeof realUpdateContact;
  uploadDocument: typeof realUploadDocument;
}

export interface ArchiveDossierParams {
  contactId: string;
  fileName: string;
  pdfBuffer: Buffer;
  submissionId: string;
  ledger: Ledger;
  deps: ArchiveDeps;
  // Tests inject an in-memory fake here; production leaves it undefined so
  // distributedLock.ts falls back to the real Upstash client.
  lockClient?: LockClient;
  // Tests override these to avoid waiting out the real production timeout
  // (DOCUMENTS_LOCK_MAX_WAIT_MS); production leaves them at the defaults.
  lockTtlMs?: number;
  lockMaxWaitMs?: number;
}

export interface ArchiveDossierResult {
  status: 'ARCHIVED' | 'FAILED_UPLOAD';
  uploadDocumentId: string | null;
  attachmentUrl: string | null;
  errorMessage?: string;
}

function extractUploadedDocumentId(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null;
  const maybe = body as Record<string, unknown>;
  const direct = maybe.documentId ?? maybe.id;
  return typeof direct === 'string' ? direct : null;
}

export async function archiveDossier(params: ArchiveDossierParams): Promise<ArchiveDossierResult> {
  const { contactId, fileName, pdfBuffer, submissionId, ledger, deps, lockClient, lockTtlMs, lockMaxWaitMs } = params;
  const lockKey = `${DOCUMENTS_LOCK_PREFIX}${contactId}`;

  const lock = await acquireLock(lockKey, { client: lockClient, ttlMs: lockTtlMs, maxWaitMs: lockMaxWaitMs });
  if (!lock.acquired) {
    return {
      status: 'FAILED_UPLOAD',
      uploadDocumentId: null,
      attachmentUrl: null,
      errorMessage: 'Could not acquire the documents lock for this contact within the timeout (another submission is archiving concurrently)',
    };
  }

  try {
    // Snapshot: reuse what a prior (crashed) attempt already persisted for
    // THIS submissionId, so we never trust a live re-read after an upload
    // may have already replaced the field. Only captured fresh once.
    const ledgerEntry = await ledger.get(submissionId);
    let snapshot: DocumentiMap | null = ledgerEntry?.documentsSnapshotBeforeUpload ?? null;

    if (snapshot === null) {
      const liveContact = await deps.getContact(contactId);
      const liveValue = findCustomFieldValue(liveContact, FIELD_DOCUMENTI);
      const liveMap = asDocumentiMap(liveValue);

      if (!fileAlreadyUploaded(liveValue, fileName) && Object.keys(liveMap).length >= MAX_DOCUMENTI_HISTORY) {
        return {
          status: 'FAILED_UPLOAD',
          uploadDocumentId: null,
          attachmentUrl: null,
          errorMessage: `Documenti archive limit reached (${MAX_DOCUMENTI_HISTORY}) — new dossier not uploaded, nothing overwritten; rotation policy is separate and not yet defined`,
        };
      }

      snapshot = liveMap;
      await ledger.update(submissionId, { documentsSnapshotBeforeUpload: snapshot });
    }

    // Fresh live read, taken AFTER the snapshot is safely persisted. This
    // covers two cases identically: (a) a genuine replay where the file is
    // already fully archived, or (b) recovery after a crash where upload
    // succeeded but the merge-PUT never ran — either way the live field
    // already contains our file and must not be re-uploaded.
    const liveContactNow = await deps.getContact(contactId);
    const liveValueNow = findCustomFieldValue(liveContactNow, FIELD_DOCUMENTI);

    let uploadDocumentId: string | null;
    let newEntry: DocumentiMap | null;

    if (fileAlreadyUploaded(liveValueNow, fileName)) {
      newEntry = extractEntryByFileName(liveValueNow, fileName);
      const existingValues = newEntry ? Object.values(newEntry) : [];
      uploadDocumentId = existingValues[0]?.documentId ?? null;
    } else {
      const uploadResult = await deps.uploadDocument(contactId, fileName, pdfBuffer, 'application/pdf');
      uploadDocumentId = extractUploadedDocumentId(uploadResult.body);

      const postUploadContact = await deps.getContact(contactId);
      const postUploadValue = findCustomFieldValue(postUploadContact, FIELD_DOCUMENTI);
      newEntry = extractEntryByFileName(postUploadValue, fileName);
    }

    const newValues = newEntry ? Object.values(newEntry) : [];
    const attachmentUrl = newValues[0]?.url ?? null;

    // Reconstruct from the PERSISTED snapshot, never from a fresh live
    // read — the live field only ever shows the single most-recent upload.
    const mergedValue: DocumentiMap = { ...snapshot, ...(newEntry ?? {}) };

    await deps.updateContact(contactId, { customFields: [{ id: FIELD_DOCUMENTI, value: mergedValue }] });

    // Verify every entry we expect (snapshot + new) actually survived the
    // PUT before declaring success.
    const verifyContact = await deps.getContact(contactId);
    const verifyMap = asDocumentiMap(findCustomFieldValue(verifyContact, FIELD_DOCUMENTI));
    const expectedFileNames = Object.values(mergedValue)
      .map(entry => entry.meta?.originalname)
      .filter((name): name is string => Boolean(name));
    const actualFileNames = new Set(Object.values(verifyMap).map(entry => entry.meta?.originalname));
    const missing = expectedFileNames.filter(name => !actualFileNames.has(name));

    if (missing.length > 0) {
      return {
        status: 'FAILED_UPLOAD',
        uploadDocumentId,
        attachmentUrl,
        errorMessage: `Post-merge verification failed: expected document(s) missing after PUT: ${missing.join(', ')}`,
      };
    }

    return { status: 'ARCHIVED', uploadDocumentId, attachmentUrl };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: 'FAILED_UPLOAD', uploadDocumentId: null, attachmentUrl: null, errorMessage: message };
  } finally {
    if (lock.token) {
      await releaseLock(lockKey, lock.token, { client: lockClient });
    }
  }
}
