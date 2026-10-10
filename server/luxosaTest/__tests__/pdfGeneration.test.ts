import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildDossierFileName } from '../pdfGeneration';

test('naming: Luxosa_Test_Nome_Cognome_YYYY-MM-DD_<submissionIdShort>.pdf', () => {
  const date = new Date(Date.UTC(2026, 9, 10)); // 2026-10-10
  assert.equal(
    buildDossierFileName('Maria', 'Rossi', date, 'sub_12345678_rest_ignored'),
    'Luxosa_Test_Maria_Rossi_2026-10-10_sub_1234.pdf',
  );
});

test('naming sanitizes spaces and punctuation out of names', () => {
  const date = new Date(Date.UTC(2026, 0, 5));
  const fileName = buildDossierFileName("Maria Lù", "D'Angelo-Smith", date, 'submissionABC123');
  assert.equal(fileName, 'Luxosa_Test_MariaLù_DAngeloSmith_2026-01-05_submissi.pdf');
});

test('naming falls back to a safe placeholder for an empty name part', () => {
  const date = new Date(Date.UTC(2026, 0, 1));
  const fileName = buildDossierFileName('', 'Rossi', date, 'submissionXYZ');
  assert.equal(fileName, 'Luxosa_Test_Cliente_Rossi_2026-01-01_submissi.pdf');
});

test('stesso submissionId -> stesso filename (idempotenza)', () => {
  const date = new Date(Date.UTC(2026, 5, 15));
  const a = buildDossierFileName('Maria', 'Rossi', date, 'sub_same_id_12345');
  const b = buildDossierFileName('Maria', 'Rossi', date, 'sub_same_id_12345');
  assert.equal(a, b);
});

test('nuovo submissionId, stesso giorno e stessa persona -> filename diverso', () => {
  const date = new Date(Date.UTC(2026, 5, 15));
  const first = buildDossierFileName('Maria', 'Rossi', date, 'sub_aaaaaaaa_first');
  const second = buildDossierFileName('Maria', 'Rossi', date, 'sub_bbbbbbbb_second');
  assert.notEqual(first, second);
});

test('submissionIdShort uses exactly the first 8 characters', () => {
  const date = new Date(Date.UTC(2026, 5, 15));
  const fileName = buildDossierFileName('Maria', 'Rossi', date, 'ABCDEFGHIJKLMNOP');
  assert.equal(fileName, 'Luxosa_Test_Maria_Rossi_2026-06-15_ABCDEFGH.pdf');
});
