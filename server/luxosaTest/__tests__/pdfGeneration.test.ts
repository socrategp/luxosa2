import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildDossierFileName } from '../pdfGeneration';

test('naming: Luxosa_Test_Nome_Cognome_YYYY-MM-DD.pdf', () => {
  const date = new Date(Date.UTC(2026, 9, 10)); // 2026-10-10
  assert.equal(buildDossierFileName('Maria', 'Rossi', date), 'Luxosa_Test_Maria_Rossi_2026-10-10.pdf');
});

test('naming sanitizes spaces and punctuation out of names', () => {
  const date = new Date(Date.UTC(2026, 0, 5));
  const fileName = buildDossierFileName("Maria Lù", "D'Angelo-Smith", date);
  assert.equal(fileName, 'Luxosa_Test_MariaLù_DAngeloSmith_2026-01-05.pdf');
});

test('naming falls back to a safe placeholder for an empty name part', () => {
  const date = new Date(Date.UTC(2026, 0, 1));
  const fileName = buildDossierFileName('', 'Rossi', date);
  assert.equal(fileName, 'Luxosa_Test_Cliente_Rossi_2026-01-01.pdf');
});
