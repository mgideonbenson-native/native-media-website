// Tanzania outline (Natural Earth 1:50m via world-atlas) as lon/lat rings, for rasterising the relief mask.
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../../../package.json', import.meta.url));
const topo = require('world-atlas/countries-50m.json');
const { feature } = require('topojson-client');
const tz = feature(topo, topo.objects.countries).features.find((f) => f.id === '834');
const polys = tz.geometry.type === 'Polygon' ? [tz.geometry.coordinates] : tz.geometry.coordinates;
fs.writeFileSync(new URL('./tz_rings.json', import.meta.url), JSON.stringify(polys.map((p) => p[0])));
console.log(polys.length, 'rings');
