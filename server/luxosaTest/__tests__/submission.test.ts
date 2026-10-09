// Orchestrator tests — every GHL/PDF collaborator is injected as a fake via
// SubmissionDeps. Zero network calls. LUXOSA_TEST_MODE is forced to "test"
// so the sandbox-only write invariant is exercised exactly as in production
// test mode.

process.env.LUXOSA_TEST_MODE = 'test';

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { processSubmission, type SubmissionDeps } from '../submission';
import { buildDossierFileName } from '../pdfGeneration';
import { InMemoryLedger } from '../ledger';
import { SANDBOX_CONTACT_ID, GhlScopeBlockedError, type GhlContact } from '../ghlClient';

const BASE_ANSWERS = {
  d1: 'd1_lisci',
  d2: ['d2_sani'],
  d3: 'd3_cute',
  d4a: ['d4a_prurito'],
  d5a: 'd5a_settimane',
  d6a: 'd6a_mai',
  d7a: 'd7a_no',
  d8: 'd8_settimana',
  d9: 'd9_amo',
};

function basePayload(overrides: Record<string, unknown> = {}) {
  return {
    submissionId: `sub_${Math.random().toString(36).slice(2, 12)}`,
    testVersion: 'v2.0',
    language: 'it',
    firstName: 'Maria',
    lastName: 'Rossi',
    email: 'maria.rossi@example.com',
    phone: '350 196 1535',
    privacyAcknowledged: true,
    marketingConsent: false,
    answers: BASE_ANSWERS,
    ...overrides,
  };
}

interface HappyDepsResult extends Partial<SubmissionDeps> {
  __updateContactCalls: { contactId: string; patch: { customFields?: { id: string }[] } }[];
  __uploadDocumentCalls: { contactId: string; fileName: string }[];
}

function happyDeps(overrides: Partial<SubmissionDeps> = {}, contactOverride?: GhlContact): HappyDepsResult {
  const updateContactCalls: HappyDepsResult['__updateContactCalls'] = [];
  const uploadDocumentCalls: HappyDepsResult['__uploadDocumentCalls'] = [];
  const contact: GhlContact = contactOverride ?? { id: SANDBOX_CONTACT_ID, locationId: 'loc1', customFields: [] };

  return {
    reconcileIdentity: async () => ({ kind: 'single_match', contactId: SANDBOX_CONTACT_ID, matchedBy: ['email', 'phone'] }),
    getContact: async () => contact,
    updateContact: async (contactId, patch) => {
      updateContactCalls.push({ contactId, patch });
      return { ...contact };
    },
    createContact: async () => {
      throw new Error('createContact should never be called in TEST MODE');
    },
    generateDossierPdf: async () => ({ buffer: Buffer.from('fake-pdf'), usedFallback: false }),
    uploadDocument: async (contactId, fileName) => {
      uploadDocumentCalls.push({ contactId, fileName });
      return { status: 200, body: { documentId: 'doc_fake_1' } };
    },
    // sendDossierEmail intentionally NOT overridden — the real implementation
    // always throws GhlScopeBlockedError, which is the documented, expected
    // stopping point for this phase.
    ...overrides,
    __updateContactCalls: updateContactCalls,
    __uploadDocumentCalls: uploadDocumentCalls,
  };
}

test('server result coerente + happy path up to the documented blocker: BLOCKED_EMAIL_SCOPE', async () => {
  const ledger = new InMemoryLedger();
  const deps = happyDeps({ ledger });
  const outcome = await processSubmission(basePayload(), deps);

  assert.equal(outcome.status, 'BLOCKED_EMAIL_SCOPE');
  assert.equal(outcome.contactId, SANDBOX_CONTACT_ID);

  const entry = await ledger.get(outcome.submissionId);
  assert.equal(entry?.status, 'BLOCKED_EMAIL_SCOPE');
  assert.ok(entry?.resultHash, 'resultHash should be recorded for traceability');
  assert.equal(entry?.uploadDocumentId, 'doc_fake_1');

  // "Ultima data aggiornata solo al punto corretto": the run stopped before
  // step 14, so no updateContact call should have touched FIELD_ULTIMA_DATA.
  const touchedUltimaData = deps.__updateContactCalls.some(c => c.patch.customFields?.some(f => f.id === 'baDYUcYkGZ2UUVgD9FRD'));
  assert.equal(touchedUltimaData, false);
});

