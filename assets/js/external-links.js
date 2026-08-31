// Open every off site link in a new tab.
//
// docmd only does this for links written with the `external:` prefix, so a
// plain [text](https://...) link would otherwise navigate away from the docs.
// This applies the same treatment to every link that points to another host.
(function () {
  'use strict';

  function mark(a) {
    if (a.dataset.externalized) return;
    a.dataset.externalized = '1';

    // skip mailto:, tel:, and anything that is not a web link
    if (a.protocol !== 'http:' && a.protocol !== 'https:') return;
    // relative links, hash links and same host links all resolve to our own host
    if (a.hostname === window.location.hostname) return;

    a.target = '_blank';

    var rel = (a.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
    ['noopener', 'noreferrer'].forEach(function (token) {
      if (rel.indexOf(token) === -1) rel.push(token);
    });
    a.setAttribute('rel', rel.join(' '));
  }

  function scan() {
    var links = document.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) mark(links[i]);
  }

  scan();

  // The site is an SPA, pages are swapped in without a reload, and search
  // results appear on the fly. Rescan when the DOM changes, coalescing bursts
  // into a single pass per frame.
  var queued = false;
  new MutationObserver(function () {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      scan();
    });
  }).observe(document.body, { childList: true, subtree: true });
})();
