// AAQ 2025 Spec data — Unit 2 Learning Aims A–D (Issue 5, Nov 2025)
// Cyber Security and Incident Management
const SPEC = {
  A: {
    title: "Cyber security threats, system vulnerabilities and security protection methods",
    short: "Internal and external threats, vulnerabilities, legislation, protection measures",
    topics: [
      { code: "A1", name: "Cyber security threats" },
      { code: "A1.1", name: "Internal threats: employee sabotage (deliberate/accidental); accidental or deliberate damage; weak cyber security measures and unsafe practices; accidental loss or disclosure of data/credentials" },
      { code: "A1.2", name: "External threats: malware (viruses, spyware, adware, ransomware, bots); hacking (DoS/DDoS, browser hijack, cyberwarfare, data theft/tampering); sabotage; social engineering (phishing, vishing, smishing, whaling, spear phishing, DNS spoofing, pretexting); physical security (tailgating, shoulder surfing, theft)" },
      { code: "A1.3", name: "Impact of a credible threat: operational loss, financial loss, reputational loss, intellectual property loss" },
      { code: "A1.4", name: "Threat landscape updates: NCSC UK, NIST USA, OWASP Top 10" },
      { code: "A2", name: "System vulnerabilities" },
      { code: "A2.1", name: "Vulnerabilities of systems: network (firewall ports), organisational (permissions, password policy/management), software, OS/GUI/CLI, mobile devices, physical, people/process, cloud computing and IoT" },
      { code: "A2.2", name: "Sources of vulnerability information: manufacturer's website, forums, third-party websites" },
      { code: "A2.3", name: "Attack vectors: wireless (Wi-Fi, Bluetooth, cellular, satellite, IR, NFC, RFID), internet connection, internal network access devices" },
      { code: "A2.4", name: "Vulnerability assessment tools: port scanner, network mapper, registry checker, website vulnerability scanner, vulnerability detection software, user vulnerability assessment" },
      { code: "A2.5", name: "Independent third-party review: due diligence, third-party certification" },
      { code: "A2.6", name: "Penetration testing: finding weak spots, checking against known vulnerabilities, producing reports" },
      { code: "A2.7", name: "Passive risk management measures: risk transfer, risk avoidance, risk acceptance" },
      { code: "A3", name: "Legal responsibilities" },
      { code: "A3.1", name: "Current legislation: General Data Protection Regulation (GDPR), Computer Misuse Act 1990" },
      { code: "A3.2", name: "Areas legislation applies to: data protection in storage and transfer, privacy/PII, unauthorised access to computers and data" },
      { code: "A3.3", name: "Legal responsibilities: GDPR principles, legal reasons for processing, personal rights; Computer Misuse Act responsibilities" },
      { code: "A4", name: "Software and hardware security measures" },
      { code: "A4.1", name: "Physical security; data storage/backup/recovery; antivirus; firewalls; authentication; access controls (DAC, RBAC); trusted computing; finding lost/stolen devices; device-based security" },
      { code: "A4.2", name: "Encryption: storage encryption, communications encryption (symmetric AES, asymmetric RSA/Diffie-Hellman, TOR, VPN, HTTPS, E2EE)" },
      { code: "A4.3", name: "WLAN protection: MAC filtering, SSID hiding, WPA2/3, WPS, wireless vulnerabilities and mitigation" },
      { code: "A4.4", name: "Security by design: expect attacks, fewest privileges, no reliance on secrecy, ISO 27000 compliance" }
    ]
  },
  B: {
    title: "Use of networking architectures and principles for security",
    short: "Network types, topologies, components, infrastructure services, modern trends",
    topics: [
      { code: "B1", name: "Network types" },
      { code: "B1.1", name: "Network types: LAN, WLAN, WAN, SAN, PAN, the internet; private networks (intranet, extranet, cloud); wired/wireless integration; schematic diagrams; cyber-security-related features" },
      { code: "B1.2", name: "Network topologies: physical (star, extended star, hierarchical, wireless mesh, ad-hoc); logical (bus, ring)" },
      { code: "B1.3", name: "Network architecture: peer-to-peer, client/server, thin client" },
      { code: "B1.4", name: "Modern trends: virtualisation, cloud computing, BYOD, SDN, SAN, IoT, remote working" },
      { code: "B2", name: "Network components" },
      { code: "B2.1", name: "Hardware components: end-user devices, connectivity devices (switch, router, gateway, bridge, repeater, access point, USB hub, modem), connection media (cable, wireless, optical fibre, Li-Fi)" },
      { code: "B2.2", name: "External media and storage security issues: encryption, secure disposal, loss/theft, interception, data corruption, lifespan, malware vector" },
      { code: "B2.3", name: "Software components: OS (GUI/CLI/web interface), monitoring/management tools, network applications" },
      { code: "B3", name: "Networking infrastructure services and resources" },
      { code: "B3.1", name: "TCP/IP (four-layer model, TLS, packets/headers, error correction); ports; packet structure; NAT and IPv4/IPv6 addressing (RFC 1918, APIPA, loopback)" },
      { code: "B3.2", name: "Domains, sub-domains and segmentation: hierarchy, trust relationships, access control, security benefits" },
      { code: "B3.3", name: "Network devices to configure networks: server, router, switch, WAP, firewall, bridge, gateway" },
      { code: "B3.4", name: "Network infrastructure services: DNS, directory services, authentication services, DHCP, routing, remote access services" },
      { code: "B3.5", name: "Network services and resources: file/print services, web/mail/communications services" }
    ]
  },
  C: {
    title: "Cyber security documentation",
    short: "Internal IT security policies: cyber security, audits, backups, data protection, disaster recovery",
    topics: [
      { code: "C1", name: "Internal policies" },
      { code: "C1.1", name: "General IT policies: cyber security policy (Plan-Do-Check-Act, ISO 27001), internet/email use, security/password procedures, staff responsibilities, staff IT security training" },
      { code: "C1.2", name: "Security audits and their application to check compliance against policies" },
      { code: "C1.3", name: "Backup policy: selection, methods, type, frequency, storage, responsibility, testing, legal compliance, recovery" },
      { code: "C1.4", name: "Data protection policy: Data Protection Officer, principles, rights/privacy, training, system security, external contractors, accountability" },
      { code: "C1.5", name: "Cyber security incident response policy: contacts, procedures/flowcharts, communications" },
      { code: "C1.6", name: "Disaster recovery policy: purpose/scope, triage, roles/responsibilities, contact lists, monitoring/reporting" },
      { code: "C1.7", name: "External services policy: cloud, hardware, software, support" }
    ]
  },
  D: {
    title: "Forensic procedures",
    short: "Forensic collection of evidence and systematic analysis of a suspect system",
    topics: [
      { code: "D1", name: "Forensic collection of evidence" },
      { code: "D1.1", name: "Forensics on devices (servers, PCs, mobile): meeting requirements, challenges of live forensics, network forensics, documenting the scene" },
      { code: "D2", name: "Systematic forensic analysis of a suspect system" },
      { code: "D2.1", name: "Requirements for accurate records: snapshots, recording findings, recording alterations, visual evidence, relevance/false positives" },
      { code: "D2.2", name: "Assessing findings: evidence of a crime/incident, external/internal compromise indicators" },
      { code: "D2.3", name: "Writing security reports: report structure, preventing recurrence, improving IT policies and protection measures" }
    ]
  }
};

const COMMAND_VERBS = ["State", "Give", "Identify", "Name", "Describe", "Explain", "Evaluate", "Complete", "Analyse", "Compare", "Recommend", "Justify"];
const MARKS_OPTIONS = [1, 2, 3, 4, 6, 8, 9, 12, 15];