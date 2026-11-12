/**
 * Checks every quote in data/tz-economic-update-2026.json against the World Bank PDF.
 * Usage: node scripts/verify-tz-economic-update.mjs path/to/TZ_Economic_Update.pdf
 * Needs pdftotext (poppler). Each quote must appear on the PDF page it cites.
 * Text is compared after lower-casing and removing everything except letters and digits,
 * so line breaks, hyphenation and typographic quotes do not cause false failures.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const pdf = process.argv[2];
if (!pdf) { console.error('Usage: node scripts/verify-tz-economic-update.mjs <pdf>'); process.exit(2); }
const data = JSON.parse(readFileSync(new URL('../data/tz-economic-update-2026.json', import.meta.url), 'utf8'));
const norm = (s) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g, '');
const pages = new Map();
const page = (n) => {
  if (!pages.has(n)) pages.set(n, norm(execFileSync('pdftotext', ['-f', String(n), '-l', String(n), '-raw', pdf, '-'], { encoding: 'utf8' })));
  return pages.get(n);
};
const checks = [
  ...Object.entries(data.facts).map(([id, f]) => ({ id, quote: f.quote, pdf_page: f.pdf_page })),
  ...Object.entries(data.table_1_1.rows).map(([id, r]) => ({ id: `table_1_1.${id}`, quote: r.quote, pdf_page: data.table_1_1.pdf_page })),
  { id: 'meta.rights', quote: data.meta.rights_quote, pdf_page: data.meta.rights_pdf_page },
];
let failed = 0;
for (const c of checks) {
  if (!page(c.pdf_page).includes(norm(c.quote))) { failed++; console.log(`FAIL ${c.id} (PDF page ${c.pdf_page}): "${c.quote}"`); }
}
// Table values must match the numbers in their own quote.
for (const [id, r] of Object.entries(data.table_1_1.rows)) {
  const nums = r.quote.match(/-?\d+(\.\d+)?/g).slice(-r.values.length).map(Number);
  if (nums.join() !== r.values.join()) { failed++; console.log(`FAIL table_1_1.${id}: values ${r.values} do not match quote ${nums}`); }
}
console.log(`${checks.length - failed}/${checks.length} quotes found on their cited page${failed ? `, ${failed} problem(s)` : ''}.`);
process.exit(failed ? 1 : 0);
