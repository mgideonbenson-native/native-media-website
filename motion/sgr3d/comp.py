"""
Composite the proof-of-concept: upscale the rendered plates to 1920x1080, cross-dissolve the three shots, draw the
editorial overlays (Poppins; burnt orange used only for the route, markers, key labels), add fine grain, and encode.

    python comp.py            → out/comp/c_####.png and out/sgr-cgi-poc.mp4
Overlay positions come from the camera projections each shot script exports (trackline / labels / anchor JSON).
"""
import json, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'out')
W, H, SS = 1920, 1080, 2                       # overlays drawn at 2x and downsampled for clean anti-aliasing
ORANGE, CREAM, WHITE, GREY, CHAR = (232, 117, 42), (239, 231, 214), (255, 255, 255), (154, 152, 146), (22, 22, 21)
F = lambda w, s: ImageFont.truetype(os.path.join(HERE, 'fonts', f'Poppins-{w}.ttf'), s * SS)

# timeline (output frame numbers, 30 fps)
S1 = (1, 105)          # shot 1 frames 1..105
S2_START = 97          # shot 2 frame 1 lands here (9-frame dissolve)
S3_START = 205         # shot 3 frame 1 lands here (12-frame dissolve)
LAST = S3_START + 120 - 1

track = json.load(open(os.path.join(OUT, 'shot1', 'trackline.json')))
labels = json.load(open(os.path.join(OUT, 'shot2', 'labels.json')))['frames']
anchor = json.load(open(os.path.join(OUT, 'shot3', 'anchor.json')))


def plate(shot, f):
    im = Image.open(os.path.join(OUT, f'shot{shot}', f'f_{f:04d}.png')).convert('RGB')
    return im.resize((W, H), Image.LANCZOS) if im.size != (W, H) else im


def ramp(o, a, b):
    return float(np.clip((o - a) / max(1, b - a), 0, 1))


def ease(p):
    return p * p * (3 - 2 * p)


def text(d, xy, s, font, fill, alpha=1.0, anchor='la', track=0):
    if alpha <= 0: return
    x, y = xy[0] * SS, xy[1] * SS
    col = (*fill, int(255 * alpha))
    if track:
        for ch in s:
            d.text((x, y), ch, font=font, fill=col, anchor=anchor); x += d.textlength(ch, font=font) + track * SS
    else:
        d.text((x, y), s, font=font, fill=col, anchor=anchor)


def shadowed(layer, draw_fn, blur=6, strength=0.55):
    """Draw editorial text with a soft dark halo so it stays legible on any part of the image."""
    sh = Image.new('RGBA', layer.size, (0, 0, 0, 0)); draw_fn(ImageDraw.Draw(sh), shadow=True)
    a = sh.split()[3].filter(ImageFilter.GaussianBlur(blur * SS)).point(lambda v: int(v * strength))
    dark = Image.new('RGBA', layer.size, (*CHAR, 0)); dark.putalpha(a)
    layer.alpha_composite(dark); draw_fn(ImageDraw.Draw(layer), shadow=False)


