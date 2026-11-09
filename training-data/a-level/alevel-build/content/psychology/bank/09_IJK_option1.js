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
