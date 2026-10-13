/**
 * Checks data/strategic-minerals.json against the UONGOZI report PDF.
 * Every "quote" in the file must appear on the PDF page named beside it.
 *   node scripts/verify-strategic-minerals.mjs path/to/Strategic-minerals-2024_Web.pdf
 * Needs the `pdftotext` tool (poppler). The PDF itself is not kept in this repository.
 */
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const pdf = process.argv[2];
if (!pdf) { console.error('Usage: node scripts/verify-strategic-minerals.mjs <report.pdf>'); process.exit(2); }
const data = JSON.parse(readFileSync(new URL('../data/strategic-minerals.json', import.meta.url), 'utf8'));
const norm = (s) => s.toLowerCase().replace(/[‘’‛]/g, "'").replace(/[“”]/g, '"').replace(/­/g, '').replace(/-\s+/g, '-').replace(/\s+/g, ' ').trim();
const pages = new Map();
const pageText = (n) => { if (!pages.has(n)) pages.set(n, norm(execFileSync('pdftotext', ['-raw', '-f', String(n), '-l', String(n), pdf, '-'], { encoding: 'utf8' }))); return pages.get(n); };

let checked = 0; const fails = [];
const walk = (o, path) => {
  if (Array.isArray(o)) return o.forEach((v, i) => walk(v, `${path}[${i}]`));
  if (o && typeof o === 'object') {
    if (typeof o.pdf_page === 'number' && typeof o.quote === 'string') {
      checked++;
      if (!pageText(o.pdf_page).includes(norm(o.quote))) fails.push(`${path}: "${o.quote}" not found on PDF page ${o.pdf_page}`);
    }
    for (const [k, v] of Object.entries(o)) walk(v, `${path}.${k}`);
  }
};
walk(data, '$');
console.log(`Checked ${checked} quotes.`);
if (fails.length) { console.log(`${fails.length} problem(s):\n` + fails.join('\n')); process.exit(1); }
console.log('All quotes found on the stated PDF pages.');
