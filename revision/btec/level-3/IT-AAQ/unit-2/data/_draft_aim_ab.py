"""Generate accurate, spec-aligned extra questions for Unit 2 — Aims A & B.
Appends to aim_A.json and aim_B.json. Does NOT overwrite existing data.
"""
import json, os

BASE = os.path.dirname(os.path.abspath(__file__))


def load(name):
    p = os.path.join(BASE, name)
    if os.path.exists(p):
        with open(p, encoding='utf-8') as f:
            return json.load(f)
    return []


def short(qid, aim, topic, verb, marks, text, q, guidance, points, additional='', figure=None, mermaid_model=None):
    out = {
        'id': qid, 'learning_aim': aim, 'topic': topic,
        'command_verb': verb, 'marks': marks, 'ao': 'AO1' if marks <= 2 else ('AO2' if marks <= 4 else 'AO3'),
        'scenario': text, 'question': q,
        'guidance': guidance, 'type': 'short',
        'mark_scheme': {'instruction': f'Award up to {marks} marks.', 'points': points}
    }
    if additional:
        out['mark_scheme']['additional_guidance'] = additional
    if figure:
        out['figure'] = figure
    if mermaid_model:
        out['type'] = 'diagram'
        out['mermaid'] = mermaid_model
        out['diagram_kind'] = 'diagram'
    return out


