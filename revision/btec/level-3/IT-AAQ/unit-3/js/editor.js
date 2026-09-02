/* Code Editor — VS Code / Dreamweaver style HTML·CSS·JS editor.
   - VS Code (dark) and Dreamweaver (light) themes, user-selectable
   - Explorer sidebar + tabs + status bar (Ln/Col, save state)
   - Layouts: editor-only, split (editor+preview), preview-only
   - Live preview with desktop/tablet/mobile frame
   - Cloud autosave (Supabase, <1MB) + local folder + download + templates
*/
(function () {
  'use strict';

  const SB_URL = 'https://tcrrgsylxbyyrmnouihl.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcnJnc3lseGJ5eXJtbm91aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODUyMTEsImV4cCI6MjA5MzQ2MTIxMX0.eOp6ma-mfgh8F20nM7E2OaBW28LlZlwuEEWr6k2zDWw';

  const DEFAULT_FILES = {
    'index.html': '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My Website</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <header>\n    <h1>My Website</h1>\n    <nav>\n      <a href="#home">Home</a>\n      <a href="#about">About</a>\n      <a href="#contact">Contact</a>\n    </nav>\n  </header>\n  <main>\n    <h2 id="home">Welcome!</h2>\n    <p>Start building your website here.</p>\n    <button id="demo-btn">Click me</button>\n  </main>\n  <footer>\n    <p>&copy; 2026 My Website</p>\n  </footer>\n  <script src="script.js"><\/script>\n</body>\n</html>\n',
    'style.css': ':root { --brand: #0f766e; }\nbody { font-family: sans-serif; margin: 0; color: #222; line-height: 1.6; }\nheader { background: var(--brand); color: #fff; padding: 16px 24px; }\nnav a { color: #fff; margin-right: 12px; text-decoration: none; }\nmain { padding: 24px; max-width: 800px; }\nbutton { padding: 8px 16px; border: none; border-radius: 6px; background: var(--brand); color: #fff; cursor: pointer; }\n@media (max-width: 600px) { header { text-align: center; } main { padding: 16px; } }\n',
    'script.js': 'const btn = document.getElementById("demo-btn");\nif (btn) {\n  btn.addEventListener("click", function () {\n    alert("Hello from script.js!");\n  });\n}\n'
  };

  const TEMPLATES = {
    'Accordion': {
      'index.html': '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Accordion</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>FAQs</h1>\n  <div class="accordion">\n    <button class="acc-item" type="button"><span class="acc-title">Question one?</span><span class="acc-icon">+</span></button>\n    <div class="acc-panel">Answer to question one.</div>\n    <button class="acc-item" type="button"><span class="acc-title">Question two?</span><span class="acc-icon">+</span></button>\n    <div class="acc-panel">Answer to question two.</div>\n  </div>\n  <script src="script.js"><\/script>\n</body>\n</html>\n',
      'style.css': 'body { font-family: sans-serif; max-width: 640px; margin: 40px auto; padding: 0 16px; }\n.accordion { border: 1px solid #ddd; border-radius: 10px; overflow: hidden; }\n.acc-item { display: flex; justify-content: space-between; width: 100%; background: #f6f8fb; border: none; border-bottom: 1px solid #ddd; padding: 14px 16px; font: inherit; font-weight: 700; cursor: pointer; }\n.acc-panel { display: none; padding: 12px 16px; }\n.acc-panel.open { display: block; }\n',
      'script.js': 'const items = document.querySelectorAll(".acc-item");\nitems.forEach(function (btn) {\n  btn.addEventListener("click", function () {\n    const panel = btn.nextElementSibling;\n    const open = panel.classList.contains("open");\n    document.querySelectorAll(".acc-panel").forEach(function (p) { p.classList.remove("open"); });\n    document.querySelectorAll(".acc-icon").forEach(function (i) { i.textContent = "+"; });\n    if (!open) { panel.classList.add("open"); btn.querySelector(".acc-icon").textContent = "\\u2212"; }\n  });\n});\n'
    },
    'Modal / lightbox': {
      'index.html': '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Modal</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Gallery</h1>\n  <div class="gallery">\n    <img src="https://placehold.co/160x110/0f766e/fff?text=Photo+1" alt="Photo 1" class="gallery-img">\n    <img src="https://placehold.co/160x110/33405d/fff?text=Photo+2" alt="Photo 2" class="gallery-img">\n  </div>\n  <div class="modal hidden" id="modal">\n    <button class="modal-close" aria-label="Close">&times;</button>\n    <img src="" alt="" class="modal-img" id="modal-img">\n  </div>\n  <script src="script.js"><\/script>\n</body>\n</html>\n',
      'style.css': 'body { font-family: sans-serif; max-width: 800px; margin: 40px auto; padding: 0 16px; }\n.gallery { display: flex; gap: 10px; flex-wrap: wrap; }\n.gallery-img { cursor: pointer; border-radius: 8px; }\n.modal { position: fixed; inset: 0; background: rgba(0,0,0,.8); display: flex; align-items: center; justify-content: center; z-index: 100; }\n.modal.hidden { display: none; }\n.modal-img { max-width: 90%; max-height: 85vh; border-radius: 8px; }\n.modal-close { position: absolute; top: 16px; right: 24px; background: none; border: none; color: #fff; font-size: 2rem; cursor: pointer; }\n',
      'script.js': 'const modal = document.getElementById("modal");\nconst modalImg = document.getElementById("modal-img");\ndocument.querySelectorAll(".gallery-img").forEach(function (img) {\n  img.addEventListener("click", function () {\n    modalImg.src = img.src;\n    modalImg.alt = img.alt;\n    modal.classList.remove("hidden");\n  });\n});\ndocument.querySelector(".modal-close").addEventListener("click", function () {\n  modal.classList.add("hidden");\n});\nmodal.addEventListener("click", function (e) { if (e.target === modal) modal.classList.add("hidden"); });\n'
    },
    'Filter / search list': {
      'index.html': '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Filter</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Explore Eras</h1>\n  <div class="filters">\n    <button class="filter-btn active" data-filter="all">All</button>\n    <button class="filter-btn" data-filter="music">Music</button>\n    <button class="filter-btn" data-filter="film">Film</button>\n    <button class="filter-btn" data-filter="games">Games</button>\n  </div>\n  <div class="cards">\n    <div class="card" data-cat="music">Vinyl records</div>\n    <div class="card" data-cat="film">Classic posters</div>\n    <div class="card" data-cat="games">Arcade cabinets</div>\n    <div class="card" data-cat="music">Live recordings</div>\n  </div>\n  <script src="script.js"><\/script>\n</body>\n</html>\n',
      'style.css': 'body { font-family: sans-serif; max-width: 800px; margin: 40px auto; padding: 0 16px; }\n.filters { display: flex; gap: 8px; margin-bottom: 16px; }\n.filter-btn { padding: 8px 14px; border: 1px solid #ddd; border-radius: 999px; background: #fff; cursor: pointer; font: inherit; }\n.filter-btn.active { background: #0f766e; color: #fff; border-color: #0f766e; }\n.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; }\n.card { border: 1px solid #ddd; border-radius: 10px; padding: 20px; text-align: center; }\n.card.hidden { display: none; }\n',
      'script.js': 'const buttons = document.querySelectorAll(".filter-btn");\nconst cards = document.querySelectorAll(".card");\nbuttons.forEach(function (btn) {\n  btn.addEventListener("click", function () {\n    buttons.forEach(function (b) { b.classList.remove("active"); });\n    btn.classList.add("active");\n    const filter = btn.dataset.filter;\n    cards.forEach(function (card) {\n      card.classList.toggle("hidden", filter !== "all" && card.dataset.cat !== filter);\n    });\n  });\n});\n'
    }
  };

  let files = {};
  let activeFile = 'index.html';
  let openTabs = [];
  let dirHandle = null;
  let autosaveTimer = null;
  let cloudEnabled = false;
  let layout = 'split';
  let theme = localStorage.getItem('ra10_u3_editor_theme') || 'vscode';
  let previewDevice = 'desktop';

  function fileLang(n) { return n.endsWith('.css') ? 'css' : n.endsWith('.js') ? 'js' : 'html'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function sbClient() {
    if (!window.supabase) return null;
    const session = window.RA10 ? RA10.getSession() : null;
    return window.supabase.createClient(SB_URL, SB_KEY, {
      global: { headers: { Authorization: 'Bearer ' + (session && session.access_token || '') } }
    });
  }
  function projectSize() { try { return new Blob([JSON.stringify(files)]).size; } catch (e) { return 0; } }

  function setSaveState(text, cls) {
    const el = document.getElementById('ed-save-state');
    if (!el) return;
    el.textContent = text || '';
    el.className = 'ed-save-state' + (cls ? ' ' + cls : '');
  }

  /* ── Cloud ──────────────────────────────────────────────── */
  async function cloudLoad() {
    if (!window.RA10 || !RA10.isLoggedIn()) return false;
    try {
      const client = sbClient();
      if (!client) return false;
      const session = RA10.getSession();
      const { data, error } = await client.from('unit3_projects').select('files, active_file').eq('user_id', session.user.id).maybeSingle();
      if (error || !data) return false;
      if (data.files && typeof data.files === 'object' && Object.keys(data.files).length) {
        files = data.files;
        openTabs = Object.keys(files).slice(0, 8);
        activeFile = data.active_file && files[data.active_file] ? data.active_file : openTabs[0];
        cloudEnabled = true;
        setSaveState('Cloud project loaded ✓');
        return true;
      }
      return false;
    } catch (e) { console.warn('cloudLoad error', e); return false; }
  }

  async function cloudSave() {
    if (!cloudEnabled || !window.RA10 || !RA10.isLoggedIn()) return false;
    if (projectSize() > 1024 * 1024) { setSaveState('Over 1MB — compress images first', 'offline'); return false; }
    try {
      const client = sbClient();
      if (!client) return false;
      const session = RA10.getSession();
      const { error } = await client.from('unit3_projects').upsert({ user_id: session.user.id, files: files, active_file: activeFile });
      if (error) { console.warn('cloudSave error', error); setSaveState('Save failed — try again', 'offline'); return false; }
      setSaveState('Saved to cloud ' + new Date().toLocaleTimeString());
      return true;
    } catch (e) { console.warn('cloudSave error', e); setSaveState('Save failed — try again', 'offline'); return false; }
  }

  function queueAutosave() {
    clearTimeout(autosaveTimer);
    setSaveState(cloudEnabled ? 'Saving…' : 'Local draft — enable cloud save', 'saving');
    autosaveTimer = setTimeout(function () {
      if (cloudEnabled) cloudSave();
      else setSaveState('Saved locally ' + new Date().toLocaleTimeString());
    }, 800);
  }

  function backupLocal() { try { localStorage.setItem('ra10_u3_editor_backup', JSON.stringify(files)); } catch (e) {} }

  function enableCloud() {
    if (!window.RA10 || !RA10.isLoggedIn()) {
      if (window.RA10 && typeof RA10.showPaywall === 'function') RA10.showPaywall('account', 'cloud_save');
      else alert('Sign in to save to the cloud.');
      return;
    }
    cloudEnabled = true;
    backupLocal();
    queueAutosave();
    renderStatus();
  }

  async function connectLocalFolder() {
    if (!window.showDirectoryPicker) { setSaveState('Local folders need Chrome/Edge', 'offline'); return; }
    try {
      dirHandle = await window.showDirectoryPicker();
      files = {};
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file' && /\.(html?|css|js)$/i.test(entry.name)) {
          const f = await entry.getFile();
          files[entry.name] = await f.text();
        }
      }
      if (Object.keys(files).length) {
        cloudEnabled = false;
        openTabs = Object.keys(files).slice(0, 8);
        activeFile = Object.keys(files)[0];
        setSaveState('Connected: ' + dirHandle.name);
        renderAll();
      } else setSaveState('No HTML/CSS/JS files in that folder', 'offline');
    } catch (e) { /* cancelled */ }
  }

  function downloadProject() {
    Object.keys(files).forEach(function (name) {
      const a = document.createElement('a');
      const type = fileLang(name) === 'css' ? 'text/css' : fileLang(name) === 'js' ? 'text/javascript' : 'text/html';
      a.href = URL.createObjectURL(new Blob([files[name]], { type: type }));
      a.download = name;
      a.click();
    });
    setSaveState('Downloaded ' + Object.keys(files).length + ' file(s)');
  }

  /* ── Files / tabs ───────────────────────────────────────── */
  function renderFiles() {
    const host = document.getElementById('ed-files');
    if (!host) return;
    host.innerHTML = Object.keys(files).sort().map(function (name) {
      const icon = fileLang(name) === 'css' ? '🎨' : fileLang(name) === 'js' ? '⚡' : '📄';
      return '<div class="ed-file' + (name === activeFile ? ' active' : '') + '" data-file="' + esc(name) + '">' +
        '<span class="ed-file-icon">' + icon + '</span><span class="ed-file-name">' + esc(name) + '</span>' +
        '<span class="ed-file-del" data-del="' + esc(name) + '" title="Delete">✕</span></div>';
    }).join('') || '<div class="ed-empty muted">No files yet</div>';
    host.querySelectorAll('.ed-file').forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (e.target.classList.contains('ed-file-del')) return;
        openFile(el.getAttribute('data-file'));
      });
    });
    host.querySelectorAll('.ed-file-del').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        const name = el.getAttribute('data-del');
        if (!confirm('Delete ' + name + '?')) return;
        delete files[name];
        openTabs = openTabs.filter(function (t) { return t !== name; });
        if (activeFile === name) activeFile = Object.keys(files)[0];
        renderAll();
        queueAutosave();
      });
    });
  }

  function renderTabs() {
    const host = document.getElementById('ed-tabs');
    if (!host) return;
    host.innerHTML = openTabs.map(function (name) {
      if (!files[name]) return '';
      const icon = fileLang(name) === 'css' ? '🎨' : fileLang(name) === 'js' ? '⚡' : '📄';
      return '<div class="ed-tab' + (name === activeFile ? ' active' : '') + '" data-tab="' + esc(name) + '">' +
        '<span class="ed-file-icon">' + icon + '</span>' + esc(name) +
        '<span class="ed-tab-close" data-close="' + esc(name) + '">✕</span></div>';
    }).join('');
    host.querySelectorAll('.ed-tab').forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (e.target.classList.contains('ed-tab-close')) return;
        openFile(el.getAttribute('data-tab'));
      });
    });
    host.querySelectorAll('.ed-tab-close').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        const name = el.getAttribute('data-close');
        openTabs = openTabs.filter(function (t) { return t !== name; });
        if (activeFile === name) activeFile = openTabs[openTabs.length - 1] || Object.keys(files)[0];
        renderTabs(); renderEditor(); renderStatus();
      });
    });
  }

  function openFile(name) {
    if (!files[name]) return;
    activeFile = name;
    if (!openTabs.includes(name)) {
      openTabs.push(name);
      if (openTabs.length > 10) openTabs.shift();
    }
    renderFiles(); renderTabs(); renderEditor(); renderStatus();
  }

  function addFile() {
    const input = document.getElementById('ed-new-file');
    const name = ((input && input.value) || '').trim();
    if (!name || files[name]) { if (input) input.value = ''; return; }
    files[name] = fileLang(name) === 'js' ? '// new script\n' : fileLang(name) === 'css' ? '/* new styles */\n' : '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>' + name + '</title>\n</head>\n<body>\n  <h1>' + name + '</h1>\n</body>\n</html>\n';
    if (input) input.value = '';
    openFile(name);
    queueAutosave();
  }

  /* ── Editor ─────────────────────────────────────────────── */
  function renderEditor() {
    const host = document.getElementById('ed-code-area');
    if (!host) return;
    host.dataset.theme = theme;
    host.innerHTML = '<div class="ed-gutter" id="ed-gutter"></div>' +
      '<textarea id="ed-code" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Code editor"></textarea>';
    const ta = document.getElementById('ed-code');
    ta.value = files[activeFile] || '';
    ta.addEventListener('input', function () {
      files[activeFile] = ta.value;
      updateGutter();
      updatePreview();
      queueAutosave();
    });
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        const s = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + '  ' + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 2;
        files[activeFile] = ta.value;
        updateGutter(); updatePreview(); queueAutosave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (cloudEnabled) cloudSave(); else queueAutosave();
      }
    });
    ta.addEventListener('click', updateStatus);
    ta.addEventListener('keyup', updateStatus);
    updateGutter();
    updatePreview();
    updateStatus();
  }

  function updateGutter() {
    const ta = document.getElementById('ed-code');
    const gutter = document.getElementById('ed-gutter');
    if (!ta || !gutter) return;
    const count = ta.value.split('\n').length;
    let html = '';
    for (let i = 1; i <= count; i++) html += '<div class="ed-gutter-line">' + i + '</div>';
    gutter.innerHTML = html;
  }

  function updateStatus() {
    const ta = document.getElementById('ed-code');
    const fileEl = document.getElementById('ed-status-file');
    const posEl = document.getElementById('ed-status-pos');
    if (fileEl) fileEl.textContent = (files[activeFile] ? activeFile + ' · ' + fileLang(activeFile).toUpperCase() : 'No file');
    if (ta && posEl) {
      const upTo = ta.value.slice(0, ta.selectionStart).split('\n');
      posEl.textContent = 'Ln ' + upTo.length + ', Col ' + (upTo[upTo.length - 1].length + 1);
    }
  }

  function updatePreview() {
    const frame = document.getElementById('ed-preview-frame');
    if (!frame) return;
    let doc = files['index.html'] || '<!DOCTYPE html><html><body><p>Create index.html to preview.</p></body></html>';
    doc = doc.replace(/<link[^>]*href=["']([^"']+\.css)["'][^>]*>/gi, function (m, f) {
      return files[f] != null ? '<style>' + files[f] + '</style>' : m;
    });
    doc = doc.replace(/<script[^>]*src=["']([^"']+\.js)["'][^>]*><\/script>/gi, function (m, f) {
      return files[f] != null ? '<script>try{\n' + files[f] + '\n}catch(e){console.error(e)}<\/script>' : m;
    });
    doc = doc.replace('</head>', '<style>' + (files['style.css'] || '') + '</style></head>');
    doc = doc.replace('</body>', '<script>try{\n' + (files['script.js'] || '') + '\n}catch(e){console.error(e)}<\/script></body>');
    frame.srcdoc = doc;
  }

  /* ── Top-level render ───────────────────────────────────── */
  function renderStatus() {
    const host = document.getElementById('ed-status');
    if (!host) return;
    host.innerHTML =
      '<span id="ed-status-file">' + (activeFile ? esc(activeFile) + ' · ' + fileLang(activeFile).toUpperCase() : 'No file') + '</span>' +
      '<span id="ed-status-pos">Ln 1, Col 1</span>' +
      '<span class="ed-spacer"></span>' +
      '<span class="ed-save-state" id="ed-save-state"></span>' +
      '<span class="ed-status-mode">' + (cloudEnabled ? '☁ Cloud autosave' : dirHandle ? '📁 Local folder' : '💾 Local draft') + '</span>';
    if (document.getElementById('ed-save-state')) setSaveState(cloudEnabled ? 'Cloud autosave on' : 'Local draft');
  }

  function renderTemplates() {
    const host = document.getElementById('ed-template-buttons');
    if (!host) return;
    host.innerHTML = Object.keys(TEMPLATES).map(function (name) {
      return '<button class="btn" data-tpl="' + esc(name) + '">' + esc(name) + '</button>';
    }).join('');
    host.querySelectorAll('[data-tpl]').forEach(function (b) {
      b.addEventListener('click', function () {
        files = JSON.parse(JSON.stringify(TEMPLATES[b.getAttribute('data-tpl')]));
        openTabs = Object.keys(files);
        activeFile = 'index.html';
        renderAll();
        document.getElementById('ed-template-picker').classList.add('hidden');
        setSaveState('Template loaded');
        queueAutosave();
      });
    });
  }

  function renderAll() {
    renderFiles();
    renderTabs();
    renderEditor();
    renderStatus();
  }

  window.initCodeEditor = async function () {
    const host = document.getElementById('ed-app');
    if (!host) return;
    if (!Object.keys(files).length) {
      try {
        const b = JSON.parse(localStorage.getItem('ra10_u3_editor_backup') || 'null');
        if (b && Object.keys(b).length) files = b;
      } catch (e) {}
    }
    if (!Object.keys(files).length) files = JSON.parse(JSON.stringify(DEFAULT_FILES));
    openTabs = Object.keys(files).slice(0, 10);
    activeFile = openTabs[0] || 'index.html';

    host.className = 'ed-app ed-theme-' + theme;
    host.innerHTML =
      '<div class="ed-topbar">' +
      '  <span class="ed-logo">λ</span><span class="ed-title">RA10 Web Studio</span>' +
      '  <span class="ed-spacer"></span>' +
      '  <button class="ed-btn" id="ed-btn-folder" title="Open local folder">📁 Folder</button>' +
      '  <button class="ed-btn" id="ed-btn-cloud" title="Cloud autosave (sign in)">☁ Cloud</button>' +
      '  <button class="ed-btn" id="ed-btn-templates" title="Insert a component">＋ Component</button>' +
      '  <button class="ed-btn" id="ed-btn-download" title="Download all files">⬇ Download</button>' +
      '  <span class="ed-sep"></span>' +
      '  <span class="ed-label">Device</span>' +
      '  <button class="ed-dev' + (previewDevice === 'desktop' ? ' active' : '') + '" data-dev="desktop" title="Desktop">🖥</button>' +
      '  <button class="ed-dev' + (previewDevice === 'tablet' ? ' active' : '') + '" data-dev="tablet" title="Tablet">📱</button>' +
      '  <button class="ed-dev' + (previewDevice === 'mobile' ? ' active' : '') + '" data-dev="mobile" title="Mobile">📲</button>' +
      '  <span class="ed-sep"></span>' +
      '  <span class="ed-label">Layout</span>' +
      '  <button class="ed-layout-btn' + (layout === 'editor' ? ' active' : '') + '" data-layout="editor" title="Editor only">✏</button>' +
      '  <button class="ed-layout-btn' + (layout === 'split' ? ' active' : '') + '" data-layout="split" title="Editor + preview">☷</button>' +
      '  <button class="ed-layout-btn' + (layout === 'preview' ? ' active' : '') + '" data-layout="preview" title="Preview only">✓</button>' +
      '  <span class="ed-sep"></span>' +
      '  <span class="ed-label">Style</span>' +
      '  <button class="ed-theme-btn' + (theme === 'vscode' ? ' active' : '') + '" data-theme="vscode">VS Code</button>' +
      '  <button class="ed-theme-btn' + (theme === 'dreamweaver' ? ' active' : '') + '" data-theme="dreamweaver">Dreamweaver</button>' +
      '</div>' +
      '<div class="ed-body">' +
      '  <div class="ed-sidebar">' +
      '    <div class="ed-sidebar-title">EXPLORER</div>' +
      '    <div class="ed-files" id="ed-files"></div>' +
      '    <div class="ed-new-file">' +
      '      <input id="ed-new-file" placeholder="new-page.html">' +
      '      <button id="ed-new-file-btn" title="Add file">＋</button>' +
      '    </div>' +
      '  </div>' +
      '  <div class="ed-main">' +
      '    <div class="ed-tabs" id="ed-tabs"></div>' +
      '    <div class="ed-panes ed-layout-' + layout + '" id="ed-panes">' +
      '      <div class="ed-pane" id="ed-code-pane"><div class="ed-code-area" id="ed-code-area"></div></div>' +
      '      <div class="ed-splitter" id="ed-splitter"></div>' +
      '      <div class="ed-pane" id="ed-preview-pane">' +
      '        <div class="ed-preview-head"><span>Live preview</span><span class="ed-preview-dev" id="ed-preview-dev"></span></div>' +
      '        <iframe id="ed-preview-frame" title="Website preview" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>' +
      '<div class="ed-status" id="ed-status"></div>' +
      '<div class="ed-template-picker hidden" id="ed-template-picker">' +
      '  <div class="ed-template-picker-hd"><strong>Insert a learning component</strong><button class="ed-x" id="ed-tpl-close">✕</button></div>' +
      '  <div class="ed-template-buttons" id="ed-template-buttons"></div>' +
      '</div>';

    // fix any broken glyphs from escaping
    host.innerHTML = host.innerHTML.replace(/✕/g, '✕');

    bindTop();
    renderTemplates();
    renderAll();

    if (window.RA10 && RA10.isLoggedIn()) {
      const loaded = await cloudLoad();
      if (!loaded) { cloudEnabled = true; await cloudSave(); renderStatus(); }
    }
  };

  function bindTop() {
    document.getElementById('ed-btn-folder').addEventListener('click', connectLocalFolder);
    document.getElementById('ed-btn-cloud').addEventListener('click', enableCloud);
    document.getElementById('ed-btn-download').addEventListener('click', downloadProject);
    document.getElementById('ed-btn-templates').addEventListener('click', function () {
      document.getElementById('ed-template-picker').classList.toggle('hidden');
    });
    document.getElementById('ed-tpl-close').addEventListener('click', function () {
      document.getElementById('ed-template-picker').classList.add('hidden');
    });
    document.getElementById('ed-new-file').addEventListener('keydown', function (e) { if (e.key === 'Enter') addFile(); });
    document.getElementById('ed-new-file-btn').addEventListener('click', addFile);

    document.querySelectorAll('.ed-dev').forEach(function (b) {
      b.addEventListener('click', function () {
        previewDevice = b.getAttribute('data-dev');
        document.querySelectorAll('.ed-dev').forEach(function (x) { x.classList.toggle('active', x === b); });
        const fr = document.getElementById('ed-preview-frame');
        if (fr) {
          fr.style.maxWidth = previewDevice === 'mobile' ? '375px' : previewDevice === 'tablet' ? '768px' : '100%';
          fr.style.margin = '0 auto';
          fr.style.display = 'block';
        }
        const dev = document.getElementById('ed-preview-dev');
        if (dev) dev.textContent = previewDevice.charAt(0).toUpperCase() + previewDevice.slice(1);
      });
    });
    document.querySelectorAll('.ed-layout-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        layout = b.getAttribute('data-layout');
        document.querySelectorAll('.ed-layout-btn').forEach(function (x) { x.classList.toggle('active', x === b); });
        applyLayout();
      });
    });
    document.querySelectorAll('.ed-theme-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        theme = b.getAttribute('data-theme');
        localStorage.setItem('ra10_u3_editor_theme', theme);
        document.querySelectorAll('.ed-theme-btn').forEach(function (x) { x.classList.toggle('active', x === b); });
        const app = document.getElementById('ed-app');
        if (app) app.className = 'ed-app ed-theme-' + theme;
        const area = document.getElementById('ed-code-area');
        if (area) area.dataset.theme = theme;
      });
    });
  }

  function applyLayout() {
    const panes = document.getElementById('ed-panes');
    if (!panes) return;
    panes.className = 'ed-panes ed-layout-' + layout;
    const splitter = document.getElementById('ed-splitter');
    if (splitter) splitter.style.display = layout === 'split' ? 'block' : 'none';
    const code = document.getElementById('ed-code-pane');
    const prev = document.getElementById('ed-preview-pane');
    if (code) code.style.display = layout === 'preview' ? 'none' : 'flex';
    if (prev) prev.style.display = layout === 'editor' ? 'none' : 'flex';
  }

  // NOTE: window.initCodeEditor assigned above inside initCodeEditor assignment
  // Keep function references stable:
})();