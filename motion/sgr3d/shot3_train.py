"""
POC shot 3 (frames 1–120, 4 s): the electric train crossing central Tanzanian savanna at golden hour. The camera
tracks alongside, a little slower than the train, so the nose eases forward through the frame. Dry-season grass,
umbrella thorns, leafless baobabs and granite kopjes (boulder outcrops typical of the Dodoma region).

Writes out/shot3/anchor.json: the nose position on screen per frame, for the composited annotation.

    python shot3_train.py -- --still 1,60,120 --pct 50
    python shot3_train.py -- --frames 1-120
"""
import json, math, os, random, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy, bmesh
from mathutils import Vector, noise
from bpy_extras.object_utils import world_to_camera_view
import lib, train
from lib import RAIL_Y, RAIL_TOP, srgb

OFF = set(os.environ.get('SGR_OFF', '').split(','))
sc = lib.reset()
lib.setup_render(sc, samples=24)
sc.frame_start, sc.frame_end = 1, 120
lib.sky(sc, sun_elev_deg=13.0, sun_rot_deg=112.0, sun_strength=4.8, strength=0.7)  # low sun ahead of the train, cross-lighting nose and near side

HZ = ('#d6c2a2', 1600.0)
mats = {
    'rail': lib.mat_rail(), 'concrete': lib.mat_concrete(), 'ballast': lib.mat_granite(),
    'iron': lib.mat_simple('CastIron', '#3a3633', 0.55, 0.6), 'clip': lib.mat_simple('ClipSteel', '#3a3836', 0.55, 0.7),
    'pad': lib.mat_simple('Rubber', '#121212', 0.75), 'ins': lib.mat_simple('Nylon', '#1e1e1e', 0.45),
    'ballast_under': lib.mat_simple('BallastUnder', '#4a4540', 0.9),
    'galv': lib.mat_galvanised(HZ), 'copper': lib.mat_simple('Copper', '#6b4a33', 0.35, 1.0, HZ), 'ins_shed': lib.mat_simple('Shed', '#7d8084', 0.4, 0.0, HZ),
}
rocks = lib.collection('Rocks', hidden=True)
lib.rock_variants(rocks, mats['ballast'], n=10)
X0, X1 = -120.0, 760.0
lib.build_track(X0, X1, mats, rocks, near=(X0, X0), far_density=60.0)
lib.build_catenary(X0, X1, mats, spacing=55.0, side=1, start=5.0)

env = lib.collection('Env')
bm = bmesh.new(); bmesh.ops.create_grid(bm, x_segments=80, y_segments=80, size=1.0)
bmesh.ops.scale(bm, vec=(1600, 1600, 1), verts=bm.verts); bmesh.ops.translate(bm, vec=(400, 300, -0.6), verts=bm.verts)
soil = lib.mesh_obj('Soil', bm, env, lib.mat_soil(hz=HZ))
# embankment flanks: the formation sits ~0.6 m above the plain
gl = lib.collection('GrassLib', hidden=True)
lib.grass_clumps(gl, lib.mat_grass(HZ), n=10, height=(0.4, 0.95))
if 'grass' not in OFF:
    # only where the moving camera can see it (x ≈ 30..420): grass is most of this shot's render cost
    for (xa, xb, ya, yb, dens) in ((30, 330, -40, -4.2, 4.0), (40, 420, 4.2, 90, 2.5), (60, 520, -200, -40, 0.8)):
        bm = bmesh.new(); bmesh.ops.create_grid(bm, x_segments=4, y_segments=2, size=0.5)
        bmesh.ops.scale(bm, vec=(xb - xa, yb - ya, 1), verts=bm.verts)
        bmesh.ops.translate(bm, vec=((xa + xb) / 2, (ya + yb) / 2, -0.6), verts=bm.verts)
        g = lib.mesh_obj('GrassBed', bm, env)
        lib.scatter(g, gl, dens, 0.8, 1.7, seed=int(ya), rot_z_only=True, name='GrassGN')
lib.hills(env, lib.mat_soil(0.02, hz=('#d9c6a8', 3000.0)), -1500, 5000, 1200, 7000, -8, 140, 0.0006, seed=9)

