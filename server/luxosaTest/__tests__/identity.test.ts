import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decideIdentity } from '../identity';
import type { GhlContact } from '../ghlClient';

const EMAIL = 'cliente@example.com';
const PHONE_E164 = '+393501961535';

function contact(id: string, email?: string, phone?: string): GhlContact {
  return { id, locationId: 'loc1', email, phone };
}

test('no_match: neither email nor phone resolve to any Contact', () => {
  const result = decideIdentity([], [], EMAIL, PHONE_E164);
  assert.equal(result.kind, 'no_match');
});

test('single_match: same Contact found by both email and phone', () => {
  const c = contact('contact_1', EMAIL, PHONE_E164);
  const result = decideIdentity([c], [c], EMAIL, PHONE_E164);
  assert.equal(result.kind, 'single_match');
  if (result.kind === 'single_match') {
    assert.equal(result.contactId, 'contact_1');
    assert.deepEqual(result.matchedBy.sort(), ['email', 'phone']);
  }
});

test('single_match: found by email only (phone absent/different on record)', () => {
  const c = contact('contact_1', EMAIL, undefined);
  const result = decideIdentity([c], [], EMAIL, PHONE_E164);
  assert.equal(result.kind, 'single_match');
  if (result.kind === 'single_match') {
    assert.equal(result.contactId, 'contact_1');
    assert.deepEqual(result.matchedBy, ['email']);
  }
});

test('single_match: found by phone only', () => {
  const c = contact('contact_1', 'other@example.com', PHONE_E164);
  const result = decideIdentity([], [c], EMAIL, PHONE_E164);
  assert.equal(result.kind, 'single_match');
  if (result.kind === 'single_match') {
    assert.equal(result.contactId, 'contact_1');
    assert.deepEqual(result.matchedBy, ['phone']);
  }
});

test('identity conflict simulato: email and phone resolve to two different Contacts -> conflict, no merge', () => {
  const byEmail = contact('contact_email', EMAIL, '+390000000001');
  const byPhone = contact('contact_phone', 'different@example.com', PHONE_E164);
  const result = decideIdentity([byEmail], [byPhone], EMAIL, PHONE_E164);
  assert.equal(result.kind, 'conflict');
  if (result.kind === 'conflict') {
    assert.equal(result.emailContactId, 'contact_email');
    assert.equal(result.phoneContactId, 'contact_phone');
  }
});

test('ambiguous: more than one exact match for the same identifier is never silently picked', () => {
  const c1 = contact('contact_1', EMAIL, PHONE_E164);
  const c2 = contact('contact_2', EMAIL, PHONE_E164);
  const result = decideIdentity([c1, c2], [], EMAIL, PHONE_E164);
  assert.equal(result.kind, 'ambiguous');
});

test('fuzzy search noise is filtered: a loosely-matched contact that does not exactly equal the identifier is ignored', () => {
  const noise = contact('contact_noise', 'totally-different@example.com', '+390000000000');
  const result = decideIdentity([noise], [noise], EMAIL, PHONE_E164);
  assert.equal(result.kind, 'no_match');
});
