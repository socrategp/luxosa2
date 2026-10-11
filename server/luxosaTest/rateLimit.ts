// Redis-distributed rate limiter — replaces the old in-process Map, which
// could not see requests handled by a different serverless instance.
// Fixed-window counter via INCR+EXPIRE: INCR is atomic on Redis, so
// concurrent requests in the same window never under-count each other.
// No second service: reuses the same Upstash Redis instance as the ledger.

import { getRedisClient } from './redisClient';

export const RATE_LIMIT_WINDOW_SECONDS = Number(process.env.LUXOSA_RATE_LIMIT_WINDOW_SECONDS ?? 60);
export const RATE_LIMIT_MAX_REQUESTS = Number(process.env.LUXOSA_RATE_LIMIT_MAX_REQUESTS ?? 10);

export interface RateLimitClient {
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number | boolean>;
}

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

  const count = await client.incr(windowKey);
  if (count === 1) {
    await client.expire(windowKey, windowSeconds);
  }
  return count > maxRequests;
}
