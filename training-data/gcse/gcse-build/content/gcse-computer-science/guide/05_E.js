  /* ===== E · 1.5 Systems software ===== */
  TITLE.E = 'Systems software'; SUB.E = 'Paper 1 · what an operating system does, and utility software';
  T.E = [
    { code: '1.5.1', name: 'Operating systems', html: () => `
${plain('The <b>operating system (OS)</b> is the software that <b>manages the computer’s hardware and software</b> and lets you use it. Windows, macOS, Linux, Android and iOS are operating systems. Without one, every program would have to control the hardware itself.')}
${fig(S.layers([['User', 'you — clicking, typing, tapping', P.pink], ['Application software', 'browser, game, word processor', P.blue], ['Operating system', 'user interface · memory · peripherals · users · files', P.teal], ['Hardware', 'CPU, RAM, storage, keyboard, screen, printer', P.slate]], { label: 'Where the OS sits' }), 'The OS sits between the hardware and the applications/user.')}
${table(['Function', 'What the OS does'], [
  ['<b>User interface</b>', 'Lets the user interact with the computer. A <b>GUI</b> (graphical user interface) uses windows, icons, menus and a pointer — easy to learn. A <b>command-line interface</b> uses typed commands — faster for experts and uses fewer resources. Touch and voice interfaces are also used.'],
  ['<b>Memory management and multitasking</b>', 'Allocates parts of <b>RAM to each program</b> and keeps them separate so they do not overwrite each other; moves data between RAM and virtual memory when needed; frees memory when a program closes. <b>Multitasking</b>: lets several programs run “at the same time” by quickly switching the CPU between them and sharing out memory.'],
  ['<b>Peripheral management and drivers</b>', 'Manages data moving between the CPU and input/output devices (keyboard, printer…). A <b>device driver</b> is a small program that translates the OS’s instructions into commands the specific device understands — new hardware needs the right driver.'],
  ['<b>User management</b>', 'Creates and deletes <b>user accounts</b>, handles logins (usernames and passwords), sets <b>access rights</b> (what each user may see or change) and keeps users’ files separate and secure.'],
  ['<b>File management</b>', 'Organises files into <b>folders</b> (a hierarchy); lets users <b>name, rename, save, open, move, copy and delete</b> files; controls who can access each file.']])}
${tip('Paging and segmentation are <b>not</b> required. Do learn one clear example for each OS function, eg “installing a printer driver” = peripheral management; “creating a new account for a new employee” = user management.', 'What OCR asks for')}
${exam('Describe how an operating system manages memory.', 2, 'It allocates memory to each program/application that is running (1), keeps programs’ memory separate so they do not interfere, and frees it when a program closes / moves data to virtual memory when RAM is full (1).')}` },

    { code: '1.5.2', name: 'Utility software', html: () => `
${plain('<b>Utility software</b> performs <b>housekeeping</b> tasks that keep the computer running well and its data safe — jobs the operating system may not do on its own. Many utilities come with the OS.')}
${table(['Utility', 'Purpose and why it is needed'], [
  ['<b>Encryption software</b>', 'Scrambles files so they cannot be understood without the key — protects data if the device is lost or stolen, or the data is intercepted.'],
  ['<b>Defragmentation</b>', 'On a <b>magnetic hard disk</b>, files become split into pieces stored in different places (<b>fragmented</b>) as files are saved, edited and deleted. Defragmentation <b>moves the pieces of each file together</b> and groups the free space, so the read/write head moves less and files are <b>accessed faster</b>.'],
  ['<b>Data compression</b>', 'Reduces file sizes, so they take up less storage and are quicker to send (see 1.2.5).']])}
${WG('defrag')}
${warn('SSDs do <b>not</b> need defragmenting: they have no moving parts, so the position of the data does not affect speed — and the extra writing would shorten their life.', 'SSDs')}
${exam('Explain why defragmentation can improve the performance of a computer with a magnetic hard disk.', 2, 'The parts of each file are moved so they are stored together / next to each other (1), so the read/write head does not have to move around as much and files are loaded faster (1).')}` }
  ];
