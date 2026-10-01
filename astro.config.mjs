import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The production address is not decided yet. Change `site` when the domain is confirmed;
// it is used for canonical links, social previews and the sitemap.
export default defineConfig({
  site: 'https://nativemedia.example',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
});
