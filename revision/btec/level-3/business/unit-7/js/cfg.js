/* BTEC Business Unit 7 — Business Decision Making (31589H), Part S. AF grids from the Pearson mark scheme (June 2024).
   Activity 1 (report, 52): AF1 8 · AF2 8 · AF3 8 · AF4 16 · AF5 8 · AF6 4.  Activity 2 (presentation, 18): AF7 6 · AF8 6 · AF9 6. */
(function () {
  'use strict';
  const band = (b, marks, descriptor) => ({ band: b, marks, descriptor });
  const A = {
    1: { id: 'AF1', name: 'Information/data selection and interpretation', max: 8, look: 'Select the right figures and facts from the case (market data, option data, resources) and interpret what they mean for each option.',
      bands: [band(1, '1–2', 'References to the case lack detail and relevance; limited selection of appropriate evidence.'), band(2, '3–5', 'References lack direct relevance in places; selects appropriate evidence to support some points.'), band(3, '6–7', 'Relevant references; selects appropriate evidence to support most points.'), band(4, '8', 'Sustained, entirely relevant references; selects appropriate evidence to support each point made.')] },
    2: { id: 'AF2', name: 'Implications for resources based on decisions made', max: 8, look: 'For EACH option: human (skills, time, staff), physical (premises, location, equipment), financial (start-up, loans, savings) and time (start date, training, hours).',
      bands: [band(1, '1–2', 'Limited understanding of resource implications.'), band(2, '3–5', 'Understanding of resource implications with some application to context.'), band(3, '6–7', 'Understanding of a range of resource implications applied to context.'), band(4, '8', 'Detailed understanding of a wide range of resource implications applied to context.')] },
    3: { id: 'AF3', name: 'Financial forecasting', max: 8, look: 'Accurate calculations from the data: revenue, gross profit and %, net profit and %, break-even and margin of safety, ROCE (and cash flow if possible) for BOTH options (own-figure rule applies).',
      bands: [band(1, '1–2', 'Forecasts show limited interpretation of financial concepts; references to finance lack detail and application.'), band(2, '3–5', 'Forecasts interpret financial concepts; applied to context but may lack detail and accuracy in places.'), band(3, '6–7', 'Forecasts interpret a range of concepts; applied to context, detailed and accurate.'), band(4, '8', 'Range of concepts; thorough, coherent approach to financial requirements; detailed and accurate.')] },
    4: { id: 'AF4', name: 'Key factors, risks and alternative approaches', max: 16, look: 'Analysis using at least TWO decision-making tools (SWOT, PESTLE, Porter’s five forces, 5C…) leading to rationalised key factors, risks and alternatives linked to the client’s aims.',
      bands: [band(1, '1–5', 'Some key factors, risks and alternative approaches with little development relevant to context.'), band(2, '6–9', 'Factors, risks and approaches with development relevant to context and business goals.'), band(3, '10–13', 'Rationalised factors, risks and approaches with clear linkage to context and business goals.'), band(4, '14–16', 'Comprehensive coverage of rationalised factors, risks and approaches in context and linked to business goals.')] },
    5: { id: 'AF5', name: 'Supported decision making', max: 8, look: 'A clear recommendation of ONE option, drawing together the financial, resource and risk evidence, with the reasons the other option was not chosen.',
      bands: [band(1, '1–2', 'Decisions are simplistic and/or generic.'), band(2, '3–5', 'Decisions draw together evidence and are partially justified.'), band(3, '6–7', 'Convincing decisions draw together evidence and are justified.'), band(4, '8', 'Convincing decisions fully and logically draw together evidence and are fully justified.')] },
    6: { id: 'AF6', name: 'Presentation and structure (report)', max: 4, look: 'A report with a logical structure and business terminology, no communication errors.',
      bands: [band(1, '1', 'Lacks structure; many communication errors; generic terminology.'), band(2, '2', 'Basic structure; occasional errors; some appropriate terminology.'), band(3, '3', 'Logical structure; few errors; relevant terminology.'), band(4, '4', 'Well written, logical structure; no errors; terminology throughout.')] },
    7: { id: 'AF7', name: 'Business proposal overview', max: 6, look: 'Slides and speaker notes give a brief overview of the situation and the decision reached, using evidence from the report.',
      bands: [band(1, '1–2', 'Limited summary of the proposal; limited evidence; overview may not present the decision reached.'), band(2, '3–4', 'Coherent summary; appropriate evidence supports some points; overview leads to a decision.'), band(3, '5', 'Detailed, coherent, convincing summary; evidence supports most points; clear, rationalised decisions.'), band(4, '6', 'Detailed, coherent, convincing and articulate summary; evidence supports each point; clear, concise rationalised decisions.')] },
    8: { id: 'AF8', name: 'Costs/finance and key factors/risks (pitch)', max: 6, look: 'A pitch to the client/investors that references the costs, finance, key factors and risks behind the decision.',
      bands: [band(1, '1–2', 'A basic pitch with little consideration of financial or other details.'), band(2, '3–4', 'A pitch with reference to the relevant details and factors of setting up/developing the business.'), band(3, '5', 'A pitch showing sustained references to relevant details and factors.'), band(4, '6', 'A pitch showing sustained and considered references to relevant details and factors.')] },
    9: { id: 'AF9', name: 'Presentation design and structure', max: 6, look: 'Professional slide design with a clear message and speaker notes that would engage and convince the audience; no communication errors.',
      bands: [band(1, '1–2', 'Slides lack structure; design and notes lack professionalism; many errors; would struggle to engage.'), band(2, '3–4', 'Basic structure; coherent, basic professionalism; occasional errors; likely to engage.'), band(3, '5', 'Coherent structure; high professionalism; few errors; would engage and likely convince.'), band(4, '6', 'Coherent, clear message; considered, highly professional; no errors; would engage and convince.')] }
  };
  window.BIZ_UNIT = {
    n: 7, key: 'bus_u7', code: '31589H', name: 'Business Decision Making', kind: 'set', total: 70, minutes: 180,
    timeLabel: '3 hours (Part S)', aims: ['A', 'B', 'C', 'D', 'E'],
    partsLabel: 'Part S (set task information and task)',
    partALabel: 'Set task information',
    partANote: 'Unit 7 is a single 3-hour supervised task (Part S) typed on a computer. You receive a scenario with two options and the data for each, then produce a report (52 marks) and a presentation with speaker notes (18 marks). Use at least two decision-making tools.',
    instructions: [
      ['Instructions', ['Complete both activities.', 'You will produce two documents on a computer: a report and a presentation of slides with speaker notes or script.', 'You may use a calculator.']],
      ['Information', ['The total mark for this paper is {total}.', 'Activity 1 (report) is worth 52 marks and Activity 2 (presentation) 18 marks.']],
      ['Advice', ['Address BOTH options throughout the report.', 'Use at least two decision-making tools and calculate the key financial figures.', 'Finish with a clear recommendation of one option.']]
    ],
    howto: ['Open a paper and read the scenario, the market information and the data for Option 1 and Option 2.',
      'Switch to “Answer online”: write the report (52 marks) with calculations, then build the presentation with speaker notes (18 marks).',
      'Get AI Examiner feedback on each activity against the assessment foci (AF1–AF9), or download the paper as a PDF.'],
    paperNote: 'Each series has a new client and two options. The mark grid is always the same: select data, resources, financial forecasts, factors and risks (with tools), and a supported decision.',
    activityTitles: { 1: 'Report on the two options', 2: 'Presentation with speaker notes' },
    activityMinutes: { 1: 130, 2: 40 },
    placeholders: { report: 'Introduction and aims → Option 1: resources, finance (calculations), factors and risks → Option 2: the same → decision tools (SWOT/PESTLE…) → recommendation and why not the other option…', presentation: '' },
    afs: { 1: [A[1], A[2], A[3], A[4], A[5], A[6]], 2: [A[7], A[8], A[9]] },
    indicative: {
      1: ['AF1 – quote market data and the two options’ data; interpret (e.g. market growing 22% to £52.1bn but cost of living may slow it; 80% book online).', 'AF2 – human, physical (location), financial and time resources for EACH option.', 'AF3 – GP/GP%, NP/NP%, break-even and margin of safety, ROCE (own-figure rule); mention drawings and cash flow where relevant.', 'AF4 – at least two tools (e.g. SWOT + PESTLE or Porter) applied to both options, with risks (lack of savings, competitors, forecast revenue not met) and how to manage them.', 'AF5 – one clear recommendation, justified with finance, resources and risks, and why the other option is rejected.', 'AF6 – clear headings, logical flow, terminology.'],
      2: ['AF7 – a short overview of the situation, both options and the decision; evidence from the report.', 'AF8 – key costs/finance and factors/risks stated to convince the client or investors.', 'AF9 – professional slides plus speaker notes/script that engage and persuade.']
    },
    classify: function (text) {
      if (/ratio|break-?even|margin of safety|profit|roce|cash flow|forecast|financial/i.test(text)) return 'B';
      if (/resource|human|premises|location|staff|time/i.test(text)) return 'A';
      if (/swot|pest|porter|5c|tool|decision/i.test(text)) return 'C';
      if (/risk|factor/i.test(text)) return 'D';
      return 'E';
    },
    topicFor: function () { return 'Set task'; }
  };
})();
