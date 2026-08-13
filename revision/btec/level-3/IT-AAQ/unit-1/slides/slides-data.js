// BTEC IT Unit 1 — Slides Data
// Each presentation has: aim, title, description, slides[]
// Each slide has: title, subtitle?, content (HTML)

window.SLIDES_DATA = {
  unitTitle: "BTEC IT Unit 1 — Devices, Networks & IT Systems",
  presentations: [
    {
      aim: "Aim A",
      title: "Digital Devices, Software & Choosing IT Systems",
      description: "PCs, mobile devices, servers, embedded systems, OS types, user interfaces, file formats and IT system selection factors.",
      slides: [
        { title: "Digital Devices", subtitle:"Types, features and real-world uses", content:`
<h3>What is a digital device?</h3>
<p>A digital device processes, stores or communicates information electronically using binary (0s and 1s).</p>
<div class="def-box"><div class="def-label">Key definition</div><strong>Embedded system</strong> — a dedicated computer built into a device to control a specific function. Has fixed hardware and software. Examples: car engine management unit, washing machine controller, pacemaker.</div>
<h3>Device types you must know:</h3>
<ul>
<li><strong>Desktop PC</strong> — upgradable, high power, mains powered</li>
<li><strong>Laptop</strong> — portable, battery, integrated screen/keyboard</li>
<li><strong>Tablet</strong> — touchscreen, lightweight, app-based</li>
<li><strong>Smartphone</strong> — cellular, GPS, camera, sensors</li>
<li><strong>Servers</strong> — file server (central storage), web server (hosts websites), application server (runs business logic)</li>
<li><strong>IoT/Embedded</strong> — sensor-equipped, low power, network connected</li>
</ul>` },
        { title: "Digital Devices — Uses Across Sectors", content:`
<h3>Where are digital devices used?</h3>
<table>
<tr><th>Sector</th><th>Devices used</th><th>Purpose</th></tr>
<tr><td>Healthcare</td><td>Tablets, embedded systems, servers</td><td>Patient records, diagnostic imaging, remote monitoring</td></tr>
<tr><td>Manufacturing</td><td>CNC machines (embedded), CAM systems, sensors</td><td>Automated production, quality control</td></tr>
<tr><td>Retail</td><td>EPOS terminals, barcode scanners, servers</td><td>Stock control, self-checkout, e-commerce</td></tr>
<tr><td>Education</td><td>Laptops, tablets, interactive whiteboards</td><td>VLEs, online assessments, digital resources</td></tr>
<tr><td>Creative</td><td>High-spec workstations, graphics tablets</td><td>Video editing, CAD, graphic design</td></tr>
</table>
<div class="exam-tip"><div class="tip-label">💡 Exam tip</div>When asked to identify a suitable device for a scenario, always state <em>why</em> by linking a feature to the need. "A tablet is suitable because its touchscreen allows intuitive interaction in the field."</div>` },
        { title: "Peripheral Devices & Storage", content:`
<h3>Input, Output & Storage Devices</h3>
<table>
<tr><th>Type</th><th>Examples</th></tr>
<tr><td>Input</td><td>Keyboard, mouse, scanner, webcam, microphone, touchscreen, barcode scanner</td></tr>
<tr><td>Output</td><td>Monitor, printer (inkjet/laser/3D), speakers, projector, Braille display</td></tr>
<tr><td>Storage</td><td>HDD, SSD, USB flash drive, SD card, optical disc, cloud storage</td></tr>
</table>
<h3>Storage comparison — the 4 Cs:</h3>
<table>
<tr><th>Type</th><th>Capacity</th><th>Speed</th><th>Cost/GB</th><th>Portability</th></tr>
<tr><td>HDD</td><td>Up to 20TB+</td><td>~150 MB/s</td><td>Very low</td><td>Low (fragile)</td></tr>
<tr><td>SSD</td><td>Up to 8TB</td><td>500–7000 MB/s</td><td>Medium</td><td>Medium</td></tr>
<tr><td>USB Flash</td><td>Up to 1TB</td><td>100–400 MB/s</td><td>Medium</td><td>Very high</td></tr>
<tr><td>Cloud</td><td>Scalable</td><td>Internet-dependent</td><td>Subscription</td><td>Anywhere</td></tr>
</table>
<div class="exam-tip"><div class="tip-label">💡 Remember the 4 Cs</div>Capacity, Cost, Speed (access), Compatibility/portability. Link each to the scenario.</div>` },
        { title: "Computer Software — OS, UI & File Types", content:`
<h3>Operating System Types</h3>
<table>
<tr><th>OS Type</th><th>Description</th><th>Example</th></tr>
<tr><td>Batch</td><td>Processes jobs without user interaction</td><td>Bank payroll processing</td></tr>
<tr><td>Real-time (RTOS)</td><td>Responds within guaranteed time limit</td><td>Aircraft avionics, medical devices</td></tr>
<tr><td>Multitasking</td><td>Runs multiple processes via time-slicing</td><td>Windows, macOS</td></tr>
<tr><td>Network OS</td><td>Manages shared resources and permissions</td><td>Windows Server, Linux server</td></tr>
<tr><td>Mobile</td><td>Touch-optimised, low power</td><td>Android, iOS</td></tr>
</table>
<h3>User Interface Types</h3>
<ul>
<li><strong>CLI:</strong> Text commands — fast, precise, steep learning curve</li>
<li><strong>Menu-driven:</strong> Structured menus — easy for beginners, limited</li>
<li><strong>GUI:</strong> Icons, windows, mouse — intuitive, resource-heavy</li>
<li><strong>Touchscreen GUI:</strong> Gesture-based — natural on mobile</li>
</ul>` },
        { title: "Choosing IT Systems — Factors & Impact", content:`
<h3>Factors affecting IT system choice:</h3>
<ul>
<li><strong>User needs:</strong> tasks, skill levels, accessibility requirements</li>
<li><strong>Technical specs:</strong> processor, RAM, storage, screen, battery</li>
<li><strong>Compatibility:</strong> existing hardware, software, networks</li>
<li><strong>Connectivity:</strong> Wi-Fi, Bluetooth, ports (USB-C, Ethernet)</li>
<li><strong>Cost:</strong> purchase, licensing, maintenance, subscriptions</li>
<li><strong>Security:</strong> encryption, biometrics, remote wipe</li>
<li><strong>Implementation:</strong> deployment time, training, data migration</li>
</ul>
<h3>Impact of new IT systems:</h3>
<table>
<tr><th>Area</th><th>Positive</th><th>Negative</th></tr>
<tr><td>Employees</td><td>Better tools, remote work</td><td>Need training, initial productivity drop</td></tr>
<tr><td>Customers</td><td>Better service, new channels</td><td>Disruption during changeover</td></tr>
<tr><td>Costs</td><td>Long-term automation savings</td><td>High upfront capital cost</td></tr>
</table>` },
        { title: "Emerging Technologies & AI", content:`
<h3>AI Application Types:</h3>
<ul>
<li><strong>Machine Learning:</strong> systems learn from data (spam filters, recommendations)</li>
<li><strong>NLP:</strong> understands/generates language (Siri, ChatGPT, translation)</li>
<li><strong>Computer Vision:</strong> interprets images/video (facial recognition, medical imaging)</li>
<li><strong>Robotics & Automation:</strong> AI-controlled physical systems (manufacturing, surgery)</li>
<li><strong>Predictive Analytics:</strong> forecasts from historical data (weather, stock market)</li>
</ul>
<h3>Impact on organisations:</h3>
<table>
<tr><th>Positive</th><th>Negative</th></tr>
<tr><td>Automates repetitive tasks 24/7, reduces human error</td><td>High initial cost, needs specialist skills</td></tr>
<tr><td>Creates new specialist roles</td><td>Displaces routine job roles</td></tr>
<tr><td>Better fraud detection, medical diagnosis</td><td>Privacy concerns, bias in AI decisions</td></tr>
</table>
<div class="exam-tip"><div class="tip-label">💡 Evaluate, don't just list</div>Always consider: the benefit, the drawback, and who is affected.</div>` }
      ]
    },
    {
      aim: "Aim B",
      title: "Transmitting Data — Networks & Protocols",
      description: "Connectivity methods, network topologies, LAN/WAN/VPN, TCP/IP, DNS, bandwidth, compression and codecs.",
      slides: [
        { title: "Connectivity — Wired & Wireless", content:`
<h3>Connection Methods</h3>
<table>
<tr><th>Method</th><th>Type</th><th>Speed</th><th>Range</th><th>Best for</th></tr>
<tr><td>Ethernet (Cat6)</td><td>Wired</td><td>1–10 Gbps</td><td>~100m</td><td>Office networks, servers</td></tr>
<tr><td>Wi-Fi 6</td><td>Wireless</td><td>Up to 9.6 Gbps</td><td>~50–100m</td><td>Home/office, BYOD</td></tr>
<tr><td>Bluetooth 5</td><td>Wireless</td><td>Up to 50 Mbps</td><td>~10–40m</td><td>Headphones, keyboards, IoT</td></tr>
<tr><td>Fibre optic</td><td>Wired</td><td>Up to 100 Gbps+</td><td>Kilometres</td><td>WAN backbone, broadband</td></tr>
<tr><td>5G mobile</td><td>Wireless</td><td>100 Mbps–1+ Gbps</td><td>Nationwide</td><td>Mobile internet, field devices</td></tr>
</table>
<div class="def-box"><div class="def-label">Key definitions</div><strong>Bandwidth</strong> — maximum data transfer rate (bps, Mbps, Gbps). <strong>Latency</strong> — delay between request and response (ms).</div>` },
        { title: "Network Topologies — Star, Bus, Ring", content:`
<h3>Star Topology</h3>
<ul><li>All devices connect to central switch/hub</li><li>✅ One failure doesn't affect others</li><li>✅ Easy to add/remove devices</li><li>❌ Central switch is single point of failure</li></ul>
<h3>Bus Topology</h3>
<ul><li>All devices share single backbone cable with terminators</li><li>✅ Cheap, simple to install</li><li>❌ Backbone failure = whole network down</li><li>❌ Performance degrades with more devices</li></ul>
<h3>Ring Topology</h3>
<ul><li>Devices in circular loop, data travels one direction</li><li>✅ Equal access, no collisions</li><li>❌ Any break stops all communication</li></ul>
<div class="exam-tip"><div class="tip-label">💡 Star is most common in modern networks</div>But always acknowledge its weakness: the central switch is a single point of failure.</div>` },
        { title: "Network Types — LAN, WAN, PAN, VPN", content:`
<table>
<tr><th>Type</th><th>Range</th><th>Example</th></tr>
<tr><td>PAN</td><td>~10m</td><td>Bluetooth between phone and laptop</td></tr>
<tr><td>LAN</td><td>Single building</td><td>School/office network — organisation-owned</td></tr>
<tr><td>WAN</td><td>Worldwide</td><td>The internet; multi-site bank network</td></tr>
<tr><td>VPN</td><td>Over internet</td><td>Remote workers accessing company servers securely</td></tr>
</table>
<div class="def-box"><div class="def-label">VPN explained</div>A VPN creates an encrypted tunnel through the internet. Data appears private and unreadable to interceptors. Allows remote employees secure access to internal LAN as if they were on-site.</div>` },
        { title: "Protocols, TCP/IP & Compression", content:`
<h3>Key Protocols</h3>
<table>
<tr><th>Protocol</th><th>Function</th></tr>
<tr><td>HTTP/HTTPS</td><td>Web page transfer (HTTPS = encrypted via TLS)</td></tr>
<tr><td>SMTP</td><td>Sends emails between servers</td></tr>
<tr><td>POP3/IMAP</td><td>Retrieves emails (POP3=download, IMAP=synced)</td></tr>
<tr><td>TCP</td><td>Reliable, ordered delivery — breaks data into packets</td></tr>
<tr><td>IP</td><td>Addresses and routes packets between networks</td></tr>
<tr><td>DNS</td><td>Translates domain names to IP addresses</td></tr>
</table>
<h3>TCP/IP 4-Layer Model</h3>
<ol><li>Application (HTTP, SMTP, DNS)</li><li>Transport (TCP, UDP)</li><li>Internet (IP)</li><li>Network Access (Ethernet, Wi-Fi)</li></ol>
<h3>Compression</h3>
<ul><li><strong>Lossy:</strong> permanently removes data — JPEG, MP3 — small files</li><li><strong>Lossless:</strong> no data lost — PNG, FLAC — larger files</li></ul>` }
      ]
    },
    {
      aim: "Aim C",
      title: "Operating Online — Cloud Computing & Communities",
      description: "IaaS/PaaS/SaaS, cloud deployment models, remote working, online communities and communication methods.",
      slides: [
        { title: "Cloud Computing Models — IaaS, PaaS, SaaS", content:`
<h3>Cloud Service Models</h3>
<table>
<tr><th>Model</th><th>Provider gives you</th><th>You manage</th><th>Examples</th></tr>
<tr><td>IaaS</td><td>Virtual hardware (servers, storage, networking)</td><td>OS, middleware, apps, data</td><td>AWS EC2, Azure VMs</td></tr>
<tr><td>PaaS</td><td>OS + dev tools + runtime</td><td>App code and data only</td><td>Heroku, Google App Engine</td></tr>
<tr><td>SaaS</td><td>Complete application — ready to use</td><td>Just data and settings</td><td>Google Workspace, Microsoft 365</td></tr>
</table>
<h3>Cloud Deployment Types</h3>
<ul><li><strong>Public:</strong> shared infrastructure, low cost, less control</li><li><strong>Private:</strong> dedicated, highest security, expensive</li><li><strong>Hybrid:</strong> sensitive data on private, scalable on public</li></ul>
<div class="exam-tip"><div class="tip-label">💡 Match the model to the organisation</div>Start-up → SaaS (no IT staff). Bank → Private cloud (compliance). Retailer → Hybrid (seasonal scale).</div>` },
        { title: "Online Communities & Communication", content:`
<h3>Communication Methods</h3>
<table>
<tr><th>Method</th><th>Examples</th><th>Use</th></tr>
<tr><td>Social media</td><td>Facebook, LinkedIn, X/Twitter</td><td>Marketing, networking</td></tr>
<tr><td>Blog/Vlog</td><td>WordPress, YouTube</td><td>Brand building, education</td></tr>
<tr><td>Wiki</td><td>Wikipedia, Confluence</td><td>Knowledge management</td></tr>
<tr><td>IM/Chat</td><td>WhatsApp, Slack, Teams</td><td>Team collaboration</td></tr>
<tr><td>Video conferencing</td><td>Zoom, Google Meet</td><td>Remote meetings, training</td></tr>
<tr><td>Forum</td><td>Reddit, Stack Overflow</td><td>Community support</td></tr>
</table>
<h3>Key Considerations</h3>
<ul><li>Privacy — what data is collected?</li><li>Security — risk of breaches, account hijacking</li><li>Cost — free vs paid tiers</li><li>Training — staff need to learn platforms</li><li>Integration — connects with existing systems?</li></ul>` }
      ]
    },
    {
      aim: "Aim D",
      title: "Protecting Data — Threats & Protection Methods",
      description: "Malware types, social engineering, encryption, firewalls, antivirus, backups, RAID and physical security.",
      slides: [
        { title: "Threats to Data — Malware & Social Engineering", content:`
<h3>Malware Types</h3>
<table>
<tr><th>Type</th><th>How it works</th></tr>
<tr><td>Virus</td><td>Attaches to files; needs user action to spread</td></tr>
<tr><td>Worm</td><td>Self-replicates across networks automatically</td></tr>
<tr><td>Trojan</td><td>Disguises as legitimate software</td></tr>
<tr><td>Ransomware</td><td>Encrypts files, demands payment</td></tr>
<tr><td>Spyware</td><td>Secretly monitors activity, captures passwords</td></tr>
</table>
<h3>Social Engineering</h3>
<ul>
<li><strong>Phishing:</strong> fake emails pretending to be trusted organisations</li>
<li><strong>Spear phishing:</strong> targeted using personal information</li>
<li><strong>Vishing:</strong> voice phishing — fake phone calls</li>
<li><strong>Tailgating:</strong> following someone through a secure door</li>
<li><strong>SQL injection:</strong> malicious code in web forms</li>
<li><strong>DDoS:</strong> flooding server with fake traffic</li>
</ul>` },
        { title: "Protection Methods — Encryption, Firewalls, Backups", content:`
<h3>Defence in Depth — Multiple Layers</h3>
<table>
<tr><th>Method</th><th>How it works</th><th>Protects against</th></tr>
<tr><td>Encryption</td><td>Scrambles data with a key</td><td>Data theft, interception (MITM)</td></tr>
<tr><td>Firewall</td><td>Filters traffic by rules</td><td>Unauthorised network access</td></tr>
<tr><td>Antivirus</td><td>Scans against signature database</td><td>Viruses, worms, trojans</td></tr>
<tr><td>MFA</td><td>Two+ authentication factors</td><td>Stolen passwords</td></tr>
<tr><td>Backups</td><td>3-2-1 rule: 3 copies, 2 media, 1 offsite</td><td>Ransomware, hardware failure</td></tr>
<tr><td>Access control</td><td>Least privilege principle</td><td>Insider threats, compromised accounts</td></tr>
</table>
<h3>Encryption Flow</h3>
<p>Plaintext → [Encryption Key] → Ciphertext (unreadable) → [Decryption Key] → Plaintext</p>
<div class="exam-tip"><div class="tip-label">💡 HTTPS = TLS encryption</div>HTTPS uses TLS to encrypt the connection. Even if intercepted, data is unreadable. Digital certificate verifies server identity.</div>` }
      ]
    },
    {
      aim: "Aim E",
      title: "Impact of IT — Online Services & Data Accuracy",
      description: "Online services, transactional data, collaborative working, verification vs validation and UI design.",
      slides: [
        { title: "Online Services & Transactional Data", content:`
<h3>Online Services by Sector</h3>
<table>
<tr><th>Sector</th><th>Features</th><th>Examples</th></tr>
<tr><td>Retail</td><td>24/7 shopping, recommendations, secure payment</td><td>Amazon, ASOS</td></tr>
<tr><td>Financial</td><td>Online banking, transfers, insurance quotes</td><td>Barclays, MoneySuperMarket</td></tr>
<tr><td>Education</td><td>VLEs, video lessons, online assessments</td><td>Moodle, BBC Bitesize</td></tr>
<tr><td>Entertainment</td><td>Streaming, gaming, social media</td><td>Netflix, Spotify, YouTube</td></tr>
<tr><td>Booking</td><td>Travel, appointments, reservations</td><td>Trainline, NHS app</td></tr>
</table>
<h3>Transactional Data Uses</h3>
<ul><li>Targeted marketing — personalised ads from purchase history</li><li>Stock management — real-time sales feed ordering systems</li><li>Fraud detection — unusual patterns trigger alerts</li><li>Recommendations — "customers also bought"</li></ul>` },
        { title: "Verification vs Validation & UI Design", content:`
<h3>Verification vs Validation</h3>
<table>
<tr><th></th><th>Verification</th><th>Validation</th></tr>
<tr><td>What</td><td>Was data entered correctly?</td><td>Is data acceptable?</td></tr>
<tr><td>How</td><td>Double entry, proofreading</td><td>Automated rules (format, range)</td></tr>
<tr><td>Example</td><td>Type email twice</td><td>System checks for @ symbol</td></tr>
</table>
<h3>UI Design Characteristics</h3>
<ul><li><strong>Ease of use:</strong> intuitive layout, logical navigation</li><li><strong>Accessibility:</strong> screen readers, WCAG contrast</li><li><strong>Error reduction:</strong> auto-complete, dropdowns, helpful messages</li><li><strong>Performance:</strong> fast loading, responsive</li><li><strong>Compatibility:</strong> works across devices and browsers</li></ul>
<div class="exam-tip"><div class="tip-label">💡 Remember the distinction</div>Verification = human checking (matches source?). Validation = automated rule (correct format?). Both are needed.</div>` }
      ]
    },
    {
      aim: "Aim F",
      title: "Issues — Moral, Ethical & Legal Aspects of IT",
      description: "Privacy, digital divide, environmental impact, AUPs, GDPR, Computer Misuse Act, Copyright and Health & Safety.",
      slides: [
        { title: "Moral & Ethical Issues in IT", content:`
<h3>Key Moral/Ethical Issues</h3>
<ul>
<li><strong>Privacy:</strong> personal data collected at massive scale for ads; sold to third parties</li>
<li><strong>Environmental:</strong> data centres use ~1-2% global electricity; e-waste is growing crisis</li>
<li><strong>Digital Divide:</strong> unequal access due to poverty, rural gaps, digital literacy</li>
<li><strong>Acceptable Use Policies (AUP):</strong> rules for using organisational IT — breaching can mean dismissal</li>
<li><strong>Netiquette:</strong> respectful online communication; cyberbullying is both moral issue and criminal offence</li>
<li><strong>Assistive technology access:</strong> right to access IT regardless of disability</li>
</ul>
<h3>Environmental Impact of IT</h3>
<ul><li>Data centres: 1-2% of global electricity</li><li>Device manufacturing: rare earth metals, ethical mining concerns</li><li>E-waste: billions of devices discarded yearly, toxic components</li><li>Cloud can be more efficient per workload but total energy use grows</li></ul>` },
        { title: "UK Legislation for IT", content:`
<h3>Key Legislation — Know These for the Exam</h3>
<table>
<tr><th>Law</th><th>What it covers</th><th>Max penalty</th></tr>
<tr><td>UK GDPR / DPA 2018</td><td>Personal data collection and use</td><td>£17.5m or 4% turnover</td></tr>
<tr><td>Computer Misuse Act 1990</td><td>Unauthorised access/modification</td><td>10 years (S3)</td></tr>
<tr><td>Copyright, Designs & Patents Act 1988</td><td>Creative works including software</td><td>Unlimited fines</td></tr>
<tr><td>DSE Regulations 1992</td><td>Safe use of display screen equipment</td><td>HSE fines</td></tr>
<tr><td>Freedom of Information 2000</td><td>Access to public body information</td><td>ICO enforcement</td></tr>
</table>
<h3>GDPR Individual Rights</h3>
<ul><li>Right of access (Subject Access Request)</li><li>Right to erasure ("right to be forgotten")</li><li>Right to data portability</li><li>Right to object to marketing/profiling</li></ul>
<div class="exam-tip"><div class="tip-label">💡 Name the legislation and section</div>Don't say "it's illegal." Say "Under Section 3 of the Computer Misuse Act 1990, this constitutes unauthorised modification..."</div>` }
      ]
    }
  ]
};
