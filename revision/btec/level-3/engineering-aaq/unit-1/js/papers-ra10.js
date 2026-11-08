/* BTEC Engineering (AAQ) Unit 1 — RA10 practice papers.
   Same layout as the Pearson sample: 2 hours 15 minutes, 90 marks; Section A mechanical (Q1–11, 45 marks) and
   Section B electrical/electronic (Q12–22, 45 marks). Short answers and multi-step calculations; diagrams are described in words.
   Use g = 9.81 m/s², ε₀ = 8.85 × 10⁻¹² F/m, μ₀ = 4π × 10⁻⁷ H/m. Mark schemes are RA10’s own. */
(function () {
  'use strict';
  function Q(n, sec, ctx, parts) {
    return parts.map((p, i) => ({ q: n, sub: p[0], marks: p[1], section: sec, ctx: i === 0 ? ctx : (p[4] || []), text: p[2], ms: { body: p[3], levels: null } }));
  }
  const L = (...lines) => lines.join('\n');
  const M = (...pts) => L('Method and answer marks:', ...pts.map(x => '• ' + x), 'Accept equivalent methods; award method marks if a numerical slip is carried forward correctly.');
  function paper(n, title, blurb, qs) {
    const items = [].concat(...qs);
    return { id: 'EN1-R' + String(n).padStart(2, '0'), unit: 1, key: 'R' + String(n).padStart(2, '0'), source: 'ra10', spec: 'ra10', kind: 'exam', code: 'RA10',
      series: 'RA10 Paper ' + n, date: 'RA10 practice paper ' + n, title, blurb, minutes: 135, items, total: items.reduce((s, x) => s + x.marks, 0) };
  }
  const papers = [];

  /* ---------- Paper 1 ---------- */
  papers.push(paper(1, 'Gears · SUVAT · hydrostatic door · floating cylinder · incline work · RL impedance · Kirchhoff', 'Mechanical and electrical principles with full multi-step calculations.', [
    Q(1, 'A', [], [['', 1, 'State the unit of measure for power.', L('Award one mark for:', '• watt (W) / J/s')]]),
    Q(2, 'A', [], [['', 1, 'State the unit of measure for shear stress.', L('Award one mark for:', '• pascal (Pa) / N/m²')]]),
    Q(3, 'A', ['A compound gear train: a 12-tooth driver rotating at 400 rev/min meshes with a 36-tooth gear. A 15-tooth gear on the same shaft as the 36-tooth gear meshes with a 45-tooth output gear.'], [['', 3, 'Calculate the speed of the output gear.', M('36 T speed = 400 × 12/36 = 133.3 rev/min (1)', '15 T on same shaft = 133.3 rev/min (1)', 'output = 133.3 × 15/45 = 44.4 rev/min (1)')]]),
    Q(4, 'A', ['A train accelerates uniformly from 5 m/s to 20 m/s in 12 s.'], [
      ['a', 2, 'Calculate the acceleration of the train using v = u + at.', M('a = (20 − 5)/12 (1)', '= 1.25 m/s² (1)')],
      ['b', 2, 'The train then decelerates from 20 m/s to 8 m/s in 10 s. Calculate the distance travelled while decelerating.', M('s = ½(u + v)t = ½(20 + 8) × 10 (1)', '= 140 m (1)')]
    ]),
    Q(5, 'A', ['A boat is steered east at 4 m/s across a river that flows south at 1.5 m/s.'], [['', 3, 'Calculate the resultant velocity of the boat and its direction.', M('R = √(4² + 1.5²) = √18.25 (1)', '= 4.27 m/s (1)', 'θ = tan⁻¹(1.5/4) = 20.6° south of east (1)')]]),
    Q(6, 'A', ['A spanner applies a force of 15 N at 250 mm from the centre of a bolt.'], [
      ['a', 2, 'Calculate the torque on the bolt.', M('T = Fd = 15 × 0.25 (1)', '= 3.75 Nm (1)')],
      ['b', 2, 'Calculate the work done when the bolt is turned through two complete revolutions.', M('θ = 2 × 2π = 12.57 rad (1)', 'W = Tθ = 3.75 × 12.57 = 47.1 J (1)')]
    ]),
    Q(7, 'A', ['A tank holds oil of density 850 kg/m³. A vertical rectangular door is 0.8 m high and 0.5 m wide. Its top edge is 1.0 m below the oil surface.'], [['', 4, 'Calculate the hydrostatic thrust on the door.', M('x̄ = 1.0 + 0.4 = 1.4 m (1)', 'A = 0.8 × 0.5 = 0.4 m² (1)', 'F = ρgAx̄ = 850 × 9.81 × 0.4 × 1.4 (1)', '= 4 670 N (1)')]]),
    Q(8, 'A', ['A solid cylinder of radius 0.3 m and height 1.0 m floats upright in fresh water (1000 kg/m³) with 60% of its volume submerged.'], [['', 6, 'Calculate the mass and the density of the cylinder.', M('V = πr²h = π × 0.09 × 1.0 = 0.2827 m³ (1)', 'submerged volume = 0.6 × 0.2827 = 0.1696 m³ (1)', 'upthrust = weight (floating) (1)', 'mass = ρ_water × V_sub = 1000 × 0.1696 (1)', '= 169.6 kg (1)', 'density = 169.6/0.2827 = 600 kg/m³ (1)')]]),
    Q(9, 'A', ['A 2 kg mass is released from rest 6 m above the ground.'], [['', 4, 'Calculate its velocity as it hits the ground, ignoring air resistance.', M('PE = mgh = 2 × 9.81 × 6 = 117.7 J (1)', 'PE lost = KE gained: ½mv² (1)', 'v² = 2gh = 117.72 (1)', 'v = 10.85 m/s (1)')]]),
    Q(10, 'A', ['A punch moves according to s = 2t² + 3t − 1, where s is in metres and t in seconds.'], [
      ['a', 3, 'Determine the instantaneous velocity of the punch when t = 1.5 s.', M('v = ds/dt = 4t + 3 (2)', 'v = 9 m/s (1)')],
      ['b', 5, 'The punch makes 25 mm diameter holes in 5 mm plate. The ultimate shear strength of the plate is 280 MPa. Calculate the force needed to punch a hole.', M('shear area = πdt (1)', '= π × 0.025 × 0.005 (1)', '= 3.927 × 10⁻⁴ m² (1)', 'F = τA = 280 × 10⁶ × 3.927 × 10⁻⁴ (1)', '= 110 kN (1)')]
    ]),
    Q(11, 'A', ['A car of mass 1000 kg accelerates from 5 m/s to 15 m/s while travelling 200 m up a road inclined at 10° to the horizontal. A constant resistance of 400 N opposes motion.'], [['', 7, 'Calculate the total work done by the car’s engine.', M('ΔKE = ½ × 1000 × (15² − 5²) (1)', '= 100 000 J (1)', 'height gained = 200 sin 10° = 34.73 m (1)', 'ΔPE = 1000 × 9.81 × 34.73 = 340 700 J (1)', 'work against resistance = 400 × 200 = 80 000 J (1)', 'total = ΔKE + ΔPE + friction work (1)', '= 520 700 J ≈ 521 kJ (1)')]]),
    Q(12, 'B', [], [['', 1, 'State the unit of measure for inductance.', L('Award one mark for:', '• henry (H)')]]),
    Q(13, 'B', [], [['', 1, 'State the unit of measure for magnetic flux.', L('Award one mark for:', '• weber (Wb)')]]),
    Q(14, 'B', ['A sinusoidal voltage rises from 0 to +5 V, falls to −5 V and returns to 0 V in 0.01 s.'], [
      ['a', 1, 'Determine the amplitude of the voltage.', L('Award one mark for:', '• 5 V')],
      ['b', 1, 'Determine the time period of the voltage.', L('Award one mark for:', '• 0.01 s (10 ms)')]
    ]),
    Q(15, 'B', ['The voltage across a discharging capacitor is V = V₀e^(−t/RC).'], [
      ['a', 3, 'Prove, using the laws of logarithms, that t = RC ln(V₀/V).', M('V/V₀ = e^(−t/RC) (1)', 'ln(V/V₀) = −t/RC (1)', 't = −RC ln(V/V₀) = RC ln(V₀/V) (1)')],
      ['b', 3, 'A capacitor has plates of area 2 × 10⁻³ m² separated by 1 mm of dielectric with relative permittivity 5. Calculate the capacitance.', M('C = ε₀εᵣA/d (1)', '= 8.85 × 10⁻¹² × 5 × 2 × 10⁻³ ÷ 1 × 10⁻³ (1)', '= 8.85 × 10⁻¹¹ F (88.5 pF) (1)')]
    ]),
    Q(16, 'B', ['A transformer has 2000 primary turns and is supplied at 230 V RMS. The required output is 120 V.'], [['', 3, 'Calculate the number of secondary turns needed.', M('V₁/V₂ = N₁/N₂ (1)', 'N₂ = 2000 × 120/230 (1)', '= 1 043 turns (1)')]]),
    Q(17, 'B', ['A coil of 500 turns carries 2 A. It is wound on a bar of mean length 0.4 m, cross-sectional area 0.02 m² and relative permeability 800.'], [
      ['a', 4, 'Prove that the flux density in the bar is approximately 2.51 T.', M('H = NI/l = 500 × 2/0.4 (1)', '= 2 500 A/m (1)', 'B = μ₀μᵣH = 4π × 10⁻⁷ × 800 × 2500 (1)', '= 2.51 T (1)')],
      ['b', 2, 'Calculate the magnetic flux in the bar.', M('Φ = BA = 2.51 × 0.02 (1)', '= 0.0503 Wb (1)')]
    ]),
    Q(18, 'B', ['A 9 V network: R1 = 100 Ω in series with a parallel pair R2 = 220 Ω and R3 = 330 Ω, followed by R4 = 47 Ω and R5 = 68 Ω in series.'], [['', 3, 'Calculate the total resistance of the network.', M('R2 ∥ R3 = (220 × 330)/(550) (1)', '= 132 Ω (1)', 'total = 100 + 132 + 47 + 68 = 347 Ω (1)')]]),
    Q(19, 'B', ['A conductor is connected to a 24 V DC supply. A charge of 90 C flows in 1.5 minutes.'], [['', 4, 'Calculate the resistance of the conductor.', M('t = 90 s (1)', 'I = Q/t = 1 A (1)', 'R = V/I (1)', '= 24 Ω (1)')]]),
    Q(20, 'B', ['A coil with resistance 400 Ω is connected to a 230 V, 50 Hz supply and draws 0.2 A.'], [['', 7, 'Determine the inductance of the coil.', M('Z = V/I (1)', '= 230/0.2 = 1 150 Ω (1)', 'X_L = √(Z² − R²) (1)', '= √(1150² − 400²) (1)', '= 1 078 Ω (1)', 'L = X_L/(2πf) (1)', '= 1078/314.2 = 3.43 H (1)')]]),
    Q(21, 'B', ['A 470 µF capacitor charged to 500 V is discharged through a 10 kΩ resistor.'], [['', 6, 'Calculate the time constant, the voltage after 5 s and the energy initially stored.', M('τ = RC = 10 000 × 470 × 10⁻⁶ = 4.7 s (1)', 'v = 500e^(−5/4.7) (1)', '= 172.6 V (1)', 'W = ½CV² (1)', '= 0.5 × 470 × 10⁻⁶ × 500² (1)', '= 58.75 J (1)')]]),
    Q(22, 'B', ['Two sources share a load: the left loop has E1 = 12 V and R1 = 4 Ω; the right loop has E2 = 6 V and R2 = 2 Ω; both currents flow through a shared R3 = 6 Ω. Take I1 and I2 as the branch currents through R1 and R2, so I1 + I2 flows through R3.'], [['', 6, 'Use Kirchhoff’s laws to calculate I1, I2 and the current in R3.', M('Loop 1: 12 = 4I1 + 6(I1 + I2) → 10I1 + 6I2 = 12 (1)', 'Loop 2: 6 = 2I2 + 6(I1 + I2) → 6I1 + 8I2 = 6 (1)', 'solve simultaneously (1)', 'I1 = 1.36 A (1)', 'I2 = −0.27 A (flows opposite to the assumed direction) (1)', 'I3 = 1.09 A (1)')]])
  ]));

  /* ---------- Paper 2 ---------- */
  papers.push(paper(2, 'Chain drive · lift motion · sluice gate · floating sphere · ramp work · RC impedance', 'Rotational speed, vectors, buoyancy, shear in a pin, inclined planes, transformers and capacitive AC circuits.', [
    Q(1, 'A', [], [['', 1, 'State the unit of measure for torque.', L('Award one mark for:', '• newton metre (Nm)')]]),
    Q(2, 'A', [], [['', 1, 'State the unit of measure for Young’s modulus.', L('Award one mark for:', '• pascal (Pa) / N/m² (GPa)')]]),
    Q(3, 'A', ['A 48-tooth chain sprocket rotating at 60 rev/min drives a 16-tooth sprocket on a wheel of diameter 0.7 m.'], [['', 3, 'Calculate the linear speed of the wheel rim.', M('wheel speed = 60 × 48/16 = 180 rev/min (1)', 'ω = 2π × 180/60 = 18.85 rad/s (1)', 'v = ωr = 18.85 × 0.35 = 6.60 m/s (1)')]]),
    Q(4, 'A', ['A lift accelerates uniformly from rest to 3 m/s in 2 s.'], [
      ['a', 2, 'Calculate the acceleration of the lift.', M('a = (3 − 0)/2 (1)', '= 1.5 m/s² (1)')],
      ['b', 2, 'The lift then decelerates from 3 m/s to rest in 1.5 s. Calculate the distance travelled while decelerating.', M('s = ½(3 + 0) × 1.5 (1)', '= 2.25 m (1)')]
    ]),
    Q(5, 'A', ['Two cables pull on a post: 300 N east and 400 N north.'], [['', 3, 'Calculate the resultant force and its direction.', M('R = √(300² + 400²) (1)', '= 500 N (1)', 'θ = tan⁻¹(400/300) = 53.1° north of east (1)')]]),
    Q(6, 'A', ['A belt applies a force of 160 N to a pulley of radius 0.3 m on a motor shaft.'], [
      ['a', 2, 'Calculate the torque on the shaft.', M('T = Fr = 160 × 0.3 (1)', '= 48 Nm (1)')],
      ['b', 2, 'The shaft rotates at 1500 rev/min. Calculate the power transmitted.', M('ω = 2π × 1500/60 = 157.1 rad/s (1)', 'P = Tω = 48 × 157.1 = 7.54 kW (1)')]
    ]),
    Q(7, 'A', ['A vertical sluice gate is 1.2 m wide and 1.0 m high. Its top edge is 2 m below the surface of fresh water.'], [['', 4, 'Calculate the hydrostatic thrust on the gate.', M('x̄ = 2 + 0.5 = 2.5 m (1)', 'A = 1.2 m² (1)', 'F = 1000 × 9.81 × 1.2 × 2.5 (1)', '= 29 430 N (1)')]]),
    Q(8, 'A', ['A hollow sphere of radius 0.25 m floats in seawater (1025 kg/m³) with 40% of its volume submerged.'], [['', 6, 'Calculate the mass of the sphere and its average density.', M('V = ⁴⁄₃πr³ = ⁴⁄₃π × 0.25³ = 0.06545 m³ (1)', 'submerged volume = 0.4 × 0.06545 = 0.02618 m³ (1)', 'floating: weight = upthrust (1)', 'mass = 1025 × 0.02618 (1)', '= 26.8 kg (1)', 'density = 26.8/0.06545 = 410 kg/m³ (1)')]]),
    Q(9, 'A', ['A 0.5 kg ball is thrown vertically upwards at 12 m/s.'], [['', 4, 'Calculate the maximum height reached, ignoring air resistance.', M('KE = ½ × 0.5 × 12² = 36 J (1)', 'KE = PE at top (1)', 'h = 36/(0.5 × 9.81) (1)', '= 7.34 m (1)')]]),
    Q(10, 'A', ['The angular displacement of a shaft is θ = 3t² + 2t radians.'], [
      ['a', 3, 'Determine the angular velocity when t = 2 s.', M('ω = dθ/dt = 6t + 2 (2)', '= 14 rad/s (1)')],
      ['b', 5, 'A coupling uses an 8 mm diameter pin in double shear to transmit a force of 12 kN. Calculate the shear stress in the pin.', M('A for one shear plane = π × 0.004² = 5.027 × 10⁻⁵ m² (1)', 'double shear: area = 2 × 5.027 × 10⁻⁵ (1)', '= 1.005 × 10⁻⁴ m² (1)', 'τ = F/A = 12 000/1.005 × 10⁻⁴ (1)', '= 119 MPa (1)')]
    ]),
    Q(11, 'A', ['A crate of mass 80 kg is pushed at constant speed 5 m up a ramp inclined at 20°. The coefficient of friction is 0.3 and the push is parallel to the ramp.'], [['', 7, 'Calculate the push force and the work done.', M('weight = 80 × 9.81 = 784.8 N (1)', 'normal reaction = 784.8 cos 20° = 737.5 N (1)', 'friction = 0.3 × 737.5 = 221.2 N (1)', 'component down slope = 784.8 sin 20° = 268.4 N (1)', 'push = 221.2 + 268.4 (1)', '= 489.6 N (1)', 'work = 489.6 × 5 = 2 448 J (1)')]]),
    Q(12, 'B', [], [['', 1, 'State the unit of measure for capacitance.', L('Award one mark for:', '• farad (F)')]]),
    Q(13, 'B', [], [['', 1, 'State the unit of measure for magnetomotive force.', L('Award one mark for:', '• ampere (ampere-turns, A)')]]),
    Q(14, 'B', ['A sinusoidal voltage has a peak value of 12 V and completes one cycle every 0.025 s.'], [
      ['a', 1, 'Determine the amplitude of the voltage.', L('Award one mark for:', '• 12 V')],
      ['b', 1, 'Determine the frequency.', L('Award one mark for:', '• 40 Hz')]
    ]),
    Q(15, 'B', ['A capacitor charges according to Vc = V(1 − e^(−t/τ)).'], [
      ['a', 3, 'Prove that t = −τ ln(1 − Vc/V).', M('Vc/V = 1 − e^(−t/τ) (1)', 'e^(−t/τ) = 1 − Vc/V (1)', '−t/τ = ln(1 − Vc/V) → t = −τ ln(1 − Vc/V) (1)')],
      ['b', 3, 'A 220 µF capacitor charges through 10 kΩ. Calculate the time to reach 80% of the supply voltage.', M('τ = 10 000 × 220 × 10⁻⁶ = 2.2 s (1)', 't = −2.2 ln(0.2) (1)', '= 3.54 s (1)')]
    ]),
    Q(16, 'B', ['A step-down transformer has 920 primary turns and 46 secondary turns. It is supplied at 230 V.'], [['', 3, 'Calculate the secondary voltage.', M('V₂ = V₁N₂/N₁ (1)', '= 230 × 46/920 (1)', '= 11.5 V (1)')]]),
    Q(17, 'B', ['A toroid has 300 turns carrying 1.5 A. Its mean length is 0.3 m, area 5 × 10⁻⁴ m² and relative permeability 600.'], [
      ['a', 4, 'Prove that the flux density is approximately 1.13 T.', M('H = 300 × 1.5/0.3 (1)', '= 1 500 A/m (1)', 'B = 4π × 10⁻⁷ × 600 × 1500 (1)', '= 1.13 T (1)')],
      ['b', 2, 'Calculate the magnetic flux.', M('Φ = BA = 1.13 × 5 × 10⁻⁴ (1)', '= 5.65 × 10⁻⁴ Wb (1)')]
    ]),
    Q(18, 'B', ['A network has R1 = 47 Ω in series with R2 = 100 Ω ∥ R3 = 100 Ω, in series with R4 = 150 Ω ∥ R5 = 300 Ω.'], [['', 3, 'Calculate the total resistance.', M('R2 ∥ R3 = 50 Ω (1)', 'R4 ∥ R5 = 45 000/450 = 100 Ω (1)', 'total = 47 + 50 + 100 = 197 Ω (1)')]]),
    Q(19, 'B', ['A conductor on a 9 V supply passes 54 C in 2 minutes.'], [['', 4, 'Calculate the resistance of the conductor.', M('t = 120 s (1)', 'I = 54/120 = 0.45 A (1)', 'R = V/I (1)', '= 20 Ω (1)')]]),
    Q(20, 'B', ['A 10 µF capacitor is in series with a 200 Ω resistor on a 230 V, 50 Hz supply.'], [['', 7, 'Calculate the capacitive reactance, impedance, current and phase angle.', M('X_C = 1/(2πfC) (1)', '= 1/(2π × 50 × 10 × 10⁻⁶) = 318.3 Ω (1)', 'Z = √(200² + 318.3²) (1)', '= 375.9 Ω (1)', 'I = 230/375.9 = 0.612 A (1)', 'φ = tan⁻¹(318.3/200) (1)', '= 57.9° (current leading) (1)')]]),
    Q(21, 'B', ['A 0.8 H inductor carries 3 A. The current falls to zero in 0.05 s when switched off.'], [['', 6, 'Calculate the average induced emf and the energy stored, and explain the direction of the emf.', M('E = L ΔI/Δt (1)', '= 0.8 × 3/0.05 = 48 V (1)', 'W = ½LI² (1)', '= 0.5 × 0.8 × 9 = 3.6 J (1)', 'Lenz’s law: induced emf opposes the change in current (1)', 'so it tries to keep current flowing / causes a spark at the switch (1)')]]),
    Q(22, 'B', ['A network has E1 = 10 V with R1 = 5 Ω, E2 = 4 V with R2 = 2 Ω, and a shared resistor R3 = 4 Ω carrying I1 + I2.'], [['', 6, 'Use Kirchhoff’s laws to calculate I1, I2 and the current through R3.', M('Loop 1: 10 = 5I1 + 4(I1 + I2) → 9I1 + 4I2 = 10 (1)', 'Loop 2: 4 = 2I2 + 4(I1 + I2) → 4I1 + 6I2 = 4 (1)', 'solve simultaneously (1)', 'I1 = 1.16 A (1)', 'I2 = −0.11 A (1)', 'I3 = 1.05 A (1)')]])
  ]));

  /* ---------- Paper 3 ---------- */
  papers.push(paper(3, 'Idler gear · cyclist · square door · pontoon · roller coaster · flywheel · RL power', 'Gear trains with idlers, energy conservation, stress–strain, rotational dynamics and RL circuits.', [
    Q(1, 'A', [], [['', 1, 'State the unit of measure for kinetic energy.', L('Award one mark for:', '• joule (J)')]]),
    Q(2, 'A', [], [['', 1, 'State the unit of measure for moment of inertia.', L('Award one mark for:', '• kg m²')]]),
    Q(3, 'A', ['A 24-tooth driver gear rotating at 900 rev/min drives a 72-tooth gear through a 30-tooth idler gear.'], [['', 3, 'Calculate the output speed and state the effect of the idler.', M('output = 900 × 24/72 (1)', '= 300 rev/min (1)', 'idler changes direction of rotation but not the speed ratio (1)')]]),
    Q(4, 'A', ['A cyclist accelerates uniformly from 2 m/s to 8 m/s in 4 s.'], [
      ['a', 2, 'Calculate the acceleration.', M('a = (8 − 2)/4 (1)', '= 1.5 m/s² (1)')],
      ['b', 2, 'Calculate the distance travelled during this time.', M('s = ½(2 + 8) × 4 (1)', '= 20 m (1)')]
    ]),
    Q(5, 'A', ['A ship heads north at 10 m/s and a current pushes it west at 3 m/s.'], [['', 3, 'Calculate the resultant velocity and its direction.', M('R = √(10² + 3²) (1)', '= 10.4 m/s (1)', 'θ = tan⁻¹(3/10) = 16.7° west of north (1)')]]),
    Q(6, 'A', ['A torque wrench applies 60 N at 0.5 m.'], [
      ['a', 2, 'Calculate the torque.', M('T = 60 × 0.5 (1)', '= 30 Nm (1)')],
      ['b', 2, 'Calculate the work done turning the nut through 120°.', M('θ = 120 × π/180 = 2.094 rad (1)', 'W = 30 × 2.094 = 62.8 J (1)')]
    ]),
    Q(7, 'A', ['A square door 0.5 m × 0.5 m is in the vertical wall of a water tank. Its top edge is 2.5 m below the surface.'], [['', 4, 'Calculate the hydrostatic thrust on the door.', M('x̄ = 2.75 m (1)', 'A = 0.25 m² (1)', 'F = 1000 × 9.81 × 0.25 × 2.75 (1)', '= 6 744 N (1)')]]),
    Q(8, 'A', ['A rectangular pontoon 3 m long, 2 m wide and 1 m deep floats in fresh water with 0.4 m submerged.'], [['', 6, 'Calculate the mass of the pontoon and the maximum extra load it can carry before it is fully submerged.', M('displaced volume = 3 × 2 × 0.4 = 2.4 m³ (1)', 'mass = 1000 × 2.4 = 2 400 kg (1)', 'total volume = 6 m³ (1)', 'maximum displacement mass = 6 000 kg (1)', 'extra load = 6 000 − 2 400 (1)', '= 3 600 kg (35.3 kN) (1)')]]),
    Q(9, 'A', ['A roller-coaster car of mass 500 kg starts from rest at a height of 20 m and runs down to a point 5 m above the ground.'], [['', 4, 'Calculate its speed at the lower point, ignoring friction.', M('height lost = 15 m (1)', 'mgh = ½mv² (1)', 'v = √(2 × 9.81 × 15) (1)', '= 17.2 m/s (1)')]]),
    Q(10, 'A', ['A slider moves with s = 4t³ − t² metres.'], [
      ['a', 3, 'Determine the velocity when t = 1 s.', M('v = 12t² − 2t (2)', '= 10 m/s (1)')],
      ['b', 5, 'A steel bar 2 m long and 20 mm diameter carries a tensile load of 50 kN. E = 200 GPa. Calculate the stress and extension.', M('A = π × 0.01² = 3.142 × 10⁻⁴ m² (1)', 'σ = 50 000/3.142 × 10⁻⁴ = 159.2 MPa (1)', 'ε = σ/E (1)', '= 7.96 × 10⁻⁴ (1)', 'ΔL = 7.96 × 10⁻⁴ × 2000 = 1.59 mm (1)')]
    ]),
    Q(11, 'A', ['A flywheel of mass 80 kg and radius of gyration 0.5 m accelerates uniformly from rest to 300 rev/min in 10 s.'], [['', 7, 'Calculate the angular acceleration, the torque required and the final kinetic energy.', M('I = mk² = 80 × 0.25 = 20 kg m² (1)', 'ω = 2π × 300/60 = 31.42 rad/s (1)', 'α = ω/t = 3.142 rad/s² (1)', 'T = Iα (1)', '= 62.8 Nm (1)', 'KE = ½Iω² (1)', '= 0.5 × 20 × 31.42² = 9 870 J (1)')]]),
    Q(12, 'B', [], [['', 1, 'State the unit of measure for conductance.', L('Award one mark for:', '• siemens (S)')]]),
    Q(13, 'B', [], [['', 1, 'State the unit of measure for electric field strength.', L('Award one mark for:', '• volts per metre (V/m) / N/C')]]),
    Q(14, 'B', ['A sinusoidal voltage has a peak-to-peak value of 10 V and a period of 4 ms.'], [
      ['a', 1, 'Determine the amplitude.', L('Award one mark for:', '• 5 V')],
      ['b', 1, 'Determine the frequency.', L('Award one mark for:', '• 250 Hz')]
    ]),
    Q(15, 'B', ['The temperature rise of a motor winding is modelled by 3 = e^(0.5t).'], [
      ['a', 3, 'Using logarithms, show that t = 2 ln 3 and evaluate t.', M('take natural logs: ln 3 = 0.5t (1)', 't = ln 3/0.5 = 2 ln 3 (1)', '= 2.20 (1)')],
      ['b', 3, 'An air-spaced capacitor has plates of area 0.01 m² separated by 0.5 mm. Calculate its capacitance.', M('C = ε₀A/d (εᵣ = 1) (1)', '= 8.85 × 10⁻¹² × 0.01/5 × 10⁻⁴ (1)', '= 1.77 × 10⁻¹⁰ F (177 pF) (1)')]
    ]),
    Q(16, 'B', ['A step-up transformer has 400 primary turns and a 12 V input. A 230 V output is required.'], [['', 3, 'Calculate the number of secondary turns.', M('N₂ = N₁V₂/V₁ (1)', '= 400 × 230/12 (1)', '= 7 667 turns (1)')]]),
    Q(17, 'B', ['An air-cored solenoid has 1000 turns, length 0.25 m and carries 0.5 A. Its cross-sectional area is 4 × 10⁻⁴ m².'], [
      ['a', 4, 'Prove that the flux density is approximately 2.51 mT.', M('H = 1000 × 0.5/0.25 (1)', '= 2 000 A/m (1)', 'B = μ₀H = 4π × 10⁻⁷ × 2000 (1)', '= 2.51 × 10⁻³ T (1)')],
      ['b', 2, 'Calculate the magnetic flux.', M('Φ = BA = 2.51 × 10⁻³ × 4 × 10⁻⁴ (1)', '= 1.01 × 10⁻⁶ Wb (1)')]
    ]),
    Q(18, 'B', ['A network: R1 = 1 kΩ in series with R2 = 2.2 kΩ ∥ R3 = 3.3 kΩ, in series with R4 = 470 Ω and R5 = 330 Ω.'], [['', 3, 'Calculate the total resistance.', M('R2 ∥ R3 = (2.2 × 3.3)/5.5 = 1.32 kΩ (1)', 'sum = 1000 + 1320 + 470 + 330 (1)', '= 3 120 Ω (1)')]]),
    Q(19, 'B', ['A 60 W lamp operates on 230 V for 5 hours.'], [['', 4, 'Calculate the current, the lamp’s resistance and the energy used in kWh.', M('I = P/V = 0.261 A (1)', 'R = V²/P (1)', '= 882 Ω (1)', 'energy = 0.06 × 5 = 0.3 kWh (1)')]]),
    Q(20, 'B', ['A coil with R = 30 Ω and L = 0.1 H is connected to a 240 V, 50 Hz supply.'], [['', 7, 'Calculate the impedance, current, phase angle and power dissipated.', M('X_L = 2π × 50 × 0.1 = 31.4 Ω (1)', 'Z = √(30² + 31.4²) (1)', '= 43.4 Ω (1)', 'I = 240/43.4 = 5.52 A (1)', 'φ = tan⁻¹(31.4/30) = 46.3° lagging (1)', 'P = I²R (1)', '= 5.52² × 30 = 915 W (1)')]]),
    Q(21, 'B', ['A 47 µF capacitor charges through a 100 kΩ resistor from a 12 V supply.'], [['', 6, 'Calculate the time constant, the voltage after one time constant and the approximate time to fully charge.', M('τ = RC = 100 000 × 47 × 10⁻⁶ (1)', '= 4.7 s (1)', 'v = 12(1 − e⁻¹) (1)', '= 7.59 V (1)', 'fully charged ≈ 5τ (1)', '= 23.5 s (1)')]]),
    Q(22, 'B', ['A network has E1 = 9 V with R1 = 3 Ω, E2 = 6 V with R2 = 6 Ω, and a shared R3 = 3 Ω carrying I1 + I2.'], [['', 6, 'Use Kirchhoff’s laws to find I1, I2 and the current in R3.', M('Loop 1: 9 = 3I1 + 3(I1 + I2) → 6I1 + 3I2 = 9 (1)', 'Loop 2: 6 = 6I2 + 3(I1 + I2) → 3I1 + 9I2 = 6 (1)', 'solve simultaneously (1)', 'I1 = 1.4 A (1)', 'I2 = 0.2 A (1)', 'I3 = 1.6 A (1)')]])
  ]));

  /* ---------- Paper 4 ---------- */
  papers.push(paper(4, 'Gearbox · free fall · dam gate · floating cube · wagon collision · decibels · RC filter', 'Momentum and energy loss, hydrostatic thrust, aluminium strain, magnetic circuits and RC impedance.', [
    Q(1, 'A', [], [['', 1, 'State the unit of measure for momentum.', L('Award one mark for:', '• kg m/s (Ns)')]]),
    Q(2, 'A', [], [['', 1, 'State the unit of measure for pressure.', L('Award one mark for:', '• pascal (Pa)')]]),
    Q(3, 'A', ['A motor at 1440 rev/min drives a 20-tooth gear meshing with an 80-tooth gear. A 25-tooth gear on the same shaft meshes with a 75-tooth output gear.'], [['', 3, 'Calculate the output speed.', M('first stage: 1440 × 20/80 = 360 rev/min (1)', 'same shaft: 25 T at 360 rev/min (1)', 'output = 360 × 25/75 = 120 rev/min (1)')]]),
    Q(4, 'A', ['An object is dropped from rest and falls freely for 2.5 s.'], [
      ['a', 2, 'Calculate its velocity after 2.5 s.', M('v = u + at = 0 + 9.81 × 2.5 (1)', '= 24.5 m/s (1)')],
      ['b', 2, 'Calculate the distance fallen.', M('s = ½at² = 0.5 × 9.81 × 2.5² (1)', '= 30.7 m (1)')]
    ]),
    Q(5, 'A', ['A load is pulled by 120 N north and 50 N west.'], [['', 3, 'Calculate the resultant force and its direction.', M('R = √(120² + 50²) (1)', '= 130 N (1)', 'θ = tan⁻¹(50/120) = 22.6° west of north (1)')]]),
    Q(6, 'A', ['A force of 25 N is applied to a crank of radius 0.2 m.'], [
      ['a', 2, 'Calculate the torque.', M('T = 25 × 0.2 (1)', '= 5 Nm (1)')],
      ['b', 2, 'The crank turns at 120 rev/min. Calculate the power.', M('ω = 2π × 120/60 = 12.57 rad/s (1)', 'P = Tω = 62.8 W (1)')]
    ]),
    Q(7, 'A', ['A rectangular dam gate is 2 m wide and 1.5 m high. Its top edge is 3 m below the water surface.'], [['', 4, 'Calculate the hydrostatic thrust on the gate.', M('x̄ = 3 + 0.75 = 3.75 m (1)', 'A = 3 m² (1)', 'F = 1000 × 9.81 × 3 × 3.75 (1)', '= 110 400 N (110 kN) (1)')]]),
    Q(8, 'A', ['A wooden cube of side 0.5 m and density 650 kg/m³ floats in fresh water.'], [['', 6, 'Calculate the mass of the cube and the depth to which it sinks.', M('V = 0.5³ = 0.125 m³ (1)', 'mass = 650 × 0.125 = 81.25 kg (1)', 'floating: displaced mass = 81.25 kg (1)', 'displaced volume = 81.25/1000 = 0.08125 m³ (1)', 'depth = 0.08125/(0.5 × 0.5) (1)', '= 0.325 m (1)')]]),
    Q(9, 'A', ['A spring stores 40 J and launches a 0.2 kg ball vertically upwards.'], [['', 4, 'Calculate the maximum height of the ball, ignoring losses.', M('spring energy = PE gained (1)', '40 = mgh (1)', 'h = 40/(0.2 × 9.81) (1)', '= 20.4 m (1)')]]),
    Q(10, 'A', ['The velocity of a slide is v = 3t² − 6t m/s.'], [
      ['a', 3, 'Determine the acceleration when t = 4 s.', M('a = dv/dt = 6t − 6 (2)', '= 18 m/s² (1)')],
      ['b', 5, 'An aluminium bar 1.5 m long with cross-section 400 mm² carries 20 kN. E = 70 GPa. Calculate the stress and the extension.', M('A = 4 × 10⁻⁴ m² (1)', 'σ = 20 000/4 × 10⁻⁴ = 50 MPa (1)', 'ε = 50 × 10⁶/70 × 10⁹ (1)', '= 7.14 × 10⁻⁴ (1)', 'ΔL = 7.14 × 10⁻⁴ × 1500 = 1.07 mm (1)')]
    ]),
    Q(11, 'A', ['A 1500 kg wagon moving at 4 m/s collides with and couples to a stationary 500 kg wagon.'], [['', 7, 'Calculate the common velocity after the collision and the kinetic energy lost.', M('momentum before = 1500 × 4 = 6 000 kg m/s (1)', 'conservation: 2000v = 6000 (1)', 'v = 3 m/s (1)', 'KE before = ½ × 1500 × 16 = 12 000 J (1)', 'KE after = ½ × 2000 × 9 = 9 000 J (1)', 'loss = 3 000 J (1)', '= 25% of the original KE (sound, heat, deformation) (1)')]]),
    Q(12, 'B', [], [['', 1, 'State the unit of measure for resistivity.', L('Award one mark for:', '• ohm metre (Ωm)')]]),
    Q(13, 'B', [], [['', 1, 'State the unit of measure for permittivity.', L('Award one mark for:', '• farads per metre (F/m)')]]),
    Q(14, 'B', ['The UK mains supply is 230 V RMS at 50 Hz.'], [
      ['a', 1, 'Determine the peak voltage.', L('Award one mark for:', '• 230 × √2 = 325 V')],
      ['b', 1, 'Determine the time period.', L('Award one mark for:', '• 0.02 s (20 ms)')]
    ]),
    Q(15, 'B', ['Amplifier gain in decibels is G = 10 log₁₀(P₂/P₁).'], [
      ['a', 3, 'Show that doubling the power gives a gain of approximately 3 dB.', M('P₂/P₁ = 2 (1)', 'G = 10 log₁₀ 2 (1)', '= 3.01 dB (1)')],
      ['b', 3, 'A 4.7 µF and a 10 µF capacitor are connected in series to a 50 V supply. Calculate the total capacitance and the charge stored.', M('C = (4.7 × 10)/(14.7) (1)', '= 3.20 µF (1)', 'Q = CV = 3.20 × 10⁻⁶ × 50 = 1.60 × 10⁻⁴ C (1)')]
    ]),
    Q(16, 'B', ['A distribution transformer steps 11 kV down to 415 V. The primary has 1500 turns.'], [['', 3, 'Calculate the number of secondary turns.', M('N₂ = N₁V₂/V₁ (1)', '= 1500 × 415/11 000 (1)', '= 57 turns (56.6) (1)')]]),
    Q(17, 'B', ['A magnetic core has a flux of 2.4 mWb across a rectangular cross-section 30 mm × 40 mm.'], [
      ['a', 4, 'Prove that the flux density is 2 T.', M('A = 0.03 × 0.04 (1)', '= 1.2 × 10⁻³ m² (1)', 'B = Φ/A = 2.4 × 10⁻³/1.2 × 10⁻³ (1)', '= 2.0 T (1)')],
      ['b', 2, 'The mmf is 800 A. Calculate the reluctance of the core.', M('S = F_m/Φ = 800/2.4 × 10⁻³ (1)', '= 3.33 × 10⁵ A/Wb (1)')]
    ]),
    Q(18, 'B', ['A network: R1 = 10 Ω in series with R2 = 15 Ω ∥ R3 = 30 Ω, in series with R4 = 20 Ω ∥ R5 = 20 Ω.'], [['', 3, 'Calculate the total resistance.', M('R2 ∥ R3 = 450/45 = 10 Ω (1)', 'R4 ∥ R5 = 10 Ω (1)', 'total = 10 + 10 + 10 = 30 Ω (1)')]]),
    Q(19, 'B', ['A 12 V battery delivers 2 A for 30 minutes.'], [['', 4, 'Calculate the charge delivered, the energy supplied and the load resistance.', M('Q = It = 2 × 1800 = 3 600 C (1)', 'W = QV = 3600 × 12 (1)', '= 43 200 J (43.2 kJ) (1)', 'R = 12/2 = 6 Ω (1)')]]),
    Q(20, 'B', ['A 2.2 µF capacitor and a 1 kΩ resistor are in series with a 10 V, 1 kHz supply.'], [['', 7, 'Calculate the reactance, impedance, current and phase angle.', M('X_C = 1/(2π × 1000 × 2.2 × 10⁻⁶) (1)', '= 72.3 Ω (1)', 'Z = √(1000² + 72.3²) (1)', '= 1 003 Ω (1)', 'I = 10/1003 = 9.97 mA (1)', 'φ = tan⁻¹(72.3/1000) (1)', '= 4.1° leading (1)')]]),
    Q(21, 'B', ['A 400-turn coil links a flux that falls from 5 mWb to 1 mWb in 20 ms. A current of 2 A produces the 5 mWb flux.'], [['', 6, 'Calculate the average induced emf, the inductance of the coil and the energy stored at 2 A.', M('E = N ΔΦ/Δt = 400 × 4 × 10⁻³/0.02 (1)', '= 80 V (1)', 'L = NΦ/I = 400 × 5 × 10⁻³/2 (1)', '= 1 H (1)', 'W = ½LI² (1)', '= 2 J (1)')]]),
    Q(22, 'B', ['A network has E1 = 15 V with R1 = 5 Ω, E2 = 5 V with R2 = 5 Ω, and a shared R3 = 10 Ω carrying I1 + I2.'], [['', 6, 'Use Kirchhoff’s laws to calculate I1, I2 and the current in R3.', M('Loop 1: 15 = 5I1 + 10(I1 + I2) → 15I1 + 10I2 = 15 (1)', 'Loop 2: 5 = 5I2 + 10(I1 + I2) → 10I1 + 15I2 = 5 (1)', 'solve simultaneously (1)', 'I1 = 1.4 A (1)', 'I2 = −0.6 A (1)', 'I3 = 0.8 A (1)')]])
  ]));

  /* ---------- Paper 5 ---------- */
  papers.push(paper(5, 'Inclined plane · braking train · circular door · buoy · lift motor · transformer efficiency', 'Machines, braking forces, shear in rivets, reluctance, coil impedance and capacitor networks.', [
    Q(1, 'A', [], [['', 1, 'State the unit of measure for angular velocity.', L('Award one mark for:', '• radians per second (rad/s)')]]),
    Q(2, 'A', [], [['', 1, 'State the unit of measure for direct strain.', L('Award one mark for:', '• no unit (dimensionless ratio)')]]),
    Q(3, 'A', ['A load of 1200 N is pushed up an inclined plane 6 m long that rises 1.5 m, using an effort of 400 N.'], [['', 3, 'Calculate the velocity ratio, mechanical advantage and efficiency.', M('VR = 6/1.5 = 4 (1)', 'MA = 1200/400 = 3 (1)', 'η = MA/VR = 75% (1)')]]),
    Q(4, 'A', ['A train travelling at 30 m/s brakes uniformly to rest in 50 s.'], [
      ['a', 2, 'Calculate the deceleration.', M('a = (0 − 30)/50 (1)', '= −0.6 m/s² (1)')],
      ['b', 2, 'Calculate the braking distance.', M('s = ½(30 + 0) × 50 (1)', '= 750 m (1)')]
    ]),
    Q(5, 'A', ['A crane hook has a horizontal force of 600 N and a vertical force of 800 N acting on it.'], [['', 3, 'Calculate the resultant force and its angle above the horizontal.', M('R = √(600² + 800²) (1)', '= 1 000 N (1)', 'θ = tan⁻¹(800/600) = 53.1° (1)')]]),
    Q(6, 'A', ['A cyclist pushes with 300 N on a pedal crank 0.17 m long.'], [
      ['a', 2, 'Calculate the torque.', M('T = 300 × 0.17 (1)', '= 51 Nm (1)')],
      ['b', 2, 'Calculate the work done in one complete revolution with this torque.', M('θ = 2π rad (1)', 'W = 51 × 2π = 320 J (1)')]
    ]),
    Q(7, 'A', ['A circular door of diameter 0.6 m is in the vertical side of an oil tank (ρ = 900 kg/m³). Its centre is 2 m below the surface.'], [['', 4, 'Calculate the hydrostatic thrust on the door.', M('A = π × 0.3² = 0.2827 m² (1)', 'x̄ = 2 m (centroid at centre) (1)', 'F = 900 × 9.81 × 0.2827 × 2 (1)', '= 4 992 N (1)')]]),
    Q(8, 'A', ['A hollow steel buoy has a total volume of 0.5 m³ and a mass of 200 kg. It floats in seawater (1025 kg/m³).'], [['', 6, 'Calculate the maximum extra load the buoy can support before it is fully submerged.', M('maximum upthrust = 1025 × 9.81 × 0.5 (1)', '= 5 028 N (1)', 'weight of buoy = 200 × 9.81 = 1 962 N (1)', 'extra load = 5028 − 1962 (1)', '= 3 066 N (1)', '≈ 312 kg (1)')]]),
    Q(9, 'A', ['A 1200 kg car travelling at 20 m/s brakes to rest over 40 m.'], [['', 4, 'Calculate the kinetic energy and the average braking force.', M('KE = ½ × 1200 × 20² (1)', '= 240 000 J (1)', 'work done by brakes = F × s (1)', 'F = 240 000/40 = 6 000 N (1)')]]),
    Q(10, 'A', ['A vibrating component moves with x = 5 sin 2t cm, t in seconds (radians).'], [
      ['a', 3, 'Determine its velocity when t = 0.', M('v = dx/dt = 10 cos 2t (2)', '= 10 cm/s at t = 0 (1)')],
      ['b', 5, 'A 6 mm diameter rivet in single shear fails at 8.5 kN. Calculate the ultimate shear stress.', M('A = π × 0.003² (1)', '= 2.827 × 10⁻⁵ m² (1)', 'τ = F/A (1)', '= 8500/2.827 × 10⁻⁵ (1)', '= 301 MPa (1)')]
    ]),
    Q(11, 'A', ['A lift of mass 800 kg is raised 30 m at constant speed in 25 s by a motor that is 80% efficient.'], [['', 7, 'Calculate the work done, the useful output power and the electrical input power.', M('W = mgh (1)', '= 800 × 9.81 × 30 = 235 440 J (1)', 'P_out = W/t (1)', '= 9 418 W (1)', 'η = P_out/P_in (1)', 'P_in = 9418/0.8 (1)', '= 11 770 W (11.8 kW) (1)')]]),
    Q(12, 'B', [], [['', 1, 'State the unit of measure for frequency.', L('Award one mark for:', '• hertz (Hz)')]]),
    Q(13, 'B', [], [['', 1, 'State the unit of measure for electric charge.', L('Award one mark for:', '• coulomb (C)')]]),
    Q(14, 'B', ['A sinusoidal voltage of peak 50 V completes two cycles in 0.1 s.'], [
      ['a', 1, 'Determine the amplitude.', L('Award one mark for:', '• 50 V')],
      ['b', 1, 'Determine the frequency.', L('Award one mark for:', '• 20 Hz')]
    ]),
    Q(15, 'B', ['Current in an inductive circuit grows as i = I(1 − e^(−Rt/L)).'], [
      ['a', 3, 'Prove that t = (L/R) ln[I/(I − i)].', M('i/I = 1 − e^(−Rt/L) → e^(−Rt/L) = (I − i)/I (1)', '−Rt/L = ln[(I − i)/I] (1)', 't = (L/R) ln[I/(I − i)] (1)')],
      ['b', 3, 'For L = 0.5 H, R = 10 Ω and I = 2 A, calculate the time for the current to reach 1 A.', M('L/R = 0.05 s (1)', 't = 0.05 ln(2/1) (1)', '= 0.0347 s (34.7 ms) (1)')]
    ]),
    Q(16, 'B', ['A transformer takes 2 kW from the supply and delivers 1.9 kW at 110 V.'], [['', 3, 'Calculate the efficiency and the secondary current.', M('η = 1.9/2 × 100 = 95% (1)', 'I₂ = P/V = 1900/110 (1)', '= 17.3 A (1)')]]),
    Q(17, 'B', ['A magnetic core has length 0.5 m, cross-sectional area 4 × 10⁻⁴ m² and relative permeability 2000.'], [
      ['a', 4, 'Prove that the reluctance of the core is approximately 4.97 × 10⁵ A/Wb.', M('S = l/(μ₀μᵣA) (1)', '= 0.5/(4π × 10⁻⁷ × 2000 × 4 × 10⁻⁴) (1)', 'denominator = 1.005 × 10⁻⁶ (1)', 'S = 4.97 × 10⁵ A/Wb (1)')],
      ['b', 2, 'Calculate the flux produced by an mmf of 250 A.', M('Φ = F_m/S = 250/4.97 × 10⁵ (1)', '= 5.03 × 10⁻⁴ Wb (1)')]
    ]),
    Q(18, 'B', ['A network: R1 = 68 Ω in series with R2 = 120 Ω ∥ R3 = 180 Ω, followed by R4 = 39 Ω and R5 = 21 Ω in series.'], [['', 3, 'Calculate the total resistance.', M('R2 ∥ R3 = 21 600/300 = 72 Ω (1)', 'sum = 68 + 72 + 39 + 21 (1)', '= 200 Ω (1)')]]),
    Q(19, 'B', ['A 2.3 kW kettle runs on 230 V for 3 minutes.'], [['', 4, 'Calculate the current, resistance and the charge that flows.', M('I = P/V = 10 A (1)', 'R = V/I = 23 Ω (1)', 't = 180 s (1)', 'Q = It = 1 800 C (1)')]]),
    Q(20, 'B', ['A coil of resistance 12 Ω and inductance 50 mH is connected to a 110 V, 60 Hz supply.'], [['', 7, 'Calculate the reactance, impedance, current, phase angle and power.', M('X_L = 2π × 60 × 0.05 = 18.85 Ω (1)', 'Z = √(12² + 18.85²) (1)', '= 22.3 Ω (1)', 'I = 110/22.3 = 4.92 A (1)', 'φ = tan⁻¹(18.85/12) (1)', '= 57.5° lagging (1)', 'P = I²R = 4.92² × 12 = 291 W (1)')]]),
    Q(21, 'B', ['A 2 µF and a 3 µF capacitor are in parallel; the pair is in series with a 5 µF capacitor across a 200 V supply.'], [['', 6, 'Calculate the total capacitance, the total charge and the energy stored.', M('parallel = 5 µF (1)', 'series with 5 µF: C = 5 × 5/10 (1)', '= 2.5 µF (1)', 'Q = CV = 2.5 × 10⁻⁶ × 200 = 5 × 10⁻⁴ C (1)', 'W = ½CV² (1)', '= 0.05 J (1)')]]),
    Q(22, 'B', ['A network has E1 = 20 V with R1 = 2 Ω, E2 = 10 V with R2 = 4 Ω, and a shared R3 = 8 Ω carrying I1 + I2.'], [['', 6, 'Use Kirchhoff’s laws to calculate I1, I2 and the current in R3.', M('Loop 1: 20 = 2I1 + 8(I1 + I2) → 10I1 + 8I2 = 20 (1)', 'Loop 2: 10 = 4I2 + 8(I1 + I2) → 8I1 + 12I2 = 10 (1)', 'solve simultaneously (1)', 'I1 = 2.86 A (1)', 'I2 = −1.07 A (1)', 'I3 = 1.79 A (1)')]])
  ]));

  /* ---------- Paper 6 ---------- */
  papers.push(paper(6, 'Bicycle chain drive · take-off run · floating cylinder · pile driving · generator · parallel batteries', 'Chain drives, conservation of momentum with energy loss, punching force, induced emf and force, RL measurements.', [
    Q(1, 'A', [], [['', 1, 'State the unit of measure for energy stored in a spring.', L('Award one mark for:', '• joule (J)')]]),
    Q(2, 'A', [], [['', 1, 'State the unit of measure for mass flow rate.', L('Award one mark for:', '• kg/s')]]),
    Q(3, 'A', ['A bicycle has a 44-tooth chainring and an 11-tooth rear sprocket. The rider pedals at 80 rev/min. The wheel diameter is 0.68 m.'], [['', 3, 'Calculate the speed of the bicycle.', M('wheel speed = 80 × 44/11 = 320 rev/min (1)', 'circumference = π × 0.68 = 2.136 m (1)', 'v = 320 × 2.136/60 = 11.4 m/s (1)')]]),
    Q(4, 'A', ['An aircraft accelerates uniformly from rest to 75 m/s in 30 s along a runway.'], [
      ['a', 2, 'Calculate the acceleration.', M('a = 75/30 (1)', '= 2.5 m/s² (1)')],
      ['b', 2, 'Calculate the runway length used.', M('s = ½(0 + 75) × 30 (1)', '= 1 125 m (1)')]
    ]),
    Q(5, 'A', ['A survey drone travels 3 km east then 4 km north.'], [['', 3, 'Calculate its resultant displacement and direction.', M('R = √(3² + 4²) (1)', '= 5 km (1)', 'θ = tan⁻¹(4/3) = 53.1° north of east (1)')]]),
    Q(6, 'A', ['A 40 N force acts at 0.25 m on a shaft.'], [
      ['a', 2, 'Calculate the torque.', M('T = 40 × 0.25 (1)', '= 10 Nm (1)')],
      ['b', 2, 'Calculate the power if the shaft turns at 3000 rev/min.', M('ω = 2π × 3000/60 = 314.2 rad/s (1)', 'P = 10 × 314.2 = 3.14 kW (1)')]
    ]),
    Q(7, 'A', ['A vertical door 1.0 m high and 0.8 m wide is in a freshwater tank. Its top edge is 0.5 m below the surface.'], [['', 4, 'Calculate the hydrostatic thrust on the door.', M('x̄ = 0.5 + 0.5 = 1.0 m (1)', 'A = 0.8 m² (1)', 'F = 1000 × 9.81 × 0.8 × 1.0 (1)', '= 7 848 N (1)')]]),
    Q(8, 'A', ['A solid cylinder of radius 0.1 m, height 0.4 m and mass 8 kg floats upright in fresh water.'], [['', 6, 'Calculate the density of the cylinder and the depth to which it sinks.', M('V = π × 0.1² × 0.4 = 0.01257 m³ (1)', 'ρ = 8/0.01257 = 637 kg/m³ (1)', 'floating: displaced mass = 8 kg (1)', 'displaced volume = 0.008 m³ (1)', 'depth = 0.008/(π × 0.1²) (1)', '= 0.255 m (1)')]]),
    Q(9, 'A', ['A pendulum bob of mass 0.3 kg passes its lowest point at 4 m/s.'], [['', 4, 'Calculate the maximum height it rises above the lowest point.', M('KE = ½ × 0.3 × 4² = 2.4 J (1)', 'KE = PE (1)', 'h = 2.4/(0.3 × 9.81) (1)', '= 0.815 m (1)')]]),
    Q(10, 'A', ['A rotating arm moves through θ = 2t³ radians.'], [
      ['a', 3, 'Determine the angular velocity when t = 2 s.', M('ω = 6t² (2)', '= 24 rad/s (1)')],
      ['b', 5, 'A 30 mm hole is punched in 2 mm sheet with ultimate shear strength 250 MPa. Calculate the punching force.', M('area = πdt (1)', '= π × 0.03 × 0.002 (1)', '= 1.885 × 10⁻⁴ m² (1)', 'F = 250 × 10⁶ × 1.885 × 10⁻⁴ (1)', '= 47.1 kN (1)')]
    ]),
    Q(11, 'A', ['A 5 kg hammer moving at 8 m/s strikes a 50 kg pile and they move together. The pile is driven 0.05 m into the ground.'], [['', 7, 'Calculate the common velocity, the kinetic energy lost on impact and the average ground resistance.', M('momentum: 5 × 8 = 55v (1)', 'v = 0.727 m/s (1)', 'KE before = ½ × 5 × 64 = 160 J (1)', 'KE after = ½ × 55 × 0.727² = 14.5 J (1)', 'KE lost = 145.5 J (1)', 'resistance × 0.05 = 14.5 (1)', 'average resistance = 290 N (1)')]]),
    Q(12, 'B', [], [['', 1, 'State the unit of measure for magnetic field strength.', L('Award one mark for:', '• amperes per metre (A/m)')]]),
    Q(13, 'B', [], [['', 1, 'State the unit of measure for electromotive force.', L('Award one mark for:', '• volt (V)')]]),
    Q(14, 'B', ['A sinusoidal voltage has a peak of 4 V and a period of 5 ms.'], [
      ['a', 1, 'Determine the peak-to-peak voltage.', L('Award one mark for:', '• 8 V')],
      ['b', 1, 'Determine the frequency.', L('Award one mark for:', '• 200 Hz')]
    ]),
    Q(15, 'B', ['Gain G = 10 log₁₀(P₂/P₁) dB.'], [
      ['a', 3, 'Show that a power ratio of 100 corresponds to a gain of 20 dB.', M('G = 10 log₁₀ 100 (1)', 'log₁₀ 100 = 2 (1)', 'G = 20 dB (1)')],
      ['b', 3, 'An air capacitor of 0.5 µF has mica (εᵣ = 6) inserted. Calculate the new capacitance and the charge stored at 100 V.', M('C = εᵣ × C_air (1)', '= 3 µF (1)', 'Q = 3 × 10⁻⁶ × 100 = 3 × 10⁻⁴ C (1)')]
    ]),
    Q(16, 'B', ['An ideal transformer supplies 20 A at 24 V from a 240 V primary.'], [['', 3, 'Calculate the primary current and the turns ratio.', M('V₁I₁ = V₂I₂ (1)', 'I₁ = 24 × 20/240 = 2 A (1)', 'turns ratio N₁:N₂ = 10:1 (1)')]]),
    Q(17, 'B', ['A conductor 0.25 m long moves at 12 m/s at right angles to a 1.2 T field. It is connected to a 2 Ω load.'], [
      ['a', 4, 'Prove that the induced emf is 3.6 V and calculate the current.', M('E = Blv (1)', '= 1.2 × 0.25 × 12 (1)', '= 3.6 V (1)', 'I = 3.6/2 = 1.8 A (1)')],
      ['b', 2, 'Calculate the force on the conductor due to this current.', M('F = BIl = 1.2 × 1.8 × 0.25 (1)', '= 0.54 N (1)')]
    ]),
    Q(18, 'B', ['A network: R1 = 330 Ω in series with R2 = 1 kΩ ∥ R3 = 1 kΩ, in series with R4 = 200 Ω ∥ R5 = 300 Ω.'], [['', 3, 'Calculate the total resistance.', M('R2 ∥ R3 = 500 Ω (1)', 'R4 ∥ R5 = 60 000/500 = 120 Ω (1)', 'total = 330 + 500 + 120 = 950 Ω (1)')]]),
    Q(19, 'B', ['A 6 V supply delivers 1.5 A for 20 minutes.'], [['', 4, 'Calculate the charge, the energy supplied and the circuit resistance.', M('Q = 1.5 × 1200 = 1 800 C (1)', 'W = QV = 1800 × 6 (1)', '= 10 800 J (1)', 'R = 6/1.5 = 4 Ω (1)')]]),
    Q(20, 'B', ['A coil draws 0.4 A from a 12 V DC supply and 0.24 A from a 12 V, 50 Hz AC supply.'], [['', 7, 'Determine the resistance and the inductance of the coil.', M('DC: R = 12/0.4 (1)', '= 30 Ω (1)', 'AC: Z = 12/0.24 = 50 Ω (1)', 'X_L = √(50² − 30²) (1)', '= 40 Ω (1)', 'L = 40/(2π × 50) (1)', '= 0.127 H (1)')]]),
    Q(21, 'B', ['A 1000 µF capacitor charges through a 4.7 kΩ resistor from a 9 V supply.'], [['', 6, 'Calculate the time constant, the capacitor voltage after 10 s and the energy stored when fully charged.', M('τ = 4700 × 1000 × 10⁻⁶ = 4.7 s (1)', 'v = 9(1 − e^(−10/4.7)) (1)', '= 7.93 V (1)', 'W = ½CV² (1)', '= 0.5 × 1000 × 10⁻⁶ × 81 (1)', '= 0.0405 J (40.5 mJ) (1)')]]),
    Q(22, 'B', ['Two 12 V batteries, each with internal resistance 2 Ω, are connected in parallel across a 4 Ω load. Battery currents are I1 and I2; the load carries I1 + I2.'], [['', 6, 'Use Kirchhoff’s laws to calculate the battery currents, the load current and the load power.', M('Loop 1: 12 = 2I1 + 4(I1 + I2) → 6I1 + 4I2 = 12 (1)', 'Loop 2: 12 = 2I2 + 4(I1 + I2) → 4I1 + 6I2 = 12 (1)', 'by symmetry/solving I1 = I2 (1)', 'I1 = I2 = 1.2 A (1)', 'load current = 2.4 A (1)', 'P = I²R = 2.4² × 4 = 23.0 W (1)')]])
  ]));

  window.BIZ_PAPERS = (window.BIZ_PAPERS || []).concat(papers);
})();
