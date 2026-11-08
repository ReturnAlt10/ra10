/* RA10 Python Lab */
(function () {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const TASKS = window.PY_TASKS || [];
  const LEVEL = { 1: 'Starter', 2: 'Core', 3: 'Challenge' };
  const GROUPS = [['A1', 'A1 Number systems'], ['A2', 'A2 Data and logic'], ['A3', 'A3 Program structure'], ['B1', 'B1 Data structures'], ['B2', 'B2 Built-in functions'], ['C1', 'C1 Problem solving'], ['C2', 'C2 High-quality programs'], ['Unit 4', 'Unit 4 Projects']];
  const UNIT = '/revision/btec/level-3/computing-aaq/unit-1';
  const KEY = 'ra10_pylab_v1';
  const TIMEOUT_MS = 6000;

  let state = { solved: {}, code: {}, attempts: {} };
  try { state = Object.assign(state, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };

  let cur = null, sandbox = false, levelFilter = 0, hintIx = 0, opened = Date.now(), solutionSeen = false;

  /* ---------- editor ---------- */
  const cm = window.CodeMirror ? CodeMirror.fromTextArea($('#editor'), {
    mode: 'python', lineNumbers: true, indentUnit: 4, tabSize: 4, indentWithTabs: false, matchBrackets: true,
    extraKeys: { Tab: (c) => c.somethingSelected() ? c.indentSelection('add') : c.replaceSelection('    ', 'end'), 'Shift-Tab': (c) => c.indentSelection('subtract'), 'Ctrl-Enter': () => run(), 'Cmd-Enter': () => run() }
  }) : null;
  const getCode = () => cm ? cm.getValue() : $('#editor').value;
  const setCode = (s) => { if (cm) { cm.setValue(s || ''); cm.clearHistory(); } else $('#editor').value = s || ''; };
  let errMark = null;
  const markLine = (n) => { if (!cm) return; if (errMark != null) cm.removeLineClass(errMark, 'background', 'pl-errline'); errMark = null; if (n) { errMark = n - 1; cm.addLineClass(errMark, 'background', 'pl-errline'); } };
  if (cm) cm.on('change', () => { if (cur && !sandbox) { state.code[cur.id] = getCode(); save(); } else if (sandbox) { state.code.__sandbox = getCode(); save(); } });

  /* ---------- python worker ---------- */
  let worker = null, ready = false, queue = {}, seq = 0;
  const status = (t, cls) => { const s = $('#status'); s.textContent = t; s.className = 'pl-status ' + (cls || ''); };
  function startWorker() {
    ready = false; status('Starting Python…');
    worker = new Worker('worker.js?v=20261211');
    worker.onmessage = (ev) => {
      const m = ev.data;
      if (m.type === 'ready') { ready = true; status('Python ' + m.version + ' ready', 'ok'); }
      else if (m.type === 'fatal') status('Python could not load – check your connection', 'err');
      else if (m.type === 'result' && queue[m.id]) { clearTimeout(queue[m.id].timer); queue[m.id].resolve(m); delete queue[m.id]; }
    };
  }
  function exec(payload) {
    return new Promise((resolve) => {
      const id = ++seq;
      const timer = setTimeout(() => {
        // infinite loop or very slow code: kill the worker and start a fresh one
        delete queue[id]; worker.terminate(); startWorker();
        resolve({ out: '', err: 'Timeout: your program ran for more than ' + (TIMEOUT_MS / 1000) + ' seconds – check for a loop that never ends (or one waiting for input that never comes).', line: null, timeout: true });
      }, TIMEOUT_MS + (ready ? 0 : 20000));
      queue[id] = { resolve, timer };
      worker.postMessage(Object.assign({ id }, payload));
    });
  }
  startWorker();

  /* ---------- list ---------- */
  function renderList() {
    const nav = $('#list'); nav.innerHTML = '';
    GROUPS.forEach(([g, label]) => {
      const ts = TASKS.filter(t => (t.spec.split('.')[0] === g || (g === 'Unit 4' && t.spec === 'Unit 4')) && (!levelFilter || t.level === levelFilter));
      if (!ts.length) return;
      nav.insertAdjacentHTML('beforeend', `<div class="pl-group">${esc(label)}</div>`);
      ts.forEach(t => {
        const b = document.createElement('button');
        b.className = 'pl-task' + (state.solved[t.id] ? ' done' : '') + (cur && cur.id === t.id && !sandbox ? ' cur' : '');
        b.innerHTML = `<span class="tick">${state.solved[t.id] ? '✓' : ''}</span><span>${esc(t.title)}</span><span class="lv" title="${LEVEL[t.level]}">${'●'.repeat(t.level)}</span>`;
        b.onclick = () => open(t.id);
        nav.appendChild(b);
      });
    });
    const n = TASKS.filter(t => state.solved[t.id]).length;
    $('#solved').textContent = n; $('#total').textContent = TASKS.length; $('#bar').style.width = (100 * n / TASKS.length) + '%';
  }
  document.querySelectorAll('.pl-filters button').forEach(b => b.onclick = () => {
    document.querySelectorAll('.pl-filters button').forEach(x => x.classList.remove('on')); b.classList.add('on');
    levelFilter = Number(b.dataset.l); renderList();
  });

  /* ---------- open a task ---------- */
  function open(id) {
    const t = TASKS.find(x => x.id === id) || TASKS[0];
    cur = t; sandbox = false; hintIx = 0; opened = Date.now(); solutionSeen = false;
    $('#title').textContent = t.title;
    $('#chips').innerHTML = `<span class="pl-chip">${esc(t.spec === 'Unit 4' ? 'Unit 4' : 'Unit 1 · ' + t.spec)}</span><span class="pl-chip">${esc(t.topic)}</span><span class="pl-chip">${LEVEL[t.level]}</span>${state.solved[t.id] ? '<span class="pl-chip" style="color:var(--pl-ok)">Solved ✓</span>' : ''}`;
    $('#brief').innerHTML = t.brief + (t.setup ? '<p><small>The test creates the file(s) your program needs before it runs.</small></p>' : '');
    const predict = t.tests.some(x => x.type === 'predict');
    $('#predictWrap').hidden = !predict;
    document.querySelector('.pl-editor-wrap').hidden = predict;
    document.querySelector('.pl-io').hidden = predict;
    $('#runBtn').hidden = predict; $('#resetBtn').hidden = predict; $('#solBtn').hidden = predict; $('#checkBtn').hidden = false;
    if (predict) { $('#predictCode').textContent = t.code; $('#predict').value = state.code[t.id] || ''; }
    else { setCode(state.code[t.id] != null ? state.code[t.id] : t.starter); markLine(null); }
    const firstIo = t.tests.find(x => x.type === 'io');
    $('#stdin').value = firstIo ? (firstIo.stdin || []).join('\n') : '';
    $('#out').textContent = ''; $('#results').innerHTML = ''; $('#hints').innerHTML = ''; $('#solution').hidden = true;
    $('#hintBtn').hidden = !(t.hints && t.hints.length);
    history.replaceState(null, '', '?task=' + encodeURIComponent(t.id));
    renderList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function openSandbox() {
    sandbox = true; cur = null;
    $('#title').textContent = 'Free coding sandbox';
    $('#chips').innerHTML = '<span class="pl-chip">Python 3</span>';
    $('#brief').innerHTML = 'Write and run any Python 3 program. Type the values your program will <code>input()</code> in the Program input box, one per line.';
    $('#predictWrap').hidden = true; document.querySelector('.pl-editor-wrap').hidden = false; document.querySelector('.pl-io').hidden = false;
    $('#runBtn').hidden = false; $('#resetBtn').hidden = false; $('#checkBtn').hidden = true; $('#hintBtn').hidden = true; $('#solBtn').hidden = true;
    setCode(state.code.__sandbox || 'name = input("What is your name? ")\nprint(f"Hello, {name}!")\n');
    $('#stdin').value = 'Ada'; $('#out').textContent = ''; $('#results').innerHTML = ''; $('#hints').innerHTML = ''; $('#solution').hidden = true;
    history.replaceState(null, '', '?sandbox=1'); renderList();
  }
  $('#sandboxBtn').onclick = openSandbox;
  $('#prev').onclick = () => { const i = cur ? TASKS.indexOf(cur) : 0; open(TASKS[(i - 1 + TASKS.length) % TASKS.length].id); };
  $('#next').onclick = () => { const i = cur ? TASKS.indexOf(cur) : -1; open(TASKS[(i + 1) % TASKS.length].id); };

  /* ---------- run / check ---------- */
  const norm = (s) => String(s || '').replace(/\r/g, '').split('\n').map(l => l.replace(/\s+$/, '')).join('\n').replace(/^\n+|\n+$/g, '');
  async function run() {
    if (!getCode().trim()) return;
    $('#out').textContent = 'Running…'; markLine(null);
    const stdin = $('#stdin').value.split('\n'); if (stdin.length && stdin[stdin.length - 1] === '') stdin.pop();
    const r = await exec({ code: getCode(), stdin, echo: true, setup: cur && cur.setup || '' });
    $('#out').innerHTML = esc(r.out) + (r.err ? `<span class="e">${r.out ? '\n' : ''}${esc(r.err)}</span>` : '') || '<span style="opacity:.6">(no output)</span>';
    markLine(r.line);
  }
  async function check() {
    const t = cur; if (!t) return;
    const results = [];
    const tStart = Date.now();
    state.attempts[t.id] = (state.attempts[t.id] || 0) + 1;
    $('#results').innerHTML = '<div class="pl-res">Checking…</div>';
    for (const tc of t.tests) {
      if (tc.type === 'predict') {
        const ok = norm($('#predict').value) === norm(tc.out);
        state.code[t.id] = $('#predict').value;
        results.push({ ok, label: 'Your prediction', detail: ok ? '' : 'Not quite. Trace the program line by line – a trace table helps.' });
        continue;
      }
      if (tc.type === 'io') {
        const r = await exec({ code: getCode(), stdin: tc.stdin || [], setup: t.setup || '' });
        const ok = !r.err && norm(r.out) === norm(tc.out);
        results.push({ ok, label: 'Input: ' + ((tc.stdin || []).join(', ') || '(none)'), detail: ok ? '' : (r.err ? r.err : `Expected:\n${tc.out}\n\nYour program printed:\n${norm(r.out) || '(nothing)'}`) });
        if (r.timeout) break;
      } else {
        const r = await exec({ code: getCode(), stdin: tc.stdin || [], check: tc.check, setup: t.setup || '' });
        const ok = !r.err;
        results.push({ ok, label: 'Function tests', detail: ok ? '' : r.err });
        if (r.timeout) break;
      }
    }
    const passed = results.filter(r => r.ok).length, total = t.tests.length;
    const all = passed === total;
    if (all && !state.solved[t.id]) { state.solved[t.id] = Date.now(); }
    save();
    $('#results').innerHTML = `<div class="pl-summary" style="color:${all ? 'var(--pl-ok)' : 'var(--pl-bad)'}">${all ? '✓ All tests passed – well done!' : passed + ' of ' + total + ' tests passed'}</div>` +
      results.map(r => `<div class="pl-res ${r.ok ? 'ok' : 'bad'}"><b class="${r.ok ? 'ok' : 'bad'}">${r.ok ? '✓' : '✗'}</b> ${esc(r.label)}${r.detail ? `<pre>${esc(r.detail)}</pre>` : ''}</div>`).join('') +
      (all ? '<div class="pl-res ok">Next: <a href="#" id="goNext">try the next task →</a></div>' : '');
    const gn = $('#goNext'); if (gn) gn.onclick = (e) => { e.preventDefault(); $('#next').click(); };
    renderList();
    if (all) $('#chips').insertAdjacentHTML('beforeend', '<span class="pl-chip" style="color:var(--pl-ok)">Solved ✓</span>');
    try {
      if (window.RA10Track) RA10Track.log('code_task', {
        unit: UNIT, ref: 'pylab:' + t.id, title: t.title, view: 'python-lab',
        answer: t.tests.some(x => x.type === 'predict') ? $('#predict').value : getCode(),
        score: passed, max_score: total, duration_s: (Date.now() - opened) / 1000,
        meta: { spec: t.spec, topic: t.topic, level: t.level, attempts: state.attempts[t.id], hints: hintIx, solution_seen: solutionSeen, solved: all, ms: Date.now() - tStart }
      });
    } catch (e) {}
  }
  $('#runBtn').onclick = run;
  $('#checkBtn').onclick = () => { if (sandbox) return; check(); };
  $('#hintBtn').onclick = () => {
    if (!cur || !cur.hints) return;
    if (hintIx >= cur.hints.length) return;
    $('#hints').insertAdjacentHTML('beforeend', `<div class="h"><b>Hint ${hintIx + 1}:</b> ${cur.hints[hintIx]}</div>`);
    hintIx++;
    if (hintIx >= cur.hints.length) $('#hintBtn').hidden = true;
  };
  $('#solBtn').onclick = () => {
    if (!cur || !cur.solution) return;
    if ((state.attempts[cur.id] || 0) < 1 && !confirm('Try checking your answer at least once first. Show the model solution anyway?')) return;
    solutionSeen = true;
    $('#solution').hidden = false;
    $('#solution').innerHTML = `<h3>Model solution</h3><pre>${esc(cur.solution)}</pre><button class="sc-btn sm" id="useSol">Copy into the editor</button>`;
    $('#useSol').onclick = () => setCode(cur.solution);
  };
  $('#resetBtn').onclick = () => {
    if (sandbox) { setCode(''); return; }
    if (cur && confirm('Reset this task to the starter code?')) { delete state.code[cur.id]; save(); setCode(cur.starter); markLine(null); }
  };

  /* ---------- start ---------- */
  const qs = new URLSearchParams(location.search);
  if (qs.get('sandbox')) openSandbox();
  else {
    const want = qs.get('task');
    const firstOpen = TASKS.find(t => !state.solved[t.id]) || TASKS[0];
    open(want && TASKS.some(t => t.id === want) ? want : firstOpen.id);
  }
  window.RA10PyLab = { tasks: TASKS, state: () => state, open };
})();
