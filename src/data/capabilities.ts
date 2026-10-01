/**
 * Content for the six capability pages (/what-we-do/<slug>).
 * Everything here comes from the Native Media brief. No clients, case studies,
 * statistics or testimonials are included, and none should be added unless verified.
 */
export type Capability = {
  slug: string;
  title: string;
  art: 'signal' | 'contour' | 'frames' | 'lens' | 'pages' | 'grid';
  tagline: string;
  intro: string[];
  includesTitle: string;
  includes: string[];
  audiences: string[];
  process: { title: string; text: string }[];
  engagementTitle: string;
  engagement: { title: string; text: string }[];
  principles?: { title: string; text: string }[];
  principlesTitle?: string;
  workTitle: string;
  workNote: string;
  related: { label: string; href: string }[];
  topic: string; // preselected inquiry topic
};

export const capabilities: Capability[] = [
  {
    slug: 'strategic-communications',
    title: 'Strategic Communications',
    art: 'signal',
    tagline: 'Narratives that connect identity, objectives, evidence and audiences.',
    intro: [
      'Strategic Communications is a central business function of Native Media. We work as a partner in developing strategic narratives, communicating institutional priorities, strengthening reputations and connecting organizations with the audiences that matter to them.',
      'Effective communication links four things: who an organization is, what it is trying to achieve, the evidence that supports it, and how it engages the public. Our work starts from that connection rather than from the channel or the format.',
    ],
    includesTitle: 'Areas of capability',
    includes: [
      'Corporate communications',
      'Institutional communications',
      'Strategic narrative development',
      'Corporate reputation management',
      'National and institutional positioning',
      'Stakeholder engagement',
      'Strategic content development',
      'Public information campaigns',
      'Executive communications',
      'Brand storytelling',
      'Communication strategy',
      'Digital communication',
      'Strategic media production',
    ],
    audiences: ['Corporate communications directors', 'CEOs and executives', 'Government institutions and agencies', 'Diplomatic missions', 'Chambers of commerce and business councils'],
    process: [
      { title: 'Understand', text: 'The organization, its context, its audiences and what it needs to achieve.' },
      { title: 'Gather evidence', text: 'Credible facts, data and research that support the story to be told.' },
      { title: 'Define the narrative', text: 'A clear strategic objective and a narrative built on evidence.' },
      { title: 'Create', text: 'Content, materials and productions that express the narrative.' },
      { title: 'Engage', text: 'Distribution through the channels that reach the intended stakeholders.' },
      { title: 'Review', text: 'Evaluation and refinement where measurable outcomes are available.' },
    ],
    engagementTitle: 'Possible engagement models',
    engagement: [
      { title: 'Project-based', text: 'A defined communication strategy, narrative or campaign with an agreed scope.' },
      { title: 'Advisory', text: 'Ongoing strategic counsel for leadership and communications teams.' },
      { title: 'Content and production', text: 'Executive communications, films, publications or digital content for a defined purpose.' },
    ],
    workTitle: 'Examples of work',
    workNote: 'Verified case studies will be shown here once projects and clients have confirmed they can be published. We do not display unverified work.',
    related: [
      { label: 'Creative & Audiovisual Production', href: '/what-we-do/creative-and-audiovisual-production' },
      { label: 'Intelligence & Research', href: '/what-we-do/intelligence-and-research' },
      { label: 'Media & Storytelling', href: '/what-we-do/media-and-storytelling' },
    ],
    topic: 'Strategic communications',
  },
  {
    slug: 'intelligence-and-research',
    title: 'Intelligence & Research',
    art: 'contour',
    tagline: 'Credible sources, rigorous research and clear analysis.',
    intro: [
      'Intelligence is a defining element of Native Media’s identity. We understand it as the process of collecting, organizing, analyzing and presenting relevant information to support understanding, informed decisions, institutional engagement and strategic communication.',
      'Our intelligence work combines credible sources, rigorous research, contextual analysis, data visualization and accessible communication.',
    ],
    includesTitle: 'Areas of capability',
    includes: [
      'Economic intelligence',
      'Business and market insights',
      'Trade and investment analysis',
      'Economic diplomacy research',
      'Institutional research',
      'Country and sector analysis',
      'Policy and development research',
      'Strategic briefings',
      'Data-driven reports',
      'Bilateral economic relations',
    ],
    audiences: ['Investors and entrepreneurs', 'Business executives', 'Government institutions and agencies', 'Diplomatic missions', 'Development partners and multilateral organizations', 'Academics and researchers'],
    process: [
      { title: 'Define the question', text: 'What needs to be understood, by whom, and why.' },
      { title: 'Collect sources', text: 'Official, diplomatic and multilateral sources, recorded and attributed.' },
      { title: 'Organize and verify', text: 'Data checked against sources, with reporting periods and definitions noted.' },
      { title: 'Analyze', text: 'Contextual analysis that separates evidence from interpretation.' },
      { title: 'Present', text: 'Briefings, reports and visualizations written for the intended reader.' },
    ],
    engagementTitle: 'Possible engagement models',
    engagement: [
      { title: 'Commissioned research', text: 'A research paper, briefing or sector analysis for a specific question.' },
      { title: 'Information products', text: 'Recurring or one-off reports and reference publications.' },
      { title: 'Research collaboration', text: 'Joint work with institutions, researchers and academic partners.' },
    ],
    principlesTitle: 'How we label and source our work',
    principles: [
      { title: 'Verified information', text: 'Facts traceable to a named source and reporting period.' },
      { title: 'Analytical interpretation', text: 'Our reading of the evidence, marked clearly as analysis.' },
      { title: 'External projections', text: 'Forecasts from identified third parties, attributed and never presented as our own.' },
      { title: 'Opinion', text: 'Views and commentary, always labelled as such.' },
      { title: 'What we do not claim', text: 'Native Media does not claim confidential intelligence capabilities, government intelligence affiliations or privileged access, and does not promise predictive accuracy or guaranteed decision outcomes.' },
    ],
    workTitle: 'Published research',
    workNote: 'Reports, briefings and papers will be listed here as they are published, each with its sources, methodology and limitations.',
    related: [
      { label: 'Intelligence platform', href: '/intelligence' },
      { label: 'Institutional Publications', href: '/what-we-do/institutional-publications' },
      { label: 'Digital Intelligence & Data', href: '/what-we-do/digital-intelligence-and-data' },
    ],
    topic: 'Intelligence and research',
  },
  {
    slug: 'media-and-storytelling',
    title: 'Media & Storytelling',
    art: 'frames',
    tagline: 'African-centered stories told with context and craft.',
    intro: [
      'Native Media uses storytelling to explain important African developments, people, industries, institutions, history and opportunities.',
      'Stories are one expression of our wider purpose rather than the whole of the company. We favor thoughtful editorial curation, strong photography, useful context and connections to related research, podcasts and documentaries over a stream of breaking news.',
    ],
    includesTitle: 'Formats and subjects',
    includes: [
      'Editorial features',
      'Long-form narratives',
      'Interviews',
      'Business and economic analysis',
      'Historical storytelling',
      'African affairs',
      'Institutional stories',
      'Documentary storytelling',
      'Video explainers',
      'Multimedia and digital storytelling',
    ],
    audiences: ['African professionals', 'Academics and students', 'Policy researchers', 'Business communities', 'International audiences interested in Africa', 'Journalists and producers'],
    process: [
      { title: 'Find the story', text: 'A subject with substance, relevance and a distinctly African perspective.' },
      { title: 'Research', text: 'Sources, interviews and context gathered before writing or filming.' },
      { title: 'Shape', text: 'Narrative structure and format chosen to suit the subject.' },
      { title: 'Produce', text: 'Writing, photography, audio and video to a consistent editorial standard.' },
      { title: 'Distribute', text: 'Published on Native Media platforms and shared through suitable channels.' },
    ],
    engagementTitle: 'Possible engagement models',
    engagement: [
      { title: 'Original editorial', text: 'Stories developed and published by Native Media.' },
      { title: 'Institutional stories', text: 'Stories about an organization, produced with clear labelling.' },
      { title: 'Collaboration', text: 'Interviews, features and co-productions with partners and contributors.' },
    ],
    principlesTitle: 'Editorial clarity',
    principles: [
      { title: 'Always labelled', text: 'Reporting, research-based analysis, opinion, institutional statements and sponsored content are clearly distinguished.' },
      { title: 'No breaking-news pressure', text: 'We publish for depth and context, not for speed.' },
    ],
    workTitle: 'Featured stories',
    workNote: 'Selected stories will be featured here. Story pages and archives arrive in Phase 3 of the build.',
    related: [
      { label: 'Stories', href: '/stories' },
      { label: 'African Intelligence', href: '/african-intelligence' },
      { label: 'Productions', href: '/productions' },
    ],
    topic: 'Media and storytelling',
  },
  {
    slug: 'creative-and-audiovisual-production',
    title: 'Creative & Audiovisual Production',
    art: 'lens',
    tagline: 'Documentaries, films, podcasts and motion graphics.',
    intro: [
      'Native Media develops creative and audiovisual content for its own platforms and for institutional and commercial engagements.',
      'Production is where research, narrative and strategy become something people watch and hear. We approach each project with the same storytelling discipline that guides the rest of the company.',
    ],
    includesTitle: 'Areas of capability',
    includes: [
      'Documentary production',
      'Corporate films',
      'Executive interviews',
      'Podcast production',
      'Motion graphics',
      'Animated explainers',
      'Data visualization',
      'Editorial photography',
      'Digital video',
      'Visual research presentations',
      'Branded audiovisual content',
    ],
    audiences: ['Corporate and institutional clients', 'Diplomatic missions', 'Development partners', 'Documentary producers and filmmakers', 'Podcasters and content creators'],
    process: [
      { title: 'Brief', text: 'Purpose, audience and distribution agreed before production begins.' },
      { title: 'Develop', text: 'Research, treatment and script or interview plan.' },
      { title: 'Produce', text: 'Filming, recording and photography.' },
      { title: 'Post-produce', text: 'Editing, sound, graphics and motion design.' },
      { title: 'Deliver', text: 'Final files and versions for the agreed channels.' },
    ],
    engagementTitle: 'Possible engagement models',
    engagement: [
      { title: 'Commissioned production', text: 'A film, series, podcast or graphic package for a client.' },
      { title: 'Co-production', text: 'Productions developed jointly with partners.' },
      { title: 'Original productions', text: 'Documentaries and series developed by Native Media.' },
    ],
    workTitle: 'Production portfolio',
    workNote: 'Only completed projects with confirmed clients and credits will appear in the portfolio. Any design previews will be clearly labelled as demonstrations.',
    related: [
      { label: 'Productions', href: '/productions' },
      { label: 'Strategic Communications', href: '/what-we-do/strategic-communications' },
      { label: 'African Intelligence', href: '/african-intelligence' },
    ],
    topic: 'Production services',
  },
  {
    slug: 'institutional-publications',
    title: 'Institutional Publications',
    art: 'pages',
    tagline: 'Professional reference publications built on documented sources.',
    intro: [
      'Native Media develops professional publications that organize information, research, institutional knowledge and data into accessible reference products.',
      'These are proprietary Native Media information products. They are distinct from government or institutional publications, and the company retains editorial responsibility for them.',
    ],
    includesTitle: 'Publication types',
    includes: [
      'Annual institutional reviews',
      'Economic diplomacy publications',
      'Trade and investment reports',
      'Research papers',
      'Institutional yearbooks and directories',
      'Industry reports',
      'Thematic studies',
      'Digital reference publications',
      'Data annexes',
      'Periodic research updates',
    ],
    audiences: ['Diplomatic missions', 'Government institutions', 'Investors and business executives', 'Chambers of commerce and business councils', 'Multilateral institutions and development partners', 'Researchers and academics'],
    process: [
      { title: 'Scope', text: 'Purpose, readership, coverage and reporting period.' },
      { title: 'Source', text: 'Official, diplomatic and multilateral sources with a stated hierarchy.' },
      { title: 'Verify', text: 'Every data point tied to a source and period; discrepancies shown, not hidden.' },
      { title: 'Edit', text: 'Consistent structure and equal editorial treatment.' },
      { title: 'Publish', text: 'Print and digital editions, updates and a visible corrections process.' },
    ],
    engagementTitle: 'Ways to take part',
    engagement: [
      { title: 'Commission', text: 'A publication developed for a specific institution or sector.' },
      { title: 'Contribute', text: 'Verify factual information about your own organization.' },
      { title: 'Sponsor', text: 'Clearly labelled sponsorship that never determines editorial content.' },
    ],
    principlesTitle: 'Editorial principles',
    principles: [
      { title: 'Accuracy', text: 'Verifiable sources and a documented basis for published claims.' },
      { title: 'Neutrality', text: 'No political endorsement or ranking of diplomatic partners.' },
      { title: 'Equal treatment', text: 'Consistent profile structures and standards.' },
      { title: 'Independence', text: 'Native Media retains editorial responsibility.' },
      { title: 'Transparency', text: 'Sponsorship, methodology and corrections are disclosed.' },
      { title: 'Accountability', text: 'A visible corrections process and preserved records.' },
    ],
    workTitle: 'Flagship: Tanzania Economic Diplomacy Review',
    workNote: 'A proposed annual reference publication developed and owned by Native Media. No edition has been published yet, and it is not an official government publication.',
    related: [
      { label: 'Tanzania Economic Diplomacy Review', href: '/publications/tanzania-economic-diplomacy-review' },
      { label: 'All publications', href: '/publications' },
      { label: 'Intelligence & Research', href: '/what-we-do/intelligence-and-research' },
    ],
    topic: 'Publications',
  },
  {
    slug: 'digital-intelligence-and-data',
    title: 'Digital Intelligence & Data Storytelling',
    art: 'grid',
    tagline: 'Complex information, made accessible and explorable.',
    intro: [
      'Native Media uses digital technology, research and creative visualization to make complex information easier to understand.',
      'We are building a scalable foundation for interactive research and data products that can grow over time, so institutions and professionals can explore evidence directly rather than only read about it.',
    ],
    includesTitle: 'Areas of capability',
    includes: [
      'Interactive dashboards',
      'Economic data visualization',
      'Interactive African maps',
      'Trade and investment visualizations',
      'Bilateral relationship profiles',
      'Data-driven explainers',
      'Animated statistical graphics',
      'Digital research archives',
      'Interactive institutional directories',
      'Digital reference tools',
    ],
    audiences: ['Government institutions and agencies', 'Diplomatic missions', 'Investors and executives', 'Researchers and policy analysts', 'Development partners'],
    process: [
      { title: 'Identify the data', text: 'Which verified datasets answer the question.' },
      { title: 'Document', text: 'Source, indicator, units and reporting period recorded for each series.' },
      { title: 'Design', text: 'Charts and maps that stay legible on phones and have text descriptions.' },
      { title: 'Build', text: 'Interactive, accessible, lightweight pages.' },
      { title: 'Maintain', text: 'Updates as new data and corrections arrive.' },
    ],
    engagementTitle: 'Possible engagement models',
    engagement: [
      { title: 'Data story', text: 'A single interactive explainer or visual feature.' },
      { title: 'Dashboard', text: 'A tool for exploring a defined set of indicators.' },
      { title: 'Digital publication', text: 'An interactive companion to a report or review.' },
    ],
    principlesTitle: 'Data standards',
    principles: [
      { title: 'Every chart is sourced', text: 'Title, indicator, reporting period, source, units and notes are always shown.' },
      { title: 'No invented figures', text: 'Sample data is clearly marked as illustrative and never shown as fact.' },
      { title: 'Differences explained', text: 'Where sources disagree, the discrepancy and its reasons are shown.' },
    ],
    workTitle: 'Data & Visuals',
    workNote: 'Interactive products will be showcased here using verified data, or clearly labelled sample data in prototypes.',
    related: [
      { label: 'Data & Visuals', href: '/intelligence/data-and-visuals' },
      { label: 'Intelligence & Research', href: '/what-we-do/intelligence-and-research' },
      { label: 'Institutional Publications', href: '/what-we-do/institutional-publications' },
    ],
    topic: 'Intelligence and research',
  },
];
