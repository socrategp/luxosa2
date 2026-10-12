// Orchestrator tests — every GHL/PDF collaborator is injected as a fake via
// SubmissionDeps. Zero network calls. LUXOSA_TEST_MODE is forced to "test"
// so the sandbox-only write invariant is exercised exactly as in production
// test mode.
//
// sendDossierEmail is faked here to resolve successfully by default (the
// real endpoint now works — scope was added 2026-10-10). BLOCKED_EMAIL_SCOPE
// and EMAIL_UNKNOWN are each exercised as explicit, deliberate overrides
// (simulating a scope regression / an ambiguous send timeout), never as the
// default happy path.

process.env.LUXOSA_TEST_MODE = 'test';
// The only email TEST MODE is authorized to target — basePayload()'s
// default email below is deliberately the same address, so every existing
// happy-path test already exercises the (now mandatory) allowlist gate
// instead of needing to bypass it.
process.env.LUXOSA_TEST_SANDBOX_EMAIL = 'maria.rossi@example.com';

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { processSubmission, type SubmissionDeps } from '../submission';
import { buildDossierFileName } from '../pdfGeneration';
import { InMemoryLedger } from '../ledger';
import { SANDBOX_CONTACT_ID, GhlScopeBlockedError, EmailSendTimeoutError, type GhlContact, type ContactUpdatePatch } from '../ghlClient';
import { createFakeLockClient } from './fakes/fakeLockClient';

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
  __updateContactCalls: { contactId: string; patch: ContactUpdatePatch }[];
  __uploadDocumentCalls: { contactId: string; fileName: string }[];
  __getDocumentiState: () => unknown;
}

// Default email on the fake sandbox Contact — matches basePayload()'s
// default email AND LUXOSA_TEST_SANDBOX_EMAIL above, so the new pre-email
// guard (which checks the Contact's actual email on file) passes by
// default for every existing test, exactly like the real sandbox Contact's
// own email is already the authorized address.
const DEFAULT_FAKE_CONTACT_EMAIL = 'maria.rossi@example.com';

// Realistic fake GHL state: uploadDocument REPLACES the Documenti field
// entirely (matching the real, empirically-confirmed single-file behavior),
// and updateContact performs ordinary per-field upsert on customFields
// (matching the real, already-reliable PUT /contacts/{id} semantics used
// everywhere else in this pipeline) — so a test exercising the real
// upload-then-merge logic in submission.ts sees realistic before/after
// state, not a static fixture.
function happyDeps(overrides: Partial<SubmissionDeps> = {}, contactOverride?: GhlContact): HappyDepsResult {
  const updateContactCalls: HappyDepsResult['__updateContactCalls'] = [];
  const uploadDocumentCalls: HappyDepsResult['__uploadDocumentCalls'] = [];
  const contactId = contactOverride?.id ?? SANDBOX_CONTACT_ID;
  let customFields: { id: string; value: unknown }[] = contactOverride?.customFields ? [...contactOverride.customFields] : [];
  let contactEmail: string | undefined = contactOverride?.email ?? DEFAULT_FAKE_CONTACT_EMAIL;

  function upsertCustomField(id: string, value: unknown) {
    const idx = customFields.findIndex(f => f.id === id);
    if (idx >= 0) {
      const next = [...customFields];
      next[idx] = { id, value };
      customFields = next;
    } else {
      customFields = [...customFields, { id, value }];
    }
  }

  return {
    lockClient: createFakeLockClient(),
    reconcileIdentity: async () => ({ kind: 'single_match', contactId: SANDBOX_CONTACT_ID, matchedBy: ['email', 'phone'] }),
    getContact: async () => ({ id: contactId, locationId: 'loc1', email: contactEmail, customFields: [...customFields] }),
    updateContact: async (cId, patch) => {
      updateContactCalls.push({ contactId: cId, patch });
      for (const f of patch.customFields ?? []) upsertCustomField(f.id, f.value);
      if (patch.email !== undefined) contactEmail = patch.email;
      return { id: cId, locationId: 'loc1', email: contactEmail, customFields: [...customFields] };
    },
    createContact: async () => {
      throw new Error('createContact should never be called in TEST MODE');
    },
    generateDossierPdf: async () => ({ buffer: Buffer.from('fake-pdf'), usedFallback: false }),
    uploadDocument: async (cId, fileName) => {
      uploadDocumentCalls.push({ contactId: cId, fileName });
      upsertCustomField('tzRkZVDj1SoYHUlkO5AF', {
        [`uuid-${fileName}`]: {
          meta: { originalname: fileName },
          url: `https://fake.example/${fileName}`,
          documentId: 'doc_fake_1',
        },
      });
      return { status: 200, body: { documentId: 'doc_fake_1' } };
    },
    sendDossierEmail: async () => ({ status: 200, body: {}, messageId: 'fake-message-id' }),
    ...overrides,
    __updateContactCalls: updateContactCalls,
    __uploadDocumentCalls: uploadDocumentCalls,
    __getDocumentiState: () => customFields.find(f => f.id === 'tzRkZVDj1SoYHUlkO5AF')?.value,
  };
}

