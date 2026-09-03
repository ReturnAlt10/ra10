/* Wireframe Designer — powered by diagrams.net (draw.io), the
   open-source (Apache 2.0) diagramming editor. We embed it so
   learners get a professional-grade wireframing tool with the full
   shape library, snap-to-grid and SVG/PNG export — no sign-up. */
(function () {
  'use strict';

  function icon(cp) { return String.fromCodePoint(cp); }

  window.initWireframeTool = function () {
    var host = document.getElementById('wireframe-tool');
    if (!host || host.dataset.ready) return;
    host.dataset.ready = '1';

    host.innerHTML =
      '<div class="wf-embed">' +
        '<div class="wf-embed-hint">' +
          '<span class="wf-embed-hint-ico">' + icon(0x1F4A1) + '</span>' +
          '<span class="wf-embed-hint-text"><strong>Wireframing, powered by draw.io</strong> &mdash; an open-source editor. ' +
          'Drag shapes from the left <b>Shapes</b> panel onto the page. For wireframe-specific boxes open ' +
          '<b>+ More shapes &rarr; Wireframes</b> (or search "wireframe" in the shape picker). ' +
          'When finished, use <b>File &rarr; Export as</b> &rarr; SVG or PNG to save your wireframe as assignment evidence.</span>' +
          '<a class="wf-open-btn" href="https://app.diagrams.net/" target="_blank" rel="noopener">Open in new tab ' + icon(0x2197) + '</a>' +
        '</div>' +
        '<iframe class="wf-iframe" src="https://embed.diagrams.net/?embed=1&ui=min" title="Wireframe editor (draw.io)" allowfullscreen></iframe>' +
      '</div>';
  };
})();
