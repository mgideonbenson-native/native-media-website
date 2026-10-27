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

/**
 * Motion explainers: longer motion graphics built from several sources, with a status ledger
 * that keeps what exists apart from what is planned. Render source and fact sheet: motion/<slug>/PRODUCTION.md.
 */
export type Status = 'Operating' | 'Built' | 'Under construction' | 'Construction launched' | 'Proposed';

export interface MotionExplainer {
  slug: string;
  title: string;
  dek: string;
  date: string;
  duration: string;
  seconds: number;
  runtimeLabel: string;
  asOf: string;
  video: { hd: string; sd: string; webm: string; poster: string; og: string };
  chapters: { t: number; label: string; text: string }[];
  ledger: { section: string; status: Status; detail: string }[];
  sources: Source[];
}

export const tanzaniaSgr: MotionExplainer = {
  slug: 'tanzania-sgr',
  title: 'Tanzania’s Standard Gauge Railway, in two minutes.',
  dek: 'An electric line from the port to the lakes: what is running, what is still being built, and what the first figures show.',
  date: '2026-10-27',
  duration: 'PT2M',
  seconds: 120,
  runtimeLabel: '2:00',
  asOf: 'Figures as reported up to October 2026',
  video: {
    hd: '/media/motion/tanzania-sgr-2026-1080.mp4',
    sd: '/media/motion/tanzania-sgr-2026-720.mp4',
    webm: '/media/motion/tanzania-sgr-2026-720.webm',
    poster: '/media/motion/tanzania-sgr-2026-poster.jpg',
    og: '/media/motion/tanzania-sgr-2026-og.jpg',
  },
  chapters: [
    { t: 0, label: 'The question', text: 'Tanzania is building a new railway across the country. The Standard Gauge Railway: can one line change how a country moves?' },
    { t: 15, label: 'The scale', text: 'In 1914 the metre-gauge Central Line reached Kigoma. The new line follows the same corridor. Operating since 2024: Dar es Salaam to Dodoma. Phase one, Dar es Salaam to Mwanza, is 1,219 km in five construction lots. Tabora to Kigoma, 506 km, is under construction.' },
    { t: 35, label: 'The built section', text: 'Lots 1 and 2, Dar es Salaam to Makutupora, selected stations: Dar es Salaam, Pugu, Soga, Ruvu, Ngerengere, Morogoro, Mkata, Kilosa, Kidete, Gulwe, Dodoma, Makutupora. Passenger trains have run Dar es Salaam to Dodoma since 2024; freight since 2025.' },
    { t: 41.2, label: 'A wider track', text: 'Standard gauge is 1,435 mm between the rails; the Central Line is 1,000 mm. The track is built up from rail, sleeper, ballast and formation.' },
    { t: 47.4, label: 'Electric', text: 'Power comes from a 25 kV AC overhead line. Design maximum speeds: 160 km/h for passenger trains, 120 km/h for freight.' },
    { t: 53.6, label: 'The fleet', text: '10 eight-car electric trains, 17 electric locomotives and 59 passenger coaches, ordered from South Korea; deliveries began in 2023. 1,430 freight wagons are contracted from China.' },
    { t: 60, label: 'Journey time', text: 'Dar es Salaam to Dodoma: up to 8 hours by bus (reported); 3 h 15 min on the fastest train (TRC timetable from January 2026).' },
    { t: 67.6, label: 'Passengers', text: 'About 5.5 million passenger journeys on the SGR, June 2024 to March 2026 (reported by the Ministry of Transport).' },
    { t: 75.6, label: 'Freight', text: 'Freight service began in June 2025. Measured: 102,452 tonnes carried July 2025 to March 2026 (nine months). Projected: 500,000 tonnes for the 2025/26 year (twelve months). Passenger numbers are on record; the freight case is still being made.' },
    { t: 85.4, label: 'The bigger picture', text: 'The line starts at Dar es Salaam port and is built to reach Mwanza on Lake Victoria and Kigoma on Lake Tanganyika. Uvinza to Musongati, Burundi: construction launched August 2025, target 2030; projected to cut the cost of a 20-ft container to Burundi from US$3,800 to US$2,000. Isaka to Kigali, Rwanda: proposed, no construction reported.' },
    { t: 104.8, label: 'What it carries', text: 'The electric line reaches Dodoma. Mwanza, Kigoma and Burundi are still being built. Its real measure will be what it carries.' },
  ],
  ledger: [
    { section: 'Dar es Salaam – Morogoro – Dodoma', status: 'Operating', detail: 'Passengers since June / July 2024; freight since June 2025' },
    { section: 'Dodoma – Makutupora', status: 'Built', detail: 'End of Lot 2, substantially complete by March 2026; scheduled passenger trains terminate at Dodoma' },
    { section: 'Makutupora – Tabora – Isaka', status: 'Under construction', detail: 'Lots 3 and 4; inspected by the TRC board, September 2026' },
    { section: 'Isaka – Mwanza', status: 'Under construction', detail: 'Lot 5; 63% complete by February 2025, work continuing at the September 2026 inspection' },
    { section: 'Tabora – Kigoma', status: 'Under construction', detail: 'Lot 6, 506 km; works past 10% as reported in July 2026' },
    { section: 'Uvinza – Musongati (Burundi)', status: 'Construction launched', detail: 'Foundation stone 16 August 2025; target 2030' },
    { section: 'Isaka – Kigali (Rwanda)', status: 'Proposed', detail: 'Discussed by both presidents, May 2026; no construction reported' },
  ],
  sources: [
    { publisher: 'Daily News', title: 'TRC releases new SGR timetable for Dar–Dodoma route', date: 'January 2026', url: 'https://dailynews.co.tz/trc-releases-new-sgr-timetable-for-dar-dodoma-route/' },
    { publisher: 'TanzaniaInvest', title: 'Tanzania launches Dar es Salaam–Dodoma SGR service', date: 'July 2024', url: 'https://www.tanzaniainvest.com/transport/trc-launches-dar-es-salaam-dodoma-sgr-service' },
    { publisher: 'The Citizen', title: 'Tanzania SGR freight service starts after successful trials', date: 'June 2025', url: 'https://www.thecitizen.co.tz/tanzania/news/national/tanzania-sgr-freight-service-starts-after-successful-trials-5096266' },
    { publisher: 'Rio Times', title: 'Tanzania’s electric railway took in US$64 million in 2024–26 (Ministry of Transport figures)', date: '2026', url: 'https://www.riotimesonline.com/tanzania-electric-railway-sgr-revenue-2026/' },
    { publisher: 'The Respondents', title: 'TRC board calls for faster pace on Makutupora–Mwanza SGR', date: 'September 2026', url: 'https://www.therespondents.co.tz/2026/09/trc-board-calls-for-faster-pace-on.html' },
    { publisher: 'TanzaniaInvest', title: 'Tanzania’s SGR Mwanza–Isaka section reaches 63% completion', date: 'February 2025', url: 'https://www.tanzaniainvest.com/transport/tanzanias-sgr-mwanza-isaka-section-reaches-63-percent-completion' },
    { publisher: 'The Citizen', title: 'Tanzania to launch construction of Sh6.31 trillion SGR lot linking Tabora and Kigoma', date: 'July 2026', url: 'https://thecitizen.co.tz/tanzania/news/national/tanzania-to-launch-construction-of-sh6-31-trillion-sgr-lot-linking-tabora-and-kigoma-5529930' },
    { publisher: 'The EastAfrican', title: 'Tanzania, Burundi launch construction of $2bn joint SGR project', date: 'August 2025', url: 'https://theeastafrican.co.ke/tea/business-tech/tanzania-burundi-launch-construction-of-2bn-sgr-project-5159408' },
    { publisher: 'The Chanzo', title: 'Tanzania, Burundi kick off landmark standard gauge railway project', date: '17 August 2025', url: 'https://thechanzo.com/2025/08/17/tanzania-burundi-kick-off-landmark-standard-gauge-railway-project/' },
    { publisher: 'Railway Journal', title: 'Tanzania receives first EMU', date: 'April 2024', url: 'https://www.railjournal.com/africa/tanzania-receives-first-emu/' },
    { publisher: 'The Citizen', title: 'Rising dynamics: how SGR trains set the stage for transport innovation in Tanzania', date: '2024', url: 'https://thecitizen.co.tz/tanzania/news/national/rising-dynamics-how-sgr-trains-set-the-stage-for-transport-innovation-in-tanzania-4711756' },
    { publisher: 'KT Press', title: 'Kagame heads to Tanzania as Kigali and Dar es Salaam deepen economic ties', date: 'May 2026', url: 'https://www.ktpress.rw/2026/05/kagame-heads-to-tanzania-as-kigali-and-dar-es-salaam-deepen-economic-ties/' },
  ],
};

export const motionExplainers = [tanzaniaSgr];
