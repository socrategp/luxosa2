import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildLuxosaTestResult, buildQuestionSequence, type Answers } from '../../../src/lib/luxosaTest/result.js';
import { t } from '../../../src/i18n/t.js';

const D3_BRANCHES = ['d3_cute', 'd3_rovinato', 'd3_colore', 'd3_forma', 'd3_tutto'] as const;
const D2_OPTIONS = ['d2_fragili', 'd2_crespi', 'd2_sottili', 'd2_grassi', 'd2_secchi', 'd2_sani'] as const;

// Every valid D2 answer: one or two of the six options (maxSelections = 2).
const D2_COMBOS: string[][] = [];
for (let i = 0; i < D2_OPTIONS.length; i++) {
  D2_COMBOS.push([D2_OPTIONS[i]]);
  for (let j = i + 1; j < D2_OPTIONS.length; j++) D2_COMBOS.push([D2_OPTIONS[i], D2_OPTIONS[j]]);
}

function baseAnswers(d3: string): Answers {
  const answers: Answers = {};
  for (const q of buildQuestionSequence(d3).filter(question => question.id !== 'd10')) {
    answers[q.id] = q.selectionType === 'multi' ? [q.options[0].id] : q.options[0].id;
  }
  answers.d3 = d3;
  return answers;
}

const D2_LABEL_KEYS: Record<string, string> = {
  d2_fragili: 'report:diagnostic.003',
  d2_crespi: 'report:diagnostic.004',
  d2_sottili: 'report:diagnostic.005',
  d2_grassi: 'report:diagnostic.006',
  d2_secchi: 'report:diagnostic.007',
  d2_sani: 'report:diagnostic.008',
};

test('D2: the valid combinations number exactly 21', () => {
  assert.equal(D2_COMBOS.length, 21);
});

test('Condizione di partenza: every D2 combination in every branch is complete and well formed', () => {
  for (const d3 of D3_BRANCHES) {
    for (const combo of D2_COMBOS) {
      const { conditionSummary } = buildLuxosaTestResult({ ...baseAnswers(d3), d2: combo });
      const where = `${d3} / ${combo.join('+')}`;
      assert.ok(conditionSummary.startsWith('Descrivi i tuoi capelli come '), `${where}: opening sentence — ${conditionSummary}`);
      assert.ok(!conditionSummary.includes('?'), `${where}: stray "?" — ${conditionSummary}`);
      assert.ok(!conditionSummary.includes('{{'), `${where}: unresolved placeholder — ${conditionSummary}`);
      assert.ok(!/\s{2,}|\s[.,;]/.test(conditionSummary), `${where}: spacing — ${conditionSummary}`);
      assert.ok(conditionSummary.endsWith('.'), `${where}: ends with a full stop — ${conditionSummary}`);
      for (const option of combo) {
        // every descriptor the client picked must show up (compound labels contribute their first fragment)
        const firstFragment = t(D2_LABEL_KEYS[option]).split(',')[0].trim();
        assert.ok(conditionSummary.includes(firstFragment), `${where}: missing "${firstFragment}" — ${conditionSummary}`);
      }
    }
  }
});

test('Ramo forma: D5d (tempo al mattino) is reported as time, never as a judgement on volume', () => {
  const expected: Record<string, string> = {
    d5d_poco: 'Al mattino dedichi ai capelli meno di 5 minuti.',
    d5d_medio: 'Al mattino dedichi ai capelli tra 5 e 15 minuti.',
    d5d_molto: 'Al mattino dedichi ai capelli più di 15 minuti.',
    d5d_troppo: 'Al mattino dedichi ai capelli più tempo di quanto vorresti.',
  };
  for (const [d5d, sentence] of Object.entries(expected)) {
    const { conditionSummary } = buildLuxosaTestResult({ ...baseAnswers('d3_forma'), d5d });
    assert.ok(conditionSummary.includes(sentence), `${d5d}: expected "${sentence}" in — ${conditionSummary}`);
    assert.ok(!/volume attuale|risulta/i.test(conditionSummary), `${d5d}: volume judgement leaked — ${conditionSummary}`);
    assert.ok(!conditionSummary.includes('?'), `${d5d}: stray "?" — ${conditionSummary}`);
  }
});

test('Ramo forma: the needs sentence stands alone and ends cleanly', () => {
  const { conditionSummary } = buildLuxosaTestResult({ ...baseAnswers('d3_forma'), d4d: ['d4d_piega'], d5d: 'd5d_medio' });
  assert.match(conditionSummary, /Le esigenze principali riguardano [^.?]+\. Al mattino dedichi ai capelli tra 5 e 15 minuti\./);
});

test('Ramo forma: D5d does not change the attention level or the public percorso', () => {
  const results = ['d5d_poco', 'd5d_medio', 'd5d_molto'].map(d5d => buildLuxosaTestResult({ ...baseAnswers('d3_forma'), d5d }));
  assert.equal(new Set(results.map(r => r.attentionLevel)).size, 1);
  assert.equal(new Set(results.map(r => r.percorsoPublic)).size, 1);
});