R = random.Random(21)
bark = lib.mat_simple('Bark', '#3a2e26', 0.8, hz=HZ); leaf = lib.mat_leaf(HZ)
trees = lib.collection('Trees')
for k in range(34 if 'trees' not in OFF else 0):
    x = R.uniform(-100, 900); y = R.choice([1, 1, -1]) * R.uniform(25, 420)
    for p in lib.acacia(trees, bark, leaf, seed=100 + k, height=R.uniform(5.5, 9.5)):
        p.location = (x, y, -0.6); p.rotation_euler.z = R.uniform(0, 6.28)

def mat_weathered(name, base, dark, light, scale, hz):
    """Large-scale weathered surface: broad tonal patches, vertical streaks, lichen/dark staining, fine grain bump."""
    m, n, out = lib.new_mat(name)
    tc = n.new('ShaderNodeTexCoord'); p = tc.outputs['Object']
    big = n.new('ShaderNodeTexNoise', Scale=scale, Detail=4.0, Roughness=0.6, Vector=p)
    mp = n.new('ShaderNodeMapping', Vector=p, Scale=(3.0, 3.0, 0.4)); st = n.new('ShaderNodeTexNoise', Scale=scale * 4, Detail=3.0)
    n.link(mp.outputs[0], st.inputs['Vector'])
    grain = n.new('ShaderNodeTexVoronoi', Scale=scale * 60, Vector=p)
    col = n.ramp(big.outputs['Fac'], [(0.3, srgb(dark)), (0.55, srgb(base)), (0.75, srgb(light))])
    col = n.mix(n.math('MULTIPLY', n.math('SUBTRACT', st.outputs['Fac'], 0.45, clamp=True), 1.2), col, srgb(dark), 'MULTIPLY')
    b = n.new('ShaderNodeBsdfPrincipled', Roughness=0.9); n.link(col, b.inputs['Base Color'])
    bump = n.new('ShaderNodeBump', Strength=0.6, Distance=0.02, Height=n.math('ADD', grain.outputs['Distance'], st.outputs['Fac']))
    n.link(bump.outputs[0], b.inputs['Normal'])
    n.link(lib.haze(n, b.outputs[0], *hz), out.inputs[0])
    return m


bao_mat = mat_weathered('BaobabBark', '#7c6e64', '#4e443d', '#958779', 1.2, HZ)
kop_mat = mat_weathered('KopjeGranite', '#857668', '#4d453f', '#a39385', 0.35, HZ)

