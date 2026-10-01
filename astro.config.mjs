import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { builtPaths } from './src/data/site.ts';

// The production address is not decided yet. Change `site` when the domain is confirmed;
// it is used for canonical links, social previews and the sitemap.
export default defineConfig({
  site: 'https://nativemedia.co.tz',
  integrations: [
    sitemap({
      // Only list pages that really exist (placeholder "coming soon" pages are left out).
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, '') || '/';
        return (path === '/' || builtPaths.has(path) || path.startsWith('/african-intelligence/')) && !path.startsWith('/stories') && !path.startsWith('/productions') && path !== '/search';
      },
    }),
  ],
  build: { inlineStylesheets: 'auto' },
});
