/* Code Editor — HTML/CSS/JS editor with live preview, cloud autosave (Supabase),
   and optional local folder access (File System Access API), similar to VS Code. */
(function () {
  const DEFAULT_FILES = {
    'index.html': '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>My Website</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <header>\n    <h1>My Website</h1>\n    <nav>\n      <a href="#home">Home</a>\n      <a href="#about">About</a>\n      <a href="#contact">Contact</a>\n    </nav>\n  </header>\n  <main>\n    <p>Start building your website here!</p>\n    <button id="demo-btn">Click me</button>\n  </main>\n  <footer>\n    <p>&copy; 2026 My Website</p>\n  </footer>\n  <script src="script.js"></script>\n</body>\n</html>\n',
    'style.css': 'body {\n  font-family: sans-serif;\n  margin: 0;\n  color: #222;\n}\nheader {\n  background: #0f766e;\n  color: #fff;\n  padding: 16px 24px;\n}\nnav a {\n  color: #fff;\n  margin-right: 12px;\n  text-decoration: none;\n}\nmain {\n  padding: 24px;\n}\nbutton {\n  padding: 8px 16px;\n  border: none;\n  border-radius: 6px;\n  background: #0f766e;\n  color: #fff;\n  cursor: pointer;\n}\n',
    'script.js': 'document.getElementById("demo-btn").addEventListener("click", function () {\n  alert("Hello from script.js!");\n});\n',
  };

  let files = {};
  let activeFile = 'index.html';
  let dirHandle = null; // File System Access API directory handle
  let autosaveTimer = null;
  let lastSavedAt = null;

  function fileLang(name) {
    if (name.endsWith('.css')) return 'css';
    if (name.endsWith('.js')) return 'javascript';
    return 'html';
  }

  function renderFileList() {
    const host = document.getElementById('editor-file-list');
    if (!host) return;
    host.innerHTML = Object.keys(files).map((name) =>
      '<div class="editor-file-item' + (name === activeFile ? ' active' : '') + '" data-file="' + esc(name) + '">' +
      '<span>' + esc(name) + '</span>' +
      (Object.keys(files).length > 1 ? '<span class="del-file" data-del="' + esc(name) + '">✕</span>' : '') +
      '</div>'
    ).join('');
    host.querySelectorAll('.editor-file-item').forEach((el) => {
      el.addEventListener('click', (e) => {
        if (e.target.dataset.del) return;
        activeFile = el.dataset.file;
        renderFileList();
        renderEditorArea();
      });
    });
    host.querySelectorAll('[data-del]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const name = el.dataset.del;
        if (!confirm('Delete ' + name + '?')) return;
        delete files[name];
        if (activeFile === name) activeFile = Object.keys(files)[0];
        renderFileList();
        renderEditorArea();
        queueAutosave();
      });
    });
  }

  function renderEditorArea() {
    const ta = document.getElementById('code-editor-textarea');
    if (!ta) return;
    ta.value = files[activeFile] || '';
    ta.dataset.file = activeFile;
    updatePreview();
    const statusEl = document.getElementById('editor-status');
    if (statusEl) statusEl.textContent = fileLang(activeFile).toUpperCase();
  }

  function updatePreview() {
    const frame = document.getElementById('code-preview-frame');
    if (!frame) return;
    const html = files['index.html'] || '';
    const css = files['style.css'] || '';
    const js = files['script.js'] || '';
    // Build a combined document: inject CSS + JS into the HTML for preview,
    // also support any other .css/.js files that are @-referenced by filename.
    let doc = html;
    // Strip references to style.css/script.js (their content is injected inline below)
    // so the sandboxed preview iframe doesn't attempt (and fail) real network requests for them.
    doc = doc.replace(/<link[^>]*href=["']style\.css["'][^>]*>/i, '');
    doc = doc.replace(/<script[^>]*src=["']script\.js["'][^>]*><\/script>/i, '');
    doc = doc.replace('</head>', '<style>' + css + '</style></head>');
    doc = doc.replace('</body>', '<script>try{\n' + js + '\n}catch(e){console.error(e);}</script></body>');
    frame.srcdoc = doc;
  }

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ── Cloud autosave (Supabase) — text-only, small payload ── */
  function projectSizeBytes() {
    return new Blob([JSON.stringify(files)]).size;
  }

  async function cloudLoad() {
    if (!window.RA10 || !RA10.isLoggedIn()) return false;
    try {
      const session = RA10.getSession();
      const client = window.supabase ? window.supabase.createClient(
        'https://tcrrgsylxbyyrmnouihl.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcnJnc3lseGJ5eXJtbm91aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODUyMTEsImV4cCI6MjA5MzQ2MTIxMX0.eOp6ma-mfgh8F20nM7E2OaBW28LlZlwuEEWr6k2zDWw',
        { global: { headers: { Authorization: 'Bearer ' + (session && session.access_token || '') } } }
      ) : null;
      if (!client) return false;
      const { data, error } = await client.from('unit3_projects').select('files, active_file').eq('user_id', session.user.id).maybeSingle();
      if (error || !data) return false;
      if (data.files && Object.keys(data.files).length) {
        files = data.files;
        activeFile = data.active_file && files[data.active_file] ? data.active_file : Object.keys(files)[0];
        return true;
      }
    } catch (e) { console.warn('cloudLoad failed', e); }
    return false;
  }

  async function cloudSave() {
    if (!window.RA10 || !RA10.isLoggedIn()) return;
    const size = projectSizeBytes();
    if (size > 1024 * 1024) {
      setStatus('Project too large to autosave (>1MB). Remove large content or use a local folder.', true);
      return;
    }
    try {
      const session = RA10.getSession();
      const client = window.supabase ? window.supabase.createClient(
        'https://tcrrgsylxbyyrmnouihl.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcnJnc3lseGJ5eXJtbm91aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODUyMTEsImV4cCI6MjA5MzQ2MTIxMX0.eOp6ma-mfgh8F20nM7E2OaBW28LlZlwuEEWr6k2zDWw',
        { global: { headers: { Authorization: 'Bearer ' + (session && session.access_token || '') } } }
      ) : null;
      if (!client) return;
      await client.from('unit3_projects').upsert({
        user_id: session.user.id,
        name: 'My Website',
        files,
        active_file: activeFile,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
      lastSavedAt = new Date();
      setStatus('Saved to cloud at ' + lastSavedAt.toLocaleTimeString());
    } catch (e) {
      console.warn('cloudSave failed', e);
      setStatus('Cloud save failed — check connection.', true);
    }
  }

  function setStatus(text, isError) {
    const el = document.getElementById('editor-save-status');
    if (!el) return;
    el.textContent = text;
    el.style.color = isError ? '#dc2626' : 'var(--muted)';
  }

  function queueAutosave() {
    setStatus('Saving…');
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(async () => {
      await cloudSave();
      if (dirHandle) await localFolderSaveActiveFile();
    }, 900);
  }

  /* ── Local folder access (File System Access API) ── */
  async function localFolderPick() {
    if (!window.showDirectoryPicker) {
      alert('Your browser does not support local folder access. Try Chrome or Edge, or keep using cloud autosave.');
      return;
    }
    try {
      dirHandle = await window.showDirectoryPicker();
      setStatus('Connected to local folder: ' + dirHandle.name);
      await localFolderImport();
    } catch (e) { /* user cancelled */ }
  }

  async function localFolderImport() {
    if (!dirHandle) return;
    const imported = {};
    for await (const [name, handle] of dirHandle.entries()) {
      if (handle.kind !== 'file') continue;
      if (!/\.(html|css|js)$/i.test(name)) continue;
      try {
        const file = await handle.getFile();
        if (file.size > 1024 * 1024) continue;
        imported[name] = await file.text();
      } catch (e) {}
    }
    if (Object.keys(imported).length) {
      files = imported;
      activeFile = files['index.html'] ? 'index.html' : Object.keys(files)[0];
      renderFileList();
      renderEditorArea();
    }
  }

  async function localFolderSaveActiveFile() {
    if (!dirHandle) return;
    try {
      const handle = await dirHandle.getFileHandle(activeFile, { create: true });
      const writable = await handle.createWritable();
      await writable.write(files[activeFile] || '');
      await writable.close();
    } catch (e) { console.warn('local save failed', e); }
  }

  async function localFolderSaveAll() {
    if (!dirHandle) return;
    for (const name of Object.keys(files)) {
      try {
        const handle = await dirHandle.getFileHandle(name, { create: true });
        const writable = await handle.createWritable();
        await writable.write(files[name] || '');
        await writable.close();
      } catch (e) {}
    }
    setStatus('Saved all files to local folder.');
  }

  /* ── Toolbar actions ── */
  function newFile() {
    const name = prompt('New file name (e.g. about.html, extra.css, utils.js):');
    if (!name) return;
    if (files[name] != null) { alert('That file already exists.'); return; }
    files[name] = '';
    activeFile = name;
    renderFileList();
    renderEditorArea();
    queueAutosave();
  }

  function resetProject() {
    if (!confirm('Reset to the starter template? This will overwrite your current files (cloud save will update too).')) return;
    files = Object.assign({}, DEFAULT_FILES);
    activeFile = 'index.html';
    renderFileList();
    renderEditorArea();
    queueAutosave();
  }

  function downloadZipLike() {
    // Simple multi-file download: since we don't bundle a zip library, download each file individually.
    Object.keys(files).forEach((name) => {
      const blob = new Blob([files[name]], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }

  let initialised = false;
  window.initCodeEditor = async function () {
    if (initialised) { updatePreview(); return; }
    initialised = true;
    files = Object.assign({}, DEFAULT_FILES);

    const loadedFromCloud = await cloudLoad();
    if (!loadedFromCloud) setStatus('New project — will autosave to your account.');

    renderFileList();
    renderEditorArea();

    const ta = document.getElementById('code-editor-textarea');
    ta.addEventListener('input', () => {
      files[activeFile] = ta.value;
      updatePreview();
      queueAutosave();
    });
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = ta.selectionStart, end = ta.selectionEnd;
        ta.value = ta.value.slice(0, start) + '  ' + ta.value.slice(end);
        ta.selectionStart = ta.selectionEnd = start + 2;
        files[activeFile] = ta.value;
        updatePreview();
        queueAutosave();
      }
    });

    document.getElementById('editor-new-file')?.addEventListener('click', newFile);
    document.getElementById('editor-reset')?.addEventListener('click', resetProject);
    document.getElementById('editor-download')?.addEventListener('click', downloadZipLike);
    document.getElementById('editor-pick-folder')?.addEventListener('click', localFolderPick);
    document.getElementById('editor-save-folder')?.addEventListener('click', localFolderSaveAll);
    document.getElementById('editor-refresh-preview')?.addEventListener('click', updatePreview);
  };
})();
