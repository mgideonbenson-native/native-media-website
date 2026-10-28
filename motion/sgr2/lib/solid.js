/**
 * Dimensional illustrations in plain SVG: a small orbit camera (yaw / pitch / perspective), flat-shaded faces with a
 * fixed key light, and painter's-algorithm depth sorting. Enough for tracks, sleepers, masts and a train body.
 * World units are metres: x along the track, y across it, z up.
 */
(() => {
  const { svg } = window.K;
  const LIGHT = norm([-0.45, -0.6, 0.66]);   // key light from front-left, above (consistent across every illustration)

  function norm(v) { const l = Math.hypot(...v); return v.map((c) => c / l); }
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  /** camera: {yaw, pitch (radians), dist (m), fov (px focal), cx, cy (screen centre), target [x,y,z]} */
  function projector(cam) {
    const cy_ = Math.cos(cam.yaw), sy_ = Math.sin(cam.yaw), cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
    const t = cam.target || [0, 0, 0];
    const eye = [t[0] - cam.dist * cp * cy_, t[1] - cam.dist * cp * sy_, t[2] + cam.dist * sp];
    const f = norm(sub(t, eye)), r = norm(cross(f, [0, 0, 1])), u = cross(r, f);
    return {
      eye,
      p(v) {
        const d = sub(v, eye);
        const x = dot(d, r), y = dot(d, u), z = dot(d, f);
        const s = cam.ortho ? cam.fov / cam.dist : cam.fov / Math.max(0.05, z);
        return [cam.cx + x * s, cam.cy - y * s, z];
      },
    };
  }

  /** shade a base colour by the face normal against the key light (and a cool fill from the sky) */
  function shade(hex, n, amb = 0.42) {
    const k = Math.max(0, dot(n, LIGHT)), sky = Math.max(0, n[2]) * 0.12;
    const m = amb + (1 - amb) * k + sky;
    const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    return `rgb(${c.map((v) => Math.round(Math.min(255, v * m))).join(',')})`;
  }

  /**
   * A scene graph of faces: add box(), prism(), poly() into a list, then draw(group, projector) renders them back to
   * front. Faces facing away from the camera are culled.
   */
  function Solid() {
    const faces = [];
    const api = {
      faces,
      poly(pts, color, opt = {}) { faces.push({ pts, color, ...opt }); return api; },
      /** axis-aligned box from min corner [x,y,z] and size [dx,dy,dz]; optional chamfer-free */
      box(o, s, color, opt = {}) {
        const [x, y, z] = o, [a, b, c] = s;
        const v = (i, j, k) => [x + i * a, y + j * b, z + k * c];
        const F = [[v(0, 0, 1), v(1, 0, 1), v(1, 1, 1), v(0, 1, 1)], [v(0, 0, 0), v(0, 1, 0), v(1, 1, 0), v(1, 0, 0)],
          [v(0, 0, 0), v(1, 0, 0), v(1, 0, 1), v(0, 0, 1)], [v(0, 1, 0), v(0, 1, 1), v(1, 1, 1), v(1, 1, 0)],
          [v(0, 0, 0), v(0, 0, 1), v(0, 1, 1), v(0, 1, 0)], [v(1, 0, 0), v(1, 1, 0), v(1, 1, 1), v(1, 0, 1)]];
        F.forEach((f) => faces.push({ pts: f, color, ...opt }));
        return api;
      },
      /** extrude a closed 2D profile (in the y–z plane) along x from x0 to x1 */
      prism(profile, x0, x1, color, opt = {}) {
        const n = profile.length;
        for (let i = 0; i < n; i++) {
          const [y0, z0] = profile[i], [y1, z1] = profile[(i + 1) % n];
          faces.push({ pts: [[x0, y0, z0], [x1, y0, z0], [x1, y1, z1], [x0, y1, z1]], color, ...opt });
        }
        faces.push({ pts: profile.map(([y, z]) => [x1, y, z]), color, ...opt });
        faces.push({ pts: profile.slice().reverse().map(([y, z]) => [x0, y, z]), color, ...opt });
        return api;
      },
    };
    return api;
  }

  /** render faces into an SVG group (cleared first); returns nothing. */
  function draw(g, P, faces, { stroke = 'rgba(0,0,0,0.25)', sw = 0.6, cull = true } = {}) {
    while (g.firstChild) g.removeChild(g.firstChild);
    const items = [];
    for (const f of faces) {
      const n = norm(cross(sub(f.pts[1], f.pts[0]), sub(f.pts[2], f.pts[0])));
      const c = f.pts.reduce((a, p) => [a[0] + p[0], a[1] + p[1], a[2] + p[2]], [0, 0, 0]).map((v) => v / f.pts.length);
      if (cull && dot(n, sub(P.eye, c)) <= 0) continue;
      const sp = f.pts.map((p) => P.p(p));
      items.push({ d: sp.reduce((a, p) => a + p[2], 0) / sp.length + (f.bias || 0), sp, f, n });
    }
    items.sort((a, b) => b.d - a.d);
    for (const it of items) {
      svg('path', {
        d: 'M' + it.sp.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L') + 'Z',
        fill: it.f.flat ? it.f.color : shade(it.f.color, it.n, it.f.amb),
        stroke: it.f.stroke ?? stroke, 'stroke-width': it.f.sw ?? sw, 'stroke-linejoin': 'round',
        opacity: it.f.opacity ?? 1,
      }, g);
    }
  }

  window.SOLID = { projector, Solid, draw, shade, norm };
})();
