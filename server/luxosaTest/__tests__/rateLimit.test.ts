// rateLimit tests — an in-memory fake stands in for Redis INCR/EXPIRE, so
// the fixed-window counter logic is verified without real network access.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isRateLimited, type RateLimitClient } from '../rateLimit';

function createFakeRateLimitClient(): RateLimitClient {
  const counts = new Map<string, number>();
  return {
    async incr(key: string) {
      const next = (counts.get(key) ?? 0) + 1;
      counts.set(key, next);
      return next;
    },
    async expire() {
      return true;
    },
  };
}

test('allows requests under the limit', async () => {
  const client = createFakeRateLimitClient();
  for (let i = 0; i < 5; i++) {
    const limited = await isRateLimited('client-a', { client, windowSeconds: 60, maxRequests: 5 });
    assert.equal(limited, false, `request ${i + 1} should be allowed`);
  }
});

test('blocks once the limit is exceeded within the window', async () => {
  const client = createFakeRateLimitClient();
  for (let i = 0; i < 5; i++) {
    await isRateLimited('client-b', { client, windowSeconds: 60, maxRequests: 5 });
  }
  const sixth = await isRateLimited('client-b', { client, windowSeconds: 60, maxRequests: 5 });
  assert.equal(sixth, true);
});

test('different keys are tracked independently', async () => {
  const client = createFakeRateLimitClient();
  for (let i = 0; i < 5; i++) {
    await isRateLimited('client-c', { client, windowSeconds: 60, maxRequests: 5 });
  }
  const otherClient = await isRateLimited('client-d', { client, windowSeconds: 60, maxRequests: 5 });
  assert.equal(otherClient, false, "a different client's requests must not count against client-c's limit");
});
