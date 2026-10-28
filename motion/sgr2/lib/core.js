/** Core helpers: maths, easing, timing windows, DOM/SVG builders. No dependencies. */
(() => {
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  const prog = (t, a, d) => clamp((t - a) / d);
  const eio = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);   // cubic in-out: camera moves
  const eo = (p) => 1 - Math.pow(1 - p, 4);                                         // quart out: reveals
  const ei = (p) => p * p * p;
  /** 0→1 over [a, a+fi], 1 until b-fo, then →0 at b */
  const win = (t, a, b, fi = 0.6, fo = 0.6) => Math.min(eo(prog(t, a, fi)), 1 - eio(prog(t, b - fo, fo)));
  /** keyframed value: keys = [[t, value-or-object], …], eased with eio between keys */
  const keys = (ks, t) => {
    if (t <= ks[0][0]) return ks[0][1];
    for (let i = 0; i < ks.length - 1; i++) {
      const [ta, a] = ks[i], [tb, b] = ks[i + 1];
      if (t <= tb) {
        const p = eio((t - ta) / (tb - ta));
        if (typeof a === 'number') return lerp(a, b, p);
        const o = {}; for (const k in a) o[k] = lerp(a[k], b[k], p); return o;
      }
    }
    return ks[ks.length - 1][1];
  };
  const fmt = (n, d = 0) => n.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });
  const rnd = (seed) => { let s = seed >>> 0; return () => { s += 0x6d2b79f5; let r = Math.imul(s ^ (s >>> 15), 1 | s); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; };

  const SVGNS = 'http://www.w3.org/2000/svg';
  const svg = (tag, attrs = {}, parent) => {
    const e = document.createElementNS(SVGNS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  const html = (tag, cls, content, parent) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (content != null) e.innerHTML = content;
    if (parent) parent.appendChild(e);
    return e;
  };
  /** set only what changed (cheap per-frame updates) */
  const css = (e, props) => { for (const k in props) { const v = String(props[k]); if (e.style[k] !== v) e.style[k] = v; } };
  const show = (e, a, extra = {}) => css(e, { opacity: a.toFixed(3), visibility: a > 0.001 ? 'visible' : 'hidden', ...extra });

  window.K = { clamp, lerp, prog, eio, eo, ei, win, keys, fmt, rnd, svg, html, css, show };
})();
