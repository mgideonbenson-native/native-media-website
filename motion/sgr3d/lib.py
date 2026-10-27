"""
Shared building blocks for the SGR CGI film (Blender / Cycles, driven from Python through the `bpy` module).

Everything is generated: geometry from dimensions, materials from procedural shader networks (no photographs,
no scanned textures, no HDRIs). Units are metres. The track runs along +X, centred on Y = 0, rail tops at Z = RAIL_TOP.
"""
import math, random, sys, os
import bpy, bmesh
from mathutils import Vector, Matrix, Euler

HERE = os.path.dirname(os.path.abspath(__file__))

# ── Track dimensions (standard gauge, 60E1-type rail, B70-type concrete monoblock sleeper) ─────────────
GAUGE = 1.435              # between the inner faces of the rail heads
HEAD_W = 0.072             # rail head width
RAIL_H = 0.172             # rail height (60E1)
SLEEPER_TOP = 0.0          # sleeper top surface (rail seat) at Z = 0
PAD = 0.007                # rail pad thickness
RAIL_TOP = SLEEPER_TOP + PAD + RAIL_H
RAIL_Y = GAUGE / 2 + HEAD_W / 2      # rail centrelines at ±RAIL_Y
SLEEPER_PITCH = 0.60
SLEEPER_LEN, SLEEPER_H, SLEEPER_WB, SLEEPER_WT = 2.60, 0.21, 0.30, 0.22


# ── Scene and render ─────────────────────────────────────────────────────────────────────────────────────
def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.unit_settings.system = 'METRIC'
    return sc


def setup_render(sc, res=(1920, 1080), pct=100, samples=64, fps=30, motion_blur=True, threshold=0.02):
    r = sc.render
    r.engine = 'CYCLES'
    r.resolution_x, r.resolution_y, r.resolution_percentage = res[0], res[1], pct
    r.fps = fps
    r.use_motion_blur = motion_blur
    r.motion_blur_shutter = 0.5
    r.film_transparent = False
    r.use_persistent_data = True
    c = sc.cycles
    c.device = 'CPU'
    c.samples = samples
    c.use_adaptive_sampling = True
    c.adaptive_threshold = threshold
    c.use_denoising = True
    try: c.denoiser = 'OPENIMAGEDENOISE'
    except Exception: pass
    c.max_bounces, c.diffuse_bounces, c.glossy_bounces, c.transmission_bounces, c.transparent_max_bounces = 4, 2, 2, 2, 6
    c.use_fast_gi = True; c.fast_gi_method = 'REPLACE'
    if sc.world: sc.world.light_settings.distance = 30.0
    c.caustics_reflective = c.caustics_refractive = False
    c.blur_glossy = 1.0
    c.sample_clamp_indirect = 8.0
    sc.view_settings.view_transform = 'AgX'
    for look in ('AgX - Medium High Contrast', 'Medium High Contrast', 'None'):
        try: sc.view_settings.look = look; break
        except Exception: continue
    sc.view_settings.exposure = -1.3
    r.image_settings.file_format = 'PNG'
    r.image_settings.color_depth = '16'


def sky(sc, sun_elev_deg=14.0, sun_rot_deg=250.0, strength=0.9, sun_strength=4.5, sun_angle_deg=0.6, warm=(1.0, 0.93, 0.85)):
    """Physical (Nishita) sky plus a matching sun lamp, so direct light and sky agree."""
    w = bpy.data.worlds.new('World'); sc.world = w; w.use_nodes = True
    nt = w.node_tree; nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputWorld'); bg = nt.nodes.new('ShaderNodeBackground'); st = nt.nodes.new('ShaderNodeTexSky')
    try:
        st.sky_type = 'NISHITA'
    except Exception:
        st.sky_type = st.bl_rna.properties['sky_type'].enum_items[0].identifier
    for k, v in (('sun_elevation', math.radians(sun_elev_deg)), ('sun_rotation', math.radians(sun_rot_deg)), ('altitude', 1100.0),
                 ('air_density', 1.4), ('dust_density', 2.2), ('ozone_density', 1.0), ('sun_disc', False)):
        if hasattr(st, k): setattr(st, k, v)
    bg.inputs['Strength'].default_value = strength
    nt.links.new(st.outputs[0], bg.inputs[0]); nt.links.new(bg.outputs[0], out.inputs[0])
    sun = bpy.data.lights.new('Sun', 'SUN'); sun.energy = sun_strength; sun.angle = math.radians(sun_angle_deg); sun.color = warm
    o = bpy.data.objects.new('Sun', sun); sc.collection.objects.link(o)
    # Blender sun points down -Z; aim it from the sky direction (elevation, azimuth measured like the sky texture)
    az = math.radians(sun_rot_deg); el = math.radians(sun_elev_deg)
    d = Vector((math.cos(el) * math.sin(az), -math.cos(el) * math.cos(az), math.sin(el)))  # towards the sun
    o.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()
    return o


def link(obj, col=None):
    (col or bpy.context.scene.collection).objects.link(obj)
    return obj


def collection(name, hidden=False):
    c = bpy.data.collections.new(name); bpy.context.scene.collection.children.link(c)
    if hidden:  # exclude from the view layer: still usable as an instance source, never rendered directly
        bpy.context.view_layer.layer_collection.children[c.name].exclude = True
    return c


def mesh_obj(name, bm, col=None, mat=None, smooth=False):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    if smooth:
        for p in me.polygons: p.use_smooth = True
    o = bpy.data.objects.new(name, me)
    if mat: me.materials.append(mat)
    return link(o, col)


