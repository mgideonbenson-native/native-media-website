"""
Build continuous SGR section polylines from the OSM-derived rail segments (data/rail.geojson):
group the segments OSM mappers named as SGR sections, merge them, bridge small gaps, and write data/sgr_route.json.
Status follows PRODUCTION.md: Dar es Salaam–Morogoro–Makutupora is built; the rest is under construction.
"""
import json, math, os
import shapely
from shapely.geometry import shape, LineString, mapping
from shapely.ops import linemerge

HERE = os.path.dirname(__file__)
SECTIONS = [  # (key, OSM name variants, status)
    ('lot1', ['Dar es salaam - Morogoro SGR'], 'built'),
    ('lot2', ['Morogoro - Makutopora SGR', 'Morogoro - Makutupora SGR'], 'built'),
    ('lot34', ['Makutopora - Isaka SGR', 'Makutopora - Isaka mm'], 'construction'),  # 'mm' is a naming typo in OSM for the Tabora–Isaka stretch
    ('lot5', ['Isaka - Mwanza SGR'], 'construction'),
    ('lot6', ['Tambora - Kigoma SGR'], 'construction'),
]
fc = json.load(open(os.path.join(HERE, 'data', 'rail.geojson')))['features']


def km(ls):
    c = list(ls.coords)
    return sum(math.hypot((b[0] - a[0]) * 111.32 * math.cos(math.radians(a[1])), (b[1] - a[1]) * 110.57) for a, b in zip(c, c[1:]))


def chain(lines):
    """Greedy chaining of line pieces into one polyline (bridging gaps), starting from an endpoint piece."""
    lines = [list(l.coords) for l in lines]
    ends = lambda l: (l[0], l[-1])
    dist = lambda p, q: math.hypot(p[0] - q[0], p[1] - q[1])
    # start from the piece whose start/end is farthest from all others
    def iso(i):
        l = lines[i]
        return max(min(dist(e, x) for j, o in enumerate(lines) if j != i for x in ends(o)) for e in ends(l)) if len(lines) > 1 else 0
    i0 = max(range(len(lines)), key=iso)
    path, rest, gaps = lines.pop(i0), lines, []
    if len(rest) and min(min(dist(path[0], x) for x in ends(o)) for o in rest) < min(min(dist(path[-1], x) for x in ends(o)) for o in rest):
        path = path[::-1]
    while rest:
        j, rev, d = min(((j, r, dist(path[-1], o[-1] if r else o[0])) for j, o in enumerate(rest) for r in (0, 1)), key=lambda x: x[2])
        o = rest.pop(j)
        gaps.append((d * 111, path[-1], (o[-1] if rev else o[0])))
        path += (o[::-1] if rev else o)
    return LineString(path), gaps


out = {}
for key, names, status in SECTIONS:
    segs = [shape(f['geometry']) for f in fc if f['properties']['name'] in names]
    u = shapely.union_all(segs)
    merged = linemerge(u) if u.geom_type == 'MultiLineString' else u
    parts = list(getattr(merged, 'geoms', [merged]))
    parts = [p for p in parts if km(p) > 1.0]  # drop stubs / sidings
    # drop passing loops / parallel tracks: a part that lies (almost) entirely within 300 m of a longer part
    parts.sort(key=km, reverse=True)
    keep = []
    for p in parts:
        if not any(p.difference(k.buffer(0.0027)).length < 0.1 * p.length for k in keep):
            keep.append(p)
    parts = keep
    if key == 'lot6':  # Tabora–Kigoma runs east→west: order pieces by longitude instead of greedy chaining
        # a short piece whose longitude span sits inside a longer piece's is an alternative alignment variant: drop it
        parts = [p for p in parts if not any(q is not p and q.length > p.length and q.bounds[0] <= p.bounds[0] and q.bounds[2] >= p.bounds[2] for q in parts)]
        parts = sorted((p if p.coords[0][0] > p.coords[-1][0] else LineString(p.coords[::-1]) for p in parts), key=lambda p: -p.bounds[2])
        coords, gaps = [], []
        for p in parts:
            if coords: gaps.append((math.dist(coords[-1], p.coords[0]) * 111, coords[-1], p.coords[0]))
            coords += list(p.coords)
        line = LineString(coords)
    else:
        line, gaps = chain(parts)
    line = line.simplify(0.0004)
    out[key] = {'status': status, 'names': names, 'coords': [[round(x, 5), round(y, 5)] for x, y in line.coords], 'km': round(km(line), 1)}
    print(f'{key}: {len(segs)} segs → {len(parts)} parts, {km(line):.0f} km, gaps > 2 km: {[(round(g[0], 1), [round(v, 3) for v in g[1]], [round(v, 3) for v in g[2]]) for g in gaps if g[0] > 2]}, {len(line.coords)} pts')
json.dump(out, open(os.path.join(HERE, 'data', 'sgr_route.json'), 'w'))
