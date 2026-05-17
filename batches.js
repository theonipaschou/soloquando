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
    status: 'completed',                // 'confirmed' | 'open' | 'soon' | 'completed'
    statusEyebrow: 'COMPLETED',
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
    status: 'completed',
    statusEyebrow: 'COMPLETED',
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
    cta: 'View batch \u2192'
  },
  {
    id: '003',
    productHtml: '<em>Ergolavoi</em>.',
    productPlain: 'Ergolavoi',
    baker: 'Theoni',
    status: 'soon',
    statusEyebrow: 'COMING SOON',
    cardLine: 'A traditional Greek almond cookie. Soft, chewy, sandwiched with apricot jam. Pre-orders opening soon.',
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
    cta: 'View batch \u2192'
  },
  {
    id: '004',
    productHtml: '<em>VITA.RITUAL</em> Power Box.',
    productPlain: 'VITA.RITUAL Power Box',
    productFullName: 'VITA.RITUAL by Anca',
    baker: 'Anca',
    status: 'open',
    statusEyebrow: 'PRE-ORDERS OPEN',
    cardLine: 'No-sugar, vegan energy balls. Made with ceremonial matcha brought back from Uji, Kyoto.',
    preorderOpensTable: 'Sun 10 May 2026',
    preorderByCarousel: 'Mon 25 May, midnight',
    preorderByTable: 'Mon 25 May 2026, midnight',
    pickupSummary: 'Fri 29 May (Kloten) or Sat 30 May (Z\u00fcrich)',
    pickupTable: 'Fri 29 / Sat 30 May 2026',
    pickupLocation: 'Kloten or central Z\u00fcrich',
    price: 'Trio CHF 7 / Six CHF 14 (1\u20135 per order)',
    priceTable: 'Trio CHF 7 / Six CHF 14',
    image: '/vita-ritual-900.webp',
    imageAlt: 'VITA.RITUAL energy balls on a stone slab beside a matcha bowl, with the brand mark and tagline Daily Rituals Naturally',
    link: '/batch-vita-ritual-004',
    cta: 'Pre-order now \u2192'
  },
  {
    id: '005',
    productHtml: '<em>L\u2019Osanna</em>.',
    productPlain: 'L\u2019Osanna',
    productFullName: 'L\u2019Osanna pralines',
    baker: 'Osanna',
    status: 'open',
    statusEyebrow: 'PRE-ORDERS OPEN',
    cardLine: 'Cheese meets chocolate. Swiss-made pralines from Osanna. 5 boxes needed to make the batch happen.',
    preorderOpensTable: 'Sun 17 May 2026',
    preorderByCarousel: 'Fri 22 May, 12:00',
    preorderByTable: 'Fri 22 May 2026, 12:00',
    pickupSummary: 'Sat 23 May, 11:00 sharp',
    pickupTable: 'Sat 23 May 2026, 11:00',
    pickupLocation: 'central Z\u00fcrich',
    price: '4-pcs CHF 13.80 / 6-pcs CHF 18 / 12-pcs CHF 36 (1\u20135 per order)',
    priceTable: 'CHF 13.80 / 4 \u00b7 CHF 18 / 6 \u00b7 CHF 36 / 12',
    image: '/losanna-6-box-900.webp',
    imageAlt: 'L\u2019Osanna 6-piece cheese-and-chocolate praline gift box',
    link: '/batch-005-losanna',
    cta: 'Pre-order now \u2192'
  },
  {
    id: '006',
    productHtml: '<em>PNOE</em>.',
    productPlain: 'PNOE',
    productFullName: 'PNOE 1L Extra Virgin Olive Oil',
    baker: 'The PNOE family',
    status: 'soon',
    statusEyebrow: 'COMING SOON',
    cardLine: 'One litre of certified extra virgin olive oil from a small family grove in Ilis, Peloponnese. Cold-pressed within hours of harvest. Pre-orders opening soon.',
    preorderOpensTable: 'Sun 17 May 2026',
    preorderByCarousel: 'Fri 5 June, midnight',
    preorderByTable: 'Fri 5 June 2026, midnight',
    pickupSummary: 'Sat 6 June, 11:00 sharp',
    pickupTable: 'Sat 6 June 2026, 11:00',
    pickupLocation: 'central Z\u00fcrich',
    price: 'Simple CHF 19.80 / Gift CHF 24.20 (1 to 5 per order)',
    priceTable: 'Simple CHF 19.80 / Gift CHF 24.20',
    image: '/pnoe-hero-900.webp',
    imageAlt: 'PNOE extra virgin olive oil bottles arranged on a marble surface',
    link: '/batch-006-pnoe',
    cta: 'View batch \u2192'
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
    /* All batches now share the same renderer.
       Visual state is driven by `status`:
         - 'open'      → terra-coloured "live" eyebrow with pulsing dot
         - 'confirmed' → sage-coloured "is-confirmed" styling (faint)
         - 'completed' → sage-tinted "is-completed" styling (done, but still on display)
         - 'soon'      → muted "is-placeholder" styling
       All batches with a link are clickable. */

    var articleClass = 'batch-card is-clickable';
    if (b.status === 'confirmed') articleClass += ' is-confirmed';
    if (b.status === 'completed') articleClass += ' is-completed';
    if (b.status === 'soon')      articleClass += ' is-soon';

    var eyebrowClass = 'batch-card-eyebrow';
    if (b.status === 'open')      eyebrowClass += ' is-live';
    if (b.status === 'completed') eyebrowClass += ' is-completed';
    if (b.status === 'soon')      eyebrowClass += ' is-soon';

    /* Pre-order line: shown for 'open' (current deadline) and 'soon' (when it opens) */
    var preorderLine = '';
    if (b.status === 'open' && b.preorderByCarousel) {
      preorderLine = '<strong>Pre-order by:</strong> ' + esc(b.preorderByCarousel) + '<br/>';
    } else if (b.status === 'soon' && b.preorderOpensTable) {
      preorderLine = '<strong>Opens:</strong> ' + esc(b.preorderOpensTable) + '<br/>';
    }

    var imgHtml = b.image
      ? '<img src="' + esc(b.image) + '" alt="' + esc(b.imageAlt || '') + '" loading="lazy" decoding="async"/>'
      : '<div class="batch-card-img-fallback"><span class="batch-card-img-fallback-mark">' + b.productHtml + '</span></div>';

    var ctaHtml = b.cta
      ? '<p class="batch-card-cta">' + esc(b.cta) + '</p>'
      : '';

    /* Pickup line uses summary for open/confirmed, location-only for soon */
    var pickupLine = (b.status === 'soon')
      ? '<strong>Pickup:</strong> ' + esc(b.pickupSummary || b.pickupLocation)
      : '<strong>Pickup:</strong> ' + esc(b.pickupSummary);

    /* Price line (skip if no price) */
    var priceLine = b.price
      ? '<br/><strong>Price:</strong> ' + esc(b.price)
      : '';

    var cardInner =
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
              pickupLine +
              priceLine +
            '</p>' +
            ctaHtml +
          '</div>' +
        '</article>';

    /* Wrap in <a> only if there's a link */
    return b.link
      ? '<a href="' + esc(b.link) + '" class="batch-card-link">' + cardInner + '</a>'
      : cardInner;
  }

  function dotHtml (b, i) {
    var on = (i === 0) ? ' on' : '';
    return '<button class="carousel-dot' + on + '" data-i="' + i +
           '" aria-label="Batch ' + esc(b.id) + '"></button>';
  }

  /* Sort order for carousel: open first, then soon, then confirmed/completed/closed.
     Within the same status, batches are ordered by id (string compare, so 002 < 003). */
  var CAROUSEL_STATUS_ORDER = { open: 0, soon: 1, confirmed: 2, completed: 3, closed: 4 };

  function sortForCarousel (a, b) {
    var sa = CAROUSEL_STATUS_ORDER[a.status] != null ? CAROUSEL_STATUS_ORDER[a.status] : 99;
    var sb = CAROUSEL_STATUS_ORDER[b.status] != null ? CAROUSEL_STATUS_ORDER[b.status] : 99;
    if (sa !== sb) return sa - sb;
    return (a.id || '').localeCompare(b.id || '');
  }

  function renderCarousel (trackSel, dotsSel) {
    var track = document.querySelector(trackSel);
    if (!track) return;
    var visible = window.SOLO_BATCHES
      .filter(function (b) { return !isHiddenInCarousel(b); })
      .slice()
      .sort(sortForCarousel);
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
      completed: 'Completed',
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
