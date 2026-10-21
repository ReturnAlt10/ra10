/* BTEC Business Unit 6 — Principles of Management (31588H). Assessment-focus grids from the Pearson mark schemes (June 2024).
   Each activity (44 marks) has four AFs: data analysis (12), key principles (12), alternative approaches (12), structure (8). */
(function () {
  'use strict';
  const band = (b, marks, descriptor) => ({ band: b, marks, descriptor });
  const mk = (id, n) => ({
    data: { id: 'AF' + id, name: 'Information/data analysis and interpretation', max: 12,
      look: 'Selective, accurate use of the case study text AND the figures (tables): what they show, trends, and what the data means for the business goals.',
      bands: [band(1, '1–3', 'References to the case study lack detail and relevance; analytical approach limited; conclusions generic.'), band(2, '4–6', 'References lack direct relevance in places; analysis leads to conclusions that may lack balance or relevance.'), band(3, '7–9', 'Relevant references to the case study; detailed analytical approach leading to relevant, balanced conclusions.'), band(4, '10–12', 'Sustained, entirely relevant references; detailed analysis leading to entirely relevant, balanced conclusions.')] },
    prin: { id: 'AF' + (id + 1), name: 'Key principles of management', max: 12,
      look: 'Management/leadership principles and theories from the specification (e.g. styles, Maslow/Herzberg, quality tools, culture models) applied to THIS business, rationalised and linked to its goals.',
      bands: [band(1, '1–3', 'Some key management principles but little development or explanation relevant to the context.'), band(2, '4–6', 'Relevant principles with development/explanation relevant to context and business goals.'), band(3, '7–9', 'Relevant principles with clear linkage to context and business goals.'), band(4, '10–12', 'Comprehensive coverage of relevant, rationalised key management principles in context and linked to business goals.')] },
    alt: { id: 'AF' + (id + 2), name: 'Suggested alternative management approaches', max: 12,
      look: 'Specific, realistic recommendations (what, who, how, when) for THIS business, each justified against its goals with balance (benefits, drawbacks, cost/time).',
      bands: [band(1, '1–3', 'Suggested approaches generic and/or unrealistic; justifications limited in the context of business goals.'), band(2, '4–6', 'Appropriate approaches but occasionally generic/unrealistic; justifications provided and generally in context of goals.'), band(3, '7–9', 'Appropriate approaches applied mostly in context; justifications mostly balanced and in the context of goals.'), band(4, '10–12', 'Entirely appropriate approaches applied in context; balanced justification in the context of business goals.')] },
    struct: { id: 'AF' + (id + 3), name: n === 1 ? 'Structure/presentation (report)' : 'Structure/presentation (slides and speaker notes)', max: 8,
      look: n === 1 ? 'Report structure: introduction, scene-setting, issues and solutions, recommendations, conclusion; accurate management terminology; no communication errors.' : 'A clear slide structure with speaker notes/script that engages the owners; accurate terminology; no communication errors.',
      bands: [band(1, '1–2', 'Lacks structure; isolated references to principles; many communication errors; generic terminology.'), band(2, '3–4', 'Basic structure; attempts to apply principles; occasional communication errors; some appropriate terminology.'), band(3, '5–6', 'Logical structure; applies a variety of principles; few communication errors; relevant terminology.'), band(4, '7–8', 'Well written/logical structure; applies a variety of principles; no communication errors; terminology throughout.')] }
  });
  const g1 = mk(1, 1), g2 = mk(5, 2);
  const RULES = [['F', /quality|iso\b|bsi|kaizen|lean|six sigma|zero defect|inspection|audit/i], ['E', /change|restructur|merger|resistance|lewin|kotter/i], ['D', /motivat|train|appraisal|development|reward|engagement|staff performance/i], ['C', /human resource|recruit|hr\b|turnover|workforce plan|agency|zero hours|retention|labour/i], ['B', /leadership|management style|style|leader|skills/i], ['A', /culture|function|role of management|vision|mission/i]];
  window.BIZ_UNIT = {
    n: 6, key: 'bus_u6', code: '31588H', name: 'Principles of Management', kind: 'set', total: 88, minutes: 180,
    timeLabel: '3 hours (Part B)', aims: ['A', 'B', 'C', 'D', 'E', 'F'],
    partsLabel: 'Part A (set task information) and Part B (set task)',
    partALabel: 'Part A — Set task information',
    partANote: 'In the real assessment Part A is released about a week before Part B (approximately six hours of preparation). You may NOT take notes into Part B. Part B is a 3-hour supervised session on a computer: a word-processed report (size 12 font) and a presentation with speaker notes.',
    instructions: [
      ['Instructions', ['Complete both activities.', 'Part A will have been used in preparation for completion of Part B.', 'You may use a calculator, note paper and pen. You may not bring notes into Part B.']],
      ['Information', ['The total mark for this paper is {total}.', 'Activity 1 and Activity 2 are each worth 44 marks.']],
      ['Advice', ['Refer to the figures and the text in the Part A set task information.', 'Recommend specific actions that link to the business’s goals.', 'Plan your time: roughly 85 minutes per activity.']]
    ],
    howto: ['Open a paper and read the Part A case study and its data tables carefully – this is what you receive a week before the task.',
      'Switch to “Answer online”: write the report (Activity 1) and build the presentation with speaker notes (Activity 2).',
      'Get AI Examiner feedback on each activity against the four assessment foci, or download the paper as a PDF.'],
    paperNote: 'Each series features a different business and different management topics (e.g. quality, culture, HR, motivation, change). The mark grid is the same: analyse the data, apply principles, recommend approaches, structure your response.',
    activityTitles: { 1: 'Report (44 marks)', 2: 'Presentation with speaker notes (44 marks)' },
    activityMinutes: { 1: 85, 2: 85 },
    placeholders: { report: 'Introduction → current issues (with figures) → management principles/theories → recommendations with justification → conclusion…', presentation: '' },
    afs: { 1: [g1.data, g1.prin, g1.alt, g1.struct], 2: [g2.data, g2.prin, g2.alt, g2.struct] },
    indicative: {
      1: ['AF1 – quote and interpret the data tables (e.g. labour turnover 7%→40%, wastage 5%→35%) and the case facts; show trends and what they mean for the stated goals.', 'AF2 – name and apply management principles from the specification that fit the topic of the activity (e.g. quality standards BSI/ISO, quality circles, lean, six sigma, audits; management styles; Maslow/Herzberg/Taylor/Mayo; Handy/Schein culture).', 'AF3 – specific recommendations (e.g. quality inspectors, weekly meetings, training, restructuring, recognition schemes, partnership with suppliers) each justified in terms of the business goals, with benefits and drawbacks.', 'AF4 – introduction, scene setting, issue → solution pairs, recommendations, conclusion; correct terminology.'],
      2: ['Same four AFs applied to the second topic of the paper (e.g. business culture, motivation, development, change). Slides give the headline points; the speaker notes/script contain the explanation and persuasion.', 'AF2 – culture/motivation theories (Handy, Schein, Hofstede, Maslow, Herzberg, Taylor, Mayo), management/leadership styles, HR planning, training and appraisal.', 'AF4 – clear slide structure, speaker notes that engage the owners, no errors.']
    },
    classify: function (text) { for (const [aim, re] of RULES) if (re.test(text)) return aim; return 'A'; },
    topicFor: function () { return 'Set task'; }
  };
})();
