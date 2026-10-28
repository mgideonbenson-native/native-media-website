# Tanzania SGR, version 2: dimensional editorial motion graphic

Two minutes, 1280 × 720, 30 fps. The film is built entirely in the browser:

- SVG for geometry, illustrations and charts;
- CSS 3D transforms for the tilted, layered map and its camera;
- a small amount of JavaScript to drive one deterministic timeline.

There is no footage, no Blender, no WebGL and no 3D engine. It runs on ordinary hardware: a full render takes minutes on a laptop CPU.

## Pipeline

| Step | Command | Output |
|---|---|---|
| DEM (once) | `python ../sgr3d/fetch_dem.py country` | `../sgr3d/data/dem_country.npz` (AWS Terrain Tiles, zoom 8; not committed) |
| Rail alignments (once) | `python ../sgr3d/fetch_rail.py && python ../sgr3d/build_route.py` | `../sgr3d/data/sgr_route.json` (OpenStreetMap via Overture; committed) |
| Relief layers | `node prep/tz_rings.mjs && python prep/build_relief.py` | `assets/relief_base.jpg`, `relief_tz.webp`, `relief_tz_shadow.webp` |
| Vector layers | `node prep/vectors.mjs` | `assets/vectors.json` (route sections, borders, stations, labels) |
| Preview | `node render.mjs --serve` | open `…/motion/sgr2/index.html?t=30` |
| Stills / contact sheet | `node render.mjs --stills 5,30` · `--sheet 0,118,4` | `out/` |
| Film | `node render.mjs --video && python audio.py && bash encode.sh` | `public/media/motion/tanzania-sgr-v2-*` |

Python steps need NumPy and Pillow. Rendering uses the Playwright Chromium already on the machine. The only project dependencies used are `world-atlas`, `topojson-client` and `d3-geo`, which are already in `package.json`.

`renderFrame(t)` is deterministic: there are no CSS transitions or timers, and every frame resets its UI state before the scenes draw. Any frame can be rendered on its own and reproduces exactly.

## Design system

### Colour
| Role | Value |
|---|---|
| Route, markers, key numbers, short labels | Burnt orange `#E8752A` |
| Backgrounds and panels | Charcoal `#161615`, near-black `#0b0b0a` |
| Tanzania relief and supporting text | Cream `#efe7d6` / `#d9cfbb` |
| Titles | White |
| Secondary labels and source notes | Greys `#8e8c86` / `#5e5c57` |

The physical illustrations (track, train) use restrained natural material tones.

### Type
Poppins (`motion/fonts`, OFL licence).

| Element | Style |
|---|---|
| Kicker | 13 px SemiBold, tracked capitals, orange, with a 44 px rule |
| Title | 46–58 px SemiBold |
| Sub | 19 px Regular, cream |
| Numbers | SemiBold, tabular figures |
| Labels | 15 px Medium |
| Notes | 12 px Regular, grey |

Safe margin is 64 px.

### Depth (used only where it explains something)
- **Map.** The map is a CSS 3D plane: tilted 30–38°, with a perspective camera of centre, scale and gentle rotation. Tanzania's relief layer floats above the regional base and casts a soft shadow, so the country reads as an object. Labels stay in screen space so they never foreshorten.
- **Illustrations.** Engineering drawings use a tiny orbit-camera projector (`lib/solid.js`) with one key light from the front-left and painter's sorting. Every face is a flat-shaded SVG polygon.

### Status grammar
The same grammar applies on the map, in the legend and on the tags.

| Status | Line |
|---|---|
| Operating | Solid orange, heavy |
| Built, not yet in service | Solid orange, light |
| Under construction | Dashed orange |
| Proposed | Dotted cream |
| Indicative connector (no published alignment) | Fine dots, and said so on screen |

Data tags use the same logic: ACTUAL and TIMETABLE are solid, REPORTED is grey, FORECAST and ORDERED are outlined.

## Components (`lib/components.js`)
- **Models:**
  - `track()`: 60E1-type rail profile, B70-type sleepers at 0.6 m, fastenings, ballast prism, formation. Layer filter `only`, gauge parameter.
  - `mast()` and `wires()`: mast, cantilever, messenger and contact wires with droppers, optional current pulse.
  - `train()`: eight-car EMU with lofted pointed nose, windscreen, glazing, plug doors, skirt, underframe, bogies.
- **Map:** `ROUTE_STYLE` (status grammar).
- **UI:** `sectionTitle()`, `callout()`, `counter()`, `barChart()` (one zero-based shared scale, reported ranges hatched, forecasts outlined), `legend()`, `sourceNote()`.

## Story and transitions

