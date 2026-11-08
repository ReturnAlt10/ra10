/* BTEC Engineering (AAQ) Unit 3 — Engineering Design: theory guide for the assignment (shared guide engine). */
(function () {
  'use strict';
  const { svg: S, h: H } = window.BizGuide;
  const { key, tip, warn, fig, table, ul, example, stats, check, two, formula } = H;

  function setTask() {
    return `
<div class="guide-aim-hd"><div class="guide-aim-badge">★</div><div><div class="guide-aim-title">The assignment</div><div class="guide-aim-subtitle">Internally assessed · PDS and initial ideas (A) · peer review and 3D CAD models (B) · 2D engineering drawings and presentation (C) · review the design process (D)</div></div></div>
${stats([['4', 'learning aims'], ['18', 'criteria'], ['1', 'engineering design challenge'], ['PDS', 'the document every decision is checked against']])}
${fig(S.flow([['Brief', 'design challenge'], ['PDS', 'requirements'], ['Ideas', 'sketches, models, costs'], ['Review', 'peer feedback, select'], ['3D CAD', 'parts and assembly'], ['2D drawings', 'BS 8888, BOM'], ['Present and reflect', '']], { w: 790, h: 100, fs: 9, label: 'The design process you will follow' }), '')}
${check(['Write a PDS with measurable requirements (“mass under 250 g”, not “light”).', 'Produce several genuinely different initial ideas, then select using a weighted matrix.', 'Record peer feedback and show exactly what you changed because of it.', 'Generate 2D drawings from your 3D model with dimensions, sections and a parts list.'])}
${warn('Use workshop tools, laser cutters and 3D printers only after induction and under supervision, with the correct PPE.')}`;
  }

  const a1 = () => `
${key('Product design specification (PDS)', 'A list of measurable requirements that a successful design must meet. It is written before designing and used to judge ideas and the final solution.')}
${table(['PDS heading', 'Example requirement (phone stand)'], [['User requirements', 'holds phones 65–80 mm wide at a viewing angle of 60–70°'], ['Functions', 'charging cable passes through the base'], ['Aesthetics/finish', 'matte finish, available in 3 colours'], ['Dimensions', 'footprint no larger than 100 × 100 mm'], ['Weight', 'under 250 g'], ['Ergonomics/anthropometrics', 'readable at arm’s length; edges radiused ≥ 2 mm'], ['Manufacturing method', 'suitable for injection moulding in volume'], ['Materials', 'recyclable thermoplastic, e.g. ABS or PP'], ['Cost', 'manufacturing cost under £2.00 per unit at 10,000 units'], ['Quantity', 'batch of 10,000 per year'], ['Safety', 'no sharp edges; stable on a 10° slope'], ['Maintenance', 'wipe clean, no tools needed'], ['Interactions', 'works with common phone cases'], ['Reliability', 'survives 1 m drop test'], ['Legal', 'no infringement of registered designs; meets product safety law; WEEE/environmental rules if electrical'], ['Sustainability', 'refuse, reduce, reuse, repurpose, recycle']])}
${tip('Make each requirement SMART-style – measurable and testable – so you can later prove whether it was met.')}
${fig(S.ladder([['Refuse', 'do not use unnecessary materials or features'], ['Reduce', 'use less material and energy'], ['Reuse', 'design for a second life'], ['Repurpose', 'allow another use'], ['Recycle', 'single-material parts, marked for recycling']], { w: 700, rowH: 42, label: 'The 5 Rs of sustainability' }), '')}`;

  const a2 = () => `
${table(['Material', 'Key properties', 'Typical applications'], [['Low carbon steel', 'strong, tough, ductile, cheap; rusts', 'brackets, frames, car bodies'], ['Aluminium alloy', 'light (≈ 2,700 kg/m³), corrosion resistant, good conductor', 'aircraft parts, heat sinks, casings'], ['Stainless steel', 'corrosion resistant, hygienic', 'food equipment, medical tools'], ['Brass', 'machinable, corrosion resistant', 'fittings, valves'], ['ABS', 'tough, impact resistant, mouldable', 'casings, toys'], ['Polypropylene (PP)', 'flexible, fatigue resistant, chemical resistant', 'living hinges, containers'], ['Acrylic (PMMA)', 'clear, rigid, brittle', 'display panels, light guides'], ['Nylon', 'low friction, wear resistant', 'gears, bushes'], ['Composites (CFRP, GRP)', 'very high strength-to-weight', 'sports equipment, panels'], ['Timber/MDF', 'cheap, easy to work', 'prototypes, fixtures']])}
${tip('Link material choice to your PDS and to Unit 2 properties: strength, stiffness, hardness, toughness, density, corrosion resistance, cost and recyclability.')}`;

  const a3 = () => `
${table(['Process', 'Best for', 'Volume'], [['Injection moulding', 'complex plastic parts', 'high (expensive tooling, cheap per part)'], ['Die casting', 'metal parts (aluminium, zinc)', 'high'], ['Sand casting', 'large metal parts', 'low–medium'], ['CNC machining (milling, turning)', 'accurate metal/plastic parts', 'one-off to medium'], ['Sheet metal (laser cut, press, fold)', 'brackets, enclosures', 'any'], ['3D printing (FDM, SLA, SLS)', 'prototypes, complex low-volume parts', 'one-off to low'], ['Vacuum forming', 'thin plastic shells', 'low–medium'], ['Welding / fastening / adhesives', 'joining parts', 'any']])}
${fig(S.tiles([['One-off', 'bespoke, high cost per unit'], ['Batch', 'set quantities, flexible'], ['Mass', 'continuous, low cost per unit'], ['Continuous', '24/7 process industries']], { w: 760, cols: 4, label: 'Scales of production' }), '')}`;

  const a4 = () => `
${ul(['<strong>Use of information</strong>: respond to the technical criteria, research existing products (strengths and weaknesses), check validity of your findings, use manufacturers’ catalogues and databases (e.g. for bearings, fasteners, motors).', '<strong>Sketching</strong>: freehand 2D and 3D – isometric (30° axes), oblique (front face true, depth at 45°), orthographic (single and linked views), detail drawings; keep good proportion; annotate with technical language.', '<strong>Consider</strong>: fitness for purpose, constraints, aesthetics, ergonomics, sizes, mechanical principles (levers, gears, moments), materials, manufacturing, assembly, cost, bought-out components, and sustainability (life cycle, energy and resources, waste, pollution).'])}
${table(['Weighted selection matrix', 'Weight', 'Idea 1', 'Idea 2', 'Idea 3'], [['Meets function', '3', '4 → 12', '5 → 15', '3 → 9'], ['Manufacturing cost', '3', '3 → 9', '4 → 12', '5 → 15'], ['Ergonomics', '2', '4 → 8', '3 → 6', '2 → 4'], ['Sustainability', '2', '2 → 4', '4 → 8', '3 → 6'], ['Total', '', '33', '41', '34']])}
${tip('Your own matrix should use your PDS headings and explain each score – that turns description into analysis.')}`;

  const a5 = () => `
${table(['Modelling method', 'Use'], [['Card, corrugated card', 'quick form and scale models'], ['MDF, plywood, acrylic', 'stronger models; laser cutting'], ['Clay, Polymorph, plaster', 'organic shapes, ergonomic hand grips'], ['Lego, Fischertechnik, Meccano', 'test mechanisms and movement'], ['3D printing', 'accurate functional prototypes'], ['Laser cutting / CNC', 'precise flat parts, awareness of commercial processes']])}
${formula('Production cost per unit', 'Cost = materials (incl. waste) + labour + equipment share', 'Model in a spreadsheet so you can change one factor and see the effect')}
${example('Spreadsheet cost model (illustrative figures)', 'Idea 2 uses 120 g of ABS at £2.50/kg with 10% waste: 0.120 × 1.10 × 2.50 = <strong>£0.33</strong>. Labour 2 minutes of unskilled assembly at £12/h = <strong>£0.40</strong>. Mould £20,000 shared over 10,000 units = <strong>£2.00</strong>. Total ≈ <strong>£2.73</strong> per unit – above the £2.00 target, so either increase volume or simplify the mould. Changing to 50,000 units cuts the mould share to £0.40.')}`;

  const b1 = () => `
${ul(['<strong>Design review meeting</strong>: present ideas to peers or local businesses; give and receive feedback against the PDS.', '<strong>Using feedback</strong>: record comments, decide which to act on and why, and refine the chosen idea.', '<strong>Selection</strong>: reasoned comparison of ideas against the PDS (e.g. weighted matrix).'])}
${table(['Feedback received', 'Decision', 'Change made'], [['“The base looks unstable on a slope.”', 'accept – links to PDS safety', 'widened the base by 15 mm and added rubber feet'], ['“Make it bright orange.”', 'partly accept – PDS says 3 colours', 'added orange as one option'], ['“Use metal for a premium feel.”', 'reject – conflicts with cost and weight targets', 'kept ABS, added a textured finish']])}`;

  const b2 = () => `
${table(['Command group', 'Examples'], [['Set-up', 'origin, units, snap and grid, file formats (native, STEP, STL, DXF)'], ['Sketch', 'line, arc, circle, centre line, construction line, fillet, dimension'], ['Display', 'pan, zoom, orbit'], ['Edit', 'erase, extend, trim, rotate'], ['3D primitives', 'cube, cylinder'], ['3D creation', 'extrude, revolve'], ['3D modify', 'hole, move face, chamfer, fillet'], ['Boolean', 'union (addition), subtraction, intersection'], ['Assembly', 'place, constrain'], ['Analysis', 'mass properties, stress (simulation)']])}
${fig(S.flow([['2D sketch', 'shape + dimensions'], ['Constraints', 'parallel, tangent, equal'], ['3D feature', 'extrude / revolve'], ['Add features', 'holes, threads, fillets, patterns'], ['Check', 'mass, interference, stress']], { w: 760, h: 92, fs: 11, label: 'Parametric part workflow' }), '')}
${key('Parametric modelling', 'Dimensions and constraints drive the geometry, so changing one value (e.g. base width) automatically updates the model and its drawings.')}`;

  const b3 = () => `
${formula('Mass', 'm = ρ × V', 'ρ density (kg/m³), V volume (m³)')}
${example('Comparing materials for a bracket', 'Bracket volume = 100 × 50 × 20 mm = 100,000 mm³ = 1.0 × 10⁻⁴ m³. Aluminium (ρ ≈ 2,700 kg/m³): m = 2,700 × 1.0 × 10⁻⁴ = <strong>0.27 kg</strong>. Carbon steel (ρ ≈ 7,850 kg/m³): m = 7,850 × 1.0 × 10⁻⁴ = <strong>0.785 kg</strong>. Multiply each mass by the price per kg from a current supplier to compare material cost.')}
${ul(['<strong>3D features</strong>: male and female threads; plain and drilled holes; countersink and counterbore; fillets and chamfers; rectangular and circular patterns.', '<strong>Sketch on faces</strong>, combine solids with Booleans, and modify the model to better meet the PDS.', '<strong>Surface area and volume</strong> from the CAD mass-properties tool help estimate finishing costs (painting, anodising) and material cost.'])}`;

  const b4 = () => `
${key('Degrees of freedom', 'A free body has six: translation in X, Y and Z and rotation about X, Y and Z. Assembly constraints remove degrees of freedom until the part is located correctly.')}
${table(['Constraint', 'Effect'], [['Mate / flush', 'two faces touch or align'], ['Insert / concentric', 'shaft centred in a hole'], ['Angle', 'fixed angle between faces'], ['Tangent', 'curved faces touch'], ['Fixed/grounded', 'base part cannot move']])}
${tip('Use interference checking after assembly – overlaps show parts that would not fit in reality, so modify the components.')}`;

  const c1 = () => `
${table(['2D CAD set-up and drawing skill', 'Detail'], [['Template and title block', 'name, part number, scale, units, projection symbol, tolerance, material, date, revision'], ['Layers', 'create, switch on/off, freeze, lock – e.g. outlines, centre lines, dimensions, hatching'], ['Line types', 'continuous (visible), dashed (hidden), chain (centre lines)'], ['Coordinates', 'absolute (x,y), relative (@dx,dy), polar (@length<angle)'], ['Modify', 'erase, trim, mirror, move, array, copy, undo, stretch, scale, chamfer, fillet'], ['Dimensioning', 'dimension styles, linear, radius, diameter, editing'], ['Views', 'orthographic views at a suitable scale, sectional views with hatching'], ['Assembly drawing', 'general arrangement with balloon references and a parts list (BOM)']])}
${key('BS 8888', 'The UK standard for technical product documentation. State whether you use first- or third-angle projection and show its symbol in the title block.')}
${two('First-angle projection', ul(['plan view below the front view', 'end view from the left placed on the right']), 'Third-angle projection', ul(['plan view above the front view', 'end view from the right placed on the right']))}`;

  const c2 = () => `
${ul(['<strong>Media</strong>: graphical (drawings, renders), written (report), verbal (presentation).', '<strong>Context</strong>: one-to-one, informal group, formal presentation to peers, business or industry.', '<strong>Conduct</strong>: positive attitude, prepared materials, clear language, respond to questions constructively.', '<strong>Negotiation</strong>: when receiving and analysing feedback, explain your reasoning and agree changes.'])}`;

  const d1 = () => `
${table(['PDS requirement', 'Met?', 'Evidence', 'Stage that achieved it / could improve'], [['Mass under 250 g', 'Yes', 'CAD mass 212 g', 'B3 material choice'], ['Stable on 10° slope', 'Partly', 'prototype slid at 8°', 'B1 feedback added feet – test earlier next time'], ['Cost under £2.00', 'No', 'model shows £2.73', 'A5 – simplify mould or increase volume']])}
${fig(S.cycle([['Experience', 'what happened'], ['Reflection', 'what it means'], ['Action', 'what to do next']], { w: 520, h: 300, label: 'ERA cycle' }), '')}
${ul(['<strong>Driscoll’s “What?” model</strong>: What? (describe) → So what? (analyse and learn) → Now what? (actions).', '<strong>Reviewing performance</strong>: strengths, new skills, areas to improve, ability to stay on task and work independently.', '<strong>Tools</strong>: SWOT (strengths, weaknesses, opportunities, threats) or SOAR (strengths, opportunities, aspirations, results).'])}`;

  window.BIZ_GUIDE_DATA = {
    storeKey: 'ra10-guide-revised-EN-aaq-u3', unitLabel: 'Unit 3 Guide', aimWord: 'Aim', aims: ['A', 'B', 'C', 'D'], setTaskTitle: 'The assignment',
    titles: { A: 'PDS and initial ideas', B: '3D modelling', C: 'Engineering drawings and presentation', D: 'Reviewing the design process' },
    subtitles: { A: 'PDS, materials, processes, sketching, modelling and costing', B: 'Peer review, parametric CAD, components and assemblies', C: '2D CAD drawings, BS 8888, BOM and presenting', D: 'Design review and reflective practice' },
    setTask: setTask,
    topics: {
      A: [{ code: 'A1', name: 'Product design specification', html: a1 }, { code: 'A2', name: 'Materials', html: a2 }, { code: 'A3', name: 'Manufacturing processes', html: a3 }, { code: 'A4', name: 'Initial ideas', html: a4 }, { code: 'A5', name: 'Modelling and costing', html: a5 }],
      B: [{ code: 'B1', name: 'Reviewing ideas', html: b1 }, { code: 'B2', name: 'Parametric CAD', html: b2 }, { code: 'B3', name: '3D components', html: b3 }, { code: 'B4', name: 'Assemblies', html: b4 }],
      C: [{ code: 'C1', name: '2D engineering drawings', html: c1 }, { code: 'C2', name: 'Presentation skills', html: c2 }],
      D: [{ code: 'D1–D2', name: 'Review and reflection', html: d1 }]
    },
    gallery: []
  };
})();
