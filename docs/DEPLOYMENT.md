# Deploying the Native Media website (plain-language guide)

**Nothing is public until you decide.** This guide explains how to put the site online safely. Claude cannot do these steps for you because they need your own accounts.

## The idea
- **Preview** = a private-ish test copy of the site with its own web address. Use it to check the work.
- **Production** = the real site at your domain. It only changes when you approve.
- The project is set up for **Netlify** (`netlify.toml`). Vercel also works, but its security-header settings would need to be copied across.

## One-time setup (about 30 minutes)
1. Create a free account at **netlify.com** and sign in with your GitHub account.
2. **Add new site → Import an existing project → GitHub**, then choose the `nativemedia` repository. (GitHub says the repository was renamed to `native-media-website`: choose whichever name appears.)
3. Netlify reads `netlify.toml` and fills in the build settings itself. Check them: build command `npm run build`, publish folder `dist`.
4. Set the **Production branch** to `main`. Every other branch (like the one used during development) then becomes a **branch preview**, with a web address Netlify shows you.
5. Open the preview address and look through the site (use `docs/LAUNCH-CHECKLIST.md`).

> **Preview addresses are not password-protected by default.** Anyone who has the link can open it. The project marks every preview page "noindex" so search engines ignore it, but do not share the link publicly. Netlify offers password protection on some paid plans.

## Going live (only after you approve)
1. Finish the owner items in `docs/LAUNCH-CHECKLIST.md` and tell Claude (or your developer) you approve.
2. Merge the working branch into `main` on GitHub. Netlify builds and publishes the production site.
3. **Domain:** in Netlify, **Domain management → Add a domain** (the brief uses `nativemedia.co.tz`). Netlify shows you the DNS records to enter at the company where the domain is registered. HTTPS (the padlock) is switched on automatically once DNS is working.
4. Check that the site's address in `astro.config.mjs` (`site:`) is the real domain. It is currently `https://nativemedia.co.tz`.
5. In Google Search Console, add the domain and submit `https://nativemedia.co.tz/sitemap-index.xml`.

## If something goes wrong
In Netlify, **Deploys**, pick an earlier deploy and click **Publish deploy**. The previous version is back in seconds.

## Settings you may add later
Add these in **Netlify → Site configuration → Environment variables** (never in the code):
| Name | When |
|---|---|
| `PUBLIC_FORM_ENDPOINT` | when you choose a form service for the contact forms |
| `PUBLIC_NEWSLETTER_ENDPOINT`, `PUBLIC_UNSUBSCRIBE_ENDPOINT` | when you choose an email service |
| `SANITY_PROJECT_ID` (and others in `.env.example`) | only if you later switch the CMS on |

**Important:** when you connect a form or email service, also add its web address to `connect-src` in the `Content-Security-Policy` line of `netlify.toml`. Otherwise browsers will block the form from sending. Update the Privacy Policy at the same time.

## Backups
The site's code and content live in GitHub, which is your backup. Keep any exports of other data somewhere private, never in the public repository.
