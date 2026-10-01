/**
 * Single source of truth for company facts, navigation and the six pillars.
 * Edit text here and it updates everywhere (header, footer, homepage, page titles).
 * Only facts supplied in the Native Media brief belong in this file.
 */

export const company = {
  name: 'Native Media',
  tagline: 'Stories. Strategy. Impact.',
  descriptor: 'A Tanzanian media, strategic communications and intelligence company.',
  positioning:
    'Native Media leverages storytelling, research, data and creative production to shape narratives, build reputations, generate insight and strengthen Africa’s presence in global conversations.',
  why: 'Africa has been explained by others for long enough.',
  promise: 'African perspectives. Strategic insight. Global standards.',
  vision:
    'To become a respected African media, strategic communications and intelligence company, recognized for its ability to generate insight, shape narratives and produce high-quality creative and institutional content.',
  mission:
    'To transform African knowledge, research, intelligence and creativity into strategic communication, compelling stories and valuable information products that connect people, institutions, businesses and opportunities.',
  // Contact details and social links are NOT supplied yet. Leave empty until verified.
  email: '',
  phone: '',
  address: '',
  // Only verified, owner-supplied channels belong here.
  social: [{ label: 'YouTube', href: 'https://www.youtube.com/@nativemedia_africa' }] as { label: string; href: string }[],
};

export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const nav: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'Our Story', href: '/about/our-story' },
      { label: 'Our Philosophy', href: '/about/our-philosophy' },
      { label: 'Our Approach', href: '/about/our-approach' },
      { label: 'Leadership & Team', href: '/about/leadership-and-team' },
      { label: 'Partnerships', href: '/about/partnerships' },
    ],
  },
  {
    label: 'What We Do',
    href: '/what-we-do',
    children: [
      { label: 'Strategic Communications', href: '/what-we-do/strategic-communications' },
      { label: 'Intelligence & Research', href: '/what-we-do/intelligence-and-research' },
      { label: 'Media & Storytelling', href: '/what-we-do/media-and-storytelling' },
      { label: 'Creative & Audiovisual Production', href: '/what-we-do/creative-and-audiovisual-production' },
      { label: 'Institutional Publications', href: '/what-we-do/institutional-publications' },
      { label: 'Digital Intelligence & Data', href: '/what-we-do/digital-intelligence-and-data' },
    ],
  },
  {
    label: 'Intelligence',
    href: '/intelligence',
    children: [
      { label: 'Intelligence Overview', href: '/intelligence' },
      { label: 'Economic Intelligence', href: '/intelligence/economic-intelligence' },
      { label: 'Business & Market Insights', href: '/intelligence/business-and-market-insights' },
      { label: 'Economic Diplomacy', href: '/intelligence/economic-diplomacy' },
      { label: 'Research & Analysis', href: '/intelligence/research-and-analysis' },
      { label: 'Data & Visuals', href: '/intelligence/data-and-visuals' },
    ],
  },
  {
    label: 'Stories',
    href: '/stories',
    children: [
      { label: 'Business & Economics', href: '/stories/business-and-economics' },
      { label: 'African Affairs', href: '/stories/african-affairs' },
      { label: 'History', href: '/stories/history' },
      { label: 'Geopolitics', href: '/stories/geopolitics' },
      { label: 'Technology', href: '/stories/technology' },
      { label: 'Infrastructure', href: '/stories/infrastructure' },
      { label: 'Society & Culture', href: '/stories/society-and-culture' },
    ],
  },
  {
    label: 'African Intelligence',
    href: '/african-intelligence',
    children: [
      { label: 'Podcast Overview', href: '/african-intelligence' },
      { label: 'Latest Episodes', href: '/african-intelligence/latest-episodes' },
      { label: 'Guests', href: '/african-intelligence/guests' },
      { label: 'Interviews', href: '/african-intelligence/interviews' },
      { label: 'Video & Audio', href: '/african-intelligence/video-and-audio' },
      { label: 'Transcripts', href: '/african-intelligence/transcripts' },
    ],
  },
  {
    label: 'Productions',
    href: '/productions',
    children: [
      { label: 'Documentaries', href: '/productions/documentaries' },
      { label: 'Corporate Films', href: '/productions/corporate-films' },
      { label: 'Motion Graphics', href: '/productions/motion-graphics' },
      { label: 'Visual Explainers', href: '/productions/visual-explainers' },
      { label: 'Production Portfolio', href: '/productions/production-portfolio' },
    ],
  },
  {
    label: 'Publications',
    href: '/publications',
    children: [
      { label: 'All Publications', href: '/publications' },
      { label: 'Tanzania Economic Diplomacy Review', href: '/publications/tanzania-economic-diplomacy-review' },
      { label: 'Research Papers', href: '/publications/research-papers' },
      { label: 'Institutional Reports', href: '/publications/institutional-reports' },
      { label: 'Digital Editions', href: '/publications/digital-editions' },
      { label: 'Archives', href: '/publications/archives' },
    ],
  },
  {
    label: 'Contact',
    href: '/contact',
    children: [
      { label: 'General Inquiries', href: '/contact/general-inquiries' },
      { label: 'Strategic Communications', href: '/contact/strategic-communications' },
      { label: 'Research Collaboration', href: '/contact/research-collaboration' },
      { label: 'Institutional Partnerships', href: '/contact/institutional-partnerships' },
      { label: 'Production Inquiries', href: '/contact/production-inquiries' },
    ],
  },
];

