/* ============================================================
   solo.quando — BATCHES (single source of truth)
   ------------------------------------------------------------
   Edit ONLY this file to add/update a batch.

   What this file renders into:
     - Homepage carousel:  <div id="batch-track">
                           <div id="batch-dots">
     - Products page table: <tbody id="batch-table-body">

   VISIBILITY:
     - hiddenInCarousel: removes a batch from the homepage carousel only
     - hiddenInTable:    removes a batch from the products-page table only
     - hidden (legacy):  removes from BOTH (kept for backward compatibility)

   Carousel = current/recent batches only (uncluttered)
   Table    = the full schedule, all batches, all statuses

   THE RITUAL:
     - Pre-orders open every Sunday
     - Pre-orders close Friday at 12:00
     - Pickup Saturday at 11:00 sharp
     - Always central Z\u00fcrich, address shared the day before
   ============================================================ */

window.SOLO_BATCHES = [
  {
    id: '001',
    productHtml: 'Strawberry <em>marmalade</em>.',
    productPlain: 'Strawberry marmalade',
    baker: 'Theoni',
    status: 'confirmed',                // 'confirmed' | 'open' | 'soon'
    statusEyebrow: 'CONFIRMED',
    cardLine: 'A Greek recipe from my grandmother. Slow-simmered with strawberries from a farm near Z\u00fcrich.',
    preorderOpensTable: 'Mon 4 May 2026',
    preorderByCarousel: null,
    preorderByTable: 'Mon 4 May 2026',
    pickupSummary: 'Friday 8 May, central Z\u00fcrich',
    pickupTable: 'Fri 8 May 2026',
    pickupLocation: 'central Z\u00fcrich',
    price: 'CHF 14 per jar',
    priceTable: 'CHF 14 / jar',
    image: '/marmjar.png',
    imageAlt: 'Strawberry marmalade in a glass jar with fresh strawberries and lemon on a wooden table',
    link: '/batch-strawberry-marmalade-001',
    cta: 'View batch \u2192'
  },
  {
    id: '002',
    productHtml: '<em>Mousto</em>.',
    productPlain: 'Mousto',
    productFullName: 'Moustokouloura',
    baker: 'Theoni',
    status: 'open',
    statusEyebrow: 'PRE-ORDERS OPEN',
    cardLine: 'A very traditional Greek cookie. Petimezi, olive oil, cinnamon. Made by hand, made only when you want it.',
    preorderOpensTable: 'Sun 10 May 2026',
    preorderByCarousel: 'Fri 15 May, 12:00',
    preorderByTable: 'Fri 15 May 2026, 12:00',
    pickupSummary: 'Sat 16 May, 11:00 sharp',
    pickupTable: 'Sat 16 May 2026, 11:00',
    pickupLocation: 'central Z\u00fcrich',
    price: 'CHF 3.50 per piece (1\u20135 per order)',
    priceTable: 'CHF 3.50 / piece',
    image: '/mousto-900.jpg',
    imageAlt: 'Greek moustokouloura with sesame seeds and coffee',
    link: '/batch-moustokouloura-002',
    cta: 'Pre-order now \u2192'
  },
  {
    id: '003',
    productHtml: '<em>Ergolavoi</em>.',
    productPlain: 'Ergolavoi',
    baker: 'Theoni',
    status: 'soon',
    hiddenInCarousel: true,              // hidden from homepage until ready
    hiddenInTable: false,                // visible on /products schedule
    statusEyebrow: 'COMING SOON',
    cardLine: 'A traditional Greek almond cookie. Soft, chewy, sandwiched with apricot jam. Pre-orders open Sun 17 May.',
    preorderOpensTable: 'Sun 17 May 2026',
    preorderByCarousel: 'Fri 22 May, 12:00',
    preorderByTable: 'Fri 22 May 2026, 12:00',
    pickupSummary: 'Sat 23 May, 11:00 sharp',
    pickupTable: 'Sat 23 May 2026, 11:00',
    pickupLocation: 'central Z\u00fcrich',
    price: 'CHF 9 per portion (1\u20135 per order)',
    priceTable: 'CHF 9 / portion',
    image: '/ergolavoi-hero.webp',
    imageAlt: 'Greek ergolavoi almond cookies dusted with powdered sugar on a wooden tray',
    link: '/batch-ergolavoi-003',
    cta: null
  },
  {
    id: '004',
    productHtml: '<em>VITA.RITUAL</em> Power Box.',
    productPlain: 'VITA.RITUAL Power Box',
    productFullName: 'VITA.RITUAL by Anca',
    baker: 'Anca',
    status: 'soon',
    hiddenInCarousel: true,              // hidden from homepage until ready
    hiddenInTable: false,                // visible on /products schedule
    statusEyebrow: 'COMING SOON',
    cardLine: 'No-sugar, vegan energy balls. Made with ceremonial matcha brought back from Uji, Kyoto. Pre-orders open Sun 24 May.',
    preorderOpensTable: 'Sun 24 May 2026',
    preorderByCarousel: 'Fri 29 May, 12:00',
    preorderByTable: 'Fri 29 May 2026, 12:00',
    pickupSummary: 'Sat 30 May, 11:00 sharp',
    pickupTable: 'Sat 30 May 2026, 11:00',
    pickupLocation: 'central Z\u00fcrich',
    price: 'Trio CHF 7 / Six CHF 14 (1\u20135 per order)',
    priceTable: 'Trio CHF 7 / Six CHF 14',
    image: null,
    imageAlt: '',
    link: '/batch-vita-ritual-004',
    cta: null
  }
];

