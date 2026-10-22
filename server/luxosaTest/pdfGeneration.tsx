// Server-authoritative PDF generation. Reuses the existing renderer
// (server/luxosaTest/pdf.tsx) and media registry — no new PDF layout code.
// Falls back to a text-only dossier (empty media pool) if rendering with
// hero images fails for any reason, so an unreliable image never blocks the
// transaction (per the "go-live must not depend on the Media Library"
// requirement).

import { renderToBuffer } from '@react-pdf/renderer';
import { LuxosaTestDossier, type DossierSection } from './pdf.js';
import { buildDossierLabels } from './pdfLabels.js';
import { withLanguage, isSupportedLanguage, DEFAULT_LANGUAGE } from './language.js';
import { resolveMediaForResult } from '../../src/lib/luxosaTest/media.js';
import { buildLuxosaTestResult, type Answers, type LuxosaTestResult } from '../../src/lib/luxosaTest/result.js';

// Printed on the Italian section when the dossier also carries the client's language.
const MAISON_COPY_BANNER = 'Versione italiana per la Maison';

export interface DossierOptions {
  // The client's language and answers: when the language is not Italian the PDF
  // carries that language first and the Italian copy the Maison reads second.
  language?: string;
  answers?: Answers;
}

// Japanese has no spaces, so the renderer would have to chop a long line in the
// middle of a clause and add a hyphen. A normal space after the sentence
// punctuation (and a safety space inside any very long unbroken run) gives it
// clean break points between clauses instead.
const MAX_UNBROKEN_RUN = 36;
const LONG_RUN = new RegExp('\\S{' + (MAX_UNBROKEN_RUN + 1) + ',}', 'g');
const RUN_CHUNK = new RegExp('(\\S{' + MAX_UNBROKEN_RUN + '})', 'g');

function allowBreaksAfterPunctuation<T>(value: T): T {
  if (typeof value === 'string') {
    return value
      .replace(/([、。，！？])(?!\s)/g, '$1 ')
      .replace(LONG_RUN, run => run.replace(RUN_CHUNK, '$1 ')) as T;
  }
  if (Array.isArray(value)) return value.map(allowBreaksAfterPunctuation) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, allowBreaksAfterPunctuation(v)])) as T;
  }
  return value;
}

function buildSections(result: LuxosaTestResult, contact: DossierContact, submittedAt: Date, options: DossierOptions): DossierSection[] {
  const fullName = `${contact.nome} ${contact.cognome}`.trim();
  const language = isSupportedLanguage(options.language) ? options.language : DEFAULT_LANGUAGE;
  const sections: DossierSection[] = [];
  if (language !== DEFAULT_LANGUAGE && options.answers) {
    const clientResult = withLanguage(language, () => buildLuxosaTestResult(options.answers as Answers));
    const clientLabels = withLanguage(language, () => buildDossierLabels(language, fullName, submittedAt));
    const isJapanese = language === 'ja';
    sections.push({
      language,
      result: isJapanese ? allowBreaksAfterPunctuation(clientResult) : clientResult,
      labels: isJapanese ? allowBreaksAfterPunctuation(clientLabels) : clientLabels,
    });
  }
  sections.push({
    language: DEFAULT_LANGUAGE,
    result,
    labels: withLanguage(DEFAULT_LANGUAGE, () => buildDossierLabels(DEFAULT_LANGUAGE, fullName, submittedAt)),
    banner: sections.length > 0 ? MAISON_COPY_BANNER : undefined,
  });
  return sections;
}

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
  options: DossierOptions = {},
): Promise<{ buffer: Buffer; usedFallback: boolean }> {
  const sections = buildSections(result, contact, submittedAt, options);
  try {
    const media = resolveMediaForResult(result, {}, 'pdf');
    const buffer = await renderToBuffer(
      <LuxosaTestDossier sections={sections} contact={contact} submittedAt={submittedAt} media={media} />,
    );
    return { buffer, usedFallback: false };
  } catch (err) {
    console.warn('[luxosa-test] PDF with media failed, falling back to text-only dossier:', err);
    const emptyMedia = resolveMediaForResult(result, { media: [] }, 'pdf');
    const buffer = await renderToBuffer(
      <LuxosaTestDossier sections={sections} contact={contact} submittedAt={submittedAt} media={emptyMedia} />,
    );
    return { buffer, usedFallback: true };
  }
}
