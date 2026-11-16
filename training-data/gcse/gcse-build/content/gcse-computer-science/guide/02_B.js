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
