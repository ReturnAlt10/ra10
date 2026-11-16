/* guide — hand-written RA10 content. Generated from training-data/a-level/alevel-build/content/gcse-computer-science/guide/ (edit the parts there, then run build_alevel.py). */

/* ---- 00_head.js ---- */
/* OCR GCSE (9–1) Computer Science (J277) — RA10 revision guide. One part per chapter (1.1 … 2.5); parts register into
   T / TITLE / SUB below. Every topic starts from the basics, then builds to exam level. WG('name') drops in an
   interactive diagram (98_widgets.js). Code is shown in OCR Exam Reference Language (ERL) and Python side by side. */
(function () {
  'use strict';
  const { svg: S, h: H } = window.BizGuide;
  const { key, tip, warn, fig, table, ul, ol, example, stats, check, two, steps, cards, code } = H;
  const P = { blue: '#2563eb', sky: '#0284c7', teal: '#0d9488', green: '#16a34a', amber: '#d97706', orange: '#ea580c', red: '#dc2626', pink: '#db2777', violet: '#7c3aed', slate: '#64748b', navy: '#1e3a8a' };
  const T = {}, TITLE = {}, SUB = {};
  const p = (...xs) => xs.map(x => `<p>${x}</p>`).join('');
  const h3 = (t) => `<h3>${t}</h3>`;
  const h4 = (t) => `<h4>${t}</h4>`;
  // interactive diagram placeholder (mounted by 98_widgets.js)
  const WG = (name, o) => `<div class="csw" data-w="${name}"${o ? ` data-o='${JSON.stringify(o).replace(/'/g, '&#39;')}'` : ''}><p class="csw-note">Loading interactive diagram…</p></div>`;
  // OCR Exam Reference Language and Python side by side
  const erl = (ocr, py, cap) => two(`<h4>OCR Exam Reference Language</h4>${code(ocr)}`, `<h4>Python</h4>${code(py)}`) + (cap ? `<p class="csw-note" style="margin-top:-4px">${cap}</p>` : '');
  // "In plain English" starter box
  const plain = (body) => `<div class="g-callout g-tip"><strong>In plain English</strong><div>${body}</div></div>`;
  // worked exam question with a model answer
  const exam = (q, marks, ans, note) => example(`Exam question (${marks} mark${marks > 1 ? 's' : ''})`, `<p><b>${q}</b></p><p><i>Model answer:</i> ${ans}</p>${note ? `<p class="csw-note">${note}</p>` : ''}`);
  const terms = (rows) => table(['Key term', 'What it means'], rows.map(r => [`<b>${r[0]}</b>`, r[1]]));
  const pyLab = (task, label) => `<p><a class="g-pill" style="--c:#0f766e;text-decoration:none" href="/tools/python-lab/?course=gcse${task ? '&task=' + task : ''}" target="_top">▶ ${label || 'Practise this in the GCSE Python Lab'}</a></p>`;

  const setTask = () => `
${stats([['2', 'exam papers'], ['1 h 30', 'each paper'], ['80', 'marks per paper'], ['50%', 'of the GCSE each'], ['No', 'calculators allowed']])}
${p('OCR GCSE Computer Science (J277) is assessed by <b>two written exams</b>, both taken at the end of Year 11. There is no coursework mark, but you must have had the chance to do a practical programming project in lessons. The two papers test <b>different content</b> — so revise them differently.')}
${table(['', 'Paper 1 · Computer systems (J277/01)', 'Paper 2 · Computational thinking, algorithms and programming (J277/02)'], [
  ['Content', 'Chapters <b>1.1–1.6</b>: systems architecture, memory and storage, networks, network security, systems software, ethical/legal/cultural/environmental impacts', 'Chapters <b>2.1–2.5</b>: algorithms, programming fundamentals, robust programs, Boolean logic, languages and IDEs'],
  ['Time and marks', '1 hour 30 minutes · 80 marks', '1 hour 30 minutes · 80 marks'],
  ['Structure', 'All questions compulsory; short answers, tables to complete, calculations, and <b>one 8-mark extended response</b> (marked *) on the impact of technology', '<b>Section A</b> (50 marks, ~50 min): algorithms, data, logic, testing, languages. <b>Section B</b> (30 marks, ~40 min): one long scenario where you <b>read, trace, write and refine code</b>'],
  ['Code', 'Very little', 'Lots: in OCR Exam Reference Language <b>or</b> a high-level language you know (eg Python). Some questions say which; Section B questions are clearly marked'],
  ['What wins marks', 'Precise definitions, applying knowledge to the scenario, accurate conversions and file-size calculations', 'Accurate tracing, working algorithms, correct use of programming constructs (not English descriptions!)']])}
${fig(S.ladder([['State / Identify / Give / Name — 1 mark each', 'A word, phrase or value. No explanation needed.'], ['Describe — 2+ marks', 'Say what it is / what happens, with detail. One mark per valid point.'], ['Explain — 2+ marks', 'Point + reason: “… because …” / “… so that …”. Linked points earn the second mark.'], ['Compare / Justify', 'Similarities and differences, or reasons for a choice, linked to the scenario.'], ['Discuss* — 8 marks (Paper 1)', 'Both sides, several areas (eg ethical, legal, environmental), applied to the context, with a conclusion.']], { w: 700, rowH: 50, label: 'Command words, from easiest to hardest' }), 'Look at the command word and the number of marks — they tell you how much to write.')}
${h3('Paper 2, Section B: writing code')}
${p('Some Section B questions require you to respond using <b>OCR Exam Reference Language or a high-level programming language</b>. Examiners mark the <b>logic and the constructs</b> (input, loops, selection, arrays…), not perfect syntax — but an answer written in English sentences, bullet points or vague pseudocode <b>gets no marks</b> on these questions. This guide shows every construct in both OCR Exam Reference Language and Python, and the Python Lab lets you practise writing real code.')}
${pyLab('', 'Open the GCSE Python Lab — auto-marked programming practice for Paper 2')}
${h3('How this guide works')}
${check(['Every topic starts with a plain-English explanation, then builds to exam level — read the topics in order if a chapter is new to you.', 'Interactive diagrams (marked <b>Try it</b>) let you click, step through and change things — use them until you can predict what will happen.', 'Each topic ends with a worked exam question and a model answer in the style the OCR mark scheme rewards.', 'Questions from real OCR papers are in <b>Practise by topic</b>, filtered to the same chapter — practise straight after reading.'])}
${warn('Do not mix up the papers: <b>binary, hex, file sizes and storage are Paper 1</b> (1.2), but <b>logic gates and truth tables are Paper 2</b> (2.4). Searching and sorting algorithms are Paper 2 (2.1).', 'Which paper is it on?')}`;

/* ---- 01_A.js ---- */
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

/* ---- 02_B.js ---- */
  /* ===== B · 1.2 Memory and storage ===== */
  TITLE.B = 'Memory and storage'; SUB.B = 'Paper 1 · RAM, ROM, virtual memory, secondary storage, units, binary, hex, characters, images, sound and compression';
  const memLadder = () => S.ladder([['Registers', 'inside the CPU — fastest, tiny'], ['Cache', 'in/next to the CPU — very fast, small'], ['RAM (main memory)', 'fast, gigabytes, volatile'], ['Secondary storage (SSD / HDD)', 'slower, huge, non-volatile — keeps data when off']], { w: 680, rowH: 46, label: 'The memory hierarchy' });

  T.B = [
    { code: '1.2.1', name: 'Primary storage (memory)', html: () => `
${plain('<b>Primary storage</b> is the memory the CPU can access <b>directly</b> — RAM, ROM, cache and registers. The CPU cannot run a program straight from a hard drive: the program and its data must first be copied into <b>RAM</b>, because RAM is fast enough to keep up with the CPU.')}
${fig(memLadder(), 'The closer memory is to the CPU, the faster — and smaller and more expensive — it is.')}
${h3('RAM and ROM')}
${table(['', 'RAM (Random Access Memory)', 'ROM (Read Only Memory)'], [
  ['Can it be changed?', 'Read <b>and write</b> — contents change all the time', '<b>Read only</b> — contents cannot normally be changed'],
  ['Volatile?', '<b>Volatile</b>: everything is lost when the power is turned off', '<b>Non-volatile</b>: keeps its contents without power'],
  ['What it stores', 'The <b>operating system, programs and data currently in use</b>', 'The <b>start-up instructions</b> (the BIOS / bootstrap loader) that load the operating system when the computer is switched on'],
  ['Size', 'Large (several gigabytes)', 'Small']])}
${key('Why do computers need primary storage?', 'The CPU works far faster than secondary storage can supply data. Primary storage (RAM) is fast enough to hold the instructions and data the CPU is using <b>right now</b>, so it is not kept waiting.')}
${h3('Virtual memory')}
${p('If you open lots of programs, RAM can fill up. Instead of refusing to open another program, the operating system uses <b>virtual memory</b>: a section of <b>secondary storage</b> (the SSD or hard drive) used <b>as if it were RAM</b>.')}
${steps(['RAM is full, but another program or file needs space.', 'The operating system moves data that is <b>not currently being used</b> out of RAM into virtual memory on secondary storage.', 'The new data is loaded into the freed space in RAM.', 'When the moved data is needed again, it is <b>swapped back</b> into RAM (and something else moves out).'])}
${WG('vm')}
${warn('Virtual memory lets more programs run, but secondary storage is <b>much slower</b> than RAM, so constantly swapping data back and forth makes the computer slow down (this is called <i>disk thrashing</i>). The real fix is to add more RAM.', 'The drawback')}
${exam('Explain why a computer might need virtual memory.', 2, 'When RAM is full (1), part of secondary storage is used as temporary RAM so that more programs/data can still be loaded / the computer does not crash (1).')}` },

    { code: '1.2.2', name: 'Secondary storage', html: () => `
${plain('<b>Secondary storage</b> keeps your files, programs and the operating system <b>permanently</b>, even when the computer is off. It is <b>non-volatile</b>. Without it, everything would vanish every time you switched off.')}
${h3('The three types')}
${table(['Type', 'How it stores data (no detail needed)', 'Examples'], [
  ['<b>Magnetic</b>', 'Magnetised areas on spinning platters or tape; a read/write head moves over them — <b>moving parts</b>', 'Hard disk drive (HDD), magnetic tape'],
  ['<b>Optical</b>', 'A laser reads pits and lands on the surface of a disc', 'CD, DVD, Blu-ray'],
  ['<b>Solid state</b>', 'Electronic flash memory chips — <b>no moving parts</b>', 'Solid state drive (SSD), USB memory stick, SD card']])}
${h3('Choosing a device — the six characteristics')}
${table(['Characteristic', 'Meaning', 'Magnetic (HDD)', 'Optical', 'Solid state (SSD)'], [
  ['<b>Capacity</b>', 'How much it can store', 'High (often terabytes)', 'Low (CD 700 MB, single-layer DVD 4.7 GB, single-layer Blu-ray 25 GB)', 'Medium–high'],
  ['<b>Speed</b>', 'How fast data is read/written', 'Medium (moving parts)', 'Slow', 'Fastest'],
  ['<b>Portability</b>', 'How easy to carry', 'Fairly heavy; external drives are portable', 'Very portable discs', 'Very portable, small and light'],
  ['<b>Durability</b>', 'Survives knocks, drops, heat', 'Low — moving parts can be damaged if dropped', 'Low — easily scratched', 'High — no moving parts'],
  ['<b>Reliability</b>', 'Keeps working correctly over time', 'Reliable, but moving parts wear out', 'Degrades if scratched', 'Very reliable, but has a limited number of write cycles'],
  ['<b>Cost</b>', 'Price per gigabyte', 'Low per GB', 'Very low per disc', 'Higher per GB']])}
${tip('Exam questions give a <b>scenario</b> and ask you to choose. Always <b>justify with the characteristics that matter in that scenario</b>: eg a camera for a mountain-bike rider → solid state because it is <b>durable</b> (no moving parts to break when shaken) and <b>portable</b>; a school file server storing years of work → magnetic because it gives <b>high capacity</b> at <b>low cost</b>.', 'How to answer “which storage?”')}
${exam('A photographer wants to transfer photos from a camera to secondary storage to take on location. Recommend a type of storage and justify your choice.', 3, 'Solid state (1) because it has no moving parts so it is durable if dropped (1), and it is small/light so it is portable (1). Also fast to transfer large photo files.')}` },

    { code: '1.2.3', name: 'Units', html: () => `
${plain('Computers store everything as <b>binary</b> — 1s and 0s — because they are built from billions of tiny switches (transistors) that are either <b>on (1) or off (0)</b>. One 1 or 0 is a <b>bit</b>. Bigger units are just bigger groups of bits.')}
${table(['Unit', 'Size', 'Roughly holds…'], [['Bit (b)', 'a single 1 or 0', 'yes/no'], ['Nibble', '4 bits', 'one hex digit'], ['Byte (B)', '8 bits', 'one character of text'], ['Kilobyte (KB)', '1,000 bytes', 'a short text document'], ['Megabyte (MB)', '1,000 KB', 'a photo or a minute of music'], ['Gigabyte (GB)', '1,000 MB', 'a film'], ['Terabyte (TB)', '1,000 GB', 'a large hard drive'], ['Petabyte (PB)', '1,000 TB', 'a data centre']])}
${fig(S.flow([['bit'], ['nibble', '× 4'], ['byte', '× 2'], ['KB', '× 1,000'], ['MB', '× 1,000'], ['GB', '× 1,000'], ['TB', '× 1,000'], ['PB', '× 1,000']], { w: 700, h: 64, label: 'Units of data' }), 'Going up a unit: divide by 1,000. Going down: multiply by 1,000. (OCR also accepts 1,024.)')}
${WG('units')}
${h3('Calculating file sizes — learn these three formulas')}
${table(['File', 'Formula (answer in bits)', 'Worked example'], [
  ['<b>Sound</b>', 'sample rate (Hz) × duration (s) × bit depth', '44,100 × 60 × 16 = 42,336,000 bits ÷ 8 = 5,292,000 bytes = <b>5.292 MB</b>'],
  ['<b>Image</b>', 'colour depth × image height (px) × image width (px)', '24 × 800 × 1,000 = 19,200,000 bits ÷ 8 = 2,400,000 bytes = <b>2.4 MB</b>'],
  ['<b>Text</b>', 'bits per character × number of characters', '8 × 500 = 4,000 bits ÷ 8 = <b>500 bytes</b>']])}
${steps(['Write the formula.', 'Substitute the numbers — show this line, it earns marks even if you slip later.', 'Work out the answer in <b>bits</b>.', 'Divide by 8 for bytes, then by 1,000 for each step up (KB, MB, GB). State the unit.'])}
${example('Storage needed for a set of files', '<p>A student has 20 photos of 3 MB each and 4 songs of 5 MB each. How much storage is needed?</p><p>20 × 3 = 60 MB; 4 × 5 = 20 MB; total = <b>80 MB</b>. Will they fit on a 16 GB USB stick? 16 GB = 16,000 MB, so yes, easily.</p>')}
${tip('You may use 1,024 instead of 1,000 — both are accepted — but be consistent and show your working. OCR also allows you to add a little extra for metadata if you say so.', 'Calculation tip')}` },

    { code: '1.2.4', name: 'Data storage: numbers', html: () => `
${plain('We count in <b>denary</b> (base 10): each column is worth 10 times the one to its right (1, 10, 100…). Computers count in <b>binary</b> (base 2): each column is worth 2 times the one to its right (1, 2, 4, 8…). Programmers also use <b>hexadecimal</b> (base 16) as a short way to write binary.')}
${h3('Denary ↔ binary (up to 8 bits: 0–255)')}
${table(['128', '64', '32', '16', '8', '4', '2', '1'], [['0', '1', '1', '0', '1', '0', '0', '1']])}
${p('<b>Binary → denary:</b> add up the place values that have a 1 under them. Above: 64 + 32 + 8 + 1 = <b>105</b>.', '<b>Denary → binary:</b> work from the left. Does 128 fit into 105? No → 0. Does 64 fit? Yes → 1, leaving 41. 32 fits → 1, leaving 9. 16 → 0. 8 → 1, leaving 1. 4 → 0, 2 → 0, 1 → 1. So 105 = <b>01101001</b>.')}
${WG('binary', { v: 105 })}
${p('The leftmost bit is the <b>most significant bit (MSB)</b> — it has the biggest value. The rightmost is the <b>least significant bit (LSB)</b>. Leading zeros do not change the value: <code>11010</code> = <code>00011010</code> = 26. With 8 bits the largest value is <code>11111111</code> = 255, and with <i>n</i> bits the largest is 2<sup>n</sup> − 1.')}
${h3('Hexadecimal (00–FF)')}
${table(['Denary', '0–9', '10', '11', '12', '13', '14', '15'], [['Hex', '0–9', 'A', 'B', 'C', 'D', 'E', 'F']])}
${p('<b>Why hex?</b> One hex digit represents exactly 4 bits (a nibble), so hex is <b>shorter and easier for humans to read, write and remember</b> than long binary numbers, with fewer mistakes. It is used for colour codes (eg #FF0000) and MAC addresses. The computer still stores it as binary.')}
${steps(['<b>Binary → hex:</b> split the 8 bits into two nibbles, convert each nibble to denary (0–15), then to its hex digit. <code>1011 0110</code> → 11, 6 → <b>B6</b>.', '<b>Hex → binary:</b> convert each hex digit into a 4-bit nibble. <b>2D</b> → 2 = <code>0010</code>, D = 13 = <code>1101</code> → <code>00101101</code>.', '<b>Hex → denary:</b> first digit × 16 + second digit. 2D = 2 × 16 + 13 = <b>45</b>.', '<b>Denary → hex:</b> divide by 16 — the whole number part is the first digit, the remainder is the second. 182 ÷ 16 = 11 remainder 6 → <b>B6</b>.'])}
${h3('Binary addition and overflow')}
${p('Add column by column from the right. The four rules: 0 + 0 = 0 · 1 + 0 = 1 · 1 + 1 = 0 carry 1 · 1 + 1 + 1 = 1 carry 1.')}
${WG('binadd', { a: 107, b: 15 })}
${key('Overflow error', 'When the result of an addition needs <b>more bits than the register can hold</b> (eg more than 8 bits, so a total over 255), the extra carry bit is lost. The stored answer is wrong. Example: 200 + 100 = 300, but 8 bits can only hold 0–255.')}
${h3('Binary shifts')}
${p('A <b>left shift</b> moves every bit left by a number of places and fills the gaps on the right with 0s. Each place <b>multiplies by 2</b> (left 3 places = × 8). A <b>right shift</b> moves bits right, filling with 0s on the left; each place <b>divides by 2</b> (right 2 places = ÷ 4). Bits shifted off the end are <b>lost</b>, which can make the answer inaccurate.')}
${WG('shift')}
${exam('Convert the denary number 105 into 8-bit binary and the binary number 00011110 into denary.', 2, '105 = 01101001 (1). 00011110 = 16 + 8 + 4 + 2 = 30 (1).')}
${exam('Show the result of a left binary shift of 4 places on 00001111, and state its effect.', 2, '11110000 (1). The value is multiplied by 2⁴ = 16 (15 → 240) (1).')}` },

    { code: '1.2.4c', name: 'Data storage: characters, images and sound', html: () => `
${h3('Characters')}
${plain('Every character you type (letters, digits, punctuation, spaces) is given a <b>unique binary code</b>. The full list of characters a computer can represent, with their codes, is a <b>character set</b>.')}
${table(['Character set', 'Bits per character', 'Characters it can represent', 'Notes'], [['<b>ASCII</b>', '7 bits (stored in 8 in the exam)', '2⁷ = 128 (extended ASCII: 2⁸ = 256)', 'English letters, digits, punctuation and control codes'], ['<b>Unicode</b>', 'more bits (eg 16 or 32)', 'far more — every language, symbols and emoji', 'Each character takes more storage']])}
${p('The more bits per character, the more characters can be represented: <b>number of characters = 2<sup>bits</sup></b>. To store 150 different characters you need 8 bits (2⁷ = 128 is not enough, 2⁸ = 256 is). Codes are in a <b>logical order</b>: if A = 65 then B = 66, C = 67. You do <b>not</b> need to memorise the codes.')}
${WG('ascii')}
${h3('Images (bitmaps)')}
${p('A bitmap image is a grid of <b>pixels</b> (picture elements). Each pixel is one colour, stored as a <b>binary code</b>. The <b>colour depth</b> is the number of bits per pixel — <i>n</i> bits gives 2<sup>n</sup> possible colours (1 bit: 2 colours, 8 bits: 256, 24 bits: about 16.7 million). The <b>resolution</b> is the number of pixels (width × height).')}
${WG('pixel')}
${table(['Change', 'Effect on quality', 'Effect on file size'], [['Increase the colour depth', 'More colours, more realistic image', 'Larger (more bits per pixel)'], ['Increase the resolution', 'More detail, less pixelated', 'Larger (more pixels to store)']])}
${key('Metadata', 'Extra data stored <b>about</b> the image so it can be displayed correctly — eg its <b>width, height, colour depth</b>, file type, date taken or camera settings.')}
${h3('Sound')}
${p('Sound is <b>analogue</b> (a smooth, continuously changing wave) but computers can only store <b>digital</b> binary data. So the sound wave is <b>sampled</b>: its amplitude (height) is measured at regular intervals and each measurement is stored as a binary number.')}
${WG('sound')}
${table(['Term', 'Meaning', 'Higher value means'], [['<b>Sample rate</b>', 'The number of samples taken per second, in hertz (Hz) — eg 44,100 Hz', 'Closer to the original sound, better quality, bigger file'], ['<b>Bit depth</b>', 'The number of bits used to store each sample — eg 16 bits', 'Each sample is more accurate, better quality, bigger file'], ['<b>Duration</b>', 'How many seconds of sound are stored', 'Bigger file']])}
${exam('Explain how increasing the sample rate affects a sound file.', 2, 'More samples are taken each second, so the stored sound is closer to the original / better playback quality (1), but more data is stored, so the file size increases (1).')}` },

    { code: '1.2.5', name: 'Compression', html: () => `
${plain('<b>Compression</b> makes files smaller. Smaller files take up less storage space and are <b>quicker to send</b> over the internet (less bandwidth, faster downloads, smoother streaming, can be emailed within attachment limits).')}
${two(`<h4>Lossless compression</h4>${ul(['Reduces the file size <b>without losing any data</b>', 'The original file can be <b>restored exactly</b>', 'Smaller reduction in size than lossy', 'Used when every bit matters: <b>text documents, program code, spreadsheets</b>, some images (PNG)'])}`, `<h4>Lossy compression</h4>${ul(['<b>Permanently removes</b> some data — usually detail people are unlikely to notice', 'The original <b>cannot</b> be restored', 'Much smaller files', 'Used for <b>photos (JPEG), music (MP3) and video</b> — especially streaming'])}`)}
${WG('compress')}
${tip('Match the type to the scenario: a program file or a bank statement must be <b>lossless</b> — losing even one character would break it or make it wrong. A photo to post online can be <b>lossy</b> — a small loss of quality is acceptable for a much smaller file.', 'Choosing a type')}
${exam('A student wants to email a large program file to a friend. Explain why lossless compression should be used.', 2, 'Lossless compression does not lose any data / the file can be restored exactly (1), which matters because if any part of the program were removed it would not run correctly (1).')}` }
  ];

