// by claude
// GoatCounter page views: counts each SPA page change and shows the page's
// view count in the page footer (plus the site total on the home page).
(function () {
  'use strict';

  var ENDPOINT = 'https://namida.goatcounter.com';
  var BADGE_CLASS = 'summer-pagefooter__views';

  if (location.protocol === 'file:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1') return;

  window.goatcounter = { endpoint: ENDPOINT + '/count', no_onload: true, no_events: true };

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.addEventListener('load', function () {
    count();
  });
  document.head.appendChild(script);

  function pagePath() {
    return location.pathname.replace(/index\.html$/, '');
  }

  function count() {
    if (!window.goatcounter || !window.goatcounter.count) return;
    window.goatcounter.count({ path: pagePath() });
  }

  function fetchCount(path) {
    return fetch(ENDPOINT + '/counter/' + encodeURIComponent(path) + '.json')
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (json) { return json ? json.count : null; })
      .catch(function () { return null; });
  }

  function renderBadge(path) {
    var footer = document.querySelector('.summer-pagefooter');
    if (!footer || footer.querySelector('.' + BADGE_CLASS)) return;

    var badge = document.createElement('span');
    badge.className = BADGE_CLASS;
    badge.hidden = true;
    badge.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>' +
      '<span></span>';
    footer.insertBefore(badge, footer.firstChild);

    var label = badge.lastChild;
    var requests = [fetchCount(path)];
    if (path === '/') requests.push(fetchCount('TOTAL'));

    Promise.all(requests).then(function (counts) {
      if (!badge.isConnected || counts[0] === null) return;
      var text = counts[0] + ' views';
      if (counts[1]) text += ' · ' + counts[1] + ' total';
      label.textContent = text;
      badge.hidden = false;
    });
  }

  renderBadge(pagePath());

  document.addEventListener('docmd:page-mounted', function () {
    count();
    renderBadge(pagePath());
  });
})();