test('nessun write fuori sandbox: every write call receives only SANDBOX_CONTACT_ID', async () => {
  const ledger = new InMemoryLedger();
  const deps = happyDeps({ ledger });
  await processSubmission(basePayload(), deps);

  assert.ok(deps.__updateContactCalls.every(c => c.contactId === SANDBOX_CONTACT_ID));
  assert.ok(deps.__uploadDocumentCalls.every(c => c.contactId === SANDBOX_CONTACT_ID));
});

test('identity conflict simulato (end to end through the orchestrator): stops before any write, no merge', async () => {
  const ledger = new InMemoryLedger();
  let writeAttempted = false;
  const deps: Partial<SubmissionDeps> = {
    ledger,
    reconcileIdentity: async () => ({ kind: 'conflict', emailContactId: 'c_email', phoneContactId: 'c_phone' }),
    updateContact: async () => { writeAttempted = true; throw new Error('must not be called'); },
    uploadDocument: async () => { writeAttempted = true; throw new Error('must not be called'); },
  };
  const outcome = await processSubmission(basePayload(), deps);
  assert.equal(outcome.status, 'FAILED_IDENTITY_CONFLICT');
  assert.equal(outcome.contactId, null);
  assert.equal(writeAttempted, false);
});

test('doppio click stesso submissionId through the orchestrator: second call returns the first result, side effects run once', async () => {
  const ledger = new InMemoryLedger();
  let uploadCallCount = 0;
  const deps = happyDeps({
    ledger,
    uploadDocument: async () => {
      uploadCallCount++;
      return { status: 200, body: { documentId: 'doc_fake_1' } };
    },
  });
  const payload = basePayload();
  const [first, second] = await Promise.all([processSubmission(payload, deps), processSubmission(payload, deps)]);

  assert.equal(uploadCallCount, 1, 'upload (and the rest of the pipeline) must run exactly once');
  const statuses = [first.status, second.status];
  assert.ok(statuses.includes('BLOCKED_EMAIL_SCOPE'));
});

test('replay submission: calling processSubmission again with the same submissionId after completion returns the cached terminal state', async () => {
  const ledger = new InMemoryLedger();
  const deps = happyDeps({ ledger });
  const payload = basePayload();
  const firstRun = await processSubmission(payload, deps);
  const replay = await processSubmission(payload, deps);
  assert.equal(replay.status, firstRun.status);
  assert.equal(replay.contactId, firstRun.contactId);
});

test('failure PDF: generateDossierPdf throwing maps to FAILED_PDF, no upload attempted', async () => {
  const ledger = new InMemoryLedger();
  let uploadCalled = false;
  const deps = happyDeps({
    ledger,
    generateDossierPdf: async () => { throw new Error('renderer exploded'); },
    uploadDocument: async () => { uploadCalled = true; return { status: 200, body: {} }; },
  });
  const outcome = await processSubmission(basePayload(), deps);
  assert.equal(outcome.status, 'FAILED_PDF');
  assert.equal(uploadCalled, false);
});

test('failure upload: uploadDocument throwing maps to FAILED_UPLOAD', async () => {
  const ledger = new InMemoryLedger();
  const deps = happyDeps({
    ledger,
    uploadDocument: async () => { throw new Error('GHL upload 500'); },
  });
  const outcome = await processSubmission(basePayload(), deps);
  assert.equal(outcome.status, 'FAILED_UPLOAD');
});

test('failure email pre-send (non-scope error) maps to FAILED_EMAIL, distinct from BLOCKED_EMAIL_SCOPE', async () => {
  const ledger = new InMemoryLedger();
  const deps = happyDeps({
    ledger,
    sendDossierEmail: async () => { throw new Error('unexpected provider error'); },
  });
  const outcome = await processSubmission(basePayload(), deps);
  assert.equal(outcome.status, 'FAILED_EMAIL');
});

