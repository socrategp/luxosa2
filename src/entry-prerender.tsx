/* eslint-disable react-refresh/only-export-components -- build-time entry, never hot-reloaded */
// Build-time only (vite build --ssr): renders each public page to static HTML
// so search engines and AI assistants read the real content without running
// JavaScript. Used by scripts/prerender.mjs; never shipped to the browser.
import { prerender } from 'react-dom/static';
import { StaticRouter } from 'react-router-dom';
import { AppContent } from './App';
import './i18n';

export { PAGES, absoluteUrl, buildPageStructuredData } from './seo/seoConfig';
export { SITE_URL } from './seo/site';
export { getSalonToday } from './lib/messinaCavourHours';

export async function render(url: string): Promise<string> {
  const { prelude } = await prerender(
    <StaticRouter location={url}>
      <AppContent />
    </StaticRouter>,
  );
  return new Response(prelude).text();
}
