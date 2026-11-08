/* BTEC Early Childhood Development (AAQ) Unit 4 — per-criterion assignment help (RA10’s guidance; your work must be your own). */
(function () {
  'use strict';
  const CH = (means, evidence, next) => `<p><b>What it means:</b> ${means}</p><p><b>Evidence to include:</b></p><ul>${evidence.map(e => `<li>${e}</li>`).join('')}</ul>${next ? `<p><b>Reaching the next grade:</b> ${next}</p>` : ''}`;
  window.AAQ_CRIT_HELP = {
    _intro: '<h3>Before you start</h3><p>Build a <b>source log</b> as you research: title, author/organisation, date, URL, type of data and a note on reliability. You will need it for A.P2, A.M1 and A.D1. For learning aim D, keep a short reflective diary of placement experiences that you can write up with a named model.</p>',
    _tips: '<ul><li>Use current data and give the date and source of every statistic.</li><li>Interpret, do not just copy – say what the numbers show and why.</li><li>Link every piece of legislation to a real policy and to day-to-day practice.</li><li>In reflections, use “I” honestly and finish with an action plan.</li></ul>',
    'group:A': 'Learning aim A: types of research data, reliable sources and analysis.',
    'group:B': 'Learning aim B: legislation, policy, outcomes for children and gaps in provision.',
    'group:C': 'Learning aim C: why practitioners reflect.',
    'group:D': 'Learning aim D: reflective theories and critical thinking.',
    'group:CD': 'Learning aims C and D combined: how reflection drives quality improvement.',
    'A.P1': CH('Explain the types of research used to inform practice.', ['Primary methods with advantages/disadvantages; secondary data; quantitative vs qualitative.'], null),
    'A.P2': CH('Select and review data from a range of sources about 0–8 provision.', ['At least three or four different source types (government, charity, journal, numerical); summary of what each shows.'], 'For M1, interpret the descriptive and numerical data.'),
    'A.M1': CH('Interpret descriptive and numerical data.', ['Describe trends and comparisons in tables/graphs; explain reasons; note limitations such as sample and bias.'], 'For D1, evaluate data quality with ethical principles.'),
    'A.D1': CH('Evaluate the quality of data with reference to ethics.', ['Reliability, validity, bias; confidentiality, conflicts of interest, fair representation; judgement on which sources are most trustworthy.'], null),
    'B.P3': CH('Research and describe relevant legislation or statutory guidance.', ['E.g. Children and Families Act 2014, Health and Care Act 2022, EYFS – key requirements for 0–8 provision.'], 'For M2, explain a policy derived from it.'),
    'B.P4': CH('Explain opportunities and outcomes that have value for children.', ['Education, career, health, relationships, meaningful activities; examples of provision and entitlements.'], 'For M3, analyse the impact of access to provision.'),
    'B.M2': CH('Identify a policy derived from legislation/guidance and explain its implications.', ['Name the policy and its source (e.g. SEND policy from the 2014 Act); implications for staff, children and families.'], null),
    'B.M3': CH('Analyse the impact of accessing provision on outcomes.', ['Chains of cause and effect from access (or lack of access) to outcomes, supported by research evidence.'], 'For D2, evaluate legislation and policy impact on all stakeholders.'),
    'B.D2': CH('Evaluate the impact of legislation and policy on organisations, parents, children and practitioners.', ['Benefits and drawbacks for each group (e.g. workload, funding, outcomes); justified conclusion.'], null),
    'C.P5': CH('Explain the purpose of reflection.', ['Improving skills, quality improvement, understanding values and beliefs, collaboration – with setting examples.'], 'For M4, analyse its effectiveness for quality improvement.'),
    'D.P6': CH('Explain reflective theories for professional development.', ['Schön, Gibbs, Kolb – stages and ideas, applied to an example.'], 'For M5, analyse their impact on professional development.'),
    'C.M4': CH('Analyse how effective reflection is for continuous quality improvement.', ['Conditions that make reflection effective/ineffective; examples of changes to provision.'], null),
    'D.M5': CH('Analyse the impact of using reflective models on professional development.', ['How a model structured your learning; resulting changes to skills, CPD goals; critical thinking used.'], 'For CD.D3, evaluate effectiveness in changing provision and practice.'),
    'CD.D3': CH('Evaluate how effectively reflective approaches inform changes in provision and practice.', ['Compare models’ strengths/limitations; evidence of change in practice or provision; justified conclusion.'], null)
  };
})();
