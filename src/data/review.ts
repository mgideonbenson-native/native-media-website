/**
 * Tanzania Economic Diplomacy Review: structure, governance and sourcing framework.
 * Source: the Native Media brief and the supplied "Edition 01 (2026/27) Draft for verification" PDF.
 * Deliberately NOT included on the public site until verified and approved by the owner:
 * the draft's statistics, partner-country names, ministerial foreword details and mission content.
 */
export const REVIEW_BASE = '/publications/tanzania-economic-diplomacy-review';

export const reviewMeta = {
  title: 'Tanzania Economic Diplomacy Review',
  short: 'The Review',
  status: 'Edition 01 · Draft for verification',
  statusNote: 'Edition 01 (2026/27) is in draft and has not been published. Its contents, participants and data are still being verified.',
  oneLiner:
    'An annual official-source reference publication developed and owned by Native Media Africa.',
  description:
    'The Review organizes information about Tanzania’s economic diplomacy, bilateral relations, trade, investment, institutional engagement and international partnerships into a structured and accessible professional reference.',
  disclaimer:
    'The Tanzania Economic Diplomacy Review is a Native Media institutional publication. It is not an official government publication. Organizations are described as partners, sponsors or endorsers only where the relationship has been confirmed and permission to publish the designation has been obtained.',
  edition: {
    label: 'Edition 01 · 2026/27',
    status: 'Draft for verification',
    cutoff: 'Sources as published up to 30 September 2026',
    publisher: 'Native Media Africa, Dar es Salaam',
    coverNote: 'Draft cover: illustration, AI-generated.',
  },
  audiences: [
    'Diplomatic missions', 'Government institutions', 'Investors', 'Business executives',
    'Chambers of commerce', 'Business councils', 'Multilateral institutions', 'Development partners',
    'Academics', 'Researchers', 'Media professionals',
  ],
};

/** The proposed product ecosystem. */
export const ecosystem = [
  { title: 'Annual flagship print edition', text: 'The yearly printed reference.' },
  { title: 'Full digital edition', text: 'An online reading experience with chapter navigation, search and printable layouts.' },
  { title: 'Quarterly digital updates', text: 'New data, agreements, changes in heads of mission and approved profiles between annual editions.' },
  { title: 'Searchable embassy directory', text: 'Profiles of participating diplomatic missions, organized by region.' },
  { title: 'Institutional reference information', text: 'Structured directories of institutions and contacts.' },
  { title: 'Economic data annexes', text: 'Sourced data tables and exhibits supporting each chapter.' },
  { title: 'Downloadable reports', text: 'PDF versions where available.' },
];

export const parts = [
  { n: 'One', title: 'Tanzania’s Trajectory to Dira 2050', text: 'Seven thematic chapters on the vision, foreign policy, investment, trade, the macro picture, regional role and the year ahead.', href: `${REVIEW_BASE}/chapters` },
  { n: 'Two', title: 'Opportunity Atlas: seven sectors', text: 'Turns the numbers into sectors an investor can act on, with a partnership matrix showing who works where.', href: `${REVIEW_BASE}/opportunity-atlas` },
  { n: 'Three', title: 'Partner Profiles', text: 'Ten partner profiles, each in the same format, so any two relationships can be compared on the same spread.', href: `${REVIEW_BASE}/embassy-profiles` },
  { n: 'Four', title: 'Directory, Data and Agreements', text: 'The reference section: who is where, what was signed, and the data behind it all.', href: `${REVIEW_BASE}/directory-and-data` },
];

/** Contents of Edition 01 (draft). Titles only: no figures or findings are published here. */
export const contentsOpening = ['Foreword (reserved)', 'Note from the Publisher', 'Our editorial policy', 'The brief: ten things to know', 'The year at a glance'];
export const partOneFeature = 'Feature: Tanzania’s missions, open for business';
export const opportunitySectors = ['Mining and minerals', 'Energy', 'Transport and logistics', 'Manufacturing and SEZs', 'Tourism and nature', 'Agriculture and food', 'Skills, health and water'];
export const partFourContents = ['The world in Dar es Salaam: map', 'Diplomatic directory', 'Tanzanian missions abroad', 'Institutional directory', 'Data annex', 'Agreements register', 'Calendar and glossary', 'Sources'];

