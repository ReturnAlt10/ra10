"""Diagram questions for Unit 2 — writes diagrams.json (concatenated onto QUESTIONS in data-loader).

Real Unit 2 exam papers give the candidate an INCOMPLETE diagram (a "Figure")
and ask them to COMPLETE it / add specific element(s) — NOT draw from scratch
(see Pearson AAQ Unit 2 SAM: BCTAA "Complete the network diagram (Figure 1) by adding...").

So each item carries:
  - `figure` : the incomplete diagram (with a '??' placeholder), shown to the candidate.
  - `mermaid`: the COMPLETE diagram — the model answer shown in the mark scheme.
"""
import json, os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def save(name, data):
    with open(os.path.join(BASE, name), 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)


def complete(qid, aim, topic, verb, marks, scenario, question, figure, mermaid,
             points, kind='diagram', instruction=None, additional=None):
    """A 'complete the diagram' question."""
    scheme = {
        'instruction': instruction or f'Award up to {marks} marks. Award marks for correctly completing/adding the required element(s) to the given diagram.',
        'points': points,
    }
    if additional:
        scheme['additional_guidance'] = additional
    out = {
        'id': qid, 'learning_aim': aim, 'topic': topic,
        'command_verb': verb, 'marks': marks, 'ao': 'AO2' if marks <= 4 else 'AO3',
        'scenario': scenario, 'question': question, 'guidance': f'({marks})',
        'type': 'diagram', 'diagram_kind': kind,
        'figure': figure,   # incomplete — shown to the candidate
        'mermaid': mermaid,  # complete — model answer
        'mark_scheme': scheme,
    }
    return out


