# Publications from other organizations

Add one `.md` file per publication in this folder (this README is ignored by the site only if you delete it; keep it out of the site by leaving it as is, since files named README are skipped).

Example file `world-bank-africas-pulse.md`:

```
---
title: "Africa's Pulse"
publisher: "World Bank"
year: 2026
kind: report            # report | research-paper
url: "https://example.org/the-original-report"
summary: "One or two sentences describing what the publication covers."
featured: true
---
```

Always link to the original, credit the publisher, and publish only with their permission.

Optional extras on a card:
- cover: a picture of the cover in src/assets/publications (only with the publisher's permission), plus coverAlt.
- snapshot: a page on this site with our interactive version, for example "/creative-data/reports-snapshot".
- finding: the main figure from the report, drawn as a small chart (kind: bars or stack). Only use numbers checked against the report.
