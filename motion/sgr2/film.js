/**
 * Tanzania SGR v2: a two-minute dimensional editorial film rendered by the browser (SVG, CSS 3D transforms, DOM).
 * renderFrame(t) is deterministic: no CSS transitions or timers; every property is set from t.
 * Story order and transitions follow PRODUCTION.md. Content: content.js. Components: lib/.
 */
(async () => {
  const { clamp, lerp, prog, eio, eo, win, keys, fmt, rnd, svg, html, css, show } = window.K;
  const { projector, Solid, draw } = window.SOLID;
  const CP = window.COMP, Cc = CP.C, D = window.DATA, T = window.TEXT;
  const W = 1280, H = 720;
  const V = await (await fetch('assets/vectors.json')).json();
  const stage = document.getElementById('stage'), ui = document.getElementById('ui'), scene = document.getElementById('scene');
  const mapStage = document.getElementById('mapStage'), plane = document.getElementById('mapPlane'), mapVec = document.getElementById('mapVec');
  const anchorsEl = document.getElementById('mapAnchors'), mapLabels = document.getElementById('mapLabels');

  // ── film grain (static tiles, cycled per frame) ─────────────────────────────────────────────────────
  const grainEl = document.getElementById('grain');
  const grainTiles = [0, 1, 2].map((k) => {
    const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), im = g.createImageData(256, 256), r = rnd(11 + k);
    for (let i = 0; i < im.data.length; i += 4) { const v = 128 + (r() - 0.5) * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    g.putImageData(im, 0, 0); return `url(${c.toDataURL()})`;
  });

  // ═════════════════════════════════════════════════════════════════════════════════════════════════════
  // MAP (persistent; used by the corridor, region and closing scenes)
  // ═════════════════════════════════════════════════════════════════════════════════════════════════════
  css(plane, { width: V.width + 'px', height: V.height + 'px' });
  mapVec.setAttribute('width', V.width); mapVec.setAttribute('height', V.height); mapVec.setAttribute('viewBox', `0 0 ${V.width} ${V.height}`);
  const defs = svg('defs', {}, mapVec);
  const gBorders = svg('g', { fill: 'none', stroke: Cc.cream, 'stroke-opacity': 0.22, 'stroke-linejoin': 'round' }, mapVec);
  V.borders.forEach((d) => svg('path', { d }, gBorders));
  const tzOutline = svg('path', { d: V.tanzania, fill: 'none', stroke: Cc.cream, 'stroke-opacity': 0.55, 'stroke-linejoin': 'round' }, mapVec);
  const gRoutes = svg('g', { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, mapVec);
  // each route: dark halo (legibility on the cream relief), styled line, both revealed through a mask
  const routes = {};
  [...V.sections, ...V.indicative].forEach((s, i) => {
    const st = CP.ROUTE_STYLE[s.status];
    const m = svg('mask', { id: 'rm' + i, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: V.width, height: V.height }, defs);
    const mp = svg('path', { d: s.d, fill: 'none', stroke: '#fff', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, m);
    const halo = svg('path', { d: s.d, stroke: Cc.charcoal, 'stroke-opacity': 0.35, mask: `url(#rm${i})` }, gRoutes);
    const line = svg('path', { d: s.d, stroke: st.stroke, 'stroke-opacity': st.opacity, mask: `url(#rm${i})` }, gRoutes);
    routes[s.key] = { s, st, mp, halo, line, len: 0 };
  });
  // anchors (points in plane space whose screen position the browser computes for us)
  const anchor = (p) => { const i = html('i', '', null, anchorsEl); css(i, { left: p[0] + 'px', top: p[1] + 'px' }); return i; };
  const sta = {}; const allPts = { ...V.stations, ...V.towns };
  for (const k in allPts) sta[k] = { ...allPts[k], a: anchor(allPts[k].p) };
  const mk = (k, { minor = false, left = false, below = false } = {}) => {
    const m = html('div', 'marker' + (minor ? ' minor' : ''), null, mapLabels), l = html('div', 'mlabel' + (minor ? ' minor' : '') + (left ? ' left' : '') + (below ? ' below' : ''), sta[k].name, mapLabels);
    return { k, m, l };
  };
  const markers = {
    dar: mk('dar', { left: true }), morogoro: mk('morogoro', { minor: true, below: true }), dodoma: mk('dodoma'), makutupora: mk('makutupora', { minor: true }),
    tabora: mk('tabora'), isaka: mk('isaka', { minor: true }), mwanza: mk('mwanza'), kigoma: mk('kigoma', { left: true }),
    uvinza: mk('uvinza', { minor: true }), musongati: mk('musongati', { minor: true, left: true }), kigali: mk('kigali', { minor: true, left: true }),
  };
  const ctx = {}; // context labels
  for (const [n, p] of Object.entries(V.labels.countries)) ctx[n] = { a: anchor(p), e: html('div', 'clabel' + (n === 'TANZANIA' ? ' tz' : ''), n, mapLabels) };
  for (const [n, p] of Object.entries(V.labels.water)) ctx[n] = { a: anchor(p), e: html('div', 'wlabel', n, mapLabels) };

  const stageRect = () => stage.getBoundingClientRect();
  function placeAt(el, a, alpha) {
    const r = a.getBoundingClientRect(), s = stageRect(), sc = s.width / W;
    css(el, { left: ((r.left - s.left) / sc).toFixed(1) + 'px', top: ((r.top - s.top) / sc).toFixed(1) + 'px' });
    show(el, alpha);
  }
  function screenOf(a) { const r = a.getBoundingClientRect(), s = stageRect(), sc = s.width / W; return [(r.left - s.left) / sc, (r.top - s.top) / sc]; }

  /** map camera: centre (x, y) in plane px, scale s, tilt (deg), rotation (deg) */
  function mapCam({ x, y, s, tilt, rot = 0 }) {
    css(plane, { transform: `translate(640px, 392px) rotateX(${tilt.toFixed(3)}deg) rotateZ(${rot.toFixed(3)}deg) scale(${s.toFixed(4)}) translate(${(-x).toFixed(2)}px, ${(-y).toFixed(2)}px)` });
    // keep strokes a constant on-screen weight
    gBorders.setAttribute('stroke-width', (1 / s).toFixed(3)); tzOutline.setAttribute('stroke-width', (1.4 / s).toFixed(3));
    for (const k in routes) {
      const r = routes[k], w = r.st.width / s;
      r.line.setAttribute('stroke-width', w.toFixed(3)); r.halo.setAttribute('stroke-width', (w + 4 / s).toFixed(3));
      r.mp.setAttribute('stroke-width', (w + 6 / s).toFixed(3));
      if (r.st.dash) r.line.setAttribute('stroke-dasharray', r.st.dash.map((v) => (v / s).toFixed(3)).join(' '));
    }
  }
  /** reveal p ∈ [0,1] of a route (mask path drawn with a dash of length p·len) */
  function routeReveal(k, p) {
    const r = routes[k];
    if (!r.len) { r.len = r.mp.getTotalLength(); r.mp.setAttribute('stroke-dasharray', `${r.len} ${r.len}`); }
    r.mp.setAttribute('stroke-dashoffset', (r.len * (1 - clamp(p))).toFixed(1));
  }
  const mid = (a, b, t = 0.5) => [lerp(sta[a].p[0], sta[b].p[0], t), lerp(sta[a].p[1], sta[b].p[1], t)];
  const TZ_C = [V.labels.countries.TANZANIA[0] + 40, V.labels.countries.TANZANIA[1] - 300];   // visual centre of the country

  // ═════════════════════════════════════════════════════════════════════════════════════════════════════
  // UI blocks (created once, driven per frame)
  // ═════════════════════════════════════════════════════════════════════════════════════════════════════
  const titleOpen = CP.sectionTitle(ui, { kicker: T.open.kicker, title: T.open.title, sub: T.open.question, size: 'xl', y: 92, width: 640 });
  const cardEl = (tag, kind, ttl, sb) => { const e = html('div', 'card', `<span class="tag ${kind}">${tag}</span><div class="ttl">${ttl}</div><div class="sb">${sb}</div>`, ui); css(e, { left: '880px', top: '96px', width: '336px' }); return e; };
  const cards = {
    operating: cardEl(T.map.operating.tag, 'solid', T.map.operating.title, T.map.operating.sub),
    built: cardEl(T.map.built.tag, 'solid', T.map.built.title, T.map.built.sub),
    construction: cardEl(T.map.construction.tag, 'line', T.map.construction.title, T.map.construction.sub),
    kigoma: cardEl(T.map.kigoma.tag, 'line', T.map.kigoma.title, T.map.kigoma.sub),
  };
  const mapKicker = html('div', 'block', `<span class="rule"></span><div class="kicker">${T.map.kicker}</div>`, ui); css(mapKicker, { left: '64px', top: '64px' });
  const corridor = html('div', 'card', `<span class="tag grey">PHASE ONE · PLAN</span><div class="num" style="font-size:64px;margin-top:6px"><span id="corN">0</span><span style="font-size:26px;color:var(--orange);margin-left:8px">km</span></div><div class="sb">${D.corridor.label}<br>in five construction lots</div>`, ui);
  css(corridor, { left: '880px', top: '300px', width: '336px' });
  const corN = corridor.querySelector('#corN');
  const legend = CP.legend(ui, T.map.legend, { x: 64, y: 588 });
  const mapNote = CP.sourceNote(ui, T.map.note, { x: 64, y: 690, align: 'right', width: 720 });

  // ═════════════════════════════════════════════════════════════════════════════════════════════════════
  // SVG illustration layers (opening track, engineering, charts)
  // ═════════════════════════════════════════════════════════════════════════════════════════════════════
  const sdefs = svg('defs', {}, scene);
  const sky = svg('linearGradient', { id: 'sky', x1: 0, y1: 0, x2: 0, y2: 1 }, sdefs);
  [[0, '#121212'], [0.55, '#2a2420'], [0.82, '#6b4128'], [1, '#c9733a']].forEach(([o, c]) => svg('stop', { offset: o, 'stop-color': c }, sky));
  const ground = svg('linearGradient', { id: 'ground', x1: 0, y1: 0, x2: 0, y2: 1 }, sdefs);
  [[0, '#2b221c'], [1, '#0d0c0b']].forEach(([o, c]) => svg('stop', { offset: o, 'stop-color': c }, ground));
  const hatch = svg('pattern', { id: 'rangeHatch', width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, sdefs);
  svg('rect', { width: 6, height: 6, fill: 'rgba(142,140,134,0.25)' }, hatch); svg('line', { x1: 0, y1: 0, x2: 0, y2: 6, stroke: '#8e8c86', 'stroke-width': 2 }, hatch);
  const glow = svg('filter', { id: 'glow', x: '-20%', y: '-20%', width: '140%', height: '140%' }, sdefs);
  svg('feGaussianBlur', { stdDeviation: 6 }, glow);

  const gOpen = svg('g', {}, scene);
  const openSky = svg('rect', { x: 0, y: 0, width: W, height: H, fill: 'url(#sky)' }, gOpen);
  const openGround = svg('path', { fill: 'url(#ground)' }, gOpen);
  const openSun = svg('circle', { r: 60, fill: '#E8752A', opacity: 0.18, filter: 'url(#glow)' }, gOpen);
  const openSolid = svg('g', {}, gOpen), openWires = svg('g', {}, gOpen);
  const mergeGlow = svg('path', { fill: 'none', stroke: Cc.orange, 'stroke-width': 14, opacity: 0, filter: 'url(#glow)', 'stroke-linecap': 'round' }, scene);
  const mergeLine = svg('path', { fill: 'none', stroke: Cc.orange, 'stroke-width': 5, opacity: 0, 'stroke-linecap': 'round' }, scene);

  const gEng = svg('g', {}, scene);
  const engBg = svg('rect', { x: 0, y: 0, width: W, height: H, fill: Cc.charcoal }, gEng);
  const engFloor = svg('ellipse', { cx: 640, cy: 520, rx: 620, ry: 120, fill: '#1d1c1a' }, gEng);
  const engSolid = svg('g', {}, gEng), engWires = svg('g', {}, gEng), engOver = svg('g', {}, gEng);

  const gData = svg('g', {}, scene);

  // engineering titles, callouts, panels
  const tTrack = CP.sectionTitle(ui, { kicker: T.track.kicker, title: T.track.title, y: 64 });
  const layerCallouts = T.track.layers.map((n) => CP.callout(engOver, n, { ax: 0, ay: 0, lx: 0, ly: 0 }));
  const trackNote = CP.sourceNote(ui, T.track.note, { y: 684 });
  const tPower = CP.sectionTitle(ui, { kicker: T.power.kicker, title: T.power.title, y: 64 });
  const powerCall = CP.callout(engOver, `${D.power.value} ${D.power.label}`, { ax: 0, ay: 0, lx: 0, ly: 0 });
  const pantoCall = CP.callout(engOver, 'Pantograph collects current', { ax: 0, ay: 0, lx: 0, ly: 0 });
  const speedPanel = html('div', 'block', `<div class="kicker" style="color:var(--grey)">DESIGN MAXIMUM SPEED</div>
    <div style="display:flex;gap:40px;margin-top:10px"><div><div class="num" style="font-size:56px">${D.speed.passenger}</div><div class="label">km/h passenger</div></div>
    <div><div class="num" style="font-size:56px;color:var(--cream-2)">${D.speed.freight}</div><div class="label">km/h freight</div></div></div>`, ui);
  css(speedPanel, { left: '900px', top: '84px' });
  const powerNote = CP.sourceNote(ui, `Sources: ${D.power.source}; ${D.speed.source}. Speeds are design maxima, not average service speeds.`, { y: 684, align: 'right', width: 700 });
  const tFleet = CP.sectionTitle(ui, { kicker: T.fleet.kicker, title: T.fleet.title, y: 52, width: 1100 });
  const fleetEls = [D.fleet.emu, D.fleet.loco, D.fleet.coach].map((f, i) => {
    const e = html('div', 'block', `<div class="num" style="font-size:84px;color:var(--orange)">0</div><div class="label" style="margin-top:8px;width:230px">${f.label}</div>`, ui);
    css(e, { left: 64 + i * 300 + 'px', top: '176px' }); return e;
  });
  const fleetTag = html('div', 'block', `<span class="tag line">ORDERED</span><span class="note" style="margin-left:12px;font-size:13px;color:var(--cream-2)">${fmt(D.fleet.wagons.value)} ${D.fleet.wagons.label} · ${T.fleet.note}</span>`, ui);
  css(fleetTag, { left: '64px', top: '324px' });
  const fleetNote = CP.sourceNote(ui, `Sources: ${D.fleet.emu.source}; ${D.fleet.wagons.source}.`, { y: 684 });
  const tGauge = CP.sectionTitle(ui, { kicker: T.gauge.kicker, title: T.gauge.title, y: 64 });
  const gaugeLine = svg('g', {}, scene);
  const gl = { line: svg('line', { stroke: Cc.orange, 'stroke-width': 2.5 }, gaugeLine), t1: svg('line', { stroke: Cc.orange, 'stroke-width': 2 }, gaugeLine), t2: svg('line', { stroke: Cc.orange, 'stroke-width': 2 }, gaugeLine),
    label: svg('text', { fill: Cc.white, 'font-size': 40, 'font-weight': 600, 'text-anchor': 'middle', 'font-family': 'Poppins' }, gaugeLine),
    sub: svg('text', { fill: Cc.cream2, 'font-size': 15, 'font-weight': 500, 'text-anchor': 'middle', 'font-family': 'Poppins' }, gaugeLine) };
  const gaugeNote = CP.sourceNote(ui, `${D.gauge.source}. Gauge is measured between the inner faces of the rail heads.`, { y: 684 });

  // data charts
  const tJourney = CP.sectionTitle(ui, { kicker: T.data.journey.kicker, title: T.data.journey.title, y: 64 });
  const chartJ = CP.barChart(gData, { x: 64, y: 290, w: 1020, rowH: 110, labelW: 270, axis: { max: 10, step: 1, fmt: (v) => v + ' h', title: 'Journey time, hours' }, rows: [
    { label: 'By bus', period: 'Reported range', lo: D.journey.bus.lo, hi: D.journey.bus.hi, display: '8–10 h', tag: 'REPORTED', tagKind: 'grey', color: '#6f6d67' },
    { label: 'By SGR, fastest train', period: 'TRC timetable, from 3 Jan 2026', value: D.journey.sgr.value, display: D.journey.sgr.display, tag: 'TIMETABLE', tagKind: 'solid' },
  ] });
  const whyJ = html('div', 'block sub', D.journey.why, ui); css(whyJ, { left: '64px', top: '560px', width: '700px' });
  const noteJ = CP.sourceNote(ui, `Sources: bus — ${D.journey.bus.source} (reported range); train — ${D.journey.sgr.source}.`, { y: 684 });

  const tPass = CP.sectionTitle(ui, { kicker: T.data.passengers.kicker, title: T.data.passengers.title, y: 64 });
  const passBig = CP.counter(ui, { x: 64, y: 210, size: 128, unit: 'million', unitSize: 0.28, decimals: 1 });
  const passTxt = html('div', 'block', `<div class="label" style="font-size:18px">passenger journeys, ${D.passengers.total.period}</div><div style="margin-top:12px"><span class="tag grey">REPORTED</span></div>`, ui);
  css(passTxt, { left: '64px', top: '352px', width: '440px' });
  const chartP = CP.barChart(gData, { x: 580, y: 250, w: 640, rowH: 100, labelW: 220, axis: { max: 3, step: 0.5, fmt: (v) => v + 'm', title: 'Passenger journeys, millions' }, rows: [
    { label: 'Jul 2024 – Mar 2025', period: 'nine months', value: D.passengers.before.value, display: '2.05 m', tag: 'ACTUAL', tagKind: 'grey', color: '#8e8c86' },
    { label: 'Jul 2025 – Mar 2026', period: 'same nine months', value: D.passengers.after.value, display: '2.51 m', tag: D.passengers.growth, tagKind: 'solid' },
  ] });
  const whyP = html('div', 'block sub', D.passengers.why, ui); css(whyP, { left: '580px', top: '500px', width: '640px' });
  const noteP = CP.sourceNote(ui, `Source: ${D.passengers.total.source}. A separate, undated official statement of "over seven million" is not used.`, { y: 684 });

  const tFreight = CP.sectionTitle(ui, { kicker: T.data.freight.kicker, title: T.data.freight.title, sub: `Freight trains began in ${D.operatingSince.freight}.`, y: 64 });
  const chartF = CP.barChart(gData, { x: 64, y: 300, w: 900, rowH: 120, labelW: 330, axis: { max: 500000, step: 100000, fmt: (v) => (v ? fmt(v / 1000) + 'k t' : '0'), title: 'Freight, tonnes' }, rows: [
    { label: 'Carried', period: D.freight.actual.period, value: D.freight.actual.value, display: fmt(D.freight.actual.value) + ' t', tag: 'ACTUAL', tagKind: 'solid' },
    { label: 'Projected for the year', period: D.freight.forecast.period, value: D.freight.forecast.value, display: fmt(D.freight.forecast.value) + ' t', tag: 'FORECAST', tagKind: 'line', kind: 'forecast' },
  ] });
  const whyF = html('div', 'block sub', D.freight.why + ' Note the periods differ: nine months against a full year.', ui); css(whyF, { left: '64px', top: '580px', width: '820px' });
  const noteF = CP.sourceNote(ui, `Sources: ${D.freight.actual.source} (actual); ${D.freight.forecast.source} (forecast).`, { y: 684 });

  // region
  const tRegion = html('div', 'block', `<span class="rule"></span><div class="kicker">${T.region.kicker}</div>`, ui); css(tRegion, { left: '64px', top: '64px' });
  const portPanel = html('div', 'card', `<span class="tag grey">REPORTED</span><div class="ttl" style="font-size:15px;color:var(--cream-2);font-weight:500">Dar es Salaam port · ${D.port.period}</div>
    <div class="num" style="font-size:58px;margin-top:8px">${D.port.value}<span style="font-size:22px;color:var(--orange);margin-left:8px">${D.port.unit}</span></div><div class="sb">${D.port.label}. The SGR is built to carry more of it inland.</div>`, ui);
  css(portPanel, { width: '360px' });
  const linkCards = [
    html('div', 'card', `<span class="tag line">LAUNCHED · INDICATIVE</span><div class="ttl">${D.burundi.label}</div><div class="sb">${D.burundi.status}</div>`, ui),
    html('div', 'card', `<span class="tag grey">PROPOSED · INDICATIVE</span><div class="ttl">${D.rwanda.label}</div><div class="sb">${D.rwanda.status}</div>`, ui),
  ];
  linkCards.forEach((e, i) => css(e, { left: '880px', top: 96 + i * 150 + 'px', width: '336px' }));
  const regionNote = CP.sourceNote(ui, T.region.indicative, { x: 64, y: 690, align: 'right', width: 700 });

  // close
  const scrim = html('div', 'block', '', ui); css(scrim, { left: 0, top: 0, width: '760px', height: '720px', background: 'linear-gradient(90deg, rgba(11,11,10,0.88) 0%, rgba(11,11,10,0.7) 55%, rgba(11,11,10,0) 100%)' });
  ui.prepend(scrim);
  const closeLines = T.close.lines.map((l, i) => { const e = html('div', 'block title', l, ui); css(e, { left: '64px', top: 110 + i * 92 + 'px', width: '470px', fontSize: '32px', color: i === 2 ? 'var(--orange)' : 'var(--white)' }); return e; });
  const closeSrc = html('div', 'block', `<div class="note" style="font-size:12.5px;color:var(--cream-2)">${T.close.sources}</div><div class="note" style="margin-top:6px">${T.close.asOf}</div>`, ui);
  css(closeSrc, { left: '64px', top: '640px', width: '1150px' });

  // ═════════════════════════════════════════════════════════════════════════════════════════════════════
  // SCENES
  // ═════════════════════════════════════════════════════════════════════════════════════════════════════
  const RAIL_TOP = 0.18;
  const ballastDots = (() => { const r = rnd(5), a = []; for (let i = 0; i < 900; i++) a.push([r() * 90, (r() - 0.5) * 3.2, r()]); return a; })();

  // ── 1 · Opening: perspective track at dusk; camera rises to top-down; rails merge into one orange line ──
  function openCam(t) {
    const camX = 7.5 * t, rise = eio(prog(t, 9.0, 3.2));
    return { camX, rise, cam: { yaw: lerp(0, Math.PI / 2, rise), pitch: lerp(0.09, 1.55, rise), dist: lerp(14, 48, rise), fov: lerp(780, 1100, rise), cx: 640, cy: lerp(330, 360, rise), target: [camX + lerp(14, 0, rise), 0, lerp(1.2, 0, rise)] } };
  }
  function opening(t) {
    const a = 1 - prog(t, 11.7, 0.7);
    show(gOpen, a);
    if (a <= 0) return;
    const { camX, rise, cam } = openCam(t);
    const P = projector(cam);
    // sky and ground (horizon follows the camera pitch)
    const hz = P.p([camX + 4000, 0, 0])[1];
    openGround.setAttribute('d', `M0,${Math.min(H, Math.max(-200, hz))}L${W},${Math.min(H, Math.max(-200, hz))}L${W},${H}L0,${H}Z`);
    openSky.setAttribute('opacity', (1 - rise).toFixed(3));
    openSun.setAttribute('cx', 820); openSun.setAttribute('cy', hz + 10); openSun.setAttribute('opacity', (0.22 * (1 - rise)).toFixed(3));
    const S = Solid();
    const x0 = Math.floor((camX - 20) / 0.6) * 0.6, x1 = camX + (rise > 0.5 ? 40 : 120);
    CP.track(S, { x0, x1, fastenings: rise < 0.6 && t < 10.5 });
    for (let m = Math.ceil(x0 / 55) * 55; m < x1; m += 55) CP.mast(S, m, { side: 1 });
    draw(openSolid, P, S.faces, { stroke: 'rgba(0,0,0,0.3)', sw: 0.5 });
    CP.wires(openWires, P, x0, x1, 55, { sw: 1.1, color: '#8e8679' });
    show(openWires, 1 - rise);
  }

  /** the hand-off: once the camera looks straight down, an orange line lights the track centreline, then
   *  stretches onto the map's Dar es Salaam – Morogoro line and fades as the route itself takes over */
  function merge(t) {
    const m = eo(prog(t, 11.0, 0.7)), fa = m * (1 - prog(t, 13.1, 0.6));
    if (fa <= 0) return;
    const { camX, cam } = openCam(Math.min(t, 12.2));
    const P = projector(cam);
    const A = P.p([camX - 16, 0, RAIL_TOP]), B = P.p([camX + 16, 0, RAIL_TOP]);
    let ax = A[0], ay = A[1], bx = B[0], by = B[1];
    if (ax > bx) [ax, ay, bx, by] = [bx, by, ax, ay];
    ax = Math.max(-40, ax - 900); bx = Math.min(W + 40, bx + 900);   // extend across the frame
    const k = eio(prog(t, 11.8, 1.4));
    if (k > 0) { const sd = screenOf(sta.dar.a), sm = screenOf(sta.morogoro.a); ax = lerp(ax, sm[0], k); ay = lerp(ay, sm[1], k); bx = lerp(bx, sd[0], k); by = lerp(by, sd[1], k); }
    const d = `M${ax.toFixed(1)},${ay.toFixed(1)}L${bx.toFixed(1)},${by.toFixed(1)}`;
    mergeLine.setAttribute('d', d); mergeGlow.setAttribute('d', d);
    mergeLine.setAttribute('opacity', fa.toFixed(3)); mergeGlow.setAttribute('opacity', (0.5 * fa).toFixed(3));
  }

  // ── 2 · Corridor map (12–39 s) and 5 · region (92–108) and 6 · close (108–120) share the map ─────────────────
  const KM = (() => {
    const c = TZ_C, dar = sta.dar.p, mor = sta.morogoro.p, dod = sta.dodoma.p, tab = sta.tabora.p;
    return {
      corridor: [
        [11.6, { x: (dar[0] + mor[0]) / 2, y: (dar[1] + mor[1]) / 2, s: 2.3, tilt: 0, rot: 0 }],
        [13.6, { x: (dar[0] + mor[0]) / 2, y: (dar[1] + mor[1]) / 2, s: 2.1, tilt: 6, rot: 0 }],
        [17.5, { x: (dar[0] + dod[0]) / 2 + 30, y: dod[1] + 20, s: 1.15, tilt: 30, rot: -2 }],
        [22.0, { x: (dod[0] + tab[0]) / 2 + 200, y: dod[1], s: 0.72, tilt: 36, rot: -1 }],
        [30.0, { x: 1326, y: 1240, s: 0.5, tilt: 38, rot: 0 }],
        [35.5, { x: 1310, y: 1250, s: 0.52, tilt: 37, rot: 1.2 }],
        [39.4, { x: mor[0] - 40, y: mor[1], s: 3.2, tilt: 58, rot: 0 }],
      ],
      region: [
        [91.0, { x: 1326, y: 1240, s: 0.5, tilt: 36, rot: 0 }],
        [93.5, { x: dar[0] - 20, y: dar[1] + 10, s: 1.5, tilt: 30, rot: 0 }],
        [98.2, { x: dar[0] - 10, y: dar[1] + 10, s: 1.55, tilt: 30, rot: 0 }],
        [101.5, { x: sta.isaka.p[0] + 260, y: sta.isaka.p[1] + 60, s: 0.62, tilt: 34, rot: 0 }],
        [107.0, { x: sta.isaka.p[0] + 270, y: sta.isaka.p[1] + 90, s: 0.66, tilt: 34, rot: -1 }],
        [109.5, { x: 640, y: 1250, s: 0.46, tilt: 36, rot: 0 }],
        [120.0, { x: 660, y: 1270, s: 0.44, tilt: 38, rot: 1 }],
      ],
    };
  })();
  const REV = { operating: [12.3, 16.3], built: [16.8, 18.0], lot34: [21.6, 24.6], lot5: [24.3, 26.4], lot6: [27.6, 29.6], kigoma: [29.4, 30.4], burundi: [101.6, 102.8], rwanda: [103.4, 104.8] };

  function mapScenes(t) {
    const inCorr = t >= 11.4 && t < 40.2, inReg = t >= 91.4;
    const a = inCorr ? Math.min(prog(t, 11.4, 1.2), 1 - prog(t, 39.0, 1.2)) : inReg ? prog(t, 91.4, 1.0) * (1 - prog(t, 119.2, 0.8)) : 0;
    show(mapStage, a); show(mapLabels, a);
    if (a <= 0) return;
    mapCam(inCorr ? keys(KM.corridor, t) : keys(KM.region, t));
    for (const k in REV) routeReveal(k, inReg && !['burundi', 'rwanda'].includes(k) ? 1 : eio(prog(t, REV[k][0], REV[k][1] - REV[k][0])));
    // relief lift: Tanzania layer rises off the base as the camera tilts
    const lift = 10 / Math.max(0.4, keys(inCorr ? KM.corridor : KM.region, t).s);
    css(document.getElementById('reliefTz'), { transform: `translateZ(${lift.toFixed(2)}px)` });
    css(mapVec, { transform: `translateZ(${(lift + 1).toFixed(2)}px)` }); css(anchorsEl, { transform: `translateZ(${(lift + 1).toFixed(2)}px)` });
    // markers appear as the line reaches them
    const appear = inCorr ? { dar: 12.2, morogoro: 14.2, dodoma: 16.0, makutupora: 17.8, tabora: 23.0, isaka: 24.4, mwanza: 26.2, kigoma: 29.8 }
      : { dar: 0, morogoro: 0, dodoma: 0, makutupora: 0, tabora: 0, isaka: 0, mwanza: 0, kigoma: 0, uvinza: 102.0, musongati: 102.6, kigali: 104.6 };
    const zoomedIn = inCorr && t > 37.6;
    for (const k in markers) {
      const m = markers[k], at = appear[k];
      let al = at == null ? 0 : eo(prog(t, at, 0.5));
      if (zoomedIn && !['morogoro'].includes(k)) al *= 1 - prog(t, 37.6, 0.8);
      if (k === 'morogoro') al *= clamp((keys(inCorr ? KM.corridor : KM.region, t).s - 0.62) / 0.2);   // only when zoomed in
      if (inCorr && t < 22 && ['makutupora', 'morogoro'].includes(k)) al *= 1;
      if (inReg && t > 93 && t < 99 && k !== 'dar') al *= 0.35 + 0.65 * prog(t, 98.5, 0.8);
      placeAt(m.m, sta[k].a, al); placeAt(m.l, sta[k].a, al);
    }
    for (const k in ctx) placeAt(ctx[k].e, ctx[k].a, (inCorr ? clamp(prog(t, 18, 1.5)) * (1 - prog(t, 36.8, 1)) : 1) * 0.95);
    // corridor UI
    show(mapKicker, inCorr ? win(t, 13.6, 38.6, 0.8, 0.8) : 0);
    show(cards.operating, inCorr ? win(t, 13.8, 18.6) : 0);
    show(cards.built, inCorr ? win(t, 18.2, 21.8) : 0);
    show(cards.construction, inCorr ? win(t, 22.0, 27.8) : 0);
    show(cards.kigoma, inCorr ? win(t, 28.4, 33.6) : 0);
    const cA = inCorr ? win(t, 23.4, 33.6) : 0; show(corridor, cA);
    corN.textContent = fmt(D.corridor.value * eo(prog(t, 23.6, 2.2)));
    legend.set(inCorr ? win(t, 16.4, 38.0) : inReg ? win(t, 99.6, 107.8) + (t > 109 ? win(t, 110.5, 114.4) : 0) : 0);
    show(scrim, inReg ? eo(prog(t, 109.4, 1.2)) * (1 - prog(t, 119.2, 0.8)) : 0);
    mapNote.set(t, inCorr ? 18 : 99.6, inCorr ? 38 : 108);
    // region UI: the Dar es Salaam marker expands into the port panel
    show(tRegion, inReg ? win(t, 92.4, 107.8) : 0);
    const pp = inReg ? win(t, 94.0, 99.2, 0.8, 0.6) : 0;
    if (pp > 0) {
      const [sx, sy] = screenOf(sta.dar.a), g = eo(prog(t, 94.0, 0.9));
      css(portPanel, { left: (sx - 380).toFixed(1) + 'px', top: (sy - 260).toFixed(1) + 'px', transformOrigin: '100% 100%', transform: `scale(${(0.15 + 0.85 * g).toFixed(3)})` });
    }
    show(portPanel, pp);
    show(linkCards[0], inReg ? win(t, 102.0, 107.8) : 0);
    show(linkCards[1], inReg ? win(t, 104.4, 107.8) : 0);
    regionNote.set(t, 101.8, 108);
    // close
    closeLines.forEach((e, i) => { const p = eo(prog(t, 110.0 + i * 1.6, 0.9)); show(e, p * (1 - prog(t, 119.2, 0.8)), { transform: `translateY(${((1 - p) * 12).toFixed(1)}px)` }); });
    show(closeSrc, eo(prog(t, 114.6, 1)) * (1 - prog(t, 119.2, 0.8)));
  }

  // ── 3 · Engineering (39–68): layers, power and train, fleet, gauge ───────────────────────────────────
  function engineering(t) {
    const a = Math.min(prog(t, 38.8, 1.2), 1 - prog(t, 67.6, 0.8));
    show(gEng, a);
    if (a <= 0) { [tTrack, tPower, tFleet, tGauge].forEach((s) => s.set(t, 1e9, 1e9 + 1)); return; }
    let cam, S = Solid(), wireArgs = null;
    const phase = t < 47 ? 'layers' : t < 56 ? 'power' : t < 62 ? 'fleet' : 'gauge';
    if (phase === 'layers') {
      // the route line resolves into a short section of track seen from above, which orbits into a 3/4 view while
      // the layers separate (exploded view) and settle back
      const o = eio(prog(t, 39.0, 3.0));
      cam = { yaw: lerp(Math.PI / 2, 0.62, o), pitch: lerp(1.45, 0.42, o), dist: 12, fov: lerp(1600, 1150, o), cx: 640, cy: 410, target: [0, 0, -0.25] };
      const ex = eio(prog(t, 41.4, 1.4)) * (1 - eio(prog(t, 45.4, 1.2)));
      const layers = [['formation', -0.9], ['ballast', -0.45], ['sleepers', 0], ['fastenings', 0.45], ['rails', 0.9]];
      for (const [k, dz] of layers) {
        const L = Solid(); CP.track(L, { x0: -3, x1: 3, only: [k] });
        L.faces.forEach((f) => { f.pts = f.pts.map(([x, y, z]) => [x, y, z + dz * ex * 1.1]); S.faces.push(f); });
      }
      const P = projector(cam); draw(engSolid, P, S.faces); while (engWires.firstChild) engWires.removeChild(engWires.firstChild);
      // callouts to each layer (right-hand column)
      const pts = [[2.4, 0.76, 0.18], [2.1, 0.86, 0.04], [2.1, 1.25, -0.1], [2.4, 1.9, -0.3], [2.4, 3.6, -0.75]];
      const zoff = [0.9, 0.45, 0, -0.45, -0.9];
      layerCallouts.forEach((c, i) => {
        const [x, y, z] = pts[i], q = P.p([x, y, z + zoff[i] * ex * 1.1]);
        c.move(q[0], q[1], 930, 190 + i * 64);
        c.set(prog(t, 42.0 + i * 0.35, 1.0), 1 - prog(t, 46.0, 0.7));
      });
      tTrack.set(t, 39.6, 46.8); trackNote.set(t, 40, 46.8);
    } else { layerCallouts.forEach((c) => c.set(0, 0)); tTrack.set(t, 1e9, 1e9 + 1); trackNote.set(t, 1e9, 1e9 + 1); }

    if (phase === 'power') {
      // a longer stretch: two masts and their wires; a train slides in under the wire
      const o = eio(prog(t, 47.0, 2.4));
      cam = { yaw: lerp(0.62, 0.95, o), pitch: lerp(0.42, 0.2, o), dist: lerp(12, 46, o), fov: 1000, cx: 600, cy: lerp(410, 470, o), target: [lerp(0, 18, o), 0, lerp(-0.25, 3.0, o)] };
      const P = projector(cam);
      CP.track(S, { x0: -30, x1: 70, fastenings: false });
      CP.mast(S, -5, { side: 1 }); CP.mast(S, 50, { side: 1 });
      const xn = lerp(95, 34, eio(prog(t, 49.6, 4.6)));               // the nose glides in from the right and stops
      CP.train(S, xn, RAIL_TOP, { cars: 3, nearSide: -1 });
      draw(engSolid, P, S.faces, { sw: 0.4, stroke: 'rgba(0,0,0,0.18)' });
      CP.wires(engWires, P, -5, 105, 55, { color: '#bdb6aa', sw: 1.3, pulse: (t * 0.35) % 1 });
      // pantograph (drawn as projected lines from the roof to the contact wire on the second car)
      const px = xn - 25.2 - 0.9 - 12;
      const pa = P.p([px - 0.9, 0, RAIL_TOP + 3.95]), pb = P.p([px + 0.6, 0, RAIL_TOP + 4.85]), pc = P.p([px - 0.1, 0, RAIL_TOP + 5.6]);
      svg('path', { d: `M${pa[0]},${pa[1]}L${pb[0]},${pb[1]}L${pc[0]},${pc[1]}`, stroke: '#9a9da2', 'stroke-width': 2.2, fill: 'none' }, engWires);
      const q = P.p([20, 0, 5.6]); powerCall.move(q[0], q[1], 470, 180); powerCall.set(prog(t, 48.4, 1.0), 1 - prog(t, 55.4, 0.6));
      pantoCall.move(pc[0], pc[1], Math.min(1180, pc[0] + 120), 240); pantoCall.set(prog(t, 53.0, 1.0), 1 - prog(t, 55.4, 0.6));
      tPower.set(t, 47.4, 55.8);
      show(speedPanel, win(t, 51.2, 55.8)); powerNote.set(t, 48.4, 55.8);
    } else { powerCall.set(0, 0); pantoCall.set(0, 0); tPower.set(t, 1e9, 1e9 + 1); show(speedPanel, 0); powerNote.set(t, 1e9, 1e9 + 1); }

    if (phase === 'fleet') {
      // pull back to a full eight-car unit in side elevation (a little above), slowly passing
      const o = eio(prog(t, 56.0, 1.8));
      cam = { yaw: lerp(0.95, Math.PI / 2 - 0.1, o), pitch: lerp(0.2, 0.1, o), dist: lerp(46, 150, o), fov: 1000, cx: 640, cy: 560, target: [lerp(18, -64, o), 0, 2.0] };
      const P = projector(cam);
      const xn = 34 + (t - 56) * 3;
      CP.track(S, { x0: -230, x1: 60, fastenings: false, pitch: 0.6 });
      CP.train(S, xn, RAIL_TOP, { cars: 8, nearSide: -1 });
      draw(engSolid, P, S.faces, { sw: 0.3, stroke: 'rgba(0,0,0,0.12)' });
      while (engWires.firstChild) engWires.removeChild(engWires.firstChild);
      tFleet.set(t, 56.4, 61.8);
      [D.fleet.emu, D.fleet.loco, D.fleet.coach].forEach((f, i) => {
        const p = prog(t, 57.0 + i * 0.4, 1.2);
        fleetEls[i].firstChild.textContent = Math.round(f.value * eo(p));
        show(fleetEls[i], win(t, 57.0 + i * 0.4, 61.8));
      });
      show(fleetTag, win(t, 58.6, 61.8)); fleetNote.set(t, 57, 61.8);
    } else { tFleet.set(t, 1e9, 1e9 + 1); fleetEls.forEach((e) => show(e, 0)); show(fleetTag, 0); fleetNote.set(t, 1e9, 1e9 + 1); }

    if (phase === 'gauge') {
      // end-on view down the track; the rails slide from metre gauge out to standard gauge
      const o = eio(prog(t, 62.0, 1.6));
      cam = { yaw: lerp(Math.PI / 2 - 0.25, 0.0, o), pitch: lerp(0.35, 0.16, o), dist: lerp(16, 5.2, o), fov: 1300, cx: 640, cy: 470, target: [lerp(1.5, 0, o), 0, lerp(0.3, 0.05, o)] };   // starts on a close 3/4 view of the track, swings end-on
      const P = projector(cam);
      const g = lerp(1.0, 1.435, eio(prog(t, 63.6, 1.6)));
      const tr = CP.track(S, { x0: -1.2, x1: 6, gauge: g, fastenings: false });
      if (t < 64.6) { const ghost = Solid(); CP.track(ghost, { x0: -1.2, x1: 6, gauge: 1.0, only: ['rails'] }); } // (ghost drawn as outline below)
      draw(engSolid, P, S.faces);
      while (engWires.firstChild) engWires.removeChild(engWires.firstChild);
      // metre-gauge ghost: dashed outlines where the rails were
      if (prog(t, 63.8, 0.4) > 0) {
        for (const s of [-1, 1]) {
          const y = s * (1.0 / 2 + 0.036), q1 = P.p([-1.2, y - 0.036, RAIL_TOP]), q2 = P.p([-1.2, y + 0.036, RAIL_TOP]), q3 = P.p([-1.2, y, 0.01]);
          svg('path', { d: `M${q1[0]},${q1[1]}L${q2[0]},${q2[1]}L${q3[0]},${q3[1]}Z`, fill: 'none', stroke: Cc.grey, 'stroke-dasharray': '4 3', 'stroke-width': 1.5, opacity: clamp(prog(t, 63.8, 0.4)) * (1 - prog(t, 67.0, 0.6)) }, engWires);
        }
      }
      // the dimension line, measured between the inner faces of the rail heads
      const L = P.p([-1.2, -g / 2, tr.railTop + 0.25]), R = P.p([-1.2, g / 2, tr.railTop + 0.25]);
      placeGaugeLine(t, L, R, g);
      tGauge.set(t, 62.4, 67.6); gaugeNote.set(t, 63, 67.6);
    } else { tGauge.set(t, 1e9, 1e9 + 1); gaugeNote.set(t, 1e9, 1e9 + 1); }
  }

  /** the gauge dimension line: during 66.8–68.6 it slides and stretches into the time axis of the first chart */
  function placeGaugeLine(t, L, R, g) {
    const k = eio(prog(t, 66.6, 1.8));
    const axY = 290 + 2 * 110 - 10, ax0 = 64 + 270, ax1 = 64 + 1020;
    const x1 = lerp(L[0], ax0, k), x2 = lerp(R[0], ax1, k), y = lerp(L[1], axY, k);
    gl.line.setAttribute('x1', x1); gl.line.setAttribute('x2', x2); gl.line.setAttribute('y1', y); gl.line.setAttribute('y2', y);
    gl.t1.setAttribute('x1', x1); gl.t1.setAttribute('x2', x1); gl.t1.setAttribute('y1', y - 12 * (1 - k)); gl.t1.setAttribute('y2', y + 12 * (1 - k));
    gl.t2.setAttribute('x1', x2); gl.t2.setAttribute('x2', x2); gl.t2.setAttribute('y1', y - 12 * (1 - k)); gl.t2.setAttribute('y2', y + 12 * (1 - k));
    gl.label.setAttribute('x', (x1 + x2) / 2); gl.label.setAttribute('y', y - 24); gl.label.textContent = fmt(g * 1000) + ' mm';
    gl.sub.setAttribute('x', (x1 + x2) / 2); gl.sub.setAttribute('y', y - 70);
    gl.sub.textContent = g < 1.2 ? T.gauge.metreLabel : T.gauge.sgrLabel;
    gl.label.setAttribute('fill', g > 1.2 ? Cc.orange : Cc.white);
    const la = 1 - prog(t, 66.4, 0.5);
    gl.label.setAttribute('opacity', la); gl.sub.setAttribute('opacity', la);
    show(gaugeLine, Math.min(prog(t, 63.0, 0.5), 1 - prog(t, 68.4, 0.4)));
  }

  // ── 4 · Data (68–92) ──────────────────────────────────────────────────────────────────────────────────
  function data(t) {
    show(gData, t > 67.8 && t < 92.0 ? 1 - prog(t, 91.3, 0.6) : 0);
    const aJ = win(t, 68.0, 76.2, 0.4, 0.6);
    tJourney.set(t, 67.8, 76.2);
    chartJ.set(t, [68.6, 70.0], aJ);
    show(whyJ, win(t, 71.4, 76.2)); noteJ.set(t, 69, 76.2);
    tPass.set(t, 76.2, 84.2);
    passBig.set(D.passengers.total.value, prog(t, 76.8, 1.6), win(t, 76.6, 84.2));
    show(passTxt, win(t, 77.4, 84.2));
    chartP.set(t, [78.6, 79.6], win(t, 78.2, 84.2));
    show(whyP, win(t, 81.0, 84.2)); noteP.set(t, 77, 84.2);
    tFreight.set(t, 84.2, 91.9);
    chartF.set(t, [85.2, 86.6], win(t, 84.8, 91.9));
    show(whyF, win(t, 88.4, 91.9)); noteF.set(t, 85, 91.9);
  }

  // ═════════════════════════════════════════════════════════════════════════════════════════════════════
  window.renderFrame = (t) => {
    // every frame is fully determined by t: reset all UI blocks and transient lines, then let the scenes show theirs
    for (const e of ui.children) show(e, 0);
    show(gaugeLine, 0); mergeLine.setAttribute('opacity', 0); mergeGlow.setAttribute('opacity', 0);
    titleOpen.set(t, 1.2, 9.2);
    opening(t);
    mapScenes(t);
    merge(t);
    engineering(t);
    data(t);
    css(grainEl, { backgroundImage: grainTiles[Math.floor(t * 30) % 3] });
    const fade = Math.min(prog(t, 0, 1.0), 1 - prog(t, 119.2, 0.8));
    css(stage, { filter: fade < 1 ? `brightness(${fade.toFixed(3)})` : 'none' });
  };
  window.FILM = { W, H, DUR: 120, FPS: 30 };
  await Promise.all([...document.images].map((im) => im.decode().catch(() => {})));
  await document.fonts.ready;
  window.renderFrame(0);
  window.READY = true;
  if (location.search.includes('t=')) window.renderFrame(parseFloat(new URLSearchParams(location.search).get('t')));
})();
