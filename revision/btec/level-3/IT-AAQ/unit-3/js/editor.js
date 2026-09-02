/* BTEC IT Unit 3 Code Editor — HTML/CSS/JS with live preview, cloud autosave (Supabase),
   local folder support (File System Access API), keyboard shortcuts, and component templates. */
(function () {
  'use strict';

  const DEFAULT_FILES = {
    'index.html': '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My Website</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <header>\n    <h1>My Website</h1>\n    <nav>\n      <a href="#home">Home</a>\n      <a href="#about">About</a>\n      <a href="#contact">Contact</a>\n    </nav>\n  </header>\n  <main>\n    <h2 id="home">Welcome!</h2>\n    <p>Start building your website here. Try adding an image, a video, an accordion or a form.</p>\n    <button id="demo-btn">Click me</button>\n  </main>\n  <footer>\n    <p>&copy; 2026 My Website</p>\n  </footer>\n  <script src="script.js"><\/script>\n</body>\n</html>\n',
    'style.css': '/* Style your site here */\nbody {\n  font-family: sans-serif;\n  margin: 0;\n  color: #222;\n  line-height: 1.6;\n}\nheader {\n  background: #0f766e;\n  color: #fff;\n  padding: 16px 24px;\n}\nnav a {\n  color: #fff;\n  margin-right: 12px;\n  text-decoration: none;\n}\nmain {\n  padding: 24px;\n  max-width: 800px;\n}\nbutton {\n  padding: 8px 16px;\n  border: none;\n  border-radius: 6px;\n  background: #0f766e;\n  color: #fff;\n  cursor: pointer;\n}\n@media (max-width: 600px) {\n  header { text-align: center; }\n  main { padding: 16px; }\n}\n',
    'script.js': '// Add interactivity here\nconst btn = document.getElementById("demo-btn");\nif (btn) {\n  btn.addEventListener("click", function () {\n    alert("Hello from script.js!");\n  });\n}\n'
  };

  const TEMPLATES = {
    'Accordion component': {
      'index.html': '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Accordion</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Frequently Asked Questions</h1>\n  <div class="accordion">\n    <button class="acc-item" type="button">\n      <span class="acc-title">Question one?</span>\n      <span class="acc-icon">+</span>\n    </button>\n    <div class="acc-panel">Answer to question one goes here.</div>\n    <button class="acc-item" type="button">\n      <span class="acc-title">Question two?</span>\n      <span class="acc-icon">+</span>\n    </button>\n    <div class="acc-panel">Answer to question two goes here.</div>\n  </div>\n  <script src="script.js"><\/script>\n</body>\n</html>\n',
      'style.css': 'body { font-family: sans-serif; max-width: 640px; margin: 40px auto; padding: 0 16px; }\n.accordion { border: 1px solid #ddd; border-radius: 10px; overflow: hidden; }\n.acc-item { display: flex; justify-content: space-between; align-items: center; width: 100%; background: #f6f8fb; border: none; border-bottom: 1px solid #ddd; padding: 14px 16px; font: inherit; font-weight: 700; cursor: pointer; }\n.acc-item:hover { background: #eef2f7; }\n.acc-panel { display: none; padding: 12px 16px; }\n.acc-panel.open { display: block; }\n',
      'script.js': 'const items = document.querySelectorAll(".acc-item");\nitems.forEach(function (btn) {\n  btn.addEventListener("click", function () {\n    const panel = btn.nextElementSibling;\n    const open = panel.classList.contains("open");\n    document.querySelectorAll(".acc-panel").forEach(function (p) { p.classList.remove("open"); });\n    document.querySelectorAll(".acc-icon").forEach(function (i) { i.textContent = "+"; });\n    if (!open) { panel.classList.add("open"); btn.querySelector(".acc-icon").textContent = "\\u2212"; }\n  });\n});\n'
    },
    'Modal / lightbox': {
      'index.html': '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Modal</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Image Gallery</h1>\n  <div class="gallery">\n    <img src="https://placehold.co/180x120/0f766e/ffffff?text=Photo+1" alt="Photo 1" class="gallery-img">\n    <img src="https://placehold.co/180x120/33405d/ffffff?text=Photo+2" alt="Photo 2" class="gallery-img">\n  </div>\n  <div class="modal hidden" id="modal">\n    <button class="modal-close" aria-label="Close">&times;</button>\n    <img src="" alt="" class="modal-img" id="modal-img">\n  </div>\n  <script src="script.js"><\/script>\n</body>\n</html>\n',
      'style.css': 'body { font-family: sans-serif; max-width: 800px; margin: 40px auto; padding: 0 16px; }\n.gallery { display: flex; gap: 10px; flex-wrap: wrap; }\n.gallery-img { cursor: pointer; border-radius: 8px; }\n.modal { position: fixed; inset: 0; background: rgba(0,0,0,.8); display: flex; align-items: center; justify-content: center; z-index: 100; }\n.modal.hidden { display: none; }\n.modal-img { max-width: 90%; max-height: 85vh; border-radius: 8px; }\n.modal-close { position: absolute; top: 16px; right: 24px; background: none; border: none; color: #fff; font-size: 2rem; cursor: pointer; }\n',
      'script.js': 'const modal = document.getElementById("modal");\nconst modalImg = document.getElementById("modal-img");\ndocument.querySelectorAll(".gallery-img").forEach(function (img) {\n  img.addEventListener("click", function () {\n    modalImg.src = img.src;\n    modalImg.alt = img.alt;\n    modal.classList.remove("hidden");\n  });\n});\ndocument.querySelector(".modal-close").addEventListener("click", function () {\n  modal.classList.add("hidden");\n});\nmodal.addEventListener("click", function (e) {\n  if (e.target === modal) modal.classList.add("hidden");\n});\n'
    },
    'Filter / search list': {
      'index.html': '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Filter</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Explore Eras</h1>\n  <div class="filters">\n    <button class="filter-btn active" data-filter="all">All</button>\n    <button class="filter-btn" data-filter="music">Music</button>\n    <button class="filter-btn" data-filter="film">Film</button>\n    <button class="filter-btn" data-filter="games">Games</button>\n  </div>\n  <div class="cards">\n    <div class="card" data-cat="music">Vinyl records</div>\n    <div class="card" data-cat="film">Classic posters</div>\n    <div class="card" data-cat="games">Arcade cabinets</div>\n    <div class="card" data-cat="music">Live recordings</div>\n  </div>\n  <script src="script.js"><\/script>\n</body>\n</html>\n',
      'style.css': 'body { font-family: sans-serif; max-width: 800px; margin: 40px auto; padding: 0 16px; }\n.filters { display: flex; gap: 8px; margin-bottom: 16px; }\n.filter-btn { padding: 8px 14px; border: 1px solid #ddd; border-radius: 999px; background: #fff; cursor: pointer; font: inherit; }\n.filter-btn.active { background: #0f766e; color: #fff; border-color: #0f766e; }\n.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; }\n.card { border: 1px solid #ddd; border-radius: 10px; padding: 20px; text-align: center; }\n.card.hidden { display: none; }\n',
      'script.js': 'const buttons = document.querySelectorAll(".filter-btn");\nconst cards = document.querySelectorAll(".card");\nbuttons.forEach(function (btn) {\n  btn.addEventListener("click", function () {\n    buttons.forEach(function (b) { b.classList.remove("active"); });\n    btn.classList.add("active");\n    const filter = btn.dataset.filter;\n    cards.forEach(function (card) {\n      card.classList.toggle("hidden", filter !== "all" && card.dataset.cat !== filter);\n    });\n  });\n});\n'
    }
  };

  const SB_URL = 'https://tcrrgsylxbyyrmnouihl.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcnJnc3lseGJ5eXJtbm91aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODUyMTEsImV4cCI6MjA5MzQ2MTIxMX0.eOp6ma-mfgh8F20nM7E2OaBW28LlZlwuEEWr6k2zDWw';

  let files = {};
  let activeFile = 'index.html';
  let dirHandle = null;
  let autosaveTimer = null;
  let lastSavedAt = null;
  let cloudEnabled = false;

  function fileLang(name) { if (name.endsWith('.css')) return 'css'; if (name.endsWith('.js')) return 'js'; return 'html'; }
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
        if (data.active_file && files[data.active_file]) activeFile = data.active_file;
        cloudEnabled = true;
        setSaveState('Cloud project loaded ✓');
        return true;
      }
      return false;
    } catch (e) { console.warn('cloudLoad error', e); return false; }
  }

  async function cloudSave() {
    if (!cloudEnabled || !window.RA10 || !RA10.isLoggedIn()) return false;
    if (projectSize() > 1024 * 1024) {
      setSaveState('Over 1MB — compress images before saving to cloud', 'offline');
      return false;
    }
    try {
      const client = sbClient();
      if (!client) return false;
      const session = RA10.getSession();
      const { error } = await client.from('unit3_projects')
        .upsert({ user_id: session.user.id, files: files, active_file: activeFile });
      if (error) { console.warn('cloudSave error', error); setSaveState('Cloud save failed — try again', 'offline'); return false; }
      lastSavedAt = new Date();
      setSaveState('Saved to cloud ' + lastSavedAt.toLocaleTimeString());
      return true;
    } catch (e) { console.warn('cloudSave error', e); setSaveState('Cloud save failed — try again', 'offline'); return false; }
  }

  function queueAutosave() {
    clearTimeout(autosaveTimer);
    setSaveState(cloudEnabled ? 'Saving…' : 'Local draft — enable cloud save to keep it safe', 'saving');
    autosaveTimer = setTimeout(function () {
      if (cloudEnabled) cloudSave();
      else { lastSavedAt = new Date(); setSaveState('Saved locally ' + lastSavedAt.toLocaleTimeString()); }
    }, 900);
  }

  /* ── Render ────────────────────────────────────────────── */
  function renderToolbar() {
    const host = document.getElementById('ed-toolbar-actions');
    if (!host) return;
    host.innerHTML =
      '<span class="ed-save-state" id="ed-save-state"></span>' +
      '<button class="btn" id="ed-connect-local">Open local folder</button>' +
      '<button class="btn" id="ed-enable-cloud">Enable cloud save</button>' +
      '<button class="btn" id="ed-download">Download project</button>' +
      '<button class="btn ghost" id="ed-template-btn">Insert component</button>';
    document.getElementById('ed-connect-local').addEventListener('click', connectLocalFolder);
    document.getElementById('ed-enable-cloud').addEventListener('click', enableCloud);
    document.getElementById('ed-download').addEventListener('click', downloadProject);
    document.getElementById('ed-template-btn').addEventListener('click', function () {
      const picker = document.getElementById('ed-template-picker');
      if (picker) picker.classList.toggle('hidden');
    });
  }

  function renderTemplatePicker() {
    const host = document.getElementById('ed-template-picker');
    if (!host) return;
    host.innerHTML = '';
    Object.keys(TEMPLATES).forEach(function (name) {
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.textContent = name;
      btn.addEventListener('click', function () {
        files = JSON.parse(JSON.stringify(TEMPLATES[name]));
        activeFile = 'index.html';
        syncToEditor();
        renderFileList();
        host.classList.add('hidden');
        setSaveState('Template loaded');
        queueAutosave();
      });
      host.appendChild(btn);
    });
  }

  function renderFileList() {
    const host = document.getElementById('ed-file-list');
    if (!host) return;
    const names = Object.keys(files);
    host.innerHTML = names.map(function (name) {
      return '<div class="ed-file-item' + (name === activeFile ? ' active' : '') + '" data-file="' + esc(name) + '">' +
        '<span>' + esc(name) + '</span>' +
        (names.length > 1 ? '<span class="del-file" data-del="' + esc(name) + '" title="Delete">✕</span>' : '') +
        '</div>';
    }).join('');
    host.querySelectorAll('.ed-file-item').forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (e.target.dataset.del) return;
        activeFile = el.dataset.file;
        syncToEditor();
        renderFileList();
      });
    });
    host.querySelectorAll('[data-del]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        const name = el.dataset.del;
        if (!confirm('Delete ' + name + '?')) return;
        delete files[name];
        if (activeFile === name) activeFile = Object.keys(files)[0];
        syncToEditor();
        renderFileList();
        queueAutosave();
      });
    });
  }

  function renderEditor() {
    const host = document.getElementById('ed-editor');
    if (!host) return;
    host.innerHTML =
      '<div class="ed-panel-head"><span id="ed-file-status">' + esc(activeFile) + ' · ' + fileLang(activeFile).toUpperCase() + '</span></div>' +
      '<div style="display:flex;flex:1;min-height:380px">' +
      '  <pre class="ed-gutter" id="ed-gutter" aria-hidden="true"></pre>' +
      '  <textarea id="ed-code" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Code editor"></textarea>' +
      '</div>';
    const ta = document.getElementById('ed-code');
    ta.addEventListener('input', function () {
      files[activeFile] = ta.value;
      updatePreview();
      updateGutter();
      queueAutosave();
    });
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = ta.selectionStart, end = ta.selectionEnd;
        ta.value = ta.value.slice(0, start) + '  ' + ta.value.slice(end);
        ta.selectionStart = ta.selectionEnd = start + 2;
        files[activeFile] = ta.value;
        updatePreview(); updateGutter(); queueAutosave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (cloudEnabled) cloudSave(); else queueAutosave();
      }
    });
    syncToEditor();
  }

  function renderPreview() {
    const host = document.getElementById('ed-preview');
    if (!host) return;
    host.innerHTML = '<div class="ed-panel-head"><span>Live preview</span></div>' +
      '<iframe id="ed-preview-frame" title="Website preview" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>';
    updatePreview();
  }

  function syncToEditor() {
    const ta = document.getElementById('ed-code');
    if (!ta) return;
    ta.value = files[activeFile] || '';
    ta.dataset.file = activeFile;
    const status = document.getElementById('ed-file-status');
    if (status) status.textContent = activeFile + ' · ' + fileLang(activeFile).toUpperCase();
    updatePreview();
    updateGutter();
  }

  function updateGutter() {
    const ta = document.getElementById('ed-code');
    const gutter = document.getElementById('ed-gutter');
    if (!ta || !gutter) return;
    const count = ta.value.split('\n').length;
    let out = '';
    for (let i = 1; i <= count; i++) out += i + '\n';
    gutter.textContent = out;
  }

  function updatePreview() {
    const frame = document.getElementById('ed-preview-frame');
    if (!frame) return;
    let doc = files['index.html'] || '<!DOCTYPE html><html><body><p>Create an index.html file to preview.</p></body></html>';
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

  /* ── Local folder ──────────────────────────────────────── */
  async function connectLocalFolder() {
    if (!window.showDirectoryPicker) {
      setSaveState('Local folders need Chrome or Edge (File System Access API)', 'offline');
      return;
    }
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
        activeFile = Object.keys(files)[0];
        setSaveState('Connected: ' + dirHandle.name + ' — edits save to disk');
        renderToolbar();
        renderFileList();
        syncToEditor();
      } else {
        setSaveState('No HTML/CSS/JS files found in that folder', 'offline');
      }
    } catch (e) { /* user cancelled */ }
  }

  function enableCloud() {
    if (!window.RA10 || !RA10.isLoggedIn()) {
      if (window.RA10 && typeof RA10.showPaywall === 'function') RA10.showPaywall('account', 'cloud_save');
      else alert('Sign in to save your project to the cloud.');
      return;
    }
    cloudEnabled = true;
    setSaveState('Cloud save enabled — autosaving…');
    backupLocal();
    cloudSave();
    renderToolbar();
  }

  function backupLocal() { try { localStorage.setItem('ra10_u3_editor_backup', JSON.stringify(files)); } catch (e) {} }

  function downloadProject() {
    Object.keys(files).forEach(function (name) {
      const a = document.createElement('a');
      const type = fileLang(name) === 'css' ? 'text/css' : fileLang(name) === 'js' ? 'text/javascript' : 'text/html';
      const blob = new Blob([files[name]], { type: type });
      a.href = URL.createObjectURL(blob);
      a.download = name;
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 500);
    });
    setSaveState('Downloaded ' + Object.keys(files).length + ' file(s)');
  }

  /* ── Init ──────────────────────────────────────────────── */
  window.initCodeEditor = async function () {
    const host = document.getElementById('ed-app');
    if (!host) return;

    try {
      const backup = JSON.parse(localStorage.getItem('ra10_u3_editor_backup') || 'null');
      if (backup && Object.keys(backup).length) files = backup;
    } catch (e) {}
    if (!Object.keys(files).length) files = JSON.parse(JSON.stringify(DEFAULT_FILES));

    host.innerHTML =
      '<div class="ed-toolbar"><div id="ed-toolbar-actions" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;width:100%"></div></div>' +
      '<div class="ed-layout">' +
      '  <div class="ed-panel">' +
      '    <div class="ed-panel-head"><span>Files</span><span class="ed-mode-label">HTML · CSS · JS</span></div>' +
      '    <div class="ed-file-list" id="ed-file-list"></div>' +
      '    <div class="ed-add-file">' +
      '      <input id="ed-new-file" placeholder="new-page.html" aria-label="New file name">' +
      '      <button id="ed-new-file-btn" type="button">Add</button>' +
      '    </div>' +
      '  </div>' +
      '  <div class="ed-panel" id="ed-editor"></div>' +
      '  <div class="ed-panel" id="ed-preview"></div>' +
      '</div>' +
      '<div class="ed-panel hidden" id="ed-template-picker" style="margin-top:12px">' +
      '  <div class="ed-panel-head"><span>Insert a learning component (replaces current files)</span></div>' +
      '  <div style="padding:12px;display:flex;gap:8px;flex-wrap:wrap" id="ed-template-buttons"></div>' +
      '</div>';

    document.getElementById('ed-new-file-btn').addEventListener('click', function () {
      const input = document.getElementById('ed-new-file');
      const name = (input.value || '').trim();
      if (!name || files[name]) { input.value = ''; return; }
      files[name] = fileLang(name) === 'js' ? '// new script\n' : fileLang(name) === 'css' ? '/* new styles */\n' : '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>' + name + '</title>\n</head>\n<body>\n  <h1>' + name + '</h1>\n</body>\n</html>\n';
      activeFile = name;
      input.value = '';
      renderFileList();
      syncToEditor();
      queueAutosave();
    });
    document.getElementById('ed-new-file').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') document.getElementById('ed-new-file-btn').click();
    });

    if (window.RA10 && RA10.isLoggedIn()) {
      const loaded = await cloudLoad();
      if (!loaded) {
        cloudEnabled = true;
        await cloudSave();
      }
    }

    renderToolbar();
    renderTemplatePicker();
    renderFileList();
    renderEditor();
    renderPreview();
  };
})();