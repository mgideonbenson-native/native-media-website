# Launch checklist

## A. Tests completed (all passed)

| Area | Result |
|---|---|
| Build | 93 pages build with no errors; type check clean |
| Links | Every internal link on every page works; no placeholder ("coming soon") pages remain |
| Accessibility | Automated scan (axe, WCAG 2.2 AA + best practices) of all 92 pages at desktop **and** phone width: **0 violations**. Keyboard use checked on menus, forms, charts and the map |
| Performance | Lighthouse (mobile, throttled): Performance **96–100**, Accessibility **100**, Best Practices **100**, SEO **100** on live pages. Largest content shown in about 2 seconds. Home page is 161 KB |
| SEO | All 58 indexable pages: unique titles (≤70 chars), descriptions (50–300), canonical links, social-sharing tags, one H1, language set. Sitemap lists exactly the indexable pages. `robots.txt` present |
| Security | 0 known vulnerabilities in the website's dependencies. No secrets or private files in the repository. Strict Content-Security-Policy plus 6 other security headers tested in a browser: every feature works and nothing is blocked |
| Privacy | The site sets **no cookies** and stores nothing in the browser; it loads nothing from other websites (verified) |
| Mobile | No sideways scrolling on any tested page at phone width |
| Preview safety | Preview builds mark every page "noindex" |

**Not tested / limits:** real form and email delivery (not connected), a real screen-reader session, older browsers, and the CMS (switched off for now). The Studio's own (editing tool) dependencies have 15 known findings; they never reach visitors and only matter if you switch the CMS on.

## B. Items only you can supply or decide (the site is not ready to go public until these are done)

- [ ] **Contact details**: verified email, phone, address, and social links (only YouTube is listed now). Add them in `src/data/site.ts`.
- [ ] **Legal details and review**: fill every **[to confirm]** in the Privacy Policy and Terms (legal name, address, contact, hosts, retention, governing law) and have a lawyer review all policies.
- [ ] **Form and email services**: choose them, connect them (see `DEPLOYMENT.md`), and update the Privacy Policy. Until then the forms honestly say nothing was sent.
- [ ] **Real photographs and video** to replace the placeholder artwork (hero, capability cards, story slots, team photos).
- [ ] **Team profiles**: names, titles, approved biographies and photos (About → Leadership & Team).
- [ ] **Partners, sponsors and clients**: only confirmed ones with written permission.
- [ ] **Company history and milestones** (About → Our Story) if you want them shown.
- [ ] **Stories and productions**: the demonstration items are hidden from search engines; replace them with real, approved work.
- [ ] **Data & Visuals**: the charts, map and timeline use sample data. Replace with verified, sourced data or leave them unpublished.
- [ ] **Tanzania Economic Diplomacy Review**: approve how it is shown. The draft's figures, the partner countries and the Ministerial foreword are deliberately **not** on the site. Confirm the draft cover (AI-generated, labelled) may be public.
- [ ] **Episode links**: the exact YouTube/Spotify/Apple/Amazon link for each episode (currently show-level links).
- [ ] **Official vector logo** (the site uses your supplied PNG files).
- [ ] **Domain**: confirm `nativemedia.co.tz` and who controls its DNS.

## C. Approvals (record each)

| Approval | By | Date |
|---|---|---|
| Staging preview reviewed on desktop and phone | | |
| Content accuracy reviewed (no unverified claims, clients or figures) | | |
| Legal / policies reviewed | | |
| **Production go-live approved** | | |

## D. After launch
- Submit the sitemap in Google Search Console and check pages appear.
- Test each form once with a real submission.
- Watch for broken links and update the Corrections page if an error is reported.
- Re-run the checks in section A after any large change.
