/* BTEC Engineering (AAQ) Unit 1 — Engineering Principles: knowledge checks in the Pearson style. */
(function () {
  'use strict';
  const B = BizBank('EN1', 'AAQ');
  window.__BIZ_B = B;
  const { K } = B;

  /* A — maths */
  K('A', 'A1 Indices', 'Simplify', 2, 'Simplify (x³ × x⁵) ÷ x⁴.', ['x⁸ ÷ x⁴ (1)', '= x⁴ (1)']);
  K('A', 'A1 Logs', 'Simplify', 2, 'Simplify log 20 + log 5 − log 10.', ['log (20 × 5 ÷ 10) (1)', '= log 10 = 1 (1)']);
  K('A', 'A1 Logs', 'Prove', 3, 'Given I = I₀e^(−t/τ), show that t = τ ln(I₀/I).', ['I/I₀ = e^(−t/τ) (1)', 'ln(I/I₀) = −t/τ (1)', 't = −τ ln(I/I₀) = τ ln(I₀/I) (1)']);
  K('A', 'A1 Transpose', 'Transpose', 2, 'Transpose v² = u² + 2as to make s the subject.', ['v² − u² = 2as (1)', 's = (v² − u²)/2a (1)']);
  K('A', 'A1 Straight line', 'Calculate', 2, 'A line passes through (1, 3) and (4, 12). Find its equation.', ['m = 9/3 = 3 (1)', 'y = 3x + 0 → y = 3x (1)']);
  K('A', 'A1 Simultaneous', 'Solve', 3, 'Solve 2F₁ + F₂ = 14 and F₁ − F₂ = 1.', ['Add: 3F₁ = 15 (1)', 'F₁ = 5 N (1)', 'F₂ = 4 N (1)']);
  K('A', 'A1 Quadratic', 'Solve', 3, 'Solve 2x² − 5x − 3 = 0.', ['(2x + 1)(x − 3) = 0 (1)', 'x = 3 (1)', 'x = −0.5 (1)']);
  K('A', 'A2 Radians', 'Convert', 2, 'Convert 150° to radians and 1.2 rad to degrees.', ['150 × π/180 = 2.62 rad (1)', '1.2 × 180/π = 68.8° (1)']);
  K('A', 'A2 Arc', 'Calculate', 2, 'A pulley of radius 0.15 m turns through 2.5 rad. Calculate the length of belt that passes over it.', ['s = rθ = 0.15 × 2.5 (1)', '= 0.375 m (1)']);
  K('A', 'A2 Vectors', 'Calculate', 3, 'An aircraft flies north at 220 m/s with a 30 m/s easterly wind. Calculate the resultant velocity and direction.', ['√(220² + 30²) (1)', '= 222 m/s (1)', 'tan⁻¹(30/220) = 7.8° east of north (1)']);
  K('A', 'A2 Cosine rule', 'Calculate', 3, 'Two forces of 40 N and 60 N act with 50° between them. Calculate the resultant (use the cosine rule with included angle 130°).', ['R² = 40² + 60² − 2(40)(60) cos 130° (1)', '= 5200 + 3085 = 8285 (1)', 'R = 91.0 N (1)']);
  K('A', 'A2 Resolve', 'Calculate', 2, 'A 500 N force acts at 35° above the horizontal. Find its horizontal and vertical components.', ['500 cos 35° = 410 N (1)', '500 sin 35° = 287 N (1)']);
  K('A', 'A2 Mensuration', 'Calculate', 2, 'Calculate the total surface area of a closed cylinder with r = 0.1 m and h = 0.5 m.', ['2πr² + 2πrh = 0.0628 + 0.314 (1)', '= 0.377 m² (1)']);
  K('A', 'A3 Differentiate', 'Differentiate', 2, 'Differentiate y = 5x⁴ − 3x² + 7.', ['20x³ (1)', '− 6x (1)']);
  K('A', 'A3 Differentiate', 'Differentiate', 2, 'Differentiate y = 4 sin 2x + 3 cos x.', ['8 cos 2x (1)', '− 3 sin x (1)']);
  K('A', 'A3 Velocity', 'Calculate', 3, 'Displacement s = t³ − 2t² + 5. Find the velocity and acceleration at t = 3 s.', ['v = 3t² − 4t (1)', 'v = 27 − 12 = 15 m/s (1)', 'a = 6t − 4 = 14 m/s² (1)']);
  K('A', 'A3 Integrate', 'Integrate', 2, 'Find ∫ (6x² + 4x − 1) dx.', ['2x³ + 2x² − x (1)', '+ C (1)']);
  K('A', 'A3 Definite', 'Calculate', 3, 'Evaluate ∫₁³ (2x + 1) dx.', ['[x² + x] (1)', '(9 + 3) − (1 + 1) (1)', '= 10 (1)']);
  K('A', 'A3 Work', 'Calculate', 3, 'A spring force is F = 200x N. Calculate the work done stretching it from 0 to 0.1 m.', ['W = ∫ 200x dx = 100x² (1)', '100 × 0.01 (1)', '= 1 J (1)']);
  K('A', 'A3 RMS', 'Calculate', 2, 'A sinusoidal voltage has a peak of 325 V. Calculate its RMS value.', ['V_rms = 325 ÷ √2 (1)', '= 230 V (1)']);

  /* B — mechanical */
  K('B', 'B1 Units', 'State', 1, 'State the unit of measure for mechanical work.', ['Joule (J) / Nm']);
  K('B', 'B1 Units', 'State', 1, 'State the unit of measure for modulus of rigidity.', ['Pascal (Pa) / N/m² (GPa)']);
  K('B', 'B1 Moments', 'Calculate', 3, 'A 6 m beam has a 12 kN point load 2 m from A. Calculate the reactions.', ['RB × 6 = 12 × 2 (1)', 'RB = 4 kN (1)', 'RA = 8 kN (1)']);
  K('B', 'B1 UDL', 'Calculate', 3, 'A 10 m simply supported beam carries a UDL of 3 kN/m along its full length and a 10 kN point load at midspan. Calculate the reactions.', ['Total load = 30 + 10 = 40 kN (1)', 'symmetrical loading (1)', 'RA = RB = 20 kN (1)']);
  K('B', 'B1 Stress', 'Calculate', 3, 'A steel rod 12 mm diameter carries 15 kN. Calculate the direct stress.', ['A = π × 0.006² = 1.131 × 10⁻⁴ m² (1)', 'σ = 15 000 ÷ 1.131 × 10⁻⁴ (1)', '= 132.6 MPa (1)']);
  K('B', 'B1 Strain', 'Calculate', 3, 'The rod above is 2 m long and E = 200 GPa. Calculate the extension.', ['ε = σ/E = 132.6 × 10⁶ ÷ 200 × 10⁹ (1)', '= 6.63 × 10⁻⁴ (1)', 'ΔL = 6.63 × 10⁻⁴ × 2000 = 1.33 mm (1)']);
  K('B', 'B1 Shear', 'Calculate', 3, 'A 10 mm diameter pin in single shear carries 6 kN. Calculate the shear stress.', ['A = π × 0.005² = 7.854 × 10⁻⁵ m² (1)', 'τ = 6000 ÷ 7.854 × 10⁻⁵ (1)', '= 76.4 MPa (1)']);
  K('B', 'B1 Punching', 'Calculate', 4, 'A 20 mm diameter hole is punched in 4 mm plate with ultimate shear stress 350 MPa. Calculate the force required.', ['Shear area = πdt (1)', '= π × 0.02 × 0.004 = 2.513 × 10⁻⁴ m² (1)', 'F = τA = 350 × 10⁶ × 2.513 × 10⁻⁴ (1)', '= 88.0 kN (1)']);
  K('B', 'B2 SUVAT', 'Calculate', 2, 'A car accelerates from 0 to 25 m/s in 9 s. Calculate the acceleration.', ['a = (v − u)/t = 25/9 (1)', '= 2.78 m/s² (1)']);
  K('B', 'B2 SUVAT', 'Calculate', 2, 'The car then slows from 25 m/s to 13 m/s in 6 s. Calculate the distance travelled.', ['s = ½(u + v)t = ½(25 + 13) × 6 (1)', '= 114 m (1)']);
  K('B', 'B2 Torque', 'Calculate', 2, 'A 9 N force is applied 350 mm from the centre of a nut. Calculate the torque.', ['T = Fd = 9 × 0.35 (1)', '= 3.15 Nm (1)']);
  K('B', 'B2 Rotational work', 'Calculate', 2, 'A torque of 4.05 Nm rotates a spanner through 90°. Calculate the work done.', ['θ = π/2 rad (1)', 'W = Tθ = 4.05 × 1.571 = 6.36 J (1)']);
  K('B', 'B2 Energy', 'Calculate', 4, 'A 3 kg hammer falls 4.5 m. Calculate its velocity at impact (ignore air resistance).', ['PE = mgh = 3 × 9.81 × 4.5 = 132.4 J (1)', 'KE = ½mv² (1)', 'v² = 2gh = 88.29 (1)', 'v = 9.40 m/s (1)']);
  K('B', 'B2 Power', 'Calculate', 2, 'A motor lifts 200 kg through 15 m in 20 s. Calculate the useful power.', ['W = mgh = 200 × 9.81 × 15 = 29 430 J (1)', 'P = 29 430/20 = 1 472 W (1)']);
  K('B', 'B2 Efficiency', 'Calculate', 2, 'The motor above takes 2.0 kW of electrical power. Calculate its efficiency.', ['η = 1472 ÷ 2000 × 100 (1)', '= 73.6% (1)']);
  K('B', 'B2 Momentum', 'Calculate', 3, 'A 2 000 kg wagon at 3 m/s hits and couples to a stationary 1 000 kg wagon. Calculate their common velocity.', ['momentum before = 6 000 kg m/s (1)', '(2000 + 1000)v = 6000 (1)', 'v = 2 m/s (1)']);
  K('B', 'B2 Angular', 'Calculate', 3, 'A wheel of radius 0.3 m rotates at 600 rev/min. Calculate its angular velocity and rim speed.', ['ω = 2π × 600/60 = 62.8 rad/s (1)', 'v = ωr (1)', '= 18.8 m/s (1)']);
  K('B', 'B2 Centripetal', 'Calculate', 2, 'Calculate the centripetal acceleration at the rim of the wheel above.', ['a = ω²r = 62.8² × 0.3 (1)', '= 1 184 m/s² (1)']);
  K('B', 'B2 Rotational KE', 'Calculate', 3, 'A flywheel has mass 50 kg, radius of gyration 0.4 m and spins at 30 rad/s. Calculate its kinetic energy.', ['I = mk² = 50 × 0.16 = 8 kg m² (1)', 'KE = ½Iω² (1)', '= 0.5 × 8 × 900 = 3 600 J (1)']);
  K('B', 'B2 Gears', 'Calculate', 3, 'A 10-tooth driver at 300 rev/min meshes with an 18-tooth gear on the same shaft as a 6-tooth gear, which meshes with a 24-tooth output gear. Calculate the output speed.', ['18 T speed = 300 × 10/18 = 166.7 rev/min (1)', '6 T same shaft = 166.7 rev/min (1)', 'output = 166.7 × 6/24 = 41.7 rev/min (1)']);
  K('B', 'B2 Machines', 'Calculate', 3, 'A pulley system has VR 4 and lifts 800 N with an effort of 250 N. Calculate MA and efficiency.', ['MA = 800/250 = 3.2 (1)', 'η = MA/VR (1)', '= 80% (1)']);
  K('B', 'B2 Friction', 'Calculate', 2, 'A 40 kg crate rests on a floor with μ = 0.35. Calculate the force needed to slide it.', ['N = 40 × 9.81 = 392.4 N (1)', 'F = μN = 137.3 N (1)']);
  K('B', 'B2 Newton', 'Explain', 2, 'State Newton’s second law of motion.', ['The resultant force equals mass × acceleration (F = ma) (1)', 'acceleration is in the direction of the resultant force (1)']);
  K('B', 'B3 Density', 'Calculate', 2, 'A block of mass 5.4 kg has a volume of 0.002 m³. Calculate its density and relative density.', ['ρ = 5.4/0.002 = 2 700 kg/m³ (1)', 'RD = 2700/1000 = 2.7 (1)']);
  K('B', 'B3 Pressure', 'Calculate', 2, 'Calculate the pressure 6 m below the surface of water.', ['p = ρgh = 1000 × 9.81 × 6 (1)', '= 58.9 kPa (1)']);
  K('B', 'B3 Thrust', 'Calculate', 4, 'A 0.6 m × 0.5 m vertical door has its top edge 1.2 m below the surface of coolant (ρ = 890 kg/m³), with the 0.6 m side vertical. Calculate the hydrostatic thrust.', ['x̄ = 1.2 + 0.3 = 1.5 m (1)', 'A = 0.3 m² (1)', 'F = ρgAx̄ = 890 × 9.81 × 0.3 × 1.5 (1)', '= 3 929 N (1)']);
  K('B', 'B3 Flow', 'Calculate', 3, 'Water flows at 2 m/s in a 100 mm pipe that tapers to 50 mm. Calculate the flow rate and the velocity in the narrow section.', ['A₁ = π × 0.05² = 7.854 × 10⁻³ m²; V̇ = 0.0157 m³/s (1)', 'A₁v₁ = A₂v₂ (1)', 'v₂ = 2 × (100/50)² = 8 m/s (1)']);
  K('B', 'B3 Buoyancy', 'Calculate', 3, 'A buoy displaces 0.25 m³ of seawater (ρ = 1025 kg/m³). Calculate the upthrust.', ['F_b = ρgV (1)', '= 1025 × 9.81 × 0.25 (1)', '= 2 514 N (1)']);

  /* C — electrical */
  K('C', 'C1 Units', 'State', 1, 'State the unit of measure for reactance.', ['Ohm (Ω)']);
  K('C', 'C1 Units', 'State', 1, 'State the unit of measure for reluctance.', ['Ampere-turns per weber (A/Wb) / H⁻¹']);
  K('C', 'C1 Charge', 'Calculate', 4, 'A conductor on 12 V DC passes 36 C in 0.4 minutes. Calculate its resistance.', ['t = 24 s (1)', 'I = Q/t = 1.5 A (1)', 'R = V/I (1)', '= 8 Ω (1)']);
  K('C', 'C1 Resistivity', 'Calculate', 3, 'Calculate the resistance of 50 m of copper wire (ρ = 1.7 × 10⁻⁸ Ωm) with cross-section 1.5 mm².', ['A = 1.5 × 10⁻⁶ m² (1)', 'R = ρL/A = 1.7 × 10⁻⁸ × 50 ÷ 1.5 × 10⁻⁶ (1)', '= 0.567 Ω (1)']);
  K('C', 'C1 Networks', 'Calculate', 3, 'R2 = 560 Ω and R3 = 56 Ω are in parallel, in series with R1 = 220 Ω, R4 = 33 Ω and R5 = 100 Ω. Calculate the total resistance.', ['R2 ∥ R3 = 31 360/616 = 50.9 Ω (1)', '220 + 50.9 + 33 + 100 (1)', '= 403.9 Ω (1)']);
  K('C', 'C1 Power', 'Calculate', 2, 'A 24 Ω heater is connected to 230 V. Calculate the power.', ['P = V²/R = 52 900/24 (1)', '= 2 204 W (1)']);
  K('C', 'C1 Capacitance', 'Calculate', 3, 'Plates of area 1.125 × 10⁻³ m² are separated by 2 mm of glass with εᵣ = 7. Calculate the capacitance.', ['C = ε₀εᵣA/d (1)', '= 8.85 × 10⁻¹² × 7 × 1.125 × 10⁻³ ÷ 0.002 (1)', '= 3.48 × 10⁻¹¹ F (34.8 pF) (1)']);
  K('C', 'C1 Capacitors', 'Calculate', 3, 'A 10 µF and a 15 µF capacitor are in series with a 4 µF capacitor in parallel across the pair. Calculate total capacitance.', ['Series: 10 × 15/25 = 6 µF (1)', 'parallel: 6 + 4 (1)', '= 10 µF (1)']);
  K('C', 'C1 Energy', 'Calculate', 2, 'Calculate the energy stored in a 470 µF capacitor charged to 50 V.', ['W = ½CV² = 0.5 × 470 × 10⁻⁶ × 2500 (1)', '= 0.588 J (1)']);
  K('C', 'C1 RC', 'Calculate', 3, 'A 100 µF capacitor discharges through 20 kΩ from 1000 V. Calculate the voltage after 3 s.', ['τ = RC = 2 s (1)', 'v = 1000 e^(−3/2) (1)', '= 223 V (1)']);
  K('C', 'C1 Field', 'Calculate', 2, 'Two plates 5 mm apart have 200 V between them. Calculate the electric field strength.', ['E = V/d = 200/0.005 (1)', '= 40 000 V/m (1)']);
  K('C', 'C1 Kirchhoff', 'State', 2, 'State Kirchhoff’s current and voltage laws.', ['KCL: total current into a junction equals total current out (1)', 'KVL: around a closed loop the sum of emfs equals the sum of potential drops (1)']);
  K('C', 'C2 Magnetism', 'Calculate', 4, 'A 200-turn coil carries 3 A around a bar 250 mm long, area 0.4 m², μᵣ = 1000. Show that B ≈ 3.02 T.', ['H = NI/l = 600/0.25 = 2 400 A/m (1)', 'B = μ₀μᵣH (1)', '= 4π × 10⁻⁷ × 1000 × 2400 (1)', '= 3.02 T (1)']);
  K('C', 'C2 Flux', 'Calculate', 2, 'Calculate the magnetic flux for B = 3.02 T and A = 0.4 m².', ['Φ = BA (1)', '= 1.21 Wb (1)']);
  K('C', 'C2 Reluctance', 'Calculate', 2, 'An mmf of 600 A produces a flux of 1.2 mWb. Calculate the reluctance.', ['S = F_m/Φ = 600 ÷ 1.2 × 10⁻³ (1)', '= 5 × 10⁵ A/Wb (1)']);
  K('C', 'C2 Induction', 'Calculate', 2, 'A 0.5 m conductor moves at 8 m/s through a 0.6 T field. Calculate the induced emf.', ['E = Blv (1)', '= 0.6 × 0.5 × 8 = 2.4 V (1)']);
  K('C', 'C2 Self inductance', 'Calculate', 2, 'Current in a 0.25 H coil falls from 4 A to 0 in 0.02 s. Calculate the average induced emf.', ['E = L di/dt = 0.25 × 4/0.02 (1)', '= 50 V (1)']);
  K('C', 'C2 Inductor energy', 'Calculate', 2, 'Calculate the energy stored in a 0.5 H inductor carrying 2 A.', ['W = ½LI² (1)', '= 1 J (1)']);
  K('C', 'C2 Transformer', 'Calculate', 3, 'A transformer has 1 150 primary and 180 secondary turns on a 230 V RMS supply. Calculate the secondary voltage.', ['V₂ = V₁ × N₂/N₁ (1)', '= 230 × 180/1150 (1)', '= 36 V (1)']);
  K('C', 'C3 Waveform', 'Calculate', 2, 'A waveform has a period of 0.02 s and peak of 3 V. State the frequency and peak-to-peak voltage.', ['f = 1/T = 50 Hz (1)', 'peak-to-peak = 6 V (1)']);
  K('C', 'C3 Reactance', 'Calculate', 2, 'Calculate the reactance of a 0.2 H inductor at 50 Hz.', ['X_L = 2πfL (1)', '= 62.8 Ω (1)']);
  K('C', 'C3 Reactance', 'Calculate', 2, 'Calculate the reactance of a 22 µF capacitor at 50 Hz.', ['X_C = 1/(2πfC) (1)', '= 144.7 Ω (1)']);
  K('C', 'C3 Impedance', 'Calculate', 7, 'A coil with resistance 560 Ω on a 230 V, 50 Hz supply draws 0.12 A. Calculate its inductance.', ['Z = V/I (1)', '= 1 916.7 Ω (1)', 'X_L = √(Z² − R²) (1)', '= √(1916.7² − 560²) (1)', '= 1 833 Ω (1)', 'L = X_L/2πf (1)', '= 5.83 H (1)']);
  K('C', 'C3 Phase', 'Explain', 2, 'Explain the phase relationship between current and voltage in a pure inductor and a pure capacitor.', ['Inductor: current lags voltage by 90° (1)', 'Capacitor: current leads voltage by 90° (1)']);
  K('C', 'C3 Form factor', 'Calculate', 2, 'For a sine wave of peak 10 V, calculate RMS and average values.', ['RMS = 7.07 V (1)', 'average = 6.37 V (1)']);

  window.__BIZ_B = B;
})();
