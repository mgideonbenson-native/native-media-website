/**
 * Turns a built copy of the site into a "portable" one that works from any folder or address
 * (for example inside a file host that serves pages from a sub-path), by rewriting links to be relative.
 *
 *   PUBLIC_NOINDEX=true npx astro build --outDir /tmp/preview-site
 *   node scripts/make-portable-preview.mjs /tmp/preview-site
 *
 * Rewrites: href/src/poster/srcset in HTML, url() in CSS, and the search page's file and link addresses.
 * Directory links gain "index.html" because plain file hosts do not serve folders automatically.
 * This is for previews only. Do not use the output as the live site.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? 'dist');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const files = walk(root);

/** '/about/' -> 'about/index.html', '/_astro/x.css?v=1' -> '_astro/x.css?v=1', '/' -> 'index.html' */
const rootRelative = (u) => {
  const m = /^([^?#]*)([?#].*)?$/.exec(u); let p = m[1].replace(/^\//, ''); const tail = m[2] ?? '';
  if (p === '' || p.endsWith('/')) p += 'index.html'; else if (!/\.[A-Za-z0-9]+$/.test(p.split('/').pop())) p += '/index.html';
  return p + tail;
};
const fromDir = (fileDir, u) => {
  const target = rootRelative(u); const rel = path.posix.relative(fileDir, target.split(/[?#]/)[0]); const tail = target.slice(target.split(/[?#]/)[0].length);
  return (rel === '' ? '.' : rel) + tail;
};
const isRootAbs = (u) => u.startsWith('/') && !u.startsWith('//');

let changed = 0;
for (const f of files) {
  const rel = path.relative(root, f).split(path.sep).join('/'); const dir = path.posix.dirname(rel); const ext = path.extname(f);
  if (ext === '.html') {
    let h = fs.readFileSync(f, 'utf8');
    h = h.replace(/(\s(?:href|src|poster))="([^"]*)"/g, (m, a, v) => (isRootAbs(v) ? `${a}="${fromDir(dir, v)}"` : m));
    h = h.replace(/(\ssrcset)="([^"]*)"/g, (m, a, v) => `${a}="${v.split(',').map((part) => { const [u, ...r] = part.trim().split(/\s+/); return [isRootAbs(u) ? fromDir(dir, u) : u, ...r].join(' '); }).join(', ')}"`);
    // Canonical and social tags keep the real, absolute address on purpose.
    fs.writeFileSync(f, h); changed++;
  } else if (ext === '.css') {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/url\((["']?)(\/[^)"']+)\1\)/g, (m, q, u) => (isRootAbs(u) ? `url(${q}${fromDir(dir, u)}${q})` : m));
    fs.writeFileSync(f, c); changed++;
  } else if (ext === '.js' && /search-index/.test(fs.readFileSync(f, 'utf8'))) {
    let j = fs.readFileSync(f, 'utf8');
    j = j.replace(/fetch\(`\/search-index\.json`\)/, 'fetch(new URL(`../search-index.json`,import.meta.url))');
    j = j.replace(/(\w)\.href=(\w)\.href;/, '$1.href=new URL($2.href,new URL(`../`,import.meta.url)).href;');
    fs.writeFileSync(f, j); changed++;
  } else if (rel === 'search-index.json') {
    const items = JSON.parse(fs.readFileSync(f, 'utf8')).map((e) => ({ ...e, href: rootRelative(e.href) }));
    fs.writeFileSync(f, JSON.stringify(items)); changed++;
  }
}
for (const drop of ['robots.txt', 'sitemap-index.xml', 'sitemap-0.xml']) fs.rmSync(path.join(root, drop), { force: true });
console.log(`Made ${root} portable (${changed} files rewritten).`);
