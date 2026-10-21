/* BTEC Business Unit 2 — Developing a Marketing Campaign (31489H): configuration used by the shared paper viewer,
   the question-bank builder and the AI Examiner. Assessment-focus (AF) grids follow the Pearson mark grids (June 2024). */
(function () {
  'use strict';

  const band = (b, marks, descriptor) => ({ band: b, marks, descriptor });

  const AF = {
    1: {
      id: 'AF1', name: 'Structure', max: 4,
      look: 'A logically structured rationale (headings, separate paragraphs, logical order) that uses marketing terminology accurately throughout.',
      bands: [band(1, '1', 'Lacks structure; isolated references to marketing principles; generic terminology of limited relevance.'),
        band(2, '2', 'Basic structure; attempts to apply relevant marketing principles/concepts; some relevant terminology.'),
        band(3, '3', 'Logical structure; applies a variety of relevant marketing principles/concepts; relevant terminology.'),
        band(4, '4', 'Well written with a logical structure; applies a variety of relevant principles and concepts; relevant terminology used throughout.')]
    },
    2: {
      id: 'AF2', name: 'Marketing aims and objectives', max: 8,
      look: 'Relevant, realistic aims and objectives for this business (e.g. “increase online sales by x% by month 6”), each rationalised with data and linked to the marketing mix. “Increase sales” alone earns 1 mark.',
      bands: [band(1, '1–2', 'Some aims/objectives but little development or explanation relevant to the context.'),
        band(2, '3–4', 'Relevant aims and objectives with development/explanation relevant to the context.'),
        band(3, '5–6', 'Relevant aims and objectives are rationalised, with clear development/analysis relevant to the context.'),
        band(4, '7–8', 'Comprehensive coverage of relevant, rationalised aims and objectives, with good development/evaluation relevant to the context.')]
    },
    3: {
      id: 'AF3', name: 'Research and analysis of market information', max: 12,
      look: 'Selective use of BOTH primary and secondary data, analysed (what it means for the business), used throughout the work, with reliability and validity of the research evaluated.',
      bands: [band(1, '1–3', 'References to case study / research pack / market lack detail and relevance; reliability and validity attempted but generic; limited analysis, generic conclusions.'),
        band(2, '4–6', 'References lack relevance in places; basic grasp of reliability and validity; analysis leads to conclusions that may lack balance or relevance.'),
        band(3, '7–9', 'Relevant references to the case study, research pack and wider market; good understanding of reliability and validity; detailed analysis leading to relevant, balanced conclusions.'),
        band(4, '10–12', 'Sustained, entirely relevant references; thorough understanding of reliability and validity in context; detailed analysis leading to entirely relevant, balanced conclusions.')]
    },
    4: {
      id: 'AF4', name: 'Justification', max: 10,
      look: 'Analytical tools (SWOT, PESTLE, product life cycle) that are USED — each finding evaluated and turned into an action for the campaign — and the appropriateness of the proposed approach justified.',
      bands: [band(1, '1–3', 'Evaluation limited to unsupported statements/opinions; tools referenced but not used; appropriateness attempted.'),
        band(2, '4–6', 'Evaluation presented after some use of tools; limited consideration of appropriateness.'),
        band(3, '7–8', 'A variety of tools used leading to a coherent, justified evaluation; appropriateness clear and relevant to the scenario.'),
        band(4, '9–10', 'Different tools used leading to a coherent justified evaluation; appropriateness fully addressed in the context of the scenario.')]
    },
    5: {
      id: 'AF5', name: 'Marketing mix, message and media', max: 20,
      look: 'A full, contextualised marketing mix (4Ps and the extended 7Ps), one clear marketing message that flows through it, and a selective, justified choice of media/promotion that fits the aims, budget and timescale.',
      bands: [band(1, '1–6', 'Outline mix that is generic/unrealistic; message weakly linked; generic media; limited justification; extended mix not considered.'),
        band(2, '7–11', 'Mix covers most aspects but is generic in places; message included but links not sustained; media has some relevance; imbalanced justification.'),
        band(3, '12–16', 'Mix covers most aspects in detail with the 4Ps applied in context; extended mix referenced; clear message; comprehensive, selective media; mostly balanced justification.'),
        band(4, '17–20', 'Mix covers all aspects in detail (4Ps and extended mix) in context; clear, considered message; comprehensive, selective media; balanced justification of choices.')]
    },
    6: {
      id: 'AF6', name: 'Budget', max: 8,
      look: 'An itemised budget with £ figures for every activity (including preparation, staffing, production, distribution, insurance, transport and other “wider” costs) that adds up to no more than the budget in the brief. Stating only the total = 1 mark; a % split = 2 marks.',
      bands: [band(1, '1–2', 'Budget restricted to generic detail with limited relevance to the activity.'),
        band(2, '3–4', 'Basic understanding of costs for aspects of the activity in context.'),
        band(3, '5–6', 'Budget used realistically, showing detailed understanding of the costs of most aspects of the activity.'),
        band(4, '7–8', 'Budget used realistically, with detailed understanding of the costs of ALL aspects of the activity in context.')]
    },
    7: {
      id: 'AF7', name: 'Timescale', max: 4,
      look: 'Start and end dates/months for every activity, preparation time, durations and a reason for the timing (seasons, events, festivals). Simply stating the duration is unrealistic.',
      bands: [band(1, '1', 'Timescale is unrealistic in the context of the plan.'),
        band(2, '2', 'Timescale is generally realistic; may contain occasional lapses.'),
        band(3, '3', 'Timescale is realistic in the context of the plan.'),
        band(4, '4', 'Timescale is thorough and entirely realistic in the context of the plan.')]
    },
    8: {
      id: 'AF8', name: 'Presentation', max: 4,
      look: 'A professional written plan for the owners (headings, tables, clear layout) with accurate marketing terminology and no obtrusive communication errors.',
      bands: [band(1, '1', 'Lacks professional format, which reduces clarity; many communication errors; few references to appropriate terminology.'),
        band(2, '2', 'Clear but basic professional format; occasional communication errors; references to appropriate terminology.'),
        band(3, '3', 'Clear, professional-looking format; few communication errors; sustained references to appropriate terminology.'),
        band(4, '4', 'Professional format; no obtrusive communication errors; appropriate terminology used throughout.')]
    }
  };

  window.BIZ_UNIT = {
    n: 2, key: 'bus_u2', code: '31489H', name: 'Developing a Marketing Campaign', kind: 'set', total: 70, minutes: 180,
    timeLabel: '3 hours (Part B)', aims: ['A', 'B', 'C'],
    partsLabel: 'Part A (research pack) and Part B (set task)',
    partALabel: 'Part A — Research pack',
    partANote: 'In the real assessment Part A is issued the afternoon before Part B. You have 2 hours to annotate it and prepare up to two sides of A4 notes (in the earlier series, learners did six hours of independent research and took up to six sides of notes). Part B is a 3-hour supervised task typed on a computer.',
    instructions: [
      ['Instructions', ['Complete both activities.', 'Part A will have been used in preparation for completion of Part B.', 'You may use a calculator, note paper, your Part A notes and your annotated copy of Part A.']],
      ['Information', ['The total mark for this paper is {total}.', 'The marks for each activity are shown in brackets – use this as a guide as to how much time to spend on each activity.']],
      ['Advice', ['Read each activity carefully before you start.', 'Use the research pack throughout BOTH activities.', 'Plan your time carefully – leave time to check your work.']]
    ],
    howto: ['Open a paper and read the Part A research pack and the Part B task, as you would the day before and the day of the exam.',
      'Switch to “Answer online” and write the rationale (34 marks) and the campaign plan (36 marks). Use the budget planner for Activity 2.',
      'Get AI Examiner feedback on each activity against the eight assessment foci, or download the paper as a PDF.'],
    paperNote: 'Series since January 2022 give you a ready-made research pack (primary and secondary data, media costs). Earlier series asked learners to research the market themselves — the Part B tasks are the same.',
    activityTitles: { 1: 'The rationale for the campaign', 2: 'The marketing campaign plan' },
    activityMinutes: { 1: 85, 2: 95 },
    placeholders: {
      rationale: 'Marketing aims and objectives → analysis of the market and competition using the research pack → reliability and validity of the research → SWOT / PESTLE / product life cycle → justification…',
      plan: 'Marketing message → marketing mix (7Ps) → media selection with costs → campaign budget → timescale → how the campaign will be evaluated…'
    },
    afs: { 1: [AF[1], AF[2], AF[3], AF[4]], 2: [AF[5], AF[6], AF[7], AF[8]] },
    indicative: {
      1: ['AF2 – aims and objectives suited to the business goal, budget and time period, with numbers and dates (e.g. “grow online sales by 10% by the end of month 6”), each rationalised with research data and linked to the marketing mix.',
        'AF3 – both primary data (survey: sample size, age range, location bias, who was asked) and secondary data (market size, growth, competitors, trends) selected and ANALYSED, not copied; reliability/validity judged for each source (date, sample, bias, publisher, method).',
        'AF4 – SWOT, PESTLE and/or product life cycle completed with data; every point evaluated and linked to a campaign action; appropriateness of the chosen option justified against the alternative.',
        'AF1 – headings, paragraphs, logical order, correct marketing terms (segmentation, USP, penetration pricing, reach, ROI…).'],
      2: ['AF5 – all 4Ps plus people, physical environment and process, each applied to THIS business; one marketing message threaded through the mix; media chosen with reasons (reach, cost, target market, trends) and costs from the pack.',
        'AF6 – every activity costed (e.g. posts, ads, influencer fees, stand fees, printing, distribution, staff, filming, props, insurance); figures add up to ≤ the budget; wider costs included.',
        'AF7 – a Gantt-style or dated timeline for the whole campaign (e.g. 24 weeks) with preparation, start/end of each activity and reasons for timing.',
        'AF8 – professional plan format for the owners using the headings in the brief; accurate terminology; no major errors.']
    },
    classify: function (text, kind, n) { return n === 1 ? 'B' : 'C'; },
    topicFor: function () { return 'Set task'; }
  };
})();
