  // Self-check: every RA10 paper totals 80; Paper 2 is Section A 50 + Section B 30.
  made.forEach(pp => {
    const total = pp.items.reduce((a, i) => a + i.marks, 0);
    const secB = pp.items.filter(i => i.section === 'B').reduce((a, i) => a + i.marks, 0);
    if (total !== 80 || (pp.paper === 2 && secB !== 30)) console.error('RA10 paper total error', pp.id, total, secB);
  });
})();
