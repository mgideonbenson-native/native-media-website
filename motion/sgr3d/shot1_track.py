"""
POC shot 1 (frames 1–150, 5 s): extreme close-up along the rail at golden hour, then the camera cranes up and tilts
down to a top-down view of the track: the hand-off to the terrain model (shot 2).

    python shot1_track.py -- --still 40 --pct 50        quick still
    python shot1_track.py -- --frames 1-150             PNG sequence in out/shot1
"""
import math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy
from mathutils import Vector
import lib
OFF = set(os.environ.get('SGR_OFF', '').split(','))  # profiling: e.g. SGR_OFF=grass,trees,dof
from lib import RAIL_Y, RAIL_TOP

sc = lib.reset()
lib.setup_render(sc, samples=96)
sc.frame_start, sc.frame_end = 1, 105
lib.sky(sc, sun_elev_deg=13.0, sun_rot_deg=28.0, sun_strength=4.6, strength=0.75)  # ahead-left of the camera: rail-head glints

HZ = ('#d2bc98', 1400.0)
mats = {
    'rail': lib.mat_rail(), 'concrete': lib.mat_concrete(), 'ballast': lib.mat_granite(),
    'iron': lib.mat_simple('CastIron', '#3a3633', 0.55, 0.6), 'clip': lib.mat_simple('ClipSteel', '#3a3836', 0.55, 0.7),
    'pad': lib.mat_simple('Rubber', '#121212', 0.75), 'ins': lib.mat_simple('Nylon', '#1e1e1e', 0.45),
    'ballast_under': lib.mat_simple('BallastUnder', '#2e2b28', 0.9),
    'galv': lib.mat_galvanised(HZ), 'copper': lib.mat_simple('Copper', '#6b4a33', 0.35, 1.0, HZ), 'ins_shed': lib.mat_simple('Shed', '#7d8084', 0.4, 0.0, HZ),
}
rocks = lib.collection('Rocks', hidden=True)
lib.rock_variants(rocks, mats['ballast'], n=14)
X0, X1 = -20.0, 420.0
lib.build_track(X0, X1, mats, rocks, near=(-3.0, 30.0), near_density=520.0, far_density=90.0)
lib.build_catenary(X0, X1, mats, spacing=55.0, side=1, start=24.0)

# ground: laterite soil with dry grass, then rolling hills and acacias in the distance
env = lib.collection('Env')
import bmesh
bm = bmesh.new(); bmesh.ops.create_grid(bm, x_segments=60, y_segments=60, size=1.0)
bmesh.ops.scale(bm, vec=(1400, 900, 1), verts=bm.verts); bmesh.ops.translate(bm, vec=(600, 0, -0.62), verts=bm.verts)
soil = lib.mesh_obj('Soil', bm, env, lib.mat_soil(hz=HZ))
gl = lib.collection('GrassLib', hidden=True)
lib.grass_clumps(gl, lib.mat_grass(HZ), n=10)
for side in ((-1, 1) if 'grass' not in OFF else ()):  # grass beds either side of the formation, dense near the camera
    for (xa, xb, dens) in ((-8, 60, 10.0), (60, 300, 2.0)):
        bm = bmesh.new(); bmesh.ops.create_grid(bm, x_segments=4, y_segments=2, size=0.5)
        bmesh.ops.scale(bm, vec=(xb - xa, 60, 1), verts=bm.verts)
        bmesh.ops.translate(bm, vec=((xa + xb) / 2, side * 34.5, -0.6), verts=bm.verts)
        g = lib.mesh_obj('GrassBed', bm, env)
        lib.scatter(g, gl, dens, 0.7, 1.4, seed=int(xa + side * 7), rot_z_only=True, name='GrassGN')
lib.hills(env, lib.mat_soil(0.02, hz=('#d8c4a4', 2600.0)), 900, 6000, -4000, 4000, -8, 90, 0.0007, seed=4)
trees = lib.collection('Trees')
bark = lib.mat_simple('Bark', '#3a2e26', 0.8, hz=HZ); leaf = lib.mat_leaf(HZ)
import random
R = random.Random(11)
for k in range(26 if 'trees' not in OFF else 0):
    x = R.uniform(40, 900); y = R.choice([-1, 1]) * R.uniform(22, 260)
    parts = lib.acacia(trees, bark, leaf, seed=k, height=R.uniform(5.5, 9.0))
    for p in parts: p.location = (x, y, -0.6); p.rotation_euler.z = R.uniform(0, 6.28)

# camera: just inside the right rail, a few cm above the head, looking along it into the low sun; slow dolly,
# then crane up and tilt down to a top-down view (track vertical on screen) for the hand-off to the terrain model
cam = lib.camera(sc, lens=40, dof=1.1, fstop=3.2)
F = [1, 78, 98, 105]
locs = [(-0.6, RAIL_Y - 0.17, RAIL_TOP + 0.075), (0.55, RAIL_Y - 0.15, RAIL_TOP + 0.085), (1.6, 0.35, 4.0), (2.0, 0.0, 22.0)]
rots = [(math.radians(84), 0, math.radians(-93.5)), (math.radians(84.5), 0, math.radians(-93)), (math.radians(30), 0, math.radians(-90)), (0.0, 0, math.radians(-90))]
lib.key_path(cam, F, 'location', locs)
lib.key_path(cam, F, 'rotation_euler', rots)
dof = cam.data.dof
for f, fd, fs in ((1, 1.1, 3.2), (78, 1.1, 3.2), (98, 4.2, 5.6), (105, 22.0, 11.0)):
    dof.focus_distance = fd; dof.aperture_fstop = fs
    dof.keyframe_insert('focus_distance', frame=f); dof.keyframe_insert('aperture_fstop', frame=f)

if 'mats' in OFF:
    for m in bpy.data.materials:
        nt = m.node_tree; out = [n for n in nt.nodes if n.bl_idname == 'ShaderNodeOutputMaterial'][0]
        b = nt.nodes.new('ShaderNodeBsdfDiffuse'); nt.links.new(b.outputs[0], out.inputs[0])
if 'dof' in OFF: cam.data.dof.use_dof = False
if 'ballast' in OFF:
    for o in list(bpy.data.objects):
        if o.name.startswith('BallastFar'): o.modifiers.clear()
# track centreline on screen for the last frames (the orange hand-off line drawn in comp.py)
import json
from bpy_extras.object_utils import world_to_camera_view
line = {}
for f in range(70, 106):
    sc.frame_set(f)
    pts = []
    for x in (-40, -10, 0, 2, 5, 10, 20, 40, 80, 160, 320):
        v = world_to_camera_view(sc, cam, Vector((cam.matrix_world.translation.x + x, 0.0, RAIL_TOP)))
        if v.z > 0: pts.append([round(v.x, 5), round(1 - v.y, 5)])
    line[f] = pts
os.makedirs(os.path.join(lib.HERE, 'out', 'shot1'), exist_ok=True)
json.dump(line, open(os.path.join(lib.HERE, 'out', 'shot1', 'trackline.json'), 'w'))
lib.cli_render(sc, os.path.join(lib.HERE, 'out', 'shot1'), '1-105')
