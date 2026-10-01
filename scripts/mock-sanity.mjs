/**
 * A tiny fake of the Sanity API, used to test the website's CMS code without a real Sanity project.
 *   node scripts/mock-sanity.mjs            (starts on port 4599)
 * Then build the site against it:
 *   SANITY_PROJECT_ID=test SANITY_API_HOST=http://127.0.0.1:4599 npm run build
 * It cannot run real GROQ filters, so it checks that every query CONTAINS the approval and scheduling rules.
 */
import http from 'node:http';
import fs from 'node:fs';
const PORT = Number(process.env.MOCK_PORT ?? 4599); const EMPTY = process.env.MOCK_EMPTY === '1'; // MOCK_EMPTY=1 simulates a brand-new, empty CMS
 const HOST = `http://127.0.0.1:${PORT}`;
const img = { alt: 'Test cover artwork', url: `${HOST}/img.webp`, width: 1254, height: 1254 };
const pt = [
  { _type: 'block', style: 'normal', markDefs: [{ _key: 'l1', _type: 'link', href: 'https://example.com/source' }], children: [{ _type: 'span', text: 'Body text with a ', marks: [] }, { _type: 'span', text: 'safe link', marks: ['l1'] }, { _type: 'span', text: ' and <script>alert(1)</script> text.', marks: [] }] },
  { _type: 'block', style: 'h2', markDefs: [], children: [{ _type: 'span', text: 'A heading', marks: [] }] },
];
const ptSection = (t) => [{ _type: 'block', style: 'normal', markDefs: [], children: [{ _type: 'span', text: t, marks: [] }] }];
const data = {
  guest: [{ id: 'cms-guest', name: 'CMS Guest', role: 'Founder', organization: 'Test Org', bio: 'Approved bio from the CMS.', links: [{ label: 'Site', href: 'https://example.com' }] }],
  episode: [{ id: 'cms-episode', title: 'CMS Episode Title', number: 1, guest: 'cms-guest', publishDate: '2026-10-01', summary: 'Summary from the CMS.', cover: img, topics: ['Testing'], themes: ['Theme one'], format: 'interview', body: pt }],
  story: [{ id: 'cms-story', title: 'CMS Story Headline', subtitle: 'Subtitle from CMS', category: 'technology', kind: 'sponsored', author: 'CMS Author', date: '2026-09-30', featured: true, heroImage: img, sources: [{ title: 'Doc', publisher: 'Bank', period: '2025' }], sponsor: 'Test Sponsor Ltd', body: pt }],
  production: [{ id: 'cms-production', title: 'CMS Production', category: 'documentaries', synopsis: 'Synopsis from CMS.', duration: '12:00', credits: [{ role: 'Director', name: 'Test Director' }], featured: true, poster: img, body: pt }],
  correction: [{ item: 'Chapter 4 figure', date: '2026-10-02', originalText: 'Old wording', correctedText: 'New wording', reason: 'Source updated' }],
  sponsor: [{ name: 'Test Sponsor Ltd', agreedRole: 'Edition partner', scope: 'Edition 01', confirmedOn: '2026-09-01' }],
  edition: [{ label: 'Edition 01 · TEST', status: 'forthcoming', reportingPeriod: '2026/27' }],
  embassyProfile: [{ slug: 'testland', country: 'Testland', region: 'Europe', sponsored: false, relationsStart: 1970, ambassadorName: 'A. Ambassador', ambassadorTitle: 'Ambassador', signoffDate: '2026-09-20', cutoff: '2026-09-30',
    relationship: ptSection('Relationship text.'), trade: ptSection('Trade text.'), sources: [{ title: 'Trade report', publisher: 'NBS', period: '2025' }] }],
};
const problems = [];
http.createServer((req, res) => {
  const u = new URL(req.url, HOST);
  if (u.pathname === '/img.webp') { res.writeHead(200, { 'Content-Type': 'image/webp' }); return res.end(fs.readFileSync('src/assets/episodes/ep3-taha-jiwaji.webp')); }
  if (u.pathname === '/__problems') { res.writeHead(200); return res.end(JSON.stringify(problems)); }
  // Writes (used to test scripts/import-to-sanity.mjs): image uploads and mutations. Mutations are saved to /tmp/mock-mutations.json.
  if (req.method === 'POST' && u.pathname.includes('/assets/images/')) {
    req.resume(); req.on('end', () => { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ document: { _id: `image-${Math.random().toString(36).slice(2, 10)}-1254x1254-webp`, _type: 'sanity.imageAsset', url: `${HOST}/img.webp` } })); }); return;
  }
  if (req.method === 'POST' && u.pathname.includes('/data/mutate/')) {
    let body = ''; req.on('data', (c) => (body += c)); req.on('end', () => {
      const m = JSON.parse(body); fs.writeFileSync('/tmp/mock-mutations.json', JSON.stringify(m, null, 2));
      res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ transactionId: 'tx1', results: m.mutations.map((x) => ({ id: Object.values(x)[0]._id, operation: 'create' })) }));
    }); return;
  }
  const q = u.searchParams.get('query') ?? '';
  const type = /^\s*\*\[_type == "(\w+)"/.exec(q)?.[1];
  if (!type || !data[type]) { problems.push(`unknown query: ${q.slice(0, 60)}`); res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ result: [] })); }
  for (const rule of ['workflow.status == "approved"', 'workflow.publishAt <= now()']) if (!q.includes(rule)) problems.push(`${type} query is missing: ${rule}`);
  if (type === 'embassyProfile') for (const rule of ['participation == "confirmed"', 'signoff.signedOff == true', 'verification.status == "verified"']) if (!q.includes(rule)) problems.push(`profile query is missing: ${rule}`);
  console.log(`query ${type}: ${data[type].length} fixture(s)`);
  res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ result: EMPTY ? [] : data[type], ms: 1, query: q }));
}).listen(PORT, () => console.log(`mock Sanity on ${HOST}`));
