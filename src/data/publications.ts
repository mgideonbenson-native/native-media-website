/** Kinds of third-party publication featured on Native Media, and the page for each. */
export const publicationKinds = {
  report: { slug: 'reports', label: 'Reports', one: 'Report', lede: 'Reports from leading institutions, agencies and organizations on Africa’s economies, societies and communication landscape.', empty: 'No reports have been added yet.' },
  'research-paper': { slug: 'research-papers', label: 'Research papers', one: 'Research paper', lede: 'Research papers by universities, think tanks and independent researchers, each linked to its original source.', empty: 'No research papers have been added yet.' },
} as const;
export type PublicationKind = keyof typeof publicationKinds;
export const publicationPaths = Object.values(publicationKinds).map((k) => `/research-and-publications/${k.slug}`);
