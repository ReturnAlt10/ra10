/* BTEC Computing (AAQ) Unit 2 — Computer Network Security and Encryption: knowledge checks in the Pearson style. */
(function () {
  'use strict';
  const B = BizBank('CP2', 'AAQ');
  window.__BIZ_B = B;
  const { K, KL } = B;

  /* A — networks */
  K('A', 'A1 Topologies', 'Explain', 2, 'Explain one security consideration of a star topology.', ['The central switch is a single point of failure/target (1) – if it is attacked or fails the whole network is affected (1)']);
  K('A', 'A1 Topologies', 'Explain', 2, 'Explain one security risk of an ad-hoc network.', ['No central control/authentication (1) so rogue devices can join and intercept data (1)']);
  K('A', 'A1 Architecture', 'Explain', 4, 'Explain one security advantage and one disadvantage of a client–server network.', ['Advantage: central control of access, backups and updates (1) so security is consistent (1)', 'Disadvantage: server is a single point of failure/high-value target (1) so an attack can stop the whole network (1)']);
  K('A', 'A1 Peer-to-peer', 'Explain', 2, 'Explain why peer-to-peer networks are harder to secure.', ['There is no central server controlling access (1) so security depends on every individual device/user (1)']);
  K('A', 'A1 Media', 'Explain', 2, 'Explain why optical fibre is more secure than Wi-Fi.', ['Light signals in the cable are very hard to tap without detection (1) whereas Wi-Fi radio signals can be intercepted by anyone in range (1)']);
  K('A', 'A1 IoT', 'Explain', 3, 'Explain why IoT devices are a security risk on a network.', ['Often shipped with default passwords (1)', 'rarely updated/patched (1)', 'can be taken over to form botnets or provide an entry point into the network (1)']);
  K('A', 'A1 Network types', 'Explain', 2, 'Explain the difference between an intranet and an extranet.', ['Intranet: private network for internal staff only (1)', 'Extranet: part of the private network that authorised external partners can access (1)']);
  K('A', 'A1 Performance', 'Explain', 2, 'Explain how security measures can affect network performance.', ['Encryption and deep packet inspection add processing overhead (1) increasing latency / reducing throughput (1)']);
  K('A', 'A2 Memory', 'Explain', 2, 'Explain the difference between RAM and ROM.', ['RAM is volatile and holds running programs/data (1)', 'ROM is non-volatile and holds firmware/boot instructions that cannot be changed (1)']);
  K('A', 'A2 Memory', 'Explain', 2, 'Explain one security risk of EEPROM.', ['Firmware can be rewritten electrically (1) so malicious firmware could be installed if updates are not authenticated (1)']);
  K('A', 'A2 Storage', 'Give', 2, 'Give two ways personal storage can be protected from loss due to failure of the data server.', ['RAID (mirroring/parity)', 'Regular backups (off-site/cloud)', 'NAS/SAN replication', 'Uninterruptible power supply']);
  K('A', 'A2 RAID', 'Explain', 2, 'Explain why RAID is not a replacement for backups.', ['RAID protects against disk failure (1) but deletions, corruption or ransomware are copied to all disks immediately (1)']);
  K('A', 'A2 NAS/SAN', 'Explain', 2, 'Explain the difference between NAS and SAN.', ['NAS: a storage device on the LAN sharing files (1)', 'SAN: a dedicated high-speed network of storage for servers (block-level) (1)']);
  K('A', 'A2 Devices', 'State', 2, 'State two security settings that can be configured on a wireless access point.', ['WPA3/WPA2 encryption', 'Change default admin password', 'Disable WPS', 'Hide/rename SSID', 'MAC filtering', 'Separate guest network']);
  K('A', 'A2 Devices', 'Explain', 2, 'Explain one security setting on a switch.', ['Port security / disable unused ports (1) so unauthorised devices cannot plug in (1)', 'VLANs (1) separate traffic so breaches are contained (1)']);
  K('A', 'A3 OS', 'Explain', 2, 'Explain the difference between kernel mode and user mode.', ['Kernel mode has full access to hardware/memory (1)', 'applications run in user mode with restricted privileges, limiting damage from faulty/malicious code (1)']);
  K('A', 'A3 Utilities', 'State', 2, 'State two network utilities that could be used to find all devices on a LAN.', ['Network mapping tool (e.g. Nmap)', 'IP address management (IPAM) tool', 'Ping sweep / connectivity checker', 'ARP table / DHCP lease list']);
  K('A', 'A3 Utilities', 'Explain', 2, 'Explain one disadvantage of using a network mapping tool.', ['Scanning generates a lot of traffic (1) which can slow the network / trigger IDS alarms / miss devices that block pings (1)']);

  /* B — security */
  K('B', 'B1 Malware', 'Explain', 2, 'Explain the difference between spyware and adware.', ['Spyware secretly monitors and records user activity e.g. keystrokes (1)', 'adware displays unwanted adverts and tracks browsing (1)']);
  K('B', 'B1 DDoS', 'Explain', 3, 'Explain how a DDoS attack affects an organisation.', ['Many compromised devices (botnet) flood the server with requests (1)', 'legitimate users cannot access services – loss of availability (1)', 'lost income/reputation (1)']);
  K('B', 'B1 Social engineering', 'Explain', 2, 'Explain what is meant by social engineering.', ['Manipulating people (1) into revealing confidential information or giving access e.g. phishing (1)']);
  K('B', 'B1 Insider', 'Explain', 2, 'Explain why insider threats are difficult to detect.', ['Insiders already have legitimate access/credentials (1) so their actions look like normal activity (1)']);
  K('B', 'B1 Zero-day', 'Explain', 2, 'Explain what is meant by a zero-day vulnerability.', ['A flaw unknown to the vendor (1) so no patch exists when attackers exploit it (1)']);
  K('B', 'B2 Attacks', 'Explain', 2, 'Explain how a replay attack works.', ['The attacker captures a valid transmission e.g. login (1) and resends it later to gain access (1)']);
  K('B', 'B2 Attacks', 'Explain', 3, 'Explain how ARP spoofing enables a man-in-the-middle attack.', ['Attacker sends fake ARP replies (1)', 'linking their MAC address to the gateway’s IP address (1)', 'so traffic is sent to the attacker who can read/alter it (1)']);
  K('B', 'B2 Attacks', 'Explain', 2, 'Explain DNS poisoning.', ['False DNS records are inserted into a cache (1) so users are redirected to malicious websites (1)']);
  K('B', 'B2 SQL injection', 'Explain', 3, 'Explain how SQL injection works and one defence.', ['Malicious SQL is entered into an input field (1)', 'it is executed by the database, revealing/changing data (1)', 'defence: parameterised queries / input validation (1)']);
  K('B', 'B2 Buffer overflow', 'Explain', 2, 'Explain a buffer overflow attack.', ['More data is written than a memory buffer can hold (1) overwriting adjacent memory, allowing malicious code to run (1)']);
  K('B', 'B2 Crypto-jacking', 'Explain', 2, 'Explain one sign that a device has been crypto-jacked.', ['Unusually high CPU usage / slow performance / overheating (1) because it is secretly mining cryptocurrency (1)']);
  K('B', 'B3 Authentication', 'Explain', 3, 'Explain how multi-factor authentication improves security.', ['Requires two or more factors – something you know, have, are (1)', 'e.g. password plus code on phone (1)', 'a stolen password alone is not enough (1)']);
  K('B', 'B3 OS', 'Explain', 2, 'Explain why patch management is important.', ['Patches fix known vulnerabilities (1) so attackers cannot exploit them (1)']);
  K('B', 'B3 OS', 'Explain', 2, 'Explain the principle of least privilege.', ['Users are given only the access they need for their role (1) limiting the damage from compromised accounts/insiders (1)']);
  K('B', 'B3 IDS/IPS', 'Describe', 2, 'Describe how an IPS differs from an IDS.', ['An IDS monitors and alerts (passive) (1)', 'an IPS sits inline and automatically blocks malicious traffic (active) (1)']);
  K('B', 'B3 IDS', 'Describe', 3, 'Describe how an IDS works.', ['Monitors network traffic/logs (1)', 'compares with signatures of known attacks or a baseline of normal behaviour (anomaly) (1)', 'raises an alert/logs the event for administrators (1)']);
  K('B', 'B3 Packet sniffer', 'Explain', 4, 'Explain two security concerns of using a packet sniffer on a network.', ['Captures all traffic including unencrypted passwords/personal data (1) – must be restricted to authorised staff (1)', 'Could be misused by insiders or attackers (1) for eavesdropping (1)', 'Stored captures must be protected (1) under data protection law (1)']);
  K('B', 'B3 Pen testing', 'Describe', 3, 'Describe the stages of penetration testing.', ['Reconnaissance and scanning to find systems (1)', 'vulnerability assessment and exploitation (1)', 'reporting findings and recommendations (1)']);
  K('B', 'B3 Sandbox', 'Explain', 2, 'Explain how a sandbox protects a network.', ['Untrusted code runs in an isolated environment (1) so malware cannot affect the real system (1)']);
  K('B', 'B3 Segmentation', 'Explain', 2, 'Explain how network segmentation improves security.', ['The network is divided into VLANs/subnets (1) so an attacker in one segment cannot easily reach others (1)']);
  K('B', 'B3 CIA', 'Explain', 3, 'Explain the CIA triad.', ['Confidentiality – only authorised users access data (1)', 'Integrity – data is accurate and unaltered (1)', 'Availability – data/systems are accessible when needed (1)']);
  K('B', 'B3 Policies', 'Explain', 2, 'Explain one feature of a BYOD policy.', ['Devices must be enrolled in mobile device management (1) allowing remote wipe and enforced passcodes (1)']);
  K('B', 'B3 Policies', 'Explain', 3, 'Explain the stages of an incident response plan.', ['Detect and identify the incident (1)', 'contain and eradicate the threat (1)', 'recover and review lessons learned (1)']);
  K('B', 'B3 Backup', 'Explain', 2, 'Explain the 3-2-1 backup rule.', ['Three copies of data on two different media (1) with one copy off-site (1)']);
  K('B', 'B4 GDPR', 'State', 2, 'State two rights individuals have under GDPR.', ['Right of access', 'Right to rectification', 'Right to erasure', 'Right to restrict processing', 'Right to data portability', 'Right to object']);
  K('B', 'B4 Computer Misuse', 'State', 3, 'State three offences under the Computer Misuse Act.', ['Unauthorised access to computer material', 'Unauthorised access with intent to commit further offences', 'Unauthorised acts impairing a computer (malware, DoS)', 'Making/supplying tools for misuse']);
  KL('B', 'B3 Risk', 'Evaluate', 9, 'Evaluate the importance of risk assessments for a college LAN.', ['Identify assets, threats, vulnerabilities (tools: scanners, pen tests, audits)', 'Prioritise by likelihood and impact', 'Justify spending on controls; compliance with GDPR', 'Must be reviewed regularly – new threats', 'Limits: time, cost, skills; may miss zero-days', 'Judgement']);

  /* C — encryption */
  K('C', 'C1 Packets', 'Describe', 3, 'Describe the contents of a data packet.', ['Header: source and destination IP, packet number, protocol (1)', 'Payload: the data (1)', 'Trailer: checksum/end marker (1)']);
  K('C', 'C1 Packets', 'Explain', 2, 'Explain the purpose of the packet number.', ['Packets may arrive out of order via different routes (1) so the number lets them be reassembled correctly (1)']);
  K('C', 'C1 Addresses', 'Explain', 2, 'Explain the difference between an IP address and a MAC address.', ['IP address is a logical address used to route between networks and can change (1)', 'MAC address is a fixed hardware address used on the local network (1)']);
  K('C', 'C1 IPv6', 'Explain', 2, 'Explain why IPv6 was introduced.', ['IPv4 (32-bit) has run out of addresses (1); IPv6 is 128-bit giving vastly more addresses (1)']);
  K('C', 'C1 Protocols', 'Give', 1, 'Give one protocol other than SMTP used for email.', ['POP3', 'IMAP']);
  K('C', 'C1 SMTP', 'Describe', 2, 'Describe the role of SMTP in transmitting an email.', ['Sends the email from the client to the mail server (1) and between mail servers towards the recipient’s server (1)']);
  K('C', 'C1 SMTP', 'Explain', 2, 'Explain the effect of SMTP being inherently insecure.', ['Emails may be sent in plain text (1) so they can be intercepted/read or spoofed unless TLS is used (1)']);
  K('C', 'C1 Symmetric', 'Describe', 4, 'Describe two differences between symmetric and asymmetric encryption.', ['Symmetric uses one shared key; asymmetric uses a public/private key pair (2)', 'Symmetric is faster and suits bulk data; asymmetric is slower (2)', 'Asymmetric solves the key distribution problem (2)']);
  K('C', 'C1 AES', 'Explain', 2, 'Explain why a 256-bit AES key is more secure than a 128-bit key.', ['There are 2²⁵⁶ possible keys compared with 2¹²⁸ (1) so a brute-force attack would take far longer (1)']);
  K('C', 'C1 Key derivation', 'Explain', 2, 'Explain how a 256-bit key is produced from a shorter password.', ['A key derivation function (e.g. PBKDF2) hashes the password with a salt (1) repeated many times to produce a fixed 256-bit key (1)']);
  K('C', 'C1 RSA', 'Explain', 2, 'Explain what makes RSA secure.', ['It relies on the difficulty of factorising the product of two very large prime numbers (1) which is infeasible with current computers (1)']);
  K('C', 'C1 Caesar', 'Calculate', 2, 'Encrypt the word CODE using a Caesar cipher with a shift of 4.', ['GSHI (2) – one mark for two correct letters']);
  K('C', 'C1 Caesar', 'Explain', 2, 'Explain one weakness of the Caesar cipher.', ['Only 25 possible keys (1) so it can be broken by brute force / frequency analysis (1)']);
  K('C', 'C1 One-time pad', 'Explain', 3, 'Explain why a one-time pad is unbreakable but rarely used.', ['Key is truly random and as long as the message, used only once (1)', 'so every plaintext is equally likely – no patterns (1)', 'but securely distributing such long keys is impractical (1)']);
  K('C', 'C1 XOR', 'Calculate', 2, 'Calculate 1100 1010 XOR 1010 0110.', ['0110 1100 (2)']);
  K('C', 'C1 Steganography', 'Explain', 2, 'Explain what steganography is.', ['Hiding a message inside another file e.g. an image (1) so its existence is concealed (1)']);
  K('C', 'C1 Signatures', 'Describe', 3, 'Describe the role of encryption in creating a digital signature.', ['The sender creates a hash of the message (1)', 'encrypts the hash with their private key (1)', 'the receiver decrypts with the sender’s public key and compares hashes (1)']);
  K('C', 'C1 Certificates', 'Describe', 2, 'Describe the difference between a digital signature and a digital certificate.', ['A digital signature proves who sent a message and that it is unaltered (1)', 'a digital certificate is issued by a CA to prove the ownership of a public key/website identity (1)']);
  K('C', 'C1 Hashing', 'Explain', 2, 'Explain why passwords are stored as salted hashes.', ['Hashes are one-way so the password cannot be recovered (1); a salt makes identical passwords hash differently, defeating rainbow tables (1)']);
  K('C', 'C1 Hashing', 'Explain', 2, 'Explain why MD5 should not be used for security.', ['Collisions have been found – two inputs with the same hash (1) so attackers can forge data / it is too fast to resist brute force (1)']);

  /* D — evaluating */
  K('D', 'D1 TLS', 'Describe', 2, 'Describe what TLS is used for.', ['Encrypts data in transit between client and server (1) and authenticates the server using certificates (1)']);
  K('D', 'D1 TLS', 'Describe', 2, 'Describe the role of encryption in the TLS handshake.', ['Asymmetric encryption (server’s public key) is used to exchange/agree a session key securely (1)', 'the session key is then used for fast symmetric encryption of the data (1)']);
  K('D', 'D1 HTTPS', 'Describe', 2, 'Describe the relationship between TLS and HTTPS.', ['HTTPS is HTTP sent over a TLS-encrypted connection (1) so web pages and form data are encrypted (1)']);
  K('D', 'D1 VPN', 'Describe', 3, 'Describe how a VPN secures data moving between a student’s device and cloud storage.', ['Creates an encrypted tunnel (1)', 'data is encapsulated and encrypted (IPsec/TLS) (1)', 'so anyone intercepting on the home network/ISP cannot read it (1)']);
  K('D', 'D1 VPN', 'Explain', 2, 'Explain one disadvantage of using a VPN.', ['Encryption overhead and extra hops slow the connection (1) / licence and server costs (1)']);
  K('D', 'D1 VPN', 'Describe', 3, 'Describe how a user can check that their VPN client is working.', ['Client shows connected status (1)', 'public IP address shown on an IP-check site is the organisation’s/VPN server’s (1)', 'internal resources are reachable / leak test shows no DNS leaks (1)']);
  K('D', 'D1 Encryption at rest', 'Explain', 2, 'Explain the benefit of full disk encryption for staff laptops.', ['If a laptop is lost or stolen (1) data cannot be read without the key/password (1)']);
  K('D', 'D1 Key management', 'Explain', 2, 'Explain why key management is important.', ['If keys are lost data cannot be decrypted; if stolen encryption is useless (1) so keys must be stored securely, rotated and backed up (1)']);
  K('D', 'D2 Criteria', 'Explain', 2, 'Explain why scalability is important when choosing a security solution.', ['The organisation may grow or have peaks in users (1) so the solution must handle more users without major cost/redesign (1)']);
  KL('D', 'D2 Cloud', 'Evaluate', 9, 'Evaluate the implications of using cloud storage instead of a data server for a college’s assignment storage.', ['Access anywhere for distance learners; scalability at deadlines', 'Provider redundancy/backups vs own RAID/backups', 'Security: encryption in transit/at rest, MFA, provider certifications vs third-party control and GDPR data location', 'Cost: subscription vs hardware/staff', 'Reliance on internet; availability', 'Judgement']);
  KL('D', 'D1 Server', 'Evaluate', 9, 'A college stores data on a file server encrypted with AES-256. Evaluate the security of this approach and recommend improvements.', ['AES-256 strong at rest', 'Key management – where key is stored, who has access', 'Data in transit needs TLS/VPN', 'Access control, MFA, logging', 'Physical security, backups, patching', 'Judgement and recommendations']);
  KL('C', 'C1 Ciphers', 'Discuss', 9, 'Discuss how the Caesar substitution cipher has been developed into modern block ciphers such as AES.', ['Caesar: single shift, 25 keys, frequency analysis', 'Polyalphabetic and rotor machines increased complexity', 'Modern block ciphers: substitution boxes plus permutation over many rounds', 'Operate on bits/128-bit blocks, huge key space (2²⁵⁶)', 'Diffusion and confusion hide patterns', 'Still vulnerable to poor key management; judgement']);

  window.__BIZ_B = B;
})();
