// Renders every prototype with Playwright: QA checks, PNG previews (per page and per spread) and print PDFs.
//   node scripts/render.mjs              all prototypes, clean + review previews, PDFs
//   node scripts/render.mjs cover        only files whose name contains "cover"
//   node scripts/render.mjs --qa-only    checks without writing images
import { chromium } from 'playwright';
import { readdirSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const qaOnly = args.includes('--qa-only');
const filter = args.find(a => !a.startsWith('--'));
const ORDER = ['directions', 'cover', 'data-feature', 'field-report'];
// Prototypes (Phase 3) and the full issue (Phase 5). Paths are relative to the project root.
const files = [
  ...readdirSync(path.join(root, 'prototypes')).filter(f => f.endsWith('.html') && f !== 'index.html')
    .sort((a, b) => ORDER.indexOf(a.replace('.html', '')) - ORDER.indexOf(b.replace('.html', ''))).map(f => 'prototypes/' + f),
  ...readdirSync(path.join(root, 'issue')).filter(f => f.endsWith('.html')).map(f => 'issue/' + f)
].filter(f => !filter || f.includes(filter));
const ISSUE_PDF = 'TBPL-Newsletter-Issue-001-October-2026.pdf';
const outDir = path.join(root, 'out');
mkdirSync(path.join(outDir, 'previews'), { recursive: true });

let browser;
try { browser = await chromium.launch(); }
catch { browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }

const report = [];
const pdfs = [];
for (const f of files) {
  const name = path.basename(f, '.html');
  const isIssue = f.startsWith('issue/');
  for (const mode of qaOnly ? [''] : ['', '?review']) {
    const ctx = await browser.newContext({ viewport: { width: 1800, height: 1400 }, deviceScaleFactor: f.startsWith('issue/') ? 1.6 : 2.5 });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
    page.on('requestfailed', r => errors.push('failed request: ' + r.url()));
    await page.goto(pathToFileURL(path.join(root, f)).href + mode);
    await page.waitForSelector('body[data-mounted="true"]', { timeout: 15000 }).catch(() => errors.push('components never mounted'));
    await page.waitForLoadState('networkidle');

    if (!mode) {
      const qa = await page.evaluate(() => {
        const mm = px => +(px / 96 * 25.4).toFixed(1);
        const issues = [];
        const pages = [...document.querySelectorAll('.page')];
        pages.forEach((pg, i) => {
          const pr = pg.getBoundingClientRect();
          const label = `page ${pg.dataset.folio || i + 1}`;
          // screen geometry must equal print geometry, or text flowed on screen will not fit the PDF page
          if (Math.abs(mm(pr.width) - 210) > 0.5 || Math.abs(mm(pr.height) - 297) > 0.5) issues.push(`${label}: page is ${mm(pr.width)}×${mm(pr.height)} mm, not 210×297`);
          // text that does not fit its frame (multi-column overflow spills sideways)
          pg.querySelectorAll('.body, [data-fit]').forEach(el => {
            if (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2)
              issues.push(`${label}: OVERSET text in ${el.dataset.ref || el.className} (${mm(el.scrollWidth - el.clientWidth)} mm wide / ${mm(el.scrollHeight - el.clientHeight)} mm tall)`);
          });
          // anything escaping the trim that is not meant to bleed
          pg.querySelectorAll('.live *').forEach(el => {
            if (el.closest('.bleed, svg')) return;
            const r = el.getBoundingClientRect();
            if (r.width && (r.right > pr.right + 1 || r.bottom > pr.bottom + 1 || r.left < pr.left - 1))
              issues.push(`${label}: element outside trim <${el.tagName.toLowerCase()} class="${el.className}">`);
          });
          // missing data slots
          pg.querySelectorAll('.is-missing').forEach(el => issues.push(`${label}: missing content ${el.textContent}`));
          // body text sizes below 7 pt (captions are 7.2 pt minimum by design)
          pg.querySelectorAll('p, li, figcaption, dd').forEach(el => {
            const fs = parseFloat(getComputedStyle(el).fontSize) * 72 / 96;
            if (el.textContent.trim() && fs < 6.0 && !el.closest('.review-only')) issues.push(`${label}: text below 6 pt (${fs.toFixed(1)} pt): "${el.textContent.trim().slice(0, 40)}"`);
          });
        });
        // structure: nothing may sit outside a page (a stray tag would push content off the page in the PDF)
        document.querySelectorAll('.spread > :not(.page), .desk > :not(.page):not(.spread):not(.review-panel):not(header):not(section)').forEach(el =>
          issues.push(`content outside any page: <${el.tagName.toLowerCase()} class="${el.className}">`));
        // image resolution at placed size (object-fit: cover crops, so use the limiting axis)
        const images = [...document.querySelectorAll('.page img')].map(img => {
          const r = img.getBoundingClientRect();
          const scale = Math.max(r.width / img.naturalWidth, r.height / img.naturalHeight);
          const ppi = Math.round(96 / scale);
          return { src: img.getAttribute('src'), placed: `${mm(r.width)}×${mm(r.height)} mm`, ppi, ok: img.complete && img.naturalWidth > 0,
            verdict: ppi >= 300 ? 'excellent' : ppi >= 200 ? 'print OK' : ppi >= 150 ? 'acceptable: digital fine, soft in print' : 'FAIL: below 150 ppi floor' };
        });
        images.filter(i => !i.ok).forEach(i => issues.push('image failed to load: ' + i.src));
        images.filter(i => i.ok && i.ppi < 150).forEach(i => issues.push(`image below 150 ppi floor: ${i.src} (${i.ppi} ppi at ${i.placed})`));
        const fonts = [...document.fonts].filter(f => f.status === 'loaded').map(f => `${f.family} ${f.style}`);
        return { pages: pages.length, issues, images, fonts: [...new Set(fonts)] };
      });
      report.push({ file: f, errors, ...qa });
    }

    if (!qaOnly && isIssue) {
      // every page as its own preview; the PDF is the online edition (bookmarks from headings, tagged, live links)
      const dir = path.join(outDir, 'issue-previews' + (mode ? '-review' : ''));
      mkdirSync(dir, { recursive: true });
      const pages = await page.$$('.page');
      // JPEG previews keep the repository light; the PDF is the deliverable
      const shot = { type: 'jpeg', quality: 82 };
      for (let i = 0; i < pages.length; i++) await pages[i].screenshot({ ...shot, path: path.join(dir, `page-${String(i + 1).padStart(2, '0')}.jpg`) });
      if (!mode) for (const [i, s] of (await page.$$('.spread')).entries()) await s.screenshot({ ...shot, path: path.join(dir, `spread-${String(i + 1).padStart(2, '0')}.jpg`) });
      if (mode) { const p = await page.$('.review-panel'); if (p) await p.screenshot({ path: path.join(dir, 'review-notes.png') }); }
      else await page.pdf({ path: path.join(outDir, ISSUE_PDF), preferCSSPageSize: true, printBackground: true, outline: true, tagged: true });
    }
    if (!qaOnly && !isIssue) {
      const suffix = mode ? '-review' : '';
      const spreads = await page.$$('.spread');
      const singles = await page.$$('.desk > .page');
      let n = 0;
      for (const s of spreads) await s.screenshot({ path: path.join(outDir, 'previews', `${name}${suffix}-spread-${++n}.png`) });
      n = 0;
      for (const s of singles) await s.screenshot({ path: path.join(outDir, 'previews', `${name}${suffix}-${++n}.png`) });
      if (mode) { const p = await page.$('.review-panel'); if (p) await p.screenshot({ path: path.join(outDir, 'previews', `${name}-review-notes.png`) }); }
      if (!mode && name !== 'directions') {
        const pdf = path.join(outDir, `${name}.pdf`);
        await page.pdf({ path: pdf, preferCSSPageSize: true, printBackground: true });
        pdfs.push(pdf);
      }
      if (!mode && name === 'directions') {
        await page.screenshot({ path: path.join(outDir, 'previews', 'directions-board.png'), fullPage: true });
      }
    }
    await ctx.close();
  }
}
await browser.close();

if (pdfs.length > 1) {
  try { execFileSync('pdfunite', [...pdfs, path.join(outDir, 'TBPL-Newsletter-001-prototypes.pdf')]); }
  catch (e) { console.warn('pdfunite not available; per-prototype PDFs only'); }
}
writeFileSync(path.join(outDir, 'qa-report.json'), JSON.stringify(report, null, 2));
for (const r of report) {
  console.log(`\n${r.file}: ${r.pages} page(s), ${r.issues.length} layout issue(s), ${r.errors.length} console error(s)`);
  r.issues.forEach(i => console.log('  ✗ ' + i));
  r.errors.forEach(i => console.log('  ! ' + i));
  r.images.forEach(i => console.log(`  img ${i.src}  ${i.placed}  ${i.ppi} ppi  ${i.verdict}`));
}
