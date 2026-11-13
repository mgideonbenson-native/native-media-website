# Interactive report: PwC Africa Entertainment and Media Outlook 2026–2030

Live page: `/research-and-publications/africa-entertainment-media-outlook-2026`

- Data: `data/africa-em-outlook-2026.json`. It holds every figure with its page and the report's wording, the full country tables (2021–2030, South Africa in US$ and rand, Kenya, Nigeria) and the tipping-point timeline.
- Page: `src/pages/research-and-publications/africa-entertainment-media-outlook-2026.astro`. It uses the shared report components in `src/components/report/` and the shared script `src/scripts/report-page.ts`.
- Check the figures against the PDF:

      node scripts/verify-report-data.mjs data/africa-em-outlook-2026.json path/to/africa-entertainment-media-outlook-2026.pdf

## Rights
PwC's report says no part may be reproduced without PwC's prior written permission. Native Media confirmed it has that permission before publishing. Keep the written permission on file. The page does not host the PDF; it links to PwC's own copy. PwC's requested citation, "PwC Africa Entertainment and Media Outlook 2026–2030", appears on the page.

## Notes on the numbers
- 2021–2024 are historical, 2025 is the base year, and 2026–2030 are PwC forecasts. CAGR means 2025–2030.
- Country totals do not add up exactly to their segments, because PwC removes double-counting within internet advertising.
- The South Africa gaming chart on p. 23 counts video games only (US$564m → US$694m, 4.3%). The table on p. 8 includes esports (US$567m → US$698m, 4.2%). The page says which one it shows.
- The p. 25 callout calls 5.7% "live music"; the text on the same page gives 5.7% for music, radio and podcasts. The page notes this.
- Tipping-point years are read from the timeline graphic on p. 4.
