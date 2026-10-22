import { test } from 'node:test';
import assert from 'node:assert/strict';
import { t } from '../../../src/i18n/t.js';
import { withLanguage, SUPPORTED_LANGUAGES } from '../language.js';
import { buildDossierEmailContent } from '../submission.js';
import { generateDossierPdf } from '../pdfGeneration.js';
import { buildLuxosaTestResult, type Answers } from '../../../src/lib/luxosaTest/result.js';

const ANSWERS: Answers = {
  d1: 'd1_mossi', d2: ['d2_fragili', 'd2_secchi'], d3: 'd3_colore', d4c: 'd4c_tinta', d5c: ['d5c_luminoso'],
  d6c: 'd6c_normale', d7c: 'd7c_luminosita', d8: 'd8_2_3', d9: 'd9_ci_lavoro',
};

test('withLanguage: concurrent requests never see each other\'s language', async () => {
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const results = await Promise.all(
    SUPPORTED_LANGUAGES.flatMap(language => [0, 1, 2].map(() =>
      withLanguage(language, async () => {
        await wait(Math.random() * 10);
        const first = t('report:email.subject');
        await wait(Math.random() * 10);
        return { language, same: first === t('report:email.subject'), text: first };
      }),
    )),
  );
  assert.ok(results.every(r => r.same));
  for (const language of SUPPORTED_LANGUAGES) {
    const texts = new Set(results.filter(r => r.language === language).map(r => r.text));
    assert.equal(texts.size, 1, `${language}: mixed languages`);
  }
});

test('email: written in the client language, Italian note only for non-Italian', () => {
  const italian = buildDossierEmailContent('Giulia', 'ColorLux', 'it');
  const english = buildDossierEmailContent('Emma', 'ColorLux', 'en');
  assert.notEqual(italian.subject, english.subject);
  assert.equal(english.html.split('<p>').length, italian.html.split('<p>').length + 1, 'non-Italian adds the Italian note paragraph');
  assert.equal(buildDossierEmailContent('Giulia', 'ColorLux', 'xx').subject, italian.subject, 'unknown language falls back to Italian');
});

test('email: client-supplied name is HTML-escaped', () => {
  const { html } = buildDossierEmailContent('<script>alert("x")</script>', 'Color<b>', 'en');
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('Color<b>'));
  assert.ok(html.includes('&lt;script&gt;'));
});

for (const language of SUPPORTED_LANGUAGES) {
  test(`PDF ${language}: generated without fallback`, async () => {
    const answers = { ...ANSWERS, d10: 'Test.' };
    const result = buildLuxosaTestResult(answers);
    const name = language === 'ja' ? { nome: '花子', cognome: '山田' } : { nome: 'Anna', cognome: 'Test' };
    const { buffer, usedFallback } = await generateDossierPdf(
      result,
      { ...name, email: 'test@example.com', whatsapp: '+390000000000' },
      new Date('2026-10-23T10:00:00Z'),
      { language, answers },
    );
    assert.equal(usedFallback, false);
    assert.equal(buffer.subarray(0, 4).toString(), '%PDF');
    assert.ok(buffer.length > 50_000);
  });
}
