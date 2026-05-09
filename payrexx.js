/* ============================================================
   solo.quando — PAYREXX (single source of truth for payments)
   ------------------------------------------------------------
   One Terminal URL, used by every batch.

   Two integration modes:

   1. MODAL (default) — Payrexx form opens in a modal window
      directly on the soloquando.ch page. Customer never leaves
      the site.
      Limitations:
        - Apple Pay does not work in modals.
        - PostFinance Pay disabled on iOS/macOS.
      All other Swiss methods work fine: TWINT, Visa, Mastercard,
      Google Pay.

   2. REDIRECT (fallback) — full-page redirect to Payrexx.
      All payment methods supported, including Apple Pay.

   Usage from a batch page:
     SoloPayrexx.go({
       amount: 14.00,
       purpose: 'Batch 004 - 1 Six',
       sessionKey: 'sq_vitaritual_order',
       sessionData: { boxes: 1, type: 'six' },
       mode: 'modal',                    // 'modal' (default) or 'redirect'
       onSuccess: function(transaction){...},
       onClose: function(){...}
     });

   PRE-FLIGHT CHECKLIST in your Payrexx admin (one-time setup):
     1. Tools > Terminal > customer fields: Forename, Surname,
        Email, Phone (all mandatory).
     2. Tools > Terminal > Payment type: One-time payment
     3. Tools > Terminal > Look & Feel: pick or create a profile
     4. IMPORTANT: ensure the amount field is HIDDEN or READ-ONLY
        when passed via URL parameter, so customers cannot edit
        the price.
     5. Activate payment providers: TWINT, Visa, Mastercard,
        Google Pay (Apple Pay only works in redirect mode)
   ============================================================ */

window.SoloPayrexx = (function () {

  var TERMINAL_URL = 'https://soloquando.payrexx.com/en/vpos';
  var MODAL_LOADED = false;
  var MODAL_LOADING = null;

  function buildUrl (amount, purpose) {
    var amt = (typeof amount === 'number' ? amount : parseFloat(amount)).toFixed(2);
    var params = [
      'amount=' + encodeURIComponent(amt),
      'currency=CHF',
      'purpose=' + encodeURIComponent(purpose || '')
    ];
    return TERMINAL_URL + '?' + params.join('&');
  }

  function loadModalLibs () {
    if (MODAL_LOADED) { return Promise.resolve(); }
    if (MODAL_LOADING) { return MODAL_LOADING; }

    function loadScript (src) {
      return new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = src;
        s.onload = function () { resolve(); };
        s.onerror = function () { reject(new Error('Failed to load ' + src)); };
        document.head.appendChild(s);
      });
    }

    MODAL_LOADING = (function () {
      var jqPromise = (typeof window.jQuery !== 'undefined')
        ? Promise.resolve()
        : loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js');
      return jqPromise.then(function () {
        return loadScript('https://media.payrexx.com/modal/v1/modal.min.js');
      }).then(function () {
        MODAL_LOADED = true;
      });
    })();
    return MODAL_LOADING;
  }

  function saveSession (opts) {
    if (opts.sessionKey && opts.sessionData) {
      try {
        var payload = {
          amount: opts.amount.toFixed(2),
          purpose: opts.purpose,
          timestamp: new Date().toISOString()
        };
        for (var k in opts.sessionData) {
          if (Object.prototype.hasOwnProperty.call(opts.sessionData, k)) {
            payload[k] = opts.sessionData[k];
          }
        }
        sessionStorage.setItem(opts.sessionKey, JSON.stringify(payload));
      } catch (err) { /* ignore */ }
    }
  }

  function openModal (opts) {
    saveSession(opts);
    var url = buildUrl(opts.amount, opts.purpose);
    var thankYouUrl = opts.thankYouUrl || '/thank-you?form=payment';

    return loadModalLibs().then(function () {
      var $ = window.jQuery;
      var $anchor = $('<a class="solo-payrexx-modal-anchor" href="#" style="display:none;"></a>');
      $anchor.attr('data-href', url);
      $('body').append($anchor);

      $anchor.payrexxModal({
        hidden: function (transaction) {
          if (transaction && typeof opts.onSuccess === 'function') {
            opts.onSuccess(transaction);
          } else if (typeof opts.onClose === 'function') {
            opts.onClose(transaction);
          }
          $anchor.remove();
          /* If a transaction object is present, the payment succeeded.
             Redirect to the generic thank-you page. */
          if (transaction && transaction.uuid) {
            window.location.href = thankYouUrl;
          }
        }
      });

      $anchor[0].click();
    }).catch(function (err) {
      console.error('SoloPayrexx: modal failed to load, falling back to redirect.', err);
      window.location.href = url;
    });
  }

  function openRedirect (opts) {
    saveSession(opts);
    var url = buildUrl(opts.amount, opts.purpose);
    window.location.href = url;
  }

  function go (opts) {
    if (!opts || typeof opts.amount !== 'number' || isNaN(opts.amount)) {
      console.error('SoloPayrexx.go: amount must be a number', opts);
      return false;
    }
    if (!opts.purpose) {
      console.error('SoloPayrexx.go: purpose is required for reconciliation');
      return false;
    }
    var mode = opts.mode || 'modal';
    if (mode === 'redirect') {
      openRedirect(opts);
    } else {
      openModal(opts);
    }
    return true;
  }

  return {
    buildUrl: buildUrl,
    go: go,
    openModal: openModal,
    openRedirect: openRedirect,
    TERMINAL_URL: TERMINAL_URL
  };
})();
