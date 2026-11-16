  /* ===== J · 2.4 Boolean logic ===== */
  TITLE.J = 'Boolean logic'; SUB.J = 'Paper 2 · AND, OR and NOT gates, logic diagrams and truth tables';
  const gateSyms = () => `<svg viewBox="0 0 660 130" role="img" aria-label="AND, OR and NOT gate symbols" style="width:100%;max-width:660px;height:auto;font-family:inherit" fill="currentColor">
    <g fill="none" stroke="currentColor" stroke-width="2.4">
      <path d="M40 40h40a30 30 0 0 1 0 60h-40z"/><path d="M10 55h30M10 85h30M110 70h40"/>
      <path d="M260 40q50 0 75 30q-25 30 -75 30q16 -30 0 -60z"/><path d="M230 55h37M230 85h37M335 70h40"/>
      <path d="M480 45l45 25-45 25z"/><circle cx="531" cy="70" r="6"/><path d="M450 70h30M537 70h40"/></g>
    <text x="80" y="122" text-anchor="middle" font-size="14" font-weight="800">AND</text><text x="300" y="122" text-anchor="middle" font-size="14" font-weight="800">OR</text><text x="512" y="122" text-anchor="middle" font-size="14" font-weight="800">NOT</text>
    <text x="4" y="52" font-size="12">A</text><text x="4" y="82" font-size="12">B</text><text x="154" y="74" font-size="12">P</text><text x="224" y="52" font-size="12">A</text><text x="224" y="82" font-size="12">B</text><text x="380" y="74" font-size="12">P</text><text x="444" y="66" font-size="12">A</text><text x="582" y="74" font-size="12">P</text></svg>`;
  T.J = [
    { code: '2.4.1', name: 'Logic gates and truth tables', html: () => `
${plain('Inside a computer, all decisions are made by <b>logic gates</b>: tiny circuits that take one or two inputs, each either <b>1 (true / on)</b> or <b>0 (false / off)</b>, and give one output. Combining gates lets a computer make decisions such as “if the door is open AND the alarm is set, sound the alarm”.')}
${fig(gateSyms(), 'Learn these three symbols — AND has a flat back and round front; OR is curved like a shield; NOT is a triangle with a small circle.')}
${table(['Gate', 'Output is 1 when…', 'Also written as'], [['<b>AND</b> (conjunction)', '<b>both</b> inputs are 1', 'A ∧ B, A . B'], ['<b>OR</b> (disjunction)', '<b>at least one</b> input is 1', 'A ∨ B, A + B'], ['<b>NOT</b> (negation)', 'the input is 0 — it <b>reverses</b> the input', '¬A, Ā']])}
${two(table(['A', 'B', 'A AND B'], [['0', '0', '0'], ['0', '1', '0'], ['1', '0', '0'], ['1', '1', '1']]) + table(['A', 'B', 'A OR B'], [['0', '0', '0'], ['0', '1', '1'], ['1', '0', '1'], ['1', '1', '1']]), table(['A', 'NOT A'], [['0', '1'], ['1', '0']]) + '<p class="csw-note">Truth tables list every possible combination of inputs. With 2 inputs there are 4 rows; with 3 inputs there are 8 rows (2<sup>n</sup>). List them in binary order: 000, 001, 010 … 111.</p>')}
${WG('logic', { c: 'c1' })}
${h3('Working out a combined expression')}
${steps(['Write a column for each input (A, B, C), listing every combination in binary order.', 'Add a column for <b>each part</b> of the expression — eg for P = (A AND B) OR NOT C, add columns “A AND B” and “NOT C”.', 'Work out each part row by row.', 'Combine the parts to get P.'])}
${table(['A', 'B', 'C', 'A AND B', 'NOT C', 'P = (A AND B) OR NOT C'], [['0', '0', '0', '0', '1', '1'], ['0', '0', '1', '0', '0', '0'], ['0', '1', '0', '0', '1', '1'], ['0', '1', '1', '0', '0', '0'], ['1', '0', '0', '0', '1', '1'], ['1', '0', '1', '0', '0', '0'], ['1', '1', '0', '1', '1', '1'], ['1', '1', '1', '1', '0', '1']])}
${h3('From a scenario to a logic diagram')}
${example('A security light', '<p>A light (L) turns on when it is <b>dark</b> (D = 1) <b>and</b> either <b>motion is detected</b> (M = 1) <b>or</b> the <b>manual switch</b> is on (S = 1).</p><p>Expression: <b>L = D AND (M OR S)</b>. Diagram: M and S go into an OR gate; its output and D go into an AND gate; the AND gate’s output is L. Try building the same shape — “(A OR B) AND C” — in the playground above.</p>')}
${tip('Draw gates with a ruler-neat shape, label every input and the output, and make sure every line connects. In truth tables, use intermediate columns — it is much easier to spot mistakes, and examiners can award marks for them.', 'Exam tips')}
${exam('Complete the truth table for P = NOT (A OR B).', 4, 'A=0,B=0 → P=1; A=0,B=1 → P=0; A=1,B=0 → P=0; A=1,B=1 → P=0 (1 mark per row).')}` }
  ];
