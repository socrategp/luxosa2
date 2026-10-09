// Reusable web media slot for the Luxosa Test report (hero / esperienza /
// before-after). Not yet mounted anywhere — predisposed for when real,
// approved assets are wired into LUXOSA_TEST_MEDIA_REGISTRY (see
// src/lib/luxosaTest/media.ts). Renders nothing when no asset is given,
// so today's UX is completely unaffected.

import type { LuxosaTestMediaAsset } from '../../lib/luxosaTest/media';

interface MediaFigureProps {
  asset: LuxosaTestMediaAsset | null | undefined;
  className?: string;
  aspect?: 'square' | 'landscape' | 'portrait';
}

const ASPECT_CLASS: Record<NonNullable<MediaFigureProps['aspect']>, string> = {
  square: 'aspect-square',
  landscape: 'aspect-[4/3]',
  portrait: 'aspect-[3/4]',
};

export default function MediaFigure({ asset, className = '', aspect = 'landscape' }: MediaFigureProps) {
  if (!asset?.imageSrc) return null;
  const isDevPlaceholder = asset.id.startsWith('dev-placeholder');

  return (
    <figure className={`${ASPECT_CLASS[aspect]} overflow-hidden ${className}`}>
      <img
        src={asset.imageSrc}
        alt={asset.alt}
        loading="lazy"
        className="w-full h-full object-cover"
      />
      {isDevPlaceholder && (
        <figcaption className="text-[9px] tracking-[0.2em] uppercase text-brass-muted/70 mt-1">
          Dev placeholder
        </figcaption>
      )}
      {!isDevPlaceholder && asset.caption && (
        <figcaption className="text-[11px] text-anthracite/55 font-light mt-2">{asset.caption}</figcaption>
      )}
    </figure>
  );
}
