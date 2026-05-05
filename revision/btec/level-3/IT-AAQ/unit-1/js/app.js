// BTEC IT Unit 1 — Question Bank App
(function() {
'use strict';

// ---------- Utilities ----------
function $(s, p) { return (p || document).querySelector(s); }
function $$(s, p) { return Array.from((p || document).querySelectorAll(s)); }
function el(tag, attrs, ...children) {
  const e = document.createElement(tag);
  if (attrs) {
    for (const k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
  }
  children.flat().forEach(c => {
    if (c == null || c === false) return;
    if (typeof c === 'string') e.appendChild(document.createTextNode(c));
    else e.appendChild(c);
  });
  return e;
}
function escapeHTML(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }

// Mulberry32 — seeded RNG
function makeRng(seed) {
  let s = (typeof seed === 'string') ? hashStr(seed) : (seed | 0) || ((Math.random() * 2 ** 32) | 0);
  return function() { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function hashStr(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h | 0; }
function shuffle(arr, rng) { arr = arr.slice(); for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor((rng ? rng() : Math.random()) * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }

const SB_URL = 'https://tcrrgsylxbyyrmnouihl.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcnJnc3lseGJ5eXJtbm91aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODUyMTEsImV4cCI6MjA5MzQ2MTIxMX0.eOp6ma-mfgh8F20nM7E2OaBW28LlZlwuEEWr6k2zDWw';

async function saveSession(sessionType, data) {
  if (!window.RA10 || !RA10.isLoggedIn()) return;
  const session = RA10.getSession();
  if (!session?.user?.id) return;
  try {
    const sb = window.supabase
      ? window.supabase.createClient(SB_URL, SB_KEY)
      : null;
    if (!sb) return;
    await sb.from('revision_sessions').insert({
      user_id: session.user.id,
      session_type: sessionType,
      learning_aims: data.aims || [],
      questions_total: data.total || 0,
      questions_correct: data.correct || 0,
      marks_earned: data.marksEarned || 0,
      marks_total: data.marksTotal || 0,
      aim_breakdown: data.aimBreakdown || {}
    });
  } catch(e) {
    console.warn('Could not save session', e);
  }
}

// ---------- Tabs ----------
$$('.tab').forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));
$$('[data-goto]').forEach(b => b.addEventListener('click', () => switchTab(b.dataset.goto)));
function switchTab(name) {
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  $$('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + name));
  if (name === 'progress') renderProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------- Boot when data loaded ----------
onDataReady(() => {
  if (!QUESTIONS.length) {
    document.getElementById('app').innerHTML = `<div class="loading">
      <p>No questions loaded. The JSON files may not be present yet, or you are opening this file directly without a server.</p>
      <p class="muted">Run <code>python3 -m http.server</code> in this folder, or deploy via the included instructions.</p>
    </div>`;
    return;
  }
  renderDashboard();
  renderBrowse();
  renderMockControls();
  renderPracticeControls();
  renderQuizControls();
  renderFlashControls();
  renderSpec();
});

// ---------- Dashboard ----------
function renderDashboard() {
  const stats = {
    total: QUESTIONS.length,
    aims: new Set(QUESTIONS.map(q => q.learning_aim)).size,
    marks: QUESTIONS.reduce((s, q) => s + (Number(q.marks) || 0), 0),
    extended: QUESTIONS.filter(q => q.marks >= 6).length
  };
  const sBox = $('#dashboard-stats');
  sBox.innerHTML = '';
  [
    ['num', stats.total, 'Total questions'],
    ['num', stats.aims, 'Learning aims'],
    ['num', stats.marks.toLocaleString(), 'Total marks'],
    ['num', stats.extended, 'Extended-response (6m+)']
  ].forEach(([_, n, l]) => sBox.appendChild(el('div', {class:'stat'}, el('span', {class:'num'}, String(n)), el('span', {class:'lbl'}, l))));

  const aimGrid = $('#aim-grid');
  aimGrid.innerHTML = '';
  ['A','B','C','D','E','F'].forEach(letter => {
    const count = QUESTIONS.filter(q => q.learning_aim === letter).length;
    const data = SPEC[letter];
    const card = el('div', { class: 'aim-card', onclick: () => { $('#filter-aim').value = letter; switchTab('browse'); applyBrowseFilters(); } },
      el('div', { class: 'aim-letter' }, letter),
      el('h4', null, data.title),
      el('p', { class: 'desc' }, data.short),
      el('span', { class: 'count' }, `${count} questions`)
    );
    aimGrid.appendChild(card);
  });
}

// ---------- Browse ----------
let openedRow = null;

function renderBrowse() {
  // Populate filter dropdowns
  const aimSel = $('#filter-aim');
  ['A','B','C','D','E','F'].forEach(a => {
    const opt = el('option', {value: a}, `Aim ${a}: ${SPEC[a].short.split(',')[0]}`);
    aimSel.appendChild(opt);
  });
  const marksSel = $('#filter-marks');
  MARKS_OPTIONS.forEach(m => marksSel.appendChild(el('option', { value: String(m) }, `${m} mark${m===1?'':'s'}`)));
  const verbSel = $('#filter-verb');
  COMMAND_VERBS.forEach(v => verbSel.appendChild(el('option', { value: v }, v)));

  $('#search').addEventListener('input', applyBrowseFilters);
  aimSel.addEventListener('change', applyBrowseFilters);
  marksSel.addEventListener('change', applyBrowseFilters);
  verbSel.addEventListener('change', applyBrowseFilters);
  $('#btn-clear').addEventListener('click', () => {
    $('#search').value = ''; aimSel.value = ''; marksSel.value = ''; verbSel.value = '';
    applyBrowseFilters();
  });

  applyBrowseFilters();
}

function applyBrowseFilters() {
  const q = $('#search').value.trim().toLowerCase();
  const aim = $('#filter-aim').value;
  const marks = $('#filter-marks').value;
  const verb = $('#filter-verb').value;

  let list = QUESTIONS.slice();
  if (aim) list = list.filter(x => x.learning_aim === aim);
  if (marks) list = list.filter(x => String(x.marks) === marks);
  if (verb) list = list.filter(x => (x.command_verb || '').toLowerCase() === verb.toLowerCase());
  if (q) {
    list = list.filter(x => {
      const blob = (x.scenario || '') + ' ' + (x.question || '') + ' ' + (x.topic || '') + ' ' + (x.id || '');
      return blob.toLowerCase().includes(q);
    });
  }

  $('#result-count').textContent = `${list.length} question${list.length===1?'':'s'}`;

  const wrap = $('#question-list');
  wrap.innerHTML = '';
  // Cap rendering to first 250 for perf
  const display = list.slice(0, 250);
  display.forEach(qq => wrap.appendChild(renderQuestionRow(qq)));
  if (list.length > 250) {
    wrap.appendChild(el('p', { class: 'muted', style: 'text-align:center;padding:14px;' }, `Showing first 250 of ${list.length}. Refine filters to narrow further.`));
  }
}

function renderQuestionRow(q) {
  const row = el('div', { class: 'qrow' });
  const head = el('div', { class: 'qrow-head' });
  head.appendChild(el('div', { class: 'qrow-meta' },
    el('span', { class: 'tag id' }, q.id || ''),
    el('span', { class: 'tag' }, `Aim ${q.learning_aim}`),
    el('span', { class: 'tag verb' }, q.command_verb || ''),
    el('span', { class: 'tag marks' }, `${q.marks} mark${q.marks===1?'':'s'}`)
  ));
  if (q.topic) head.appendChild(el('span', { class: 'muted' }, q.topic));
  row.appendChild(head);

  const body = el('div', { class: 'qrow-body' });
  if (q.scenario) body.appendChild(el('p', { class: 'scenario' }, q.scenario));
  body.appendChild(el('p', { class: 'question-text' },
    q.question,
    el('span', { class: 'marks-bracket' }, ` (${q.marks})`)
  ));
  row.appendChild(body);

  row.appendChild(renderMarkScheme(q));

  row.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;
    if (openedRow && openedRow !== row) openedRow.classList.remove('open');
    row.classList.toggle('open');
    openedRow = row.classList.contains('open') ? row : null;
  });
  return row;
}

function renderMarkScheme(q) {
  const m = q.mark_scheme || {};
  const wrap = el('div', { class: 'markscheme' });
  wrap.appendChild(el('h5', null, 'Mark Scheme'));
  if (m.instruction) wrap.appendChild(el('p', { class: 'instruction' }, m.instruction));

  if (q.type === 'multiple_choice' && m.answer) {
    const correct = (q.options || []).find(o => o.label === m.answer);
    wrap.appendChild(el('p', { class: 'mc-answer' },
      el('strong', null, 'Correct answer: '),
      el('span', { class: 'mc-correct' }, m.answer + (correct ? ' — ' + correct.text : '')),
      ' (1)'
    ));
    if (m.explanation) wrap.appendChild(el('p', { class: 'instruction' }, m.explanation));
    if (m.additional_guidance) wrap.appendChild(el('p', { class: 'additional' }, m.additional_guidance));
    if (m.do_not_accept) wrap.appendChild(el('p', { class: 'donotaccept' }, 'Do not accept: ' + m.do_not_accept));
    return wrap;
  }

  if (q.type === 'extended_levels' || m.indicative_content) {
    if (m.indicative_content && m.indicative_content.length) {
      wrap.appendChild(el('p', { class: 'instruction' }, el('strong', null, 'Indicative content:')));
      const ul = el('ul');
      m.indicative_content.forEach(p => ul.appendChild(el('li', null, p)));
      wrap.appendChild(ul);
    }
    if (m.level_descriptors && m.level_descriptors.length) {
      const tbl = el('table', { class: 'levels' });
      const trh = el('tr', null, el('th', null, 'Level'), el('th', null, 'Marks'), el('th', null, 'Descriptor'));
      tbl.appendChild(trh);
      m.level_descriptors.forEach(d => tbl.appendChild(el('tr', null, el('td', null, 'Level ' + d.level), el('td', null, String(d.marks)), el('td', null, d.descriptor))));
      wrap.appendChild(tbl);
    }
  } else {
    if (m.points && m.points.length) {
      const ul = el('ul');
      m.points.forEach(p => ul.appendChild(el('li', { html: escapeHTML(p).replace(/\(1\)/g, '<strong>(1)</strong>') })));
      wrap.appendChild(ul);
    }
  }
  if (m.additional_guidance) wrap.appendChild(el('p', { class: 'additional' }, m.additional_guidance));
  if (m.do_not_accept) wrap.appendChild(el('p', { class: 'donotaccept' }, 'Do not accept: ' + m.do_not_accept));
  return wrap;
}

// ---------- Mock paper builder ----------
let lastMock = null;
let mockShowMs = false;

function renderMockControls() {
  const aimsRow = $('#mock-aims');
  aimsRow.innerHTML = '';
  const selected = new Set(['A','B','C','D','E','F']);
  ['A','B','C','D','E','F'].forEach(a => {
    const chip = el('div', { class: 'chip on' }, a);
    chip.addEventListener('click', () => {
      if (selected.has(a) && selected.size > 1) { selected.delete(a); chip.classList.remove('on'); }
      else { selected.add(a); chip.classList.add('on'); }
    });
    chip.dataset.aim = a;
    aimsRow.appendChild(chip);
  });

  // Question-style chips. User can mix-and-match styles; at least one must stay on.
  const stylesRow = $('#mock-styles');
  if (stylesRow) {
    stylesRow.innerHTML = '';
    const styleDefs = [
      { key: 'pearson',  label: 'Pearson-style (mixed)', hint: 'A balanced paper mirroring real Pearson distribution' },
      { key: 'short',    label: 'Short questions',       hint: '1–4 mark items (Identify, State, Give, Describe)' },
      { key: 'long',     label: 'Long questions',        hint: '6–12 mark extended-response items (Explain, Discuss, Evaluate)' },
      { key: 'diagram',  label: 'Diagrams / flowcharts', hint: 'Draw a flowchart, network topology or system diagram' },
      { key: 'mc',       label: 'Multiple choice',       hint: '1-mark MCQs with A–D options' }
    ];
    const selStyles = new Set(['pearson']);
    styleDefs.forEach(def => {
      const chip = el('div', { class: 'chip' + (selStyles.has(def.key) ? ' on' : ''), title: def.hint }, def.label);
      chip.dataset.style = def.key;
      chip.addEventListener('click', () => {
        if (selStyles.has(def.key) && selStyles.size > 1) { selStyles.delete(def.key); chip.classList.remove('on'); }
        else if (!selStyles.has(def.key)) { selStyles.add(def.key); chip.classList.add('on'); }
      });
      stylesRow.appendChild(chip);
    });
  }

  $('#btn-generate').addEventListener('click', () => {
    const total = parseInt($('#mock-total').value, 10);
    const seed = $('#mock-seed').value || String(Date.now());
    const sel = $$('#mock-aims .chip.on').map(c => c.dataset.aim);
    const styles = $$('#mock-styles .chip.on').map(c => c.dataset.style);
    generateMock(total, seed, sel, styles.length ? styles : ['pearson']);
  });
  $('#btn-print').addEventListener('click', () => {
    document.body.classList.remove('print-ms-only');
    $('#mock-paper').classList.remove('force-ms');
    window.print();
  });
  $('#btn-print-ms').addEventListener('click', () => {
    if (!lastMock) { alert('Generate a paper first.'); return; }
    // Render the paper with mark schemes forcibly visible, then print, then restore.
    const paper = $('#mock-paper');
    const wasShowing = mockShowMs;
    mockShowMs = true;
    renderMock(lastMock);
    paper.classList.add('force-ms');
    document.body.classList.add('print-ms-only');
    setTimeout(() => {
      window.print();
      // restore after the print dialog closes
      setTimeout(() => {
        document.body.classList.remove('print-ms-only');
        paper.classList.remove('force-ms');
        mockShowMs = wasShowing;
        renderMock(lastMock);
      }, 300);
    }, 50);
  });
  $('#btn-toggle-ms').addEventListener('click', () => {
    mockShowMs = !mockShowMs;
    $('#btn-toggle-ms').textContent = mockShowMs ? 'Hide mark scheme' : 'Show mark scheme';
    if (lastMock) renderMock(lastMock);
  });
  $('#mock-paper').className = 'paper empty';
  $('#mock-paper').innerHTML = '<p>Click <strong>Generate mock paper</strong> to build a randomised paper.</p>';
}

// Classify a question into a style bucket so the mock builder can honour
// the user's chosen mix of styles. Pearson "long" answers are anything 6m+
// with extended_levels; "short" is everything else that's regular text.
function styleOfQuestion(q) {
  if (q.type === 'multiple_choice') return 'mc';
  if (q.type === 'diagram' || q.type === 'draw' || q.command_verb === 'Draw') return 'diagram';
  if (q.type === 'extended_levels' || q.marks >= 6) return 'long';
  return 'short';
}

async function generateMock(total, seed, aims, styles) {
  if (!await ra10Gate('mock_paper_gen')) return;
  const rng = makeRng(seed);
  styles = styles && styles.length ? styles : ['pearson'];
  const pool = QUESTIONS.filter(q => aims.includes(q.learning_aim));
  if (!pool.length) { alert('No questions available for selected aims.'); return; }

  // ---- STYLE-FILTERED MODE ----
  // If the user picked specific styles (anything other than just "pearson"),
  // build the paper from those buckets in proportion to their selection.
  if (!(styles.length === 1 && styles[0] === 'pearson')) {
    const wanted = new Set(styles.filter(s => s !== 'pearson'));
    // If pearson is also on, treat it as "any style allowed" filler.
    const allowAny = styles.includes('pearson');
    const stylePool = {};
    pool.forEach(q => {
      const s = styleOfQuestion(q);
      if (wanted.has(s) || allowAny) (stylePool[s] = stylePool[s] || []).push(q);
    });
    Object.keys(stylePool).forEach(k => stylePool[k] = shuffle(stylePool[k], rng));

    if (!Object.keys(stylePool).length) { alert('No questions match the selected styles.'); return; }

    const items = [];
    const used = new Set();
    let acc = 0;
    // Round-robin over the chosen styles, picking the largest unused question
    // that still fits the remaining budget. Long+diagram items naturally land first.
    const order = (wanted.size ? Array.from(wanted) : Object.keys(stylePool)).slice();
    let safety = 200;
    while (acc < total && safety-- > 0) {
      let placedThisRound = false;
      for (const s of order) {
        if (acc >= total) break;
        const remaining = total - acc;
        const bucket = (stylePool[s] || []).filter(q => !used.has(q.id) && q.marks <= remaining);
        if (!bucket.length) continue;
        // Prefer larger items first so we don't end up with all 1m fillers.
        bucket.sort((a, b) => b.marks - a.marks);
        // But add some variety: pick from the top half at random.
        const top = bucket.slice(0, Math.max(1, Math.ceil(bucket.length / 2)));
        const pick = top[Math.floor(rng() * top.length)];
        items.push(pick); used.add(pick.id); acc += pick.marks;
        placedThisRound = true;
      }
      if (!placedThisRound) break;
    }
    // Final top-up with 1–2 mark fillers from any allowed style if still short.
    if (acc < total) {
      const fillers = pool.filter(q => !used.has(q.id) && q.marks <= (total - acc) && (allowAny || wanted.has(styleOfQuestion(q))))
                          .sort((a, b) => b.marks - a.marks);
      for (const q of fillers) {
        if (acc >= total) break;
        if (q.marks <= total - acc) { items.push(q); used.add(q.id); acc += q.marks; }
      }
    }
    // Ensure at least one diagram if user asked for diagrams.
    if (wanted.has('diagram') && !items.some(q => styleOfQuestion(q) === 'diagram')) {
      const diag = pool.filter(q => styleOfQuestion(q) === 'diagram');
      if (diag.length) items.push(diag[Math.floor(rng() * diag.length)]);
    }
    // Sort by mark size ascending so the paper warms up before extended items.
    items.sort((a, b) => a.marks - b.marks);
    lastMock = { items, total, seed, generatedAt: new Date().toISOString() };
    renderMock(lastMock);
    return;
  }

  // ---- PEARSON-STYLE (default) ----
  // Build a target mark template that mirrors a real 90m / 45m / 30m paper.
  let templates;
  if (total >= 90) {
    templates = [
      [1,1,2,2,3,4,4,6,8,9,12,12,12,8,6], // ~90 marks
      [1,2,2,3,4,4,6,6,8,9,12,12,8,4,9],
      [1,1,2,3,4,4,4,6,6,8,9,12,12,8,12]
    ];
  } else if (total >= 45) {
    templates = [
      [1,2,3,4,4,6,8,9,12], // 49
      [1,2,2,4,4,6,8,9,12], // 48
      [1,1,2,3,4,6,8,9,12]  // 46
    ];
  } else {
    templates = [
      [1,2,3,4,6,8,9],  // 33
      [1,2,4,4,6,8,9],  // 34
      [2,3,4,6,9,8],    // 32
      [1,2,4,6,8,12]    // 33
    ];
  }
  const tpl = templates[Math.floor(rng() * templates.length)].slice();
  while (tpl.reduce((a,b)=>a+b,0) > total) {
    let idx = -1, max = -1;
    for (let i = 0; i < tpl.length; i++) {
      if (tpl[i] > max && tpl[i] <= 4) { max = tpl[i]; idx = i; }
    }
    if (idx === -1) tpl.pop(); else tpl.splice(idx, 1);
  }

  // Exclude diagrams + MC from the regular Pearson template — they're inserted explicitly.
  const textPool = pool.filter(q => styleOfQuestion(q) !== 'diagram' && styleOfQuestion(q) !== 'mc');
  const byMark = {};
  textPool.forEach(q => { (byMark[q.marks] = byMark[q.marks] || []).push(q); });
  Object.keys(byMark).forEach(k => byMark[k] = shuffle(byMark[k], rng));
  const cursors = {};

  const items = [];
  const used = new Set();
  for (const m of tpl) {
    const bucket = byMark[m] || [];
    let picked = null;
    cursors[m] = cursors[m] || 0;
    for (let tries = 0; tries < bucket.length; tries++) {
      const q = bucket[(cursors[m] + tries) % bucket.length];
      if (!used.has(q.id)) { picked = q; cursors[m] += tries + 1; used.add(q.id); break; }
    }
    if (!picked) {
      const candidates = textPool.filter(q => !used.has(q.id)).sort((a,b)=>Math.abs(a.marks-m)-Math.abs(b.marks-m));
      picked = candidates[0];
      if (picked) used.add(picked.id);
    }
    if (picked) items.push(picked);
  }

  // Guarantee EXACTLY ONE diagram question per Pearson-style paper, swapping out
  // the largest non-extended short-answer item that matches the diagram's marks.
  const diagPool = shuffle(pool.filter(q => styleOfQuestion(q) === 'diagram'), rng);
  if (diagPool.length) {
    const diag = diagPool[0];
    let swapIdx = -1;
    for (let i = 0; i < items.length; i++) {
      if (items[i].marks === diag.marks && styleOfQuestion(items[i]) !== 'diagram') { swapIdx = i; break; }
    }
    if (swapIdx === -1) {
      // fallback: replace the closest-mark short-answer item
      let best = -1, diff = 99;
      for (let i = 0; i < items.length; i++) {
        if (styleOfQuestion(items[i]) === 'diagram') continue;
        const d = Math.abs(items[i].marks - diag.marks);
        if (d < diff) { diff = d; best = i; }
      }
      swapIdx = best;
    }
    if (swapIdx >= 0) items[swapIdx] = diag;
    used.add(diag.id);
  }

  lastMock = { items, total, seed, generatedAt: new Date().toISOString() };
  renderMock(lastMock);
}

function renderMock(mock) {
  const wrap = $('#mock-paper');
  wrap.className = 'paper' + (mockShowMs ? ' mock-with-ms' : '');
  wrap.innerHTML = '';
  const totalMarks = mock.items.reduce((s, q) => s + q.marks, 0);

  // Read header options from the controls
  const headerOpts = {
    name: $('#opt-header-name') ? $('#opt-header-name').checked : false,
    cls:  $('#opt-header-class') ? $('#opt-header-class').checked : false,
    date: $('#opt-header-date') ? $('#opt-header-date').checked : false,
    centre: $('#opt-header-centre') ? $('#opt-header-centre').checked : false,
    teacher: $('#opt-header-teacher') ? $('#opt-header-teacher').checked : false,
    custom: $('#opt-header-custom') ? $('#opt-header-custom').value.trim() : ''
  };
  const lineDensity = $('#opt-line-density') ? $('#opt-line-density').value : 'normal';

  wrap.appendChild(el('div', { class: 'paper-header' },
    el('h3', null, 'BTEC Level 3 IT — Unit 1: Information Technology Systems'),
    el('p', null, `Mock paper · ${totalMarks} marks · Time allowed: ${Math.round(totalMarks * 4 / 3)} minutes · Seed: ${mock.seed}`),
    el('p', { class: 'paper-instructions' }, 'Answer ALL questions. Write your answers in the space provided. The marks for each question are shown in brackets.')
  ));

  // Candidate header lines (Name / Class / Date / Centre / Teacher / Custom)
  const candidateRows = [];
  if (headerOpts.name)    candidateRows.push(['Name', 'name']);
  if (headerOpts.cls)     candidateRows.push(['Class', 'cls']);
  if (headerOpts.date)    candidateRows.push(['Date', 'date']);
  if (headerOpts.centre)  candidateRows.push(['Centre / Candidate №', 'centre']);
  if (headerOpts.teacher) candidateRows.push(['Teacher', 'teacher']);
  if (candidateRows.length || headerOpts.custom) {
    const ch = el('div', { class: 'candidate-header' });
    candidateRows.forEach(([label]) => {
      ch.appendChild(el('div', { class: 'ch-line' },
        el('span', { class: 'ch-label' }, label + ':'),
        el('span', { class: 'ch-fill' })
      ));
    });
    if (headerOpts.custom) {
      ch.appendChild(el('div', { class: 'ch-custom' }, headerOpts.custom));
    }
    wrap.appendChild(ch);
  }

  mock.items.forEach((q, i) => {
    const sx = el('div', { class: 'paper-section' });
    sx.appendChild(el('div', { class: 'section-tag' },
      `Question ${i + 1}`,
      el('span', { class: 'aim-pill' }, `Aim ${q.learning_aim}`)
    ));
    if (q.scenario) sx.appendChild(el('div', { class: 'scenario' }, q.scenario));
    const subQ = el('div', { class: 'paper-question' });
    subQ.appendChild(el('span', { class: 'qtext' },
      q.question,
      el('span', { class: 'marks-bracket' }, ` (${q.marks})`)
    ));
    sx.appendChild(subQ);
    if (q.type === 'diagram') {
      // Full page-sized blank space for the candidate to draw the diagram
      sx.appendChild(el('div', { class: 'diagram-space', 'aria-hidden': 'true' },
        el('span', { class: 'ds-label' }, `Draw your ${q.diagram_kind || 'diagram'} in the space below`)
      ));
    } else if (q.type === 'multiple_choice') {
      // MC questions print A–D options with a tick box next to each.
      const opts = el('ol', { class: 'mc-options' });
      (q.options || []).forEach(o => {
        opts.appendChild(el('li', null,
          el('span', { class: 'mc-tick' }),
          el('span', { class: 'mc-letter' }, o.label),
          el('span', { class: 'mc-text' }, o.text)
        ));
      });
      sx.appendChild(opts);
      sx.appendChild(el('p', { class: 'mc-instr' }, 'Tick (✓) the box next to your chosen answer.'));
    } else {
      // Answer lines — generous, mirroring the real Pearson booklets.
      // Real papers give roughly: 1m → 2 lines, 2m → 4, 3m → 6, 4m → 8,
      // 6m → 14, 8m → 18, 9m → 22, 12m → 28.
      const linesByMark = { 1: 2, 2: 4, 3: 6, 4: 8, 6: 14, 8: 18, 9: 22, 12: 28 };
      const baseLines = linesByMark[q.marks] || Math.max(2, q.marks * 2);
      const densityMult = { extra: 1.4, normal: 1, compact: 0.6, none: 0 }[lineDensity] || 1;
      const numLines = Math.round(baseLines * densityMult);
      if (numLines > 0) {
        const linesBox = el('div', { class: 'answer-lines', 'aria-hidden': 'true' });
        for (let l = 0; l < numLines; l++) linesBox.appendChild(el('div', { class: 'answer-line' }));
        sx.appendChild(linesBox);
      }
    }
    if (mockShowMs) {
      const msb = el('div', { class: 'ms-block' });
      msb.appendChild(renderMarkScheme(q));
      sx.appendChild(msb);
    }
    sx.appendChild(el('div', { class: 'paper-totals' }, `(Total for Question ${i + 1} = ${q.marks} mark${q.marks===1?'':'s'})`));
    wrap.appendChild(sx);
  });
  wrap.appendChild(el('div', { class: 'paper-totals', style: 'text-align:right;font-size:16px;margin-top:24px;border-top:2px solid #14201E;padding-top:12px;' }, `TOTAL FOR PAPER = ${totalMarks} MARKS`));
}

// ---------- Practice mode ----------
let practiceQueue = [];
let practiceIdx = 0;

function renderPracticeControls() {
  const aimSel = $('#practice-aim');
  ['A','B','C','D','E','F'].forEach(a => aimSel.appendChild(el('option', { value: a }, `Aim ${a}`)));
  const marksSel = $('#practice-marks');
  MARKS_OPTIONS.forEach(m => marksSel.appendChild(el('option', { value: String(m) }, `${m} mark${m===1?'':'s'}`)));
  $('#btn-practice-start').addEventListener('click', () => startPractice());
  $('#practice-card').innerHTML = '<p class="muted" style="padding:40px;text-align:center;">Pick filters and click <strong>Start session</strong>.</p>';
}

async function startPractice() {
  if (!await ra10Gate('practice_question')) return;
  const aim = $('#practice-aim').value;
  const marks = $('#practice-marks').value;
  let pool = QUESTIONS.slice();
  if (aim) pool = pool.filter(q => q.learning_aim === aim);
  if (marks) pool = pool.filter(q => String(q.marks) === marks);
  window._practiceSession = {
    aims: aim ? [aim] : ['A','B','C','D','E','F'],
    total: 0, correct: 0, aimBreakdown: {}
  };
  if (!pool.length) { alert('No questions match those filters.'); return; }
  practiceQueue = shuffle(pool);
  practiceIdx = 0;
  renderPracticeCard();
}

function updatePracticeSessionFromUi(q, automarkHost) {
  if (window._practiceSession) {
    const ps = window._practiceSession;
    ps.total++;
    const aim = q.learning_aim || q.learningaim;
    ps.aimBreakdown[aim] = ps.aimBreakdown[aim] || { correct: 0, total: 0 };
    ps.aimBreakdown[aim].total++;
    const scoreNum = parseInt(automarkHost.querySelector('.value')?.textContent || '0', 10);
    if (scoreNum >= Math.ceil(q.marks / 2)) {
      ps.correct++;
      ps.aimBreakdown[aim].correct++;
    }
    saveSession('practice', { ...ps, aims: Object.keys(ps.aimBreakdown) });
  }
}

function renderPracticeCard() {
  const wrap = $('#practice-card');
  wrap.innerHTML = '';
  if (!practiceQueue.length) return;
  const q = practiceQueue[practiceIdx];
  $('#practice-progress').textContent = `Question ${practiceIdx + 1} of ${practiceQueue.length}`;

  const card = el('div', { class: 'practice-card' });
  card.appendChild(el('div', { class: 'qrow-meta' },
    el('span', { class: 'tag id' }, q.id),
    el('span', { class: 'tag' }, `Aim ${q.learning_aim}`),
    el('span', { class: 'tag verb' }, q.command_verb),
    el('span', { class: 'tag marks' }, `${q.marks} mark${q.marks===1?'':'s'}`)
  ));
  if (q.scenario) card.appendChild(el('div', { class: 'scenario' }, q.scenario));
  card.appendChild(el('p', { class: 'question' }, q.question, el('span', { class: 'marks-bracket' }, ` (${q.marks})`)));

  // Diagram questions get a sketch canvas; MC gets clickable A–D options;
  // everything else gets a textarea.
  let ta = null;
  let mcChoice = { value: null };
  if (q.type === 'diagram') {
    const diagramTool = buildDiagramTool(q);
    card.appendChild(diagramTool.wrap);
  } else if (q.type === 'multiple_choice') {
    card.appendChild(buildMcOptions(q, mcChoice));
  } else {
    ta = el('textarea', { placeholder: 'Type your answer here…' });
    card.appendChild(ta);
  }

  const actions = el('div', { class: 'practice-actions' });
  const btnLabel = q.type === 'diagram' ? 'Self-mark with mark scheme'
                 : q.type === 'multiple_choice' ? 'Check my answer'
                 : 'Auto-mark my answer';
  const btnAutoMark = el('button', { class: 'btn primary' }, btnLabel);
  const btnReveal = el('button', { class: 'btn' }, 'Reveal mark scheme');
  const btnNext = el('button', { class: 'btn' }, 'Next question →');
  const btnPrev = el('button', { class: 'btn ghost' }, '← Previous');
  btnPrev.disabled = practiceIdx === 0;
  btnNext.disabled = practiceIdx >= practiceQueue.length - 1;
  actions.appendChild(btnAutoMark);
  actions.appendChild(btnReveal);
  actions.appendChild(btnPrev);
  actions.appendChild(btnNext);
  card.appendChild(actions);

  const automarkHost = el('div', { class: 'automark-host' });
  card.appendChild(automarkHost);

  const msBox = el('div', { class: 'practice-msbox', style: 'display:none;' });
  msBox.appendChild(renderMarkScheme(q));
  card.appendChild(msBox);

  btnReveal.addEventListener('click', () => {
    msBox.style.display = msBox.style.display === 'none' ? 'block' : 'none';
    btnReveal.textContent = msBox.style.display === 'none' ? 'Reveal mark scheme' : 'Hide mark scheme';
  });
  btnAutoMark.addEventListener('click', async () => {
    if (!(await ra10Gate('ai_mark'))) return;
    if (q.type === 'diagram') {
      automarkHost.innerHTML = '';
      automarkHost.appendChild(buildSelfMarkUI(q));
      automarkHost.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }
    if (q.type === 'multiple_choice') {
      if (!mcChoice.value) { alert('Pick an answer (A–D) first.'); return; }
      automarkHost.innerHTML = '';
      automarkHost.appendChild(buildMcResultUI(q, mcChoice.value));
      updatePracticeSessionFromUi(q, automarkHost);
      automarkHost.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }
    const answer = ta.value.trim();
    if (!answer) { alert('Write an answer first, then I can mark it.'); return; }
    automarkHost.innerHTML = '';
    automarkHost.appendChild(buildAutoMarkUI(q, answer));
    updatePracticeSessionFromUi(q, automarkHost);
    automarkHost.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  btnNext.addEventListener('click', () => { practiceIdx++; renderPracticeCard(); });
  btnPrev.addEventListener('click', () => { practiceIdx--; renderPracticeCard(); });

  wrap.appendChild(card);
}

// ---------- Diagram tool (draw + builder modes) ----------
function buildDiagramTool(q) {
  const wrap = el('div', { class: 'diagram-tool-wrap' });
  const tabs = el('div', { class: 'diagram-mode-tabs' });
  const drawTab = el('button', { class: 'btn primary', type: 'button' }, 'Draw');
  const buildTab = el('button', { class: 'btn', type: 'button' }, 'Build');
  tabs.appendChild(drawTab);
  tabs.appendChild(buildTab);

  const drawPane = el('div', { class: 'diagram-pane diagram-pane-active' });
  const drawToolbar = el('div', { class: 'sketch-toolbar' });
  const drawCanvas = el('canvas', { class: 'sketch-canvas', width: '900', height: '500' });
  const drawHint = el('span', { class: 'sketch-hint muted' }, 'Draw freehand, or switch to Build mode to place shapes and connectors.');
  const drawCtx = drawCanvas.getContext('2d');

  function fitDrawCanvas() {
    const ratio = window.devicePixelRatio || 1;
    const cssW = drawCanvas.clientWidth || 900;
    const cssH = 500;
    drawCanvas.width = cssW * ratio;
    drawCanvas.height = cssH * ratio;
    drawCanvas.style.height = cssH + 'px';
    drawCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
    drawCtx.fillStyle = '#ffffff';
    drawCtx.fillRect(0, 0, cssW, cssH);
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';
  }
  setTimeout(fitDrawCanvas, 0);

  let drawing = false;
  let last = null;
  let strokeColor = '#14201E';
  let strokeWidth = 2;

  function drawPos(e) {
    const r = drawCanvas.getBoundingClientRect();
    const t = e.touches && e.touches[0];
    const x = (t ? t.clientX : e.clientX) - r.left;
    const y = (t ? t.clientY : e.clientY) - r.top;
    return { x, y };
  }

  function drawDown(e) { e.preventDefault(); drawing = true; last = drawPos(e); }
  function drawMove(e) {
    if (!drawing) return;
    e.preventDefault();
    const p = drawPos(e);
    drawCtx.strokeStyle = strokeColor;
    drawCtx.lineWidth = strokeWidth;
    drawCtx.beginPath();
    drawCtx.moveTo(last.x, last.y);
    drawCtx.lineTo(p.x, p.y);
    drawCtx.stroke();
    last = p;
  }
  function drawUp() { drawing = false; last = null; }

  drawCanvas.addEventListener('mousedown', drawDown);
  drawCanvas.addEventListener('mousemove', drawMove);
  window.addEventListener('mouseup', drawUp);
  drawCanvas.addEventListener('touchstart', drawDown, { passive: false });
  drawCanvas.addEventListener('touchmove', drawMove, { passive: false });
  drawCanvas.addEventListener('touchend', drawUp);

  function drawBtn(label, onClick, cls) {
    const b = el('button', { class: 'btn ' + (cls || ''), type: 'button' }, label);
    b.addEventListener('click', onClick);
    return b;
  }

  const penBtn = drawBtn('Pen', () => { strokeColor = '#14201E'; strokeWidth = 2; setDrawActive(penBtn); }, 'primary');
  const eraseBtn = drawBtn('Eraser', () => { strokeColor = '#ffffff'; strokeWidth = 16; setDrawActive(eraseBtn); });
  const clearDrawBtn = drawBtn('Clear', () => fitDrawCanvas(), 'ghost');
  const saveDrawBtn = drawBtn('Download as PNG', () => {
    const link = document.createElement('a');
    link.download = 'diagram-draw-' + (q.id || 'sketch') + '.png';
    link.href = drawCanvas.toDataURL('image/png');
    link.click();
  }, 'ghost');

  function setDrawActive(active) {
    [penBtn, eraseBtn].forEach(b => b.classList.remove('primary'));
    active.classList.add('primary');
  }

  drawToolbar.appendChild(penBtn);
  drawToolbar.appendChild(eraseBtn);
  drawToolbar.appendChild(clearDrawBtn);
  drawToolbar.appendChild(saveDrawBtn);
  drawPane.appendChild(drawToolbar);
  drawPane.appendChild(drawCanvas);
  drawPane.appendChild(drawHint);

  const buildPane = el('div', { class: 'diagram-pane' });
  const buildLayout = el('div', { class: 'diagram-builder-layout' });
  const panel = el('div', { class: 'diagram-builder-panel' });
  const canvasWrap = el('div', { class: 'diagram-builder-canvas-wrap' });
  const buildCanvas = el('canvas', { class: 'diagram-builder-canvas', width: '1000', height: '560' });
  const buildCtx = buildCanvas.getContext('2d');

  const toolGroup = el('div', { class: 'diagram-tool-buttons' });
  const textInput = el('input', { type: 'text', class: 'field-input', placeholder: 'Shape text (optional)' });
  const colorInput = el('input', { type: 'color', value: '#ffffff', class: 'diagram-color-input' });
  const deleteBtn = el('button', { class: 'btn', type: 'button' }, 'Delete selected');
  const clearAllBtn = el('button', { class: 'btn ghost', type: 'button' }, 'Clear all');
  const saveBuildBtn = el('button', { class: 'btn', type: 'button' }, 'Download as PNG');

  const tools = [
    { key: 'rect', label: '[ ] Rectangle' },
    { key: 'diamond', label: '<> Diamond' },
    { key: 'oval', label: '( ) Start/End' },
    { key: 'parallelogram', label: '/_/ Input/Output' },
    { key: 'connector', label: '--> Connector' },
  ];

  let activeTool = 'rect';
  const shapes = [];
  const connectors = [];
  const grid = 20;
  let selectedShape = -1;
  let resizeHandle = null;
  let dragging = false;
  let dragDX = 0;
  let dragDY = 0;
  let connectFrom = -1;
  let textEditor = null;

  function snap(n) {
    return Math.round(n / grid) * grid;
  }

  function setTool(key) {
    activeTool = key;
    connectFrom = -1;
    Array.from(toolGroup.querySelectorAll('button')).forEach((b) => {
      b.classList.toggle('primary', b.dataset.tool === key);
    });
  }

  function makeToolButton(t) {
    const b = el('button', { class: 'btn', type: 'button', 'data-tool': t.key }, t.label);
    b.addEventListener('click', () => setTool(t.key));
    return b;
  }

  tools.forEach((t) => toolGroup.appendChild(makeToolButton(t)));
  setTool('rect');

  function drawGrid() {
    buildCtx.strokeStyle = '#edf0ea';
    buildCtx.lineWidth = 1;
    for (let x = 0; x <= buildCanvas.width; x += grid) {
      buildCtx.beginPath();
      buildCtx.moveTo(x + 0.5, 0);
      buildCtx.lineTo(x + 0.5, buildCanvas.height);
      buildCtx.stroke();
    }
    for (let y = 0; y <= buildCanvas.height; y += grid) {
      buildCtx.beginPath();
      buildCtx.moveTo(0, y + 0.5);
      buildCtx.lineTo(buildCanvas.width, y + 0.5);
      buildCtx.stroke();
    }
  }

  function centerOf(shape) {
    return { x: shape.x + shape.w / 2, y: shape.y + shape.h / 2 };
  }

  function roundedRectPath(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.lineTo(x + w - rr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
    ctx.lineTo(x + w, y + h - rr);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    ctx.lineTo(x + rr, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
    ctx.lineTo(x, y + rr);
    ctx.quadraticCurveTo(x, y, x + rr, y);
    ctx.closePath();
  }

  function drawShape(s, idx) {
    buildCtx.save();
    buildCtx.fillStyle = s.fill || '#ffffff';
    buildCtx.strokeStyle = '#14201E';
    buildCtx.lineWidth = 2;

    if (s.type === 'rect') {
      buildCtx.beginPath();
      buildCtx.rect(s.x, s.y, s.w, s.h);
      buildCtx.fill();
      buildCtx.stroke();
    } else if (s.type === 'diamond') {
      buildCtx.beginPath();
      buildCtx.moveTo(s.x + s.w / 2, s.y);
      buildCtx.lineTo(s.x + s.w, s.y + s.h / 2);
      buildCtx.lineTo(s.x + s.w / 2, s.y + s.h);
      buildCtx.lineTo(s.x, s.y + s.h / 2);
      buildCtx.closePath();
      buildCtx.fill();
      buildCtx.stroke();
    } else if (s.type === 'oval') {
      roundedRectPath(buildCtx, s.x, s.y, s.w, s.h, Math.min(30, s.h / 2));
      buildCtx.fill();
      buildCtx.stroke();
    } else if (s.type === 'parallelogram') {
      const skew = Math.max(18, Math.round(s.w * 0.15));
      buildCtx.beginPath();
      buildCtx.moveTo(s.x + skew, s.y);
      buildCtx.lineTo(s.x + s.w, s.y);
      buildCtx.lineTo(s.x + s.w - skew, s.y + s.h);
      buildCtx.lineTo(s.x, s.y + s.h);
      buildCtx.closePath();
      buildCtx.fill();
      buildCtx.stroke();
    }

    buildCtx.fillStyle = '#14201E';
    buildCtx.textAlign = 'center';
    buildCtx.textBaseline = 'middle';
    buildCtx.font = '14px Satoshi, sans-serif';
    const txt = String(s.text || '').slice(0, 70);
    buildCtx.fillText(txt, s.x + s.w / 2, s.y + s.h / 2, s.w - 16);

    if (idx === selectedShape) {
      buildCtx.strokeStyle = '#00594E';
      buildCtx.setLineDash([5, 4]);
      buildCtx.strokeRect(s.x - 4, s.y - 4, s.w + 8, s.h + 8);
      buildCtx.setLineDash([]);
      const handles = getHandles(s);
      buildCtx.fillStyle = '#00594E';
      handles.forEach((h) => buildCtx.fillRect(h.x - 4, h.y - 4, 8, 8));
    }

    buildCtx.restore();
  }

  function drawConnectors() {
    buildCtx.save();
    buildCtx.strokeStyle = '#14201E';
    buildCtx.fillStyle = '#14201E';
    buildCtx.lineWidth = 2;
    connectors.forEach((c) => {
      const from = shapes[c.from];
      const to = shapes[c.to];
      if (!from || !to) return;
      const a = centerOf(from);
      const b = centerOf(to);
      buildCtx.beginPath();
      buildCtx.moveTo(a.x, a.y);
      buildCtx.lineTo(b.x, b.y);
      buildCtx.stroke();

      const angle = Math.atan2(b.y - a.y, b.x - a.x);
      const arrowLen = 10;
      buildCtx.beginPath();
      buildCtx.moveTo(b.x, b.y);
      buildCtx.lineTo(b.x - arrowLen * Math.cos(angle - Math.PI / 6), b.y - arrowLen * Math.sin(angle - Math.PI / 6));
      buildCtx.lineTo(b.x - arrowLen * Math.cos(angle + Math.PI / 6), b.y - arrowLen * Math.sin(angle + Math.PI / 6));
      buildCtx.closePath();
      buildCtx.fill();
    });
    buildCtx.restore();
  }

  function renderBuilder() {
    buildCtx.clearRect(0, 0, buildCanvas.width, buildCanvas.height);
    drawGrid();
    drawConnectors();
    shapes.forEach((s, idx) => drawShape(s, idx));
  }

  function addShape(type, x, y) {
    const defaults = { x: snap(x), y: snap(y), w: 180, h: 90, text: textInput.value.trim(), fill: colorInput.value };
    if (type === 'diamond') {
      defaults.w = 180;
      defaults.h = 110;
    }
    if (type === 'oval') {
      defaults.w = 190;
      defaults.h = 80;
    }
    if (type === 'parallelogram') {
      defaults.w = 200;
      defaults.h = 90;
    }
    shapes.push({ type, x: defaults.x, y: defaults.y, w: defaults.w, h: defaults.h, text: defaults.text, fill: defaults.fill });
    selectedShape = shapes.length - 1;
    renderBuilder();
  }

  function canvasPos(e) {
    const r = buildCanvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function hitShape(x, y) {
    for (let i = shapes.length - 1; i >= 0; i--) {
      const s = shapes[i];
      if (x >= s.x && x <= s.x + s.w && y >= s.y && y <= s.y + s.h) return i;
    }
    return -1;
  }

  function getHandles(s) {
    return [
      { key: 'nw', x: s.x, y: s.y },
      { key: 'ne', x: s.x + s.w, y: s.y },
      { key: 'sw', x: s.x, y: s.y + s.h },
      { key: 'se', x: s.x + s.w, y: s.y + s.h },
    ];
  }

  function hitHandle(s, x, y) {
    const hs = getHandles(s);
    for (let i = 0; i < hs.length; i++) {
      const h = hs[i];
      if (Math.abs(x - h.x) <= 7 && Math.abs(y - h.y) <= 7) return h.key;
    }
    return null;
  }

  function startTextEdit(idx) {
    if (idx < 0 || !shapes[idx]) return;
    if (textEditor) textEditor.remove();
    const s = shapes[idx];
    const input = el('input', { type: 'text', class: 'diagram-inline-editor' });
    input.value = s.text || '';
    input.style.left = (s.x + 8) + 'px';
    input.style.top = (s.y + s.h / 2 - 14) + 'px';
    input.style.width = Math.max(80, s.w - 16) + 'px';
    canvasWrap.appendChild(input);
    textEditor = input;
    input.focus();
    input.select();
    function commit() {
      s.text = input.value.trim();
      input.remove();
      textEditor = null;
      renderBuilder();
    }
    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') commit();
      if (ev.key === 'Escape') { input.remove(); textEditor = null; renderBuilder(); }
    });
    input.addEventListener('blur', commit);
  }

  buildCanvas.addEventListener('mousedown', (e) => {
    const p = canvasPos(e);
    const idx = hitShape(p.x, p.y);
    if (idx >= 0) {
      selectedShape = idx;
      const s = shapes[idx];
      const h = hitHandle(s, p.x, p.y);
      if (h) {
        resizeHandle = h;
      } else if (activeTool === 'connector') {
        if (connectFrom < 0) connectFrom = idx;
        else if (connectFrom !== idx) {
          connectors.push({ from: connectFrom, to: idx });
          connectFrom = -1;
        }
      } else {
        dragging = true;
        dragDX = p.x - s.x;
        dragDY = p.y - s.y;
      }
      renderBuilder();
      return;
    }

    selectedShape = -1;
    connectFrom = -1;
    if (activeTool !== 'connector') {
      addShape(activeTool, p.x, p.y);
    } else {
      renderBuilder();
    }
  });

  buildCanvas.addEventListener('mousemove', (e) => {
    if (selectedShape < 0) return;
    const p = canvasPos(e);
    const s = shapes[selectedShape];
    if (!s) return;

    if (dragging) {
      s.x = snap(Math.max(0, Math.min(buildCanvas.width - s.w, p.x - dragDX)));
      s.y = snap(Math.max(0, Math.min(buildCanvas.height - s.h, p.y - dragDY)));
      renderBuilder();
      return;
    }

    if (resizeHandle) {
      const minW = 80;
      const minH = 50;
      if (resizeHandle.indexOf('e') >= 0) s.w = Math.max(minW, snap(p.x - s.x));
      if (resizeHandle.indexOf('s') >= 0) s.h = Math.max(minH, snap(p.y - s.y));
      if (resizeHandle.indexOf('w') >= 0) {
        const right = s.x + s.w;
        s.x = snap(Math.max(0, p.x));
        s.w = Math.max(minW, right - s.x);
      }
      if (resizeHandle.indexOf('n') >= 0) {
        const bottom = s.y + s.h;
        s.y = snap(Math.max(0, p.y));
        s.h = Math.max(minH, bottom - s.y);
      }
      renderBuilder();
    }
  });

  window.addEventListener('mouseup', () => {
    dragging = false;
    resizeHandle = null;
  });

  buildCanvas.addEventListener('dblclick', (e) => {
    const p = canvasPos(e);
    const idx = hitShape(p.x, p.y);
    if (idx >= 0) {
      selectedShape = idx;
      startTextEdit(idx);
    }
  });

  deleteBtn.addEventListener('click', () => {
    if (selectedShape < 0) return;
    shapes.splice(selectedShape, 1);
    for (let i = connectors.length - 1; i >= 0; i--) {
      if (connectors[i].from === selectedShape || connectors[i].to === selectedShape) {
        connectors.splice(i, 1);
      } else {
        if (connectors[i].from > selectedShape) connectors[i].from -= 1;
        if (connectors[i].to > selectedShape) connectors[i].to -= 1;
      }
    }
    selectedShape = -1;
    connectFrom = -1;
    renderBuilder();
  });

  clearAllBtn.addEventListener('click', () => {
    shapes.length = 0;
    connectors.length = 0;
    selectedShape = -1;
    connectFrom = -1;
    if (textEditor) {
      textEditor.remove();
      textEditor = null;
    }
    renderBuilder();
  });

  saveBuildBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'diagram-build-' + (q.id || 'diagram') + '.png';
    link.href = buildCanvas.toDataURL('image/png');
    link.click();
  });

  panel.appendChild(el('div', { class: 'diagram-panel-title' }, 'Shapes'));
  panel.appendChild(toolGroup);
  panel.appendChild(el('label', { class: 'field-label' }, 'Text preset'));
  panel.appendChild(textInput);
  panel.appendChild(el('label', { class: 'field-label' }, 'Fill color'));
  panel.appendChild(colorInput);
  panel.appendChild(deleteBtn);
  panel.appendChild(clearAllBtn);
  panel.appendChild(saveBuildBtn);
  panel.appendChild(el('p', { class: 'muted', style: 'margin-top:10px;' }, 'Connector tool: click source shape, then target shape.'));

  canvasWrap.appendChild(buildCanvas);
  buildLayout.appendChild(panel);
  buildLayout.appendChild(canvasWrap);
  buildPane.appendChild(buildLayout);

  function setMode(mode) {
    const drawOn = mode === 'draw';
    drawPane.classList.toggle('diagram-pane-active', drawOn);
    buildPane.classList.toggle('diagram-pane-active', !drawOn);
    drawTab.classList.toggle('primary', drawOn);
    buildTab.classList.toggle('primary', !drawOn);
  }

  drawTab.addEventListener('click', () => setMode('draw'));
  buildTab.addEventListener('click', () => setMode('build'));

  wrap.appendChild(tabs);
  wrap.appendChild(drawPane);
  wrap.appendChild(buildPane);

  renderBuilder();
  return { wrap };
}

// ---------- Self-mark UI (used for diagram questions) ----------
function buildSelfMarkUI(q) {
  const points = (q.mark_scheme && q.mark_scheme.points) || [];
  const box = el('div', { class: 'automark-box' });
  const head = el('div', { class: 'automark-head' });
  head.appendChild(el('span', { class: 'am-eyebrow' }, 'Self-mark your diagram'));
  const scoreSpan = el('span', { class: 'automark-score' });
  const scoreNum = el('span', { class: 'value' }, '0');
  scoreSpan.appendChild(scoreNum);
  scoreSpan.appendChild(el('span', { class: 'total' }, `/ ${q.marks}`));
  head.appendChild(scoreSpan);
  box.appendChild(head);

  box.appendChild(el('p', { class: 'automark-detail' },
    'Tick each criterion your diagram meets. Each tick is worth one mark.'));

  const list = el('div', { class: 'selfmark-list' });
  const checked = new Set();
  points.forEach((pt, i) => {
    const id = 'sm-' + q.id + '-' + i;
    const row = el('label', { class: 'selfmark-row', for: id });
    const cb = el('input', { type: 'checkbox', id });
    cb.addEventListener('change', () => {
      if (cb.checked) checked.add(i); else checked.delete(i);
      // Cap at q.marks
      const n = Math.min(checked.size, q.marks);
      scoreNum.textContent = String(n);
    });
    row.appendChild(cb);
    row.appendChild(el('span', { html: escapeHTML(pt).replace(/\(1\)/g, '<strong>(1)</strong>') }));
    list.appendChild(row);
  });
  box.appendChild(list);

  if (q.mark_scheme && q.mark_scheme.additional_guidance) {
    box.appendChild(el('p', { class: 'automark-detail', style: 'font-style:italic;' }, q.mark_scheme.additional_guidance));
  }
  if (q.mark_scheme && q.mark_scheme.do_not_accept) {
    box.appendChild(el('p', { class: 'automark-detail', style: 'color:var(--warn);' }, 'Do not accept: ' + q.mark_scheme.do_not_accept));
  }
  return box;
}

// ---------- Multiple choice (practice mode) ----------
function buildMcOptions(q, choiceRef) {
  const wrap = el('div', { class: 'mc-practice' });
  (q.options || []).forEach(o => {
    const id = 'mc-' + q.id + '-' + o.label;
    const row = el('label', { class: 'mc-practice-row', for: id });
    const radio = el('input', { type: 'radio', name: 'mc-' + q.id, id, value: o.label });
    radio.addEventListener('change', () => { choiceRef.value = o.label; });
    row.appendChild(radio);
    row.appendChild(el('span', { class: 'mc-practice-letter' }, o.label));
    row.appendChild(el('span', { class: 'mc-practice-text' }, o.text));
    wrap.appendChild(row);
  });
  return wrap;
}

function buildMcResultUI(q, picked) {
  const m = q.mark_scheme || {};
  const correct = m.answer;
  const isRight = picked === correct;
  const correctOpt = (q.options || []).find(o => o.label === correct);
  const box = el('div', { class: 'automark-box' });
  const head = el('div', { class: 'automark-head' });
  head.appendChild(el('span', { class: 'am-eyebrow' }, isRight ? 'Correct' : 'Incorrect'));
  const scoreSpan = el('span', { class: 'automark-score' + (isRight ? ' am-good' : ' am-bad') });
  scoreSpan.appendChild(el('span', { class: 'value' }, isRight ? '1' : '0'));
  scoreSpan.appendChild(el('span', { class: 'total' }, '/ 1'));
  head.appendChild(scoreSpan);
  box.appendChild(head);
  box.appendChild(el('p', { class: 'automark-detail' },
    el('strong', null, 'You picked: '), picked,
    el('br'),
    el('strong', null, 'Correct answer: '), correct + (correctOpt ? ' — ' + correctOpt.text : '')
  ));
  if (m.explanation) box.appendChild(el('p', { class: 'automark-detail', style: 'font-style:italic;' }, m.explanation));
  return box;
}

// ---------- Auto-marking ----------
const STOP_WORDS = new Set(['the','a','an','and','or','but','of','to','in','on','at','for','with','by','from','as','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','can','that','this','these','those','it','its','their','they','them','he','she','his','her','i','you','your','we','us','our','if','than','then','so','not','no','also','about','into','more','most','some','any','one','two','use','used','using','make','makes','made','allow','allows','allowed','provide','provides','provided','example','e.g.','i.e.','such','very','accept','reject','any','one','mark','marks','award','points','point','idea']);

function tokenise(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/\(\d+\)/g, ' ')
    .replace(/[\u2013\u2014]/g, ' ')
    .replace(/[^a-z0-9'\-\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}
function contentTokens(text) {
  return tokenise(text).filter(t => !STOP_WORDS.has(t) && t.length > 2);
}
// Extract one or more keyword phrases for each scheme point.
// We split on common separators (;, /, ' or ', ' and ' as cue) and clean.
function extractSchemeKeywords(point) {
  // Strip mark indicators like (1)
  let p = String(point || '').replace(/\(\d+\)/g, '').trim();
  // Split into clauses (each clause is essentially a separately markable idea)
  const clauses = p.split(/[;\u2013\u2014]|\s\/\s|\sor\s|,\s+(?=[A-Z])/i)
    .map(c => c.trim())
    .filter(Boolean);
  return clauses.length ? clauses : [p];
}
// Score a clause against an answer: returns { hit: boolean, matched: string[] }
function matchClause(clause, answerTokens) {
  const kw = contentTokens(clause);
  if (!kw.length) return { hit: false, matched: [] };
  const answerSet = new Set(answerTokens);
  // partial-stem match: a clause is "hit" when at least 50% of its content tokens appear (or any 2+ tokens for short clauses)
  const matched = kw.filter(k => answerSet.has(k) || [...answerSet].some(a => a.length > 4 && (a.startsWith(k.slice(0, 5)) || k.startsWith(a.slice(0, 5)))));
  const need = Math.max(1, Math.ceil(kw.length * 0.5));
  return { hit: matched.length >= need, matched, need, total: kw.length };
}

function autoMarkShort(q, answer) {
  const points = (q.mark_scheme && q.mark_scheme.points) || [];
  const answerTokens = contentTokens(answer);
  const lines = [];
  let earned = 0;
  points.forEach(pt => {
    const clauses = extractSchemeKeywords(pt);
    const clauseResults = clauses.map(c => matchClause(c, answerTokens));
    const anyHit = clauseResults.some(r => r.hit);
    lines.push({
      label: pt,
      hit: anyHit,
      details: clauseResults.map(r => `${r.matched.length}/${r.total} keywords`).join(' · ')
    });
    if (anyHit) earned++;
  });
  earned = Math.min(earned, q.marks);
  return { type: 'short', earned, max: q.marks, lines };
}

function autoMarkExtended(q, answer) {
  const ic = (q.mark_scheme && q.mark_scheme.indicative_content) || [];
  const answerTokens = contentTokens(answer);
  const wordCount = tokenise(answer).length;
  const lines = [];
  let hits = 0;
  ic.forEach(pt => {
    const r = matchClause(pt, answerTokens);
    lines.push({ label: pt, hit: r.hit, details: `${r.matched.length}/${r.total} keywords` });
    if (r.hit) hits++;
  });
  const coverage = ic.length ? (hits / ic.length) : 0;
  // Determine level from level descriptors: pick band based on coverage AND length signal.
  const lds = (q.mark_scheme && q.mark_scheme.level_descriptors) || [];
  // Sort by level number ascending (skip level 0)
  const bands = lds.filter(d => Number(d.level) > 0).sort((a,b)=>Number(a.level)-Number(b.level));
  let level = 0;
  let lengthFactor = 0;
  if (q.marks >= 12) lengthFactor = wordCount >= 220 ? 1 : wordCount >= 130 ? 0.7 : wordCount >= 60 ? 0.45 : 0.2;
  else if (q.marks >= 9) lengthFactor = wordCount >= 170 ? 1 : wordCount >= 100 ? 0.7 : wordCount >= 50 ? 0.45 : 0.2;
  else if (q.marks >= 8) lengthFactor = wordCount >= 150 ? 1 : wordCount >= 90  ? 0.7 : wordCount >= 45 ? 0.45 : 0.2;
  else                   lengthFactor = wordCount >= 110 ? 1 : wordCount >= 60  ? 0.7 : wordCount >= 30 ? 0.45 : 0.2;
  const score = coverage * 0.7 + lengthFactor * 0.3;
  if (bands.length === 3) {
    if (score >= 0.66) level = 3; else if (score >= 0.36) level = 2; else if (score > 0.05) level = 1; else level = 0;
  } else if (bands.length === 2) {
    level = score >= 0.55 ? 2 : score > 0.05 ? 1 : 0;
  } else if (bands.length === 1) {
    level = score > 0.1 ? 1 : 0;
  }
  // Pick a mark inside the chosen band.
  let earned = 0;
  let bandStr = '';
  if (level > 0) {
    const band = bands.find(b => Number(b.level) === level);
    if (band) {
      bandStr = String(band.marks || '');
      const m = bandStr.match(/(\d+)\s*[\-\u2013]\s*(\d+)/);
      if (m) {
        const lo = parseInt(m[1], 10), hi = parseInt(m[2], 10);
        // position within band by score percentile inside the level
        const inLevel = level === 3 ? (score - 0.66) / 0.34 : level === 2 ? (score - 0.36) / 0.30 : (score - 0.05) / 0.31;
        const t = Math.max(0, Math.min(1, inLevel));
        earned = Math.round(lo + (hi - lo) * t);
      } else {
        earned = parseInt(bandStr, 10) || 0;
      }
    }
  }
  return { type: 'extended', earned, max: q.marks, level, levelMarks: bandStr, lines, coverage, lengthFactor, wordCount };
}

function buildAutoMarkUI(q, answer) {
  const isExt = q.type === 'extended_levels' || (q.mark_scheme && q.mark_scheme.indicative_content);
  const result = isExt ? autoMarkExtended(q, answer) : autoMarkShort(q, answer);

  const box = el('div', { class: 'automark-box' });
  const head = el('div', { class: 'automark-head' });
  head.appendChild(el('span', { class: 'am-eyebrow' }, 'Auto-mark estimate'));
  const scoreSpan = el('span', { class: 'automark-score' });
  const scoreNum = el('span', { class: 'value' }, String(result.earned));
  scoreSpan.appendChild(scoreNum);
  scoreSpan.appendChild(el('span', { class: 'total' }, `/ ${result.max}`));
  head.appendChild(scoreSpan);

  const adjust = el('div', { class: 'automark-adjust' });
  const minus = el('button', { class: 'btn' }, '−');
  const plus  = el('button', { class: 'btn' }, '+');
  minus.addEventListener('click', () => {
    const v = parseInt(scoreNum.textContent, 10);
    if (v > 0) scoreNum.textContent = String(v - 1);
  });
  plus.addEventListener('click', () => {
    const v = parseInt(scoreNum.textContent, 10);
    if (v < result.max) scoreNum.textContent = String(v + 1);
  });
  adjust.appendChild(minus); adjust.appendChild(plus);
  head.appendChild(adjust);

  if (isExt && result.level) {
    head.appendChild(el('span', { class: 'automark-level' }, `Level ${result.level} (${result.levelMarks || ''})`));
  }
  box.appendChild(head);

  const blurb = isExt
    ? `Estimated by checking how many indicative-content points appear in your answer (${Math.round(result.coverage * 100)}% covered, ${result.wordCount} words). Adjust the mark with + / − if you'd grade differently.`
    : `Estimated by matching key phrases from each scheme point against your answer. Adjust the mark with + / − if you'd grade differently.`;
  box.appendChild(el('p', { class: 'automark-detail' }, blurb));

  const detail = el('div', { class: 'automark-detail automark-hits' });
  detail.appendChild(el('strong', null, isExt ? 'Indicative-content coverage:' : 'Scheme-point check:'));
  const ul = el('ul');
  result.lines.forEach(l => {
    ul.appendChild(el('li', { class: l.hit ? 'hit' : 'miss', title: l.details || '' }, l.label));
  });
  detail.appendChild(ul);
  box.appendChild(detail);

  // Toggle full mark scheme ("I'll mark it myself")
  const showMsBtn = el('button', { class: 'btn ghost', style: 'margin-top:14px;' }, 'Show full mark scheme');
  const msHolder = el('div', { style: 'display:none; margin-top:12px;' });
  msHolder.appendChild(renderMarkScheme(q));
  showMsBtn.addEventListener('click', () => {
    const open = msHolder.style.display === 'block';
    msHolder.style.display = open ? 'none' : 'block';
    showMsBtn.textContent = open ? 'Show full mark scheme' : 'Hide full mark scheme';
  });
  box.appendChild(showMsBtn);
  box.appendChild(msHolder);

  return box;
}

// ---------- Spec page ----------
function renderSpec() {
  const jump = $('#spec-jump');
  jump.innerHTML = '';
  jump.appendChild(el('span', { class: 'sj-label' }, 'Jump to aim'));
  ['A','B','C','D','E','F'].forEach(letter => {
    const data = SPEC[letter];
    const a = el('a', { href: '#spec-aim-' + letter },
      el('span', { class: 'sj-letter' }, letter),
      data.title.split(' ').slice(0, 3).join(' ')
    );
    jump.appendChild(a);
  });

  const wrap = $('#spec-content');
  wrap.innerHTML = '';
  ['A','B','C','D','E','F'].forEach(letter => {
    const data = SPEC[letter];
    const count = QUESTIONS.filter(q => q.learning_aim === letter).length;
    const sec = el('section', { class: 'spec-aim card', id: 'spec-aim-' + letter });

    const head = el('div', { class: 'spec-aim-head' });
    head.appendChild(el('div', { class: 'spec-aim-letter' }, letter));
    head.appendChild(el('div', { class: 'spec-aim-title' },
      el('h3', null, data.title),
      el('p', { class: 'spec-aim-sub' }, data.short)
    ));
    head.appendChild(el('span', { class: 'spec-aim-count' },
      el('span', { class: 'num' }, String(count)),
      ' questions'
    ));
    sec.appendChild(head);

    // Group sub-topics under their parent (e.g. A1.1, A1.2 under A1)
    const tree = buildTopicTree(data.topics);
    const groups = el('div', { class: 'spec-groups' });
    tree.forEach(node => {
      const group = el('div', { class: 'spec-group' });
      group.appendChild(el('div', { class: 'spec-group-head' },
        el('span', { class: 'sg-code' }, node.code),
        el('span', { class: 'sg-name' }, node.name)
      ));
      if (node.children.length) {
        const subs = el('div', { class: 'spec-subtopics' });
        node.children.forEach(c => {
          subs.appendChild(el('div', { class: 'spec-subtopic' },
            el('span', { class: 'code' }, c.code),
            el('span', null, c.name)
          ));
        });
        group.appendChild(subs);
      }
      groups.appendChild(group);
    });
    sec.appendChild(groups);
    wrap.appendChild(sec);
  });
}

// Group sub-topics (e.g. A1.1) under their parent (A1).
// If a parent code is missing for a code like 'X9.1', synthesise a parent header.
function buildTopicTree(topics) {
  const result = [];
  const byCode = new Map();
  topics.forEach(t => {
    if (/^[A-F]\d+$/.test(t.code)) {
      // top-level (e.g. A1, B2)
      const node = { code: t.code, name: t.name, children: [] };
      byCode.set(t.code, node);
      result.push(node);
    } else {
      // sub-topic (e.g. A1.1)
      const m = t.code.match(/^([A-F]\d+)\./);
      const parentCode = m ? m[1] : null;
      let parent = parentCode ? byCode.get(parentCode) : null;
      if (!parent) {
        parent = { code: parentCode || t.code, name: '', children: [] };
        byCode.set(parent.code, parent);
        result.push(parent);
      }
      parent.children.push({ code: t.code, name: t.name });
    }
  });
  return result;
}

// ============================================================
// QUIZ
// ============================================================
let quizState = null; // { items, idx, answers: number[] (selected index per q, -1 unanswered), aimFilter }

function renderQuizControls() {
  const aimSel = $('#quiz-aim');
  ['A','B','C','D','E','F'].forEach(a => aimSel.appendChild(el('option', { value: a }, `Aim ${a}`)));

  $('#btn-quiz-start').addEventListener('click', startQuiz);

  if (typeof QUIZ !== 'undefined' && QUIZ.length) {
    $('#quiz-card').innerHTML = `<p class="muted" style="padding:30px;text-align:center;">${QUIZ.length} quiz questions ready. Pick filters and click <strong>Start quiz</strong>.</p>`;
  } else {
    $('#quiz-card').innerHTML = `<p class="muted" style="padding:30px;text-align:center;">Quiz data is loading…</p>`;
  }
}

async function startQuiz() {
  if (!await ra10Gate('quiz_question')) return;
  if (!QUIZ || !QUIZ.length) { alert('Quiz data not available.'); return; }
  const aim = $('#quiz-aim').value;
  const lenVal = $('#quiz-length').value;
  let pool = QUIZ.slice();
  if (aim) pool = pool.filter(q => q.learning_aim === aim);
  if (!pool.length) { alert('No quiz questions for this filter.'); return; }
  pool = shuffle(pool);
  const length = lenVal === 'all' ? pool.length : Math.min(parseInt(lenVal, 10), pool.length);
  quizState = {
    items: pool.slice(0, length),
    idx: 0,
    answers: new Array(length).fill(-1),
    revealed: new Array(length).fill(false),
    aimFilter: aim
  };
  $('#quiz-results').style.display = 'none';
  renderQuizCard();
}

function renderQuizCard() {
  const wrap = $('#quiz-card');
  wrap.innerHTML = '';
  if (!quizState) return;
  const q = quizState.items[quizState.idx];
  $('#quiz-progress').textContent = `Question ${quizState.idx + 1} of ${quizState.items.length}`;

  const card = el('div', { class: 'quiz-card' });
  card.appendChild(el('div', { class: 'quiz-meta' },
    el('span', { class: 'tag id' }, q.id),
    el('span', { class: 'tag' }, `Aim ${q.learning_aim}`),
    q.topic ? el('span', { class: 'tag verb' }, q.topic) : null,
    el('span', { class: 'tag marks' }, q.type === 'true_false' ? 'True / False' : 'Multiple choice')
  ));
  card.appendChild(el('p', { class: 'quiz-q' }, q.question));

  const opts = el('div', { class: 'quiz-options' });
  const letters = ['A','B','C','D','E'];
  q.choices.forEach((choice, i) => {
    const opt = el('div', { class: 'quiz-option', 'data-i': String(i) },
      el('span', { class: 'opt-letter' }, letters[i]),
      el('span', { class: 'opt-text' }, choice)
    );
    if (quizState.revealed[quizState.idx]) {
      opt.classList.add('locked');
      if (i === q.correct_index) opt.classList.add('correct');
      else if (i === quizState.answers[quizState.idx]) opt.classList.add('wrong');
    } else if (quizState.answers[quizState.idx] === i) {
      opt.classList.add('selected');
    }
    opt.addEventListener('click', () => {
      if (quizState.revealed[quizState.idx]) return;
      quizState.answers[quizState.idx] = i;
      renderQuizCard();
    });
    opts.appendChild(opt);
  });
  card.appendChild(opts);

  if (quizState.revealed[quizState.idx]) {
    const isRight = quizState.answers[quizState.idx] === q.correct_index;
    const exp = el('div', { class: 'quiz-explain' },
      el('strong', null, isRight ? 'Correct ✓  ' : 'Not quite. '),
      q.explanation || 'See the highlighted answer above.'
    );
    card.appendChild(exp);
  }

  const actions = el('div', { class: 'quiz-actions' });
  if (!quizState.revealed[quizState.idx]) {
    const checkBtn = el('button', { class: 'btn primary' }, 'Check answer');
    checkBtn.addEventListener('click', () => {
      if (quizState.answers[quizState.idx] === -1) { alert('Pick an answer first.'); return; }
      quizState.revealed[quizState.idx] = true;
      renderQuizCard();
    });
    actions.appendChild(checkBtn);
  } else if (quizState.idx < quizState.items.length - 1) {
    const nextBtn = el('button', { class: 'btn primary' }, 'Next →');
    nextBtn.addEventListener('click', () => { quizState.idx++; renderQuizCard(); });
    actions.appendChild(nextBtn);
  } else {
    const finishBtn = el('button', { class: 'btn primary' }, 'See results');
    finishBtn.addEventListener('click', showQuizResults);
    actions.appendChild(finishBtn);
  }
  if (quizState.idx > 0) {
    const prevBtn = el('button', { class: 'btn ghost' }, '← Previous');
    prevBtn.addEventListener('click', () => { quizState.idx--; renderQuizCard(); });
    actions.appendChild(prevBtn);
  }
  if (quizState.idx < quizState.items.length - 1 && quizState.revealed[quizState.idx]) {
    // already added Next above
  } else if (!quizState.revealed[quizState.idx] && quizState.idx < quizState.items.length - 1) {
    const skipBtn = el('button', { class: 'btn ghost' }, 'Skip →');
    skipBtn.addEventListener('click', () => { quizState.idx++; renderQuizCard(); });
    actions.appendChild(skipBtn);
  }
  card.appendChild(actions);
  wrap.appendChild(card);
}

function showQuizResults() {
  const wrap = $('#quiz-card');
  wrap.innerHTML = '';
  $('#quiz-progress').textContent = '';
  const results = $('#quiz-results');
  results.style.display = 'block';
  results.innerHTML = '';

  let correct = 0;
  const aimStats = {};
  quizState.items.forEach((q, i) => {
    const right = quizState.answers[i] === q.correct_index;
    if (right) correct++;
    aimStats[q.learning_aim] = aimStats[q.learning_aim] || { right: 0, total: 0 };
    aimStats[q.learning_aim].total++;
    if (right) aimStats[q.learning_aim].right++;
  });
  const total = quizState.items.length;
  const pct = Math.round(correct / total * 100);

  const aimBreakdown = {};
  Object.entries(aimStats).forEach(([aim, s]) => {
    aimBreakdown[aim] = { correct: s.right, total: s.total };
  });
  saveSession('quiz', {
    aims: Object.keys(aimStats),
    total: total,
    correct: correct,
    aimBreakdown
  });

  const card = el('div', { class: 'quiz-results-card' });
  card.appendChild(el('p', { class: 'eyebrow', style: 'letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-2);font-weight:700;font-size:12px;' }, 'Quiz complete'));
  card.appendChild(el('div', { class: 'score-big' }, `${correct} / ${total}`));
  card.appendChild(el('div', { class: 'score-pct' }, `${pct}%`));
  const bar = el('div', { class: 'quiz-results-bar' }, el('span', { style: `width: ${pct}%;` }));
  card.appendChild(bar);

  const breakdown = el('div', { class: 'quiz-aim-breakdown' });
  ['A','B','C','D','E','F'].forEach(a => {
    if (!aimStats[a]) return;
    const s = aimStats[a];
    const ap = Math.round(s.right / s.total * 100);
    breakdown.appendChild(el('div', { class: 'quiz-aim-row' },
      el('span', { class: 'label' }, `Aim ${a}`),
      el('span', { class: 'ratio' }, `${s.right}/${s.total} · ${ap}%`)
    ));
  });
  card.appendChild(breakdown);

  const actions = el('div', { style: 'margin-top: 28px; display:flex;gap:10px;justify-content:center;flex-wrap:wrap;' });
  const retryBtn = el('button', { class: 'btn primary' }, 'Try another quiz');
  retryBtn.addEventListener('click', () => { results.style.display = 'none'; startQuiz(); });
  const reviewBtn = el('button', { class: 'btn' }, 'Review answers');
  reviewBtn.addEventListener('click', () => {
    quizState.idx = 0;
    quizState.revealed = quizState.revealed.map(() => true);
    results.style.display = 'none';
    renderQuizCard();
  });
  actions.appendChild(retryBtn);
  actions.appendChild(reviewBtn);
  card.appendChild(actions);

  results.appendChild(card);
}

async function renderProgress() {
  const gate = document.getElementById('progress-gate');
  const content = document.getElementById('progress-content');

  if (!gate || !content) return;

  if (!window.RA10 || !RA10.isLoggedIn()) {
    gate.style.display = 'block';
    content.style.display = 'none';
    const btn = document.getElementById('btn-progress-signin');
    if (btn) {
      btn.onclick = () => {
        window.top?.postMessage({ type: 'RA10_OPEN_AUTH' }, '*');
      };
    }
    return;
  }

  gate.style.display = 'none';
  content.style.display = 'block';

  const session = RA10.getSession();
  const sb = window.supabase.createClient(SB_URL, SB_KEY);
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: sessions } = await sb
    .from('revision_sessions')
    .select('*')
    .eq('user_id', session.user.id)
    .gte('created_at', since)
    .order('created_at', { ascending: false });

  const rows = sessions || [];

  const statsEl = document.getElementById('progress-stats');
  const totalSessions = rows.length;
  const totalQ = rows.reduce((a, r) => a + (r.questions_total || 0), 0);
  const totalCorrect = rows.reduce((a, r) => a + (r.questions_correct || 0), 0);
  const accuracy = totalQ ? Math.round(totalCorrect / totalQ * 100) : 0;
  const streakDays = calcStreak(rows);

  statsEl.innerHTML = [
    ['Sessions', totalSessions],
    ['Questions answered', totalQ],
    ['Accuracy', accuracy + '%'],
    ['Day streak', streakDays],
  ].map(([label, val]) => `
    <div style="background:#f9f8f5;border:1px solid #ddd;border-radius:12px;padding:16px;text-align:center;">
      <div style="font-size:1.6rem;font-weight:700;font-family:serif">${val}</div>
      <div style="font-size:0.75rem;color:#888;text-transform:uppercase;letter-spacing:.06em;margin-top:4px">${label}</div>
    </div>
  `).join('');

  const weakEl = document.getElementById('weak-aims-section');
  const aimTotals = {};
  const aimCorrect = {};
  rows.forEach(r => {
    const bd = r.aim_breakdown || {};
    Object.entries(bd).forEach(([aim, s]) => {
      aimTotals[aim] = (aimTotals[aim] || 0) + (s.total || 0);
      aimCorrect[aim] = (aimCorrect[aim] || 0) + (s.correct || 0);
    });
  });

  const weakAims = Object.entries(aimTotals)
    .filter(([, t]) => t >= 3)
    .map(([aim, t]) => ({ aim, pct: Math.round((aimCorrect[aim] || 0) / t * 100) }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 3);

  if (weakAims.length) {
    weakEl.innerHTML = `
      <div style="background:#fff8f8;border:1px solid #f4d4d4;border-radius:12px;padding:20px;margin-bottom:8px;">
        <h3 style="font-family:serif;font-weight:400;font-size:1.1rem;margin-bottom:8px">
          📊 Areas to focus on
        </h3>
        <p style="font-size:0.85rem;color:#666;margin-bottom:16px">
          Based on your last 30 days — these aims have your lowest accuracy.
        </p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px">
          ${weakAims.map(w => `
            <span style="background:#f4d4d4;color:#d20000;padding:4px 12px;
              border-radius:999px;font-size:0.8rem;font-weight:700">
              Aim ${w.aim} — ${w.pct}% accuracy
            </span>
          `).join('')}
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btn primary" id="btn-weak-quiz">
            Start quiz on weak aims
          </button>
          <button class="btn" id="btn-weak-practice">
            Practice questions on weak aims
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-weak-quiz')?.addEventListener('click', () => {
      const aimFilter = weakAims.map(w => w.aim);
      switchTab('quiz');
      const aimSel = document.getElementById('quiz-aim');
      if (aimSel && aimFilter.length === 1) aimSel.value = aimFilter[0];
      setTimeout(() => startWeakQuiz(aimFilter), 100);
    });

    document.getElementById('btn-weak-practice')?.addEventListener('click', () => {
      const aimFilter = weakAims.map(w => w.aim);
      switchTab('practice');
      setTimeout(() => startWeakPractice(aimFilter), 100);
    });
  } else {
    weakEl.innerHTML = `
      <div style="background:#f9f8f5;border:1px solid #ddd;border-radius:12px;
        padding:20px;color:#888;font-size:0.9rem;">
        Complete at least 3 questions in any aim to see your weak areas analysis.
      </div>
    `;
  }

  const listEl = document.getElementById('sessions-list');
  if (!rows.length) {
    listEl.innerHTML = '<p style="color:#888;text-align:center;padding:32px">No sessions in the last 30 days. Start a quiz or practice session to track your progress.</p>';
    return;
  }

  const typeLabel = { quiz: '🧠 Quiz', practice: '✍️ Practice', mock: '📄 Mock Paper', flashcard: '🃏 Flashcards' };
  listEl.innerHTML = '<h3 style="font-family:serif;font-weight:400;font-size:1.1rem;margin-bottom:12px">Recent sessions</h3>' +
    rows.map(r => {
      const pct = r.questions_total ? Math.round(r.questions_correct / r.questions_total * 100) : null;
      const date = new Date(r.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });
      const color = pct === null ? '#888' : pct >= 70 ? '#437a22' : pct >= 40 ? '#964219' : '#d20000';
      return `
        <div style="background:#fff;border:1px solid #ddd;border-radius:10px;
          padding:14px 16px;margin-bottom:8px;display:flex;
          align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
          <div>
            <span style="font-weight:600;font-size:0.9rem">
              ${typeLabel[r.session_type] || r.session_type}
            </span>
            <span style="font-size:0.8rem;color:#888;margin-left:8px">${date}</span>
            ${r.learning_aims?.length ? `<span style="font-size:0.75rem;color:#aaa;margin-left:8px">Aims: ${r.learning_aims.join(', ')}</span>` : ''}
          </div>
          <div style="font-size:0.85rem;font-weight:700;color:${color}">
            ${pct !== null ? pct + '% (' + r.questions_correct + '/' + r.questions_total + ')' : r.questions_total + ' questions'}
          </div>
        </div>
      `;
    }).join('');
}

function calcStreak(rows) {
  if (!rows.length) return 0;
  const days = new Set(rows.map(r => new Date(r.created_at).toDateString()));
  let streak = 0;
  const d = new Date();
  while (days.has(d.toDateString())) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function startWeakQuiz(aims) {
  if (!QUIZ || !QUIZ.length) return;
  let pool = QUIZ.filter(q => aims.includes(q.learning_aim || q.learningaim));
  if (!pool.length) pool = QUIZ.slice();
  pool = shuffle(pool);
  const length = Math.min(20, pool.length);
  quizState = {
    items: pool.slice(0, length),
    idx: 0,
    answers: new Array(length).fill(-1),
    revealed: new Array(length).fill(false),
    aimFilter: aims[0] || ''
  };
  document.getElementById('quiz-results').style.display = 'none';
  renderQuizCard();
}

function startWeakPractice(aims) {
  let pool = QUESTIONS.filter(q => aims.includes(q.learning_aim || q.learningaim));
  if (!pool.length) pool = QUESTIONS.slice();
  window._practiceSession = {
    aims: aims && aims.length ? aims : ['A','B','C','D','E','F'],
    total: 0, correct: 0, aimBreakdown: {}
  };
  practiceQueue = shuffle(pool);
  practiceIdx = 0;
  renderPracticeCard();
}

// ============================================================
// FLASHCARDS
// ============================================================
let flashState = null; // { deck, idx, knownIds: Set, learningIds: Set, aimFilter }
const FLASH_STORE_KEY = 'btec-it-flash-progress-v1';

// Persist flashcard progress in-memory (and via cookies as a best-effort fallback)
let __flashProgress = { known: [], learning: [] };
function loadFlashProgress() {
  try {
    const m = document.cookie.match(new RegExp('(?:^|; )' + FLASH_STORE_KEY + '=([^;]*)'));
    if (m && m[1]) {
      const parsed = JSON.parse(decodeURIComponent(m[1]));
      if (parsed && Array.isArray(parsed.known)) __flashProgress = parsed;
    }
  } catch (e) {}
  return __flashProgress;
}
function saveFlashProgress(p) {
  __flashProgress = p;
  try {
    const v = encodeURIComponent(JSON.stringify(p));
    document.cookie = FLASH_STORE_KEY + '=' + v + '; path=/; max-age=31536000; SameSite=Lax';
  } catch (e) {}
}

function renderFlashControls() {
  const aimSel = $('#flash-aim');
  ['A','B','C','D','E','F'].forEach(a => aimSel.appendChild(el('option', { value: a }, `Aim ${a}`)));

  $('#btn-flash-start').addEventListener('click', startFlash);
  $('#btn-flash-shuffle').addEventListener('click', () => {
    if (!flashState) return;
    flashState.deck = shuffle(flashState.deck);
    flashState.idx = 0;
    renderFlashCard();
  });
  $('#btn-flash-reset').addEventListener('click', () => {
    if (!confirm('Reset all flashcard progress (known / still-learning marks)?')) return;
    saveFlashProgress({ known: [], learning: [] });
    if (flashState) { flashState.knownIds = new Set(); flashState.learningIds = new Set(); renderFlashCard(); }
  });

  if (typeof FLASHCARDS !== 'undefined' && FLASHCARDS.length) {
    $('#flash-stage').innerHTML = `<p class="muted" style="padding:30px;text-align:center;">${FLASHCARDS.length} cards ready across all aims. Click <strong>Start session</strong> to begin.</p>`;
  } else {
    $('#flash-stage').innerHTML = `<p class="muted" style="padding:30px;text-align:center;">Flashcards are loading…</p>`;
  }
}

function startFlash() {
  if (!FLASHCARDS || !FLASHCARDS.length) { alert('Flashcards not available.'); return; }
  const aim = $('#flash-aim').value;
  let deck = FLASHCARDS.slice();
  if (aim) deck = deck.filter(c => c.learning_aim === aim);
  if (!deck.length) { alert('No cards for this filter.'); return; }
  deck = shuffle(deck);
  const stored = loadFlashProgress();
  flashState = {
    deck,
    idx: 0,
    knownIds: new Set(stored.known),
    learningIds: new Set(stored.learning),
    aimFilter: aim
  };
  renderFlashCard();
}

function renderFlashCard() {
  const stage = $('#flash-stage');
  stage.innerHTML = '';
  if (!flashState || !flashState.deck.length) return;
  const c = flashState.deck[flashState.idx];
  $('#flash-progress').textContent = `Card ${flashState.idx + 1} of ${flashState.deck.length}`;

  // Counts strip
  const knownInDeck = flashState.deck.filter(x => flashState.knownIds.has(x.id)).length;
  const learningInDeck = flashState.deck.filter(x => flashState.learningIds.has(x.id)).length;
  const counts = el('div', { class: 'flash-counts' },
    el('span', null, 'Known ', el('strong', null, String(knownInDeck))),
    el('span', null, 'Still learning ', el('strong', null, String(learningInDeck))),
    el('span', null, 'Untouched ', el('strong', null, String(flashState.deck.length - knownInDeck - learningInDeck)))
  );
  stage.appendChild(counts);

  const bar = el('div', { class: 'flash-progress-bar' }, el('span', { style: `width: ${(flashState.idx + 1) / flashState.deck.length * 100}%;` }));
  stage.appendChild(bar);

  const card = el('div', { class: 'flash-card', tabindex: '0' });
  const inner = el('div', { class: 'flash-card-inner' });
  const front = el('div', { class: 'flash-face front' },
    el('div', { class: 'face-eyebrow' }, `Aim ${c.learning_aim} · ${c.topic || ''}`),
    el('div', { class: 'face-content' }, c.front),
    el('div', { class: 'face-hint' }, 'Click to flip')
  );
  const back = el('div', { class: 'flash-face back' },
    el('div', { class: 'face-eyebrow' }, c.id),
    el('div', { class: 'face-content' }, c.back),
    el('div', { class: 'face-hint' }, 'Click to flip back')
  );
  inner.appendChild(front); inner.appendChild(back);
  card.appendChild(inner);
  card.addEventListener('click', () => card.classList.toggle('flipped'));
  card.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); card.classList.toggle('flipped'); } });
  stage.appendChild(card);

  const actions = el('div', { class: 'flash-actions' });
  const isKnown = flashState.knownIds.has(c.id);
  const isLearning = flashState.learningIds.has(c.id);
  const learnBtn = el('button', { class: 'btn ' + (isLearning ? 'primary' : '') }, isLearning ? 'Marked: still learning' : 'Still learning');
  const knownBtn = el('button', { class: 'btn ' + (isKnown ? 'primary' : '') }, isKnown ? 'Marked: known ✓' : 'I know this');
  const prevBtn = el('button', { class: 'btn ghost' }, '← Previous');
  const nextBtn = el('button', { class: 'btn ghost' }, 'Next →');
  prevBtn.disabled = flashState.idx === 0;
  nextBtn.disabled = flashState.idx === flashState.deck.length - 1;
  learnBtn.addEventListener('click', () => {
    if (isLearning) flashState.learningIds.delete(c.id);
    else { flashState.learningIds.add(c.id); flashState.knownIds.delete(c.id); }
    saveFlashProgress({ known: [...flashState.knownIds], learning: [...flashState.learningIds] });
    renderFlashCard();
  });
  knownBtn.addEventListener('click', () => {
    if (isKnown) flashState.knownIds.delete(c.id);
    else { flashState.knownIds.add(c.id); flashState.learningIds.delete(c.id); }
    saveFlashProgress({ known: [...flashState.knownIds], learning: [...flashState.learningIds] });
    advanceFlash();
  });
  prevBtn.addEventListener('click', () => { flashState.idx = Math.max(0, flashState.idx - 1); renderFlashCard(); });
  nextBtn.addEventListener('click', advanceFlash);
  actions.appendChild(prevBtn); actions.appendChild(learnBtn); actions.appendChild(knownBtn); actions.appendChild(nextBtn);
  stage.appendChild(actions);
}

function advanceFlash() {
  if (!flashState) return;
  if (flashState.idx < flashState.deck.length - 1) flashState.idx++;
  else flashState.idx = 0;
  renderFlashCard();
}

})();
