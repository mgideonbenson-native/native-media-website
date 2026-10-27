/**
 * Tanzania's Standard Gauge Railway: a two-minute motion graphic, drawn frame by frame on a canvas.
 * renderFrame(t) is deterministic: the same t always gives the same picture, so render.mjs can capture
 * every frame at 30 fps without timing drift. Text and figures come from content.js, map data from geo.js.
 */
(() => {
  const C = window.CONTENT, G = window.GEO, PAL = C.palette;
  const W = 1920, H = 1080, DUR = 120;
  const MX = 120; // side safe margin (title-safe is ~96 px at 1080p)
  const canvas = document.getElementById('film');
  const ctx = canvas.getContext('2d');
  const mkLayer = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
  const layer = mkLayer(), layerB = mkLayer();

  // ── Maths and timing ────────────────────────────────────────────────────
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  const prog = (t, a, d) => clamp((t - a) / d);
  const eio = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const eo = (p) => 1 - Math.pow(1 - p, 4);
  const win = (t, a, b, fi = 0.6, fo = 0.6) => Math.min(prog(t, a, fi), 1 - prog(t, b - fo, fo));
  const rnd = (seed) => { let s = seed >>> 0; return () => { s += 0x6d2b79f5; let r = Math.imul(s ^ (s >>> 15), 1 | s); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; };
  const hash = (i, seed) => { const r = rnd(i * 7919 + seed * 104729); return r(); };
  const vnoise = (x, seed) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i, seed), hash(i + 1, seed), u); };
  const fbm = (x, seed, oct = 4) => { let v = 0, a = 0.5, f = 1; for (let o = 0; o < oct; o++) { v += a * vnoise(x * f, seed + o * 13); a *= 0.5; f *= 2.03; } return v; };
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const rgba = (h, a = 1) => { const [r, g, b] = hex(h); return `rgba(${r},${g},${b},${a})`; };
  const mixc = (h1, h2, p, a = 1) => { const A = hex(h1), B = hex(h2); return `rgba(${A.map((v, i) => Math.round(lerp(v, B[i], p))).join(',')},${a})`; };
  const fmt = (n) => Math.round(n).toLocaleString('en-GB');
  // camera keyframes: [[t, {x,y,z}], ...] with eased segments
  const camAt = (keys, t) => {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 0; i < keys.length - 1; i++) {
      const [ta, a] = keys[i], [tb, b] = keys[i + 1];
      if (t <= tb) { const p = eio((t - ta) / (tb - ta)); return { x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), z: lerp(a.z, b.z, p) }; }
    }
    return keys[keys.length - 1][1];
  };

  // ── Typography ──────────────────────────────────────────────────────────
  const FD = "'Archivo SGR'", FB = "'Hanken SGR'";
  function setFont(c, o) {
    c.font = `${o.weight ?? 700} ${o.size}px ${o.family === 'B' ? FB : FD}`;
    c.fontStretch = o.stretch ?? (o.family === 'B' ? 'normal' : 'condensed');
    c.letterSpacing = `${o.track ?? 0}px`;
    c.textAlign = o.align ?? 'left';
    c.textBaseline = o.base ?? 'alphabetic';
  }
  function text(c, s, x, y, o) {
    setFont(c, o);
    c.globalAlpha = o.alpha ?? 1;
    c.fillStyle = o.color ?? PAL.white;
    c.fillText(s, x, y);
    c.globalAlpha = 1;
    return c.measureText(s).width;
  }
  // Kinetic line: rises into a mask and fades in. p = 0..1 of the reveal, out = 0..1 of the exit.
  function reveal(c, s, x, y, o, p, out = 0) {
    if (p <= 0 || out >= 1) return;
    setFont(c, o);
    const w = c.measureText(s).width, h = o.size * 1.25;
    const x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
    c.save();
    c.beginPath(); c.rect(x0 - 20, y - o.size * 1.05, w + 40, h + o.size * 0.1); c.clip();
    const dy = (1 - eo(p)) * o.size * 0.9 - eio(out) * o.size * 0.5;
    text(c, s, x, y + dy, { ...o, alpha: (o.alpha ?? 1) * clamp(p * 1.6) * (1 - out) });
    c.restore();
  }
  function tag(c, s, x, y, kind, alpha = 1) {
    // Small status chip: MEASURED / REPORTED / TIMETABLE are solid, PROJECTED is outlined (dashed)
    setFont(c, { size: 19, weight: 700, family: 'D', stretch: 'normal', track: 2.5 });
    const w = c.measureText(s).width + 26, h = 32;
    c.globalAlpha = alpha;
    if (kind === 'projected') {
      c.setLineDash([5, 4]); c.strokeStyle = PAL.orange; c.lineWidth = 2; c.strokeRect(x + 1, y + 1, w - 2, h - 2); c.setLineDash([]);
      c.fillStyle = PAL.orange;
    } else {
      c.fillStyle = kind === 'grey' ? PAL.grey2 : PAL.orange; c.fillRect(x, y, w, h); c.fillStyle = kind === 'grey' ? PAL.white : PAL.black;
    }
    c.textBaseline = 'middle'; c.fillText(s, x + 13 + 1.2, y + h / 2 + 1); c.globalAlpha = 1;
    return w;
  }
  const rule = (c, x, y, w, alpha = 1, color = PAL.orange, h = 5) => { c.globalAlpha = alpha; c.fillStyle = color; c.fillRect(x, y, w, h); c.globalAlpha = 1; };
  function sourceLine(c, s, alpha, dark = true) {
    text(c, s, MX, H - 64, { size: 20, family: 'B', weight: 500, color: dark ? PAL.grey : PAL.grey2, alpha });
  }

  // ── Texture: film grain and paper ───────────────────────────────────────
  const grain = [0, 1, 2, 3].map((k) => {
    const g = document.createElement('canvas'); g.width = g.height = 512;
    const gc = g.getContext('2d'), im = gc.createImageData(512, 512), r = rnd(99 + k);
    for (let i = 0; i < im.data.length; i += 4) { const v = 128 + (r() - 0.5) * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    gc.putImageData(im, 0, 0); return g;
  });
  const paper = (() => {
    const p = mkLayer(), pc = p.getContext('2d'), r = rnd(7);
    pc.fillStyle = '#808080'; pc.fillRect(0, 0, W, H);
    for (let i = 0; i < 2600; i++) { // fibres and blotches, very low contrast
      pc.strokeStyle = r() > 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'; pc.lineWidth = r() * 1.4 + 0.3;
      const x = r() * W, y = r() * H, a = r() * Math.PI, l = r() * 26 + 4;
      pc.beginPath(); pc.moveTo(x, y); pc.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); pc.stroke();
    }
    for (let i = 0; i < 60; i++) { const x = r() * W, y = r() * H, rr = r() * 260 + 80; const g = pc.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, `rgba(${r() > 0.5 ? '0,0,0' : '255,255,255'},0.05)`); g.addColorStop(1, 'rgba(128,128,128,0)'); pc.fillStyle = g; pc.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
    return p;
  })();
  function finish(c, t, { vignette = 0.45, grainAmt = 0.055, paperAmt = 0 } = {}) {
    if (paperAmt) { c.globalCompositeOperation = 'overlay'; c.globalAlpha = paperAmt; c.drawImage(paper, 0, 0); }
    c.globalCompositeOperation = 'overlay'; c.globalAlpha = grainAmt;
    const g = grain[Math.floor(t * 30) % 4], ox = (Math.floor(t * 30) * 173) % 512, oy = (Math.floor(t * 30) * 311) % 512;
    c.save(); c.translate(-ox, -oy); c.fillStyle = c.createPattern(g, 'repeat'); c.fillRect(ox, oy, W, H); c.restore();
    c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    if (vignette) { const v = c.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 1.05); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,0,${vignette})`); c.fillStyle = v; c.fillRect(0, 0, W, H); }
  }

  // ── Landscape helpers (opening shot) ────────────────────────────────────
  // A silhouetted ridge. color may be [top, bottom] for haze that thins towards the ground.
  function ridge(c, camX, par, seed, base, amp, freq, color, step = 6) {
    c.beginPath(); c.moveTo(-10, H + 10);
    for (let x = -10; x <= W + 10; x += step) { const wx = x + camX * par; c.lineTo(x, base - amp * fbm(wx * freq, seed)); }
    c.lineTo(W + 10, H + 10); c.closePath();
    if (Array.isArray(color)) { const g = c.createLinearGradient(0, base - amp, 0, base + 90); g.addColorStop(0, color[0]); g.addColorStop(1, color[1]); c.fillStyle = g; } else c.fillStyle = color;
    c.fill();
  }
  function acacia(c, x, y, s, color) {
    // Flat-topped umbrella thorn: forked trunk, layered flat canopy.
    c.fillStyle = color; c.strokeStyle = color; c.lineCap = 'round';
    c.lineWidth = 3.2 * s; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 3 * s, y - 30 * s, x - 2 * s, y - 52 * s); c.stroke();
    c.lineWidth = 2 * s; c.beginPath(); c.moveTo(x + 1 * s, y - 34 * s); c.quadraticCurveTo(x + 16 * s, y - 46 * s, x + 26 * s, y - 56 * s); c.stroke();
    c.beginPath(); c.moveTo(x - 1 * s, y - 40 * s); c.quadraticCurveTo(x - 14 * s, y - 50 * s, x - 22 * s, y - 55 * s); c.stroke();
    const r = rnd(Math.round(x * 13 + y));
    for (let i = 0; i < 9; i++) { c.beginPath(); c.ellipse(x + (r() - 0.5) * 70 * s, y - (56 + r() * 9) * s, (16 + r() * 16) * s, (4 + r() * 4) * s, 0, 0, Math.PI * 2); c.fill(); }
  }

  // The train, side elevation, painted once into a long sprite (30 px per metre). Backlit: dark body, warm rim light.
  const PXM = 40, CAR = 25 * PXM, GAP = 1 * PXM, NCAR = 8;
  const TRAIN_LEN = NCAR * CAR + (NCAR - 1) * GAP;
  const trainSprite = (() => {
    const s = document.createElement('canvas'); s.width = TRAIN_LEN + 40; s.height = 260;
    const c = s.getContext('2d');
    const rail = 250, floor = rail - 1.15 * PXM, roof = rail - 4.1 * PXM;
    for (let k = 0; k < NCAR; k++) {
      // cars are laid out right to left: car 0 is the leading cab at the right end
      const x1 = TRAIN_LEN - k * (CAR + GAP), x0 = x1 - CAR;
      const lead = k === 0, tail = k === NCAR - 1;
      c.beginPath();
      if (lead) { c.moveTo(x0, roof); c.lineTo(x1 - 7.5 * PXM, roof); c.bezierCurveTo(x1 - 3 * PXM, roof + 4, x1 - 0.2 * PXM, floor - 1.5 * PXM, x1, floor - 0.25 * PXM); c.lineTo(x1 - 0.4 * PXM, floor + 8); c.lineTo(x0, floor + 8); }
      else if (tail) { c.moveTo(x1, roof); c.lineTo(x0 + 7.5 * PXM, roof); c.bezierCurveTo(x0 + 3 * PXM, roof + 4, x0 + 0.2 * PXM, floor - 1.5 * PXM, x0, floor - 0.25 * PXM); c.lineTo(x0 + 0.4 * PXM, floor + 8); c.lineTo(x1, floor + 8); }
      else { c.moveTo(x0, roof + 6); c.quadraticCurveTo(x0, roof, x0 + 8, roof); c.lineTo(x1 - 8, roof); c.quadraticCurveTo(x1, roof, x1, roof + 6); c.lineTo(x1, floor + 8); c.lineTo(x0, floor + 8); }
      c.closePath();
      const g = c.createLinearGradient(0, roof, 0, floor + 8); g.addColorStop(0, '#2a211c'); g.addColorStop(0.5, '#1b1613'); g.addColorStop(1, '#100d0b');
      c.fillStyle = g; c.fill();
      // rim light along the roof line (sun behind the train)
      c.save(); c.clip(); c.fillStyle = 'rgba(244,182,118,0.55)'; c.fillRect(x0 - 10, roof - 2, CAR + 20, 3.5); c.restore();
      // window band: the sky seen through the far-side windows
      const wy0 = roof + 0.95 * PXM, wy1 = roof + 2.0 * PXM;
      const wx0 = lead ? x0 + 1.2 * PXM : x0 + (tail ? 8 : 1.2) * PXM, wx1 = lead ? x1 - 8.5 * PXM : x1 - 1.2 * PXM;
      const wg = c.createLinearGradient(0, wy0, 0, wy1); wg.addColorStop(0, 'rgba(236,170,108,0.62)'); wg.addColorStop(1, 'rgba(201,120,70,0.42)');
      for (let wx = wx0; wx < wx1 - 1.4 * PXM; wx += 2.05 * PXM) { c.fillStyle = wg; c.fillRect(wx, wy0, 1.7 * PXM, wy1 - wy0); }
      // doors
      c.strokeStyle = 'rgba(0,0,0,0.55)'; c.lineWidth = 2;
      [x0 + CAR * 0.24, x0 + CAR * 0.76].forEach((dx) => { if (!(lead && dx > x1 - 8 * PXM)) c.strokeRect(dx, roof + 0.7 * PXM, 1.3 * PXM, 2.8 * PXM); });
      // skirt line and lower body stripe catching a little light
      c.fillStyle = 'rgba(232,117,42,0.32)'; c.fillRect(lead ? x0 : x0, floor - 0.55 * PXM, lead ? CAR - 2.5 * PXM : CAR, 3);
      // bogies
      [x0 + 3.2 * PXM, x1 - 3.2 * PXM].forEach((bx) => {
        c.fillStyle = '#0b0907'; c.fillRect(bx - 1.6 * PXM, floor + 4, 3.2 * PXM, 0.6 * PXM);
        [bx - 1.1 * PXM, bx + 1.1 * PXM].forEach((wx) => { c.beginPath(); c.arc(wx, rail - 0.46 * PXM, 0.46 * PXM, 0, Math.PI * 2); c.fill(); });
      });
      if (!tail) { c.fillStyle = '#0d0a08'; c.fillRect(x0 - GAP, roof + 0.5 * PXM, GAP, floor - roof - 0.2 * PXM); }
      // pantographs on cars 2 and 6 (folded arms reaching the contact wire, 5.5 m above rail)
      if (k === 2 || k === 5) {
        const px = x0 + CAR * 0.5, wire = rail - 5.5 * PXM;
        c.strokeStyle = '#1a1411'; c.lineWidth = 3; c.beginPath(); c.moveTo(px - 30, roof); c.lineTo(px + 14, roof - (roof - wire) * 0.5); c.lineTo(px - 8, wire + 2); c.stroke();
        c.lineWidth = 4; c.beginPath(); c.moveTo(px - 26, wire + 2); c.lineTo(px + 14, wire + 2); c.stroke();
      }
    }
    // windscreen on the lead cab
    c.beginPath(); c.moveTo(TRAIN_LEN - 7 * PXM, roof + 0.5 * PXM); c.bezierCurveTo(TRAIN_LEN - 3.5 * PXM, roof + 0.7 * PXM, TRAIN_LEN - 1.7 * PXM, roof + 1.6 * PXM, TRAIN_LEN - 1.0 * PXM, roof + 2.2 * PXM); c.lineTo(TRAIN_LEN - 6.6 * PXM, roof + 2.0 * PXM); c.closePath();
    c.fillStyle = 'rgba(90,60,45,0.85)'; c.fill();
    return s;
  })();

  // Out-of-focus foreground grass, blurred once into a seamless tile (live blur is far too slow in software canvas).
  const GRASS_W = 2400;
  const grassTile = (() => {
    const g = document.createElement('canvas'); g.width = GRASS_W; g.height = 260;
    const c = g.getContext('2d'); c.filter = 'blur(7px)'; c.fillStyle = '#0d0805';
    for (let rep = -1; rep <= 1; rep++) for (let i = 0; i < GRASS_W / 60; i++) {
      const rr = rnd(i * 17 + 3), x = i * 60 + rep * GRASS_W, hgt = 60 + rr() * 140;
      c.beginPath(); c.moveTo(x - 30, 270); c.quadraticCurveTo(x + rr() * 30, 260 - hgt * 0.6, x + 20 + rr() * 30, 260 - hgt); c.quadraticCurveTo(x + 18, 260 - hgt * 0.4, x + 40, 270); c.fill();
    }
    c.fillRect(-20, 210, GRASS_W + 40, 60);
    return g;
  })();

  // ── Scene 1 · Opening hook: golden-hour tracking shot (0:00–0:16) ────────
  const RAIL_Y = 852, HORIZON = 640;
  const CAM_V = 1000, TRAIN_V = 1760; // px/s at the train plane
  function opening(c, t) {
    const camX = CAM_V * t;
    // sky
    const sky = c.createLinearGradient(0, 0, 0, HORIZON + 60);
    sky.addColorStop(0, '#16181c'); sky.addColorStop(0.38, '#3a2e2a'); sky.addColorStop(0.72, '#b8693a'); sky.addColorStop(0.92, '#eaa260'); sky.addColorStop(1, '#f6c98c');
    c.fillStyle = sky; c.fillRect(0, 0, W, H);
    // sun and its glow, slightly drifting with the slowest parallax
    const sx = 1330 - camX * 0.01, sy = 610;
    let g = c.createRadialGradient(sx, sy, 0, sx, sy, 700); g.addColorStop(0, 'rgba(255,214,150,0.75)'); g.addColorStop(0.08, 'rgba(250,180,110,0.45)'); g.addColorStop(0.35, 'rgba(232,117,42,0.12)'); g.addColorStop(1, 'rgba(232,117,42,0)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.fillStyle = '#fff1d6'; c.beginPath(); c.arc(sx, sy, 34, 0, Math.PI * 2); c.fill();
    // far ranges, mid hills, savanna with acacias (atmospheric perspective: further = closer to sky colour)
    ridge(c, camX, 0.03, 11, HORIZON + 10, 190, 0.0015, ['rgba(196,122,76,0.7)', 'rgba(150,86,54,0.95)']);
    ridge(c, camX, 0.08, 23, HORIZON + 40, 105, 0.0023, ['rgba(140,80,50,0.9)', 'rgba(84,48,32,1)']);
    g = c.createLinearGradient(0, HORIZON - 40, 0, HORIZON + 80); g.addColorStop(0, 'rgba(246,190,120,0)'); g.addColorStop(0.6, 'rgba(246,190,120,0.32)'); g.addColorStop(1, 'rgba(246,190,120,0)');
    c.fillStyle = g; c.fillRect(0, HORIZON - 40, W, 120);
    ridge(c, camX, 0.3, 37, HORIZON + 95, 22, 0.004, ['#4a3021', '#2c1d14']);
    const tp = 0.3, cell = 420;
    for (let i = Math.floor((camX * tp - 300) / cell); i < (camX * tp + W + 300) / cell; i++) {
      const r = rnd(i * 31 + 5); if (r() < 0.35) continue;
      const wx = i * cell + r() * cell, x = wx - camX * tp, s = 0.8 + r() * 0.9;
      acacia(c, x, HORIZON + 92 - r() * 8, s, '#30201a');
    }
    // the plain in front of the line
    g = c.createLinearGradient(0, HORIZON + 80, 0, H); g.addColorStop(0, '#2d1e15'); g.addColorStop(1, '#120c08');
    c.fillStyle = g; c.fillRect(0, HORIZON + 86, W, H);
    ridge(c, camX, 0.6, 51, RAIL_Y - 10, 18, 0.006, '#22160f');
    // embankment and track
    c.fillStyle = '#1a120c'; c.beginPath(); c.moveTo(0, RAIL_Y - 4); c.lineTo(W, RAIL_Y - 4); c.lineTo(W, RAIL_Y + 52); c.lineTo(0, RAIL_Y + 52); c.fill();
    c.fillStyle = 'rgba(240,170,105,0.35)'; c.fillRect(0, RAIL_Y - 4, W, 2.5);
    // masts every 50 m, with the overhead wire sagging between them
    const span = 50 * PXM, mastH = 7.4 * PXM, wireY = RAIL_Y - 5.5 * PXM;
    const first = Math.floor((camX - 200) / span);
    const mastXs = []; for (let i = first; i < first + Math.ceil(W / span) + 3; i++) mastXs.push(i * span + 120 - camX);
    const blur = 3; // shutter streak at camera speed
    c.strokeStyle = 'rgba(24,17,13,0.9)'; c.lineWidth = 2;
    for (let i = 0; i < mastXs.length - 1; i++) {
      const a = mastXs[i] + 30, b = mastXs[i + 1] + 30;
      c.beginPath(); c.moveTo(a, wireY - 36); c.quadraticCurveTo((a + b) / 2, wireY - 8, b, wireY - 36); c.stroke(); // catenary
      c.beginPath(); c.moveTo(a, wireY); c.lineTo(b, wireY); c.stroke(); // contact wire
      for (let d = 1; d < 6; d++) { const x = lerp(a, b, d / 6); const sag = 27 * (1 - Math.pow((d / 6 - 0.5) * 2, 2)); c.beginPath(); c.moveTo(x, wireY - 36 + sag); c.lineTo(x, wireY); c.stroke(); }
    }
    const drawMasts = () => mastXs.forEach((x) => {
      for (let k = 0; k < blur; k++) {
        c.globalAlpha = k === 0 ? 1 : 0.25; const o = k * 6;
        c.fillStyle = '#17100c'; c.fillRect(x - 9 + o, RAIL_Y - mastH, 18, mastH + 6);
        c.fillRect(x - 4 + o, wireY - 44, 58, 7); c.fillRect(x - 4 + o, wireY - 4, 50, 5);
      }
      c.globalAlpha = 1; c.fillStyle = 'rgba(240,170,105,0.4)'; c.fillRect(x + 5, RAIL_Y - mastH, 2, mastH);
    });
    // train (the masts stand on the near side, so they pass in front of it)
    const front = -160 + (TRAIN_V - CAM_V) * (t - 1.2);
    const x0 = front - TRAIN_LEN;
    if (front > -50 && x0 < W + 50) {
      for (let k = 0; k < 3; k++) { c.globalAlpha = k === 0 ? 1 : 0.22; c.drawImage(trainSprite, x0 - k * 5, RAIL_Y - 250); }
      c.globalAlpha = 1;
      // headlight with a soft flare
      const hx = front - 10, hy = RAIL_Y - 1.7 * PXM;
      g = c.createRadialGradient(hx, hy, 0, hx, hy, 120); g.addColorStop(0, 'rgba(255,246,225,0.9)'); g.addColorStop(0.08, 'rgba(255,226,180,0.45)'); g.addColorStop(0.5, 'rgba(255,200,140,0.08)'); g.addColorStop(1, 'rgba(255,200,140,0)');
      c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.fillRect(hx - 120, hy - 120, 240, 240);
      c.fillStyle = 'rgba(255,220,170,0.18)'; c.fillRect(hx - 400, hy - 1.5, 800, 3);
      c.globalCompositeOperation = 'source-over';
    }
    drawMasts();
    // rails (near rail visible as a bright line)
    c.fillStyle = '#0c0806'; c.fillRect(0, RAIL_Y, W, 9); c.fillStyle = 'rgba(250,190,130,0.55)'; c.fillRect(0, RAIL_Y, W, 2);
    // drifting dust in the light
    const r = rnd(3);
    for (let i = 0; i < 70; i++) {
      const px = ((r() * W * 2 - camX * (0.4 + r() * 0.6) - t * 20) % (W + 100) + W + 100) % (W + 100) - 50, py = 380 + r() * 520 + Math.sin(t * 0.7 + i) * 8;
      c.fillStyle = `rgba(255,214,160,${0.12 + r() * 0.2})`; c.beginPath(); c.arc(px, py, 1 + r() * 1.8, 0, Math.PI * 2); c.fill();
    }
    // foreground grass, out of focus and fast (pre-blurred tile, see grassTile)
    const gx = -((camX * 1.7) % GRASS_W);
    c.drawImage(grassTile, gx, H - 260); c.drawImage(grassTile, gx + GRASS_W, H - 260);
    // grade: warm lift at the horizon, deeper top
    g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(10,10,12,0.35)'); g.addColorStop(0.45, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.25)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);

    // text
    const O = C.opening, fo = prog(t, 14.0, 0.6);
    reveal(c, O.kicker.text, MX, 168, { size: 24, weight: 700, color: PAL.orange, track: 5, stretch: 'normal' }, prog(t, O.kicker.t, 0.8), fo);
    O.line1.text.forEach((s, i) => reveal(c, s, MX, 260 + i * 78, { size: 70, weight: 800, color: PAL.white }, prog(t, O.line1.t + i * 0.35, 0.9), prog(t, O.line1.out, 0.6)));
    if (t > O.line2.t - 0.1) {
      const p = prog(t, O.line2.t, 1.0);
      rule(c, MX, 206, 160 * eo(p), 1 - fo);
      reveal(c, O.line2.text, MX, 330, { size: 124, weight: 800, color: PAL.white, track: 1 }, p, fo);
      reveal(c, O.line3.text, MX, 404, { size: 42, family: 'B', weight: 500, color: PAL.cream }, prog(t, O.line3.t, 0.9), fo);
    }
  }

  // ── Map renderer (scenes 2 and 5) ───────────────────────────────────────
  const cPaths = G.countries.map((f) => ({ ...f, p: new Path2D(f.d) }));
  const lPaths = G.lakes.map((f) => new Path2D(f.d));
  const ST = G.stations, R = G.routes;
  const WATER = '#cfcabd';
  // 2-degree graticule spacing in map pixels, anchored on Dar es Salaam's projected position (Mercator: near-uniform at this latitude)
  const GRID = (ST.dar[0] - ST.morogoro[0]) / (39.279 - 37.66) * 2, GX = ST.dar[0] - (39.279 - 38) / 2 * GRID, GY = ST.dar[1] - (-6.822 + 6) / -2 * GRID;
  const polyLen = (pts) => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
  // Partial polyline (p = 0..1), returns the head point
  function strokePart(c, pts, p) {
    if (p <= 0) return null;
    const L = polyLen(pts) * clamp(p); let acc = 0;
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i], l = Math.hypot(bx - ax, by - ay);
      if (acc + l >= L) { const f = (L - acc) / l, hx = lerp(ax, bx, f), hy = lerp(ay, by, f); c.lineTo(hx, hy); c.stroke(); return [hx, hy]; }
      c.lineTo(bx, by); acc += l;
    }
    c.stroke(); return pts[pts.length - 1];
  }
  // Lake and ocean labels sit at fixed map positions (computed from lon/lat in build-geo; see GEO.labels)
  function drawMap(c, t, cam, st) {
    c.fillStyle = WATER; c.fillRect(0, 0, W, H); // ocean / outside
    c.save();
    c.translate(W / 2, H / 2); c.scale(cam.z, cam.z); c.translate(-cam.x, -cam.y);
    const px = 1 / cam.z; // one screen pixel in map units
    // graticule every 2 degrees (approximate in map pixels: built from the station projection's scale)
    c.strokeStyle = 'rgba(120,112,96,0.13)'; c.lineWidth = 1 * px;
    for (let x = -2000; x < 4000; x += GRID) { c.beginPath(); c.moveTo(GX + x, -2000); c.lineTo(GX + x, 4000); c.stroke(); }
    for (let y = -2000; y < 4000; y += GRID) { c.beginPath(); c.moveTo(-2000, GY + y); c.lineTo(4000, GY + y); c.stroke(); }
    // water-lining: soft rings around every shore, the old cartographers' way of showing water
    c.lineJoin = 'round';
    [[34, 0.05], [22, 0.07], [11, 0.09]].forEach(([w, a]) => { c.strokeStyle = `rgba(110,104,90,${a})`; c.lineWidth = w * px; cPaths.forEach((f) => c.stroke(f.p)); });
    cPaths.forEach((f) => { c.fillStyle = f.id === '834' ? '#f4eddf' : '#e4dcc8'; c.fill(f.p); });
    c.fillStyle = WATER; lPaths.forEach((p) => c.fill(p));
    [[9, 0.08], [4, 0.1]].forEach(([w, a]) => { c.strokeStyle = `rgba(110,104,90,${a})`; c.lineWidth = w * px; lPaths.forEach((p) => { c.save(); c.clip(p); c.stroke(p); c.restore(); }); });
    c.strokeStyle = '#b5ab97'; c.lineWidth = 1.1 * px; cPaths.forEach((f) => c.stroke(f.p));
    c.strokeStyle = 'rgba(176,168,150,0.9)'; c.lineWidth = 0.8 * px; lPaths.forEach((p) => c.stroke(p));
    const tz = cPaths.find((f) => f.id === '834'); c.strokeStyle = '#7f7666'; c.lineWidth = 1.8 * px; c.stroke(tz.p);
    // labels (map-anchored, constant screen size)
    const L = G.labels;
    const lab = (s, x, y, o) => text(c, s, x, y, { ...o, size: o.size * px, track: (o.track ?? 0) * px });
    Object.entries(L.countries).forEach(([n, [x, y]]) => lab(n, x, y, { size: 22, weight: 700, color: n === 'TANZANIA' ? '#6f6758' : '#9a917f', track: 6, align: 'center', stretch: 'normal', alpha: st.countryAlpha ?? 1 }));
    lab('Lake Victoria', L.victoria[0], L.victoria[1], { size: 22, family: 'B', weight: 600, color: '#8a8170', align: 'center', alpha: st.lakeAlpha ?? 1 });
    lab('Lake Tanganyika', L.tanganyika[0], L.tanganyika[1], { size: 20, family: 'B', weight: 500, color: '#8a8170', align: 'center', alpha: st.lakeAlpha ?? 1 });
    lab('Lake Nyasa', L.nyasa[0], L.nyasa[1], { size: 20, family: 'B', weight: 500, color: '#8a8170', align: 'center', alpha: st.lakeAlpha ?? 1 });
    lab('INDIAN OCEAN', L.ocean[0], L.ocean[1], { size: 22, weight: 600, color: '#9a917f', track: 8, align: 'center', stretch: 'normal' });
    if (st.lakeHi) { // emphasise the two lakes the line is built to reach
      c.globalAlpha = st.lakeHi * 0.35; c.strokeStyle = PAL.orange; c.lineWidth = 2.5 * px; [L.victoriaIdx, L.tanganyikaIdx].forEach((i) => c.stroke(lPaths[i])); c.globalAlpha = 1;
    }
    c.lineCap = 'round'; c.lineJoin = 'round';
    // the metre-gauge Central Line: thin grey ties
    if (st.central) {
      c.globalAlpha = st.centralAlpha ?? 1; c.strokeStyle = '#6f6758'; c.lineWidth = 2.2 * px; c.setLineDash([2 * px, 5 * px]);
      strokePart(c, R.central, st.central); strokePart(c, R.centralNorth, clamp((st.central - 0.55) / 0.45));
      c.setLineDash([]); c.globalAlpha = 1;
    }
    // SGR: operating (solid), under construction (dashed, slowly marching), proposed (grey dotted)
    const halo = (pts, p, w) => { c.strokeStyle = 'rgba(244,237,223,0.9)'; c.lineWidth = (w + 5) * px; strokePart(c, pts, p); };
    const cons = (pts, p) => { if (p <= 0) return null; halo(pts, p, 4); c.strokeStyle = PAL.orange; c.lineWidth = 4.2 * px; c.setLineDash([10 * px, 7 * px]); c.lineDashOffset = -t * 14 * px; const h = strokePart(c, pts, p); c.setLineDash([]); return h; };
    const heads = [];
    if (st.rwanda) { c.strokeStyle = '#7f7666'; c.lineWidth = 3 * px; c.setLineDash([1 * px, 7 * px]); heads.push(strokePart(c, R.rwanda, st.rwanda)); c.setLineDash([]); }
    heads.push(cons(R.lot3, st.lot3 ?? 0), cons(R.lot4, st.lot4 ?? 0), cons(R.lot5, st.lot5 ?? 0), cons(R.lot6, st.lot6 ?? 0), cons(R.burundi, st.burundi ?? 0));
    if (st.operating) { halo(R.operating, st.operating, 6); c.strokeStyle = PAL.orange; c.lineWidth = 6.5 * px; heads.push(strokePart(c, R.operating, st.operating)); }
    // drawing heads glow while a line is being drawn
    heads.forEach((h, i) => { if (!h) return; });
    // stations
    (st.stations ?? []).forEach(([k, a, name, side = 'r', big = false]) => {
      if (a <= 0) return; const [x, y] = ST[k];
      c.globalAlpha = a; c.fillStyle = big ? PAL.orange : '#f4eddf'; c.strokeStyle = big ? '#f4eddf' : PAL.ink; c.lineWidth = 2.4 * px;
      c.beginPath(); c.arc(x, y, (big ? 9 : 6.5) * px, 0, Math.PI * 2); c.fill(); c.stroke();
      if (name) {
        const o = { size: big ? 28 : 24, weight: 800, color: PAL.ink, stretch: 'condensed' };
        setFont(c, { ...o, size: o.size * px });
        const dx = side === 'r' ? 16 : side === 'l' ? -16 : 0, dy = side === 'u' ? -18 : side === 'd' ? 34 : 9;
        c.lineWidth = 6 * px; c.strokeStyle = 'rgba(244,237,223,0.92)'; c.textAlign = side === 'l' ? 'right' : side === 'r' ? 'left' : 'center';
        c.strokeText(name, x + dx * px, y + dy * px); c.fillStyle = PAL.ink; c.fillText(name, x + dx * px, y + dy * px);
      }
      c.globalAlpha = 1;
    });
    // pulse rings (e.g. the port)
    (st.pulses ?? []).forEach(([k, a]) => {
      if (a <= 0) return; const [x, y] = ST[k];
      for (let i = 0; i < 3; i++) { const ph = ((t * 0.6 + i / 3) % 1); c.globalAlpha = a * (1 - ph) * 0.8; c.strokeStyle = PAL.orange; c.lineWidth = 2.5 * px; c.beginPath(); c.arc(x, y, (10 + ph * 70) * px, 0, Math.PI * 2); c.stroke(); }
      c.globalAlpha = 1;
    });
    c.restore();
  }
  function legend(c, items, x, y, alpha) {
    if (alpha <= 0) return;
    c.globalAlpha = alpha;
    items.forEach((it, i) => {
      const yy = y + i * 38; c.lineCap = 'round';
      if (it.kind === 'operating') { c.strokeStyle = PAL.orange; c.lineWidth = 6.5; c.setLineDash([]); }
      if (it.kind === 'construction') { c.strokeStyle = PAL.orange; c.lineWidth = 4.2; c.setLineDash([10, 7]); }
      if (it.kind === 'central') { c.strokeStyle = '#6f6758'; c.lineWidth = 2.2; c.setLineDash([2, 5]); }
      if (it.kind === 'proposed') { c.strokeStyle = '#7f7666'; c.lineWidth = 3; c.setLineDash([1, 7]); }
      c.beginPath(); c.moveTo(x, yy); c.lineTo(x + 56, yy); c.stroke(); c.setLineDash([]);
      text(c, it.label, x + 74, yy + 8, { size: 22, family: 'B', weight: 600, color: PAL.ink, alpha });
    });
    c.globalAlpha = 1;
  }
  // a cream card for map annotations
  function card(c, x, y, w, h, alpha) { c.globalAlpha = alpha * 0.94; c.fillStyle = '#f4eddf'; c.fillRect(x, y, w, h); c.globalAlpha = alpha; c.fillStyle = PAL.orange; c.fillRect(x, y, 6, h); c.globalAlpha = 1; }

  // ── Scene 2 · Scale (0:15–0:35) ─────────────────────────────────────────
  // Tanzania sits left of centre; every annotation lives in a column over the Indian Ocean (x ≥ COLX).
  const COLX = 1330, COLW = 500;
  const KEYS2 = [[15.0, { x: 1130, y: 540, z: 0.84 }], [20.6, { x: 1150, y: 540, z: 0.95 }], [24.4, { x: 1120, y: 510, z: 0.97 }], [29.0, { x: 1080, y: 520, z: 0.97 }], [32.6, { x: 1100, y: 520, z: 0.99 }], [35.6, { x: 1300, y: 600, z: 2.6 }]];
  function colCard(c, y, h, a) { card(c, COLX, y, COLW, h, a); }
  function scale(c, t) {
    const S2 = C.scale, cam = camAt(KEYS2, t);
    const opP = eio(prog(t, S2.operating.t, 2.6));
    const l3 = eio(prog(t, S2.corridor.t, 1.3)), l4 = eio(prog(t, S2.corridor.t + 1.2, 0.7)), l5 = eio(prog(t, S2.corridor.t + 1.8, 1.2));
    const l6 = eio(prog(t, S2.kigoma.t, 1.8));
    const near = (p) => clamp(p * 4);
    drawMap(c, t, cam, {
      central: eio(prog(t, S2.central.t, 3.0)), centralAlpha: lerp(1, 0.55, prog(t, S2.operating.t, 1)),
      operating: opP, lot3: l3, lot4: l4, lot5: l5, lot6: l6,
      stations: [
        ['dar', near(prog(t, S2.operating.t - 0.4, 1)), 'Dar es Salaam', 'd', true],
        ['morogoro', near(prog(t, S2.operating.t + 0.9, 1)), 'Morogoro', 'd'],
        ['dodoma', near(prog(t, S2.operating.t + 2.0, 1)), 'Dodoma', 'd', true],
        ['tabora', near(prog(t, S2.corridor.t + 1.1, 1)), 'Tabora', 'd'],
        ['isaka', near(prog(t, S2.corridor.t + 1.8, 1)), 'Isaka', 'r'],
        ['mwanza', near(prog(t, S2.corridor.t + 2.9, 1)), 'Mwanza', 'r', true],
        ['kigoma', near(prog(t, S2.kigoma.t + 1.6, 1)), 'Kigoma', 'l', true],
        ['kigoma', near(prog(t, S2.central.t + 2.6, 0.6)) * (1 - near(prog(t, S2.kigoma.t + 1.6, 1))), null],
      ],
      pulses: [['dar', win(t, S2.operating.t - 0.4, S2.corridor.t, 0.5, 0.8)]],
    });
    finish(c, t, { vignette: 0.18, grainAmt: 0.04, paperAmt: 0.55 });
    const fo = prog(t, 33.4, 0.6);
    // 1914: the old line
    { const a = win(t, S2.central.t, S2.central.out, 0.6, 0.6);
      colCard(c, 150, 160, a);
      text(c, S2.central.year, COLX + 34, 232, { size: 72, weight: 800, color: PAL.ink, alpha: a });
      text(c, S2.central.text, COLX + 34, 278, { size: 23, family: 'B', weight: 500, color: PAL.ink, alpha: a }); }
    // operating since 2024
    { const a = win(t, S2.operating.t + 0.3, 35.6, 0.6, 0.6) * (1 - fo);
      colCard(c, 150, 136, a);
      text(c, S2.operating.text.toUpperCase(), COLX + 34, 202, { size: 23, weight: 700, color: PAL.orange, track: 3, stretch: 'normal', alpha: a });
      text(c, S2.operating.sub, COLX + 34, 256, { size: 48, weight: 800, color: PAL.ink, alpha: a }); }
    // the corridor counter
    { const a = win(t, S2.corridor.t + 0.2, 35.6, 0.6, 0.6) * (1 - fo), p = eo(prog(t, S2.corridor.t + 0.2, 2.6));
      const x = COLX + 34;
      text(c, 'PHASE ONE', x, 360, { size: 23, weight: 700, color: PAL.orange, track: 4, stretch: 'normal', alpha: a });
      const w = text(c, fmt(S2.corridor.value * p), x - 4, 480, { size: 136, weight: 800, color: PAL.ink, alpha: a });
      text(c, S2.corridor.unit, x + w + 12, 480, { size: 54, weight: 800, color: PAL.ink, alpha: a });
      text(c, S2.corridor.label, x, 528, { size: 30, family: 'B', weight: 600, color: PAL.ink, alpha: a });
      text(c, S2.corridor.sub, x, 566, { size: 23, family: 'B', weight: 500, color: PAL.grey2, alpha: a }); }
    // Tabora–Kigoma
    { const a = win(t, S2.kigoma.t + 0.4, 35.6, 0.6, 0.6) * (1 - fo);
      colCard(c, 612, 118, a);
      text(c, S2.kigoma.text, COLX + 34, 664, { size: 38, weight: 800, color: PAL.ink, alpha: a });
      text(c, S2.kigoma.sub, COLX + 34, 704, { size: 23, family: 'B', weight: 600, color: PAL.grey2, alpha: a }); }
    const la = win(t, S2.operating.t + 1, 35.6, 0.8, 0.6) * (1 - fo);
    colCard(c, 800, H - 800 - 40, la * 0.9); legend(c, S2.legend, COLX + 34, 840, la);
    S2.caption.forEach((s, i) => text(c, s, COLX + 34, H - 74 + i * 24, { size: 18, family: 'B', weight: 500, color: PAL.grey2, alpha: la }));
  }

  // ── Dark editorial background (scenes 3–4) ──────────────────────────────
  function darkBg(c, t, glowX = 1500, glowY = 300) {
    c.fillStyle = PAL.charcoal; c.fillRect(0, 0, W, H);
    const g = c.createRadialGradient(glowX, glowY, 0, glowX, glowY, 1100); g.addColorStop(0, 'rgba(232,117,42,0.07)'); g.addColorStop(1, 'rgba(232,117,42,0)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
  }
  function header(c, t, t0, title, sub, out) {
    const p = prog(t, t0, 0.9);
    rule(c, MX, 128, 120 * eo(p), 1 - out);
    reveal(c, title, MX, 214, { size: 76, weight: 800, color: PAL.white, track: 1 }, p, out);
    if (sub) reveal(c, sub, MX, 262, { size: 28, family: 'B', weight: 500, color: PAL.grey }, prog(t, t0 + 0.35, 0.9), out);
  }

  // ── Scene 3a · Station strip (0:35–0:41) ────────────────────────────────
  // Station spacing is proportional to distance along the drawn route.
  const stripPos = (() => {
    const key = { 'Dar es Salaam': 'dar', Pugu: 'pugu', Soga: 'soga', Ruvu: 'ruvu', Ngerengere: 'ngerengere', Morogoro: 'morogoro', Mkata: 'mkata', Kilosa: 'kilosa', Kidete: 'kidete', Gulwe: 'gulwe', Dodoma: 'dodoma', Makutupora: 'makutupora' };
    const pts = R.operating, cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const at = (k) => { const s = ST[key[k]]; let best = 0, bd = 1e9; pts.forEach((p, i) => { const d = Math.hypot(p[0] - s[0], p[1] - s[1]); if (d < bd) { bd = d; best = i; } }); return cum[best]; };
    const total = cum[cum.length - 1];
    return Object.fromEntries(C.engineering.strip.stations.map((n) => [n, at(n) / total]));
  })();
  function strip(c, t) {
    const S = C.engineering.strip; darkBg(c, t);
    const out = prog(t, 41.0, 0.6), x0 = 170, x1 = W - 170, y = 600;
    header(c, t, S.t, S.title, S.sub, out);
    const lp = eio(prog(t, S.t + 0.3, 1.6));
    c.globalAlpha = 1 - out;
    c.fillStyle = '#3a3936'; c.fillRect(x0, y - 3, x1 - x0, 6);
    c.fillStyle = PAL.orange; c.fillRect(x0, y - 3, (x1 - x0) * lp, 6);
    const trainP = stripPos['Dodoma'] * eio(prog(t, S.t + 1.8, 3.2)); // passenger trains run as far as Dodoma
    S.stations.forEach((n, i) => {
      const x = lerp(x0, x1, stripPos[n]), big = S.major.includes(n), a = clamp((lp * 1.08 - stripPos[n]) * 12);
      if (a <= 0) return;
      const passed = trainP >= stripPos[n] - 0.001;
      c.globalAlpha = a * (1 - out);
      c.fillStyle = big ? PAL.orange : (passed && trainP > 0 ? PAL.white : PAL.charcoal); c.strokeStyle = big ? PAL.white : PAL.orange; c.lineWidth = 3;
      c.beginPath(); c.arc(x, y, big ? 13 : 8.5, 0, Math.PI * 2); c.fill(); c.stroke();
      const up = i % 2 === 0; const ly = up ? y - 40 : y + 62;
      c.save(); c.translate(x, ly); if (!big) c.rotate(up ? -0.0 : 0);
      text(c, n, 0, 0, { size: big ? 38 : 26, weight: big ? 800 : 600, family: big ? 'D' : 'B', color: big ? PAL.white : PAL.grey, align: 'center', alpha: a * (1 - out) });
      c.restore();
      c.globalAlpha = a * (1 - out); c.fillStyle = '#4a4945'; c.fillRect(x - 1, up ? y - 30 : y + 18, 2, 12);
    });
    // the train marker
    if (trainP > 0) {
      const tx = lerp(x0, x1, trainP);
      c.globalAlpha = (1 - out) * clamp(prog(t, S.t + 1.6, 0.4));
      const g = c.createRadialGradient(tx, y, 0, tx, y, 90); g.addColorStop(0, 'rgba(232,117,42,0.55)'); g.addColorStop(1, 'rgba(232,117,42,0)');
      c.fillStyle = g; c.fillRect(tx - 90, y - 90, 180, 180);
      c.fillStyle = PAL.white; c.beginPath(); c.roundRect(tx - 34, y - 11, 68, 22, 11); c.fill();
    }
    c.globalAlpha = 1;
    // timetable ends: operating since 2024
    text(c, 'Passenger trains: Dar es Salaam – Dodoma since 2024. Freight since 2025.', MX, 820, { size: 30, family: 'B', weight: 500, color: PAL.cream, alpha: win(t, S.t + 2.2, 41.6, 0.8, 0.6) * (1 - out) });
    sourceLine(c, 'Station order: Tanzania Railways Corporation. Spacing follows the route.', win(t, S.t + 1, 41.6, 0.8, 0.6) * (1 - out));
    finish(c, t, { vignette: 0.35 });
  }

  // ── Scene 3b · Gauge and track layers, cross-section (0:41–0:48) ─────────
  function railProfile(c, cx, top, s, fill) {
    // Flat-bottom rail, 1:1 shape scaled (head 72 mm, web 16 mm, foot 150 mm, height 172 mm)
    const k = s; c.beginPath();
    c.moveTo(cx - 36 * k, top); c.lineTo(cx + 36 * k, top); c.lineTo(cx + 36 * k, top + 40 * k); c.lineTo(cx + 8 * k, top + 52 * k);
    c.lineTo(cx + 8 * k, top + 140 * k); c.lineTo(cx + 75 * k, top + 158 * k); c.lineTo(cx + 75 * k, top + 172 * k); c.lineTo(cx - 75 * k, top + 172 * k);
    c.lineTo(cx - 75 * k, top + 158 * k); c.lineTo(cx - 8 * k, top + 140 * k); c.lineTo(cx - 8 * k, top + 52 * k); c.lineTo(cx - 36 * k, top + 40 * k); c.closePath();
    c.fillStyle = fill; c.fill();
  }
  function gauge(c, t) {
    const S = C.engineering.gauge; darkBg(c, t, 960, 700);
    const out = prog(t, 47.4, 0.6), A = 1 - out;
    header(c, t, S.t, S.title, null, out);
    const k = 0.52, cx = 960, railTop = 520; // px per mm
    const grow = eio(prog(t, S.t + 1.6, 1.6)); // metre → standard
    const gmm = lerp(S.old.mm, S.sgr.mm, grow);
    const half = (gmm * k) / 2;
    const ap = eo(prog(t, S.t + 0.3, 1.0));
    c.globalAlpha = A * ap;
    // formation (embankment), ballast, sleeper
    const sleeperTop = railTop + 172 * k, sleeperH = 210 * k, ballTop = sleeperTop + sleeperH * 0.35;
    c.fillStyle = '#2b2925'; c.beginPath(); c.moveTo(cx - 980, 1000); c.lineTo(cx - 640, ballTop + 160); c.lineTo(cx + 640, ballTop + 160); c.lineTo(cx + 980, 1000); c.closePath(); c.fill();
    c.fillStyle = '#3a3733'; c.beginPath(); c.moveTo(cx - 640, ballTop + 160); c.lineTo(cx - 470, ballTop - 20); c.lineTo(cx + 470, ballTop - 20); c.lineTo(cx + 640, ballTop + 160); c.closePath(); c.fill();
    const br = rnd(4); c.fillStyle = '#4d4944';
    for (let i = 0; i < 520; i++) { const yy = ballTop - 10 + br() * 168, wdt = 470 + (yy - ballTop + 20) / 180 * 170, xx = cx + (br() - 0.5) * 2 * wdt; c.beginPath(); c.ellipse(xx, yy, 4 + br() * 7, 3 + br() * 4, br() * 3, 0, Math.PI * 2); c.fill(); }
    const slW = 2600 * k; c.fillStyle = '#6b6862'; c.fillRect(cx - slW / 2, sleeperTop, slW, sleeperH);
    c.fillStyle = 'rgba(255,255,255,0.08)'; c.fillRect(cx - slW / 2, sleeperTop, slW, 4);
    // rails
    const rc = grow > 0.02 ? mixc('#8e8c86', '#E8752A', grow) : PAL.grey;
    [-1, 1].forEach((sgn) => { railProfile(c, cx + sgn * (half + 36 * k), railTop, k, rc); });
    // ghost of the metre gauge once the rails have moved out
    if (grow > 0.05) { c.globalAlpha = A * 0.5 * grow; c.setLineDash([6, 6]); c.strokeStyle = PAL.grey; c.lineWidth = 2; [-1, 1].forEach((sgn) => { const x = cx + sgn * (S.old.mm * k / 2 + 36 * k); c.strokeRect(x - 36 * k, railTop, 72 * k, 40 * k); }); c.setLineDash([]); }
    c.globalAlpha = A * ap;
    // dimension line measured between the inner faces of the rail heads
    const dy = railTop - 52;
    c.strokeStyle = grow > 0.5 ? PAL.orange : PAL.grey; c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(cx - half, dy); c.lineTo(cx + half, dy); c.moveTo(cx - half, dy - 16); c.lineTo(cx - half, railTop - 6); c.moveTo(cx + half, dy - 16); c.lineTo(cx + half, railTop - 6); c.stroke();
    c.globalAlpha = 1;
    const lbl = grow < 0.5 ? S.old : S.sgr;
    text(c, `${fmt(gmm)} mm`, cx, dy - 26, { size: 64, weight: 800, color: grow > 0.5 ? PAL.orange : PAL.white, align: 'center', alpha: A * ap });
    text(c, lbl.label, cx, dy - 100, { size: 26, family: 'B', weight: 600, color: PAL.grey, align: 'center', alpha: A * ap });
    // layer labels with leader lines (right side)
    const L = [[S.layers[0], cx + half + 36 * k + 40, railTop + 20], [S.layers[1], cx + slW / 2 - 160, sleeperTop + sleeperH / 2], [S.layers[2], cx + 380, ballTop + 70], [S.layers[3], cx + 520, ballTop + 250]];
    L.forEach(([n, x, y], i) => {
      const a = A * eo(prog(t, S.t + 3.4 + i * 0.35, 0.6)); if (a <= 0) return;
      const lx = 1660;
      c.globalAlpha = a; c.strokeStyle = PAL.cream; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, y); c.lineTo(lx - 16, y); c.stroke();
      c.fillStyle = PAL.cream; c.beginPath(); c.arc(x, y, 4, 0, Math.PI * 2); c.fill(); c.globalAlpha = 1;
      text(c, n, lx, y + 9, { size: 28, family: 'B', weight: 600, color: PAL.cream, alpha: a });
    });
    sourceLine(c, 'Track gauge is the distance between the inner faces of the rails. Cross-section is illustrative, not to engineering scale.', win(t, S.t + 0.8, 48, 0.8, 0.6) * A);
    finish(c, t, { vignette: 0.35 });
  }

  // ── Scene 3c · Power and speed (0:48–0:54) ──────────────────────────────
  function power(c, t) {
    const S = C.engineering.power; darkBg(c, t, 500, 400);
    const out = prog(t, 53.8, 0.6), A = 1 - out;
    header(c, t, S.t, S.title, null, out);
    // side elevation: mast, cantilever, messenger and contact wire, pantograph on a car roof
    const ap = eo(prog(t, S.t + 0.3, 1.2)); c.globalAlpha = A * ap;
    const xL = 90, xR = 880, mx = 200, rail = 900, wireY = 470, msgY = 400, roofY = 640;
    c.strokeStyle = PAL.cream; c.lineCap = 'round';
    c.lineWidth = 9; c.beginPath(); c.moveTo(mx, rail); c.lineTo(mx, 330); c.stroke(); // mast
    c.lineWidth = 3; c.beginPath(); c.moveTo(mx, msgY - 10); c.lineTo(mx + 120, msgY); c.moveTo(mx, wireY - 30); c.lineTo(mx + 110, wireY - 4); c.moveTo(mx + 60, msgY - 4); c.lineTo(mx + 60, wireY - 18); c.stroke(); // cantilever
    c.lineWidth = 2.2; c.beginPath(); c.moveTo(xL, msgY + 6); c.quadraticCurveTo((xL + xR) / 2 + 60, msgY + 52, xR, msgY + 6); c.stroke(); // messenger
    c.beginPath(); c.moveTo(xL, wireY); c.lineTo(xR, wireY); c.stroke(); // contact wire
    for (let i = 1; i < 9; i++) { const x = lerp(xL, xR, i / 9), u = (x - xL) / (xR - xL), sag = 52 * 4 * u * (1 - u) * 0.88; c.beginPath(); c.moveTo(x, msgY + 6 + sag); c.lineTo(x, wireY); c.stroke(); } // droppers
    // car body: rounded roof, window band, bogie
    c.lineWidth = 3; c.beginPath(); c.moveTo(xL - 20, rail - 40); c.lineTo(xL - 20, roofY + 30); c.quadraticCurveTo(xL - 20, roofY, xL + 30, roofY); c.lineTo(xR + 40, roofY); c.stroke();
    c.beginPath(); c.moveTo(xL - 20, rail - 40); c.lineTo(xR + 40, rail - 40); c.stroke();
    c.fillStyle = 'rgba(239,231,214,0.05)'; c.fillRect(xL - 20, roofY, xR - xL + 60, rail - 40 - roofY);
    c.fillStyle = 'rgba(239,231,214,0.18)'; for (let x = xL + 40; x < xR; x += 110) c.fillRect(x, roofY + 60, 80, 54);
    c.fillStyle = PAL.cream; [xL + 140, xL + 260, xR - 160, xR - 40].forEach((wx) => { c.beginPath(); c.arc(wx, rail - 22, 22, 0, Math.PI * 2); c.fill(); });
    c.fillRect(xL - 60, rail, xR - xL + 160, 4);
    // pantograph: two-arm, head pressed to the wire
    const pa = 560;
    c.lineWidth = 3.5; c.beginPath(); c.moveTo(pa - 50, roofY - 6); c.lineTo(pa + 40, roofY - 80); c.lineTo(pa - 10, wireY + 6); c.stroke();
    c.lineWidth = 6; c.beginPath(); c.moveTo(pa - 60, wireY + 5); c.lineTo(pa + 40, wireY + 5); c.stroke();
    c.fillRect(pa - 70, roofY - 10, 60, 10);
    // energy pulse along the contact wire, down into the pantograph
    const pp = (t * 0.5) % 1, px = lerp(xL, xR, pp);
    const g = c.createLinearGradient(px - 180, 0, px + 10, 0); g.addColorStop(0, 'rgba(232,117,42,0)'); g.addColorStop(1, 'rgba(232,117,42,1)');
    c.strokeStyle = g; c.lineWidth = 6; c.beginPath(); c.moveTo(Math.max(xL, px - 180), wireY); c.lineTo(px, wireY); c.stroke();
    c.globalAlpha = 1;
    text(c, S.volts, 900, wireY + 10, { size: 64, weight: 800, color: PAL.orange, alpha: A * eo(prog(t, S.t + 0.9, 0.8)) });
    text(c, S.voltsLabel, 900, wireY + 52, { size: 28, family: 'B', weight: 500, color: PAL.grey, alpha: A * eo(prog(t, S.t + 1.1, 0.8)) });
    // speed bars (right)
    const bx = 1200, bw = 600;
    S.speeds.forEach((s, i) => {
      const y = 680 + i * 140, p = eio(prog(t, S.t + 1.6 + i * 0.5, 1.6)), a = A * clamp(p * 3);
      text(c, s.label, bx, y - 22, { size: 28, family: 'B', weight: 600, color: PAL.cream, alpha: a });
      c.globalAlpha = a; c.fillStyle = '#2e2d2a'; c.fillRect(bx, y, bw, 22); c.fillStyle = i === 0 ? PAL.orange : PAL.cream; c.fillRect(bx, y, bw * (s.v / 160) * p, 22); c.globalAlpha = 1;
      text(c, `${fmt(s.v * p)}`, bx + bw + 24, y + 22, { size: 58, weight: 800, color: PAL.white, alpha: a });
    });
    text(c, S.speedNote, bx, 940, { size: 22, family: 'B', weight: 500, color: PAL.grey, alpha: A * prog(t, S.t + 2.4, 0.8) });
    sourceLine(c, 'Source: Railway Journal (design speeds); Tanzania Railways Corporation.', win(t, S.t + 1, 54, 0.8, 0.6) * A);
    finish(c, t, { vignette: 0.35 });
  }

  // ── Scene 3d · Fleet (0:54–1:00) ────────────────────────────────────────
  function fleet(c, t) {
    const S = C.engineering.fleet; darkBg(c, t, 960, 900);
    const out = prog(t, 60.0, 0.7), A = 1 - out;
    header(c, t, S.t, S.title, null, out);
    S.items.forEach((it, i) => {
      const x = MX + i * 560, p = eo(prog(t, S.t + 0.4 + i * 0.35, 1.4)), a = A * clamp(p * 2.5);
      text(c, `${Math.round(it.n * p)}`, x, 480, { size: 190, weight: 800, color: PAL.orange, alpha: a });
      text(c, it.label, x, 540, { size: 34, family: 'B', weight: 600, color: PAL.white, alpha: a });
    });
    // the train in line-art, gliding through the bottom of the frame
    const tx = lerp(W + 200, -900, (t - S.t) / 7.5) ;
    c.save(); c.globalAlpha = A * 0.9; c.translate(tx, 690); c.scale(0.36, 0.36);
    c.filter = 'grayscale(1) brightness(3.2) contrast(0.9)'; c.drawImage(trainSprite, -TRAIN_LEN + 3000, 0); c.filter = 'none';
    c.restore();
    c.globalAlpha = A; c.fillStyle = '#3a3936'; c.fillRect(0, 780, W, 3); c.globalAlpha = 1;
    text(c, S.note, MX, 880, { size: 30, family: 'B', weight: 500, color: PAL.cream, alpha: A * prog(t, S.t + 2.0, 0.8) });
    sourceLine(c, 'Rolling stock: Hyundai Rotem (trains, locomotives), Sung Shin RST (coaches), CRRC (wagons). Railway Journal, Railway Technology.', win(t, S.t + 1, 61, 0.8, 0.6) * A);
    finish(c, t, { vignette: 0.35 });
  }

  // ── Scene 4a · Journey time (1:00–1:08) ─────────────────────────────────
  function journey(c, t) {
    const S = C.change.time; darkBg(c, t, 1600, 200);
    const out = prog(t, 67.8, 0.6), A = 1 - out;
    header(c, t, S.t, 'WHAT CHANGES?', S.title, out);
    const x0 = 560, x1 = W - 470, hourW = (x1 - x0) / 8;
    const axA = A * eo(prog(t, S.t + 0.6, 0.8));
    for (let h = 0; h <= 8; h++) { const x = x0 + h * hourW; c.globalAlpha = axA; c.fillStyle = '#34332f'; c.fillRect(x, 400, 1.5, 420); c.globalAlpha = 1; text(c, `${h} h`, x, 860, { size: 22, family: 'B', weight: 600, color: PAL.grey, align: 'center', alpha: axA }); }
    S.bars.forEach((b, i) => {
      const y = 470 + i * 200, p = eio(prog(t, S.t + 1.0 + i * 1.3, i === 0 ? 2.4 : 1.6)), a = A * clamp(p * 4), sgr = i === 1;
      text(c, b.label, MX, y + 40, { size: 32, family: 'B', weight: 600, color: PAL.white, alpha: a });
      c.globalAlpha = a; c.fillStyle = sgr ? PAL.orange : '#6f6d67'; c.fillRect(x0, y, hourW * b.hours * p, 64);
      if (!sgr) { // "up to": soft end, the figure is a reported range
        const ge = c.createLinearGradient(x0 + hourW * (b.hours - 1.2) * p, 0, x0 + hourW * b.hours * p, 0); ge.addColorStop(0, 'rgba(22,22,21,0)'); ge.addColorStop(1, 'rgba(22,22,21,0.65)'); c.fillStyle = ge; c.fillRect(x0, y, hourW * b.hours * p, 64);
      }
      c.globalAlpha = 1;
      const vx = x0 + hourW * b.hours * p;
      if (p > 0.15) {
        const lw = text(c, b.display, vx + 24, y + 50, { size: 52, weight: 800, color: PAL.white, alpha: a * clamp((p - 0.15) * 3) });
        tag(c, b.tag, vx + 24 + lw + 22, y + 22, sgr ? 'solid' : 'grey', a * clamp((p - 0.5) * 3));
      }
    });
    sourceLine(c, S.note, win(t, S.t + 1, 68, 0.8, 0.6) * A);
    finish(c, t, { vignette: 0.35 });
  }

  // ── Scene 4b · Ridership, unit chart (1:08–1:16) ────────────────────────
  function riders(c, t) {
    const S = C.change.riders; darkBg(c, t, 400, 500);
    const out = prog(t, 75.8, 0.6), A = 1 - out;
    const p = eo(prog(t, S.t + 0.5, 3.6));
    rule(c, MX, 128, 120 * eo(prog(t, S.t, 0.9)), A);
    tag(c, S.tag, MX, 170, 'solid', A * prog(t, S.t + 0.4, 0.5));
    const v = (S.value * p).toFixed(1);
    const w = text(c, v, MX - 6, 520, { size: 300, weight: 800, color: PAL.white, alpha: A * clamp(p * 4) });
    text(c, S.unit, MX + w + 20, 520, { size: 96, weight: 800, color: PAL.orange, alpha: A * clamp(p * 4) });
    reveal(c, S.label, MX, 600, { size: 50, family: 'B', weight: 600, color: PAL.white }, prog(t, S.t + 0.9, 0.9), out);
    reveal(c, `on the SGR, ${S.period}`, MX, 656, { size: 34, family: 'B', weight: 500, color: PAL.grey }, prog(t, S.t + 1.2, 0.9), out);
    // 110 dots = 5.5 million; each dot 50,000 journeys
    const cols = 11, gap = 52, gx = 1180, gy = 300, n = Math.round(110 * p);
    for (let i = 0; i < 110; i++) {
      const x = gx + (i % cols) * gap, y = gy + Math.floor(i / cols) * gap, on = i < n;
      c.globalAlpha = A * eo(prog(t, S.t + 0.2 + i * 0.004, 0.4));
      c.fillStyle = on ? PAL.orange : '#2e2d2a'; c.beginPath(); c.arc(x, y, 17, 0, Math.PI * 2); c.fill();
    }
    c.globalAlpha = 1;
    text(c, 'Each dot: 50,000 journeys', gx - 17, gy + 10 * gap + 64, { size: 22, family: 'B', weight: 500, color: PAL.grey, alpha: A * prog(t, S.t + 1.5, 0.8) });
    sourceLine(c, `Source: ${S.source} (reported figures, about 5.5 million).`, win(t, S.t + 1, 76, 0.8, 0.6) * A);
    finish(c, t, { vignette: 0.35 });
  }

  // ── Scene 4c · Freight, measured vs projected (1:16–1:26) ───────────────
  function freight(c, t) {
    const S = C.change.freight; darkBg(c, t, 1500, 800);
    const out = prog(t, 85.6, 0.8), A = 1 - out;
    header(c, t, S.t, S.title, S.started, out);
    const x0 = MX, max = 520000, bw = W - 2 * MX - 380;
    S.bars.forEach((b, i) => {
      const y = 430 + i * 230, p = eio(prog(t, S.t + 1.0 + i * 1.6, 1.8)), a = A * clamp(p * 4), proj = b.tag === 'PROJECTED';
      text(c, b.label, x0, y - 26, { size: 32, family: 'B', weight: 600, color: PAL.white, alpha: a });
      text(c, `(${b.note})`, x0 + 10 + (setFont(c, { size: 32, family: 'B', weight: 600 }), c.measureText(b.label).width), y - 26, { size: 26, family: 'B', weight: 500, color: PAL.grey, alpha: a });
      const len = bw * (b.tonnes / max) * p;
      c.globalAlpha = a;
      if (proj) { c.setLineDash([14, 9]); c.strokeStyle = PAL.orange; c.lineWidth = 3; c.strokeRect(x0 + 1.5, y + 1.5, len - 3, 81); c.setLineDash([]); c.fillStyle = 'rgba(232,117,42,0.10)'; c.fillRect(x0, y, len, 84); }
      else { c.fillStyle = PAL.orange; c.fillRect(x0, y, len, 84); }
      c.globalAlpha = 1;
      if (p > 0.2) {
        const vx = x0 + len + 28;
        const lw = text(c, proj ? b.display : `${fmt(b.tonnes * p)} t`, vx, y + 62, { size: 60, weight: 800, color: PAL.white, alpha: a });
        tag(c, b.tag, vx + lw + 22, y + 26, proj ? 'projected' : 'solid', a * clamp((p - 0.6) * 3));
      }
    });
    reveal(c, 'Passenger numbers are on record. The freight case is still being made.', MX, 930, { size: 34, family: 'B', weight: 600, color: PAL.cream }, prog(t, S.t + 5.0, 1.0), out);
    sourceLine(c, 'Source: Ministry of Transport (nine-month figure and the TRC projection for 2025/26). Periods differ.', win(t, S.t + 1, 86, 0.8, 0.8) * A);
    finish(c, t, { vignette: 0.35 });
  }

  // ── Scene 5 · The bigger picture (1:25–1:46) ────────────────────────────
  const KEYS5 = [[85.4, { x: 1110, y: 530, z: 0.8 }], [87.2, { x: 1450, y: 590, z: 1.6 }], [90.4, { x: 1460, y: 590, z: 1.65 }], [92.6, { x: 1000, y: 380, z: 1.0 }], [94.6, { x: 1000, y: 380, z: 1.02 }], [96.6, { x: 760, y: 390, z: 1.6 }], [99.0, { x: 770, y: 390, z: 1.62 }], [101.0, { x: 860, y: 260, z: 1.45 }], [103.0, { x: 870, y: 265, z: 1.47 }], [105.4, { x: 1110, y: 530, z: 0.8 }]];
  function region(c, t) {
    const S = C.region, cam = camAt(KEYS5, t);
    drawMap(c, t, cam, {
      operating: 1, lot3: 1, lot4: 1, lot5: 1, lot6: 1,
      burundi: eio(prog(t, S.burundi.t + 0.3, 1.6)), rwanda: eio(prog(t, S.rwanda.t + 0.3, 1.6)),
      lakeHi: win(t, S.lakes.t, S.burundi.t + 0.4, 0.6, 0.6),
      stations: [
        ['dar', 1, 'Dar es Salaam', 'd', true], ['dodoma', 1, 'Dodoma', 'd', true], ['tabora', 1, 'Tabora', 'd'],
        ['mwanza', 1, 'Mwanza', 'r', true], ['kigoma', 1, 'Kigoma', 'l', true], ['isaka', 1, 'Isaka', 'r'], ['uvinza', prog(t, S.burundi.t, 0.6), 'Uvinza', 'd'],
        ['musongati', prog(t, S.burundi.t + 1.7, 0.5), 'Musongati', 'l'], ['kigali', prog(t, S.rwanda.t + 1.7, 0.5), 'Kigali', 'l'],
      ],
      pulses: [['dar', win(t, S.port.t - 0.6, S.lakes.t, 0.5, 0.6)], ['musongati', win(t, S.burundi.t + 1.8, S.rwanda.t, 0.5, 0.6)]],
    });
    finish(c, t, { vignette: 0.18, grainAmt: 0.04, paperAmt: 0.55 });
    const all = win(t, 85.8, 105.6, 0.8, 0.6);
    text(c, 'THE BIGGER PICTURE', COLX + 8, 130, { size: 25, weight: 700, color: PAL.orange, track: 5, stretch: 'normal', alpha: all });
    const cardAt = (a, title, sub, y = 160, h = 132) => {
      colCard(c, y, h, a);
      text(c, title, COLX + 34, y + 60, { size: 40, weight: 800, color: PAL.ink, alpha: a });
      if (sub) text(c, sub, COLX + 34, y + 102, { size: 23, family: 'B', weight: 600, color: PAL.grey2, alpha: a });
    };
    cardAt(win(t, S.port.t, S.lakes.t, 0.6, 0.5), S.port.text, S.port.sub);
    { const a = win(t, S.lakes.t + 0.2, S.burundi.t, 0.6, 0.5);
      colCard(c, 160, 160, a);
      text(c, 'Built to reach', COLX + 34, 214, { size: 40, weight: 800, color: PAL.ink, alpha: a });
      text(c, 'two great lakes', COLX + 34, 258, { size: 40, weight: 800, color: PAL.ink, alpha: a });
      text(c, 'Mwanza: Lake Victoria · Kigoma: Lake Tanganyika', COLX + 34, 296, { size: 21, family: 'B', weight: 600, color: PAL.grey2, alpha: a }); }
    { const a = win(t, S.burundi.t + 0.4, S.rwanda.t, 0.6, 0.5);
      cardAt(a, S.burundi.text, S.burundi.sub);
      const pj = S.burundi.projection, y = 316, a2 = a * prog(t, S.burundi.t + 2.0, 0.6);
      colCard(c, y, 156, a2);
      tag(c, pj.tag, COLX + 34, y + 24, 'projected', a2);
      text(c, pj.text, COLX + 34, y + 92, { size: 23, family: 'B', weight: 600, color: PAL.grey2, alpha: a2 });
      const w1 = text(c, pj.from, COLX + 34, y + 136, { size: 36, weight: 800, color: PAL.grey2, alpha: a2 });
      c.globalAlpha = a2; c.fillStyle = PAL.grey2; c.fillRect(COLX + 32, y + 123, w1 + 4, 2.5); c.globalAlpha = 1;
      text(c, `→  ${pj.to}`, COLX + 34 + w1 + 16, y + 136, { size: 36, weight: 800, color: PAL.orange, alpha: a2 }); }
    cardAt(win(t, S.rwanda.t + 0.4, 103.4, 0.6, 0.5), S.rwanda.text, S.rwanda.sub);
    { const a = win(t, 103.2, 105.6, 0.6, 0.6); cardAt(a, 'One corridor, four stages', 'Operating · being built · launched · proposed'); }
    colCard(c, 800, H - 800 - 40, all * 0.9); legend(c, [...C.scale.legend.slice(0, 2), S.legendExtra], COLX + 34, 840, all);
    C.scale.caption.forEach((s, i) => text(c, s, COLX + 34, H - 74 + i * 24, { size: 18, family: 'B', weight: 500, color: PAL.grey2, alpha: all }));
  }

  // ── Scene 6 · Closing: blue hour, a train approaching (1:45–2:00) ────────
  function closing(c, t) {
    const S = C.closing, HZ = 600, F = 1500, EYE = 1.9, XC = 1.15;
    const proj = (X, Y, Z) => [W / 2 + (F * (X - 0.0)) / Z, HZ + (F * (EYE - Y)) / Z];
    // sky
    let g = c.createLinearGradient(0, 0, 0, HZ + 10);
    g.addColorStop(0, '#0d1116'); g.addColorStop(0.55, '#1f2328'); g.addColorStop(0.85, '#5b3a2a'); g.addColorStop(1, '#c06a33');
    c.fillStyle = g; c.fillRect(0, 0, W, HZ + 10);
    g = c.createRadialGradient(W * 0.62, HZ, 0, W * 0.62, HZ, 900); g.addColorStop(0, 'rgba(232,117,42,0.35)'); g.addColorStop(1, 'rgba(232,117,42,0)'); c.fillStyle = g; c.fillRect(0, 0, W, HZ + 10);
    // horizon hills and trees (slow drift)
    ridge(c, t * 6, 1, 71, HZ + 6, 46, 0.0022, '#181513');
    [[300, 0.8], [520, 0.55], [1480, 0.7], [1720, 1.0]].forEach(([x, s]) => acacia(c, x - (t - 105) * 2, HZ + 6, s, '#141110'));
    // ground
    g = c.createLinearGradient(0, HZ, 0, H); g.addColorStop(0, '#221812'); g.addColorStop(1, '#070605'); c.fillStyle = g; c.fillRect(0, HZ, W, H - HZ);
    // ballast bed
    const quad = (pts, fill) => { c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath(); c.fillStyle = fill; c.fill(); };
    const zN = 2.2, zF = 4000;
    quad([proj(XC - 2.3, 0, zN), proj(XC + 2.3, 0, zN), proj(XC + 2.3, 0, zF), proj(XC - 2.3, 0, zF)], '#1d1916');
    // train position and headlight light on the track
    const zt = lerp(1400, 46, eio(prog(t, 105.2, 12.4)));
    // sleepers
    for (let z = 2.4; z < 160; z += 0.6) {
      const a = clamp(1 - z / 160); const [ax, ay] = proj(XC - 1.3, 0.1, z), [bx] = proj(XC + 1.3, 0.1, z), h = Math.max(1, (F * 0.16) / z);
      const lit = zt > z ? clamp(1 - (zt - z) / 120) * 0.5 : 0;
      c.fillStyle = mixc('#26221f', '#8a6a52', lit, 0.35 + a * 0.4); c.fillRect(ax, ay - h / 2, bx - ax, h);
    }
    // rails, catching the sky
    [-0.7175, 0.7175].forEach((o) => {
      const [nx0, ny] = proj(XC + o - 0.035, 0.17, zN), [nx1] = proj(XC + o + 0.035, 0.17, zN), [fx, fy] = proj(XC + o, 0.17, zF);
      const rg = c.createLinearGradient(0, ny, 0, fy); rg.addColorStop(0, '#9a6c4c'); rg.addColorStop(1, '#f0a066');
      c.beginPath(); c.moveTo(nx0, ny); c.lineTo(nx1, ny); c.lineTo(fx + 0.5, fy); c.lineTo(fx - 0.5, fy); c.closePath(); c.fillStyle = rg; c.fill();
    });
    // masts and wire (right side), from far to near
    const masts = []; for (let z = 3006; z > 4; z -= 50) masts.push(z);
    const mastX = XC + 3.1, wireH = 5.6; // masts on the right of the line
    c.strokeStyle = 'rgba(20,18,17,0.95)'; c.lineWidth = 1.4;
    c.beginPath(); masts.forEach((z, i) => { const [x, y] = proj(XC, wireH, z); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke();
    c.beginPath(); masts.forEach((z, i) => { const [x, y] = proj(XC, wireH + 1.1, z); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke();
    masts.forEach((z) => {
      const [x0, y0] = proj(mastX, 0, z), [, y1] = proj(mastX, 7.4, z), w = Math.max(1, (F * 0.3) / z);
      const [ax, ay] = proj(XC - 0.3, wireH + 1.1, z);
      c.fillStyle = '#15120f'; c.fillRect(x0 - w / 2, y1, w, y0 - y1);
      c.strokeStyle = '#15120f'; c.lineWidth = Math.max(1, w * 0.4); c.beginPath(); c.moveTo(x0, ay); c.lineTo(ax, ay); c.stroke();
    });
    // the train: head-on silhouette, headlights, lit windscreen
    {
      const [lx, ly] = proj(XC - 1.6, 4.1, zt), [rx, ry] = proj(XC + 1.6, 1.0, zt);
      c.fillStyle = '#0e0c0b'; c.beginPath(); c.roundRect(lx, ly, rx - lx, ry - ly, (rx - lx) * 0.18); c.fill();
      const [wx0, wy0] = proj(XC - 1.2, 3.6, zt), [wx1, wy1] = proj(XC + 1.2, 2.7, zt);
      c.fillStyle = 'rgba(120,80,55,0.6)'; c.fillRect(wx0, wy0, wx1 - wx0, wy1 - wy0);
      c.globalCompositeOperation = 'lighter';
      [-1.05, 1.05].forEach((o) => {
        const [hx, hy] = proj(XC + o, 1.6, zt), r = clamp(9000 / zt, 14, 520);
        const hg = c.createRadialGradient(hx, hy, 0, hx, hy, r); hg.addColorStop(0, 'rgba(255,248,232,1)'); hg.addColorStop(0.08, 'rgba(255,228,190,0.75)'); hg.addColorStop(0.4, 'rgba(255,190,130,0.18)'); hg.addColorStop(1, 'rgba(255,180,120,0)');
        c.fillStyle = hg; c.fillRect(hx - r, hy - r, r * 2, r * 2);
      });
      const [cx0, cy0] = proj(XC, 1.6, zt); c.fillStyle = `rgba(255,220,180,${clamp(0.05 + 60 / zt, 0, 0.3)})`; c.fillRect(cx0 - 900, cy0 - 1.5, 1800, 3);
      c.globalCompositeOperation = 'source-over';
    }
    // grade
    g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(0,0,0,0.25)'); g.addColorStop(0.5, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.35)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    finish(c, t, { vignette: 0.55, grainAmt: 0.07 });
    // end fade to near-black for the sources card
    const dark = eio(prog(t, S.sources.t - 0.8, 1.2)); c.fillStyle = `rgba(8,8,8,${dark * 0.86})`; c.fillRect(0, 0, W, H);
    // text
    const fo = prog(t, S.sources.t - 0.9, 0.7);
    reveal(c, S.line1.text, MX, 230, { size: 64, weight: 800, color: PAL.white }, prog(t, S.line1.t, 0.9), fo);
    reveal(c, S.line2.text, MX, 306, { size: 64, weight: 800, color: PAL.grey }, prog(t, S.line2.t, 0.9), fo);
    S.line3.text.forEach((s, i) => reveal(c, s, MX, 452 + i * 78, { size: 70, weight: 800, color: i ? PAL.orange : PAL.white }, prog(t, S.line3.t + i * 0.45, 1.0), fo));
    rule(c, MX, 372, 120 * eo(prog(t, S.line3.t - 0.3, 0.8)), 1 - fo);
    // sources card
    const sa = eo(prog(t, S.sources.t, 1.0));
    rule(c, W / 2 - 60, 470, 120, sa);
    text(c, 'TANZANIA’S STANDARD GAUGE RAILWAY', W / 2, 560, { size: 54, weight: 800, color: PAL.white, align: 'center', track: 1, alpha: sa });
    text(c, S.sources.text, W / 2, 640, { size: 22, family: 'B', weight: 500, color: PAL.grey, align: 'center', alpha: sa });
    text(c, S.sources.asOf, W / 2, 680, { size: 22, family: 'B', weight: 600, color: PAL.cream, align: 'center', alpha: sa });
  }

  // ── Timeline ────────────────────────────────────────────────────────────
  // Each scene draws into an offscreen layer; overlaps crossfade (the first transition is a horizon wipe).
  const SCENES = [
    { a: 0, b: 16.0, draw: opening },
    { a: 14.6, b: 35.8, draw: scale, wipe: 'horizon' },
    { a: 35.0, b: 42.0, draw: strip },
    { a: 41.2, b: 48.2, draw: gauge },
    { a: 47.4, b: 54.6, draw: power },
    { a: 53.6, b: 61.0, draw: fleet },
    { a: 60.0, b: 68.6, draw: journey },
    { a: 67.6, b: 76.6, draw: riders },
    { a: 75.6, b: 86.6, draw: freight },
    { a: 85.4, b: 106.0, draw: region },
    { a: 104.8, b: DUR + 0.1, draw: closing },
  ];
  window.renderFrame = (t) => {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    const live = SCENES.filter((s) => t >= s.a && t < s.b);
    live.forEach((s, i) => {
      const lc = (i % 2 ? layerB : layer).getContext('2d');
      lc.save(); lc.clearRect(0, 0, W, H); s.draw(lc, t); lc.restore();
      const src = i % 2 ? layerB : layer;
      const fade = i === 0 ? 1 : prog(t, s.a, (live[i - 1].b - s.a));
      if (i > 0 && s.wipe === 'horizon') {
        const p = eio(fade), half = p * 1150, y = RAIL_Y;
        ctx.save(); ctx.beginPath(); ctx.rect(0, y - half, W, half * 2); ctx.clip(); ctx.drawImage(src, 0, 0); ctx.restore();
        ctx.fillStyle = PAL.orange; ctx.globalAlpha = 1 - p * 0.6; ctx.fillRect(0, y - half - 2, W, 4); ctx.fillRect(0, y + half - 2, W, 4); ctx.globalAlpha = 1;
      } else {
        ctx.globalAlpha = eio(fade); ctx.drawImage(src, 0, 0); ctx.globalAlpha = 1;
      }
    });
    // fade up from black
    const up = prog(t, 0, 1.2); if (up < 1) { ctx.fillStyle = `rgba(0,0,0,${1 - eio(up)})`; ctx.fillRect(0, 0, W, H); }
  };
  window.FILM = { W, H, DUR, FPS: 30 };
})();
