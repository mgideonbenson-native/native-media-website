/**
 * Reusable components for the SGR v2 film.
 *  - 3D-ish models (added to a SOLID.Solid): track(), mast(), train()
 *  - map: ROUTE_STYLE (status grammar shared by the map and its legend)
 *  - editorial UI: sectionTitle(), callout(), counter(), barChart(), sourceNote(), legend()
 * All sizes are in metres for models and CSS pixels (1280 × 720 stage) for UI.
 */
(() => {
  const { svg, html, css, show, eo, eio, prog, fmt, clamp, lerp } = window.K;

  const C = {
    orange: '#E8752A', black: '#0b0b0a', charcoal: '#161615', charcoal2: '#1f1e1c', charcoal3: '#2a2826',
    cream: '#efe7d6', cream2: '#d9cfbb', white: '#ffffff', grey: '#8e8c86', grey2: '#5e5c57',
    // physical materials for the illustrations (restrained, natural)
    rail: '#8b8986', railHead: '#c9c7c2', concrete: '#a7a297', ballast: '#5f5c58', formation: '#4a3c31', steel: '#6e7174',
    body: '#e9e8e4', glass: '#1d2226', under: '#2c2d2f',
  };

  // ── Track (standard gauge by default) ──────────────────────────────────────────────────────────────
  // 60E1-type rail half-profile (lateral, height) in metres; mirrored to a closed outline.
  const RAIL_HALF = [[0.075, 0], [0.075, 0.012], [0.02, 0.026], [0.0085, 0.04], [0.0085, 0.13], [0.0215, 0.144], [0.036, 0.15], [0.036, 0.164], [0.03, 0.172], [0, 0.172]];
  const RAIL = RAIL_HALF.concat(RAIL_HALF.slice(0, -1).reverse().map(([y, z]) => [-y, z]));

  function track(S, { x0 = 0, x1 = 6, gauge = 1.435, pitch = 0.6, ballast = true, formation = true, fastenings = true, railColor = C.rail, sleeperColor = C.concrete, only } = {}) {
    const has = (k) => !only || only.includes(k);
    const sT = 0, sH = 0.21, sL = 2.6, sW = 0.26;           // sleeper top at z=0
    const head = 0.072, ry = gauge / 2 + head / 2;          // rail centreline offset (gauge is between inner head faces)
    if (formation && has('formation')) S.prism([[-4.6, -0.95], [4.6, -0.95], [3.2, -0.45], [-3.2, -0.45]], x0 - 0.4, x1 + 0.4, C.formation, { amb: 0.5 });
    if (ballast && has('ballast')) S.prism([[-3.2, -0.45], [3.2, -0.45], [1.75, -0.03], [-1.75, -0.03]], x0 - 0.2, x1 + 0.2, C.ballast, { amb: 0.5 });
    if (has('sleepers')) for (let x = x0 + pitch / 2; x < x1; x += pitch) S.box([x - sW / 2, -sL / 2, sT - sH], [sW, sL, sH], sleeperColor);
    if (fastenings && has('fastenings')) for (let x = x0 + pitch / 2; x < x1; x += pitch) for (const s of [-1, 1]) for (const o of [-1, 1]) {
      S.box([x - 0.05, s * ry + o * 0.1 - 0.025, sT], [0.1, 0.05, 0.045], '#3c3a37', { bias: -0.02 });
    }
    if (has('rails')) for (const s of [-1, 1]) {
      S.prism(RAIL.map(([y, z]) => [s * ry + y, sT + 0.008 + z]), x0, x1, railColor, { bias: -0.03 });
    }
    return { railY: ry, railTop: sT + 0.008 + 0.172 };
  }

  // ── Overhead line equipment ─────────────────────────────────────────────────────────────────────────
  function mast(S, x, { side = 1, off = 3.2, h = 8.0, wireH = 5.6 } = {}) {
    S.box([x - 0.1, side * off - 0.1, -0.45], [0.2, 0.2, h + 0.45], C.steel);            // mast (H-section read as a box at this scale)
    S.box([x - 0.35, side * off - 0.35, -0.9], [0.7, 0.7, 0.45], C.concrete);            // foundation
    const armZ = wireH + 1.3;
    S.box([x - 0.04, -0.2, armZ - 0.04], [0.08, side * off + 0.2, 0.08], C.steel);        // top tube (messenger support)
    S.box([x - 0.035, -0.15, wireH + 0.12], [0.07, side * off + 0.15, 0.06], C.steel);    // registration arm
    return { armZ, wireH };
  }

  /** catenary wires as projected polylines (drawn on top of the solids, thin) */
  function wires(g, P, x0, x1, span, { wireH = 5.6, sys = 1.2, color = '#b9b4ab', sw = 1.2, pulse = null } = {}) {
    while (g.firstChild) g.removeChild(g.firstChild);
    const line = (pts, attrs) => svg('path', { d: 'M' + pts.map((p) => P.p(p)).map((q) => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join('L'), fill: 'none', ...attrs }, g);
    for (let a = x0; a < x1; a += span) {
      const b = Math.min(x1, a + span), mess = [], cont = [];
      for (let k = 0; k <= 12; k++) { const t = k / 12, x = lerp(a, b, t); mess.push([x, 0, wireH + sys - sys * 0.75 * 4 * t * (1 - t)]); cont.push([x, 0, wireH]); }
      line(mess, { stroke: color, 'stroke-width': sw * 0.8 }); line(cont, { stroke: color, 'stroke-width': sw });
      for (let k = 1; k < 6; k++) { const t = k / 6, x = lerp(a, b, t); line([[x, 0, wireH], [x, 0, wireH + sys - sys * 0.75 * 4 * t * (1 - t)]], { stroke: color, 'stroke-width': sw * 0.5 }); }
    }
    if (pulse != null) { // energy travelling along the contact wire
      const x = lerp(x0, x1, pulse), L = (x1 - x0) * 0.18;
      line([[Math.max(x0, x - L), 0, wireH], [x, 0, wireH]], { stroke: C.orange, 'stroke-width': sw * 3, 'stroke-linecap': 'round', opacity: 0.95 });
    }
  }

  // ── Train: an eight-car EMU, body lofted from a rounded section; pointed nose; glazing, doors, bogies ──────
  const SEC = (() => {   // body half-section (y, z above rail top), smooth roof
    const h = [[1.42, 0.8], [1.58, 1.0], [1.6, 1.3], [1.6, 2.45], [1.56, 2.9], [1.45, 3.28], [1.22, 3.58], [0.85, 3.76], [0.42, 3.84], [0, 3.86]];
    return h.concat(h.slice(0, -1).reverse().map(([y, z]) => [-y, z]));
  })();
  function loft(S, rings, color, opt) {
    for (let i = 0; i < rings.length - 1; i++) {
      const a = rings[i], b = rings[i + 1];
      for (let j = 0; j < a.length; j++) {
        const k = (j + 1) % a.length;
        S.poly([a[j], b[j], b[k], a[k]], color, opt);
      }
    }
  }
  function car(S, x0, L, railTop, { nose = 0, nearSide = -1, glass = true } = {}) {
    // nose: +1 = pointed end at x0+L, -1 = pointed end at x0, 0 = intermediate car
    const NL = 6.5, rings = [];
    const xs = [];
    for (let i = 0; i <= 10; i++) xs.push(i / 10);
    const sample = (u) => {   // u in [0,1] along the car
      const x = x0 + u * L;
      let sw = 1, top = 3.86, bot = 0.8;
      const dTip = nose > 0 ? x0 + L - x : nose < 0 ? x - x0 : 99;
      if (dTip < NL) { const t = dTip / NL; sw = Math.max(0.12, Math.pow(1 - Math.pow(1 - t, 2.4), 0.55)); top = 1.3 + 2.56 * Math.pow(1 - Math.pow(1 - t, 2), 0.75); bot = 0.8 + 0.3 * Math.pow(1 - t, 3); }
      return SEC.map(([y, z]) => [x, y * sw, railTop + bot + (z - 0.8) * (top - bot) / 3.06]);
    };
    const us = [0, ...Array.from({ length: 9 }, (_, i) => (NL / L) * ((i + 1) / 9) ** 1.6), 0.5, ...Array.from({ length: 9 }, (_, i) => 1 - (NL / L) * ((9 - i) / 9) ** 1.6), 1];
    const uu = [...new Set(us.map((u) => +u.toFixed(4)))].sort((a, b) => a - b);
    for (const u of uu) rings.push(sample(u));
    loft(S, rings, C.body, { stroke: 'none', amb: 0.5 });
    if (!nose) { S.poly(rings[0].slice().reverse(), C.body, { stroke: 'none' }); S.poly(rings[rings.length - 1], C.body, { stroke: 'none' }); }
    // side glazing on the near side: window quads just outside the body surface
    if (glass) {
      const y = nearSide * 1.605, z0 = railTop + 2.05, z1 = railTop + 2.85;
      const xa = x0 + (nose < 0 ? NL + 0.8 : 1.0), xb = x0 + L - (nose > 0 ? NL + 0.8 : 1.0);
      const doors = [x0 + L * 0.25, x0 + L * 0.75];
      for (let x = xa; x < xb - 1.3; x += 2.0) {
        if (doors.some((d) => Math.abs(x + 0.8 - d) < 1.0)) continue;
        S.poly(nearSide < 0 ? [[x, y, z0], [x + 1.6, y, z0], [x + 1.6, y, z1], [x, y, z1]] : [[x, y, z0], [x, y, z1], [x + 1.6, y, z1], [x + 1.6, y, z0]], C.glass, { stroke: 'none', bias: -0.05, flat: true });
      }
      for (const d of doors) { // plug door outline + door window
        const q = (a, b, zA, zB, col, flat = true) => S.poly(nearSide < 0 ? [[a, y, zA], [b, y, zA], [b, y, zB], [a, y, zB]] : [[a, y, zA], [a, y, zB], [b, y, zB], [b, y, zA]], col, { stroke: 'none', bias: -0.06, flat });
        q(d - 0.66, d + 0.66, railTop + 1.0, railTop + 3.0, '#cfcdc8');
        q(d - 0.6, d + 0.6, railTop + 1.05, railTop + 2.95, '#e2e1dc');
        q(d - 0.38, d + 0.38, railTop + 2.1, railTop + 2.8, C.glass);
      }
      // grey skirt band
      S.poly(nearSide < 0 ? [[x0 + 0.3, y - 0.01, railTop + 0.82], [x0 + L - 0.3, y - 0.01, railTop + 0.82], [x0 + L - 0.3, y - 0.01, railTop + 1.02], [x0 + 0.3, y - 0.01, railTop + 1.02]]
        : [[x0 + 0.3, y + 0.01, railTop + 0.82], [x0 + 0.3, y + 0.01, railTop + 1.02], [x0 + L - 0.3, y + 0.01, railTop + 1.02], [x0 + L - 0.3, y + 0.01, railTop + 0.82]], '#55595d', { stroke: 'none', bias: -0.04, flat: true });
    }
    if (nose) { // wraparound windscreen: a dark band lofted just above the nose surface
      const tip = nose > 0 ? x0 + L : x0, s = nose > 0 ? -1 : 1, ws = [];
      for (const d of [1.9, 2.6, 3.3, 4.0, 4.6]) {
        const t = d / 6.5, sw = Math.max(0.12, Math.pow(1 - Math.pow(1 - t, 2.4), 0.55)), top = 1.3 + 2.56 * Math.pow(1 - Math.pow(1 - t, 2), 0.75);
        const z = railTop + 0.8 + (2.9 - 0.8) * (top - 0.8) / 3.06 + 0.02;
        ws.push([[tip + s * d, -1.48 * sw, z], [tip + s * d, -1.2 * sw, z + 0.25], [tip + s * d, 0, z + 0.36], [tip + s * d, 1.2 * sw, z + 0.25], [tip + s * d, 1.48 * sw, z]]);
      }
      for (let i = 0; i < ws.length - 1; i++) for (let j = 0; j < 4; j++) {
        const q = nose > 0 ? [ws[i][j], ws[i][j + 1], ws[i + 1][j + 1], ws[i + 1][j]] : [ws[i][j], ws[i + 1][j], ws[i + 1][j + 1], ws[i][j + 1]];
        S.poly(q, C.glass, { stroke: 'none', bias: -0.05, flat: true });
      }
    }
    // underframe cases, bogies (wheels as octagonal discs on the near side)
    S.box([x0 + 4.6, -1.2, railTop + 0.45], [L - 9.2, 2.4, 0.45], C.under, { stroke: 'none' });
    for (const bx of [x0 + 3.2 + (nose < 0 ? 1 : 0), x0 + L - 3.2 - (nose > 0 ? 1 : 0)]) {
      S.box([bx - 1.55, -1.05, railTop + 0.42], [3.1, 2.1, 0.32], '#232426', { stroke: 'none' });
      for (const wx of [bx - 1.25, bx + 1.25]) {
        const ring = []; for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; ring.push([wx + Math.cos(a) * 0.43, nearSide * 0.86, railTop + 0.43 + Math.sin(a) * 0.43]); }
        S.poly(nearSide < 0 ? ring : ring.slice().reverse(), '#3a3b3d', { stroke: 'none', bias: -0.02 });
      }
    }
  }
  function train(S, xNose, railTop, { cars = 8, gap = 0.9, L = 24.0, nearSide = -1 } = {}) {
    let x = xNose;
    for (let c = 0; c < cars; c++) {
      const len = L + (c === 0 || c === cars - 1 ? 1.2 : 0);
      car(S, x - len, len, railTop, { nose: c === 0 ? 1 : c === cars - 1 ? -1 : 0, nearSide });
      if (c < cars - 1) S.box([x - len - gap, -1.3, railTop + 0.9], [gap, 2.6, 2.9], '#1b1b1b', { stroke: 'none' });
      x -= len + gap;
    }
  }

  // ── Map: route status grammar ───────────────────────────────────────────────────────────────────────
  const ROUTE_STYLE = {
    operating: { stroke: C.orange, width: 5.5, dash: null, opacity: 1 },
    built: { stroke: C.orange, width: 3.2, dash: null, opacity: 0.62 },
    construction: { stroke: C.orange, width: 3.2, dash: [9, 6], opacity: 1 },
    'construction-indicative': { stroke: C.orange, width: 2.2, dash: [3, 6], opacity: 0.8 },
    'launched-indicative': { stroke: C.orange, width: 2.2, dash: [3, 6], opacity: 0.8 },
    'proposed-indicative': { stroke: C.cream, width: 2, dash: [1.5, 6], opacity: 0.7 },
    proposed: { stroke: C.cream, width: 2, dash: [1.5, 6], opacity: 0.7 },
  };

  // ── Editorial UI ────────────────────────────────────────────────────────────────────────────────────
  /** kicker + rule + title (+ sub), positioned at (x, y); returns {el, set(t,a,b)} */
  function sectionTitle(parent, { kicker, title, sub, x = 64, y = 64, size = '' , width = 560 }) {
    const el = html('div', 'block', `<span class="rule"></span><div class="kicker">${kicker}</div>
      <div class="title ${size}" style="margin-top:10px">${Array.isArray(title) ? title.join('<br>') : title}</div>${sub ? `<div class="sub" style="margin-top:14px">${sub}</div>` : ''}`, parent);
    css(el, { left: x + 'px', top: y + 'px', width: width + 'px' });
    const rule = el.querySelector('.rule');
    return {
      el,
      /** reveal from a (fade + rise), hide at b */
      set(t, a, b) {
        const p = eo(prog(t, a, 0.9)), q = eio(prog(t, b - 0.6, 0.6));
        show(el, Math.min(p, 1 - q), { transform: `translateY(${((1 - p) * 14 - q * 8).toFixed(1)}px)` });
        css(rule, { width: (44 * eo(prog(t, a, 0.7))).toFixed(1) + 'px' });
      },
    };
  }

  function sourceNote(parent, text, { x = 64, y = 680, align = 'left', width = 900 } = {}) {
    const el = html('div', 'block note', text, parent);
    css(el, { left: (align === 'right' ? 1280 - x - width : x) + 'px', top: y + 'px', width: width + 'px', textAlign: align });
    return { el, set(t, a, b) { show(el, Math.min(eo(prog(t, a, 0.8)), 1 - eio(prog(t, b - 0.5, 0.5)))); } };
  }

  /** an SVG leader-line callout: dot at (ax, ay), elbow to the label at (lx, ly) */
  function callout(parent, label, { ax, ay, lx, ly, align = 'left', color = C.cream } = {}) {
    const g = svg('g', {}, parent);
    const dot = svg('circle', { cx: ax, cy: ay, r: 3.5, fill: C.orange }, g);
    const ln = svg('path', { fill: 'none', stroke: color, 'stroke-width': 1.2, opacity: 0.8 }, g);
    const tx = svg('text', { x: lx + (align === 'left' ? 8 : -8), y: ly + 5, fill: C.white, 'font-size': 15, 'font-weight': 500, 'text-anchor': align === 'left' ? 'start' : 'end', 'font-family': 'Poppins' }, g);
    tx.textContent = label;
    return {
      g, move(nax, nay, nlx, nly) { ax = nax; ay = nay; lx = nlx ?? lx; ly = nly ?? ly; dot.setAttribute('cx', ax); dot.setAttribute('cy', ay); tx.setAttribute('x', lx + (align === 'left' ? 8 : -8)); tx.setAttribute('y', ly + 5); },
      set(p, a = 1) {
        const ex = lerp(ax, lx, eo(clamp(p * 1.4))), ey = lerp(ay, ly, eo(clamp(p * 1.4)));
        ln.setAttribute('d', `M${ax},${ay}L${ex.toFixed(1)},${ey.toFixed(1)}`);
        g.setAttribute('opacity', (a * clamp(p * 3)).toFixed(3));
        tx.setAttribute('opacity', clamp((p - 0.55) * 3).toFixed(3));
      },
    };
  }

  /** a number that counts only once, when it is introduced, to its verified value */
  function counter(parent, { x, y, size = 96, unit = '', unitSize = 0.4, decimals = 0, color = C.white, unitColor = C.orange }) {
    const el = html('div', 'block', `<span class="num"></span><span class="u"></span>`, parent);
    const n = el.querySelector('.num'), u = el.querySelector('.u');
    css(el, { left: x + 'px', top: y + 'px' });
    css(n, { fontSize: size + 'px', color }); css(u, { fontSize: size * unitSize + 'px', fontWeight: 600, color: unitColor, marginLeft: size * 0.12 + 'px' });
    u.textContent = unit;
    return { el, set(value, p, a) { n.textContent = fmt(value * eo(clamp(p)), decimals); show(el, a); } };
  }

  /**
   * Horizontal bar chart with one shared, zero-based scale.
   * rows: [{label, value, lo?, hi?, display, tag, tagKind ('solid'|'grey'|'line'), period}], axis: {max, step, unit, fmt}
   */
  function barChart(parent, { x, y, w, rowH = 92, labelW = 250, rows, axis }) {
    const g = svg('g', { transform: `translate(${x},${y})` }, parent);
    const plotW = w - labelW, sx = (v) => labelW + (v / axis.max) * plotW;
    const grid = svg('g', {}, g), bars = [];
    for (let v = 0; v <= axis.max + 1e-9; v += axis.step) {
      svg('line', { x1: sx(v), x2: sx(v), y1: -14, y2: rows.length * rowH - 10, stroke: C.cream, 'stroke-opacity': v === 0 ? 0.55 : 0.12, 'stroke-width': 1 }, grid);
      const t = svg('text', { x: sx(v), y: rows.length * rowH + 12, fill: C.grey, 'font-size': 12, 'text-anchor': 'middle', 'font-family': 'Poppins' }, grid);
      t.textContent = axis.fmt ? axis.fmt(v) : v;
    }
    // baseline (the gauge dimension line lands here in the transition into the first chart)
    svg('line', { x1: labelW, x2: labelW + plotW, y1: rows.length * rowH - 10, y2: rows.length * rowH - 10, stroke: C.cream, 'stroke-opacity': 0.45, 'stroke-width': 1.2 }, grid);
    if (axis.title) { const at = svg('text', { x: labelW + plotW, y: rows.length * rowH + 32, fill: C.grey, 'font-size': 12, 'text-anchor': 'end', 'font-family': 'Poppins' }, grid); at.textContent = axis.title; }
    rows.forEach((r, i) => {
      const ry = i * rowH;
      const lab = svg('text', { x: 0, y: ry + 20, fill: C.white, 'font-size': 16, 'font-weight': 500, 'font-family': 'Poppins' }, g); lab.textContent = r.label;
      const per = svg('text', { x: 0, y: ry + 40, fill: C.grey, 'font-size': 12, 'font-family': 'Poppins' }, g); per.textContent = r.period || '';
      const bar = svg('rect', { x: labelW, y: ry + 6, height: 34, width: 0, fill: r.kind === 'forecast' ? 'none' : (r.color || C.orange), stroke: r.kind === 'forecast' ? C.orange : 'none', 'stroke-width': 2, 'stroke-dasharray': r.kind === 'forecast' ? '7 5' : null, rx: 1 }, g);
      const range = r.hi != null ? svg('rect', { x: sx(r.lo), y: ry + 6, height: 34, width: 0, fill: 'url(#rangeHatch)', stroke: C.grey, 'stroke-width': 1 }, g) : null;
      const val = svg('text', { x: 0, y: ry + 31, fill: C.white, 'font-size': 22, 'font-weight': 600, 'font-family': 'Poppins' }, g); val.textContent = r.display;
      const tagG = svg('g', {}, g);
      const tw = 10 + r.tag.length * 8.2;
      svg('rect', { x: 0, y: -12, width: tw, height: 20, rx: 2, fill: r.tagKind === 'line' ? 'none' : r.tagKind === 'grey' ? C.grey2 : C.orange, stroke: r.tagKind === 'line' ? C.orange : 'none', 'stroke-dasharray': r.tagKind === 'line' ? '3 2' : null }, tagG);
      const tt = svg('text', { x: tw / 2, y: 2, fill: r.tagKind === 'solid' ? C.black : r.tagKind === 'line' ? C.orange : C.white, 'font-size': 10.5, 'font-weight': 600, 'letter-spacing': 1.6, 'text-anchor': 'middle', 'font-family': 'Poppins' }, tagG); tt.textContent = r.tag;
      bars.push({ r, ry, bar, range, val, tagG, lab, per });
    });
    return {
      g, sx,
      set(t, starts, a = 1) {
        g.setAttribute('opacity', a.toFixed(3));
        bars.forEach((b, i) => {
          const p = eio(prog(t, starts[i], 1.4)), r = b.r;
          const endV = r.hi != null ? r.lo : r.value;
          const wv = (sx(endV) - labelW) * p;
          b.bar.setAttribute('width', Math.max(0, wv).toFixed(1));
          if (r.hi != null) { // reported range: hatched extension from lo to hi
            const q = eio(prog(t, starts[i] + 1.2, 0.8));
            b.range.setAttribute('width', ((sx(r.hi) - sx(r.lo)) * q).toFixed(1));
          }
          const endX = r.hi != null ? labelW + wv + (sx(r.hi) - sx(r.lo)) * eio(prog(t, starts[i] + 1.2, 0.8)) : labelW + wv;
          b.val.setAttribute('x', (endX + 14).toFixed(1));
          b.val.setAttribute('opacity', clamp((p - 0.3) * 2).toFixed(3));
          const vw = b.val.getComputedTextLength ? b.val.getComputedTextLength() : 100;
          b.tagG.setAttribute('transform', `translate(${(endX + 26 + vw).toFixed(1)},${b.ry + 23})`);
          b.tagG.setAttribute('opacity', clamp((p - 0.7) * 3).toFixed(3));
          const la = clamp(prog(t, starts[i] - 0.4, 0.5));
          b.lab.setAttribute('opacity', la); b.per.setAttribute('opacity', la);
        });
      },
    };
  }

  function legend(parent, items, { x, y }) {
    const el = html('div', 'block', '', parent);
    css(el, { left: x + 'px', top: y + 'px' });
    items.forEach((it) => {
      const s = ROUTE_STYLE[it.kind];
      const row = html('div', '', `<svg width="44" height="10" style="vertical-align:middle;margin-right:10px"><line x1="2" y1="5" x2="42" y2="5" stroke="${s.stroke}" stroke-width="${Math.min(5, s.width)}" stroke-opacity="${s.opacity}" ${s.dash ? `stroke-dasharray="${s.dash.join(' ')}"` : ''} stroke-linecap="round"/></svg><span class="label" style="font-size:13px">${it.label}</span>`, el);
      css(row, { height: '24px' });
    });
    return { el, set(a) { show(el, a); } };
  }

  window.COMP = { C, track, mast, wires, train, ROUTE_STYLE, sectionTitle, sourceNote, callout, counter, barChart, legend };
})();
