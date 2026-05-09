/**
 * solo.quando — universal subscribe handler
 * --------------------------------------------------------------
 * Auto-wires up any form on the page with class `js-subscribe`.
 * Posts to /api/subscribe (Cloudflare Worker → Mailchimp).
 *
 * Expected form structure:
 *   <form class="js-subscribe" data-result="#some-id">
 *     <input type="email" name="email" required />
 *     <input type="text" name="_gotcha" style="display:none" />
 *     <input type="hidden" name="source" value="page-name" />
 *     <button type="submit">Subscribe</button>
 *   </form>
 *   <div id="some-id" role="status" aria-live="polite"></div>
 *
 * Behaviour:
 *   - Hides the form on success and shows a message in the result div
 *   - Re-enables the button on failure with an inline error
 *   - Honeypot: if _gotcha is filled, we still show success but never call the API
 * --------------------------------------------------------------
 */
(function () {
  var ENDPOINT = '/api/subscribe';

  function init () {
    var forms = document.querySelectorAll('form.js-subscribe');
    forms.forEach(function (form) { wire(form); });
  }

  function wire (form) {
    var resultSelector = form.getAttribute('data-result');
    var resultEl = resultSelector ? document.querySelector(resultSelector) : null;
    var btn = form.querySelector('button[type=submit]');
    var btnDefaultText = btn ? btn.textContent : '';

    /* What to show on success — falls back to a generic line */
    var successMessage = form.getAttribute('data-success') ||
      'You are on the list. Check your inbox to confirm.';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hideError(form);

      var emailInput = form.querySelector('input[name="email"]');
      var sourceInput = form.querySelector('input[name="source"]');
      var honeypot = form.querySelector('input[name="_gotcha"]');

      var email = (emailInput ? emailInput.value : '').trim();
      var source = (sourceInput ? sourceInput.value : '').trim();
      var gotcha = (honeypot ? honeypot.value : '').trim();

      /* Honeypot: bot — show fake success, never hit the API */
      if (gotcha) {
        showSuccess(form, resultEl, successMessage);
        return;
      }

      if (!email) {
        showError(form, 'Please enter your email address.');
        return;
      }

      if (btn) { btn.disabled = true; btn.textContent = 'Joining\u2026'; }

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, source: source })
      })
        .then(function (res) {
          return res.json().catch(function () { return { ok: false, message: 'Unexpected response.' }; });
        })
        .then(function (data) {
          if (data && data.ok) {
            /* Use server message if it's friendlier than the default;
               otherwise fall back to data-success. */
            var msg = (data.code === 'already_subscribed')
              ? data.message
              : successMessage;
            showSuccess(form, resultEl, msg);
          } else {
            showError(form, (data && data.message) ||
              'Something went wrong. Please try again.');
            if (btn) { btn.disabled = false; btn.textContent = btnDefaultText; }
          }
        })
        .catch(function () {
          showError(form, 'Network error. Please try again, or write to hello@soloquando.ch.');
          if (btn) { btn.disabled = false; btn.textContent = btnDefaultText; }
        });
    });
  }

  function showSuccess (form, resultEl, message) {
    form.style.display = 'none';
    if (resultEl) {
      resultEl.style.display = 'block';
      resultEl.innerHTML = '<p>' + escapeHtml(message) + '</p>';
    }
  }

  function showError (form, message) {
    /* Look for an existing error element next to the form, or create one */
    var errEl = form.querySelector('.js-subscribe-error');
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.className = 'js-subscribe-error';
      errEl.setAttribute('role', 'alert');
      errEl.style.cssText = 'margin-top:12px;font-size:14px;color:#C4622D;';
      form.appendChild(errEl);
    }
    errEl.textContent = message;
    errEl.style.display = 'block';
  }

  function hideError (form) {
    var errEl = form.querySelector('.js-subscribe-error');
    if (errEl) { errEl.style.display = 'none'; }
  }

  function escapeHtml (s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