DIAGRAMS = [
    # ─────────────────────────── A — threats ───────────────────────────
    complete('DIA001', 'A', 'A1.2 External threats — hacking (DoS/DDoS)', 'Complete', 4,
             '',
             'Figure 1 shows an incomplete diagram of a DDoS attack. Complete the diagram by adding the Command & Control (C2) server and drawing its connections to the compromised devices.',
             'flowchart LR\n  Attacker([Attacker]) --> GAP[??]\n  Device1[Compromised Device] --> Target[Target Server]\n  Device2[Compromised Device] --> Target\n  Device3[Compromised Device] --> Target\n  Target --> Down[Server Overwhelmed / Offline]',
             'flowchart LR\n  Attacker([Attacker]) --> C2[Command & Control Server]\n  C2 --> Device1[Compromised Device]\n  C2 --> Device2[Compromised Device]\n  C2 --> Device3[Compromised Device]\n  Device1 --> Target[Target Server]\n  Device2 --> Target\n  Device3 --> Target\n  Target --> Down[Server Overwhelmed / Offline]',
             ['Command & Control (C2) server correctly placed between attacker and devices (1)', 'Lines connecting C2 to each compromised device (1)', 'Botnet shown feeding traffic into the target server (1)', 'Target labelled as overwhelmed / offline (1)']),

    complete('DIA002', 'A', 'A1.2 External threats — hacking (MitM)', 'Complete', 4,
             '',
             'Figure 2 shows an incomplete diagram of a man-in-the-middle attack. Complete the diagram by adding the attacker and showing where the attacker sits in relation to the client and server.',
             'flowchart LR\n  Client([Client]) --> SERVER[Server]\n  Client -. "intended path" .-> SERVER',
             'flowchart LR\n  Client([Client]) --> Attacker([Attacker]) --> Server[Server]\n  Client -. "intended path (intercepted)" .-> Attacker',
             ['Attacker placed between client and server (1)', 'Client→attacker and attacker→server links both drawn (1)', 'Intercepted leg clearly labelled (1)', 'Logical, unambiguous flow (1)']),

    complete('DIA013', 'A', 'A4.1 Software and hardware security — firewalls', 'Complete', 4,
             'A network administrator must secure the boundary of the network.',
             'Figure 3 shows an incomplete network diagram. Complete the diagram by adding the firewall and drawing its connection between the internet and the internal network.',
             'flowchart LR\n  Internet[Internet] --> SWITCH[???]\n  SWITCH --> Server[Servers]\n  SWITCH --> PC[Workstations]',
             'flowchart LR\n  Internet[Internet] --> FW{Firewall}\n  FW --> Switch[Switch]\n  Switch --> Server[Servers]\n  Switch --> PC[Workstations]',
             ['Firewall drawn between the internet and the internal network (1)', 'Correct connection internet→firewall→switch (1)', 'Internal devices (servers/workstations) kept behind the firewall (1)', 'Clear boundary/protection implied (1)']),

    # ─────────────────────────── B — networking ───────────────────────────
    complete('DIA003', 'B', 'B1.2 Network topologies', 'Complete', 4,
             'A network administrator wants to document the office network.',
             'Figure 4 shows part of a star topology. Complete the diagram by adding the central switch and connecting all four workstations to it.',
             'flowchart TB\n  W1[Workstation 1]\n  W2[Workstation 2]\n  W3[Workstation 3]\n  W4[Workstation 4]',
             'flowchart TB\n  Switch[Central Switch] --- W1[Workstation 1]\n  Switch --- W2[Workstation 2]\n  Switch --- W3[Workstation 3]\n  Switch --- W4[Workstation 4]',
             ['Central switch added (1)', 'All four workstations connected to the switch (1)', 'Each device has its own dedicated link (no shared cable) (1)', 'Clean, labelled star structure (1)']),

    complete('DIA004', 'B', 'B1.2 Network topologies', 'Complete', 4,
             '',
             'Figure 5 shows four nodes A–D in an incomplete mesh topology. Complete the diagram by adding the missing redundant links so that every node connects directly to every other node.',
             'flowchart LR\n  A([Node A]) --- B([Node B])\n  A --- C([Node C])\n  A --- D([Node D])',
             'flowchart LR\n  A([Node A]) --- B([Node B])\n  A --- C([Node C])\n  A --- D([Node D])\n  B --- C\n  B --- D\n  C --- D',
             ['B→C link added (1)', 'B→D link added (1)', 'C→D link added (1)', 'Full mesh — every node links to every other (1)']),

    complete('DIA005', 'B', 'B1.4 Modern trends', 'Complete', 4,
             'A company uses firewalls and a VLAN strategy to isolate servers.',
             'Figure 6 shows an incomplete DMZ. Complete the diagram by adding the web server, placing it in the DMZ between the perimeter and internal firewalls.',
             'flowchart LR\n  Internet[Internet] --> FW1{Perimeter Firewall}\n  FW1 --> FW2{Internal Firewall}\n  FW2 --> Trusted[Trusted Internal Network]',
             'flowchart LR\n  Internet[Internet] --> FW1{Perimeter Firewall}\n  FW1 --> Web[Web Server]\n  Web --> FW2{Internal Firewall}\n  FW2 --> Trusted[Trusted Internal Network]\n  subgraph DMZ[DMZ]\n    Web\n  end',
             ['Web server placed between the two firewalls (1)', 'Correctly located inside the DMZ (1)', 'Perimeter firewall still protects from internet (1)', 'Internal firewall still shields trusted network (1)']),

    complete('DIA006', 'B', 'B1.4 Modern trends', 'Complete', 4,
             '',
             'Figure 7 shows a managed switch. Complete the diagram by adding three VLANs (Staff, Guests, Servers) and connecting them to the switch.',
             'flowchart TB\n  SW[Managed Switch]',
             'flowchart TB\n  SW[Managed Switch]\n  SW --> VLAN1[VLAN 10 - Staff]\n  SW --> VLAN2[VLAN 20 - Guests]\n  SW --> VLAN3[VLAN 30 - Servers]',
             ['VLAN 10 (Staff) added (1)', 'VLAN 20 (Guests) added (1)', 'VLAN 30 (Servers) added (1)', 'All three connected to the single managed switch (1)']),

    complete('DIA104', 'B', 'B3.1 TCP/IP model', 'Complete', 3,
             '',
             'Figure 8 shows the four-layer TCP/IP model with one layer missing. Complete the diagram by labelling the missing layer.',
             'flowchart TB\n  L4[Application] --> L3[???]\n  L3 --> L2[Internet]\n  L2 --> L1[Network Access]',
             'flowchart TB\n  L4[Application] --> L3[Transport]\n  L3 --> L2[Internet]\n  L2 --> L1[Network Access]',
             ['Missing layer identified as Transport (1)', 'Placed correctly between Application and Internet (1)', 'Recognised as carrying TCP/UDP (1)']),

    complete('DIA007', 'B', 'B3.1 TCP/IP model', 'Complete', 4,
             'A student must illustrate the layering of the TCP/IP model.',
             'Figure 9 shows the four TCP/IP layers in the correct order. Complete the diagram by labelling where TCP and IP operate.',
             'flowchart TB\n  L4[Application Layer] --> L3[Layer 3]\n  L3 --> L2[Layer 2]\n  L2 --> L1[Network Access Layer]',
             'flowchart TB\n  L4[Application Layer] --> L3[Transport Layer - TCP]\n  L3 --> L2[Internet Layer - IP]\n  L2 --> L1[Network Access Layer]',
             ['TCP correctly placed in the Transport layer (1)', 'IP correctly placed in the Internet layer (1)', 'Four distinct layers maintained in order (1)', 'Clear layering from Application down to Network Access (1)']),

    complete('DIA008', 'B', 'B3.4 DNS', 'Complete', 4,
             '',
             'Figure 10 shows an incomplete DNS resolution chain. Complete the diagram by adding the authoritative DNS server and the return of the IP address to the client.',
             'flowchart LR\n  Client([Client]) -->|"www.example.com"| Recursive[Recursive DNS Server]\n  Recursive --> AUTHORITATIVE[??]',
             'flowchart LR\n  Client([Client]) -->|"www.example.com"| Recursive[Recursive DNS Server]\n  Recursive --> Authoritative[Authoritative DNS Server]\n  Authoritative -->|"IP address"| Recursive\n  Recursive -->|"IP address"| Client',
             ['Authoritative DNS server added (1)', 'Recursive→authoritative query link drawn (1)', 'IP address returned from authoritative to recursive (1)', 'IP address returned from recursive to client (1)']),

    complete('DIA106', 'B', 'B3.5 DHCP', 'Complete', 4,
             '',
             'Figure 11 shows an incomplete DHCP exchange. Complete the diagram by adding the two missing messages (Request and Ack).',
             'sequenceDiagram\n  Client->>Server: DHCP Discover\n  Server-->>Client: DHCP Offer',
             'sequenceDiagram\n  Client->>Server: DHCP Discover\n  Server-->>Client: DHCP Offer\n  Client->>Server: DHCP Request\n  Server-->>Client: DHCP Ack',
             ['DHCP Request (client→server) added (1)', 'DHCP Ack (server→client) added (1)', 'Correct order Discover→Offer→Request→Ack (1)', 'Correct DORA sequence completed (1)']),

    # ─────────────────────────── C — documentation ───────────────────────────
    complete('DIA010', 'C', 'C1.3 Containment', 'Complete', 4,
             'A network is infected and the team must isolate the affected area.',
             'Figure 12 shows an infected server and other devices connected to a switch. Complete the diagram by adding the quarantine/block applied at the switch to isolate the infected server.',
             'flowchart LR\n  Infected[Infected Server] --> Switch[Switch]\n  Others[Other Devices] --> Switch',
             'flowchart LR\n  Infected[Infected Server] -->|"isolated"| Switch[Switch]\n  Others[Other Devices] --> Switch\n  Switch -->|"blocked"| Rest[Rest of Network]',
             ['Infected server marked as isolated (1)', 'Block applied at the switch for the infected server (1)', 'Legitimate devices still able to reach rest of network (1)', 'Clear containment of the infected host (1)']),

    complete('DIA011', 'C', 'C1.7 Business continuity', 'Complete', 4,
             'A business must illustrate its disaster recovery failover.',
             'Figure 13 shows a primary site and a secondary (DR) site. Complete the diagram by adding the replication link between the two sites and the failover path on failure.',
             'flowchart LR\n  Primary[Primary Site]\n  Secondary[Secondary Site / DR Site]\n  Users[Users] --> Primary',
             'flowchart LR\n  Primary[Primary Site] <-->|"real-time replication"| Secondary[Secondary Site / DR Site]\n  Users[Users] --> Primary\n  Users -. "on failure" .-> Secondary',
             ['Replication link between primary and secondary added (1)', 'Replication shown as continuous/real-time (1)', 'Failover path from users to secondary drawn (1)', 'Failover clearly triggered on failure (1)']),

    complete('DIA012', 'C', 'C1.1 Internal policies', 'Complete', 4,
             'An organisation is documenting its cyber security policy.',
             'Figure 14 shows the first two stages of the Plan-Do-Check-Act loop. Complete the diagram by adding the remaining stages and closing the loop.',
             'flowchart LR\n  Plan[Plan] --> Do[Do]',
             'flowchart LR\n  Plan[Plan] --> Do[Do]\n  Do --> Check[Check]\n  Check --> Act[Act]\n  Act --> Plan',
             ['Check stage added after Do (1)', 'Act stage added after Check (1)', 'Act loops back to Plan (1)', 'Continuous improvement loop completed (1)']),

    # ─────────────────────────── D — forensics ───────────────────────────
    complete('DIA009', 'D', 'D1.1 Forensic collection of evidence', 'Complete', 4,
             'A forensic investigator must document the process of collecting evidence.',
             'Figure 15 shows the first stage (Seize device) of the forensic collection process. Complete the diagram by adding the remaining stages in the correct order.',
             'flowchart LR\n  Seize[Seize device]',
             'flowchart LR\n  Seize[Seize device] --> Isolate[Isolate from network]\n  Isolate --> Image[Take forensic image]\n  Image --> Hash[Generate hash/checksum]\n  Hash --> Custody[Document chain of custody]',
             ['Isolate-from-network stage added (1)', 'Take-forensic-image stage added (1)', 'Generate-hash stage added (1)', 'Document-chain-of-custody stage added, correct order (1)']),

    complete('DIA108', 'D', 'D1.2 Pen testing', 'Complete', 4,
             '',
             'Figure 16 shows the first phase of a penetration test. Complete the diagram by adding the remaining phases in the correct order.',
             'flowchart LR\n  A[Engagement Scope]',
             'flowchart LR\n  A[Engagement Scope] --> B[Reconnaissance]\n  B --> C[Scanning and Enumeration]\n  C --> D[Exploitation]\n  D --> E[Post-Exploitation]\n  E --> F[Reporting and Debrief]',
             ['Reconnaissance phase added (1)', 'Scanning & enumeration phase added (1)', 'Exploitation and post-exploitation phases added (1)', 'Reporting/debrief completes the sequence (1)']),

    complete('DIA107', 'D', 'D2.1 IDS/IPS', 'Complete', 4,
             'A security architect must show where monitoring devices are placed.',
             'Figure 17 shows a firewall and a switch. Complete the diagram by adding the network-based IDS and its alert link to a SIEM.',
             'flowchart LR\n  Internet[Internet] --> FW{Firewall}\n  FW --> Switch\n  Switch --> Server[Servers]',
             'flowchart LR\n  Internet[Internet] --> FW{Firewall}\n  FW --> NIDS[NIDS]\n  NIDS --> Switch\n  Switch --> Server[Servers]\n  NIDS -. alerts .-> SIEM[SIEM]',
             ['NIDS placed inline/behind the firewall (1)', 'NIDS→SIEM alert link drawn (1)', 'Monitoring flow through the NIDS (1)', 'Clear placement of monitoring device (1)']),
]


def build():
    save('diagrams.json', DIAGRAMS)
    print(f'diagrams.json: {len(DIAGRAMS)} questions written')


if __name__ == '__main__':
    build()