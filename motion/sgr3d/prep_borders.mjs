// Country outlines (Natural Earth 1:50m via world-atlas) for the region, as lon/lat line arrays → data/borders.json
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../../package.json', import.meta.url));
const topo = require('world-atlas/countries-50m.json');
const { mesh } = require('topojson-client');
// interior borders between countries plus coastlines, clipped to the region by the consumer
const m = mesh(topo, topo.objects.countries);
const keep = m.coordinates.filter((l) => l.some(([x, y]) => x > 27.5 && x < 43 && y > -15 && y < 2));
fs.writeFileSync(new URL('./data/borders.json', import.meta.url), JSON.stringify(keep));
console.log(keep.length, 'border lines');
