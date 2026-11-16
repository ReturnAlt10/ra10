"""OCR GCSE (9–1) Computer Science J277 specification content (Version 3.1), written out from the specification's
content tables (section 2b/2c). Writes out/gcse-computer-science.spec.json.

    python training-data/gcse/gcse-build/ocr_spec.py
"""
import io, json, os

HERE = os.path.dirname(os.path.abspath(__file__))

SPEC = {
 '1.1': ('Systems architecture', 1, [
   ('1.1.1', 'Architecture of the CPU', 'The purpose of the CPU: the fetch-execute cycle. Common CPU components and their function: ALU (Arithmetic Logic Unit), CU (Control Unit), cache, registers. Von Neumann architecture: MAR (Memory Address Register), MDR (Memory Data Register), Program Counter, Accumulator. Required: what happens at each stage of the fetch-execute cycle; the role of each component and what it manages, stores or controls; the purpose of each register and whether it stores data or an address. Not required: passing of data between registers in each stage.'),
   ('1.1.2', 'CPU performance', 'How common characteristics of CPUs affect their performance: clock speed, cache size, number of cores — individually or in combination.'),
   ('1.1.3', 'Embedded systems', 'The purpose and characteristics of embedded systems; examples of embedded systems.')]),
 '1.2': ('Memory and storage', 1, [
   ('1.2.1', 'Primary storage (memory)', 'The need for primary storage; the difference between RAM and ROM; the purpose of ROM and of RAM; virtual memory (why it may be needed and how it works — data transferred between RAM and secondary storage when RAM is full); cache.'),
   ('1.2.2', 'Secondary storage', 'The need for secondary storage. Optical, magnetic and solid state storage. Suitable devices and media for a given application; advantages and disadvantages relating to capacity, speed, portability, durability, reliability and cost. Not required: the component parts of these storage types.'),
   ('1.2.3', 'Units', 'Bit, nibble (4 bits), byte (8 bits), kilobyte (1,000 bytes), megabyte, gigabyte, terabyte, petabyte (each 1,000 of the previous). Why data must be stored in binary. Calculating storage requirements and file sizes: sound = sample rate × duration (s) × bit depth; image = colour depth × height (px) × width (px); text = bits per character × number of characters. Using 1,024 is also acceptable.'),
   ('1.2.4', 'Data storage', 'Numbers: denary ↔ binary (up to 8 bits, 0–255); binary addition and overflow; denary ↔ 2-digit hexadecimal (00–FF); binary ↔ hexadecimal; binary shifts (left and right); most and least significant bit. Characters: binary codes, character sets, ASCII and Unicode, bits per character vs number of characters, logical ordering of codes. Images: pixels, colour depth, resolution, metadata, effect on quality and file size. Sound: sampling, sample rate (Hz), duration, bit depth, effect on quality and file size.'),
   ('1.2.5', 'Compression', 'The need for compression; lossy and lossless compression; common scenarios; advantages, disadvantages and effects on the file. Not required: carrying out compression algorithms.')]),
 '1.3': ('Computer networks, connections and protocols', 1, [
   ('1.3.1', 'Networks and topologies', 'LAN and WAN; factors that affect network performance (eg number of devices, bandwidth); roles in client-server and peer-to-peer networks; hardware: wireless access points, routers, switches, NIC, transmission media; the Internet as a worldwide collection of networks: DNS, hosting, the Cloud, web servers and clients; star and mesh topologies.'),
   ('1.3.2', 'Wired and wireless networks, protocols and layers', 'Wired (Ethernet) and wireless (Wi-Fi, Bluetooth) connections; encryption; IP addressing (IPv4 and IPv6) and MAC addressing; standards; protocols: TCP/IP, HTTP, HTTPS, FTP, POP, IMAP, SMTP; the concept of layers. Not required: how Ethernet/Wi-Fi/Bluetooth work, static/dynamic or public/private IPs, individual standards, names of TCP/IP layers.')]),
 '1.4': ('Network security', 1, [
   ('1.4.1', 'Threats to computer systems and networks', 'Malware; social engineering (eg phishing, people as the weak point); brute-force attacks; denial of service attacks; data interception and theft; the concept of SQL injection — how each attack is used and its purpose.'),
   ('1.4.2', 'Identifying and preventing vulnerabilities', 'Penetration testing; anti-malware software; firewalls; user access levels; passwords; encryption; physical security — what each limits or prevents and how.')]),
 '1.5': ('Systems software', 1, [
   ('1.5.1', 'Operating systems', 'User interface; memory management and multitasking; peripheral management and drivers; user management; file management. Not required: paging or segmentation.'),
   ('1.5.2', 'Utility software', 'The purpose of utility software (housekeeping); encryption software, defragmentation, data compression.')]),
 '1.6': ('Ethical, legal, cultural and environmental impacts of digital technology', 1, [
   ('1.6.1', 'Ethical, legal, cultural and environmental impact', 'Ethical, legal, cultural, environmental and privacy issues of digital technology. Legislation: Data Protection Act 2018, Computer Misuse Act 1990, Copyright Designs and Patents Act 1988, software licences (open source and proprietary).')]),
 '2.1': ('Algorithms', 2, [
   ('2.1.1', 'Computational thinking', 'Abstraction, decomposition and algorithmic thinking — and how they are used to define and refine problems.'),
   ('2.1.2', 'Designing, creating and refining algorithms', 'Inputs, processes and outputs; structure diagrams; pseudocode, flowcharts and OCR Exam Reference Language / a high-level language; identifying common errors (syntax and logic); trace tables; nesting of selection and iteration. Flowchart symbols: line, input/output, process, decision, sub program, terminal.'),
   ('2.1.3', 'Searching and sorting algorithms', 'Binary search and linear search; bubble sort, merge sort and insertion sort — main steps, pre-requisites, applying them to a data set, identifying an algorithm from its code. Not required: remembering the code.')]),
 '2.2': ('Programming fundamentals', 2, [
   ('2.2.1', 'Programming fundamentals', 'Variables, constants, operators, inputs, outputs and assignments; sequence, selection and iteration (count- and condition-controlled loops); arithmetic operators (+ − * / MOD DIV ^); comparison operators (== != < <= > >=); Boolean operators AND, OR, NOT.'),
   ('2.2.2', 'Data types', 'Integer, real, Boolean, character and string; casting.'),
   ('2.2.3', 'Additional programming techniques', 'String manipulation (concatenation, slicing); file handling (open, read, write, close); records; SQL (SELECT, FROM, WHERE); 1D and 2D arrays; sub programs (functions and procedures, local and global variables, parameters); random number generation.')]),
 '2.3': ('Producing robust programs', 2, [
   ('2.3.1', 'Defensive design', 'Anticipating misuse; authentication; input validation; maintainability: sub programs, naming conventions, indentation, commenting.'),
   ('2.3.2', 'Testing', 'The purpose of testing; iterative and final/terminal testing; syntax and logic errors; normal, boundary, invalid and erroneous test data; refining algorithms; test plans.')]),
 '2.4': ('Boolean logic', 2, [
   ('2.4.1', 'Boolean logic', 'Logic diagrams using AND, OR and NOT; truth tables; combining Boolean operators; applying logical operators in truth tables to solve problems; working with more than one gate.')]),
 '2.5': ('Programming languages and Integrated Development Environments', 2, [
   ('2.5.1', 'Languages', 'High-level and low-level languages; the purpose of translators; characteristics of a compiler and an interpreter. Not required: assemblers.'),
   ('2.5.2', 'The Integrated Development Environment (IDE)', 'Editors, error diagnostics, run-time environment, translators — and how each helps a programmer.')]),
}

if __name__ == '__main__':
    out = {k: {'name': v[0], 'paper': v[1], 'subs': [{'code': c, 'name': n, 'content': t} for c, n, t in v[2]]} for k, v in SPEC.items()}
    os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
    json.dump(out, io.open(os.path.join(HERE, 'out', 'gcse-computer-science.spec.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('spec: %d topics, %d sub-topics' % (len(out), sum(len(v['subs']) for v in out.values())))
