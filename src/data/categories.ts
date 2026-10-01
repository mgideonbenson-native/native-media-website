/**
 * Stories are organized in three sections. African Stories has sub-categories; Stories of Opportunity has its own.
 * A story's address is /african-intelligence/stories/<section>/<sub-category>/<story> (or <section>/<story> when the section has none).
 */
export type StorySub = { slug: string; label: string; blurb: string };
export type StorySection = { slug: string; label: string; blurb: string; subs: readonly StorySub[] };

export const storySections: readonly StorySection[] = [
  {
    slug: 'african-stories',
    label: 'African Stories',
    blurb: 'Stories about the people, economies, history and ideas shaping the continent, told with context.',
    subs: [
      { slug: 'business-and-economics', label: 'Business & Economics', blurb: 'Economic stories told with data, sources and context.' },
      { slug: 'african-affairs', label: 'African Affairs', blurb: 'Developments, institutions and people shaping the continent.' },
      { slug: 'history', label: 'History', blurb: 'Historical narratives that give the present its context.' },
      { slug: 'geopolitics', label: 'Geopolitics', blurb: 'Africa’s place in international relations and global shifts.' },
      { slug: 'technology', label: 'Technology', blurb: 'Innovation, infrastructure and digital change across Africa.' },
      { slug: 'infrastructure', label: 'Infrastructure', blurb: 'Energy, transport, trade corridors and the systems behind growth.' },
      { slug: 'society-and-culture', label: 'Society & Culture', blurb: 'The communities, creativity and everyday life behind the headlines.' },
    ],
  },
  {
    slug: 'thought-leadership',
    label: 'Thought Leadership',
    blurb: 'Articles that put forward ideas and perspectives on communication, narrative and Africa’s future.',
    subs: [],
  },
  {
    slug: 'opportunities',
    label: 'Stories of Opportunity',
    blurb: 'Scholarships, fellowships and other opportunities for African talent, with the details people need to apply.',
    subs: [
      { slug: 'scholarships', label: 'Scholarships', blurb: 'Funding for study, with eligibility and deadlines.' },
      { slug: 'fellowships', label: 'Fellowships', blurb: 'Fellowship programmes, with eligibility and deadlines.' },
      { slug: 'other-opportunities', label: 'Other opportunities', blurb: 'Other opportunities for African talent.' },
    ],
  },
];

export const findSection = (slug: string) => storySections.find((s) => s.slug === slug);
export const findSub = (section: string, sub?: string) => findSection(section)?.subs.find((x) => x.slug === sub);
/** The most specific category label for a story, e.g. "Technology" or "Thought Leadership". */
export const storyCategoryLabel = (d: { section: string; sub?: string }) => findSub(d.section, d.sub)?.label ?? findSection(d.section)?.label ?? '';
/** Web address of a story. */
export const storyPath = (story: { id: string; data: { section: string; sub?: string } }) =>
  `/african-intelligence/stories/${story.data.section}${story.data.sub ? `/${story.data.sub}` : ''}/${story.id}`;
/** Every list page: each section, and each sub-category. */
export const allStoryListPaths = () => storySections.flatMap((s) => [`/african-intelligence/stories/${s.slug}`, ...s.subs.map((x) => `/african-intelligence/stories/${s.slug}/${x.slug}`)]);

/** Every story is labelled with one of these so readers always know what they are reading. */
export const storyKinds = {
  reporting: { label: 'Reporting', text: 'Original reporting based on sources and interviews.' },
  'research-analysis': { label: 'Research-based analysis', text: 'Analysis built on documented research and data.' },
  opinion: { label: 'Opinion', text: 'A view or commentary. It is not a statement of fact.' },
  'institutional-statement': { label: 'Institutional statement', text: 'A statement from an institution, published as supplied.' },
  sponsored: { label: 'Sponsored content', text: 'Paid content. It does not determine Native Media’s editorial coverage.' },
} as const;
export type StoryKind = keyof typeof storyKinds;
