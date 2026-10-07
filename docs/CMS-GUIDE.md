# Native Media CMS guide (for non-technical users)

## 1. What this is

A **CMS** (content management system) is a web page where your team writes and approves content without touching code. Native Media uses **Sanity**. The editing screen is called the **Studio** (the `studio/` folder).

**Important:** today the website reads its content from files in the project (`src/content`). It switches to the CMS **only when you set `SANITY_PROJECT_ID`** (step 2). Until then nothing changes, and nothing breaks.

> Switching the CMS on replaces the local files. Your three real episodes and guests are in those files, so **copy them into the CMS first** with the import script (section 2b) before you turn the CMS on.

## 2. One-time setup (about 30 minutes)

You do these steps. They need your own accounts, so Claude cannot do them for you.

1. Create a free account at sanity.io and create a **project** (name it "Native Media", dataset `production`). Copy the **Project ID**.
2. In a terminal inside the `studio` folder:
   - `npm install`
   - create a file `studio/.env` containing `SANITY_STUDIO_PROJECT_ID=your-project-id`
   - `npm run dev` opens the Studio on your computer at http://localhost:3333 (you log in with your Sanity account).
3. Put the Studio online for the team: `npm run deploy` (it gives you an address like `nativemedia.sanity.studio`).
4. Tell the website about the CMS. In Netlify or Vercel (where the site is hosted), add the setting `SANITY_PROJECT_ID` with your Project ID. For your own computer, copy `.env.example` to `.env` and fill it in.
5. Make publishing automatic: in your Sanity project settings, add a **webhook** that calls your hosting service's **Build Hook** address whenever content is published. The site then rebuilds itself.
6. For scheduled content (section 4), add the same Build Hook address as a GitHub repository secret named `BUILD_HOOK_URL`. A daily rebuild is already set up in `.github/workflows/scheduled-rebuild.yml`.
7. Invite your team from the Sanity project settings (section 5).

### 2b. Copy the existing episodes and guests into the CMS
1. In sanity.io/manage, open your project, go to **API → Tokens**, and create a token with **Editor** access. Keep it private (never save it in a file that goes to GitHub).
2. **Preview** (changes nothing): `node scripts/import-to-sanity.mjs`
3. **Import as drafts** (recommended). In the terminal, set the two values for this one command, for example:
   `SANITY_PROJECT_ID=abc123 SANITY_WRITE_TOKEN=your-token node scripts/import-to-sanity.mjs --write`
   This uploads the cover images and creates 3 guests and 3 episodes as **drafts**. Open the Studio, check each one, tick "Guest has approved this biography", set Editorial workflow to **Approved** (with your name and date), and **publish the guests first, then the episodes**.
4. **Or import as already published** (only once you have checked everything and each guest has approved their biography):
   `... node scripts/import-to-sanity.mjs --write --publish --approved-by "Your Name"`
5. Only after the episodes show as published in the Studio, set `SANITY_PROJECT_ID` on the website.

The script can be run again safely: it replaces the same documents instead of duplicating them. Tested against the mock only (see section 10): please check the drafts appear in the Studio as expected.

## 3. The editorial workflow

Every piece of content (except authors) has an **Editorial workflow** box:

| Status | Meaning | Who |
|---|---|---|
| **Draft** | Being written | Contributor |
| **In review** | Ready for a second pair of eyes | Contributor sets it; Reviewer checks |
| **Approved** | Cleared to publish. Needs **Approved by** and **Approved on** | Approver |

The **Publish button is switched off** until the status is Approved, and Studio validation adds more checks (below). The site only shows content that is **published, approved, and past its "Publish on or after" time**.

In the Studio sidebar, **Editorial workflow** shows lists: *Needs review*, *Approved, ready to publish*, *Drafts* and *Scheduled for later*.

Typical flow: write → set **In review** → reviewer reads and adds notes → approver sets **Approved** with their name and date → click **Publish** → the site rebuilds (a few minutes) → it is live.

