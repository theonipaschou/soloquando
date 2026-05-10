/* ============================================================
   solo.quando — BATCHES RENDER (products page only)
   ------------------------------------------------------------
   Reads window.SOLO_BATCHES (set by batches.js) and renders:
   1. Status anchor bar
   2. Open Now section   (#open-cards)
   3. Coming Soon section (#soon-cards)
   4. Confirmed/Completed section (#past-cards)

   Status values recognised:
     'open'      — Pre-orders live right now (most prominent)
     'soon'      — Pre-orders open soon, date known
     'confirmed' — Threshold met, baking done or in progress
     'completed' — Picked up, fully archived
     'closed'    — Did not reach threshold (shown dimmed)

   To add a new status later, add it to the STATUS_ORDER array
   and add a render case below.
   ============================================================ */

(function () {
  'use strict';

  // Wait for batches.js to have set window.SOLO_BATCHES
  // batches.js runs synchronously before this file so SOLO_BATCHES is ready
  var batches = window.SOLO_BATCHES;
  if (!batches || !batches.length) return;

  // ── Partition by status ──────────────────────────────────
  var open      = batches.filter(function(b){ return b.status === 'open'; });
  var soon      = batches.filter(function(b){ return b.status === 'soon'; });
  var past      = batches.filter(function(b){
    return b.status === 'confirmed' || b.status === 'completed' || b.status === 'closed';
  });

  // ── Status bar tabs ──────────────────────────────────────
  var tabsEl = document.getElementById('status-bar-tabs');
  if (tabsEl) {
    var tabsHtml = '';
    if (open.length) {
      tabsHtml += '<a href="#open-now" class="status-tab is-open-tab">' +
        '<span class="status-dot"></span>Open now (' + open.length + ')' +
        '</a>';
    }
    if (soon.length) {
      tabsHtml += '<a href="#coming-soon" class="status-tab">Coming soon (' + soon.length + ')</a>';
    }
    if (past.length) {
      tabsHtml += '<a href="#confirmed" class="status-tab">Archive</a>';
    }
    tabsHtml += '<a href="#registry" class="status-tab" style="margin-left:auto;">All batches &darr;</a>';
    tabsEl.innerHTML = tabsHtml;
  }

  // ── Helper: escape HTML ──────────────────────────────────
  function esc(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // ── Render: Open Now ─────────────────────────────────────
  var openEl = document.getElementById('open-cards');
  if (openEl) {
    if (!open.length) {
      openEl.innerHTML = '<p class="section-empty" style="padding:32px 0;">No batches are open right now. Subscribe below to hear first.</p>';
    } else {
      var openHtml = '';
      open.forEach(function(b) {
        var hasLink = !!b.link;
        var wrapTag = hasLink ? 'a href="' + esc(b.link) + '"' : 'div';
        var closeTag = hasLink ? 'a' : 'div';
        openHtml +=
          '<' + wrapTag + ' class="open-card-wrap" aria-label="' + esc(b.productPlain) + '">' +
            '<div class="batch-card-img">' +
              (b.image
                ? '<img src="' + esc(b.image) + '" alt="' + esc(b.imageAlt || b.productPlain) + '" loading="lazy"/>'
                : '') +
            '</div>' +
            '<div class="open-card-content">' +
              '<p class="open-card-eyebrow">' +
                '<span class="status-dot"></span>' +
                esc(b.statusEyebrow || 'Pre-orders open') +
              '</p>' +
              '<h2 class="open-card-title">' + (b.productHtml || esc(b.productPlain)) + '</h2>' +
              (b.cardLine ? '<p class="open-card-desc">' + esc(b.cardLine) + '</p>' : '') +
              '<div class="open-card-meta">' +
                (b.preorderByCarousel ? '<div><strong>Order by</strong> ' + esc(b.preorderByCarousel) + '</div>' : '') +
                (b.pickupSummary ? '<div><strong>Pickup</strong> ' + esc(b.pickupSummary) + '</div>' : '') +
                (b.price ? '<div><strong>Price</strong> ' + esc(b.price) + '</div>' : '') +
              '</div>' +
              (hasLink ? '<span class="open-card-btn">' + esc(b.cta || 'Pre-order now') + '</span>' : '') +
            '</div>' +
          '</' + closeTag + '>';
      });
      openEl.innerHTML = openHtml;
    }
  }

  // ── Render: Coming Soon ───────────────────────────────────
  var soonEl = document.getElementById('soon-cards');
  if (soonEl) {
    if (!soon.length) {
      soonEl.closest('section').style.display = 'none';
    } else {
      var soonHtml = '';
      soon.forEach(function(b) {
        var hasLink = !!b.link;
        var wrapTag = hasLink ? 'a href="' + esc(b.link) + '" class="soon-card-link"' : 'div class="soon-card-link"';
        var closeTag = hasLink ? 'a' : 'div';
        soonHtml +=
          '<div class="soon-card">' +
            '<' + wrapTag + '>' +
              '<div class="soon-card-img">' +
                (b.image
                  ? '<img src="' + esc(b.image) + '" alt="' + esc(b.imageAlt || b.productPlain) + '" loading="lazy"/>'
                  : '') +
                '<div class="soon-card-img-overlay"></div>' +
              '</div>' +
              '<div class="soon-card-text">' +
                '<p class="soon-card-eyebrow">' + esc(b.statusEyebrow || 'Coming soon') + '</p>' +
                '<h3 class="soon-card-title">' + (b.productHtml || esc(b.productPlain)) + '</h3>' +
                (b.cardLine ? '<p class="soon-card-desc">' + esc(b.cardLine) + '</p>' : '') +
                (b.preorderOpensTable
                  ? '<p class="soon-card-opens"><strong>Opens</strong> ' + esc(b.preorderOpensTable) + '</p>'
                  : '') +
              '</div>' +
            '</' + closeTag + '>' +
          '</div>';
      });
      soonEl.innerHTML = soonHtml;
    }
  }

  // ── Render: Confirmed / Past ──────────────────────────────
  var pastEl = document.getElementById('past-cards');
  if (pastEl) {
    if (!past.length) {
      pastEl.closest('section').style.display = 'none';
    } else {
      var pastHtml = '';
      past.forEach(function(b) {
        var isDim = b.status === 'closed';
        var statusLabel = b.status === 'confirmed' ? 'Confirmed'
          : b.status === 'completed' ? 'Completed'
          : 'Closed';
        var pickupDone = b.pickupTable || '';
        pastHtml +=
          '<div class="past-item' + (isDim ? ' row-dim' : '') + '">' +
            '<span class="past-item-num">' + esc(b.id || '') + '</span>' +
            '<div>' +
              (b.link
                ? '<a href="' + esc(b.link) + '" class="past-item-link">' +
                    '<div class="past-item-name">' + (b.productHtml || esc(b.productPlain)) + '</div>' +
                  '</a>'
                : '<div class="past-item-name">' + (b.productHtml || esc(b.productPlain)) + '</div>') +
              '<div class="past-item-sub">' +
                esc(b.baker || '') +
                (pickupDone ? ' &middot; Pickup ' + esc(pickupDone) : '') +
                ' &middot; ' + esc(b.priceTable || b.price || '') +
              '</div>' +
            '</div>' +
            (b.link
              ? '<a href="' + esc(b.link) + '" class="past-item-cta">' + esc(statusLabel) + ' &rarr;</a>'
              : '<span class="past-item-cta" style="opacity:.4;">' + esc(statusLabel) + '</span>') +
          '</div>';
      });
      pastEl.innerHTML = pastHtml;
    }
  }

  // ── Smooth scroll for status bar ──────────────────────────
  document.querySelectorAll('.status-tab[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var offset = 88 + 52; // nav + status bar height
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

})();
