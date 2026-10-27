/**
 * Builds geo.js for the SGR film: country outlines, the large lakes, the railway routes and stations,
 * projected once (Mercator) into "map pixels" so the film can draw them as Path2D and move a camera over them.
 *
 * Usage: node motion/sgr/build-geo.mjs <path to @geo-maps/earth-lakes-10m map.geo.json>
 * Sources: Natural Earth via world-atlas (countries, 1:50m) and @geo-maps/earth-lakes-10m (Natural Earth lakes, 1:10m).
 * Railway alignments are drawn through station and town locations; they are schematic at this scale, not surveyed.
 */
import fs from 'node:fs';
import { geoMercator, geoPath, geoArea } from 'd3-geo';
import { feature } from 'topojson-client';
import topo from 'world-atlas/countries-50m.json' with { type: 'json' };

const lakesFile = process.argv[2];
if (!lakesFile) throw new Error('Pass the lakes GeoJSON path (see header).');

// Map pixel space: Tanzania and its neighbours fit a 1920 x 1080 frame at camera zoom 1.
const W = 1920, H = 1080;
const proj = geoMercator().fitExtent([[460, 70], [1460, 1010]], { type: 'MultiPoint', coordinates: [[29.3, -11.8], [40.6, -0.9]] });
const path = geoPath(proj).digits(1);
const P = (ll) => proj(ll).map((v) => Math.round(v * 10) / 10);

// Countries in the region (ISO numeric → label shown in the film; null = drawn, not labelled)
const NAMES = {
  834: 'TANZANIA', 404: 'KENYA', 800: 'UGANDA', 646: 'RWANDA', 108: 'BURUNDI', 180: 'DR CONGO', 894: 'ZAMBIA',
  454: 'MALAWI', 508: 'MOZAMBIQUE', 706: null, 231: null, 728: null, 24: null, 716: null, 450: null, 174: null,
};
const all = feature(topo, topo.objects.countries).features;
const countries = all.filter((f) => f.id in NAMES || Number(f.id) in NAMES).map((f) => ({ id: f.id, name: NAMES[Number(f.id)] ?? null, d: path(f), c: path.centroid(f).map(Math.round) }));

// Lakes: keep the big East African ones (by area), clipped to the region.
const lakesSrc = JSON.parse(fs.readFileSync(lakesFile, 'utf8'));
// The file is one GeometryCollection of MultiPolygons; split it into single polygons.
const lakesAll = (lakesSrc.geometries ?? lakesSrc.features.map((f) => f.geometry)).flatMap((g) =>
  g.type === 'MultiPolygon' ? g.coordinates.map((c) => ({ type: 'Polygon', coordinates: c })) : [g]);
const inBox = (f) => { const [[x0, y0], [x1, y1]] = geoPath().bounds(f); return x1 > 27 && x0 < 42 && y1 > -15 && y0 < 2; };
const lakes = lakesAll.filter(inBox).filter((f) => geoArea(f) > 2.5e-5).map((f) => ({ d: path(f), c: path.centroid(f).map(Math.round) }));

// Stations and towns (lon, lat). Station positions are town/station locations, accurate to a few km.
const S = {
  dar: [39.279, -6.822], pugu: [39.09, -6.895], soga: [38.87, -6.84], ruvu: [38.66, -6.79], ngerengere: [38.117, -6.746],
  morogoro: [37.66, -6.822], mkata: [37.33, -6.71], kilosa: [36.99, -6.83], kidete: [36.73, -6.62], gulwe: [36.43, -6.45],
  dodoma: [35.746, -6.173], makutupora: [35.77, -5.975], manyoni: [34.84, -5.75], itigi: [34.48, -5.70], tura: [33.85, -5.52],
  tabora: [32.80, -5.02], isaka: [32.92, -3.90], shinyanga: [33.42, -3.66], mwanza: [32.90, -2.52],
  urambo: [32.04, -5.07], kaliua: [31.80, -5.06], uvinza: [30.39, -5.10], kigoma: [29.63, -4.88],
  musongati: [30.05, -3.74], rusumo: [30.78, -2.38], kigali: [30.06, -1.95],
};
// Chaikin smoothing (two passes) so the drawn alignment has no hard kinks at stations; endpoints are kept.
const smooth = (pts, n = 2) => {
  for (let k = 0; k < n; k++) {
    const o = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) { const [a, b] = [pts[i], pts[i + 1]]; o.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]); }
    o.push(pts[pts.length - 1]); pts = o;
  }
  return pts;
};
const line = (...pts) => smooth(pts.map((p) => (typeof p === 'string' ? S[p] : p))).map(P);

