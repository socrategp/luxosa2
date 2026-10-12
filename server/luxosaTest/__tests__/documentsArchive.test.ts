// documentsArchive tests — the Documenti critical section, exercised
// against a realistic in-memory fake GHL (uploadDocument REPLACES the
// whole field, matching the real, empirically-confirmed behavior) and an
// in-memory fake Redis lock. No network access.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { archiveDossier, type ArchiveDeps } from '../documentsArchive';
import { acquireLock, DOCUMENTS_LOCK_PREFIX } from '../distributedLock';
import { InMemoryLedger } from '../ledger';
import { FIELD_DOCUMENTI, type GhlContact } from '../ghlClient';
import { createFakeLockClient } from './fakes/fakeLockClient';

function createFakeGhl(initialDocumenti: Record<string, unknown> = {}) {
  let documentiValue: Record<string, unknown> = { ...initialDocumenti };
  let uploadCalls = 0;

  const deps: ArchiveDeps = {
    getContact: async (contactId: string): Promise<GhlContact> => ({
      id: contactId,
      locationId: 'loc1',
      customFields: [{ id: FIELD_DOCUMENTI, value: { ...documentiValue } }],
    }),
    updateContact: async (contactId, patch) => {
      const docField = patch.customFields?.find(f => f.id === FIELD_DOCUMENTI);
      if (docField) documentiValue = { ...(docField.value as Record<string, unknown>) };
      return { id: contactId, locationId: 'loc1', customFields: [{ id: FIELD_DOCUMENTI, value: { ...documentiValue } }] };
    },
    uploadDocument: async (_contactId, fileName) => {
      uploadCalls++;
      // REPLACES the whole field — matches the real, empirically-confirmed
      // single-file-upload behavior (see submission.ts history).
      documentiValue = {
        [`uuid-${fileName}`]: { meta: { originalname: fileName }, url: `https://fake.example/${fileName}`, documentId: `doc-${fileName}` },
      };
      return { status: 200, body: { documentId: `doc-${fileName}` } };
    },
  };

  return {
    deps,
    getUploadCalls: () => uploadCalls,
    getDocumentiValue: () => documentiValue,
  };
}

function fileNamesOf(documentiValue: Record<string, unknown>): string[] {
  return Object.values(documentiValue)
    .map(entry => (entry as { meta?: { originalname?: string } }).meta?.originalname)
    .filter((name): name is string => Boolean(name));
}

test('happy path: uploads, merges with existing history, and verifies before returning ARCHIVED', async () => {
  const existing = { 'uuid-old': { meta: { originalname: 'old.pdf' }, url: 'https://fake.example/old.pdf', documentId: 'doc-old' } };
  const { deps, getDocumentiValue, getUploadCalls } = createFakeGhl(existing);
  const lockClient = createFakeLockClient();
  const ledger = new InMemoryLedger();
  await ledger.claim('sub1', 'contact1');

  const result = await archiveDossier({
    contactId: 'contact1', fileName: 'new.pdf', pdfBuffer: Buffer.from('pdf'),
    submissionId: 'sub1', ledger, deps, lockClient,
  });

  assert.equal(result.status, 'ARCHIVED');
  assert.equal(getUploadCalls(), 1);
  assert.deepEqual(fileNamesOf(getDocumentiValue()).sort(), ['new.pdf', 'old.pdf']);
});

test('two different submissionIds for the SAME contact, concurrent: both dossiers present (lock serializes the race)', async () => {
  const { deps, getDocumentiValue } = createFakeGhl();
  const lockClient = createFakeLockClient();
  const ledger = new InMemoryLedger();
  await ledger.claim('subA', 'contactX');
  await ledger.claim('subB', 'contactX');

  const [resultA, resultB] = await Promise.all([
    archiveDossier({ contactId: 'contactX', fileName: 'fileA.pdf', pdfBuffer: Buffer.from('a'), submissionId: 'subA', ledger, deps, lockClient }),
    archiveDossier({ contactId: 'contactX', fileName: 'fileB.pdf', pdfBuffer: Buffer.from('b'), submissionId: 'subB', ledger, deps, lockClient }),
  ]);

  assert.equal(resultA.status, 'ARCHIVED');
  assert.equal(resultB.status, 'ARCHIVED');
  assert.deepEqual(fileNamesOf(getDocumentiValue()).sort(), ['fileA.pdf', 'fileB.pdf']);
});

