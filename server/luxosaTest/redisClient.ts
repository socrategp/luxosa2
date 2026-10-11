// Explicit Upstash Redis client — deliberately NOT Redis.fromEnv(), which
// only recognizes UPSTASH_REDIS_REST_URL/TOKEN or the KV_REST_API_URL/TOKEN
// fallback. The Vercel integration for this project generated differently
// named variables (UPSTASH_REDIS_REST_KV_REST_API_URL/TOKEN), so the client
// is constructed explicitly from those exact names.

import { Redis } from '@upstash/redis';

let singleton: Redis | null = null;

export function isRedisConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_KV_REST_API_URL && process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN);
}

export function getRedisClient(): Redis {
  if (singleton) return singleton;

  const url = process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error(
      'Upstash Redis not configured: UPSTASH_REDIS_REST_KV_REST_API_URL / UPSTASH_REDIS_REST_KV_REST_API_TOKEN missing.',
    );
  }

  singleton = new Redis({ url, token });
  return singleton;
}
