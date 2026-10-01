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
        return (path === '/' || builtPaths.has(path) || path.startsWith('/african-intelligence/') || path.startsWith('/research-and-publications/tanzania-economic-diplomacy-review/')) && !path.startsWith('/creative-data/data-and-visuals') && !path.startsWith('/african-intelligence/stories') && path !== '/search' && path !== '/unsubscribe';
      },
    }),
  ],
  // Scripts stay as separate files (never inlined), so a strict Content-Security-Policy can be used.
  build: { inlineStylesheets: 'auto' },
  vite: { build: { assetsInlineLimit: 0 } },
  // Images uploaded in the CMS are served from Sanity's image network.
  image: {
    domains: ['cdn.sanity.io'],
    // Only used when testing against the local mock (scripts/mock-sanity.mjs).
    ...(process.env.SANITY_API_HOST ? { remotePatterns: [{ protocol: 'http', hostname: '127.0.0.1' }] } : {}),
  },
});