test('two different contacts, concurrent: no mutual blocking (different lock keys)', async () => {
  const ghlX = createFakeGhl();
  const ghlY = createFakeGhl();
  const lockClient = createFakeLockClient();
  const ledger = new InMemoryLedger();
  await ledger.claim('sub1', 'contactX');
  await ledger.claim('sub2', 'contactY');

  const start = Date.now();
  const [resultX, resultY] = await Promise.all([
    archiveDossier({ contactId: 'contactX', fileName: 'x.pdf', pdfBuffer: Buffer.from('x'), submissionId: 'sub1', ledger, deps: ghlX.deps, lockClient }),
    archiveDossier({ contactId: 'contactY', fileName: 'y.pdf', pdfBuffer: Buffer.from('y'), submissionId: 'sub2', ledger, deps: ghlY.deps, lockClient }),
  ]);
  const elapsed = Date.now() - start;

  assert.equal(resultX.status, 'ARCHIVED');
  assert.equal(resultY.status, 'ARCHIVED');
  assert.ok(elapsed < 200, `different contacts must not serialize through the same lock key (elapsed=${elapsed}ms)`);
});

test('crash simulation: fails between upload and the final merge-PUT; a retry recovers previous history + the new file from the persisted snapshot', async () => {
  const oldEntry = { 'uuid-old': { meta: { originalname: 'old.pdf' }, url: 'https://fake.example/old.pdf', documentId: 'doc-old' } };
  const { deps, getDocumentiValue } = createFakeGhl(oldEntry);
  const lockClient = createFakeLockClient();
  const ledger = new InMemoryLedger();
  await ledger.claim('subCrash', 'contactZ');

  let updateContactCalls = 0;
  const crashingDeps: ArchiveDeps = {
    ...deps,
    updateContact: async () => {
      updateContactCalls++;
      throw new Error('simulated crash before the final PUT');
    },
  };

  const firstAttempt = await archiveDossier({
    contactId: 'contactZ', fileName: 'new.pdf', pdfBuffer: Buffer.from('new'),
    submissionId: 'subCrash', ledger, deps: crashingDeps, lockClient,
  });
  assert.equal(firstAttempt.status, 'FAILED_UPLOAD');
  assert.equal(updateContactCalls, 1);

  // GHL already replaced the live field with just the new file — a naive
  // retry re-reading the live field would lose "old.pdf" here.
  assert.deepEqual(fileNamesOf(getDocumentiValue()), ['new.pdf']);

  const entry = await ledger.get('subCrash');
  assert.ok(entry?.documentsSnapshotBeforeUpload, 'snapshot must have been persisted before the upload');
  assert.ok('uuid-old' in (entry!.documentsSnapshotBeforeUpload as Record<string, unknown>));

  const retry = await archiveDossier({
    contactId: 'contactZ', fileName: 'new.pdf', pdfBuffer: Buffer.from('new'),
    submissionId: 'subCrash', ledger, deps, lockClient,
  });

  assert.equal(retry.status, 'ARCHIVED');
  assert.deepEqual(fileNamesOf(getDocumentiValue()).sort(), ['new.pdf', 'old.pdf']);
});

