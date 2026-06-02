(function () {
  'use strict';

  const GUIDE_STATE_KEY = 'aqa_business_guide_state_v3';

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function arr(v) {
    return Array.isArray(v) ? v : [];
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

  function renderList(items, className) {
    const list = arr(items);
    if (!list.length) return '<p class="rgx-empty">No revision content in this section yet.</p>';
    return `<ul class="${className || 'rgx-list'}">${list.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>`;
  }

  function renderTerms(items) {
    const list = arr(items);
    if (!list.length) return '<p class="rgx-empty">No key terms added yet.</p>';
    return `<div class="rgx-term-grid">${list.map((t) => `
      <article class="rgx-card rgx-term-card">
        <h5>${escapeHtml(t.term || 'Key term')}</h5>
        <p>${escapeHtml(t.definition || '')}</p>
      </article>`).join('')}</div>`;
  }

  function renderWorked(examples) {
    const list = arr(examples);
    if (!list.length) return '<p class="rgx-empty">No worked examples added yet.</p>';
    return `<div class="rgx-worked-grid">${list.map((ex) => `
      <article class="rgx-card rgx-worked-card">
        <h5>${escapeHtml(ex.title || 'Worked example')}</h5>
        <p class="rgx-worked-scenario">${escapeHtml(ex.scenario || '')}</p>
        <ol>${arr(ex.steps).map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol>
        <p><strong>Why this scores:</strong> ${escapeHtml(ex.interpretation || '')}</p>
      </article>`).join('')}</div>`;
  }

  function renderPlans(plans) {
    const list = arr(plans);
    if (!list.length) return '<p class="rgx-empty">No exam plans yet.</p>';
    return `<div class="rgx-plan-grid">${list.map((p) => `
      <article class="rgx-card rgx-plan-card">
        <h5>${escapeHtml(p.question_type || 'Plan')}</h5>
        <ol>${arr(p.plan).map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol>
      </article>`).join('')}</div>`;
  }

  function renderQuickChecks(checks) {
    const list = arr(checks);
    if (!list.length) return '<p class="rgx-empty">No quick checks yet.</p>';
    return `<div class="rgx-check-grid">${list.map((q) => `
      <article class="rgx-card rgx-check-card">
        <h5>${escapeHtml(q.q || 'Check')}</h5>
        <p>${escapeHtml(q.a || '')}</p>
      </article>`).join('')}</div>`;
  }

  function renderDiagram(sub) {
    const title = (sub.name || 'Subtopic').replace(/"/g, '');
    const formula = arr(sub.formulae)[0] || 'Use context and judgement together';
    const safeFormula = String(formula).replace(/"/g, '\\"').slice(0, 70);
    const lines = [
      'flowchart LR',
      `A[\"${title}\\nDefine clearly\"] --> B[\"Apply to business context\"]`,
      'B --> C["Analyse consequences"]',
      `C --> D[\"Evidence + numbers\\n${safeFormula}\"]`,
      'D --> E["Evaluate options"]',
      'E --> F["Final judgement"]'
    ].join('\n');
    return `<div class="rgx-diagram-wrap"><pre class="mermaid">${escapeHtml(lines)}</pre></div>`;
  }

  function panel(code, id, title, body, show) {
    return `<section class="rgx-panel" data-panel-for="${escapeHtml(code)}" data-panel="${escapeHtml(id)}" ${show ? '' : 'hidden'}>
      <h4>${escapeHtml(title)}</h4>
      ${body}
    </section>`;
  }

  function renderSubtopic(sub, topicNum, state) {
    const code = sub.code || '';
    const done = !!state[code];
    const search = `${sub.name || ''} ${sub.overview || ''} ${sub.big_picture || ''}`;

    return `
      <article class="rgx-subtopic" id="gt-${escapeHtml(code)}" data-guide-subtopic data-topic="${escapeHtml(topicNum)}" data-search="${escapeHtml(search)}">
        <header class="rgx-subtopic-head">
          <button type="button" class="rgx-expand" data-expand="${escapeHtml(code)}" aria-expanded="false" aria-controls="rgx-body-${escapeHtml(code)}">
            <span class="rgx-code">${escapeHtml(code)}</span>
            <span class="rgx-title">${escapeHtml(sub.name || '')}</span>
            <span class="rgx-plus">+</span>
          </button>
          <label class="rgx-done">
            <input type="checkbox" data-done="${escapeHtml(code)}" ${done ? 'checked' : ''}>
            <span>Revised</span>
          </label>
        </header>

        <div class="rgx-subtopic-body" id="rgx-body-${escapeHtml(code)}" hidden>
          <section class="rgx-story">
            <p class="rgx-overview">${escapeHtml(sub.overview || '')}</p>
            <p class="rgx-big">${escapeHtml(sub.big_picture || '')}</p>
            <p class="rgx-why">${escapeHtml(sub.why_it_matters || '')}</p>
            <p class="rgx-hook"><strong>Memory hook:</strong> ${escapeHtml(sub.memory_hook || '')}</p>
          </section>

          <nav class="rgx-tabbar" data-tabs="${escapeHtml(code)}">
            <button type="button" class="rgx-tab is-active" data-tab-for="${escapeHtml(code)}" data-tab="learn">Learn</button>
            <button type="button" class="rgx-tab" data-tab-for="${escapeHtml(code)}" data-tab="exam">Exam Build</button>
            <button type="button" class="rgx-tab" data-tab-for="${escapeHtml(code)}" data-tab="practice">Practice</button>
          </nav>

          <div class="rgx-panels">
            ${panel(code, 'learn', 'Core Understanding', `
              <h5>Visual revision map</h5>
              ${renderDiagram(sub)}
              <h5>Key terms</h5>
              ${renderTerms(sub.key_terms)}
              <h5>Concept map</h5>
              ${renderList(sub.concept_map)}
              <h5>Models to use</h5>
              ${renderList(sub.models)}
            `, true)}

            ${panel(code, 'exam', 'Exam Structure and High-Mark Writing', `
              <h5>AO chain</h5>
              ${renderList(sub.exam_chain)}
              <h5>Question plans by mark range</h5>
              ${renderPlans(sub.exam_plans)}
              <h5>Common mistakes to avoid</h5>
              ${renderList(sub.common_mistakes)}
              <h5>Worked answer example</h5>
              ${renderWorked(sub.worked_examples)}
            `, false)}

            ${panel(code, 'practice', 'Active Revision and Recall', `
              <h5>Formula and quantitative toolkit</h5>
              ${renderList(sub.formulae)}
              <h5>Active recall drills</h5>
              ${renderList(sub.active_recall)}
              <h5>Quick checks</h5>
              ${renderQuickChecks(sub.quick_checks)}
              <div class="rgx-recall-box">
                <p class="rgx-recall-title">Random recall prompt</p>
                <p data-recall-target="${escapeHtml(code)}">Click the button for a new prompt.</p>
                <button type="button" class="btn" data-recall-btn="${escapeHtml(code)}">Give me a prompt</button>
              </div>
            `, false)}
          </div>
        </div>
      </article>`;
  }

  function renderTopic(topic, state) {
    const num = topic.topic || '';
    const subs = arr(topic.subtopics);
    return `
      <section class="guide-aim-section rgx-topic" id="guide-aim-${escapeHtml(num)}" data-topic="${escapeHtml(num)}">
        <header class="rgx-topic-head">
          <div>
            <p class="rgx-topic-kicker">Topic ${escapeHtml(num)}</p>
            <h3>${escapeHtml(topic.title || '')}</h3>
            <p>${escapeHtml(topic.short || '')}</p>
          </div>
          <div class="rgx-topic-badges">
            <span>${subs.length} subtopics</span>
            <span>${Number(num) <= 6 ? 'Paper 1 + 3' : 'Paper 2 + 3'}</span>
          </div>
        </header>

        <section class="rgx-topic-focus">
          <h4>How to score well on this topic</h4>
          ${renderList(topic.topic_exam_focus)}
        </section>

        <div class="rgx-subtopics">
          ${subs.map((s) => renderSubtopic(s, num, state)).join('')}
        </div>
      </section>`;
  }

  function renderToc(topics) {
    return arr(topics).map((t) => `
      <div class="guide-toc-aim-group">
        <button type="button" class="guide-toc-aim-link" onclick="guideScrollTo('guide-aim-${escapeHtml(t.topic)}')">
          <span class="n">${escapeHtml(t.topic)}</span>
          <span class="t">${escapeHtml(t.title || '')}</span>
        </button>
      </div>`).join('');
  }

  function filterSubtopics(q, topic) {
    const query = String(q || '').trim().toLowerCase();
    const filter = String(topic || '');
    document.querySelectorAll('[data-guide-subtopic]').forEach((el) => {
      const text = (el.getAttribute('data-search') || '').toLowerCase();
      const t = el.getAttribute('data-topic') || '';
      const topicOk = !filter || filter === t;
      const queryOk = !query || text.includes(query);
      el.style.display = topicOk && queryOk ? '' : 'none';
    });
  }

  function updateProgress(data) {
    const state = loadState();
    const total = arr(data.topics).reduce((sum, t) => sum + arr(t.subtopics).length, 0);
    const done = Object.values(state).filter(Boolean).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    const el = document.querySelector('[data-progress]');
    if (el) el.textContent = `${done}/${total} complete (${pct}%)`;
  }

  function bindInteractions(data) {
    const root = document.getElementById('guide-comprehensive');
    if (!root) return;

    const search = root.querySelector('[data-search]');
    const topic = root.querySelector('[data-topic-filter]');
    if (search) search.addEventListener('input', () => filterSubtopics(search.value, topic ? topic.value : ''));
    if (topic) topic.addEventListener('change', () => filterSubtopics(search ? search.value : '', topic.value));

    root.addEventListener('click', (ev) => {
      const expandBtn = ev.target.closest('[data-expand]');
      if (expandBtn) {
        const code = expandBtn.getAttribute('data-expand');
        const body = root.querySelector(`#rgx-body-${code}`);
        const plus = expandBtn.querySelector('.rgx-plus');
        const expanded = expandBtn.getAttribute('aria-expanded') === 'true';
        expandBtn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if (body) body.hidden = expanded;
        if (plus) plus.textContent = expanded ? '+' : '-';
      }

      const tab = ev.target.closest('[data-tab-for]');
      if (tab) {
        const code = tab.getAttribute('data-tab-for');
        const target = tab.getAttribute('data-tab');
        root.querySelectorAll(`[data-tab-for="${code}"]`).forEach((btn) => btn.classList.toggle('is-active', btn === tab));
        root.querySelectorAll(`[data-panel-for="${code}"]`).forEach((panel) => {
          panel.hidden = panel.getAttribute('data-panel') !== target;
        });
      }

      const recall = ev.target.closest('[data-recall-btn]');
      if (recall) {
        const code = recall.getAttribute('data-recall-btn');
        const target = root.querySelector(`[data-recall-target="${code}"]`);
        const topicData = arr(data.topics).flatMap((t) => arr(t.subtopics)).find((s) => String(s.code) === String(code));
        const prompts = arr(topicData && topicData.active_recall);
        if (!target || !prompts.length) return;
        target.textContent = prompts[Math.floor(Math.random() * prompts.length)];
      }
    });

    root.addEventListener('change', (ev) => {
      const done = ev.target.closest('[data-done]');
      if (!done) return;
      const code = done.getAttribute('data-done');
      const state = loadState();
      state[code] = done.checked;
      saveState(state);
      updateProgress(data);
    });

    updateProgress(data);
    filterSubtopics('', '');

    if (window.mermaid && typeof window.mermaid.init === 'function') {
      try {
        window.mermaid.init(undefined, root.querySelectorAll('.mermaid'));
      } catch (_) {}
    }
  }

  function renderGuideFromData(data) {
    const mount = document.getElementById('guide-comprehensive');
    if (!mount) return;

    const topics = arr(data && data.topics);
    const subCount = topics.reduce((sum, t) => sum + arr(t.subtopics).length, 0);
    const state = loadState();

    mount.innerHTML = `
      <section class="rgx-shell">
        <header class="rgx-hero">
          <div class="rgx-hero-main">
            <p class="rgx-kicker">A-Level AQA Business</p>
            <h2>Revision Guide</h2>
            <p>Built for actual revision: clearer explanations, better exam structure, and interactive practice for every subtopic.</p>
          </div>
          <div class="rgx-stats">
            <div><strong>${topics.length}</strong><small>Topics</small></div>
            <div><strong>${subCount}</strong><small>Subtopics</small></div>
            <div><strong data-progress>0/${subCount} complete (0%)</strong><small>Your progress</small></div>
          </div>
        </header>

        <section class="rgx-controls">
          <input type="search" data-search placeholder="Search subtopics, concepts, and revision notes..." />
          <select data-topic-filter>
            <option value="">All topics</option>
            ${topics.map((t) => `<option value="${escapeHtml(t.topic)}">Topic ${escapeHtml(t.topic)} - ${escapeHtml(t.title || '')}</option>`).join('')}
          </select>
        </section>

        <section class="rgx-layout">
          <aside class="rgx-sidebar">
            <h3>Jump to topic</h3>
            ${renderToc(topics)}
          </aside>
          <div class="rgx-main">
            ${topics.map((t) => renderTopic(t, state)).join('')}
          </div>
        </section>
      </section>`;

    bindInteractions(data);
  }

  function renderGuideError(message) {
    const mount = document.getElementById('guide-comprehensive');
    if (!mount) return;
    mount.innerHTML = `<div class="card"><h3>Revision guide loading issue</h3><p>${escapeHtml(message)}</p></div>`;
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
      .catch((err) => renderGuideError('Unable to load guide content: ' + err.message));
  };
})();