/* ---- 03_C.js ---- */
  /* ===== C · 1.3 Computer networks, connections and protocols ===== */
  TITLE.C = 'Computer networks, connections and protocols'; SUB.C = 'Paper 1 · LANs and WANs, network hardware, the internet, DNS, the Cloud, topologies, wired vs wireless, addressing and protocols';
  T.C = [
    { code: '1.3.1', name: 'Networks and topologies', html: () => `
${plain('A <b>network</b> is two or more computers connected together so they can <b>share data and resources</b> — files, printers, an internet connection, storage. Your school network and the internet are both networks.')}
${h3('LAN and WAN')}
${table(['', 'LAN — Local Area Network', 'WAN — Wide Area Network'], [['Area', 'A <b>small geographical area</b> — one building or site', 'A <b>large geographical area</b> — towns, countries, the world'], ['Hardware owned by', 'The organisation that uses it', 'Usually rents/leases connections from telecoms companies (cables, satellites)'], ['Examples', 'A school, a home, an office', 'The internet (the biggest WAN); a bank linking all its branches']])}
${h3('Client–server and peer-to-peer')}
${two(`<h4>Client–server</h4>${ul(['A central <b>server</b> provides services: it stores files, manages logins and security, backups and updates', '<b>Clients</b> (the users’ computers) request services from the server', '✓ Central control: easier to back up, secure and manage', '✗ Servers are expensive and need specialist staff; if the server fails, clients lose access'])}`, `<h4>Peer-to-peer</h4>${ul(['No central server — every computer (peer) is <b>equal</b>', 'Each peer stores its own files and shares directly with others', '✓ Cheap and easy to set up; no single point of failure', '✗ No central backup or security; files can be hard to find; a peer may be switched off'])}`)}
${h3('The hardware needed to build a LAN')}
${table(['Device', 'Job'], [
  ['<b>NIC</b> (Network Interface Controller/Card)', 'Lets a device connect to a network (wired or wireless). Every NIC has a unique <b>MAC address</b>.'],
  ['<b>Switch</b>', 'Connects devices <b>on a LAN</b>. It receives data and sends it <b>only to the device it is addressed to</b> (using MAC addresses).'],
  ['<b>Router</b>', 'Connects <b>different networks</b> together — eg your LAN to the internet. It forwards packets towards their destination using <b>IP addresses</b>.'],
  ['<b>Wireless access point (WAP)</b>', 'Lets wireless devices connect to a wired network using Wi-Fi.'],
  ['<b>Transmission media</b>', 'What carries the data: copper cable (eg Ethernet), fibre-optic cable, or radio waves (wireless).']])}
${tip('A home “router” is really a router, switch and wireless access point in one box — but in the exam describe each job separately.', 'Exam tip')}
${h3('Factors that affect network performance')}
${table(['Factor', 'Why it matters'], [['<b>Bandwidth</b>', 'The amount of data that can be sent per second. Low bandwidth → slower transfers.'], ['<b>Number of devices / users</b>', 'More devices share the same bandwidth and cause more data collisions → slower for everyone.'], ['<b>Transmission media</b>', 'Fibre is faster than copper; wireless is affected by distance, walls and interference.'], ['<b>Amount of traffic</b>', 'Streaming video or large downloads use lots of bandwidth.'], ['<b>Errors / interference</b>', 'Data that arrives corrupted has to be re-sent.']])}
${h3('The internet, DNS, hosting and the Cloud')}
${p('The <b>internet</b> is a <b>worldwide collection of computer networks</b> — a network of networks. The <b>World Wide Web</b> is the collection of web pages stored on <b>web servers</b> and accessed over the internet by <b>clients</b> (web browsers).')}
${WG('dns')}
${table(['Term', 'Meaning'], [['<b>DNS</b> (Domain Name Service)', 'Made up of many <b>Domain Name Servers</b>. Converts a domain name / URL (eg www.example.com) into the <b>IP address</b> of the server that hosts it.'], ['<b>Hosting</b>', 'Storing a website (or files/services) on a server that is permanently connected to the internet, so others can access it. Companies pay a hosting provider.'], ['<b>Web server</b>', 'A server that stores web pages and sends them to clients that request them.'], ['<b>The Cloud</b>', 'Remote servers, accessed over the internet, that provide <b>storage, software or processing</b> as a service (eg online file storage, web-based office apps).']])}
${two(`<h4>Advantages of the Cloud</h4>${ul(['Access files from any device, anywhere with an internet connection', 'Easy to share and collaborate', 'Storage can be increased easily; no need to buy your own hardware', 'The provider handles backups, security and maintenance'])}`, `<h4>Disadvantages of the Cloud</h4>${ul(['Needs an internet connection — no access when offline', 'You rely on the provider: if it fails or closes, you may lose access', 'Data is stored by a third party — security and privacy concerns', 'Ongoing subscription costs'])}`)}
${h3('Star and mesh topologies')}
${p('A <b>topology</b> is the way devices in a network are arranged and connected.')}
${WG('topology')}
${two(`<h4>Star</h4>${ul(['Every device has its <b>own cable to a central switch</b>', '✓ If one cable or device fails, only that device is affected', '✓ Fast and reliable: the switch sends data only to the right device, so few data collisions', '✓ Easy to add new devices', '✗ If the <b>central switch fails, the whole network goes down</b>', '✗ Lots of cable — can be expensive in big buildings'])}`, `<h4>Mesh</h4>${ul(['Devices are connected to each other, often with <b>many routes</b> (full mesh: every device to every other)', '✓ If one connection fails, data takes <b>another route</b> — no single point of failure', '✓ Can handle lots of traffic, as data can travel on many routes at once', '✗ A full mesh needs a lot of cable (wired), which is <b>expensive</b>', '✗ Harder to set up and maintain', 'Wireless mesh networks avoid the cabling cost'])}`)}
${exam('Describe two differences between a LAN and a WAN.', 2, 'A LAN covers a small geographical area (eg one site) whereas a WAN covers a large geographical area (1). The hardware in a LAN is usually owned by the organisation, whereas a WAN usually uses connections leased from telecommunications companies (1).')}
${exam('Explain one advantage of a star topology compared with a mesh topology.', 2, 'A star uses less cable than a full mesh (1) so it is cheaper / easier to install (1). OR: data is sent only to the destination device via the switch (1) so there are fewer collisions (1).')}` },

    { code: '1.3.2', name: 'Wired and wireless networks, protocols and layers', html: () => `
${h3('Wired vs wireless')}
${table(['', 'Wired (Ethernet)', 'Wireless (Wi-Fi, Bluetooth)'], [['Speed', 'Usually <b>faster</b> and more consistent', 'Usually slower; drops with distance and obstacles'], ['Reliability', 'Little interference', 'Affected by walls, other devices and distance'], ['Security', 'More secure — someone needs a physical connection', 'Signals can be intercepted, so <b>encryption</b> is essential'], ['Mobility', 'Devices stay at the end of a cable', 'Users can move around; no cables to trip over'], ['Cost/installation', 'Cables must be bought and installed', 'Easier to add devices; needs wireless access points']])}
${p('<b>Bluetooth</b> is a short-range wireless connection used for nearby devices (headphones, keyboards). <b>Wi-Fi</b> connects devices to a network over a longer range. You do not need to know how Ethernet, Wi-Fi or Bluetooth work internally.')}
${h3('Encryption')}
${p('<b>Encryption</b> scrambles data using a <b>key</b> so that if it is intercepted while it travels across a network, it cannot be understood. Only someone with the correct key can <b>decrypt</b> it back to the original. It is especially important on wireless networks, where anyone in range could pick up the signal.')}
${WG('cipher')}
${h3('IP and MAC addresses')}
${table(['', 'IP address', 'MAC address'], [['Purpose', 'Identifies a device on a network / the internet, so data can be <b>routed</b> to it', '<b>Uniquely</b> identifies the device’s network interface card; used to send data to the right device on a LAN (by switches)'], ['Assigned', 'Given to a device when it joins a network — it can change', 'Assigned by the manufacturer — it is permanent/fixed'], ['Format', '<b>IPv4</b>: 4 numbers from 0 to 255 separated by dots, eg <code>192.168.0.15</code> (32 bits). <b>IPv6</b>: 8 groups of 4 hexadecimal digits separated by colons, eg <code>2001:0db8:85a3:0000:0000:8a2e:0370:7334</code> (128 bits)', '6 pairs of <b>hexadecimal</b> digits (48 bits), separated by colons or hyphens, eg <code>4A:1F:09:C2:7E:30</code>']])}
${warn('An IPv4 number can only go up to 255 — <code>258.0.0.1</code> is not valid. IPv6 was introduced because the world was running out of IPv4 addresses (IPv6 has vastly more).', 'Common mistake')}
${h3('Standards and protocols')}
${p('A <b>standard</b> is an agreed set of rules for an area of computing (eg the size of a USB plug, how Wi-Fi works). Standards let <b>hardware and software from different manufacturers work together</b>.', 'A <b>protocol</b> is a set of <b>rules for how data is transferred</b> between devices — eg how it is formatted, addressed, sent and checked. Different protocols are used for different jobs.')}
${table(['Protocol', 'Full name', 'Purpose'], [
  ['<b>TCP/IP</b>', 'Transmission Control Protocol / Internet Protocol', 'TCP splits data into packets, numbers them, checks they all arrive and puts them back in order (asking for missing ones to be re-sent). IP addresses each packet and routes it across networks.'],
  ['<b>HTTP</b>', 'Hyper Text Transfer Protocol', 'Requesting and sending web pages between a web browser and a web server.'],
  ['<b>HTTPS</b>', 'Hyper Text Transfer Protocol Secure', 'As HTTP, but the data is <b>encrypted</b> — used for logins, payments and anything private.'],
  ['<b>FTP</b>', 'File Transfer Protocol', 'Transferring files between computers over a network (eg uploading a website to a host).'],
  ['<b>POP</b>', 'Post Office Protocol', '<b>Retrieves email</b> from a mail server and downloads it to one device, usually deleting it from the server.'],
  ['<b>IMAP</b>', 'Internet Message Access Protocol', '<b>Retrieves email</b> but keeps it on the server, so it stays in sync across several devices.'],
  ['<b>SMTP</b>', 'Simple Mail Transfer Protocol', '<b>Sends email</b> from a client to a mail server, and between mail servers.']])}
${tip('Email: <b>S</b>MTP <b>S</b>ends; POP and IMAP retrieve. IMAP keeps mail on the server (good for using a phone and a laptop).', 'Memory trick')}
${h3('Layers')}
${WG('layers')}
${key('Why use layers?', 'Each layer deals with one part of communication and only talks to the layers next to it. So: a complex problem is broken into manageable parts; each layer can be <b>changed or improved without affecting the others</b>; developers can focus on one layer; and different manufacturers’ hardware/software can work together because each layer follows standards. You do not need to name the layers.')}
${exam('Explain why a company might use HTTPS rather than HTTP on its website.', 2, 'HTTPS encrypts the data sent between the browser and the web server (1), so if personal/payment details are intercepted they cannot be understood (1).')}
${exam('Give one example of a valid IPv4 address and describe the format of a MAC address.', 3, 'IPv4: 192.168.1.20 (four numbers 0–255 separated by full stops) (1). A MAC address is 48 bits / 6 pairs of hexadecimal digits (1) separated by colons or hyphens, eg 0A:1B:2C:3D:4E:5F (1).')}` }
  ];

/* ---- 04_D.js ---- */
  /* ===== D · 1.4 Network security ===== */
  TITLE.D = 'Network security'; SUB.D = 'Paper 1 · forms of attack and how to prevent them';
  T.D = [
    { code: '1.4.1', name: 'Threats to computer systems and networks', html: () => `
${plain('Networks are attacked to <b>steal data</b> (to sell it or commit fraud), to <b>damage or disrupt</b> systems, to <b>demand money</b>, or simply to cause trouble. For every attack you need to know <b>how it works</b> and <b>what the attacker is trying to achieve</b>.')}
${table(['Attack', 'How it works', 'Purpose / effect'], [
  ['<b>Malware</b> (malicious software)', 'Software written to harm a computer, installed without the user knowing — often through email attachments, downloads or infected USB sticks. Types: <b>virus</b> (attaches to files and spreads when they are run), <b>worm</b> (copies itself across a network on its own), <b>trojan</b> (pretends to be useful software), <b>spyware</b> (secretly records activity such as key presses), <b>ransomware</b> (encrypts files and demands payment).', 'Delete or corrupt files, steal data (eg passwords), take control of the computer, lock files for ransom, slow the system down.'],
  ['<b>Social engineering</b>', 'Tricking <b>people</b> into giving away information or access — people are often the “weak point” in security. <b>Phishing</b>: fake emails/texts/websites that look genuine and ask the user to enter details or click a link. Others: phoning and pretending to be IT support (pretexting), shoulder surfing.', 'Obtain usernames, passwords, bank details; get the victim to install malware.'],
  ['<b>Brute-force attack</b>', 'Software tries <b>every possible combination</b> of passwords (or common words) until it finds the right one — trial and error.', 'Gain unauthorised access to an account.'],
  ['<b>Denial of service (DoS)</b>', 'Floods a server or network with so many requests that it cannot cope. A <b>DDoS</b> uses many computers at once.', 'Make a website or service <b>unavailable</b> to genuine users; lost business and reputation.'],
  ['<b>Data interception and theft</b>', 'Data travelling across a network is captured (eg with packet-sniffing software on an unsecured Wi-Fi network).', 'Read and steal private data such as passwords or card numbers.'],
  ['<b>SQL injection</b>', 'An attacker types <b>SQL code</b> into an input box on a website (eg a login form). If the input is not checked, the code becomes part of the database query and is run.', 'View, change or delete data in the database; bypass logins.']])}
${WG('sqli')}
${WG('brute')}
${exam('Describe how phishing is used to attack a network.', 2, 'An email/message is sent that pretends to be from a trusted organisation (1) asking the user to click a link and enter their personal details / password, which are then used by the attacker (1).')}` },

    { code: '1.4.2', name: 'Identifying and preventing vulnerabilities', html: () => `
${plain('No single method stops every attack, so organisations use <b>several layers of protection</b>. For each method, know <b>which threats it limits</b> and <b>how</b>.')}
${table(['Prevention method', 'How it works', 'Helps against'], [
  ['<b>Penetration testing</b>', 'The organisation pays (or uses its own) experts to <b>attack its own systems</b>, as a hacker would, to find weaknesses so they can be fixed before real attackers find them.', 'Finding vulnerabilities to any attack, eg SQL injection, weak passwords'],
  ['<b>Anti-malware software</b>', 'Scans files and programs and compares them with a database of known malware signatures (and watches for suspicious behaviour). It quarantines or deletes malware. Must be <b>updated</b> regularly.', 'Malware'],
  ['<b>Firewall</b>', 'Monitors data coming into and leaving a network and <b>blocks</b> anything that does not meet set rules (eg blocks certain ports or suspicious traffic).', 'Hackers, unauthorised access, some malware, some DoS traffic'],
  ['<b>User access levels</b>', 'Gives each user access only to the files and features they need for their job (eg read-only vs read/write).', 'Limits damage from insiders, accidental deletion, and stolen accounts'],
  ['<b>Passwords</b>', 'Strong passwords (long, mixed character types), changed when compromised; lock the account after several failed attempts; two-factor authentication.', 'Brute-force attacks, unauthorised access'],
  ['<b>Encryption</b>', 'Scrambles data with a key so it is meaningless if intercepted or stolen.', 'Data interception and theft'],
  ['<b>Physical security</b>', 'Locks, key cards, biometrics, CCTV, security guards, server rooms with no public access.', 'People stealing or tampering with hardware; shoulder surfing']])}
${tip('Prevent SQL injection with <b>input validation/sanitisation</b> (reject or clean characters such as quotes) and parameterised queries. Prevent social engineering with <b>staff training</b> — even the best firewall cannot stop someone handing over their password.', 'Matching attack → defence')}
${fig(S.tiles([['Malware', 'anti-malware, firewall, training', P.red], ['Phishing', 'staff training, spam filters', P.amber], ['Brute force', 'strong passwords, account lock-out', P.violet], ['DoS', 'firewall', P.blue], ['Interception', 'encryption', P.teal], ['SQL injection', 'validation, penetration testing', P.green]], { cols: 3, th: 64, label: 'Threats and defences' }), 'Common pairings that earn marks — but always explain HOW the method helps.')}
${exam('Explain how a firewall helps protect a network.', 2, 'A firewall monitors incoming and outgoing traffic (1) and blocks any traffic that does not meet the rules set for the network, so unauthorised access is prevented (1).')}
${exam('A company stores customers’ details. Describe two methods the company could use to reduce the risk of a brute-force attack.', 4, 'Require strong passwords (1) that are long and use a mix of letters, numbers and symbols, so there are too many combinations to try (1). Lock the account after a set number of failed attempts (1) so the attacker cannot keep trying combinations (1).')}` }
  ];

/* ---- 05_E.js ---- */
  /* ===== E · 1.5 Systems software ===== */
  TITLE.E = 'Systems software'; SUB.E = 'Paper 1 · what an operating system does, and utility software';
  T.E = [
    { code: '1.5.1', name: 'Operating systems', html: () => `
${plain('The <b>operating system (OS)</b> is the software that <b>manages the computer’s hardware and software</b> and lets you use it. Windows, macOS, Linux, Android and iOS are operating systems. Without one, every program would have to control the hardware itself.')}
${fig(S.layers([['User', 'you — clicking, typing, tapping', P.pink], ['Application software', 'browser, game, word processor', P.blue], ['Operating system', 'user interface · memory · peripherals · users · files', P.teal], ['Hardware', 'CPU, RAM, storage, keyboard, screen, printer', P.slate]], { label: 'Where the OS sits' }), 'The OS sits between the hardware and the applications/user.')}
${table(['Function', 'What the OS does'], [
  ['<b>User interface</b>', 'Lets the user interact with the computer. A <b>GUI</b> (graphical user interface) uses windows, icons, menus and a pointer — easy to learn. A <b>command-line interface</b> uses typed commands — faster for experts and uses fewer resources. Touch and voice interfaces are also used.'],
  ['<b>Memory management and multitasking</b>', 'Allocates parts of <b>RAM to each program</b> and keeps them separate so they do not overwrite each other; moves data between RAM and virtual memory when needed; frees memory when a program closes. <b>Multitasking</b>: lets several programs run “at the same time” by quickly switching the CPU between them and sharing out memory.'],
  ['<b>Peripheral management and drivers</b>', 'Manages data moving between the CPU and input/output devices (keyboard, printer…). A <b>device driver</b> is a small program that translates the OS’s instructions into commands the specific device understands — new hardware needs the right driver.'],
  ['<b>User management</b>', 'Creates and deletes <b>user accounts</b>, handles logins (usernames and passwords), sets <b>access rights</b> (what each user may see or change) and keeps users’ files separate and secure.'],
  ['<b>File management</b>', 'Organises files into <b>folders</b> (a hierarchy); lets users <b>name, rename, save, open, move, copy and delete</b> files; controls who can access each file.']])}
${tip('Paging and segmentation are <b>not</b> required. Do learn one clear example for each OS function, eg “installing a printer driver” = peripheral management; “creating a new account for a new employee” = user management.', 'What OCR asks for')}
${exam('Describe how an operating system manages memory.', 2, 'It allocates memory to each program/application that is running (1), keeps programs’ memory separate so they do not interfere, and frees it when a program closes / moves data to virtual memory when RAM is full (1).')}` },

    { code: '1.5.2', name: 'Utility software', html: () => `
${plain('<b>Utility software</b> performs <b>housekeeping</b> tasks that keep the computer running well and its data safe — jobs the operating system may not do on its own. Many utilities come with the OS.')}
${table(['Utility', 'Purpose and why it is needed'], [
  ['<b>Encryption software</b>', 'Scrambles files so they cannot be understood without the key — protects data if the device is lost or stolen, or the data is intercepted.'],
  ['<b>Defragmentation</b>', 'On a <b>magnetic hard disk</b>, files become split into pieces stored in different places (<b>fragmented</b>) as files are saved, edited and deleted. Defragmentation <b>moves the pieces of each file together</b> and groups the free space, so the read/write head moves less and files are <b>accessed faster</b>.'],
  ['<b>Data compression</b>', 'Reduces file sizes, so they take up less storage and are quicker to send (see 1.2.5).']])}
${WG('defrag')}
${warn('SSDs do <b>not</b> need defragmenting: they have no moving parts, so the position of the data does not affect speed — and the extra writing would shorten their life.', 'SSDs')}
${exam('Explain why defragmentation can improve the performance of a computer with a magnetic hard disk.', 2, 'The parts of each file are moved so they are stored together / next to each other (1), so the read/write head does not have to move around as much and files are loaded faster (1).')}` }
  ];

/* ---- 06_F.js ---- */
  /* ===== F · 1.6 Ethical, legal, cultural and environmental impacts ===== */
  TITLE.F = 'Ethical, legal, cultural and environmental impacts'; SUB.F = 'Paper 1 · impacts of digital technology, the laws you must know, software licences and the 8-mark question';
  T.F = [
    { code: '1.6.1', name: 'Impacts of digital technology', html: () => `
${plain('Digital technology changes how we live, work and communicate — mostly for the better, but not for everyone and not without costs. Paper 1 always has an <b>8-mark extended-response question</b> (marked *) asking you to <b>discuss</b> these impacts in a given scenario.')}
${table(['Issue', 'Ask yourself…', 'Examples'], [
  ['<b>Ethical</b>', 'Is it right or fair?', 'Job losses through automation; the <b>digital divide</b> (people without access to technology or skills are left behind); AI making decisions about people; monitoring employees; using personal data for profit'],
  ['<b>Legal</b>', 'Is it allowed by law?', 'Hacking (Computer Misuse Act); storing personal data properly (Data Protection Act); piracy and copying software or music (Copyright Act); licences'],
  ['<b>Cultural</b>', 'How does it change society, habits and communities?', 'Social media changing how we communicate; online shopping replacing high-street shops; streaming changing the music/film industries; online communities; cyberbullying'],
  ['<b>Environmental</b>', 'What is the effect on the planet?', 'Energy used by devices and data centres; <b>e-waste</b> — toxic materials in landfill, often shipped to poorer countries; mining rare metals for devices; positives: video calls reduce travel, smart heating saves energy, devices can be recycled'],
  ['<b>Privacy</b>', 'Who can see information about people?', 'CCTV and facial recognition; location tracking; cookies and targeted adverts; data breaches; what people share on social media']])}
${h3('The laws you must know')}
${table(['Law', 'What it does', 'Allows / prohibits'], [
  ['<b>Data Protection Act 2018</b>', 'Controls how organisations collect, store and use <b>personal data</b>.', 'Personal data must be: used fairly, lawfully and transparently · used only for specified, explicit purposes · adequate, relevant and limited to what is needed · accurate and kept up to date · kept no longer than necessary · kept secure. People have the right to see the data held about them (a subject access request) and to have it corrected or, in some cases, deleted.'],
  ['<b>Computer Misuse Act 1990</b>', 'Makes <b>hacking and malware</b> illegal.', 'Three main offences: (1) <b>unauthorised access</b> to computer material (eg guessing someone’s password to look at their files); (2) unauthorised access <b>with intent to commit or help commit further crimes</b> (eg to steal money); (3) <b>unauthorised acts that impair</b> the operation of a computer (eg spreading malware, deleting files, a DoS attack).'],
  ['<b>Copyright, Designs and Patents Act 1988</b>', 'Protects the creators of <b>original work</b> — software, music, films, books, images.', 'Illegal to copy, share, sell or modify someone else’s work <b>without permission</b> (eg pirating software, sharing music illegally). Creators automatically own copyright.'],
  ['<b>Software licences</b>', 'A licence states <b>how software may legally be used</b> — how many users/devices, whether it can be copied, modified or shared.', 'See open source vs proprietary below.']])}
${h3('Open source vs proprietary software')}
${two(`<h4>Open source</h4>${ul(['<b>Source code is available</b> to everyone', 'Users can <b>study, change/adapt and redistribute</b> it (within the licence)', 'Usually free', '✓ Can be customised to the user’s needs; bugs can be found and fixed by a large community', '✗ Support may be limited (forums rather than a help desk); may be less well tested or documented; the creator may earn little from it', 'Examples: Linux, LibreOffice, Firefox, Python'])}`, `<h4>Proprietary (closed source)</h4>${ul(['<b>No access to the source code</b>', 'Usually <b>paid for</b> (bought off the shelf or by subscription); users cannot change or share it', '✓ Usually well tested, with official support, updates and documentation', '✓ The developer controls the code and earns money from it', '✗ Costs money; cannot be adapted; you depend on the company for fixes', 'Examples: Microsoft Office, Adobe Photoshop, most console games'])}`)}
${h3('Answering the 8-mark question')}
${steps(['<b>Read the scenario and the bullet points</b> — the question lists the areas to cover (eg “ethical, legal, cultural, environmental issues”, or “features, benefits and drawbacks”). Cover <b>every</b> bullet.', '<b>Make points that apply to the scenario</b> — name the people/organisation involved. Generic points that could apply to anything keep you in the lower bands.', '<b>Develop each point</b>: say what the issue is, then <b>why it matters / its effect</b> (“…which means…”, “…so…”).', '<b>Give both sides</b> — benefits and drawbacks, for different groups of people.', '<b>Finish with a conclusion or recommendation</b> if the question asks for one, justified by your points.'])}
${table(['Band', 'Marks', 'What it looks like'], [['High', '6–8', 'Thorough knowledge of a wide range of issues, consistently applied to the context; weighs up both sides covering all the areas; well-developed, clearly structured line of reasoning.'], ['Mid', '3–5', 'Reasonable knowledge of a range of issues, not always applied to the context; discusses most areas; some structure.'], ['Low', '1–2', 'Basic knowledge, limited application; a list of points with little explanation or structure.']])}
${example('Plan for an 8-mark question', '<p><b>“A supermarket plans to replace all its checkout staff with self-service tills. Discuss the impact of this decision.”</b></p>' + ul(['<b>Ethical:</b> cashiers may lose their jobs → hardship for families; but new jobs in maintaining tills and helping customers. Older customers or people with disabilities may find the tills harder to use.', '<b>Cultural:</b> less human contact — some customers value chatting to staff; younger customers may prefer speed and independence.', '<b>Legal:</b> any customer data from loyalty cards used at the tills must follow the Data Protection Act.', '<b>Environmental:</b> new machines use energy and resources to make; old tills become e-waste unless recycled.', '<b>Conclusion:</b> faster service and lower costs for the supermarket, but it should keep some staffed tills and support affected staff.']))}
${tip('Aim for about 4–6 developed points across the areas with a short conclusion. Spend roughly 10–12 minutes. Quality of extended response is assessed, so write in clear paragraphs, not bullet points.', 'Timing')}
${exam('A company wants to use a program it found on the internet. Describe the difference between open source and proprietary software licences.', 2, 'Open source software lets users access and modify the source code (and is usually free) (1); proprietary software does not give access to the source code, so users cannot change it, and it is usually paid for (1).')}` }
  ];

