// Dev utility — same mock result as generate-test-pdf.tsx, but resolved
// against the DEV-ONLY placeholder media pools, to check how the dossier
// looks once hero/experience/before-after visuals are present.
//
// This is the ONLY script allowed to import media.devPlaceholders.ts.
// Run with: npm run pdf:test:media

import path from 'node:path';
import { renderToFile } from '@react-pdf/renderer';
import { buildLuxosaTestResult, type Answers } from '../src/lib/luxosaTest/result';
import { resolveMediaForResult, LUXOSA_TEST_MEDIA_REGISTRY } from '../src/lib/luxosaTest/media';
import {
  DEV_PLACEHOLDER_EXPERIENCE_MEDIA,
  DEV_PLACEHOLDER_BEFORE_AFTER,
} from '../src/lib/luxosaTest/media.devPlaceholders';
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

// Hero comes from the REAL registry (first real media, approved
// 2026-10-08) — only experience/before-after still use DEV placeholders,
// since no real assets exist yet for those.
const media = resolveMediaForResult(
  result,
  {
    media: [...LUXOSA_TEST_MEDIA_REGISTRY, ...DEV_PLACEHOLDER_EXPERIENCE_MEDIA],
    beforeAfter: DEV_PLACEHOLDER_BEFORE_AFTER,
  },
  'pdf',
);

const contact = {
  nome: 'Maria',
  cognome: 'Rossi',
  email: 'maria.rossi@example.com',
  whatsapp: '+39 345 123 4567',
};

const outPath = path.join(process.cwd(), 'tmp-luxosa-test-dossier-media-preview-v3.pdf');

await renderToFile(
  <LuxosaTestDossier result={result} contact={contact} submittedAt={new Date('2026-10-08')} media={media} />,
  outPath,
);

console.log('hero:', media.hero?.id ?? '(none)');
console.log('experience media keys:', Object.keys(media.experienceMedia).join(', ') || '(none)');
console.log('beforeAfter:', media.beforeAfter.map(b => b.id).join(', ') || '(none)');
console.log('PDF written to:', outPath);
