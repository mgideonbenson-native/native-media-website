# Tanzania SGR: fully CGI pipeline (proof of concept)

This is the photorealistic 3D rebuild of the SGR explainer. Everything on screen is generated:

- geometry built from dimensions and data;
- procedural physically based materials;
- a physical sky;
- simulated cameras.

There is no footage, no stock footage, no photographic background, no HDRI and no scanned texture. Typography and data overlays are composited 2D, in Poppins, with burnt orange `#E8752A` used only for route, markers and key labels.

The 2D motion-graphics film in `../sgr/` remains the published version on the website until this replaces it.

## Pipeline

| Stage | Tool | Files |
|---|---|---|
| Data: rail alignments | Overture Maps (OpenStreetMap-derived) transportation segments, read from S3 with pyarrow | `fetch_rail.py` → `data/rail.geojson`; `build_route.py` → `data/sgr_route.json` |
| Data: elevation | AWS Terrain Tiles (Terrarium; SRTM, GMTED2010, ETOPO1), zoom 8 (~600 m/px) | `fetch_dem.py` → `data/dem_country.npz` |
| Data: lakes, borders | Natural Earth (1:10m lakes, 1:50m countries) | `prep_geo.py`, `prep_borders.mjs` |
| Modelling, materials, lighting, animation | Blender 5.2 as a Python module (`pip install bpy`), Cycles path tracer | `lib.py`, `train.py`, `shot*.py` |
| Rendering | Cycles CPU here; GPU (OptiX/CUDA) recommended for the full film | `render_poc.sh` |
| Compositing, overlays, grain, encode | Pillow + NumPy + ffmpeg | `comp.py` |

**Why Blender and not Three.js.** The brief asks for photorealism over interactivity. Cycles gives physically based light transport: soft shadows, glossy reflections on rail heads, translucency in grass, depth of field and motion blur. A WebGL renderer can't match that in final-frame quality. The route visualisation also works well inside Blender, because the route is real geometry draped on the DEM. So a single framework is used, which keeps the lighting and look consistent.

Every shot is a deterministic script: the same command gives the same frames. Renders are resumable (finished frames are skipped).

```bash
# one-off data preparation (needs network to S3 / GitHub raw; outputs are small and committed except the DEM cache)
python fetch_rail.py && python build_route.py
python fetch_dem.py country
python prep_geo.py path/to/@geo-maps/earth-lakes-10m/map.geo.json && node prep_borders.mjs
# stills for look development
python shot1_track.py -- --still 40 --pct 50
# the proof of concept (PY = a Python with bpy 5.2)
PY=python ./render_poc.sh && python comp.py
```

## What is modelled

### Track
- 60E1-type rail profile at 1,435 mm gauge.
- B70-type concrete monoblock sleepers at 0.6 m spacing.
- Rail pads, cast shoulders, insulators and spring clips.
- Crushed-granite ballast (procedural angular stones, about 30–70 mm) scattered with Geometry Nodes, with a fines layer.
- Ballast shoulders at 1:1.5.

### Materials
- Rail head with a wheel-polished running band; mill scale and light rust elsewhere.
- Concrete with pores and laterite dust.
- Granite with per-stone colour and grain.
- Red laterite soil; dry-season grass with translucency.

### Electrification
- H-section galvanised masts every 55 m.
- Cantilevers and composite insulators.
- Messenger and contact wires with droppers and stagger, contact wire at 5.6 m.

### Landscape
- Umbrella-thorn acacias, leafless dry-season baobabs, granite kopjes.
- Distant hills with atmospheric perspective.

### Terrain model
- The real DEM as a 1.8-million-vertex mesh (1 unit = 1 km), with vertical exaggeration ×6, stated on screen.
- Lake surfaces at their DEM water level; sea at 0 m.
- Natural colouring by elevation and slope. This is representational, not mapped land cover.

### Route
- OSM alignments of the five SGR sections, merged and draped on the terrain.
- Built sections (Lots 1–2) shown as a solid line; under-construction sections (Lots 3–6) as a thinner line.
- Two data notes:
  - one OSM segment is named with a typo ("Makutopora - Isaka mm"), and `build_route.py` includes it by name;
  - Tabora–Kigoma is mapped in OSM only as far as about 30.74°E, so the line stops there.

### Train
- Eight-car EMU: modelled body section, lofted pointed nose with wraparound windscreen, glazing with pillars, plug doors, roof units, pantographs on the wire, underframe cases, deflector, bogies with turning wheelsets, gangway bellows.

## Open items before the full film

1. **Train livery and nose shape (blocking for accuracy).** No reference photographs of the TRC Hyundai Rotem EMUs could be retrieved in this environment. The proof of concept uses a neutral white body, black glazing and a grey underbody, and the on-screen caption says the livery is provisional. Send 3–5 photos (side, 3/4 front, nose close-up) and `LIVERY` / the nose loft in `train.py` will be matched to them.
2. **Station and structure detail.** Stations, platforms and bridges are not built yet. They are needed for the engineering chapter.
3. **Render time.** This environment has 4 CPU cores and no GPU, about 2 million rays per second. The proof of concept is therefore rendered at 1594×896 with 8–12 samples and denoising, then upscaled ×1.2 to 1080p (about 1–1.5 min per frame).
   - The full film should be rendered natively at 1920×1080 with 64–128 samples on a GPU.
   - Rough estimate: about 5–15 s per frame on one RTX 4090-class card, so about 5–15 hours for 3,600 frames.
   - On this machine it would take weeks.
   - `render_poc.sh` takes `PCT`, `S1`–`S3` overrides; set Cycles to GPU in `lib.setup_render`.
