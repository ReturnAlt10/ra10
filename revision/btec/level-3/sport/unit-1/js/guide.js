/* Sport Unit 1 — Comprehensive Revision Guide
   Initialised by calling window.initComprehensiveGuide()  */
(function () {
  'use strict';

  const STORE_KEY = 'ra10-guide-revised-SPORT-u1';
  const AIMS = ['A','B','C','D','E','F'];
  const AIM_TITLES = {
    A: 'The Skeletal System',
    B: 'The Muscular System',
    C: 'The Respiratory System',
    D: 'The Cardiovascular System',
    E: 'Energy Systems',
    F: 'Interrelationships and Applied Physiology'
  };
  const AIM_SUBTITLES = {
    A: 'Bones, joints, cartilage, ligaments, movement terminology and SPAM BS',
    B: 'Major muscles, fibre types, contractions, agonist/antagonist roles, adaptations',
    C: 'Breathing mechanics, lung volumes, neural control, acute responses, adaptations',
    D: 'Heart structure, cardiac cycle, blood vessels, venous return, vascular shunt, adaptations',
    E: 'ATP-PC, lactate and aerobic systems, energy continuum, EPOC, VO₂ max, lactate threshold',
    F: '8-mark interrelationship answers, warm-up effects, cardiovascular-respiratory interaction'
  };

  function getRevised() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch { return []; }
  }
  function saveRevised(arr) { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); }

  function buildSidebar() {
    const items = [
      { aim:'A', topics:[['A1','Bones of the skeleton'],['A2','Functions — SPAM BS'],['A3','Joint types & movement'],['A4','Connective tissue']] },
      { aim:'B', topics:[['B1','Anterior muscles'],['B2','Posterior muscles'],['B3','Muscle fibre types'],['B4','Contractions & roles'],['B5','Adaptations']] },
      { aim:'C', topics:[['C1','Breathing mechanics'],['C2','Lung volumes'],['C3','Neural control'],['C4','Responses & adaptations']] },
      { aim:'D', topics:[['D1','Heart structure & blood flow'],['D2','Cardiac output'],['D3','Blood vessels & venous return'],['D4','Vascular shunt & adaptations']] },
      { aim:'E', topics:[['E1','ATP-PC system'],['E2','Lactate system'],['E3','Aerobic system'],['E4','Continuum, EPOC & VO₂ max']] },
      { aim:'F', topics:[['F1','8-mark interrelationship technique'],['F2','Warm-up effects'],['F3','System interactions']] }
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
    {
      aim: 'A',
      kicker: 'Anatomy',
      title: 'Skeleton and movement under pressure',
      copy: 'Bones, joints and structural support framed around sporting action.',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80'
    },
    {
      aim: 'C',
      kicker: 'Performance',
      title: 'Breathing and circulation during exercise',
      copy: 'Respiratory and cardiovascular systems connected to training demands.',
      image: 'https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=1200&q=80'
    },
    {
      aim: 'E',
      kicker: 'Energy',
      title: 'Fuel systems across intensity changes',
      copy: 'ATP-PC, lactate and aerobic work with a stronger visual lead-in.',
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

  /* ============================================================  AIM A — Skeletal System  ============================================================ */
  const aimA = aimSection('A', [
    topic('A1','Bones of the skeleton', `
<p>You must be able to name and locate the major bones. In 8-mark questions, you will be asked to name the bones forming a specific joint and state the movements occurring at that joint during a sporting action.</p>

<div class="guide-diagram">
<svg viewBox="0 0 300 520" xmlns="http://www.w3.org/2000/svg" style="max-width:260px;font-family:var(--font);font-size:10px">
  <!-- Simple skeleton outline with labeled bones -->
  <!-- Head/skull -->
  <ellipse cx="150" cy="36" rx="28" ry="32" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".7"/>
  <text x="186" y="38" fill="currentColor" font-size="9.5">Skull</text>
  <line x1="178" y1="36" x2="186" y2="36" stroke="currentColor" stroke-width="0.8" opacity=".5"/>
  <!-- Clavicle -->
  <line x1="122" y1="72" x2="95" y2="80" stroke="currentColor" stroke-width="2" opacity=".7"/>
  <line x1="178" y1="72" x2="205" y2="80" stroke="currentColor" stroke-width="2" opacity=".7"/>
  <text x="58" y="78" fill="currentColor" font-size="9">Clavicle</text>
  <!-- Sternum -->
  <rect x="143" y="72" width="14" height="48" rx="3" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".7"/>
  <text x="162" y="92" fill="currentColor" font-size="9">Sternum</text>
  <!-- Ribs (simplified) -->
  <path d="M143 78 Q125 88 122 98" fill="none" stroke="currentColor" stroke-width="1" opacity=".5"/>
  <path d="M143 85 Q122 96 120 108" fill="none" stroke="currentColor" stroke-width="1" opacity=".5"/>
  <path d="M157 78 Q175 88 178 98" fill="none" stroke="currentColor" stroke-width="1" opacity=".5"/>
  <path d="M157 85 Q178 96 180 108" fill="none" stroke="currentColor" stroke-width="1" opacity=".5"/>
  <!-- Vertebral column (spine) -->
  <line x1="150" y1="68" x2="150" y2="195" stroke="currentColor" stroke-width="3" opacity=".6" stroke-dasharray="4 2"/>
  <text x="98" y="138" fill="currentColor" font-size="9">Vertebrae</text>
  <line x1="130" y1="136" x2="147" y2="136" stroke="currentColor" stroke-width="0.7" opacity=".5"/>
  <!-- Pelvis -->
  <ellipse cx="150" cy="202" rx="35" ry="22" fill="none" stroke="currentColor" stroke-width="2" opacity=".7"/>
  <text x="192" y="204" fill="currentColor" font-size="9">Pelvis</text>
  <!-- Humerus -->
  <line x1="93" y1="82" x2="80" y2="148" stroke="currentColor" stroke-width="3" opacity=".7"/>
  <text x="50" y="120" fill="currentColor" font-size="9">Humerus</text>
  <line x1="74" y1="115" x2="80" y2="115" stroke="currentColor" stroke-width="0.7" opacity=".5"/>
  <!-- Radius/Ulna -->
  <line x1="80" y1="150" x2="70" y2="210" stroke="currentColor" stroke-width="2" opacity=".6"/>
  <line x1="80" y1="150" x2="86" y2="210" stroke="currentColor" stroke-width="2" opacity=".6"/>
  <text x="34" y="186" fill="currentColor" font-size="9">Radius</text>
  <text x="37" y="198" fill="currentColor" font-size="9">/ Ulna</text>
  <!-- Scapula -->
  <text x="200" y="108" fill="currentColor" font-size="9">Scapula</text>
  <!-- Femur -->
  <line x1="135" y1="224" x2="128" y2="338" stroke="currentColor" stroke-width="5" opacity=".7"/>
  <line x1="165" y1="224" x2="172" y2="338" stroke="currentColor" stroke-width="5" opacity=".7"/>
  <text x="58" y="290" fill="currentColor" font-size="9.5" font-weight="bold">Femur</text>
  <line x1="90" y1="288" x2="126" y2="288" stroke="currentColor" stroke-width="0.7" opacity=".5"/>
  <!-- Patella -->
  <ellipse cx="128" cy="345" rx="8" ry="6" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".7"/>
  <ellipse cx="172" cy="345" rx="8" ry="6" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".7"/>
  <text x="192" y="348" fill="currentColor" font-size="9">Patella</text>
  <!-- Tibia/Fibula -->
  <line x1="126" y1="350" x2="122" y2="445" stroke="currentColor" stroke-width="3.5" opacity=".7"/>
  <line x1="133" y1="350" x2="137" y2="445" stroke="currentColor" stroke-width="1.8" opacity=".6"/>
  <text x="58" y="408" fill="currentColor" font-size="9">Tibia &amp;</text>
  <text x="58" y="420" fill="currentColor" font-size="9">Fibula</text>
  <line x1="92" y1="412" x2="120" y2="412" stroke="currentColor" stroke-width="0.7" opacity=".5"/>
  <line x1="170" y1="350" x2="174" y2="445" stroke="currentColor" stroke-width="3.5" opacity=".7"/>
  <line x1="163" y1="350" x2="163" y2="445" stroke="currentColor" stroke-width="1.8" opacity=".6"/>
  <!-- Calcaneus/Tarsals -->
  <ellipse cx="125" cy="454" rx="12" ry="8" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".7"/>
  <ellipse cx="173" cy="454" rx="12" ry="8" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".7"/>
  <text x="58" y="468" fill="currentColor" font-size="9">Tarsals /</text>
  <text x="58" y="480" fill="currentColor" font-size="9">Calcaneus</text>
  <line x1="110" y1="472" x2="113" y2="454" stroke="currentColor" stroke-width="0.7" opacity=".5"/>
  <!-- Metatarsals/toes -->
  <rect x="112" y="460" width="26" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1" opacity=".6"/>
  <rect x="160" y="460" width="26" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1" opacity=".6"/>
  <text x="192" y="472" fill="currentColor" font-size="9">Metatarsals</text>
</svg>
<figcaption>Figure 1 — Major bones of the skeleton (anterior view)</figcaption>
</div>

<table class="g-table"><thead><tr><th>Bone</th><th>Location</th><th>Joints formed</th><th>Sport relevance</th></tr></thead><tbody>
<tr><td>Skull</td><td>Head</td><td>Atlanto-occipital (neck)</td><td>Protects brain; heading in football</td></tr>
<tr><td>Clavicle</td><td>Collarbone</td><td>Acromioclavicular (shoulder)</td><td>Shoulder girdle stability in throwing</td></tr>
<tr><td>Scapula</td><td>Shoulder blade</td><td>Glenohumeral (shoulder)</td><td>Arm movement anchor point</td></tr>
<tr><td>Humerus</td><td>Upper arm</td><td>Shoulder, elbow</td><td>Lever for throwing; cricket bowling</td></tr>
<tr><td>Radius</td><td>Forearm (thumb side)</td><td>Elbow, wrist</td><td>Pronation/supination in tennis forehand/backhand</td></tr>
<tr><td>Ulna</td><td>Forearm (little-finger side)</td><td>Elbow, wrist</td><td>Elbow hinge stability</td></tr>
<tr><td>Vertebrae (C/T/L)</td><td>Spine (cervical/thoracic/lumbar)</td><td>Intervertebral joints</td><td>Trunk rotation in golf, posture</td></tr>
<tr><td>Pelvis</td><td>Hip girdle</td><td>Hip joint, sacroiliac</td><td>Force transfer from legs to trunk in running</td></tr>
<tr><td>Femur</td><td>Thigh</td><td>Hip, knee</td><td>Longest, strongest bone; sprint running, jumping</td></tr>
<tr><td>Patella</td><td>Kneecap</td><td>Knee (patellofemoral)</td><td>Protects knee; lever for quad force</td></tr>
<tr><td>Tibia</td><td>Shin (main weight-bearing)</td><td>Knee, ankle</td><td>Force transmission in running and jumping</td></tr>
<tr><td>Fibula</td><td>Outer shin</td><td>Ankle</td><td>Lateral ankle stability</td></tr>
<tr><td>Tarsals / Calcaneus</td><td>Ankle / heel</td><td>Ankle joint</td><td>Calcaneus: Achilles tendon attachment; impact absorption</td></tr>
<tr><td>Metatarsals</td><td>Foot</td><td>Foot joints</td><td>Propulsion in sprint push-off</td></tr>
</tbody></table>`,true),

    topic('A2','Functions of the skeleton — SPAM BS', `
<div class="def-box"><div class="def-label">Mnemonic — SPAM BS</div>
<strong>S</strong>upport and shape — gives the body its form and supports soft tissue<br>
<strong>P</strong>rotection — protects vital organs (skull → brain; ribs → heart and lungs; vertebrae → spinal cord)<br>
<strong>A</strong>ttachment of muscles — tendons attach muscles to bones at origin and insertion points<br>
<strong>M</strong>ovement — bones act as levers; muscle contractions at joints produce movement<br>
<strong>B</strong>lood cell production — red bone marrow produces red blood cells (haematopoiesis) and white blood cells<br>
<strong>S</strong>torage of minerals — stores calcium and phosphorus; released into blood when required</div>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
Functions of the skeleton questions often ask for a specific number of points with examples. Use SPAM BS as your checklist and provide a sporting context for each function. "The skeleton provides protection — the skull protects the brain during a header in football."</div>`,true),

    topic('A3','Joint types and movement terminology', `
<p><strong>Joint types — know the type, structure, examples and movements:</strong></p>
<table class="g-table"><thead><tr><th>Joint type</th><th>Structure</th><th>Movements possible</th><th>Examples</th></tr></thead><tbody>
<tr><td><strong>Ball and socket</strong></td><td>Ball-shaped head fits into cup-shaped socket</td><td>All planes — flexion, extension, abduction, adduction, rotation, circumduction</td><td>Hip (femur + acetabulum of pelvis); shoulder (humerus + glenoid)</td></tr>
<tr><td><strong>Hinge</strong></td><td>Convex surface articulates with concave surface</td><td>Flexion and extension only (one plane)</td><td>Elbow (humerus + radius/ulna); knee (femur + tibia); ankle</td></tr>
<tr><td><strong>Pivot</strong></td><td>Rounded process within a ring; rotation only</td><td>Rotation only</td><td>Atlas-axis (C1-C2): neck rotation; proximal radioulnar joint</td></tr>
<tr><td><strong>Condyloid</strong></td><td>Oval head in elliptical socket</td><td>Flexion, extension, abduction, adduction</td><td>Wrist (radius + carpals); knuckles (metacarpophalangeal)</td></tr>
<tr><td><strong>Saddle</strong></td><td>Two saddle-shaped articular surfaces</td><td>Flexion, extension, abduction, adduction</td><td>Carpometacarpal joint (base of thumb)</td></tr>
<tr><td><strong>Gliding (plane)</strong></td><td>Flat articular surfaces</td><td>Gliding/sliding in limited range</td><td>Intercarpal joints; intertarsal joints</td></tr>
</tbody></table>

<p><strong>Movement terminology — definitions with sport examples:</strong></p>
<table class="g-table"><thead><tr><th>Movement</th><th>Definition</th><th>Sport example</th></tr></thead><tbody>
<tr><td>Flexion</td><td>Decreasing the angle at a joint</td><td>Bending the knee in preparation for a jump; elbow flexion pulling oar in rowing</td></tr>
<tr><td>Extension</td><td>Increasing the angle at a joint</td><td>Extending the knee to kick a football; hip extension in sprint push-off</td></tr>
<tr><td>Abduction</td><td>Movement away from the midline of the body</td><td>Raising arm out to the side in a jumping jack</td></tr>
<tr><td>Adduction</td><td>Movement towards the midline of the body</td><td>Bringing arm back to the side after abduction</td></tr>
<tr><td>Rotation</td><td>Turning around the long axis of the bone</td><td>Hip rotation in discus throw; trunk rotation in golf swing</td></tr>
<tr><td>Circumduction</td><td>Combination of flexion, extension, abduction and adduction — circular movement</td><td>Bowling action in cricket; windmill softball pitch</td></tr>
<tr><td>Plantarflexion</td><td>Pointing the toes downward (ankle)</td><td>Pushing off the ground in a sprint start; jumping</td></tr>
<tr><td>Dorsiflexion</td><td>Pulling the toes upward toward the shin (ankle)</td><td>Landing phase of a jump; heel-strike in running</td></tr>
<tr><td>Pronation</td><td>Rotating the forearm so the palm faces downward</td><td>Tennis backhand; swimming freestyle catch phase</td></tr>
<tr><td>Supination</td><td>Rotating the forearm so the palm faces upward</td><td>Tennis forehand; bowling in cricket (arm palm-up through release)</td></tr>
<tr><td>Lateral flexion</td><td>Bending the spine to one side</td><td>Heading a football; gymnastics side bend</td></tr>
<tr><td>Inversion</td><td>Sole of foot turns inward</td><td>Ankle inversion sprain (common sport injury)</td></tr>
<tr><td>Eversion</td><td>Sole of foot turns outward</td><td>Side-stepping in football</td></tr>
</tbody></table>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip — joint action questions</div>
For 4–8 mark questions describing movement at a joint, always include: (1) name the joint type, (2) name the bones forming the joint, (3) state the specific movement (e.g. plantarflexion, not just "foot moves"), (4) name the agonist muscle. Example: "At the ankle joint (a hinge joint formed by the tibia, fibula and talus), plantarflexion occurs. The gastrocnemius contracts concentrically to produce this movement."</div>`,true),

    topic('A4','Connective tissue — ligaments, tendons and cartilage', `
<table class="g-table"><thead><tr><th>Tissue</th><th>Connects</th><th>Function</th><th>Characteristics</th></tr></thead><tbody>
<tr><td><strong>Ligament</strong></td><td>Bone to bone (at joints)</td><td>Stabilises joints; limits excessive or abnormal movement; proprioception</td><td>Strong, slightly elastic; poor blood supply (slow healing); white/yellow connective tissue</td></tr>
<tr><td><strong>Tendon</strong></td><td>Muscle to bone</td><td>Transfers force from muscle contraction to bone to produce movement</td><td>Very strong, inelastic; good blood supply; stores elastic energy (e.g. Achilles in running)</td></tr>
<tr><td><strong>Articular / hyaline cartilage</strong></td><td>Covers the ends of bones in synovial joints</td><td>Reduces friction between joint surfaces; absorbs compressive shock</td><td>Smooth, glassy; avascular (no blood supply — slow to heal); found in all synovial joints</td></tr>
<tr><td><strong>Fibrocartilage</strong></td><td>Between bones in semi-movable joints</td><td>Resists compression and provides cushioning; slight movement</td><td>Tough; found in intervertebral discs and menisci of the knee</td></tr>
</tbody></table>

<p><strong>Synovial joint features:</strong></p>
<ul>
<li><strong>Synovial fluid:</strong> viscous lubricant secreted by synovial membrane; reduces friction during movement</li>
<li><strong>Joint (fibrous) capsule:</strong> encloses the joint; provides structural integrity and stability</li>
<li><strong>Bursae:</strong> fluid-filled sacs that cushion areas of friction within or near joints (e.g. knee, shoulder)</li>
</ul>

<div class="mistake-box"><div class="mistake-label">&#9888; Common mistake</div>
Do not confuse ligaments and tendons. Ligaments = <strong>bone to bone</strong>; tendons = <strong>muscle to bone</strong>. A simple memory aid: "Ligaments Link bones; Tendons Tie muscles to bones." A sprained ankle damages ligaments; a pulled hamstring damages the muscle or its tendon.</div>`,true)
  ]);

  /* ============================================================  AIM B — Muscular System  ============================================================ */
  const aimB = aimSection('B', [
    topic('B1','Anterior (front) muscles', `
<div class="guide-diagram">
<svg viewBox="0 0 320 480" xmlns="http://www.w3.org/2000/svg" style="max-width:260px;font-family:var(--font);font-size:9.5px">
  <!-- Body outline anterior -->
  <ellipse cx="160" cy="44" rx="30" ry="35" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".6"/>
  <!-- Torso -->
  <path d="M120 78 L96 100 L90 200 L118 210 L142 200 L160 208 L178 200 L202 210 L230 200 L224 100 L200 78 Z" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".6"/>
  <!-- Neck -->
  <rect x="147" y="74" width="26" height="18" rx="4" fill="none" stroke="currentColor" stroke-width="1" opacity=".5"/>
  <!-- Upper arms -->
  <path d="M96 100 L76 160" stroke="currentColor" stroke-width="6" opacity=".6" stroke-linecap="round" fill="none"/>
  <path d="M224 100 L244 160" stroke="currentColor" stroke-width="6" opacity=".6" stroke-linecap="round" fill="none"/>
  <!-- Lower arms -->
  <path d="M76 162 L62 220" stroke="currentColor" stroke-width="4" opacity=".5" stroke-linecap="round" fill="none"/>
  <path d="M244 162 L258 220" stroke="currentColor" stroke-width="4" opacity=".5" stroke-linecap="round" fill="none"/>
  <!-- Thighs -->
  <path d="M125 210 L118 330" stroke="currentColor" stroke-width="14" opacity=".6" stroke-linecap="round" fill="none"/>
  <path d="M195 210 L202 330" stroke="currentColor" stroke-width="14" opacity=".6" stroke-linecap="round" fill="none"/>
  <!-- Lower legs -->
  <path d="M116 332 L113 430" stroke="currentColor" stroke-width="8" opacity=".5" stroke-linecap="round" fill="none"/>
  <path d="M204 332 L207 430" stroke="currentColor" stroke-width="8" opacity=".5" stroke-linecap="round" fill="none"/>

  <!-- Muscle labels with arrows -->
  <!-- Deltoid -->
  <text x="20" y="105" fill="#1D4ED8" font-weight="bold">Deltoid</text>
  <line x1="66" y1="103" x2="97" y2="100" stroke="#1D4ED8" stroke-width="1" marker-end="url(#arr)"/>
  <!-- Pec major -->
  <text x="6" y="130" fill="#1D4ED8" font-weight="bold">Pectoralis</text>
  <text x="14" y="141" fill="#1D4ED8">major</text>
  <line x1="68" y1="133" x2="120" y2="128" stroke="#1D4ED8" stroke-width="1"/>
  <!-- Biceps -->
  <text x="18" y="158" fill="#1D4ED8" font-weight="bold">Biceps</text>
  <line x1="52" y1="156" x2="76" y2="142" stroke="#1D4ED8" stroke-width="1"/>
  <!-- Abs -->
  <text x="24" y="185" fill="#1D4ED8" font-weight="bold">Rectus</text>
  <text x="16" y="196" fill="#1D4ED8">abdominis</text>
  <line x1="74" y1="186" x2="135" y2="165" stroke="#1D4ED8" stroke-width="1"/>
  <!-- Quad -->
  <text x="18" y="268" fill="#1D4ED8" font-weight="bold">Quadriceps</text>
  <line x1="82" y1="265" x2="118" y2="270" stroke="#1D4ED8" stroke-width="1"/>
  <!-- Hip flexors -->
  <text x="200" y="228" fill="#1D4ED8" font-weight="bold">Hip flexors</text>
  <text x="208" y="239" fill="#1D4ED8">(Iliopsoas)</text>
  <line x1="204" y1="230" x2="188" y2="217" stroke="#1D4ED8" stroke-width="1"/>
  <!-- Tibialis anterior -->
  <text x="216" y="378" fill="#1D4ED8" font-weight="bold">Tibialis</text>
  <text x="214" y="389" fill="#1D4ED8">anterior</text>
  <line x1="216" y1="380" x2="210" y2="380" stroke="#1D4ED8" stroke-width="1"/>

  <defs>
    <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#1D4ED8"/>
    </marker>
  </defs>
</svg>
<figcaption>Figure 2 — Major anterior muscles</figcaption>
</div>

<table class="g-table"><thead><tr><th>Muscle</th><th>Location</th><th>Action</th><th>Sport example</th></tr></thead><tbody>
<tr><td><strong>Deltoid</strong></td><td>Shoulder cap</td><td>Abduction of shoulder (all fibres); flexion (anterior); extension (posterior)</td><td>Front crawl arm lift; throwing action</td></tr>
<tr><td><strong>Pectoralis major</strong></td><td>Chest</td><td>Horizontal adduction; flexion of shoulder</td><td>Breaststroke pull; press-up; tennis forehand</td></tr>
<tr><td><strong>Biceps brachii</strong></td><td>Front upper arm</td><td>Elbow flexion; forearm supination</td><td>Pulling in rowing; catching in cricket</td></tr>
<tr><td><strong>Rectus abdominis</strong></td><td>Abdomen</td><td>Trunk flexion; core stabilisation</td><td>Sit-up; gymnastics core work; core in all sports</td></tr>
<tr><td><strong>Iliopsoas (hip flexors)</strong></td><td>Hip / anterior pelvis</td><td>Hip flexion (bringing thigh forward)</td><td>Sprint running stride; kicking in football</td></tr>
<tr><td><strong>Quadriceps</strong> (4 muscles)</td><td>Front of thigh</td><td>Knee extension; hip flexion (rectus femoris)</td><td>Kicking, jumping, sprinting, stair climbing</td></tr>
<tr><td><strong>Tibialis anterior</strong></td><td>Front of lower leg</td><td>Dorsiflexion of ankle</td><td>Heel-strike landing; shin mechanics in running</td></tr>
</tbody></table>`,true),

    topic('B2','Posterior (back) muscles', `
<table class="g-table"><thead><tr><th>Muscle</th><th>Location</th><th>Action</th><th>Sport example</th></tr></thead><tbody>
<tr><td><strong>Trapezius</strong></td><td>Upper back and neck</td><td>Scapula elevation, retraction and depression; head extension</td><td>Shoulder stability in throwing; posture in rowing</td></tr>
<tr><td><strong>Latissimus dorsi</strong></td><td>Mid-lower back (broad)</td><td>Shoulder extension; adduction; medial rotation</td><td>Swimming pull-through; rowing pull; rock climbing</td></tr>
<tr><td><strong>Triceps brachii</strong></td><td>Back of upper arm</td><td>Elbow extension</td><td>Throwing, pushing, press-up</td></tr>
<tr><td><strong>Gluteus maximus</strong></td><td>Buttock</td><td>Hip extension; lateral rotation of hip</td><td>Sprinting push-off; jumping; cycling power phase</td></tr>
<tr><td><strong>Hamstrings</strong> (3 muscles)</td><td>Back of thigh</td><td>Knee flexion; hip extension</td><td>Sprint recovery phase; decelerating; heading</td></tr>
<tr><td><strong>Gastrocnemius</strong></td><td>Back of upper calf</td><td>Plantarflexion (knee bent or straight); knee flexion</td><td>Jumping; sprint push-off; standing on tiptoe</td></tr>
<tr><td><strong>Soleus</strong></td><td>Back of lower calf (deep to gastrocnemius)</td><td>Plantarflexion (especially knee straight)</td><td>Endurance running; postural control; standing</td></tr>
</tbody></table>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip — hip extension muscle</div>
In 8-mark questions about running, the hip extension phase requires the <strong>gluteus maximus and hamstrings</strong>. The push-off phase requires the <strong>gastrocnemius and soleus</strong> (plantarflexion). The knee extension phase for kicking requires the <strong>quadriceps</strong>. Make sure you use the correct muscles for each phase of movement.</div>`,true),

    topic('B3','Muscle fibre types', `
<table class="g-table"><thead><tr><th>Characteristic</th><th>Type I (Slow Oxidative)</th><th>Type IIa (Fast Oxidative Glycolytic)</th><th>Type IIb/IIx (Fast Glycolytic)</th></tr></thead><tbody>
<tr><td>Contraction speed</td><td>Slow</td><td>Fast</td><td>Very fast</td></tr>
<tr><td>Force production</td><td>Low</td><td>High</td><td>Very high</td></tr>
<tr><td>Fatigue resistance</td><td>Very high</td><td>Moderate</td><td>Low (fatigues quickly)</td></tr>
<tr><td>Aerobic capacity</td><td>High</td><td>Moderate</td><td>Low</td></tr>
<tr><td>Mitochondria density</td><td>High</td><td>Moderate</td><td>Low</td></tr>
<tr><td>Myoglobin content</td><td>High (red/dark)</td><td>Moderate (pinkish)</td><td>Low (white/pale)</td></tr>
<tr><td>Primary fuel</td><td>Fat (aerobic)</td><td>Glycogen (mixed)</td><td>Glycogen (anaerobic)</td></tr>
<tr><td>ATP yield rate</td><td>Slow but sustained</td><td>Medium</td><td>Fast but brief</td></tr>
<tr><td>Best suited for</td><td>Endurance: marathon, 10km, cycling</td><td>Middle distance, team sports, 800m</td><td>Explosive power: 100m, shot put, heavy lifting</td></tr>
</tbody></table>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
Fibre type questions often link to training or sport selection. A marathon runner has predominantly Type I fibres (high myoglobin, many mitochondria, fatigue resistant). A sprinter has more Type IIb fibres (high force, fast but fatigue quickly). Training can shift fibres toward IIa type but cannot convert between I and II fundamentally.</div>`,true),

    topic('B4','Muscle contraction types and movement roles', `
<p><strong>Contraction types:</strong></p>
<table class="g-table"><thead><tr><th>Type</th><th>What happens</th><th>Sport example</th></tr></thead><tbody>
<tr><td><strong>Concentric</strong></td><td>Muscle <em>shortens</em> while producing tension (most common)</td><td>Biceps shortening as you curl a weight up; quadriceps shortening when you stand from a squat</td></tr>
<tr><td><strong>Eccentric</strong></td><td>Muscle <em>lengthens</em> while producing tension (controlling movement)</td><td>Biceps lengthening to lower a weight; quadriceps lengthening to control landing from a jump; hamstrings in sprint braking</td></tr>
<tr><td><strong>Isometric</strong></td><td>Muscle length <em>stays the same</em> while producing tension — no movement</td><td>Holding a plank; gripping a bar in gymnastics; holding a rugby scrum position</td></tr>
</tbody></table>

<p><strong>Movement roles:</strong></p>
<div class="def-box"><div class="def-label">Key definitions</div>
<strong>Agonist (prime mover)</strong> — the main muscle causing the desired movement.<br>
<strong>Antagonist</strong> — the muscle that opposes the agonist; relaxes to allow smooth movement.<br>
<strong>Synergist</strong> — assists the agonist; fine-tunes or stabilises the movement.<br>
<strong>Fixator</strong> — stabilises the bone at the origin of the agonist so it can contract effectively.</div>

<p><strong>Worked example — elbow flexion (e.g. pulling phase in rowing):</strong></p>
<table class="g-table"><thead><tr><th>Role</th><th>Muscle</th><th>What it does</th></tr></thead><tbody>
<tr><td>Agonist</td><td>Biceps brachii</td><td>Contracts concentrically to flex the elbow</td></tr>
<tr><td>Antagonist</td><td>Triceps brachii</td><td>Relaxes and lengthens to allow smooth flexion</td></tr>
<tr><td>Synergist</td><td>Brachialis</td><td>Assists the biceps in producing elbow flexion</td></tr>
<tr><td>Fixator</td><td>Rotator cuff muscles</td><td>Stabilise the shoulder joint to provide a stable origin for the biceps</td></tr>
</tbody></table>

<p><strong>Motor unit and all-or-none law:</strong></p>
<ul>
<li><strong>Motor unit:</strong> one motor neurone and all the muscle fibres it innervates</li>
<li><strong>All-or-none law:</strong> when a motor unit receives a stimulus at or above threshold, ALL its muscle fibres contract maximally. A sub-threshold stimulus produces no contraction.</li>
<li><strong>Graded muscle contraction</strong> is achieved by: (1) recruiting more motor units (spatial summation) and (2) increasing firing frequency of motor units (temporal summation/wave summation)</li>
</ul>`,true),

    topic('B5','Acute responses and chronic adaptations of the muscular system', `
<p><strong>Acute responses during exercise:</strong></p>
<ul>
<li>Increased blood flow to active muscles (vasodilation, vascular shunt)</li>
<li>Increased muscle temperature → faster enzyme activity → faster contraction speed</li>
<li>Increased depth and rate of breathing (supplies more O₂ to muscles)</li>
<li>Muscle fatigue: accumulation of lactate/H⁺ ions, glycogen depletion, reduced Ca²⁺ release</li>
<li>Increase in DOMS (delayed onset muscle soreness) after unaccustomed exercise — micro-tears in fibres</li>
</ul>

<table class="g-table"><thead><tr><th>Chronic adaptation</th><th>Description</th><th>Benefit</th></tr></thead><tbody>
<tr><td>Hypertrophy</td><td>Increase in muscle fibre cross-sectional area (myofibril addition)</td><td>Greater force production; increased strength</td></tr>
<tr><td>Increased myoglobin content</td><td>More oxygen-storing protein in muscle fibres</td><td>More O₂ available for aerobic metabolism</td></tr>
<tr><td>Increased mitochondrial density</td><td>More mitochondria per fibre</td><td>Greater aerobic ATP production capacity</td></tr>
<tr><td>Increased capillary density</td><td>More capillaries surrounding muscle fibres</td><td>Better O₂ and nutrient delivery; faster waste removal</td></tr>
<tr><td>Increased enzyme activity</td><td>Higher concentration of aerobic and anaerobic enzymes</td><td>Faster energy release from both pathways</td></tr>
<tr><td>Increased glycogen storage</td><td>More glycogen stored within fibres</td><td>More fuel available before depletion</td></tr>
</tbody></table>`,false)
  ]);

  /* ============================================================  AIM C — Respiratory System  ============================================================ */
  const aimC = aimSection('C', [
    topic('C1','Breathing mechanics — inspiration and expiration', `
<p>Breathing is controlled by pressure changes in the thoracic cavity created by muscular contractions.</p>

<table class="g-table"><thead><tr><th></th><th>Inspiration (breathing in)</th><th>Expiration at rest (breathing out)</th><th>Forced expiration (exercise)</th></tr></thead><tbody>
<tr><td>Diaphragm</td><td>Contracts (flattens)</td><td>Relaxes (returns to dome)</td><td>Relaxes</td></tr>
<tr><td>External intercostals</td><td>Contract (ribs rise and flare out)</td><td>Relax</td><td>Relax</td></tr>
<tr><td>Internal intercostals</td><td>Relaxed</td><td>Passive / relaxed</td><td>Contract (pull ribs down and in)</td></tr>
<tr><td>Abdominal muscles</td><td>Relaxed</td><td>Passive</td><td>Contract (push diaphragm up)</td></tr>
<tr><td>Thoracic volume</td><td>Increases</td><td>Decreases</td><td>Decreases rapidly</td></tr>
<tr><td>Lung pressure</td><td>Decreases below atmospheric</td><td>Increases above atmospheric</td><td>Increases rapidly</td></tr>
<tr><td>Air movement</td><td>Into lungs</td><td>Out of lungs (passive)</td><td>Out of lungs (active)</td></tr>
</tbody></table>

<p><strong>Pathway of air:</strong> Nose/mouth → trachea → left and right primary bronchi → secondary bronchi → bronchioles → terminal bronchioles → alveoli</p>

<p><strong>Alveoli — gas exchange:</strong></p>
<ul>
<li>~300 million alveoli in adult lungs — huge surface area (~70 m²)</li>
<li>Walls only one cell thick (type I pneumocytes) — minimises diffusion distance</li>
<li>Surrounded by pulmonary capillaries — blood and air separated by &lt;0.5 μm</li>
<li>Oxygen diffuses from alveoli (high PO₂) into blood (lower PO₂)</li>
<li>CO₂ diffuses from blood (high PCO₂) into alveoli (lower PCO₂) → exhaled</li>
<li>Fick's law: rate of diffusion ∝ (surface area × concentration gradient) / thickness</li>
</ul>`,true),

    topic('C2','Lung volumes', `
<div class="guide-diagram">
  <canvas id="sport-lung-canvas" width="480" height="280" style="border-radius:var(--r-sm)"></canvas>
  <figcaption>Figure 3 — Lung volumes graph. Tidal breathing at rest (TV), inspiratory reserve volume (IRV), expiratory reserve volume (ERV), residual volume (RV), vital capacity (VC) and total lung capacity (TLC).</figcaption>
</div>

<table class="g-table"><thead><tr><th>Volume / capacity</th><th>Definition</th><th>Typical value (rest)</th><th>During exercise</th></tr></thead><tbody>
<tr><td><strong>Tidal volume (TV)</strong></td><td>Air inhaled or exhaled in one normal breath</td><td>~0.5 L</td><td>Increases (up to ~3 L)</td></tr>
<tr><td><strong>Inspiratory Reserve Volume (IRV)</strong></td><td>Extra air that can be inhaled above tidal volume</td><td>~3.0 L</td><td>Decreases (used in exercise breathing)</td></tr>
<tr><td><strong>Expiratory Reserve Volume (ERV)</strong></td><td>Extra air that can be forcefully exhaled beyond tidal volume</td><td>~1.2 L</td><td>Decreases (used in exercise)</td></tr>
<tr><td><strong>Residual Volume (RV)</strong></td><td>Air remaining in lungs after maximal exhalation — cannot be exhaled</td><td>~1.2 L</td><td>Unchanged</td></tr>
<tr><td><strong>Vital Capacity (VC)</strong></td><td>Maximum air exhaled after maximum inhalation = TV + IRV + ERV</td><td>~4.7 L</td><td>Unchanged (structural limit)</td></tr>
<tr><td><strong>Total Lung Capacity (TLC)</strong></td><td>Total volume in lungs = VC + RV</td><td>~5.9 L</td><td>Unchanged</td></tr>
<tr><td><strong>Minute Ventilation (VE)</strong></td><td>TV × Breathing rate = total air moved per minute</td><td>~7–8 L/min</td><td>Up to 120–150 L/min at max</td></tr>
</tbody></table>`,true),

    topic('C3','Neural and chemical control of breathing', `
<p><strong>How breathing rate is regulated:</strong></p>
<ol>
<li>The <strong>medulla oblongata</strong> (in the brainstem) is the primary respiratory control centre — sends impulses to the diaphragm and intercostal muscles via the phrenic and intercostal nerves</li>
<li><strong>Chemoreceptors</strong> (central in medulla; peripheral in carotid and aortic bodies) detect:
  <ul><li>Rising blood CO₂ (most potent stimulus)</li>
  <li>Falling blood pH (due to lactic acid and CO₂ forming carbonic acid)</li>
  <li>Falling blood O₂ (at very low levels)</li></ul></li>
<li>Rising CO₂ → chemoreceptors stimulate medulla → increased nerve impulse rate to breathing muscles → faster and deeper breathing (increased TV and rate)</li>
<li>At exercise onset, <strong>proprioceptors</strong> (in muscles and joints) also send signals to the medulla — this accounts for the rapid increase in breathing at the very start of exercise before CO₂ has risen</li>
</ol>`,true),

    topic('C4','Acute responses and chronic adaptations — respiratory', `
<p><strong>Acute responses to exercise:</strong></p>
<table class="g-table"><thead><tr><th>Response</th><th>Change</th><th>Purpose</th></tr></thead><tbody>
<tr><td>Breathing rate</td><td>10–12 breaths/min → 40–60 breaths/min</td><td>Move more air to alveoli</td></tr>
<tr><td>Tidal volume</td><td>0.5 L → up to 3 L</td><td>More air per breath</td></tr>
<tr><td>Minute ventilation (VE)</td><td>7 L/min → up to 120–150 L/min</td><td>Massive increase in gas exchange</td></tr>
<tr><td>A-V O₂ difference</td><td>Increases significantly</td><td>Working muscles extract more O₂ per unit of blood</td></tr>
</tbody></table>

<table class="g-table"><thead><tr><th>Chronic adaptation (from training)</th><th>Description</th></tr></thead><tbody>
<tr><td>Increased tidal volume (at rest)</td><td>More efficient breathing; larger volumes per breath</td></tr>
<tr><td>Increased vital capacity</td><td>Stronger respiratory muscles; greater lung volume available</td></tr>
<tr><td>Reduced resting breathing rate</td><td>More efficient gas exchange per breath</td></tr>
<tr><td>More efficient gas exchange</td><td>Increased alveolar capillarisation; thinner diffusion distance</td></tr>
<tr><td>Stronger respiratory muscles</td><td>Diaphragm and intercostals hypertrophy slightly</td></tr>
</tbody></table>`,false)
  ]);

  /* ============================================================  AIM D — Cardiovascular System  ============================================================ */
  const aimD = aimSection('D', [
    topic('D1','Heart structure and blood flow', `
<div class="guide-diagram">
<svg viewBox="0 0 380 320" xmlns="http://www.w3.org/2000/svg" style="max-width:380px;font-family:var(--font);font-size:10px">
  <!-- Heart outline -->
  <path d="M190 270 C140 240 80 200 80 150 C80 100 110 70 145 70 C165 70 182 82 190 95 C198 82 215 70 235 70 C270 70 300 100 300 150 C300 200 240 240 190 270Z" fill="none" stroke="currentColor" stroke-width="2" opacity=".7"/>
  <!-- Chambers (rough divisions) -->
  <!-- RA top right -->
  <path d="M230 100 C250 95 265 110 270 130 C275 150 265 170 250 175 L210 175 L210 100Z" fill="#ef444420" stroke="#ef4444" stroke-width="1"/>
  <text x="240" y="140" text-anchor="middle" fill="#ef4444" font-weight="bold" font-size="9">Right</text>
  <text x="240" y="152" text-anchor="middle" fill="#ef4444" font-size="9">Atrium</text>
  <!-- RV bottom right -->
  <path d="M210 178 L250 178 C265 180 275 200 268 230 C260 250 235 265 210 270L210 178Z" fill="#ef444418" stroke="#ef4444" stroke-width="1"/>
  <text x="238" y="225" text-anchor="middle" fill="#ef4444" font-weight="bold" font-size="9">Right</text>
  <text x="238" y="237" text-anchor="middle" fill="#ef4444" font-size="9">Ventricle</text>
  <!-- LA top left -->
  <path d="M170 100 L130 100 C115 105 108 120 110 140 C112 160 125 172 140 175 L170 175Z" fill="#3b82f620" stroke="#3b82f6" stroke-width="1"/>
  <text x="140" y="138" text-anchor="middle" fill="#3b82f6" font-weight="bold" font-size="9">Left</text>
  <text x="140" y="150" text-anchor="middle" fill="#3b82f6" font-size="9">Atrium</text>
  <!-- LV bottom left -->
  <path d="M140 178 L170 178 L170 270 C150 260 118 240 112 208 C106 186 118 178 140 178Z" fill="#3b82f618" stroke="#3b82f6" stroke-width="1"/>
  <text x="140" y="228" text-anchor="middle" fill="#3b82f6" font-weight="bold" font-size="9">Left</text>
  <text x="140" y="240" text-anchor="middle" fill="#3b82f6" font-size="9">Ventricle</text>
  <!-- Septum -->
  <line x1="190" y1="95" x2="190" y2="272" stroke="currentColor" stroke-width="2" opacity=".5" stroke-dasharray="3 2"/>
  <!-- SVC -->
  <line x1="252" y1="70" x2="255" y2="100" stroke="#ef4444" stroke-width="3"/>
  <text x="264" y="80" fill="#ef4444" font-size="9">SVC</text>
  <!-- IVC -->
  <line x1="268" y1="250" x2="268" y2="280" stroke="#ef4444" stroke-width="3"/>
  <text x="274" y="278" fill="#ef4444" font-size="9">IVC</text>
  <!-- Pulmonary artery (from RV to lungs) -->
  <path d="M255 160 C280 155 310 120 310 90" fill="none" stroke="#ef4444" stroke-width="3"/>
  <text x="310" y="86" fill="#ef4444" font-size="9">Pulmonary</text>
  <text x="316" y="97" fill="#ef4444" font-size="9">artery</text>
  <!-- Pulmonary veins (to LA) -->
  <line x1="110" y1="100" x2="100" y2="70" stroke="#3b82f6" stroke-width="3"/>
  <text x="60" y="66" fill="#3b82f6" font-size="9">Pulmonary</text>
  <text x="68" y="77" fill="#3b82f6" font-size="9">veins</text>
  <!-- Aorta (from LV) -->
  <path d="M135 160 C100 155 70 130 65 95" fill="none" stroke="#3b82f6" stroke-width="3"/>
  <text x="14" y="90" fill="#3b82f6" font-size="9">Aorta</text>
  <!-- Valves -->
  <text x="188" y="173" text-anchor="middle" fill="currentColor" font-size="8" opacity=".8">Tricuspid | Mitral</text>
  <!-- Flow arrows -->
  <text x="192" y="48" text-anchor="middle" fill="currentColor" font-size="9" opacity=".7">Blood flow summary</text>
  <text x="192" y="60" text-anchor="middle" fill="#ef4444" font-size="8">Red = deoxygenated</text>
  <text x="192" y="71" text-anchor="middle" fill="#3b82f6" font-size="8">Blue = oxygenated</text>
</svg>
<figcaption>Figure 4 — Heart diagram showing four chambers, major vessels and valve positions. Deoxygenated blood (red) enters right side; oxygenated blood (blue) exits left side.</figcaption>
</div>

<p><strong>Blood flow through the heart (step by step):</strong></p>
<div class="formula-box">1. Deoxygenated blood returns from body via SVC/IVC → right atrium
2. Right atrium contracts → tricuspid valve opens → right ventricle
3. Right ventricle contracts → pulmonary valve opens → pulmonary artery → lungs
4. Oxygenated blood returns from lungs via pulmonary veins → left atrium
5. Left atrium contracts → mitral (bicuspid) valve opens → left ventricle
6. Left ventricle contracts (thicker wall, higher pressure) → aortic valve → aorta → body</div>

<p><strong>Cardiac conduction system:</strong></p>
<ol>
<li><strong>SA node</strong> (sinoatrial node) — natural pacemaker in right atrium wall; generates impulse 60–100 times per minute at rest</li>
<li>Impulse spreads through both atria → atria contract (atrial systole)</li>
<li><strong>AV node</strong> (atrioventricular node) — delays impulse by 0.12 seconds to allow atria to empty</li>
<li>Impulse travels down <strong>Bundle of His</strong> → <strong>left and right bundle branches</strong> → <strong>Purkinje fibres</strong></li>
<li>Ventricles contract from apex upward → ventricular systole → blood ejected</li>
</ol>`,true),

    topic('D2','Cardiac output and stroke volume', `
<div class="formula-box">CARDIAC OUTPUT (Q) = Heart Rate (HR) × Stroke Volume (SV)

At rest:       Q = 70 bpm × 70 mL = 4,900 mL/min ≈ 5 L/min
During maximal:Q = 190 bpm × 130 mL = 24,700 mL/min ≈ 25 L/min
Elite athlete: Q can exceed 35–40 L/min (due to very large SV of 160–200 mL)</div>

<p><strong>Factors affecting stroke volume:</strong></p>
<ul>
<li><strong>Preload (venous return):</strong> the volume of blood filling the ventricles at end-diastole. Greater filling → greater stretch → more forceful contraction (Frank-Starling law)</li>
<li><strong>Frank-Starling mechanism:</strong> the more the ventricle is stretched by filling, the more forcefully it contracts at the next beat — an intrinsic cardiac response to increased venous return during exercise</li>
<li><strong>Contractility:</strong> influenced by adrenaline during exercise — increases force of contraction independent of stretch</li>
<li><strong>Afterload:</strong> resistance the ventricle must overcome (blood pressure). High afterload reduces SV.</li>
</ul>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
Always show your working for cardiac output calculations and label your units clearly. If HR = 160 bpm and SV = 100 mL, state: Q = 160 × 100 = 16,000 mL/min = 16 L/min. Then interpret: "This represents a significant increase from resting cardiac output of ~5 L/min, ensuring adequate blood flow to working muscles."</div>`,true),

    topic('D3','Blood vessels and venous return mechanisms', `
<table class="g-table"><thead><tr><th>Feature</th><th>Artery</th><th>Capillary</th><th>Vein</th></tr></thead><tbody>
<tr><td>Direction of flow</td><td>Away from heart</td><td>Exchange between blood and tissues</td><td>Towards heart</td></tr>
<tr><td>Wall thickness</td><td>Thick — elastic and muscular</td><td>One cell thick (endothelium only)</td><td>Thin — little smooth muscle</td></tr>
<tr><td>Lumen size</td><td>Small relative to wall</td><td>Smallest — RBC diameter</td><td>Large</td></tr>
<tr><td>Valves present?</td><td>No</td><td>No</td><td>Yes — prevent backflow</td></tr>
<tr><td>Blood pressure</td><td>High (60–120 mmHg)</td><td>Drops significantly</td><td>Low (10–15 mmHg)</td></tr>
<tr><td>Function</td><td>Transport O₂-rich blood at high pressure</td><td>Gas, nutrient and waste exchange with tissues</td><td>Return deoxygenated blood to heart</td></tr>
</tbody></table>

<p><strong>Venous return mechanisms (how blood gets back to the heart against gravity):</strong></p>
<ul>
<li><strong>Skeletal muscle pump:</strong> contracting muscles compress veins, pushing blood toward heart; valves prevent backflow</li>
<li><strong>Respiratory pump:</strong> pressure changes in thorax during breathing draw blood into the thoracic veins toward the heart</li>
<li><strong>Venous valves:</strong> one-way valves ensure blood flows only toward the heart</li>
<li><strong>Venoconstriction:</strong> sympathetic nervous system causes veins to narrow → reduces venous capacity → pushes blood toward heart</li>
<li><strong>Residual pressure:</strong> blood pressure remaining from cardiac contraction continues to drive venous return</li>
</ul>`,true),

    topic('D4','Vascular shunt, thermoregulation and cardiovascular adaptations', `
<p><strong>Vascular shunt mechanism:</strong></p>
<p>At rest, blood is distributed to all organs proportionally. During exercise, blood is redirected to working muscles via:</p>
<ul>
<li><strong>Vasodilation</strong> of arterioles supplying working muscles (caused by: CO₂, lactic acid, decreased O₂, heat, nitric oxide)</li>
<li><strong>Vasoconstriction</strong> of arterioles to non-essential organs (digestive system, kidneys) — controlled by sympathetic nervous system</li>
<li><strong>Precapillary sphincters</strong> open in working muscles, close in inactive areas</li>
<li>Result: up to 80–85% of cardiac output directed to working muscles at maximal exercise (vs 15–20% at rest)</li>
</ul>

<p><strong>Thermoregulation during exercise:</strong></p>
<ul>
<li>Muscle metabolism generates heat → core body temperature rises</li>
<li>Hypothalamus detects temperature rise → signals skin blood vessels to vasodilate</li>
<li>Blood redirected to skin → heat lost by radiation, convection and conduction</li>
<li>Sweating: evaporative cooling — highly effective; sodium and electrolytes lost</li>
<li>During intense exercise, competition between muscle perfusion and skin cooling can impair performance</li>
</ul>

<table class="g-table"><thead><tr><th>Chronic adaptation (from aerobic training)</th><th>Description</th></tr></thead><tbody>
<tr><td>Cardiac hypertrophy (athlete's heart)</td><td>Left ventricle walls thicken; ventricular chamber enlarges → greater EDV and SV</td></tr>
<tr><td>Increased stroke volume at rest and exercise</td><td>Due to larger ventricle and more forceful contraction</td></tr>
<tr><td>Bradycardia (low resting HR)</td><td>Resting HR can fall to 40–50 bpm (elite: &lt;40 bpm); heart doesn't need to beat as fast due to large SV</td></tr>
<tr><td>Increased maximum cardiac output</td><td>Higher max Q (35–40 L/min in elite) due to larger SV</td></tr>
<tr><td>Increased blood volume</td><td>More plasma (dilutes blood) and more red blood cells → greater O₂ carrying capacity</td></tr>
<tr><td>Increased capillary density in muscle</td><td>More capillaries per unit area → shorter diffusion distance to muscle fibres</td></tr>
<tr><td>Reduced resting blood pressure</td><td>More compliant blood vessels; lower peripheral resistance</td></tr>
</tbody></table>`,false)
  ]);

  /* ============================================================  AIM E — Energy Systems  ============================================================ */
  const aimE = aimSection('E', [
    topic('E1','ATP-PC system (phosphocreatine / alactic anaerobic)', `
<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">ATP (Adenosine Triphosphate)</span> — the immediate energy currency for all cellular work including muscle contraction. Breaking the third phosphate bond releases energy: ATP → ADP + Pi + energy. Stores are tiny (~2–3 seconds of maximal work) and must be continuously resynthesised.</div>

<p><strong>ATP-PC system:</strong></p>
<ul>
<li><strong>Fuel:</strong> phosphocreatine (PC) stored in muscle sarcoplasm</li>
<li><strong>Process:</strong> PC is broken down by the enzyme creatine kinase: PC → Creatine + Pi + energy (used to reconstitute ATP from ADP + Pi)</li>
<li><strong>Duration:</strong> 0–10 seconds of maximal intensity effort</li>
<li><strong>ATP yield:</strong> 1 ATP molecule per phosphocreatine molecule resynthesised</li>
<li><strong>Oxygen required:</strong> No — completely anaerobic</li>
<li><strong>By-products:</strong> Creatine and inorganic phosphate only — no lactic acid, no fatigue by-products</li>
<li><strong>Recovery:</strong> 30 seconds = ~50% PC restored; 3 minutes = ~100% PC restored (requires aerobic energy)</li>
</ul>

<p><strong>Sports examples:</strong> 100 m sprint, shot put, Olympic weightlifting, 10 m sprint in football, one repetition maximum lift, high jump.</p>

<table class="g-table"><thead><tr><th>Advantages</th><th>Disadvantages</th></tr></thead><tbody>
<tr><td>Fastest rate of ATP resynthesis</td><td>Very limited PC stores — only 8–10 seconds</td></tr>
<tr><td>No fatiguing by-products produced</td><td>Cannot sustain high-intensity effort beyond 10 seconds</td></tr>
<tr><td>Works without oxygen</td><td>Long recovery needed before full stores are restored</td></tr>
</tbody></table>`,true),

    topic('E2','Lactate system (anaerobic glycolysis / lactic acid system)', `
<p><strong>The lactate system:</strong></p>
<ul>
<li><strong>Fuel:</strong> muscle glycogen and blood glucose</li>
<li><strong>Process:</strong> glycolysis — a 10-step process in the cell cytoplasm. Glucose (6-carbon) is broken down to 2 molecules of pyruvate (3-carbon). When oxygen is insufficient (high intensity), pyruvate is converted to lactic acid (lactate + H⁺ ions)</li>
<li><strong>Duration:</strong> 10 seconds to approximately 2 minutes of high-intensity effort</li>
<li><strong>ATP yield:</strong> 2 ATP per glucose molecule (net gain after substrate cost)</li>
<li><strong>Oxygen required:</strong> No — anaerobic</li>
<li><strong>Key by-product:</strong> lactic acid → dissociates to lactate + H⁺ ions. It is the H⁺ ions (not lactate itself) that cause muscle acidosis and the burning sensation</li>
<li><strong>Fatigue mechanism:</strong> H⁺ ion accumulation lowers pH → inhibits enzyme activity (phosphofructokinase, myosin ATPase) → impairs contraction</li>
<li><strong>Recovery:</strong> lactate cleared within 30–60 minutes. In active recovery, lactate is used as fuel by slow-twitch fibres. In the liver, lactate is converted back to glucose (Cori cycle)</li>
</ul>

<p><strong>Sports examples:</strong> 400 m, 800 m run, 100 m swim, repeated sprints, high-intensity interval training.</p>

<div class="mistake-box"><div class="mistake-label">&#9888; Common mistake</div>
Students often say "lactic acid causes fatigue." More precisely: it is the <strong>H⁺ ions</strong> (produced alongside lactate) that lower pH and impair enzyme function. Lactate itself is not the primary cause of fatigue — it can actually be used as an energy source by other fibres and the heart.</div>`,true),

    topic('E3','Aerobic system — glycolysis, Krebs cycle and ETC', `
<p>The aerobic system produces the most ATP per unit of fuel but at a slower rate, making it suitable for prolonged moderate-intensity exercise.</p>

<p><strong>Three stages of aerobic energy production:</strong></p>

<p><strong>Stage 1 — Aerobic glycolysis (in the cell cytoplasm):</strong></p>
<ul>
<li>Glucose → 2 pyruvate + 2 ATP (net) + 2 NADH</li>
<li>Pyruvate → Acetyl CoA (converted by pyruvate dehydrogenase; CO₂ released)</li>
<li>Acetyl CoA enters the mitochondria for the Krebs cycle</li>
</ul>

<p><strong>Stage 2 — Krebs cycle (in the mitochondrial matrix):</strong></p>
<ul>
<li>Acetyl CoA (2C) + oxaloacetate (4C) → citrate (6C) → cycle of reactions</li>
<li>Each turn of the cycle (2 turns per glucose) produces: 1 ATP, 3 NADH, 1 FADH₂, 2 CO₂ (waste gas exhaled)</li>
<li>Total from Krebs per glucose: 2 ATP, 6 NADH, 2 FADH₂, 4 CO₂</li>
<li>NADH and FADH₂ are hydrogen carriers that transport H⁺ and electrons to the ETC</li>
</ul>

<p><strong>Stage 3 — Electron Transport Chain (on the inner mitochondrial membrane):</strong></p>
<ul>
<li>NADH and FADH₂ donate electrons to the ETC; H⁺ ions pumped across membrane (chemiosmosis)</li>
<li>O₂ is the final electron acceptor → reacts with H⁺ to form H₂O (the metabolic water produced)</li>
<li>Each NADH produces ~2.5 ATP; each FADH₂ produces ~1.5 ATP</li>
<li>Total ATP from ETC: approximately 34 ATP per glucose</li>
<li><strong>Total ATP per glucose (aerobic):</strong> ~36–38 ATP</li>
<li><strong>Compare:</strong> anaerobic glycolysis only produces 2 ATP per glucose</li>
</ul>

<p><strong>Fat oxidation (beta-oxidation):</strong></p>
<ul>
<li>Fatty acids → acetyl CoA via beta-oxidation → enters Krebs cycle</li>
<li>Very high ATP yield per molecule but requires more oxygen per ATP produced than carbohydrate</li>
<li>Slower rate of ATP production → dominant only at lower intensities (below ~60–65% VO₂max)</li>
</ul>`,true),

    topic('E4','Energy continuum, EPOC, VO₂ max and lactate threshold', `
<div class="guide-diagram">
  <canvas id="sport-energy-canvas" width="520" height="220" style="border-radius:var(--r-sm)"></canvas>
  <figcaption>Figure 5 — Energy systems continuum. All three systems work simultaneously; the dominant system shifts with intensity and duration. Example sports shown for each zone.</figcaption>
</div>

<table class="g-table"><thead><tr><th>Feature</th><th>ATP-PC</th><th>Lactate</th><th>Aerobic</th></tr></thead><tbody>
<tr><td>Duration</td><td>0–10 seconds</td><td>10 sec – ~2 minutes</td><td>2 minutes +</td></tr>
<tr><td>Intensity</td><td>Maximal</td><td>High</td><td>Moderate–low (sustained)</td></tr>
<tr><td>Fuel</td><td>Phosphocreatine</td><td>Glucose/glycogen</td><td>Glucose, glycogen, fats, (protein)</td></tr>
<tr><td>Oxygen needed?</td><td>No</td><td>No</td><td>Yes</td></tr>
<tr><td>ATP per glucose</td><td>1 per PC (not glucose)</td><td>2</td><td>~36–38</td></tr>
<tr><td>By-products</td><td>Creatine, Pi</td><td>Lactate + H⁺ ions, heat</td><td>CO₂, H₂O, heat</td></tr>
<tr><td>Fatigue cause</td><td>PC depletion</td><td>H⁺ ion accumulation → pH drop</td><td>Glycogen depletion; heat; dehydration</td></tr>
<tr><td>Recovery time</td><td>~3 minutes full PC restore</td><td>30–60 minutes full lactate removal</td><td>Glycogen: 24–48 hours (diet dependent)</td></tr>
<tr><td>Sport examples</td><td>100 m, shot put, lifts</td><td>400 m, 800 m, repeated sprints</td><td>Marathon, triathlon, 5000 m</td></tr>
</tbody></table>

<p><strong>EPOC (Excess Post-Exercise Oxygen Consumption):</strong></p>
<ul>
<li>After exercise, oxygen consumption remains elevated above resting levels — this is EPOC (previously called "oxygen debt")</li>
<li><strong>Fast component:</strong> restoring phosphocreatine stores, returning O₂ to myoglobin, removing lactate, restoring body temperature</li>
<li><strong>Slow component:</strong> replenishing glycogen stores, removing excess CO₂, returning hormones (adrenaline) to resting levels, repairing micro-tears</li>
<li>Implication: calories continue to be burned at a raised rate for hours after intense exercise (the "afterburn" effect)</li>
</ul>

<p><strong>VO₂ max:</strong></p>
<ul>
<li>The maximum rate at which the body can take up and utilise oxygen during exercise (mL O₂/kg/min)</li>
<li>Best single indicator of aerobic fitness and endurance capacity</li>
<li>Average untrained: 35–45 mL/kg/min; elite endurance athletes: 70–90 mL/kg/min</li>
<li>Limited by cardiac output (stroke volume × heart rate), O₂-carrying capacity of blood, muscle mitochondrial density</li>
<li>Training increases VO₂ max primarily by increasing max stroke volume → larger cardiac output</li>
</ul>

<p><strong>Lactate threshold (anaerobic threshold):</strong></p>
<ul>
<li>The exercise intensity at which blood lactate accumulates faster than it can be cleared</li>
<li>Untrained individuals: occurs at ~50–60% of VO₂ max</li>
<li>Trained endurance athletes: occurs at ~70–80% of VO₂ max</li>
<li>Above the threshold: lactate builds up rapidly → forces reduction in intensity</li>
<li>Training at or just below the lactate threshold raises the threshold — athletes can work at higher intensities aerobically</li>
</ul>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
Energy systems questions often ask: "Which energy system is predominantly used?" or "Explain the energy system demands." Always remember all three systems work simultaneously. State the dominant system and justify: "The ATP-PC system is dominant because the 100 m sprint lasts approximately 10 seconds at maximal intensity, within the duration and intensity range of the phosphocreatine system."</div>`,true)
  ]);

  /* ============================================================  AIM F — Interrelationships  ============================================================ */
  const aimF = aimSection('F', [
    topic('F1','How to answer 8-mark interrelationship questions', `
<p>Interrelationship questions (typically 8 marks) ask you to describe and link physiology from multiple systems in the context of a named athlete during a specific activity.</p>

<p><strong>The 8-step framework — use this structure every time:</strong></p>
<div class="formula-box">Step 1: Name the JOINT(S) involved (e.g. hip joint, knee joint)
Step 2: Name the BONES forming the joint (e.g. femur articulates with acetabulum of pelvis)
Step 3: Name the MOVEMENT occurring (e.g. hip extension, knee extension, plantarflexion)
Step 4: Name the AGONIST MUSCLE(S) (e.g. gluteus maximus, quadriceps, gastrocnemius)
Step 5: State the CONTRACTION TYPE (e.g. concentric — muscle shortening to produce force)
Step 6: Link to RESPIRATORY SYSTEM (e.g. increased breathing rate and tidal volume)
Step 7: Link to CARDIOVASCULAR SYSTEM (e.g. increased HR, SV and Q; vascular shunt)
Step 8: Link to ENERGY SYSTEM (e.g. aerobic system dominant; ATP-PC initially; Krebs and ETC)
Conclusion: Impact on PERFORMANCE (e.g. "enabling sustained sprint efforts in a 400 m race")</div>

<p><strong>Worked example answer — hip extension in a sprint (8 marks):</strong></p>
<div class="def-box"><div class="def-label">Model answer</div>
"During the push-off phase of sprinting, the hip joint (a ball and socket joint, formed by the femur articulating with the acetabulum of the pelvis) undergoes extension. The gluteus maximus acts as the agonist, contracting concentrically as it shortens to extend the hip. The hamstrings act as synergists, assisting in the movement.

Simultaneously, to meet the increased energy demands, the respiratory system increases both breathing rate (from 12 to 40+ breaths per minute) and tidal volume, significantly increasing minute ventilation. Chemoreceptors in the carotid bodies detect rising blood CO₂ and stimulate the medulla oblongata to increase ventilation rate.

The cardiovascular system responds by increasing heart rate (from 70 to 180+ bpm) and stroke volume, raising cardiac output from ~5 L/min to over 20 L/min. The vascular shunt mechanism redirects blood to the working muscles of the lower limb via vasodilation of arterioles supplying the gluteus maximus and quadriceps, and vasoconstriction of vessels to non-essential organs.

Initially the ATP-PC system predominates, utilising phosphocreatine stores for the explosive push-off phase. As the sprint continues beyond 10 seconds, the lactate system contributes significantly, with anaerobic glycolysis providing ATP from glycogen. Over longer sprints (400 m), the aerobic system via the Krebs cycle and electron transport chain contributes increasing proportions of ATP.

These coordinated responses allow Sammy to maintain high-speed running, contributing to effective sprint performance in football."</div>`,true),

    topic('F2','Physiological effects of a warm-up', `
<table class="g-table"><thead><tr><th>System</th><th>Acute effect of warm-up</th><th>Why it helps performance and safety</th></tr></thead><tbody>
<tr><td>Cardiovascular</td><td>Gradually increases HR, SV and Q; redirects blood to muscles (vascular shunt begins)</td><td>Muscles receive more O₂ before full intensity; reduces cardiac stress from sudden exertion</td></tr>
<tr><td>Respiratory</td><td>Increases breathing rate and TV; warms and humidifies inspired air</td><td>More O₂ available; reduces bronchospasm risk (important for asthma)</td></tr>
<tr><td>Muscular</td><td>Increases muscle temperature → faster enzyme activity; increases pliability of actin/myosin</td><td>Faster contraction speed; reduced risk of strains; reduced DOMS</td></tr>
<tr><td>Skeletal/joints</td><td>Increases synovial fluid production in synovial joints; increases range of motion</td><td>Reduced joint friction; improved flexibility; reduced injury risk</td></tr>
<tr><td>Energy systems</td><td>Increases rate of aerobic metabolism; lactate threshold slightly elevated</td><td>Body is "primed" for aerobic energy production; less reliance on anaerobic systems at onset</td></tr>
<tr><td>Neural</td><td>Improved nerve conduction velocity; heightened proprioceptive awareness</td><td>Faster reaction times; improved coordination and technique</td></tr>
</tbody></table>`,true),

    topic('F3','Cardiovascular-respiratory system interaction', `
<p>These two systems are completely interdependent — neither can fulfil its function without the other.</p>

<p><strong>Gas exchange — the connection point:</strong></p>
<ul>
<li>The respiratory system: brings O₂ to alveoli; removes CO₂ from alveoli</li>
<li>The cardiovascular system: pumps deoxygenated blood to pulmonary capillaries; collects O₂ and returns oxygenated blood to the left heart for systemic distribution</li>
<li>Without adequate cardiac output, even perfect lung function cannot deliver enough O₂ to working muscles</li>
<li>Without adequate ventilation, even a powerful heart cannot extract enough O₂ from the blood</li>
</ul>

<div class="formula-box">Fick's Principle:
VO₂ = Q × (CaO₂ – CvO₂)
Where:
  VO₂ = oxygen consumption (mL/min)
  Q   = cardiac output (mL/min)
  CaO₂ = arterial oxygen content (mL O₂/100mL blood)
  CvO₂ = venous oxygen content (mL O₂/100mL blood)
  (CaO₂ – CvO₂) = arterio-venous oxygen difference (a-v O₂ diff)</div>

<p><strong>This means:</strong> to increase VO₂ (and therefore exercise intensity), the body can: (1) increase cardiac output Q (higher HR × SV) and/or (2) increase oxygen extraction (widen the a-v O₂ difference via more capillaries and more mitochondria).</p>

<p><strong>Control linkage — CO₂ as the messenger:</strong></p>
<ul>
<li>Active muscles produce CO₂ → diffuses into blood → detected by chemoreceptors</li>
<li>Medulla oblongata increases breathing rate and depth → more CO₂ exhaled, more O₂ available</li>
<li>Simultaneously, medulla and sympathetic nervous system increase HR → greater cardiac output → faster CO₂ delivery to lungs</li>
<li>Both responses are triggered by the same stimulus (rising CO₂) and work synergistically</li>
</ul>`,false)
  ]);

  /* ---- Canvas drawings ---- */
  function drawLungVolumes() {
    const canvas = document.getElementById('sport-lung-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const bg = dark ? '#1e293b' : '#f0fdf4';
    const ink = dark ? '#e2e8f0' : '#1e293b';
    const accent = '#1D4ED8';

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const PAD = { l:60, r:120, t:20, b:50 };
    const cW = W - PAD.l - PAD.r;
    const cH = H - PAD.t - PAD.b;

    // Y scale: 0 = RV bottom, 5.9 L = top
    const maxL = 6.5;
    function yOf(litres) { return PAD.t + cH - (litres / maxL) * cH; }

    // Zones
    // RV: 0 to 1.2 L (grey)
    ctx.fillStyle = dark ? 'rgba(100,116,139,0.25)' : 'rgba(156,163,175,0.3)';
    ctx.fillRect(PAD.l, yOf(1.2), cW, yOf(0) - yOf(1.2));
    ctx.fillStyle = dark ? '#94a3b8' : '#374151';
    ctx.font = '9.5px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('RV 1.2L', PAD.l - 4, (yOf(0) + yOf(1.2)) / 2 + 4);

    // ERV: 1.2 to 2.4 L (light blue)
    ctx.fillStyle = dark ? 'rgba(59,130,246,0.18)' : 'rgba(191,219,254,0.5)';
    ctx.fillRect(PAD.l, yOf(2.4), cW, yOf(1.2) - yOf(2.4));
    ctx.fillStyle = dark ? '#93c5fd' : '#1d4ed8';
    ctx.fillText('ERV 1.2L', PAD.l - 4, (yOf(1.2) + yOf(2.4)) / 2 + 4);

    // Tidal breathing zone 2.4 to 2.9 L
    // IRV: 2.9 to 5.9 L (lighter)
    ctx.fillStyle = dark ? 'rgba(34,197,94,0.13)' : 'rgba(187,247,208,0.5)';
    ctx.fillRect(PAD.l, yOf(5.9), cW, yOf(2.9) - yOf(5.9));
    ctx.fillStyle = dark ? '#86efac' : '#15803d';
    ctx.fillText('IRV 3.0L', PAD.l - 4, (yOf(2.9) + yOf(5.9)) / 2 + 4);

    // Tidal volume waves
    const tvBottom = 2.4, tvTop = 2.9;
    const numBreaths = 6;
    const breathW = cW / numBreaths;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < numBreaths; i++) {
      const x0 = PAD.l + i * breathW;
      const xMid = x0 + breathW / 2;
      const x1 = x0 + breathW;
      ctx.moveTo(x0, yOf(tvBottom));
      ctx.bezierCurveTo(x0 + breathW * 0.25, yOf(tvBottom), xMid - breathW * 0.15, yOf(tvTop), xMid, yOf(tvTop));
      ctx.bezierCurveTo(xMid + breathW * 0.15, yOf(tvTop), x1 - breathW * 0.25, yOf(tvBottom), x1, yOf(tvBottom));
    }
    ctx.stroke();

    // TV bracket
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1;
    const bx = W - PAD.r + 10;
    ctx.beginPath();
    ctx.moveTo(bx, yOf(tvBottom)); ctx.lineTo(bx, yOf(tvTop));
    ctx.moveTo(bx - 4, yOf(tvBottom)); ctx.lineTo(bx + 4, yOf(tvBottom));
    ctx.moveTo(bx - 4, yOf(tvTop)); ctx.lineTo(bx + 4, yOf(tvTop));
    ctx.stroke();
    ctx.fillStyle = accent; ctx.font = 'bold 9px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('TV ~0.5L', bx + 7, (yOf(tvBottom) + yOf(tvTop)) / 2 + 4);

    // VC bracket
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5;
    const bx2 = bx + 62;
    ctx.beginPath();
    ctx.moveTo(bx2, yOf(1.2)); ctx.lineTo(bx2, yOf(5.9));
    ctx.moveTo(bx2 - 4, yOf(1.2)); ctx.lineTo(bx2 + 4, yOf(1.2));
    ctx.moveTo(bx2 - 4, yOf(5.9)); ctx.lineTo(bx2 + 4, yOf(5.9));
    ctx.stroke();
    ctx.fillStyle = '#b45309'; ctx.font = 'bold 9px system-ui';
    ctx.fillText('VC', bx2 + 6, (yOf(1.2) + yOf(5.9)) / 2 + 4);
    ctx.fillText('4.7L', bx2 + 6, (yOf(1.2) + yOf(5.9)) / 2 + 15);

    // TLC label
    ctx.fillStyle = ink; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('TLC 5.9L', PAD.l - 4, yOf(5.9) + 4);

    // Axes
    ctx.strokeStyle = ink; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(PAD.l, PAD.t); ctx.lineTo(PAD.l, H - PAD.b); ctx.lineTo(W - PAD.r, H - PAD.b);
    ctx.stroke();

    // Y labels
    ctx.fillStyle = ink; ctx.font = '9px system-ui'; ctx.textAlign = 'right';
    for (let v = 0; v <= 6; v++) {
      ctx.fillText(v + 'L', PAD.l - 4, yOf(v) + 3);
    }

    // Axis titles
    ctx.textAlign = 'center'; ctx.font = '10px system-ui';
    ctx.fillText('Time →', PAD.l + cW / 2, H - 10);
    ctx.save(); ctx.translate(14, PAD.t + cH / 2);
    ctx.rotate(-Math.PI / 2); ctx.fillText('Volume (litres)', 0, 0); ctx.restore();
  }

  function drawEnergyTimeline() {
    const canvas = document.getElementById('sport-energy-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const bg = dark ? '#1e293b' : '#f8fafc';
    const ink = dark ? '#e2e8f0' : '#1e293b';

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const PAD = { l:44, r:20, t:16, b:70 };
    const cW = W - PAD.l - PAD.r;
    const barH = 52;
    const barY = PAD.t + 8;

    // Log-scale-like timeline proportions
    // 0-10s = 8%, 10s-2min = 28%, 2min+ = 64%
    const x0 = PAD.l;
    const x1 = PAD.l + cW * 0.08;
    const x2 = PAD.l + cW * 0.36;
    const x3 = PAD.l + cW;

    // ATP-PC zone
    ctx.fillStyle = dark ? '#7c3aed88' : '#ddd6fe';
    ctx.fillRect(x0, barY, x1 - x0, barH);
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1.5;
    ctx.strokeRect(x0, barY, x1 - x0, barH);
    ctx.fillStyle = '#7c3aed'; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('ATP-PC', (x0 + x1) / 2, barY + 20);
    ctx.font = '9px system-ui';
    ctx.fillText('0–10s', (x0 + x1) / 2, barY + 33);

    // Lactate zone
    ctx.fillStyle = dark ? '#dc262688' : '#fecaca';
    ctx.fillRect(x1, barY, x2 - x1, barH);
    ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 1.5;
    ctx.strokeRect(x1, barY, x2 - x1, barH);
    ctx.fillStyle = '#dc2626'; ctx.font = 'bold 10px system-ui';
    ctx.fillText('Lactate System', (x1 + x2) / 2, barY + 20);
    ctx.font = '9px system-ui';
    ctx.fillText('10s – 2 min', (x1 + x2) / 2, barY + 33);

    // Aerobic zone
    ctx.fillStyle = dark ? '#15803d88' : '#bbf7d0';
    ctx.fillRect(x2, barY, x3 - x2, barH);
    ctx.strokeStyle = '#15803d'; ctx.lineWidth = 1.5;
    ctx.strokeRect(x2, barY, x3 - x2, barH);
    ctx.fillStyle = '#15803d'; ctx.font = 'bold 10px system-ui';
    ctx.fillText('Aerobic System', (x2 + x3) / 2, barY + 20);
    ctx.font = '9px system-ui';
    ctx.fillText('2 min → sustained', (x2 + x3) / 2, barY + 33);

    // Sport examples below bar
    ctx.fillStyle = '#7c3aed'; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('100m sprint', (x0 + x1) / 2, barY + barH + 16);
    ctx.fillText('shot put', (x0 + x1) / 2, barY + barH + 27);
    ctx.fillStyle = '#dc2626';
    ctx.fillText('400m, 800m', (x1 + x2) / 2, barY + barH + 16);
    ctx.fillText('rep sprints', (x1 + x2) / 2, barY + barH + 27);
    ctx.fillStyle = '#15803d';
    ctx.fillText('5000m, 10km', (x2 + x3) / 2, barY + barH + 16);
    ctx.fillText('marathon, triathlon', (x2 + x3) / 2, barY + barH + 27);

    // X axis
    ctx.strokeStyle = ink; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(PAD.l, H - PAD.b + 40); ctx.lineTo(W - PAD.r, H - PAD.b + 40); ctx.stroke();

    // Time markers
    const markers = [[x0,'0'],[x1,'10s'],[x2,'2 min'],[x3,'60+ min']];
    ctx.fillStyle = ink; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    markers.forEach(([x, label]) => {
      ctx.beginPath(); ctx.moveTo(x, H - PAD.b + 35); ctx.lineTo(x, H - PAD.b + 44); ctx.stroke();
      ctx.fillText(label, x, H - PAD.b + 56);
    });

    ctx.textAlign = 'center';
    ctx.fillText('Time / intensity of exercise →', PAD.l + cW / 2, H - 5);
  }

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
      <span class="guide-progress-text" id="guide-pt-sport">0 / 6 aims revised</span>
      <button class="guide-print-btn" onclick="window.print()">&#128438; Print guide</button>
    </div>
    ${buildGuideGallery()}
    ${aimA}
    ${aimB}
    ${aimC}
    ${aimD}
    ${aimE}
    ${aimF}
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
      setTimeout(() => { drawLungVolumes(); drawEnergyTimeline(); }, 50);
      return;
    }
    container.innerHTML = buildGuideHTML();
    container.dataset.built = '1';
    updateProgress();
    setupScrollSpy();
    setTimeout(() => { drawLungVolumes(); drawEnergyTimeline(); }, 100);
  };

})();
