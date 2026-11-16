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
