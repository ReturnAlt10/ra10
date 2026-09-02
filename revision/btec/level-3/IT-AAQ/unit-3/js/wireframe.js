/* Wireframe Builder — simple canvas-based wireframe sketch tool.
   Free to use (drawing itself costs nothing); exporting as PNG costs a small credit fee. */
(function () {
  let canvas, ctx;
  let shapes = [];
  let currentTool = 'box';
  let dragging = null;
  let dragOffset = { x: 0, y: 0 };
  const STORAGE_KEY = 'ra10_u3_wireframe_v1';

  const LABELS = {
    box: 'Box', header: 'Header', nav: 'Nav', image: 'Image', text: 'Text lines', button: 'Button', footer: 'Footer',
  };

  function saveLocal() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(shapes)); } catch (e) {}
  }
  function loadLocal() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch (e) { return []; }
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'dark' ? '#1c1c1c' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    shapes.forEach((s) => drawShape(s));
  }

  function drawShape(s) {
    ctx.save();
    ctx.strokeStyle = '#0f766e';
    ctx.lineWidth = 1.6;
    ctx.fillStyle = 'rgba(15,118,110,0.06)';
    ctx.fillRect(s.x, s.y, s.w, s.h);
    ctx.strokeRect(s.x, s.y, s.w, s.h);
    ctx.fillStyle = '#0f766e';
    ctx.font = '11px sans-serif';
    ctx.fillText(LABELS[s.type] || s.type, s.x + 6, s.y + 14);

    if (s.type === 'image') {
      ctx.beginPath();
      ctx.moveTo(s.x + 8, s.y + s.h - 8);
      ctx.lineTo(s.x + s.w * 0.4, s.y + s.h * 0.4);
      ctx.lineTo(s.x + s.w * 0.6, s.y + s.h * 0.65);
      ctx.lineTo(s.x + s.w - 8, s.y + 18);
      ctx.strokeStyle = 'rgba(15,118,110,0.5)';
      ctx.stroke();
    }
    if (s.type === 'text') {
      ctx.strokeStyle = 'rgba(15,118,110,0.45)';
      const lines = Math.max(1, Math.floor((s.h - 20) / 12));
      for (let i = 0; i < lines; i++) {
        const y = s.y + 24 + i * 12;
        if (y > s.y + s.h - 6) break;
        ctx.beginPath();
        ctx.moveTo(s.x + 8, y);
        ctx.lineTo(s.x + s.w - 8 - (i % 3) * 20, y);
        ctx.stroke();
      }
    }
    if (s.type === 'nav') {
      const items = 4;
      for (let i = 0; i < items; i++) {
        const iw = (s.w - 16) / items;
        ctx.strokeRect(s.x + 8 + i * iw, s.y + s.h / 2 - 8, iw - 6, 16);
      }
    }
    if (s.type === 'button') {
      ctx.fillStyle = 'rgba(15,118,110,0.18)';
      ctx.fillRect(s.x, s.y, s.w, s.h);
    }
    ctx.restore();
  }

  function findShapeAt(x, y) {
    for (let i = shapes.length - 1; i >= 0; i--) {
      const s = shapes[i];
      if (x >= s.x && x <= s.x + s.w && y >= s.y && y <= s.y + s.h) return s;
    }
    return null;
  }

  function pointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (cx - rect.left) * (canvas.width / rect.width), y: (cy - rect.top) * (canvas.height / rect.height) };
  }

  function onPointerDown(e) {
    const pos = pointerPos(e);
    const existing = findShapeAt(pos.x, pos.y);
    if (existing) {
      dragging = existing;
      dragOffset = { x: pos.x - existing.x, y: pos.y - existing.y };
      return;
    }
    const shape = { id: 'wf' + Date.now(), type: currentTool, x: pos.x, y: pos.y, w: 160, h: 90 };
    shapes.push(shape);
    dragging = shape;
    dragOffset = { x: 0, y: 0 };
    draw();
  }
  function onPointerMove(e) {
    if (!dragging) return;
    const pos = pointerPos(e);
    dragging.x = pos.x - dragOffset.x;
    dragging.y = pos.y - dragOffset.y;
    draw();
  }
  function onPointerUp() {
    if (dragging) saveLocal();
    dragging = null;
  }

  window.initWireframeTool = function () {
    canvas = document.getElementById('wireframe-canvas');
    if (!canvas || canvas.dataset.inited) { if (canvas) draw(); return; }
    canvas.dataset.inited = '1';
    canvas.width = canvas.clientWidth * 2;
    canvas.height = canvas.clientHeight * 2;
    ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx = canvas.getContext('2d');

    shapes = loadLocal();
    draw();

    canvas.addEventListener('mousedown', onPointerDown);
    canvas.addEventListener('mousemove', onPointerMove);
    canvas.addEventListener('mouseup', onPointerUp);
    canvas.addEventListener('touchstart', onPointerDown, { passive: true });
    canvas.addEventListener('touchmove', onPointerMove, { passive: true });
    canvas.addEventListener('touchend', onPointerUp);

    document.querySelectorAll('.wf-shape-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        currentTool = btn.dataset.shape;
        document.querySelectorAll('.wf-shape-btn').forEach((b) => b.classList.toggle('active', b === btn));
      });
    });
    document.getElementById('wf-clear')?.addEventListener('click', () => {
      if (confirm('Clear the whole wireframe?')) { shapes = []; saveLocal(); draw(); }
    });
    document.getElementById('wf-delete-selected')?.addEventListener('click', () => {
      // remove the most recently added shape (simple UX: last shape acts as "selected")
      shapes.pop();
      saveLocal();
      draw();
    });
    document.getElementById('wf-export')?.addEventListener('click', async () => {
      const ok = await (window.ra10Gate ? ra10Gate('wireframe_export') : Promise.resolve(true));
      if (!ok) return;
      const link = document.createElement('a');
      link.download = 'wireframe.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };
})();
