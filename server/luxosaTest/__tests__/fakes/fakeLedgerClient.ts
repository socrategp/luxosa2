// In-memory fake matching ledger.ts's LedgerClient surface (GET + SET with
// NX/EX), so RedisLedger's own logic (atomic claim, TTL, update-merge) is
// exercised without real Upstash network access. Exposes the raw store so
// tests can assert on TTL bookkeeping directly.

import type { LedgerClient } from '../../ledger';

interface Entry {
  value: unknown;
  expiresAt: number | null;
}

export function createFakeLedgerClient(): { client: LedgerClient; store: Map<string, Entry> } {
  const store = new Map<string, Entry>();

  function isAlive(entry: Entry | undefined): entry is Entry {
    if (!entry) return false;
    return entry.expiresAt === null || Date.now() < entry.expiresAt;
  }

  const client: LedgerClient = {
    async get<TData>(key: string): Promise<TData | null> {
      const entry = store.get(key);
      if (!isAlive(entry)) return null;
      return entry.value as TData;
    },
    async set<TData>(key: string, value: TData, opts?: { nx?: true; ex?: number }): Promise<'OK' | TData | null> {
      const existing = store.get(key);
      if (opts?.nx && isAlive(existing)) return null;
      store.set(key, { value, expiresAt: opts?.ex ? Date.now() + opts.ex * 1000 : null });
      return 'OK';
    },
  };

  return { client, store };
}
