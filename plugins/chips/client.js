// by claude
// version tags toggle (plugins/chips): a topbar button next to the theme switch hides every `🆕` and `🔄` tag, remembered per browser.
// -- loaded in the head so a hidden choice applies before the first paint
(function () {
  'use strict';

  var STORAGE_KEY = 'namida-docs-version-tags-hidden';
  var HIDDEN_CLASS = 'version-tags-hidden';
  var THEME_TOGGLE_SELECTOR = '.summer-topbar__right [data-summer-theme-toggle]';
  var TOGGLE_LABEL = 'Hide version tags';
  var TOGGLE_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"></path>' +
    '<circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle>' +
    '<path class="version-tags-toggle__slash" d="m2 2 20 20"></path>' +
    '</svg>';

  var root = document.documentElement;
  var isHidden = false;

  function addHiddenClass() {
    root.classList.add(HIDDEN_CLASS);
  }

  // -- page navigation copies the new page's html classes, which drops ours
  function setHidden(shouldHide) {
    isHidden = shouldHide;
    root.classList.toggle(HIDDEN_CLASS, shouldHide);
    if (shouldHide) document.addEventListener('docmd:page-mounted', addHiddenClass);
    else document.removeEventListener('docmd:page-mounted', addHiddenClass);
  }

  function onToggleClick(event) {
    setHidden(!isHidden);
    event.currentTarget.setAttribute('aria-pressed', String(isHidden));
    localStorage.setItem(STORAGE_KEY, String(isHidden));
  }

  function insertToggle() {
    var themeToggle = document.querySelector(THEME_TOGGLE_SELECTOR);
    if (themeToggle === null) return;
    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'summer-iconbtn version-tags-toggle';
    toggle.title = TOGGLE_LABEL;
    toggle.setAttribute('aria-label', TOGGLE_LABEL);
    toggle.setAttribute('aria-pressed', String(isHidden));
    toggle.innerHTML = TOGGLE_ICON;
    toggle.addEventListener('click', onToggleClick);
    themeToggle.before(toggle);
  }

  var wasHidden = localStorage.getItem(STORAGE_KEY) === 'true';
  if (wasHidden) setHidden(true);
  document.addEventListener('DOMContentLoaded', insertToggle);
})();
