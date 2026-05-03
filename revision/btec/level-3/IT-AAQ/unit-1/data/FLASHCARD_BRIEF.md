# Flashcard Generation Brief — BTEC IT Unit 1 (AAQ 2025 Spec)

You are generating revision flashcards for BTEC Level 3 IT Unit 1: Information Technology Systems, fully aligned with the **AAQ 2025 spec (Pearson, Issue 5, November 2025)**. The student is preparing for May/June 2026 first assessment.

## Hard requirements

1. Output a **single valid JSON file** (UTF-8) — array of **150 flashcard objects**.
2. **DO NOT** wrap output in markdown code fences. Write raw JSON only.
3. Save to: `/home/user/workspace/btec-tool/data/flashcards.json`
4. Cover **all six Learning Aims (A–F)** with roughly equal coverage (25 cards per aim).
5. Cards must be focused on **definitions, key terms, examples, and quick-recall facts** — the kind of content a student would write on paper flashcards.

## Schema

```json
{
  "id": "FC001",
  "learning_aim": "A",
  "topic": "A1.1.4 Servers",
  "front": "What is a file server?",
  "back": "A server that provides centralised storage of files, allowing multiple users on a network to access, save, and share data from a single location. Benefits include shared access, centralised backup, and controlled permissions.",
  "tags": ["hardware", "servers", "networks"]
}
```

## Style rules

- **Front:** A short question, term to define, or "What is X?" / "Give two examples of Y" / "What does the abbreviation X stand for?"
- **Back:** A clear, concise answer (1-3 sentences max). Include 2-3 short bullet examples where appropriate, separated with " • " or written as a short list.
- Mix of card types:
  - **Definitions** ("What is a VPN?")
  - **Acronyms** ("What does GDPR stand for?")
  - **Examples** ("Give three types of biometric authentication.")
  - **Compare/contrast** ("Difference between LAN and WAN?")
  - **Process recall** ("Three stages of a hacking attack?")
  - **Legislation** ("Which Act protects against unauthorised access to a computer system?")

- Answers must be FACTUALLY CORRECT and aligned to Pearson terminology in the AAQ spec.

## Coverage per aim (25 cards each)

### Aim A — Devices that form IT systems
A1 features of digital devices (PCs, multifunctional, mobile, servers, entertainment, cameras, navigation, communication, embedded/IoT)
A1 use of devices (personal, education, social, retail, manufacturing, healthcare, creative, automation/robotics)
A1 notation (network diagrams, flowcharts symbols)
A2 peripheral devices and media (input, output, storage, virtual)
A3 software (system, applications, utility, choosing software)
A4 emerging technologies (AI, AR/VR, smart devices)
A5 selecting and configuring IT systems

### Aim B — Transmitting data
B1 connectivity (wired, wireless, mobile, satellite)
B1 networks (LAN, WAN, PAN, types of network)
B1 transmission protocols (TCP/IP, HTTP, HTTPS, FTP, SMTP, etc.)
B2 bandwidth requirements
B3 compression (lossy/lossless), codecs, file formats

### Aim C — Operating online
C1 cloud computing (private/public/hybrid; SaaS/PaaS/IaaS)
C1 remote working / VPNs
C2 online communities (forums, social media, wikis, instant messaging, blogs, vlogs, podcasts)
C2 implications for individuals and organisations

### Aim D — Protecting data and information
D1 threats (malware types, phishing, social engineering, hackers, unsecured wireless, accidental damage)
D1 protection (firewalls, antivirus, encryption, authentication, biometrics, backup)
D2 user access restrictions, file permissions, audit logs, physical security

### Aim E — Impact of using IT systems
E1 online services (e-commerce, banking, education, entertainment, communication, gaming, news/info, social, transactional data uses)
E1 implications for organisations and individuals
E2 data manipulation tools (spreadsheets, databases), data accuracy/validation/verification, presenting data, UI design

### Aim F — Issues
F1 moral/ethical issues (privacy, monitoring, environment, freedom of speech, censorship, behavioural)
F1 acceptable use policies
F2 legislation: Data Protection Act 2018, UK GDPR, Computer Misuse Act 1990, Copyright Designs and Patents Act 1988, Equality Act 2010, Health and Safety regulations, Freedom of Information Act 2000

## Validation checklist
- 150 objects exactly
- Sequential IDs FC001–FC150
- Each card: id, learning_aim, topic (with spec code), front, back, tags
- All 6 aims covered, ~25 each
- Facts verified against the AAQ 2025 spec
- No duplicates of the same definition
