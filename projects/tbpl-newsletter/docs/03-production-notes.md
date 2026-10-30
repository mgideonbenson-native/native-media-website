# Phases 5–7: Production notes, TBPL Newsletter Issue 001

**Output:** `out/TBPL-Newsletter-Issue-001-October-2026.pdf`. This is the online edition: 20 pages, A4, RGB, about 5.9 MB, tagged for accessibility, with 38 bookmarks and live links (contents, cover lines, cross-references, email and website).
**Source:** `issue/issue-001.html`, built from `content/issue-001.js` in Direction A (Documentary Ledger).

## Client decisions (30 October 2026)
| Item | Decision | Applied as |
|---|---|---|
| Visual direction | A, Documentary Ledger, adapted to the available assets | Whole issue |
| Embassy (F1) | **Embassy of Canada** | Headline and contents corrected; original kept in `articles.embassy.sourceTitle` |
| Annual sales (F3) | No exact figures exist | Shown as approximate with the source's qualifiers; neutral note that they do not sum exactly to the total |
| Liuka article (F13) | No further text, byline or date exist | Published without byline or date; final sentence closed with a full stop |
| Event dates (F22) | Unavailable | No date fields printed for undated events |
| Photo captions (F16) | No caption sheet exists | Captions written from the article context only: place and event, never names; no photo credits printed |
| Originals and vectors (F17, F18) | Unavailable | Extracted assets used within the size rules; logo used as supplied, never redrawn |
| Output | Online PDF | 150 ppi floor; RGB; links and bookmarks |

## Corrections log
Corrections are marked in the content file as `[[ID|original=>fix]]`. Approved corrections always apply. Proposed ones apply only when `meta.applyProposedCorrections` is set to `true`. Review mode shows every correction.

| ID | Where | Source text | Corrected to | Status |
|---|---|---|---|---|
| F1 | Embassy headline, contents | "…to the Denmark Embassy: …" | "…to the Embassy of Canada: …" | **Approved, applied** |
| F13 | Liuka, last sentence | "…strengthening preventive public health" | "…health." | **Approved, applied** (punctuation only) |
| F15 | Performance, p. 4–5 | "commitee" | "committee" | Proposed, not applied |
| F15 | Morogoro, p. 8 | "equipment's" | "equipment" | Proposed, not applied |
| F15 | El Niño headline and text | "El Nino" | "El Niño" | Proposed, not applied |

Everything else is printed as written in the source, including the spelling variants listed under flags F9–F12 (product names, "Product"/"Products", "Magazine", "Mohamed"/"Mohammed"). To apply the three proposed corrections, change one line in `content/issue-001.js` and run `npm run render`.

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

## Still open (none blocks online publication)
- **Proposed spelling corrections** (F15): approve or reject.
- **QR code** (F24): it points to `ndc.go.tz/…/NEWSLETTER-OCT-2026.pdf`. If this redesign replaces that file at the same address, the QR needs no change. Otherwise, update the QR or the hosted file.
- **Flags kept as printed:** F2 (reporting period), F5 (councils 178 → 149 under an "expands" subhead), F6 (period of the 751,870 litres), F8 (unsourced malaria figures, shown as a quotation with a note), F9–F12 (name variants), F14 (unattributed Nanenane quote).
