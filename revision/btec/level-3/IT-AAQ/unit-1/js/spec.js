// AAQ 2025 Spec data — Unit 1 Learning Aims A–F (Issue 5, Nov 2025)
const SPEC = {
  A: {
    title: "Explore the concepts and implications of the use of, and relationships among devices that form IT systems",
    short: "Devices, peripherals, software, choosing systems, emerging technologies",
    topics: [
      { code: "A1", name: "Functions and use of digital devices, and notation used to design IT systems" },
      { code: "A1.1", name: "Features of digital devices: PCs, multifunctional devices, mobile devices, servers (file/app/web), entertainment systems, digital cameras (still/video), navigation systems, communication devices, embedded systems (sensors, IoT)" },
      { code: "A1.2", name: "Function and use of digital devices for: personal, education/training, social, retail, manufacturing, healthcare, creative tasks, automation/robotics" },
      { code: "A1.3", name: "Forms of notation used to design IT systems: network diagrams, flowcharts" },
      { code: "A2", name: "Peripheral devices and media" },
      { code: "A2.1", name: "Input/output/storage devices" },
      { code: "A2.2", name: "Assistive technologies (adaptive keyboards, screen readers, braille displays, magnifiers, head pointers, single-switch entry, foot switches, sip-and-puff, eye-tracking, text-to-speech)" },
      { code: "A2.3", name: "Storage characteristics: capacity, cost, speed, compatibility" },
      { code: "A2.4", name: "Data processing: manual, automatic" },
      { code: "A3", name: "Computer software in an IT system" },
      { code: "A3.1", name: "OS types: batch, distributed, multitasking, network OS, real-time, mobile, single-use, multi-user" },
      { code: "A3.2", name: "Role of OS: networking, security, memory mgmt, multi-tasking, device drivers, user accounts" },
      { code: "A3.3", name: "Types of software: utility, application" },
      { code: "A3.4", name: "Choice factors: cost, security, compatibility, features, business/user needs, performance" },
      { code: "A3.5", name: "User interface types: command line, menu-driven, GUI, touchscreen GUI" },
      { code: "A3.6", name: "Open source vs proprietary software" },
      { code: "A3.7", name: "File types/formats: images, audio, videos, application software" },
      { code: "A4", name: "Choosing IT systems" },
      { code: "A4.1", name: "Factors affecting choice: user needs, specs, compatibility, connectivity, cost, efficiency, implementation, productivity, security" },
      { code: "A4.2", name: "Features/implications for: stock control, data logging, data analysis, office, creative, advertising, manufacturing, security, automation" },
      { code: "A4.3", name: "Impact on UX, employee/customer needs, cost, implementation, replacement/integration, productivity, working practices, training, user support, security" },
      { code: "A5", name: "Emerging technologies and AI — impact on performance, personal use, organisational use" }
    ]
  },
  B: {
    title: "Transmitting data",
    short: "Connectivity, networks, transmission protocols, bandwidth, compression",
    topics: [
      { code: "B1", name: "Connectivity" },
      { code: "B1.1", name: "Wireless/wired methods: Bluetooth, USB, Wi-Fi, Ethernet" },
      { code: "B1.2", name: "Features meeting needs of individuals/organisations" },
      { code: "B1.3", name: "Implications of selecting/using different connection types" },
      { code: "B1.4", name: "Impact of connection types on system performance" },
      { code: "B2", name: "Networks" },
      { code: "B2.1", name: "Topologies: star, ring, bus" },
      { code: "B2.2", name: "Network types: PAN, LAN, WAN, VPN" },
      { code: "B2.3", name: "Choice factors: user needs, specs, connectivity, cost, efficiency, compatibility, implementation, productivity, security" },
      { code: "B2.4", name: "Features and performance" },
      { code: "B3", name: "Issues relating to transmission of data" },
      { code: "B3.1", name: "Protocols: SMTP, POP, IMAP; voice/video calls; HTTP, HTTPS; secure payment systems" },
      { code: "B3.2", name: "Security issues over different connection types/networks" },
      { code: "B3.3", name: "Bandwidth and latency" },
      { code: "B3.4", name: "File types/formats — implications" },
      { code: "B3.5", name: "Compression: lossy, lossless" },
      { code: "B3.6", name: "Codecs for audio/video" }
    ]
  },
  C: {
    title: "Operating online",
    short: "Cloud computing, remote working, online communities",
    topics: [
      { code: "C1", name: "Online systems" },
      { code: "C1.1", name: "Cloud models: private, public, hybrid; IaaS, SaaS, PaaS" },
      { code: "C1.2", name: "Impact and implications of cloud computing" },
      { code: "C1.3", name: "Remote working systems: VPNs, remote desktop technologies" },
      { code: "C1.4", name: "Selection factors: security, cost, ease of use, features, connectivity, scalability" },
      { code: "C2", name: "Online communities" },
      { code: "C2.1", name: "Communication methods: social media, blog/vlog, wiki, chatrooms, IM, podcasts, forums" },
      { code: "C2.2", name: "Considerations: UX, user needs, cost, privacy, security, downtime, training, integration, productivity, working practices" }
    ]
  },
  D: {
    title: "Protecting data and information",
    short: "Threats and protection — malware, hackers, encryption, antivirus, firewalls",
    topics: [
      { code: "D1", name: "Threats to data, information and systems" },
      { code: "D1.1", name: "External threats: viruses/malware, hackers/unauthorised access, accidental damage, social engineering, natural disasters" },
      { code: "D1.2", name: "Internal threats: inappropriate websites, accidental disclosure, stealing/leaking, portable devices" },
      { code: "D1.3", name: "Impact: loss of data, financial loss (legal action), loss of customers (public image)" },
      { code: "D2", name: "Protecting data" },
      { code: "D2.1", name: "Techniques: file permissions, access levels, backup/recovery, passwords/MFA, biometrics, physical access control, digital certificates" },
      { code: "D2.2", name: "Antivirus software — features and functions" },
      { code: "D2.3", name: "Firewalls — features and functions" },
      { code: "D2.4", name: "Encryption: stored data, data in transmission, HTTPS" }
    ]
  },
  E: {
    title: "Impact of using IT systems",
    short: "Online services, data manipulation, accuracy, UI design",
    topics: [
      { code: "E1", name: "Online services" },
      { code: "E1.1", name: "Features for: retail, financial services, education/training, news/info, entertainment/leisure, booking systems" },
      { code: "E1.2", name: "Uses/impact: transactional data, targeted marketing, collaborative working, remote working" },
      { code: "E2", name: "Using and manipulating data" },
      { code: "E2.1", name: "Sources of data: primary, secondary" },
      { code: "E2.2", name: "Methods of ensuring reliability of information" },
      { code: "E2.3", name: "Collection methods: survey, questionnaire, focus groups, interview" },
      { code: "E2.4", name: "Reasons for ensuring data accuracy" },
      { code: "E2.5", name: "Methods of ensuring accuracy: verification, validation" },
      { code: "E2.6", name: "UI characteristics: ease of use, accessibility, error reduction, functionality, performance, compatibility" }
    ]
  },
  F: {
    title: "Issues",
    short: "Moral, ethical and legal issues relating to IT use",
    topics: [
      { code: "F1", name: "Moral and ethical issues" },
      { code: "F1.1", name: "Privacy, environmental impact, unequal access, access to assistive tech, online behaviour/netiquette, acceptable use policies" },
      { code: "F2", name: "Legal issues" },
      { code: "F2.1", name: "Computer misuse legislation; copyright/designs/patents; copyright (computer programs); H&S/DSE regs; data protection legislation" }
    ]
  }
};

const COMMAND_VERBS = ["State", "Give", "Identify", "Name", "Describe", "Explain", "Discuss", "Evaluate", "Draw"];
const MARKS_OPTIONS = [1, 2, 3, 4, 6, 8, 9, 12];
