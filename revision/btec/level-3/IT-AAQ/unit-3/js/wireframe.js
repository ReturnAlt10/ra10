/* Wireframe Designer — drag-drop page layout planning tool. */
(function () {
  'use strict';

  const STORE_KEY = 'ra10_u3_wireframe_v2';

  const BLOCK_TYPES = [
    { id: 'header', label: 'Header / Banner' },
    { id: 'nav', label: 'Navigation bar' },
    { id: 'dropdown', label: 'Drop-down menu' },
    { id: 'hero', label: 'Hero / Title' },
    { id: 'text', label: 'Text block' },
    { id: 'image', label: 'Image' },
    { id: 'images', label: 'Image row' },
    { id: 'video', label: 'Video (controls)' },
    { id: 'accordion', label: 'Accordion' },
    { id: 'form', label: 'Form' },
    { id: 'search', label: 'Search box' },
    { id: 'links', label: 'External links' },
    { id: 'map', label: 'Map' },
    { id: 'footer', label: 'Footer' }
  ];

  let blocks = loadBlocks();
  let selectedId = null;
  let dragEl = null;
  let dragMode = null; // 'move' | 'create'

  function loadBlocks() {
    try {
      const d = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (d && Array.isArray(d.blocks)) return d;
    } catch (e) {}
    return { blocks: [], notes: '' };
  }
  function saveBlocks() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(blocks)); } catch (e) {}
  }

  function renderPaletteHost() {
    const host = document.getElementById('wireframe-tool');
    if (!host) return;
    host.innerHTML = `
<div class="wf-layout">
  <aside class="wf-palette">
    <h4>Blocks</h4>
    <p class="wf-label">Layout</p>
    ${BLOCK_TYPES.slice(0, 3).map(b => blockButton(b)).join('')}
    <p class="wf-label">Content</p>
    ${BLOCK_TYPES.slice(3, 12).map(b => blockButton(b)).join('')}
    <p class="wf-label">Structure</p>
    ${BLOCK_TYPES.slice(12).map(b => blockButton(b)).join('')}
    <p class="muted small">Click a block to add it to the page, then drag to position. Click a placed block to select and delete it.</p>
  </aside>
  <div class="wf-main">
    <div class="wf-canvas-wrap">
      <div class="wf-canvas" id="wf-canvas"></div>
    </div>
    <div class="wf-notes">
      <label class="muted small" for="wf-notes"><strong>Annotations</strong> — note how each page layout meets the client brief (helpful for B.M3/B.D2).</label>
      <textarea id="wf-notes" placeholder="e.g. Home page: sticky nav (mobile-friendly), hero banner with CTA, accordion for genres, image row, footer with accessibility controls...">${esc(blocks.notes || '')}</textarea>
    </div>
    <div class="wf-actions">
      <button class="btn primary" id="wf-export">Export as image</button>
      <button class="btn" id="wf-print">Print</button>
      <button class="btn ghost" id="wf-clear">Clear canvas</button>
      <span class="muted small" style="align-self:center">Saved automatically on this device.</span>
    </div>
  </div>
</div>`;

    host.querySelectorAll('.wf-block').forEach(function (b) {
      b.addEventListener('click', function () {
        const type = b.dataset.type;
        const def = BLOCK_TYPES.find(function (t) { return t.id === type; });
        blocks.blocks.push({ id: 'b' + Date.now(), type: type, label: def.label, x: 40 + (blocks.blocks.length * 12) % 160, y: 40 + (blocks.blocks.length * 18) % 120, w: 180, h: def.id === 'hero' || def.id === 'header' ? 70 : 50 });
        saveBlocks();
        renderCanvas();
      });
    });
    document.getElementById('wf-canvas').addEventListener('click', function (e) {
      const el = e.target.closest('.wf-el');
      if (!el) return;
      if (e.target.classList.contains('wf-del')) {
        blocks.blocks = blocks.blocks.filter(function (b) { return b.id !== el.dataset.id; });
        selectedId = null;
        saveBlocks(); renderCanvas(); return;
      }
      selectedId = el.dataset.id;
      renderCanvas();
    });
    document.getElementById('wf-canvas').addEventListener('pointerdown', function (e) {
      const el = e.target.closest('.wf-el');
      if (!el || e.target.classList.contains('wf-del')) return;
      e.preventDefault();
      dragEl = el; dragMode = 'move';
      const rect = el.getBoundingClientRect();
      dragEl._offX = e.clientX - rect.left;
      dragEl._offY = e.clientY - rect.top;
    });
    document.addEventListener('pointermove', function (e) {
      if (!dragEl || dragMode !== 'move') return;
      const canvas = document.getElementById('wf-canvas');
      const cRect = canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(cRect.width - 40, e.clientX - cRect.left - dragEl._offX));
      const y = Math.max(0, Math.min(cRect.height - 30, e.clientY - cRect.top - dragEl._offY));
      dragEl.style.left = x + 'px';
      dragEl.style.top = y + 'px';
      dragEl._x = x; dragEl._y = y;
    });
    document.addEventListener('pointerup', function () {
      if (dragEl && dragEl._x != null) {
        const b = blocks.blocks.find(function (b) { return b.id === dragEl.dataset.id; });
        if (b) { b.x = Math.round(dragEl._x); b.y = Math.round(dragEl._y); saveBlocks(); }
      }
      dragEl = null; dragMode = null;
    });
    document.getElementById('wf-notes').addEventListener('input', function (e) {
      blocks.notes = e.target.value;
      saveBlocks();
    });
    document.getElementById('wf-export').addEventListener('click', exportImage);
    document.getElementById('wf-print').addEventListener('click', function () { window.print(); });
    document.getElementById('wf-clear').addEventListener('click', function () {
      if (!confirm('Clear the wireframe canvas?')) return;
      blocks.blocks = [];
      saveBlocks(); renderCanvas();
    });

    renderCanvas();
  }

  function blockButton(b) {
    return '<button class="wf-block" type="button" data-type="' + b.id + '">' + b.label + '</button>';
  }

  function renderCanvas() {
    const canvas = document.getElementById('wf-canvas');
    if (!canvas) return;
    canvas.classList.toggle('has-blocks', blocks.blocks.length > 0);
    const existing = canvas.querySelectorAll('.wf-el');
    existing.forEach(function (el) { el.remove(); });
    blocks.blocks.forEach(function (b) {
      const el = document.createElement('div');
      el.className = 'wf-el' + (b.id === selectedId ? ' selected' : '');
      el.dataset.id = b.id;
      el.style.left = b.x + 'px';
      el.style.top = b.y + 'px';
      el.style.width = b.w + 'px';
      el.style.height = b.h + 'px';
      el.textContent = b.label;
      const del = document.createElement('span');
      del.className = 'wf-del';
      del.textContent = '✕';
      el.appendChild(del);
      canvas.appendChild(el);
    });
  }

  function exportImage() {
    const canvas = document.getElementById('wf-canvas');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    // Use SVG foreignObject snapshot for a decent export without libraries
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + rect.width + '" height="' + rect.height + '">' +
      '<foreignObject width="100%" height="100%">' +
      '<div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Satoshi,system-ui,sans-serif;background:#ffffff;color:#101828">' +
      canvas.innerHTML +
      '</div></foreignObject></svg>';
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wireframe-' + (blocks.notes ? blocks.notes.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30) : 'home') + '.svg';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  window.initWireframeTool = function () {
    blocks = loadBlocks();
    renderPaletteHost();
  };
})();