export const chapters = [
  { n: 1, title: 'The Vision', topics: ['DIRA 2050', 'Long-term development objectives', 'Economic diplomacy and national priorities'] },
  { n: 2, title: 'Foreign Policy in Action', topics: ['Economic diplomacy priorities', 'State visits', 'Joint commissions', 'New diplomatic missions', 'Officially documented international engagement'] },
  { n: 3, title: 'Investment', topics: ['TISEZA', 'Zanzibar Investment Promotion Authority', 'Registered projects', 'Investment values', 'Source countries', 'Priority sectors', 'Special economic zones'] },
  { n: 4, title: 'Trade', topics: ['Tanzania’s exports and imports', 'Bilateral trade', 'Trade partners', 'AfCFTA', 'East African Community', 'Officially published trade statistics'] },
  { n: 5, title: 'The Macro Picture', topics: ['Economic growth', 'Inflation', 'Foreign reserves', 'Foreign direct investment', 'Remittances', 'Other relevant macroeconomic indicators'] },
  { n: 6, title: 'Regional and Continental Role', topics: ['East African Community', 'Southern African Development Community', 'African Union', 'Regional corridors', 'Regional economic engagement'] },
  { n: 7, title: 'The Year Ahead', topics: ['Scheduled summits', 'Officially announced negotiations', 'Planned diplomatic engagements', 'Upcoming initiatives', 'Announced agreements and programmes'] },
];

export const chapterElements = [
  'Executive summary', 'Key findings', 'Data exhibits', 'Charts and tables',
  'Official interviews or statements where obtained', 'Source references', 'Reporting period', 'Data cut-off date',
];

export const regions = ['Africa', 'Middle East', 'Asia-Pacific', 'Europe', 'Americas'];

export const profileSections = [
  'Ambassador’s Message', 'Relationship at a Glance', 'Bilateral Trade', 'Investment',
  'Flagship Projects', 'Agreements', 'Opportunities', 'People and Culture', 'Contacts',
];

export const profileFields = [
  'Diplomatic relations commencement year', 'Ambassador’s name and official title', 'Mission address',
  'Trade statistics', 'Major exports and imports', 'Investment projects', 'Project values',
  'Employment information', 'Sector priorities', 'Agreements and memoranda', 'Scholarships',
  'Cultural exchanges', 'Public contact information',
];

export const directorySets = [
  'Resident diplomatic missions', 'Tanzanian missions abroad', 'Government institutions', 'Investment agencies',
  'Chambers of commerce', 'Business councils', 'Institutional contacts', 'Bilateral agreements',
  'Economic indicators', 'Trade and investment data', 'Diplomatic events',
];

export const sourceTiers = [
  { tier: 'Tier 1', title: 'Tanzanian official sources', items: ['National Bureau of Statistics', 'Bank of Tanzania', 'Tanzania Investment and Special Economic Zones Authority', 'Zanzibar Investment Promotion Authority', 'Ministry of Foreign Affairs and East African Cooperation', 'TanTrade', 'Other relevant official institutions'] },
  { tier: 'Tier 2', title: 'Diplomatic sources', items: ['Embassy information offices', 'Official diplomatic statements', 'Official mission websites', 'Verified ambassadorial messages', 'Officially supplied project and programme information'] },
  { tier: 'Tier 3', title: 'Multilateral sources', items: ['International Monetary Fund', 'World Bank', 'African Development Bank', 'United Nations Comtrade', 'Other relevant multilateral data sources'] },
];

export const sourceRules = [
  'When sources differ, both figures are shown. Tanzanian and partner statistics often disagree because of timing, valuation and re-exports. The data annex uses the Tanzanian figure and the profile shows the partner figure with its source. One is never quietly chosen.',
  'Multilateral data (World Bank, IMF, UN) is used only to fill gaps and is always labelled.',
  'Every published data point carries an identifiable source and its reporting period.',
  'Where figures differ between sources, the discrepancy is shown and, where known, the differing definitions or reporting periods are explained.',
  'Estimates are never silently substituted for official figures.',
  'Missing data, mission participation, ambassadorial messages, agreements or project information are never invented.',
];

