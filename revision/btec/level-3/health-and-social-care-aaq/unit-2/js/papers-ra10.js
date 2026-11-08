/* BTEC Health and Social Care (AAQ) Unit 2 — RA10 practice papers.
   Same layout as the Pearson sample: 1 hour 30 minutes, 80 marks; Section A 26, Section B 29, Section C 25;
   labelling / state / describe / explain questions then a 9-mark “discuss the effects on body systems” question in each section.
   Diagram labelling questions are written so they can be answered from a description. Mark schemes are RA10’s own. */
(function () {
  'use strict';
  function Q(n, sec, ctx, parts) {
    return parts.map((p, i) => ({ q: n, sub: p[0], marks: p[1], section: sec, ctx: i === 0 ? ctx : (p[4] || []), text: p[2], ms: { body: p[3], levels: null } }));
  }
  const L = (...lines) => lines.join('\n');
  const IND = (...lines) => L('Indicative content – credit other relevant points that link body systems and apply to the scenario:', ...lines.map(x => '• ' + x), 'Award marks using the 9-mark levels (best fit).');
  function paper(n, title, blurb, qs) {
    const items = [].concat(...qs);
    return { id: 'HSC2-R' + String(n).padStart(2, '0'), unit: 2, key: 'R' + String(n).padStart(2, '0'), source: 'ra10', spec: 'ra10', kind: 'exam', code: 'RA10',
      series: 'RA10 Paper ' + n, date: 'RA10 practice paper ' + n, title, blurb, minutes: 90, items, total: items.reduce((s, x) => s + x.marks, 0) };
  }
  const papers = [];

  papers.push(paper(1, 'Heart and lungs · Hormones · Reflexes – COPD, type 2 diabetes, stroke', 'Cells, cardiovascular and respiratory systems; endocrine; nervous system.', [
    Q(1, 'A', [], [
      ['a', 1, 'Identify one function of the nucleus.', L('Award one mark for:', '• contains DNA / genetic information / controls the cell’s activities')],
      ['b', 3, 'A diagram of the heart shows three labelled structures: A, the chamber that receives blood from the vena cava; B, the vessel that carries blood from the left ventricle to the body; C, the flaps between the atria and ventricles. Name structures A, B and C.', L('One mark each:', '• A right atrium (1)', '• B aorta (1)', '• C valves (atrioventricular / tricuspid and bicuspid) (1)')],
      ['c', 2, 'State two differences between arteries and veins.', L('One mark each, up to two:', '• arteries carry blood away from the heart, veins towards it (1)', '• arteries have thicker, more muscular walls (1)', '• veins have valves (1)', '• arteries carry blood at higher pressure (1)', '• veins have a wider lumen (1)')],
      ['d', 3, 'Describe how carbon dioxide is removed from the body.', L('One mark each, up to three:', '• carbon dioxide produced in respiring cells diffuses into the blood (1)', '• carried in plasma to the lungs (1)', '• diffuses from capillaries into the alveoli (1)', '• breathed out during exhalation (1)')],
      ['e', 4, 'Explain two ways the structure of capillaries helps the exchange of substances.', L('One mark for each feature and one linked expansion:', '• walls one cell thick (1) short diffusion distance (1)', '• very narrow (1) red blood cells pass slowly, giving time for exchange (1)', '• form large networks (1) large surface area close to every cell (1)')],
      ['f', 4, 'Explain why aerobic respiration is important for heart muscle.', L('Up to four marks:', '• heart muscle contracts continuously (1)', '• needs a constant supply of energy (1)', '• aerobic respiration releases far more energy than anaerobic (1)', '• cardiac muscle cells have many mitochondria (1)', '• anaerobic respiration would cause lactic acid build-up / fatigue (1)')],
      ['g', 9, 'Bernard is 68 and has smoked for 50 years. He has been diagnosed with COPD and gets breathless walking to the shops. Discuss how COPD can affect Bernard’s respiratory, cardiovascular and musculoskeletal systems.', IND('Respiratory: damaged alveoli (emphysema) reduce surface area; inflamed airways and mucus (bronchitis); breathlessness, cough, infections', 'Less oxygen enters the blood → heart works harder → raised heart rate, risk of heart failure', 'Low oxygen to muscles → fatigue; inactivity → muscle weakness and reduced mobility', 'Breathlessness makes eating tiring → weight loss (digestive link)', 'Treatment: inhalers, pulmonary rehab, stopping smoking', 'Judgement on most significant effect')]
    ]),
    Q(2, 'B', [], [
      ['a', 1, 'Identify the gland that releases insulin.', L('Award one mark for:', '• pancreas (islets of Langerhans)')],
      ['b', 2, 'Name the two organs, other than the pancreas, that are part of the endocrine system’s control of growth.', L('One mark each, up to two:', '• pituitary gland (1)', '• thyroid gland (1)', '• testes / ovaries (1)', '• hypothalamus (1)')],
      ['c', 3, 'Describe the role of the pituitary gland.', L('One mark each, up to three:', '• releases hormones such as growth hormone (1)', '• releases ADH to control water balance (1)', '• controls other endocrine glands (“master gland”) (1)', '• is controlled by the hypothalamus (1)')],
      ['d', 4, 'Explain how the body responds when blood glucose falls below normal.', L('Up to four marks:', '• fall is detected by the pancreas (1)', '• pancreas releases glucagon (1)', '• liver converts glycogen into glucose (1)', '• glucose released into the blood so levels rise back to normal (negative feedback) (1)')],
      ['e', 4, 'Explain two ways that adrenaline prepares the body for action.', L('One mark for each and one linked expansion:', '• increases heart rate (1) delivering more oxygen and glucose to muscles (1)', '• increases breathing rate (1) more oxygen in the blood (1)', '• liver releases glucose (1) giving energy for muscle contraction (1)', '• pupils dilate (1) improving vision (1)')],
      ['f', 3, 'Explain one role of the kidneys in homeostasis.', L('One mark, up to two for expansion:', '• control water balance (1) reabsorbing more water when ADH is high (1) so blood concentration stays stable (1)', '• remove urea (1) filtering it from blood (1) preventing toxic build-up (1)')],
      ['g', 3, 'Explain one way that obesity can lead to type 2 diabetes.', L('One mark, up to two for expansion:', '• excess body fat makes cells resistant to insulin (1) so glucose is not taken up (1) and blood glucose stays high (1)')],
      ['h', 9, 'Precious is 47 and has type 2 diabetes. She does not always take her medication. Discuss how poorly controlled type 2 diabetes can affect Precious’s body systems.', IND('Endocrine: insulin resistance, high blood glucose; thirst, frequent urination, tiredness', 'Cardiovascular: damaged vessels, atherosclerosis → heart disease, stroke', 'Nervous: neuropathy, loss of feeling in feet → ulcers, infection', 'Eyes: retinopathy, vision loss; kidneys: kidney disease', 'Immune: slower wound healing, infections', 'Link to medication and lifestyle; judgement')]
    ]),
    Q(3, 'C', [], [
      ['a', 1, 'Identify the part of the nervous system made up of the brain and spinal cord.', L('Award one mark for:', '• central nervous system (CNS)')],
      ['bi', 1, 'State the role of a sensory neurone.', L('Award one mark for:', '• carries impulses from receptors to the CNS')],
      ['bii', 2, 'State two functions of the hypothalamus.', L('One mark each:', '• controls body temperature (1)', '• controls the pituitary gland (1)', '• controls thirst / hunger (1)', '• links nervous and endocrine systems (1)')],
      ['c', 4, 'Explain how a reflex action protects the body.', L('Up to four marks:', '• reflex is fast / automatic (1)', '• impulse travels receptor → sensory → relay in spinal cord → motor neurone (1)', '• bypasses conscious thought in the brain (1)', '• e.g. hand pulled from a hot object, reducing tissue damage (1)')],
      ['d', 2, 'Explain one way the body maintains temperature when it is too hot.', L('One mark and one expansion:', '• sweating (1) evaporation of sweat cools the skin (1)', '• vasodilation (1) more blood near the skin so more heat lost (1)')],
      ['e', 3, 'Explain why the parasympathetic nervous system is important after exercise.', L('One mark, up to two for expansion:', '• it slows heart and breathing rate (1) returning the body to a resting state (1) conserving energy and allowing digestion (1)')],
      ['f', 3, 'Explain why damage to motor neurones affects movement.', L('One mark, up to two for expansion:', '• motor neurones carry impulses from the CNS to muscles (1) so if damaged muscles do not receive signals (1) causing weakness or paralysis (1)')],
      ['g', 9, 'Dennis is 74 and has had an ischaemic stroke affecting the left side of his brain. Discuss how the stroke may affect Dennis’s nervous system and other body systems.', IND('Cause: clot blocks an artery → brain cells die from lack of oxygen', 'Nervous: right-sided weakness/paralysis, dysphasia (language areas), memory and concentration problems', 'Musculoskeletal: reduced mobility, falls, muscle wasting', 'Respiratory: swallowing problems → aspiration and chest infections', 'Cardiovascular: risk of further strokes, inactivity', 'Rehabilitation (physio, SLT, OT) can improve function; judgement')]
    ])
  ]));

  papers.push(paper(2, 'Digestion · Tissues · Homeostasis – bowel cancer, asthma, dementia', 'Digestive system, tissues and energy, nervous control and disorders.', [
    Q(1, 'A', [], [
      ['a', 1, 'Identify one type of connective tissue.', L('Award one mark for:', '• blood / cartilage / bone / areolar / adipose')],
      ['b', 3, 'A diagram of the respiratory system has three labels: A, the tube held open by rings of cartilage; B, the two tubes that branch into each lung; C, the tiny air sacs. Name A, B and C.', L('One mark each:', '• A trachea (1)', '• B bronchi (1)', '• C alveoli (1)')],
      ['c', 2, 'State two products of aerobic respiration.', L('One mark each:', '• carbon dioxide (1)', '• water (1)', '• energy / ATP (1)')],
      ['d', 3, 'Describe what happens to the diaphragm and ribs during exhalation.', L('One mark each, up to three:', '• the diaphragm relaxes and moves up into a dome (1)', '• intercostal muscles relax so ribs move down and in (1)', '• chest volume decreases and pressure increases (1)', '• air is pushed out of the lungs (1)')],
      ['e', 4, 'Explain two ways ciliated epithelium and mucus protect the respiratory system.', L('One mark for each and one expansion:', '• mucus traps dust and microbes (1) stopping them reaching the alveoli (1)', '• cilia beat to sweep mucus up the airways (1) so it is swallowed or coughed out (1)')],
      ['f', 4, 'Explain why a person breathes faster during exercise.', L('Up to four marks:', '• muscles respire more to release energy (1)', '• more oxygen is needed (1)', '• more carbon dioxide is produced and must be removed (1)', '• detected by the brain, which increases breathing rate and depth (1)')],
      ['g', 9, 'Kai is 12 and has asthma. He had an attack during a football match. Discuss how an asthma attack affects Kai’s respiratory system and other body systems.', IND('Airways narrow, muscles tighten, inflammation and mucus → wheeze, breathlessness', 'Less oxygen reaches the blood → heart rate increases (cardiovascular)', 'Low oxygen to the brain → dizziness, confusion (nervous)', 'Anxiety activates the sympathetic nervous system and adrenaline', 'Repeated attacks → missed sport, delayed growth, anxiety', 'Inhalers (relievers/preventers); judgement')]
    ]),
    Q(2, 'B', [], [
      ['a', 1, 'Identify the organ where bile is produced.', L('Award one mark for:', '• liver')],
      ['b', 2, 'A diagram of the digestive system has two labels: A, the muscular bag containing acid; B, the long tube where digested food is absorbed through villi. Name A and B.', L('One mark each:', '• A stomach (1)', '• B ileum / small intestine (1)')],
      ['c', 3, 'Describe what happens to food in the stomach.', L('One mark each, up to three:', '• muscles churn the food (1)', '• hydrochloric acid kills bacteria (1)', '• enzymes (pepsin) begin digesting protein (1)', '• food is turned into a liquid and released into the duodenum (1)')],
      ['d', 4, 'Explain two ways the ileum is adapted for absorption.', L('One mark for each and one expansion:', '• villi and microvilli (1) huge surface area (1)', '• thin walls (1) short diffusion distance (1)', '• rich blood supply (1) carries absorbed food away, maintaining the gradient (1)', '• long (1) more time for absorption (1)')],
      ['e', 4, 'Explain the role of the pancreas in digestion and in hormone control.', L('Up to four marks:', '• releases digestive enzymes into the duodenum (1) e.g. amylase, lipase, protease (1)', '• releases insulin (1) to lower blood glucose (1)', '• releases glucagon (1) to raise blood glucose (1)')],
      ['f', 3, 'Explain one role of the lymphatic system in the digestive system.', L('One mark, up to two expansion:', '• lacteals in the villi absorb fats (1) which travel in lymph (1) and enter the blood (1)')],
      ['g', 3, 'Explain one lifestyle factor that increases the risk of bowel cancer.', L('One mark, up to two expansion:', '• diet low in fibre / high in red or processed meat (1) increases contact with carcinogens in the bowel (1) increasing abnormal cell division (1)', '• smoking / alcohol / obesity / inactivity (1) damages cells lining the bowel or raises inflammation (1) increasing the chance of mutations that form a tumour (1)')],
      ['h', 9, 'Sandra is 63 and is having chemotherapy for bowel cancer. She has lost weight and feels very tired. Discuss how bowel cancer and its treatment can affect Sandra’s body systems.', IND('Digestive: tumour, bleeding, blockage, changed bowel habits, poor absorption', 'Blood loss → anaemia → less oxygen → tiredness, breathlessness (cardiovascular/respiratory)', 'Weight loss and muscle wasting (musculoskeletal)', 'Metastasis to liver or lungs', 'Chemotherapy: kills dividing cells → weakened immune system, hair loss, nausea', 'Judgement')]
    ]),
    Q(3, 'C', [], [
      ['a', 1, 'Identify the part of the brain that controls the pituitary gland.', L('Award one mark for:', '• hypothalamus')],
      ['bi', 1, 'State one type of joint.', L('Award one mark for:', '• fibrous / cartilaginous / synovial')],
      ['bii', 2, 'State two roles of the peripheral nervous system.', L('One mark each:', '• relays information from receptors to the CNS (1)', '• carries instructions from the CNS to muscles/glands (1)', '• controls involuntary functions (autonomic) (1)')],
      ['c', 4, 'Explain how the body responds when it becomes too cold.', L('One mark for each response and one expansion:', '• shivering (1) muscle contractions generate heat (1)', '• vasoconstriction (1) less blood at skin surface reduces heat loss (1)', '• hairs stand up (1) trapping insulating air (1)')],
      ['d', 2, 'Explain why a person with dementia may find daily tasks difficult.', L('One mark and one expansion:', '• damage to neurones affects memory (1) so they forget steps such as how to make a drink (1)')],
      ['e', 3, 'Explain one cause of Alzheimer’s disease.', L('One mark, up to two expansion:', '• build-up of protein plaques and tangles in the brain (1) damages and kills neurones (1) disrupting messages between brain cells (1)')],
      ['f', 3, 'Explain the role of the sympathetic nervous system in a stressful situation.', L('One mark, up to two expansion:', '• increases heart rate and breathing rate (1) along with adrenaline (1) so muscles get more oxygen and glucose to respond (1)')],
      ['g', 9, 'Joan is 86 and has vascular dementia. Discuss how vascular dementia can affect Joan’s nervous system and other body systems.', IND('Cause: reduced blood flow from small strokes → damaged brain tissue', 'Nervous: memory loss, confusion, slowness of thought, personality change', 'Cardiovascular: underlying vessel disease, risk of further strokes', 'Respiratory: swallowing difficulties → chest infections in later stages', 'Musculoskeletal: falls, reduced mobility; digestive: forgetting to eat → weight loss', 'Judgement')]
    ])
  ]));

  papers.push(paper(3, 'Blood · Muscles and bones · Brain – heart disease, breast cancer, brain injury', 'Blood components, musculoskeletal system, nervous system.', [
    Q(1, 'A', [], [
      ['a', 1, 'Identify the component of blood that carries oxygen.', L('Award one mark for:', '• red blood cells / haemoglobin')],
      ['b', 3, 'Name three components of blood.', L('One mark each:', '• plasma (1)', '• red blood cells (1)', '• white blood cells (1)', '• platelets (1)')],
      ['c', 2, 'State two functions of white blood cells.', L('One mark each:', '• engulf pathogens (phagocytosis) (1)', '• produce antibodies (1)', '• produce antitoxins (1)', '• fight infection (1)')],
      ['d', 3, 'Describe the stages of the cardiac cycle.', L('One mark each:', '• atrial systole – atria contract, blood into ventricles (1)', '• ventricular systole – ventricles contract, blood into arteries (1)', '• diastole – heart relaxes and fills (1)')],
      ['e', 4, 'Explain two features of red blood cells that help them carry oxygen.', L('One mark for each and one expansion:', '• haemoglobin (1) binds oxygen (1)', '• no nucleus (1) more space for haemoglobin (1)', '• biconcave (1) large surface area (1)')],
      ['f', 4, 'Explain how atherosclerosis can lead to a heart attack.', L('Up to four marks:', '• fatty deposits/plaques build up in coronary artery walls (1)', '• the artery narrows (1)', '• a plaque can rupture and a clot forms (1)', '• heart muscle beyond the blockage is starved of oxygen and dies (1)')],
      ['g', 9, 'Tony is 59 and has coronary heart disease. He gets chest pain when climbing stairs. Discuss how coronary heart disease can affect Tony’s body systems.', IND('Cardiovascular: narrowed coronary arteries → angina, risk of heart attack and heart failure', 'Respiratory: shortness of breath as the heart pumps less efficiently', 'Digestive: nausea and vomiting in a heart attack', 'Musculoskeletal: reduced activity → muscle weakness', 'Treatment: statins, stents, lifestyle change', 'Judgement')]
    ]),
    Q(2, 'B', [], [
      ['a', 1, 'Identify the structure that joins muscle to bone.', L('Award one mark for:', '• tendon')],
      ['b', 2, 'Name two bones in the leg.', L('One mark each:', '• femur (1)', '• tibia (1)', '• fibula (1)', '• patella (1)')],
      ['c', 3, 'Describe the features of a synovial joint.', L('One mark each, up to three:', '• cartilage covers the ends of the bones (1)', '• synovial membrane produces synovial fluid (1)', '• fluid lubricates the joint (1)', '• joint capsule / ligaments hold bones together (1)')],
      ['d', 4, 'Explain how the biceps and triceps work together to move the forearm.', L('Up to four marks:', '• they are an antagonistic pair (1)', '• to bend the arm the biceps contracts and the triceps relaxes (1)', '• to straighten it the triceps contracts and the biceps relaxes (1)', '• tendons pull on the bones of the forearm (1)')],
      ['e', 4, 'Explain two functions of the skeleton.', L('One mark for each and one expansion:', '• support (1) gives the body shape (1)', '• protection (1) skull protects the brain, ribs protect the heart and lungs (1)', '• movement (1) muscles pull on bones (1)', '• blood cell production (1) in bone marrow (1)')],
      ['f', 3, 'Explain one role of hormones in bone growth.', L('One mark, up to two expansion:', '• growth hormone from the pituitary (1) stimulates growth plates in long bones (1) increasing height in childhood and puberty (1)')],
      ['g', 3, 'Explain one way genetics can increase the risk of breast cancer.', L('One mark, up to two expansion:', '• inherited BRCA1/BRCA2 mutation (1) reduces the ability to repair damaged DNA (1) so abnormal cells divide uncontrollably (1)')],
      ['h', 9, 'Hannah is 44 and has been diagnosed with breast cancer. She is having surgery and radiotherapy. Discuss how breast cancer and its treatment may affect Hannah’s body systems.', IND('Reproductive: tumour in breast tissue; mastectomy/lumpectomy', 'Lymphatic: spread to lymph nodes; removal can cause lymphoedema (arm swelling)', 'Metastasis to bones, liver, lungs', 'Radiotherapy: tiredness, skin damage; chemotherapy: weakened immunity', 'Musculoskeletal: reduced arm movement after surgery', 'Emotional/endocrine effects of hormone therapy; judgement')]
    ]),
    Q(3, 'C', [], [
      ['a', 1, 'Identify a cause of a traumatic brain injury.', L('Award one mark for:', '• fall / road accident / sports injury / assault')],
      ['bi', 1, 'State one function of the spinal cord.', L('Award one mark for:', '• carries impulses between the brain and body / coordinates reflexes')],
      ['bii', 2, 'State two signs of concussion.', L('One mark each:', '• headache (1)', '• dizziness (1)', '• confusion (1)', '• brief loss of consciousness (1)', '• memory loss (1)', '• nausea (1)')],
      ['c', 4, 'Explain two ways the nervous system and the endocrine system differ.', L('One mark for each and one expansion:', '• nervous messages are electrical impulses (1) endocrine messages are hormones in the blood (1)', '• nervous responses are fast and short-lived (1) hormonal responses are slower and last longer (1)')],
      ['d', 2, 'Explain why the brain needs a constant blood supply.', L('One mark and one expansion:', '• brain cells need oxygen and glucose for respiration (1) and die within minutes without them (1)')],
      ['e', 3, 'Explain the role of relay neurones.', L('One mark, up to two expansion:', '• relay neurones are found in the CNS (1) connecting sensory to motor neurones (1) e.g. in the spinal cord in a reflex arc (1)')],
      ['f', 3, 'Explain why a brain injury may affect breathing.', L('One mark, up to two expansion:', '• the brainstem controls breathing (1) so damage may disrupt signals to the diaphragm and intercostals (1) requiring ventilation (1)')],
      ['g', 9, 'Ryan is 21 and sustained a traumatic brain injury in a motorbike accident. Discuss how the injury may affect Ryan’s central nervous system and other body systems.', IND('CNS: unconsciousness, coma, amnesia; later memory, concentration and personality changes; headaches, fatigue', 'Motor areas: weakness, poor coordination (musculoskeletal)', 'Brainstem: breathing and heart rate control (respiratory, cardiovascular)', 'Swallowing → chest infections; hypothalamus/pituitary → hormonal effects', 'Rehabilitation; judgement')]
    ])
  ]));

  papers.push(paper(4, 'Energy · Kidneys · Immunity – emphysema, type 1 diabetes, Alzheimer’s', 'Energy and metabolism, renal and immune systems, disorders.', [
    Q(1, 'A', [], [
      ['a', 1, 'Identify what is meant by anabolism.', L('Award one mark for:', '• using energy to build large molecules from small ones')],
      ['b', 3, 'State three uses of energy in the body.', L('One mark each:', '• muscle contraction (1)', '• nerve impulses (1)', '• cell division, growth and repair (1)', '• maintaining body temperature (1)', '• active transport (1)')],
      ['c', 2, 'State two factors that increase basal metabolic rate.', L('One mark each:', '• more muscle mass (1)', '• younger age (1)', '• being male (1)', '• higher body temperature / illness (1)', '• thyroxine (1)')],
      ['d', 3, 'Describe the difference between aerobic and anaerobic respiration.', L('One mark each:', '• aerobic uses oxygen; anaerobic does not (1)', '• aerobic produces carbon dioxide and water; anaerobic produces lactic acid (1)', '• aerobic releases much more energy (1)')],
      ['e', 4, 'Explain how emphysema reduces gas exchange.', L('Up to four marks:', '• smoke damages the alveolar walls (1)', '• alveoli break down into fewer, larger spaces (1)', '• surface area for diffusion is reduced (1)', '• less oxygen enters the blood / less CO₂ removed (1)')],
      ['f', 4, 'Explain two reasons why a person with emphysema may feel tired.', L('One mark for each and one expansion:', '• less oxygen in the blood (1) so less aerobic respiration and energy (1)', '• effort of breathing (1) uses energy (1)', '• poor sleep from coughing (1) leaves them fatigued (1)')],
      ['g', 9, 'Margaret is 72 and has emphysema. She now needs oxygen therapy at home. Discuss how emphysema affects Margaret’s body systems.', IND('Respiratory: alveolar damage, reduced surface area, breathlessness', 'Cardiovascular: low oxygen → heart works harder → right-sided heart failure', 'Musculoskeletal: inactivity → weakness; risk of falls', 'Digestive: breathlessness when eating → weight loss', 'Oxygen therapy improves oxygen levels but restricts mobility', 'Judgement')]
    ]),
    Q(2, 'B', [], [
      ['a', 1, 'Identify the hormone that controls water reabsorption in the kidneys.', L('Award one mark for:', '• ADH (antidiuretic hormone)')],
      ['b', 2, 'Name two waste products removed by the kidneys.', L('One mark each:', '• urea (1)', '• excess water (1)', '• excess salts (1)', '• toxins / drugs (1)')],
      ['c', 3, 'Describe how the kidneys respond when a person drinks a lot of water.', L('One mark each:', '• hypothalamus detects too much water in the blood (1)', '• less ADH is released by the pituitary (1)', '• kidneys reabsorb less water so a large volume of dilute urine is produced (1)')],
      ['d', 4, 'Explain why a person with type 1 diabetes needs insulin injections.', L('Up to four marks:', '• the immune system has destroyed insulin-producing cells in the pancreas (1)', '• so no insulin is produced (1)', '• glucose cannot enter cells / blood glucose stays high (1)', '• injections replace the missing insulin so glucose is controlled (1)')],
      ['e', 4, 'Explain two symptoms of high blood glucose.', L('One mark for each and one expansion:', '• thirst (1) as the body loses water in urine (1)', '• frequent urination (1) kidneys excrete excess glucose (1)', '• tiredness (1) cells lack glucose for respiration (1)', '• weight loss (1) body breaks down fat and muscle (1)')],
      ['f', 3, 'Explain one role of antibodies in fighting infection.', L('One mark, up to two expansion:', '• antibodies bind to specific antigens on pathogens (1) clumping them together (1) so phagocytes can destroy them (1)')],
      ['g', 3, 'Explain one way the lymphatic system supports the immune system.', L('One mark, up to two expansion:', '• lymph nodes filter lymph (1) trapping pathogens (1) where lymphocytes destroy them (1)')],
      ['h', 9, 'Ella is 15 and has just been diagnosed with type 1 diabetes. Discuss how type 1 diabetes may affect Ella’s body systems.', IND('Endocrine: no insulin; high blood glucose; hypoglycaemia risk with injections', 'Renal: excess glucose in urine, dehydration', 'Cardiovascular/nervous long term: vessel and nerve damage', 'Eyes: vision problems; immune: infections heal slowly', 'Growth and puberty can make control harder', 'Judgement')]
    ]),
    Q(3, 'C', [], [
      ['a', 1, 'Identify the type of neurone found only in the CNS.', L('Award one mark for:', '• relay neurone')],
      ['bi', 1, 'State the main function of neuroglia.', L('Award one mark for:', '• support and protect neurones')],
      ['bii', 2, 'State two early signs of Alzheimer’s disease.', L('One mark each:', '• memory loss (1)', '• confusion (1)', '• difficulty finding words (1)', '• losing things (1)', '• mood changes (1)')],
      ['c', 4, 'Explain how negative feedback controls blood glucose after a meal.', L('Up to four marks:', '• blood glucose rises after a meal (1)', '• pancreas detects this and releases insulin (1)', '• liver and muscle cells take up glucose and store it as glycogen (1)', '• blood glucose returns to normal (1)')],
      ['d', 2, 'Explain why homeostasis is important for enzymes.', L('One mark and one expansion:', '• enzymes work best at around 37 °C / a stable pH (1) so a stable internal environment keeps chemical reactions working (1)')],
      ['e', 3, 'Explain the role of the hypothalamus in thermoregulation.', L('One mark, up to two expansion:', '• the hypothalamus detects changes in blood temperature (1) and sends impulses to effectors (1) such as sweat glands or muscles to restore 37 °C (1)')],
      ['f', 3, 'Explain why a person with Alzheimer’s disease may become malnourished.', L('One mark, up to two expansion:', '• memory loss (1) means they forget to eat or drink (1) leading to weight loss and dehydration (1)')],
      ['g', 9, 'Peter is 79 and has Alzheimer’s disease. His family say he is becoming more confused. Discuss how Alzheimer’s disease affects Peter’s nervous system and other body systems.', IND('Nervous: plaques and tangles kill neurones; memory loss, confusion, language problems, personality change', 'Digestive: forgets meals, difficulty swallowing later → weight loss', 'Musculoskeletal: falls, reduced mobility', 'Respiratory: aspiration pneumonia in later stages', 'Progressive; medication may slow symptoms; judgement')]
    ])
  ]));

  papers.push(paper(5, 'Respiration · Endocrine · Movement – lung cancer, stroke, asthma', 'Respiratory and endocrine systems, musculoskeletal system and disorders.', [
    Q(1, 'A', [], [
      ['a', 1, 'Identify the muscles between the ribs.', L('Award one mark for:', '• intercostal muscles')],
      ['b', 3, 'Name three structures air passes through to reach the alveoli.', L('One mark each:', '• trachea (1)', '• bronchi (1)', '• bronchioles (1)', '• nose / mouth / larynx (1)')],
      ['c', 2, 'State two adaptations of the alveoli.', L('One mark each:', '• thin walls (1)', '• large surface area (1)', '• rich blood supply (1)', '• moist lining (1)')],
      ['d', 3, 'Describe how oxygen is carried from the lungs to the body’s cells.', L('One mark each:', '• oxygen diffuses into the blood in the lung capillaries (1)', '• binds to haemoglobin in red blood cells (1)', '• pumped by the heart through arteries to capillaries, where it diffuses into cells (1)')],
      ['e', 4, 'Explain two ways smoking damages the respiratory system.', L('One mark for each and one expansion:', '• tar paralyses cilia (1) so mucus and microbes build up, causing infections (1)', '• damages alveoli (1) reducing gas exchange (1)', '• carcinogens (1) cause lung cancer (1)', '• inflames airways (1) causing chronic bronchitis (1)')],
      ['f', 4, 'Explain how carbon monoxide in cigarette smoke affects the cardiovascular system.', L('Up to four marks:', '• carbon monoxide binds to haemoglobin (1)', '• more strongly than oxygen (1)', '• so less oxygen is carried (1)', '• the heart works harder / raised heart rate and CVD risk (1)')],
      ['g', 9, 'Gary is 66 and has lung cancer. He has a persistent cough and is losing weight. Discuss how lung cancer may affect Gary’s respiratory system and other body systems.', IND('Respiratory: tumour blocks airways, cough, breathlessness, coughing blood, infections', 'Cardiovascular: less oxygen; tumour may press on vessels', 'Metastasis to bones, brain, liver → pain, confusion', 'Digestive: loss of appetite, weight loss; musculoskeletal weakness', 'Treatment side effects; judgement')]
    ]),
    Q(2, 'B', [], [
      ['a', 1, 'Identify the gland that releases adrenaline.', L('Award one mark for:', '• adrenal gland')],
      ['b', 2, 'Name two hormones involved in puberty.', L('One mark each:', '• testosterone (1)', '• oestrogen (1)', '• progesterone (1)', '• FSH / LH (1)')],
      ['c', 3, 'Describe the role of the thyroid gland.', L('One mark each:', '• releases thyroxine (1)', '• controls metabolic rate (1)', '• supports normal growth and development (1)')],
      ['d', 4, 'Explain the role of aldosterone in controlling blood pressure.', L('Up to four marks:', '• released by the adrenal glands (1)', '• when blood pressure is low (1)', '• makes the kidneys retain sodium and water (1)', '• increasing blood volume and pressure (1)')],
      ['e', 4, 'Explain two differences between how the nervous and endocrine systems send messages.', L('One mark for each and one expansion:', '• nerves use electrical impulses (1) hormones travel in the blood (1)', '• nerves act quickly (1) hormones act more slowly but last longer (1)', '• nerves act on specific muscles/glands (1) hormones can affect many target organs (1)')],
      ['f', 3, 'Explain one effect of too little growth hormone in childhood.', L('One mark, up to two expansion:', '• slow growth / short stature (1) because bones and muscles do not grow normally (1) treated with growth hormone injections (1)')],
      ['g', 3, 'Explain how stress hormones can affect the digestive system.', L('One mark, up to two expansion:', '• adrenaline diverts blood away from the gut (1) slowing digestion (1) causing nausea or indigestion (1)')],
      ['h', 9, 'Asha is 34 and has severe asthma. She uses steroid inhalers and has frequent attacks. Discuss how severe asthma may affect Asha’s body systems.', IND('Respiratory: inflamed narrowed airways, mucus, breathlessness, risk of life-threatening attacks', 'Cardiovascular: raised heart rate during attacks; reliever inhaler side effects', 'Nervous: anxiety, panic, poor sleep', 'Musculoskeletal: long-term steroids reduce bone density', 'Immune: steroids may increase infection risk', 'Judgement')]
    ]),
    Q(3, 'C', [], [
      ['a', 1, 'Identify the part of the nervous system that controls involuntary functions.', L('Award one mark for:', '• autonomic nervous system')],
      ['bi', 1, 'State one type of stroke.', L('Award one mark for:', '• ischaemic / haemorrhagic')],
      ['bii', 2, 'State two risk factors for stroke.', L('One mark each:', '• high blood pressure (1)', '• smoking (1)', '• high cholesterol (1)', '• diabetes (1)', '• age (1)', '• obesity / inactivity (1)')],
      ['c', 4, 'Explain why a stroke on one side of the brain affects the opposite side of the body.', L('Up to four marks:', '• motor nerves cross over (1) in the brainstem (1)', '• so the left side of the brain controls the right side of the body (1)', '• damage on one side causes weakness/paralysis on the other (1)')],
      ['d', 2, 'Explain why speech may be affected after a stroke.', L('One mark and one expansion:', '• the stroke may damage language areas of the brain (1) causing dysphasia / slurred speech (1)')],
      ['e', 3, 'Explain why rehabilitation is important after a stroke.', L('One mark, up to two expansion:', '• physiotherapy and therapy retrain movement and speech (1) because other areas of the brain can take over some functions (1) improving independence (1)')],
      ['f', 3, 'Explain how a stroke can increase the risk of chest infections.', L('One mark, up to two expansion:', '• swallowing may be affected (1) so food or saliva enters the airways (1) causing aspiration pneumonia (1)')],
      ['g', 9, 'Winston is 70 and had a haemorrhagic stroke. Discuss how the stroke may affect Winston’s nervous system and other body systems.', IND('Cause: burst vessel, bleeding increases pressure in the brain', 'Nervous: paralysis, dysphasia, memory loss, emotional changes', 'Musculoskeletal: weakness, contractures, falls', 'Respiratory: aspiration pneumonia; cardiovascular: blood pressure control', 'Rehab and support; judgement')]
    ])
  ]));

  papers.push(paper(6, 'Cells and tissues · Digestion · Senses and control – heart failure, coeliac-type symptoms, head injury', 'Mixed revision paper covering every aim.', [
    Q(1, 'A', [], [
      ['a', 1, 'Identify the tissue type that covers the body and lines organs.', L('Award one mark for:', '• epithelial tissue')],
      ['b', 3, 'State the function of three organelles.', L('One mark each:', '• nucleus – controls the cell / contains DNA (1)', '• mitochondria – aerobic respiration (1)', '• ribosomes – make proteins (1)', '• cell membrane – controls entry and exit (1)')],
      ['c', 2, 'State two locations of cartilage in the body.', L('One mark each:', '• ends of bones in joints (1)', '• trachea (1)', '• ear / nose (1)', '• between vertebrae (1)')],
      ['d', 3, 'Describe the route of blood from the lungs to the body.', L('One mark each:', '• pulmonary vein to the left atrium (1)', '• left atrium to left ventricle (1)', '• left ventricle pumps blood into the aorta to the body (1)')],
      ['e', 4, 'Explain why the left ventricle has a thicker wall than the right ventricle.', L('Up to four marks:', '• the left ventricle pumps blood around the whole body (1)', '• needs greater force / pressure (1)', '• the right ventricle pumps only to the lungs, close by (1)', '• lower pressure prevents damage to the delicate lung capillaries (1)')],
      ['f', 4, 'Explain two ways that the heart rate is controlled.', L('One mark for each and one expansion:', '• SA node sets the basic rhythm (1) as the natural pacemaker (1)', '• sympathetic nerves increase the rate (1) during exercise or stress (1)', '• parasympathetic nerves slow it (1) at rest (1)', '• adrenaline increases heart rate (1) in fight or flight (1)')],
      ['g', 9, 'Derek is 77 and has heart failure after several heart attacks. His ankles are swollen and he gets breathless lying flat. Discuss how heart failure can affect Derek’s body systems.', IND('Cardiovascular: weak pumping, blood backs up, fluid retention (oedema)', 'Respiratory: fluid in lungs → breathlessness lying down', 'Renal: reduced blood flow → kidneys retain fluid', 'Musculoskeletal: fatigue, weakness, reduced mobility', 'Nervous: confusion from low oxygen; anxiety', 'Treatment: diuretics; judgement')]
    ]),
    Q(2, 'B', [], [
      ['a', 1, 'Identify the part of the gut where most water is absorbed.', L('Award one mark for:', '• colon / large intestine')],
      ['b', 2, 'Name the enzyme in saliva and the food it breaks down.', L('One mark each:', '• amylase (1)', '• starch (1)')],
      ['c', 3, 'Describe how food is moved along the digestive system.', L('One mark each:', '• by peristalsis (1)', '• waves of contraction of smooth muscle (1)', '• behind the food push it along (1)')],
      ['d', 4, 'Explain two roles of bile in digestion.', L('One mark for each and one expansion:', '• emulsifies fats into small droplets (1) giving lipase a larger surface area (1)', '• neutralises stomach acid (1) so enzymes in the small intestine work best (1)')],
      ['e', 4, 'Explain how damage to the villi would affect a person.', L('Up to four marks:', '• smaller surface area for absorption (1)', '• fewer nutrients absorbed into the blood (1)', '• leads to weight loss / malnutrition (1)', '• tiredness and anaemia from poor iron absorption (1)', '• diarrhoea / bloating (1)')],
      ['f', 3, 'Explain one way the digestive and cardiovascular systems work together.', L('One mark, up to two expansion:', '• nutrients absorbed in the ileum enter capillaries (1) and are transported in plasma (1) to every cell for respiration and growth (1)')],
      ['g', 3, 'Explain one way that the liver helps maintain homeostasis.', L('One mark, up to two expansion:', '• stores glucose as glycogen and releases it (1) under the control of insulin and glucagon (1) keeping blood glucose stable (1)')],
      ['h', 9, 'Imran is 26. Damage to the lining of his small intestine means he absorbs nutrients poorly. Discuss how poor absorption of nutrients may affect Imran’s other body systems.', IND('Digestive: villi damaged; diarrhoea, bloating, weight loss', 'Blood: iron deficiency anaemia → tiredness, breathlessness (cardiovascular/respiratory)', 'Musculoskeletal: calcium/vitamin D deficiency → weak bones; muscle wasting', 'Immune: poor nutrition → more infections', 'Nervous: fatigue, poor concentration', 'Judgement')]
    ]),
    Q(3, 'C', [], [
      ['a', 1, 'Identify the term for maintaining a stable internal environment.', L('Award one mark for:', '• homeostasis')],
      ['bi', 1, 'State one sense organ.', L('Award one mark for:', '• eye / ear / nose / tongue / skin')],
      ['bii', 2, 'State two functions of the brain.', L('One mark each:', '• controls movement (1)', '• memory / thinking (1)', '• controls heart and breathing rate (1)', '• processes sensory information (1)', '• emotions (1)')],
      ['c', 4, 'Explain how the nervous system coordinates a response to touching a sharp object.', L('Up to four marks:', '• pain receptors in the skin detect the stimulus (1)', '• sensory neurone carries the impulse to the spinal cord (1)', '• relay neurone passes it to a motor neurone (1)', '• muscle contracts, pulling the hand away (reflex) (1)')],
      ['d', 2, 'Explain why helmets reduce the risk of brain injury.', L('One mark and one expansion:', '• they absorb the force of an impact (1) reducing movement of the brain inside the skull (1)')],
      ['e', 3, 'Explain one long-term effect of a traumatic brain injury.', L('One mark, up to two expansion:', '• memory problems (1) because damaged neurones do not regrow (1) making study or work difficult (1)', '• personality change (1) from damage to the frontal lobe (1) which can strain relationships with family and friends (1)')],
      ['f', 3, 'Explain one way that dehydration affects homeostasis.', L('One mark, up to two expansion:', '• blood becomes more concentrated (1) the pituitary releases more ADH (1) so the kidneys produce small amounts of concentrated urine (1)')],
      ['g', 9, 'Lily is 17 and fell from a horse, causing a head injury. She was unconscious for several minutes. Discuss how a head injury may affect Lily’s central nervous system and other body systems.', IND('CNS: concussion, unconsciousness, amnesia, headaches, dizziness, poor concentration, personality change', 'Musculoskeletal: coordination and balance problems', 'Endocrine: pituitary damage can affect growth/puberty hormones', 'Respiratory/cardiovascular: brainstem effects in severe injury', 'Recovery and rehabilitation; judgement')]
    ])
  ]));

  window.BIZ_PAPERS = (window.BIZ_PAPERS || []).concat(papers);
})();
