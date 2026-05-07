// BTEC Sport Unit 1 data loader
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
  const map = {
    A: {
      title: 'Figure 1: Skeletal landmarks',
      prompt: 'Use Figure 1 to identify the named bones, joints and movement ranges.',
      labels: ['Skull', 'Clavicle', 'Humerus', 'Radius/Ulna', 'Pelvis', 'Femur', 'Tibia/Fibula']
    },
    B: {
      title: 'Figure 1: Major muscle groups',
      prompt: 'Use Figure 1 to identify the prime movers and antagonists during movement.',
      labels: ['Deltoid', 'Pectoralis major', 'Biceps', 'Triceps', 'Quadriceps', 'Hamstrings', 'Gastrocnemius']
    },
    C: {
      title: 'Figure 1: Respiratory system pathway',
      prompt: 'Use Figure 1 to reference airflow and gas exchange during exercise.',
      labels: ['Nasal cavity', 'Trachea', 'Bronchi', 'Bronchioles', 'Alveoli', 'Diaphragm', 'Intercostals']
    },
    D: {
      title: 'Figure 1: Heart and circulation',
      prompt: 'Use Figure 1 to identify chambers, vessels and blood flow direction.',
      labels: ['Right atrium', 'Right ventricle', 'Pulmonary artery', 'Left atrium', 'Left ventricle', 'Aorta', 'Vena cava']
    },
    E: {
      title: 'Figure 1: Energy system contribution graph',
      prompt: 'Use Figure 1 to compare ATP-PC, lactate and aerobic contribution over time.',
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
      out.push({
        id: makeId(section, n++),
        learning_aim: section,
        topic: SPEC[section].topics[i % SPEC[section].topics.length].name,
        command_verb: i % 2 ? 'Name' : 'Label',
        marks,
        scenario: a.name + ' is preparing for ' + a.sport + ' training and reviews an anatomy diagram.',
        question: 'Name ' + marks + ' key structures from Section ' + section + ' that are most relevant to ' + a.name + ' as a ' + a.sport + ' performer.',
        source_material: sectionDiagramSource(section, a),
        mark_scheme: markSchemePoints(section, i, marks)
      });
    }

    for (let i = 0; i < 35; i++) {
      const a = athlete(100 + i + n);
      const marks = 2 + (i % 3);
      out.push({
        id: makeId(section, n++),
        learning_aim: section,
        topic: SPEC[section].topics[i % SPEC[section].topics.length].name,
        command_verb: i % 2 ? 'Explain' : 'Describe',
        marks,
        scenario: a.name + ' is competing in ' + a.sport + ' and needs to understand Section ' + section + ' concepts.',
        question: 'Explain how Section ' + section + ' knowledge could improve ' + a.name + '\'s performance in ' + a.sport + '.',
        source_material: caseStudySource(section, a, i),
        mark_scheme: markSchemePoints(section, 20 + i, marks)
      });
    }

    for (let i = 0; i < 25; i++) {
      const a = athlete(200 + i + n);
      out.push({
        id: makeId(section, n++),
        learning_aim: section,
        type: 'extended_levels',
        topic: SPEC[section].topics[i % SPEC[section].topics.length].name,
        command_verb: 'Analyse',
        marks: 6,
        scenario: a.name + ' is in a competitive ' + a.sport + ' match and performance is changing over time.',
        question: 'Analyse how Section ' + section + ' factors support or limit ' + a.name + ' during ' + a.sport + ' performance.',
        source_material: caseStudySource(section, a, 50 + i),
        mark_scheme: markSchemeLevels(section, i, a, 6)
      });
    }

    for (let i = 0; i < 10; i++) {
      const a = athlete(300 + i + n);
      out.push({
        id: makeId(section, n++),
        learning_aim: section,
        type: 'extended_levels',
        topic: SPEC[section].topics[i % SPEC[section].topics.length].name,
        command_verb: 'Evaluate',
        marks: 8,
        scenario: a.name + ' is compared across different phases of a ' + a.sport + ' performance.',
        question: 'Evaluate the interrelationships in Section ' + section + ' and their impact on ' + a.name + ' in ' + a.sport + '.',
        source_material: caseStudySource(section, a, 90 + i),
        mark_scheme: markSchemeLevels(section, 40 + i, a, 8)
      });
    }

    for (let i = 0; i < 5; i++) {
      const a = athlete(350 + i + n);
      const marks = 3 + (i % 2);
      out.push({
        id: makeId(section, n++),
        learning_aim: section,
        topic: SPEC[section].topics[i % SPEC[section].topics.length].name,
        command_verb: 'Discuss',
        marks,
        scenario: a.name + ' is reviewed by a coach after a ' + a.sport + ' performance.',
        question: 'Discuss two Section ' + section + ' factors that could improve ' + a.name + '\'s future performance in ' + a.sport + '.',
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
      out.push({
        id: 'QZ-SPT-' + String(id++).padStart(3, '0'),
        learning_aim: section,
        topic: SPEC[section].title,
        question: a.name + ' is performing in ' + a.sport + '. Which option best matches Section ' + section + ' knowledge for this scenario?',
        source_material: section === 'C'
          ? sectionDiagramSource(section, a)
          : caseStudySource(section, a, i),
        choices: [
          'Correct applied point: ' + termA,
          'Distractor 1: ' + termB,
          'Distractor 2: ' + termC,
          'Distractor 3: ' + termD
        ],
        correct_index: 0,
        explanation: termA + ' is the best match to the named athlete and sport context in Section ' + section + '.'
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
        front: 'Section ' + section + ': Define ' + t,
        back: t.charAt(0).toUpperCase() + t.slice(1) + ' explained for BTEC Sport Unit 1 with a clear link to performance impact in named athlete scenarios.'
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
