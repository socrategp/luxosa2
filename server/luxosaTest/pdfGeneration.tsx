// Server-authoritative PDF generation. Reuses the existing renderer
// (server/luxosaTest/pdf.tsx) and media registry — no new PDF layout code.
// Falls back to a text-only dossier (empty media pool) if rendering with
// hero images fails for any reason, so an unreliable image never blocks the
// transaction (per the "go-live must not depend on the Media Library"
// requirement).

import { renderToBuffer } from '@react-pdf/renderer';
import { LuxosaTestDossier } from './pdf.js';
import { resolveMediaForResult } from '../../src/lib/luxosaTest/media.js';
import type { LuxosaTestResult } from '../../src/lib/luxosaTest/result.js';

export interface DossierContact {
  nome: string;
  cognome: string;
  email: string;
  whatsapp: string;
}

function sanitizeNamePart(raw: string): string {
  return raw.trim().replace(/\s+/g, '').replace(/[^\p{L}\p{N}]/gu, '') || 'Cliente';
}

// submissionId (not just name+date) determines the filename so that two
// DIFFERENT submissions from the same person on the same day never collide
// — idempotency is governed by submissionId, a same-day duplicate-name
// collision must never be mistaken for a replay. A retry/replay of the SAME
// submissionId still produces the SAME filename (harmless: the ledger's own
// claim already short-circuits replays before a second PDF is ever built).
export function buildDossierFileName(firstName: string, lastName: string, submittedAt: Date, submissionId: string): string {
  const yyyy = submittedAt.getUTCFullYear();
  const mm = String(submittedAt.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(submittedAt.getUTCDate()).padStart(2, '0');
  const submissionIdShort = submissionId.slice(0, 8);
  return `Luxosa_Test_${sanitizeNamePart(firstName)}_${sanitizeNamePart(lastName)}_${yyyy}-${mm}-${dd}_${submissionIdShort}.pdf`;
}

export async function generateDossierPdf(
  result: LuxosaTestResult,
  contact: DossierContact,
  submittedAt: Date,
): Promise<{ buffer: Buffer; usedFallback: boolean }> {
  try {
    const media = resolveMediaForResult(result, {}, 'pdf');
    const buffer = await renderToBuffer(
      <LuxosaTestDossier result={result} contact={contact} submittedAt={submittedAt} media={media} />,
    );
    return { buffer, usedFallback: false };
  } catch (err) {
    console.warn('[luxosa-test] PDF with media failed, falling back to text-only dossier:', err);
    const emptyMedia = resolveMediaForResult(result, { media: [] }, 'pdf');
    const buffer = await renderToBuffer(
      <LuxosaTestDossier result={result} contact={contact} submittedAt={submittedAt} media={emptyMedia} />,
    );
    return { buffer, usedFallback: true };
  }
}
