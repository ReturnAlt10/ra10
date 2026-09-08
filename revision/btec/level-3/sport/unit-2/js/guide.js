/* Sport Unit 2 — Comprehensive Revision Guide
   Initialised by calling window.initComprehensiveGuide()  */
(function () {
  'use strict';

  const STORE_KEY = 'ra10-guide-revised-SPORT-u2';
  const AIMS = ['A','B','C','D','E'];
  const AIM_TITLES = {
    A: 'Lifestyle Factors and Health',
    B: 'Screening Processes',
    C: 'Nutritional Needs',
    D: 'Training Methods and Fitness',
    E: 'Training Programme Design'
  };
  const AIM_SUBTITLES = {
    A: 'Positive and negative lifestyle factors, their effects and modification',
    B: 'Health monitoring, physiological tests, PAR-Q and informed consent',
    C: 'Nutrients, energy balance, hydration and ergogenic aids',
    D: 'Components of fitness and the training methods that develop them',
    E: 'Programme principles, periodisation, warm-up/cool-down and review'
  };

  function getRevised() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch { return []; }
  }
  function saveRevised(arr) { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); }

  function buildSidebar() {
    const items = [
      { aim:'A', topics:[['A1','Positive lifestyle factors'],['A2','Negative lifestyle factors'],['A3','Effects on health'],['A4','Modification techniques']] },
      { aim:'B', topics:[['B1','Health monitoring tests'],['B2','Physiological tests'],['B3','PAR-Q & consent'],['B4','Results & decisions']] },
      { aim:'C', topics:[['C1','Nutrients'],['C2','Energy balance'],['C3','Hydration'],['C4','Ergogenic aids']] },
      { aim:'D', topics:[['D1','Physical fitness components'],['D2','Skill-related components'],['D3','Training methods'],['D4','FITT principle']] },
      { aim:'E', topics:[['E1','Programme principles'],['E2','Periodisation'],['E3','Warm-up & cool-down'],['E4','Review & adaptation']] }
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
    {
      aim: 'A',
      kicker: 'Health',
      title: 'Lifestyle habits and their impact',
      copy: 'Positive and negative factors and how to change them.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80'
    },
    {
      aim: 'C',
      kicker: 'Fuel',
      title: 'Nutrition and energy balance',
      copy: 'Nutrients, hydration and supplements for health and performance.',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80'
    },
    {
      aim: 'E',
      kicker: 'Planning',
      title: 'Designing effective programmes',
      copy: 'Periodisation, FITT and reviewing a training plan.',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  function buildGuideGallery() {
    return `
<section class="guide-gallery" aria-label="Sport unit visual overview">
  ${GUIDE_GALLERY.map(card => `
  <button
    class="guide-gallery-card"
    type="button"
    onclick="guideScrollTo('guide-aim-${card.aim}')"
    style="--guide-card-image:url('${card.image}')"
  >
    <span class="guide-gallery-kicker">${card.kicker}</span>
    <span class="guide-gallery-title">${card.title}</span>
    <span class="guide-gallery-copy">${card.copy}</span>
    <span class="guide-gallery-source">Royalty-free stock photo</span>
  </button>`).join('')}
</section>`;
  }

  /* ============================================================  AIM A — Lifestyle Factors  ============================================================ */
  const aimA = aimSection('A', [
    topic('A1','Positive lifestyle factors', `
<p>A <strong>lifestyle factor</strong> is a habit or behaviour that influences health. Positive factors improve physical, mental and social well-being and reduce the risk of chronic disease.</p>
<ul>
  <li><strong>Physical activity</strong> — regular exercise strengthens the heart, lungs and muscles, helps manage weight and improves mood.</li>
  <li><strong>Healthy diet</strong> — a balanced intake of nutrients supports energy, growth, repair and immune function.</li>
  <li><strong>Good sleep</strong> — 7&ndash;9 hours allows the body to recover and consolidate learning.</li>
  <li><strong>Stress management</strong> — techniques such as exercise, mindfulness and time management reduce harmful stress.</li>
  <li><strong>Avoiding smoking and excessive alcohol</strong> — protects the cardiovascular and respiratory systems.</li>
</ul>
<p>These factors interact: a person who is active, eats well and sleeps well is far more likely to maintain good health and perform well in sport.</p>
`, true),
    topic('A2','Negative lifestyle factors', `
<p>Negative factors raise the risk of ill health and reduce quality of life and performance.</p>
<ul>
  <li><strong>Smoking</strong> — damages the lungs and blood vessels, reducing aerobic capacity and increasing the risk of cancer and heart disease.</li>
  <li><strong>Excessive alcohol</strong> — adds empty calories, impairs recovery and can damage the liver.</li>
  <li><strong>Sedentary lifestyle</strong> — long periods of inactivity raise the risk of obesity, type 2 diabetes and cardiovascular disease.</li>
  <li><strong>Poor diet</strong> — too much sugar, salt and saturated fat contributes to weight gain and chronic conditions.</li>
  <li><strong>Chronic stress</strong> — unmanaged stress harms mental health and weakens the immune system.</li>
</ul>
<p>In exam answers, link each factor to its specific effect, e.g. smoking &rarr; reduced lung function &rarr; lower aerobic performance.</p>
`),
    topic('A3','Effects on health and well-being', `
<p>Lifestyle factors affect three dimensions of health:</p>
<ul>
  <li><strong>Physical health</strong> — body composition, cardiovascular fitness, absence of disease.</li>
  <li><strong>Mental health</strong> — mood, stress levels, self-esteem.</li>
  <li><strong>Social well-being</strong> — relationships, participation in community and team activities.</li>
</ul>
<p><strong>Key conditions linked to a poor lifestyle:</strong> obesity, coronary heart disease, type 2 diabetes, high blood pressure and some cancers. A healthy lifestyle reduces the risk of all of these and supports longer, healthier living.</p>
`),
    topic('A4','Lifestyle modification techniques', `
<p>Changing behaviour is difficult, so structured approaches help:</p>
<ul>
  <li><strong>SMART goal setting</strong> — set Specific, Measurable, Achievable, Relevant and Time-bound targets.</li>
  <li><strong>Self-monitoring</strong> — track activity, diet or smoking habits (e.g. a step counter or food diary).</li>
  <li><strong>Support networks</strong> — family, friends or professionals provide encouragement and accountability.</li>
  <li><strong>Gradual change</strong> — make one small change at a time to build sustainable habits.</li>
  <li><strong>Education</strong> — understanding the benefits of change increases motivation.</li>
</ul>
<p>Example: to increase activity, a person might set a SMART goal to &ldquo;walk 10,000 steps a day for the next month&rdquo; and track progress with a phone.</p>
`)
  ]);

  /* ============================================================  AIM B — Screening  ============================================================ */
  const aimB = aimSection('B', [
    topic('B1','Health monitoring tests', `
<p>Before starting exercise, a client&rsquo;s baseline health is checked using simple measures:</p>
<ul>
  <li><strong>Resting heart rate</strong> — beats per minute at rest; a lower value indicates better cardiovascular fitness.</li>
  <li><strong>Blood pressure</strong> — the force of blood on artery walls (systolic/diastolic).</li>
  <li><strong>Body Mass Index (BMI)</strong> — weight (kg) &divide; height&sup2; (m), used to classify weight status.</li>
  <li><strong>Waist-to-hip ratio</strong> — a measure of body fat distribution linked to health risk.</li>
  <li><strong>Peak flow</strong> — how fast air can be exhaled, indicating respiratory function.</li>
</ul>
<p>These results form a baseline that can be compared over time to monitor improvement.</p>
`),
    topic('B2','Physiological and fitness tests', `
<p>Fitness tests measure specific components of fitness:</p>
<ul>
  <li><strong>Multi-stage fitness test (bleep test)</strong> — aerobic endurance.</li>
  <li><strong>30-second sit-up test</strong> — muscular endurance.</li>
  <li><strong>Hand grip dynamometer</strong> — muscular strength.</li>
  <li><strong>Vertical jump test</strong> — power.</li>
  <li><strong>Sit-and-reach test</strong> — flexibility.</li>
  <li><strong>30-metre sprint</strong> — speed.</li>
  <li><strong>Illinois agility test</strong> — agility.</li>
</ul>
<p>Tests must be valid (measure what they claim), reliable (consistent) and administered consistently to give useful data.</p>
`),
    topic('B3','PAR-Q and informed consent', `
<p>The <strong>PAR-Q (Physical Activity Readiness Questionnaire)</strong> is a short screening questionnaire that identifies whether a client should seek medical advice before exercising.</p>
<ul>
  <li>It asks about heart conditions, chest pain, dizziness, bone/joint problems and other risk factors.</li>
  <li>If any question is answered &ldquo;yes&rdquo;, the client may need medical clearance before training.</li>
</ul>
<p><strong>Informed consent</strong> is the client&rsquo;s agreement to take part in screening or exercise, given after they understand the purpose, procedures, risks and their right to withdraw.</p>
`),
    topic('B4','Screening results and decisions', `
<p>Interpret results to decide how to proceed:</p>
<ul>
  <li><strong>Normal results</strong> — the client can begin a suitable training programme.</li>
  <li><strong>Elevated risk (e.g. high blood pressure)</strong> — modify the programme or <strong>refer</strong> the client to a medical professional.</li>
  <li><strong>Contraindications</strong> — conditions that make certain exercise unsafe, requiring changes to the plan.</li>
</ul>
<p>All screening data is <strong>confidential</strong> and must be stored and shared only with consent. Screening protects both the client and the professional.</p>
`)
  ]);

  /* ============================================================  AIM C — Nutrition  ============================================================ */
  const aimC = aimSection('C', [
    topic('C1','Macronutrients and micronutrients', `
<p><strong>Macronutrients</strong> are needed in large amounts:</p>
<ul>
  <li><strong>Carbohydrate</strong> — the main energy source, stored as glycogen in muscles and liver.</li>
  <li><strong>Protein</strong> — supports growth and repair of muscle tissue.</li>
  <li><strong>Fat</strong> — an energy source and supplier of essential fatty acids.</li>
</ul>
<p><strong>Micronutrients</strong> are needed in small amounts:</p>
<ul>
  <li><strong>Vitamins</strong> — regulate processes such as energy release and immunity.</li>
  <li><strong>Minerals</strong> — e.g. calcium for bones, iron for oxygen transport.</li>
  <li><strong>Fibre</strong> — aids digestion and helps regulate blood glucose.</li>
  <li><strong>Water</strong> — essential for hydration and temperature regulation.</li>
</ul>
<p>A balanced diet provides all of these in the right proportions to support health and performance.</p>
`, true),
    topic('C2','Energy balance and expenditure', `
<p><strong>Energy balance</strong> is the relationship between energy intake (food) and energy expenditure.</p>
<ul>
  <li><strong>Balanced</strong> — intake equals expenditure, so weight is maintained.</li>
  <li><strong>Positive (surplus)</strong> — intake exceeds expenditure, causing weight gain.</li>
  <li><strong>Negative (deficit)</strong> — expenditure exceeds intake, causing weight loss.</li>
</ul>
<p>Energy expenditure is made up of <strong>basal metabolic rate (BMR)</strong>, the <strong>thermic effect of food</strong> and <strong>physical activity</strong>. Athletes with high training loads need more energy to fuel performance and recovery.</p>
`),
    topic('C3','Hydration and performance', `
<p>Water is essential for performance. Even small fluid losses impair performance.</p>
<ul>
  <li><strong>Dehydration</strong> reduces blood volume, raises heart rate and impairs temperature regulation and concentration.</li>
  <li>Fluids should be taken <strong>before, during and after</strong> exercise.</li>
  <li><strong>Electrolytes</strong> (sodium, potassium) are lost in sweat and may need replacing during prolonged exercise.</li>
</ul>
<p>Thirst is a late indicator of dehydration, so athletes should drink regularly rather than waiting until they feel thirsty.</p>
`),
    topic('C4','Ergogenic aids and supplements', `
<p><strong>Ergogenic aids</strong> are substances or techniques intended to enhance performance.</p>
<ul>
  <li><strong>Creatine</strong> — supports the ATP-PC system, improving short bursts of high-intensity power.</li>
  <li><strong>Caffeine</strong> — a stimulant that reduces perceived effort and improves endurance and alertness.</li>
  <li><strong>Protein shakes</strong> — a convenient source of protein to support muscle repair after training.</li>
</ul>
<p>Supplements should support &mdash; not replace &mdash; a balanced diet. Some substances are banned, so athletes must ensure any supplement is safe and permitted.</p>
`)
  ]);

  /* ============================================================  AIM D — Training Methods  ============================================================ */
  const aimD = aimSection('D', [
    topic('D1','Physical fitness components', `
<p><strong>Health-related</strong> components of fitness:</p>
<ul>
  <li><strong>Aerobic endurance</strong> — sustaining exercise using oxygen (e.g. long-distance running).</li>
  <li><strong>Muscular strength</strong> — maximum force in one effort (e.g. weightlifting).</li>
  <li><strong>Muscular endurance</strong> — repeating contractions without fatigue (e.g. cycling).</li>
  <li><strong>Flexibility</strong> — range of movement at a joint (e.g. gymnastics).</li>
  <li><strong>Body composition</strong> — the proportion of fat to lean tissue.</li>
</ul>
`),
    topic('D2','Skill-related fitness components', `
<p><strong>Skill-related</strong> components of fitness:</p>
<ul>
  <li><strong>Speed</strong> — moving quickly (e.g. sprinting).</li>
  <li><strong>Power</strong> — strength applied quickly (e.g. jumping, throwing).</li>
  <li><strong>Agility</strong> — changing direction quickly (e.g. rugby).</li>
  <li><strong>Balance</strong> — maintaining position (e.g. gymnastics).</li>
  <li><strong>Coordination</strong> — moving body parts smoothly together (e.g. tennis).</li>
  <li><strong>Reaction time</strong> — responding quickly to a stimulus (e.g. sprint start).</li>
</ul>
<p>Each component is more or less important depending on the sport and position.</p>
`),
    topic('D3','Training methods', `
<p>Different methods develop different components of fitness:</p>
<ul>
  <li><strong>Continuous training</strong> — steady aerobic exercise (e.g. jogging) for aerobic endurance.</li>
  <li><strong>Interval training</strong> — alternating hard work and recovery, developing aerobic and anaerobic fitness.</li>
  <li><strong>Fartlek training</strong> — continuous training with varied pace (speed play).</li>
  <li><strong>Circuit training</strong> — a series of exercise stations developing multiple components.</li>
  <li><strong>Weight/resistance training</strong> — develops muscular strength and endurance.</li>
  <li><strong>Plyometrics</strong> — explosive jumps and bounding for power.</li>
  <li><strong>Flexibility training</strong> — stretching to improve range of movement.</li>
</ul>
<p>The method must match the component being developed &mdash; this is the principle of <strong>specificity</strong>.</p>
`, true),
    topic('D4','Principles of training (FITT)', `
<p>The <strong>FITT principle</strong> is used to structure training:</p>
<ul>
  <li><strong>Frequency</strong> — how often (days per week).</li>
  <li><strong>Intensity</strong> — how hard (e.g. % of maximum heart rate).</li>
  <li><strong>Time</strong> — how long each session lasts.</li>
  <li><strong>Type</strong> — the method used.</li>
</ul>
<p>Other principles include <strong>progressive overload</strong> (gradually increasing demand), <strong>specificity</strong> (matching training to the goal) and <strong>reversibility</strong> (fitness is lost when training stops).</p>
`)
  ]);

  /* ============================================================  AIM E — Programme Design  ============================================================ */
  const aimE = aimSection('E', [
    topic('E1','Programme design principles', `
<p>A training programme should be based on the individual&rsquo;s needs and goals.</p>
<ul>
  <li><strong>SMART goals</strong> — Specific, Measurable, Achievable, Relevant, Time-bound.</li>
  <li><strong>Individual needs</strong> — age, fitness level, sport, time available.</li>
  <li><strong>Specificity</strong> — training matches the demands of the sport.</li>
  <li><strong>Progressive overload</strong> — gradually increase FITT variables to keep improving.</li>
  <li><strong>Recovery</strong> — rest allows adaptation and prevents overtraining.</li>
</ul>
<p>Example goal: &ldquo;Improve 5 km run time from 28 to 25 minutes within 8 weeks.&rdquo;</p>
`),
    topic('E2','Periodisation and cycles', `
<p><strong>Periodisation</strong> organises training into cycles to peak at the right time and avoid overtraining.</p>
<ul>
  <li><strong>Macrocycle</strong> — the longest cycle, typically a full season or year.</li>
  <li><strong>Mesocycle</strong> — a block of 4&ndash;12 weeks focused on a particular goal (e.g. endurance, strength).</li>
  <li><strong>Microcycle</strong> — usually one week of training.</li>
</ul>
<p><strong>Tapering</strong> reduces training volume before competition to allow recovery and peak performance. A <strong>plateau</strong> occurs when progress stalls and the programme needs adjusting.</p>
`),
    topic('E3','Warm-up and cool-down', `
<p>A <strong>warm-up</strong> prepares the body for exercise:</p>
<ul>
  <li>Raises heart rate, body temperature and blood flow to muscles.</li>
  <li>Uses <strong>dynamic stretching</strong> through a full range of movement.</li>
  <li>Reduces injury risk and improves performance.</li>
</ul>
<p>A <strong>cool-down</strong> returns the body gradually to rest:</p>
<ul>
  <li>Gradual low-intensity activity then <strong>static stretching</strong>.</li>
  <li>Aids recovery, removes waste products and reduces muscle soreness.</li>
</ul>
`, true),
    topic('E4','Reviewing and adapting programmes', `
<p>Programmes should be reviewed regularly using <strong>monitoring</strong> and <strong>feedback</strong>.</p>
<ul>
  <li>Compare results against the original SMART goals.</li>
  <li>Re-test fitness components to measure improvement.</li>
  <li><strong>Progress</strong> the programme (increase FITT) if goals are being met.</li>
  <li><strong>Regress</strong> it if the athlete is injured, fatigued or plateauing.</li>
</ul>
<p>The <strong>adaptation principle</strong> states the body adapts to training stress, so the programme must change to keep driving improvement. Regular review keeps training safe, effective and aligned with goals.</p>
`)
  ]);

  /* ---- Full guide HTML assembly ---- */
  function buildGuideHTML() {
    return `
<div class="guide-shell">
  <div class="guide-sidebar" id="guide-sidebar-sport">
    ${buildSidebar()}
  </div>
  <div class="guide-main">
    <div class="guide-topbar">
      <div class="guide-progress-track"><div class="guide-progress-fill" id="guide-pf-sport" style="width:0%"></div></div>
      <span class="guide-progress-text" id="guide-pt-sport">0 / 5 aims revised</span>
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
    const sb = document.getElementById('guide-sidebar-sport');
    if (sb && window.innerWidth < 769) sb.classList.remove('sb-open');
  };

  window.initComprehensiveGuide = function() {
    const container = document.getElementById('guide-comprehensive');
    if (!container) return;
    if (container.dataset.built === '1') {
      updateProgress();
      return;
    }
    container.innerHTML = buildGuideHTML();
    container.dataset.built = '1';
    updateProgress();
    setupScrollSpy();
  };

})();
