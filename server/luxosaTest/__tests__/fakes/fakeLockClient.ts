// In-memory fake matching distributedLock.ts's LockClient surface (SET NX
// PX, plus Lua check-and-del / check-and-extend via eval), so tests never
// need real Upstash network access. TTL-aware (checks real elapsed time),
// so lock-timeout, lock-expiry, and renewal scenarios are all exercised
// faithfully, not just happy-path acquire/release.
//
// eval() is called with two different scripts in distributedLock.ts, but
// this fake doesn't need to parse Lua to tell them apart: release always
// passes exactly 1 arg (the token), renewal always passes 2 (token, ttlMs)
// — so arg count alone discriminates check-and-delete from
// check-and-extend.

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
      const [token, ttlArg] = args;
      const existing = store.get(key);
      if (!isAlive(existing) || existing.value !== token) return 0;

      if (ttlArg !== undefined) {
        // Renewal: check-and-extend, never deletes.
        store.set(key, { value: token, expiresAt: Date.now() + Number(ttlArg) });
        return 1;
      }
      // Release: check-and-delete.
      store.delete(key);
      return 1;
    },
  };
}
