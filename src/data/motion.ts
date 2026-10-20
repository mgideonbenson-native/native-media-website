/**
 * Motion snapshots: short motion graphics built from public reporting (a news recap, a briefing, a statement).
 * They are not reports. Every line on screen is checked against the source credited in "The source" section.
 */

export type Source = { publisher: string; title: string; date: string; url: string };
export type FlagCode = 'tz' | 'fi' | 'it' | 'nl' | 'be';

export interface MotionSnapshot {
  slug: string;
  title: string;
  dek: string;
  date: string; // when Native Media published the snapshot (ISO)
  duration: string; // ISO 8601, for structured data
  seconds: number;
  runtimeLabel: string;
  video: { hd: string; sd: string; webm: string; poster: string; og: string };
  primary: Source;
  chapters: { t: number; label: string; text: string }[];
  route: { n: string; date: string; place: string; flags: FlagCode[]; focus: string; lonlat: [number, number] }[];
  start: { place: string; lonlat: [number, number] };
  next: { date: string; place: string; text: string };
}

export const euTanzaniaRoadshow: MotionSnapshot = {
  slug: 'eu-tanzania-roadshow',
  title: 'Tanzania took its pitch to Europe.',
  dek: 'Nine days, four countries and a 68-project pipeline: the EU–Tanzania investment roadshow in one minute.',
  date: '2026-10-20',
  duration: 'PT1M',
  seconds: 60,
  runtimeLabel: '1:00',
  video: {
    hd: '/media/motion/eu-tanzania-roadshow-2026-1080.mp4',
    sd: '/media/motion/eu-tanzania-roadshow-2026-720.mp4',
    webm: '/media/motion/eu-tanzania-roadshow-2026-720.webm',
    poster: '/media/motion/eu-tanzania-roadshow-2026-poster.jpg',
    og: '/media/motion/eu-tanzania-roadshow-2026-og.jpg',
  },
  primary: {
    publisher: 'TanzaniaInvest',
    title: 'Tanzania Pitched a 68-Project, USD 30.1 Billion Pipeline at the EU–Tanzania Roadshow in Finland, Italy, the Netherlands and Belgium Ahead of the Early 2027 Dar es Salaam Forum',
    date: '19 October 2026',
    url: 'https://www.tanzaniainvest.com/mining/eu-roadshow-2026-recap',
  },
  chapters: [
    { t: 0, label: 'The pitch', text: 'Tanzania took its investment pitch to Europe. September – October 2026.' },
    { t: 5.6, label: 'The pipeline', text: '68 projects, worth USD 30.1 billion combined.' },
    { t: 11.4, label: 'Still on the table', text: 'USD 29.1 billion still open to investors. The other USD 1 billion is already under contract.' },
    { t: 16.8, label: 'The sectors', text: 'Three priority sectors: critical minerals, agribusiness, and digital and fintech. Plus two that enable them: renewable energy, and transport and logistics.' },
    { t: 21.8, label: 'The route', text: 'Nine days. Four countries.' },
    { t: 24.3, label: 'Helsinki', text: 'Helsinki, Finland, 28–29 September. Pitched: graphite, nickel and rare earths, plus data centres and subsea cables. Visited: Boliden’s Harjavalta nickel smelter, Metso’s research centre and Nokia. Outcome: Finland’s Finnvera and Finnfund said they are open to Tanzanian deals.' },
    { t: 31.9, label: 'Cesena', text: 'Cesena, Italy, 1–2 October. Pitched: rice, cashew and coffee, plus hydropower, solar and transmission lines. Showcased: the USD 137 million Maranje Cashew Industrial Park. Outcome: Italy’s CDP reported advanced talks on about EUR 400 million of projects.' },
    { t: 39.2, label: 'The Hague', text: 'The Hague, Netherlands, 5 October. Pitched: coffee and cashew processing, the Bagamoyo port and new railway lines. About 90 businesses took part. The Netherlands is the EU’s largest investor in Tanzania.' },
    { t: 45.9, label: 'Rotterdam → Antwerp', text: 'Rotterdam and Antwerp, 6 October. Visited: APM Terminals in Rotterdam and the Port of Antwerp-Bruges. Outcome: the EU said it will support the expansion of Dar es Salaam port, alongside the World Bank and the EIB.' },
    { t: 51.9, label: 'Seeking partners', text: 'About 50 projects are still listed as seeking partners on the forum’s Investment Wall.' },
    { t: 55.5, label: 'What comes next', text: 'Dar es Salaam, early 2027: the EU–Tanzania Investment and Business Forum, where the talks are meant to become partnerships.' },
  ],
  start: { place: 'Dar es Salaam', lonlat: [39.2083, -6.7924] },
  route: [
    { n: '01', date: '28–29 Sep', place: 'Helsinki', flags: ['fi'], focus: 'Minerals · digital', lonlat: [24.9384, 60.1699] },
    { n: '02', date: '1–2 Oct', place: 'Cesena', flags: ['it'], focus: 'Agribusiness · energy', lonlat: [12.2431, 44.1391] },
    { n: '03', date: '5 Oct', place: 'The Hague', flags: ['nl'], focus: 'Agriculture · ports · rail', lonlat: [4.3007, 52.0705] },
    { n: '04', date: '6 Oct', place: 'Rotterdam → Antwerp', flags: ['nl', 'be'], focus: 'Port visits', lonlat: [4.4025, 51.2194] },
  ],
  next: { date: 'Early 2027', place: 'Dar es Salaam', text: 'EU–Tanzania Investment and Business Forum' },
};

export const motionSnapshots = [euTanzaniaRoadshow];
