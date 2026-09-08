/* Business Unit 1 — Comprehensive Revision Guide
   Initialised by calling window.initComprehensiveGuide()  */
(function () {
  'use strict';

  const STORE_KEY = 'ra10-guide-revised-BUS-u1';
  const AIMS = ['A','B','C','D','E'];
  const AIM_TITLES = {
    A: 'Features of Businesses',
    B: 'How Businesses Are Organised',
    C: 'The Business Environment',
    D: 'Business Markets',
    E: 'Innovation and Enterprise'
  };
  const AIM_SUBTITLES = {
    A: 'Ownership, liability, sectors, size, stakeholders and business success',
    B: 'Organisational structure, functional areas, aims and SMART objectives',
    C: 'External (PESTLE), internal and competitive environment; situational analysis',
    D: 'Market structures, demand, supply, price and elasticity',
    E: 'Role, benefits and risks of innovation and enterprise'
  };

  function getRevised() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch { return []; }
  }
  function saveRevised(arr) { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); }

  function buildSidebar() {
    const items = [
      { aim:'A', topics:[['A1','Features of businesses'],['A2','Stakeholders'],['A3','Business communications']] },
      { aim:'B', topics:[['B1','Structure & functional areas'],['B2','Aims & SMART objectives']] },
      { aim:'C', topics:[['C1','External environment (PESTLE)'],['C2','Internal environment'],['C3','Competitive environment'],['C4','Situational analysis']] },
      { aim:'D', topics:[['D1','Market structures'],['D2','Demand, supply & price'],['D3','Pricing & output decisions']] },
      { aim:'E', topics:[['E1','Role of innovation & enterprise'],['E2','Benefits & risks']] }
    ];
    return `
<button class="guide-sb-toggle" onclick="this.closest('.guide-sidebar').classList.toggle('sb-open')">
  <span>&#9776; Contents</span><span>&#8595;</span>
</button>
<div class="guide-sidebar-hd">
  <span class="guide-toc-label">Unit 1 Guide</span>
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
    { aim: 'A', kicker: 'Features', title: 'What makes a business tick', copy: 'Ownership, sectors, size and stakeholders — the building blocks of any business.', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80' },
    { aim: 'C', kicker: 'Environment', title: 'Forces that shape decisions', copy: 'PESTLE, SWOT and competitive pressures every business must navigate.', image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80' },
    { aim: 'D', kicker: 'Markets', title: 'Demand, supply and price', copy: 'Market structures and elasticity — how prices and output are really decided.', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80' },
    { aim: 'E', kicker: 'Innovation', title: 'Staying ahead', copy: 'Enterprise and innovation — the drivers of growth and survival.', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80' }
  ];

  function buildGuideGallery() {
    return `
<section class="guide-gallery" aria-label="Unit 1 visual overview">
  ${GUIDE_GALLERY.map(card => `
  <button class="guide-gallery-card" type="button" onclick="guideScrollTo('guide-aim-${card.aim}')" style="--guide-card-image:url('${card.image}')">
    <span class="guide-gallery-kicker">${card.kicker}</span>
    <span class="guide-gallery-title">${card.title}</span>
    <span class="guide-gallery-copy">${card.copy}</span>
    <span class="guide-gallery-source">Royalty-free stock photo</span>
  </button>`).join('')}
</section>`;
  }

  /* ===== AIM A ===== */
  const aimA = aimSection('A', [
    topic('A1','Features of businesses', `
<p>A <strong>business</strong> is any activity that provides goods or services — for profit or not. The common thread is striving to satisfy customers.</p>

<p><strong>Forms of ownership and liability:</strong></p>
<table class="g-table"><thead><tr><th>Type</th><th>Ownership</th><th>Liability</th><th>Key features</th></tr></thead><tbody>
<tr><td><strong>Sole trader</strong></td><td>One owner</td><td>Unlimited</td><td>Full control, keeps all profit, but personally liable for debts</td></tr>
<tr><td><strong>Partnership</strong></td><td>2+ owners</td><td>Unlimited (ordinary)</td><td>Shared skills/capital; shared liability and profit</td></tr>
<tr><td><strong>Private limited company (Ltd)</strong></td><td>Shareholders</td><td>Limited</td><td>Separate legal identity; shares not sold publicly</td></tr>
<tr><td><strong>Public limited company (plc)</strong></td><td>Shareholders</td><td>Limited</td><td>Shares traded on stock exchange; can raise large capital</td></tr>
<tr><td><strong>Cooperative</strong></td><td>Members</td><td>Varies</td><td>Owned and run by members for mutual benefit</td></tr>
<tr><td><strong>Not-for-profit</strong></td><td>Trustees/members</td><td>Varies</td><td>Charitable trust or voluntary; aims are social not profit</td></tr>
</tbody></table>

<p><strong>Limited vs unlimited liability:</strong> limited liability protects owners' personal assets (they only lose what they invested); unlimited liability means owners are personally responsible for all business debts.</p>

<p><strong>Sectors of the economy:</strong> primary (extraction), secondary (manufacturing), tertiary (services), quaternary (knowledge/IT).</p>

<p><strong>Scope and size:</strong> scope ranges from local to national to international. Size (by staff): micro (≤9), small (10–49), medium (50–249), large (250+).</p>`,true),

    topic('A2','Stakeholders and their influence', `
<p>A <strong>stakeholder</strong> is any individual or group with an interest in, or influence over, a business.</p>

<table class="g-table"><thead><tr><th>Type</th><th>Examples</th></tr></thead><tbody>
<tr><td><strong>Internal</strong></td><td>Owners, managers, employees</td></tr>
<tr><td><strong>External</strong></td><td>Suppliers, lenders, customers, competitors, government, local/national/international communities, pressure groups, interest groups</td></tr>
</tbody></table>

<p><strong>How stakeholders influence success:</strong></p>
<ul>
<li><strong>Shareholders</strong> expect returns — influence strategy via shareholder value.</li>
<li><strong>Customers</strong> are long-term assets — strong service builds loyalty and retention.</li>
<li><strong>Employees</strong> deliver the product/service — engagement drives quality and innovation.</li>
<li><strong>Communities and interest groups</strong> shape reputation through CSR expectations.</li>
</ul>`,true),

    topic('A3','Effective business communications', `
<p>Information must be presented appropriately for its audience.</p>

<ul>
<li><strong>Written:</strong> financial and non-financial reports, formal and informal reports.</li>
<li><strong>Oral:</strong> presentations (PowerPoint with speaker notes), video conferencing.</li>
<li><strong>Importance:</strong> social media and virtual communities help businesses engage audiences quickly and cheaply, aiding success.</li>
</ul>`,true)
  ]);

  /* ===== AIM B ===== */
  const aimB = aimSection('B', [
    topic('B1','Structure and organisation', `
<p><strong>Organisational structures:</strong></p>
<table class="g-table"><thead><tr><th>Structure</th><th>Key features</th></tr></thead><tbody>
<tr><td><strong>Hierarchical</strong></td><td>Many layers, clear chain of command, defined authority</td></tr>
<tr><td><strong>Flat</strong></td><td>Few layers, wide span of control, faster communication</td></tr>
<tr><td><strong>Matrix</strong></td><td>Staff report to two managers (e.g. function + project)</td></tr>
<tr><td><strong>Holacratic</strong></td><td>Self-managing teams, distributed authority, no formal hierarchy</td></tr>
</tbody></table>

<p><strong>Functional areas:</strong> HR, R&D, sales, marketing, purchasing, production/quality, finance, customer service, IT, administration.</p>`,true),

    topic('B2','Aims and objectives', `
<p><strong>Aims by sector:</strong></p>
<ul>
<li><strong>Private:</strong> profit, profit maximisation, break-even, survival, growth, market leadership.</li>
<li><strong>Public:</strong> service provision, cost control, value for money, service quality, meeting government standards.</li>
<li><strong>Not-for-profit:</strong> education, housing, alleviating poverty, healthcare.</li>
</ul>

<p><strong>SMART objectives:</strong> Specific, Measurable, Achievable, Relevant, Time-constrained.</p>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
Mission, vision and values give a business direction; SMART objectives turn them into concrete, trackable targets.</div>`,true)
  ]);

  /* ===== AIM C ===== */
  const aimC = aimSection('C', [
    topic('C1','External environment (PESTLE)', `
<table class="g-table"><thead><tr><th>Factor</th><th>Examples</th></tr></thead><tbody>
<tr><td><strong>Political</strong></td><td>Government support, trading partners, fiscal/monetary policy</td></tr>
<tr><td><strong>Economic</strong></td><td>Economic growth, exchange rates, inflation, interest rates</td></tr>
<tr><td><strong>Social</strong></td><td>Demographic trends, tastes, attitudes to saving/spending, lifestyle</td></tr>
<tr><td><strong>Technological</strong></td><td>Automation, improved communications, digital transformation</td></tr>
<tr><td><strong>Legal</strong></td><td>Companies acts, competition law, employment law, corporate governance</td></tr>
<tr><td><strong>Environmental</strong></td><td>Carbon emissions, waste, recycling, pollution, ethical trends</td></tr>
</tbody></table>`,true),

    topic('C2','Internal environment', `
<ul>
<li><strong>Corporate culture:</strong> the shared values, beliefs and ways of working within an organisation.</li>
<li><strong>CSR and ethics:</strong> a business's commitment to act ethically and consider its social and environmental impact beyond legal requirements.</li>
</ul>`,true),

    topic('C3','Competitive environment', `
<p>Competition operates at local, national and international levels.</p>
<p><strong>Sources of competitive advantage:</strong> differentiation, pricing policies, market leadership, reputation, market share, cost control, technology, and relationships with customers, suppliers and employees.</p>
<p><strong>Benefits:</strong> maintaining a competitive advantage sustains market share, profitability and long-term survival.</p>`,true),

    topic('C4','Situational analysis', `
<p>Techniques to assess the business environment:</p>
<ul>
<li><strong>PESTLE</strong> — external macro factors.</li>
<li><strong>SWOT</strong> — internal strengths/weaknesses, external opportunities/threats.</li>
<li><strong>5Cs</strong> — Company, Competitors, Customers, Collaborators, Climate.</li>
<li><strong>Porter's Five Forces</strong> — competitive rivalry, buyer/supplier power, substitutes, new entrants.</li>
</ul>`,true)
  ]);

  /* ===== AIM D ===== */
  const aimD = aimSection('D', [
    topic('D1','Market structures', `
<table class="g-table"><thead><tr><th>Structure</th><th>Firms</th><th>Entry</th><th>Product</th><th>Pricing power</th></tr></thead><tbody>
<tr><td><strong>Perfect competition</strong></td><td>Many</td><td>Free</td><td>Homogeneous</td><td>None (price taker)</td></tr>
<tr><td><strong>Imperfect competition</strong></td><td>Few</td><td>Barriers</td><td>Differentiated</td><td>Some (price maker)</td></tr>
</tbody></table>`,true),

    topic('D2','Demand, supply and price', `
<p><strong>Influences on demand:</strong> affordability, competition, availability of substitutes, GDP level, consumer needs and aspirations.</p>
<p><strong>Influences on supply:</strong> availability of raw materials and labour, logistics, ability to produce profitably, competition for raw materials, government support.</p>
<p><strong>Price elasticity of demand:</strong> the responsiveness of quantity demanded to a change in price. Elastic = responsive; inelastic = unresponsive.</p>`,true),

    topic('D3','Pricing and output decisions', `
<p>Market structure shapes pricing and output:</p>
<ul>
<li>In <strong>perfect competition</strong> firms are price takers — they accept the market price.</li>
<li>In <strong>imperfect competition</strong> firms have pricing power and adjust output to maximise profit.</li>
<li>Businesses <strong>respond to competitor</strong> price and output changes — e.g. matching prices, differentiating, or improving quality.</li>
</ul>`,true)
  ]);

  /* ===== AIM E ===== */
  const aimE = aimSection('E', [
    topic('E1','Role of innovation and enterprise', `
<p><strong>Innovation:</strong> the creative process of developing new products, services or processes that add value and differentiate the business — improving efficiency or profitability.</p>
<p><strong>Enterprise:</strong> identifying opportunities to develop business activities through creative, lateral and 'blue sky' thinking, plus chance, serendipity and intuition.</p>`,true),

    topic('E2','Benefits and risks', `
<table class="g-table"><thead><tr><th>Benefits</th><th>Risks</th></tr></thead><tbody>
<tr><td>Improved products, processes and customer experience</td><td>Failing to meet operational/commercial requirements</td></tr>
<tr><td>Business growth and new/niche markets</td><td>Failing to achieve return on investment</td></tr>
<tr><td>Unique selling points</td><td>Cultural problems (resistance to change)</td></tr>
<tr><td>Improved recognition and reputation</td><td>Insufficient leadership/management support</td></tr>
<tr><td>Smarter working</td><td>Unsupportive systems and processes</td></tr>
</tbody></table>`,true)
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
