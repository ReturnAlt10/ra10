/* BTEC Medical Science (AAQ) Unit 6 — per-criterion assignment help (RA10’s guidance; your work must be your own). */
(function () {
  'use strict';
  const CH = (means, evidence, next) => `<p><b>What it means:</b> ${means}</p><p><b>Evidence to include:</b></p><ul>${evidence.map(e => `<li>${e}</li>`).join('')}</ul>${next ? `<p><b>Reaching the next grade:</b> ${next}</p>` : ''}`;
  window.AAQ_CRIT_HELP = {
    _intro: '<h3>Before you start</h3><p>Draw your own <b>labelled diagrams</b> of the male and female reproductive systems and a <b>hormone graph</b> of the menstrual cycle. For learning aim C, use published case studies and reliable data (HFEA, NICE fertility guideline, ONS) – treat this sensitive topic respectfully.</p>',
    _tips: '<ul><li>For every hormone give source, target and effect, and show feedback loops.</li><li>Link structure to function (e.g. scrotum temperature → sperm production).</li><li>Evaluate treatments using success rates by age, cost, risks (multiple pregnancy, OHSS) and ethics.</li><li>Use correct terminology throughout.</li></ul>',
    'group:A': 'Learning aim A: anatomy and physiology of the reproductive systems, the menstrual cycle and puberty.',
    'group:B': 'Learning aim B: gamete production, hormones, pregnancy, birth and contraception.',
    'group:C': 'Learning aim C: causes, treatments and impact of infertility.',
    'A.P1': CH('Describe the anatomy and physiology of the male and female reproductive systems.', ['Labelled diagrams and a description of each organ.'], 'For M1, analyse how each structure’s features relate to its function.'),
    'A.P2': CH('Describe the female reproductive cycle.', ['Phases, hormone changes, endometrial changes, ovulation, menopause, conception.'], null),
    'A.M1': CH('Analyse the functions of the structures of both systems.', ['Break down how specific features enable function (e.g. cilia in oviduct, alkaline prostate fluid).', 'Links between structures.'], 'For D1, discuss organ roles including changes at puberty.'),
    'A.D1': CH('Discuss the role of the reproductive organs including changes at puberty.', ['Organ roles across the lifespan; hormonal control of puberty; comparison of male and female changes; behavioural effects.'], null),
    'B.P3': CH('Describe gamete production, foetal development and parturition.', ['Oogenesis and spermatogenesis stages; embryonic and foetal development with timings; three stages of labour.'], null),
    'B.P4': CH('Describe hormonal control of gamete production and the menstrual cycle.', ['GnRH, FSH, LH, oestrogen, progesterone, testosterone – source, target, effect.'], 'For M2, explain hormones and contraception effects on gametogenesis and conception.'),
    'B.P5': CH('Describe contraceptive methods and their health implications.', ['Hormonal, barrier, IUD/IUS, emergency, permanent and male methods; benefits and risks; health worker role.'], null),
    'B.M2': CH('Explain the role of hormones and how different contraceptives affect gametogenesis and conception.', ['How hormonal methods suppress FSH/LH and ovulation; how barrier/IUD methods prevent fertilisation.'], 'For D2, discuss hormones and contraceptive effects together.'),
    'B.M3': CH('Explain the role of hormones in pregnancy, foetal development and birth.', ['hCG, progesterone, oestrogen, oxytocin, prolactin – roles and feedback.'], null),
    'B.D2': CH('Discuss the roles of reproductive hormones and the effects of different contraceptive methods.', ['Compare methods – effectiveness, mechanism, side effects, suitability – linked to hormone physiology.', 'Reasoned conclusions.'], null),
    'C.P6': CH('Describe the causes of infertility and the available treatments.', ['Male and female causes; diagnostic tests; treatments (ovulation induction, IUI, IVF, ICSI, donation, HRT, antibiotics, surgery).'], 'For M4, explain how treatments are tailored to problems.'),
    'C.P7': CH('Describe how infertility can affect health and wellbeing.', ['Psychological, relationship, social and financial effects; societal pressure; trends.'], null),
    'C.M4': CH('Explain how treatments are tailored to specific fertility problems.', ['Match causes to treatments with reasons (e.g. blocked tubes → IVF).'], 'For D3, evaluate causes and treatments.'),
    'C.D3': CH('Evaluate the causes of infertility and the use of fertility treatments.', ['Success rates (HFEA data), costs, risks, ethical issues, access and funding.', 'Justified conclusion.'], null)
  };
})();
