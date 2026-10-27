"""
Electric multiple unit for the SGR film, modelled from documented facts: eight cars, streamlined pointed ends
("Treni Zilizochongoka"), 160 km/h class, standard gauge. Dimensions are typical for this class
(car body ~3.2 m wide, roof ~3.85 m above rail, 0.86 m wheels).

LIVERY IS NOT VERIFIED: a neutral white body, black glazing band and grey underbody are used until reference
photographs of the TRC units are supplied (see PRODUCTION.md). Change LIVERY below to match.
"""
import math
import bpy, bmesh
from mathutils import Vector, Matrix
import lib
from lib import srgb, RAIL_TOP

LIVERY = {'body': '#e7e8e6', 'skirt': '#4c5054', 'glass': '#0d1013', 'stripe': None}
CAR_L, NOSE_L, GAP = 24.0, 7.0, 0.9
HALF = [(1.42, 0.78), (1.56, 0.98), (1.60, 1.25), (1.60, 2.45), (1.575, 2.85), (1.49, 3.22), (1.32, 3.52),
        (0.95, 3.73), (0.48, 3.83), (0.0, 3.86)]


def _catmull(pts, n=4):
    """Upsample a polyline with Catmull-Rom so the body section is smooth without a subdivision modifier."""
    out = []
    for i in range(len(pts) - 1):
        p0, p1, p2, p3 = pts[max(i - 1, 0)], pts[i], pts[i + 1], pts[min(i + 2, len(pts) - 1)]
        for k in range(n):
            t = k / n
            out.append(tuple(0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t * t
                                    + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t ** 3) for j in (0, 1)))
    out.append(pts[-1])
    return out


def profile():
    """Closed body cross-section (y, z above rail top): right half bottom→roof, then mirrored back down."""
    half = _catmull(HALF, 4)
    return half + [(-y, z) for y, z in reversed(half[:-1])]


