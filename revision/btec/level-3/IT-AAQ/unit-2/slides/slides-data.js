// BTEC IT Unit 2 — Slides Data: Cyber Security & Incident Management

window.SLIDES_DATA = {
  unitTitle: "BTEC IT Unit 2 — Cyber Security & Incident Management",
  presentations: [
    {
      aim: "Aim A",
      title: "Threats, Vulnerabilities & Protection Measures",
      description: "Threat actors, malware types, social engineering, network attacks, legislation, encryption, firewalls, authentication and access control.",
      slides: [
        { title: "🎯 Learning Objectives", subtitle:"By the end of this lesson you will be able to:", content:`
<div class="def-box"><div class="def-label">Lesson Goals</div>
<ol>
<li><strong>Identify</strong> different types of threat actors and their motivations</li>
<li><strong>Describe</strong> the six main types of malware and how each operates</li>
<li><strong>Explain</strong> common social engineering techniques and how to defend against them</li>
<li><strong>Analyse</strong> the impact of network-based attacks on organisations</li>
</ol>
</div>
<h3>📝 Starter Activity — Quick Quiz</h3>
<p style="font-size:16px;background:#f0f4ff;padding:14px;border-radius:8px;"><strong>Q:</strong> A company's files have been encrypted and a message demands payment in Bitcoin. What type of malware is this?<br><br>
<strong>A:</strong> <span style="color:var(--accent);font-weight:700;">Ransomware</span> — it encrypts files and demands payment (usually cryptocurrency) for the decryption key.</p>
<h3>Key vocabulary for this lesson:</h3>
<p>Threat actor · Malware · Ransomware · Phishing · DDoS · APT · Botnet · Social engineering</p>` },
        { title: "Cyber Security Threats — Threat Actors", content:`
<h3>Who attacks and why?</h3>
<table>
<tr><th>Threat Actor</th><th>Motivation</th><th>Capability</th></tr>
<tr><td>Script kiddies</td><td>Thrill, notoriety</td><td>Low — uses pre-built tools</td></tr>
<tr><td>Hacktivists</td><td>Political/social change</td><td>Low–Medium</td></tr>
<tr><td>Cyber criminals</td><td>Financial gain</td><td>Medium–High</td></tr>
<tr><td>Insider threats</td><td>Revenge, financial, negligence</td><td>Variable</td></tr>
<tr><td>State-sponsored</td><td>Espionage, sabotage</td><td>Very High</td></tr>
<tr><td>APTs</td><td>Long-term espionage</td><td>Very High — undetected for months/years</td></tr>
</table>
<div class="def-box"><div class="def-label">Key definition</div><strong>APT (Advanced Persistent Threat)</strong> — a prolonged, targeted cyberattack where intruders remain undetected for extended periods, typically state-sponsored, aimed at data theft or espionage rather than immediate damage.</div>` },
        { title: "Malware Types — The Six You Must Know", content:`
<table>
<tr><th>Type</th><th>How it works</th><th>Real-world example</th></tr>
<tr><td><strong>Virus</strong></td><td>Attaches to files; needs user action to spread</td><td>ILOVEYOU (2000)</td></tr>
<tr><td><strong>Worm</strong></td><td>Self-replicates across networks automatically</td><td>WannaCry (2017 NHS)</td></tr>
<tr><td><strong>Trojan</strong></td><td>Disguises as legitimate software</td><td>Zeus banking trojan</td></tr>
<tr><td><strong>Ransomware</strong></td><td>Encrypts files; demands payment</td><td>WannaCry, NotPetya</td></tr>
<tr><td><strong>Spyware/Keylogger</strong></td><td>Secretly records keystrokes and data</td><td>DarkHotel keylogger</td></tr>
<tr><td><strong>Botnet</strong></td><td>Network of compromised devices</td><td>Mirai IoT botnet</td></tr>
</table>
<div class="exam-tip"><div class="tip-label">💡 Virus vs Worm</div>Virus needs <strong>user action</strong> (opening a file). Worm <strong>self-propagates</strong> across networks. This distinction appears frequently in exam questions.</div>` },
        { title: "Social Engineering — Exploiting the Human Factor", content:`
<h3>Common Social Engineering Attacks</h3>
<table>
<tr><th>Attack</th><th>Method</th><th>Defence</th></tr>
<tr><td>Phishing</td><td>Mass emails impersonating trusted orgs</td><td>Email filtering, user training</td></tr>
<tr><td>Spear phishing</td><td>Targeted using personal info</td><td>MFA, verification culture</td></tr>
<tr><td>Whaling</td><td>Targeting senior executives (CEO fraud)</td><td>Payment verification procedures</td></tr>
<tr><td>Vishing</td><td>Voice phishing — fake phone calls</td><td>Never give credentials over phone</td></tr>
<tr><td>Smishing</td><td>SMS phishing — malicious text links</td><td>Don't click links from unknown senders</td></tr>
<tr><td>Pretexting</td><td>Fabricated scenario to extract info</td><td>Verify identity independently</td></tr>
<tr><td>Baiting</td><td>Infected USB drives left as "bait"</td><td>Never plug in unknown devices</td></tr>
<tr><td>Tailgating</td><td>Following authorised person through door</td><td>Security guards, mantraps</td></tr>
</table>
<div class="exam-tip"><div class="tip-label">💡 Phishing vs Spear Phishing</div>Phishing = generic/mass ("spray and pray"). Spear phishing = targeted using research about the victim. Whaling = spear phishing aimed at C-suite executives.</div>` },
        { title: "Network & Web Application Attacks", content:`
<h3>Network-Based Attacks</h3>
<ul>
<li><strong>DDoS:</strong> multiple compromised devices flood target — server overwhelmed</li>
<li><strong>MITM:</strong> attacker intercepts communication — mitigated by HTTPS/TLS</li>
<li><strong>DNS poisoning:</strong> corrupts DNS cache to redirect to fake sites</li>
<li><strong>ARP spoofing:</strong> fake ARP messages to intercept LAN traffic</li>
</ul>
<h3>Web Application Attacks</h3>
<ul>
<li><strong>SQL Injection:</strong> malicious SQL via input fields — prevented by parameterised queries</li>
<li><strong>XSS (Cross-Site Scripting):</strong> malicious scripts injected into web pages</li>
<li><strong>CSRF:</strong> tricks user into performing unwanted actions on authenticated site</li>
<li><strong>Buffer overflow:</strong> excess data overwrites adjacent memory</li>
</ul>
<div class="exam-tip"><div class="tip-label">💡 DDoS extended response (4+ marks)</div>Cover: (1) what it is, (2) how it works (botnet), (3) impact (server down, no legitimate access), (4) business consequence (revenue loss, reputation).</div>` },
        { title: "UK Legislation & Ethical Responsibilities", content:`
<h3>Key Legislation</h3>
<table>
<tr><th>Law</th><th>What it covers</th><th>Max penalty</th></tr>
<tr><td>Computer Misuse Act 1990</td><td>Unauthorised access/modification</td><td>S3: 10 years imprisonment</td></tr>
<tr><td>UK GDPR / DPA 2018</td><td>Personal data protection</td><td>£17.5m or 4% global turnover</td></tr>
<tr><td>RIPA 2000</td><td>Lawful interception of communications</td><td>Requires warrants</td></tr>
<tr><td>Official Secrets Act 1989</td><td>Protection of state secrets</td><td>Criminal prosecution</td></tr>
</table>
<h3>Ethical Responsibilities</h3>
<ul>
<li><strong>Responsible disclosure:</strong> notify vendor first; give time to patch before going public</li>
<li><strong>Professional codes:</strong> BCS and CIISec codes require integrity, competence, public interest</li>
<li><strong>Ethical hacking:</strong> must have written authorisation with defined scope — without it, it's illegal under CMA</li>
</ul>` },
        { title: "Protection Measures — Encryption & Firewalls", content:`
<h3>Encryption Types</h3>
<ul>
<li><strong>Symmetric (AES):</strong> same key encrypts/decrypts — fast, for bulk data (BitLocker)</li>
<li><strong>Asymmetric (RSA):</strong> public key encrypts, private decrypts — TLS/HTTPS, digital signatures</li>
<li><strong>Hashing (SHA-256):</strong> one-way, cannot reverse — password storage, file integrity</li>
<li><strong>TLS/SSL:</strong> hybrid — asymmetric to exchange symmetric key, then symmetric for data</li>
<li><strong>E2EE:</strong> only sender/recipient can read — WhatsApp, Signal</li>
</ul>
<h3>Firewall Types</h3>
<table>
<tr><th>Type</th><th>OSI Layer</th><th>Strength</th></tr>
<tr><td>Packet filtering</td><td>3–4</td><td>Fast, simple</td></tr>
<tr><td>Stateful inspection</td><td>3–4</td><td>Understands connection context</td></tr>
<tr><td>Application/Proxy</td><td>7</td><td>Inspects content; blocks specific apps</td></tr>
<tr><td>NGFW</td><td>3–7</td><td>Firewall + IPS + threat intelligence</td></tr>
</table>` },
        { title: "Authentication, Access Control & Device Security", content:`
<h3>MFA — Three Factor Categories</h3>
<ul><li><strong>Something you KNOW:</strong> password, PIN</li><li><strong>Something you HAVE:</strong> phone, token, smart card</li><li><strong>Something you ARE:</strong> fingerprint, face, iris (biometrics)</li></ul>
<div class="exam-tip"><div class="tip-label">💡 Password + security question ≠ MFA</div>Both are "something you know." True MFA requires at least two <strong>different</strong> factor types.</div>
<h3>Access Control Models</h3>
<ul><li><strong>DAC:</strong> owner controls access — flexible</li><li><strong>MAC:</strong> system enforces by security labels — military/government</li><li><strong>RBAC:</strong> permissions by role — most common in business</li><li><strong>Least privilege:</strong> minimum access for job — limits damage</li><li><strong>Separation of duties:</strong> critical tasks require two people</li></ul>
<h3>Device Security</h3>
<ul><li>Screen lock with auto-timeout</li><li>Remote wipe for lost/stolen devices</li><li>GPS tracking / phone home</li><li>TPM (Trusted Platform Module) for secure key storage</li><li>Secure boot — only trusted OS loads</li></ul>` },
        { title: "📝 Exam Practice — Aim A", subtitle:"Apply your knowledge to exam-style questions", content:`
<div class="exam-tip"><div class="tip-label">⏱ 4-mark question — spend 5 minutes</div></div>
<h3>Question:</h3>
<p style="font-size:16px;"><em>A healthcare organisation is implementing Multi-Factor Authentication (MFA) for all staff accessing patient record systems. Some staff have raised concerns about convenience.</em></p>
<p style="font-size:16px;"><strong>Explain the benefits and drawbacks of implementing MFA for the healthcare organisation. (4 marks)</strong></p>
<div class="def-box"><div class="def-label">Model Answer</div>
<p><strong>Benefits:</strong> MFA significantly reduces the risk of unauthorised access — even if a password is stolen via phishing, the attacker cannot access the system without the second factor. For healthcare data this is critical — patient records are highly sensitive and a breach would violate GDPR with fines up to £17.5 million.</p>
<p><strong>Drawbacks:</strong> Staff may resist the change — needing a phone or token for every login adds steps and can be perceived as inconvenient in fast-paced clinical environments. Lost tokens can lock staff out, potentially delaying patient care.</p>
</div>
<h3>🎯 Self-Assessment Checklist</h3>
<ul><li>✅ I can name at least 4 types of threat actor</li><li>✅ I can describe how ransomware, worms, and trojans work</li><li>✅ I can explain the difference between phishing and spear phishing</li><li>✅ I can identify at least 3 protection measures (encryption, firewall, MFA)</li></ul>` }
      ]
    },
    {
      aim: "Aim B",
      title: "Network Architectures & Principles for Security",
      description: "Network types, topologies, TCP/IP, DNS, DHCP, routing, authentication services, VPNs, cloud security, IoT and BYOD.",
      slides: [
        { title: "Network Types & Their Security Implications", content:`
<table>
<tr><th>Type</th><th>Scope</th><th>Security consideration</th></tr>
<tr><td>LAN</td><td>Single building</td><td>Physically controlled; don't assume internal = safe</td></tr>
<tr><td>WLAN</td><td>Wireless LAN</td><td>WPA3 encryption, MAC filtering, 802.1X enterprise</td></tr>
<tr><td>WAN</td><td>Multiple sites</td><td>Traffic crosses public infrastructure — must use VPN</td></tr>
<tr><td>SAN</td><td>Storage network</td><td>Isolate from user network; access controls, zoning</td></tr>
<tr><td>PAN</td><td>Personal (~10m)</td><td>Bluetooth vulnerabilities; secure pairing essential</td></tr>
<tr><td>Intranet</td><td>Private internal web</td><td>Only internal; still needs authentication</td></tr>
<tr><td>Extranet</td><td>External partners</td><td>VPN, MFA, strict access controls — higher risk</td></tr>
</table>
<h3>Key Security Principle</h3>
<p>Every network type creates a different attack surface. Match your security controls to the specific risks of each network type.</p>` },
        { title: "Network Topologies & Architecture", content:`
<h3>Topology Security Comparison</h3>
<table>
<tr><th>Topology</th><th>Security advantage</th><th>Security risk</th></tr>
<tr><td>Star</td><td>Switch can implement port security, VLANs</td><td>Switch = single point of failure</td></tr>
<tr><td>Extended Star</td><td>Segmented — one branch compromise doesn't spread</td><td>Each interconnecting link must be secured</td></tr>
<tr><td>Hierarchical</td><td>Apply security at core/distribution/access tiers</td><td>Core compromise affects everything</td></tr>
<tr><td>Wireless Mesh</td><td>Self-healing; no single point of failure</td><td>Every node = potential entry point</td></tr>
</table>
<h3>Client-Server vs Peer-to-Peer</h3>
<ul><li><strong>Client-Server:</strong> centralised security, authentication, backup — preferred for business</li><li><strong>Peer-to-Peer:</strong> no central control — each peer is a potential entry point</li></ul>` },
        { title: "Network Components & Media Security", content:`
<h3>Critical Security Devices</h3>
<table>
<tr><th>Device</th><th>Security role</th></tr>
<tr><td>Managed Switch</td><td>Port security, VLANs, 802.1X, disable unused ports</td></tr>
<tr><td>Router</td><td>ACLs, NAT hides internal IPs, firewall integration</td></tr>
<tr><td>Firewall</td><td>Ingress/egress filtering, DMZ, blocks unauthorised access</td></tr>
<tr><td>WAP</td><td>WPA3, MAC filtering, guest isolation, rogue AP detection</td></tr>
<tr><td>IDS/IPS</td><td>IDS: monitor + alert. IPS: inline, actively blocks</td></tr>
</table>
<h3>Connection Media — Wired vs Wireless</h3>
<ul><li><strong>Ethernet:</strong> physical access needed to intercept — inherently more secure</li><li><strong>Wi-Fi:</strong> broadcasts through air — must encrypt with WPA3</li><li><strong>Fibre:</strong> immune to EMI, difficult to tap — preferred for backbone</li><li><strong>Bluetooth:</strong> vulnerable to Bluejacking, Bluesnarfing — keep updated</li></ul>` },
        { title: "TCP/IP, DNS, DHCP & Routing", content:`
<h3>TCP/IP 4-Layer Model</h3>
<table>
<tr><th>Layer</th><th>Protocols</th><th>Security controls</th></tr>
<tr><td>4. Application</td><td>HTTP, HTTPS, SMTP, DNS</td><td>TLS, application firewalls, input validation</td></tr>
<tr><td>3. Transport</td><td>TCP, UDP</td><td>Port filtering, stateful inspection</td></tr>
<tr><td>2. Internet</td><td>IP, ICMP</td><td>IPsec, packet filtering, NAT</td></tr>
<tr><td>1. Network Access</td><td>Ethernet, Wi-Fi</td><td>802.1X, MAC filtering, WPA3</td></tr>
</table>
<h3>DNS Resolution Process</h3>
<ol><li>Check local cache</li><li>Query recursive resolver (ISP)</li><li>Root → TLD (.com) → Authoritative server</li><li>IP returned, cached, connection made</li></ol>
<h3>DHCP — DORA Process</h3>
<p><strong>D</strong>iscover → <strong>O</strong>ffer → <strong>R</strong>equest → <strong>A</strong>cknowledge</p>
<div class="def-box"><div class="def-label">Security risk</div>Rogue DHCP server can redirect traffic. Mitigation: DHCP snooping on managed switches.</div>` },
        { title: "Modern Trends — BYOD, IoT & Cloud Security", content:`
<h3>BYOD Security</h3>
<ul><li>Risk: organisational data on personal devices accessible to family/others</li><li>Risk: personal devices lack security patches/antivirus</li><li>Mitigation: MDM with containerisation, mandatory VPN, encryption, remote wipe</li></ul>
<h3>IoT Security Concerns</h3>
<ul><li>Default passwords never changed — easily compromised</li><li>Lack of security updates/patches — vulnerabilities remain forever</li><li>Recruited into botnets (Mirai DDoS)</li><li>Spying via cameras, smart hubs, TVs</li><li>Exposure of medical equipment, vehicles, industrial systems</li></ul>
<h3>Cloud Security — Shared Responsibility</h3>
<ul><li>Provider secures THE cloud (physical, network, hypervisor)</li><li>Customer secures what's IN the cloud (data, access, configurations)</li><li>#1 vulnerability: default misconfigurations</li></ul>` }
      ]
    },
    {
      aim: "Aim C",
      title: "Incident Response & Digital Forensics",
      description: "NIST lifecycle, containment strategies, eradication, evidence handling, chain of custody, forensic tools and legal admissibility.",
      slides: [
        { title: "The NIST Incident Response Lifecycle", content:`
<h3>4 Phases — Know These in Order</h3>
<table>
<tr><th>Phase</th><th>Key Activities</th></tr>
<tr><td><strong>1. Preparation</strong></td><td>Develop IR plan, establish team, acquire tools, train, tabletop exercises, prepare jump kits</td></tr>
<tr><td><strong>2. Detection & Analysis</strong></td><td>Monitor SIEM, IDS/IPS, logs; identify IoCs; determine scope; classify severity</td></tr>
<tr><td><strong>3. Containment, Eradication & Recovery</strong></td><td>Isolate systems, block IPs, disable accounts; remove malware, patch; restore from clean backups</td></tr>
<tr><td><strong>4. Post-Incident Activity</strong></td><td>Lessons learned, update IR plan, implement preventive measures, final report</td></tr>
</table>
<div class="exam-tip"><div class="tip-label">💡 Containment strategy depends on incident type</div>Ransomware → isolate immediately to prevent spread. Data exfiltration → may need to monitor first to identify what was taken. DDoS → traffic filtering, not isolation.</div>` },
        { title: "Incident Communication & Business Continuity", content:`
<h3>Who to notify — in order</h3>
<ol>
<li>Internal IT/security team — immediate containment</li>
<li>Senior management / CISO — within first hour for critical</li>
<li>Legal team — assess regulatory obligations</li>
<li>ICO (regulator) — within 72 hours if personal data breach</li>
<li>Affected individuals — without undue delay if high risk</li>
<li>PR/Media — prepared statement to manage reputation</li>
<li>Law enforcement — if criminal (NCSC, Action Fraud)</li>
</ol>
<h3>RTO vs RPO</h3>
<ul><li><strong>RTO (Recovery Time Objective):</strong> max acceptable downtime</li><li><strong>RPO (Recovery Point Objective):</strong> max acceptable data loss (in time)</li></ul>
<h3>Recovery Site Types</h3>
<ul><li><strong>Hot:</strong> fully operational, real-time replication, failover in minutes — most expensive</li><li><strong>Warm:</strong> partially equipped, some data — hours to days</li><li><strong>Cold:</strong> empty facility — days to weeks — cheapest</li></ul>` },
        { title: "Digital Forensics — Principles & Chain of Custody", content:`
<h3>ACPO 4 Principles of Digital Evidence</h3>
<ol>
<li>No action should change data on original evidence</li>
<li>If original data must be accessed, person must be competent and able to explain their actions</li>
<li>Audit trail of all processes must be created and preserved</li>
<li>Person in charge has overall responsibility for compliance</li>
</ol>
<h3>Chain of Custody</h3>
<ul>
<li>Documents every person who handled evidence — when, why, what they did</li>
<li>Must be unbroken — any gap = evidence inadmissible</li>
<li>Includes: collection date/time, collector, storage location, all transfers</li>
<li>Each transfer signed and witnessed</li>
</ul>
<h3>Order of Volatility</h3>
<p>Collect most volatile first: CPU cache → RAM → Running processes → Temporary files → Hard disk → Backups</p>` },
        { title: "Forensic Acquisition & Analysis", content:`
<h3>Creating a Forensic Copy</h3>
<ul>
<li><strong>Write blocker:</strong> prevents any modification to original evidence drive</li>
<li><strong>Disk imaging:</strong> bit-for-bit copy — includes deleted files and slack space</li>
<li><strong>Hashing:</strong> MD5/SHA of original and copy must match — proves copy is identical</li>
<li><strong>All analysis on copy, never original</strong></li>
</ul>
<h3>Analysis Techniques</h3>
<ul>
<li><strong>File carving:</strong> recover deleted files by searching for file headers/footers</li>
<li><strong>Timeline analysis:</strong> reconstruct events using file timestamps (MAC times)</li>
<li><strong>Registry analysis:</strong> Windows registry reveals installed software, user activity</li>
<li><strong>Log analysis:</strong> correlate events across system, security, firewall logs</li>
<li><strong>Memory analysis:</strong> examine RAM for malware, encryption keys, network connections</li>
<li><strong>Network forensics:</strong> analyse captured packets (PCAP) to trace attacker activity</li>
</ul>
<h3>Legal Admissibility</h3>
<p>Evidence must be: <strong>Relevant</strong> (relates to case), <strong>Reliable</strong> (integrity maintained), <strong>Legally obtained</strong> (proper authorisation).</p>` }
      ]
    },
    {
      aim: "Aim D",
      title: "Testing, Monitoring & Evaluating Systems",
      description: "Vulnerability assessment, penetration testing, SAST/DAST, IDS/IPS, SIEM, log management, security metrics and auditing.",
      slides: [
        { title: "Vulnerability Assessment & Penetration Testing", content:`
<div class="def-box"><div class="def-label">Key distinction</div><strong>VA = "What weaknesses exist?"</strong><br><strong>PT = "Can they be exploited, and what is the impact?"</strong></div>
<h3>Penetration Testing Approaches</h3>
<table>
<tr><th>Type</th><th>Knowledge</th><th>Simulates</th></tr>
<tr><td>Black box</td><td>Zero prior knowledge</td><td>External attacker</td></tr>
<tr><td>White box</td><td>Full access (code, diagrams, creds)</td><td>Insider threat / thorough audit</td></tr>
<tr><td>Grey box</td><td>Limited (user-level credentials)</td><td>Attacker with some access</td></tr>
</table>
<h3>Penetration Testing Phases</h3>
<ol>
<li><strong>Reconnaissance</strong> — gather information (OSINT, scanning)</li>
<li><strong>Scanning & Enumeration</strong> — identify open ports, services, vulnerabilities</li>
<li><strong>Exploitation</strong> — gain access using identified vulnerabilities</li>
<li><strong>Post-exploitation</strong> — maintain access, escalate, pivot</li>
<li><strong>Reporting</strong> — findings with risk ratings and remediation</li>
</ol>` },
        { title: "Code Review — SAST vs DAST", content:`
<h3>SAST (Static Application Security Testing)</h3>
<ul>
<li>Analyses source code without executing the application</li>
<li>White box approach — finds vulnerabilities early in SDLC</li>
<li>Detects: SQL injection, buffer overflows, hardcoded credentials</li>
<li>Tools: SonarQube, Fortify, Checkmarx</li>
</ul>
<h3>DAST (Dynamic Application Security Testing)</h3>
<ul>
<li>Tests running application from outside</li>
<li>Black box approach — finds runtime vulnerabilities</li>
<li>Detects: misconfigurations, authentication flaws, session issues</li>
<li>Tools: OWASP ZAP, Burp Suite, Acunetix</li>
</ul>
<h3>SAST + DAST = Complementary</h3>
<ul><li>SAST finds code-level issues early</li><li>DAST finds deployment/runtime issues</li><li>Use both for comprehensive coverage</li></ul>
<h3>OWASP Top 10</h3>
<p>The industry-standard list of most critical web application security risks — injection, broken auth, XSS, security misconfiguration, and more.</p>` },
        { title: "IDS/IPS & SIEM — Detection & Monitoring", content:`
<h3>IDS vs IPS</h3>
<table>
<tr><th></th><th>IDS</th><th>IPS</th></tr>
<tr><td>Position</td><td>Out-of-band (copies traffic)</td><td>Inline (traffic passes through)</td></tr>
<tr><td>Action</td><td>Alerts only — does not block</td><td>Can block/drop malicious traffic</td></tr>
<tr><td>Failure</td><td>Fails silently (misses attacks)</td><td>Can fail open or closed</td></tr>
</table>
<ul>
<li><strong>HIDS/HIPS:</strong> Host-based — on individual servers/endpoints</li>
<li><strong>NIDS/NIPS:</strong> Network-based — monitors traffic at strategic points</li>
</ul>
<h3>SIEM — Security Information & Event Management</h3>
<ol>
<li><strong>Collect</strong> — logs from everything (firewalls, servers, endpoints, cloud)</li>
<li><strong>Normalise</strong> — convert diverse formats to common schema</li>
<li><strong>Correlate</strong> — connect events: "5 failed logins in 1 min → alert"</li>
<li><strong>Alert</strong> — real-time notifications for security team</li>
<li><strong>Dashboard</strong> — visualise security posture</li>
<li><strong>Retain</strong> — store for compliance and forensics</li>
</ol>` },
        { title: "Security Metrics, Logging & Vulnerability Management", content:`
<h3>Key Security Metrics (KPIs)</h3>
<table>
<tr><th>Metric</th><th>What it measures</th><th>Target</th></tr>
<tr><td>MTTD</td><td>Mean Time to Detect</td><td>Hours, not days</td></tr>
<tr><td>MTTR</td><td>Mean Time to Respond/Remediate</td><td>Minutes for critical</td></tr>
<tr><td>Patch compliance</td><td>% systems with latest patches</td><td>>95% for critical patches</td></tr>
<tr><td>Open vulnerabilities</td><td>Number and severity</td><td>Zero critical, declining trend</td></tr>
<tr><td>Phishing click rate</td><td>% users who click simulated phishing</td><td><5% (improving)</td></tr>
</table>
<h3>Vulnerability Management Lifecycle</h3>
<ol>
<li><strong>Discover</strong> — identify all assets</li>
<li><strong>Assess</strong> — scan for vulnerabilities</li>
<li><strong>Prioritise</strong> — use CVSS scores + business context</li>
<li><strong>Remediate</strong> — patch, reconfigure, compensating controls</li>
<li><strong>Verify</strong> — rescan to confirm fix</li>
<li><strong>Report</strong> — document posture, trends, compliance</li>
</ol>
<h3>Log Management Best Practices</h3>
<ul><li>Centralised logging to SIEM/syslog — prevents attackers deleting local logs</li><li>Log integrity — hash logs to detect tampering</li><li>Time sync — all systems use NTP for accurate correlation</li><li>Retention — balance storage cost vs compliance (90 days to 1 year)</li></ul>` }
      ]
    }
  ]
};
