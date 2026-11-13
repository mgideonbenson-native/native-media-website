/**
 * Interactions shared by the interactive report pages (Research & Publications).
 * The page's root element carries data-rp, and optionally data-share-text for the share message.
 * Everything here enhances content that is already in the HTML, so the page reads fully without it.
 */
const root = document.querySelector<HTMLElement>('[data-rp]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (root) {
  // ---------- Reveal (bars grow in) ----------
  const revealIO = 'IntersectionObserver' in window && !reduce
    ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); revealIO!.unobserve(e.target); } }), { threshold: 0.25 })
    : null;
  function observeReveal(el: Element) { if (revealIO) revealIO.observe(el); else el.classList.add('in'); }
  root.querySelectorAll('[data-reveal]').forEach(observeReveal);

  // ---------- Tabs (economy, two sides, quadrants, firms, risks). Nested tab groups manage only their own tabs. ----------
  root.querySelectorAll<HTMLElement>('[data-tabs]').forEach((group) => {
    const own = <T extends Element>(sel: string) => [...group.querySelectorAll<T>(sel)].filter((el) => el.closest('[data-tabs]') === group);
    const tabs = own<HTMLButtonElement>('[role="tab"]');
    const panels = own<HTMLElement>('[role="tabpanel"]');
    if (!tabs.length) return;
    const select = (tab: HTMLButtonElement, focus = false) => {
      tabs.forEach((t) => { const on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      panels.forEach((p) => { p.hidden = p.dataset.panel !== tab.dataset.tab; });
      if (focus) tab.focus();
      // Bars in a newly shown panel should grow in.
      group.querySelectorAll('[data-reveal]').forEach((el) => { if (!(el as HTMLElement).closest('[hidden]')) observeReveal(el); });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const k = e.key;
        const next = k === 'ArrowRight' || k === 'ArrowDown' ? i + 1 : k === 'ArrowLeft' || k === 'ArrowUp' ? i - 1 : k === 'Home' ? 0 : k === 'End' ? tabs.length - 1 : null;
        if (next === null) return;
        e.preventDefault();
        select(tabs[(next + tabs.length) % tabs.length], true);
      });
    });
    group.classList.add('is-ready');
    select(tabs.find((t) => t.dataset.default !== undefined) ?? tabs[0]);
  });

  // ---------- Count-up statistics ----------
  const fmt = (v: number, d: number) => v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  const countIO = 'IntersectionObserver' in window && !reduce
    ? new IntersectionObserver((es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        countIO!.unobserve(e.target);
        const el = e.target as HTMLElement;
        const to = Number(el.dataset.count); const d = Number(el.dataset.decimals || 0);
        const pre = el.dataset.prefix || ''; const suf = el.dataset.suffix || '';
        const t0 = performance.now(); const dur = 1400;
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur); const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = `${pre}${fmt(to * eased, d)}${suf}`;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }), { threshold: 0.6 })
    : null;
  if (countIO) root.querySelectorAll('[data-count]').forEach((el) => countIO.observe(el));

  // ---------- Tooltips for any [data-tip] inside a chart frame ----------
  root.querySelectorAll<HTMLElement>('[data-frame]').forEach((frame) => {
    const tip = frame.querySelector<HTMLElement>('.rp-tip');
    if (!tip) return;
    let pinned: HTMLElement | null = null;
    const show = (el: HTMLElement) => {
      tip.textContent = el.dataset.tip || '';
      tip.hidden = false;
      const fr = frame.getBoundingClientRect(); const r = el.getBoundingClientRect();
      const tw = tip.offsetWidth; const th = tip.offsetHeight;
      let left = r.left - fr.left + r.width / 2 - tw / 2;
      left = Math.max(8, Math.min(left, fr.width - tw - 8));
      let top = r.top - fr.top - th - 10;
      if (top < 8) top = r.bottom - fr.top + 10;
      tip.style.left = `${left}px`; tip.style.top = `${top}px`;
    };
    const hide = () => { if (!pinned) tip.hidden = true; };
    frame.addEventListener('pointerover', (e) => { const el = (e.target as Element).closest<HTMLElement>('[data-tip]'); if (el && e.pointerType === 'mouse') show(el); });
    frame.addEventListener('pointerout', (e) => { if ((e as PointerEvent).pointerType === 'mouse') hide(); });
    frame.addEventListener('focusin', (e) => { const el = (e.target as Element).closest<HTMLElement>('[data-tip]'); if (el) show(el); });
    frame.addEventListener('focusout', () => { pinned = null; hide(); });
    frame.addEventListener('click', (e) => {
      const el = (e.target as Element).closest<HTMLElement>('[data-tip]');
      if (!el) { pinned = null; tip.hidden = true; return; }
      pinned = pinned === el ? null : el;
      if (pinned) show(el); else tip.hidden = true;
    });
    frame.addEventListener('keydown', (e) => { if (e.key === 'Escape') { pinned = null; tip.hidden = true; } });
  });

  // ---------- Scrollytelling: 100 squares change with each step ----------
  const scrolly = root.querySelector<HTMLElement>('[data-scrolly]');
  if (scrolly) {
    const waffle = scrolly.querySelector<HTMLElement>('[data-waffle]')!;
    const cap = scrolly.querySelector<HTMLElement>('[data-scrolly-cap]');
    const stepEls = [...scrolly.querySelectorAll<HTMLElement>('[data-step]')];
    // Stagger the squares so each change sweeps across the grid.
    waffle.querySelectorAll<HTMLElement>('i').forEach((c, i) => c.style.setProperty('--d', reduce ? '0' : String((i % 10) * 18 + Math.floor(i / 10) * 8)));
    const setStep = (el: HTMLElement) => {
      stepEls.forEach((s) => s.classList.toggle('is-active', s === el));
      waffle.dataset.state = el.dataset.step;
      if (cap) cap.textContent = `Step ${el.dataset.step} of ${stepEls.length}`;
    };
    setStep(stepEls[0]);
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setStep(e.target as HTMLElement); }), { rootMargin: '-45% 0px -45% 0px' });
      stepEls.forEach((s) => io.observe(s));
    }
  }

  // ---------- Section navigation: active section, rail, drawer, back to top ----------
  const secs = [...root.querySelectorAll<HTMLElement>('[data-rp-section]')];
  const links = [...root.querySelectorAll<HTMLAnchorElement>('[data-rp-link]')];
  const pos = root.querySelector<HTMLElement>('[data-rp-pos]');
  const setActive = (id: string) => {
    links.forEach((a) => a.setAttribute('aria-current', String(a.dataset.rpLink === id)));
    const i = secs.findIndex((s) => s.id === id);
    if (pos && i >= 0) pos.textContent = `${String(i + 1).padStart(2, '0')}/${String(secs.length).padStart(2, '0')}`;
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: '-40% 0px -55% 0px' });
    secs.forEach((s) => io.observe(s));
    const opening = root.querySelector('#opening');
    if (opening) new IntersectionObserver(([e]) => document.documentElement.classList.toggle('rp-past-hero', !e.isIntersecting), { rootMargin: '-30% 0px 0px 0px' }).observe(opening);
  } else {
    document.documentElement.classList.add('rp-past-hero');
  }
  root.querySelectorAll('[data-rp-top]').forEach((b) => b.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    root.querySelector<HTMLElement>('h1')?.focus?.({ preventScroll: true });
  }));
  const drawer = root.querySelector<HTMLDialogElement>('[data-rp-drawer]');
  const opener = root.querySelector<HTMLButtonElement>('[data-rp-open]');
  if (drawer && opener) {
    opener.addEventListener('click', () => { if (typeof drawer.showModal === 'function') drawer.showModal(); else drawer.setAttribute('open', ''); });
    drawer.querySelectorAll('[data-rp-close]').forEach((el) => el.addEventListener('click', () => drawer.close()));
    drawer.addEventListener('click', (e) => { if (e.target === drawer) drawer.close(); });
    drawer.addEventListener('close', () => opener.focus());
  }

  // ---------- Share and copy citation ----------
  const say = (btn: Element, sel: string, text: string) => {
    const box = btn.closest('div, dialog')?.querySelector<HTMLElement>(sel) ?? root.querySelector<HTMLElement>(sel);
    if (box) { box.textContent = text; setTimeout(() => { box.textContent = ''; }, 5000); }
  };
  const copy = async (text: string) => { try { await navigator.clipboard.writeText(text); return true; } catch { return false; } };
  root.querySelectorAll('[data-rp-share]').forEach((btn) => btn.addEventListener('click', async () => {
    const url = location.href.split('#')[0];
    const data = { title: document.title, text: root.dataset.shareText || document.title, url };
    if (navigator.share) {
      try { await navigator.share(data); return; } catch (err) { if ((err as DOMException)?.name === 'AbortError') return; }
    }
    say(btn, '[data-rp-share-msg]', (await copy(url)) ? 'Link copied. Paste it anywhere to share.' : `Copy this link: ${url}`);
  }));
  root.querySelectorAll('[data-copy-cite]').forEach((btn) => btn.addEventListener('click', async () => {
    const text = root.querySelector<HTMLElement>('[data-cite]')?.textContent?.trim() || '';
    say(btn, '[data-copy-msg]', (await copy(text)) ? 'Citation copied.' : 'Select the citation above to copy it.');
  }));

  // ---------- Opening: a quiet topographic field drawn once (redrawn on resize) ----------
  const canvas = root.querySelector<HTMLCanvasElement>('[data-topo]');
  const ctx = canvas?.getContext('2d');
  if (canvas && ctx) {
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth; const h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const lines = Math.round(h / 14);
      for (let i = 0; i < lines; i++) {
        const base = (i / lines) * h * 1.15;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const u = x / w;
          const yv = base + Math.sin(u * 5.1 + i * 0.21) * 26 + Math.sin(u * 11.3 - i * 0.13) * 9 + Math.cos(u * 2.2 + i * 0.07) * 40;
          if (x === 0) ctx.moveTo(x, yv); else ctx.lineTo(x, yv);
        }
        const accent = i % 9 === 4;
        ctx.strokeStyle = accent ? 'rgba(237,125,62,0.28)' : 'rgba(245,245,240,0.055)';
        ctx.lineWidth = accent ? 1.2 : 1;
        ctx.stroke();
      }
    };
    draw();
    let t: number | undefined;
    window.addEventListener('resize', () => { clearTimeout(t); t = window.setTimeout(draw, 200); });
  }
}
