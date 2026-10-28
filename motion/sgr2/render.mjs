/**
 * Render the v2 film. Serves the repo root, opens index.html in headless Chromium at 1280×720, sets each frame with
 * renderFrame(t) and screenshots the page (DOM + SVG + CSS 3D), piping frames to ffmpeg.
 *
 *   node motion/sgr2/render.mjs --stills 5,20,40           PNG stills → motion/sgr2/out/
 *   node motion/sgr2/render.mjs --sheet 0,120,4            contact sheet every 4 s → out/sheet.jpg
 *   node motion/sgr2/render.mjs --video [--from 0 --to 120] → out/sgr2-silent.mp4
 *   node motion/sgr2/render.mjs --serve                    preview at http://127.0.0.1:4410/motion/sgr2/index.html?t=30
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const { chromium } = createRequire(import.meta.url)('playwright');   // the machine's Playwright (not a project dependency)
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const outDir = path.join(here, 'out');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d; };
const has = (k) => args.includes(`--${k}`);

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.ttf': 'font/ttf', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] ?? 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
const port = Number(opt('port', 4410));
await new Promise((r) => server.listen(port, '127.0.0.1', r));
const url = `http://127.0.0.1:${port}/motion/sgr2/index.html`;
if (has('serve')) { console.log(url + '?t=30'); await new Promise(() => {}); }

fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => { console.error('page error:', e.message); process.exitCode = 1; });
page.on('console', (m) => { if (m.type() === 'error') console.error('console:', m.text()); });
await page.goto(url);
await page.waitForFunction(() => window.READY === true, null, { timeout: 60000 });
const grab = async (t) => { await page.evaluate((t) => window.renderFrame(t), t); return page.screenshot({ type: 'png' }); };

if (opt('stills')) {
  for (const t of opt('stills').split(',').map(Number)) {
    const f = path.join(outDir, `still-${t.toFixed(1).padStart(5, '0')}.png`);
    fs.writeFileSync(f, await grab(t)); console.log(f);
  }
} else if (opt('sheet')) {
  const [a, b, step] = opt('sheet').split(',').map(Number);
  const dir = path.join(outDir, 'sheet'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  let i = 0;
  for (let t = a; t <= b + 1e-9; t += step) fs.writeFileSync(path.join(dir, `s${String(i++).padStart(3, '0')}.png`), await grab(t));
  spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(dir, 's%03d.png'), '-vf', `scale=426:240,drawtext=text='%{n}':x=4:y=4:fontsize=12:fontcolor=yellow,tile=5x${Math.ceil(i / 5)}`, '-frames:v', '1', path.join(outDir, 'sheet.jpg')]);
  console.log(path.join(outDir, 'sheet.jpg'), i, 'frames');
} else if (has('video')) {
  const fps = 30, from = Number(opt('from', 0)), to = Number(opt('to', 120));
  const out = opt('out', path.join(outDir, 'sgr2-silent.mp4'));
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round((to - from) * fps), t0 = Date.now();
  for (let i = 0; i < n; i++) {
    const buf = await grab(from + i / fps);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 300 === 0) console.log(`frame ${i}/${n} · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r));
  console.log(out);
}
await browser.close(); server.close();