/* ---- 07_G.js ---- */
  /* ===== G · 2.1 Algorithms ===== */
  TITLE.G = 'Algorithms'; SUB.G = 'Paper 2 · computational thinking, designing algorithms, flowcharts, trace tables, searching and sorting';
  const structure = () => S.org({ t: 'Quiz game', kids: [{ t: 'Set up', kids: [{ t: 'Load questions' }, { t: 'Score = 0' }] }, { t: 'Play a round', kids: [{ t: 'Ask question' }, { t: 'Check answer' }, { t: 'Update score' }] }, { t: 'End game', kids: [{ t: 'Show score' }, { t: 'Save high score' }] }] }, { label: 'A structure diagram' });
  T.G = [
    { code: '2.1.1', name: 'Computational thinking', html: () => `
${plain('<b>Computational thinking</b> is a way of thinking about a problem so that it can be solved — by a person or a computer. There are three principles to learn.')}
${table(['Principle', 'Meaning', 'Example'], [
  ['<b>Abstraction</b>', 'Removing (ignoring) unnecessary detail to focus on what matters for solving the problem.', 'A London Underground map ignores real distances and streets — it only shows stations, lines and connections, which is all a passenger needs. A game of football in a computer game ignores the weather unless it matters.'],
  ['<b>Decomposition</b>', 'Breaking a complex problem down into <b>smaller, more manageable sub-problems</b>, each of which can be solved (and tested) separately.', 'Making a quiz game: split it into “ask a question”, “check the answer”, “keep the score”, “show the results”. Different programmers can work on different parts.'],
  ['<b>Algorithmic thinking</b>', 'Working out the <b>steps</b> needed to solve a problem, in the right order — producing an algorithm that could be followed.', 'Writing the exact steps to calculate the average score: add every score, count them, divide the total by the count.']])}
${tip('For abstraction questions, say <b>what is removed</b> and <b>what is kept</b>, and why. For decomposition, name the <b>sub-problems</b>. Generic definitions alone usually earn only 1 mark — apply them to the scenario.', 'Exam tip')}
${exam('A program is being written to help a cinema sell tickets. Describe how decomposition could be used.', 2, 'The problem is broken down into smaller sub-problems (1), eg choosing a film, selecting seats, calculating the price and taking payment, which can each be written and tested separately (1).')}` },

    { code: '2.1.2', name: 'Designing, creating and refining algorithms', html: () => `
${plain('An <b>algorithm</b> is a <b>sequence of steps</b> that solves a problem. Before programming, we design the algorithm — then we can check it works, using a <b>trace table</b>.')}
${h3('Inputs, processes and outputs')}
${table(['Inputs', 'Processes', 'Outputs'], [['Data that goes <b>into</b> the program (from the user, a sensor or a file)', 'What the program <b>does</b> with the data (calculations, decisions, sorting…)', 'What comes <b>out</b> (on screen, printed, sent, saved)'], ['eg the price of each item, the discount code', 'add up the prices; check the code is valid; take off the discount', 'eg the total to pay; a message if the code is invalid']])}
${h3('Structure diagrams')}
${p('A <b>structure diagram</b> shows how a problem is decomposed: the main problem at the top, broken into sub-sections, which are broken down further. It shows the <b>structure</b> of a program, not the order of every step.')}
${fig(structure(), 'Each box is a sub-problem that could become its own sub program.')}
${h3('Three ways to write an algorithm')}
${p('<b>Pseudocode</b> is structured English that looks like code but does not follow a strict syntax. <b>Flowcharts</b> show the steps as shapes joined by arrows. <b>OCR Exam Reference Language</b> (or a real language like Python) is precise code. In Section B, when the question says so, you must use Exam Reference Language or a high-level language.')}
${table(['Symbol', 'Name', 'Used for'], [['⬭ rounded rectangle', 'Terminal', 'Start and End'], ['▱ parallelogram', 'Input / Output', 'INPUT name, OUTPUT total'], ['▭ rectangle', 'Process', 'a calculation or assignment, eg total = total + price'], ['◇ diamond', 'Decision', 'a question with two exits (Yes/No, True/False)'], ['▭ with double lines at the sides', 'Sub program', 'calling a procedure or function defined elsewhere'], ['→ line/arrow', 'Line', 'shows the direction of flow']])}
${WG('flow')}
${erl(['mark = int(input("Enter mark"))', 'if mark >= 50 then', '    print("Pass")', 'else', '    print("Fail")', 'endif'], ['mark = int(input("Enter mark"))', 'if mark >= 50:', '    print("Pass")', 'else:', '    print("Fail")'], 'The same algorithm as the flowchart above.')}
${h3('Common errors')}
${two(`<h4>Syntax error</h4>${ul(['Breaks the <b>grammar rules</b> of the language', 'Stops the program from running / being translated', 'eg <code>prnt("Hi")</code>, a missing bracket or quote, a misspelt keyword, <code>endiff</code>'])}`, `<h4>Logic error</h4>${ul(['The program runs but gives the <b>wrong / unexpected output</b>', 'eg using <code>&gt;</code> instead of <code>&gt;=</code>; adding the wrong variable (<code>total = num1 + num1</code>); a loop that runs one time too few'])}`)}
${h3('Trace tables')}
${p('A <b>trace table</b> records the value of each variable (and any output) as an algorithm runs, line by line. Use one to find logic errors, or to work out what an algorithm does. Each time a variable changes, write its new value in a new row.')}
${WG('trace', { p: 'sum' })}
${tip('Go one line at a time. Read <b>exactly</b> what the code says (eg <code>for i = 1 to 4</code> includes 4; <code>while x &gt; 5</code> stops when x is 5). Write outputs exactly, including spaces and quotation-free text.', 'Trace table tips')}
${exam('Identify the logic error in this code and correct it: total = num1 + num1 (it should add two numbers).', 2, 'The error is that num1 is added twice / num2 is not used (1). Correction: total = num1 + num2 (1).')}` },

    { code: '2.1.3', name: 'Searching and sorting algorithms', html: () => `
${plain('Searching finds an item in a list. Sorting puts a list in order. You need to know <b>how each algorithm works</b>, apply it to a given list step by step, know its <b>pre-requisites</b>, and recognise it from code. You do <b>not</b> need to memorise the code.')}
${h3('Linear search and binary search')}
${two(`<h4>Linear search</h4>${ol(['Start at the first item.', 'Compare it with the item you are looking for.', 'If it matches, stop — found.', 'If not, move to the next item and repeat.', 'If you reach the end, the item is not in the list.'])}<p>✓ Works on <b>unsorted</b> lists · simple · ✗ slow on large lists (may check every item)</p>`, `<h4>Binary search</h4>${ol(['The list must be <b>sorted</b>.', 'Find the <b>middle</b> item (if there are two middle items, either may be used — OCR accepts both).', 'If it is the target, stop.', 'If the target is smaller, discard the middle and the <b>right</b> half; if bigger, discard the middle and the <b>left</b> half.', 'Repeat with the remaining half until found or no items are left.'])}<p>✓ Much faster on large lists (halves the list each time) · ✗ the list <b>must be sorted first</b></p>`)}
${WG('search')}
${erl(['found = false', 'for i = 0 to items.length - 1', '    if items[i] == target then', '        found = true', '    endif', 'next i'], ['found = False', 'for i in range(len(items)):', '    if items[i] == target:', '        found = True'], 'A linear search: it looks at every item in turn.')}
${erl(['low = 0', 'high = items.length - 1', 'found = false', 'while found == false AND low <= high', '    mid = (low + high) DIV 2', '    if items[mid] == target then', '        found = true', '    elseif items[mid] < target then', '        low = mid + 1', '    else', '        high = mid - 1', '    endif', 'endwhile'], ['low = 0', 'high = len(items) - 1', 'found = False', 'while not found and low <= high:', '    mid = (low + high) // 2', '    if items[mid] == target:', '        found = True', '    elif items[mid] < target:', '        low = mid + 1', '    else:', '        high = mid - 1'], 'A binary search: recognise it by low, high and mid.')}
${h3('Bubble sort, insertion sort and merge sort')}
${table(['Algorithm', 'How it works', 'Pros / cons'], [
  ['<b>Bubble sort</b>', 'Compare the first two items; swap them if they are in the wrong order. Move along one place and repeat, to the end of the list (one <b>pass</b>). Repeat passes until a pass makes <b>no swaps</b>.', '✓ Simple; sorts in place (little extra memory) · ✗ very slow on large lists'],
  ['<b>Insertion sort</b>', 'Treat the first item as a sorted list. Take the next item and <b>insert it into the correct position</b> in the sorted part, shifting bigger items along. Repeat until every item has been inserted.', '✓ Simple; quick for small or nearly-sorted lists; little memory · ✗ slow on large lists'],
  ['<b>Merge sort</b>', '<b>Divide</b>: split the list in half repeatedly until every list has one item. <b>Conquer</b>: merge pairs of lists back together in order (compare the first items of each list and take the smaller each time), until one sorted list remains.', '✓ Much faster on large lists; consistent speed · ✗ more complex; uses more memory (creates new lists)']])}
${WG('sort')}
${example('Bubble sort — first pass of 5, 1, 4, 2, 8', '<p>Compare 5 and 1 → swap → 1, 5, 4, 2, 8. Compare 5 and 4 → swap → 1, 4, 5, 2, 8. Compare 5 and 2 → swap → 1, 4, 2, 5, 8. Compare 5 and 8 → no swap. End of pass 1: 1, 4, 2, 5, 8 (8 is in its final place). Pass 2 swaps 4 and 2 → 1, 2, 4, 5, 8. Pass 3 makes no swaps, so the list is sorted.</p>')}
${tip('Show <b>every</b> step in a merge sort answer: the splits, then each level of merging. For bubble sort, show the list after each swap or each pass as the question asks. Marks are lost for jumping straight to the sorted list.', 'Show your working')}
${exam('State one pre-requisite for a binary search.', 1, 'The data must be sorted / in order.')}
${exam('Describe how a merge sort would put a list into order.', 3, 'The list is split in half repeatedly until each list contains one item (1). Pairs of lists are merged by comparing the first item of each list and placing the smaller one first (1). This is repeated until there is a single sorted list (1).')}` }
  ];

/* ---- 08_H.js ---- */
  /* ===== H · 2.2 Programming fundamentals ===== */
  TITLE.H = 'Programming fundamentals'; SUB.H = 'Paper 2 · variables, operators, the three constructs, data types, strings, files, arrays, records, SQL, sub programs and random numbers';
  T.H = [
    { code: '2.2.1', name: 'Variables, constants, operators, inputs and outputs', html: () => `
${plain('A program stores data in <b>variables</b> — named locations in memory. Think of a labelled box: the label is the <b>identifier</b> (name) and the box holds a value that can change while the program runs. A <b>constant</b> is a box whose value is set once and <b>cannot change</b> while the program runs.')}
${erl(['// variables', 'name = "Louise"', 'score = 0', 'score = score + 10', '', '// a constant', 'const vat = 0.2', '', '// input and output', 'age = int(input("Enter your age"))', 'print("Hello " + name)'], ['# variables', 'name = "Louise"', 'score = 0', 'score = score + 10', '', '# Python has no true constants: use CAPITALS by convention', 'VAT = 0.2', '', '# input and output', 'age = int(input("Enter your age"))', 'print("Hello " + name)'])}
${table(['Term', 'Meaning'], [['<b>Assignment</b>', 'Giving a variable a value with <code>=</code>. The identifier goes on the <b>left</b>: <code>total = total + price</code> means “work out total + price, then store it in total”.'], ['<b>Why use a constant?</b>', 'The value cannot be changed by mistake while the program runs; if it ever needs to change (eg a new VAT rate), you change it in <b>one place</b> and it updates everywhere; it makes code easier to read.'], ['<b>Input</b>', 'Getting data into the program, eg from the keyboard: <code>input("prompt")</code>.'], ['<b>Output</b>', 'Showing data, eg on screen: <code>print(…)</code>.']])}
${h3('Operators')}
${table(['Operator', 'Meaning', 'OCR', 'Python', 'Example'], [
  ['Addition / subtraction', '', '+ -', '+ -', '7 + 3 = 10'], ['Multiplication', '', '*', '*', '7 * 3 = 21'], ['Division', 'ordinary division', '/', '/', '7 / 2 = 3.5'],
  ['<b>MOD</b> (modulo)', 'the <b>remainder</b> after whole-number division', 'MOD', '%', '17 MOD 5 = 2'], ['<b>DIV</b> (quotient)', 'whole-number division — how many times it goes in', 'DIV', '//', '17 DIV 5 = 3'], ['Exponentiation', 'to the power of', '^', '**', '2 ^ 3 = 8']])}
${table(['Comparison', 'Meaning', '', 'Boolean', 'Meaning'], [['==', 'equal to', '', '<b>AND</b>', 'true only if <b>both</b> conditions are true'], ['!=', 'not equal to', '', '<b>OR</b>', 'true if <b>at least one</b> condition is true'], ['&lt; &nbsp; &lt;=', 'less than · less than or equal to', '', '<b>NOT</b>', 'reverses true/false'], ['&gt; &nbsp; &gt;=', 'greater than · greater than or equal to', '', '', '']])}
${tip('<code>MOD 2</code> tells you if a number is even (remainder 0) or odd (remainder 1). Write each comparison in full: <code>if x &gt; 0 AND x &lt; 10</code> — <b>not</b> <code>if x &gt; 0 AND &lt; 10</code>. Remember <code>&lt; 9</code> does not include 9 but <code>&lt;= 9</code> does.', 'Exam tip')}
${h3('The three programming constructs')}
${cards([['Sequence', 'instructions run one after another, in order', P.blue], ['Selection', 'a decision chooses which code runs: if / elseif / else, switch/case', P.amber], ['Iteration', 'code is repeated: count-controlled (for) or condition-controlled (while, do…until)', P.green]], 3)}
${h4('Selection')}
${erl(['if answer == "Yes" then', '    print("Correct")', 'elseif answer == "No" then', '    print("Wrong")', 'else', '    print("Error")', 'endif', '', 'switch day:', '    case "Sat":', '        print("Saturday")', '    case "Sun":', '        print("Sunday")', '    default:', '        print("Weekday")', 'endswitch'], ['if answer == "Yes":', '    print("Correct")', 'elif answer == "No":', '    print("Wrong")', 'else:', '    print("Error")', '', '# a switch written with if/elif', 'if day == "Sat":', '    print("Saturday")', 'elif day == "Sun":', '    print("Sunday")', 'else:', '    print("Weekday")'])}
${h4('Iteration')}
${erl(['// count-controlled: runs a set number of times', 'for i = 1 to 5', '    print(i)', 'next i', '', 'for i = 10 to 0 step -2', '    print(i)', 'next i', '', '// condition-controlled: checks at the start', 'while answer != "Correct"', '    answer = input("New answer")', 'endwhile', '', '// condition-controlled: checks at the end (runs at least once)', 'do', '    answer = input("New answer")', 'until answer == "Correct"'], ['# count-controlled: range stops BEFORE the end value', 'for i in range(1, 6):', '    print(i)', '', 'for i in range(10, -1, -2):', '    print(i)', '', '# condition-controlled', 'answer = ""', 'while answer != "Correct":', '    answer = input("New answer")', '', '# Python has no do…until; this is the usual equivalent', 'while True:', '    answer = input("New answer")', '    if answer == "Correct":', '        break'])}
${warn('In OCR Exam Reference Language <code>for i = 1 to 5</code> <b>includes</b> 5. In Python, <code>range(1, 5)</code> stops at 4 — use <code>range(1, 6)</code>. A <b>while</b> loop may run zero times (it checks first); a <b>do…until</b> loop always runs at least once (it checks at the end).', 'Off-by-one errors')}
${p('<b>Nesting</b> means putting one construct inside another — an if inside a loop, a loop inside a loop. Indentation shows which code belongs inside which block.')}
${pyLab('', 'Practise sequence, selection and iteration in the Python Lab')}
${exam('Explain the difference between a count-controlled loop and a condition-controlled loop.', 2, 'A count-controlled loop repeats a set number of times (eg for i = 1 to 10) (1); a condition-controlled loop repeats until/while a condition is met, so the number of repeats is not known in advance (eg while answer != "yes") (1).')}` },

    { code: '2.2.2', name: 'Data types and casting', html: () => `
${table(['Data type', 'Stores', 'Examples', 'Python'], [['<b>Integer</b>', 'whole numbers (positive, negative or zero)', '42, -7, 0', 'int'], ['<b>Real</b> (float)', 'numbers with a decimal part', '3.14, -0.5, 12.0', 'float'], ['<b>Boolean</b>', 'one of two values', 'True / False', 'bool'], ['<b>Character</b>', 'a single letter, digit or symbol', '"A", "7", "?"', '(a string of length 1)'], ['<b>String</b>', 'a sequence of characters (text)', '"Hello", "07700 900123", "SW1A 1AA"', 'str']])}
${tip('Choose the type from what the data <b>is and how it is used</b>. A phone number or postcode is a <b>string</b> — you never do maths on it and it may start with 0 or contain spaces/letters. A price is <b>real</b>. A number of tickets is an <b>integer</b>. A yes/no answer such as “isMember” is <b>Boolean</b>.', 'Choosing a data type')}
${h3('Casting')}
${p('<b>Casting</b> temporarily changes the data type of a value — eg <code>input()</code> always gives a <b>string</b>, so to do maths with it you cast it to an integer or real. To join a number onto a string, cast it to a string.')}
${erl(['age = int(input("Age?"))', 'price = float("4.52")', 'message = "You are " + str(age)', 'print(message)'], ['age = int(input("Age?"))', 'price = float("4.52")', 'message = "You are " + str(age)', 'print(message)'], 'OCR also allows real(…) and bool(…).')}
${warn('Without casting, <code>"5" + "3"</code> gives <code>"53"</code> (string concatenation), not 8 — a classic logic error in exam code.', 'Common mistake')}
${exam('A program stores a student’s name, age, height in metres and whether they have paid. State the most suitable data type for each.', 4, 'Name: string (1). Age: integer (1). Height: real (1). Paid: Boolean (1).')}` },

    { code: '2.2.3', name: 'String manipulation and file handling', html: () => `
${h3('String manipulation')}
${p('A string is a sequence of characters. Each character has a position (<b>index</b>) starting at <b>0</b>. In <code>"ComputerScience"</code>, C is at position 0, o at 1, m at 2, p at 3…')}
${WG('strings')}
${table(['Operation', 'OCR Exam Reference Language', 'Python', 'Result for subject = "ComputerScience"'], [['Length', 'subject.length', 'len(subject)', '15'], ['Upper / lower case', 'subject.upper / subject.lower', 'subject.upper() / subject.lower()', '"COMPUTERSCIENCE"'], ['First n characters', 'subject.left(4)', 'subject[:4]', '"Comp"'], ['Last n characters', 'subject.right(3)', 'subject[-3:]', '"nce"'], ['Substring (slice)', 'subject.substring(3, 5) — start at 3, take 5', 'subject[3:8]', '"puter"'], ['Concatenation', 'subject + "!"', 'subject + "!"', '"ComputerScience!"'], ['Character → code', 'ASC("A")', 'ord("A")', '65'], ['Code → character', 'CHR(97)', 'chr(97)', '"a"']])}
${erl(['name = input("Name?")', 'initial = name.left(1)', 'print(initial.upper + " has " + str(name.length) + " letters")'], ['name = input("Name?")', 'initial = name[:1]', 'print(initial.upper() + " has " + str(len(name)) + " letters")'])}
${h3('File handling')}
${p('Data in variables is lost when the program ends. To keep it, a program writes it to a <b>file</b> on secondary storage, and reads it back later. Four basic operations: <b>open</b>, <b>read</b> or <b>write</b>, and <b>close</b> (closing saves the changes and frees the file for other programs).')}
${erl(['// read every line of a file', 'myFile = open("scores.txt")', 'while NOT myFile.endOfFile()', '    print(myFile.readLine())', 'endwhile', 'myFile.close()', '', '// create a file and write to it', 'newFile("log.txt")', 'logFile = open("log.txt")', 'logFile.writeLine("Game over")', 'logFile.close()'], ['# read every line of a file', 'myFile = open("scores.txt", "r")', 'for line in myFile:', '    print(line.strip())', 'myFile.close()', '', '# create a file and write to it', 'logFile = open("log.txt", "w")   # "a" adds to the end', 'logFile.write("Game over\\n")', 'logFile.close()'])}
${pyLab('', 'Practise strings and files in the Python Lab')}
${exam('Write code to output the first three characters of a string stored in the variable town.', 1, 'print(town.left(3)) — or in Python print(town[:3]) — or print(town.substring(0, 3)).')}` },

    { code: '2.2.3b', name: 'Arrays, records and SQL', html: () => `
${h3('Arrays')}
${plain('An <b>array</b> stores <b>many values of the same type under one identifier</b>. Each value (element) is found by its <b>index</b>, starting at 0. Instead of 30 variables score1, score2… you have one array <code>scores</code> and use a loop to process it. In the exam, arrays are <b>static</b>: a fixed length set when they are declared.')}
${erl(['array colours[5]', 'colours[0] = "Blue"', '', 'array names = ["Ali", "Eve", "Ling"]', 'for i = 0 to 2', '    print(names[i])', 'next i'], ['colours = [""] * 5', 'colours[0] = "Blue"', '', 'names = ["Ali", "Eve", "Ling"]', 'for i in range(3):', '    print(names[i])'], 'Python lists behave like arrays (they can also grow).')}
${h3('2D arrays')}
${p('A <b>two-dimensional array</b> is like a table (grid) with rows and columns — useful for game boards or a table of data. Each element needs <b>two indexes</b>. The exam question always tells you whether it is [row, column] or [column, row] — follow it.')}
${WG('array2d')}
${erl(['array board[3,3]', 'board[0,2] = "X"', 'print(board[0,2])'], ['board = [["", "", ""], ["", "", ""], ["", "", ""]]', 'board[0][2] = "X"', 'print(board[0][2])'])}
${h3('Records')}
${p('A <b>record</b> is a data structure that groups together related items of data — <b>fields</b> — which can be <b>different data types</b>. One record describes one thing, eg one student. A 2D array can be used like a database table: each row is a record and each column a field.')}
${table(['Field', 'StudentID', 'Name', 'Year', 'Paid'], [['Data type', 'string', 'string', 'integer', 'Boolean'], ['One record', '"S01"', '"Amir"', '10', 'True']])}
${code(['# a record in Python, using a dictionary', 'student = {"StudentID": "S01", "Name": "Amir", "Year": 10, "Paid": True}', 'print(student["Name"])'], 'Python has no built-in “record” type; a dictionary (or a class) does the same job.')}
${h3('SQL')}
${p('<b>SQL</b> (Structured Query Language) is used to <b>search a database</b>. You need three keywords: <code>SELECT</code> (which <b>fields</b> to show — <code>*</code> means all fields), <code>FROM</code> (which <b>table</b>) and <code>WHERE</code> (the <b>condition</b> records must meet). Text values go in quotation marks; numbers do not. Conditions can be joined with AND / OR.')}
${WG('sql')}
${tip('Write the field and table names <b>exactly</b> as given in the question. Check: have you selected the right fields? Is the condition the right way round (&gt; vs &lt;)? Are text values in quotes?', 'SQL marks')}
${exam('Write an SQL statement to display the Name and Score of every student in the table Students who is in Year 11.', 3, 'SELECT Name, Score (1) FROM Students (1) WHERE Year = 11 (1)')}` },

    { code: '2.2.3c', name: 'Sub programs and random numbers', html: () => `
${plain('A <b>sub program</b> is a named block of code that does one job and can be <b>called</b> (used) from anywhere in the program as many times as needed. There are two kinds: a <b>procedure</b> does a task; a <b>function</b> does a task and <b>returns a value</b> back to where it was called.')}
${erl(['procedure greet(name)', '    print("Hello " + name)', 'endprocedure', '', 'function squared(number)', '    result = number ^ 2', '    return result', 'endfunction', '', 'greet("Noni")', 'area = squared(4)', 'print(area)'], ['def greet(name):', '    print("Hello " + name)', '', 'def squared(number):', '    result = number ** 2', '    return result', '', 'greet("Noni")', 'area = squared(4)', 'print(area)'], 'greet is a procedure (no return). squared is a function: squared(4) returns 16.')}
${table(['Term', 'Meaning'], [['<b>Parameter</b>', 'A variable listed in the sub program’s definition that receives a value when it is called (eg <code>number</code>). The value passed in is the <b>argument</b>.'], ['<b>Return value</b>', 'The value a function sends back with <code>return</code>. It must be stored or used: <code>area = squared(4)</code>.'], ['<b>Local variable</b>', 'Declared <b>inside</b> a sub program; it only exists while the sub program runs and cannot be used outside it. Good practice: no clashes with other variables, memory freed afterwards.'], ['<b>Global variable</b>', 'Declared in the main program (in OCR language with the keyword <code>global</code>); it can be used anywhere. Use sparingly — any part of the program could change it by mistake.']])}
${two(`<h4>Why use sub programs?</h4>${ul(['Code is written <b>once</b> and reused — the program is shorter', 'Easier to read, test and debug: each sub program can be tested on its own', 'Easier to maintain: fix or update it in one place', 'Large programs can be split up and written by different programmers (decomposition)', 'Sub programs can be put in a library and reused in other programs'])}`, `<h4>Arrays and sub programs</h4>${ul(['An array can be <b>passed in</b> as a parameter', 'A function can <b>return</b> an array', 'eg <code>function average(scores)</code> takes an array of scores and returns the mean'])}`)}
${h3('Random numbers')}
${erl(['roll = random(1, 6)', 'chance = random(0.0, 1.0)'], ['import random', 'roll = random.randint(1, 6)   # 1 to 6 inclusive', 'chance = random.uniform(0.0, 1.0)'], 'Used for games, simulations, choosing a random question, creating test data.')}
${WG('dice')}
${pyLab('', 'Practise functions, procedures and random numbers in the Python Lab')}
${exam('Write a function called triple that takes a number as a parameter and returns the number multiplied by 3.', 3, 'function triple(n) (1) … return n * 3 (1) … endfunction / correct structure (1). Python: def triple(n): return n * 3')}` }
  ];