test('server result coerente + happy path reaches COMPLETED (real send scope now present)', async () => {
  const ledger = new InMemoryLedger();
  const deps = happyDeps({ ledger });
  const outcome = await processSubmission(basePayload(), deps);

  assert.equal(outcome.status, 'COMPLETED');
  assert.equal(outcome.contactId, SANDBOX_CONTACT_ID);

  const entry = await ledger.get(outcome.submissionId);
  assert.equal(entry?.status, 'COMPLETED');
  assert.ok(entry?.resultHash, 'resultHash should be recorded for traceability');
  assert.equal(entry?.uploadDocumentId, 'doc_fake_1');
});

test('Ultima data aggiornata solo al punto corretto: written only once COMPLETED is reached, never before', async () => {
  const ledger = new InMemoryLedger();
  const deps = happyDeps({ ledger });
  await processSubmission(basePayload(), deps);

  const ultimaDataWrites = deps.__updateContactCalls.filter(c =>
    c.patch.customFields?.some(f => f.id === 'baDYUcYkGZ2UUVgD9FRD'),
  );
  assert.equal(ultimaDataWrites.length, 1, 'exactly one write should touch Ultima data (the final step)');
  // It must be the LAST updateContact call (after contact resolve + consent writes, if any).
  assert.equal(deps.__updateContactCalls.at(-1), ultimaDataWrites[0]);
});

test('nessun write fuori sandbox: every write call receives only SANDBOX_CONTACT_ID', async () => {
  const ledger = new InMemoryLedger();
  const deps = happyDeps({ ledger });
  await processSubmission(basePayload(), deps);

  assert.ok(deps.__updateContactCalls.every(c => c.contactId === SANDBOX_CONTACT_ID));
  assert.ok(deps.__uploadDocumentCalls.every(c => c.contactId === SANDBOX_CONTACT_ID));
});

test('identity conflict simulato (end to end through the orchestrator, production mode): stops before any write, no merge', async () => {
  // Identity conflict detection is a PRODUCTION-mode path: TEST MODE no
  // longer calls reconcileIdentity at all (see the TEST MODE isolation
  // tests below), so this scenario is exercised with LUXOSA_TEST_MODE
  // temporarily unset, exactly as it already was before TEST MODE existed.
  const original = process.env.LUXOSA_TEST_MODE;
  delete process.env.LUXOSA_TEST_MODE;
  try {
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
  } finally {
    if (original !== undefined) process.env.LUXOSA_TEST_MODE = original;
  }
});

test('doppio click stesso submissionId through the orchestrator: second call returns the first result, side effects run once', async () => {
  const ledger = new InMemoryLedger();
  let uploadCallCount = 0;
  let emailCallCount = 0;
  const deps = happyDeps({
    ledger,
    uploadDocument: async () => {
      uploadCallCount++;
      return { status: 200, body: { documentId: 'doc_fake_1' } };
    },
    sendDossierEmail: async () => {
      emailCallCount++;
      return { status: 200, body: {}, messageId: 'fake-message-id' };
    },
  });
  const payload = basePayload();
  const [first, second] = await Promise.all([processSubmission(payload, deps), processSubmission(payload, deps)]);

  assert.equal(uploadCallCount, 1, 'upload (and the rest of the pipeline) must run exactly once');
  assert.equal(emailCallCount, 1, 'un replay dello stesso submissionId non invia una seconda email');
  const statuses = [first.status, second.status];
  assert.ok(statuses.includes('COMPLETED'));
});

