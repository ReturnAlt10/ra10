/* BTEC Construction (AAQ) Unit 1 — Construction Principles: knowledge checks in the Pearson style. */
(function () {
  'use strict';
  const B = BizBank('CN1', 'AAQ');
  window.__BIZ_B = B;
  const { K, KL } = B;

  /* A — materials */
  K('A', 'A1 Properties', 'Define', 1, 'Define the term tensile strength.', ['The ability of a material to resist being pulled apart / stretched']);
  K('A', 'A1 Properties', 'Explain', 2, 'Explain the difference between toughness and hardness.', ['Toughness: ability to absorb energy/impact without fracturing (1)', 'Hardness: resistance to scratching, abrasion or indentation (1)']);
  K('A', 'A1 Properties', 'Explain', 2, 'Explain what is meant by creep.', ['Slow, permanent deformation of a material (1) under a constant load over a long time (1)']);
  K('A', 'A1 Properties', 'Explain', 2, 'Explain why embodied carbon is important when selecting materials.', ['It is the CO₂ released in extracting, manufacturing and transporting the material (1) so low-carbon materials reduce the building’s contribution to climate change (1)']);
  K('A', 'A2 Glass', 'State', 1, 'Float glass has good light transmission. State one other property of float glass.', ['Flat/smooth surface', 'Transparent/clear', 'Breaks into sharp shards', 'Relatively cheap', 'Brittle']);
  K('A', 'A2 Glass', 'Explain', 6, 'Explain two reasons why laminated glass is suitable for glazed curtain walls on commercial buildings.', ['Interlayer holds fragments if broken (1) protecting people below (1) – safety glazing (1)', 'Security – difficult to break through (1) protects the building (1) from intrusion (1)', 'Acoustic and UV reduction (1) quieter interior/less fading (1) comfort for occupants (1)']);
  K('A', 'A2 Glass', 'Explain', 2, 'Explain how low-emissivity glass reduces heat loss.', ['A thin metal oxide coating reflects long-wave heat radiation back into the room (1) while letting light through, lowering the U-value (1)']);
  K('A', 'A2 Bricks', 'Explain', 2, 'Explain why Class A engineering bricks are used below the DPC.', ['They are very dense with low water absorption (1) so they resist frost damage and rising moisture / high strength (1)']);
  K('A', 'A2 Blocks', 'Explain', 2, 'Explain one advantage of aerated concrete blocks.', ['Good thermal insulation (1) because of air bubbles – meets U-value targets (1)', 'Lightweight (1) easy to handle and cut (1)']);
  K('A', 'A2 Concrete', 'Explain', 2, 'Explain the difference between a prescribed mix and a designed mix.', ['Prescribed: the proportions of ingredients are specified (e.g. 1:2:4) (1)', 'Designed: the performance (e.g. strength) is specified and the supplier designs the mix (1)']);
  K('A', 'A2 Concrete', 'Explain', 4, 'Explain two advantages of graphene-reinforced concrete over steel-reinforced concrete.', ['Much stronger/needs less concrete (1) reducing cement and embodied carbon (1)', 'Graphene does not corrode (1) increasing durability/lifespan (1)', 'More water-resistant (1) less degradation (1)']);
  K('A', 'A2 Concrete', 'Explain', 2, 'Explain how an air-entraining admixture improves concrete.', ['Creates tiny air bubbles (1) which give space for water to expand when it freezes, improving freeze–thaw resistance (1)']);
  K('A', 'A2 Mortar', 'Explain', 2, 'Explain why lime mortar is used on heritage buildings.', ['It is flexible and breathable (1) allowing moisture to escape and movement without cracking soft old bricks/stone (1)']);
  K('A', 'A2 Sand', 'State', 2, 'State the type of sand used for mortar and the type used for concrete.', ['Building (soft) sand – mortar (1)', 'Sharp sand – concrete/screeds (1)']);
  K('A', 'A2 Plasterboard', 'State', 2, 'State two types of plasterboard and their uses.', ['Fire resistant – escape routes/garages', 'Sound block – party walls', 'Thermal – external walls', 'Moisture resistant – bathrooms']);
  K('A', 'A2 Insulation', 'Explain', 2, 'Explain one benefit of sheep’s wool insulation.', ['Natural, renewable and low embodied carbon (1) and breathable / absorbs moisture without losing performance (1)']);
  K('A', 'A2 Timber', 'Explain', 2, 'Explain one advantage of cross-laminated timber (CLT).', ['Strong, stable panels from layers glued at right angles (1) allowing fast prefabricated, low-carbon construction (1)']);
  K('A', 'A2 Metals', 'Explain', 2, 'Explain why stainless steel is used for wall ties.', ['It contains chromium so resists corrosion (1) so ties will not rust and fail inside the cavity (1)']);
  K('A', 'A3 Extraction', 'State', 1, 'State one drawback of extracting materials for making steel.', ['Damage to landscape/habitats from mining', 'High energy use', 'Noise and dust', 'Finite resource', 'Water pollution']);
  K('A', 'A3 Disposal', 'Explain', 2, 'Explain one way steel can be disposed of to increase its sustainability.', ['Recycling in an electric arc furnace (1) uses much less energy than new steel and can be repeated indefinitely (1)', 'Reuse of sections (1) avoids reprocessing energy (1)']);
  K('A', 'A3 Transport', 'Explain', 2, 'Explain why sourcing materials locally improves sustainability.', ['Shorter transport distances (1) reduce fuel use and CO₂ emissions (1)']);
  K('A', 'A4 Degradation', 'Explain', 2, 'Explain how freeze–thaw damages brickwork.', ['Water in pores freezes and expands by ~9% (1) causing the face of bricks to crack and spall (1)']);
  K('A', 'A4 Degradation', 'Explain', 2, 'Explain how sulphate attack damages mortar or concrete.', ['Sulphates react with cement compounds (1) forming expansive products that cause cracking and weakening (1)']);
  K('A', 'A4 Degradation', 'Explain', 2, 'Explain one remedial measure to prevent timber from decaying.', ['Pressure treatment with preservative (1) makes the timber resistant to fungi and insects (1)', 'Keep timber dry/ventilated (1) wet rot needs moisture (1)']);
  K('A', 'A4 Failure', 'Explain', 2, 'Explain one way brickwork can fail.', ['Frost damage/spalling (1) from water freezing in pores', 'Settlement cracking (1) from foundation movement', 'Wall tie corrosion (1) causing bulging/cracks – one for cause, one for effect']);
  K('A', 'A4 Failure', 'Explain', 2, 'Explain why corrosion of reinforcement causes concrete to spall.', ['Rust occupies a larger volume than the steel (1) creating internal pressure that cracks and pushes off the concrete cover (1)']);

  /* B — maths and structures */
  K('B', 'B1 Simultaneous', 'Calculate', 3, 'Two drainage runs are y = 3x − 2 and y = x + 4. Find the coordinates where they intersect.', ['3x − 2 = x + 4 (1)', 'x = 3 (1)', 'y = 7 → (3, 7) (1)']);
  K('B', 'B1 Simultaneous', 'Calculate', 3, 'Solve 2x + 3y = 13 and 4x − y = 5.', ['Multiply/eliminate (1)', 'x = 2 (1)', 'y = 3 (1)']);
  K('B', 'B1 Quadratics', 'Calculate', 3, 'A rectangular slab has length (x + 4) m and width x m. Its area is 45 m². Find x.', ['x² + 4x − 45 = 0 (1)', '(x + 9)(x − 5) = 0 (1)', 'x = 5 m (negative rejected) (1)']);
  K('B', 'B1 Factorising', 'Factorise', 2, 'Factorise ax − ay + bx − by.', ['a(x − y) + b(x − y) (1)', '(a + b)(x − y) (1)']);
  K('B', 'B1 Rearranging', 'Rearrange', 2, 'Rearrange U = 1 / R to make R the subject and find R when U = 0.25.', ['R = 1 / U (1)', 'R = 4 m²K/W (1)']);
  K('B', 'B2 Trigonometry', 'Calculate', 3, 'A roof has a span of 9 m and a pitch of 40°. Calculate the length of a rafter from wall plate to ridge.', ['Half span 4.5 m (1)', 'cos 40° = 4.5 / L (1)', 'L = 5.87 m (1)']);
  K('B', 'B2 Cosine rule', 'Calculate', 3, 'A triangular plot has sides 30 m and 40 m with an included angle of 70°. Find the third side.', ['a² = 30² + 40² − 2(30)(40) cos 70° (1)', '= 2500 − 820.8 = 1679.2 (1)', 'a = 41.0 m (1)']);
  K('B', 'B2 Area', 'Calculate', 2, 'Calculate the area of the plot in the previous question.', ['½ × 30 × 40 × sin 70° (1)', '= 563.8 m² (1)']);
  K('B', 'B2 Radians', 'Calculate', 3, 'A curved kerb has radius 6 m and subtends an angle of 75°. Calculate the arc length.', ['75° = 75 × π/180 = 1.309 rad (1)', 's = rθ = 6 × 1.309 (1)', '= 7.85 m (1)']);
  K('B', 'B3 Mensuration', 'Calculate', 3, 'Calculate the volume of concrete in a cylindrical pile 0.45 m diameter and 8 m deep.', ['r = 0.225 m (1)', 'V = π × 0.225² × 8 (1)', '= 1.27 m³ (1)']);
  K('B', 'B3 Mensuration', 'Calculate', 2, 'Calculate the area of a trapezium-shaped site with parallel sides 20 m and 32 m, 15 m apart.', ['½ (20 + 32) × 15 (1)', '= 390 m² (1)']);
  K('B', 'B4 Statistics', 'Calculate', 2, 'Calculate the mean of these compressive strengths: 32, 35, 31, 36, 34 N/mm².', ['168 ÷ 5 (1)', '= 33.6 N/mm² (1)']);
  K('B', 'B4 Statistics', 'Explain', 2, 'Explain why standard deviation is useful for material test results.', ['It shows how spread out results are around the mean (1) so a low SD shows consistent quality (1)']);
  K('B', 'B4 Statistics', 'Calculate', 2, 'In a pie chart of 360 site incidents, 45 were slips. Calculate the angle for slips.', ['45 ÷ 360 × 360° (1)', '= 45° (1)']);
  K('B', 'B5 Differentiation', 'Differentiate', 2, 'Differentiate y = 4x³ − 6x² + 5x.', ['12x² (1)', '− 12x + 5 (1)']);
  K('B', 'B5 Differentiation', 'Calculate', 4, 'A rectangular enclosure uses 40 m of fencing on three sides against a wall. Find the maximum area.', ['A = x(40 − 2x) = 40x − 2x² (1)', 'dA/dx = 40 − 4x = 0 (1)', 'x = 10 m (1)', 'A = 10 × 20 = 200 m² (1)']);
  K('B', 'B5 Integration', 'Calculate', 3, 'Evaluate ∫₀² (3x² + 2) dx.', ['[x³ + 2x] (1)', '(8 + 4) − 0 (1)', '= 12 (1)']);
  K('B', 'B5 Integration', 'Explain', 1, 'State why a constant of integration is added to an indefinite integral.', ['Any constant differentiates to zero so its value is unknown without limits/conditions']);
  K('B', 'B6 Loads', 'Explain', 4, 'Explain the difference between dead and live loads on a road bridge, giving an example of each.', ['Dead load: permanent weight of the structure (1) e.g. deck, beams, surfacing (1)', 'Live load: variable/moving loads (1) e.g. vehicles, pedestrians, wind, snow (1)']);
  K('B', 'B6 Members', 'Explain', 2, 'Explain the difference between a strut and a tie.', ['A strut is a member in compression (1); a tie is a member in tension (1)']);
  K('B', 'B6 Failure', 'Explain', 2, 'Explain how a slender column can fail by buckling.', ['Under compressive load a long slender column bends sideways (1) at a load lower than its crushing strength (1)']);
  K('B', 'B6 Stress', 'Calculate', 3, 'A concrete column carries 2 400 kN on a cross-section of 0.16 m². Calculate the stress in N/mm².', ['Convert: 2 400 000 N and 160 000 mm² (1)', 'σ = F/A (1)', '= 15 N/mm² (1)']);
  K('B', 'B6 Strain', 'Calculate', 2, 'A 12 m column shortens by 1.2 mm under load. Calculate the strain.', ['ε = ΔL / L = 1.2 / 12 000 (1)', '= 0.0001 / 1 × 10⁻⁴ (1)']);
  K('B', 'B6 Reactions', 'Calculate', 3, 'A 5 m simply supported beam has a 10 kN point load 2 m from support A. Calculate the reactions.', ['Moments about A: RB × 5 = 10 × 2 (1)', 'RB = 4 kN (1)', 'RA = 6 kN (1)']);
  K('B', 'B6 Bending moment', 'Calculate', 2, 'Calculate the maximum bending moment for the beam in the previous question.', ['Under the load: RA × 2 (1)', '= 12 kNm (1)']);
  K('B', 'B6 SF diagram', 'Explain', 2, 'Explain how the shear force diagram identifies the position of maximum bending moment.', ['Maximum bending moment occurs where the shear force is zero / changes sign (1) – usually under a point load (1)']);
  KL('B', 'B5 Optimisation', 'Calculate', 6, 'An open-topped tank is made from a 3 m × 3 m sheet by cutting squares of side x from each corner. Find the value of x that gives maximum volume and the maximum volume.', ['V = x(3 − 2x)²', 'Expand: 9x − 12x² + 4x³', 'dV/dx = 9 − 24x + 12x² = 0', 'x = 0.5 m (x = 1.5 gives zero volume)', 'Second derivative negative → maximum', 'V = 0.5 × 2² = 2 m³']);

  /* C — human comfort */
  K('C', 'C1 Heat', 'State', 1, 'State one cause of heat loss in buildings.', ['Fabric heat loss through walls/roof/floor/windows', 'Ventilation/air changes', 'Thermal bridges', 'Draughts']);
  K('C', 'C1 Heat', 'Explain', 2, 'Explain what is meant by a thermal bridge.', ['A part of the building envelope with higher thermal conductivity, e.g. a steel lintel (1) through which heat escapes more quickly, causing cold spots/condensation (1)']);
  K('C', 'C1 Heat', 'Explain', 3, 'Explain the three mechanisms of heat transfer.', ['Conduction – through solids by vibration of particles (1)', 'Convection – by movement of air/fluid (1)', 'Radiation – by infrared electromagnetic waves (1)']);
  K('C', 'C1 Comfort', 'State', 3, 'State three personal factors that affect thermal comfort.', ['Age', 'Gender', 'Disability', 'Clothing', 'State of health', 'Activity level', 'Metabolic rate']);
  K('C', 'C1 U-values', 'Calculate', 3, 'Calculate the thermal resistance of 100 mm of mineral wool with λ = 0.035 W/mK.', ['R = d / λ (1)', '0.1 / 0.035 (1)', '= 2.86 m²K/W (1)']);
  K('C', 'C1 U-values', 'Calculate', 3, 'A wall has total resistance 4.0 m²K/W, area 20 m², inside 21 °C and outside −1 °C. Calculate the heat loss.', ['U = 1 / 4 = 0.25 W/m²K (1)', 'Q = U × A × ΔT = 0.25 × 20 × 22 (1)', '= 110 W (1)']);
  K('C', 'C1 Condensation', 'Explain', 2, 'Explain the cause of interstitial condensation in buildings.', ['Warm moist air passes into the wall/roof construction (1) and condenses where the temperature falls below the dew point within the structure (1)']);
  K('C', 'C1 Condensation', 'Explain', 2, 'Explain one way humidity in a bathroom can be controlled.', ['Extractor fan (1) removes moist air before it condenses (1)', 'Heating (1) keeps surfaces above dew point (1)']);
  K('C', 'C1 Heating', 'Explain', 2, 'Explain why radiators are often located under windows.', ['Cold air falling from windows creates draughts (1); the rising warm air from the radiator counteracts it, improving comfort (1)']);
  K('C', 'C2 Acoustics', 'Explain', 2, 'Explain the difference between sound insulation and sound absorption.', ['Insulation reduces sound passing between rooms (1)', 'absorption reduces sound reflecting within a room (1)']);
  K('C', 'C2 Acoustics', 'Explain', 2, 'Explain the difference between airborne and impact sound.', ['Airborne: sound travelling through air, e.g. voices (1)', 'Impact: direct contact with the structure, e.g. footsteps (1)']);
  K('C', 'C2 Flanking', 'State', 2, 'State two ways of controlling flanking sound.', ['Seal gaps around services', 'Isolation/acoustic breaks at junctions', 'Independent wall linings', 'Resilient bars/flexible connections', 'Continuous separating walls through ceiling voids']);
  K('C', 'C2 Reverberation', 'Explain', 3, 'Explain why reverberation time must be considered when designing school classrooms.', ['A long reverberation time causes echoes (1)', 'which reduce speech intelligibility (1)', 'so pupils cannot hear the teacher clearly and learning suffers (1)']);
  K('C', 'C2 Source-path-receiver', 'Explain', 3, 'Explain one drawback of the source–path–receiver approach for a new house in an area of future development.', ['The source of future noise (e.g. new roads/industry) is unknown/outside the designer’s control (1)', 'so only the path or receiver can be treated (1)', 'which may be more expensive or less effective (1)']);
  K('C', 'C3 Lighting', 'State', 3, 'State the units for luminous intensity, luminous flux and illuminance.', ['Candela (1)', 'Lumen (1)', 'Lux (1)']);
  K('C', 'C3 Daylight', 'Explain', 2, 'Explain one cause of variations of daylight factors within a room.', ['Distance from the window (1) – sky component falls further into the room', 'Obstructions/reflectance (1) – reduce externally/internally reflected components']);
  K('C', 'C3 Daylight', 'Calculate', 2, 'External illuminance is 10 000 lux and illuminance on a desk is 300 lux. Calculate the daylight factor.', ['300 / 10 000 × 100 (1)', '= 3% (1)']);
  K('C', 'C3 Glare', 'Explain', 2, 'Explain one method of controlling glare in an office.', ['Blinds/louvres (1) reduce direct sunlight on screens', 'Diffusers/indirect lighting (1) reduce bright contrast']);
  K('C', 'C3 Lamps', 'Explain', 2, 'Explain one advantage of LED lighting for a commercial building.', ['High efficiency/low energy (1) reducing running costs and carbon', 'Long life (1) reducing maintenance in high ceilings']);
  KL('C', 'C1 Evaluate', 'Evaluate', 9, 'An architect is designing a new restaurant on the edge of a town next to a busy road. Evaluate the measures that could be used to provide thermal, acoustic and visual comfort for diners.', ['Thermal: insulation, low-e glazing, underfloor heating, controls, ventilation for kitchen heat/humidity', 'Acoustic: sound insulation from road (glazing, mass), absorption inside to control reverberation', 'Visual: daylight factor, glare control, LED lighting with dimming for ambience', 'Cost, sustainability and energy use', 'Personal factors of diners and staff', 'Supported judgement']);
  KL('A', 'A3 Sustainability', 'Evaluate', 9, 'A retailer wants a new supermarket on a brownfield town-centre site built with sustainable materials and methods. Evaluate the materials that could be used.', ['Structural frame: steel (recyclable, high embodied carbon) vs glulam/CLT (low carbon, renewable)', 'Low-carbon concrete/GGBS, recycled aggregates', 'Insulation, low-e glazing, green roof, PV roofing', 'Local sourcing, transport, offsite manufacture', 'Durability, fire, cost, programme', 'Judgement']);

  window.__BIZ_B = B;
})();
