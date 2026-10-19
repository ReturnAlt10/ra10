(function () {
  'use strict';
  var style = document.createElement('style');
  style.textContent = '.lines{height:34px!important;margin:2px 0 4px}';
  document.head.appendChild(style);

  window.downloadPaperPdf = async function () {
    var button = document.querySelector('[data-download-paper]');
    if (button) { button.disabled = true; button.textContent = 'Creating PDF…'; }
    try {
      if (!window.jspdf || !window.jspdf.jsPDF) throw new Error('The PDF tool could not load. Please try again.');
      var doc = new window.jspdf.jsPDF({ unit: 'pt', format: 'a4' });
      var sheets = Array.prototype.slice.call(document.querySelectorAll('.sheet'));
      for (var i = 0; i < sheets.length; i += 1) {
        if (i) doc.addPage();
        await doc.html(sheets[i], { x: 30, y: 30, width: 535, windowWidth: 900, autoPaging: 'text' });
      }
      var title = (document.title || 'ra10-paper').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      doc.save(title + '.pdf');
    } catch (error) {
      console.error('Paper PDF download failed:', error);
      alert(error && error.message ? error.message : 'Could not create the PDF. Please try again.');
    } finally {
      if (button) { button.disabled = false; button.textContent = 'Download PDF'; }
    }
  };
}());
