import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { IMG, LIVE, cms, cmsEnabled, ptToHtml, ptToText, sourceLine, toImage } from './lib/cms';

/**
 * Content comes from ONE of two places:
 *  - the Sanity CMS, when SANITY_PROJECT_ID is set (see docs/CMS-GUIDE.md), or
 *  - local files in src/content (the default, and what you see today).
 * Pages and components do not care which; both produce the same data shape.
 *
 * Local mode: to add an episode, copy a file in src/content/episodes, change the details,
 * add its cover image to src/assets/episodes, and add the guest in src/content/guests if new.
 */

/** Loader that reads documents from Sanity, maps them to the collection's shape, and stores them. */
const sanityLoader = (name: string, query: string, map: (d: any) => { id: string; data: any; body?: string; html?: string }) => ({
  name,
  load: async ({ store, parseData, generateDigest, logger }: any) => {
    const docs = await cms<any[]>(query);
    store.clear();
    for (const d of docs) {
      const m = map(d);
      const data = await parseData({ id: m.id, data: m.data });
      store.set({ id: m.id, data, body: m.body ?? '', rendered: { html: m.html ?? '' }, digest: generateDigest(JSON.stringify(d)) });
    }
    logger.info(`${name}: loaded ${docs.length} document(s) from Sanity`);
  },
});
const remoteImage = z.object({ remote: z.literal(true), src: z.string(), width: z.number(), height: z.number(), alt: z.string() });
const links = (l: any[] | undefined) => (l ?? []).map((x) => ({ label: x.label, href: x.href }));

const guests = defineCollection({
  loader: cmsEnabled
    ? sanityLoader('sanity-guests', `*[_type == "guest" && ${LIVE} && bioApproved == true]{ "id": slug.current, name, role, organization, bio, links }`,
        (d) => ({ id: d.id, data: { name: d.name, role: d.role, organization: d.organization ?? undefined, links: links(d.links) }, body: d.bio }))
    : glob({ pattern: '**/*.md', base: './src/content/guests' }),
  schema: z.object({
    name: z.string(),
    role: z.string(), // e.g. "Founder and CEO"
    organization: z.string().optional(),
    links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
  }),
});

const episodes = defineCollection({
  loader: cmsEnabled
    ? sanityLoader('sanity-episodes', `*[_type == "episode" && ${LIVE} && count(*[_type == "guest" && _id == ^.guest._ref && ${LIVE} && bioApproved == true]) > 0]{
        "id": slug.current, title, number, "guest": guest->slug.current, publishDate, summary, cover ${IMG}, topics, themes, format, duration,
        youtubeUrl, rssUrl, spotifyUrl, appleUrl, amazonUrl, transcript, body[]{ ..., _type == "image" => { ..., "url": asset->url } } }`,
        (d) => ({ id: d.id, html: ptToHtml(d.body), body: ptToText(d.body), data: {
          title: d.title, number: d.number, guest: d.guest, publishDate: d.publishDate, summary: d.summary, cover: toImage(d.cover), coverAlt: d.cover?.alt ?? d.title,
          topics: d.topics ?? [], themes: d.themes ?? [], format: d.format ?? 'interview', duration: d.duration ?? undefined, youtubeUrl: d.youtubeUrl ?? undefined, rssUrl: d.rssUrl ?? undefined,
          spotifyUrl: d.spotifyUrl ?? undefined, appleUrl: d.appleUrl ?? undefined, amazonUrl: d.amazonUrl ?? undefined, transcript: Boolean(d.transcript) } }))
    : glob({ pattern: '**/*.md', base: './src/content/episodes' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      number: z.number(),
      guest: reference('guests'),
      publishDate: z.coerce.date(),
      summary: z.string(), // short text for cards and search results
      cover: z.union([image(), remoteImage]),
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
 * Stories. Entries with `demo: true` are layout demonstrations only:
 * they are labelled on the page, kept out of search engines and the sitemap.
 * Set `demo: false` (or delete the line) when real, approved content replaces them.
 */
const stories = defineCollection({
  loader: cmsEnabled
    ? sanityLoader('sanity-stories', `*[_type == "story" && ${LIVE} && defined(author->name)]{
        "id": slug.current, title, subtitle, section, sub, opportunity, kind, "author": author->name, date, featured, heroImage ${IMG}, sources, "sponsor": sponsor->name, body[]{ ..., _type == "image" => { ..., "url": asset->url } } }`,
        (d) => ({ id: d.id, html: ptToHtml(d.body), body: ptToText(d.body), data: {
          title: d.title, subtitle: d.subtitle, section: d.section, sub: d.sub ?? undefined, opportunity: d.opportunity ?? undefined, kind: d.kind, author: d.author, date: d.date ?? undefined, featured: Boolean(d.featured),
          image: toImage(d.heroImage), sources: (d.sources ?? []).map(sourceLine), sponsor: d.sponsor ?? undefined, demo: false } }))
    : glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    section: z.enum(['african-stories', 'thought-leadership', 'opportunities']),
    sub: z.enum(['business-and-economics', 'african-affairs', 'history', 'geopolitics', 'technology', 'infrastructure', 'society-and-culture', 'scholarships', 'fellowships', 'other-opportunities']).optional(),
    // Only for Stories of Opportunity: the practical details people need.
    opportunity: z.object({ organization: z.string().optional(), deadline: z.string().optional(), eligibility: z.string().optional(), location: z.string().optional(), applyUrl: z.url().optional() }).optional(),
    kind: z.enum(['reporting', 'research-analysis', 'opinion', 'institutional-statement', 'sponsored']),
    author: z.string(),
    date: z.coerce.date().optional(),
    featured: z.boolean().default(false),
    art: z.enum(['signal', 'contour', 'frames', 'lens', 'pages', 'grid']).default('frames'),
    sources: z.array(z.string()).default([]),
    image: remoteImage.optional(),
    sponsor: z.string().optional(),
    demo: z.boolean().default(true),
  }),
});

export const collections = { guests, episodes, stories };