def mat_body():
    """Car body: painted aluminium with clear coat; window band with pillars; door outlines; grey skirt."""
    m, n, out = lib.new_mat('TrainBody')
    tc = n.new('ShaderNodeTexCoord'); sep = n.new('ShaderNodeSeparateXYZ', Vector=tc.outputs['Object'])
    x, z = sep.outputs['X'], sep.outputs['Z']
    win_band = n.math('MULTIPLY', n.math('GREATER_THAN', z, 2.08), n.math('LESS_THAN', z, 2.86))
    # pillars every 1.95 m; rounded window corners approximated by a soft pillar edge
    phase = n.math('FRACT', n.math('DIVIDE', x, 1.95))
    pillar = n.math('LESS_THAN', phase, 0.11)
    attr = n.new('ShaderNodeAttribute'); attr.attribute_name = 'glazed'   # 1 on glazed body parts, 0 on nose/ends
    win = n.math('MULTIPLY', n.math('MULTIPLY', win_band, n.math('SUBTRACT', 1.0, pillar)), attr.outputs['Fac'])
    # plug doors at 25 % and 75 % of the car: 1.3 m wide, grooves around them, door window
    dl = n.new('ShaderNodeAttribute'); dl.attribute_name = 'doorx'   # local x of the nearest door centre
    dx = n.math('ABSOLUTE', n.math('SUBTRACT', x, dl.outputs['Fac']))
    in_door = n.math('MULTIPLY', n.math('LESS_THAN', dx, 0.66), n.math('LESS_THAN', z, 3.0))
    groove = n.math('MULTIPLY', n.math('MULTIPLY', n.math('LESS_THAN', dx, 0.67), n.math('GREATER_THAN', dx, 0.645)), n.math('LESS_THAN', z, 3.01))
    groove = n.math('MAXIMUM', groove, n.math('MULTIPLY', n.math('LESS_THAN', dx, 0.67), n.math('MULTIPLY', n.math('GREATER_THAN', z, 2.985), n.math('LESS_THAN', z, 3.01))))
    groove = n.math('MULTIPLY', groove, attr.outputs['Fac'])
    dt = n.new('ShaderNodeAttribute'); dt.attribute_name = 'dtip'
    # body-end panel seams 0.35 m from each gangway end (not on the nose)
    seam = n.math('LESS_THAN', n.math('ABSOLUTE', n.math('SUBTRACT', n.math('ABSOLUTE', n.math('SUBTRACT', x, 12.0)), 11.65)), 0.012)
    groove = n.math('MAXIMUM', groove, n.math('MULTIPLY', n.math('MULTIPLY', seam, n.math('GREATER_THAN', z, 1.05)), n.math('GREATER_THAN', dt.outputs['Fac'], 7.5)))
    door_win = n.math('MULTIPLY', n.math('MULTIPLY', n.math('LESS_THAN', dx, 0.4), n.math('MULTIPLY', n.math('GREATER_THAN', z, 2.1), n.math('LESS_THAN', z, 2.8))), attr.outputs['Fac'])
    win = n.math('MAXIMUM', n.math('MULTIPLY', win, n.math('SUBTRACT', 1.0, in_door)), door_win)
    skirt = n.math('LESS_THAN', z, 1.02)
    col = lib.srgb(LIVERY['body'])
    roof = n.math('GREATER_THAN', z, 3.45 + 0.186)
    c0 = n.mix(n.math('MULTIPLY', roof, 0.6), col, srgb('#a9aba9'))
    gutter = n.math('MULTIPLY', n.math('GREATER_THAN', z, 3.40 + 0.186), n.math('LESS_THAN', z, 3.43 + 0.186))
    c0 = n.mix(gutter, c0, srgb('#6d706f'))
    c1 = n.mix(skirt, c0, srgb(LIVERY['skirt']))
    c2 = n.mix(groove, c1, srgb('#202224'))
    paint = n.new('ShaderNodeBsdfPrincipled', Roughness=0.38)
    n.link(c2, paint.inputs['Base Color'])
    paint.inputs['Coat Weight'].default_value = 0.35; paint.inputs['Coat Roughness'].default_value = 0.12
    dirt = n.new('ShaderNodeTexNoise', Scale=1.5, Detail=4.0, Vector=tc.outputs['Object'])
    # a little road dust low on the body (laterite), more towards the skirt
    lowd = n.math('MULTIPLY', n.math('SUBTRACT', 1.0, n.math('MULTIPLY', n.math('SUBTRACT', z, 0.8), 0.9), clamp=True), n.math('MULTIPLY', dirt.outputs['Fac'], 0.5))
    pc = n.mix(lowd, c2, srgb('#9b7a5c'))
    n.link(pc, paint.inputs['Base Color'])
    glass = n.new('ShaderNodeBsdfPrincipled', Roughness=0.02, Metallic=0.0, IOR=1.52)
    glass.inputs['Base Color'].default_value = srgb(LIVERY['glass'])
    glass.inputs['Coat Weight'].default_value = 1.0
    yy = n.math('ABSOLUTE', n.new('ShaderNodeSeparateXYZ', Vector=tc.outputs['Object']).outputs['Y'])
    # headlamps: two horizontal ovals low on the nose (distance from tip ~1.0 m, 1.55 m above rail, 0.68 m off-centre)
    du = n.math('DIVIDE', n.math('SUBTRACT', dt.outputs['Fac'], 1.0), 0.32)
    dz = n.math('DIVIDE', n.math('SUBTRACT', z, 1.56 + 0.186), 0.075)
    dy = n.math('DIVIDE', n.math('SUBTRACT', yy, 0.68), 0.22)
    r2 = n.math('ADD', n.math('ADD', n.math('MULTIPLY', dz, dz), n.math('MULTIPLY', dy, dy)), n.math('MULTIPLY', du, du))
    lamp = n.math('LESS_THAN', r2, 1.0)
    wsa = n.new('ShaderNodeAttribute'); wsa.attribute_name = 'ws'
    win = n.math('MAXIMUM', win, n.math('GREATER_THAN', wsa.outputs['Fac'], 0.5))
    mx = n.new('ShaderNodeMixShader'); n.link(win, mx.inputs[0]); n.link(paint.outputs[0], mx.inputs[1]); n.link(glass.outputs[0], mx.inputs[2])
    em = n.new('ShaderNodeEmission', Strength=12.0); em.inputs['Color'].default_value = srgb('#fff1dc')
    mx2 = n.new('ShaderNodeMixShader'); n.link(lamp, mx2.inputs[0]); n.link(mx.outputs[0], mx2.inputs[1]); n.link(em.outputs[0], mx2.inputs[2])
    n.link(mx2.outputs[0], out.inputs[0])
    return m


