/* Business Unit 4 — Comprehensive Revision Guide
   Initialised by calling window.initComprehensiveGuide()  */
(function () {
  'use strict';

  const STORE_KEY = 'ra10-guide-revised-BUS-u4';
  const AIMS = ['A','B','C','D','E'];
  const AIM_TITLES = {
    A: 'Role of an Event Organiser',
    B: 'Feasibility of an Event',
    C: 'Planning the Event',
    D: 'Staging and Managing the Event',
    E: 'Evaluation and Reflection'
  };
  const AIM_SUBTITLES = {
    A: 'Tasks, skills and the skills audit',
    B: 'Types of event, factors affecting success and feasibility',
    C: 'Planning tools and key factors',
    D: 'Managing the event and problem solving',
    E: 'Evaluating the event and reviewing personal skills'
  };

  function getRevised() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch { return []; }
  }
  function saveRevised(arr) { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); }

  function buildSidebar() {
    const items = [
      { aim:'A', topics:[['A1','Tasks of an organiser'],['A2','Skills'],['A3','Skills audit']] },
      { aim:'B', topics:[['B1','Types of event & success factors'],['B2','Feasibility']] },
      { aim:'C', topics:[['C1','Planning tools'],['C2','Factors to consider']] },
      { aim:'D', topics:[['D1','Managing the event'],['D2','Problem solving']] },
      { aim:'E', topics:[['E1','Evaluating the event'],['E2','Skills development']] }
    ];
    return `
<button class="guide-sb-toggle" onclick="this.closest('.guide-sidebar').classList.toggle('sb-open')">
  <span>&#9776; Contents</span><span>&#8595;</span>
</button>
<div class="guide-sidebar-hd">
  <span class="guide-toc-label">Unit 4 Guide</span>
</div>
<div class="guide-toc-scroll">
  ${items.map(g=>`
  <div class="guide-toc-aim-group">
    <button class="guide-toc-aim-link" onclick="guideScrollTo('guide-aim-${g.aim}')">
      <span class="guide-toc-badge">${g.aim}</span>${AIM_TITLES[g.aim].split(' ').slice(0,3).join(' ')}…
    </button>
    <div class="guide-toc-topic-links">
      ${g.topics.map(([code,name])=>`<button class="guide-toc-topic-link" onclick="guideScrollTo('gt-${code}')">${code} ${name}</button>`).join('')}
    </div>
  </div>`).join('')}
</div>`;
  }

  function topic(code, name, bodyHtml, open) {
    return `
<div class="guide-topic${open?' open':''}" id="gt-${code}">
  <div class="guide-topic-hd" onclick="toggleGT('gt-${code}')">
    <span class="guide-topic-code">${code}</span>
    <span class="guide-topic-name">${name}</span>
    <span class="guide-topic-chevron">&#9660;</span>
  </div>
  <div class="guide-topic-body">${bodyHtml}</div>
</div>`;
  }

  function aimSection(letter, topicsHtml) {
    return `
<div class="guide-aim-section" id="guide-aim-${letter}">
  <div class="guide-aim-hd">
    <div class="guide-aim-badge">${letter}</div>
    <div>
      <div class="guide-aim-title">Aim ${letter}: ${AIM_TITLES[letter]}</div>
      <div class="guide-aim-subtitle">${AIM_SUBTITLES[letter]}</div>
    </div>
  </div>
  ${topicsHtml}
  <button class="guide-mark-btn" id="gmb-${letter}" onclick="toggleGuideRevised('${letter}')">
    <span class="guide-mark-icon">&#9711;</span> Mark Aim ${letter} as revised
  </button>
</div>`;
  }

  const GUIDE_GALLERY = [
    { aim: 'A', kicker: 'Role', title: 'What an organiser does', copy: 'Tasks and skills needed to plan and run a successful event.', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80' },
    { aim: 'C', kicker: 'Planning', title: 'Turning ideas into a plan', copy: 'Gantt charts, action plans, budgets and risk assessment.', image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80' },
    { aim: 'D', kicker: 'Staging', title: 'Making it happen', copy: 'Managing the day and solving problems under pressure.', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80' },
    { aim: 'E', kicker: 'Reflection', title: 'Learning from experience', copy: 'Evaluating the event and developing your own skills.', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80' }
  ];

  function buildGuideGallery() {
    return `
<section class="guide-gallery" aria-label="Unit 4 visual overview">
  ${GUIDE_GALLERY.map(card => `
  <button class="guide-gallery-card" type="button" onclick="guideScrollTo('guide-aim-${card.aim}')" style="--guide-card-image:url('${card.image}')">
    <span class="guide-gallery-kicker">${card.kicker}</span>
    <span class="guide-gallery-title">${card.title}</span>
    <span class="guide-gallery-copy">${card.copy}</span>
    <span class="guide-gallery-source">Royalty-free stock photo</span>
  </button>`).join('')}
</section>`;
  }

  const aimA = aimSection('A', [
    topic('A1','Tasks of an event organiser', `
<p>An event organiser plans, coordinates and delivers an event. Key tasks include:</p>
<ul>
<li><strong>Planning</strong> — defining aims, creating a plan and schedule.</li>
<li><strong>Organising resources</strong> — venue, suppliers, equipment, staff.</li>
<li><strong>Budgeting</strong> — managing income and costs.</li>
<li><strong>Promoting</strong> — marketing the event to attract attendees.</li>
<li><strong>Coordinating</strong> — overseeing everything on the day.</li>
<li><strong>Evaluating</strong> — reviewing the event afterwards.</li>
</ul>`,true),

    topic('A2','Skills of an event organiser', `
<table class="g-table"><thead><tr><th>Skill</th><th>Why it matters</th></tr></thead><tbody>
<tr><td><strong>Communication</strong></td><td>Liaising with clients, suppliers, venues and staff</td></tr>
<tr><td><strong>Organisation</strong></td><td>Coordinating multiple tasks and resources</td></tr>
<tr><td><strong>Problem solving</strong></td><td>Dealing with unexpected issues</td></tr>
<tr><td><strong>Negotiation</strong></td><td>Securing good deals with suppliers and venues</td></tr>
<tr><td><strong>Leadership</strong></td><td>Directing and motivating a team</td></tr>
<tr><td><strong>Teamwork</strong></td><td>Working collaboratively with staff and volunteers</td></tr>
<tr><td><strong>Time management</strong></td><td>Meeting deadlines and keeping the schedule</td></tr>
</tbody></table>`,true),

    topic('A3','Skills audit', `
<p>A <strong>skills audit</strong> is a review of an individual's current skills and abilities, identifying strengths and areas for development.</p>
<p>It is carried out <strong>before</strong> organising an event so the organiser knows what they can do and where they need support, and to plan personal development.</p>`,true)
  ]);

  const aimB = aimSection('B', [
    topic('B1','Types of event and factors affecting success', `
<p><strong>Types of event:</strong> business (conferences, product launches), social (weddings, parties), sports (tournaments, races), and entertainment (concerts, festivals).</p>
<p><strong>Factors affecting success:</strong> venue, budget, timing, marketing/promotion, quality of organisation, and customer experience.</p>`,true),

    topic('B2','Feasibility', `
<p><strong>Feasibility</strong> is whether an event is practical and achievable given the available resources, budget, venue and timing.</p>
<p><strong>Factors to consider:</strong></p>
<ul>
<li><strong>Cost and budget</strong> — can the event cover its costs?</li>
<li><strong>Resources</strong> — venue, staff, equipment, insurance.</li>
<li><strong>Venue</strong> — suitable, available, accessible.</li>
<li><strong>Timing</strong> — a practical date without clashes.</li>
</ul>
<p><strong>Critical success factors:</strong> clear aims and objectives, adequate budget, effective marketing, strong planning, and positive customer experience.</p>`,true)
  ]);

  const aimC = aimSection('C', [
    topic('C1','Planning tools', `
<ul>
<li><strong>Gantt chart</strong> — shows tasks against a timeline, making the schedule visual.</li>
<li><strong>Action plan</strong> — lists tasks, responsibilities and deadlines.</li>
<li><strong>Critical path analysis</strong> — identifies the sequence of tasks that determines the project duration.</li>
</ul>`,true),

    topic('C2','Factors to consider', `
<p>When planning an event, consider:</p>
<ul>
<li><strong>Budget</strong> — venue, marketing, staff, equipment, insurance, catering.</li>
<li><strong>Resources</strong> — staff/volunteers, equipment, materials.</li>
<li><strong>Health and safety</strong> — a risk assessment identifying hazards and controls.</li>
<li><strong>Contingency</strong> — backup plans for unexpected problems.</li>
</ul>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
A <strong>risk assessment</strong> identifies hazards, assesses likelihood and severity, and puts controls in place. A <strong>contingency plan</strong> is a backup for things going wrong (bad weather, supplier failure, low attendance).</div>`,true)
  ]);

  const aimD = aimSection('D', [
    topic('D1','Managing the event', `
<p>On the day, the event manager is responsible for:</p>
<ul>
<li><strong>Coordinating staff and suppliers</strong>.</li>
<li><strong>Overseeing the schedule</strong> — keeping activities on time.</li>
<li><strong>Ensuring health and safety</strong>.</li>
<li><strong>Managing the budget</strong> on the day.</li>
</ul>`,true),

    topic('D2','Problem solving', `
<p>When an unexpected problem occurs, the manager should:</p>
<ol>
<li>Stay calm and <strong>assess the problem</strong> quickly.</li>
<li>Determine its <strong>impact</strong> on the event.</li>
<li><strong>Implement a contingency plan</strong> or find a quick solution.</li>
<li><strong>Communicate</strong> with staff and attendees to minimise disruption.</li>
</ol>`,true)
  ]);

  const aimE = aimSection('E', [
    topic('E1','Evaluating the event', `
<p>An event is evaluated by:</p>
<ul>
<li>Collecting <strong>feedback</strong> from attendees.</li>
<li>Reviewing against <strong>aims and objectives</strong>.</li>
<li>Analysing the <strong>budget</strong> and attendance/sales.</li>
<li>Holding a <strong>team debrief</strong>.</li>
</ul>
<p>Evaluation identifies what went well and what could improve, providing learning for future events.</p>`,true),

    topic('E2','Skills development', `
<p>Running an event develops practical skills (planning, communication, teamwork, problem solving) through hands-on experience.</p>
<p><strong>Reflection</strong> on the event identifies strengths and areas for improvement, turning experience into learning and supporting personal and career development.</p>`,true)
  ]);

  function buildGuideHTML() {
    return `
<div class="guide-shell">
  <div class="guide-sidebar" id="guide-sidebar-bus">
    ${buildSidebar()}
  </div>
  <div class="guide-main">
    <div class="guide-topbar">
      <div class="guide-progress-track"><div class="guide-progress-fill" id="guide-pf-bus" style="width:0%"></div></div>
      <span class="guide-progress-text" id="guide-pt-bus">0 / ${AIMS.length} aims revised</span>
      <button class="guide-print-btn" onclick="window.print()">&#128438; Print guide</button>
    </div>
    ${buildGuideGallery()}
    ${aimA}
    ${aimB}
    ${aimC}
    ${aimD}
    ${aimE}
  </div>
</div>`;
  }

  function updateProgress() {
    const revised = getRevised();
    const count = AIMS.filter(a => revised.includes(a)).length;
    const fill = document.getElementById('guide-pf-bus');
    const text = document.getElementById('guide-pt-bus');
    if (fill) fill.style.width = (count / AIMS.length * 100) + '%';
    if (text) text.textContent = count + ' / ' + AIMS.length + ' aims revised';
    AIMS.forEach(a => {
      const btn = document.getElementById('gmb-' + a);
      if (!btn) return;
      const done = revised.includes(a);
      btn.classList.toggle('revised', done);
      btn.innerHTML = done
        ? '<span class="guide-mark-icon">&#10003;</span> Aim ' + a + ' revised!'
        : '<span class="guide-mark-icon">&#9711;</span> Mark Aim ' + a + ' as revised';
    });
  }

  function setupScrollSpy() {
    const sections = document.querySelectorAll('.guide-aim-section[id]');
    if (!sections.length) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        document.querySelectorAll('.guide-toc-aim-link').forEach(l => {
          l.classList.toggle('active', l.getAttribute('onclick') && l.getAttribute('onclick').includes(id));
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(s => observer.observe(s));
  }

  window.toggleGT = window.toggleGT || function(id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('open');
  };
  window.toggleGuideRevised = function(aimLetter) {
    const arr = getRevised();
    const idx = arr.indexOf(aimLetter);
    if (idx === -1) arr.push(aimLetter); else arr.splice(idx, 1);
    saveRevised(arr);
    updateProgress();
  };
  window.guideScrollTo = window.guideScrollTo || function(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const sb = document.getElementById('guide-sidebar-bus');
    if (sb && window.innerWidth < 769) sb.classList.remove('sb-open');
  };

  window.initComprehensiveGuide = function() {
    const container = document.getElementById('guide-comprehensive');
    if (!container) return;
    if (container.dataset.built === '1') { updateProgress(); return; }
    container.innerHTML = buildGuideHTML();
    container.dataset.built = '1';
    updateProgress();
    setupScrollSpy();
  };

})();
