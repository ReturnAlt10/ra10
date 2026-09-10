// BTEC IT Unit 2 — Data Loader
// Loads questions, quiz, flashcards. Exposes QUESTIONS, QUIZ, FLASHCARDS globals.
let QUESTIONS = [];
let QUIZ = [];
let FLASHCARDS = [];
let DATA_READY = false;
const DATA_LISTENERS = [];

function onDataReady(cb) {
  if (DATA_READY) cb();
  else DATA_LISTENERS.push(cb);
}

function chooseGenericOrgLabel(text) {
  const t = String(text || '').toLowerCase();
  if (/(school|college|academy|student|teacher|classroom)/.test(t)) return 'A secondary school';
  if (/(network|server|isp|hosting|telecom|infrastructure)/.test(t)) return 'A network services company';
  if (/(hospital|clinic|patient|nhs|health|care home|gp practice)/.test(t)) return 'A healthcare organisation';
  if (/(retail|shop|store|e-commerce|customer orders|point of sale)/.test(t)) return 'A retail business';
  if (/(bank|finance|insurance|accounting|financial)/.test(t)) return 'A financial services company';
  if (/(factory|manufactur|assembly line|warehouse production)/.test(t)) return 'A manufacturing company';
  return 'An IT services company';
}

function genericiseScenario(scenario) {
  const source = String(scenario || '');
  if (!source.trim()) return source;
  const generic = chooseGenericOrgLabel(source);
  let next = source;
  next = next.replace(/\b([A-Z][A-Za-z0-9&'\-]*(?:\s+[A-Z][A-Za-z0-9&'\-]*){0,4})\s+(Ltd|Limited|PLC|Inc|Corp|Corporation|Company|Co\.)\b/g, generic);
  next = next.replace(/["']([A-Z][A-Za-z0-9&'\-]*(?:\s+[A-Z][A-Za-z0-9&'\-]*){1,5})["']/g, generic);
  return next;
}

function postProcessQuestions() {
  if (!Array.isArray(QUESTIONS) || !QUESTIONS.length) return;
  const aims = ['A', 'B', 'C', 'D'];
  aims.forEach((aim) => {
    const shortQs = QUESTIONS
      .filter((q) => q && q.learning_aim === aim && Number(q.marks) <= 4)
      .sort((a, b) => String(a.id || '').localeCompare(String(b.id || ''), undefined, { numeric: true }));
    shortQs.forEach((q, idx) => {
      if (idx % 2 === 1) q.scenario = '';
    });
  });
  QUESTIONS.forEach((q) => {
    if (!q || !q.scenario) return;
    q.scenario = genericiseScenario(q.scenario);
  });
}

function addExpandedQuestionBank() {
  const banks = {
    A: [
      ['Explain why personal data is a valuable target for cyber criminals.', 4, 'A1.2 External threats'],
      ['Describe how ransomware can affect the availability of business services.', 4, 'A1.2 External threats — malware'],
      ['Explain one difference between a Trojan and spyware.', 3, 'A1.2 External threats — malware'],
      ['Analyse how phishing can lead to an account takeover.', 6, 'A1.2 External threats — social engineering'],
      ['State one physical security control for a server room.', 1, 'A4.1 Software and hardware security — physical'],
      ['Explain how tailgating can bypass an otherwise effective access-control system.', 4, 'A4.1 Software and hardware security — physical'],
      ['Describe one way a denial-of-service attack can disrupt an organisation.', 3, 'A1.2 External threats — hacking (DoS/DDoS)'],
      ['State one reason unsupported software increases cyber risk.', 1, 'A2.1 System vulnerabilities'],
      ['Explain how a zero-day vulnerability may be exploited.', 4, 'A2.1 System vulnerabilities'],
      ['Compare brute-force and dictionary attacks.', 4, 'A4.1 Software and hardware security — authentication'],
      ['Evaluate the use of multi-factor authentication against credential theft.', 8, 'A4.1 Software and hardware security — authentication'],
      ['Describe how employee sabotage can be deliberate or accidental.', 3, 'A1.1 Internal threats'],
      ['State one reason why organisations should monitor for internal threats.', 2, 'A1.1 Internal threats'],
      ['State what is meant by social engineering.', 2, 'A1.2 External threats — social engineering'],
      ['Analyse the likely impact of a data breach on customer trust.', 6, 'A1.3 Impact of a credible threat'],
      ['Explain how patch management reduces exploitable weaknesses.', 4, 'A2.1 System vulnerabilities'],
      ['Describe one indicator that a workstation may be infected with malware.', 3, 'A1.2 External threats — malware'],
      ['Evaluate whether staff training alone is sufficient to prevent phishing.', 8, 'A1.2 External threats — social engineering'],
      ['Explain why threat modelling should be completed before deploying a new system.', 4, 'A4.4 Security by design'],
      ['Describe the difference between a virus and a worm.', 4, 'A1.2 External threats — malware'],
      ['Explain how a botnet can be used to launch a distributed denial-of-service attack.', 6, 'A1.2 External threats — hacking (DoS/DDoS)'],
      ['Explain why third-party/cloud providers can increase an organisation\u2019s attack surface.', 2, 'A2.1 System vulnerabilities'],
      ['Analyse the effectiveness of antivirus software against zero-day malware.', 6, 'A1.2 External threats — malware'],
      ['Explain how pretexting differs from phishing.', 4, 'A1.2 External threats — social engineering'],
      ['Describe one way to reduce the risk of a brute-force attack.', 3, 'A4.1 Software and hardware security — authentication'],
      ['Evaluate the importance of a business continuity plan after a cyberattack.', 8, 'A1.3 Impact of a credible threat'],
      ['Explain why small businesses may be targeted by cyber criminals rather than large corporations.', 4, 'A1.2 External threats'],
      ['Describe how a keylogger can compromise credentials.', 3, 'A1.2 External threats — malware'],
      ['Analyse the role of human error in successful cyberattacks.', 6, 'A1.2 External threats — social engineering'],
      ['State one example of a physical security measure to protect data.', 1, 'A4.1 Software and hardware security — physical'],
      ['Explain how a watering-hole attack works.', 4, 'A1.2 External threats — social engineering'],
      ['Evaluate whether encryption alone is sufficient to protect data at rest.', 8, 'A2.1 System vulnerabilities'],
      ['Describe one indicator of a distributed denial-of-service attack.', 3, 'A1.2 External threats — hacking (DoS/DDoS)'],
      ['Explain why attackers use social engineering over technical exploits.', 4, 'A1.2 External threats — social engineering'],
      ['Analyse the impact of a ransomware attack on business operations.', 6, 'A1.2 External threats — malware'],
      ['State one reason why organisations should conduct regular security awareness training.', 2, 'A1.2 External threats — social engineering'],
    ],
    B: [
      ['Explain why network segmentation can limit the spread of an attack.', 4, 'B1.1 Network types'],
      ['Compare a firewall and an intrusion detection system.', 4, 'B2.1 Hardware components'],
      ['Describe one security benefit of using a VPN.', 3, 'B3.4 Network infrastructure services — remote access'],
      ['Analyse the security implications of a BYOD policy.', 6, 'B1.4 Modern trends — BYOD'],
      ['State one purpose of an access control list.', 1, 'B2.1 Hardware components'],
      ['Explain why default passwords should be changed on network devices.', 3, 'B2.1 Hardware components'],
      ['Describe how encryption protects data in transit.', 3, 'A4.2 Encryption'],
      ['Evaluate the use of cloud services for storing sensitive information.', 8, 'B1.4 Modern trends — cloud computing'],
      ['Explain one difference between symmetric and asymmetric encryption.', 4, 'A4.2 Encryption'],
      ['Analyse how insecure wireless configuration could expose an organisation.', 6, 'A4.3 WLAN protection'],
      ['State one advantage of a client-server network.', 1, 'B1.1 Network types'],
      ['Explain how least privilege should be applied to network administration.', 4, 'A4.1 Software and hardware security — access controls'],
      ['Describe one security risk of Internet of Things devices.', 3, 'B1.4 Modern trends — IoT'],
      ['Evaluate whether biometric authentication is always more secure than passwords.', 8, 'A4.1 Software and hardware security — authentication'],
      ['Explain how secure configuration baselines support consistent protection.', 4, 'B2.1 Hardware components'],
      ['Analyse why remote workers need secure access to organisational systems.', 6, 'B3.4 Network infrastructure services — remote access'],
      ['Explain how a proxy server can support network security.', 4, 'B2.1 Hardware components'],
      ['State one reason to separate guest Wi-Fi from internal systems.', 1, 'A4.3 WLAN protection'],
      ['Evaluate the security trade-offs of centralised network management.', 8, 'B1.1 Network types'],
      ['Explain how a network access control system can enforce security policies.', 4, 'B2.1 Hardware components'],
      ['Describe one advantage of using a hardware firewall over a software firewall.', 3, 'B2.1 Hardware components'],
      ['Analyse the security risks of using public Wi-Fi for remote work.', 6, 'B3.4 Network infrastructure services — remote access'],
      ['Explain how encryption keys should be managed securely.', 4, 'A4.2 Encryption'],
      ['State one reason why network monitoring is important for security.', 2, 'B2.1 Hardware components'],
      ['Evaluate the use of a zero-trust network architecture.', 8, 'B1.1 Network types'],
      ['Describe how a virtual private network protects data in transit.', 3, 'B3.4 Network infrastructure services — remote access'],
      ['Explain the difference between authentication and authorisation.', 4, 'A4.1 Software and hardware security — access controls'],
      ['Analyse the security implications of using default credentials on IoT devices.', 6, 'B1.4 Modern trends — IoT'],
      ['State one benefit of network segmentation for incident containment.', 2, 'B1.1 Network types'],
      ['Explain how a proxy server can filter malicious traffic.', 4, 'B2.1 Hardware components'],
      ['Evaluate whether cloud storage is more secure than on-premises storage.', 8, 'B1.4 Modern trends — cloud computing'],
      ['Describe one method of securing a wireless network.', 3, 'A4.3 WLAN protection'],
      ['Explain why regular security audits are important for network security.', 4, 'B2.1 Hardware components'],
      ['Analyse the risks of allowing employees to use personal devices for work.', 6, 'B1.4 Modern trends — BYOD'],
      ['State one reason why encryption is important for data at rest.', 2, 'A4.2 Encryption'],
      ['Evaluate the effectiveness of biometric authentication in a corporate environment.', 8, 'A4.1 Software and hardware security — authentication']
    ],
    C: [
      ['Explain why a cyber security policy should follow a Plan-Do-Check-Act loop.', 4, 'C1.1 Cyber security policy'],
      ['State two rules included in an internet and email use policy.', 2, 'C1.1 Internet and email use'],
      ['Describe what a password policy should specify.', 3, 'C1.1 Security and password procedures'],
      ['Explain the security responsibilities of staff.', 4, 'C1.1 Staff responsibilities'],
      ['Explain how staff IT security training should be delivered.', 4, 'C1.1 Staff training'],
      ['Explain the purpose of a security audit.', 4, 'C1.2 Security audits'],
      ['Describe two factors a backup policy should specify.', 3, 'C1.3 Backup policy'],
      ['Explain why a backup policy must include a testing strategy.', 4, 'C1.3 Backup policy'],
      ['Explain the role of a Data Protection Officer.', 4, 'C1.4 Data protection policy'],
      ['State two contacts listed in an incident response policy.', 2, 'C1.5 Incident response policy'],
      ['Explain the procedures an incident response policy should include.', 4, 'C1.5 Incident response policy'],
      ['Explain the purpose of a disaster recovery policy.', 4, 'C1.6 Disaster recovery policy'],
      ['State the three plans disaster recovery triage may activate.', 2, 'C1.6 Disaster recovery policy'],
      ['Explain what an external services policy should cover for cloud services.', 4, 'C1.7 External services policy'],
      ['Describe how an external services policy applies to software and hardware vendors.', 3, 'C1.7 External services policy']
    ],
    D: [
      ['State two actions to preserve a seized mobile device for forensics.', 2, 'D1.1 Meeting requirements for forensics'],
      ['Explain how an investigator isolates a device to preserve evidence.', 4, 'D1.1 Meeting requirements for forensics'],
      ['Explain the importance of a chain of custody.', 4, 'D1.1 Meeting requirements for forensics'],
      ['Explain two challenges of live forensics.', 4, 'D1.1 Challenges of live forensics'],
      ['Explain the steps required before scanning a network for forensics.', 4, 'D1.1 Network forensics'],
      ['Describe the infrastructure reviewed during network forensics.', 3, 'D1.1 Network forensics'],
      ['Describe how an investigator documents the scene.', 3, 'D1.1 Documenting the scene'],
      ['Explain why a hash is generated for a forensic copy.', 4, 'D2.1 Retaining snapshots'],
      ['State two requirements for recording forensic findings reliably.', 2, 'D2.1 Recording findings'],
      ['Explain why investigators work with copies rather than original data.', 4, 'D2.1 Recording alterations'],
      ['State two forms of visual evidence created during analysis.', 2, 'D2.1 Visual evidence'],
      ['Explain how an investigator avoids false positives.', 4, 'D2.1 False positives'],
      ['State two things an investigator assesses findings for.', 2, 'D2.2 Assessing findings'],
      ['Describe three indicators of compromise.', 3, 'D2.2 Compromise indicators'],
      ['Explain the structure and purpose of a security report.', 4, 'D2.3 Writing security reports'],
      ['State two areas of improvement a security report should recommend.', 2, 'D2.3 Writing security reports']
    ]
  };
  Object.entries(banks).forEach(([aim, items]) => items.forEach(([question, marks, topic], index) => {
    const id = `EXP${aim}${String(index + 1).padStart(3, '0')}`;
    if (QUESTIONS.some(q => q && q.id === id)) return;
    QUESTIONS.push({ id, learning_aim: aim, topic, command_verb: question.split(' ')[0], marks, ao: marks >= 6 ? 'AO3' : marks >= 4 ? 'AO2' : 'AO1', scenario: '', question, guidance: `(${marks})`, type: marks >= 6 ? 'extended' : marks >= 4 ? 'medium' : 'short', mark_scheme: { instruction: 'Award marks for accurate, relevant points supported by appropriate explanation or application.', points: ['Relevant knowledge', 'Clear explanation linked to the question', 'Accurate use of cybersecurity terminology'] } });
  }));
}

function addExpandedQuestionBank2() {
  const banks = {
    A: [
      ['State two categories of external threat.', 2, 'A1.2 External threats'],
      ['Describe the difference between phishing and spear phishing.', 4, 'A1.2 External threats — social engineering'],
      ['Explain why a distributed denial of service (DDoS) attack is harder to block than a single-source DoS attack.', 4, 'A1.2 External threats — hacking (DoS/DDoS)'],
      ['Describe one way an employee can accidentally disclose data or credentials.', 3, 'A1.1 Internal threats'],
      ['Explain the difference between ransomware and a trojan.', 4, 'A1.2 External threats — malware'],
      ['State what a rootkit is.', 2, 'A1.2 External threats — malware'],
      ['Describe how a botnet is used to launch a DDoS attack.', 4, 'A1.2 External threats — malware'],
      ['Explain the difference between spyware and adware.', 4, 'A1.2 External threats — malware'],
      ['Describe what a Trojan horse does.', 3, 'A1.2 External threats — malware'],
      ['Explain why ransomware is a serious threat to businesses.', 4, 'A1.2 External threats — malware'],
      ['State what a logic bomb is.', 2, 'A1.2 External threats — malware'],
      ['Describe the difference between a worm and a Trojan horse.', 4, 'A1.2 External threats — malware'],
      ['State what is meant by social engineering.', 2, 'A1.2 External threats — social engineering'],
      ['Describe the difference between phishing and spear phishing.', 4, 'A1.2 External threats — social engineering'],
      ['Explain how pretexting is used to deceive a victim.', 4, 'A1.2 External threats — social engineering'],
      ['Describe what shoulder surfing is.', 2, 'A1.2 External threats — social engineering'],
      ['Explain why social engineering is often more successful than technical attacks.', 4, 'A1.2 External threats — social engineering'],
      ['State what a DoS attack is.', 2, 'A1.2 External threats — hacking (DoS/DDoS)'],
      ['Describe what DNS poisoning is.', 3, 'A1.2 External threats — hacking (DoS/DDoS)'],
      ['State one physical threat to computer systems.', 2, 'A1.1 Internal threats — accidental/deliberate damage'],
      ['Describe how a natural disaster can affect an organisation IT systems.', 3, 'A1.1 Internal threats — accidental/deliberate damage'],
      ['State why unpatched software is a risk.', 2, 'A2.1 System vulnerabilities — software'],
      ['Explain how default configurations can create vulnerabilities.', 4, 'A2.1 System vulnerabilities — software'],
      ['Describe the risk of open ports on a network.', 3, 'A2.1 System vulnerabilities — network'],
      ['Explain why weak encryption is a network vulnerability.', 3, 'A2.1 System vulnerabilities — network'],
      ['Describe how a lack of training creates a human vulnerability.', 3, 'A2.1 System vulnerabilities — people/process'],
      ['Explain the risk of third-party software in the supply chain.', 4, 'A2.5 Independent third-party review'],
      ['State which UK Act makes unauthorised access to computers illegal.', 2, 'A3.1 Current legislation'],
      ['Describe two requirements of the General Data Protection Regulation (GDPR).', 4, 'A3.1 Current legislation'],
      ['Explain one legal responsibility of an organisation under the Computer Misuse Act 1990.', 3, 'A3.1 Current legislation'],
      ['State one purpose of an Acceptable Use Policy.', 2, 'C1.1 Internal policies'],
      ['Describe what ISO 27001 is.', 3, 'A4.4 Security by design (ISO 27000)'],
      ['Explain one GDPR principle an organisation must follow.', 3, 'A3.1 Current legislation'],
      ['State what CCTV is used for in physical security.', 2, 'A4.1 Software and hardware security — physical'],
      ['Describe the difference between a smart card and a biometric reader.', 3, 'A4.1 Software and hardware security — physical'],
      ['Explain the purpose of off-site backups.', 3, 'A4.1 Software and hardware security — backup/recovery'],
      ['State two factors that can be used in multi-factor authentication.', 2, 'A4.1 Software and hardware security — authentication'],
      ['Describe how a discretionary access control (DAC) model works.', 4, 'A4.1 Software and hardware security — access controls'],
      ['Explain how WPA3 improves on WPA2 for wireless security.', 4, 'A4.3 WLAN protection'],
      ['Describe the difference between encryption and hashing.', 4, 'A4.2 Encryption'],
      ['Explain how a digital certificate supports authentication.', 4, 'A4.2 Encryption'],
      ['State what a trusted platform module (TPM) does.', 2, 'A4.1 Software and hardware security — device-based security'],
      ['Describe how remote wipe protects data on a lost device.', 3, 'A4.1 Software and hardware security — device-based security'],
      ['Explain the principle of defence in depth.', 4, 'A4.4 Security by design'],
      ['Describe what threat modelling is.', 3, 'A4.4 Security by design'],
      ['Explain how a packet-filtering firewall works.', 4, 'A4.1 Software and hardware security — firewalls'],
      ['Describe one advantage of a hardware firewall over a software firewall.', 3, 'A4.1 Software and hardware security — firewalls'],
      ['Explain how antivirus software detects known malware.', 3, 'A4.1 Software and hardware security — antivirus'],
      ['Describe the purpose of quarantine in antivirus software.', 2, 'A4.1 Software and hardware security — antivirus'],
      ['Describe what phishing and spear phishing have in common and how they differ.', 4, 'A1.2 External threats — social engineering'],
      ['Explain why the Computer Misuse Act 1990 is important to the cyber security industry.', 3, 'A3.1 Current legislation'],
      ['Describe what a Time-based One-Time Password (TOTP) is used for in MFA.', 3, 'A4.1 Software and hardware security — authentication'],
      ['Explain how a keylogger can capture passwords and how to protect against it.', 4, 'A1.2 External threats — malware'],
      ['Describe what is meant by a watering-hole attack.', 4, 'A1.2 External threats — social engineering'],
      ['Explain why security information should be protected at rest and in transit.', 3, 'A4.2 Encryption'],
      ['Describe two measures to secure a wireless network.', 3, 'A4.3 WLAN protection'],
      ['Explain what is meant by the principle of least privilege.', 3, 'A4.1 Software and hardware security — access controls'],
      ['Describe what a denial-of-service (DoS) attack is.', 3, 'A1.2 External threats — hacking (DoS/DDoS)'],
      ['Explain how patch management reduces exploitable weaknesses.', 4, 'A2.1 System vulnerabilities — software'],
      ['Explain how shoulder surfing can expose credentials.', 3, 'A1.2 External threats — social engineering'],
      ['Describe the purpose of a firewall in protecting a network.', 3, 'A4.1 Software and hardware security — firewalls'],
      ['Explain why regular security awareness training reduces phishing risk.', 4, 'C1.1 Internal policies'],
      ['Describe what encryption protects against during transmission.', 3, 'A4.2 Encryption'],
      ['State one example of a strong authentication factor.', 2, 'A4.1 Software and hardware security — authentication'],
      ['Explain how a zero-day exploit poses a greater danger than a known vulnerability.', 4, 'A2.1 System vulnerabilities — software'],
      ['Describe how a DDoS attack uses a botnet.', 4, 'A1.2 External threats — hacking (DoS/DDoS)'],
      ['Explain why physical security is part of a defence in depth strategy.', 3, 'A4.1 Software and hardware security — physical'],
      ['Describe what a captive portal is on a guest network.', 3, 'A4.3 WLAN protection'],
      ['State one advantage of a hardware token in MFA.', 2, 'A4.1 Software and hardware security — authentication'],
      ['Explain how a data breach could affect an organisations customers.', 4, 'A1.2 External threats — hacking (DoS/DDoS)'],
      ['Describe what a system hardening baseline involves.', 4, 'A4.4 Security by design'],
      ['Explain why unauthorised access to a database is treated seriously under the Computer Misuse Act 1990.', 3, 'A3.1 Current legislation'],
      ['Describe two ways to protect against shoulder surfing.', 3, 'A1.2 External threats — social engineering'],
      ['State one benefit of using an antivirus with firewall protection.', 2, 'A4.1 Software and hardware security — antivirus'],
      ['Explain how encrypted emails protect confidentiality.', 3, 'A4.2 Encryption'],
      ['Describe what a strong password policy would specify.', 3, 'C1.1 Internal policies'],
      ['Explain why security patches should be applied promptly.', 4, 'A2.1 System vulnerabilities — software'],
      ['Describe two physical controls used at an office entrance.', 3, 'A4.1 Software and hardware security — physical'],
      ['State one risk of reusing the same password across multiple accounts.', 2, 'A2.1 System vulnerabilities — people/process'],
      ['Explain how a firewall uses rules to allow or block traffic.', 4, 'A4.1 Software and hardware security — firewalls']
    ],
    B: [
      ['State what a PAN is.', 2, 'B1.1 Network types'],
      ['Describe the difference between an intranet and an extranet.', 4, 'B1.1 Network types'],
      ['Explain one security advantage of a client/server network.', 3, 'B1.3 Network architecture'],
      ['Describe a hierarchical network topology.', 3, 'B1.2 Network topologies'],
      ['Explain what a wireless mesh network is.', 4, 'B1.2 Network topologies'],
      ['Describe one security benefit of network segmentation.', 4, 'B1.4 Modern trends'],
      ['State what a NAS device is.', 2, 'B2.1 Hardware components — end-user devices'],
      ['Describe the purpose of a switch in a network.', 3, 'B2.1 Hardware components — connectivity devices'],
      ['Explain the difference between a router and a gateway.', 4, 'B2.1 Hardware components — connectivity devices'],
      ['Describe one security risk of using USB drives.', 3, 'B2.2 External media and storage security'],
      ['Explain why removable media should be encrypted.', 3, 'B2.2 External media and storage security'],
      ['State the four layers of the TCP/IP model.', 2, 'B3.1 TCP/IP'],
      ['Describe the purpose of the transport layer in TCP/IP.', 3, 'B3.1 TCP/IP'],
      ['State the default port for DNS.', 1, 'B3.1 TCP/IP — ports'],
      ['State the default port for HTTPS.', 1, 'B3.1 TCP/IP — ports'],
      ['State the default port for SSH.', 1, 'B3.1 TCP/IP — ports'],
      ['Describe the difference between TCP and UDP.', 4, 'B3.1 TCP/IP — ports'],
      ['Explain how NAT helps protect internal IP addresses.', 4, 'B3.1 TCP/IP — NAT and addressing'],
      ['State what RFC 1918 addresses are used for.', 2, 'B3.1 TCP/IP — NAT and addressing'],
      ['Describe how DHCP allocates IP addresses.', 4, 'B3.4 Network infrastructure services — DHCP'],
      ['Describe the purpose of a directory service.', 3, 'B3.4 Network infrastructure services — directory services'],
      ['Explain the role of group policy in network security.', 4, 'B3.4 Network infrastructure services — directory services'],
      ['Describe the difference between static and dynamic routing.', 4, 'B3.4 Network infrastructure services — routing'],
      ['Explain how a VPN provides secure remote access.', 4, 'B3.4 Network infrastructure services — remote access'],
      ['Describe what single sign-on (SSO) is.', 3, 'B3.4 Network infrastructure services — authentication'],
      ['Describe what a network access control (NAC) system does.', 4, 'B2.3 Software components'],
      ['Explain why default passwords should be changed on network devices.', 3, 'B2.1 Hardware components — connectivity devices'],
      ['State two examples of connection media other than copper and fibre.', 2, 'B2.1 Hardware components — connection media'],
      ['Describe one security advantage of using a hardware firewall.', 3, 'B2.1 Hardware components — connectivity devices'],
      ['Explain the purpose of an access control list (ACL) on a router.', 4, 'B3.1 TCP/IP — ports'],
      ['Explain what a proxy server does for network security.', 4, 'B2.1 Hardware components — connectivity devices'],
      ['Explain the difference between symmetric and asymmetric encryption.', 4, 'B3.4 Network infrastructure services — authentication'],
      ['Describe what an extranet is.', 3, 'B1.1 Network types'],
    ],
    C: [
      ['State the four stages of the Plan-Do-Check-Act loop in a cyber security policy.', 2, 'C1.1 Cyber security policy'],
      ['Explain why a cyber security policy follows a Plan-Do-Check-Act approach.', 4, 'C1.1 Cyber security policy'],
      ['State two rules included in an internet and email use policy.', 2, 'C1.1 Internet and email use'],
      ['Describe three measures an organisation’s password policy should specify.', 3, 'C1.1 Security and password procedures'],
      ['Explain the responsibilities staff have in maintaining cyber security.', 4, 'C1.1 Staff responsibilities'],
      ['Explain how staff IT security training should be delivered.', 4, 'C1.1 Staff training'],
      ['Explain the purpose of a security audit.', 4, 'C1.2 Security audits'],
      ['State two factors a backup policy should specify.', 2, 'C1.3 Backup policy'],
      ['Explain why a backup policy must include a testing strategy.', 4, 'C1.3 Backup policy'],
      ['Explain the role of the Data Protection Officer and a data protection policy.', 4, 'C1.4 Data protection policy'],
      ['State two contacts listed in an incident response policy.', 2, 'C1.5 Incident response policy'],
      ['Explain the procedures an incident response policy should include.', 4, 'C1.5 Incident response policy'],
      ['Explain the purpose and content of a disaster recovery policy.', 4, 'C1.6 Disaster recovery policy'],
      ['State the three plans disaster recovery triage may activate.', 2, 'C1.6 Disaster recovery policy'],
      ['Explain what an external services policy should cover for cloud services.', 4, 'C1.7 External services policy'],
      ['Describe how an external services policy applies to software and hardware vendors.', 3, 'C1.7 External services policy']
    ],
    D: [
      ['State two actions to preserve a seized mobile device for forensics.', 2, 'D1.1 Meeting requirements for forensics'],
      ['Explain how an investigator isolates a device suspected of communicating.', 4, 'D1.1 Meeting requirements for forensics'],
      ['Explain the importance of documenting the chain of custody.', 4, 'D1.1 Meeting requirements for forensics'],
      ['Explain two challenges of live forensics.', 4, 'D1.1 Challenges of live forensics'],
      ['Explain the steps required before scanning a network for forensic analysis.', 4, 'D1.1 Network forensics'],
      ['Describe the infrastructure reviewed during network forensics.', 3, 'D1.1 Network forensics'],
      ['Describe how an investigator documents the scene of an incident.', 3, 'D1.1 Documenting the scene'],
      ['Explain why a hash/checksum is generated for a forensic copy.', 4, 'D2.1 Retaining snapshots'],
      ['State two requirements for recording forensic findings reliably.', 2, 'D2.1 Recording findings'],
      ['Explain why investigators work with copies rather than original data.', 4, 'D2.1 Recording alterations'],
      ['State two forms of visual evidence created during analysis.', 2, 'D2.1 Visual evidence'],
      ['Explain how an investigator ensures findings are not false positives.', 4, 'D2.1 False positives'],
      ['State two things an investigator assesses findings for.', 2, 'D2.2 Assessing findings'],
      ['Describe three indicators that a system has been compromised.', 3, 'D2.2 Compromise indicators'],
      ['Explain the structure and purpose of a security report.', 4, 'D2.3 Writing security reports'],
      ['State two areas of improvement a security report should recommend.', 2, 'D2.3 Writing security reports']
    ]
  };
  Object.entries(banks).forEach(([aim, items]) => items.forEach(([question, marks, topic], index) => {
    const id = `EXP2${aim}${String(index + 1).padStart(3, '0')}`;
    if (QUESTIONS.some(q => q && q.id === id)) return;
    QUESTIONS.push({ id, learning_aim: aim, topic, command_verb: question.split(' ')[0], marks, ao: marks >= 6 ? 'AO3' : marks >= 4 ? 'AO2' : 'AO1', scenario: '', question, guidance: `(${marks})`, type: marks >= 6 ? 'extended' : marks >= 4 ? 'medium' : 'short', mark_scheme: { instruction: 'Award marks for accurate, relevant points supported by appropriate explanation or application.', points: ['Relevant knowledge', 'Clear explanation linked to the question', 'Accurate use of cybersecurity terminology'] } });
  }));
}

function dedupeQuizItems(items) {
  const seen = new Set();
  const out = [];
  (items || []).forEach((item) => {
    if (!item || !item.question || !Array.isArray(item.choices) || item.choices.length < 2) return;
    const key = String(item.question).trim().toLowerCase() + '|' + item.choices.map(c => String(c).trim().toLowerCase()).join('|') + '|' + String(item.correct_index);
    if (seen.has(key)) return;
    seen.add(key);
    out.push(item);
  });
  return out;
}

function normaliseMcItemToQuiz(item, idx) {
  if (!item || !Array.isArray(item.options) || !item.options.length || !item.mark_scheme?.answer) return null;
  const choices = item.options.map(o => String(o?.text || '').trim()).filter(Boolean);
  if (choices.length < 2) return null;
  const answerLabel = String(item.mark_scheme.answer || '').trim().toUpperCase();
  const labelIndex = item.options.findIndex(o => String(o?.label || '').trim().toUpperCase() === answerLabel);
  if (labelIndex < 0 || labelIndex >= choices.length) return null;
  return {
    id: 'QMC' + String(idx + 1).padStart(3, '0'),
    learning_aim: item.learning_aim || '',
    topic: item.topic || 'Multiple choice',
    type: 'mcq',
    question: item.question,
    choices,
    correct_index: labelIndex,
    explanation: item.mark_scheme.explanation || ''
  };
}

function makeQuizVariants(baseItems, variantCount, idPrefix) {
  const out = [];
  (baseItems || []).forEach((q, idx) => {
    if (!q || !Array.isArray(q.choices) || q.choices.length < 2) return;
    const baseChoices = q.choices.slice();
    const maxVar = Math.max(0, Number(variantCount || 0));
    for (let v = 1; v <= maxVar; v++) {
      const rot = (idx + v) % baseChoices.length;
      const rotated = baseChoices.slice(rot).concat(baseChoices.slice(0, rot));
      const correctText = baseChoices[q.correct_index];
      const nextCorrect = rotated.findIndex(c => c === correctText);
      if (nextCorrect < 0) continue;
      let prompt = String(q.question || '').trim();
      if (v === 1) prompt = 'Quick check: ' + prompt;
      else if (v === 2) prompt = 'Exam-style MCQ: ' + prompt;
      out.push({
        id: idPrefix + String(idx + 1).padStart(3, '0') + 'V' + v,
        learning_aim: q.learning_aim,
        topic: q.topic,
        type: 'mcq',
        question: prompt,
        choices: rotated,
        correct_index: nextCorrect,
        explanation: q.explanation || ''
      });
    }
  });
  return out;
}

async function loadData() {
  const aims = ["A", "B", "C", "D"];
  try {
    const aimResults = await Promise.all(aims.map(a =>
      fetch(`data/aim_${a}.json`).then(r => {
        if (!r.ok) throw new Error(`aim_${a}.json HTTP ${r.status}`);
        return r.json();
      }).catch(err => {
        console.warn(`Could not load aim_${a}.json:`, err.message);
        return [];
      })
    ));
    QUESTIONS = aimResults.flat();
    addExpandedQuestionBank();
    addExpandedQuestionBank2();

    const [quizRes, flashRes, diagRes, mcRes] = await Promise.all([
      fetch('data/quiz.json').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('data/flashcards.json').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('data/diagrams.json').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('data/mc.json').then(r => r.ok ? r.json() : []).catch(() => [])
    ]);
    if (Array.isArray(diagRes) && diagRes.length) QUESTIONS = QUESTIONS.concat(diagRes);
    if (Array.isArray(mcRes) && mcRes.length) QUESTIONS = QUESTIONS.concat(mcRes);
    postProcessQuestions();
    const baseQuiz = Array.isArray(quizRes) ? quizRes : [];
    const mcQuiz = Array.isArray(mcRes)
      ? mcRes.map((m, idx) => normaliseMcItemToQuiz(m, idx)).filter(Boolean)
      : [];
    const mergedQuiz = dedupeQuizItems(baseQuiz.concat(mcQuiz));
    const quizVariants = makeQuizVariants(mergedQuiz.filter(q => q.type === 'mcq' || q.type === 'multiple_choice'), 2, 'QVARIT');
    QUIZ = dedupeQuizItems(mergedQuiz.concat(quizVariants));
    FLASHCARDS = Array.isArray(flashRes) ? flashRes : [];

    DATA_READY = true;
    console.log(`Loaded ${QUESTIONS.length} questions, ${QUIZ.length} quiz items, ${FLASHCARDS.length} flashcards`);
    DATA_LISTENERS.forEach(cb => cb());
  } catch (err) {
    console.error("Data load failed:", err);
    QUESTIONS = []; QUIZ = []; FLASHCARDS = [];
    DATA_READY = true;
    DATA_LISTENERS.forEach(cb => cb());
  }
}

loadData();
