/* IT AAQ Unit 2 — Comprehensive Revision Guide
   Cyber Security & Incident Management
   Initialised by calling window.initComprehensiveGuide() */
(function () {
  'use strict';

  const STORE_KEY = 'ra10-guide-revised-IT-u2';
  const AIMS = ['A','B','C','D'];
  const AIM_TITLES = {
    A: 'Cyber security threats, vulnerabilities & protection',
    B: 'Networking architectures & principles for security',
    C: 'Cyber security documentation',
    D: 'Forensic procedures'
  };
  const AIM_SUBTITLES = {
    A: 'Internal/external threats, system vulnerabilities, legal responsibilities, protection measures',
    B: 'Network types, topologies, components, infrastructure services, modern trends',
    C: 'Internal IT security policies: cyber security, audits, backups, data protection, disaster recovery',
    D: 'Forensic collection of evidence and systematic analysis of a suspect system'
  };

  function getRevised() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch { return []; }
  }
  function saveRevised(arr) { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); }

  function buildSidebar() {
    const items = [
      { aim:'A', topics:[['A1','Threats'],['A2','Vulnerabilities'],['A3','Legal responsibilities'],['A4','Protection measures']] },
      { aim:'B', topics:[['B1','Network types & topologies'],['B2','Components & media'],['B3','Infrastructure services']] },
      { aim:'C', topics:[['C1','Internal security policies'],['C1.2','Audits, backups & data protection'],['C1.5','Incident & disaster recovery policies']] },
      { aim:'D', topics:[['D1','Forensic collection of evidence'],['D2','Analysis & security reports']] }
    ];
    return `
<button class="guide-sb-toggle" onclick="this.closest('.guide-sidebar').classList.toggle('sb-open')">
  <span>&#9776; Contents</span><span>&#8595;</span>
</button>
<div class="guide-sidebar-hd">
  <span class="guide-toc-label">Unit 2 Guide</span>
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
    { aim:'A', kicker:'Defence', title:'Threats, vulnerabilities and protection', copy:'Malware, social engineering, encryption, firewalls and authentication — the core of cyber hygiene.', image:'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1200&q=80' },
    { aim:'C', kicker:'Governance', title:'Cyber security documentation', copy:'Policies, audits, backups, data protection and disaster recovery.', image:'https://images.unsplash.com/photo-1563986768609-322da13575f2?auto=format&fit=crop&w=1200&q=80' },
    { aim:'D', kicker:'Investigation', title:'Forensic procedures', copy:'Evidence collection, systematic analysis, chain of custody and reporting.', image:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' }
  ];

  function buildGuideGallery() {
    return `
<section class="guide-gallery" aria-label="Unit 2 visual overview">
  ${GUIDE_GALLERY.map(card => `
  <button class="guide-gallery-card" type="button" onclick="guideScrollTo('guide-aim-${card.aim}')" style="--guide-card-image:url('${card.image}')">
    <span class="guide-gallery-kicker">${card.kicker}</span>
    <span class="guide-gallery-title">${card.title}</span>
    <span class="guide-gallery-copy">${card.copy}</span>
    <span class="guide-gallery-source">Royalty-free stock photo</span>
  </button>`).join('')}
</section>`;
  }

  /* ============================================================
     AIM A — Cyber Hygiene
  ============================================================ */
  const aimA = aim('A', [
    topic('A1','Cyber Security Threats — threat actors, malware and social engineering', `
<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Threat actor</span> — an individual, group or organisation that poses a threat to cyber security. Threat actors vary in motivation (financial, political, ideological), capability and resources.</div>

<p><strong>Threat actor types — from least to most sophisticated:</strong></p>
<table class="g-table"><thead><tr><th>Type</th><th>Motivation</th><th>Capability</th><th>Typical targets</th></tr></thead><tbody>
<tr><td><strong>Script kiddies</strong></td><td>Thrill, notoriety</td><td>Low — uses pre-built tools</td><td>Unpatched systems, easy targets</td></tr>
<tr><td><strong>Hacktivists</strong></td><td>Political/social change</td><td>Low–Medium</td><td>Government websites, corporations</td></tr>
<tr><td><strong>Cyber criminals</strong></td><td>Financial gain</td><td>Medium–High</td><td>Businesses, individuals (ransomware, fraud)</td></tr>
<tr><td><strong>Insider threats</strong></td><td>Revenge, financial, negligence</td><td>Variable</td><td>Their own organisation</td></tr>
<tr><td><strong>State-sponsored</strong></td><td>Espionage, sabotage</td><td>Very High</td><td>Government, critical infrastructure</td></tr>
<tr><td><strong>APTs</strong></td><td>Long-term espionage</td><td>Very High</td><td>Specific high-value targets, undetected for months/years</td></tr>
</tbody></table>

<p><strong>Malware types — the six you must know for the exam:</strong></p>
<table class="g-table"><thead><tr><th>Type</th><th>How it works</th><th>Spreads via</th><th>Real-world example</th></tr></thead><tbody>
<tr><td><strong>Virus</strong></td><td>Attaches to files; activates when file opened</td><td>Infected files, email attachments, USB drives</td><td>ILOVEYOU (2000)</td></tr>
<tr><td><strong>Worm</strong></td><td>Self-replicates across networks — no user action needed</td><td>Network vulnerabilities, email</td><td>WannaCry (2017) — NHS</td></tr>
<tr><td><strong>Trojan</strong></td><td>Disguises as legitimate software; user installs it willingly</td><td>Fake apps, email attachments, downloads</td><td>Zeus banking trojan</td></tr>
<tr><td><strong>Ransomware</strong></td><td>Encrypts files; demands ransom for decryption key</td><td>Email, exploit kits, RDP</td><td>WannaCry, NotPetya</td></tr>
<tr><td><strong>Spyware / Keylogger</strong></td><td>Secretly records keystrokes, captures passwords and data</td><td>Trojan downloads, drive-by downloads</td><td>DarkHotel keylogger</td></tr>
<tr><td><strong>Botnet</strong></td><td>Network of compromised devices controlled remotely</td><td>Worms, trojans, IoT exploits</td><td>Mirai botnet (IoT DDoS)</td></tr>
</tbody></table>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip — Malware comparison</div>Be ready to compare virus vs worm: a virus needs <em>user action</em> (opening a file), a worm <em>self-propagates</em> across networks. This distinction appears frequently.</div>

<p><strong>Social engineering attacks — exploiting the human factor:</strong></p>
<table class="g-table"><thead><tr><th>Attack</th><th>Method</th><th>Defence</th></tr></thead><tbody>
<tr><td><strong>Phishing</strong></td><td>Mass emails impersonating trusted organisations with malicious links/attachments</td><td>Email filtering, user training, hover over links</td></tr>
<tr><td><strong>Spear phishing</strong></td><td>Targeted phishing using personal info about the victim</td><td>MFA, verification culture, security awareness</td></tr>
<tr><td><strong>Whaling</strong></td><td>Spear phishing aimed at senior executives (CEO fraud)</td><td>Payment verification procedures, MFA for financial transactions</td></tr>
<tr><td><strong>Vishing</strong></td><td>Voice phishing — phone calls pretending to be banks, IT support, HMRC</td><td>Never give credentials over phone, call back on official number</td></tr>
<tr><td><strong>Smishing</strong></td><td>SMS phishing — text messages with malicious links</td><td>Don't click SMS links from unknown senders</td></tr>
<tr><td><strong>Pretexting</strong></td><td>Fabricated scenario to extract information</td><td>Verify identity independently before sharing info</td></tr>
<tr><td><strong>Baiting</strong></td><td>Leaving infected USB drives in car parks for victims to find and plug in</td><td>Never plug in unknown USB devices, disable autorun</td></tr>
<tr><td><strong>Tailgating</strong></td><td>Following authorised person through secure door</td><td>Security guards, mantraps, turnstiles, awareness</td></tr>
<tr><td><strong>Shoulder surfing</strong></td><td>Watching someone type their password or view sensitive data</td><td>Privacy screens, awareness of surroundings</td></tr>
</tbody></table>

<div class="mistake-box"><div class="mistake-label">&#9888; Common mistake</div>
Students confuse phishing and spear phishing. Remember: phishing is <strong>generic/mass</strong> (spray and pray); spear phishing is <strong>targeted at a specific individual</strong> using research about them. Whaling takes it further by targeting only C-suite executives.</div>

<p><strong>Network-based attacks:</strong></p>
<ul>
<li><strong>DoS (Denial of Service):</strong> single source floods target → server overwhelmed, legitimate users denied</li>
<li><strong>DDoS (Distributed DoS):</strong> multiple compromised devices (botnet) flood target simultaneously — much harder to block</li>
<li><strong>Man-in-the-Middle (MITM):</strong> attacker intercepts communication between two parties — mitigated by HTTPS/TLS</li>
<li><strong>DNS poisoning:</strong> corrupts DNS cache to redirect users to fake websites</li>
<li><strong>ARP spoofing:</strong> attacker sends fake ARP messages to associate their MAC with another device's IP — intercepts LAN traffic</li>
<li><strong>SQL injection:</strong> malicious SQL injected via input fields to manipulate database — prevented by parameterised queries</li>
<li><strong>XSS (Cross-Site Scripting):</strong> malicious scripts injected into web pages viewed by others</li>
</ul>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip — Extended response</div>When explaining a DDoS attack for 4+ marks, cover: (1) what it is (multiple compromised devices flooding), (2) how it works (botnet sends millions of requests), (3) impact (server overwhelmed, unable to serve legitimate users), (4) consequence to the specific business in the scenario (revenue loss, reputation damage, customer loss).</div>`,true),

    topic('A2','System Vulnerabilities — software, network, human and supply chain', `
<p>Vulnerabilities are weaknesses that can be exploited by threats to gain unauthorised access or cause harm. Understanding where vulnerabilities exist is the first step to mitigating them.</p>

<table class="g-table"><thead><tr><th>Category</th><th>Vulnerability</th><th>Risk</th><th>Mitigation</th></tr></thead><tbody>
<tr><td rowspan="3"><strong>Software</strong></td><td>Unpatched systems</td><td>Known exploits available to attackers</td><td>Regular patch management, automated updates</td></tr>
<tr><td>Zero-day exploits</td><td>No patch exists — maximum danger</td><td>IDS/IPS, application whitelisting, least privilege</td></tr>
<tr><td>Legacy/end-of-life systems</td><td>No more security updates from vendor</td><td>Replace/upgrade, isolate from main network</td></tr>
<tr><td rowspan="3"><strong>Network</strong></td><td>Open/unnecessary ports</td><td>Attack surface for scanning and exploitation</td><td>Close unused ports, firewall rules, regular port scans</td></tr>
<tr><td>Weak/misconfigured encryption</td><td>Data can be intercepted and read</td><td>Use strong protocols (WPA3, TLS 1.3), disable legacy</td></tr>
<tr><td>Default credentials on devices</td><td>Attackers can access using publicly known defaults</td><td>Change all default passwords on installation</td></tr>
<tr><td rowspan="3"><strong>Human</strong></td><td>Poor password practices</td><td>Accounts easily compromised</td><td>Password policy, MFA, password managers</td></tr>
<tr><td>Lack of security training</td><td>Staff fall for phishing, social engineering</td><td>Regular training, phishing simulations, reporting culture</td></tr>
<tr><td>Insider threats</td><td>Authorised users abuse access</td><td>Least privilege, monitoring, separation of duties</td></tr>
<tr><td><strong>Supply chain</strong></td><td>Third-party software/vendor access</td><td>Compromised vendor compromises you</td><td>Vendor security assessments, least privilege for third parties</td></tr>
</tbody></table>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>The spec explicitly mentions supply chain risks. If a question asks about vulnerabilities in a large organisation, always mention that third-party vendors, cloud providers and software suppliers create additional attack surfaces beyond the organisation's direct control.</div>`,true),

    topic('A3','Legal Responsibilities — GDPR and the Computer Misuse Act', `
<p>Cyber security professionals must operate within the law. The AAQ Unit 2 spec covers two key pieces of legislation:</p>

<table class="g-table"><thead><tr><th>Legislation</th><th>What it covers</th><th>Key points for the exam</th></tr></thead><tbody>
<tr><td><strong>General Data Protection Regulation (GDPR)</strong></td><td>Requirements for the protection of data and privacy rights</td><td>Seven principles; legal reasons for processing; individual rights; protects personal data from unauthorised access and modification</td></tr>
<tr><td><strong>Computer Misuse Act 1990</strong></td><td>Protects personal data held by organisations from unauthorised access and modification</td><td>Makes unauthorised access to computers/devices and unauthorised access to/modification of data illegal</td></tr>
</tbody></table>

<p><strong>Areas the legislation applies to:</strong></p>
<ul>
<li>Protection of data — in storage and when transferred</li>
<li>Privacy and personally identifying information (PII)</li>
<li>Unauthorised access to computers/devices</li>
<li>Unauthorised access to and modification of data</li>
</ul>

<p><strong>GDPR principles</strong> — data must be processed:</p>
<ul>
<li>Lawfully, fairly and transparently</li>
<li>For limited, stated purposes</li>
<li>Accurately, and kept for the minimum amount of time</li>
<li>With only the minimum amount of data collected</li>
<li>With confidentiality and integrity maintained</li>
</ul>

<p><strong>Legal reasons for data processing:</strong> consent, contractual obligation, legitimate interest, vital interest, legal requirement, and public interest.</p>

<p><strong>Personal rights under GDPR</strong> — people have the right to:</p>
<ul>
<li>Access their own personal data</li>
<li>Be informed about how and why their data is used</li>
<li>Have their data corrected, removed or restricted</li>
<li>Object to their data being used</li>
<li>Data portability (data supplied in a machine-readable format)</li>
<li>Not be subject to decisions based solely on automated processing</li>
</ul>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip — legislation</div>The Computer Misuse Act 1990 requires organisations to exercise due care to comply with their security obligations under GDPR. Link the two: a data breach can be both a Computer Misuse Act offence (unauthorised access) and a GDPR failure (failure to protect personal data).</div>`,true),

    topic('A4','Protection Measures — firewalls, encryption, authentication, access control', `
<p>Cyber security uses a <strong>defence-in-depth</strong> approach — multiple layers of protection so that if one fails, others still provide security. No single measure is enough.</p>

<p><strong>1. Firewalls — the first line of network defence:</strong></p>
<table class="g-table"><thead><tr><th>Type</th><th>How it works</th><th>Strength</th><th>Weakness</th></tr></thead><tbody>
<tr><td>Packet filtering</td><td>Inspects packet headers (IP, port) against rules</td><td>Fast, simple</td><td>Cannot inspect content; easily bypassed</td></tr>
<tr><td>Stateful inspection</td><td>Tracks connection state; understands context</td><td>Better security than packet filtering</td><td>Still doesn't inspect application data</td></tr>
<tr><td>Application/Proxy</td><td>Inspects packet content at Layer 7</td><td>Can block specific applications/content</td><td>Slower; more processing overhead</td></tr>
<tr><td>NGFW</td><td>Combines firewall + IPS + app awareness + threat intelligence</td><td>Comprehensive protection</td><td>Expensive; complex to configure</td></tr>
</tbody></table>

<p><strong>2. Encryption — protecting data at rest and in transit:</strong></p>
<ul>
<li><strong>Symmetric (AES):</strong> same key encrypts and decrypts — fast, used for bulk data (file encryption, disk encryption like BitLocker)</li>
<li><strong>Asymmetric (RSA):</strong> public key encrypts, private key decrypts — slower but solves key exchange. Used in TLS/HTTPS, digital signatures</li>
<li><strong>Hashing (SHA-256):</strong> one-way function — cannot be reversed. Used for password storage (store the hash, not the password) and file integrity verification</li>
<li><strong>TLS/SSL:</strong> the protocol behind HTTPS — uses asymmetric encryption to exchange a symmetric session key, then symmetric for data transfer (hybrid approach)</li>
<li><strong>Digital certificates:</strong> issued by Certificate Authorities (CAs) to verify a website's identity — prevents MITM attacks by proving the server is genuine</li>
<li><strong>End-to-End Encryption (E2EE):</strong> only the sender and recipient can read messages (e.g. WhatsApp, Signal) — not even the platform provider can access content</li>
</ul>

<div class="formula-box">Encryption = Plaintext → [Encryption Key] → Ciphertext (unreadable) → [Decryption Key] → Plaintext</div>

<p><strong>3. Authentication — proving who you are:</strong></p>
<table class="g-table"><thead><tr><th>Factor category</th><th>Examples</th><th>Strength</th><th>Weakness</th></tr></thead><tbody>
<tr><td>Something you KNOW</td><td>Password, PIN, security question</td><td>Simple, familiar</td><td>Can be forgotten, guessed, stolen via phishing</td></tr>
<tr><td>Something you HAVE</td><td>Smartphone (authenticator app), hardware token, smart card</td><td>Harder to steal remotely</td><td>Can be lost, stolen, or cloned</td></tr>
<tr><td>Something you ARE</td><td>Fingerprint, facial recognition, iris scan, voice pattern</td><td>Very hard to fake</td><td>Cannot be changed if compromised; false rejection rate</td></tr>
<tr><td>Somewhere you ARE</td><td>GPS location, IP address, geofencing</td><td>Contextual security</td><td>Can be spoofed via VPN/proxy</td></tr>
<tr><td>Something you DO</td><td>Typing pattern, signature behaviour, gait analysis</td><td>Continuous authentication</td><td>Can vary (injury, different keyboard)</td></tr>
</tbody></table>

<div class="exam-tip"><div class="tip-label">&#128161; MFA — The Gold Standard</div>MFA requires at least two <em>different</em> factor types. Password + security question = NOT MFA (both are "something you know"). Password + authenticator app code = MFA (knowledge + possession). Password + fingerprint = MFA (knowledge + inherence).</div>

<p><strong>4. Access Control:</strong></p>
<ul>
<li><strong>DAC (Discretionary):</strong> file owner decides who can access — flexible but harder to manage at scale</li>
<li><strong>MAC (Mandatory):</strong> system enforces access based on security labels/clearance — most secure, used in military/government</li>
<li><strong>RBAC (Role-Based):</strong> permissions assigned to roles, users assigned to roles — most common in business</li>
<li><strong>Principle of least privilege:</strong> users get minimum access needed for their job — limits damage from compromised accounts</li>
<li><strong>Separation of duties:</strong> critical tasks require two people — prevents fraud and accidental damage</li>
</ul>

<p><strong>5. Device and physical security:</strong></p>
<ul>
<li><strong>Screen lock with automatic timeout</strong> — prevents unauthorised access when workstation unattended</li>
<li><strong>Remote wipe capability</strong> — if device lost/stolen, organisation can erase all data remotely</li>
<li><strong>GPS tracking / phone home</strong> — locate lost devices</li>
<li><strong>Trusted Platform Module (TPM)</strong> — hardware chip for secure key storage and device integrity verification</li>
<li><strong>Secure boot</strong> — ensures only trusted OS loads at startup</li>
<li><strong>Physical controls:</strong> biometric door locks, CCTV, security guards, access badges, equipment locks, protected cabling</li>
</ul>

<div class="mistake-box"><div class="mistake-label">&#9888; Common mistake</div>A firewall monitors and blocks network traffic based on rules. It does NOT protect against phishing (which targets people, not network traffic) or malware already on a device. Always match the protection measure to the specific threat in the question.</div>`,true)
  ]);

  /* ============================================================
     AIM B — Networking for Security
  ============================================================ */
  const aimB = aim('B', [
    topic('B1','Network Types, Topologies and Architecture', `
<p>Understanding network architectures is fundamental to securing them. Different network types and topologies have different security implications.</p>

<table class="g-table"><thead><tr><th>Network type</th><th>Scope</th><th>Security considerations</th></tr></thead><tbody>
<tr><td><strong>LAN</strong></td><td>Single building/site</td><td>Physically controlled; trust internal traffic but don't assume it's safe</td></tr>
<tr><td><strong>WLAN</strong></td><td>Wireless LAN</td><td>Requires WPA3 encryption, MAC filtering, hidden SSID; vulnerable to eavesdropping if unsecured</td></tr>
<tr><td><strong>WAN</strong></td><td>Multiple sites globally</td><td>Traffic crosses public infrastructure — must use VPN/encryption</td></tr>
<tr><td><strong>SAN</strong></td><td>Dedicated storage network</td><td>Isolate from user network; use access controls, encryption, zoning</td></tr>
<tr><td><strong>PAN</strong></td><td>Personal devices (~10m)</td><td>Bluetooth vulnerabilities; ensure pairing is authenticated, use latest BT version</td></tr>
<tr><td><strong>Intranet</strong></td><td>Private internal web</td><td>Only internal access; still requires authentication for sensitive content</td></tr>
<tr><td><strong>Extranet</strong></td><td>Extended to partners/suppliers</td><td>External access increases risk — use VPN, MFA, strict access controls</td></tr>
</tbody></table>

<p><strong>Network topologies and security:</strong></p>
<table class="g-table"><thead><tr><th>Topology</th><th>Security advantage</th><th>Security risk</th></tr></thead><tbody>
<tr><td><strong>Star</strong></td><td>Central switch can implement port security, VLANs, MAC filtering</td><td>Switch is single point of failure — must be physically and logically secured</td></tr>
<tr><td><strong>Extended star</strong></td><td>Segmented — compromise of one branch doesn't affect others</td><td>Each interconnecting link must be secured</td></tr>
<tr><td><strong>Hierarchical</strong></td><td>Core/distribution/access layers — apply security at each tier</td><td>Core compromise affects everything</td></tr>
<tr><td><strong>Wireless mesh</strong></td><td>Self-healing; no single point of failure</td><td>Each node is a potential entry point; all must be equally secured</td></tr>
</tbody></table>

<p><strong>Client-server vs peer-to-peer:</strong></p>
<ul>
<li><strong>Client-server:</strong> centralised security management, authentication, backup — preferred for business. Server is a critical security asset.</li>
<li><strong>Peer-to-peer:</strong> each device is both client and server — no central control, harder to secure, each peer is a potential entry point. Only suitable for very small, trusted networks.</li>
</ul>

<p><strong>Modern trends and their security implications:</strong></p>
<ul>
<li><strong>Virtualisation:</strong> segmentation and sandboxing reduce attack surface but hypervisor compromise exposes all VMs</li>
<li><strong>Cloud computing:</strong> shared responsibility model — provider secures the cloud, you secure what's in it. Default misconfigurations are the #1 cloud vulnerability</li>
<li><strong>BYOD:</strong> personal devices on corporate network — use MDM, containerisation, mandatory VPN, remote wipe capability</li>
<li><strong>IoT:</strong> billions of poorly secured devices — default passwords, no patches, recruited into botnets (Mirai)</li>
<li><strong>SDN:</strong> software-defined networking — centralised control improves visibility but controller becomes critical target</li>
</ul>

<div class="exam-tip"><div class="tip-label">&#128161; BYOD exam question structure</div>Always structure BYOD answers: (1) identify the risk (data on personal device accessible to others), (2) explain the impact (data breach, GDPR fine), (3) provide the mitigation (MDM with containerisation, mandatory encryption, remote wipe).</div>`,true),

    topic('B2','Network Components and Connection Media', `
<p>Every network device is a potential entry point for attackers. Understanding each component's security role is essential.</p>

<table class="g-table"><thead><tr><th>Device</th><th>Function</th><th>Security role</th></tr></thead><tbody>
<tr><td><strong>Switch (managed)</strong></td><td>Connects devices within a LAN; forwards frames by MAC address</td><td>Port security (MAC limiting), VLANs for segmentation, disable unused ports, 802.1X authentication</td></tr>
<tr><td><strong>Switch (unmanaged)</strong></td><td>Basic plug-and-play connectivity</td><td>No security features — avoid in any security-conscious environment</td></tr>
<tr><td><strong>Router</strong></td><td>Connects networks; forwards packets by IP address</td><td>ACLs (Access Control Lists), NAT hides internal addresses, firewall integration</td></tr>
<tr><td><strong>Firewall</strong></td><td>Filters traffic between network segments</td><td>Ingress/egress filtering, DMZ for public-facing servers, blocks unauthorised access</td></tr>
<tr><td><strong>Wireless Access Point</strong></td><td>Provides Wi-Fi connectivity</td><td>WPA3 encryption, MAC filtering, hidden SSID, guest network isolation, rogue AP detection</td></tr>
<tr><td><strong>Gateway</strong></td><td>Translates between different protocols/networks</td><td>Protocol-level filtering; potential bottleneck for security inspection</td></tr>
<tr><td><strong>Bridge</strong></td><td>Connects two network segments at Layer 2</td><td>Can isolate collision domains; limited security value in modern networks</td></tr>
<tr><td><strong>IDS/IPS</strong></td><td>Detects (IDS) or prevents (IPS) intrusions</td><td>IDS: passive monitoring + alerts. IPS: inline, actively blocks malicious traffic</td></tr>
</tbody></table>

<p><strong>Connection media — wired vs wireless security:</strong></p>
<ul>
<li><strong>Ethernet (wired):</strong> inherently more secure — physical access required to intercept data. Use Cat 6a or better for 10 Gbps.</li>
<li><strong>Wi-Fi (802.11):</strong> broadcasts through air — always encrypt with WPA3, use strong pre-shared key, implement RADIUS/802.1X for enterprise</li>
<li><strong>Bluetooth:</strong> short range but vulnerable to Bluejacking, Bluesnarfing, BlueBorne. Keep updated, disable when not needed, use secure pairing.</li>
<li><strong>NFC:</strong> very short range (~4cm) makes interception difficult but not impossible. Used for contactless payments — tokens replace actual card numbers.</li>
<li><strong>Fibre optic:</strong> immune to electromagnetic interference and difficult to tap without detection. Preferred for backbone and inter-building links.</li>
</ul>

<div class="mistake-box"><div class="mistake-label">&#9888; Common mistake</div>Do not say "wireless is always less secure than wired." While wireless is inherently more exposed, properly configured WPA3-Enterprise with 802.1X and RADIUS provides very strong security. The real risk is <em>misconfigured</em> wireless, not wireless itself.</div>`,true),

    topic('B3','Networking Infrastructure Services — TCP/IP, DNS, DHCP, routing and more', `
<div class="def-box"><div class="def-label">Key concept</div>
<span class="def-term">TCP/IP 4-Layer Model</span> — the foundation of all internet communication. Understanding the layers helps you identify where security controls apply.</div>

<table class="g-table"><thead><tr><th>Layer</th><th>Protocols</th><th>Security controls</th></tr></thead><tbody>
<tr><td>4. Application</td><td>HTTP, HTTPS, SMTP, DNS, FTP, SSH</td><td>TLS/SSL encryption, application firewalls, input validation</td></tr>
<tr><td>3. Transport</td><td>TCP, UDP</td><td>Port filtering, stateful inspection, TLS operates here</td></tr>
<tr><td>2. Internet</td><td>IP, ICMP, ARP</td><td>IPsec, packet filtering, NAT, anti-spoofing</td></tr>
<tr><td>1. Network Access</td><td>Ethernet, Wi-Fi, Fibre</td><td>802.1X, MAC filtering, WPA3, physical security</td></tr>
</tbody></table>

<p><strong>Key protocols and their ports:</strong></p>
<table class="g-table"><thead><tr><th>Protocol</th><th>Port</th><th>Transport</th><th>Purpose</th></tr></thead><tbody>
<tr><td>HTTP</td><td>80</td><td>TCP</td><td>Unencrypted web traffic — avoid for anything sensitive</td></tr>
<tr><td>HTTPS</td><td>443</td><td>TCP</td><td>Encrypted web traffic via TLS — mandatory for login/payments</td></tr>
<tr><td>SSH</td><td>22</td><td>TCP</td><td>Secure remote administration — replaces insecure Telnet (port 23)</td></tr>
<tr><td>SMTP</td><td>25</td><td>TCP</td><td>Email sending between servers</td></tr>
<tr><td>DNS</td><td>53</td><td>TCP/UDP</td><td>Domain name resolution — DNSSEC adds security</td></tr>
<tr><td>RDP</td><td>3389</td><td>TCP</td><td>Remote Desktop — high-value target; never expose directly to internet</td></tr>
<tr><td>FTP</td><td>20/21</td><td>TCP</td><td>File transfer — use SFTP (SSH) or FTPS (TLS) instead</td></tr>
</tbody></table>

<p><strong>DNS — the internet's phonebook:</strong></p>
<ol>
<li>Browser checks local DNS cache — if found, connects immediately</li>
<li>Query sent to DNS recursive resolver (usually ISP)</li>
<li>Resolver queries: Root server → TLD server (.com) → Authoritative name server</li>
<li>IP address returned, cached, and used for connection</li>
<li><strong>Security risk:</strong> DNS cache poisoning — attacker corrupts cache to redirect users to fake sites</li>
<li><strong>Mitigation:</strong> DNSSEC digitally signs DNS responses to verify authenticity</li>
</ol>

<p><strong>DHCP — automatic IP address assignment (DORA process):</strong></p>
<ul>
<li><strong>Discover:</strong> client broadcasts DHCPDISCOVER to find servers</li>
<li><strong>Offer:</strong> server responds with DHCPOFFER (proposed IP, subnet mask, gateway, DNS)</li>
<li><strong>Request:</strong> client sends DHCPREQUEST to accept the offer</li>
<li><strong>Acknowledge:</strong> server confirms with DHCPACK; client can use IP for lease duration</li>
<li><strong>Security:</strong> rogue DHCP server can redirect traffic — use DHCP snooping on switches</li>
</ul>

<p><strong>NAT and IP Addressing:</strong></p>
<ul>
<li><strong>NAT:</strong> translates private IPs to public IP — hides internal structure, conserves IPv4 addresses</li>
<li><strong>Private ranges (RFC 1918):</strong> 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16</li>
<li><strong>APIPA:</strong> 169.254.x.x — self-assigned when DHCP fails; no internet access</li>
<li><strong>Loopback:</strong> 127.0.0.1 — always points to local machine; ::1 for IPv6</li>
<li><strong>IPv6:</strong> 128-bit addresses, eliminates NAT need, built-in IPsec support</li>
</ul>

<p><strong>Authentication services:</strong></p>
<ul>
<li><strong>RADIUS:</strong> centralised AAA (Authentication, Authorisation, Accounting) for network access — commonly used with 802.1X for Wi-Fi</li>
<li><strong>TACACS+:</strong> Cisco alternative to RADIUS; separates authentication, authorisation and accounting</li>
<li><strong>Kerberos:</strong> ticket-based authentication for Windows/Linux domains — prevents password transmission over network</li>
<li><strong>LDAP / Active Directory:</strong> directory services for identity and access management in enterprise environments</li>
</ul>

<p><strong>VPNs — secure tunnels through untrusted networks:</strong></p>
<ul>
<li><strong>Site-to-site VPN:</strong> connects entire networks (branch office to HQ)</li>
<li><strong>Client-based VPN:</strong> individual remote user connects to corporate network</li>
<li><strong>SSL VPN:</strong> browser-based, no client software needed — convenient but limited</li>
<li><strong>IPsec VPN:</strong> operates at network layer — more comprehensive but requires client software</li>
<li><strong>Always use:</strong> strong encryption (AES-256), secure authentication, perfect forward secrecy</li>
</ul>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip — Routing</div>Static routes are manually configured — secure but don't adapt to network changes. Dynamic routing (OSPF, EIGRP, BGP) automatically adapts but can be poisoned by attackers injecting false routes. Always authenticate routing protocol updates.</div>`,true)
  ]);

  /* ============================================================
     AIM C — Cyber security documentation
  ============================================================ */
  const aimC = aim('C', [
    topic('C1','Internal security policies — the Plan-Do-Check-Act approach', `
<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Cyber security policy</span> — a documented set of rules and practices that establish and maintain security on an ongoing basis across an organisation.</div>

<p><strong>The Plan-Do-Check-Act (PDCA) loop</strong>, derived from ISO 27001:2013, underpins an effective cyber security policy:</p>
<ul>
<li><strong>Plan</strong> — establish the security objectives, identify risks and asset requirements</li>
<li><strong>Do</strong> — implement the controls and operate them</li>
<li><strong>Check</strong> — monitor, audit and review results against the objectives</li>
<li><strong>Act</strong> — take corrective action and continually improve</li>
</ul>

<p>General IT policies that organisations put in place include:</p>
<ul>
<li><strong>Internet and email use policy</strong> — rules on inappropriate, offensive or illegal material; not sending confidential information; privacy; uploading/downloading copyrighted material; downloading executable files; visiting potentially dangerous websites</li>
<li><strong>Security and password procedures</strong> — length/strength policy, deny lists of weak/common passwords, monitoring password attempts, lockout policy for inactivity or failed attempts, using technology to reduce reliance on passwords</li>
<li><strong>Staff responsibilities</strong> — completing required security training, following procedures and reporting problems, responding to suspicious activity, maintaining security in their own workspace</li>
<li><strong>Staff IT security training</strong> — funded and resourced by leadership, flexible to include everyone, using a range of resources/learning styles, progress tracking, incentives rather than punishment, ongoing reinforcement for new threats</li>
</ul>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>The PDCA loop is the exam's framing for "how policies are continually improved" — always link a policy to <em>regular review and improvement</em>, not a one-off document.</div>`,true),

    topic('C1.2','Security audits, backup policy and data protection', `
<p><strong>Security audits</strong> check compliance against policies and regulations:</p>
<ul>
<li>Audit goals and scope are defined up front</li>
<li>Identify problems, gaps and weaknesses</li>
<li>Check against internal policies <em>and</em> external regulations/laws</li>
<li>Report results and any required improvements/changes</li>
</ul>

<p><strong>Backup policy</strong> sets out how data is protected:</p>
<ul>
<li>Selection of data to be backed up; backup methods and type (full/differential/incremental)</li>
<li>Frequency/scheduling; storage strategy (onsite/offsite/cloud)</li>
<li>Responsibility and accountability; a backup testing strategy</li>
<li>Legal/regulatory compliance; emergency/recovery procedures</li>
</ul>

<p><strong>Data protection policy</strong> ensures organisational compliance:</p>
<ul>
<li>Appointing a <strong>Data Protection Officer</strong></li>
<li>Following data protection principles; protecting rights and privacy</li>
<li>Staff training; system security procedures</li>
<li>Applying the policy to external contractors, consultants and vendors</li>
<li>Responsibility and accountability of staff and the organisation</li>
</ul>`,true),

    topic('C1.5','Incident response and disaster recovery policies', `
<p><strong>Cyber security incident response policy</strong> — sets out how to react to a security incident:</p>
<ul>
<li><strong>Contacts</strong>: incident response team leader/provider, IT team leader, senior management, legal, public relations, human resources, insurance</li>
<li><strong>Procedures / flowcharts / checklists</strong> for: initial decisions/triage/escalation; the main response (analysis, containment, mitigation, recovery); reviewing, reporting and closing the incident</li>
<li><strong>Communications</strong>: a contact telephone plus an alternative/backup, and a conference call facility</li>
</ul>

<p><strong>Disaster recovery policy</strong> — sets out how to recover from a major disruption:</p>
<ul>
<li>Purpose and scope</li>
<li><strong>Triage</strong> — a list of possible events, their severity and the appropriate response (activate incident response / business continuity / disaster recovery plan)</li>
<li>Roles and responsibilities; contact lists</li>
<li>Monitoring and reporting requirements</li>
</ul>

<p><strong>External services policy</strong> — governs third parties such as cloud providers, hardware and software vendors:</p>
<ul>
<li>Authorisation and access control; management, responsibility and accountability</li>
<li>Contact details; regulatory compliance; incident response procedures</li>
<li>Service agreements; licensing; service time/availability and escalation procedures</li>
</ul>`,true)
  ]);

  /* ============================================================
     AIM D — Forensic procedures
  ============================================================ */
  const aimD = aim('D', [
    topic('D1','Forensic collection of evidence', `
<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Digital forensics</span> — the methods used to collect and analyse evidence following a security incident, in a way that keeps it reliable and admissible.</div>

<p><strong>Forensics on devices (servers, PCs and mobile devices)</strong> — meeting the requirements:</p>
<ul>
<li><strong>Confiscation of devices</strong> — prior planning for a range of devices; passwords/codes/PINs; chargers and cables for mobile devices; retain the current power state if possible</li>
<li><strong>Isolation from the network</strong> — photograph the screen, turn off the device, remove battery/power cable, use airplane mode, disable wireless, use a Faraday bag/cage</li>
<li><strong>Appropriate packaging</strong>, documenting the <strong>chain of custody</strong> and establishing legal permissions</li>
<li>Taking an image of the system, using a forensic analysis tool, reviewing files/settings, system logs and user activity, and malware analysis and alerts</li>
</ul>

<p><strong>Challenges of live forensics:</strong> changing data in situ, recovering corrupted data, capturing data in active memory, capturing remote data, not losing temporary files.</p>

<p><strong>Network forensics:</strong> agree a testing methodology with the authorities; scan local infrastructure (with permission, without disrupting a live system, using passive and active analysis tools); review firewalls, switches, routers, WAPs and client/server logs; analyse malware activity and alerts.</p>

<p><strong>Documenting the scene:</strong> prior planning, securing the scene, plans/photos/diagrams, contemporaneous notes and witness statements.</p>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>For forensics questions always mention <strong>not changing the data</strong>, working from a <strong>copy/image</strong> and keeping a <strong>chain of custody</strong> — these are the core "admissibility" requirements.</div>`,true),

    topic('D2','Systematic forensic analysis of a suspect system', `
<p><strong>Requirements for maintaining an accurate record</strong>, made at or as soon as possible after the incident:</p>
<ul>
<li><strong>Retain snapshots of the system</strong> — originals/clean system for comparison, generate a hash/checksum for copies, whole disk/machine, files/folders, memory (RAM, BIOS, memory cards/SIM), virtual discs, process activity, network information (open ports, IP addresses, user logins), temporary and deleted data, and system-generated data (System Volume Information, hibernation files, shadow copies, crash dumps, page files)</li>
<li><strong>Record all findings</strong> — no action that could change data, collection by a competent person, a trail of all actions, documentation of responsibility</li>
<li><strong>Record alterations</strong> — document all actions from initial seizure, working with copies rather than the original</li>
<li><strong>Create visual evidence</strong> — photos, videos, screenshots, date-time stamps and metadata</li>
<li><strong>Ensure relevance, not false positives</strong> — define file signatures and search criteria, know error rates, feed back false positives, manually review positives</li>
</ul>

<p><strong>Assessing the findings</strong> — determine whether they provide evidence of a crime and/or incident (criminal, regulatory breach, civil liability, non-compliance, cyber attack, negligence) and whether the system has been externally/internally compromised:</p>
<ul>
<li>Unusual traffic (inbound/outbound, unusual regions, DoS/DDoS signs)</li>
<li>Unusual login attempts or DNS requests; increased file/data reads or requests</li>
<li>Unusual port usage; suspicious changes to or access to files/data</li>
</ul>

<p><strong>Writing security reports</strong> — a clear structure (title, contents, introduction, headings, numbered/bulleted points, conclusions, footnotes, citations) that analyses the incident to identify errors/omissions in procedures and preventative measures, delays in detection, and remedial actions, plus improvements to IT policies and security protection measures (physical, software, hardware, processes, training).</p>`,true)
  ]);

  /* ---- Key Terms Glossary ---- */
  const glossary = `
<div class="guide-aim-section" id="guide-glossary">
  <div class="guide-aim-hd">
    <div class="guide-aim-badge" style="font-size:1rem">&#128218;</div>
    <div>
      <div class="guide-aim-title">Key Terms Glossary — All Aims</div>
      <div class="guide-aim-subtitle">Quick-reference definitions for all learning aims A–D</div>
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
      <tr><td>APT</td><td>Advanced Persistent Threat — prolonged, targeted cyberattack, often state-sponsored</td></tr>
      <tr><td>Botnet</td><td>Network of compromised devices controlled remotely for DDoS, spam, or data theft</td></tr>
      <tr><td>DDoS</td><td>Distributed Denial of Service — multiple devices flood a target, overwhelming it</td></tr>
      <tr><td>Encryption</td><td>Scrambling data using a key so it is unreadable without the correct decryption key</td></tr>
      <tr><td>Firewall</td><td>Hardware/software that filters network traffic based on security rules</td></tr>
      <tr><td>GDPR</td><td>General Data Protection Regulation — governs personal data, fines up to £17.5m or 4% turnover</td></tr>
      <tr><td>IDS/IPS</td><td>Intrusion Detection/Prevention System — monitors (IDS) or blocks (IPS) malicious activity</td></tr>
      <tr><td>MFA</td><td>Multi-Factor Authentication — requires 2+ factors from different categories</td></tr>
      <tr><td>MITM</td><td>Man-in-the-Middle — attacker intercepts communication between two parties</td></tr>
      <tr><td>NIST IR</td><td>NIST Incident Response Lifecycle: Preparation, Detection, Containment/Recovery, Post-Incident</td></tr>
      <tr><td>Phishing</td><td>Fraudulent emails/websites designed to steal credentials or install malware</td></tr>
      <tr><td>Ransomware</td><td>Malware that encrypts files and demands payment for the decryption key</td></tr>
      <tr><td>RPO</td><td>Recovery Point Objective — maximum acceptable data loss measured in time</td></tr>
      <tr><td>RTO</td><td>Recovery Time Objective — maximum acceptable downtime before systems must be restored</td></tr>
      <tr><td>SIEM</td><td>Security Information and Event Management — aggregates and correlates logs for security monitoring</td></tr>
      <tr><td>SQL Injection</td><td>Inserting malicious SQL code via input fields to manipulate databases</td></tr>
      <tr><td>Zero-day</td><td>Vulnerability unknown to vendor — no patch exists, maximum danger</td></tr>
      <tr><td>VPN</td><td>Virtual Private Network — encrypted tunnel through untrusted networks</td></tr>
      <tr><td>AUP</td><td>Acceptable Use Policy — document defining allowed use of organisational IT systems</td></tr>
      <tr><td>Chain of Custody</td><td>Documented record of everyone who handled evidence, when, and what they did</td></tr>
      </tbody></table>
    </div>
  </div>
</div>`;

  function buildGuideHTML() {
    return `
<div class="guide-shell">
  <div class="guide-sidebar" id="guide-sidebar-it">
    ${buildSidebar()}
  </div>
  <div class="guide-main">
    <div class="guide-topbar">
      <div class="guide-progress-track"><div class="guide-progress-fill" id="guide-pf-it" style="width:0%"></div></div>
      <span class="guide-progress-text" id="guide-pt-it">0 / 4 aims revised</span>
      <button class="guide-print-btn" onclick="window.print()">&#128438; Print guide</button>
    </div>
    ${buildGuideGallery()}
    ${aimA}
    ${aimB}
    ${aimC}
    ${aimD}
    ${glossary}
  </div>
</div>`;
  }

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
