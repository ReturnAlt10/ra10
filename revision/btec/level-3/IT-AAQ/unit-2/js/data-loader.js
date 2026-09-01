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
      ['Explain why threat actors target personal data.', 4, 'A1 Threat actors and motivation'],
      ['Describe how ransomware can affect the availability of business services.', 4, 'A2 Malware and impact'],
      ['Explain one difference between a Trojan and spyware.', 3, 'A2 Malware types'],
      ['Analyse how phishing can lead to an account takeover.', 6, 'A3 Social engineering'],
      ['State one physical security control for a server room.', 1, 'A4 Physical security'],
      ['Explain how tailgating can bypass an otherwise effective access-control system.', 4, 'A4 Physical security'],
      ['Describe one way a denial-of-service attack can disrupt an organisation.', 3, 'A5 Network attacks'],
      ['Analyse why SQL injection is a risk to a web application.', 6, 'A5 Application attacks'],
      ['State one reason unsupported software increases cyber risk.', 1, 'A6 Vulnerabilities'],
      ['Explain how a zero-day vulnerability may be exploited.', 4, 'A6 Vulnerabilities'],
      ['Compare brute-force and dictionary attacks.', 4, 'A7 Password attacks'],
      ['Evaluate the use of multi-factor authentication against credential theft.', 8, 'A7 Authentication'],
      ['Describe how insider threats can be intentional or accidental.', 3, 'A8 Insider threats'],
      ['Explain why supply-chain partners can increase an organisation’s attack surface.', 4, 'A8 Supply-chain risk'],
      ['State what is meant by social engineering.', 2, 'A3 Social engineering'],
      ['Analyse the likely impact of a data breach on customer trust.', 6, 'A9 Breaches and impact'],
      ['Explain how patch management reduces exploitable weaknesses.', 4, 'A6 Vulnerabilities'],
      ['Describe one indicator that a workstation may be infected with malware.', 3, 'A2 Malware and impact'],
      ['Evaluate whether staff training alone is sufficient to prevent phishing.', 8, 'A3 Social engineering'],
      ['Explain why threat modelling should be completed before deploying a new system.', 4, 'A10 Threat modelling'],
      ['Describe the difference between a virus and a worm.', 4, 'A2 Malware types'],
      ['Explain how a botnet can be used to launch a distributed denial-of-service attack.', 6, 'A5 Network attacks'],
      ['State one reason why organisations should monitor for insider threats.', 2, 'A8 Insider threats'],
      ['Analyse the effectiveness of antivirus software against zero-day malware.', 6, 'A2 Malware and impact'],
      ['Explain how pretexting differs from phishing.', 4, 'A3 Social engineering'],
      ['Describe one way to reduce the risk of a brute-force attack.', 3, 'A7 Password attacks'],
      ['Evaluate the importance of a business continuity plan after a cyberattack.', 8, 'A9 Breaches and impact'],
      ['Explain why threat actors may target small businesses rather than large corporations.', 4, 'A1 Threat actors and motivation'],
      ['Describe how a keylogger can compromise credentials.', 3, 'A2 Malware types'],
      ['Analyse the role of human error in successful cyberattacks.', 6, 'A3 Social engineering'],
      ['State one example of a physical security measure to protect data.', 1, 'A4 Physical security'],
      ['Explain how a watering-hole attack works.', 4, 'A3 Social engineering'],
      ['Evaluate whether encryption alone is sufficient to protect data at rest.', 8, 'A6 Vulnerabilities'],
      ['Describe one indicator of a distributed denial-of-service attack.', 3, 'A5 Network attacks'],
      ['Explain why threat actors use social engineering over technical exploits.', 4, 'A3 Social engineering'],
      ['Analyse the impact of a ransomware attack on business operations.', 6, 'A2 Malware and impact'],
      ['State one reason why organisations should conduct regular security awareness training.', 2, 'A3 Social engineering'],
      ['Explain how a man-in-the-middle attack can intercept data.', 4, 'A5 Network attacks']
    ],
    B: [
      ['Explain why network segmentation can limit the spread of an attack.', 4, 'B1 Network design'],
      ['Compare a firewall and an intrusion detection system.', 4, 'B2 Network protection'],
      ['Describe one security benefit of using a VPN.', 3, 'B3 Secure connectivity'],
      ['Analyse the security implications of a BYOD policy.', 6, 'B4 BYOD'],
      ['State one purpose of an access control list.', 1, 'B2 Network protection'],
      ['Explain why default passwords should be changed on network devices.', 3, 'B5 Device security'],
      ['Describe how encryption protects data in transit.', 3, 'B6 Cryptography'],
      ['Evaluate the use of cloud services for storing sensitive information.', 8, 'B7 Cloud security'],
      ['Explain one difference between symmetric and asymmetric encryption.', 4, 'B6 Cryptography'],
      ['Analyse how insecure wireless configuration could expose an organisation.', 6, 'B8 Wireless security'],
      ['State one advantage of a client-server network.', 1, 'B1 Network design'],
      ['Explain how least privilege should be applied to network administration.', 4, 'B9 Access control'],
      ['Describe one security risk of Internet of Things devices.', 3, 'B10 IoT security'],
      ['Evaluate whether biometric authentication is always more secure than passwords.', 8, 'B9 Authentication'],
      ['Explain how secure configuration baselines support consistent protection.', 4, 'B5 Device security'],
      ['Analyse why remote workers need secure access to organisational systems.', 6, 'B3 Secure connectivity'],
      ['Describe the purpose of a demilitarised zone.', 3, 'B2 Network protection'],
      ['Explain how a proxy server can support network security.', 4, 'B2 Network protection'],
      ['State one reason to separate guest Wi-Fi from internal systems.', 1, 'B8 Wireless security'],
      ['Evaluate the security trade-offs of centralised network management.', 8, 'B1 Network design'],
      ['Explain how a network access control system can enforce security policies.', 4, 'B2 Network protection'],
      ['Describe one advantage of using a hardware firewall over a software firewall.', 3, 'B2 Network protection'],
      ['Analyse the security risks of using public Wi-Fi for remote work.', 6, 'B3 Secure connectivity'],
      ['Explain how encryption keys should be managed securely.', 4, 'B6 Cryptography'],
      ['State one reason why network monitoring is important for security.', 2, 'B2 Network protection'],
      ['Evaluate the use of a zero-trust network architecture.', 8, 'B1 Network design'],
      ['Describe how a virtual private network protects data in transit.', 3, 'B3 Secure connectivity'],
      ['Explain the difference between authentication and authorisation.', 4, 'B9 Access control'],
      ['Analyse the security implications of using default credentials on IoT devices.', 6, 'B10 IoT security'],
      ['State one benefit of network segmentation for incident containment.', 2, 'B1 Network design'],
      ['Explain how a proxy server can filter malicious traffic.', 4, 'B2 Network protection'],
      ['Evaluate whether cloud storage is more secure than on-premises storage.', 8, 'B7 Cloud security'],
      ['Describe one method of securing a wireless network.', 3, 'B8 Wireless security'],
      ['Explain why regular security audits are important for network security.', 4, 'B5 Device security'],
      ['Analyse the risks of allowing employees to use personal devices for work.', 6, 'B4 BYOD'],
      ['State one reason why encryption is important for data at rest.', 2, 'B6 Cryptography'],
      ['Explain how a demilitarised zone improves network security.', 4, 'B2 Network protection'],
      ['Evaluate the effectiveness of biometric authentication in a corporate environment.', 8, 'B9 Authentication']
    ],
    C: [
      ['Explain why incident response plans should define roles and responsibilities.', 4, 'C1 Incident response planning'],
      ['Describe the purpose of the preparation phase of incident response.', 3, 'C1 Incident response planning'],
      ['Analyse why evidence must be preserved during a cyber incident.', 6, 'C2 Evidence and forensics'],
      ['State one action taken during incident containment.', 1, 'C3 Containment'],
      ['Explain the difference between short-term and long-term containment.', 4, 'C3 Containment'],
      ['Describe how eradication removes the cause of an incident.', 3, 'C4 Eradication'],
      ['Evaluate the importance of testing backups after a ransomware incident.', 8, 'C5 Recovery'],
      ['Explain why lessons learned should be recorded after an incident.', 4, 'C6 Review and improvement'],
      ['Analyse how poor communication can increase the impact of an incident.', 6, 'C7 Incident communication'],
      ['State one stakeholder who may need to be informed about a serious breach.', 1, 'C7 Incident communication'],
      ['Describe the purpose of an incident severity classification.', 3, 'C1 Incident response planning'],
      ['Explain how a timeline helps investigators understand an attack.', 4, 'C2 Evidence and forensics'],
      ['Evaluate whether an organisation should pay a ransomware demand.', 8, 'C5 Recovery'],
      ['Analyse why recovery should be prioritised according to business impact.', 6, 'C5 Recovery'],
      ['Describe one method of collecting volatile evidence.', 3, 'C2 Evidence and forensics'],
      ['Explain why incident response teams should conduct regular drills.', 4, 'C1 Incident response planning'],
      ['Describe the purpose of a post-incident review.', 3, 'C6 Review and improvement'],
      ['Analyse the challenges of investigating a cyber incident across multiple jurisdictions.', 6, 'C2 Evidence and forensics'],
      ['State one reason why backups should be stored offline.', 2, 'C5 Recovery'],
      ['Explain how a security incident can be classified by severity.', 4, 'C1 Incident response planning'],
      ['Evaluate the importance of a communication plan during a cyber incident.', 8, 'C7 Incident communication'],
      ['Describe one method of preserving digital evidence.', 3, 'C2 Evidence and forensics'],
      ['Explain why containment should be prioritised over eradication.', 4, 'C3 Containment'],
      ['Analyse the risks of disconnecting a compromised system from the network.', 6, 'C3 Containment'],
      ['State one stakeholder who should be informed about a data breach.', 2, 'C7 Incident communication'],
      ['Explain how lessons learned can improve future incident response.', 4, 'C6 Review and improvement'],
      ['Evaluate the use of a tabletop exercise in incident response planning.', 8, 'C1 Incident response planning'],
      ['Describe one challenge of recovering from a ransomware attack.', 3, 'C5 Recovery'],
      ['Explain why evidence chain of custody is important.', 4, 'C2 Evidence and forensics'],
      ['Analyse the impact of a delayed incident response.', 6, 'C1 Incident response planning'],
      ['State one reason why incident response plans should be reviewed regularly.', 2, 'C6 Review and improvement'],
      ['Explain how a security operations centre supports incident response.', 4, 'C1 Incident response planning'],
      ['Evaluate the role of external experts in incident response.', 8, 'C1 Incident response planning']
    ],
    D: [
      ['Explain the purpose of vulnerability scanning.', 3, 'D1 Vulnerability assessment'],
      ['Compare black-box and white-box penetration testing.', 4, 'D2 Penetration testing'],
      ['Analyse the risks of ignoring a high-severity vulnerability.', 6, 'D1 Vulnerability assessment'],
      ['State what OWASP provides for web application security.', 1, 'D3 Application security'],
      ['Explain one limitation of automated security testing.', 4, 'D4 Security testing'],
      ['Describe the difference between a false positive and a false negative.', 4, 'D1 Vulnerability assessment'],
      ['Evaluate the use of penetration testing in a small organisation.', 8, 'D2 Penetration testing'],
      ['Explain how code review can identify security defects.', 4, 'D3 Application security'],
      ['Analyse why testing should be repeated after a system change.', 6, 'D4 Security testing'],
      ['State one benefit of a security audit.', 1, 'D5 Security audit'],
      ['Describe how risk can be prioritised after a vulnerability scan.', 3, 'D1 Vulnerability assessment'],
      ['Explain the difference between SAST and DAST.', 4, 'D3 Application security'],
      ['Evaluate whether compliance with a standard guarantees security.', 8, 'D5 Security audit'],
      ['Analyse why remediation should be verified after a vulnerability is fixed.', 6, 'D4 Security testing'],
      ['Explain how a vulnerability scanner identifies weaknesses.', 4, 'D1 Vulnerability assessment'],
      ['Describe one limitation of vulnerability scanning.', 3, 'D1 Vulnerability assessment'],
      ['Analyse the importance of prioritising vulnerabilities by risk.', 6, 'D1 Vulnerability assessment'],
      ['State one benefit of regular penetration testing.', 2, 'D2 Penetration testing'],
      ['Explain the difference between a vulnerability assessment and a penetration test.', 4, 'D2 Penetration testing'],
      ['Evaluate the use of automated tools in security testing.', 8, 'D4 Security testing'],
      ['Describe how a security audit can identify compliance gaps.', 3, 'D5 Security audit'],
      ['Explain why security testing should be part of the software development lifecycle.', 4, 'D3 Application security'],
      ['Analyse the risks of not conducting regular security testing.', 6, 'D4 Security testing'],
      ['State one example of a security testing tool.', 2, 'D4 Security testing'],
      ['Explain how a red team exercise can test an organisation’s defences.', 4, 'D2 Penetration testing'],
      ['Evaluate the importance of a risk assessment in security management.', 8, 'D1 Vulnerability assessment'],
      ['Describe one method of verifying that a vulnerability has been fixed.', 3, 'D4 Security testing'],
      ['Explain why security testing should be repeated after system changes.', 4, 'D4 Security testing'],
      ['Analyse the role of security testing in meeting regulatory requirements.', 6, 'D5 Security audit'],
      ['State one reason why organisations should conduct security audits.', 2, 'D5 Security audit'],
      ['Explain how a security audit can improve overall security posture.', 4, 'D5 Security audit'],
      ['Evaluate the trade-offs of conducting security testing in-house versus outsourcing.', 8, 'D4 Security testing']
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
      ['State two motivations of a hacktivist.', 2, 'A1.1 Threat actors'],
      ['Describe the difference between a script kiddie and a cyber criminal.', 4, 'A1.1 Threat actors'],
      ['Explain why state-sponsored actors are often involved in advanced persistent threats.', 4, 'A1.1 Threat actors'],
      ['Describe one way an insider threat can cause harm to an organisation.', 3, 'A1.1 Threat actors'],
      ['Explain the difference between a hacktivist and a cyber criminal.', 4, 'A1.1 Threat actors'],
      ['State what a rootkit is.', 2, 'A1.2 Malware types'],
      ['Describe how a botnet is used to launch a DDoS attack.', 4, 'A1.2 Malware types'],
      ['Explain the difference between spyware and adware.', 4, 'A1.2 Malware types'],
      ['Describe what a Trojan horse does.', 3, 'A1.2 Malware types'],
      ['Explain why ransomware is a serious threat to businesses.', 4, 'A1.2 Malware types'],
      ['State what a logic bomb is.', 2, 'A1.2 Malware types'],
      ['Describe the difference between a worm and a Trojan horse.', 4, 'A1.2 Malware types'],
      ['State what is meant by social engineering.', 2, 'A1.3 Social engineering'],
      ['Describe the difference between phishing and spear phishing.', 4, 'A1.3 Social engineering'],
      ['Explain how pretexting is used to deceive a victim.', 4, 'A1.3 Social engineering'],
      ['Describe what shoulder surfing is.', 2, 'A1.3 Social engineering'],
      ['Explain why social engineering is often more successful than technical attacks.', 4, 'A1.3 Social engineering'],
      ['State what a DoS attack is.', 2, 'A1.4 Network attacks'],
      ['Describe how ARP spoofing works.', 4, 'A1.4 Network attacks'],
      ['Explain how session hijacking can allow an attacker to take over a user session.', 4, 'A1.4 Network attacks'],
      ['Describe what DNS poisoning is.', 3, 'A1.4 Network attacks'],
      ['State what SQL injection targets.', 2, 'A1.5 Web application attacks'],
      ['Explain how XSS can steal data from a web user.', 4, 'A1.5 Web application attacks'],
      ['Describe what CSRF is.', 3, 'A1.5 Web application attacks'],
      ['State one physical threat to computer systems.', 2, 'A1.6 Physical threats'],
      ['Describe how a natural disaster can affect an organisation IT systems.', 3, 'A1.6 Physical threats'],
      ['State why unpatched software is a risk.', 2, 'A2.1 Software vulnerabilities'],
      ['Explain how default configurations can create vulnerabilities.', 4, 'A2.1 Software vulnerabilities'],
      ['Describe the risk of open ports on a network.', 3, 'A2.2 Network vulnerabilities'],
      ['Explain why weak encryption is a network vulnerability.', 3, 'A2.2 Network vulnerabilities'],
      ['Describe how a lack of training creates a human vulnerability.', 3, 'A2.3 Human vulnerabilities'],
      ['Explain the risk of third-party software in the supply chain.', 4, 'A2.4 Supply chain risks'],
      ['State which UK Act makes unauthorised access to computers illegal.', 2, 'A3.1 UK Legislation'],
      ['Describe the purpose of the Data Protection Act 2018.', 4, 'A3.1 UK Legislation'],
      ['Explain what is meant by responsible disclosure.', 3, 'A3.2 Ethical responsibilities'],
      ['State one purpose of an Acceptable Use Policy.', 2, 'A3.3 Organisational policies'],
      ['Describe what ISO 27001 is.', 3, 'A3.4 Compliance and standards'],
      ['Explain the purpose of the Regulation of Investigatory Powers Act 2000 (RIPA).', 3, 'A3.1 UK Legislation'],
      ['State what CCTV is used for in physical security.', 2, 'A4.1 Physical security'],
      ['Describe the difference between a smart card and a biometric reader.', 3, 'A4.1 Physical security'],
      ['Explain the purpose of off-site backups.', 3, 'A4.2 Data protection'],
      ['State two factors that can be used in multi-factor authentication.', 2, 'A4.5 Authentication'],
      ['Describe how a discretionary access control (DAC) model works.', 4, 'A4.6 Access control'],
      ['Explain how WPA3 improves on WPA2 for wireless security.', 4, 'A4.7 Wireless security'],
      ['Describe the difference between encryption and hashing.', 4, 'A4.8 Encryption'],
      ['Explain how a digital certificate supports authentication.', 4, 'A4.8 Encryption'],
      ['State what a trusted platform module (TPM) does.', 2, 'A4.9 Device security'],
      ['Describe how remote wipe protects data on a lost device.', 3, 'A4.9 Device security'],
      ['Explain the principle of defence in depth.', 4, 'A4.10 Security by design'],
      ['Describe what threat modelling is.', 3, 'A4.10 Security by design'],
      ['Explain how a packet-filtering firewall works.', 4, 'A4.4 Firewalls'],
      ['Describe one advantage of a hardware firewall over a software firewall.', 3, 'A4.4 Firewalls'],
      ['Explain how antivirus software detects known malware.', 3, 'A4.3 Antivirus/anti-malware'],
      ['Describe the purpose of quarantine in antivirus software.', 2, 'A4.3 Antivirus/anti-malware'],
      ['Describe what phishing and spear phishing have in common and how they differ.', 4, 'A1.3 Social engineering'],
      ['Explain why the Computer Misuse Act 1990 is important to the cyber security industry.', 3, 'A3.1 UK Legislation'],
      ['Describe what a Time-based One-Time Password (TOTP) is used for in MFA.', 3, 'A4.5 Authentication'],
      ['Explain how a keylogger can capture passwords and how to protect against it.', 4, 'A1.2 Malware types'],
      ['Describe what is meant by a watering-hole attack.', 4, 'A1.3 Social engineering'],
      ['Explain why security information should be protected at rest and in transit.', 3, 'A4.8 Encryption'],
      ['Describe two measures to secure a wireless network.', 3, 'A4.7 Wireless security'],
      ['Explain what is meant by the principle of least privilege.', 3, 'A4.6 Access control'],
      ['Describe what a denial-of-service (DoS) attack is.', 3, 'A1.4 Network attacks'],
      ['Explain how patch management reduces exploitable weaknesses.', 4, 'A2.1 Software vulnerabilities'],
      ['Explain how shoulder surfing can expose credentials.', 3, 'A1.3 Social engineering'],
      ['Describe the purpose of a firewall in protecting a network.', 3, 'A4.4 Firewalls'],
      ['Explain why regular security awareness training reduces phishing risk.', 4, 'A3.3 Organisational policies'],
      ['Describe what encryption protects against during transmission.', 3, 'A4.8 Encryption'],
      ['State one example of a strong authentication factor.', 2, 'A4.5 Authentication'],
      ['Explain how a zero-day exploit poses a greater danger than a known vulnerability.', 4, 'A2.1 Software vulnerabilities'],
      ['Describe how a DDoS attack uses a botnet.', 4, 'A1.4 Network attacks'],
      ['Explain why physical security is part of a defence in depth strategy.', 3, 'A4.1 Physical security'],
      ['Describe what a captive portal is on a guest network.', 3, 'A4.7 Wireless security'],
      ['State one advantage of a hardware token in MFA.', 2, 'A4.5 Authentication'],
      ['Explain how a data breach could affect an organisations customers.', 4, 'A1.4 Network attacks'],
      ['Describe what a system hardening baseline involves.', 4, 'A4.10 Security by design'],
      ['Explain why unauthorised access to a database is treated seriously under the Computer Misuse Act 1990.', 3, 'A3.1 UK Legislation'],
      ['Describe two ways to protect against shoulder surfing.', 3, 'A1.3 Social engineering'],
      ['State one benefit of using an antivirus with firewall protection.', 2, 'A4.3 Antivirus/anti-malware'],
      ['Explain how encrypted emails protect confidentiality.', 3, 'A4.8 Encryption'],
      ['Describe what a strong password policy would specify.', 3, 'A3.3 Organisational policies'],
      ['Explain why security patches should be applied promptly.', 4, 'A2.1 Software vulnerabilities'],
      ['Describe two physical controls used at an office entrance.', 3, 'A4.1 Physical security'],
      ['State one risk of reusing the same password across multiple accounts.', 2, 'A2.3 Human vulnerabilities'],
      ['Explain how a firewall uses rules to allow or block traffic.', 4, 'A4.4 Firewalls']
    ],
    B: [
      ['State what a PAN is.', 2, 'B1.1 Network types'],
      ['Describe the difference between an intranet and an extranet.', 4, 'B1.1 Network types'],
      ['Explain one security advantage of a client/server network.', 3, 'B1.3 Network architecture'],
      ['Describe a hierarchical network topology.', 3, 'B1.2 Network topologies'],
      ['Explain what a wireless mesh network is.', 4, 'B1.2 Network topologies'],
      ['Describe one security benefit of network segmentation.', 4, 'B1.4 Modern trends'],
      ['State what a NAS device is.', 2, 'B2.1 End-user devices'],
      ['Describe the purpose of a switch in a network.', 3, 'B2.2 Connectivity devices'],
      ['Explain the difference between a router and a gateway.', 4, 'B2.2 Connectivity devices'],
      ['Describe one security risk of using USB drives.', 3, 'B2.4 External media security'],
      ['Explain why removable media should be encrypted.', 3, 'B2.4 External media security'],
      ['State the four layers of the TCP/IP model.', 2, 'B3.1 TCP/IP model'],
      ['Describe the purpose of the transport layer in TCP/IP.', 3, 'B3.1 TCP/IP model'],
      ['State the default port for DNS.', 1, 'B3.2 Ports and protocols'],
      ['State the default port for HTTPS.', 1, 'B3.2 Ports and protocols'],
      ['State the default port for SSH.', 1, 'B3.2 Ports and protocols'],
      ['Describe the difference between TCP and UDP.', 4, 'B3.2 Ports and protocols'],
      ['Explain how NAT helps protect internal IP addresses.', 4, 'B3.3 IP addressing'],
      ['State what RFC 1918 addresses are used for.', 2, 'B3.3 IP addressing'],
      ['Describe how DHCP allocates IP addresses.', 4, 'B3.5 DHCP'],
      ['Explain how DNSSEC increases the security of DNS.', 4, 'B3.4 DNS'],
      ['Describe the purpose of a directory service.', 3, 'B3.7 Directory services'],
      ['Explain the role of group policy in network security.', 4, 'B3.7 Directory services'],
      ['Describe the difference between static and dynamic routing.', 4, 'B3.8 Routing'],
      ['Explain how a VPN provides secure remote access.', 4, 'B3.9 VPN'],
      ['Describe what single sign-on (SSO) is.', 3, 'B3.6 Auth services'],
      ['Explain the difference between RADIUS and TACACS+.', 4, 'B3.6 Auth services'],
      ['Describe what a network access control (NAC) system does.', 4, 'B2.5 Software components'],
      ['Explain why default passwords should be changed on network devices.', 3, 'B2.2 Connectivity devices'],
      ['State two examples of connection media other than copper and fibre.', 2, 'B2.3 Connection media'],
      ['Describe one security advantage of using a hardware firewall.', 3, 'B2.2 Connectivity devices'],
      ['Explain the purpose of an access control list (ACL) on a router.', 4, 'B3.2 Ports and protocols'],
      ['Describe what a demilitarised zone (DMZ) provides for network security.', 4, 'B1.4 Modern trends'],
      ['Explain what a proxy server does for network security.', 4, 'B2.2 Connectivity devices'],
      ['Explain the difference between symmetric and asymmetric encryption.', 4, 'B3.6 Auth services'],
      ['Describe what an extranet is.', 3, 'B1.1 Network types'],
      ['Explain the purpose of IPsec in a VPN.', 4, 'B3.9 VPN']
    ],
    C: [
      ['State the four phases of the NIST incident response lifecycle.', 2, 'C1.1 Incident Response Lifecycle'],
      ['Describe the purpose of the preparation phase.', 3, 'C1.1 Incident Response Lifecycle'],
      ['Explain why detection and analysis is important in incident response.', 4, 'C1.1 Incident Response Lifecycle'],
      ['Describe how an incident is classified by severity.', 3, 'C1.2 Incident classification'],
      ['Explain the purpose of containment in incident response.', 4, 'C1.3 Containment'],
      ['Describe the difference between short-term and long-term containment.', 4, 'C1.3 Containment'],
      ['Explain why eradication is needed after containment.', 3, 'C1.4 Eradication and recovery'],
      ['Describe the purpose of recovery in incident response.', 3, 'C1.4 Eradication and recovery'],
      ['State who should be notified in a major data breach.', 2, 'C1.5 Communication plans'],
      ['Explain the purpose of a business continuity plan (BCP).', 4, 'C1.7 Business continuity'],
      ['Describe what a Recovery Time Objective (RTO) measures.', 3, 'C1.7 Business continuity'],
      ['Explain the difference between a hot site and a cold site.', 4, 'C1.7 Business continuity'],
      ['State two forensic principles for preserving evidence.', 2, 'C2.1 Forensic principles'],
      ['Describe what a chain of custody is.', 3, 'C2.1 Forensic principles'],
      ['Explain why volatile evidence must be collected first.', 4, 'C2.2 Evidence types'],
      ['Describe what disk imaging is used for in forensics.', 3, 'C2.3 Forensic acquisition'],
      ['Explain how hashing verifies evidence integrity.', 3, 'C2.3 Forensic acquisition'],
      ['Describe one technique for analysing digital evidence.', 3, 'C2.4 Analysis techniques'],
      ['Explain why a write blocker is used during forensic analysis.', 3, 'C2.3 Forensic acquisition'],
      ['Describe what memory analysis reveals in a forensics investigation.', 3, 'C2.4 Analysis techniques'],
      ['Explain how evidence is made admissible in court.', 4, 'C2.6 Legal admissibility'],
      ['Describe the purpose of an incident response plan.', 3, 'C1.1 Incident Response Lifecycle'],
      ['Explain why incidents should be documented accurately.', 4, 'C1.6 Documentation'],
      ['Describe what a post-incident review is for.', 3, 'C1.1 Incident Response Lifecycle'],
      ['State what RPO (Recovery Point Objective) measures.', 2, 'C1.7 Business continuity'],
      ['Explain how backups support recovery from a ransomware incident.', 4, 'C1.7 Business continuity'],
      ['Describe what forensic duplication does.', 3, 'C2.3 Forensic acquisition'],
      ['Explain why media should be preserved from alteration.', 3, 'C2.1 Forensic principles'],
      ['Describe what timeline analysis is in a forensic investigation.', 3, 'C2.4 Analysis techniques'],
      ['State one legal consideration when gathering evidence.', 2, 'C2.6 Legal admissibility'],
      ['Explain the role of an incident response team during an incident.', 4, 'C1.1 Incident Response Lifecycle'],
      ['Describe the purpose of incident logging during response.', 3, 'C1.6 Documentation']
    ],
    D: [
      ['State what a vulnerability scanner does.', 2, 'D1.1 Vulnerability assessment'],
      ['Describe the difference between a vulnerability assessment and a penetration test.', 4, 'D1.2 Pen testing'],
      ['Explain what a false positive is in scanning.', 3, 'D1.1 Vulnerability assessment'],
      ['Describe what CVSS scoring is used for.', 3, 'D1.1 Vulnerability assessment'],
      ['Explain the difference between black-box and white-box testing.', 4, 'D1.2 Pen testing'],
      ['State one phase of a penetration test.', 2, 'D1.2 Penetration testing'],
      ['Describe what OSSTMM is.', 3, 'D1.3 Testing methodologies'],
      ['Explain what social engineering testing involves.', 4, 'D1.4 Social engineering testing'],
      ['Describe the difference between SAST and DAST.', 4, 'D1.5 Code review'],
      ['Explain why code review identifies security defects.', 3, 'D1.5 Code review'],
      ['State what an IDS does.', 2, 'D2.1 IDS/IPS'],
      ['Describe the difference between an IDS and an IPS.', 4, 'D2.1 IDS/IPS'],
      ['Explain what a HIDS monitors.', 3, 'D2.1 IDS/IPS'],
      ['Describe the purpose of a SIEM.', 4, 'D2.2 SIEM'],
      ['State one type of log used in log management.', 2, 'D2.3 Log management'],
      ['Explain why log retention is important.', 3, 'D2.3 Log management'],
      ['Describe what packet capture reveals about a network.', 3, 'D2.4 Network monitoring'],
      ['Explain what NetFlow is used for.', 3, 'D2.4 Network monitoring'],
      ['Describe the vulnerability management lifecycle.', 4, 'D2.5 Vulnerability management'],
      ['State what Mean Time to Detect (MTTD) measures.', 2, 'D2.6 Security metrics'],
      ['Describe how a configuration audit supports security.', 3, 'D2.7 Auditing and compliance'],
      ['Explain why penetration testing is performed by authorised, ethical testers.', 3, 'D1.2 Pen testing'],
      ['Describe what grey-box testing is.', 3, 'D1.2 Pen testing'],
      ['Explain the purpose of a security policy baseline.', 3, 'D2.7 Auditing and compliance'],
      ['State what a vulnerability database (CVE) is used for.', 2, 'D1.1 Vulnerability assessment'],
      ['Describe how patch management supports the vulnerability management lifecycle.', 4, 'D2.5 Vulnerability management'],
      ['Explain why scanning should be repeated after a system change.', 4, 'D1.1 Vulnerability assessment'],
      ['Describe what a Sysinternals toolset is used for in system security testing.', 3, 'D1.5 Code review'],
      ['State what Mean Time to Respond (MTTR) measures.', 2, 'D2.6 Security metrics'],
      ['Explain how automated tools can reduce the risk of human error in security testing.', 4, 'D2.5 Vulnerability management'],
      ['Describe what a HIPS provides on an endpoint.', 3, 'D2.1 IDS/IPS'],
      ['Explain what network-based intrusion detection (NIDS) monitors.', 4, 'D2.1 IDS/IPS'],
      ['Describe the role of a security analyst in a SOC.', 3, 'D2.2 SIEM']
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
