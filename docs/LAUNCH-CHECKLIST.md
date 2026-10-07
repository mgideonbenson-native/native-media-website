# Launch checklist

## A. Tests completed (all passed)

| Area | Result |
|---|---|
| Build | 93 pages build with no errors; type check clean |
| Links | Every internal link on every page works; no placeholder ("coming soon") pages remain |
| Accessibility | Automated scan (axe, WCAG 2.2 AA + best practices) of all 92 pages at desktop **and** phone width: **0 violations**. Keyboard use checked on menus, forms, charts and the map |
| Performance | Lighthouse (mobile, throttled): Performance **96–100**, Accessibility **100**, Best Practices **100**, SEO **100** on live pages. Largest content appears in 1.7 to 2.6 seconds on a throttled mobile connection. Home page is 161 KB |
| SEO | All 58 indexable pages: unique titles (≤70 chars), descriptions (50–300), canonical links, social-sharing tags, one H1, language set. Sitemap lists exactly the indexable pages. `robots.txt` present |
| Security | 0 known vulnerabilities in the website's dependencies. No secrets or private files in the repository. Strict Content-Security-Policy plus 6 other security headers tested in a browser: every feature works and nothing is blocked |
| Privacy | The site sets **no cookies** and stores nothing in the browser; it loads nothing from other websites (verified) |
| Mobile | No sideways scrolling on any tested page at phone width |
| Preview safety | Preview builds mark every page "noindex" |

**Not tested / limits:** real form and email delivery (not connected), a real screen-reader session, older browsers, and the CMS (switched off for now). The Studio's own (editing tool) dependencies have 15 known findings; they never reach visitors and only matter if you switch the CMS on.

## B. Items only you can supply or decide (the site is not ready to go public until these are done)

- [ ] **Contact details**: your email and phone are intentionally **not shown** on the site (people use the contact forms and the WhatsApp button). Add an office address or a public email later in `src/data/site.ts` if you want them shown.
- [x] **Legal pages filled in** (Privacy Policy and Terms: contact, data-retention periods, providers, Tanzania law). Still recommended: have a Tanzanian lawyer review them against the Personal Data Protection Act, 2022, and confirm the company's registered legal name if it differs from "Native Media".
- [ ] **Form and email services**: choose them, connect them (see `DEPLOYMENT.md`), and update the Privacy Policy. Until then the forms honestly say nothing was sent.
- [ ] **Real photographs and video** to replace the placeholder artwork (hero, capability cards, story slots, team photos).
- [ ] **Team profiles**: the founder profile is in. Add other team members (names, titles, approved biographies, photos) on About → Leadership & Team.
- [ ] **Partners, sponsors and clients**: only confirmed ones with written permission.
- [ ] **Company history and milestones** (About → Our Story) if you want them shown.
- [ ] **Stories**: the demonstration stories are hidden from search engines; replace them with real, approved work.
- [ ] **Creative Data portfolio** (audiovisuals, motion graphics, digital videos, visual research presentations): add completed, verified projects with confirmed credits.
- [ ] **Training & Mentorship**: details for Native Talks and thought leadership development (who it is for, format, dates, how to apply, mentors). The pages hold placeholders until you supply them.
- [ ] **Third-party research**: confirm the proposed standards on that page, and add real items only with the owners' permission.
- [ ] **Data & Visuals**: the charts, map and timeline use sample data. Replace with verified, sourced data or leave them unpublished.
- [ ] **Publications from other organizations**: add the first reports and research papers (one file each in `src/content/publications`), with the publisher's permission. Until then the section shows "coming soon".
- [ ] **Case studies**: four are published from your documents (DIRA 2050, National Clean Cooking Strategy launch, E-cooking, KCB at the Tanzania–Kenya Business Forum). Confirm each client and contractor has agreed, and that the event photos may be used. The KCB case names a Group CEO and Heads of State, so please double-check wording and photos with the client.
- [ ] **Client logos**: confirm each organization is happy to be shown. The Afromark Communication logo you sent is very small (143 px wide), so a larger version would look sharper.
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
