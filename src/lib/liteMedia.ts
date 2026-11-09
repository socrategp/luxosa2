type NetworkInformationLike = { saveData?: boolean };

// True when the visitor asked for less data or less motion: hero videos then
// show their poster instead of downloading and autoplaying.
export function prefersStillMedia(): boolean {
  if (typeof window === 'undefined') return false;
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  return Boolean(connection?.saveData) || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
