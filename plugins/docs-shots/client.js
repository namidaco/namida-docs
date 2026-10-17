// by claude
// Screenshots placed by plugins/docs-shots: android/desktop tabs remembered across pages, a click zooms a shot,
// a shot that can't load (offline) hides. Hotspots and their sections highlight each other on hover, and a link in the
// page to a section or page with shots shows them while hovered (a settings section its tile).
(function () {
  'use strict';

  var SCRIPT_URL = new URL(document.currentScript.src);
  var SITE_ROOT = new URL('../../', SCRIPT_URL);
  var PREVIEWS_URL = new URL('docs-shots-previews.json' + SCRIPT_URL.search, SITE_ROOT);
  var CONTENT_SELECTOR = '.summer-content';
  var STORAGE_KEY = 'docs-shots-platform';
  var FIGURE_SELECTOR = '.docs-shots';
  var SPOT_SELECTOR = '.docs-shot__spot';
  var HEADING_SELECTOR = 'h2[id], h3[id], h4[id]';
  var TARGET_CLASS = 'docs-shots-target';
  var ACTIVE_SPOT_CLASS = 'docs-shot__spot--active';
  var DESKTOP_PLATFORM = 'windows';
  var ANDROID_PLATFORM = 'android';
  var IS_DESKTOP_AGENT = /Windows NT|Macintosh|Linux x86_64|X11/.test(navigator.userAgent) && !/Android/.test(navigator.userAgent);
  var CAN_HOVER = window.matchMedia('(hover: hover)').matches;
  var PREVIEW_MARGIN = 8;
  var PREVIEW_GAP = 10;

  function readPlatform() {
    try {
      var stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) return stored;
    } catch (e) {}
    return IS_DESKTOP_AGENT ? DESKTOP_PLATFORM : ANDROID_PLATFORM;
  }

  function savePlatform(platform) {
    try {
      sessionStorage.setItem(STORAGE_KEY, platform);
    } catch (e) {}
  }

  function applyPlatform(figure, platform) {
    var rows = figure.querySelectorAll('.docs-shots__row');
    var hasPlatform = figure.querySelector('.docs-shots__row[data-platform="' + platform + '"]') !== null;
    var shown = hasPlatform ? platform : rows[0].getAttribute('data-platform');
    rows.forEach(function (row) {
      row.hidden = row.getAttribute('data-platform') !== shown;
    });
    figure.querySelectorAll('.docs-shots__tab').forEach(function (tab) {
      tab.setAttribute('aria-selected', String(tab.getAttribute('data-platform') === shown));
    });
  }

  function applyAll(root) {
    var platform = readPlatform();
    root.querySelectorAll(FIGURE_SELECTOR).forEach(function (figure) {
      applyPlatform(figure, platform);
    });
  }

  function openLightbox(image) {
    var overlay = document.createElement('div');
    overlay.className = 'docs-shots-lightbox';
    var large = document.createElement('img');
    large.src = image.currentSrc || image.src;
    large.alt = image.alt;
    if (image.naturalHeight > image.naturalWidth * 3) large.className = 'docs-shots-lightbox__tall';
    overlay.appendChild(large);
    function close() {
      overlay.remove();
      document.removeEventListener('keydown', onKey);
    }
    function onKey(event) {
      if (event.key === 'Escape') close();
    }
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    document.body.appendChild(overlay);
  }

  function setSectionHighlight(spot, isOn) {
    var heading = document.getElementById(spot.getAttribute('data-anchor'));
    if (heading) heading.classList.toggle(TARGET_CLASS, isOn);
  }

  function setSpotsHighlight(heading, isOn) {
    var selector = SPOT_SELECTOR + '[data-anchor="' + CSS.escape(heading.id) + '"]';
    document.querySelectorAll(selector).forEach(function (spot) {
      spot.classList.toggle(ACTIVE_SPOT_CLASS, isOn);
    });
  }

  var previewsPromise = null;
  var previewElement = null;
  var previewLink = null;

  function loadPreviews() {
    if (previewsPromise === null) {
      previewsPromise = fetch(PREVIEWS_URL)
        .then(function (response) {
          return response.ok ? response.json() : {};
        })
        .catch(function () {
          return {};
        });
    }
    return previewsPromise;
  }

  // -- `/settings/6-extras-settings/#library-tabs` or `/pages/library/`, the keys docs-shots-previews.json uses
  function previewKeyOf(link) {
    var url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return null;
    var pathname = '/' + url.pathname.slice(SITE_ROOT.pathname.length);
    if (!pathname.endsWith('/')) pathname += '/';
    return pathname + url.hash;
  }

  function pickCrop(variants) {
    var preferred = readPlatform();
    var platform = variants[preferred] ? preferred : Object.keys(variants)[0];
    var themes = variants[platform];
    var theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    return themes[theme] || themes.light || themes.dark || null;
  }

  function buildPreview(crop) {
    return crop.w === undefined ? buildShotPreview(crop) : buildTilePreview(crop);
  }

  // -- a section's shot from its top, tall pages cut at a phone's height
  function buildShotPreview(shot) {
    var element = document.createElement('div');
    element.className = 'docs-shots-preview docs-shots-preview--shot' + (shot.isWide ? ' docs-shots-preview--wide' : '');
    var image = document.createElement('img');
    image.src = shot.src;
    image.alt = '';
    element.appendChild(image);
    return element;
  }

  // -- the whole shot scaled so the tile fills the width, then moved until the tile is in view
  function buildTilePreview(crop) {
    var element = document.createElement('div');
    element.className = 'docs-shots-preview';
    var cropElement = document.createElement('div');
    cropElement.className = 'docs-shots-preview__crop';
    var positionX = crop.w >= 1 ? 0 : (crop.x / (1 - crop.w)) * 100;
    var positionY = crop.h >= 1 ? 0 : (crop.y / (1 - crop.h)) * 100;
    cropElement.style.backgroundImage = 'url("' + crop.src + '")';
    cropElement.style.backgroundSize = 100 / crop.w + '% auto';
    cropElement.style.backgroundPosition = positionX + '% ' + positionY + '%';
    cropElement.style.aspectRatio = crop.w + ' / ' + crop.h * crop.ratio;
    element.appendChild(cropElement);
    return element;
  }

  function placePreview(element, link) {
    var linkRect = link.getBoundingClientRect();
    var width = element.offsetWidth;
    var height = element.offsetHeight;
    var left = Math.min(Math.max(linkRect.left, PREVIEW_MARGIN), window.innerWidth - width - PREVIEW_MARGIN);
    var below = linkRect.bottom + PREVIEW_GAP;
    var top = below + height + PREVIEW_MARGIN > window.innerHeight ? linkRect.top - PREVIEW_GAP - height : below;
    element.style.left = left + 'px';
    element.style.top = top + 'px';
  }

  function hidePreview() {
    if (previewElement !== null) previewElement.remove();
    previewElement = null;
    previewLink = null;
  }

  function showPreview(link) {
    var key = previewKeyOf(link);
    if (key === null) return;
    previewLink = link;
    loadPreviews().then(function (previews) {
      if (previewLink !== link) return;
      var variants = previews[key];
      var crop = variants ? pickCrop(variants) : null;
      if (crop === null) return;
      previewElement = buildPreview(crop);
      document.body.appendChild(previewElement);
      placePreview(previewElement, link);
      // -- a shot preview only knows its height once the image is in
      var image = previewElement.querySelector('img');
      if (image && !image.complete) {
        var shownElement = previewElement;
        image.addEventListener('load', function () {
          if (previewElement === shownElement) placePreview(shownElement, link);
        });
      }
    });
  }

  document.addEventListener('click', function (event) {
    var tab = event.target.closest('.docs-shots__tab');
    if (tab) {
      savePlatform(tab.getAttribute('data-platform'));
      applyAll(document);
      return;
    }
    var image = event.target.closest('.docs-shot img');
    if (image) openLightbox(image);
  });

  document.addEventListener('mouseover', function (event) {
    var spot = event.target.closest(SPOT_SELECTOR);
    if (spot) {
      setSectionHighlight(spot, true);
      return;
    }
    var heading = event.target.closest(HEADING_SELECTOR);
    if (heading) setSpotsHighlight(heading, true);
    if (!CAN_HOVER) return;
    var link = event.target.closest('a[href]');
    if (link && link !== previewLink && link.closest(CONTENT_SELECTOR) && !link.closest('.docs-shot')) {
      hidePreview();
      showPreview(link);
    }
  });

  document.addEventListener('mouseout', function (event) {
    var spot = event.target.closest(SPOT_SELECTOR);
    if (spot && !spot.contains(event.relatedTarget)) setSectionHighlight(spot, false);
    var heading = event.target.closest(HEADING_SELECTOR);
    if (heading && !heading.contains(event.relatedTarget)) setSpotsHighlight(heading, false);
    if (previewLink !== null && !previewLink.contains(event.relatedTarget)) hidePreview();
  });

  // -- error events don't bubble, a capturing listener still sees every image's
  document.addEventListener(
    'error',
    function (event) {
      var target = event.target;
      if (target.tagName !== 'IMG') return;
      var shot = target.closest('.docs-shot');
      if (!shot) return;
      shot.classList.add('docs-shot--failed');
      var row = shot.closest('.docs-shots__row');
      if (row.querySelector('.docs-shot:not(.docs-shot--failed)') === null) row.closest(FIGURE_SELECTOR).classList.add('docs-shots--failed');
    },
    true
  );

  // -- the docs navigate without reloading, every mounted page brings its own figures
  function onPageMounted() {
    hidePreview();
    applyAll(document);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onPageMounted);
  else onPageMounted();
  document.addEventListener('docmd:page-mounted', onPageMounted);
})();
