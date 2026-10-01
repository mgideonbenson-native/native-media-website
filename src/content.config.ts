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

export const collections = { guests, episodes };