/* ---- 09_I.js ---- */
  /* ===== I · 2.3 Producing robust programs ===== */
  TITLE.I = 'Producing robust programs'; SUB.I = 'Paper 2 · defensive design, validation, authentication, maintainability and testing';
  T.I = [
    { code: '2.3.1', name: 'Defensive design', html: () => `
${plain('A <b>robust</b> program keeps working correctly whatever the user does — even when they make mistakes or try to break it. <b>Defensive design</b> means planning for that from the start.')}
${table(['Consideration', 'What it means'], [['<b>Anticipating misuse</b>', 'Thinking ahead about how users might enter unexpected data or misuse the program (eg typing letters into a number box, dividing by zero, trying to access someone else’s account) and making sure the program copes.'], ['<b>Authentication</b>', 'Checking that a user is who they say they are before letting them in — eg a <b>username and password</b>, a PIN, two-factor authentication, biometrics.'], ['<b>Input validation</b>', 'Checking that input data is <b>sensible and allowed</b> before it is used; invalid data is rejected and the user asked again.']])}
${h3('Types of validation check')}
${table(['Check', 'What it checks', 'Example'], [['<b>Range check</b>', 'the value is within allowed limits', 'age between 11 and 18'], ['<b>Type check</b>', 'the data is the right data type', 'tickets must be an integer'], ['<b>Presence check</b>', 'something has been entered', 'the name box is not empty'], ['<b>Length check</b>', 'the number of characters is allowed', 'a password is at least 8 characters'], ['<b>Format check</b>', 'the data matches a pattern', 'a postcode like LL99 9LL; an email contains @'], ['<b>Lookup check</b>', 'the value is in a list of allowed values', 'size is "S", "M" or "L"']])}
${erl(['age = int(input("Enter age 11-18"))', 'while age < 11 OR age > 18', '    print("Invalid - try again")', '    age = int(input("Enter age 11-18"))', 'endwhile', '', 'username = input("Username")', 'password = input("Password")', 'if username == "admin" AND password == "Gr8Day!" then', '    print("Access granted")', 'else', '    print("Access denied")', 'endif'], ['age = int(input("Enter age 11-18"))', 'while age < 11 or age > 18:', '    print("Invalid - try again")', '    age = int(input("Enter age 11-18"))', '', 'username = input("Username")', 'password = input("Password")', 'if username == "admin" and password == "Gr8Day!":', '    print("Access granted")', 'else:', '    print("Access denied")'], 'Validation loop (range check) and a simple authentication check. Real systems never store passwords in the code.')}
${warn('Validation checks data is <b>sensible</b>, not that it is <b>correct</b>: an age of 14 passes a range check even if the person is really 15.', 'Validation vs correctness')}
${h3('Maintainability')}
${p('Programs are updated for years, often by other programmers. <b>Maintainable</b> code is easy to read, understand and change.')}
${table(['Technique', 'Why it helps'], [['<b>Sub programs</b>', 'Code is split into named, reusable blocks that can be tested and updated separately.'], ['<b>Naming conventions</b>', 'Meaningful identifiers (<code>totalPrice</code>, not <code>x</code>) and a consistent style (eg camelCase) make the purpose of each variable clear.'], ['<b>Indentation</b>', 'Shows which code is inside each loop, selection or sub program, so the structure is easy to follow.'], ['<b>Commenting</b>', 'Explains what sections of code do and why — <code>// this function squares a number</code>. Comments are ignored when the program runs.']])}
${exam('Describe two ways the maintainability of a program can be improved.', 4, 'Use comments (1) to explain what each part of the code does so other programmers can understand it (1). Use meaningful variable names (1) so the purpose of each variable is clear (1). (Also: indentation, sub programs.)')}` },

    { code: '2.3.2', name: 'Testing', html: () => `
${plain('<b>Testing</b> shows that a program works as it should and finds errors before users do. It checks the program meets the requirements, handles invalid data without crashing, and produces the right results.')}
${two(`<h4>Iterative testing</h4>${ul(['Testing <b>during development</b>', 'Each module/section is tested as it is written, then fixed and retested (repeated cycles)', 'Errors are found early, while the code is fresh'])}`, `<h4>Final / terminal testing</h4>${ul(['Testing the <b>whole program at the end</b> of development', 'Checks all the parts work together and the program meets all the requirements', 'Often done with real users or realistic data'])}`)}
${h3('Test data')}
${table(['Type', 'Meaning', 'For “tickets: whole number 1–10”'], [['<b>Normal</b>', 'Sensible, typical data that <b>should be accepted</b>', '5'], ['<b>Boundary</b>', 'Data of the correct type on the <b>very edge</b> of the valid range (it should be accepted). Testing just outside the edge too is good practice.', '1 and 10 (also 0 and 11 just outside)'], ['<b>Invalid</b>', 'Data of the <b>correct data type</b> that <b>should be rejected</b>', '15, -3'], ['<b>Erroneous</b>', 'Data of the <b>wrong data type</b> that <b>should be rejected</b>', '"four", 2.5, (blank)']])}
${WG('testdata')}
${h3('Test plans')}
${table(['Test no.', 'Test data', 'Type of test', 'Expected result', 'Actual result'], [['1', '5', 'Normal', 'Accepted', '(filled in when tested)'], ['2', '10', 'Boundary', 'Accepted', ''], ['3', '11', 'Invalid', 'Rejected with an error message', ''], ['4', '"four"', 'Erroneous', 'Rejected with an error message', '']])}
${p('If the actual result differs from the expected result, the code is <b>refined</b> (corrected) and the test is repeated.')}
${h3('Syntax and logic errors (again)')}
${p('<b>Syntax errors</b> break the rules of the language and stop the program being translated/run — the translator reports them. <b>Logic errors</b> let the program run but produce unexpected output — you find them by testing and tracing.')}
${exam('A program accepts marks from 0 to 100 inclusive. Give one example of each: normal, boundary and erroneous test data.', 3, 'Normal: eg 56 (1). Boundary: 0 or 100 (1). Erroneous: eg "fifty" / 12.5 (wrong data type) (1).')}` }
  ];

/* ---- 10_J.js ---- */
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

/* ---- 11_K.js ---- */
  /* ===== K · 2.5 Programming languages and IDEs ===== */
  TITLE.K = 'Programming languages and IDEs'; SUB.K = 'Paper 2 · high- and low-level languages, translators (compilers and interpreters) and IDE tools';
  T.K = [
    { code: '2.5.1', name: 'Languages and translators', html: () => `
${plain('A CPU can only run <b>machine code</b> — binary instructions. People write programs in languages that are easier to understand, and a <b>translator</b> converts them into machine code.')}
${two(`<h4>High-level languages</h4>${ul(['Eg Python, Java, C#, OCR Exam Reference Language', 'Use English-like keywords and maths notation — <b>easy to read, write and debug</b>', 'One statement may become many machine-code instructions', '<b>Portable</b>: the same code can run on different types of CPU (after translation)', 'Must be <b>translated</b> before the CPU can run it', 'Programmers do not need to know how the hardware works'])}`, `<h4>Low-level languages</h4>${ul(['<b>Machine code</b> (binary) and <b>assembly language</b> (short mnemonics such as LDA, ADD)', 'Close to the hardware: give <b>direct control</b> of the CPU, memory and registers', 'Can be <b>faster and use less memory</b> — useful for embedded systems and device drivers', 'Hard to read, write and debug', 'Written for one type of CPU — not portable', 'Machine code needs no translation (assembly needs an assembler — not required for OCR)'])}`)}
${h3('Compiler and interpreter')}
${WG('translate')}
${table(['', 'Compiler', 'Interpreter'], [['How it translates', 'Translates the <b>whole program at once</b> into machine code, producing an <b>executable file</b>', 'Translates and runs the program <b>one line (statement) at a time</b>'], ['Errors', 'Reports all errors at the end of compiling; no executable is produced until they are fixed', 'Stops at the <b>first error</b>, showing the line — easier to find and fix bugs'], ['Running the program', 'The executable runs <b>quickly</b> and can be run again <b>without re-translating</b>', 'Runs more slowly — it is translated <b>every time</b> it runs'], ['Distributing', 'Users get the executable: they <b>don’t need the translator</b> and <b>can’t see the source code</b>', 'Users need the interpreter, and the source code is shared'], ['Best for', 'Finished software to sell/distribute', 'Development, testing and debugging; learning']])}
${exam('Give two benefits of using a compiler rather than an interpreter.', 2, 'The compiled program (executable) runs faster / does not need to be translated again each time (1). The executable can be distributed without the source code, so it cannot be copied/edited, and users do not need a translator (1).')}` },

    { code: '2.5.2', name: 'The Integrated Development Environment (IDE)', html: () => `
${plain('An <b>IDE</b> is a single program that gives programmers all the tools they need to <b>write, run, test and debug</b> code. IDLE, Thonny, Visual Studio Code and PyCharm are examples. The RA10 Python Lab is a simple one in your browser.')}
${table(['Tool', 'How it helps the programmer'], [
  ['<b>Editor</b>', 'Where code is written. Features: <b>syntax highlighting</b> (keywords in colour, so typos stand out), <b>line numbers</b>, <b>auto-indentation</b>, <b>auto-complete</b> (suggests keywords/identifiers, fewer typing mistakes), bracket matching.'],
  ['<b>Error diagnostics</b>', 'Identify errors and where they are: <b>error messages</b> with line numbers, highlighting of syntax errors as you type, and debugging tools — <b>breakpoints</b> (pause the program at a chosen line), <b>stepping</b> through one line at a time, and <b>watching</b> the values of variables (like a live trace table).'],
  ['<b>Run-time environment</b>', 'Lets the program be <b>run and tested inside the IDE</b>, showing its output in a console window — and catching run-time errors (eg division by zero) without crashing the computer.'],
  ['<b>Translator</b>', 'A built-in <b>compiler or interpreter</b> converts the code to machine code so it can run.']])}
${tip('For “how does an IDE help?” questions, name the tool <b>and</b> say how it helps: “syntax highlighting <b>shows keywords in different colours</b>, so misspelt keywords are easier to spot.”', 'Exam tip')}
${pyLab('', 'Open the GCSE Python Lab — a browser IDE with auto-marked tasks')}
${exam('Describe two tools in an IDE that help a programmer find and fix errors.', 4, 'Error diagnostics / error messages (1) show the line number and type of error so it can be found quickly (1). Breakpoints (1) stop the program at a set line so the values of variables can be checked (1). (Also: stepping, variable watch, syntax highlighting.)')}` }
  ];