export const policyLinks: NavChild[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Editorial Policy', href: '/editorial-policy' },
  { label: 'Research Policy', href: '/research-policy' },
];

export const pillars = [
  {
    n: '01',
    slug: 'strategic-communications',
    title: 'Strategic Communications',
    summary:
      'Narrative strategy, institutional positioning and stakeholder engagement that connect an organization’s identity, objectives and evidence to the audiences that matter.',
    tags: ['Narrative strategy', 'Reputation', 'Executive communications'],
    art: 'signal',
  },
  {
    n: '02',
    slug: 'intelligence-and-research',
    title: 'Intelligence & Research',
    summary:
      'Credible sources, rigorous research and contextual analysis, organized into economic intelligence, market insight and strategic briefings.',
    tags: ['Economic intelligence', 'Market research', 'Strategic briefings'],
    art: 'contour',
  },
  {
    n: '03',
    slug: 'media-and-storytelling',
    title: 'Media & Storytelling',
    summary:
      'African-centered editorial features, interviews and long-form narratives that explain the people, industries, institutions and history shaping the continent.',
    tags: ['Editorial features', 'Interviews', 'Long-form'],
    art: 'frames',
  },
  {
    n: '04',
    slug: 'creative-and-audiovisual-production',
    title: 'Creative & Audiovisual Production',
    summary:
      'Documentaries, corporate films, podcasts and motion graphics, produced for Native Media’s own platforms and for institutional and commercial partners.',
    tags: ['Documentary', 'Corporate film', 'Podcast production'],
    art: 'lens',
  },
  {
    n: '05',
    slug: 'institutional-publications',
    title: 'Institutional Publications',
    summary:
      'Professional reference publications that organize information, research and data into accessible, well-sourced products, led by the Tanzania Economic Diplomacy Review.',
    tags: ['Annual reviews', 'Research papers', 'Directories'],
    art: 'pages',
  },
  {
    n: '06',
    slug: 'digital-intelligence-and-data',
    title: 'Digital Intelligence & Data Storytelling',
    summary:
      'Interactive dashboards, maps and data explainers that make complex information accessible, explorable and professionally presented.',
    tags: ['Dashboards', 'Interactive maps', 'Data explainers'],
    art: 'grid',
  },
] as const;

/** Every page in the nav, flattened. Pages not built yet are served by the placeholder route. */
export const phaseFor = (href: string): { phase: number; note: string } => {
  if (href.startsWith('/about') || href.startsWith('/what-we-do') || href.startsWith('/contact'))
    return { phase: 2, note: 'Corporate identity, capability pages and inquiry forms' };
  if (href.startsWith('/stories') || href.startsWith('/african-intelligence') || href.startsWith('/productions'))
    return { phase: 3, note: 'Stories, African Intelligence and productions' };
  if (href.startsWith('/intelligence/data') ) return { phase: 5, note: 'Data & interactive products' };
  if (href.startsWith('/intelligence') || href.startsWith('/publications'))
    return { phase: 4, note: 'Intelligence platform and institutional publications' };
  if (href === '/search') return { phase: 3, note: 'Unified site search' };
  return { phase: 7, note: 'Policies, finalized once the services in use are confirmed' };
};

export const allPaths: { href: string; label: string }[] = [
  ...nav.flatMap((i) => (i.children ? [{ label: i.label, href: i.href }, ...i.children] : [])),
  ...policyLinks,
  { label: 'Search', href: '/search' },
].filter((p, i, a) => p.href !== '/' && a.findIndex((q) => q.href === p.href) === i);

/** Inquiry categories used by the contact forms. */
export const contactTopics = [
  'General inquiry',
  'Strategic communications',
  'Intelligence and research',
  'Research collaboration',
  'Publications',
  'Production services',
  'Podcast production',
  'African Intelligence guest proposal',
  'Institutional partnership',
  'Sponsorship',
  'Media inquiry',
] as const;

/** Pages that exist for real. The placeholder route skips these. */
export const builtPaths = new Set<string>([
  '/about', '/about/our-story', '/about/our-philosophy', '/about/our-approach',
  '/about/leadership-and-team', '/about/partnerships',
  '/what-we-do', ...[
    'strategic-communications', 'intelligence-and-research', 'media-and-storytelling',
    'creative-and-audiovisual-production', 'institutional-publications', 'digital-intelligence-and-data',
  ].map((s) => `/what-we-do/${s}`),
  '/contact', '/contact/general-inquiries', '/contact/strategic-communications',
  '/contact/research-collaboration', '/contact/institutional-partnerships', '/contact/production-inquiries',
]);

/**
 * African Intelligence listening channels. `href` is set only for links the owner has supplied.
 * Spotify, Apple Podcasts and Amazon Music stay empty until their links are provided.
 */
export const aiPlatforms: { label: string; href: string }[] = [
  { label: 'YouTube', href: 'https://www.youtube.com/@nativemedia_africa/podcasts' },
  { label: 'RSS.com', href: 'https://rss.com/podcasts/african-intelligence/' },
  { label: 'Spotify', href: '' },
  { label: 'Apple Podcasts', href: '' },
  { label: 'Amazon Music', href: '' },
];
