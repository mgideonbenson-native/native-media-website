/**
 * Data for the interactive "Reports in focus" snapshot (/creative-data/reports-snapshot).
 * Every number is quoted from the two featured reports, as published (rounded as they round it).
 * Nothing here is estimated or calculated by Native Media. To change a figure, check it against the report first.
 */

export const reports = {
  pdaa: {
    short: 'PDAA / GSMA Intelligence',
    title: 'Charting Africa’s path to 1 billion connected people by 2030',
    by: 'Partnership for Digital Access in Africa (PDAA) and GSMA Intelligence',
    year: 2026,
    url: 'https://www.gsma.com/about-us/regions/africa/gsma_resources/advancing-digital-connectivity-in-africa/',
  },
  wb: {
    short: 'World Bank',
    title: 'Africa Economic Update: Building AI Readiness',
    by: 'World Bank Group',
    year: 2026,
    url: 'https://doi.org/10.1596/978-1-4648-2361-9',
  },
} as const;

/** Headline numbers. `to` is the number the card counts up to. */
export const headline = [
  { report: 'pdaa', to: 36, suffix: '%', label: 'of Africans used the internet in 2025', note: 'Against 74% worldwide (ITU data, quoted in the report).' },
  { report: 'pdaa', to: 906, suffix: ' million', label: 'live within mobile broadband coverage but do not use the mobile internet', note: 'Around 60% of the population: the “usage gap”.' },
  { report: 'pdaa', to: 514, suffix: ' million', label: 'more people online if both gaps are halved', note: 'An acceleration scenario, not a forecast.' },
  { report: 'wb', to: 0.6, suffix: '%', decimals: 1, label: 'of global data-centre capacity is in Africa', note: 'Africa holds 18% of the world’s population.' },
] as const;

/** 11 countries assessed in the PDAA / GSMA report. All values are % unless stated. Source: GSMA Intelligence, World Bank (2025; electricity 2024). */
export const countries = [
  { name: 'DRC',          adoption: 19, usageGap: 49, coverageGap: 32, smartphone: 7,  priceUsd: 30, priceShare: 41, rural: 55, elecRural: 1,   elecUrban: 55,  halving: 45 },
  { name: 'Egypt',        adoption: 48, usageGap: 51, coverageGap: 1,  smartphone: 45, priceUsd: 35, priceShare: 12, rural: 57, elecRural: 100, elecUrban: 100, halving: 30 },
  { name: 'Ethiopia',     adoption: 25, usageGap: 74, coverageGap: 1,  smartphone: 18, priceUsd: 53, priceShare: 65, rural: 76, elecRural: 45,  elecUrban: 95,  halving: 50 },
  { name: 'Ghana',        adoption: 42, usageGap: 57, coverageGap: 1,  smartphone: 34, priceUsd: 18, priceShare: 7,  rural: 41, elecRural: 83,  elecUrban: 99,  halving: 10 },
  { name: 'Kenya',        adoption: 47, usageGap: 51, coverageGap: 2,  smartphone: 34, priceUsd: 23, priceShare: 11, rural: 68, elecRural: 67,  elecUrban: 98,  halving: 15 },
  { name: 'Niger',        adoption: 19, usageGap: 71, coverageGap: 10, smartphone: 12, priceUsd: 45, priceShare: 71, rural: 82, elecRural: 11,  elecUrban: 69,  halving: 12 },
  { name: 'Nigeria',      adoption: 36, usageGap: 53, coverageGap: 11, smartphone: 30, priceUsd: 15, priceShare: 15, rural: 36, elecRural: 24,  elecUrban: 86,  halving: 75 },
  { name: 'Rwanda',       adoption: 27, usageGap: 72, coverageGap: 1,  smartphone: 19, priceUsd: 88, priceShare: 94, rural: 69, elecRural: 65,  elecUrban: 88,  halving: 5 },
  { name: 'Senegal',      adoption: 49, usageGap: 49, coverageGap: 3,  smartphone: 41, priceUsd: 27, priceShare: 16, rural: 44, elecRural: 67,  elecUrban: 96,  halving: 5 },
  { name: 'South Africa', adoption: 57, usageGap: 42, coverageGap: 1,  smartphone: 47, priceUsd: 18, priceShare: 3,  rural: 36, elecRural: 86,  elecUrban: 92,  halving: 13 },
  { name: 'Uganda',       adoption: 29, usageGap: 68, coverageGap: 3,  smartphone: 17, priceUsd: 26, priceShare: 23, rural: 68, elecRural: 45,  elecUrban: 78,  halving: 18 },
] as const;

export type Country = (typeof countries)[number];

/** Metrics the visitor can switch between. `higher` says what a higher number means, so the chart can label it plainly. */
export const metrics = [
  { key: 'usageGap',     label: 'Usage gap',                 unit: '%', text: 'Share of the population living within mobile broadband coverage who do not use the mobile internet.', higher: 'Higher means more people are covered but offline.' },
  { key: 'adoption',     label: 'Mobile internet adoption',  unit: '%', text: 'Share of the population using the mobile internet.', higher: 'Higher means more people online.' },
  { key: 'smartphone',   label: 'Smartphone adoption',       unit: '%', text: 'Share of the population using a smartphone.', higher: 'Higher means more smartphone use.' },
  { key: 'priceShare',   label: 'Entry-level phone price',   unit: '%', text: 'Entry-level smartphone price as a share of average monthly income per person.', higher: 'Higher means the phone is harder to afford.' },
  { key: 'coverageGap',  label: 'Coverage gap',              unit: '%', text: 'Share of the population living with no mobile broadband network.', higher: 'Higher means more people without a network.' },
  { key: 'rural',        label: 'Rural population',          unit: '%', text: 'Rural share of the population.', higher: 'Higher means a more rural country.' },
  { key: 'elecRural',    label: 'Rural electricity access',  unit: '%', text: 'Share of the rural population with access to electricity (2024).', higher: 'Higher means more rural people have power.' },
] as const;

export type MetricKey = (typeof metrics)[number]['key'];

/** Comparison rows, in the order they are shown. */
export const compareRows: { key: keyof Country; label: string; unit: string }[] = [
  { key: 'adoption', label: 'Mobile internet adoption', unit: '%' },
  { key: 'usageGap', label: 'Usage gap', unit: '%' },
  { key: 'coverageGap', label: 'Coverage gap', unit: '%' },
  { key: 'smartphone', label: 'Smartphone adoption', unit: '%' },
  { key: 'priceShare', label: 'Phone price as share of monthly income', unit: '%' },
  { key: 'rural', label: 'Rural population', unit: '%' },
  { key: 'elecRural', label: 'Rural electricity access', unit: '%' },
  { key: 'halving', label: 'People who could come online if both gaps were halved', unit: ' million' },
];

/** World Bank figures used on the page (summary of the report’s executive summary). */
export const wbFacts = {
  growth: { from: 4.1, to: 4.3 },
  perCapita: { from: 1.6, to: 1.8 },
  popShare: 18,
  dataCentreShare: 0.6,
  aiReadyDataCentres: 5,
  aiTrainingData: 2,
  swahili: 710,
  english: 88844,
};

/** The three groups in the PDAA / GSMA report, in millions of people (2025). */
export const groups = [
  { key: 'users', label: 'Use the mobile internet', million: 517 },
  { key: 'covered', label: 'Covered by mobile broadband, but not using it', million: 906 },
  { key: 'uncovered', label: 'No mobile broadband network', million: 122 },
] as const;

/** Share of people online, out of every 100 (ITU data quoted in the PDAA / GSMA report). */
export const outOf100 = { africa: 36, world: 74 };