test('replay submission: calling processSubmission again with the same submissionId after completion returns the cached terminal state, no second email', async () => {
  const ledger = new InMemoryLedger();
  let emailCallCount = 0;
  const deps = happyDeps({
    ledger,
    sendDossierEmail: async () => {
      emailCallCount++;
      return { status: 200, body: {}, messageId: 'fake-message-id' };
    },
  });
  const payload = basePayload();
  const firstRun = await processSubmission(payload, deps);
  const replay = await processSubmission(payload, deps);
  assert.equal(replay.status, firstRun.status);
  assert.equal(replay.status, 'COMPLETED');
  assert.equal(replay.contactId, firstRun.contactId);
  assert.equal(emailCallCount, 1, 'replay must not re-trigger the email send');
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

test('failure email pre-send (non-scope, non-timeout error) maps to FAILED_EMAIL', async () => {
  const ledger = new InMemoryLedger();
  const deps = happyDeps({
    ledger,
    sendDossierEmail: async () => { throw new Error('unexpected provider error'); },
  });
  const outcome = await processSubmission(basePayload(), deps);
  assert.equal(outcome.status, 'FAILED_EMAIL');
});

test('BLOCKED_EMAIL_SCOPE: a simulated scope regression (GhlScopeBlockedError) is mapped distinctly, Ultima data untouched', async () => {
  const ledger = new InMemoryLedger();
  const deps = happyDeps({
    ledger,
    sendDossierEmail: async () => { throw new GhlScopeBlockedError('conversations/message.write', 'POST /conversations/messages'); },
  });
  const outcome = await processSubmission(basePayload(), deps);
  assert.equal(outcome.status, 'BLOCKED_EMAIL_SCOPE');
  const touchedUltimaData = deps.__updateContactCalls.some(c => c.patch.customFields?.some(f => f.id === 'baDYUcYkGZ2UUVgD9FRD'));
  assert.equal(touchedUltimaData, false);
});

test('EMAIL_UNKNOWN: an ambiguous send timeout is mapped distinctly from FAILED_EMAIL, no automatic resend, Ultima data untouched', async () => {
  const ledger = new InMemoryLedger();
  let emailAttempts = 0;
  const deps = happyDeps({
    ledger,
    sendDossierEmail: async () => { emailAttempts++; throw new EmailSendTimeoutError(); },
  });
  const outcome = await processSubmission(basePayload(), deps);
  assert.equal(outcome.status, 'EMAIL_UNKNOWN');
  assert.equal(emailAttempts, 1, 'no automatic resend after an ambiguous timeout');
  const touchedUltimaData = deps.__updateContactCalls.some(c => c.patch.customFields?.some(f => f.id === 'baDYUcYkGZ2UUVgD9FRD'));
  assert.equal(touchedUltimaData, false);
});

test('stesso submissionId (replay con ledger perso): file già presente con quell\'esatto filename non viene ricaricato', async () => {
  // Defensive branch: if the ledger lost its state (e.g. process restart,
  // non-durable InMemoryLedger) but GHL still has the file from a prior
  // partial run of the SAME submissionId, fileAlreadyUploaded must still
  // prevent a duplicate upload.
  const payload = basePayload();
  const submittedAt = new Date();
  const existingFileName = buildDossierFileName(payload.firstName as string, payload.lastName as string, submittedAt, payload.submissionId as string);
  const contactWithExistingUpload: GhlContact = {
    id: SANDBOX_CONTACT_ID,
    locationId: 'loc1',
    customFields: [
      { id: 'tzRkZVDj1SoYHUlkO5AF', value: { 'uuid-1': { meta: { originalname: existingFileName }, url: 'https://example.com/doc1.pdf', documentId: 'doc-1' } } },
    ],
  };
  let uploadCalled = false;
  const deps = happyDeps(
    { ledger: new InMemoryLedger(), uploadDocument: async () => { uploadCalled = true; return { status: 200, body: {} }; } },
    contactWithExistingUpload,
  );
  const outcome = await processSubmission(payload, deps);
  assert.equal(outcome.status, 'COMPLETED');
  assert.equal(uploadCalled, false, 'identical filename (same submissionId) already present -> upload must be skipped, not duplicated');
});

test('due submissionId DIVERSI, stessa persona, stesso giorno -> due filename diversi, nessuno dei due elimina l\'altro', async () => {
  const ledger = new InMemoryLedger();
  const deps = happyDeps({ ledger }); // realistic shared fake GHL state, no overrides

  const first = await processSubmission(basePayload({ submissionId: 'sub_first_aaaaaaaa' }), deps);
  assert.equal(first.status, 'COMPLETED');
  const second = await processSubmission(basePayload({ submissionId: 'sub_second_bbbbbbbb' }), deps);
  assert.equal(second.status, 'COMPLETED');

  const documentiState = deps.__getDocumentiState() as Record<string, { meta?: { originalname?: string } }>;
  const names = Object.values(documentiState).map(e => e.meta?.originalname);
  assert.equal(Object.keys(documentiState).length, 2, 'both dossiers must be present, neither overwritten');
  // submissionIdShort is the first 8 characters of each submissionId
  assert.ok(names.some(n => n?.includes('sub_firs')));
  assert.ok(names.some(n => n?.includes('sub_seco')));
});

test('al limite di 10 dossier storici: blocca/flagga, non sovrascrive nulla silenziosamente', async () => {
  const tenExisting: Record<string, unknown> = {};
  for (let i = 0; i < 10; i++) {
    tenExisting[`uuid-${i}`] = { meta: { originalname: `Luxosa_Test_Old_Old_2000-01-0${i}_aaaaaaaa.pdf` }, url: `https://example.com/${i}.pdf`, documentId: `doc-${i}` };
  }
  const contactAtLimit: GhlContact = {
    id: SANDBOX_CONTACT_ID,
    locationId: 'loc1',
    customFields: [{ id: 'tzRkZVDj1SoYHUlkO5AF', value: tenExisting }],
  };
  let uploadCalled = false;
  const deps = happyDeps(
    { ledger: new InMemoryLedger(), uploadDocument: async () => { uploadCalled = true; return { status: 200, body: {} }; } },
    contactAtLimit,
  );
  const outcome = await processSubmission(basePayload(), deps);
  assert.equal(outcome.status, 'FAILED_UPLOAD');
  assert.equal(uploadCalled, false, 'limit reached -> no upload attempted, nothing overwritten');
  const documentiState = deps.__getDocumentiState() as Record<string, unknown>;
  assert.equal(Object.keys(documentiState).length, 10, 'all 10 pre-existing entries remain untouched');
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

// --- TEST MODE isolation -----------------------------------------------
// Nothing the browser submits in TEST MODE may determine the real email
// recipient, mutate a real Contact, or reach outside the sandbox. These
// tests exercise that boundary directly, independent of the GHL sandbox.

test('TEST MODE + email arbitraria -> 403 TEST_IDENTITY_NOT_ALLOWED, with zero identity lookup, zero Contact write, zero PDF/upload/email', async () => {
  let reconcileCalled = false;
  let getContactCalled = false;
  let updateContactCalled = false;
  let createContactCalled = false;
  let pdfCalled = false;
  let uploadCalled = false;
  let emailCalled = false;
  const deps = happyDeps({
    ledger: new InMemoryLedger(),
    reconcileIdentity: async () => { reconcileCalled = true; return { kind: 'single_match', contactId: SANDBOX_CONTACT_ID, matchedBy: ['email'] }; },
    getContact: async () => { getContactCalled = true; return { id: SANDBOX_CONTACT_ID, locationId: 'loc1', customFields: [] }; },
    updateContact: async () => { updateContactCalled = true; throw new Error('must not be called'); },
    createContact: async () => { createContactCalled = true; throw new Error('must not be called'); },
    generateDossierPdf: async () => { pdfCalled = true; throw new Error('must not be called'); },
    uploadDocument: async () => { uploadCalled = true; throw new Error('must not be called'); },
    sendDossierEmail: async () => { emailCalled = true; throw new Error('must not be called'); },
  });

  const outcome = await processSubmission(basePayload({ email: 'someone-else@example.com' }), deps);

  assert.equal(outcome.status, 'TEST_IDENTITY_NOT_ALLOWED');
  assert.equal(outcome.contactId, null);
  assert.equal(reconcileCalled, false, 'zero identity lookup for an arbitrary email');
  assert.equal(getContactCalled, false, 'zero Contact read for an arbitrary email');
  assert.equal(updateContactCalled, false, 'zero Contact write for an arbitrary email');
  assert.equal(createContactCalled, false);
  assert.equal(pdfCalled, false, 'zero PDF generation for an arbitrary email');
  assert.equal(uploadCalled, false, 'zero upload for an arbitrary email');
  assert.equal(emailCalled, false, 'zero email send for an arbitrary email');
});

test('TEST MODE senza LUXOSA_TEST_SANDBOX_EMAIL -> fail closed before any GHL/email side effect', async () => {
  const original = process.env.LUXOSA_TEST_SANDBOX_EMAIL;
  delete process.env.LUXOSA_TEST_SANDBOX_EMAIL;
  try {
    let anySideEffect = false;
    const deps = happyDeps({
      ledger: new InMemoryLedger(),
      reconcileIdentity: async () => { anySideEffect = true; throw new Error('must not be called'); },
      getContact: async () => { anySideEffect = true; throw new Error('must not be called'); },
      sendDossierEmail: async () => { anySideEffect = true; throw new Error('must not be called'); },
    });
    const outcome = await processSubmission(basePayload(), deps);
    assert.equal(outcome.status, 'BLOCKED_TEST_CONFIG_MISSING');
    assert.equal(outcome.contactId, null);
    assert.equal(anySideEffect, false);
  } finally {
    if (original !== undefined) process.env.LUXOSA_TEST_SANDBOX_EMAIL = original;
  }
});

test("TEST MODE never overwrites the sandbox Contact's existing firstName/lastName/email/phone", async () => {
  const deps = happyDeps({ ledger: new InMemoryLedger() });
  const outcome = await processSubmission(basePayload({ marketingConsent: true }), deps);
  assert.equal(outcome.status, 'COMPLETED');
  for (const call of deps.__updateContactCalls) {
    const keys = Object.keys(call.patch);
    assert.deepEqual(
      keys.filter(k => ['firstName', 'lastName', 'email', 'phone'].includes(k)),
      [],
      `updateContact call must never touch standard Contact fields in TEST MODE, got keys: ${keys.join(', ')}`,
    );
  }
});

test('pre-email guard: Contact email on file no longer matches the sandbox address -> BLOCKED_TEST_RECIPIENT_MISMATCH, no send', async () => {
  const driftedContact: GhlContact = {
    id: SANDBOX_CONTACT_ID,
    locationId: 'loc1',
    email: 'drifted-away@example.com',
    customFields: [],
  };
  let emailSent = false;
  const deps = happyDeps(
    { ledger: new InMemoryLedger(), sendDossierEmail: async () => { emailSent = true; return { status: 200, body: {}, messageId: 'x' }; } },
    driftedContact,
  );

  const outcome = await processSubmission(basePayload(), deps);

  assert.equal(outcome.status, 'BLOCKED_TEST_RECIPIENT_MISMATCH');
  assert.equal(emailSent, false, 'no send once the recipient Contact email fails the independent pre-send check');
});

test('production mode (LUXOSA_TEST_MODE unset): real identity reconciliation runs and standard Contact fields are written, unchanged from before this phase', async () => {
  const original = process.env.LUXOSA_TEST_MODE;
  delete process.env.LUXOSA_TEST_MODE;
  try {
    let reconcileCalled = false;
    const deps = happyDeps({
      ledger: new InMemoryLedger(),
      reconcileIdentity: async () => { reconcileCalled = true; return { kind: 'single_match', contactId: SANDBOX_CONTACT_ID, matchedBy: ['email', 'phone'] }; },
    });

    const outcome = await processSubmission(basePayload({ email: 'any-production-email@example.com' }), deps);

    assert.equal(reconcileCalled, true, 'production mode must still perform real identity reconciliation');
    assert.equal(outcome.status, 'COMPLETED');
    const contactResolveCall = deps.__updateContactCalls.find(c => !c.patch.customFields);
    assert.ok(contactResolveCall, 'production mode must still write standard Contact fields');
    assert.equal(contactResolveCall!.patch.email, 'any-production-email@example.com');
    assert.equal(contactResolveCall!.patch.firstName, 'Maria');
  } finally {
    if (original !== undefined) process.env.LUXOSA_TEST_MODE = original;
  }
});
