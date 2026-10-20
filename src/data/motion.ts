/**
 * Motion snapshots: short motion graphics built from one public source (a news recap, a briefing, a statement).
 * They are not reports. Every line on screen is checked against the sources listed here,
 * and each claim says whether it was reported, targeted or planned.
 */

export type Source = { id: string; publisher: string; title: string; date: string; url: string };
export type Ledger = { status: 'reported' | 'not-yet' | 'target' | 'planned'; text: string; detail?: string; src: string[] };

export interface MotionSnapshot {
  slug: string;
  title: string;
  dek: string;
  date: string; // when Native Media published the snapshot (ISO)
  duration: string; // ISO 8601, for structured data
  runtimeLabel: string;
  video: { hd: string; sd: string; webm: string; poster: string; og: string };
  primary: Source;
  sources: Source[];
  chapters: { t: number; label: string; text: string }[];
  ledger: Ledger[];
  route: { date: string; place: string; country: string; focus: string; note: string; src: string[] }[];
  made: string[];
}

const S = {
  recap: { id: 'recap', publisher: 'TanzaniaInvest', title: 'Tanzania Pitched a 68-Project, USD 30.1 Billion Pipeline at the EU–Tanzania Roadshow in Finland, Italy, the Netherlands and Belgium Ahead of the Early 2027 Dar es Salaam Forum', date: '19 October 2026', url: 'https://www.tanzaniainvest.com/mining/eu-roadshow-2026-recap' },
  briefing: { id: 'briefing', publisher: 'TanzaniaInvest', title: 'Tanzania Unveils 68-Project, USD 30.1 Billion Pipeline for EU Investment Roadshows to Finland, Italy and the Netherlands', date: '20 August 2026', url: 'https://www.tanzaniainvest.com/economy/trade/eu-investment-roadshows-2026' },
  helsinki: { id: 'helsinki', publisher: 'TanzaniaInvest', title: 'EU–Tanzania Roadshow Opens in Helsinki With Mineral and Digital Investment Pitches', date: '29 September 2026', url: 'https://www.tanzaniainvest.com/economy/trade/eu-roadshow-2026-helsinki-day-one' },
  cesena: { id: 'cesena', publisher: 'TanzaniaInvest', title: 'EU–Tanzania Roadshow Continues in Italy With Rice, Cashew, Coffee and Renewable Energy Investment Pitches in Cesena', date: '2 October 2026', url: 'https://www.tanzaniainvest.com/agriculture/eu-roadshow-2026-italy-cesena-day-one' },
  hague: { id: 'hague', publisher: 'TanzaniaInvest', title: 'EU–Tanzania Roadshow Reaches The Hague With Coffee, Cashew, Critical Minerals, and Port Investment Pitches', date: '6 October 2026', url: 'https://www.tanzaniainvest.com/agriculture/eu-roadshow-2026-netherlands-the-hague-day-one' },
  ports: { id: 'ports', publisher: 'TanzaniaInvest', title: 'EU–Tanzania Roadshow Ends With Rotterdam and Antwerp Port Visits', date: '7 October 2026', url: 'https://www.tanzaniainvest.com/transport/eu-roadshow-2026-netherlands-belgium-rotterdam-antrewp-day-two' },
  eeas: { id: 'eeas', publisher: 'Delegation of the European Union to Tanzania', title: 'EU – Tanzania Investment & Business Forum 2026–2027', date: '2026', url: 'https://www.eeas.europa.eu/delegations/tanzania/eu-tanzania-investment-business-forum-2026-2027_en' },
} satisfies Record<string, Source>;

