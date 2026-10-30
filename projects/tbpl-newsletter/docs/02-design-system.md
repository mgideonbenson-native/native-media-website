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
