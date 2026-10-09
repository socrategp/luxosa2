// ---------------------------------------------------------------
// LUXOSA TEST — DEV-ONLY MEDIA PLACEHOLDERS
//
// NEVER imported by production code paths. This file exists only so
// the new PDF/web layout can be checked for spacing, proportions and
// page breaks before real photography is approved.
//
// Every asset here is a neutral inline SVG (no binary files added to
// the repo) that visibly says "DEV PLACEHOLDER" — never a fabricated
// hair result, before/after, or product shot.
//
// Import this ONLY from:
//   - scripts/generate-test-pdf-media-preview.tsx (Node, never bundled)
//   - a browser call site explicitly gated behind `import.meta.env.DEV`
//     (Vite strips both the branch and this chunk from production builds)
// ---------------------------------------------------------------

import type { LuxosaTestMediaAsset, LuxosaTestBeforeAfterAsset } from './media';

function placeholderSvg(label: string, bg: string, fg: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <rect width="800" height="600" fill="${bg}"/>
    <rect x="16" y="16" width="768" height="568" fill="none" stroke="${fg}" stroke-width="2" stroke-dasharray="10 8"/>
    <text x="400" y="290" font-family="Helvetica, Arial, sans-serif" font-size="28" letter-spacing="4" fill="${fg}" text-anchor="middle">DEV PLACEHOLDER</text>
    <text x="400" y="330" font-family="Helvetica, Arial, sans-serif" font-size="16" fill="${fg}" text-anchor="middle">${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const ECRU = '#F1EEE5';
const BRASS_MUTED = '#9E8868';

// Hero placeholders removed (2026-10-09): all 3 percorso heroes now use
// real, approved photography — see LUXOSA_TEST_MEDIA_REGISTRY in media.ts.

const ESPERIENZA_NOMI = [
  'Piega Lux',
  'Taglio Signature',
  'Nuances',
  'Luce Signature',
  'RicciOsa',
  'RicciOso',
  'Cheratina Nutrizione Pro',
  'Area Benessere',
  'Consulenze Specialistiche',
];

export const DEV_PLACEHOLDER_EXPERIENCE_MEDIA: LuxosaTestMediaAsset[] = ESPERIENZA_NOMI.map(nome => ({
  id: `dev-placeholder-experience-${nome.toLowerCase().replace(/\s+/g, '-')}`,
  type: 'experience',
  experienceNames: [nome],
  imageSrc: placeholderSvg(nome, ECRU, BRASS_MUTED),
  alt: `[DEV PLACEHOLDER] immagine esperienza ${nome}`,
  channels: ['web', 'pdf'],
  approved: true,
}));

export const DEV_PLACEHOLDER_BEFORE_AFTER: LuxosaTestBeforeAfterAsset[] = [
  {
    id: 'dev-placeholder-before-after-luce-signature',
    experienceNames: ['Luce Signature'],
    beforeImage: placeholderSvg('Prima — Luce Signature', ECRU, BRASS_MUTED),
    afterImage: placeholderSvg('Dopo — Luce Signature', ECRU, BRASS_MUTED),
    caption: '[DEV PLACEHOLDER] sequenza prima/dopo',
    disclaimer: 'Risultati puramente dimostrativi, non reali — solo per verificare il layout.',
    approved: true,
  },
];