A_EXTRA = [
    # ---- A1.1 Threat actors (continue from A039) ----
    short('A040', 'A', 'A1.1 Threat actors', 'Describe', 3,
          'A school IT technician reports a series of minor defacements to the school website coinciding with a popular student campaign.',
          'Describe the most likely type of threat actor responsible and their typical motivation.',
          '(3)',
          ['A script kiddie is likely responsible — an inexperienced individual who uses pre-written tools/scripts downloaded from the internet rather than creating their own (1)',
           'Script kiddies are often motivated by notoriety, peer recognition or simply to prove they can (1)',
           'Their attacks are usually low-skill, such as website defacement using known exploits, but can still cause disruption and reputational damage (1)'],
          'Accept: hacktivist if the campaign has a clear political/social message; reject simply "hacker".'),
    short('A041', 'A', 'A1.1 Threat actors', 'Explain', 4,
          'A national bank has detected a long-running intrusion during which encrypted customer records were copied over several months. Security experts believe a nation state is involved.',
          'Explain why the attack is consistent with a state-sponsored Advanced Persistent Threat (APT).',
          '(4)',
          ['The attacker remained undetected within the network for months (persistence/dwell time), characteristic of an APT (1)',
           'The high level of resources and advanced tools needed to compromise and stay inside a major bank points to a well-funded actor such as a nation state (1)',
           'The targeting of encrypted, highly sensitive financial data suggests espionage rather than immediate financial gain (1)',
           'State-sponsored actors are typically highly organised, patient and focused on specific high-value targets over the long term (1)']),
    short('A042', 'A', 'A1.1 Threat actors', 'Compare', 4,
          'Both cyber criminals and hacktivists have attacked the same retail company. The cyber criminals encrypted data for ransom; the hacktivists defaced the website.',
          'Compare the motivations and likely targets of cyber criminals and hacktivists.',
          '(4)',
          ['Cyber criminals are primarily financially motivated — seeking money via ransomware, fraud or selling stolen data (1)',
           'Hacktivists are ideologically/politically motivated, seeking to promote a cause or expose perceived wrongdoing (1)',
           'Cyber criminals often target organisations based on their ability to pay and value of data, regardless of ideology (1)',
           'Hacktivists typically target organisations associated with the issue they campaign about, aiming for publicity more than profit (1)']),
    short('A043', 'A', 'A1.1 Threat actors', 'Justify', 3,
          'A retail firm has suffered repeated low-skill attacks using publicly available tools, mainly around product launches.',
          'Justify why an insider threat is a less likely cause of these attacks than an external script kiddie.',
          '(3)',
          ['The use of publicly available pre-written tools indicates a lower level of skill consistent with a script kiddie rather than an insider who already has legitimate access (1)',
           'The timing around product launches suggests seeking notoriety rather than the insider knowledge a genuine insider would use to cause targeted damage (1)',
           'An insider threat would more likely exploit their legitimate credentials or access privileges rather than relying on external exploit scripts (1)']),

    # ---- A1.2 Malware ----
    short('A044', 'A', 'A1.2 Malware types', 'Describe', 3,
          'Detectives recovered data from a suspected criminal’s laptop. During analysis, software was found that operated covertly and recorded every key pressed by the user.',
          'Describe how this type of malware, a keylogger, compromises an organisation’s security.',
          '(3)',
          ['A keylogger records every keystroke made by the user, including usernames and passwords (1)',
           'The harvested credentials can be sent to the attacker and used to access accounts or systems (1)',
           'This bypasses password-based authentication because the attacker obtains valid credentials rather than guessing them (1)']),
    short('A045', 'A', 'A1.2 Malware types', 'State', 2,
          '',
          'State two characteristics of a Trojan horse.',
          '(2)',
          ['It appears to be legitimate software but contains malicious code (1)',
           'It requires a user to install or run the disguised program before it activates (1)'],
          'Accept: "masquerades as/pretends to be legitimate", "needs user action to execute".'),
    short('A046', 'A', 'A1.2 Malware types', 'Explain', 4,
          'A logistics company found that a worm has spread across its local network without any users opening attachments.',
          'Explain how a worm differs from a virus and why it can spread so rapidly across a network.',
          '(4)',
          ['A worm self-replicates and spreads automatically across networks, whereas a virus requires a host file and user action to run (1)',
           'A worm can propagate over network connections by exploiting vulnerabilities or using open shares (1)',
           'Because it needs no human interaction, it can infect hundreds of devices very quickly across the network (1)',
           'This rapid automated spread can overwhelm network resources and make containment difficult (1)']),
    short('A047', 'A', 'A1.2 Malware types', 'Describe', 2,
          '',
          'Describe what a logic bomb is.',
          '(2)',
          ['It is malicious code planted in a system that lies dormant until a specific condition or trigger is met (1)',
           'When triggered (e.g. a date, event or command), the code executes a harmful action such as deleting files (1)']),
    short('A048', 'A', 'A1.2 Malware types', 'Explain', 4,
          'A marketing agency’s machines are slowing dramatically and showing many pop-up adverts, though no files appear encrypted.',
          'Explain why these symptoms are consistent with adware rather than ransomware.',
          '(4)',
          ['Adware displays unwanted adverts, causing slowdown and pop-ups, without encrypting files (1)',
           'Ransomware encrypts a victim’s data and demands payment, which has not occurred here (1)',
           'The lack of encryption demands indicates the impact is disruption and data collection (adware often tracks browsing) rather than data held hostage (1)',
           'Adware is less destructive but still a security/privacy risk and can slow systems and act as a gateway for more serious malware (1)']),

    # ---- A1.3 Social engineering ----
    short('A049', 'A', 'A1.3 Social engineering', 'Explain', 4,
          'A finance employee received an email appearing to be from their CEO urgently requesting a transfer of £20,000 to a new supplier account.',
          'Explain why this is a spear-phishing/whaling attack and how it exploits human trust.',
          '(4)',
          ['Spear-phishing targets a specific individual; whaling specifically targets a senior figure (here impersonating the CEO) (1)',
           'Urgency and authority pressure the victim to act quickly without verification (1)',
           'It exploits the human tendency to trust messages that appear to come from a recognised senior colleague (1)',
           'Bypassing technical controls relies on the victim complying, so awareness training and verification procedures are key defences (1)']),
    short('A050', 'A', 'A1.3 Social engineering', 'Describe', 2,
          '',
          'Describe the difference between phishing and smishing.',
          '(2)',
          ['Phishing is carried out via email (or fake websites) to trick users into revealing information (1)',
           'Smishing uses SMS/text messages for the same purpose (1)']),
    short('A051', 'A', 'A1.3 Social engineering', 'Explain', 3,
          'A caller rang an employee claiming to be from the IT helpdesk needing their password to "investigate a security problem".',
          'Explain how vishing works and why it can bypass email-based protections.',
          '(3)',
          ['Vishing (voice phishing) uses phone calls to trick victims into revealing sensitive information (1)',
           'Attackers impersonate a trusted contact, such as IT support, to sound legitimate (1)',
           'It bypasses email filters because it does not rely on email at all, so organisations must train staff to verify by a different channel (1)']),
    short('A052', 'A', 'A1.3 Social engineering', 'State', 2,
          '',
          'State two examples of baiting attacks.',
          '(2)',
          ['Leaving infected USB drives in a car park hoping someone plugs one in (1)',
           'Offering a free download or gift that installs malware when accessed (1)'],
          'Accept any two valid baiting/social-engineering examples.'),
    short('A053', 'A', 'A1.3 Social engineering', 'Describe', 3,
          '',
          'Describe how shoulder surfing and tailgating compromise physical security.',
          '(3)',
          ['Shoulder surfing involves observing someone entering a password or viewing sensitive information over their shoulder (1)',
           'Tailgating involves following an authorised person through a secure door without using own credentials (1)',
           'Both bypass technical access controls and rely on human behaviour, so privacy filters and challenge policies help mitigate them (1)']),

    # ---- A1.4 Network attacks ----
    short('A054', 'A', 'A1.4 Network attacks', 'Explain', 4,
          'An online shop has gone offline repeatedly during a promotional sale, and network logs show enormous volumes of traffic from thousands of different IP addresses.',
          'Explain why this is a DDoS attack and the impact it has on the business.',
          '(4)',
          ['A DDoS (distributed denial-of-service) attack floods a server with huge traffic from many compromised devices (a botnet), overwhelming it (1)',
           'The flood exhausts resources so legitimate customers cannot access the site (1)',
           'This causes lost sales/revenue during the promotion (1)',
           'It also damages reputation and customer trust and may require costly mitigation services to resolve (1)']),
    short('A055', 'A', 'A1.4 Network attacks', 'Describe', 3,
          '',
          'Describe how a man-in-the-middle (MITM) attack can intercept data.',
          '(3)',
          ['The attacker positions themselves between the sender and receiver, often on an insecure network (1)',
           'They intercept and can read or alter data flowing between the two parties without either knowing (1)',
           'This compromises confidentiality (and integrity if altered), so encrypted connections (HTTPS/TLS) are used to prevent it (1)']),
    short('A056', 'A', 'A1.4 Network attacks', 'Explain', 3,
          'An attacker redirects users typing a legitimate website address to a fake site by corrupting the translation of the domain name.',
          'Explain what is happening and how DNSSEC helps protect against it.',
          '(3)',
          ['This is DNS poisoning/spoofing — corrupting DNS resolution so requests go to a malicious IP instead of the real site (1)',
           'Users are directed to a fake site where credentials can be stolen (1)',
           'DNSSEC uses digital signatures to verify DNS responses are authentic, preventing tampering with resolution (1)']),
    short('A057', 'A', 'A1.4 Network attacks', 'Describe', 2,
          '',
          'Describe what packet sniffing is on a network.',
          '(2)',
          ['Packet sniffing is capturing and inspecting data packets travelling across a network (1)',
           'On an unencrypted network it can reveal usernames, passwords and other sensitive data, so encryption mitigates the risk (1)']),

    # ---- A1.5 Web application attacks ----
    short('A058', 'A', 'A1.5 Web application attacks', 'Explain', 4,
          'An attacker is able to retrieve entire customer records from a website by entering malicious input into a search box.',
          'Explain how SQL injection works and why it is dangerous.',
          '(4)',
          ['SQL injection inserts malicious SQL code into user input that is appended to a database query (1)',
           'If the input is not sanitised/parameterised, the database executes the malicious commands (1)',
           'This can allow the attacker to read, modify or delete entire tables of data such as customer records (1)',
           'Defences include input validation, using parameterised queries/prepared statements and least-privilege database accounts (1)']),
    short('A059', 'A', 'A1.5 Web application attacks', 'Describe', 3,
          '',
          'Describe how cross-site scripting (XSS) can be used to steal a user’s session.',
          '(3)',
          ['XSS injects malicious client-side script (usually JavaScript) into a website viewed by other users (1)',
           'The script can read cookies, session tokens or other data in the victim’s browser (1)',
           'Stolen session tokens can be used to impersonate the victim (session hijacking) (1)'],
          'Note: corrected from "XSS" to "XSS" in full data.'),
    short('A060', 'A', 'A1.5 Web application attacks',  'Describe' as_int,) if False else None,
]


if __name__ == '__main__':
    a = load('aim_A.json')
    a_ids = set(q['id'] for q in a) if hasattr(q2) else set(q['id'] for q in a)
    # placeholder — see write_aims module