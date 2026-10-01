/**
 * Copies the website's local guests and episodes into the Sanity CMS, so nothing is lost when you switch the CMS on.
 *
 *   node scripts/import-to-sanity.mjs                    PREVIEW only: shows what would be created. Changes nothing.
 *   node scripts/import-to-sanity.mjs --write            creates DRAFTS in Sanity (you then review, approve and publish them in the Studio)
 *   node scripts/import-to-sanity.mjs --write --publish --approved-by "Your Name"
 *                                                         creates PUBLISHED, approved documents. Use only after you have
 *                                                         checked the content and confirmed each guest approved their biography.
 *
 * Needs (for --write): SANITY_PROJECT_ID, and SANITY_WRITE_TOKEN (create an "Editor" token at sanity.io/manage > API > Tokens).
 * Never save the token in a file that is committed to GitHub.
 * Safe to run more than once: it replaces the same documents instead of duplicating them.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { createClient } from '@sanity/client';

const args = new Set(process.argv.slice(2));
const WRITE = args.has('--write'), PUBLISH = args.has('--publish');
const approvedBy = process.argv.includes('--approved-by') ? process.argv[process.argv.indexOf('--approved-by') + 1] : '';
if (PUBLISH && (!WRITE || !approvedBy)) { console.error('--publish needs --write and --approved-by "Your Name".'); process.exit(1); }

const read = (dir) => fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => {
  const raw = fs.readFileSync(path.join(dir, f), 'utf8'); const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw);
  return { id: f.replace(/\.md$/, ''), data: parse(m[1]), body: (m[2] ?? '').trim() };
});
const key = () => Math.random().toString(36).slice(2, 10);
const span = (t) => ({ _type: 'span', _key: key(), text: t, marks: [] });
/** Very small Markdown to Portable Text converter: paragraphs and "## " headings (what our episode files use). */
const toPT = (md) => md.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean).map((p) =>
  p.startsWith('## ') ? { _type: 'block', _key: key(), style: 'h2', markDefs: [], children: [span(p.slice(3))] } : { _type: 'block', _key: key(), style: 'normal', markDefs: [], children: [span(p.replace(/\n/g, ' '))] });

const id = (type, slug, published) => `${published ? '' : 'drafts.'}${type}-${slug}`;
const workflow = () => ({ _type: 'workflow', status: PUBLISH ? 'approved' : 'draft', author: 'Imported from website files', ...(PUBLISH ? { approvedBy, approvedAt: new Date().toISOString() } : {}),
  notes: PUBLISH ? 'Imported and approved by the owner.' : 'Imported from the website files. Review, tick approvals and set to Approved before publishing.' });
const slug = (s) => ({ _type: 'slug', current: s });

const guests = read('src/content/guests'); const episodes = read('src/content/episodes');
const docs = [];
for (const g of guests) docs.push({ _id: id('guest', g.id, PUBLISH), _type: 'guest', name: g.data.name, slug: slug(g.id), role: g.data.role, organization: g.data.organization, bio: g.body,
  bioApproved: PUBLISH, links: (g.data.links ?? []).map((l) => ({ _type: 'linkItem', _key: key(), label: l.label, href: l.href })), workflow: workflow() });
const covers = new Map();
for (const e of episodes) {
  const d = e.data; const coverFile = path.resolve('src/content/episodes', d.cover);
  covers.set(e.id, { file: coverFile, alt: d.coverAlt });
  docs.push({ _id: id('episode', e.id, PUBLISH), _type: 'episode', title: d.title, slug: slug(e.id), number: d.number,
    guest: { _type: 'reference', _ref: `guest-${d.guest}` }, publishDate: new Date(d.publishDate).toISOString().slice(0, 10), summary: d.summary, topics: d.topics ?? [], themes: d.themes ?? [],
    format: d.format ?? 'interview', transcript: Boolean(d.transcript), body: toPT(e.body), workflow: workflow() });
}

console.log(`${WRITE ? (PUBLISH ? 'WRITING PUBLISHED, APPROVED' : 'WRITING DRAFT') : 'PREVIEW of'} documents:`);
for (const d of docs) console.log(`  ${d._type.padEnd(8)} ${d._id}${d._type === 'episode' ? `  (cover: ${path.basename(covers.get(d.slug.current).file)}, guest: ${d.guest._ref})` : ''}`);
if (!WRITE) { console.log('\nPreview only; nothing was changed. Add --write to import (see the notes at the top of this file).'); process.exit(0); }

const projectId = process.env.SANITY_PROJECT_ID, token = process.env.SANITY_WRITE_TOKEN;
if (!projectId || !token) { console.error('\nSet SANITY_PROJECT_ID and SANITY_WRITE_TOKEN first.'); process.exit(1); }
const client = createClient({ projectId, dataset: process.env.SANITY_DATASET || 'production', apiVersion: '2025-01-01', useCdn: false, token,
  ...(process.env.SANITY_API_HOST ? { apiHost: process.env.SANITY_API_HOST, useProjectHostname: false } : {}) });

for (const e of docs.filter((d) => d._type === 'episode')) {
  const c = covers.get(e.slug.current);
  const asset = await client.assets.upload('image', fs.createReadStream(c.file), { filename: path.basename(c.file) });
  e.cover = { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, alt: c.alt };
  console.log(`  uploaded cover for ${e.slug.current}`);
}
// guests first, so the episodes' references resolve
const tx = client.transaction();
for (const d of [...docs.filter((x) => x._type === 'guest'), ...docs.filter((x) => x._type === 'episode')]) tx.createOrReplace(d);
const res = await tx.commit();
console.log(`\nDone: ${res.results?.length ?? docs.length} documents written.`);
console.log(PUBLISH ? 'They are published and approved. The next site rebuild will show them.' : 'They are DRAFTS. Open the Studio, review each one, tick the approvals, set Editorial workflow to Approved, and click Publish.');
