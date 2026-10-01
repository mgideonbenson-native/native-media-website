import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { aiPlatforms } from '../data/site';

export type Episode = CollectionEntry<'episodes'>;
export type Guest = CollectionEntry<'guests'>;

/** All episodes, newest first. */
export async function getEpisodes(): Promise<Episode[]> {
  const all = await getCollection('episodes');
  return all.sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());
}

export async function getGuest(ep: Episode): Promise<Guest> {
  const g = await getEntry(ep.data.guest);
  if (!g) throw new Error(`Guest not found for episode ${ep.id}`);
  return g;
}

export const episodeUrl = (ep: Episode) => `/african-intelligence/episodes/${ep.id}`;
export const guestUrl = (g: Guest) => `/african-intelligence/guests/${g.id}`;

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/**
 * Where to listen. Uses the exact episode link when one has been supplied,
 * otherwise falls back to the show-level link. Platforms with no link yet return href ''.
 */
export function listenLinks(ep?: Episode): { label: string; href: string; exact: boolean }[] {
  const d = ep?.data;
  const own: Record<string, string | undefined> = {
    YouTube: d?.youtubeUrl, 'RSS.com': d?.rssUrl, Spotify: d?.spotifyUrl,
    'Apple Podcasts': d?.appleUrl, 'Amazon Music': d?.amazonUrl,
  };
  return aiPlatforms.map((p) => ({ label: p.label, href: own[p.label] ?? p.href, exact: !!own[p.label] }));
}
