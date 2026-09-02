/* Wireframe Designer — wireframe.cc-style wireframing tool.
   Core UX copied from wireframe.cc:
   - Draw a rectangle on the canvas, then pick what it is (floating toolbar)
   - Click to select, click inside a selection to add text, drag to move/resize
   - Multi-page wireframes (page tabs at the bottom)
   - Limited stencil palette (wireframe fidelity on purpose)
   - Grid + snap
   - Canvas size settings (web/mobile/custom)
   - Export each page to SVG / PNG / print
*/
(function () {
  'use strict';

  const STORE_KEY = 'ra10_u3_wireframe_v4';

  /* Stencils — deliberately limited, wireframe-fidelity boxes */
  const STENCILS = [
    { id: 'header', label: 'Header' },
    { id: 'nav', label: 'Nav bar' },
    { id: 'dropdown', label: 'Drop-down' },
    { id: 'hero', label: 'Hero' },
    { id: 'logos', label: 'Logos' },
    { id: 'breadcrumbs', label: 'Breadcrumbs' },
    { id: 'search', label: 'Search' },
    { id: 'text', label: 'Text' },
    { id: 'heading', label: 'Heading' },
    { id: 'image', label: 'Image' },
    { id: 'images', label: 'Image row' },
    { id: 'video', label: 'Video' },
    { id: 'accordion', label: 'Accordion' },
    { id: 'tabs', label: 'Tabs' },
    { id: 'form', label: 'Form' },
    { id: 'button', label: 'Button' },
    { id: 'map', label: 'Map' },
    { id: 'footer', label: 'Footer' }
  ];

  const DEVICES = {
    desktop: { label: 'Desktop', w: 1280, h: 900 },
    tablet: { label: 'Tablet', w: 768, h: 1024 },
    mobile: { label: 'Mobile', w: 375, h: 812 },
    custom: { label: 'Custom', w: 1024, h: 1400 }
  };

  const STYLE = {
    header: '#101828', nav: '#334155', dropdown: '#e6e9ef', hero: '#cbd5e1',
    logos: '#ffffff', breadcrumbs: '#ffffff', search: '#f1f5f9', text: '#f8fafc',
    heading: '#ffffff', image: '#cdd7e4', images: '#dbe4f0', video: '#0f172a',
    accordion: '#f1f5f9', tabs: '#eef2f7', form: '#eef2f7', button: '#d92d20',
    map: '#dbeafe', footer: '#1e293b'
  };
  const INK = {
    header: '#ffffff', nav: '#ffffff', dropdown: '#101828', hero: '#101828',
    logos: '#101828', breadcrumbs: '#101828', search: '#101828', text: '#64748b',
    heading: '#101828', image: '#475569', images: '#475569', video: '#e2e8f0',
    accordion: '#334155', tabs: '#334155', form: '#334155', button: '#ffffff',
    map: '#1e40af', footer: '#cbd5e1'
  };

  /* Section templates — full-width layout blocks, like wireframe.cc's sections */
  const SECTIONS = {
    'Header + nav': [
      { type: 'header', x: 40, y: 40, w: 1120, h: 64 },
      { type: 'nav', x: 40, y: 108, w: 1120, h: 40 }
    ],
    'Hero banner': [
      { type: 'hero', x: 40, y: 40, w: 1120, h: 220 },
      { type: 'button', x: 500, y: 240, w: 140, h: 36 },
      { type: 'text', x: 40, y: 300, w: 1120, h: 24 }
    ],
    'Image + text': [
      { type: 'text', x: 40, y: 40, w: 440, h: 220 },
      { type: 'image', x: 520, y: 40, w: 540, h: 220 }
    ],
    'Image row': [
      { type: 'images', x: 40, y: 40, w: 340, h: 200 },
      { type: 'images', x: 400, y: 40, w: 340, h: 200 },
      { type: 'images', x: 760, y: 40, w: 340, h: 200 }
    ],
    'Video': [
      { type: 'video', x: 40, y: 40, w: 640, h: 360 },
      { type: 'text', x: 720, y: 60, w: 320, h: 120 }
    ],
    'Accordion': [
      { type: 'accordion', x: 40, y: 40, w: 1120, h: 200 }
    ],
    'Contact form': [
      { type: 'text', x: 40, y: 40, w: 380, h: 200 },
      { type: 'form', x: 460, y: 40, w: 540, h: 260 }
    ],
    'Map + details': [
      { type: 'map', x: 40, y: 40, w: 640, h: 300 },
      { type: 'text', x: 720, y: 60, w: 320, h: 200 }
    ],
    'Footer': [
      { type: 'footer', x: 40, y: 40, w: 1120, h: 96 }
    ]
  };

  let state = loadState();
  let currentPageId = state.pages[0] ? state.pages[0].id : 'p1';
  let selected = [];
  let drag = null;
  let drawStart = null;
  let device = state.device || 'desktop';
  let snap = true;
  let showGrid = true;

  function uid(pre) { return (pre || 'el') + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function slug(s) { return String(s || 'wireframe').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'wireframe'; }

  function loadState() {
    try {
      const d = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (d && Array.isArray(d.pages) && d.pages.length) return d;
    } catch (e) {}
    return { pages: [{ id: 'p1', name: 'Home', blocks: [] }], device: 'desktop' };
  }
  function saveState() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {} }

  function page() { return state.pages.find(function (p) { return p.id === currentPageId; }) || state.pages[0]; }
  function blocks() { return page().blocks; }
  function canvasSize() {
    if (device === 'custom') return { w: state.customW || 1024, h: state.customH || 1400 };
    const d = DEVICES[device] || DEVICES.desktop;
    return { w: d.w, h: d.h };
  }

  function makeBlock(type, x, y, w, h) {
    const st = STENCILS.find(function (s) { return s.id === type; });
    const def = {
      header: { w: 1120, h: 64 }, nav: { w: 1120, h: 40 }, dropdown: { w: 170, h: 36 },
      hero: { w: 1120, h: 220 }, logos: { w: 220, h: 40 }, breadcrumbs: { w: 320, h: 22 },
      search: { w: 260, h: 36 }, text: { w: 420, h: 120 }, heading: { w: 420, h: 44 },
      image: { w: 300, h: 200 }, images: { w: 340, h: 200 }, video: { w: 480, h: 270 },
      accordion: { w: 520, h: 160 }, tabs: { w: 420, h: 120 }, form: { w: 520, h: 260 },
      button: { w: 140, h: 36 }, map: { w: 480, h: 260 }, footer: { w: 1120, h: 96 }
    };
    const d = def[type] || { w: 180, h: 60 };
    return {
      id: uid('b'), type: type, label: st ? st.label : type,
      x: Math.round(x), y: Math.round(y),
      w: Math.round(w || d.w), h: Math.round(h || d.h),
      fill: STYLE[type] || '#f1f5f9', ink: INK[type] || '#101828', text: ''
    };
  }

  function fitCanvas() {
    const outer = document.getElementById('wf-canvas-outer');
    const canvas = document.getElementById('wf-canvas');
    if (!outer || !canvas) return;
    const size = canvasSize();
    canvas.style.width = size.w + 'px';
    canvas.style.height = size.h + 'px';
    const avail = outer.clientWidth - 48;
    const scale = Math.max(0.35, Math.min(1, avail / size.w));
    canvas.style.transform = 'scale(' + scale + ')';
    canvas.style.transformOrigin = 'top left';
    outer.style.height = Math.ceil(size.h * scale) + 'px';
  }

  /* ── Render ───────────────────────────────────────────── */
  function render() {
    const host = document.getElementById('wireframe-tool');
    if (!host) return;
    host.innerHTML =
      '<div class="wf-toolbar" id="wf-toolbar">' +
      '  <span class="wf-brand">⬚ Wireframe</span>' +
      '  <button class="wf-btn" id="wf-add-page" title="Add a page">＋ Page</button>' +
      '  <button class="wf-btn" id="wf-duplicate-page" title="Duplicate this page">⧉ Duplicate</button>' +
      '  <button class="wf-btn' + (showGrid ? ' active' : '') + '" id="wf-toggle-grid" title="Show grid">Grid</button>' +
      '  <button class="wf-btn' + (snap ? ' active' : '') + '" id="wf-toggle-snap" title="Snap to grid">Snap</button>' +
      '  <label class="wf-label">Device</label>' +
      '  <select id="wf-device" class="wf-select">' + Object.keys(DEVICES).map(function (k) { return '<option value="' + k + '"' + (device === k ? ' selected' : '') + '>' + DEVICES[k].label + '</option>'; }).join('') + '</select>' +
      '  <label class="wf-label">Canvas</label>' +
      '  <input id="wf-cw" class="wf-num" type="number" value="' + canvasSize().w + '" min="320" max="2560" step="20" title="Canvas width">' +
      '  <span class="wf-x">×</span>' +
      '  <input id="wf-ch" class="wf-num" type="number" value="' + canvasSize().h + '" min="320" max="6000" step="20" title="Canvas height">' +
      '  <span class="wf-spacer"></span>' +
      '  <button class="wf-btn" id="wf-export-svg" title="Export page as SVG">⇩ SVG</button>' +
      '  <button class="wf-btn" id="wf-export-png" title="Export page as PNG">⇩ PNG</button>' +
      '  <button class="wf-btn" id="wf-print" title="Print page">🖨 Print</button>' +
      '  <button class="wf-btn danger" id="wf-clear" title="Clear this page">Clear</button>' +
      '</div>' +
      '<div class="wf-body">' +
      '  <div class="wf-stencil" id="wf-stencil">' +
      '    <div class="wf-stencil-hd">Elements</div>' +
      '    <div class="wf-stencil-list">' +
      STENCILS.map(function (s) { return '<button class="wf-stencil-btn" data-type="' + s.id + '" title="Click to add, or draw a rectangle then pick this"><span class="wf-stencil-glyph st-' + s.id + '"></span>' + s.label + '</button>'; }).join('') +
      '    </div>' +
      '    <div class="wf-stencil-hd">Sections</div>' +
      '    <div class="wf-stencil-list">' +
      Object.keys(SECTIONS).map(function (k) { return '<button class="wf-section-btn" data-section="' + esc(k) + '">⬚ ' + esc(k) + '</button>'; }).join('') +
      '    </div>' +
      '    <div class="wf-stencil-hd">Tips</div>' +
      '    <p class="wf-stencil-tip">Draw a rectangle anywhere and pick what it is.<br>Drag to move. Double-click to add text. Delete removes.</p>' +
      '  </div>' +
      '  <div class="wf-stage">' +
      '    <div class="wf-canvas-outer" id="wf-canvas-outer">' +
      '      <div class="wf-canvas" id="wf-canvas" tabindex="0"></div>' +
      '    </div>' +
      '    <div class="wf-pages" id="wf-pages"></div>' +
      '  </div>' +
      '  <div class="wf-inspector" id="wf-inspector">' +
      '    <div class="wf-inspector-hd">Inspector</div>' +
      '    <div class="wf-inspector-body" id="wf-inspector-body"></div>' +
      '  </div>' +
      '</div>';

    bindToolbar();
    renderPages();
    renderInspector();
    renderCanvas();
    setTimeout(fitCanvas, 30);
  }

  function bindToolbar() {
    const host = document.getElementById('wireframe-tool');
    host.querySelector('#wf-add-page').addEventListener('click', function () {
      const p = { id: uid('p'), name: 'Page ' + (state.pages.length + 1), blocks: [] };
      state.pages.push(p);
      currentPageId = p.id;
      selected = [];
      saveState(); renderPages(); renderCanvas(); renderInspector();
    });
    host.querySelector('#wf-duplicate-page').addEventListener('click', function () {
      const cur = page();
      const idx = state.pages.indexOf(cur);
      const p = { id: uid('p'), name: cur.name + ' copy', blocks: JSON.parse(JSON.stringify(cur.blocks)) };
      state.pages.splice(idx + 1, 0, p);
      currentPageId = p.id;
      selected = [];
      saveState(); renderPages(); renderCanvas(); renderInspector();
    });
    host.querySelector('#wf-toggle-grid').addEventListener('click', function () {
      showGrid = !showGrid; this.classList.toggle('active', showGrid); renderCanvas();
    });
    host.querySelector('#wf-toggle-snap').addEventListener('click', function () {
      snap = !snap; this.classList.toggle('active', snap);
    });
    host.querySelector('#wf-device').addEventListener('change', function () {
      device = this.value; state.device = device;
      const size = canvasSize();
      document.getElementById('wf-cw').value = size.w;
      document.getElementById('wf-ch').value = size.h;
      saveState(); fitCanvas(); renderCanvas();
    });
    host.querySelector('#wf-cw').addEventListener('change', function () {
      if (device !== 'custom') { device = 'custom'; document.getElementById('wf-device').value = 'custom'; }
      state.customW = Math.max(320, Math.min(2560, +this.value || 1024));
      saveState(); fitCanvas(); renderCanvas();
    });
    host.querySelector('#wf-ch').addEventListener('change', function () {
      if (device !== 'custom') { device = 'custom'; document.getElementById('wf-device').value = 'custom'; }
      state.customH = Math.max(320, Math.min(6000, +this.value || 1400));
      saveState(); fitCanvas(); renderCanvas();
    });
    host.querySelector('#wf-export-svg').addEventListener('click', exportSvg);
    host.querySelector('#wf-export-png').addEventListener('click', exportPng);
    host.querySelector('#wf-print').addEventListener('click', function () { window.print(); });
    host.querySelector('#wf-clear').addEventListener('click', function () {
      if (!confirm('Clear this page?')) return;
      page().blocks = []; selected = []; saveState(); renderCanvas(); renderInspector();
    });
    host.querySelectorAll('.wf-stencil-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        const size = canvasSize();
        const blk = makeBlock(b.getAttribute('data-type'), (size.w - 180) / 2, (size.h - 80) / 2);
        blocks().push(blk); selected = [blk.id];
        saveState(); renderCanvas(); renderInspector();
      });
    });
    host.querySelectorAll('.wf-section-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        const sec = SECTIONS[b.getAttribute('data-section')] || [];
        const newBlks = sec.map(function (s) { return makeBlock(s.type, s.x, s.y, s.w, s.h); });
        blocks().push.apply(blocks(), newBlks);
        selected = newBlks.map(function (b2) { return b2.id; });
        saveState(); renderCanvas(); renderInspector();
      });
    });
  }

  function renderPages() {
    const host = document.getElementById('wf-pages');
    if (!host) return;
    host.innerHTML = state.pages.map(function (p, i) {
      return '<div class="wf-page' + (p.id === currentPageId ? ' active' : '') + '" data-page="' + esc(p.id) + '">' +
        '<input class="wf-page-name" value="' + esc(p.name) + '" aria-label="Page name">' +
        '<button class="wf-page-del" title="Delete page" ' + (state.pages.length === 1 ? 'disabled' : '') + '>✕</button>' +
        '</div>';
    }).join('') + '<span class="wf-page-count">' + state.pages.length + ' pgs</span>';
    host.querySelectorAll('.wf-page').forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (e.target.classList.contains('wf-page-del')) return;
        currentPageId = el.getAttribute('data-page'); selected = [];
        saveState(); renderPages(); renderCanvas(); renderInspector();
      });
      el.querySelector('.wf-page-name').addEventListener('input', function () {
        const p = state.pages.find(function (x) { return x.id === el.getAttribute('data-page'); });
        if (p) { p.name = this.value; saveState(); }
      });
      el.querySelector('.wf-page-del').addEventListener('click', function (e) {
        e.stopPropagation();
        if (state.pages.length === 1) return;
        if (!confirm('Delete this page?')) return;
        const id = el.getAttribute('data-page');
        state.pages = state.pages.filter(function (p) { return p.id !== id; });
        if (currentPageId === id) currentPageId = state.pages[0].id;
        selected = [];
        saveState(); renderPages(); renderCanvas(); renderInspector();
      });
    });
  }

  function renderCanvas() {
    const canvas = document.getElementById('wf-canvas');
    if (!canvas) return;
    canvas.innerHTML = '';
    const size = canvasSize();
    canvas.style.width = size.w + 'px';
    canvas.style.height = size.h + 'px';
    canvas.style.backgroundSize = '16px 16px';
    canvas.style.backgroundImage = showGrid
      ? 'linear-gradient(to right, rgba(170,180,200,.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(170,180,200,.22) 1px, transparent 1px)'
      : 'none';

    blocks().forEach(function (b) {
      const el = document.createElement('div');
      el.className = 'wf-el' + (selected.indexOf(b.id) > -1 ? ' selected' : '');
      el.dataset.id = b.id;
      el.style.left = b.x + 'px';
      el.style.top = b.y + 'px';
      el.style.width = b.w + 'px';
      el.style.height = b.h + 'px';
      el.style.background = b.fill;
      el.style.color = b.ink;
      el.innerHTML =
        '<span class="wf-el-label">' + esc(b.label) + '</span>' +
        (b.text ? '<span class="wf-el-text">' + esc(b.text) + '</span>' : '') +
        '<span class="wf-handle wf-h-nw" data-dir="nw"></span><span class="wf-handle wf-h-n" data-dir="n"></span><span class="wf-handle wf-h-ne" data-dir="ne"></span>' +
        '<span class="wf-handle wf-h-e" data-dir="e"></span><span class="wf-handle wf-h-w" data-dir="w"></span>' +
        '<span class="wf-handle wf-h-sw" data-dir="sw"></span><span class="wf-handle wf-h-s" data-dir="s"></span><span class="wf-handle wf-h-se" data-dir="se"></span>';
      canvas.appendChild(el);
    });
    if (!blocks().length) {
      const hint = document.createElement('div');
      hint.className = 'wf-empty-hint';
      hint.textContent = 'Drag on the canvas to draw a rectangle — then pick what it is. Or click an element in the palette.';
      canvas.appendChild(hint);
    }
  }

  function canvasPoint(e) {
    const canvas = document.getElementById('wf-canvas');
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scale = rect.width / canvasSize().w;
    return { x: Math.round((e.clientX - rect.left) / scale), y: Math.round((e.clientY - rect.top) / scale) };
  }
  function snapVal(v) { return snap ? Math.round(v / 8) * 8 : Math.round(v); }

  function bindCanvas() {
    const canvas = document.getElementById('wf-canvas');
    if (!canvas) return;

    canvas.addEventListener('pointerdown', function (e) {
      // Ignore clicks inside the stencil picker (it floats above the canvas)
      if (e.target.closest('#wf-stencil-picker')) return;
      if (e.target.classList.contains('wf-handle')) {
        e.preventDefault();
        const el = e.target.closest('.wf-el'); if (!el) return;
        const b = blocks().find(function (x) { return x.id === el.dataset.id; }); if (!b) return;
        selected = [b.id]; renderCanvas(); renderInspector();
        drag = { mode: 'resize', id: b.id, dir: e.target.getAttribute('data-dir'), startX: b.x, startY: b.y, startW: b.w, startH: b.h, mx: e.clientX, my: e.clientY };
        return;
      }
      const el = e.target.closest('.wf-el');
      if (el) {
        const id = el.dataset.id;
        const b = blocks().find(function (x) { return x.id === id; });
        if (!b) return;
        selected = [id];
        e.preventDefault();
        drag = { mode: 'move', id: id, startX: b.x, startY: b.y, offX: e.clientX - b.x, offY: e.clientY - b.y, mx: e.clientX, my: e.clientY };
        renderCanvas(); renderInspector();
        return;
      }
      // Empty canvas: start drawing
      e.preventDefault();
      const pt = canvasPoint(e); if (!pt) return;
      drawStart = { x: pt.x, y: pt.y };
      selected = []; renderCanvas(); renderInspector();
      const ghost = document.createElement('div');
      ghost.className = 'wf-ghost'; ghost.id = 'wf-ghost';
      canvas.appendChild(ghost);
    });

    canvas.addEventListener('pointermove', function (e) {
      const pt = canvasPoint(e); if (!pt) return;
      const ghost = document.getElementById('wf-ghost');
      if (drawStart && ghost) {
        const x = Math.min(drawStart.x, pt.x), y = Math.min(drawStart.y, pt.y);
        ghost.style.left = x + 'px'; ghost.style.top = y + 'px';
        ghost.style.width = Math.abs(pt.x - drawStart.x) + 'px';
        ghost.style.height = Math.abs(pt.y - drawStart.y) + 'px';
        return;
      }
      if (!drag) return;
      const b = blocks().find(function (x) { return x.id === drag.id; }); if (!b) return;
      const size = canvasSize();
      const dx = e.clientX - drag.mx, dy = e.clientY - drag.my;
      if (drag.mode === 'move') {
        let nx = snapVal(drag.startX + dx), ny = snapVal(drag.startY + dy);
        nx = Math.max(0, Math.min(size.w - b.w, nx));
        ny = Math.max(0, Math.min(size.h - b.h, ny));
        b.x = nx; b.y = ny;
      } else if (drag.mode === 'resize') {
        let nx = b.x, ny = b.y, nw = b.w, nh = b.h;
        if (drag.dir.indexOf('e') > -1) nw = Math.max(24, snapVal(drag.startW + dx));
        if (drag.dir.indexOf('s') > -1) nh = Math.max(16, snapVal(drag.startH + dy));
        if (drag.dir.indexOf('w') > -1) { nw = Math.max(24, snapVal(drag.startW - dx)); nx = drag.startX + (drag.startW - nw); }
        if (drag.dir.indexOf('n') > -1) { nh = Math.max(16, snapVal(drag.startH - dy)); ny = drag.startY + (drag.startH - nh); }
        b.x = Math.max(0, nx); b.y = Math.max(0, ny);
        b.w = Math.min(size.w - b.x, nw); b.h = Math.min(size.h - b.y, nh);
      }
      saveState(); renderCanvas();
    });

    function endDrag(e) {
      if (drawStart) {
        const pt = canvasPoint(e);
        const ghost = document.getElementById('wf-ghost'); if (ghost) ghost.remove();
        if (pt) {
          const x = Math.min(drawStart.x, pt.x), y = Math.min(drawStart.y, pt.y);
          const w = Math.abs(pt.x - drawStart.x), h = Math.abs(pt.y - drawStart.y);
          if (w > 18 && h > 12) showStencilPicker(x, y, w, h);
        }
        drawStart = null;
        return;
      }
      drag = null;
    }
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', function () { drag = null; drawStart = null; var g = document.getElementById('wf-ghost'); if (g) g.remove(); });

    canvas.addEventListener('dblclick', function (e) {
      const el = e.target.closest('.wf-el'); if (!el) return;
      const b = blocks().find(function (x) { return x.id === el.dataset.id; }); if (!b) return;
      const t = prompt('Text for this element (leave empty for none):', b.text || '');
      if (t !== null) { b.text = t; saveState(); renderCanvas(); renderInspector(); }
    });

    canvas.addEventListener('keydown', function (e) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (!selected.length) return;
        const t = e.target;
        if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
        e.preventDefault();
        page().blocks = blocks().filter(function (b) { return selected.indexOf(b.id) === -1; });
        selected = [];
        saveState(); renderCanvas(); renderInspector();
      }
      if (e.key === 'Escape') { selected = []; renderCanvas(); renderInspector(); }
    });
  }

  function showStencilPicker(x, y, w, h) {
    const old = document.getElementById('wf-stencil-picker');
    if (old) old.remove();
    const canvas = document.getElementById('wf-canvas');
    if (!canvas) return;
    const box = document.createElement('div');
    box.className = 'wf-stencil-picker'; box.id = 'wf-stencil-picker';
    box.innerHTML = '<div class="wf-sp-hd">What is this?</div><div class="wf-sp-grd">' +
      STENCILS.map(function (s) { return '<button class="wf-sp-btn" data-type="' + s.id + '"><span class="wf-stencil-glyph st-' + s.id + '"></span>' + s.label + '</button>'; }).join('') + '</div>';
    const size = canvasSize();
    box.style.left = Math.min(x + w + 10, size.w - 240) + 'px';
    box.style.top = Math.max(0, y - 60) + 'px';
    canvas.appendChild(box);
    box.querySelectorAll('.wf-sp-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        const blk = makeBlock(b.getAttribute('data-type'), x, y, w, h);
        blocks().push(blk); selected = [blk.id];
        box.remove(); saveState(); renderCanvas(); renderInspector();
      });
    });
    setTimeout(function () {
      document.addEventListener('pointerdown', function close(e2) {
        if (!e2.target.closest('#wf-stencil-picker')) {
          const bx = document.getElementById('wf-stencil-picker');
          if (bx) bx.remove();
          document.removeEventListener('pointerdown', close);
        }
      });
    }, 0);
  }

  /* ── Inspector ────────────────────────────────────────── */
  function renderInspector() {
    const host = document.getElementById('wf-inspector-body');
    if (!host) return;
    if (selected.length === 0) {
      host.innerHTML = '<p class="wf-insp-hint">Select an element to edit its name, text, position and size.</p>';
      return;
    }
    const b = blocks().find(function (x) { return selected[selected.length - 1] === x.id; });
    if (!b) { host.innerHTML = ''; return; }
    const br = blocks().find(function (x) { return x.id === b.id; });
    host.innerHTML =
      '<div class="wf-insp-field"><label>Label</label><input id="wf-insp-label" value="' + esc(b.label) + '"></div>' +
      '<div class="wf-insp-field"><label>Text</label><input id="wf-insp-text" value="' + esc(b.text || '') + '"></div>' +
      '<div class="wf-insp-field in-sp-row"><label>X</label><input id="wf-insp-x" type="number" value="' + b.x + '"><label>Y</label><input id="wf-insp-y" type="number" value="' + b.y + '"></div>' +
      '<div class="wf-insp-field in-sp-row"><label>W</label><input id="wf-insp-w" type="number" value="' + b.w + '"><label>H</label><input id="wf-insp-h" type="number" value="' + b.h + '"></div>' +
      '<div class="wf-insp-field"><label>Colour</label><input id="wf-insp-fill" type="color" value="' + (b.fill || '#f1f5f9') + '"></div>' +
      '<p class="wf-insp-tip">Double-click the element on canvas to add text. Delete key removes.</p>';
    function bind(id, fn) {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', function () { fn(this.value); saveState(); renderCanvas(); renderInspector(); });
    }
    bind('wf-insp-label', function (v) { b.label = v; });
    bind('wf-insp-text', function (v) { b.text = v; });
    bind('wf-insp-x', function (v) { b.x = Math.max(0, +v || 0); });
    bind('wf-insp-y', function (v) { b.y = Math.max(0, +v || 0); });
    bind('wf-insp-w', function (v) { b.w = Math.max(16, +v || 16); });
    bind('wf-insp-h', function (v) { b.h = Math.max(12, +v || 12); });
    bind('wf-insp-fill', function (v) { b.fill = v; });
  }

  /* ── Exports ─────────────────────────────────────────────── */
  function buildSvg() {
    const size = canvasSize();
    let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + size.w + '" height="' + size.h + '" viewBox="0 0 ' + size.w + ' ' + size.h + '">';
    svg += '<rect width="' + size.w + '" height="' + size.h + '" fill="#ffffff"/>';
    if (showGrid) {
      svg += '<g stroke="#e2e8f0" stroke-width="1">';
      for (let x = 16; x < size.w; x += 16) svg += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + size.h + '"/>';
      for (let y = 16; y < size.h; y += 16) svg += '<line x1="0" y1="' + y + '" x2="' + size.w + '" y2="' + y + '"/>';
      svg += '</g>';
    }
    if (page().name) svg += '<text x="16" y="22" font-family="Satoshi, sans-serif" font-size="14" font-weight="700" fill="#101828">' + esc(page().name) + '</text>';
    blocks().forEach(function (b) {
      svg += '<rect x="' + b.x + '" y="' + b.y + '" width="' + b.w + '" height="' + b.h + '" rx="4" fill="' + b.fill + '" stroke="#94a3b8" stroke-width="1.2"/>';
      if (b.text) svg += '<text x="' + (b.x + 8) + '" y="' + (b.y + Math.min(14, b.h - 4)) + '" font-family="Satoshi,sans-serif" font-size="11" fill="' + b.ink + '">' + esc(b.text) + '</text>';
      else svg += '<text x="' + (b.x + b.w / 2) + '" y="' + (b.y + b.h / 2 + 4) + '" text-anchor="middle" font-family="Satoshi,sans-serif" font-size="11" fill="' + b.ink + '">' + esc(b.label) + '</text>';
    });
    svg += '</svg>';
    return svg;
  }

  function downloadBlob(content, mime, filename) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function exportSvg() {
    downloadBlob(buildSvg(), 'image/svg+xml;charset=utf-8', 'wireframe-' + slug(page().name) + '.svg');
  }
  function exportPng() {
    const size = canvasSize();
    const svgString = buildSvg();
    const url = URL.createObjectURL(new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' }));
    const img = new Image();
    img.onload = function () {
      const c = document.createElement('canvas');
      c.width = size.w * 2; c.height = size.h * 2;
      const ctx = c.getContext('2d');
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0, size.w, size.h);
      const a = document.createElement('a');
      a.href = c.toDataURL('image/png');
      a.download = 'wireframe-' + slug(page().name) + '.png';
      a.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  /* ── Init ─────────────────────────────────────────────────── */
  window.initWireframeTool = function () {
    const host = document.getElementById('wireframe-tool');
    if (!host) return;
    state = loadState();
    currentPageId = state.pages[0] ? state.pages[0].id : 'p1';
    device = state.device || 'desktop';
    render();
    bindCanvas();
  };

  window.addEventListener('resize', function () {
    if (document.getElementById('wf-canvas')) fitCanvas();
  });
})();