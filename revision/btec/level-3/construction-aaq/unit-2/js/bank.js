/* BTEC Construction (AAQ) Unit 2 — Construction Technology: knowledge checks in the Pearson style. */
(function () {
  'use strict';
  const B = BizBank('CN2', 'AAQ');
  window.__BIZ_B = B;
  const { K, KL } = B;

  /* A — forms, fire, H&S */
  K('A', 'A1 Frames', 'State', 1, 'State one type of structural frame that allows large clear spans with no intermediate columns for a single-storey building.', ['Portal frame (steel, glulam or precast concrete)']);
  K('A', 'A1 Frames', 'Explain', 2, 'Explain one advantage of a steel skeleton frame for an office block.', ['Prefabricated members are erected quickly (1) shortening the programme / allowing early enclosure (1)', 'High strength-to-weight (1) allowing long spans and open-plan floors (1)']);
  K('A', 'A1 Frames', 'Explain', 2, 'Explain one advantage of an in-situ reinforced concrete frame.', ['Inherently fire resistant (1) so less added fire protection needed (1)', 'Can be cast to any shape on site (1) flexible design (1)']);
  K('A', 'A1 Timber frame', 'Explain', 2, 'Explain the difference between open panel and closed panel timber frame systems.', ['Open panels: studs and sheathing only – insulation, services and linings added on site (1)', 'Closed panels: insulation, windows, services and linings installed in the factory (1)']);
  K('A', 'A1 SIPs', 'Describe', 2, 'Describe the construction of a structural insulated panel.', ['A rigid insulation core (1) bonded between two structural facings, usually OSB (1)']);
  K('A', 'A1 Modular', 'Explain', 4, 'Explain two benefits of modular construction for a hotel.', ['Factory production (1) gives better quality control and consistent rooms (1)', 'Faster programme (1) hotel opens and earns income sooner (1)', 'Less site waste and fewer deliveries (1) more sustainable and less disruption (1)', 'Less work at height on site (1) safer (1)']);
  K('A', 'A1 Modular', 'Explain', 2, 'Explain one drawback of volumetric modular construction.', ['Large modules are costly to transport and need big cranes/site access (1) which may be impossible on tight urban sites (1)', 'Design must be fixed early (1) late changes are expensive (1)']);
  K('A', 'A1 Traditional', 'Explain', 2, 'Explain one drawback of traditional on-site construction.', ['Weather-dependent wet trades (1) causing delays and quality variation (1)', 'Labour intensive (1) higher cost and slower (1)']);
  K('A', 'A2 Fire', 'Identify', 1, 'Identify one fire protection method used for structural steelwork.', ['Intumescent paint', 'Concrete encasement', 'Multi-layer fire-resistant plasterboard', 'Masonry encasement']);
  K('A', 'A2 Fire', 'Explain', 2, 'Explain how intumescent paint protects steel in a fire.', ['When heated it swells to form a thick insulating char (1) slowing the temperature rise of the steel so it keeps its strength for longer (1)']);
  K('A', 'A2 Fire', 'Explain', 2, 'Explain the purpose of fire compartmentation in a hotel.', ['Fire-resisting walls, floors and doors contain fire and smoke within one area (1) protecting escape routes and giving time for evacuation (1)']);
  K('A', 'A2 Fire', 'Explain', 4, 'Explain two features of fire doors on hotel corridors.', ['Self/auto-closing (1) so doors are never left open allowing smoke spread (1)', 'Intumescent strips and smoke seals (1) expand in heat to seal gaps (1)', 'Vision panels (1) people can see if the route is clear (1)']);
  K('A', 'A2 Fire', 'Explain', 2, 'Explain the purpose of cavity barriers.', ['They close off concealed cavities in walls/roofs (1) preventing hidden fire and smoke spread through the void (1)']);
  K('A', 'A2 Fire', 'Explain', 2, 'Explain why heat detectors are used in kitchens rather than smoke detectors.', ['Cooking fumes/steam cause false alarms from smoke detectors (1) heat detectors respond to a temperature rise instead (1)']);
  K('A', 'A2 Fire', 'Explain', 2, 'Explain the purpose of refuge areas.', ['A protected place where people who cannot use stairs wait safely (1) for assisted evacuation by staff/fire service (1)']);
  K('A', 'A2 Timber', 'Explain', 2, 'Explain how timber frame walls are protected from fire.', ['Fire-resistant plasterboard linings (often two layers) (1) delay heat reaching the studs (1)']);
  K('A', 'A3 H&S', 'Explain', 2, 'Explain one hazard of lifting operations for modular construction.', ['Dropped or swinging modules (1) can crush workers – use lifting plans, exclusion zones, competent slinger/signaller (1)']);
  K('A', 'A3 H&S', 'Explain', 2, 'Explain one way training helps maintain high standards of health and safety.', ['Workers understand hazards and safe methods (1) reducing accidents / competence proven by CSCS cards (1)']);
  K('A', 'A3 H&S', 'State', 2, 'State two methods of preventing slips, trips and falls on site.', ['Good housekeeping – clear walkways', 'Segregated pedestrian routes', 'Lighting', 'Cover/mark holes', 'Clear spills', 'Store materials safely']);
  K('A', 'A3 CSCS', 'Explain', 2, 'Explain the purpose of CSCS cards.', ['They prove a worker has the required training and qualifications for their role (1) and has passed a health and safety test (1)']);

  /* B — foundations */
  K('B', 'B1 Investigation', 'Explain', 2, 'Explain one benefit of a desk study.', ['Cheap and quick (1) reveals previous uses, mining, flood risk and geology before fieldwork (1)']);
  K('B', 'B1 Investigation', 'Explain', 2, 'Explain one drawback of trial pits.', ['Only shallow depths (around 3–4 m) (1) so deeper strata are not seen / sides may collapse (1)']);
  K('B', 'B1 Investigation', 'Explain', 2, 'Explain the purpose of a plate bearing test.', ['A steel plate is loaded and settlement measured (1) to determine the bearing capacity of the ground (1)']);
  K('B', 'B1 Information', 'Explain', 2, 'Explain why soil is tested for sulphates.', ['Sulphates attack concrete (1) so sulphate-resisting cement may be needed for foundations (1)']);
  K('B', 'B2 Movement', 'Explain', 2, 'Explain what causes ground heave.', ['Clay soils absorb water and swell (1) e.g. after trees are removed (1)']);
  K('B', 'B2 Movement', 'Explain', 2, 'Explain how trees on clay soils affect foundation design.', ['Roots extract water causing clay to shrink (1) so foundations must be deeper (or piled) to below the root zone (1)']);
  K('B', 'B2 Movement', 'Explain', 2, 'Explain what is meant by differential settlement.', ['Different parts of a building settle by different amounts (1) causing cracking and distortion (1)']);
  K('B', 'B2 Part A', 'State', 2, 'State two requirements of Building Regulations Part A for stepped strip foundations.', ['Overlap at least twice the step height', 'Overlap at least 300 mm', 'Step height not greater than foundation thickness', 'Minimum thickness 150 mm']);
  K('B', 'B2 Sloping', 'Explain', 2, 'Explain why solid concrete ground floors are unsuitable on steeply sloping sites.', ['Large amounts of fill would be needed (1) which may settle unevenly causing the slab to crack – use suspended beam and block (1)']);
  K('B', 'B3 Foundations', 'State', 2, 'State two ways that replacement piles transfer building loads to the ground.', ['End bearing on firm strata/rock', 'Friction along the pile shaft']);
  K('B', 'B3 Foundations', 'Explain', 2, 'Explain the difference between replacement and displacement piles.', ['Replacement: soil is bored out and replaced with concrete (1)', 'Displacement: piles are driven, pushing the soil aside (1)']);
  K('B', 'B3 Foundations', 'Explain', 2, 'Explain when a raft foundation would be used.', ['On weak or variable ground/mining areas (1) as the slab spreads the load over the whole footprint reducing differential settlement (1)']);
  K('B', 'B3 Foundations', 'Explain', 2, 'Explain the purpose of a pile cap.', ['Transfers the load from a column/wall to a group of piles (1) spreading it evenly (1)']);
  K('B', 'B3 Foundations', 'Explain', 2, 'Explain the purpose of ground beams.', ['Span between pile caps (1) to support walls above (1)']);
  K('B', 'B4 Excavations', 'State', 2, 'State two ways falls into open excavations can be prevented.', ['Edge protection/barriers', 'Covers over holes', 'Signage and lighting', 'Exclusion zones']);
  K('B', 'B4 Excavations', 'Explain', 2, 'Explain one method of preventing excavation collapse.', ['Trench boxes/sheet piling (1) support the sides (1)', 'Battering back sides (1) to a safe angle (1)']);
  K('B', 'B4 Confined', 'Explain', 2, 'Explain one hazard of working in a confined space.', ['Oxygen depletion/toxic gas (1) can cause unconsciousness or death – gas monitoring and permits needed (1)']);
  K('B', 'B4 Concrete', 'Explain', 4, 'Explain two health risks to workers using in-situ concrete.', ['Cement burns (1) – wet cement is alkaline and burns skin; wear gloves and wash (1)', 'Respiratory problems (1) – cement dust inhaled; use RPE (1)', 'Eye irritation (1) – splashes; eye protection (1)']);

  /* C — superstructure */
  K('C', 'C1 Walls', 'Explain', 2, 'Explain the purpose of the cavity in an external cavity wall.', ['Stops moisture crossing from the outer to inner leaf (1) and contains insulation to reduce heat loss (1)']);
  K('C', 'C1 Walls', 'Explain', 2, 'Explain the purpose of cavity trays and weep holes above openings.', ['Cavity tray collects water running down the cavity (1) and weep holes let it drain outside (1)']);
  K('C', 'C1 Walls', 'Explain', 2, 'Explain one advantage of rainscreen cladding on a solid wall.', ['Insulation on the outside keeps the structure warm (1) and the ventilated gap lets moisture drain/dry (1)']);
  K('C', 'C1 Partitions', 'Explain', 2, 'Explain one advantage of metal stud partitions over blockwork partitions.', ['Lightweight and fast to erect (1) with no wet trades/drying time (1)']);
  K('C', 'C1 Timber frame', 'Explain', 2, 'Explain how interstitial condensation can be avoided in timber frame construction.', ['A vapour control layer on the warm side (behind plasterboard) (1) stops moist air entering the wall where it could condense on cold layers (1)']);
  K('C', 'C1 Openings', 'Explain', 2, 'Explain the purpose of a lintel.', ['Supports the wall above an opening (1) transferring the load to the sides/jambs (1)']);
  K('C', 'C1 Openings', 'Explain', 2, 'Explain why a cavity closer is used at window jambs.', ['Closes the cavity and acts as a vertical DPC (1) and reduces thermal bridging / provides a fire barrier (1)']);
  K('C', 'C2 Floors', 'Explain', 2, 'Explain one advantage of beam and block ground floors.', ['No formwork and quick to lay (1)', 'suspended above ground – suits sloping or heave-prone sites (1)']);
  K('C', 'C2 Floors', 'Describe', 3, 'Describe the layers of a solid concrete ground floor.', ['Compacted hardcore and sand blinding (1)', 'DPM and insulation (1)', 'concrete slab with screed finish (1)']);
  K('C', 'C2 Stairs', 'Explain', 2, 'Explain one advantage of precast concrete stairs in a block of flats.', ['Craned in quickly (1) providing early safe access and inherent fire resistance (1)']);
  K('C', 'C3 Roofs', 'Explain', 4, 'Explain two differences between trussed rafter and traditional cut roofs.', ['Trusses prefabricated in a factory; cut roofs built on site (2)', 'Trusses cheaper/faster, less skill; cut roof needs skilled carpenters (2)', 'Cut roof gives usable loft space; truss webs obstruct it (2)']);
  K('C', 'C3 Flat roofs', 'Sketch', 4, 'Sketch and label a cross-section through a warm deck flat roof.', ['Joists and deck shown (1)', 'Vapour control layer above deck (1)', 'Rigid insulation above VCL (1)', 'Waterproof membrane on top; plasterboard ceiling below (1)']);
  K('C', 'C3 Flat roofs', 'Explain', 2, 'Explain why a cold deck flat roof must be ventilated.', ['Insulation is below the deck so the deck/void is cold (1) and moist air reaching it would condense – ventilation removes the moisture (1)']);
  K('C', 'C3 Falls', 'State', 2, 'State two ways of achieving falls on a flat roof.', ['Firrings', 'Tapered insulation', 'Sloping screed']);
  K('C', 'C4 Finishes', 'Explain', 2, 'Explain one advantage of dry lining over two-coat plaster.', ['No drying time – faster programme (1) / can incorporate insulation (1)']);
  K('C', 'C4 Finishes', 'Explain', 2, 'Explain one advantage of a suspended ceiling in an office.', ['Hides services but allows easy access by lifting tiles (1) and can improve acoustics (1)']);
  K('C', 'C5 Scaffold', 'State', 3, 'State three features of a safe scaffold platform.', ['Main guard rail', 'Intermediate guard rail', 'Toe boards', 'Fully boarded platform', 'Brick guards', 'Safe access – stair tower/ladder', 'Inspection tag']);
  K('C', 'C5 Scaffold', 'Explain', 2, 'Explain why scaffolds must be inspected.', ['To ensure they are safe after erection, alterations or bad weather (1) and at least every 7 days, recorded in a register (1)']);
  K('C', 'C5 PPE', 'State', 3, 'State the three items of PPE required at all times on most sites.', ['Safety helmet', 'High-visibility jacket', 'Safety boots']);
  K('C', 'C5 Procedures', 'Explain', 2, 'Explain the purpose of a toolbox talk.', ['A short, focused safety briefing on a specific task or hazard (1) keeping workers aware and reinforcing safe methods (1)']);

  /* D — sustainability */
  K('D', 'D1 SuDS', 'Explain', 2, 'Explain the purpose of a swale.', ['A shallow vegetated channel (1) that conveys, stores and allows surface water to soak away, reducing flood risk (1)']);
  K('D', 'D1 SuDS', 'Explain', 2, 'Explain the difference between a detention basin and a wet pond.', ['Detention basin is normally dry and fills temporarily in storms (1)', 'wet pond holds water permanently (1)']);
  K('D', 'D1 SuDS', 'Explain', 2, 'Explain how porous block paving reduces flooding.', ['Water passes through gaps into the sub-base (1) where it is stored and infiltrates slowly instead of running off (1)']);
  K('D', 'D2 Renewables', 'Explain', 2, 'Explain one drawback of PV panels in a location with many rainy days.', ['Less sunlight means lower electricity generation (1) so the payback period is longer (1)']);
  K('D', 'D2 Renewables', 'Explain', 2, 'Explain how an air source heat pump works.', ['Extracts heat from outside air using a refrigerant cycle (1) and upgrades it to heat water/space using electricity efficiently (1)']);
  K('D', 'D2 Design', 'Explain', 2, 'Explain how a brise soleil reduces energy use.', ['Shades windows from high summer sun (1) reducing overheating and the need for air conditioning (1)']);
  K('D', 'D2 Design', 'Explain', 2, 'Explain why airtight buildings need controlled ventilation.', ['Airtightness reduces heat loss but traps moisture/pollutants (1) so MVHR provides fresh air while recovering heat (1)']);
  K('D', 'D3 Site', 'Explain', 2, 'Explain one benefit to the environment of segregating construction waste.', ['Materials can be recycled/reused (1) reducing landfill and demand for new raw materials (1)']);
  K('D', 'D3 Site', 'Explain', 2, 'Explain the purpose of a bund around a fuel tank.', ['Contains at least 110% of the tank’s contents if it leaks (1) preventing ground and water contamination (1)']);
  K('D', 'D3 Site', 'State', 2, 'State two methods of reducing dust on a construction site.', ['Damping down', 'Road sweeping', 'Dust suppression on cutting tools', 'Wheel washing', 'Covering stockpiles']);
  K('D', 'D3 Site', 'Explain', 2, 'Explain the purpose of the Considerate Constructors Scheme.', ['A voluntary code encouraging sites to respect the community, environment and workforce (1) improving the image of construction/reducing complaints (1)']);
  KL('D', 'D2 PV', 'Discuss', 9, 'A hotel in a rainy UK location is considering photovoltaic panels to reduce energy costs and CO₂ emissions. Discuss the use of PV panels for the hotel.', ['PV still generates in diffuse light; output lower in rain/winter', 'High daytime demand in hotels uses the electricity on site', 'Reduced bills and CO₂; export payments', 'Capital cost, payback period, roof orientation/shading, structural loads', 'Maintenance low; inverter replacement', 'Alternatives/combination: heat pumps, solar thermal; judgement']);
  KL('A', 'A1 Modular', 'Discuss', 9, 'An architect is deciding whether to use modular construction with brick and timber cladding for a new hotel. Discuss the use of prefabricated modular construction for the hotel.', ['Speed – hotel opens sooner; less weather delay', 'Factory quality, repeatable rooms', 'Transport and crane costs, site access', 'Design inflexibility; interfaces and cladding attachment', 'Safety – less work at height; sustainability – less waste', 'Judgement']);
  KL('B', 'B3 Contaminated', 'Evaluate', 9, 'A new school is to be built on the site of a demolished factory with cellars used to store industrial chemicals. Evaluate the foundation options and the investigations needed.', ['Desk study of past use; intrusive investigation and chemical testing', 'Remediation: removal or capping; ground gas membranes', 'Cellars/obstructions – infill or piles through them', 'Piles to firm strata vs raft; sulphate-resisting concrete', 'Safety in excavations and confined spaces; pollution control', 'Cost and programme; judgement']);
  KL('C', 'C3 Roofs', 'Discuss', 9, 'When designing new housing, an architect is deciding between trussed rafters and a traditional cut roof. Discuss which roof construction method is most suitable.', ['Trussed rafters: cheap, fast, factory quality, less skill, less timber', 'But: webs restrict loft use; must be braced; crane delivery', 'Cut roof: usable room in roof, flexible shapes, repairable', 'But: slower, skilled labour, more timber and cost', 'Sustainability and health and safety at height', 'Judgement for housing developer']);

  window.__BIZ_B = B;
})();
