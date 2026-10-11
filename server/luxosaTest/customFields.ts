// Small, pure helpers for reading/matching GHL Contact customFields values.
// Shared by submission.ts (FIELD_ULTIMA_DATA) and documentsArchive.ts
// (FIELD_DOCUMENTI) — no I/O, no GHL client calls.

export type DocumentiEntry = { meta?: { originalname?: string }; url?: string; documentId?: string };
export type DocumentiMap = Record<string, DocumentiEntry>;

export function findCustomFieldValue(
  contact: { customFields?: { id: string; value: unknown }[] } | null,
  fieldId: string,
): unknown {
  return contact?.customFields?.find(f => f.id === fieldId)?.value ?? null;
}

export function asDocumentiMap(value: unknown): DocumentiMap {
  return value && typeof value === 'object' ? (value as DocumentiMap) : {};
}

export function fileAlreadyUploaded(documentiValue: unknown, fileName: string): boolean {
  if (!documentiValue || typeof documentiValue !== 'object') return false;
  return Object.values(documentiValue as Record<string, unknown>).some(entry => {
    const meta = (entry as DocumentiEntry | undefined)?.meta;
    return meta?.originalname === fileName;
  });
}

// Returns the single {uuid: entry} pair whose meta.originalname matches, or
// null — used both to recover a replay's existing entry and to pull the one
// real entry GHL just created after a (reliable) single-file upload.
export function extractEntryByFileName(documentiValue: unknown, fileName: string): DocumentiMap | null {
  if (!documentiValue || typeof documentiValue !== 'object') return null;
  for (const [key, entry] of Object.entries(documentiValue as Record<string, unknown>)) {
    const typed = entry as DocumentiEntry | undefined;
    if (typed?.meta?.originalname === fileName) {
      return { [key]: typed };
    }
  }
  return null;
}
