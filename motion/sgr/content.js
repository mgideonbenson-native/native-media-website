/**
 * Every word and number on screen in the SGR film. Edit here, not in film.js.
 * Each figure carries a `src` key that points to SOURCES (also listed in PRODUCTION.md).
 * Times are seconds from the start of the film (30 fps, 120 s).
 */
window.CONTENT = {
  palette: {
    orange: '#E8752A', charcoal: '#161615', black: '#0B0B0A', cream: '#EFE7D6', cream2: '#E3D8C2',
    white: '#FFFFFF', grey: '#8E8C86', grey2: '#5E5C57', ink: '#1E1D1B',
  },

  // 0:00–0:15 · The opening hook (golden-hour tracking shot)
  opening: {
    kicker: { t: 1.4, text: 'TANZANIA · 2026' },
    line1: { t: 2.6, out: 8.6, text: ['Tanzania is building a new railway', 'across the country.'] },
    line2: { t: 9.2, text: 'THE STANDARD GAUGE RAILWAY' },
    line3: { t: 10.6, text: 'Can one line change how a country moves?' },
  },

  // 0:15–0:35 · The scale of the project (map)
  scale: {
    central: { t: 17.0, out: 21.0, year: '1914', text: 'The metre-gauge Central Line reaches Kigoma.', src: 'central' },
    operating: { t: 21.0, text: 'Operating since 2024', sub: 'Dar es Salaam – Dodoma', src: 'launch' },
    corridor: { t: 24.6, value: 1219, unit: 'km', label: 'Dar es Salaam – Mwanza', sub: 'Phase one, in five construction lots', src: 'corridor' },
    kigoma: { t: 29.0, text: 'Tabora – Kigoma · 506 km', sub: 'Under construction', src: 'lot6' },
    legend: [
      { kind: 'operating', label: 'Built · trains run to Dodoma' },
      { kind: 'construction', label: 'Under construction' },
      { kind: 'central', label: 'Central Line (metre gauge, 1914)' },
    ],
    caption: ['Alignments drawn through stations,', 'schematic at this scale. Map: Natural Earth.'],
  },

  // 0:35–1:00 · Engineering the connection
  engineering: {
    strip: {
      t: 35.6, title: 'THE BUILT SECTION', sub: 'Lots 1 and 2, Dar es Salaam – Makutupora · selected stations', src: 'stations',
      stations: ['Dar es Salaam', 'Pugu', 'Soga', 'Ruvu', 'Ngerengere', 'Morogoro', 'Mkata', 'Kilosa', 'Kidete', 'Gulwe', 'Dodoma', 'Makutupora'],
      major: ['Dar es Salaam', 'Morogoro', 'Dodoma'],
    },
    gauge: {
      t: 41.6, title: 'A WIDER TRACK', src: 'gauge',
      old: { mm: 1000, label: 'Metre gauge · Central Line' },
      sgr: { mm: 1435, label: 'Standard gauge · SGR' },
      layers: ['Rail', 'Sleeper', 'Ballast', 'Formation'],
    },
    power: {
      t: 48.0, title: 'ELECTRIC, NOT DIESEL', src: 'power',
      volts: '25 kV AC', voltsLabel: 'overhead line',
      speeds: [{ v: 160, label: 'Passenger trains' }, { v: 120, label: 'Freight trains' }],
      speedNote: 'Design maximum, km/h',
    },
    fleet: {
      t: 54.0, title: 'THE FLEET', src: 'fleet',
      items: [
        { n: 10, label: 'eight-car electric trains' },
        { n: 17, label: 'electric locomotives' },
        { n: 59, label: 'passenger coaches' },
      ],
      note: 'Ordered from South Korea; deliveries began in 2023. 1,430 freight wagons are contracted from China.',
    },
  },

  // 1:00–1:25 · What changes? Measured vs projected, always labelled.
  change: {
    time: {
      t: 60.4, title: 'DAR ES SALAAM → DODOMA', src: 'time',
      bars: [
        { label: 'By bus', hours: 8, display: 'up to 8 h', tag: 'REPORTED' },
        { label: 'By SGR, fastest train', hours: 3.25, display: '3 h 15 min', tag: 'TIMETABLE' },
      ],
      note: 'Bus: as reported by The Citizen. Train: TRC timetable from January 2026.',
    },
    riders: {
      t: 68.4, value: 5.5, unit: 'million', label: 'passenger journeys', period: 'June 2024 – March 2026',
      tag: 'REPORTED', source: 'Ministry of Transport', src: 'riders',
    },
    freight: {
      t: 76.4, title: 'FREIGHT IS THE TEST', src: 'freight',
      started: 'Freight service began in June 2025.',
      bars: [
        { label: 'Carried, July 2025 – March 2026', tonnes: 102452, display: '102,452 t', tag: 'MEASURED', note: 'nine months' },
        { label: 'Projected for the 2025/26 year', tonnes: 500000, display: '500,000 t', tag: 'PROJECTED', note: 'twelve months' },
      ],
    },
  },

  // 1:25–1:45 · The bigger picture (regional map)
  region: {
    port: { t: 87.4, text: 'It starts at the port.', sub: 'Dar es Salaam, on the Indian Ocean' },
    lakes: { t: 91.0, text: 'It is built to reach Lake Victoria and Lake Tanganyika.', src: 'corridor' },
    burundi: {
      t: 94.6, text: 'Uvinza – Musongati, Burundi', sub: 'Construction launched August 2025 · target 2030', src: 'burundi',
      projection: { tag: 'PROJECTED', text: 'Cost of a 20-ft container to Burundi:', from: 'US$3,800', to: 'US$2,000' },
    },
    rwanda: { t: 99.4, text: 'Isaka – Kigali, Rwanda', sub: 'Proposed · no construction reported', src: 'rwanda' },
    legendExtra: { kind: 'proposed', label: 'Proposed' },
  },

  // 1:45–2:00 · The closing thought
  closing: {
    line1: { t: 106.0, text: 'The electric line reaches Dodoma.' },
    line2: { t: 108.8, text: 'Mwanza, Kigoma and Burundi are still being built.' },
    line3: { t: 112.2, text: ['Its real measure will be', 'what it carries.'] },
    sources: {
      t: 116.6,
      text: 'Sources: Tanzania Railways Corporation · Ministry of Transport · LATRA · Daily News · The Citizen · TanzaniaInvest · The EastAfrican · Railway Journal',
      asOf: 'Figures as reported up to October 2026',
    },
  },
};

