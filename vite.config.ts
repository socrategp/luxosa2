import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(async ({ isSsrBuild }) => {
  const plugins = [react(), tailwindcss()];
  try {
    // @ts-ignore
    const m = await import('./.vite-source-tags.js');
    plugins.push(m.sourceTags());
  } catch {}
  return {
    plugins,
    server: { port: 5176 },
    // The prerender bundle (scripts/prerender.mjs) needs no copy of public/.
    build: { copyPublicDir: !isSsrBuild },
    // The browser ships only Italian; other languages load on demand (src/i18n/loadLanguage.ts).
    resolve: {
      alias: [{ find: /^\.\/resources\.js$/, replacement: fileURLToPath(new URL('./src/i18n/resources.browser.ts', import.meta.url)) }],
    },
  };
})
