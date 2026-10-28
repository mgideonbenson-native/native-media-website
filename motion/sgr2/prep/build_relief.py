"""
Shaded-relief layers for the v2 map from the real DEM (AWS Terrain Tiles: SRTM / GMTED2010 / ETOPO1, zoom 8).
    python build_relief.py   (needs ../sgr3d/data/dem_country.npz: run ../sgr3d/fetch_dem.py country first)
Writes assets/relief_base.jpg (whole region, subdued), assets/relief_tz.webp (Tanzania only, cream relief with
contours, transparent outside the border) and assets/relief_meta.json (bounds and size).
"""
import json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(HERE, '..', 'assets')
d = np.load(os.path.join(HERE, '..', '..', 'sgr3d', 'data', 'dem_country.npz'))
h = d['h'].astype(np.float32)
W_, E_, N_, S_ = (float(d[k]) for k in ('west', 'east', 'north', 'south'))
SCALE = 0.8                                        # 2560x2816 → 2048x2253 output pixels
out_w, out_h = int(h.shape[1] * SCALE), int(h.shape[0] * SCALE)
h = np.asarray(Image.fromarray(h).resize((out_w, out_h), Image.BILINEAR))
land = h > 0.5
px_m = 611.5 / SCALE                                # metres per output pixel (zoom 8 at the equator)


def blur(a, sigma):
    """Separable Gaussian blur for float arrays (Pillow only blurs 8-bit images)."""
    r = max(1, int(3 * sigma)); k = np.exp(-0.5 * (np.arange(-r, r + 1) / sigma) ** 2); k /= k.sum()
    a = np.apply_along_axis(lambda v: np.convolve(np.pad(v, r, mode='edge'), k, 'valid'), 1, a)
    return np.apply_along_axis(lambda v: np.convolve(np.pad(v, r, mode='edge'), k, 'valid'), 0, a)


def hillshade(z, az, alt, zf):
    gy, gx = np.gradient(z * zf, px_m)
    slope = np.arctan(np.hypot(gx, gy)); aspect = np.arctan2(-gx, gy)
    a, al = math.radians(az), math.radians(alt)
    return np.clip(np.sin(al) * np.cos(slope) + np.cos(al) * np.sin(slope) * np.cos(a - aspect), 0, 1)


z = np.where(land, h, 0)
zs = blur(z, 0.8)
# multi-directional hillshade (NW key light + softer fills), vertical exaggeration 4 for legibility at this scale
hs = 0.6 * hillshade(zs, 315, 40, 4) + 0.25 * hillshade(zs, 270, 45, 4) + 0.15 * hillshade(zs, 0, 50, 4)
hs = (hs - hs.mean()) / (hs.std() + 1e-6) * 0.16 + 0.82

# Tanzania mask (from the vector border, same projection) — written by vectors.mjs? no: rasterise here from world-atlas via a small export
merc = lambda lat: math.asinh(math.tan(math.radians(lat)))
mN, mS = merc(N_), merc(S_)
P = lambda lon, lat: ((lon - W_) / (E_ - W_) * out_w, (mN - merc(lat)) / (mN - mS) * out_h)
tz_rings = json.load(open(os.path.join(HERE, 'tz_rings.json')))
mask_img = Image.new('L', (out_w, out_h), 0); dr = ImageDraw.Draw(mask_img)
for ring in tz_rings: dr.polygon([P(*c) for c in ring], fill=255)
# lakes are recorded as raised surfaces in the DEM: cut them out as water using Natural Earth lake polygons
lk = Image.new('L', (out_w, out_h), 0); dl = ImageDraw.Draw(lk)
for g in json.load(open(os.path.join(HERE, '..', '..', 'sgr3d', 'data', 'lakes.json'))):
    for poly in ([g['coordinates']] if g['type'] == 'Polygon' else g['coordinates']):
        dl.polygon([P(*c) for c in poly[0]], fill=255)
land = land & (np.asarray(lk) < 128)
tz = (np.asarray(mask_img) > 127) & land

def lerp_ramp(v, stops):
    v = np.clip(v, stops[0][0], stops[-1][0]); out = np.zeros(v.shape + (3,), np.float32)
    for (a, ca), (b, cb) in zip(stops, stops[1:]):
        m = (v >= a) & (v <= b); t = ((v - a) / (b - a))[m][:, None]
        out[m] = np.array(ca) * (1 - t) + np.array(cb) * t
    return out

hexc = lambda s: [int(s[i:i + 2], 16) for i in (1, 3, 5)]
# base: charcoal neighbours with faint relief, near-black water
base = lerp_ramp(h, [(0, hexc('#34322f')), (1500, hexc('#3b3935')), (5000, hexc('#4a4743'))]) * hs[..., None] * 0.92
water = np.array(hexc('#141516'), np.float32)
img = np.where(land[..., None], base, water)
# water-lining: three soft rings off every shore
dist_img = Image.fromarray((land * 255).astype(np.uint8))
for r, a in ((3, 0.10), (7, 0.06), (13, 0.035)):
    ring = np.asarray(dist_img.filter(ImageFilter.MaxFilter(2 * r + 1))).astype(np.float32) / 255 - land
    ring = np.asarray(Image.fromarray((ring * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32) / 255
    img = img + (~land)[..., None] * ring[..., None] * a * 255 * np.array([0.55, 0.55, 0.52])
Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(os.path.join(A, 'relief_base.jpg'), quality=88)

# Tanzania: warm cream hypsometric tint × hillshade, contours every 250 m (index every 1000 m)
tint = lerp_ramp(h, [(0, hexc('#efe7d6')), (400, hexc('#e9dfca')), (1000, hexc('#dfd2b8')), (1600, hexc('#d2c3a5')),
                     (2400, hexc('#c4b496')), (4000, hexc('#b3a58c')), (5800, hexc('#f4f1ea'))])
tzimg = tint * (0.55 + 0.45 * hs[..., None] / hs.max()) * 1.12
hc = blur(h, 1.6)
def contour(step):
    q = np.floor(hc / step)
    e = (q != np.roll(q, 1, 0)) | (q != np.roll(q, 1, 1))
    return e & tz & (hc > step * 0.5)
c250, c1000 = contour(250), contour(1000)
cl = np.asarray(Image.fromarray((c250 * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.45))).astype(np.float32) / 255
ci = np.asarray(Image.fromarray((c1000 * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))).astype(np.float32) / 255
tzimg = tzimg * (1 - 0.16 * cl[..., None]) * (1 - 0.22 * ci[..., None])
alpha = np.asarray(Image.fromarray((tz * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6)))
rgba = np.dstack([np.clip(tzimg, 0, 255).astype(np.uint8), alpha])
Image.fromarray(rgba, 'RGBA').save(os.path.join(A, 'relief_tz.webp'), quality=90, method=6)
# soft contact shadow for the raised Tanzania layer (composited beneath it, offset by the camera tilt)
sh = np.asarray(Image.fromarray((tz * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(14))).astype(np.float32) * 0.75
Image.fromarray(np.dstack([np.zeros((out_h, out_w, 3), np.uint8), sh.astype(np.uint8)]), 'RGBA').save(os.path.join(A, 'relief_tz_shadow.webp'), quality=80)
json.dump({'west': W_, 'east': E_, 'north': N_, 'south': S_, 'width': out_w, 'height': out_h,
           'source': 'AWS Terrain Tiles (Terrarium): SRTM, GMTED2010, ETOPO1; zoom 8',
           'note': 'hillshade vertical exaggeration x4'}, open(os.path.join(A, 'relief_meta.json'), 'w'))
print('relief', out_w, out_h)
