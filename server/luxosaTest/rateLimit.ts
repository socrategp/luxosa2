// Redis-distributed rate limiter — replaces the old in-process Map, which
// could not see requests handled by a different serverless instance.
// Fixed-window counter via a single atomic Lua script (INCR, then PEXPIRE
// only on the first hit of the window) — a separate INCR followed by a
// separate EXPIRE call would leave a window between the two where a crash
// (or the process simply never getting to the second call) leaves the key
// incremented but without a TTL, so it would never expire. One eval() call
// is one atomic Redis command execution; there is no window to leave open.
// No second service: reuses the same Upstash Redis instance as the ledger.

import { getRedisClient } from './redisClient';

export const RATE_LIMIT_WINDOW_SECONDS = Number(process.env.LUXOSA_RATE_LIMIT_WINDOW_SECONDS ?? 60);
export const RATE_LIMIT_MAX_REQUESTS = Number(process.env.LUXOSA_RATE_LIMIT_MAX_REQUESTS ?? 10);

export interface RateLimitClient {
  eval(script: string, keys: string[], args: string[]): Promise<unknown>;
}

const INCR_WITH_TTL_SCRIPT = `
local count = redis.call("INCR", KEYS[1])
if count == 1 then
  redis.call("PEXPIRE", KEYS[1], ARGV[1])
end
return count
`;

// FAIL CLOSED: if Redis is unreachable we cannot verify the caller is
// within limits, so the caller must treat a thrown error as "reject the
// request" rather than letting it through unchecked.
export async function isRateLimited(
  key: string,
  options: { client?: RateLimitClient; windowSeconds?: number; maxRequests?: number } = {},
): Promise<boolean> {
  const client = options.client ?? (getRedisClient() as unknown as RateLimitClient);
  const windowSeconds = options.windowSeconds ?? RATE_LIMIT_WINDOW_SECONDS;
  const maxRequests = options.maxRequests ?? RATE_LIMIT_MAX_REQUESTS;

  const windowBucket = Math.floor(Date.now() / 1000 / windowSeconds);
  const windowKey = `luxosa-test:ratelimit:${key}:${windowBucket}`;
  const windowMs = windowSeconds * 1000;

  const result = await client.eval(INCR_WITH_TTL_SCRIPT, [windowKey], [String(windowMs)]);
  const count = typeof result === 'number' ? result : Number(result);
  return count > maxRequests;
}
