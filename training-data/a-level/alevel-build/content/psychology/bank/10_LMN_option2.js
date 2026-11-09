  /* ===== Paper 3 Option 2 (Section C): L Schizophrenia · M Eating behaviour · N Stress ===== */
  const L1 = '3.5.1 Symptoms & diagnosis', L2 = '3.5.2 Biological explanations', L3 = '3.5.3 Psychological explanations', L4 = '3.5.4 Drug therapy', L5 = '3.5.5 CBT & family therapy', L6 = '3.5.6 Interactionist approach';
  const M1 = '3.6.1 Food preferences', M2 = '3.6.2 Neural & hormonal control', M3 = '3.6.3 Anorexia: biological', M4 = '3.6.4 Anorexia: psychological', M5 = '3.6.5 Obesity: biological', M6 = '3.6.6 Obesity: psychological';
  const N1 = '3.7.1 Physiology of stress', N2 = '3.7.2 Stress and illness', N3 = '3.7.3 Sources of stress', N4 = '3.7.4 Measuring stress', N5 = '3.7.5 Individual differences', N6 = '3.7.6 Managing and coping';

  /* --- L Schizophrenia --- */
  K('L', L1, 'Distinguish', 4, 'Distinguish between positive and negative symptoms of schizophrenia. Give an example of each.', [
    'Positive symptoms are additional experiences beyond those of ordinary existence (1)',
    'eg hallucinations – unusual sensory experiences such as hearing voices; or delusions – irrational beliefs (eg paranoia) (1)',
    'Negative symptoms are a loss of usual abilities and experiences (1)',
    'eg avolition – loss of motivation to carry out goal-directed tasks; speech poverty (alogia) – reduced amount and quality of speech (1)'
  ]);
  K('L', L1, 'Explain', 4, 'Explain two issues in the diagnosis of schizophrenia.', [
    'Co-morbidity: schizophrenia often occurs with other disorders, eg depression (Buckley et al., 2009: ~50%), so it may not be a separate disorder (1+1)',
    'Symptom overlap: many symptoms also occur in bipolar disorder, eg delusions, avolition, so diagnosis is unreliable (1+1)',
    'Culture bias: African-Caribbean people in the UK are up to 9 times more likely to be diagnosed – voices may be culturally acceptable (Escobar, 2012) (1+1)',
    'Gender bias: men are diagnosed more often; women may function better (Cotton et al., 2009) and be under-diagnosed (1+1). Any two explained.'
  ]);
  K('L', L2, 'Outline', 4, 'Outline the dopamine hypothesis of schizophrenia.', [
    'Original hypothesis: hyperdopaminergia in the subcortex – too much dopamine in the mesolimbic pathway (1)',
    'eg excess D2 receptors on Broca’s area may explain speech poverty/auditory hallucinations (1)',
    'Revised hypothesis: hypodopaminergia in the cortex – low dopamine in the prefrontal cortex explains negative symptoms (Goldman-Rakic et al., 2004) (1)',
    'Evidence: amphetamines (increase dopamine) cause schizophrenia-like symptoms; antipsychotics reduce dopamine activity (1)'
  ]);
  K('L', L2, 'Outline', 4, 'Outline genetic explanations of schizophrenia.', [
    'Family studies: risk increases with genetic similarity – Gottesman (1991): MZ twins 48%, DZ twins 17%, general population 1% (1+1)',
    'Schizophrenia is polygenic – many candidate genes each increase risk slightly; Ripke et al. (2014): 108 separate genetic variations (1)',
    'Mutation: paternal age is linked to mutation in sperm, increasing risk (1)'
  ]);
  K('L', L3, 'Explain', 4, 'Explain family dysfunction as an explanation for schizophrenia.', [
    'Schizophrenogenic mother (Fromm-Reichmann, 1948): cold, rejecting, controlling, creating tension and secrecy (1)',
    'Double-bind theory (Bateson et al., 1956): children receive contradictory messages and cannot win, leading to disorganised thinking (1)',
    'Expressed emotion (EE): high levels of criticism, hostility and emotional over-involvement from carers (1)',
    'High EE is a source of stress that may trigger onset or relapse in a vulnerable person (1)'
  ]);
  K('L', L4, 'Distinguish', 4, 'Distinguish between typical and atypical antipsychotics.', [
    'Typical antipsychotics (eg chlorpromazine) are dopamine antagonists – they block D2 receptors, reducing dopamine action (1)',
    'They mainly reduce positive symptoms and have serious side effects, eg tardive dyskinesia (1)',
    'Atypical antipsychotics (eg clozapine, risperidone) act on dopamine and serotonin (and glutamate) receptors (1)',
    'They aim to improve mood and negative symptoms, with fewer side effects; clozapine used where other drugs fail (1)'
  ]);
  K('L', L5, 'Outline', 4, 'Outline how CBT is used to treat schizophrenia.', [
    'Usually 5–20 sessions; aims to help patients understand and cope with symptoms rather than cure them (1)',
    'Patients identify irrational thoughts and the origins of symptoms, eg voices (1)',
    'Normalisation and reality testing – challenging delusional beliefs and considering alternative explanations (1)',
    'Reduces anxiety and distress caused by symptoms; improves functioning (1)'
  ]);
  KL('L', L6, 'Discuss', 16, 'Discuss the interactionist approach to explaining and treating schizophrenia.', [
    'AO1: Diathesis-stress model – Meehl (1962): schizogene + schizophrenogenic mother; modern view – many genes, early trauma (diathesis); cannabis/stress (stressor).',
    'AO1: Treatment combines antipsychotics with CBT/family therapy.',
    'AO3: Support – Tienari et al. (2004): adoptees with schizophrenic biological mothers and high-criticism adoptive families more likely to develop schizophrenia.',
    'AO3: Real-world application – combined treatment more effective (Tarrier et al., 2004).',
    'AO3: Original diathesis-stress model is oversimplified – multiple genes and multiple stressors (Ripke et al., 2014).',
    'AO3: Unclear mechanism by which stress triggers symptoms; treatment-causation fallacy.',
    'AO3: Less deterministic than single-factor explanations; but harder to falsify.'
  ], 'AO1 = 6, AO3 = 10');
  KL('L', L4, 'Evaluate', 8, 'Evaluate drug therapy as a treatment for schizophrenia.', [
    'AO1 (brief): typical (chlorpromazine – D2 antagonist) and atypical (clozapine, risperidone).',
    'AO3: Evidence – Thornley et al. (2003): chlorpromazine associated with better overall functioning vs placebo; Meltzer (2012) clozapine effective in 30–50% of treatment-resistant cases.',
    'AO3: Serious side effects – tardive dyskinesia, NMS; agranulocytosis with clozapine.',
    'AO3: Chemical cosh – may calm patients for the convenience of staff (ethical issues).',
    'AO3: Mechanism uncertain; research possibly biased (drug company funding).'
  ], 'AO1 = 3, AO3 = 5');
  M('L', L1, 'Avolition is…', 'A loss of motivation to carry out goal-directed behaviour', ['Hearing voices', 'A belief of being persecuted', 'Speaking very quickly'], 'A negative symptom.');
  M('L', L2, 'Gottesman (1991) found a concordance rate for MZ twins of…', '48%', ['17%', '1%', '90%'], 'DZ twins 17%.');
  M('L', L4, 'Chlorpromazine works as a…', 'Dopamine antagonist', ['Serotonin reuptake inhibitor', 'Dopamine agonist', 'Benzodiazepine'], 'Blocks D2 receptors.');
  M('L', L5, 'Family therapy mainly aims to reduce…', 'Expressed emotion', ['Dopamine levels', 'Co-morbidity', 'Hallucinations directly'], 'Reduces stress and relapse.');
  TF('L', L1, 'Symptom overlap means symptoms of schizophrenia also appear in other disorders such as bipolar disorder.', true, 'Reduces reliability and validity of diagnosis.');
  TF('L', L3, 'Dysfunctional thought processing includes reduced processing in the ventral striatum, linked to negative symptoms.', true, 'Juckel et al. (2006) – neural correlate.');
  F('L', 'Positive symptoms', 'Additional experiences: hallucinations, delusions.', L1);
  F('L', 'Negative symptoms', 'Loss of usual experience: avolition, speech poverty.', L1);
  F('L', 'Co-morbidity', 'Two or more disorders occurring together.', L1);
  F('L', 'Dopamine hypothesis', 'Hyperdopaminergia (subcortex) → positive symptoms; hypodopaminergia (cortex) → negative symptoms.', L2);
  F('L', 'Expressed emotion', 'Criticism, hostility and emotional over-involvement from family; triggers relapse.', L3);
  F('L', 'Metarepresentation dysfunction', 'Frith (1992): inability to recognise own thoughts – explains hearing voices.', L3);
  F('L', 'Atypical antipsychotics', 'Clozapine, risperidone: act on dopamine + serotonin; fewer side effects.', L4);
  F('L', 'Family therapy', 'Reduces EE, improves communication, forms therapeutic alliance (Pharoah et al., 2010).', L5);
  F('L', 'Diathesis-stress', 'A vulnerability (genes/trauma) + a trigger (stress, cannabis) → schizophrenia.', L6);

  /* --- M Eating behaviour --- */
  K('M', M1, 'Explain', 4, 'Explain the evolutionary explanation for food preferences. Refer to neophobia and taste aversion.', [
    'Food preferences evolved because they helped our ancestors survive, eg preference for sweet (energy) and salty (sodium) food (1)',
    'Neophobia – an innate reluctance to eat unfamiliar foods, protecting against poisonous items, peaks around 2–6 years (1)',
    'Taste aversion – a learned avoidance of a food after one pairing with illness (Garcia et al., 1955) (1)',
    'Bitter and sour tastes were avoided as they signalled toxins/unripe food (1)'
  ]);
  K('M', M2, 'Outline', 4, 'Outline the roles of ghrelin and leptin in controlling eating.', [
    'Ghrelin is released by the stomach when it is empty (1)',
    'It stimulates the lateral hypothalamus to produce hunger (1)',
    'Leptin is released by adipose (fat) tissue after eating (1)',
    'It acts on the ventromedial hypothalamus to decrease appetite/produce satiety (1)'
  ]);
  K('M', M3, 'Outline', 3, 'Outline the neural explanation of anorexia nervosa.', [
    'Serotonin – high levels may cause anxiety, and food restriction reduces serotonin/anxiety (Bailer & Kaye, 2003) (1)',
    'Dopamine – increased dopamine receptors in the caudate nucleus may make food aversive rather than rewarding (Kaye et al., 2005) (1)',
    'Abnormal functioning of the hypothalamus/reduced serotonin levels after recovery (1)'
  ]);
  K('M', M4, 'Explain', 4, 'Explain family systems theory as an explanation of anorexia nervosa.', [
    'Minuchin et al. (1978): the psychosomatic family – families with dysfunctional patterns create AN (1)',
    'Enmeshment – family members are over-involved in each other’s lives and lack boundaries (1)',
    'Autonomy – adolescents struggle to develop independence because of overprotective parents (1)',
    'Control – refusing food is a way to gain control and assert identity (1)'
  ]);
  K('M', M6, 'Explain', 4, 'Explain the boundary model of obesity.', [
    'Herman & Polivy (1984): hunger and satiety are two boundaries, with a zone of biological indifference between them (1)',
    'Restrained eaters have a wider zone and a self-imposed diet boundary below satiety (1)',
    'If the diet boundary is crossed, restrained eaters keep eating until satiety (“what the hell” effect) (1)',
    'This explains overeating and weight gain in dieters (1)'
  ]);
  K('M', M5, 'Outline', 3, 'Outline neural explanations for obesity.', [
    'Damage to the ventromedial hypothalamus may prevent satiety signals – leading to overeating (1)',
    'Leptin resistance – leptin receptors become less responsive, so satiety is not signalled (1)',
    'Low dopamine/serotonin – eating carbohydrates increases serotonin; reduced D2 receptors means more food needed for reward (Wang et al., 2001) (1)'
  ]);
  KL('M', M4, 'Discuss', 16, 'Discuss psychological explanations for anorexia nervosa.', [
    'AO1: Family systems theory – enmeshment, autonomy, control; SLT – modelling, reinforcement, media; cognitive theory – distortions (body image) and irrational beliefs (perfectionism).',
    'AO3: Family systems – evidence is mixed; Kog & Vandereycken (1989) no clear pattern; may blame families.',
    'AO3: SLT support – Becker et al. (2002): Fiji after introduction of TV, girls reported dieting rose; correlational.',
    'AO3: Cognitive – Lang et al. (2014) meta-analysis: weaker central coherence; Halmi et al. (2000): perfectionism higher in AN.',
    'AO3: Distortions may be effects not causes of AN.',
    'AO3: Alternative explanations – genetic (Holland et al., 1984: MZ 56%, DZ 5%); diathesis-stress.',
    'AO3: Gender bias – most research on women.'
  ], 'AO1 = 6, AO3 = 10');
  KL('M', M5, 'Evaluate', 8, 'Evaluate biological explanations for obesity.', [
    'AO1 (brief): genetic (FTO gene, twin heritability 40–70%), neural (VMH, leptin, dopamine).',
    'AO3: Support – Frayling et al. (2007): FTO gene variant linked to higher risk.',
    'AO3: Cannot explain the rapid rise in obesity – genes do not change that fast; environmental factors.',
    'AO3: Biological reductionism – ignores psychological factors (restraint).',
    'AO3: Applications – leptin injections for people with leptin deficiency.'
  ], 'AO1 = 3, AO3 = 5');
  M('M', M1, 'Garcia et al. (1955) demonstrated…', 'Taste aversion learned after one pairing with sickness', ['Neophobia in children', 'Ghrelin causing hunger', 'Social learning of food preferences'], 'Rats avoided saccharin water paired with radiation-induced illness.');
  M('M', M2, 'Damage to the VMH in rats leads to…', 'Overeating', ['Undereating', 'No change', 'Neophobia'], 'Hetherington & Ranson (1942).');
  M('M', M3, 'Holland et al. (1984) found a concordance rate for AN in MZ twins of…', '56%', ['5%', '25%', '80%'], 'DZ twins 5%.');
  M('M', M6, 'In restraint theory, attempting to diet can lead to…', 'Overeating', ['Permanent weight loss', 'Taste aversion', 'Leptin resistance'], 'Herman & Mack (1975).');
  TF('M', M2, 'Leptin is produced by the stomach.', false, 'Ghrelin comes from the stomach; leptin comes from adipose tissue.');
  TF('M', M4, 'Becker et al. (2002) found dieting increased in Fiji after television was introduced.', true, 'Supports SLT and media.');
  F('M', 'Neophobia', 'Innate reluctance to eat unfamiliar foods – evolutionary protection.', M1);
  F('M', 'Taste aversion', 'Avoidance of a food after a single pairing with illness (Garcia).', M1);
  F('M', 'Ghrelin', 'Stomach hormone → lateral hypothalamus → hunger.', M2);
  F('M', 'Leptin', 'Fat-tissue hormone → ventromedial hypothalamus → satiety.', M2);
  F('M', 'Enmeshment', 'Over-involvement and weak boundaries in families (Minuchin).', M4);
  F('M', 'Cognitive distortions (AN)', 'Distorted body image; irrational beliefs such as perfectionism.', M4);
  F('M', 'Restraint theory', 'Herman & Mack: restricting food intake increases the chance of overeating.', M6);
  F('M', 'Disinhibition', 'Loss of restraint triggered by stress, alcohol or a diet violation.', M6);
  F('M', 'Boundary model', 'Herman & Polivy: zone of biological indifference; diet boundary.', M6);

  /* --- N Stress --- */
  K('N', N1, 'Outline', 4, 'Outline the general adaptation syndrome.', [
    'Selye (1936): a three-stage response to stressors, based on research with rats (1)',
    'Alarm reaction – the threat is recognised; adrenaline released for fight or flight (1)',
    'Resistance – the body adapts; resources are depleted while appearing to cope (1)',
    'Exhaustion – the body can no longer maintain resistance; illness may result (eg ulcers, depression) (1)'
  ]);
  K('N', N1, 'Explain', 4, 'Explain the role of the HPA axis in the stress response.', [
    'For chronic stress, the hypothalamus releases CRH (1)',
    'CRH stimulates the pituitary gland to release ACTH into the bloodstream (1)',
    'ACTH stimulates the adrenal cortex to release cortisol (1)',
    'Cortisol releases glucose for energy and suppresses the immune system; negative feedback regulates levels (1)'
  ]);
  K('N', N2, 'Outline', 4, 'Outline research into stress and immunosuppression.', [
    'Kiecolt-Glaser et al. (1984): 75 medical students, blood samples a month before and during exams (1)',
    'NK cell activity reduced during the exam period – immunosuppression (1)',
    'Those reporting most loneliness and life events had the lowest immune function (1)',
    'Chronic stress also affects immunity: Kiecolt-Glaser (1995) wounds healed 9 days slower in carers (1)'
  ]);
  K('N', N3, 'Outline', 4, 'Outline workplace stress, including workload and control.', [
    'Workload – long hours, high demands, pressure to meet targets (1)',
    'Control – little influence over how or when work is done increases stress (1)',
    'Marmot et al. (1997): Whitehall II – low-grade civil servants reported the least control and had a higher risk of CHD; low control mattered more than high workload (1)',
    'Johansson et al. (1978): Swedish sawmill “finishers” with repetitive, machine-paced work had higher adrenaline and illness (1)'
  ]);
  K('N', N4, 'Outline', 3, 'Outline the skin conductance response as a measure of stress.', [
    'Measures sweat gland activity using electrodes on the fingers (1)',
    'Sweating increases when the sympathetic nervous system is aroused, so skin conductance increases (1)',
    'Objective and quantitative – but individual differences (labile vs stabile) affect measurement (1)'
  ]);
  K('N', N5, 'Outline', 3, 'Outline the hardy personality.', [
    'Kobasa (1979): personality type that protects against stress (1)',
    'Commitment – a sense of involvement in work and life; Control – belief in one’s influence over events (1)',
    'Challenge – viewing change as an opportunity rather than a threat (1)'
  ]);
  K('N', N6, 'Outline', 4, 'Outline stress inoculation therapy.', [
    'Meichenbaum (1985): a form of CBT that prepares people for future stress (1)',
    'Conceptualisation – identify stressors and how one responds (1)',
    'Skills acquisition and rehearsal – coping skills such as relaxation, positive self-talk (1)',
    'Real-life application and follow-through – practice in increasingly stressful situations (1)'
  ]);
  K('N', N6, 'Distinguish', 3, 'Distinguish between instrumental, emotional and esteem support.', [
    'Instrumental: practical help, eg information or financial help (1)',
    'Emotional: expressing warmth, concern and affection (1)',
    'Esteem: increasing someone’s belief in their ability to cope, eg reassurance (1)'
  ]);
  KL('N', N5, 'Discuss', 16, 'Discuss research into personality types and stress.', [
    'AO1: Type A – competitive, time-urgent, hostile (Friedman & Rosenman, 1959); Type B – relaxed; Type C – emotionally suppressed, linked to cancer (Temoshok, 1987).',
    'AO1: Hardiness – commitment, control, challenge (Kobasa).',
    'AO3: WCGS – Type A men twice as likely to develop CHD after 8.5 years; but Ragland & Brand (1988) follow-up found no link with mortality.',
    'AO3: Hostility is the toxic component (Myrtek, 2001).',
    'AO3: Type C – Dattore et al. (1980) and Greer & Morris (1975) found emotional suppression in cancer patients; but the evidence is mixed and correlational.',
    'AO3: Hardiness support – Kobasa (1979): executives high in hardiness had less illness; but hard to measure and overlaps with neuroticism.',
    'AO3: Correlational research; self-report measures.'
  ], 'AO1 = 6, AO3 = 10');
  KL('N', N6, 'Evaluate', 8, 'Evaluate biofeedback as a method of managing stress.', [
    'AO1 (brief): measuring physiological responses (heart rate, SCR), relaxation, operant conditioning, transfer to real life.',
    'AO3: Lemaire et al. (2011): doctors using biofeedback showed significant stress reduction.',
    'AO3: Non-invasive, no side effects; teaches self-control (empowering).',
    'AO3: Requires specialist equipment and training – expensive.',
    'AO3: Relaxation may be the active component, not biofeedback.'
  ], 'AO1 = 3, AO3 = 5');
  M('N', N1, 'The SAM pathway releases…', 'Adrenaline from the adrenal medulla', ['Cortisol from the adrenal cortex', 'ACTH from the hypothalamus', 'CRH from the pituitary'], 'Acute stress response.');
  M('N', N4, 'The SRRS was developed by…', 'Holmes & Rahe (1967)', ['Kanner et al. (1981)', 'Selye (1936)', 'Kobasa (1979)'], '43 life events in life change units.');
  M('N', N4, 'Which scale measures daily hassles?', 'Hassles and Uplifts Scale', ['SRRS', 'BSRI', 'F-scale'], 'Kanner et al. (1981).');
  M('N', N6, 'Benzodiazepines reduce anxiety by enhancing the action of…', 'GABA', ['Dopamine', 'Adrenaline', 'Cortisol'], 'An inhibitory neurotransmitter.');
  M('N', N6, 'Taylor et al. (2000) suggested women respond to stress with…', 'Tend-and-befriend', ['Fight or flight only', 'Problem-focused coping only', 'Type A behaviour'], 'Linked to oxytocin.');
  TF('N', N1, 'Cortisol is released from the adrenal cortex in response to chronic stress.', true, 'Via the HPA axis.');
  TF('N', N3, 'DeLongis et al. (1982) found daily hassles were a better predictor of illness than life events.', true, 'Hassles accumulate.');
  F('N', 'GAS', 'Selye: alarm → resistance → exhaustion.', N1);
  F('N', 'HPA axis', 'Hypothalamus (CRH) → pituitary (ACTH) → adrenal cortex (cortisol). Chronic stress.', N1);
  F('N', 'SAM pathway', 'Hypothalamus → sympathetic NS → adrenal medulla (adrenaline). Acute stress.', N1);
  F('N', 'Immunosuppression', 'Stress (cortisol) reduces immune function, eg NK cells (Kiecolt-Glaser).', N2);
  F('N', 'Life changes', 'Major events requiring adjustment, measured in LCUs (Holmes & Rahe).', N3);
  F('N', 'Daily hassles', 'Everyday irritations that accumulate (Kanner et al.).', N3);
  F('N', 'Type A / B / C', 'A: competitive, hostile, time-urgent. B: relaxed. C: emotionally suppressed, people-pleasing.', N5);
  F('N', 'Hardiness', 'Kobasa: commitment, control, challenge.', N5);
  F('N', 'Stress inoculation therapy', 'Meichenbaum: conceptualisation → skills acquisition → application.', N6);
  F('N', 'Biofeedback', 'Learning to control physiological responses using feedback, relaxation and operant reinforcement.', N6);
  F('N', 'Social support', 'Instrumental, emotional and esteem support buffer stress.', N6);