export const principles = [
  { title: 'Accuracy', text: 'Use verifiable sources and document the basis of published claims.' },
  { title: 'Neutrality', text: 'No rankings of partners, no commentary on bilateral disputes and no political endorsement. Partners are grouped by region and listed alphabetically.' },
  { title: 'Equal treatment', text: 'Every mission receives the same template and the same editorial care, whatever the size of its country or its budget. The standard profile is free.' },
  { title: 'Independence', text: 'Native Media Africa holds final editorial responsibility. Advisers advise and sponsors support; neither directs content.' },
  { title: 'Transparency', text: 'Disclose sponsorship, institutional contributions, methodologies and corrections.' },
  { title: 'Accountability', text: 'Maintain a visible corrections process and preserve relevant publication records.' },
];

export const sponsorshipRules = [
  'Institutional advertising, edition partnerships, thematic sponsorships and sponsored features are all clearly labelled.',
  'Sponsorship does not determine standard embassy profile coverage, source selection, factual interpretation or editorial conclusions.',
  'Standard profiles receive equivalent editorial treatment regardless of a mission’s financial contribution, country size, geopolitical significance or sponsorship.',
  'A transparent record of confirmed sponsors and their agreed roles is kept and published here.',
  'Institutional advisers may advise within formally established roles without being presented as publishers or endorsers.',
];

export const quarterlyContents = [
  'New trade data', 'New investment information', 'Newly documented agreements', 'Changes in heads of mission',
  'New approved embassy profiles', 'Updated bilateral information', 'Selected thematic updates',
];
export const updateFields = ['Publication date', 'Data cut-off', 'Sources', 'Summary of changes'];

export const digitalFeatures = [
  'Interactive table of contents', 'Chapter navigation', 'Search', 'Downloadable PDFs where available',
  'Charts and tables', 'Source notes', 'Related content', 'Printable layouts', 'Mobile-friendly reading',
];

/** Status vocabulary used on every profile, edition and data item. */
export const statusLabels = {
  publication: [
    ['Proposed', 'The edition or product is planned but not yet confirmed for publication.'],
    ['Forthcoming', 'Publication is confirmed and scheduled.'],
    ['Published', 'The edition or update is released.'],
  ],
  verification: [
    ['Draft', 'Information has been compiled but not yet checked.'],
    ['Awaiting embassy review', 'Compiled from public sources and not yet checked by the mission concerned. No profile is published as final until the mission has checked it and signed it off.'],
    ['Under verification', 'Being checked against sources and, for profiles, with the relevant mission.'],
    ['Verified', 'Checked against the cited sources for accuracy.'],
  ],
  participation: [
    ['Invited', 'A mission or institution has been approached. This is not participation.'],
    ['Confirmed', 'Participation has been confirmed and permission to publish has been given.'],
  ],
};

/** Corrections log. Empty until a real correction is made; the page explains the process. */
export const corrections: { date: string; item: string; change: string }[] = [];

/** Confirmed sponsors and their roles. Empty until confirmed. */
export const sponsors: { name: string; role: string }[] = [];

/** Published editions. Empty until an edition is released. */
export const editions: { title: string; period: string; status: string; href: string }[] = [];

/** Sub-pages of the Review (used for routing, titles and descriptions). */
export const reviewSections = {
  chapters: { title: 'Part One: Tanzania’s Trajectory to Dira 2050', lede: 'Seven thematic chapters follow Tanzania’s own trajectory, from the Dira 2050 vision to the latest trade and investment evidence.' },
  'opportunity-atlas': { title: 'Part Two: Opportunity Atlas', lede: 'The atlas turns the numbers of Part One into seven sectors an investor can act on.' },
  'embassy-profiles': { title: 'Part Three: Partner Profiles', lede: 'Every partner receives the same format, so any two relationships can be compared on the same spread.' },
  'directory-and-data': { title: 'Part Four: Directory, Data and Agreements', lede: 'The reference section: who is where, what was signed, and the data behind it all.' },
  'quarterly-updates': { title: 'Quarterly digital updates', lede: 'Between annual editions, short digital updates keep the Review current.' },
  'digital-edition': { title: 'Digital edition', lede: 'An accessible online reading experience built for long-form research.' },
  methodology: { title: 'Methodology and sources', lede: 'How the Review chooses, checks and cites its information.' },
  sponsorship: { title: 'Sponsorship and disclosures', lede: 'Sponsorship is welcome and always labelled. It never shapes the Review’s content.' },
  corrections: { title: 'Corrections', lede: 'Errors are corrected openly, and the record is kept.' },
} as const;
