/* Light / dark mode. Loaded in <head> so the theme is set before first paint (no flash).
   Order of precedence: the visitor's saved choice, then the device setting. */
(function () {
  var root = document.documentElement, KEY = 'theme';
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var COLORS = { dark: '#101216', light: '#f1f2f4' };

  function saved() { try { var v = localStorage.getItem(KEY); return v === 'light' || v === 'dark' ? v : null; } catch (e) { return null; } }
  function current() { return saved() || (mq && mq.matches ? 'dark' : 'light'); }

  function sync() {
    var t = root.getAttribute('data-theme');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', COLORS[t]);
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      buttons[i].setAttribute('title', t === 'dark' ? 'Light mode' : 'Dark mode');
    }
  }
  function apply(t) { root.setAttribute('data-theme', t); sync(); }

  apply(current());

  if (mq) {
    var onChange = function () { if (!saved()) apply(current()); };
    if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(KEY, next); } catch (x) {}
    root.classList.add('theme-anim');
    apply(next);
    setTimeout(function () { root.classList.remove('theme-anim'); }, 350);
  });

  // buttons rendered later (the project page header is built by React) still get their label
  document.addEventListener('DOMContentLoaded', function () {
    sync();
    if (window.MutationObserver) new MutationObserver(sync).observe(document.body, { childList: true, subtree: true });
  });
})();
