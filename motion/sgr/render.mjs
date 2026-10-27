/**
 * Renders the SGR film: serves the repo root locally, opens film.html in headless Chromium,
 * captures every frame from the canvas and pipes it to ffmpeg.
 *
 *   node motion/sgr/render.mjs --stills 2,20,40          PNG stills into motion/sgr/out/
 *   node motion/sgr/render.mjs --video [--from 0 --to 120] [--fps 30] [--out file.mp4]   silent master
 *   node motion/sgr/render.mjs --serve                   open http://localhost:4400/motion/sgr/film.html?preview
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

// Playwright is not a project dependency: use the copy installed on the machine (resolved like require()).
const { chromium } = createRequire(import.meta.url)('playwright');

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const outDir = path.join(here, 'out');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d; };
const has = (k) => args.includes(`--${k}`);

const types = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] ?? 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
const port = Number(opt('port', 4400));
await new Promise((r) => server.listen(port, '127.0.0.1', r));
const url = `http://127.0.0.1:${port}/motion/sgr/film.html`;
if (has('serve')) { console.log(`${url}?preview`); await new Promise(() => {}); }

fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => { console.error('page error:', e.message); process.exitCode = 1; });
await page.goto(url);
await page.evaluate(() => window.READY);

const grab = async (t) => {
  const b64 = await page.evaluate((t) => { renderFrame(t); return document.getElementById('film').toDataURL('image/png').split(',')[1]; }, t);
  return Buffer.from(b64, 'base64');
};

if (opt('stills')) {
  for (const t of opt('stills').split(',').map(Number)) {
    const f = path.join(outDir, `still-${String(t.toFixed(1)).padStart(5, '0')}.png`);
    fs.writeFileSync(f, await grab(t)); console.log(f);
  }
} else if (has('video')) {
  const fps = Number(opt('fps', 30)), from = Number(opt('from', 0)), to = Number(opt('to', 120));
  const out = opt('out', path.join(outDir, 'sgr-master-silent.mov'));
  // Intermediate master: ProRes-like quality via high-bitrate H.264 intra-ish settings (yuv420p for compatibility).
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '12', '-pix_fmt', 'yuv420p', '-r', String(fps), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round((to - from) * fps), t0 = Date.now();
  for (let i = 0; i < n; i++) {
    const buf = await grab(from + i / fps);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(`frame ${i}/${n} · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r));
  console.log(out);
}
await browser.close(); server.close();
