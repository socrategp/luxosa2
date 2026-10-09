// POST /api/luxosa-test/submit — the single entry point for the browser ->
// server Luxosa Test contract. Payload-size bound and a best-effort,
// process-local rate limiter run here (before validation even starts);
// everything else is delegated to processSubmission().
//
// The in-process rate limiter is NOT distributed (same honesty caveat as
// the ledger: a serverless instance is ephemeral and can be scaled to many
// concurrent instances). It still blocks obvious single-instance abuse at
// zero infrastructure cost; a durable/distributed limiter needs the same
// storage provider as the ledger (see server/luxosaTest/ledger.ts).

import { processSubmission } from '../../server/luxosaTest/submission';

export const config = { runtime: 'nodejs' };

const MAX_BODY_BYTES = 20_000; // generous for the answers payload, far below abuse territory
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

function clientKey(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return json(405, { error: 'method not allowed' });
  }

  if (isRateLimited(clientKey(request))) {
    return json(429, { error: 'rate limited' });
  }

  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (contentLength > MAX_BODY_BYTES) {
    return json(413, { error: 'payload too large' });
  }

  const rawText = await request.text();
  if (rawText.length > MAX_BODY_BYTES) {
    return json(413, { error: 'payload too large' });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawText);
  } catch {
    return json(400, { error: 'invalid JSON' });
  }

  try {
    const outcome = await processSubmission(payload);
    const httpStatus = outcome.status === 'COMPLETED' || outcome.status === 'BLOCKED_EMAIL_SCOPE' ? 200 : 422;
    return json(httpStatus, outcome);
  } catch (err) {
    console.error('[luxosa-test] unhandled error in processSubmission:', err);
    return json(500, { error: 'internal error' });
  }
}
