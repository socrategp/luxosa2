// RedisLedger tests — the real Upstash client is swapped for an in-memory
// fake implementing the same GET/SET-NX/EX surface, so claim atomicity, TTL
// bookkeeping, and update-merge are verified without real network access.
// (Real Upstash connectivity itself was verified separately against the
// live sandbox instance — see the phase report.)

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RedisLedger } from '../ledger';
import { createFakeLedgerClient } from './fakes/fakeLedgerClient';

test('claim: first claim for a submissionId succeeds and creates a RECEIVED entry', async () => {
  const { client } = createFakeLedgerClient();
  const ledger = new RedisLedger(client);
  const result = await ledger.claim('sub1', 'contact1');
  assert.equal(result.claimed, true);
  assert.equal(result.existing, null);
  const entry = await ledger.get('sub1');
  assert.equal(entry?.status, 'RECEIVED');
  assert.equal(entry?.contactId, 'contact1');
});

test('claim: a second claim for the same submissionId is rejected, returns the existing entry', async () => {
  const { client } = createFakeLedgerClient();
  const ledger = new RedisLedger(client);
  await ledger.claim('sub2', 'contact2');
  await ledger.update('sub2', { status: 'VALIDATED' });
  const second = await ledger.claim('sub2', 'contact2');
  assert.equal(second.claimed, false);
  assert.equal(second.existing?.status, 'VALIDATED');
});

test('claim: concurrent claims for the same submissionId — exactly one wins (atomic SET NX, no lost-update race)', async () => {
  const { client } = createFakeLedgerClient();
  const ledger = new RedisLedger(client);
  const [a, b] = await Promise.all([ledger.claim('sub3', 'c'), ledger.claim('sub3', 'c')]);
  const claimedCount = [a, b].filter(r => r.claimed).length;
  assert.equal(claimedCount, 1, 'exactly one of two simultaneous claims must win');
});

test('get() on an unknown submissionId returns null', async () => {
  const { client } = createFakeLedgerClient();
  const ledger = new RedisLedger(client);
  assert.equal(await ledger.get('never-claimed'), null);
});

test('update() merges the patch and preserves fields not included in it', async () => {
  const { client } = createFakeLedgerClient();
  const ledger = new RedisLedger(client);
  await ledger.claim('sub4', 'contact4');
  const updated = await ledger.update('sub4', { status: 'VALIDATED', resultHash: 'abc123' });
  assert.equal(updated.status, 'VALIDATED');
  assert.equal(updated.resultHash, 'abc123');
  assert.equal(updated.contactId, 'contact4', 'fields not in the patch must survive untouched');
});

test('update() throws for an unknown submissionId rather than silently creating one', async () => {
  const { client } = createFakeLedgerClient();
  const ledger = new RedisLedger(client);
  await assert.rejects(() => ledger.update('ghost-id', { status: 'COMPLETED' }));
});

test('claim persists the entry with the configured 24h TTL (ex), not unbounded', async () => {
  const { client, store } = createFakeLedgerClient();
  const ledger = new RedisLedger(client);
  await ledger.claim('sub5', 'contact5');
  const raw = store.get('luxosa-test:ledger:sub5');
  assert.ok(raw, 'entry should be present in the backing store');
  assert.ok(raw!.expiresAt !== null, 'entry must have a TTL, not persist forever');
  const remainingMs = raw!.expiresAt! - Date.now();
  // 24h = 86_400_000ms — allow generous slack for test execution time.
  assert.ok(remainingMs > 86_000_000 && remainingMs <= 86_400_000, `expected ~24h TTL, got ${remainingMs}ms remaining`);
});

test('update() refreshes (slides) the TTL rather than letting it expire mid-pipeline', async () => {
  const { client, store } = createFakeLedgerClient();
  const ledger = new RedisLedger(client);
  await ledger.claim('sub6', 'contact6');
  const beforeUpdate = store.get('luxosa-test:ledger:sub6')!.expiresAt!;
  await new Promise(resolve => setTimeout(resolve, 20));
  await ledger.update('sub6', { status: 'VALIDATED' });
  const afterUpdate = store.get('luxosa-test:ledger:sub6')!.expiresAt!;
  assert.ok(afterUpdate > beforeUpdate, 'TTL should slide forward on update, not stay pinned to the original claim time');
});
