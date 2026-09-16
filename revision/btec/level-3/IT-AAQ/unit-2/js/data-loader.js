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

// ─────────────────────────────────────────────────────────────────────────────
// Model-answer mark schemes for the auto-generated question banks.
//
// These questions previously shipped with a generic placeholder mark scheme
// ("Relevant knowledge / Clear explanation…"), which gave the AI Examiner
// nothing concrete to grade against and led to inflate full marks. Each entry
// below maps a topic code to real, exam-style answer points so marking is
// accurate. Points are written mini-sentence answers; the loader trims/pads
// them to the question's mark count.
// ─────────────────────────────────────────────────────────────────────────────
const TOPIC_MARK_SCHEMES = {
  // ── A — threats & vulnerabilities ──
  'A1.1 Internal threats': {
    instruction: 'Award marks for each accurate point about internal threats.',
    points: [
      'Internal threats originate from within the organisation — employees, contractors or visitors.',
      'Examples include deliberate employee sabotage, theft or loss of equipment/data, and use of unauthorised software.',
      'Accidental damage (fire, flood, power loss) or accidental deletion of data is an internal threat.',
      'Weak security practices — poor training, weak passwords, no visitor vetting — create internal risk.',
      'Untrusted or poorly-vetted third parties with access to systems are an internal threat.'
    ]
  },
  'A1.1 Internal threats — accidental/deliberate damage': {
    instruction: 'Award marks for accurate points on accidental/deliberate damage as an internal threat.',
    points: [
      'Accidental damage is unintentional, e.g. spilling a drink on a device or dropping a laptop.',
      'Deliberate damage is intentional, e.g. sabotage or vandalism of equipment by a disgruntled employee.',
      'Both can destroy hardware or corrupt data, causing downtime and data loss.',
      'Natural events such as fire or flood can physically damage servers and hardware.',
      'Power loss or power surges can damage equipment and cause data corruption.'
    ]
  },
  'A1.2 External threats': {
    instruction: 'Award marks for each accurate point about external threats.',
    points: [
      'External threats come from outside the organisation, e.g. hackers or criminals.',
      'Categories include malware, hacking (DoS/DDoS), social engineering, sabotage and physical attack.',
      'Personal data is valuable because it can be sold, used for fraud or identity theft.',
      'Small businesses are often targeted because they have weaker defences and less security budget.',
      'External attackers may be motivated by financial gain, espionage, activism or disruption.'
    ]
  },
  'A1.2 External threats — malware': {
    instruction: 'Award marks for each accurate point about malware.',
    points: [
      'A virus attaches to a legitimate file and needs user action (opening the file) to spread.',
      'A worm self-replicates automatically across networks without user interaction.',
      'A Trojan disguises itself as legitimate software to trick users into running it.',
      'Ransomware encrypts files and demands payment to restore access, harming service availability.',
      'Spyware secretly monitors activity and steals credentials or personal data.',
      'A keylogger records every keystroke, capturing usernames, passwords and bank details.',
      'A rootkit hides its presence and gives an attacker persistent, covert control.',
      'A logic bomb is dormant code triggered by a specific condition or date.'
    ]
  },
  'A1.2 External threats — social engineering': {
    instruction: 'Award marks for each accurate point about social engineering.',
    points: [
      'Social engineering manipulates people into revealing information or performing actions.',
      'Phishing is a mass email pretending to be a trusted organisation to steal credentials.',
      'Spear phishing targets a specific individual using personal information to seem genuine.',
      'Pretexting uses a fabricated scenario (e.g. fake IT support) to obtain information.',
      'Shoulder surfing observes someone entering a PIN or password over their shoulder.',
      'A watering-hole attack compromises a website victims are known to visit, then infects visitors.',
      'Human error is a leading cause of successful attacks, so training is essential.',
      'Attackers favour social engineering because exploiting people is often easier than technical flaws.'
    ]
  },
  'A1.2 External threats — hacking (DoS/DDoS)': {
    instruction: 'Award marks for each accurate point about hacking / DoS / DDoS.',
    points: [
      'A denial-of-service (DoS) attack floods a system or service with traffic to make it unavailable.',
      'A distributed (DDoS) attack uses many compromised devices (a botnet) at once, making it harder to block.',
      'A botnet is a network of infected devices controlled remotely by an attacker (command and control).',
      'Symptoms include unusually slow service, timeouts or the service becoming unavailable.',
      'DNS poisoning redirects users to fraudulent sites by corrupting DNS records.',
      'DDoS overwhelms bandwidth or resources so legitimate users cannot access the service.'
    ]
  },
  'A1.3 Impact of a credible threat': {
    instruction: 'Award marks for each accurate point about the impact of a credible threat.',
    points: [
      'A data breach damages customer trust and reputation, leading to lost business.',
      'Financial loss arises from fines (e.g. UK GDPR), compensation and lost revenue.',
      'Ransomware halts operations while systems are encrypted or being recovered.',
      'Downtime reduces productivity and can delay customer-facing services.',
      'A business continuity plan minimises disruption by ensuring recovery procedures exist.',
      'Customers may switch to competitors after a widely publicised breach.'
    ]
  },
  'A2.1 System vulnerabilities': {
    instruction: 'Award marks for each accurate point about system vulnerabilities.',
    points: [
      'A vulnerability is a weakness an attacker can exploit, e.g. unpatched software.',
      'Unsupported/outdated software no longer receives security updates, leaving known flaws open.',
      'A zero-day is a vulnerability unknown to the vendor, so no patch yet exists.',
      'Default/weak settings, open ports and weak encryption are common configuration vulnerabilities.',
      'Patch management closes known flaws before attackers can exploit them.',
      'Third-party/cloud suppliers increase attack surface because their security is outside direct control.',
      'Encryption at rest helps, but alone it does not stop all attacks (e.g. stolen credentials).'
    ]
  },
  'A2.1 System vulnerabilities — software': {
    instruction: 'Award marks for accurate points on software vulnerabilities.',
    points: [
      'Unpatched software retains known security flaws that attackers can exploit.',
      'Default configurations (e.g. default passwords) are widely known and easily exploited.',
      'A zero-day exploit targets a flaw the vendor has not yet patched, so it is especially dangerous.',
      'Applying security patches promptly closes vulnerabilities before they are abused.'
    ]
  },
  'A2.1 System vulnerabilities — network': {
    instruction: 'Award marks for accurate points on network vulnerabilities.',
    points: [
      'Open ports expose services that attackers can probe and exploit.',
      'Weak encryption (e.g. WEP or plaintext) allows traffic to be intercepted.',
      'Insecure protocols transmit data in plaintext that can be captured by attackers.'
    ]
  },
  'A2.1 System vulnerabilities — people/process': {
    instruction: 'Award marks for accurate points on human/process vulnerabilities.',
    points: [
      'Reusing passwords across accounts means one breach exposes many systems.',
      'A lack of training leaves staff unaware of phishing and other threats.',
      'Weak processes, e.g. no access review, allow unauthorised or stale access.'
    ]
  },
  'A2.5 Independent third-party review': {
    instruction: 'Award marks for accurate points on supply-chain/third-party risk.',
    points: [
      'Third-party software can introduce vulnerabilities the organisation does not control.',
      'A compromised supplier can expose all organisations using its software or services.',
      'Independent review assesses whether third-party components meet security standards.'
    ]
  },
  'A3.1 Current legislation': {
    instruction: 'Award marks for accurate points on UK cyber security legislation.',
    points: [
      'The Computer Misuse Act 1990 makes unauthorised access to computer material illegal.',
      'Unauthorised access with intent to commit further offences is a more serious CMA offence.',
      'Unauthorised modification of data (e.g. spreading malware) is an offence under the CMA.',
      'UK GDPR requires organisations to protect personal data and report serious breaches to the ICO within 72 hours.',
      'Fines for serious GDPR breaches can reach £17.5 million or 4% of annual turnover.'
    ]
  },
  'A4.1 Software and hardware security — physical': {
    instruction: 'Award marks for each accurate point about physical security.',
    points: [
      'Server rooms should use locked doors, PIN pads or swipe cards to restrict access.',
      'CCTV monitors and deters unauthorised entry and theft.',
      'Off-site backups protect data if a site is physically damaged or inaccessible.',
      'Tailgating is following an authorised person through a secured door without credentials.',
      'Biometric readers (fingerprint, iris) or smart cards control who enters secure areas.'
    ]
  },
  'A4.1 Software and hardware security — authentication': {
    instruction: 'Award marks for each accurate point about authentication.',
    points: [
      'Multi-factor authentication requires two or more factors: something you know, have or are.',
      'MFA significantly reduces the risk from stolen passwords — a second factor is still needed.',
      'Biometrics (fingerprint, face, iris) are hard to steal but can be inconvenient or rejected.',
      'A brute-force attack tries many password combinations; account lockout and rate limiting reduce it.',
      'A dictionary attack tries common words/passwords rather than all combinations.',
      'A TOTP (time-based one-time password) changes every 30–60 seconds, adding a dynamic second factor.',
      'Strong passwords should be long, unique and not reused across accounts.',
      'Something you know = password/PIN; something you have = token/phone; something you are = biometric.'
    ]
  },
  'A4.1 Software and hardware security — access controls': {
    instruction: 'Award marks for each accurate point about access controls.',
    points: [
      'Least privilege means users get only the minimum access needed for their job.',
      'Authentication verifies who the user is; authorisation decides what they may access.',
      'Network administrators should have separate, privileged accounts used only for admin tasks.',
      'Discretionary access control (DAC) lets the owner decide who can access each resource.',
      'Role-based access control (RBAC) assigns permissions to roles, then assigns users to roles.'
    ]
  },
  'A4.1 Software and hardware security — firewalls': {
    instruction: 'Award marks for each accurate point about firewalls.',
    points: [
      'A firewall filters incoming and outgoing traffic using predefined rules.',
      'A packet-filtering firewall inspects packet headers (source, destination, ports).',
      'A hardware firewall is a dedicated device protecting the whole network, independent of hosts.',
      'An antivirus with firewall protection combines malware scanning with traffic filtering.',
      'A firewall can block malicious traffic or unauthorised connection attempts.',
      'Rules are matched in order to allow or deny traffic based on source, destination and port.'
    ]
  },
  'A4.1 Software and hardware security — antivirus': {
    instruction: 'Award marks for each accurate point about antivirus software.',
    points: [
      'Antivirus detects known malware by matching files against a signature database.',
      'Detected malware is quarantined (isolated) or deleted so it cannot spread.',
      'Real-time protection monitors activity continuously, not just on scheduled scans.',
      'Regular signature updates allow detection of new malware; zero-day evasion is a known limitation.',
      'Anti-phishing and web protection block malicious downloads and dangerous websites.'
    ]
  },
  'A4.1 Software and hardware security — backup/recovery': {
    instruction: 'Award marks for each accurate point about backup and recovery.',
    points: [
      'Backups create copies of data so it can be restored after loss or an attack.',
      'Off-site or cloud backups protect against physical damage such as fire or flood.',
      'The 3-2-1 rule: three copies, two media, one off-site.',
      'Backups must be tested so restoration is known to work when needed.'
    ]
  },
  'A4.1 Software and hardware security — device-based security': {
    instruction: 'Award marks for each accurate point about device-level security.',
    points: [
      'A trusted platform module (TPM) is a hardware chip that stores encryption keys securely.',
      'Remote wipe deletes data on a lost or stolen device over a network.',
      'Full-disk encryption (e.g. BitLocker) protects data on lost devices from being read.'
    ]
  },
  'A4.2 Encryption': {
    instruction: 'Award marks for each accurate point about encryption.',
    points: [
      'Encryption converts plaintext into ciphertext using an algorithm and a key.',
      'Data in transit (e.g. HTTPS/TLS) is encrypted so it cannot be read if intercepted.',
      'Data at rest (e.g. full-disk encryption) protects stored data on lost/stolen devices.',
      'Symmetric encryption uses one shared key; asymmetric uses a public/private key pair.',
      'Encryption keys must be stored securely (e.g. hardware module, key vault) and rotated.',
      'A digital certificate binds a public key to an identity, verifying a server is genuine.',
      'Hashing is one-way (produces a fixed digest) and is used to verify integrity, not encrypt.'
    ]
  },
  'A4.3 WLAN protection': {
    instruction: 'Award marks for each accurate point about wireless network security.',
    points: [
      'Use WPA2/WPA3 (not WEP) to encrypt wireless traffic.',
      'WPA3 improves key handling and protects against offline password guessing.',
      'Change default admin and Wi-Fi passwords on access points.',
      'Separate guest Wi-Fi from internal systems to limit exposure.',
      'Disable WPS and SSID features that are not needed; use strong pre-shared keys.'
    ]
  },
  'A4.4 Security by design': {
    instruction: 'Award marks for each accurate point about security by design.',
    points: [
      'Threat modelling identifies potential threats before a system is built/deployed.',
      'Defence in depth layers multiple controls so one failure does not break security.',
      'ISO 27001 provides a framework for an information security management system.',
      'A system-hardening baseline applies consistent secure configuration to all systems.',
      'Building security in early is cheaper than retrofitting it after a breach.'
    ]
  },
  'A4.4 Security by design (ISO 27000)': {
    instruction: 'Award marks for accurate points on ISO 27001.',
    points: [
      'ISO 27001 is an international standard for information security management systems.',
      'It uses a Plan-Do-Check-Act continual-improvement cycle.',
      'Certification demonstrates security is managed systematically and independently audited.'
    ]
  },
  // ── B — networks ──
  'B1.1 Network types': {
    instruction: 'Award marks for each accurate point about network types/architecture.',
    points: [
      'A PAN connects personal devices over a very short range (e.g. Bluetooth).',
      'A LAN connects devices in one building/site and is usually privately owned.',
      'An intranet is a private internal network; an extranet extends it to trusted partners.',
      'Segmentation divides a network so an attack in one segment cannot spread to others.',
      'A client-server network centralises resources; one advantage is easier central admin/backup.',
      'A zero-trust architecture verifies every request and assumes no implicit trust.',
      'Centralised management is simpler to control but the central point is a target/single point of failure.'
    ]
  },
  'B1.1 Network types — PAN': { instruction: 'Award marks for accurate points on PAN.', points: ['A PAN covers a very short range, typically under 10 metres.', 'Examples: Bluetooth headset, smartwatch or phone tethering.'] },
  'B1.2 Network topologies': {
    instruction: 'Award marks for accurate points on network topologies.',
    points: [
      'Star: devices connect to a central switch; one failure does not affect others.',
      'Mesh: devices interconnect with multiple paths, so it is resilient but complex.',
      'A hierarchical topology uses core, distribution and access layers for scalability.'
    ]
  },
  'B1.3 Network architecture': {
    instruction: 'Award marks for accurate points on client-server architecture.',
    points: [
      'A client-server network centralises resources on servers, easing admin and backups.',
      'Centralised security policies can be enforced consistently across clients.'
    ]
  },
  'B1.4 Modern trends': {
    instruction: 'Award marks for accurate points on modern network trends.',
    points: [
      'Network segmentation limits how far an attack or malware can spread.',
      'Segmentation aids incident containment by isolating affected systems.'
    ]
  },
  'B1.4 Modern trends — BYOD': {
    instruction: 'Award marks for accurate points on BYOD.',
    points: [
      'BYOD lets employees use personal devices, increasing convenience and productivity.',
      'Risk: personal devices may be less secure or unpatched, increasing malware risk.',
      'Risk: separating personal and corporate data is harder, risking data leakage.',
      'Mitigation: mobile device management (MDM), encryption and remote wipe policies.'
    ]
  },
  'B1.4 Modern trends — IoT': {
    instruction: 'Award marks for accurate points on IoT security.',
    points: [
      'IoT devices often ship with weak or default credentials.',
      'Many IoT devices receive few or no security updates, leaving vulnerabilities open.',
      'A compromised IoT device can be used in botnets to launch DDoS attacks.',
      'Change default credentials and segment IoT devices from core systems.'
    ]
  },
  'B1.4 Modern trends — cloud computing': {
    instruction: 'Award marks for accurate points on cloud security.',
    points: [
      'Cloud storage offers scalability and expert-maintained security, but data sits with a third party.',
      'The shared responsibility model: the provider secures the cloud, the customer secures what is in it.',
      'Risks include misconfiguration, data breaches, account hijacking and loss of visibility.',
      'Sensitive data may be restricted by regulation (data sovereignty) and should be encrypted.',
      'Cloud may be more or less secure than on-premises depending on configuration and expertise.'
    ]
  },
  'B2.1 Hardware components': {
    instruction: 'Award marks for each accurate point about network hardware.',
    points: [
      'A firewall filters traffic; an intrusion detection system monitors and alerts on suspicious activity.',
      'Default passwords should be changed because they are publicly known and easily guessed.',
      'An access control list (ACL) on a router specifies which traffic may pass.',
      'A proxy server sits between clients and the internet, filtering traffic and hiding internal addresses.',
      'A hardware firewall is a dedicated device protecting the whole network independent of hosts.',
      'Secure configuration baselines ensure all devices share consistent hardened settings.',
      'Regular security audits verify controls remain effective and compliant.'
    ]
  },
  'B2.1 Hardware components — end-user devices': {
    instruction: 'Award marks for accurate points on end-user/storage devices.',
    points: ['A NAS (network-attached storage) device provides shared file storage on a network.', 'NAS devices can enforce access control and centralise backups.']
  },
  'B2.1 Hardware components — connectivity devices': {
    instruction: 'Award marks for accurate points on connectivity devices.',
    points: [
      'A switch connects devices within a LAN and forwards frames to the correct port.',
      'A router forwards packets between networks using IP addresses.',
      'A gateway connects networks that use different protocols.',
      'A proxy server filters traffic and can cache content to improve performance.',
      'A hardware firewall is a dedicated device inspecting all network traffic.',
      'Connection media other than copper/fibre include wireless (radio) and infrared.'
    ]
  },
  'B2.1 Hardware components — connection media': {
    instruction: 'Award marks for accurate points on connection media.',
    points: [
      'Copper (e.g. twisted pair / Ethernet) and fibre are common wired media.',
      'Wireless (radio) and infrared are connection media other than copper and fibre.'
    ]
  },
  'B2.2 External media and storage security': {
    instruction: 'Award marks for accurate points on removable media.',
    points: [
      'USB drives can introduce malware when plugged into organisational computers.',
      'Removable media can be used to copy or steal sensitive data.',
      'Encrypting removable media prevents data being read if a device is lost or stolen.'
    ]
  },
  'B2.3 Software components': {
    instruction: 'Award marks for accurate points on network software.',
    points: [
      'A network access control (NAC) system checks devices before allowing them on the network.',
      'NAC can enforce policy, e.g. require antivirus and patches before access is granted.'
    ]
  },
  'B3.1 TCP/IP': {
    instruction: 'Award marks for accurate points about TCP/IP.',
    points: [
      'The four layers are Application, Transport, Internet and Network Access.',
      'TCP provides reliable, ordered delivery; UDP is faster but unreliable (no guaranteed delivery).',
      'The transport layer breaks data into segments and manages delivery.',
      'Common ports: DNS 53, HTTPS 443, SSH 22.'
    ]
  },
  'B3.1 TCP/IP — ports': {
    instruction: 'Award marks for accurate points about TCP/IP ports.',
    points: [
      'DNS uses port 53; HTTPS uses 443; SSH uses 22.',
      'TCP is connection-oriented and reliable; UDP is connectionless and faster.',
      'An ACL on a router can filter traffic by port to enforce policy.'
    ]
  },
  'B3.1 TCP/IP — NAT and addressing': {
    instruction: 'Award marks for accurate points about NAT and addressing.',
    points: [
      'NAT translates private internal addresses to a single public address.',
      'NAT hides internal IP addresses from the public internet, adding a layer of protection.',
      'RFC 1918 defines private address ranges used inside networks (e.g. 192.168.x.x, 10.x.x.x).'
    ]
  },
  'B3.4 Network infrastructure services — DHCP': {
    instruction: 'Award marks for accurate points about DHCP.',
    points: [
      'DHCP automatically assigns IP addresses to devices on the network.',
      'The DORA process: Discover, Offer, Request, Acknowledge.',
      'DHCP reduces configuration errors and address conflicts compared to manual assignment.'
    ]
  },
  'B3.4 Network infrastructure services — directory services': {
    instruction: 'Award marks for accurate points about directory services.',
    points: [
      'A directory service (e.g. Active Directory) centrally stores users, groups and resources.',
      'Group policy applies consistent security settings across all managed devices.',
      'Central authentication and authorisation simplify account admin and remove leavers promptly.'
    ]
  },
  'B3.4 Network infrastructure services — routing': {
    instruction: 'Award marks for accurate points about routing.',
    points: [
      'Static routing uses manually configured paths; dynamic routing learns paths automatically.',
      'Dynamic routing adapts to network changes but uses more overhead than static routing.'
    ]
  },
  'B3.4 Network infrastructure services — remote access': {
    instruction: 'Award marks for accurate points about remote access.',
    points: [
      'A VPN creates an encrypted tunnel over the internet for secure remote access.',
      'Remote workers need secure access to reach corporate systems as if on-site.',
      'Public Wi-Fi is unencrypted; a VPN protects data in transit on untrusted networks.',
      'Single sign-on (SSO) lets users authenticate once to access multiple systems.'
    ]
  },
  'B3.4 Network infrastructure services — authentication': {
    instruction: 'Award marks for accurate points about authentication services.',
    points: [
      'Symmetric encryption uses one shared key; asymmetric uses a public/private key pair.',
      'Single sign-on (SSO) lets a user authenticate once for multiple applications.',
      'Asymmetric encryption solves the key-distribution problem of symmetric encryption.'
    ]
  },
  // ── C — policies ──
  'C1.1 Cyber security policy': {
    instruction: 'Award marks for accurate points about cyber security policy.',
    points: [
      'Plan-Do-Check-Act is a continual-improvement cycle for policy.',
      'Plan: identify risks and objectives; Do: implement controls; Check: monitor/audit; Act: correct and improve.',
      'A policy should be reviewed and updated as threats change.'
    ]
  },
  'C1.1 Internet and email use': {
    instruction: 'Award marks for accurate points on acceptable internet/email use.',
    points: [
      'Rules on acceptable use, e.g. no accessing inappropriate websites.',
      'Rules on email, e.g. not opening unexpected attachments or links.',
      'Consequences for breach and a requirement to report suspicious activity.'
    ]
  },
  'C1.1 Security and password procedures': {
    instruction: 'Award marks for accurate points on password policy.',
    points: [
      'Passwords should be long, unique and changed regularly.',
      'Multi-factor authentication should be required for sensitive systems.',
      'Passwords must not be shared or written down; account lockout prevents guessing.'
    ]
  },
  'C1.1 Staff responsibilities': {
    instruction: 'Award marks for accurate points on staff security responsibilities.',
    points: [
      'Staff should follow security policies and report security incidents promptly.',
      'Staff should handle data carefully and avoid unsafe practices (e.g. unapproved software).',
      'Completing security training and using strong authentication are staff responsibilities.'
    ]
  },
  'C1.1 Staff training': {
    instruction: 'Award marks for accurate points on staff security training.',
    points: [
      'Training should be delivered regularly and on induction, not once only.',
      'It should cover phishing recognition, password hygiene and incident reporting.',
      'Refresher training and testing (e.g. simulated phishing) reinforce good behaviour.'
    ]
  },
  'C1.2 Security audits': {
    instruction: 'Award marks for accurate points on security audits.',
    points: [
      'A security audit systematically reviews controls against policy and standards.',
      'It identifies weaknesses and non-compliance so they can be remediated.',
      'Regular audits demonstrate due diligence and continuous improvement.'
    ]
  },
  'C1.3 Backup policy': {
    instruction: 'Award marks for accurate points on backup policy.',
    points: [
      'A backup policy specifies what data is backed up and how often.',
      'It should define storage (onsite/offsite/cloud) and retention periods.',
      'It must include a testing strategy so restores are known to work.',
      'Full, differential and incremental are common backup types.'
    ]
  },
  'C1.4 Data protection policy': {
    instruction: 'Award marks for accurate points on data protection.',
    points: [
      'The Data Protection Officer (DPO) oversees compliance with data protection law.',
      'The policy sets rules for collecting, storing and processing personal data lawfully.',
      'It ensures only necessary data is collected and handled securely.'
    ]
  },
  'C1.5 Incident response policy': {
    instruction: 'Award marks for accurate points on incident response.',
    points: [
      'The policy lists contacts to notify during an incident (e.g. team lead, DPO, IT).',
      'It defines procedures: detection, triage, containment, mitigation and recovery.',
      'Clear roles and a communication plan reduce response time and chaos.'
    ]
  },
  'C1.6 Disaster recovery policy': {
    instruction: 'Award marks for accurate points on disaster recovery.',
    points: [
      'The policy explains how to recover from major disruption to systems and data.',
      'Triage may activate three plans: business continuity, incident response and disaster recovery.',
      'It sets recovery time objectives and prioritises critical systems.'
    ]
  },
  'C1.7 External services policy': {
    instruction: 'Award marks for accurate points on external services policy.',
    points: [
      'For cloud services, the policy covers how data is stored, secured and transferred.',
      'For vendors, it covers vetting, access and security responsibilities in contracts.',
      'It sets out supplier security requirements and how compliance is verified.'
    ]
  },
  // ── D — forensics ──
  'D1.1 Meeting requirements for forensics': {
    instruction: 'Award marks for accurate points on forensic evidence preservation.',
    points: [
      'Preserve a seized mobile device in its current power state and isolate it from the network.',
      'Use a Faraday bag or airplane mode and disable wireless to prevent remote wipe.',
      'A chain of custody records who handled evidence and when, ensuring it is admissible.',
      'Investigators work on copies, not originals, to avoid altering evidence.',
      'Document the scene with photographs, notes and witness statements.'
    ]
  },
  'D1.1 Challenges of live forensics': {
    instruction: 'Award marks for accurate points on live forensics challenges.',
    points: [
      'Live forensics analyses a running system, where data changes constantly.',
      'Running processes and volatile memory can be lost if the system is switched off.',
      'Writing to the system during analysis must be avoided to preserve evidence.'
    ]
  },
  'D1.1 Network forensics': {
    instruction: 'Award marks for accurate points on network forensics.',
    points: [
      'Before scanning, agree methodology, obtain permission and ensure the network is not disrupted.',
      'Review infrastructure: firewalls, switches, routers, wireless access points and logs.',
      'Use passive then active analysis to avoid corrupting the live system.'
    ]
  },
  'D1.1 Documenting the scene': {
    instruction: 'Award marks for accurate points on documenting the scene.',
    points: [
      'Photograph the scene and devices before anything is moved or changed.',
      'Record written notes, plans/diagrams and witness statements.',
      'Documenting the scene preserves context and supports the chain of custody.'
    ]
  },
  'D2.1 Retaining snapshots': {
    instruction: 'Award marks for accurate points on retaining forensic snapshots.',
    points: [
      'A hash (e.g. SHA-256) of the copy verifies it is identical to the original.',
      'Retain whole-disk, file, memory and deleted/temp data snapshots.',
      'Hashing proves the evidence has not been altered after acquisition.'
    ]
  },
  'D2.1 Recording findings': {
    instruction: 'Award marks for accurate points on recording findings.',
    points: [
      'Recording must be accurate, complete and attributable to a competent person.',
      'Keep a trail of all actions taken so findings can be verified and reproduced.'
    ]
  },
  'D2.1 Recording alterations': {
    instruction: 'Award marks for accurate points on avoiding evidence alteration.',
    points: [
      'Work on forensic copies, not the original, so original evidence is preserved.',
      'Any action that changes data must be avoided and documented if unavoidable.'
    ]
  },
  'D2.1 Visual evidence': {
    instruction: 'Award marks for accurate points on visual evidence.',
    points: [
      'Screenshots and photographs of running systems and analyst output.',
      'Timelines and diagrams illustrating how an incident unfolded.'
    ]
  },
  'D2.1 False positives': {
    instruction: 'Award marks for accurate points on avoiding false positives.',
    points: [
      'Correlate multiple sources of evidence before concluding a system is compromised.',
      'Use a consistent, verified methodology so findings are reliable and repeatable.',
      'Confirm indicators with independent tools to rule out benign activity.'
    ]
  },
  'D2.2 Assessing findings': {
    instruction: 'Award marks for accurate points on assessing forensic findings.',
    points: [
      'Assess findings for reliability, relevance and whether they support a conclusion.',
      'Assess for errors, detection delays and the impact of the incident.'
    ]
  },
  'D2.2 Compromise indicators': {
    instruction: 'Award marks for accurate points on indicators of compromise.',
    points: [
      'Unusual inbound/outbound traffic or traffic to unexpected regions.',
      'Unusual logins (times, locations) or unusual DNS requests.',
      'Increased file reads or suspicious file changes and port usage.'
    ]
  },
  'D2.3 Writing security reports': {
    instruction: 'Award marks for accurate points on security reports.',
    points: [
      'A report has title, contents, introduction, findings, conclusions and citations.',
      'It analyses errors, detection delays and remedial actions.',
      'It recommends improvements to policies and protection measures.'
    ]
  }
};

