/* BTEC Nationals IT (2016) Unit 14 — figures used in the Pearson set-task briefs, redrawn by RA10.
   Registered on window.BIZ_FIGURES[id] = { cap, alt, svg }; a brief refers to one with a { t: 'fig', id } block.
   The SVG is drawn on first use with the shared org-chart drawer (BizGuide.svg.org, loaded later on the page);
   the alt text describes every reporting line, so the AI Examiner and screen readers get the whole chart. */
(function () {
  'use strict';
  const org = (tree, label) => (window.BizGuide && BizGuide.svg && BizGuide.svg.org) ? BizGuide.svg.org(tree, { label }) : '';
  const fig = (cap, alt, draw) => {
    let cache = null;
    return { cap, alt, get svg() { if (cache === null) cache = draw(); return cache; } };
  };

  window.BIZ_FIGURES = Object.assign(window.BIZ_FIGURES || {}, {
    'u14-1806-org': fig('Buckton Construction: Head Office and construction site structure',
      'Head Office: the Managing Director (MD) has a Personal Assistant and four managers reporting to them — IT Systems Manager (with two IT Technicians), Human Resources Manager, Finance Manager (with a Finance Assistant) and Office Manager (with a Receptionist). Construction site 1 and construction site 2 each have a Site Manager, with an Estimator, Project Manager, Site Engineer and Quantity Surveyor.',
      () => '<div class="u14-org">' +
        org({ t: 'Managing Director (MD)', kids: [{ t: 'Personal Assistant' }, { t: 'IT Systems Manager', kids: [{ t: 'IT Technician' }, { t: 'IT Technician' }] }, { t: 'Human Resources Manager' }, { t: 'Finance Manager', kids: [{ t: 'Finance Assistant' }] }, { t: 'Office Manager', kids: [{ t: 'Receptionist' }] }] }, 'Buckton Construction Head Office structure') +
        org({ t: 'Construction site 1 and site 2 (each)', kids: [{ t: 'Site Manager', kids: [{ t: 'Estimator' }, { t: 'Project Manager' }, { t: 'Site Engineer' }, { t: 'Quantity Surveyor' }] }] }, 'Structure of each construction site') + '</div>'),
    'u14-2101-org': fig('Rodri’s: staffing structure',
      'Restaurant: the Owner and the Assistant Manager are at the top. Under them are the Host, Maintenance (2) and the Head Chef. The Host manages the Servers (3) and Bar Staff (2). The Head Chef manages the Sous Chef, Cooks (3) and the Prep Cook. Two external contractors, an Accountant and IT Support, are linked to the Owner.',
      () => '<div class="u14-org">' +
        org({ t: 'Owner + Assistant Manager', kids: [{ t: 'Host', kids: [{ t: 'Servers (3)' }, { t: 'Bar Staff (2)' }] }, { t: 'Maintenance (2)' }, { t: 'Head Chef', kids: [{ t: 'Sous Chef' }, { t: 'Cooks (3)' }, { t: 'Prep Cook' }] }] }, 'Rodri’s staffing structure') +
        org({ t: 'Contractors (linked to the Owner)', kids: [{ t: 'Accountant' }, { t: 'IT Support' }] }, 'Rodri’s external contractors') + '</div>')
  });
})();
