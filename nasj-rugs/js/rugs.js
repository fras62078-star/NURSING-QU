/* =====================================================================
   Rugs — مولّد صور تمثيلية للسجاد (SVG إجرائي)
   كل منتج يحصل على نقشة فريدة حسب نمطه ولوحة ألوانه، مع عدة زوايا:
   full (كاملة) / room (داخل غرفة) / close (قريبة) / corner (الزاوية والإطار)
   عند التحويل لمتجر فعلي تُستبدل بصور المنتجات الحقيقية.
   ===================================================================== */
const Rugs = (() => {
  const W = 200, H = 300;
  const cache = new Map();
  let uid = 0;

  function rng(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const n = v => Math.round(v * 10) / 10;
  const rect = (x, y, w, h, fill, extra = '') => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="${fill}" ${extra}/>`;
  const poly = (pts, fill, extra = '') => `<polygon points="${pts.map(p => n(p[0]) + ',' + n(p[1])).join(' ')}" fill="${fill}" ${extra}/>`;
  const circ = (x, y, r, fill, extra = '') => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${fill}" ${extra}/>`;
  const dia = (cx, cy, rx, ry, fill, extra = '') => poly([[cx, cy - ry], [cx + rx, cy], [cx, cy + ry], [cx - rx, cy]], fill, extra);
  const rot = (a, x, y) => `transform="rotate(${n(a)} ${n(x)} ${n(y)})"`;

  function star(cx, cy, ro, ri, k, r0 = 0) {
    const p = [];
    for (let i = 0; i < k * 2; i++) {
      const a = r0 + Math.PI * i / k, rr = i % 2 ? ri : ro;
      p.push([cx + Math.sin(a) * rr, cy - Math.cos(a) * rr]);
    }
    return p;
  }
  function rosette(cx, cy, R, petal, center, k = 8) {
    let s = '';
    for (let i = 0; i < k; i++) s += `<ellipse cx="${n(cx)}" cy="${n(cy - R * 0.55)}" rx="${n(R * 0.26)}" ry="${n(R * 0.48)}" fill="${petal}" ${rot(360 * i / k, cx, cy)}/>`;
    return s + circ(cx, cy, R * 0.28, center);
  }
  function flower(cx, cy, R, petal, center, k = 5, r0 = 0) {
    let s = '';
    for (let i = 0; i < k; i++) s += `<ellipse cx="${n(cx)}" cy="${n(cy - R * 0.5)}" rx="${n(R * 0.42)}" ry="${n(R * 0.55)}" fill="${petal}" ${rot(r0 + 360 * i / k, cx, cy)}/>`;
    return s + circ(cx, cy, R * 0.3, center);
  }
  const leaf = (cx, cy, len, ang, col) => `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(len * 0.22)}" ry="${n(len / 2)}" fill="${col}" ${rot(ang, cx, cy)}/>`;
  const cloud = (x, y, k, col, extra = '') => `<g fill="${col}" ${extra}>${circ(x, y, 13 * k, col)}${circ(x + 13 * k, y + 4 * k, 10 * k, col)}${circ(x - 13 * k, y + 4 * k, 9 * k, col)}${rect(x - 22 * k, y + 4 * k, 44 * k, 10 * k, col, `rx="${n(5 * k)}"`)}</g>`;

  /* ---------------- إطار عام بزخارف متكررة ---------------- */
  function border(c, bw, motif) {
    let s = rect(0, 0, W, H, c[1]);
    s += rect(3, 3, W - 6, H - 6, 'none', `stroke="${c[3]}" stroke-width="1.2"`);
    const m = bw / 2, st = bw * 0.95;
    const nx = Math.max(1, Math.round((W - 2 * m) / st)), ny = Math.max(1, Math.round((H - 2 * m) / st));
    for (let i = 0; i <= nx; i++) { const x = m + i * (W - 2 * m) / nx; s += motif(x, m) + motif(x, H - m); }
    for (let i = 1; i < ny; i++) { const y = m + i * (H - 2 * m) / ny; s += motif(m, y) + motif(W - m, y); }
    s += rect(bw - 3, bw - 3, W - 2 * bw + 6, H - 2 * bw + 6, c[4]);
    s += rect(bw, bw, W - 2 * bw, H - 2 * bw, c[0]);
    return s;
  }

  /* ---------------- البوهيمي ---------------- */
  function band(t, y, h, col, c) {
    let s = '';
    switch (t) {
      case 0: return rect(0, y, W, h, col);
      case 1: { s += rect(0, y, W, h, c[0]); const k = h > 16 ? 3 : 2; for (let i = 0; i < k; i++) s += rect(0, y + (h / (k + 1)) * (i + 1) - 1, W, 2, col); return s; }
      case 2: { s += rect(0, y, W, h, c[0]); const st = h; const off = (W % st) / 2 - st / 2; for (let x = off; x < W; x += st) s += poly([[x + st / 2, y + 1], [x + st - 1, y + h / 2], [x + st / 2, y + h - 1], [x + 1, y + h / 2]], col) + circ(x + st / 2, y + h / 2, h * 0.1, c[0]); return s; }
      case 3: { s += rect(0, y, W, h, c[0]); const st = Math.max(8, h); let d = `M0 ${n(y + h * 0.8)}`; for (let x = 0; x <= W + st; x += st) d += ` L${n(x + st / 2)} ${n(y + h * 0.2)} L${n(x + st)} ${n(y + h * 0.8)}`; return s + `<path d="${d}" fill="none" stroke="${col}" stroke-width="${n(Math.max(1.5, h / 6))}"/>`; }
      case 4: { s += rect(0, y, W, h, col); const st = h * 0.9; for (let x = 0; x < W; x += st) s += poly([[x, y + h], [x + st / 2, y + 2], [x + st, y + h]], c[0]); return s; }
      default: { s += rect(0, y, W, h, c[0]); const st = Math.max(7, h * 0.8); for (let x = st / 2; x < W; x += st) s += circ(x, y + h / 2, Math.min(h, st) * 0.22, col); return s; }
    }
  }
  function bohemian(c, r, v) {
    if (v === 'lattice') {
      let s = rect(0, 0, W, H, c[0]);
      const st = 30 + Math.floor(r() * 12);
      let d = '';
      for (let k = -Math.ceil(H / st) * st; k < W + H; k += st) d += `M${k} 0L${k + H} ${H}M${k} 0L${k - H} ${H}`;
      s += `<path d="${d}" stroke="${c[1]}" stroke-width="2.4" fill="none"/>`;
      s += `<path d="${d}" stroke="${c[1]}" stroke-width=".8" fill="none" opacity=".5" transform="translate(0 5)"/>`;
      for (let a = 0; a <= Math.ceil(W / (st / 2)); a++) for (let b = 0; b <= Math.ceil(H / (st / 2)); b++) if ((a + b) % 2) s += dia(a * st / 2, b * st / 2, 3.4, 3.4, c[3]);
      for (const y0 of [0, H - 18]) s += rect(0, y0, W, 18, c[0]) + rect(0, y0 + 4, W, 2.5, c[1]) + rect(0, y0 + 9, W, 2.5, c[2]) + rect(0, y0 + 14, W, 1.5, c[1]);
      return s;
    }
    const half = []; let y = 0;
    while (y < H / 2) {
      const h = Math.min(8 + Math.floor(r() * 24), H / 2 - y);
      half.push({ h, t: h < 8 ? 0 : Math.floor(r() * 6), col: c[1 + Math.floor(r() * (c.length - 1))] });
      y += h;
    }
    let s = ''; y = 0;
    for (const b of half.concat([...half].reverse())) { s += band(b.t, y, b.h, b.col, c); y += b.h; }
    return s;
  }

  /* ---------------- المودرن ---------------- */
  function modern(c, r, v) {
    let s = rect(0, 0, W, H, c[0]);
    if (v === 'arcs') {
      for (let i = 0; i < 5; i++) s += circ(r() * W, r() * H, 40 + r() * 70, c[1 + (i % 4)], `opacity="${n(0.55 + r() * 0.4)}"`);
      for (let i = 0; i < 3; i++) s += circ(r() * W, r() * H, 30 + r() * 80, 'none', `stroke="${c[3]}" stroke-width="1.2"`);
    } else if (v === 'blocks') {
      const rects = [[8, 8, W - 16, H - 16]];
      for (let i = 0; i < 6; i++) {
        const idx = Math.floor(r() * rects.length);
        const [x, y, w, h] = rects.splice(idx, 1)[0];
        if (w > h) { const k = w * (0.3 + r() * 0.4); rects.push([x, y, k, h], [x + k, y, w - k, h]); }
        else { const k = h * (0.3 + r() * 0.4); rects.push([x, y, w, k], [x, y + k, w, h - k]); }
      }
      rects.forEach(q => { s += rect(q[0] + 2, q[1] + 2, q[2] - 4, q[3] - 4, c[1 + Math.floor(r() * 4)], 'rx="2"'); });
    } else if (v === 'waves') {
      const ph = r() * 6;
      let blob = `M0 ${H}L0 ${n(H * 0.55)}`;
      for (let x = 0; x <= W; x += 10) blob += `L${x} ${n(H * 0.55 + Math.sin(x / 30 + ph) * 18)}`;
      s += `<path d="${blob}L${W} ${H}Z" fill="${c[1]}" opacity=".35"/>`;
      for (let i = 0; i < 24; i++) {
        const y0 = 6 + i * (H / 24), a = 5 + r() * 6;
        let d = `M0 ${n(y0)}`;
        for (let x = 0; x <= W; x += 8) d += `L${x} ${n(y0 + Math.sin(x / 26 + ph + i * 0.35) * a)}`;
        s += `<path d="${d}" fill="none" stroke="${i % 4 === 0 ? c[3] : c[2]}" stroke-width="${i % 4 === 0 ? 1.8 : 0.9}" opacity=".8"/>`;
      }
    } else {
      for (let i = 0; i < 6; i++) {
        const d = `M${n(r() * W)} ${n(r() * H)} C ${n(r() * W)} ${n(r() * H)}, ${n(r() * W)} ${n(r() * H)}, ${n(r() * W)} ${n(r() * H)}`;
        s += `<path d="${d}" fill="none" stroke="${c[1 + i % 4]}" stroke-width="${n(6 + r() * 16)}" stroke-linecap="round" opacity="${n(0.6 + r() * 0.35)}"/>`;
      }
    }
    return s;
  }

  /* ---------------- الكلاسيكي ---------------- */
  function classic(c, r, v) {
    const bw = 22, id = 'k' + (uid++);
    let s = border(c, bw, (x, y) => rosette(x, y, 7, c[2], c[3], 6));
    s += `<defs><pattern id="${id}p" width="16" height="16" patternUnits="userSpaceOnUse" x="${bw}" y="${bw}"><circle cx="8" cy="8" r="1.6" fill="${c[3]}" opacity=".55"/><path d="M0 0L4 0 0 4Z M16 16L12 16 16 12Z" fill="${c[2]}" opacity=".35"/></pattern>
      <clipPath id="${id}f"><rect x="${bw}" y="${bw}" width="${W - 2 * bw}" height="${H - 2 * bw}"/></clipPath></defs>`;
    s += rect(bw, bw, W - 2 * bw, H - 2 * bw, `url(#${id}p)`);
    s += `<g clip-path="url(#${id}f)">`;
    for (const [x, y] of [[bw, bw], [W - bw, bw], [bw, H - bw], [W - bw, H - bw]]) s += circ(x, y, 36, c[2]) + circ(x, y, 30, c[1]) + circ(x, y, 22, c[3], 'opacity=".9"') + circ(x, y, 12, c[2]);
    s += '</g>';
    const cx = 100, cy = 150;
    s += dia(cx, cy - 74, 13, 16, c[2]) + dia(cx, cy + 74, 13, 16, c[2]);
    if (v === 'diamond') {
      s += dia(cx, cy, 64, 98, c[2]) + dia(cx, cy, 54, 86, c[1]) + dia(cx, cy, 42, 68, c[3], 'opacity=".25"');
      s += rosette(cx, cy - 40, 12, c[2], c[4], 6) + rosette(cx, cy + 40, 12, c[2], c[4], 6);
    } else {
      s += poly(star(cx, cy, 58, 46, 16), c[2]);
      s += `<ellipse cx="${cx}" cy="${cy}" rx="40" ry="48" fill="${c[1]}"/>`;
      s += poly(star(cx, cy, 36, 28, 12), c[3]);
    }
    s += rosette(cx, cy, 26, c[2], c[4], 8) + circ(cx, cy, 6, c[1]);
    return s;
  }

  /* ---------------- الفرنسي ---------------- */
  function french(c, r, v) {
    let s = rect(0, 0, W, H, c[1]);
    s += rect(14, 14, W - 28, H - 28, c[0]);
    s += rect(18, 18, W - 36, H - 36, 'none', `stroke="${c[1]}" stroke-width="1.2"`);
    for (let i = 0; i <= 10; i++) { const x = 7 + (W - 14) * i / 10; s += leaf(x + 9, 7, 7, 90, c[3]) + leaf(x + 9, H - 7, 7, 90, c[3]) + flower(x, 7, 4, c[2], c[4]) + flower(x, H - 7, 4, c[2], c[4]); }
    for (let i = 1; i < 15; i++) { const y = 7 + (H - 14) * i / 15; s += leaf(7, y + 9, 7, 0, c[3]) + leaf(W - 7, y + 9, 7, 0, c[3]) + flower(7, y, 4, c[2], c[4]) + flower(W - 7, y, 4, c[2], c[4]); }
    const cx = 100, cy = 150, open = v === 'open';
    const ex = open ? 62 : 50, ey = open ? 100 : 76, k = open ? 18 : 14;
    s += `<ellipse cx="${cx}" cy="${cy}" rx="${ex}" ry="${ey}" fill="none" stroke="${c[3]}" stroke-width="1.4" opacity=".7"/>`;
    for (let i = 0; i < k; i++) {
      const a = 2 * Math.PI * i / k, x = cx + Math.cos(a) * ex, y = cy + Math.sin(a) * ey, deg = a * 180 / Math.PI;
      s += leaf(x + Math.cos(a + 0.5) * 7, y + Math.sin(a + 0.5) * 7, 12, deg, c[3]);
      s += i % 2 ? flower(x, y, 7, c[2], c[4], 5, deg) : flower(x, y, 4.5, c[4], c[2], 6, deg);
    }
    if (open) {
      s += flower(cx, cy, 9, c[2], c[4], 5);
      for (let j = 0; j < 4; j++) s += leaf(cx + Math.cos(j * Math.PI / 2) * 14, cy + Math.sin(j * Math.PI / 2) * 14, 12, j * 90 + 90, c[3]);
    } else {
      for (let j = 0; j < 6; j++) { const a = j * Math.PI / 3; s += leaf(cx + Math.cos(a) * 22, cy + Math.sin(a) * 22, 16, j * 60 + 90, c[3]); }
      s += flower(cx, cy, 16, c[2], c[4], 6);
      for (const [dx, dy] of [[0, -34], [0, 34], [-26, 0], [26, 0]]) s += flower(cx + dx, cy + dy, 6, c[4], c[2], 5);
    }
    for (const [x, y, a] of [[36, 36, 45], [W - 36, 36, 135], [36, H - 36, -45], [W - 36, H - 36, -135]]) s += leaf(x, y, 18, a, c[3]) + leaf(x, y, 18, a + 90, c[3]) + flower(x, y, 9, c[2], c[4]);
    return s;
  }

  /* ---------------- الشرقي ---------------- */
  function oriental(c, r, v) {
    const bw = 24, id = 'o' + (uid++), t = 22, th = t * 1.3;
    let s = border(c, bw, (x, y) => dia(x, y, 7, 7, c[2]) + dia(x, y, 3.5, 3.5, c[0]) + circ(x, y, 1.2, c[3]));
    s += `<defs><pattern id="${id}" width="${t}" height="${n(th)}" patternUnits="userSpaceOnUse" x="${bw}" y="${bw}">
      <path d="M${t / 2} 0 L${t} ${n(th / 2)} L${t / 2} ${n(th)} L0 ${n(th / 2)}Z" fill="none" stroke="${c[2]}" stroke-width="1.1"/>
      ${rosette(t / 2, th / 2, 6.5, c[3], c[2], 6)}
      ${leaf(2.5, 2.5, 6, 135, c[4])}${leaf(t - 2.5, 2.5, 6, 45, c[4])}${leaf(2.5, th - 2.5, 6, 45, c[4])}${leaf(t - 2.5, th - 2.5, 6, 135, c[4])}
    </pattern></defs>`;
    s += rect(bw, bw, W - 2 * bw, H - 2 * bw, `url(#${id})`);
    if (v === 'medallion') {
      s += dia(100, 150, 50, 72, c[1]) + dia(100, 150, 44, 64, c[0]);
      s += poly(star(100, 150, 34, 26, 12), c[2]) + rosette(100, 150, 22, c[3], c[1]) + circ(100, 150, 4, c[2]);
    }
    return s;
  }

  /* ---------------- الفاخر ---------------- */
  function luxury(c, r, v) {
    const g = 'l' + (uid++);
    let s = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset=".55" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[0]}"/></linearGradient></defs>`;
    s += rect(0, 0, W, H, `url(#${g})`);
    if (v === 'deco') {
      const t = 22;
      s += `<defs><pattern id="${g}p" width="${t}" height="${t / 2}" patternUnits="userSpaceOnUse"><path d="M0 ${t / 2} A ${t / 2} ${t / 2} 0 0 1 ${t} ${t / 2}" fill="none" stroke="${c[2]}" stroke-width=".7" opacity=".55"/><path d="M${t * 0.2} ${t / 2} A ${t * 0.3} ${t * 0.3} 0 0 1 ${t * 0.8} ${t / 2}" fill="none" stroke="${c[2]}" stroke-width=".5" opacity=".4"/><path d="M${t / 2} ${t / 2} V${t * 0.12}" stroke="${c[2]}" stroke-width=".4" opacity=".35"/></pattern></defs>`;
      s += rect(0, 0, W, H, `url(#${g}p)`);
      s += rect(10, 10, W - 20, H - 20, 'none', `stroke="${c[2]}" stroke-width="1.4"`) + rect(15, 15, W - 30, H - 30, 'none', `stroke="${c[2]}" stroke-width=".6"`);
      s += dia(100, 150, 62, 94, c[0], `stroke="${c[2]}" stroke-width="1.6"`) + dia(100, 150, 52, 80, 'none', `stroke="${c[2]}" stroke-width=".6"`);
      let rays = '';
      for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12; rays += `M${n(100 + Math.cos(a) * 10)} ${n(150 + Math.sin(a) * 10)}L${n(100 + Math.cos(a) * 34)} ${n(150 + Math.sin(a) * 34)}`; }
      s += `<path d="${rays}" stroke="${c[2]}" stroke-width=".6" opacity=".8"/>` + circ(100, 150, 8, c[2]) + circ(100, 150, 36, 'none', `stroke="${c[2]}" stroke-width=".8"`);
      for (const [x, y, sx, sy] of [[15, 15, 1, 1], [W - 15, 15, -1, 1], [15, H - 15, 1, -1], [W - 15, H - 15, -1, -1]]) {
        for (const R of [16, 24, 32]) s += `<path d="M${x + sx * R} ${y} A ${R} ${R} 0 0 ${sx * sy > 0 ? 1 : 0} ${x} ${y + sy * R}" fill="none" stroke="${c[2]}" stroke-width=".7"/>`;
      }
    } else {
      for (let i = 0; i < 8; i++) {
        let x = r() * W, y = -10, d = `M${n(x)} ${y}`;
        for (let k = 0; k < 6; k++) { const nx = x + (r() - 0.5) * 90, ny = y + 50 + r() * 20; d += ` Q ${n((x + nx) / 2 + (r() - 0.5) * 40)} ${n((y + ny) / 2)} ${n(nx)} ${n(ny)}`; x = nx; y = ny; }
        const major = i % 3 === 0;
        s += `<path d="${d}" fill="none" stroke="${major ? c[2] : c[3]}" stroke-width="${n(major ? 1.2 + r() * 1.6 : 0.6 + r() * 0.8)}" opacity="${major ? 0.9 : 0.35}"/>`;
      }
      s += rect(8, 8, W - 16, H - 16, 'none', `stroke="${c[2]}" stroke-width="1.2"`);
    }
    s += `<defs><linearGradient id="${g}s" x1="0" y1="0" x2="1" y2=".6"><stop offset=".2" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".13"/><stop offset=".8" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>` + rect(0, 0, W, H, `url(#${g}s)`);
    return s;
  }

  /* ---------------- الأطفال ---------------- */
  function kids(c, r, v) {
    let s = rect(0, 0, W, H, c[0]);
    const star5 = (x, y, R, col, extra = '') => poly(star(x, y, R, R * 0.45, 5), col, extra);
    if (v === 'rainbow') {
      [c[1], c[2], c[3], c[4]].forEach((col, i) => { const R = 78 - i * 14; s += `<path d="M${100 - R} 200 A ${R} ${R} 0 0 1 ${100 + R} 200" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round"/>`; });
      s += cloud(36, 200, 1, '#fff') + cloud(164, 200, 1, '#fff') + cloud(56, 62, 0.75, '#fff') + cloud(150, 40, 0.6, '#fff');
      for (let i = 0; i < 8; i++) s += star5(15 + r() * 170, 15 + r() * 100, 3 + r() * 3, c[2]);
      for (let x = 14; x < W; x += 18) s += circ(x, 262, 4, c[1 + (Math.round(x / 18) % 4)]);
    } else if (v === 'night') {
      for (let i = 0; i < 46; i++) s += circ(r() * W, r() * H, 0.5 + r() * 1.2, c[2], `opacity="${n(0.4 + r() * 0.5)}"`);
      for (let i = 0; i < 10; i++) s += star5(14 + r() * 172, 14 + r() * 200, 3 + r() * 4, c[1]);
      s += circ(140, 72, 24, c[1]) + circ(151, 63, 21, c[0]);
      s += cloud(50, 248, 1.3, c[4]) + cloud(150, 262, 1.5, c[4]) + cloud(96, 284, 1.6, c[3], 'opacity=".55"');
    } else {
      for (let i = 0; i < 30; i++) {
        const x = 12 + r() * (W - 24), y = 12 + r() * (H - 24), sz = 6 + r() * 10, col = c[1 + Math.floor(r() * 4)], t = Math.floor(r() * 4), a = Math.floor(r() * 360);
        if (t === 0) s += circ(x, y, sz * 0.6, col);
        else if (t === 1) s += poly([[x, y - sz * 0.7], [x + sz * 0.65, y + sz * 0.5], [x - sz * 0.65, y + sz * 0.5]], col, rot(a, x, y));
        else if (t === 2) s += `<path d="M${n(x - sz / 2)} ${n(y)}h${n(sz)}M${n(x)} ${n(y - sz / 2)}v${n(sz)}" stroke="${col}" stroke-width="3.2" stroke-linecap="round" ${rot(a, x, y)}/>`;
        else s += `<path d="M${n(x - sz)} ${n(y)} q${n(sz / 2)} ${n(-sz / 2)} ${n(sz)} 0 t${n(sz)} 0" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round" ${rot(a, x, y)}/>`;
      }
    }
    s += rect(9, 9, W - 18, H - 18, 'none', `stroke="${v === 'night' ? c[3] : c[1]}" stroke-width="2" stroke-dasharray="5 6" rx="10" opacity=".8"`);
    return s;
  }

  /* ---------------- الهندسي ---------------- */
  function geometric(c, r, v) {
    let s = rect(0, 0, W, H, c[0]);
    if (v === 'chevron') {
      const rowH = 24, st = 25, amp = 14, th = 11;
      for (let y = -30, i = 0; y < H + 30; y += rowH, i++) {
        const top = [], bot = [];
        for (let k = 0, x = 0; x <= W + st; x += st, k++) { const yy = y + (k % 2 ? amp : 0); top.push([x, yy]); bot.unshift([x, yy + th]); }
        s += poly(top.concat(bot), [c[1], c[2], c[3], c[1]][i % 4]);
      }
    } else if (v === 'triangles') {
      const t = 25, cols = [c[0], c[0], c[1], c[2], c[3], c[4]];
      for (let y = 0; y < H; y += t) for (let x = 0; x < W; x += t) {
        s += poly([[x, y], [x + t, y], [x, y + t]], cols[Math.floor(r() * cols.length)]);
        s += poly([[x + t, y], [x + t, y + t], [x, y + t]], cols[Math.floor(r() * cols.length)]);
      }
    } else if (v === 'hex') {
      const R = 15, hw = Math.sqrt(3) * R; let row = 0;
      for (let y = -R; y < H + R; y += 1.5 * R, row++) for (let x = (row % 2 ? hw / 2 : 0) - hw; x < W + hw; x += hw) {
        const pts = []; for (let k = 0; k < 6; k++) { const a = Math.PI / 3 * k + Math.PI / 6; pts.push([x + Math.cos(a) * R * 0.9, y + Math.sin(a) * R * 0.9]); }
        const roll = r();
        s += poly(pts, roll < 0.2 ? c[2] : roll < 0.32 ? c[3] : 'none', `stroke="${c[1]}" stroke-width="1.8"`);
      }
    } else {
      const t = 40;
      for (let y = 0; y < H; y += t) for (let x = 0; x < W; x += t) {
        const k = ((x + y) / t) % 2;
        s += rect(x, y, t, t, k ? c[1] : c[0]) + dia(x + t / 2, y + t / 2, t / 2 - 3, t / 2 - 3, k ? c[3] : c[2]) + rect(x + t / 2 - 6, y + t / 2 - 6, 12, 12, k ? c[1] : c[0]) + circ(x + t / 2, y + t / 2, 2.5, k ? c[3] : c[2]);
      }
    }
    s += rect(6, 6, W - 12, H - 12, 'none', `stroke="${c[1]}" stroke-width="2"`);
    return s;
  }

  /* ---------------- البسيط ---------------- */
  function minimalist(c, r, v) {
    const id = 'm' + (uid++);
    let s = rect(0, 0, W, H, c[0]);
    s += `<defs><pattern id="${id}" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="1.4" height="4" fill="${c[1]}" opacity=".55"/></pattern></defs>` + rect(0, 0, W, H, `url(#${id})`);
    if (v === 'border') {
      s += rect(12, 12, W - 24, H - 24, 'none', `stroke="${c[2]}" stroke-width="2"`) + rect(17, 17, W - 34, H - 34, 'none', `stroke="${c[3]}" stroke-width=".7" opacity=".6"`);
    } else if (v === 'split') {
      const d = `M0 ${H * 0.62} C ${W * 0.35} ${H * 0.55}, ${W * 0.6} ${H * 0.72}, ${W} ${H * 0.64}`;
      s += `<path d="${d} L${W} ${H} L0 ${H}Z" fill="${c[2]}" opacity=".55"/><path d="${d}" fill="none" stroke="${c[3]}" stroke-width=".9"/>`;
    } else {
      for (const x of [W * 0.16, W * 0.2, W * 0.82]) s += rect(x, 0, 1.2, H, c[3], 'opacity=".55"');
      s += rect(0, H * 0.88, W, 1.2, c[3], 'opacity=".4"');
    }
    return s;
  }

  /* ---------------- التراثي: السدو والكليم ---------------- */
  function stepped(cx, cy, R, st, cols) {
    let s = '';
    cols.forEach((col, i) => {
      const RR = R - i * st * 1.4; if (RR < st) return;
      for (let k = -RR; k < RR - 0.01; k += st) { const w = (RR - Math.abs(k + st / 2)) * 2 * 0.95; if (w > 0.5) s += rect(cx - w / 2, cy + k, w, st + 0.4, col); }
    });
    return s;
  }
  function sadu(c) {
    let s = rect(0, 0, W, H, c[0]);
    const L = [[c[1], 12], [c[2], 3], [c[0], 18, 'teeth'], [c[2], 3], [c[1], 6], [c[3], 3]];
    let x = 0;
    for (const [col, w, t] of L) {
      for (const side of [0, 1]) {
        const xx = side ? W - x - w : x;
        s += rect(xx, 0, w, H, col);
        if (t) for (let y = 0; y < H; y += 10) s += side ? poly([[xx + w, y], [xx + w * 0.2, y + 5], [xx + w, y + 10]], c[2]) : poly([[xx, y], [xx + w * 0.8, y + 5], [xx, y + 10]], c[2]);
      }
      x += w;
    }
    const px = x, pw = W - 2 * x, cx = W / 2, dh = H / 6, dw = pw - 16;
    s += rect(px, 0, pw, H, c[2]) + rect(px, 0, 2, H, c[1]) + rect(W - px - 2, 0, 2, H, c[1]);
    for (let i = 0; i < 6; i++) {
      const cy = dh / 2 + i * dh;
      s += dia(cx, cy, dw / 2, dh / 2, c[1]) + dia(cx, cy, dw / 2 - 9, dh / 2 - 7, c[0]) + dia(cx, cy, dw / 4 - 2, dh / 4 - 2, c[2]) + dia(cx, cy, 4, 4, c[3]);
      const y = i * dh;
      s += poly([[px + 2, y - 8], [px + 14, y], [px + 2, y + 8]], c[0]) + poly([[W - px - 2, y - 8], [W - px - 14, y], [W - px - 2, y + 8]], c[0]);
    }
    return s;
  }
  function kilim(c) {
    let s = rect(0, 0, W, H, c[0]);
    for (const cy of [37.5, 112.5, 187.5, 262.5]) s += stepped(18, cy, 20, 5, [c[2], c[1]]) + stepped(W - 18, cy, 20, 5, [c[2], c[1]]);
    for (const cy of [75, 150, 225]) s += stepped(100, cy, 42, 6, [c[1], c[2], c[3], c[4]]);
    for (const cy of [37.5, 112.5, 187.5, 262.5]) s += rect(96, cy - 4, 8, 8, c[3]) + rect(86, cy - 1.5, 28, 3, c[1]);
    s += rect(0, 0, 6, H, c[1]) + rect(W - 6, 0, 6, H, c[1]) + rect(0, 0, W, 12, c[1]) + rect(0, H - 12, W, 12, c[1]);
    for (let x = 0; x < W; x += 10) s += poly([[x, 12], [x + 5, 18], [x + 10, 12]], c[1]) + poly([[x, H - 12], [x + 5, H - 18], [x + 10, H - 12]], c[1]) + rect(x + 3, 4, 4, 4, c[3]) + rect(x + 3, H - 8, 4, 4, c[3]);
    return s;
  }

  const STYLE_FN = { bohemian, modern, classic, french, oriental, luxury, kids, geometric, minimalist, traditional: (c, r, v) => (v === 'kilim' ? kilim(c) : sadu(c)) };
  const FRINGE = { bohemian: 1, classic: 1, oriental: 1, traditional: 1, french: 1 };

  function fringe(color) {
    let s = '';
    for (let x = 4; x < W; x += 4) s += `M${x} -8V0M${x} ${H}V${H + 8}`;
    return `<path d="${s}" stroke="${color}" stroke-width="1.6" stroke-linecap="round" opacity=".95"/>`;
  }

  /* مجموعة عناصر السجادة الكاملة (مع الملمس والظلال) */
  function rugGroup(p, ci) {
    const palette = p.colors[ci] || p.colors[0];
    const c = palette.c, r = rng(p.seed), id = 'r' + (uid++);
    const body = STYLE_FN[p.style](c, r, p.variant);
    const rx = p.style === 'kids' ? 16 : 2.5;
    return `<defs>
      <clipPath id="${id}c"><rect width="${W}" height="${H}" rx="${rx}"/></clipPath>
      <filter id="${id}n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="${p.seed % 97}"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.6 -0.6"/></filter>
      <pattern id="${id}w" width="3" height="2.6" patternUnits="userSpaceOnUse"><rect width="3" height=".9" fill="#000" opacity=".06"/></pattern>
      <radialGradient id="${id}v" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></radialGradient>
    </defs>
    ${FRINGE[p.style] ? fringe('#ece2cf') : ''}
    <g clip-path="url(#${id}c)">${body}
      <rect width="${W}" height="${H}" fill="url(#${id}w)"/>
      <rect width="${W}" height="${H}" filter="url(#${id}n)" opacity=".35"/>
      <rect width="${W}" height="${H}" fill="url(#${id}v)"/>
    </g>`;
  }

  function room(g) {
    let s = '<rect width="400" height="300" fill="#ece5d9"/>';
    s += '<rect x="268" y="26" width="86" height="112" fill="#f8f4ec" stroke="#ddd2c0" stroke-width="4"/><path d="M311 26V138M268 82H354" stroke="#ddd2c0" stroke-width="3"/>';
    s += '<rect x="96" y="38" width="66" height="46" fill="#e3d7c4" stroke="#c8b698" stroke-width="3"/><path d="M103 78 L121 60 L134 71 L148 55 L155 78Z" fill="#c8b698"/>';
    s += '<rect y="172" width="400" height="128" fill="#cfb895"/>';
    s += '<g stroke="#bfa47e" stroke-width="1">' + [182, 196, 214, 238, 268].map(y => `<line x1="0" y1="${y}" x2="400" y2="${y}"/>`).join('') + '</g>';
    s += '<rect y="166" width="400" height="7" fill="#e5dbca"/>';
    s += '<rect x="40" y="104" width="210" height="44" rx="10" fill="#d8cdbd"/><rect x="30" y="128" width="230" height="40" rx="10" fill="#cdc1af"/><rect x="24" y="118" width="22" height="50" rx="8" fill="#c3b6a3"/><rect x="244" y="118" width="22" height="50" rx="8" fill="#c3b6a3"/><rect x="40" y="166" width="5" height="9" fill="#8c7a63"/><rect x="245" y="166" width="5" height="9" fill="#8c7a63"/>';
    s += '<rect x="60" y="112" width="36" height="28" rx="6" fill="#bba88c"/><rect x="194" y="112" width="36" height="28" rx="6" fill="#a9b1a1"/>';
    s += '<path d="M352 150 C340 120,330 100,338 80 M352 150 C360 118,372 100,368 78 M352 150 C350 120,352 96,354 70" stroke="#6f8a62" stroke-width="3" fill="none"/>';
    s += '<g fill="#7f9a6f"><ellipse cx="338" cy="86" rx="6" ry="12" transform="rotate(-20 338 86)"/><ellipse cx="367" cy="84" rx="6" ry="12" transform="rotate(20 367 84)"/><ellipse cx="354" cy="74" rx="5" ry="12"/><ellipse cx="344" cy="110" rx="5" ry="10" transform="rotate(-35 344 110)"/><ellipse cx="362" cy="108" rx="5" ry="10" transform="rotate(35 362 108)"/></g>';
    s += '<path d="M338 148 H366 L362 178 H342Z" fill="#b98e6a"/>';
    s += '<defs><filter id="rb" x="-10%" y="-10%" width="120%" height="140%"><feGaussianBlur stdDeviation="3"/></filter></defs>';
    s += '<polygon points="48,191 303,191 354,248 99,248" fill="#000" opacity=".2" filter="url(#rb)"/>';
    s += `<g transform="matrix(0.25 0.28 0.85 0 45 186)">${g}</g>`;
    s += '<rect width="400" height="300" fill="url(#lightG)"/><defs><linearGradient id="lightG" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>';
    return s;
  }

  const svg = (vb, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;
  const toURL = s => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);

  /** يعيد رابط صورة (data URI) للمنتج حسب اللون وزاوية العرض */
  function url(p, ci = 0, view = 'full') {
    const key = p.id + '|' + ci + '|' + view;
    if (cache.has(key)) return cache.get(key);
    const g = rugGroup(p, ci);
    let s;
    if (view === 'room') s = svg('0 0 400 300', room(g));
    else if (view === 'close') s = svg('45 95 110 110', g);
    else if (view === 'corner') s = svg('-12 -14 104 104', g);
    else s = svg('-12 -14 224 328', g);
    const u = toURL(s);
    cache.set(key, u);
    return u;
  }

  return { url, VIEWS: ['full', 'room', 'close', 'corner'] };
})();