def mat_nose_glass():
    m, n, out = lib.new_mat('Windscreen')
    g = n.new('ShaderNodeBsdfPrincipled', Roughness=0.015, IOR=1.52); g.inputs['Base Color'].default_value = srgb('#0b0e11')
    g.inputs['Coat Weight'].default_value = 1.0
    n.link(g.outputs[0], out.inputs[0])
    return m


def mat_lamp(color='#fff2dc', strength=60.0):
    m, n, out = lib.new_mat('Lamp')
    e = n.new('ShaderNodeEmission', Color=srgb(color), Strength=strength)
    n.link(e.outputs[0], out.inputs[0])
    return m


def _set_attr(me, name, values):
    a = me.attributes.new(name, 'FLOAT', 'POINT'); a.data.foreach_set('value', values)


def body_mesh(name, length, nose_front=False, nose_back=False, mat=None):
    """Car body: the section extruded with a ring every 0.5 m; a nose end is lofted from sections that narrow in plan
    and sweep down in elevation to a rounded point. Point attributes drive the shader: glazed (side windows allowed),
    doorx (nearest door centre), ws (windscreen), d_tip (distance from the nose tip)."""
    prof = profile(); k = len(prof)
    zb, zt = 0.78, 3.86
    secs = []   # (x, sw, bottom, top, d_tip)
    def nose(d):            # d = distance from the tip, 0..NOSE_L
        t = min(1.0, d / NOSE_L)
        sw = max(0.10, (1 - (1 - t) ** 2.4) ** 0.55)
        top = 1.30 + (zt - 1.30) * (1 - (1 - t) ** 2.0) ** 0.75
        bottom = zb + 0.32 * (1 - t) ** 3
        return sw, bottom, top
    xs = [i * 0.5 for i in range(int(length / 0.5) + 1)]
    if xs[-1] < length: xs.append(length)
    dense = [NOSE_L * (i / 40) ** 1.5 for i in range(1, 41)]
    if nose_front: xs = [x for x in xs if x < length - NOSE_L] + [length - d for d in reversed(dense)]
    if nose_back: xs = list(dense) + [x for x in xs if x > NOSE_L]
    if not nose_back: xs = [0.0, 0.04] + [x for x in xs if x > 0.04]
    if not nose_front: xs = [x for x in xs if x < length - 0.04] + [length - 0.04, length]
    for x in sorted(set(round(v, 4) for v in xs)):
        d_tip = (length - x) if nose_front else (x if nose_back else 99.0)
        if nose_front and nose_back: d_tip = min(length - x, x)
        if d_tip < NOSE_L: sw, b, t = nose(d_tip)
        else: sw, b, t = 1.0, zb, zt
        secs.append((x, sw, b, t, d_tip))
    bm = bmesh.new(); rings = []; vattr = []
    for x, sw, b, t, d in secs:
        ring = []
        for y, z in prof:
            zz = b + (z - zb) * (t - b) / (zt - zb)
            ring.append(bm.verts.new((x, y * sw, RAIL_TOP + zz)))
            vattr.append((d, y, z))
        rings.append(ring)
    for a, c in zip(rings, rings[1:]):
        for j in range(k):
            bm.faces.new((a[j], a[(j + 1) % k], c[(j + 1) % k], c[j]))
    # end caps: flat gangway ends; a nose tip closes on a centre point
    for ring, is_tip in ((rings[0], nose_back), (rings[-1], nose_front)):
        if is_tip:
            cen = bm.verts.new(sum((v.co for v in ring), Vector()) / len(ring)); vattr.append((0.0, 0.0, 1.5))
            for j in range(k): bm.faces.new((ring[j], ring[(j + 1) % k], cen) if ring is rings[-1] else (ring[(j + 1) % k], ring[j], cen))
        else:
            bm.faces.new(ring[::-1] if ring is rings[0] else ring)
    bm.normal_update()
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    co = [v.co for v in me.vertices]
    x0 = NOSE_L + 0.5 if nose_back else 0.7
    x1 = length - NOSE_L - 0.5 if nose_front else length - 0.7
    _set_attr(me, 'glazed', [1.0 if x0 < c.x < x1 else 0.0 for c in co])
    doors = [length * 0.25, length * 0.75]
    if nose_front: doors = [length * 0.16, length * 0.58]
    if nose_back: doors = [length * 0.42, length * 0.84]
    _set_attr(me, 'doorx', [min(doors, key=lambda dd: abs(dd - c.x)) for c in co])
    # windscreen: upper part of the nose between 1.9 m and 4.6 m from the tip
    _set_attr(me, 'ws', [1.0 if (1.9 < d < 4.6 and z > 2.55 - (4.6 - d) * 0.12 and abs(y) < 1.47) else 0.0 for d, y, z in vattr])
    _set_attr(me, 'dtip', [min(d, 20.0) for d, y, z in vattr])
    for p in me.polygons: p.use_smooth = True
    o = bpy.data.objects.new(name, me)
    if mat: me.materials.append(mat)
    return o


