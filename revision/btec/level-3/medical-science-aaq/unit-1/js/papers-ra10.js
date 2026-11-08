/* BTEC Medical Science (AAQ) Unit 1 — RA10 practice papers.
   Same layout as the Pearson sample: 1 hour 30 minutes, 80 marks, 17 questions in one section, mixing recall,
   figure-based questions written so they can be answered from the description, calculations and three 9-mark “discuss” questions.
   Mark schemes are RA10’s own. */
(function () {
  'use strict';
  function Q(n, ctx, parts) {
    return parts.map((p, i) => ({ q: n, sub: p[0], marks: p[1], section: 'Q' + n, ctx: i === 0 ? ctx : (p[4] || []), text: p[2], ms: { body: p[3], levels: null } }));
  }
  const L = (...lines) => lines.join('\n');
  const MC = (stem, opts) => stem + '\n' + opts.map((o, i) => 'ABCD'[i] + '  ' + o).join('\n');
  const IND = (...lines) => L('Indicative content – credit other valid biology. Answers should link structure to function in a logical sequence:', ...lines.map(x => '• ' + x), 'Award marks using the 9-mark levels (best fit).');
  function paper(n, title, blurb, qs) {
    const items = [].concat(...qs);
    return { id: 'MS1-R' + String(n).padStart(2, '0'), unit: 1, key: 'R' + String(n).padStart(2, '0'), source: 'ra10', spec: 'ra10', kind: 'exam', code: 'RA10',
      series: 'RA10 Paper ' + n, date: 'RA10 practice paper ' + n, title, blurb, minutes: 90, items, total: items.reduce((s, x) => s + x.marks, 0) };
  }
  const papers = [];

  /* ---------- Paper 1 ---------- */
  papers.push(paper(1, 'Carbohydrates · synapses · alveoli · nephron – 3 × 9-mark discussions', 'Molecules, nerve transmission, gas exchange, kidney function and muscle.', [
    Q(1, ['Figure 1 shows two molecules. Molecule R is a single glucose unit. Molecule S is made of a glucose and a fructose unit joined together.'], [
      ['a(i)', 1, 'Identify the type of molecule labelled R.', L('Award one mark for:', '• monosaccharide (accept hexose)')],
      ['a(ii)', 2, 'Explain why R is not a polymer.', L('Up to two marks:', '• a polymer is many monomers joined together (1)', '• R is a single monomer / one sugar unit (1)')],
      ['b(i)', 1, 'Identify the molecule labelled S.', L('Award one mark for:', '• sucrose')]
    ]),
    Q(2, ['A cell in an electron micrograph has an image width of 45 mm. The magnification is × 3000.'], [
      ['', 3, 'Calculate the actual width of the cell in µm. Show your working.', L('One mark each:', '• 45 mm = 45 000 µm (1)', '• 45 000 ÷ 3000 (1)', '• = 15 µm (1)')]
    ]),
    Q(3, ['Figure 3 describes blood glucose after a carbohydrate meal. Person A (no diabetes) rises from 90 to 140 mg/100 ml at 45 minutes and returns to 90 by 120 minutes. Person B (type 1 diabetes) rises from 150 to 300 mg/100 ml at 90 minutes and is still 260 at 180 minutes.'], [
      ['a', 2, 'Explain one similarity between the blood glucose levels for the two people.', L('Up to two marks:', '• both rise after the meal (1) because glucose from digested carbohydrate is absorbed into the blood (1)')],
      ['b', 2, 'Explain one difference between the blood glucose levels for the two people.', L('Up to two marks:', '• B rises higher / stays high for longer / starts higher (1)', '• because B produces no insulin so glucose is not taken into cells or stored as glycogen (1)')]
    ]),
    Q(4, [], [
      ['', 9, 'Discuss how an impulse is transmitted across a synapse and why synapses are important in the nervous system.', IND('Impulse arrives at presynaptic knob; Ca²⁺ channels open; Ca²⁺ diffuses in', 'Vesicles move and fuse with membrane; neurotransmitter (e.g. acetylcholine) released by exocytosis', 'Diffuses across the cleft; binds specific receptors on postsynaptic membrane; Na⁺ enters → depolarisation → new action potential', 'Neurotransmitter broken down by enzyme / reabsorbed so the signal stops', 'Importance: one-way transmission; integration of signals from many neurones; filtering low-level stimuli', 'Links to disorders/drugs e.g. Parkinson’s – low dopamine')]
    ]),
    Q(5, [], [
      ['', 2, 'State two functions of the skeleton.', L('One mark each, up to two:', '• protection (1)', '• support (1)', '• movement (1)', '• blood cell production (1)', '• storage of calcium/phosphate (1)')]
    ]),
    Q(6, ['A spirometer trace shows a person taking 15 breaths in one minute. The tidal volume is 0.45 dm³.'], [
      ['', 3, 'Calculate the person’s minute volume. Give your answer with units.', L('One mark each:', '• minute volume = tidal volume × breathing rate (1)', '• 0.45 × 15 (1)', '• = 6.75 dm³ min⁻¹ (1)')]
    ]),
    Q(7, [], [
      ['', 1, MC('Which stage of mitosis is described: “chromatids are pulled to opposite poles of the cell”?', ['Prophase', 'Metaphase', 'Anaphase', 'Telophase']), L('Award one mark for:', '• C')]
    ]),
    Q(8, ['Figure 6 describes a human skeleton. X is the long bone of the upper arm. Y is the long bone of the thigh. Z is the joint between the femur and the pelvis.'], [
      ['a(i)', 2, 'Identify the bones labelled X and Y.', L('One mark each:', '• X humerus (1)', '• Y femur (1)')],
      ['a(ii)', 1, 'Identify the type of joint at Z.', L('Award one mark for:', '• ball and socket (synovial)')],
      ['b', 2, 'Explain the role of articular cartilage in a synovial joint.', L('Up to two marks:', '• smooth surface covering bone ends (1)', '• reduces friction / absorbs shock so bones do not rub (1)')]
    ]),
    Q(9, ['A flow diagram shows the control of body temperature: rise in temperature → detected by (1) → (2) of skin arterioles → more heat lost; sweat glands release sweat which (3) to cool the skin.'], [
      ['', 3, 'Identify the missing words 1, 2 and 3.', L('One mark each:', '• 1 hypothalamus / thermoreceptors (1)', '• 2 vasodilation (1)', '• 3 evaporates (1)')]
    ]),
    Q(10, ['A drug is tested on clotting. Thrombin concentration was 2.4 mmol L⁻¹ at 6 minutes and 7.2 mmol L⁻¹ at 8 minutes.'], [
      ['a', 4, 'Calculate the rate of thrombin production between 6 and 8 minutes. Give your answer in mmol L⁻¹ min⁻¹.', L('One mark each:', '• change = 7.2 − 2.4 = 4.8 (1)', '• time = 2 minutes (1)', '• 4.8 ÷ 2 (1)', '• = 2.4 mmol L⁻¹ min⁻¹ (1)')],
      ['b', 3, 'Describe how an increase in clotting could cause a heart attack.', L('One mark each, up to three:', '• clot (thrombus) forms in a coronary artery (1)', '• blocks blood flow to the heart muscle (1)', '• heart muscle receives no oxygen/glucose so cannot respire (1)', '• cells die (myocardial infarction) (1)')]
    ]),
    Q(11, [], [
      ['', 9, 'Discuss how carbohydrates are digested and absorbed from the gut into the blood.', IND('Mouth: chewing increases surface area; salivary amylase hydrolyses starch to maltose', 'Stomach: acid denatures amylase; no carbohydrate digestion', 'Duodenum: pancreatic amylase continues starch → maltose; bile neutralises acid for optimum pH', 'Ileum: membrane-bound disaccharidases (maltase, sucrase, lactase) → monosaccharides', 'Absorption: glucose by active transport/co-transport with Na⁺, also facilitated diffusion; villi and microvilli adaptations', 'Into capillaries → hepatic portal vein → liver stores excess as glycogen')]
    ]),
    Q(12, [], [
      ['a', 1, 'State the function of the SAN.', L('Award one mark for:', '• pacemaker – initiates the heartbeat / sends a wave of excitation across the atria')],
      ['b', 1, 'State what is meant by stroke volume.', L('Award one mark for:', '• volume of blood pumped out of the left ventricle in one beat')]
    ]),
    Q(13, ['Starch is a polysaccharide.'], [
      ['a', 1, 'Name the monomer of starch.', L('Award one mark for:', '• α-glucose')],
      ['b', 1, 'Name the type of reaction that joins two monomers.', L('Award one mark for:', '• condensation')]
    ]),
    Q(14, ['Figure 9 describes a nephron. Q is the knot of capillaries inside the cup-shaped structure. R is the U-shaped section between the proximal and distal tubules.'], [
      ['a', 2, 'State two substances found in normal urine.', L('One mark each, up to two:', '• water (1)', '• urea (1)', '• salts / ions (1)', '• creatinine (1)')],
      ['b', 2, 'Name structures Q and R.', L('One mark each:', '• Q glomerulus (1)', '• R loop of Henle (1)')],
      ['c', 1, 'Name the gland that releases ADH.', L('Award one mark for:', '• posterior pituitary')],
      ['d(i)', 1, 'State why protein is not normally found in the filtrate.', L('Award one mark for:', '• protein molecules are too large to pass through the glomerulus/basement membrane')],
      ['d(ii)', 1, 'State why protein in the urine may indicate kidney disease.', L('Award one mark for:', '• the filter (glomerulus) is damaged so large molecules leak through')]
    ]),
    Q(15, [], [
      ['', 4, 'Explain two ways in which the trachea and bronchi protect the lungs from pathogens.', L('One mark for each feature and one linked expansion:', '• goblet cells secrete mucus (1) which traps pathogens and dust (1)', '• ciliated epithelium (1) sweeps mucus up to the throat to be swallowed (1)', '• macrophages (1) engulf pathogens by phagocytosis (1)')]
    ]),
    Q(16, ['Different types of muscle tissue are found in the body.'], [
      ['a', 2, 'Explain why marathon runners tend to have a high proportion of slow twitch fibres.', L('Up to two marks:', '• slow twitch fibres have many mitochondria/myoglobin/capillaries (1)', '• so they respire aerobically and resist fatigue over long periods (1)')],
      ['b', 4, 'Explain two differences between skeletal and smooth muscle.', L('One mark for each difference and one linked expansion:', '• skeletal is striated / smooth is not (1) because of arrangement of actin and myosin in sarcomeres (1)', '• skeletal is voluntary / smooth involuntary (1) smooth controlled by the autonomic nervous system e.g. gut walls (1)', '• skeletal fibres multinucleate / smooth cells have one nucleus and are spindle-shaped (1)', '• skeletal tires quickly / smooth contracts slowly and for long periods (1)')]
    ]),
    Q(17, [], [
      ['', 9, 'Discuss how the alveoli and the ventilation system are adapted for efficient gas exchange.', IND('Alveoli: squamous epithelium one cell thick – short diffusion distance', 'Millions of alveoli – large surface area', 'Dense capillary network; blood flow maintains concentration gradient', 'Surfactant prevents collapse; moist lining', 'Ventilation: diaphragm and intercostals change volume/pressure; fresh air maintains gradient', 'Elastic fibres aid recoil; links to emphysema/fibrosis')]
    ])
  ]));

  /* ---------- Paper 2 ---------- */
  papers.push(paper(2, 'Proteins · reflex arc · heart · protein digestion', 'Protein structure, neurones, cardiac cycle, kidney and digestion.', [
    Q(1, ['Figure 1 describes two amino acids, R, joined together to form molecule S by the removal of a water molecule.'], [
      ['a(i)', 1, 'Identify the bond formed between the two amino acids.', L('Award one mark for:', '• peptide bond')],
      ['a(ii)', 2, 'Explain why molecule S is a dipeptide not a polypeptide.', L('Up to two marks:', '• it contains only two amino acids (1)', '• a polypeptide contains many amino acids joined in a chain (1)')],
      ['b(i)', 1, 'Identify the type of reaction that forms S.', L('Award one mark for:', '• condensation')]
    ]),
    Q(2, ['A mitochondrion has an actual length of 4 µm. Its image on an electron micrograph is 60 mm long.'], [
      ['', 3, 'Calculate the magnification of the micrograph. Show your working.', L('One mark each:', '• 60 mm = 60 000 µm (1)', '• 60 000 ÷ 4 (1)', '• = × 15 000 (1)')]
    ]),
    Q(3, ['A table shows heart rate and stroke volume. At rest: heart rate 70 bpm, stroke volume 75 cm³. During exercise: heart rate 150 bpm, stroke volume 120 cm³.'], [
      ['a', 2, 'Calculate the cardiac output during exercise.', L('One mark each:', '• 150 × 120 (1)', '• = 18 000 cm³ min⁻¹ / 18 dm³ min⁻¹ (1)')],
      ['b', 2, 'Explain why cardiac output increases during exercise.', L('Up to two marks:', '• muscles respire faster and need more oxygen and glucose (1)', '• and carbon dioxide must be removed faster (1)')]
    ]),
    Q(4, [], [
      ['', 9, 'Discuss how the reflex arc produces a rapid, protective response when a hand touches a hot object.', IND('Thermoreceptors/pain receptors in skin detect stimulus; generator potential', 'Sensory neurone (long dendron, myelinated) carries impulse to spinal cord', 'Relay neurone in grey matter; few synapses so fast', 'Motor neurone (long myelinated axon) to effector – biceps contracts, hand withdraws', 'Saltatory conduction; involuntary – bypasses conscious brain', 'Protects from tissue damage; impulse also passes to brain for awareness')]
    ]),
    Q(5, [], [
      ['', 2, 'State two symptoms of hypothyroidism.', L('One mark each, up to two:', '• tiredness / lethargy (1)', '• weight gain (1)', '• feeling cold (1)', '• slow heart rate (1)', '• dry skin / hair loss (1)', '• depression (1)')]
    ]),
    Q(6, ['A person’s peak expiratory flow (PEF) is 330 L min⁻¹. The normal value for their age and height is 550 L min⁻¹.'], [
      ['', 3, 'Calculate the person’s PEF as a percentage of the normal value and suggest what this indicates.', L('Up to three marks:', '• 330 ÷ 550 × 100 (1)', '• = 60% (1)', '• airways narrowed / obstructive disorder such as asthma or COPD (1)')]
    ]),
    Q(7, [], [
      ['', 1, MC('Which organelle is the site of protein synthesis?', ['Lysosome', 'Ribosome', 'Golgi apparatus', 'Smooth ER']), L('Award one mark for:', '• B')]
    ]),
    Q(8, ['Figure 6 describes the arm. X is the muscle on the front of the upper arm. Y is the muscle on the back of the upper arm. Z is the joint at the elbow.'], [
      ['a(i)', 2, 'Identify the muscles X and Y.', L('One mark each:', '• X biceps (1)', '• Y triceps (1)')],
      ['a(ii)', 1, 'Identify the type of joint at Z.', L('Award one mark for:', '• hinge (synovial)')],
      ['b', 2, 'Explain how muscles X and Y work together to extend the arm.', L('Up to two marks:', '• they are an antagonistic pair (1)', '• triceps contracts while biceps relaxes, pulling the ulna and straightening the elbow (1)')]
    ]),
    Q(9, ['A flow diagram shows control of water balance: blood too concentrated → detected by osmoreceptors in the (1) → more (2) released → more (3) inserted in collecting duct membranes → more water reabsorbed.'], [
      ['', 3, 'Identify the missing words 1, 2 and 3.', L('One mark each:', '• 1 hypothalamus (1)', '• 2 ADH (1)', '• 3 aquaporins (1)')]
    ]),
    Q(10, ['An enzyme experiment: 12 g of protein was digested by pepsin in 8 minutes at 37 °C. At 20 °C, 12 g took 20 minutes.'], [
      ['a', 4, 'Calculate the rate of digestion at each temperature and the difference between them. Give units.', L('One mark each:', '• 37 °C: 12 ÷ 8 = 1.5 g min⁻¹ (1)', '• 20 °C: 12 ÷ 20 = 0.6 g min⁻¹ (1)', '• difference = 0.9 (1)', '• g min⁻¹ (1)')],
      ['b', 3, 'Describe why the rate is faster at 37 °C.', L('One mark each, up to three:', '• molecules have more kinetic energy (1)', '• more collisions between enzyme and substrate (1)', '• more enzyme–substrate complexes form per minute (1)', '• 37 °C is close to the optimum temperature (1)')]
    ]),
    Q(11, [], [
      ['', 9, 'Discuss how proteins are digested and absorbed from the gut into the blood.', IND('Stomach: HCl denatures proteins, kills pathogens, optimum pH for pepsin; pepsin hydrolyses peptide bonds → polypeptides', 'Churning mixes', 'Duodenum: trypsin from the pancreas; bile/alkaline juices neutralise acid', 'Ileum: peptidases on microvilli → amino acids', 'Absorption: active transport / co-transport, facilitated diffusion; villi adaptations', 'Hepatic portal vein → liver; deamination of excess; protein synthesis')]
    ]),
    Q(12, [], [
      ['a', 1, 'State the function of the semilunar valves.', L('Award one mark for:', '• prevent backflow of blood from the arteries into the ventricles')],
      ['b', 1, 'State what is meant by systole.', L('Award one mark for:', '• contraction of the heart muscle (atria or ventricles)')]
    ]),
    Q(13, ['Haemoglobin is a protein with quaternary structure.'], [
      ['a', 1, 'State how many polypeptide chains are in haemoglobin.', L('Award one mark for:', '• four')],
      ['b', 1, 'Name the non-protein group that binds oxygen.', L('Award one mark for:', '• haem (group) / iron')]
    ]),
    Q(14, ['Kidneys filter blood and produce urine.'], [
      ['a', 2, 'State two causes of kidney failure.', L('One mark each, up to two:', '• diabetes (1)', '• high blood pressure (1)', '• infection (1)', '• kidney stones/blockage (1)', '• polycystic kidney disease (1)')],
      ['b', 2, 'Name the parts of the nephron where ultrafiltration and selective reabsorption occur.', L('One mark each:', '• ultrafiltration – glomerulus/Bowman’s capsule (1)', '• selective reabsorption – PCT (1)')],
      ['c', 1, 'Name the treatment that filters a patient’s blood using a machine.', L('Award one mark for:', '• (haemo)dialysis')],
      ['d(i)', 1, 'State why a person who is dehydrated produces a small volume of urine.', L('Award one mark for:', '• more ADH released so more water reabsorbed in the collecting duct')],
      ['d(ii)', 1, 'State what colour urine you would expect in this person.', L('Award one mark for:', '• dark yellow / concentrated')]
    ]),
    Q(15, [], [
      ['', 4, 'Explain two ways in which veins are adapted for their function.', L('One mark for each feature and one linked expansion:', '• valves (1) prevent backflow of blood at low pressure (1)', '• wide lumen (1) low resistance to blood flow (1)', '• thin walls (1) can be squeezed by skeletal muscles to push blood to the heart (1)')]
    ]),
    Q(16, ['Cardiac muscle has special properties.'], [
      ['a', 2, 'Explain why cardiac muscle does not fatigue.', L('Up to two marks:', '• many mitochondria / rich blood supply from coronary arteries (1)', '• so it respires aerobically continuously (1)')],
      ['b', 4, 'Explain how electrical activity in the heart coordinates the heartbeat.', L('Up to four marks:', '• SAN generates impulses – pacemaker (1)', '• wave spreads across atria causing atrial systole (1)', '• AVN delays the impulse so atria empty first (1)', '• bundle of His/Purkyne fibres carry impulse to apex so ventricles contract upwards (1)')]
    ]),
    Q(17, [], [
      ['', 9, 'Discuss how the structure of the heart and blood vessels is related to their functions in the double circulation.', IND('Double circulation: pulmonary low pressure protects alveoli; systemic high pressure', 'Left ventricle thicker muscular wall than right', 'Valves (AV, semilunar) ensure one-way flow', 'Arteries: thick, elastic, muscular – withstand and maintain pressure', 'Capillaries: one cell thick for exchange; veins: valves, wide lumen', 'Coronary arteries supply myocardium; myogenic muscle')]
    ])
  ]));

  /* ---------- Paper 3 ---------- */
  papers.push(paper(3, 'Lipids and membranes · endocrine · bone · villi', 'Membranes and transport, hormones, skeleton and absorption.', [
    Q(1, ['Figure 1 describes molecule R: glycerol joined to three fatty acids. Molecule S: glycerol joined to two fatty acids and a phosphate group.'], [
      ['a(i)', 1, 'Identify molecule R.', L('Award one mark for:', '• triglyceride')],
      ['a(ii)', 2, 'Explain why R is a good energy store.', L('Up to two marks:', '• contains many C–H bonds so releases a lot of energy when respired (1)', '• insoluble so does not affect water potential / compact (1)')],
      ['b(i)', 1, 'Identify molecule S.', L('Award one mark for:', '• phospholipid')]
    ]),
    Q(2, ['A cube-shaped cell has sides of 3 µm.'], [
      ['', 3, 'Calculate the surface area to volume ratio of the cell.', L('One mark each:', '• SA = 6 × 3² = 54 µm² (1)', '• V = 3³ = 27 µm³ (1)', '• SA/V = 2 (: 1) (1)')]
    ]),
    Q(3, ['Figure 3 describes body temperature of two people in a cold room. Person A stays at 37.0 °C. Person B (with hypothyroidism) falls to 35.8 °C after 60 minutes.'], [
      ['a', 2, 'Explain one similarity in how both people respond to the cold.', L('Up to two marks:', '• both shiver / vasoconstrict (1) to generate heat / reduce heat loss (1)')],
      ['b', 2, 'Explain one difference between the two people.', L('Up to two marks:', '• B’s temperature falls further (1)', '• because less thyroxine means lower metabolic rate so less heat is released by respiration (1)')]
    ]),
    Q(4, [], [
      ['', 9, 'Discuss how the fluid mosaic structure of the cell surface membrane allows it to control the movement of substances into and out of cells.', IND('Phospholipid bilayer – hydrophobic core blocks ions and polar molecules; small non-polar molecules (O₂, CO₂) diffuse', 'Channel proteins – facilitated diffusion of ions', 'Carrier proteins – facilitated diffusion and active transport using ATP', 'Aquaporins for water (osmosis)', 'Cholesterol regulates fluidity; glycoproteins as receptors (e.g. insulin)', 'Fluidity allows endocytosis and exocytosis for bulk transport')]
    ]),
    Q(5, [], [
      ['', 2, 'State two dietary sources of lactose or sucrose.', L('One mark each, up to two:', '• milk / dairy (lactose) (1)', '• table sugar / sugar cane / sugar beet (sucrose) (1)', '• fruit (sucrose) (1)')]
    ]),
    Q(6, ['A person’s heart beats 18 times in 15 seconds.'], [
      ['', 3, 'Calculate the heart rate in beats per minute and state whether this is tachycardia, bradycardia or normal.', L('Up to three marks:', '• 18 ÷ 15 × 60 (1)', '• = 72 bpm (1)', '• normal (1)')]
    ]),
    Q(7, [], [
      ['', 1, MC('Which hormone is released by the adrenal glands?', ['Insulin', 'Thyroxine', 'Adrenaline', 'ADH']), L('Award one mark for:', '• C')]
    ]),
    Q(8, ['Figure 6 describes a long bone. X is the shaft. Y is the spongy end of the bone containing red marrow. Z is the smooth tissue covering the ends.'], [
      ['a(i)', 2, 'Identify the parts labelled X and Y.', L('One mark each:', '• X diaphysis (1)', '• Y epiphysis (1)')],
      ['a(ii)', 1, 'Identify tissue Z.', L('Award one mark for:', '• articular / hyaline cartilage')],
      ['b', 2, 'Explain why osteoporosis increases the risk of fractures.', L('Up to two marks:', '• bone density / mass decreases (1)', '• bones become weak and brittle so break easily (1)')]
    ]),
    Q(9, ['A flow diagram shows control of blood glucose: glucose falls → detected by (1) cells → (2) released → liver converts (3) into glucose.'], [
      ['', 3, 'Identify the missing words 1, 2 and 3.', L('One mark each:', '• 1 α (alpha) cells of the islets of Langerhans / pancreas (1)', '• 2 glucagon (1)', '• 3 glycogen (1)')]
    ]),
    Q(10, ['Glucose absorption was measured in a section of ileum. 0.36 mmol of glucose was absorbed in 3 minutes. After a drug that stops ATP production, 0.06 mmol was absorbed in 3 minutes.'], [
      ['a', 4, 'Calculate the rate of absorption before and after the drug and the percentage decrease.', L('One mark each:', '• before 0.36 ÷ 3 = 0.12 mmol min⁻¹ (1)', '• after 0.06 ÷ 3 = 0.02 mmol min⁻¹ (1)', '• (0.12 − 0.02) ÷ 0.12 × 100 (1)', '• = 83(.3)% (1)')],
      ['b', 3, 'Describe what these results suggest about how glucose is absorbed.', L('One mark each, up to three:', '• most glucose is absorbed by active transport (1)', '• which needs ATP from respiration (1)', '• a small amount still absorbed by diffusion/facilitated diffusion (1)')]
    ]),
    Q(11, [], [
      ['', 9, 'Discuss the causes, effects and treatment of type 1 and type 2 diabetes.', IND('Type 1: autoimmune destruction of β cells; no insulin; onset usually in childhood', 'Type 2: insulin resistance; obesity, inactivity, age, family history', 'Effects: high blood glucose, thirst, frequent urination, tiredness, weight loss; long term – CVD, kidney damage, retinopathy, neuropathy', 'Type 1 treatment: insulin injections/pump; monitoring', 'Type 2: diet, exercise, weight loss, metformin, later insulin', 'Negative feedback failure; comparison')]
    ]),
    Q(12, [], [
      ['a', 1, 'State the function of thyroxine.', L('Award one mark for:', '• controls metabolic rate')],
      ['b', 1, 'State what is meant by a target organ.', L('Award one mark for:', '• the organ whose cells have receptors for a hormone and respond to it')]
    ]),
    Q(13, ['Cholesterol is a lipid found in cell membranes.'], [
      ['a', 1, 'State one role of cholesterol in the membrane.', L('Award one mark for:', '• regulates fluidity / stability')],
      ['b', 1, 'Name one type of hormone made from cholesterol.', L('Award one mark for:', '• steroid hormone e.g. oestrogen, testosterone, aldosterone, cortisol')]
    ]),
    Q(14, ['Digestion takes place in several organs.'], [
      ['a', 2, 'State two functions of hydrochloric acid in the stomach.', L('One mark each, up to two:', '• kills pathogens (1)', '• optimum pH for pepsin (1)', '• denatures proteins (1)')],
      ['b', 2, 'Name the enzymes produced by the pancreas that digest fats and starch.', L('One mark each:', '• lipase (1)', '• amylase (1)')],
      ['c', 1, 'Name the organ that stores bile.', L('Award one mark for:', '• gall bladder')],
      ['d(i)', 1, 'State the role of peristalsis.', L('Award one mark for:', '• moves food / bolus along the gut by waves of muscle contraction')],
      ['d(ii)', 1, 'State one cause of gastric ulcers.', L('Award one mark for:', '• Helicobacter pylori infection / NSAIDs / excess acid')]
    ]),
    Q(15, [], [
      ['', 4, 'Explain two ways in which villi are adapted for absorption.', L('One mark for each feature and one linked expansion:', '• microvilli (1) increase surface area (1)', '• one-cell-thick epithelium (1) short diffusion distance (1)', '• rich capillary network (1) maintains concentration gradient (1)', '• many mitochondria (1) ATP for active transport (1)')]
    ]),
    Q(16, ['Myasthenia gravis and Duchenne muscular dystrophy both cause muscle weakness.'], [
      ['a', 2, 'Explain why weakness in myasthenia gravis gets worse with activity.', L('Up to two marks:', '• antibodies block acetylcholine receptors (1)', '• repeated use depletes acetylcholine release so fewer impulses cross the NMJ (1)')],
      ['b', 4, 'Explain two differences between the causes of myasthenia gravis and Duchenne muscular dystrophy.', L('One mark for each difference and one linked expansion:', '• MG is autoimmune / DMD is genetic (1) DMD is X-linked so mainly affects boys (1)', '• MG affects the neuromuscular junction / DMD affects muscle fibres (1) DMD – lack of dystrophin causes fibres to break down (1)', '• MG can be treated with drugs / DMD is progressive with no cure (1)')]
    ]),
    Q(17, [], [
      ['', 9, 'Discuss how homeostasis controls blood pressure.', IND('Baroreceptors in aorta and carotid arteries detect changes', 'High BP: impulses to brain → slower heart rate, vasodilation', 'Low BP: kidneys release renin → angiotensin II → vasoconstriction', 'Angiotensin stimulates aldosterone from adrenal cortex → Na⁺ and water reabsorbed → blood volume rises', 'ADH also increases water reabsorption', 'Negative feedback; link to hypertension/shock')]
    ])
  ]));

  /* ---------- Paper 4 ---------- */
  papers.push(paper(4, 'Nucleic acids · nervous disorders · muscle contraction · kidney', 'DNA/RNA, neurological disorders, sliding filament and osmoregulation.', [
    Q(1, ['Figure 1 describes a nucleotide R containing a pentose sugar, a phosphate and the base thymine. Molecule S has the same structure but contains uracil.'], [
      ['a(i)', 1, 'Identify the nucleic acid that contains R.', L('Award one mark for:', '• DNA')],
      ['a(ii)', 2, 'Explain how nucleotides like R form a double helix.', L('Up to two marks:', '• nucleotides join to form two strands / sugar–phosphate backbone (1)', '• complementary bases (A–T, C–G) pair by hydrogen bonds holding the strands together (1)')],
      ['b(i)', 1, 'Identify the nucleic acid that contains S.', L('Award one mark for:', '• RNA')]
    ]),
    Q(2, ['A lysosome is 0.5 µm in diameter. It is shown on a micrograph at × 40 000.'], [
      ['', 3, 'Calculate the diameter of the image in mm.', L('One mark each:', '• 0.5 × 40 000 = 20 000 µm (1)', '• ÷ 1000 (1)', '• = 20 mm (1)')]
    ]),
    Q(3, ['Figure 3 describes nerve conduction velocity in two people. Person A: 60 m s⁻¹. Person B (multiple sclerosis): 25 m s⁻¹.'], [
      ['a', 2, 'Explain one similarity between the neurones of the two people.', L('Up to two marks:', '• both conduct impulses as action potentials (1) by Na⁺ entering and K⁺ leaving the axon (1)')],
      ['b', 2, 'Explain the difference in conduction velocity.', L('Up to two marks:', '• in MS the myelin sheath is damaged (1)', '• so saltatory conduction cannot happen and impulses are slower (1)')]
    ]),
    Q(4, [], [
      ['', 9, 'Discuss how the sliding filament theory explains the contraction of skeletal muscle.', IND('Impulse at neuromuscular junction; acetylcholine; depolarisation spreads', 'Ca²⁺ released from the sarcoplasmic reticulum', 'Ca²⁺ binds troponin; tropomyosin moves exposing binding sites on actin', 'Myosin heads bind – cross-bridges; power stroke pulls actin towards the centre', 'ATP hydrolysis detaches and re-cocks myosin heads; cycle repeats', 'Sarcomere shortens (I band and H zone shorten, A band constant); relaxation when Ca²⁺ pumped back')]
    ]),
    Q(5, [], [
      ['', 2, 'State two symptoms of Parkinson’s disease.', L('One mark each, up to two:', '• tremor (1)', '• muscle rigidity (1)', '• slow movement (1)', '• balance problems (1)', '• small handwriting / shuffling gait (1)')]
    ]),
    Q(6, ['A muscle has 300 000 fibres. A biopsy shows 65% are slow twitch.'], [
      ['', 3, 'Calculate the number of fast twitch fibres and suggest a sport this person may be suited to.', L('Up to three marks:', '• 35% fast twitch (1)', '• 0.35 × 300 000 = 105 000 (1)', '• endurance sport e.g. marathon / cycling (1)')]
    ]),
    Q(7, [], [
      ['', 1, MC('Which of these is a role of tRNA?', ['Carries the genetic code from the nucleus', 'Forms the structure of ribosomes', 'Carries amino acids to the ribosome', 'Stores genetic information']), L('Award one mark for:', '• C')]
    ]),
    Q(8, ['Figure 6 describes the vertebral column. X is the region in the neck. Y is the region of the lower back. Z is the joint between two vertebrae.'], [
      ['a(i)', 2, 'Identify the regions X and Y.', L('One mark each:', '• X cervical (1)', '• Y lumbar (1)')],
      ['a(ii)', 1, 'Identify the type of joint at Z.', L('Award one mark for:', '• slightly moveable / cartilaginous')],
      ['b', 2, 'Explain the role of the intervertebral discs.', L('Up to two marks:', '• cartilage pads between vertebrae (1)', '• absorb shock and allow slight movement/flexibility (1)')]
    ]),
    Q(9, ['A flow diagram describes protein synthesis: DNA in the nucleus → (1) is made by transcription → it moves to a (2) → (3) brings specific amino acids.'], [
      ['', 3, 'Identify the missing words 1, 2 and 3.', L('One mark each:', '• 1 mRNA (1)', '• 2 ribosome (1)', '• 3 tRNA (1)')]
    ]),
    Q(10, ['A urine sample from an athlete had a volume of 1.8 dm³ over 24 hours on a cool day and 0.9 dm³ on a hot day.'], [
      ['a', 4, 'Calculate the mean rate of urine production in cm³ per hour on each day and the percentage decrease.', L('One mark each:', '• cool: 1800 ÷ 24 = 75 cm³ h⁻¹ (1)', '• hot: 900 ÷ 24 = 37.5 cm³ h⁻¹ (1)', '• (75 − 37.5) ÷ 75 × 100 (1)', '• = 50% (1)')],
      ['b', 3, 'Describe why less urine is produced on the hot day.', L('One mark each, up to three:', '• more water lost in sweat (1)', '• blood more concentrated, detected by hypothalamus (1)', '• more ADH released so more water reabsorbed in collecting duct (1)')]
    ]),
    Q(11, [], [
      ['', 9, 'Discuss the role of ADH in osmoregulation.', IND('Osmoreceptors in hypothalamus detect blood water potential', 'ADH made in hypothalamus, stored and released by posterior pituitary', 'Travels in blood to collecting duct (and DCT) cells; binds receptors', 'Vesicles containing aquaporins fuse with membrane', 'More water reabsorbed by osmosis; concentrated urine', 'Negative feedback – less ADH when blood dilute; diabetes insipidus link')]
    ]),
    Q(12, [], [
      ['a', 1, 'State the function of ATP in the cell.', L('Award one mark for:', '• releases energy for cellular processes when hydrolysed')],
      ['b', 1, 'State the role of NAD in respiration.', L('Award one mark for:', '• carries hydrogen / electrons (to the electron transport chain)')]
    ]),
    Q(13, ['ALS is a disorder of the nervous system.'], [
      ['a', 1, 'Name the type of neurone that degenerates in ALS.', L('Award one mark for:', '• motor neurone')],
      ['b', 1, 'State one effect of ALS.', L('Award one mark for:', '• muscle weakness / paralysis / difficulty swallowing or breathing')]
    ]),
    Q(14, ['The nephron has several regions.'], [
      ['a', 2, 'State two substances reabsorbed in the PCT.', L('One mark each, up to two:', '• glucose (1)', '• amino acids (1)', '• water (1)', '• salts / ions (1)')],
      ['b', 2, 'Name the regions of the nephron that collect filtrate and reabsorb water under the control of ADH.', L('One mark each:', '• Bowman’s capsule (1)', '• collecting duct (1)')],
      ['c', 1, 'Name the blood vessel that carries blood into the glomerulus.', L('Award one mark for:', '• afferent arteriole')],
      ['d(i)', 1, 'State why the pressure in the glomerulus is high.', L('Award one mark for:', '• afferent arteriole is wider than the efferent arteriole')],
      ['d(ii)', 1, 'State one cause of kidney stones.', L('Award one mark for:', '• dehydration / high calcium or oxalate / high salt diet / family history')]
    ]),
    Q(15, [], [
      ['', 4, 'Explain two ways the structure of a motor neurone is adapted to its function.', L('One mark for each feature and one linked expansion:', '• long axon (1) carries impulses from the CNS to effectors (1)', '• myelin sheath (1) insulates; saltatory conduction speeds impulses (1)', '• many dendrites on cell body (1) receive impulses from relay neurones (1)', '• motor end plates (1) form neuromuscular junctions with muscle fibres (1)')]
    ]),
    Q(16, ['Sarcomeres change length during contraction.'], [
      ['a', 2, 'A sarcomere shortens from 2.5 µm to 2.0 µm. Calculate the percentage decrease in length.', L('One mark each:', '• 0.5 ÷ 2.5 × 100 (1)', '• = 20% (1)')],
      ['b', 4, 'Explain two roles of ATP in muscle contraction.', L('One mark for each role and one linked expansion:', '• hydrolysis provides energy for the power stroke / re-cocking (1) so myosin heads can bind again (1)', '• allows myosin heads to detach from actin (1) so the cycle can repeat (1)', '• active transport of Ca²⁺ back into sarcoplasmic reticulum (1) allows relaxation (1)')]
    ]),
    Q(17, [], [
      ['', 9, 'Discuss how the hypothalamus links the nervous and endocrine systems to maintain homeostasis.', IND('Hypothalamus contains receptors for temperature and water potential', 'Controls pituitary: releasing hormones to anterior; makes ADH for posterior', 'Thermoregulation via nerves – sweating, shivering, vasodilation/constriction', 'Osmoregulation via ADH', 'SCN controls circadian rhythms (melatonin)', 'Negative feedback; effects of disruption e.g. shift work')]
    ])
  ]));

  /* ---------- Paper 5 ---------- */
  papers.push(paper(5, 'Metabolic conditions · cell cycle and cancer · blood · respiratory disorders', 'Inherited conditions, mitosis and cancer, blood cells and lung disease.', [
    Q(1, ['Figure 1 describes molecule R: a long branched chain of α-glucose found in liver cells. Molecule S: an unbranched chain of glucose found in bread.'], [
      ['a(i)', 1, 'Identify molecule R.', L('Award one mark for:', '• glycogen')],
      ['a(ii)', 2, 'Explain why R is highly branched.', L('Up to two marks:', '• many ends for enzymes to act on (1)', '• so glucose can be released rapidly when needed (1)')],
      ['b(i)', 1, 'Identify molecule S.', L('Award one mark for:', '• starch (amylose)')]
    ]),
    Q(2, ['In a sample of 400 cells viewed under a microscope, 36 cells were in mitosis.'], [
      ['', 3, 'Calculate the mitotic index as a percentage and suggest what a high mitotic index in a tissue sample might indicate.', L('Up to three marks:', '• 36 ÷ 400 × 100 (1)', '• = 9% (1)', '• rapid cell division – possible tumour / cancer (1)')]
    ]),
    Q(3, ['Figure 3 describes blood phenylalanine in two babies. Baby A stays at about 60 µmol L⁻¹. Baby B (PKU) rises to 1200 µmol L⁻¹ by 5 days old.'], [
      ['a', 2, 'Explain one similarity between the babies.', L('Up to two marks:', '• both have phenylalanine in their blood (1) from protein in their milk / diet (1)')],
      ['b', 2, 'Explain the difference between the two babies.', L('Up to two marks:', '• Baby B’s phenylalanine rises much higher (1)', '• because they lack the enzyme to break it down (1)')]
    ]),
    Q(4, [], [
      ['', 9, 'Discuss how disruption of the cell cycle can lead to cancer and how screening helps.', IND('Normal cycle: G1, S, G2, mitosis; checkpoints; signals to stop dividing', 'Mutations in genes controlling division (oncogenes, tumour suppressors)', 'Cells fail to respond to signals and avoid apoptosis → uncontrolled division → tumour', 'Malignant tumours invade and metastasise', 'Cytology screening (e.g. cervical) detects abnormal cells early', 'Earlier treatment improves survival; histopathology of biopsies')]
    ]),
    Q(5, [], [
      ['', 2, 'State two symptoms of coeliac disease.', L('One mark each, up to two:', '• diarrhoea (1)', '• bloating / abdominal pain (1)', '• weight loss (1)', '• tiredness / anaemia (1)', '• poor growth in children (1)')]
    ]),
    Q(6, ['A spirometer trace shows vital capacity of 4.8 dm³ and residual volume of 1.2 dm³.'], [
      ['', 3, 'Calculate total lung capacity and explain why residual volume cannot be breathed out.', L('Up to three marks:', '• 4.8 + 1.2 = 6.0 dm³ (1)', '• air remains in the lungs/airways after maximum exhalation (1)', '• keeps alveoli open / prevents collapse (1)')]
    ]),
    Q(7, [], [
      ['', 1, MC('Which white blood cell produces antibodies?', ['Neutrophil', 'Macrophage', 'B lymphocyte', 'Erythrocyte']), L('Award one mark for:', '• C')]
    ]),
    Q(8, ['Figure 6 describes the thorax. X is the dome-shaped muscle below the lungs. Y are the muscles between the ribs. Z is the airway with C-shaped rings of cartilage.'], [
      ['a(i)', 2, 'Identify X and Y.', L('One mark each:', '• X diaphragm (1)', '• Y intercostal muscles (1)')],
      ['a(ii)', 1, 'Identify Z.', L('Award one mark for:', '• trachea')],
      ['b', 2, 'Explain the role of the cartilage rings in Z.', L('Up to two marks:', '• keep the trachea open (1)', '• prevent collapse when pressure falls during inspiration (1)')]
    ]),
    Q(9, ['A flow diagram describes clotting: damaged vessel → (1) stick to the site → thrombin converts (2) into (3) which forms a mesh.'], [
      ['', 3, 'Identify the missing words 1, 2 and 3.', L('One mark each:', '• 1 platelets / thrombocytes (1)', '• 2 fibrinogen (1)', '• 3 fibrin (1)')]
    ]),
    Q(10, ['A patient’s red blood cell count was 5.0 × 10¹² per litre. After severe blood loss it was 3.5 × 10¹² per litre.'], [
      ['a', 4, 'Calculate the percentage decrease in red blood cell count.', L('One mark each:', '• difference = 1.5 × 10¹² (1)', '• 1.5 ÷ 5.0 (1)', '• × 100 (1)', '• = 30% (1)')],
      ['b', 3, 'Describe how loss of blood volume can lead to physiological shock.', L('One mark each, up to three:', '• blood volume falls (1)', '• blood pressure falls (1)', '• organs receive too little oxygen (poor perfusion) (1)', '• heart rate increases to compensate (1)', '• organ failure if untreated (1)')]
    ]),
    Q(11, [], [
      ['', 9, 'Discuss the causes and effects of chronic obstructive pulmonary disease (COPD) on gas exchange.', IND('COPD = chronic bronchitis + emphysema; main cause smoking, also pollution, occupational dust', 'Bronchitis: goblet cells overproduce mucus, cilia damaged → blocked airways, infections, cough', 'Emphysema: elastase from inflammation breaks down alveolar walls → reduced surface area, loss of elastic recoil', 'Reduced PEF/FEV₁; air trapping', 'Less O₂ diffuses into blood; breathlessness, fatigue; strain on heart', 'Treatment: stop smoking, inhalers, pulmonary rehab, oxygen')]
    ]),
    Q(12, [], [
      ['a', 1, 'State the function of neutrophils.', L('Award one mark for:', '• engulf / ingest pathogens by phagocytosis')],
      ['b', 1, 'State what is meant by bradycardia.', L('Award one mark for:', '• slow resting heart rate, below 60 bpm')]
    ]),
    Q(13, ['Galactosaemia is a metabolic condition.'], [
      ['a', 1, 'Name the sugar that cannot be broken down in galactosaemia.', L('Award one mark for:', '• galactose')],
      ['b', 1, 'Name one food a baby with galactosaemia must avoid.', L('Award one mark for:', '• breast milk / cow’s milk / dairy products')]
    ]),
    Q(14, ['Asthma and pulmonary fibrosis affect the lungs.'], [
      ['a', 2, 'State two triggers of an asthma attack.', L('One mark each, up to two:', '• pollen / dust mites / pet hair (1)', '• exercise (1)', '• cold air (1)', '• smoke / pollution (1)', '• infection (1)')],
      ['b', 2, 'Name the type of drug in a blue reliever inhaler and state its effect.', L('One mark each:', '• bronchodilator / β-agonist (salbutamol) (1)', '• relaxes smooth muscle so airways widen (1)')],
      ['c', 1, 'Name the type of white blood cell found in the alveoli that ingests dust.', L('Award one mark for:', '• macrophage')],
      ['d(i)', 1, 'State how pulmonary fibrosis changes the alveolar walls.', L('Award one mark for:', '• thickened / scarred')],
      ['d(ii)', 1, 'State why this reduces gas exchange.', L('Award one mark for:', '• longer diffusion distance')]
    ]),
    Q(15, [], [
      ['', 4, 'Explain two ways erythrocytes are adapted to their function.', L('One mark for each feature and one linked expansion:', '• no nucleus (1) more room for haemoglobin (1)', '• biconcave shape (1) larger surface area for diffusion of oxygen (1)', '• flexible (1) squeeze through narrow capillaries (1)', '• contain haemoglobin (1) binds oxygen to form oxyhaemoglobin (1)')]
    ]),
    Q(16, ['Cells die in different ways.'], [
      ['a', 2, 'Explain what is meant by the Hayflick limit.', L('Up to two marks:', '• cells can only divide a limited number of times (about 50) (1)', '• then they stop dividing and undergo apoptosis (1)')],
      ['b', 4, 'Explain two differences between apoptosis and necrosis.', L('One mark for each difference and one linked expansion:', '• apoptosis is programmed / necrosis results from injury, infection or loss of blood supply (1) apoptosis is a normal part of development and turnover (1)', '• apoptosis – cell shrinks and is broken into fragments that are engulfed (1) no inflammation (1)', '• necrosis – cell swells and bursts (1) releasing contents that cause inflammation (1)')]
    ]),
    Q(17, [], [
      ['', 9, 'Discuss the roles of the different components of blood in transport and defence.', IND('Plasma: transports glucose, amino acids, CO₂, urea, hormones, heat; plasma proteins; buffering', 'Erythrocytes: haemoglobin carries O₂; adaptations', 'Neutrophils and macrophages: phagocytosis', 'Lymphocytes: B cells produce antibodies; T cells; NK cells kill infected cells', 'Platelets: clotting cascade – thrombin, fibrin – prevents blood loss and infection', 'Blood as connective tissue; links between functions')]
    ])
  ]));

  /* ---------- Paper 6 ---------- */
  papers.push(paper(6, 'Organelles · glucose control · skeleton disorders · fats and the liver', 'Cell ultrastructure, homeostasis, joints and lipid digestion.', [
    Q(1, ['Figure 1 describes an organelle R with a double membrane and folded inner membrane (cristae). Organelle S is a stack of flattened membrane sacs that produces vesicles.'], [
      ['a(i)', 1, 'Identify organelle R.', L('Award one mark for:', '• mitochondrion')],
      ['a(ii)', 2, 'Explain why the inner membrane of R is folded.', L('Up to two marks:', '• increases surface area (1)', '• for more enzymes / electron transport chains so more ATP made in oxidative phosphorylation (1)')],
      ['b(i)', 1, 'Identify organelle S.', L('Award one mark for:', '• Golgi apparatus')]
    ]),
    Q(2, ['A ribosome measures 25 nm. A student draws it 5 mm wide.'], [
      ['', 3, 'Calculate the magnification of the drawing.', L('One mark each:', '• 5 mm = 5 000 000 nm (1)', '• 5 000 000 ÷ 25 (1)', '• = × 200 000 (1)')]
    ]),
    Q(3, ['Figure 3 describes blood insulin after a meal. Person A: insulin rises from 10 to 60 units at 45 minutes and falls back. Person B (type 2 diabetes): insulin rises from 25 to 110 units and stays high, while blood glucose remains high.'], [
      ['a', 2, 'Explain one similarity between the insulin levels of the two people.', L('Up to two marks:', '• both increase after the meal (1) because rising blood glucose is detected by β cells which secrete insulin (1)')],
      ['b', 2, 'Explain why B’s glucose stays high despite high insulin.', L('Up to two marks:', '• cells are resistant to insulin / receptors do not respond (1)', '• so glucose is not taken up by cells or converted to glycogen (1)')]
    ]),
    Q(4, [], [
      ['', 9, 'Discuss how organelles work together to produce and secrete a protein hormone such as insulin.', IND('Nucleus: gene transcribed to mRNA; nucleolus makes ribosomes', 'mRNA leaves via nuclear pores to ribosomes on RER', 'Translation: tRNA brings amino acids; peptide bonds form the polypeptide', 'RER folds and transports protein in vesicles to Golgi', 'Golgi modifies and packages into secretory vesicles', 'Vesicles move along cytoskeleton and release by exocytosis; mitochondria supply ATP')]
    ]),
    Q(5, [], [
      ['', 2, 'State two risk factors for osteoarthritis.', L('One mark each, up to two:', '• older age (1)', '• obesity (1)', '• previous joint injury (1)', '• repetitive stress on joints / occupation (1)', '• family history (1)', '• female (1)')]
    ]),
    Q(6, ['A person’s heart pumps 5.6 dm³ of blood per minute at a heart rate of 70 bpm.'], [
      ['', 3, 'Calculate the stroke volume in cm³.', L('One mark each:', '• stroke volume = cardiac output ÷ heart rate (1)', '• 5600 ÷ 70 (1)', '• = 80 cm³ (1)')]
    ]),
    Q(7, [], [
      ['', 1, MC('Which process moves water across a partially permeable membrane?', ['Active transport', 'Osmosis', 'Exocytosis', 'Facilitated diffusion of glucose']), L('Award one mark for:', '• B')]
    ]),
    Q(8, ['Figure 6 describes the skeleton. X is the bone of the forearm on the thumb side. Y is the shoulder blade. Z is the joints between bones of the cranium.'], [
      ['a(i)', 2, 'Identify X and Y.', L('One mark each:', '• X radius (1)', '• Y scapula (1)')],
      ['a(ii)', 1, 'Identify the type of joint at Z.', L('Award one mark for:', '• fixed / fibrous / sutures')],
      ['b', 2, 'Explain why a lack of vitamin D in children causes bowed legs.', L('Up to two marks:', '• vitamin D needed to absorb calcium (1)', '• bones are not mineralised so are soft and bend under body weight – rickets (1)')]
    ]),
    Q(9, ['A flow diagram describes fat digestion: bile from the (1) emulsifies fats → (2) hydrolyses triglycerides → into fatty acids and (3).'], [
      ['', 3, 'Identify the missing words 1, 2 and 3.', L('One mark each:', '• 1 liver / gall bladder (1)', '• 2 lipase (1)', '• 3 glycerol (accept monoglycerides) (1)')]
    ]),
    Q(10, ['An experiment measured lipase activity. With bile, 4.8 g of fat was digested in 12 minutes. Without bile, 1.2 g was digested in 12 minutes.'], [
      ['a', 4, 'Calculate the rates of digestion with and without bile, and how many times faster digestion was with bile.', L('One mark each:', '• with bile: 4.8 ÷ 12 = 0.4 g min⁻¹ (1)', '• without: 1.2 ÷ 12 = 0.1 g min⁻¹ (1)', '• 0.4 ÷ 0.1 (1)', '• = 4 times faster (1)')],
      ['b', 3, 'Describe why bile increases the rate of fat digestion.', L('One mark each, up to three:', '• emulsifies fat into small droplets (1)', '• increases surface area for lipase to act on (1)', '• neutralises acid giving optimum pH for lipase (1)')]
    ]),
    Q(11, [], [
      ['', 9, 'Discuss the roles of the liver in the assimilation of the products of digestion.', IND('Receives blood from the ileum via the hepatic portal vein', 'Glucose: stored as glycogen under insulin; released under glucagon', 'Amino acids: used for protein synthesis (e.g. plasma proteins); excess deaminated → ammonia → urea', 'Fatty acids: respired or converted; cholesterol made; bile produced', 'Detoxification; hormones broken down', 'Links to homeostasis and kidney excretion')]
    ]),
    Q(12, [], [
      ['a', 1, 'State the function of the nucleolus.', L('Award one mark for:', '• makes ribosomes / rRNA')],
      ['b', 1, 'State what is meant by autophagy.', L('Award one mark for:', '• the cell digesting its own worn-out organelles (by lysosomes)')]
    ]),
    Q(13, ['Lactose intolerance affects digestion.'], [
      ['a', 1, 'Name the enzyme that is lacking in lactose intolerance.', L('Award one mark for:', '• lactase')],
      ['b', 1, 'State one symptom of lactose intolerance.', L('Award one mark for:', '• bloating / wind / diarrhoea / stomach cramps')]
    ]),
    Q(14, ['The large intestine has important roles.'], [
      ['a', 2, 'State two roles of the gut microbiota.', L('One mark each, up to two:', '• digest fibre (1)', '• produce vitamins e.g. vitamin K (1)', '• compete with pathogens (1)', '• support the immune system (1)')],
      ['b', 2, 'Name the parts of the large intestine that reabsorb water and store faeces.', L('One mark each:', '• colon (1)', '• rectum (1)')],
      ['c', 1, 'Name one disorder of the digestive system that causes abdominal pain and altered bowel habits with no visible damage to the gut.', L('Award one mark for:', '• IBS (irritable bowel syndrome)')],
      ['d(i)', 1, 'State why antibiotics can cause diarrhoea.', L('Award one mark for:', '• they kill beneficial gut bacteria / disrupt microbiota')],
      ['d(ii)', 1, 'State how diarrhoea can lead to dehydration.', L('Award one mark for:', '• less water reabsorbed in the colon so more water lost in faeces')]
    ]),
    Q(15, [], [
      ['', 4, 'Explain two ways that a synovial joint is adapted to allow smooth movement.', L('One mark for each feature and one linked expansion:', '• synovial fluid (1) lubricates and reduces friction (1)', '• articular cartilage (1) smooth surface and shock absorption (1)', '• ligaments (1) hold bones together and stabilise the joint (1)', '• joint capsule (1) encloses and protects the joint (1)')]
    ]),
    Q(16, ['Osteoporosis and osteoarthritis are both common in older people.'], [
      ['a', 2, 'Explain why weight-bearing exercise helps prevent osteoporosis.', L('Up to two marks:', '• stress on bones stimulates bone formation (1)', '• increasing bone density so they are less likely to fracture (1)')],
      ['b', 4, 'Explain two differences between osteoporosis and osteoarthritis.', L('One mark for each difference and one linked expansion:', '• osteoporosis affects bone density / osteoarthritis affects joint cartilage (1) so osteoporosis causes fractures while osteoarthritis causes joint pain and stiffness (1)', '• osteoporosis often has no symptoms until a fracture / osteoarthritis causes pain from the start (1)', '• treatment: calcium, vitamin D, bisphosphonates vs pain relief, joint replacement (1)')]
    ]),
    Q(17, [], [
      ['', 9, 'Discuss how negative feedback controls blood glucose concentration.', IND('Set point about 4–6 mmol L⁻¹; why it matters (respiration, water potential)', 'Rise detected by β cells → insulin → cells take up glucose; liver/muscle make glycogen; respiration increases', 'Fall detected by α cells → glucagon → liver glycogenolysis and gluconeogenesis', 'Adrenaline also raises glucose', 'Negative feedback reverses changes', 'Failure: type 1 and type 2 diabetes')]
    ])
  ]));

  window.BIZ_PAPERS = (window.BIZ_PAPERS || []).concat(papers);
})();
