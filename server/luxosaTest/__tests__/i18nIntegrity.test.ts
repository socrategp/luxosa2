import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

// Guards the locale files against the corruption found in October 2026: accented
// letters / dashes / whole words that were silently replaced by a literal "?".

const LOCALES_DIR = path.join(process.cwd(), 'src/i18n/locales');

// Only folders that actually hold translations (an empty folder is not a language).
function localeDirs(): string[] {
  return readdirSync(LOCALES_DIR).filter(entry => {
    const dir = path.join(LOCALES_DIR, entry);
    return statSync(dir).isDirectory() && readdirSync(dir).some(f => f.endsWith('.json'));
  });
}

type Flat = Record<string, string>;

function flatten(node: unknown, prefix = '', out: Flat = {}): Flat {
  if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) flatten(value, `${prefix}${key}.`, out);
  } else if (typeof node === 'string') {
    out[prefix.slice(0, -1)] = node;
  }
  return out;
}

function loadLocale(lang: string): Record<string, Flat> {
  const dir = path.join(LOCALES_DIR, lang);
  const files = readdirSync(dir).filter(f => f.endsWith('.json'));
  return Object.fromEntries(files.map(f => [f.replace('.json', ''), flatten(JSON.parse(readFileSync(path.join(dir, f), 'utf8')))]));
}

