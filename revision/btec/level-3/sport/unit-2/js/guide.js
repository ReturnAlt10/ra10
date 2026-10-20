/* Sport Unit 2 — Comprehensive Revision Guide
   Initialised by calling window.initComprehensiveGuide()  */
(function () {
  'use strict';

  const U2 = window.U2;
  const STORE_KEY = 'ra10-guide-revised-SPORT-u2';
  const AIMS = ['A', 'B', 'C', 'D', 'E'];
  const AIM_TITLES = {
    A: 'Examine lifestyle factors and their effect on health and well-being',
    B: 'Understand the screening processes for training programming',
    C: 'Understand programme-related nutritional needs',
    D: 'Examine training methods for different components of fitness',
    E: 'Understand training programme design'
  };
  const AIM_SUBTITLES = {
    A: 'Positive and negative lifestyle factors, government guidelines, barriers to change and lifestyle modification techniques',
    B: 'Screening questionnaires, legal considerations and interpreting blood pressure, resting heart rate, BMI and waist to hip ratio',
    C: 'Nutritional terminology, macronutrients, micronutrients, hydration, weight strategies, ergogenic aids and sports drinks',
    D: 'Components of physical and skill-related fitness and the specification training methods for each',
    E: 'Aims, objectives, SMARTER goals, resources, FITT, additional principles of training and periodisation'
  };

  function getRevised() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch (e) { return []; }
  }
  function saveRevised(arr) { try { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); } catch (e) {} }

  /* ── Building blocks ──────────────────────────────────────────────── */
  const TOC = {
    A: [['A1', 'Positive lifestyle factors'], ['A2', 'Negative lifestyle factors'], ['A3', 'Lifestyle modification techniques']],
    B: [['B1', 'Screening processes'], ['B2', 'Health monitoring tests'], ['B3', 'Interpreting results']],
    C: [['C1', 'Common terminology'], ['C2', 'Components of a balanced diet'], ['C3', 'Nutritional strategies']],
    D: [['D1', 'Components of fitness'], ['D2', 'Physical fitness methods'], ['D3', 'Skill-related methods']],
    E: [['E1', 'Programme design and principles']]
  };

  function buildSidebar() {
    return `
<button class="guide-sb-toggle" onclick="this.closest('.guide-sidebar').classList.toggle('sb-open')">
  <span>&#9776; Contents</span><span>&#8595;</span>
</button>
<div class="guide-sidebar-hd"><span class="guide-toc-label">Unit 2 Guide</span></div>
<div class="guide-toc-scroll">
  <div class="guide-toc-aim-group">
    <button class="guide-toc-aim-link" onclick="guideScrollTo('guide-set-task')"><span class="guide-toc-badge">★</span>The set task</button>
  </div>
  ${AIMS.map(a => `
  <div class="guide-toc-aim-group">
    <button class="guide-toc-aim-link" onclick="guideScrollTo('guide-aim-${a}')"><span class="guide-toc-badge">${a}</span>${AIM_TITLES[a]}</button>
    <div class="guide-toc-topic-links">
      ${TOC[a].map(([code, name]) => `<button class="guide-toc-topic-link" onclick="guideScrollTo('gt-${code}')">${code} ${name}</button>`).join('')}
    </div>
  </div>`).join('')}
</div>`;
  }

  function topic(code, name, bodyHtml, open) {
    return `
<div class="guide-topic${open ? ' open' : ''}" id="gt-${code}">
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
      <div class="guide-aim-title">Learning aim ${letter}: ${AIM_TITLES[letter]}</div>
      <div class="guide-aim-subtitle">${AIM_SUBTITLES[letter]}</div>
    </div>
  </div>
  ${topicsHtml.join('')}
  <button class="guide-mark-btn" id="gmb-${letter}" onclick="toggleGuideRevised('${letter}')">
    <span class="guide-mark-icon">&#9711;</span> Mark aim ${letter} as revised
  </button>
</div>`;
  }

  const key = (t, body) => `<div class="g-callout g-key"><strong>${t}</strong><div>${body}</div></div>`;
  const tip = (body) => `<div class="g-callout g-tip"><strong>Exam tip</strong><div>${body}</div></div>`;
  const warn = (body) => `<div class="g-callout g-warn"><strong>Common mistake</strong><div>${body}</div></div>`;
  const fig = (svg, cap) => `<figure class="guide-diagram">${svg}<figcaption>${cap}</figcaption></figure>`;
  const table = (head, rows) => `<div class="g-table-wrap"><table class="g-table"><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
  const ul = (items) => `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;

  /* ── SVG diagrams (colours chosen to read in light and dark themes) ── */
  const C = { green: '#16a34a', lime: '#65a30d', amber: '#d97706', orange: '#ea580c', red: '#dc2626', darkred: '#991b1b', blue: '#2563eb', sky: '#0284c7', violet: '#7c3aed', slate: '#64748b', teal: '#0d9488' };
  const svgOpen = (w, h, label) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}" style="width:100%;max-width:${w}px;font-family:inherit" fill="currentColor">`;

  // Horizontal classification scale: segments = [[label, from, to, colour]]
  function scale(label, segments, min, max, unit, marker) {
    const W = 640, x0 = 20, x1 = 620, y = 46, h = 30;
    const sx = v => x0 + (Math.min(Math.max(v, min), max) - min) / (max - min) * (x1 - x0);
    let s = svgOpen(W, 120, label);
    segments.forEach(([name, a, b, col]) => {
      const xa = sx(a), xb = sx(b);
      s += `<rect x="${xa}" y="${y}" width="${xb - xa}" height="${h}" fill="${col}" opacity=".85"/>`;
      s += `<text x="${(xa + xb) / 2}" y="${y + 19}" font-size="11" text-anchor="middle" fill="#fff" font-weight="700">${name}</text>`;
    });
    segments.forEach(([, a], i) => { if (i) s += `<text x="${sx(a)}" y="${y + h + 16}" font-size="11" text-anchor="middle">${a}</text>`; });
    s += `<text x="${x0}" y="22" font-size="12" font-weight="700">${label}</text><text x="${x1}" y="22" font-size="11" text-anchor="end" opacity=".7">${unit}</text>`;
    if (marker) {
      const mx = sx(marker[0]);
      s += `<path d="M${mx} ${y - 2} l-6 -10 h12 z" fill="${C.violet}"/><text x="${mx}" y="${y + h + 34}" font-size="11" text-anchor="middle" fill="${C.violet}" font-weight="700">${marker[1]}</text>`;
    }
    return s + '</svg>';
  }

  function bpChart() {
    // Systolic on x, diastolic on y — nested risk zones.
    const W = 560, H = 330, ox = 60, oy = 290;
    const X = v => ox + (v - 80) / (190 - 80) * 470;
    const Y = v => oy - (v - 50) / (120 - 50) * 260;
    const zones = [[190, 120, C.darkred, 'Grade 3'], [179, 109, C.red, 'Grade 2'], [159, 99, C.orange, 'Grade 1'], [139, 89, C.amber, 'High normal'], [129, 84, C.lime, 'Normal'], [119, 79, C.green, 'Optimal']];
    let s = svgOpen(W, H, 'Blood pressure classification chart');
    zones.forEach(([sys, dia, col, name]) => {
      s += `<rect x="${X(80)}" y="${Y(dia)}" width="${X(sys) - X(80)}" height="${Y(50) - Y(dia)}" fill="${col}" opacity=".9"/>`;
      s += `<text x="${X(80) + 8}" y="${Y(dia) + 15}" font-size="11" fill="#fff" font-weight="700">${name}</text>`;
    });
    [90, 120, 130, 140, 160, 180].forEach(v => { s += `<text x="${X(v)}" y="${oy + 16}" font-size="10" text-anchor="middle">${v}</text>`; });
    [60, 80, 85, 90, 100, 110].forEach(v => { s += `<text x="${ox - 6}" y="${Y(v) + 4}" font-size="10" text-anchor="end">${v}</text>`; });
    s += `<text x="${ox + 235}" y="${H - 4}" font-size="11" text-anchor="middle">Systolic (mmHg)</text><text x="14" y="${oy - 130}" font-size="11" transform="rotate(-90 14 ${oy - 130})" text-anchor="middle">Diastolic (mmHg)</text>`;
    // Example: Sadie 150/98
    const pin = (sys, dia, label, col, dx) => `<circle cx="${X(sys)}" cy="${Y(dia)}" r="6" fill="#fff" stroke="${col}" stroke-width="3"/><rect x="${X(sys) + dx - 4}" y="${Y(dia) + 10}" width="${label.length * 6.6 + 8}" height="18" rx="5" fill="#fff"/><text x="${X(sys) + dx}" y="${Y(dia) + 23}" font-size="11" font-weight="700" fill="${col}">${label}</text>`;
    s += pin(150, 98, 'Sadie 150/98', C.violet, 4) + pin(130, 95, 'Ben 130/95', C.blue, -40);
    return s + '</svg>';
  }

  function guidelineCards() {
    const cards = [['5–18 years', '60 min a day', 'moderate-to-vigorous on average across the week; activities for muscles and bones', C.sky], ['19–64 years', '150 min a week', 'moderate (or 75 min vigorous) + strength on 2 days + less sitting', C.green], ['65+ years', '150 min a week', 'as adults + balance & flexibility on 2 days + break up sitting', C.violet]];
    let s = svgOpen(640, 170, 'UK physical activity guidelines by age');
    cards.forEach(([age, big, small, col], i) => {
      const x = 10 + i * 210;
      s += `<rect x="${x}" y="10" width="200" height="150" rx="14" fill="${col}" opacity=".12" stroke="${col}"/>`;
      s += `<text x="${x + 16}" y="38" font-size="13" font-weight="700" fill="${col}">${age}</text><text x="${x + 16}" y="72" font-size="22" font-weight="800">${big}</text>`;
      const words = small.split(' '); let line = '', ly = 98;
      words.forEach(w => { if ((line + w).length > 28) { s += `<text x="${x + 16}" y="${ly}" font-size="11">${line}</text>`; ly += 15; line = ''; } line += w + ' '; });
      s += `<text x="${x + 16}" y="${ly}" font-size="11">${line}</text>`;
    });
    return s + '</svg>';
  }

  function lifestyleWeb() {
    const f = [['Diet', C.green], ['Exercise', C.blue], ['Sedentary', C.slate], ['Smoking', C.red], ['Alcohol', C.orange], ['Stress', C.violet], ['Sleep', C.sky]];
    let s = svgOpen(560, 300, 'The seven lifestyle factors in every Unit 2 scenario');
    s += `<circle cx="280" cy="150" r="58" fill="${C.teal}" opacity=".15" stroke="${C.teal}"/><text x="280" y="146" font-size="13" font-weight="700" text-anchor="middle">Client’s health</text><text x="280" y="164" font-size="12" text-anchor="middle">&amp; well-being</text>`;
    f.forEach(([n, col], i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / f.length, x = 280 + Math.cos(a) * 200, y = 150 + Math.sin(a) * 112;
      s += `<line x1="${280 + Math.cos(a) * 60}" y1="${150 + Math.sin(a) * 60}" x2="${x}" y2="${y}" stroke="${col}" stroke-width="2" opacity=".6"/>`;
      s += `<rect x="${x - 50}" y="${y - 16}" width="100" height="32" rx="16" fill="${col}"/><text x="${x}" y="${y + 5}" font-size="12" font-weight="700" text-anchor="middle" fill="#fff">${n}</text>`;
    });
    return s + '</svg>';
  }

  function smokingFlow() {
    const steps = [['Carbon monoxide inhaled', C.slate], ['Binds to haemoglobin (≈ 200× more readily than O₂)', C.red], ['Less oxygen carried to muscles', C.orange], ['Lower aerobic endurance, higher HR & BP', C.darkred]];
    let s = svgOpen(640, 110, 'How carbon monoxide reduces aerobic performance');
    steps.forEach(([t, col], i) => {
      const x = 8 + i * 158;
      s += `<rect x="${x}" y="20" width="146" height="70" rx="12" fill="${col}" opacity=".14" stroke="${col}"/>`;
      const words = t.split(' '); let line = '', ly = 44;
      words.forEach(w => { if ((line + w).length > 20) { s += `<text x="${x + 73}" y="${ly}" font-size="11" text-anchor="middle">${line}</text>`; ly += 15; line = ''; } line += w + ' '; });
      s += `<text x="${x + 73}" y="${ly}" font-size="11" text-anchor="middle">${line}</text>`;
      if (i < 3) s += `<path d="M${x + 148} 55 l8 0" stroke="${col}" stroke-width="3"/><path d="M${x + 156} 50 l6 5 l-6 5 z" fill="${col}"/>`;
    });
    return s + '</svg>';
  }

  function stagesOfChange() {
    const st = [['Pre-contemplation', 'not thinking about change'], ['Contemplation', 'thinking about it'], ['Preparation', 'planning, setting a date'], ['Action', 'making the change'], ['Maintenance', '6+ months, avoid relapse']];
    let s = svgOpen(560, 300, 'Stages of change model');
    st.forEach(([n, d], i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / st.length, x = 280 + Math.cos(a) * 170, y = 150 + Math.sin(a) * 105;
      const col = [C.slate, C.amber, C.sky, C.green, C.violet][i];
      s += `<rect x="${x - 78}" y="${y - 26}" width="156" height="52" rx="12" fill="${col}" opacity=".15" stroke="${col}"/><text x="${x}" y="${y - 4}" font-size="12" font-weight="700" text-anchor="middle">${i + 1}. ${n}</text><text x="${x}" y="${y + 13}" font-size="10.5" text-anchor="middle" opacity=".8">${d}</text>`;
    });
    s += `<text x="280" y="146" font-size="12" text-anchor="middle" font-weight="700">Relapse can happen</text><text x="280" y="162" font-size="11" text-anchor="middle" opacity=".8">at any stage — plan for it</text>`;
    return s + '</svg>';
  }

  function screeningFlow() {
    const st = ['PAR-Q', 'Informed consent', 'Lifestyle questionnaire', 'Health monitoring tests', 'Interpret vs norms', 'Refer to GP or start programme'];
    let s = svgOpen(660, 96, 'Screening process');
    st.forEach((t, i) => {
      const x = 4 + i * 109;
      s += `<rect x="${x}" y="18" width="100" height="60" rx="10" fill="${C.teal}" opacity="${0.12 + i * 0.05}" stroke="${C.teal}"/>`;
      const words = t.split(' '); let line = '', ly = 44;
      words.forEach(w => { if ((line + w).length > 13) { s += `<text x="${x + 50}" y="${ly}" font-size="11" text-anchor="middle">${line}</text>`; ly += 14; line = ''; } line += w + ' '; });
      s += `<text x="${x + 50}" y="${ly}" font-size="11" text-anchor="middle">${line}</text>`;
      if (i < st.length - 1) s += `<path d="M${x + 101} 48 l7 0" stroke="${C.teal}" stroke-width="2.5"/>`;
    });
    return s + '</svg>';
  }

  function energySeesaw() {
    let s = svgOpen(560, 200, 'Energy balance');
    s += `<path d="M280 150 l-24 36 h48 z" fill="${C.slate}"/><g transform="rotate(-8 280 150)"><rect x="70" y="142" width="420" height="10" rx="5" fill="${C.slate}"/>`;
    s += `<rect x="80" y="82" width="160" height="58" rx="10" fill="${C.amber}" opacity=".2" stroke="${C.amber}"/><text x="160" y="106" font-size="13" text-anchor="middle" font-weight="700">Energy IN</text><text x="160" y="124" font-size="11" text-anchor="middle">food and drink (kcal)</text>`;
    s += `<rect x="320" y="82" width="160" height="58" rx="10" fill="${C.blue}" opacity=".2" stroke="${C.blue}"/><text x="400" y="106" font-size="13" text-anchor="middle" font-weight="700">Energy OUT</text><text x="400" y="124" font-size="11" text-anchor="middle">BMR + activity</text></g>`;
    s += `<text x="280" y="22" font-size="12" text-anchor="middle" font-weight="700">IN &gt; OUT → weight gain · IN = OUT → maintain · IN &lt; OUT → weight loss</text>`;
    s += `<text x="280" y="42" font-size="11" text-anchor="middle" opacity=".75">1 kg body fat ≈ 7,700 kcal → a 550 kcal/day deficit ≈ 0.5 kg a week</text>`;
    return s + '</svg>';
  }

  function platePie() {
    const parts = [['Fruit & vegetables', 39, C.green], ['Starchy carbohydrates', 37, C.amber], ['Protein foods', 12, C.red], ['Dairy & alternatives', 8, C.sky], ['Oils & spreads', 1, C.violet], ['', 3, C.slate]];
    let s = svgOpen(560, 240, 'Proportions of a balanced diet (Eatwell guide)');
    let a0 = -Math.PI / 2; const cx = 130, cy = 120, r = 100;
    parts.forEach(([n, p, col]) => {
      const a1 = a0 + p / 100 * 2 * Math.PI;
      const large = p > 50 ? 1 : 0;
      s += `<path d="M${cx} ${cy} L${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A${r} ${r} 0 ${large} 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} Z" fill="${col}" opacity="${n ? 0.85 : 0.3}"/>`;
      a0 = a1;
    });
    parts.filter(p => p[0]).forEach(([n, p, col], i) => {
      s += `<rect x="270" y="${34 + i * 34}" width="18" height="18" rx="4" fill="${col}"/><text x="296" y="${48 + i * 34}" font-size="12"><tspan font-weight="700">${n}</tspan> — about ${p}%</text>`;
    });
    s += `<text x="270" y="214" font-size="11" opacity=".75">Plus 6–8 glasses of fluid a day.</text><text x="270" y="230" font-size="11" opacity=".75">Foods high in fat, salt and sugar sit outside the guide.</text>`;
    return s + '</svg>';
  }

  function urineChart() {
    const cols = ['#fdfbe6', '#fbf4b6', '#f8ea7c', '#f2d649', '#e5b725', '#c98f12', '#9a6a0c', '#6b4a09'];
    let s = svgOpen(560, 120, 'Urine colour hydration chart');
    cols.forEach((c, i) => { s += `<rect x="${20 + i * 65}" y="20" width="60" height="50" rx="8" fill="${c}" stroke="${C.slate}" stroke-opacity=".4"/><text x="${50 + i * 65}" y="50" font-size="12" text-anchor="middle" fill="#3b2b06" font-weight="700">${i + 1}</text>`; });
    s += `<text x="20" y="92" font-size="11" font-weight="700" fill="${C.green}">1–3: well hydrated</text><text x="230" y="92" font-size="11" font-weight="700" fill="${C.amber}">4–5: drink more</text><text x="540" y="92" font-size="11" font-weight="700" text-anchor="end" fill="${C.red}">6–8: dehydrated</text>`;
    return s + '</svg>';
  }

  function componentsMap() {
    const phys = [['Aerobic endurance', 'Continuous · Fartlek · Interval · Circuit'], ['Muscular endurance', 'Circuit · Free weights · Machines (low load)'], ['Muscular strength', 'Free weights · Machines (high load) · Pyramid sets'], ['Flexibility', 'Static (active/passive) · PNF'], ['Speed', 'Acceleration · Hollow · Intervals · Resistance drills'], ['Body composition', 'Aerobic methods + resistance'], ['Core stability', 'Pilates · Yoga · Plank, bridge, V-sit']];
    const skill = [['Power', 'Plyometrics (sport-specific)'], ['Agility', 'SAQ · sport-specific drills'], ['Balance', 'Static & dynamic · stable/unstable surfaces'], ['Coordination', 'Sport-specific activities'], ['Reaction time', 'Reaction drills to external stimulus']];
    const H = 40 + phys.length * 40;
    let s = svgOpen(680, H, 'Components of fitness and their training methods');
    s += `<text x="10" y="22" font-size="13" font-weight="800" fill="${C.blue}">Physical fitness</text><text x="350" y="22" font-size="13" font-weight="800" fill="${C.violet}">Skill-related fitness</text>`;
    phys.forEach(([n, m], i) => { const y = 34 + i * 40; s += `<rect x="6" y="${y}" width="326" height="34" rx="8" fill="${C.blue}" opacity=".1" stroke="${C.blue}" stroke-opacity=".5"/><text x="16" y="${y + 15}" font-size="12" font-weight="700">${n}</text><text x="16" y="${y + 29}" font-size="10.5" opacity=".8">${m}</text>`; });
    skill.forEach(([n, m], i) => { const y = 34 + i * 40; s += `<rect x="346" y="${y}" width="326" height="34" rx="8" fill="${C.violet}" opacity=".1" stroke="${C.violet}" stroke-opacity=".5"/><text x="356" y="${y + 15}" font-size="12" font-weight="700">${n}</text><text x="356" y="${y + 29}" font-size="10.5" opacity=".8">${m}</text>`; });
    return s + '</svg>';
  }

  function workRest() {
    const rows = [['Aerobic intervals', [[3, 'w'], [3, 'r'], [3, 'w'], [3, 'r'], [3, 'w'], [3, 'r']], '1:1 — e.g. 3 min @ 85% / 3 min easy'], ['Speed intervals', [[1, 'w'], [5, 'r'], [1, 'w'], [5, 'r'], [1, 'w'], [5, 'r']], '1:5 — maximal 10 s sprint, full recovery'], ['Hollow sprints', [[2, 'w'], [2, 'j'], [2, 'w'], [4, 'r'], [2, 'w'], [2, 'j'], [2, 'w']], 'sprint – jog – sprint, then rest']];
    let s = svgOpen(640, 170, 'Work-to-rest ratios in interval training');
    rows.forEach(([n, segs, note], i) => {
      const y = 22 + i * 50; let x = 150;
      s += `<text x="10" y="${y + 18}" font-size="12" font-weight="700">${n}</text>`;
      segs.forEach(([len, t]) => { const w = len * 16; s += `<rect x="${x}" y="${y + 4}" width="${w - 2}" height="22" rx="4" fill="${t === 'w' ? C.red : t === 'j' ? C.amber : C.slate}" opacity="${t === 'r' ? 0.35 : 0.9}"/>`; x += w; });
      s += `<text x="150" y="${y + 42}" font-size="10.5" opacity=".8">${note}</text>`;
    });
    s += `<text x="630" y="160" font-size="10" text-anchor="end"><tspan fill="${C.red}">■ work</tspan>  <tspan fill="${C.amber}">■ jog</tspan>  <tspan fill="${C.slate}">■ rest</tspan></text>`;
    return s + '</svg>';
  }

  function rmContinuum() {
    return scale('Resistance training: load decides the outcome', [['Muscular endurance', 40, 67, C.sky], ['Hypertrophy', 67, 85, C.amber], ['Strength', 85, 100, C.red]], 40, 100, '% of 1RM', null)
      .replace('</svg>', `<text x="20" y="112" font-size="11" opacity=".8">15–20+ reps, 30–60 s rest</text><text x="380" y="112" font-size="11" opacity=".8" text-anchor="middle">6–12 reps</text><text x="620" y="112" font-size="11" opacity=".8" text-anchor="end">1–6 reps, 2–5 min rest</text></svg>`);
  }

  function hrZones(age) {
    const mhr = 220 - age;
    const z = [['Recovery / health', 50, 60, C.sky], ['Fat burning / base', 60, 70, C.green], ['Aerobic', 70, 80, C.amber], ['Anaerobic threshold', 80, 90, C.orange], ['Maximal', 90, 100, C.red]];
    let s = svgOpen(640, 260, 'Heart rate training zones');
    s += `<text x="10" y="20" font-size="12" font-weight="700">Training zones for a ${age}-year-old (MHR = 220 − ${age} = ${mhr} bpm)</text>`;
    z.forEach(([n, a, b, col], i) => {
      const y = 36 + i * 42, w = 120 + i * 90;
      s += `<rect x="10" y="${y}" width="${w}" height="34" rx="8" fill="${col}" opacity=".85"/><text x="20" y="${y + 22}" font-size="12" font-weight="700" fill="#fff">${a}–${b}% · ${Math.round(mhr * a / 100)}–${Math.round(mhr * b / 100)} bpm</text>`;
      s += `<text x="${w + 20}" y="${y + 22}" font-size="12">${n}</text>`;
    });
    return s + '</svg>';
  }

  function borgScale() {
    const rows = [[6, 'No exertion'], [7, 'Extremely light'], [9, 'Very light'], [11, 'Light'], [13, 'Somewhat hard'], [15, 'Hard (heavy)'], [17, 'Very hard'], [19, 'Extremely hard'], [20, 'Maximal exertion']];
    let s = svgOpen(560, 210, 'Borg RPE 6–20 scale');
    rows.forEach(([n, t], i) => {
      const x = 10 + i * 61, h = 30 + i * 14, col = n <= 11 ? C.green : n <= 14 ? C.amber : n <= 17 ? C.orange : C.red;
      s += `<rect x="${x}" y="${170 - h}" width="54" height="${h}" rx="6" fill="${col}" opacity=".85"/><text x="${x + 27}" y="${190}" font-size="13" text-anchor="middle" font-weight="800">${n}</text>`;
      s += i === rows.length - 1 ? `<text x="${x + 54}" y="${162 - h}" font-size="9.5" text-anchor="end">${t}</text>` : `<text x="${x + 27}" y="${162 - h}" font-size="9.5" text-anchor="middle">${t}</text>`;
    });
    s += `<text x="550" y="206" font-size="10.5" text-anchor="end" opacity=".8">RPE × 10 ≈ heart rate · moderate = 12–14</text>`;
    return s + '</svg>';
  }

  function periodisation() {
    let s = svgOpen(660, 190, 'Periodisation: macrocycle, mesocycle and microcycle');
    s += `<rect x="10" y="20" width="640" height="34" rx="8" fill="${C.violet}" opacity=".18" stroke="${C.violet}"/><text x="330" y="42" font-size="13" text-anchor="middle" font-weight="700">MACROCYCLE — e.g. 6 months to a marathon, a season or a year</text>`;
    const meso = [['Preparation (general)', C.sky], ['Preparation (specific)', C.teal], ['Competition / taper', C.orange], ['Transition', C.slate]];
    meso.forEach(([n, col], i) => { s += `<rect x="${10 + i * 161}" y="66" width="156" height="34" rx="8" fill="${col}" opacity=".22" stroke="${col}"/><text x="${88 + i * 161}" y="88" font-size="11.5" text-anchor="middle" font-weight="700">${n}</text>`; });
    s += `<text x="10" y="122" font-size="12" font-weight="700">MESOCYCLE = the 6-week programme →</text>`;
    for (let i = 0; i < 6; i++) { s += `<rect x="${10 + i * 107}" y="132" width="101" height="40" rx="8" fill="${C.green}" opacity="${0.15 + i * 0.12}" stroke="${C.green}"/><text x="${60 + i * 107}" y="150" font-size="11" text-anchor="middle" font-weight="700">Week ${i + 1}</text><text x="${60 + i * 107}" y="165" font-size="10" text-anchor="middle">microcycle</text>`; }
    return s + '</svg>';
  }

  function overloadCurve() {
    let s = svgOpen(600, 220, 'Overload, adaptation and reversibility');
    s += `<line x1="50" y1="190" x2="580" y2="190" stroke="currentColor" opacity=".4"/><line x1="50" y1="20" x2="50" y2="190" stroke="currentColor" opacity=".4"/>`;
    s += `<text x="315" y="212" font-size="11" text-anchor="middle">Time (weeks)</text><text x="18" y="105" font-size="11" transform="rotate(-90 18 105)" text-anchor="middle">Fitness</text>`;
    s += `<path d="M50 170 Q 90 185 110 160 Q 140 150 170 150 Q 200 165 220 135 Q 250 120 280 120 Q 310 135 330 100 Q 360 85 390 85" fill="none" stroke="${C.green}" stroke-width="3"/>`;
    s += `<path d="M390 85 Q 450 95 480 130 Q 520 160 570 168" fill="none" stroke="${C.red}" stroke-width="3" stroke-dasharray="6 5"/>`;
    s += `<text x="62" y="34" font-size="11" fill="${C.green}" font-weight="700">— Training: overload → fatigue → recovery → adaptation</text><text x="62" y="52" font-size="11" fill="${C.red}" font-weight="700">- - Training stops: reversibility (fitness is lost)</text>`;
    return s + '</svg>';
  }

  function sessionBar() {
    const parts = [['Warm-up', '10–15 min: pulse raiser → mobility → dynamic stretches', 22, C.amber], ['Main session', 'the training method at the planned FITT', 56, C.red], ['Cool-down', '5–10 min: gradual decrease + static stretches', 22, C.sky]];
    let s = svgOpen(640, 110, 'Structure of a training session'); let x = 10;
    parts.forEach(([n, d, w, col]) => { const ww = w * 6.2; s += `<rect x="${x}" y="16" width="${ww - 4}" height="44" rx="10" fill="${col}" opacity=".85"/><text x="${x + ww / 2}" y="44" font-size="13" text-anchor="middle" font-weight="800" fill="#fff">${n}</text><text x="${x + 4}" y="80" font-size="10.5">${d.length > 46 ? d.slice(0, 46) + '…' : d}</text>`; x += ww; });
    return s + '</svg>';
  }

  function fittWheel() {
    const q = [['F', 'Frequency', 'how often', C.blue], ['I', 'Intensity', 'how hard', C.red], ['T', 'Time', 'how long', C.amber], ['T', 'Type', 'which method', C.green]];
    let s = svgOpen(420, 260, 'FITT principle');
    q.forEach(([l, n, d, col], i) => {
      const a0 = -Math.PI / 2 + i * Math.PI / 2, a1 = a0 + Math.PI / 2, cx = 210, cy = 130, r = 110;
      s += `<path d="M${cx} ${cy} L${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} Z" fill="${col}" opacity=".85" stroke="#fff" stroke-width="3"/>`;
      const am = (a0 + a1) / 2, tx = cx + 62 * Math.cos(am), ty = cy + 62 * Math.sin(am);
      s += `<text x="${tx}" y="${ty - 4}" font-size="22" font-weight="800" text-anchor="middle" fill="#fff">${l}</text><text x="${tx}" y="${ty + 14}" font-size="11" text-anchor="middle" fill="#fff" font-weight="700">${n}</text><text x="${tx}" y="${ty + 27}" font-size="9.5" text-anchor="middle" fill="#fff">${d}</text>`;
    });
    return s + '</svg>';
  }

  function plyoCycle() {
    const st = [['1. Eccentric (pre-stretch)', 'muscle lengthens on landing, storing elastic energy', C.sky], ['2. Amortisation', 'very short pause — must be as brief as possible', C.amber], ['3. Concentric', 'powerful contraction releases stored energy', C.red]];
    let s = svgOpen(640, 100, 'Stretch-shortening cycle in plyometrics');
    st.forEach(([n, d, col], i) => { const x = 8 + i * 212; s += `<rect x="${x}" y="12" width="200" height="74" rx="12" fill="${col}" opacity=".15" stroke="${col}"/><text x="${x + 100}" y="36" font-size="12" text-anchor="middle" font-weight="700">${n}</text>`; const w = d.split(' '); let l = '', ly = 54; w.forEach(t => { if ((l + t).length > 30) { s += `<text x="${x + 100}" y="${ly}" font-size="10.5" text-anchor="middle">${l}</text>`; ly += 14; l = ''; } l += t + ' '; }); s += `<text x="${x + 100}" y="${ly}" font-size="10.5" text-anchor="middle">${l}</text>`; });
    return s + '</svg>';
  }

  /* ── Set task overview (free) ─────────────────────────────────────── */
  function setTaskSection() {
    const cases = U2.CASES.filter(c => c.source === 'pearson');
    return `
<div class="guide-aim-intro" id="guide-set-task">
  <div class="guide-aim-hd">
    <div class="guide-aim-badge">★</div>
    <div>
      <div class="guide-aim-title">How the Unit 2 set task works</div>
      <div class="guide-aim-subtitle">Part A case study → 4 hours of research → Part B: 2 hours 30 minutes, six activities, 60 marks</div>
    </div>
  </div>
  <p>Unit 2 is not a question paper. Pearson releases a short <strong>Part A case study</strong> about one client. You get up to <strong>four hours to research</strong> and can take <strong>four sides of A4 bullet-point notes</strong> into Part B. In <strong>Part B</strong> you get the client’s full lifestyle questionnaire (food diary, alcohol, smoking, stress, sleep and four health test results) and complete six activities. The activities have been identical in every series since 2017.</p>
  ${table(['Activity', 'Command', 'Marks', 'Suggested time', 'What the top band needs (from the examiner reports)'], [
    ['1', 'Interpret lifestyle factors and screening information', '12', '30 min', 'All 7 lifestyle factors + all 4 tests, interpreted against norms and linked to the client'],
    ['2', 'Provide and justify lifestyle modification techniques', '12', '30 min', 'Spec technique for ≥ 3 negative factors, justified, with barriers to change and prioritised'],
    ['3', 'Provide and justify nutritional guidance', '8', '20 min', 'Calories (deficit/surplus), 3 macros with quantities + sources, micros, hydration (+ ergogenic aids if sport)'],
    ['4', 'Propose and justify training methods', '8', '20 min', 'Spec method for ≥ 4 relevant components, each justified — say which is most appropriate'],
    ['5', 'Design weeks 1, 3 and 6 of a six-week programme', '6', '20 min', '≥ 3 components, FITT in full with intensities (bpm/%MHR, %1RM, RPE), progression, rest days'],
    ['6', 'Justify the programme using the principles of training', '14', '30 min', 'FITT + ≥ 6 other principles justified, plus aims/objectives, SMARTER in full, periodisation, resources']
  ])}
  ${tip('Every activity is marked on <strong>traits</strong> (e.g. “proposal” and “justification”). Each trait is placed in a band, and the trait weightings decide the mark. In June 2024 the justification trait was worth 50–60% of Activities 2–5, so a long list without reasons cannot score well.')}
  <h4>Pearson scenarios so far</h4>
  ${table(['Series', 'Client', 'Focus'], cases.map(c => [c.series, `${c.name} (${c.age})`, c.focus === 'sport' ? 'Sport — ' + c.sport : 'Health / lifestyle' + (c.noHighIntensity ? ' — no high-intensity exercise' : '')]))}
  <p>Every scenario lets you comment on all seven lifestyle factors and all four tests. Expect a mix of health clients (overweight, sedentary, high BP) and athletes (sprinters, endurance runners, swimmers, tennis, football). For athletes, add the spec <strong>ergogenic aids</strong> (energy gels and bars, protein drinks, carbohydrate loading) and sports drinks in Activity 3 and <strong>skill-related</strong> components in Activities 4–5.</p>
  <h4>What to put in your four sides of notes</h4>
  ${ul(['Normative tables (BP, RHR, BMI, WHR) and the guidelines (activity, alcohol, sleep, calories, water)', 'Health risks of each lifestyle factor, the spec modification techniques for smoking, alcohol, stress and activity, and barriers to change (time, cost, transport, location)', 'Macronutrient quantities (g/kg), sources, vitamins A, B, C, D, calcium and iron, hydration rules, energy gels/bars, protein drinks, carbohydrate loading and sports drinks', 'Spec training methods for every component, with FITT prescriptions and intensities', 'The training principles, SMARTER, periodisation terms and resources', 'A draft six-week programme for the client, with heart-rate zones already calculated'])}
  ${warn('Notes must be bullet points — no pre-written extended answers. Calculate the client’s MHR and training zones in Part A so Activity 5 is quick.')}
</div>`;
  }

  /* ── Aim A — Examine lifestyle factors and their effect on health and well-being ── */
  const aimA = () => aimSection('A', [
    topic('A1', 'Positive lifestyle factors and their effects on health and well-being', `
<h4>Exercise / physical activity</h4>
${table(['Type of benefit', 'Specification content'], [
  ['Physical', 'Strengthens bones, improves posture, improves body shape'],
  ['Reduces risk of chronic diseases', 'Coronary heart disease (CHD), cancer, type 2 diabetes'],
  ['Psychological', 'Relieves stress, reduces depression, improves mood (endorphins)'],
  ['Social', 'Improves social skills, enhances self-esteem'],
  ['Economic', 'Reduces costs to the National Health Service, reduces absenteeism from work']
])}
<h4>Balanced diet</h4>
${fig(platePie(), 'The eatwell plate/guide — the proportions of each food group in a balanced diet.')}
${ul(['<strong>Benefits of a healthy diet:</strong> improved immune function, maintenance of body weight, reduced risk of chronic diseases — diabetes, osteoporosis, hypertension, high cholesterol', '<strong>Fluid intake requirements:</strong> 6–8 glasses (1.5–2 L) a day, more when training; moderate caffeine intake', '<strong>Strategies for improving dietary intake:</strong> timing of meals (regular meals, breakfast), eating less/more of certain food groups, five a day, reducing salt intake, healthy alternatives (grilled not fried, water not fizzy drinks)'])}
<h4>Positive risk-taking activities</h4>
<p>Participation in <strong>outdoor and adventurous activities</strong> (climbing, kayaking, mountain biking) causes <strong>endorphin release</strong> and <strong>improved confidence</strong>.</p>
<h4>Government recommendations / guidelines</h4>
${fig(guidelineCards(), 'UK Chief Medical Officers’ physical activity guidelines.')}
${table(['Area', 'UK Government recommendation'], [['Physical activity', 'Adults 150 min moderate (or 75 min vigorous) a week + strength on 2 days; 5–18 years 60 min a day; 65+ add balance and flexibility'], ['Alcohol', 'No more than 14 units a week for men and women, spread over 3+ days'], ['Healthy eating', 'Eatwell guide proportions, at least five portions of fruit and vegetables a day, salt below 6 g a day, 6–8 glasses of fluid'], ['Sleep (supporting)', 'Adults 7–9 hours; teenagers 8–10 hours']])}
${tip('In Activity 1, compare the client with these guidelines: “Sadie does no exercise — far below the 150 minutes a week recommended — which links to her blood pressure of 150/98.”')}
`, true),
    topic('A2', 'Negative lifestyle factors and their effects on health and well-being', `
${fig(lifestyleWeb(), 'The lifestyle factors examiners expect you to interpret in Activity 1.')}
${table(['Factor', 'Health risks named in the specification', 'How it works'], [
  ['<strong>Smoking</strong>', 'CHD, cancer, lung disease, bronchitis, infertility', 'Nicotine raises HR and BP; carbon monoxide reduces oxygen carried by haemoglobin; tar damages the lungs'],
  ['<strong>Alcohol</strong>', 'Stroke, cirrhosis, hypertension, depression', 'Above 14 units a week; 7 kcal/g empty calories; dehydration and poor recovery'],
  ['<strong>Stress</strong>', 'Hypertension, angina, stroke, heart attack, stomach ulcers, depression', 'Adrenaline and cortisol raise HR and BP; leads to comfort eating, smoking, drinking'],
  ['<strong>Sleep</strong> (lack of)', 'Depression, overeating', 'Less than 7 hours (adults) — fatigue, poor recovery, appetite hormones disrupted'],
  ['<strong>Sedentary lifestyle</strong>', 'Health risks of inactivity: obesity, CHD, type 2 diabetes, hypertension, osteoporosis, poor posture/back pain', 'Long periods sitting at work, driving, screen time']
])}
${fig(smokingFlow(), 'How smoking reduces aerobic performance.')}
<p><strong>Diet:</strong> although not listed under A2, every set task includes a food diary — interpret it using A1 (balanced diet): high saturated fat → high cholesterol/CHD; high sugar → weight gain/diabetes; high salt → hypertension; low fruit, vegetables and water.</p>
${tip('Quote the questionnaire: “28 units a week — double the 14-unit guideline — increases Sadie’s risk of stroke, cirrhosis and hypertension.”')}
`),
    topic('A3', 'Lifestyle modification techniques', `
${key('Common barriers to change', '<strong>Time, cost, transport, location.</strong> Top-band Activity 2 answers explain how each technique overcomes the barriers this client faces.')}
${table(['Lifestyle factor', 'Specification techniques'], [
  ['Physical activity levels', ul(['At home — home workouts, exercise apps/videos, active chores', 'At work — stairs, walking meetings, breaking up sitting, lunchtime walks', 'During leisure time — clubs, classes, walking groups, parkrun', 'Method of transport — walk or cycle, get off the bus early, park further away'])],
  ['Smoking cessation', ul(['Acupuncture', 'NHS smoking helpline', 'NHS smoking services', 'Nicotine replacement therapy (patches, gum, lozenges, inhalator, spray)', 'Quit Kit support packs'])],
  ['Reducing alcohol consumption', ul(['Counselling', 'Self-help groups (e.g. Alcoholics Anonymous)', 'Alternative treatments (e.g. acupuncture, hypnotherapy)'])],
  ['Stress management', ul(['Assertiveness training', 'Goal setting', 'Time management', 'Physical activity', 'Positive self-talk', 'Relaxation', 'Breathing techniques', 'Meditation', 'Alternative therapies', 'Changes to work-life balance'])]
])}
${table(['Barrier', 'How to overcome it'], [['Time', 'Short sessions, active travel, exercising at home or at work'], ['Cost', 'Free options — walking, parkrun, NHS smoking services and helpline'], ['Transport', 'Walk/cycle, home workouts, facilities on a bus route'], ['Location', 'Choose activities close to home or work; outdoor options']])}
${tip('Prioritise. Say which change matters most and why, e.g. “Stopping smoking is the priority for Trevor because, with grade 2 hypertension and a WHR of 1.16, it is the biggest single risk to his heart.”')}
${warn('Only give techniques for factors the client actually has. Trevor drinks 3 units a week, so alcohol advice earns nothing for him.')}
`)
  ]);

  /* ── Aim B — Understand the screening processes for training programming ── */
  const aimB = () => aimSection('B', [
    topic('B1', 'Screening processes', `
${fig(screeningFlow(), 'The screening process before any training programme.')}
<h4>Screening questionnaires</h4>
${key('PAR-Q (physical activity readiness questionnaire)', 'Yes/no questions about heart conditions, chest pain, dizziness, joint or bone problems and medication. <strong>Any “yes” → refer the individual to a doctor</strong> before testing or training.')}
${table(['Lifestyle questionnaire section (Part B format)', 'What it tells you'], [['Personal details / occupation', 'Hours worked, distance and travel to work, how active the job is'], ['Current activity levels', 'Frequency and type of exercise'], ['Nutritional status', 'Two-day food diary, fluids, supplements'], ['Your lifestyle', 'Alcohol units, cigarettes a day, stress and its cause, hours of sleep'], ['Health monitoring tests', 'BP, RHR, BMI, waist to hip ratio'], ['Goals', 'What the programme must achieve'], ['Client declaration', 'Client confirms the answers are honest']])}
<h4>Legal considerations</h4>
${ul(['<strong>Informed consent form</strong> — the client signs to show they understand the purpose, procedures and risks and can withdraw at any time', '<strong>Data protection</strong> — personal and health data stored securely and used lawfully (Data Protection Act / GDPR)', '<strong>Client confidentiality</strong> — information is only shared with the client’s consent or with those who need it (e.g. their doctor)'])}
`, true),
    topic('B2', 'Health monitoring tests', `
<h4>Blood pressure (mmHg)</h4>
<p><strong>Systolic</strong> = pressure when the ventricles contract; <strong>diastolic</strong> = when they relax. Measure seated after 5 minutes’ rest, no caffeine, smoking or exercise beforehand, cuff at heart level.</p>
${fig(bpChart(), 'Blood pressure classification. When systolic and diastolic fall in different bands, use the higher one (Ben’s 130/95 is grade 1 hypertension).')}
${table(['Category', 'Systolic', 'Diastolic', 'Meaning'], U2.NORMS.bp.map(b => [b.label, b.sys[0] + (b.sys[1] > 300 ? '+' : '–' + b.sys[1]), b.dia[0] + (b.dia[1] > 200 ? '+' : '–' + b.dia[1]), b.risk]))}
<h4>Resting heart rate (bpm)</h4>
<p>Radial or carotid pulse for 60 seconds after rest (or on waking), or a heart-rate monitor. Training causes cardiac hypertrophy and a bigger stroke volume, so RHR falls.</p>
${fig(scale('Resting heart rate (adult, approximate)', [['Athletic', 40, 60, C.green], ['Good', 60, 70, C.lime], ['Average', 70, 80, C.amber], ['Below av.', 80, 90, C.orange], ['Poor', 90, 100, C.red], ['Tachy.', 100, 110, C.darkred]], 40, 110, 'bpm', [82, 'Sadie 82']), 'RHR above 100 bpm (tachycardia) → refer to a doctor.')}
<h4>Body mass index (kg/m²)</h4>
${key('Formula', 'BMI = body mass (kg) ÷ height (m)². Example: 104 kg ÷ (1.70 × 1.70) = 104 ÷ 2.89 = <strong>36.0</strong> → obese.')}
${fig(scale('BMI classification', [['Under', 15, 18.5, C.sky], ['Healthy', 18.5, 25, C.green], ['Overweight', 25, 30, C.amber], ['Obese I', 30, 35, C.orange], ['Obese II', 35, 40, C.red], ['Severe', 40, 45, C.darkred]], 15, 45, 'kg/m²', [41, 'Sadie 41']), 'BMI bands for adults.')}
${warn('BMI does not distinguish muscle from fat — a muscular rugby player can be classed as obese. Underweight athletes (Adam 18, Nadia 17, Anton 17) need more energy.')}
<h4>Waist to hip ratio</h4>
<p>Waist (narrowest point) ÷ hips (widest point). A high ratio means central fat (“apple shape”), linked to CHD, hypertension and type 2 diabetes.</p>
${table(['Risk', 'Men', 'Women'], [['Low', '≤ 0.95', '≤ 0.80'], ['Moderate', '0.96–1.0', '0.81–0.85'], ['High', '> 1.0', '> 0.85']])}
`),
    topic('B3', 'Interpreting the results of health monitoring tests', `
<p>The specification requires you to interpret results against normative data and make judgements, comparing with:</p>
${ul(['<strong>Population norms</strong> — e.g. BMI 18.5–24.9 healthy', '<strong>Norms for sports performers</strong> — trained people usually have lower RHR and BP', '<strong>Norms for elite athletes</strong> — e.g. RHR 40–50 bpm in elite endurance runners (Adam, 45 bpm)', '<strong>Accepted health ranges</strong> — e.g. BP below 140/90; WHR below 0.85 (women) / 0.95 (men)'])}
${table(['Client', 'BP', 'RHR', 'BMI', 'WHR'], U2.CASES.filter(c => c.source === 'pearson').map(c => [c.name + ' (' + c.sex + ', ' + c.age + ')', `${c.tests.bp.join('/')} — ${U2.bpCategory(...c.tests.bp).label}`, `${c.tests.rhr} — ${U2.rhrCategory(c.tests.rhr).label}`, `${c.tests.bmi} — ${U2.bmiCategory(c.tests.bmi).label}`, `${c.tests.whr} — ${U2.whrCategory(c.tests.whr, c.sex).label}`]))}
${tip('For each test give: result → category against norms → what it means for health → why (link to lifestyle) → whether to refer to a doctor → how the programme will improve it.')}
`)
  ]);

  /* ── Aim C — Understand programme-related nutritional needs ── */
  const aimC = () => aimSection('C', [
    topic('C1', 'Common terminology', `
${table(['Term', 'Meaning'], [['Recommended daily allowance (RDA)', 'The amount of energy or a nutrient needed each day to meet the needs of most healthy people (e.g. 2,000 kcal women, 2,500 kcal men)'], ['Calorie / kilocalorie (kcal)', 'Energy measure: 1 kcal = 1,000 calories'], ['Joule / kilojoule (kJ)', 'SI energy measure: 1 kcal ≈ 4.2 kJ'], ['Energy balance', 'Energy in (food) compared with energy out (basal metabolism + activity)']])}
${fig(energySeesaw(), 'Energy balance.')}
${key('Factors affecting energy balance', '<strong>Basal metabolism, age, gender, climate, physical activity</strong> — and the calories used in different activities depend on <strong>intensity and length of time</strong>.')}
${table(['Activity (70 kg person, 30 min)', 'Approx. kcal used'], [['Walking (moderate)', '~140'], ['Cycling (moderate)', '~250'], ['Swimming', '~250–300'], ['Running (10 km/h)', '~350']])}
`, true),
    topic('C2', 'Components of a balanced diet', `
${table(['Macronutrient', 'Function', 'Sources', 'Quantities'], [
  ['<strong>Carbohydrates</strong>', 'Main energy source; stored as glycogen', 'Pasta, rice, oats, potatoes, wholegrain bread, fruit', '~50% of energy; athletes 5–7 g/kg/day; endurance 7–10 g/kg/day'],
  ['<strong>Protein</strong>', 'Growth and repair of muscle and tissue', 'Meat, fish, eggs, dairy, beans, lentils, nuts', '0.75 g/kg/day; endurance 1.2–1.4; strength/power 1.6–2.0 g/kg/day'],
  ['<strong>Fats</strong>', 'Energy for low-intensity exercise, insulation, protection of organs, fat-soluble vitamins', 'Unsaturated: olive oil, nuts, oily fish. Saturated: butter, cheese, fatty meat', '≤ 35% of energy; saturated ≤ 11%']
])}
${table(['Micronutrient', 'Function', 'Sources', 'Quantities (adults)'], [
  ['Vitamin A', 'Vision, immune system, skin', 'Liver, carrots, dairy, sweet potato', '~600–700 µg/day'],
  ['Vitamin B group', 'Releasing energy from food', 'Wholegrains, meat, eggs, dairy', 'Varies by B vitamin'],
  ['Vitamin C', 'Immune system, tissue repair, iron absorption', 'Citrus fruit, peppers, berries, broccoli', '~40 mg/day'],
  ['Vitamin D', 'Calcium absorption → strong bones', 'Sunlight, oily fish, eggs, fortified foods', '10 µg/day'],
  ['Calcium', 'Bones and teeth, muscle contraction', 'Milk, cheese, yoghurt, leafy greens', '700 mg/day'],
  ['Iron', 'Haemoglobin → oxygen transport', 'Red meat, beans, spinach, fortified cereals', 'Men 8.7 mg, women 14.8 mg/day']
])}
<h4>Hydration</h4>
${key('Different requirements of fluid intake', 'Depend on <strong>climate</strong> (hot/humid), <strong>level of exercise</strong>, <strong>programme type</strong> and <strong>time of year</strong>. Baseline 6–8 glasses (1.5–2 L) a day; before exercise 400–600 ml; during 150–250 ml every 15–20 min; after 1.5 L per kg lost.')}
${fig(urineChart(), 'Urine colour is a quick hydration check.')}
${table(['', 'Dehydration', 'Hyperhydration'], [['What it is', 'Losing more fluid than is taken in', 'Taking in too much fluid, diluting blood sodium'], ['Signs and symptoms', 'Thirst, dark urine, headache, dizziness, fatigue, cramps', 'Headache, nausea, confusion, swelling of hands/feet; in severe cases seizures'], ['Effect on performance', '2% loss of body mass reduces endurance, concentration and temperature control', 'Reduced performance; can be life-threatening in long events']])}
`),
    topic('C3', 'Nutritional strategies for individuals taking part in training programmes', `
<h4>Adapting diet to gain or lose weight</h4>
${ul(['<strong>Lose weight:</strong> calorie deficit of ~500–600 kcal a day (≈ 0.5 kg a week); fewer high-fat/high-sugar foods; more fruit, vegetables, fibre and lean protein', '<strong>Gain weight/muscle:</strong> calorie surplus of ~300–500 kcal a day; more complex carbohydrate and protein (1.6–2.0 g/kg) with resistance training'])}
<h4>Ergogenic aids (specification)</h4>
${table(['Ergogenic aid', 'Positive effects', 'Negative effects', 'Recommended timing'], [
  ['Energy gels and bars', 'Quick, easily digested carbohydrate; maintains blood glucose; delays fatigue', 'Stomach upset/bloating; high sugar; cost', 'During sessions/events over 60–90 min (gels every 30–45 min with water); bars before or between sessions'],
  ['Protein drinks', 'Convenient protein for muscle repair and growth', 'Cost; unnecessary if diet is adequate; excess calories', 'Within about 30–60 minutes after training'],
  ['Carbohydrate loading', 'Maximises muscle glycogen stores for endurance events over 90 min', 'Weight gain/bloating (water stored with glycogen); not useful for short events', '36–48 hours (2–3 days) before the event, with a taper in training']
])}
<h4>Sports drinks</h4>
${table(['Drink', 'Concentration', 'Use / timing', 'Amount'], [['Hypotonic', '< 4% carbohydrate', 'Rapid rehydration — before or during short/hot sessions', '~400–600 ml before; small sips during'], ['Isotonic', '4–8% (same as body fluids)', 'During exercise lasting over 60 min — fluid + energy', '~150–250 ml every 15–20 min'], ['Hypertonic', '> 8%', 'After exercise to restore glycogen', '~500 ml after exercise']])}
${tip('Ergogenic aids are rewardable in Activity 3 when the scenario is sport-specific — give the positive and negative effects and the timing.')}
`)
  ]);

  /* ── Aim D — Examine training methods for different components of fitness ── */
  const aimD = () => aimSection('D', [
    topic('D1', 'Components of fitness to be trained', `
${table(['Component', 'Specification definition'], Object.entries(U2.COMPONENTS).filter(([n]) => n !== 'Core stability').map(([n, i]) => [`<strong>${n}</strong><br><small>${i.type === 'skill-related' ? 'skill-related (D1.1)' : 'physical (D1)'}</small>`, i.def]))}
${tip('Health clients usually need aerobic endurance, body composition, muscular endurance, strength and flexibility (plus core stability training). Athletes need the components of their sport, e.g. a goalkeeper needs reaction time, power and agility.')}
`, true),
    topic('D2', 'Training methods for physical fitness-related components', `
${fig(componentsMap(), 'Specification training methods for each component.')}
<h4>D2.1 Aerobic endurance</h4>
${key('Principles of aerobic training', 'Training thresholds and percentage of heart rate max: MHR = 220 − age; aerobic training zone about 60–85% MHR.')}
${table(['Method', 'Specification description'], [['Continuous training', 'Training at a steady pace at moderate intensity for a minimum of 30 minutes'], ['Fartlek training', 'Intensity varied by running at different speeds or over different terrains'], ['Interval training', 'A work period followed by a rest or recovery period'], ['Circuit training', 'Different stations/exercises used to develop aerobic endurance']])}
<p>Equipment: gym-based (treadmill, bike, rower, cross-trainer) or outdoor-based (track, park, hills).</p>
${fig(workRest(), 'Work-to-rest ratios.')}
<h4>D2.2 Muscular strength</h4>
${ul(['Principles: repetitions and sets, rest periods between sets, <strong>low repetitions and high loads</strong> (e.g. 85%+ 1RM, 1–6 reps, 2–5 min rest), order of exercises to prevent or maximise muscle fatigue', 'Method: <strong>pyramid sets</strong> — load rises and reps fall each set (e.g. 10 @ 70% → 8 → 6 → 4 @ 90% 1RM)', 'Equipment: free weights, fixed resistance machines'])}
${fig(rmContinuum(), 'Resistance training prescriptions.')}
<h4>D2.3 Muscular endurance</h4>
${ul(['Principles: <strong>high repetitions and low loads</strong> (e.g. 50–60% 1RM, 15–20 reps), short rests, order of exercises to prevent muscle fatigue', 'Methods: circuit training, fixed resistance machines, free weights', 'Equipment: free weights, fixed resistance machines, resistance bands/tubing'])}
<h4>D2.4 Core stability</h4>
${ul(['Methods: <strong>Pilates, yoga, gym-based exercises (plank, bridge, V-sit)</strong>', 'Equipment: free weights, fixed resistance machines, circuit training, kettle bells, resistance bands/tubing, stability balls'])}
<h4>D2.5 Flexibility</h4>
${table(['', 'Specification content'], [['Principles', 'Maintenance (keep current range), developmental (increase range), pre-activity (prepare before exercise)'], ['Static', 'Active (own muscles hold the stretch) and passive (a partner or equipment applies the stretch)'], ['Dynamic — PNF', 'Proprioceptive neuromuscular facilitation: stretch → isometric contraction against a partner 6–10 s → relax → stretch further'], ['Equipment', 'Towel, belt, band, mat, partner']])}
<h4>D2.6 Speed</h4>
${ul(['Principles: training thresholds, percentage of heart rate max, recovery period between sets', '<strong>Hollow sprints</strong> — sprint, jog/walk (“hollow”), sprint', '<strong>Acceleration sprints</strong> — build up from rolling start to maximum', '<strong>Interval training</strong> — short maximal efforts with full recovery', '<strong>Resistance drills</strong> — hill runs, parachutes, sleds, bungee ropes', 'Equipment: resistance bands/tubes, parachutes, bungee rope, resistance tyres'])}
${warn('“Weight training” is <strong>not</strong> accepted in Activity 4 — name free weights, fixed resistance machines or circuit training. “Stretching” alone is not enough — say static (active/passive) or PNF.')}
`),
    topic('D3', 'Training methods for skill-related fitness components', `
${table(['Code', 'Component', 'Specification method', 'Equipment / example'], [
  ['D3.1', 'Agility', 'SAQ (speed, agility, quickness); sport-specific drills — changing body position quickly and with control', 'Ladders, cones, hurdles'],
  ['D3.2', 'Balance', 'Static balance (centre of mass over base of support when stationary) and dynamic balance (when moving), using stable and unstable surfaces', 'Wobble board, stability ball, beam'],
  ['D3.3', 'Coordination', 'Exercises using two or more body parts together — sport-specific activities', 'Ball-handling drills, ladder footwork'],
  ['D3.4', 'Reaction time', 'Reaction drills in response to an external stimulus', 'Stopwatch, whistle, visual/auditory stimulus, reaction ball'],
  ['D3.5', 'Power', 'Plyometrics specific to the sport (bounding, hopping, box and hurdle jumps)', 'Ladders, cones, jump ropes, medicine ball, hurdles, benches']
])}
${fig(plyoCycle(), 'Why plyometrics develop power.')}
${tip('Activity 4 top band: a specification method for <strong>at least four different components</strong>, each justified for this client, then state which is <strong>most appropriate</strong>. For low-intensity or older clients choose low-impact methods (continuous walking/cycling/swimming, machines, static stretching) and avoid plyometrics and sprints.')}
`)
  ]);

  /* ── Aim E — Understand training programme design ── */
  const aimE = () => aimSection('E', [
    topic('E1', 'Principles of fitness training programme design', `
<h4>Fitness training programme design</h4>
${table(['Element', 'Specification meaning', 'Example (Sadie)'], [['Aims', 'Details of what they would like to achieve', 'Lose a significant amount of weight and improve her health'], ['Objectives', 'How they intend to meet their aims', 'Walk or cycle at low intensity 5 times a week; reduce intake by 500 kcal a day'], ['Personal goals', 'SMARTER — specific, measurable, achievable, realistic, time-related, exciting, recorded', 'Lose 4 kg in six weeks, weighed weekly and recorded in a diary'], ['Resources required', 'Facilities and equipment', 'Leisure centre pool, exercise bike, resistance machines, HR monitor']])}
${warn('Examiners report learners leaving out SMARTER letters. Write all seven, in order.')}
<h4>Principles of training — FITT</h4>
${fig(fittWheel(), 'FITT — frequency, intensity, time and type of exercise used in the sessions.')}
${key('Stating intensity', 'MHR = 220 − age. Aerobic zone ~60–85% MHR (Karvonen: ((MHR − RHR) × %) + RHR). Resistance work as %1RM. RPE (Borg 6–20) is also accepted.')}
${fig(hrZones(40), 'Heart-rate training zones for a 40-year-old.')}
${fig(borgScale(), 'Borg rating of perceived exertion (RPE).')}
<h4>Additional principles of training</h4>
${table(['Principle', 'Meaning — and how to justify it'], ['Specificity', 'Overload', 'Progression', 'Reversibility', 'Rest and recovery', 'Adaptation', 'Variation', 'Individual needs'].map(k => [k, U2.PRINCIPLES[k]]))}
${fig(overloadCurve(), 'Overload, recovery, adaptation and reversibility.')}
<h4>Periodisation</h4>
${fig(periodisation(), 'Macrocycle (long-term), mesocycle (the six-week block) and microcycle (one week).')}
<h4>Worked example — week 1 for Sadie</h4>
${(() => { const c = U2.CASES.find(x => x.id === 'PP-2406'); const p = U2.programme(c)[0]; return table(['Day', 'Session (FITT)'], Object.entries(p)); })()}
${tip('Activity 6 top band: justify FITT plus <strong>at least six</strong> additional principles for this client (70%), then aims and objectives, SMARTER in full, periodisation and resources (30%). Describing what happens each day is not justification.')}
`, true)
  ]);

  /* ── Gallery ──────────────────────────────────────────────────────── */
  const GUIDE_GALLERY = [
    { aim: 'A', kicker: 'Lifestyle', title: 'Habits that shape health', copy: 'Smoking, alcohol, stress, sleep, diet and activity.', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80' },
    { aim: 'C', kicker: 'Nutrition', title: 'Fuel with quantities', copy: 'Calories, macros, micros, hydration and ergogenic aids.', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80' },
    { aim: 'E', kicker: 'Programming', title: 'Six weeks, justified', copy: 'FITT, principles of training, zones and periodisation.', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80' }
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

  function buildGuideHTML() {
    return `
<div class="guide-shell">
  <div class="guide-sidebar" id="guide-sidebar-sport">${buildSidebar()}</div>
  <div class="guide-main">
    <div class="guide-topbar">
      <div class="guide-progress-track"><div class="guide-progress-fill" id="guide-pf-sport" style="width:0%"></div></div>
      <span class="guide-progress-text" id="guide-pt-sport">0 / 5 aims revised</span>
      <button class="guide-print-btn" onclick="window.print()">&#128438; Print guide</button>
    </div>
    ${buildGuideGallery()}
    ${setTaskSection()}
    ${aimA()}${aimB()}${aimC()}${aimD()}${aimE()}
  </div>
</div>`;
  }

  function updateProgress() {
    const revised = getRevised();
    const count = AIMS.filter(a => revised.includes(a)).length;
    const fill = document.getElementById('guide-pf-sport');
    const text = document.getElementById('guide-pt-sport');
    if (fill) fill.style.width = (count / AIMS.length * 100) + '%';
    if (text) text.textContent = count + ' / ' + AIMS.length + ' aims revised';
    AIMS.forEach(a => {
      const btn = document.getElementById('gmb-' + a);
      if (!btn) return;
      const done = revised.includes(a);
      btn.classList.toggle('revised', done);
      btn.innerHTML = done
        ? '<span class="guide-mark-icon">&#10003;</span> Aim ' + a + ' revised!'
        : '<span class="guide-mark-icon">&#9711;</span> Mark aim ' + a + ' as revised';
    });
  }

  function setupScrollSpy() {
    const sections = document.querySelectorAll('.guide-aim-section[id], .guide-aim-intro[id]');
    if (!sections.length || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        document.querySelectorAll('.guide-toc-aim-link').forEach(l => {
          l.classList.toggle('active', (l.getAttribute('onclick') || '').includes("'" + id + "'"));
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(s => observer.observe(s));
  }

  window.toggleGT = window.toggleGT || function (id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('open');
  };
  window.toggleGuideRevised = function (aimLetter) {
    const arr = getRevised();
    const idx = arr.indexOf(aimLetter);
    if (idx === -1) arr.push(aimLetter); else arr.splice(idx, 1);
    saveRevised(arr);
    updateProgress();
  };
  window.guideScrollTo = window.guideScrollTo || function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.classList.contains('guide-topic') && !el.classList.contains('open')) el.classList.add('open');
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const sb = document.getElementById('guide-sidebar-sport');
    if (sb && window.innerWidth < 769) sb.classList.remove('sb-open');
  };

  window.initComprehensiveGuide = function () {
    const container = document.getElementById('guide-comprehensive');
    if (!container) return;
    if (container.dataset.built === '1') { updateProgress(); return; }
    container.innerHTML = buildGuideHTML();
    container.dataset.built = '1';
    updateProgress();
    setupScrollSpy();
  };
})();