// Pick the closest topic key for a generated question, favouring the longest
// (most specific) matching key, otherwise falling back to a safe default.
function markSchemeForTopic(topic, marks) {
  const raw = String(topic || '').trim();
  let best = null;
  Object.keys(TOPIC_MARK_SCHEMES).forEach((key) => {
    if (raw === key || raw.indexOf(key) >= 0 || key.indexOf(raw) >= 0) {
      if (!best || key.length > best.length) best = key;
    }
  });
  const src = best ? TOPIC_MARK_SCHEMES[best] : null;

  if (!src) {
    return {
      instruction: 'Award marks for accurate, relevant points using correct terminology.',
      points: acceptablePoints(null, marks)
    };
  }

  // Return the source points trimmed/padded to the question's mark count.
  const pts = acceptablePoints(src.points, marks);
  return { instruction: src.instruction, points: pts };
}

// Trim the model-answer list to roughly `marks` points; pad with generic
// prompts only if the bank is shorter than the question's marks.
function acceptablePoints(points, marks) {
  const src = (Array.isArray(points) ? points : []).slice();
  const want = Math.max(1, Math.min(Number(marks) || 1, 8));
  if (src.length === 0) {
    return ['Accurate, relevant knowledge', 'Clear explanation linked to the question', 'Correct use of cybersecurity terminology'].slice(0, want);
  }
  // Use as many concrete points as marks allow (up to available).
  return src.slice(0, want);
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
    QUESTIONS.push({ id, learning_aim: aim, topic, command_verb: question.split(' ')[0], marks, ao: marks >= 6 ? 'AO3' : marks >= 4 ? 'AO2' : 'AO1', scenario: '', question, guidance: `(${marks})`, type: marks >= 6 ? 'extended' : marks >= 4 ? 'medium' : 'short', mark_scheme: markSchemeForTopic(topic, marks) });
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
    QUESTIONS.push({ id, learning_aim: aim, topic, command_verb: question.split(' ')[0], marks, ao: marks >= 6 ? 'AO3' : marks >= 4 ? 'AO2' : 'AO1', scenario: '', question, guidance: `(${marks})`, type: marks >= 6 ? 'extended' : marks >= 4 ? 'medium' : 'short', mark_scheme: markSchemeForTopic(topic, marks) });
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
