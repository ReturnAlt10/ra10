  // Self-check: every paper must total 96 for every combination of options (Section A + one option per group).
  made.forEach(pp => {
    const fixed = pp.items.filter(i => !i.opt).reduce((a, i) => a + i.marks, 0);
    const groups = {};
    pp.items.filter(i => i.opt).forEach(i => { groups[i.opt.group] = groups[i.opt.group] || {}; groups[i.opt.group][i.opt.name] = (groups[i.opt.group][i.opt.name] || 0) + i.marks; });
    const optTotals = Object.keys(groups).map(g => Object.values(groups[g]));
    const bad = optTotals.some(v => v.some(x => x !== 24));
    const total = fixed + optTotals.reduce((a, v) => a + (v[0] || 0), 0);
    if (total !== 96 || bad) console.error('RA10 paper total error', pp.id, total, JSON.stringify(groups));
  });
})();
