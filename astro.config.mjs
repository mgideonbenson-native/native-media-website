import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import { builtPaths } from './src/data/site.ts';

// Publication pages are hidden from search engines until the first item is added, so keep them out of the sitemap too.
const hasPublications = fs.existsSync('./src/content/publications') && fs.readdirSync('./src/content/publications').some((f) => f.endsWith('.md'));
const emptyPublicationPaths = ['/research-and-publications', '/research-and-publications/reports', '/research-and-publications/research-papers'];

// The production address is not decided yet. Change `site` when the domain is confirmed;
// it is used for canonical links, social previews and the sitemap.
export default defineConfig({
  site: 'https://nativemedia.co.tz',
  integrations: [
    sitemap({
      // Only list pages that really exist (placeholder "coming soon" pages are left out).
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, '') || '/';
        return (path === '/' || builtPaths.has(path) || path.startsWith('/african-intelligence/')) && (hasPublications || !emptyPublicationPaths.includes(path)) && path !== '/search' && path !== '/unsubscribe';
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
