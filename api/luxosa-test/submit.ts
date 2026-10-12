// POST /api/luxosa-test/submit — the single entry point for the browser ->
// server Luxosa Test contract. Payload-size bound and a Redis-distributed
// rate limiter run here (before validation even starts); everything else
// is delegated to processSubmission().
//
// FAIL CLOSED: if the rate limiter can't reach Redis, the request is
// rejected (503) rather than let through unchecked — same policy as the
// ledger (server/luxosaTest/ledger.ts).

import { processSubmission } from '../../server/luxosaTest/submission.js';
import { isRateLimited } from '../../server/luxosaTest/rateLimit.js';

export const config = { runtime: 'nodejs' };

const MAX_BODY_BYTES = 20_000; // generous for the answers payload, far below abuse territory

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

  try {
    if (await isRateLimited(clientKey(request))) {
      return json(429, { error: 'rate limited' });
    }
  } catch (err) {
    console.error('[luxosa-test] rate limiter unavailable, failing closed:', err);
    return json(503, { error: 'service temporarily unavailable' });
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
    const httpStatus =
      outcome.status === 'COMPLETED' || outcome.status === 'BLOCKED_EMAIL_SCOPE'
        ? 200
        : outcome.status === 'TEST_IDENTITY_NOT_ALLOWED'
          ? 403
          : 422;
    return json(httpStatus, outcome);
  } catch (err) {
    console.error('[luxosa-test] unhandled error in processSubmission:', err);
    return json(500, { error: 'internal error' });
  }
}
