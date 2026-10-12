// Submission ledger — minimal durable state for idempotency and E2E
// observability. Deliberately NOT a database: no answers, no full result,
// no PDF are ever stored here (see LedgerEntry below for the exhaustive
// field list).
//
// Durable provider: Upstash Redis (see redisClient.ts), wired in as
// RedisLedger below. InMemoryLedger still exists ONLY for explicitly-opted
// local/dev testing (LUXOSA_LEDGER_PROVIDER=memory-dev-only) and is refused
// outright on Vercel — see getLedger().

import { getRedisClient, isRedisConfigured } from './redisClient';
import type { DocumentiMap } from './customFields';

export type LedgerStatus =
  | 'RECEIVED'
  | 'VALIDATED'
  | 'CONTACT_RESOLVED'
  | 'PDF_READY'
  | 'ARCHIVED'
  | 'EMAIL_SENDING'
  | 'EMAIL_SENT'
  | 'COMPLETED'
  | 'FAILED_VALIDATION'
  | 'FAILED_IDENTITY_CONFLICT'
  | 'FAILED_PDF'
  | 'FAILED_UPLOAD'
  | 'FAILED_EMAIL'
  | 'EMAIL_UNKNOWN'
  | 'BLOCKED_EMAIL_SCOPE'
  | 'TEST_IDENTITY_NOT_ALLOWED'
  | 'BLOCKED_TEST_CONFIG_MISSING'
  | 'BLOCKED_TEST_RECIPIENT_MISMATCH'
  | 'BLOCKED_MODE_CONFIG_INVALID'
  | 'UNKNOWN';

export interface LedgerEntry {
  submissionId: string;
  status: LedgerStatus;
  contactId: string | null;
  createdAt: string;
  updatedAt: string;
  previousUltimaData: string | null;
  uploadDocumentId: string | null;
  emailProviderMessageId: string | null;
  resultHash: string | null;
  errorMessage: string | null;
  // Snapshot of the Documenti custom field taken BEFORE the first upload
  // attempt for this submission, persisted once and never overwritten by a
  // later re-read. Upload replaces the whole field value, so a crash after
  // upload and before the final merge-PUT would otherwise make a retry
  // believe the only-just-uploaded file is the entire history; this
  // snapshot is what lets a retry reconstruct previous+new correctly.
  // Technical metadata only (file ids/urls/names), never the PDF itself.
  documentsSnapshotBeforeUpload: DocumentiMap | null;
}

export interface ClaimResult {
  claimed: boolean;
  existing: LedgerEntry | null;
}

export interface Ledger {
  claim(submissionId: string, contactId: string | null): Promise<ClaimResult>;
  get(submissionId: string): Promise<LedgerEntry | null>;
  update(submissionId: string, patch: Partial<LedgerEntry>): Promise<LedgerEntry>;
}

function emptyEntry(submissionId: string, contactId: string | null): LedgerEntry {
  const now = new Date().toISOString();
  return {
    submissionId,
    status: 'RECEIVED',
    contactId,
    createdAt: now,
    updatedAt: now,
    previousUltimaData: null,
    uploadDocumentId: null,
    emailProviderMessageId: null,
    resultHash: null,
    errorMessage: null,
    documentsSnapshotBeforeUpload: null,
  };
}

// NOT DURABLE. Process-local only. Never used unless explicitly opted into
// via LUXOSA_LEDGER_PROVIDER=memory-dev-only (see getLedger below).
export class InMemoryLedger implements Ledger {
  private store = new Map<string, LedgerEntry>();

  async claim(submissionId: string, contactId: string | null): Promise<ClaimResult> {
    const existing = this.store.get(submissionId);
    if (existing) return { claimed: false, existing };
    const entry = emptyEntry(submissionId, contactId);
    this.store.set(submissionId, entry);
    return { claimed: true, existing: null };
  }

  async get(submissionId: string): Promise<LedgerEntry | null> {
    return this.store.get(submissionId) ?? null;
  }

  async update(submissionId: string, patch: Partial<LedgerEntry>): Promise<LedgerEntry> {
    const existing = this.store.get(submissionId);
    if (!existing) throw new Error(`InMemoryLedger.update: no entry for ${submissionId}`);
    const updated: LedgerEntry = { ...existing, ...patch, updatedAt: new Date().toISOString() };
    this.store.set(submissionId, updated);
    return updated;
  }
}

