"""
POC shot 2 (frames 1–120, 4 s): the 3D terrain model of Tanzania, built from a real DEM (AWS Terrain Tiles:
SRTM/GMTED/ETOPO1). The camera picks up top-down over the railway where shot 1 left it, rises and settles into an
oblique north-up view while the SGR (OSM alignment) traces across the country.

1 Blender unit = 1 km. Vertical exaggeration EXAG (stated on screen). Writes out/shot2/labels.json with the screen
position of each station for every frame, for the editorial overlay.

    python shot2_terrain.py -- --still 1,60,120 --pct 50
    python shot2_terrain.py -- --frames 1-120
"""
import json, math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import bpy, bmesh
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view
import lib
from lib import srgb

D = os.path.join(lib.HERE, 'data')
EXAG = 6.0
LON0, LAT0 = 35.0, -6.3
KX, KY = 111.32 * math.cos(math.radians(LAT0)), 110.57
P = lambda lon, lat: ((lon - LON0) * KX, (lat - LAT0) * KY)

sc = lib.reset()
lib.setup_render(sc, samples=24, motion_blur=True)
sc.frame_start, sc.frame_end = 1, 120
lib.sky(sc, sun_elev_deg=24.0, sun_rot_deg=300.0, sun_strength=4.0, strength=0.7)
sc.cycles.use_fast_gi = False  # large open scene: plain path tracing is cheap here
sc.world.light_settings.distance = 200.0

# ── DEM → mesh ───────────────────────────────────────────────────────────────────────────────────────
dem = np.load(os.path.join(D, 'dem_country.npz'))
H = dem['h'][::2, ::2].astype(np.float64)
W_, E_, N_, S_ = (float(dem[k]) for k in ('west', 'east', 'north', 'south'))
rows, cols = H.shape
merc = lambda lat: math.asinh(math.tan(math.radians(lat)))
mN, mS = merc(N_), merc(S_)
lats = np.degrees(np.arctan(np.sinh(mN - (np.arange(rows) + 0.5) / rows * (mN - mS))))
lons = W_ + (np.arange(cols) + 0.5) / cols * (E_ - W_)
LON, LAT = np.meshgrid(lons, lats)
X, Y = (LON - LON0) * KX, (LAT - LAT0) * KY
Z = np.where(H > 0, H / 1000.0 * EXAG, np.maximum(H, -200) / 1000.0 * 0.5 - 0.05)


def elev_at(lon, lat):
    """Bilinear DEM sample (metres) at lon/lat."""
    fx = (lon - W_) / (E_ - W_) * cols - 0.5
    fy = (mN - merc(lat)) / (mN - mS) * rows - 0.5
    x0, y0 = int(np.clip(math.floor(fx), 0, cols - 2)), int(np.clip(math.floor(fy), 0, rows - 2))
    tx, ty = fx - x0, fy - y0
    h = H[y0:y0 + 2, x0:x0 + 2]
    return float((h[0, 0] * (1 - tx) + h[0, 1] * tx) * (1 - ty) + (h[1, 0] * (1 - tx) + h[1, 1] * tx) * ty)


def make_grid_mesh(name, X, Y, Z, attrs):
    r, c = X.shape
    me = bpy.data.meshes.new(name)
    me.vertices.add(r * c)
    me.vertices.foreach_set('co', np.stack([X, Y, Z], -1).astype(np.float32).ravel())
    ii = np.arange(r * c).reshape(r, c)
    q = np.stack([ii[:-1, :-1], ii[1:, :-1], ii[1:, 1:], ii[:-1, 1:]], -1).reshape(-1, 4)
    me.loops.add(q.size); me.loops.foreach_set('vertex_index', q.ravel().astype(np.int32))
    me.polygons.add(len(q)); me.polygons.foreach_set('loop_start', (np.arange(len(q)) * 4).astype(np.int32))
    me.update(); me.validate()
    for k, v in attrs.items():
        a = me.attributes.new(k, 'FLOAT', 'POINT'); a.data.foreach_set('value', v.astype(np.float32).ravel())
    me.polygons.foreach_set('use_smooth', np.ones(len(q), dtype=bool))
    o = bpy.data.objects.new(name, me); lib.link(o)
    return o