export const euTanzaniaRoadshow: MotionSnapshot = {
  slug: 'eu-tanzania-roadshow',
  title: 'Tanzania took its pitch to Europe.',
  dek: 'Nine days, four countries and a 68-project pipeline: the EU–Tanzania investment roadshow in 30 seconds, and what has and has not happened since.',
  date: '2026-10-20',
  duration: 'PT30S',
  runtimeLabel: '0:30',
  video: {
    hd: '/media/motion/eu-tanzania-roadshow-2026-1080.mp4',
    sd: '/media/motion/eu-tanzania-roadshow-2026-720.mp4',
    webm: '/media/motion/eu-tanzania-roadshow-2026-720.webm',
    poster: '/media/motion/eu-tanzania-roadshow-2026-poster.jpg',
    og: '/media/motion/eu-tanzania-roadshow-2026-og.jpg',
  },
  primary: S.recap,
  sources: [S.recap, S.briefing, S.helsinki, S.cesena, S.hague, S.ports, S.eeas],
  chapters: [
    { t: 0, label: 'The pitch', text: 'Tanzania took its investment pitch to Europe. September – October 2026.' },
    { t: 4.2, label: 'The pipeline', text: '68 projects, worth USD 30.1 billion combined.' },
    { t: 7.3, label: 'Still on the table', text: 'USD 29.1 billion still open to investors. The other USD 1 billion is already under contract.' },
    { t: 10.3, label: 'The sectors', text: 'Three priority sectors: critical minerals, agribusiness, and digital and fintech. Plus two that enable them: renewable energy, and transport and logistics.' },
    { t: 13.9, label: 'The route', text: 'Nine days. Four countries. Helsinki (28–29 September), Cesena (1–2 October), The Hague (5 October), then Rotterdam and Antwerp (6 October).' },
    { t: 24.0, label: 'The status', text: 'Signed deals so far: none reported. Coverage records pitches, offers and talks. About 50 projects are still listed as seeking partners.' },
    { t: 27.1, label: 'What comes next', text: 'Dar es Salaam, early 2027: the EU–Tanzania Investment and Business Forum, where the talks are meant to become partnerships.' },
  ],
  ledger: [
    { status: 'reported', text: '68 projects worth USD 30.1 billion were pitched in four countries.', detail: 'USD 29.1 billion of it is described as still investable.', src: ['recap', 'briefing'] },
    { status: 'reported', text: 'About 50 projects are listed on the forum’s Investment Wall, seeking partners.', src: ['recap'] },
    { status: 'reported', text: 'The EU said it will support the Dar es Salaam port expansion, alongside the World Bank and the EIB.', detail: 'The EIB has received a formal financing request.', src: ['recap', 'ports'] },
    { status: 'not-yet', text: 'Signed deals, MoUs or letters of intent from the roadshow.', detail: 'None are reported in the coverage up to 19 October 2026.', src: ['recap'] },
    { status: 'target', text: '30+ expressions of interest, with 15 reaching due diligence within three months.', detail: 'Set by the organisers before the roadshow. These are goals, not results.', src: ['briefing'] },
    { status: 'planned', text: 'The EU–Tanzania Investment and Business Forum in Dar es Salaam, early 2027.', detail: 'The second phase of the forum. No exact date has been published in the sources.', src: ['recap', 'eeas'] },
  ],
  route: [
    { date: '28–29 Sep', place: 'Helsinki', country: 'Finland', focus: 'Critical minerals and digital', note: 'Finnvera and Finnfund said they are open to Tanzanian deals.', src: ['recap', 'helsinki'] },
    { date: '1–2 Oct', place: 'Cesena', country: 'Italy', focus: 'Agribusiness, energy and digital', note: 'Italy’s CDP reported advanced talks on about EUR 400 million of projects.', src: ['recap', 'cesena'] },
    { date: '5 Oct', place: 'The Hague', country: 'Netherlands', focus: 'Agriculture, ports and rail', note: 'About 90 businesses took part.', src: ['hague'] },
    { date: '6 Oct', place: 'Rotterdam → Antwerp', country: 'Netherlands & Belgium', focus: 'Port, rail and logistics visits', note: 'Site visits to APM Terminals and the Port of Antwerp-Bruges.', src: ['ports'] },
  ],
  made: [
    'Built in code with Three.js and rendered frame by frame at 1920 × 1080, 60 frames per second.',
    'Map: Natural Earth country boundaries (public domain). Routes between host cities are schematic, not flight paths.',
    'No narration. The on-screen text carries the story so it works with the sound off; the score was composed for the film.',
    'Figures are as reported by the sources listed below. We have not verified them independently.',
  ],
};

export const motionSnapshots = [euTanzaniaRoadshow];
export const sourceById = (id: string) => euTanzaniaRoadshow.sources.find((s) => s.id === id)!;