test('BLOCKED_EMAIL_SCOPE is reached via the real sendDossierEmail (GhlScopeBlockedError), not a generic failure', async () => {
  let thrown: unknown;
  try {
    const { sendDossierEmail } = await import('../ghlClient');
    await sendDossierEmail();
  } catch (err) {
    thrown = err;
  }
  assert.ok(thrown instanceof GhlScopeBlockedError);

  const ledger = new InMemoryLedger();
  const deps = happyDeps({ ledger });
  const outcome = await processSubmission(basePayload(), deps);
  assert.equal(outcome.status, 'BLOCKED_EMAIL_SCOPE');
});

test('storico Documenti preservato: a file already uploaded under the SAME filename today is not re-uploaded', async () => {
  const submittedAt = new Date();
  const existingFileName = buildDossierFileName('Maria', 'Rossi', submittedAt);
  const contactWithExistingUpload: GhlContact = {
    id: SANDBOX_CONTACT_ID,
    locationId: 'loc1',
    customFields: [
      { id: 'tzRkZVDj1SoYHUlkO5AF', value: { 'uuid-1': { meta: { originalname: existingFileName } } } },
    ],
  };
  let uploadCalled = false;
  const deps = happyDeps(
    { ledger: new InMemoryLedger(), uploadDocument: async () => { uploadCalled = true; return { status: 200, body: {} }; } },
    contactWithExistingUpload,
  );
  const outcome = await processSubmission(basePayload(), deps);
  assert.equal(outcome.status, 'BLOCKED_EMAIL_SCOPE');
  assert.equal(uploadCalled, false, 'identical filename already present -> upload must be skipped, not duplicated');
});

test('a DIFFERENT filename (e.g. different day) still uploads normally', async () => {
  const contactWithOldUpload: GhlContact = {
    id: SANDBOX_CONTACT_ID,
    locationId: 'loc1',
    customFields: [
      { id: 'tzRkZVDj1SoYHUlkO5AF', value: { 'uuid-1': { meta: { originalname: 'Luxosa_Test_Someone_Else_2000-01-01.pdf' } } } },
    ],
  };
  let uploadCalled = false;
  const deps = happyDeps(
    { ledger: new InMemoryLedger(), uploadDocument: async () => { uploadCalled = true; return { status: 200, body: {} }; } },
    contactWithOldUpload,
  );
  const outcome = await processSubmission(basePayload(), deps);
  assert.equal(outcome.status, 'BLOCKED_EMAIL_SCOPE');
  assert.equal(uploadCalled, true);
});

test('marketingConsent=true performs a positive-write on the consent field; marketingConsent=false touches nothing', async () => {
  const ledgerTrue = new InMemoryLedger();
  const depsTrue = happyDeps({ ledger: ledgerTrue });
  await processSubmission(basePayload({ marketingConsent: true }), depsTrue);
  const wroteConsent = depsTrue.__updateContactCalls.some(c =>
    c.patch.customFields?.some(f => f.id === 'vRIoj7Qom8xNRclYt5ub'),
  );
  assert.equal(wroteConsent, true);

  const ledgerFalse = new InMemoryLedger();
  const depsFalse = happyDeps({ ledger: ledgerFalse });
  await processSubmission(basePayload({ marketingConsent: false }), depsFalse);
  const touchedConsentField = depsFalse.__updateContactCalls.some(c =>
    c.patch.customFields?.some(f => f.id === 'vRIoj7Qom8xNRclYt5ub'),
  );
  assert.equal(touchedConsentField, false, 'marketingConsent=false must be NO ACTION, never a clearing write');
});

test('privacyAcknowledged=false is rejected server-side even if somehow reaching the orchestrator', async () => {
  const ledger = new InMemoryLedger();
  const deps = happyDeps({ ledger });
  const outcome = await processSubmission(basePayload({ privacyAcknowledged: false }), deps);
  assert.equal(outcome.status, 'FAILED_VALIDATION');
});
