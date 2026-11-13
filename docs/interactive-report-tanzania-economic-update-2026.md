# Interactive report: Tanzania Economic Update, September 2026

Live page: `/research-and-publications/tanzania-economic-update-2026`
(the earlier short page `/creative-data/tanzania-making-jobs-work` redirects here, see `netlify.toml`).

## Where things live
- `data/tz-economic-update-2026.json` holds every figure on the page. Each one records the value, the period, whether it is actual, estimated, projected or a target, the printed page, the PDF page, and the report's exact wording.
- `src/pages/research-and-publications/tanzania-economic-update-2026.astro` is the page, with its nine sections.
- `src/components/report/` holds the reusable parts: `ChartFrame` (title, explanation, unit, period, source, tooltip), `Bars`, `LineChart`, `Stat` and `ReportNav` (section rail, mobile contents drawer, back to top, share, download).
- `src/scripts/report-page.ts` (shared by all interactive reports) holds the interactions: tabs, tooltips, count-up numbers, the scrolling 100-square story, section tracking, share and copy citation, and the opening background.
- `public/reports/` holds the original PDF (for the download button) and the social sharing image.

## Checking the figures
Install poppler (for `pdftotext`) and run:

    node scripts/verify-tz-economic-update.mjs path/to/TZ_Economic_Update.pdf

Every quote must appear on the PDF page it cites, and the Table 1.1 values must match their row. If a figure changes, update its quote and page in the JSON and run the check again.

## Editorial rules used on the page
- Figures come only from the World Bank report. No outside data.
- Projections are drawn dashed or hatched and labelled. Different reporting periods are labelled and not combined. One example is end-June 2026 debt (49%) against calendar 2025 in Table 1.1 (48.5%).
- The report's text and its Table 1.1 give different 2025 sector growth rates. The page shows the text figures and states the table's figures in a note.
- Anything marked "Native Media perspective", and the workers-and-firms loop diagram, is editorial interpretation and is labelled as such.

## Running and deploying
    npm ci
    npm run dev        # local preview
    npx astro build    # production build into dist/

Netlify builds and deploys automatically on every push to the site's branch. No extra settings are needed.
