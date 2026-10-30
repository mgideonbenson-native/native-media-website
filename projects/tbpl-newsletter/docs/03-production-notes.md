# Phases 5–7: Production notes, TBPL Newsletter Issue 001

**Output:** `out/TBPL-Newsletter-Issue-001-October-2026-editor-review.pdf`. This is the **editor-review edition**: anything with an error or a missing label prints as a yellow **EDITOR** placeholder (client instruction, 30 October 2026). The checklist of all placeholders, by page, is in `out/editor-placeholders.md`.

## Placeholder rule
- **Errors** (contradictions, misspellings, inconsistent names) are *replaced* by a placeholder that quotes the source text. Examples: the "2026/2027 financial year" versus "by June 2026" conflict, the "Distribution network expands" subhead (councils fell from 178 to 149), product-name variants, "Product"/"Products" Limited, "Magazine", "Mohamed"/"Mohammed", and three misspellings.
- **Missing labels** keep their text and gain a placeholder where the label belongs. These cover photo credits and the names of people pictured, event dates, the Liuka byline and ending, the Nanenane quote attribution, the malaria-figure source, the 751,870-litre period, the domestic/export period, and the Morogoro quantities.
- **To publish:** resolve each placeholder in `content/issue-001.js` (or the page file), re-render until `out/editor-placeholders.md` lists none, then set `meta.editorPlaceholders` to `false`.

The issue itself is: 20 pages, A4, RGB, about 5.9 MB, tagged for accessibility, with 38 bookmarks and live links (contents, cover lines, cross-references, email and website).
**Source:** `issue/issue-001.html`, built from `content/issue-001.js` in Direction A (Documentary Ledger).

## Client decisions (30 October 2026)
| Item | Decision | Applied as |
|---|---|---|
| Visual direction | A, Documentary Ledger, adapted to the available assets | Whole issue |
| Embassy (F1) | **Embassy of Canada** | Headline and contents corrected; original kept in `articles.embassy.sourceTitle` |
| Annual sales (F3) | No exact figures exist | Shown as approximate with the source's qualifiers; neutral note that they do not sum exactly to the total |
| Liuka article (F13) | No further text, byline or date exist | Placeholders for byline, date and ending |
| Event dates (F22) | Unavailable | Date placeholder in each dateline or fact box |
| Photo captions (F16) | No caption sheet exists | Context caption (place and event) plus a placeholder for names and photo credit |
| Originals and vectors (F17, F18) | Unavailable | Extracted assets used within the size rules; logo used as supplied, never redrawn |
| Output | Online PDF | 150 ppi floor; RGB; links and bookmarks |
| Errors and missing labels | Placeholders for editors' review | 57 placeholders on 19 pages; see `out/editor-placeholders.md` |

## Corrections log
Corrections are marked in the content file as `[[ID|original=>fix]]`. Approved corrections always apply. Proposed ones apply only when `meta.applyProposedCorrections` is set to `true`. Review mode shows every correction.

| ID | Where | Source text | Corrected to | Status |
|---|---|---|---|---|
| F1 | Embassy headline, contents | "…to the Denmark Embassy: …" | "…to the Embassy of Canada: …" | **Approved, applied** |
| F13 | Liuka, last sentence | "…strengthening preventive public health" | Placeholder: ending to be supplied | Awaiting editors |
| F15 | Performance, p. 5 | "commitee" | "committee" | Placeholder, awaiting editors |
| F15 | Morogoro, p. 8 | "equipment's" | "equipment" | Placeholder, awaiting editors |
| F15 | El Niño headline and text | "El Nino" | "El Niño" | Placeholder, awaiting editors |

Spelling variants under flags F9–F12 (product names, "Product"/"Products", "Magazine", "Mohamed"/"Mohammed") also print as placeholders until editors confirm them.

## New copy written by the editors
These are shown as *New copy* in review mode:
- **Kickers and section labels:** for example, "Field report · Morogoro Region".
- **Standfirsts:** on the Performance, Liuka, Tanga, Njombe and El Niño articles. Each one restates facts from its own article.
- **Photo captions:** place and event only.
- **Chart titles and notes, the contents-page map, and "About the figures".**
- **Explainers built from the issue's own statements:**
  - the Liuka assessment steps
  - the Embassy visit in three parts
  - the product table
  - the Fosforina and Dimargon timeline
  - the El Niño rain-to-larvae chain
- **Pull quotes:** each one is a verbatim extract.

## Pagination
| Page | Content | Template |
|---|---|---|
| 1 | Cover | 1 Cover |
| 2 | Contents, story map, editorial board | 1 Contents |
| 3 | Message from the Editor | 2 Editorial |
| 4–6 | Performance: opener with annual-sales chart, photo page, "The figures" | 3 Data feature |
| 7–8 | Morogoro handover | 4 Opener + continuation |
| 9 | Nanenane, Dodoma | 4 Single-page opener |
| 10–11 | New Liuka Gold Mine | 5 Field report |
| 12–13 | Embassy of Canada, with the product table | 4 + 6 Explainer |
| 14–15 | World Food Day, Tanga, with intended crops and the bio-fertiliser timeline | 4 + 6 Explainer |
| 16–17 | Njombe councillors in Kibaha, with route map | 5 Field report |
| 18–19 | El Niño and malaria control, with the rain-to-larvae chain | 4 + 6 Explainer |
| 20 | Back cover | 7 Back cover |

## Phase 6 quality check: results
| Check | Tool | Result |
|---|---|---|
| Text fits its frames (no overset) | `npm run render` | 0 issues on 20 pages |
| Nothing outside the page or off-trim | `npm run render` | 0 issues |
| Screen layout equals PDF layout (210 × 297 mm) | `npm run render` | Pass on all pages |
| Missing content slots | `npm run render` | 0 |
| Text smaller than 6 pt | `npm run render` | 0 |
| Console or script errors, failed assets | `npm run render` | 0 |
| **Text is verbatim from the source** | `npm run verify` | **117 of 117 passages match** (corrections checked in their original form) |
| Fallback fonts in the PDF | `pdffonts` | None; all faces embedded |
| Image resolution (150 ppi floor) | `npm run render` | All pass; lowest is Tanga at 151 ppi |

Placed image resolution in the final issue:

| Image | Placed size | ppi |
|---|---|---|
| Radio One broadcast | 181 × 104 mm | 308 |
| Kibaha laboratory | 210 × 203 mm | 274 |
| Editor portrait | 44 × 42 mm | 222 |
| Performance presenter | 181 × 98 mm | 219 |
| Morogoro handover | 181 × 124 mm | 212 |
| Embassy visit | 104 × 84 mm | 198 |
| Nanenane, Dodoma | 181 × 92 mm | 185 |
| Morogoro group | 119 × 74 mm | 175 |
| Liuka mine (cover and p. 10) | 210 × 129 / 203 mm | 170 |
| World Food Day, Tanga | 181 × 96 mm | 151 |

All are sharp on screen. If the issue is ever printed, the photos below 200 ppi will look slightly soft; the Tanga photo should then be reduced to about 137 mm wide.

## Still open
- **57 placeholders**, listed by page in `out/editor-placeholders.md`.
- **QR code** (F24): it points to `ndc.go.tz/…/NEWSLETTER-OCT-2026.pdf`. If the final PDF replaces that file at the same address, the QR needs no change. Otherwise, update the QR or the hosted file.
