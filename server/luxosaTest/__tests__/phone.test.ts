import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizePhoneToE164 } from '../phone';

test('bare national number is normalized with +39 (default country IT)', () => {
  const result = normalizePhoneToE164('350 196 1535');
  assert.equal(result?.e164, '+393501961535');
  assert.equal(result?.country, 'IT');
});

test('already-E.164 number with +39 is preserved', () => {
  const result = normalizePhoneToE164('+393501961535');
  assert.equal(result?.e164, '+393501961535');
});

test('a foreign E.164 number is preserved with its own country', () => {
  const result = normalizePhoneToE164('+33 6 12 34 56 78');
  assert.equal(result?.country, 'FR');
});

test('empty string returns null', () => {
  assert.equal(normalizePhoneToE164(''), null);
  assert.equal(normalizePhoneToE164('   '), null);
});

test('garbage input returns null, not a throw', () => {
  assert.equal(normalizePhoneToE164('not a phone number'), null);
  assert.equal(normalizePhoneToE164('123'), null);
});
