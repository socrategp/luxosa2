import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateSubmission } from '../submissionSchema';

const VALID_BASE = {
  submissionId: 'sub_1234567890',
  testVersion: 'v2.0',
  language: 'it',
  firstName: 'Maria',
  lastName: 'Rossi',
  email: 'maria.rossi@example.com',
  phone: '350 196 1535',
  privacyAcknowledged: true,
  marketingConsent: false,
  answers: {
    d1: 'd1_lisci',
    d2: ['d2_sani'],
    d3: 'd3_cute',
    d4a: ['d4a_prurito'],
    d5a: 'd5a_settimane',
    d6a: 'd6a_mai',
    d7a: 'd7a_no',
    d8: 'd8_settimana',
    d9: 'd9_amo',
  },
};

test('schema valido: accepts a well-formed payload and normalizes phone to E.164', () => {
  const result = validateSubmission(VALID_BASE);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.phoneE164, '+393501961535');
    assert.equal(result.data.email, 'maria.rossi@example.com');
  }
});

test('schema invalido: missing required field is rejected', () => {
  const { email: _email, ...withoutEmail } = VALID_BASE;
  const result = validateSubmission(withoutEmail);
  assert.equal(result.ok, false);
});

test('schema invalido: malformed email is rejected', () => {
  const result = validateSubmission({ ...VALID_BASE, email: 'not-an-email' });
  assert.equal(result.ok, false);
});

test('schema invalido: unparseable phone is rejected', () => {
  const result = validateSubmission({ ...VALID_BASE, phone: '123' });
  assert.equal(result.ok, false);
});

test('enum manipolato: unsupported testVersion is rejected (allowlist)', () => {
  const result = validateSubmission({ ...VALID_BASE, testVersion: 'v99.9' });
  assert.equal(result.ok, false);
});

test('enum manipolato: unsupported language is rejected (allowlist)', () => {
  const result = validateSubmission({ ...VALID_BASE, language: 'xx' });
  assert.equal(result.ok, false);
});

test('enum manipolato: unknown option id inside a real question is rejected', () => {
  const result = validateSubmission({
    ...VALID_BASE,
    answers: { ...VALID_BASE.answers, d1: 'd1_does_not_exist' },
  });
  assert.equal(result.ok, false);
});

test('rifiuta domande sconosciute: an answer key not in the real question bank is rejected', () => {
  const result = validateSubmission({
    ...VALID_BASE,
    answers: { ...VALID_BASE.answers, d99_fake: 'anything' },
  });
  assert.equal(result.ok, false);
});

test('rispetta maxSelections: a multi-select question with too many options is rejected', () => {
  // d2 has maxSelections=2 in the real question bank
  const result = validateSubmission({
    ...VALID_BASE,
    answers: { ...VALID_BASE.answers, d2: ['d2_fragili', 'd2_secchi', 'd2_grassi'] },
  });
  assert.equal(result.ok, false);
});

test('payload eccessivo: an oversized D10 free-text answer is rejected', () => {
  const result = validateSubmission({
    ...VALID_BASE,
    answers: { ...VALID_BASE.answers, d10: 'x'.repeat(10_000) },
  });
  assert.equal(result.ok, false);
});

test('payload eccessivo: an oversized firstName is rejected', () => {
  const result = validateSubmission({ ...VALID_BASE, firstName: 'x'.repeat(1000) });
  assert.equal(result.ok, false);
});

test('privacy obbligatoria assente: privacyAcknowledged=false is schema-valid (rejection happens at the orchestrator, not the schema)', () => {
  const result = validateSubmission({ ...VALID_BASE, privacyAcknowledged: false });
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.data.privacyAcknowledged, false);
});

test('marketingConsent true/false both pass schema validation unchanged', () => {
  const trueResult = validateSubmission({ ...VALID_BASE, marketingConsent: true });
  const falseResult = validateSubmission({ ...VALID_BASE, marketingConsent: false });
  assert.equal(trueResult.ok, true);
  assert.equal(falseResult.ok, true);
  if (trueResult.ok) assert.equal(trueResult.data.marketingConsent, true);
  if (falseResult.ok) assert.equal(falseResult.data.marketingConsent, false);
});

test('submissionId with unsafe characters is rejected (ledger-key safety)', () => {
  const result = validateSubmission({ ...VALID_BASE, submissionId: '../etc/passwd' });
  assert.equal(result.ok, false);
});
