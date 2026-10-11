// In-memory fake matching distributedLock.ts's LockClient surface (SET NX
// PX + Lua check-and-del via eval), so tests never need real Upstash
// network access. TTL-aware (checks real elapsed time), so lock-timeout
// and lock-expiry scenarios are exercised faithfully, not just happy-path
// acquire/release.

import type { LockClient } from '../../distributedLock';

interface Entry {
  value: string;
  expiresAt: number;
}

export function createFakeLockClient(): LockClient {
  const store = new Map<string, Entry>();

  function isAlive(entry: Entry | undefined): entry is Entry {
    return Boolean(entry) && Date.now() < entry!.expiresAt;
  }

  return {
    async set(key, value, opts) {
      const existing = store.get(key);
      if (opts.nx && isAlive(existing)) return null;
      store.set(key, { value, expiresAt: Date.now() + opts.px });
      return 'OK';
    },
    async eval(_script, keys, args) {
      const [key] = keys;
      const [token] = args;
      const existing = store.get(key);
      if (isAlive(existing) && existing.value === token) {
        store.delete(key);
        return 1;
      }
      return 0;
    },
  };
}
