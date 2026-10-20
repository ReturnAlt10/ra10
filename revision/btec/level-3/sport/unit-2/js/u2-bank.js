/* BTEC Sport Unit 2 — knowledge-check questions, calculation questions, MCQ quiz and flashcards.
   Short questions build the knowledge needed for the set task; the six set-task activities live in u2-cases.js. */
(function () {
  'use strict';
  const U2 = window.U2;

  /* ── Knowledge-check questions ─────────────────────────────────────── */
  const KNOWLEDGE = [];
  let kn = 0;
  function K(aim, topic, verb, marks, question, points, extra) {
    kn++;
    KNOWLEDGE.push(Object.assign({
      id: 'KC-' + aim + '-' + String(kn).padStart(3, '0'),
      learning_aim: aim, topic, command_verb: verb, marks, question, origin: 'knowledge', spec_code: '31525H',
      mark_scheme: { instruction: marks === 1 ? 'Award one mark for a correct answer.' : 'Award one mark for each correct point, up to ' + marks + ' marks.', points: points.map(p => /\(\d\)$/.test(p) ? p : p + ' (1)') }
    }, extra || {}));
  }
  const MS = (dna, guid) => ({ do_not_accept: dna, additional_guidance: guid });

  // A1 Positive lifestyle factors
  K('A', 'Government recommendations/guidelines', 'State', 2, 'State the UK physical activity guidelines for adults aged 19–64.', ['At least 150 minutes of moderate-intensity activity a week (or 75 minutes of vigorous activity, or a combination)', 'Strength/muscle-strengthening activities on at least 2 days a week', 'Minimise time spent sedentary / break up long periods of sitting']);
  K('A', 'Government recommendations/guidelines', 'State', 1, 'State the UK physical activity guideline for children and young people aged 5–18.', ['An average of at least 60 minutes of moderate-to-vigorous physical activity a day across the week']);
  K('A', 'Government recommendations/guidelines', 'Identify', 2, 'Identify two additional recommendations in the physical activity guidelines for adults aged 65 and over.', ['Activities to improve balance (to reduce the risk of falls)', 'Activities to improve flexibility', 'Strength activities on at least 2 days a week', 'Break up prolonged periods of sitting with light activity']);
  K('A', 'Exercise/physical activity (physical, chronic disease, psychological, social, economic)', 'Describe', 3, 'Describe three physical health benefits of regular physical activity.', ['Reduced risk of coronary heart disease (stronger heart, lower BP)', 'Reduced risk of type 2 diabetes (improved insulin sensitivity / blood glucose control)', 'Reduced risk of obesity (burns calories / improves body composition)', 'Reduced risk of osteoporosis (weight-bearing activity increases bone density)', 'Reduced risk of some cancers (e.g. colon, breast)', 'Lower resting heart rate and blood pressure', 'Improved cholesterol profile (higher HDL, lower LDL)']);
  K('A', 'Exercise/physical activity (physical, chronic disease, psychological, social, economic)', 'Explain', 2, 'Explain one psychological benefit of regular physical activity.', ['Reduces stress, anxiety or depression / improves mood', 'because exercise releases endorphins (feel-good hormones) / reduces cortisol (1)']);
  K('A', 'Exercise/physical activity (physical, chronic disease, psychological, social, economic)', 'Give', 2, 'Give two social benefits of taking part in physical activity.', ['Meeting new people / making friends', 'Reduced social isolation/loneliness', 'Developing teamwork and communication', 'Sense of belonging to a club or group']);
  K('A', 'Balanced diet (eatwell plate, benefits, fluid intake, strategies)', 'State', 1, 'State the recommended amount of sleep per night for adults.', ['7–9 hours']);
  K('A', 'Balanced diet (eatwell plate, benefits, fluid intake, strategies)', 'Explain', 2, 'Explain why sufficient sleep is important for someone following a fitness training programme.', ['Sleep is when the body repairs and adapts to training (growth hormone release / muscle repair)', 'so recovery is better, reducing fatigue and injury risk and allowing progress (1)']);
  // A2 Negative lifestyle factors
  K('A', 'Smoking', 'Explain', 2, 'Explain how carbon monoxide in cigarette smoke affects aerobic performance.', ['Carbon monoxide binds to haemoglobin (more readily than oxygen) forming carboxyhaemoglobin', 'so less oxygen is transported to the working muscles, reducing aerobic endurance (1)'], MS('Answers about tar or nicotine', ''));
  K('A', 'Smoking', 'Identify', 3, 'Identify three long-term health effects of smoking.', ['Lung cancer (and cancers of mouth/throat)', 'Coronary heart disease / heart attack', 'Stroke', 'Chronic obstructive pulmonary disease (COPD) / emphysema / chronic bronchitis', 'High blood pressure / atherosclerosis']);
  K('A', 'Smoking', 'Describe', 2, 'Describe the effect of nicotine on the cardiovascular system.', ['Nicotine is a stimulant that increases heart rate and blood pressure', 'Causes vasoconstriction (narrowing of blood vessels) / increases risk of blood clots (1)']);
  K('A', 'Alcohol', 'State', 2, 'State the UK Chief Medical Officers’ guideline for alcohol consumption.', ['No more than 14 units a week for both men and women', 'Spread over 3 or more days / with several drink-free days']);
  K('A', 'Alcohol', 'Explain', 2, 'Explain why excessive alcohol consumption can lead to weight gain.', ['Alcohol contains 7 kcal per gram (“empty calories” with no nutritional value)', 'adding to energy intake and creating an energy surplus, which is stored as fat (1)']);
  K('A', 'Alcohol', 'Identify', 3, 'Identify three long-term health effects of drinking more than the recommended amount of alcohol.', ['Liver disease (fatty liver, cirrhosis)', 'High blood pressure / stroke / CHD', 'Cancers (mouth, throat, liver, breast, bowel)', 'Brain damage / memory problems', 'Depression and anxiety', 'Dependence / alcoholism']);
  K('A', 'Alcohol', 'Explain', 2, 'Explain one way alcohol can affect recovery after training.', ['Alcohol is a diuretic, causing dehydration', 'which slows recovery/rehydration and impairs performance in the next session (1)', 'Alternatively: disrupts sleep quality / reduces muscle protein synthesis, slowing repair (1)']);
  K('A', 'Stress', 'Describe', 3, 'Describe three symptoms of stress.', ['Physiological: increased heart rate / blood pressure / sweating / headaches / muscle tension', 'Psychological: anxiety, irritability, poor concentration, low mood', 'Behavioural: poor sleep, comfort eating, increased smoking or drinking']);
  K('A', 'Stress', 'Explain', 2, 'Explain how long-term stress can increase the risk of coronary heart disease.', ['Stress releases adrenaline and cortisol, raising heart rate and blood pressure', 'over time this leads to hypertension / damage to artery walls, increasing CHD risk (1)', 'Also accept: stress leads to smoking, drinking or comfort eating, which increase CHD risk (1)']);
  K('A', 'Sleep', 'Describe', 3, 'Describe three effects of insufficient sleep on health and well-being.', ['Fatigue and poor concentration / slower reaction time', 'Impaired recovery and adaptation from training', 'Weight gain (appetite hormones disrupted — more ghrelin, less leptin)', 'Weakened immune system', 'Low mood / increased stress and anxiety', 'Increased risk of hypertension, obesity and type 2 diabetes']);
  K('A', 'Sedentary lifestyle', 'Describe', 2, 'Describe what is meant by a sedentary lifestyle and one health effect.', ['A lifestyle with little or no physical activity / long periods of sitting or lying (e.g. desk job, driving, screen time)', 'Increases risk of obesity / CHD / type 2 diabetes / osteoporosis / back pain / poor posture (1)']);
  K('A', 'Balanced diet (eatwell plate, benefits, fluid intake, strategies)', 'Explain', 2, 'Explain how a diet high in saturated fat can affect health.', ['Saturated fat raises LDL (“bad”) cholesterol', 'which builds up in artery walls (atherosclerosis), increasing the risk of CHD, heart attack and stroke (1)']);
  K('A', 'Balanced diet (eatwell plate, benefits, fluid intake, strategies)', 'Explain', 2, 'Explain why a diet high in salt is a risk to health.', ['Salt (sodium) causes the body to retain water, increasing blood volume', 'raising blood pressure (hypertension) and the risk of stroke/CHD (1)']);
  // A3 Lifestyle modification
  K('A', 'Strategies to increase physical activity levels', 'Give', 3, 'Give three strategies to increase the physical activity levels of an office worker.', ['At home — home workouts, exercise apps, active chores', 'At work — stairs, walking meetings, breaks from sitting, lunchtime walk', 'During leisure time — join a club, class, walking group or parkrun', 'Method of transport — walk or cycle to work, get off the bus a stop early']);
  K('A', 'Smoking cessation strategies', 'Identify', 3, 'Identify three smoking cessation techniques.', ['NHS smoking services', 'NHS smoking helpline', 'Nicotine replacement therapy (patches, gum, lozenges, inhalator, spray)', 'Quit Kit support packs', 'Acupuncture']);
  K('A', 'Smoking cessation strategies', 'Explain', 2, 'Explain how nicotine replacement therapy helps a person stop smoking.', ['It provides a controlled dose of nicotine without the tar and carbon monoxide', 'reducing withdrawal symptoms and cravings so the person can break the habit, and the dose is reduced gradually (1)']);
  K('A', 'Strategies to reduce alcohol consumption', 'Give', 3, 'Give three techniques to help a client reduce their alcohol intake.', ['Counselling', 'Self-help groups (e.g. Alcoholics Anonymous)', 'Alternative treatments (e.g. acupuncture, hypnotherapy)', 'Drink diary / drink-free days / lower-strength drinks (practical support)']);
  K('A', 'Stress management techniques', 'Describe', 3, 'Describe three stress management techniques.', ['Assertiveness training — learning to say no and express needs calmly', 'Goal setting / time management — prioritising tasks and realistic deadlines', 'Physical activity — releases endorphins', 'Positive self-talk — replacing negative thoughts', 'Relaxation / breathing techniques / meditation', 'Alternative therapies (e.g. massage, aromatherapy)', 'Changes to work-life balance']);
  K('A', 'Stress management techniques', 'Explain', 2, 'Explain how progressive muscular relaxation reduces stress.', ['The client tenses and then relaxes each muscle group in turn', 'learning to recognise and release muscle tension, which lowers heart rate/anxiety and calms the body (1)']);
  K('A', 'Common barriers to change', 'Identify', 3, 'Identify three barriers to changing lifestyle behaviours.', ['Time (work/family commitments)', 'Cost (memberships, equipment, travel)', 'Transport (no car / poor public transport)', 'Location (facilities not close to home or work)']);
  K('A', 'Common barriers to change', 'Describe', 4, 'Describe the stages of the stages of change (transtheoretical) model.', ['Pre-contemplation — not considering change', 'Contemplation — thinking about changing in the near future', 'Preparation — getting ready / making a plan', 'Action — actively making the change', 'Maintenance — sustaining the change for 6+ months (relapse may occur)']);

  // B1 Screening questionnaires
  K('B', 'Screening questionnaires (lifestyle questionnaire, PAR-Q)', 'State', 1, 'State what PAR-Q stands for.', ['Physical Activity Readiness Questionnaire']);
  K('B', 'Screening questionnaires (lifestyle questionnaire, PAR-Q)', 'Explain', 2, 'Explain the purpose of a PAR-Q.', ['To identify whether a client has any medical conditions or risk factors (e.g. heart condition, chest pain, dizziness, joint problems)', 'so they can exercise safely / be referred to a GP before starting a programme (1)']);
  K('B', 'Screening questionnaires (lifestyle questionnaire, PAR-Q)', 'Describe', 2, 'Describe what should happen if a client answers “yes” to a question on the PAR-Q.', ['The client should not start the programme / any tests yet', 'They should be referred to their GP for medical clearance before taking part (1)']);
  K('B', 'Screening questionnaires (lifestyle questionnaire, PAR-Q)', 'Identify', 4, 'Identify four sections included in a lifestyle questionnaire.', ['Personal details', 'Occupation', 'Current activity levels', 'Nutritional status / food diary', 'Lifestyle (alcohol, smoking, stress, sleep)', 'Health monitoring results', 'Physical activity / sporting goals', 'Client declaration']);
  K('B', 'Legal considerations (informed consent, data protection, client confidentiality)', 'Explain', 2, 'Explain why a client must sign an informed consent form before screening.', ['It shows the client understands the purpose, procedures and risks of the tests/programme', 'and agrees to take part voluntarily — protecting both the client and the instructor (legally) (1)']);
  K('B', 'Legal considerations (informed consent, data protection, client confidentiality)', 'Describe', 2, 'Describe how a fitness instructor should maintain client confidentiality.', ['Store questionnaires/results securely (locked cabinet / password-protected files, GDPR)', 'Only share information with the client’s consent / with people who need to know (e.g. GP) (1)']);
  // B2 Health monitoring tests
  K('B', 'Blood pressure', 'Define', 2, 'Define systolic and diastolic blood pressure.', ['Systolic: the pressure in the arteries when the ventricles contract (higher number)', 'Diastolic: the pressure in the arteries when the ventricles relax/fill (lower number)']);
  K('B', 'Blood pressure', 'Describe', 3, 'Describe the procedure for measuring resting blood pressure with an automatic monitor.', ['Client sits quietly for about 5 minutes with no caffeine, smoking or exercise beforehand', 'Correct-sized cuff placed on the upper arm, level with the heart, arm supported', 'Start the monitor and record systolic/diastolic in mmHg', 'Take two readings 1–2 minutes apart and use the average']);
  K('B', 'Blood pressure', 'State', 1, 'State the blood pressure reading at which a person is classed as having high blood pressure (hypertension).', ['140/90 mmHg or above']);
  K('B', 'Blood pressure', 'Interpret', 2, 'A client has a blood pressure of 165/95 mmHg. Interpret this result.', ['Grade 2 (moderate) hypertension — well above the 140/90 threshold (use the higher category of systolic/diastolic)', 'High risk of CHD/stroke — the client should be referred to a GP before training (1)']);
  K('B', 'Resting heart rate', 'Describe', 2, 'Describe how to measure resting heart rate manually.', ['Find the radial (wrist) or carotid (neck) pulse with two fingers after resting for 5–10 minutes (or on waking)', 'Count the beats for 60 seconds (or 30 s × 2) to give beats per minute (1)']);
  K('B', 'Resting heart rate', 'Explain', 2, 'Explain why trained endurance athletes often have a resting heart rate below 60 bpm.', ['Training causes cardiac hypertrophy (a bigger, stronger heart), increasing stroke volume', 'so fewer beats are needed to pump the same cardiac output at rest (1)']);
  K('B', 'Body mass index (BMI)', 'State', 1, 'State the formula for body mass index.', ['BMI = body mass (kg) ÷ height (m)²']);
  K('B', 'Body mass index (BMI)', 'State', 4, 'State the BMI classifications for adults.', ['Underweight: below 18.5', 'Healthy weight: 18.5–24.9', 'Overweight: 25–29.9', 'Obese: 30 or above (severely obese 40+)']);
  K('B', 'Body mass index (BMI)', 'Explain', 2, 'Explain one limitation of using BMI to assess a rugby player.', ['BMI does not distinguish between fat mass and muscle mass', 'so a muscular player may be classed as overweight/obese even with low body fat (1)']);
  K('B', 'Waist to hip ratio', 'Describe', 3, 'Describe how to measure waist-to-hip ratio.', ['Measure waist circumference at the narrowest point (or midway between lowest rib and top of hip bone) with a tape measure', 'Measure hip circumference at the widest part of the buttocks', 'Divide waist by hip measurement (same units), client standing relaxed']);
  K('B', 'Waist to hip ratio', 'Explain', 2, 'Explain why a high waist-to-hip ratio is a health risk.', ['It shows fat is stored centrally around the abdomen/organs (visceral fat — “apple shape”)', 'which is linked to a higher risk of CHD, hypertension and type 2 diabetes (1)']);
  K('B', 'Interpreting the results of health monitoring tests', 'Interpret', 4, 'A 48-year-old male has: BP 165/95 mmHg, RHR 86 bpm, BMI 39, WHR 1.16. Interpret each result.', ['BP: grade 2 hypertension (≥ 160 systolic) — high CHD/stroke risk', 'RHR: below average/poor (above 80 bpm) — poor aerobic fitness', 'BMI: obese (class II, 35–39.9)', 'WHR: high risk for a male (above 1.0) — central fat']);

  // C Nutrition
  K('C', 'Common terminology (RDA, energy measures, energy balance)', 'State', 2, 'State the guideline daily energy intakes for adult men and women in the UK.', ['Men: 2,500 kcal a day', 'Women: 2,000 kcal a day']);
  K('C', 'Common terminology (RDA, energy measures, energy balance)', 'Explain', 2, 'Explain what is meant by energy balance.', ['Energy intake (from food and drink) equals energy expenditure (BMR + physical activity)', 'Weight is maintained when they match; a surplus causes weight gain and a deficit weight loss (1)']);
  K('C', 'Common terminology (RDA, energy measures, energy balance)', 'Identify', 2, 'Identify two factors that affect basal metabolic rate (BMR).', ['Age (BMR falls with age)', 'Sex (men usually higher)', 'Body size / mass', 'Amount of muscle (lean mass)', 'Genetics / hormones']);
  K('C', 'Common terminology (RDA, energy measures, energy balance)', 'Describe', 2, 'Describe a safe rate of weight loss and how to achieve it.', ['About 0.5–1 kg a week', 'by creating an energy deficit of around 500–600 kcal a day through reduced intake and increased activity (1)']);
  K('C', 'Macronutrients (carbohydrates, fats, protein)', 'Describe', 3, 'Describe the role of carbohydrates in the diet of an endurance athlete.', ['Main source of energy, especially for moderate–high intensity exercise', 'Stored as glycogen in the muscles and liver', 'Low glycogen causes fatigue (“hitting the wall”), so intake should be high (e.g. 7–10 g/kg/day)', 'Complex carbohydrates (pasta, rice, oats) release energy slowly']);
  K('C', 'Macronutrients (carbohydrates, fats, protein)', 'Give', 2, 'Give two examples each of simple and complex carbohydrates.', ['Simple: fruit, sugar, sweets, honey, fizzy drinks (any two) (1)', 'Complex: pasta, rice, bread, potatoes, oats, cereals (any two) (1)']);
  K('C', 'Macronutrients (carbohydrates, fats, protein)', 'Describe', 2, 'Describe the function of protein in the diet.', ['Growth and repair of muscle and tissue', 'Making enzymes, hormones and antibodies / minor energy source when carbohydrate is low']);
  K('C', 'Macronutrients (carbohydrates, fats, protein)', 'State', 2, 'State the recommended protein intake for a sedentary adult and for a strength athlete.', ['Sedentary adult: about 0.75 g per kg of body mass per day', 'Strength/power athlete: about 1.6–2.0 g per kg per day']);
  K('C', 'Macronutrients (carbohydrates, fats, protein)', 'Describe', 3, 'Describe the difference between saturated and unsaturated fats, giving a source of each.', ['Saturated fats are mainly from animal sources and solid at room temperature (butter, cheese, fatty meat, cakes)', 'Unsaturated fats are mainly from plant/fish sources and liquid at room temperature (olive oil, avocado, nuts, oily fish)', 'Saturated fat raises LDL cholesterol; unsaturated fat can help lower it']);
  K('C', 'Macronutrients (carbohydrates, fats, protein)', 'Identify', 2, 'Identify two functions of fat in the body.', ['Energy source (especially low-intensity, long-duration exercise)', 'Insulation / temperature regulation', 'Protection of vital organs', 'Transport of fat-soluble vitamins A, D, E and K', 'Making cell membranes and hormones']);
  K('C', 'Micronutrients (vitamins A, B, C, D; calcium, iron)', 'Describe', 4, 'Describe the function and a food source of calcium and iron.', ['Calcium: strong bones and teeth / muscle contraction / nerve function (1)', 'Calcium source: milk, cheese, yoghurt, green leafy vegetables, fortified foods (1)', 'Iron: forms haemoglobin to carry oxygen in red blood cells (1)', 'Iron source: red meat, liver, beans, lentils, spinach, fortified cereals (1)']);
  K('C', 'Micronutrients (vitamins A, B, C, D; calcium, iron)', 'Identify', 2, 'Identify the fat-soluble vitamins.', ['Vitamins A, D, E and K (all four for 2 marks; two or three for 1 mark) (2)']);
  K('C', 'Micronutrients (vitamins A, B, C, D; calcium, iron)', 'Explain', 2, 'Explain why vitamin C is important for a client in training.', ['Supports the immune system / acts as an antioxidant', 'helps tissue repair (collagen) and iron absorption (1)']);
  K('C', 'Micronutrients (vitamins A, B, C, D; calcium, iron)', 'State', 1, 'State the recommended daily intake of fibre for adults.', ['30 g a day']);
  K('C', 'Hydration, dehydration and hyperhydration', 'Identify', 3, 'Identify three signs of dehydration.', ['Thirst', 'Dark yellow urine / reduced urine output', 'Headache', 'Dizziness or light-headedness', 'Fatigue / reduced performance', 'Dry mouth', 'Muscle cramps']);
  K('C', 'Hydration, dehydration and hyperhydration', 'Describe', 3, 'Describe hydration guidelines before, during and after exercise.', ['Before: drink about 400–600 ml 2–3 hours before exercise', 'During: about 150–250 ml every 15–20 minutes (sports drink if longer than 60–90 min)', 'After: replace about 1.5 litres for every kg of body mass lost']);
  K('C', 'Hydration, dehydration and hyperhydration', 'Describe', 3, 'Describe the difference between hypotonic, isotonic and hypertonic sports drinks.', ['Hypotonic: lower concentration of carbohydrate/electrolytes than the body (< 4%) — rapid fluid replacement', 'Isotonic: same concentration as the body (4–8%) — replaces fluid and provides carbohydrate; used during exercise', 'Hypertonic: higher concentration (> 8%) — mainly energy/carbohydrate, used after exercise to restore glycogen']);
  K('C', 'Ergogenic aids (energy gels and bars, protein drinks, carbohydrate loading)', 'Explain', 3, 'Explain how creatine supplementation can benefit a sprinter, and one side-effect.', ['Creatine increases stores of phosphocreatine in the muscles', 'allowing the ATP-PC system to resynthesise ATP faster, improving repeated maximal sprints / power / recovery between efforts (1)', 'Side-effect: water retention/weight gain / muscle cramps / stomach upset (1)']);
  K('C', 'Ergogenic aids (energy gels and bars, protein drinks, carbohydrate loading)', 'Describe', 3, 'Describe carbohydrate loading for a marathon runner.', ['Reduce (taper) training in the days before the event', 'Increase carbohydrate intake to around 10–12 g/kg/day for 36–48 hours before the race', 'Maximises muscle glycogen stores to delay fatigue in events over 90 minutes; side-effect: heaviness/bloating from water stored with glycogen']);
  K('C', 'Ergogenic aids (energy gels and bars, protein drinks, carbohydrate loading)', 'Explain', 2, 'Explain one benefit and one risk of using caffeine as an ergogenic aid.', ['Benefit: stimulant that increases alertness, reduces perceived effort and helps fat mobilisation (glycogen sparing) — improves endurance', 'Risk: insomnia, anxiety, increased heart rate, stomach upset / dependence (1)']);
  K('C', 'Ergogenic aids (energy gels and bars, protein drinks, carbohydrate loading)', 'Describe', 2, 'Describe what an athlete should eat before a competition.', ['A high-carbohydrate, low-fat, low-fibre meal 3–4 hours before (e.g. pasta, rice, toast) to top up glycogen', 'A small carbohydrate snack 1 hour before if needed, plus fluid (1)']);

  // D Training methods
  K('D', 'Components of fitness to be trained (physical fitness)', 'Define', 1, 'Define aerobic endurance.', ['The ability of the cardiorespiratory system to supply the working muscles with oxygen to sustain aerobic activity for a prolonged period']);
  K('D', 'Components of fitness to be trained (physical fitness)', 'Define', 1, 'Define muscular endurance.', ['The ability of a muscle/muscle group to perform repeated contractions over time without fatigue']);
  K('D', 'Components of fitness to be trained (physical fitness)', 'Define', 1, 'Define muscular strength.', ['The maximum force that a muscle or muscle group can produce in a single voluntary contraction']);
  K('D', 'Components of fitness to be trained (physical fitness)', 'Define', 1, 'Define body composition.', ['The relative ratio of fat mass to fat-free (lean) mass in the body']);
  K('D', 'Components of fitness to be trained (physical fitness)', 'Define', 1, 'Define flexibility.', ['Having an adequate range of motion at the joints / moving a joint through its complete range of movement']);
  K('D', 'Components of fitness to be trained (physical fitness)', 'Define', 1, 'Define speed.', ['Distance ÷ time / the ability to move the body or a body part quickly']);
  K('D', 'Aerobic endurance training methods', 'Describe', 3, 'Describe four training methods for aerobic endurance.', ['Continuous training — steady pace for at least 30 minutes at 60–80% MHR', 'Fartlek training — “speed play”: continuous with varied pace/terrain', 'Interval training — periods of work followed by rest (work:rest ratio)', 'Circuit training — aerobic stations performed continuously with short rests'], MS('Weight training', ''));
  K('D', 'Aerobic endurance training methods', 'Explain', 2, 'Explain why fartlek training is suitable for a football player.', ['It mixes jogging, running and sprinting with changes of pace and terrain', 'which replicates the stop-start, varied-intensity demands of a football match (specificity) (1)']);
  K('D', 'Aerobic endurance training methods', 'Describe', 2, 'Describe how interval training can be adapted to develop aerobic or anaerobic fitness.', ['Aerobic: longer work periods at lower intensity with short rest (e.g. 1:1 or 1:0.5)', 'Anaerobic/speed: short, maximal work periods with long rest (e.g. 1:3 to 1:5) to allow ATP-PC recovery']);
  K('D', 'Muscular strength training methods', 'Describe', 2, 'Describe how free weights should be used to develop muscular strength.', ['High load — about 85%+ of 1RM', 'Low repetitions (about 1–6 reps) with long rest (2–5 minutes) between sets']);
  K('D', 'Muscular strength training methods', 'Describe', 2, 'Describe how resistance training should be used to develop muscular endurance.', ['Low load — about 50–60% of 1RM', 'High repetitions (about 15–20+ reps) with short rests (30–60 s)']);
  K('D', 'Muscular strength training methods', 'Explain', 2, 'Explain one advantage of fixed resistance machines over free weights for a beginner.', ['The machine controls the movement path / range of movement', 'making it safer and easier to learn, with less need for a spotter or advanced technique (1)']);
  K('D', 'Muscular strength training methods', 'Describe', 3, 'Describe circuit training.', ['A series of exercises performed at different stations', 'for a set time or number of reps, with short rests between stations', 'can target muscular endurance, aerobic endurance or skills depending on station design / work:rest ratio']);
  K('D', 'Muscular strength training methods', 'Explain', 3, 'Explain how plyometric training develops power.', ['Exercises such as bounding, hopping and box/depth jumps', 'use the stretch-shortening cycle: an eccentric contraction (muscle lengthens and stores elastic energy) is followed immediately by a powerful concentric contraction', 'training the muscles to produce force quickly (strength × speed)']);
  K('D', 'Flexibility training methods', 'Describe', 3, 'Describe the three methods of flexibility training.', ['Static stretching — holding a stretch still (active: by own muscles; passive: with a partner/apparatus) for 10–30 s', 'Ballistic stretching — bouncing/swinging movements beyond normal range (sport-specific, higher injury risk)', 'PNF — stretch, isometric contraction against resistance (6–10 s), relax, then stretch further (inhibits the stretch reflex)']);
  K('D', 'Flexibility training methods', 'Explain', 2, 'Explain why ballistic stretching is not suitable for an older or untrained client.', ['It uses fast, bouncing movements beyond the normal range of motion', 'which can trigger the stretch reflex and cause muscle strains/injury (1)']);
  K('D', 'Speed training methods', 'Describe', 3, 'Describe three speed training methods.', ['Acceleration sprints — increasing pace from a standing/jogging start to maximum', 'Hollow sprints — sprints separated by “hollow” periods of jogging or walking', 'Interval training — short maximal efforts with long recovery (e.g. 1:5)', 'Resistance drills — sprinting with sleds, parachutes or up hills']);
  K('D', 'Core stability training methods', 'Explain', 2, 'Explain the benefits of core stability training.', ['Strengthens the trunk muscles (abdominals, obliques, lower back)', 'improving posture, balance and transfer of force between upper and lower body, and reducing lower back injury (1)']);
  K('D', 'Skill-related fitness', 'Define', 1, 'Define agility.', ['The ability to move and change direction quickly, precisely and under control']);
  K('D', 'Skill-related fitness', 'Define', 1, 'Define reaction time.', ['The time taken to respond to a stimulus and initiate a response']);
  K('D', 'Skill-related fitness', 'Define', 1, 'Define power.', ['The ability to perform strength-based movements quickly (strength × speed)']);
  K('D', 'Skill-related fitness', 'Describe', 2, 'Describe SAQ training.', ['Speed, agility and quickness drills', 'using ladders, cones and hurdles to improve footwork, acceleration and change of direction (1)']);
  K('D', 'Skill-related fitness', 'Give', 2, 'Give a training method for balance and a training method for coordination.', ['Balance: single-leg work / wobble board / Swiss ball (1)', 'Coordination: hand–eye ball drills / juggling / ladder footwork patterns (1)']);
  K('D', 'Skill-related fitness', 'Describe', 2, 'Describe a training method to improve a goalkeeper’s reaction time.', ['Reaction drills such as reaction-ball or drop-ball drills / shots from close range or behind a screen', 'repeated so the goalkeeper responds faster to an unpredictable stimulus (1)']);
  K('D', 'Training methods for physical fitness-related components', 'Explain', 2, 'Explain why swimming or aqua aerobics may be recommended for an obese client with joint pain.', ['Water supports body weight (buoyancy), making it low-impact', 'reducing stress on the joints while still developing aerobic endurance and burning calories (1)']);
  K('D', 'Training methods for physical fitness-related components', 'Explain', 2, 'Explain why “weight training” is not accepted as a training method in the set task.', ['It is not a method named in the specification / too vague', 'learners must name a specific method such as free weights, fixed resistance machines or circuit training (1)']);

  // E Programme design
  K('E', 'Aims, objectives, personal goals (SMARTER) and resources', 'State', 3, 'State what each letter of SMARTER stands for.', ['Specific, Measurable, Achievable (all three = 1 mark)', 'Realistic, Time-related/bound (1)', 'Exciting, Recorded (1)']);
  K('E', 'Aims, objectives, personal goals (SMARTER) and resources', 'Explain', 2, 'Explain the difference between an aim and an objective in a training programme.', ['An aim is the overall, long-term target the client wants to achieve (e.g. lose weight / complete a marathon)', 'An objective is a specific, measurable step towards the aim (e.g. train 4 times a week / run 10 km in week 6) (1)']);
  K('E', 'Aims, objectives, personal goals (SMARTER) and resources', 'Describe', 3, 'Describe short-, medium- and long-term goals.', ['Short-term: days to a few weeks — stepping stones', 'Medium-term: around 1–3 months — progress checks', 'Long-term: 6 months to years — the overall aim']);
  K('E', 'Aims, objectives, personal goals (SMARTER) and resources', 'Identify', 3, 'Identify three resources needed for a six-week training programme.', ['Facilities (gym, pool, track, park)', 'Equipment (weights, machines, HR monitor, mats, cones)', 'Qualified instructor/coach', 'Time', 'Money/cost of membership', 'Transport', 'Training diary/app']);
  K('E', 'Principles of training: FITT', 'Describe', 4, 'Describe each part of the FITT principle.', ['Frequency — how often the client trains (sessions per week)', 'Intensity — how hard (e.g. % MHR / bpm, RPE, % 1RM)', 'Time — how long each session lasts (or sets × reps)', 'Type — the training method used, matched to the goal']);
  K('E', 'Additional principles of training', 'Explain', 2, 'Explain the principle of progressive overload.', ['Training must be gradually increased beyond what the body is used to (by increasing frequency, intensity or time)', 'so that the body continues to adapt and fitness improves — increases should be small (about 10% a week) to avoid injury (1)']);
  K('E', 'Additional principles of training', 'Explain', 2, 'Explain the principle of reversibility.', ['Fitness gains are lost if training stops or is reduced (“use it or lose it”)', 'e.g. aerobic adaptations decline within a few weeks, so training must be regular / injury breaks lead to detraining (1)']);
  K('E', 'Additional principles of training', 'Explain', 2, 'Explain the principle of specificity.', ['Training must match the demands of the sport/goal (energy systems, muscles, movements, components)', 'e.g. a marathon runner should do mainly continuous running, not maximal lifting (1)']);
  K('E', 'Additional principles of training', 'Explain', 2, 'Explain why variation is important in a training programme.', ['Changing methods/exercises/venues keeps the client motivated and avoids boredom', 'and reduces the risk of plateaus and overuse injuries (1)']);
  K('E', 'Additional principles of training', 'Explain', 2, 'Explain why rest and recovery are important in a training programme.', ['Adaptations to training take place during rest (repair of muscle, replenishing energy stores)', 'insufficient rest leads to overtraining, fatigue and injury (1)']);
  K('E', 'Additional principles of training', 'Explain', 2, 'Explain the principle of individual needs (individual differences).', ['Every client responds differently because of age, fitness, health, goals, injuries and lifestyle', 'so the programme must be tailored to the individual (1)']);
  K('E', 'Principles of training: FITT', 'State', 1, 'State the formula for estimating maximum heart rate.', ['MHR = 220 − age']);
  K('E', 'Principles of training: FITT', 'Describe', 2, 'Describe the Karvonen formula.', ['Target HR = ((MHR − RHR) × % intensity) + RHR', 'uses heart rate reserve, so it accounts for the client’s fitness (resting heart rate) (1)']);
  K('E', 'Principles of training: FITT', 'Describe', 2, 'Describe the Borg RPE scale.', ['A subjective 6–20 scale where the client rates how hard they feel they are working (6 = no exertion, 20 = maximal)', 'RPE × 10 gives an approximate heart rate; 12–14 is “somewhat hard” (moderate) (1)']);
  K('E', 'Principles of training: FITT', 'State', 1, 'State the aerobic training zone as a percentage of maximum heart rate.', ['About 60–85% of MHR']);
  K('E', 'Principles of training: FITT', 'Explain', 2, 'Explain why RPE may be used instead of heart rate for some clients.', ['Some clients take medication (e.g. beta blockers) or have conditions that affect heart rate, or have no HR monitor', 'RPE lets them self-monitor intensity safely without equipment (1)']);
  K('E', 'Periodisation (macrocycle, mesocycle, microcycle)', 'Describe', 3, 'Describe the three cycles used in periodisation.', ['Macrocycle — the long-term plan (e.g. a season or year) towards the main goal', 'Mesocycle — a training block of several weeks (e.g. a 6-week programme) with a specific aim', 'Microcycle — the shortest cycle, usually one week of sessions']);
  K('E', 'Periodisation (macrocycle, mesocycle, microcycle)', 'Describe', 3, 'Describe the three components of a warm-up.', ['Pulse raiser — gradually increases heart rate, body temperature and blood flow (e.g. jogging)', 'Mobility — moves joints through their range (e.g. arm circles)', 'Stretching/preparation — dynamic stretches and sport-specific rehearsal']);
  K('E', 'Periodisation (macrocycle, mesocycle, microcycle)', 'Explain', 2, 'Explain the purpose of a cool-down.', ['Gradually lowers heart rate and body temperature / maintains blood flow to remove lactic acid and prevent blood pooling', 'Static stretching helps reduce muscle soreness (DOMS) and maintain flexibility (1)']);
  K('E', 'Motivational techniques and adherence', 'Explain', 2, 'Explain the difference between intrinsic and extrinsic motivation.', ['Intrinsic motivation comes from within — enjoyment, satisfaction, personal challenge', 'Extrinsic motivation comes from external rewards — trophies, money, praise, recognition (1)']);
  K('E', 'Motivational techniques and adherence', 'Describe', 3, 'Describe three ways a trainer can improve a client’s adherence to a programme.', ['Set SMARTER goals and review them regularly', 'Record and show progress (training diary, re-testing)', 'Use rewards / positive feedback / praise', 'Add variety and activities the client enjoys', 'Build in social support (training partner, group sessions)', 'Plan around barriers such as time and cost']);

  /* ── Calculation questions (generated with worked answers) ─────────── */
  const CALCS = [];
  const people = [
    ['Kate', 'F', 34, 82, 1.65, 64], ['Ryan', 'M', 19, 95, 1.82, 58], ['Omar', 'M', 45, 98, 1.75, 76], ['Lucy', 'F', 22, 54, 1.60, 62], ['Graham', 'M', 61, 88, 1.70, 70],
    ['Holly', 'F', 50, 90, 1.68, 80], ['Sam', 'M', 28, 74, 1.78, 66], ['Ava', 'F', 17, 56, 1.63, 60], ['Dev', 'M', 39, 112, 1.80, 84], ['Rosa', 'F', 70, 72, 1.58, 74]
  ];
  people.forEach(([name, sex, age, mass, ht, rhr], i) => {
    const bmi = Math.round(mass / (ht * ht) * 10) / 10;
    const cat = U2.bmiCategory(bmi).label;
    CALCS.push({
      id: 'CALC-BMI-' + (i + 1), learning_aim: 'B', topic: 'Body mass index (BMI)', command_verb: 'Calculate', marks: 3, origin: 'knowledge', spec_code: '31525H',
      question: `${name} has a body mass of ${mass} kg and a height of ${ht.toFixed(2)} m. Calculate ${name}’s BMI and interpret the result.`,
      source_material: { type: 'data_table', title: `${name}’s measurements`, headers: ['Measure', 'Value'], rows: [['Body mass', mass + ' kg'], ['Height', ht.toFixed(2) + ' m']] },
      mark_scheme: { instruction: 'Award marks for method, answer and interpretation.', points: [`BMI = mass ÷ height² = ${mass} ÷ ${(ht * ht).toFixed(2)} (1)`, `= ${bmi} (kg/m²) (1)`, `${cat} (healthy range 18.5–24.9) (1)`], additional_guidance: 'Accept answers rounded to the nearest whole number.' }
    });
    const mhr = 220 - age;
    const lo = U2.karvonen(age, rhr, 60), hi = U2.karvonen(age, rhr, 75);
    CALCS.push({
      id: 'CALC-HR-' + (i + 1), learning_aim: 'E', topic: 'Principles of training: FITT', command_verb: 'Calculate', marks: 4, origin: 'knowledge', spec_code: '31525H',
      question: `${name} is ${age} years old with a resting heart rate of ${rhr} bpm. Use the Karvonen formula to calculate ${name}’s target heart rate zone for aerobic training at 60–75% intensity. Show your working.`,
      source_material: { type: 'data_table', title: `${name}’s data`, headers: ['Measure', 'Value'], rows: [['Age', age + ' years'], ['Resting heart rate', rhr + ' bpm'], ['Target intensity', '60–75% (heart rate reserve)']] },
      mark_scheme: { instruction: 'Award marks for each stage of the method.', points: [`MHR = 220 − ${age} = ${mhr} bpm (1)`, `HRR = ${mhr} − ${rhr} = ${mhr - rhr} bpm (1)`, `60%: (${mhr - rhr} × 0.6) + ${rhr} = ${lo} bpm (1)`, `75%: (${mhr - rhr} × 0.75) + ${rhr} = ${hi} bpm — zone ${lo}–${hi} bpm (1)`], additional_guidance: 'Accept rounding to the nearest whole number. Own-figure rule applies for later steps.' }
    });
  });
  [[86, 104, 'M'], [78, 101, 'F'], [102, 98, 'M'], [72, 96, 'F'], [95, 100, 'M'], [88, 99, 'F']].forEach(([w, h, sex], i) => {
    const r = Math.round(w / h * 100) / 100;
    const cat = U2.whrCategory(r, sex).label;
    CALCS.push({
      id: 'CALC-WHR-' + (i + 1), learning_aim: 'B', topic: 'Waist to hip ratio', command_verb: 'Calculate', marks: 3, origin: 'knowledge', spec_code: '31525H',
      question: `A ${sex === 'F' ? 'female' : 'male'} client has a waist measurement of ${w} cm and a hip measurement of ${h} cm. Calculate the waist-to-hip ratio and interpret the result.`,
      source_material: { type: 'data_table', title: 'Client measurements', headers: ['Measure', 'Value'], rows: [['Sex', sex === 'F' ? 'Female' : 'Male'], ['Waist', w + ' cm'], ['Hip', h + ' cm']] },
      mark_scheme: { instruction: 'Award marks for method, answer and interpretation.', points: [`WHR = waist ÷ hip = ${w} ÷ ${h} (1)`, `= ${r.toFixed(2)} (1)`, `${cat} for a ${sex === 'F' ? 'woman (low ≤ 0.80, high > 0.85)' : 'man (low ≤ 0.95, high > 1.0)'} (1)`] }
    });
  });
  [[['4 × pints of 4% lager (568 ml)', 4 * 568 * 4 / 1000], ['3 × 175 ml glasses of 13% wine', 3 * 175 * 13 / 1000]], [['6 × 330 ml bottles of 5% beer', 6 * 330 * 5 / 1000], ['4 × 25 ml measures of 40% vodka', 4 * 25 * 40 / 1000]], [['2 × 250 ml glasses of 12% wine', 2 * 250 * 12 / 1000], ['5 × pints of 5% cider (568 ml)', 5 * 568 * 5 / 1000]]].forEach((drinks, i) => {
    const total = Math.round(drinks.reduce((s, x) => s + x[1], 0) * 10) / 10;
    CALCS.push({
      id: 'CALC-ALC-' + (i + 1), learning_aim: 'A', topic: 'Alcohol', command_verb: 'Calculate', marks: 3, origin: 'knowledge', spec_code: '31525H',
      question: `Units of alcohol = ABV (%) × volume (ml) ÷ 1000. A client drinks ${drinks[0][0]} and ${drinks[1][0]} at the weekend. Calculate the total units and compare this with the weekly guideline.`,
      mark_scheme: { instruction: 'Award marks for method, answer and comparison.', points: [`${drinks[0][0]} = ${drinks[0][1].toFixed(1)} units (1)`, `${drinks[1][0]} = ${drinks[1][1].toFixed(1)} units; total = ${total} units (1)`, total > 14 ? `Above the 14-unit weekly guideline in one weekend — binge drinking (1)` : `Within the 14-unit weekly guideline, but drunk in a short period (1)`] }
    });
  });
  [[2000, 104, 'F'], [2500, 118, 'M'], [2000, 90, 'F']].forEach(([gda, mass, sex], i) => {
    CALCS.push({
      id: 'CALC-KCAL-' + (i + 1), learning_aim: 'C', topic: 'Common terminology (RDA, energy measures, energy balance)', command_verb: 'Calculate', marks: 3, origin: 'knowledge', spec_code: '31525H',
      question: `A ${sex === 'F' ? 'female' : 'male'} client (${mass} kg) maintains weight on ${gda} kcal a day. One kilogram of body fat stores about 7,700 kcal. Calculate a daily intake that would achieve weight loss of about 0.5 kg a week, and how many weeks it would take to lose 6 kg.`,
      mark_scheme: { instruction: 'Award marks for each stage.', points: ['0.5 kg × 7,700 = 3,850 kcal a week ÷ 7 = 550 kcal/day deficit (1)', `${gda} − 550 = ${gda - 550} kcal a day (accept ${gda - 600}–${gda - 500}) (1)`, '6 kg ÷ 0.5 kg = 12 weeks (1)'] }
    });
  });

  /* ── MCQ quiz ─────────────────────────────────────────────────────── */
  const QUIZ = [];
  let qn = 0;
  function rng(seed) { let h = 2166136261; for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); } return () => { h = (h + 0x6D2B79F5) | 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function M(aim, topic, question, correct, wrong, explanation) {
    qn++;
    const id = 'QZ-U2-' + String(qn).padStart(3, '0');
    const opts = [{ t: correct, c: true }].concat(wrong.map(w => ({ t: w, c: false })));
    const r = rng(id);
    for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }
    QUIZ.push({ id, learning_aim: aim, topic, type: 'mcq', question, choices: opts.map(o => o.t), correct_index: opts.findIndex(o => o.c), explanation });
  }
  function TF(aim, topic, statement, isTrue, explanation) {
    qn++;
    QUIZ.push({ id: 'QZ-U2-' + String(qn).padStart(3, '0'), learning_aim: aim, topic, type: 'true_false', question: statement, choices: ['True', 'False'], correct_index: isTrue ? 0 : 1, explanation });
  }

  // A
  M('A', 'Government recommendations/guidelines', 'How much moderate-intensity activity should adults aged 19–64 do each week?', '150 minutes', ['60 minutes', '90 minutes', '300 minutes'], 'UK CMO guidelines: at least 150 minutes of moderate (or 75 minutes of vigorous) activity a week, plus strength work on 2+ days.');
  M('A', 'Government recommendations/guidelines', 'How much vigorous activity meets the adult guideline instead of 150 minutes of moderate activity?', '75 minutes a week', ['30 minutes a week', '45 minutes a week', '120 minutes a week'], 'Vigorous activity counts double: 75 minutes of vigorous activity is equivalent to 150 minutes of moderate.');
  M('A', 'Government recommendations/guidelines', 'What is the guideline for children and young people aged 5–18?', 'An average of 60 minutes of moderate-to-vigorous activity a day', ['30 minutes of activity on 3 days a week', '150 minutes a week', '2 hours of vigorous activity a day'], 'Children and young people should average at least 60 minutes a day across the week.');
  M('A', 'Government recommendations/guidelines', 'Which type of activity is recommended in addition for adults aged 65+?', 'Balance and flexibility activities', ['Plyometric training', 'Maximal sprint training', 'Ballistic stretching'], 'Older adults should add activities that improve balance and flexibility (to reduce falls), along with strength work.');
  M('A', 'Government recommendations/guidelines', 'On how many days a week should adults do muscle-strengthening activities?', 'At least 2', ['At least 1', 'At least 4', 'Every day'], 'Strength activities on at least two days a week.');
  M('A', 'Exercise/physical activity (physical, chronic disease, psychological, social, economic)', 'Which is a psychological benefit of regular physical activity?', 'Reduced anxiety and depression', ['Lower blood pressure', 'Increased bone density', 'Lower resting heart rate'], 'Endorphins released during exercise improve mood; the others are physical benefits.');
  M('A', 'Exercise/physical activity (physical, chronic disease, psychological, social, economic)', 'Weight-bearing exercise reduces the risk of which condition?', 'Osteoporosis', ['Asthma', 'Anaemia', 'Hypotension'], 'Weight-bearing exercise stimulates bone remodelling and increases bone mineral density.');
  M('A', 'Exercise/physical activity (physical, chronic disease, psychological, social, economic)', 'How does regular aerobic training help reduce the risk of type 2 diabetes?', 'It improves insulin sensitivity and blood glucose control', ['It increases blood sugar levels', 'It reduces haemoglobin levels', 'It lowers bone density'], 'Exercising muscles take up glucose more effectively, improving insulin sensitivity.');
  M('A', 'Smoking', 'Which substance in cigarette smoke reduces the oxygen-carrying capacity of the blood?', 'Carbon monoxide', ['Nicotine', 'Tar', 'Ammonia'], 'Carbon monoxide binds to haemoglobin far more readily than oxygen, forming carboxyhaemoglobin.');
  M('A', 'Smoking', 'Which substance in cigarettes is addictive and raises heart rate and blood pressure?', 'Nicotine', ['Carbon monoxide', 'Tar', 'Glucose'], 'Nicotine is a stimulant and the addictive component of tobacco.');
  M('A', 'Smoking', 'Which substance in cigarettes coats the lungs and is linked to lung cancer?', 'Tar', ['Nicotine', 'Carbon monoxide', 'Caffeine'], 'Tar damages the alveoli and cilia and contains carcinogens.');
  M('A', 'Smoking', 'Which is a long-term respiratory disease caused by smoking?', 'COPD (emphysema/chronic bronchitis)', ['Osteoporosis', 'Type 1 diabetes', 'Anaemia'], 'Chronic obstructive pulmonary disease is mainly caused by smoking.');
  M('A', 'Alcohol', 'What is the UK weekly guideline for alcohol for both men and women?', 'No more than 14 units', ['No more than 21 units', 'No more than 28 units', 'No more than 7 units'], 'Since 2016, men and women are advised not to regularly drink more than 14 units a week, spread over 3+ days.');
  M('A', 'Alcohol', 'How many kilocalories are in 1 gram of alcohol?', '7 kcal', ['4 kcal', '9 kcal', '2 kcal'], 'Alcohol provides 7 kcal/g of “empty” calories with no nutritional value.');
  M('A', 'Alcohol', 'Which organ is most damaged by long-term excessive drinking?', 'Liver', ['Pancreas', 'Lungs', 'Spleen'], 'Long-term heavy drinking causes fatty liver, hepatitis and cirrhosis.');
  M('A', 'Alcohol', 'Why does alcohol impair recovery after training?', 'It is a diuretic, causing dehydration', ['It increases muscle glycogen', 'It improves sleep quality', 'It increases protein synthesis'], 'Alcohol increases urine output, causing dehydration, and also disrupts sleep and muscle repair.');
  M('A', 'Stress', 'Which hormone is released during long-term stress and is linked to weight gain around the waist?', 'Cortisol', ['Insulin', 'Testosterone', 'Melatonin'], 'Chronic stress raises cortisol, which is linked to central fat storage and raised blood pressure.');
  M('A', 'Stress', 'Which is a behavioural symptom of stress?', 'Comfort eating or drinking more', ['Increased heart rate', 'Sweating', 'Raised blood pressure'], 'Behavioural symptoms are changes in what people do; the others are physiological responses.');
  M('A', 'Sleep', 'How many hours of sleep a night are recommended for adults?', '7–9', ['5–6', '10–12', '4–5'], 'NHS guidance is 7–9 hours for adults; teenagers need 8–10.');
  M('A', 'Sleep', 'Which is an effect of insufficient sleep?', 'Slower reaction time and poorer concentration', ['Lower resting heart rate', 'Faster recovery', 'Increased bone density'], 'Sleep loss impairs cognitive function, reaction time, recovery and immunity.');
  M('A', 'Sedentary lifestyle', 'Which client has the most sedentary lifestyle?', 'An office worker who drives to work and watches TV every evening', ['A postal worker who walks 10 miles a day', 'A builder who cycles to work', 'A PE teacher'], 'Sedentary = long periods of sitting with little activity.');
  M('A', 'Balanced diet (eatwell plate, benefits, fluid intake, strategies)', 'A diet high in salt is most directly linked to which condition?', 'Hypertension', ['Anaemia', 'Osteoporosis', 'Hypoglycaemia'], 'Sodium causes water retention and raises blood pressure; adults should have under 6 g of salt a day.');
  M('A', 'Balanced diet (eatwell plate, benefits, fluid intake, strategies)', 'High intake of saturated fat increases the level of which substance in the blood?', 'LDL cholesterol', ['HDL cholesterol', 'Haemoglobin', 'Calcium'], 'Saturated fat raises LDL (“bad”) cholesterol, which contributes to atherosclerosis.');
  M('A', 'Smoking cessation strategies', 'Which is a smoking cessation technique named in the specification?', 'Nicotine replacement therapy', ['Carbohydrate loading', 'Progressive muscular relaxation', 'PNF stretching'], 'NRT (patches, gum, lozenges, inhalators) reduces withdrawal symptoms.');
  M('A', 'Smoking cessation strategies', 'Which of these is a smoking cessation strategy listed in the Unit 2 specification?', 'Quit Kit support packs', ['Carbohydrate loading', 'Pyramid sets', 'Assertiveness training'], 'Spec strategies: acupuncture, NHS smoking helpline, NHS smoking services, nicotine replacement therapy and Quit Kit support packs.');
  M('A', 'Strategies to reduce alcohol consumption', 'Which strategy to reduce alcohol consumption is named in the specification?', 'Self-help groups', ['Nicotine replacement therapy', 'Plyometrics', 'Quit Kit support packs'], 'Spec strategies: counselling, self-help groups (e.g. Alcoholics Anonymous) and alternative treatments.');
  M('A', 'Stress management techniques', 'Learning to say “no” to extra work and express needs calmly is which stress management technique?', 'Assertiveness training', ['Time management', 'Acupuncture', 'Meditation'], 'Assertiveness training reduces stress caused by taking on too much.');
  M('A', 'Stress management techniques', 'Replacing negative thoughts with positive statements is an example of…', 'Positive self-talk (a cognitive technique)', ['A relaxation technique', 'Time management', 'Progressive overload'], 'Cognitive techniques change the way the client thinks about stressors.');
  M('A', 'Common barriers to change', 'In the stages of change model, a smoker who has set a quit date next week is in which stage?', 'Preparation', ['Pre-contemplation', 'Action', 'Maintenance'], 'Preparation = getting ready and planning to change in the near future.');
  M('A', 'Common barriers to change', 'A client has stopped smoking for 8 months. Which stage of change are they in?', 'Maintenance', ['Action', 'Contemplation', 'Preparation'], 'Maintenance is sustaining the change for longer than about 6 months.');
  M('A', 'Common barriers to change', 'Which list gives the common barriers to change named in the specification?', 'Time, cost, transport, location', ['Age, gender, climate, height', 'Frequency, intensity, time, type', 'Specific, measurable, achievable, realistic'], 'Spec A3: common barriers to change are time, cost, transport and location.');
  TF('A', 'Alcohol', 'The alcohol guideline is higher for men than for women.', false, 'Since 2016 the guideline is the same for both: no more than 14 units a week.');
  TF('A', 'Smoking', 'Smoking increases resting heart rate.', true, 'Nicotine is a stimulant that raises heart rate and blood pressure.');
  TF('A', 'Sleep', 'Lack of sleep can lead to weight gain.', true, 'Sleep loss raises ghrelin (hunger) and lowers leptin (fullness), increasing appetite.');
  TF('A', 'Government recommendations/guidelines', 'Adults only need to do aerobic activity to meet the physical activity guidelines.', false, 'Adults should also do strength activities on at least two days a week and reduce sedentary time.');
  TF('A', 'Stress', 'Some stress (eustress) can be positive and improve performance.', true, 'Eustress is beneficial stress that motivates; distress is harmful.');

  // B
  M('B', 'Screening questionnaires (lifestyle questionnaire, PAR-Q)', 'What does PAR-Q stand for?', 'Physical Activity Readiness Questionnaire', ['Personal Activity Record Questionnaire', 'Physical Ability Rating Quiz', 'Pre-Activity Risk Questionnaire'], 'The PAR-Q identifies clients who need medical clearance before exercising.');
  M('B', 'Screening questionnaires (lifestyle questionnaire, PAR-Q)', 'A client answers “yes” to a PAR-Q question about chest pain. What should the instructor do?', 'Refer the client to their GP before any testing or training', ['Start with low-intensity training', 'Ignore it if the client feels fine', 'Carry out a maximal fitness test to check'], 'Any “yes” answer means medical clearance is needed first.');
  M('B', 'Screening questionnaires (lifestyle questionnaire, PAR-Q)', 'Which section of the Pearson lifestyle questionnaire records the client’s food diary?', 'Nutritional status', ['Occupation', 'Current activity levels', 'Client declaration'], 'Section 3 “Nutritional status” contains the two-day food diary and supplements.');
  M('B', 'Legal considerations (informed consent, data protection, client confidentiality)', 'What is the main purpose of informed consent?', 'To show the client understands the tests/programme and agrees to take part', ['To record the client’s blood pressure', 'To calculate the client’s BMI', 'To set the client’s goals'], 'Informed consent confirms understanding of procedures, risks and the right to withdraw.');
  M('B', 'Blood pressure', 'What is the unit of measurement for blood pressure?', 'mmHg', ['bpm', 'kg/m²', 'ml/kg/min'], 'Millimetres of mercury.');
  M('B', 'Blood pressure', 'The top number in a blood pressure reading is the…', 'Systolic pressure', ['Diastolic pressure', 'Resting heart rate', 'Pulse pressure'], 'Systolic = pressure when the ventricles contract.');
  M('B', 'Blood pressure', 'A reading of 145/92 mmHg is classified as…', 'Grade 1 (mild) hypertension', ['Optimal', 'High normal', 'Grade 3 hypertension'], 'Grade 1 hypertension is 140–159 systolic and/or 90–99 diastolic.');
  M('B', 'Blood pressure', 'A reading of 132/86 mmHg is classified as…', 'High normal', ['Optimal', 'Grade 1 hypertension', 'Low'], 'High normal is 130–139/85–89 — lifestyle changes are advised.');
  M('B', 'Blood pressure', 'A reading of 115/75 mmHg is classified as…', 'Optimal', ['High normal', 'Grade 1 hypertension', 'Hypotension'], 'Optimal is below 120/80.');
  M('B', 'Blood pressure', 'Systolic and diastolic readings fall in different categories (e.g. 130/95). Which category should be used?', 'The higher category', ['The lower category', 'The average of the two', 'Only the systolic category'], 'The client is classified by whichever reading is in the higher-risk category — 130/95 is grade 1 hypertension.');
  M('B', 'Blood pressure', 'Which should a client avoid for 30 minutes before a blood pressure test?', 'Caffeine, smoking and exercise', ['Drinking water', 'Sitting down', 'Talking to the tester before the test'], 'Caffeine, nicotine and exercise all temporarily raise blood pressure.');
  M('B', 'Resting heart rate', 'Which resting heart rate suggests the highest level of aerobic fitness?', '48 bpm', ['72 bpm', '85 bpm', '96 bpm'], 'A low RHR reflects a larger stroke volume from cardiac hypertrophy.');
  M('B', 'Resting heart rate', 'A resting heart rate above 100 bpm is called…', 'Tachycardia', ['Bradycardia', 'Hypertension', 'Arrhythmia'], 'Tachycardia should be referred to a GP before training.');
  M('B', 'Resting heart rate', 'Where is the radial pulse taken?', 'The wrist (thumb side)', ['The neck', 'The temple', 'The groin'], 'The carotid pulse is at the neck; the radial at the wrist.');
  M('B', 'Body mass index (BMI)', 'Which is the correct formula for BMI?', 'Mass (kg) ÷ height (m)²', ['Height (m) ÷ mass (kg)', 'Mass (kg) × height (m)', 'Waist ÷ hip'], 'BMI is expressed in kg/m².');
  M('B', 'Body mass index (BMI)', 'A BMI of 27 is classified as…', 'Overweight', ['Healthy weight', 'Obese', 'Underweight'], 'Overweight is 25–29.9.');
  M('B', 'Body mass index (BMI)', 'A BMI of 17 is classified as…', 'Underweight', ['Healthy weight', 'Overweight', 'Obese'], 'Underweight is below 18.5 — a concern for athletes in heavy training (low energy availability).');
  M('B', 'Body mass index (BMI)', 'A BMI of 41 is classified as…', 'Severely obese (class III)', ['Overweight', 'Obese class I', 'Healthy weight'], 'A BMI of 40 or above is severe (morbid) obesity.');
  M('B', 'Body mass index (BMI)', 'What is the main limitation of BMI?', 'It does not distinguish between muscle and fat', ['It needs expensive equipment', 'It cannot be used on adults', 'It measures blood pressure inaccurately'], 'Muscular athletes can be misclassified as overweight or obese.');
  M('B', 'Waist to hip ratio', 'Above what waist-to-hip ratio is a woman considered at high risk?', '0.85', ['0.70', '0.95', '1.10'], 'Women: low ≤ 0.80, moderate 0.81–0.85, high > 0.85.');
  M('B', 'Waist to hip ratio', 'Above what waist-to-hip ratio is a man considered at high risk?', '1.0', ['0.80', '0.85', '1.2'], 'Men: low ≤ 0.95, moderate 0.96–1.0, high > 1.0.');
  M('B', 'Waist to hip ratio', 'A high waist-to-hip ratio indicates…', 'Fat stored around the abdomen (apple shape)', ['Fat stored around the hips (pear shape)', 'High muscle mass', 'Low blood pressure'], 'Central (visceral) fat is linked to CHD, hypertension and type 2 diabetes.');
  M('B', 'Waist to hip ratio', 'Where should hip circumference be measured?', 'At the widest part of the buttocks', ['At the narrowest point of the waist', 'Just below the ribs', 'Around the thigh'], 'Waist is measured at the narrowest point; hips at the widest point.');
  TF('B', 'Body mass index (BMI)', 'A rugby player with a BMI of 31 must be obese.', false, 'BMI does not distinguish muscle from fat — use skinfolds or bioimpedance to check body fat.');
  TF('B', 'Resting heart rate', 'Endurance training usually lowers resting heart rate.', true, 'Cardiac hypertrophy increases stroke volume, so fewer beats are needed at rest.');
  TF('B', 'Screening questionnaires (lifestyle questionnaire, PAR-Q)', 'Every Pearson Unit 2 scenario allows all four health monitoring tests to be interpreted.', true, 'Examiner reports confirm all four tests and all seven lifestyle factors can be interpreted in every series.');

  // C
  M('C', 'Common terminology (RDA, energy measures, energy balance)', 'What is the UK guideline daily energy intake for an adult woman?', '2,000 kcal', ['1,500 kcal', '2,500 kcal', '3,000 kcal'], 'Women 2,000 kcal; men 2,500 kcal — adjusted for activity and goals.');
  M('C', 'Common terminology (RDA, energy measures, energy balance)', 'What is the UK guideline daily energy intake for an adult man?', '2,500 kcal', ['2,000 kcal', '1,800 kcal', '3,500 kcal'], 'The reference intake for men is 2,500 kcal.');
  M('C', 'Common terminology (RDA, energy measures, energy balance)', 'A client wants to lose weight. Which energy balance is needed?', 'Energy intake lower than energy expenditure', ['Energy intake higher than expenditure', 'Intake equal to expenditure', 'Expenditure of zero'], 'A negative energy balance (deficit) causes fat loss.');
  M('C', 'Common terminology (RDA, energy measures, energy balance)', 'A daily deficit of about how many kcal gives a safe weight loss of around 0.5 kg a week?', '500–600 kcal', ['100 kcal', '1,500 kcal', '2,000 kcal'], '0.5 kg of fat ≈ 3,850 kcal; ÷ 7 ≈ 550 kcal a day.');
  M('C', 'Common terminology (RDA, energy measures, energy balance)', 'How many kcal does 1 gram of fat provide?', '9 kcal', ['4 kcal', '7 kcal', '12 kcal'], 'Fat 9 kcal/g; carbohydrate and protein 4 kcal/g; alcohol 7 kcal/g.');
  M('C', 'Macronutrients (carbohydrates, fats, protein)', 'In what form is carbohydrate stored in the muscles and liver?', 'Glycogen', ['Glucose', 'Triglycerides', 'Amino acids'], 'Glycogen is the main fuel for moderate–high intensity exercise.');
  M('C', 'Macronutrients (carbohydrates, fats, protein)', 'Which is a complex carbohydrate?', 'Wholemeal pasta', ['Sweets', 'Fizzy drink', 'Honey'], 'Complex carbohydrates (starches) release energy slowly.');
  M('C', 'Macronutrients (carbohydrates, fats, protein)', 'Approximately what percentage of daily energy should come from carbohydrate for general health?', 'About 50%', ['About 10%', 'About 25%', 'About 80%'], 'UK guidance: about half of energy from carbohydrate, mainly starchy/wholegrain.');
  M('C', 'Macronutrients (carbohydrates, fats, protein)', 'An endurance athlete in heavy training needs roughly how much carbohydrate a day?', '7–10 g per kg of body mass', ['0.5–1 g per kg', '2–3 g per kg', '20–25 g per kg'], 'High-volume endurance training needs 7–10 g/kg/day to maintain glycogen.');
  M('C', 'Macronutrients (carbohydrates, fats, protein)', 'What is the main function of protein?', 'Growth and repair of body tissues', ['Main energy source during exercise', 'Insulation', 'Carrying oxygen'], 'Protein provides amino acids for muscle repair and growth, enzymes and hormones.');
  M('C', 'Macronutrients (carbohydrates, fats, protein)', 'What is the protein recommendation for a sedentary adult?', '0.75 g per kg of body mass per day', ['2.5 g per kg per day', '0.1 g per kg per day', '5 g per kg per day'], 'Athletes need more: about 1.2–1.4 (endurance) to 1.6–2.0 (strength) g/kg/day.');
  M('C', 'Macronutrients (carbohydrates, fats, protein)', 'Which food is the best source of protein?', 'Chicken breast', ['White rice', 'Apple', 'Olive oil'], 'Lean meat, fish, eggs, dairy, beans and lentils are protein sources.');
  M('C', 'Macronutrients (carbohydrates, fats, protein)', 'Which is a source of unsaturated fat?', 'Olive oil', ['Butter', 'Lard', 'Cream'], 'Unsaturated fats come mainly from plants and oily fish.');
  M('C', 'Macronutrients (carbohydrates, fats, protein)', 'Which vitamins are carried by fat (fat-soluble)?', 'A, D, E and K', ['B and C', 'C and D', 'B, C and E'], 'Fat-soluble vitamins are stored in the body; B and C are water-soluble.');
  M('C', 'Macronutrients (carbohydrates, fats, protein)', 'What is the recommended maximum for total fat intake?', 'About 35% of daily energy', ['About 5%', 'About 60%', 'About 80%'], 'Total fat ≤ 35% of energy, saturated ≤ 11%.');
  M('C', 'Micronutrients (vitamins A, B, C, D; calcium, iron)', 'Which mineral is needed to form haemoglobin?', 'Iron', ['Calcium', 'Sodium', 'Potassium'], 'Iron deficiency (anaemia) reduces oxygen transport and causes fatigue.');
  M('C', 'Micronutrients (vitamins A, B, C, D; calcium, iron)', 'Which vitamin helps the body absorb calcium?', 'Vitamin D', ['Vitamin C', 'Vitamin K', 'Vitamin B12'], 'Vitamin D (sunlight, oily fish, eggs) is essential for bone health.');
  M('C', 'Micronutrients (vitamins A, B, C, D; calcium, iron)', 'Which vitamin supports the immune system and helps iron absorption?', 'Vitamin C', ['Vitamin A', 'Vitamin K', 'Vitamin E'], 'Vitamin C is found in citrus fruits, peppers and berries.');
  M('C', 'Micronutrients (vitamins A, B, C, D; calcium, iron)', 'What is the maximum recommended salt intake for adults?', '6 g a day', ['1 g a day', '12 g a day', '20 g a day'], 'Too much salt raises blood pressure.');
  M('C', 'Micronutrients (vitamins A, B, C, D; calcium, iron)', 'How much fibre should adults eat each day?', '30 g', ['5 g', '60 g', '100 g'], 'Fibre aids digestion, controls cholesterol and helps fullness.');
  M('C', 'Hydration, dehydration and hyperhydration', 'Which is a sign of dehydration?', 'Dark yellow urine', ['Pale straw-coloured urine', 'Lower heart rate', 'Improved concentration'], 'Pale urine indicates good hydration; dark urine indicates dehydration.');
  M('C', 'Hydration, dehydration and hyperhydration', 'Losing about what percentage of body mass through sweat starts to impair performance?', '2%', ['0.1%', '10%', '25%'], 'Even 2% dehydration reduces endurance and concentration.');
  M('C', 'Hydration, dehydration and hyperhydration', 'After exercise, how much fluid should be drunk for every kilogram of body mass lost?', 'About 1.5 litres', ['About 250 ml', 'About 5 litres', 'None — wait until thirsty'], 'Replace around 150% of the fluid lost because some is lost as urine.');
  M('C', 'Hydration, dehydration and hyperhydration', 'Which sports drink has the same concentration as body fluids?', 'Isotonic', ['Hypotonic', 'Hypertonic', 'Diuretic'], 'Isotonic (4–8% carbohydrate) replaces fluid and energy during exercise.');
  M('C', 'Hydration, dehydration and hyperhydration', 'Which sports drink is best for rapid rehydration with little energy?', 'Hypotonic', ['Hypertonic', 'Isotonic', 'Protein shake'], 'Hypotonic drinks (< 4%) are absorbed fastest.');
  M('C', 'Hydration, dehydration and hyperhydration', 'Which drink is best for replacing glycogen after a long event?', 'Hypertonic', ['Hypotonic', 'Water only', 'Black coffee'], 'Hypertonic drinks (> 8%) provide a lot of carbohydrate.');
  M('C', 'Hydration, dehydration and hyperhydration', 'Drinking too much water during a very long event can dilute blood sodium. This is called…', 'Hyponatraemia', ['Hypertension', 'Hypoglycaemia', 'Hypothermia'], 'This is hyperhydration (over-hydration) — the spec requires its signs and symptoms: headache, nausea, confusion, swelling; it can be dangerous.');
  M('C', 'Ergogenic aids (energy gels and bars, protein drinks, carbohydrate loading)', 'Which ergogenic aid increases phosphocreatine stores?', 'Creatine', ['Caffeine', 'Iron tablets', 'Isotonic drinks'], 'Creatine supports the ATP-PC system for repeated short, maximal efforts.');
  M('C', 'Ergogenic aids (energy gels and bars, protein drinks, carbohydrate loading)', 'A common side-effect of creatine supplementation is…', 'Water retention and weight gain', ['Severe dehydration', 'Lower resting heart rate', 'Hair loss'], 'Creatine draws water into the muscles; cramps and stomach upset can also occur.');
  M('C', 'Ergogenic aids (energy gels and bars, protein drinks, carbohydrate loading)', 'Carbohydrate loading is most suitable for which athlete?', 'A marathon runner', ['A 100 m sprinter', 'A shot putter', 'A gymnast'], 'It maximises glycogen stores for endurance events over about 90 minutes.');
  M('C', 'Ergogenic aids (energy gels and bars, protein drinks, carbohydrate loading)', 'How does caffeine benefit endurance performance?', 'It reduces perceived effort and spares glycogen', ['It increases muscle mass', 'It improves flexibility', 'It increases haemoglobin'], 'Caffeine is a CNS stimulant; side-effects include insomnia, anxiety and GI upset.');
  M('C', 'Ergogenic aids (energy gels and bars, protein drinks, carbohydrate loading)', 'Ergogenic aids should only be recommended in the set task when…', 'The scenario is sport-specific, with side-effects explained', ['The client wants to lose weight', 'The client is sedentary', 'The client is over 65'], 'Examiner reports reward ergogenic aids for sport-specific scenarios.');
  M('C', 'Adapting diet to gain or lose weight', 'When should an athlete eat a main pre-competition meal?', '3–4 hours before', ['10 minutes before', '12 hours before', 'Straight after warming up'], 'This allows digestion while topping up glycogen; a small snack can be eaten about 1 hour before.');
  TF('C', 'Macronutrients (carbohydrates, fats, protein)', 'Protein is the body’s main source of energy during exercise.', false, 'Carbohydrate (and fat at low intensity) are the main fuels; protein is mainly for growth and repair.');
  TF('C', 'Adapting diet to gain or lose weight', 'In Activity 3, a weight-loss client should be placed in a calorie deficit.', true, 'Examiner reports: guidance must decrease calorie intake so the client works at a calorie deficit.');
  TF('C', 'Hydration, dehydration and hyperhydration', 'Thirst is an early warning sign that you are already becoming dehydrated.', true, 'By the time you feel thirsty you may have lost about 1–2% of body mass.');

  // D
  M('D', 'Components of fitness to be trained (physical fitness)', 'Which component of fitness is most important for a marathon runner?', 'Aerobic endurance', ['Power', 'Reaction time', 'Agility'], 'A marathon relies almost entirely on the aerobic energy system.');
  M('D', 'Components of fitness to be trained (physical fitness)', 'Which is a skill-related component of fitness?', 'Reaction time', ['Muscular endurance', 'Flexibility', 'Body composition'], 'Skill-related: agility, balance, coordination, power, reaction time.');
  M('D', 'Components of fitness to be trained (physical fitness)', 'Power is a combination of…', 'Strength and speed', ['Flexibility and balance', 'Aerobic and muscular endurance', 'Agility and coordination'], 'Power = strength × speed.');
  M('D', 'Components of fitness to be trained (physical fitness)', 'The ability to maintain the centre of mass over a base of support is…', 'Balance', ['Agility', 'Coordination', 'Core stability'], 'Static or dynamic balance.');
  M('D', 'Components of fitness to be trained (physical fitness)', 'Which component is the ratio of fat mass to fat-free mass?', 'Body composition', ['Muscular endurance', 'Flexibility', 'Speed'], 'Measured by skinfolds or bioimpedance.');
  M('D', 'Aerobic endurance training methods', 'Steady-pace exercise for 30+ minutes at 60–80% MHR is…', 'Continuous training', ['Fartlek training', 'Interval training', 'Plyometrics'], 'Continuous training develops aerobic endurance and burns fat.');
  M('D', 'Aerobic endurance training methods', 'Which training method means “speed play”?', 'Fartlek', ['Interval', 'Circuit', 'PNF'], 'Fartlek varies pace and terrain without stopping.');
  M('D', 'Aerobic endurance training methods', 'Interval training for speed should use which work:rest ratio?', '1:3 to 1:5 (long rest)', ['1:0.5 (short rest)', '1:1', 'No rest'], 'Long rest allows the ATP-PC system to recover for maximal efforts.');
  M('D', 'Aerobic endurance training methods', 'Which method is best for a client who gets bored easily and plays a stop-start team sport?', 'Fartlek training', ['Continuous training', 'Static stretching', 'Fixed resistance machines'], 'Fartlek replicates varied match intensity and adds variety.');
  M('D', 'Muscular strength training methods', 'To develop muscular strength, a client should lift…', 'High load (85%+ 1RM) for low reps', ['Low load for high reps', 'No load', 'Moderate load for 50 reps'], 'Strength: high load, 1–6 reps, long rest.');
  M('D', 'Muscular strength training methods', 'To develop muscular endurance, a client should lift…', 'Low load (50–60% 1RM) for high reps', ['Maximal load for 1 rep', '100% 1RM for 5 reps', 'Their body weight once'], 'Muscular endurance: 15–20+ reps with short rest.');
  M('D', 'Muscular strength training methods', 'Which is a specification training method for muscular strength?', 'Free weights', ['Weight training', 'Fartlek', 'Ballistic stretching'], '“Weight training” is NOT accepted by examiners — name free weights, fixed resistance machines or circuit training.');
  M('D', 'Muscular strength training methods', 'What does 1RM stand for?', 'One repetition maximum', ['One rest minute', 'One round of movements', 'One rate maximum'], 'The maximum load that can be lifted once with correct technique.');
  M('D', 'Power training methods', 'Box jumps, bounding and depth jumps are examples of…', 'Plyometrics', ['PNF', 'Fartlek', 'Core stability'], 'Plyometrics use the stretch-shortening cycle to develop power.');
  M('D', 'Power training methods', 'Plyometrics rely on which mechanism?', 'The stretch-shortening cycle', ['The ATP-PC system only', 'Static contractions', 'The Karvonen formula'], 'An eccentric stretch stores elastic energy before a powerful concentric contraction.');
  M('D', 'Flexibility training methods', 'Which flexibility method uses contracting the muscle against resistance before stretching further?', 'PNF stretching', ['Ballistic stretching', 'Static active stretching', 'Dynamic stretching'], 'PNF inhibits the stretch reflex, allowing a greater stretch.');
  M('D', 'Flexibility training methods', 'Which stretching method uses bouncing movements?', 'Ballistic', ['Static', 'PNF', 'Passive'], 'Ballistic stretching has a higher injury risk and suits only well-trained, sport-specific athletes.');
  M('D', 'Flexibility training methods', 'A partner holding a stretch for a client is an example of…', 'Passive static stretching', ['Active static stretching', 'Ballistic stretching', 'Plyometrics'], 'Passive = an external force (partner/apparatus); active = client’s own muscles.');
  M('D', 'Speed training methods', 'Sprinting with a parachute or sled is a…', 'Resistance drill', ['Hollow sprint', 'Fartlek session', 'Plyometric drill'], 'Resistance drills develop acceleration and speed.');
  M('D', 'Speed training methods', 'Sprint – jog – sprint repetitions are called…', 'Hollow sprints', ['Acceleration sprints', 'Interval walks', 'Fartlek'], 'The “hollow” is the jog/walk recovery between sprints.');
  M('D', 'Training methods for skill-related fitness components', 'Ladder and cone drills that improve footwork and change of direction are called…', 'SAQ training', ['PNF training', 'Continuous training', 'Circuit training'], 'Speed, agility and quickness.');
  M('D', 'Training methods for skill-related fitness components', 'Which training would best improve a goalkeeper’s reaction time?', 'Reaction-ball and shot-stopping drills', ['Continuous running', 'Static stretching', 'Fixed resistance machines'], 'Reaction drills respond to unpredictable stimuli.');
  M('D', 'Training methods for skill-related fitness components', 'A wobble board is used to train…', 'Balance', ['Power', 'Aerobic endurance', 'Speed'], 'Unstable surfaces challenge balance and proprioception.');
  M('D', 'Core stability training methods', 'Which exercise is a core stability exercise?', 'Plank', ['Bicep curl', 'Bench press', 'Calf raise'], 'Core stability uses planks, bridges and Swiss-ball exercises.');
  M('D', 'Training methods for physical fitness-related components', 'Which aerobic method is most suitable for an obese client with knee pain?', 'Aqua aerobics or swimming', ['Plyometrics', 'Hollow sprints', 'Ballistic stretching'], 'Buoyancy makes water-based exercise low-impact.');
  M('D', 'Training methods for physical fitness-related components', 'To reach the top band in Activity 4, a learner should propose methods for at least…', 'Four different components of fitness', ['One component', 'Two components', 'Ten components'], 'Examiner reports: at least one specification method for at least four different relevant components.');
  TF('D', 'Muscular strength training methods', 'Circuit training can develop both muscular endurance and aerobic endurance.', true, 'Station choice and work:rest ratio determine the main component developed.');
  TF('D', 'Flexibility training methods', 'Ballistic stretching is recommended for older clients.', false, 'Bouncing movements risk strains; static stretching is safer.');
  TF('D', 'Training methods for physical fitness-related components', 'Writing “weight training” is accepted as a training method in the Unit 2 set task.', false, 'It is not a specification method — use free weights, fixed resistance machines or circuit training.');

  // E
  M('E', 'Principles of training: FITT', 'In the FITT principle, “I” stands for…', 'Intensity', ['Individuality', 'Interval', 'Improvement'], 'Frequency, Intensity, Time, Type.');
  M('E', 'Principles of training: FITT', 'Increasing the number of sessions from 3 to 4 a week changes which part of FITT?', 'Frequency', ['Intensity', 'Time', 'Type'], 'Frequency = how often.');
  M('E', 'Principles of training: FITT', 'Changing from continuous running to fartlek training changes which part of FITT?', 'Type', ['Frequency', 'Time', 'Intensity'], 'Type = the method used.');
  M('E', 'Additional principles of training', 'Gradually increasing training load so the body continues to improve is…', 'Progressive overload', ['Reversibility', 'Specificity', 'Variation'], 'Increase F, I or T by small amounts (around 10% a week).');
  M('E', 'Additional principles of training', '“Use it or lose it” describes…', 'Reversibility', ['Adaptation', 'Progression', 'Individual needs'], 'Fitness gains are lost when training stops.');
  M('E', 'Additional principles of training', 'Training must match the demands of the sport. This is…', 'Specificity', ['Variation', 'Rest and recovery', 'Reversibility'], 'E.g. a sprinter focuses on speed and power.');
  M('E', 'Additional principles of training', 'Changing exercises and venues to avoid boredom and overuse injury is…', 'Variation', ['Specificity', 'Overload', 'Reversibility'], 'Variation maintains motivation and prevents plateaus.');
  M('E', 'Additional principles of training', 'Physiological changes such as a lower resting heart rate are called…', 'Adaptations', ['Reversibility', 'Overtraining', 'Periodisation'], 'Adaptations occur during rest and recovery.');
  M('E', 'Additional principles of training', 'Without enough rest between sessions a client risks…', 'Overtraining and injury', ['Faster adaptation', 'Reversibility only', 'Higher motivation'], 'Rest allows repair; too little rest causes fatigue, illness and injury.');
  M('E', 'Additional principles of training', 'To reach the top band in Activity 6, learners should justify FITT plus at least how many additional principles?', 'Six', ['One', 'Two', 'Ten'], 'Examiner reports: FITT plus at least six additional principles, justified in detail for the individual.');
  M('E', 'Principles of training: FITT', 'What is the estimated maximum heart rate of a 40-year-old?', '180 bpm', ['220 bpm', '160 bpm', '200 bpm'], 'MHR = 220 − age = 180 bpm.');
  M('E', 'Principles of training: FITT', 'A 20-year-old trains at 70% MHR. What is the target heart rate?', '140 bpm', ['154 bpm', '130 bpm', '160 bpm'], '220 − 20 = 200; 200 × 0.7 = 140 bpm.');
  M('E', 'Principles of training: FITT', 'Which formula uses heart rate reserve?', 'Karvonen formula', ['BMI formula', 'Borg formula', 'FITT formula'], 'Target HR = ((MHR − RHR) × %) + RHR.');
  M('E', 'Principles of training: FITT', 'On the Borg 6–20 RPE scale, what rating is roughly equivalent to moderate (“somewhat hard”) exercise?', '12–14', ['6–7', '18–20', '1–2'], 'RPE × 10 ≈ heart rate, so 13 ≈ 130 bpm.');
  M('E', 'Principles of training: FITT', 'How should intensity be stated for a strength session in Activity 5?', 'As a percentage of 1RM (or RPE)', ['In bpm only', 'As a BMI value', 'It does not need stating'], 'Examiner reports: %1RM for strength/muscular endurance; %MHR or bpm for aerobic work; RPE also accepted.');
  M('E', 'Principles of training: FITT', 'Which is the aerobic training zone?', '60–85% MHR', ['20–40% MHR', '90–100% MHR', '110% MHR'], 'Above about 85% the work becomes increasingly anaerobic.');
  M('E', 'Aims, objectives, personal goals (SMARTER) and resources', 'In SMARTER, the “E” and “R” at the end stand for…', 'Exciting and Recorded', ['Easy and Repeated', 'Effective and Reviewed', 'Enjoyable and Rested'], 'Examiner reports warn that learners lose marks by missing letters out — write the acronym in full and in order.');
  M('E', 'Aims, objectives, personal goals (SMARTER) and resources', 'Which is the best example of a SMARTER goal?', 'Run 5 km in under 30 minutes within 6 weeks, recorded in a training diary', ['Get fitter', 'Lose some weight soon', 'Train harder than last year'], 'It is specific, measurable, time-bound and recorded.');
  M('E', 'Aims, objectives, personal goals (SMARTER) and resources', 'Which is an objective rather than an aim?', 'Complete three 30-minute walks each week', ['Improve overall health', 'Become an Olympic champion', 'Feel better about myself'], 'Objectives are measurable steps towards the overall aim.');
  M('E', 'Periodisation (macrocycle, mesocycle, microcycle)', 'A six-week training block is an example of a…', 'Mesocycle', ['Macrocycle', 'Microcycle', 'Session'], 'Macrocycle = long-term (season/year), mesocycle = several weeks, microcycle = usually one week.');
  M('E', 'Periodisation (macrocycle, mesocycle, microcycle)', 'One week of training sessions is a…', 'Microcycle', ['Mesocycle', 'Macrocycle', 'Phase'], 'Microcycles are the shortest planned cycle.');
  M('E', 'Periodisation (macrocycle, mesocycle, microcycle)', 'Which phase of a season involves reducing training before a major competition?', 'Tapering (end of preparation / competition phase)', ['Transition phase', 'Pre-contemplation', 'Reversibility phase'], 'Tapering reduces volume so the athlete is rested and peaks.');
  M('E', 'Periodisation (macrocycle, mesocycle, microcycle)', 'The period of active rest after the competitive season is the…', 'Transition phase', ['Preparation phase', 'Competition phase', 'Loading phase'], 'Allows physical and mental recovery.');
  M('E', 'Periodisation (macrocycle, mesocycle, microcycle)', 'Which is the first part of a warm-up?', 'Pulse raiser', ['Static stretching', 'Main session', 'Cool-down'], 'Pulse raiser → mobility → dynamic stretches/sport-specific preparation.');
  M('E', 'Periodisation (macrocycle, mesocycle, microcycle)', 'Which type of stretching is best in a cool-down?', 'Static stretching', ['Ballistic stretching', 'Plyometric stretching', 'No stretching'], 'Static stretches help maintain flexibility and reduce stiffness after exercise.');
  M('E', 'Motivation', 'Receiving a trophy is an example of…', 'Extrinsic motivation', ['Intrinsic motivation', 'Specificity', 'Self-talk'], 'Extrinsic = external rewards; intrinsic = enjoyment and satisfaction.');
  M('E', 'Motivation', 'Which strategy best improves programme adherence?', 'Recording progress and reviewing goals regularly', ['Making every session maximal', 'Never changing the programme', 'Training with no rest days'], 'Seeing progress and having goals increases motivation.');
  TF('E', 'Activity 5', 'In Activity 5, intensity values only need to be given for one session.', false, 'Intensity must be stated for most sessions (bpm/%MHR, %1RM or RPE).');
  TF('E', 'Activity 6', 'Describing what the client does on each day is enough to justify the programme in Activity 6.', false, 'Learners must justify using the principles of training — describing days alone shows limited understanding.');
  TF('E', 'Periodisation (macrocycle, mesocycle, microcycle)', 'A macrocycle is the longest training cycle.', true, 'Macrocycles cover a season or year (or Olympic cycle).');

  /* ── Flashcards ───────────────────────────────────────────────────── */
  const FLASHCARDS = [];
  let fn = 0;
  function F(aim, front, back) { fn++; FLASHCARDS.push({ id: 'FC-U2-' + String(fn).padStart(3, '0'), learning_aim: aim, front, back }); }

  F('A', 'Adult physical activity guideline (19–64)', '150 min moderate OR 75 min vigorous a week, strength activities on 2+ days, minimise sitting.');
  F('A', 'Children & young people (5–18) guideline', 'Average 60 minutes of moderate-to-vigorous activity a day across the week.');
  F('A', 'Older adults (65+) guideline', 'As adults + balance and flexibility activities on 2+ days and breaking up long periods of sitting.');
  F('A', 'Physical benefits of activity', '↓ risk of CHD, stroke, hypertension, type 2 diabetes, obesity, osteoporosis, some cancers; ↓RHR & BP; better cholesterol.');
  F('A', 'Psychological benefits of activity', 'Endorphins → ↓ stress, anxiety and depression; ↑ self-esteem, confidence, sleep quality.');
  F('A', 'Social benefits of activity', 'New friends, teamwork, belonging, reduced isolation.');
  F('A', 'Carbon monoxide (smoking)', 'Binds to haemoglobin (carboxyhaemoglobin) → less O₂ carried → lower aerobic endurance.');
  F('A', 'Nicotine', 'Addictive stimulant → ↑HR, ↑BP, vasoconstriction, ↑ risk of clots.');
  F('A', 'Tar', 'Coats the lungs, damages cilia/alveoli; carcinogenic → lung cancer, COPD.');
  F('A', 'Long-term effects of smoking', 'Lung/mouth/throat cancer, CHD, stroke, COPD (emphysema, bronchitis), hypertension.');
  F('A', 'Alcohol guideline', '≤ 14 units a week (men and women), spread over 3+ days with drink-free days.');
  F('A', 'Calculating units', 'Units = ABV% × volume (ml) ÷ 1000. A pint of 4% lager ≈ 2.3 units; a 175 ml glass of 12% wine ≈ 2.1 units.');
  F('A', 'Effects of excess alcohol', 'Empty calories (7 kcal/g), dehydration, poor sleep/recovery, ↑BP, liver cirrhosis, CHD, cancers, depression.');
  F('A', 'Stress — physiological effects', 'Adrenaline & cortisol → ↑HR, ↑BP, muscle tension, headaches, poor sleep; long term hypertension, CHD, weak immunity.');
  F('A', 'Stress — behavioural effects', 'Comfort eating, more smoking/drinking, withdrawing socially, poor sleep.');
  F('A', 'Recommended sleep', 'Adults 7–9 hours; teenagers 8–10 hours.');
  F('A', 'Effects of insufficient sleep', 'Fatigue, poor concentration & reaction time, poor recovery, weight gain (↑ghrelin ↓leptin), weak immunity, low mood.');
  F('A', 'Sedentary lifestyle', 'Long periods sitting/little activity → ↑ obesity, CHD, type 2 diabetes, osteoporosis, back pain, poor posture.');
  F('A', 'Effects of a poor diet', 'High saturated fat → ↑LDL, atherosclerosis; high sugar → weight gain, T2D; high salt → hypertension; low fibre.');
  F('A', 'Increasing physical activity — techniques', 'Active travel, stairs, breaking up sitting, GP exercise referral, walking groups/classes, Couch to 5K, parkrun, home workouts.');
  F('A', 'Smoking cessation — techniques', 'NHS Stop Smoking Service, NRT (patches, gum, lozenges, inhalator), medication (varenicline), e-cigarettes, quit date, apps, support groups.');
  F('A', 'Reducing alcohol — techniques', 'Drink diary, weekly limit, drink-free days, smaller/lower-strength drinks, alternate with water, counselling, Alcoholics Anonymous.');
  F('A', 'Stress management — cognitive', 'Positive self-talk, thought stopping, imagery/visualisation.');
  F('A', 'Stress management — relaxation', 'Progressive muscular relaxation, breathing control, meditation/mindfulness, yoga.');
  F('A', 'Stress management — other', 'Time management (prioritising, to-do lists), exercise, talking therapies, removing stressors.');
  F('A', 'Barriers to change', 'Time, cost, motivation/confidence, addiction/withdrawal, peer pressure, access to facilities, health conditions.');
  F('A', 'Stages of change model', 'Pre-contemplation → contemplation → preparation → action → maintenance (relapse possible).');
  F('A', 'Activity 2 top band', 'Spec technique for ≥ 3 negative factors + detailed justification for THIS client + barriers to change + prioritise which change matters most.');

  F('B', 'PAR-Q', 'Physical Activity Readiness Questionnaire — identifies risks; any “yes” → GP clearance before exercise.');
  F('B', 'Lifestyle questionnaire sections', 'Personal details, occupation, current activity, nutritional status (food diary), lifestyle (alcohol, smoking, stress, sleep), health tests, goals, declaration.');
  F('B', 'Informed consent', 'Client signs to show they understand procedures, risks and their right to withdraw; protects client and instructor.');
  F('B', 'Confidentiality', 'Store data securely (GDPR), share only with consent / need to know (e.g. GP).');
  F('B', 'Blood pressure — systolic', 'Pressure in arteries when ventricles contract (top number).');
  F('B', 'Blood pressure — diastolic', 'Pressure in arteries when ventricles relax (bottom number).');
  F('B', 'BP classification', 'Optimal < 120/80 · Normal 120–129/80–84 · High normal 130–139/85–89 · Grade 1 140–159/90–99 · Grade 2 160–179/100–109 · Grade 3 ≥ 180/110. Use the higher category.');
  F('B', 'BP test procedure', 'Seated 5 min, no caffeine/smoking/exercise beforehand, correct cuff at heart level, two readings averaged, recorded in mmHg.');
  F('B', 'Causes of high BP', 'Smoking, alcohol, stress, obesity, high salt, inactivity, age, genetics.');
  F('B', 'Resting heart rate norms (approx.)', '< 60 athletic · 60–69 good · 70–79 average · 80–89 below average · 90–100 poor · > 100 tachycardia (refer).');
  F('B', 'Why athletes have a low RHR', 'Cardiac hypertrophy → bigger stroke volume → fewer beats needed at rest.');
  F('B', 'Measuring RHR', 'Radial (wrist) or carotid (neck) pulse after 5–10 min rest / on waking, count 60 s (or HR monitor).');
  F('B', 'BMI formula', 'Mass (kg) ÷ height (m)².');
  F('B', 'BMI categories', '< 18.5 underweight · 18.5–24.9 healthy · 25–29.9 overweight · 30–39.9 obese · 40+ severely obese.');
  F('B', 'BMI limitation', 'Doesn’t distinguish muscle from fat (or fat distribution) — muscular athletes misclassified.');
  F('B', 'Waist-to-hip ratio', 'Waist (narrowest point) ÷ hips (widest point). Indicates central/visceral fat.');
  F('B', 'WHR risk — women', 'Low ≤ 0.80 · moderate 0.81–0.85 · high > 0.85.');
  F('B', 'WHR risk — men', 'Low ≤ 0.95 · moderate 0.96–1.0 · high > 1.0.');
  F('B', 'Apple vs pear shape', 'Apple = fat around waist (higher CHD/T2D risk); pear = fat around hips (lower risk).');
  F('B', 'Activity 1 top band', 'All 7 lifestyle factors described + detailed impact on THIS client’s health + all 4 tests interpreted against norms and linked to lifestyle.');

  F('C', 'Guideline daily energy', 'Women 2,000 kcal; men 2,500 kcal — adjust for goal and activity.');
  F('C', 'Energy per gram', 'Carbohydrate 4 · protein 4 · alcohol 7 · fat 9 kcal/g.');
  F('C', 'Energy balance', 'Intake = expenditure → weight maintained; deficit → loss; surplus → gain.');
  F('C', 'Safe weight loss', '0.5–1 kg a week ≈ 500–600 kcal/day deficit (1 kg fat ≈ 7,700 kcal).');
  F('C', 'BMR', 'Energy used at complete rest to maintain vital functions; affected by age, sex, size, muscle mass, genetics.');
  F('C', 'Carbohydrate — function & sources', 'Main energy source, stored as glycogen. Complex: pasta, rice, oats, potatoes, bread. Simple: fruit, sugar.');
  F('C', 'Carbohydrate quantities', 'General ~50% of energy; athletes 5–7 g/kg/day; endurance 7–10 g/kg/day.');
  F('C', 'Protein — function & sources', 'Growth & repair, enzymes, hormones. Meat, fish, eggs, dairy, beans, lentils, tofu, nuts.');
  F('C', 'Protein quantities', 'Sedentary 0.75 g/kg/day · endurance 1.2–1.4 · strength/power 1.6–2.0 g/kg/day.');
  F('C', 'Fat — function', 'Energy (low intensity), insulation, organ protection, carries vitamins A, D, E, K, hormones.');
  F('C', 'Fat — guideline & types', '≤ 35% energy; saturated ≤ 11% (men < 30 g, women < 20 g). Unsaturated: olive oil, nuts, oily fish. Saturated: butter, cheese, fatty meat.');
  F('C', 'Fat-soluble vitamins', 'A (vision, immunity), D (calcium absorption, bones), E (antioxidant), K (blood clotting).');
  F('C', 'Water-soluble vitamins', 'B group (energy release from food), C (immunity, repair, iron absorption).');
  F('C', 'Calcium', 'Bones, teeth, muscle contraction, nerves — dairy, leafy greens, fortified foods (700 mg/day).');
  F('C', 'Iron', 'Haemoglobin → oxygen transport — red meat, beans, spinach, fortified cereal. Deficiency = anaemia (fatigue).');
  F('C', 'Sodium / salt', 'Fluid balance & nerves; ≤ 6 g salt a day — excess raises BP.');
  F('C', 'Fibre', '30 g/day — digestion, cholesterol control, fullness. Wholegrains, fruit, veg, beans.');
  F('C', 'Daily fluid guideline', '6–8 glasses (1.5–2 L) a day; more for training and heat.');
  F('C', 'Hydration around exercise', 'Before 400–600 ml (2–3 h); during 150–250 ml every 15–20 min; after 1.5 L per kg lost.');
  F('C', 'Signs of dehydration', 'Thirst, dark urine, headache, dizziness, fatigue, cramps, ↓ performance (2% loss impairs performance).');
  F('C', 'Hypotonic / isotonic / hypertonic', 'Hypotonic < 4% (fast rehydration) · isotonic 4–8% (fluid + energy during) · hypertonic > 8% (energy, after).');
  F('C', 'Creatine', '↑ phosphocreatine → repeated maximal efforts (sprint/power). Side-effects: water retention, weight gain, cramps.');
  F('C', 'Caffeine', 'Stimulant: ↑ alertness, ↓ RPE, glycogen sparing (endurance). Side-effects: insomnia, anxiety, GI upset, ↑HR.');
  F('C', 'Carbohydrate loading', 'Taper + 10–12 g/kg/day carbohydrate for 36–48 h before endurance events (> 90 min). Side-effect: bloating/heaviness.');
  F('C', 'Pre-event meal', 'High-carb, low-fat, low-fibre meal 3–4 h before; small snack ~1 h before.');
  F('C', 'Activity 3 top band', 'RDA kcal (deficit if weight loss) + all 3 macros with quantities & sources + micronutrients + hydration (+ ergogenic aids if sport) — all justified for the client.');

  Object.entries(U2.COMPONENTS).forEach(([name, info]) => {
    F('D', name + ' — definition', info.def);
    F('D', name + ' — training methods', info.methods.join('; ') + '.');
  });
  F('D', 'Continuous training', 'Steady pace, no rest, ≥ 30 min at 60–80% MHR — aerobic endurance, fat burning. Low skill; can be boring.');
  F('D', 'Fartlek training', '“Speed play” — continuous with varied pace/terrain; aerobic + anaerobic; sport-specific for team games.');
  F('D', 'Interval training', 'Work periods + rest periods. Aerobic: longer work, short rest. Speed/anaerobic: short maximal work, long rest (1:3–1:5).');
  F('D', 'Circuit training', 'Stations for set time/reps with short rest; muscular endurance, aerobic endurance or skills.');
  F('D', 'Free weights vs fixed resistance machines', 'Free weights: more muscles/stabilisers, functional, need technique/spotter. Machines: fixed path, safer for beginners.');
  F('D', 'Strength prescription', '85%+ 1RM, 1–6 reps, 2–5 min rest.');
  F('D', 'Muscular endurance prescription', '50–60% 1RM, 15–20+ reps, 30–60 s rest.');
  F('D', 'PNF stretching', 'Stretch → isometric contraction against resistance 6–10 s → relax → stretch further. Advanced, needs partner.');
  F('D', 'Static stretching', 'Hold 10–30 s still. Active = own muscles; passive = partner/apparatus. Safest method.');
  F('D', 'Ballistic stretching', 'Bouncing/swinging beyond normal range. Sport-specific; injury risk — not for beginners/older clients.');
  F('D', '“Weight training” in the set task', 'NOT accepted. Name free weights, fixed resistance machines or circuit training.');
  F('D', 'Activity 4 top band', 'A spec method for ≥ 4 relevant components, each justified for the client, stating which is most appropriate and why.');
  F('D', 'Low-impact options', 'Swimming, aqua aerobics, cycling, cross-trainer, walking — for obese, older, injured or arthritic clients.');

  F('E', 'FITT', 'Frequency · Intensity · Time · Type.');
  Object.entries(U2.PRINCIPLES).forEach(([name, text]) => { if (name !== 'FITT') F('E', name, text); });
  F('E', 'Aims vs objectives', 'Aim = overall long-term goal; objectives = measurable steps to reach it.');
  F('E', 'SMARTER', 'Specific · Measurable · Achievable · Realistic · Time-related · Exciting · Recorded.');
  F('E', 'Goal timescales', 'Short-term: days–weeks · medium: 1–3 months · long-term: 6 months+.');
  F('E', 'Resources', 'Facilities, equipment, qualified staff, time, cost, transport, HR monitor, training diary.');
  F('E', 'Maximum heart rate', 'MHR = 220 − age.');
  F('E', 'Karvonen formula', 'THR = ((MHR − RHR) × %intensity) + RHR — uses heart rate reserve.');
  F('E', 'Training zones', 'Aerobic 60–85% MHR; health/beginners 50–65%; anaerobic > 85%.');
  F('E', 'Borg RPE scale', '6–20; ×10 ≈ HR. 12–14 = somewhat hard (moderate). CR10 version: 0–10.');
  F('E', 'Intensity in Activity 5', 'Aerobic: %MHR/%HRR or bpm. Strength/ME: %1RM. RPE accepted. State it for most sessions.');
  F('E', 'Macrocycle', 'Long-term plan — season, year or Olympic cycle.');
  F('E', 'Mesocycle', 'Block of several weeks with a specific aim — the 6-week programme.');
  F('E', 'Microcycle', 'Usually one week of training.');
  F('E', 'Periodisation phases', 'Preparation (general → specific) → competition (incl. taper) → transition (active rest).');
  F('E', 'Warm-up', 'Pulse raiser → mobility → dynamic stretches/sport-specific rehearsal. ↑ temp, HR, blood flow; ↓ injury.');
  F('E', 'Cool-down', 'Gradual decrease in intensity + static stretching — removes lactic acid, prevents blood pooling, ↓ DOMS.');
  F('E', 'Intrinsic vs extrinsic motivation', 'Intrinsic: enjoyment/satisfaction. Extrinsic: rewards, trophies, praise, money.');
  F('E', 'Improving adherence', 'SMARTER goals, recording/reviewing progress, praise/rewards, variety/enjoyment, social support, planning around barriers.');
  F('E', 'Activity 5 top band', '≥ 3 relevant components, FITT in full with intensities, progression from week 1 → 6, variation, rest days, individual needs.');
  F('E', 'Activity 6 top band', 'FITT + ≥ 6 other principles justified for the client, plus aims/objectives, SMARTER (in full), periodisation and resources.');

  /* ── Additional items aligned to the Unit 2 specification (Issue 9) ── */
  K('A', 'Exercise/physical activity (physical, chronic disease, psychological, social, economic)', 'Describe', 2, 'Describe two economic benefits of people taking part in regular physical activity.', ['Reduces costs to the National Health Service (fewer people with chronic diseases)', 'Reduces absenteeism from work (fewer sick days, more productive workforce)']);
  K('A', 'Balanced diet (eatwell plate, benefits, fluid intake, strategies)', 'Give', 3, 'Give three strategies for improving dietary intake.', ['Timing of meals (regular meals, eat breakfast)', 'Eating less/more of certain food groups', 'Five a day (fruit and vegetables)', 'Reducing salt intake', 'Healthy alternatives (e.g. grilled not fried)']);
  K('A', 'Balanced diet (eatwell plate, benefits, fluid intake, strategies)', 'Identify', 3, 'Identify three benefits of a healthy, balanced diet.', ['Improved immune function', 'Maintenance of body weight', 'Reduced risk of chronic diseases (diabetes, osteoporosis, hypertension, high cholesterol)']);
  K('A', 'Positive risk-taking activities', 'Explain', 2, 'Explain how positive risk-taking activities benefit well-being.', ['Outdoor and adventurous activities (e.g. climbing, kayaking) release endorphins', 'which improves mood and builds confidence/self-esteem (1)']);
  K('A', 'Smoking', 'Identify', 2, 'Identify two health risks of smoking listed in the specification other than cancer.', ['CHD', 'Lung disease', 'Bronchitis', 'Infertility']);
  K('A', 'Stress', 'Identify', 3, 'Identify three health risks associated with excessive stress.', ['Hypertension', 'Angina', 'Stroke', 'Heart attack', 'Stomach ulcers', 'Depression']);
  K('A', 'Sleep', 'State', 2, 'State two problems associated with lack of sleep named in the specification.', ['Depression', 'Overeating']);
  K('B', 'Legal considerations (informed consent, data protection, client confidentiality)', 'Explain', 2, 'Explain why data protection must be considered when screening a client.', ['Screening forms contain personal and health information', 'which must be stored securely and only used/shared lawfully with the client’s consent (GDPR / Data Protection Act) (1)']);
  K('B', 'Interpreting the results of health monitoring tests', 'Explain', 2, 'Explain why a resting heart rate of 45 bpm is interpreted differently for an elite marathon runner than for a sedentary office worker.', ['Results are compared with different norms — population norms vs norms for sports performers/elite athletes', 'for the athlete it shows a highly trained heart (large stroke volume); for a sedentary person it would be unusual and may need referral (1)']);
  K('C', 'Common terminology (RDA, energy measures, energy balance)', 'Define', 2, 'Define recommended daily allowance (RDA) and kilocalorie.', ['RDA — the amount of a nutrient/energy needed each day to meet the needs of most healthy people', 'Kilocalorie — 1,000 calories; the energy needed to raise 1 kg of water by 1 °C (1 kcal ≈ 4.2 kJ) (1)']);
  K('C', 'Common terminology (RDA, energy measures, energy balance)', 'Identify', 4, 'Identify four factors that affect a person’s energy requirements (energy balance).', ['Basal metabolism', 'Age', 'Gender', 'Climate', 'Physical activity (intensity and length of time)']);
  K('C', 'Hydration, dehydration and hyperhydration', 'Describe', 2, 'Describe hyperhydration and one sign or symptom.', ['Drinking too much fluid so blood sodium becomes diluted (over-hydration)', 'Sign: headache / nausea / confusion / swelling of hands and feet / in severe cases seizures (1)']);
  K('C', 'Hydration, dehydration and hyperhydration', 'Identify', 3, 'Identify three factors that change a person’s fluid requirements.', ['Climate (hot/humid)', 'Level of exercise', 'Programme type', 'Time of year']);
  K('C', 'Ergogenic aids (energy gels and bars, protein drinks, carbohydrate loading)', 'Describe', 3, 'Describe one positive effect, one negative effect and the recommended timing of energy gels.', ['Positive: quick, easily digested carbohydrate that maintains blood glucose and delays fatigue', 'Negative: can cause stomach upset/bloating; high sugar', 'Timing: during endurance events/sessions over about 60–90 minutes, e.g. every 30–45 minutes with water']);
  K('C', 'Ergogenic aids (energy gels and bars, protein drinks, carbohydrate loading)', 'Explain', 2, 'Explain when protein drinks may be used in a training programme.', ['Soon after (within about 30–60 min) resistance or hard training sessions', 'to provide convenient protein for muscle repair and growth — unnecessary if the diet already provides enough (1)']);
  K('D', 'Muscular strength training methods', 'Describe', 2, 'Describe pyramid sets.', ['Each set increases the load and decreases the repetitions (e.g. 10 reps at 70% 1RM → 8 → 6 → 4 at 90%)', 'used with free weights or fixed resistance machines to develop strength (1)']);
  K('D', 'Core stability training methods', 'Give', 3, 'Give three core stability training methods named in the specification.', ['Pilates', 'Yoga', 'Gym-based exercises (plank, bridge, V-sit)']);
  K('D', 'Flexibility training methods', 'Describe', 3, 'Describe the three principles of flexibility training.', ['Maintenance — stretching to keep current range of movement', 'Developmental — holding stretches longer to increase range of movement', 'Pre-activity — stretching to prepare the body before exercise']);
  K('D', 'Speed training methods', 'Give', 2, 'Give two types of resistance drill used for speed training.', ['Hill runs', 'Parachutes', 'Sleds', 'Bungee ropes']);
  M('A', 'Exercise/physical activity', 'Which is an economic benefit of regular physical activity?', 'Reduced costs to the National Health Service', ['Improved posture', 'Enhanced self-esteem', 'Stronger bones'], 'Spec A1: economic benefits — reduces NHS costs and absenteeism from work.');
  M('A', 'Positive risk-taking activities', 'Which is an example of a positive risk-taking activity?', 'Rock climbing', ['Smoking', 'Binge drinking', 'Watching television'], 'Outdoor and adventurous activities release endorphins and improve confidence.');
  M('A', 'Sleep', 'Which problems does the specification link to lack of sleep?', 'Depression and overeating', ['Infertility and bronchitis', 'Cirrhosis and stroke', 'Angina and stomach ulcers'], 'Spec A2: sleep — depression, overeating.');
  M('A', 'Stress', 'Which health risk is associated with excessive stress?', 'Stomach ulcers', ['Cirrhosis', 'Infertility', 'Osteoporosis'], 'Spec A2 stress risks: hypertension, angina, stroke, heart attack, stomach ulcers, depression.');
  M('A', 'Smoking', 'Which health risk of smoking is named in the specification?', 'Infertility', ['Osteoporosis', 'Type 1 diabetes', 'Anaemia'], 'Spec A2 smoking risks: CHD, cancer, lung disease, bronchitis, infertility.');
  M('A', 'Alcohol', 'Which health risk is associated with excessive alcohol consumption?', 'Cirrhosis', ['Infertility', 'Bronchitis', 'Angina'], 'Spec A2 alcohol risks: stroke, cirrhosis, hypertension, depression.');
  M('B', 'Legal considerations', 'Which is a legal consideration in the screening process?', 'Data protection', ['Pyramid sets', 'Carbohydrate loading', 'Fartlek'], 'Spec B1: informed consent form, data protection, client confidentiality.');
  M('B', 'Interpreting results', 'Results should be compared against which norms?', 'Population norms, sports performer norms, elite athlete norms and accepted health ranges', ['Only the client’s previous results', 'The tester’s own results', 'No comparison is needed'], 'Spec B3 lists all four comparisons.');
  M('C', 'Common terminology', 'Approximately how many kilojoules are in 1 kilocalorie?', '4.2 kJ', ['1 kJ', '10 kJ', '100 kJ'], '1 kcal ≈ 4.184 kJ.');
  M('C', 'Common terminology', 'Which factor affects energy balance according to the specification?', 'Climate', ['Eye colour', 'Shoe size', 'Blood type'], 'Spec C1: basal metabolism, age, gender, climate, physical activity.');
  M('C', 'Ergogenic aids (energy gels and bars, protein drinks, carbohydrate loading)', 'Which ergogenic aid is best taken during a marathon?', 'Energy gels', ['Protein drinks', 'Carbohydrate loading', 'Hypertonic drink before starting only'], 'Gels provide quick carbohydrate during long events; carb loading is done in the days before.');
  M('C', 'Ergogenic aids (energy gels and bars, protein drinks, carbohydrate loading)', 'A negative effect of carbohydrate loading is…', 'Weight gain and bloating from water stored with glycogen', ['Lower glycogen stores', 'Dehydration', 'Loss of muscle mass'], 'Each gram of glycogen is stored with water.');
  M('C', 'Ergogenic aids (energy gels and bars, protein drinks, carbohydrate loading)', 'Protein drinks are best taken…', 'Within about an hour after resistance training', ['During a 100 m sprint', 'Only on rest days', 'Instead of all meals'], 'Post-exercise protein supports muscle repair.');
  M('C', 'Hydration, dehydration and hyperhydration', 'Which is a symptom of hyperhydration?', 'Headache, nausea and confusion', ['Dark urine', 'Dry mouth', 'Thirst'], 'Dark urine, dry mouth and thirst are signs of dehydration.');
  M('D', 'Strength', 'Increasing the load and reducing the repetitions each set is called…', 'Pyramid sets', ['Hollow sprints', 'Fartlek', 'PNF'], 'Spec D2.2: pyramid sets.');
  M('D', 'Core stability training methods', 'Which is a core stability training method named in the specification?', 'Pilates', ['Hollow sprints', 'Fartlek', 'Acceleration sprints'], 'Spec D2.4: pilates, yoga, gym-based exercises (plank, bridge, V-sit).');
  M('D', 'Flexibility training methods', 'Stretching to increase range of movement is which principle of flexibility training?', 'Developmental', ['Maintenance', 'Pre-activity', 'Reversibility'], 'Spec D2.5 principles: maintenance, developmental, pre-activity.');
  M('D', 'Speed training methods', 'Which is a speed resistance drill named in the specification?', 'Bungee ropes', ['Plank', 'Static stretching', 'Pilates'], 'Spec D2.6 resistance drills: hill runs, parachutes, sleds, bungee ropes.');
  M('D', 'Components of fitness to be trained (physical fitness)', 'In the specification, power is classed as…', 'A skill-related component of fitness', ['A physical component of fitness', 'A principle of training', 'A health monitoring test'], 'Spec D1.1 skill-related: agility, balance, coordination, reaction time, power.');
  M('E', 'Programme design', 'In programme design, “resources required” refers to…', 'Facilities and equipment', ['Food and drink', 'Sleep and rest', 'Money only'], 'Spec E1: resources required — facilities and equipment.');
  F('A', 'Economic benefits of physical activity', 'Reduces costs to the National Health Service; reduces absenteeism from work.');
  F('A', 'Eatwell plate & dietary strategies', 'Food groups in the right proportions. Strategies: timing of meals, eating less/more of certain food groups, five a day, reducing salt, healthy alternatives; moderate caffeine intake.');
  F('A', 'Positive risk-taking activities', 'Outdoor and adventurous activities → endorphin release and improved confidence.');
  F('A', 'Government recommendations', 'UK guidelines for physical activity, alcohol (≤ 14 units/week) and healthy eating (eatwell, five a day).');
  F('A', 'Spec health risks', 'Smoking: CHD, cancer, lung disease, bronchitis, infertility. Alcohol: stroke, cirrhosis, hypertension, depression. Stress: hypertension, angina, stroke, heart attack, stomach ulcers, depression. Sleep: depression, overeating.');
  F('A', 'Barriers to change (spec)', 'Time, cost, transport, location.');
  F('A', 'Smoking cessation (spec)', 'Acupuncture, NHS smoking helpline, NHS smoking services, nicotine replacement therapy, Quit Kit support packs.');
  F('A', 'Reducing alcohol (spec)', 'Counselling, self-help groups, alternative treatments.');
  F('A', 'Stress management (spec)', 'Assertiveness training, goal setting, time management, physical activity, positive self-talk, relaxation, breathing techniques, meditation, alternative therapies, changes to work-life balance.');
  F('B', 'Legal considerations', 'Informed consent form, data protection, client confidentiality.');
  F('B', 'Interpreting results (B3)', 'Compare against population norms, norms for sports performers, norms for elite athletes and accepted health ranges, then make judgements.');
  F('C', 'Energy measures', 'Calories, joules, kilocalories, kilojoules. 1 kcal ≈ 4.2 kJ.');
  F('C', 'Energy balance factors', 'Basal metabolism, age, gender, climate, physical activity (intensity and length of time).');
  F('C', 'Hyperhydration', 'Over-hydration diluting blood sodium. Signs: headache, nausea, confusion, swelling; can be dangerous.');
  F('C', 'Fluid requirements depend on', 'Climate, level of exercise, programme type, time of year.');
  F('C', 'Energy gels and bars', 'Quick carbohydrate during/before long sessions. + maintains blood glucose. − stomach upset, high sugar. Timing: every 30–45 min in events > 60–90 min.');
  F('C', 'Protein drinks', 'Convenient protein for repair after training (within ~30–60 min). − cost, unnecessary if diet adequate.');
  F('D', 'Pyramid sets', 'Load increases and reps decrease each set (strength training with free weights/machines).');
  F('D', 'Core stability methods', 'Pilates, yoga, plank, bridge, V-sit; equipment: free weights, machines, kettlebells, bands, stability balls.');
  F('D', 'Flexibility principles', 'Maintenance, developmental, pre-activity. Methods: static (active, passive), PNF.');
  F('D', 'Speed resistance drills', 'Hill runs, parachutes, sleds, bungee ropes.');
  F('E', 'Resources required', 'Facilities and equipment.');

  // Remove items that go beyond the Unit 2 specification.
  const OFF_SPEC = /creatine|caffeine as an ergogenic|caffeine benefit|caffeine \(|ballistic|stages of change|transtheoretical|pre-contemplation|maintenance\b.*stage|intrinsic|extrinsic|adherence|progressive muscular relaxation|varenicline/i;
  const keep = (x) => !OFF_SPEC.test([x.question, x.front, x.back, (x.choices || []).join(' '), x.explanation, (x.mark_scheme && x.mark_scheme.points || []).join(' ')].join(' '));
  for (const arr of [KNOWLEDGE, QUIZ, FLASHCARDS]) { const kept = arr.filter(keep); arr.length = 0; kept.forEach(x => arr.push(x)); }

  window.U2 = Object.assign(window.U2 || {}, { KNOWLEDGE, CALCS, QUIZ, FLASHCARDS });
})();
