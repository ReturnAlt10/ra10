// BTEC Sport Unit 1 data loader
function _dlHashStr(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function _dlMakeRng(seed) {
  let s = (typeof seed === 'string') ? _dlHashStr(seed) : (seed | 0) || 1;
  return function() { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

const LEARNING_AIMS = ['A', 'B', 'C', 'D', 'E'];
let QUESTIONS = [];
let QUIZ = [];
let FLASHCARDS = [];
let DATA_READY = false;
const DATA_LISTENERS = [];

function onDataReady(cb) {
  if (DATA_READY) cb();
  else DATA_LISTENERS.push(cb);
}

const SPEC = {
  A: {
    title: 'The Skeletal System',
    short: 'Bones, joints, cartilage, ligaments and movement ranges',
    topics: [
      { code: 'A1', name: 'Bones of the skeleton' },
      { code: 'A2', name: 'Types and functions of bone' },
      { code: 'A3', name: 'Joint types and movement' },
      { code: 'A4', name: 'Cartilage and ligament function' }
    ]
  },
  B: {
    title: 'The Muscular System',
    short: 'Major muscles, fibre types, contractions and adaptations',
    topics: [
      { code: 'B1', name: 'Major muscles and roles' },
      { code: 'B2', name: 'Muscle fibre types' },
      { code: 'B3', name: 'Contractions and movement roles' },
      { code: 'B4', name: 'Muscular responses and adaptations' }
    ]
  },
  C: {
    title: 'The Respiratory System',
    short: 'Breathing mechanics, gas exchange and adaptations',
    topics: [
      { code: 'C1', name: 'Respiratory structures' },
      { code: 'C2', name: 'Inspiration and expiration' },
      { code: 'C3', name: 'Lung volumes and ventilation' },
      { code: 'C4', name: 'Exercise responses and adaptations' }
    ]
  },
  D: {
    title: 'The Cardiovascular System',
    short: 'Heart, blood vessels, blood and exercise adaptations',
    topics: [
      { code: 'D1', name: 'Heart structure and conduction' },
      { code: 'D2', name: 'Blood vessels and circulation' },
      { code: 'D3', name: 'Cardiac output and blood flow' },
      { code: 'D4', name: 'Exercise responses and adaptations' }
    ]
  },
  E: {
    title: 'Energy Systems',
    short: 'ATP-PC, lactate and aerobic energy contribution',
    topics: [
      { code: 'E1', name: 'ATP and ATP-PC system' },
      { code: 'E2', name: 'Lactate system' },
      { code: 'E3', name: 'Aerobic system' },
      { code: 'E4', name: 'Continuum, EPOC, VO2 max, threshold' }
    ]
  }
};

window.SPEC = SPEC;
window.LEARNING_AIMS = LEARNING_AIMS;

const ATHLETES = [
  { name: 'Steph', sport: 'netball' },
  { name: 'Nancy', sport: 'netball' },
  { name: 'Shantel', sport: 'netball goalkeeper' },
  { name: 'Robin', sport: 'tennis' },
  { name: 'Dave', sport: 'tennis' },
  { name: 'Sammy', sport: 'football' },
  { name: 'Callum', sport: 'hockey' },
  { name: 'Rhea', sport: 'hockey' },
  { name: 'Luke', sport: '1500m running' },
  { name: 'Boris', sport: 'long jump' },
  { name: 'Crystal', sport: 'endurance cycling' },
  { name: 'Marcellous', sport: '100m sprinting' },
  { name: 'Aisha', sport: 'basketball' },
  { name: 'Tariq', sport: 'rugby' },
  { name: 'Leah', sport: 'swimming' }
];

const SECTION_TERMS = {
  A: ['humerus', 'ulna', 'radius', 'femur', 'tibia', 'fibula', 'vertebrae', 'ligament', 'hyaline cartilage', 'ball and socket joint', 'hinge joint', 'flexion', 'extension', 'abduction', 'adduction', 'rotation', 'pronation', 'supination'],
  B: ['trapezius', 'deltoid', 'biceps', 'triceps', 'quadriceps', 'hamstrings', 'gastrocnemius', 'soleus', 'Type I fibres', 'Type II fibres', 'concentric', 'eccentric', 'isometric', 'agonist', 'antagonist', 'synergist', 'fixator', 'hypertrophy'],
  C: ['alveoli', 'bronchioles', 'diaphragm', 'external intercostals', 'internal intercostals', 'tidal volume', 'minute ventilation', 'vital capacity', 'medulla oblongata', 'chemoreceptors', 'oxygen uptake', 'carbon dioxide removal'],
  D: ['left ventricle', 'right atrium', 'aorta', 'pulmonary artery', 'vena cava', 'stroke volume', 'heart rate', 'cardiac output', 'capillaries', 'haemoglobin', 'vascular shunt', 'vasodilation', 'venous return', 'muscle pump'],
  E: ['ATP', 'phosphocreatine', 'ATP-PC system', 'lactate system', 'glycolysis', 'aerobic glycolysis', 'Krebs cycle', 'electron transport chain', 'EPOC', 'VO2 max', 'lactate threshold', 'energy continuum']
};

function athlete(i) {
  return ATHLETES[i % ATHLETES.length];
}

function makeId(section, n) {
  return 'SPT-' + section + '-' + String(n).padStart(3, '0');
}

function learningAimLabel(section) {
  return 'Learning Aim ' + section + ' (' + SPEC[section].title + ')';
}

function sectionSupportFact(section, athleteObj, idx) {
  if (section === 'A') {
    return 'Movement focus: knee and hip actions are key during ' + athleteObj.sport + ' performance phases.';
  }
  if (section === 'B') {
    return 'Muscle role focus: agonist-antagonist pairing changes between acceleration and control phases.';
  }
  if (section === 'C') {
    return 'Breathing focus: ventilation rate rises as intensity increases across repeated efforts.';
  }
  if (section === 'D') {
    return 'Circulation focus: heart rate and stroke volume rise to improve oxygen delivery to working muscles.';
  }
  return 'Energy focus: ATP-PC dominates early explosive actions, then aerobic contribution increases over longer efforts.';
}

const FLASHCARD_DEFINITIONS = {
  humerus: 'The humerus is the upper arm bone between the shoulder and elbow. It provides leverage for pushing, pulling and throwing actions.',
  ulna: 'The ulna is the forearm bone on the little-finger side. It helps form the elbow hinge and stabilises force transfer through the arm.',
  radius: 'The radius is the forearm bone on the thumb side. It rotates around the ulna during pronation and supination to control grip and hand position.',
  femur: 'The femur is the thigh bone and the longest, strongest bone in the body. It transmits large forces in sprinting, jumping and landing.',
  tibia: 'The tibia is the main weight-bearing shin bone. It supports load and helps transfer force from knee to ankle during movement.',
  fibula: 'The fibula is the thinner lower-leg bone on the outside of the leg. It contributes to ankle stability and muscle attachment.',
  vertebrae: 'Vertebrae are the bones of the spine. They protect the spinal cord and provide posture and trunk movement control.',
  ligament: 'A ligament is strong connective tissue joining bone to bone at a joint. It stabilises joints and limits excessive movement.',
  'hyaline cartilage': 'Hyaline cartilage covers the ends of bones in synovial joints. It reduces friction and absorbs shock during repeated impact.',
  'ball and socket joint': 'A ball and socket joint allows movement in multiple planes, including rotation. Examples include the shoulder and hip.',
  'hinge joint': 'A hinge joint mainly allows flexion and extension in one plane. Examples include the elbow and knee.',
  flexion: 'Flexion decreases the angle at a joint, such as bending the elbow during the pull phase of a movement.',

  trapezius: 'The trapezius controls scapula position and supports shoulder movement. It helps posture and arm control during upper-body actions.',
  deltoid: 'The deltoid is a major shoulder muscle responsible for abduction and assisting flexion and extension at the shoulder.',
  biceps: 'The biceps brachii flexes the elbow and assists supination. It is active in pulling and catching movements.',
  triceps: 'The triceps brachii extends the elbow. It is key for pushing actions and forceful arm extension.',
  quadriceps: 'The quadriceps extend the knee and help absorb landing forces. They are vital in sprint starts, jumps and deceleration.',
  hamstrings: 'The hamstrings flex the knee and extend the hip. They contribute to sprint mechanics and braking control.',
  gastrocnemius: 'The gastrocnemius plantarflexes the ankle and helps knee flexion. It contributes to acceleration and jumping propulsion.',
  soleus: 'The soleus plantarflexes the ankle and supports postural endurance. It is especially active in sustained running and stability.',
  'type i fibres': 'Type I fibres contract slowly, resist fatigue and use aerobic pathways efficiently, making them suitable for endurance work.',
  'type ii fibres': 'Type II fibres produce high force quickly but fatigue faster, making them suited to sprinting and explosive efforts.',
  concentric: 'A concentric contraction occurs when a muscle shortens while producing force, for example in the upward phase of a lift.',
  eccentric: 'An eccentric contraction occurs when a muscle lengthens under tension, such as controlling a landing or lowering phase.',

  alveoli: 'Alveoli are tiny air sacs where gas exchange occurs. Oxygen diffuses into blood while carbon dioxide diffuses out.',
  bronchioles: 'Bronchioles are small airways that regulate airflow distribution to alveoli. Wider airways can improve ventilation during exercise.',
  diaphragm: 'The diaphragm is the main breathing muscle. It contracts and flattens during inspiration to increase thoracic volume.',
  'external intercostals': 'External intercostals lift the rib cage during inspiration, helping increase chest volume and draw air in.',
  'internal intercostals': 'Internal intercostals assist forced expiration by pulling the ribs down and in during high-intensity effort.',
  'tidal volume': 'Tidal volume is the amount of air inhaled or exhaled in one normal breath.',
  'minute ventilation': 'Minute ventilation is total air moved per minute, calculated as tidal volume multiplied by breathing rate.',
  'vital capacity': 'Vital capacity is the maximum volume of air exhaled after a maximal inhalation, indicating ventilatory potential.',
  'medulla oblongata': 'The medulla oblongata is the respiratory control centre in the brainstem that adjusts breathing rate and depth.',
  chemoreceptors: 'Chemoreceptors detect changes in blood CO2, O2 and pH, triggering ventilatory adjustments during exercise.',
  'oxygen uptake': 'Oxygen uptake is the amount of oxygen used by the body for aerobic energy production.',
  'carbon dioxide removal': 'Carbon dioxide removal is the exhalation of metabolic CO2 to help maintain blood pH and performance.',

  'left ventricle': 'The left ventricle pumps oxygenated blood at high pressure to the body through the aorta.',
  'right atrium': 'The right atrium receives deoxygenated blood returning from the body before it passes to the right ventricle.',
  aorta: 'The aorta is the main artery carrying oxygenated blood from the left ventricle to systemic circulation.',
  'pulmonary artery': 'The pulmonary artery carries deoxygenated blood from the right ventricle to the lungs for gas exchange.',
  'vena cava': 'The vena cava returns deoxygenated blood from the body to the right atrium.',
  'stroke volume': 'Stroke volume is the amount of blood ejected by one ventricle per heartbeat.',
  'heart rate': 'Heart rate is the number of beats per minute and rises with exercise intensity.',
  'cardiac output': 'Cardiac output is total blood pumped per minute, calculated as heart rate multiplied by stroke volume.',
  capillaries: 'Capillaries are tiny vessels where exchange of gases, nutrients and waste occurs with tissues.',
  haemoglobin: 'Haemoglobin is the oxygen-carrying protein in red blood cells that supports aerobic performance.',
  'vascular shunt': 'Vascular shunt redistributes blood flow toward working muscles and away from less active organs during exercise.',
  vasodilation: 'Vasodilation widens blood vessels to increase blood flow, heat dissipation and oxygen delivery.',

  atp: 'ATP is the immediate energy molecule for muscular contraction. Stores are small and must be rapidly resynthesised.',
  phosphocreatine: 'Phosphocreatine quickly resynthesises ATP in high-intensity efforts lasting only a few seconds.',
  'atp-pc system': 'The ATP-PC system provides immediate high-power energy without oxygen for explosive, short-duration actions.',
  'lactate system': 'The lactate system breaks down glucose anaerobically to resynthesise ATP in high-intensity efforts up to about 2 minutes.',
  glycolysis: 'Glycolysis is the breakdown of glucose to release energy; it occurs in both anaerobic and aerobic pathways.',
  'aerobic glycolysis': 'Aerobic glycolysis continues glucose breakdown with oxygen present, producing more ATP at a slower rate.',
  'krebs cycle': 'The Krebs cycle is an aerobic stage in mitochondria that contributes to ATP production via electron carriers.',
  'electron transport chain': 'The electron transport chain is the final aerobic stage producing large ATP yield using oxygen as final acceptor.',
  epoc: 'EPOC is excess post-exercise oxygen consumption, where oxygen use remains elevated to restore the body after work.',
  'vo2 max': 'VO2 max is the maximum rate of oxygen uptake and use, indicating aerobic fitness capacity.',
  'lactate threshold': 'Lactate threshold is the intensity at which lactate accumulates faster than it can be cleared.',
  'energy continuum': 'The energy continuum describes how all energy systems work together, with dominance shifting by intensity and duration.'
};

function flashcardBack(term) {
  const key = String(term || '').toLowerCase();
  return FLASHCARD_DEFINITIONS[key] || (term + ' is a key Sport Unit 1 term. Explain what it is, then link it to performance impact in context.');
}

function markSchemePoints(section, idx, marks) {
  const terms = SECTION_TERMS[section];
  const picked = [];
  for (let i = 0; i < marks; i++) {
    const t = terms[(idx + i) % terms.length];
    picked.push(t.charAt(0).toUpperCase() + t.slice(1) + ' (1)');
  }
  return {
    instruction: 'Award one mark for each correct point.',
    points: picked,
    additional_guidance: 'Accept phonetic spelling. Apply in sport context where stated.',
    do_not_accept: section === 'A' ? 'Unrelated bones or movements not named in the question.' : ''
  };
}

function levelDescriptors(maxMark) {
  return [
    {
      level: 1,
      marks: maxMark === 8 ? '1-3' : '1-2',
      descriptor: 'Basic statements with limited application to the named athlete or sport.'
    },
    {
      level: 2,
      marks: maxMark === 8 ? '4-6' : '3-4',
      descriptor: 'Clear analysis with some development and relevant sport context.'
    },
    {
      level: 3,
      marks: maxMark === 8 ? '7-8' : '5-6',
      descriptor: 'Sustained, accurate analysis linked throughout to the named athlete, ending with clear impact on performance.'
    }
  ];
}

function markSchemeLevels(section, idx, athleteObj, maxMark) {
  const terms = SECTION_TERMS[section];
  const bullets = [];
  for (let i = 0; i < 6; i++) {
    bullets.push('Explain ' + terms[(idx + i) % terms.length] + ' in relation to ' + athleteObj.name + ' during ' + athleteObj.sport + '.');
  }
  bullets.push('Conclude with a direct impact on performance for ' + athleteObj.name + ' in ' + athleteObj.sport + '.');
  return {
    instruction: 'Use levels-based marking. Credit accurate technical terms and applied sporting context.',
    indicative_content: bullets,
    level_descriptors: levelDescriptors(maxMark),
    additional_guidance: 'Accept phonetic spelling for anatomy and physiology terms. Impact on performance is required for top-band marks.'
  };
}

function sectionDiagramSource(section, athleteObj) {
  const aimLabel = learningAimLabel(section);
  const map = {
    A: {
      title: 'Figure 1: Skeletal landmarks',
      prompt: 'Use Figure 1 to identify the named bones, joints and movement ranges for ' + aimLabel + '.',
      labels: ['Skull', 'Clavicle', 'Humerus', 'Radius/Ulna', 'Pelvis', 'Femur', 'Tibia/Fibula']
    },
    B: {
      title: 'Figure 1: Major muscle groups',
      prompt: 'Use Figure 1 to identify the prime movers and antagonists for ' + aimLabel + '.',
      labels: ['Deltoid', 'Pectoralis major', 'Biceps', 'Triceps', 'Quadriceps', 'Hamstrings', 'Gastrocnemius']
    },
    C: {
      title: 'Figure 1: Respiratory system pathway',
      prompt: 'Use Figure 1 to reference airflow and gas exchange for ' + aimLabel + '.',
      labels: ['Nasal cavity', 'Trachea', 'Bronchi', 'Bronchioles', 'Alveoli', 'Diaphragm', 'Intercostals']
    },
    D: {
      title: 'Figure 1: Heart and circulation',
      prompt: 'Use Figure 1 to identify chambers, vessels and blood flow direction for ' + aimLabel + '.',
      labels: ['Right atrium', 'Right ventricle', 'Pulmonary artery', 'Left atrium', 'Left ventricle', 'Aorta', 'Vena cava']
    },
    E: {
      title: 'Figure 1: Energy system contribution graph',
      prompt: 'Use Figure 1 to compare ATP-PC, lactate and aerobic contribution over time for ' + aimLabel + '.',
      labels: ['ATP-PC peak', 'Lactate rise', 'Aerobic dominance', 'EPOC window']
    }
  };
  const d = map[section] || map.A;
  return {
    type: 'diagram',
    section,
    athlete: athleteObj ? athleteObj.name : '',
    title: d.title,
    prompt: d.prompt,
    labels: d.labels
  };
}

function caseStudySource(section, athleteObj, idx) {
  const baseLoad = 58 + ((idx * 3) % 25);
  const intensity = 60 + ((idx * 7) % 36);
  const hr = 118 + ((idx * 5) % 58);
  return {
    type: 'case_study',
    section,
    title: 'Case study: ' + athleteObj.name + ' (' + athleteObj.sport + ')',
    text: athleteObj.name + ' completed repeated efforts in a ' + athleteObj.sport + ' session where performance changed across stages.',
    facts: [
      'Session load score: ' + baseLoad,
      'Average intensity index: ' + intensity + '%',
      'Peak heart rate observed: ' + hr + ' bpm',
      sectionSupportFact(section, athleteObj, idx),
      'Coach report: technique quality dropped in the final third of the session'
    ]
  };
}

function dataTableSource(section, athleteObj, rows) {
  return {
    type: 'data_table',
    section,
    title: 'Data table: ' + athleteObj.name + ' test results',
    headers: ['Measure', 'Value'],
    rows
  };
}

function buildQuestions() {
  const out = [];
  const sections = LEARNING_AIMS.slice();

  sections.forEach((section) => {
    let n = 1;

    for (let i = 0; i < 25; i++) {
      const a = athlete(i + n);
      const marks = (i % 3) + 1;
      const aimLabel = learningAimLabel(section);
      out.push({
        id: makeId(section, n++),
        learning_aim: section,
        topic: SPEC[section].topics[i % SPEC[section].topics.length].name,
        command_verb: i % 2 ? 'Name' : 'Label',
        marks,
        scenario: a.name + ' is preparing for ' + a.sport + ' training and reviews source material from ' + aimLabel + '.',
        question: 'Name ' + marks + ' key structures from ' + aimLabel + ' that are most relevant to ' + a.name + ' as a ' + a.sport + ' performer.',
        source_material: sectionDiagramSource(section, a),
        mark_scheme: markSchemePoints(section, i, marks)
      });
    }

    for (let i = 0; i < 35; i++) {
      const a = athlete(100 + i + n);
      const marks = 2 + (i % 3);
      const aimLabel = learningAimLabel(section);
      out.push({
        id: makeId(section, n++),
        learning_aim: section,
        topic: SPEC[section].topics[i % SPEC[section].topics.length].name,
        command_verb: i % 2 ? 'Explain' : 'Describe',
        marks,
        scenario: a.name + ' is competing in ' + a.sport + ' and needs to apply concepts from ' + aimLabel + '.',
        question: 'Explain how knowledge from ' + aimLabel + ' could improve ' + a.name + '\'s performance in ' + a.sport + '.',
        source_material: caseStudySource(section, a, i),
        mark_scheme: markSchemePoints(section, 20 + i, marks)
      });
    }

    for (let i = 0; i < 25; i++) {
      const a = athlete(200 + i + n);
      const aimLabel = learningAimLabel(section);
      out.push({
        id: makeId(section, n++),
        learning_aim: section,
        type: 'extended_levels',
        topic: SPEC[section].topics[i % SPEC[section].topics.length].name,
        command_verb: 'Analyse',
        marks: 6,
        scenario: a.name + ' is in a competitive ' + a.sport + ' match and performance is changing over time within ' + aimLabel + ' demands.',
        question: 'Analyse how factors in ' + aimLabel + ' support or limit ' + a.name + ' during ' + a.sport + ' performance.',
        source_material: caseStudySource(section, a, 50 + i),
        mark_scheme: markSchemeLevels(section, i, a, 6)
      });
    }

    for (let i = 0; i < 10; i++) {
      const a = athlete(300 + i + n);
      const aimLabel = learningAimLabel(section);
      out.push({
        id: makeId(section, n++),
        learning_aim: section,
        type: 'extended_levels',
        topic: SPEC[section].topics[i % SPEC[section].topics.length].name,
        command_verb: 'Evaluate',
        marks: 8,
        scenario: a.name + ' is compared across different phases of a ' + a.sport + ' performance using evidence from ' + aimLabel + '.',
        question: 'Evaluate the interrelationships in ' + aimLabel + ' and their impact on ' + a.name + ' in ' + a.sport + '.',
        source_material: caseStudySource(section, a, 90 + i),
        mark_scheme: markSchemeLevels(section, 40 + i, a, 8)
      });
    }

    for (let i = 0; i < 5; i++) {
      const a = athlete(350 + i + n);
      const marks = 3 + (i % 2);
      const aimLabel = learningAimLabel(section);
      out.push({
        id: makeId(section, n++),
        learning_aim: section,
        topic: SPEC[section].topics[i % SPEC[section].topics.length].name,
        command_verb: 'Discuss',
        marks,
        scenario: a.name + ' is reviewed by a coach after a ' + a.sport + ' performance using ' + aimLabel + ' feedback.',
        question: 'Discuss two factors from ' + aimLabel + ' that could improve ' + a.name + '\'s future performance in ' + a.sport + '.',
        source_material: caseStudySource(section, a, 130 + i),
        mark_scheme: markSchemePoints(section, 55 + i, marks)
      });
    }

    if (section === 'D' || section === 'E') {
      for (let i = 0; i < 5; i++) {
        const a = athlete(400 + i + n);
        const hr = 120 + (i * 8);
        const sv = 70 + (i * 5);
        const co = hr * sv;
        out.push({
          id: makeId(section, n++),
          learning_aim: section,
          topic: section === 'D' ? 'Cardiac output calculations' : 'Energy demand calculations',
          command_verb: 'Calculate',
          marks: 4,
          scenario: a.name + ' is tested during ' + a.sport + ' training.',
          question: section === 'D'
            ? 'Calculate cardiac output for ' + a.name + ' when heart rate is ' + hr + ' bpm and stroke volume is ' + sv + ' ml. Then state one performance implication.'
            : 'Calculate total ATP demand index for ' + a.name + ' using HR ' + hr + ' and intensity factor ' + (i + 2) + '. Show working and state one implication for energy system use.',
          source_material: section === 'D'
            ? dataTableSource(section, a, [
                ['Heart rate', hr + ' bpm'],
                ['Stroke volume', sv + ' ml'],
                ['Session type', 'Repeated high-intensity efforts']
              ])
            : dataTableSource(section, a, [
                ['Heart rate', hr + ' bpm'],
                ['Intensity factor', String(i + 2)],
                ['Work interval', (20 + i * 5) + ' s']
              ]),
          mark_scheme: {
            instruction: 'Award one mark per stage of correct method and one mark for interpretation.',
            points: section === 'D'
              ? ['Cardiac output formula HR x SV (1)', hr + ' x ' + sv + ' shown (1)', co + ' ml per minute stated (1)', 'Links value to performance demand (1)']
              : ['Shows method clearly (1)', 'Correct substitution of values (1)', 'Reasonable calculated total (1)', 'Links answer to dominant energy system and performance (1)'],
            additional_guidance: 'Accept phonetic spelling. Equivalent units accepted if method is correct.'
          }
        });
      }
    }
  });

  return out;
}

function buildQuiz() {
  const out = [];
  const sections = LEARNING_AIMS.slice();
  let id = 1;
  sections.forEach((section, sIdx) => {
    for (let i = 0; i < 15; i++) {
      const a = athlete((sIdx * 20) + i);
      const termA = SECTION_TERMS[section][i % SECTION_TERMS[section].length];
      const termB = SECTION_TERMS[section][(i + 2) % SECTION_TERMS[section].length];
      const termC = SECTION_TERMS[section][(i + 4) % SECTION_TERMS[section].length];
      const termD = SECTION_TERMS[section][(i + 6) % SECTION_TERMS[section].length];
      const rawChoices = [
        { text: 'Correct applied point: ' + termA, correct: true },
        { text: 'Distractor 1: ' + termB, correct: false },
        { text: 'Distractor 2: ' + termC, correct: false },
        { text: 'Distractor 3: ' + termD, correct: false }
      ];
      // Shuffle choices using a deterministic seed so order is stable per question
      const rng = _dlMakeRng('QZ-SPT-' + String(id).padStart(3, '0'));
      const shuffled = rawChoices.slice();
      for (let k = shuffled.length - 1; k > 0; k--) {
        const j = Math.floor(rng() * (k + 1));
        [shuffled[k], shuffled[j]] = [shuffled[j], shuffled[k]];
      }
      const correct_index = shuffled.findIndex(c => c.correct);
      out.push({
        id: 'QZ-SPT-' + String(id++).padStart(3, '0'),
        learning_aim: section,
        topic: SPEC[section].title,
        question: a.name + ' is performing in ' + a.sport + '. Which option best matches ' + learningAimLabel(section) + ' for this scenario?',
        source_material: section === 'C'
          ? sectionDiagramSource(section, a)
          : caseStudySource(section, a, i),
        choices: shuffled.map(c => c.text),
        correct_index: correct_index,
        explanation: termA + ' is the best match to the named athlete and sport context in ' + learningAimLabel(section) + '.'
      });
    }
  });
  return out;
}

function buildFlashcards() {
  const out = [];
  const sections = LEARNING_AIMS.slice();
  let id = 1;
  sections.forEach((section) => {
    for (let i = 0; i < 12; i++) {
      const t = SECTION_TERMS[section][i % SECTION_TERMS[section].length];
      out.push({
        id: 'FC-SPT-' + String(id++).padStart(3, '0'),
        learning_aim: section,
        front: learningAimLabel(section) + ': Define ' + t,
        back: flashcardBack(t)
      });
    }
  });
  return out;
}

(function loadData() {
  try {
    QUESTIONS = buildQuestions();
    QUIZ = buildQuiz();
    FLASHCARDS = buildFlashcards();
    DATA_READY = true;
    window.QUESTIONS = QUESTIONS;
    window.QUIZ = QUIZ;
    window.FLASHCARDS = FLASHCARDS;
    window.DATA_READY = DATA_READY;
    window.onDataReady = onDataReady;
    console.log('Loaded ' + QUESTIONS.length + ' sport questions, ' + QUIZ.length + ' quiz items, ' + FLASHCARDS.length + ' flashcards');
    DATA_LISTENERS.forEach(function(cb) { cb(); });
  } catch (err) {
    console.error('Sport data load failed:', err);
    QUESTIONS = [];
    QUIZ = [];
    FLASHCARDS = [];
    DATA_READY = true;
    window.QUESTIONS = QUESTIONS;
    window.QUIZ = QUIZ;
    window.FLASHCARDS = FLASHCARDS;
    window.DATA_READY = DATA_READY;
    window.onDataReady = onDataReady;
    DATA_LISTENERS.forEach(function(cb) { cb(); });
  }
})();