| Time | Scene | Transition out |
|---|---|---|
| 0:00–0:12 | Perspective track at dusk; title and question | The camera rises to top-down, the centreline lights orange and **the rails become the route line** on the map (Dar es Salaam–Morogoro) |
| 0:12–0:39 | Corridor map: operating, built and under-construction sections draw in order; cards; 1,219 km counter; legend | The camera pushes into Morogoro and **the route resolves into a track model** |
| 0:39–0:47 | Track layers: exploded view with callouts | The camera pulls back along the line |
| 0:47–0:56 | 25 kV overhead line, train arriving under the wire, design speeds | Pull-back to the full unit |
| 0:56–1:02 | Fleet (ordered) | Swing to end-on view |
| 1:02–1:08 | Gauge: rails slide from 1,000 to 1,435 mm | **The dimension line becomes the chart axis** |
| 1:08–1:32 | Journey time · passengers · freight | Back to the map |
| 1:32–1:48 | **The Dar es Salaam station marker expands into a data panel** (port); regional links | Pull-back |
| 1:48–2:00 | **The route map returns** with all sections; closing lines; sources | — |

## Data registry (all values in `content.js`)

| Figure | Value | Period | Status | Source | Why it matters (on screen) |
|---|---|---|---|---|---|
| Phase one corridor | 1,219 km | — | Plan | TRC via The Project Herald; Xinhua | Scale of the project |
| Passenger service start | June 2024 (Morogoro), 25 July 2024 (Dodoma) | — | Actual | TanzaniaInvest, Railway Gazette | What is open |
| Freight service start | June 2025 | — | Actual | The Citizen | — |
| Gauge | 1,435 mm vs 1,000 mm | — | Fact | Standards | Wider, heavier, faster track |
| Electrification | 25 kV AC overhead | — | Fact | Railway Journal | Electric, not diesel |
| Design speeds | 160 / 120 km/h | — | Design maximum, not average | Railway Journal | Capability, not service speed |
| Fleet | 10 EMUs (eight cars), 17 locomotives, 59 coaches; 1,430 wagons contracted | — | **Ordered** (full delivery not confirmed) | Railway Journal, Daily News, Railway Technology | — |
| Bus journey | 8–10 h | 2024 reports | Reported range (drawn hatched) | The Citizen | Commercial hub ↔ capital |
| Fastest train | 3 h 15 min | Timetable from 3 Jan 2026 | Timetable | TRC via Daily News | — |
| Passenger journeys | about 5.5 million | June 2024–March 2026 | Reported | Ministry of Transport (The Citizen, 2 Oct 2026) | Use |
| Passenger growth | 2.05 m → 2.51 m (+22.4%) | Jul–Mar, 2024/25 vs 2025/26 | Actual | Ministry of Transport | Same nine months, a year apart |
| Freight carried | 102,452 t | July 2025–March 2026 (9 months) | Actual | Ministry of Transport | The real test |
| Freight forecast | 500,000 t | FY 2025/26 (12 months) | Forecast | TRC projection | Periods differ, stated on screen |
| Port transit cargo | 10.93 million t | July 2025–March 2026 | Reported | Tanzania Ports Authority | Why rail to the interior matters |
| Burundi link | Uvinza–Musongati | Launched Aug 2025, target 2030 | Construction launched; **alignment indicative** | The EastAfrican, The Chanzo | Regional reach |
| Rwanda link | Isaka–Kigali | — | Proposed; **alignment indicative** | KT Press, TanzaniaInvest | Regional reach |

**Not used** (contradictory or undated):
- "over seven million passengers";
- "6.85 million passengers, January–September 2026" (conflicts with ministry series);
- total network length;
- total project cost;
- the Mwanza opening date.

## Geography: what is real
- **Relief.** The real DEM (SRTM, GMTED2010, ETOPO1), with a multi-directional hillshade (stated ×4 exaggeration in the shading only) and 250 m and 1,000 m contours inside Tanzania. Lakes are cut out with Natural Earth polygons.
- **Route.** OSM alignments for every SGR section drawn as a solid or dashed line. The passenger section is split at Dodoma, where scheduled trains end. OSM's Tabora–Kigoma mapping ends near 30.7°E. The rest of that line, and the Burundi and Rwanda links, are drawn only as fine indicative dotted connectors and labelled as such.
- **Stations.** City locations snapped to the OSM alignment. Makutupora is the end of the OSM-mapped Lot 2.

## Limitations
- **The train is a plausible eight-car EMU, not a verified likeness.** No reference photographs could be retrieved in this environment, so livery and nose shape are neutral. Send photos and adjust `train()` / colours in `lib/components.js`.
- **The engineering illustrations are schematic.** Proportions are realistic, but they are not engineering drawings, and the on-screen notes say so.
- **No narration was recorded.** The film works muted. The v1 narration script (`../sgr/PRODUCTION.md`) can be adapted to this cut.
