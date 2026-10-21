/* RA10 — BTEC Level 3 Business: revision-guide engine and diagram library (shared by Units 2, 3, 6 and 7).
   A unit's guide.js sets window.BIZ_GUIDE_DATA (aims, topics, set-task section, gallery) and uses BizGuide.* helpers
   to write the HTML and SVG diagrams. This file renders the sidebar, aim sections, progress and scroll-spy, and
   exposes window.initComprehensiveGuide() — the contract app.js expects. */
(function () {
  'use strict';

  /* ───────────── colours + text helpers ───────────── */
  const P = { blue: '#2563eb', sky: '#0284c7', teal: '#0d9488', green: '#16a34a', lime: '#65a30d', amber: '#d97706', orange: '#ea580c', red: '#dc2626', pink: '#db2777', violet: '#7c3aed', slate: '#64748b', navy: '#1e3a8a' };
  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  function wrap(text, max) {
    const words = String(text).split(/\s+/).filter(Boolean);
    const lines = []; let cur = '';
    words.forEach(w => {
      if ((cur + ' ' + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim();
    });
    if (cur) lines.push(cur);
    return lines;
  }
  // multi-line text centred/left at x,y with line height lh
  function txt(x, y, text, o) {
    o = o || {};
    const fs = o.fs || 12, lh = o.lh || fs * 1.28, max = o.max || 26;
    const lines = o.nowrap ? String(text).split('\n') : wrap(text, max);
    const anchor = o.anchor || 'middle';
    const startY = o.top ? y : y - ((lines.length - 1) * lh) / 2 + fs * 0.35;
    const attrs = `font-size="${fs}" text-anchor="${anchor}"${o.bold ? ' font-weight="700"' : ''}${o.fill ? ` fill="${o.fill}"` : ''}${o.opacity ? ` opacity="${o.opacity}"` : ''}${o.italic ? ' font-style="italic"' : ''}`;
    return lines.map((l, i) => `<text x="${x}" y="${(startY + i * lh).toFixed(1)}" ${attrs}>${esc(l)}</text>`).join('');
  }
  const svg = (w, h, label, inner) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}" style="width:100%;max-width:${w}px;height:auto;font-family:inherit" fill="currentColor">${inner}</svg>`;
  function box(x, y, w, h, text, col, o) {
    o = o || {};
    const fill = o.solid ? col : col; const op = o.solid ? 1 : (o.op || 0.14);
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r == null ? 10 : o.r}" fill="${fill}" fill-opacity="${op}" stroke="${col}" stroke-width="${o.sw || 1.4}"/>` +
      (text ? txt(x + w / 2, y + h / 2, text, { fs: o.fs || 12, max: o.max || Math.max(8, Math.floor(w / ((o.fs || 12) * 0.56))), bold: o.bold, fill: o.solid ? '#fff' : undefined }) : '');
  }
  const arrow = (x1, y1, x2, y2, col, w) => {
    const a = Math.atan2(y2 - y1, x2 - x1), s = 7;
    const hx = x2 - Math.cos(a) * 1, hy = y2 - Math.sin(a) * 1;
    return `<line x1="${x1}" y1="${y1}" x2="${x2 - Math.cos(a) * s}" y2="${y2 - Math.sin(a) * s}" stroke="${col || P.slate}" stroke-width="${w || 2}"/>` +
      `<path d="M${hx} ${hy} L${hx - Math.cos(a - 0.45) * s * 1.4} ${hy - Math.sin(a - 0.45) * s * 1.4} L${hx - Math.cos(a + 0.45) * s * 1.4} ${hy - Math.sin(a + 0.45) * s * 1.4} z" fill="${col || P.slate}"/>`;
  };

  /* ───────────── diagram library ───────────── */
  const S = {};

  // Horizontal flow of boxes: steps = ['text', ...] or [['title','sub'], ...]
  S.flow = function (steps, o) {
    o = o || {};
    const n = steps.length, gap = 26, w0 = o.w || 700, bw = (w0 - 16 - gap * (n - 1)) / n, bh = o.h || 76;
    const cols = o.cols || [P.blue, P.teal, P.green, P.amber, P.orange, P.violet, P.pink, P.sky];
    let s = '';
    steps.forEach((st, i) => {
      const x = 8 + i * (bw + gap), col = cols[i % cols.length];
      const t = Array.isArray(st) ? st[0] : st, sub = Array.isArray(st) ? st[1] : '';
      s += `<rect x="${x}" y="14" width="${bw}" height="${bh}" rx="12" fill="${col}" fill-opacity=".14" stroke="${col}" stroke-width="1.5"/>`;
      s += txt(x + bw / 2, sub ? 14 + bh * 0.36 : 14 + bh / 2, t, { fs: o.fs || 12, bold: true, max: Math.floor(bw / 6.4) });
      if (sub) s += txt(x + bw / 2, 14 + bh * 0.68, sub, { fs: 10.5, max: Math.floor(bw / 5.6), opacity: 0.85 });
      if (i < n - 1) s += arrow(x + bw + 3, 14 + bh / 2, x + bw + gap - 3, 14 + bh / 2, col, 2.4);
    });
    return svg(w0, bh + 28, o.label || 'Process flow', s);
  };

  // Vertical steps with numbered circles
  S.ladder = function (steps, o) {
    o = o || {}; const w = o.w || 640, rowH = o.rowH || 46, cols = o.cols || [P.blue, P.teal, P.green, P.amber, P.orange, P.violet, P.pink];
    let s = '';
    steps.forEach((st, i) => {
      const y = 8 + i * (rowH + 8), col = cols[i % cols.length];
      const t = Array.isArray(st) ? st[0] : st, sub = Array.isArray(st) ? st[1] : '';
      s += `<rect x="6" y="${y}" width="${w - 12}" height="${rowH}" rx="10" fill="${col}" fill-opacity=".1" stroke="${col}" stroke-width="1.2"/>`;
      s += `<circle cx="32" cy="${y + rowH / 2}" r="14" fill="${col}"/><text x="32" y="${y + rowH / 2 + 4.5}" font-size="13" font-weight="800" text-anchor="middle" fill="#fff">${i + 1}</text>`;
      s += txt(56, sub ? y + rowH * 0.34 : y + rowH / 2, t, { fs: 12.5, bold: true, anchor: 'start', nowrap: true });
      if (sub) s += txt(56, y + rowH * 0.72, sub, { fs: 11, anchor: 'start', max: Math.floor((w - 80) / 5.6), opacity: 0.85 });
    });
    return svg(w, 16 + steps.length * (rowH + 8), o.label || 'Steps', s);
  };

  // Circular cycle
  S.cycle = function (items, o) {
    o = o || {}; const W = 560, H = o.h || 330, cx = W / 2, cy = H / 2, rx = 190, ry = Math.min(120, H / 2 - 50), n = items.length;
    const cols = o.cols || [P.blue, P.teal, P.green, P.amber, P.orange, P.violet, P.pink, P.sky];
    let s = '';
    const pts = items.map((it, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, a]; });
    pts.forEach(([x, y], i) => {
      const [nx, ny] = pts[(i + 1) % n]; const col = cols[i % cols.length];
      const dx = nx - x, dy = ny - y, d = Math.hypot(dx, dy); const ux = dx / d, uy = dy / d;
      s += arrow(x + ux * 68, y + uy * 30, nx - ux * 68, ny - uy * 30, col, 2);
    });
    pts.forEach(([x, y], i) => {
      const col = cols[i % cols.length]; const it = items[i];
      const t = Array.isArray(it) ? it[0] : it, sub = Array.isArray(it) ? it[1] : '';
      s += `<rect x="${x - 70}" y="${y - 28}" width="140" height="56" rx="12" fill="${col}" fill-opacity=".16" stroke="${col}" stroke-width="1.5"/>`;
      s += txt(x, sub ? y - 7 : y, t, { fs: 12, bold: true, max: 22 });
      if (sub) s += txt(x, y + 12, sub, { fs: 10, max: 28, opacity: .85 });
    });
    if (o.center) s += txt(cx, cy, o.center, { fs: 13, bold: true, max: 18 });
    return svg(W, H, o.label || 'Cycle', s);
  };

  // 2x2 matrix (SWOT-style)
  S.matrix = function (cells, o) {
    o = o || {}; const W = 640, H = o.h || 330, cw = 300, ch = (H - 30) / 2 - 6;
    const cols = o.cols || [P.green, P.red, P.blue, P.amber];
    let s = '';
    cells.forEach((c, i) => {
      const x = 10 + (i % 2) * (cw + 20), y = 8 + Math.floor(i / 2) * (ch + 12), col = cols[i];
      s += `<rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="12" fill="${col}" fill-opacity=".12" stroke="${col}" stroke-width="1.5"/>`;
      s += `<rect x="${x}" y="${y}" width="${cw}" height="30" rx="12" fill="${col}"/><rect x="${x}" y="${y + 18}" width="${cw}" height="12" fill="${col}"/>`;
      s += txt(x + 14, y + 16, c.h, { fs: 13, bold: true, anchor: 'start', fill: '#fff', nowrap: true });
      if (c.tag) s += txt(x + cw - 12, y + 16, c.tag, { fs: 10.5, anchor: 'end', fill: '#fff', nowrap: true, opacity: .9 });
      c.items.forEach((it, k) => { s += txt(x + 14, y + 48 + k * 19, '• ' + it, { fs: 11.5, anchor: 'start', nowrap: true }); });
    });
    return svg(W, H, o.label || 'Matrix', s);
  };

  // Tiles grid: items = [[title, sub, colour?]]
  S.tiles = function (items, o) {
    o = o || {}; const cols = o.cols || 3, W = o.w || 660, gap = 12, tw = (W - 16 - gap * (cols - 1)) / cols, th = o.th || 74;
    const pal = o.pal || [P.blue, P.teal, P.green, P.amber, P.orange, P.violet, P.pink, P.sky, P.red];
    let s = '';
    items.forEach((it, i) => {
      const x = 8 + (i % cols) * (tw + gap), y = 8 + Math.floor(i / cols) * (th + gap), col = it[2] || pal[i % pal.length];
      s += `<rect x="${x}" y="${y}" width="${tw}" height="${th}" rx="12" fill="${col}" fill-opacity=".13" stroke="${col}" stroke-width="1.4"/>`;
      s += `<rect x="${x}" y="${y}" width="7" height="${th}" rx="3" fill="${col}"/>`;
      s += txt(x + 18, y + 20, it[0], { fs: 13, bold: true, anchor: 'start', nowrap: true });
      if (it[1]) s += txt(x + 18, y + 38, it[1], { fs: 10.8, anchor: 'start', top: true, max: Math.floor((tw - 28) / 5.5), lh: 13.5, opacity: .9 });
    });
    return svg(W, 16 + Math.ceil(items.length / cols) * (th + gap), o.label || 'Overview', s);
  };

  // Product life cycle curve
  S.plc = function (hl, o) {
    o = o || {}; const W = 640, H = 300, ox = 50, oy = 250;
    const stages = [['Introduction', 40, 150, P.sky], ['Growth', 150, 270, P.green], ['Maturity', 270, 440, P.amber], ['Decline', 440, 590, P.red]];
    const f = (x) => { const t = (x - ox) / 540; return oy - 190 * Math.exp(-Math.pow((t - 0.5) * 3.1, 2) * 0.9) * (0.15 + 0.85 * Math.sin(Math.min(1, t * 1.15) * Math.PI * 0.62 + 0.15)) ; };
    let s = '';
    stages.forEach(([n, a, b, col]) => {
      const on = !hl || hl === n;
      s += `<rect x="${a}" y="20" width="${b - a}" height="${oy - 20}" fill="${col}" fill-opacity="${on ? .13 : .04}"/><text x="${(a + b) / 2}" y="38" font-size="12.5" font-weight="700" text-anchor="middle" fill="${col}">${n}</text>`;
    });
    // sales curve
    const pts = []; for (let x = 40; x <= 590; x += 6) { const t = (x - 40) / 550; const y = oy - 8 - 170 * (Math.sin(Math.PI * Math.pow(t, 0.8)) ** 1.1); pts.push(`${x},${y.toFixed(1)}`); }
    s += `<polyline points="${pts.join(' ')}" fill="none" stroke="${P.navy}" stroke-width="3.2"/>`;
    s += `<line x1="40" y1="${oy}" x2="600" y2="${oy}" stroke="currentColor" stroke-width="1.5" opacity=".6"/><line x1="40" y1="20" x2="40" y2="${oy}" stroke="currentColor" stroke-width="1.5" opacity=".6"/>`;
    s += `<text x="320" y="${oy + 20}" font-size="11" text-anchor="middle">Time</text><text x="14" y="140" font-size="11" text-anchor="middle" transform="rotate(-90 14 140)">Sales / profit</text>`;
    const notes = o.notes || [['High costs, low sales', 95, 214], ['Sales rise fast, profit appears', 210, 130], ['Sales peak and level off', 355, 78], ['Falling sales — drop, refresh or extend', 520, 150]];
    notes.forEach(([t, x, y]) => { s += txt(x, y, t, { fs: 10.5, max: 18, opacity: .9 }); });
    return svg(W, H, o.label || 'Product life cycle', s);
  };

  // Bar chart: data = [[label, value, colour?]]
  S.bars = function (data, o) {
    o = o || {}; const W = o.w || 640, H = o.h || 260, ox = 56, oy = H - 44, top = 28, n = data.length;
    const max = o.max || Math.max.apply(null, data.map(d => d[1])) * 1.15, bw = Math.min(64, (W - ox - 30) / n - 14);
    let s = '';
    const ticks = o.ticks || 4;
    for (let i = 0; i <= ticks; i++) { const v = max * i / ticks, y = oy - (oy - top) * i / ticks; s += `<line x1="${ox}" y1="${y}" x2="${W - 14}" y2="${y}" stroke="currentColor" opacity=".13"/><text x="${ox - 6}" y="${y + 4}" font-size="10.5" text-anchor="end" opacity=".75">${o.fmt ? o.fmt(v) : Math.round(v)}</text>`; }
    data.forEach((d, i) => {
      const x = ox + 14 + i * ((W - ox - 30) / n), h = (oy - top) * d[1] / max, col = d[2] || o.col || P.blue;
      s += `<rect x="${x}" y="${oy - h}" width="${bw}" height="${h}" rx="5" fill="${col}"/>`;
      s += `<text x="${x + bw / 2}" y="${oy - h - 6}" font-size="11" font-weight="700" text-anchor="middle">${o.fmt ? o.fmt(d[1]) : d[1]}</text>`;
      s += txt(x + bw / 2, oy + 16, d[0], { fs: 10.5, max: 12, lh: 12 });
    });
    if (o.unit) s += `<text x="${ox}" y="16" font-size="11" opacity=".8">${esc(o.unit)}</text>`;
    return svg(W, H, o.label || 'Bar chart', s);
  };

  // Line chart: series = [{name, col, pts:[[x,y]...]}]
  S.lines = function (series, o) {
    o = o || {}; const W = o.w || 640, H = o.h || 270, ox = 56, oy = H - 40, top = 22;
    const xs = [].concat.apply([], series.map(s => s.pts.map(p => p[0]))), ys = [].concat.apply([], series.map(s => s.pts.map(p => p[1])));
    const xmin = o.xmin != null ? o.xmin : Math.min.apply(null, xs), xmax = o.xmax != null ? o.xmax : Math.max.apply(null, xs), ymin = o.ymin != null ? o.ymin : 0, ymax = o.ymax != null ? o.ymax : Math.max.apply(null, ys) * 1.1;
    const X = v => ox + (v - xmin) / (xmax - xmin) * (W - ox - 24), Y = v => oy - (v - ymin) / (ymax - ymin) * (oy - top);
    let s = '';
    for (let i = 0; i <= 4; i++) { const v = ymin + (ymax - ymin) * i / 4; s += `<line x1="${ox}" y1="${Y(v)}" x2="${W - 14}" y2="${Y(v)}" stroke="currentColor" opacity=".13"/><text x="${ox - 6}" y="${Y(v) + 4}" font-size="10.5" text-anchor="end" opacity=".75">${o.fmt ? o.fmt(v) : Math.round(v)}</text>`; }
    (o.xlabels || []).forEach(([v, l]) => { s += `<text x="${X(v)}" y="${oy + 16}" font-size="10.5" text-anchor="middle" opacity=".8">${esc(l)}</text>`; });
    series.forEach((se, k) => {
      s += `<polyline points="${se.pts.map(p => X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1)).join(' ')}" fill="none" stroke="${se.col}" stroke-width="3" ${se.dash ? 'stroke-dasharray="7 5"' : ''}/>`;
      se.pts.forEach(p => { s += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="3.4" fill="${se.col}"/>`; });
      s += `<rect x="${ox + 10 + k * 150}" y="2" width="12" height="12" rx="3" fill="${se.col}"/><text x="${ox + 28 + k * 150}" y="12.5" font-size="11">${esc(se.name)}</text>`;
    });
    s += `<line x1="${ox}" y1="${oy}" x2="${W - 14}" y2="${oy}" stroke="currentColor" opacity=".55"/><line x1="${ox}" y1="${top}" x2="${ox}" y2="${oy}" stroke="currentColor" opacity=".55"/>`;
    if (o.xtitle) s += `<text x="${(ox + W) / 2}" y="${H - 6}" font-size="11" text-anchor="middle" opacity=".8">${esc(o.xtitle)}</text>`;
    return svg(W, H, o.label || 'Line chart', s);
  };

  // Break-even chart
  S.breakEven = function (p, o) {
    o = o || {}; const W = 640, H = 340, ox = 62, oy = 292, top = 24;
    const fc = p.fc, vc = p.vc, price = p.price, max = p.max, bep = fc / (price - vc);
    const ymax = Math.max(price * max, fc + vc * max) * 1.08;
    const X = v => ox + v / max * (W - ox - 30), Y = v => oy - v / ymax * (oy - top);
    let s = '';
    for (let i = 0; i <= 4; i++) { const v = ymax * i / 4; s += `<line x1="${ox}" y1="${Y(v)}" x2="${W - 20}" y2="${Y(v)}" stroke="currentColor" opacity=".12"/><text x="${ox - 6}" y="${Y(v) + 4}" font-size="10.5" text-anchor="end" opacity=".75">£${Math.round(v).toLocaleString('en-GB')}</text>`; }
    for (let i = 0; i <= 4; i++) { const v = max * i / 4; s += `<text x="${X(v)}" y="${oy + 16}" font-size="10.5" text-anchor="middle" opacity=".75">${Math.round(v).toLocaleString('en-GB')}</text>`; }
    // areas
    s += `<polygon points="${X(0)},${Y(fc)} ${X(bep)},${Y(price * bep)} ${X(0)},${Y(0)}" fill="${P.red}" fill-opacity=".16"/>`;
    s += `<polygon points="${X(bep)},${Y(price * bep)} ${X(max)},${Y(price * max)} ${X(max)},${Y(fc + vc * max)}" fill="${P.green}" fill-opacity=".17"/>`;
    s += `<line x1="${X(0)}" y1="${Y(fc)}" x2="${X(max)}" y2="${Y(fc)}" stroke="${P.amber}" stroke-width="2.6" stroke-dasharray="6 4"/>`;
    s += `<line x1="${X(0)}" y1="${Y(fc)}" x2="${X(max)}" y2="${Y(fc + vc * max)}" stroke="${P.red}" stroke-width="3"/>`;
    s += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(max)}" y2="${Y(price * max)}" stroke="${P.blue}" stroke-width="3"/>`;
    s += `<line x1="${X(bep)}" y1="${Y(price * bep)}" x2="${X(bep)}" y2="${oy}" stroke="currentColor" stroke-dasharray="3 3" opacity=".7"/><line x1="${ox}" y1="${Y(price * bep)}" x2="${X(bep)}" y2="${Y(price * bep)}" stroke="currentColor" stroke-dasharray="3 3" opacity=".7"/>`;
    s += `<circle cx="${X(bep)}" cy="${Y(price * bep)}" r="6.5" fill="#fff" stroke="${P.violet}" stroke-width="3.2"/>`;
    s += txt(X(bep) - 14, Y(price * bep) - 20, `Break-even: ${Math.round(bep * 100) / 100} units`, { fs: 12, bold: true, anchor: 'end', nowrap: true, fill: P.violet });
    if (p.ms != null) {
      const a = X(bep), b = X(p.ms);
      s += `<line x1="${a}" y1="${oy - 14}" x2="${b}" y2="${oy - 14}" stroke="${P.green}" stroke-width="3"/><path d="M${a} ${oy - 20} v12 M${b} ${oy - 20} v12" stroke="${P.green}" stroke-width="3"/>`;
      s += txt((a + b) / 2, oy - 28, `Margin of safety ${Math.round((p.ms - bep) * 100) / 100}`, { fs: 11.5, bold: true, nowrap: true, fill: P.green });
    }
    s += txt(X(max) - 6, Y(price * max) + 14, 'Total revenue', { fs: 11.5, bold: true, anchor: 'end', nowrap: true, fill: P.blue });
    s += txt(X(max) - 6, Y(fc + vc * max) - 8, 'Total costs', { fs: 11.5, bold: true, anchor: 'end', nowrap: true, fill: P.red });
    s += txt(X(max * 0.62), Y(fc) - 7, 'Fixed costs', { fs: 11.5, bold: true, nowrap: true, fill: P.amber });
    s += txt(X(bep * 0.45), Y(fc * 0.35), 'LOSS', { fs: 13, bold: true, fill: P.red, nowrap: true });
    s += txt(X(bep + (max - bep) * 0.62), Y(price * (bep + (max - bep) * 0.62) * 0.9) + 20, 'PROFIT', { fs: 13, bold: true, fill: P.green, nowrap: true });
    s += `<line x1="${ox}" y1="${oy}" x2="${W - 20}" y2="${oy}" stroke="currentColor" opacity=".55"/><line x1="${ox}" y1="${top}" x2="${ox}" y2="${oy}" stroke="currentColor" opacity=".55"/>`;
    s += `<text x="${(ox + W) / 2}" y="${H - 8}" font-size="11" text-anchor="middle" opacity=".8">${o.xtitle || 'Output / sales (units)'}</text>`;
    return svg(W, H, o.label || 'Break-even chart', s);
  };

  // Pyramid (Maslow): levels bottom → top
  S.pyramid = function (levels, o) {
    o = o || {}; const W = 640, n = levels.length, rowH = 50, H = n * rowH + 20;
    const cols = o.cols || [P.slate, P.sky, P.teal, P.amber, P.violet, P.pink];
    let s = '';
    levels.forEach((lv, i) => {
      const lvl = n - 1 - i; // top = last
      const top = 10 + lvl * rowH; const wTop = 70 + (lvl) * 80, wBot = 70 + (lvl + 1) * 80;
      const cx = 220; const col = cols[i % cols.length];
      s += `<polygon points="${cx - wTop / 2},${top} ${cx + wTop / 2},${top} ${cx + wBot / 2},${top + rowH - 3} ${cx - wBot / 2},${top + rowH - 3}" fill="${col}" fill-opacity=".85"/>`;
      s += txt(cx, top + rowH / 2 - 1, lv[0], { fs: 12, bold: true, fill: '#fff', max: 18 });
      s += txt(cx + wBot / 2 + 18, top + rowH / 2, lv[1], { fs: 11.5, anchor: 'start', max: 40 });
    });
    return svg(W, H, o.label || 'Pyramid', s);
  };

  // Spectrum bar with labelled stops
  S.spectrum = function (stops, o) {
    o = o || {}; const W = 660, H = o.h || 150, n = stops.length;
    const cols = o.cols || [P.red, P.orange, P.amber, P.green, P.teal, P.sky];
    let s = `<defs><linearGradient id="spg${n}" x1="0" x2="1"><stop offset="0" stop-color="${cols[0]}"/><stop offset=".5" stop-color="${cols[Math.min(3, cols.length - 1)]}"/><stop offset="1" stop-color="${cols[cols.length - 1]}"/></linearGradient></defs>`;
    s += `<rect x="30" y="52" width="${W - 60}" height="16" rx="8" fill="url(#spg${n})"/>`;
    if (o.left) s += txt(30, 24, o.left, { fs: 11.5, bold: true, anchor: 'start', nowrap: true });
    if (o.right) s += txt(W - 30, 24, o.right, { fs: 11.5, bold: true, anchor: 'end', nowrap: true });
    stops.forEach((st, i) => {
      const x = 30 + (W - 60) * (i / (n - 1)), col = cols[Math.round(i / (n - 1) * (cols.length - 1))];
      s += `<circle cx="${x}" cy="60" r="11" fill="#fff" stroke="${col}" stroke-width="3.5"/>`;
      s += txt(x, 92, st[0], { fs: 12, bold: true, max: 14 });
      if (st[1]) s += txt(x, 112, st[1], { fs: 10.5, max: 18, opacity: .85, top: true, lh: 12.5 });
    });
    return svg(W, H, o.label || 'Spectrum', s);
  };

  // Gantt: rows = [[label, startWeek, endWeek, colour?]], weeks total
  S.gantt = function (rows, weeks, o) {
    o = o || {}; const W = 680, lx = 170, rowH = 28, H = 40 + rows.length * rowH + 20;
    const cols = o.cols || [P.blue, P.teal, P.green, P.amber, P.orange, P.violet, P.pink];
    const X = w => lx + (w) / weeks * (W - lx - 14);
    let s = '';
    for (let w = 0; w <= weeks; w += o.step || 4) { s += `<line x1="${X(w)}" y1="30" x2="${X(w)}" y2="${H - 18}" stroke="currentColor" opacity=".13"/><text x="${X(w)}" y="22" font-size="10.5" text-anchor="middle" opacity=".8">${w === 0 ? '' : 'W' + w}</text>`; }
    rows.forEach((r, i) => {
      const y = 34 + i * rowH, col = r[3] || cols[i % cols.length];
      s += txt(lx - 8, y + 12, r[0], { fs: 11.2, anchor: 'end', nowrap: true });
      s += `<rect x="${X(r[1])}" y="${y}" width="${Math.max(6, X(r[2]) - X(r[1]))}" height="20" rx="6" fill="${col}" fill-opacity=".9"/>`;
    });
    return svg(W, H, o.label || 'Gantt chart', s);
  };

  // Porter's five forces
  S.fiveForces = function (o) {
    o = o || {}; const W = 640, H = 340;
    const f = [['Threat of new entrants', 'barriers: capital, brands, regulation', 320, 28, P.blue], ['Bargaining power of suppliers', 'few suppliers = high power', 112, 168, P.amber], ['Bargaining power of buyers', 'many substitutes = high power', 528, 168, P.green], ['Threat of substitutes', 'close alternatives, switching cost', 320, 308, P.orange]];
    let s = '';
    f.forEach(([t, sub, x, y, col]) => { s += `<rect x="${x - 104}" y="${y - 28}" width="208" height="56" rx="12" fill="${col}" fill-opacity=".14" stroke="${col}" stroke-width="1.5"/>` + txt(x, y - 8, t, { fs: 12, bold: true, max: 28 }) + txt(x, y + 14, sub, { fs: 10.2, max: 36, opacity: .85 }); });
    s += `<rect x="246" y="132" width="148" height="72" rx="14" fill="${P.violet}" fill-opacity=".18" stroke="${P.violet}" stroke-width="2"/>` + txt(320, 168, 'Competitive rivalry', { fs: 14, bold: true }) + txt(320, 188, 'number & strength of rivals', { fs: 10, max: 22, opacity: .85 });
    [[320, 56, 320, 130], [320, 280, 320, 206], [218, 168, 244, 168], [422, 168, 396, 168]].forEach(([a, b, c, d]) => { s += arrow(a, b, c, d, P.slate, 2.4); });
    return svg(W, H, o.label || "Porter's five forces", s);
  };

  // Funnel / stacked levels: items = [[title, sub]]
  S.funnel = function (items, o) {
    o = o || {}; const W = 640, n = items.length, rowH = 52, H = n * rowH + 16;
    const cols = o.cols || [P.blue, P.sky, P.teal, P.green, P.amber, P.orange];
    let s = '';
    items.forEach((it, i) => {
      const w = 600 - i * (440 / Math.max(1, n - 1)) , x = 20 + (600 - w) / 2, y = 8 + i * rowH, col = cols[i % cols.length];
      s += `<rect x="${x}" y="${y}" width="${w}" height="${rowH - 6}" rx="10" fill="${col}" fill-opacity=".85"/>`;
      s += txt(320, y + (rowH - 6) / 2 - (it[1] ? 7 : 0), it[0], { fs: 13, bold: true, fill: '#fff', nowrap: true });
      if (it[1]) s += txt(320, y + (rowH - 6) / 2 + 11, it[1], { fs: 10.5, fill: '#fff', max: 80, opacity: .95 });
    });
    return svg(W, H, o.label || 'Funnel', s);
  };

  // Org chart: tree = {t, kids:[...]}
  S.org = function (tree, o) {
    o = o || {}; const W = 660; const levels = []; (function walk(n, d) { (levels[d] = levels[d] || []).push(n); (n.kids || []).forEach(k => walk(k, d + 1)); })(tree, 0);
    const H = levels.length * 84 + 16; const cols = o.cols || [P.navy, P.blue, P.teal, P.green];
    // assign x by leaf spread
    let leaf = 0; const total = (function cnt(n) { return n.kids && n.kids.length ? n.kids.reduce((a, k) => a + cnt(k), 0) : 1; })(tree);
    (function place(n, d) { if (!n.kids || !n.kids.length) { n.x = 20 + (leaf + 0.5) * (W - 40) / total; leaf++; } else { n.kids.forEach(k => place(k, d + 1)); n.x = (n.kids[0].x + n.kids[n.kids.length - 1].x) / 2; } n.y = 14 + d * 84; })(tree, 0);
    let s = '';
    (function draw(n, d) { (n.kids || []).forEach(k => { s += `<path d="M${n.x} ${n.y + 44} V${n.y + 62} H${k.x} V${k.y}" fill="none" stroke="${P.slate}" stroke-width="1.8"/>`; draw(k, d + 1); }); })(tree, 0);
    (function draw2(n, d) { const col = cols[Math.min(d, cols.length - 1)]; const w = Math.min(150, (W - 40) / total - 8 + (d === 0 ? 40 : 0)); s += `<rect x="${n.x - w / 2}" y="${n.y}" width="${w}" height="44" rx="9" fill="${col}" fill-opacity="${d === 0 ? .9 : .15}" stroke="${col}" stroke-width="1.5"/>` + txt(n.x, n.y + 22, n.t, { fs: 11.5, bold: true, max: Math.floor(w / 6.4), fill: d === 0 ? '#fff' : undefined }); (n.kids || []).forEach(k => draw2(k, d + 1)); })(tree, 0);
    return svg(W, H, o.label || 'Organisation chart', s);
  };

  // Decision tree: node = {t, p?, v?, kids?}
  S.tree = function (root, o) {
    o = o || {}; const W = 680, H = o.h || 330; let leaf = 0;
    const total = (function cnt(n) { return n.kids && n.kids.length ? n.kids.reduce((a, k) => a + cnt(k), 0) : 1; })(root);
    const depth = (function dep(n) { return 1 + (n.kids ? Math.max.apply(null, n.kids.map(dep)) : 0); })(root);
    const colW = (W - 120) / (depth - 1 || 1);
    (function place(n, d) { n.x = 50 + d * colW; if (!n.kids || !n.kids.length) { n.y = 30 + (leaf + 0.5) * (H - 60) / total; leaf++; } else { n.kids.forEach(k => place(k, d + 1)); n.y = (n.kids[0].y + n.kids[n.kids.length - 1].y) / 2; } })(root, 0);
    let s = '';
    (function lines(n) { (n.kids || []).forEach(k => { s += `<path d="M${n.x + 8} ${n.y} H${(n.x + k.x) / 2} V${k.y} H${k.x - 8}" fill="none" stroke="${P.slate}" stroke-width="2"/>`; if (k.label) s += txt((n.x + k.x) / 2 + 4, k.y - 8, k.label, { fs: 10.5, anchor: 'start', nowrap: true, opacity: .9 }); lines(k); }); })(root);
    (function nodes(n) {
      const kind = n.kind || (n.kids && n.kids.length ? 'choice' : 'end');
      if (kind === 'choice') s += `<rect x="${n.x - 9}" y="${n.y - 9}" width="18" height="18" fill="${P.navy}"/>`;
      else if (kind === 'chance') s += `<circle cx="${n.x}" cy="${n.y}" r="9" fill="${P.amber}"/>`;
      else s += `<path d="M${n.x - 8} ${n.y} l8 -9 l8 9 l-8 9 z" fill="${P.green}"/>`;
      if (n.t) s += txt(n.x, n.y + (kind === 'end' ? 0 : -16), n.t, { fs: 11, bold: true, anchor: kind === 'end' ? 'start' : 'middle', nowrap: true, ...(kind === 'end' ? {} : {}) });
      (n.kids || []).forEach(nodes);
    })(root);
    return svg(W, H, o.label || 'Decision tree', s);
  };

  // Venn with 2–3 circles
  S.venn = function (sets, center, o) {
    o = o || {}; const W = 560, H = 320;
    const cols = [P.blue, P.green, P.amber];
    const pos = sets.length === 2 ? [[210, 160], [350, 160]] : [[240, 130], [330, 130], [285, 205]];
    let s = '';
    sets.forEach((st, i) => { s += `<circle cx="${pos[i][0]}" cy="${pos[i][1]}" r="${sets.length === 2 ? 100 : 86}" fill="${cols[i]}" fill-opacity=".22" stroke="${cols[i]}" stroke-width="2"/>`; });
    sets.forEach((st, i) => { const dx = sets.length === 2 ? (i ? 72 : -72) : [(-1), 1, 0][i] * 70, dy = sets.length === 2 ? 0 : [-1, -1, 1][i] * 50; s += txt(pos[i][0] + dx, pos[i][1] + dy, st, { fs: 12, bold: true, max: 14 }); });
    if (center) s += txt(280, sets.length === 2 ? 160 : 150, center, { fs: 12, bold: true, max: 12, fill: P.violet });
    return svg(W, H, o.label || 'Venn diagram', s);
  };

  // Iceberg / layers: layers = [[title, sub, colour]] top → bottom
  S.layers = function (layers, o) {
    o = o || {}; const W = 640, n = layers.length, rowH = 66, H = n * rowH + 20;
    let s = '';
    layers.forEach((l, i) => {
      const y = 10 + i * rowH, col = l[2] || [P.sky, P.blue, P.navy][i % 3];
      s += `<rect x="12" y="${y}" width="${W - 24}" height="${rowH - 8}" rx="12" fill="${col}" fill-opacity="${0.12 + i * 0.07}" stroke="${col}" stroke-width="1.5"/>`;
      s += txt(30, y + (rowH - 8) / 2 - 8, l[0], { fs: 13.5, bold: true, anchor: 'start', nowrap: true });
      s += txt(30, y + (rowH - 8) / 2 + 12, l[1], { fs: 11.5, anchor: 'start', max: 90, opacity: .9 });
    });
    return svg(W, H, o.label || 'Layers', s);
  };

  // Simple donut / pie: data = [[label, value, colour]]
  S.pie = function (data, o) {
    o = o || {}; const W = 560, H = 250, cx = 150, cy = 125, r = 92, ir = o.donut === false ? 0 : 52;
    const total = data.reduce((a, d) => a + d[1], 0); let a0 = -Math.PI / 2; let s = '';
    const cols = [P.blue, P.teal, P.amber, P.violet, P.pink, P.green, P.orange, P.sky];
    data.forEach((d, i) => {
      const a1 = a0 + d[1] / total * 2 * Math.PI, large = a1 - a0 > Math.PI ? 1 : 0, col = d[2] || cols[i % cols.length];
      const p = (a, rad) => `${(cx + Math.cos(a) * rad).toFixed(1)},${(cy + Math.sin(a) * rad).toFixed(1)}`;
      s += `<path d="M${p(a0, r)} A${r},${r} 0 ${large} 1 ${p(a1, r)} L${p(a1, ir)} A${ir},${ir} 0 ${large} 0 ${p(a0, ir)} z" fill="${col}"/>`;
      s += `<rect x="300" y="${40 + i * 26}" width="14" height="14" rx="3" fill="${col}"/><text x="322" y="${52 + i * 26}" font-size="12.5">${esc(d[0])} — <tspan font-weight="700">${o.pct === false ? d[1] : Math.round(d[1] / total * 100) + '%'}</tspan></text>`;
      a0 = a1;
    });
    if (o.center) s += txt(cx, cy, o.center, { fs: 13, bold: true, max: 10 });
    return svg(W, H, o.label || 'Pie chart', s);
  };

  // Formula tree/ratio pyramid: root, kids
  S.formulaMap = function (items, o) {
    o = o || {}; const W = 680, cols = o.cols || 3, rowH = 92, gap = 12, tw = (W - 16 - gap * (cols - 1)) / cols;
    const pal = [P.blue, P.teal, P.green, P.amber, P.orange, P.violet, P.pink, P.sky];
    let s = '';
    items.forEach((it, i) => {
      const x = 8 + (i % cols) * (tw + gap), y = 8 + Math.floor(i / cols) * (rowH + gap), col = pal[i % pal.length];
      s += `<rect x="${x}" y="${y}" width="${tw}" height="${rowH}" rx="12" fill="${col}" fill-opacity=".12" stroke="${col}" stroke-width="1.4"/>`;
      s += txt(x + 12, y + 20, it[0], { fs: 12.5, bold: true, anchor: 'start', nowrap: true, fill: col });
      s += txt(x + 12, y + 46, it[1], { fs: 11.6, anchor: 'start', max: Math.floor((tw - 20) / 5.7), top: true, lh: 14 });
      if (it[2]) s += txt(x + 12, y + rowH - 12, it[2], { fs: 10.2, anchor: 'start', nowrap: true, opacity: .8, italic: true });
    });
    return svg(W, 16 + Math.ceil(items.length / cols) * (rowH + gap), o.label || 'Formulae', s);
  };

  // Stacked accounting statement: rows = [[label, value, indent?, bold?]], title
  S.statement = function (title, rows, o) {
    o = o || {}; const W = 560, rowH = 26, H = 56 + rows.length * rowH;
    let s = `<rect x="8" y="8" width="${W - 16}" height="${H - 16}" rx="10" fill="${P.blue}" fill-opacity=".06" stroke="${P.blue}" stroke-width="1.3"/>`;
    s += txt(24, 30, title, { fs: 13.5, bold: true, anchor: 'start', nowrap: true });
    rows.forEach((r, i) => {
      const y = 52 + i * rowH;
      if (r[3]) s += `<line x1="24" y1="${y - 16}" x2="${W - 24}" y2="${y - 16}" stroke="currentColor" opacity=".4"/>`;
      s += txt(24 + (r[2] || 0) * 18, y, r[0], { fs: 12, anchor: 'start', nowrap: true, bold: !!r[3] });
      s += txt(W - 24, y, r[1], { fs: 12, anchor: 'end', nowrap: true, bold: !!r[3] });
    });
    return svg(W, H, o.label || title, s);
  };

  // Illustration helpers: simple flat icons inside a rounded badge
  const ICONS = {
    coin: '<circle cx="0" cy="0" r="14" fill="#f59e0b"/><circle cx="0" cy="0" r="10" fill="none" stroke="#fff" stroke-width="2"/><text x="0" y="5" font-size="13" font-weight="800" text-anchor="middle" fill="#fff">£</text>',
    chart: '<rect x="-14" y="2" width="6" height="12" fill="#2563eb"/><rect x="-5" y="-6" width="6" height="20" fill="#16a34a"/><rect x="4" y="-14" width="6" height="28" fill="#f59e0b"/>',
    target: '<circle r="14" fill="none" stroke="#dc2626" stroke-width="3"/><circle r="8" fill="none" stroke="#dc2626" stroke-width="3"/><circle r="3" fill="#dc2626"/>',
    people: '<circle cx="-7" cy="-6" r="6" fill="#7c3aed"/><circle cx="8" cy="-4" r="5" fill="#0d9488"/><path d="M-16 14 a9 9 0 0 1 18 0z" fill="#7c3aed"/><path d="M0 14 a8 8 0 0 1 16 0z" fill="#0d9488"/>',
    bulb: '<path d="M0 -14 a9 9 0 0 1 6 15 c-2 2 -2 4 -2 6 h-8 c0 -2 0 -4 -2 -6 a9 9 0 0 1 6 -15z" fill="#f59e0b"/><rect x="-4" y="9" width="8" height="4" rx="1" fill="#64748b"/>',
    cart: '<path d="M-14 -10 h5 l4 16 h14 l3 -11 h-18" fill="none" stroke="#2563eb" stroke-width="2.6"/><circle cx="-3" cy="11" r="2.8" fill="#2563eb"/><circle cx="9" cy="11" r="2.8" fill="#2563eb"/>',
    megaphone: '<path d="M-14 -4 h8 l14 -9 v24 l-14 -9 h-8z" fill="#db2777"/><path d="M-10 6 l3 8" stroke="#db2777" stroke-width="3"/>',
    gear: '<circle r="6" fill="none" stroke="#64748b" stroke-width="3"/><g stroke="#64748b" stroke-width="4"><path d="M0 -14v5M0 9v5M-14 0h5M9 0h5M-10 -10l3 3M7 7l3 3M10 -10l-3 3M-7 7l-3 3"/></g>',
    shield: '<path d="M0 -14 l12 4 v9 c0 8 -6 12 -12 15 c-6 -3 -12 -7 -12 -15 v-9z" fill="#16a34a"/><path d="M-5 0 l4 4 l7 -8" stroke="#fff" stroke-width="2.6" fill="none"/>',
    book: '<path d="M-14 -10 h12 v22 h-12z M2 -10 h12 v22 h-12z" fill="#0284c7"/>'
  };
  S.icon = (name, x, y, scale) => `<g transform="translate(${x} ${y}) scale(${scale || 1})">${ICONS[name] || ''}</g>`;
  S.hero = function (title, sub, iconNames, col) {
    const W = 660, H = 150; col = col || P.blue;
    let s = `<defs><linearGradient id="hg${title.length}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".95"/><stop offset="1" stop-color="${P.violet}" stop-opacity=".9"/></linearGradient></defs>`;
    s += `<rect x="4" y="4" width="${W - 8}" height="${H - 8}" rx="18" fill="url(#hg${title.length})"/>`;
    s += txt(28, 56, title, { fs: 22, bold: true, anchor: 'start', fill: '#fff', max: 34, lh: 26 });
    s += txt(28, 100, sub, { fs: 12.5, anchor: 'start', fill: '#fff', max: 58, lh: 16, opacity: .92 });
    (iconNames || []).forEach((n, i) => { s += `<circle cx="${W - 60 - i * 62}" cy="${H / 2}" r="26" fill="#fff" fill-opacity=".95"/>` + S.icon(n, W - 60 - i * 62, H / 2, 1.2); });
    return svg(W, H, title, s);
  };

  /* ───────────── HTML building blocks ───────────── */
  const H = {};
  H.key = (t, body) => `<div class="g-callout g-key"><strong>${t}</strong><div>${body}</div></div>`;
  H.tip = (body, t) => `<div class="g-callout g-tip"><strong>${t || 'Exam tip'}</strong><div>${body}</div></div>`;
  H.warn = (body, t) => `<div class="g-callout g-warn"><strong>${t || 'Common mistake'}</strong><div>${body}</div></div>`;
  H.fig = (svgStr, cap) => `<figure class="guide-diagram">${svgStr}<figcaption>${cap}</figcaption></figure>`;
  H.table = (head, rows) => `<div class="g-table-wrap"><table class="g-table"><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
  H.ul = (items) => `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
  H.ol = (items) => `<ol>${items.map(i => `<li>${i}</li>`).join('')}</ol>`;
  H.formula = (label, expr, note) => `<div class="g-formula"><span class="g-formula-l">${label}</span><span class="g-formula-e">${expr}</span>${note ? `<span class="g-formula-n">${note}</span>` : ''}</div>`;
  H.example = (title, body) => `<div class="g-example"><div class="g-example-h"><span>✎</span>${title}</div><div class="g-example-b">${body}</div></div>`;
  H.steps = (items) => `<ol class="g-steps">${items.map(i => `<li><span>${i}</span></li>`).join('')}</ol>`;
  H.cards = (items, cols) => `<div class="g-cards" style="--cols:${cols || 3}">${items.map(c => `<div class="g-card"${c[2] ? ` style="--c:${c[2]}"` : ''}><strong>${c[0]}</strong><span>${c[1]}</span></div>`).join('')}</div>`;
  H.stats = (items) => `<div class="g-stats">${items.map(c => `<div><b>${c[0]}</b><span>${c[1]}</span></div>`).join('')}</div>`;
  H.check = (items) => `<ul class="g-check">${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
  H.two = (a, b) => `<div class="g-two"><div>${a}</div><div>${b}</div></div>`;
  H.photo = (url, cap) => `<figure class="guide-photo"><img src="${url}" alt="${esc(cap)}" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
  H.pill = (t, col) => `<span class="g-pill" style="--c:${col || P.blue}">${t}</span>`;
  H.unsplash = (id, w) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w || 1200}&q=75`;

  /* ───────────── guide engine ───────────── */
  const D = () => window.BIZ_GUIDE_DATA || {};
  const getRevised = () => { try { return JSON.parse(localStorage.getItem(D().storeKey) || '[]'); } catch (e) { return []; } };
  const saveRevised = (arr) => { try { localStorage.setItem(D().storeKey, JSON.stringify(arr)); } catch (e) {} };

  function sidebar(d) {
    return `
<button class="guide-sb-toggle" onclick="this.closest('.guide-sidebar').classList.toggle('sb-open')">
  <span>&#9776; Contents</span><span>&#8595;</span>
</button>
<div class="guide-sidebar-hd"><span class="guide-toc-label">${d.unitLabel}</span></div>
<div class="guide-toc-scroll">
  <div class="guide-toc-aim-group">
    <button class="guide-toc-aim-link" onclick="guideScrollTo('guide-set-task')"><span class="guide-toc-badge">★</span>${d.setTaskTitle || 'The assessment'}</button>
  </div>
  ${d.aims.map(a => `
  <div class="guide-toc-aim-group">
    <button class="guide-toc-aim-link" onclick="guideScrollTo('guide-aim-${a}')"><span class="guide-toc-badge">${a}</span>${d.titles[a]}</button>
    <div class="guide-toc-topic-links">
      ${d.topics[a].map(t => `<button class="guide-toc-topic-link" onclick="guideScrollTo('gt-${t.code}')">${t.code} ${t.name}</button>`).join('')}
    </div>
  </div>`).join('')}
</div>`;
  }

  function topicHtml(t, open) {
    return `
<div class="guide-topic${open ? ' open' : ''}" id="gt-${t.code}">
  <div class="guide-topic-hd" onclick="toggleGT('gt-${t.code}')">
    <span class="guide-topic-code">${t.code}</span>
    <span class="guide-topic-name">${t.name}</span>
    <span class="guide-topic-chevron">&#9660;</span>
  </div>
  <div class="guide-topic-body">${typeof t.html === 'function' ? t.html() : t.html}</div>
</div>`;
  }

  function aimSection(d, letter) {
    return `
<div class="guide-aim-section" id="guide-aim-${letter}">
  <div class="guide-aim-hd">
    <div class="guide-aim-badge">${letter}</div>
    <div>
      <div class="guide-aim-title">${d.aimWord || 'Learning aim'} ${letter}: ${d.titles[letter]}</div>
      <div class="guide-aim-subtitle">${d.subtitles[letter]}</div>
    </div>
  </div>
  ${d.topics[letter].map((t, i) => topicHtml(t, letter === 'A' && i === 0)).join('')}
  <button class="guide-mark-btn" id="gmb-${letter}" onclick="toggleGuideRevised('${letter}')">
    <span class="guide-mark-icon">&#9711;</span> Mark ${(d.aimWord || 'Learning aim').toLowerCase()} ${letter} as revised
  </button>
</div>`;
  }

  function gallery(d) {
    if (!d.gallery || !d.gallery.length) return '';
    return `
<section class="guide-gallery" aria-label="Visual overview">
  ${d.gallery.map(card => `
  <button class="guide-gallery-card" type="button" onclick="guideScrollTo('${card.aim === '★' ? 'guide-set-task' : 'guide-aim-' + card.aim}')" style="--guide-card-image:url('${card.image}')">
    <span class="guide-gallery-kicker">${card.kicker}</span>
    <span class="guide-gallery-title">${card.title}</span>
    <span class="guide-gallery-copy">${card.copy}</span>
    <span class="guide-gallery-source">Royalty-free stock photo</span>
  </button>`).join('')}
</section>`;
  }

  function buildHTML(d) {
    return `
<div class="guide-shell">
  <div class="guide-sidebar" id="guide-sidebar-bus">${sidebar(d)}</div>
  <div class="guide-main">
    <div class="guide-topbar">
      <div class="guide-progress-track"><div class="guide-progress-fill" id="guide-pf-bus" style="width:0%"></div></div>
      <span class="guide-progress-text" id="guide-pt-bus">0 / ${d.aims.length} ${(d.aimWord || 'aim').toLowerCase()}s revised</span>
      <button class="guide-print-btn" onclick="window.print()">&#128438; Print guide</button>
    </div>
    ${gallery(d)}
    <section class="guide-aim-intro" id="guide-set-task">${typeof d.setTask === 'function' ? d.setTask() : d.setTask}</section>
    ${d.aims.map(a => aimSection(d, a)).join('')}
  </div>
</div>`;
  }

  function updateProgress() {
    const d = D(), revised = getRevised();
    const count = d.aims.filter(a => revised.includes(a)).length;
    const fill = document.getElementById('guide-pf-bus'), text = document.getElementById('guide-pt-bus');
    if (fill) fill.style.width = (count / d.aims.length * 100) + '%';
    if (text) text.textContent = count + ' / ' + d.aims.length + ' ' + (d.aimWord || 'aim').toLowerCase() + 's revised';
    d.aims.forEach(a => {
      const btn = document.getElementById('gmb-' + a); if (!btn) return;
      const done = revised.includes(a); btn.classList.toggle('revised', done);
      btn.innerHTML = done ? `<span class="guide-mark-icon">&#10003;</span> ${d.aimWord || 'Learning aim'} ${a} revised!` : `<span class="guide-mark-icon">&#9711;</span> Mark ${(d.aimWord || 'learning aim').toLowerCase()} ${a} as revised`;
    });
  }

  function setupScrollSpy() {
    const sections = document.querySelectorAll('.guide-aim-section[id], .guide-aim-intro[id]');
    if (!sections.length || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        document.querySelectorAll('.guide-toc-aim-link').forEach(l => { l.classList.toggle('active', (l.getAttribute('onclick') || '').includes("'" + id + "'")); });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(s => observer.observe(s));
  }

  window.toggleGT = window.toggleGT || function (id) { const e = document.getElementById(id); if (e) e.classList.toggle('open'); };
  window.toggleGuideRevised = function (letter) {
    const arr = getRevised(), i = arr.indexOf(letter);
    if (i === -1) arr.push(letter); else arr.splice(i, 1);
    saveRevised(arr); updateProgress();
  };
  window.guideScrollTo = window.guideScrollTo || function (id) {
    const e = document.getElementById(id); if (!e) return;
    if (e.classList.contains('guide-topic') && !e.classList.contains('open')) e.classList.add('open');
    e.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const sb = document.getElementById('guide-sidebar-bus');
    if (sb && window.innerWidth < 769) sb.classList.remove('sb-open');
  };
  window.initComprehensiveGuide = function () {
    const container = document.getElementById('guide-comprehensive');
    const d = D();
    if (!container || !d.aims) return;
    if (container.dataset.built === '1') { updateProgress(); return; }
    container.innerHTML = buildHTML(d);
    container.dataset.built = '1';
    updateProgress();
    setupScrollSpy();
  };

  window.BizGuide = { svg: S, h: H, P, esc };
})();
