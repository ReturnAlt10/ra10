  /* ======================= SET B · PAPER 3 (layout mirrors AQA June 2024 Paper 3) ======================= */
  paper('B', 3, 'Set B');
  const M16 = (ao) => AOs(ao || 'AO1 = 6, AO3 = 10');
  const M8 = (ao) => AOs(ao || 'AO1 = 3, AO3 = 5');

  // Section A — Issues and debates (24)
  Q(1, 1, 'A', 'H', MCQ('Which one of the following is an example of psychic determinism?', ['Behaviour caused by high levels of dopamine', 'Behaviour caused by unconscious conflicts from childhood', 'Behaviour learned through reinforcement', 'Behaviour chosen through free will'], 'B'),
    AOs('AO1 = 1') + 'Answer: B', { mcq: true, ctx: [p('Only one answer is allowed.')] });
  Q(2, 1, 'A', 'H', MCQ('Which one of the following best describes cultural relativism?', ['Behaviour should be judged by the standards of the researcher’s culture', 'Behaviour can only be understood in the cultural context in which it occurs', 'All cultures share the same norms', 'Using a technique from one culture to study another'], 'B'),
    AOs('AO1 = 1') + 'Answer: B', { mcq: true });
  Q(3, 2, 'A', 'H', 'Explain what is meant by the interactionist approach in the nature–nurture debate.',
    AOs('AO1 = 2') + '• behaviour is the result of an interaction between heredity (nature) and environment (nurture) (1)\n• eg diathesis-stress – a genetic vulnerability triggered by an environmental stressor; epigenetics (1).');
  Q(4, 4, 'A', 'H', 'Using your knowledge of socially sensitive research, explain the concerns about this study.',
    AOs('AO2 = 4') + 'Level 2 (3–4) clear, effective; Level 1 (1–2) limited.\nPossible application:\n• implications – findings could stigmatise people from deprived areas as “future offenders” (Sieber & Stanley)\n• uses/public policy – the council might use findings to justify extra surveillance or reduced investment in the area\n• validity – a correlation cannot show that the area causes offending; other variables (poverty, policing) may explain it\n• ethical issues – confidentiality and anonymity of the families involved.',
    { lv: true, ctx: [p('A researcher plans to study whether children growing up on one particular council estate are more likely to commit crimes as adults. The local council has offered to fund the research.')] });
  Q(5, 16, 'A', 'H', 'Discuss gender bias in psychology.',
    M16() + 'Possible content:\n• universality and gender bias; alpha bias (exaggerates differences – eg Freud’s superego, sociobiology); beta bias (minimises differences – eg fight or flight, Kohlberg’s moral development based on males); androcentrism (male norm – eg PMS).\nPossible discussion:\n• consequences – bias may validate discrimination (eg women seen as less moral; over-diagnosis of depression)\n• research methods may be biased – lab experiments, male researchers (Nicolson, 1995)\n• reflexivity – modern researchers reflect on their values; feminist psychology (Worell, 1992) suggests remedies\n• real differences exist – avoiding alpha bias may cause beta bias (Eagly, 1978)\n• examples from topics studied (eg attachment, stress, relationships).\nCredit other relevant material.', { lv: true });

  /* Section B — Option 1 */
  // Relationships (06–11)
  Q(6, 3, 'B', 'I', 'Outline the absorption-addiction model of parasocial relationships.',
    AOs('AO1 = 3') + '• McCutcheon (2002): parasocial relationships arise from deficits in real-life relationships / a weak identity (1)\n• absorption – focusing attention on the celebrity to achieve a sense of identity and fulfilment (1)\n• addiction – needing increasingly stronger involvement, which may lead to delusional thinking/stalking (borderline-pathological) (1).');
  Q(7, 2, 'B', 'I', 'Explain what is meant by the absence of gating in online relationships.',
    AOs('AO1 = 2') + '• gates are obstacles to forming a relationship, eg physical unattractiveness, shyness, stammer (1)\n• online these are absent, so people can focus on self-disclosure/shared interests and form relationships they otherwise might not (1).');
  Q(8, 1, 'B', 'I', MCQ('In Rusbult’s investment model, which of the following is an extrinsic investment?', ['Time spent together', 'Emotional energy', 'A shared house', 'Self-disclosure'], 'C'),
    AOs('AO1 = 1') + 'Answer: C', { mcq: true });
  Q(9, 2, 'B', 'I', 'Explain one limitation of the matching hypothesis.',
    AOs('AO3 = 2') + '• research evidence is mixed, eg Walster et al. (1966) computer dance found people preferred the most attractive partner regardless of their own attractiveness / Taylor et al. (2011) online daters contacted more attractive partners (1)\n• so physical attractiveness may be balanced by other factors (complex matching, eg status, humour) and the hypothesis is oversimplified (1).');
  Q(10, 8, 'B', 'I', 'Discuss equity theory as an explanation of romantic relationships.',
    M8() + 'Possible content: Walster et al. (1978) – fairness; perceived equity; ratio of inputs to outputs; both under- and over-benefited are dissatisfied; consequences of inequity – attempts to restore equity; changes over time.\nPossible discussion: Utne et al. (1984) support; cultural differences (Aumer-Ryan et al., 2007); individual differences – benevolents vs entitleds (Huseman et al., 1987); equity may be less important than overall rewards; correlational research.', { lv: true });
  Q(11, 8, 'B', 'I', 'Discuss research into self-disclosure in virtual relationships. Refer to Ben in your answer.',
    AOs('AO1 = 3, AO2 = 2, AO3 = 3') + 'Possible content: reduced cues theory (Sproull & Kiesler) – fewer non-verbal cues, de-individuation, less disclosure; hyperpersonal model (Walther, 1996) – faster, deeper disclosure; selective self-presentation; boom-and-bust.\nPossible application: Ben shares personal details quickly online (hyperpersonal); he can edit messages and present himself selectively; anonymity reduces fear of rejection; the relationship may be intense but fragile.\nPossible discussion: Jiang et al. (2011) support for hyperpersonal model; reduced cues ignores alternative cues (emoticons, timing); online and offline relationships are now integrated; research is often correlational/self-report.',
    { lv: true, ctx: [p('Ben is shy and finds it hard to talk to people face to face. Since joining an online gaming community, he has told another player, Jess, about his family problems within a few weeks. He spends a long time editing his messages before sending them.')] });
  // Gender (12–17)
  Q(12, 3, 'B', 'J', 'Outline how gender has been measured using the Bem Sex Role Inventory.',
    AOs('AO1 = 3') + '• 60 characteristics: 20 masculine, 20 feminine and 20 neutral (1)\n• respondents rate themselves on a 7-point scale for each characteristic (1)\n• scores classify people as masculine, feminine, androgynous (high on both) or undifferentiated (low on both) (1).');
  Q(13, 2, 'B', 'J', 'Distinguish between non-binary and gender-fluid identities.',
    AOs('AO1 = 2') + '• non-binary – a gender identity that is not exclusively man or woman, eg neither, both or in between (1)\n• gender-fluid – a gender identity that changes over time or across situations (1).');
  Q(14, 1, 'B', 'J', MCQ('Which hormone is most associated with lactation and social bonding?', ['Testosterone', 'Oestrogen', 'Oxytocin', 'Cortisol'], 'C'),
    AOs('AO1 = 1') + 'Answer: C', { mcq: true });
  Q(15, 2, 'B', 'J', 'Explain one criticism of research into the influence of the media on gender roles.',
    AOs('AO3 = 2') + '• research is often correlational/content analysis – it cannot show the media causes gender-typed behaviour (1)\n• children with stereotyped views may choose stereotyped media / media may reflect rather than shape gender roles (1).');
  Q(16, 8, 'B', 'J', 'Discuss gender schema theory.',
    M8() + 'Possible content: Martin & Halverson (1981) – gender identity (2–3) enough; gender schemas organise information; in-group/out-group schemas; in-group favouritism; schemas rigid; inconsistent information ignored/distorted.\nPossible discussion: support – Martin & Little (1990); Martin & Halverson (1983) memory distortion; explains rigid stereotypes; underestimates social influences; does not explain why schemas develop; may not account for non-binary identities.', { lv: true });
  Q(17, 8, 'B', 'J', 'Discuss biological and social/cultural explanations of gender incongruence.',
    M8() + 'Possible content: gender incongruence – marked mismatch between experienced gender and sex assigned at birth (ICD-11); biological – brain-sex theory (BSTc, Zhou et al., 1995), genetic factors (Hare et al., 2009 – androgen receptor gene), prenatal hormones; social/cultural – cultural recognition of gender diversity, family and social responses.\nPossible discussion: BSTc samples small and most had taken hormones (Hulshoff Pol et al., 2006); genetic findings inconsistent; interactionist explanations; socially sensitive – risk of pathologising; changing classifications and language.', { lv: true });
  // Cognition and development (18–23)
  Q(18, 3, 'B', 'K', 'Outline Selman’s levels of perspective-taking.',
    AOs('AO1 = 3') + '1 mark per level briefly outlined (max 3), eg undifferentiated (3–6) – no understanding that others have different views; social-informational (4–9) – others have different views because they have different information; self-reflective (7–12) – can see own behaviour from another’s perspective; third-party (10–15) – neutral observer; societal (14+) – social norms.');
  Q(19, 2, 'B', 'K', 'Explain what is meant by equilibration in Piaget’s theory.',
    AOs('AO1 = 2') + '• the drive to restore a balanced state when new information does not fit existing schemas (disequilibrium) (1)\n• achieved through assimilation or accommodation (1).');
  Q(20, 1, 'B', 'K', MCQ('In the Sally-Anne study, approximately what percentage of autistic children passed the false-belief task?', ['20%', '50%', '85%', '86%'], 'A'),
    AOs('AO1 = 1') + 'Answer: A', { mcq: true });
  Q(21, 2, 'B', 'K', 'Explain one limitation of using the violation of expectation paradigm.',
    AOs('AO3 = 2') + '• longer looking may reflect noticing novelty or a difference rather than understanding/surprise (1)\n• so it may not show infants understand the physical world – low validity (Bremner & Mareschal, 2004) (1).');
  Q(22, 8, 'B', 'K', 'Discuss the role of the mirror neuron system in social cognition.',
    M8() + 'Possible content: mirror neurons fire when performing and observing an action (Rizzolatti, macaques); may allow understanding of intentions and emotions; empathy; theory of mind; perspective-taking; broken mirror theory of autism.\nPossible discussion: evidence mostly from monkeys – human evidence indirect (fMRI); Hickok (2009) – role overstated; links to autism mixed; explains social cognition at a biological level – reductionist.', { lv: true });
  Q(23, 8, 'B', 'K', 'Discuss Vygotsky’s theory of cognitive development. Refer to Amir in your answer.',
    AOs('AO1 = 3, AO2 = 2, AO3 = 3') + 'Possible content: role of culture and social interaction; MKO; ZPD; scaffolding; semiotics.\nPossible application: Amir can build the model with his grandmother’s help (ZPD); she is the MKO; her hints that reduce over time are scaffolding; talking through the steps – language.\nPossible discussion: Wood & Middleton (1975); Conner et al. (1997); peer tutoring applications; underplays biological factors; hard to test precisely.',
    { lv: true, ctx: [p('Amir, aged 7, could not build a model plane from the instructions alone. His grandmother sat with him and talked through each step, pointing out which pieces to use. Each time they built a new model, she helped him less.')] });

  /* Section C — Option 2 */
  // Schizophrenia (24–28)
  Q(24, 1, 'C', 'L', MCQ('Which one of the following is a negative symptom of schizophrenia?', ['Auditory hallucinations', 'Delusions of persecution', 'Avolition', 'Thought insertion'], 'C'),
    AOs('AO1 = 1') + 'Answer: C', { mcq: true });
  Q(25, 1, 'C', 'L', MCQ('Which drug is an atypical antipsychotic?', ['Chlorpromazine', 'Clozapine', 'Fluoxetine', 'Diazepam'], 'B'),
    AOs('AO1 = 1') + 'Answer: B', { mcq: true });
  Q(26, 2, 'C', 'L', 'Outline what is meant by expressed emotion.',
    AOs('AO1 = 2') + '• the level of emotion, especially negative emotion, expressed towards a patient by carers (1)\n• includes criticism, hostility and emotional over-involvement; a source of stress that may trigger relapse (1).');
  Q(27, 4, 'C', 'L', 'Explain how family therapy could be used to help Callum and his family.',
    AOs('AO2 = 4') + 'Level 2 (3–4) clear, effective; Level 1 (1–2) limited.\nPossible application: reduce expressed emotion – his parents’ criticism and shouting; therapeutic alliance with all members; improve communication and problem solving; educate the family about schizophrenia; help his parents balance caring with their own lives; reduce stress, so reduce relapse (Pharoah et al., 2010).',
    { lv: true, ctx: [p('Callum has schizophrenia and lives with his parents. They often criticise him for not getting a job and shout at him about his “laziness”. Callum has relapsed twice this year.')] });
  Q(28, 16, 'C', 'L', 'Discuss biological explanations for schizophrenia.',
    M16() + 'Possible content: genetic – family studies (Gottesman, 1991: MZ 48%, DZ 17%), polygenic (Ripke et al., 2014: 108 variations), mutation (paternal age); dopamine hypothesis – original (hyperdopaminergia in subcortex), revised (hypodopaminergia in prefrontal cortex); neural correlates – ventral striatum and avolition (Juckel et al., 2006), superior temporal gyrus and hallucinations.\nPossible discussion: strong twin/adoption evidence (Tienari, Hilker et al., 2018); concordance not 100% – environment matters; dopamine support from drugs, but glutamate also implicated; neural correlates may be effects not causes; biological reductionism; interactionist (diathesis-stress) approach.', { lv: true });
  // Eating behaviour (29–33)
  Q(29, 1, 'C', 'M', MCQ('Which area of the brain is most associated with satiety?', ['Lateral hypothalamus', 'Ventromedial hypothalamus', 'Amygdala', 'Caudate nucleus'], 'B'),
    AOs('AO1 = 1') + 'Answer: B', { mcq: true });
  Q(30, 1, 'C', 'M', MCQ('In family systems theory, a family where members are over-involved in each other’s lives is described as…', ['Autonomous', 'Disinhibited', 'Enmeshed', 'Restrained'], 'C'),
    AOs('AO1 = 1') + 'Answer: C', { mcq: true });
  Q(31, 2, 'C', 'M', 'Explain what is meant by disinhibition in relation to obesity.',
    AOs('AO1 = 2') + '• a loss of restraint over eating, leading to overeating (1)\n• triggered by eg stress, alcohol, emotions or breaking a diet (“what the hell” effect) (1).');
  Q(32, 4, 'C', 'M', 'Use your knowledge of the boundary model to explain Tasha’s eating.',
    AOs('AO2 = 4') + 'Level 2 (3–4) clear, effective; Level 1 (1–2) limited.\nPossible application: Tasha is a restrained eater with a self-imposed diet boundary (1,200 calories) below satiety; her zone of biological indifference is wide; eating the biscuit crosses the diet boundary; she then eats until satiety (whole packet) – “what the hell” effect; explains weight gain despite dieting.',
    { lv: true, ctx: [p('Tasha has been on a strict 1,200-calorie diet for a month. At work she accepted one chocolate biscuit, then ate the whole packet. “I’d already ruined my diet,” she said. She has gained weight since starting to diet.')] });
  Q(33, 16, 'C', 'M', 'Discuss neural and hormonal mechanisms involved in the control of eating behaviour.',
    M16() + 'Possible content: homeostasis; lateral hypothalamus (hunger) and ventromedial hypothalamus (satiety); ghrelin (stomach, empty) → LH; leptin (adipose tissue) → VMH; lesion studies (Hetherington & Ranson; Anand & Brobeck).\nPossible discussion: animal lesion research may not generalise; leptin resistance explains some obesity – applications (leptin therapy for congenital deficiency); eating is also affected by psychological, social and cultural factors – reductionist; complex – other hormones (eg insulin, CCK) and areas (arcuate nucleus) involved.', { lv: true });
  // Stress (34–38)
  Q(34, 1, 'C', 'N', MCQ('Which stage of the general adaptation syndrome is associated with the body appearing to cope while resources are being depleted?', ['Alarm reaction', 'Resistance', 'Exhaustion', 'Recovery'], 'B'),
    AOs('AO1 = 1') + 'Answer: B', { mcq: true });
  Q(35, 1, 'C', 'N', MCQ('Which of the following is an example of esteem support?', ['Lending someone money', 'Telling a friend you believe they can pass their exam', 'Giving a hug', 'Driving someone to an appointment'], 'B'),
    AOs('AO1 = 1') + 'Answer: B', { mcq: true });
  Q(36, 2, 'C', 'N', 'Outline one gender difference in coping with stress.',
    AOs('AO1 = 2') + '• women are more likely to use emotion-focused coping/tend-and-befriend (Taylor et al., 2000), while men use more problem-focused coping/fight or flight (1)\n• explanation, eg oxytocin in women; socialisation of gender roles (1).');
  Q(37, 4, 'C', 'N', 'Explain how stress could be measured using a self-report scale and a physiological measure. Refer to Asif.',
    AOs('AO2 = 4') + 'Level 2 (3–4) clear, effective; Level 1 (1–2) limited.\nPossible application: SRRS – Asif ticks life events from the past year (redundancy, moving house, divorce) to calculate life change units; Hassles and Uplifts Scale – frequency/severity of daily hassles (traffic, arguments); skin conductance response – electrodes on fingers measure sweat during a stressful interview; compare readings at rest.',
    { lv: true, ctx: [p('Asif has been made redundant, has moved house and is going through a divorce. He also complains about daily traffic jams and arguments with his neighbour. A psychologist wants to measure how stressed he is.')] });
  Q(38, 16, 'C', 'N', 'Discuss the role of stress in illness.',
    M16() + 'Possible content: immunosuppression – cortisol reduces immune function; Kiecolt-Glaser et al. (1984) NK cells in exams; Kiecolt-Glaser et al. (1995) wound healing in carers; cardiovascular disorders – hypertension, CHD; Williams (2000) anger and heart attacks; Orth-Gomér et al. (2000) marital stress.\nPossible discussion: correlational evidence – stress also affects health behaviours (smoking, diet); acute stress may enhance immunity (Segerstrom & Miller, 2004); individual differences (Type A, hardiness); real-world applications – stress management; ethical/practical limits on experimental research.', { lv: true });

  /* Section D — Option 3 */
  // Aggression (39–42)
  Q(39, 3, 'D', 'O', 'Outline the ethological explanation of aggression.',
    AOs('AO1 = 3') + '• aggression is adaptive – reduces competition, establishes dominance (1)\n• innate releasing mechanism triggered by a sign stimulus releases a fixed action pattern (eg Tinbergen’s sticklebacks attacking red-bellied models) (1)\n• FAPs are universal, ballistic, single-purpose; ritualistic signalling reduces death (1).');
  Q(40, 2, 'D', 'O', 'Explain what is meant by cognitive priming in relation to media influences on aggression.',
    AOs('AO1 = 2') + '• repeated exposure to violent media provides a script for aggressive behaviour stored in memory (1)\n• the script is activated by cues in a real situation, making aggressive responses more likely (1).');
  Q(41, 3, 'D', 'O', 'Using your knowledge of social learning theory, explain Max’s behaviour.',
    AOs('AO2 = 3') + '• observation and imitation – Max imitates the specific moves he saw his older brother use (1)\n• vicarious reinforcement – his brother was praised/admired by friends for fighting (1)\n• identification – his brother is a high-status, similar model; self-efficacy – Max’s confidence increases after his first “win” (1).',
    { ctx: [p('Max, aged 10, has started copying the punches and kicks his older brother uses in fights. Max saw that his brother’s friends cheered and admired him afterwards. After pushing a boy over at school, Max said he felt “unbeatable”.')] });
  Q(42, 16, 'D', 'O', 'Discuss neural and hormonal mechanisms in aggression.',
    M16() + 'Possible content: limbic system – amygdala (threat), hypothalamus; serotonin – inhibitory, low levels and impulsive aggression; testosterone – androgen, dual-hormone hypothesis (cortisol).\nPossible discussion: support – Gospic et al. (2011), Virkkunen et al. (1994); animal research generalisation; testosterone evidence mixed (Carré & Mehta, 2011); correlational; biological reductionism – ignores social explanations; interaction with genetic factors (MAOA) and environment.', { lv: true });
  // Forensic Psychology (43–46)
  Q(43, 3, 'D', 'P', 'Outline geographical profiling.',
    AOs('AO1 = 3') + '• uses the locations of linked crimes to infer the likely base/home of the offender (crime mapping) (1)\n• Canter’s circle theory – marauders operate close to home; commuters travel away (1)\n• assumes spatial consistency – offenders operate in familiar areas; may also give information about transport, employment (1).');
  Q(44, 2, 'D', 'P', 'Identify two aims of custodial sentencing.',
    AOs('AO1 = 2') + '1 mark each: deterrence; incapacitation (protecting the public); retribution; rehabilitation.');
  Q(45, 3, 'D', 'P', 'Explain how a token economy could be used with young offenders in Kayla’s unit.',
    AOs('AO2 = 3') + '• operant conditioning – desirable behaviours (eg attending education, keeping rooms tidy) are identified and broken into steps (1)\n• tokens (secondary reinforcers) given immediately when behaviour occurs (1)\n• tokens exchanged for primary reinforcers/privileges (eg phone calls, games time); staff trained to apply it consistently (1).',
    { ctx: [p('Kayla manages a unit for young offenders. She wants the young people to attend education sessions and keep their rooms tidy.')] });
  Q(46, 16, 'D', 'P', 'Discuss Eysenck’s theory of the criminal personality.',
    M16() + 'Possible content: dimensions – extraversion, neuroticism, psychoticism; biological basis – extraverts have an underactive nervous system and seek stimulation; neurotics are unstable; the criminal personality is high E, N and P; such people are hard to condition / socialisation; measured by the EPQ.\nPossible discussion: support – Eysenck & Eysenck (1977); contradictory – Farrington et al. (1982); cultural bias – Bartol & Holanchock (1979); personality may not be stable (Mischel); offending is not one type of behaviour; biological determinism; interaction with environment.', { lv: true });
  // Addiction (47–50)
  Q(47, 3, 'D', 'Q', 'Outline Prochaska’s six-stage model of behaviour change.',
    AOs('AO1 = 3') + '1 mark per stage outlined (max 3), eg precontemplation – no intention to change within 6 months; contemplation – intending to change within 6 months; preparation – within 30 days; action – changed within past 6 months; maintenance – more than 6 months; termination – no temptation.');
  Q(48, 2, 'D', 'Q', 'Explain what is meant by the gambler’s fallacy.',
    AOs('AO1 = 2') + '• a cognitive bias – the belief that past outcomes affect future independent events (1)\n• eg after a run of losses a gambler believes a win is “due”, so keeps gambling (1).');
  Q(49, 3, 'D', 'Q', 'Using your knowledge of risk factors in addiction, explain why Lily may be at risk of developing an addiction.',
    AOs('AO2 = 3') + '1 mark per risk factor applied to the stem (max 3):\n• genetic vulnerability – her father and grandfather both had alcohol addiction\n• stress – exam stress and her parents’ divorce\n• peers – her friends drink heavily every weekend (social norms)\n• personality – she describes herself as a thrill-seeker (sensation seeking/impulsivity).',
    { ctx: [p('Lily is 17. Her father and grandfather both had alcohol addiction. Her parents are divorcing and she is stressed about her exams. Lily describes herself as a thrill-seeker, and her friends drink heavily every weekend.')] });
  Q(50, 16, 'D', 'Q', 'Discuss explanations for nicotine addiction.',
    M16() + 'Possible content: brain neurochemistry – nicotine binds to nicotinic acetylcholine receptors in the VTA, dopamine released in the nucleus accumbens (mesolimbic pathway), pleasure, desensitisation, tolerance, withdrawal; learning theory – positive and negative reinforcement, cue reactivity (classical conditioning, secondary reinforcers).\nPossible discussion: support – Corrigall & Coen (1991) dopamine blocking in rats; Carter & Tiffany (1999) cue reactivity; applications – NRT, varenicline, cue exposure therapy; partial explanations – individual differences in who becomes addicted; animal research; interactionist view.', { lv: true });
