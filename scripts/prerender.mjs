// Writes one static HTML file per public page (dist/<path>/index.html) with its
// own title, description, canonical, social tags, structured data and the page
// content. The content goes in a <noscript> after the app root: browsers running
// JavaScript never turn it into elements (no extra layout, images or fonts, the
// site starts exactly as before), while crawlers and AI assistants that read the
// raw HTML get the full text, and visitors without JavaScript see a real page.
// The untouched SPA template is kept as dist/app-shell.html for every other URL
// (see vercel.json). A page that fails to render keeps the SPA behaviour: the
// build never breaks because of the prerender.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST = 'dist';
const SSR_ENTRY = '.ssr/entry-prerender.js';

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

const ssr = await import(pathToFileURL(SSR_ENTRY).href);
const template = readFileSync(join(DIST, 'index.html'), 'utf8');
writeFileSync(join(DIST, 'app-shell.html'), template);

// Entrance animations start from opacity 0; without JavaScript nothing would
// animate them in, so the static copy drops those starting styles.
const visibleWithoutScript = (html) => html.replace(/opacity:0;?/g, '');

const todayKey = ssr.getSalonToday();
const homePosterPreload = /\s*<link rel="preload" as="image" href="\/images\/hero_lamaison_poster\.webp"[^>]*>/;

for (const page of ssr.PAGES) {
  let body;
  try {
    body = await ssr.render(page.path);
  } catch (error) {
    console.warn(`[prerender] ${page.path} skipped: ${error instanceof Error ? error.message : error}`);
    continue;
  }
  const url = ssr.absoluteUrl(page.path);
  const image = `${ssr.SITE_URL}${page.image}`;
  const head = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    ...(page.noindex ? [`<meta name="robots" content="noindex, nofollow" />`] : []),
    ...ssr.buildPageStructuredData(page, todayKey).map(jsonLd),
  ].join('\n    ');

  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(page.description)}" />`)
    .replace('</head>', `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root"></div><noscript>${visibleWithoutScript(body)}</noscript>`);
  if (page.path !== '/') html = html.replace(homePosterPreload, '');

  const file = page.path === '/' ? join(DIST, 'index.html') : join(DIST, page.path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log(`[prerender] ${page.path} (${Math.round(body.length / 1024)} kB of HTML)`);
}

const lastmod = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ssr.PAGES.filter((page) => !page.noindex).map((page) => `  <url><loc>${ssr.absoluteUrl(page.path)}</loc><lastmod>${lastmod}</lastmod><priority>${page.priority.toFixed(1)}</priority></url>`).join('\n')}
</urlset>
`;
writeFileSync(join(DIST, 'sitemap.xml'), sitemap);
rmSync('.ssr', { recursive: true, force: true });
