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
| `PUBLIC_BUTTONDOWN_USERNAME` | your Buttondown username, to turn on the newsletter sign-up |
| `PUBLIC_NEWSLETTER_ENDPOINT`, `PUBLIC_UNSUBSCRIBE_ENDPOINT` | only if you use a different email service instead of Buttondown |
| `SANITY_PROJECT_ID` (and others in `.env.example`) | only if you later switch the CMS on |

**Important:** when you connect a form or email service, also add its web address to `connect-src` in the `Content-Security-Policy` line of `netlify.toml`. Otherwise browsers will block the form from sending. Update the Privacy Policy at the same time.

## Backups
The site's code and content live in GitHub, which is your backup. Keep any exports of other data somewhere private, never in the public repository.


## Connecting the contact and application forms (Formspree)

Both the inquiry forms and the Native Talks application send to one inbox through Formspree. Nothing is sent until you do this.

1. Create a free account at formspree.io and click **New form**. Name it "Native Media website".
2. Set the form's email to the address that should receive messages (for example benson@nativemedia.co.tz) and confirm the email Formspree sends you.
3. Copy the form's address. It looks like `https://formspree.io/f/abcdwxyz`.
4. In Netlify: **Site configuration → Environment variables → Add a variable**. Name `PUBLIC_FORM_ENDPOINT`, value the address from step 3. Then **Deploys → Trigger deploy**.
5. Test: send an inquiry and a Native Talks application from the live site and check both arrive. The email subject says which form it was.

The security rules in `netlify.toml` already allow `formspree.io`. The free plan limits how many messages you get each month; check their current limits. Spam is filtered by a hidden trap field plus Formspree's own checks.


## Connecting the newsletter (Buttondown)

1. Create an account at buttondown.com and pick your username (it becomes `buttondown.com/yourname`).
2. In Buttondown **Settings**, turn on **double opt-in** so every new subscriber gets a confirmation email. Add your sender name and the address you send from (for example benson@nativemedia.co.tz) and follow their steps to verify it.
3. In Netlify **Environment variables**, add `PUBLIC_BUTTONDOWN_USERNAME` with your username, then **Trigger deploy**.
4. Subscribe with a test address on the live site, click the confirmation email, and check the person appears under **Subscribers** in Buttondown.

The interests people tick on the sign-up form arrive in Buttondown as tags, so you can email only the readers interested in a topic. Every email Buttondown sends includes an unsubscribe link. Visitors who use the site's Unsubscribe page are told to use that link.

Note: the website cannot read Buttondown's reply, so the page shows "check your email" whenever the request went through. The test in step 4 is how you confirm it really works.


The Formspree form address (`https://formspree.io/f/xjygvnya`) is already set in `netlify.toml`, so you do not need to add it in Netlify. To change it later, edit that line or set `PUBLIC_FORM_ENDPOINT` in Netlify, which takes priority.


## Visitor statistics (Plausible)

The site is ready for Plausible, which counts visits without cookies or personal data (so no cookie banner is needed).

1. Create an account at plausible.io (it has a free trial, then a monthly fee) and **add a site** with the domain `nativemedia.co.tz`.
2. In Netlify **Environment variables**, add `PUBLIC_PLAUSIBLE_DOMAIN` with the value `nativemedia.co.tz`, then **Trigger deploy**.
3. Open your live site, then check Plausible's dashboard. Your visit should appear within a minute.

Until the variable is set, no statistics are collected, and the Privacy and Cookie pages say so. When it is set, they automatically describe Plausible. Preview builds never send statistics.

## WhatsApp button

The green "Chat on WhatsApp" button opens a chat with `+255 746 444 380`. To change the number, edit `whatsapp` in `src/data/site.ts` (digits only, with the country code, no plus sign). Leave it empty to hide the button.
