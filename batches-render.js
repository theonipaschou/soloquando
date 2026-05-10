/* ============================================================
   solo.quando — BATCHES RENDER (products page)
   ------------------------------------------------------------
   Reads window.SOLO_BATCHES (set by batches.js) and renders
   three accordion sections, each using the same card structure:

     #grid-open  — status === 'open'
     #grid-soon  — status === 'soon'
     #grid-done  — status === 'confirmed' | 'completed' | 'closed'

   Card structure is identical across statuses; only the colour
   accent and a few labels (eyebrow, meta, CTA) change.
   ============================================================ */

(function () {
  'use strict';

  var batches = window.SOLO_BATCHES;
  if (!batches || !batches.length) return;

  // ── Partition by status ──────────────────────────────────
  var groups = {
    open: batches.filter(function (b) { return b.status === 'open'; }),
    soon: batches.filter(function (b) { return b.status === 'soon'; }),
    done: batches.filter(function (b) {
      return b.status === 'confirmed' || b.status === 'completed' || b.status === 'closed';
    })
  };

  // ── Helpers ──────────────────────────────────────────────
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Returns { eyebrow, metaRows, cta } for a given batch
  function cardCopy(b) {
    var s = b.status;
    if (s === 'open') {
      return {
        eyebrow: b.statusEyebrow || 'Pre-orders open',
        metaRows: [
          b.preorderByCarousel ? ['Order by', b.preorderByCarousel] : null,
          b.pickupSummary      ? ['Pickup',   b.pickupSummary]      : null,
          b.price              ? ['Price',    b.price]              : null
        ],
        cta: b.cta || 'Pre-order now'
      };
    }
    if (s === 'soon') {
      return {
        eyebrow: b.statusEyebrow || 'Coming soon',
        metaRows: [
          b.preorderOpensTable ? ['Opens',  b.preorderOpensTable] : null,
          b.pickupSummary      ? ['Pickup', b.pickupSummary]      : null,
          b.price              ? ['Price',  b.price]              : null
        ],
        cta: b.cta || 'View batch'
      };
    }
    // confirmed / completed / closed
    var label = s === 'completed' ? 'Completed'
              : s === 'closed'    ? 'Threshold not reached'
              :                     'Confirmed';
    return {
      eyebrow: b.statusEyebrow || label,
      metaRows: [
        b.pickupTable ? ['Picked up', b.pickupTable] : null,
        b.price       ? ['Price',     b.price]       : null
      ],
      cta: b.cta || 'View batch'
    };
  }

  // Status -> CSS modifier on the card
  function cardModifier(s) {
    if (s === 'open') return 'bcard--open';
    if (s === 'soon') return 'bcard--soon';
    return 'bcard--done';
  }

  // Build a single card's HTML
  function renderCard(b) {
    var copy = cardCopy(b);
    var hasLink = !!b.link;
    var openTag = hasLink
      ? '<a class="bcard-link" href="' + esc(b.link) + '">'
      : '<div class="bcard-link">';
    var closeTag = hasLink ? '</a>' : '</div>';

    var metaHtml = copy.metaRows
      .filter(function (row) { return row; })
      .map(function (row) {
        return '<div><strong>' + esc(row[0]) + '</strong> ' + esc(row[1]) + '</div>';
      })
      .join('');

    return '' +
      '<div class="bcard ' + cardModifier(b.status) + '">' +
        openTag +
          '<div class="bcard-img">' +
            (b.image
              ? '<img src="' + esc(b.image) + '" alt="' +
                esc(b.imageAlt || b.productPlain || '') + '" loading="lazy"/>'
              : '') +
          '</div>' +
          '<div class="bcard-body">' +
            '<p class="bcard-eyebrow"><span class="dot"></span>' + esc(copy.eyebrow) + '</p>' +
            '<h3 class="bcard-title">' + (b.productHtml || esc(b.productPlain || '')) + '</h3>' +
            (b.cardLine ? '<p class="bcard-desc">' + esc(b.cardLine) + '</p>' : '') +
            (metaHtml ? '<div class="bcard-meta">' + metaHtml + '</div>' : '') +
            (hasLink ? '<span class="bcard-cta">' + esc(copy.cta) + ' &rarr;</span>' : '') +
          '</div>' +
        closeTag +
      '</div>';
  }

  // Empty-state HTML per section
  function emptyMessage(key) {
    if (key === 'open') return 'No batches are open right now. Subscribe below to hear first.';
    if (key === 'soon') return 'Nothing on the horizon yet.';
    return 'No completed batches yet.';
  }

  // ── Render each section ──────────────────────────────────
  ['open', 'soon', 'done'].forEach(function (key) {
    var grid = document.getElementById('grid-' + key);
    var countEl = document.getElementById('count-' + key);
    var list = groups[key];

    if (countEl) countEl.textContent = '(' + list.length + ')';

    if (!grid) return;

    if (list.length === 0) {
      grid.innerHTML = '<p class="batch-section-empty">' + emptyMessage(key) + '</p>';
      grid.style.gridTemplateColumns = '1fr';
    } else {
      grid.innerHTML = list.map(renderCard).join('');
    }
  });

})();
