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
