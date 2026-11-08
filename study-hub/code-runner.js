/* Study Hub — runs and checks "code" lesson steps in the learner's browser.
   Python: Pyodide in a Web Worker (shared with /tools/python-lab/worker.js). JavaScript: a sandboxed Web Worker.
   SQL: sql.js (SQLite compiled to WebAssembly).
   Every AI-written exercise is verified first: the model solution must run cleanly and pass every check; expected
   outputs (and expected SQL results) are produced from the solution, so there is no hand-written answer key to get wrong. */
(function () {
  'use strict';
  const TIMEOUT = 6000;

  /* ---------- Python ---------- */
  let pyW = null, pyReady = null, pySeq = 0; const pyQ = {};
  function pyWorker() {
    if (pyW) return pyReady;
    pyW = new Worker('/tools/python-lab/worker.js?v=20261211');
    pyReady = new Promise((res, rej) => {
      pyW.onmessage = (ev) => {
        const m = ev.data;
        if (m.type === 'ready') res(true);
        else if (m.type === 'fatal') rej(new Error(m.message));
        else if (m.type === 'result' && pyQ[m.id]) { clearTimeout(pyQ[m.id].t); pyQ[m.id].res(m); delete pyQ[m.id]; }
      };
    });
    return pyReady;
  }
  async function py(code, stdin, check) {
    await pyWorker();
    return new Promise((res) => {
      const id = ++pySeq;
      const t = setTimeout(() => { delete pyQ[id]; pyW.terminate(); pyW = null; res({ out: '', err: 'Timeout: the program ran for more than 6 seconds – check for a loop that never ends.', timeout: true }); }, TIMEOUT);
      pyQ[id] = { res, t };
      pyW.postMessage({ id, code, stdin: stdin || [], check: check || '' });
    });
  }

  /* ---------- JavaScript ---------- */
  const JS_SRC = `onmessage = (ev) => {
    const out = [];
    const log = (...a) => out.push(a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' '));
    const assert = (c, m) => { if (!c) throw new Error('Test failed: ' + (m || 'an assertion failed')); };
    let err = null;
    try { new Function('console', 'assert', ev.data.code + '\\n;' + (ev.data.check || ''))({ log, error: log, warn: log }, assert); }
    catch (e) { err = (e && e.message) ? (e.name && !/^Test failed/.test(e.message) ? e.name + ': ' : '') + e.message : String(e); }
    postMessage({ out: out.join('\\n'), err });
  };`;
  function js(code, check) {
    return new Promise((res) => {
      const w = new Worker(URL.createObjectURL(new Blob([JS_SRC], { type: 'text/javascript' })));
      const t = setTimeout(() => { w.terminate(); res({ out: '', err: 'Timeout: the code ran for more than 6 seconds – check for a loop that never ends.', timeout: true }); }, TIMEOUT);
      w.onmessage = (ev) => { clearTimeout(t); w.terminate(); res(ev.data); };
      w.postMessage({ code, check });
    });
  }

  /* ---------- SQL ---------- */
  let SQLp = null;
  function sqljs() {
    if (SQLp) return SQLp;
    SQLp = new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js';
      s.onload = () => window.initSqlJs({ locateFile: (f) => 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/' + f }).then(res, rej);
      s.onerror = () => rej(new Error('SQL engine could not load'));
      document.head.appendChild(s);
    });
    return SQLp;
  }
  async function sql(setup, query) {
    const SQL = await sqljs();
    const db = new SQL.Database();
    try {
      db.run(setup || '');
      const r = db.exec(query || '');
      const last = r.length ? r[r.length - 1] : { columns: [], values: [] };
      return { columns: last.columns, rows: last.values, err: null };
    } catch (e) { return { columns: [], rows: [], err: String(e && e.message || e) }; }
    finally { db.close(); }
  }
  async function sqlTables(setup) {
    const SQL = await sqljs(); const db = new SQL.Database();
    try {
      db.run(setup || '');
      const names = db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
      return (names.length ? names[0].values.map(v => v[0]) : []).map(n => { const r = db.exec('SELECT * FROM "' + n.replace(/"/g, '') + '"'); return { name: n, columns: r.length ? r[0].columns : [], rows: r.length ? r[0].values : [] }; });
    } catch (e) { return []; } finally { db.close(); }
  }

  const norm = (s) => String(s || '').replace(/\r/g, '').split('\n').map(l => l.replace(/\s+$/, '')).join('\n').replace(/^\n+|\n+$/g, '');
  const rowsKey = (r, ordered) => { const rows = (r.rows || []).map(x => JSON.stringify(x.map(v => typeof v === 'number' ? Math.round(v * 1e6) / 1e6 : v))); return (ordered ? rows : rows.slice().sort()).join('|'); };

  /* Verify an exercise: returns { ok, expected } where expected[i] is the solution's output for test i. */
  async function verify(step) {
    if (step._verified) return step._verified;
    let v = { ok: false, expected: [] };
    try {
      if (step.lang === 'sql') {
        const r = await sql(step.setup, step.solution);
        v = { ok: !r.err && r.columns.length > 0, expected: [r] };
      } else if (step.lang === 'javascript') {
        const exp = [];
        for (const tc of step.tests || []) { const r = await js(step.solution, tc.check || ''); if (r.err) { exp.length = 0; break; } exp.push(r.out); }
        v = { ok: exp.length === (step.tests || []).length && exp.length > 0, expected: exp };
      } else {
        const exp = [];
        for (const tc of step.tests || []) { const r = await py(step.solution, tc.stdin || [], tc.check || ''); if (r.err) { exp.length = 0; break; } exp.push(r.out); }
        v = { ok: exp.length === (step.tests || []).length && exp.length > 0, expected: exp };
      }
    } catch (e) { v = { ok: false, expected: [], error: String(e) }; }
    step._verified = v;
    return v;
  }

  /* Check the learner's code: returns { passed, total, details:[{ok, label, detail}] } */
  async function check(step, code) {
    const v = await verify(step);
    const details = [];
    if (step.lang === 'sql') {
      const exp = v.expected[0];
      const r = await sql(step.setup, code);
      const ordered = /order\s+by/i.test(step.solution);
      const ok = !r.err && r.columns.length === exp.columns.length && rowsKey(r, ordered) === rowsKey(exp, ordered);
      details.push({ ok, label: 'Query result', detail: ok ? '' : r.err ? r.err : `Expected ${exp.rows.length} row(s) with ${exp.columns.length} column(s); your query returned ${r.rows.length} row(s) with ${r.columns.length} column(s)${ordered ? ' (order matters here)' : ''}.` });
    } else {
      const tests = step.tests || [];
      for (let i = 0; i < tests.length; i++) {
        const tc = tests[i];
        const r = step.lang === 'javascript' ? await js(code, tc.check || '') : await py(code, tc.stdin || [], tc.check || '');
        const sameOut = norm(r.out) === norm(v.expected[i]);
        const ok = !r.err && (step.lang === 'javascript' || tc.check ? true : sameOut);
        const label = step.lang === 'javascript' ? 'Test ' + (i + 1) : 'Input: ' + ((tc.stdin || []).join(', ') || '(none)');
        details.push({ ok, label, detail: ok ? '' : r.err ? r.err : `Expected output:\n${norm(v.expected[i]) || '(nothing)'}\n\nYour output:\n${norm(r.out) || '(nothing)'}` });
        if (r.timeout) break;
      }
    }
    return { passed: details.filter(d => d.ok).length, total: details.length, details };
  }

  /* Run once for the "Run" button */
  async function run(step, code, stdinLines) {
    if (step.lang === 'sql') return sql(step.setup, code);
    if (step.lang === 'javascript') return js(code, '');
    return py(code, stdinLines || [], '');
  }

  window.SHCode = { verify, check, run, sqlTables, warm: (lang) => { if (lang === 'python') pyWorker().catch(() => {}); if (lang === 'sql') sqljs().catch(() => {}); } };
})();
