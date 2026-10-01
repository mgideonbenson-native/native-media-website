import { defineCliConfig } from 'sanity/cli';

// Set these when you create the Sanity project (see docs/CMS-GUIDE.md).
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'placeholder',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
});
