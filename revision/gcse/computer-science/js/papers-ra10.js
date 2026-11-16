/* papers-ra10 — hand-written RA10 content. Generated from training-data/a-level/alevel-build/content/gcse-computer-science/papers-ra10/ (edit the parts there, then run build_alevel.py). */

/* ---- 00_head.js ---- */
/* RA10 practice papers for OCR GCSE (9–1) Computer Science (J277), written by RA10 in the exact OCR layout:
   Paper 1 Computer systems (80 marks, 1 h 30, one 8-mark extended response marked *) and Paper 2 Computational
   thinking, algorithms and programming (80 marks, 1 h 30: Section A 50, Section B 30). Organisations are fictional.
   Mark schemes follow OCR's format: 1 mark per point, "…" = linked expansion, // = alternative answers. */
(function () {
  'use strict';
  window.BIZ_PAPERS = window.BIZ_PAPERS || [];
  const AIMN = { A: '1.1 Systems architecture', B: '1.2 Memory and storage', C: '1.3 Computer networks, connections and protocols', D: '1.4 Network security', E: '1.5 Systems software', F: '1.6 Ethical, legal, cultural and environmental impacts', G: '2.1 Algorithms', H: '2.2 Programming fundamentals', I: '2.3 Producing robust programs', J: '2.4 Boolean logic', K: '2.5 Programming languages and IDEs' };
  const TITLES = { 1: 'Paper 1: Computer systems', 2: 'Paper 2: Computational thinking, algorithms and programming' };
  let cur = null;
  const made = [];
  function paper(set, n, setLabel) {
    cur = {
      id: 'ra10-cs-' + set.toLowerCase() + '-p' + n, paper: n, key: 'R' + set + n, series: 'RA10 ' + setLabel,
      date: 'RA10 ' + setLabel + ' · Paper ' + n, title: TITLES[n], source: 'ra10', kind: 'exam', code: 'J277/0' + n,
      spec: 'ra10', total: 80, minutes: 90, badge: 'RA10 practice paper', badgeTone: 'new',
      notice: 'Written by RA10 in the exact OCR J277 layout. Organisations are fictional. Not an OCR paper.',
      items: []
    };
    window.BIZ_PAPERS.push(cur); made.push(cur);
  }
  const p = (x) => ({ t: 'p', x });
  const code = (lines) => ({ t: 'code', x: lines });
  const grid = (head, rows) => ({ t: 'grid', head, rows });
  // Q('3', 'b', marks, aim, text, ms, { sec, ctx: [blocks], qer: true })
  function Q(n, sub, marks, aim, text, ms, o) {
    o = o || {};
    const subs = sub ? sub.split('.') : [];
    cur.items.push({
      q: Number(n), sub: subs.join(''), label: n + subs.map(s => '(' + s + ')').join(''), marks, section: o.sec || 'A', aim, topic: AIMN[aim],
      ctx: [], ctxb: o.ctx || [], text, kind: o.qer ? 'qer' : (cur.paper === 2 && o.sec === 'B' ? 'code' : 'short'),
      ms: { body: ms, pts: !o.qer, levels: o.qer ? ((window.BIZ_LEVELS || {})[8] || null) : null }
    });
  }

/* ---- 01_setA_p1.js ---- */
  /* ======================= SET A · PAPER 1 · Computer systems ======================= */
  paper('A', 1, 'Set A');
  const pix = p('Pixelbrook is a small company that makes video games. It has 25 staff working in one office.');

  Q('1', 'a', 4, 'A', 'Pixelbrook’s computers use CPUs with von Neumann architecture. State the purpose of each of these registers: Program Counter (PC), Memory Address Register (MAR), Memory Data Register (MDR), Accumulator (ACC).',
    '1 mark for each correct purpose:\n• PC: holds the address of the next instruction to be fetched\n• MAR: holds the address of the memory location to be read from / written to\n• MDR: holds the data/instruction fetched from memory / to be written to memory\n• ACC: holds the result of calculations (from the ALU)\nGuidance: Do not accept "stores data" for MAR. Do not accept "next instruction" for PC without the idea of its address.', { ctx: [pix] });
  Q('1', 'b', 3, 'A', 'Describe what happens during the fetch stage of the fetch–execute cycle.',
    '1 mark each to max 3:\n• The address in the PC is copied to the MAR\n• The PC is incremented / increased by 1\n• The instruction at the address in the MAR is fetched from memory/RAM…\n• …and stored in the MDR');
  Q('1', 'c', 2, 'A', 'Pixelbrook is upgrading from 4-core to 8-core CPUs. Explain how this could improve the performance of its computers.',
    '1 mark each:\n• More instructions can be processed at the same time / simultaneously // more tasks run in parallel…\n• …so programs that are designed for multiple cores (eg compiling games, rendering graphics) run faster\nGuidance: Allow 1 mark for recognising that not all programs can use the extra cores.');
  Q('1', 'd', 2, 'A', 'The office coffee machine contains an embedded system. Identify two characteristics of an embedded system.',
    '1 mark each to max 2:\n• Has a dedicated function / does one specific task\n• Small size\n• Low power consumption\n• Low cost\n• Program stored in ROM / firmware rarely changes\n• Limited / no user interface\n• Reliable / real-time');
  Q('1', 'e', 1, 'A', 'State what is meant by the clock speed of a CPU.',
    '• The number of fetch–execute cycles (instructions) the CPU can carry out per second // measured in Hz/GHz');

  Q('2', 'a', 4, 'B', 'Describe two differences between RAM and ROM.',
    '1 mark for each point, max 2 per difference:\n• RAM is volatile // loses its contents when power is off…\n• …ROM is non-volatile // keeps its contents without power\n• RAM can be read and written to…\n• …ROM is read only\n• RAM stores the programs/data currently in use…\n• …ROM stores the start-up instructions / BIOS / bootstrap\nGuidance: Each difference must be comparative (both sides stated or clearly implied).');
  Q('2', 'b', 2, 'B', 'Explain why a computer might use virtual memory when the developers run several large programs at once.',
    '1 mark each:\n• RAM becomes full…\n• …so part of secondary storage is used as temporary RAM / data not currently in use is moved to secondary storage so more programs can run');
  Q('2', 'c', 3, 'B', 'Pixelbrook backs up 4 TB of game files every night to a storage device kept in its office. Recommend a type of secondary storage for the backup and justify your choice.',
    '1 mark for a suitable recommendation, 2 marks for justification linked to the scenario:\n• Magnetic (hard disk drive / magnetic tape)\n• High capacity – can store 4 TB…\n• …at a low cost per gigabyte\n• Portability/durability not important because it stays in the office\nGuidance: Accept solid state if justified by speed of backup and durability, but max 2 if cost/capacity is not considered.');

  Q('3', 'a', 3, 'B', 'Complete the conversions: denary 201 to 8-bit binary; binary 00111100 to denary; hexadecimal 7E to denary.',
    '1 mark each:\n• 201 = 11001001\n• 00111100 = 60\n• 7E = 126', { ctx: [p('Pixelbrook’s programmers often work with binary and hexadecimal numbers.')] });
  Q('3', 'b', 3, 'B', 'Add the 8-bit binary numbers 10110101 and 01101110. Show your working and state whether an overflow error occurs.',
    '1 mark each:\n• Working shown with carries\n• 8-bit result: 00100011\n• Overflow has occurred (the result 291 needs 9 bits / a 1 is carried out of the 8th bit)\nGuidance: Allow 100100011 as the full 9-bit answer if overflow is identified.');
  Q('3', 'c', 2, 'B', 'Show the result of a right binary shift of 3 places on 01101000 and state the effect on its value.',
    '1 mark each:\n• 00001101\n• The value is divided by 8 (104 → 13)');
  Q('3', 'd', 2, 'B', 'A game screenshot is 1,200 pixels wide and 900 pixels high with a colour depth of 16 bits. Calculate the file size in megabytes. Show your working.',
    '1 mark for working, 1 mark for answer:\n• 16 × 1,200 × 900 = 17,280,000 bits (÷ 8 = 2,160,000 bytes)\n• 2.16 MB (accept 2.06 MB using 1,024)');
  Q('3', 'e', 1, 'B', 'A new character set needs to represent 200 different characters. State the minimum number of bits needed for each character.',
    '• 8 bits (2⁷ = 128 is not enough; 2⁸ = 256)');
  Q('3', 'f', 2, 'B', 'Explain the effect of reducing the bit depth of the sound effects in a game.',
    '1 mark each:\n• Fewer bits per sample, so each sample is stored less accurately / quality of playback reduces…\n• …but the file size is smaller');
  Q('3', 'g', 2, 'B', 'Explain why lossy compression is suitable for a game trailer video that will be streamed online.',
    '1 mark each:\n• Lossy gives a much smaller file…\n• …so it streams/downloads faster with less buffering, and the small loss of quality is not noticeable to viewers');

  Q('4', 'a', 4, 'C', 'Describe the role of a switch and of a router in Pixelbrook’s network.',
    '2 marks for switch, 2 marks for router:\n• Switch: connects devices on the LAN…\n• …and sends data only to the device it is addressed to (using MAC addresses)\n• Router: connects the LAN to other networks / the internet…\n• …and forwards packets towards their destination using IP addresses', { ctx: [p('Pixelbrook’s office computers are connected in a Local Area Network (LAN) with a star topology.')] });
  Q('4', 'b', 4, 'C', 'Explain two advantages to Pixelbrook of using a star topology.',
    '1 mark for each advantage + 1 for each linked explanation, max 4:\n• If one cable/computer fails…\n• …only that device is affected, so other staff can keep working\n• The switch sends data only to the intended device…\n• …so there are fewer data collisions and the network performs well\n• Easy to add a new computer…\n• …without disrupting the network');
  Q('4', 'c', 3, 'C', 'State the protocol that would be used for each task: sending an email to a customer; uploading game files to a web server; a customer paying securely on Pixelbrook’s website.',
    '1 mark each:\n• SMTP\n• FTP\n• HTTPS');
  Q('4', 'd', 3, 'C', 'A customer types www.pixelbrook-games.example into a web browser. Describe how DNS is used to display the website.',
    '1 mark each to max 3:\n• The domain name/URL is sent to a Domain Name Server\n• The DNS server looks up the IP address for the domain name (passing the request to another DNS server if not found)\n• The IP address is returned to the browser\n• The browser uses the IP address to request the web page from the web server');

  Q('5', 'a', 4, 'D', 'Some staff have received phishing emails. Describe what phishing is and explain one way Pixelbrook could reduce the risk.',
    '1 mark each:\n• An email/message that pretends to be from a trusted organisation…\n• …to trick the user into giving personal details / passwords or clicking a malicious link\n• Staff training…\n• …so staff recognise suspicious emails and do not click links / give details (also: spam filters, firewall blocking known sites)');
  Q('5', 'b', 2, 'D', 'Explain how penetration testing could help Pixelbrook protect its network.',
    '1 mark each:\n• Someone authorised attacks the system as a hacker would…\n• …to find weaknesses/vulnerabilities so they can be fixed before real attackers use them');
  Q('5', 'c', 3, 'D', 'Pixelbrook’s website has a login form linked to a database. Describe how an SQL injection attack could be carried out and give one way to prevent it.',
    '1 mark each:\n• SQL code is entered into an input box on the website / login form…\n• …which is run by the database because the input is not checked, so the attacker can view/change/delete data or bypass the login\n• Prevention: input validation / sanitisation // parameterised queries // penetration testing');

  Q('6', 'a', 4, 'E', 'Identify the operating system function used for each task: (i) installing a driver for a new graphics tablet; (ii) creating an account for a new employee; (iii) running a game engine and a music player at the same time; (iv) moving a folder of artwork to a new location.',
    '1 mark each:\n• (i) Peripheral management / drivers\n• (ii) User management\n• (iii) Memory management / multitasking\n• (iv) File management');
  Q('6', 'b', 2, 'E', 'Explain why defragmentation software can improve the performance of a computer with a magnetic hard disk.',
    '1 mark each:\n• The parts of each file are moved so they are stored together / free space is grouped…\n• …so the read/write head moves less and files are accessed faster');
  Q('6', 'c', 2, 'E', 'Explain why Pixelbrook should use encryption software on its laptops.',
    '1 mark each:\n• Data is scrambled using a key…\n• …so if a laptop is lost or stolen the data cannot be read');

  Q('7', 'a', 3, 'F', 'Identify the law that has been broken in each situation: (i) an ex-employee copies and sells Pixelbrook’s game code; (ii) someone guesses a manager’s password to access his emails; (iii) Pixelbrook sells customers’ email addresses to another company without permission.',
    '1 mark each:\n• (i) Copyright, Designs and Patents Act 1988\n• (ii) Computer Misuse Act 1990\n• (iii) Data Protection Act 2018');
  Q('7', 'b', 2, 'F', 'Pixelbrook sells its games under a proprietary licence. Describe two features of proprietary software.',
    '1 mark each to max 2:\n• Users do not have access to the source code\n• Users cannot modify/redistribute the software\n• Usually paid for / bought under a licence\n• Supported and updated by the company that owns it');

  Q('8', '', 8, 'F', 'Pixelbrook is planning a new mobile game that uses players’ GPS location to show other players who are nearby.\nDiscuss the impact of this feature.\nIn your answer you might consider:\n• ethical issues\n• legal issues\n• privacy issues\n• cultural issues.',
    'Indicative content (not prescriptive or exhaustive):\nEthical:\n• Encourages people to go outside and meet others / exercise\n• Risk of strangers finding where young players are – safety/safeguarding\n• Should children be able to use the feature? Parental controls\nLegal:\n• Location is personal data – the Data Protection Act 2018 applies: consent, used only for the stated purpose, kept secure, not kept longer than needed\n• Pixelbrook must tell players how the data is used (privacy policy)\nPrivacy:\n• Players may not realise their location is shared; tracking of movements\n• Data could be hacked or sold\n• Option to turn the feature off / show only approximate location\nCultural:\n• Changes how people socialise – online friendships meeting in real life\n• Some communities may see more people gathering in public places\nConclusion:\n• Fun and social, but only acceptable with strong privacy settings, consent and protection for younger players.', { qer: true });

/* ---- 02_setA_p2.js ---- */
  /* ======================= SET A · PAPER 2 · Computational thinking, algorithms and programming ======================= */
  paper('A', 2, 'Set A');

  // ---------------- SECTION A (50 marks) ----------------
  Q('1', 'a', 2, 'G', 'A school is designing a program for its canteen so students can order lunch in advance. Explain how abstraction could be used when designing the program.',
    '1 mark each:\n• Removing unnecessary detail / focusing only on what is needed…\n• …eg the menu items, prices and order times are kept; details such as the colour of the trays or the layout of the kitchen are ignored');
  Q('1', 'b', 2, 'G', 'Describe how decomposition could be used when designing the canteen program.',
    '1 mark each:\n• Breaking the problem into smaller sub-problems…\n• …eg logging in, choosing meals, paying, confirming the order – each can be written and tested separately');
  Q('2', '', 5, 'G', 'Complete a trace table for the algorithm. Show the values of n, total and count and any output.',
    '1 mark each:\n• total and count both set to 0 at the start\n• n takes the values 3, 6, 9\n• total takes the values 3, 9, 18\n• count takes the values 1, 2, 3\n• Output: 6 (accept 6.0)', { ctx: [code(['count = 0', 'total = 0', 'for n = 3 to 9 step 3', '    total = total + n', '    count = count + 1', 'next n', 'print(total / count)'])] });
  Q('3', 'a', 3, 'G', 'Show the first pass of a bubble sort to put the list 7, 3, 9, 2, 5 into ascending order.',
    '1 mark each:\n• 7 and 3 swapped → 3, 7, 9, 2, 5\n• 7 and 9 not swapped; 9 and 2 swapped → 3, 7, 2, 9, 5\n• 9 and 5 swapped → end of first pass: 3, 7, 2, 5, 9');
  Q('3', 'b', 3, 'G', 'Show how a merge sort would put the list 8, 4, 6, 1 into ascending order.',
    '1 mark each:\n• Split into [8, 4] [6, 1] and then [8] [4] [6] [1]\n• Merged into [4, 8] and [1, 6]\n• Merged into [1, 4, 6, 8]');
  Q('3', 'c', 3, 'G', 'Show how a binary search would find the number 31 in the list 4, 9, 15, 22, 31, 40, 52.',
    '1 mark each:\n• The middle item 22 is compared with 31; 31 is bigger so 22 and the items to its left are discarded\n• The middle of 31, 40, 52 is 40; 31 is smaller so 40 and 52 are discarded\n• 31 is compared with 31 – found\nGuidance: Allow a different choice of middle item for an even-sized list if applied consistently.');
  Q('3', 'd', 1, 'G', 'State one advantage of a binary search compared with a linear search.',
    '• Faster / fewer comparisons for large (sorted) lists // halves the data each time');
  Q('4', 'a', 4, 'J', 'Complete the truth table for P = (A OR B) AND NOT C.',
    '1 mark for each two correct rows (rows in order A B C):\n• 000 → 0, 001 → 0\n• 010 → 1, 011 → 0\n• 100 → 1, 101 → 0\n• 110 → 1, 111 → 0', { ctx: [grid(['A', 'B', 'C', 'P'], [['0', '0', '0', ''], ['0', '0', '1', ''], ['0', '1', '0', ''], ['0', '1', '1', ''], ['1', '0', '0', ''], ['1', '0', '1', ''], ['1', '1', '0', ''], ['1', '1', '1', '']])] });
  Q('4', 'b', 2, 'J', 'A heater (H) switches on when the room is cold (C) and the window (W) is not open. Write a Boolean expression for H.',
    '1 mark each:\n• C AND …\n• … NOT W  →  H = C AND NOT W');
  Q('5', 'a', 4, 'I', 'A program asks how many meals to order. It accepts whole numbers from 1 to 20 inclusive. Give one example of each type of test data: normal, boundary, invalid and erroneous.',
    '1 mark each:\n• Normal: any whole number from 2 to 19, eg 7\n• Boundary: 1 or 20 (accept 0 or 21 if described as just outside the boundary and expected to be rejected)\n• Invalid: a whole number outside 1–20, eg 35 or -2\n• Erroneous: data of the wrong type, eg "five" / 3.5');
  Q('5', 'b', 4, 'I', 'Explain two ways the canteen program’s code could be made easier to maintain.',
    '1 mark for each method + 1 for its explanation, max 4:\n• Comments…\n• …explain what each part of the code does, so other programmers can understand it\n• Meaningful variable names…\n• …make clear what data each variable holds\n• Indentation…\n• …shows which code is inside loops/selection\n• Sub programs…\n• …code can be reused and tested/updated separately');
  Q('6', 'a', 4, 'K', 'Describe two differences between a compiler and an interpreter.',
    '1 mark for each point, max 2 per difference:\n• A compiler translates the whole program at once…\n• …an interpreter translates and runs one line at a time\n• A compiler produces an executable file that can be run again without translating…\n• …an interpreter translates the program every time it runs\n• A compiler reports errors after translating the whole program…\n• …an interpreter stops at the first error');
  Q('6', 'b', 4, 'K', 'Describe two tools in an Integrated Development Environment (IDE) that help a programmer find and fix errors.',
    '1 mark for each tool + 1 for its description, max 4:\n• Error messages / error diagnostics…\n• …show the type of error and the line number\n• Breakpoints…\n• …stop the program at a chosen line so values can be checked\n• Stepping…\n• …runs the code one line at a time\n• Variable watch…\n• …shows the values of variables as the program runs\n• Syntax highlighting…\n• …shows keywords in colour so misspellings stand out');
  Q('7', 'a', 4, 'H', 'The canteen stores data about each meal. State the most suitable data type for each field: MealName (eg "Pasta bake"), Price (eg 2.35), Calories (eg 540), Vegetarian (eg True).',
    '1 mark each:\n• MealName: string\n• Price: real / float\n• Calories: integer\n• Vegetarian: Boolean');
  Q('7', 'b', 3, 'H', 'The table Meals has the fields MealName, Price, Calories and Vegetarian. Write an SQL statement to display the MealName and Price of every vegetarian meal.',
    '1 mark each:\n• SELECT MealName, Price\n• FROM Meals\n• WHERE Vegetarian = True\nGuidance: Accept WHERE Vegetarian = "True" / 1 / "Yes". Do not accept SELECT * for the first mark.');
  Q('7', 'c', 2, 'H', 'State the result of 17 MOD 3 and 17 DIV 3.',
    '1 mark each:\n• 17 MOD 3 = 2\n• 17 DIV 3 = 5');

  // ---------------- SECTION B (30 marks) ----------------
  const club = p('Fernhill School runs a running club. A program records each runner’s lap times in seconds.');
  const runners = code(['array runners = ["Asha", "Ben", "Cara", "Dev", "Ella"]']);
  Q('8', 'a.i', 1, 'H', 'The names of the runners are stored in an array. State the value of runners[3].',
    '• "Dev"\nGuidance: Ignore quotation marks.', { sec: 'B', ctx: [club, runners] });
  Q('8', 'a.ii', 3, 'H', 'Write an algorithm that uses a loop to output the name of every runner in the array runners. You must use either OCR Exam Reference Language or a high-level programming language that you have studied.',
    '1 mark each:\n• Uses a loop with the correct number of iterations (0 to 4 // for each item)\n• Accesses runners[i] using the loop variable\n• Outputs each name inside the loop\nExample:\nfor i = 0 to 4\n    print(runners[i])\nnext i\nPython: for name in runners: print(name)', { sec: 'B', ctx: [club, runners] });
  Q('8', 'b', 5, 'H', 'Write a function called avgTime that takes an array of five lap times as a parameter and returns the average lap time. You must use either OCR Exam Reference Language or a high-level programming language that you have studied.',
    '1 mark each:\n• Function defined with the name avgTime and one parameter\n• Total initialised to 0 (or a suitable sum function used)\n• Loop that adds each of the five times to the total\n• Divides the total by 5 (or by the array length)\n• Returns the average (not just printed)\nExample:\nfunction avgTime(times)\n    total = 0\n    for i = 0 to 4\n        total = total + times[i]\n    next i\n    return total / 5\nendfunction', { sec: 'B', ctx: [club] });
  Q('8', 'c', 5, 'I', 'A lap time is valid if it is between 30.0 and 300.0 seconds inclusive. Write an algorithm that asks the user to enter a lap time and keeps asking until a valid time is entered, then outputs "Saved". You must use either OCR Exam Reference Language or a high-level programming language that you have studied.',
    '1 mark each:\n• Takes a lap time as input and casts it to a real/float\n• Uses a condition-controlled loop\n• Correct condition: time < 30.0 OR time > 300.0 (or equivalent)\n• Asks for the time again inside the loop (and/or outputs an error message)\n• Outputs "Saved" after the loop, only once a valid time has been entered\nExample:\nlap = float(input("Enter lap time"))\nwhile lap < 30.0 OR lap > 300.0\n    print("Invalid time")\n    lap = float(input("Enter lap time"))\nendwhile\nprint("Saved")', { sec: 'B', ctx: [club] });
  Q('8', 'd', 4, 'G', 'This algorithm should output the fastest (smallest) of the five lap times stored in the array times. It contains two logic errors. Identify the line number of each logic error and write the corrected line.',
    '1 mark for each line number, 1 mark for each correction:\n• Line 01\n• fastest = times[0]\n• Line 03\n• if times[i] < fastest then', { sec: 'B', ctx: [club, code(['fastest = times[1]', 'for i = 1 to 4', '    if times[i] > fastest then', '        fastest = times[i]', '    endif', 'next i', 'print("Fastest: " + str(fastest))'])] });
  Q('8', 'e', 2, 'H', 'State the output of this algorithm.',
    '1 mark for each correct part:\n• JONES\n• …C (output exactly JONESC)', { sec: 'B', ctx: [club, code(['name = "Cara Jones"', 'initial = name.left(1)', 'surname = name.right(5)', 'print(surname.upper + initial)'])] });
  Q('8', 'f', 4, 'H', 'The lap times for each runner over three laps are stored in a 2D array called results. results[2, 0] is Cara’s first lap time. Write an algorithm to output the total of Cara’s three lap times. You must use either OCR Exam Reference Language or a high-level programming language that you have studied.',
    '1 mark each:\n• Total initialised to 0\n• Loop over the three laps (0 to 2) // three values added\n• Adds results[2, lap] each time (correct row fixed at 2)\n• Outputs the total after the loop\nExample:\ntotal = 0\nfor lap = 0 to 2\n    total = total + results[2, lap]\nnext lap\nprint(total)', { sec: 'B', ctx: [club, p('results[runner, lap] — runner 0 to 4 (in the same order as the array runners), lap 0 to 2.')] });
  Q('8', 'g', 3, 'H', 'Write an algorithm to save all five runners’ names to a new text file called runners.txt, one name per line. You must use either OCR Exam Reference Language or a high-level programming language that you have studied.',
    '1 mark each:\n• Creates/opens the file runners.txt for writing\n• Writes each name (in a loop) // writeLine(runners[i])\n• Closes the file\nExample:\nnewFile("runners.txt")\nmyFile = open("runners.txt")\nfor i = 0 to 4\n    myFile.writeLine(runners[i])\nnext i\nmyFile.close()', { sec: 'B', ctx: [club, runners] });
  Q('8', 'h', 3, 'H', 'The program uses sub programs such as avgTime. Give three benefits of using sub programs.',
    '1 mark each to max 3:\n• Code can be reused / called many times without rewriting it\n• Makes the program shorter / easier to read\n• Each sub program can be tested separately\n• Easier to maintain / update in one place\n• Different programmers can work on different sub programs\n• Can be saved in a library and used in other programs', { sec: 'B', ctx: [club] });

/* ---- 99_tail.js ---- */
  // Self-check: every RA10 paper totals 80; Paper 2 is Section A 50 + Section B 30.
  made.forEach(pp => {
    const total = pp.items.reduce((a, i) => a + i.marks, 0);
    const secB = pp.items.filter(i => i.section === 'B').reduce((a, i) => a + i.marks, 0);
    if (total !== 80 || (pp.paper === 2 && secB !== 30)) console.error('RA10 paper total error', pp.id, total, secB);
  });
})();

