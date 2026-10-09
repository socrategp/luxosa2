// One-off derivation script — @react-pdf/renderer cannot embed WebP
// (confirmed empirically: no error thrown, image silently omitted).
// This converts the 3 approved percorso-hero assets to PNG for PDF use
// ONLY. The original .webp files in public/images/ are never touched.
//
// Run with: node scripts/convert-hero-assets-for-pdf.mjs
// Re-run safely any time — it just overwrites the derived PNGs.

import sharp from 'sharp';
import path from 'node:path';
import { mkdirSync } from 'node:fs';

const SOURCE_DIR = path.join(process.cwd(), 'public/images');
const OUT_DIR = path.join(process.cwd(), 'server/luxosaTest/assets/pdf-derived');

const ASSETS = [
  { src: 'BenEssere.webp', out: 'benessere-hero.png' },
  { src: 'colorlux.webp', out: 'colorlux-hero.png' },
  { src: 'rituale_luxosa.webp', out: 'rituale-hero.png' },
];

mkdirSync(OUT_DIR, { recursive: true });

for (const { src, out } of ASSETS) {
  const inputPath = path.join(SOURCE_DIR, src);
  const outputPath = path.join(OUT_DIR, out);
  // palette: false forces standard truecolor PNG — sharp's `quality`
  // option on .png() triggers pngquant-style palette/indexed output,
  // which @react-pdf/renderer's image decoder failed to embed (blank
  // box, no error) in an earlier test. Truecolor is the safe choice.
  await sharp(inputPath).png({ palette: false }).toFile(outputPath);
  console.log(`${src} -> server/luxosaTest/assets/pdf-derived/${out}`);
}