# ── Shader helpers ───────────────────────────────────────────────────────────────────────────────────────
class N:
    """Tiny node-graph helper: N(mat).new('ShaderNodeTexNoise', Scale=4) etc."""
    def __init__(self, tree):
        self.t = tree; self.n = tree.nodes; self.l = tree.links

    def new(self, typ, **inputs):
        nd = self.n.new(typ)
        for k, v in inputs.items():
            if k.startswith('_'):
                setattr(nd, k[1:], v)
            elif isinstance(v, bpy.types.NodeSocket):
                self.l.new(v, nd.inputs[k])
            else:
                nd.inputs[k].default_value = v
        return nd

    def link(self, a, b):
        self.l.new(a, b)

    def math(self, op, a, b=0.0, clamp=False):
        m = self.n.new('ShaderNodeMath'); m.operation = op; m.use_clamp = clamp
        for i, v in enumerate((a, b)):
            if isinstance(v, bpy.types.NodeSocket): self.l.new(v, m.inputs[i])
            else: m.inputs[i].default_value = v
        return m.outputs[0]

    def mix(self, fac, a, b, blend='MIX'):
        m = self.n.new('ShaderNodeMix'); m.data_type = 'RGBA'; m.blend_type = blend
        for sock, v in ((m.inputs[0], fac), (m.inputs[6], a), (m.inputs[7], b)):
            if isinstance(v, bpy.types.NodeSocket): self.l.new(v, sock)
            else: sock.default_value = v if not isinstance(v, (int, float)) else v
        return m.outputs[2]

    def ramp(self, fac, stops):
        r = self.n.new('ShaderNodeValToRGB'); e = r.color_ramp.elements
        while len(e) > len(stops): e.remove(e[-1])
        while len(e) < len(stops): e.new(0.5)
        for el, (pos, col) in zip(e, stops):
            el.position = pos; el.color = col if len(col) == 4 else (*col, 1)
        self.l.new(fac, r.inputs[0])
        return r.outputs[0]


def new_mat(name):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    n = N(nt)
    out = n.new('ShaderNodeOutputMaterial')
    return m, n, out


def srgb(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in c) + (1.0,)


def haze(n, shader, color='#c9b9a0', dist=900.0):
    """Atmospheric perspective: blend towards a warm haze with camera distance (cheap stand-in for a volume)."""
    cam = n.new('ShaderNodeCameraData')
    f = n.math('POWER', n.math('DIVIDE', cam.outputs['View Distance'], dist), 1.3)
    f = n.math('MINIMUM', f, 0.85)
    em = n.new('ShaderNodeEmission', Color=srgb(color), Strength=1.0)
    mx = n.new('ShaderNodeMixShader')
    n.link(f, mx.inputs[0]); n.link(shader, mx.inputs[1]); n.link(em.outputs[0], mx.inputs[2])
    return mx.outputs[0]


# ── Materials ────────────────────────────────────────────────────────────────────────────────────────────
def mat_rail():
    """Rail steel: a bright, wheel-polished running band on the head; mill-scale and light rust elsewhere."""
    m, n, out = new_mat('RailSteel')
    tc = n.new('ShaderNodeTexCoord'); sep = n.new('ShaderNodeSeparateXYZ', Vector=tc.outputs['Object'])
    z = sep.outputs['Z']; y = sep.outputs['Y']
    geo = n.new('ShaderNodeNewGeometry')
    nz = n.new('ShaderNodeSeparateXYZ', Vector=geo.outputs['Normal']).outputs['Z']
    # running band: top of head, within ~±14 mm of the head centre, facing up
    lateral = n.math('ABSOLUTE', n.math('SUBTRACT', n.math('ABSOLUTE', y), RAIL_Y))  # distance from the rail centreline
    band = n.math('MULTIPLY', n.math('GREATER_THAN', z, RAIL_TOP - 0.004), n.math('LESS_THAN', lateral, 0.0145))
    band = n.math('MULTIPLY', band, n.math('GREATER_THAN', nz, 0.85))
    # streaks along the rail for the polished band, blotches for rust
    streak = n.new('ShaderNodeTexNoise', Scale=6.0, Detail=4.0, Roughness=0.6)
    mp = n.new('ShaderNodeMapping', Vector=tc.outputs['Object'], Scale=(0.02, 40.0, 40.0))
    n.link(mp.outputs[0], streak.inputs['Vector'])
    rust_n = n.new('ShaderNodeTexNoise', Scale=18.0, Detail=4.0, Roughness=0.65, Vector=tc.outputs['Object'])
    rust_v = n.new('ShaderNodeTexVoronoi', Scale=60.0, Vector=tc.outputs['Object'])
    rustcol = n.ramp(rust_n.outputs['Fac'], [(0.35, srgb('#3b2a22')), (0.55, srgb('#6a3b22')), (0.75, srgb('#7d4a2b'))])
    rustcol = n.mix(n.math('MULTIPLY', rust_v.outputs['Distance'], 0.6), rustcol, srgb('#2c2622'), 'MULTIPLY')
    # side of head: darker, slightly shinier mill scale grading into rust towards the web/foot
    side = n.mix(n.math('MULTIPLY', n.math('SUBTRACT', z, 0.10), 9.0, clamp=True), rustcol, srgb('#4a4440'))
    bandcol = n.mix(streak.outputs['Fac'], srgb('#b9b7b2'), srgb('#d8d6d0'))
    base = n.new('ShaderNodeBsdfPrincipled')
    n.link(n.mix(band, side, bandcol), base.inputs['Base Color'])
    n.link(n.math('ADD', n.math('MULTIPLY', band, 1.0), 0.0), base.inputs['Metallic'])
    rough_band = n.math('ADD', n.math('MULTIPLY', streak.outputs['Fac'], 0.12), 0.12)
    rough_rust = n.math('ADD', n.math('MULTIPLY', rust_n.outputs['Fac'], 0.3), 0.55)
    rough = n.new('ShaderNodeMix', _data_type='FLOAT')
    n.link(band, rough.inputs[0]); n.link(rough_rust, rough.inputs[2]); n.link(rough_band, rough.inputs[3])
    n.link(rough.outputs[0], base.inputs['Roughness'])
    base.inputs['Anisotropic'].default_value = 0.6
    bump = n.new('ShaderNodeBump', Strength=0.25, Distance=0.0008, Height=rust_v.outputs['Distance'])
    n.link(bump.outputs[0], base.inputs['Normal'])
    n.link(base.outputs[0], out.inputs[0])
    return m


