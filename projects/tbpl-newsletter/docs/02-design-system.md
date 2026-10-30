# Phase 2: Editorial design system

The recommended direction is **A, Documentary Ledger**. The alternatives (B, Laboratory Report; C, Signal) are on `prototypes/directions.html`.

## Principles
1. **Reporting, not promotion.** Photography and facts lead; decoration does not.
2. **One idea per figure.** A chart only appears where a comparison exists. Single numbers become numerals, not charts.
3. **Show the uncertainty.** The source's own qualifiers ("approximately", "nearly") are printed on the graphic. Approximate values get a pale cap, and calculated values are labelled *calculated*.
4. **Colour has a job.** Blue is TBPL and institutional data, green is biology/products, yellow is highlight only (never text on paper), and deep blue is used for emphasis.

## Tokens (`src/styles/tokens.css`)
| Role | Value |
|---|---|
| Brand blue / yellow / green | `#066AB5` / `#FDC902` / `#009236` (sampled; F18) |
| Deep blue (masthead, emphasis) | `#0B3A5F` |
| Paper / sidebar | `#F7F4EE` / `#EEE8DC` |
| Ink / secondary / meta | `#17212B` / `#49545F` / `#7B848C` |
| Rules | `#CEC6B6` hairline, ink 0.35 mm for structure |

**Type** (all SIL Open Font Licence, bundled in `src/assets/fonts/`)
| Use | Face | Size |
|---|---|---|
| Masthead | Fraunces 650, opsz 144 | 126 pt |
| Headlines | Fraunces 600, opsz 96 | 27–33 pt |
| Numerals | Fraunces 600, opsz 144, lining figures | 20–43 pt |
| Standfirst | Source Serif 4 | 12–13 pt |
| Body | Source Serif 4, opsz 10, hyphenated | 9.4/13.4 pt |
| Subheads, labels, captions, charts | Schibsted Grotesk | 6.6–10.4 pt |

The minimum printed size is 6 pt (folios and credits); QA fails anything smaller.

**Grid.** A4 trim (210 × 297 mm) with a 12-column grid and a 4.5 mm gutter. Margins: 13 mm top, 15 mm bottom, 16 mm inner, 13 mm outer. Body text runs 3-up (features) or 2-up (field reports with a 4-column rail). For press, add 3 mm bleed: the source PDF is already A4 + 3 mm.

## Page templates
| # | Template | Built | Key components |
|---|---|---|---|
| 1 | Cover and contents | Cover ✓ | Masthead, edition bar, lead photo, lead line, hero numeral, cover lines, contacts + QR |
| 2 | Editorial message | Phase 5 | Portrait, letter in 2 columns, signature, pull quote |
| 3 | Data and performance feature | ✓ (3 pp.) | Opener with hero chart; photo page; "The figures" page with stat tiles, part-to-whole bar, map, unit chart |
| 4 | Long-form feature | Phase 5 | Variant of 3 without the data page; drop cap, pull quotes |
| 5 | Field report / engagement | ✓ (spread) | Bleed photo, caption + credit, field-notes box, locator map, process rail |
| 6 | Scientific and product explainer | Phase 5 | Process diagram (larvae-stage control, El Niño article), product comparison (Thurisave, Bactivec, Griselesf, Fosforina, Dimargon) |
| 7 | Back cover | Phase 5 | Contacts, QR, brand gradient retained from Issue 001 |

## Components (`src/js/`)
- `body`: threaded text frames. Every frame with the same `data-ref` is one story, filled in order and split between paragraphs at word level. Headings never strand at a frame foot. Any leftover text is reported as **overset** by QA.
- `text`: binds any element to a path in the content file (headlines, standfirsts, captions).
- `salesBars`, `salesSplit`, `councilDots`, `regionalMap`, `locator`, `process`: SVG graphics drawn from `TBPL_ISSUE.stats`.
- Review layer: `?review` in the URL highlights flagged source text, adds status chips (Reported / Approximate / Projected / Quoted / Derived / Draft) and lists the flags on the page.

## Editorial-integrity rules built into the system
- Source text is kept verbatim in `content/issue-001.js`. Errors are flagged, never silently corrected.
- New copy (kickers, standfirsts, captions) lives in `new*` / `draft*` fields and shows as *Draft* in review mode.
- Captions never identify people the source does not identify. Every draft caption ends "to confirm".
- Cover lines are verbatim source headlines. Page numbers refer to the original folios until final pagination.

## Asset rules (decided 30 Oct 2026: no originals, no vectors, no exact annual figures)
The photos are the images embedded in the source PDF, extracted at full embedded resolution. Screenshots would hold fewer pixels, not more. Every placement is sized to the image:

| Photo | Pixels | Max width at 200 ppi (target) | Max at 150 ppi (floor) | Allowed uses |
|---|---|---|---|---|
| Kibaha laboratory | 3271 | 415 mm | 554 mm | Anything, including a full-bleed spread |
| Radio One broadcast | 2194 | 279 mm | 372 mm | Full-bleed page |
| Morogoro handover (×2) | ~1680 | 212 mm | 282 mm | Full page width; full-bleed page acceptable |
| Performance presenter | 1558 | 198 mm | 264 mm | Page width |
| Liuka mine | 1404 | 178 mm | 238 mm | Full-bleed acceptable (≈170 ppi) |
| Nanenane, Dodoma | 1319 | 168 mm | 223 mm | Up to page width |
| Tanga, Embassy, Morogoro group | ~1050 | ~135 mm | ~180 mm | Two-thirds width at most |
| Audience thumbnails | ~320 | 40 mm | 54 mm | Small strip only, or omit |
| Editor portrait | 385 | 49 mm | 65 mm | Small portrait only |

- QA (`npm run render`) fails any image placed below **150 ppi** and reports anything below 200 ppi.
- Photos are not AI-upscaled or retouched beyond neutral exposure and colour correction. Upscaling invents detail, which a documentary publication should not do.
- **Logo:** use the extracted raster as supplied. Do not redraw, trace or recolour it. Keep it 30 mm wide or less (about 290 ppi) on a light background.
- **Annual sales:** publish as approximate with the source's qualifiers. Show no growth multiples or year-on-year percentages.
