  /* ===== Paper 3 Option 3 (Section D): O Aggression · P Forensic Psychology · Q Addiction ===== */
  const O1 = '3.8.1 Neural, hormonal & genetic', O2 = '3.8.2 Ethological & evolutionary', O3 = '3.8.3 Social psychological', O4 = '3.8.4 Institutional aggression', O5 = '3.8.5 Media influences';
  const P1 = '3.9.1 Offender profiling', P2 = '3.9.2 Biological explanations', P3 = '3.9.3 Psychological explanations', P4 = '3.9.4 Dealing with offending';
  const Q1 = '3.10.1 Describing addiction', Q2 = '3.10.2 Risk factors', Q3 = '3.10.3 Nicotine addiction', Q4 = '3.10.4 Gambling addiction', Q5 = '3.10.5 Reducing addiction', Q6 = '3.10.6 Prochaska’s model';

  /* --- O Aggression --- */
  K('O', O1, 'Outline', 4, 'Outline the roles of the limbic system and serotonin in aggression.', [
    'The limbic system (amygdala, hypothalamus, hippocampus) is involved in emotional behaviour including aggression (1)',
    'The amygdala evaluates the threat of sensory input; greater reactivity predicts aggression (Gospic et al., 2011) (1)',
    'Normal serotonin levels have an inhibitory effect, reducing firing in the amygdala and allowing self-control (1)',
    'Low serotonin reduces self-control, increasing impulsive aggression (Virkkunen et al., 1994) (1)'
  ]);
  K('O', O1, 'Explain', 3, 'Explain the role of the MAOA gene in aggression.', [
    'MAOA regulates the enzyme monoamine oxidase A, which breaks down serotonin (and other neurotransmitters) (1)',
    'The low-activity variant (MAOA-L, “warrior gene”) is linked to aggression – Brunner et al. (1993): Dutch family (1)',
    'Caspi et al. (2002): MAOA-L only linked to antisocial behaviour in men who were maltreated as children – gene–environment interaction (1)'
  ]);
  K('O', O2, 'Explain', 4, 'Explain the ethological explanation of aggression.', [
    'Aggression is adaptive – it reduces competition and helps establish dominance hierarchies (1)',
    'Ritualistic signalling (threat displays) means aggression rarely leads to death (Lorenz) (1)',
    'Innate releasing mechanism – an inbuilt neural network that, when triggered by a stimulus, releases a fixed action pattern (1)',
    'FAP – a sequence of stereotyped behaviours that is universal, ballistic and single-purpose; Tinbergen (1951): stickleback attacked red-bellied models (1)'
  ]);
  K('O', O3, 'Explain', 4, 'Explain the frustration-aggression hypothesis.', [
    'Dollard et al. (1939): frustration always leads to aggression, and aggression is always the result of frustration (1)',
    'Frustration occurs when goal-directed behaviour is blocked; it creates an aggressive drive (1)',
    'Aggression is cathartic – releasing it reduces the drive (1)',
    'Aggression may be displaced onto a weaker target if the cause is abstract, powerful or unavailable (1)'
  ]);
  K('O', O3, 'Outline', 3, 'Outline de-individuation as an explanation of aggression.', [
    'De-individuation is a loss of personal identity when in a crowd or anonymous (Zimbardo, 1969) (1)',
    'Reduced private self-awareness and public self-awareness (Prentice-Dunn & Rogers) (1)',
    'This means normal social restraints are weakened, increasing aggression; eg Zimbardo’s hooded participants gave twice as many shocks (1)'
  ]);
  K('O', O4, 'Distinguish', 4, 'Distinguish between dispositional and situational explanations of institutional aggression in prisons.', [
    'Dispositional: the importation model (Irwin & Cressey, 1962) – prisoners bring their norms and values in from outside (1)',
    'eg prisoners from a “criminal subculture” bring aggressive norms (1)',
    'Situational: the deprivation model (Clemmer, 1940) – aggression is caused by the prison environment (1)',
    'Sykes (1958): pains of imprisonment – loss of liberty, autonomy, goods and services, heterosexual relationships, security (1)'
  ]);
  K('O', O5, 'Explain', 3, 'Explain how desensitisation may explain the effect of computer games on aggression.', [
    'Repeated exposure to violent games reduces physiological arousal to violence (1)',
    'Players become less anxious about violence and see it as more normal/acceptable (1)',
    'They may be less sympathetic to victims and more likely to behave aggressively; Carnagey et al. (2007): lower heart rate and GSR to real violence after violent games (1)'
  ]);
  KL('O', O3, 'Discuss', 16, 'Discuss social learning theory as applied to human aggression.', [
    'AO1: Observation and imitation of models; vicarious reinforcement; mediational processes (attention, retention, reproduction, motivation); self-efficacy.',
    'AO1: Bandura et al. (1961, 1963) Bobo doll studies.',
    'AO3: Supporting evidence – Poulin & Boivin (2000): boys formed friendships based on proactive aggression.',
    'AO3: Bobo doll limitations – a doll, not a person; demand characteristics; short-term effects.',
    'AO3: Explains cultural differences – !Kung San (Draper, 1978) low aggression; but does not explain reactive aggression well.',
    'AO3: Applications – reducing aggression by limiting exposure to models; but biological factors ignored.'
  ], 'AO1 = 6, AO3 = 10');
  KL('O', O5, 'Evaluate', 8, 'Evaluate research into media influences on aggression.', [
    'AO1 (brief): computer games (DeLisi, 2013), desensitisation, disinhibition, cognitive priming.',
    'AO3: Lab studies – Bartholow & Anderson (2002): violent game players gave more intense noise blasts; low ecological validity.',
    'AO3: Meta-analysis – Anderson et al. (2010): violent games linked to aggression across cultures; Ferguson (2015) found minimal effects.',
    'AO3: Correlational studies cannot show direction.',
    'AO3: Real-world implications – age ratings.'
  ], 'AO1 = 3, AO3 = 5');
  M('O', O1, 'Testosterone is mainly produced in the…', 'Testes', ['Pineal gland', 'Amygdala', 'Pancreas'], 'Also in smaller amounts in the ovaries.');
  M('O', O1, 'The dual-hormone hypothesis suggests testosterone increases aggression only when…', 'Cortisol levels are low', ['Serotonin levels are high', 'Oxytocin levels are high', 'The MAOA gene is high-activity'], 'Carré & Mehta (2011).');
  M('O', O4, 'The deprivation model of institutional aggression is a…', 'Situational explanation', ['Dispositional explanation', 'Biological explanation', 'Ethological explanation'], 'Clemmer; Sykes’ pains of imprisonment.');
  M('O', O5, 'Cognitive priming refers to…', 'Violent media providing scripts that are activated later', ['A loss of arousal to violence', 'A loss of inhibitions', 'Catharsis'], 'Bushman (2016).');
  TF('O', O2, 'FAPs are learned through observation of others.', false, 'FAPs are innate.');
  TF('O', O3, 'Berkowitz (1989) revised the frustration-aggression hypothesis to include environmental cues.', true, 'Weapon effect (Berkowitz & LePage, 1967).');
  F('O', 'Limbic system', 'Amygdala, hypothalamus, hippocampus – emotion and threat response.', O1);
  F('O', 'Serotonin (aggression)', 'Inhibitory; low levels → impulsive aggression.', O1);
  F('O', 'MAOA gene', 'Low-activity variant linked to aggression, esp. with childhood maltreatment (Caspi, 2002).', O1);
  F('O', 'Fixed action pattern', 'Innate, stereotyped sequence of behaviour triggered by a sign stimulus via an IRM.', O2);
  F('O', 'Frustration-aggression hypothesis', 'Dollard et al. (1939): frustration → aggressive drive → aggression (catharsis).', O3);
  F('O', 'De-individuation', 'Loss of personal identity in crowds/anonymity reduces restraint.', O3);
  F('O', 'Importation model', 'Prisoners bring aggressive norms from outside (dispositional).', O4);
  F('O', 'Deprivation model', 'Prison deprivations cause aggression (situational).', O4);
  F('O', 'Disinhibition (media)', 'Violent media weakens normal social restraints on aggression.', O5);

  /* --- P Forensic Psychology --- */
  K('P', P1, 'Distinguish', 4, 'Distinguish between the top-down and bottom-up approaches to offender profiling.', [
    'Top-down (typology/American approach): profilers match crime-scene evidence to pre-existing types of offender (1)',
    'eg organised vs disorganised types based on interviews with 36 sexually motivated murderers (FBI) (1)',
    'Bottom-up (data-driven/British approach): the profile is built from the evidence of the crime using statistical analysis of databases (1)',
    'eg investigative psychology (Canter) – interpersonal coherence, forensic awareness; geographical profiling (1)'
  ]);
  K('P', P1, 'Outline', 3, 'Outline geographical profiling.', [
    'Uses the location of linked crimes to infer the likely home/base of the offender (crime mapping) (1)',
    'Canter’s circle theory – marauders operate close to home; commuters travel away (1)',
    'Assumes offenders operate within an area they know (spatial consistency) (1)'
  ]);
  K('P', P2, 'Outline', 4, 'Outline neural explanations of offending behaviour.', [
    'Antisocial personality disorder (APD) is linked to reduced activity in the prefrontal cortex (1)',
    'Raine et al. (2000): people with APD had 11% less grey matter in the prefrontal cortex (1)',
    'Mirror neurons – Keysers (2011): criminals only felt empathy when asked to (1)',
    'This suggests an ability to switch off empathy, reducing guilt (1)'
  ]);
  K('P', P3, 'Explain', 4, 'Explain Eysenck’s theory of the criminal personality.', [
    'Personality has dimensions: extraversion–introversion, neuroticism–stability, later psychoticism (1)',
    'These traits are biologically based – extraverts have an underactive nervous system and seek excitement (1)',
    'Neurotics have a reactive sympathetic NS and are unstable/over-react to threats (1)',
    'The criminal personality is high E, high N, high P; such people are hard to condition, so do not learn to avoid antisocial behaviour (1)'
  ]);
  K('P', P3, 'Outline', 4, 'Outline cognitive distortions as an explanation of offending behaviour.', [
    'Cognitive distortions are faulty, biased and irrational ways of thinking (1)',
    'Hostile attribution bias – misinterpreting others’ actions as aggressive/threatening (eg Schönenberg & Justye, 2014) (1)',
    'Minimalisation – downplaying the seriousness of an offence, eg burglars describe crime as “doing a job” (1)',
    'Barbaree (1991): 54% of rapists denied an offence; 40% minimised the harm (1)'
  ]);
  K('P', P4, 'Outline', 4, 'Outline restorative justice programmes.', [
    'Focus on the rehabilitation of offenders and atonement for wrongdoing (1)',
    'A trained mediator facilitates a meeting between offender and victim, face to face or via video (1)',
    'The victim explains the impact; the offender sees the harm and takes responsibility (1)',
    'Offenders may offer compensation or repair damage; the victim has a voice (1)'
  ]);
  K('P', P4, 'Outline', 4, 'Outline the use of behaviour modification in custody.', [
    'Based on operant conditioning – desirable behaviour is reinforced, undesirable behaviour is not (1)',
    'Token economy – prisoners receive tokens for desirable behaviour (eg following rules) (1)',
    'Tokens are secondary reinforcers exchanged for primary reinforcers (eg phone calls, food) (1)',
    'Specific behaviours are defined and staff are trained to deliver reinforcement consistently (1)'
  ]);
  KL('P', P3, 'Discuss', 16, 'Discuss differential association theory as an explanation of offending behaviour.', [
    'AO1: Sutherland (1939): offending is learned through interactions with significant others; pro-criminal attitudes and techniques; the ratio of pro- to anti-criminal attitudes.',
    'AO3: Shifts focus from biology to social factors – avoids biological determinism.',
    'AO3: Supporting evidence – Osborn & West (1979): 40% of sons of criminal fathers had convictions by 18 vs 13% of non-criminal fathers.',
    'AO3: Hard to test – cannot measure numbers of pro-criminal attitudes.',
    'AO3: Explains different types of crime – white-collar crime.',
    'AO3: Risks stereotyping people from crime-ridden backgrounds; ignores individual differences – not everyone exposed becomes an offender.'
  ], 'AO1 = 6, AO3 = 10');
  KL('P', P4, 'Evaluate', 8, 'Evaluate anger management as a way of dealing with offending behaviour.', [
    'AO1 (brief): Novaco (1975) – cognitive preparation, skill acquisition, application practice.',
    'AO3: Keen et al. (2000): young offenders showed improved self-control after anger management.',
    'AO3: Tackles a cause of offending (cognitive), unlike behaviour modification.',
    'AO3: Long-term effectiveness unclear – Blacker et al. (2008): improvements but no reduction in reoffending.',
    'AO3: Requires commitment and skilled specialists – expensive.'
  ], 'AO1 = 3, AO3 = 5');
  M('P', P1, 'Which approach to profiling is associated with the FBI?', 'Top-down (typology)', ['Bottom-up', 'Investigative psychology', 'Geographical profiling'], 'Organised and disorganised types.');
  M('P', P2, 'Lange (1929) studied 13 MZ twins in which one had been in prison. How many co-twins had also been in prison?', '10', ['2', '13', '5'], '10 of 13 MZ vs 2 of 17 DZ.');
  M('P', P3, 'Kohlberg found offenders were likely to be at which level of moral reasoning?', 'Pre-conventional', ['Conventional', 'Post-conventional', 'Formal operational'], 'Reason based on avoiding punishment/gaining reward.');
  M('P', P4, 'The idea that prisoners learn offending techniques from other prisoners is…', 'Prison as a “university of crime”', ['Institutionalisation', 'Retribution', 'Restoration'], 'A psychological effect of custodial sentencing.');
  TF('P', P4, 'Deterrence, incapacitation, retribution and rehabilitation are aims of custodial sentencing.', true, 'Four aims.');
  TF('P', P1, 'Bottom-up profiling relies on pre-existing offender types.', false, 'That is top-down.');
  F('P', 'Organised offender', 'Planned, controlled crime scene, high IQ, socially and sexually competent.', P1);
  F('P', 'Disorganised offender', 'Unplanned, chaotic crime scene, low IQ, socially and sexually incompetent.', P1);
  F('P', 'Investigative psychology', 'Canter: statistical analysis of crime databases; interpersonal coherence; forensic awareness.', P1);
  F('P', 'Eysenck’s criminal personality', 'High extraversion, neuroticism and psychoticism; hard to condition.', P3);
  F('P', 'Hostile attribution bias', 'Misreading others’ actions as threatening.', P3);
  F('P', 'Minimalisation', 'Downplaying the seriousness of an offence.', P3);
  F('P', 'Differential association', 'Sutherland: offending is learned through interaction with pro-criminal others.', P3);
  F('P', 'Token economy', 'Behaviour modification: tokens (secondary reinforcers) exchanged for rewards.', P4);
  F('P', 'Restorative justice', 'Offender meets victim (via mediator) to take responsibility and repair harm.', P4);

  /* --- Q Addiction --- */
  K('Q', Q1, 'Distinguish', 4, 'Distinguish between physical and psychological dependence.', [
    'Physical dependence: the body has adapted to the substance and needs it to function normally (1)',
    'Stopping produces physical withdrawal symptoms such as shaking, sweating, nausea (1)',
    'Psychological dependence: a compulsion/need to continue the behaviour for its pleasurable effects (1)',
    'Stopping produces cravings and anxiety, eg gambling (1)'
  ]);
  K('Q', Q2, 'Outline', 4, 'Outline genetic vulnerability and personality as risk factors in addiction.', [
    'Genetic vulnerability – some people inherit genes that increase risk, eg DRD2 gene linked to fewer dopamine receptors (1)',
    'Twin studies – Agrawal & Lynskey (2008): heritability of addiction 40–60% (1)',
    'Personality – high neuroticism and psychoticism (Eysenck) linked to addiction (1)',
    'Sensation seeking/impulsivity increase risk of using substances/gambling (1)'
  ]);
  K('Q', Q3, 'Explain', 4, 'Explain the role of dopamine in nicotine addiction.', [
    'Nicotine attaches to nicotinic acetylcholine receptors in the ventral tegmental area (1)',
    'This triggers the release of dopamine in the nucleus accumbens (mesolimbic pathway) (1)',
    'This produces a feeling of pleasure (a “dopamine hit”), which wears off after about 40 minutes (1)',
    'Desensitisation of receptors leads to tolerance and withdrawal when nicotine is absent (1)'
  ]);
  K('Q', Q3, 'Explain', 3, 'Explain cue reactivity in nicotine addiction.', [
    'Neutral stimuli associated with smoking (eg lighter, coffee, friends) become conditioned stimuli through classical conditioning (1)',
    'These secondary reinforcers trigger cravings/arousal similar to nicotine itself (1)',
    'This makes relapse likely when the person encounters these cues (Carter & Tiffany, 1999) (1)'
  ]);
  K('Q', Q4, 'Explain', 4, 'Explain learning theory as applied to gambling addiction.', [
    'Gambling is reinforced through positive reinforcement – winnings and the “buzz” (1)',
    'Partial reinforcement – only some bets are rewarded (1)',
    'Variable-ratio schedule – the number of bets needed for a win is unpredictable, making behaviour highly resistant to extinction (1)',
    'Near misses are also rewarding; Griffiths (1991) (1)'
  ]);
  K('Q', Q4, 'Outline', 3, 'Outline cognitive bias in gambling addiction.', [
    'Gamblers hold irrational beliefs about their chances of winning (1)',
    'Illusion of control – believing they can influence outcomes, eg by skill or rituals (1)',
    'Gambler’s fallacy – believing a win is “due” after a run of losses; Griffiths (1994) “thinking aloud” study (1)'
  ]);
  K('Q', Q5, 'Distinguish', 4, 'Distinguish between aversion therapy and covert sensitisation.', [
    'Aversion therapy: the addictive substance/behaviour is paired with an unpleasant stimulus (eg Antabuse with alcohol) (1)',
    'The addiction becomes associated with the unpleasant response through classical conditioning (1)',
    'Covert sensitisation: the unpleasant stimulus is imagined, not real (1)',
    'eg imagining vomiting while drinking; less ethical concern (1)'
  ]);
  K('Q', Q6, 'Outline', 4, 'Outline Prochaska’s six-stage model of behaviour change.', [
    'Precontemplation – no intention to change in the next 6 months (1)',
    'Contemplation – considering change within 6 months; Preparation – planning to change in the next month (1)',
    'Action – changed behaviour within the last 6 months (1)',
    'Maintenance – more than 6 months; Termination – no temptation (1)'
  ]);
  KL('Q', Q4, 'Discuss', 16, 'Discuss explanations for gambling addiction.', [
    'AO1: Learning theory – partial and variable reinforcement, near misses, cue reactivity; cognitive theory – illusion of control, gambler’s fallacy, cognitive biases.',
    'AO3: Learning theory support – Dickerson (1979): slot machine players.',
    'AO3: Cannot explain why only some gamblers become addicted – individual differences; diathesis-stress.',
    'AO3: Cognitive support – Griffiths (1994): regular gamblers made more irrational verbalisations (14% vs 2.5%).',
    'AO3: Cognitive explanations explain different types of gambling; but may be effects not causes.',
    'AO3: Applications – CBT and treatments based on challenging biases (Echeburua et al., 2011).'
  ], 'AO1 = 6, AO3 = 10');
  KL('Q', Q5, 'Evaluate', 8, 'Evaluate drug therapy for reducing addiction.', [
    'AO1 (brief): agonists (nicotine replacement), antagonists (naltrexone), varenicline.',
    'AO3: Effectiveness – Stead et al. (2012) review: NRT increased quitting by 50–70%.',
    'AO3: Side effects; may substitute one dependence for another.',
    'AO3: Cost-effective vs therapies; but does not address psychological factors.',
    'AO3: Placebo effects; combined treatment best.'
  ], 'AO1 = 3, AO3 = 5');
  M('Q', Q1, 'Needing more of a drug to get the same effect is…', 'Tolerance', ['Withdrawal', 'Psychological dependence', 'Cue reactivity'], 'Increasingly larger doses needed.');
  M('Q', Q3, 'Which neurotransmitter is central to the brain neurochemistry explanation of nicotine addiction?', 'Dopamine', ['GABA', 'Serotonin', 'Acetylcholine only'], 'Released in the nucleus accumbens.');
  M('Q', Q4, 'A slot machine pays out after an unpredictable number of plays. This is a…', 'Variable-ratio schedule', ['Fixed-ratio schedule', 'Continuous schedule', 'Fixed-interval schedule'], 'Most resistant to extinction.');
  M('Q', Q6, 'In Prochaska’s model, someone planning to quit next week is in which stage?', 'Preparation', ['Contemplation', 'Action', 'Precontemplation'], 'Intention to act within 30 days.');
  TF('Q', Q2, 'Social influences such as peer pressure are a risk factor in addiction.', true, 'Social norms and peers.');
  TF('Q', Q5, 'Covert sensitisation uses a real aversive stimulus.', false, 'The aversive stimulus is imagined.');
  F('Q', 'Physical dependence', 'Body adapts to a substance; withdrawal symptoms if stopped.', Q1);
  F('Q', 'Psychological dependence', 'Compulsion for the pleasurable effects; cravings.', Q1);
  F('Q', 'Withdrawal syndrome', 'Physical/psychological symptoms when use stops.', Q1);
  F('Q', 'Risk factors', 'Genetic vulnerability, stress, personality, family influences, peers.', Q2);
  F('Q', 'Cue reactivity', 'Smoking-related cues become conditioned stimuli triggering cravings.', Q3);
  F('Q', 'Variable reinforcement', 'Rewards are unpredictable; behaviour is resistant to extinction.', Q4);
  F('Q', 'Gambler’s fallacy', 'Belief that a win is “due” after losses.', Q4);
  F('Q', 'Aversion therapy', 'Pairing addiction with an unpleasant stimulus (Antabuse).', Q5);
  F('Q', 'Prochaska’s model', 'Precontemplation → contemplation → preparation → action → maintenance → termination.', Q6);
