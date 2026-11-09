import { useSyncExternalStore } from 'react';

type NetworkInformationLike = { saveData?: boolean };
export type HeroMedia = 'pending' | 'video' | 'still';

// True when the visitor asked for less data or less motion: hero videos then
// show their poster instead of downloading and autoplaying.
export function prefersStillMedia(): boolean {
  if (typeof window === 'undefined') return false;
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  return Boolean(connection?.saveData) || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const subscribe = () => () => {};

// 'pending' in the prerendered HTML and during hydration, so the hero video is
// requested only once the page code runs (as before prerendering) and never
// competes with it for bandwidth.
export function useHeroMedia(): HeroMedia {
  return useSyncExternalStore(subscribe, () => (prefersStillMedia() ? 'still' : 'video'), () => 'pending');
}
