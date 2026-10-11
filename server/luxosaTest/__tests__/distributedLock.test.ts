// distributedLock tests — an in-memory fake stands in for Redis (SET NX PX
// + Lua check-and-del via eval), so acquire/release/timeout/expiry/owner
// semantics are verified deterministically without real network access.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { acquireLock, releaseLock } from '../distributedLock';
import { createFakeLockClient } from './fakes/fakeLockClient';

test('acquireLock: succeeds immediately when the key is free', async () => {
  const client = createFakeLockClient();
  const result = await acquireLock('k1', { client, maxWaitMs: 0 });
  assert.equal(result.acquired, true);
  assert.ok(result.token);
});

test('acquireLock: a second attempt on an already-held lock fails explicitly after the timeout (no deadlock)', async () => {
  const client = createFakeLockClient();
  await acquireLock('k2', { client, ttlMs: 10_000 });
  const start = Date.now();
  const second = await acquireLock('k2', { client, maxWaitMs: 200 });
  const elapsed = Date.now() - start;
  assert.equal(second.acquired, false);
  assert.equal(second.token, null);
  assert.ok(elapsed >= 190, `expected to actually wait out the timeout, elapsed=${elapsed}ms`);
});

test("acquireLock: a contender succeeds once the holder's TTL has expired", async () => {
  const client = createFakeLockClient();
  await acquireLock('k3', { client, ttlMs: 150 });
  const second = await acquireLock('k3', { client, ttlMs: 10_000, maxWaitMs: 1000 });
  assert.equal(second.acquired, true);
});

test('releaseLock: releases only when the token matches the current holder', async () => {
  const client = createFakeLockClient();
  const first = await acquireLock('k4', { client });
  const releasedWithWrongToken = await releaseLock('k4', 'not-the-real-token', { client });
  assert.equal(releasedWithWrongToken, false);

  const stillHeld = await acquireLock('k4', { client, maxWaitMs: 0 });
  assert.equal(stillHeld.acquired, false, 'lock must still be held after a mismatched release attempt');

  const releasedCorrectly = await releaseLock('k4', first.token!, { client });
  assert.equal(releasedCorrectly, true);

  const nowFree = await acquireLock('k4', { client, maxWaitMs: 0 });
  assert.equal(nowFree.acquired, true, 'lock must be free after the real owner releases it');
});

test("releaseLock: a mismatched token never deletes another execution's lock (no-op, not an error)", async () => {
  const client = createFakeLockClient();
  await acquireLock('k5', { client });
  const intruderResult = await releaseLock('k5', 'intruder-token', { client });
  assert.equal(intruderResult, false);
  const check = await acquireLock('k5', { client, maxWaitMs: 0 });
  assert.equal(check.acquired, false, "the real owner's lock must remain held");
});

test('acquireLock: two different keys never contend with each other', async () => {
  const client = createFakeLockClient();
  const a = await acquireLock('key-a', { client, maxWaitMs: 0 });
  const b = await acquireLock('key-b', { client, maxWaitMs: 0 });
  assert.equal(a.acquired, true);
  assert.equal(b.acquired, true);
});
