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
    var batchName  = cfg.name       || ('Batch ' + batchNum);

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
    if (kicker) {
      if (reserved >= max) {
        kicker.textContent = 'Sold out. Join the waiting list below for the next batch or a returned spot.';
      } else if (reserved >= min) {
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
      replaceFormWithWaitlist(batchNum, batchName, max, unitPlural);
    }
  }

  /* Replace the order form section with a waiting-list signup.
     Reuses the dark b1-form-s / b1-cs-inner / b1-form-card classes
     so it stays visually consistent with the original order form.
     POSTs to /api/subscribe with source = batch-<id>-waitlist. */
  function replaceFormWithWaitlist(batchNum, batchName, max, unitPlural) {
    var formSection = document.getElementById('reserve');
    if (!formSection) return;
    /* Avoid double-replacement if applyCount is called more than once */
    if (formSection.getAttribute('data-mode') === 'waitlist') return;

    var sourceTag = 'batch-' + batchNum + '-waitlist';

    formSection.outerHTML =
      '<section class="b1-form-s" id="reserve" data-mode="waitlist">' +
        '<div class="wrap">' +
          '<div class="b1-cs-inner">' +
            '<p class="kicker">Sold out</p>' +
            '<h2>Batch ' + batchNum + ' is <em>full</em>.</h2>' +
            '<p>All ' + max + ' ' + unitPlural + ' have been reserved. ' +
              'Join the waiting list and we will write to you the moment a spot opens here, ' +
              'or as soon as the next batch goes live.</p>' +
          '</div>' +
          '<div class="b1-form-inner" style="margin-top:48px;">' +
            '<div class="b1-form-card">' +
              '<form id="batch-waitlist-form" novalidate>' +
                '<input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off"/>' +
                '<input type="hidden" name="source" value="' + sourceTag + '"/>' +
                '<label>' +
                  '<span class="f-label">Email *</span>' +
                  '<input class="f-input" type="email" name="email" placeholder="your@email.ch" required/>' +
                '</label>' +
                '<label style="margin-bottom:22px;">' +
                  '<span class="f-label">Notes (optional)</span>' +
                  '<textarea class="f-input" name="notes" placeholder="How many you wanted, any preferences, anything else worth knowing."></textarea>' +
                '</label>' +
                '<div class="b1-form-result err" id="waitlist-error" role="alert" style="display:none;">' +
                  '<p id="waitlist-error-msg">Please enter a valid email.</p>' +
                '</div>' +
                '<button type="submit" class="b1-form-submit" id="waitlist-submit">' +
                  'Join the waiting list &rarr;' +
                '</button>' +
                '<p style="margin-top:18px;font-size:13px;color:rgba(245,239,228,.55);text-align:center;letter-spacing:.04em;line-height:1.6;">' +
                  'No spam. We only write when there is something worth saying.' +
                '</p>' +
              '</form>' +
              '<div id="waitlist-success" style="display:none;text-align:center;padding:30px 10px;">' +
                '<p style="font-family:\'Cormorant Garamond\',serif;font-size:28px;color:#F5EFE4;line-height:1.2;">You are on the list.</p>' +
                '<p style="font-size:14px;color:rgba(245,239,228,.65);margin-top:10px;line-height:1.6;">We will write the moment a spot opens, or as soon as the next batch goes live.</p>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>';

    wireWaitlistForm();
  }

  function wireWaitlistForm() {
    var form = document.getElementById('batch-waitlist-form');
    if (!form) return;
    var btn = document.getElementById('waitlist-submit');
    var btnDefault = btn ? btn.innerHTML : '';
    var errBox = document.getElementById('waitlist-error');
    var errMsg = document.getElementById('waitlist-error-msg');
    var successBox = document.getElementById('waitlist-success');

    function showError(msg) {
      if (errMsg) errMsg.textContent = msg;
      if (errBox) errBox.style.display = 'block';
    }
    function hideError() { if (errBox) errBox.style.display = 'none'; }
    function showSuccess() {
      form.style.display = 'none';
      if (successBox) successBox.style.display = 'block';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hideError();

      var emailInput = form.querySelector('input[name="email"]');
      var sourceInput = form.querySelector('input[name="source"]');
      var notesInput = form.querySelector('textarea[name="notes"]');
      var honeypot = form.querySelector('input[name="_gotcha"]');

      var email = ((emailInput && emailInput.value) || '').trim();
      var source = ((sourceInput && sourceInput.value) || '').trim();
      var notes = ((notesInput && notesInput.value) || '').trim();
      var gotcha = ((honeypot && honeypot.value) || '').trim();

      /* Honeypot: bot caught. Show fake success, never call the API. */
      if (gotcha) { showSuccess(); return; }

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        showError('Please enter a valid email address.');
        return;
      }

      if (btn) { btn.disabled = true; btn.innerHTML = 'Joining…'; }

      fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, source: source, notes: notes })
      })
        .then(function (r) {
          return r.json().catch(function () { return { ok: false, message: 'Unexpected response.' }; });
        })
        .then(function (data) {
          if (data && data.ok) {
            showSuccess();
          } else {
            showError((data && data.message) || 'Something went wrong. Please try again, or write to hello@soloquando.ch.');
            if (btn) { btn.disabled = false; btn.innerHTML = btnDefault; }
          }
        })
        .catch(function () {
          showError('Network error. Please try again, or write to hello@soloquando.ch.');
          if (btn) { btn.disabled = false; btn.innerHTML = btnDefault; }
        });
    });
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