def mat_concrete(seed=0.0):
    """Precast sleeper concrete: pale grey-beige, fine aggregate pores, faint form lines, laterite dust low down."""
    m, n, out = new_mat('Concrete')
    tc = n.new('ShaderNodeTexCoord')
    obj = n.new('ShaderNodeObjectInfo')
    w = n.new('ShaderNodeVectorMath', _operation='ADD', Vector=tc.outputs['Object'])
    n.link(n.new('ShaderNodeCombineXYZ', X=obj.outputs['Random']).outputs[0], w.inputs[1])
    big = n.new('ShaderNodeTexNoise', Scale=3.0, Detail=4.0, Roughness=0.55, Vector=w.outputs[0])
    fine = n.new('ShaderNodeTexNoise', Scale=140.0, Detail=4.0, Vector=w.outputs[0])
    pores = n.new('ShaderNodeTexVoronoi', Scale=380.0, _feature='F1', Vector=w.outputs[0])
    pore = n.math('LESS_THAN', pores.outputs['Distance'], 0.08)
    col = n.ramp(big.outputs['Fac'], [(0.3, srgb('#7f7a72')), (0.55, srgb('#938e84')), (0.75, srgb('#a29d92'))])
    col = n.mix(n.math('MULTIPLY', fine.outputs['Fac'], 0.35), col, srgb('#7d786f'), 'MULTIPLY')
    col = n.mix(n.math('MULTIPLY', pore, 0.7), col, srgb('#4b4741'))
    # laterite dust: stronger towards the bottom of the sleeper
    zz = n.new('ShaderNodeSeparateXYZ', Vector=tc.outputs['Object']).outputs['Z']
    dust = n.math('MULTIPLY', n.math('SUBTRACT', 1.0, n.math('MULTIPLY', n.math('ADD', zz, SLEEPER_H), 7.0), clamp=True), 0.55)
    col = n.mix(dust, col, srgb('#8a5a3c'))
    b = n.new('ShaderNodeBsdfPrincipled', Roughness=0.86)
    n.link(col, b.inputs['Base Color'])
    hgt = n.math('ADD', n.math('MULTIPLY', fine.outputs['Fac'], 0.4), n.math('MULTIPLY', pore, -0.6))
    bump = n.new('ShaderNodeBump', Strength=0.35, Distance=0.0015, Height=hgt)
    n.link(bump.outputs[0], b.inputs['Normal'])
    n.link(b.outputs[0], out.inputs[0])
    return m


def mat_granite():
    """Crushed granite ballast: per-stone colour variation (grey, pinkish, dark), crystal speckle, sharp facets."""
    m, n, out = new_mat('Ballast')
    tc = n.new('ShaderNodeTexCoord'); obj = n.new('ShaderNodeObjectInfo')
    rnd = obj.outputs['Random']
    base = n.ramp(rnd, [(0.0, srgb('#6f6a64')), (0.3, srgb('#8e867c')), (0.55, srgb('#a39586')), (0.75, srgb('#8a7f75')), (0.9, srgb('#9b8c80')), (1.0, srgb('#5b5651'))])
    speck = n.new('ShaderNodeTexVoronoi', Scale=900.0, Vector=tc.outputs['Object'])
    sp = n.ramp(speck.outputs['Color'], [(0.0, srgb('#2a2826')), (0.5, srgb('#8a8580')), (1.0, srgb('#d4cfc8'))])
    col = n.mix(0.35, base, sp, 'OVERLAY')
    # red laterite dust settling on upward faces
    geo = n.new('ShaderNodeNewGeometry')
    up = n.math('POWER', n.math('MAXIMUM', n.new('ShaderNodeSeparateXYZ', Vector=geo.outputs['Normal']).outputs['Z'], 0.0), 3.0)
    dn = n.new('ShaderNodeTexNoise', Scale=2.0, Detail=4.0, Vector=geo.outputs['Position'])
    dust = n.math('MULTIPLY', up, n.math('MULTIPLY', dn.outputs['Fac'], 0.55))
    col = n.mix(dust, col, srgb('#9a6a48'))
    b = n.new('ShaderNodeBsdfPrincipled', Roughness=0.8)
    n.link(col, b.inputs['Base Color'])
    bump = n.new('ShaderNodeBump', Strength=0.7, Distance=0.0015, Height=speck.outputs['Distance'])
    n.link(bump.outputs[0], b.inputs['Normal'])
    n.link(b.outputs[0], out.inputs[0])
    return m


def mat_soil(scale=1.0, hz=None):
    """Tanzanian laterite: red-brown soil with darker patches, dry grass litter, small pebbles (bump)."""
    m, n, out = new_mat('Soil')
    tc = n.new('ShaderNodeTexCoord'); p = tc.outputs['Object']
    a = n.new('ShaderNodeTexNoise', Scale=0.35 * scale, Detail=4.0, Roughness=0.6, Vector=p)
    b2 = n.new('ShaderNodeTexNoise', Scale=6.0 * scale, Detail=4.0, Roughness=0.6, Vector=p)
    peb = n.new('ShaderNodeTexVoronoi', Scale=90.0 * scale, Vector=p)
    col = n.ramp(a.outputs['Fac'], [(0.3, srgb('#6b3f28')), (0.5, srgb('#8a5435')), (0.7, srgb('#7a5a3e'))])
    col = n.mix(n.math('MULTIPLY', b2.outputs['Fac'], 0.5), col, srgb('#a58460'), 'OVERLAY')
    sh = n.new('ShaderNodeBsdfPrincipled', Roughness=0.92)
    n.link(col, sh.inputs['Base Color'])
    bump = n.new('ShaderNodeBump', Strength=0.6, Distance=0.01, Height=n.math('ADD', b2.outputs['Fac'], n.math('MULTIPLY', peb.outputs['Distance'], -0.6)))
    n.link(bump.outputs[0], sh.inputs['Normal'])
    s = sh.outputs[0]
    if hz: s = haze(n, s, *hz)
    n.link(s, out.inputs[0])
    return m