// Source keys used above. Full citations and verification notes: PRODUCTION.md → "Fact sheet".
window.SOURCES = {
  central: 'Central Line (Tanzania) history: metre gauge, completed Dar es Salaam–Kigoma in 1914',
  launch: 'Dar es Salaam–Morogoro passenger service June 2024; Dar es Salaam–Dodoma 25 July 2024 (TanzaniaInvest, IRJ, Railway Gazette)',
  corridor: 'Phase one Dar es Salaam–Mwanza, 1,219 km, five lots (Project Herald / TRC; Xinhua)',
  lot6: 'Tabora–Kigoma 506 km (411 km mainline), CCECC–CRCC (TanzaniaInvest; The Citizen, July 2026)',
  stations: 'Station sequence Dar es Salaam–Makutupora (TRC; Wikipedia)',
  gauge: 'SGR 1,435 mm; Central Line 1,000 mm',
  power: '25 kV 50 Hz AC; 160 km/h passenger, 120 km/h freight (Railway Journal)',
  fleet: 'Hyundai Rotem: 10 eight-car EMUs, 17 electric locomotives; Sung Shin: 59 coaches; CRRC 1,430 wagons contract (Railway Journal, Railway Technology)',
  time: 'TRC timetable effective 3 January 2026 (Daily News); bus 8–10 h (The Citizen) / up to 8 h (The Exchange)',
  riders: 'Ministry of Transport via Minister Mbarawa: ~5.5 million passengers June 2024–March 2026 (reported in Rio Times summary of ministry figures)',
  freight: 'Freight launched 27 June 2025 (The Citizen); 102,452 t July 2025–March 2026 vs 500,000 t projected for 2025/26 (Ministry of Transport)',
  burundi: 'Uvinza–Musongati foundation stone 16 August 2025, ~US$2.15bn, target 2030; container cost projection (The EastAfrican, The Chanzo, TanzaniaInvest)',
  rwanda: 'Isaka–Kigali discussed May 2026, still proposed (KT Press, TanzaniaInvest)',
};
