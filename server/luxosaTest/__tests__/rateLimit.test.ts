// rateLimit tests — an in-memory fake implements the single atomic eval()
// call (INCR + conditional PEXPIRE) that rateLimit.ts relies on, so the
// fixed-window counter logic — including the "no window without a TTL"
// guarantee — is verified without real network access.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isRateLimited, type RateLimitClient } from '../rateLimit';

function createFakeRateLimitClient() {
  const counts = new Map<string, number>();
  const ttlMsOnFirstHit = new Map<string, number>();

  const client: RateLimitClient = {
    async eval(_script, keys, args) {
      const [key] = keys;
      const [ttlMsArg] = args;
      const next = (counts.get(key) ?? 0) + 1;
      counts.set(key, next);
      if (next === 1) {
        ttlMsOnFirstHit.set(key, Number(ttlMsArg));
      }
      return next;
    },
  };

  return { client, getTtlMsSetOnFirstHit: (key: string) => ttlMsOnFirstHit.get(key) ?? null };
}

test('allows requests under the limit', async () => {
  const { client } = createFakeRateLimitClient();
  for (let i = 0; i < 5; i++) {
    const limited = await isRateLimited('client-a', { client, windowSeconds: 60, maxRequests: 5 });
    assert.equal(limited, false, `request ${i + 1} should be allowed`);
  }
});

test('blocks once the limit is exceeded within the window', async () => {
  const { client } = createFakeRateLimitClient();
  for (let i = 0; i < 5; i++) {
    await isRateLimited('client-b', { client, windowSeconds: 60, maxRequests: 5 });
  }
  const sixth = await isRateLimited('client-b', { client, windowSeconds: 60, maxRequests: 5 });
  assert.equal(sixth, true);
});

test('different keys are tracked independently', async () => {
  const { client } = createFakeRateLimitClient();
  for (let i = 0; i < 5; i++) {
    await isRateLimited('client-c', { client, windowSeconds: 60, maxRequests: 5 });
  }
  const otherClient = await isRateLimited('client-d', { client, windowSeconds: 60, maxRequests: 5 });
  assert.equal(otherClient, false, "a different client's requests must not count against client-c's limit");
});

test('the window key gets a TTL in the same atomic call as its first increment, never a separate step', async () => {
  const { client, getTtlMsSetOnFirstHit } = createFakeRateLimitClient();
  await isRateLimited('client-e', { client, windowSeconds: 60, maxRequests: 5 });
  assert.equal(getTtlMsSetOnFirstHit('luxosa-test:ratelimit:client-e:' + Math.floor(Date.now() / 1000 / 60)), 60_000);
});

test('concurrent requests in the same window never under-count each other (single atomic INCR per request)', async () => {
  const { client } = createFakeRateLimitClient();
  const concurrentRequests = 8;
  const results = await Promise.all(
    Array.from({ length: concurrentRequests }, () => isRateLimited('client-f', { client, windowSeconds: 60, maxRequests: 5 })),
  );
  const allowedCount = results.filter(limited => !limited).length;
  const blockedCount = results.filter(limited => limited).length;
  assert.equal(allowedCount, 5, 'exactly maxRequests must be allowed, never more from a lost increment');
  assert.equal(blockedCount, concurrentRequests - 5);
});
