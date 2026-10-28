// Vector layers for the v2 map, projected into the relief image's pixel space (Web Mercator, same bounds as the DEM).
// Inputs: Natural Earth (world-atlas 1:50m), ../sgr3d/data/{sgr_route,lakes}.json (OSM route, NE lakes).
// Output: assets/vectors.json  — run after build_relief.py has written assets/relief_meta.json.
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../../../package.json', import.meta.url));
const topo = require('world-atlas/countries-50m.json');
const { feature, mesh } = require('topojson-client');
const here = (p) => new URL(p, import.meta.url);
const meta = JSON.parse(fs.readFileSync(here('../assets/relief_meta.json')));
const merc = (lat) => Math.asinh(Math.tan((lat * Math.PI) / 180));
const mN = merc(meta.north), mS = merc(meta.south);
const P = ([lon, lat]) => [+(((lon - meta.west) / (meta.east - meta.west)) * meta.width).toFixed(1), +(((mN - merc(lat)) / (mN - mS)) * meta.height).toFixed(1)];
const path = (ring) => 'M' + ring.map(P).map((p) => p.join(',')).join('L');

const countries = feature(topo, topo.objects.countries).features;
const tz = countries.find((f) => f.id === '834');
const tzRings = tz.geometry.type === 'Polygon' ? [tz.geometry.coordinates] : tz.geometry.coordinates;
const borders = mesh(topo, topo.objects.countries, (a, b) => a !== b).coordinates
  .filter((l) => l.some(([x, y]) => x > 27.5 && x < 43 && y > -15 && y < 2)).map((l) => path(l));
const route = JSON.parse(fs.readFileSync(here('../../sgr3d/data/sgr_route.json')));
const lakes = JSON.parse(fs.readFileSync(here('../../sgr3d/data/lakes.json')));

// Stations: city/station locations (lon, lat), snapped to the nearest point of the OSM alignment
const all = Object.values(route).flatMap((r) => r.coords);
const snap = (ll) => all.reduce((b, c) => (Math.hypot(c[0] - ll[0], c[1] - ll[1]) < Math.hypot(b[0] - ll[0], b[1] - ll[1]) ? c : b));
const stations = {
  dar: { name: 'Dar es Salaam', ll: [39.279, -6.822] }, morogoro: { name: 'Morogoro', ll: [37.66, -6.822] },
  dodoma: { name: 'Dodoma', ll: [35.746, -6.173] }, tabora: { name: 'Tabora', ll: [32.8, -5.02] },
  isaka: { name: 'Isaka', ll: [32.92, -3.9] }, mwanza: { name: 'Mwanza', ll: [32.9, -2.52] },
};
for (const s of Object.values(stations)) s.p = P(snap(s.ll));
// end of Lot 2 as mapped in OSM ("Morogoro – Makutupora SGR")
const l2 = route.lot2.coords; const l2end = l2[0][0] < l2[l2.length - 1][0] ? l2[0] : l2[l2.length - 1];
stations.makutupora = { name: 'Makutupora', ll: l2end, p: P(l2end) };
// Kigoma: the town (the OSM-mapped Tabora–Kigoma alignment currently ends near 30.7°E)
const towns = { kigoma: { name: 'Kigoma', ll: [29.63, -4.88] }, uvinza: { name: 'Uvinza', ll: [30.39, -5.1] },
  musongati: { name: 'Musongati', ll: [30.05, -3.74] }, kigali: { name: 'Kigali', ll: [30.06, -1.95] }, rusumo: { name: 'Rusumo', ll: [30.78, -2.38] } };
for (const s of Object.values(towns)) s.p = P(s.ll);

// The operating passenger section ends at Dodoma: split Lot 2 there (Dar es Salaam → Dodoma operating; Dodoma → Makutupora built)
const lot2 = (l2[0][0] > l2[l2.length - 1][0] ? l2 : [...l2].reverse()); // east → west
const iD = lot2.reduce((bi, c, i) => (Math.hypot(c[0] - 35.746, c[1] + 6.173) < Math.hypot(lot2[bi][0] - 35.746, lot2[bi][1] + 6.173) ? i : bi), 0);
const lot1 = route.lot1.coords; const lot1ew = lot1[0][0] > lot1[lot1.length - 1][0] ? lot1 : [...lot1].reverse(); // Dar (east) → Morogoro (west)
const orient = (c, from) => (Math.hypot(c[0][0] - from[0], c[0][1] - from[1]) < Math.hypot(c[c.length - 1][0] - from[0], c[c.length - 1][1] - from[1]) ? c : [...c].reverse());
const sections = [
  { key: 'operating', status: 'operating', label: 'Dar es Salaam – Dodoma', d: path([...lot1ew, ...lot2.slice(0, iD + 1)]) },
  { key: 'built', status: 'built', label: 'Dodoma – Makutupora', d: path(lot2.slice(iD)) },
  { key: 'lot34', status: 'construction', label: 'Makutupora – Tabora – Isaka', d: path(orient(route.lot34.coords, l2end)) },
  { key: 'lot5', status: 'construction', label: 'Isaka – Mwanza', d: path(orient(route.lot5.coords, stations.isaka.ll)) },
  { key: 'lot6', status: 'construction', label: 'Tabora – Kigoma (mapped to ~30.7°E)', d: path(orient(route.lot6.coords, stations.tabora.ll)) },
];
// Indicative connectors (no published alignment in OSM): straight dashed lines, labelled as indicative
const lot6 = orient(route.lot6.coords, stations.tabora.ll); const lot6end = lot6[lot6.length - 1];
const indicative = [
  { key: 'kigoma', status: 'construction-indicative', d: path([lot6end, towns.uvinza.ll, towns.kigoma.ll]) },
  { key: 'burundi', status: 'launched-indicative', d: path([towns.uvinza.ll, towns.musongati.ll]) },
  { key: 'rwanda', status: 'proposed-indicative', d: path([stations.isaka.ll, towns.rusumo.ll, towns.kigali.ll]) },
];
const labelAt = (ll) => P(ll);
const out = {
  width: meta.width, height: meta.height,
  tanzania: tzRings.map((poly) => path(poly[0])).join(''), borders,
  lakes: lakes.map((g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates).map((poly) => path(poly[0])).join('')),
  sections, indicative, stations, towns,
  labels: {
    countries: { KENYA: labelAt([38.3, -2.3]), UGANDA: labelAt([32.3, 0.6]), RWANDA: labelAt([29.75, -1.75]), BURUNDI: labelAt([29.75, -3.15]),
      'DR CONGO': labelAt([27.4, -6.6]), ZAMBIA: labelAt([30.6, -11.4]), MALAWI: labelAt([33.6, -11.9]), MOZAMBIQUE: labelAt([38.6, -12.9]), TANZANIA: labelAt([35.4, -8.9]) },
    water: { 'Indian Ocean': labelAt([40.9, -9.6]), 'Lake Victoria': labelAt([32.9, -1.25]), 'Lake Tanganyika': labelAt([29.95, -7.3]), 'Lake Nyasa': labelAt([34.62, -11.2]) },
  },
};
fs.writeFileSync(here('../assets/vectors.json'), JSON.stringify(out));
console.log('vectors.json', (JSON.stringify(out).length / 1024).toFixed(0), 'KB; stations', Object.keys(stations).join(', '));