### Extra rules the Studio enforces
- **Stories:** reporting and research-based analysis need at least one source. **Sponsored** stories must name the sponsor. Every story has a content type shown to readers.
- **Thought leadership authors:** each article shows the writer’s role, full biography, photograph and public links, taken from the Author record. Fill in the Author’s biography, photograph and links before publishing their article.
- **Story sections:** every story belongs to African Stories (with a sub-category), Thought Leadership (no sub-category) or Stories of Opportunity (scholarships, fellowships, other). Opportunities also carry organization, deadline, eligibility and an official link, which readers are told to check before applying.
- **Guests:** you must tick that the guest approved their biography.
- **Briefings, papers, data, directories, agreements, quarterly updates:** at least one source (with publisher and reporting period). Data items also carry a **verification status** and a **data cut-off date**.
- **Embassy / partner profiles** are shown on the site only if **all four** are true: workflow Approved, participation **Confirmed**, the mission has **signed off** (name, role, date recorded), and data **Verified**. Ambassador messages are only added if supplied and signed.
- **Sponsors and partners** need written permission to publish their name and logo. Sponsors must also confirm that sponsorship does not determine editorial content. "Prospective" relationships can never be published.

## 4. Scheduling

Set **Publish on or after** to a future date. The content is invisible until the first site rebuild after that time. Rebuilds happen when someone publishes and once a day at 08:00 East Africa Time. For an exact time, press the Build Hook yourself.

## 5. Roles and permissions

Sanity has built-in access levels (such as Administrator, Editor and Viewer). Custom roles with fine-grained permissions are only on some paid plans, so check sanity.io/pricing for your plan.

| Team role | Does | Sanity access |
|---|---|---|
| Contributor | Writes drafts, sets *In review* | Editor |
| Reviewer | Checks facts, sources, tone | Editor |
| Approver / Publisher | Sets *Approved*, publishes | Editor or Administrator |
| Data steward | Verifies data and sources | Editor |
| Owner | Settings, users, billing | Administrator |
| Read-only (advisers) | Views only | Viewer |

**Be aware:** on plans without custom roles, anyone with Editor access *could* tick "Approved". The safeguard is the **recorded approver name and date** plus team practice. On a plan with custom roles, you can limit who may change the workflow box.

> Note: the content model below still includes types from an earlier plan (editions, embassy profiles, data exhibits and similar). The website no longer shows them, because Native Media is featuring other organizations' publications for now. Trim the Studio before turning the CMS on.

## 6. Corrections

Create a **Correction** document: what was corrected, the date, the **original wording**, the **corrected wording** and why. Approve and publish it like any content. It appears on the Review's **Corrections** page, and the original is preserved there. Also fix the original content itself. Sanity keeps a revision history of each document (how long depends on your plan) which is your update history.

## 7. Keeping a historical record
- Never delete published editions, profiles or data. Change their status or add a correction instead.
- Use the Studio **History** panel on any document to see earlier versions.

## 8. Backups and security
- **Backups:** once a month run `npx sanity dataset export production` inside `studio`. Keep the file somewhere private, **not in the public repository**.
- **Public by design:** published content can be read by anyone through Sanity's API. Do not paste confidential documents, internal correspondence, passwords or personal data into content fields. Drafts are only visible to logged-in team members.
- **Secrets:** never put tokens or passwords in the code or the repository. Only `SANITY_READ_TOKEN` (needed only for a private dataset) goes in the hosting service's settings.
- Remove team members from Sanity the day they leave.

## 9. Testing without Sanity
`npm run mock-cms` starts a fake Sanity API. Build against it with:
`SANITY_PROJECT_ID=test SANITY_API_HOST=http://127.0.0.1:4599 npm run build`
(`MOCK_EMPTY=1` simulates a brand-new empty CMS.)

## 10. What has and has not been tested
- **Tested:** the content model validates; the Studio builds; the website builds against the mock API with sample content (episodes, guests, stories, corrections, sponsors, editions, verified profiles) and with an empty CMS; every query contains the approval and scheduling rules; rich text is converted safely.
- **Import script:** tested in preview, draft and published modes against the mock (documents, cover upload, order and approval fields are correct).
- **Not tested (needs your Sanity account):** the import against real Sanity (for example, that Sanity accepts draft episodes pointing at guests that are not yet published), the real Sanity connection, the Studio screens in a browser, the publish gate behaving in the Studio, the webhook and scheduled rebuild. Please test these once with a dummy story before launch.