test('lock already held: returns FAILED_UPLOAD without touching GHL at all', async () => {
  const { deps } = createFakeGhl();
  const lockClient = createFakeLockClient();
  const ledger = new InMemoryLedger();
  await ledger.claim('subBlocked', 'contactBlocked');

  // Simulate another execution already holding the lock.
  await acquireLock(`${DOCUMENTS_LOCK_PREFIX}contactBlocked`, { client: lockClient, ttlMs: 10_000 });

  let getContactCalled = false;
  const spiedDeps: ArchiveDeps = {
    ...deps,
    getContact: async (...args) => {
      getContactCalled = true;
      return deps.getContact(...args);
    },
  };

  const result = await archiveDossier({
    contactId: 'contactBlocked', fileName: 'x.pdf', pdfBuffer: Buffer.from('x'),
    submissionId: 'subBlocked', ledger, deps: spiedDeps, lockClient,
    lockMaxWaitMs: 150,
  });

  assert.equal(result.status, 'FAILED_UPLOAD');
  assert.match(result.errorMessage ?? '', /lock/i);
  assert.equal(getContactCalled, false, 'must fail before touching GHL at all');
});

test('at the 10-document limit: no upload is attempted and history is unchanged', async () => {
  const tenExisting: Record<string, unknown> = {};
  for (let i = 0; i < 10; i++) {
    tenExisting[`uuid-${i}`] = { meta: { originalname: `old-${i}.pdf` }, url: `https://fake.example/${i}.pdf`, documentId: `doc-${i}` };
  }
  const { deps, getDocumentiValue, getUploadCalls } = createFakeGhl(tenExisting);
  const lockClient = createFakeLockClient();
  const ledger = new InMemoryLedger();
  await ledger.claim('subLimit', 'contactLimit');

  const result = await archiveDossier({
    contactId: 'contactLimit', fileName: 'new.pdf', pdfBuffer: Buffer.from('new'),
    submissionId: 'subLimit', ledger, deps, lockClient,
  });

  assert.equal(result.status, 'FAILED_UPLOAD');
  assert.equal(getUploadCalls(), 0);
  assert.equal(Object.keys(getDocumentiValue()).length, 10);
});

test("at the 10-document limit but all 10 are GHL-soft-deleted (meta.deleted: true): upload proceeds, since GHL's own \"delete\" leaves the entry in place rather than removing it", async () => {
  // Confirmed empirically against the real sandbox: deleting a Documenti
  // file via the GHL UI does not remove its entry from the field's value —
  // it only sets meta.deleted = true on it. A Contact that looks empty in
  // the dashboard must not still be treated as archive-full.
  const tenDeleted: Record<string, unknown> = {};
  for (let i = 0; i < 10; i++) {
    tenDeleted[`uuid-${i}`] = { meta: { originalname: `old-${i}.pdf`, deleted: true }, url: `https://fake.example/${i}.pdf`, documentId: `doc-${i}` };
  }
  const { deps, getUploadCalls } = createFakeGhl(tenDeleted);
  const lockClient = createFakeLockClient();
  const ledger = new InMemoryLedger();
  await ledger.claim('subSoftDeleted', 'contactSoftDeleted');

  const result = await archiveDossier({
    contactId: 'contactSoftDeleted', fileName: 'new.pdf', pdfBuffer: Buffer.from('new'),
    submissionId: 'subSoftDeleted', ledger, deps, lockClient,
  });

  assert.equal(result.status, 'ARCHIVED');
  assert.equal(getUploadCalls(), 1);
});

test('replay: the same submissionId seen twice (ledger lost the snapshot, GHL still has the file) never re-uploads', async () => {
  const existingFileEntry = {
    'uuid-replay': { meta: { originalname: 'replay.pdf' }, url: 'https://fake.example/replay.pdf', documentId: 'doc-replay' },
  };
  const { deps, getUploadCalls } = createFakeGhl(existingFileEntry);
  const lockClient = createFakeLockClient();
  const ledger = new InMemoryLedger();
  await ledger.claim('subReplay', 'contactReplay');

  const result = await archiveDossier({
    contactId: 'contactReplay', fileName: 'replay.pdf', pdfBuffer: Buffer.from('replay'),
    submissionId: 'subReplay', ledger, deps, lockClient,
  });

  assert.equal(result.status, 'ARCHIVED');
  assert.equal(getUploadCalls(), 0, 'identical filename already present -> upload must be skipped, not duplicated');
});
