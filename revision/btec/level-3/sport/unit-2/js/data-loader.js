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
    title: 'Lifestyle Factors and Health',
    short: 'Positive and negative factors, effects and modification',
    topics: [
      { code: 'A1', name: 'Positive lifestyle factors' },
      { code: 'A2', name: 'Negative lifestyle factors' },
      { code: 'A3', name: 'Effects on health and well-being' },
      { code: 'A4', name: 'Lifestyle modification techniques' }
    ]
  },
  B: {
    title: 'Screening Processes',
    short: 'Health and physiological tests, consent and safety',
    topics: [
      { code: 'B1', name: 'Health monitoring tests' },
      { code: 'B2', name: 'Physiological and fitness tests' },
      { code: 'B3', name: 'PAR-Q and informed consent' },
      { code: 'B4', name: 'Screening results and decisions' }
    ]
  },
  C: {
    title: 'Nutritional Needs',
    short: 'Nutrients, energy balance, hydration and supplementation',
    topics: [
      { code: 'C1', name: 'Macronutrients and micronutrients' },
      { code: 'C2', name: 'Energy balance and expenditure' },
      { code: 'C3', name: 'Hydration and performance' },
      { code: 'C4', name: 'Ergogenic aids and supplements' }
    ]
  },
  D: {
    title: 'Training Methods and Fitness',
    short: 'Components of fitness and the training methods that develop them',
    topics: [
      { code: 'D1', name: 'Physical fitness components' },
      { code: 'D2', name: 'Skill-related fitness components' },
      { code: 'D3', name: 'Training methods' },
      { code: 'D4', name: 'Principles of training (FITT)' }
    ]
  },
  E: {
    title: 'Training Programme Design',
    short: 'Programme principles, periodisation, review and adaptation',
    topics: [
      { code: 'E1', name: 'Programme design principles' },
      { code: 'E2', name: 'Periodisation and cycles' },
      { code: 'E3', name: 'Warm-up and cool-down' },
      { code: 'E4', name: 'Reviewing and adapting programmes' }
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
  A: ['physical activity', 'nutrition', 'smoking', 'alcohol consumption', 'sedentary lifestyle', 'healthy diet', 'sleep', 'stress management', 'lifestyle modification', 'blood pressure', 'BMI', 'well-being', 'obesity', 'cardiovascular disease', 'type 2 diabetes', 'self-monitoring', 'goal setting', 'support networks'],
  B: ['PAR-Q', 'informed consent', 'resting heart rate', 'blood pressure', 'body mass index', 'waist-to-hip ratio', 'peak flow', 'lung function', 'screening', 'health questionnaire', 'contraindication', 'referral', 'grip strength', 'sit-and-reach test', 'multi-stage fitness test', '30-second sit-up test', 'vertical jump', 'confidentiality'],
  C: ['carbohydrate', 'protein', 'fat', 'vitamins', 'minerals', 'fibre', 'water', 'energy balance', 'caloric intake', 'basal metabolic rate', 'thermic effect', 'dehydration', 'hydration', 'electrolytes', 'glycogen', 'glycaemic index', 'creatine', 'caffeine', 'protein shakes'],
  D: ['aerobic endurance', 'muscular strength', 'muscular endurance', 'flexibility', 'speed', 'agility', 'balance', 'coordination', 'power', 'reaction time', 'continuous training', 'interval training', 'fartlek training', 'circuit training', 'plyometrics', 'FITT principle', 'frequency', 'intensity', 'time', 'type', 'progressive overload'],
  E: ['SMART goals', 'periodisation', 'macrocycle', 'mesocycle', 'microcycle', 'warm-up', 'cool-down', 'dynamic stretching', 'static stretching', 'tapering', 'recovery', 'plateau', 'progression', 'regression', 'monitoring', 'feedback', 'adaptation principle', 'specificity']
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
    return 'Lifestyle focus: daily habits such as physical activity, nutrition and sleep affect ' + athleteObj.name + '\'s long-term health.';
  }
  if (section === 'B') {
    return 'Screening focus: resting measures and pre-participation checks inform whether ' + athleteObj.name + ' can train safely.';
  }
  if (section === 'C') {
    return 'Nutrition focus: energy intake, macronutrient balance and hydration support ' + athleteObj.name + ' in ' + athleteObj.sport + '.';
  }
  if (section === 'D') {
    return 'Training focus: the method chosen must match the fitness component being developed for ' + athleteObj.sport + '.';
  }
  return 'Programming focus: periodisation and the FITT principle shape ' + athleteObj.name + '\'s training plan across the season.';
}

