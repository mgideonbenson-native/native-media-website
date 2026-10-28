/**
 * Tanzania SGR v2 — every word, number and source on screen. Edit here, not in film.js.
 *
 * Each figure in DATA records: value, unit, period, status (actual | timetable | reported | forecast | ordered),
 * source, and why it matters. Times in SCENES are seconds (30 fps, 120 s total).
 */
window.DATA = {
  corridor: { value: 1219, unit: 'km', label: 'Phase one, Dar es Salaam – Mwanza', status: 'plan', source: 'TRC, via The Project Herald; Xinhua' },
  operatingSince: { passengerDodoma: '25 July 2024', passengerMorogoro: 'June 2024', freight: 'June 2025', source: 'TanzaniaInvest; Railway Gazette; The Citizen' },
  gauge: { sgr: 1435, metre: 1000, unit: 'mm', source: 'Standard gauge (SGR); metre gauge (Central Line, completed 1914)' },
  power: { value: '25 kV AC', label: 'overhead line', source: 'Railway Journal; TRC' },
  speed: { passenger: 160, freight: 120, unit: 'km/h', status: 'design maximum', source: 'Railway Journal' },
  fleet: {
    emu: { value: 10, label: 'electric multiple units, eight cars each', status: 'ordered', source: 'Railway Journal; Daily News' },
    loco: { value: 17, label: 'electric locomotives', status: 'ordered', source: 'Railway Journal; Railway Gazette' },
    coach: { value: 59, label: 'passenger coaches', status: 'ordered', source: 'Railway Journal' },
    wagons: { value: 1430, label: 'freight wagons contracted', status: 'ordered', source: 'Railway Technology' },
  },
  journey: {
    bus: { lo: 8, hi: 10, unit: 'h', status: 'reported', period: '2024', source: 'The Citizen' },
    sgr: { value: 3.25, display: '3 h 15 min', status: 'timetable', period: 'from 3 January 2026', source: 'TRC timetable via Daily News' },
    why: 'Dar es Salaam is the commercial hub; Dodoma is the capital.',
  },
  passengers: {
    total: { value: 5.5, unit: 'million', period: 'June 2024 – March 2026', status: 'reported', source: 'Ministry of Transport (Deputy Minister D. Kihenzile), The Citizen, 2 Oct 2026' },
    before: { value: 2.05, period: 'July 2024 – March 2025', status: 'actual', source: 'Ministry of Transport' },
    after: { value: 2.51, period: 'July 2025 – March 2026', status: 'actual', source: 'Ministry of Transport' },
    growth: '+22.4%',
    why: 'The same nine months, a year apart: demand is still rising.',
  },
  freight: {
    actual: { value: 102452, unit: 't', period: 'July 2025 – March 2026 (9 months)', status: 'actual', source: 'Ministry of Transport' },
    forecast: { value: 500000, unit: 't', period: 'Financial year 2025/26 (12 months)', status: 'forecast', source: 'TRC projection, Ministry of Transport' },
    why: 'Freight is what the corridor was built to carry from the port inland.',
  },
  port: { value: 10.93, unit: 'million t', label: 'cargo for landlocked neighbours through Dar es Salaam port', period: 'July 2025 – March 2026', status: 'reported', source: 'Tanzania Ports Authority' },
  burundi: { label: 'Uvinza – Musongati (Burundi)', status: 'construction launched August 2025 · target 2030', source: 'The EastAfrican; The Chanzo' },
  rwanda: { label: 'Isaka – Kigali (Rwanda)', status: 'proposed · no construction reported', source: 'KT Press; TanzaniaInvest (May 2026)' },
};

window.TEXT = {
  open: {
    kicker: 'TANZANIA · STANDARD GAUGE RAILWAY',
    title: ['A new railway is', 'crossing Tanzania.'],
    question: 'Can one line change how a country moves?',
  },
  map: {
    kicker: 'THE CORRIDOR',
    operating: { tag: 'OPERATING', title: 'Dar es Salaam – Dodoma', sub: 'Passenger trains since 2024 · freight since June 2025' },
    built: { tag: 'BUILT', title: 'Dodoma – Makutupora', sub: 'Completed track; scheduled trains end at Dodoma' },
    construction: { tag: 'UNDER CONSTRUCTION', title: 'Makutupora – Tabora – Mwanza', sub: 'Lots 3, 4 and 5' },
    kigoma: { tag: 'UNDER CONSTRUCTION', title: 'Tabora – Kigoma', sub: 'Lot 6 · alignment mapped to ~30.7°E so far' },
    legend: [
      { kind: 'operating', label: 'Operating' },
      { kind: 'built', label: 'Built, not yet in service' },
      { kind: 'construction', label: 'Under construction' },
      { kind: 'proposed', label: 'Proposed' },
    ],
    note: 'Relief: SRTM / GMTED2010 (AWS Terrain Tiles). Route: OpenStreetMap contributors. Borders, lakes: Natural Earth.',
  },
  track: {
    kicker: 'HOW IT IS BUILT', title: 'Layer by layer',
    layers: ['Rail', 'Rail fastening', 'Concrete sleeper', 'Ballast', 'Formation'],
    note: 'Illustrative cross-section; proportions approximate.',
  },
  gauge: { kicker: 'A WIDER TRACK', title: 'Standard gauge', metreLabel: 'Metre gauge · Central Line (1914)', sgrLabel: 'Standard gauge · SGR' },
  power: { kicker: 'ELECTRIC, NOT DIESEL', title: 'Power from overhead' },
  fleet: { kicker: 'THE FLEET', title: 'Ordered from South Korea and China', note: 'Delivery of all units not confirmed in published reports.' },
  data: {
    journey: { kicker: 'WHAT CHANGES', title: 'Dar es Salaam → Dodoma' },
    passengers: { kicker: 'PASSENGERS', title: 'People are using it' },
    freight: { kicker: 'FREIGHT', title: 'The real test' },
  },
  region: {
    kicker: 'THE BIGGER PICTURE',
    port: { title: 'It starts at the port' },
    links: { title: 'Built to reach the lakes, and beyond' },
    indicative: 'Dashed connectors are indicative: no published alignment.',
  },
  close: {
    lines: ['Electric trains already run to Dodoma.', 'The rest of the corridor is still being built.', 'Its real test is what it carries.'],
    sources: 'Sources: Tanzania Railways Corporation · Ministry of Transport · Tanzania Ports Authority · LATRA · The Citizen · Daily News · TanzaniaInvest · The EastAfrican · Railway Journal · Railway Gazette',
    asOf: 'Figures as reported up to October 2026',
  },
};
