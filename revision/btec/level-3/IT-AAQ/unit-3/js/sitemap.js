/* Sitemap Builder — drag-and-drop node/tree builder for planning site structure. */
(function () {
  let nodes = [];
  let links = [];
  let dragNode = null;
  let dragOffset = { x: 0, y: 0 };
  let linkFrom = null;
  const STORAGE_KEY = 'ra10_u3_sitemap_v1';

  function saveLocal() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, links })); } catch (e) {}
  }
  function loadLocal() {
    try {
      const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (d && Array.isArray(d.nodes)) return d;
    } catch (e) {}
    return {
      nodes: [{ id: 'home', label: 'Home', x: 380, y: 30, home: true }],
      links: [],
    };
  }

  function render() {
    const wrap = document.getElementById('sitemap-canvas-wrap');
    const svg = document.getElementById('sitemap-svg');
    if (!wrap || !svg) return;
    wrap.querySelectorAll('.sitemap-node').forEach((n) => n.remove());
    svg.innerHTML = '';

    links.forEach((l) => {
      const a = nodes.find((n) => n.id === l.from);
      const b = nodes.find((n) => n.id === l.to);
      if (!a || !b) return;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', a.x + 55);
      line.setAttribute('y1', a.y + 18);
      line.setAttribute('x2', b.x + 55);
      line.setAttribute('y2', b.y + 18);
      line.setAttribute('stroke', '#0f766e');
      line.setAttribute('stroke-width', '2');
      svg.appendChild(line);
    });

    nodes.forEach((n) => {
      const el = document.createElement('div');
      el.className = 'sitemap-node' + (n.home ? ' home' : '');
      el.style.left = n.x + 'px';
      el.style.top = n.y + 'px';
      el.textContent = n.label;
      el.dataset.id = n.id;
      const del = document.createElement('span');
      del.className = 'del-btn';
      del.textContent = '×';
      del.title = 'Delete page';
      del.addEventListener('click', (e) => {
        e.stopPropagation();
        nodes = nodes.filter((x) => x.id !== n.id);
        links = links.filter((l) => l.from !== n.id && l.to !== n.id);
        saveLocal();
        render();
      });
      if (!n.home) el.appendChild(del);

      el.addEventListener('mousedown', (e) => {
        if (e.shiftKey) {
          if (!linkFrom) { linkFrom = n.id; el.style.outline = '2px solid #2563eb'; }
          else if (linkFrom !== n.id) {
            links.push({ from: linkFrom, to: n.id });
            linkFrom = null;
            saveLocal();
            render();
          }
          return;
        }
        dragNode = n;
        const rect = wrap.getBoundingClientRect();
        dragOffset = { x: e.clientX - rect.left - n.x, y: e.clientY - rect.top - n.y };
      });
      wrap.appendChild(el);
    });
  }

  function onMove(e) {
    if (!dragNode) return;
    const wrap = document.getElementById('sitemap-canvas-wrap');
    const rect = wrap.getBoundingClientRect();
    dragNode.x = Math.max(0, e.clientX - rect.left - dragOffset.x);
    dragNode.y = Math.max(0, e.clientY - rect.top - dragOffset.y);
    render();
  }
  function onUp() {
    if (dragNode) saveLocal();
    dragNode = null;
  }

  window.initSitemapTool = function () {
    const wrap = document.getElementById('sitemap-canvas-wrap');
    if (!wrap) return;
    if (!wrap.dataset.inited) {
      wrap.dataset.inited = '1';
      const data = loadLocal();
      nodes = data.nodes;
      links = data.links;
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.getElementById('sm-add-page')?.addEventListener('click', () => {
        const label = prompt('Page name:', 'New Page');
        if (!label) return;
        nodes.push({ id: 'p' + Date.now(), label, x: 120 + Math.random() * 400, y: 140 + Math.random() * 260 });
        saveLocal();
        render();
      });
      document.getElementById('sm-clear')?.addEventListener('click', () => {
        if (confirm('Clear the whole sitemap (keeps Home)?')) {
          nodes = nodes.filter((n) => n.home);
          links = [];
          saveLocal();
          render();
        }
      });
      document.getElementById('sm-export')?.addEventListener('click', async () => {
        const ok = await (window.ra10Gate ? ra10Gate('sitemap_export') : Promise.resolve(true));
        if (!ok) return;
        const rows = nodes.map((n) => n.label).join('\n');
        const linkRows = links.map((l) => {
          const a = nodes.find((x) => x.id === l.from);
          const b = nodes.find((x) => x.id === l.to);
          return (a ? a.label : '?') + ' → ' + (b ? b.label : '?');
        }).join('\n');
        const text = 'SITEMAP\n=======\nPages:\n' + rows + '\n\nConnections:\n' + linkRows;
        const blob = new Blob([text], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'sitemap.txt';
        link.click();
      });
      const hint = document.getElementById('sm-hint');
      if (hint) hint.textContent = 'Tip: hold Shift and click two pages to link them. Drag pages to reposition.';
    }
    render();
  };
})();
