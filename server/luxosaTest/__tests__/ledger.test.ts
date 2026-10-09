import { test } from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryLedger } from '../ledger';

test('claim: first claim for a submissionId succeeds and creates a RECEIVED entry', async () => {
  const ledger = new InMemoryLedger();
  const result = await ledger.claim('sub_a', 'contact_1');
  assert.equal(result.claimed, true);
  assert.equal(result.existing, null);
  const entry = await ledger.get('sub_a');
  assert.equal(entry?.status, 'RECEIVED');
  assert.equal(entry?.contactId, 'contact_1');
});

test('doppio click stesso submissionId: a second claim for the same id is rejected without creating a duplicate', async () => {
  const ledger = new InMemoryLedger();
  const first = await ledger.claim('sub_b', 'contact_1');
  const second = await ledger.claim('sub_b', 'contact_1');
  assert.equal(first.claimed, true);
  assert.equal(second.claimed, false);
  assert.equal(second.existing?.submissionId, 'sub_b');
});

test('concurrent double-click: exactly one of two simultaneous claims for the same id wins', async () => {
  const ledger = new InMemoryLedger();
  const [a, b] = await Promise.all([ledger.claim('sub_c', 'contact_1'), ledger.claim('sub_c', 'contact_1')]);
  const claimedCount = [a, b].filter(r => r.claimed).length;
  assert.equal(claimedCount, 1);
});

test('replay submission: a completed entry is returned as-is by get(), not recomputed', async () => {
  const ledger = new InMemoryLedger();
  await ledger.claim('sub_d', 'contact_1');
  await ledger.update('sub_d', { status: 'COMPLETED' });
  const replay = await ledger.claim('sub_d', 'contact_1');
  assert.equal(replay.claimed, false);
  assert.equal(replay.existing?.status, 'COMPLETED');
});

test('update preserves fields not included in the patch', async () => {
  const ledger = new InMemoryLedger();
  await ledger.claim('sub_e', 'contact_1');
  await ledger.update('sub_e', { previousUltimaData: '2026-01-01' });
  const afterSecondUpdate = await ledger.update('sub_e', { status: 'PDF_READY' });
  assert.equal(afterSecondUpdate.previousUltimaData, '2026-01-01');
  assert.equal(afterSecondUpdate.status, 'PDF_READY');
});

test('get() on an unknown submissionId returns null', async () => {
  const ledger = new InMemoryLedger();
  const entry = await ledger.get('never_claimed');
  assert.equal(entry, null);
});
