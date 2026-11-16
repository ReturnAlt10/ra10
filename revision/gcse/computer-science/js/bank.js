/* bank — hand-written RA10 content. Generated from training-data/a-level/alevel-build/content/gcse-computer-science/bank/ (edit the parts there, then run build_alevel.py). */

/* ---- 00_head.js ---- */
/* OCR GCSE (9–1) Computer Science (J277) — knowledge bank, quiz and flashcards. One part per chapter (1.1 … 2.5).
   K = points-marked question in the OCR style (1 mark per creditworthy point, "…" = linked expansion);
   KL = levels-marked 8-mark extended response (Paper 1 QER); M / TF = quiz; F = flashcard.
   Topic strings start with the J277 sub-topic code so Practise-by-topic and Study Hub can group them. */
(function () {
  'use strict';
  const B = BizBank('CS', 'J277');
  window.__BIZ_B = B;
  const { K, M, TF, F } = B;
  const KL = (aim, topic, verb, marks, question, indicative) => B.KL(aim, topic, verb, marks, question, indicative, {
    mark_scheme: {
      instruction: 'OCR levels-based mark scheme for the extended response (*). Decide the band first, then the mark within it. Answers must be applied to the context and cover the areas in the question. Credit any other relevant, accurate points.',
      indicative_content: indicative,
      level_descriptors: (window.BIZ_LEVELS || {})[8]
    }
  });

/* ---- 01_paper1.js ---- */
  /* ===== Paper 1 · Computer systems (1.1 – 1.6) ===== */
  const A1 = '1.1.1 Architecture of the CPU', A2 = '1.1.2 CPU performance', A3 = '1.1.3 Embedded systems';
  K('A', A1, 'State', 1, 'State the purpose of the CPU.', ['To process data and instructions // to carry out the fetch–execute cycle']);
  K('A', A1, 'Describe', 2, 'Describe the purpose of the ALU.', ['Carries out arithmetic operations (eg addition, subtraction)', 'Carries out logical operations / comparisons (eg AND, OR, is A > B) // binary shifts']);
  K('A', A1, 'Describe', 2, 'Describe the purpose of the Control Unit (CU).', ['Decodes instructions', 'Sends control signals to other components // coordinates/controls the fetch–execute cycle // controls the flow of data in the CPU']);
  K('A', A1, 'Describe', 2, 'Describe the purpose of the Memory Address Register (MAR) and the Memory Data Register (MDR).', ['MAR holds the address in memory that is about to be read from or written to', 'MDR holds the data/instruction that has been fetched from memory or is about to be written to memory']);
  K('A', A1, 'State', 1, 'State what is stored in the Program Counter.', ['The address of the next instruction to be fetched']);
  K('A', A1, 'Describe', 3, 'Describe what happens during the fetch stage of the fetch–execute cycle.', ['The address in the Program Counter is copied to the MAR', 'The Program Counter is incremented (to point to the next instruction)', 'The instruction stored at that address is fetched from memory/RAM and stored in the MDR']);
  K('A', A1, 'Explain', 2, 'Explain the purpose of cache in a CPU.', ['Cache stores frequently used data/instructions…', '…so the CPU can access them more quickly than fetching them from RAM']);
  K('A', A1, 'Describe', 2, 'Describe the main feature of von Neumann architecture.', ['Instructions and data are stored together in the same memory (stored program concept)', 'The CPU fetches instructions from memory and executes them one at a time / in sequence']);
  K('A', A2, 'Explain', 2, 'Explain how increasing the clock speed of a CPU can improve its performance.', ['More fetch–execute cycles are completed per second…', '…so more instructions are processed each second / programs run faster']);
  K('A', A2, 'Explain', 2, 'Explain why doubling the number of cores does not always double the performance of a computer.', ['Some programs/tasks cannot be split up to run in parallel // software may not be written to use multiple cores', 'Cores have to communicate/share resources (eg cache, memory), which takes time']);
  K('A', A2, 'Explain', 2, 'Explain how a larger cache can improve CPU performance.', ['More frequently used data/instructions can be stored in the cache…', '…so the CPU needs to fetch from slower RAM less often']);
  K('A', A2, 'State', 3, 'State three characteristics of a CPU that affect its performance.', ['Clock speed', 'Number of cores', 'Cache size']);
  K('A', A3, 'Define', 1, 'Define the term embedded system.', ['A computer system built into a larger device, designed to carry out a dedicated / specific function']);
  K('A', A3, 'Identify', 2, 'Identify two characteristics of embedded systems.', ['Dedicated (single) function', 'Small size / low cost / low power consumption / program stored in ROM / limited (or no) user interface / reliable / real-time']);
  K('A', A3, 'Give', 3, 'Give three examples of devices that contain embedded systems.', ['Washing machine', 'Microwave / dishwasher / traffic lights', 'Car engine management system / sat nav / digital camera / smart thermostat']);

  M('A', A1, 'Which register holds the address of the next instruction to be fetched?', 'Program Counter', ['Memory Data Register', 'Accumulator', 'Memory Address Register'], 'The Program Counter (PC) holds the address of the next instruction; it is incremented after each fetch.');
  M('A', A1, 'Which part of the CPU decodes instructions?', 'Control Unit', ['ALU', 'Cache', 'MDR'], 'The Control Unit decodes instructions and sends control signals.');
  M('A', A1, 'Where is the result of a calculation by the ALU stored?', 'Accumulator', ['Program Counter', 'MAR', 'ROM'], 'The accumulator holds the results of calculations.');
  TF('A', A1, 'The MDR holds memory addresses.', false, 'The MAR holds addresses; the MDR holds data or instructions.');
  TF('A', A1, 'In von Neumann architecture, instructions and data are stored in the same memory.', true, 'This is the stored program concept.');
  M('A', A2, 'A CPU with a clock speed of 3 GHz carries out…', '3 billion cycles per second', ['3 million cycles per second', '3 thousand cycles per second', '3 cycles every billion seconds'], 'Giga = billion (10⁹). 3 GHz = 3 billion fetch–execute cycles per second.');
  TF('A', A2, 'A quad-core CPU always runs every program four times faster than a single-core CPU.', false, 'Only tasks that can be split into parallel parts benefit; cores also share resources.');
  M('A', A3, 'Which device is most likely to contain an embedded system?', 'A microwave oven', ['A desktop PC', 'A laptop', 'A games console used to browse the web'], 'An embedded system has a dedicated function inside a larger device.');

  F('A', 'CPU', 'Central Processing Unit: processes data and instructions using the fetch–decode–execute cycle.', A1);
  F('A', 'ALU', 'Arithmetic Logic Unit: does calculations, logical comparisons and binary shifts.', A1);
  F('A', 'Control Unit', 'Decodes instructions and sends control signals; manages the fetch–execute cycle.', A1);
  F('A', 'Program Counter', 'Register holding the address of the next instruction to be fetched.', A1);
  F('A', 'MAR', 'Memory Address Register: holds the address about to be read from or written to.', A1);
  F('A', 'MDR', 'Memory Data Register: holds the data/instruction just fetched from or about to be written to memory.', A1);
  F('A', 'Accumulator', 'Register holding the results of calculations done by the ALU.', A1);
  F('A', 'Cache', 'Small, very fast memory in/near the CPU that stores frequently used data and instructions.', A1);
  F('A', 'Von Neumann architecture', 'Stored program concept: instructions and data share the same memory; the CPU fetches and executes instructions in sequence.', A1);
  F('A', 'Clock speed', 'Number of fetch–execute cycles per second (Hz). 3 GHz = 3 billion per second.', A2);
  F('A', 'Core', 'An independent processing unit in a CPU; more cores can process more instructions at the same time.', A2);
  F('A', 'Embedded system', 'A computer system inside a larger device with a dedicated function, eg a washing machine.', A3);

  const B1 = '1.2.1 Primary storage', B2 = '1.2.2 Secondary storage', B3 = '1.2.3 Units', B4 = '1.2.4 Data storage', B5 = '1.2.5 Compression';
  K('B', B1, 'Describe', 4, 'Describe two differences between RAM and ROM.', ['RAM is volatile // loses its contents when the power is off…', '…ROM is non-volatile // keeps its contents without power', 'RAM can be read from and written to…', '…ROM is read only // contents cannot normally be changed', 'RAM stores the programs/data currently in use; ROM stores the start-up instructions (BIOS / bootstrap)']);
  K('B', B1, 'State', 1, 'State what is stored in ROM.', ['The start-up instructions / BIOS / bootstrap loader']);
  K('B', B1, 'Explain', 2, 'Explain why a computer needs primary storage.', ['To store the data and instructions that the CPU is currently using…', '…because it can be accessed much faster than secondary storage, so the CPU is not kept waiting']);
  K('B', B1, 'Describe', 3, 'Describe how virtual memory is used when RAM is full.', ['Part of secondary storage is used as (temporary) RAM', 'Data/programs not currently in use are moved from RAM to virtual memory', 'When they are needed again they are moved back (swapped) into RAM']);
  K('B', B1, 'Explain', 2, 'Explain why using virtual memory can make a computer run slowly.', ['Secondary storage is much slower to access than RAM…', '…and data must be repeatedly swapped between RAM and secondary storage (disk thrashing)']);
  K('B', B2, 'Explain', 2, 'Explain why computers need secondary storage.', ['RAM is volatile // primary storage loses data when the power is off…', '…so secondary storage is needed to store data/programs permanently / long-term (non-volatile)']);
  K('B', B2, 'Identify', 3, 'Identify the three types of secondary storage and give one example of each.', ['Magnetic, eg hard disk drive / magnetic tape', 'Optical, eg CD / DVD / Blu-ray', 'Solid state, eg SSD / USB flash drive / SD card']);
  K('B', B2, 'Justify', 3, 'A delivery driver needs a portable storage device to take files between offices. Recommend a type of storage and justify your choice.', ['Solid state (eg USB flash drive)', 'Durable – no moving parts, so not damaged if dropped in the van', 'Portable – small and light // fast to read/write // enough capacity for documents']);
  K('B', B2, 'Describe', 2, 'Describe one advantage and one disadvantage of using a magnetic hard disk drive compared with a solid state drive.', ['Advantage: lower cost per gigabyte // high capacity for the price', 'Disadvantage: slower access speed // less durable because it has moving parts // heavier / uses more power']);
  K('B', B3, 'State', 2, 'State how many bits are in a nibble and how many bits are in a byte.', ['A nibble = 4 bits', 'A byte = 8 bits']);
  K('B', B3, 'Calculate', 2, 'An image is 1,000 pixels wide and 800 pixels high with a colour depth of 24 bits. Calculate the file size in megabytes. Show your working.', ['24 × 1,000 × 800 = 19,200,000 bits', '÷ 8 = 2,400,000 bytes = 2.4 MB (accept 2.29 MB using 1,024)']);
  K('B', B3, 'Calculate', 2, 'A sound is recorded at 44,100 Hz with a bit depth of 16 bits for 60 seconds. Calculate the file size in megabytes. Show your working.', ['44,100 × 60 × 16 = 42,336,000 bits', '÷ 8 = 5,292,000 bytes = 5.292 MB (accept 5.05 MB using 1,024)']);
  K('B', B3, 'Calculate', 2, 'A text file contains 2,000 characters, each stored using 8 bits. Calculate the file size in kilobytes.', ['8 × 2,000 = 16,000 bits', '÷ 8 = 2,000 bytes = 2 KB (accept 1.95 KB using 1,024)']);
  K('B', B3, 'Explain', 2, 'Explain why data must be converted to binary to be processed by a computer.', ['Computers are made of (billions of) switches/transistors that can only be on or off…', '…which represent 1 and 0, so all data must be stored as binary']);
  K('B', B4, 'Convert', 2, 'Convert the denary number 182 into 8-bit binary and into hexadecimal.', ['10110110', 'B6']);
  K('B', B4, 'Convert', 2, 'Convert the hexadecimal number 2D into denary and into 8-bit binary.', ['45', '00101101']);
  K('B', B4, 'Describe', 3, 'Describe how to convert a 2-digit hexadecimal number into denary. Use an example.', ['Convert each hex digit to denary (A=10 … F=15)', 'Multiply the first (left) digit by 16 and add the second digit', 'Correct example, eg 2D = 2 × 16 + 13 = 45']);
  K('B', B4, 'Add', 2, 'Add the binary numbers 01101011 and 00001111. Show your working.', ['Working shown with carries', '01111010']);
  K('B', B4, 'Explain', 2, 'Explain what is meant by an overflow error in binary addition.', ['The result of the addition is too large to be stored in the number of bits available (eg needs a 9th bit in an 8-bit register)…', '…so the extra bit is lost and the stored result is incorrect']);
  K('B', B4, 'Describe', 2, 'Describe the effect of a left binary shift of 2 places on an 8-bit binary number.', ['Each bit moves two places to the left and 0s fill the right // the number is multiplied by 4', 'Bits shifted off the left are lost, which may cause an incorrect result (overflow)']);
  K('B', B4, 'Explain', 2, 'Explain why hexadecimal is often used instead of binary by programmers.', ['Hexadecimal is shorter / uses fewer digits than binary…', '…so it is easier for humans to read, remember and write with fewer errors (it is still stored as binary)']);
  K('B', B4, 'State', 1, 'State the minimum number of bits needed to represent 150 different characters in a character set.', ['8 bits (2⁷ = 128 is too few; 2⁸ = 256)']);
  K('B', B4, 'Explain', 2, 'Explain one difference between ASCII and Unicode.', ['Unicode uses more bits per character than ASCII…', '…so it can represent many more characters (eg other alphabets, emoji), but files take more storage']);
  K('B', B4, 'Explain', 2, 'Explain the effect of increasing the colour depth of an image.', ['More bits per pixel, so more colours can be represented // better quality / more realistic', 'The file size increases']);
  K('B', B4, 'Define', 1, 'Define the term metadata in relation to an image file.', ['Data about the image / additional information stored with the image, eg width, height, colour depth, date taken']);
  K('B', B4, 'Describe', 3, 'Describe how sound is sampled and stored by a computer.', ['The amplitude/height of the analogue sound wave is measured…', '…at regular intervals (the sample rate)', 'Each sample is stored as a binary number using a set number of bits (the bit depth)']);
  K('B', B5, 'Describe', 2, 'Describe the difference between lossy and lossless compression.', ['Lossy permanently removes some data and the original cannot be restored', 'Lossless reduces the file size without losing any data; the original can be restored exactly']);
  K('B', B5, 'Explain', 2, 'Explain why lossy compression would not be suitable for a spreadsheet file.', ['Data would be permanently lost / changed…', '…so values in the spreadsheet would be wrong / the file may not open correctly']);
  K('B', B5, 'Give', 2, 'Give two reasons why files are compressed.', ['To reduce the storage space they need', 'To transfer/download/stream them more quickly // to fit email attachment limits // use less bandwidth']);

  M('B', B1, 'Which statement about RAM is correct?', 'It is volatile', ['It stores the BIOS permanently', 'It is a type of secondary storage', 'It is read only'], 'RAM loses its contents when the power is turned off.');
  M('B', B1, 'Virtual memory is…', 'part of secondary storage used as extra RAM', ['a very fast memory inside the CPU', 'memory that stores the start-up instructions', 'a type of cloud storage service'], 'When RAM is full, part of the SSD/HDD is used as virtual memory.');
  TF('B', B1, 'ROM is non-volatile.', true, 'ROM keeps its contents without power.');
  M('B', B2, 'Which storage type has no moving parts?', 'Solid state', ['Magnetic', 'Optical', 'Magnetic tape'], 'Solid state storage uses flash memory chips, so it is durable.');
  M('B', B2, 'Which is an example of optical storage?', 'Blu-ray disc', ['USB flash drive', 'Hard disk drive', 'SD card'], 'Optical discs (CD, DVD, Blu-ray) are read by a laser.');
  M('B', B3, 'How many bits are in a nibble?', '4', ['8', '2', '16'], 'A nibble is 4 bits; a byte is 8 bits.');
  M('B', B3, 'Which formula gives the file size of an image in bits?', 'colour depth × height × width', ['sample rate × duration × bit depth', 'bits per character × characters', 'height × width ÷ colour depth'], 'Image file size = colour depth × image height × image width.');
  M('B', B3, 'Which is the largest unit?', 'Petabyte', ['Terabyte', 'Gigabyte', 'Megabyte'], 'bit < nibble < byte < KB < MB < GB < TB < PB.');
  M('B', B4, 'What is 00011110 in denary?', '30', ['15', '60', '28'], '16 + 8 + 4 + 2 = 30.');
  M('B', B4, 'What is the denary number 105 in 8-bit binary?', '01101001', ['01101010', '10010110', '01100101'], '64 + 32 + 8 + 1 = 105.');
  M('B', B4, 'What is the hexadecimal number F3 in denary?', '243', ['153', '213', '253'], 'F = 15. 15 × 16 + 3 = 243.');
  M('B', B4, 'A left shift of 1 place on a binary number…', 'multiplies it by 2', ['divides it by 2', 'adds 1 to it', 'reverses its bits'], 'Each left shift doubles the value (if no 1s are lost).');
  M('B', B4, 'How many different colours can a colour depth of 7 bits represent?', '128', ['64', '256', '49'], '2⁷ = 128.');
  M('B', B4, 'What is the largest denary number an 8-bit binary number can represent?', '255', ['256', '128', '127'], '11111111 = 255 (2⁸ − 1).');
  TF('B', B4, 'If the character code for "A" is 65, the code for "C" is 67.', true, 'Character sets are logically ordered.');
  TF('B', B4, 'Increasing the sample rate of a sound file decreases its file size.', false, 'More samples per second means more data, so a bigger file.');
  M('B', B5, 'Which file type should use lossless compression?', 'A program’s source code', ['A photo to post online', 'A song to stream', 'A video for a website'], 'Program code must be restored exactly or it will not work.');

  F('B', 'RAM', 'Volatile, read/write main memory holding the OS, programs and data currently in use.', B1);
  F('B', 'ROM', 'Non-volatile, read-only memory holding the start-up instructions (BIOS).', B1);
  F('B', 'Virtual memory', 'Part of secondary storage used as RAM when RAM is full; slower than RAM.', B1);
  F('B', 'Secondary storage', 'Non-volatile storage that keeps data permanently: magnetic, optical, solid state.', B2);
  F('B', 'Durability / reliability', 'Durability: survives physical damage. Reliability: keeps working correctly over time.', B2);
  F('B', 'Sound file size', 'sample rate (Hz) × duration (s) × bit depth = bits', B3);
  F('B', 'Image file size', 'colour depth × height (px) × width (px) = bits', B3);
  F('B', 'Text file size', 'bits per character × number of characters = bits', B3);
  F('B', 'Overflow error', 'When a result needs more bits than are available, so the extra bit is lost and the result is wrong.', B4);
  F('B', 'Most significant bit', 'The leftmost bit — it has the largest place value.', B4);
  F('B', 'Character set', 'A defined list of characters a computer can represent, each with a unique binary code (eg ASCII, Unicode).', B4);
  F('B', 'Colour depth', 'The number of bits used per pixel; n bits → 2ⁿ colours.', B4);
  F('B', 'Resolution', 'The number of pixels in an image (width × height).', B4);
  F('B', 'Sample rate', 'Number of samples of a sound taken per second, in hertz (Hz).', B4);
  F('B', 'Bit depth', 'Number of bits used to store each sound sample.', B4);
  F('B', 'Lossy compression', 'Permanently removes some data to make a much smaller file; cannot be restored exactly.', B5);
  F('B', 'Lossless compression', 'Reduces file size without losing data; the original can be restored exactly.', B5);

  const C1 = '1.3.1 Networks and topologies', C2 = '1.3.2 Wired and wireless networks, protocols and layers';
  K('C', C1, 'Describe', 2, 'Describe the difference between a LAN and a WAN.', ['A LAN covers a small geographical area (eg one building/site)…', '…a WAN covers a large geographical area (eg countries) // WAN hardware/connections are usually leased from telecoms companies']);
  K('C', C1, 'Describe', 2, 'Describe the role of a switch in a LAN.', ['Connects devices together on a LAN', 'Receives data and sends it only to the device it is addressed to (using its MAC address)']);
  K('C', C1, 'Describe', 2, 'Describe the role of a router.', ['Connects different networks together (eg a LAN to the internet)', 'Forwards/directs data packets towards their destination using IP addresses']);
  K('C', C1, 'State', 1, 'State the purpose of a Network Interface Controller (NIC).', ['Allows a device to connect to a network (wired or wireless)']);
  K('C', C1, 'Explain', 4, 'Explain two factors that can affect the performance of a network.', ['Bandwidth…', '…the more data that can be sent per second, the faster transfers are', 'Number of devices/users…', '…more devices share the bandwidth and cause more collisions, so it slows down (also: transmission media, interference, amount of traffic)']);
  K('C', C1, 'Describe', 4, 'Describe the differences between a client–server network and a peer-to-peer network.', ['Client–server has a central server that provides services/resources (eg file storage, logins, backups)…', '…clients request services from the server', 'Peer-to-peer has no central server…', '…all computers are equal and share resources directly with each other']);
  K('C', C1, 'Explain', 3, 'Explain the role of DNS when a user types a URL into a web browser.', ['The domain name/URL is sent to a Domain Name Server', 'The DNS server looks up the matching IP address (passing the request to another DNS server if it is not found)', 'The IP address is returned to the browser, which uses it to request the web page from the web server']);
  K('C', C1, 'Describe', 4, 'Describe two advantages and two disadvantages of storing files in the Cloud.', ['Advantage: files can be accessed from any device with an internet connection', 'Advantage: easy to share/collaborate // storage can be increased easily // provider handles backups and security', 'Disadvantage: needs an internet connection to access files', 'Disadvantage: relies on a third party for security/privacy // ongoing cost // provider could fail or close']);
  K('C', C1, 'Explain', 4, 'Explain one advantage and one disadvantage of a star topology.', ['Advantage: if one cable/device fails, only that device is affected…', '…the rest of the network keeps working', 'Disadvantage: if the central switch fails…', '…the whole network fails // lots of cable needed, which can be expensive']);
  K('C', C1, 'Explain', 2, 'Explain why a mesh topology is reliable.', ['Devices have many connections / routes between them…', '…so if one connection fails, data can be sent by another route (no single point of failure)']);
  K('C', C2, 'Explain', 4, 'Explain two benefits of using wired rather than wireless connections in a network.', ['Faster / more consistent data transfer…', '…because it is less affected by interference or distance', 'More secure…', '…because a physical connection is needed to access the network / data cannot be intercepted from a distance']);
  K('C', C2, 'Explain', 2, 'Explain one benefit of a wireless connection.', ['Users can move around / use mobile devices…', '…while staying connected, without cables // easier/cheaper to add new devices']);
  K('C', C2, 'Describe', 2, 'Describe the purpose of encryption when data is sent across a network.', ['Data is scrambled using a key…', '…so if it is intercepted it cannot be understood without the key']);
  K('C', C2, 'Give', 2, 'Give one valid example of an IPv4 address and one valid example of an IPv6 address.', ['IPv4: four numbers 0–255 separated by full stops, eg 192.168.0.15', 'IPv6: eight groups of four hexadecimal digits separated by colons, eg 2001:0db8:85a3:0000:0000:8a2e:0370:7334']);
  K('C', C2, 'Describe', 2, 'Describe the format of a MAC address.', ['48 bits // 6 pairs of hexadecimal digits', 'Separated by colons or hyphens, eg 4A:1F:09:C2:7E:30']);
  K('C', C2, 'Define', 1, 'Define the term protocol.', ['A set of rules for how data is transferred / communicated between devices']);
  K('C', C2, 'Explain', 2, 'Explain why standards are important in computing.', ['They provide agreed rules…', '…so that hardware and software from different manufacturers can work together']);
  K('C', C2, 'State', 3, 'State the purpose of SMTP, IMAP and FTP.', ['SMTP: sending email (to/between mail servers)', 'IMAP: retrieving/accessing email, keeping it on the server', 'FTP: transferring files between devices over a network']);
  K('C', C2, 'Describe', 3, 'Describe the benefits of using layers in network protocols.', ['Each layer has a specific job / breaks a complex problem into smaller parts', 'One layer can be changed/updated without affecting the others', 'Different manufacturers can make hardware/software for one layer that works with the others // easier to develop and test']);

  M('C', C1, 'Which device connects a LAN to the internet?', 'Router', ['Switch', 'NIC', 'Wireless access point'], 'A router connects different networks and routes packets using IP addresses.');
  M('C', C1, 'What does DNS do?', 'Converts a domain name into an IP address', ['Encrypts data sent to web servers', 'Assigns MAC addresses to devices', 'Stores web pages for websites'], 'DNS = Domain Name Service, made of many Domain Name Servers.');
  M('C', C1, 'In a star topology, what happens if the central switch fails?', 'The whole network stops working', ['Only one computer is affected', 'Data takes another route', 'The network gets faster'], 'The switch is a single point of failure.');
  TF('C', C1, 'The internet is a worldwide collection of computer networks.', true, 'It is a network of networks — the largest WAN.');
  TF('C', C1, 'In a peer-to-peer network, a central server stores all the files.', false, 'Peer-to-peer has no central server; each peer stores and shares its own files.');
  M('C', C2, 'Which protocol is used to send email?', 'SMTP', ['IMAP', 'POP', 'HTTP'], 'Simple Mail Transfer Protocol sends email; POP and IMAP retrieve it.');
  M('C', C2, 'Which of these is a valid IPv4 address?', '172.16.254.1', ['256.10.4.1', '192.168.1', '4A:1F:09:C2:7E:30'], 'Each of the four numbers must be 0–255; the last option is a MAC address.');
  M('C', C2, 'Which protocol encrypts data sent between a browser and a web server?', 'HTTPS', ['HTTP', 'FTP', 'POP'], 'HTTPS is HTTP Secure — the data is encrypted.');
  TF('C', C2, 'A MAC address is usually written as 6 pairs of hexadecimal digits.', true, 'It is 48 bits, eg 4A:1F:09:C2:7E:30.');

  F('C', 'LAN', 'Local Area Network: covers a small geographical area, eg a school.', C1);
  F('C', 'WAN', 'Wide Area Network: covers a large geographical area, eg the internet.', C1);
  F('C', 'Switch', 'Connects devices on a LAN; sends data only to the device it is addressed to.', C1);
  F('C', 'Router', 'Connects networks together and routes packets using IP addresses.', C1);
  F('C', 'Wireless access point', 'Lets wireless devices connect to a wired network.', C1);
  F('C', 'DNS', 'Domain Name Service: converts domain names/URLs into IP addresses.', C1);
  F('C', 'The Cloud', 'Remote servers providing storage, software or processing over the internet.', C1);
  F('C', 'Bandwidth', 'The amount of data that can be transferred per second.', C1);
  F('C', 'Protocol', 'A set of rules for transferring data between devices.', C2);
  F('C', 'TCP/IP', 'TCP splits data into packets and checks they arrive; IP addresses and routes them.', C2);
  F('C', 'HTTP / HTTPS', 'Request and send web pages; HTTPS encrypts the data.', C2);
  F('C', 'POP / IMAP / SMTP', 'POP downloads email; IMAP keeps it on the server; SMTP sends email.', C2);
  F('C', 'MAC address', 'A unique, permanent 48-bit address for a network interface card.', C2);

  const D1 = '1.4.1 Threats to computer systems and networks', D2 = '1.4.2 Identifying and preventing vulnerabilities';
  K('D', D1, 'Describe', 2, 'Describe what is meant by malware. Give one example.', ['Malicious software installed without the user’s knowledge/permission that is designed to harm a computer / steal data', 'Example: virus / worm / trojan / spyware / ransomware']);
  K('D', D1, 'Describe', 2, 'Describe how ransomware affects a computer system.', ['It encrypts the user’s files so they cannot be accessed…', '…and demands payment for the key to decrypt them']);
  K('D', D1, 'Describe', 2, 'Describe what is meant by social engineering.', ['Tricking/manipulating people into giving away information or access…', '…eg phishing emails, pretending to be IT support; people are the weak point']);
  K('D', D1, 'Describe', 2, 'Describe how a brute-force attack is carried out.', ['Software tries every possible combination of passwords (trial and error)…', '…until the correct one is found, giving unauthorised access']);
  K('D', D1, 'Explain', 2, 'Explain the purpose of a denial of service attack.', ['A server/network is flooded with requests…', '…so it cannot respond and the service is unavailable to genuine users']);
  K('D', D1, 'Describe', 2, 'Describe how SQL injection is used to attack a database.', ['SQL code is typed into an input box on a website (eg a login form)…', '…which is run by the database because the input is not validated, letting the attacker view/change/delete data or bypass the login']);
  K('D', D2, 'Describe', 2, 'Describe the purpose of penetration testing.', ['People are employed to attack the organisation’s own system (as a hacker would)…', '…to find weaknesses/vulnerabilities so they can be fixed']);
  K('D', D2, 'Explain', 2, 'Explain how user access levels help to keep data secure.', ['Each user can only access the files/functions they need for their role…', '…so the damage from a mistake or a compromised account is limited']);
  K('D', D2, 'Explain', 2, 'Explain how encryption protects data that is intercepted.', ['Data is scrambled using a key…', '…so an attacker cannot understand it without the decryption key']);
  K('D', D2, 'Describe', 4, 'Describe two methods a company could use to protect its network from malware.', ['Anti-malware software…', '…scans files and removes/quarantines malware; keep it updated', 'Firewall…', '…blocks unauthorised traffic entering the network (also: staff training not to open suspicious attachments, user access levels)']);
  K('D', D2, 'Identify', 2, 'Identify two methods of physical security.', ['Locks / key cards / swipe cards', 'CCTV / biometrics / security guards / locked server rooms']);

  M('D', D1, 'An email pretending to be from a bank asks you to “confirm your password”. This is…', 'phishing', ['a brute-force attack', 'a denial of service attack', 'SQL injection'], 'Phishing is a form of social engineering.');
  M('D', D1, 'Which type of malware copies itself across a network without user action?', 'Worm', ['Trojan', 'Spyware', 'Adware'], 'Worms self-replicate across networks.');
  M('D', D1, 'Which attack floods a server with requests so it cannot respond?', 'Denial of service', ['Phishing', 'Brute force', 'Data interception'], 'DoS attacks make a service unavailable.');
  TF('D', D1, 'SQL injection involves typing SQL code into a website’s input box.', true, 'Unvalidated input lets the code run against the database.');
  M('D', D2, 'Which method best protects intercepted data?', 'Encryption', ['A firewall', 'Penetration testing', 'Physical security'], 'Encrypted data is meaningless without the key.');
  M('D', D2, 'Locking an account after three failed login attempts mainly prevents…', 'brute-force attacks', ['phishing emails', 'data interception', 'denial of service'], 'The attacker cannot keep guessing.');
  TF('D', D2, 'A firewall can stop staff from being tricked by phishing emails.', false, 'Firewalls filter network traffic; staff training reduces social engineering.');

  F('D', 'Malware', 'Malicious software designed to harm a computer or steal data (virus, worm, trojan, spyware, ransomware).', D1);
  F('D', 'Phishing', 'Fake emails/websites that trick users into giving personal details.', D1);
  F('D', 'Brute-force attack', 'Trying every possible password combination until one works.', D1);
  F('D', 'Denial of service', 'Flooding a server with requests so it is unavailable to genuine users.', D1);
  F('D', 'SQL injection', 'Entering SQL code into an input box so it runs against the database.', D1);
  F('D', 'Penetration testing', 'Authorised attacks on your own system to find and fix weaknesses.', D2);
  F('D', 'Firewall', 'Monitors and blocks network traffic that does not meet set rules.', D2);
  F('D', 'User access levels', 'Restricting what each user can see or change.', D2);

  const E1 = '1.5.1 Operating systems', E2 = '1.5.2 Utility software';
  K('E', E1, 'Describe', 2, 'Describe how an operating system provides memory management.', ['Allocates memory/RAM to each running program', 'Keeps programs separate so they do not overwrite each other // frees memory when programs close // moves data to virtual memory when RAM is full']);
  K('E', E1, 'Explain', 2, 'Explain how an operating system allows multitasking.', ['It switches the CPU between programs very quickly / shares processor time…', '…and allocates memory to each, so several programs appear to run at the same time']);
  K('E', E1, 'Describe', 2, 'Describe the purpose of a device driver.', ['Software that lets the operating system communicate with a hardware device / peripheral…', '…by translating the OS’s instructions into commands the device understands']);
  K('E', E1, 'Describe', 3, 'Describe three features of user management provided by an operating system.', ['Creating/deleting user accounts', 'Logins with usernames and passwords', 'Setting access rights / permissions for each user // keeping users’ files separate']);
  K('E', E1, 'Describe', 3, 'Describe three features of file management provided by an operating system.', ['Naming/renaming files', 'Organising files into folders / a hierarchy', 'Moving, copying, saving and deleting files // controlling access to files']);
  K('E', E1, 'Describe', 2, 'Describe one feature of a graphical user interface (GUI).', ['Uses windows, icons, menus and a pointer (WIMP)…', '…so users can interact by clicking rather than typing commands; easy to learn']);
  K('E', E2, 'Explain', 3, 'Explain how defragmentation improves the performance of a magnetic hard disk.', ['Files become fragmented / split into parts stored in different places on the disk', 'Defragmentation moves the parts of each file together (and groups free space)', 'So the read/write head moves less and files are accessed faster']);
  K('E', E2, 'State', 1, 'State the purpose of encryption software.', ['To scramble data so it cannot be understood without the key (keeping it secure if stolen/intercepted)']);
  K('E', E2, 'Explain', 2, 'Explain why utility software is needed.', ['To perform housekeeping/maintenance tasks…', '…that the operating system does not carry out, keeping the computer running efficiently and data secure']);

  M('E', E1, 'Which OS function lets a new printer work with the computer?', 'Peripheral management and drivers', ['File management', 'User management', 'Memory management'], 'A driver lets the OS communicate with the printer.');
  M('E', E1, 'Creating a new account for a new member of staff is an example of…', 'user management', ['file management', 'peripheral management', 'multitasking'], 'User management handles accounts and access rights.');
  TF('E', E1, 'The operating system allocates RAM to running programs.', true, 'This is memory management.');
  M('E', E2, 'Which utility moves the parts of each file together on a hard disk?', 'Defragmentation', ['Compression', 'Encryption', 'Anti-malware'], 'Defragmentation speeds up file access on magnetic disks.');
  TF('E', E2, 'Solid state drives benefit from regular defragmentation.', false, 'SSDs have no moving parts; defragmenting them is unnecessary and adds wear.');

  F('E', 'Operating system', 'Manages hardware and software and provides a user interface.', E1);
  F('E', 'Multitasking', 'Running several programs “at once” by switching the CPU between them.', E1);
  F('E', 'Device driver', 'Software that lets the OS communicate with a specific hardware device.', E1);
  F('E', 'Utility software', 'Software that performs housekeeping tasks, eg defragmentation, compression, encryption.', E2);
  F('E', 'Defragmentation', 'Reorganising a hard disk so each file’s parts are stored together, speeding up access.', E2);

  const F1 = '1.6.1 Ethical, legal, cultural and environmental impact';
  K('F', F1, 'Describe', 2, 'Describe what the Computer Misuse Act 1990 makes illegal.', ['Unauthorised access to computer material (hacking)', 'Unauthorised access with intent to commit further crimes // unauthorised acts to impair a computer, eg spreading malware']);
  K('F', F1, 'Describe', 3, 'Describe three principles of the Data Protection Act 2018.', ['Data must be used fairly, lawfully and transparently', 'Used only for specified, explicit purposes // adequate, relevant and limited to what is needed', 'Accurate and kept up to date // kept no longer than necessary // kept secure']);
  K('F', F1, 'Explain', 2, 'Explain how the Copyright, Designs and Patents Act 1988 protects software developers.', ['It makes it illegal to copy, distribute or modify software without permission…', '…so developers can earn money from their work / it cannot be pirated']);
  K('F', F1, 'Describe', 4, 'Describe two features of open source software and two features of proprietary software.', ['Open source: the source code is available to users', 'Open source: users can modify and redistribute it / usually free', 'Proprietary: no access to the source code / cannot be modified', 'Proprietary: usually paid for / licensed; comes with support and updates']);
  K('F', F1, 'Explain', 2, 'Explain one environmental impact of people regularly replacing their smartphones.', ['Old phones become e-waste / contain toxic materials…', '…which can pollute land and water if not recycled // mining raw materials and manufacturing uses energy and resources']);
  K('F', F1, 'Explain', 2, 'Explain what is meant by the digital divide.', ['The gap between people who have access to digital technology/the internet (and the skills to use it) and those who do not…', '…which can disadvantage people, eg in education, jobs and access to services']);
  KL('F', F1, 'Discuss', 8, 'A city council is planning to install facial-recognition cameras in its shopping centre to identify known shoplifters. Discuss the impact of this decision. In your answer you might consider: ethical issues · legal issues · privacy issues · cultural issues.', [
    'Ethical: may reduce crime and make shoppers feel safer; but innocent people may be wrongly identified (false matches), possibly affecting some groups more than others; is constant surveillance fair?',
    'Legal: images are personal data, so the Data Protection Act 2018 applies — data must be processed lawfully, kept secure, used only for the stated purpose and not kept longer than necessary; signs must tell people they are being recorded.',
    'Privacy: people are monitored without giving consent; data could be shared or hacked; people may feel watched all the time.',
    'Cultural: may change how people behave in public; some may avoid the centre; normalises surveillance in society.',
    'Environmental (credit if raised): energy used by cameras and servers.',
    'Conclusion: weighs benefits (security) against risks (privacy, accuracy) and recommends safeguards, eg limited data retention, human checks before action.'
  ]);

  M('F', F1, 'Which law makes it illegal to gain unauthorised access to a computer?', 'Computer Misuse Act 1990', ['Data Protection Act 2018', 'Copyright, Designs and Patents Act 1988', 'Freedom of Information Act 2000'], 'Hacking is an offence under the Computer Misuse Act.');
  M('F', F1, 'Which law gives people the right to see personal data an organisation holds about them?', 'Data Protection Act 2018', ['Computer Misuse Act 1990', 'Copyright, Designs and Patents Act 1988', 'Communications Act 2003'], 'A subject access request is made under data protection law.');
  M('F', F1, 'Which is a feature of open source software?', 'Users can access and change the source code', ['It always comes with a paid support team', 'The source code is kept secret by the company', 'It can only be installed on one computer'], 'Open source gives access to the source code.');
  TF('F', F1, 'Copying and sharing paid-for software without permission breaks the Copyright, Designs and Patents Act 1988.', true, 'It is software piracy.');
  TF('F', F1, 'E-waste is a cultural issue.', false, 'E-waste is an environmental issue (it can also raise ethical issues about where it is dumped).');

  F('F', 'Data Protection Act 2018', 'Controls how personal data is collected, stored and used; gives people rights over their data.', F1);
  F('F', 'Computer Misuse Act 1990', 'Makes unauthorised access, access with intent to commit crime, and impairing computers illegal.', F1);
  F('F', 'Copyright, Designs and Patents Act 1988', 'Protects original work (including software) from being copied without permission.', F1);
  F('F', 'Open source software', 'Source code is available; users can modify and share it; usually free.', F1);
  F('F', 'Proprietary software', 'Source code is not available; usually paid for; cannot be modified.', F1);
  F('F', 'Digital divide', 'The gap between those with access to technology and the internet and those without.', F1);
  F('F', 'E-waste', 'Discarded electronic devices; can release toxic substances if not recycled properly.', F1);

/* ---- 02_paper2.js ---- */
  /* ===== Paper 2 · Computational thinking, algorithms and programming (2.1 – 2.5) ===== */
  const G1 = '2.1.1 Computational thinking', G2 = '2.1.2 Designing, creating and refining algorithms', G3 = '2.1.3 Searching and sorting algorithms';
  K('G', G1, 'Define', 1, 'Define the term abstraction.', ['Removing unnecessary detail from a problem to focus on what is important']);
  K('G', G1, 'Define', 1, 'Define the term decomposition.', ['Breaking a problem down into smaller, more manageable sub-problems']);
  K('G', G1, 'Explain', 2, 'A route-planning app shows a map of roads. Explain how abstraction has been used to create the map.', ['Unnecessary details are removed, eg buildings, trees, colours of houses…', '…and only the details needed to plan a route are kept, eg roads, junctions, distances']);
  K('G', G1, 'Describe', 2, 'Describe one benefit of decomposition when writing a large program.', ['Each sub-problem is smaller and easier to solve/test…', '…and different programmers can work on different parts at the same time // parts can be reused']);
  K('G', G2, 'Identify', 2, 'A program calculates the cost of cinema tickets from the number of adult and child tickets. Identify one input and one output.', ['Input: number of adult tickets / number of child tickets', 'Output: the total cost']);
  K('G', G2, 'State', 2, 'State what is meant by a syntax error and give an example.', ['An error that breaks the rules/grammar of the programming language (so the program cannot be translated/run)', 'Example: misspelt keyword (eg prnt), missing bracket or quotation mark']);
  K('G', G2, 'State', 1, 'State what is meant by a logic error.', ['An error where the program runs but produces an unexpected / incorrect output']);
  K('G', G2, 'Complete', 4, 'Complete a trace table for this algorithm.\n01 total = 0\n02 for i = 1 to 4\n03     total = total + i\n04 next i\n05 print(total)', ['total = 0 at the start', 'i takes the values 1, 2, 3, 4', 'total takes the values 1, 3, 6, 10', 'Output: 10']);
  K('G', G2, 'State', 1, 'State the output of this algorithm.\nx = 50\ncount = 0\nwhile x > 5\n    x = x DIV 2\n    count = count + 1\nendwhile\nprint(count)', ['4 (x becomes 25, 12, 6, 3)']);
  K('G', G2, 'Identify', 2, 'Identify the flowchart symbols used for a decision and for an input/output.', ['Decision: diamond', 'Input/output: parallelogram']);
  K('G', G2, 'Describe', 2, 'Describe the purpose of a structure diagram.', ['Shows how a problem has been broken down (decomposed) into sub-sections…', '…and how the sub-sections link to each other']);
  K('G', G3, 'State', 1, 'State one pre-requisite of a binary search.', ['The data must be sorted / in order']);
  K('G', G3, 'Describe', 4, 'Describe how a binary search would find the number 10 in the list 1, 2, 5, 6, 7, 10, 20.', ['Compare the middle value (6) with 10', '6 is less than 10, so discard 6 and the left half (1, 2, 5, 6)', 'The middle of the remaining items (7, 10, 20) is 10', '10 matches the target, so it is found']);
  K('G', G3, 'Describe', 3, 'Describe how a linear search works.', ['Start at the first item in the list', 'Compare each item in turn with the target', 'Stop when the item is found or the end of the list is reached (not found)']);
  K('G', G3, 'Explain', 2, 'Explain one advantage of a linear search compared with a binary search.', ['A linear search works on unsorted data…', '…so the data does not need to be sorted first // it is simpler to program']);
  K('G', G3, 'Show', 3, 'Show the first pass of a bubble sort on the list 5, 1, 4, 2, 8.', ['5 and 1 swapped: 1, 5, 4, 2, 8', '5 and 4 swapped, then 5 and 2 swapped: 1, 4, 2, 5, 8', '5 and 8 not swapped; end of first pass: 1, 4, 2, 5, 8']);
  K('G', G3, 'Describe', 3, 'Describe how a merge sort works.', ['The list is repeatedly split in half until each list has one item', 'Pairs of lists are merged, comparing the first item of each and placing the smaller first', 'This repeats until there is one sorted list']);
  K('G', G3, 'Describe', 3, 'Describe how an insertion sort works.', ['The first item is treated as the sorted part of the list', 'Each next item is taken and compared with the items in the sorted part…', '…and inserted into the correct position; repeated until all items are inserted']);

  M('G', G1, 'Removing unnecessary detail to focus on what matters is called…', 'abstraction', ['decomposition', 'iteration', 'validation'], 'Abstraction hides detail that is not needed.');
  M('G', G1, 'Breaking a problem into smaller parts is called…', 'decomposition', ['abstraction', 'compilation', 'concatenation'], 'Decomposition makes each part easier to solve.');
  M('G', G2, 'Which flowchart symbol is used for a decision?', 'Diamond', ['Parallelogram', 'Rectangle', 'Rounded rectangle'], 'A decision has two exits, eg Yes/No.');
  M('G', G2, 'Which flowchart symbol is used for input and output?', 'Parallelogram', ['Diamond', 'Rectangle', 'Rounded rectangle'], 'Rectangle = process; rounded rectangle = terminal.');
  TF('G', G2, 'A logic error stops a program from running.', false, 'A syntax error stops it running; a logic error gives the wrong result.');
  M('G', G3, 'Which search requires the data to be sorted?', 'Binary search', ['Linear search', 'Both searches', 'Neither search'], 'Binary search discards half the data each time, so it must be in order.');
  M('G', G3, 'Which sort splits a list into single items and then combines them in order?', 'Merge sort', ['Bubble sort', 'Insertion sort', 'Binary sort'], 'Merge sort is divide and conquer.');
  M('G', G3, 'A bubble sort stops when…', 'a pass makes no swaps', ['the first item is the smallest', 'it has made one pass', 'the list has been split in half'], 'No swaps in a pass means the list is in order.');
  TF('G', G3, 'A linear search can be used on unsorted data.', true, 'It checks every item in turn.');

  F('G', 'Abstraction', 'Removing unnecessary detail to focus on the important parts of a problem.', G1);
  F('G', 'Decomposition', 'Breaking a problem into smaller, more manageable sub-problems.', G1);
  F('G', 'Algorithmic thinking', 'Working out the steps needed to solve a problem, in order.', G1);
  F('G', 'Trace table', 'A table recording variable values and outputs as an algorithm runs line by line.', G2);
  F('G', 'Syntax error', 'Breaks the rules of the language; stops the program being translated/run.', G2);
  F('G', 'Logic error', 'The program runs but produces an unexpected or wrong output.', G2);
  F('G', 'Linear search', 'Checks each item in turn until found or the end is reached; works on unsorted data.', G3);
  F('G', 'Binary search', 'Repeatedly checks the middle item and discards half; data must be sorted.', G3);
  F('G', 'Bubble sort', 'Compares adjacent pairs and swaps them; repeats passes until no swaps.', G3);
  F('G', 'Insertion sort', 'Takes each item in turn and inserts it into the correct place in the sorted part.', G3);
  F('G', 'Merge sort', 'Splits the list into single items, then merges pairs in order until one list remains.', G3);

  const H1 = '2.2.1 Programming fundamentals', H2 = '2.2.2 Data types', H3 = '2.2.3 Additional programming techniques';
  K('H', H1, 'Describe', 2, 'Describe the difference between a variable and a constant.', ['A variable’s value can change while the program is running…', '…a constant’s value cannot change while the program is running (it is set once)']);
  K('H', H1, 'Explain', 2, 'Explain one reason for using a constant for the VAT rate in a program.', ['The value cannot be changed accidentally while the program runs // it only needs updating in one place…', '…so the program is less likely to have errors / is easier to maintain']);
  K('H', H1, 'State', 3, 'State the result of: 17 MOD 5, 17 DIV 5 and 2 ^ 4.', ['17 MOD 5 = 2', '17 DIV 5 = 3', '2 ^ 4 = 16']);
  K('H', H1, 'Describe', 3, 'Describe the three basic programming constructs.', ['Sequence: instructions run one after another in order', 'Selection: a decision determines which code runs (eg if/else)', 'Iteration: code is repeated (eg for/while loops)']);
  K('H', H1, 'Explain', 2, 'Explain the difference between a count-controlled loop and a condition-controlled loop.', ['A count-controlled loop repeats a fixed/known number of times (eg for)…', '…a condition-controlled loop repeats until/while a condition is met, so the number of repeats is not known in advance (eg while)']);
  K('H', H1, 'Write', 4, 'Write an algorithm that asks the user to enter a number and outputs "even" if it is even and "odd" if it is odd. Use OCR Exam Reference Language or a high-level language.', ['Takes a number as input (and casts it to an integer)', 'Uses selection (if … else)', 'Uses MOD 2 (or %) to check the remainder is 0', 'Outputs "even" and "odd" correctly']);
  K('H', H1, 'Write', 4, 'Write an algorithm that outputs the numbers 1 to 10 and then the total of those numbers.', ['Initialises a total to 0', 'Uses a count-controlled loop from 1 to 10', 'Outputs each number and adds it to the total inside the loop', 'Outputs the total (55) after the loop']);
  K('H', H2, 'State', 4, 'A program stores a product name, the number in stock, the price and whether it is on sale. State the most suitable data type for each.', ['Product name: string', 'Number in stock: integer', 'Price: real / float', 'On sale: Boolean']);
  K('H', H2, 'Explain', 2, 'Explain why a mobile phone number should be stored as a string rather than an integer.', ['It may start with 0 (which would be lost) / may contain spaces or a + sign…', '…and no calculations are carried out on it']);
  K('H', H2, 'Define', 1, 'Define the term casting.', ['Changing the data type of a value / variable (eg from string to integer)']);
  K('H', H2, 'Explain', 2, 'Explain why casting is needed in this code: age = input("Enter your age") followed by age = age + 1.', ['input() returns a string…', '…so it must be cast to an integer (int(age)) before adding 1, otherwise an error/concatenation occurs']);
  K('H', H3, 'State', 3, 'The variable subject contains "ComputerScience". State the result of subject.length, subject.left(4) and subject.substring(3, 5).', ['15', '"Comp"', '"puter"']);
  K('H', H3, 'Describe', 2, 'Describe what is meant by concatenation.', ['Joining two or more strings together…', '…end to end into one string, eg "Hello " + name']);
  K('H', H3, 'Write', 4, 'Write an algorithm that reads every line from a file called names.txt and outputs each line.', ['Opens the file names.txt', 'Uses a loop that continues until the end of the file', 'Reads a line and outputs it inside the loop', 'Closes the file']);
  K('H', H3, 'Describe', 2, 'Describe what is meant by an array.', ['A data structure that stores multiple values of the same data type…', '…under one identifier, each accessed using an index']);
  K('H', H3, 'Write', 3, 'An array called scores holds 10 integers. Write an algorithm to output the total of all the scores.', ['Initialises total to 0', 'Loops through every element (index 0 to 9)', 'Adds each element to the total and outputs the total after the loop']);
  K('H', H3, 'Describe', 2, 'Describe what is meant by a record.', ['A data structure that stores related data items (fields) about one item/person…', '…which can be of different data types']);
  K('H', H3, 'Write', 3, 'A table called Members has the fields MemberID, Name, Town and Age. Write an SQL statement to display the Name and Age of all members from Leeds.', ['SELECT Name, Age', 'FROM Members', 'WHERE Town = "Leeds"']);
  K('H', H3, 'Describe', 2, 'Describe the difference between a function and a procedure.', ['A function returns a value to the part of the program that called it…', '…a procedure carries out a task but does not return a value']);
  K('H', H3, 'Explain', 2, 'Explain one benefit of using local variables in sub programs.', ['A local variable only exists inside its sub program…', '…so it cannot be accidentally changed by other parts of the program / the same name can be used elsewhere / memory is freed when the sub program ends']);
  K('H', H3, 'Write', 4, 'Write a function called area that takes the width and height of a rectangle as parameters and returns its area.', ['Defines a function named area', 'Has two parameters (width, height)', 'Calculates width * height', 'Returns the result']);
  K('H', H3, 'Write', 2, 'Write a line of code that stores a random whole number between 1 and 100 (inclusive) in a variable called guess.', ['Uses a random function / random(1, 100) (or random.randint(1, 100))', 'Assigns the result to guess']);

  M('H', H1, 'What is the result of 23 MOD 4?', '3', ['5', '5.75', '4'], '23 ÷ 4 = 5 remainder 3. MOD gives the remainder.');
  M('H', H1, 'What is the result of 23 DIV 4?', '5', ['3', '5.75', '6'], 'DIV gives the whole-number part of the division.');
  M('H', H1, 'Which construct repeats a section of code?', 'Iteration', ['Sequence', 'Selection', 'Casting'], 'Loops (for, while, do…until) are iteration.');
  M('H', H1, 'In OCR Exam Reference Language, how many times does "for i = 0 to 4" repeat?', '5', ['4', '3', '6'], 'It runs for i = 0, 1, 2, 3 and 4.');
  M('H', H1, 'Which Boolean expression is true when x is 7?', 'x > 5 AND x < 10', ['x > 7 OR x < 0', 'NOT (x == 7)', 'x < 5 AND x > 2'], '7 > 5 is true and 7 < 10 is true.');
  M('H', H2, 'Which data type is most suitable for a temperature of 21.5 °C?', 'Real', ['Integer', 'Boolean', 'Character'], 'It has a decimal part.');
  M('H', H2, 'Which data type stores True or False?', 'Boolean', ['String', 'Real', 'Integer'], 'Boolean has exactly two values.');
  TF('H', H2, 'The input() function returns a string.', true, 'Cast it with int() or float() before doing maths.');
  M('H', H3, 'If word = "Python", what is word.left(2)?', '"Py"', ['"on"', '"yt"', '"P"'], 'left(2) gives the first two characters.');
  M('H', H3, 'Which SQL keyword chooses which records to return?', 'WHERE', ['SELECT', 'FROM', 'TABLE'], 'SELECT chooses fields, FROM the table, WHERE the records.');
  M('H', H3, 'What does a function do that a procedure does not?', 'Returns a value', ['Takes parameters', 'Contains a loop', 'Has a name'], 'Both can take parameters; only a function returns a value.');
  M('H', H3, 'In the array names = ["Ali", "Eve", "Ling"], what is names[1]?', '"Eve"', ['"Ali"', '"Ling"', 'an error'], 'Arrays are indexed from 0.');
  TF('H', H3, 'A file should be closed after it has been read or written.', true, 'Closing saves changes and frees the file.');

  F('H', 'Variable', 'A named memory location whose value can change while the program runs.', H1);
  F('H', 'Constant', 'A named value that cannot change while the program runs.', H1);
  F('H', 'MOD', 'Remainder after division: 17 MOD 5 = 2. Python: %', H1);
  F('H', 'DIV', 'Whole-number division: 17 DIV 5 = 3. Python: //', H1);
  F('H', 'Selection', 'A construct where a condition decides which code runs (if, switch).', H1);
  F('H', 'Iteration', 'Repeating code: count-controlled (for) or condition-controlled (while, do…until).', H1);
  F('H', 'Casting', 'Changing the data type of a value, eg int("5").', H2);
  F('H', 'Data types', 'Integer, real, Boolean, character, string.', H2);
  F('H', 'Concatenation', 'Joining strings together, eg "Hi " + name.', H3);
  F('H', 'Array', 'Stores many values of the same type under one name, accessed by index (from 0).', H3);
  F('H', '2D array', 'An array of arrays — a grid accessed with two indexes, eg board[1,2].', H3);
  F('H', 'Record', 'A data structure grouping related fields that can have different data types.', H3);
  F('H', 'SQL', 'SELECT fields FROM table WHERE condition.', H3);
  F('H', 'Function vs procedure', 'A function returns a value; a procedure does not.', H3);
  F('H', 'Local variable', 'Exists only inside the sub program where it is declared.', H3);
  F('H', 'Global variable', 'Can be used anywhere in the program.', H3);

  const I1 = '2.3.1 Defensive design', I2 = '2.3.2 Testing';
  K('I', I1, 'Define', 1, 'Define the term authentication.', ['Checking/confirming the identity of a user (eg with a username and password)']);
  K('I', I1, 'Describe', 4, 'Describe two validation checks that could be used on a field for a person’s age.', ['Range check…', '…the age is within sensible limits, eg 0 to 120', 'Type check / presence check…', '…the age is an integer // something has been entered']);
  K('I', I1, 'Write', 4, 'Write an algorithm that asks the user to enter a number between 1 and 10 and keeps asking until a valid number is entered.', ['Takes input from the user (cast to integer)', 'Uses a loop (eg while)', 'Checks the number is less than 1 or greater than 10 (correct condition)', 'Asks for input again inside the loop']);
  K('I', I1, 'Describe', 4, 'Describe two ways a programmer can make a program more maintainable.', ['Comments…', '…explain what sections of code do, so other programmers understand it', 'Meaningful identifiers / indentation / sub programs…', '…make the purpose and structure of the code clear']);
  K('I', I1, 'Explain', 2, 'Explain what is meant by anticipating misuse.', ['Thinking ahead about how users might misuse the program / enter unexpected data…', '…and designing the program to deal with it, eg validation, preventing division by zero']);
  K('I', I2, 'Describe', 2, 'Describe the difference between iterative testing and final testing.', ['Iterative testing happens during development, testing each part/module as it is written', 'Final (terminal) testing happens at the end, testing the whole program']);
  K('I', I2, 'Give', 4, 'A program accepts whole numbers from 1 to 100. Give an example of normal, boundary, invalid and erroneous test data.', ['Normal: any whole number between 2 and 99, eg 50', 'Boundary: 1 or 100', 'Invalid: an integer outside the range, eg 150 or 0', 'Erroneous: wrong data type, eg "ten" / 4.5']);
  K('I', I2, 'Define', 1, 'Define the term erroneous test data.', ['Data of the wrong data type that should be rejected']);
  K('I', I2, 'Explain', 2, 'Explain why a program should be tested.', ['To find and fix errors (syntax/logic) before users find them…', '…and to check the program meets its requirements / handles invalid data without crashing']);

  M('I', I1, 'Checking that a password is at least 8 characters long is a…', 'length check', ['range check', 'type check', 'presence check'], 'It checks the number of characters.');
  M('I', I1, 'Which of these improves the maintainability of code?', 'Meaningful variable names', ['Removing all comments', 'Using one long block of code', 'Single-letter identifiers'], 'Clear names, comments, indentation and sub programs help.');
  TF('I', I1, 'Validation proves that data entered is correct.', false, 'Validation only checks data is sensible/allowed — not that it is true.');
  M('I', I2, 'A program accepts 1–10. What type of test data is 10?', 'Boundary', ['Normal', 'Invalid', 'Erroneous'], 'It is on the edge of the valid range.');
  M('I', I2, 'A program accepts whole numbers 1–10. What type of test data is "seven"?', 'Erroneous', ['Invalid', 'Boundary', 'Normal'], 'Wrong data type = erroneous.');
  M('I', I2, 'Testing each module as it is written is called…', 'iterative testing', ['final testing', 'boundary testing', 'penetration testing'], 'Iterative testing happens during development.');

  F('I', 'Defensive design', 'Designing programs to cope with misuse and invalid input.', I1);
  F('I', 'Authentication', 'Confirming a user’s identity, eg username and password.', I1);
  F('I', 'Validation', 'Checking input is sensible/allowed: range, type, presence, length, format, lookup.', I1);
  F('I', 'Maintainability', 'Comments, meaningful names, indentation and sub programs make code easy to update.', I1);
  F('I', 'Normal test data', 'Typical data that should be accepted.', I2);
  F('I', 'Boundary test data', 'Correct type, on the edge of the valid range.', I2);
  F('I', 'Invalid test data', 'Correct data type but should be rejected (eg out of range).', I2);
  F('I', 'Erroneous test data', 'Wrong data type — should be rejected.', I2);
  F('I', 'Iterative vs final testing', 'Iterative: during development, module by module. Final: whole program at the end.', I2);

  const J1 = '2.4.1 Boolean logic';
  K('J', J1, 'Complete', 4, 'Complete the truth table for P = A AND B.', ['A=0, B=0 → P=0', 'A=0, B=1 → P=0', 'A=1, B=0 → P=0', 'A=1, B=1 → P=1']);
  K('J', J1, 'Complete', 4, 'Complete the truth table for P = NOT (A OR B).', ['A=0, B=0 → P=1', 'A=0, B=1 → P=0', 'A=1, B=0 → P=0', 'A=1, B=1 → P=0']);
  K('J', J1, 'State', 1, 'State the output of P = (A AND B) OR NOT C when A = 1, B = 0 and C = 1.', ['0 (A AND B = 0; NOT C = 0; 0 OR 0 = 0)']);
  K('J', J1, 'Describe', 3, 'Describe how to draw the logic diagram for P = (A OR B) AND C.', ['Inputs A and B go into an OR gate', 'The output of the OR gate and input C go into an AND gate', 'The output of the AND gate is P (gates drawn with the correct symbols)']);
  K('J', J1, 'Write', 2, 'An alarm (P) sounds if the system is switched on (A) and either a door (B) or a window (C) is opened. Write the Boolean expression for P.', ['P = A AND (B OR C)', 'Brackets placed correctly around B OR C']);
  K('J', J1, 'State', 1, 'State how many rows a truth table needs for three inputs.', ['8 (2³)']);

  M('J', J1, 'Which gate outputs 1 only when both inputs are 1?', 'AND', ['OR', 'NOT', 'XOR'], 'AND is true only if both inputs are true.');
  M('J', J1, 'What is NOT 1?', '0', ['1', '2', '10'], 'NOT reverses the input.');
  M('J', J1, 'What is the output of 0 OR 1?', '1', ['0', 'undefined', '2'], 'OR is true if at least one input is true.');
  TF('J', J1, 'A truth table with two inputs has four rows.', true, '2² = 4 combinations.');
  M('J', J1, 'For P = A AND NOT B, which inputs give P = 1?', 'A = 1, B = 0', ['A = 1, B = 1', 'A = 0, B = 0', 'A = 0, B = 1'], 'A must be 1 and B must be 0.');

  F('J', 'AND gate', 'Output is 1 only when both inputs are 1.', J1);
  F('J', 'OR gate', 'Output is 1 when at least one input is 1.', J1);
  F('J', 'NOT gate', 'Reverses the input: 1 → 0, 0 → 1.', J1);
  F('J', 'Truth table', 'Shows the output for every combination of inputs (2ⁿ rows for n inputs).', J1);

  const K1 = '2.5.1 Languages', K2 = '2.5.2 The Integrated Development Environment (IDE)';
  K('K', K1, 'Describe', 4, 'Describe two differences between high-level and low-level languages.', ['High-level languages use English-like keywords and are easier for humans to read/write…', '…low-level languages (machine code/assembly) are close to the hardware and harder to read', 'High-level code must be translated / is portable across different CPUs…', '…low-level code is specific to one type of processor but gives direct control of the hardware / can be faster and use less memory']);
  K('K', K1, 'Explain', 2, 'Explain why translators are needed.', ['The CPU can only execute machine code (binary)…', '…so programs written in high-level languages must be converted into machine code']);
  K('K', K1, 'Describe', 4, 'Describe the differences between a compiler and an interpreter.', ['A compiler translates the whole program at once…', '…producing an executable file that runs without re-translating', 'An interpreter translates and runs the program one line at a time…', '…stopping at the first error; it must translate every time the program is run']);
  K('K', K1, 'Explain', 2, 'Explain one benefit of using an interpreter while a program is being developed.', ['It stops at the first error and shows the line…', '…so errors are easier to find and fix // code can be tested without compiling the whole program']);
  K('K', K2, 'Describe', 4, 'Describe two features of an IDE that help a programmer write code.', ['Editor features, eg syntax highlighting / auto-indent / auto-complete…', '…make code easier to read and reduce typing errors', 'Error diagnostics, eg error messages with line numbers / breakpoints / stepping…', '…help locate and fix errors']);
  K('K', K2, 'Describe', 2, 'Describe the purpose of the run-time environment in an IDE.', ['Lets the program be run/executed within the IDE…', '…so it can be tested and its output seen (and run-time errors caught)']);

  M('K', K1, 'Which language can the CPU execute directly?', 'Machine code', ['Python', 'OCR Exam Reference Language', 'Assembly language'], 'Everything else must be translated into machine code.');
  M('K', K1, 'Which translator produces an executable file?', 'Compiler', ['Interpreter', 'IDE', 'Editor'], 'A compiler translates the whole program into an executable.');
  TF('K', K1, 'An interpreter translates the whole program before running any of it.', false, 'An interpreter translates and runs one line at a time.');
  M('K', K2, 'Which IDE feature pauses a program at a chosen line?', 'Breakpoint', ['Auto-complete', 'Syntax highlighting', 'Translator'], 'Breakpoints are part of error diagnostics/debugging.');
  M('K', K2, 'Showing keywords in different colours is called…', 'syntax highlighting', ['auto-indentation', 'error diagnostics', 'compilation'], 'It helps spot misspelt keywords.');

  F('K', 'High-level language', 'English-like, portable, easy to read; must be translated (eg Python).', K1);
  F('K', 'Low-level language', 'Machine code or assembly; close to the hardware, fast, CPU-specific.', K1);
  F('K', 'Compiler', 'Translates the whole program at once into an executable; fast to run.', K1);
  F('K', 'Interpreter', 'Translates and runs one line at a time; stops at the first error.', K1);
  F('K', 'IDE', 'Integrated Development Environment: editor, error diagnostics, run-time environment, translator.', K2);
  F('K', 'Breakpoint', 'Pauses a running program at a chosen line so variables can be inspected.', K2);

/* ---- 99_tail.js ---- */
})();

