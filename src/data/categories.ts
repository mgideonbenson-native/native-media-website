/** Category lists for Stories and Productions (used for navigation, filters and page titles). */
export const storyCategories = [
  { slug: 'business-and-economics', label: 'Business & Economics', blurb: 'Economic stories told with data, sources and context.' },
  { slug: 'african-affairs', label: 'African Affairs', blurb: 'Developments, institutions and people shaping the continent.' },
  { slug: 'history', label: 'History', blurb: 'Historical narratives that give the present its context.' },
  { slug: 'geopolitics', label: 'Geopolitics', blurb: 'Africa’s place in international relations and global shifts.' },
  { slug: 'technology', label: 'Technology', blurb: 'Innovation, infrastructure and digital change across Africa.' },
  { slug: 'infrastructure', label: 'Infrastructure', blurb: 'Energy, transport, trade corridors and the systems behind growth.' },
  { slug: 'society-and-culture', label: 'Society & Culture', blurb: 'The communities, creativity and everyday life behind the headlines.' },
] as const;

/** Every story is labelled with one of these so readers always know what they are reading. */
export const storyKinds = {
  reporting: { label: 'Reporting', text: 'Original reporting based on sources and interviews.' },
  'research-analysis': { label: 'Research-based analysis', text: 'Analysis built on documented research and data.' },
  opinion: { label: 'Opinion', text: 'A view or commentary. It is not a statement of fact.' },
  'institutional-statement': { label: 'Institutional statement', text: 'A statement from an institution, published as supplied.' },
  sponsored: { label: 'Sponsored content', text: 'Paid content. It does not determine Native Media’s editorial coverage.' },
} as const;
export type StoryKind = keyof typeof storyKinds;

export const productionCategories = [
  { slug: 'documentaries', label: 'Documentaries', blurb: 'Documentary storytelling on African history, business, leadership and society.' },
  { slug: 'corporate-films', label: 'Corporate Films', blurb: 'Films for corporate and institutional clients.' },
  { slug: 'motion-graphics', label: 'Motion Graphics', blurb: 'Animated graphics and data-led motion design.' },
  { slug: 'visual-explainers', label: 'Visual Explainers', blurb: 'Short explainers that make complex subjects clear.' },
] as const;

/** The portfolio page lists every production, with filters by type. */
export const portfolioCategory = {
  slug: 'production-portfolio',
  label: 'Production Portfolio',
  blurb: 'Completed productions for Native Media and for institutional and commercial clients. Only verified projects with confirmed credits are listed.',
};