def mat_grass(hz=None):
    """Dry-season savanna grass: straw to olive, translucent in back-light, darker at the root."""
    m, n, out = new_mat('Grass')
    obj = n.new('ShaderNodeObjectInfo'); tc = n.new('ShaderNodeTexCoord')
    zz = n.new('ShaderNodeSeparateXYZ', Vector=tc.outputs['Generated']).outputs['Z']
    tint = n.ramp(n.math('ADD', obj.outputs['Random'], n.math('MULTIPLY', n.new('ShaderNodeTexNoise', Scale=0.05, Vector=n.new('ShaderNodeNewGeometry').outputs['Position']).outputs['Fac'], 0.6)),
                  [(0.0, srgb('#7b6a3a')), (0.35, srgb('#a88f55')), (0.65, srgb('#c2a86c')), (1.0, srgb('#6f6b3a'))])
    col = n.mix(n.math('SUBTRACT', 1.0, n.math('MULTIPLY', zz, 3.0), clamp=True), tint, srgb('#3d3220'))
    b = n.new('ShaderNodeBsdfPrincipled', Roughness=0.6)
    n.link(col, b.inputs['Base Color'])
    try:
        b.inputs['Subsurface Weight'].default_value = 0.0
        b.inputs['Transmission Weight'].default_value = 0.0
    except KeyError: pass
    tr = n.new('ShaderNodeBsdfTranslucent'); n.link(col, tr.inputs['Color'])
    mx = n.new('ShaderNodeMixShader'); mx.inputs[0].default_value = 0.35
    n.link(b.outputs[0], mx.inputs[1]); n.link(tr.outputs[0], mx.inputs[2])
    s = mx.outputs[0]
    if hz: s = haze(n, s, *hz)
    n.link(s, out.inputs[0])
    return m


def mat_simple(name, color, rough=0.5, metal=0.0, hz=None, spec=0.5):
    m, n, out = new_mat(name)
    b = n.new('ShaderNodeBsdfPrincipled', Roughness=rough, Metallic=metal)
    b.inputs['Base Color'].default_value = srgb(color) if isinstance(color, str) else color
    s = b.outputs[0]
    if hz: s = haze(n, s, *hz)
    n.link(s, out.inputs[0])
    return m


def mat_galvanised(hz=None):
    """Hot-dip galvanised steel (masts, cantilevers): spangled grey zinc, dull."""
    m, n, out = new_mat('Galvanised')
    tc = n.new('ShaderNodeTexCoord')
    v = n.new('ShaderNodeTexVoronoi', Scale=35.0, Vector=tc.outputs['Object'])
    col = n.ramp(v.outputs['Color'], [(0.0, srgb('#6e7173')), (0.5, srgb('#85888a')), (1.0, srgb('#636668'))])
    b = n.new('ShaderNodeBsdfPrincipled', Metallic=0.9, Roughness=0.42)
    n.link(col, b.inputs['Base Color'])
    s = b.outputs[0]
    if hz: s = haze(n, s, *hz)
    n.link(s, out.inputs[0])
    return m


# ── Geometry: rail, sleeper, fastenings, ballast stones ───────────────────────────────────────────────────
def rail_profile():
    """Closed 60E1-type flat-bottom rail profile: (lateral offset from rail centre, height above the foot), metres."""
    right = [(0.075, 0.0), (0.075, 0.0115), (0.060, 0.0150), (0.022, 0.0255), (0.0105, 0.035), (0.0083, 0.045),
             (0.0083, 0.128), (0.0110, 0.138), (0.0230, 0.144), (0.0355, 0.149), (0.0360, 0.158), (0.0355, 0.164),
             (0.0335, 0.168), (0.0290, 0.1705), (0.0180, 0.1718), (0.0, 0.1720)]
    return right + [(-x, z) for x, z in reversed(right[:-1])]


def build_rail(name, length, y, col, mat, x0=0.0, seg=1.0):
    """Extrude the rail profile along X (segments so that long rails still take a slight curve later if needed)."""
    prof = rail_profile()
    bm = bmesh.new()
    rings = []
    nseg = max(1, int(length / seg))
    for i in range(nseg + 1):
        x = x0 + length * i / nseg
        rings.append([bm.verts.new((x, y + py, SLEEPER_TOP + PAD + pz)) for py, pz in prof])
    for a, b in zip(rings, rings[1:]):
        k = len(a)
        for j in range(k):
            bm.faces.new((a[j], a[(j + 1) % k], b[(j + 1) % k], b[j]))
    bm.faces.new(rings[0][::-1]); bm.faces.new(rings[-1])
    bm.normal_update()
    o = mesh_obj(name, bm, col, mat, smooth=False)
    # shade smooth on the curved head only via auto smooth by angle
    try:
        bpy.context.view_layer.objects.active = o
        o.data.shade_smooth_by_angle(angle=math.radians(35)) if hasattr(o.data, 'shade_smooth_by_angle') else None
    except Exception:
        pass
    return o


def build_sleeper(col, mat):
    """Monoblock prestressed concrete sleeper: tapered sides, thinner middle, chamfered edges (bevel modifier)."""
    bm = bmesh.new()
    L, H, wb, wt = SLEEPER_LEN, SLEEPER_H, SLEEPER_WB, SLEEPER_WT
    ys = [-L / 2, -L / 2 + 0.05, -0.55, -0.35, 0.35, 0.55, L / 2 - 0.05, L / 2]
    hs = [H - 0.02, H, H, H - 0.035, H - 0.035, H, H, H - 0.02]  # rail seats full height, centre lower
    rings = []
    for yy, hh in zip(ys, hs):
        top = SLEEPER_TOP - (H - hh)
        rings.append([bm.verts.new(v) for v in ((-wb / 2, yy, SLEEPER_TOP - H), (wb / 2, yy, SLEEPER_TOP - H), (wt / 2, yy, top), (-wt / 2, yy, top))])
    for a, b in zip(rings, rings[1:]):
        for j in range(4):
            bm.faces.new((a[j], a[(j + 1) % 4], b[(j + 1) % 4], b[j]))
    bm.faces.new(rings[0][::-1]); bm.faces.new(rings[-1])
    bm.normal_update()
    o = mesh_obj('Sleeper', bm, col, mat)
    bv = o.modifiers.new('bevel', 'BEVEL'); bv.width = 0.012; bv.segments = 3; bv.limit_method = 'ANGLE'
    return o


