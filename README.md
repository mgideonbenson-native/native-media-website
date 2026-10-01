# Native Media website

Official website for Native Media: **Stories. Strategy. Impact.**
Built with [Astro](https://astro.build) and TypeScript. Currently **Phase 1** (foundation, brand and homepage).

## How to preview it on your computer
You need [Node.js](https://nodejs.org) (version 20 or newer) installed once.

```bash
npm install     # downloads the tools the site needs (only the first time)
npm run dev     # starts a private preview; open http://localhost:4321
npm run build   # makes the final production files in the "dist" folder
```

Nothing is published to the internet by these commands.

## How the project is organized
| Folder / file | What it is |
|---|---|
| `src/pages/` | One file per web page. `index.astro` is the homepage. |
| `src/pages/[...slug].astro` | Temporary "coming in Phase X" pages for menu links not built yet. A real page automatically replaces its placeholder. |
| `src/components/` | Reusable pieces: header, footer, logo, placeholder artwork. |
| `src/layouts/BaseLayout.astro` | The frame shared by every page (header, footer, SEO tags). |
| `src/data/site.ts` | **Company facts, menu items and the six pillars.** Edit text here. |
| `src/styles/global.css` | **Design system**: colours, fonts, spacing. |
| `public/brand/` | Your supplied logo files. |

## Placeholders (nothing here is invented fact)
No photographs, contact details, social links, team, partners or published content were supplied, so those areas are clearly labelled **Placeholder**. Search for "placeholder" to find them.

## Adding a new African Intelligence episode
1. Copy any file in `src/content/episodes/`, rename it (e.g. `ep-4-short-title.md`) and edit the details at the top (title, number, date, summary, themes, topics). Write the full description below the second `---` line.
2. Put the episode cover image in `src/assets/episodes/` and point `cover:` at it.
3. If the guest is new, copy a file in `src/content/guests/` and edit it.
4. Optional: add the exact `youtubeUrl`, `rssUrl`, `spotifyUrl`, `appleUrl` or `amazonUrl` for the episode, and set `duration` and `transcript`.
5. Run `npm run build` (or `npm run dev` to preview). The episode, guest page, archive, search and sitemap update automatically.

## Stories and productions (demonstration content)
The files in `src/content/stories/` and `src/content/productions/` are **demonstrations** (`demo: true`). They are labelled on the page, kept out of the sitemap and search results, and hidden from search engines. To publish real content: add a new file (copy a demo one), set `demo: false`, and delete the demo files. When real stories exist, remove the `/stories` and `/productions` exclusions in `astro.config.mjs` so they are listed in the sitemap.

## The Tanzania Economic Diplomacy Review
Its structure, policies and sourcing rules live in `src/data/review.ts` (edit text there). The supplied draft PDF is **not** stored in this repository, and the draft's statistics, partner-country names and ministerial details are deliberately not published on the site until they are verified and approved.

## Data & Visuals (sample data)
The charts, map and explorer under `/intelligence/data-and-visuals` use **illustrative sample data** from `src/data/sample.ts` (generic "Partner A" names, invented index values). Every exhibit says so, the pages are hidden from search engines and the sitemap, and nothing there is real. To publish real data: replace `sampleRows` with verified, sourced rows, update `datasetMeta` (source, units, period, notes), set `isSample = false`, and remove the `/intelligence/data-and-visuals` exclusion in `astro.config.mjs`. Chart code is in `src/lib/charts.ts`; map boundaries come from the public-domain Natural Earth data via `world-atlas`.

## Policies, newsletter and forms
- Policies live in `src/pages/` (`privacy`, `terms`, `cookies`, `editorial-policy`, `research-policy`). They describe the site as it works today (no cookies, no analytics, fonts served from the site itself). Items marked **[to confirm]** need Native Media's details and a lawyer's review before launch. If you add analytics, embedded players or another service, update the Privacy and Cookie policies first.
- Forms send nothing until you set the web addresses in `.env` (copy `.env.example`): `PUBLIC_FORM_ENDPOINT` (contact forms), `PUBLIC_NEWSLETTER_ENDPOINT` and `PUBLIC_UNSUBSCRIBE_ENDPOINT`. Turn on confirmation emails (double opt-in) in your email service **before** setting the newsletter address. Until then each form tells the visitor honestly that nothing was sent.
