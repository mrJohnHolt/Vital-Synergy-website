(function () {
  var PDF_URL = 'Assets/Vital-Synergy-Brochure-2026.pdf';
  var book = document.getElementById('br-book');
  var loading = document.getElementById('br-loading');
  var errorBox = document.getElementById('br-error');
  var controls = document.getElementById('br-controls');
  var count = document.getElementById('br-count');
  var stage = document.getElementById('br-stage');
  var total = 0, flip = null, rendered = {}, pdf = null;

  function fail() {
    if (loading) loading.hidden = true;
    if (controls) controls.hidden = true;
    if (errorBox) errorBox.hidden = false;
  }

  if (!book || !window.pdfjsLib || !window.St) { fail(); return; }

  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  pdfjsLib.getDocument(PDF_URL).promise.then(function (doc) {
    pdf = doc;
    total = doc.numPages;
    return doc.getPage(1);
  }).then(function (first) {
    var vp = first.getViewport({ scale: 1 });
    var pages = [];
    for (var i = 1; i <= total; i++) {
      var el = document.createElement('div');
      el.className = 'br-page';
      if (i === 1 || i === total) el.setAttribute('data-density', 'hard');
      el.appendChild(document.createElement('canvas'));
      book.appendChild(el);
      pages.push(el);
    }
    flip = new St.PageFlip(book, {
      width: Math.round(vp.width),
      height: Math.round(vp.height),
      size: 'stretch',
      minWidth: 260, maxWidth: 560,
      minHeight: 368, maxHeight: 792,
      showCover: true,
      usePortrait: true,
      maxShadowOpacity: 0.45,
      mobileScrollSupport: false
    });
    flip.loadFromHTML(pages);
    loading.hidden = true;
    controls.hidden = false;
    flip.on('flip', function (e) { update(e.data); });
    flip.on('changeOrientation', function () { update(flip.getCurrentPageIndex()); });
    update(0);
  }).catch(fail);

  function update(idx) {
    var portrait = flip.getOrientation() === 'portrait';
    var label;
    if (idx === 0 || portrait || idx >= total - 1) label = 'Page ' + (idx + 1);
    else label = 'Pages ' + (idx + 1) + ' to ' + Math.min(idx + 2, total);
    count.textContent = label + ' of ' + total;
    for (var d = -2; d <= 4; d++) renderPage(idx + d);
  }

  function renderPage(i) {
    if (i < 0 || i >= total || rendered[i]) return;
    rendered[i] = true;
    pdf.getPage(i + 1).then(function (page) {
      var canvas = book.querySelectorAll('.br-page canvas')[i];
      var vp1 = page.getViewport({ scale: 1 });
      var scale = (900 / vp1.width) * Math.min(window.devicePixelRatio || 1, 1.5);
      var vp = page.getViewport({ scale: scale });
      canvas.width = vp.width;
      canvas.height = vp.height;
      return page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
    }).catch(function () { rendered[i] = false; });
  }

  document.getElementById('br-prev').addEventListener('click', function () { flip.flipPrev(); });
  document.getElementById('br-next').addEventListener('click', function () { flip.flipNext(); });
  document.getElementById('br-full').addEventListener('click', function () {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (stage.requestFullscreen) stage.requestFullscreen();
  });
  stage.addEventListener('keydown', function (e) {
    if (!flip) return;
    if (e.key === 'ArrowRight') { flip.flipNext(); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { flip.flipPrev(); e.preventDefault(); }
  });
})();
