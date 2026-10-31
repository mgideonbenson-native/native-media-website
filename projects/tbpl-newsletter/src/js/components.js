/* Data-driven page components. Each page marks slots with data-component; mount() fills them from window.TBPL_ISSUE.
 * Review mode (?review in the URL) shows editorial flags and data-status chips; the clean render hides them. */
(function () {
  const I = window.TBPL_ISSUE;
  const REVIEW = /[?&]review\b/.test(location.search);
  const STATUS_LABEL = { reported: 'Reported', approximate: 'Approximate', projected: 'Projected', quoted: 'Quoted, unsourced', derived: 'Derived by editors', draft: 'New copy' };

  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // [[F2|text]] marks source text an editor must review. The lookahead lets flagged text itself end in "]".
  // Placeholder for editors: a visible tag with the instruction, quoting the source text where there is one.
  const ph = (id, ask, quoted) => `<span class="ph" data-flag="${id}"><b>Editor</b>${ask}${quoted ? `: “${quoted}”` : ''}</span>`;
  const inline = s => esc(s).replace(/\[\[(F\d+)\|(.*?)\]\](?!\])/g, (_, id, t) => {
    // [[F15|original=>fix]] is a logged correction: approved ones always apply, proposed ones only when switched on.
    const [orig, fix] = t.split('=&gt;');
    const f = I.flags[id] || {};
    const approved = (I.meta.approvedCorrections || []).includes(id);
    if (I.meta.editorPlaceholders && f.ask && !approved) {
      if (f.kind === 'label') return `${orig}${ph(id, f.ask)}`;            // keep the text, flag the missing label
      return ph(id, fix !== undefined ? `${f.ask}` : f.ask, fix !== undefined ? `${orig}” → “${fix}` : orig); // replace the error
    }
    if (fix === undefined) return `<span class="flagged" data-flag="${id}">${t}</span>`;
    const on = approved || I.meta.applyProposedCorrections;
    return `<span class="flagged corr" data-flag="${id}" title="Source: ${orig || '(nothing)'}">${on ? fix : orig}</span>`;
  });
  // Empty label slot: <span data-component="ph" data-flag="F22" data-ask="optional override"></span>
  function placeholder(el) {
    const f = I.flags[el.dataset.flag] || {};
    el.outerHTML = ph(el.dataset.flag, el.dataset.ask || f.ask || 'To be supplied');
  }
  const fmt = (n, d = 0) => Number(n).toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });

  /* Threaded text frames: every [data-component=body] with the same data-ref is one story, filled in
   * document order like linked InDesign frames. Paragraphs split at word boundaries between frames;
   * a heading never ends a frame. Text left over stays in the last frame, where QA reports it as overset. */
  const flowed = new Set();
  const overflows = el => el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1;
  // Words, keeping flagged spans (which contain spaces) whole and attached to their punctuation.
  const words = html => html.match(/(?:<span[^>]*>.*?<\/span>|[^\s<])+/g) || [];

  function body(el) {
    const ref = el.dataset.ref;
    if (flowed.has(ref)) return;
    flowed.add(ref);
    const a = I.articles[ref];
    const frames = [...document.querySelectorAll(`[data-component~="body"][data-ref="${ref}"]`)];
    const queue = a.body.map((b, i) => ({ h: b.h != null, html: inline(b.h != null ? b.h : b.p), last: i === a.body.length - 1, first: i === 0, cont: false }));
    const node = b => {
      const n = document.createElement(b.h ? 'h3' : 'p');
      n.innerHTML = b.html;
      if (b.first && frames[0].dataset.lead !== undefined) n.classList.add('lead');
      if (b.last) n.classList.add('end-mark');
      if (b.cont) n.classList.add('cont');
      return n;
    };
    frames.forEach((f, fi) => {
      f.classList.add('body');
      f.innerHTML = '';
      const lastFrame = fi === frames.length - 1;
      while (queue.length) {
        const b = queue[0], n = node(b);
        f.appendChild(n);
        if (!overflows(f) || lastFrame) { queue.shift(); continue; }
        f.removeChild(n);
        if (!b.h) {
          // largest prefix of words that still fits
          const w = words(b.html);
          let lo = 0, hi = w.length - 1;
          const probe = node({ ...b, last: false });
          f.appendChild(probe);
          while (lo < hi) {
            const mid = Math.ceil((lo + hi) / 2);
            probe.innerHTML = w.slice(0, mid).join(' ');
            if (overflows(f)) hi = mid - 1; else lo = mid;
          }
          if (lo >= 4) { probe.innerHTML = w.slice(0, lo).join(' '); queue[0] = { ...b, html: w.slice(lo).join(' '), first: false, cont: true }; }
          else f.removeChild(probe);
        }
        break;
      }
      // never strand a heading at the foot of a frame
      if (!lastFrame && f.lastElementChild && f.lastElementChild.tagName === 'H3') {
        const h = f.lastElementChild; f.removeChild(h); queue.unshift({ h: true, html: h.innerHTML });
      }
    });
  }

  function text(el) {
    // data-ref="articles.sales.title" style lookups for headlines, standfirsts, meta lines
    const v = el.dataset.ref.split('.').reduce((o, k) => (o == null ? o : o[k]), I);
    if (v == null) { el.innerHTML = `<span class="missing">[missing: ${esc(el.dataset.ref)}]</span>`; el.classList.add('is-missing'); return; }
    el.innerHTML = inline(Array.isArray(v) ? v.join(el.dataset.join || ', ') : v);
  }

  function statusChip(status, flags) {
    const f = (flags || []).map(id => `<span class="chip flag" title="${esc(I.flags[id] ? I.flags[id].text : id)}">${id}</span>`).join('');
    return `<span class="chips"><span class="chip st-${status}">${STATUS_LABEL[status] || status}</span>${f}</span>`;
  }

  // Review-only status markers on any element: data-status="approximate" data-flags="F3,F4"
  function status(el) {
    const flags = el.dataset.flags ? el.dataset.flags.split(',') : [];
    el.insertAdjacentHTML('beforeend', `<span class="review-only">${statusChip(el.dataset.status, flags)}</span>`);
  }

  function reviewPanel() {
    const ids = new Set();
    document.querySelectorAll('[data-flag]').forEach(e => ids.add(e.dataset.flag));
    document.querySelectorAll('[data-flags]').forEach(e => e.dataset.flags.split(',').forEach(id => ids.add(id)));
    const list = [...ids].filter(id => I.flags[id]).sort((a, b) => +a.slice(1) - +b.slice(1));
    const panel = document.createElement('aside');
    panel.className = 'review-panel';
    panel.innerHTML = `<h2>Editorial review: flags on these pages</h2><p>Highlighted text and chips mark figures or wording that need an editor's decision. Source text is reproduced verbatim; nothing has been silently corrected.</p>` +
      `<dl class="legend">${Object.entries(STATUS_LABEL).map(([k, v]) => `<div><dt><span class="chip st-${k}">${v}</span></dt></div>`).join('')}</dl>` +
      `<ol>${list.map(id => `<li><b class="sev-${I.flags[id].severity}">${id} · ${I.flags[id].severity}</b> <em>source p. ${I.flags[id].page}</em><br>${esc(I.flags[id].text)}${I.flags[id].resolution ? `<br><b>Decision:</b> ${esc(I.flags[id].resolution)}` : ''}</li>`).join('')}</ol>`;
    document.querySelector('.desk').appendChild(panel);
  }

  function mount() {
    const C = { body, text, status, ph: placeholder, ...(window.TBPL_CHARTS || {}) };
    // Two passes: everything that takes up space first, then the text that flows around it.
    for (const pass of ['layout', 'flow']) {
      document.querySelectorAll('[data-component]').forEach(el => {
        el.dataset.component.split(' ').forEach(name => {
          if ((name === 'body') !== (pass === 'flow')) return;
          if (!C[name]) { console.warn('Unknown component', name); return; }
          C[name](el, I);
        });
      });
    }
    if (REVIEW) { document.body.classList.add('review'); document.querySelectorAll('[data-status]').forEach(status); reviewPanel(); }
    document.body.dataset.mounted = 'true';
  }

  window.TBPL = { mount, inline, esc, fmt, statusChip, REVIEW };
  // Text flow measures glyphs, so every face must be loaded before mounting (fonts.ready alone only covers faces already in use).
  const FACES = ['600 20pt Fraunces', 'italic 400 20pt Fraunces', '400 9pt "Source Serif 4"', 'italic 400 9pt "Source Serif 4"', '700 9pt "Source Serif 4"',
    '400 9pt "Schibsted Grotesk"', '700 9pt "Schibsted Grotesk"', '800 9pt "Schibsted Grotesk"', '900 9pt "Schibsted Grotesk"', '400 9pt "Inter Tight"'];
  const APPROX = '\u2248'; // load sample includes ≈ so its unicode-range subset is fetched too
  // Optional visual theme (?theme=signal): its stylesheet must load before any text is measured.
  const THEME = (location.search.match(/[?&]theme=([a-z-]+)/) || [])[1];
  const themeReady = !THEME ? Promise.resolve() : new Promise(done => {
    document.documentElement.dataset.theme = THEME;
    const l = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: `../src/styles/theme-${THEME}.css`, onload: done, onerror: done });
    document.head.appendChild(l);
  });
  themeReady.then(() => Promise.all(FACES.map(f => document.fonts.load(f, 'a' + APPROX)))).then(() => document.fonts.ready).then(mount);
})();
