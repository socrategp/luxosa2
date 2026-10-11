// distributedLock tests — an in-memory fake stands in for Redis (SET NX PX
// + Lua check-and-del via eval), so acquire/release/timeout/expiry/owner
// semantics are verified deterministically without real network access.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { acquireLock, releaseLock, startLockRenewal } from '../distributedLock';
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

test('startLockRenewal: a correct-owner renewal tick extends the TTL and keeps ownership', async () => {
  const client = createFakeLockClient();
  const lock = await acquireLock('r1', { client, ttlMs: 100 });
  assert.equal(lock.acquired, true);

  const renewal = startLockRenewal('r1', lock.token!, { client, ttlMs: 100, renewalIntervalMs: 30 });
  await new Promise(resolve => setTimeout(resolve, 80));
  assert.equal(renewal.hasOwnership(), true);

  renewal.stop();
  const released = await releaseLock('r1', lock.token!, { client });
  assert.equal(released, true);
});

test("startLockRenewal: a renewal attempt with the wrong token is a no-op (does not touch the real owner's lock)", async () => {
  const client = createFakeLockClient();
  const owner = await acquireLock('r2', { client, ttlMs: 5000 });
  assert.equal(owner.acquired, true);

  const impostorRenewal = startLockRenewal('r2', 'not-the-real-token', { client, ttlMs: 5000, renewalIntervalMs: 20 });
  await new Promise(resolve => setTimeout(resolve, 60));
  assert.equal(impostorRenewal.hasOwnership(), false, "an impostor's renewal must never report success");
  impostorRenewal.stop();

  const releasedByRealOwner = await releaseLock('r2', owner.token!, { client });
  assert.equal(releasedByRealOwner, true, "the real owner's token must be untouched by the impostor's failed renewal");
});

test('startLockRenewal: the lock remains valid throughout a simulated critical section longer than the initial TTL', async () => {
  const client = createFakeLockClient();
  const lock = await acquireLock('r3', { client, ttlMs: 100 });
  assert.equal(lock.acquired, true);

  const renewal = startLockRenewal('r3', lock.token!, { client, ttlMs: 100, renewalIntervalMs: 30 });
  // Simulated critical section lasting well past the original 100ms TTL.
  await new Promise(resolve => setTimeout(resolve, 150));

  const contender = await acquireLock('r3', { client, maxWaitMs: 0 });
  assert.equal(contender.acquired, false, 'renewal should have kept the lock alive past its original TTL');
  assert.equal(renewal.hasOwnership(), true);

  renewal.stop();
  const released = await releaseLock('r3', lock.token!, { client });
  assert.equal(released, true);

  const nowFree = await acquireLock('r3', { client, maxWaitMs: 0 });
  assert.equal(nowFree.acquired, true, 'lock must be free after the real owner releases it');
});

test('startLockRenewal: losing ownership to another owner is detected and reported as a sticky failure', async () => {
  const client = createFakeLockClient();
  const original = await acquireLock('r4', { client, ttlMs: 20 });
  assert.equal(original.acquired, true);

  // Renewal interval (50ms) deliberately longer than the TTL (20ms), so the
  // lock genuinely expires before the first renewal tick — a worst-case
  // race where another process takes over first.
  const renewal = startLockRenewal('r4', original.token!, { client, ttlMs: 20, renewalIntervalMs: 50 });
  await new Promise(resolve => setTimeout(resolve, 30));

  const takeover = await acquireLock('r4', { client, ttlMs: 10_000, maxWaitMs: 0 });
  assert.equal(takeover.acquired, true, 'a different owner must be able to take over the now-expired lock');

  // Let the delayed renewal tick fire — it must detect the mismatch.
  await new Promise(resolve => setTimeout(resolve, 40));
  assert.equal(renewal.hasOwnership(), false, 'the original holder must detect it lost ownership');

  renewal.stop();
});
