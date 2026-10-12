// Small, pure helpers for reading/matching GHL Contact customFields values.
// Shared by submission.ts (FIELD_ULTIMA_DATA) and documentsArchive.ts
// (FIELD_DOCUMENTI) — no I/O, no GHL client calls.

export type DocumentiEntry = { meta?: { originalname?: string; deleted?: boolean }; url?: string; documentId?: string };
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

// GHL's own "delete" action on a Documenti entry is a soft delete: the
// entry stays in the field's value with meta.deleted === true rather than
// being removed. Counting it toward the archive cap would make a Contact
// that looks empty in the GHL dashboard still silently block new uploads
// — confirmed empirically against the real sandbox. Entries with no
// `meta.deleted` property (the common case) are active by default.
export function countActiveDocumenti(documentiMap: DocumentiMap): number {
  return Object.values(documentiMap).filter(entry => entry.meta?.deleted !== true).length;
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
