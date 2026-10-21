/* Business Unit 6 — Principles of Management: comprehensive revision guide (shared guide engine).
   Worked examples use the June 2024 Gale Papers Ltd case. */
(function () {
  'use strict';
  const { svg: S, h: H, P } = window.BizGuide;
  const { key, tip, warn, fig, table, ul, formula, example, steps, cards, stats, check, two, photo, unsplash } = H;

  function setTask() {
    const bars = S.bars([['AF1 Data', 12, P.violet], ['AF2 Principles', 12, P.violet], ['AF3 Approaches', 12, P.violet], ['AF4 Structure', 8, P.violet]], { w: 560, h: 240, max: 14, unit: 'Marks per activity (each activity = 44; the grid repeats in Activity 2)', label: 'Marks per assessment focus' });
    const flow = S.flow([['Part A', 'case study + data · about 6 hours'], ['No notes', 'into Part B'], ['Part B', '3 hours · computer'], ['Report', '44 marks'], ['Presentation', '44 marks + speaker notes']], { w: 700, h: 82, label: 'How the task runs' });
    return `
<div class="guide-aim-hd"><div class="guide-aim-badge">★</div><div><div class="guide-aim-title">The assessment: Part A case study + Part B report and presentation</div><div class="guide-aim-subtitle">88 marks · two 44-mark activities · each marked on four assessment foci</div></div></div>
<div class="g-set-hero">${S.hero('Diagnose the business. Recommend with evidence.', 'Read the case, analyse the data, apply management theory, then recommend and justify specific actions.', ['people', 'target', 'gear'], P.violet)}</div>
${stats([['88', 'marks'], ['2', 'activities × 44'], ['3 h', 'Part B'], ['0', 'notes in Part B']])}
${fig(flow, 'Each series has a new business and two themes (for example quality management, then business culture).')}
${fig(bars, 'In both activities: 12 + 12 + 12 + 8. Three-quarters of the marks reward analysis, theory and recommendations – not structure.')}
${table(['AF', 'Top band looks like', 'Typical mistakes'], [['<strong>Data analysis</strong> (12)', 'Uses text AND table figures; shows trends (7% → 40%); explains what each means for the goals; balanced conclusions', 'Retells the case; ignores the tables; no interpretation'], ['<strong>Key principles</strong> (12)', 'Specification theory/tools named, explained and applied to this business’s goals', 'Textbook definitions with no link to the case'], ['<strong>Alternative approaches</strong> (12)', 'Specific, realistic recommendations, justified with benefits AND drawbacks against business goals', 'Generic advice (“improve communication”); unrealistic or unjustified'], ['<strong>Structure</strong> (8)', 'Logical structure, terminology, no errors (report: intro → issues/solutions → recommendations → conclusion)', 'No headings; informal language']])}
<h4>Report and presentation templates</h4>
${two(`<strong>Report (Activity 1)</strong>${steps(['Introduction – business, goals, purpose', 'Scene setting – key facts and data', 'Issue 1 → theory → data → solution (repeat per issue)', 'Recommendations in priority order with costs/benefits', 'Conclusion linked to the goals'])}`, `<strong>Presentation (Activity 2)</strong>${steps(['Title and aims of the talk', 'Headline issues with one key figure each', 'Theory/model in one slide each', 'Recommendations and benefits', 'Next steps and conclusion', '<em>Speaker notes: full explanations and persuasion</em>'])}`)}
${tip('Examiner method: <strong>Issue → evidence (figure) → principle/theory → recommendation → benefit and drawback → link to a business goal.</strong> Repeat this chain for every point.')}
${warn('You cannot take notes into Part B. Prepare in Part A by summarising each figure, listing the goals, and matching each problem to a specification area (A–F).')}
${photo(unsplash('photo-1521737604893-d14cc237f11d'), 'Management is about people, culture and quality – and the data that shows how they are going.')}`;
  }

  function a1() {
    return `
${fig(S.tiles([['Planning', 'set objectives and decide how'], ['Organising', 'resources, roles, structure'], ['Coordinating', 'align people and departments'], ['Controlling', 'compare results with plans'], ['Monitoring', 'track progress and quality'], ['Delegating', 'pass authority for tasks']], { cols: 3, th: 78, w: 700, label: 'Functions of management' }), 'Functions of management (specification A2).')}
${fig(S.tiles([['Inspiring', 'motivating people'], ['Energising', 'creating enthusiasm'], ['Influencing stakeholders', 'owners, staff, suppliers'], ['Envisioning', 'creating the vision'], ['Best route to success', 'strategy for goals']], { cols: 5, th: 92, w: 700, pal: [P.violet, P.pink, P.blue, P.teal, P.amber], label: 'Functions of leadership' }), 'Functions of leadership.')}
${table(['Management', 'Leadership'], [['Plans, organises and controls resources', 'Creates a vision and inspires people'], ['Short-term targets and routines', 'Long-term direction and change'], ['Gets tasks done through procedures', 'Gets commitment through influence']])}
<h4>Definitions of management and leadership (A1)</h4>
${table(['Approach', 'Key idea', 'Use it to…'], [['Management by objectives', 'Agree objectives with staff and review against them', 'Recommend clear targets and appraisal'], ['Situational / contingency', 'The best style depends on the situation', 'Justify changing style for crisis vs routine'], ['Functional / action-centred (Adair)', 'Balance task, team and individual', 'Show a manager ignoring team or individuals'], ['Transformational / transactional', 'Inspire change vs reward-for-performance', 'Compare styles in a change situation']])}
${fig(S.spectrum([['Tells', 'boss decides'], ['Sells', 'boss persuades'], ['Tests', 'asks reaction'], ['Consults', 'asks before deciding'], ['Joins', 'team decides']], { left: 'Boss-centred', right: 'Team-centred', label: 'Leadership continuum' }), 'The leadership continuum (Tannenbaum and Schmidt): choose the point on the line that suits the task, team and time available.')}`;
  }
  function a2() {
    return `
${fig(S.layers([['Visible – artefacts', 'dress code, offices, ceremonies, behaviour', P.sky], ['Stated – espoused values', 'mission statement, rules, policies, “our values”', P.blue], ['Hidden – basic assumptions', 'unspoken beliefs: “mistakes are punished”, “cost comes first”', P.navy]], { label: 'Schein’s three levels of culture' }), 'Schein: culture has visible, stated and hidden levels. In Gale Papers the stated mission (“exceed customer expectations”) is contradicted by the hidden belief that cost is everything.')}
${fig(S.matrix([{ h: 'Power culture', tag: 'centre', items: ['One/two leaders decide', 'Fast, personal', 'Gale Papers: owners control all'] }, { h: 'Role culture', tag: 'rules', items: ['Clear roles, procedures', 'Stable, slow to change', 'Large bureaucracies'] }, { h: 'Task culture', tag: 'teams', items: ['Project teams', 'Flexible, problem-solving', 'Consultancies'] }, { h: 'Person culture', tag: 'individuals', items: ['Individuals matter most', 'Professionals, chambers', 'Few formal controls'] }], { h: 330, cols: [P.red, P.blue, P.green, P.violet], label: 'Handy’s four cultures' }), 'Handy’s model – say which culture the business has and what it should move to.')}
${table(['Element', 'How it shapes management'], [['Vision, mission, values', 'Guide decisions; check they are used daily'], ['Policies and procedures', 'Set expectations (quality, grievances, overtime)'], ['Management style', 'Autocratic style creates fear and “us and them”'], ['Workforce structure', 'Agency vs permanent staff; hierarchy; flat vs tall'], ['Diversity and flexibility', 'Work–life balance affects retention']])}`;
  }
  function b1() {
    return `
${fig(S.spectrum([['Autocratic', 'leader decides'], ['Paternalistic', 'decides + explains'], ['Democratic', 'consults staff'], ['Laissez-faire', 'staff decide']], { left: 'Leader control', right: 'Staff freedom', label: 'Leadership styles spectrum' }), 'Different situations need different styles – recommend one and justify it.')}
${table(['Style', 'Best when', 'Risks'], [['Autocratic', 'Crisis, unskilled workforce, safety-critical', 'Low motivation, high turnover'], ['Paternalistic', 'Staff need support and reassurance', 'Can be patronising'], ['Democratic', 'Skilled staff, complex decisions', 'Slow decisions'], ['Laissez-faire', 'Creative, self-motivated experts', 'Lack of direction'], ['Transactional', 'Routine targets', 'Little loyalty beyond rewards'], ['Transformational', 'Change and growth', 'Needs credible vision'], ['Charismatic', 'Launches, turnarounds, inspiring a team', 'Over-dependence on one person']])}
${example('Applying style to Gale Papers', '<p>Aled and Gethin used an <strong>autocratic/transactional</strong> style: contracts changed without consultation, shifts imposed and pay requests refused. The data (labour turnover 7% → 40%, satisfaction 65% → 30%) shows the cost. Recommend a more <strong>democratic</strong> approach: weekly feedback meetings, consultation on shifts and recognition – justified by the goal “to be an excellent employer with high staff retention”. Drawback: slower decisions, so keep clear standards for quality.</p>')}`;
  }
  function b2() {
    return `
${fig(S.tiles([['Setting objectives', 'clear targets'], ['Motivating', 'meet needs, recognise effort'], ['Decision making', 'timely, evidence-based'], ['Team building', 'agency + permanent staff'], ['Leading by example', 'managers model standards'], ['Consulting', 'ask before changing'], ['Problem solving', 'find root causes'], ['Valuing and supporting', 'wellbeing, development'], ['Managing conflict', 'resolve disputes fairly'], ['Interpersonal relationships', 'trust and respect'], ['Emotional intelligence', 'read and manage emotions'], ['Communicating and feedback', 'two-way, regular']], { cols: 4, th: 74, w: 700, label: 'Management and leadership skills' }), 'All thirteen skills in the specification (B2) – match the missing ones to the case study.')}
${table(['Theorist', 'Idea', 'Use it to…'], [['Fayol', 'Plan, organise, command, coordinate, control', 'Show missing management functions (no supervisors, no control)'], ['Weber', 'Bureaucracy: hierarchy, rules, roles', 'Recommend clear structure and procedures'], ['Blake & Mouton', 'Concern for people vs production', 'Show a task-only manager (high production, low people)'], ['Taylor', 'Scientific management', 'Explain repetitive jobs and pay as motivators']])}`;
  }
  function c1() {
    return `
${fig(S.lines([{ name: 'Labour turnover %', col: P.red, pts: [[2021, 7], [2022, 15], [2023, 40]] }, { name: 'Agency staff %', col: P.amber, pts: [[2021, 5], [2022, 32], [2023, 65]] }, { name: 'Employee satisfaction %', col: P.teal, pts: [[2021, 65], [2022, 52], [2023, 30]] }], { h: 280, ymax: 70, xlabels: [[2021, '2021'], [2022, '2022'], [2023, '2023']], fmt: v => Math.round(v) + '%', label: 'Gale Papers staffing data' }), 'Gale Papers (June 2024): more agency staff, higher turnover, lower satisfaction. Quote the figures and explain the connection.')}
${table(['HR area', 'Key points'], [['HR as a factor of production', 'Labour turns other resources into output – skills and effort affect quality and cost'], ['Labour market analysis', 'Supply and demand for skills: government data, job adverts, agencies, own records'], ['Forecasting demand', 'From sales, expansion, technology, turnover, productivity'], ['Business planning link / globalisation', 'Plans set staffing needs; global labour pools but cultural and legal differences'], ['Recruitment & selection', 'Right skills, job descriptions, induction'], ['Contracts', 'Permanent, temporary, agency, zero-hours – flexibility vs security'], ['Labour turnover', 'Leavers ÷ average workforce × 100 – cost of replacing staff'], ['Absenteeism', 'Days lost ÷ days available × 100 – sign of low morale']])}`;
  }
  function c2() {
    return `
${fig(S.flow([['Forecast demand', 'how many staff/skills?'], ['Audit supply', 'who do we have?'], ['Find the gap', 'shortage or surplus'], ['Plan action', 'recruit, train, redeploy, agency'], ['Review', 'monitor turnover and skills']], { w: 700, h: 80, label: 'Human resource planning' }), 'HR planning matches people to the work.')}
${table(['Workforce structure', 'Meaning', 'Trade-off'], [['Core', 'Permanent key staff', 'Skilled and loyal; higher fixed cost'], ['Peripheral', 'Part-time, temporary, agency, sub-contracted', 'Flexible; less commitment and control'], ['Sub-contracting', 'Work done by another firm', 'Access to skills; less quality control'], ['Zero-hours / temporary / agency', 'No guaranteed hours / short-term / via agency', 'Flexibility v insecurity and turnover']])}
${H.cards([['Zero-hours/temporary', 'Flexible but insecure', P.amber], ['Agency staff', 'Higher hourly cost; quick to hire', P.orange], ['Permanent staff', 'Loyal and trained; commitment', P.green], ['Flexible working', 'Work–life balance aids retention', P.teal]], 4)}`;
  }
  function d1() {
    return `
${fig(S.pyramid([['Physiological', 'pay for food, rest, shelter'], ['Safety', 'job security, safe conditions'], ['Social', 'teamwork, belonging'], ['Esteem', 'recognition, status'], ['Self-actualisation', 'growth, achievement']], { label: 'Maslow’s hierarchy of needs' }), 'Maslow – meet lower needs before higher ones. Zero-hours contracts fail the safety level; no recognition fails esteem.')}
${fig(S.matrix([{ h: 'Hygiene factors', tag: 'prevent dissatisfaction', items: ['Pay', 'Working conditions', 'Supervision', 'Job security'] }, { h: 'Motivators', tag: 'create satisfaction', items: ['Achievement', 'Recognition', 'Responsibility', 'Interesting work'] }, { h: 'Taylor', tag: 'scientific management', items: ['Money motivates', 'Piece rate', 'Close supervision'] }, { h: 'Mayo', tag: 'human relations', items: ['Attention and teamwork', 'Consultation', 'Hawthorne studies'] }], { h: 330, cols: [P.slate, P.green, P.amber, P.violet], label: 'Motivation theories' }), 'Herzberg, Taylor and Mayo – use the theory that fits the evidence.')}
${tip('Don’t only list theories. Match them: “Staff are paid below the industry rate (hygiene factor) and have no recognition (motivator), so Herzberg suggests both must be improved.”')}`;
  }
  function d2() {
    return `
${fig(S.tiles([['Recruitment', 'bring in new skills'], ['Upskilling / reskilling', 'train current staff'], ['Outsourcing', 'buy the skill in'], ['Changing job roles', 'redeploy and enrich jobs'], ['Restructuring', 'new teams or layers']], { cols: 5, th: 92, w: 700, label: 'Techniques to meet skills requirements' }), 'Pick the technique that fits the skills gap, cost and time available.')}
${table(['Technique', 'Advantage', 'Disadvantage'], [['Recruitment', 'Fresh skills and ideas', 'Cost, time and induction'], ['Reskilling', 'Cheaper, keeps loyalty', 'Takes time; may not suit everyone'], ['Outsourcing', 'Specialist skills, flexible', 'Less control of quality'], ['Changing roles', 'Better use of existing staff', 'Resistance, retraining'], ['Restructuring', 'Clearer responsibility (e.g. supervisors)', 'Disruption and cost']])}`;
  }
  function d3() {
    return `
${table(['Approach', 'Advantage', 'Disadvantage'], [['On-the-job', 'Realistic, cheap, productive', 'Quality depends on trainer'], ['Off-the-job', 'Specialist skills', 'Costly; time away'], ['Induction', 'Settles new staff, explains standards', 'Needs planning'], ['Mentoring', 'Personal support', 'Mentor time'], ['Skills audit', 'Targets training where needed', 'Takes time']])}
${warn('30 minutes of training for agency staff (Gale Papers) led to errors and 35% wastage – cutting training can cost far more than it saves.')}`;
  }
  function d4() { return `${steps(['Set objectives and targets with the employee', 'Observe and collect evidence of performance', 'Appraisal meeting – feedback, praise and concerns', 'Agree development plan (training, mentoring)', 'Review progress regularly'])}${table(['Type', 'How it works'], [['Self-assessment', 'Employee rates own performance first'], ['Management by objectives', 'Targets agreed and reviewed'], ['Ratings scales', 'Manager scores set criteria'], ['360° appraisal', 'Feedback from managers, peers, subordinates (and customers)']])}
${key('Benefits', 'Better performance, motivation, identified training needs, evidence for promotion/pay. Drawback: time and fear of criticism.')}`; }
  function e1() {
    return `
${fig(S.flow([['Unfreeze', 'show why change is needed'], ['Change', 'introduce new methods'], ['Refreeze', 'embed new behaviour']], { w: 700, h: 80, label: 'Lewin’s model of change' }), 'Lewin’s three-step model.')}
${table(['Resistance', 'Response'], [['Fear of job loss', 'Reassure, retrain, redeploy'], ['Not consulted', 'Involve staff early'], ['Poor communication', 'Explain why and how'], ['Loss of routine/status', 'Support and recognise']])}
${table(['Stakeholder', 'How they can influence change'], [['Owners', 'Set strategy and approve investment'], ['Managers', 'Plan and lead the change'], ['Customers', 'Demand quality/delivery; can take business away'], ['Regulators / government', 'Laws, standards and inspections'], ['Financial institutions', 'Fund or refuse funding'], ['Employees', 'Support or resist; hold the skills']])}
${ul(['Kotter: create urgency → build a coalition → vision → communicate → empower → quick wins → build on change → anchor in culture'])}`;
  }
  function f1() {
    return `
${fig(S.formulaMap([['BSI', 'British Standards Institution – kite mark', 'product safety and quality'], ['ISO', 'International standards e.g. ISO 9001 quality management systems', 'trusted by large retailers'], ['Investors in People', 'standard for people management', 'staff development and engagement']], { cols: 3, label: 'Quality standards' }), 'Gale Papers: Aled wanted a recognised standard to improve image; Gethin thought customers only wanted low prices – evaluate both views.')}`;
  }
  function f2() {
    return `
${fig(S.tiles([['Set standards', 'tell every worker what “good” is'], ['Managerial commitment', 'leaders model quality; staff buy-in'], ['Quality circles', 'staff groups solving problems'], ['Partnership with suppliers/customers', 'reliable suppliers, feedback loops'], ['Open communication', 'weekly meetings, listen to staff']], { cols: 5, th: 108, w: 700, label: 'Quality culture' }), 'A quality culture means everyone owns quality.')}`;
  }
  function f3() {
    return `
${fig(S.formulaMap([['Quality control', 'inspect and test to find defects', 'detect'], ['Quality assurance', 'design quality into every stage', 'prevent'], ['Lean', 'cut waste of time, materials, effort', 'efficiency'], ['Six Sigma', 'data-driven; < 3.4 defects per million', 'DMAIC'], ['Kaizen', 'continuous small improvements by all', 'culture'], ['Audits & inspection', 'systematic checks vs standards', 'evidence']], { cols: 3, label: 'Quality tools' }), 'Pick the tool that fits the problem and explain its cost and benefit.')}`;
  }
  function f4() {
    return `
${fig(S.bars([['Wastage %', 35, P.red], ['Returns %', 19, P.orange], ['Satisfaction fell by', 23, P.slate]], { w: 560, h: 230, max: 40, fmt: v => v + '%', unit: 'Gale Papers 2023 (wastage 5% → 35%, returns 2% → 19%, customer satisfaction 98% → 75%)', label: 'Cost of poor quality' }), 'Poor quality shows in the data: use it to justify investment in quality management.')}
${check(['Zero-defect production and less waste', 'Continuous improvement', 'Higher customer and supplier satisfaction', 'Reduced inspection and replacement cost', 'Greater efficiency and profitability'])}
${example('Top-band recommendation', '<p><strong>Recommendation:</strong> introduce quality circles and appoint quality inspectors. <strong>Why:</strong> wastage rose from 5% to 35% because staff do not know the standard (F2). <strong>Benefit:</strong> fewer returns (19%) and higher customer satisfaction, supporting the goal to increase market share. <strong>Drawback:</strong> inspector wages and time away from the line. <strong>Judgement:</strong> the cost is outweighed by the £ value of replaced orders and the risk of losing a major retailer.</p>')}`;
  }

  window.BIZ_GUIDE_DATA = {
    storeKey: 'ra10-guide-revised-BUS-u6', unitLabel: 'Unit 6 Guide', aimWord: 'Content area', aims: ['A', 'B', 'C', 'D', 'E', 'F'], setTaskTitle: 'The assessment',
    titles: { A: 'Management, leadership and business culture', B: 'Management and leadership approaches', C: 'Human resources', D: 'Motivation, development and performance', E: 'Managing change', F: 'Quality management' },
    subtitles: { A: 'Functions of management and leadership; Handy and Schein culture models', B: 'Styles, skills and the theories of Fayol, Weber, Blake and Mouton', C: 'HR roles, contracts and human resource planning with labour-turnover data', D: 'Maslow, Herzberg, Taylor, Mayo, training and appraisal', E: 'Lewin, Kotter and overcoming resistance', F: 'Quality standards, culture, tools and benefits' },
    setTask: setTask,
    topics: {
      A: [{ code: 'A1', name: 'Definitions and functions of management and leadership', html: a1 }, { code: 'A3', name: 'Business culture', html: a2 }],
      B: [{ code: 'B1', name: 'Management and leadership styles', html: b1 }, { code: 'B2', name: 'Skills and management theories', html: b2 }],
      C: [{ code: 'C1', name: 'Human resources', html: c1 }, { code: 'C2', name: 'Human resource planning', html: c2 }],
      D: [{ code: 'D1', name: 'Motivation in the workplace', html: d1 }, { code: 'D2', name: 'Techniques to meet skills requirements', html: d2 }, { code: 'D3', name: 'Training and development', html: d3 }, { code: 'D4', name: 'Performance appraisal', html: d4 }],
      E: [{ code: 'E1', name: 'Managing change', html: e1 }],
      F: [{ code: 'F1', name: 'Quality standards', html: f1 }, { code: 'F2', name: 'Developing a quality culture', html: f2 }, { code: 'F3', name: 'Techniques and tools', html: f3 }, { code: 'F4', name: 'Importance and benefits', html: f4 }]
    },
    gallery: [
      { aim: '★', kicker: 'The task', title: 'Report + presentation', copy: '88 marks across two activities.', image: unsplash('photo-1542744173-8e7e53415bb0') },
      { aim: 'D', kicker: 'People', title: 'Motivation and culture', copy: 'Maslow, Herzberg, Handy and Schein.', image: unsplash('photo-1600880292203-757bb62b4baf') },
      { aim: 'F', kicker: 'Quality', title: 'Standards and tools', copy: 'Lean, six sigma, quality circles.', image: unsplash('photo-1552664730-d307ca884978') }
    ]
  };
})();