def build_fastening(col, mat_iron, mat_clip, mat_pad, mat_ins):
    """One rail seat: rail pad, two cast shoulders and two spring clips (e-clip type), centred at Y = 0."""
    parts = []
    # rail pad (black), under the rail foot
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=(0.18, 0.16, PAD), verts=bm.verts); bmesh.ops.translate(bm, vec=(0, 0, SLEEPER_TOP + PAD / 2), verts=bm.verts)
    parts.append(mesh_obj('Pad', bm, col, mat_pad))
    for s in (-1, 1):
        # cast shoulder: a rounded block standing proud of the sleeper top, beside the rail foot
        bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
        bmesh.ops.scale(bm, vec=(0.075, 0.045, 0.05), verts=bm.verts)
        bmesh.ops.translate(bm, vec=(0, s * (0.075 + 0.028), SLEEPER_TOP + 0.022), verts=bm.verts)
        o = mesh_obj('Shoulder', bm, col, mat_iron)
        b = o.modifiers.new('bevel', 'BEVEL'); b.width = 0.008; b.segments = 3
        parts.append(o)
        # insulator (nylon) between clip toe and rail foot
        bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
        bmesh.ops.scale(bm, vec=(0.05, 0.03, 0.012), verts=bm.verts)
        bmesh.ops.translate(bm, vec=(0, s * 0.066, SLEEPER_TOP + PAD + 0.016), verts=bm.verts)
        parts.append(mesh_obj('Insulator', bm, col, mat_ins))
        # spring clip: a bent 20 mm steel bar — leg into the shoulder, loop over, toe on the rail foot
        cu = bpy.data.curves.new('Clip', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = 0.0095; cu.bevel_resolution = 4
        sp = cu.splines.new('NURBS'); sp.order_u = 3; sp.use_endpoint_u = True
        y0, z0 = s * (0.075 + 0.028), SLEEPER_TOP + 0.03
        path = [(-0.07, y0 + s * 0.005, z0), (-0.02, y0 + s * 0.008, z0 + 0.004), (0.02, y0 + s * 0.02, z0 + 0.03), (0.035, y0, z0 + 0.045),
                (0.03, y0 - s * 0.025, z0 + 0.035), (0.015, y0 - s * 0.04, z0 + 0.012), (0.0, y0 - s * 0.045, z0 + 0.004),
                (-0.02, y0 - s * 0.035, z0 + 0.02), (-0.03, y0 - s * 0.012, z0 + 0.03), (-0.035, y0 + s * 0.008, z0 + 0.03)]
        sp.points.add(len(path) - 1)
        for p, c in zip(sp.points, path): p.co = (*c, 1)
        cu.splines[0].use_smooth = True; sp.resolution_u = 10
        o = bpy.data.objects.new('Clip', cu); o.data.materials.append(mat_clip); link(o, col)
        sub = cu  # curve smoothing via resolution
        cu.resolution_u = 8
        parts.append(o)
    return parts


def rock_variants(col, mat, n=16, seed=3):
    """Angular crushed granite: convex hulls of many jittered points, fractured planes kept sharp, then a subdivided,
    noise-displaced surface so faces are rough rather than plastic-flat."""
    from mathutils import noise
    rnd = random.Random(seed); objs = []
    for k in range(n):
        bm = bmesh.new()
        sx, sy, sz = 1.0 + rnd.random() * 0.5, 0.8 + rnd.random() * 0.3, 0.55 + rnd.random() * 0.3
        pts = []
        for _ in range(38):
            v = Vector((rnd.gauss(0, 1), rnd.gauss(0, 1), rnd.gauss(0, 1))).normalized() * (0.8 + 0.25 * rnd.random())
            pts.append(bm.verts.new((v.x * sx, v.y * sy, v.z * sz)))
        bmesh.ops.convex_hull(bm, input=pts)
        for v in [v for v in bm.verts if not v.link_faces]: bm.verts.remove(v)
        bmesh.ops.bevel(bm, geom=list(bm.edges), offset=0.025, segments=1, affect='EDGES')
        bmesh.ops.triangulate(bm, faces=bm.faces)
        bmesh.ops.subdivide_edges(bm, edges=list(bm.edges), cuts=2, use_grid_fill=True)
        off = Vector((rnd.random() * 100, rnd.random() * 100, rnd.random() * 100))
        for v in bm.verts:
            p = v.co * 3.0 + off
            v.co += v.normal * (0.035 * noise.noise(p) + 0.012 * noise.noise(p * 4.0))
        bm.normal_update()
        o = mesh_obj(f'Rock{k}', bm, col, mat)
        o.scale = (0.5, 0.5, 0.5)
        objs.append(o)
    return objs


# ── Geometry nodes scatter ────────────────────────────────────────────────────────────────────────────────
def scatter(target, inst_col, density, scale_min, scale_max, seed=0, rot_z_only=False, align_up=False, name='Scatter', max_tilt=math.pi):
    """Instance the objects of a collection over a mesh surface (Poisson-like random), random rotation and scale."""
    ng = bpy.data.node_groups.new(name, 'GeometryNodeTree')
    ng.interface.new_socket('Geometry', in_out='INPUT', socket_type='NodeSocketGeometry')
    ng.interface.new_socket('Geometry', in_out='OUTPUT', socket_type='NodeSocketGeometry')
    nd, ln = ng.nodes, ng.links
    gi, go = nd.new('NodeGroupInput'), nd.new('NodeGroupOutput')
    dist = nd.new('GeometryNodeDistributePointsOnFaces'); dist.distribute_method = 'RANDOM'
    dist.inputs['Density'].default_value = density; dist.inputs['Seed'].default_value = seed
    ci = nd.new('GeometryNodeCollectionInfo'); ci.inputs['Collection'].default_value = inst_col
    ci.inputs['Separate Children'].default_value = True; ci.inputs['Reset Children'].default_value = True
    iop = nd.new('GeometryNodeInstanceOnPoints'); iop.inputs['Pick Instance'].default_value = True
    def rand(dtype, lo, hi, sd):
        """Random Value node; picks the Min/Max/Value sockets matching the data type (indices vary by version)."""
        r = nd.new('FunctionNodeRandomValue'); r.data_type = dtype
        st = {'FLOAT': 'VALUE', 'INT': 'INT', 'FLOAT_VECTOR': 'VECTOR'}[dtype]
        [s_ for s_ in r.inputs if s_.name == 'Min' and s_.type == st][0].default_value = lo
        [s_ for s_ in r.inputs if s_.name == 'Max' and s_.type == st][0].default_value = hi
        r.inputs['Seed'].default_value = sd
        return [o for o in r.outputs if o.type == st][0]
    tilt = 0 if rot_z_only else max_tilt
    rv = rand('FLOAT_VECTOR', (0, 0, 0), (tilt, tilt, 2 * math.pi), seed + 7)
    rs = rand('FLOAT', scale_min, scale_max, seed + 13)
    ii = rand('INT', 0, 999, seed + 21)
    ln.new(gi.outputs[0], dist.inputs['Mesh'])
    ln.new(dist.outputs['Points'], iop.inputs['Points'])
    ln.new(ci.outputs[0], iop.inputs['Instance'])
    ln.new(rv, iop.inputs['Rotation'])
    ln.new(rs, iop.inputs['Scale'])
    ln.new(ii, iop.inputs['Instance Index'])
    ln.new(iop.outputs[0], go.inputs[0])
    mod = target.modifiers.new(name, 'NODES'); mod.node_group = ng
    return mod


# ── Track assembly ────────────────────────────────────────────────────────────────────────────────────────
def build_track(x0, x1, mats, rock_col, near=(None, None), far_density=180.0, near_density=1100.0, with_ballast=True):
    """Rails, sleepers with fastenings (linked duplicates) and a ballast bed with scattered stones from x0 to x1."""
    col = collection('Track')
    lib = collection('TrackLib', hidden=True)
    for s in (-1, 1):
        build_rail(f'Rail{s}', x1 - x0, s * RAIL_Y, col, mats['rail'], x0=x0, seg=5.0)
    sl = build_sleeper(lib, mats['concrete'])
    fast = []
    for s in (-1, 1):
        for p in build_fastening(lib, mats['iron'], mats['clip'], mats['pad'], mats['ins']):
            p.location.y += s * RAIL_Y; fast.append(p)
    # sleeper assembly collection, instanced along the track
    asm = collection('SleeperAsm', hidden=True)
    for o in [sl] + fast:
        lib.objects.unlink(o); asm.objects.link(o)
    n = int((x1 - x0) / SLEEPER_PITCH)
    for i in range(n):
        e = bpy.data.objects.new(f'S{i}', None); e.instance_type = 'COLLECTION'; e.instance_collection = asm
        e.location = (x0 + (i + 0.5) * SLEEPER_PITCH, 0, 0)
        link(e, col)
    if with_ballast:
        # ballast bed: crib level just under the sleeper top, shoulders sloping 1:1.5 down to the formation
        def bed(name, xa, xb, density, smin, smax, seed):
            bm = bmesh.new()
            prof = [(-3.1, -0.62), (-2.0, -0.055), (-1.32, -0.05), (1.32, -0.05), (2.0, -0.055), (3.1, -0.62)]
            nx = max(2, int((xb - xa) / 2.0))
            rows = [[bm.verts.new((xa + (xb - xa) * i / nx, y, z)) for y, z in prof] for i in range(nx + 1)]
            for a, b in zip(rows, rows[1:]):
                for j in range(len(prof) - 1): bm.faces.new((a[j], b[j], b[j + 1], a[j + 1]))
            o = mesh_obj(name, bm, col, mats['ballast_under'])
            scatter(o, rock_col, density, smin, smax, seed=seed, name=name + 'GN')
            return o
        xa, xb = near if near[0] is not None else (x0, x0)
        if xb > xa:
            bed('BallastNear', xa, xb, near_density, 0.03, 0.072, 1)
            fines = bed('BallastFines', xa, xb, near_density * 1.6, 0.012, 0.026, 9); fines.location.z -= 0.012
        if xa > x0: bed('BallastFarA', x0, xa, far_density, 0.045, 0.065, 2)
        if x1 > xb: bed('BallastFar', xb, x1, far_density, 0.045, 0.065, 3)
    return col


def build_catenary(x0, x1, mats, spacing=55.0, side=-1, mast_off=3.3, wire_h=5.6, system_h=1.2, start=10.0):
    """Masts (H-section), cantilever with insulators, messenger and contact wires with droppers."""
    col = collection('Catenary')
    xs = [x0 + start + i * spacing for i in range(int((x1 - x0 - start) / spacing) + 1)]
    cz = RAIL_TOP + wire_h
    for i, x in enumerate(xs):
        stagger = 0.2 * (1 if i % 2 else -1)  # contact wire zig-zag across the pantograph
        my = side * mast_off
        # H-section mast, 9 m, with a concrete foundation block
        for (sx, sy, sz, px, py, pz) in ((0.2, 0.012, 9.0, 0, -0.1, 4.5), (0.2, 0.012, 9.0, 0, 0.1, 4.5), (0.012, 0.2, 9.0, 0, 0, 4.5)):
            bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0); bmesh.ops.scale(bm, vec=(sx, sy, sz), verts=bm.verts)
            bmesh.ops.translate(bm, vec=(x + px, my + py, -0.6 + pz), verts=bm.verts)
            mesh_obj('Mast', bm, col, mats['galv'])
        bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0); bmesh.ops.scale(bm, vec=(0.7, 0.7, 0.5), verts=bm.verts)
        bmesh.ops.translate(bm, vec=(x, my, -0.45), verts=bm.verts); mesh_obj('Foundation', bm, col, mats['concrete'])
        # cantilever: upper (messenger) tube and lower (registration) tube, both to the track side
        def tube(a, b, r, mat, name='Tube'):
            cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = 3
            sp = cu.splines.new('POLY'); sp.points.add(1)
            sp.points[0].co = (*a, 1); sp.points[1].co = (*b, 1)
            o = bpy.data.objects.new(name, cu); cu.materials.append(mat); link(o, col); return o
        top = (x, my - side * 0.12, cz + system_h + 0.25)
        tube(top, (x, stagger, cz + system_h + 0.25), 0.03, mats['galv'])
        tube((x, my - side * 0.12, cz - 0.15), (x, stagger + side * 0.3, cz + 0.05), 0.026, mats['galv'])
        tube((x, -side * 0.0 + stagger * 0.5 + side * 0.9, cz + system_h + 0.25), (x, stagger + side * 0.3, cz + 0.05), 0.02, mats['galv'])
        # composite insulators near the mast (grey sheds)
        for zz in (cz + system_h + 0.25, cz - 0.1):
            for k in range(6):
                bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=16, radius1=0.055, radius2=0.055, depth=0.012)
                bmesh.ops.rotate(bm, verts=bm.verts, cent=(0, 0, 0), matrix=Matrix.Rotation(math.pi / 2, 3, 'X'))
                bmesh.ops.translate(bm, vec=(x, my - side * (0.2 + k * 0.045), zz), verts=bm.verts)
                mesh_obj('Shed', bm, col, mats['ins_shed'])
    # wires: messenger (catenary curve) and contact wire, with droppers every ~9 m
    for i in range(len(xs) - 1):
        xa, xb = xs[i], xs[i + 1]
        ya, yb = 0.2 * (1 if i % 2 else -1), 0.2 * (1 if (i + 1) % 2 else -1)
        def wire(points, r, mat):
            cu = bpy.data.curves.new('Wire', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = 2
            sp = cu.splines.new('POLY'); sp.points.add(len(points) - 1)
            for p, c in zip(sp.points, points): p.co = (*c, 1)
            o = bpy.data.objects.new('Wire', cu); cu.materials.append(mat); link(o, col)
        K = 12
        mess = [(lerp(xa, xb, k / K), lerp(ya, yb, k / K), cz + system_h + 0.25 - 0.9 * 4 * (k / K) * (1 - k / K)) for k in range(K + 1)]
        cont = [(lerp(xa, xb, k / K), lerp(ya, yb, k / K), cz) for k in range(K + 1)]
        wire(mess, 0.007, mats['copper']); wire(cont, 0.0065, mats['copper'])
        for k in range(1, 6):
            t = k / 6; xm = lerp(xa, xb, t); ym = lerp(ya, yb, t)
            wire([(xm, ym, cz), (xm, ym, cz + system_h + 0.25 - 0.9 * 4 * t * (1 - t))], 0.0025, mats['copper'])
    return col


def lerp(a, b, t):
    return a + (b - a) * t


# ── Camera ────────────────────────────────────────────────────────────────────────────────────────────────
def camera(sc, lens=35.0, sensor=36.0, dof=None, fstop=4.0, clip=(0.01, 5000.0)):
    cd = bpy.data.cameras.new('Cam'); cd.lens = lens; cd.sensor_width = sensor
    cd.clip_start, cd.clip_end = clip
    if dof is not None:
        cd.dof.use_dof = True; cd.dof.aperture_fstop = fstop
        if isinstance(dof, (int, float)): cd.dof.focus_distance = dof
        else: cd.dof.focus_object = dof
    o = bpy.data.objects.new('Cam', cd); link(o); sc.camera = o
    return o


def key_path(obj, frames, attr, values, interp='BEZIER', ease='AUTO'):
    for f, v in zip(frames, values):
        setattr(obj, attr, v); obj.keyframe_insert(attr, frame=f)
    ad = obj.animation_data
    if ad and ad.action:
        try:
            curves = ad.action.fcurves
        except AttributeError:  # Blender 5 layered actions
            curves = [fc for layer in ad.action.layers for strip in layer.strips for cb in strip.channelbags for fc in cb.fcurves]
        for fc in curves:
            for kp in fc.keyframe_points:
                kp.interpolation = interp


def look_at(obj, target):
    d = Vector(target) - obj.location
    obj.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()


# ── CLI: render a frame range or a still ─────────────────────────────────────────────────────────────────
def cli_render(sc, out_dir, default_frames):
    """--still F [--pct P] [--samples S]   or   --frames A-B [--step K]   (frames written as PNG sequence)"""
    argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
    opt = lambda k, d=None: argv[argv.index(k) + 1] if k in argv else d
    if opt('--pct'): sc.render.resolution_percentage = int(opt('--pct'))
    if opt('--samples'): sc.cycles.samples = int(opt('--samples'))
    os.makedirs(out_dir, exist_ok=True)
    if opt('--still'):
        for f in [int(v) for v in opt('--still').split(',')]:
            sc.frame_set(f)
            sc.render.filepath = os.path.join(out_dir, f'still_{f:04d}.png')
            t0 = __import__('time').time()
            bpy.ops.render.render(write_still=True)
            print('wrote', sc.render.filepath, f'{__import__("time").time() - t0:.1f}s', flush=True)
        return
    a, b = (int(v) for v in opt('--frames', default_frames).split('-'))
    step = int(opt('--step', 1))
    for f in range(a, b + 1, step):
        path = os.path.join(out_dir, f'f_{f:04d}.png')
        if os.path.exists(path) and '--force' not in argv:
            continue  # resumable: skip frames already rendered
        sc.frame_set(f)
        sc.render.filepath = path
        t0 = __import__('time').time()
        bpy.ops.render.render(write_still=True)
        print('frame', f, f'{__import__("time").time() - t0:.1f}s', flush=True)


# ── Vegetation and distant terrain ───────────────────────────────────────────────────────────────────────
def grass_clumps(col, mat, n=8, seed=5, height=(0.35, 0.8)):
    """Tufts of dry savanna grass: 20–40 thin tapered blades per clump, arching outwards (unit ~ real metres)."""
    rnd = random.Random(seed); out = []
    for k in range(n):
        bm = bmesh.new()
        for b in range(rnd.randint(22, 40)):
            h = rnd.uniform(*height); ang = rnd.uniform(0, 2 * math.pi); lean = rnd.uniform(0.15, 0.6)
            w = rnd.uniform(0.004, 0.008); seg = 5
            base = Vector((rnd.gauss(0, 0.03), rnd.gauss(0, 0.03), 0))
            d = Vector((math.cos(ang), math.sin(ang), 0)); side = Vector((-d.y, d.x, 0))
            prev = None
            for i in range(seg + 1):
                t = i / seg
                c = base + d * (lean * h * t * t) + Vector((0, 0, h * (t - 0.35 * lean * t * t)))
                ww = w * (1 - t * 0.92)
                pair = (bm.verts.new(c - side * ww), bm.verts.new(c + side * ww))
                if prev: bm.faces.new((prev[0], prev[1], pair[1], pair[0]))
                prev = pair
        o = mesh_obj(f'Grass{k}', bm, col, mat)
        out.append(o)
    return out


def acacia(col, bark, leaf, seed=1, height=7.0):
    """Umbrella thorn (Vachellia tortilis) form: forked leaning trunk, spreading branches, flat layered crown."""
    rnd = random.Random(seed)
    cu = bpy.data.curves.new('Trunk', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = 1.0; cu.bevel_resolution = 3
    cu.use_fill_caps = True
    def branch(p0, d, length, r0, depth):
        sp = cu.splines.new('POLY'); pts = [p0]; p = Vector(p0); dd = Vector(d).normalized()
        for i in range(4):
            dd = (dd + Vector((rnd.gauss(0, 0.25), rnd.gauss(0, 0.25), rnd.gauss(0.05, 0.1)))).normalized()
            p = p + dd * (length / 4); pts.append(p.copy())
        sp.points.add(len(pts) - 1)
        for i, (pt, q) in enumerate(zip(sp.points, pts)):
            pt.co = (*q, 1); pt.radius = r0 * (1 - 0.6 * i / (len(pts) - 1))
        tips = [pts[-1]]
        if depth > 0:
            for _ in range(rnd.randint(2, 3)):
                k = rnd.randint(2, 4)
                nd = Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), rnd.uniform(0.15, 0.6)))
                tips += branch(pts[k], nd, length * 0.7, r0 * 0.5, depth - 1)
        return tips
    tips = branch((0, 0, 0), (rnd.uniform(-0.2, 0.2), rnd.uniform(-0.2, 0.2), 1), height * 0.55, 0.22 * height / 7, 2)
    t = bpy.data.objects.new('AcaciaTrunk', cu); cu.materials.append(bark); link(t, col)
    # crown: many flattened leaf clusters around the branch tips, kept to a common flat top
    top = max(p.z for p in tips) + 0.3
    bm = bmesh.new()
    for p in tips:
        for _ in range(9):
            c = Vector((p.x + rnd.gauss(0, 0.9), p.y + rnd.gauss(0, 0.9), top - abs(rnd.gauss(0, 0.35))))
            r = rnd.uniform(0.45, 0.9)
            g = bmesh.ops.create_icosphere(bm, subdivisions=1, radius=r)
            for v in g['verts']:
                v.co.z *= 0.35
                v.co += c + Vector((rnd.gauss(0, 0.08), rnd.gauss(0, 0.08), rnd.gauss(0, 0.04)))
    crown = mesh_obj('AcaciaCrown', bm, col, leaf, smooth=True)
    return [t, crown]