# baobabs (dry season, leafless): massive tapering trunk, short thick branches
def baobab(x, y, h, seed):
    r = random.Random(seed)
    bm = bmesh.new()
    rings = []
    for i in range(9):
        t = i / 8; z = t * h; rad = (2.3 + 0.5 * math.sin(t * 2.6) - 1.5 * t ** 1.4) * h / 12  # bottle-shaped trunk
        ring = []
        for j in range(20):
            a = j / 20 * math.tau
            w = rad * (1 + 0.08 * noise.noise(Vector((math.cos(a) * 2, math.sin(a) * 2, z * 0.3 + seed))))
            ring.append(bm.verts.new((x + math.cos(a) * w, y + math.sin(a) * w, -0.6 + z)))
        rings.append(ring)
    for a, b in zip(rings, rings[1:]):
        for j in range(20): bm.faces.new((a[j], a[(j + 1) % 20], b[(j + 1) % 20], b[j]))
    o = lib.mesh_obj('Baobab', bm, env, bao_mat, smooth=True)
    cu = bpy.data.curves.new('BaoBranch', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = 1.0; cu.bevel_resolution = 2
    for k in range(r.randint(6, 9)):
        a = r.uniform(0, math.tau); sp = cu.splines.new('POLY'); pts = []
        p = Vector((x + math.cos(a) * 0.6, y + math.sin(a) * 0.6, -0.6 + h * 0.95)); d = Vector((math.cos(a), math.sin(a), r.uniform(0.4, 1.1))).normalized()
        for i in range(4):
            pts.append(p.copy()); d = (d + Vector((r.gauss(0, 0.3), r.gauss(0, 0.3), r.gauss(0, 0.2)))).normalized(); p += d * r.uniform(1.0, 1.8) * h / 14
        sp.points.add(len(pts) - 1)
        for i, (pt, q) in enumerate(zip(sp.points, pts)): pt.co = (*q, 1); pt.radius = 0.45 * (1 - 0.7 * i / 3) * h / 14
    bo = bpy.data.objects.new('BaobabBranches', cu); cu.materials.append(bao_mat); lib.link(bo, env)
for (bx, by, bh, sd) in ((260, 70, 15, 1), (520, -140, 17, 2), (40, 210, 13, 3)):
    baobab(bx, by, bh, sd)

# granite kopjes: clusters of large rounded boulders, weathered pink-grey
def kopje(cx, cy, n, size, seed):
    r = random.Random(seed)
    for k in range(n):
        bm = bmesh.new(); bmesh.ops.create_icosphere(bm, subdivisions=3, radius=1.0)
        sx, sy, sz = r.uniform(0.8, 1.4), r.uniform(0.7, 1.2), r.uniform(0.55, 0.9)
        off = Vector((r.random() * 50, r.random() * 50, r.random() * 50))
        for v in bm.verts:
            v.co = Vector((v.co.x * sx, v.co.y * sy, v.co.z * sz))
            v.co += v.co.normalized() * 0.12 * noise.noise(v.co * 1.5 + off)
        s = size * r.uniform(0.5, 1.0)
        bmesh.ops.scale(bm, vec=(s, s, s), verts=bm.verts)
        bmesh.ops.translate(bm, vec=(cx + r.gauss(0, size * 1.2), cy + r.gauss(0, size * 1.2), -0.6 + s * sz * r.uniform(0.2, 1.4)), verts=bm.verts)
        lib.mesh_obj('Boulder', bm, env, kop_mat, smooth=True)
kopje(420, 160, 14, 7.0, 4); kopje(700, 300, 10, 9.0, 5); kopje(150, -240, 8, 6.0, 6)

# the train: nose at x = x(f), 120 km/h (33.3 m/s); camera tracks at 30.5 m/s so the nose advances in frame
root, wheels, length = train.build_train(8)
V_TRAIN, V_CAM, FPS = 33.3, 32.4, 30
x_nose0 = 96.5
for f in (1, 120):
    root.location = (x_nose0 + V_TRAIN * (f - 1) / FPS, 0, 0); root.keyframe_insert('location', frame=f)
for w in wheels:
    for f in (1, 120):
        w.rotation_euler = (0, V_TRAIN * (f - 1) / FPS / 0.43, 0); w.keyframe_insert('rotation_euler', frame=f)
for ob in [root] + wheels:
    ad = ob.animation_data
    if ad and ad.action:
        try: curves = ad.action.fcurves
        except AttributeError: curves = [fc for l in ad.action.layers for s_ in l.strips for cb in s_.channelbags for fc in cb.fcurves]
        for fc in curves:
            for kp in fc.keyframe_points: kp.interpolation = 'LINEAR'

cam = lib.camera(sc, lens=45, dof=None)
cam.data.dof.use_dof = True; cam.data.dof.aperture_fstop = 5.6
for f, xo in ((1, 0.0), (120, V_CAM * 119 / FPS)):
    cam.location = (x_nose0 + 9.0 + xo, -17.5, 2.6); cam.keyframe_insert('location', frame=f)
    cam.data.dof.focus_distance = 22.0; cam.data.dof.keyframe_insert('focus_distance', frame=f)
cam.rotation_euler = (math.radians(87.0), 0, math.radians(36.0))   # looking back along the train at ~3/4 front
ad = cam.animation_data
try: curves = ad.action.fcurves
except AttributeError: curves = [fc for l in ad.action.layers for s_ in l.strips for cb in s_.channelbags for fc in cb.fcurves]
for fc in curves:
    for kp in fc.keyframe_points: kp.interpolation = 'LINEAR'

anchor = {}
for f in range(1, 121):
    sc.frame_set(f)
    nose = Vector((root.location.x - 2.0, 0, RAIL_TOP + 3.7))
    v = world_to_camera_view(sc, cam, nose)
    anchor[f] = [round(v.x, 5), round(1 - v.y, 5)]
os.makedirs(os.path.join(lib.HERE, 'out', 'shot3'), exist_ok=True)
json.dump(anchor, open(os.path.join(lib.HERE, 'out', 'shot3', 'anchor.json'), 'w'))

lib.cli_render(sc, os.path.join(lib.HERE, 'out', 'shot3'), '1-120')