const routes = {
  // In passenger service since 2024 (Dar es Salaam–Morogoro June 2024, to Dodoma July 2024)
  operating: line('dar', 'pugu', 'soga', 'ruvu', 'ngerengere', 'morogoro', 'mkata', 'kilosa', 'kidete', 'gulwe', [36.0, -6.2], 'dodoma', 'makutupora'),
  // Under construction: Lots 3–5 (Makutupora–Tabora–Isaka–Mwanza)
  lot3: line('makutupora', 'manyoni', 'itigi', 'tura', 'tabora'),
  lot4: line('tabora', [32.85, -4.5], 'isaka'),
  lot5: line('isaka', 'shinyanga', [33.30, -3.20], [33.10, -2.85], 'mwanza'),
  // Under construction: Lot 6 (Tabora–Kigoma), and the Uvinza–Musongati link to Burundi
  lot6: line('tabora', 'urambo', 'kaliua', [31.1, -5.12], 'uvinza', [30.0, -5.0], 'kigoma'),
  burundi: line('uvinza', [30.55, -4.70], [30.30, -4.10], 'musongati'),
  // Proposed: Isaka–Kigali (no construction reported)
  rwanda: line('isaka', [31.9, -3.1], 'rusumo', 'kigali'),
  // The metre-gauge Central Line (completed to Kigoma in 1914), drawn along the same corridor
  central: line('dar', 'morogoro', 'kilosa', 'dodoma', 'manyoni', 'tabora', 'uvinza', 'kigoma'),
  centralNorth: line('tabora', 'isaka', 'shinyanga', 'mwanza'),
};

const stations = Object.fromEntries(Object.entries(S).map(([k, v]) => [k, P(v)]));
// Label anchors, and which lake polygons are Victoria and Tanganyika (nearest centroid)
const nearestLake = (ll) => { const [x, y] = P(ll); let bi = 0, bd = Infinity; lakes.forEach((l, i) => { const d = Math.hypot(l.c[0] - x, l.c[1] - y); if (d < bd) { bd = d; bi = i; } }); return bi; };
const labels = {
  victoria: P([33.0, -1.25]), tanganyika: P([29.85, -6.6]), nyasa: P([34.6, -11.2]), ocean: P([40.7, -10.4]),
  victoriaIdx: nearestLake([33.0, -1.0]), tanganyikaIdx: nearestLake([29.6, -6.2]),
  countries: Object.fromEntries(Object.entries({
    TANZANIA: [35.2, -8.7], KENYA: [38.6, -2.1], UGANDA: [32.4, 0.5], RWANDA: [29.6, -1.55], BURUNDI: [29.62, -3.05],
    'DR CONGO': [27.0, -7.2], ZAMBIA: [30.6, -11.0], MALAWI: [33.55, -11.6], MOZAMBIQUE: [38.6, -12.6],
  }).map(([k, v]) => [k, P(v)])),
};
const out = { W, H, countries, lakes, routes, stations, labels };
const target = new URL('./geo.js', import.meta.url);
fs.writeFileSync(target, `// Generated by build-geo.mjs. Do not edit by hand.\nwindow.GEO = ${JSON.stringify(out)};\n`);
console.log(`geo.js: ${countries.length} countries, ${lakes.length} lakes, ${(fs.statSync(target).size / 1024).toFixed(0)} KB`);