# terrain material: natural colours by elevation, with slope → bare rock, plus small-scale variation
m, n, out = lib.new_mat('Terrain')
attr = n.new('ShaderNodeAttribute'); attr.attribute_name = 'elev'
e = attr.outputs['Fac']
geo = n.new('ShaderNodeNewGeometry')
nz = n.new('ShaderNodeSeparateXYZ', Vector=geo.outputs['Normal']).outputs['Z']
e01 = n.math('DIVIDE', e, 6000.0)
var = n.new('ShaderNodeTexNoise', Scale=0.035, Detail=4.0, Roughness=0.6, Vector=geo.outputs['Position'])
fine = n.new('ShaderNodeTexNoise', Scale=1.2, Detail=4.0, Vector=geo.outputs['Position'])
col = n.ramp(n.math('ADD', e01, n.math('MULTIPLY', n.math('SUBTRACT', var.outputs['Fac'], 0.5), 0.05)), [
    (0.0, srgb('#55673a')), (0.05, srgb('#6a6c3c')), (0.13, srgb('#8f7a4e')), (0.2, srgb('#9a8053')),
    (0.25, srgb('#77703f')), (0.33, srgb('#46582e')), (0.5, srgb('#505a34')), (0.7, srgb('#7a7268')),
    (0.9, srgb('#8e8880')), (0.95, srgb('#e4e4e0'))])
# woodland / grassland mosaic at the 10–50 km scale (representational, not mapped land cover)
mosaic = n.new('ShaderNodeTexNoise', Scale=0.012, Detail=4.0, Roughness=0.55, Vector=geo.outputs['Position'])
wood = n.math('MULTIPLY', n.math('SUBTRACT', mosaic.outputs['Fac'], 0.52, clamp=False), 3.0, clamp=True)
col = n.mix(n.math('MULTIPLY', wood, 0.55), col, srgb('#3f4d2a'))
patch = n.new('ShaderNodeTexVoronoi', Scale=0.25, Vector=geo.outputs['Position'])
col = n.mix(n.math('MULTIPLY', patch.outputs['Distance'], 0.25), col, srgb('#a08a62'))
col = n.mix(n.math('MULTIPLY', fine.outputs['Fac'], 0.35), col, srgb('#7a5a3a'), 'OVERLAY')
rock = n.math('SUBTRACT', 1.0, n.math('MULTIPLY', n.math('SUBTRACT', nz, 0.8), 5.0), clamp=True)
col = n.mix(rock, col, srgb('#6e6258'))
b = n.new('ShaderNodeBsdfPrincipled', Roughness=0.95); n.link(col, b.inputs['Base Color'])
bump = n.new('ShaderNodeBump', Strength=0.25, Distance=0.05, Height=fine.outputs['Fac']); n.link(bump.outputs[0], b.inputs['Normal'])
n.link(lib.haze(n, b.outputs[0], '#cfd3d6', 4200.0), out.inputs[0])
terrain = make_grid_mesh('Terrain', X, Y, Z, {'elev': np.maximum(H, 0)})
terrain.data.materials.append(m)

