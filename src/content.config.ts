import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * African Intelligence content. To add an episode: copy a file in src/content/episodes,
 * change the details, add its cover image to src/assets/episodes, and add the guest
 * in src/content/guests if new. The site rebuilds the pages automatically.
 */
const guests = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guests' }),
  schema: z.object({
    name: z.string(),
    role: z.string(), // e.g. "Founder and CEO"
    organization: z.string().optional(),
    links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
  }),
});

const episodes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/episodes' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      number: z.number(),
      guest: reference('guests'),
      publishDate: z.coerce.date(),
      summary: z.string(), // short text for cards and search results
      cover: image(),
      coverAlt: z.string(),
      topics: z.array(z.string()).default([]),
      themes: z.array(z.string()).default([]), // "In this episode, we explore" bullets
      format: z.enum(['interview', 'conversation']).default('interview'),
      duration: z.string().optional(), // e.g. "42 min" (add when known)
      // Episode-level links. Leave empty until the exact episode links are supplied.
      youtubeUrl: z.url().optional(),
      rssUrl: z.url().optional(),
      spotifyUrl: z.url().optional(),
      appleUrl: z.url().optional(),
      amazonUrl: z.url().optional(),
      transcript: z.boolean().default(false),
    }),
});

/**
 * Stories and productions. Entries with `demo: true` are layout demonstrations only:
 * they are labelled on the page, kept out of search engines and the sitemap.
 * Set `demo: false` (or delete the line) when real, approved content replaces them.
 */
const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    category: z.enum(['business-and-economics', 'african-affairs', 'history', 'geopolitics', 'technology', 'infrastructure', 'society-and-culture']),
    kind: z.enum(['reporting', 'research-analysis', 'opinion', 'institutional-statement', 'sponsored']),
    author: z.string(),
    date: z.coerce.date().optional(),
    featured: z.boolean().default(false),
    art: z.enum(['signal', 'contour', 'frames', 'lens', 'pages', 'grid']).default('frames'),
    sources: z.array(z.string()).default([]),
    demo: z.boolean().default(true),
  }),
});

const productions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/productions' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['documentaries', 'corporate-films', 'motion-graphics', 'visual-explainers']),
    synopsis: z.string(),
    duration: z.string().optional(),
    releaseDate: z.coerce.date().optional(),
    credits: z.array(z.object({ role: z.string(), name: z.string() })).default([]),
    videoUrl: z.url().optional(), // YouTube/Vimeo link, added when the real project is published
    featured: z.boolean().default(false),
    art: z.enum(['signal', 'contour', 'frames', 'lens', 'pages', 'grid']).default('lens'),
    demo: z.boolean().default(true),
  }),
});

export const collections = { guests, episodes, stories, productions };
