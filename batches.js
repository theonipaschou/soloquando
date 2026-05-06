/* ============================================================
   solo.quando — BATCHES (single source of truth)
   ------------------------------------------------------------
   To add a new batch: add an object to the SOLO_BATCHES array
   below. Both the carousel (index.html + products.html) and
   the registry table (products.html) update automatically.

   No other file needs to be touched.
   ============================================================ */

window.SOLO_BATCHES = [
  {
    id: '001',
    product: 'Strawberry marmalade',
    productHtml: 'Strawberry <em>marmalade</em>',
    baker: 'Theoni',
    status: 'confirmed',                 // 'confirmed' | 'open' | 'soon'
    statusLabel: 'Confirmed',
    preorderBy: '4 May',
    pickupDate: '8 May',
    pickupLocation: 'Central Zürich',
    price: 'CHF 14 / jar',
    image: '/batch-jar-900.jpg',
    link: '/how-it-works',
    cardLine: 'A Greek recipe from my grandmother. Slow-simmered, made by hand.'
  },
  {
    id: '002',
    product: 'Moustokouloura',
    productHtml: '<em>Moustokouloura</em>',
    baker: 'Theoni',
    status: 'open',
    statusLabel: 'Pre-orders open',
    preorderBy: '10 May',
    pickupDate: '13 or 16 May',
    pickupLocation: 'Central Zürich',
    price: 'CHF 3.50 / piece',
    image: '/batch-mousto-900.jpg',
    link: '/batch-moustokouloura-002',
    cardLine: 'Soft Greek grape-must cookies. Faintly spiced, faintly sweet.'
  },
  {
    id: '003',
    product: null,                        // null = placeholder card
    productHtml: null,
    baker: null,
    status: 'soon',
    statusLabel: 'Coming soon',
    preorderBy: null,
    pickupDate: null,
    pickupLocation: 'Central Zürich',
    price: null,
    image: null,
    link: null,
    cardLine: 'Another baker. Another recipe. Another Sunday morning in Zürich.'
  }
];

/* ============================================================
   RENDERERS
   ============================================================ */
window.SoloBatches = (function () {

  function esc (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---------- CAROUSEL ---------- */
  function carouselCardHtml (b) {
    var isPlaceholder = (b.status === 'soon' || !b.product);

    var imgBlock = b.image
      ? '<div class="bcard-img" style="background-image:url(\'' + esc(b.image) + '\');"></div>'
      : '<div class="bcard-img bcard-img-placeholder"><span>?</span></div>';

    var statusClass = 'bcard-pill bcard-pill-' + esc(b.status);
    var statusBlock = '<span class="' + statusClass + '">' + esc(b.statusLabel) + '</span>';

    var titleBlock = isPlaceholder
      ? '<h3 class="bcard-title bcard-title-dim">' + esc(b.statusLabel) + '</h3>'
      : '<h3 class="bcard-title">' + b.productHtml + '</h3>';

    var metaBlock;
    if (isPlaceholder) {
      metaBlock =
        '<p class="bcard-line">' + esc(b.cardLine) + '</p>' +
        '<p class="bcard-meta bcard-meta-dim">Central Zürich</p>';
    } else {
      metaBlock =
        '<p class="bcard-line">' + esc(b.cardLine) + '</p>' +
        '<dl class="bcard-meta">' +
          '<dt>Baker</dt><dd>' + esc(b.baker) + '</dd>' +
          '<dt>Pickup</dt><dd>' + esc(b.pickupDate) + ', ' + esc(b.pickupLocation) + '</dd>' +
          '<dt>Price</dt><dd>' + esc(b.price) + '</dd>' +
        '</dl>';
    }

    var idBlock = '<span class="bcard-id">' + esc(b.id) + '</span>';

    var inner =
      imgBlock +
      '<div class="bcard-body">' +
        '<div class="bcard-top">' + idBlock + statusBlock + '</div>' +
        titleBlock +
        metaBlock +
      '</div>';

    if (b.link && !isPlaceholder) {
      return '<a class="bcard" href="' + esc(b.link) + '">' + inner + '</a>';
    }
    return '<div class="bcard bcard-disabled">' + inner + '</div>';
  }

  function renderCarousel (trackSel, dotsSel) {
    var track = document.querySelector(trackSel);
    var dots  = document.querySelector(dotsSel);
    if (!track) return;

    track.innerHTML = window.SOLO_BATCHES.map(carouselCardHtml).join('');

    if (dots) {
      dots.innerHTML = window.SOLO_BATCHES.map(function (b, i) {
        return '<button class="carousel-dot' + (i === 0 ? ' on' : '') +
               '" data-i="' + i + '" aria-label="Batch ' + esc(b.id) + '"></button>';
      }).join('');
    }

    wireCarousel(track, dots);
  }

  function wireCarousel (track, dots) {
    var btnPrev = document.querySelector('.carousel-btn-prev');
    var btnNext = document.querySelector('.carousel-btn-next');
    var dotEls  = dots ? dots.querySelectorAll('.carousel-dot') : [];
    var items   = track.children.length;
    var cur     = 0;

    function slideTo (n) {
      cur = Math.max(0, Math.min(items - 1, n));
      var first = track.children[0];
      if (!first) return;
      var cardW = first.offsetWidth + 24; // card width + gap
      track.style.transform = 'translateX(-' + (cur * cardW) + 'px)';
      dotEls.forEach(function (d, i) { d.classList.toggle('on', i === cur); });
    }

    if (btnPrev) btnPrev.addEventListener('click', function () { slideTo(cur - 1); });
    if (btnNext) btnNext.addEventListener('click', function () { slideTo(cur + 1); });
    dotEls.forEach(function (d) {
      d.addEventListener('click', function () { slideTo(+d.dataset.i); });
    });
    window.addEventListener('resize', function () { slideTo(cur); });
  }

  /* ---------- TABLE ---------- */
  function tableRowHtml (b) {
    var isPlaceholder = (b.status === 'soon' || !b.product);
    var dim = isPlaceholder ? ' class="row-dim"' : '';
    var em  = function (v) { return v == null ? '—' : esc(v); };

    var statusCell = '<span class="status-pill status-pill-' + esc(b.status) + '">' +
                     esc(b.statusLabel) + '</span>';

    return '<tr' + dim + '>' +
      '<td class="cell-id">' + esc(b.id) + '</td>' +
      '<td>' + (isPlaceholder ? '—' : b.productHtml) + '</td>' +
      '<td>' + em(b.baker) + '</td>' +
      '<td>' + statusCell + '</td>' +
      '<td>' + em(b.preorderBy) + '</td>' +
      '<td>' + em(b.pickupDate) + '</td>' +
      '<td>' + em(b.pickupLocation) + '</td>' +
      '<td>' + em(b.price) + '</td>' +
    '</tr>';
  }

  function renderTable (tbodySel) {
    var tbody = document.querySelector(tbodySel);
    if (!tbody) return;
    tbody.innerHTML = window.SOLO_BATCHES.map(tableRowHtml).join('');
  }

  /* ---------- AUTO-INIT ---------- */
  function autoInit () {
    if (document.querySelector('#batch-track')) {
      renderCarousel('#batch-track', '#batch-dots');
    }
    if (document.querySelector('#batch-table-body')) {
      renderTable('#batch-table-body');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  return {
    renderCarousel: renderCarousel,
    renderTable: renderTable
  };
})();
