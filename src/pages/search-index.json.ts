import { getCollection } from 'astro:content';
import { capabilities } from '../data/capabilities';
import { allPaths, builtPaths } from '../data/site';
import { storyCategories, productionCategories } from '../data/categories';

/**
 * Builds the site-wide search index at build time.
 * Demonstration stories/productions are left out so they never appear in real searches.
 */
export async function GET() {
  const entries: { type: string; title: string; text: string; href: string }[] = [];
  const pages = allPaths.filter((p) => builtPaths.has(p.href) && !p.href.startsWith('/what-we-do/') && p.href !== '/search');
  pages.forEach((p) => entries.push({ type: 'Page', title: p.label, text: '', href: p.href }));
  capabilities.forEach((c) => entries.push({ type: 'Capability', title: c.title, text: `${c.tagline} ${c.includes.join(' ')}`, href: `/what-we-do/${c.slug}` }));
  for (const e of await getCollection('episodes')) {
    entries.push({ type: 'Podcast episode', title: e.data.title, text: `${e.data.summary} ${e.data.topics.join(" ")} ${e.data.themes.join(" ")} ${e.body ?? ""}`, href: `/african-intelligence/episodes/${e.id}` });
  }
  for (const g of await getCollection('guests')) {
    entries.push({ type: 'Guest', title: g.data.name, text: `${g.data.role} ${g.data.organization ?? ''} ${g.body ?? ''}`, href: `/african-intelligence/guests/${g.id}` });
  }
  for (const s of await getCollection('stories')) {
    if (s.data.demo) continue;
    const cat = storyCategories.find((c) => c.slug === s.data.category)!.label;
    entries.push({ type: 'Story', title: s.data.title, text: `${s.data.subtitle} ${cat}`, href: `/stories/${s.data.category}/${s.id}` });
  }
  for (const p of await getCollection('productions')) {
    if (p.data.demo) continue;
    const cat = productionCategories.find((c) => c.slug === p.data.category)!.label;
    entries.push({ type: 'Production', title: p.data.title, text: `${p.data.synopsis} ${cat}`, href: `/productions/${p.data.category}/${p.id}` });
  }
  return new Response(JSON.stringify(entries), { headers: { 'Content-Type': 'application/json' } });
}
