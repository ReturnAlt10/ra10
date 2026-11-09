/* bank — hand-written RA10 content. Generated from training-data/a-level/alevel-build/content/psychology/bank/ (edit the parts there, then run build_alevel.py). */

/* ---- 00_head.js ---- */
/* AQA A-level Psychology (7182) — knowledge bank, quiz and flashcards, written for the updated specification
   (teaching from September 2025, first A-level exams June 2027). One part per specification topic area (A–Q).
   K  = points-marked question (AQA "1 mark per point / per developed point" style)
   KL = levels-marked question (AQA generic levels for 4/6/8/12/16 marks; indicative content split AO1/AO2/AO3)
   M / TF = quiz, F = flashcard. */
(function () {
  'use strict';
  const B = BizBank('PSY', '7182');
  window.__BIZ_B = B;
  const { K, M, TF, F } = B;
  const AO_NOTE = {
    4: 'Levels of response: 2 levels (3–4, 1–2).',
    6: 'Levels of response: 3 levels (5–6, 3–4, 1–2).',
    8: 'Levels of response: 4 levels (7–8, 5–6, 3–4, 1–2).',
    12: 'Levels of response: 4 levels (10–12, 7–9, 4–6, 1–3).',
    16: 'Levels of response: 4 levels (13–16, 9–12, 5–8, 1–4).'
  };
  // ao: e.g. 'AO1 = 6, AO3 = 10'
  const KL = (aim, topic, verb, marks, question, indicative, ao) => B.KL(aim, topic, verb, marks, question, indicative, {
    ao: ao || '',
    mark_scheme: {
      instruction: 'AQA levels-based mark scheme' + (ao ? ' (' + ao + ')' : '') + '. ' + (AO_NOTE[marks] || '') + ' Decide the level first from the quality of knowledge (AO1), application (AO2) and evaluation (AO3), then the mark within it. Credit other relevant material.',
      indicative_content: indicative,
      level_descriptors: window.BIZ_LEVELS[marks] || window.BIZ_LEVELS[16]
    }
  });

/* ---- 01_A_social_influence.js ---- */
  /* ===== A · 1.1 Social influence (Paper 1 Section A) ===== */
  const A1 = '1.1.1 Conformity', A2 = '1.1.2 Obedience', A3 = '1.1.3 Resistance', A4 = '1.1.4 Minority influence';

  K('A', A1, 'Distinguish', 2, 'Distinguish between internalisation and compliance.', [
    'Internalisation is a deep, permanent change in both public behaviour and private beliefs/attitudes – the person genuinely accepts the group view (1)',
    'Compliance is a superficial, temporary change in public behaviour only – private beliefs stay the same and the behaviour stops when group pressure is removed (1)',
    'Answers must make the difference explicit (eg private vs public acceptance) for both marks.'
  ]);
  K('A', A1, 'Explain', 4, 'Explain the difference between informational social influence (ISI) and normative social influence (NSI).', [
    'ISI is conformity based on a desire to be right – we look to others for information about how to behave (1)',
    'ISI is a cognitive process, most likely in ambiguous/new situations or where others are seen as experts, and usually leads to internalisation (1)',
    'NSI is conformity based on a desire to be liked/accepted and to avoid rejection or ridicule (1)',
    'NSI is an emotional process, most likely with strangers/people we want approval from, and usually leads to compliance (1)'
  ]);
  K('A', A1, 'Outline', 4, 'Outline the procedure of Asch’s (1951) study of conformity.', [
    '123 American male undergraduates were each tested with a group of 6–8 confederates (1)',
    'Each trial showed a standard line and three comparison lines; participants said aloud which comparison line matched the standard (1)',
    'The naïve participant answered last or second-to-last; on 12 of 18 critical trials the confederates all gave the same wrong answer (1)',
    'The task was unambiguous – a control group working alone made errors on fewer than 1% of trials (1)'
  ]);
  K('A', A1, 'Outline', 3, 'Outline how group size, unanimity and task difficulty affected conformity in Asch’s variations.', [
    'Group size: conformity rose with majority size up to about 3 confederates (31.8%), with little further increase after that (1)',
    'Unanimity: when one confederate gave the correct (or a different) answer, conformity fell sharply (to 5.5% with a dissenter who gave the right answer) – breaking unanimity matters more than the dissenter being right (1)',
    'Task difficulty: making the lines more similar increased conformity – the situation became more ambiguous so ISI increased (1)'
  ]);
  K('A', A2, 'Explain', 4, 'Explain the agentic state explanation of obedience.', [
    'In the agentic state a person sees themselves as an agent carrying out another person’s wishes and does not feel responsible for their actions (1)',
    'The opposite is the autonomous state, where a person acts on their own conscience and feels responsible (1)',
    'The shift from autonomous to agentic is the agentic shift, which happens when we see someone as a legitimate authority figure (1)',
    'Binding factors (eg shifting responsibility to the experimenter, not wanting to seem rude) keep the person in the agentic state even when they feel moral strain (1)'
  ]);
  K('A', A2, 'Outline', 4, 'Outline the findings of Milgram’s (1963) baseline study and one situational variable that affected obedience.', [
    '65% of the 40 men continued to the maximum 450 V; all went to at least 300 V (1)',
    'Many showed signs of extreme tension (sweating, trembling, nervous laughter; three had seizures) (1)',
    'Proximity: when teacher and learner were in the same room obedience fell to 40%; in the touch-proximity condition it fell to 30% (1)',
    'Location: in a run-down office block obedience fell to 47.5%; with instructions given by phone it fell to 20.5% (1) – max 2 for findings of the variable.'
  ]);
  K('A', A2, 'Outline', 3, 'Outline the Authoritarian Personality as a dispositional explanation of obedience.', [
    'Adorno et al. (1950) proposed that some people have a personality type that makes them especially obedient to authority, measured by the F-scale (1)',
    'It develops from a harsh, strict, conditional-love upbringing; hostility felt towards parents cannot be expressed so it is displaced onto weaker others (scapegoats) (1)',
    'Authoritarians show extreme respect for authority, submissiveness, contempt for inferiors and rigid black-and-white, conventional thinking (1)'
  ]);
  K('A', A3, 'Explain', 4, 'Explain how social support and locus of control can each help people resist social influence.', [
    'Social support: the presence of others who resist breaks the unanimity of the majority/provides a model of independent behaviour, so the person feels free to follow their own conscience (1)',
    'eg in Asch a dissenting confederate cut conformity; in Milgram obedience fell to 10% with two disobedient peers (1)',
    'Locus of control (Rotter, 1966): people with an internal LOC believe they control what happens to them, so they rely less on others’ opinions and take responsibility (1)',
    'Internals are more likely to resist pressure; externals believe events are due to luck/fate/others and are more likely to obey/conform (1)'
  ]);
  K('A', A4, 'Explain', 6, 'Explain how a minority can influence a majority. Refer to consistency, commitment and flexibility in your answer.', [
    'Consistency – synchronic (members agree with each other) and diachronic (the view stays the same over time) make the majority rethink (1+1)',
    'Commitment – sacrifices/extreme activities show the minority is serious, creating the augmentation principle (1+1)',
    'Flexibility – being too rigid seems dogmatic, so the minority must be prepared to adapt and accept reasonable compromise (Nemeth, 1986) (1+1)',
    'Over time the snowball effect turns minority views into majority views and leads to internalisation; Moscovici (1969): consistent minority 8.42% “green” vs inconsistent 1.25%.'
  ]);
  KL('A', A1, 'Discuss', 16, 'Discuss research into conformity. Refer to Asch’s variations in your answer.', [
    'AO1: Asch (1951) line study – 123 male students, 12 of 18 critical trials, 36.8% conformity on critical trials, 25% never conformed, 75% at least once.',
    'AO1: Variations – group size (3 confederates ≈ 31.8%, little rise beyond), unanimity (a dissenter cut conformity to about 5.5%), task difficulty (harder task → more conformity, ISI).',
    'AO3: Artificial task and situation – trivial lines, groups of strangers – low ecological validity; Fiske: “Asch’s groups were not very groupy”.',
    'AO3: A “child of its time” – Perrin & Spencer (1980) found one conformity response in 396 trials with engineering students in 1980s UK.',
    'AO3: Unrepresentative sample – American men; women may conform more (Neto, 1995); collectivist cultures conform more (Bond & Smith, 1996, meta-analysis).',
    'AO3: Ethical issues – deception, stress; but debrief given.',
    'AO3: Supporting evidence for task difficulty – Lucas et al. (2006) maths problems: more conformity on harder problems, moderated by self-efficacy.',
    'AO3: Conformity is now seen as an interaction of situation and individual (eg confidence, need for affiliation).'
  ], 'AO1 = 6, AO3 = 10');
  KL('A', A2, 'Discuss', 16, 'Discuss situational explanations of obedience.', [
    'AO1: Agentic state, agentic shift, binding factors; legitimacy of authority – hierarchy, power given by society, destructive authority.',
    'AO1: Situational variables in Milgram – proximity (40%/30%/20.5%), location (47.5% in run-down office), uniform (lab coat; ordinary-clothes experimenter 20%; Bickman, 1974 – guard’s uniform obeyed more).',
    'AO3: Support for legitimacy – Hofling et al. (1966): 21 of 22 nurses obeyed an unknown doctor’s phone order to give an overdose.',
    'AO3: Agentic state limitations – Rank & Jacobson (1977) nurses disobeyed a doctor’s overdose order (16 of 18); does not explain the 35% who disobeyed in Milgram.',
    'AO3: Mandel (1998) – Police Battalion 101 shot civilians without being ordered: explanations do not fit all real cases.',
    'AO3: Orne & Holland (1968) – participants may have seen through the deception (internal validity); but Sheridan & King (1972) – real shocks to a puppy, 54% of men and 100% of women gave the maximum.',
    'AO3: Cultural explanation – legitimacy explains cross-cultural differences (Kilham & Mann, 1974: 16% Australian women; Mantell, 1971: 85% German men).',
    'AO3: Situationism may excuse atrocities – the “obedience alibi”; dispositional factors (Authoritarian Personality) also matter.'
  ], 'AO1 = 6, AO3 = 10');
  KL('A', A4, 'Evaluate', 8, 'Evaluate research into minority influence.', [
    'AO1 (brief): Moscovici (1969) – blue slides, consistent minority 8.42% green vs inconsistent 1.25%; consistency, commitment, flexibility.',
    'AO3: Supporting evidence – Wood et al. (1994) meta-analysis of ~100 studies: minorities seen as most consistent were most influential.',
    'AO3: Martin et al. (2003) – minority views produce deeper processing and more resistant attitude change.',
    'AO3: Artificial tasks (identifying slide colours) – real minorities (eg suffragettes) face life-and-death issues: low external validity.',
    'AO3: Real-world minority/majority differences – real majorities have power and status; laboratory groups are often just numbers.',
    'AO3: Explains social change – eg suffragettes, gradual snowball and social cryptomnesia.'
  ], 'AO1 = 3, AO3 = 5');

  M('A', A1, 'Which type of conformity involves a change in private beliefs as well as public behaviour?', 'Internalisation', ['Compliance', 'Normative social influence', 'Identification with a minority'], 'Internalisation is a deep, permanent change: private and public views both change.');
  M('A', A1, 'In Asch’s baseline study, what was the overall conformity rate on critical trials?', '36.8%', ['65%', '25%', '74%'], '36.8% of responses on critical trials were conforming; 75% of participants conformed at least once.');
  M('A', A1, 'Asch found conformity stopped rising much once the majority reached about…', '3 confederates', ['1 confederate', '6 confederates', '15 confederates'], 'With 3 confederates conformity was 31.8%; larger groups added little.');
  M('A', A1, 'Making the comparison lines more similar to the standard line in Asch’s study mainly increased…', 'Informational social influence', ['Normative social influence only', 'Compliance only', 'Minority influence'], 'A harder task is more ambiguous, so people look to others for information.');
  M('A', A2, 'In Milgram’s baseline study, what percentage of participants went to 450 V?', '65%', ['100%', '40%', '12.5%'], '26 of 40 men (65%) obeyed fully; all 40 reached 300 V.');
  M('A', A2, 'Which variation produced the lowest obedience in Milgram’s research?', 'Instructions given by telephone (20.5%)', ['Run-down office block (47.5%)', 'Teacher and learner in the same room (40%)', 'Touch proximity (30%)'], 'Absent experimenter: 20.5% obeyed fully.');
  M('A', A2, 'Which measure was used by Adorno et al. to identify the Authoritarian Personality?', 'The F-scale', ['The SRRS', 'The Bem Sex Role Inventory', 'The Rotter scale'], 'F stands for “potential for fascism”.');
  M('A', A3, 'A person who believes their success depends on luck has…', 'An external locus of control', ['An internal locus of control', 'An authoritarian personality', 'High social support'], 'Externals attribute outcomes to luck, fate or other people.');
  M('A', A4, 'In Moscovici’s (1969) study, how often did participants say “green” when the minority was consistent?', '8.42% of trials', ['1.25% of trials', '32% of trials', '65% of trials'], 'Consistent minority 8.42% vs inconsistent 1.25%.');
  M('A', A4, 'A minority appearing willing to compromise demonstrates…', 'Flexibility', ['Diachronic consistency', 'Synchronic consistency', 'Augmentation'], 'Nemeth (1986): rigid minorities seem dogmatic.');
  TF('A', A1, 'Normative social influence is most likely in an ambiguous situation where people want to be right.', false, 'That describes ISI. NSI is about wanting to be liked or accepted.');
  TF('A', A2, 'Milgram found obedience fell when the experimenter wore ordinary clothes instead of a lab coat.', true, 'Obedience fell to 20% when the experimenter was replaced by an “ordinary member of the public”.');
  TF('A', A3, 'In Milgram’s variation with two disobedient peers, obedience fell to 10%.', true, 'Social support from disobedient models freed participants to follow their conscience.');
  TF('A', A4, 'The snowball effect describes how a minority view gradually becomes a majority view.', true, 'Over time more people switch, until the minority becomes the majority.');

  F('A', 'Internalisation', 'Deep, permanent conformity: public behaviour and private beliefs change because the person genuinely accepts the group’s view.', A1);
  F('A', 'Compliance', 'Superficial, temporary conformity: go along with the group in public but disagree in private. Stops when pressure is removed.', A1);
  F('A', 'Informational social influence', 'Conforming because you want to be right – a cognitive process; common in ambiguous or crisis situations or when others are experts.', A1);
  F('A', 'Normative social influence', 'Conforming because you want to be liked/accepted and fear rejection – an emotional process; usually leads to compliance.', A1);
  F('A', 'Asch (1951)', '123 US male students, line task, 12/18 critical trials: 36.8% conformity; 25% never conformed; 75% at least once.', A1);
  F('A', 'Agentic state', 'Seeing yourself as an agent of another person and not responsible for your actions (opposite: autonomous state). Shift = agentic shift.', A2);
  F('A', 'Binding factors', 'Aspects of the situation that keep a person in the agentic state, eg shifting responsibility to the victim, denying the damage, politeness.', A2);
  F('A', 'Legitimacy of authority', 'We obey people higher in a social hierarchy because society agrees they have the right to give orders (eg police, teachers).', A2);
  F('A', 'Milgram (1963)', '40 men, “learning” study, fake shocks to 450 V: 65% went to 450 V, 100% to 300 V.', A2);
  F('A', 'Authoritarian Personality', 'Adorno et al. (1950): F-scale; strict, conditional-love upbringing; respect for authority, contempt for “inferiors”, rigid thinking.', A2);
  F('A', 'Locus of control', 'Rotter (1966): internals feel they control events and resist social influence more; externals put events down to luck or others.', A3);
  F('A', 'Minority influence', 'A small group changes the majority’s beliefs through consistency, commitment and flexibility – usually leads to internalisation.', A4);
  F('A', 'Augmentation principle', 'If a minority is willing to suffer for its view (commitment), people take it more seriously.', A4);

/* ---- 02_B_memory.js ---- */
  /* ===== B · 1.2 Memory (Paper 1 Section B) ===== */
  const B1 = '1.2.1 Multi-store model', B2 = '1.2.2 Working memory model', B3 = '1.2.3 Forgetting', B4 = '1.2.4 Eyewitness testimony';

  K('B', B1, 'Outline', 6, 'Outline the multi-store model of memory. Refer to coding, capacity and duration in your answer.', [
    'Sensory register: coding modality-specific (eg iconic, echoic); very large capacity; duration under half a second (1)',
    'Attention moves information from the SR to STM (1)',
    'STM: mainly acoustic coding; capacity 7 ± 2 items (Miller, 1956); duration about 18–30 seconds without rehearsal (1)',
    'Maintenance rehearsal keeps information in STM and, if repeated enough, transfers it to LTM (1)',
    'LTM: mainly semantic coding; potentially unlimited capacity; duration up to a lifetime (1)',
    'Retrieval brings information back from LTM to STM when needed; the stores are unitary and information flows in one direction (1)'
  ]);
  K('B', B1, 'Describe', 4, 'Describe one study that investigated the duration of short-term memory.', [
    'Peterson and Peterson (1959): 24 students were shown consonant syllables (eg YCG) (1)',
    'They then counted backwards in threes from a given number to prevent rehearsal (1)',
    'Recall was tested after intervals of 3, 6, 9, 12, 15 or 18 seconds (1)',
    'About 90% were correct after 3 s but only about 10% after 18 s – STM duration is about 18–30 s without rehearsal (1)'
  ]);
  K('B', B2, 'Outline', 4, 'Outline the role of the central executive and the episodic buffer in the working memory model.', [
    'Central executive: supervises/directs attention, allocates slave systems to tasks; has very limited capacity and no storage of its own (1+1)',
    'Episodic buffer (added in 2000): a temporary store that integrates information from the other components and links WM to LTM (1)',
    'It holds about four chunks and maintains a sense of time sequencing (1)'
  ]);
  K('B', B2, 'Explain', 3, 'Explain how dual-task performance supports the working memory model.', [
    'Two tasks using the same slave system (eg two visual tasks) are done less well together because they compete for limited capacity (1)',
    'Two tasks using different systems (eg one visual, one verbal) can be done as well together as separately (1)',
    'Baddeley et al. (1975): participants found tracking a light and describing the letter F harder than tracking plus a verbal task – evidence for separate VSS and PL (1)'
  ]);
  K('B', B3, 'Distinguish', 2, 'Distinguish between proactive and retroactive interference.', [
    'Proactive interference: old (previously learned) information disrupts the recall of new information (1)',
    'Retroactive interference: new information disrupts the recall of old information (1)'
  ]);
  K('B', B3, 'Explain', 4, 'Explain retrieval failure as an explanation for forgetting. Refer to context-dependent and state-dependent forgetting.', [
    'Retrieval failure is forgetting because the cues present at encoding are absent at recall – the information is available but not accessible (1)',
    'Encoding specificity principle (Tulving, 1983): a cue helps recall if it was present at encoding (1)',
    'Context-dependent forgetting: external cues (environment) differ – Godden & Baddeley (1975) divers recalled 40% less when learning and recall environments differed (1)',
    'State-dependent forgetting: internal cues (mood, physiological state) differ – Carter & Cassaday (1998) antihistamine study (1)'
  ]);
  K('B', B4, 'Outline', 4, 'Outline how leading questions can affect the accuracy of eyewitness testimony. Refer to research evidence.', [
    'A leading question suggests a particular answer because of how it is phrased (1)',
    'Loftus & Palmer (1974): 45 students watched car crash clips; the verb in “About how fast were the cars going when they ___ each other?” varied (1)',
    '“Smashed” gave a mean estimate of 40.5 mph; “contacted” gave 31.8 mph (1)',
    'Explanations: response bias (wording influences the answer) or substitution – the wording changes the stored memory (1)'
  ]);
  K('B', B4, 'Describe', 4, 'Describe the cognitive interview.', [
    'Report everything – include every detail, even if it seems trivial, as it may trigger other memories (1)',
    'Reinstate the context – mentally return to the scene, including the environment and emotions (1)',
    'Reverse the order – recall events in a different order (eg from the end) to prevent schema-driven reconstruction (1)',
    'Change perspective – recall from the point of view of other people present, to disrupt expectations/schema (1)'
  ]);
  KL('B', B1, 'Evaluate', 8, 'Evaluate the multi-store model of memory.', [
    'AO1 (brief): three unitary stores, linear flow, rehearsal transfers STM → LTM.',
    'AO3: Supporting evidence – Baddeley (1966): STM acoustic, LTM semantic, so stores are separate; HM and the hippocampus.',
    'AO3: Evidence for more than one STM store – KF (Shallice & Warrington, 1970): poor STM for digits read aloud but better when read himself → STM is not unitary.',
    'AO3: More than one type of LTM – episodic, semantic, procedural (Clive Wearing).',
    'AO3: Prolonged rehearsal is not needed – Craik & Watkins (1973): elaborative rehearsal (meaning) transfers to LTM.',
    'AO3: Artificial materials (consonant syllables, digits) lack mundane realism; but controlled research gives high internal validity.'
  ], 'AO1 = 2, AO3 = 6');
  KL('B', B4, 'Discuss', 16, 'Discuss research into the effects of anxiety on the accuracy of eyewitness testimony.', [
    'AO1: Anxiety can reduce accuracy – tunnel theory/weapon focus. Johnson & Scott (1976): 49% identified the man with a pen vs 33% with a bloody paper knife.',
    'AO1: Anxiety can increase accuracy – fight-or-flight heightens alertness. Yuille & Cutshall (1986): 13 real witnesses to a shooting were very accurate 4–5 months later; those most stressed (5/7) were 88% accurate vs 75%.',
    'AO1: Yerkes-Dodson / inverted-U – moderate anxiety improves recall, very high or very low anxiety reduces it (Deffenbacher et al., 2004).',
    'AO3: Weapon focus may be due to surprise not anxiety – Pickel (1998): unusual items (raw chicken) also reduced accuracy.',
    'AO3: Field studies lack control over extraneous variables – post-event discussion, media reports, distance from event.',
    'AO3: Ethical issues limit lab research – cannot create real anxiety; lab studies may test surprise instead.',
    'AO3: Inverted-U is hard to test/falsify – anxiety has cognitive, behavioural, somatic parts.',
    'AO3: Applications – police should not dismiss anxious witnesses; real-world implications for juries.'
  ], 'AO1 = 6, AO3 = 10');
  KL('B', B4, 'Evaluate', 8, 'Evaluate the use of the cognitive interview.', [
    'AO1: four techniques – report everything, reinstate context, reverse order, change perspective; enhanced CI adds rapport and reduced anxiety.',
    'AO3: Köhnken et al. (1999) meta-analysis – 41% more correct information, but also more incorrect information (false positives).',
    'AO3: Some elements are more useful than others – Milne & Bull (2002): report everything + reinstate context produced better recall than other combinations.',
    'AO3: Time-consuming and needs trained officers; police often use only parts of it (Kebbell & Wagstaff, 1996).',
    'AO3: Practical value for justice – more accurate testimony reduces wrongful convictions.'
  ], 'AO1 = 3, AO3 = 5');

  M('B', B1, 'According to the multi-store model, how is information mainly coded in STM?', 'Acoustically', ['Semantically', 'Visually only', 'Modality-specific'], 'Baddeley (1966): STM confuses acoustically similar words.');
  M('B', B1, 'What did Jacobs (1887) find about the capacity of STM?', 'Mean span 9.3 digits and 7.3 letters', ['Mean span 4 chunks', 'Mean span of 18 seconds', 'Unlimited capacity'], 'Digit span task; capacity rose with age.');
  M('B', B1, 'In Bahrick et al.’s (1975) study, what did participants recall after up to 48 years?', 'Names and faces of school classmates', ['Consonant syllables', 'Word lists in water', 'Car crash speeds'], 'Photo recognition about 90% after 15 years and 70% after 48 years.');
  M('B', B2, 'Which component of working memory is often called the “inner eye”?', 'Visuo-spatial sketchpad', ['Phonological loop', 'Central executive', 'Episodic buffer'], 'The VSS holds visual and spatial information.');
  M('B', B2, 'The phonological loop has two parts: the articulatory process and the…', 'Phonological store', ['Inner scribe', 'Visual cache', 'Episodic buffer'], 'Store = inner ear; articulatory process = inner voice.');
  M('B', B2, 'Patient KF had poor STM for…', 'Verbal information heard aloud', ['Visual information', 'Procedural skills', 'Faces of relatives'], 'Supports separate verbal and visual STM systems (Shallice & Warrington, 1970).');
  M('B', B3, 'Baddeley & Hitch (1977) found rugby players forgot more team names when…', 'More games had been played in between', ['More time had passed', 'They were tested underwater', 'They were given cues'], 'Number of intervening games, not time, predicted forgetting: retroactive interference.');
  M('B', B3, 'Godden & Baddeley’s (1975) divers recalled best when…', 'Learning and recall took place in the same environment', ['They learned on land and recalled underwater', 'They counted backwards first', 'They were given a list of synonyms'], 'Context-dependent forgetting.');
  M('B', B4, 'In Loftus & Palmer’s first experiment, which verb produced the highest speed estimates?', 'Smashed', ['Collided', 'Bumped', 'Contacted'], 'Smashed 40.5 mph; contacted 31.8 mph.');
  M('B', B4, 'Gabbert et al. (2003) found that after discussing a video with a co-witness, how many participants reported information they had not seen?', '71%', ['0%', '33%', '90%'], 'Memory conformity: post-event discussion.');
  TF('B', B1, 'According to the MSM, the sensory register has a very small capacity.', false, 'Capacity is very high; duration is very short.');
  TF('B', B2, 'The working memory model is a model of long-term memory.', false, 'It is a model of short-term (working) memory only.');
  TF('B', B3, 'Interference explanations are most convincing when the two sets of information are similar.', true, 'McGeoch & McDonald (1931): synonyms caused the most interference.');
  TF('B', B4, 'The cognitive interview increases the amount of correct information recalled, but it can also increase incorrect information.', true, 'Köhnken et al. (1999).');

  F('B', 'Sensory register', 'Modality-specific stores (iconic, echoic). Huge capacity, duration under ½ second. Attention moves info into STM.', B1);
  F('B', 'STM (MSM)', 'Acoustic coding, 7 ± 2 items (Miller), 18–30 s without rehearsal (Peterson & Peterson).', B1);
  F('B', 'LTM (MSM)', 'Semantic coding, potentially unlimited capacity, up to a lifetime (Bahrick et al.: 90% face recognition after 15 years).', B1);
  F('B', 'Maintenance rehearsal', 'Repeating material to keep it in STM; with enough repetition it transfers to LTM.', B1);
  F('B', 'Central executive', 'WMM “boss”: directs attention, allocates slave systems, very limited capacity, no storage.', B2);
  F('B', 'Phonological loop', 'Holds auditory information: phonological store (inner ear) + articulatory process (inner voice); ~2 s of speech.', B2);
  F('B', 'Visuo-spatial sketchpad', 'Holds visual & spatial info (Logie: visual cache + inner scribe); ~3–4 objects.', B2);
  F('B', 'Episodic buffer', 'Added 2000: temporary store that integrates info from all components and links WM with LTM; ~4 chunks.', B2);
  F('B', 'Proactive interference', 'Old learning disrupts the recall of new learning.', B3);
  F('B', 'Retroactive interference', 'New learning disrupts the recall of old learning.', B3);
  F('B', 'Retrieval failure', 'Forgetting because cues present at encoding are absent at retrieval (encoding specificity). Context- or state-dependent.', B3);
  F('B', 'Post-event discussion', 'Co-witnesses discuss an event and memories become contaminated – memory conformity (Gabbert et al., 2003: 71%).', B4);
  F('B', 'Weapon focus', 'Anxiety narrows attention onto a weapon, reducing recall of other details (Johnson & Scott, 1976: 49% vs 33%).', B4);
  F('B', 'Cognitive interview', 'Fisher & Geiselman (1992): report everything, reinstate context, reverse order, change perspective.', B4);

/* ---- 03_C_attachment.js ---- */
  /* ===== C · 1.3 Attachment (Paper 1 Section C) ===== */
  const C1 = '1.3.1 Animal studies', C2 = '1.3.2 Explanations of attachment', C3 = '1.3.3 Strange Situation & culture', C4 = '1.3.4 Deprivation & institutionalisation', C5 = '1.3.5 Later relationships';

  K('C', C1, 'Outline', 4, 'Outline Lorenz’s research into imprinting.', [
    'Lorenz (1935) split a clutch of goose eggs: half hatched with the mother, half in an incubator where Lorenz was the first moving object they saw (1)',
    'Incubator goslings followed Lorenz everywhere; the control group followed the mother – even when the groups were mixed (1)',
    'Imprinting only happened within a critical period of a few hours after hatching; if missed, chicks did not attach (1)',
    'Sexual imprinting – birds imprinted on humans later tried to mate with humans (1)'
  ]);
  K('C', C1, 'Outline', 4, 'Outline Harlow’s (1958) research into attachment.', [
    '16 baby rhesus monkeys were reared with two wire “mothers”: one plain wire with a milk bottle, one covered in soft cloth (1)',
    'Monkeys spent most time with the cloth mother and went to it when frightened (eg by a noise-making toy), whatever mother gave milk (1)',
    'Contact comfort is more important for attachment than food (1)',
    'Motherless monkeys grew up socially abnormal – aggressive, unsociable, poor mothers – unless they had a real attachment before about 90 days (critical period) (1)'
  ]);
  K('C', C2, 'Explain', 4, 'Explain learning theory as an explanation of attachment.', [
    'Classical conditioning: food (UCS) produces pleasure (UCR); the caregiver (NS) is repeatedly paired with food, so becomes a CS producing pleasure (CR) (1+1)',
    'Operant conditioning: a hungry baby feels discomfort (drive); being fed reduces the drive – negative reinforcement for the baby and the caregiver (crying stops) (1)',
    'The caregiver becomes a secondary reinforcer through association with food (primary reinforcer) – the “cupboard love” theory (Dollard & Miller, 1950) (1)'
  ]);
  K('C', C2, 'Outline', 6, 'Outline Bowlby’s monotropic theory of attachment. Refer to the critical period and internal working model.', [
    'Attachment is innate and adaptive – it keeps the infant close to the caregiver and safe (1)',
    'Monotropy: one special attachment (usually to the mother) is more important than others; law of continuity and law of accumulated separation (1)',
    'Social releasers (smiling, crying, cooing) are innate behaviours that trigger caregiving (1)',
    'Critical period: attachment must form by about 2½ years (sensitive period up to 5 years) or later attachment is much harder (1)',
    'Internal working model: the primary attachment gives a mental template of what relationships are like (1)',
    'The IWM affects later relationships and the person’s own parenting (continuity hypothesis) (1)'
  ]);
  K('C', C3, 'Outline', 4, 'Outline the procedure of Ainsworth’s Strange Situation.', [
    'A controlled observation in a lab playroom with a two-way mirror; infants aged 12–18 months (1)',
    'Eight episodes of about 3 minutes each; caregiver and a stranger enter and leave in a set order (1)',
    'Observers record behaviours every 15 seconds: proximity seeking, exploration/secure base, stranger anxiety, separation anxiety, reunion behaviour (1)',
    'Infants classified as secure (Type B), insecure-avoidant (Type A) or insecure-resistant (Type C) (1)'
  ]);
  K('C', C3, 'Describe', 3, 'Describe insecure-resistant attachment.', [
    'Seeks greater proximity than other infants and explores less (1)',
    'Shows huge stranger anxiety and huge distress when the caregiver leaves (1)',
    'Resists comfort on reunion – eg seeks contact then pushes the caregiver away; about 12% of infants (1)'
  ]);
  K('C', C3, 'Outline', 4, 'Outline the findings of van Ijzendoorn and Kroonenberg’s (1988) research into cultural variations in attachment.', [
    'Meta-analysis of 32 Strange Situation studies, 8 countries, nearly 2000 infants (1)',
    'Secure attachment was the most common type in every country; Great Britain about 75%, China 50% (1)',
    'Insecure-avoidant was highest in individualist cultures such as Germany; insecure-resistant highest in collectivist cultures such as Israel and Japan (1)',
    'Variation within cultures was 1.5 times greater than variation between cultures (1)'
  ]);
  K('C', C4, 'Outline', 4, 'Outline findings from the English and Romanian Adoptees (ERA) project.', [
    'Rutter et al. followed 165 Romanian orphans adopted into UK families, compared with 52 UK adoptees (1)',
    'Children adopted before 6 months had mean IQ 102; those adopted at 6 months–2 years IQ 86; after 2 years IQ 77 (1)',
    'Children adopted after 6 months often showed disinhibited attachment – attention-seeking, overfriendly with strangers (1)',
    'Children adopted before 6 months rarely showed disinhibited attachment – supports a sensitive period (1)'
  ]);
  K('C', C4, 'Distinguish', 2, 'Distinguish between deprivation and privation.', [
    'Deprivation is losing an attachment that had already formed, eg through prolonged separation from the caregiver (1)',
    'Privation is never forming an attachment in the first place (Rutter, 1981) (1)'
  ]);
  KL('C', C2, 'Discuss', 16, 'Discuss Bowlby’s monotropic theory of attachment.', [
    'AO1: Evolutionary, innate attachment; monotropy; social releasers; critical period (~2½ years); internal working model; continuity hypothesis.',
    'AO3: Support for social releasers – Brazelton et al. (1975): when mothers ignored babies’ releasers, babies became distressed and some curled up and lay motionless.',
    'AO3: Support for IWM – Bailey et al. (2007): poor attachment to own mothers predicted poor attachment between mothers and their babies.',
    'AO3: Challenge to monotropy – Schaffer & Emerson (1964): most infants formed multiple attachments; some first attached to the father.',
    'AO3: Socially sensitive – Burman (1994): the law of accumulated separation may make mothers feel blamed for working.',
    'AO3: Temperament hypothesis – Kagan (1984): innate personality may affect attachment and later relationships, not just the IWM.',
    'AO3: Critical period now seen as a sensitive period – Rutter’s ERA shows some recovery is possible.'
  ], 'AO1 = 6, AO3 = 10');
  KL('C', C3, 'Discuss', 16, 'Discuss research into cultural variations in attachment.', [
    'AO1: van Ijzendoorn & Kroonenberg (1988) findings; Takahashi (1990) Japanese infants – no avoidant, high resistant (32%); Grossmann & Grossmann (1991) German infants more avoidant.',
    'AO1: Explanations – universal innate drive (similarities) vs child-rearing practices (differences).',
    'AO3: Large combined sample increases internal validity – but countries were unevenly represented (eg only one study from China), so some “national” figures rest on small samples.',
    'AO3: Samples may not represent cultures – van Ijzendoorn & Sagi (2001): urban Tokyo distributions like the West; rural Japanese more resistant.',
    'AO3: Imposed etic – the Strange Situation was designed in the US; Japanese infants rarely separated, so the stress is greater; German “avoidant” behaviour may reflect valued independence.',
    'AO3: Non-equivalent comparison groups and methods (eg different ages, numbers) reduce validity of comparisons.'
  ], 'AO1 = 6, AO3 = 10');
  KL('C', C5, 'Discuss', 8, 'Discuss the influence of early attachment on adult relationships.', [
    'AO1: The IWM is a template; secure infants → trusting, lasting adult relationships; insecure → less trusting, jealous or avoidant (Hazan & Shaver, 1987 “love quiz”: 56% secure, 25% avoidant, 19% resistant).',
    'AO3: Evidence is mainly correlational – other factors (parenting style, temperament) could cause both.',
    'AO3: Retrospective self-report – adults recall childhood attachment, which may be inaccurate.',
    'AO3: Mixed evidence – Fearon & Roisman (2017): attachment type only weakly predicts later relationships (beyond infancy).',
    'AO3: Deterministic – a person with insecure attachment may still form good relationships (Zimmerman, 2000).'
  ], 'AO1 = 4, AO3 = 4');

  M('C', C1, 'In Harlow’s study, which mother did the monkeys cling to when frightened?', 'The cloth-covered mother', ['The wire mother with the milk bottle', 'The mother that fed them most', 'No mother – they hid alone'], 'Contact comfort matters more than food.');
  M('C', C1, 'Lorenz’s goslings imprinted on him because…', 'He was the first moving object they saw', ['He fed them daily', 'He smelled like their mother', 'They were older than the critical period'], 'Imprinting happens to the first moving object within the critical period.');
  M('C', C2, 'In learning theory, the caregiver becomes a…', 'Secondary reinforcer', ['Primary reinforcer', 'Unconditioned stimulus', 'Social releaser'], 'Through association with food (primary reinforcer).');
  M('C', C2, 'Which of these is Bowlby’s term for a mental template of relationships?', 'Internal working model', ['Schema of conservation', 'Secure base', 'Monotropy'], 'The IWM guides later relationships and parenting.');
  M('C', C3, 'How long is each episode in the Strange Situation?', 'About 3 minutes', ['About 30 seconds', 'About 15 minutes', 'About 1 hour'], 'Eight episodes of roughly 3 minutes.');
  M('C', C3, 'According to Ainsworth, approximately what percentage of US infants were insecure-avoidant?', '22%', ['66%', '12%', '45%'], 'Secure 66%, avoidant 22%, resistant 12%.');
  M('C', C3, 'van Ijzendoorn & Kroonenberg found the highest proportion of insecure-avoidant attachment in…', 'Germany', ['Japan', 'Israel', 'China'], 'Individualist cultures valuing independence.');
  M('C', C4, 'In the ERA project, what was the mean IQ of orphans adopted after age 2?', '77', ['102', '86', '110'], 'Before 6 months 102; 6 months–2 years 86; after 2 years 77.');
  M('C', C4, 'In Bowlby’s 44 thieves study, how many of the 14 affectionless psychopaths had experienced prolonged early separation?', '12', ['2', '5', '14'], '12 of 14 (86%) vs 5 of the other 30 thieves.');
  M('C', C5, 'Hazan and Shaver (1987) collected data through…', 'A “love quiz” in a newspaper', ['The Strange Situation', 'Interviews with orphans', 'An experiment with monkeys'], '620 replies were analysed.');
  TF('C', C1, 'Harlow found monkeys deprived of a mother developed normally if they were well fed.', false, 'They became socially and sexually abnormal.');
  TF('C', C3, 'Securely attached infants show moderate stranger anxiety and are easily comforted on reunion.', true, 'Type B: secure base for exploration, moderate distress, quick comfort.');
  TF('C', C4, 'Disinhibited attachment involves being equally friendly to familiar people and strangers.', true, 'Seen in ERA children adopted after 6 months.');
  TF('C', C2, 'Schaffer and Emerson (1964) supported monotropy because no infants formed multiple attachments.', false, 'Most infants had multiple attachments by 18 months.');

  F('C', 'Imprinting', 'Instinctive following of the first moving object seen within a critical period (Lorenz, 1935, geese).', C1);
  F('C', 'Contact comfort', 'Harlow (1958): infant monkeys preferred a soft cloth mother to a wire mother with milk.', C1);
  F('C', 'Cupboard love', 'Learning theory: infants attach to whoever feeds them (classical + operant conditioning; Dollard & Miller).', C2);
  F('C', 'Monotropy', 'Bowlby: one particular attachment is different and more important than the rest.', C2);
  F('C', 'Critical period (Bowlby)', 'About 2½ years; if no attachment forms then, later attachment is much harder (sensitive period).', C2);
  F('C', 'Internal working model', 'Mental template from the primary attachment that shapes later relationships and parenting.', C5);
  F('C', 'Strange Situation', 'Ainsworth (1970): 8 episodes, 12–18 months; measures proximity seeking, exploration, stranger & separation anxiety, reunion behaviour.', C3);
  F('C', 'Secure (Type B)', '≈66%: explores using caregiver as a secure base, moderate distress, easily comforted.', C3);
  F('C', 'Insecure-avoidant (Type A)', '≈22%: explores freely, little stranger or separation anxiety, no comfort sought on reunion.', C3);
  F('C', 'Insecure-resistant (Type C)', '≈12%: explores little, huge distress, resists comfort on reunion.', C3);
  F('C', 'Cultural variation', 'van Ijzendoorn & Kroonenberg (1988): 32 studies, 8 countries; secure most common everywhere; variation within cultures 1.5× between.', C3);
  F('C', 'Maternal deprivation', 'Bowlby: prolonged separation in the critical period → intellectual and emotional harm (affectionless psychopathy).', C4);
  F('C', 'Institutionalisation', 'Effects of long-term care in an institution: disinhibited attachment, lower IQ (Rutter’s ERA project).', C4);

/* ---- 04_D_clinical.js ---- */
  /* ===== D · 1.4 Clinical Psychology and Mental Health (Paper 1 Section D) ===== */
  const D1 = '1.1 Definitions of mental health', D2 = '1.2 Characteristics', D3 = '1.3 Behavioural approach: phobias', D4 = '1.4 Cognitive approach: depression', D5 = '1.5 Biological approach: OCD';

  K('D', D1, 'Outline', 3, 'Outline the statistical infrequency definition of abnormality. Give an example.', [
    'Behaviour is abnormal if it is statistically rare/uncommon in the population – it deviates from the average (1)',
    'For normally distributed characteristics, scores more than 2 standard deviations from the mean (about 2% at each tail) are classed as abnormal (1)',
    'eg an IQ below 70 is statistically infrequent and is one criterion for a diagnosis of intellectual disability (1)'
  ]);
  K('D', D1, 'Outline', 4, 'Outline Jahoda’s criteria for ideal mental health.', [
    'The deviation from ideal mental health definition identifies abnormality as failing to meet criteria for good mental health (1)',
    'Criteria include: no symptoms or distress; rational, accurate self-perception (1)',
    'Self-actualisation/personal growth; coping with stress/resisting stress; autonomy (1)',
    'High self-esteem/strong sense of identity; accurate perception of reality; environmental mastery (eg love, work, adapting to new situations) (1)'
  ]);
  K('D', D1, 'Explain', 3, 'Explain one limitation of the deviation from social norms definition of abnormality.', [
    'Social norms vary between cultures – behaviour seen as normal in one culture may be abnormal in another, eg hearing voices (1)',
    'So it is hard to judge people from one culture by the norms of another; people from minority cultures may be over-diagnosed (1)',
    'Norms also change over time (eg homosexuality was in DSM until 1973), so the definition can be used to justify discrimination/human rights abuses (1)'
  ]);
  K('D', D2, 'Outline', 3, 'Outline the behavioural characteristics of phobias.', [
    'Panic – crying, screaming, running away, freezing or collapsing when faced with the phobic stimulus (1)',
    'Avoidance – going to a lot of effort to avoid the phobic stimulus, which can interfere with daily life (1)',
    'Endurance – remaining in the presence of the stimulus while experiencing high anxiety (1)'
  ]);
  K('D', D2, 'Outline', 4, 'Outline the emotional and cognitive characteristics of depression.', [
    'Emotional: lowered mood – feeling sad, empty, worthless (1)',
    'Emotional: anger towards self or others; lowered self-esteem (1)',
    'Cognitive: poor concentration, difficulty making decisions (1)',
    'Cognitive: attending to and dwelling on the negative; absolutist “black and white” thinking (1)'
  ]);
  K('D', D2, 'Identify', 2, 'Identify one emotional and one cognitive characteristic of OCD.', [
    'Emotional: anxiety and distress caused by unpleasant obsessive thoughts; or depression; or guilt and disgust (1)',
    'Cognitive: obsessive thoughts (eg about contamination); cognitive coping strategies (eg praying); insight that thoughts are irrational (hypervigilance) (1)'
  ]);
  K('D', D3, 'Explain', 4, 'Explain the two-process model of phobias.', [
    'Mowrer (1960): phobias are acquired by classical conditioning – a neutral stimulus is paired with an unconditioned stimulus that causes fear, so it becomes a conditioned stimulus producing fear (1+1)',
    'eg Little Albert (Watson & Rayner, 1920): a white rat (NS) paired with a loud noise (UCS) came to produce fear (CR) (1)',
    'Phobias are maintained by operant conditioning – avoiding the phobic stimulus reduces anxiety, which is negatively reinforcing, so avoidance is repeated (1)'
  ]);
  K('D', D3, 'Outline', 4, 'Outline how systematic desensitisation is used to treat phobias.', [
    'The aim is to replace the fear response with relaxation through counterconditioning – reciprocal inhibition: it is impossible to be afraid and relaxed at once (1)',
    'Therapist and client draw up an anxiety hierarchy from least to most frightening situations (1)',
    'The client is taught relaxation techniques (eg breathing exercises, progressive muscle relaxation, mental imagery) (1)',
    'The client works up the hierarchy, relaxing at each level, until they can stay calm at the most feared level (1)'
  ]);
  K('D', D3, 'Distinguish', 2, 'Distinguish between flooding and systematic desensitisation.', [
    'Flooding involves immediate exposure to the most feared stimulus without a gradual build-up, until anxiety subsides (extinction) (1)',
    'SD exposes the client gradually via a hierarchy while using relaxation (1)'
  ]);
  K('D', D4, 'Outline', 4, 'Outline Beck’s negative triad as an explanation of depression.', [
    'Beck (1967): depression is caused by faulty information processing – focusing on the negative, “black and white” thinking (1)',
    'Negative self-schemas lead people to interpret information about themselves negatively (1)',
    'The negative triad: negative views of the self, the world and the future (1)',
    'These automatic negative thoughts lead to and maintain depression (1)'
  ]);
  K('D', D4, 'Explain', 3, 'Explain Ellis’s ABC model of depression.', [
    'A – Activating event: an event that triggers irrational thoughts, eg failing a test (1)',
    'B – Beliefs: irrational beliefs about the event, eg “musturbation” (I must always succeed), “I-can’t-stand-it-itis”, utopianism (1)',
    'C – Consequences: emotional and behavioural consequences of the irrational belief, eg depression (1)'
  ]);
  K('D', D4, 'Describe', 4, 'Describe how cognitive behaviour therapy (CBT) is used to treat depression. Refer to challenging irrational thoughts.', [
    'The client and therapist assess the client’s problems and identify automatic negative thoughts/irrational beliefs (1)',
    'Thoughts are challenged: reality testing – looking for evidence that the thoughts are untrue; or disputing (logical, empirical, pragmatic) (1)',
    'Homework – the client tests beliefs in real life, eg records times they enjoyed something (client as scientist) (1)',
    'Behavioural activation – encouraging pleasurable activities; unconditional positive regard for the client (1)'
  ]);
  K('D', D5, 'Outline', 4, 'Outline genetic and neural explanations for OCD.', [
    'Genetic: OCD is polygenic – many candidate genes each make a small contribution, eg COMT and SERT genes (1)',
    'Nestadt et al. (2010): 68% concordance in identical vs 31% in non-identical twins (1)',
    'Neural: low levels of serotonin may disrupt mood regulation (1)',
    'Neural: abnormal functioning of the orbitofrontal cortex/“worry circuit” (OFC, caudate nucleus, thalamus) (1)'
  ]);
  K('D', D5, 'Outline', 3, 'Outline the use of drug therapy to treat OCD.', [
    'SSRIs (eg fluoxetine) are the standard drug – they block reuptake of serotonin at the presynaptic neuron (1)',
    'More serotonin remains in the synapse, prolonging its effect on the postsynaptic neuron and reducing anxiety (1)',
    'Usual dose 20 mg; takes 3–4 months to work; tricyclics (eg clomipramine) or SNRIs may be used if SSRIs do not work; often combined with CBT (1)'
  ]);
  KL('D', D3, 'Discuss', 16, 'Discuss the behavioural approach to treating phobias.', [
    'AO1: Systematic desensitisation – counterconditioning, reciprocal inhibition, anxiety hierarchy, relaxation, in vivo or in vitro exposure.',
    'AO1: Flooding – one long session of exposure to the most feared stimulus; extinction; client must give informed consent.',
    'AO3: SD effectiveness – Gilroy et al. (2003): 42 spider phobics, SD group less fearful than relaxation-only group at 3 and 33 months.',
    'AO3: SD is suitable for a wide range of patients, including people with learning difficulties who struggle with CBT.',
    'AO3: Flooding is quick and cost-effective (Ougrin, 2011), but traumatic – high dropout; ethical issues.',
    'AO3: Symptom substitution – treats symptoms not causes; psychodynamic critics argue new phobias may appear.',
    'AO3: Less effective for social phobia, which has a cognitive aspect – CBT may be better.'
  ], 'AO1 = 6, AO3 = 10');
  KL('D', D4, 'Discuss', 16, 'Discuss the cognitive approach to explaining and treating depression.', [
    'AO1: Beck – faulty information processing, negative self-schemas, negative triad; Ellis – ABC model, irrational beliefs.',
    'AO1: CBT – identify and challenge irrational thoughts, reality testing, homework, behavioural activation.',
    'AO3: Support for Beck – Clark & Beck (1999) review; Cohen et al. (2019): 473 adolescents, early negative thinking predicted later depression.',
    'AO3: Ellis explains reactive depression better than depression with no obvious trigger.',
    'AO3: Cognitive explanation does not explain all aspects – eg hallucinations or Cotard delusion in severe depression.',
    'AO3: CBT effectiveness – March et al. (2007): 327 adolescents, after 36 weeks 81% improved with CBT, 81% with antidepressants, 86% combined.',
    'AO3: CBT may be unsuitable for severe depression where motivation/concentration is too low; success depends on the therapist relationship (Rosenzweig, 1936 “dodo bird verdict”).',
    'AO3: Blames the client, minimising life circumstances (eg poverty, abuse).'
  ], 'AO1 = 6, AO3 = 10');
  KL('D', D5, 'Evaluate', 8, 'Evaluate drug therapy as a treatment for OCD.', [
    'AO1 (brief): SSRIs increase serotonin in the synapse; 3–4 months; alternatives tricyclics/SNRIs.',
    'AO3: Effectiveness – Soomro et al. (2008) review of 17 studies: SSRIs more effective than placebo; ~70% improve with SSRIs or SSRIs + CBT.',
    'AO3: Cost-effective and non-disruptive compared to psychological therapy.',
    'AO3: Side effects – indigestion, blurred vision, loss of sex drive; tricyclics worse; may reduce compliance.',
    'AO3: Treats symptoms not causes – relapse when medication stops; drug company funding may bias research.'
  ], 'AO1 = 3, AO3 = 5');

  M('D', D1, 'Which definition of abnormality uses Jahoda’s criteria?', 'Deviation from ideal mental health', ['Statistical infrequency', 'Failure to function adequately', 'Deviation from social norms'], 'Jahoda (1958) listed criteria for ideal mental health.');
  M('D', D1, 'Rosenhan & Seligman’s signs of failing to function adequately include…', 'Observer discomfort and maladaptive behaviour', ['Self-actualisation and autonomy', 'Being more than 2 SD from the mean', 'Breaking implicit social rules only'], 'Also: no longer conforming to interpersonal rules, severe personal distress, irrational behaviour.');
  M('D', D2, 'Which is a behavioural characteristic of OCD?', 'Compulsions that are repetitive', ['Irrational beliefs about the phobic stimulus', 'Lowered mood', 'Avoidance of eye contact only'], 'Compulsions are repetitive behaviours that reduce anxiety.');
  M('D', D2, 'Hypervigilance is mainly associated with which characteristic of OCD?', 'Cognitive', ['Behavioural', 'Emotional', 'None – it is a phobia characteristic'], 'Hypervigilance is cognitive – maintaining attention, being alert.');
  M('D', D3, 'In the two-process model, phobias are maintained by…', 'Negative reinforcement of avoidance', ['Positive punishment', 'Classical conditioning only', 'Vicarious reinforcement'], 'Avoiding the stimulus reduces anxiety – negative reinforcement.');
  M('D', D3, 'Reciprocal inhibition refers to…', 'Being unable to feel two opposing emotions at the same time', ['Inhibitory neurotransmitters blocking anxiety', 'A therapist inhibiting the client’s avoidance', 'Forgetting old learning'], 'Relaxation inhibits anxiety in SD.');
  M('D', D4, 'Beck’s negative triad includes negative views of…', 'The self, the world and the future', ['The past, present and future', 'Parents, peers and teachers', 'Thoughts, feelings and behaviours'], 'Three negative views maintain depression.');
  M('D', D4, 'In Ellis’s ABC model, what does B stand for?', 'Beliefs', ['Behaviour', 'Biology', 'Bias'], 'Irrational beliefs about the activating event.');
  M('D', D5, 'SSRIs work by…', 'Blocking the reuptake of serotonin', ['Blocking dopamine receptors', 'Increasing the breakdown of serotonin', 'Reducing cortisol'], 'More serotonin stays in the synaptic cleft.');
  M('D', D5, 'Nestadt et al. (2010) found what concordance rate for OCD in identical twins?', '68%', ['31%', '100%', '48%'], 'Non-identical twins 31%.');
  TF('D', D1, 'Statistical infrequency does not distinguish between desirable and undesirable rare behaviour.', true, 'A very high IQ is as rare as a very low one.');
  TF('D', D3, 'Flooding involves a gradual hierarchy of feared situations.', false, 'That is SD. Flooding is immediate exposure to the most feared stimulus.');
  TF('D', D4, 'In CBT, the client is encouraged to act as a scientist and test their beliefs.', true, 'Reality testing and homework.');
  TF('D', D5, 'OCD is thought to involve a single gene.', false, 'It is polygenic – many candidate genes (Taylor, 2013, up to 230).');

  F('D', 'Statistical infrequency', 'Abnormal = rare; eg more than 2 SD from the mean (IQ < 70).', D1);
  F('D', 'Deviation from social norms', 'Abnormal = breaking the unwritten rules of a society. Culture- and era-bound.', D1);
  F('D', 'Failure to function adequately', 'Unable to cope with everyday life; Rosenhan & Seligman: personal distress, maladaptive, irrational, observer discomfort…', D1);
  F('D', 'Deviation from ideal mental health', 'Jahoda (1958): failing to meet criteria such as self-actualisation, autonomy, coping with stress, accurate perception.', D1);
  F('D', 'Phobia', 'Irrational fear of an object or situation. B: panic, avoidance. E: anxiety, fear. C: selective attention, irrational beliefs.', D2);
  F('D', 'Depression', 'Mood disorder. B: activity level, sleep, eating changes. E: low mood, anger. C: negative focus, absolutist thinking.', D2);
  F('D', 'OCD', 'Obsessions (thoughts) + compulsions (behaviour). Compulsions reduce anxiety; insight that it is irrational.', D2);
  F('D', 'Two-process model', 'Mowrer (1960): phobias acquired by classical conditioning, maintained by operant conditioning (negative reinforcement).', D3);
  F('D', 'Systematic desensitisation', 'Wolpe: anxiety hierarchy + relaxation + gradual exposure; counterconditioning via reciprocal inhibition.', D3);
  F('D', 'Flooding', 'Immediate, prolonged exposure to the most feared stimulus until anxiety subsides (extinction).', D3);
  F('D', 'Negative triad', 'Beck: negative view of self, world and future, driven by negative self-schemas and faulty information processing.', D4);
  F('D', 'ABC model', 'Ellis: Activating event → irrational Beliefs → Consequences (eg depression).', D4);
  F('D', 'CBT', 'Identify and challenge irrational thoughts: reality testing, disputing, homework, behavioural activation.', D4);
  F('D', 'Worry circuit', 'OFC, caudate nucleus and thalamus loop thought to be overactive in OCD.', D5);
  F('D', 'SSRIs', 'Selective serotonin reuptake inhibitors (eg fluoxetine): block reuptake so more serotonin stays in the synapse.', D5);

/* ---- 05_E_approaches.js ---- */
  /* ===== E · 2.1 Approaches in Psychology (Paper 2 Section A) ===== */
  const E1 = '2.1.1 Learning approaches', E2 = '2.1.2 Cognitive approach', E3 = '2.1.3 Biological approach', E4 = '2.1.4 Psychodynamic approach', E5 = '2.1.5 Humanistic Psychology', E6 = '2.1.6 Comparison of approaches';

  K('E', E1, 'Outline', 4, 'Outline Pavlov’s research into classical conditioning.', [
    'Pavlov rang a bell (neutral stimulus) whenever he gave food (unconditioned stimulus) to dogs (1)',
    'Food naturally produced salivation (unconditioned response) (1)',
    'After repeated pairings the bell alone produced salivation – the bell became a conditioned stimulus producing a conditioned response (1)',
    'Timing mattered – the NS had to be presented just before the UCS; he also showed extinction, spontaneous recovery and stimulus generalisation (1)'
  ]);
  K('E', E1, 'Explain', 4, 'Explain the difference between negative reinforcement and punishment. Use examples.', [
    'Negative reinforcement: avoiding/removing something unpleasant, which increases the likelihood of the behaviour being repeated (1)',
    'eg a student hands in homework on time to avoid being told off (1)',
    'Punishment: an unpleasant consequence of behaviour that decreases the likelihood of it being repeated (1)',
    'eg a student talks in class and is given a detention (1)'
  ]);
  K('E', E1, 'Outline', 4, 'Outline the role of mediational processes in social learning theory.', [
    'Attention – whether the behaviour is noticed (1)',
    'Retention – whether the behaviour is remembered/stored (1)',
    'Motor reproduction – whether the observer is physically/mentally able to perform the behaviour (1)',
    'Motivation – the will to perform it, often based on whether it was rewarded or punished (vicarious reinforcement) (1)'
  ]);
  K('E', E1, 'Outline', 3, 'Outline Bandura’s research into social learning.', [
    'Bandura et al. (1961): children watched an adult model behave either aggressively or non-aggressively towards a Bobo doll (1)',
    'Children who saw the aggressive model were more likely to imitate the specific physical and verbal aggressive acts later (1)',
    'Bandura & Walters (1963): children who saw the model rewarded were more aggressive than those who saw the model punished – vicarious reinforcement (1)'
  ]);
  K('E', E2, 'Explain', 4, 'Explain the role of schema and the use of models in the cognitive approach.', [
    'Schemas are mental frameworks of beliefs/expectations developed from experience that help us organise and interpret information quickly (1)',
    'They act as a mental shortcut but can lead to distorted perception or memory, eg filling in gaps with expectations (1)',
    'Theoretical models (eg the WMM) are simplified representations, often flow diagrams, of mental processes (1)',
    'Computer models compare the mind to a computer – input, processing (CPU), output – making inferences about processes we cannot observe directly (1)'
  ]);
  K('E', E2, 'Outline', 3, 'Outline what is meant by cognitive neuroscience.', [
    'The scientific study of the biological structures that underpin cognitive processes (1)',
    'Uses brain scanning (eg fMRI, PET) to link mental processes to specific brain areas (1)',
    'eg Tulving et al. (1994): episodic and semantic memories located in different sides of the prefrontal cortex (1)'
  ]);
  K('E', E3, 'Distinguish', 3, 'Distinguish between genotype and phenotype. Use an example.', [
    'Genotype is a person’s actual genetic make-up (1)',
    'Phenotype is the way genes are expressed through physical, behavioural and psychological characteristics, influenced by the environment (1)',
    'eg PKU: a person may have the genotype for PKU but a special diet prevents the phenotype (intellectual impairment) (1)'
  ]);
  K('E', E4, 'Outline', 4, 'Outline Freud’s structure of personality.', [
    'Id: present at birth, unconscious, selfish, works on the pleasure principle – demands immediate gratification (1)',
    'Ego: develops around age 2, works on the reality principle, mediates between id and superego (1)',
    'Superego: forms at the end of the phallic stage (~age 5), internalised sense of right and wrong based on the same-sex parent; the morality principle (1)',
    'Conflict between the three is managed by the ego using defence mechanisms (1)'
  ]);
  K('E', E4, 'Outline', 3, 'Outline three defence mechanisms.', [
    'Repression – forcing a distressing memory out of the conscious mind (1)',
    'Denial – refusing to acknowledge an aspect of reality (1)',
    'Displacement – transferring feelings from their true source onto a substitute target (1)'
  ]);
  K('E', E5, 'Explain', 4, 'Explain the role of conditions of worth and congruence in humanistic psychology.', [
    'Rogers: for personal growth the self-concept and ideal self must be broadly congruent (similar) (1)',
    'A large gap between them (incongruence) leads to low self-worth and prevents self-actualisation (1)',
    'Conditions of worth are conditions parents set for their love (eg “I will only love you if…”) (1)',
    'These lead to incongruence; therapy offers unconditional positive regard to reduce it (client-centred therapy) (1)'
  ]);
  KL('E', E1, 'Discuss', 16, 'Discuss social learning theory. Refer to Bandura’s research.', [
    'AO1: Learning through observation and imitation of role models; identification; vicarious reinforcement; mediational processes (ARRM).',
    'AO1: Bandura et al. (1961, 1963) Bobo doll studies.',
    'AO3: Recognises cognitive factors – more comprehensive than behaviourism; but still underplays biological factors (eg testosterone in aggression).',
    'AO3: Lab studies may produce demand characteristics – children may have thought the Bobo doll was meant to be hit (Noble, 1975).',
    'AO3: Explains cultural differences – eg Fagot et al.; and reciprocal determinism (Bandura) – some free will.',
    'AO3: Applications – media influences on aggression; age certification.',
    'AO3: Ethical issues of exposing children to aggression.'
  ], 'AO1 = 6, AO3 = 10');
  KL('E', E6, 'Discuss', 16, 'Compare the biological approach and the psychodynamic approach.', [
    'AO1: Biological – genes, neurochemistry, evolution, biological structures; psychodynamic – unconscious, id/ego/superego, defence mechanisms, psychosexual stages.',
    'AO3: Determinism – both are hard determinist (biological vs psychic determinism), no room for free will.',
    'AO3: Science – biological approach is scientific (fMRI, twin studies), psychodynamic is unfalsifiable (Popper), based on case studies.',
    'AO3: Nature–nurture – biological is nature; psychodynamic is interactionist (innate drives + childhood experience).',
    'AO3: Reductionism – biological reduces to genes/neurons; psychodynamic reduces to drives but is holistic in therapy.',
    'AO3: Applications – drug therapies vs psychoanalysis; time and effectiveness.',
    'AO3: Idiographic (psychodynamic case studies) vs nomothetic (biological).'
  ], 'AO1 = 6, AO3 = 10');
  KL('E', E5, 'Evaluate', 8, 'Evaluate humanistic psychology.', [
    'AO1 (brief): free will, self-actualisation, Maslow’s hierarchy, congruence, conditions of worth, client-centred therapy.',
    'AO3: Not reductionist – holistic; considers the whole person in context; more meaningful.',
    'AO3: Positive approach – optimistic view of human nature, people control their lives.',
    'AO3: Untestable concepts (self-actualisation, congruence) – lacks empirical evidence; limited scientific credibility.',
    'AO3: Cultural bias – individualist values (personal growth, freedom) may not apply in collectivist cultures.',
    'AO3: Limited real-world application beyond counselling.'
  ], 'AO1 = 3, AO3 = 5');

  M('E', E1, 'Positive reinforcement involves…', 'Receiving a reward for a behaviour, so it is repeated', ['Avoiding something unpleasant', 'Receiving an unpleasant consequence', 'Observing a model being rewarded'], 'Positive = something added that is pleasant.');
  M('E', E1, 'In Skinner’s research, rats learned to press a lever to avoid an electric shock. This is…', 'Negative reinforcement', ['Positive reinforcement', 'Punishment', 'Classical conditioning'], 'Avoiding something unpleasant strengthens the behaviour.');
  M('E', E1, 'Learning through observing the consequences of another person’s behaviour is…', 'Vicarious reinforcement', ['Classical conditioning', 'Identification', 'Retention'], 'A key SLT concept.');
  M('E', E2, 'The cognitive approach makes inferences because…', 'Mental processes cannot be observed directly', ['Behaviour cannot be measured', 'Schemas are visible on scans', 'It rejects scientific methods'], 'Inferences about internal processes are made from behaviour.');
  M('E', E3, 'Which neurotransmitter is associated with reward and pleasure?', 'Dopamine', ['Serotonin', 'GABA', 'Adrenaline'], 'Dopamine is involved in reward pathways.');
  M('E', E4, 'Which psychosexual stage involves the Oedipus complex?', 'Phallic', ['Oral', 'Anal', 'Latency'], 'Phallic stage, 3–6 years.');
  M('E', E4, 'Which part of personality works on the reality principle?', 'Ego', ['Id', 'Superego', 'Libido'], 'The ego mediates between id and superego.');
  M('E', E5, 'At the top of Maslow’s hierarchy of needs is…', 'Self-actualisation', ['Esteem', 'Love and belongingness', 'Safety'], 'Lower deficiency needs must be met first.');
  M('E', E6, 'Which approach is most associated with free will?', 'Humanistic', ['Biological', 'Behaviourist', 'Psychodynamic'], 'Humanists reject determinism.');
  TF('E', E1, 'The behaviourist approach mainly studies animals because learning processes are assumed to be the same across species.', true, 'Equipotentiality assumption.');
  TF('E', E3, 'Concordance rates in twin studies show how far a characteristic is shared by twins.', true, 'Higher in MZ than DZ twins suggests genetic influence.');
  TF('E', E4, 'Freud believed the conscious mind was the largest part of the mind.', false, 'The unconscious is the largest part (iceberg).');
  TF('E', E2, 'Cognitive neuroscience emerged with brain scanning technology.', true, 'Scanning allows mental processes to be linked to brain areas.');

  F('E', 'Classical conditioning', 'Learning by association: NS + UCS → NS becomes CS producing a CR (Pavlov’s dogs).', E1);
  F('E', 'Operant conditioning', 'Learning by consequences: positive/negative reinforcement increase behaviour, punishment decreases it (Skinner box).', E1);
  F('E', 'Social learning theory', 'Bandura: learning by observing and imitating role models; identification; vicarious reinforcement; ARRM mediational processes.', E1);
  F('E', 'Identification', 'An observer associates with a role model and wants to be like them.', E1);
  F('E', 'Schema', 'Mental framework of beliefs and expectations that influences how information is processed.', E2);
  F('E', 'Cognitive neuroscience', 'Study of the biological structures underpinning cognitive processes, using scanning (eg Tulving 1994, PET).', E2);
  F('E', 'Genotype vs phenotype', 'Genotype = genetic make-up; phenotype = how genes are expressed with environmental influence.', E3);
  F('E', 'Evolution (biological approach)', 'Natural selection: genetically determined behaviours that aid survival and reproduction are passed on.', E3);
  F('E', 'Id / Ego / Superego', 'Id = pleasure principle; Ego = reality principle; Superego = morality principle.', E4);
  F('E', 'Psychosexual stages', 'Oral (0–1), anal (1–3), phallic (3–6), latency, genital (puberty). Unresolved conflict → fixation.', E4);
  F('E', 'Self-actualisation', 'Maslow/Rogers: the innate drive to reach one’s full potential; top of Maslow’s hierarchy.', E5);
  F('E', 'Congruence', 'Rogers: similarity between self-concept and ideal self; needed for self-actualisation.', E5);
  F('E', 'Conditions of worth', 'Conditions placed on love by parents; lead to incongruence and low self-worth.', E5);

/* ---- 06_F_biopsychology.js ---- */
  /* ===== F · 2.2 Biopsychology (Paper 2 Section B) ===== */
  const F1 = '2.2.1 Nervous system', F2 = '2.2.2 Neurons & synaptic transmission', F3 = '2.2.3 Endocrine system', F4 = '2.2.4 Fight or flight', F5 = '2.2.5 Ways of studying the brain', F6 = '2.2.6 Localisation, lateralisation & plasticity';

  K('F', F1, 'Outline', 4, 'Outline the divisions of the nervous system.', [
    'The central nervous system (CNS) is the brain and spinal cord – the brain is the centre of conscious awareness; the spinal cord relays information and controls reflexes (1)',
    'The peripheral nervous system (PNS) transmits messages between the CNS and the rest of the body (1)',
    'The somatic nervous system governs voluntary movement and carries sensory information to the CNS (1)',
    'The autonomic nervous system governs involuntary/vital functions and has sympathetic (arousal) and parasympathetic (rest) divisions (1)'
  ]);
  K('F', F2, 'Outline', 3, 'Outline the structure and function of a relay neuron.', [
    'Relay neurons connect sensory neurons to motor neurons or other relay neurons (1)',
    'They are found in the brain and spinal cord (CNS) (1)',
    'They have short dendrites and short axons (1)'
  ]);
  K('F', F2, 'Explain', 6, 'Explain the process of synaptic transmission.', [
    'An electrical impulse (action potential) reaches the presynaptic terminal (1)',
    'This triggers the release of neurotransmitter from synaptic vesicles (1)',
    'The neurotransmitter diffuses across the synaptic cleft (1)',
    'It binds to specialised receptor sites on the postsynaptic neuron, where it is converted back to an electrical impulse (1)',
    'Excitatory neurotransmitters (eg adrenaline) make the postsynaptic neuron more likely to fire; inhibitory ones (eg serotonin, GABA) less likely (1)',
    'Summation: the net effect of excitatory and inhibitory inputs decides whether the postsynaptic neuron fires; transmission is one-way only (1)'
  ]);
  K('F', F3, 'Outline', 3, 'Outline the function of the pituitary gland in the endocrine system.', [
    'The pituitary is the “master gland” – it controls the release of hormones from other glands (1)',
    'It is controlled by the hypothalamus (1)',
    'eg it releases ACTH, which stimulates the adrenal cortex to release cortisol in response to stress; or LH/FSH controlling the ovaries/testes (1)'
  ]);
  K('F', F4, 'Explain', 4, 'Explain the role of adrenaline in the fight or flight response.', [
    'The hypothalamus detects a threat and activates the sympathetic branch of the ANS (1)',
    'The adrenal medulla releases adrenaline into the bloodstream (1)',
    'Adrenaline increases heart rate and breathing rate and dilates pupils (1)',
    'It increases blood flow to muscles and inhibits digestion and saliva, so the body is prepared to fight or flee (1)'
  ]);
  K('F', F5, 'Outline', 4, 'Outline how fMRI is used to study the brain.', [
    'fMRI detects changes in blood oxygenation and flow in the brain (1)',
    'Active brain areas use more oxygen, so blood flow is directed to them (haemodynamic response) (1)',
    'This produces 3D images (activation maps) showing which parts of the brain are involved in a mental process (1)',
    'It shows brain activity while a person does a task, eg memory task (1)'
  ]);
  K('F', F5, 'Distinguish', 2, 'Distinguish between an EEG and an ERP.', [
    'An EEG records the overall electrical activity of the brain via electrodes on the scalp, showing patterns of brain waves (1)',
    'ERPs are small voltage changes triggered by a specific stimulus/event, isolated from the EEG by statistical averaging (1)'
  ]);
  K('F', F6, 'Outline', 4, 'Outline research into split-brain patients.', [
    'Sperry (1968) studied 11 people who had had their corpus callosum cut to treat epilepsy (1)',
    'An image was presented to one visual field while the other eye was covered, so information went only to one hemisphere (1)',
    'When a picture was shown to the right visual field (left hemisphere) the patient could describe it; shown to the left visual field (right hemisphere) they said “nothing there” (1)',
    'But they could select a matching object with the left hand – showing language is lateralised to the left hemisphere (1)'
  ]);
  K('F', F6, 'Explain', 4, 'Explain what is meant by brain plasticity and functional recovery.', [
    'Plasticity is the brain’s ability to change and adapt its structure and function as a result of experience and learning (1)',
    'eg Maguire et al. (2000): London taxi drivers had more grey matter in the posterior hippocampus than controls (1)',
    'Functional recovery is the transfer of functions from a damaged area to undamaged areas after trauma (1)',
    'Mechanisms: axonal sprouting, denervation super-sensitivity, recruitment of homologous areas on the opposite hemisphere (1)'
  ]);
  K('F', F6, 'Identify', 2, 'Identify the location and function of Broca’s area.', [
    'Location: the left frontal lobe (1)',
    'Function: speech production – damage causes slow, laborious, non-fluent speech (Broca’s aphasia) (1)'
  ]);
  KL('F', F6, 'Discuss', 16, 'Discuss research into localisation of function in the brain.', [
    'AO1: Motor centre (frontal lobe), somatosensory (parietal), visual (occipital), auditory (temporal); Broca’s area (speech production) and Wernicke’s area (language comprehension) in the left hemisphere.',
    'AO3: Brain scan evidence – Petersen et al. (1988): Wernicke’s area active while listening, Broca’s while reading; Tulving (1994).',
    'AO3: Case study evidence – Phineas Gage; but unique cases limit generalisation.',
    'AO3: Equipotentiality – Lashley (1950): rats’ learning in a maze was not localised; higher functions spread across cortex.',
    'AO3: Plasticity challenges strict localisation – functions can move after damage.',
    'AO3: Language may be organised in networks – Dick & Tremblay (2016): only 2% of researchers think Broca/Wernicke models are fully accurate.',
    'AO3: Biological reductionism; communication between areas may matter more (Wernicke conceded this).'
  ], 'AO1 = 6, AO3 = 10');
  KL('F', F5, 'Evaluate', 8, 'Evaluate two ways of studying the brain.', [
    'AO1 (brief): fMRI – blood flow; EEG/ERP – electrical activity; post-mortem – physical examination after death.',
    'AO3: fMRI – no radiation, good spatial resolution (1–2 mm); but poor temporal resolution (~5 s lag), expensive; shows correlation not causation.',
    'AO3: EEG – excellent temporal resolution (1 ms), cheap, useful for sleep/epilepsy; but poor spatial resolution.',
    'AO3: ERP – specific to a stimulus; but must remove background noise; lack of standardisation.',
    'AO3: Post-mortem – detailed examination of deep structures (eg Broca); but retrospective, causation unclear; consent issues.'
  ], 'AO1 = 3, AO3 = 5');

  M('F', F1, 'Which division of the nervous system controls voluntary muscle movement?', 'Somatic', ['Autonomic', 'Sympathetic', 'Parasympathetic'], 'The somatic NS links the CNS to skeletal muscles and senses.');
  M('F', F2, 'Which neuron carries messages from the CNS to effectors?', 'Motor neuron', ['Sensory neuron', 'Relay neuron', 'Interneuron in the retina'], 'Motor neurons have short dendrites and long axons.');
  M('F', F2, 'Neurotransmitters are stored in…', 'Synaptic vesicles', ['Postsynaptic receptors', 'The myelin sheath', 'The nodes of Ranvier'], 'Released into the synaptic cleft.');
  M('F', F3, 'Which gland releases melatonin?', 'Pineal gland', ['Pituitary gland', 'Thyroid gland', 'Adrenal gland'], 'Melatonin regulates sleep/wake cycles.');
  M('F', F4, 'Which branch of the ANS returns the body to a resting state after a threat?', 'Parasympathetic', ['Sympathetic', 'Somatic', 'Central'], '“Rest and digest”.');
  M('F', F5, 'Which technique has the best temporal resolution?', 'EEG', ['fMRI', 'Post-mortem examination', 'CT scan'], 'EEG records in milliseconds.');
  M('F', F6, 'Damage to Wernicke’s area typically causes…', 'Fluent but meaningless speech and poor comprehension', ['Slow, laborious speech', 'Loss of movement on one side', 'Loss of vision'], 'Wernicke’s (receptive) aphasia.');
  M('F', F6, 'The somatosensory cortex is located in the…', 'Parietal lobe', ['Frontal lobe', 'Occipital lobe', 'Temporal lobe'], 'It processes sensory information from the skin.');
  M('F', F6, 'Axonal sprouting is a mechanism of…', 'Functional recovery', ['Synaptic transmission', 'Lateralisation', 'Hormone release'], 'New nerve endings grow to connect undamaged neurons.');
  TF('F', F2, 'Serotonin is usually an inhibitory neurotransmitter.', true, 'It makes the postsynaptic neuron less likely to fire.');
  TF('F', F4, 'In fight or flight, digestion speeds up.', false, 'Digestion is inhibited so energy goes to muscles.');
  TF('F', F6, 'In most people, language centres are in the left hemisphere.', true, 'Language is lateralised to the left.');
  TF('F', F5, 'Post-mortem examinations can establish cause and effect between brain damage and behaviour.', false, 'Damage could be caused by something else; correlation only.');

  F('F', 'CNS', 'Brain and spinal cord.', F1);
  F('F', 'Autonomic nervous system', 'Involuntary functions: sympathetic (fight or flight) and parasympathetic (rest and digest).', F1);
  F('F', 'Sensory / relay / motor neurons', 'Sensory: receptors → CNS (long dendrites, short axons). Relay: in CNS (short both). Motor: CNS → effectors (short dendrites, long axons).', F2);
  F('F', 'Synaptic transmission', 'Impulse → vesicles release neurotransmitter → diffuses across cleft → binds to postsynaptic receptors.', F2);
  F('F', 'Excitation vs inhibition', 'Excitatory NTs make the next neuron more likely to fire; inhibitory less likely. Summation decides.', F2);
  F('F', 'Endocrine system', 'Glands release hormones into the bloodstream; slower than the nervous system but longer-lasting.', F3);
  F('F', 'Pituitary gland', '“Master gland”, controlled by the hypothalamus; releases ACTH, LH, FSH, oxytocin.', F3);
  F('F', 'Adrenaline', 'Released by the adrenal medulla in fight or flight: ↑ heart rate, breathing, pupils dilate, digestion inhibited.', F4);
  F('F', 'fMRI', 'Measures blood oxygenation changes; good spatial (1–2 mm), poor temporal (~5 s) resolution.', F5);
  F('F', 'EEG / ERP', 'EEG: overall electrical activity via scalp electrodes. ERP: averaged responses to a specific stimulus.', F5);
  F('F', 'Broca’s area', 'Left frontal lobe; speech production.', F6);
  F('F', 'Wernicke’s area', 'Left temporal lobe; language comprehension.', F6);
  F('F', 'Hemispheric lateralisation', 'Some functions are dominated by one hemisphere (language left; face recognition right). Split-brain: Sperry (1968).', F6);
  F('F', 'Plasticity', 'The brain changes with experience (Maguire 2000 taxi drivers) and can recover function after trauma.', F6);

/* ---- 07_G_research_methods.js ---- */
  /* ===== G · 2.3 Research methods (Paper 2 Section C — 48 marks; also tested across Papers 1 and 3) ===== */
  const G1 = '2.3.1 Experimental method', G2 = '2.3.2–6 Non-experimental methods', G3 = '2.3.7–8 Aims & hypotheses', G4 = '2.3.9 Sampling',
    G5 = '2.3.10–16 Design & control', G6 = '2.3.17 Ethics', G7 = '2.3.18–19 Peer review & economy', G8 = '2.3.20–21 Reliability & validity',
    G9 = '2.3.22–23 Science & reporting', G10 = '2.3.24–31 Data & descriptive statistics', G11 = '2.3.32–34 Inferential statistics';

  K('G', '2.3.1 Experimental method', 'Distinguish', 2, 'Distinguish between a natural experiment and a quasi-experiment.', [
    'In a natural experiment the IV varies naturally/is changed by someone other than the researcher (eg a new law); the researcher records the effect on the DV (1)',
    'In a quasi-experiment the IV is a difference between people that already exists (eg age, gender, having a disorder) – it is not manipulated by anyone (1)'
  ]);
  K('G', '2.3.1 Experimental method', 'Explain', 4, 'Explain one strength and one limitation of a laboratory experiment.', [
    'Strength: high control over extraneous variables, so the effect on the DV is more likely to be caused by the IV – high internal validity (1+1)',
    'Limitation: artificial setting/task may not reflect real-life behaviour – low ecological/mundane realism and generalisability (1+1)',
    'Accept: replicable (standardised procedures) / demand characteristics as alternatives.'
  ]);
  K('G', '2.3.2 Observational techniques', 'Explain', 4, 'Explain the difference between covert and overt observation, and one ethical issue with covert observation.', [
    'Covert: participants are unaware they are being observed (1)',
    'Overt: participants know they are being observed (1)',
    'Covert observation means participants cannot give informed consent (1)',
    'Their privacy may be invaded; dealt with by observing only in public places where people expect to be seen, and/or retrospective consent (1)'
  ]);
  K('G', '2.3.4 Correlations', 'Explain', 3, 'Explain why correlations cannot show cause and effect.', [
    'A correlation shows only that two co-variables are related, not that one causes the other (1)',
    'Neither variable is manipulated, so the direction of the relationship is unknown (1)',
    'A third, intervening variable may cause the change in both co-variables (1)'
  ]);
  K('G', '2.3.5 Content analysis', 'Outline', 4, 'Outline how a researcher could carry out a content analysis of TV adverts to study gender stereotypes.', [
    'Select a sample of adverts, eg all adverts shown at peak time on one channel over a week (1)',
    'Create coding units/behavioural categories, eg “woman shown in domestic role”, “man shown as expert” (1)',
    'Watch the adverts and tally each time a category occurs – quantitative data (1)',
    'Use two researchers to check inter-rater reliability; or produce qualitative themes using thematic analysis (1)'
  ]);
  K('G', '2.3.6 Case studies', 'Evaluate', 4, 'Evaluate the use of case studies in psychology.', [
    'Strength: rich, detailed qualitative insight into unusual behaviour, eg HM (1)',
    'Strength: can generate hypotheses for future nomothetic research / contribute to understanding of typical functioning (1)',
    'Limitation: findings cannot be generalised from one person/small group (1)',
    'Limitation: researcher interpretation is subjective; recollections by participants may be inaccurate (1)'
  ]);
  K('G', '2.3.8 Hypotheses', 'Write', 3, 'A researcher believes that listening to music while revising affects test scores. Write a non-directional hypothesis for this study.', [
    'There will be a difference (1)',
    'in test scores (number of correct answers out of 20) (1 – operationalised DV)',
    'between participants who revise in silence and those who revise while listening to music (1 – operationalised IV)'
  ]);
  K('G', '2.3.8 Hypotheses', 'Explain', 2, 'Explain when a researcher should use a directional hypothesis.', [
    'When previous research/theory suggests a particular direction for the results (1)',
    'eg past research suggests music reduces scores, so “participants who revise in silence will score higher…” (1)'
  ]);
  K('G', '2.3.9 Sampling', 'Explain', 4, 'Explain how a researcher could obtain a stratified sample of 50 students from a school of 1000 students (600 girls, 400 boys).', [
    'Identify subgroups (strata) in the target population, eg gender: 60% girls, 40% boys (1)',
    'Calculate the number needed from each stratum in proportion: 30 girls and 20 boys (1)',
    'Use random sampling within each stratum, eg all girls’ names in a hat and draw 30 (1)',
    'Repeat for boys – the sample is representative of the strata (1)'
  ]);
  K('G', '2.3.9 Sampling', 'Explain', 2, 'Explain one limitation of a volunteer sample.', [
    'Volunteer bias – people who volunteer may share characteristics (eg more motivated, more curious, more helpful) (1)',
    'So the sample may not be representative of the target population and results cannot be generalised (1)'
  ]);
  K('G', '2.3.15 Control', 'Explain', 3, 'Explain what is meant by counterbalancing and why it is used.', [
    'Counterbalancing is used in repeated measures designs: half the participants do condition A then B, the other half B then A (ABBA) (1)',
    'It controls order effects such as practice or fatigue (1)',
    'Order effects are balanced across both conditions rather than eliminated (1)'
  ]);
  K('G', '2.3.11 Experimental designs', 'Outline', 2, 'Outline one strength and one limitation of a matched pairs design.', [
    'Strength: participants only do one condition, so there are no order effects/demand characteristics less likely (1)',
    'Limitation: matching is time-consuming and can never be perfect – participant variables remain (1)'
  ]);
  K('G', '2.3.10 Pilot studies', 'Explain', 3, 'Explain how a pilot study could be used to improve an observation.', [
    'A pilot study is a small-scale trial run of the investigation (1)',
    'It checks whether the behavioural categories are clear and cover all behaviours seen, and whether the procedure works (1)',
    'Problems (eg overlapping categories, low inter-observer agreement) can be corrected before the main study, saving time and money (1)'
  ]);
  K('G', '2.3.12 Observational design', 'Distinguish', 2, 'Distinguish between event sampling and time sampling.', [
    'Event sampling: a target behaviour/event is recorded every time it occurs (1)',
    'Time sampling: observations are recorded at fixed time intervals, eg every 30 seconds (1)'
  ]);
  K('G', '2.3.16 Demand characteristics & investigator effects', 'Explain', 3, 'Explain what is meant by investigator effects and how they could be reduced.', [
    'Investigator effects are any effect of the investigator’s behaviour (conscious or unconscious) on the research outcome (DV) (1)',
    'eg tone of voice, leading questions, how participants are selected or interpreted (1)',
    'Reduce with a double-blind procedure / standardised instructions (1)'
  ]);
  K('G', '2.3.17 Ethics', 'Explain', 4, 'Explain how a psychologist could deal with the ethical issue of deception.', [
    'Deception means deliberately misleading or withholding information so participants cannot give fully informed consent (1)',
    'A full debrief at the end should reveal the true aims, explain why deception was needed and offer the right to withdraw data (1)',
    'Alternatives: presumptive consent (asking a similar group if they would consent) or prior general consent (1)',
    'An ethics committee should carry out a cost-benefit analysis before approving the study (BPS Code of Ethics) (1)'
  ]);
  K('G', '2.3.18 Peer review', 'Outline', 3, 'Outline the role of peer review in the scientific process.', [
    'Independent experts in the same field assess research before it is published (1)',
    'They check validity/quality of the methods, appropriateness of statistics, and that conclusions follow from the data (1)',
    'This prevents fraudulent or poor-quality research entering the public domain and helps allocate research funding (1)'
  ]);
  K('G', '2.3.19 Psychology and the economy', 'Explain', 3, 'Explain one implication of psychological research for the economy.', [
    'Research into mental health treatments (eg CBT, SSRIs) helps people return to work more quickly (1)',
    'Mental illness costs the UK economy billions each year through absence (1)',
    'Effective treatments reduce absence and NHS costs, so the economy benefits (1)'
  ]);
  K('G', '2.3.20 Reliability', 'Explain', 4, 'Explain how test-retest reliability of a questionnaire could be assessed.', [
    'Give the same questionnaire to the same participants on two occasions (1)',
    'Allow enough time between (eg 2 weeks) so answers are not remembered but attitudes have not changed (1)',
    'Correlate the two sets of scores (1)',
    'A correlation of +0.80 or more indicates good reliability (1)'
  ]);
  K('G', '2.3.21 Validity', 'Distinguish', 2, 'Distinguish between concurrent validity and face validity.', [
    'Face validity: whether a test appears, on the surface, to measure what it claims to measure – judged by eyeballing/expert (1)',
    'Concurrent validity: comparing results with an established/well-recognised test of the same thing; a correlation above +0.80 indicates validity (1)'
  ]);
  K('G', '2.3.21 Validity', 'Outline', 2, 'Outline what is meant by temporal validity.', [
    'Temporal validity is whether findings from a study remain true over time (1)',
    'eg Asch’s conformity findings may reflect 1950s US culture (“a child of its time”) (1)'
  ]);
  K('G', '2.3.22 Features of science', 'Explain', 4, 'Explain what is meant by falsifiability and why it matters in science.', [
    'Popper: a scientific theory must be capable of being proved false (1)',
    'Theories should be tested using hypotheses that could be shown to be wrong (1)',
    'Theories that survive attempts to falsify them are the strongest – they are not proved true (1)',
    'Theories that cannot be falsified, eg Freud’s, are pseudoscience (1)'
  ]);
  K('G', '2.3.22 Features of science', 'Outline', 3, 'Outline what Kuhn meant by a paradigm shift.', [
    'A paradigm is a shared set of assumptions and methods within a discipline (1)',
    'Kuhn argued psychology lacks a universally accepted paradigm (pre-science) (1)',
    'A paradigm shift happens when contradictory evidence accumulates and a revolution replaces the old paradigm (eg Copernicus) (1)'
  ]);
  K('G', '2.3.23 Reporting investigations', 'Outline', 2, 'Outline the purpose of the abstract in a scientific report.', [
    'A short summary (150–200 words) at the start of the report including aims, hypotheses, method, results and conclusions (1)',
    'Readers can quickly decide whether the report is worth reading in full (1)'
  ]);
  K('G', '2.3.26 Descriptive statistics', 'Calculate', 2, 'Scores: 4, 7, 7, 8, 9, 12, 16. Calculate the mean. Show your workings. Give your answer to 1 decimal place.', [
    'Sum = 63; 63 ÷ 7 (1)',
    '= 9.0 (1)'
  ]);
  K('G', '2.3.26 Descriptive statistics', 'Calculate', 2, 'In a study of 80 participants, 28 conformed. Calculate the percentage who conformed.', [
    '28 ÷ 80 × 100 (1)',
    '= 35% (1)'
  ]);
  K('G', '2.3.26 Descriptive statistics', 'Explain', 3, 'Explain why the median may be a more appropriate measure of central tendency than the mean for a set of data.', [
    'The median is the middle value of an ordered data set (1)',
    'It is not affected by extreme scores/outliers (1)',
    'eg if one participant scored 95 and the others 10–20, the mean would be distorted but the median would represent the typical score (1)'
  ]);
  K('G', '2.3.26 Descriptive statistics', 'Explain', 2, 'Explain what a large standard deviation tells you about a set of scores.', [
    'Scores are widely spread around the mean (1)',
    'So not all participants were affected by the IV in the same way / there are large individual differences (1)'
  ]);
  K('G', '2.3.28 Distributions', 'Explain', 3, 'A distribution has a mean of 12, a median of 9 and a mode of 7. Identify the type of distribution and explain your answer.', [
    'Positively skewed distribution (1)',
    'Most scores cluster at the lower end with a long tail towards high scores (1)',
    'The mean is pulled towards the tail by a few high scores, so mean > median > mode (1)'
  ]);
  K('G', '2.3.30 Levels of measurement', 'Distinguish', 3, 'Distinguish between nominal, ordinal and interval data.', [
    'Nominal: data in separate categories, eg number of people choosing tea or coffee (1)',
    'Ordinal: data that can be ranked but intervals are not equal, eg ratings on a scale 1–10 (1)',
    'Interval: numerical data on a scale with equal, standardised units, eg time in seconds, temperature (1)'
  ]);
  K('G', '2.3.24 Quantitative & qualitative data', 'Explain', 2, 'Explain one strength and one limitation of qualitative data.', [
    'Strength: rich detail, gives insight into thoughts/feelings, higher external validity (1)',
    'Limitation: hard to analyse and compare; interpretation is subjective, leading to bias (1)'
  ]);
  K('G', '2.3.25 Primary & secondary data', 'Explain', 2, 'Explain what is meant by meta-analysis.', [
    'A statistical technique that combines the findings of several studies on the same topic (1)',
    'Producing an overall effect size; this increases the validity/generalisability of conclusions, but may suffer from publication bias (1)'
  ]);
  K('G', '2.3.32 The sign test', 'Calculate', 4, 'Twelve participants rated their mood before and after a mindfulness session. 9 had higher mood after, 2 had lower mood after and 1 had no change. Calculate S for a sign test and state whether the result is significant at p ≤ 0.05 (two-tailed; critical value for N = 11 is 1).', [
    'Remove the participant with no change, so N = 11 (1)',
    'Count the less frequent sign: 2 minus signs, so S = 2 (1)',
    'For significance S must be equal to or less than the critical value (1)',
    'S = 2 > 1, so the result is not significant – accept the null hypothesis (1)'
  ]);
  K('G', '2.3.34 Choosing a statistical test', 'Explain', 3, 'A researcher is studying the relationship between hours of sleep and scores on a memory test. Identify a suitable statistical test and justify your choice.', [
    'Pearson’s r (or Spearman’s rho if data treated as ordinal) (1)',
    'The study looks for a correlation/relationship between two co-variables (1)',
    'The data are interval – hours and test scores have equal units (if Spearman’s: ordinal) (1)'
  ]);
  K('G', '2.3.33 Probability & significance', 'Explain', 2, 'Explain what is meant by a Type I error.', [
    'A Type I error is a false positive – the null hypothesis is rejected when it is true (1)',
    'More likely when the significance level is too lenient, eg 10% (p ≤ 0.1) (1)'
  ]);
  K('G', '2.3.33 Probability & significance', 'Explain', 2, 'Explain why psychologists usually use the 5% level of significance.', [
    'p ≤ 0.05 means there is no more than a 5% probability the results occurred by chance (1)',
    'It balances the risk of Type I and Type II errors (1)'
  ]);
  KL('G', '2.3.22 Features of science', 'Discuss', 8, 'Discuss the features of science. Refer to psychology in your answer.', [
    'AO1: Empirical method, objectivity, replicability, falsifiability, theory construction and hypothesis testing, paradigms and shifts.',
    'AO3: Lab experiments give psychology scientific credibility (control, replicability).',
    'AO3: Some approaches are unfalsifiable (psychodynamic) or subjective (humanistic).',
    'AO3: Kuhn – psychology is pre-paradigmatic.',
    'AO3: Human behaviour is hard to measure objectively; demand characteristics; replication crisis (Open Science Collaboration, 2015: only 36% of 100 studies replicated).'
  ], 'AO1 = 3, AO3 = 5');

  M('G', '2.3.1 Experimental method', 'The variable that is measured in an experiment is the…', 'Dependent variable', ['Independent variable', 'Extraneous variable', 'Co-variable'], 'The IV is manipulated; the DV is measured.');
  M('G', '2.3.1 Experimental method', 'An experiment in a school where the researcher manipulates the IV is a…', 'Field experiment', ['Lab experiment', 'Natural experiment', 'Quasi-experiment'], 'Natural setting, IV manipulated by the researcher.');
  M('G', '2.3.2 Observational techniques', 'An observation where the researcher joins the group being studied is a…', 'Participant observation', ['Non-participant observation', 'Controlled observation', 'Overt observation'], 'May lose objectivity (“going native”).');
  M('G', '2.3.9 Sampling', 'Selecting every 10th name from a list is…', 'Systematic sampling', ['Random sampling', 'Stratified sampling', 'Opportunity sampling'], 'Every nth member of a sampling frame.');
  M('G', '2.3.11 Experimental designs', 'Which design is most affected by order effects?', 'Repeated measures', ['Independent groups', 'Matched pairs', 'Case study'], 'Same participants do all conditions.');
  M('G', '2.3.15 Control', 'Standardisation means…', 'Using the same procedures and instructions for all participants', ['Randomly allocating participants', 'Comparing results to a control group', 'Testing the same people twice'], 'Prevents differences in procedure affecting the DV.');
  M('G', '2.3.17 Ethics', 'Which is NOT one of the four principles of the BPS Code of Ethics?', 'Confidentiality', ['Respect', 'Competence', 'Integrity'], 'The four principles are respect, competence, responsibility and integrity.');
  M('G', '2.3.20 Reliability', 'Inter-observer reliability is usually accepted when the correlation is at least…', '+0.80', ['+0.50', '+0.05', '−0.80'], 'A strong positive correlation.');
  M('G', '2.3.23 Reporting investigations', 'Which section of a report describes the procedure so it can be replicated?', 'Method', ['Abstract', 'Introduction', 'Discussion'], 'Design, sample, materials, procedure, ethics.');
  M('G', '2.3.28 Distributions', 'In a negatively skewed distribution…', 'The mean is lower than the median', ['The mean is higher than the median', 'Mean, median and mode are equal', 'The mode is the lowest value'], 'The tail is towards low scores, pulling the mean down.');
  M('G', '2.3.27 Presentation of data', 'Which graph should be used for continuous data?', 'Histogram', ['Bar chart', 'Pie chart', 'Scattergram'], 'Bars touch; x-axis is a continuous scale.');
  M('G', '2.3.29 Correlation coefficients', 'Which correlation coefficient shows the strongest relationship?', '−0.87', ['+0.62', '+0.09', '−0.45'], 'Strength depends on distance from 0, not the sign.');
  M('G', '2.3.34 Choosing a statistical test', 'Which test is used for a difference, related design, ordinal data?', 'Wilcoxon', ['Mann-Whitney', 'Sign test', 'Spearman’s rho'], 'Related (RM/matched pairs) + ordinal = Wilcoxon.');
  M('G', '2.3.34 Choosing a statistical test', 'Which test is used for nominal data and an independent groups design?', 'Chi-Squared', ['Sign test', 'Mann-Whitney', 'Unrelated t-test'], 'Chi-Squared: nominal, independent data.');
  M('G', '2.3.33 Probability & significance', 'A Type II error is…', 'Accepting the null hypothesis when it is false', ['Rejecting the null hypothesis when it is true', 'Using the wrong statistical test', 'Using a directional hypothesis'], 'False negative – more likely with a strict level such as p ≤ 0.01.');
  M('G', '2.3.34 Choosing a statistical test', 'Which test is used for a correlation with interval data?', 'Pearson’s r', ['Spearman’s rho', 'Related t-test', 'Chi-Squared'], 'Parametric correlation test.');
  TF('G', '2.3.7 Aims', 'An aim is a precise, testable prediction.', false, 'That is a hypothesis. An aim is a general statement of purpose.');
  TF('G', '2.3.15 Control', 'Random allocation controls for participant variables in an independent groups design.', true, 'Each participant has an equal chance of being in each condition.');
  TF('G', '2.3.21 Validity', 'Ecological validity is about whether findings generalise to other settings.', true, 'A type of external validity.');
  TF('G', '2.3.32 The sign test', 'For the sign test, the calculated value must be less than or equal to the critical value to be significant.', true, 'S ≤ critical value → significant.');
  TF('G', '2.3.26 Descriptive statistics', 'The range is affected by extreme scores.', true, 'It uses only the highest and lowest values.');

  F('G', 'Lab experiment', 'Controlled setting, IV manipulated: high control/replicable; low ecological validity, demand characteristics.', '2.3.1 Experimental method');
  F('G', 'Field experiment', 'Natural setting, IV manipulated: higher mundane realism; less control, ethical issues (consent).', '2.3.1 Experimental method');
  F('G', 'Natural experiment', 'IV varies naturally (not manipulated by researcher); DV may be measured in a lab.', '2.3.1 Experimental method');
  F('G', 'Quasi-experiment', 'IV is an existing difference between people (age, gender); cannot be randomly allocated.', '2.3.1 Experimental method');
  F('G', 'Correlation', 'Relationship between two co-variables; positive, negative or zero; no cause and effect.', '2.3.4 Correlations');
  F('G', 'Content analysis', 'Indirect observation of artefacts (media, diaries) using coding categories → quantitative or thematic data.', '2.3.5 Content analysis');
  F('G', 'Directional hypothesis', 'Predicts the direction of a difference/relationship; used when past research suggests the outcome.', '2.3.8 Hypotheses');
  F('G', 'Opportunity sample', 'Whoever is willing and available: quick and easy; unrepresentative, researcher bias.', '2.3.9 Sampling');
  F('G', 'Random sample', 'Every member of the target population has an equal chance (lottery method): no researcher bias.', '2.3.9 Sampling');
  F('G', 'Independent groups', 'Different participants in each condition: no order effects; participant variables.', '2.3.11 Experimental designs');
  F('G', 'Repeated measures', 'Same participants in all conditions: no participant variables; order effects → counterbalance.', '2.3.11 Experimental designs');
  F('G', 'Operationalisation', 'Defining variables clearly so they can be measured, eg “memory” = number of words recalled out of 20.', '2.3.14 Variables');
  F('G', 'Demand characteristics', 'Cues that help participants guess the aim, so they change their behaviour (please-U / screw-U effect).', '2.3.16 Demand characteristics & investigator effects');
  F('G', 'Double-blind', 'Neither participants nor the person conducting the study know the aim/condition – reduces investigator effects and demand characteristics.', '2.3.16 Demand characteristics & investigator effects');
  F('G', 'Ethical issues', 'Informed consent, deception, protection from harm, privacy, confidentiality, right to withdraw (BPS Code).', '2.3.17 Ethics');
  F('G', 'Peer review', 'Independent experts assess research before publication: validates quality, prevents fraud, allocates funding.', '2.3.18 Peer review');
  F('G', 'Test-retest reliability', 'Same test, same people, later date; correlate scores; +0.80 = reliable.', '2.3.20 Reliability');
  F('G', 'Types of validity', 'Face, concurrent, ecological, temporal. Improve with control groups, single/double-blind, triangulation.', '2.3.21 Validity');
  F('G', 'Falsifiability', 'Popper: scientific theories must be open to being proved false.', '2.3.22 Features of science');
  F('G', 'Paradigm shift', 'Kuhn: a scientific revolution when evidence against the dominant paradigm builds up.', '2.3.22 Features of science');
  F('G', 'Measures of central tendency', 'Mean (all scores; distorted by extremes), median (middle), mode (most frequent).', '2.3.26 Descriptive statistics');
  F('G', 'Standard deviation', 'Average spread of scores around the mean; larger SD = more spread.', '2.3.26 Descriptive statistics');
  F('G', 'Skewed distributions', 'Positive skew: tail to the right, mean > median > mode. Negative skew: tail to the left, mean < median < mode.', '2.3.28 Distributions');
  F('G', 'Levels of measurement', 'Nominal (categories), ordinal (ranked), interval (equal units).', '2.3.30 Levels of measurement');
  F('G', 'Sign test', 'Difference, related design, nominal data. S = less frequent sign; significant if S ≤ critical value.', '2.3.32 The sign test');
  F('G', 'Choosing a test', 'Difference/relationship? Design? Level of data? eg independent + ordinal = Mann-Whitney; related + interval = related t-test.', '2.3.34 Choosing a statistical test');
  F('G', 'Type I / Type II error', 'Type I: false positive (lenient p, eg 10%). Type II: false negative (strict p, eg 1%).', '2.3.33 Probability & significance');

  K('G', '2.3.3 Self-report techniques', 'Explain', 4, 'Explain one strength and one limitation of using an unstructured interview rather than a structured interview.', [
    'Strength: the interviewer can ask follow-up questions and explore answers in depth, giving rich qualitative data (1)',
    'so the data have more validity – participants can explain their real views in their own words (1)',
    'Limitation: answers are hard to compare/analyse and interviewer bias is more likely in how questions are asked or answers interpreted (1)',
    'so the findings are less reliable and harder to replicate (1)'
  ]);
  K('G', '2.3.13 Questionnaire construction', 'Explain', 4, 'Explain two things a researcher should consider when writing questions for a questionnaire.', [
    'Avoid leading questions that suggest a desired answer (1) – they create bias so responses are not valid (1)',
    'Avoid jargon/complex terms and double-barrelled or double-negative questions (1) – participants may misunderstand, reducing validity (1)',
    'Use a mix of open questions (qualitative, detailed) and closed questions (quantitative, easy to analyse); use filler questions to hide the aim (1+1). Any two explained.'
  ]);
  K('G', '2.3.13 Questionnaire construction', 'Write', 2, 'Write one closed question and one open question a researcher could use to study revision habits.', [
    'Closed: a question with fixed responses, eg “How many hours did you revise last week? 0–2 / 3–5 / 6+” (1)',
    'Open: a question allowing participants to answer in their own words, eg “Describe how you usually plan your revision.” (1)'
  ]);
  K('G', '2.3.14 Variables', 'Identify', 2, 'A psychologist tests whether caffeine improves reaction time. Identify the operationalised independent and dependent variables.', [
    'IV: whether participants drink a coffee containing 100 mg of caffeine or a decaffeinated coffee (1)',
    'DV: reaction time in milliseconds to press a button when a light appears (1)'
  ]);
  K('G', '2.3.14 Variables', 'Explain', 3, 'Explain what is meant by an extraneous variable and how it could become a confounding variable.', [
    'An extraneous variable is any variable other than the IV that may affect the DV if not controlled (1)',
    'eg time of day, noise, participants’ age (1)',
    'It becomes a confounding variable if it varies systematically with the IV, so you cannot tell whether the IV or the confound caused the change in the DV (1)'
  ]);
  K('G', '2.3.31 Coding in content analysis', 'Explain', 4, 'Explain how coding and thematic analysis are used in content analysis.', [
    'Coding: the material is broken into categories (coding units), eg particular words or behaviours (1)',
    'The number of instances of each category is counted, producing quantitative data (1)',
    'Thematic analysis: recurring ideas (themes) are identified more descriptively after reading the material repeatedly (1)',
    'Themes are checked against new data and produce qualitative data (1)'
  ]);
  M('G', '2.3.3 Self-report techniques', 'An interview with a fixed set of questions asked in the same order is…', 'Structured', ['Unstructured', 'Semi-structured', 'Thematic'], 'Easy to replicate and compare.');
  M('G', '2.3.13 Questionnaire construction', 'A question asking participants to rate agreement from 1 (strongly disagree) to 5 (strongly agree) uses a…', 'Likert scale', ['Rating of open data', 'Fixed-choice nominal list', 'Thematic code'], 'Produces ordinal data.');
  M('G', '2.3.14 Variables', 'A variable that changes systematically with the IV is a…', 'Confounding variable', ['Dependent variable', 'Co-variable', 'Extraneous variable that was controlled'], 'Confounds threaten internal validity.');
  F('G', 'Structured vs unstructured interview', 'Structured: fixed questions in set order (comparable, less detail). Unstructured: conversation-like, follow-ups (rich, harder to analyse).', '2.3.3 Self-report techniques');
  F('G', 'Open vs closed questions', 'Open: answer in own words → qualitative. Closed: fixed choices → quantitative, easy to analyse.', '2.3.13 Questionnaire construction');
  F('G', 'Coding / thematic analysis', 'Coding: count categories → quantitative. Thematic: identify recurring themes → qualitative.', '2.3.31 Coding in content analysis');

/* ---- 08_H_issues_debates.js ---- */
  /* ===== H · 3.1 Issues and debates in Psychology (Paper 3 Section A) ===== */
  const H1 = '3.1.1 Gender and culture bias', H2 = '3.1.2 Free will and determinism', H3 = '3.1.3 Nature–nurture', H4 = '3.1.4 Holism and reductionism', H5 = '3.1.5 Idiographic and nomothetic', H6 = '3.1.6 Social sensitivity';

  K('H', H1, 'Distinguish', 4, 'Distinguish between alpha bias and beta bias. Give an example of each.', [
    'Alpha bias exaggerates/overestimates differences between men and women (1)',
    'eg Freud’s view that women have a weaker superego than men / sociobiology’s account of relationships (1)',
    'Beta bias ignores/minimises differences, assuming findings from men apply equally to women (1)',
    'eg fight-or-flight research mainly on male animals – Taylor et al. (2000) proposed tend-and-befriend in women (1)'
  ]);
  K('H', H1, 'Explain', 3, 'Explain what is meant by androcentrism.', [
    'Centring/basing understanding of behaviour on the male perspective (1)',
    'Male behaviour is treated as the norm/standard against which women are judged (1)',
    'So female behaviour that differs may be seen as abnormal or deficient, eg PMS framed as a disorder (1)'
  ]);
  K('H', H1, 'Explain', 4, 'Explain ethnocentrism and cultural relativism in psychology.', [
    'Ethnocentrism: judging other cultures by the standards and values of one’s own culture, assuming it is superior/normal (1)',
    'eg the Strange Situation’s assumption that independence = secure attachment (US norms) (1)',
    'Cultural relativism: behaviour can only be properly understood within the cultural context in which it occurs (1)',
    'Berry (1969) – imposed etic: using a technique from one culture (emic) to study another as if universal (1)'
  ]);
  K('H', H2, 'Distinguish', 4, 'Distinguish between hard determinism and soft determinism.', [
    'Hard determinism: all behaviour has causes outside our control – free will is an illusion (1)',
    'This is compatible with the scientific aim of finding causal explanations (1)',
    'Soft determinism (James): behaviour is constrained by internal/external factors but we still have some conscious control (1)',
    'eg we choose within a limited range of options – compatibilism (1)'
  ]);
  K('H', H2, 'Outline', 3, 'Outline biological, environmental and psychic determinism.', [
    'Biological determinism: behaviour is caused by biological factors such as genes, hormones, neurochemistry (1)',
    'Environmental determinism: behaviour is caused by previous experiences shaped through conditioning (Skinner) (1)',
    'Psychic determinism: behaviour is caused by unconscious conflicts and innate drives repressed in childhood (Freud) (1)'
  ]);
  K('H', H3, 'Explain', 4, 'Explain the interactionist approach to the nature–nurture debate.', [
    'Behaviour results from the interaction of heredity (nature) and environment (nurture); it is not possible to separate their influence (1)',
    'Diathesis-stress: a genetic vulnerability (diathesis) is triggered by an environmental stressor (1)',
    'Epigenetics: life experiences change gene expression without changing DNA, and can be passed on (1)',
    'eg schizophrenia: genetic vulnerability + family dysfunction / cannabis (1)'
  ]);
  K('H', H4, 'Outline', 4, 'Outline biological reductionism and environmental (stimulus-response) reductionism.', [
    'Reductionism breaks complex behaviour into simpler component parts (1)',
    'Biological reductionism: explains behaviour at the level of genes, neurons, hormones, eg OCD as low serotonin (1)',
    'Environmental reductionism: explains behaviour through stimulus-response links learned through conditioning (1)',
    'Levels of explanation: socio-cultural, psychological, physical/neurochemical – reductionists use the lowest level (1)'
  ]);
  K('H', H5, 'Distinguish', 4, 'Distinguish between the idiographic and nomothetic approaches.', [
    'Idiographic: focuses on the individual as unique, using qualitative methods such as case studies (1)',
    'eg Freud’s case of Little Hans; humanistic psychology (1)',
    'Nomothetic: studies large groups to establish general laws of behaviour, using quantitative methods such as experiments (1)',
    'eg Milgram’s research; behaviourist research (1)'
  ]);
  K('H', H6, 'Explain', 4, 'Explain what is meant by socially sensitive research. Refer to Sieber and Stanley’s concerns.', [
    'Research with potential social consequences for the participants or the group they represent (Sieber & Stanley, 1988) (1)',
    'Implications – may be used to justify discrimination, eg research into the genetics of intelligence (1)',
    'Uses/public policy – findings may be used by governments in ways not intended (1)',
    'Validity – historic research was sometimes biased/fraudulent (eg Burt) yet influenced policy (1)'
  ]);
  KL('H', H2, 'Discuss', 16, 'Discuss the free will and determinism debate in psychology.', [
    'AO1: Free will – humanistic psychology; hard vs soft determinism; biological, environmental and psychic determinism; scientific emphasis on causal explanations.',
    'AO3: Free will has face validity – we feel we make choices; Roberts et al. (1992): adolescents with a strong external locus of control (fatalistic) were more at risk of depression.',
    'AO3: Libet et al. (1983): brain activity preceded conscious decision by about 0.5 s – free will may be an illusion; Soon et al. (2008) up to 10 s.',
    'AO3: Hard determinism is unfalsifiable (cannot establish causes of everything) and conflicts with the legal system (moral responsibility).',
    'AO3: Scientific emphasis on causes gives credibility – lab experiments, prediction and control.',
    'AO3: Soft determinism as a compromise; interactionist view.',
    'AO3: Applications – determinism supports therapies such as drug treatment; free will supports therapies that put the client in control (humanistic, CBT).'
  ], 'AO1 = 6, AO3 = 10');
  KL('H', H1, 'Discuss', 16, 'Discuss cultural bias in psychology.', [
    'AO1: Universality; ethnocentrism; cultural relativism; etic and emic approaches; imposed etic; individualist vs collectivist cultures.',
    'AO3: Examples – Asch: Bond & Smith (1996) higher conformity in collectivist cultures; the Strange Situation as imposed etic.',
    'AO3: Individualism–collectivism distinction may be outdated – Takano & Osaka (1999): 14 of 15 US–Japan studies found no difference.',
    'AO3: Cultural relativism vs universality – some behaviours (facial expressions of emotion: Ekman) are universal.',
    'AO3: Unlocking the past – modern cultural psychology uses emic approaches/indigenous researchers.',
    'AO3: Cross-cultural research – challenges Western assumptions but may have problems: interpreters, demand characteristics.'
  ], 'AO1 = 6, AO3 = 10');

  M('H', H1, 'Using a technique developed in one culture to study another as if it were universal is…', 'An imposed etic', ['An emic approach', 'Cultural relativism', 'Beta bias'], 'Berry (1969).');
  M('H', H1, 'Research that ignores differences between men and women shows…', 'Beta bias', ['Alpha bias', 'Androcentrism only', 'Cultural relativism'], 'Beta bias minimises differences.');
  M('H', H2, 'Which type of determinism did Freud propose?', 'Psychic', ['Biological', 'Environmental', 'Soft'], 'Unconscious conflicts determine behaviour.');
  M('H', H3, 'A heritability coefficient of 0.0 means…', 'Genes have no influence on individual differences', ['A trait is entirely genetic', 'Genes and environment are equal', 'The trait cannot be measured'], '0 = no genetic influence; 1.0 = entirely genetic.');
  M('H', H4, 'Explaining aggression as caused by high testosterone is an example of…', 'Biological reductionism', ['Holism', 'Environmental reductionism', 'Idiographic research'], 'Reduced to hormone levels.');
  M('H', H5, 'Which method is most associated with the idiographic approach?', 'Case study', ['Laboratory experiment', 'Meta-analysis', 'Correlation with 1,000 participants'], 'In-depth focus on the individual.');
  M('H', H6, 'According to Sieber & Stanley, which is a key concern about socially sensitive research?', 'How findings may be used by policy-makers', ['The cost of the equipment', 'The length of the debrief', 'The use of interval data'], 'Uses/public policy.');
  TF('H', H2, 'Soft determinism suggests we have no free will at all.', false, 'That is hard determinism.');
  TF('H', H3, 'Epigenetics refers to changes in gene expression caused by experience, without changes to DNA.', true, 'An interactionist idea.');
  TF('H', H4, 'Holism argues the whole is greater than the sum of its parts.', true, 'eg Gestalt psychology, humanism.');

  F('H', 'Universality', 'A characteristic that applies to all people regardless of gender or culture.', H1);
  F('H', 'Alpha bias / Beta bias', 'Alpha exaggerates gender differences; beta minimises or ignores them.', H1);
  F('H', 'Androcentrism', 'Male-centred: male behaviour treated as the norm.', H1);
  F('H', 'Ethnocentrism', 'Judging other cultures by the standards of your own culture.', H1);
  F('H', 'Cultural relativism', 'Behaviour can only be understood within its cultural context.', H1);
  F('H', 'Hard vs soft determinism', 'Hard: all behaviour is caused, no free will. Soft: behaviour is constrained but some free choice remains.', H2);
  F('H', 'Nature–nurture', 'Heredity (genes) vs environment (experience); interactionist approach and diathesis-stress combine them.', H3);
  F('H', 'Holism / reductionism', 'Holism: study the whole person. Reductionism: break behaviour into its simplest parts (biological/environmental).', H4);
  F('H', 'Idiographic / nomothetic', 'Idiographic: the unique individual, qualitative. Nomothetic: general laws, quantitative.', H5);
  F('H', 'Social sensitivity', 'Research with potential social consequences for participants or the group they represent (Sieber & Stanley, 1988).', H6);

/* ---- 09_IJK_option1.js ---- */
  /* ===== Paper 3 Option 1 (Section B): I Relationships · J Gender · K Cognition and development ===== */
  const I1 = '3.2.1 Attraction', I2 = '3.2.2 Theories of relationships', I3 = '3.2.3 Online relationships', I4 = '3.2.4 Parasocial relationships';
  const J1 = '3.3.1 Chromosomes, hormones & diversity in sex development', J2 = '3.3.2 Gender identities & BSRI', J3 = '3.3.3 Biological explanations', J4 = '3.3.4 Cognitive explanations', J5 = '3.3.5 Social learning, culture & media', J6 = '3.3.6 Gender incongruence';
  const K1 = '3.1 Piaget', K2 = '3.2 Vygotsky', K3 = '3.3 Baillargeon', K4 = '3.4 Social cognition';

  /* --- I Relationships --- */
  K('I', I1, 'Outline', 4, 'Outline filter theory as an explanation of attraction.', [
    'Kerckhoff & Davis (1962): we use a series of filters to narrow down the “field of availables” to a “field of desirables” (1)',
    'Social demography – we are most likely to meet people who are similar in location, class, education (1)',
    'Similarity in attitudes – important early in relationships; partners who share values feel closer (1)',
    'Complementarity – later, partners who meet each other’s needs (eg one dominant, one submissive) are more likely to last (1)'
  ]);
  K('I', I1, 'Explain', 3, 'Explain the matching hypothesis.', [
    'Walster et al. (1966): people seek partners of similar physical attractiveness to themselves (1)',
    'We assess our own “value” and seek a partner whose value is similar, to maximise chance of success and avoid rejection (1)',
    'Matching is a compromise – a balance between desire for the most attractive partner and avoiding rejection (1)'
  ]);
  K('I', I2, 'Outline', 4, 'Outline Rusbult’s investment model of relationships.', [
    'Commitment depends on three factors: satisfaction, comparison with alternatives and investment size (1)',
    'Satisfaction – based on the comparison level: more rewards than costs (1)',
    'Comparison with alternatives – if alternatives are less attractive, commitment is higher (1)',
    'Investment – intrinsic (time, emotional energy) and extrinsic (shared friends, home, children) resources that would be lost (1)'
  ]);
  K('I', I2, 'Outline', 4, 'Outline Duck’s phase model of relationship breakdown.', [
    'Intra-psychic phase – brooding privately on dissatisfaction, “I can’t stand this any more” (1)',
    'Dyadic phase – discussing dissatisfaction with the partner, “I’d be justified in withdrawing” (1)',
    'Social phase – the breakdown is made public, friends take sides, “I mean it” (1)',
    'Grave-dressing phase – creating a favourable story of the breakup to protect self-esteem, “It’s now inevitable” (1)'
  ]);
  K('I', I3, 'Explain', 4, 'Explain how the absence of gating affects online relationships.', [
    'Gates are obstacles to forming a relationship, eg physical appearance, shyness, stammer (1)',
    'Online, gates are absent so people can focus on self-disclosure and shared interests (1)',
    'This may lead to more authentic relationships for people who would otherwise be screened out (1)',
    'People can create an idealised identity (deception) which could cause problems if they meet (1)'
  ]);
  K('I', I4, 'Outline', 3, 'Outline the levels of parasocial relationships.', [
    'Entertainment-social – celebrities seen as a source of entertainment and gossip (1)',
    'Intense-personal – a deeper level with compulsive feelings about the celebrity (1)',
    'Borderline-pathological – uncontrollable fantasies and extreme behaviours (McCutcheon et al., 2002 – Celebrity Attitude Scale) (1)'
  ]);
  KL('I', I2, 'Discuss', 16, 'Discuss social exchange theory and equity theory as explanations of romantic relationships.', [
    'AO1: SET (Thibaut & Kelley, 1959) – minimax principle, rewards and costs, comparison level (CL), comparison level for alternatives (CLalt), four stages.',
    'AO1: Equity theory (Walster et al., 1978) – fairness; under- and over-benefited partners dissatisfied; ratio of inputs/outputs, not size; consequences of inequity.',
    'AO3: SET is economic and assumes selfishness – Clark & Mills (1979): communal vs exchange relationships.',
    'AO3: Direction of cause – dissatisfaction may cause people to notice costs (Argyle, 1987).',
    'AO3: Equity support – Utne et al. (1984): equity was correlated with satisfaction in married couples.',
    'AO3: Cultural differences – Aumer-Ryan et al. (2007): equity linked to satisfaction in all cultures, but in non-US cultures over-benefited partners were most satisfied.',
    'AO3: Individual differences – Huseman et al. (1987): benevolents vs entitleds.'
  ], 'AO1 = 6, AO3 = 10');
  KL('I', I4, 'Evaluate', 8, 'Evaluate the absorption-addiction model of parasocial relationships.', [
    'AO1: McCutcheon (2002) – absorption (focusing on the celebrity) and addiction (needing stronger involvement) in people with a deficient identity.',
    'AO3: Supporting evidence – Maltby et al. (2005): intense-personal level linked to poor body image in teenage girls.',
    'AO3: Correlational research – cannot establish that absorption causes the PSR.',
    'AO3: Describes rather than explains how PSRs develop.',
    'AO3: Self-report – social desirability bias; Celebrity Attitude Scale validity.'
  ], 'AO1 = 3, AO3 = 5');
  M('I', I1, 'The gradual revealing of personal information in a relationship is…', 'Self-disclosure', ['Complementarity', 'Gating', 'Grave dressing'], 'Altman & Taylor’s social penetration theory.');
  M('I', I2, 'In SET, CLalt refers to…', 'Comparison with possible alternative relationships', ['The total costs of a relationship', 'How equal a relationship is', 'Investment size'], 'Comparison level for alternatives.');
  M('I', I2, 'In Duck’s model, the phase where friends take sides is…', 'Social', ['Intra-psychic', 'Dyadic', 'Grave-dressing'], 'The breakdown goes public.');
  M('I', I3, 'Reducing cues theory suggests online communication…', 'Lacks non-verbal cues, so leads to deindividuation', ['Has more cues than face-to-face', 'Always increases honesty', 'Removes self-disclosure'], 'Sproull & Kiesler (1986).');
  M('I', I4, 'The attachment theory explanation of PSRs links them to…', 'Insecure-resistant attachment', ['Secure attachment', 'Insecure-avoidant attachment only', 'Disinhibited attachment'], 'Cole & Leets (1999): insecure-resistant individuals were most likely to form PSRs – an unthreatening relationship with no risk of rejection.');
  TF('I', I2, 'Equity theory states that the partner who is over-benefited may feel guilt.', true, 'Both under- and over-benefited partners are dissatisfied.');
  TF('I', I1, 'Complementarity is the first filter in Kerckhoff & Davis’s theory.', false, 'Social demography first, then similarity in attitudes, then complementarity.');
  F('I', 'Self-disclosure', 'Revealing personal information; depth and breadth increase (social penetration theory).', I1);
  F('I', 'Matching hypothesis', 'Walster: we seek partners of similar attractiveness to ourselves.', I1);
  F('I', 'Filter theory', 'Kerckhoff & Davis: social demography → similarity in attitudes → complementarity.', I1);
  F('I', 'Social exchange theory', 'Thibaut & Kelley: minimax principle; profit; CL and CLalt.', I2);
  F('I', 'Equity theory', 'Walster et al.: satisfaction depends on fairness, not maximising profit.', I2);
  F('I', 'Investment model', 'Rusbult: commitment = satisfaction + comparison with alternatives + investment.', I2);
  F('I', 'Duck’s phase model', 'Intra-psychic → dyadic → social → grave-dressing.', I2);
  F('I', 'Gating', 'Obstacles to relationships (looks, shyness). Absent online.', I3);
  F('I', 'Parasocial relationship', 'One-sided relationship with a celebrity; entertainment-social, intense-personal, borderline-pathological.', I4);
  F('I', 'Absorption-addiction model', 'McCutcheon: PSRs develop from absorption in the celebrity and an addiction-like need for stronger involvement.', I4);

  /* --- J Gender (updated specification content) --- */
  K('J', J1, 'Outline', 4, 'Outline the role of chromosomes and hormones in biological sex.', [
    'Chromosomes: biological sex is typically determined by the 23rd pair – XX (typically female) or XY (typically male); the SRY gene on the Y chromosome triggers testis development (1)',
    'Testosterone (from the testes) controls development of male sex organs from around 8 weeks and is linked to aggression (1)',
    'Oestrogen controls female characteristics and menstruation; fluctuations linked to premenstrual tension (1)',
    'Oxytocin stimulates lactation and bonding; levels are higher in women, which may explain differences in social bonding (1)'
  ]);
  K('J', J1, 'Describe', 4, 'Describe two conditions that show diversity in sex development.', [
    'Klinefelter’s syndrome: XXY chromosomes; body hair reduced, breast development, long limbs, language difficulties, poor problem-solving (1+1)',
    'Turner syndrome: X0 (one X chromosome); no menstrual cycle, broad chest, low-set ears, webbed neck; higher reading ability but poor spatial/maths (1+1)',
    'Androgen insensitivity syndrome: XY chromosomes but body cells do not respond to androgens, so external female genitalia develop (1+1)',
    'Credit any two conditions described.'
  ]);
  K('J', J2, 'Outline', 4, 'Outline the Bem Sex Role Inventory as a measure of gender.', [
    'Bem (1974): 60 characteristics – 20 masculine, 20 feminine, 20 neutral (1)',
    'Respondents rate themselves on a 7-point scale for each characteristic (1)',
    'Scores are placed on two dimensions – masculinity and femininity (1)',
    'Classifies people as masculine, feminine, androgynous (high on both) or undifferentiated (low on both) (1)'
  ]);
  K('J', J2, 'Distinguish', 3, 'Distinguish between binary, non-binary and gender-fluid identities.', [
    'Binary gender identity: identifying as one of two genders, man or woman (1)',
    'Non-binary: a gender identity outside the man/woman binary, eg neither, both, or somewhere between (1)',
    'Gender-fluid: a gender identity that changes over time or between situations (1)'
  ]);
  K('J', J4, 'Outline', 3, 'Outline Kohlberg’s stages of gender development.', [
    'Gender identity (around 2 years): the child can correctly label their own and others’ gender (1)',
    'Gender stability (around 4 years): the child realises their gender stays the same over time, but may be confused by changes in appearance (1)',
    'Gender constancy (around 6 years): the child realises gender is consistent across situations and seeks out same-gender role models (1)'
  ]);
  K('J', J4, 'Explain', 4, 'Explain gender schema theory.', [
    'Martin & Halverson (1981): children actively structure their learning about gender through gender schemas (1)',
    'Gender identity (around 2–3 years) is enough for children to start seeking information about their gender – not constancy (1)',
    'Children focus on in-group schemas (own gender) and show in-group favouritism (1)',
    'Schemas become rigid; information that contradicts them is ignored or distorted (Martin & Halverson, 1983) (1)'
  ]);
  K('J', J5, 'Explain', 4, 'Explain how the media can influence gender roles.', [
    'Media provide models of gender-appropriate behaviour that children may imitate (SLT) (1)',
    'Males are often shown as independent and in professional roles; females as dependent/domestic (1)',
    'Vicarious reinforcement – seeing gender-typical characters rewarded encourages imitation (1)',
    'Furnham & Farragher (2000): men in TV adverts more likely to be in autonomous roles, women in familial roles (1)'
  ]);
  K('J', J6, 'Outline', 4, 'Outline biological and social/cultural explanations of gender incongruence.', [
    'Gender incongruence: a marked mismatch between a person’s experienced gender and their sex assigned at birth (ICD-11 term) (1)',
    'Biological: brain-sex theory – eg the BSTc in the hypothalamus of transgender women may be closer in size to that of cisgender women (Zhou et al., 1995) (1)',
    'Biological: genetic/hormonal factors – eg Hare et al. (2009) found an association with longer androgen-receptor gene variants (1)',
    'Social/cultural: experiences, expectations and cultural acceptance of gender diversity influence how gender identity is expressed, eg different recognised genders in some cultures (1)'
  ]);
  KL('J', J4, 'Discuss', 16, 'Discuss cognitive explanations of gender development.', [
    'AO1: Kohlberg – identity, stability, constancy; children actively construct understanding; learning occurs after constancy.',
    'AO1: Martin & Halverson’s gender schema theory – identity is enough; in-group/out-group schemas; rigid thinking.',
    'AO3: Kohlberg support – Slaby & Frey (1975): children high in constancy watched same-gender models more.',
    'AO3: Kohlberg challenge – gender-typed behaviour appears long before constancy (Bussey & Bandura, 1992).',
    'AO3: GST support – Martin & Little (1990): children under 4 showed gender stereotypes but no stability/constancy.',
    'AO3: GST explains rigid stereotypes; but is about schemas not why they develop.',
    'AO3: Cognitive explanations underplay social and cultural factors; do not explain non-binary or fluid identities well.',
    'AO3: Methodological issues – interviewing young children may lack validity.'
  ], 'AO1 = 6, AO3 = 10');
  KL('J', J3, 'Evaluate', 8, 'Evaluate biological explanations of gender development.', [
    'AO1 (brief): chromosomes, SRY gene, testosterone, oestrogen, oxytocin; brain-organisation effects of prenatal hormones.',
    'AO3: Supporting evidence – Van Goozen et al. (1995) transgender people given hormones showed changes in aggression and spatial ability.',
    'AO3: Contradictory evidence – David Reimer case: biological sex outweighed socialisation.',
    'AO3: Biological reductionism – ignores social learning and culture; deterministic.',
    'AO3: Diversity in sex development (eg AIS) shows hormones and chromosomes do not always align with gender identity.'
  ], 'AO1 = 3, AO3 = 5');
  M('J', J1, 'Which condition involves XY chromosomes but body cells that do not respond to androgens?', 'Androgen insensitivity syndrome', ['Turner syndrome', 'Klinefelter’s syndrome', 'Gender incongruence'], 'AIS: XY, external female characteristics.');
  M('J', J1, 'Turner syndrome is caused by…', 'One X chromosome missing (X0)', ['An extra X chromosome (XXY)', 'An extra Y chromosome', 'Insensitivity to androgens'], 'Affects biological females.');
  M('J', J2, 'On the BSRI, someone high in both masculine and feminine traits is…', 'Androgynous', ['Undifferentiated', 'Gender-fluid', 'Non-binary'], 'Bem saw androgyny as psychologically healthy.');
  M('J', J4, 'According to Kohlberg, at which stage do children seek out same-gender role models?', 'Gender constancy', ['Gender identity', 'Gender stability', 'Gender schema'], 'About 6 years.');
  M('J', J5, 'Which researchers studied gender roles in different cultures (eg Tchambuli)?', 'Mead (1935)', ['Bem (1974)', 'Kohlberg (1966)', 'Martin & Halverson (1981)'], 'Arapesh, Mundugumor and Tchambuli.');
  TF('J', J4, 'Gender schema theory argues children only start learning about gender after gender constancy.', false, 'GST says gender identity (2–3 years) is enough.');
  TF('J', J1, 'Oxytocin is linked to lactation and social bonding.', true, 'Released in larger amounts in women.');
  F('J', 'Sex vs gender', 'Sex: biological status (chromosomes, hormones, anatomy). Gender: psychological/social sense of identity and roles.', J1);
  F('J', 'Klinefelter’s syndrome', 'XXY: reduced body hair, breast development, poor language and problem-solving skills.', J1);
  F('J', 'Turner syndrome', 'X0: no periods, webbed neck, broad chest; good reading but poorer spatial/maths.', J1);
  F('J', 'Androgen insensitivity syndrome', 'XY but tissues cannot respond to androgens → female external characteristics.', J1);
  F('J', 'Non-binary', 'A gender identity not exclusively man or woman.', J2);
  F('J', 'Gender-fluid', 'A gender identity that changes over time or between contexts.', J2);
  F('J', 'Bem Sex Role Inventory', '60 traits, 7-point scale: masculine, feminine, androgynous, undifferentiated.', J2);
  F('J', 'Kohlberg’s stages', 'Identity (2) → stability (4) → constancy (6).', J4);
  F('J', 'Gender schema theory', 'Martin & Halverson: identity is enough to start; in-group schemas; rigid stereotypes.', J4);
  F('J', 'Gender incongruence', 'A marked mismatch between experienced gender and sex assigned at birth (ICD-11).', J6);

  /* --- K Cognition and development --- */
  K('K', K1, 'Explain', 4, 'Explain the roles of assimilation, accommodation and equilibration in Piaget’s theory.', [
    'Assimilation: new information is fitted into an existing schema without changing it (1)',
    'Accommodation: existing schemas are changed, or new ones created, to fit new information (1)',
    'Disequilibrium is the unpleasant state when existing schemas cannot deal with new information (1)',
    'Equilibration is the drive to restore balance by assimilating or accommodating (1)'
  ]);
  K('K', K1, 'Outline', 4, 'Outline Piaget’s pre-operational stage.', [
    'Age 2–7 years (1)',
    'Egocentrism – the child sees the world only from their own perspective (three mountains task) (1)',
    'Lack of conservation – does not understand that quantity stays the same when appearance changes (1)',
    'Lack of class inclusion – struggles to see that a class can include subclasses (eg dogs and animals) (1)'
  ]);
  K('K', K2, 'Explain', 4, 'Explain the zone of proximal development and scaffolding.', [
    'The ZPD is the gap between what a child can achieve alone and what they can achieve with help from a more knowledgeable other (MKO) (1)',
    'Learning happens in the ZPD through social interaction (1)',
    'Scaffolding: the MKO provides support that is gradually reduced as the child becomes more competent (Wood et al., 1976) (1)',
    'eg recruiting interest, reducing degrees of freedom, direction maintenance, marking critical features, frustration control, demonstration (1)'
  ]);
  K('K', K3, 'Outline', 4, 'Outline Baillargeon’s violation of expectation research.', [
    'Infants look longer at events that are surprising/impossible – a violation of expectation (1)',
    'Baillargeon & DeVos (1991): 3½-month-olds watched short and tall carrots move behind a screen with a window (1)',
    'The tall carrot should have appeared in the window but did not (impossible event) (1)',
    'Infants looked longer at the impossible event – suggesting knowledge of object permanence much earlier than Piaget claimed (1)'
  ]);
  K('K', K4, 'Outline', 4, 'Outline the Sally-Anne study as a test of theory of mind.', [
    'Baron-Cohen et al. (1985) tested autistic children, children with Down’s syndrome and typically developing children (1)',
    'Sally puts a marble in her basket and leaves; Anne moves it to her box (1)',
    'Children were asked “Where will Sally look for her marble?” – a false-belief task (1)',
    '85% of typically developing and 86% of Down’s syndrome children answered correctly vs 20% of autistic children (1)'
  ]);
  K('K', K4, 'Explain', 3, 'Explain the role of the mirror neuron system in social cognition.', [
    'Mirror neurons fire both when we perform an action and when we watch someone else perform it (Rizzolatti, 1990s – macaque monkeys) (1)',
    'They may allow us to understand others’ intentions and emotions (1)',
    'This may underlie empathy, perspective-taking and theory of mind; deficits may be linked to autism (broken mirror theory) (1)'
  ]);
  KL('K', K1, 'Discuss', 16, 'Discuss Piaget’s theory of cognitive development.', [
    'AO1: Schemas, assimilation, accommodation, equilibration; four stages – sensorimotor (object permanence), pre-operational (egocentrism, conservation, class inclusion), concrete operational, formal operational.',
    'AO3: Supporting evidence – Howe et al. (1992): children learned more from interacting with peers (discovery) about motion.',
    'AO3: Underestimates children – Hughes (1975) policeman doll: 90% of 3½–5-year-olds hid the boy correctly; McGarrigle & Donaldson (1974) naughty teddy.',
    'AO3: Baillargeon – object permanence by 3 months, contradicting Piaget.',
    'AO3: Underplays social/cultural influences – Vygotsky; formal operations not universal (Dasen, 1994).',
    'AO3: Applications to education – discovery learning, readiness.'
  ], 'AO1 = 6, AO3 = 10');
  KL('K', K2, 'Evaluate', 8, 'Evaluate Vygotsky’s theory of cognitive development.', [
    'AO1 (brief): culture and social interaction, MKO, ZPD, scaffolding, semiotics.',
    'AO3: Support – Wood & Middleton (1975): mothers scaffolded block-building; contingent help most effective.',
    'AO3: Applications – peer tutoring, guided learning in schools.',
    'AO3: Underestimates biological factors (eg individual differences in learning ability).',
    'AO3: Hard to test some concepts precisely; relies on observation.'
  ], 'AO1 = 3, AO3 = 5');
  M('K', K1, 'A child who understands that a ball of clay rolled into a sausage has the same amount of clay shows…', 'Conservation', ['Egocentrism', 'Object permanence', 'Class inclusion'], 'Usually achieved in the concrete operational stage.');
  M('K', K1, 'Object permanence develops during which stage?', 'Sensorimotor', ['Pre-operational', 'Concrete operational', 'Formal operational'], 'Piaget: about 8 months.');
  M('K', K2, 'The support given by an MKO that is gradually withdrawn is…', 'Scaffolding', ['Equilibration', 'Accommodation', 'Perspective-taking'], 'Wood, Bruner & Ross (1976).');
  M('K', K4, 'Selman’s level where a child understands that others think about their thinking is…', 'Self-reflective (level 2)', ['Undifferentiated (level 0)', 'Social-informational (level 1)', 'Societal (level 4)'], 'Selman (1971) – five levels 0–4.');
  M('K', K3, 'Baillargeon’s technique relies on infants…', 'Looking longer at surprising events', ['Reaching for hidden objects', 'Answering questions', 'Pointing at correct answers'], 'Violation of expectation.');
  TF('K', K4, 'In the Sally-Anne study, most autistic children failed the false-belief task.', true, 'Only 20% passed.');
  TF('K', K1, 'Piaget proposed four stages that occur in a fixed, invariant order.', true, 'Sensorimotor → pre-operational → concrete → formal.');
  F('K', 'Schema (Piaget)', 'A mental structure containing all the information about one aspect of the world.', K1);
  F('K', 'Piaget’s stages', 'Sensorimotor (0–2), pre-operational (2–7), concrete operational (7–11), formal operational (11+).', K1);
  F('K', 'Egocentrism', 'Seeing the world only from your own point of view (three mountains task).', K1);
  F('K', 'Zone of proximal development', 'Gap between what a child can do alone and with help from an MKO.', K2);
  F('K', 'Violation of expectation', 'Baillargeon: longer looking at impossible events shows infants have physical-world knowledge.', K3);
  F('K', 'Theory of mind', 'Understanding that others have their own beliefs, intentions and emotions (Sally-Anne false-belief task).', K4);
  F('K', 'Selman’s levels', 'Perspective-taking: 0 undifferentiated, 1 social-informational, 2 self-reflective, 3 third-party, 4 societal.', K4);
  F('K', 'Mirror neurons', 'Fire when performing or observing an action; linked to empathy and ToM.', K4);

/* ---- 10_LMN_option2.js ---- */
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

/* ---- 11_OPQ_option3.js ---- */
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

/* ---- 99_tail.js ---- */
})();