const FLASHCARD_DEFINITIONS = {
  'physical activity': 'Physical activity is any movement that raises energy expenditure. Regular activity improves cardiovascular health, body composition and mental well-being.',
  nutrition: 'Nutrition is the intake of food and nutrients the body needs for energy, growth and repair. It underpins health and sporting performance.',
  smoking: 'Smoking damages the respiratory and cardiovascular systems, reduces aerobic capacity, and increases the risk of chronic diseases.',
  'alcohol consumption': 'Excessive alcohol consumption adds empty calories, impairs recovery, dehydrates the body and can damage the liver over time.',
  'sedentary lifestyle': 'A sedentary lifestyle involves long periods of inactivity. It raises the risk of obesity, cardiovascular disease and type 2 diabetes.',
  'healthy diet': 'A healthy diet provides the right balance of macronutrients and micronutrients to fuel activity, support growth and maintain health.',
  sleep: 'Sleep is the recovery period when the body repairs tissue and consolidates function. Poor sleep impairs performance and health.',
  'stress management': 'Stress management uses techniques to control stress levels, protecting mental well-being and reducing stress-related health risks.',
  'lifestyle modification': 'Lifestyle modification is the deliberate change of habits, such as increasing activity or quitting smoking, to improve health.',
  'blood pressure': 'Blood pressure is the force of blood against artery walls. Elevated levels increase the risk of heart disease and stroke.',
  bmi: 'BMI (Body Mass Index) is a measure of body mass relative to height, used as a screening tool for weight status.',
  'well-being': 'Well-being is the overall state of physical, mental and social health, not merely the absence of disease.',
  obesity: 'Obesity is excessive body fat that raises the risk of many chronic conditions, including type 2 diabetes and heart disease.',
  'cardiovascular disease': 'Cardiovascular disease affects the heart and blood vessels. Inactivity, smoking and poor diet are major risk factors.',
  'type 2 diabetes': 'Type 2 diabetes is a condition of high blood glucose linked to lifestyle. Exercise and diet help prevent and manage it.',
  'self-monitoring': 'Self-monitoring is tracking your own behaviours, such as activity or diet, to support behaviour change.',
  'goal setting': 'Goal setting is defining specific targets using the SMART framework to guide and motivate behaviour change.'  ,
  'support networks': 'Support networks are the family, friends and professionals who encourage and help maintain a healthier lifestyle.',
  'par-q': 'PAR-Q is a pre-participation physical activity readiness questionnaire that screens for health risks before exercise.',
  'informed consent': 'Informed consent is the client\u2019s permission to take part in screening or exercise, given after they understand what is involved.',
  'resting heart rate': 'Resting heart rate is the number of heartbeats per minute at rest. A lower value generally indicates better cardiovascular fitness.',
  'waist-to-hip ratio': 'Waist-to-hip ratio compares waist and hip circumference to assess body fat distribution and health risk.',
  'peak flow': 'Peak flow measures how fast air can be exhaled, used to screen respiratory function.',
  'lung function': 'Lung function describes the capacity and efficiency of the lungs, assessed by spirometry and peak flow.',
  screening: 'Screening is the process of assessing a client\u2019s health and fitness before training, to ensure safe participation.',
  'health questionnaire': 'A health questionnaire gathers medical history and lifestyle data to identify risks before exercise.',
  contraindication: 'A contraindication is a condition that makes a particular exercise or test unsafe, requiring modification or referral.',
  referral: 'Referral is directing a client to a medical professional when screening reveals a risk that needs specialist advice.',
  'grip strength': 'Grip strength is measured with a hand dynamometer to indicate general muscular strength.',
  'sit-and-reach test': 'The sit-and-reach test measures hamstring and lower back flexibility.',
  'multi-stage fitness test': 'The multi-stage fitness test (bleep test) estimates aerobic endurance through progressively faster shuttle runs.',
  '30-second sit-up test': 'The 30-second sit-up test measures abdominal muscular endurance by counting reps in 30 seconds.',
  'vertical jump': 'The vertical jump test measures leg power by recording jump height.',
  confidentiality: 'Confidentiality is keeping a client\u2019s personal screening data private and shared only with consent.',
  carbohydrate: 'Carbohydrate is the body\u2019s main energy source, stored as glycogen in muscles and liver for fuel.',
  protein: 'Protein supports muscle growth and repair. It is especially important after training.',
  fat: 'Fat is an energy source and supplies essential fatty acids, supporting cell function and hormone production.',
  vitamins: 'Vitamins are micronutrients that regulate body processes, such as energy release and immune function.',
  minerals: 'Minerals such as calcium and iron support bone health, oxygen transport and muscle function.',
  fibre: 'Fibre aids digestion and helps regulate blood glucose and cholesterol levels.',
  water: 'Water is essential for hydration, temperature regulation, nutrient transport and performance.',
  'energy balance': 'Energy balance is the relationship between energy intake (food) and expenditure. Balance maintains weight; surplus gains it; deficit loses it.',
  'caloric intake': 'Caloric intake is the total energy consumed from food and drink, measured in calories.',
  'basal metabolic rate': 'Basal metabolic rate (BMR) is the energy used at complete rest to maintain basic body functions.',
  'thermic effect': 'The thermic effect is the energy used to digest, absorb and process food.',
  dehydration: 'Dehydration is excessive water loss that impairs performance, concentration and temperature control.',
  hydration: 'Hydration is maintaining adequate fluid levels before, during and after exercise to support performance.',
  electrolytes: 'Electrolytes are minerals such as sodium and potassium that regulate fluid balance and muscle function.',
  glycogen: 'Glycogen is the stored form of carbohydrate in muscles and liver, the key fuel for exercise.',
  'glycaemic index': 'The glycaemic index ranks carbohydrate foods by how quickly they raise blood glucose.',
  creatine: 'Creatine is an ergogenic aid that supports the ATP-PC system, improving short bursts of high-intensity power.',
  caffeine: 'Caffeine is a stimulant that can reduce perceived effort and improve endurance and alertness.',
  'protein shakes': 'Protein shakes provide a convenient source of protein to support muscle repair and growth after training.',
  'aerobic endurance': 'Aerobic endurance is the ability to sustain exercise using oxygen for long periods.',
  'muscular strength': 'Muscular strength is the maximum force a muscle can exert in a single effort.',
  'muscular endurance': 'Muscular endurance is the ability of a muscle to repeat contractions without fatigue.',
  flexibility: 'Flexibility is the range of movement available at a joint.',
  speed: 'Speed is the ability to move the body or body parts quickly.',
  agility: 'Agility is the ability to change direction quickly and accurately.',
  balance: 'Balance is the ability to maintain the body\u2019s position, whether still or moving.',
  coordination: 'Coordination is the ability to use body parts smoothly and accurately together.',
  power: 'Power is the ability to apply strength quickly — the combination of strength and speed.',
  'reaction time': 'Reaction time is the time taken to respond to a stimulus.',
  'continuous training': 'Continuous training is aerobic exercise at a steady intensity for an extended period, developing aerobic endurance.',
  'interval training': 'Interval training alternates periods of high-intensity work with recovery, improving aerobic and anaerobic fitness.',
  'fartlek training': 'Fartlek training is continuous training with varied pace and intensity, combining aerobic and anaerobic work.',
  'circuit training': 'Circuit training moves through a series of exercises at stations, developing multiple fitness components.',
  plyometrics: 'Plyometrics uses explosive jumps and bounding to develop power.',
  'fitt principle': 'The FITT principle guides programme design through Frequency, Intensity, Time and Type.',
  frequency: 'Frequency is how often training occurs, e.g. days per week.',
  intensity: 'Intensity is how hard training is, e.g. % of max heart rate or load.',
  time: 'Time is the duration of each training session.',
  type: 'Type is the training method used, matched to the fitness component being developed.',
  'progressive overload': 'Progressive overload gradually increases training demand to keep driving adaptation and improvement.',
  'smart goals': 'SMART goals are Specific, Measurable, Achievable, Relevant and Time-bound, providing a clear framework for training.',
  periodisation: 'Periodisation organises training into cycles to peak at the right time and avoid overtraining.',
  macrocycle: 'A macrocycle is the longest training cycle, typically a full season or year.',
  mesocycle: 'A mesocycle is a mid-length training block, usually 4\u201312 weeks, focused on a particular goal.',
  microcycle: 'A microcycle is the shortest training cycle, usually one week.',
  'warm-up': 'A warm-up prepares the body for exercise by raising temperature and heart rate, reducing injury risk and improving performance.',
  'cool-down': 'A cool-down gradually returns the body to rest, aiding recovery and reducing muscle soreness.',
  'dynamic stretching': 'Dynamic stretching uses controlled movement through a full range, ideal during warm-up.',
  'static stretching': 'Static stretching holds a muscle in a lengthened position, typically used post-exercise.',
  tapering: 'Tapering reduces training volume before competition to allow recovery and peak performance.',
  recovery: 'Recovery is the rest and repair period that allows adaptation to training.',
  plateau: 'A plateau is a levelling-off in performance where progress stalls despite continued training.',
  progression: 'Progression is the gradual increase in training demand as the body adapts.',
  regression: 'Regression reduces training demand to match reduced ability or recovery needs.',
  monitoring: 'Monitoring tracks training and performance data to inform programme decisions.',
  feedback: 'Feedback is information on performance used to adjust and improve training.',
  'adaptation principle': 'The adaptation principle states the body adapts to training stress, improving in response to progressive overload.',
  specificity: 'Specificity means training must match the demands of the sport or goal to be effective.'
};

