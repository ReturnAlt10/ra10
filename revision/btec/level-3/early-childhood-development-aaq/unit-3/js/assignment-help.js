/* BTEC Early Childhood Development (AAQ) Unit 3 — per-criterion assignment help (RA10’s guidance; your work must be your own). */
(function () {
  'use strict';
  const CH = (means, evidence, next) => `<p><b>What it means:</b> ${means}</p><p><b>Evidence to include:</b></p><ul>${evidence.map(e => `<li>${e}</li>`).join('')}</ul>${next ? `<p><b>Reaching the next grade:</b> ${next}</p>` : ''}`;
  window.AAQ_CRIT_HELP = {
    _intro: '<h3>Before you start</h3><p>Organise your notes by the three age bands – <b>birth to 2</b>, <b>2 to 5</b> and <b>5 to 8</b> – because learning aim A criteria require all three. Collect real activity examples from placement (anonymised) and link every theory to <b>literacy and numeracy</b>.</p>',
    _tips: '<ul><li>Use PILES headings to keep development coverage complete.</li><li>Name the theorist and the concept (e.g. Vygotsky’s ZPD), then give a practice example.</li><li>Your plans should be practical enough for another practitioner to use.</li><li>For evaluations, weigh strengths against limitations and suggest improvements.</li></ul>',
    'group:A': 'Learning aim A: types of play and how they promote learning and development.',
    'group:B': 'Learning aim B: theoretical perspectives, including literacy and numeracy.',
    'group:C': 'Learning aim C: curriculum approaches and their influence on practice.',
    'group:D': 'Learning aim D: planning adult-led and child-initiated play.',
    'A.P1': CH('Explain types of play for each age band.', ['Physical, imaginative, sensory, creative, construction play; Parten’s stages; free-flow vs structured; adult-led/initiated vs child-initiated.', 'Age-specific examples for 0–2, 2–5 and 5–8.'], 'For M1, assess how beneficial different activities are.'),
    'A.P2': CH('Explain how play supports PILES development for each age band.', ['Examples for physical, cognitive, language, social and emotional development in each band, including literacy and numeracy.'], null),
    'A.M1': CH('Assess the benefits of different types of play and learning activities.', ['Compare activities – which benefits are strongest and on what they depend (adult interaction, resources, stage).'], 'For D1, evaluate the extent to which examples support holistic development.'),
    'A.D1': CH('Evaluate how far examples of play support holistic development.', ['Specific activities per age band; strengths and gaps across all areas of development; justified conclusion.'], null),
    'B.P3': CH('Describe a range of theoretical perspectives, including literacy and numeracy.', ['Piaget, Vygotsky, Bruner, Athey, Froebel, Montessori – key ideas with literacy/numeracy examples.'], 'For M2, analyse their impact on curriculum and practice.'),
    'B.M2': CH('Analyse the impact of theoretical perspectives.', ['How theories shaped free-flow classrooms, the EYFS and KS1, with literacy/numeracy examples.'], 'For D2, evaluate the perspectives.'),
    'B.D2': CH('Evaluate theoretical perspectives for supporting learning in the early years.', ['Strengths and limitations, range and scope, outcomes for children, wider experiences; justified conclusion.'], null),
    'C.P4': CH('Discuss curriculum approaches to play and learning.', ['Reggio Emilia, Montessori, Forest school, High Scope, Steiner, Froebel – features, adult role, views of play.'], 'For M3, assess how far they influence provision.'),
    'C.M3': CH('Assess how far provision has been influenced by curriculum approaches.', ['Examples of child-initiated, exploratory, outdoor, natural-material and sensory provision linked to approaches; also note limits of influence.'], null),
    'D.P5': CH('Describe skills needed to support purposeful play.', ['Understanding interests, modelling, sensitive interactions, engagement; knowledge of needs, scaffolding, curriculum, observation.'], null),
    'D.P6': CH('Plan an adult-led activity for a group.', ['Children (ages/stages), learning outcomes, curriculum links, resources, environment, adult role, safety, adaptations, extension.'], 'For M4, justify your strategies.'),
    'D.P7': CH('Plan a child-initiated play area for individual children.', ['Interests from observation, layout, open-ended accessible resources, adult role, safety, how you will extend play.'], null),
    'D.M4': CH('Justify the strategies in your plans.', ['Explain why each strategy supports adult-led or child-initiated play, linked to theory and examples.'], 'For D3, evaluate every aspect of your plans.'),
    'D.D3': CH('Evaluate each aspect of your plans.', ['Suitability, creativity, support for learning and development; strengths, weaknesses and specific improvements.'], null)
  };
})();
