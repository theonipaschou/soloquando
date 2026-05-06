/* ============================================================
   solo.quando — BATCHES (single source of truth)
   ------------------------------------------------------------
   Edit ONLY this file to add/update a batch.

   What this file renders into:
     - Homepage carousel:  <div id="batch-track">
                           <div id="batch-dots">
     - Products page table: <tbody id="batch-table-body">

   Renders into the homepage's existing .batch-card-* CSS, so
   visual output matches the previously-hardcoded cards exactly.
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
    preorderByCarousel: null,                            // confirmed: not shown in carousel
    preorderByTable: 'Mon 4 May 2026',                   // shown in table
    pickupSummary: 'Friday 8 May, central Z\u00fcrich',  // for carousel meta line
    pickupTable: 'Fri 8 May 2026',                       // for table cell
    pickupLocation: 'central Z\u00fcrich',
    price: 'CHF 14 per jar',                              // carousel
    priceTable: 'CHF 14 / jar',                           // table
    image: '/batch-jar-900.jpg',
    imageAlt: 'Strawberry marmalade in a glass jar with fresh strawberries and lemon on a wooden table',
    link: '/batch-strawberry-marmalade-001',
    cta: 'View batch \u2192'
  },
  {
    id: '002',
    productHtml: '<em>Mousto</em>.',                      // homepage uses short form
    productPlain: 'Mousto',
    productFullName: 'Moustokouloura',
    baker: 'Theoni',
    status: 'open',
    statusEyebrow: 'PRE-ORDERS OPEN',
    cardLine: 'A very traditional Greek cookie. Petimezi, olive oil, cinnamon. Made by hand, made only when you want it.',
    preorderByCarousel: 'Sun 10 May',                    // homepage carousel: no year
    preorderByTable: 'Sun 10 May 2026',                  // homepage table: with year
    pickupSummary: 'Wed 13 or Sat 16 May',
    pickupTable: 'Wed 13 or Sat 16 May',
    pickupLocation: 'central Z\u00fcrich',
    price: 'CHF 3.50 per piece (1\u20135 per order)',
    priceTable: 'CHF 3.50 / piece',
    image: '/batch-mousto-900.jpg',
    imageAlt: 'Greek moustokouloura with sesame seeds and coffee',
    link: '/batch-moustokouloura-002',
    cta: 'Pre-order now \u2192'
  },
  {
    id: '003',
    productHtml: 'Yours, <em>perhaps</em>?',
    productPlain: null,
    baker: 'waiting',
    status: 'soon',
    statusEyebrow: 'COMING SOON',
    cardLine: 'Another baker. Another recipe. Another Sunday morning in Z\u00fcrich.',
    preorderByCarousel: null,
    preorderByTable: null,
    pickupSummary: 'central Z\u00fcrich',
    pickupTable: null,
    pickupLocation: 'central Z\u00fcrich',
    price: null,
    priceTable: null,
    image: null,
    imageAlt: null,
    link: null,
    cta: null
  }
];

/* ============================================================
   RENDERERS
   ============================================================ */
window.SoloBatches = (function () {

  function esc (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---------- CAROUSEL CARD (homepage CSS) ---------- */
  function carouselCardHtml (b) {
    // PLACEHOLDER (status === 'soon')
    if (b.status === 'soon') {
      return '' +
        '<article class="batch-card is-placeholder">' +
          '<div class="batch-card-img"></div>' +
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

    return '' +
      '<a href="' + esc(b.link) + '" class="batch-card-link">' +
        '<article class="' + articleClass + '">' +
          '<div class="batch-card-img">' +
            '<img src="' + esc(b.image) + '" alt="' + esc(b.imageAlt) + '" loading="lazy" decoding="async"/>' +
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
    track.innerHTML = window.SOLO_BATCHES.map(carouselCardHtml).join('\n');

    if (dotsSel) {
      var dots = document.querySelector(dotsSel);
      if (dots) dots.innerHTML = window.SOLO_BATCHES.map(dotHtml).join('');
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

    var productCell = isPlaceholder
      ? '\u2014'
      : (b.link
          ? '<a href="' + esc(b.link) + '">' + b.productHtml + '</a>'
          : b.productHtml);

    return '<tr' + dim + '>' +
      '<td class="cell-id">' + esc(b.id) + '</td>' +
      '<td>' + productCell + '</td>' +
      '<td>' + em(b.baker === 'waiting' ? null : b.baker) + '</td>' +
      '<td>' + statusCell + '</td>' +
      '<td>' + em(b.preorderByTable) + '</td>' +
      '<td>' + em(b.pickupTable) + '</td>' +
      '<td>' + em(b.pickupLocation) + '</td>' +
      '<td>' + em(b.priceTable) + '</td>' +
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
    renderTable: renderTable,
    carouselCardHtml: carouselCardHtml,
    tableRowHtml: tableRowHtml
  };
})();
