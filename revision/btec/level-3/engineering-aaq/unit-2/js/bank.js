/* BTEC Engineering (AAQ) Unit 2 — Engineering Applications: knowledge checks in the Pearson style. */
(function () {
  'use strict';
  const B = BizBank('EN2', 'AAQ');
  window.__BIZ_B = B;
  const { K, KL } = B;

  /* A — sectors, functions, technologies */
  K('A', 'A1 Sectors', 'State', 1, 'State the engineering sector involved with the design and maintenance of bridges and tunnels.', ['Civil engineering']);
  K('A', 'A1 Sectors', 'State', 1, 'State the engineering sector that designs prosthetic limbs and hospital scanners.', ['Biomedical engineering']);
  K('A', 'A1 Sectors', 'State', 1, 'State the engineering sector that develops robots and advanced sensors.', ['Mechatronic engineering']);
  K('A', 'A2 Functions', 'State', 1, 'State the functional area responsible for creating engineering drawings.', ['Design (of engineering products and services)']);
  K('A', 'A2 Functions', 'State', 1, 'State one activity carried out by the health and safety management functional area.', ['Risk assessment', 'Statutory reporting of accidents (RIDDOR)', 'Emergency planning', 'Safety training', 'Monitoring/inspections']);
  K('A', 'A2 Functions', 'State', 1, 'State the functional area that ensures products comply with required standards.', ['Quality management']);
  K('A', 'A2 Functions', 'Explain', 2, 'Explain the difference between preventative and predictive maintenance.', ['Preventative: servicing at scheduled intervals regardless of condition (1)', 'Predictive: monitoring condition (vibration, temperature) to repair just before failure (1)']);
  K('A', 'A2 Functions', 'Explain', 2, 'Explain the role of energy management in an engineering company.', ['Monitors and controls energy use (1) to cut costs and improve sustainability/reduce emissions (1)']);
  K('A', 'A2 Functions', 'Explain', 2, 'Explain the role of information management.', ['Secure storage, version control and distribution of documents/data (1) so teams work collaboratively from correct, up-to-date information (1)']);
  K('A', 'A3 IoT', 'Explain', 2, 'Explain one benefit of using sensors connected to the Internet of Things.', ['Machine condition is monitored in real time remotely (1) so faults are detected early enabling predictive maintenance and less downtime (1)']);
  K('A', 'A3 Cloud', 'Explain', 2, 'Explain one benefit of using cloud computing.', ['Data accessible from any location (1) enabling collaboration between sites/teams (1)', 'Scalable storage (1) pay for what you use (1)']);
  K('A', 'A3 Cobots', 'Explain', 2, 'Explain one benefit of using cooperative robots (cobots).', ['They work safely alongside people without guarding (1) taking repetitive/heavy tasks and reducing injuries/fatigue (1)']);
  K('A', 'A3 Robots', 'Explain', 2, 'Explain one benefit of using robots in dangerous environments.', ['Robots can operate in toxic, hot or radioactive areas (1) so workers are not exposed to harm (1)']);
  K('A', 'A3 Drones', 'Explain', 2, 'Explain one benefit of using drones in maintenance.', ['Inspect wind turbines/bridges/power lines without working at height (1) faster and safer inspections (1)']);
  K('A', 'A3 3D printing', 'Explain', 3, 'Explain one benefit of using 3D printing in research and development.', ['Prototypes made quickly from CAD (1)', 'so designs are tested and changed rapidly (1)', 'reducing development time and cost (1)']);
  K('A', 'A3 AI', 'Explain', 3, 'Explain one benefit of using artificial intelligence in quality management.', ['AI vision systems inspect every product automatically (1)', 'detecting small defects consistently at line speed (1)', 'reducing scrap/customer returns compared with manual sampling (1)']);
  K('A', 'A3 AR', 'Explain', 2, 'Explain one benefit of augmented reality for maintenance technicians.', ['Step-by-step instructions are overlaid on the real equipment (1) reducing errors and training time (1)']);
  K('A', 'A3 Digital twin', 'Explain', 2, 'Explain what a digital twin is and one benefit.', ['A live virtual replica of a physical system fed by sensor data (1) allowing simulation and predictive maintenance without stopping the real system (1)']);
  K('A', 'A3 VR', 'Explain', 2, 'Explain one drawback of virtual reality in design.', ['Headsets and software are expensive (1) / users cannot feel physical properties of materials, so physical tests are still needed (1)']);
  KL('A', 'A3 VR', 'Discuss', 9, 'Discuss the impact of using virtual reality in the design of engineering products.', ['Immersive visualisation; design reviews with clients', 'Errors found early; fewer physical prototypes', 'Remote collaboration; ergonomic and assembly checks', 'Training and sales demonstrations', 'Cost, skills, motion sickness, lack of tactile feedback', 'Judgement']);
  KL('A', 'A3 IoT', 'Discuss', 9, 'Discuss the impact of IoT and digital twins on maintenance in an energy-generation company.', ['Sensors monitor turbines in real time', 'Predictive maintenance – less downtime and cost', 'Digital twin simulates scenarios before changes', 'Remote monitoring reduces travel and work at height', 'Cyber security risks, data volume, installation cost, skills', 'Judgement']);

  /* B — materials and processes */
  K('B', 'B1 Steel', 'State', 1, 'State the carbon content range of high carbon steel.', ['0.7–1.4% carbon']);
  K('B', 'B1 Steel', 'Explain', 2, 'Explain how increasing carbon content affects steel.', ['Increases hardness and tensile strength (1)', 'but reduces ductility/toughness and weldability (1)']);
  K('B', 'B1 Grains', 'Explain', 2, 'Explain how grain size affects the strength of a metal.', ['Smaller grains give more grain boundaries (1) which block dislocation movement, increasing strength/toughness (1)']);
  K('B', 'B1 Cast iron', 'Explain', 2, 'Explain why cast iron is used for the body of a metalwork vice.', ['Excellent castability for complex shapes (1) and good compressive strength/vibration damping (1)']);
  K('B', 'B1 Titanium', 'Explain', 2, 'Explain why titanium alloy is used for hip implants.', ['Biocompatible and corrosion resistant (1) with high strength-to-weight ratio (1)']);
  K('B', 'B1 Polymers', 'State', 1, 'State the material group to which neoprene belongs.', ['Thermoset elastomer']);
  K('B', 'B1 Polymers', 'Explain', 2, 'Explain the difference in structure between thermoplastics and thermosets.', ['Thermoplastics: long chains with weak intermolecular forces – soften on heating (1)', 'Thermosets: chains cross-linked by strong covalent bonds – cannot be remelted (1)']);
  K('B', 'B1 Polymers', 'Explain', 2, 'Explain one advantage of thermoplastic elastomers over thermoset elastomers.', ['TPEs can be melted and injection moulded/recycled (1) so production is faster and waste can be reused (1)']);
  K('B', 'B1 Composites', 'Explain', 2, 'Explain why CFRP is used for racing car bodies.', ['Very high strength and stiffness-to-weight ratio (1) giving a light, strong, safe structure for better performance (1)']);
  K('B', 'B1 Composites', 'Explain', 2, 'Explain how fibre alignment affects the properties of a composite.', ['Fibres aligned in one direction give high strength in that direction only – anisotropic (1)', 'layers at different angles give more uniform properties (1)']);
  K('B', 'B1 Composites', 'Explain', 2, 'Explain why cemented carbide is used for cutting tool tips.', ['Hard carbide particles give wear resistance (1) while the cobalt matrix adds toughness to resist chipping (1)']);
  K('B', 'B2 Properties', 'Define', 1, 'Define the term electrical resistivity.', ['A measure of how strongly a material opposes electric current (Ωm), independent of shape']);
  K('B', 'B2 Properties', 'Define', 1, 'Define ductility.', ['The ability of a material to be stretched/drawn without breaking – measured by elongation at failure']);
  K('B', 'B2 Properties', 'Explain', 2, 'Explain why strength-to-weight ratio is important in aerospace.', ['Lighter components with the same strength (1) reduce fuel consumption and increase payload/range (1)']);
  K('B', 'B2 Properties', 'State', 2, 'State the hardness scales used for metals and for polymers.', ['Rockwell (or Vickers/Brinell) for metals (1)', 'Shore for polymers/elastomers (1)']);
  K('B', 'B2 Heat treatment', 'Explain', 2, 'Explain one effect of annealing.', ['Slow cooling produces large grains (1) making the metal softer and more ductile/relieving stresses for forming or machining (1)']);
  K('B', 'B2 Heat treatment', 'Explain', 2, 'Explain why hardened steel is tempered.', ['Quenching makes steel very hard but brittle (1) tempering reduces brittleness and increases toughness (1)']);
  K('B', 'B2 Heat treatment', 'Explain', 3, 'Explain how case hardening produces a hard surface on low carbon steel.', ['Steel heated in a carbon-rich environment (1)', 'carbon diffuses into the surface (1)', 'quenching hardens the high-carbon case while the core stays tough (1)']);
  K('B', 'B2 Heat treatment', 'Explain', 2, 'Explain the difference between annealing and normalising.', ['Annealing cools slowly in the furnace – coarse grains, very soft (1)', 'normalising cools in air – finer grains, tougher and stronger (1)']);
  K('B', 'B3 Press work', 'Explain', 2, 'Explain one benefit of blanking sheet metal components on a press.', ['Very fast high-volume production (1) with identical, accurate parts (1)']);
  K('B', 'B3 Forging', 'Explain', 2, 'Explain why drop-forged spanners are stronger than cast ones.', ['Forging aligns the grain flow with the shape (1) and removes porosity, increasing strength/toughness (1)']);
  K('B', 'B3 Casting', 'Explain', 2, 'Explain one advantage of sand casting.', ['Cheap patterns/tooling (1) so economic for low volumes and large or high-melting-point parts like cast iron (1)']);
  K('B', 'B3 Casting', 'Explain', 2, 'Explain one advantage of hot chamber die casting.', ['Very fast cycle times (1) with excellent surface finish and accuracy for high-volume zinc parts (1)']);
  K('B', 'B3 Casting', 'Explain', 2, 'Explain why investment casting is used for titanium turbine blades.', ['It produces complex, accurate shapes with fine detail (1) reducing machining of an expensive, hard-to-machine metal (1)']);
  K('B', 'B3 Moulding', 'Explain', 3, 'Explain why urea formaldehyde is not suitable for a conventional thermoplastic injection moulding machine.', ['UF is a thermoset (1)', 'it cures/cross-links permanently when heated (1)', 'so it would set in the heated barrel/screw – compression moulding is used instead (1)']);
  K('B', 'B3 Moulding', 'Explain', 6, 'Explain three steps in the process of resin transfer moulding.', ['Dry fibre preform placed in a two-part mould (1) shaped to the component (1)', 'Mould closed and clamped (1) so resin cannot escape and both faces are formed (1)', 'Resin injected under pressure/vacuum (1) impregnating the fibres before curing with heat and demoulding (1)']);
  K('B', 'B3 Moulding', 'Explain', 2, 'Explain one drawback of wet lay-up.', ['Labour intensive with variable quality (1) and only one good surface/fumes from open resin (1)']);
  K('B', 'B3 Machining', 'Explain', 2, 'Explain why spindle speed is reduced when drilling large holes in hard materials.', ['Larger drills have a higher cutting speed at the edge (1) so lower rpm prevents overheating and tool wear (1)']);
  K('B', 'B3 Machining', 'Explain', 2, 'Explain one advantage of CNC milling over manual milling.', ['Programmed toolpaths give high accuracy and repeatability (1) suitable for complex shapes and batch production with less operator skill (1)']);
  K('B', 'B3 Cutting', 'Explain', 2, 'Explain one benefit of cutting materials using a water jet.', ['No heat-affected zone (1) so material properties are not changed / cuts almost any material including composites (1)']);
  K('B', 'B3 Cutting', 'Explain', 2, 'Explain one benefit of cutting holes using EDM.', ['Can cut very hard metals (1) because material is removed by sparks, not cutting force (1)']);
  K('B', 'B3 Cutting', 'Explain', 2, 'Explain why a CO₂ laser is used for cutting acrylic sheet.', ['Produces a clean, polished edge (1) with high accuracy for complex shapes (1)']);
  K('B', 'B3 AM', 'Explain', 2, 'Explain one advantage of DMLS for aerospace parts.', ['Complex lightweight internal geometries can be made (1) that are impossible to machine/cast, reducing weight (1)']);
  KL('B', 'B3 Casting', 'Evaluate', 12, 'The body of a metalwork vice is mass-produced from cast iron. Evaluate sand casting and die casting for manufacturing the vice body.', ['Sand casting: low tooling cost, suits cast iron’s high melting point, large parts; rough finish needs machining, slower', 'Die casting: high accuracy and finish, fast; dies expensive, unsuitable for cast iron (high temperature)', 'Volume and cost per unit', 'Mechanical properties and porosity', 'Post-processing/machining of jaws', 'Justified recommendation']);
  KL('B', 'B1 Polymers', 'Evaluate', 12, 'Safety glasses lenses could be made from polycarbonate or acrylic (PMMA). Evaluate the choice of polymer for the lenses.', ['PC: very high impact toughness – safety critical; good light transmission', 'PMMA: excellent clarity and scratch resistance but brittle', 'Processing: both injection mouldable thermoplastics', 'Cost, weight, coatings for scratch resistance', 'Standards for eye protection', 'Recommendation – polycarbonate']);

  K('A', 'A2 Functions', 'Explain', 2, 'Explain the role of process monitoring and control in a chemical plant.', ['Sensors monitor temperature, pressure and flow (1) so the process stays within safe limits and product quality is consistent (1)']);
  K('A', 'A3 Robots', 'Explain', 2, 'Explain one drawback of introducing industrial robots.', ['High capital and programming cost (1) / safety guarding and inflexibility for small batches (1)']);
  K('A', 'A3 AI', 'Explain', 2, 'Explain one use of AI in energy generation.', ['Forecasts demand/wind or solar output from data (1) so generation is scheduled efficiently and grid balanced (1)']);
  K('B', 'B1 Bronze', 'Explain', 2, 'Explain why bronze is used for marine propellers and bearings.', ['Excellent corrosion resistance in seawater (1) and good wear resistance/low friction (1)']);
  K('B', 'B2 Ferromagnetism', 'Explain', 2, 'Explain why ferromagnetism is important for transformer cores.', ['Ferromagnetic materials concentrate magnetic flux (1) giving efficient energy transfer with low losses (1)']);
  K('B', 'B3 Drilling', 'Explain', 2, 'Explain why a workpiece must be clamped when drilling.', ['Prevents the work spinning with the drill (1) which could injure the operator or damage the part/drill (1)']);
  window.__BIZ_B = B;
})();
