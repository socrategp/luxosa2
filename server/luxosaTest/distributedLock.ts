// Redis-backed distributed lock — scoped ONLY to the Documenti critical
// section in documentsArchive.ts, never the whole submission pipeline.
//
// Acquisition: SET key token NX PX ttlMs — atomic, works across serverless
// instances (no local state). Release: a Lua script that only deletes the
// key if it still holds OUR token, so one execution can never release a
// lock acquired by another (e.g. after its own TTL already expired and a
// third execution took over).

import { randomUUID } from 'node:crypto';
import { getRedisClient } from './redisClient';

export const DOCUMENTS_LOCK_PREFIX = 'luxosa-test:documents-lock:';

// Generous enough for a GHL upload + two GET + one PUT round trip under
// normal latency; short enough that a crashed holder self-heals quickly
// without manual intervention.
export const DOCUMENTS_LOCK_TTL_MS = 30_000;

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