def mat_leaf(hz=None):
    """Small-leaved acacia foliage: dusty olive green, light passing through at the crown edges."""
    m, n, out = new_mat('Leaf')
    geo = n.new('ShaderNodeNewGeometry')
    v = n.new('ShaderNodeTexVoronoi', Scale=9.0, Vector=geo.outputs['Position'])
    col = n.ramp(v.outputs['Distance'], [(0.0, srgb('#3e4a24')), (0.5, srgb('#55602f')), (1.0, srgb('#2c3519'))])
    b = n.new('ShaderNodeBsdfPrincipled', Roughness=0.7); n.link(col, b.inputs['Base Color'])
    tr = n.new('ShaderNodeBsdfTranslucent'); n.link(col, tr.inputs['Color'])
    mx = n.new('ShaderNodeMixShader'); mx.inputs[0].default_value = 0.25
    n.link(b.outputs[0], mx.inputs[1]); n.link(tr.outputs[0], mx.inputs[2])
    # break up the crown into leafy clumps (alpha from noise), so it never reads as a solid blob
    holes = n.new('ShaderNodeTexNoise', Scale=6.0, Detail=4.0, Vector=geo.outputs['Position'])
    a = n.math('GREATER_THAN', holes.outputs['Fac'], 0.47)
    tp = n.new('ShaderNodeBsdfTransparent'); mx2 = n.new('ShaderNodeMixShader')
    n.link(a, mx2.inputs[0]); n.link(tp.outputs[0], mx2.inputs[1]); n.link(mx.outputs[0], mx2.inputs[2])
    s = mx2.outputs[0]
    if hz: s = haze(n, s, *hz)
    n.link(s, out.inputs[0])
    return m


def hills(col, mat, x0, x1, y0, y1, base_z, amp, freq, seed=0, res=160):
    """A displaced terrain sheet for the middle and far distance (fbm noise; only used off-map, never on the 3D map)."""
    import random as _r
    bm = bmesh.new(); R = _r.Random(seed)
    offs = [(R.uniform(0, 1000), R.uniform(0, 1000)) for _ in range(5)]
    from mathutils import noise
    nx, ny = res, max(8, int(res * (y1 - y0) / (x1 - x0)))
    rows = []
    for j in range(ny + 1):
        row = []
        for i in range(nx + 1):
            x = lerp(x0, x1, i / nx); y = lerp(y0, y1, j / ny)
            h = 0; a = 1; f = freq
            for (ox, oy) in offs:
                h += a * noise.noise(Vector((x * f + ox, y * f + oy, 0))); a *= 0.5; f *= 2.0
            row.append(bm.verts.new((x, y, base_z + amp * max(-0.3, h))))
        rows.append(row)
    for a, b in zip(rows, rows[1:]):
        for i in range(nx): bm.faces.new((a[i], a[i + 1], b[i + 1], b[i]))
    return mesh_obj('Hills', bm, col, mat, smooth=True)
