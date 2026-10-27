"""
Fetch railway alignments for Tanzania and its neighbours from Overture Maps (transportation/segment, subtype rail;
geometry derived from OpenStreetMap, ODbL). Reads only the parquet row groups whose bbox overlaps the region.

    python fetch_rail.py [release]      → data/rail.geojson
"""
import json, sys, os
import pyarrow.dataset as ds
import pyarrow.fs as pafs
import pyarrow.compute as pc
import shapely

REL = sys.argv[1] if len(sys.argv) > 1 else '2026-10-21.0'
W, S, E, N = 29.0, -12.0, 40.6, -0.8
fs = pafs.S3FileSystem(anonymous=True, region='us-west-2')
d = ds.dataset(f'overturemaps-us-west-2/release/{REL}/theme=transportation/type=segment/', filesystem=fs, format='parquet')
flt = ((pc.field('bbox', 'xmax') > W) & (pc.field('bbox', 'xmin') < E) & (pc.field('bbox', 'ymax') > S) & (pc.field('bbox', 'ymin') < N)
       & (pc.field('subtype') == 'rail'))
t = d.to_table(columns=['id', 'geometry', 'class', 'names', 'rail_flags', 'subclass'], filter=flt)
feats = []
for row in t.to_pylist():
    g = shapely.from_wkb(row['geometry'])
    feats.append({'type': 'Feature', 'geometry': shapely.geometry.mapping(g),
                  'properties': {'id': row['id'], 'class': row['class'], 'name': (row['names'] or {}).get('primary'),
                                 'flags': json.dumps(row.get('rail_flags'), default=str), 'subclass': row.get('subclass')}})
out = os.path.join(os.path.dirname(__file__), 'data', 'rail.geojson')
json.dump({'type': 'FeatureCollection', 'features': feats}, open(out, 'w'))
print(len(feats), 'rail segments →', out)
