// Maps a public web image path (as stored in media.ts, e.g.
// "/images/colorlux.webp") to its PDF-safe derivative, because
// @react-pdf/renderer cannot embed WebP (confirmed empirically — no
// error, image silently omitted).
//
// Derivatives live in server/luxosaTest/assets/pdf-derived/ and are
// produced by scripts/convert-hero-assets-for-pdf.mjs — never by
// touching the original asset in public/images/.
//
// Any future asset that is already PNG/JPG needs no entry here:
// resolvePdfImageSrc falls through to the original path unchanged.

import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Resolved against the current working directory rather than
// import.meta.url: once this module is bundled (esbuild inlines it
// into a single file under .tmp/), import.meta.url points at the
// bundle's location, not this file's original directory, breaking
// relative resolution. These scripts always run from the repo root.
const ASSET_ROOT = path.join(process.cwd(), 'server/luxosaTest/assets/pdf-derived');

// @react-pdf/renderer's Node image loader parses `src` with `new URL()`
// to decide local-vs-remote. A raw Windows path ("C:\Users\...") parses
// with protocol "c:", gets misread as a remote URL, and silently fails
// (the fetch never throws loudly — the image is just never embedded).
// pathToFileURL gives it a real "file:///C:/..." URL it recognizes.
const DERIVATIVES: Record<string, string> = {
  '/images/BenEssere.webp': pathToFileURL(path.join(ASSET_ROOT, 'benessere-hero.png')).href,
  '/images/colorlux.webp': pathToFileURL(path.join(ASSET_ROOT, 'colorlux-hero.png')).href,
  '/images/rituale_luxosa.webp': pathToFileURL(path.join(ASSET_ROOT, 'rituale-hero.png')).href,
};

export function resolvePdfImageSrc(publicPath: string): string {
  return DERIVATIVES[publicPath] ?? publicPath;
}
