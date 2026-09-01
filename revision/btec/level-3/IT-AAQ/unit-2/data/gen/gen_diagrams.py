"""Diagram questions for Unit 2 — writes diagrams.json (concatenated onto QUESTIONS in data-loader).
Each diagram question: type 'diagram', diagram_kind, mermaid (model answer).
Figure-"show" questions use 'figure' (mermaid shown to the candidate).
"""
from common import load, save


def diag(qid, aim, topic, verb, marks, scenario, question, mermaid, kind='diagram', figure=None, points=None):
    scheme = {'instruction': f'Award up to {marks} marks. Award marks for accurate labelling and clear, correct structure.', 'points': points or ['Correct overall structure and relationships', 'Accurate and relevant labels', 'Clear, logical presentation']}
    out = {
        'id': qid, 'learning_aim': aim, 'topic': topic,
        'command_verb': verb, 'marks': marks, 'ao': 'AO2' if marks <= 4 else 'AO3',
        'scenario': scenario, 'question': question, 'guidance': f'({marks})',
        'type': 'diagram', 'diagram_kind': kind, 'mermaid': mermaid, 'mark_scheme': scheme,
    }
    if figure:
        out['figure'] = figure
    return out


DIAGRAMS = [
    # ---- A1 Network attack sequence ----
    diag('DIA001', 'A', 'A1.4 Network attacks', 'Draw', 4,
         'A technician must explain a DDoS attack to non-technical staff.',
         'Draw a diagram showing how a DDoS attack works using a botnet to overwhelm a target server by traffic from many compromised devices.',
         'flowchart LR\n  Attacker([Attacker]) --> C2[Command & Control Server] --> Device1[Compromised Device]\n  C2 --> Device2[Compromised Device]\n  C2 --> Device3[Compromised Device]\n  Device1 --> Target[Target Server]\n  Device2 --> Target\n  Device3 --> Target\n  Target --> Down[Server Overwhelmed / Offline]',
         kind='network diagram'),
    diag('DIA002', 'A', 'A1.4 Network attacks', 'Draw', 4,
         '',
         'Draw a diagram to illustrate a man-in-the-middle attack, showing where the attacker sits between the client and the server.',
         'flowchart LR\n  Client([Client]) <--> Attacker([Attacker]) <--> Server[Server]\n  Client -. "believes direct" .-> Server',
         kind='network diagram'),
    # ---- B1 Topology ----
    diag('DIA003', 'B', 'B1.2 Network topologies', 'Draw', 4,
         'A network administrator wants to document the office network.',
         'Draw a star topology showing a central switch connected to four workstations.',
         'flowchart TB\n  Switch[Central Switch] --- W1[Workstation 1]\n  Switch --- W2[Workstation 2]\n  Switch --- W3[Workstation 3]\n  Switch --- W4[Workstation 4]',
         kind='topology diagram'),
    diag('DIA004', 'B', 'B1.2 Network topologies', 'Draw', 4,
         '',
         'Draw a mesh topology showing four devices interconnected with redundant links.',
         'flowchart LR\n  A([Node A]) --- B([Node B])\n  A --- C([Node C])\n  A --- D([Node D])\n  B --- C\n  B --- D\n  C --- D',
         kind='topology diagram'),
    diag('DIA005', 'B', 'B1.4 Modern trends', 'Draw', 4,
         'A company uses firewalls and a VLAN strategy to isolate servers.',
         'Draw a network segmentation diagram showing a demilitarised zone (DMZ) between the internet, web server and the internal trusted network.',
         'flowchart LR\n  Internet[Internet] --> FW1{Perimeter Firewall}\n  FW1 --> Web[Web Server in DMZ]\n  FW1 --> FW2{Internal Firewall}\n  FW2 --> Trusted[Trusted Internal Network]\n  DMZ[DMZ] --- Web',
         kind='network diagram'),
    # ---- B2 VLAN segmentation ----
    diag('DIA006', 'B', 'B1.4 Modern trends', 'Draw', 4,
         '',
         'Draw a diagram showing how VLANs segment traffic between workstations and servers.',
         'flowchart TB\n  SW[Managed Switch]\n  SW --> VLAN1[VLAN 10 - Staff]\n  SW --> VLAN2[VLAN 20 - Guests]\n  SW --> VLAN3[VLAN 30 - Servers]',
         kind='logical diagram'),
    # ---- B3 TCP/IP / OSI layering ----
    diag('DIA007', 'B', 'B3.1 TCP/IP model', 'Draw', 4,
         'A student must illustrate the layering of the TCP/IP model.',
         'Draw the four-layer TCP/IP model and label the position of TCP and IP.',
         'flowchart TB\n  L4[Application Layer]\n  L3[Transport Layer - TCP]\n  L2[Internet Layer - IP]\n  L1[Network Access Layer]\n  L4 --> L3 --> L2 --> L1',
         kind='diagram'),
    # ---- B3 DNS ----
    diag('DIA008', 'B', 'B3.4 DNS', 'Draw', 4,
         '',
         'Draw a diagram showing DNS resolution from a client to a recursive DNS server and onward to an authoritative server.',
         'flowchart LR\n  Client([Client]) -->|"www.example.com"| Recursive[Recursive DNS Server]\n  Recursive --> Authoritative[Authoritative DNS Server]\n  Authoritative -->|"IP address"| Recursive\n  Recursive --> Client',
         kind='sequence diagram'),
    # ---- C1 Incident response lifecycle ----
    diag('DIA009', 'C', 'C1.1 Incident Response Lifecycle', 'Draw', 6,
         'An incident response team must explain the phases of responding to an incident.',
         'Draw the NIST incident response lifecycle showing preparation, detection/analysis, containment/eradication/recovery and post-incident activity.',
         'flowchart LR\n  P[Preparation] --> D[Detection & Analysis] --> C[Containment Eradication & Recovery]\n  C --> A[Post-Incident Activity]\n  A --> P',
         kind='lifecycle diagram'),
    diag('DIA010', 'C', 'C1.3 Containment', 'Draw', 4,
         'A network is infected and the team must isolate the affected area.',
         'Draw a diagram showing how network segmentation/containment isolates an infected server from the rest of the network at the switch/firewall.',
         'flowchart LR\n  Infected[Infected Server] -->|"isolated"| Switch\n  Others[Other Devices] --> Switch\n  Switch --> FW{Quarantine}\n  FW -->|"blocked"| Rest[Rest of Network]',
         kind='network diagram'),
    # ---- C1 BCP/DR ----
    diag('DIA011', 'C', 'C1.7 Business continuity', 'Draw', 4,
         'A business must illustrate its disaster recovery failover.',
         'Draw a diagram showing primary and secondary (failover) sites with replication between them.',
         'flowchart LR\n  Primary[Primary Site] <-->|"real-time replication"| Secondary[Secondary Site / DR Site]\n  Users[Users] --> Primary\n  Users -. "on failure" .-> Secondary',
         kind='system diagram'),
    # ---- D1 penetration testing phases ----
    diag('DIA012', 'D', 'D1.2 Pen testing', 'Draw', 4,
         '',
         'Draw the phases of a penetration test from reconnaissance to reporting.',
         'flowchart LR\n  R[Reconnaissance] --> S[Scanning]\n  S --> E[Exploitation]\n  E --> PE[Post-Exploitation]\n  PE --> Rep[Reporting]',
         kind='process diagram'),
    # ---- D2 monitoring/IDS ----
    diag('DIA013', 'D', 'D2.1 IDS/IPS', 'Draw', 4,
         '',
         'Draw where a network-based intrusion detection system is placed on a network and how it monitors traffic.',
         'flowchart LR\n  Internet[Internet] --> FW{Firewall}\n  FW --> NIDS[NIDS - sensor]\n  NIDS --> Switch\n  Switch --> Server[Servers]\n  NIDS -. alerts .-> SIEM[SIEM / Console]',
         kind='network diagram'),

    # ---- Figure (show) questions ----
    diag('DIA101', 'A', 'A1.4 Network attacks', 'Identify', 3,
         '',
         'The Figure shows a man-in-the-middle attack. Identify the party intercepting the communication.',
         None, kind='diagram',
         figure='flowchart LR\n  A([Client]) --> M([Attacker]) --> B[Server]\n  A -. "intended path" .-> B',
         points=['The attacker between the client and server intercepts and can read/alter the data (3)']),
    diag('DIA102', 'B', 'B1.2 Network topologies', 'Describe', 4,
         '',
         'The Figure shows a star topology. Describe its key feature and one advantage for security.',
         None, kind='diagram',
         figure='flowchart TB\n  C[Central Switch] --- A[Device A]\n  C --- B[Device B]\n  C --- D[Device D]\n  C --- E[Device E]',
         points=['All devices connect to a central switch (1)', 'Failure of one device/cable does not affect others (1)', 'Central point enables centralised management and monitoring (2)']),
    diag('DIA103', 'C', 'C1.1 Incident Response Lifecycle', 'Identify', 2,
         '',
         'The Figure shows the four phases of the NIST incident response lifecycle. Identify the phase that comes immediately after Preparation.',
         None, kind='diagram',
         figure='flowchart LR\n  P[Preparation] --> D[Detection & Analysis] --> C[Containment / Eradication / Recovery] --> A[Post-Incident Activity]\n  A --> P',
         points=['Detection & Analysis is the next phase after Preparation (2)']),
    diag('DIA104', 'B', 'B3.1 TCP/IP model', 'Label', 3,
         '',
         'The Figure shows the four-layer TCP/IP model with one layer missing its label. State the missing layer.',
         None, kind='diagram',
         figure='flowchart TB\n  L4[Application]\n  L3[???]\n  L2[Internet]\n  L1[Network Access]\n  L4 --- L3 --- L2 --- L1',
         points=['The missing layer is the Transport layer (which carries TCP/UDP) (3)']),
    # ---- additional diagrams ----
    diag('DIA105', 'B', 'B1.2 Network topologies', 'Draw', 4,
         '',
         'Draw an extended-star topology showing a central switch connected to two further switches, each serving workstations.',
         'flowchart TB\n  Core[Core Switch] --- S1[Switch 1]\n  Core --- S2[Switch 2]\n  S1 --- W1[Workstation]\n  S1 --- W2[Workstation]\n  S2 --- W3[Workstation]\n  S2 --- W4[Workstation]',
         kind='topology diagram'),
    diag('DIA106', 'B', 'B3.5 DHCP', 'Draw', 4,
         '',
         'Draw the DHCP DORA process showing the four messages between a client and a server.',
         'sequenceDiagram\n  Client->>Server: DHCP Discover\n  Server-->>Client: DHCP Offer\n  Client->>Server: DHCP Request\n  Server-->>Client: DHCP Ack',
         kind='sequence diagram'),
    diag('DIA107', 'D', 'D2.1 IDS/IPS', 'Draw', 4,
         'A security architect must show where monitoring devices are placed.',
         'Draw a diagram showing a firewall, a network-based IDS and a SIEM, and how they connect.',
         'flowchart LR\n  Internet[Internet] --> FW{Firewall}\n  FW --> NIDS[NIDS]\n  NIDS --> Switch\n  Switch --> Server[Servers]\n  NIDS -. alerts .-> SIEM[SIEM]',
         kind='network diagram'),
    diag('DIA108', 'D', 'D1.2 Pen testing', 'Draw', 4,
         '',
         'Draw the stages of a penetration test as a structured flowchart.',
         'flowchart LR\n  A[Engagement Scope] --> B[Reconnaissance]\n  B --> C[Scanning and Enumeration]\n  C --> D[Exploitation]\n  D --> E[Post-Exploitation]\n  E --> F[Reporting and Debrief]',
         kind='process diagram'),
    diag('DIA109', 'C', 'C1.3 Containment', 'Draw', 4,
         'A response team must illustrate how a compromised host is isolated.',
         'Draw a diagram showing a rogue host being quarantined by a switch so it cannot reach the rest of the network.',
         'flowchart LR\n  Host[Compromised Host] -->|"port shutdown"| Switch[Managed Switch]\n  Switch -->|"allowed"| Legit[Legitimate Devices]\n  Switch -->|"blocked"| Rest[Rest of Network]',
         kind='network diagram'),
]


def build():
    save('diagrams.json', DIAGRAMS)
    print(f'diagrams.json: {len(DIAGRAMS)} questions written')


if __name__ == '__main__':
    build()