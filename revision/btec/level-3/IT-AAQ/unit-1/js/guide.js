/* IT AAQ Unit 1 — Comprehensive Revision Guide
   Initialised by calling window.initComprehensiveGuide()
   Replaces the basic renderRevisionGuide() topic-card list. */
(function () {
  'use strict';

  const STORE_KEY = 'ra10-guide-revised-IT-u1';
  const AIMS = ['A','B','C','D','E','F'];
  const AIM_TITLES = {
    A: 'Devices, software and choosing IT systems',
    B: 'Transmitting data and networks',
    C: 'Operating online and cloud computing',
    D: 'Protecting data and information',
    E: 'Impact of using IT systems',
    F: 'Moral, ethical and legal issues'
  };
  const AIM_SUBTITLES = {
    A: 'Hardware types, OS functions, user interfaces, file formats, peripherals, open vs proprietary software',
    B: 'Topologies, protocols, bandwidth, compression, codecs, network types',
    C: 'Cloud models (IaaS/PaaS/SaaS), VPNs, remote working, online communities',
    D: 'Malware types, social engineering, encryption, firewalls, antivirus, RAID, backups',
    E: 'Online services, transactional data, collaborative working, data accuracy, UI design',
    F: 'Privacy, digital divide, AUPs, GDPR, Computer Misuse Act, Copyright, H&S regulations'
  };

  function getRevised() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch { return []; }
  }
  function saveRevised(arr) { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); }

  /* ---- Sidebar TOC ---- */
  function buildSidebar() {
    const items = [
      { aim:'A', topics:[['A1','Digital Devices'],['A2','Peripherals & Storage'],['A3','Software & OS'],['A4','Choosing IT Systems'],['A5','Emerging Tech & AI']] },
      { aim:'B', topics:[['B1','Connectivity'],['B2','Network Topologies'],['B3','Network Types'],['B4','Protocols & Issues']] },
      { aim:'C', topics:[['C1','Cloud Computing'],['C2','Online Communities']] },
      { aim:'D', topics:[['D1','Threats'],['D2','Protection Methods']] },
      { aim:'E', topics:[['E1','Online Services'],['E2','Data Accuracy & UI']] },
      { aim:'F', topics:[['F1','Moral & Ethical'],['F2','Legal Issues']] }
    ];
    return `
<button class="guide-sb-toggle" onclick="this.closest('.guide-sidebar').classList.toggle('sb-open')">
  <span>&#9776; Contents</span><span>&#8595;</span>
</button>
<div class="guide-sidebar-hd">
  <span class="guide-toc-label">Unit 1 Guide</span>
</div>
<div class="guide-toc-scroll">
  ${items.map(g=>`
  <div class="guide-toc-aim-group">
    <button class="guide-toc-aim-link" onclick="guideScrollTo('guide-aim-${g.aim}')">
      <span class="guide-toc-badge">${g.aim}</span>${AIM_TITLES[g.aim].split(' ').slice(0,3).join(' ')}…
    </button>
    <div class="guide-toc-topic-links">
      ${g.topics.map(([code,name])=>`<button class="guide-toc-topic-link" onclick="guideScrollTo('gt-${code}')">${code} ${name}</button>`).join('')}
    </div>
  </div>`).join('')}
</div>`;
  }

  /* ---- Topic wrapper helper ---- */
  function topic(code, name, bodyHtml, startOpen) {
    return `
<div class="guide-topic${startOpen?' open':''}" id="gt-${code}">
  <div class="guide-topic-hd" onclick="toggleGT('gt-${code}')">
    <span class="guide-topic-code">${code}</span>
    <span class="guide-topic-name">${name}</span>
    <span class="guide-topic-chevron">&#9660;</span>
  </div>
  <div class="guide-topic-body">${bodyHtml}</div>
</div>`;
  }

  /* ---- Aim section wrapper ---- */
  function aim(letter, topicsHtml) {
    return `
<div class="guide-aim-section" id="guide-aim-${letter}">
  <div class="guide-aim-hd">
    <div class="guide-aim-badge">${letter}</div>
    <div>
      <div class="guide-aim-title">Aim ${letter}: ${AIM_TITLES[letter]}</div>
      <div class="guide-aim-subtitle">${AIM_SUBTITLES[letter]}</div>
    </div>
  </div>
  ${topicsHtml}
  <button class="guide-mark-btn" id="gmb-${letter}" onclick="toggleGuideRevised('${letter}')">
    <span class="guide-mark-icon">&#9711;</span> Mark Aim ${letter} as revised
  </button>
</div>`;
  }

  const GUIDE_GALLERY = [
    {
      aim: 'A',
      kicker: 'Systems',
      title: 'Devices and software in real use',
      copy: 'Hardware, interfaces and storage choices connected to realistic workplace scenarios.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'
    },
    {
      aim: 'C',
      kicker: 'Cloud',
      title: 'Connected services and remote working',
      copy: 'Cloud tools, collaboration and online communities with a clearer visual anchor.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'
    },
    {
      aim: 'F',
      kicker: 'Law and ethics',
      title: 'Security, privacy and responsible use',
      copy: 'Legal compliance, digital rights and the human impact of IT decisions.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  function buildGuideGallery() {
    return `
<section class="guide-gallery" aria-label="Unit 1 visual overview">
  ${GUIDE_GALLERY.map(card => `
  <button
    class="guide-gallery-card"
    type="button"
    onclick="guideScrollTo('guide-aim-${card.aim}')"
    style="--guide-card-image:url('${card.image}')"
  >
    <span class="guide-gallery-kicker">${card.kicker}</span>
    <span class="guide-gallery-title">${card.title}</span>
    <span class="guide-gallery-copy">${card.copy}</span>
    <span class="guide-gallery-source">Royalty-free stock photo</span>
  </button>`).join('')}
</section>`;
  }

  /* ============================================================
     AIM A — IT Systems
  ============================================================ */
  const aimA = aim('A', [
    topic('A1','Digital Devices — types, features and uses', `
<p>Digital devices process, store or communicate information electronically. Understanding each device type, its key features and its typical use cases is essential for Section A questions.</p>

<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Embedded system</span> — a dedicated computer built into a device to control a specific function. Has fixed hardware and software. Examples: car engine management unit, washing machine controller, pacemaker.</div>

<table class="g-table"><thead><tr><th>Device type</th><th>Key features</th><th>Typical uses</th></tr></thead><tbody>
<tr><td><strong>Desktop PC</strong></td><td>Upgradable components, high processing power, mains powered</td><td>Office applications, gaming, CAD/design</td></tr>
<tr><td><strong>Laptop</strong></td><td>Portable, battery-powered, integrated screen/keyboard</td><td>Mobile working, education, business travel</td></tr>
<tr><td><strong>Tablet</strong></td><td>Touchscreen, lightweight, app-based OS, Wi-Fi/4G</td><td>Content consumption, presentations, field work</td></tr>
<tr><td><strong>Smartphone</strong></td><td>Highly portable, cellular network, GPS, camera, sensors</td><td>Communication, social media, navigation, banking</td></tr>
<tr><td><strong>File server</strong></td><td>Large centralised storage, RAID, network access, always on</td><td>Business file sharing, backups</td></tr>
<tr><td><strong>Web server</strong></td><td>Hosts web pages, responds to HTTP/HTTPS requests 24/7</td><td>E-commerce sites, online services, APIs</td></tr>
<tr><td><strong>Application server</strong></td><td>Runs application logic and business processes</td><td>ERP systems, database-driven applications</td></tr>
<tr><td><strong>IoT / embedded</strong></td><td>Sensor-equipped, small, low power, network connected</td><td>Smart home devices, industrial monitoring, healthcare wearables</td></tr>
<tr><td><strong>Navigation system</strong></td><td>GPS receiver, maps database, real-time traffic data</td><td>Vehicle navigation, fleet management, fitness tracking</td></tr>
</tbody></table>

<p><strong>Uses across sectors:</strong></p>
<ul>
<li><strong>Healthcare:</strong> patient records, diagnostic imaging (MRI controllers), remote monitoring wearables</li>
<li><strong>Manufacturing:</strong> CNC machines (embedded), CAM systems, automated quality control sensors</li>
<li><strong>Retail:</strong> EPOS terminals, stock-control servers, self-checkout kiosks</li>
<li><strong>Education:</strong> VLEs accessed via laptops/tablets, interactive smartboards</li>
<li><strong>Creative:</strong> high-spec workstations for video editing, CAD laptops</li>
</ul>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
When asked to identify a suitable device for a scenario, always state <em>why</em> it is suitable by linking a feature to the need. "A tablet is suitable because its touchscreen allows intuitive interaction in the field without needing a keyboard."</div>

<div class="exam-tip"><div class="tip-label">&#128161; Notation — Flowcharts and Network Diagrams</div>
The spec requires you to understand notation used to design IT systems. <strong>Flowcharts</strong> use: Oval = start/end, Rectangle = process, Diamond = decision, Parallelogram = input/output. <strong>Network diagrams</strong> use standardised icons for routers, switches, PCs, servers and cloud resources connected by lines representing cables or wireless links.</div>`,true),

    topic('A2','Peripheral Devices and Storage', `
<p>Peripherals extend what a computer can do. Storage devices vary widely in their capacity, speed, cost and portability — you must be able to compare them.</p>

<table class="g-table"><thead><tr><th>Type</th><th>Examples</th></tr></thead><tbody>
<tr><td><strong>Input</strong></td><td>Keyboard, mouse, scanner, webcam, microphone, touchscreen, barcode scanner, graphics tablet, fingerprint reader</td></tr>
<tr><td><strong>Output</strong></td><td>Monitor, inkjet printer, laser printer, 3D printer, speakers, projector, Braille display</td></tr>
<tr><td><strong>Storage</strong></td><td>HDD, SSD, USB flash drive, SD card, optical disc (DVD/Blu-ray), cloud storage</td></tr>
</tbody></table>

<p><strong>Assistive technologies</strong> help users with disabilities use IT systems:</p>
<ul>
<li>Screen reader — reads on-screen text aloud (visually impaired)</li>
<li>Braille display — converts on-screen text to refreshable Braille (visually impaired)</li>
<li>Adaptive/enlarged keyboard — larger keys, colour contrast (motor/visual difficulties)</li>
<li>Eye-tracking — controls cursor with eye movement (severe motor disability)</li>
<li>Sip-and-puff device — controlled by breath (quadriplegic users)</li>
<li>Head pointer — worn on head to operate keyboard/mouse (limited arm movement)</li>
<li>Text-to-speech / speech recognition — converts voice to text</li>
<li>Magnification software — enlarges screen content</li>
</ul>

<table class="g-table"><thead><tr><th>Storage</th><th>Capacity</th><th>Speed</th><th>Cost per GB</th><th>Portability</th><th>Durability</th></tr></thead><tbody>
<tr><td>HDD</td><td>Up to 20 TB+</td><td>Slow (~150 MB/s)</td><td>Very low</td><td>Low (fragile)</td><td>Affected by shocks</td></tr>
<tr><td>SSD</td><td>Up to 8 TB</td><td>Fast (500–7000 MB/s)</td><td>Medium</td><td>Medium</td><td>High (no moving parts)</td></tr>
<tr><td>USB flash</td><td>Up to 1 TB</td><td>Medium (100–400 MB/s)</td><td>Medium</td><td>Very high</td><td>Medium</td></tr>
<tr><td>Optical (Blu-ray)</td><td>Up to 100 GB</td><td>Very slow</td><td>Very low</td><td>High</td><td>Scratches reduce quality</td></tr>
<tr><td>Cloud</td><td>Scalable/unlimited</td><td>Depends on internet</td><td>Variable (subscription)</td><td>Access anywhere</td><td>Provider responsibility</td></tr>
</tbody></table>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip — 4 Cs of storage</div>
Storage comparison questions frequently appear. Remember <strong>Capacity, Cost, (access) speed, Compatibility/portability</strong>. Link each factor to the scenario: "A photographer needs high capacity and lossless quality so an SSD or large HDD is appropriate."</div>`,true),

    topic('A3','Computer Software — OS, user interfaces, file types, open vs proprietary', `
<p>Software is divided into system software (manages hardware) and application software (performs user tasks). The operating system is the most important piece of system software.</p>

<p><strong>Operating system types:</strong></p>
<table class="g-table"><thead><tr><th>OS type</th><th>Description</th><th>Example use</th></tr></thead><tbody>
<tr><td>Batch</td><td>Processes jobs queued without user interaction</td><td>Bank overnight payroll processing</td></tr>
<tr><td>Distributed</td><td>Runs across multiple networked computers sharing processing</td><td>Google's search infrastructure</td></tr>
<tr><td>Multitasking</td><td>Runs multiple processes by rapidly switching between them (time-slicing)</td><td>Windows, macOS on a typical PC</td></tr>
<tr><td>Network OS (NOS)</td><td>Manages shared network resources, user accounts, permissions</td><td>Windows Server, Linux server distros</td></tr>
<tr><td>Real-time (RTOS)</td><td>Responds to inputs within a guaranteed time limit — safety critical</td><td>Aircraft avionics, medical ventilators</td></tr>
<tr><td>Mobile</td><td>Optimised for touch, low power, cellular connectivity</td><td>Android, iOS</td></tr>
<tr><td>Single-user</td><td>One user at a time</td><td>Early DOS, modern desktop OS in basic use</td></tr>
<tr><td>Multi-user</td><td>Multiple simultaneous users sharing computing resources</td><td>University mainframe, shared server</td></tr>
</tbody></table>

<p><strong>Role of the OS:</strong></p>
<ul>
<li><strong>Memory management:</strong> allocates RAM to running programs, manages virtual memory</li>
<li><strong>Multi-tasking:</strong> time-slices CPU between processes</li>
<li><strong>Device drivers:</strong> provides standardised interface for hardware (keyboard, GPU, printer)</li>
<li><strong>Security:</strong> user authentication, file permissions, encryption support</li>
<li><strong>Networking:</strong> TCP/IP stack, network adapter management</li>
<li><strong>User accounts:</strong> separate environments, permissions, profiles for each user</li>
</ul>

<p><strong>User interface types:</strong></p>
<table class="g-table"><thead><tr><th>UI type</th><th>How it works</th><th>Advantages</th><th>Disadvantages</th></tr></thead><tbody>
<tr><td>Command Line (CLI)</td><td>User types text commands</td><td>Very fast, low resource use, precise, scriptable</td><td>Steep learning curve, easy to make typing errors</td></tr>
<tr><td>Menu-driven</td><td>Navigate structured menus using keys</td><td>Easy for new users, structured choices</td><td>Limited options, slow for experienced users</td></tr>
<tr><td>GUI</td><td>Icons, windows, mouse pointer</td><td>Intuitive, visual feedback, widely familiar</td><td>High resource demand (RAM/GPU), less precise</td></tr>
<tr><td>Touchscreen GUI</td><td>Touch gestures replace mouse</td><td>Natural on mobile, accessible without peripherals</td><td>Less precise for detailed work, fingerprints on screen</td></tr>
</tbody></table>

<p><strong>Open source vs proprietary software:</strong></p>
<table class="g-table"><thead><tr><th>Factor</th><th>Open source</th><th>Proprietary</th></tr></thead><tbody>
<tr><td>Cost</td><td>Usually free</td><td>Licence fee required</td></tr>
<tr><td>Source code</td><td>Publicly available, modifiable</td><td>Closed — cannot be inspected or modified</td></tr>
<tr><td>Support</td><td>Community forums, documentation</td><td>Official vendor support, SLAs available</td></tr>
<tr><td>Security</td><td>Vulnerabilities visible but rapidly patched by community</td><td>Vulnerabilities not public but must rely on vendor</td></tr>
<tr><td>Customisation</td><td>Can be adapted to any need</td><td>Must accept as-is</td></tr>
<tr><td>Examples</td><td>Linux, LibreOffice, VLC, Firefox</td><td>Windows, MS Office, Adobe Photoshop</td></tr>
</tbody></table>

<p><strong>File formats:</strong></p>
<table class="g-table"><thead><tr><th>Category</th><th>Format</th><th>Compression</th><th>Features</th><th>Best for</th></tr></thead><tbody>
<tr><td>Image</td><td>JPEG</td><td>Lossy</td><td>Tiny files, some quality loss</td><td>Photographs on websites</td></tr>
<tr><td>Image</td><td>PNG</td><td>Lossless</td><td>Supports transparency</td><td>Logos, graphics, screenshots</td></tr>
<tr><td>Image</td><td>BMP</td><td>None</td><td>Huge files, perfect quality</td><td>Editing masters (not distribution)</td></tr>
<tr><td>Image</td><td>GIF</td><td>Lossless</td><td>256 colours max, supports animation</td><td>Simple animations, icons</td></tr>
<tr><td>Audio</td><td>MP3</td><td>Lossy</td><td>Very small, widely compatible</td><td>Streaming music, podcasts</td></tr>
<tr><td>Audio</td><td>WAV</td><td>None</td><td>Uncompressed, large files</td><td>Professional audio editing masters</td></tr>
<tr><td>Audio</td><td>FLAC</td><td>Lossless</td><td>Perfect quality, smaller than WAV</td><td>Audiophile music archiving</td></tr>
<tr><td>Video</td><td>MP4/H.264</td><td>Lossy</td><td>Good quality-to-size ratio, widely supported</td><td>Streaming, social media, general use</td></tr>
<tr><td>Video</td><td>AVI</td><td>Variable</td><td>Older format, larger files</td><td>Legacy systems</td></tr>
<tr><td>Document</td><td>PDF</td><td>Variable</td><td>Preserves layout on any device</td><td>Sharing final documents</td></tr>
<tr><td>Spreadsheet</td><td>CSV</td><td>None</td><td>Plain text, compatible everywhere</td><td>Data import/export between systems</td></tr>
</tbody></table>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
File format questions often give a scenario and ask you to justify a choice. Always state: (1) whether it is lossy or lossless, (2) the approximate file size implication, and (3) why that matters for the scenario. Example: "JPEG because the website needs fast loading times; lossy compression reduces file size significantly with acceptable quality loss for photographs."</div>

<div class="mistake-box"><div class="mistake-label">&#9888; Common mistake</div>
Do not say "JPEG is always better than PNG" — PNG is essential when transparency is needed or when quality must be lossless (logos, graphics). The correct answer always depends on context.</div>`,true),

    topic('A4','Choosing IT Systems — factors and implications', `
<p>Selecting the right IT system requires balancing technical, financial and human factors. Questions may ask you to recommend a system or evaluate a decision already made.</p>

<p><strong>Factors affecting choice of IT system:</strong></p>
<ul>
<li><strong>User needs:</strong> what tasks must the system perform, who will use it (skill level, disabilities)</li>
<li><strong>Technical specifications:</strong> processor speed, RAM, storage capacity, screen resolution, battery life</li>
<li><strong>Compatibility:</strong> works with existing hardware, software, file formats and networks</li>
<li><strong>Connectivity:</strong> Wi-Fi, Bluetooth, cellular, ports (USB-C, Ethernet, HDMI)</li>
<li><strong>Cost:</strong> initial purchase price, licensing, ongoing maintenance, cloud subscriptions</li>
<li><strong>Security requirements:</strong> encryption support, remote wipe capability, biometric login</li>
<li><strong>Productivity:</strong> will the system speed up workflows or introduce new capabilities</li>
<li><strong>Implementation:</strong> time to deploy, staff disruption, data migration</li>
<li><strong>Support:</strong> vendor warranty, help desk availability, update lifecycle</li>
</ul>

<p><strong>Impact of implementing a new IT system (on employees and the organisation):</strong></p>
<table class="g-table"><thead><tr><th>Area</th><th>Positive impact</th><th>Negative impact</th></tr></thead><tbody>
<tr><td>Employees</td><td>More efficient tools, remote working options</td><td>Requires training, initial productivity drop</td></tr>
<tr><td>Customers</td><td>Better service, new online channels</td><td>Disruption during changeover, data migration errors</td></tr>
<tr><td>Costs</td><td>Long-term savings through automation</td><td>High upfront capital or ongoing subscription costs</td></tr>
<tr><td>Security</td><td>New protections if system is well configured</td><td>New attack surfaces, migration vulnerabilities</td></tr>
<tr><td>Working practices</td><td>Enables remote/hybrid working</td><td>Resistance to change from staff</td></tr>
</tbody></table>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
"Discuss" or "Evaluate" questions about choosing an IT system require balanced analysis. For every benefit you identify, consider a corresponding drawback and link both to the specific scenario or organisation described in the question.</div>`,false),

    topic('A5','Emerging Technologies and Artificial Intelligence', `
<p>Emerging technologies — especially AI — are transforming how individuals and organisations use IT. This topic requires understanding both what AI can do and the wider implications.</p>

<p><strong>AI application types:</strong></p>
<ul>
<li><strong>Machine learning:</strong> systems learn from data patterns without explicit programming (e.g. spam filters, Netflix recommendations, fraud detection)</li>
<li><strong>Natural language processing (NLP):</strong> AI understands and generates human language (Siri, Alexa, ChatGPT, Google Translate)</li>
<li><strong>Computer vision:</strong> AI interprets images/video (facial recognition, self-driving car cameras, medical imaging analysis)</li>
<li><strong>Robotics &amp; automation:</strong> AI-controlled physical systems (manufacturing robots, surgical robots, delivery drones)</li>
<li><strong>Predictive analytics:</strong> uses historical data to forecast outcomes (stock market, weather, demand forecasting)</li>
</ul>

<table class="g-table"><thead><tr><th>Impact area</th><th>Positive</th><th>Negative</th></tr></thead><tbody>
<tr><td>Organisations — performance</td><td>Automates repetitive tasks 24/7, reduces human error</td><td>High initial cost, requires specialist IT skills to implement</td></tr>
<tr><td>Organisations — employment</td><td>Creates new specialist roles (data scientists, AI engineers)</td><td>Displaces workers in routine roles (data entry, manufacturing, customer service)</td></tr>
<tr><td>Individuals — convenience</td><td>Voice assistants, personalised services, better health monitoring</td><td>Over-reliance on technology, erosion of skills</td></tr>
<tr><td>Individuals — privacy</td><td>Better fraud detection, medical diagnosis</td><td>Constant data collection, surveillance, bias in AI decisions</td></tr>
</tbody></table>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
Emerging tech questions often ask you to evaluate. Always consider: (1) the specific benefit with a named example, (2) the corresponding risk or drawback, and (3) who is affected. "AI improves diagnostic accuracy in healthcare (e.g. detecting cancer in scans) but raises concerns about data privacy as medical images are processed by third-party systems."</div>`,false)
  ]);

  /* ============================================================
     AIM B — Transmitting Data
  ============================================================ */
  const aimB = aim('B', [
    topic('B1','Connectivity — wired and wireless methods', `
<p>Devices connect to networks and peripherals using a variety of wired and wireless technologies, each with different speed, range and security trade-offs.</p>

<div class="def-box"><div class="def-label">Key definitions</div>
<span class="def-term">Bandwidth</span> — the maximum amount of data that can be transmitted per second (measured in bits per second: bps, Mbps, Gbps).<br><br>
<span class="def-term">Latency</span> — the delay between sending a request and receiving a response, measured in milliseconds (ms). Critical for real-time applications.</div>

<table class="g-table"><thead><tr><th>Method</th><th>Type</th><th>Speed</th><th>Range</th><th>Use cases</th></tr></thead><tbody>
<tr><td>Wi-Fi (802.11ac/ax)</td><td>Wireless</td><td>Up to 9.6 Gbps (Wi-Fi 6)</td><td>~50–100 m</td><td>Home/office internet, BYOD</td></tr>
<tr><td>Bluetooth (v5.0)</td><td>Wireless</td><td>Up to 50 Mbps</td><td>~10–40 m</td><td>Headphones, keyboards, IoT, file transfer</td></tr>
<tr><td>NFC</td><td>Wireless</td><td>Very low (424 kbps)</td><td>&lt;4 cm</td><td>Contactless payments, access cards, pairing</td></tr>
<tr><td>4G/5G mobile</td><td>Wireless</td><td>100 Mbps–1+ Gbps</td><td>Nationwide</td><td>Mobile internet, remote field devices</td></tr>
<tr><td>Ethernet (Cat 6)</td><td>Wired</td><td>1–10 Gbps</td><td>~100 m per segment</td><td>Fixed office networks, servers</td></tr>
<tr><td>USB (3.2/USB4)</td><td>Wired</td><td>10–40 Gbps</td><td>Short (&lt;2 m)</td><td>External storage, peripherals</td></tr>
<tr><td>Fibre optic</td><td>Wired</td><td>Up to 100 Gbps+</td><td>Kilometres</td><td>WAN backbone, broadband to buildings</td></tr>
</tbody></table>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
When comparing wired vs wireless, key trade-offs are: wired = faster, more secure, less convenient; wireless = portable, flexible, but susceptible to interference and interception. Always relate to the scenario in the question.</div>`,true),

    topic('B2','Network Topologies — star, bus and ring', `
<p>A network topology describes the physical or logical arrangement of devices in a network. You must be able to draw and describe all three and evaluate each.</p>

<div class="guide-diagram">
<svg viewBox="0 0 660 200" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;font-family:var(--font);font-size:11px">
  <!-- STAR -->
  <text x="100" y="14" text-anchor="middle" font-weight="bold" fill="currentColor" font-size="12">Star</text>
  <rect x="82" y="85" width="36" height="22" rx="4" fill="#00594E" stroke="none"/>
  <text x="100" y="100" text-anchor="middle" fill="white" font-size="10" font-weight="bold">Hub</text>
  <line x1="100" y1="85" x2="100" y2="40" stroke="currentColor" stroke-width="1.5" opacity=".6"/>
  <line x1="118" y1="96" x2="158" y2="96" stroke="currentColor" stroke-width="1.5" opacity=".6"/>
  <line x1="100" y1="107" x2="100" y2="152" stroke="currentColor" stroke-width="1.5" opacity=".6"/>
  <line x1="82" y1="96" x2="42" y2="96" stroke="currentColor" stroke-width="1.5" opacity=".6"/>
  <rect x="82" y="24" width="36" height="18" rx="3" fill="var(--surface)" stroke="currentColor" stroke-width="1" opacity=".8"/>
  <text x="100" y="36" text-anchor="middle" fill="currentColor" font-size="9">PC</text>
  <rect x="158" y="87" width="36" height="18" rx="3" fill="var(--surface)" stroke="currentColor" stroke-width="1" opacity=".8"/>
  <text x="176" y="99" text-anchor="middle" fill="currentColor" font-size="9">PC</text>
  <rect x="82" y="152" width="36" height="18" rx="3" fill="var(--surface)" stroke="currentColor" stroke-width="1" opacity=".8"/>
  <text x="100" y="164" text-anchor="middle" fill="currentColor" font-size="9">PC</text>
  <rect x="4" y="87" width="36" height="18" rx="3" fill="var(--surface)" stroke="currentColor" stroke-width="1" opacity=".8"/>
  <text x="22" y="99" text-anchor="middle" fill="currentColor" font-size="9">PC</text>

  <!-- BUS -->
  <text x="350" y="14" text-anchor="middle" font-weight="bold" fill="currentColor" font-size="12">Bus</text>
  <line x1="220" y1="96" x2="480" y2="96" stroke="currentColor" stroke-width="2.5" opacity=".7"/>
  <rect x="216" y="90" width="8" height="12" rx="1" fill="#ef4444"/>
  <rect x="476" y="90" width="8" height="12" rx="1" fill="#ef4444"/>
  <text x="213" y="120" text-anchor="middle" fill="currentColor" font-size="9" opacity=".7">Terminator</text>
  <text x="482" y="120" text-anchor="middle" fill="currentColor" font-size="9" opacity=".7">Terminator</text>
  <line x1="280" y1="96" x2="280" y2="55" stroke="currentColor" stroke-width="1.5" opacity=".6"/>
  <line x1="350" y1="96" x2="350" y2="55" stroke="currentColor" stroke-width="1.5" opacity=".6"/>
  <line x1="420" y1="96" x2="420" y2="55" stroke="currentColor" stroke-width="1.5" opacity=".6"/>
  <rect x="262" y="37" width="36" height="18" rx="3" fill="var(--surface)" stroke="currentColor" stroke-width="1" opacity=".8"/>
  <text x="280" y="49" text-anchor="middle" fill="currentColor" font-size="9">PC</text>
  <rect x="332" y="37" width="36" height="18" rx="3" fill="var(--surface)" stroke="currentColor" stroke-width="1" opacity=".8"/>
  <text x="350" y="49" text-anchor="middle" fill="currentColor" font-size="9">PC</text>
  <rect x="402" y="37" width="36" height="18" rx="3" fill="var(--surface)" stroke="currentColor" stroke-width="1" opacity=".8"/>
  <text x="420" y="49" text-anchor="middle" fill="currentColor" font-size="9">PC</text>

  <!-- RING -->
  <text x="580" y="14" text-anchor="middle" font-weight="bold" fill="currentColor" font-size="12">Ring</text>
  <circle cx="580" cy="96" r="55" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".5" stroke-dasharray="4 2"/>
  <rect x="562" y="28" width="36" height="18" rx="3" fill="var(--surface)" stroke="currentColor" stroke-width="1" opacity=".8"/>
  <text x="580" y="40" text-anchor="middle" fill="currentColor" font-size="9">PC</text>
  <rect x="617" y="69" width="36" height="18" rx="3" fill="var(--surface)" stroke="currentColor" stroke-width="1" opacity=".8"/>
  <text x="635" y="81" text-anchor="middle" fill="currentColor" font-size="9">PC</text>
  <rect x="617" y="113" width="36" height="18" rx="3" fill="var(--surface)" stroke="currentColor" stroke-width="1" opacity=".8"/>
  <text x="635" y="125" text-anchor="middle" fill="currentColor" font-size="9">PC</text>
  <rect x="562" y="152" width="36" height="18" rx="3" fill="var(--surface)" stroke="currentColor" stroke-width="1" opacity=".8"/>
  <text x="580" y="164" text-anchor="middle" fill="currentColor" font-size="9">PC</text>
  <rect x="527" y="113" width="36" height="18" rx="3" fill="var(--surface)" stroke="currentColor" stroke-width="1" opacity=".8"/>
  <text x="545" y="125" text-anchor="middle" fill="currentColor" font-size="9">PC</text>
</svg>
<figcaption>Figure 1 — Star (central hub/switch), Bus (shared backbone with terminators), Ring (circular data path) topologies</figcaption>
</div>

<table class="g-table"><thead><tr><th>Topology</th><th>Advantages</th><th>Disadvantages</th><th>Used in</th></tr></thead><tbody>
<tr><td><strong>Star</strong></td><td>One device fails, others unaffected; easy to add/remove devices; fault isolation is simple</td><td>Central hub/switch is single point of failure; more cable needed than bus</td><td>Most modern office and home networks</td></tr>
<tr><td><strong>Bus</strong></td><td>Simple and cheap to install; less cable than star</td><td>Backbone failure brings down entire network; performance degrades with more devices; data collisions common</td><td>Older networks, small temporary setups</td></tr>
<tr><td><strong>Ring</strong></td><td>Equal access for all devices; no data collisions with token-passing protocol</td><td>Any break in ring stops all communication; adding/removing devices disrupts ring</td><td>Some older campus networks, fibre rings</td></tr>
</tbody></table>

<div class="mistake-box"><div class="mistake-label">&#9888; Common mistake</div>
Students say "star is always better." In the exam, always acknowledge the downside — if the central switch fails, the entire star network goes down. This is its single point of failure.</div>`,true),

    topic('B3','Network Types — LAN, WAN, PAN and VPN', `
<table class="g-table"><thead><tr><th>Type</th><th>Range</th><th>Speed</th><th>Example</th><th>Key feature</th></tr></thead><tbody>
<tr><td><strong>PAN</strong> (Personal Area Network)</td><td>~10 m</td><td>Low–medium</td><td>Bluetooth between phone and laptop</td><td>One person's devices</td></tr>
<tr><td><strong>LAN</strong> (Local Area Network)</td><td>Single building/site</td><td>1–100 Gbps</td><td>Office network, school network</td><td>Owned and managed by organisation</td></tr>
<tr><td><strong>WAN</strong> (Wide Area Network)</td><td>Worldwide</td><td>Variable</td><td>The internet; bank's multi-site network</td><td>Connects multiple LANs across long distances</td></tr>
<tr><td><strong>VPN</strong> (Virtual Private Network)</td><td>Over internet</td><td>Depends on internet speed</td><td>Remote workers accessing company servers</td><td>Encrypted tunnel through internet — secure but not a physical network</td></tr>
</tbody></table>

<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">VPN</span> — creates an encrypted tunnel through an existing network (usually the internet). The data appears private and unreadable to anyone intercepting it. Allows remote employees to securely access the company's internal LAN as if they were on-site.</div>

<div class="mistake-box"><div class="mistake-label">&#9888; Common mistake</div>
A VPN is not a physical network type — it is a security/privacy tool that works over an existing WAN or the internet. Do not confuse it with a WAN.</div>`,true),

    topic('B4','Protocols, bandwidth, compression and codecs', `
<p>Protocols are agreed rules governing data transmission. Without protocols, devices from different manufacturers could not communicate.</p>

<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Protocol</span> — a set of agreed rules defining how data is formatted, transmitted, received and acknowledged between devices on a network.</div>

<table class="g-table"><thead><tr><th>Protocol</th><th>Full name</th><th>Function</th></tr></thead><tbody>
<tr><td>HTTP</td><td>HyperText Transfer Protocol</td><td>Transfers web pages — unencrypted</td></tr>
<tr><td>HTTPS</td><td>HTTP Secure</td><td>Transfers web pages encrypted via TLS/SSL</td></tr>
<tr><td>SMTP</td><td>Simple Mail Transfer Protocol</td><td>Sends emails from client to server and between servers</td></tr>
<tr><td>POP3</td><td>Post Office Protocol 3</td><td>Downloads emails to device; deletes from server by default</td></tr>
<tr><td>IMAP</td><td>Internet Message Access Protocol</td><td>Accesses emails stored on server; synced across multiple devices</td></tr>
<tr><td>FTP</td><td>File Transfer Protocol</td><td>Transfers files between computers on a network</td></tr>
<tr><td>TCP</td><td>Transmission Control Protocol</td><td>Ensures reliable, ordered delivery — breaks data into packets and re-orders them</td></tr>
<tr><td>IP</td><td>Internet Protocol</td><td>Addresses and routes packets between networks</td></tr>
<tr><td>DNS</td><td>Domain Name System</td><td>Translates domain names (www.bbc.co.uk) to IP addresses</td></tr>
</tbody></table>

<p><strong>TCP/IP model layers:</strong></p>
<div class="formula-box">4. Application layer  — HTTP, HTTPS, SMTP, FTP, DNS  (services for end-user apps)
3. Transport layer    — TCP, UDP                     (breaks data into segments, ensures delivery)
2. Internet layer     — IP                            (addresses packets, routes across networks)
1. Network Access     — Ethernet, Wi-Fi              (physical transmission of bits)</div>

<p><strong>Compression types:</strong></p>
<table class="g-table"><thead><tr><th>Type</th><th>Method</th><th>Quality</th><th>File size reduction</th><th>Best for</th></tr></thead><tbody>
<tr><td><strong>Lossy</strong></td><td>Permanently removes some data</td><td>Reduced (acceptable for human perception)</td><td>Very significant (10:1 or more)</td><td>JPEG, MP3, MP4 — distribution where perfect quality isn't critical</td></tr>
<tr><td><strong>Lossless</strong></td><td>Encodes without discarding data</td><td>Identical to original</td><td>Moderate (2:1 typical)</td><td>PNG, FLAC, ZIP, RAW — where exact data must be preserved</td></tr>
</tbody></table>

<p><strong>Codecs</strong> (Compressor-Decompressor):</p>
<ul>
<li>H.264 / H.265 (HEVC): video codecs used to compress MP4/MKV files — H.265 achieves same quality at half the file size of H.264</li>
<li>AAC / MP3: audio codecs used for music streaming (AAC is used in iTunes/Apple Music)</li>
<li>A codec both encodes (compresses) when saving and decodes (decompresses) during playback</li>
<li>Without the correct codec installed, a player cannot decode an audio/video file</li>
</ul>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
HTTPS questions are very common. Always explain that HTTPS uses TLS (Transport Layer Security) to encrypt the connection. This means even if data is intercepted, it cannot be read. Required whenever sensitive data (passwords, payment details, personal information) is transmitted.</div>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip — IMAP vs POP3</div>
IMAP keeps emails on the server and syncs across all devices — ideal for users who check emails on phone, laptop and tablet. POP3 downloads emails to one device and typically deletes them from the server — suitable for single-device users with limited server storage.</div>`,true)
  ]);

  /* ============================================================
     AIM C — Operating Online
  ============================================================ */
  const aimC = aim('C', [
    topic('C1','Cloud Computing — models and remote working', `
<p>Cloud computing delivers IT services (servers, storage, software) over the internet on a pay-as-you-go basis, removing the need for on-premise hardware.</p>

<p><strong>Cloud service models:</strong></p>
<table class="g-table"><thead><tr><th>Model</th><th>What the provider gives you</th><th>What you manage</th><th>Examples</th></tr></thead><tbody>
<tr><td><strong>IaaS</strong> (Infrastructure as a Service)</td><td>Virtual hardware: servers, storage, networking</td><td>Operating system, middleware, applications, data</td><td>AWS EC2, Microsoft Azure VMs, Google Compute</td></tr>
<tr><td><strong>PaaS</strong> (Platform as a Service)</td><td>OS + development tools + runtime environment</td><td>Application code and data only</td><td>Heroku, Google App Engine, Microsoft Azure App Service</td></tr>
<tr><td><strong>SaaS</strong> (Software as a Service)</td><td>Complete application — ready to use</td><td>Just your data and settings</td><td>Google Workspace, Microsoft 365, Salesforce, Dropbox</td></tr>
</tbody></table>

<div class="formula-box">Responsibility stack (top = most customer responsibility):
IaaS: Customer manages OS, apps, data
PaaS: Customer manages apps, data only
SaaS: Customer manages data only (provider manages everything else)</div>

<p><strong>Cloud deployment types:</strong></p>
<table class="g-table"><thead><tr><th>Type</th><th>Description</th><th>Advantages</th><th>Disadvantages</th></tr></thead><tbody>
<tr><td>Public cloud</td><td>Shared infrastructure owned by provider (AWS, Azure, Google)</td><td>Low cost, instantly scalable, no maintenance</td><td>Less control, shared environment security concerns</td></tr>
<tr><td>Private cloud</td><td>Dedicated infrastructure for one organisation only</td><td>Full control, highest security, meets compliance requirements</td><td>Expensive to build/run, requires skilled IT staff</td></tr>
<tr><td>Hybrid cloud</td><td>Combination — sensitive data on private, scalable workloads on public</td><td>Flexibility, balances cost and security</td><td>Complex to manage, integration challenges</td></tr>
</tbody></table>

<p><strong>General advantages of cloud computing:</strong> reduced hardware costs, pay-as-you-go scalability, automatic updates, access from anywhere, disaster recovery built in, easier collaboration.</p>
<p><strong>General disadvantages:</strong> requires reliable internet, ongoing subscription cost, data stored on third-party servers (security/compliance), vendor lock-in risk, downtime affects all users.</p>

<p><strong>Remote working technologies:</strong></p>
<ul>
<li><strong>VPN:</strong> encrypts connection between home and office network; allows secure access to internal resources</li>
<li><strong>Remote Desktop Protocol (RDP):</strong> takes full control of another computer remotely; used by IT support and remote workers</li>
<li><strong>Video conferencing:</strong> Zoom, Microsoft Teams, Google Meet — replaces face-to-face meetings</li>
<li><strong>Cloud file sharing:</strong> OneDrive, Google Drive — documents accessible on any device without VPN</li>
</ul>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
Always relate cloud model choice to the organisation. A start-up with no IT staff would choose SaaS (no infrastructure to manage). A bank with strict compliance requirements would use a private cloud. A retailer with seasonal demand spikes might use a hybrid cloud.</div>`,true),

    topic('C2','Online Communities and communication methods', `
<table class="g-table"><thead><tr><th>Method</th><th>Description</th><th>Examples</th><th>Business/personal use</th></tr></thead><tbody>
<tr><td>Social media</td><td>Public/private posts, sharing, interactive feeds</td><td>Facebook, Instagram, LinkedIn, X/Twitter</td><td>Marketing, customer feedback, networking</td></tr>
<tr><td>Blog / Vlog</td><td>Regular written or video posts; comments enabled</td><td>WordPress, YouTube</td><td>Brand building, education, entertainment</td></tr>
<tr><td>Wiki</td><td>Collaborative editable reference pages</td><td>Wikipedia, Confluence</td><td>Knowledge management, public reference</td></tr>
<tr><td>Chatrooms / IM</td><td>Real-time text, voice, or video messaging</td><td>WhatsApp, Slack, Teams, Discord</td><td>Team collaboration, customer support</td></tr>
<tr><td>Podcast</td><td>Downloadable audio broadcasts, subscription-based</td><td>Spotify podcasts, Apple Podcasts</td><td>Thought leadership, education, entertainment</td></tr>
<tr><td>Forum</td><td>Topic-based threaded discussions</td><td>Reddit, Stack Overflow, Mumsnet</td><td>Community support, product feedback</td></tr>
<tr><td>Video conferencing</td><td>Live video calls, screen sharing, recording</td><td>Zoom, Google Meet, Teams</td><td>Remote meetings, training, interviews</td></tr>
</tbody></table>

<p><strong>Considerations when using online communication systems:</strong></p>
<ul>
<li><strong>Privacy:</strong> what personal data is collected, who can see messages/posts</li>
<li><strong>Security:</strong> risk of data breaches, account hijacking, phishing via messaging platforms</li>
<li><strong>Cost:</strong> free vs paid tiers — free versions often have limited features or show ads</li>
<li><strong>Downtime:</strong> if the platform is unavailable, business communication stops</li>
<li><strong>Training:</strong> staff need to learn new platforms; older employees may struggle</li>
<li><strong>Integration:</strong> does it connect with existing CRM, project management, or email systems</li>
<li><strong>Productivity:</strong> notifications can be distracting; channels need management</li>
</ul>`,true)
  ]);

  /* ============================================================
     AIM D — Protecting Data
  ============================================================ */
  const aimD = aim('D', [
    topic('D1','Threats to data, information and systems', `
<p>Data can be threatened by external attackers, malicious software, or mistakes made by people inside an organisation. You must know specific threat types and their impact.</p>

<p><strong>Malware types:</strong></p>
<table class="g-table"><thead><tr><th>Malware type</th><th>How it works</th><th>Real-world example</th></tr></thead><tbody>
<tr><td><strong>Virus</strong></td><td>Attaches to files; spreads when infected file is opened/shared</td><td>ILOVEYOU virus spread via email attachments</td></tr>
<tr><td><strong>Worm</strong></td><td>Self-replicates and spreads across networks automatically — no user action needed</td><td>WannaCry spread across NHS hospital networks in 2017</td></tr>
<tr><td><strong>Trojan</strong></td><td>Disguises itself as legitimate software to trick user into installing it</td><td>Fake antivirus software that installs keylogger</td></tr>
<tr><td><strong>Spyware</strong></td><td>Secretly monitors user activity, captures passwords and sends to attacker</td><td>Keyloggers recording online banking credentials</td></tr>
<tr><td><strong>Ransomware</strong></td><td>Encrypts all files on device, demands payment for decryption key</td><td>WannaCry: demanded Bitcoin to unlock NHS computers</td></tr>
<tr><td><strong>Adware</strong></td><td>Displays unwanted adverts; may redirect browser or slow system</td><td>Pop-up ads appearing without user consent</td></tr>
</tbody></table>

<p><strong>Social engineering attacks (exploiting people, not technology):</strong></p>
<ul>
<li><strong>Phishing:</strong> fake emails mimicking trusted organisations (bank, HMRC) with malicious links or attachments</li>
<li><strong>Spear phishing:</strong> targeted phishing using personal information about the victim</li>
<li><strong>Vishing:</strong> voice phishing — phone calls pretending to be IT support, HMRC, or banks</li>
<li><strong>Pretexting:</strong> fabricated scenario to manipulate victim into revealing information</li>
<li><strong>Tailgating:</strong> following an authorised person through a secure door without their own credentials</li>
<li><strong>SQL injection:</strong> inserting malicious code into a web form field to manipulate a database — can extract all user records</li>
<li><strong>DDoS attack:</strong> floods server with so many fake requests it becomes overwhelmed and unavailable</li>
</ul>

<p><strong>Internal threats:</strong></p>
<ul>
<li>Accessing inappropriate websites (malware download risk, data exfiltration)</li>
<li>Accidentally emailing confidential data to the wrong recipient</li>
<li>Disgruntled employees stealing or selling data</li>
<li>Using unauthorised portable USB drives to copy sensitive data</li>
</ul>

<p><strong>Impact of a data breach:</strong></p>
<ul>
<li>Loss of data — customer records, intellectual property, financial data permanently compromised</li>
<li>Financial loss — GDPR fines up to £17.5 million, legal action from affected parties, recovery costs</li>
<li>Reputational damage — loss of customer trust, negative publicity, reduced market share</li>
</ul>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
When asked about a specific threat, state: (1) what it is, (2) how it works in the given scenario, (3) the impact on the organisation. A named example strengthens your answer in extended response questions.</div>`,true),

    topic('D2','Protection methods — encryption, firewalls, backups, RAID', `
<p>Protecting data requires a layered approach — no single measure is sufficient. Questions often ask you to evaluate which protection methods are most suitable for a given scenario.</p>

<table class="g-table"><thead><tr><th>Protection method</th><th>How it works</th><th>Best against</th></tr></thead><tbody>
<tr><td>Strong passwords + MFA</td><td>Complex passwords; two or more authentication factors (password + phone code + fingerprint)</td><td>Unauthorised login, stolen passwords</td></tr>
<tr><td>Biometric authentication</td><td>Fingerprint, facial recognition, iris scan — unique to each person</td><td>Impersonation, stolen passwords</td></tr>
<tr><td>File permissions / access levels</td><td>Users only see/modify data they are authorised for; least-privilege principle</td><td>Internal data theft, accidental modification</td></tr>
<tr><td>Encryption (stored data)</td><td>Data scrambled using a key; unreadable without decryption key</td><td>Theft of device, unauthorised physical access</td></tr>
<tr><td>Encryption (in transit — HTTPS/TLS)</td><td>Data encrypted between browser and server; TLS certificate verifies server identity</td><td>Network interception (man-in-the-middle attacks)</td></tr>
<tr><td>Antivirus software</td><td>Scans files against signature database; uses heuristic analysis for new threats; quarantines/deletes malware</td><td>Viruses, worms, trojans, spyware</td></tr>
<tr><td>Firewall</td><td>Monitors incoming/outgoing network traffic against rules; blocks unauthorised connections; can be hardware or software</td><td>Unauthorised network access, malware spreading over network</td></tr>
<tr><td>Digital certificates (HTTPS)</td><td>Verifies the identity of a website/server; issued by trusted Certificate Authorities</td><td>Phishing fake websites, man-in-the-middle</td></tr>
<tr><td>Physical access control</td><td>Locks, security badges, key cards, CCTV, security guards</td><td>Physical theft, tailgating, sabotage</td></tr>
</tbody></table>

<p><strong>Encryption — how it works:</strong></p>
<div class="guide-diagram">
<svg viewBox="0 0 540 90" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;font-family:var(--font);font-size:11px">
  <rect x="0" y="25" width="90" height="40" rx="6" fill="var(--surface)" stroke="var(--accent)" stroke-width="1.5"/>
  <text x="45" y="42" text-anchor="middle" fill="currentColor" font-size="10" font-weight="bold">Plaintext</text>
  <text x="45" y="57" text-anchor="middle" fill="currentColor" font-size="9">"Hello World"</text>
  <polygon points="100,45 120,35 120,55" fill="var(--accent)"/>
  <rect x="125" y="15" width="100" height="60" rx="6" fill="var(--accent)" stroke="none"/>
  <text x="175" y="40" text-anchor="middle" fill="var(--accent-ink)" font-size="10" font-weight="bold">Encryption</text>
  <text x="175" y="54" text-anchor="middle" fill="var(--accent-ink)" font-size="9">Key applied</text>
  <text x="175" y="68" text-anchor="middle" fill="var(--accent-ink)" font-size="9">(AES / RSA)</text>
  <polygon points="235,45 255,35 255,55" fill="var(--accent)"/>
  <rect x="260" y="25" width="100" height="40" rx="6" fill="var(--surface)" stroke="currentColor" stroke-width="1.5"/>
  <text x="310" y="42" text-anchor="middle" fill="currentColor" font-size="10" font-weight="bold">Ciphertext</text>
  <text x="310" y="57" text-anchor="middle" fill="currentColor" font-size="9">"x7#Kp!9z…"</text>
  <polygon points="370,45 390,35 390,55" fill="var(--accent)"/>
  <rect x="395" y="15" width="100" height="60" rx="6" fill="var(--accent)" stroke="none"/>
  <text x="445" y="40" text-anchor="middle" fill="var(--accent-ink)" font-size="10" font-weight="bold">Decryption</text>
  <text x="445" y="54" text-anchor="middle" fill="var(--accent-ink)" font-size="9">Key applied</text>
  <text x="445" y="68" text-anchor="middle" fill="var(--accent-ink)" font-size="9">(recipient only)</text>
  <polygon points="505,45 525,35 525,55" fill="var(--accent)"/>
  <rect x="510" y="25" width="28" height="40" rx="6" fill="var(--surface)" stroke="var(--accent)" stroke-width="1.5"/>
  <text x="524" y="42" text-anchor="middle" fill="currentColor" font-size="8">Plain</text>
  <text x="524" y="57" text-anchor="middle" fill="currentColor" font-size="8">text</text>
</svg>
<figcaption>Figure 2 — Encryption converts plaintext to ciphertext; only the holder of the key can decrypt it</figcaption>
</div>

<table class="g-table"><thead><tr><th>Encryption type</th><th>How it works</th><th>Use case</th></tr></thead><tbody>
<tr><td>Symmetric</td><td>Same key encrypts and decrypts — fast but key sharing is a risk</td><td>Encrypting stored files (BitLocker, AES disk encryption)</td></tr>
<tr><td>Asymmetric (public key)</td><td>Public key encrypts; only the matching private key decrypts — secure key exchange</td><td>HTTPS, email signing (PGP), digital certificates</td></tr>
</tbody></table>

<p><strong>Backup strategies:</strong></p>
<table class="g-table"><thead><tr><th>Strategy</th><th>What it backs up</th><th>Speed</th><th>Storage needed</th></tr></thead><tbody>
<tr><td>Full backup</td><td>Complete copy of all selected data</td><td>Slowest to create</td><td>Most storage</td></tr>
<tr><td>Incremental backup</td><td>Only data changed since the last backup (any type)</td><td>Fastest to create</td><td>Least storage per run</td></tr>
<tr><td>Differential backup</td><td>All data changed since the last full backup</td><td>Medium</td><td>Grows between full backups</td></tr>
</tbody></table>

<p><strong>3-2-1 backup rule:</strong> Keep <strong>3</strong> copies of data, on <strong>2</strong> different types of storage media, with <strong>1</strong> copy stored offsite (e.g. cloud or separate building). This protects against hardware failure, fire, and ransomware simultaneously.</p>

<p><strong>RAID (Redundant Array of Independent Disks):</strong></p>
<table class="g-table"><thead><tr><th>RAID level</th><th>Method</th><th>Benefit</th><th>Drawback</th></tr></thead><tbody>
<tr><td>RAID 0</td><td>Striping — data split across two drives</td><td>Improved read/write speed</td><td>No redundancy; one drive fails = all data lost</td></tr>
<tr><td>RAID 1</td><td>Mirroring — identical copy on a second drive</td><td>Full redundancy; instant failover</td><td>50% of storage capacity wasted</td></tr>
<tr><td>RAID 5</td><td>Striping + distributed parity (min 3 drives)</td><td>Good balance of speed and redundancy; one drive can fail safely</td><td>Rebuild time after failure can be lengthy</td></tr>
</tbody></table>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
A very common exam question: "How does HTTPS protect data?" Answer: HTTPS uses TLS (Transport Layer Security) to encrypt the connection between the browser and the web server. Even if the data is intercepted, it is unreadable without the decryption key. A digital certificate also verifies the identity of the server, preventing fake sites.</div>

<div class="mistake-box"><div class="mistake-label">&#9888; Common mistake</div>
A <strong>firewall</strong> monitors and blocks network traffic based on rules. It does NOT protect against phishing or social engineering — these attacks bypass technical controls by manipulating people. Emphasise that firewalls protect against external network intrusion, not human error.</div>`,true)
  ]);

  /* ============================================================
     AIM E — Impact of IT Systems
  ============================================================ */
  const aimE = aim('E', [
    topic('E1','Online services and transactional data', `
<table class="g-table"><thead><tr><th>Sector</th><th>Online service features</th><th>Examples</th></tr></thead><tbody>
<tr><td>Retail</td><td>24/7 shopping, product recommendations, personalised offers, secure payment</td><td>Amazon, ASOS, Tesco Online</td></tr>
<tr><td>Financial services</td><td>Online banking, transfers, investment platforms, insurance quotes</td><td>Barclays Online Banking, MoneySuper Market</td></tr>
<tr><td>Education/training</td><td>VLEs, video lessons, online assessments, digital credentials</td><td>Moodle, Coursera, BBC Bitesize</td></tr>
<tr><td>News/information</td><td>Real-time news, search engines, encyclopaedias, live blogs</td><td>BBC News, Google, Wikipedia</td></tr>
<tr><td>Entertainment/leisure</td><td>Video/music streaming, online gaming, social media</td><td>Netflix, Spotify, YouTube, Instagram</td></tr>
<tr><td>Booking systems</td><td>Travel booking, appointment scheduling, restaurant reservations</td><td>Trainline, NHS app, OpenTable</td></tr>
</tbody></table>

<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Transactional data</span> — data generated whenever a transaction occurs (purchase, login, click, search). Includes: what was bought/viewed, when, by whom, payment method, location, device used.</div>

<p><strong>Uses of transactional data:</strong></p>
<ul>
<li><strong>Targeted marketing:</strong> analysing purchase history and browsing behaviour to show personalised adverts</li>
<li><strong>Stock management:</strong> real-time sales data feeds directly into ordering systems to prevent stockouts</li>
<li><strong>Fraud detection:</strong> unusual spending patterns trigger automatic alerts or blocks</li>
<li><strong>Personalised recommendations:</strong> collaborative filtering (Amazon "customers also bought") and content-based filtering</li>
</ul>

<p><strong>Collaborative working:</strong></p>
<ul>
<li>Cloud-based tools (Google Docs, Microsoft 365) allow multiple users to edit the same document simultaneously</li>
<li>No version control problems — all changes are visible in real time</li>
<li>Benefits: global teams can work together, no email attachments needed, automatic version history</li>
<li>Risks: dependency on internet connection; shared access increases data security risk if credentials are compromised</li>
</ul>`,true),

    topic('E2','Data accuracy, verification, validation and UI design', `
<div class="def-box"><div class="def-label">Key definitions</div>
<span class="def-term">Primary data</span> — collected first-hand for a specific purpose (survey, interview, experiment).<br><br>
<span class="def-term">Secondary data</span> — existing data collected by others for a different purpose (government statistics, published research, competitor reports).</div>

<table class="g-table"><thead><tr><th>Data collection method</th><th>Advantages</th><th>Disadvantages</th></tr></thead><tbody>
<tr><td>Survey (online)</td><td>Large sample, quantitative, cheap, fast</td><td>Low response rate, no follow-up possible</td></tr>
<tr><td>Questionnaire (paper)</td><td>Anonymous, reaches those without internet</td><td>Slow, manual data entry, misinterpretation of questions</td></tr>
<tr><td>Interview</td><td>Rich qualitative data, follow-up questions possible</td><td>Time-consuming, interviewer bias, small sample</td></tr>
<tr><td>Focus group</td><td>Nuanced discussion, unexpected insights</td><td>Groupthink, small sample, dominant personalities skew results</td></tr>
<tr><td>Observation</td><td>Real behaviour captured, no self-reporting bias</td><td>Hawthorne effect (behaviour changes when being watched)</td></tr>
</tbody></table>

<p><strong>Verification vs Validation — key distinction:</strong></p>
<table class="g-table"><thead><tr><th></th><th>Verification</th><th>Validation</th></tr></thead><tbody>
<tr><td>Definition</td><td>Checking data was entered correctly (matches the source)</td><td>Checking data is in an acceptable format or range</td></tr>
<tr><td>When</td><td>During data entry</td><td>When data is submitted to the system</td></tr>
<tr><td>Method</td><td>Double entry (e.g. type password twice); read-back; proofreading</td><td>Automated rules applied by the software</td></tr>
<tr><td>Example</td><td>Typing email address twice and checking both match</td><td>System checks email contains an @ symbol</td></tr>
</tbody></table>

<p><strong>Validation check types:</strong></p>
<ul>
<li><strong>Presence check:</strong> field cannot be left blank (mandatory fields)</li>
<li><strong>Range check:</strong> value must be between min and max (e.g. age 0–120)</li>
<li><strong>Type check:</strong> value must match expected data type (number not text in age field)</li>
<li><strong>Format check:</strong> must match a pattern (UK postcode: e.g. SW1A 1AA)</li>
<li><strong>Length check:</strong> minimum/maximum number of characters (password min 8 chars)</li>
<li><strong>Lookup check:</strong> value must exist in a predefined list (country code from dropdown)</li>
</ul>

<p><strong>UI design characteristics:</strong></p>
<ul>
<li><strong>Ease of use:</strong> intuitive layout, logical navigation, minimal clicks to complete tasks</li>
<li><strong>Accessibility:</strong> works with screen readers, adjustable text size, WCAG colour contrast standards</li>
<li><strong>Error reduction:</strong> auto-complete, drop-down menus instead of free text, helpful error messages</li>
<li><strong>Functionality:</strong> all required features are present and working correctly</li>
<li><strong>Performance:</strong> fast loading, responsive on slow connections and older devices</li>
<li><strong>Compatibility:</strong> works across different devices, browsers and operating systems</li>
</ul>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
Verification and validation are often confused. Remember: <strong>verification = human checking</strong> (does data match the source?); <strong>validation = automated rule</strong> (is data in the correct format/range?). Both are needed — validation alone cannot catch a valid-but-wrong entry (e.g. typing the wrong but valid postcode).</div>`,true)
  ]);

  /* ============================================================
     AIM F — Issues
  ============================================================ */
  const aimF = aim('F', [
    topic('F1','Moral and ethical issues in IT', `
<p>Moral issues concern what is right or wrong; ethical issues concern professional conduct and responsibility in IT development and use.</p>

<p><strong>Privacy:</strong></p>
<ul>
<li>Personal data is collected at massive scale by platforms (browsing history, location, purchases)</li>
<li>This data is used for targeted advertising and may be sold to third parties</li>
<li>Ethical question: should organisations profit from selling personal data even with consent in terms and conditions?</li>
<li>Right to privacy vs free services funded by data — this is a genuine ongoing societal debate</li>
</ul>

<p><strong>Environmental impact of IT:</strong></p>
<ul>
<li>Data centres consume approximately 1–2% of global electricity</li>
<li>Manufacturing devices uses rare earth metals (lithium, cobalt, tantalum) with environmental and ethical mining concerns</li>
<li>E-waste: billions of devices discarded each year; toxic components leach into soil and water</li>
<li>Cloud computing can be more energy-efficient per workload but overall energy use is growing</li>
</ul>

<p><strong>Unequal access (Digital Divide):</strong></p>
<ul>
<li>Not everyone has equal access to IT: poverty, rural broadband gaps, developing nations</li>
<li>Digital literacy gap: older generations may lack the skills to access online services</li>
<li>Consequences: those without access miss out on online education, job applications, banking, healthcare</li>
<li>Government responses: subsidised broadband schemes, digital skills programmes, libraries as digital hubs</li>
</ul>

<p><strong>Acceptable Use Policies (AUPs):</strong></p>
<ul>
<li>A document setting out the rules for how an organisation's IT systems may be used</li>
<li>Typically covers: permitted websites, software installation policy, data handling, copyright compliance, social media during work hours</li>
<li>Legal standing: breaching an AUP can be grounds for disciplinary action or dismissal</li>
<li>All employees should sign the AUP and receive regular training</li>
</ul>

<p><strong>Netiquette:</strong></p>
<ul>
<li>Informal rules governing respectful online communication</li>
<li>Includes: appropriate language, no spam, respecting others' intellectual property, no sharing private information without consent</li>
<li>Cyberbullying: using IT to intimidate or harass others — both a moral issue and a potential criminal offence (Communications Act 2003)</li>
</ul>`,true),

    topic('F2','Legal issues — GDPR, Computer Misuse Act, Copyright and H&S', `
<table class="g-table"><thead><tr><th>Legislation</th><th>What it covers</th><th>Key provisions</th><th>Penalties</th></tr></thead><tbody>
<tr><td><strong>UK GDPR / Data Protection Act 2018</strong></td><td>Collection and use of personal data</td><td>Data must be: lawfully processed, used for stated purpose, kept accurate, stored securely, not kept longer than necessary. Individuals have rights: access, erasure, portability, objection</td><td>Fines up to £17.5m or 4% of global annual turnover (whichever higher)</td></tr>
<tr><td><strong>Computer Misuse Act 1990</strong></td><td>Unauthorised access to and modification of computer systems</td><td>Section 1: Accessing a system without authorisation. Section 2: Accessing with intent to commit further crime. Section 3: Unauthorised modification (planting virus, deleting files). Section 3A: Making or supplying hacking tools</td><td>Up to 10 years imprisonment (s3)</td></tr>
<tr><td><strong>Copyright, Designs and Patents Act 1988</strong></td><td>Ownership of creative works including software</td><td>Illegal to copy, distribute or use software/music/images without a licence. Code, websites, music, films, text and photographs are all protected. Software is covered by copyright from the moment of creation</td><td>Civil and criminal proceedings; unlimited fines</td></tr>
<tr><td><strong>Health and Safety (DSE) Regulations 1992</strong></td><td>Safe use of display screen equipment</td><td>Employers must: assess workstations, ensure regular breaks, offer eye tests, adjust equipment for posture, provide training</td><td>Employer civil liability, HSE fines</td></tr>
<tr><td><strong>Freedom of Information Act 2000</strong></td><td>Access to information held by public bodies</td><td>Public bodies must provide information on request within 20 days, unless exempt</td><td>ICO enforcement</td></tr>
</tbody></table>

<p><strong>GDPR — individual rights summary:</strong></p>
<ul>
<li><strong>Right of access:</strong> individuals can request a copy of all personal data held about them (Subject Access Request)</li>
<li><strong>Right to erasure ("right to be forgotten"):</strong> request deletion of personal data where no legitimate reason to keep it</li>
<li><strong>Right to data portability:</strong> receive personal data in a machine-readable format to transfer to another service</li>
<li><strong>Right to object:</strong> opt out of marketing, automated decision-making and profiling</li>
<li><strong>Consent:</strong> must be freely given, specific, informed and unambiguous — pre-ticked boxes do not count</li>
</ul>

<p><strong>Computer Misuse Act section summary:</strong></p>
<div class="formula-box">Section 1: Unauthorised access to any computer material → up to 2 years
Section 2: S1 offence with intent to commit a further crime → up to 5 years
Section 3: Unauthorised modification (virus, deleting files) → up to 10 years
Section 3A: Making/supplying tools designed for s1/s3 offences → up to 2 years</div>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>
In legal questions, always name the specific legislation and cite the specific provision. Do not just say "it's illegal." Say: "Under section 3 of the Computer Misuse Act 1990, planting ransomware on the NHS servers constitutes unauthorised modification of computer material, carrying a maximum sentence of 10 years imprisonment."</div>

<div class="mistake-box"><div class="mistake-label">&#9888; Common mistake</div>
Students often forget that copyright applies to <strong>software</strong> as well as music and films. Under the Copyright, Designs and Patents Act 1988, installing software without a valid licence is a breach of copyright. Also, websites, photographs and written text are all automatically protected — no registration is required.</div>`,true)
  ]);

  /* ---- Key Terms Glossary ---- */
  const glossary = `
<div class="guide-aim-section" id="guide-glossary">
  <div class="guide-aim-hd">
    <div class="guide-aim-badge" style="font-size:1rem">&#128218;</div>
    <div>
      <div class="guide-aim-title">Key Terms Glossary — All Aims</div>
      <div class="guide-aim-subtitle">Quick-reference definitions for all learning aims A–F</div>
    </div>
  </div>
  <div class="guide-topic open" id="gt-glossary">
    <div class="guide-topic-hd" onclick="toggleGT('gt-glossary')">
      <span class="guide-topic-code">REF</span>
      <span class="guide-topic-name">Key terms and definitions</span>
      <span class="guide-topic-chevron">&#9660;</span>
    </div>
    <div class="guide-topic-body">
      <table class="g-table"><thead><tr><th>Term</th><th>Definition</th></tr></thead><tbody>
      <tr><td>Bandwidth</td><td>Maximum data transfer rate of a connection, measured in bits per second (bps)</td></tr>
      <tr><td>Latency</td><td>Delay between sending a request and receiving a response, measured in milliseconds</td></tr>
      <tr><td>Protocol</td><td>Agreed set of rules governing how data is transmitted between devices</td></tr>
      <tr><td>Encryption</td><td>Process of scrambling data using a key so it is unreadable without the correct decryption key</td></tr>
      <tr><td>Firewall</td><td>Hardware or software that monitors and filters network traffic based on security rules</td></tr>
      <tr><td>Malware</td><td>Malicious software designed to damage, disrupt or gain unauthorised access to systems</td></tr>
      <tr><td>Phishing</td><td>Fraudulent emails or websites designed to steal credentials or install malware</td></tr>
      <tr><td>Cloud computing</td><td>Delivery of computing services (servers, storage, software) over the internet on a pay-per-use basis</td></tr>
      <tr><td>SaaS / PaaS / IaaS</td><td>Cloud service models: Software / Platform / Infrastructure as a Service</td></tr>
      <tr><td>VPN</td><td>Virtual Private Network — creates an encrypted tunnel through the internet for secure remote access</td></tr>
      <tr><td>GDPR</td><td>General Data Protection Regulation — governs how personal data is collected, stored and processed</td></tr>
      <tr><td>Computer Misuse Act</td><td>1990 UK law making it illegal to access or modify computer systems without authorisation</td></tr>
      <tr><td>Open source software</td><td>Software with publicly available source code that can be freely used, modified and distributed</td></tr>
      <tr><td>Lossy compression</td><td>Compression that permanently removes some data to achieve smaller file sizes (e.g. JPEG, MP3)</td></tr>
      <tr><td>Lossless compression</td><td>Compression that reduces file size without any data loss (e.g. PNG, FLAC)</td></tr>
      <tr><td>RAID</td><td>Redundant Array of Independent Disks — uses multiple drives for performance and/or redundancy</td></tr>
      <tr><td>Verification</td><td>Checking that data was entered correctly (matches the source document)</td></tr>
      <tr><td>Validation</td><td>Automated check that data is in the correct format or range before it is accepted by the system</td></tr>
      <tr><td>Embedded system</td><td>Computer built into a device for a specific dedicated purpose (e.g. car engine management unit)</td></tr>
      <tr><td>AUP</td><td>Acceptable Use Policy — document setting out rules for how an organisation's IT systems may be used</td></tr>
      </tbody></table>
    </div>
  </div>
</div>`;

  /* ---- Full guide HTML assembly ---- */
  function buildGuideHTML() {
    return `
<div class="guide-shell">
  <div class="guide-sidebar" id="guide-sidebar-it">
    ${buildSidebar()}
  </div>
  <div class="guide-main">
    <div class="guide-topbar">
      <div class="guide-progress-track"><div class="guide-progress-fill" id="guide-pf-it" style="width:0%"></div></div>
      <span class="guide-progress-text" id="guide-pt-it">0 / 6 aims revised</span>
      <button class="guide-print-btn" onclick="window.print()">&#128438; Print guide</button>
    </div>
    ${buildGuideGallery()}
    ${aimA}
    ${aimB}
    ${aimC}
    ${aimD}
    ${aimE}
    ${aimF}
    ${glossary}
  </div>
</div>`;
  }

  /* ---- Interactivity ---- */
  function updateProgress() {
    const revised = getRevised();
    const count = AIMS.filter(a => revised.includes(a)).length;
    const fill = document.getElementById('guide-pf-it');
    const text = document.getElementById('guide-pt-it');
    if (fill) fill.style.width = (count / AIMS.length * 100) + '%';
    if (text) text.textContent = count + ' / ' + AIMS.length + ' aims revised';
    AIMS.forEach(a => {
      const btn = document.getElementById('gmb-' + a);
      if (!btn) return;
      const done = revised.includes(a);
      btn.classList.toggle('revised', done);
      btn.innerHTML = done
        ? '<span class="guide-mark-icon">&#10003;</span> Aim ' + a + ' revised!'
        : '<span class="guide-mark-icon">&#9711;</span> Mark Aim ' + a + ' as revised';
    });
    // Sidebar TOC badge update
    AIMS.forEach(a => {
      const link = document.querySelector('.guide-toc-aim-link[onclick*="guide-aim-' + a + '"]');
      if (link) link.style.opacity = revised.includes(a) ? '0.7' : '1';
    });
  }

  function setupScrollSpy() {
    const sections = document.querySelectorAll('.guide-aim-section[id]');
    if (!sections.length) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        document.querySelectorAll('.guide-toc-aim-link').forEach(l => {
          l.classList.toggle('active', l.getAttribute('onclick') && l.getAttribute('onclick').includes(id));
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(s => observer.observe(s));
  }

  /* ---- Public API ---- */
  window.toggleGT = function(id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('open');
  };
  window.toggleGuideRevised = function(aimLetter) {
    const arr = getRevised();
    const idx = arr.indexOf(aimLetter);
    if (idx === -1) arr.push(aimLetter); else arr.splice(idx, 1);
    saveRevised(arr);
    updateProgress();
  };
  window.guideScrollTo = function(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // close sidebar on mobile
    const sb = document.getElementById('guide-sidebar-it');
    if (sb && window.innerWidth < 769) sb.classList.remove('sb-open');
  };

  window.initComprehensiveGuide = function() {
    const container = document.getElementById('guide-comprehensive');
    if (!container) return;
    if (container.dataset.built === '1') { updateProgress(); return; }
    container.innerHTML = buildGuideHTML();
    container.dataset.built = '1';
    updateProgress();
    setupScrollSpy();
  };

})();