def overlay(o):
    L = Image.new('RGBA', (W * SS, H * SS), (0, 0, 0, 0))
    d = ImageDraw.Draw(L)
    # ── shot 1: kicker, then the orange line lighting up along the real track ──
    if o <= 105:
        a = ease(ramp(o, 12, 24)) * (1 - ease(ramp(o, 70, 80)))
        if a > 0:
            def k(dd, shadow):
                if not shadow: dd.rectangle([120 * SS, 112 * SS, 168 * SS, 116 * SS], fill=(*ORANGE, int(255 * a)))
                text(dd, (120, 128), 'STANDARD GAUGE', F('SemiBold', 22), ORANGE if not shadow else CHAR, a, track=4)
                text(dd, (120, 160), '1,435 mm between the rails', F('Medium', 36), WHITE if not shadow else CHAR, a)
            shadowed(L, k)
        a = ease(ramp(o, 84, 100))
        pts = track.get(str(o))
        if a > 0 and pts and len(pts) > 1:
            xy = [(x * W * SS, y * H * SS) for x, y in pts]
            glow = Image.new('RGBA', L.size, (0, 0, 0, 0)); gd = ImageDraw.Draw(glow)
            gd.line(xy, fill=(*ORANGE, int(200 * a)), width=26 * SS, joint='curve')
            L.alpha_composite(glow.filter(ImageFilter.GaussianBlur(14 * SS)))
            d.line(xy, fill=(*ORANGE, int(245 * a)), width=7 * SS, joint='curve')
    # ── shot 2: station markers, title, legend, source note ──
    s2 = o - S2_START + 1
    if 1 <= s2 <= 120 and o < S3_START + 12:
        out_a = 1 - ease(ramp(o, S3_START, S3_START + 10))
        show = {'Dar es Salaam': 48, 'Morogoro': 52, 'Dodoma': 58, 'Tabora': 72, 'Isaka': 84, 'Mwanza': 92}
        row = labels[str(s2)]
        for name, f0 in show.items():
            a = ease(ramp(s2, f0, f0 + 8)) * out_a
            x, y, z = row[name]
            if a <= 0 or z <= 0 or not (0.02 < x < 0.98 and 0.04 < y < 0.96): continue
            px, py = x * W, y * H
            r = 7
            d.ellipse([(px - r - 2.5) * SS, (py - r - 2.5) * SS, (px + r + 2.5) * SS, (py + r + 2.5) * SS], fill=(*CREAM, int(235 * a)))
            d.ellipse([(px - r) * SS, (py - r) * SS, (px + r) * SS, (py + r) * SS], fill=(*ORANGE, int(255 * a)))
            right = name not in ('Dar es Salaam',)
            def lab(dd, shadow, name=name, px=px, py=py, a=a, right=right):
                text(dd, (px + (16 if right else -16), py - 1), name, F('SemiBold', 25), CHAR if shadow else WHITE, a, anchor='lm' if right else 'rm')
            shadowed(L, lab, blur=5, strength=0.7)
        a = ease(ramp(s2, 62, 74)) * out_a
        if a > 0:
            def title(dd, shadow):
                if not shadow: dd.rectangle([120 * SS, 112 * SS, 168 * SS, 116 * SS], fill=(*ORANGE, int(255 * a)))
                text(dd, (120, 128), 'THE SGR CORRIDOR', F('SemiBold', 22), CHAR if shadow else ORANGE, a, track=4)
                text(dd, (120, 160), 'Phase one: Dar es Salaam – Mwanza', F('Medium', 36), CHAR if shadow else WHITE, a)
            shadowed(L, title)
            def legend(dd, shadow):
                y0 = H - 150
                if not shadow:
                    dd.line([(120 * SS, y0 * SS), (176 * SS, y0 * SS)], fill=(*ORANGE, int(255 * a)), width=7 * SS)
                    dd.line([(120 * SS, (y0 + 40) * SS), (176 * SS, (y0 + 40) * SS)], fill=(*ORANGE, int(150 * a)), width=4 * SS)
                text(dd, (194, y0 - 1), 'Built · Dar es Salaam – Makutupora', F('Medium', 22), CHAR if shadow else WHITE, a, anchor='lm')
                text(dd, (194, y0 + 39), 'Under construction', F('Medium', 22), CHAR if shadow else CREAM, a, anchor='lm')
            shadowed(L, legend)
            def note(dd, shadow):
                text(dd, (W - 120, H - 92), 'Terrain: SRTM / GMTED2010 via AWS Terrain Tiles, elevation ×6', F('Regular', 17), CHAR if shadow else CREAM, a * 0.85, anchor='ra')
                text(dd, (W - 120, H - 68), 'Route: OpenStreetMap contributors (via Overture Maps)', F('Regular', 17), CHAR if shadow else CREAM, a * 0.85, anchor='ra')
            shadowed(L, note, blur=4, strength=0.6)
    # ── shot 3: annotation anchored to the train's nose ──
    s3 = o - S3_START + 1
    if s3 >= 1:
        a = ease(ramp(s3, 24, 34)) * (1 - ease(ramp(o, LAST - 10, LAST)))
        ax, ay = anchor[str(s3)]
        px, py = ax * W, ay * H
        if a > 0:
            lx, ly = min(px + 70, W - 560), max(py - 190, 150)
            grow = ease(ramp(s3, 24, 32))
            ex, ey = px + (lx - px) * grow, py + (ly + 30 - py) * grow
            d.ellipse([(px - 6) * SS, (py - 6) * SS, (px + 6) * SS, (py + 6) * SS], fill=(*ORANGE, int(255 * a)))
            d.line([(px * SS, py * SS), (ex * SS, ey * SS)], fill=(*ORANGE, int(255 * a)), width=3 * SS)
            if grow > 0.95:
                d.line([(lx * SS, (ly + 30) * SS), ((lx + 26) * SS, (ly + 30) * SS)], fill=(*ORANGE, int(255 * a)), width=3 * SS)
                ta = a * ease(ramp(s3, 30, 38))
                def ann(dd, shadow):
                    text(dd, (lx + 40, ly + 30), 'Dar es Salaam – Dodoma', F('SemiBold', 34), CHAR if shadow else WHITE, ta, anchor='lb')
                    text(dd, (lx + 40, ly + 38), 'Electric passenger service since 2024', F('Regular', 24), CHAR if shadow else CREAM, ta, anchor='lt')
                shadowed(L, ann)
        ca = ease(ramp(s3, 10, 20)) * (1 - ease(ramp(o, LAST - 10, LAST)))
        def cap(dd, shadow):
            text(dd, (W - 120, H - 68), 'Computer-generated. Train livery provisional.', F('Regular', 17), CHAR if shadow else GREY, ca, anchor='ra')
        if ca > 0: shadowed(L, cap, blur=4, strength=0.6)
    return L.resize((W, H), Image.LANCZOS)


