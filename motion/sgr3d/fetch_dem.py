"""
Download a digital elevation model from AWS Terrain Tiles (Terrarium encoding; sources include SRTM, GMTED2010 and
ETOPO1; see https://registry.opendata.aws/terrain-tiles/) and stitch it into a float32 array in metres.

    python fetch_dem.py country          → data/dem_country.npz  (zoom 8, ~600 m/px, lon 28.5..41.0, lat -12.6..0.6)
    python fetch_dem.py local LON LAT KM → data/dem_local.npz    (zoom 12, ~38 m/px square patch, for close-ups)

Each .npz holds `h` (metres, rows north→south) and the lon/lat bounds of the stitched tiles (Web Mercator rows).
"""
import io, math, os, sys, urllib.request
import numpy as np
from PIL import Image

URL = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
HERE = os.path.dirname(__file__)


def tile_xy(lon, lat, z):
    n = 2 ** z
    x = (lon + 180) / 360 * n
    y = (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
    return x, y


def tile_lonlat(x, y, z):
    n = 2 ** z
    return x / n * 360 - 180, math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / n))))


def fetch(z, x, y):
    cache = os.path.join(HERE, 'data', 'tiles', f'{z}-{x}-{y}.png')
    if not os.path.exists(cache):
        os.makedirs(os.path.dirname(cache), exist_ok=True)
        with urllib.request.urlopen(URL.format(z=z, x=x, y=y), timeout=60) as r:
            open(cache, 'wb').write(r.read())
    a = np.asarray(Image.open(cache).convert('RGB'), dtype=np.float32)
    return a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768


def stitch(z, w, s, e, n, out):
    x0, y0 = (int(v) for v in tile_xy(w, n, z))
    x1, y1 = (int(v) for v in tile_xy(e, s, z))
    rows = [np.hstack([fetch(z, x, y) for x in range(x0, x1 + 1)]) for y in range(y0, y1 + 1)]
    h = np.vstack(rows)
    W, N = tile_lonlat(x0, y0, z)
    E, S = tile_lonlat(x1 + 1, y1 + 1, z)
    np.savez_compressed(out, h=h.astype(np.float32), west=W, east=E, north=N, south=S, zoom=z)
    print(out, h.shape, f'lon {W:.3f}..{E:.3f} lat {S:.3f}..{N:.3f}', f'h {h.min():.0f}..{h.max():.0f} m')


if __name__ == '__main__':
    if sys.argv[1] == 'country':
        stitch(8, 28.5, -12.6, 41.0, 0.6, os.path.join(HERE, 'data', 'dem_country.npz'))
    else:
        lon, lat, km = map(float, sys.argv[2:5])
        d = km / 2 / 111.0
        stitch(12, lon - d, lat - d, lon + d, lat + d, os.path.join(HERE, 'data', 'dem_local.npz'))
