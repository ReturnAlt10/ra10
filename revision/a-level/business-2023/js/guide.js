(function () {
  'use strict';

  const GUIDE_STATE_KEY = 'aqa_business_guide_smx_v1';

  function arr(v) {
    return Array.isArray(v) ? v : [];
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(GUIDE_STATE_KEY) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (_) {
      return {};
    }
  }

  function saveState(state) {
    localStorage.setItem(GUIDE_STATE_KEY, JSON.stringify(state || {}));
  }

  function readDone(code, state) {
    return !!(state && state.done && state.done[code]);
  }

  function setDone(code, value, state) {
    state.done = state.done || {};
    state.done[code] = !!value;
  }

  function pickSummary(sub) {
    const points = arr(sub.summary_points);
    if (points.length) return points;
    const concept = arr(sub.concept_map);
    if (concept.length) return concept.slice(0, 5);
    return ['Define the concept clearly.', 'Apply context.', 'Build analysis.', 'Finish with judgement.'];
  }

  function renderList(items, className) {
    const list = arr(items);
    if (!list.length) return '<p class="smx-empty">No content yet.</p>';
    return '<ul class="' + (className || 'smx-list') + '">' + list.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>';
  }

  function renderTerms(items) {
    const list = arr(items);
    if (!list.length) return '<p class="smx-empty">No definitions yet.</p>';
    return '<div class="smx-terms">' + list.map((t) =>
      '<article class="smx-term">'
      + '<h5>' + esc(t.term || 'Term') + '</h5>'
      + '<p>' + esc(t.definition || '') + '</p>'
      + '</article>'
    ).join('') + '</div>';
  }

  function renderWorked(items) {
    const ex = arr(items)[0];
    if (!ex) return '<p class="smx-empty">No worked example yet.</p>';
    return '<article class="smx-worked">'
      + '<h5>' + esc(ex.title || 'Worked example') + '</h5>'
      + '<p class="smx-worked-scenario">' + esc(ex.scenario || '') + '</p>'
      + '<ol>' + arr(ex.steps).map((s) => '<li>' + esc(s) + '</li>').join('') + '</ol>'
      + '<p class="smx-worked-why"><strong>Why this scores:</strong> ' + esc(ex.interpretation || '') + '</p>'
      + '</article>';
  }

  function renderPlans(items) {
    const plans = arr(items);
    if (!plans.length) return '<p class="smx-empty">No exam plans yet.</p>';
    return '<div class="smx-plans">' + plans.map((p) =>
      '<article class="smx-plan">'
      + '<h5>' + esc(p.question_type || 'Plan') + '</h5>'
      + '<ol>' + arr(p.plan).map((step) => '<li>' + esc(step) + '</li>').join('') + '</ol>'
      + '</article>'
    ).join('') + '</div>';
  }

  function renderQuickChecks(items) {
    const checks = arr(items);
    if (!checks.length) return '<p class="smx-empty">No quick checks yet.</p>';
    return '<div class="smx-checks">' + checks.map((q) =>
      '<article class="smx-check">'
      + '<h5>' + esc(q.q || 'Question') + '</h5>'
      + '<p>' + esc(q.a || '') + '</p>'
      + '</article>'
    ).join('') + '</div>';
  }

  function subtopicSearchBlob(sub) {
    return [
      sub.code || '',
      sub.name || '',
      sub.overview || '',
      sub.big_picture || '',
      arr(sub.summary_points).join(' '),
      arr(sub.business_examples).join(' '),
      arr(sub.formulae).join(' '),
      arr(sub.concept_map).join(' ')
    ].join(' ').toLowerCase();
  }

  function renderSubtopic(sub, topicNum, state) {
    const code = String(sub.code || '');
    const done = readDone(code, state);

    return ''
      + '<article class="smx-subtopic" id="gt-' + esc(code) + '" data-guide-subtopic data-topic="' + esc(topicNum) + '" data-search="' + esc(subtopicSearchBlob(sub)) + '">'
      + '  <header class="smx-subtopic-head">'
      + '    <button type="button" class="smx-toggle" data-expand="' + esc(code) + '" aria-expanded="false" aria-controls="smx-body-' + esc(code) + '">'
      + '      <span class="smx-code">' + esc(code) + '</span>'
      + '      <span class="smx-name">' + esc(sub.name || '') + '</span>'
      + '      <span class="smx-sign">+</span>'
      + '    </button>'
      + '    <label class="smx-done">'
      + '      <input type="checkbox" data-done="' + esc(code) + '" ' + (done ? 'checked' : '') + '>'
      + '      <span>Done</span>'
      + '    </label>'
      + '  </header>'
      + '  <div class="smx-subtopic-body" id="smx-body-' + esc(code) + '" hidden>'
      + '    <section class="smx-intro">'
      + '      <h4>Overview</h4>'
      + '      <p>' + esc(sub.overview || '') + '</p>'
      + '      <p>' + esc(sub.big_picture || '') + '</p>'
      + '      <p class="smx-tip"><strong>Exam tip:</strong> ' + esc(sub.exam_tip || 'Define, apply context, analyse chain effects, and judge clearly.') + '</p>'
      + '    </section>'
      + '    <section class="smx-grid">'
      + '      <article class="smx-card">'
      + '        <h4>What You Need To Know</h4>'
      +          renderList(pickSummary(sub))
      + '      </article>'
      + '      <article class="smx-card">'
      + '        <h4>Key Definitions</h4>'
      +          renderTerms(sub.key_terms)
      + '      </article>'
      + '      <article class="smx-card">'
      + '        <h4>Business Examples</h4>'
      +          renderList(sub.business_examples)
      + '      </article>'
      + '      <article class="smx-card">'
      + '        <h4>Formula Toolkit</h4>'
      +          renderList(sub.formulae)
      + '      </article>'
      + '      <article class="smx-card smx-card-wide">'
      + '        <h4>Worked Example</h4>'
      +          renderWorked(sub.worked_examples)
      + '      </article>'
      + '      <article class="smx-card smx-card-wide">'
      + '        <h4>Exam Practice Structure</h4>'
      +          renderPlans(sub.exam_plans)
      + '      </article>'
      + '      <article class="smx-card">'
      + '        <h4>Common Mistakes</h4>'
      +          renderList(sub.common_mistakes)
      + '      </article>'
      + '      <article class="smx-card">'
      + '        <h4>Quick Checks</h4>'
      +          renderQuickChecks(sub.quick_checks)
      + '      </article>'
      + '    </section>'
      + '  </div>'
      + '</article>';
  }

  function renderTopic(t, state) {
    const topicNum = String(t.topic || '');
    const subtopics = arr(t.subtopics);
    return ''
      + '<section class="smx-topic guide-aim-section" id="guide-aim-' + esc(topicNum) + '">'  
      + '  <header class="smx-topic-head">'
      + '    <div>'
      + '      <p class="smx-topic-kicker">Topic ' + esc(topicNum) + '</p>'
      + '      <h3>' + esc(t.title || '') + '</h3>'
      + '      <p>' + esc(t.short || '') + '</p>'
      + '    </div>'
      + '    <div class="smx-topic-meta">'
      + '      <span>' + subtopics.length + ' sections</span>'
      + '      <span>' + (Number(topicNum) <= 6 ? 'Paper 1 + 3' : 'Paper 2 + 3') + '</span>'
      + '    </div>'
      + '  </header>'
      + '  <section class="smx-focus">'
      + '    <h4>How examiners reward this topic</h4>'
      +      renderList(t.topic_exam_focus)
      + '  </section>'
      + '  <div class="smx-subtopics">'
      +      subtopics.map((s) => renderSubtopic(s, topicNum, state)).join('')
      + '  </div>'
      + '</section>';
  }

  function renderToc(topics) {
    return arr(topics).map((t) =>
      '<div class="guide-toc-aim-group">'
      + '<button type="button" class="smx-toc-link guide-toc-aim-link" onclick="guideScrollTo(\'guide-aim-' + esc(t.topic) + '\')"  data-guide-toc-aim="' + esc(t.topic) + '">'
      + '<span class="n">' + esc(t.topic || '') + '</span>'
      + '<span class="t">' + esc(t.title || '') + '</span>'
      + '</button>'
      + '</div>'
    ).join('');
  }

  function updateProgress(data) {
    const state = loadState();
    const total = arr(data.topics).reduce((sum, t) => sum + arr(t.subtopics).length, 0);
    let done = 0;
    arr(data.topics).forEach((t) => arr(t.subtopics).forEach((s) => {
      if (readDone(String(s.code || ''), state)) done += 1;
    }));
    const pct = total ? Math.round((done / total) * 100) : 0;
    const el = document.querySelector('[data-guide-progress]');
    if (el) el.textContent = done + '/' + total + ' complete (' + pct + '%)';
  }

  function filterSubtopics(query, topic) {
    const q = String(query || '').trim().toLowerCase();
    const t = String(topic || '').trim();
    document.querySelectorAll('[data-guide-subtopic]').forEach((el) => {
      const inTopic = !t || el.getAttribute('data-topic') === t;
      const blob = (el.getAttribute('data-search') || '').toLowerCase();
      const pass = !q || blob.includes(q);
      el.style.display = inTopic && pass ? '' : 'none';
    });
  }

  function setExpandState(root, code, expand) {
    const btn = root.querySelector('[data-expand="' + code.replace(/\\/g, '\\\\').replace(/"/g, '\"') + '"]');
    // Use getElementById to avoid CSS.escape mangling codes like "1.1" → "\\31 \.1"
    const body = document.getElementById('smx-body-' + code);
    if (!btn || !body) return;
    btn.setAttribute('aria-expanded', expand ? 'true' : 'false');
    body.hidden = !expand;
    const sign = btn.querySelector('.smx-sign');
    if (sign) sign.textContent = expand ? '-' : '+';
  }

  function bindInteractions(data) {
    const root = document.getElementById('guide-comprehensive');
    if (!root) return;

    const search = root.querySelector('[data-guide-search]');
    const topic = root.querySelector('[data-guide-topic]');
    if (search) search.addEventListener('input', () => filterSubtopics(search.value, topic ? topic.value : ''));
    if (topic) topic.addEventListener('change', () => filterSubtopics(search ? search.value : '', topic.value));

    root.addEventListener('click', (ev) => {
      const expandBtn = ev.target.closest('[data-expand]');
      if (expandBtn) {
        const code = String(expandBtn.getAttribute('data-expand') || '');
        const expanded = expandBtn.getAttribute('aria-expanded') === 'true';
        setExpandState(root, code, !expanded);
      }

      const ctrl = ev.target.closest('[data-guide-control]');
      if (ctrl) {
        const action = ctrl.getAttribute('data-guide-control');
        const cards = arr(data.topics).flatMap((t) => arr(t.subtopics)).map((s) => String(s.code || ''));
        if (action === 'expand') cards.forEach((code) => setExpandState(root, code, true));
        if (action === 'collapse') cards.forEach((code) => setExpandState(root, code, false));
      }
    });

    root.addEventListener('change', (ev) => {
      const done = ev.target.closest('[data-done]');
      if (!done) return;
      const code = String(done.getAttribute('data-done') || '');
      const state = loadState();
      setDone(code, done.checked, state);
      saveState(state);
      updateProgress(data);
    });

    filterSubtopics('', '');
    updateProgress(data);
  }

  function renderGuideFromData(data) {
    const mount = document.getElementById('guide-comprehensive');
    if (!mount) return;

    const topics = arr(data && data.topics);
    const state = loadState();
    const subCount = topics.reduce((sum, t) => sum + arr(t.subtopics).length, 0);

    mount.innerHTML = ''
      + '<section class="smx-shell">'
      + '  <header class="smx-hero">'
      + '    <div class="smx-hero-main">'
      + '      <p class="smx-kicker">A-Level AQA Business</p>'
      + '      <h2>Revision Notes</h2>'
      + '      <p>Fully rebuilt from scratch in a clean exam-note format with worked structure, definitions, formulas, and practice prompts.</p>'
      + '    </div>'
      + '    <div class="smx-stats">'
      + '      <div><strong>' + topics.length + '</strong><small>Topics</small></div>'
      + '      <div><strong>' + subCount + '</strong><small>Sections</small></div>'
      + '      <div><strong data-guide-progress>0/' + subCount + ' complete (0%)</strong><small>Progress</small></div>'
      + '    </div>'
      + '  </header>'
      + '  <section class="smx-controls">'
      + '    <input type="search" data-guide-search placeholder="Search terms, formulas, examples, and topic notes...">'
      + '    <select data-guide-topic>'
      + '      <option value="">All topics</option>'
      +         topics.map((t) => '<option value="' + esc(t.topic) + '">Topic ' + esc(t.topic) + ' - ' + esc(t.title || '') + '</option>').join('')
      + '    </select>'
      + '    <button type="button" class="btn" data-guide-control="expand">Expand all</button>'
      + '    <button type="button" class="btn" data-guide-control="collapse">Collapse all</button>'
      + '  </section>'
      + '  <section class="smx-layout">'
      + '    <aside class="smx-sidebar">'
      + '      <h3>Jump To Topic</h3>'
      +       renderToc(topics)
      + '    </aside>'
      + '    <div class="smx-main">'
      +       topics.map((t) => renderTopic(t, state)).join('')
      + '    </div>'
      + '  </section>'
      + '</section>';

    bindInteractions(data);

    // Call gating AFTER the DOM is fully populated (fetch has completed).
    if (typeof window.applyGuideAccessRules === 'function') {
      window.applyGuideAccessRules();
    }
  }

  function renderError(message) {
    const mount = document.getElementById('guide-comprehensive');
    if (!mount) return;
    mount.innerHTML = '<div class="card"><h3>Revision guide loading issue</h3><p>' + esc(message) + '</p></div>';
  }

  window.guideScrollTo = function (id) {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.initComprehensiveGuide = function () {
    fetch('data/guide_content.json')
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then((data) => renderGuideFromData(data))
      .catch((err) => renderError('Unable to load guide content: ' + err.message));
  };
})();
