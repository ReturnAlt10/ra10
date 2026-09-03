/* Sitemap Builder — draw.io-style site structure planner.
   Pages on a canvas; draw links between pages (SVG lines); hierarchical
   auto-arrange; annotations per page; export SVG/PNG + print. */
(function () {
  'use strict';

  const STORE_KEY = 'ra10_u3_sitemap_v3';

  let state = loadState();
  let selectedId = null;
  let dragPage = null;
  let linkStart = null; // page id while drawing a link
  let linkPreview = null;

  function loadState() {
    try {
      const d = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (d && Array.isArray(d.pages)) return d;
    } catch (e) {}
    return {
      pages: [{ id: 'home', label: 'Homepage', home: true, x: 400, y: 40 }],
      links: [],
      annotations: ''
    };
  }
  function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  function pageCenter(p) {
    return { x: p.x + 95, y: p.y + 32 };
  }

  function renderLinks(canvas) {
    // remove old svg lines
    canvas.querySelectorAll('.sm-link-line').forEach(function (n) { n.remove(); });
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'sm-links');
    svg.setAttribute('width', canvas.clientWidth);
    svg.setAttribute('height', canvas.clientHeight);
    svg.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;width:100%;height:100%;overflow:visible';

    state.links.forEach(function (l) {
      const a = state.pages.find(function (p) { return p.id === l.from; });
      const b = state.pages.find(function (p) { return p.id === l.to; });
      if (!a || !b) return;
      const ca = pageCenter(a), cb = pageCenter(b);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('class', 'sm-link-line');
      line.setAttribute('x1', ca.x); line.setAttribute('y1', ca.y);
      line.setAttribute('x2', cb.x); line.setAttribute('y2', cb.y);
      line.setAttribute('stroke', '#4a7de0');
      line.setAttribute('stroke-width', '2');
      line.setAttribute('stroke-dasharray', '6 4');
      svg.appendChild(line);
      // arrow
      const angle = Math.atan2(cb.y - ca.y, cb.x - ca.x);
      const ax = cb.x - 18 * Math.cos(angle), ay = cb.y - 18 * Math.sin(angle);
      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      arrow.setAttribute('points', [
        (ax + 8 * Math.cos(angle + Math.PI * 0.85)) + ',' + (ay + 8 * Math.sin(angle + Math.PI * 0.85)),
        (ax + 8 * Math.cos(angle - Math.PI * 0.85)) + ',' + (ay + 8 * Math.sin(angle - Math.PI * 0.85)),
        (cb.x) + ',' + (cb.y)
      ].join(' '));
      arrow.setAttribute('fill', '#4a7de0');
      svg.appendChild(arrow);
    });
    if (linkPreview && linkStart) {
      const a = state.pages.find(function (p) { return p.id === linkStart; });
      if (a) {
        const ca = pageCenter(a);
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('class', 'sm-link-line');
        line.setAttribute('x1', ca.x); line.setAttribute('y1', ca.y);
        line.setAttribute('x2', linkPreview.x); line.setAttribute('y2', linkPreview.y);
        line.setAttribute('stroke', '#f59e0b');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-dasharray', '4 4');
        svg.appendChild(line);
      }
    }
    canvas.appendChild(svg);
  }

  function render() {
    const host = document.getElementById('sitemap-tool');
    if (!host) return;
    host.innerHTML = `
      <div class="sm-toolbar">
        <input class="select" id="sm-new-label" placeholder="New page (e.g. Events)" style="min-width:150px" aria-label="New page name">
        <button class="btn" id="sm-add">Add page</button>
        <button class="btn" id="sm-auto">Auto-arrange</button>
        <button class="btn" id="sm-example" title="Load a typical site structure">&#9733; Load example</button>
        <button class="btn ghost" id="sm-links-help" title="Toggle linking mode">&#9998;&#65039; Link mode</button>
        <span class="muted small" id="sm-hint">Click a page, then click another to link them. Drag to move. Double-click to rename and add a note. Delete removes.</span>
      </div>
      <div class="wf-canvas-outer sm-canvas-outer" id="sm-canvas-outer">
        <div class="wf-canvas sm-canvas" id="sm-canvas"></div>
      </div>
      <div class="sm-annotations">
        <label class="muted small" for="sm-annotations"><strong>Annotations</strong> — for each page note its content/features and which client requirement it meets (this makes the site map meet A.M2/A.D1).</label>
        <textarea id="sm-annotations" placeholder="e.g. Homepage — hero + accordion (meets: accordion, responsive nav). Events — form + map (meets: form, modal images)...">${esc(state.annotations || '')}</textarea>
      </div>
      <div class="wf-actions">
        <button class="btn primary" id="sm-export-svg">Export SVG</button>
        <button class="btn" id="sm-export-png">Export PNG</button>
        <button class="btn" id="sm-print">Print</button>
        <button class="btn ghost" id="sm-clear">Clear</button>
      </div>
    `;

    document.getElementById('sm-add').addEventListener('click', addPage);
    document.getElementById('sm-new-label').addEventListener('keydown', function (e) { if (e.key === 'Enter') addPage(); });
    document.getElementById('sm-auto').addEventListener('click', autoArrange);
    document.getElementById('sm-example').addEventListener('click', loadExample);
    document.getElementById('sm-links-help').addEventListener('click', function () {
      window._smLinkMode = !window._smLinkMode;
      this.textContent = window._smLinkMode ? '🔗 Linking… (click 2 pages)' : '✏️ Link mode';
      const hint = document.getElementById('sm-hint');
      if (hint) hint.textContent = window._smLinkMode ? 'Link mode: click a page, then click the page to link to it.' : 'Click a page, then click another to link them. Drag to move. Double-click to rename. Delete removes.';
    });
    document.getElementById('sm-annotations').addEventListener('input', function (e) { state.annotations = e.target.value; saveState(); });
    document.getElementById('sm-export-svg').addEventListener('click', function () { exportSvg(); });
    document.getElementById('sm-export-png').addEventListener('click', function () { exportPng(); });
    document.getElementById('sm-print').addEventListener('click', function () { window.print(); });
    document.getElementById('sm-clear').addEventListener('click', function () {
      if (!confirm('Clear the sitemap?')) return;
      state.pages = [{ id: 'home', label: 'Homepage', home: true, x: 400, y: 40 }];
      state.links = [];
      saveState(); renderCanvas();
    });

    const canvas = document.getElementById('sm-canvas');
    canvas.addEventListener('click', function (e) {
      const node = e.target.closest('.sm-node');
      if (!node) return;
      if (e.target.classList.contains('sm-del')) {
        const id = node.dataset.id;
        if (state.pages.filter(function (p) { return p.home; }).length === 1 && state.pages.find(function (p) { return p.id === id; }).home) { alert('The homepage cannot be deleted — rename it instead.'); return; }
        state.pages = state.pages.filter(function (p) { return p.id !== id; });
        state.links = state.links.filter(function (l) { return l.from !== id && l.to !== id; });
        selectedId = null;
        saveState(); renderCanvas(); return;
      }
      if (window._smLinkMode && linkStart && linkStart !== node.dataset.id) {
        state.links.push({ from: linkStart, to: node.dataset.id });
        linkStart = null; window._smLinkMode = false;
        document.getElementById('sm-links-help').textContent = '✏️ Link mode';
        const hint = document.getElementById('sm-hint');
        if (hint) hint.textContent = 'Click a page, then click another to link them. Drag to move. Double-click to rename. Delete removes.';
        saveState(); renderCanvas(); return;
      }
      if (window._smLinkMode && !linkStart) {
        linkStart = node.dataset.id;
        return;
      }
      selectedId = node.dataset.id;
      renderCanvas();
    });
    canvas.addEventListener('pointermove', function (e) {
      if (linkStart) {
        const rect = canvas.getBoundingClientRect();
        linkPreview = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        renderLinks(canvas);
      }
    });
    canvas.addEventListener('pointerdown', function (e) {
      const node = e.target.closest('.sm-node');
      if (!node || e.target.classList.contains('sm-del')) return;
      e.preventDefault();
      dragPage = node;
      const rect = node.getBoundingClientRect();
      dragPage._offX = e.clientX - rect.left;
      dragPage._offY = e.clientY - rect.top;
      dragPage._startX = Number(node.style.left.replace('px', ''));
      dragPage._startY = Number(node.style.top.replace('px', ''));
      dragPage._mx = e.clientX;
      dragPage._my = e.clientY;
    });
    canvas.addEventListener('dblclick', function (e) {
      const node = e.target.closest('.sm-node');
      if (!node) return;
      const page = state.pages.find(function (p) { return p.id === node.dataset.id; });
      if (!page) return;
      const label = prompt('Page label:', page.label);
      if (label == null) return;
      page.label = label.trim() || page.label;
      const note = prompt('Page note (what this page includes / which requirement it meets):', page.note || '');
      if (note != null) page.note = note.trim();
      saveState(); renderCanvas();
    });
    document.addEventListener('pointermove', function (e) {
      if (!dragPage) return;
      const page = state.pages.find(function (p) { return p.id === dragPage.dataset.id; });
      if (!page) return;
      const dx = e.clientX - dragPage._mx, dy = e.clientY - dragPage._my;
      const nx = Math.max(10, Math.round((dragPage._startX + dx) / 10) * 10);
      const ny = Math.max(10, Math.round((dragPage._startY + dy) / 10) * 10);
      page.x = nx; page.y = ny;
      saveState();
      renderCanvas();
    });
    document.addEventListener('pointerup', function () {
      dragPage = null;
    });

    renderCanvas();
  }

  function addPage() {
    const input = document.getElementById('sm-new-label');
    const label = (input.value || '').trim();
    if (!label) return;
    const id = 'p' + Date.now() + Math.random().toString(36).slice(2, 5);
    const nx = 60 + (state.pages.length % 5) * 180;
    const ny = 140 + Math.floor(state.pages.length / 5) * 120;
    state.pages.push({ id: id, label: label, note: '', home: false, x: nx, y: ny });
    input.value = '';
    saveState();
    renderCanvas();
  }

  /* Load a typical site structure so learners can see what a full,
     annotated site map looks like (and use it as a starting point). */
  function loadExample() {
    if (state.pages.length > 1 && !confirm('Replace the current sitemap with the example?')) return;
    var pages = [
      { id: 'home', label: 'Homepage', note: 'Hero banner + featured sections', home: true },
      { id: 'about', label: 'About us', note: 'Who the organisation is' },
      { id: 'services', label: 'Products / Services', note: 'Card grid + search' },
      { id: 'gallery', label: 'Gallery', note: 'Modal images + video' },
      { id: 'events', label: 'Events & News', note: 'Upcoming events list' },
      { id: 'contact', label: 'Contact us', note: 'Enquiry form + map' },
      { id: 'legal', label: 'Legal / Privacy', note: 'Privacy policy (GDPR)' }
    ];
    var links = [
      { from: 'home', to: 'about' }, { from: 'home', to: 'services' },
      { from: 'home', to: 'gallery' }, { from: 'home', to: 'events' },
      { from: 'home', to: 'contact' }, { from: 'contact', to: 'legal' }
    ];
    state.pages = pages;
    state.links = links;
    state.annotations = 'Homepage \u2014 hero + accordion (meets: accordion, responsive nav). About us \u2014 image + text (meets: client tone). Products / Services \u2014 card grid + search (meets: search, accordion). Gallery \u2014 modal images (meets: modal images, video). Events & News \u2014 events list (meets: content updates). Contact us \u2014 form + map (meets: form, map). Legal / Privacy \u2014 privacy policy (meets: GDPR / legal).';
    saveState();
    autoArrange();
  }

  function autoArrange() {
    // Hierarchical tree layout: homepage at the top, then levels by
    // distance from the homepage following the links.
    var home = state.pages.find(function (p) { return p.home; }) || state.pages[0];
    if (!home) return;
    var level = {}; level[home.id] = 0;
    var queue = [home.id];
    while (queue.length) {
      var cur = queue.shift();
      state.links.forEach(function (l) {
        if (l.from === cur && level[l.to] === undefined) { level[l.to] = level[cur] + 1; queue.push(l.to); }
        if (l.to === cur && level[l.from] === undefined) { level[l.from] = level[cur] + 1; queue.push(l.from); }
      });
    }
    state.pages.forEach(function (p) { if (level[p.id] === undefined) level[p.id] = 1; });
    var byLevel = {};
    state.pages.forEach(function (p) { (byLevel[level[p.id]] = byLevel[level[p.id]] || []).push(p); });
    var rowH = 130, colW = 220, maxLevel = Math.max.apply(null, Object.keys(byLevel).map(Number));
    Object.keys(byLevel).forEach(function (lv) {
      var items = byLevel[lv];
      var l = Number(lv);
      var totalW = items.length * colW;
      var startX = Math.max(20, (960 - totalW) / 2);
      items.forEach(function (p, i) {
        p.x = startX + i * colW;
        p.y = 40 + l * rowH;
      });
    });
    // Reposition home centred above its children
    if (home) { home.x = 40 + ((byLevel[1] ? byLevel[1].length : 1) * colW) / 2 - 95; home.y = 30; }
    // Rebuild links as a tree from home to every other page
    var newLinks = [];
    var others = state.pages.filter(function (p) { return p.id !== home.id; });
    others.forEach(function (p) {
      // Link each page to the nearest page already linked at a higher level
      var parents = state.pages.filter(function (q) { return q.id !== p.id && (level[q.id] === level[p.id] - 1); });
      var parent = parents[0] || home;
      newLinks.push({ from: parent.id, to: p.id });
    });
    state.links = newLinks;
    saveState();
    renderCanvas();
  }

  function renderCanvas() {
    const canvas = document.getElementById('sm-canvas');
    if (!canvas) return;
    canvas.innerHTML = '';
    canvas.style.minHeight = '460px';
    state.pages.forEach(function (p) {
      const node = document.createElement('div');
      node.className = 'sm-node' + (p.home ? ' home' : '') + (p.id === selectedId ? ' selected' : '');
      node.dataset.id = p.id;
      node.style.left = p.x + 'px';
      node.style.top = p.y + 'px';
      node.innerHTML = '<div class="sm-label">' + esc(p.label) + '</div>' +
        (p.note ? '<div class="sm-page-note">' + esc(p.note) + '</div>' : '') +
        (p.home ? '<div class="sm-note">&#9733; start here</div>' : '') +
        '<span class="sm-del" title="Delete">&#10005;</span>';
      canvas.appendChild(node);
    });
    if (!state.pages.length) {
      const hint = document.createElement('div');
      hint.className = 'wf-empty-hint';
      hint.textContent = 'Add pages to begin. Use Link mode to draw navigation between pages.';
      canvas.appendChild(hint);
    }
    renderLinks(canvas);
  }

  function exportSvg() {
    const w = 960, h = 620;
    let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">';
    svg += '<rect width="' + w + '" height="' + h + '" fill="#ffffff"/>';
    state.links.forEach(function (l) {
      const a = state.pages.find(function (p) { return p.id === l.from; });
      const b = state.pages.find(function (p) { return p.id === l.to; });
      if (!a || !b) return;
      const ca = pageCenter(a), cb = pageCenter(b);
      const angle = Math.atan2(cb.y - ca.y, cb.x - ca.x);
      const ax = cb.x - 18 * Math.cos(angle), ay = cb.y - 18 * Math.sin(angle);
      svg += '<line x1="' + ca.x + '" y1="' + ca.y + '" x2="' + cb.x + '" y2="' + cb.y + '" stroke="#4a7de0" stroke-width="2" stroke-dasharray="6 4"/>';
      svg += '<polygon points="' + [
        (ax + 8 * Math.cos(angle + Math.PI * 0.85)) + ',' + (ay + 8 * Math.sin(angle + Math.PI * 0.85)),
        (ax + 8 * Math.cos(angle - Math.PI * 0.85)) + ',' + (ay + 8 * Math.sin(angle - Math.PI * 0.85)),
        cb.x + ',' + cb.y
      ].join(' ') + '" fill="#4a7de0"/>';
    });
    state.pages.forEach(function (p) {
      const h = p.note ? 78 : 64;
      svg += '<rect x="' + p.x + '" y="' + p.y + '" width="190" height="' + h + '" rx="10" fill="' + (p.home ? '#ccf2ee' : '#eef4ff') + '" stroke="' + (p.home ? '#0f766e' : '#4a7de0') + '" stroke-width="2"/>';
      svg += '<text x="' + (p.x + 95) + '" y="' + (p.y + 26) + '" text-anchor="middle" font-family="Satoshi,sans-serif" font-size="13" font-weight="700" fill="#101828">' + esc(p.label) + '</text>';
      if (p.note) svg += '<text x="' + (p.x + 95) + '" y="' + (p.y + 44) + '" text-anchor="middle" font-family="Satoshi,sans-serif" font-size="10" fill="#475569">' + esc(p.note) + '</text>';
      if (p.home) svg += '<text x="' + (p.x + 95) + '" y="' + (p.y + (p.note ? 60 : 50)) + '" text-anchor="middle" font-family="Satoshi,sans-serif" font-size="10" fill="#0f766e">&#9733; start here</text>';
    });
    svg += '</svg>';
    downloadBlob(svg, 'image/svg+xml;charset=utf-8', 'sitemap.svg');
  }

  function exportPng() {
    const svgString = (function () {
      const w = 960, h = 620;
      let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">';
      svg += '<rect width="' + w + '" height="' + h + '" fill="#ffffff"/>';
      state.links.forEach(function (l) {
        const a = state.pages.find(function (p) { return p.id === l.from; });
        const b = state.pages.find(function (p) { return p.id === l.to; });
        if (!a || !b) return;
        const ca = pageCenter(a), cb = pageCenter(b);
        const angle = Math.atan2(cb.y - ca.y, cb.x - ca.x);
        const ax = cb.x - 18 * Math.cos(angle), ay = cb.y - 18 * Math.sin(angle);
        svg += '<line x1="' + ca.x + '" y1="' + ca.y + '" x2="' + cb.x + '" y2="' + cb.y + '" stroke="#4a7de0" stroke-width="2" stroke-dasharray="6 4"/>';
        svg += '<polygon points="' + [
          (ax + 8 * Math.cos(angle + Math.PI * 0.85)) + ',' + (ay + 8 * Math.sin(angle + Math.PI * 0.85)),
          (ax + 8 * Math.cos(angle - Math.PI * 0.85)) + ',' + (ay + 8 * Math.sin(angle - Math.PI * 0.85)),
          cb.x + ',' + cb.y
        ].join(' ') + '" fill="#4a7de0"/>';
      });
      state.pages.forEach(function (p) {
        const h = p.note ? 78 : 64;
        svg += '<rect x="' + p.x + '" y="' + p.y + '" width="190" height="' + h + '" rx="10" fill="' + (p.home ? '#ccf2ee' : '#eef4ff') + '" stroke="' + (p.home ? '#0f766e' : '#4a7de0') + '" stroke-width="2"/>';
        svg += '<text x="' + (p.x + 95) + '" y="' + (p.y + 26) + '" text-anchor="middle" font-family="Satoshi,sans-serif" font-size="13" font-weight="700" fill="#101828">' + esc(p.label) + '</text>';
        if (p.note) svg += '<text x="' + (p.x + 95) + '" y="' + (p.y + 44) + '" text-anchor="middle" font-family="Satoshi,sans-serif" font-size="10" fill="#475569">' + esc(p.note) + '</text>';
        if (p.home) svg += '<text x="' + (p.x + 95) + '" y="' + (p.y + (p.note ? 60 : 50)) + '" text-anchor="middle" font-family="Satoshi,sans-serif" font-size="10" fill="#0f766e">&#9733; start here</text>';
      });
      svg += '</svg>';
      return svg;
    })();
    const url = URL.createObjectURL(new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' }));
    const img = new Image();
    img.onload = function () {
      const c = document.createElement('canvas');
      c.width = 1920; c.height = 1240;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, 1920, 1240);
      const a = document.createElement('a');
      a.href = c.toDataURL('image/png');
      a.download = 'sitemap.png';
      a.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function downloadBlob(content, mime, filename) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  document.addEventListener('keydown', function (e) {
    if (!selectedId) return;
    if (e.key === 'Delete' || e.key === 'Backspace') {
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      e.preventDefault();
      const page = state.pages.find(function (p) { return p.id === selectedId; });
      if (page && page.home) { alert('The homepage cannot be deleted.'); return; }
      state.pages = state.pages.filter(function (p) { return p.id !== selectedId; });
      state.links = state.links.filter(function (l) { return l.from !== selectedId && l.to !== selectedId; });
      selectedId = null;
      saveState(); renderCanvas();
    }
  });

  window.initSitemapTool = function () {
    state = loadState();
    render();
  };
})();