# TBPL Newsletter: Issue 001 redesign

Redesign of the *Tanzania Biotech Products Limited Newsletter*, Issue 001 (October 2026), as a data-led editorial publication.
The project is built with HTML, CSS, SVG and JavaScript, and rendered to PDF with Playwright.

**Status: Phases 1–7 complete. The online edition is `out/TBPL-Newsletter-Issue-001-October-2026.pdf` (20 pages). See `docs/03-production-notes.md` for decisions, the corrections log and QA results.**

## Review
| What | Where |
|---|---|
| **Final online PDF** | `out/TBPL-Newsletter-Issue-001-October-2026.pdf` |
| Full issue source (open in a browser) | `issue/issue-001.html` (add `?review` for review mode) |
| Production notes, corrections log, QA | `docs/03-production-notes.md` |
| Review hub | `prototypes/index.html` |
| Content audit, statistics register, flags | `docs/01-content-audit.md` |
| Design system and templates | `docs/02-design-system.md` |
| Three visual directions | `prototypes/directions.html` · `out/previews/directions-board.png` |
| Prototype pages | `prototypes/cover.html`, `data-feature.html`, `field-report.html` |
| Editorial review mode | add `?review` to any prototype URL |
| Print PDF of prototypes | `out/TBPL-Newsletter-001-prototypes.pdf` |
| QA report (overset, trim, image ppi, fonts) | `out/qa-report.json` |

## Build
```bash
cd projects/tbpl-newsletter
npm install            # Playwright + map tooling (once)
npm run maps           # regenerate East Africa map paths (only if places change)
npm run render         # QA + PNG previews + PDFs into out/
npm run qa             # checks only
npm run verify         # confirms all article text is verbatim from the source PDF
```
The pages also open directly from disk (no server). Fonts are bundled, so rendering works offline.

## Structure
```
content/issue-001.js     all text, statistics (with status), flags; the single source of truth
src/styles/              tokens.css · base.css (page, grid, type) · components.css
src/js/components.js     text binding, threaded body frames, review layer
src/js/charts.js         SVG data graphics
src/assets/              photos and brand assets extracted from the source PDF, fonts (OFL), map paths
prototypes/              Phase 3 template prototypes and direction board
issue/issue-001.html     the full 20-page issue
scripts/render.mjs       Playwright QA + export
scripts/verify-text.mjs  verbatim-text check against the source PDF
source/                  the original PDF (authoritative)
```
