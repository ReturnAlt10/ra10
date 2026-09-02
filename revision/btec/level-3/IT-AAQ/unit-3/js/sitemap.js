/* Sitemap Builder — plan site pages and navigation, with annotations + export. */
(function () {
  'use strict';

  const STORE_KEY = 'ra10_u3_sitemap_v2';
  let state = loadState();
  let selectedId = null;
  let dragNode = null;

  function loadState() {
    try {
      const d = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (d && Array.isArray(d.pages)) return d;
    } catch (e) {}
    return { pages: [{ id: 'home', label: 'Homepage', home: true, x: 300, y: 20 }], annotations: '' };
  }
  function saveState() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {} }

  function render() {
    const host = document.getElementById('sitemap-tool');
    if (!host) return;
    host.innerHTML = `
<div class="sm-controls">
  <input class="select" id="sm-new-label" placeholder="New page name (e.g. Events)" style="min-width:180px">
  <button class="btn" id="sm-add">Add page</button>
  <button class="btn ghost" id="sm-clear">Clear</button>
  <span class="muted small">Drag pages to arrange them · click a page to delete it</span>
</div>
<div class="wf-canvas-wrap sm-canvas-wrap" style="min-height:460px">
  <div class="wf-canvas sm-canvas" id="sm-canvas" style="height:460px"></div>
</div>
<div class="sm-annotations">
  <label class="muted small" for="sm-annotations"><strong>Annotations</strong> — for each page note its content/features and which client requirement it meets (this is what makes the site map meet A.M2/A.D1).</label>
  <textarea id="sm-annotations" placeholder="e.g. Homepage — hero + accordion (meets: accordion requirement, responsive nav). Events — form to request content + map (meets: form + modal images requirements)...">${esc(state.annotations)}</textarea>
</div>
<div class="wf-actions">
  <button class="btn primary" id="sm-export">Export as image</button>
  <button class="btn" id="sm-print">Print</button>
</div>`;

    document.getElementById('sm-add').addEventListener('click', addPage);
    document.getElementById('sm-new-label').addEventListener('keydown', function (e) { if (e.key === 'Enter') addPage(); });
    document.getElementById('sm-clear').addEventListener('click', function () {
      if (!confirm('Clear the sitemap?')) return;
      state.pages = [{ id: 'home', label: 'Homepage', home: true, x: 300, y: 20 }];
      saveState(); renderCanvas();
    });
    document.getElementById('sm-annotations').addEventListener('input', function (e) { state.annotations = e.target.value; saveState(); });
    document.getElementById('sm-export').addEventListener('click', exportImage);
    document.getElementById('sm-print').addEventListener('click', function () { window.print(); });

    const canvas = document.getElementById('sm-canvas');
    canvas.addEventListener('click', function (e) {
      const node = e.target.closest('.sm-node');
      if (!node) return;
      if (e.target.classList.contains('sm-del')) {
        state.pages = state.pages.filter(function (p) { return p.id !== node.dataset.id; });
        selectedId = null;
        saveState(); renderCanvas(); return;
      }
      selectedId = node.dataset.id;
      renderCanvas();
    });
    canvas.addEventListener('pointerdown', function (e) {
      const node = e.target.closest('.sm-node');
      if (!node || e.target.classList.contains('sm-del')) return;
      e.preventDefault();
      dragNode = node;
      const rect = node.getBoundingClientRect();
      dragNode._offX = e.clientX - rect.left;
      dragNode._offY = e.clientY - rect.top;
    });
    document.addEventListener('pointermove', function (e) {
      if (!dragNode) return;
      const canvas = document.getElementById('sm-canvas');
      const cRect = canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(cRect.width - 130, e.clientX - cRect.left - dragNode._offX));
      const y = Math.max(0, Math.min(cRect.height - 50, e.clientY - cRect.top - dragNode._offY));
      dragNode.style.left = x + 'px';
      dragNode.style.top = y + 'px';
      dragNode._x = x; dragNode._y = y;
    });
    document.addEventListener('pointerup', function () {
      if (dragNode && dragNode._x != null) {
        const p = state.pages.find(function (p) { return p.id === dragNode.dataset.id; });
        if (p) { p.x = Math.round(dragNode._x); p.y = Math.round(dragNode._y); saveState(); }
      }
      dragNode = null;
    });

    renderCanvas();
  }

  function addPage() {
    const input = document.getElementById('sm-new-label');
    const label = (input.value || '').trim();
    if (!label) return;
    const id = 'p' + Date.now();
    state.pages.push({ id: id, label: label, home: false, x: 60 + (state.pages.length * 130) % 600, y: 120 + (state.pages.length * 40) % 300 });
    input.value = '';
    saveState();
    renderCanvas();
  }

  function renderCanvas() {
    const canvas = document.getElementById('sm-canvas');
    if (!canvas) return;
    canvas.innerHTML = '';
    state.pages.forEach(function (p) {
      const node = document.createElement('div');
      node.className = 'sm-node' + (p.home ? ' home' : '') + (p.id === selectedId ? ' selected' : '');
      node.dataset.id = p.id;
      node.style.left = p.x + 'px';
      node.style.top = p.y + 'px';
      node.innerHTML = '<div class="sm-label">' + esc(p.label) + '</div>' + (p.home ? '<div class="sm-note">&#9733; start here</div>' : '');
      const del = document.createElement('span');
      del.className = 'sm-del';
      del.textContent = '✕';
      node.appendChild(del);
      canvas.appendChild(node);
    });
  }

  function exportImage() {
    const canvas = document.getElementById('sm-canvas');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + rect.width + '" height="' + rect.height + '">' +
      '<foreignObject width="100%" height="100%">' +
      '<div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Satoshi,system-ui,sans-serif;background:#ffffff;color:#101828">' +
      canvas.innerHTML +
      '</div></foreignObject></svg>';
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.svg';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  window.initSitemapTool = function () {
    state = loadState();
    render();
  };
})();