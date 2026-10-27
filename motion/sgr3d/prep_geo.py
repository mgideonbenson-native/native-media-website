"""
Prepare vector context for the terrain model (lon/lat, simplified):
  data/lakes.json   - large lakes from Natural Earth 1:10m (via @geo-maps/earth-lakes-10m; pass its map.geo.json)
  data/borders.json - country outlines from Natural Earth 1:50m (via world-atlas, converted by prep_borders.mjs)
    python prep_geo.py path/to/earth-lakes-10m/map.geo.json
"""
import json, os, sys
import shapely
from shapely.geometry import shape, box, mapping
HERE = os.path.dirname(__file__)
src = json.load(open(sys.argv[1]))
geoms = src.get('geometries') or [f['geometry'] for f in src['features']]
region = box(28.0, -14.5, 42.5, 1.6)
polys = []
for g in geoms:
    for p in getattr(shape(g), 'geoms', [shape(g)]):
        if p.intersects(region) and p.area > 0.02:   # > ~250 km²
            polys.append(p.simplify(0.004))
json.dump([mapping(p) for p in polys], open(os.path.join(HERE, 'data', 'lakes.json'), 'w'))
print(len(polys), 'lakes', [round(p.area, 2) for p in sorted(polys, key=lambda p: -p.area)[:8]])
