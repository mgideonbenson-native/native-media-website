/**
 * Single source of truth for company facts, navigation and the five areas of work.
 * Edit text here and it updates everywhere (header, footer, homepage, page titles).
 * Only facts supplied in the Native Media brief belong in this file.
 */

export const company = {
  name: 'Native Media',
  tagline: 'Insight. Strategy. Impact.',
  descriptor: 'A Pan-African media-tech and strategic communication agency based in Dar es Salaam.',
  positioning:
    'Native Media leverages storytelling, research, data and creative production to shape narratives, build reputations, generate insight and strengthen Africa’s presence in global conversations.',
  why: 'We use evidence to build the narratives that change how Africa is seen, by Africans and by everyone else.',
  promise: 'African perspectives. Strategic insight. Global standards.',
  vision:
    'To become a respected African media, strategic communications and intelligence company, recognized for its ability to generate insight, shape narratives and produce high-quality creative and institutional content.',
  mission:
    'To transform African knowledge, research, intelligence and creativity into strategic communication, compelling stories and valuable information products that connect people, institutions, businesses and opportunities.',
  // Contact details supplied by the owner. Phone and street address are not supplied yet; leave empty until verified.
  email: '',
  phone: '',
  // WhatsApp number in international format, digits only. Used by the floating chat button.
  whatsapp: '255746444380',
  address: '',
  // Only verified, owner-supplied channels belong here.
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/nativemedia-africa/' },
    { label: 'Instagram', href: 'https://www.instagram.com/nativemedia_' },
    { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61576974312862' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@nativemedia_africa' },
    { label: 'YouTube', href: 'https://www.youtube.com/@nativemedia_africa' },
  ] as { label: string; href: string }[],
};

import { allStoryListPaths } from './categories';
import { publicationPaths } from './publications';
import { caseStudies } from './caseStudies';

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
      { label: 'Narrative Engineering', href: '/narrative-engineering' },
      { label: 'Research & Publications', href: '/research-and-publications' },
      { label: 'African Intelligence', href: '/african-intelligence' },
      { label: 'Creative Data', href: '/creative-data' },
      { label: 'Training & Mentorship', href: '/training-and-mentorship' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];

export const policyLinks: NavChild[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
  { label: 'Editorial Policy', href: '/editorial-policy' },
  { label: 'Research Policy', href: '/research-policy' },
];

export const pillars = [
  {
    n: '01',
    slug: 'narrative-engineering',
    href: '/narrative-engineering',
    title: 'Narrative Engineering',
    summary:
      'Strategic narratives, institutional positioning and stakeholder engagement that connect an organization’s identity, objectives and evidence to the audiences that matter.',
    tags: ['Strategic narratives', 'Reputation', 'Executive communications'],
    art: 'signal',
  },
  {
    n: '02',
    slug: 'research-and-publications',
    href: '/research-and-publications',
    title: 'Research & Publications',
    summary:
      'Reports and research published by other credible organizations, featured with credit and a link to the original, so people can understand Africa from the best available evidence.',
    tags: ['Reports', 'Research papers', 'Credited and linked'],
    art: 'pages',
  },
  {
    n: '03',
    slug: 'african-intelligence',
    href: '/african-intelligence',
    title: 'African Intelligence',
    summary:
      'Our flagship stories and podcast: African business, economics, leadership, strategy and ideas, told with the people shaping them.',
    tags: ['Podcast', 'Stories', 'Interviews'],
    art: 'frames',
  },
  {
    n: '04',
    slug: 'creative-data',
    href: '/creative-data',
    title: 'Creative Data',
    summary:
      'Audiovisuals, motion graphics, digital videos and visual research presentations that turn research and data into something people can see.',
    tags: ['Audiovisuals', 'Motion graphics', 'Digital videos', 'Visual research presentations'],
    art: 'lens',
  },
  {
    n: '05',
    slug: 'training-and-mentorship',
    href: '/training-and-mentorship',
    title: 'Training & Mentorship',
    summary:
      'Thought leadership development for communication leaders, and Native Talks, a mentorship programme for young communicators.',
    tags: ['Thought leadership', 'Native Talks'],
    art: 'grid',
  },
] as const;

/** Holding-page text for any menu link whose page is not built yet (all pages are built today). */
export const phaseFor = (_href: string): { phase: number; note: string } => ({ phase: 8, note: 'This page is being prepared' });

export const allPaths: { href: string; label: string }[] = [
  ...nav.flatMap((i) => (i.children ? [{ label: i.label, href: i.href }, ...i.children] : [])),
  ...policyLinks,
  { label: 'Search', href: '/search' },
].filter((p, i, a) => p.href !== '/' && a.findIndex((q) => q.href === p.href) === i);

/** Inquiry categories used by the contact forms. */
export const contactTopics = [
  'General inquiry',
  'Narrative engineering',
  'Research and publications',
  'Research collaboration',
  'African Intelligence guest proposal',
  'Creative data',
  'Training and mentorship',
  'Native Talks',
  'Institutional partnership',
  'Sponsorship',
  'Media inquiry',
] as const;

/** Pages that exist for real. The placeholder route skips these. */
export const builtPaths = new Set<string>([
  '/about', '/about/our-story', '/about/our-philosophy', '/about/our-approach', '/about/leadership-and-team', '/about/partnerships',
  '/what-we-do', '/narrative-engineering',
  '/contact', '/contact/general-inquiries', '/contact/narrative-engineering', '/contact/research-collaboration',
  '/contact/institutional-partnerships', '/contact/creative-data', '/contact/training-and-mentorship',
  // Case studies
  '/case-studies', ...caseStudies.map((c) => `/case-studies/${c.slug}`),
  // Research & Publications
  '/research-and-publications', '/research-and-publications/third-party-research', ...publicationPaths,
  // African Intelligence (podcast + stories)
  '/african-intelligence', '/african-intelligence/latest-episodes', '/african-intelligence/guests', '/african-intelligence/interviews',
  '/african-intelligence/video-and-audio', '/african-intelligence/transcripts',
  '/african-intelligence/stories', ...allStoryListPaths(),
  // Creative Data
  '/creative-data',
  // Training & Mentorship
  '/training-and-mentorship', '/training-and-mentorship/native-talks', '/training-and-mentorship/thought-leadership',
  // Site pages
  '/privacy', '/terms', '/cookies', '/editorial-policy', '/research-policy', '/newsletter', '/unsubscribe', '/search',
]);

/**
 * African Intelligence listening channels. `href` is set only for links the owner has supplied.
 * An empty href shows as "link pending".
 */
export const aiPlatforms: { label: string; href: string }[] = [
  { label: 'YouTube', href: 'https://www.youtube.com/@nativemedia_africa/podcasts' },
  { label: 'RSS.com', href: 'https://rss.com/podcasts/african-intelligence/' },
  { label: 'Spotify', href: 'https://open.spotify.com/show/0340VtdzI9HM64rUbGh9rX' },
  { label: 'Apple Podcasts', href: 'https://podcasts.apple.com/us/podcast/african-intelligence/id6797628858' },
  { label: 'Amazon Music', href: 'https://music.amazon.com/podcasts/f4d8f82c-8079-4e07-8665-341a55489281' },
];
