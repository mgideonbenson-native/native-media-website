/** Intelligence platform content (areas of work). Nothing here claims published products or outcomes. */
export const briefingParts = [
  'Clear subject', 'Publication date', 'Reporting period', 'Author or research team (when verified)', 'Executive summary',
  'Main findings', 'Supporting data', 'Sources', 'Limitations', 'Related material',
];
export const productFields = [
  'Product title', 'Scope', 'Intended audience', 'Description', 'Research approach', 'Coverage',
  'Publication frequency (where established)', 'Available editions', 'Source methodology', 'Access or inquiry information',
];
export const labels = [
  ['Verified information', 'Facts traceable to a named source and reporting period.'],
  ['Analytical interpretation', 'Native Media’s reading of the evidence, marked as analysis.'],
  ['External projection', 'Forecasts from identified third parties, attributed and never presented as our own.'],
  ['Opinion', 'Views and commentary, always labelled as such.'],
] as const;

export const areas = [
  { slug: 'economic-intelligence', title: 'Economic Intelligence', lede: 'Trade, investment and macro-economic analysis built on documented sources.',
    covers: ['Economic intelligence', 'Trade and investment analysis', 'Country and sector analysis', 'Data-driven analysis', 'Strategic insights'],
    audience: ['Investors', 'Business executives', 'Government institutions', 'Development partners', 'Researchers'] },
  { slug: 'business-and-market-insights', title: 'Business & Market Insights', lede: 'Market and sector research that helps decision-makers understand where opportunities are, and what the evidence says.',
    covers: ['Business intelligence', 'Market research', 'Sector research', 'Strategic briefings', 'Information products'],
    audience: ['Entrepreneurs', 'Corporate leaders', 'Industry associations', 'Chambers of commerce', 'Business councils'] },
  { slug: 'economic-diplomacy', title: 'Economic Diplomacy', lede: 'Bilateral economic relations, institutional engagement and international partnerships, organized into structured reference.',
    covers: ['Economic diplomacy', 'Bilateral economic relations', 'Trade and investment intelligence', 'Institutional research', 'Research publications'],
    audience: ['Diplomatic missions', 'Government institutions', 'Multilateral organizations', 'Investors', 'Academics'] },
  { slug: 'research-and-analysis', title: 'Research & Analysis', lede: 'Concise briefings, longer research papers, data-led features and institutional reports.',
    covers: ['Policy and development research', 'Institutional research', 'Research publications', 'Strategic briefings', 'Digital research archives'],
    audience: ['Policy researchers', 'Academics and students', 'Development partners', 'Institutions', 'Media professionals'] },
] as const;

/** Publication collection pages. */
export const publicationSections = {
  'research-papers': { title: 'Research Papers', lede: 'Longer research papers with executive summaries, findings, data, sources and limitations.', empty: 'No research papers have been published yet.' },
  'institutional-reports': { title: 'Institutional Reports', lede: 'Reports developed for and about institutions, with methodology and sources stated.', empty: 'No institutional reports have been published yet.' },
  'digital-editions': { title: 'Digital Editions', lede: 'Online editions of Native Media publications, with chapter navigation, search and printable layouts.', empty: 'No digital edition has been published yet.' },
  archives: { title: 'Archives', lede: 'Every edition, update and correction, preserved with its publication date and status.', empty: 'The archive is empty because nothing has been published yet.' },
} as const;
