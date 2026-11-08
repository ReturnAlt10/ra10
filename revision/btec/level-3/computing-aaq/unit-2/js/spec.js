/* BTEC AAQ Unit 2: Computer Network Security and Encryption — content areas from the Pearson specification. */
(function () {
  'use strict';
  window.LEARNING_AIMS = ["A", "B", "C", "D"];
  window.SPEC = {
 "A": {
  "title": "Computer networks",
  "short": "The main challenges of computer network security, with reference to the threats included in Section B; The main components of computer networks; Software compon",
  "topics": [
   {
    "code": "A1",
    "name": "The main challenges of computer network security, with reference to the threats included in Section B"
   },
   {
    "code": "A1.1",
    "name": "Network scale (personal, organisational, national, global)"
   },
   {
    "code": "A1.2",
    "name": "Security considerations when implementing topologies (star, mesh, hybrid, ad-hoc)"
   },
   {
    "code": "A1.3",
    "name": "Architectures (client-server, peer-to-peer)"
   },
   {
    "code": "A1.4",
    "name": "Connection media"
   },
   {
    "code": "A1.5",
    "name": "Network types"
   },
   {
    "code": "A1.6",
    "name": "Security implications of common network features"
   },
   {
    "code": "A2",
    "name": "The main components of computer networks"
   },
   {
    "code": "A2.1",
    "name": "Memory types, including"
   },
   {
    "code": "A2.2",
    "name": "Storage types"
   },
   {
    "code": "A2.3",
    "name": "Network devices that have user-controllable security settings, including"
   },
   {
    "code": "A3",
    "name": "Software components of computer networks"
   },
   {
    "code": "A3.1",
    "name": "Types of Operating System (OS)"
   },
   {
    "code": "A3.2",
    "name": "Utility software"
   }
  ]
 },
 "B": {
  "title": "Network security",
  "short": "The main threats to data and computer networks as described in Section A; Common methods of attacking data and computer networks; Methods of defending against a",
  "topics": [
   {
    "code": "B1",
    "name": "The main threats to data and computer networks as described in Section A"
   },
   {
    "code": "B1.1",
    "name": "Malware (viruses, spyware, adware)"
   },
   {
    "code": "B1.2",
    "name": "Denial-of-service (DoS) and distributed denial of service (DDoS)"
   },
   {
    "code": "B1.3",
    "name": "Hacking, unauthorised access"
   },
   {
    "code": "B1.4",
    "name": "Social engineering attacks"
   },
   {
    "code": "B1.5",
    "name": "Insider threats"
   },
   {
    "code": "B1.6",
    "name": "Zero-day vulnerabilities"
   },
   {
    "code": "B2",
    "name": "Common methods of attacking data and computer networks"
   },
   {
    "code": "B2.1",
    "name": "Eavesdropping"
   },
   {
    "code": "B2.2",
    "name": "Interception"
   },
   {
    "code": "B2.3",
    "name": "Replay"
   },
   {
    "code": "B2.4",
    "name": "Address Resolution Protocol (ARP) spoofing"
   },
   {
    "code": "B2.5",
    "name": "Domain Name System (DNS) poisoning"
   },
   {
    "code": "B2.6",
    "name": "Man-in-the-middle"
   },
   {
    "code": "B2.7",
    "name": "Crypto-jacking"
   },
   {
    "code": "B2.8",
    "name": "Structured Query Language (SQL) injection"
   },
   {
    "code": "B2.9",
    "name": "Buffer overflows"
   },
   {
    "code": "B3",
    "name": "Methods of defending against attacks on data and computer networks"
   },
   {
    "code": "B3.1",
    "name": "Security settings on network components (PC, server, WAP, switch, router, modem, bridge, firewall, mobile devices)"
   },
   {
    "code": "B3.2",
    "name": "Security features of operating systems"
   },
   {
    "code": "B3.3",
    "name": "Security features of utilities and applications"
   },
   {
    "code": "B3.4",
    "name": "Security policies"
   },
   {
    "code": "B4",
    "name": "Legal issues related to computer network security and encryption"
   },
   {
    "code": "B4.1",
    "name": "General Data Protection Regulation (GDPR) (requirements for protection of data, privacy rights)"
   },
   {
    "code": "B4.2",
    "name": "Legislation relating to computer misuse (protects personal data held by organisations from unauthorised access and modification)"
   }
  ]
 },
 "C": {
  "title": "Encryption",
  "short": "Methods and techniques for data encryption",
  "topics": [
   {
    "code": "C1",
    "name": "Methods and techniques for data encryption"
   },
   {
    "code": "C1.1",
    "name": "Data communication, the role of data packets in transmitting data over a network"
   },
   {
    "code": "C1.2",
    "name": "IP addresses (IPV4 and IPV6) and Media Access Control (MAC) addresses and their purpose"
   },
   {
    "code": "C1.3",
    "name": "The purpose and function of common network protocols and implications for security: (Transmission Control Protocol/Internet Protocol (TCP/IP), User Datagram Protocol (UDP), Hypertext Transfer Protocol (HTTP), Hypertext Transfer Protocol Secure (HTTPS), Secure Shell Protocol (SSH), Secure Sockets Layer (SSL), Transport Layer Security (TLS), File Transfer Protocol (FTP), File Transfer Protocol Secure (FTPS), Simple Mail Transfer Protocol (SMTP), Domain Name System (DNS), Internet Message Access Protocol (IMAP), Post Office Protocol version 3 (POP3))"
   },
   {
    "code": "C1.4",
    "name": "Symmetric and asymmetric encryption"
   },
   {
    "code": "C1.5",
    "name": "Encryption methods"
   },
   {
    "code": "C1.6",
    "name": "Digital signatures"
   },
   {
    "code": "C1.7",
    "name": "Digital certificates"
   },
   {
    "code": "C1.8",
    "name": "Public Key Infrastructure (PKI)"
   },
   {
    "code": "C1.9",
    "name": "Hashing algorithms"
   }
  ]
 },
 "D": {
  "title": "Evaluating cyber security and encryption solutions",
  "short": "Appropriate cyber security and encryption methods and techniques to secure data transmission and storage on a network; Suitable cyber security and encryption so",
  "topics": [
   {
    "code": "D1",
    "name": "Appropriate cyber security and encryption methods and techniques to secure data transmission and storage on a network"
   },
   {
    "code": "D1.1",
    "name": "Use of Transport Layer Security (TLS)"
   },
   {
    "code": "D1.2",
    "name": "Use of VPN and secure communication protocols (Internet Protocol Security (IPsec), SSL, TLS)"
   },
   {
    "code": "D1.3",
    "name": "Encryption and key management"
   },
   {
    "code": "D1.4",
    "name": "Data encryption at rest (full disk encryption, file encryption)"
   },
   {
    "code": "D2",
    "name": "Suitable cyber security and encryption solutions for different types of networks based on analysis of the requirements"
   },
   {
    "code": "D2.1",
    "name": "Security level"
   },
   {
    "code": "D2.2",
    "name": "Performance"
   },
   {
    "code": "D2.3",
    "name": "Cost"
   },
   {
    "code": "D2.4",
    "name": "Usability"
   },
   {
    "code": "D2.5",
    "name": "Scalability"
   },
   {
    "code": "D2.6",
    "name": "Compatibility"
   },
   {
    "code": "D2.7",
    "name": "Constraints"
   },
   {
    "code": "D2.8",
    "name": "Risks"
   },
   {
    "code": "D2.9",
    "name": "Benefits"
   }
  ]
 }
};
})();
