// AAQ 2025 Spec data — Unit 2 Learning Aims A–D (Issue 5, Nov 2025)
// Cyber Security and Incident Management
const SPEC = {
  A: {
    title: "Understand personal responsibilities to develop good cyber hygiene",
    short: "Threats, vulnerabilities, legal/ethical considerations, security protection measures",
    topics: [
      { code: "A1", name: "Cyber security threats" },
      { code: "A1.1", name: "Types of threat actors: script kiddies, hacktivists, cyber criminals, insider threats, state-sponsored, advanced persistent threats (APTs)" },
      { code: "A1.2", name: "Malware types: viruses, worms, trojans, ransomware, spyware, adware, rootkits, botnets, keyloggers, logic bombs" },
      { code: "A1.3", name: "Social engineering: phishing, spear phishing, whaling, vishing, smishing, pretexting, baiting, tailgating, shoulder surfing, dumpster diving" },
      { code: "A1.4", name: "Network-based attacks: DoS/DDoS, man-in-the-middle (MITM), session hijacking, DNS poisoning, ARP spoofing, packet sniffing" },
      { code: "A1.5", name: "Web application attacks: SQL injection, cross-site scripting (XSS), cross-site request forgery (CSRF), buffer overflow" },
      { code: "A1.6", name: "Physical threats: theft, sabotage, natural disasters, hardware failure, power loss" },
      { code: "A2", name: "System vulnerabilities" },
      { code: "A2.1", name: "Software vulnerabilities: unpatched systems, zero-day exploits, legacy/end-of-life systems, default configurations" },
      { code: "A2.2", name: "Network vulnerabilities: open ports, weak encryption, unsecured Wi-Fi, rogue access points, misconfigured firewalls" },
      { code: "A2.3", name: "Human vulnerabilities: lack of training, poor password practices, insider threats, social engineering susceptibility" },
      { code: "A2.4", name: "Supply chain risks: third-party software, vendor access, cloud service dependencies" },
      { code: "A3", name: "Legal and ethical considerations" },
      { code: "A3.1", name: "UK Legislation: Computer Misuse Act 1990, GDPR/Data Protection Act 2018, Regulation of Investigatory Powers Act 2000 (RIPA), Official Secrets Act 1989" },
      { code: "A3.2", name: "Ethical responsibilities: responsible disclosure, ethical hacking guidelines, professional codes of conduct (BCS, CIISec)" },
      { code: "A3.3", name: "Organisational policies: Acceptable Use Policies (AUP), Information Security Policies, Bring Your Own Device (BYOD) policies, access control policies" },
      { code: "A3.4", name: "Compliance & standards: ISO 27001, Cyber Essentials, PCI DSS, NIST Cybersecurity Framework" },
      { code: "A4", name: "Security protection measures and techniques" },
      { code: "A4.1", name: "Physical security: access control (biometrics, smart cards, PIN), CCTV, security guards, alarms, protected cabling, device locks" },
      { code: "A4.2", name: "Data protection: backup types (full/differential/incremental), backup strategies (onsite/offsite/cloud), RAID levels (0/1/5/10), archiving vs backup, disaster recovery" },
      { code: "A4.3", name: "Antivirus/anti-malware: signature-based detection, heuristic analysis, file integrity checking, quarantine/deletion, real-time scanning" },
      { code: "A4.4", name: "Firewalls: packet filtering, stateful inspection, application layer (proxy), inbound/outbound rules, hardware vs software, next-generation firewalls (NGFW)" },
      { code: "A4.5", name: "Authentication: passwords & policies, multi-factor authentication (MFA), biometrics, security tokens (connected/contactless/disconnected), Kerberos, certificate-based authentication" },
      { code: "A4.6", name: "Access control: Discretionary (DAC), Mandatory (MAC), Role-Based (RBAC), Rule-Based, least privilege principle, separation of duties" },
      { code: "A4.7", name: "Wireless security: WPA2/WPA3, MAC filtering, SSID hiding, evil twin attacks, wireless sniffing mitigations" },
      { code: "A4.8", name: "Encryption: symmetric (AES), asymmetric (RSA, Diffie-Hellman), hashing (SHA-256), storage encryption, communications encryption (TLS/SSL, HTTPS, VPN, E2EE), digital certificates & PKI" },
      { code: "A4.9", name: "Device security: screen lock, remote wipe, GPS tracking, device encryption, secure boot, trusted platform module (TPM)" },
      { code: "A4.10", name: "Security by design: threat modelling, defence in depth, secure development lifecycle (SDLC), least privilege, assume breach mentality" }
    ]
  },
  B: {
    title: "Use of networking architectures and principles for security",
    short: "Network types, topologies, components, infrastructure services, modern trends",
    topics: [
      { code: "B1", name: "Network types and topologies" },
      { code: "B1.1", name: "Network types: LAN, WLAN, WAN, SAN, PAN, Internet, intranet, extranet, cloud networks" },
      { code: "B1.2", name: "Network topologies: star, extended star, hierarchical, wireless mesh, ad-hoc (BYOD), logical bus, logical ring" },
      { code: "B1.3", name: "Network architecture: peer-to-peer, client/server, thin client" },
      { code: "B1.4", name: "Modern trends: virtualisation (segmentation/sandboxing), cloud computing security issues, BYOD, SDN, SAN, IoT security, remote working security" },
      { code: "B2", name: "Network components and media" },
      { code: "B2.1", name: "End-user devices: mobile devices, workstations, servers, NAS, printers, scanners, multi-functional devices" },
      { code: "B2.2", name: "Connectivity devices: switches (managed/unmanaged), routers, gateways, bridges, repeaters, access points, USB hubs, modems (DSL/fibre/wireless)" },
      { code: "B2.3", name: "Connection media: Ethernet (Cat5e/6/6a/7/8), USB, Wi-Fi (802.11 family), NFC, Bluetooth, cellular (5G), optical fibre, Li-Fi" },
      { code: "B2.4", name: "External media security: encryption, secure disposal, loss/theft prevention, data corruption risks, malware vectors" },
      { code: "B2.5", name: "Software components: OS (GUI/CLI/web interface), network monitoring tools (Wireshark, Nmap), vulnerability scanners, remote access tools" },
      { code: "B3", name: "Networking infrastructure services and protocols" },
      { code: "B3.1", name: "TCP/IP 4-layer model: Application, Transport, Internet, Network Access; packets/headers, error correction" },
      { code: "B3.2", name: "Ports & protocols: TCP vs UDP, common ports (80 HTTP, 443 HTTPS, 22 SSH, 25 SMTP, 53 DNS, 3389 RDP), packet structure" },
      { code: "B3.3", name: "IP addressing: IPv4/IPv6 structure, NAT (static/dynamic/PAT), RFC 1918 private addresses, APIPA (169.254.x.x), loopback (127.0.0.1)" },
      { code: "B3.4", name: "DNS: resolution process, reverse DNS, DNS cache poisoning, DNSSEC" },
      { code: "B3.5", name: "DHCP: IP allocation (DORA process), address ranges, lease times, reservations, static vs dynamic addressing" },
      { code: "B3.6", name: "Authentication services: single-factor, two-factor (2FA), multi-factor (MFA), single sign-on (SSO), PAP, CHAP, EAP, RADIUS, TACACS+" },
      { code: "B3.7", name: "Directory services: Active Directory, OpenLDAP, identity & access management, group policy" },
      { code: "B3.8", name: "Routing: static vs dynamic routing, routing tables, IGPs (RIP, OSPF, EIGRP), EGPs (BGP), BGP for internet routing" },
      { code: "B3.9", name: "Remote access: VPN (site-to-site, client-based), Remote Desktop (RDP), SSH, dial-up, handshake/connection processes" }
    ]
  },
  C: {
    title: "Respond to and manage cyber security incidents",
    short: "Incident response lifecycle, digital forensics, evidence handling, disaster recovery",
    topics: [
      { code: "C1", name: "Incident response" },
      { code: "C1.1", name: "Incident Response Lifecycle: Preparation, Detection & Analysis, Containment/Eradication/Recovery, Post-Incident Activity (NIST framework)" },
      { code: "C1.2", name: "Incident classification: severity levels, types (malware, DoS, unauthorised access, data breach, policy violation), prioritisation" },
      { code: "C1.3", name: "Containment strategies: isolation (network segmentation), system quarantine, disabling accounts, blocking IPs, taking systems offline" },
      { code: "C1.4", name: "Eradication & recovery: removing malware, closing vulnerabilities, patching, restoring from clean backups, rebuilding systems" },
      { code: "C1.5", name: "Communication plans: internal notification (IT, management, legal, PR), external notification (customers, regulators, law enforcement, media)" },
      { code: "C1.6", name: "Documentation: incident logs, chain of custody, evidence handling, post-incident reports, lessons learned" },
      { code: "C1.7", name: "Business continuity & disaster recovery: RTO (Recovery Time Objective), RPO (Recovery Point Objective), BCP, DRP, failover, hot/warm/cold sites" },
      { code: "C2", name: "Digital forensics" },
      { code: "C2.1", name: "Forensic principles: ACPO guidelines, maintaining evidence integrity, chain of custody, order of volatility" },
      { code: "C2.2", name: "Evidence types: volatile evidence (RAM, running processes, network connections), non-volatile evidence (hard drives, logs, files)" },
      { code: "C2.3", name: "Forensic acquisition: disk imaging (DD, FTK Imager), write blockers, forensic copies vs original evidence, hashing (MD5/SHA for integrity verification)" },
      { code: "C2.4", name: "Analysis techniques: timeline analysis, file carving, registry analysis, log analysis, network forensics (PCAP files), memory analysis" },
      { code: "C2.5", name: "Forensic tools: Autopsy/Sleuth Kit, Volatility, Wireshark, FTK, EnCase, Sysinternals suite, crowd-sourced intelligence" },
      { code: "C2.6", name: "Legal admissibility: evidence must be relevant, reliable, obtained legally; expert witness testimony; court presentation of digital evidence" }
    ]
  },
  D: {
    title: "Test, monitor and evaluate systems",
    short: "Security testing, vulnerability assessment, penetration testing, monitoring systems",
    topics: [
      { code: "D1", name: "Security testing and assessment" },
      { code: "D1.1", name: "Vulnerability assessment: automated scanning (Nessus, OpenVAS), manual assessment, false positives/negatives, CVSS scoring" },
      { code: "D1.2", name: "Penetration testing: black box, white box, grey box testing; reconnaissance, scanning, exploitation, post-exploitation, reporting" },
      { code: "D1.3", name: "Testing methodologies: OSSTMM, OWASP Top 10, PTES (Penetration Testing Execution Standard), NIST SP 800-115" },
      { code: "D1.4", name: "Social engineering testing: phishing simulations, physical security testing, USB drops, pretexting exercises" },
      { code: "D1.5", name: "Code review: static analysis (SAST), dynamic analysis (DAST), manual code review, secure coding practices (input validation, output encoding)" },
      { code: "D2", name: "Monitoring, logging and evaluation" },
      { code: "D2.1", name: "Security monitoring: intrusion detection systems (IDS), intrusion prevention systems (IPS), host-based (HIDS/HIPS), network-based (NIDS/NIPS)" },
      { code: "D2.2", name: "SIEM (Security Information and Event Management): log aggregation, correlation rules, alerting, dashboards (Splunk, ELK Stack, Azure Sentinel)" },
      { code: "D2.3", name: "Log management: types (system, application, security, audit logs), centralised logging (syslog), log retention policies, log integrity" },
      { code: "D2.4", name: "Network monitoring: packet analysis (Wireshark, tcpdump), NetFlow/sFlow, SNMP, bandwidth monitoring, baseline deviation detection" },
      { code: "D2.5", name: "Vulnerability management lifecycle: discover, assess, prioritise, remediate, verify, report; patch management processes" },
      { code: "D2.6", name: "Security metrics & KPIs: Mean Time to Detect (MTTD), Mean Time to Respond (MTTR), number of open vulnerabilities, patch compliance rate, incident trends" },
      { code: "D2.7", name: "Auditing & compliance monitoring: configuration audits, access reviews, policy compliance checks, continuous monitoring programs" }
    ]
  }
};

const COMMAND_VERBS = ["State", "Give", "Identify", "Name", "Describe", "Explain", "Discuss", "Evaluate", "Analyse", "Compare", "Recommend", "Justify"];
const MARKS_OPTIONS = [1, 2, 3, 4, 6, 8, 9, 12, 15];