/* ---- 98_widgets.js ---- */
  /* ===== Interactive diagrams =====
     Guide topics write W('name', {options}) placeholders; each is mounted here once the guide is on the page.
     Every widget is plain HTML/SVG (no libraries), follows light/dark mode through the app's CSS variables and
     works with touch. Numbers shown are calculated live from what the student enters — nothing is made up. */
  const WCSS = `
.csw{--w-a:var(--accent,#0f766e);--w-ok:#16a34a;--w-bad:#dc2626;--w-warn:#d97706;--w-b:#2563eb;--w-v:#7c3aed;margin:16px 0 18px;padding:14px;border:1px solid var(--line,#e2e8f0);border-radius:16px;background:var(--surface-soft,#f8fafc);color:var(--ink,#0f172a);font-size:.92rem;line-height:1.5;overflow:hidden}
.csw *{box-sizing:border-box}
.csw-h{display:flex;align-items:center;gap:8px;margin:0 0 10px;font-weight:800;font-size:.95rem}
.csw-h i{white-space:nowrap;flex:none;font-style:normal;font-size:.68rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#fff;background:var(--w-a);padding:3px 8px;border-radius:999px}
.csw-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:8px 0}
.csw button,.csw select,.csw input{font:inherit;color:inherit}
.csw button{border:1px solid var(--line-2,#cbd5e1);background:var(--surface,#fff);border-radius:10px;padding:6px 12px;cursor:pointer;font-weight:700;font-size:.85rem;min-height:36px}
.csw button:hover{border-color:var(--w-a)}
.csw button.pri{background:var(--w-a);border-color:var(--w-a);color:#fff}
.csw button:disabled{opacity:.45;cursor:default}
.csw input[type=text],.csw input[type=number],.csw select{border:1px solid var(--line-2,#cbd5e1);background:var(--surface,#fff);border-radius:10px;padding:6px 10px;min-height:36px;max-width:100%}
.csw input[type=range]{accent-color:var(--w-a);width:180px;max-width:100%}
.csw-out{margin-top:8px;padding:10px 12px;border-radius:12px;background:var(--surface,#fff);border:1px solid var(--line,#e2e8f0)}
.csw-note{font-size:.8rem;color:var(--muted,#64748b);margin-top:6px}
.csw-mono,.csw code{font-family:var(--mono,ui-monospace,Consolas,monospace)}
.csw table{border-collapse:collapse;width:100%;font-size:.85rem}
.csw th,.csw td{border:1px solid var(--line,#e2e8f0);padding:5px 7px;text-align:center}
.csw th{background:var(--surface,#fff);font-weight:800}
.csw tr.on td{background:color-mix(in srgb,var(--w-a) 18%,transparent);font-weight:800}
.csw-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
.csw svg{display:block;max-width:100%;height:auto}
.csw svg text{fill:currentColor;font-family:inherit}
.csw-bits{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:6px}
.csw-bit{display:flex;flex-direction:column;align-items:center;gap:3px}
.csw-bit small{font-size:.7rem;color:var(--muted,#64748b);font-weight:700}
.csw-bit button{width:100%;min-height:44px;font-size:1.15rem;font-family:var(--mono,monospace);padding:4px 0}
.csw-bit button.one{background:var(--w-a);color:#fff;border-color:var(--w-a)}
.csw-big{font-size:1.25rem;font-weight:800}
.csw-chip{display:inline-block;padding:2px 9px;border-radius:999px;font-weight:800;font-size:.78rem;background:color-mix(in srgb,var(--w-a) 15%,transparent);color:var(--w-a)}
.csw-chip.bad{background:color-mix(in srgb,var(--w-bad) 15%,transparent);color:var(--w-bad)}
.csw-chip.ok{background:color-mix(in srgb,var(--w-ok) 15%,transparent);color:var(--w-ok)}
.csw-chip.warn{background:color-mix(in srgb,var(--w-warn) 18%,transparent);color:var(--w-warn)}
.csw-reg{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px}
.csw-reg div{padding:8px;border-radius:12px;border:2px solid var(--line,#e2e8f0);background:var(--surface,#fff);text-align:center;transition:border-color .25s,background .25s}
.csw-reg div b{display:block;font-size:.72rem;letter-spacing:.04em;color:var(--muted,#64748b)}
.csw-reg div span{font-family:var(--mono,monospace);font-weight:800;font-size:1rem}
.csw-reg div.hot{border-color:var(--w-a);background:color-mix(in srgb,var(--w-a) 14%,var(--surface,#fff))}
.csw-mem{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-top:8px}
.csw-mem div{border:1px solid var(--line,#e2e8f0);border-radius:10px;padding:5px;background:var(--surface,#fff);font-family:var(--mono,monospace);font-size:.8rem;text-align:center}
.csw-mem div small{display:block;color:var(--muted,#64748b);font-size:.68rem}
.csw-mem div.hot{border-color:var(--w-a);box-shadow:0 0 0 2px color-mix(in srgb,var(--w-a) 35%,transparent)}
.csw-stage{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}
.csw-stage span{padding:3px 10px;border-radius:999px;font-weight:800;font-size:.78rem;border:1px solid var(--line-2,#cbd5e1)}
.csw-stage span.on{background:var(--w-a);color:#fff;border-color:var(--w-a)}
.csw-arr{display:flex;flex-wrap:wrap;gap:5px}
.csw-arr div{min-width:40px;padding:8px 4px;border-radius:10px;text-align:center;font-weight:800;font-family:var(--mono,monospace);border:2px solid var(--line,#e2e8f0);background:var(--surface,#fff);position:relative;transition:all .2s}
.csw-arr div small{position:absolute;top:-15px;left:0;right:0;font-size:.62rem;color:var(--muted,#64748b);font-weight:700}
.csw-arr div.cmp{border-color:var(--w-warn);background:color-mix(in srgb,var(--w-warn) 18%,var(--surface,#fff))}
.csw-arr div.hit{border-color:var(--w-ok);background:color-mix(in srgb,var(--w-ok) 22%,var(--surface,#fff))}
.csw-arr div.out{opacity:.3}
.csw-arr div.done{border-color:var(--w-b);background:color-mix(in srgb,var(--w-b) 12%,var(--surface,#fff))}
.csw-arr div.sw{border-color:var(--w-v);background:color-mix(in srgb,var(--w-v) 18%,var(--surface,#fff))}
.csw-arrs{display:flex;flex-direction:column;gap:20px;margin-top:16px}
.csw-msg{min-height:3em}
.csw-grid{display:grid;gap:2px;touch-action:none;user-select:none;max-width:320px}
.csw-grid div{aspect-ratio:1;border-radius:2px;cursor:pointer;border:1px solid rgba(127,127,127,.25)}
.csw-pal{display:flex;flex-wrap:wrap;gap:5px}
.csw-pal button{width:34px;height:34px;min-height:34px;border-radius:8px;padding:0;border:2px solid var(--line-2,#cbd5e1)}
.csw-pal button.on{outline:3px solid var(--w-a);outline-offset:1px}
.csw-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px}.csw-two>div{min-width:0}.csw label{max-width:100%}.csw select{width:auto;max-width:100%;text-overflow:ellipsis}
@media (max-width:560px){.csw-two{grid-template-columns:minmax(0,1fr)}.csw select{width:100%}.csw{padding:12px}.csw-bit button{min-height:40px;font-size:1rem}}
.csw-code{font-family:var(--mono,monospace);font-size:.82rem;background:var(--surface,#fff);border:1px solid var(--line,#e2e8f0);border-radius:12px;padding:8px 0;overflow-x:auto}
.csw-code div{padding:1px 10px;white-space:pre}
.csw-code div.on{background:color-mix(in srgb,var(--w-a) 20%,transparent);font-weight:800}
.csw-code div b{color:var(--muted,#64748b);font-weight:600;margin-right:8px}
.csw-wire{stroke-width:3;fill:none;transition:stroke .2s}
.csw-on{stroke:var(--w-ok)} .csw-off{stroke:var(--muted,#94a3b8)}
.csw-gate{fill:var(--surface,#fff);stroke:currentColor;stroke-width:2.2}
`;
  const W = window.__CSW_W = window.__CSW_W || {};
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (s, n, c) => String(s).padStart(n, c || '0');
  const bin8 = (n) => pad((n >>> 0).toString(2), 8).slice(-8);
  const hex2 = (n) => pad(n.toString(16).toUpperCase(), 2);
  const fmt = (n) => Number(n).toLocaleString('en-GB', { maximumFractionDigits: 2 });
  const q = (root, s) => root.querySelector(s);
  const qa = (root, s) => Array.from(root.querySelectorAll(s));
  function head(t, kind) { return `<div class="csw-h"><i>${kind || 'Try it'}</i>${t}</div>`; }
  function sizeText(bits) {
    const B = bits / 8;
    const parts = [fmt(bits) + ' bits', fmt(B) + ' bytes'];
    if (B >= 1000) parts.push(fmt(B / 1000) + ' KB');
    if (B >= 1e6) parts.push(fmt(B / 1e6) + ' MB');
    if (B >= 1e9) parts.push(fmt(B / 1e9) + ' GB');
    return parts.join(' = ');
  }

  /* ---------- 1.1 fetch–execute cycle ---------- */
  W.fde = function (root) {
    const PROG = { 0: 'LOAD 5', 1: 'ADD 6', 2: 'STORE 7', 3: 'HALT', 4: '—', 5: '12', 6: '30', 7: '0' };
    const S = [];
    let st = { PC: 0, MAR: '–', MDR: '–', ACC: 0, CU: '–', mem: Object.assign({}, PROG), stage: '', hot: [], memHot: null, msg: 'The program is stored in RAM (von Neumann: instructions and data share the same memory). Press <b>Step</b> to start the cycle.' };
    const push = (o) => { st = Object.assign({}, st, o, { mem: Object.assign({}, st.mem, o.mem || {}) }); S.push(st); };
    S.push(st);
    const instr = [['LOAD', 5], ['ADD', 6], ['STORE', 7], ['HALT']];
    let acc = 0;
    instr.forEach((ins, pc) => {
      push({ stage: 'Fetch', hot: ['PC', 'MAR'], memHot: null, MAR: pc, msg: `<b>Fetch:</b> the address in the <b>Program Counter</b> (${pc}) is copied into the <b>MAR</b> — the MAR always holds an <i>address</i>.` });
      push({ stage: 'Fetch', hot: ['PC'], PC: pc + 1, msg: `<b>Fetch:</b> the <b>Program Counter</b> is incremented to ${pc + 1}, so it points to the <i>next</i> instruction.` });
      push({ stage: 'Fetch', hot: ['MDR'], memHot: pc, MDR: PROG[pc], msg: `<b>Fetch:</b> the instruction stored at address ${pc} (<code>${PROG[pc]}</code>) is copied from RAM into the <b>MDR</b> — the MDR holds the <i>data or instruction</i> just fetched or about to be written.` });
      push({ stage: 'Decode', hot: ['CU'], memHot: null, CU: PROG[pc], msg: `<b>Decode:</b> the <b>Control Unit</b> decodes <code>${PROG[pc]}</code> to work out what to do and sends control signals to the other components.` });
      if (ins[0] === 'LOAD') {
        push({ stage: 'Execute', hot: ['MAR'], MAR: ins[1], msg: `<b>Execute:</b> LOAD needs the data at address ${ins[1]}, so ${ins[1]} goes into the MAR.` });
        push({ stage: 'Execute', hot: ['MDR'], memHot: ins[1], MDR: PROG[ins[1]], msg: `<b>Execute:</b> the value ${PROG[ins[1]]} is read from address ${ins[1]} into the MDR.` });
        acc = Number(PROG[ins[1]]);
        push({ stage: 'Execute', hot: ['ACC'], memHot: null, ACC: acc, msg: `<b>Execute:</b> the value is copied into the <b>Accumulator</b>, which holds the results of calculations. ACC = ${acc}.` });
      } else if (ins[0] === 'ADD') {
        push({ stage: 'Execute', hot: ['MAR'], MAR: ins[1], msg: `<b>Execute:</b> ADD needs the data at address ${ins[1]} — the address goes into the MAR.` });
        push({ stage: 'Execute', hot: ['MDR'], memHot: ins[1], MDR: PROG[ins[1]], msg: `<b>Execute:</b> ${PROG[ins[1]]} is read into the MDR.` });
        const old = acc; acc += Number(PROG[ins[1]]);
        push({ stage: 'Execute', hot: ['ALU', 'ACC'], memHot: null, ACC: acc, msg: `<b>Execute:</b> the <b>ALU</b> (Arithmetic Logic Unit) adds the Accumulator and the MDR: ${old} + ${PROG[ins[1]]} = ${acc}. The result is stored in the Accumulator.` });
      } else if (ins[0] === 'STORE') {
        push({ stage: 'Execute', hot: ['MAR'], MAR: ins[1], msg: `<b>Execute:</b> STORE writes to address ${ins[1]}, so ${ins[1]} goes into the MAR.` });
        push({ stage: 'Execute', hot: ['MDR'], MDR: acc, msg: `<b>Execute:</b> the value in the Accumulator (${acc}) is copied into the MDR, ready to be written.` });
        push({ stage: 'Execute', hot: [], memHot: ins[1], mem: { [ins[1]]: String(acc) }, msg: `<b>Execute:</b> the MDR's value is written into RAM at address ${ins[1]}. Memory now holds the answer ${acc}.` });
      } else {
        push({ stage: 'Execute', hot: ['CU'], memHot: null, msg: '<b>Execute:</b> HALT — the program has finished. In a real CPU the cycle repeats billions of times a second (the clock speed).' });
      }
    });
    let i = 0, timer = null;
    root.innerHTML = head('The fetch–decode–execute cycle, one step at a time', 'Interactive') + `
      <div class="csw-stage"><span data-s="Fetch">Fetch</span><span data-s="Decode">Decode</span><span data-s="Execute">Execute</span></div>
      <div class="csw-reg">${['PC', 'MAR', 'MDR', 'ACC', 'CU', 'ALU'].map(r => `<div data-r="${r}"><b>${{ PC: 'PROGRAM COUNTER', MAR: 'MAR · address', MDR: 'MDR · data', ACC: 'ACCUMULATOR', CU: 'CONTROL UNIT', ALU: 'ALU' }[r]}</b><span></span></div>`).join('')}</div>
      <div class="csw-note">RAM (address : contents)</div><div class="csw-mem"></div>
      <div class="csw-out csw-msg"></div>
      <div class="csw-row"><button data-a="back">◀ Back</button><button class="pri" data-a="step">Step ▶</button><button data-a="play">Auto play</button><button data-a="reset">Reset</button><span class="csw-note" data-n></span></div>`;
    function draw() {
      const s = S[i];
      qa(root, '[data-s]').forEach(e => e.classList.toggle('on', e.dataset.s === s.stage));
      qa(root, '[data-r]').forEach(e => {
        const r = e.dataset.r;
        q(e, 'span').textContent = r === 'ALU' ? (s.hot.includes('ALU') ? '+ adding' : 'idle') : String(s[r]);
        e.classList.toggle('hot', s.hot.includes(r));
      });
      q(root, '.csw-mem').innerHTML = Object.keys(s.mem).map(a => `<div class="${String(s.memHot) === a ? 'hot' : ''}"><small>address ${a}</small>${esc(s.mem[a])}</div>`).join('');
      q(root, '.csw-msg').innerHTML = s.msg;
      q(root, '[data-n]').textContent = 'Step ' + i + ' of ' + (S.length - 1);
      q(root, '[data-a=back]').disabled = i === 0; q(root, '[data-a=step]').disabled = i === S.length - 1;
    }
    root.addEventListener('click', (e) => {
      const a = e.target.closest('[data-a]'); if (!a) return;
      const k = a.dataset.a;
      if (k === 'step' && i < S.length - 1) i++;
      if (k === 'back' && i > 0) i--;
      if (k === 'reset') { i = 0; clearInterval(timer); timer = null; q(root, '[data-a=play]').textContent = 'Auto play'; }
      if (k === 'play') {
        if (timer) { clearInterval(timer); timer = null; a.textContent = 'Auto play'; }
        else { a.textContent = 'Pause'; timer = setInterval(() => { if (i >= S.length - 1 || !root.isConnected) { clearInterval(timer); timer = null; a.textContent = 'Auto play'; return; } i++; draw(); }, 1700); }
      }
      draw();
    });
    draw();
  };

  /* ---------- 1.1 CPU performance ---------- */
  W.perf = function (root) {
    root.innerHTML = head('What makes one CPU faster than another?', 'Interactive') + `
      <div class="csw-two"><div>
        <label>Clock speed: <b data-v="clk"></b> GHz<br><input type="range" min="1" max="5" step="0.1" value="2" data-i="clk"></label><br>
        <label>Number of cores: <b data-v="core"></b><br><input type="range" min="0" max="3" step="1" value="1" data-i="core"></label><br>
        <label>Cache size: <b data-v="cache"></b> MB<br><input type="range" min="0" max="4" step="1" value="1" data-i="cache"></label>
      </div><div>
        <label>Kind of program<br><select data-i="kind"><option value="multi">Can be split into parallel tasks (eg video rendering)</option><option value="single">Must run one step after another (eg a simple game loop)</option></select></label>
        <div class="csw-out"><div>Clock cycles per second: <b data-o="hz"></b></div><div>Cores that are actually used: <b data-o="used"></b></div><div>Relative speed (1 core, 1 GHz, 2 MB = 1×): <span class="csw-big" data-o="rel"></span></div><svg viewBox="0 0 300 18" data-o="bar"></svg></div>
      </div></div>
      <div class="csw-out" data-o="why"></div>
      <div class="csw-note">A simplified teaching model: real performance also depends on the program, memory speed and heat. It is here to show the direction of each effect, not exact figures.</div>`;
    const CORES = [1, 2, 4, 8], CACHE = [1, 2, 4, 8, 16];
    function draw() {
      const clk = Number(q(root, '[data-i=clk]').value), cores = CORES[q(root, '[data-i=core]').value], cache = CACHE[q(root, '[data-i=cache]').value], kind = q(root, '[data-i=kind]').value;
      q(root, '[data-v=clk]').textContent = clk.toFixed(1); q(root, '[data-v=core]').textContent = cores; q(root, '[data-v=cache]').textContent = cache;
      const used = kind === 'multi' ? cores : 1;
      // cache: fewer slow trips to RAM — diminishing returns (log scale)
      const cacheF = 1 + 0.12 * Math.log2(cache / 2);
      const rel = clk * used * cacheF / (1 * 1 * 1);
      q(root, '[data-o=hz]').textContent = fmt(clk * 1e9) + ' (' + clk.toFixed(1) + ' billion)';
      q(root, '[data-o=used]').textContent = used + (kind === 'single' && cores > 1 ? ' (the other ' + (cores - 1) + ' sit idle)' : '');
      q(root, '[data-o=rel]').textContent = rel.toFixed(1) + '×';
      q(root, '[data-o=bar]').innerHTML = `<rect x="0" y="3" width="300" height="12" rx="6" fill="currentColor" opacity=".12"/><rect x="0" y="3" width="${Math.min(300, rel / 48 * 300)}" height="12" rx="6" fill="var(--w-a)"/>`;
      const why = [];
      why.push(`<b>Clock speed ${clk.toFixed(1)} GHz</b> = ${clk.toFixed(1)} billion cycles per second, so more instructions can be fetched, decoded and executed each second.`);
      why.push(kind === 'multi' ? `<b>${cores} core${cores > 1 ? 's' : ''}</b>: each core is a separate processing unit, so ${cores} instructions/tasks can be processed at the same time.` : `<b>${cores} core${cores > 1 ? 's' : ''}</b>: this program cannot be split into parallel tasks, so extra cores do <b>not</b> make it faster — a common exam point.`);
      why.push(`<b>Cache ${cache} MB</b>: cache is very fast memory inside the CPU that holds frequently used data and instructions. A bigger cache means fewer slower trips to RAM — but the benefit gets smaller each time you double it.`);
      q(root, '[data-o=why]').innerHTML = '<ul style="margin:0;padding-left:18px">' + why.map(x => '<li>' + x + '</li>').join('') + '</ul>';
    }
    root.addEventListener('input', draw); draw();
  };

  /* ---------- 1.2 virtual memory ---------- */
  W.vm = function (root) {
    const APPS = [['Browser', 3, '#2563eb'], ['Game', 4, '#dc2626'], ['Music', 2, '#16a34a'], ['Essay', 2, '#d97706'], ['Photo editor', 3, '#7c3aed']];
    const CAP = 8;
    let ram = [], vm = [], swaps = 0, used = [];
    root.innerHTML = head('Virtual memory: what happens when RAM is full?', 'Interactive') + `
      <p style="margin:0 0 6px">RAM here has <b>${CAP} blocks</b>. Click programs to open or switch to them.</p>
      <div class="csw-row" data-apps></div>
      <div class="csw-two"><div><b>RAM</b> (fast, ${CAP} blocks)<div class="csw-mem" data-ram></div></div><div><b>Virtual memory</b> (a part of secondary storage — slow)<div class="csw-mem" data-vm></div></div></div>
      <div class="csw-out csw-msg" data-m>Open some programs.</div><div class="csw-row"><button data-reset>Close everything</button><span class="csw-note" data-s></span></div>`;
    q(root, '[data-apps]').innerHTML = APPS.map(a => `<button data-app="${a[0]}" style="border-color:${a[2]}">${a[0]} <small>(${a[1]} blocks)</small></button>`).join('');
    const size = (n) => APPS.find(a => a[0] === n)[1];
    const free = () => CAP - ram.reduce((s, n) => s + size(n), 0);
    function draw(msg) {
      const cell = (n) => { const a = APPS.find(x => x[0] === n); return Array.from({ length: a[1] }, () => `<div style="background:${a[2]};color:#fff;border-color:${a[2]}">${esc(n)}</div>`).join(''); };
      q(root, '[data-ram]').innerHTML = ram.map(cell).join('') + Array.from({ length: free() }, () => '<div><small>free</small>–</div>').join('');
      q(root, '[data-vm]').innerHTML = vm.map(cell).join('') || '<div style="grid-column:1/-1"><small>empty</small></div>';
      if (msg) q(root, '[data-m]').innerHTML = msg;
      q(root, '[data-s]').innerHTML = 'Swaps between RAM and disk: <b>' + swaps + '</b>' + (swaps >= 4 ? ' <span class="csw-chip bad">lots of swapping = the computer slows down (disk thrashing)</span>' : '');
    }
    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-reset]')) { ram = []; vm = []; swaps = 0; used = []; draw('Everything closed.'); return; }
      const b = e.target.closest('[data-app]'); if (!b) return;
      const n = b.dataset.app;
      used = used.filter(x => x !== n).concat(n);
      if (ram.includes(n)) { draw(`<b>${esc(n)}</b> is already in RAM — switching to it is instant.`); return; }
      const fromVm = vm.includes(n);
      vm = vm.filter(x => x !== n);
      const moved = [];
      while (free() < size(n)) {
        const lru = used.find(x => ram.includes(x) && x !== n) || ram[0];
        ram = ram.filter(x => x !== lru); vm.push(lru); moved.push(lru); swaps++;
      }
      ram.push(n); if (fromVm) swaps++;
      draw(moved.length
        ? `RAM was full, so the operating system moved <b>${moved.map(esc).join(', ')}</b> (the least recently used) out to <b>virtual memory</b> on secondary storage to make room for <b>${esc(n)}</b>.${fromVm ? ' ' + esc(n) + ' itself had to be copied back from virtual memory first — that is slow.' : ''}`
        : (fromVm ? `${esc(n)} was copied back from virtual memory into RAM.` : `${esc(n)} was loaded into RAM — there was enough free space.`));
    });
    draw();
  };

  /* ---------- 1.2 units ---------- */
  W.units = function (root) {
    const U = ['bit', 'nibble', 'byte', 'KB', 'MB', 'GB', 'TB', 'PB'];
    root.innerHTML = head('Units of data: convert anything', 'Interactive') + `
      <div class="csw-row"><input type="number" value="2" min="0" step="any" data-n style="width:120px"><select data-u>${U.map(u => `<option${u === 'GB' ? ' selected' : ''}>${u}</option>`).join('')}</select>
      <label><input type="checkbox" data-k> use 1,024 instead of 1,000</label></div>
      <div class="csw-scroll"><table data-t></table></div>
      <div class="csw-note">OCR accepts either 1,000 or 1,024 in calculations — say which you used. 1 nibble = 4 bits, 1 byte = 8 bits.</div>`;
    function draw() {
      const k = q(root, '[data-k]').checked ? 1024 : 1000;
      const bitsIn = { bit: 1, nibble: 4, byte: 8 };
      ['KB', 'MB', 'GB', 'TB', 'PB'].forEach((u, i) => { bitsIn[u] = 8 * Math.pow(k, i + 1); });
      const n = Number(q(root, '[data-n]').value) || 0, u = q(root, '[data-u]').value;
      const bits = n * bitsIn[u];
      q(root, '[data-t]').innerHTML = '<tr><th>Unit</th><th>Value</th><th>How</th></tr>' + U.map((x, i) => `<tr class="${x === u ? 'on' : ''}"><td>${x}</td><td>${fmt(bits / bitsIn[x])}</td><td class="csw-note">${i === 0 ? '—' : i === 1 ? '4 bits' : i === 2 ? '8 bits' : '× ' + fmt(k) + ' ' + U[i - 1]}</td></tr>`).join('');
    }
    root.addEventListener('input', draw); draw();
  };

  /* ---------- 1.2 binary / hex ---------- */
  W.binary = function (root, o) {
    let v = o && o.v != null ? o.v : 0;
    const PV = [128, 64, 32, 16, 8, 4, 2, 1];
    root.innerHTML = head('Binary, denary and hexadecimal — click the bits', 'Interactive') + `
      <div class="csw-bits">${PV.map((p, i) => `<div class="csw-bit"><small>${p}</small><button data-b="${i}">0</button><small>${i === 0 ? 'MSB' : i === 7 ? 'LSB' : ''}</small></div>`).join('')}</div>
      <div class="csw-row"><label>Denary <input type="number" min="0" max="255" data-d style="width:90px"></label><label>Hex <input type="text" maxlength="2" data-h style="width:70px;text-transform:uppercase"></label><button data-z>Clear</button><button data-f>All 1s</button></div>
      <div class="csw-out" data-o></div>`;
    function draw(from) {
      const b = bin8(v);
      qa(root, '[data-b]').forEach((e, i) => { e.textContent = b[i]; e.classList.toggle('one', b[i] === '1'); });
      if (from !== 'd') q(root, '[data-d]').value = v;
      if (from !== 'h') q(root, '[data-h]').value = hex2(v);
      const on = PV.filter((p, i) => b[i] === '1');
      const hi = b.slice(0, 4), lo = b.slice(4);
      q(root, '[data-o]').innerHTML = `<div><b>Binary → denary:</b> add the place values with a 1 under them: ${on.length ? on.join(' + ') + ' = ' : ''}<span class="csw-big">${v}</span></div>
        <div style="margin-top:6px"><b>Binary → hex:</b> split into two nibbles: <code>${hi}</code> = ${parseInt(hi, 2)} = <b>${hex2(parseInt(hi, 2))[1]}</b> and <code>${lo}</code> = ${parseInt(lo, 2)} = <b>${hex2(parseInt(lo, 2))[1]}</b> → <span class="csw-big">${hex2(v)}</span></div>
        <div style="margin-top:6px"><b>Hex → denary:</b> ${parseInt(hi, 2)} × 16 + ${parseInt(lo, 2)} = ${v}</div>`;
    }
    root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-b]');
      if (b) { v ^= PV[Number(b.dataset.b)]; draw(); }
      if (e.target.closest('[data-z]')) { v = 0; draw(); }
      if (e.target.closest('[data-f]')) { v = 255; draw(); }
    });
    root.addEventListener('input', (e) => {
      if (e.target.matches('[data-d]')) { const n = Math.round(Number(e.target.value)); if (n >= 0 && n <= 255) { v = n; draw('d'); } }
      if (e.target.matches('[data-h]')) { const s = e.target.value.trim(); if (/^[0-9a-f]{1,2}$/i.test(s)) { v = parseInt(s, 16); draw('h'); } }
    });
    draw();
  };

  /* ---------- 1.2 binary addition ---------- */
  W.binadd = function (root, o) {
    let a = (o && o.a) || 107, b = (o && o.b) || 15, col = -1;
    root.innerHTML = head('Binary addition, column by column', 'Interactive') + `
      <div class="csw-row"><label>First number <input type="number" min="0" max="255" value="${a}" data-x style="width:80px"></label><label>Second number <input type="number" min="0" max="255" value="${b}" data-y style="width:80px"></label>
      <button class="pri" data-s>Next column ▶</button><button data-all>Show all</button><button data-r>Restart</button></div>
      <div class="csw-scroll"><table class="csw-mono" data-t></table></div><div class="csw-out csw-msg" data-m></div>`;
    function draw() {
      const A = bin8(a), B = bin8(b);
      const carry = Array(9).fill(''), sum = Array(9).fill('');
      let c = 0, msg = 'Start at the <b>right-hand column</b> (the least significant bit), like ordinary addition.';
      for (let k = 7; k >= 7 - col && k >= 0; k--) {
        const t = Number(A[k]) + Number(B[k]) + c;
        sum[k + 1] = String(t % 2); const nc = t >= 2 ? 1 : 0;
        msg = `Column ${8 - k}: ${A[k]} + ${B[k]}${c ? ' + carry 1' : ''} = ${t} → write <b>${t % 2}</b>${nc ? ', carry <b>1</b>' : ''}. ${['0 + 0 = 0', '1 + 0 = 1', '1 + 1 = 10 (0, carry 1)', '1 + 1 + 1 = 11 (1, carry 1)'][t]}`;
        c = nc; if (k > 0) carry[k] = c ? '1' : ''; else if (c) carry[0] = '1';
      }
      if (col >= 7) {
        const total = a + b;
        if (total > 255) { sum[0] = '1'; msg += `<br><span class="csw-chip bad">Overflow</span> The answer ${total} needs a 9th bit, but the register only holds 8. The 1 that is carried out is lost, so the stored result is ${total - 256} — wrong. This is an <b>overflow error</b>.`; }
        else msg += `<br><span class="csw-chip ok">Done</span> ${a} + ${b} = ${total} = <code>${bin8(total)}</code>. Check: convert both back to denary.`;
      }
      const row = (lab, arr, cls) => `<tr${cls ? ` class="${cls}"` : ''}><th>${lab}</th>${arr.map((x, i) => `<td style="${i === 0 ? 'color:var(--w-bad)' : ''}${i - 1 === 7 - col ? ';background:color-mix(in srgb,var(--w-a) 16%,transparent)' : ''}">${x}</td>`).join('')}</tr>`;
      q(root, '[data-t]').innerHTML = row('carry', carry) + row('', [''].concat(A.split(''))) + row('+', [''].concat(B.split(''))) + row('=', sum);
      q(root, '[data-m]').innerHTML = msg;
      q(root, '[data-s]').disabled = col >= 7;
    }
    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-s]') && col < 7) col++;
      if (e.target.closest('[data-all]')) col = 7;
      if (e.target.closest('[data-r]')) col = -1;
      draw();
    });
    root.addEventListener('input', (e) => {
      const n = Math.round(Number(e.target.value)); if (!(n >= 0 && n <= 255)) return;
      if (e.target.matches('[data-x]')) a = n; if (e.target.matches('[data-y]')) b = n; col = -1; draw();
    });
    draw();
  };

  /* ---------- 1.2 binary shifts ---------- */
  W.shift = function (root) {
    let v = 15, last = '';
    root.innerHTML = head('Binary shifts', 'Interactive') + `
      <div class="csw-row"><label>Start number <input type="number" min="0" max="255" value="15" data-v style="width:80px"></label><button data-l>◀ Shift left 1</button><button data-r>Shift right 1 ▶</button><button data-x>Reset</button></div>
      <div class="csw-bits" data-bits></div><div class="csw-out csw-msg" data-m></div>`;
    let start = 15;
    function draw() {
      const b = bin8(v);
      q(root, '[data-bits]').innerHTML = b.split('').map((x, i) => `<div class="csw-bit"><small>${128 >> i}</small><button class="${x === '1' ? 'one' : ''}" tabindex="-1">${x}</button></div>`).join('');
      q(root, '[data-m]').innerHTML = `Now <code>${b}</code> = <b>${v}</b>. ${last}`;
    }
    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-l]')) { const lost = v & 128; const nv = (v << 1) & 255; last = `A <b>left shift</b> moves every bit one place left and puts a 0 on the right: the value doubles (× 2)${lost ? ' — <span class="csw-chip bad">but a 1 fell off the left end, so the answer is wrong (overflow)</span>' : ''}.`; v = nv; }
      if (e.target.closest('[data-r]')) { const lost = v & 1; last = `A <b>right shift</b> moves every bit one place right and puts a 0 on the left: the value halves (÷ 2)${lost ? ' — <span class="csw-chip warn">a 1 fell off the right end, so the remainder is lost (it rounds down)</span>' : ''}.`; v = v >> 1; }
      if (e.target.closest('[data-x]')) { v = start; last = ''; }
      draw();
    });
    root.addEventListener('input', (e) => { const n = Math.round(Number(e.target.value)); if (n >= 0 && n <= 255) { start = v = n; last = ''; draw(); } });
    draw();
  };

  /* ---------- 1.2 characters ---------- */
  W.ascii = function (root) {
    root.innerHTML = head('Characters as binary (ASCII)', 'Interactive') + `
      <div class="csw-row"><input type="text" value="Hi A!" maxlength="16" data-s style="width:220px"></div>
      <div class="csw-scroll"><table data-t></table></div><div class="csw-out" data-o></div>`;
    function draw() {
      const s = q(root, '[data-s]').value;
      const rows = Array.from(s).map(ch => {
        const c = ch.codePointAt(0);
        return c < 128 ? `<tr><td>${ch === ' ' ? '(space)' : esc(ch)}</td><td>${c}</td><td class="csw-mono">${bin8(c)}</td></tr>` : `<tr><td>${esc(ch)}</td><td>${c}</td><td class="csw-chip warn">not in ASCII — needs Unicode</td></tr>`;
      });
      q(root, '[data-t]').innerHTML = '<tr><th>Character</th><th>Denary code</th><th>8-bit binary</th></tr>' + rows.join('');
      const n = Array.from(s).length;
      q(root, '[data-o]').innerHTML = `${n} characters × 8 bits = <b>${n * 8} bits</b> (${n} bytes). Codes are in order: if <b>A</b> is 65, then <b>B</b> is 66 and <b>C</b> is 67. Lower-case letters have different codes from capitals (<b>a</b> = 97).<br>
        <b>ASCII</b> uses 7 bits (128 characters; often stored in 8 bits). <b>Unicode</b> uses more bits per character (eg 16 or more), so it can represent far more characters — every language's alphabet, symbols and emoji — but each character takes more storage.`;
    }
    root.addEventListener('input', draw); draw();
  };

  /* ---------- 1.2 images ---------- */
  W.pixel = function (root) {
    const PAL8 = ['#ffffff', '#000000', '#dc2626', '#16a34a', '#2563eb', '#facc15', '#7c3aed', '#f97316', '#0ea5e9', '#a3a3a3', '#14532d', '#831843', '#fde68a', '#1e3a8a', '#a16207', '#f472b6'];
    let W0 = 8, H0 = 8, depth = 2, pix = [], cur = 1, down = false;
    root.innerHTML = head('A bitmap image: pixels, colour depth and file size', 'Interactive') + `
      <div class="csw-row"><label>Resolution <select data-res><option value="4">4 × 4</option><option value="8" selected>8 × 8</option><option value="16">16 × 16</option></select></label>
      <label>Colour depth <select data-dep><option value="1">1 bit (2 colours)</option><option value="2" selected>2 bits (4 colours)</option><option value="3">3 bits (8 colours)</option><option value="4">4 bits (16 colours)</option></select></label><button data-clear>Clear</button></div>
      <div class="csw-two"><div><div class="csw-pal" data-pal></div><div class="csw-grid" data-g style="margin-top:8px"></div></div>
      <div><div class="csw-out" data-o></div><div class="csw-note">Each pixel stores one binary code. Row 1 of your image:</div><div class="csw-code" data-row style="white-space:normal;padding:6px 10px;word-break:break-all"></div></div></div>`;
    function reset() { pix = Array(W0 * H0).fill(0); }
    function draw() {
      const n = 1 << depth;
      q(root, '[data-pal]').innerHTML = PAL8.slice(0, n).map((c, i) => `<button data-c="${i}" class="${i === cur ? 'on' : ''}" style="background:${c}" title="code ${pad(i.toString(2), depth)}" aria-label="colour code ${pad(i.toString(2), depth)}"></button>`).join('');
      const g = q(root, '[data-g]');
      g.style.gridTemplateColumns = `repeat(${W0}, 1fr)`;
      g.innerHTML = pix.map((p, i) => `<div data-p="${i}" style="background:${PAL8[p]}"></div>`).join('');
      const bits = W0 * H0 * depth;
      q(root, '[data-o]').innerHTML = `<div><b>${n}</b> colours possible with ${depth} bit${depth > 1 ? 's' : ''} per pixel (2<sup>${depth}</sup> = ${n}).</div>
        <div style="margin-top:6px"><b>File size</b> = colour depth × height × width<br>= ${depth} × ${H0} × ${W0} = <b>${bits} bits</b> = ${bits / 8} bytes</div>
        <div class="csw-note">Higher resolution (more pixels) or more colour depth (more bits per pixel) → better quality but a bigger file. Real files also store <b>metadata</b> (width, height, colour depth…).</div>`;
      q(root, '[data-row]').textContent = pix.slice(0, W0).map(p => pad(p.toString(2), depth)).join(' ');
    }
    function paint(e) {
      const t = document.elementFromPoint(e.clientX, e.clientY);
      const c = t && t.closest && t.closest('[data-p]');
      if (c && root.contains(c)) { pix[Number(c.dataset.p)] = cur; c.style.background = PAL8[cur]; q(root, '[data-row]').textContent = pix.slice(0, W0).map(p => pad(p.toString(2), depth)).join(' '); }
    }
    root.addEventListener('pointerdown', (e) => { if (e.target.closest('[data-p]')) { down = true; paint(e); e.preventDefault(); } });
    root.addEventListener('pointermove', (e) => { if (down) paint(e); });
    window.addEventListener('pointerup', () => { down = false; });
    root.addEventListener('click', (e) => {
      const c = e.target.closest('[data-c]'); if (c) { cur = Number(c.dataset.c); draw(); }
      if (e.target.closest('[data-clear]')) { reset(); draw(); }
    });
    root.addEventListener('change', (e) => {
      if (e.target.matches('[data-res]')) { W0 = H0 = Number(e.target.value); reset(); }
      if (e.target.matches('[data-dep]')) { depth = Number(e.target.value); pix = pix.map(p => p % (1 << depth)); cur = Math.min(cur, (1 << depth) - 1); }
      draw();
    });
    reset(); for (let i = 0; i < 8; i++) { pix[i * 8 + i] = 1; pix[i * 8 + 7 - i] = 2; } draw();
  };

  /* ---------- 1.2 sound ---------- */
  W.sound = function (root) {
    root.innerHTML = head('Sampling sound', 'Interactive') + `
      <div class="csw-row"><label>Samples per wave <b data-v="sr"></b><br><input type="range" min="3" max="40" value="10" data-i="sr"></label>
      <label>Bit depth <b data-v="bd"></b> bits<br><input type="range" min="1" max="6" value="3" data-i="bd"></label></div>
      <svg viewBox="0 0 600 220" data-svg aria-label="An analogue sound wave and its samples"></svg>
      <div class="csw-out" data-o></div>
      <div class="csw-out"><b>File size calculator</b><div class="csw-row"><label>Sample rate <input type="number" value="44100" data-f="rate" style="width:100px"> Hz</label><label>Duration <input type="number" value="60" data-f="dur" style="width:80px"> s</label><label>Bit depth <input type="number" value="16" data-f="bits" style="width:70px"> bits</label></div><div data-fs></div></div>`;
    const f = (x) => Math.sin(x) * 0.7 + Math.sin(3 * x) * 0.25;
    function draw() {
      const sr = Number(q(root, '[data-i=sr]').value), bd = Number(q(root, '[data-i=bd]').value), L = 1 << bd;
      q(root, '[data-v=sr]').textContent = sr; q(root, '[data-v=bd]').textContent = bd;
      const X = (t) => 20 + t / (Math.PI * 2) * 560, Y = (y) => 110 - y * 90;
      let wave = ''; for (let i = 0; i <= 200; i++) { const t = i / 200 * Math.PI * 2; wave += (i ? 'L' : 'M') + X(t).toFixed(1) + ' ' + Y(f(t)).toFixed(1); }
      let step = '', dots = '';
      const lv = (y) => Math.round((y + 1) / 2 * (L - 1)) / (L - 1) * 2 - 1;
      for (let k = 0; k < sr; k++) {
        const t0 = k / sr * Math.PI * 2, t1 = (k + 1) / sr * Math.PI * 2, y = lv(f(t0));
        step += (k ? 'L' : 'M') + X(t0).toFixed(1) + ' ' + Y(y).toFixed(1) + 'L' + X(t1).toFixed(1) + ' ' + Y(y).toFixed(1);
        dots += `<circle cx="${X(t0).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="3.5" fill="var(--w-a)"/>`;
      }
      let grid = ''; for (let k = 0; k < L && L <= 64; k++) { const y = Y(k / (L - 1) * 2 - 1); grid += `<line x1="20" x2="580" y1="${y}" y2="${y}" stroke="currentColor" opacity=".08"/>`; }
      q(root, '[data-svg]').innerHTML = grid + `<path d="${wave}" fill="none" stroke="var(--w-b)" stroke-width="2.5" opacity=".55"/><path d="${step}" fill="none" stroke="var(--w-a)" stroke-width="2.5"/>${dots}<text x="22" y="16" font-size="12" opacity=".7">blue = analogue sound · green = the stored samples</text>`;
      q(root, '[data-o]').innerHTML = `${sr} samples are taken across this wave, and each one is rounded to one of <b>${L}</b> levels (2<sup>${bd}</sup>). More samples per second (<b>sample rate</b>, Hz) and more bits per sample (<b>bit depth</b>) make the stored sound closer to the original — better quality — but the file gets bigger.`;
      const r = Number(q(root, '[data-f=rate]').value) || 0, d = Number(q(root, '[data-f=dur]').value) || 0, b = Number(q(root, '[data-f=bits]').value) || 0;
      q(root, '[data-fs]').innerHTML = `size = sample rate × duration × bit depth = ${fmt(r)} × ${fmt(d)} × ${fmt(b)} = ${sizeText(r * d * b)} <span class="csw-note">(one channel, 1 KB = 1,000 bytes)</span>`;
    }
    root.addEventListener('input', draw); draw();
  };

  /* ---------- 1.2 compression ---------- */
  W.compress = function (root) {
    root.innerHTML = head('Lossless vs lossy compression', 'Interactive') + `
      <div class="csw-two"><div><b>Lossless</b> — nothing is thrown away
        <div class="csw-row"><input type="text" value="AAAAAABBBCCCCCCCCD" data-s style="width:100%"></div><div class="csw-out" data-l></div>
        <div class="csw-note">This shows one simple idea (run-length encoding). You will not be asked to carry out a compression algorithm — only to explain the two types.</div></div>
      <div><b>Lossy</b> — some detail is removed for good
        <div class="csw-row"><label>Compression <input type="range" min="1" max="4" value="1" data-q></label></div><svg viewBox="0 0 160 160" data-img style="max-width:220px"></svg><div class="csw-out" data-o></div></div></div>`;
    const N = 16;
    const col = (x, y) => { const r = Math.round(120 + 110 * Math.sin(x / 3)), g = Math.round(100 + 90 * Math.cos(y / 4)), b = Math.round(150 + 80 * Math.sin((x + y) / 5)); return [r, g, b]; };
    function draw() {
      const s = q(root, '[data-s]').value;
      let enc = '', i = 0; while (i < s.length) { let j = i; while (j < s.length && s[j] === s[i]) j++; enc += (j - i) + s[i]; i = j; }
      q(root, '[data-l]').innerHTML = `<code>${esc(s)}</code> (${s.length} characters)<br>→ <code>${esc(enc)}</code> (${enc.length} characters)<br>Decompressing gives back <b>exactly</b> the original — essential for text, program code and spreadsheets.`;
      const k = [1, 2, 4, 8][Number(q(root, '[data-q]').value) - 1];
      let svg = '', blocks = new Set();
      for (let y = 0; y < N; y += k) for (let x = 0; x < N; x += k) {
        let r = 0, g = 0, b = 0, n = 0;
        for (let yy = y; yy < y + k; yy++) for (let xx = x; xx < x + k; xx++) { const c = col(xx, yy); r += c[0]; g += c[1]; b += c[2]; n++; }
        const c = [r / n, g / n, b / n].map(v => Math.round(v));
        blocks.add(c.join()); svg += `<rect x="${x * 10}" y="${y * 10}" width="${k * 10}" height="${k * 10}" fill="rgb(${c})"/>`;
      }
      q(root, '[data-img]').innerHTML = svg;
      const stored = (N / k) * (N / k);
      q(root, '[data-o]').innerHTML = `Colour values stored: <b>${stored}</b> of ${N * N} (${Math.round(stored / (N * N) * 100)}%).<br>${k === 1 ? 'Original image.' : 'Neighbouring pixels have been merged — a smaller file, but the lost detail can never be recovered. Fine for photos, music and video streamed online.'}`;
    }
    root.addEventListener('input', draw); draw();
  };

  /* ---------- 1.3 topologies ---------- */
  W.topology = function (root) {
    const NODES = { star: { S: [300, 120], A: [120, 40], B: [480, 40], C: [80, 190], D: [520, 190], E: [300, 225] }, mesh: { A: [140, 50], B: [460, 50], C: [80, 180], D: [520, 180], E: [300, 225] } };
    const EDGES = { star: [['S', 'A'], ['S', 'B'], ['S', 'C'], ['S', 'D'], ['S', 'E']], mesh: [['A', 'B'], ['A', 'C'], ['A', 'D'], ['A', 'E'], ['B', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'D'], ['C', 'E'], ['D', 'E']] };
    let mode = 'star', broken = new Set(), down = new Set();
    root.innerHTML = head('Star vs mesh: what happens when something breaks?', 'Interactive') + `
      <div class="csw-row"><button data-m="star" class="pri">Star</button><button data-m="mesh">Mesh</button><button data-r>Repair all</button><span class="csw-note">Click a cable or a device to break it.</span></div>
      <svg viewBox="0 0 600 260" data-svg></svg><div class="csw-out csw-msg" data-o></div>`;
    function reach() {
      const N = NODES[mode], E = EDGES[mode].filter(e => !broken.has(e.join('')) && !down.has(e[0]) && !down.has(e[1]));
      const start = 'A'; const seen = new Set(down.has(start) ? [] : [start]); const st = [...seen];
      while (st.length) { const n = st.pop(); E.forEach(([a, b]) => { const o = a === n ? b : b === n ? a : null; if (o && !seen.has(o)) { seen.add(o); st.push(o); } }); }
      return Object.keys(N).filter(n => n !== 'S' && n !== start && !seen.has(n) && !down.has(n));
    }
    function draw() {
      const N = NODES[mode];
      const cut = reach();
      let s = '';
      EDGES[mode].forEach(e => { const [a, b] = e; const k = e.join(''); const bad = broken.has(k) || down.has(a) || down.has(b); s += `<line data-e="${k}" x1="${N[a][0]}" y1="${N[a][1]}" x2="${N[b][0]}" y2="${N[b][1]}" stroke="${bad ? 'var(--w-bad)' : 'var(--w-a)'}" stroke-width="6" stroke-dasharray="${bad ? '8 7' : ''}" style="cursor:pointer" opacity="${bad ? .7 : .85}"/>`; });
      Object.keys(N).forEach(n => {
        const [x, y] = N[n]; const isSw = n === 'S'; const off = down.has(n); const lost = cut.includes(n);
        s += `<g data-n="${n}" style="cursor:pointer"><rect x="${x - (isSw ? 46 : 36)}" y="${y - 20}" width="${isSw ? 92 : 72}" height="40" rx="10" fill="${off ? 'var(--w-bad)' : lost ? 'var(--w-warn)' : 'var(--surface,#fff)'}" stroke="currentColor" stroke-width="2"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-size="14" font-weight="700" ${off ? 'fill="#fff"' : ''}>${isSw ? 'Switch' : 'PC ' + n}</text></g>`;
      });
      q(root, '[data-svg]').innerHTML = s;
      let msg;
      if (!broken.size && !down.size) msg = mode === 'star' ? '<b>Star:</b> every device has its own cable to a central switch. The switch sends data only to the device it is addressed to.' : '<b>Mesh:</b> devices connect to each other, often with many routes between them (here every device connects to every other — a full mesh).';
      else if (down.has('A')) msg = 'PC A is the one we are checking from — repair it to test the others.';
      else msg = cut.length ? `PC A can no longer reach: <b>${cut.map(n => 'PC ' + n).join(', ')}</b>.` : '<span class="csw-chip ok">Still working</span> PC A can still reach every working device.';
      if (mode === 'star' && down.has('S')) msg += ' <span class="csw-chip bad">The central switch failed, so the whole network is down</span> — the main drawback of a star.';
      else if (mode === 'star' && (broken.size || down.size)) msg += ' A single broken cable only cuts off <b>one</b> device in a star.';
      if (mode === 'mesh' && (broken.size || down.size)) msg += ' In a mesh, data can take <b>another route</b>, so one failure rarely stops the network — but all those cables cost more.';
      q(root, '[data-o]').innerHTML = msg;
      qa(root, '[data-m]').forEach(b => b.classList.toggle('pri', b.dataset.m === mode));
    }
    root.addEventListener('click', (e) => {
      const m = e.target.closest('[data-m]'); if (m) { mode = m.dataset.m; broken.clear(); down.clear(); }
      if (e.target.closest('[data-r]')) { broken.clear(); down.clear(); }
      const ed = e.target.closest('[data-e]'); if (ed) { const k = ed.dataset.e; broken.has(k) ? broken.delete(k) : broken.add(k); }
      const nd = e.target.closest('[data-n]'); if (nd) { const k = nd.dataset.n; down.has(k) ? down.delete(k) : down.add(k); }
      draw();
    });
    draw();
  };

  /* generic step-through diagram: steps = [{h: [ids to highlight], t: 'text'}] over an SVG with elements data-k="id" */
  function stepper(root, title, svg, steps, kind) {
    let i = 0;
    root.innerHTML = head(title, kind || 'Step through') + `<div class="csw-scroll">${svg}</div><div class="csw-out csw-msg" data-o></div><div class="csw-row"><button data-b>◀ Back</button><button class="pri" data-n>Next ▶</button><span class="csw-note" data-c></span></div>`;
    function draw() {
      qa(root, '[data-k]').forEach(e => { const on = steps[i].h.includes(e.dataset.k); e.style.opacity = on ? 1 : .28; e.style.transition = 'opacity .3s'; });
      q(root, '[data-o]').innerHTML = steps[i].t;
      q(root, '[data-c]').textContent = (i + 1) + ' / ' + steps.length;
      q(root, '[data-b]').disabled = i === 0; q(root, '[data-n]').disabled = i === steps.length - 1;
    }
    root.addEventListener('click', (e) => { if (e.target.closest('[data-n]') && i < steps.length - 1) i++; if (e.target.closest('[data-b]') && i > 0) i--; draw(); });
    draw();
  }
  const box = (k, x, y, w, h, t, sub) => `<g data-k="${k}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="var(--surface,#fff)" stroke="var(--w-a)" stroke-width="2.5"/><text x="${x + w / 2}" y="${y + h / 2 + (sub ? -4 : 5)}" text-anchor="middle" font-size="14" font-weight="800">${t}</text>${sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 14}" text-anchor="middle" font-size="11" opacity=".75">${sub}</text>` : ''}</g>`;
  const arrowLine = (k, x1, y1, x2, y2, label, ly) => `<g data-k="${k}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--w-b)" stroke-width="3" marker-end="url(#csw-ah)"/>${label ? `<text x="${(x1 + x2) / 2}" y="${ly != null ? ly : (y1 + y2) / 2 - 7}" text-anchor="middle" font-size="12" font-weight="700">${label}</text>` : ''}</g>`;
  const defs = '<defs><marker id="csw-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--w-b)"/></marker></defs>';

  W.dns = function (root) {
    const svg = `<svg viewBox="0 0 640 250" style="min-width:520px">${defs}
      ${box('client', 20, 95, 150, 60, 'Your browser', 'client')}${box('dns', 245, 10, 150, 60, 'DNS server', 'name → IP lookup')}${box('dns2', 470, 10, 150, 60, 'Another DNS server', 'if not found')}${box('web', 470, 170, 150, 60, 'Web server', '93.184.216.34')}
      ${arrowLine('q1', 150, 100, 245, 55, 'www.example.com?', 62)}${arrowLine('q2', 395, 35, 470, 35, 'not known?', 25)}${arrowLine('a2', 470, 55, 395, 55, '', 0)}${arrowLine('a1', 245, 68, 160, 112, 'IP address', 105)}
      ${arrowLine('req', 170, 140, 470, 195, 'HTTP request to the IP', 160)}${arrowLine('page', 470, 215, 170, 150, 'web page', 205)}</svg>`;
    stepper(root, 'How DNS turns a URL into an IP address', svg, [
      { h: ['client'], t: 'You type <b>www.example.com</b>. Computers on the internet are found by <b>IP address</b>, not by name, so the name must be converted first.' },
      { h: ['client', 'q1', 'dns'], t: 'The browser sends the domain name to a <b>Domain Name Server</b>. The Domain Name Service (DNS) is made up of many of these servers around the world.' },
      { h: ['dns', 'q2', 'dns2', 'a2'], t: 'The DNS server looks the name up in its records. If it does not have it, it <b>passes the request on</b> to another DNS server, which sends the answer back.' },
      { h: ['dns', 'a1', 'client'], t: 'The DNS server returns the <b>IP address</b> to the browser (or an error if the domain does not exist).' },
      { h: ['client', 'req', 'web'], t: 'The browser now sends a request (HTTP / HTTPS) to the <b>web server</b> at that IP address. The web server is a computer that stores and serves web pages — the browser is the <b>client</b>.' },
      { h: ['web', 'page', 'client'], t: 'The web server sends the page back and the browser displays it. This is the <b>client–server</b> model: clients request services, servers provide them.' }
    ], 'Animation');
  };

  W.layers = function (root) {
    const L = [['Application', 'HTTP, FTP, SMTP… — the data the program sends', '#2563eb'], ['Transport', 'TCP splits data into packets, numbers them, checks they arrive', '#16a34a'], ['Internet', 'IP adds the source and destination IP addresses (routing)', '#d97706'], ['Link', 'the hardware sends it: Ethernet / Wi-Fi, MAC addresses', '#7c3aed']];
    const svg = `<svg viewBox="0 0 640 250" style="min-width:520px">${L.map((l, i) => `<g data-k="L${i}"><rect x="10" y="${10 + i * 58}" width="250" height="48" rx="10" fill="${l[2]}" fill-opacity=".14" stroke="${l[2]}" stroke-width="2"/><text x="24" y="${32 + i * 58}" font-size="14" font-weight="800">${l[0]}</text><text x="24" y="${48 + i * 58}" font-size="10.5" opacity=".8">${l[1].slice(0, 46)}</text></g>`).join('')}
      ${L.map((l, i) => `<g data-k="P${i}">${L.slice(0, i + 1).reverse().map((x, j) => `<rect x="${300 + j * 46}" y="${16 + i * 58}" width="46" height="34" rx="6" fill="${x[2]}" opacity=".85"/><text x="${323 + j * 46}" y="${38 + i * 58}" text-anchor="middle" font-size="10" fill="#fff" font-weight="800">${j === i ? 'DATA' : 'hdr'}</text>`).join('')}</g>`).join('')}</svg>`;
    stepper(root, 'Layers: each one does one job', svg, [
      { h: ['L0', 'P0'], t: 'Protocols are organised into <b>layers</b>. Each layer has a specific job and only talks to the layers directly above and below it. (OCR does not need you to name the layers — this is the 4-layer TCP/IP model as a teaching example.)' },
      { h: ['L0', 'L1', 'P1'], t: 'Going down the layers, each one adds its own information (a <b>header</b>) to the data — eg the transport layer numbers the packets.' },
      { h: ['L0', 'L1', 'L2', 'P2'], t: 'The internet layer adds the IP addresses so routers can send each packet the right way.' },
      { h: ['L0', 'L1', 'L2', 'L3', 'P3'], t: 'The link layer sends it over the physical connection. At the other end the headers are removed layer by layer.' },
      { h: ['L0', 'L1', 'L2', 'L3'], t: '<b>Why layers?</b> Each layer can be developed, changed or fixed <b>independently</b> (eg swap Wi-Fi for Ethernet without changing the browser); it breaks a complex problem into manageable parts; and hardware/software from <b>different manufacturers</b> can work together because they follow the same standards.' }
    ]);
  };

  /* ---------- 1.3 / 1.4 encryption ---------- */
  W.cipher = function (root) {
    root.innerHTML = head('Encryption: scrambling data with a key', 'Interactive') + `
      <div class="csw-row"><input type="text" value="MEET AT NOON" data-p style="width:240px"><label>Key (shift) <input type="range" min="1" max="25" value="3" data-k> <b data-kv></b></label></div>
      <div class="csw-out" data-o></div>
      <div class="csw-note">This is a Caesar cipher — far too weak for real use, but it shows the principle. Real encryption (eg the HTTPS padlock) uses huge keys.</div>`;
    const sh = (s, k) => s.replace(/[a-z]/gi, ch => { const b = ch <= 'Z' ? 65 : 97; return String.fromCharCode((ch.charCodeAt(0) - b + k + 26) % 26 + b); });
    function draw() {
      const p = q(root, '[data-p]').value, k = Number(q(root, '[data-k]').value);
      q(root, '[data-kv]').textContent = k;
      const c = sh(p, k);
      q(root, '[data-o]').innerHTML = `Plaintext: <code>${esc(p)}</code><br>Ciphertext (what a hacker intercepting the data sees): <code class="csw-big">${esc(c)}</code><br>Decrypted with the key: <code>${esc(sh(c, -k))}</code><br>Encryption does <b>not</b> stop data being intercepted — it makes intercepted data <b>meaningless</b> without the key.`;
    }
    root.addEventListener('input', draw); draw();
  };

  /* ---------- 1.4 SQL injection ---------- */
  W.sqli = function (root) {
    root.innerHTML = head('SQL injection: how it works and how to stop it', 'Interactive') + `
      <div class="csw-two"><div><label>Username<br><input type="text" value="admin' --" data-u style="width:100%"></label><br><label>Password<br><input type="text" value="anything" data-p style="width:100%"></label>
      <div class="csw-row"><label><input type="checkbox" data-safe> Protect the input (validation / parameterised query)</label></div></div>
      <div><div class="csw-note">The query the website builds:</div><div class="csw-code" data-q style="white-space:pre-wrap;padding:8px 10px"></div><div class="csw-out" data-o></div></div></div>
      <div class="csw-row"><button data-ex="1">Try: admin' --</button><button data-ex="2">Try: ' OR '1'='1</button><button data-ex="3">Normal login</button></div>`;
    const USERS = { admin: 'Tr0ub4dor!', sam: 'sunflower9' };
    function draw() {
      const u = q(root, '[data-u]').value, p = q(root, '[data-p]').value, safe = q(root, '[data-safe]').checked;
      const sql = `SELECT * FROM users\nWHERE username = '${u}'\nAND password = '${p}'`;
      q(root, '[data-q]').textContent = sql;
      let out;
      const injected = /'/.test(u + p);
      if (safe && injected) out = '<span class="csw-chip ok">Blocked</span> The input is treated only as text (or rejected because it contains <code>\'</code>), so it can never change the SQL command.';
      else if (/'\s*--/.test(u)) out = `<span class="csw-chip bad">Hacked</span> The <code>'</code> ends the username early and <code>--</code> turns the rest of the query into a <b>comment</b> — the password check is never run! Logged in as <b>${esc(u.split("'")[0] || '?')}</b>.`;
      else if (/'\s*OR\s*'?(\w+)'?\s*=\s*'?\1/i.test(u + ' ' + p)) out = '<span class="csw-chip bad">Hacked</span> <code>OR \'1\'=\'1\'</code> is always TRUE, so the WHERE condition is true for every row — the database returns all the users and the attacker is logged in.';
      else if (USERS[u] === p) out = '<span class="csw-chip ok">Logged in</span> Correct username and password.';
      else out = '<span class="csw-chip warn">Rejected</span> Wrong username or password.';
      q(root, '[data-o]').innerHTML = out;
    }
    root.addEventListener('input', draw);
    root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-ex]'); if (!b) return;
      const ex = { 1: ["admin' --", 'anything'], 2: ["' OR '1'='1", "' OR '1'='1"], 3: ['sam', 'sunflower9'] }[b.dataset.ex];
      q(root, '[data-u]').value = ex[0]; q(root, '[data-p]').value = ex[1]; draw();
    });
    draw();
  };

  /* ---------- 1.4 brute force ---------- */
  W.brute = function (root) {
    root.innerHTML = head('Brute-force attacks: why long passwords matter', 'Interactive') + `
      <div class="csw-row"><input type="text" value="cat123" data-p style="width:220px"></div><div class="csw-out" data-o></div>
      <div class="csw-note">Assumption for this demo: an attacker's computer tries 10 billion guesses a second against a stolen password file. That figure is an assumption to compare passwords, not a measured speed.</div>`;
    function draw() {
      const p = q(root, '[data-p]').value;
      let set = 0, parts = [];
      if (/[a-z]/.test(p)) { set += 26; parts.push('lower case (26)'); }
      if (/[A-Z]/.test(p)) { set += 26; parts.push('upper case (26)'); }
      if (/[0-9]/.test(p)) { set += 10; parts.push('digits (10)'); }
      if (/[^a-zA-Z0-9]/.test(p)) { set += 33; parts.push('symbols (about 33)'); }
      const n = p.length;
      const log10 = n * Math.log10(Math.max(set, 1));
      const secs = Math.pow(10, log10 - 10);
      const human = secs < 1 ? 'less than a second' : secs < 3600 ? fmt(secs / 60) + ' minutes' : secs < 86400 * 365 ? fmt(secs / 86400) + ' days' : log10 < 30 ? fmt(secs / (86400 * 365)) + ' years' : 'far longer than the age of the universe';
      q(root, '[data-o]').innerHTML = n ? `Characters used: ${parts.join(' + ') || '—'} = <b>${set}</b> possible characters.<br>Combinations = ${set}<sup>${n}</sup> ≈ <b>10<sup>${log10.toFixed(1)}</sup></b><br>Time to try them all: <b>${human}</b>.<br>A brute-force attack tries every possible combination. Defences: long passwords with mixed character types, <b>locking the account after a few wrong attempts</b>, and CAPTCHA.` : 'Type a password.';
    }
    root.addEventListener('input', draw); draw();
  };

  /* ---------- 1.5 defragmentation ---------- */
  W.defrag = function (root) {
    const START = ['A', 'B', 'A', '.', 'C', 'B', 'A', '.', 'C', '.', 'B', 'A', '.', 'C', '.', '.'];
    let d = START.slice();
    const C = { A: '#2563eb', B: '#dc2626', C: '#16a34a', '.': 'transparent' };
    root.innerHTML = head('Defragmentation', 'Interactive') + `<div class="csw-mem" data-d style="grid-template-columns:repeat(8,minmax(0,1fr))"></div>
      <div class="csw-row"><button class="pri" data-go>Defragment</button><button data-r>Fragment again</button></div><div class="csw-out csw-msg" data-o></div>`;
    function frag(x) { let n = 0; ['A', 'B', 'C'].forEach(f => { const idx = x.map((v, i) => v === f ? i : -1).filter(i => i >= 0); for (let i = 1; i < idx.length; i++) if (idx[i] !== idx[i - 1] + 1) n++; }); return n; }
    function draw(msg) {
      q(root, '[data-d]').innerHTML = d.map((v, i) => `<div style="background:${C[v]};color:${v === '.' ? 'inherit' : '#fff'}"><small style="color:inherit;opacity:.8">block ${i}</small>${v === '.' ? 'free' : 'File ' + v}</div>`).join('');
      q(root, '[data-o]').innerHTML = msg || `Over time, files on a <b>magnetic hard disk</b> are saved wherever there is space, so they get split into pieces (<b>fragmented</b>). Gaps between pieces: <b>${frag(d)}</b>. The read/write head has to keep moving to find every piece, which slows file access.`;
    }
    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-go]')) { const files = d.filter(v => v !== '.').sort(); d = files.concat(Array(d.length - files.length).fill('.')); draw('<span class="csw-chip ok">Defragmented</span> The pieces of each file are moved next to each other and the free space is collected together. Files can be read in one go, so access is faster. (Not needed for solid state drives — they have no moving parts, and the extra writes would wear them out.)'); }
      if (e.target.closest('[data-r]')) { d = START.slice(); draw(); }
    });
    draw();
  };

  /* ---------- 2.1 searching ---------- */
  W.search = function (root) {
    let steps = [], i = 0;
    root.innerHTML = head('Linear search vs binary search', 'Interactive') + `
      <div class="csw-row"><label>Data <input type="text" value="3, 8, 12, 15, 21, 27, 33, 40, 46" data-a style="width:260px"></label><label>Find <input type="number" value="33" data-t style="width:70px"></label>
      <select data-m><option value="bin">Binary search</option><option value="lin">Linear search</option></select><button class="pri" data-go>Start</button></div>
      <div class="csw-arrs"><div class="csw-arr" data-v></div></div><div class="csw-out csw-msg" data-o></div>
      <div class="csw-row"><button data-b>◀ Back</button><button class="pri" data-n>Next ▶</button><span class="csw-note" data-c></span></div>`;
    function build() {
      const a = q(root, '[data-a]').value.split(/[ ,]+/).filter(Boolean).map(Number), t = Number(q(root, '[data-t]').value), m = q(root, '[data-m]').value;
      steps = [];
      if (m === 'lin') {
        let k = 0;
        for (; k < a.length; k++) {
          const hit = a[k] === t;
          steps.push({ a, cmp: k, hit: hit ? k : -1, out: [], t: `Compare item ${k} (<b>${a[k]}</b>) with ${t}: ${hit ? '<span class="csw-chip ok">found!</span> after ' + (k + 1) + ' comparison' + (k ? 's' : '') + '.' : 'not equal, move to the next item.'}` });
          if (hit) break;
        }
        if (k === a.length) steps.push({ a, cmp: -1, hit: -1, out: [], t: `Reached the end of the list: <b>${t}</b> is not in the list (${a.length} comparisons). Linear search works on <b>unsorted</b> data too, but may check every item.` });
      } else {
        const sorted = a.every((x, i) => !i || a[i - 1] <= x);
        if (!sorted) { steps.push({ a, cmp: -1, hit: -1, out: [], t: '<span class="csw-chip bad">Binary search needs sorted data.</span> This list is not in order — sort it first, or use a linear search.' }); }
        else {
          let lo = 0, hi = a.length - 1, n = 0;
          while (lo <= hi) {
            const mid = Math.floor((lo + hi) / 2); n++;
            const out = a.map((_, k) => k < lo || k > hi ? k : -1).filter(k => k >= 0);
            if (a[mid] === t) { steps.push({ a, cmp: mid, hit: mid, out, t: `Middle item (position ${mid}) is <b>${a[mid]}</b> = ${t}: <span class="csw-chip ok">found</span> after ${n} comparison${n > 1 ? 's' : ''}.` }); break; }
            steps.push({ a, cmp: mid, hit: -1, out, t: `Middle item is position (${lo} + ${hi}) DIV 2 = ${mid}: <b>${a[mid]}</b>. ${t} is ${t < a[mid] ? 'smaller, so discard the middle item and everything to its <b>right</b>' : 'bigger, so discard the middle item and everything to its <b>left</b>'}.` });
            if (t < a[mid]) hi = mid - 1; else lo = mid + 1;
          }
          if (lo > hi) steps.push({ a, cmp: -1, hit: -1, out: a.map((_, k) => k), t: `No items left: <b>${t}</b> is not in the list (${n} comparisons). Each comparison halves the remaining items — much faster than linear search on big sorted lists.` });
        }
      }
      i = 0; draw();
    }
    function draw() {
      const s = steps[i]; if (!s) return;
      q(root, '[data-v]').innerHTML = s.a.map((x, k) => `<div class="${k === s.hit ? 'hit' : k === s.cmp ? 'cmp' : s.out.includes(k) ? 'out' : ''}"><small>${k}</small>${x}</div>`).join('');
      q(root, '[data-o]').innerHTML = s.t; q(root, '[data-c]').textContent = 'Step ' + (i + 1) + ' / ' + steps.length;
      q(root, '[data-b]').disabled = !i; q(root, '[data-n]').disabled = i >= steps.length - 1;
    }
    root.addEventListener('click', (e) => { if (e.target.closest('[data-go]')) build(); if (e.target.closest('[data-n]') && i < steps.length - 1) { i++; draw(); } if (e.target.closest('[data-b]') && i) { i--; draw(); } });
    build();
  };

  /* ---------- 2.1 sorting ---------- */
  W.sort = function (root, o) {
    let steps = [], i = 0;
    root.innerHTML = head('Bubble sort, insertion sort and merge sort', 'Interactive') + `
      <div class="csw-row"><label>Data <input type="text" value="${(o && o.data) || '5, 1, 4, 2, 8, 3'}" data-a style="width:200px"></label>
      <select data-m><option value="bubble">Bubble sort</option><option value="insertion">Insertion sort</option><option value="merge">Merge sort</option></select><button class="pri" data-go>Start</button></div>
      <div class="csw-arrs" data-v></div><div class="csw-out csw-msg" data-o></div>
      <div class="csw-row"><button data-b>◀ Back</button><button class="pri" data-n>Next ▶</button><button data-end>Skip to end</button><span class="csw-note" data-c></span></div>`;
    function build() {
      const a = q(root, '[data-a]').value.split(/[ ,]+/).filter(Boolean).map(x => isNaN(Number(x)) ? x : Number(x)).slice(0, 12), m = q(root, '[data-m]').value;
      steps = [];
      const snap = (rows, t) => steps.push({ rows: rows.map(r => ({ v: r.v.slice(), c: r.c || {} })), t });
      if (m === 'bubble') {
        const x = a.slice(); let n = x.length, pass = 0, sorted = 0;
        snap([{ v: x }], 'Bubble sort compares <b>adjacent</b> pairs and swaps them if they are in the wrong order. After each pass, the largest remaining item has “bubbled” to the end.');
        let swapped = true;
        while (swapped) {
          swapped = false; pass++;
          for (let k = 0; k < n - 1 - sorted; k++) {
            const c = {}; c[k] = 'cmp'; c[k + 1] = 'cmp'; for (let z = n - sorted; z < n; z++) c[z] = 'done';
            if (x[k] > x[k + 1]) { [x[k], x[k + 1]] = [x[k + 1], x[k]]; const c2 = Object.assign({}, c); c2[k] = 'sw'; c2[k + 1] = 'sw'; snap([{ v: x, c: c2 }], `Pass ${pass}: ${x[k + 1]} > ${x[k]}, so <b>swap</b> them.`); swapped = true; }
            else snap([{ v: x, c }], `Pass ${pass}: compare ${x[k]} and ${x[k + 1]} — already in order, no swap.`);
          }
          sorted++;
          const c = {}; for (let z = n - sorted; z < n; z++) c[z] = 'done';
          snap([{ v: x, c }], swapped ? `End of pass ${pass}: ${x[n - sorted]} is now in its final place.` : `Pass ${pass} made <b>no swaps</b>, so the list is sorted and the algorithm stops.`);
        }
      } else if (m === 'insertion') {
        const x = a.slice();
        snap([{ v: x, c: { 0: 'done' } }], 'Insertion sort builds a <b>sorted part</b> on the left (blue). The first item on its own is already “sorted”.');
        for (let k = 1; k < x.length; k++) {
          const item = x[k]; let j = k - 1;
          const c0 = {}; for (let z = 0; z < k; z++) c0[z] = 'done'; c0[k] = 'cmp';
          snap([{ v: x, c: c0 }], `Take the next item, <b>${item}</b>, and insert it into the correct place in the sorted part.`);
          while (j >= 0 && x[j] > item) { x[j + 1] = x[j]; j--; }
          x[j + 1] = item;
          const c = {}; for (let z = 0; z <= k; z++) c[z] = 'done'; c[j + 1] = 'sw';
          snap([{ v: x, c }], `${item} moves left past every bigger item and is inserted at position ${j + 1}. The sorted part now has ${k + 1} items.`);
        }
        snap([{ v: x, c: Object.fromEntries(x.map((_, z) => [z, 'done'])) }], 'Every item has been inserted — the list is sorted.');
      } else {
        let groups = [a.slice()];
        snap([{ v: a }], 'Merge sort first <b>splits</b> the list in half again and again, until every list has just one item.');
        while (groups.some(g => g.length > 1)) {
          groups = groups.flatMap(g => g.length > 1 ? [g.slice(0, Math.ceil(g.length / 2)), g.slice(Math.ceil(g.length / 2))] : [g]);
          snap(groups.map(g => ({ v: g })), 'Split: ' + groups.map(g => '[' + g.join(', ') + ']').join(' '));
        }
        while (groups.length > 1) {
          const next = [];
          for (let k = 0; k < groups.length; k += 2) {
            if (k + 1 >= groups.length) { next.push(groups[k]); continue; }
            const L = groups[k], R = groups[k + 1], out = []; let l = 0, r = 0;
            while (l < L.length && r < R.length) out.push(L[l] <= R[r] ? L[l++] : R[r++]);
            next.push(out.concat(L.slice(l), R.slice(r)));
          }
          groups = next;
          snap(groups.map(g => ({ v: g, c: Object.fromEntries(g.map((_, z) => [z, 'done'])) })), 'Merge pairs of lists: compare the <b>first item of each</b> list, take the smaller one, repeat. Result: ' + groups.map(g => '[' + g.join(', ') + ']').join(' '));
        }
        snap([{ v: groups[0], c: Object.fromEntries(groups[0].map((_, z) => [z, 'done'])) }], 'One list remains, and it is sorted. Merge sort is efficient on large lists but uses more memory (it makes new lists).');
      }
      i = 0; draw();
    }
    function draw() {
      const s = steps[i]; if (!s) return;
      q(root, '[data-v]').innerHTML = `<div class="csw-row" style="gap:14px">${s.rows.map(r => `<div class="csw-arr">${r.v.map((x, k) => `<div class="${r.c[k] || ''}"><small>${k}</small>${esc(x)}</div>`).join('')}</div>`).join('')}</div>`;
      q(root, '[data-o]').innerHTML = s.t; q(root, '[data-c]').textContent = 'Step ' + (i + 1) + ' / ' + steps.length;
      q(root, '[data-b]').disabled = !i; q(root, '[data-n]').disabled = i >= steps.length - 1;
    }
    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-go]')) build();
      if (e.target.closest('[data-n]') && i < steps.length - 1) { i++; draw(); }
      if (e.target.closest('[data-b]') && i) { i--; draw(); }
      if (e.target.closest('[data-end]')) { i = steps.length - 1; draw(); }
    });
    root.addEventListener('change', (e) => { if (e.target.matches('[data-m]')) build(); });
    build();
  };

  /* ---------- 2.1 trace tables ---------- */
  const TRACES = {
    sum: { title: 'A count-controlled loop', vars: ['total', 'i'], code: ['total = 0', 'for i = 1 to 4', '    total = total + i', 'next i', 'print(total)'],
      run() { const r = []; let total = 0; r.push([1, { total }]); for (let i = 1; i <= 4; i++) { r.push([2, { i }]); total += i; r.push([3, { total }]); r.push([4, {}]); } r.push([5, {}, String(total)]); return r; } },
    halve: { title: 'A condition-controlled loop', vars: ['x', 'count'], code: ['x = 50', 'count = 0', 'while x > 5', '    x = x DIV 2', '    count = count + 1', 'endwhile', 'print(count)'],
      run() { const r = []; let x = 50, count = 0; r.push([1, { x }]); r.push([2, { count }]); while (x > 5) { r.push([3, {}]); x = Math.floor(x / 2); r.push([4, { x }]); count++; r.push([5, { count }]); } r.push([3, {}]); r.push([7, {}, String(count)]); return r; } },
    max: { title: 'Selection inside a loop', vars: ['highest', 'k'], code: ['scores = [12, 31, 7, 31, 19]', 'highest = scores[0]', 'for k = 1 to 4', '    if scores[k] > highest then', '        highest = scores[k]', '    endif', 'next k', 'print(highest)'],
      run() { const s = [12, 31, 7, 31, 19], r = []; let h = s[0]; r.push([1, {}]); r.push([2, { highest: h }]); for (let k = 1; k <= 4; k++) { r.push([3, { k }]); r.push([4, {}]); if (s[k] > h) { h = s[k]; r.push([5, { highest: h }]); } r.push([7, {}]); } r.push([8, {}, String(h)]); return r; } }
  };
  W.trace = function (root, o) {
    let key = (o && o.p) || 'sum', rows = [], i = 0;
    root.innerHTML = head('Trace table: run the code one line at a time', 'Interactive') + `
      <div class="csw-row"><select data-p>${Object.keys(TRACES).map(k => `<option value="${k}"${k === key ? ' selected' : ''}>${TRACES[k].title}</option>`).join('')}</select></div>
      <div class="csw-two"><div class="csw-code" data-code></div><div class="csw-scroll"><table data-t></table></div></div>
      <div class="csw-row"><button data-b>◀ Back</button><button class="pri" data-n>Run next line ▶</button><button data-r>Restart</button><span class="csw-note" data-c></span></div>
      <div class="csw-note">Exam rule: write a new row whenever a variable changes or something is output. You do not have to write unchanged values again.</div>`;
    function load() { rows = TRACES[key].run(); i = 0; draw(); }
    function draw() {
      const T = TRACES[key];
      const ln = i ? rows[i - 1][0] : 0;
      q(root, '[data-code]').innerHTML = T.code.map((c, k) => `<div class="${k + 1 === ln ? 'on' : ''}"><b>${pad(k + 1, 2)}</b>${esc(c)}</div>`).join('');
      const shown = rows.slice(0, i).filter(r => Object.keys(r[1]).length || r[2] != null);
      q(root, '[data-t]').innerHTML = `<tr><th>Line</th>${T.vars.map(v => `<th>${v}</th>`).join('')}<th>Output</th></tr>` + shown.map((r, k) => `<tr class="${k === shown.length - 1 && (Object.keys(rows[i - 1][1]).length || rows[i - 1][2] != null) ? 'on' : ''}"><td>${pad(r[0], 2)}</td>${T.vars.map(v => `<td>${r[1][v] != null ? r[1][v] : ''}</td>`).join('')}<td>${r[2] || ''}</td></tr>`).join('');
      q(root, '[data-c]').textContent = i >= rows.length ? 'Finished' : 'Line ' + (rows[i] ? rows[i][0] : '') + ' runs next';
      q(root, '[data-b]').disabled = !i; q(root, '[data-n]').disabled = i >= rows.length;
    }
    root.addEventListener('click', (e) => { if (e.target.closest('[data-n]') && i < rows.length) i++; if (e.target.closest('[data-b]') && i) i--; if (e.target.closest('[data-r]')) i = 0; draw(); });
    root.addEventListener('change', (e) => { if (e.target.matches('[data-p]')) { key = e.target.value; load(); } });
    load();
  };

  /* ---------- 2.1 flowchart runner ---------- */
  W.flow = function (root) {
    const svg = `<svg viewBox="0 0 520 470" style="min-width:420px">${defs}
      <g data-f="start"><rect x="190" y="10" width="140" height="40" rx="20" class="csw-gate"/><text x="260" y="35" text-anchor="middle" font-size="14" font-weight="700">Start</text></g>
      <g data-f="in"><path d="M195 80h150l-20 46h-150z" class="csw-gate"/><text x="260" y="108" text-anchor="middle" font-size="13" font-weight="700">INPUT mark</text></g>
      <g data-f="d1"><path d="M260 150l90 40-90 40-90-40z" class="csw-gate"/><text x="260" y="195" text-anchor="middle" font-size="13" font-weight="700">mark &gt;= 50?</text></g>
      <g data-f="pass"><path d="M370 250h120l-16 42h-120z" class="csw-gate"/><text x="427" y="276" text-anchor="middle" font-size="12" font-weight="700">OUTPUT "Pass"</text></g>
      <g data-f="fail"><path d="M50 250h120l-16 42h-120z" class="csw-gate"/><text x="107" y="276" text-anchor="middle" font-size="12" font-weight="700">OUTPUT "Fail"</text></g>
      <g data-f="end"><rect x="190" y="400" width="140" height="40" rx="20" class="csw-gate"/><text x="260" y="425" text-anchor="middle" font-size="14" font-weight="700">End</text></g>
      <g stroke="currentColor" stroke-width="2" fill="none" opacity=".75"><path d="M260 50v28" marker-end="url(#csw-ah)"/><path d="M260 126v22" marker-end="url(#csw-ah)"/><path d="M350 190h80v58" marker-end="url(#csw-ah)"/><path d="M170 190h-60v58" marker-end="url(#csw-ah)"/><path d="M427 292v70h-150v36" marker-end="url(#csw-ah)"/><path d="M107 292v70h150"/></g>
      <text x="380" y="182" font-size="12" font-weight="800">Yes / True</text><text x="98" y="182" font-size="12" font-weight="800">No / False</text></svg>`;
    root.innerHTML = head('Run a flowchart', 'Interactive') + `<div class="csw-row"><label>mark = <input type="number" value="62" data-m style="width:80px"></label><button class="pri" data-go>Run</button></div><div class="csw-scroll">${svg}</div><div class="csw-out csw-msg" data-o></div>
      <div class="csw-note">Symbols: rounded box = terminal (start/end) · parallelogram = input/output · rectangle = process · diamond = decision (two exits, labelled) · rectangle with double sides = sub program · arrows (lines) show the flow.</div>`;
    let tm = [];
    function run() {
      tm.forEach(clearTimeout); tm = [];
      const m = Number(q(root, '[data-m]').value), path = ['start', 'in', 'd1', m >= 50 ? 'pass' : 'fail', 'end'];
      qa(root, '[data-f]').forEach(g => { g.style.opacity = .3; });
      path.forEach((k, n) => tm.push(setTimeout(() => {
        const g = q(root, `[data-f="${k}"]`); if (g) { g.style.opacity = 1; g.style.transition = 'opacity .3s'; }
        q(root, '[data-o]').innerHTML = ['Start', `The input box stores ${m} in <code>mark</code>.`, `Decision: is ${m} &gt;= 50? <b>${m >= 50 ? 'Yes' : 'No'}</b> — follow the ${m >= 50 ? 'Yes' : 'No'} arrow.`, `Output: <b>${m >= 50 ? 'Pass' : 'Fail'}</b>`, 'End'][n];
      }, n * 700)));
    }
    root.addEventListener('click', (e) => { if (e.target.closest('[data-go]')) run(); });
    run();
  };

  /* ---------- 2.4 logic gates ---------- */
  const GATE = {
    and: (x, y) => `<path class="csw-gate" d="M${x} ${y - 25}h30a25 25 0 0 1 0 50h-30z"/><text x="${x + 22}" y="${y + 5}" text-anchor="middle" font-size="11" font-weight="800">AND</text>`,
    or: (x, y) => `<path class="csw-gate" d="M${x} ${y - 25}q40 0 60 25q-20 25 -60 25q14 -25 0 -50z"/><text x="${x + 27}" y="${y + 5}" text-anchor="middle" font-size="11" font-weight="800">OR</text>`,
    not: (x, y) => `<path class="csw-gate" d="M${x} ${y - 20}l40 20-40 20z"/><circle cx="${x + 46}" cy="${y}" r="6" class="csw-gate"/><text x="${x + 14}" y="${y + 4}" text-anchor="middle" font-size="9" font-weight="800">NOT</text>`
  };
  const CIRCUITS = {
    and: { label: 'P = A AND B', ins: ['A', 'B'], f: (v) => v.A && v.B, draw: (v, w) => `${w('A', 'M40 70H120', v.A)}${w('B', 'M40 130H120', v.B)}${GATE.and(120, 100)}${w('P', 'M175 100H260', v.A && v.B)}`, pins: { A: [40, 70], B: [40, 130] }, out: [260, 100] },
    or: { label: 'P = A OR B', ins: ['A', 'B'], f: (v) => v.A || v.B, draw: (v, w) => `${w('A', 'M40 70H125', v.A)}${w('B', 'M40 130H125', v.B)}${GATE.or(115, 100)}${w('P', 'M175 100H260', v.A || v.B)}`, pins: { A: [40, 70], B: [40, 130] }, out: [260, 100] },
    not: { label: 'P = NOT A', ins: ['A'], f: (v) => !v.A, draw: (v, w) => `${w('A', 'M40 100H130', v.A)}${GATE.not(130, 100)}${w('P', 'M182 100H260', !v.A)}`, pins: { A: [40, 100] }, out: [260, 100] },
    c1: { label: 'P = (A AND B) OR NOT C', ins: ['A', 'B', 'C'], f: (v) => (v.A && v.B) || !v.C,
      draw: (v, w) => `${w('A', 'M40 50H130', v.A)}${w('B', 'M40 100H130', v.B)}${GATE.and(130, 75)}${w('x', 'M185 75H230V105H262', v.A && v.B)}${w('C', 'M40 170H140', v.C)}${GATE.not(140, 170)}${w('y', 'M192 170H230V145H262', !v.C)}${GATE.or(252, 125)}${w('P', 'M312 125H380', (v.A && v.B) || !v.C)}`, pins: { A: [40, 50], B: [40, 100], C: [40, 170] }, out: [380, 125] },
    c2: { label: 'P = NOT (A OR B)', ins: ['A', 'B'], f: (v) => !(v.A || v.B), draw: (v, w) => `${w('A', 'M40 70H125', v.A)}${w('B', 'M40 130H125', v.B)}${GATE.or(115, 100)}${w('x', 'M175 100H210', v.A || v.B)}${GATE.not(210, 100)}${w('P', 'M262 100H330', !(v.A || v.B))}`, pins: { A: [40, 70], B: [40, 130] }, out: [330, 100] },
    c3: { label: 'P = (A OR B) AND C', ins: ['A', 'B', 'C'], f: (v) => (v.A || v.B) && v.C, draw: (v, w) => `${w('A', 'M40 50H125', v.A)}${w('B', 'M40 100H125', v.B)}${GATE.or(115, 75)}${w('x', 'M175 75H230V105H262', v.A || v.B)}${w('C', 'M40 170H230V145H262', v.C)}${GATE.and(262, 125)}${w('P', 'M317 125H380', (v.A || v.B) && v.C)}`, pins: { A: [40, 50], B: [40, 100], C: [40, 170] }, out: [380, 125] }
  };
  W.logic = function (root, o) {
    let key = (o && o.c) || 'c1', v = { A: 1, B: 0, C: 1 };
    root.innerHTML = head('Logic gate playground', 'Interactive') + `
      <div class="csw-row"><select data-c>${Object.keys(CIRCUITS).map(k => `<option value="${k}"${k === key ? ' selected' : ''}>${CIRCUITS[k].label}</option>`).join('')}</select><span class="csw-note">Click the inputs to switch them between 0 and 1.</span></div>
      <div class="csw-scroll"><svg viewBox="0 0 420 210" data-svg style="min-width:340px"></svg></div>
      <div class="csw-scroll"><table data-t style="max-width:420px"></table></div>`;
    function draw() {
      const C = CIRCUITS[key];
      const w = (id, d, on) => `<path d="${d}" class="csw-wire ${on ? 'csw-on' : 'csw-off'}"/>`;
      let s = C.draw(v, w);
      C.ins.forEach(n => { const [x, y] = C.pins[n]; s += `<g data-in="${n}" style="cursor:pointer"><rect x="${x - 34}" y="${y - 15}" width="34" height="30" rx="8" fill="${v[n] ? 'var(--w-ok)' : 'var(--surface,#fff)'}" stroke="currentColor" stroke-width="2"/><text x="${x - 17}" y="${y + 5}" text-anchor="middle" font-size="14" font-weight="800" ${v[n] ? 'fill="#fff"' : ''}>${v[n]}</text><text x="${x - 17}" y="${y - 20}" text-anchor="middle" font-size="12" font-weight="800">${n}</text></g>`; });
      const out = C.f(v) ? 1 : 0, [ox, oy] = C.out;
      s += `<rect x="${ox}" y="${oy - 16}" width="34" height="32" rx="16" fill="${out ? 'var(--w-ok)' : 'var(--surface,#fff)'}" stroke="currentColor" stroke-width="2"/><text x="${ox + 17}" y="${oy + 5}" text-anchor="middle" font-size="14" font-weight="800" ${out ? 'fill="#fff"' : ''}>${out}</text><text x="${ox + 17}" y="${oy - 22}" text-anchor="middle" font-size="12" font-weight="800">P</text>`;
      q(root, '[data-svg]').innerHTML = s;
      const n = C.ins.length, rows = [];
      for (let r = 0; r < (1 << n); r++) { const vv = {}; C.ins.forEach((name, k) => { vv[name] = (r >> (n - 1 - k)) & 1; }); rows.push(vv); }
      q(root, '[data-t]').innerHTML = `<tr>${C.ins.map(x => `<th>${x}</th>`).join('')}<th>P</th></tr>` + rows.map(vv => `<tr class="${C.ins.every(x => vv[x] === v[x]) ? 'on' : ''}">${C.ins.map(x => `<td>${vv[x]}</td>`).join('')}<td><b>${C.f(vv) ? 1 : 0}</b></td></tr>`).join('');
    }
    root.addEventListener('click', (e) => { const g = e.target.closest('[data-in]'); if (g) { v[g.dataset.in] ^= 1; draw(); } });
    root.addEventListener('change', (e) => { if (e.target.matches('[data-c]')) { key = e.target.value; draw(); } });
    draw();
  };

  /* ---------- 2.3 test data ---------- */
  W.testdata = function (root) {
    root.innerHTML = head('Choosing test data', 'Interactive') + `
      <p style="margin:0">A program asks for the number of <b>tickets</b> to buy. Valid: a <b>whole number from 1 to 10</b> inclusive.</p>
      <div class="csw-row"><input type="text" value="10" data-v style="width:120px"><button data-ex="5">5</button><button data-ex="1">1</button><button data-ex="10">10</button><button data-ex="11">11</button><button data-ex="0">0</button><button data-ex="four">four</button><button data-ex="2.5">2.5</button></div>
      <div class="csw-out" data-o></div>`;
    function draw() {
      const s = q(root, '[data-v]').value.trim();
      let type, acc, why;
      if (!s.length) { type = 'Erroneous'; acc = false; why = 'Nothing was entered — a presence check rejects it.'; }
      else if (!/^-?\d+$/.test(s)) { type = 'Erroneous'; acc = false; why = 'It is not a whole number — it is the <b>wrong data type</b>, so a type check rejects it.'; }
      else {
        const n = Number(s);
        if (n === 1 || n === 10) { type = 'Boundary'; acc = true; why = 'It is the right type and on the <b>very edge</b> of the valid range, so it should be accepted. (Some exam answers also count 0 and 11 — just outside the edge — as boundary tests that must be rejected.)'; }
        else if (n >= 2 && n <= 9) { type = 'Normal'; acc = true; why = 'Sensible data that the program should accept without problems.'; }
        else { type = 'Invalid'; acc = false; why = 'The right data type (a whole number) but <b>outside the range</b> 1–10, so a range check rejects it.'; }
      }
      q(root, '[data-o]').innerHTML = `<span class="csw-chip ${acc ? 'ok' : 'bad'}">${acc ? 'Accepted' : 'Rejected'}</span> Test type: <b>${type}</b><br>${why}`;
    }
    root.addEventListener('input', draw);
    root.addEventListener('click', (e) => { const b = e.target.closest('[data-ex]'); if (b) { q(root, '[data-v]').value = b.dataset.ex; draw(); } });
    draw();
  };

  /* ---------- 2.5 compiler vs interpreter ---------- */
  W.translate = function (root) {
    const CODE = ['name = "Ana"', 'print("Hello")', 'print(name)', 'prnt("Bye")', 'print("Done")'];
    root.innerHTML = head('Compiler vs interpreter', 'Interactive') + `<div class="csw-code">${CODE.map((c, k) => `<div><b>${k + 1}</b>${esc(c)}</div>`).join('')}</div>
      <div class="csw-row"><button class="pri" data-m="c">Compile, then run</button><button class="pri" data-m="i">Interpret</button><button data-fix>Fix line 4</button></div><div class="csw-out csw-msg csw-mono" data-o style="white-space:pre-wrap"></div><div class="csw-out" data-e></div>`;
    let fixed = false, tm = [];
    function run(m) {
      tm.forEach(clearTimeout); tm = [];
      const code = CODE.map((c, k) => k === 3 && fixed ? 'print("Bye")' : c);
      qa(root, '.csw-code div').forEach((d, k) => { d.lastChild.textContent = code[k]; d.classList.remove('on'); });
      const out = q(root, '[data-o]'), ex = q(root, '[data-e]'); out.textContent = ''; ex.innerHTML = '';
      const bad = code.findIndex(c => c.startsWith('prnt'));
      if (m === 'c') {
        out.textContent = 'Translating the whole program into machine code…\n';
        tm.push(setTimeout(() => {
          if (bad >= 0) { out.textContent += `Error on line ${bad + 1}: unknown function "prnt"\nNo executable file created — nothing has run.`; ex.innerHTML = 'A <b>compiler</b> translates the <b>whole</b> program in one go and reports <b>all</b> the errors at the end. Nothing runs until every error is fixed. Once it compiles, the <b>executable</b> runs fast and can be given to users without the source code or a translator.'; }
          else { out.textContent += 'Executable created.\nHello\nAna\nBye\nDone'; ex.innerHTML = 'Compiled once — the executable can now be run again and again <b>without translating it again</b>, and runs quickly.'; }
        }, 700));
      } else {
        code.forEach((c, k) => tm.push(setTimeout(() => {
          if (bad >= 0 && k > bad) return;
          qa(root, '.csw-code div').forEach((d, z) => d.classList.toggle('on', z === k));
          if (k === bad) { out.textContent += `Error on line ${k + 1}: name "prnt" is not defined — stopped.`; ex.innerHTML = 'An <b>interpreter</b> translates and runs the code <b>one line at a time</b>. Lines 1–3 already ran, then it <b>stopped at the first error</b> — handy for testing and debugging. But it has to translate every time the program runs (slower), and users need the interpreter.'; return; }
          const m2 = c.match(/^print\((.*)\)$/); if (m2) out.textContent += (m2[1] === 'name' ? 'Ana' : m2[1].replace(/"/g, '')) + '\n';
          if (k === code.length - 1) ex.innerHTML = 'Every line was translated and run in turn.';
        }, k * 600)));
      }
    }
    root.addEventListener('click', (e) => { const b = e.target.closest('[data-m]'); if (b) run(b.dataset.m); if (e.target.closest('[data-fix]')) { fixed = !fixed; e.target.textContent = fixed ? 'Put the error back' : 'Fix line 4'; run('i'); } });
  };

  /* ---------- 2.2 SQL ---------- */
  W.sql = function (root) {
    const COLS = ['StudentID', 'Name', 'Year', 'House', 'Score'];
    const ROWS = [['S01', 'Amir', 10, 'Red', 74], ['S02', 'Bella', 11, 'Blue', 58], ['S03', 'Chen', 10, 'Blue', 91], ['S04', 'Dara', 11, 'Green', 42], ['S05', 'Eli', 10, 'Red', 66], ['S06', 'Fay', 11, 'Red', 85]];
    root.innerHTML = head('SQL: SELECT … FROM … WHERE', 'Interactive') + `<div class="csw-note">Table <b>Students</b></div><div class="csw-scroll"><table>${'<tr>' + COLS.map(c => `<th>${c}</th>`).join('') + '</tr>' + ROWS.map(r => '<tr>' + r.map(x => `<td>${x}</td>`).join('') + '</tr>').join('')}</table></div>
      <div class="csw-row" style="margin-top:10px"><input type="text" data-q style="width:100%;font-family:var(--mono,monospace)" value="SELECT Name, Score FROM Students WHERE Score > 60"></div>
      <div class="csw-row"><button data-ex="SELECT * FROM Students WHERE House = 'Red'">House = 'Red'</button><button data-ex="SELECT Name FROM Students WHERE Year = 10 AND Score >= 70">AND</button><button data-ex="SELECT Name, House FROM Students WHERE House = 'Blue' OR House = 'Green'">OR</button></div><div class="csw-out" data-o></div>`;
    function parse(s) {
      const m = s.trim().replace(/;$/, '').match(/^SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?$/i);
      if (!m) throw new Error('Use the pattern: SELECT fields FROM table WHERE condition');
      if (m[2].toLowerCase() !== 'students') throw new Error('There is no table called "' + m[2] + '" — the table is Students.');
      const fields = m[1].trim() === '*' ? COLS : m[1].split(',').map(f => { const c = COLS.find(x => x.toLowerCase() === f.trim().toLowerCase()); if (!c) throw new Error('No field called "' + f.trim() + '".'); return c; });
      let test = () => true;
      if (m[3]) {
        const parts = m[3].split(/\s+(AND|OR)\s+/i);
        const conds = [];
        for (let k = 0; k < parts.length; k += 2) {
          const c = parts[k].match(/^(\w+)\s*(=|!=|<>|<=|>=|<|>)\s*('([^']*)'|"([^"]*)"|-?\d+(\.\d+)?)$/);
          if (!c) throw new Error('Could not read the condition "' + parts[k] + '". Text values need quotation marks, eg House = \'Red\'.');
          const col = COLS.findIndex(x => x.toLowerCase() === c[1].toLowerCase()); if (col < 0) throw new Error('No field called "' + c[1] + '".');
          const val = c[4] != null ? c[4] : c[5] != null ? c[5] : Number(c[3]);
          conds.push((r) => { const a = r[col]; switch (c[2]) { case '=': return a == val; case '!=': case '<>': return a != val; case '<': return a < val; case '>': return a > val; case '<=': return a <= val; default: return a >= val; } });
        }
        const ops = parts.filter((_, k) => k % 2).map(x => x.toUpperCase());
        test = (r) => { let res = conds[0](r); ops.forEach((op, k) => { res = op === 'AND' ? res && conds[k + 1](r) : res || conds[k + 1](r); }); return res; };
      }
      return { fields, rows: ROWS.filter(test) };
    }
    function draw() {
      try {
        const r = parse(q(root, '[data-q]').value);
        q(root, '[data-o]').innerHTML = `<b>${r.rows.length}</b> record${r.rows.length === 1 ? '' : 's'} found<div class="csw-scroll"><table><tr>${r.fields.map(f => `<th>${f}</th>`).join('')}</tr>${r.rows.map(row => '<tr>' + r.fields.map(f => `<td>${row[COLS.indexOf(f)]}</td>`).join('') + '</tr>').join('')}</table></div><div class="csw-note">SELECT = which fields to show (* = all) · FROM = which table · WHERE = which records.</div>`;
      } catch (e) { q(root, '[data-o]').innerHTML = '<span class="csw-chip bad">Error</span> ' + esc(e.message); }
    }
    root.addEventListener('input', draw);
    root.addEventListener('click', (e) => { const b = e.target.closest('[data-ex]'); if (b) { q(root, '[data-q]').value = b.dataset.ex; draw(); } });
    draw();
  };

  /* ---------- 2.2 strings ---------- */
  W.strings = function (root) {
    root.innerHTML = head('String handling: OCR Exam Reference Language vs Python', 'Interactive') + `
      <div class="csw-row"><label>subject = <input type="text" value="ComputerScience" data-s style="width:180px"></label><label>x <input type="number" value="3" data-x style="width:60px"></label><label>i <input type="number" value="5" data-i style="width:60px"></label></div>
      <div class="csw-scroll"><table data-t></table></div><div class="csw-note">Characters are counted from <b>0</b>. In OCR's language, <code>substring(x, i)</code> starts at position x and takes i characters.</div>`;
    function draw() {
      const s = q(root, '[data-s]').value, x = Math.max(0, Number(q(root, '[data-x]').value) || 0), i = Math.max(0, Number(q(root, '[data-i]').value) || 0);
      const R = [['subject.length', 'len(subject)', s.length], ['subject.upper', 'subject.upper()', s.toUpperCase()], ['subject.lower', 'subject.lower()', s.toLowerCase()],
        [`subject.left(${i})`, `subject[:${i}]`, s.slice(0, i)], [`subject.right(${i})`, `subject[-${i}:]`, i ? s.slice(-i) : ''], [`subject.substring(${x}, ${i})`, `subject[${x}:${x + i}]`, s.substr(x, i)],
        ['subject + "!"', 'subject + "!"', s + '!'], [`ASC("${s[0] || 'A'}")`, `ord("${s[0] || 'A'}")`, (s[0] || 'A').charCodeAt(0)], ['CHR(97)', 'chr(97)', 'a']];
      q(root, '[data-t]').innerHTML = '<tr><th>OCR Exam Reference Language</th><th>Python</th><th>Result</th></tr>' + R.map(r => `<tr><td class="csw-mono">${esc(r[0])}</td><td class="csw-mono">${esc(r[1])}</td><td class="csw-mono"><b>${esc(typeof r[2] === 'string' ? '"' + r[2] + '"' : r[2])}</b></td></tr>`).join('');
    }
    root.addEventListener('input', draw); draw();
  };

  /* ---------- 2.2 2D arrays ---------- */
  W.array2d = function (root) {
    const D = [[12, 15, 9, 20], [7, 18, 11, 14], [16, 10, 13, 19]];
    let r = 1, c = 2;
    root.innerHTML = head('2D arrays: rows and columns', 'Interactive') + `<p style="margin:0">Laps run by 3 students (rows) on 4 days (columns). Click a cell.</p>
      <div class="csw-scroll"><table data-t style="max-width:460px"></table></div><div class="csw-out" data-o></div>`;
    function draw() {
      q(root, '[data-t]').innerHTML = '<tr><th></th>' + D[0].map((_, k) => `<th>col ${k}</th>`).join('') + '<th>row total</th></tr>' + D.map((row, i) => `<tr><th>row ${i}</th>${row.map((v, k) => `<td data-rc="${i},${k}" style="cursor:pointer;${i === r && k === c ? 'background:var(--w-a);color:#fff;font-weight:800' : i === r || k === c ? 'background:color-mix(in srgb,var(--w-a) 10%,transparent)' : ''}">${v}</td>`).join('')}<td>${row.reduce((a, b) => a + b, 0)}</td></tr>`).join('');
      q(root, '[data-o]').innerHTML = `OCR Exam Reference Language: <code>laps[${r},${c}]</code> = <b>${D[r][c]}</b> · Python: <code>laps[${r}][${c}]</code><br>Total for row ${r} (a loop over the columns):<div class="csw-code" style="margin-top:6px"><div>total = 0</div><div>for col = 0 to 3</div><div>    total = total + laps[${r},col]</div><div>next col</div><div>print(total)   // ${D[r].reduce((a, b) => a + b, 0)}</div></div>`;
    }
    root.addEventListener('click', (e) => { const td = e.target.closest('[data-rc]'); if (td) { [r, c] = td.dataset.rc.split(',').map(Number); draw(); } });
    draw();
  };

  /* ---------- 2.2 random numbers ---------- */
  W.dice = function (root) {
    let counts = [0, 0, 0, 0, 0, 0], n = 0, last = null;
    root.innerHTML = head('Random numbers: roll = random(1, 6)', 'Interactive') + `<div class="csw-row"><button class="pri" data-r="1">Roll once</button><button data-r="100">Roll 100 times</button><button data-r="1000">Roll 1,000 times</button><button data-x>Reset</button></div>
      <svg viewBox="0 0 420 170" data-svg></svg><div class="csw-out" data-o></div>`;
    function draw() {
      const mx = Math.max(1, ...counts);
      q(root, '[data-svg]').innerHTML = counts.map((c, k) => `<rect x="${20 + k * 66}" y="${140 - c / mx * 120}" width="46" height="${c / mx * 120}" rx="6" fill="var(--w-a)"/><text x="${43 + k * 66}" y="160" text-anchor="middle" font-size="13" font-weight="800">${k + 1}</text><text x="${43 + k * 66}" y="${134 - c / mx * 120}" text-anchor="middle" font-size="11">${c}</text>`).join('');
      q(root, '[data-o]').innerHTML = n ? `Last roll: <b class="csw-big">${last}</b> · ${n} rolls. Each whole number from 1 to 6 (inclusive) is equally likely, so with many rolls the bars even out.` : 'Press roll.';
    }
    root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-r]'); if (b) { for (let k = 0; k < Number(b.dataset.r); k++) { last = 1 + Math.floor(Math.random() * 6); counts[last - 1]++; n++; } draw(); }
      if (e.target.closest('[data-x]')) { counts = [0, 0, 0, 0, 0, 0]; n = 0; last = null; draw(); }
    });
    draw();
  };

  /* ---------- mount ---------- */
  function mountAll(scope) {
    if (!document.getElementById('csw-css')) { const st = document.createElement('style'); st.id = 'csw-css'; st.textContent = WCSS; document.head.appendChild(st); }
    (scope || document).querySelectorAll('.csw:not([data-ready])').forEach(el => {
      const f = W[el.dataset.w]; el.dataset.ready = '1';
      if (!f) return;
      let o = {}; try { o = JSON.parse(el.dataset.o || '{}'); } catch (e) {}
      try { f(el, o); } catch (e) { el.innerHTML = '<p class="csw-note">This diagram could not load.</p>'; if (window.console) console.error('guide widget', el.dataset.w, e); }
    });
  }
  const mo = new MutationObserver(() => { if (document.querySelector('.csw:not([data-ready])')) mountAll(); });
  if (document.body) mo.observe(document.body, { childList: true, subtree: true });
  else document.addEventListener('DOMContentLoaded', () => mo.observe(document.body, { childList: true, subtree: true }));

/* ---- 99_tail.js ---- */
  const AIMS = Object.keys(T);
  window.BIZ_GUIDE_DATA = {
    storeKey: 'ra10-guide-revised-ocr-j277-cs',
    unitLabel: 'GCSE Computer Science Guide',
    aimWord: 'Chapter',
    aimLabels: window.AIM_LABEL || null,
    aims: AIMS,
    setTaskTitle: 'The exams',
    titles: TITLE,
    subtitles: SUB,
    setTask,
    topics: T,
    gallery: []
  };
})();