/* ============================================================
   RENDERERS
   ============================================================ */
window.SoloBatches = (function () {

  /* Inject fallback CSS for imageless active cards (used when image is null).
     Keeps index.html and products-2.html untouched. */
  (function injectStyles () {
    if (document.getElementById('solo-batches-fallback-css')) return;
    var s = document.createElement('style');
    s.id = 'solo-batches-fallback-css';
    s.textContent = ''
      + '.batch-card-img-fallback{width:100%;height:100%;display:flex;align-items:center;justify-content:center;'
      +   'padding:24px;text-align:center;'
      +   'background:linear-gradient(135deg,rgba(194,102,61,.06) 0%,rgba(122,139,106,.06) 100%);'
      +   'position:relative;}'
      + '.batch-card-img-fallback::before{content:"";position:absolute;top:50%;left:50%;width:80%;height:1px;'
      +   'background:rgba(43,26,15,.08);transform:translate(-50%,-50%);}'
      + '.batch-card-img-fallback-mark{font-family:\'Cormorant Garamond\',serif;font-size:30px;line-height:1.2;'
      +   'color:rgba(43,26,15,.65);position:relative;background:var(--bone);padding:8px 18px;}'
      + '.batch-card-img-fallback-mark em{color:var(--terra);font-style:italic;}';
    (document.head || document.documentElement).appendChild(s);
  })();

  function esc (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* Visibility helpers — backward compatible with old `hidden` flag */
  function isHiddenInCarousel (b) {
    if (b.hiddenInCarousel === true) return true;
    if (b.hiddenInCarousel === false) return false;
    return b.hidden === true;  // fallback to legacy
  }
  function isHiddenInTable (b) {
    if (b.hiddenInTable === true) return true;
    if (b.hiddenInTable === false) return false;
    return b.hidden === true;  // fallback to legacy
  }

  /* ---------- CAROUSEL CARD (homepage CSS) ---------- */
  function carouselCardHtml (b) {
    // PLACEHOLDER (status === 'soon')
    if (b.status === 'soon') {
      var phImgHtml = b.image
        ? '<img src="' + esc(b.image) + '" alt="' + esc(b.imageAlt || '') + '" loading="lazy" decoding="async"/>'
        : '';
      return '' +
        '<article class="batch-card is-placeholder">' +
          '<div class="batch-card-img">' + phImgHtml + '</div>' +
          '<div class="batch-card-text">' +
            '<p class="batch-card-eyebrow">BATCH ' + esc(b.id) + ' &middot; ' + esc(b.statusEyebrow) + '</p>' +
            '<h3 class="batch-card-title">' + b.productHtml + '</h3>' +
            '<p class="batch-card-desc">' + esc(b.cardLine) + '</p>' +
            '<p class="batch-card-meta">' +
              '<strong>Baker:</strong> ' + esc(b.baker) + '<br/>' +
              '<strong>Pickup:</strong> ' + esc(b.pickupLocation) +
            '</p>' +
          '</div>' +
        '</article>';
    }

    // ACTIVE CARD
    var articleClass = 'batch-card is-clickable' + (b.status === 'confirmed' ? ' is-confirmed' : '');
    var eyebrowClass = 'batch-card-eyebrow' + (b.status === 'open' ? ' is-live' : '');

    var preorderLine = (b.status === 'open' && b.preorderByCarousel)
      ? '<strong>Pre-order by:</strong> ' + esc(b.preorderByCarousel) + '<br/>'
      : '';

    var imgHtml = b.image
      ? '<img src="' + esc(b.image) + '" alt="' + esc(b.imageAlt) + '" loading="lazy" decoding="async"/>'
      : '<div class="batch-card-img-fallback"><span class="batch-card-img-fallback-mark">' + b.productHtml + '</span></div>';

    return '' +
      '<a href="' + esc(b.link) + '" class="batch-card-link">' +
        '<article class="' + articleClass + '">' +
          '<div class="batch-card-img">' +
            imgHtml +
          '</div>' +
          '<div class="batch-card-text">' +
            '<p class="' + eyebrowClass + '">BATCH ' + esc(b.id) + ' &middot; ' + esc(b.statusEyebrow) + '</p>' +
            '<h3 class="batch-card-title">' + b.productHtml + '</h3>' +
            '<p class="batch-card-desc">' + esc(b.cardLine) + '</p>' +
            '<p class="batch-card-meta">' +
              '<strong>Baker:</strong> ' + esc(b.baker) + '<br/>' +
              preorderLine +
              '<strong>Pickup:</strong> ' + esc(b.pickupSummary) + '<br/>' +
              '<strong>Price:</strong> ' + esc(b.price) +
            '</p>' +
            '<p class="batch-card-cta">' + esc(b.cta) + '</p>' +
          '</div>' +
        '</article>' +
      '</a>';
  }

  function dotHtml (b, i) {
    var on = (i === 0) ? ' on' : '';
    return '<button class="carousel-dot' + on + '" data-i="' + i +
           '" aria-label="Batch ' + esc(b.id) + '"></button>';
  }

  function renderCarousel (trackSel, dotsSel) {
    var track = document.querySelector(trackSel);
    if (!track) return;
    var visible = window.SOLO_BATCHES.filter(function(b){ return !isHiddenInCarousel(b); });
    track.innerHTML = visible.map(carouselCardHtml).join('\n');

    if (dotsSel) {
      var dots = document.querySelector(dotsSel);
      if (dots) dots.innerHTML = visible.map(dotHtml).join('');
    }
    // Navigation wiring is left to the host page's existing inline carousel JS.
  }

  /* ---------- PRODUCTS-PAGE TABLE ROW ---------- */
  function tableRowHtml (b) {
    var isPlaceholder = (b.status === 'soon');
    var dim = isPlaceholder ? ' class="row-dim"' : '';
    var em  = function (v) { return v == null ? '\u2014' : esc(v); };

    var statusLabelMap = {
      confirmed: 'Confirmed',
      open: 'Pre-orders open',
      soon: 'Coming soon'
    };
    var statusCell = '<span class="status-pill status-pill-' + esc(b.status) + '">' +
                     esc(statusLabelMap[b.status] || b.status) + '</span>';

    /* Make product name clickable for ALL batches that have a link
       (even 'soon' batches when the page exists) */
    var productCell = (b.link
      ? '<a href="' + esc(b.link) + '">' + b.productHtml + '</a>'
      : b.productHtml);

    return '<tr' + dim + '>' +
      '<td class="cell-id">' + esc(b.id) + '</td>' +
      '<td>' + productCell + '</td>' +
      '<td>' + em(b.baker === 'waiting' ? null : b.baker) + '</td>' +
      '<td>' + statusCell + '</td>' +
      '<td>' + em(b.preorderOpensTable) + '</td>' +
      '<td>' + em(b.preorderByTable) + '</td>' +
      '<td>' + em(b.pickupTable) + '</td>' +
      '<td>' + em(b.pickupLocation) + '</td>' +
      '<td>' + em(b.priceTable) + '</td>' +
    '</tr>';
  }

  function renderTable (tbodySel) {
    var tbody = document.querySelector(tbodySel);
    if (!tbody) return;
    tbody.innerHTML = window.SOLO_BATCHES
      .filter(function(b){ return !isHiddenInTable(b); })
      .map(tableRowHtml).join('');
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
    renderTable: renderTable,
    carouselCardHtml: carouselCardHtml,
    tableRowHtml: tableRowHtml
  };
})();
