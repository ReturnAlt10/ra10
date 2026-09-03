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

    // draw.io JSON-protocol handshake. In embed mode the editor waits for the
    // host to answer its `init` message with a diagram (`load`), otherwise it
    // sits on "Loading…". The shape panel is collapsed by default, so once the
    // diagram has loaded we run the editor's own `toggleShapes` action to open
    // the left-hand shape libraries (General + Mockup wireframe shapes).
    var BLANK_XML = '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel>';
    window.addEventListener('message', function (e) {
      if (!e.source || e.origin.indexOf('diagrams.net') === -1) return;
      var msg;
      try { msg = JSON.parse(e.data); } catch (err) { return; }
      if (msg.event === 'init') {
        e.source.postMessage(JSON.stringify({ action: 'load', xml: BLANK_XML, libs: 'general;mockups;basic;arrows2' }), '*');
      } else if (msg.event === 'load') {
        e.source.postMessage(JSON.stringify({ action: 'invokeAction', actionName: 'toggleShapes' }), '*');
      }
    });

    host.innerHTML =
      '<div class="wf-embed">' +
        '<div class="wf-embed-hint">' +
          '<span class="wf-embed-hint-ico">' + icon(0x1F4A1) + '</span>' +
          '<span class="wf-embed-hint-text"><strong>Wireframing, powered by draw.io</strong> &mdash; an open-source editor. ' +
          'Drag shapes from the left panel onto the page &mdash; the <b>Mockup</b> libraries contain wireframe boxes, buttons, forms and navigation. ' +
          'Add more via <b>+ More shapes</b> (search "wireframe"). ' +
          'When finished, use <b>File &rarr; Export as</b> &rarr; SVG or PNG to save your wireframe as assignment evidence.</span>' +
          '<a class="wf-open-btn" href="https://app.diagrams.net/" target="_blank" rel="noopener">Open in new tab ' + icon(0x2197) + '</a>' +
        '</div>' +
        '<iframe class="wf-iframe" src="https://embed.diagrams.net/?embed=1&ui=atlas&libraries=1&proto=json" title="Wireframe editor (draw.io)" allowfullscreen></iframe>' +
      '</div>';
  };
})();