function flashcardBack(term) {
  const key = String(term || '').toLowerCase();
  return FLASHCARD_DEFINITIONS[key] || (term + ' is a key Sport Unit 2 term. Explain what it is, then link it to health, fitness or training-programme impact in context.');
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
    additional_guidance: 'Apply in the health, fitness or training-programme context where stated.',
    do_not_accept: section === 'B' ? 'Screening tests not named in the question.' : ''
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
      descriptor: 'Sustained, accurate analysis linked throughout to the named athlete, ending with clear impact on health, fitness or training-programme outcome.'
    }
  ];
}

function markSchemeLevels(section, idx, athleteObj, maxMark) {
  const terms = SECTION_TERMS[section];
  const bullets = [];
  for (let i = 0; i < 6; i++) {
    bullets.push('Explain ' + terms[(idx + i) % terms.length] + ' in relation to ' + athleteObj.name + ' during ' + athleteObj.sport + '.');
  }
  bullets.push('Conclude with a direct impact on health, fitness or training-programme outcome for ' + athleteObj.name + ' in ' + athleteObj.sport + '.');
  return {
    instruction: 'Use levels-based marking. Credit accurate technical terms and applied sporting context.',
    indicative_content: bullets,
    level_descriptors: levelDescriptors(maxMark),
    additional_guidance: 'Apply terms to the named athlete and sport. Impact on health, fitness or programme outcome is required for top-band marks.'
  };
}

