/* IT AAQ Unit 2 — Comprehensive Revision Guide
   Cyber Security & Incident Management
   Initialised by calling window.initComprehensiveGuide() */
(function () {
  'use strict';

  const STORE_KEY = 'ra10-guide-revised-IT-u2';
  const AIMS = ['A','B','C','D'];
  const AIM_TITLES = {
    A: 'Cyber Hygiene — Threats, Vulnerabilities & Protection',
    B: 'Networking Architectures & Principles for Security',
    C: 'Incident Response & Digital Forensics',
    D: 'Testing, Monitoring & Evaluating Systems'
  };
  const AIM_SUBTITLES = {
    A: 'Threat actors, malware types, social engineering, network attacks, legislation, encryption, firewalls, authentication, access control',
    B: 'Network types, topologies, TCP/IP, DNS, DHCP, routing, VPNs, cloud security, IoT, BYOD',
    C: 'NIST incident response lifecycle, containment, eradication, digital forensics, chain of custody, evidence handling',
    D: 'Vulnerability assessment, penetration testing, IDS/IPS, SIEM, log management, security metrics, auditing'
  };

  function getRevised() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch { return []; }
  }
  function saveRevised(arr) { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); }

  function buildSidebar() {
    const items = [
      { aim:'A', topics:[['A1','Threats & Malware'],['A2','Vulnerabilities'],['A3','Legal & Ethical'],['A4','Protection Measures']] },
      { aim:'B', topics:[['B1','Networks & Topologies'],['B2','Components & Media'],['B3','Infrastructure Services']] },
      { aim:'C', topics:[['C1','Incident Response'],['C2','Digital Forensics']] },
      { aim:'D', topics:[['D1','Security Testing'],['D2','Monitoring & Evaluation']] }
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
    { aim:'C', kicker:'Response', title:'Incident response and digital forensics', copy:'NIST lifecycle, containment strategies, evidence handling and chain of custody.', image:'https://images.unsplash.com/photo-1563986768609-322da13575f2?auto=format&fit=crop&w=1200&q=80' },
    { aim:'D', kicker:'Testing', title:'Testing, monitoring and evaluation', copy:'Penetration testing, vulnerability assessment, SIEM and continuous security monitoring.', image:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' }
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

    topic('A3','Legal and Ethical Considerations — UK law and compliance', `
<p>Cyber security professionals must operate within a legal and ethical framework. You must know the key UK legislation and what each covers.</p>

<table class="g-table"><thead><tr><th>Legislation</th><th>Year</th><th>What it covers</th><th>Key points for the exam</th></tr></thead><tbody>
<tr><td><strong>Computer Misuse Act</strong></td><td>1990</td><td>Unauthorised access/modification of computers</td><td>S1: unauthorised access (2yr). S2: with intent to commit crime (5yr). S3: unauthorised modification — viruses, deleting files (10yr). S3A: making/supplying hacking tools (2yr).</td></tr>
<tr><td><strong>UK GDPR / DPA 2018</strong></td><td>2018</td><td>Collection, storage and processing of personal data</td><td>Data principles: lawful, purpose-limited, accurate, secure. Individual rights: access, erasure, portability. Max fine: £17.5m or 4% global turnover.</td></tr>
<tr><td><strong>RIPA</strong></td><td>2000</td><td>Regulation of Investigatory Powers</td><td>Governs lawful interception of communications by authorities. Requires warrants for surveillance.</td></tr>
<tr><td><strong>Official Secrets Act</strong></td><td>1989</td><td>Protection of state secrets</td><td>Criminalises disclosure of government information relating to security, defence, international relations.</td></tr>
</tbody></table>

<p><strong>Ethical responsibilities of cyber security professionals:</strong></p>
<ul>
<li><strong>Responsible disclosure:</strong> if you discover a vulnerability, notify the vendor privately first; give them reasonable time to patch before going public</li>
<li><strong>Professional codes of conduct:</strong> BCS (British Computer Society) and CIISec (Chartered Institute of Information Security) Codes require members to act with integrity, competence and in the public interest</li>
<li><strong>Ethical hacking:</strong> penetration testing must be authorised in writing with clearly defined scope — testing without permission is illegal under the Computer Misuse Act</li>
</ul>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip — GDPR breach scenario</div>Always work through GDPR consequences in order: (1) contain the breach, (2) notify ICO within 72 hours, (3) notify affected individuals, (4) assess fine risk (up to £17.5m or 4% turnover), (5) reputational damage and loss of customer trust.</div>`,true),

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
     AIM C — Incident Response & Forensics
  ============================================================ */
  const aimC = aim('C', [
    topic('C1','Incident Response — the NIST Lifecycle', `
<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Security incident</span> — an event that threatens the confidentiality, integrity or availability of an information system or the data it processes. Not all security events are incidents — an incident is a confirmed breach of security policy.</div>

<p><strong>The NIST Incident Response Lifecycle — 4 phases:</strong></p>

<table class="g-table"><thead><tr><th>Phase</th><th>Key activities</th><th>Critical considerations</th></tr></thead><tbody>
<tr><td><strong>1. Preparation</strong></td><td>Develop IR plan and procedures; establish IR team with defined roles; acquire tools (forensic software, communication channels); train team; conduct tabletop exercises; create jump kits</td><td>Preparation determines response quality. Without a plan, teams waste precious time deciding what to do during an active incident.</td></tr>
<tr><td><strong>2. Detection & Analysis</strong></td><td>Monitor SIEM alerts, IDS/IPS, logs; identify indicators of compromise (IoCs); determine scope and impact; classify severity; document all findings</td><td>False positives waste time; false negatives are dangerous. Use multiple detection sources and correlate events for accuracy.</td></tr>
<tr><td><strong>3. Containment, Eradication & Recovery</strong></td><td>Contain: isolate affected systems, block malicious IPs, disable accounts. Eradicate: remove malware, close vulnerabilities, patch. Recover: restore from clean backups, rebuild systems, verify integrity</td><td>Containment strategy depends on incident type. For ransomware, immediate isolation is critical. For espionage, you might monitor first to gather evidence.</td></tr>
<tr><td><strong>4. Post-Incident Activity</strong></td><td>Conduct lessons learned meeting; document what happened, what worked, what didn't; update IR plan and procedures; implement preventive measures; create final report for stakeholders</td><td>Without this phase, the same incident will happen again. Blame-free culture encourages honest reporting.</td></tr>
</tbody></table>

<p><strong>Incident classification — determining priority:</strong></p>
<ul>
<li><strong>Severity levels</strong> typically range from P1 (critical — active data breach, ransomware in progress) to P4 (low — policy violation, suspicious but unconfirmed activity)</li>
<li><strong>Factors:</strong> data sensitivity (PII? financial?), scope (how many systems/users affected?), business impact (revenue loss?), regulatory implications (GDPR notifiable?)</li>
<li><strong>Escalation paths:</strong> define who must be notified at each severity level — IT manager, CISO, legal counsel, PR, board, regulators</li>
</ul>

<p><strong>Communication during incidents — who to tell and when:</strong></p>
<ol>
<li><strong>Internal IT/security team</strong> — immediate, for containment</li>
<li><strong>Senior management / CISO</strong> — within first hour for critical incidents</li>
<li><strong>Legal team</strong> — to assess regulatory obligations</li>
<li><strong>ICO (regulator)</strong> — within 72 hours if personal data breach under GDPR</li>
<li><strong>Affected individuals</strong> — without undue delay if high risk to their rights</li>
<li><strong>PR / media</strong> — prepared statement to manage reputation; timing depends on situation</li>
<li><strong>Law enforcement</strong> — if criminal activity (NCSC, Action Fraud, NCA)</li>
</ol>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip — Containment strategies</div>Match containment to the threat: ransomware → isolate immediately to prevent spread; data exfiltration → may need to monitor before blocking to identify what was taken; DDoS → traffic filtering/scrubbing, not isolation. Always explain <em>why</em> you chose that strategy.</div>

<p><strong>Business Continuity & Disaster Recovery:</strong></p>
<ul>
<li><strong>RTO (Recovery Time Objective):</strong> maximum acceptable downtime — how quickly must systems be back online? Minutes for critical banking, hours/days for less critical.</li>
<li><strong>RPO (Recovery Point Objective):</strong> maximum acceptable data loss measured in time — how much data can you afford to lose? Real-time replication for zero RPO, daily backups for 24-hour RPO.</li>
<li><strong>Hot site:</strong> fully operational duplicate, real-time replication, failover in minutes — most expensive</li>
<li><strong>Warm site:</strong> partially equipped, some data — recovery in hours to days</li>
<li><strong>Cold site:</strong> empty facility with power/connectivity — recovery in days to weeks — cheapest</li>
<li><strong>BCP vs DRP:</strong> BCP (Business Continuity Plan) covers keeping the business running during disruption; DRP (Disaster Recovery Plan) specifically covers IT system recovery</li>
</ul>`,true),

    topic('C2','Digital Forensics — principles, acquisition and analysis', `
<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Digital forensics</span> — the process of identifying, preserving, analysing and presenting digital evidence in a manner that is legally admissible. The goal is to reconstruct events and determine what happened, when, how, and by whom.</div>

<p><strong>ACPO Guidelines — the 4 principles of digital evidence:</strong></p>
<ol>
<li>No action taken should change data held on a computer or storage media which may subsequently be relied upon in court.</li>
<li>In exceptional circumstances where a person finds it necessary to access original data, that person must be competent to do so and be able to give evidence explaining the relevance and implications of their actions.</li>
<li>An audit trail of all processes applied to computer-based electronic evidence should be created and preserved.</li>
<li>The person in charge of the investigation has overall responsibility for ensuring the law and these principles are adhered to.</li>
</ol>

<p><strong>Chain of Custody — proving evidence integrity:</strong></p>
<ul>
<li>Documents every person who handled the evidence, when, why, and what they did</li>
<li>Must be unbroken — any gap or inconsistency renders evidence inadmissible</li>
<li>Includes: date/time of collection, who collected it, where it was stored, who accessed it, any analysis performed</li>
<li>Each transfer must be signed and witnessed</li>
</ul>

<p><strong>Order of Volatility — collect the most fragile evidence first:</strong></p>
<ol>
<li>CPU registers and cache (milliseconds)</li>
<li>RAM / memory contents (lost when power off)</li>
<li>Running processes and network connections</li>
<li>Temporary file systems / swap</li>
<li>Hard disk data (persistent)</li>
<li>Remote logs and monitoring data</li>
<li>Backup tapes and archival media</li>
</ol>

<p><strong>Forensic Acquisition — creating an exact copy:</strong></p>
<ul>
<li><strong>Write blocker:</strong> hardware/software device that prevents any data being written to the original evidence drive during imaging — essential for evidence integrity</li>
<li><strong>Disk imaging:</strong> creates a bit-for-bit copy of the entire drive, including deleted files, slack space and unallocated space</li>
<li><strong>Hashing:</strong> MD5, SHA-1 or SHA-256 hash calculated for both original and copy — if hashes match, the copy is proven to be identical</li>
<li><strong>Forensic copy vs original:</strong> all analysis is performed on the forensic copy, never the original (which is preserved unchanged)</li>
</ul>

<p><strong>Analysis techniques:</strong></p>
<ul>
<li><strong>File carving:</strong> recovering deleted files by searching raw disk data for known file headers and footers (magic numbers)</li>
<li><strong>Timeline analysis:</strong> reconstructing the sequence of events using file timestamps (MAC times — Modified, Accessed, Created)</li>
<li><strong>Registry analysis:</strong> Windows registry contains wealth of information about installed software, user activity, connected devices</li>
<li><strong>Log analysis:</strong> correlating events across system logs, application logs, security logs, firewall logs</li>
<li><strong>Memory analysis:</strong> examining RAM dumps for running processes, network connections, encryption keys, malware that only exists in memory</li>
<li><strong>Network forensics:</strong> analysing captured packets (PCAP files) to trace attacker activity, data exfiltration, C2 communications</li>
</ul>

<div class="exam-tip"><div class="tip-label">&#128161; Legal admissibility checklist</div>For evidence to be admissible: (1) Relevant — relates to the case, (2) Reliable — integrity maintained, no tampering, (3) Legally obtained — collected with proper authorisation under relevant laws (RIPA, CMA). A failure on any point means evidence can be excluded.</div>`,true)
  ]);

  /* ============================================================
     AIM D — Testing, Monitoring & Evaluation
  ============================================================ */
  const aimD = aim('D', [
    topic('D1','Security Testing — vulnerability assessment and penetration testing', `
<div class="def-box"><div class="def-label">Key definitions</div>
<span class="def-term">Vulnerability assessment</span> — systematic review of security weaknesses. Identifies and classifies vulnerabilities.<br><br>
<span class="def-term">Penetration test</span> — simulated attack on a system to identify exploitable vulnerabilities. Goes beyond assessment by actually attempting exploitation.</div>

<p><strong>Penetration testing approaches:</strong></p>
<table class="g-table"><thead><tr><th>Type</th><th>Tester knowledge</th><th>Simulates</th><th>Advantages</th></tr></thead><tbody>
<tr><td><strong>Black box</strong></td><td>Zero prior knowledge</td><td>External attacker</td><td>Most realistic external threat simulation</td></tr>
<tr><td><strong>White box</strong></td><td>Full access (source code, diagrams, credentials)</td><td>Insider threat or thorough audit</td><td>Most comprehensive — finds more vulnerabilities</td></tr>
<tr><td><strong>Grey box</strong></td><td>Limited knowledge (e.g. user-level credentials)</td><td>Attacker who has gained some access</td><td>Balanced approach — more realistic than white box, more thorough than black box</td></tr>
</tbody></table>

<p><strong>Penetration testing phases:</strong></p>
<ol>
<li><strong>Reconnaissance:</strong> gather information — passive (OSINT, WHOIS, social media) and active (port scanning, banner grabbing)</li>
<li><strong>Scanning & Enumeration:</strong> use tools (Nmap, Nessus) to identify open ports, services, OS versions, potential vulnerabilities</li>
<li><strong>Exploitation:</strong> attempt to exploit identified vulnerabilities to gain access — use Metasploit, manual exploitation, social engineering</li>
<li><strong>Post-exploitation:</strong> maintain access (backdoors), escalate privileges, pivot to other systems, exfiltrate test data</li>
<li><strong>Reporting:</strong> document all findings with risk ratings, evidence (screenshots/logs), and prioritised remediation recommendations</li>
</ol>

<div class="exam-tip"><div class="tip-label">&#128161; Key distinction — VA vs PT</div>Vulnerability Assessment = "What weaknesses exist?" Penetration Testing = "Can these weaknesses actually be exploited, and what is the impact?" A VA tells you about the holes; a PT shows you how deep they go. Organisations need both.</div>

<p><strong>Testing methodologies:</strong></p>
<ul>
<li><strong>OWASP Top 10:</strong> the definitive list of most critical web application security risks (injection, broken authentication, sensitive data exposure, XXE, broken access control, security misconfiguration, XSS, insecure deserialization, using vulnerable components, insufficient logging)</li>
<li><strong>OSSTMM:</strong> Open Source Security Testing Methodology Manual — comprehensive framework for security testing</li>
<li><strong>PTES:</strong> Penetration Testing Execution Standard — industry-standard methodology covering all phases</li>
<li><strong>NIST SP 800-115:</strong> Technical Guide to Information Security Testing and Assessment</li>
</ul>

<p><strong>Code review — finding vulnerabilities before deployment:</strong></p>
<ul>
<li><strong>SAST (Static Analysis):</strong> analyses source code without executing — finds SQL injection, buffer overflows, hardcoded credentials early in SDLC. Tools: SonarQube, Fortify, Checkmarx.</li>
<li><strong>DAST (Dynamic Analysis):</strong> tests running application from outside — finds runtime vulnerabilities like misconfigurations, authentication flaws. Tools: OWASP ZAP, Burp Suite, Acunetix.</li>
<li><strong>SAST + DAST = complementary:</strong> SAST finds code-level issues early; DAST finds deployment/runtime issues. Use both.</li>
</ul>`,true),

    topic('D2','Monitoring, Logging and Evaluation — SIEM, IDS/IPS and metrics', `
<p>Continuous monitoring is essential — attackers work 24/7, and a vulnerability can be exploited within hours of disclosure.</p>

<p><strong>IDS vs IPS — detection vs prevention:</strong></p>
<table class="g-table"><thead><tr><th></th><th>IDS (Detection)</th><th>IPS (Prevention)</th></tr></thead><tbody>
<tr><td>Position</td><td>Out-of-band (copies of traffic)</td><td>Inline (traffic passes through it)</td></tr>
<tr><td>Action</td><td>Alerts only — does not block</td><td>Can block/drop malicious traffic in real time</td></tr>
<tr><td>Impact on traffic</td><td>No latency impact</td><td>Adds some latency (processing)</td></tr>
<tr><td>Failure mode</td><td>Fails silently (misses attacks)</td><td>Can fail open (lets traffic through) or fail closed (blocks all traffic)</td></tr>
<tr><td>Best for</td><td>Monitoring, forensics, compliance</td><td>Real-time attack prevention</td></tr>
</tbody></table>

<ul>
<li><strong>HIDS/HIPS:</strong> Host-based — installed on individual servers/endpoints. Monitors file integrity, registry changes, process behaviour on that specific host.</li>
<li><strong>NIDS/NIPS:</strong> Network-based — monitors network traffic at strategic points. Can see attacks targeting multiple hosts but cannot see encrypted traffic content.</li>
</ul>

<p><strong>SIEM — the security nerve centre:</strong></p>
<div class="def-box"><div class="def-label">SIEM functions</div>
<span class="def-term">SIEM</span> (Security Information and Event Management) aggregates logs from across the entire IT estate, applies correlation rules to identify security incidents, and provides real-time dashboards and alerting.</div>

<p><strong>SIEM workflow:</strong></p>
<ol>
<li><strong>Collect:</strong> logs from firewalls, servers, endpoints, IDS/IPS, applications, cloud services — everything</li>
<li><strong>Normalise:</strong> convert diverse log formats into a common schema</li>
<li><strong>Correlate:</strong> apply rules to connect events — e.g. "5 failed logins from same IP within 1 minute → alert"</li>
<li><strong>Alert:</strong> generate real-time notifications for security team based on correlation rules matching</li>
<li><strong>Dashboard:</strong> visualise security posture, open incidents, trends over time</li>
<li><strong>Retain:</strong> store logs for compliance (GDPR, PCI DSS require specific retention periods) and forensic investigation</li>
</ol>

<p><strong>Log management best practices:</strong></p>
<ul>
<li><strong>What to log:</strong> authentication events (success/failure), privileged account usage, configuration changes, data access/modification, network connections, security alerts</li>
<li><strong>Centralised logging:</strong> all logs sent to central syslog/SIEM server — prevents attackers from deleting local logs to cover tracks</li>
<li><strong>Log integrity:</strong> use write-once storage or append-only logs; hash logs to detect tampering</li>
<li><strong>Retention:</strong> balance storage cost against compliance requirements and investigation needs (typically 90 days to 1 year for security logs)</li>
<li><strong>Time synchronisation:</strong> all systems must use NTP — without synchronised timestamps, correlation is impossible</li>
</ul>

<p><strong>Security Metrics and KPIs:</strong></p>
<table class="g-table"><thead><tr><th>Metric</th><th>What it measures</th><th>Target</th></tr></thead><tbody>
<tr><td><strong>MTTD</strong></td><td>Mean Time to Detect — how long from incident occurring to detection</td><td>As low as possible (hours, not days)</td></tr>
<tr><td><strong>MTTR</strong></td><td>Mean Time to Respond/Remediate — how long from detection to resolution</td><td>Minutes for critical, hours for high</td></tr>
<tr><td><strong>Patch compliance</strong></td><td>% of systems with latest security patches applied</td><td>>95% for critical patches</td></tr>
<tr><td><strong>Open vulnerabilities</strong></td><td>Number and severity of unpatched vulnerabilities</td><td>Zero critical, declining trend</td></tr>
<tr><td><strong>Incident trend</strong></td><td>Number and type of incidents over time</td><td>Decreasing trend (more prevention)</td></tr>
<tr><td><strong>Phishing click rate</strong></td><td>% of users who click simulated phishing links</td><td><5% (improving with training)</td></tr>
</tbody></table>

<div class="exam-tip"><div class="tip-label">&#128161; Exam tip — Why SIEM matters</div>Manual log review across hundreds of systems is impossible. SIEM automates detection through correlation — a single failed login means nothing; 500 failed logins from one IP over 5 minutes is an active brute-force attack. The value is in connecting the dots automatically.</div>

<p><strong>Vulnerability Management Lifecycle:</strong></p>
<ol>
<li><strong>Discover:</strong> identify all assets (hardware, software, cloud) — you cannot protect what you don't know exists</li>
<li><strong>Assess:</strong> scan for vulnerabilities using automated tools (Nessus, Qualys) and manual assessment</li>
<li><strong>Prioritise:</strong> use CVSS scores and business context — a critical vulnerability on an internet-facing system is more urgent than on an isolated internal system</li>
<li><strong>Remediate:</strong> apply patches, change configurations, implement compensating controls</li>
<li><strong>Verify:</strong> rescan to confirm the fix is effective — never assume</li>
<li><strong>Report:</strong> document the organisation's security posture, trends, and compliance status for stakeholders</li>
</ol>

<div class="mistake-box"><div class="mistake-label">&#9888; Common mistake</div>
Students often focus only on patching and forget the human element. Security awareness training, phishing simulations, and a blame-free reporting culture are equally important controls. Technical controls alone cannot protect against a well-crafted social engineering attack.</div>`,true)
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