def box(name, size, loc, mat, col, bevel=0.0):
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0); bmesh.ops.scale(bm, vec=size, verts=bm.verts)
    bmesh.ops.translate(bm, vec=loc, verts=bm.verts)
    o = lib.mesh_obj(name, bm, col, mat)
    if bevel:
        b = o.modifiers.new('bevel', 'BEVEL'); b.width = bevel; b.segments = 2
    return o


def cylinder(name, r, depth, loc, axis, mat, col, seg=32):
    bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r, radius2=r, depth=depth)
    if axis == 'Y': bmesh.ops.rotate(bm, verts=bm.verts, cent=(0, 0, 0), matrix=Matrix.Rotation(math.pi / 2, 3, 'X'))
    if axis == 'X': bmesh.ops.rotate(bm, verts=bm.verts, cent=(0, 0, 0), matrix=Matrix.Rotation(math.pi / 2, 3, 'Y'))
    bmesh.ops.translate(bm, vec=loc, verts=bm.verts)
    o = lib.mesh_obj(name, bm, col, mat, smooth=True)
    return o


def build_train(n_cars=8, mats=None, col=None):
    """Returns (root empty, list of wheelsets for rotation, total length). Train faces +X; root at the nose tip."""
    col = col or lib.collection('Train')
    m_body = mat_body(); m_glass = mat_nose_glass(); m_lamp = mat_lamp()
    m_dark = lib.mat_simple('Underframe', '#26282a', 0.6, 0.3)
    m_steel = lib.mat_simple('WheelSteel', '#5d5e5f', 0.35, 1.0)
    m_rubber = lib.mat_simple('Bellows', '#141414', 0.7)
    m_panto = lib.mat_simple('Pantograph', '#7d8186', 0.4, 0.8)
    m_roof = lib.mat_simple('RoofEquip', '#b9bbbb', 0.45, 0.2)
    root = bpy.data.objects.new('TrainRoot', None); lib.link(root, col)
    wheels = []
    x = 0.0  # cars are placed backwards from the nose (x decreasing)
    for c in range(n_cars):
        lead, tail = c == 0, c == n_cars - 1
        L = CAR_L + (1.2 if (lead or tail) else 0)
        x1 = x; x0 = x - L
        car = body_mesh(f'Car{c}', L, nose_front=lead, nose_back=tail, mat=m_body)
        lib.link(car, col); car.location.x = x0; car.parent = root
        # underframe equipment between the bogies, gangway bellows, roof fairings
        import random as _r
        rr = _r.Random(c * 7 + 1)
        ex = x0 + 5.2
        while ex < x1 - 5.4:   # underframe equipment cases of varying size, with gaps between them
            w = rr.uniform(1.2, 3.4); h = rr.uniform(0.38, 0.6)
            box('Equip', (w, rr.uniform(2.0, 2.5), h), (ex + w / 2, 0, RAIL_TOP + 1.0 - h / 2 - 0.05), m_dark, col, 0.015).parent = root
            ex += w + rr.uniform(0.25, 0.7)
        sx0 = x0 + (NOSE_L + 0.5 if tail else 0.6); sx1 = x1 - (NOSE_L + 0.5 if lead else 0.6)
        box('Skirt', (sx1 - sx0, 2.9, 0.06), ((sx0 + sx1) / 2, 0, RAIL_TOP + 0.98), m_dark, col).parent = root
        if lead or tail:   # obstacle deflector under the nose
            s_ = 1 if lead else -1; tx = x1 if lead else x0
            box('Deflector', (1.6, 2.2, 0.35), (tx - s_ * 1.6, 0, RAIL_TOP + 0.55), m_dark, col, 0.08).parent = root
        if not tail:
            box('Bellows', (GAP + 0.1, 2.6, 2.9), (x0 - GAP / 2, 0, RAIL_TOP + 2.35), m_rubber, col).parent = root
        for k in range(2):
            box('RoofUnit', (3.2, 1.7, 0.32), (x0 + L * (0.3 + 0.4 * k), 0, RAIL_TOP + 3.92), m_roof, col, 0.12).parent = root
        # bogies: frame, two wheelsets each
        for bx in (x0 + 3.2 + (1.0 if tail else 0), x1 - 3.2 - (1.0 if lead else 0)):
            box('BogieFrame', (3.1, 2.2, 0.32), (bx, 0, RAIL_TOP + 0.62), m_dark, col, 0.03).parent = root
            for wx in (bx - 1.25, bx + 1.25):
                ws = bpy.data.objects.new('Wheelset', None); lib.link(ws, col); ws.location = (wx, 0, RAIL_TOP + 0.43); ws.parent = root
                for yy in (-0.78, 0.78):
                    w = cylinder('Wheel', 0.43, 0.13, (0, yy, 0), 'Y', m_steel, col, seg=40); w.parent = ws
                    cylinder('Disc', 0.33, 0.05, (0, yy * 0.62, 0), 'Y', m_dark, col, seg=24).parent = ws
                    cylinder('Axlebox', 0.12, 0.25, (0, yy * 1.32, 0), 'Y', m_dark, col, seg=16).parent = ws
                cylinder('Axle', 0.08, 1.9, (0, 0, 0), 'Y', m_steel, col, seg=16).parent = ws
                wheels.append(ws)
        # pantographs on the second and seventh cars, raised to the contact wire (5.6 m above rail)
        if c in (1, n_cars - 2):
            px = x0 + L * 0.5; base = RAIL_TOP + 3.95; head = RAIL_TOP + 5.6
            def rod(a, b, r=0.035):
                cu = bpy.data.curves.new('Rod', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = 2
                sp = cu.splines.new('POLY'); sp.points.add(1); sp.points[0].co = (*a, 1); sp.points[1].co = (*b, 1)
                o = bpy.data.objects.new('Rod', cu); cu.materials.append(m_panto); lib.link(o, col); o.parent = root
            for yy in (-0.35, 0.35):
                rod((px - 0.9, yy, base), (px + 0.7, yy * 0.6, base + 0.95))
                rod((px + 0.7, yy * 0.6, base + 0.95), (px - 0.1, yy * 0.3, head - 0.08), 0.03)
            rod((px - 0.15, -0.95, head - 0.04), (px - 0.15, 0.95, head - 0.04), 0.04)
            box('PantoBase', (1.6, 1.0, 0.12), (px - 0.4, 0, base - 0.02), m_dark, col).parent = root
        x = x0 - GAP
    return root, wheels, -x
