/* BTEC Construction (AAQ) Unit 4 — per-criterion assignment help (RA10’s guidance; your work must be your own). */
(function () {
  'use strict';
  const CH = (means, evidence, next) => `<p><b>What it means:</b> ${means}</p><p><b>Evidence to include:</b></p><ul>${evidence.map(e => `<li>${e}</li>`).join('')}</ul>${next ? `<p><b>Reaching the next grade:</b> ${next}</p>` : ''}`;
  window.AAQ_CRIT_HELP = {
    _intro: '<h3>Before you start</h3><p>Highlight everything in the project brief about <b>budget, programme, design completeness, client expertise and risk appetite</b> – these drive your choice of contract, procurement route and estimating approach. Keep a calculation sheet for your estimate with every rate referenced.</p>',
    _tips: '<ul><li>“Assess” and “justify” mean weighing options against the brief, not just describing them.</li><li>Use a risk register with likelihood, impact, score, mitigation and owner.</li><li>Show estimating working step by step with units and percentages.</li><li>Use a formal report format with correct grammar and no slang.</li></ul>',
    'group:A': 'Learning aim A: contracts, legal elements, clauses and disputes.',
    'group:B': 'Learning aim B: commercial risk and procurement routes.',
    'group:C': 'Learning aim C: estimating and cost control.',
    'A.P1': CH('Compare different types of construction contract.', ['Lump sum, D&B, cost-plus, GMP, target cost, CM, time and materials, unit price – similarities, differences, risk allocation; JCT and NEC.'], 'For M1, assess which contract suits the brief.'),
    'A.P2': CH('Outline the elements of a legal construction contract.', ['Offer, acceptance, consideration, intention; typical clauses (scope, payment, variations, liquidated damages, disputes).'], null),
    'A.P3': CH('Explain approaches to resolving a contract dispute.', ['Mediation, adjudication, arbitration, litigation – process, binding or not, cost, time.'], null),
    'A.M1': CH('Assess the suitability of a contract for the brief.', ['Weigh two or three contract types against the brief’s budget, design certainty and risk; reasoned conclusion.'], null),
    'B.P4': CH('Produce a commercial risk analysis.', ['Risk register: risks from the brief, likelihood, impact, score, mitigation strategy, owner.'], 'For M2, assess procurement routes against these risks.'),
    'B.P5': CH('Explain procurement routes for the project.', ['Traditional, D&B, partnering, CM, PFI, PPP – how they work, pros and cons.'], null),
    'B.M2': CH('Assess how suitable procurement routes are for minimising risk.', ['Compare routes against your key risks, e.g. which transfers design risk or speeds delivery.'], 'For D1, justify one route against the brief.'),
    'B.D1': CH('Justify a procurement route against the brief.', ['Clear recommendation with reasons, evidence from risk analysis, and acknowledgement of drawbacks and how to manage them.'], null),
    'C.P6': CH('Explain approaches to preparing a cost estimate.', ['BoQ, schedule of rates, provisional sums, approximate estimates; CESMM purpose and benefits.'], 'For M3, assess which approach suits the project.'),
    'C.P7': CH('Prepare an estimate including labour, plant and materials.', ['Quantities, unit rates, wastage, labour outputs, plant, overheads, profit, preliminaries – all calculations shown.'], null),
    'C.P8': CH('Explain how costs are controlled during the project.', ['Budget planning, monitoring, contingencies, valuing variations, value engineering.'], null),
    'C.M3': CH('Assess approaches to estimating including labour, plant, materials and wastage.', ['Accuracy, effort and suitability of each approach at different project stages; impact of wastage allowances.'], 'For D2, justify one approach for an accurate estimate.'),
    'C.D2': CH('Justify an approach to prepare an accurate estimate against the brief.', ['Recommendation linked to design completeness, contract type and brief; evidence from your own estimate.'], null)
  };
})();