function sectionDiagramSource(section, athleteObj) {
  const aimLabel = learningAimLabel(section);
  const map = {
    A: {
      title: 'Figure 1: Lifestyle factors and health',
      prompt: 'Use Figure 1 to identify positive and negative lifestyle factors and their effects for ' + aimLabel + '.',
      labels: ['Physical activity', 'Nutrition', 'Smoking', 'Alcohol', 'Sedentary behaviour', 'Sleep', 'Stress']
    },
    B: {
      title: 'Figure 1: Screening test results',
      prompt: 'Use Figure 1 to interpret the screening and fitness test data for ' + aimLabel + '.',
      labels: ['PAR-Q', 'Resting HR', 'Blood pressure', 'BMI', 'MSFT score', 'Sit-and-reach', 'Grip strength']
    },
    C: {
      title: 'Figure 1: Nutrition and energy balance',
      prompt: 'Use Figure 1 to reference nutrients, energy balance and hydration for ' + aimLabel + '.',
      labels: ['Carbohydrate', 'Protein', 'Fat', 'Vitamins', 'Minerals', 'Water', 'Energy balance']
    },
    D: {
      title: 'Figure 1: Fitness components and training methods',
      prompt: 'Use Figure 1 to match fitness components to training methods for ' + aimLabel + '.',
      labels: ['Aerobic endurance', 'Strength', 'Speed', 'Power', 'Flexibility', 'Agility', 'Balance']
    },
    E: {
      title: 'Figure 1: Training programme structure',
      prompt: 'Use Figure 1 to reference periodisation and the FITT principle for ' + aimLabel + '.',
      labels: ['Macrocycle', 'Mesocycle', 'Microcycle', 'Warm-up', 'Cool-down', 'FITT', 'SMART goals']
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
    text: athleteObj.name + ' is being supported as a ' + athleteObj.sport + ' performer, and their health, fitness and training data are under review.',
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
        question: 'Name ' + marks + ' key factors from ' + aimLabel + ' that are most relevant to ' + a.name + ' as a ' + a.sport + ' performer.',
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
        const weight = 60 + (i * 4);
        const height = 1.62 + (i * 0.04);
        const bmi = Math.round((weight / (height * height)) * 10) / 10;
        const age = 20 + (i * 3);
        const maxHR = 220 - age;
        const target = Math.round(maxHR * 0.7);
        out.push({
          id: makeId(section, n++),
          learning_aim: section,
          topic: section === 'D' ? 'Fitness calculations' : 'Training intensity calculations',
          command_verb: 'Calculate',
          marks: 4,
          scenario: a.name + ' is tested during ' + a.sport + ' training.',
          question: section === 'D'
            ? 'Calculate ' + a.name + '\'s Body Mass Index (BMI) using weight ' + weight + ' kg and height ' + height.toFixed(2) + ' m. State what this indicates about their weight status.'
            : 'Calculate ' + a.name + '\'s estimated maximum heart rate (age ' + age + ') and their target heart rate at 70% intensity for aerobic training. Show working.',
          source_material: section === 'D'
            ? dataTableSource(section, a, [
                ['Weight', weight + ' kg'],
                ['Height', height.toFixed(2) + ' m'],
                ['Test', 'Body Mass Index']
              ])
            : dataTableSource(section, a, [
                ['Age', age + ' years'],
                ['Target intensity', '70% of max HR'],
                ['Goal', 'Aerobic endurance']
              ]),
          mark_scheme: {
            instruction: 'Award one mark per stage of correct method and one mark for interpretation.',
            points: section === 'D'
              ? ['BMI formula weight ÷ height² shown (1)', weight + ' ÷ ' + (height * height).toFixed(2) + ' substituted (1)', bmi + ' kg/m² stated (1)', 'Correctly links value to a weight-status category (1)']
              : ['Max HR formula 220 − age shown (1)', '220 − ' + age + ' = ' + maxHR + ' bpm (1)', '70% target = ' + target + ' bpm (1)', 'Links target zone to aerobic training purpose (1)'],
            additional_guidance: 'Equivalent methods accepted if correct. Rounding to whole numbers accepted.'
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
    for (let i = 0; i < 40; i++) {
      const a = athlete((sIdx * 20) + i);
      const termA = SECTION_TERMS[section][i % SECTION_TERMS[section].length];
      const termB = SECTION_TERMS[section][(i + 2) % SECTION_TERMS[section].length];
      const termC = SECTION_TERMS[section][(i + 4) % SECTION_TERMS[section].length];
      const termD = SECTION_TERMS[section][(i + 6) % SECTION_TERMS[section].length];
      const qId = 'QZ-SPT-' + String(id++).padStart(3, '0');
      const styleIdx = i % 3;
      const questionStem = styleIdx === 0
        ? a.name + ' is performing in ' + a.sport + '. Which option best matches ' + learningAimLabel(section) + ' for this scenario?'
        : styleIdx === 1
          ? 'During a ' + a.sport + ' session, which statement is MOST accurate for ' + a.name + ' in ' + learningAimLabel(section) + '?'
          : 'Coach feedback mentions ' + learningAimLabel(section) + '. Which choice should ' + a.name + ' prioritise next?';

      if (i % 8 === 7) {
        const tfChoices = ['True', 'False'];
        const tfCorrect = (i + sIdx) % 2 === 0;
        const tfStatement = tfCorrect
          ? termA.charAt(0).toUpperCase() + termA.slice(1) + ' can directly influence performance in ' + a.sport + ' for ' + a.name + '.'
          : termA.charAt(0).toUpperCase() + termA.slice(1) + ' has no impact on performance in any sport context.';

        out.push({
          id: qId,
          learning_aim: section,
          topic: SPEC[section].title,
          type: 'true_false',
          question: tfStatement,
          source_material: section === 'C'
            ? sectionDiagramSource(section, a)
            : caseStudySource(section, a, i),
          choices: tfChoices,
          correct_index: tfCorrect ? 0 : 1,
          explanation: tfCorrect
            ? termA + ' can affect sporting outcomes when applied to the athlete, task and intensity in ' + learningAimLabel(section) + '.'
            : 'The statement is false because ' + termA + ' can influence performance depending on sport demands and athlete context.'
        });
        continue;
      }

      const rawChoices = [
        { text: 'Correct applied point: ' + termA, correct: true },
        { text: 'Distractor 1: ' + termB, correct: false },
        { text: 'Distractor 2: ' + termC, correct: false },
        { text: 'Distractor 3: ' + termD, correct: false }
      ];
      // Shuffle choices using a deterministic seed so order is stable per question
      const rng = _dlMakeRng(qId);
      const shuffled = rawChoices.slice();
      for (let k = shuffled.length - 1; k > 0; k--) {
        const j = Math.floor(rng() * (k + 1));
        [shuffled[k], shuffled[j]] = [shuffled[j], shuffled[k]];
      }
      const correct_index = shuffled.findIndex(c => c.correct);
      out.push({
        id: qId,
        learning_aim: section,
        topic: SPEC[section].title,
        type: 'mcq',
        question: questionStem,
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
