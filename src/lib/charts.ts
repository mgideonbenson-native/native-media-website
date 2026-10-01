/**
 * Small, dependency-free chart helpers (bar + line) following the Native Media data-visualization rules:
 * thin marks, one axis, selective labels, a tooltip on hover AND keyboard focus, legend for 2+ series,
 * and every value also available in a table. Labels are written with textContent (never innerHTML).
 */
const NS = 'http://www.w3.org/2000/svg';
const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) => {
  const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e;
};
const sv = (tag: string, attrs: Record<string, string | number> = {}) => {
  const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v)); return e;
};
export const fmt = (n: number) => n.toLocaleString('en-GB', { maximumFractionDigits: 1 });

/** Tooltip shared by a chart. Content is built from text nodes. */
function makeTip(host: HTMLElement) {
  const tip = el('div', 'viz-tip'); tip.setAttribute('role', 'status'); tip.hidden = true; host.append(tip);
  return {
    show(x: number, y: number, rows: { key?: string; label: string; value: string }[], head?: string) {
      tip.replaceChildren();
      if (head) tip.append(el('div', 'viz-tip__head', head));
      rows.forEach((r) => {
        const row = el('div', 'viz-tip__row');
        if (r.key) { const k = el('span', 'viz-tip__key'); k.style.background = r.key; row.append(k); }
        row.append(el('strong', undefined, r.value), el('span', 'viz-tip__lab', r.label)); tip.append(row);
      });
      tip.hidden = false;
      const w = tip.offsetWidth, hostW = host.clientWidth;
      tip.style.left = `${Math.max(4, Math.min(x + 14, hostW - w - 4))}px`; tip.style.top = `${Math.max(4, y - 10)}px`;
    },
    hide() { tip.hidden = true; },
  };
}

/** Horizontal bars (HTML/CSS, so it is fluid on phones). One series, one colour, value at the bar tip. */
export function barChart(host: HTMLElement, items: { label: string; value: number }[], opts: { units: string }) {
  host.replaceChildren(); host.classList.add('viz-bars'); host.style.position = 'relative';
  const max = Math.max(...items.map((i) => i.value), 1);
  const tip = makeTip(host);
  const list = el('ul', 'viz-bars__list');
  items.forEach((it) => {
    const li = el('li', 'viz-bars__row'); li.tabIndex = 0;
    li.setAttribute('aria-label', `${it.label}: ${fmt(it.value)} ${opts.units}`);
    const track = el('span', 'viz-bars__track'); const bar = el('span', 'viz-bars__bar'); bar.style.width = `${(it.value / max) * 100}%`; track.append(bar);
    li.append(el('span', 'viz-bars__label', it.label), track, el('span', 'viz-bars__value', fmt(it.value)));
    const place = (e: PointerEvent | FocusEvent) => {
      const r = host.getBoundingClientRect();
      const t = e instanceof PointerEvent ? { x: e.clientX - r.left, y: e.clientY - r.top } : { x: li.offsetLeft + 80, y: li.offsetTop + 10 };
      tip.show(t.x, t.y, [{ label: it.label, value: `${fmt(it.value)} ${opts.units}` }]);
    };
    li.addEventListener('pointermove', place); li.addEventListener('focus', place);
    li.addEventListener('pointerleave', tip.hide); li.addEventListener('blur', tip.hide);
    list.append(li);
  });
  host.append(list);
}

export type Series = { name: string; color: string; dash?: string; values: (number | null)[] };

