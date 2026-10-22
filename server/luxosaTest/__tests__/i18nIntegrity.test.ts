import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

// Guards the locale files against the corruption found in October 2026: accented
// letters / dashes / whole words that were silently replaced by a literal "?".

const LOCALES_DIR = path.join(process.cwd(), 'src/i18n/locales');

function localeDirs(): string[] {
  return readdirSync(LOCALES_DIR).filter(entry => statSync(path.join(LOCALES_DIR, entry)).isDirectory());
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
