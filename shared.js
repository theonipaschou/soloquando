/**
 * solo.quando — shared.js
 * Hamburger nav toggle, used by every page.
 * Guard flag prevents double-wiring on pages that already have inline burger JS.
 */
(function () {
  if (window.__soloNavWired) return;
  window.__soloNavWired = true;

  var burger = document.querySelector('.nav-burger');
  var nav    = document.getElementById('main-nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Close menu when any nav link is tapped (mobile UX)
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
})();
