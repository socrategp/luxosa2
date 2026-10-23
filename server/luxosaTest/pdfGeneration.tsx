// Server-authoritative PDF generation. Reuses the existing renderer
// (server/luxosaTest/pdf.tsx) and media registry — no new PDF layout code.
// Falls back to a text-only dossier (empty media pool) if rendering with
// hero images fails for any reason, so an unreliable image never blocks the
// transaction (per the "go-live must not depend on the Media Library"
// requirement).

import { renderToBuffer } from '@react-pdf/renderer';
import { LuxosaTestDossier, LINE_BREAK_OPPORTUNITY, type DossierSection } from './pdf.js';
import { buildDossierLabels } from './pdfLabels.js';
import { withLanguage, isSupportedLanguage, DEFAULT_LANGUAGE } from './language.js';
import { resolveMediaForResult } from '../../src/lib/luxosaTest/media.js';
import { buildLuxosaTestResult, type Answers, type LuxosaTestResult } from '../../src/lib/luxosaTest/result.js';

import { MAISON_COPY_BANNER } from '../../src/lib/luxosaTest/maisonCopy.js';

export interface DossierOptions {
  // The client's language and answers: when the language is not Italian the PDF
  // carries that language first and the Italian copy the Maison reads second.
  language?: string;
  answers?: Answers;
}

// Japanese has no spaces, so the renderer finds no place to wrap a line. Mark
// invisible break opportunities (rendered by pdf.tsx, nothing is printed): after
// sentence punctuation, and between two Japanese characters every few
// characters — never where Japanese typesetting forbids it (no closing
// punctuation or small kana at the start of a line, no opening bracket at its end).
const MAX_UNBROKEN_RUN = 14;
const JAPANESE_CHAR = /[　-ヿ㐀-䶿一-鿿＀-￯]/;
const BREAK_AFTER = /[、。，！？]/;
const NO_LINE_START = /[、。，．！？）」』】〕・ーぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮヵヶ：；]/;
const NO_LINE_END = /[（「『【〔]/;

function markJapaneseBreaks(text: string): string {
  let out = '';
  let sinceBreak = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];
    out += char;
    sinceBreak = /\s/.test(char) ? 0 : sinceBreak + 1;
    if (!next || /\s/.test(next) || NO_LINE_START.test(next) || NO_LINE_END.test(char)) continue;
    const afterPunctuation = BREAK_AFTER.test(char);
    const longRun = sinceBreak >= MAX_UNBROKEN_RUN && JAPANESE_CHAR.test(char) && JAPANESE_CHAR.test(next);
    if (afterPunctuation || longRun) {
      out += LINE_BREAK_OPPORTUNITY;
      sinceBreak = 0;
    }
  }
  return out;
}

function allowBreaksAfterPunctuation<T>(value: T): T {
  if (typeof value === 'string') return markJapaneseBreaks(value) as T;
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
