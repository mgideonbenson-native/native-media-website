/**
 * Checks a report data file against its source PDF: every quote must appear on the PDF page it cites,
 * and every table row's numbers must match its quote.
 * Usage: node scripts/verify-report-data.mjs data/<report>.json path/to/report.pdf
 * Needs pdftotext (poppler). Text is compared after lower-casing and dropping everything except letters
 * and digits, so line breaks, hyphenation and typographic quotes do not cause false failures.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const [file, pdf] = process.argv.slice(2);
if (!file || !pdf) { console.error('Usage: node scripts/verify-report-data.mjs <data.json> <pdf>'); process.exit(2); }
const data = JSON.parse(readFileSync(file, 'utf8'));
const norm = (s) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g, '');
const cache = new Map();
const page = (n) => {
  if (!cache.has(n)) cache.set(n, norm(execFileSync('pdftotext', ['-f', String(n), '-l', String(n), '-raw', pdf, '-'], { encoding: 'utf8' })));
  return cache.get(n);
};
const checks = [];
for (const [id, f] of Object.entries(data.facts ?? {})) checks.push({ id, quote: f.quote, p: f.pdf_page });
(data.tipping_points ?? []).forEach((t, i) => checks.push({ id: `tipping_points[${i}]`, quote: t.quote, p: t.pdf_page }));
const rows = [];
for (const [c, d] of Object.entries(data.countries ?? {})) {
  rows.push({ id: `${c}.total`, ...d.total, p: d.pdf_page });
  for (const [s, r] of Object.entries(d.segments)) rows.push({ id: `${c}.${s}`, ...r, p: d.pdf_page });
}
let failed = 0;
for (const c of [...checks, ...rows.map((r) => ({ id: r.id, quote: r.quote, p: r.p }))]) {
  if (!page(c.p).includes(norm(c.quote))) { failed++; console.log(`FAIL ${c.id} (PDF page ${c.p}): "${c.quote}"`); }
}
for (const r of rows) {
  const nums = r.quote.replace(/(\d),(\d)/g, '$1$2').match(/-?\d+(\.\d+)?/g).map(Number);
  const want = [...r.values, r.cagr];
  if (nums.slice(-want.length).join() !== want.join()) { failed++; console.log(`FAIL ${r.id}: values ${want} do not match quote`); }
}
const n = checks.length + rows.length;
console.log(`${n - failed}/${n} items found on their cited page${failed ? `, ${failed} problem(s)` : ''}.`);
process.exit(failed ? 1 : 0);
