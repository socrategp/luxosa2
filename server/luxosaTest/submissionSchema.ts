// Runtime validation for the browser -> server Luxosa Test submission
// contract. This is the ONLY place that decides whether a payload is
// trustworthy enough to reach buildLuxosaTestResult(). It does not
// recompute scoring — it only allowlists the shape of `answers` against the
// REAL question bank (buildQuestionSequence), so the allowlist can never
// drift out of sync with the actual quiz.

import { z } from 'zod';
import {
  buildQuestionSequence,
  type Answers,
} from '../../src/lib/luxosaTest/result.js';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../src/i18n/config.js';
import { normalizePhoneToE164 } from './phone.js';

// Bumped only when the question bank or contract shape changes in a way
// that would make an older client's payload unsafe to score as-is.
export const SUPPORTED_TEST_VERSIONS = ['v2.0'] as const;
export type SupportedTestVersion = (typeof SUPPORTED_TEST_VERSIONS)[number];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// submissionId is a client-generated idempotency key — constrain the
// charset so it is always a safe ledger/storage key, never raw user input.
const SUBMISSION_ID_RE = /^[A-Za-z0-9][A-Za-z0-9_-]{7,99}$/;

const D10_MAX_LENGTH = 500; // matches the D10 textarea limit in the gate UI
const NAME_MAX_LENGTH = 100;
const EMAIL_MAX_LENGTH = 254; // RFC 5321 practical limit
const PHONE_MAX_LENGTH = 40;
const ANSWER_OPTION_MAX_LENGTH = 64; // option ids are short fixed tokens

const envelopeSchema = z.object({
  submissionId: z.string().regex(SUBMISSION_ID_RE),
  testVersion: z.enum(SUPPORTED_TEST_VERSIONS),
  language: z.enum(SUPPORTED_LANGUAGES),
  firstName: z.string().trim().min(1).max(NAME_MAX_LENGTH),
  lastName: z.string().trim().min(1).max(NAME_MAX_LENGTH),
  email: z.string().trim().max(EMAIL_MAX_LENGTH).regex(EMAIL_RE),
  phone: z.string().trim().min(1).max(PHONE_MAX_LENGTH),
  privacyAcknowledged: z.boolean(),
  marketingConsent: z.boolean(),
  answers: z.record(
    z.string(),
    z.union([
      z.string().max(Math.max(D10_MAX_LENGTH, ANSWER_OPTION_MAX_LENGTH)),
      z.array(z.string().max(ANSWER_OPTION_MAX_LENGTH)).max(10),
    ]),
  ),
});

export interface ValidatedSubmission {
  submissionId: string;
  testVersion: SupportedTestVersion;
  language: SupportedLanguage;
  firstName: string;
  lastName: string;
  email: string;
  phoneRaw: string;
  phoneE164: string;
  privacyAcknowledged: boolean;
  marketingConsent: boolean;
  answers: Answers;
}

export type ValidationResult =
  | { ok: true; data: ValidatedSubmission }
  | { ok: false; errors: string[] };

// Validates `answers` against the REAL question bank for the branch the
// submission claims (derived from the submitted d3, exactly like the live
// quiz does) — never a hand-maintained parallel enum list.
function validateAnswersAgainstQuestionBank(answers: Record<string, unknown>): string[] {
  const errors: string[] = [];
  const d3Raw = answers['d3'];
  const d3 = typeof d3Raw === 'string' ? d3Raw : undefined;
  const sequence = buildQuestionSequence(d3);
  const knownIds = new Set(sequence.map(q => q.id));

  for (const key of Object.keys(answers)) {
    if (!knownIds.has(key)) {
      errors.push(`unknown question: ${key}`);
    }
  }

  for (const q of sequence) {
    const value = answers[q.id];

    if (q.selectionType === 'text') {
      if (value === undefined) continue;
      if (typeof value !== 'string') {
        errors.push(`${q.id}: expected text`);
      } else if (value.length > D10_MAX_LENGTH) {
        errors.push(`${q.id}: exceeds max length`);
      }
      continue;
    }

    if (value === undefined) {
      // d3 itself is mandatory (it determines the branch); every other
      // question is treated as optional at the schema layer — buildLuxosaTestResult
      // already degrades gracefully on missing answers, same as the live quiz.
      if (q.id === 'd3') errors.push('d3 is required');
      continue;
    }

    const optionIds = new Set(q.options.map(o => o.id));
    const selected = Array.isArray(value) ? value : [value];

    if (q.selectionType === 'single' && Array.isArray(value)) {
      errors.push(`${q.id}: expected a single value`);
      continue;
    }
    if (q.selectionType === 'multi' && !Array.isArray(value)) {
      errors.push(`${q.id}: expected an array`);
      continue;
    }
    if (q.selectionType === 'multi' && q.maxSelections && selected.length > q.maxSelections) {
      errors.push(`${q.id}: too many selections`);
      continue;
    }
    for (const optId of selected) {
      if (!optionIds.has(optId)) {
        errors.push(`${q.id}: unknown option "${optId}"`);
      }
    }
  }

  return errors;
}

export function validateSubmission(payload: unknown): ValidationResult {
  const envelopeResult = envelopeSchema.safeParse(payload);
  if (!envelopeResult.success) {
    return {
      ok: false,
      errors: envelopeResult.error.issues.map(i => `${i.path.join('.')}: ${i.message}`),
    };
  }
  const envelope = envelopeResult.data;

  const answerErrors = validateAnswersAgainstQuestionBank(envelope.answers as Record<string, unknown>);
  if (answerErrors.length > 0) {
    return { ok: false, errors: answerErrors };
  }

  const phone = normalizePhoneToE164(envelope.phone);
  if (!phone) {
    return { ok: false, errors: ['phone: not a valid phone number'] };
  }

  return {
    ok: true,
    data: {
      submissionId: envelope.submissionId,
      testVersion: envelope.testVersion,
      language: envelope.language,
      firstName: envelope.firstName,
      lastName: envelope.lastName,
      email: envelope.email.toLowerCase(),
      phoneRaw: envelope.phone,
      phoneE164: phone.e164,
      privacyAcknowledged: envelope.privacyAcknowledged,
      marketingConsent: envelope.marketingConsent,
      answers: envelope.answers as Answers,
    },
  };
}
