/* AQA A-level Business (7132) - comprehensive revision guide.
   Content lives in guide-content-a.js / guide-content-b.js (window.BG.sections).
   Initialised by window.initComprehensiveGuide(); access gating is applied by app.js
   (applyGuideAccessRules) using the .guide-aim-section ids "guide-aim-1".."guide-aim-10". */
(function () {
  'use strict';

  const STORE_KEY = 'ra10-guide-revised-alevel-business-2025';

  function getRevised() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch (_) { return []; }
  }
  function saveRevised(arr) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); } catch (_) { /* storage unavailable */ }
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function sections() { return (window.BG && window.BG.sections) || []; }

  function buildSidebar() {
    return `
<button class="guide-sb-toggle" onclick="this.closest('.guide-sidebar').classList.toggle('sb-open')">
  <span>&#9776; Contents</span><span>&#8595;</span>
</button>
<div class="guide-sidebar-hd"><span class="guide-toc-label">AQA 7132 Guide</span></div>
<div class="guide-toc-scroll">
  <div class="guide-toc-aim-group">
    <button class="guide-toc-aim-link" onclick="guideScrollTo('guide-start')"><span class="guide-toc-badge">&#9733;</span>How you're marked</button>
  </div>
  ${sections().map(s => `
  <div class="guide-toc-aim-group">
    <button class="guide-toc-aim-link" onclick="guideScrollTo('guide-aim-${s.num}')">
      <span class="guide-toc-badge">3.${s.num}</span>${esc(s.title.replace(/^3\.\d+\s*/, ''))}
    </button>
    <div class="guide-toc-topic-links">
      ${s.topics.map(t => `<button class="guide-toc-topic-link" onclick="guideScrollTo('gt-${t.code}')">${t.code} ${esc(t.name)}</button>`).join('')}
    </div>
  </div>`).join('')}
  <div class="guide-toc-aim-group">
    <button class="guide-toc-aim-link" onclick="guideScrollTo('guide-formulae')"><span class="guide-toc-badge">f(x)</span>Formula sheet</button>
  </div>
  <div class="guide-toc-aim-group">
    <button class="guide-toc-aim-link" onclick="guideScrollTo('guide-glossary')"><span class="guide-toc-badge">A-Z</span>Key terms glossary</button>
  </div>
</div>`;
  }

  function topicHtml(t, open) {
    return `
<div class="guide-topic${open ? ' open' : ''}" id="gt-${t.code}">
  <div class="guide-topic-hd" onclick="toggleGT('gt-${t.code}')">
    <span class="guide-topic-code">${t.code}</span>
    <span class="guide-topic-name">${esc(t.name)}</span>
    <span class="guide-topic-chevron">&#9660;</span>
  </div>
  <div class="guide-topic-body">${t.body}</div>
</div>`;
  }

  function sectionHtml(s, idx) {
    return `
<div class="guide-aim-section" id="guide-aim-${s.num}">
  <div class="guide-aim-hd">
    <div class="guide-aim-badge">3.${s.num}</div>
    <div>
      <div class="guide-aim-title">${esc(s.title)}</div>
      <div class="guide-aim-subtitle">${esc(s.subtitle)}</div>
    </div>
  </div>
  ${s.topics.map((t, i) => topicHtml(t, idx === 0 && i === 0)).join('')}
  <button class="guide-mark-btn" id="gmb-${s.num}" onclick="toggleGuideRevised('${s.num}')">
    <span class="guide-mark-icon">&#9711;</span> Mark 3.${s.num} as revised
  </button>
</div>`;
  }

  function startHtml() {
    return `
<div class="guide-intro-card" id="guide-start">
  <h3>How your answers are marked (read this first)</h3>
  <p>All three papers (2 hours, 100 marks each) can test <strong>any</strong> part of 3.1-3.10. Marks come from four assessment objectives:</p>
  <table class="g-table"><thead><tr><th>AO</th><th>What it means</th><th>How to show it</th></tr></thead><tbody>
    <tr><td><strong>AO1</strong> Knowledge</td><td>Accurate terms, concepts, theories, formulae</td><td>Define precisely; use the model's real mechanism, not just its name</td></tr>
    <tr><td><strong>AO2</strong> Application</td><td>Using the context</td><td>Use names, numbers and details from the case or data - or a real/hypothetical business in essays</td></tr>
    <tr><td><strong>AO3</strong> Analysis</td><td>Chains of reasoning</td><td>Point &rarr; because &rarr; which means &rarr; so (impact on the focus of the question). Explain WHY each link follows</td></tr>
    <tr><td><strong>AO4</strong> Evaluation</td><td>Judgement</td><td>Weigh the arguments, say which matters most and why, and what the answer depends on</td></tr>
  </tbody></table>
  <p><strong>Examiner annotations to aim for:</strong> <em>ARG</em> = developed analysis in context; <em>DEV</em> = well-developed analysis in context (the full chain, each step explained). One DEV argument can reach the top level of a 9- or 12-mark 'Analyse' question.</p>
  <div class="exam-tip"><div class="tip-label">&#128161; The four question types</div>
  <ul>
    <li><strong>Calculate (2-4 marks)</strong>: write the formula, show every step, label the unit. Method marks are given with the Own Figure Rule.</li>
    <li><strong>Explain (3-4 marks)</strong>: one point, explained and applied to the context.</li>
    <li><strong>Analyse (6, 9, 12 marks)</strong>: one or two well-developed chains in context. No conclusion needed.</li>
    <li><strong>Evaluate / To what extent / Should... (16, 20, 24, 25 marks)</strong>: developed arguments on both sides, then a judgement that weighs them. 'All businesses' questions need contrasting contexts.</li>
  </ul></div>
  <p>Each topic below has key definitions, formulae with worked examples, a <span style="color:#047857;font-weight:700">model chain of analysis</span>, an <span style="color:#6d28d9;font-weight:700">evaluation</span> box ("it depends on..."), and <span style="color:#b91c1c;font-weight:700">what examiners report</span> students getting wrong, plus where the topic has appeared in past papers.</p>
</div>`;
  }

  function formulaSheet() {
    const cards = (typeof FLASHCARDS !== 'undefined' ? FLASHCARDS : []).filter(c => String(c.front).startsWith('Formula:'));
    const rows = cards.map(c => `<tr><td>3.${esc(c.learning_aim)}</td><td><strong>${esc(c.front.replace('Formula: ', ''))}</strong></td><td style="font-family:var(--mono)">${esc(c.back)}</td></tr>`).join('');
    return `
<div class="guide-aim-section" id="guide-formulae">
  <div class="guide-aim-hd"><div class="guide-aim-badge" style="font-size:.9rem">f(x)</div>
    <div><div class="guide-aim-title">Formula sheet - every calculation on the spec</div>
    <div class="guide-aim-subtitle">No formula sheet is given in the exam. Calculations are worth around 10%+ of the marks.</div></div></div>
  <div class="guide-topic open" id="gt-formulae">
    <div class="guide-topic-hd" onclick="toggleGT('gt-formulae')"><span class="guide-topic-code">REF</span><span class="guide-topic-name">All formulae</span><span class="guide-topic-chevron">&#9660;</span></div>
    <div class="guide-topic-body">
      <table class="g-table"><thead><tr><th>Spec</th><th>Measure</th><th>Formula</th></tr></thead><tbody>${rows}</tbody></table>
      <div class="exam-tip"><div class="tip-label">&#128161; Units checklist</div>Margin of safety and break-even: <strong>units</strong> · payables/receivables: <strong>days</strong> · inventory turnover: <strong>times</strong> · current ratio: <strong>x:1</strong> · margins, ROCE, gearing, ARR, labour turnover: <strong>%</strong> · NPV: <strong>£ (watch for £m)</strong> · payback: <strong>years and months</strong>.</div>
    </div>
  </div>
</div>`;
  }

  function glossary() {
    const cards = (typeof FLASHCARDS !== 'undefined' ? FLASHCARDS : []).filter(c => !String(c.front).startsWith('Formula:'));
    const byTopic = {};
    cards.forEach(c => { (byTopic[c.learning_aim] = byTopic[c.learning_aim] || []).push(c); });
    const blocks = Object.keys(byTopic).sort((a, b) => Number(a) - Number(b)).map(t => `
      <h4>3.${esc(t)}</h4>
      <table class="g-table"><thead><tr><th style="width:30%">Term</th><th>Definition</th></tr></thead><tbody>
      ${byTopic[t].map(c => `<tr><td><strong>${esc(c.front)}</strong></td><td>${esc(c.back)}</td></tr>`).join('')}
      </tbody></table>`).join('');
    return `
<div class="guide-aim-section" id="guide-glossary">
  <div class="guide-aim-hd"><div class="guide-aim-badge" style="font-size:.9rem">A-Z</div>
    <div><div class="guide-aim-title">Key terms glossary</div><div class="guide-aim-subtitle">Precise definitions earn AO1 marks and stop arguments being built on a misunderstanding.</div></div></div>
  <div class="guide-topic" id="gt-glossary">
    <div class="guide-topic-hd" onclick="toggleGT('gt-glossary')"><span class="guide-topic-code">REF</span><span class="guide-topic-name">All key terms by spec section</span><span class="guide-topic-chevron">&#9660;</span></div>
    <div class="guide-topic-body">${blocks}</div>
  </div>
</div>`;
  }

  function buildGuideHTML() {
    const total = sections().length;
    return `
<div class="guide-shell">
  <div class="guide-sidebar" id="guide-sidebar-bus">${buildSidebar()}</div>
  <div class="guide-main">
    <div class="guide-topbar">
      <div class="guide-progress-track"><div class="guide-progress-fill" id="guide-pf-bus" style="width:0%"></div></div>
      <span class="guide-progress-text" id="guide-pt-bus">0 / ${total} sections revised</span>
      <button class="guide-print-btn" onclick="window.print()">&#128438; Print guide</button>
    </div>
    ${startHtml()}
    ${sections().map((s, i) => sectionHtml(s, i)).join('')}
    ${formulaSheet()}
    ${glossary()}
  </div>
</div>`;
  }

  function updateProgress() {
    const nums = sections().map(s => s.num);
    const revised = getRevised();
    const count = nums.filter(n => revised.includes(n)).length;
    const fill = document.getElementById('guide-pf-bus');
    const text = document.getElementById('guide-pt-bus');
    if (fill) fill.style.width = (nums.length ? count / nums.length * 100 : 0) + '%';
    if (text) text.textContent = count + ' / ' + nums.length + ' sections revised';
    nums.forEach(n => {
      const btn = document.getElementById('gmb-' + n);
      if (!btn) return;
      const done = revised.includes(n);
      btn.classList.toggle('revised', done);
      btn.innerHTML = done ? '<span class="guide-mark-icon">&#10003;</span> 3.' + n + ' revised!' : '<span class="guide-mark-icon">&#9711;</span> Mark 3.' + n + ' as revised';
    });
  }

  function setupScrollSpy() {
    const els = document.querySelectorAll('.guide-aim-section[id]');
    if (!els.length || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        document.querySelectorAll('.guide-toc-aim-link').forEach(l => {
          const on = (l.getAttribute('onclick') || '').includes("'" + id + "'");
          l.classList.toggle('active', on);
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    els.forEach(s => observer.observe(s));
  }

  window.toggleGT = function (id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('open');
  };
  window.toggleGuideRevised = function (num) {
    const arr = getRevised();
    const i = arr.indexOf(num);
    if (i === -1) arr.push(num); else arr.splice(i, 1);
    saveRevised(arr);
    updateProgress();
  };
  window.guideScrollTo = function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.classList.contains('guide-topic')) el.classList.add('open');
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const sb = document.getElementById('guide-sidebar-bus');
    if (sb && window.innerWidth < 769) sb.classList.remove('sb-open');
  };

  window.initComprehensiveGuide = function () {
    const container = document.getElementById('guide-comprehensive');
    if (!container) return;
    if (container.dataset.built !== '1') {
      container.innerHTML = buildGuideHTML();
      container.dataset.built = '1';
      setupScrollSpy();
    }
    updateProgress();
    if (typeof window.applyGuideAccessRules === 'function') window.applyGuideAccessRules();
  };
})();
