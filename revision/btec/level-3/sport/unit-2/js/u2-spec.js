/* BTEC Level 3 Sport — Unit 2: Fitness Training and Programming for Health, Sport and Well-being (31525H)
   Shared specification map, normative data and interpretation helpers.
   Used by the question bank (data-loader.js), the case studies (u2-cases.js) and the revision guide (guide.js). */
(function () {
  'use strict';

  // Learning aims, content areas and codes exactly as the Pearson BTEC Nationals Sport Unit 2 essential content (spec Issue 9).
  const SPEC = {
    A: {
      title: 'Examine lifestyle factors and their effect on health and well-being',
      short: 'Positive and negative lifestyle factors, their effects, and lifestyle modification techniques',
      topics: [
        { code: 'A1', name: 'Positive lifestyle factors and their effects on health and well-being' },
        { code: 'A1.1', name: 'Exercise/physical activity (physical, chronic disease, psychological, social, economic)' },
        { code: 'A1.2', name: 'Balanced diet (eatwell plate, benefits, fluid intake, strategies)' },
        { code: 'A1.3', name: 'Positive risk-taking activities' },
        { code: 'A1.4', name: 'Government recommendations/guidelines' },
        { code: 'A2', name: 'Negative lifestyle factors and their effects on health and well-being' },
        { code: 'A2.1', name: 'Smoking' },
        { code: 'A2.2', name: 'Alcohol' },
        { code: 'A2.3', name: 'Stress' },
        { code: 'A2.4', name: 'Sleep' },
        { code: 'A2.5', name: 'Sedentary lifestyle' },
        { code: 'A3', name: 'Lifestyle modification techniques' },
        { code: 'A3.1', name: 'Common barriers to change' },
        { code: 'A3.2', name: 'Strategies to increase physical activity levels' },
        { code: 'A3.3', name: 'Smoking cessation strategies' },
        { code: 'A3.4', name: 'Strategies to reduce alcohol consumption' },
        { code: 'A3.5', name: 'Stress management techniques' }
      ]
    },
    B: {
      title: 'Understand the screening processes for training programming',
      short: 'Screening questionnaires, legal considerations, health monitoring tests and interpreting results',
      topics: [
        { code: 'B1', name: 'Screening processes' },
        { code: 'B1.1', name: 'Screening questionnaires (lifestyle questionnaire, PAR-Q)' },
        { code: 'B1.2', name: 'Legal considerations (informed consent, data protection, client confidentiality)' },
        { code: 'B2', name: 'Health monitoring tests' },
        { code: 'B2.1', name: 'Blood pressure' },
        { code: 'B2.2', name: 'Resting heart rate' },
        { code: 'B2.3', name: 'Body mass index (BMI)' },
        { code: 'B2.4', name: 'Waist to hip ratio' },
        { code: 'B3', name: 'Interpreting the results of health monitoring tests' }
      ]
    },
    C: {
      title: 'Understand programme-related nutritional needs',
      short: 'Nutritional terminology, a balanced diet, hydration and nutritional strategies',
      topics: [
        { code: 'C1', name: 'Common terminology (RDA, energy measures, energy balance)' },
        { code: 'C2', name: 'Components of a balanced diet' },
        { code: 'C2.1', name: 'Macronutrients (carbohydrates, fats, protein)' },
        { code: 'C2.2', name: 'Micronutrients (vitamins A, B, C, D; calcium, iron)' },
        { code: 'C2.3', name: 'Hydration, dehydration and hyperhydration' },
        { code: 'C3', name: 'Nutritional strategies for individuals taking part in training programmes' },
        { code: 'C3.1', name: 'Adapting diet to gain or lose weight' },
        { code: 'C3.2', name: 'Ergogenic aids (energy gels and bars, protein drinks, carbohydrate loading)' },
        { code: 'C3.3', name: 'Sports drinks (isotonic, hypertonic, hypotonic)' }
      ]
    },
    D: {
      title: 'Examine training methods for different components of fitness',
      short: 'Physical and skill-related components of fitness and the training methods for each',
      topics: [
        { code: 'D1', name: 'Components of fitness to be trained (physical fitness)' },
        { code: 'D1.1', name: 'Skill-related fitness' },
        { code: 'D2', name: 'Training methods for physical fitness-related components' },
        { code: 'D2.1', name: 'Aerobic endurance training methods' },
        { code: 'D2.2', name: 'Muscular strength training methods' },
        { code: 'D2.3', name: 'Muscular endurance training methods' },
        { code: 'D2.4', name: 'Core stability training methods' },
        { code: 'D2.5', name: 'Flexibility training methods' },
        { code: 'D2.6', name: 'Speed training methods' },
        { code: 'D3', name: 'Training methods for skill-related fitness components' },
        { code: 'D3.1', name: 'Agility training methods' },
        { code: 'D3.2', name: 'Balance training methods' },
        { code: 'D3.3', name: 'Coordination training methods' },
        { code: 'D3.4', name: 'Reaction time training methods' },
        { code: 'D3.5', name: 'Power training methods' }
      ]
    },
    E: {
      title: 'Understand training programme design',
      short: 'Aims, objectives, SMARTER goals, resources, FITT and principles of training, periodisation',
      topics: [
        { code: 'E1', name: 'Principles of fitness training programme design' },
        { code: 'E1.1', name: 'Aims, objectives, personal goals (SMARTER) and resources' },
        { code: 'E1.2', name: 'Principles of training: FITT' },
        { code: 'E1.3', name: 'Additional principles of training' },
        { code: 'E1.4', name: 'Periodisation (macrocycle, mesocycle, microcycle)' }
      ]
    }
  };

  /* ── Normative data ───────────────────────────────────────────────── */
  const NORMS = {
    bp: [
      // British Hypertension Society / ESH classification used in most BTEC texts.
      { label: 'Low (hypotension)', sys: [0, 89], dia: [0, 59], risk: 'may cause dizziness or fainting; check with a GP if symptomatic' },
      { label: 'Optimal', sys: [90, 119], dia: [60, 79], risk: 'lowest risk of cardiovascular disease' },
      { label: 'Normal', sys: [120, 129], dia: [80, 84], risk: 'healthy range' },
      { label: 'High normal', sys: [130, 139], dia: [85, 89], risk: 'above ideal; lifestyle changes advised to stop it rising' },
      { label: 'Grade 1 (mild) hypertension', sys: [140, 159], dia: [90, 99], risk: 'raised risk of coronary heart disease (CHD), stroke and kidney disease; GP monitoring advised' },
      { label: 'Grade 2 (moderate) hypertension', sys: [160, 179], dia: [100, 109], risk: 'high risk of CHD, heart attack and stroke; GP referral before training' },
      { label: 'Grade 3 (severe) hypertension', sys: [180, 400], dia: [110, 300], risk: 'very high risk; must not exercise until medically cleared' }
    ],
    rhr: [
      { label: 'Excellent / athletic', max: 59, note: 'typical of trained athletes (sports-heart adaptation: larger stroke volume)' },
      { label: 'Good', max: 69, note: 'good cardiovascular fitness' },
      { label: 'Average', max: 79, note: 'average for the population; room to improve aerobic fitness' },
      { label: 'Below average', max: 89, note: 'suggests poor aerobic fitness; the heart works harder at rest' },
      { label: 'Poor', max: 100, note: 'poor cardiovascular fitness; often linked to inactivity, stress, smoking or caffeine' },
      { label: 'High (tachycardia)', max: 400, note: 'above 100 bpm at rest — refer to a GP before training' }
    ],
    bmi: [
      { label: 'Underweight', max: 18.4, risk: 'risk of low energy availability, weakened immunity, low bone density and fatigue' },
      { label: 'Healthy weight', max: 24.9, risk: 'lowest weight-related health risk' },
      { label: 'Overweight', max: 29.9, risk: 'increased risk of CHD, hypertension and type 2 diabetes' },
      { label: 'Obese (class I)', max: 34.9, risk: 'high risk of CHD, type 2 diabetes, hypertension, joint problems' },
      { label: 'Obese (class II)', max: 39.9, risk: 'very high risk of CHD, type 2 diabetes, stroke, some cancers and joint damage' },
      { label: 'Severely obese (class III)', max: 999, risk: 'extremely high risk of chronic disease and early death; GP-led programme needed' }
    ],
    whr: {
      // Risk of health problems from central (abdominal) fat.
      male: [{ label: 'Low risk', max: 0.95 }, { label: 'Moderate risk', max: 1.0 }, { label: 'High risk', max: 99 }],
      female: [{ label: 'Low risk', max: 0.80 }, { label: 'Moderate risk', max: 0.85 }, { label: 'High risk', max: 99 }]
    },
    guidelines: {
      alcoholUnits: 14,
      sleepAdult: [7, 9],
      sleepTeen: [8, 10],
      paChild: '60 minutes of moderate-to-vigorous activity a day on average across the week',
      paAdult: '150 minutes of moderate or 75 minutes of vigorous activity a week, plus strength activities on 2+ days',
      paOlder: 'as adults, plus activities to improve balance and flexibility on 2+ days and breaking up long periods of sitting',
      kcalFemale: 2000,
      kcalMale: 2500,
      waterDaily: '6–8 glasses (about 1.5–2 litres) a day, more when training or in hot weather'
    }
  };

  function bandFor(list, v, key) {
    for (const b of list) if (v <= b[key]) return b;
    return list[list.length - 1];
  }

  function bpCategory(sys, dia) {
    const idx = (val, k) => NORMS.bp.findIndex(b => val >= b[k][0] && val <= b[k][1]);
    const i = Math.max(idx(sys, 'sys'), idx(dia, 'dia'));
    return NORMS.bp[i < 0 ? 1 : i];
  }
  function rhrCategory(rhr) { return bandFor(NORMS.rhr, rhr, 'max'); }
  function bmiCategory(bmi) { return bandFor(NORMS.bmi, bmi, 'max'); }
  function whrCategory(whr, sex) { return bandFor(NORMS.whr[sex === 'F' ? 'female' : 'male'], whr, 'max'); }
  function maxHr(age) { return 220 - age; }
  function hrAt(age, pct) { return Math.round(maxHr(age) * pct / 100); }
  function karvonen(age, rhr, pct) { return Math.round((maxHr(age) - rhr) * pct / 100 + rhr); }

  /* ── Components of fitness → spec training methods ───────────────── */
  // Definitions follow the Unit 2 specification wording (D1, D1.1); methods follow D2.1–D3.5.
  const COMPONENTS = {
    'Aerobic endurance': { type: 'physical', def: 'The ability of the cardiorespiratory system to work efficiently, supplying nutrients and oxygen to working muscles during sustained physical activity.', methods: ['Continuous training (steady pace, moderate intensity, minimum 30 minutes)', 'Fartlek training (varied speeds or terrains)', 'Interval training (work period followed by a rest or recovery period)', 'Circuit training (aerobic stations)'], test: 'Multi-stage fitness test, Cooper 12-minute run' },
    'Muscular strength': { type: 'physical', def: 'The maximum force (in kg or N) that can be generated by a muscle or muscle group.', methods: ['Free weights (low repetitions, high loads; pyramid sets)', 'Fixed resistance machines (low repetitions, high loads)'], test: '1RM, grip dynamometer' },
    'Muscular endurance': { type: 'physical', def: 'The ability of the muscular system to work efficiently, where a muscle can continue contracting over a period of time against a light to moderate fixed resistance load.', methods: ['Circuit training', 'Fixed resistance machines (high repetitions, low loads)', 'Free weights (high repetitions, low loads)', 'Resistance bands/tubing'], test: 'One-minute press-up / sit-up tests' },
    'Flexibility': { type: 'physical', def: 'Having an adequate range of motion in all joints of the body; the ability to move a joint fluidly through its complete range of movement.', methods: ['Static stretching (active and passive)', 'PNF (proprioceptive neuromuscular facilitation) stretching'], test: 'Sit and reach' },
    'Speed': { type: 'physical', def: 'The ability to move the whole body quickly or move limbs rapidly.', methods: ['Acceleration sprints', 'Hollow sprints', 'Interval training (with recovery between sets)', 'Resistance drills (hill runs, parachutes, sleds, bungee ropes)'], test: '20–60 m sprint' },
    'Body composition': { type: 'physical', def: 'The relative ratio of fat to fat-free mass (vital organs, muscle, bone) in the body.', methods: ['Aerobic endurance methods (continuous, fartlek, interval, circuit) to burn fat', 'Resistance training (free weights, fixed resistance machines) to maintain lean mass'], test: 'Skinfold calipers, bioelectrical impedance' },
    'Core stability': { type: 'physical (training methods D2.4)', def: 'Strength and control of the trunk muscles that stabilise the spine and pelvis and transfer force between the upper and lower body.', methods: ['Gym-based core exercises (plank, bridge, V-sit)', 'Pilates', 'Yoga', 'Stability ball, kettlebell and resistance band exercises'], test: 'Sport England core stability test' },
    'Agility': { type: 'skill-related', def: 'The ability of a sports performer to quickly and precisely move or change direction without losing balance or time.', methods: ['SAQ (speed, agility, quickness) training', 'Sport-specific agility drills'], test: 'Illinois agility run, T-test' },
    'Balance': { type: 'skill-related', def: 'Static and dynamic balance — the ability to maintain centre of mass over a base of support.', methods: ['Static balance exercises (centre of mass over base of support when stationary)', 'Dynamic balance exercises (when moving) on stable and unstable surfaces'], test: 'Stork stand test' },
    'Coordination': { type: 'skill-related', def: 'The ability to control movement of two or more body parts, smoothly and efficiently, to perform a motor task.', methods: ['Sport-specific coordination activities using two or more body parts together'], test: 'Wall-toss test' },
    'Reaction time': { type: 'skill-related', def: 'The time taken for a sports performer to respond to a stimulus and the initiation of their response.', methods: ['Reaction drills in response to an external stimulus (whistle, visual/auditory stimulus, reaction ball)'], test: 'Ruler drop test' },
    'Power': { type: 'skill-related', def: 'The ability to produce a maximal force in the shortest period of time possible.', methods: ['Plyometrics specific to the sport (bounding, hopping, box jumps, hurdle jumps, medicine ball throws)'], test: 'Vertical jump, standing long jump' }
  };

  const PRINCIPLES = {
    'FITT': 'Frequency (sessions per week), Intensity (how hard — %MHR/bpm, RPE or %1RM), Time (duration, or sets × reps) and Type (the training method).',
    'Specificity': 'Training must be matched to the needs of the sport, activity or client goal so the right energy systems, muscles and components improve.',
    'Overload': 'Progressively increasing the training load beyond what the body is used to (by raising frequency, intensity or time) so that fitness keeps improving; increases should be gradual (around 10% a week).',
    'Progression': 'Starting at the client’s current level and increasing demand step by step as fitness improves, avoiding injury and drop-out.',
    'Individual needs': 'The programme is tailored to the client’s age, fitness, health, goals, injuries, commitments and preferences.',
    'Adaptation': 'The body’s physiological changes in response to training (e.g. stronger heart, lower RHR, more capillaries, bigger muscles); adaptation happens during recovery.',
    'Reversibility': '“Use it or lose it” — gains are lost if training stops or is reduced (aerobic gains drop within a few weeks), so the programme must keep the client training regularly.',
    'Variation': 'Changing methods, exercises and environments to maintain motivation, avoid boredom and plateaus, and reduce overuse injuries.',
    'Rest and recovery': 'Time for the body to repair and adapt; prevents overtraining and injury (e.g. 24–48 hours between hard sessions of the same muscle group, at least one full rest day a week).'
  };

  const API = { SPEC, NORMS, COMPONENTS, PRINCIPLES, bpCategory, rhrCategory, bmiCategory, whrCategory, maxHr, hrAt, karvonen };
  window.U2 = Object.assign(window.U2 || {}, API);
  window.SPEC = SPEC;
  window.LEARNING_AIMS = ['A', 'B', 'C', 'D', 'E'];
})();
