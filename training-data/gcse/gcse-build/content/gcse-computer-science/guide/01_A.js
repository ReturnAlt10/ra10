  /* ===== A · 1.1 Systems architecture ===== */
  TITLE.A = 'Systems architecture'; SUB.A = 'Paper 1 · the CPU, the fetch–execute cycle, CPU performance and embedded systems';
  const vonNeumann = () => `<svg viewBox="0 0 680 300" role="img" aria-label="Von Neumann architecture" style="width:100%;max-width:680px;height:auto;font-family:inherit" fill="currentColor">
    <rect x="10" y="10" width="360" height="280" rx="16" fill="${P.blue}" fill-opacity=".07" stroke="${P.blue}" stroke-width="2"/><text x="24" y="36" font-size="15" font-weight="800">CPU (processor)</text>
    <rect x="28" y="52" width="150" height="70" rx="10" fill="${P.teal}" fill-opacity=".15" stroke="${P.teal}" stroke-width="1.6"/><text x="103" y="82" text-anchor="middle" font-size="13" font-weight="800">Control Unit</text><text x="103" y="100" text-anchor="middle" font-size="10.5">decodes, sends signals</text>
    <rect x="198" y="52" width="150" height="70" rx="10" fill="${P.amber}" fill-opacity=".15" stroke="${P.amber}" stroke-width="1.6"/><text x="273" y="82" text-anchor="middle" font-size="13" font-weight="800">ALU</text><text x="273" y="100" text-anchor="middle" font-size="10.5">arithmetic + logic</text>
    ${['PC', 'MAR', 'MDR', 'ACC'].map((r, i) => `<rect x="${28 + i * 82}" y="140" width="72" height="54" rx="9" fill="${P.violet}" fill-opacity=".14" stroke="${P.violet}" stroke-width="1.5"/><text x="${64 + i * 82}" y="${172}" text-anchor="middle" font-size="13" font-weight="800">${r}</text>`).join('')}
    <text x="28" y="212" font-size="11" opacity=".8">registers: tiny, super-fast stores inside the CPU</text>
    <rect x="28" y="224" width="320" height="50" rx="9" fill="${P.green}" fill-opacity=".14" stroke="${P.green}" stroke-width="1.5"/><text x="188" y="254" text-anchor="middle" font-size="13" font-weight="800">Cache — fast memory for frequent data</text>
    <rect x="460" y="40" width="200" height="140" rx="14" fill="${P.slate}" fill-opacity=".12" stroke="${P.slate}" stroke-width="2"/><text x="560" y="78" text-anchor="middle" font-size="15" font-weight="800">Main memory (RAM)</text><text x="560" y="100" text-anchor="middle" font-size="11">instructions AND data</text><text x="560" y="118" text-anchor="middle" font-size="11">stored together, each at</text><text x="560" y="134" text-anchor="middle" font-size="11">a numbered address</text>
    <rect x="460" y="200" width="200" height="70" rx="14" fill="${P.pink}" fill-opacity=".12" stroke="${P.pink}" stroke-width="2"/><text x="560" y="232" text-anchor="middle" font-size="14" font-weight="800">Input / output</text><text x="560" y="252" text-anchor="middle" font-size="11">keyboard, screen, storage…</text>
    <path d="M370 90H460M370 120H460M370 150H460" stroke="${P.slate}" stroke-width="3"/><text x="415" y="84" text-anchor="middle" font-size="10">buses</text>
    <path d="M370 235H460" stroke="${P.slate}" stroke-width="3"/></svg>`;

  T.A = [
    { code: '1.1.1', name: 'Architecture of the CPU', html: () => `
${plain('The <b>CPU</b> (Central Processing Unit, or processor) is the part of a computer that <b>processes data and instructions</b>. Every program you run — a game, a browser, a calculator — is a long list of very simple instructions. The CPU follows them one after another, billions of times a second, using the <b>fetch–decode–execute cycle</b>.')}
${h3('Von Neumann architecture')}
${p('Almost every computer today follows the <b>von Neumann architecture</b>. Its big idea is the <b>stored program concept</b>: the program\'s <b>instructions and the data</b> they work on are stored <b>together in the same main memory (RAM)</b>, and the CPU fetches the instructions one at a time and carries them out in order.')}
${fig(vonNeumann(), 'Von Neumann architecture: a CPU with a control unit, ALU, registers and cache, connected to one memory that stores instructions and data.')}
${h3('The parts of the CPU')}
${table(['Component', 'What it does', 'Remember it as'], [
  ['<b>ALU</b> (Arithmetic Logic Unit)', 'Carries out <b>arithmetic</b> (add, subtract…) and <b>logic</b> operations (comparisons such as “is A &gt; B?”, AND/OR/NOT, binary shifts).', 'the calculator'],
  ['<b>CU</b> (Control Unit)', '<b>Decodes</b> instructions and sends <b>control signals</b> to the other parts; it manages the fetch–execute cycle and controls the flow of data inside the CPU and between the CPU and memory.', 'the manager / conductor'],
  ['<b>Cache</b>', 'A small amount of very <b>fast memory</b> inside (or very close to) the CPU. It stores <b>frequently used</b> data and instructions so the CPU does not have to wait for slower RAM.', 'a desk drawer vs the filing cabinet (RAM)'],
  ['<b>Registers</b>', 'Tiny, extremely fast storage locations <b>inside the CPU</b>, each holding one value used in the fetch–execute cycle.', 'sticky notes in the CPU']])}
${h3('The four registers you must know')}
${table(['Register', 'Holds', 'Data or address?'], [
  ['<b>Program Counter (PC)</b>', 'The <b>address</b> of the <b>next instruction</b> to be fetched. It is incremented after each fetch.', 'Address'],
  ['<b>Memory Address Register (MAR)</b>', 'The <b>address</b> in memory that is about to be <b>read from or written to</b>.', 'Address'],
  ['<b>Memory Data Register (MDR)</b>', 'The <b>data or instruction</b> that has just been <b>fetched from</b> memory, or is about to be <b>written to</b> memory.', 'Data (or an instruction)'],
  ['<b>Accumulator (ACC)</b>', 'The <b>result of calculations</b> done by the ALU.', 'Data']])}
${warn('The most common mistake is mixing up the MAR and MDR. <b>A</b>ddress → MAR (<b>A</b> for <b>A</b>ddress). <b>D</b>ata → MDR. An “address” is the location (like a house number); “data” is what is stored there (the people in the house).', 'MAR vs MDR')}
${h3('The fetch–decode–execute cycle')}
${fig(S.cycle([['Fetch', 'PC → MAR; PC + 1; instruction → MDR'], ['Decode', 'CU works out what the instruction means'], ['Execute', 'carry it out: ALU, memory or I/O']], { h: 280, label: 'Fetch, decode, execute', center: 'repeats billions of times a second' }), 'The cycle repeats for every instruction until the program ends.')}
${steps(['<b>Fetch:</b> the address in the <b>PC</b> is copied to the <b>MAR</b>. The PC is <b>incremented</b> (+1) so it points to the next instruction. The instruction at the address in the MAR is fetched from memory and stored in the <b>MDR</b>.', '<b>Decode:</b> the <b>Control Unit</b> decodes the instruction to work out what needs to happen.', '<b>Execute:</b> the instruction is carried out — eg data is loaded from memory, the <b>ALU</b> does a calculation and the result goes into the <b>Accumulator</b>, or a value is written to memory.'])}
${WG('fde')}
${tip('OCR does <b>not</b> require you to describe how data moves between registers at each stage in detail. You <b>do</b> need to know what happens at each stage and the purpose of each register — say what it holds and whether that is data or an address.', 'What OCR asks for')}
${exam('Describe the purpose of the Program Counter and the MAR in the fetch–execute cycle.', 2, 'The Program Counter holds the address of the next instruction to be fetched (1). The MAR holds the address in memory of the data or instruction that is about to be fetched / written (1).')}
${exam('Explain the purpose of the CPU.', 2, 'The CPU processes data and instructions (1) by repeatedly carrying out the fetch–decode–execute cycle (1).')}` },

    { code: '1.1.2', name: 'CPU performance', html: () => `
${plain('Three things inside the CPU decide how quickly it can work through instructions: how <b>fast</b> its cycle runs (clock speed), how many instructions it can work on <b>at once</b> (cores) and how much fast memory it has <b>close by</b> (cache).')}
${table(['Characteristic', 'What it is', 'Effect of increasing it', 'Limits'], [
  ['<b>Clock speed</b>', 'The number of fetch–execute cycles per second, measured in hertz (Hz). 3.2 GHz = 3.2 <b>billion</b> cycles per second.', 'More instructions are processed per second, so programs run faster.', 'More heat and power use; can only go so high before the CPU overheats.'],
  ['<b>Number of cores</b>', 'A core is a complete processing unit. A quad-core CPU has 4.', 'Each core can process a different instruction at the same time, so more work is done at once (multitasking, or parallel tasks).', 'Not every program can be split into parallel tasks; software must be written to use several cores; cores share resources, so 2 cores is <b>not</b> always twice as fast.'],
  ['<b>Cache size</b>', 'The amount of fast memory in/near the CPU.', 'More frequently used data and instructions can be kept close, so the CPU makes fewer slower trips to RAM.', 'Cache is expensive; the extra benefit gets smaller as cache gets bigger.']])}
${WG('perf')}
${key('Why is cache faster than RAM?', 'Cache is physically inside or next to the CPU and built from faster memory, so data reaches the CPU in far fewer clock cycles. When the CPU needs something, it checks the cache first; only if it is not there does it fetch it from RAM.')}
${warn('“More cores = faster” only earns marks if you explain it: <b>more instructions can be processed at the same time</b> (simultaneously). For a single task that cannot be split up, extra cores make little difference.', 'Common mistake')}
${exam('A computer has a 2.5 GHz dual-core CPU. Explain how upgrading to a 2.5 GHz quad-core CPU could improve performance.', 2, 'The quad-core CPU has four cores instead of two, so it can process four instructions at the same time (1) which means more instructions are processed per second / multiple programs can run more smoothly (1).', 'For “explain”, always say WHY the change helps — not just that it is faster.')}` },

    { code: '1.1.3', name: 'Embedded systems', html: () => `
${plain('An <b>embedded system</b> is a small computer system <b>built inside a larger device</b> to do <b>one dedicated job</b>. A washing machine contains a tiny computer that only runs washing programmes — you cannot install a game on it.')}
${cards([['Dedicated function', 'designed for one specific task (or a small set of tasks)', P.teal], ['Small and cheap', 'built from simple, low-cost parts, often a microcontroller', P.blue], ['Low power', 'often runs on batteries or uses little electricity', P.green], ['Reliable', 'has to work for years without crashing or being restarted', P.amber], ['Limited interface', 'a few buttons, a small display — or none at all', P.violet], ['Program in ROM', 'its instructions (firmware) are stored permanently and rarely change', P.red]], 3)}
${table(['Embedded system', 'What it controls'], [['Washing machine', 'Water level, temperature, drum speed, timer'], ['Microwave oven', 'Power level, timer, turntable'], ['Car engine management', 'Fuel injection and ignition timing'], ['Traffic lights', 'The sequence and timing of the lights'], ['Central heating / smart thermostat', 'Switches the boiler on and off to reach the set temperature'], ['Digital camera, fitness tracker, sat nav', 'Their own single-purpose features']])}
${two(`<h4>Embedded system</h4>${ul(['One dedicated task', 'Program in ROM, rarely updated', 'Usually no general operating system the user can see', 'Example: a microwave'])}`, `<h4>General-purpose computer</h4>${ul(['Runs many different programs', 'Programs installed and changed by the user', 'Full operating system and user interface', 'Example: a laptop'])}`)}
${exam('Identify two characteristics of an embedded system.', 2, 'It has a dedicated function (1). It is small / low power / low cost / its program is stored in ROM (1).')}
${exam('Give two examples of devices that contain an embedded system.', 2, 'A washing machine (1), a microwave / dishwasher / traffic lights / car engine management / a sat nav (1).')}` }
  ];
