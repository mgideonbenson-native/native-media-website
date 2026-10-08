/**
 * Sanity CMS connection (build time only; nothing here runs in visitors' browsers).
 * When SANITY_PROJECT_ID is not set, the site uses the local files in src/content and src/data instead.
 *
 * Publishing rules enforced by every query (see `LIVE`):
 *   1. only PUBLISHED documents are read (drafts are never fetched; no token is used for drafts),
 *   2. the editorial workflow must be "approved",
 *   3. "Publish on or after" must be empty or already in the past (this is how scheduling works).
 */
import { createClient } from '@sanity/client';
import { toHTML, uriLooksSafe } from '@portabletext/to-html';

const env = (k: string): string | undefined => (import.meta as any).env?.[k] ?? process.env[k];
export const projectId = env('SANITY_PROJECT_ID');
export const dataset = env('SANITY_DATASET') || 'production';
export const cmsEnabled = Boolean(projectId);
/**
 * Which collections are read from Sanity once SANITY_PROJECT_ID is set. Default: stories only,
 * so episodes and guests keep coming from the local files until they are copied into Sanity.
 * Set SANITY_COLLECTIONS=stories,episodes,guests (comma separated) to move more of them.
 */
const fromCms = new Set((env('SANITY_COLLECTIONS') || 'stories').split(',').map((x) => x.trim()).filter(Boolean));
export const cmsFor = (collection: string) => cmsEnabled && fromCms.has(collection);

const client = cmsEnabled
  ? createClient({
      projectId: projectId!, dataset, apiVersion: '2025-01-01', useCdn: false, token: env('SANITY_READ_TOKEN'),
      // SANITY_API_HOST lets tests point at a local mock; leave unset in real use.
      ...(env('SANITY_API_HOST') ? { apiHost: env('SANITY_API_HOST'), useProjectHostname: false } : {}),
    })
  : null;

/** GROQ condition shared by every query. */
export const LIVE = `workflow.status == "approved" && (!defined(workflow.publishAt) || workflow.publishAt <= now())`;

export async function cms<T = any[]>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  if (!client) throw new Error('CMS is not configured (SANITY_PROJECT_ID is missing).');
  return client.fetch<T>(query, params, { perspective: 'published' });
}

export type RemoteImage = { remote: true; src: string; width: number; height: number; alt: string };
/** Converts a Sanity image field (fetched with the IMG projection) to the shape the site's <Cover> component expects. */
export const toImage = (i: any): RemoteImage | undefined =>
  i?.url ? { remote: true, src: `${i.url}?auto=format`, width: i.width ?? 1200, height: i.height ?? 800, alt: i.alt ?? '' } : undefined;
/** GROQ projection for an image field. Usage: `cover ${IMG}`. */
export const IMG = `{ alt, "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }`;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
/** Portable Text (the CMS rich-text format) to safe HTML. */
export const ptToHtml = (blocks: any[] | undefined) =>
  blocks?.length
    ? toHTML(blocks, {
        components: {
          types: { image: ({ value }: any) => (value?.url ? `<figure><img src="${esc(value.url)}?auto=format&w=1200" alt="${esc(value.alt ?? '')}" loading="lazy" />${value.caption ? `<figcaption>${esc(value.caption)}</figcaption>` : ''}</figure>` : '') },
          marks: { link: ({ children, value }: any) => (uriLooksSafe(value?.href ?? '') ? `<a href="${esc(value.href)}" rel="noopener noreferrer">${children}</a>` : children) },
        },
      })
    : '';
export const ptToText = (blocks: any[] | undefined) =>
  (blocks ?? []).filter((b) => b._type === 'block').map((b) => (b.children ?? []).map((c: any) => c.text).join('')).join('\n\n');

/** Plain-text list item for a source reference. */
export const sourceLine = (s: any) => [s.title, s.publisher, s.period && `(${s.period})`].filter(Boolean).join(', ');