def frame(o):
    base = None
    if o <= S1[1]:
        base = plate(1, o)
    s2 = o - S2_START + 1
    if 1 <= s2 <= 120:
        p2 = plate(2, s2)
        base = p2 if base is None else Image.blend(base, p2, ease(ramp(o, S2_START - 1, S1[1])))
    s3 = o - S3_START + 1
    if 1 <= s3 <= 120:
        p3 = plate(3, s3)
        base = p3 if base is None or s2 > 120 else Image.blend(base, p3, ease(ramp(o, S3_START - 1, S3_START + 12)))
    im = base.convert('RGBA'); im.alpha_composite(overlay(o))
    a = np.asarray(im.convert('RGB')).astype(np.float32)
    rng = np.random.default_rng(o)
    a += rng.normal(0, 2.2, a.shape[:2])[..., None]          # fine luminance grain, unifies the three plates
    yy, xx = np.mgrid[0:H, 0:W]
    v = 1 - 0.18 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) ** 1.4
    a *= v[..., None]
    if o > LAST - 10: a *= 1 - ease(ramp(o, LAST - 10, LAST))
    if o < 8: a *= ease(ramp(o, 0, 8))
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


if __name__ == '__main__':
    cd = os.path.join(OUT, 'comp'); os.makedirs(cd, exist_ok=True)
    only = [int(v) for v in sys.argv[1].split(',')] if len(sys.argv) > 1 else range(1, LAST + 1)
    for o in only:
        frame(o).save(os.path.join(cd, f'c_{o:04d}.png'))
    if len(sys.argv) == 1:
        mp4 = os.path.join(OUT, 'sgr-cgi-poc.mp4')
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', '30', '-i', os.path.join(cd, 'c_%04d.png'),
                        '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4], check=True)
        print(mp4, LAST, 'frames')