# sea and lakes (lake surfaces at their DEM-derived water level)
water = lib.new_mat('Water')
wm, wn, wo = water
wb = wn.new('ShaderNodeBsdfPrincipled', Roughness=0.08, IOR=1.33)
wb.inputs['Base Color'].default_value = srgb('#16323a')
wn.link(lib.haze(wn, wb.outputs[0], '#c8cfd6', 2600.0), wo.inputs[0])
bm = bmesh.new(); bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=1.0)
bmesh.ops.scale(bm, vec=(6000, 6000, 1), verts=bm.verts); bmesh.ops.translate(bm, vec=(0, 0, 0.0), verts=bm.verts)
lib.mesh_obj('Sea', bm, mat=wm)
for poly in json.load(open(os.path.join(D, 'lakes.json'))):
    rings = poly['coordinates'] if poly['type'] == 'Polygon' else [r for p in poly['coordinates'] for r in p]
    outer = rings[0]
    from shapely.geometry import Polygon as _Poly
    pg = _Poly(outer); minx, miny, maxx, maxy = pg.bounds
    import random as _r; R = _r.Random(1); samples = []
    while len(samples) < 60:
        lon, lat = R.uniform(minx, maxx), R.uniform(miny, maxy)
        if pg.contains(__import__('shapely').geometry.Point(lon, lat)): samples.append(elev_at(lon, lat))
    level = sorted(samples)[len(samples) // 2] + 3.0  # DEM water surfaces are flat: the interior median is the level
    bm = bmesh.new()
    vs = [bm.verts.new((*P(lon, lat), level / 1000.0 * EXAG + 0.03)) for lon, lat in outer[:-1]]
    try:
        f = bm.faces.new(vs); bmesh.ops.triangulate(bm, faces=[f], quad_method='BEAUTY', ngon_method='EAR_CLIP')
    except ValueError:
        bm.free(); continue
    lib.mesh_obj('Lake', bm, mat=wm)


# ── Draped lines: borders (cream, faint) and the SGR route (orange) ───────────────────────────────────
def drape(coords, step_km=2.0, lift=0.25):
    pts = []
    for (a, b) in zip(coords, coords[1:]):
        (xa, ya), (xb, yb) = P(*a), P(*b)
        k = max(1, int(math.hypot(xb - xa, yb - ya) / step_km))
        for i in range(k):
            t = i / k; lon, lat = a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t
            pts.append((*P(lon, lat), max(0.0, elev_at(lon, lat)) / 1000.0 * EXAG + lift))
    lon, lat = coords[-1]; pts.append((*P(lon, lat), max(0.0, elev_at(lon, lat)) / 1000.0 * EXAG + lift))
    zs = np.array([p[2] for p in pts]); k = 9  # moving maximum then mean: rides over the relief instead of sawing through it
    zmax = np.array([zs[max(0, i - k):i + k + 1].max() for i in range(len(zs))])
    zs = np.convolve(np.pad(zmax, k, mode='edge'), np.ones(2 * k + 1) / (2 * k + 1), mode='valid')
    return [(p[0], p[1], float(z)) for p, z in zip(pts, zs)]


def curve(name, pts, mat, radius=0.5):
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = radius; cu.bevel_resolution = 2
    cu.use_fill_caps = True
    sp = cu.splines.new('POLY'); sp.points.add(len(pts) - 1)
    for p, c in zip(sp.points, pts): p.co = (*c, 1)
    o = bpy.data.objects.new(name, cu); cu.materials.append(mat); lib.link(o)
    o.visible_shadow = False
    return o


def emit_mat(name, hexcol, strength, base_mix=0.6):
    mm, nn, oo = lib.new_mat(name)
    bb = nn.new('ShaderNodeBsdfPrincipled', Roughness=0.5); bb.inputs['Base Color'].default_value = srgb(hexcol)
    bb.inputs['Emission Color'].default_value = srgb(hexcol); bb.inputs['Emission Strength'].default_value = strength
    nn.link(bb.outputs[0], oo.inputs[0])
    return mm


border_mat = emit_mat('Border', '#efe7d6', 0.25)
borders = [curve('Border', drape([c for c in line if 27.5 < c[0] < 43 and -15 < c[1] < 2], 4.0, 0.3), border_mat, 0.25)
           for line in json.load(open(os.path.join(D, 'borders.json')))
           if sum(1 for c in line if 27.5 < c[0] < 43 and -15 < c[1] < 2) > 2]

route = json.load(open(os.path.join(D, 'sgr_route.json')))
built_mat = emit_mat('RouteBuilt', '#E8752A', 2.5)
cons_mat = emit_mat('RouteConstruction', '#E8752A', 1.2)
routes = {}
for key in ('lot1', 'lot2', 'lot34', 'lot5', 'lot6'):
    r = route[key]
    coords = r['coords']
    if key == 'lot1':
        coords = coords[::-1] if coords[0][0] > coords[-1][0] else coords  # draw from the west end? (set below)
    routes[key] = curve(key, drape(coords, 1.5, 0.06), built_mat if r['status'] == 'built' else cons_mat, 0.5)

# ── Camera: top-down over the line near Ngerengere, rising to an oblique north-up view of the country ──
lot1 = route['lot1']['coords']
# pick the route point nearest 38.15E (Ngerengere area) and the local heading towards Dodoma (westwards)
i0 = min(range(len(lot1)), key=lambda i: abs(lot1[i][0] - 38.15))
a, b = lot1[i0], lot1[min(i0 + 3, len(lot1) - 1)] if lot1[i0 + 3][0] < lot1[i0][0] else lot1[max(i0 - 3, 0)]
pa, pb = P(*a), P(*b)
heading = math.atan2(pb[1] - pa[1], pb[0] - pa[0])
z0 = max(0.0, elev_at(*a)) / 1000.0 * EXAG
cam = lib.camera(sc, lens=35, clip=(0.05, 20000))
F = [1, 30, 70, 120]
locs = [(pa[0], pa[1], z0 + 45.0), (pa[0] - 12, pa[1] - 4, z0 + 210.0), (5.0, -690.0, 1150.0), (0.0, -712.0, 1180.0)]
rz0 = heading - math.pi / 2
rz0 = (rz0 + math.pi) % (2 * math.pi) - math.pi
rots = [(0.0, 0.0, rz0), (0.05, 0.0, rz0 * 0.7), (math.radians(31), 0.0, 0.0), (math.radians(32), 0.0, math.radians(-1.5))]
lib.key_path(cam, F, 'location', locs)
lib.key_path(cam, F, 'rotation_euler', rots)

# route reveal: lot1 is already visible under the camera at the start, the rest traces out as the camera rises
def reveal(o, f0, f1, start_full=False):
    cu = o.data
    if start_full:
        cu.bevel_factor_end = 1.0; return
    cu.bevel_factor_start = 0.0
    cu.bevel_factor_end = 0.0; cu.keyframe_insert('bevel_factor_end', frame=f0)
    cu.bevel_factor_end = 1.0; cu.keyframe_insert('bevel_factor_end', frame=f1)
reveal(routes['lot1'], 1, 1, True)
reveal(routes['lot2'], 14, 46)
reveal(routes['lot34'], 34, 72)
reveal(routes['lot5'], 58, 92)
reveal(routes['lot6'], 64, 98)
for o in borders:
    o.data.bevel_factor_end = 1.0

# line widths follow the camera altitude so they keep a steady on-screen weight
def alt_at(f):
    sc.frame_set(f); return max(1.0, cam.matrix_world.translation.z)
for f in range(1, 121, 3):
    h = alt_at(f)
    for o in routes.values():
        o.data.bevel_depth = 0.0019 * h * (1.0 if o.data.materials[0].name == 'RouteBuilt' else 0.7)
        o.data.keyframe_insert('bevel_depth', frame=f)
    for o in borders:
        o.data.bevel_depth = 0.00045 * h; o.data.keyframe_insert('bevel_depth', frame=f)

# station positions on screen per frame (for the composited labels)
stations = {'Dar es Salaam': (39.279, -6.822), 'Morogoro': (37.66, -6.822), 'Dodoma': (35.746, -6.173),
            'Tabora': (32.80, -5.02), 'Isaka': (32.92, -3.90), 'Mwanza': (32.90, -2.52)}
labels = {}
for f in range(1, 121):
    sc.frame_set(f)
    row = {}
    for name, (lon, lat) in stations.items():
        x, y = P(lon, lat); z = max(0.0, elev_at(lon, lat)) / 1000.0 * EXAG + 0.4
        v = world_to_camera_view(sc, cam, Vector((x, y, z)))
        row[name] = [round(v.x, 5), round(1 - v.y, 5), round(v.z, 2)]
    labels[f] = row
os.makedirs(os.path.join(lib.HERE, 'out', 'shot2'), exist_ok=True)
json.dump({'exag': EXAG, 'frames': labels}, open(os.path.join(lib.HERE, 'out', 'shot2', 'labels.json'), 'w'))

lib.cli_render(sc, os.path.join(lib.HERE, 'out', 'shot2'), '1-120')