// A "?" is legitimate only when it closes a question: end of the string, or
// directly after a word and followed by a space + capital letter / quote.
// French typography puts a space before "?" ("que dire ? Je regarde"), allowed
// only when a capital letter follows.
function suspiciousQuestionMark(text: string, lang: string): boolean {
  if (/\?\?/.test(text) || /\d\?$/.test(text)) return true;
  return [...text.matchAll(/\?/g)].some(match => {
    const index = match.index ?? 0;
    const next = text.slice(index + 1);
    const prev = text[index - 1] ?? '';
    if (/^\s*$/.test(next)) return false;
    if (/^\s+["«“'(¿¡A-ZÀ-ÝА-Я]/.test(next) && /\S/.test(prev) && prev !== ' ') return false;
    if (/^[”»"']/.test(next)) return false;
    if (lang === 'fr' && prev === ' ' && /^\s+[A-ZÀ-Ý]/.test(next)) return false;
    return true;
  });
}

test('locale files: no "?" standing in for an accented letter, a dash or a lost word', () => {
  const offenders: string[] = [];
  for (const lang of localeDirs()) {
    for (const [namespace, strings] of Object.entries(loadLocale(lang))) {
      for (const [key, value] of Object.entries(strings)) {
        if (suspiciousQuestionMark(value, lang)) offenders.push(`${lang}/${namespace} ${key}: ${value.slice(0, 80)}`);
      }
    }
  }
  assert.deepEqual(offenders, [], `suspicious "?" found:\n${offenders.join('\n')}`);
});

const SOURCE_LANG = 'it';
const OTHER_LANGS = localeDirs().filter(lang => lang !== SOURCE_LANG);

function namespaces(): string[] {
  return Object.keys(loadLocale(SOURCE_LANG));
}

function placeholders(text: string): string {
  return [...text.matchAll(/\{\{\s*([^}\s]+)\s*\}\}/g)].map(m => m[1]).sort().join(',');
}

test('locales: every language has exactly the same keys as the Italian source', () => {
  const problems: string[] = [];
  for (const namespace of namespaces()) {
    const source = loadLocale(SOURCE_LANG)[namespace];
    for (const lang of OTHER_LANGS) {
      const target = loadLocale(lang)[namespace];
      if (!target) { problems.push(`${lang}/${namespace}: file missing`); continue; }
      for (const key of Object.keys(source)) if (!(key in target)) problems.push(`${lang}/${namespace}: missing ${key}`);
      for (const key of Object.keys(target)) if (!(key in source)) problems.push(`${lang}/${namespace}: extra ${key}`);
    }
  }
  assert.deepEqual(problems, [], problems.join('\n'));
});

test('locales: interpolation placeholders match the Italian source in every language', () => {
  const problems: string[] = [];
  for (const namespace of namespaces()) {
    const source = loadLocale(SOURCE_LANG)[namespace];
    for (const lang of OTHER_LANGS) {
      const target = loadLocale(lang)[namespace] ?? {};
      for (const [key, value] of Object.entries(source)) {
        if (key in target && placeholders(value) !== placeholders(target[key])) {
          problems.push(`${lang}/${namespace} ${key}: [${placeholders(value)}] vs [${placeholders(target[key])}]`);
        }
      }
    }
  }
  assert.deepEqual(problems, [], problems.join('\n'));
});

// Proper names and formulas that must stay identical in every language (brand glossary).
const NEVER_TRANSLATED = new Set([
  'Area Benessere', 'Cheratina Nutrizione Pro', 'PiegaLux', 'Taglio Signature', 'Nuances', 'RicciOsa', 'RicciOso',
  'Messina Cavour', 'Luxosa Test', 'Luxosa', 'privacy@luxosa.it', 'Privacy Policy', 'Email: {{email}}', 'WhatsApp: {{whatsapp}}',
  'Luxosa Test — {{name}}', '— Luxosa', 'Luce Signature', 'Consulenze Specialistiche',
  // Genuine cognates: the same correct word in Spanish.
  'IMPORTANTE:', 'Importante',
]);

test('Luxosa Test namespaces: nothing is left in Italian in the other languages (except brand names)', () => {
  const offenders: string[] = [];
  for (const namespace of ['test', 'report']) {
    const source = loadLocale(SOURCE_LANG)[namespace];
    for (const lang of OTHER_LANGS) {
      const target = loadLocale(lang)[namespace] ?? {};
      for (const [key, value] of Object.entries(source)) {
        if (target[key] !== value || NEVER_TRANSLATED.has(value)) continue;
        const words = value.replace(/\{\{[^}]*\}\}/g, '').match(/[A-Za-zÀ-ÿ]{4,}/g);
        if (words) offenders.push(`${lang}/${namespace} ${key}: ${value.slice(0, 70)}`);
      }
    }
  }
  assert.deepEqual(offenders, [], `untranslated strings:\n${offenders.join('\n')}`);
});

test('locales: no CSS class names mistaken for text', () => {
  const offenders: string[] = [];
  for (const lang of localeDirs()) {
    for (const [namespace, strings] of Object.entries(loadLocale(lang))) {
      for (const [key, value] of Object.entries(strings)) {
        if (/\b(bg-|border-|group-hover|hover:|cursor-pointer|translate-|transition-)/.test(value)) offenders.push(`${lang}/${namespace} ${key}: ${value}`);
      }
    }
  }
  assert.deepEqual(offenders, []);
});

const ITALIAN_STOPWORDS = /\b(il|lo|la|le|gli|di|del|della|per|con|che|non|una|tuo|tua|tuoi|tue|ti|è|sono|questo|alla|nel|nella|dei|delle|più|come|ogni|anche|oppure|quando)\b/gi;

test('new Luxosa Test component: no fixed Italian text outside the translation system', () => {
  const source = readFileSync(path.join(process.cwd(), 'src/components/DiagnosticTakeoverTest.tsx'), 'utf8');
  const offenders: string[] = [];
  source.split('\n').forEach((line, index) => {
    if (/^\s*(\/\/|\*|\/\*|import)/.test(line)) return;
    const visible = line
      .replace(/className=("[^"]*"|\{`[^`]*`\})/g, '')
      .replace(/t\('[^']*'(?:,[^)]*)?\)/g, '')
      .replace(/\/\/.*$/, '');
    const hits = visible.match(ITALIAN_STOPWORDS)?.length ?? 0;
    if (hits >= 2 && /["'>`][^"'<>`]{12,}/.test(visible)) offenders.push(`${index + 1}: ${line.trim().slice(0, 100)}`);
  });
  assert.deepEqual(offenders, [], `hardcoded Italian text:\n${offenders.join('\n')}`);
});

test('question-mark detector: flags the known corruption patterns and spares real questions', () => {
  assert.equal(suspiciousQuestionMark('Degrad? e altri', 'it'), true);
  assert.equal(suspiciousQuestionMark('Schiariture ? Airtouch', 'it'), true);
  assert.equal(suspiciousQuestionMark('39 a?os', 'es'), true);
  assert.equal(suspiciousQuestionMark('39 ???', 'ru'), true);
  assert.equal(suspiciousQuestionMark('2?', 'ja'), true);
  assert.equal(suspiciousQuestionMark('Quanto tempo dedichi ai capelli ogni mattina?', 'it'), false);
  assert.equal(suspiciousQuestionMark('Che cosa vuoi ottenere? Raccontacelo.', 'it'), false);
  assert.equal(suspiciousQuestionMark('que dire ? Je regarde mes cheveux', 'fr'), false);
});
