# Native Media Studio (the editing screen)

This folder is the Sanity Studio: the web app where the team writes and approves content.
Full instructions for non-technical users: `../docs/CMS-GUIDE.md`.

```bash
cd studio
npm install
# create studio/.env containing: SANITY_STUDIO_PROJECT_ID=<your project id>
npm run dev        # opens the Studio at http://localhost:3333
npm run validate   # checks the content model
npm run deploy     # publishes the Studio to <name>.sanity.studio
```