// Short technical retention, not a data-retention policy for customer data
// (none is stored here — see LedgerEntry). 7 days, not just 24h: this entry
// is not only a double-submit guard, it is also where documentsArchive.ts
// persists the minimal technical snapshot needed to reconcile an
// interrupted Documenti transaction (documentsSnapshotBeforeUpload) — that
// reconciliation window needs to outlive a single day. Still bounded and
// minimal (no answers, no full result, no PDF — see LedgerEntry), and
// refreshed (slid) on every update() so it tracks from the last touch of
// the technical transaction, not a fixed calendar date.
const LEDGER_TTL_SECONDS = 7 * 24 * 60 * 60;

function ledgerKey(submissionId: string): string {
  return `luxosa-test:ledger:${submissionId}`;
}

// Minimal surface this module needs from the Redis client — lets tests
// inject an in-memory fake instead of talking to real Upstash.
export interface LedgerClient {
  get<TData>(key: string): Promise<TData | null>;
  set<TData>(key: string, value: TData, opts?: { nx?: true; ex?: number }): Promise<'OK' | TData | null>;
}

// Durable, cross-instance ledger backed by Upstash Redis. claim() is the
// only operation that must be truly atomic across concurrent instances —
// implemented as SET key value NX EX, exactly the primitive Upstash Redis
// is built around for this pattern (no read-then-write race window).
export class RedisLedger implements Ledger {
  private client: LedgerClient;

  constructor(client?: LedgerClient) {
    this.client = client ?? (getRedisClient() as unknown as LedgerClient);
  }

  async claim(submissionId: string, contactId: string | null): Promise<ClaimResult> {
    const key = ledgerKey(submissionId);
    const entry = emptyEntry(submissionId, contactId);
    const result = await this.client.set(key, entry, { nx: true, ex: LEDGER_TTL_SECONDS });
    if (result === 'OK') {
      return { claimed: true, existing: null };
    }
    const existing = await this.client.get<LedgerEntry>(key);
    return { claimed: false, existing: existing ?? null };
  }

  async get(submissionId: string): Promise<LedgerEntry | null> {
    const existing = await this.client.get<LedgerEntry>(ledgerKey(submissionId));
    return existing ?? null;
  }

  async update(submissionId: string, patch: Partial<LedgerEntry>): Promise<LedgerEntry> {
    const key = ledgerKey(submissionId);
    const existing = await this.client.get<LedgerEntry>(key);
    if (!existing) throw new Error(`RedisLedger.update: no entry for ${submissionId}`);
    const updated: LedgerEntry = { ...existing, ...patch, updatedAt: new Date().toISOString() };
    await this.client.set(key, updated, { ex: LEDGER_TTL_SECONDS });
    return updated;
  }
}

let singleton: Ledger | null = null;

export function getLedger(): Ledger {
  if (singleton) return singleton;

  if (isRedisConfigured()) {
    singleton = new RedisLedger();
    return singleton;
  }

  const provider = process.env.LUXOSA_LEDGER_PROVIDER;
  const onVercel = process.env.VERCEL === '1';

  if (provider === 'memory-dev-only') {
    if (onVercel) {
      // FAIL CLOSED: never allow the non-durable ledger to run on Vercel,
      // even if this was set there by mistake — a serverless instance
      // cannot provide real idempotency from an in-memory Map.
      throw new Error(
        'LUXOSA_LEDGER_PROVIDER=memory-dev-only is not allowed on Vercel (VERCEL=1). ' +
          'Configure Upstash Redis (UPSTASH_REDIS_REST_KV_REST_API_URL / _TOKEN) instead.',
      );
    }
    console.warn(
      '[luxosa-test] LUXOSA_LEDGER_PROVIDER=memory-dev-only — ledger is NOT durable across invocations. ' +
        'Local/dev testing only. Never use in production.',
    );
    singleton = new InMemoryLedger();
    return singleton;
  }

  // FAIL CLOSED: no durable provider and no explicit, non-production dev
  // opt-in — refuse rather than silently proceed without idempotency.
  throw new Error(
    'No durable ledger provider configured. Configure Upstash Redis ' +
      '(UPSTASH_REDIS_REST_KV_REST_API_URL / _TOKEN) or set LUXOSA_LEDGER_PROVIDER=memory-dev-only ' +
      'for local/dev testing only (never on Vercel).',
  );
}
