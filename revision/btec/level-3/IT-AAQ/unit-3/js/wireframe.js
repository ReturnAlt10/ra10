/* Wireframe Designer — draw.io/Balsamiq-style page layout tool.
   Canvas with grid; toolbox palette; drag-to-place + resize; page templates;
   device frame preview; annotations; export to SVG/PNG + print. */
(function () {
  'use strict';

  const STORE_KEY = 'ra10_u3_wireframe_v3';

  const BLOCKS = [
    { id: 'header', label: 'Header', icon: '▦' },
    { id: 'nav', label: 'Nav bar', icon: '☰' },
    { id: 'dropdown', label: 'Drop-down', icon: '▾' },
    { id: 'hero', label: 'Hero', icon: '★' },
    { id: 'text', label: 'Text', icon: '¶' },
    { id: 'image', label: 'Image', icon: '◧' },
    { id: 'images', label: 'Image row', icon: '▤' },
    { id: 'video', label: 'Video', icon: '▶' },
    { id: 'accordion', label: 'Accordion', icon: '≡' },
    { id: 'form', label: 'Form', icon: '☑' },
    { id: 'search', label: 'Search', icon: '⌕' },
    { id: 'links', label: 'External links', icon: '⇪' },
    { id: 'map', label: 'Map', icon: '✦' },
    { id: 'footer', label: 'Footer', icon: '▧' }
  ];

  const TEMPLATES = {
    homepage: {
      name: 'Homepage',
      blocks: [
        { type: 'header', x: 40, y: 40, w: 880, h: 50 },
        { type: 'nav', x: 40, y: 100, w: 880, h: 36 },
        { type: 'hero', x: 40, y: 150, w: 880, h: 110 },
        { type: 'images', x: 40, y: 280, w: 880, h: 110 },
        { type: 'text', x: 40, y: 410, w: 420, h: 130 },
        { type: 'accordion', x: 480, y: 410, w: 440, h: 130 },
        { type: 'footer', x: 40, y: 580, w: 880, h: 46 }
      ]
    },
    content: {
      name: 'Content page',
      blocks: [
        { type: 'header', x: 40, y: 40, w: 880, h: 50 },
        { type: 'nav', x: 40, y: 100, w: 880, h: 36 },
        { type: 'text', x: 40, y: 160, w: 520, h: 360 },
        { type: 'image', x: 580, y: 160, w: 340, h: 170 },
        { type: 'video', x: 580, y: 350, w: 340, h: 170 },
        { type: 'form', x: 40, y: 560, w: 880, h: 130 },
        { type: 'footer', x: 40, y: 720, w: 880, h: 46 }
      ]
    },
    contact: {
      name: 'Contact / form page',
      blocks: [
        { type: 'header', x: 40, y: 40, w: 880, h: 50 },
        { type: 'nav', x: 40, y: 100, w: 880, h: 36 },
        { type: 'text', x: 40, y: 160, w: 420, h: 260 },
        { type: 'form', x: 480, y: 160, w: 440, h: 330 },
        { type: 'map', x: 40, y: 440, w: 420, h: 180 },
        { type: 'footer', x: 40, y: 660, w: 880, h: 46 }
      ]
    },
    blank: { name: 'Blank', blocks: [] }
  };

  let state = loadState();
  let selectedId = null;
  let dragMode = null; // 'move' | 'resize'
  let dragEl = null;
  let resizeDir = null;
  let device = 'desktop';

  function loadState() {
    try {
      const d = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (d && Array.isArray(d.blocks)) return d;
    } catch (e) {}
    return { blocks: [], notes: '', pageTitle: '' };
  }
  function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function canvasSize() {
    if (device === 'mobile') return { w: 360, h: 640 };
    if (device === 'tablet') return { w: 768, h: 960 };
    return { w: 960, h: 800 };
  }

  function renderToolbar(host) {
    const palette = document.createElement('aside');
    palette.className = 'wf-palette';
    palette.innerHTML = `
      <div class="wf-palette-hd"><h4>Elements</h4></div>
      <div class="wf-palette-grid">
        ${BLOCKS.map(b => `<button class="wf-block" data-type="${b.id}" title="${b.label}"><span class="wf-block-icon">${b.icon}</span>${b.label}</button>`).join('')}
      </div>
      <div class="wf-palette-hd"><h4>Templates</h4></div>
      <div class="wf-templates">
        ${Object.keys(TEMPLATES).map(function (k) { return `<button class="wf-tpl" data-tpl="${k}">${TEMPLATES[k].name}</button>`; }).join('')}
      </div>
      <div class="wf-palette-hd"><h4>Device</h4></div>
      <div class="wf-devices">
        ${[{ id: 'desktop', label: '🖥 Desktop' }, { id: 'tablet', label: '📱 Tablet' }, { id: 'mobile', label: '📲 Mobile' }].map(function (d) { return `<button class="wf-dev ${device === d.id ? 'active' : ''}" data-dev="${d.id}">${d.label}</button>`; }).join('')}
      </div>
      <p class="muted small" style="margin-top:14px">Click to add, drag to move, drag handles to resize. Double-click to rename. Delete key removes.</p>
    `;
    palette.querySelectorAll('.wf-block').forEach(function (b) {
      b.addEventListener('click', function () { addBlock(b.getAttribute('data-type')); });
    });
    palette.querySelectorAll('.wf-tpl').forEach(function (b) {
      b.addEventListener('click', function () { applyTemplate(b.getAttribute('data-tpl')); });
    });
    palette.querySelectorAll('.wf-dev').forEach(function (b) {
      b.addEventListener('click', function () {
        device = b.getAttribute('data-dev');
        palette.querySelectorAll('.wf-dev').forEach(function (x) { x.classList.toggle('active', x === b); });
        fitCanvas();
        renderCanvas();
      });
    });
    host.appendChild(palette);
  }

  function fitCanvas() {
    const wrap = document.getElementById('wf-canvas-outer');
    const canvas = document.getElementById('wf-canvas');
    if (!wrap || !canvas) return;
    const size = canvasSize();
    canvas.style.width = size.w + 'px';
    canvas.style.height = size.h + 'px';
    const avail = wrap.clientWidth - 40;
    if (avail < size.w) {
      const scale = Math.max(0.4, avail / size.w);
      canvas.style.transform = 'scale(' + scale + ')';
      canvas.style.transformOrigin = 'top left';
      wrap.style.height = (size.h * scale + 40) + 'px';
    } else {
      canvas.style.transform = 'none';
      wrap.style.height = (size.h + 40) + 'px';
    }
  }

  function addBlock(type) {
    const def = BLOCKS.find(function (b) { return b.id === type; });
    if (!def) return;
    const size = canvasSize();
    const w = 180, h = 46;
    const x = Math.max(10, Math.min(size.w - w - 10, 20 + (state.blocks.length % 5) * 30));
    const y = Math.max(10, Math.min(size.h - h - 10, 20 + (state.blocks.length % 4) * 34));
    const block = { id: 'b' + Date.now() + Math.random().toString(36).slice(2, 6), type: type, label: def.label, x: x, y: y, w: w, h: h };
    state.blocks.push(block);
    selectedId = block.id;
    saveState();
    renderCanvas();
  }

  function applyTemplate(tpl) {
    const t = TEMPLATES[tpl];
    state.blocks = t.blocks.map(function (b) {
      const def = BLOCKS.find(function (x) { return x.id === b.type; });
      return { id: 'b' + Date.now() + Math.random().toString(36).slice(2, 6), type: b.type, label: def ? def.label : b.type, x: b.x, y: b.y, w: b.w, h: b.h };
    });
    selectedId = null;
    saveState();
    renderCanvas();
  }

  function renderCanvas() {
    const canvas = document.getElementById('wf-canvas');
    if (!canvas) return;
    canvas.innerHTML = '';
    const size = canvasSize();
    canvas.style.width = size.w + 'px';
    canvas.style.height = size.h + 'px';
    canvas.style.backgroundSize = '20px 20px';
    canvas.style.backgroundImage = 'linear-gradient(to right, var(--wf-grid, rgba(15,98,254,.08)) 1px, transparent 1px), linear-gradient(to bottom, var(--wf-grid, rgba(15,98,254,.08)) 1px, transparent 1px)';

    state.blocks.forEach(function (b) {
      const el = document.createElement('div');
      el.className = 'wf-el' + (b.id === selectedId ? ' selected' : '');
      el.dataset.id = b.id;
      el.style.left = b.x + 'px';
      el.style.top = b.y + 'px';
      el.style.width = b.w + 'px';
      el.style.height = b.h + 'px';
      el.innerHTML = '<span class="wf-el-label">' + esc(b.label) + '</span>' +
        '<span class="wf-resize" data-dir="nw"></span><span class="wf-resize" data-dir="n"></span><span class="wf-resize" data-dir="ne"></span>' +
        '<span class="wf-resize" data-dir="e"></span><span class="wf-resize" data-dir="w"></span>' +
        '<span class="wf-resize" data-dir="sw"></span><span class="wf-resize" data-dir="s"></span><span class="wf-resize" data-dir="se"></span>';
      canvas.appendChild(el);
      bindEl(el, b);
    });
    if (!state.blocks.length) {
      const hint = document.createElement('div');
      hint.className = 'wf-empty-hint';
      hint.textContent = 'Pick an element from the palette or a template to start — then drag to move, resize with the handles.';
      canvas.appendChild(hint);
    }
    const count = document.getElementById('wf-block-count');
    if (count) count.textContent = state.blocks.length + ' element' + (state.blocks.length === 1 ? '' : 's');
  }

  function bindEl(el, block) {
    el.addEventListener('click', function () {
      selectedId = block.id;
      renderCanvas();
    });
    el.addEventListener('pointerdown', function (e) {
      if (e.target.classList.contains('wf-resize')) {
        e.preventDefault();
        dragMode = 'resize';
        resizeDir = e.target.getAttribute('data-dir');
        dragEl = { id: block.id, startX: block.x, startY: block.y, startW: block.w, startH: block.h, mx: e.clientX, my: e.clientY };
        return;
      }
      e.preventDefault();
      dragMode = 'move';
      dragEl = { id: block.id, offX: e.clientX - block.x, offY: e.clientY - block.y, mx: e.clientX, my: e.clientY };
      selectedId = block.id;
      renderCanvas();
    });
    el.addEventListener('dblclick', function () {
      const label = prompt('Element label (e.g. "Sticky navigation"):', block.label);
      if (label != null) {
        block.label = label.trim() || block.label;
        saveState();
        renderCanvas();
      }
    });
  }

  function onPointerMove(e) {
    if (!dragEl) return;
    const size = canvasSize();
    const block = state.blocks.find(function (b) { return b.id === dragEl.id; });
    if (!block) return;
    const dx = e.clientX - dragEl.mx, dy = e.clientY - dragEl.my;

    if (dragMode === 'move') {
      let nx = dragEl.startX + dx, ny = dragEl.startY + dy;
      nx = Math.max(0, Math.min(size.w - block.w, Math.round(nx / 10) * 10));
      ny = Math.max(0, Math.min(size.h - block.h, Math.round(ny / 10) * 10));
      block.x = nx; block.y = ny;
    } else if (dragMode === 'resize') {
      let nx = block.x, ny = block.y, nw = block.w, nh = block.h;
      if (resizeDir.indexOf('e') > -1) nw = Math.max(40, Math.round((dragEl.startW + dx) / 10) * 10);
      if (resizeDir.indexOf('s') > -1) nh = Math.max(24, Math.round((dragEl.startH + dy) / 10) * 10);
      if (resizeDir.indexOf('w') > -1) { nw = Math.max(40, Math.round((dragEl.startW - dx) / 10) * 10); nx = dragEl.startX + (dragEl.startW - nw); }
      if (resizeDir.indexOf('n') > -1) { nh = Math.max(24, Math.round((dragEl.startH - dy) / 10) * 10); ny = dragEl.startY + (dragEl.startH - nh); }
      block.x = Math.max(0, nx);
      block.y = Math.max(0, ny);
      block.w = Math.min(size.w - block.x, nw);
      block.h = Math.min(size.h - block.y, nh);
    }
    saveState();
    renderCanvas();
  }

  function onPointerUp() {
    dragMode = null;
    dragEl = null;
  }

  function buildMain(host) {
    const main = document.createElement('div');
    main.className = 'wf-main';
    main.innerHTML = `
      <div class="wf-canvas-outer" id="wf-canvas-outer">
        <div class="wf-canvas" id="wf-canvas"></div>
      </div>
      <div class="wf-toolbar-row">
        <input class="select" id="wf-page-title" placeholder="Page name (e.g. Home)" value="${esc(state.pageTitle || '')}" style="flex:1;min-width:140px" aria-label="Page name">
        <span class="muted small" id="wf-block-count">0 elements</span>
      </div>
      <div class="wf-notes">
        <label class="muted small" for="wf-notes"><strong>Annotations</strong> — note how each element meets the client brief (helps B.M3/B.D2).</label>
        <textarea id="wf-notes" placeholder="e.g. Sticky nav satisfies the responsive navigation requirement; hero banner contains the main CTA...">${esc(state.notes || '')}</textarea>
      </div>
      <div class="wf-actions">
        <button class="btn primary" id="wf-export-svg">Export SVG</button>
        <button class="btn" id="wf-export-png">Export PNG</button>
        <button class="btn" id="wf-print">Print</button>
        <button class="btn ghost" id="wf-clear">Clear</button>
      </div>
    `;
    host.appendChild(main);
    document.getElementById('wf-notes').addEventListener('input', function (e) { state.notes = e.target.value; saveState(); });
    document.getElementById('wf-page-title').addEventListener('input', function (e) { state.pageTitle = e.target.value; saveState(); });
    document.getElementById('wf-export-svg').addEventListener('click', exportSvg);
    document.getElementById('wf-export-png').addEventListener('click', exportPng);
    document.getElementById('wf-print').addEventListener('click', function () { window.print(); });
    document.getElementById('wf-clear').addEventListener('click', function () {
      if (!confirm('Clear the canvas?')) return;
      state.blocks = [];
      selectedId = null;
      saveState(); renderCanvas();
    });
  }

  function buildSvg() {
    const size = canvasSize();
    const w = size.w, h = size.h;
    let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">';
    svg += '<rect width="' + w + '" height="' + h + '" fill="#ffffff"/>';
    svg += '<g stroke="#e2e8f0" stroke-width="1">';
    for (let x = 20; x < w; x += 20) svg += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + h + '"/>';
    for (let y = 20; y < h; y += 20) svg += '<line x1="0" y1="' + y + '" x2="' + w + '" y2="' + y + '"/>';
    svg += '</g>';
    // title
    if (state.pageTitle) svg += '<text x="20" y="20" font-family="Satoshi,sans-serif" font-size="13" font-weight="700" fill="#101828">' + esc(state.pageTitle) + '</text>';
    state.blocks.forEach(function (b) {
      svg += '<rect x="' + b.x + '" y="' + b.y + '" width="' + b.w + '" height="' + b.h + '" rx="6" fill="#eef4ff" stroke="#4a7de0" stroke-width="1.5" stroke-dasharray="4 3"/>';
      svg += '<text x="' + (b.x + b.w / 2) + '" y="' + (b.y + b.h / 2 + 5) + '" text-anchor="middle" font-family="Satoshi,sans-serif" font-size="11" fill="#33507a">' + esc(b.label) + '</text>';
    });
    svg += '</svg>';
    return svg;
  }

  function exportSvg() {
    downloadBlob(buildSvg(), 'image/svg+xml;charset=utf-8', 'wireframe-' + slug(state.pageTitle) + '.svg');
  }

  function exportPng() {
    const size = canvasSize();
    const svgString = buildSvg();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = function () {
      const scale = 2;
      const c = document.createElement('canvas');
      c.width = size.w * scale;
      c.height = size.h * scale;
      const ctx = c.getContext('2d');
      ctx.scale(scale, scale);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, size.w, size.h);
      ctx.drawImage(img, 0, 0, size.w, size.h);
      const a = document.createElement('a');
      a.href = c.toDataURL('image/png');
      a.download = 'wireframe-' + slug(state.pageTitle) + '.png';
      a.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function slug(s) {
    return String(s || 'wireframe').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'wireframe';
  }
  function downloadBlob(content, mime, filename) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);
  document.addEventListener('keydown', function (e) {
    if (!selectedId) return;
    if (e.key === 'Delete' || e.key === 'Backspace') {
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      e.preventDefault();
      state.blocks = state.blocks.filter(function (b) { return b.id !== selectedId; });
      selectedId = null;
      saveState(); renderCanvas();
    }
  });

  window.initWireframeTool = function () {
    const host = document.getElementById('wireframe-tool');
    if (!host) return;
    host.innerHTML = '';
    state = loadState();
    const layout = document.createElement('div');
    layout.className = 'wf-layout';
    layout.id = 'wf-layout';
    host.appendChild(layout);
    renderToolbar(layout);
    buildMain(layout);
    setTimeout(function () {
      fitCanvas();
      renderCanvas();
    }, 30);
  };

  window.addEventListener('resize', function () {
    if (document.getElementById('wf-layout')) fitCanvas();
  });
})();