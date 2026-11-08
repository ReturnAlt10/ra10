/* BTEC Engineering (AAQ) Unit 1 — Engineering Principles: comprehensive revision guide (shared guide engine). */
(function () {
  'use strict';
  const { svg: S, h: H, P } = window.BizGuide;
  const { key, tip, warn, fig, table, ul, example, stats, check, two } = H;
  const formula = (l, e, n) => H.formula(l, e, Array.isArray(n) ? n.join(' · ') : n);

  function setTask() {
    const split = S.bars([['Section A\nMechanical', 45, P.blue], ['Section B\nElectrical', 45, P.amber]], { w: 520, h: 230, max: 50, unit: 'Marks per section (90-mark paper)', label: 'Marks per section' });
    const cmd = S.ladder([['State – 1 mark', 'SI units: J, Pa, Ω, A/Wb, H, F, T'], ['Calculate – 2–4 marks', 'Formula → substitute with units → answer to sensible significant figures'], ['Prove / Show that – 3–4 marks', 'Every algebraic or numerical step written; reach the given value'], ['Multi-step problems – 5–7 marks', 'Combine principles (e.g. energy + friction + incline, impedance + inductance)']], { w: 700, rowH: 48, label: 'Command words' });
    return `
<div class="guide-aim-hd"><div class="guide-aim-badge">★</div><div><div class="guide-aim-title">The exam: 2 hours 15 minutes, 90 marks</div><div class="guide-aim-subtitle">Section A mechanical (45) · Section B electrical/electronic (45) · short answers and multi-step calculations using the maths in Aim A · no essays – method marks everywhere</div></div></div>
${stats([['90', 'marks'], ['135', 'minutes'], ['~22', 'questions'], ['7', 'mark multi-step problems']])}
${fig(split, 'Equal marks for mechanical and electrical – revise both.')}
${fig(cmd, 'Method marks are awarded even if the final answer is wrong – always show working.')}
<h4>What gets the top marks</h4>
${check(['<strong>Convert units first</strong>: mm → m, kN → N, minutes → seconds, cm² → m², µF → F.', '<strong>Write the formula</strong> before substituting – it earns a method mark.', '<strong>Significant figures</strong>: give final answers to 3 s.f. unless told otherwise, with units.', '<strong>“Prove that” questions</strong>: you are given the answer – the marks are for each line of working.', '<strong>Multi-step</strong>: break into stages (e.g. KE gained + PE gained + work against friction = total work).'])}
${table(['Prefix', 'Symbol', 'Multiplier', 'Example'], [['giga', 'G', '10⁹', '200 GPa = 200 × 10⁹ Pa'], ['mega', 'M', '10⁶', '280 MPa = 280 × 10⁶ Pa'], ['kilo', 'k', '10³', '10 kΩ = 10 000 Ω'], ['milli', 'm', '10⁻³', '20 ms = 0.02 s; 400 mm² = 4 × 10⁻⁴ m²'], ['micro', 'µ', '10⁻⁶', '470 µF = 470 × 10⁻⁶ F'], ['nano', 'n', '10⁻⁹', '10 nF'], ['pico', 'p', '10⁻¹²', '88.5 pF = 8.85 × 10⁻¹¹ F']])}
${table(['Constant / conversion', 'Value'], [['g', '9.81 m/s²'], ['ρ water / seawater', '1000 / 1025 kg/m³'], ['ε₀', '8.85 × 10⁻¹² F/m'], ['μ₀', '4π × 10⁻⁷ H/m'], ['rev/min → rad/s', '× 2π ÷ 60'], ['mm² → m²', '× 10⁻⁶'], ['kWh → J', '× 3.6 × 10⁶']])}
${warn('The most common lost marks are unit errors: e.g. using 350 instead of 0.35 m in T = Fd, or 0.4 minutes instead of 24 s in I = Q/t.')}`;
  }

  /* ---------- A1 ---------- */
  const a1 = () => `
${table(['Law', 'Rule'], [['Indices', 'aᵐ × aⁿ = aᵐ⁺ⁿ · aᵐ ÷ aⁿ = aᵐ⁻ⁿ · (aᵐ)ⁿ = aᵐⁿ · a⁰ = 1 · a⁻ⁿ = 1/aⁿ · a^(1/n) = ⁿ√a'], ['Logarithms', 'log A + log B = log AB · log A − log B = log(A/B) · log Aⁿ = n log A · ln e = 1'], ['Exponential/log link', 'y = eˣ ⇔ x = ln y; y = 10ˣ ⇔ x = log y']])}
${example('Capacitor discharge: I = I₀e^(−t/τ). Show that t = τ ln(I₀/I)', 'I/I₀ = e^(−t/τ) → ln(I/I₀) = −t/τ → t = −τ ln(I/I₀) = <strong>τ ln(I₀/I)</strong>.')}
${example('Straight-line law from data: resistance of a wire R = 0.4 Ω at 0 °C and 0.48 Ω at 50 °C', 'Gradient m = (0.48 − 0.4)/50 = 0.0016 Ω/°C; intercept c = 0.4 → R = 0.0016θ + 0.4. Compare with R = R₀(1 + αθ): α = 0.0016/0.4 = 0.004 /°C.')}
${example('Simultaneous equations from a pulley: 2T₁ + T₂ = 14 and T₁ − T₂ = 1', 'Add: 3T₁ = 15 → T₁ = 5 N; T₂ = 4 N.')}
${table(['Topic', 'Key method'], [['Transposition', 'do the same to both sides; e.g. v² = u² + 2as → s = (v² − u²)/2a'], ['Straight line', 'y = mx + c; m = gradient = Δy/Δx; c = y-intercept'], ['Simultaneous equations', 'elimination or substitution'], ['Expanding / factorising', 'common factor, grouping, (a + b)² = a² + 2ab + b²'], ['Quadratics', 'factorise or x = [−b ± √(b² − 4ac)]/2a']])}`;

  /* ---------- A2 ---------- */
  const vec = `<svg viewBox="0 0 420 260" role="img" aria-label="Vector addition" style="width:100%;max-width:420px;height:auto;font-family:inherit" fill="currentColor">
  <defs><marker id="arE" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="currentColor"/></marker></defs>
  <line x1="80" y1="230" x2="80" y2="40" stroke="${P.blue}" stroke-width="4" marker-end="url(#arE)"/><text x="40" y="140" font-size="12" fill="${P.blue}">220 m/s N</text>
  <line x1="80" y1="40" x2="190" y2="40" stroke="${P.amber}" stroke-width="4" marker-end="url(#arE)"/><text x="110" y="30" font-size="12" fill="${P.amber}">30 m/s E</text>
  <line x1="80" y1="230" x2="190" y2="40" stroke="${P.green}" stroke-width="4" stroke-dasharray="7 4" marker-end="url(#arE)"/><text x="150" y="160" font-size="12" fill="${P.green}">resultant 222 m/s</text>
  <text x="88" y="210" font-size="12">θ = 7.8°</text></svg>`;
  const a2 = () => `
${formula('Radians', 'π rad = 180° · s = rθ · A = ½r²θ · ω = 2πN/60', ['1 revolution = 2π rad'])}
${table(['Rule', 'Use'], [['SOH CAH TOA', 'right-angled triangles'], ['Pythagoras a² + b² = c²', 'resultants of perpendicular vectors'], ['Sine rule a/sin A = b/sin B', 'two angles + side, or two sides + non-included angle'], ['Cosine rule a² = b² + c² − 2bc cos A', 'three sides, or two sides + included angle']])}
${fig(vec, 'Resultant = √(220² + 30²) = 222 m/s; direction tan θ = 30/220 → θ = 7.8° east of north.')}
${key('Resolving vectors', 'A force F at angle θ to the horizontal has components F cos θ (horizontal) and F sin θ (vertical). On a slope at angle θ, weight mg has mg sin θ down the slope and mg cos θ into the slope.')}
${table(['Solid', 'Volume', 'Surface area'], [['Cylinder', 'πr²h', '2πr² + 2πrh'], ['Cone', '⅓πr²h', 'πr² + πrl'], ['Sphere', '⁴⁄₃πr³', '4πr²'], ['Pyramid', '⅓ × base area × h', 'base + triangular faces']])}`;

  /* ---------- A3 ---------- */
  const a3 = () => `
${table(['Function', 'dy/dx', '∫ y dx'], [['axⁿ', 'naxⁿ⁻¹', 'axⁿ⁺¹/(n+1) + C'], ['sin ax', 'a cos ax', '−(1/a) cos ax + C'], ['cos ax', '−a sin ax', '(1/a) sin ax + C'], ['constant k', '0', 'kx + C']])}
${example('Punch displacement s = t² + 4t − 3. Velocity at t = 2 s?', 'v = ds/dt = 2t + 4 → at t = 2: <strong>v = 8 m/s</strong>. Acceleration a = dv/dt = 2 m/s².')}
${ul(['<strong>Rates of change</strong>: velocity = ds/dt, acceleration = dv/dt, current i = dq/dt, capacitor current i = C dv/dt, induced emf e = −N dΦ/dt = −L di/dt.', '<strong>Gradient</strong>: positive (increasing), negative (decreasing), zero (turning point); graphically from a tangent.', '<strong>Integration</strong>: reverse of differentiation; definite integrals use [F(x)] from a to b; area under a curve = Σ y δx as δx → 0.'])}
${example('Gradient at a point: y = 2x³ − 3x at x = 2', 'dy/dx = 6x² − 3 = 24 − 3 = <strong>21</strong> (positive – the function is increasing).')}
${example('Small change: area of a circle A = πr²; r changes from 0.20 m to 0.201 m', 'dA/dr = 2πr = 1.257; δA ≈ 1.257 × 0.001 = <strong>1.26 × 10⁻³ m²</strong>.')}
${formula('Mean and RMS', 'mean = (1/(b − a)) ∫ y dx · RMS = √[(1/(b − a)) ∫ y² dx]', ['sine wave: V_rms = 0.707 V_peak, V_mean (half cycle) = 0.637 V_peak'])}
${example('Mean and RMS of v = 100 sin θ over half a cycle (0 to π)', 'Mean = (1/π) ∫₀^π 100 sin θ dθ = (100/π)[−cos θ]₀^π = (100/π)(2) = <strong>63.7 V</strong>. RMS = √[(1/π) ∫₀^π 10 000 sin²θ dθ] = √(10 000/2) = <strong>70.7 V</strong>. Form factor = 70.7/63.7 = 1.11.')}
${example('Distance travelled from a velocity function v = 3t² + 2 m/s between t = 1 and t = 3 s', 's = ∫ v dt = [t³ + 2t]₁³ = (27 + 6) − (1 + 2) = <strong>30 m</strong>.')}
${example('Integrating a trig function: ∫₀^(π/2) 5 cos t dt', '= [5 sin t]₀^(π/2) = 5(1 − 0) = <strong>5</strong>. Remember: calculators must be in radian mode.')}
${example('Work done by a variable force F = 3x² + 2 N from x = 0 to x = 2 m', 'W = ∫ F dx = [x³ + 2x] from 0 to 2 = 8 + 4 = <strong>12 J</strong>.')}`;

  /* ---------- B1 ---------- */
  const beam = `<svg viewBox="0 0 600 150" role="img" aria-label="Simply supported beam" style="width:100%;max-width:600px;height:auto;font-family:inherit" fill="currentColor">
  <rect x="50" y="60" width="500" height="14" fill="${P.slate}" fill-opacity=".5"/><polygon points="50,74 38,96 62,96" fill="${P.blue}"/><polygon points="550,74 538,96 562,96" fill="${P.blue}"/>
  <line x1="200" y1="15" x2="200" y2="58" stroke="${P.red}" stroke-width="3"/><polygon points="200,60 194,48 206,48" fill="${P.red}"/><text x="206" y="26" font-size="11">20 kN</text>
  ${[0, 1, 2, 3, 4, 5].map(i => `<line x1="${330 + i * 40}" y1="38" x2="${330 + i * 40}" y2="58" stroke="${P.amber}" stroke-width="2"/>`).join('')}<line x1="330" y1="38" x2="530" y2="38" stroke="${P.amber}" stroke-width="2"/><text x="380" y="30" font-size="11">UDL 4 kN/m over 5 m</text>
  <text x="40" y="118" font-size="11">RA</text><text x="545" y="118" font-size="11">RB</text><text x="110" y="140" font-size="10">3 m</text><text x="300" y="140" font-size="10">beam 10 m</text></svg>`;
  const b1 = () => `
${ul(['<strong>Equilibrium</strong>: ΣF<sub>x</sub> = 0, ΣF<sub>y</sub> = 0, ΣM = 0 about any point (clockwise moments = anticlockwise moments).', '<strong>Moment</strong> = force × perpendicular distance (Nm). A UDL acts as a single load (w × length) at its centre.'])}
${fig(beam, 'Moments about A: RB × 10 = 20 × 3 + (4 × 5) × 7.5 = 60 + 150 = 210 → RB = 21 kN; RA = 40 − 21 = 19 kN.')}
${example('Non-concurrent coplanar forces: a 4 m bracket with 300 N downward at 1 m and 500 N downward at 3.5 m from a wall pivot', 'Total moment about the pivot = 300 × 1 + 500 × 3.5 = <strong>2 050 Nm</strong> (clockwise). The wall fixing must provide an equal anticlockwise moment and a vertical reaction of 800 N for equilibrium.')}
${table(['Diagram', 'Shows'], [['Space diagram', 'the real layout – where each force acts and at what angle'], ['Free body diagram', 'one isolated body with every force acting on it (weight, reactions, friction, applied forces)'], ['Vector (force) diagram', 'forces drawn tip-to-tail to scale; the closing side is the resultant or equilibrant']])}
${table(['Quantity', 'Formula', 'Unit'], [['Direct stress', 'σ = F/A', 'Pa (N/m²)'], ['Direct strain', 'ε = ΔL/L', 'none'], ['Young’s modulus', 'E = σ/ε', 'Pa'], ['Shear stress', 'τ = F/A (area resisting shear)', 'Pa'], ['Shear strain', 'γ = a/b (deflection ÷ height)', 'radians/none'], ['Modulus of rigidity', 'G = τ/γ', 'Pa']])}
${example('Steel tie: 50 kN on 20 mm diameter, 2 m long, E = 200 GPa', 'A = π × 0.01² = 3.142 × 10⁻⁴ m²; σ = 50 000/3.142 × 10⁻⁴ = 159 MPa; ε = 159 × 10⁶/200 × 10⁹ = 7.96 × 10⁻⁴; ΔL = 7.96 × 10⁻⁴ × 2000 = <strong>1.59 mm</strong>.')}
${example('Shear strain and modulus of rigidity: block 50 mm high deflects 0.05 mm under τ = 40 MPa', 'γ = 0.05/50 = 0.001; G = τ/γ = 40 × 10⁶/0.001 = <strong>40 GPa</strong>.')}
${example('Punching a 0.2 m diameter hole in 3 mm sheet; ultimate shear stress 300 MPa', 'Shear area = πd × t = π × 0.2 × 0.003 = 1.885 × 10⁻³ m². F = τA = 300 × 10⁶ × 1.885 × 10⁻³ = <strong>565 kN</strong>.')}`;

  /* ---------- B2 ---------- */
  const b2 = () => `
${formula('Equations of motion (SUVAT)', 'v = u + at · s = ut + ½at² · v² = u² + 2as · s = ½(u + v)t', ['uniform acceleration only'])}
${table(['Quantity', 'Formula'], [['Force', 'F = ma (N)'], ['Torque', 'T = Fd (Nm) – d in metres'], ['Work', 'W = Fs; rotational W = Tθ (J)'], ['Power', 'P = W/t = Fv; rotational P = Tω (W)'], ['Efficiency', 'η = output/input × 100%'], ['Potential energy', 'PE = mgh'], ['Kinetic energy', 'KE = ½mv²; rotational KE = ½Iω²'], ['Moment of inertia', 'I = mk²'], ['Momentum', 'p = mv; total momentum before = after (no external forces)'], ['Angular velocity', 'ω = θ/t = v/r = 2πN/60'], ['Centripetal acceleration', 'a = ω²r = v²/r'], ['Friction', 'F = μN']])}
${example('Hammer of 3 kg dropped from 4.5 m. Impact velocity?', 'PE lost = KE gained: mgh = ½mv² → v = √(2gh) = √(2 × 9.81 × 4.5) = <strong>9.40 m/s</strong>.')}
${example('Car 1250 kg, 3 → 12 m/s up a 30° slope of length 80 m, friction 600 N. Work done by engine?', 'ΔKE = ½ × 1250 × (12² − 3²) = 84 375 J; ΔPE = 1250 × 9.81 × 80 sin 30° = 490 500 J; friction work = 600 × 80 = 48 000 J. Total = <strong>622 875 J ≈ 623 kJ</strong>.')}
${example('Collision: 1500 kg wagon at 4 m/s couples to a stationary 500 kg wagon', 'Momentum: 6000 = 2000v → v = 3 m/s. KE before 12 000 J, after 9 000 J → 3 000 J (25%) lost as sound, heat and deformation.')}
${example('Flywheel: m = 80 kg, k = 0.5 m, 0 → 300 rev/min in 10 s', 'I = mk² = 20 kg m²; ω = 31.4 rad/s; α = 3.14 rad/s²; T = Iα = 62.8 Nm; KE = ½Iω² = 9.87 kJ.')}
${table(['Machine', 'Key ratios'], [['Velocity ratio', 'VR = distance moved by effort ÷ distance moved by load'], ['Mechanical advantage', 'MA = load ÷ effort'], ['Efficiency', 'η = MA ÷ VR'], ['Simple gear pair', 'N₁/N₂ = T₂/T₁ (speed inversely proportional to teeth)'], ['Compound gear train', 'overall ratio = product of each pair; gears on a common shaft share speed'], ['Chain drive', 'like gears – sprocket teeth ratio'], ['Inclined plane', 'VR = length of slope ÷ height']])}
${example('Pulley block: VR = 4; effort of 250 N raises 800 N', 'MA = 800/250 = 3.2; η = MA/VR = 3.2/4 = <strong>80%</strong>. The 20% loss is friction in the pulleys and lifting the lower pulley block.')}
${example('Energy conservation with losses: a 0.5 kg ball dropped from 10 m hits the ground at 13 m/s', 'PE at top = 0.5 × 9.81 × 10 = 49.05 J; KE at bottom = ½ × 0.5 × 13² = 42.25 J; energy lost to air resistance = <strong>6.8 J (13.9%)</strong>.')}
${example('Compound train: driver 10 T at 300 rev/min meshes with 18 T; a 6 T gear on the same shaft as the 18 T drives the output… (see paper)', 'Speed of 18 T = 300 × 10/18 = 166.7 rev/min. Gears on the same shaft rotate at the same speed.')}`;

  /* ---------- B3 ---------- */
  const b3 = () => `
${table(['Quantity', 'Formula'], [['Density', 'ρ = m/V (kg/m³)'], ['Relative density', 'ρ_substance ÷ ρ_water (1000 kg/m³)'], ['Hydrostatic pressure', 'p = ρgh (Pa) at depth h'], ['Thrust on immersed plane surface', 'F = ρg A x̄ (x̄ = depth of centroid)'], ['Volumetric flow rate', 'V̇ = Av (m³/s)'], ['Mass flow rate', 'ṁ = ρAv (kg/s)'], ['Continuity (tapering pipe)', 'A₁v₁ = A₂v₂'], ['Upthrust (buoyancy)', 'F_b = ρ g V_displaced']])}
${example('Hinged door 0.6 m × 0.5 m, top edge 1.2 m below surface, coolant ρ = 890 kg/m³', 'Centroid depth x̄ = 1.2 + 0.3 = 1.5 m; A = 0.3 m²; F = 890 × 9.81 × 0.3 × 1.5 = <strong>3 929 N</strong>.')}
${example('Floating cone r = 0.4 m, h = 1.2 m, 50% submerged in seawater (1025 kg/m³). Mass of cone?', 'V = ⅓π(0.4)²(1.2) = 0.2011 m³; displaced = 0.1005 m³; upthrust = weight → m = 1025 × 0.1005 = <strong>103 kg</strong>.')}
${example('Tapering pipe: 100 mm diameter at 2 m/s narrows to 50 mm; water ρ = 1000 kg/m³', 'A₁ = π × 0.05² = 7.854 × 10⁻³ m²; V̇ = A₁v₁ = 0.0157 m³/s; ṁ = ρV̇ = 15.7 kg/s; A₂ = π × 0.025² = 1.963 × 10⁻³ m² → v₂ = V̇/A₂ = <strong>8 m/s</strong> (halving the diameter quarters the area).')}
${example('Relative density of a solid by flotation: a block floats with 70% submerged in water', 'ρ_block = 0.7 × 1000 = 700 kg/m³ → relative density = 0.7.')}
${tip('Flotation method: a floating object’s weight equals the weight of fluid displaced – so its density = fluid density × fraction submerged.')}`;

  /* ---------- C1 ---------- */
  const circuit = `<svg viewBox="0 0 560 220" role="img" aria-label="Series-parallel network" style="width:100%;max-width:560px;height:auto;font-family:inherit" fill="currentColor">
  <path d="M40 110 L40 30 L120 30" stroke="currentColor" fill="none" stroke-width="2"/><rect x="120" y="20" width="60" height="20" fill="none" stroke="${P.blue}" stroke-width="2"/><text x="132" y="15" font-size="11">R1 220 Ω</text>
  <path d="M180 30 L260 30 L260 10 L300 10 M260 30 L260 50 L300 50" stroke="currentColor" fill="none" stroke-width="2"/>
  <rect x="300" y="0" width="60" height="20" fill="none" stroke="${P.blue}" stroke-width="2"/><text x="370" y="14" font-size="11">R2 560 Ω</text><rect x="300" y="40" width="60" height="20" fill="none" stroke="${P.blue}" stroke-width="2"/><text x="370" y="54" font-size="11">R3 56 Ω</text>
  <path d="M360 10 L400 10 L400 50 L360 50 M400 30 L480 30 L480 110" stroke="currentColor" fill="none" stroke-width="2"/>
  <line x1="20" y1="110" x2="60" y2="110" stroke="currentColor" stroke-width="3"/><line x1="28" y1="120" x2="52" y2="120" stroke="currentColor" stroke-width="2"/><text x="64" y="120" font-size="11">9 V</text>
  <path d="M40 120 L40 190 L200 190" stroke="currentColor" fill="none" stroke-width="2"/><rect x="200" y="180" width="60" height="20" fill="none" stroke="${P.blue}" stroke-width="2"/><text x="208" y="175" font-size="11">R4 33 Ω</text>
  <path d="M260 190 L320 190" stroke="currentColor" fill="none" stroke-width="2"/><rect x="320" y="180" width="60" height="20" fill="none" stroke="${P.blue}" stroke-width="2"/><text x="326" y="175" font-size="11">R5 100 Ω</text><path d="M380 190 L480 190 L480 110" stroke="currentColor" fill="none" stroke-width="2"/></svg>`;
  const c1 = () => `
${table(['Quantity', 'Formula', 'Unit'], [['Current', 'I = Q/t', 'A'], ['Ohm’s law', 'V = IR', 'V, Ω'], ['Power', 'P = IV = I²R = V²/R', 'W'], ['Resistance', 'R = ρL/A; R_θ = R₀(1 + αθ)', 'Ω'], ['Conductance', 'G = 1/R', 'S'], ['Series resistors', 'R_T = R₁ + R₂ + …', ''], ['Parallel resistors', '1/R_T = 1/R₁ + 1/R₂ + …', ''], ['Coulomb’s law', 'F = q₁q₂ / 4πε₀r²', 'N'], ['Electric field', 'E = F/q = V/d', 'V/m'], ['Capacitance', 'C = Q/V = ε₀εᵣA/d', 'F'], ['Capacitors series / parallel', '1/C_T = 1/C₁ + 1/C₂ … / C_T = C₁ + C₂ …', ''], ['Energy in capacitor', 'W = ½CV²', 'J'], ['RC time constant', 'τ = RC; charging v = V(1 − e^(−t/τ)); discharging v = Ve^(−t/τ)', 's']])}
${fig(circuit, 'Example network: R2 ∥ R3 = (560 × 56)/(616) = 50.9 Ω; total = 220 + 50.9 + 33 + 100 = 403.9 Ω.')}
${example('12 V supply; 36 C flows in 0.4 minutes. Resistance?', 't = 24 s; I = 36/24 = 1.5 A; R = 12/1.5 = <strong>8 Ω</strong>.')}
${example('Glass capacitor: A = 1.125 × 10⁻³ m², d = 2 mm, εᵣ = 7', 'C = 8.85 × 10⁻¹² × 7 × 1.125 × 10⁻³ ÷ 0.002 = <strong>3.48 × 10⁻¹¹ F (34.8 pF)</strong>.')}
${example('Kirchhoff, two sources: E1 = 9 V, R1 = 3 Ω; E2 = 6 V, R2 = 6 Ω; shared R3 = 3 Ω', 'Loop 1: 9 = 3I1 + 3(I1 + I2) → 6I1 + 3I2 = 9. Loop 2: 6 = 6I2 + 3(I1 + I2) → 3I1 + 9I2 = 6. Solving: <strong>I1 = 1.4 A, I2 = 0.2 A, I3 = 1.6 A</strong>.')}
${example('RC discharge: 470 µF from 500 V through 10 kΩ', 'τ = RC = 4.7 s. After 5 s: v = 500e^(−5/4.7) = <strong>173 V</strong>. Energy initially stored: ½CV² = <strong>58.8 J</strong>. After 5τ the capacitor is effectively discharged.')}
${key('Kirchhoff’s laws', '<strong>KCL</strong>: current into a junction = current out. <strong>KVL</strong>: around any closed loop, sum of emfs = sum of IR drops. For two-source networks: label loop currents, write one KVL equation per loop, solve simultaneously.')}`;

  /* ---------- C2 ---------- */
  const c2 = () => `
${table(['Quantity', 'Formula', 'Unit'], [['Flux density', 'B = Φ/A', 'T (Wb/m²)'], ['Magnetomotive force', 'F_m = NI', 'A (ampere-turns)'], ['Magnetic field strength', 'H = NI/l', 'A/m'], ['Permeability', 'B = μ₀μᵣH; μ₀ = 4π × 10⁻⁷ H/m', ''], ['Reluctance', 'S = F_m/Φ = l/(μ₀μᵣA)', 'A/Wb'], ['Induced emf (moving conductor)', 'E = Blv', 'V'], ['Faraday / self-induction', 'E = −N dΦ/dt = −L di/dt', 'V'], ['Inductance', 'L = NΦ/I', 'H'], ['Energy in inductor', 'W = ½LI²', 'J'], ['Transformer', 'V₁/V₂ = N₁/N₂ = I₂/I₁', '']])}
${example('Coil 200 turns, 3 A, bar 250 mm long, area 0.4 m², μᵣ = 1000', 'H = NI/l = 600/0.25 = 2 400 A/m; B = μ₀μᵣH = 4π × 10⁻⁷ × 1000 × 2400 = <strong>3.02 T</strong>; Φ = BA = 3.02 × 0.4 = <strong>1.21 Wb</strong>.')}
${example('Transformer: 230 V primary, 2000 turns; 120 V output required', 'N₂ = N₁ × V₂/V₁ = 2000 × 120/230 = <strong>1 043 turns</strong>. If the secondary supplies 5 A, the ideal primary current = 120 × 5/230 = 2.61 A.')}
${example('Induced emf in a coil: 400 turns, flux falls from 5 mWb to 1 mWb in 20 ms', 'E = N ΔΦ/Δt = 400 × 0.004/0.02 = <strong>80 V</strong>.')}
${ul(['<strong>B/H curves</strong>: show saturation and hysteresis loops – soft iron (narrow loop, low losses) for transformer cores; hard steel (wide loop) for permanent magnets.', '<strong>Transformers</strong>: step-up (N₂ > N₁) or step-down; work only with AC by mutual induction; efficiency η = P_out/P_in.'])}`;

  /* ---------- C3 ---------- */
  const sine = S.lines([{ name: 'v = 3 sin(100πt)', col: P.blue, pts: Array.from({ length: 41 }, (_, i) => [i * 0.001, 3 * Math.sin(100 * Math.PI * i * 0.001)]) }], { w: 620, h: 240, ymin: -3.5, ymax: 3.5, xlabels: [[0, '0'], [0.01, '0.01'], [0.02, '0.02'], [0.03, '0.03'], [0.04, '0.04 s']], label: 'Sinusoidal voltage' });
  const c3 = () => `
${fig(sine, 'Amplitude (peak) = 3 V, period T = 0.02 s, so frequency f = 1/T = 50 Hz.')}
${table(['Quantity', 'Formula'], [['Frequency', 'f = 1/T'], ['Peak-to-peak', '2 × peak'], ['RMS (sine)', 'V_rms = V_peak/√2 = 0.707 V_peak'], ['Average (half cycle)', '0.637 V_peak'], ['Form factor', 'RMS/average = 1.11 for a sine wave'], ['Peak factor', 'peak/RMS = 1.414'], ['Instantaneous value', 'v = V_peak sin(2πft + φ)']])}
${table(['Component', 'Reactance', 'Phase'], [['Resistor', 'R', 'V and I in phase'], ['Inductor', 'X_L = 2πfL', 'I lags V by 90°'], ['Capacitor', 'X_C = 1/(2πfC)', 'I leads V by 90°'], ['R–L series', 'Z = √(R² + X_L²); I = V/Z', 'φ = tan⁻¹(X_L/R)'], ['R–C series', 'Z = √(R² + X_C²)', 'φ = tan⁻¹(X_C/R)']])}
${example('Coil with R = 560 Ω on 230 V, 50 Hz draws 0.12 A. Inductance?', 'Z = 230/0.12 = 1 916.7 Ω; X_L = √(1916.7² − 560²) = 1 833 Ω; L = X_L/(2πf) = 1833/314.2 = <strong>5.83 H</strong>.')}
${example('Phasor addition: v₁ = 10 sin ωt and v₂ = 6 sin(ωt + 60°)', 'Horizontal: 10 + 6 cos 60° = 13; vertical: 6 sin 60° = 5.196. Resultant = √(13² + 5.196²) = 14.0 V; phase = tan⁻¹(5.196/13) = 21.8° → v = 14.0 sin(ωt + 21.8°).')}
${example('RC circuit: 10 µF and 200 Ω on 230 V, 50 Hz', 'X_C = 1/(2π × 50 × 10 × 10⁻⁶) = 318 Ω; Z = √(200² + 318²) = 376 Ω; I = 0.612 A, leading the voltage by 57.9°.')}
${ul(['<strong>Adding two sinusoidal voltages</strong>: graphically (add instantaneous values point by point) or by phasors (resolve each into horizontal and vertical components, add, then use Pythagoras and tan⁻¹ for magnitude and phase).'])}`;

  window.BIZ_GUIDE_DATA = {
    storeKey: 'ra10-guide-revised-EN-aaq-u1', unitLabel: 'Unit 1 Guide', aimWord: 'Aim', aims: ['A', 'B', 'C'], setTaskTitle: 'The exam',
    titles: { A: 'Algebraic, trigonometric and calculus methods', B: 'Mechanical engineering', C: 'Electrical and electronic engineering' },
    subtitles: { A: 'Indices, logs, equations, radians, trig rules, vectors, mensuration, differentiation, integration, RMS', B: 'Statics, beams, stress and strain, motion, energy, power, machines, fluids', C: 'DC circuits, capacitors, Kirchhoff, magnetism, induction, transformers, AC theory and impedance' },
    setTask: setTask,
    topics: {
      A: [{ code: 'A1', name: 'Algebraic methods', html: a1 }, { code: 'A2', name: 'Trigonometric methods', html: a2 }, { code: 'A3', name: 'Calculus methods', html: a3 }],
      B: [{ code: 'B1', name: 'Static systems', html: b1 }, { code: 'B2', name: 'Dynamic systems', html: b2 }, { code: 'B3', name: 'Fluid systems', html: b3 }],
      C: [{ code: 'C1', name: 'DC electricity and circuits', html: c1 }, { code: 'C2', name: 'Magnetism and induction', html: c2 }, { code: 'C3', name: 'AC theory', html: c3 }]
    },
    gallery: []
  };
})();
