/* BTEC Computing (AAQ) Unit 2 — RA10 practice papers.
   Same layout as the Pearson sample: 2 hours 15 minutes, 90 marks; one organisation followed through four questions
   (22, 23, 22, 23 marks), each ending with a 9-mark evaluation/discussion. Mark schemes are RA10’s own. */
(function () {
  'use strict';
  function Q(n, ctx, parts) {
    return parts.map((p, i) => ({ q: n, sub: p[0], marks: p[1], section: 'Q' + n, ctx: i === 0 ? ctx : (p[4] || []), text: p[2], ms: { body: p[3], levels: null } }));
  }
  const L = (...lines) => lines.join('\n');
  const IND = (...lines) => L('Indicative content – credit other valid points. Strong answers apply the evaluation to the organisation (security, cost, performance, usability, scalability, compatibility, risks, benefits) and reach a judgement:', ...lines.map(x => '• ' + x), 'Award marks using the 9-mark levels (best fit).');
  function paper(n, title, blurb, qs) {
    const items = [].concat(...qs);
    return { id: 'CP2-R' + String(n).padStart(2, '0'), unit: 2, key: 'R' + String(n).padStart(2, '0'), source: 'ra10', spec: 'ra10', kind: 'exam', code: 'RA10',
      series: 'RA10 Paper ' + n, date: 'RA10 practice paper ' + n, title, blurb, minutes: 135, items, total: items.reduce((s, x) => s + x.marks, 0) };
  }
  const papers = [];

  /* ---------- Paper 1: GP surgery ---------- */
  papers.push(paper(1, 'Elmwood Medical Practice – patient data, Wi-Fi, ransomware, hashing', 'A GP surgery with sensitive records, a guest Wi-Fi, remote doctors and an online booking site.', [
    Q(1, ['Elmwood Medical Practice is a GP surgery with 14 staff. Jordan is the IT manager. Patient records are stored on a server in the practice and backed up nightly.'], [
      ['a(i)', 4, 'Jordan uses symmetric encryption for the patient database. Describe two differences between symmetric and asymmetric encryption.', L('Two marks for each difference (one per side):', '• symmetric uses one shared key (1); asymmetric uses a public/private key pair (1)', '• symmetric is faster for large amounts of data (1); asymmetric is slower/used for small data and key exchange (1)', '• symmetric has a key-distribution problem (1); asymmetric public keys can be shared openly (1)')],
      ['a(ii)', 2, 'Explain why AES-256 is a suitable choice for the patient database.', L('Up to two marks:', '• 256-bit key gives 2²⁵⁶ possible keys (1)', '• brute force is infeasible so sensitive data stays confidential / meets GDPR expectations (1)')],
      ['a(iii)', 2, 'Explain why the encryption key must not be stored on the same server as the database.', L('Up to two marks:', '• if an attacker gains access to the server they would get both the data and the key (1)', '• so the encryption would give no protection (1)')],
      ['b(i)', 1, 'Give one protocol that should be used for doctors to access email securely from outside the practice.', L('Award one mark for:', '• IMAPS / IMAP over TLS / POP3S / HTTPS (webmail) / SMTP with STARTTLS')],
      ['b(ii)', 2, 'Describe the role of DNS when a doctor visits the NHS website.', L('Up to two marks:', '• the browser asks a DNS server for the IP address of the domain name (1)', '• the DNS server returns the IP address so the browser can connect (1)')],
      ['b(iii)', 2, 'Explain the effect of DNS poisoning on the practice.', L('Up to two marks:', '• staff could be redirected to a fake website (1)', '• where they enter login details/download malware (1)')],
      ['c', 9, 'The practice is concerned about ransomware. Evaluate the measures Jordan could use to protect the practice from ransomware and recover if an attack succeeds.', IND('Prevention: staff phishing training, email filtering, anti-malware, patching, least privilege, disable macros', 'Segmentation so malware cannot spread; application allow-listing', 'Backups: 3-2-1 rule, offline/immutable copies, test restores – RAID is not enough', 'Incident response and disaster recovery plans; report to ICO under GDPR', 'Cost and usability for a small practice; availability of records is critical for patient care', 'Judgement – layered defence with tested offline backups most important')]
    ]),
    Q(2, ['The practice offers free Wi-Fi to patients in the waiting room. Staff also use Wi-Fi on tablets.'], [
      ['a(i)', 2, 'Explain one security-related advantage of providing a separate guest Wi-Fi network for patients.', L('Up to two marks:', '• patients’ devices are kept off the staff network (1) so they cannot access patient records/servers (1)')],
      ['a(ii)', 2, 'Explain one security-related disadvantage of offering free Wi-Fi.', L('Up to two marks:', '• it could be misused for illegal activity traced to the practice (1)', '• or used as an entry point if poorly separated / attackers set up a fake hotspot (1)')],
      ['a(iii)', 2, 'Give two security settings that should be configured on the wireless access point.', L('One mark each, up to two:', '• WPA3/WPA2 encryption (1)', '• change default admin password (1)', '• disable WPS (1)', '• separate SSID/VLAN for guests (1)', '• update firmware (1)')],
      ['b(i)', 3, 'Describe how an attacker could carry out a man-in-the-middle attack using a fake hotspot.', L('One mark each, up to three:', '• set up an access point with the same/similar name (evil twin) (1)', '• users connect and their traffic passes through the attacker (1)', '• the attacker reads or alters unencrypted data / captures logins (1)')],
      ['b(ii)', 2, 'Explain one way staff can protect themselves when using public Wi-Fi away from the practice.', L('Up to two marks:', '• use a VPN (1) so traffic is encrypted in a tunnel (1)', '• only use HTTPS sites (1) data encrypted with TLS (1)')],
      ['b(iii)', 3, 'Describe how MAC address filtering works and one limitation.', L('Up to three marks:', '• the WAP has a list of allowed MAC addresses (1)', '• only devices on the list can connect (1)', '• limitation: MAC addresses can be spoofed / hard to manage (1)')],
      ['c', 9, 'Doctors want to use their own smartphones to view appointment lists. Evaluate the use of a Bring Your Own Device (BYOD) policy at the practice.', IND('Benefits: convenience, lower hardware cost, staff familiarity', 'Risks: lost/stolen phones, personal apps/malware, mixing personal and patient data, GDPR', 'Controls: MDM, enforced passcodes/biometrics, encryption, containerisation, remote wipe, VPN', 'Usability and staff acceptance; compatibility of devices', 'Cost of MDM and support', 'Judgement – acceptable only with strict MDM and limited data access, otherwise provide work devices')]
    ]),
    Q(3, ['The practice network is a star topology with a switch, router/firewall and the server in a locked cupboard.'], [
      ['a(i)', 2, 'State two pieces of information Jordan should record in a network audit.', L('One mark each, up to two:', '• list of devices and IP/MAC addresses (1)', '• software versions/patch levels (1)', '• user accounts and permissions (1)', '• open ports/services (1)')],
      ['a(ii)', 2, 'Explain one disadvantage of the star topology for the practice.', L('Up to two marks:', '• the central switch is a single point of failure (1)', '• if it fails or is attacked no one can access patient records (1)')],
      ['b(i)', 2, 'Explain the purpose of logging and auditing on the server.', L('Up to two marks:', '• records who accessed which records and when (1)', '• so suspicious activity/insider misuse can be detected and investigated (1)')],
      ['b(ii)', 3, 'Describe how a firewall protects the practice network.', L('One mark each, up to three:', '• inspects incoming and outgoing traffic (1)', '• compares it with rules (ports, IP addresses, protocols) (1)', '• blocks traffic that is not allowed (1)')],
      ['c', 4, 'Explain two reasons why patch management is important for the practice.', L('Two marks each:', '• patches fix known vulnerabilities (1) so attackers cannot exploit them e.g. ransomware (1)', '• keeps software compatible/supported (1) reducing crashes that affect availability (1)')],
      ['d', 9, 'Evaluate the importance of staff training as part of the practice’s security.', IND('Most attacks start with phishing/social engineering', 'Training on recognising phishing, strong passwords, reporting incidents, privacy/GDPR', 'Reduces insider (careless) threats', 'Low cost compared with technical controls but needs repeating', 'Cannot stop zero-days or technical attacks alone', 'Judgement – essential layer alongside technical controls')]
    ]),
    Q(4, ['The practice has an online booking website. Jordan is training a new apprentice.'], [
      ['a(i)', 2, 'Describe what TLS does for the booking website.', L('Up to two marks:', '• encrypts data between the browser and server (1)', '• authenticates the server with a digital certificate (1)')],
      ['a(ii)', 2, 'Describe the role of a Certificate Authority.', L('Up to two marks:', '• verifies the identity of the website owner (1)', '• issues/signs a digital certificate that browsers trust (1)')],
      ['a(iii)', 2, 'Explain what a user would see if the certificate had expired.', L('Up to two marks:', '• the browser shows a security warning / not secure message (1)', '• so users may not trust the site / data might be intercepted (1)')],
      ['b(i)', 2, 'Explain why patient passwords should be stored as hashes rather than encrypted.', L('Up to two marks:', '• hashes are one-way so passwords cannot be recovered even if the database is stolen (1)', '• the system compares the hash of the entered password with the stored hash (1)')],
      ['b(ii)', 3, 'Describe how salting improves password hashing.', L('One mark each, up to three:', '• a random salt is added to each password before hashing (1)', '• identical passwords produce different hashes (1)', '• rainbow table/precomputed attacks are ineffective (1)')],
      ['c(i)', 3, 'Explain why MD5 should not be used to hash patient passwords.', L('Up to three marks:', '• MD5 has known collisions (1)', '• it is very fast so brute force is easy (1)', '• use SHA-256/bcrypt/Argon2 instead (1)')],
      ['c(ii)', 9, 'Evaluate the security of the booking website and recommend improvements.', IND('TLS/HTTPS with valid certificate; HSTS', 'Input validation and parameterised queries to prevent SQL injection', 'Strong password hashing with salt; MFA for staff', 'Patching, firewall/WAF, DDoS protection for availability', 'GDPR: minimal data, consent, logging', 'Judgement with prioritised recommendations')]
    ])
  ]));

  /* ---------- Paper 2: Online retailer ---------- */
  papers.push(paper(2, 'Northline Outdoor – e-commerce, DDoS, SQL injection, digital signatures', 'An online outdoor clothing retailer with a warehouse, cloud servers and remote customer service staff.', [
    Q(1, ['Northline Outdoor sells clothing online. Aisha is the security lead. Customer orders are processed on cloud servers.'], [
      ['a(i)', 4, 'Describe two differences between encryption and hashing.', L('Two marks for each difference:', '• encryption is two-way (1); hashing is one-way (1)', '• encryption needs a key to reverse (1); hashing has no key / cannot be reversed (1)', '• encryption output varies in length (1); a hash is a fixed-length digest (1)')],
      ['a(ii)', 2, 'Explain why customer card details should not be stored by Northline.', L('Up to two marks:', '• if the database is breached card details could be stolen (1)', '• use a payment provider/tokenisation so Northline never holds them / reduces PCI-DSS burden (1)')],
      ['a(iii)', 2, 'Explain how RSA allows customers to send data securely without sharing a secret key first.', L('Up to two marks:', '• the website’s public key is shared openly and used to encrypt (1)', '• only the private key held by Northline can decrypt (1)')],
      ['b(i)', 1, 'Give the port normally used by HTTPS.', L('Award one mark for:', '• 443')],
      ['b(ii)', 2, 'Describe the role of TCP when a customer loads a web page.', L('Up to two marks:', '• establishes a connection (three-way handshake) (1)', '• ensures packets arrive in order and are resent if lost (1)')],
      ['b(iii)', 2, 'Explain why UDP is often used in DDoS amplification attacks.', L('Up to two marks:', '• UDP is connectionless so the source IP can be spoofed (1)', '• small requests generate large responses sent to the victim (1)')],
      ['c', 9, 'Northline was hit by a DDoS attack on Black Friday. Evaluate the methods Northline could use to reduce the impact of future DDoS attacks.', IND('DDoS mitigation service/CDN to absorb traffic', 'Cloud auto-scaling – but cost of scaling to attack traffic', 'Firewall/IPS rate limiting, blocking malicious IPs', 'Redundant servers in different regions', 'Incident response plan and monitoring', 'Cost vs lost sales at peak; judgement')]
    ]),
    Q(2, ['Customer service staff work from home and access the order system.'], [
      ['a(i)', 2, 'Explain one security-related advantage of staff accessing the system through a VPN.', L('Up to two marks:', '• traffic is encrypted in a tunnel (1) so it cannot be read on home networks (1)')],
      ['a(ii)', 2, 'Explain one security-related disadvantage of remote working for Northline.', L('Up to two marks:', '• home networks/devices may be insecure (1) increasing malware/data leak risk (1)', '• family members may see screens (1) breaching confidentiality (1)')],
      ['a(iii)', 2, 'Give two items that should be in Northline’s remote working policy.', L('One mark each, up to two:', '• always use the VPN (1)', '• MFA required (1)', '• lock screens when away (1)', '• only company devices (1)', '• secure home Wi-Fi (1)')],
      ['b(i)', 3, 'Describe how multi-factor authentication would protect the order system.', L('One mark each, up to three:', '• users need two or more different factors (1)', '• e.g. password plus app code/fingerprint (1)', '• a stolen password alone cannot be used (1)')],
      ['b(ii)', 2, 'Explain one disadvantage of MFA for staff.', L('Up to two marks:', '• extra step slows logging in (1)', '• staff locked out if they lose their phone/token (1)')],
      ['b(iii)', 3, 'Describe how user management should be handled when a staff member leaves.', L('One mark each, up to three:', '• disable/delete their account immediately (1)', '• revoke VPN, MFA and access rights (1)', '• recover company devices and review logs (1)')],
      ['c', 9, 'Evaluate the use of role-based access control and least privilege for Northline’s systems.', IND('Roles e.g. customer service, warehouse, finance, admin', 'Least privilege limits damage from compromised accounts and insiders', 'Supports GDPR (only necessary access)', 'Administration overhead; roles must be reviewed', 'Can slow work if permissions too tight', 'Judgement')]
    ]),
    Q(3, ['Northline’s website searches products using a database.'], [
      ['a(i)', 2, 'State two signs that the website may be under attack.', L('One mark each, up to two:', '• unusually high traffic (1)', '• many failed logins (1)', '• unexpected database errors (1)', '• high CPU (crypto-jacking) (1)')],
      ['a(ii)', 2, 'Explain one reason why a packet sniffer would not help detect an SQL injection over HTTPS.', L('Up to two marks:', '• HTTPS traffic is encrypted (1)', '• so the sniffer cannot see the content of the requests (1)')],
      ['b(i)', 2, 'Describe what SQL injection is.', L('Up to two marks:', '• malicious SQL code is entered into an input field (1)', '• which the database executes, revealing or changing data (1)')],
      ['b(ii)', 3, 'Describe how parameterised queries prevent SQL injection.', L('One mark each, up to three:', '• the SQL statement is defined with placeholders (1)', '• user input is passed separately as data (1)', '• so it is never executed as SQL code (1)')],
      ['c', 4, 'Explain two other attacks the website should be protected against.', L('Two marks each:', '• buffer overflow (1) – input exceeding memory overwrites code; bounds checking (1)', '• XSS/MITM/credential stuffing (1) with suitable defence (1)', '• crypto-jacking via injected scripts (1) – content security policy (1)')],
      ['d', 9, 'Evaluate the use of penetration testing for Northline.', IND('Stages: reconnaissance, scanning, vulnerability assessment, exploitation, reporting', 'Finds vulnerabilities before attackers do', 'Cost; must be authorised and scoped; may disrupt services', 'Only a snapshot in time – needs repeating', 'Internal vs external testers; legal (Computer Misuse Act)', 'Judgement')]
    ]),
    Q(4, ['Northline sends software updates to its warehouse scanners and emails invoices to business customers.'], [
      ['a(i)', 2, 'Describe what a digital signature proves.', L('Up to two marks:', '• who sent the data – authenticity / non-repudiation (1)', '• that it has not been changed – integrity (1)')],
      ['a(ii)', 2, 'Describe the role of hashing in a digital signature.', L('Up to two marks:', '• a hash of the update/invoice is created (1)', '• the receiver recalculates the hash and compares to detect any change (1)')],
      ['a(iii)', 2, 'Explain why updates for the scanners should be digitally signed.', L('Up to two marks:', '• scanners only install updates verified with Northline’s public key (1)', '• preventing malicious firmware being installed (1)')],
      ['b(i)', 2, 'Describe the difference between a digital signature and a digital certificate.', L('Up to two marks:', '• signature proves a message came from the sender and is unaltered (1)', '• certificate, issued by a CA, proves a public key belongs to an organisation (1)')],
      ['b(ii)', 3, 'Describe the role of encryption in creating a digital signature.', L('One mark each, up to three:', '• hash of the message created (1)', '• hash encrypted with the sender’s private key (1)', '• receiver decrypts with the sender’s public key and compares hashes (1)')],
      ['c(i)', 3, 'Encrypt the word SALE using a Caesar cipher with a key of 5. Show your working.', L('Up to three marks:', '• S→X, A→F (1)', '• L→Q, E→J (1)', '• XFQJ (1)')],
      ['c(ii)', 9, 'Discuss how weaknesses in pre-computer ciphers such as Caesar and transposition led to the design of modern encryption such as AES.', IND('Caesar: 25 keys – brute force; preserves letter frequencies – frequency analysis', 'Transposition: letters unchanged – frequency analysis', 'Combining substitution and transposition increases strength (product ciphers, rotor machines)', 'AES: substitution boxes + permutation over many rounds on 128-bit blocks', 'Huge key space; diffusion and confusion', 'Judgement on progress and remaining risks (key management)')]
    ])
  ]));

  /* ---------- Paper 3: Secondary school ---------- */
  papers.push(paper(3, 'Ridgeway Academy – student devices, IoT, IDS/IPS, GDPR', 'A secondary school with 1 200 students, a new IoT heating system and a cloud learning platform.', [
    Q(1, ['Ridgeway Academy has 1 200 students and 150 staff. Sam is the network manager.'], [
      ['a(i)', 4, 'Describe two differences between IPv4 and IPv6 addresses.', L('Two marks each:', '• IPv4 is 32-bit (1); IPv6 is 128-bit (1)', '• IPv4 written in dotted decimal (1); IPv6 in hexadecimal separated by colons (1)', '• IPv4 has ~4.3 billion addresses (1); IPv6 vastly more (1)')],
      ['a(ii)', 2, 'Explain the purpose of DHCP on the school network.', L('Up to two marks:', '• automatically assigns IP addresses to devices (1)', '• avoiding conflicts and allowing reservations/control of which devices get addresses (1)')],
      ['a(iii)', 2, 'Explain how a rogue DHCP server could be used in an attack.', L('Up to two marks:', '• it gives devices a fake gateway/DNS server (1)', '• so traffic is redirected through the attacker (MITM) (1)')],
      ['b(i)', 1, 'Give the type of address burned into a network interface card.', L('Award one mark for:', '• MAC address')],
      ['b(ii)', 2, 'Describe the purpose of a switch on the school LAN.', L('Up to two marks:', '• connects devices on the LAN (1)', '• forwards frames only to the device with the matching MAC address (1)')],
      ['b(iii)', 2, 'Explain how VLANs could improve security at the school.', L('Up to two marks:', '• separate students, staff, admin and IoT devices (1)', '• so students cannot reach staff/admin systems (1)')],
      ['c', 9, 'Evaluate the security implications of connecting the school’s new IoT heating and CCTV systems to the network.', IND('Benefits: remote control, energy saving, monitoring', 'Risks: default passwords, rarely patched, botnets, entry point to the network, privacy of CCTV', 'Controls: separate VLAN, change defaults, firmware updates, firewall rules, vendor security', 'Availability of heating/CCTV; cost', 'Data protection for CCTV footage', 'Judgement')]
    ]),
    Q(2, ['Students store work on a cloud learning platform. Each student is given 5 GB of personal storage on the school file server.'], [
      ['a(i)', 2, 'Explain one security-related advantage of giving each student personal storage.', L('Up to two marks:', '• permissions mean only that student (and teachers) can access it (1) protecting confidentiality/preventing copying (1)')],
      ['a(ii)', 2, 'Explain one security-related disadvantage of this.', L('Up to two marks:', '• students may store malware/inappropriate files (1) which could spread or breach policy (1)')],
      ['a(iii)', 2, 'Give two ways student work could be protected from loss if the file server fails.', L('One mark each, up to two:', '• RAID (1)', '• regular backups to NAS/cloud (1)', '• off-site backup (1)', '• UPS (1)')],
      ['b(i)', 3, 'Describe how data is kept secure when moving between students’ homes and the cloud platform.', L('One mark each, up to three:', '• HTTPS/TLS encrypts data in transit (1)', '• certificate authenticates the platform (1)', '• interception reveals only ciphertext (1)')],
      ['b(ii)', 2, 'Explain one disadvantage of the cloud platform for the school.', L('Up to two marks:', '• depends on internet access (1) – students without broadband disadvantaged/outages stop access (1)', '• data stored by a third party (1) – less control / GDPR concerns (1)')],
      ['b(iii)', 3, 'Describe how the school could check the cloud provider is secure.', L('One mark each, up to three:', '• check certifications e.g. ISO 27001 / Cyber Essentials (1)', '• data stored in UK/EU – GDPR compliance (1)', '• contract terms on encryption, backups, breach notification (1)')],
      ['c', 9, 'Evaluate the school’s responsibilities under GDPR for student data held on the cloud platform.', IND('School is the data controller; provider is processor – contract needed', 'Lawful basis, minimisation, accuracy, storage limits', 'Security: encryption, access control, MFA for staff', 'Rights of students/parents: access, erasure', 'Breach reporting to ICO within 72 hours', 'Children’s data needs extra care; judgement')]
    ]),
    Q(3, ['Sam has installed an intrusion detection system and an intrusion prevention system.'], [
      ['a(i)', 2, 'State two types of event an IDS might detect on the school network.', L('One mark each, up to two:', '• port scanning (1)', '• repeated failed logins (1)', '• known malware signatures (1)', '• unusual data transfers (1)')],
      ['a(ii)', 2, 'Explain one disadvantage of an IDS.', L('Up to two marks:', '• false positives create many alerts (1) which staff may ignore / time-consuming (1)', '• only alerts – does not stop attacks (1)')],
      ['b(i)', 2, 'Describe how an IPS differs from an IDS.', L('Up to two marks:', '• IDS monitors and alerts (1)', '• IPS sits inline and blocks malicious traffic automatically (1)')],
      ['b(ii)', 3, 'Describe how anomaly-based detection works.', L('One mark each, up to three:', '• a baseline of normal network behaviour is recorded (1)', '• traffic is compared with the baseline (1)', '• significant deviations are flagged (can detect new attacks) (1)')],
      ['c', 4, 'Explain two ways a network monitoring tool could help Sam manage the school network.', L('Two marks each:', '• identify congested routes/bandwidth hogs (1) so performance can be improved (1)', '• detect unknown devices (1) which could be rogue/unauthorised (1)', '• spot unusual traffic patterns (1) indicating malware/attacks (1)')],
      ['d', 9, 'Evaluate the use of both an IDS and an IPS to protect the school network.', IND('Layered defence – IDS visibility, IPS automatic blocking', 'IPS false positives could block legitimate traffic – affects availability for lessons', 'Cost and expertise to tune and monitor', 'Encrypted traffic limits inspection', 'Cannot stop insider/social engineering alone', 'Judgement')]
    ]),
    Q(4, ['Sam is teaching an A-level computing class about cryptography.'], [
      ['a(i)', 2, 'Describe what is meant by a transposition cipher.', L('Up to two marks:', '• letters of the message are rearranged (1)', '• but the letters themselves are not changed (1)')],
      ['a(ii)', 2, 'Encrypt HELLO with a Caesar shift of 2.', L('Up to two marks:', '• JGNNQ (2) – one mark for at least three correct letters')],
      ['a(iii)', 2, 'Explain why frequency analysis can break a Caesar cipher.', L('Up to two marks:', '• each letter is always replaced by the same letter (1)', '• so the most common ciphertext letters match common letters such as E (1)')],
      ['b(i)', 2, 'Describe how XOR is used to encrypt and decrypt data.', L('Up to two marks:', '• each bit of the data is XORed with a bit of the key (1)', '• XORing the ciphertext with the same key returns the original (1)')],
      ['b(ii)', 3, 'Calculate 1010 1100 XOR 0110 0101 and show that XORing the result with the key gives the original.', L('Up to three marks:', '• 1010 1100 ⊕ 0110 0101 = 1100 1001 (2)', '• 1100 1001 ⊕ 0110 0101 = 1010 1100 (1)')],
      ['c(i)', 3, 'The one-time pad is impossible to break if used correctly. Explain the conditions needed.', L('One mark each, up to three:', '• key truly random (1)', '• key at least as long as the message (1)', '• key used only once and kept secret (1)')],
      ['c(ii)', 9, 'Discuss the role of hashing algorithms (MD5, SHA-2, SHA-3) in securing the school’s systems.', IND('Password storage with salts – one-way', 'Integrity checks of downloads/backups', 'Digital signatures and certificates use hashes', 'MD5 broken (collisions) – not for security', 'SHA-2 widely used; SHA-3 alternative design', 'Judgement on choice')]
    ])
  ]));

  /* ---------- Paper 4: Logistics company ---------- */
  papers.push(paper(4, 'SwiftHaul Logistics – WAN, insider threats, VPN, PKI', 'A delivery company with depots across the UK, drivers with tablets and an extranet for business customers.', [
    Q(1, ['SwiftHaul Logistics has a head office and six depots connected by a WAN. Priya is the IT security manager.'], [
      ['a(i)', 4, 'Describe two security challenges of connecting the depots with a WAN.', L('Two marks each:', '• data crosses third-party/public infrastructure (1) so it could be intercepted – needs encryption (1)', '• more entry points/devices to secure (1) larger attack surface (1)', '• depends on links being available (1) DoS could cut off depots (1)')],
      ['a(ii)', 2, 'Explain how IPsec could secure traffic between depots.', L('Up to two marks:', '• creates site-to-site VPN tunnels (1)', '• encrypting and authenticating IP packets (1)')],
      ['a(iii)', 2, 'Explain why a mesh WAN topology could improve availability.', L('Up to two marks:', '• multiple routes between sites (1)', '• if one link fails/is attacked traffic is rerouted (1)')],
      ['b(i)', 1, 'Give one protocol used for secure file transfer.', L('Award one mark for:', '• SFTP / FTPS / HTTPS / SCP')],
      ['b(ii)', 2, 'Describe the concept of packet switching.', L('Up to two marks:', '• data is split into packets that travel independently by different routes (1)', '• and are reassembled in order at the destination (1)')],
      ['b(iii)', 2, 'Explain why FTP should not be used by SwiftHaul.', L('Up to two marks:', '• FTP sends usernames, passwords and data in plain text (1)', '• which can be intercepted (1)')],
      ['c', 9, 'Evaluate the use of a cloud-based network (cloud servers and storage) instead of the head-office servers for SwiftHaul.', IND('Accessible from all depots and drivers anywhere', 'Scalability at peak seasons', 'Provider redundancy vs reliance on internet', 'Security responsibilities shared; data location/GDPR', 'Cost model; migration effort; compatibility with legacy systems', 'Judgement')]
    ]),
    Q(2, ['Drivers use tablets to record deliveries. Business customers can track parcels on an extranet.'], [
      ['a(i)', 2, 'Explain one security-related advantage of the extranet for SwiftHaul.', L('Up to two marks:', '• customers access only their own tracking data (1) without access to the internal network (1)')],
      ['a(ii)', 2, 'Explain one security-related disadvantage of the extranet.', L('Up to two marks:', '• external users increase the attack surface (1) weak customer passwords could expose data (1)')],
      ['a(iii)', 2, 'Give two ways drivers’ tablets could be protected if they are stolen.', L('One mark each, up to two:', '• full disk encryption (1)', '• passcode/biometric lock (1)', '• remote wipe via MDM (1)', '• auto-lock (1)')],
      ['b(i)', 3, 'Describe how a VPN protects data sent from drivers’ tablets over 4G.', L('One mark each, up to three:', '• encrypted tunnel between the tablet and head office (1)', '• data encapsulated and encrypted (1)', '• anyone intercepting on the mobile network sees only ciphertext (1)')],
      ['b(ii)', 2, 'Explain one disadvantage of using a VPN on the tablets.', L('Up to two marks:', '• slower connection/battery use (1)', '• connection drops in poor signal areas (1)')],
      ['b(iii)', 3, 'Describe how mobile device management (MDM) helps secure the tablets.', L('One mark each, up to three:', '• enforces passcodes and encryption (1)', '• controls which apps can be installed / pushes updates (1)', '• locate, lock or wipe lost devices (1)')],
      ['c', 9, 'Evaluate the risks of insider threats at SwiftHaul and how they can be managed.', IND('Malicious (stealing customer data, sabotage) and careless (phishing, lost devices)', 'Drivers and depot staff have varied access', 'Controls: least privilege, logging/auditing, separation of duties, leaver process', 'Training and culture; whistleblowing', 'Monitoring vs employee privacy', 'Judgement')]
    ]),
    Q(3, ['Priya is reviewing security at the depots.'], [
      ['a(i)', 2, 'State two physical security measures for the depot server rooms.', L('One mark each, up to two:', '• locked doors/key cards (1)', '• CCTV (1)', '• visitor logs (1)', '• alarms (1)')],
      ['a(ii)', 2, 'Explain why physical security is important even with strong encryption.', L('Up to two marks:', '• an attacker with physical access could install devices/steal hardware (1)', '• or damage equipment affecting availability (1)')],
      ['b(i)', 2, 'Describe what is meant by tailgating.', L('Up to two marks:', '• an unauthorised person follows an authorised person (1)', '• through a secure door without using their own credentials (1)')],
      ['b(ii)', 3, 'Describe three features of a good disaster recovery plan for SwiftHaul.', L('One mark each, up to three:', '• off-site/cloud backups (1)', '• defined recovery times and priorities (1)', '• roles and contact lists (1)', '• alternative site/failover (1)', '• regularly tested (1)')],
      ['c', 4, 'Explain two reasons why SwiftHaul should test its backups.', L('Two marks each:', '• backups may be corrupted/incomplete (1) only discovered when needed (1)', '• staff practise the restore process (1) reducing downtime (1)')],
      ['d', 9, 'Evaluate the importance of an incident response plan for SwiftHaul.', IND('Stages: detect, contain, eradicate, recover, review', 'Reduces downtime – deliveries depend on systems', 'Clear roles; communication with customers/ICO', 'Legal obligations under GDPR', 'Must be tested; costs time', 'Judgement')]
    ])
    ,
    Q(4, ['SwiftHaul’s customers download invoices from the extranet.'], [
      ['a(i)', 2, 'Describe what is meant by Public Key Infrastructure (PKI).', L('Up to two marks:', '• the system of CAs, certificates, policies and revocation (1)', '• that allows public keys to be trusted (1)')],
      ['a(ii)', 2, 'Describe what happens to a certificate that is compromised.', L('Up to two marks:', '• it is revoked by the CA (1)', '• added to a revocation list/OCSP so browsers reject it (1)')],
      ['a(iii)', 2, 'Describe the relationship between TLS and HTTPS.', L('Up to two marks:', '• HTTPS is HTTP running over TLS (1)', '• TLS provides the encryption/authentication (1)')],
      ['b(i)', 2, 'Describe the role of encryption in the TLS handshake.', L('Up to two marks:', '• asymmetric encryption (server’s public key) used to agree a session key (1)', '• session key used for symmetric encryption of the data (1)')],
      ['b(ii)', 3, 'Explain why TLS uses both asymmetric and symmetric encryption.', L('Up to three marks:', '• asymmetric solves the key-exchange problem (1)', '• but is slow (1)', '• symmetric is fast for bulk data once the key is shared (1)')],
      ['c(i)', 3, 'Explain how steganography could be used to leak data from SwiftHaul.', L('Up to three marks:', '• data hidden inside images/files (1)', '• sent out by email/uploads that look harmless (1)', '• bypassing data loss prevention controls (1)')],
      ['c(ii)', 9, 'Discuss how encryption and key management should be used to secure SwiftHaul’s data at rest and in transit.', IND('In transit: TLS, VPN/IPsec, SFTP', 'At rest: full disk encryption on laptops/tablets; database/file encryption', 'Key management: secure storage (HSM/key vault), rotation, revocation, backups, access control', 'Performance and usability impact', 'Compliance and cost', 'Judgement')]
    ])
  ]));

  /* ---------- Paper 5: Local council ---------- */
  papers.push(paper(5, 'Fairbridge Council – public Wi-Fi, social engineering, CMA, zero-day', 'A local council with libraries, online services and a call centre.', [
    Q(1, ['Fairbridge Council provides online services for residents such as council tax payments. Ben leads the cyber-security team.'], [
      ['a(i)', 4, 'Describe two threats to the council’s online payment service.', L('Two marks each:', '• DDoS (1) – service unavailable to residents (1)', '• SQL injection (1) – data stolen or altered (1)', '• phishing sites imitating the council (1) – residents’ details stolen (1)')],
      ['a(ii)', 2, 'Explain why the payment pages must use HTTPS.', L('Up to two marks:', '• encrypts payment details in transit (1)', '• certificate proves the site is genuine (1)')],
      ['a(iii)', 2, 'Explain one way the council can make sure residents are using the genuine website.', L('Up to two marks:', '• publicise the official URL / use a gov.uk domain (1)', '• residents check the padlock/certificate (1)')],
      ['b(i)', 1, 'Give one legal requirement the council must meet when handling residents’ personal data.', L('Award one mark for:', '• comply with UK GDPR/Data Protection Act – e.g. keep data secure / lawful basis / report breaches')],
      ['b(ii)', 2, 'Describe one offence under the Computer Misuse Act.', L('Up to two marks:', '• unauthorised access to computer material (1)', '• e.g. logging into a system without permission (1)')],
      ['b(iii)', 2, 'Explain why a council employee looking up a neighbour’s records could break the law.', L('Up to two marks:', '• access beyond their authorisation is unauthorised under the CMA (1)', '• and misuse of personal data breaches GDPR (1)')],
      ['c', 9, 'Evaluate the security measures the council should use for its online payment service.', IND('TLS/HTTPS; third-party PCI-compliant payment processor', 'WAF, input validation, patching', 'DDoS protection and redundancy', 'Logging, monitoring, incident response', 'Usability for all residents; accessibility', 'Judgement')]
    ]),
    Q(2, ['The council provides free public Wi-Fi in its libraries.'], [
      ['a(i)', 2, 'Explain one security-related advantage of requiring library users to register for Wi-Fi.', L('Up to two marks:', '• users can be identified (1) deterring and tracing misuse (1)')],
      ['a(ii)', 2, 'Explain one security-related disadvantage of public Wi-Fi for library users.', L('Up to two marks:', '• others on the network may eavesdrop (1) on unencrypted traffic (1)')],
      ['a(iii)', 2, 'Give two content-control measures the council could apply.', L('One mark each, up to two:', '• web filtering (1)', '• block certain ports/protocols (1)', '• bandwidth limits (1)', '• time limits (1)')],
      ['b(i)', 3, 'Describe how client isolation on the access point protects users.', L('One mark each, up to three:', '• devices on the Wi-Fi cannot communicate directly with each other (1)', '• only with the internet gateway (1)', '• prevents users attacking or snooping on each other (1)')],
      ['b(ii)', 2, 'Explain why the public Wi-Fi must be separate from the council’s internal network.', L('Up to two marks:', '• public users must not reach council systems/data (1)', '• a compromised device could attack internal servers (1)')],
      ['b(iii)', 3, 'Describe how an attacker could use ARP spoofing on a public network.', L('One mark each, up to three:', '• sends fake ARP messages (1)', '• associating their MAC with the gateway IP (1)', '• victims’ traffic passes through the attacker – MITM (1)')],
      ['c', 9, 'Evaluate the council’s approach of providing free public Wi-Fi in libraries.', IND('Benefits: digital inclusion, access to services', 'Risks: misuse, eavesdropping, liability, malware', 'Controls: segmentation, filtering, client isolation, registration, logging', 'Cost and staff support', 'Privacy of users vs monitoring', 'Judgement')]
    ]),
    Q(3, ['The council’s call centre staff receive calls from residents.'], [
      ['a(i)', 2, 'State two techniques used in social engineering.', L('One mark each, up to two:', '• phishing (1)', '• pretexting (1)', '• vishing (phone) (1)', '• baiting (1)', '• tailgating (1)')],
      ['a(ii)', 2, 'Explain why call centre staff are a target for social engineering.', L('Up to two marks:', '• they have access to residents’ data and are trained to be helpful (1)', '• attackers can impersonate residents to obtain information (1)')],
      ['b(i)', 2, 'Describe a zero-day vulnerability.', L('Up to two marks:', '• a flaw unknown to the vendor (1)', '• with no patch available when it is exploited (1)')],
      ['b(ii)', 3, 'Describe how the council could reduce the risk from zero-day vulnerabilities.', L('One mark each, up to three:', '• defence in depth – segmentation, least privilege (1)', '• anomaly-based IDS/IPS (1)', '• rapid patching when available / threat intelligence (1)', '• sandboxing/application allow-listing (1)')],
      ['c', 4, 'Explain two items that should be included in staff training at the call centre.', L('Two marks each:', '• verifying caller identity before giving information (1) prevents impersonation (1)', '• recognising phishing emails (1) prevents credential theft (1)', '• reporting suspicious activity (1) faster response (1)')],
      ['d', 9, 'Evaluate the effectiveness of user training in reducing social engineering attacks at the council.', IND('Social engineering exploits people not technology', 'Training raises awareness; phishing simulations measure progress', 'Must be repeated; knowledge fades; staff turnover', 'Needs supporting procedures (call-back checks) and technical controls', 'Cost/time vs breach costs', 'Judgement')]
    ]),
    Q(4, ['Ben is preparing a briefing on encryption for councillors.'], [
      ['a(i)', 2, 'Describe what is meant by encryption at rest.', L('Up to two marks:', '• data is encrypted while stored on a device/server (1)', '• so it is unreadable if the storage is stolen (1)')],
      ['a(ii)', 2, 'Explain why councillors’ laptops should use full disk encryption.', L('Up to two marks:', '• laptops can be lost or stolen (1)', '• the data cannot be read without the key/password (1)')],
      ['a(iii)', 2, 'Describe how a key derivation function creates an AES key from a password.', L('Up to two marks:', '• the password and a salt are hashed many times (1)', '• producing a fixed-length (e.g. 256-bit) key (1)')],
      ['b(i)', 2, 'Describe a digital certificate.', L('Up to two marks:', '• an electronic document issued by a CA (1)', '• binding a public key to the identity of its owner (1)')],
      ['b(ii)', 3, 'Describe how a resident’s browser checks the council website’s certificate.', L('One mark each, up to three:', '• checks the certificate is signed by a trusted CA (1)', '• checks the domain name matches (1)', '• checks it has not expired or been revoked (1)')],
      ['c(i)', 3, 'Describe how a rotor cipher machine such as Enigma improved on simple substitution.', L('One mark each, up to three:', '• rotors changed the substitution after each letter (1)', '• the same letter encrypted differently each time (1)', '• defeating simple frequency analysis (1)')],
      ['c(ii)', 9, 'Discuss the suitability of symmetric and asymmetric encryption for the council’s different needs.', IND('Symmetric (AES): bulk data at rest/in transit – fast', 'Asymmetric (RSA): key exchange, digital signatures, certificates', 'Hybrid use in TLS', 'Key management challenges for each', 'Performance and scalability', 'Judgement')]
    ])
  ]));

  /* ---------- Paper 6: Games studio ---------- */
  papers.push(paper(6, 'Pixelforge Studios – source code protection, crypto-jacking, RAID, utilities', 'A games studio with valuable source code, high-performance PCs and an online game server.', [
    Q(1, ['Pixelforge Studios develops games. Its source code is its most valuable asset. Lena manages IT.'], [
      ['a(i)', 4, 'Describe two ways the studio could protect its source code from theft.', L('Two marks each:', '• access control/least privilege on repositories (1) only relevant developers can access (1)', '• encryption at rest (1) unreadable if stolen (1)', '• logging and auditing of downloads (1) detect insider theft (1)', '• MFA on code repository accounts (1) stolen passwords not enough (1)')],
      ['a(ii)', 2, 'Explain why insider threats are a particular risk for the studio.', L('Up to two marks:', '• developers legitimately have access to code (1)', '• could copy it to a competitor/leak it before release (1)')],
      ['a(iii)', 2, 'Explain one legal protection the studio has if someone hacks into its repository.', L('Up to two marks:', '• Computer Misuse Act – unauthorised access is an offence (1)', '• attacker can be prosecuted (1)')],
      ['b(i)', 1, 'Give one protocol developers could use to access a remote server securely.', L('Award one mark for:', '• SSH')],
      ['b(ii)', 2, 'Describe the purpose of a package manager for the developers.', L('Up to two marks:', '• installs and updates software libraries/tools (1)', '• from trusted sources, managing dependencies (1)')],
      ['b(iii)', 2, 'Explain one security risk of using third-party code libraries.', L('Up to two marks:', '• libraries may contain vulnerabilities/malicious code (1)', '• affecting the studio’s games (supply-chain attack) (1)')],
      ['c', 9, 'Evaluate the use of virtual machines and sandboxes by the studio.', IND('Test untrusted code/builds in isolation', 'Separate development environments; snapshots for recovery', 'Analyse suspicious files safely', 'Performance overhead on graphics-heavy work; hardware cost', 'VM escape vulnerabilities; must still patch', 'Judgement')]
    ]),
    Q(2, ['The studio stores game assets on a NAS with a RAID 5 array.'], [
      ['a(i)', 2, 'Explain one advantage of RAID 5 for the studio.', L('Up to two marks:', '• striping with parity (1) data survives one disk failure (1)')],
      ['a(ii)', 2, 'Explain why the studio still needs separate backups.', L('Up to two marks:', '• RAID copies deletions/corruption/ransomware instantly (1)', '• so backups are needed to restore earlier versions (1)')],
      ['a(iii)', 2, 'Give two types of backup the studio could use.', L('One mark each, up to two:', '• full (1)', '• incremental (1)', '• differential (1)', '• off-site/cloud (1)')],
      ['b(i)', 3, 'Describe the difference between a NAS and a SAN.', L('Up to three marks:', '• NAS is a file-level storage device on the LAN (1)', '• SAN is a dedicated high-speed network providing block-level storage to servers (1)', '• SAN is faster/more scalable but more expensive (1)')],
      ['b(ii)', 2, 'Explain one security setting that should be applied to the NAS.', L('Up to two marks:', '• change default admin password / user permissions per folder (1) prevent unauthorised access (1)')],
      ['b(iii)', 3, 'Describe how compression utilities help with backups.', L('One mark each, up to three:', '• reduce file size (1)', '• backups take less storage and transfer faster (1)', '• archives can be password-protected/encrypted (1)')],
      ['c', 9, 'Evaluate the studio’s backup strategy options, including cloud backup.', IND('3-2-1 rule; on-site NAS for speed, cloud/off-site for disasters', 'Large asset files – bandwidth and cost of cloud', 'Encryption of backups; key management', 'Test restores; RPO/RTO', 'Ransomware protection – immutable/offline copies', 'Judgement')]
    ]),
    Q(3, ['Lena notices the studio’s render PCs are running slowly overnight.'], [
      ['a(i)', 2, 'State two signs that the PCs may be infected with crypto-jacking malware.', L('One mark each, up to two:', '• high CPU/GPU usage when idle (1)', '• overheating/fans running (1)', '• unusual network connections to mining pools (1)', '• higher electricity costs (1)')],
      ['a(ii)', 2, 'Explain one impact of crypto-jacking on the studio.', L('Up to two marks:', '• reduced performance for rendering (1) delaying projects (1)', '• hardware wear/electricity costs (1)')],
      ['b(i)', 2, 'Describe how anti-malware software detects malicious programs.', L('Up to two marks:', '• signature-based – compares files with known malware patterns (1)', '• heuristic/behaviour-based – detects suspicious activity (1)')],
      ['b(ii)', 3, 'Describe how a traffic analyser could help Lena investigate.', L('One mark each, up to three:', '• shows which devices are sending/receiving traffic (1)', '• identifies connections to unknown external addresses (1)', '• shows volume/timing of traffic overnight (1)')],
      ['c', 4, 'Explain two ways network segmentation could protect the studio.', L('Two marks each:', '• separate render farm from code repository (1) malware cannot spread to critical assets (1)', '• guest/visitor network separated (1) visitors cannot reach studio systems (1)')],
      ['d', 9, 'Evaluate the use of trusted software policies (application allow-listing) at the studio.', IND('Only approved, signed software runs – blocks crypto-miners and unknown malware', 'Developers need many tools – may slow work', 'Admin overhead to maintain list', 'Combined with package managers and patching', 'Insider/zero-day limits', 'Judgement')]
    ]),
    Q(4, ['The studio runs an online game server. Players log in and buy items.'], [
      ['a(i)', 2, 'Describe what a replay attack is.', L('Up to two marks:', '• capturing a valid message such as a login or purchase (1)', '• and resending it later to repeat the action (1)')],
      ['a(ii)', 2, 'Describe one way to prevent replay attacks.', L('Up to two marks:', '• use nonces/timestamps/session tokens (1)', '• so old messages are rejected (1)')],
      ['a(iii)', 2, 'Describe the relationship between TLS and HTTPS on the game’s store.', L('Up to two marks:', '• HTTPS is HTTP over TLS (1)', '• TLS encrypts purchases and authenticates the store (1)')],
      ['b(i)', 2, 'Describe the purpose of a buffer overflow attack against the game server.', L('Up to two marks:', '• send more data than a buffer can hold (1)', '• to overwrite memory and run malicious code or crash the server (1)')],
      ['b(ii)', 3, 'Describe how the developers could prevent buffer overflow vulnerabilities.', L('One mark each, up to three:', '• validate input length/bounds checking (1)', '• use memory-safe languages/functions (1)', '• code review and fuzz testing (1)', '• patch libraries (1)')],
      ['c(i)', 3, 'Describe how the server could verify that game updates downloaded by players are genuine.', L('One mark each, up to three:', '• updates are digitally signed by the studio (1)', '• the client checks the signature with the studio’s public key (1)', '• and compares hashes to confirm the update is unaltered (1)')],
      ['c(ii)', 9, 'Evaluate the security measures needed to protect the online game server and players’ accounts.', IND('DDoS protection; scaling', 'Account security: MFA, rate limiting, salted hashing', 'Input validation; patching; anti-cheat', 'TLS for logins and purchases; payment provider', 'GDPR for player data; logging', 'Judgement')]
    ])
  ]));

  window.BIZ_PAPERS = (window.BIZ_PAPERS || []).concat(papers);
})();
