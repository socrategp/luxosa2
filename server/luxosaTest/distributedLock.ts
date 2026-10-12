// Redis-backed distributed lock — scoped ONLY to the Documenti critical
// section in documentsArchive.ts, never the whole submission pipeline.
//
// Acquisition: SET key token NX PX ttlMs — atomic, works across serverless
// instances (no local state). Release: a Lua script that only deletes the
// key if it still holds OUR token, so one execution can never release a
// lock acquired by another (e.g. after its own TTL already expired and a
// third execution took over).
//
// The initial TTL alone is NOT what keeps the lock safe for the duration of
// the critical section (read/snapshot -> upload -> PUT -> re-read/verify):
// that section does several real GHL round trips and its actual duration is
// not bounded by anything this process controls. Correctness instead comes
// from periodic owner-safe RENEWAL (startLockRenewal below) — the initial
// TTL only needs enough margin to survive up to the first renewal tick.

import { randomUUID } from 'node:crypto';
import { getRedisClient } from './redisClient.js';

export const DOCUMENTS_LOCK_PREFIX = 'luxosa-test:documents-lock:';

// Ample margin above observed real GHL latency for the critical section's
// first read+upload round trip (a few seconds in practice — see the E2E
// report) before the first renewal tick lands. Not load-bearing for the
// rest of the critical section's duration; renewal is.
export const DOCUMENTS_LOCK_TTL_MS = 45_000;

// Renew at 1/3 of the TTL, so a holder gets at least two renewal attempts
// before the lock could expire out from under it even if one tick is
// delayed or dropped.
export const DOCUMENTS_LOCK_RENEWAL_INTERVAL_MS = Math.floor(DOCUMENTS_LOCK_TTL_MS / 3);

// Bounded wait for a contender on the SAME contactId (two submissions of
// the same person racing). Past this, fail explicitly rather than queue
// indefinitely — the mandate requires an explicit timeout, not a deadlock.
export const DOCUMENTS_LOCK_MAX_WAIT_MS = 10_000;

const DOCUMENTS_LOCK_POLL_INTERVAL_MS = 250;

const RELEASE_IF_OWNER_SCRIPT = `
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
else
  return 0
end
`;

// Atomic check-and-extend: only resets the TTL if the key still holds OUR
// token, in one Redis command execution (no separate GET then PEXPIRE,
// which would leave a window for another owner to take over in between).
const RENEW_IF_OWNER_SCRIPT = `
if redis.call("get", KEYS[1]) == ARGV[1] then
  redis.call("pexpire", KEYS[1], ARGV[2])
  return 1
else
  return 0
end
`;

// Minimal surface this module needs from the Redis client — lets tests
// inject an in-memory fake instead of talking to real Upstash.
export interface LockClient {
  set(key: string, value: string, opts: { nx: true; px: number }): Promise<'OK' | null>;
  eval(script: string, keys: string[], args: string[]): Promise<unknown>;
}

export interface AcquireLockResult {
  acquired: boolean;
  token: string | null;
}

function defaultClient(): LockClient {
  return getRedisClient() as unknown as LockClient;
}

export async function acquireLock(
  key: string,
  options: { ttlMs?: number; maxWaitMs?: number; client?: LockClient } = {},
): Promise<AcquireLockResult> {
  const client = options.client ?? defaultClient();
  const ttlMs = options.ttlMs ?? DOCUMENTS_LOCK_TTL_MS;
  const maxWaitMs = options.maxWaitMs ?? DOCUMENTS_LOCK_MAX_WAIT_MS;
  const token = randomUUID();
  const deadline = Date.now() + maxWaitMs;

  while (true) {
    const result = await client.set(key, token, { nx: true, px: ttlMs });
    if (result === 'OK') return { acquired: true, token };
    if (Date.now() >= deadline) return { acquired: false, token: null };
    await new Promise(resolve => setTimeout(resolve, DOCUMENTS_LOCK_POLL_INTERVAL_MS));
  }
}

// Returns true only if the lock was actually held by `token` and was just
// released. A mismatched/absent token is a no-op — never deletes another
// execution's lock.
export async function releaseLock(key: string, token: string, options: { client?: LockClient } = {}): Promise<boolean> {
  const client = options.client ?? defaultClient();
  const result = await client.eval(RELEASE_IF_OWNER_SCRIPT, [key], [token]);
  return result === 1;
}

export interface LockRenewalHandle {
  readonly token: string;
  // False once a renewal tick has confirmed (or failed to confirm) that we
  // no longer hold the lock. The critical section must check this before
  // every further mutation and fail closed if it has flipped.
  hasOwnership(): boolean;
  stop(): void;
}

// Periodically re-extends the lock's TTL, but ONLY while the stored value
// still matches our token (atomic check-and-extend — see
// RENEW_IF_OWNER_SCRIPT). If a tick ever finds the token no longer matches
// (another owner took over after our TTL lapsed) — or the renewal call
// itself fails, e.g. Redis unreachable, so continued ownership can no
// longer be confirmed — ownership is marked lost and never un-marked; the
// caller is expected to check hasOwnership() before every subsequent write
// and fail closed rather than assume it is still safe to mutate.
export function startLockRenewal(
  key: string,
  token: string,
  options: { ttlMs?: number; renewalIntervalMs?: number; client?: LockClient } = {},
): LockRenewalHandle {
  const client = options.client ?? defaultClient();
  const ttlMs = options.ttlMs ?? DOCUMENTS_LOCK_TTL_MS;
  const renewalIntervalMs = options.renewalIntervalMs ?? Math.floor(ttlMs / 3);
  let ownershipLost = false;

  const timer = setInterval(() => {
    if (ownershipLost) return;
    client
      .eval(RENEW_IF_OWNER_SCRIPT, [key], [token, String(ttlMs)])
      .then(result => {
        if (result !== 1) ownershipLost = true;
      })
      .catch(() => {
        // Can't confirm we still hold the lock — fail closed rather than
        // assume we do.
        ownershipLost = true;
      });
  }, renewalIntervalMs);
  // Never keep the Node process alive just for this background renewal.
  if (typeof timer.unref === 'function') timer.unref();

  return {
    token,
    hasOwnership: () => !ownershipLost,
    stop: () => clearInterval(timer),
  };
}