/** Line chart: x categories (e.g. years), 1 to 4 series. Crosshair + single tooltip listing every series. */
export function lineChart(host: HTMLElement, xs: string[], series: Series[], opts: { units: string; title: string }) {
  host.replaceChildren(); host.classList.add('viz-line'); host.style.position = 'relative';
  const hidden = new Set<string>();
  const legend = el('ul', 'viz-legend');
  const plot = el('div', 'viz-line__plot'); plot.style.position = 'relative';
  host.append(series.length > 1 ? legend : plot, ...(series.length > 1 ? [plot] : []));
  const tip = makeTip(plot);
  let idx = xs.length - 1; let drawn: (() => void) | null = null;

  const draw = () => {
    plot.querySelector('svg')?.remove();
    const W = Math.max(280, plot.clientWidth), H = W < 480 ? 250 : 320;
    const m = { l: 44, r: 16, t: 12, b: 28 };
    const live = series.filter((s) => !hidden.has(s.name));
    const maxV = Math.max(1, ...live.flatMap((s) => s.values.filter((v): v is number => v !== null)));
    const step = niceStep(maxV / 4); const top = Math.ceil(maxV / step) * step;
    const X = (i: number) => m.l + (xs.length === 1 ? (W - m.l - m.r) / 2 : (i * (W - m.l - m.r)) / (xs.length - 1));
    const Y = (v: number) => m.t + (1 - v / top) * (H - m.t - m.b);
    const svg = sv('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, role: 'img', tabindex: 0, 'aria-label': `${opts.title}. Line chart. Use left and right arrow keys to read values; a table follows.` });
    for (let v = 0; v <= top + 1e-9; v += step) {
      svg.append(sv('line', { x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v), class: 'viz-grid' }));
      const t = sv('text', { x: m.l - 8, y: Y(v) + 4, 'text-anchor': 'end', class: 'viz-tick' }); t.textContent = fmt(v); svg.append(t);
    }
    const every = W < 480 && xs.length > 6 ? 2 : 1;
    xs.forEach((x, i) => { if (i % every === 0) { const t = sv('text', { x: X(i), y: H - 8, 'text-anchor': 'middle', class: 'viz-tick' }); t.textContent = x; svg.append(t); } });
    live.forEach((s) => {
      const pts = s.values.map((v, i) => (v === null ? null : [X(i), Y(v)] as const));
      const d = pts.map((p, i) => (p ? `${pts[i - 1] ? 'L' : 'M'}${p[0]},${p[1]}` : '')).join(' ');
      svg.append(sv('path', { d, fill: 'none', stroke: s.color, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', ...(s.dash ? { 'stroke-dasharray': s.dash } : {}) }));
    });
    const cross = sv('line', { y1: m.t, y2: H - m.b, class: 'viz-cross' }); svg.append(cross);
    const dots = live.map((s) => { const c = sv('circle', { r: 5, fill: s.color, stroke: 'var(--viz-surface)', 'stroke-width': 2 }); svg.append(c); return c; });
    // direct label at the line end when there is room (<= 4 series, ends >= 14px apart)
    const ends = live.map((s) => ({ s, y: Y(s.values[s.values.length - 1] ?? 0) })).sort((a, b) => a.y - b.y);
    if (live.length > 1 && live.length <= 4 && ends.every((e, i) => i === 0 || e.y - ends[i - 1].y >= 14) && W >= 480) {
      ends.forEach(({ s, y }) => { const t = sv('text', { x: W - m.r - 2, y: y - 8, 'text-anchor': 'end', class: 'viz-end' }); t.textContent = s.name; svg.append(t); });
    }
    const focus = (i: number) => {
      idx = Math.max(0, Math.min(xs.length - 1, i)); const x = X(idx);
      cross.setAttribute('x1', String(x)); cross.setAttribute('x2', String(x));
      live.forEach((s, k) => { const v = s.values[idx]; dots[k].setAttribute('cx', String(x)); dots[k].setAttribute('cy', String(v === null ? -50 : Y(v))); });
      const rows = live.map((s) => ({ key: s.color, label: s.name, value: s.values[idx] === null ? 'No data' : `${fmt(s.values[idx] as number)} ${opts.units}` }));
      tip.show(x, m.t + 20, rows, xs[idx]);
    };
    svg.addEventListener('pointermove', (e) => { const r = svg.getBoundingClientRect(); const px = e.clientX - r.left; focus(Math.round(((px - m.l) / (W - m.l - m.r)) * (xs.length - 1))); });
    svg.addEventListener('pointerleave', () => { cross.setAttribute('x1', '-10'); cross.setAttribute('x2', '-10'); dots.forEach((d) => d.setAttribute('cy', '-50')); tip.hide(); });
    svg.addEventListener('focus', () => focus(idx));
    svg.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') { e.preventDefault(); focus(idx - 1); } if (e.key === 'ArrowRight') { e.preventDefault(); focus(idx + 1); } });
    svg.addEventListener('blur', tip.hide);
    plot.prepend(svg);
  };
  drawn = draw;

  series.forEach((s) => {
    const li = el('li'); const b = el('button', 'viz-legend__btn'); b.type = 'button'; b.setAttribute('aria-pressed', 'true');
    const key = el('span', 'viz-legend__key'); key.style.background = s.color; if (s.dash) key.style.opacity = '0.75';
    b.append(key, el('span', undefined, s.name));
    b.addEventListener('click', () => { const off = !hidden.has(s.name); if (off && series.length - hidden.size <= 1) return; off ? hidden.add(s.name) : hidden.delete(s.name); b.setAttribute('aria-pressed', String(!off)); b.classList.toggle('is-off', off); drawn?.(); });
    li.append(b); legend.append(li);
  });
  draw();
  new ResizeObserver(() => drawn?.()).observe(plot);
}

function niceStep(raw: number) {
  const p = Math.pow(10, Math.floor(Math.log10(raw || 1))); const f = raw / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
}

/** Accessible data table (always rendered next to a chart). */
export function dataTable(host: HTMLElement, head: string[], rows: (string | number)[][], caption: string) {
  host.replaceChildren();
  const t = el('table', 'viz-table'); const c = el('caption', undefined, caption); const th = el('thead'); const tr = el('tr');
  head.forEach((h) => { const c2 = el('th', undefined, h); c2.scope = 'col'; tr.append(c2); }); th.append(tr);
  const tb = el('tbody'); rows.forEach((r) => { const row = el('tr'); r.forEach((v, i) => row.append(i === 0 ? Object.assign(el('th', undefined, String(v)), { scope: 'row' }) : el('td', 'num', typeof v === 'number' ? fmt(v) : String(v)))); tb.append(row); });
  t.append(c, th, tb); host.append(t);
}

export function downloadCsv(filename: string, head: string[], rows: (string | number)[][]) {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [head, ...rows].map((r) => r.map(esc).join(',')).join('\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = filename; a.click(); URL.revokeObjectURL(a.href);
}
