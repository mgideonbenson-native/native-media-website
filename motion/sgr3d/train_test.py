"""Look-development scene for the train model alone: three views at low cost. python train_test.py"""
import math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy, bmesh
import lib, train
sc = lib.reset(); lib.setup_render(sc, res=(960, 540), samples=16, motion_blur=False)
lib.sky(sc, sun_elev_deg=14.0, sun_rot_deg=112.0, sun_strength=4.8, strength=0.7)
bm = bmesh.new(); bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=300); lib.mesh_obj('G', bm, mat=lib.mat_soil())
root, wheels, L = train.build_train(3)
cam = lib.camera(sc, lens=45)
out = os.path.join(lib.HERE, 'out', 'traintest'); os.makedirs(out, exist_ok=True)
for name, loc, tgt in (('front34', (14, -14, 2.4), (-6, 0, 2.2)), ('side', (-14, -22, 2.0), (-14, 0, 2.0)), ('low', (6, -6.5, 0.7), (-3, 0, 1.6))):
    cam.location = loc; lib.look_at(cam, tgt)
    sc.render.filepath = os.path.join(out, name + '.png'); bpy.ops.render.render(write_still=True)
