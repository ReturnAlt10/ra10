/* RA10 Ink — a handwriting pad for a stylus, finger or mouse (Blurt & Grill and other Study Hub notes).
   Pressure-sensitive pen, eraser, undo, clear and "more space". Once a stylus touches the pad, finger touches are
   ignored (palm rejection). Strokes are kept as points, so the drawing survives resizes and rotation.

     const pad = RA10Ink.create({ height: 300, hint: 'Write your notes…' });
     box.appendChild(pad.el);
     pad.isEmpty()           — nothing written yet
     await pad.toText(ctx)   — reads the handwriting with the AI (RA10.transcribeWork, the "Scan your work" reader)
     pad.toDataURL()         — JPEG on white, at most 1600 px wide
     pad.clear()
*/
(function () {
  'use strict';
  if (window.RA10Ink) return;

  function css() {
    if (document.getElementById('ra10-ink-css')) return;
    const st = document.createElement('style'); st.id = 'ra10-ink-css';
    st.textContent = `
.rk{--rk-line:color-mix(in srgb,currentColor 12%,transparent);border:1.5px solid var(--rk-bd,color-mix(in srgb,currentColor 18%,transparent));border-radius:18px;overflow:hidden;background:var(--rk-bg,#fff)}
html[data-theme="dark"] .rk{--rk-bg:#16151d}
.rk-bar{display:flex;align-items:center;gap:6px;padding:8px;border-bottom:1px solid var(--rk-line);flex-wrap:wrap}
.rk-bar button{display:inline-flex;align-items:center;gap:6px;min-height:36px;padding:6px 12px;border-radius:999px;border:1px solid var(--rk-line);background:transparent;color:inherit;font:700 .82rem inherit;cursor:pointer}
.rk-bar button[aria-pressed="true"]{background:linear-gradient(135deg,#1f6feb,#7c3aed);border-color:transparent;color:#fff}
.rk-bar .sp{flex:1}
.rk-dot{width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px var(--rk-line)}
.rk-wrap{position:relative;background-image:repeating-linear-gradient(to bottom,transparent 0,transparent 35px,var(--rk-line) 35px,var(--rk-line) 36px);background-position:0 8px}
.rk canvas{display:block;width:100%;touch-action:none;cursor:crosshair}
.rk-hint{position:absolute;left:16px;top:14px;pointer-events:none;color:color-mix(in srgb,currentColor 40%,transparent);font-size:.92rem}
.rk.has .rk-hint{display:none}
.rk-pen{font-size:.75rem;opacity:.65;padding:0 6px}`;
    document.head.appendChild(st);
  }
  const INK = { light: '#1d1b2e', dark: '#f1effa' };
  const dark = () => document.documentElement.getAttribute('data-theme') === 'dark';

  function create(opts) {
    css();
    opts = opts || {};
    let height = opts.height || 300;
    const el = document.createElement('div');
    el.className = 'rk';
    el.innerHTML = `<div class="rk-bar" role="toolbar" aria-label="Handwriting tools">
        <button type="button" data-t="pen" aria-pressed="true"><span class="rk-dot" style="background:#1d1b2e"></span>Pen</button>
        <button type="button" data-t="eraser" aria-pressed="false">Eraser</button>
        <button type="button" data-a="undo">Undo</button><button type="button" data-a="clear">Clear</button>
        <span class="sp"></span><span class="rk-pen" hidden>Stylus mode</span><button type="button" data-a="more">More space</button>
      </div><div class="rk-wrap"><canvas aria-label="Handwriting area"></canvas><span class="rk-hint">${opts.hint || 'Write here with a stylus, finger or mouse…'}</span></div>`;
    const cv = el.querySelector('canvas'), wrap = el.querySelector('.rk-wrap');
    const strokes = []; let cur = null, tool = 'pen', penSeen = false;

    function size() {
      const dpr = Math.min(2, window.devicePixelRatio || 1), w = wrap.clientWidth || 600;
      cv.style.height = height + 'px'; cv.width = Math.round(w * dpr); cv.height = Math.round(height * dpr);
      redraw();
    }
    function ctx() { const g = cv.getContext('2d'); const dpr = cv.width / (wrap.clientWidth || 1); g.setTransform(dpr, 0, 0, dpr, 0, 0); return g; }
    function paint(g, s, color) {
      if (s.pts.length < 1) return;
      g.globalCompositeOperation = s.erase ? 'destination-out' : 'source-over';
      g.strokeStyle = color; g.fillStyle = color; g.lineCap = 'round'; g.lineJoin = 'round';
      if (s.pts.length === 1) { const p = s.pts[0]; g.beginPath(); g.arc(p[0], p[1], width(s, p[2]) / 2, 0, Math.PI * 2); g.fill(); return; }
      for (let i = 1; i < s.pts.length; i++) {
        const a = s.pts[i - 1], b = s.pts[i];
        g.lineWidth = width(s, (a[2] + b[2]) / 2);
        g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
      }
      g.globalCompositeOperation = 'source-over';
    }
    const width = (s, p) => s.erase ? 22 : (s.pen ? 1.2 + 3.2 * (p || 0.5) : 2.6);
    function redraw() {
      const g = ctx(); g.clearRect(0, 0, cv.width, cv.height);
      const color = dark() ? INK.dark : INK.light;
      strokes.forEach((s) => paint(g, s, color));
      el.classList.toggle('has', strokes.some((s) => !s.erase));
    }
    function pos(e) { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top, e.pressure || 0.5]; }
    cv.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'pen') { penSeen = true; el.querySelector('.rk-pen').hidden = false; }
      if (penSeen && e.pointerType === 'touch') return;          // palm rejection once a stylus is in use
      if (e.button > 0) return;
      e.preventDefault(); cv.setPointerCapture(e.pointerId);
      cur = { pts: [pos(e)], erase: tool === 'eraser' || e.button === 5, pen: e.pointerType === 'pen' };
      strokes.push(cur); redraw();
    });
    cv.addEventListener('pointermove', (e) => {
      if (!cur) return;
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      evs.forEach((ev) => cur.pts.push(pos(ev)));
      const g = ctx(), color = dark() ? INK.dark : INK.light;
      const tail = { pts: cur.pts.slice(-evs.length - 1), erase: cur.erase, pen: cur.pen };
      paint(g, tail, color); if (!cur.erase) el.classList.add('has');
    });
    const end = () => { if (cur) { cur = null; redraw(); if (opts.onChange) opts.onChange(); } };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end); cv.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'pen') end(); });
    el.querySelectorAll('[data-t]').forEach((b) => b.onclick = () => { tool = b.dataset.t; el.querySelectorAll('[data-t]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); });
    el.querySelector('[data-a="undo"]').onclick = () => { strokes.pop(); redraw(); };
    el.querySelector('[data-a="clear"]').onclick = () => { if (strokes.length && !confirm('Clear everything you have written?')) return; strokes.length = 0; redraw(); };
    el.querySelector('[data-a="more"]').onclick = () => { height += 240; size(); };
    let ro = null;
    let lastW = 0;
    if (window.ResizeObserver) { ro = new ResizeObserver(() => { const w = wrap.clientWidth; if (w && w !== lastW) { lastW = w; size(); } }); ro.observe(wrap); }
    new MutationObserver(redraw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    requestAnimationFrame(size);

    function toDataURL() {
      // white page, dark ink, trimmed to what was written, at most 1600 px wide
      const w = wrap.clientWidth || 600;
      let maxY = 40; strokes.forEach((s) => s.pts.forEach((p) => { if (!s.erase && p[1] > maxY) maxY = p[1]; }));
      const h = Math.min(height, Math.ceil(maxY + 30)), scale = Math.min(2, 1600 / w);
      const c = document.createElement('canvas'); c.width = Math.round(w * scale); c.height = Math.round(h * scale);
      const g = c.getContext('2d'); g.setTransform(scale, 0, 0, scale, 0, 0);
      const layer = document.createElement('canvas'); layer.width = c.width; layer.height = c.height;
      const lg = layer.getContext('2d'); lg.setTransform(scale, 0, 0, scale, 0, 0);
      strokes.forEach((s) => paint(lg, s, '#111111'));
      g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(layer, 0, 0);
      return c.toDataURL('image/jpeg', 0.85);
    }
    async function toText(context) {
      if (!window.RA10 || typeof RA10.transcribeWork !== 'function') throw new Error('Handwriting reading is unavailable right now.');
      const r = await RA10.transcribeWork({ image: toDataURL(), question: context || 'Handwritten revision notes. Transcribe exactly what is written.' });
      return String((r && r.text) || '').trim();
    }
    return { el, isEmpty: () => !strokes.some((s) => !s.erase), toDataURL, toText, clear: () => { strokes.length = 0; redraw(); } };
  }

  window.RA10Ink = { create };
})();
