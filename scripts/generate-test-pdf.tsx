// Dev utility — generates ONE local PDF dossier from a complete mock
// Luxosa Test result, to validate layout/typography before any GHL/email
// integration exists. Does not call any external API.
//
// Run with: npm run pdf:test   (see package.json)

import path from 'node:path';
import { renderToFile } from '@react-pdf/renderer';
import { buildLuxosaTestResult, type Answers } from '../src/lib/luxosaTest/result';
import { resolveMediaForResult } from '../src/lib/luxosaTest/media';
import { LuxosaTestDossier } from '../server/luxosaTest/pdf';

const mockAnswers: Answers = {
  d1: 'd1_mossi',
  d2: ['d2_fragili', 'd2_secchi'],
  d3: 'd3_colore',
  d4c: 'd4c_decolorazioni',
  d5c: ['d5c_spegne', 'd5c_danneggia'],
  d6c: 'd6c_frequente',
  d7c: 'd7c_bianco',
  d8: 'd8_2_3',
  d9: 'd9_non_piacciono',
  d10: "Vorrei finalmente smettere di nascondere la ricrescita bianca e trovare un modo elegante per accompagnarla, senza stress ogni tre settimane.",
};

const result = buildLuxosaTestResult(mockAnswers);

// Real-only pool: today that's just the 3 approved percorso heroes.
// No experience/before-after media exists yet, so those stay empty —
// this is the most realistic dossier obtainable with today's assets.
const media = resolveMediaForResult(result, {}, 'pdf');

const contact = {
  nome: 'Maria',
  cognome: 'Rossi',
  email: 'maria.rossi@example.com',
  whatsapp: '+39 345 123 4567',
};

const outPath = path.join(process.cwd(), 'tmp-luxosa-test-dossier-v3.pdf');

await renderToFile(
  <LuxosaTestDossier result={result} contact={contact} submittedAt={new Date('2026-10-08')} media={media} />,
  outPath,
);

console.log('percorsoPublic:', result.percorsoPublic);
console.log('attentionLevel:', result.attentionLevel);
console.log('esperienze:', result.esperienze.map(e => e.es.nome).join(', '));
console.log('PDF written to:', outPath);
