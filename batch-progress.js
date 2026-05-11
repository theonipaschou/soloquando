(function () {
  var section = document.querySelector('[data-batch-id]');
  if (!section) return;

  var batchId = section.getAttribute('data-batch-id');
  var countFile = '/batch-' + batchId + '-count.json?v=' + Date.now();

  function applyCount(reserved, cfg) {
    var min        = cfg.min        || 10;
    var max        = cfg.max        || 60;
    var unit       = cfg.unit       || 'piece';
    var unitPlural = cfg.unit_plural || unit + 's';
    var batchNum   = cfg.batch      || batchId;

    var countEl = document.getElementById('reserved-count');
    if (countEl) countEl.textContent = reserved;

    var bar    = document.getElementById('progress-bar');
    var marker = document.getElementById('threshold-marker');
    var legend = document.getElementById('threshold-legend');
    var pct          = Math.max(0, Math.min(100, (reserved / max) * 100));
    var thresholdPct = Math.max(0, Math.min(100, (min / max) * 100));
    if (bar)    bar.style.width    = pct + '%';
    if (marker) marker.style.left  = pct + '%';
    if (legend) legend.style.left  = thresholdPct + '%';

    var kicker = document.getElementById('status-kicker');
    if (kicker && reserved < max) {
      if (reserved >= min) {
        var rem = max - reserved;
        kicker.textContent = 'Threshold reached. The batch is happening. ' +
          rem + ' ' + (rem === 1 ? unit : unitPlural) + ' remaining.';
      } else {
        var needed = min - reserved;
        kicker.textContent = needed + ' ' + (needed === 1 ? unit : unitPlural) +
          ' away from confirming this batch.';
      }
    }

    if (reserved >= max) {
      var formSection = document.getElementById('reserve');
      if (formSection) {
        formSection.outerHTML =
          '<section class="b1-section alt" id="reserve">' +
            '<div class="wrap"><div class="b1-section-inner">' +
              '<p class="kicker" style="color:var(--terra);">Sold out</p>' +
              '<h2 style="margin-top:14px;">Thank you. Batch ' + batchNum + ' is <em>full</em>.</h2>' +
              '<p>All ' + max + ' ' + unitPlural + ' are spoken for.</p>' +
            '</div></div>' +
          '</section>';
      }
    }
  }

  fetch(countFile)
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (data) {
      var reserved = typeof data.reserved === 'number' ? data.reserved : 0;
      applyCount(reserved, data);
    })
    .catch(function () {
      var countEl  = document.getElementById('reserved-count');
      var fallback = countEl ? parseInt(countEl.textContent, 10) : 0;
      if (!isNaN(fallback) && fallback >= 0) {
        applyCount(fallback, { min: 10, max: 60, unit: 'piece', unit_plural: 'pieces', batch: batchId });
      }
    });
})();
