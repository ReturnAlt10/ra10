/* Business Unit 2 — Comprehensive Revision Guide
   Initialised by calling window.initComprehensiveGuide()  */
(function () {
  'use strict';

  const STORE_KEY = 'ra10-guide-revised-BUS-u2';
  const AIMS = ['A','B','C','D'];
  const AIM_TITLES = {
    A: 'Principles and Purposes of Marketing',
    B: 'Information for the Rationale',
    C: 'Planning the Campaign',
    D: 'Developing the Campaign'
  };
  const AIM_SUBTITLES = {
    A: 'Role of marketing, aims, markets, branding and influences',
    B: 'Market research methods, data and the product life cycle',
    C: 'Situational analysis, marketing mix and campaign content',
    D: 'Legal/ethical compliance, evaluation and flexibility'
  };

  function getRevised() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch { return []; }
  }
  function saveRevised(arr) { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); }

  function buildSidebar() {
    const items = [
      { aim:'A', topics:[['A1','Role of marketing'],['A2','Influences on marketing']] },
      { aim:'B', topics:[['B1','Purpose of research'],['B2','Research methods'],['B3','Developing the rationale']] },
      { aim:'C', topics:[['C1','Campaign activity'],['C2','Marketing mix'],['C3','The campaign'],['C4','Appropriateness']] },
      { aim:'D', topics:[['D1','Legal & ethical'],['D2','Evaluation & flexibility']] }
    ];
    return `
<button class="guide-sb-toggle" onclick="this.closest('.guide-sidebar').classList.toggle('sb-open')">
  <span>&#9776; Contents</span><span>&#8595;</span>
</button>
<div class="guide-sidebar-hd">
  <span class="guide-toc-label">Unit 2 Guide</span>
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
    { aim: 'A', kicker: 'Principles', title: 'What marketing does', copy: 'Anticipating, recognising, stimulating and satisfying demand — and the influences on it.', image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=1200&q=80' },
    { aim: 'B', kicker: 'Research', title: 'Evidence-based decisions', copy: 'Primary and secondary research, data quality and the product life cycle.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' },
    { aim: 'C', kicker: 'Planning', title: 'The marketing mix', copy: 'Product, price, place and promotion — building an effective campaign.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80' },
    { aim: 'D', kicker: 'Development', title: 'Making it work', copy: 'Legal compliance, evaluation and adapting the campaign to change.', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80' }
  ];

  function buildGuideGallery() {
    return `
<section class="guide-gallery" aria-label="Unit 2 visual overview">
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
    topic('A1','Role of marketing', `
<p>Marketing performs four key functions (principles/purposes):</p>
<ul>
<li><strong>Anticipating demand</strong> — predicting what customers will want.</li>
<li><strong>Recognising demand</strong> — identifying existing demand in the market.</li>
<li><strong>Stimulating demand</strong> — encouraging customers to buy.</li>
<li><strong>Satisfying demand</strong> — meeting customer needs to build loyalty.</li>
</ul>

<p><strong>Marketing aims and objectives:</strong> understanding customer wants/needs, developing new products, improving profitability, increasing market share, diversification, and increased brand awareness/loyalty.</p>

<p><strong>Types of market:</strong> mass market (large, broad, similar needs) vs niche market (small, specialised). <strong>Market segmentation</strong> divides a market by age, gender, income, lifestyle, geography or behaviour.</p>

<p><strong>Branding:</strong> brand personality (human characteristics), brand image (customer perception), and unique selling point (USP — a feature that differentiates the product).</p>`,true),

    topic('A2','Influences on marketing activity', `
<table class="g-table"><thead><tr><th>Type</th><th>Influences</th></tr></thead><tbody>
<tr><td><strong>Internal</strong></td><td>Cost of the campaign, availability of finance, expertise of staff, size and culture of the business</td></tr>
<tr><td><strong>External</strong></td><td>Social, technological, economic, environmental, political, legal, ethical</td></tr>
</tbody></table>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
Know the difference between internal (within the business's control, e.g. budget, staff) and external (outside its control, e.g. economic conditions, legislation) influences.</div>`,true)
  ]);

  const aimB = aimSection('B', [
    topic('B1','Purpose of research', `
<p>Market research identifies:</p>
<ul>
<li><strong>Target markets</strong> — who to sell to.</li>
<li><strong>Size, structure and trends</strong> of the market.</li>
<li><strong>Competition</strong> — who else operates there.</li>
</ul>`,true),

    topic('B2','Research methods', `
<table class="g-table"><thead><tr><th>Type</th><th>Methods / sources</th></tr></thead><tbody>
<tr><td><strong>Primary research</strong></td><td>Survey, interview, observation, trials, focus groups</td></tr>
<tr><td><strong>Secondary — internal</strong></td><td>Sales records, loyalty card data, customer records</td></tr>
<tr><td><strong>Secondary — external</strong></td><td>Government statistics, trade journals, commercially published reports, media</td></tr>
</tbody></table>

<p><strong>Research quality:</strong> must be valid (measures what it claims), reliable (consistent), appropriate, current and cost-effective.</p>
<p><strong>Data:</strong> quantitative (numerical) vs qualitative (descriptive opinions/feelings).</p>`,true),

    topic('B3','Developing the rationale', `
<p>The rationale interprets and analyses research data to make valid marketing decisions. It should:</p>
<ul>
<li>Interpret data to inform decisions.</li>
<li>Identify any further information needed.</li>
<li>Evaluate the reliability and validity of the information.</li>
<li>Consider the <strong>product life cycle</strong>: introduction → growth → maturity → decline.</li>
</ul>`,true)
  ]);

  const aimC = aimSection('C', [
    topic('C1','Campaign activity', `
<ul>
<li>Select marketing aims and objectives to suit business goals.</li>
<li>Conduct <strong>situational analysis</strong>: SWOT (Strengths, Weaknesses, Opportunities, Threats) and PESTLE (Political, Economic, Social, Technological, Legal, Environmental).</li>
<li>Use research data to determine the target market and analyse competitors.</li>
</ul>`,true),

    topic('C2','Marketing mix', `
<table class="g-table"><thead><tr><th>Element</th><th>Details</th></tr></thead><tbody>
<tr><td><strong>Product</strong></td><td>Form and function, packaging, branding</td></tr>
<tr><td><strong>Price</strong></td><td>Penetration, skimming, competitor-based, cost-plus</td></tr>
<tr><td><strong>Promotion</strong></td><td>Advertising, PR, sponsorship, social media, guerrilla marketing, personal selling, product placement, digital marketing</td></tr>
<tr><td><strong>Place</strong></td><td>Direct (mail/online/auction), retailers, wholesalers</td></tr>
</tbody></table>

<p><strong>Extended mix (7Ps):</strong> adds People, Physical environment and Process.</p>`,true),

    topic('C3','The campaign', `
<p>A campaign must plan:</p>
<ul>
<li>The <strong>content</strong> of the marketing message.</li>
<li>An appropriate <strong>marketing mix</strong>.</li>
<li>Appropriate <strong>media</strong>.</li>
<li><strong>Budget allocation</strong>.</li>
<li><strong>Timeline</strong> including monitoring.</li>
<li>How it will be <strong>evaluated</strong>.</li>
</ul>`,true),

    topic('C4','Appropriateness', `
<p>The campaign must:</p>
<ul>
<li>Reinforce and support <strong>brand value</strong>.</li>
<li>Be <strong>sustainable</strong>.</li>
<li>Be <strong>flexible</strong> to respond to changes.</li>
<li>Be relevant to <strong>organisational goals</strong> and the <strong>target market</strong>.</li>
<li>Meet <strong>legal and ethical</strong> considerations.</li>
</ul>`,true)
  ]);

  const aimD = aimSection('D', [
    topic('D1','Legal and ethical considerations', `
<ul>
<li>Advertising must be <strong>truthful and accurate</strong> — no misleading claims.</li>
<li><strong>Data protection</strong> — customer data must be handled lawfully.</li>
<li><strong>Consumer protection</strong> — respect consumer rights.</li>
<li>Avoid inappropriate targeting (e.g. children) and inaccurate environmental claims.</li>
</ul>`,true),

    topic('D2','Evaluation and flexibility', `
<p><strong>Evaluating a campaign:</strong> measure against its aims and objectives using metrics such as sales, brand awareness, engagement and return on investment.</p>
<p><strong>Flexibility:</strong> a campaign must adapt to internal and external changes — competitor actions, economic shifts, or feedback — to remain effective.</p>`,true)
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
