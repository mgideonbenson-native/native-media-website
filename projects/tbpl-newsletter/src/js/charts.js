/* SVG data graphics for the TBPL newsletter. Each chart sizes itself to its slot and draws in CSS px
 * (1 user unit = 1 px), so print sizes stay predictable. Values always come from TBPL_ISSUE.stats. */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const pt = n => n * 96 / 72; // points to px
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

  function svg(el, h) {
    const r = el.getBoundingClientRect();
    const w = Math.round(r.width), height = Math.round(h || r.height);
    el.innerHTML = `<svg xmlns="${NS}" viewBox="0 0 ${w} ${height}" width="${w}" height="${height}" role="img"></svg>`;
    return { s: el.firstChild, w, h: height };
  }
  function add(parent, tag, attrs, text) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    parent.appendChild(n);
    return n;
  }
  const T = (p, x, y, str, o = {}) => add(p, 'text', {
    x, y, 'font-family': o.family || css('--f-sans'), 'font-size': pt(o.size || 7), 'font-weight': o.weight || 500,
    fill: o.fill || css('--ink'), 'text-anchor': o.anchor || 'start', 'letter-spacing': o.ls || 0,
    ...(o.var ? { style: `font-variation-settings:${o.var}` } : {}), ...(o.attrs || {}) }, str);

  /* 1. Annual sales: three approximate values, so each bar carries the source's own qualifier word,
        and the top of each bar is a dashed band rather than a hard edge. */
  function salesBars(el, I) {
    const st = I.stats.salesAnnual;
    const { s, w, h } = svg(el);
    s.setAttribute('aria-label', 'Annual sales, TZS billion: ' + st.series.map(d => `${d.period} ${d.qualifier} ${d.value}`).join('; '));
    const top = pt(28), base = h - pt(32), left = pt(2), right = w - pt(2);
    const max = 12, y = v => base - (base - top) * v / max;
    // gridlines
    [0, 4, 8, 12].forEach(v => {
      add(s, 'line', { x1: left, x2: right, y1: y(v), y2: y(v), stroke: v ? css('--rule') : css('--ink'), 'stroke-width': v ? 0.6 : 1.2, 'stroke-dasharray': v ? '1.5 2.5' : '' });
      if (v) T(s, right, y(v) - pt(2.5), `${v} bn`, { size: 6.4, anchor: 'end', fill: css('--ink-3') });
    });
    const n = st.series.length, slot = (right - left) / n, bw = slot * 0.5;
    st.series.forEach((d, i) => {
      const x = left + slot * i + (slot - bw) / 2, yv = y(d.value), last = i === n - 1;
      const fill = last ? css('--tbpl-blue') : css('--blue-deep');
      const band = Math.min(pt(5), base - yv);
      add(s, 'rect', { x, y: yv + band, width: bw, height: base - yv - band, fill });
      // uncertainty band: the value is approximate
      add(s, 'rect', { x, y: yv, width: bw, height: band, fill, opacity: 0.35 });
      add(s, 'line', { x1: x, x2: x + bw, y1: yv, y2: yv, stroke: fill, 'stroke-width': 1, 'stroke-dasharray': '2 1.6' });
      // value: big numeral set above the bar
      const g = add(s, 'g', {});
      const lbl = T(g, x + bw / 2, yv - pt(3), '', { size: d.value >= 10 ? 22 : 19, anchor: 'middle', family: css('--f-num'), weight: 600, fill: css('--ink'), var: "'opsz' 144" });
      // the approximate sign is set in the sans: the display face draws it as a hairline at this size
      add(lbl, 'tspan', { 'font-family': css('--f-sans'), 'font-weight': 700, 'font-size': pt(d.value >= 10 ? 17 : 15), dy: 0 }, '≈');
      add(lbl, 'tspan', {}, String(d.value));
      T(s, x + bw / 2, base + pt(11), d.period, { size: 7.6, anchor: 'middle', weight: 700 });
      T(s, x + bw / 2, base + pt(20), d.qualifier, { size: 7.4, anchor: 'middle', fill: css('--ink-2'), attrs: { 'font-style': 'italic' }, family: css('--f-text') });
    });
    
  }

  /* 2. Composition of the cumulative total: domestic vs export. */
  function salesSplit(el, I) {
    const dom = I.stats.salesDomestic.value, exp = I.stats.salesExport.value, tot = dom + exp;
    const { s, w, h } = svg(el);
    s.setAttribute('aria-label', `Of TZS ${I.stats.salesCumulative.value} billion: domestic ${dom} billion, exports ${exp} billion`);
    const y0 = pt(20), bh = pt(13), xw = w * dom / tot;
    add(s, 'rect', { x: 0, y: y0, width: xw, height: bh, fill: css('--blue-deep') });
    add(s, 'rect', { x: xw + 1, y: y0, width: w - xw - 1, height: bh, fill: css('--tbpl-green') });
    T(s, 0, y0 - pt(5), 'Domestic', { size: 7, weight: 700, fill: css('--ink') });
    T(s, pt(4), y0 + bh / 2 + pt(2.6), 'TZS 18.79 bn', { size: 7.6, weight: 700, fill: '#fff' });
    // leader to the thin export slice
    add(s, 'path', { d: `M${w - (w - xw) / 2} ${y0 + bh + 2} V${y0 + bh + pt(9)} H${w - pt(64)}`, fill: 'none', stroke: css('--ink'), 'stroke-width': 0.8 });
    T(s, w - pt(66), y0 + bh + pt(11.5), 'Exports  TZS 710 m', { size: 7, weight: 700, anchor: 'end', fill: css('--green-deep') });
    T(s, w, y0 - pt(5), 'Total ≈ TZS 19.50 bn', { size: 7, weight: 700, anchor: 'end', fill: css('--ink') });
  }

  /* 3. Councils served: unit chart, one dot per council. The shortfall is drawn as empty dots. */
  function councilDots(el, I) {
    const [a, b] = I.stats.councils.series;
    const { s, w, h } = svg(el);
    s.setAttribute('aria-label', `Councils served: ${a.value} in ${a.period}, ${b.value} in ${b.period}`);
    const perRow = +(el.dataset.perRow || 30), labelW = pt(44), gap = (w - labelW) / perRow, r = Math.min(gap * 0.36, pt(2.1));
    const rows = Math.ceil(a.value / perRow), blockH = rows * gap;
    [[a, 0], [b, 1]].forEach(([d, k]) => {
      const y0 = pt(6) + k * (blockH + pt(14));
      T(s, 0, y0 + pt(9), String(d.value), { size: 17, family: css('--f-num'), weight: 600, var: "'opsz' 144" });
      T(s, 0, y0 + pt(18), d.period, { size: 6.8, weight: 700, fill: css('--ink-2') });
      for (let i = 0; i < a.value; i++) {
        const cx = labelW + (i % perRow) * gap + gap / 2, cy = y0 + Math.floor(i / perRow) * gap + gap / 2;
        const filled = i < d.value;
        add(s, 'circle', { cx, cy, r, fill: filled ? (k ? css('--tbpl-blue') : css('--blue-deep')) : 'none', stroke: filled ? 'none' : css('--ink-3'), 'stroke-width': 0.7 });
      }
    });
  }

  /* 4. Regional reach map: export markets vs. countries that received samples (kept distinct, flag F7). */
  function regionalMap(el, I) {
    const M = window.TBPL_MAPS.regional;
    const r = el.getBoundingClientRect();
    const exp = new Set(I.stats.regionalExports.value), smp = new Set(I.stats.regionalSamples.value);
    el.innerHTML = `<svg xmlns="${NS}" viewBox="0 0 ${M.width} ${M.height}" width="${r.width}" height="${r.width * M.height / M.width}" role="img" aria-label="Map: export markets Kenya and Uganda; samples sent to Mozambique, Kenya and Malawi"></svg>`;
    const s = el.firstChild;
    const defs = add(s, 'defs', {});
    const pat = add(defs, 'pattern', { id: 'hatch', width: 7, height: 7, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' });
    add(pat, 'rect', { width: 7, height: 7, fill: css('--yellow-tint') });
    add(pat, 'line', { x1: 0, y1: 0, x2: 0, y2: 7, stroke: '#C99A00', 'stroke-width': 2.2 });
    add(s, 'rect', { width: M.width, height: M.height, fill: css('--blue-tint'), opacity: 0.55 });
    M.countries.forEach(c => {
      let fill = css('--paper'), stroke = css('--rule');
      if (c.name === 'Tanzania') fill = css('--tbpl-blue');
      else if (exp.has(c.name)) fill = css('--tbpl-green');
      else if (smp.has(c.name)) fill = 'url(#hatch)';
      add(s, 'path', { d: c.d, fill, stroke: '#fff', 'stroke-width': 1.4, 'stroke-linejoin': 'round' });
    });
    // Kenya received samples too: add hatch ring marker
    const lab = (name, dx = 0, dy = 0, o = {}) => {
      const c = M.countries.find(k => k.name === name); if (!c) return;
      T(s, c.cx + dx, c.cy + dy, name.toUpperCase(), { size: o.size || 11, weight: 700, anchor: 'middle', fill: o.fill || css('--ink'), ls: 1.2 });
    };
    lab('Tanzania', 0, 10, { fill: '#fff', size: 15 });
    lab('Kenya', 8, 4, { fill: '#fff' }); lab('Uganda', 0, 4, { fill: '#fff', size: 10 });
    lab('Mozambique', 30, 40); lab('Malawi', -4, 20, { size: 9.5 });
    const k = M.countries.find(c => c.name === 'Kenya');
    add(s, 'circle', { cx: k.cx + 8, cy: k.cy + 24, r: 9, fill: 'url(#hatch)', stroke: css('--ink'), 'stroke-width': 1 });
    lab('Zambia', 0, 0, { fill: css('--ink-3'), size: 9 }); lab('DR Congo', 40, 60, { fill: css('--ink-3'), size: 9 });
  }

  /* 5. Locator: Tanzania with an indicative marker for a named place. */
  function locator(el, I) {
    const M = window.TBPL_MAPS.tanzania;
    const r = el.getBoundingClientRect();
    const key = el.dataset.place, ref = (el.dataset.ref ?? 'dar').split(',').filter(Boolean);
    el.innerHTML = `<svg xmlns="${NS}" viewBox="0 0 ${M.width} ${M.height}" width="${r.width}" height="${r.width * M.height / M.width}" role="img"></svg>`;
    const s = el.firstChild;
    M.countries.forEach(c => add(s, 'path', { d: c.d, fill: c.name === 'Tanzania' ? css('--paper-2') : 'none', stroke: c.name === 'Tanzania' ? css('--ink') : css('--rule'), 'stroke-width': c.name === 'Tanzania' ? 2 : 1.2, 'stroke-linejoin': 'round' }));
    ref.forEach(k => { const p = M.places[k]; if (!p) return;
      add(s, 'circle', { cx: p.x, cy: p.y, r: 7, fill: css('--ink') });
      T(s, p.x - 14, p.y + 7, p.name, { size: 20, anchor: 'end', weight: 600, fill: css('--ink-2') }); });
    const p = M.places[key];
    s.setAttribute('aria-label', `Indicative location of ${p.name}, Tanzania`);
    const o = el.dataset.from && M.places[el.dataset.from];
    if (o) {
      // journey from the origin: a gentle arc, dashed, with the origin labelled
      const mx = (o.x + p.x) / 2 - 30, my = Math.min(o.y, p.y) - 150;
      add(s, 'path', { d: `M${o.x} ${o.y} Q${mx} ${my} ${p.x} ${p.y}`, fill: 'none', stroke: css('--tbpl-blue'), 'stroke-width': 4, 'stroke-dasharray': '10 8' });
      add(s, 'circle', { cx: o.x, cy: o.y, r: 9, fill: '#fff', stroke: css('--tbpl-blue'), 'stroke-width': 4 });
      T(s, o.x - 16, o.y + 30, o.name.toUpperCase(), { size: 21, weight: 800, anchor: 'end', fill: css('--tbpl-blue'), ls: 1.2 });
      T(s, o.x - 16, o.y + 54, el.dataset.fromSub || '', { size: 17, anchor: 'end', fill: css('--ink-2') });
    }
    add(s, 'circle', { cx: p.x, cy: p.y, r: 38, fill: css('--tbpl-yellow'), opacity: 0.45 });
    add(s, 'circle', { cx: p.x, cy: p.y, r: 11, fill: css('--tbpl-green'), stroke: '#fff', 'stroke-width': 3 });
    // label beside the marker, or set below-left of it when the marker sits on the coast (data-label-side="left")
    const left = el.dataset.labelSide === 'left', lx = left ? p.x - 20 : p.x + 48, ly = left ? p.y + 62 : p.y - 4, an = left ? 'end' : 'start';
    T(s, lx, ly, p.name.toUpperCase(), { size: 27, weight: 800, ls: 1.5, anchor: an });
    T(s, lx, ly + 28, el.dataset.sub || '', { size: 19, weight: 500, fill: css('--ink-2'), anchor: an });
    T(s, M.width - 10, M.height - 12, 'Location indicative', { size: 16, anchor: 'end', fill: css('--ink-3') });
    const tz = M.countries.find(c => c.name === 'Tanzania');
    if (!o) T(s, tz.cx + 30, tz.cy - 30, 'TANZANIA', { size: 22, weight: 700, anchor: 'middle', fill: css('--ink-3'), ls: 4 });
  }

  /* 6. Process: numbered steps on a single rail (vertical). */
  function process(el, I) {
    const steps = I.articles[el.dataset.ref][el.dataset.key || 'process'];
    el.innerHTML = `<ol class="process${el.dataset.variant ? ' ' + el.dataset.variant : ''}">${steps.map((d, i) => `<li${d.intervene ? ' class="hit"' : ''}><span class="n">${String(i + 1).padStart(2, '0')}</span><b>${window.TBPL.inline(d.step)}</b><p>${window.TBPL.inline(d.text)}</p></li>`).join('')}</ol>`;
  }

  /* 7. Where the issue's stories happened: numbered pins linking to pages. */
  function issueMap(el, I) {
    const M = window.TBPL_MAPS.tanzania;
    const r = el.getBoundingClientRect();
    el.innerHTML = `<svg xmlns="${NS}" viewBox="0 0 ${M.width} ${M.height}" width="${r.width}" height="${r.width * M.height / M.width}" role="img" aria-label="Map of Tanzania showing where this issue's stories took place"></svg>`;
    const s = el.firstChild;
    M.countries.forEach(c => add(s, 'path', { d: c.d, fill: c.name === 'Tanzania' ? css('--white') : 'none', stroke: c.name === 'Tanzania' ? css('--ink') : css('--rule'), 'stroke-width': c.name === 'Tanzania' ? 2 : 1.2, 'stroke-linejoin': 'round' }));
    I.storyMap.forEach(d => {
      const p = M.places[d.place], px = p.x + (d.ox || 0), py = p.y + (d.oy || 0);
      const a = add(s, 'a', { href: '#p' + d.page });
      if (d.ox || d.oy) add(a, 'line', { x1: p.x, y1: p.y, x2: px, y2: py, stroke: css('--ink'), 'stroke-width': 1.5 });
      add(a, 'circle', { cx: p.x, cy: p.y, r: 4.5, fill: css('--ink') });
      add(a, 'circle', { cx: px, cy: py, r: 17, fill: css('--tbpl-blue'), stroke: '#fff', 'stroke-width': 3 });
      T(a, px, py + 6.5, String(d.page), { size: 14, weight: 800, anchor: 'middle', fill: '#fff' });
      const left = d.side === 'left';
      T(a, px + (left ? -24 : 24), py + 7, p.name, { size: 21, weight: 700, anchor: left ? 'end' : 'start' });
    });
  }

  /* 8. Milestones on a horizontal line; projected steps drawn hollow. */
  function timeline(el, I) {
    const items = I.articles[el.dataset.ref];
    el.innerHTML = `<ol class="timeline">${items.map(d => `<li class="${d.projected ? 'projected' : ''}"><span class="dot"></span><b>${d.when}</b><p>${d.what}</p>${d.projected ? '<em>Expected</em>' : ''}</li>`).join('')}</ol>`;
  }

  /* 9. Product reference: only what the issue itself says. */
  function products(el, I) {
    el.innerHTML = `<table class="products"><thead><tr><th>Product</th><th>Type</th><th>What this issue says</th><th>Status</th></tr></thead><tbody>${
      I.articles.products.map(d => `<tr class="${d.projected ? 'projected' : ''}"><td><b>${window.TBPL.inline(d.name)}</b>${d.variants ? `<small>${d.variants}</small>` : ''}${d.flags ? `<span class="review-only">${window.TBPL.statusChip('reported', d.flags)}</span>` : ''}</td><td>${d.type}</td><td>${d.said}</td><td>${d.status}</td></tr>`).join('')}</tbody></table>`;
  }

  window.TBPL_CHARTS = { salesBars, salesSplit, councilDots, regionalMap, locator, process, issueMap, timeline, products };
})();

