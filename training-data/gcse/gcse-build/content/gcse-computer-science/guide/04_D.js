  /* ===== D · 1.4 Network security ===== */
  TITLE.D = 'Network security'; SUB.D = 'Paper 1 · forms of attack and how to prevent them';
  T.D = [
    { code: '1.4.1', name: 'Threats to computer systems and networks', html: () => `
${plain('Networks are attacked to <b>steal data</b> (to sell it or commit fraud), to <b>damage or disrupt</b> systems, to <b>demand money</b>, or simply to cause trouble. For every attack you need to know <b>how it works</b> and <b>what the attacker is trying to achieve</b>.')}
${table(['Attack', 'How it works', 'Purpose / effect'], [
  ['<b>Malware</b> (malicious software)', 'Software written to harm a computer, installed without the user knowing — often through email attachments, downloads or infected USB sticks. Types: <b>virus</b> (attaches to files and spreads when they are run), <b>worm</b> (copies itself across a network on its own), <b>trojan</b> (pretends to be useful software), <b>spyware</b> (secretly records activity such as key presses), <b>ransomware</b> (encrypts files and demands payment).', 'Delete or corrupt files, steal data (eg passwords), take control of the computer, lock files for ransom, slow the system down.'],
  ['<b>Social engineering</b>', 'Tricking <b>people</b> into giving away information or access — people are often the “weak point” in security. <b>Phishing</b>: fake emails/texts/websites that look genuine and ask the user to enter details or click a link. Others: phoning and pretending to be IT support (pretexting), shoulder surfing.', 'Obtain usernames, passwords, bank details; get the victim to install malware.'],
  ['<b>Brute-force attack</b>', 'Software tries <b>every possible combination</b> of passwords (or common words) until it finds the right one — trial and error.', 'Gain unauthorised access to an account.'],
  ['<b>Denial of service (DoS)</b>', 'Floods a server or network with so many requests that it cannot cope. A <b>DDoS</b> uses many computers at once.', 'Make a website or service <b>unavailable</b> to genuine users; lost business and reputation.'],
  ['<b>Data interception and theft</b>', 'Data travelling across a network is captured (eg with packet-sniffing software on an unsecured Wi-Fi network).', 'Read and steal private data such as passwords or card numbers.'],
  ['<b>SQL injection</b>', 'An attacker types <b>SQL code</b> into an input box on a website (eg a login form). If the input is not checked, the code becomes part of the database query and is run.', 'View, change or delete data in the database; bypass logins.']])}
${WG('sqli')}
${WG('brute')}
${exam('Describe how phishing is used to attack a network.', 2, 'An email/message is sent that pretends to be from a trusted organisation (1) asking the user to click a link and enter their personal details / password, which are then used by the attacker (1).')}` },

    { code: '1.4.2', name: 'Identifying and preventing vulnerabilities', html: () => `
${plain('No single method stops every attack, so organisations use <b>several layers of protection</b>. For each method, know <b>which threats it limits</b> and <b>how</b>.')}
${table(['Prevention method', 'How it works', 'Helps against'], [
  ['<b>Penetration testing</b>', 'The organisation pays (or uses its own) experts to <b>attack its own systems</b>, as a hacker would, to find weaknesses so they can be fixed before real attackers find them.', 'Finding vulnerabilities to any attack, eg SQL injection, weak passwords'],
  ['<b>Anti-malware software</b>', 'Scans files and programs and compares them with a database of known malware signatures (and watches for suspicious behaviour). It quarantines or deletes malware. Must be <b>updated</b> regularly.', 'Malware'],
  ['<b>Firewall</b>', 'Monitors data coming into and leaving a network and <b>blocks</b> anything that does not meet set rules (eg blocks certain ports or suspicious traffic).', 'Hackers, unauthorised access, some malware, some DoS traffic'],
  ['<b>User access levels</b>', 'Gives each user access only to the files and features they need for their job (eg read-only vs read/write).', 'Limits damage from insiders, accidental deletion, and stolen accounts'],
  ['<b>Passwords</b>', 'Strong passwords (long, mixed character types), changed when compromised; lock the account after several failed attempts; two-factor authentication.', 'Brute-force attacks, unauthorised access'],
  ['<b>Encryption</b>', 'Scrambles data with a key so it is meaningless if intercepted or stolen.', 'Data interception and theft'],
  ['<b>Physical security</b>', 'Locks, key cards, biometrics, CCTV, security guards, server rooms with no public access.', 'People stealing or tampering with hardware; shoulder surfing']])}
${tip('Prevent SQL injection with <b>input validation/sanitisation</b> (reject or clean characters such as quotes) and parameterised queries. Prevent social engineering with <b>staff training</b> — even the best firewall cannot stop someone handing over their password.', 'Matching attack → defence')}
${fig(S.tiles([['Malware', 'anti-malware, firewall, training', P.red], ['Phishing', 'staff training, spam filters', P.amber], ['Brute force', 'strong passwords, account lock-out', P.violet], ['DoS', 'firewall', P.blue], ['Interception', 'encryption', P.teal], ['SQL injection', 'validation, penetration testing', P.green]], { cols: 3, th: 64, label: 'Threats and defences' }), 'Common pairings that earn marks — but always explain HOW the method helps.')}
${exam('Explain how a firewall helps protect a network.', 2, 'A firewall monitors incoming and outgoing traffic (1) and blocks any traffic that does not meet the rules set for the network, so unauthorised access is prevented (1).')}
${exam('A company stores customers’ details. Describe two methods the company could use to reduce the risk of a brute-force attack.', 4, 'Require strong passwords (1) that are long and use a mix of letters, numbers and symbols, so there are too many combinations to try (1). Lock the account after a set number of failed attempts (1) so the attacker cannot keep trying combinations (1).')}` }
  ];
