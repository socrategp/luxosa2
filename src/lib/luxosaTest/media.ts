// ---------------------------------------------------------------
// LUXOSA TEST — MEDIA LAYER (editorial, separate from scoring)
// This module NEVER influences buildLuxosaTestResult() — it only maps
// an already-computed LuxosaTestResult to optional visual assets, for
// consumers that want to render richer web/PDF output.
//
// Empty by default: no real assets are wired in until explicitly
// approved (see CLAUDE.md-equivalent notes in the PR/report). DEV
// placeholders live in a separate module (media.devPlaceholders.ts)
// that only dev-only entry points may import — never this file.
// ---------------------------------------------------------------

import type { EsperienzaDef, PublicPercorso, LuxosaTestResult } from './result';

export type LuxosaTestMediaType = 'hero' | 'experience' | 'product' | 'video';
export type LuxosaTestMediaChannel = 'web' | 'pdf';

// Named aspect/layout variants a consumer (web or PDF) can lay out
// differently. Not every type needs every aspect — this is just the
// shared vocabulary; each renderer picks sensible defaults per `type`
// when `aspect` is omitted (hero -> landscape-3-2, experience/product
// -> portrait-4-5).
export type LuxosaTestMediaAspect =
  | 'landscape-16-9'
  | 'landscape-3-2'
  | 'portrait-4-5'
  | 'portrait-3-4'
  | 'square';

export interface LuxosaTestMediaAsset {
  id: string;
  type: LuxosaTestMediaType;
  /** Percorsi this asset applies to. Omit/empty = generic, any percorso. */
  themes?: PublicPercorso[];
  /** Esperienza names (EsperienzaDef['nome']) this asset illustrates. */
  experienceNames?: string[];
  /** Layout hint for renderers. Defaults depend on `type` — see above. */
  aspect?: LuxosaTestMediaAspect;
  imageSrc?: string;
  thumbnailSrc?: string;
  videoUrl?: string;
  title?: string;
  caption?: string;
  alt: string;
  channels: LuxosaTestMediaChannel[];
  /** Must be true for the asset to ever be resolved/shown. */
  approved: boolean;
}

export interface LuxosaTestBeforeAfterAsset {
  id: string;
  experienceNames?: string[];
  beforeImage: string;
  afterImage: string;
  duringImage?: string;
  caption?: string;
  disclaimer?: string;
  approved: boolean;
}

export interface LuxosaTestProductAsset {
  id: string;
  name: string;
  description?: string;
  packshotSrc?: string;
  textureImages?: string[];
  videoUrl?: string;
  productPageUrl?: string;
  experienceNames?: string[];
  approved: boolean;
}

// -- REAL REGISTRY -------------------------------------------------
// First real media (approved 2026-10-08): the 3 percorso-hero photos
// already used on IPercorsiPage for the matching percorso. `imageSrc`
// is the public web path — the only one a browser needs. @react-pdf
// cannot embed WebP, so the PDF renderer resolves its own PNG
// derivative via server/luxosaTest/pdfAssets.ts; this module stays
// browser-safe and knows nothing about that conversion.

export const LUXOSA_TEST_MEDIA_REGISTRY: LuxosaTestMediaAsset[] = [
  {
    id: 'hero-benessere',
    type: 'hero',
    themes: ['benessere'],
    aspect: 'landscape-3-2',
    imageSrc: '/images/BenEssere.webp',
    alt: 'Percorso BenEssere',
    channels: ['web', 'pdf'],
    approved: true,
  },
  {
    id: 'hero-colorlux',
    type: 'hero',
    themes: ['colorlux'],
    aspect: 'landscape-3-2',
    imageSrc: '/images/colorlux.webp',
    alt: 'Percorso ColorLux',
    channels: ['web', 'pdf'],
    approved: true,
  },
  {
    id: 'hero-rituale',
    type: 'hero',
    themes: ['rituale'],
    aspect: 'landscape-3-2',
    imageSrc: '/images/rituale_luxosa.webp',
    alt: 'Percorso Rituale Luxosa',
    channels: ['web', 'pdf'],
    approved: true,
  },
];
export const LUXOSA_TEST_BEFORE_AFTER_REGISTRY: LuxosaTestBeforeAfterAsset[] = [];
export const LUXOSA_TEST_PRODUCT_REGISTRY: LuxosaTestProductAsset[] = [];

// -- RESOLVER --------------------------------------------------------

export interface ResolvedLuxosaTestMedia {
  hero: LuxosaTestMediaAsset | null;
  experienceMedia: Record<string, LuxosaTestMediaAsset[]>;
  beforeAfter: LuxosaTestBeforeAfterAsset[];
  products: LuxosaTestProductAsset[];
}

function matchesPercorso(asset: { themes?: PublicPercorso[] }, pub: PublicPercorso): boolean {
  return !asset.themes || asset.themes.length === 0 || asset.themes.includes(pub);
}

function matchesExperiences(asset: { experienceNames?: string[] }, names: string[]): boolean {
  return !!asset.experienceNames && asset.experienceNames.some(n => names.includes(n));
}

/**
 * Pure function: given a computed result and explicit asset pools, returns
 * the media relevant to that result. Callers decide which pools to pass —
 * this function has no notion of "dev mode" itself.
 */
export function resolveMediaForResult(
  result: Pick<LuxosaTestResult, 'percorsoPublic' | 'esperienze'>,
  pools: {
    media?: LuxosaTestMediaAsset[];
    beforeAfter?: LuxosaTestBeforeAfterAsset[];
    products?: LuxosaTestProductAsset[];
  } = {},
  channel?: LuxosaTestMediaChannel,
): ResolvedLuxosaTestMedia {
  const media = (pools.media ?? LUXOSA_TEST_MEDIA_REGISTRY).filter(
    a => a.approved && (!channel || a.channels.includes(channel)),
  );
  const beforeAfterPool = (pools.beforeAfter ?? LUXOSA_TEST_BEFORE_AFTER_REGISTRY).filter(a => a.approved);
  const productsPool = (pools.products ?? LUXOSA_TEST_PRODUCT_REGISTRY).filter(a => a.approved);

  const esperienzaNames = result.esperienze.map((e: { es: EsperienzaDef }) => e.es.nome);

  const hero = media.find(a => a.type === 'hero' && matchesPercorso(a, result.percorsoPublic)) ?? null;

  const experienceMedia: Record<string, LuxosaTestMediaAsset[]> = {};
  for (const name of esperienzaNames) {
    const matches = media.filter(a => a.type === 'experience' && a.experienceNames?.includes(name));
    if (matches.length > 0) experienceMedia[name] = matches;
  }

  const beforeAfter = beforeAfterPool.filter(a => matchesExperiences(a, esperienzaNames));
  const products = productsPool.filter(a => !a.experienceNames || matchesExperiences(a, esperienzaNames));

  return { hero, experienceMedia, beforeAfter, products };
}

export const EMPTY_RESOLVED_MEDIA: ResolvedLuxosaTestMedia = {
  hero: null,
  experienceMedia: {},
  beforeAfter: [],
  products: [],
};
