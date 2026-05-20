// Revision Guide Content for IT Level 2 Unit 2
(function() {
'use strict';

window.GuideContent = {
  aims: {
    A: {
      title: 'Learning Aim A: Applications & Issues',
      sections: [
        {
          heading: 'A1.1 Hardware in Applications',
          content: `Hardware devices are selected based on the needs of specific applications and business sectors.
          
Common hardware includes:
- Personal computers (desktops, laptops)
- Tablets and mobile devices
- Servers for data storage and processing
- Printers, scanners, and multifunction devices
- Input devices (keyboards, mice, touchscreens, biometric readers)
- Output devices (monitors, speakers, projectors)
- Network hardware (routers, switches, NICs)

When choosing hardware, consider:
- Processing power needed
- Storage capacity
- Display requirements
- Portability
- Reliability and uptime
- Cost of ownership`
        },
        {
          heading: 'A1.2 Software in Applications',
          content: `Software supports business operations and user tasks.

Types of software:
- System software: Operating systems, drivers, firmware
- Application software: Word processors, spreadsheets, databases, CRM systems
- Utility software: Antivirus, backup, disk tools, compression
- Cloud software: SaaS applications like Office 365, Salesforce
- Custom software: Developed for specific business needs

Factors affecting software choice:
- Business requirements
- Compatibility with existing systems
- Licensing costs
- User training needs
- Integration with other systems`
        },
        {
          heading: 'A1.3 Cloud Services',
          content: `Cloud services deliver computing resources over the internet.

Types of cloud services:
- SaaS (Software as a Service): Ready-to-use applications
- IaaS (Infrastructure as a Service): Computing resources
- PaaS (Platform as a Service): Development environment

Advantages:
- Scalability
- Reduced infrastructure costs
- Remote access
- Automatic updates
- Reduced maintenance burden

Disadvantages:
- Dependency on internet connectivity
- Less control over data location
- Potential security concerns
- Vendor lock-in
- Ongoing subscription costs`
        },
        {
          heading: 'A1.4-A1.7 Security, Privacy, Backup & Networking',
          content: `Organizations must protect data and ensure business continuity.

Security threats:
- Malware (viruses, worms, trojans, ransomware)
- Phishing and social engineering
- Weak passwords and brute force attacks
- Unpatched software vulnerabilities
- Insider threats

Protections:
- Firewalls and network monitoring
- Encryption of sensitive data
- Multi-factor authentication
- Regular security updates
- User training and awareness
- Access controls and permissions

GDPR compliance:
- Lawful basis for processing
- Data minimization
- Purpose limitation
- Transparency and consent
- Right to access
- Right to be forgotten
- Breach reporting within 72 hours

Backup strategies:
- Full backups: Complete copy of all data
- Incremental backups: Changes since last backup
- Differential backups: Changes since last full backup
- 3-2-1 rule: 3 copies, 2 media types, 1 off-site
- Disaster recovery planning

Networking:
- LANs for office/campus
- WANs for multi-site connectivity
- Secure protocols (HTTPS, SFTP)
- VPNs for remote access`
        }
      ]
    },
    B: {
      title: 'Learning Aim B: Hardware & Software',
      sections: [
        {
          heading: 'B1.1 The CPU and Processors',
          content: `The CPU (Central Processing Unit) executes instructions and controls all computer operations.

Key components:
- Control unit: Fetches and decodes instructions
- ALU (Arithmetic Logic Unit): Performs calculations and comparisons
- Registers: High-speed temporary storage
- Cache: Very fast memory storing frequently accessed data

CPU characteristics:
- Clock speed: Number of cycles per second (GHz)
- Cores: Multiple processors working in parallel
- Cache size: Affects speed of common operations
- Instruction set: Defines available operations

The fetch-decode-execute cycle:
1. Fetch: Get instruction from memory
2. Decode: Interpret what the instruction means
3. Execute: Perform the operation
4. Store: Save result`
        },
        {
          heading: 'B1.2 Memory: Types and Functions',
          content: `Different memory types serve different purposes.

RAM (Random Access Memory):
- Volatile: Loses contents when powered off
- Fast access to active programs
- Measured in GB
- Temporary storage during execution
- More RAM = better multitasking

ROM (Read Only Memory):
- Non-volatile: Retains contents when powered off
- Stores boot firmware/BIOS
- Cannot be modified during normal operation
- Essential for startup

Cache Memory:
- Very small but extremely fast
- Stores frequently used data
- Reduces CPU wait times
- L1, L2, L3 levels with increasing size/latency

Virtual Memory:
- Uses hard disk as overflow for RAM
- Slower than physical RAM
- Enables running larger programs`
        },
        {
          heading: 'B1.3 Storage Devices',
          content: `Permanent storage holds data after power is switched off.

Hard Disk Drive (HDD):
- Spinning magnetic platters
- Lower cost per GB
- Slower access time
- More prone to mechanical failure
- Good for bulk storage

Solid State Drive (SSD):
- Flash memory, no moving parts
- Faster read/write speeds
- More expensive per GB
- More reliable
- Better for system drives

Other storage:
- USB flash drives
- Memory cards
- Optical discs (CD, DVD, Blu-ray)
- Cloud storage
- Tape (for archival)`
        },
        {
          heading: 'B1.4 Input/Output Devices',
          content: `Devices for user interaction and system communication.

Input devices:
- Keyboard: Text and command entry
- Mouse: Pointing and selection
- Touchscreen: Direct input on display
- Biometric readers: Fingerprint, iris, face
- Microphone: Audio input
- Scanner: Digitize documents

Output devices:
- Monitor: Visual display
- Printer: Paper output
- Projector: Large display
- Speaker: Audio output
- LED indicators: Status information

Selection based on:
- User needs
- Environment
- Security requirements
- Accessibility
- Cost`
        },
  {
    heading: 'B1.5 CPU Performance Factors',
    content: `CPU performance is affected by several hardware factors.

Clock speed (GHz):
- Higher clock speed means more cycles per second
- More cycles can increase instruction throughput

Number of cores:
- Multi-core CPUs can process multiple tasks in parallel
- Useful for multitasking and multi-threaded software

Cache size:
- Larger cache stores more frequently used data close to CPU
- Reduces delays caused by accessing slower RAM

Architecture and instruction efficiency:
- Newer CPU designs can complete more work per cycle
- Instruction set and pipeline design affect real-world speed

Thermal limits and throttling:
- If a CPU gets too hot, it may reduce speed
- Cooling quality impacts sustained performance`
  },
  {
    heading: 'B1.6 Memory and Storage Capacity',
    content: `You should compare and calculate data sizes accurately.

Common units:
- 8 bits = 1 byte
- 1024 bytes = 1 KB
- 1024 KB = 1 MB
- 1024 MB = 1 GB
- 1024 GB = 1 TB

Capacity examples:
- RAM is typically measured in GB (e.g., 8 GB, 16 GB)
- SSD/HDD capacity is measured in GB/TB (e.g., 512 GB SSD)

Memory vs storage:
- RAM is volatile working memory for active programs
- Storage (SSD/HDD) is non-volatile for long-term data

Data transfer considerations:
- File transfer time depends on file size and transfer rate
- Larger files and slower connections increase transfer time

Exam tip:
- Always show unit conversions clearly in calculation questions`
  },
        {
          heading: 'B2.1-B2.3 Software Types and Licensing',
          content: `Software is licensed and categorized by type and use.

System Software:
- Operating System: Windows, macOS, Linux
- Device Drivers: Control hardware
- Firmware: Low-level system code
- Manages hardware and enables applications

Application Software:
- Productivity: Office, word processing, spreadsheets
- Business: ERP, CRM, accounting
- Creative: Design, video, audio tools
- Entertainment: Games, streaming
- Educational: Learning management systems

Utility Software:
- Antivirus and security
- Backup and recovery
- File compression
- Disk cleanup and optimization
- System monitoring

Software Licensing:
- Proprietary: Closed source, vendor owned
- Open source: Source code available for modification
- Free software: Open source with no cost
- Freeware: No cost but proprietary
- Shareware: Trial period, then purchase
- Site/Volume licenses: Multiple users/installations`
        }
      ]
    },
    C: {
      title: 'Learning Aim C: Programming Basics',
      sections: [
        {
          heading: 'C1.1 Programming Languages',
          content: `Programs are written in languages that translate to machine code.

High-level languages:
- Python: Easy to learn, versatile
- Java: Platform independent, strongly typed
- C#: Microsoft framework, object-oriented
- JavaScript: Web development
- Visual Basic: Event-driven, simple syntax

Low-level languages:
- Assembly: Mnemonics for machine code
- Machine code: Binary 1s and 0s

Language selection factors:
- Application type (web, mobile, desktop)
- Performance requirements
- Team expertise
- Library/framework availability
- Community support`
        },
        {
          heading: 'C1.2-C1.3 Variables, Data Types & Constants',
          content: `Variables store data that programs use and modify.

Data types:
- Integer: Whole numbers (-10, 5, 1000)
- Float/Real: Decimal numbers (3.14, 2.5)
- String: Text ("Hello", "Name")
- Boolean: True or False
- Character: Single letter ('a', 'Z')
- Array: Collection of values [1, 2, 3]

Variable naming:
- Descriptive names improve readability
- Follow language conventions
- Avoid reserved keywords
- Use camelCase or snake_case consistently

Constants:
- Values that don't change
- Use for fixed configuration values
- Improve code maintainability`
        },
        {
          heading: 'C1.4 Control Flow Structures',
          content: `Programs use three main control structures.

Sequence:
- Instructions execute one after another
- Top to bottom order
- Most common flow

Selection (IF statements):
- Choose between paths based on condition
- IF / ELSE / ELSE IF
- Boolean conditions (true/false)
- Used for decision making

Iteration (Loops):
- FOR loop: Repeat a fixed number of times
- WHILE loop: Repeat while condition is true
- DO WHILE: Execute once, then check condition
- Used for repetitive tasks`
        },
        {
          heading: 'C1.5 Functions and Procedures',
          content: `Functions organize code into reusable blocks.

Benefits:
- Code reusability
- Modularity and organization
- Easier to test and debug
- Improved readability

Function structure:
- Definition: Parameters and return type
- Implementation: Instructions to execute
- Call: Invoke function from another part of code
- Return: Send result back to caller

Scope:
- Local variables: Exist only within function
- Global variables: Accessible everywhere
- Parameter passing: Input to function`
        },
        {
          heading: 'C2.1-C2.2 Code Analysis & Algorithms',
          content: `Understanding and planning code execution.

Code analysis:
- Trace code execution manually
- Track variable values
- Identify output for given inputs
- Find logical errors

Flowcharts:
- Visual representation of program logic
- Rectangle: Process/instruction
- Diamond: Decision/condition
- Oval: Start/end
- Arrow: Flow direction

Pseudocode:
- Structured English description
- Not dependent on specific language
- Helps plan before coding
- Easier to understand algorithm`
        }
      ]
    }
  },

  getGuideHTML(aim) {
    const aimData = this.aims[aim];
    if (!aimData) return '';

    let html = `<h2>${aimData.title}</h2>`;
    aimData.sections.forEach(section => {
      html += `
        <div class="guide-section">
          <h3>${section.heading}</h3>
          <p>${section.content.replace(/\n/g, '<br>')}</p>
        </div>
      `;
    });
    return html;
  }
};

})();
