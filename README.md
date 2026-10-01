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
