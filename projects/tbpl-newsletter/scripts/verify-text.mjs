// Checks that every article paragraph and title in content/issue-001.js appears verbatim in the source PDF.
// Logged corrections ([[ID|original=>fix]]) are checked in their ORIGINAL form, so a correction can never hide a transcription error.
//   node scripts/verify-text.mjs
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
globalThis.window = {};
await import(path.join(root, 'content/issue-001.js'));
const I = window.TBPL_ISSUE;

// Source text with columns, line breaks and hyphenation removed, so only words and punctuation are compared.
const norm = t => t.normalize('NFKC').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim();
// Reading order: each page's left column, then its right column, with the running header (top 138 pt)
// and footer (below 812 pt) cropped away so passages that cross a column or page break stay contiguous.
const cols = [];
for (let p = 1; p <= 21; p++) for (const x of [0, 306]) {
  cols.push(execFileSync('pdftotext', ['-r', '72', '-f', String(p), '-l', String(p), '-x', String(x), '-y', '138', '-W', '306', '-H', '674', path.join(root, 'source/TBPL_NEWSLETTER-V2.pdf'), '-'], { stdio: ['ignore', 'pipe', 'ignore'] }).toString()
    .split('\n').filter(l => !/^\s*\d{1,2}\s*$/.test(l)).join('\n')); // drop folios
}
const full = execFileSync('pdftotext', [path.join(root, 'source/TBPL_NEWSLETTER-V2.pdf'), '-'], { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
// Compare letters and digits only; hyphens are dropped so line-end hyphenation cannot cause false mismatches.
const words = t => norm(t).toLowerCase().replace(/-/g, '').replace(/[^a-z0-9%]+/g, ' ').trim();
const corpus = words(cols.join(' ')) + ' | ' + words(full);

const original = s => s.replace(/\[\[F\d+\|(.*?)\]\](?!\])/g, (_, t) => t.split('=>')[0]);
let checked = 0, failed = 0;
// A passage passes if it appears whole, or splits at ONE point into two parts that each appear whole
// (a paragraph running from one column or page to the next, with a photo or box in between).
const found = text => {
  const w = words(text);
  if (corpus.includes(w)) return true;
  const ws = w.split(' ');
  for (let k = 3; k <= ws.length - 3; k++) if (corpus.includes(ws.slice(0, k).join(' ')) && corpus.includes(ws.slice(k).join(' '))) return true;
  let k = 1; while (k < ws.length && corpus.includes(ws.slice(0, k + 1).join(' '))) k++;
  return ws.slice(Math.max(0, k - 3), k + 3).join(' ');
};
for (const [key, a] of Object.entries(I.articles)) {
  if (!a.body) continue;
  const items = [['title', a.sourceTitle || a.title], ...a.body.map((b, i) => [`body[${i}]`, b.p || b.h])];
  if (a.pullQuote) items.push(['pullQuote', a.pullQuote]);
  if (a.quote) items.push(['quote', a.quote.text]);
  for (const [where, raw] of items) {
    checked++;
    const r = found(original(raw));
    if (r !== true) { failed++; console.log(`✗ ${key}.${where}: not found in source near "${r}"`); }
  }
}
console.log(`${checked} passages checked against the source PDF, ${failed} mismatch(es).`);
process.exit(failed ? 1 : 0);
