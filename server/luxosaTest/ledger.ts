// Submission ledger — minimal durable state for idempotency and E2E
// observability. Deliberately NOT a database: no answers, no full result,
// no PDF are ever stored here (see LedgerEntry below for the exhaustive
// field list).
//
// BLOCKER (documented, not worked around): this repository has no durable
// storage provisioned. A Vercel serverless function is stateless between
// invocations, so an in-memory Map cannot provide real idempotency in
// production — it only works for a single local process. InMemoryLedger
// below exists ONLY to let the rest of the pipeline (and its tests) be
// built and exercised today; getLedger() refuses to silently use it unless
// LUXOSA_LEDGER_PROVIDER is explicitly set to "memory-dev-only", and throws
// a clear, actionable error otherwise. See the final report for the exact
// provisioning steps needed to replace this with a real provider (Vercel
// KV/Upstash Redis is the recommended minimal fit: atomic SETNX-style
// claim, no application database, Vercel-native env var injection once
// connected).

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

let singleton: Ledger | null = null;

export function getLedger(): Ledger {
  if (singleton) return singleton;

  const provider = process.env.LUXOSA_LEDGER_PROVIDER;
  if (provider === 'memory-dev-only') {
    console.warn(
      '[luxosa-test] LUXOSA_LEDGER_PROVIDER=memory-dev-only — ledger is NOT durable across invocations. ' +
        'Local/dev testing only. Never use in production.',
    );
    singleton = new InMemoryLedger();
    return singleton;
  }

  throw new Error(
    'No durable ledger provider configured. Set LUXOSA_LEDGER_PROVIDER=memory-dev-only for local/dev testing only, ' +
      'or provision a real provider (recommended: Vercel KV / Upstash Redis) and implement a Ledger backed by it. ' +
      'See the E2E implementation report for exact provisioning steps.',
  );
}
