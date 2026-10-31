// by claude
// FAQ pages (plugins/faq): questions open and close with a height animation, a link to a question opens it,
// and the bar's button opens or closes every question.
(function () {
  'use strict';

  var ITEM_SELECTOR = '.faq-item';
  var QUESTION_SELECTOR = '.faq-item__question';
  var ANSWER_SELECTOR = '.faq-item__answer';
  var CLOSED_ITEM_SELECTOR = '.faq-item:not([open]), .faq-item--closing';
  var BAR_SELECTOR = '.faq-bar';
  var TOGGLE_SELECTOR = '.faq-bar__toggle';
  var ANIMATING_CLASS = 'faq-item--animating';
  var CLOSING_CLASS = 'faq-item--closing';
  var EXPAND_LABEL = 'Expand all';
  var COLLAPSE_LABEL = 'Collapse all';
  var ANIMATION_OPTIONS = { duration: 300, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' };
  var REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');

  var animationByItem = new WeakMap();
  // -- the docs navigate without reloading and drop the hash from the url, so a followed link keeps it here
  var pendingHash = '';

  function isItemOpen(item) {
    return item.open && !item.classList.contains(CLOSING_CLASS);
  }

  function settleItem(item, isOpen) {
    var runningAnimation = animationByItem.get(item);
    if (runningAnimation !== undefined) runningAnimation.cancel();
    animationByItem.delete(item);
    item.classList.remove(ANIMATING_CLASS, CLOSING_CLASS);
    item.open = isOpen;
  }

  // -- reads, writes, then reads again for every item at once, so expanding all costs two layouts instead of two per item
  function animateItems(items, shouldOpen) {
    var count = items.length;
    if (REDUCED_MOTION.matches) {
      for (var r = 0; r < count; r++) settleItem(items[r], shouldOpen);
      return;
    }
    var answers = new Array(count);
    var startHeights = new Array(count);
    var startOpacities = new Array(count);
    for (var i = 0; i < count; i++) {
      var item = items[i];
      var answer = item.querySelector(ANSWER_SELECTOR);
      answers[i] = answer;
      startHeights[i] = item.open ? answer.offsetHeight : 0;
      startOpacities[i] = item.open ? getComputedStyle(answer).opacity : 0;
    }
    for (var w = 0; w < count; w++) {
      var writtenItem = items[w];
      var runningAnimation = animationByItem.get(writtenItem);
      if (runningAnimation !== undefined) runningAnimation.cancel();
      writtenItem.classList.toggle(CLOSING_CLASS, !shouldOpen);
      writtenItem.classList.add(ANIMATING_CLASS);
      writtenItem.open = true;
    }
    var endOpacity = shouldOpen ? 1 : 0;
    for (var a = 0; a < count; a++) {
      var endHeight = shouldOpen ? answers[a].offsetHeight : 0;
      var keyframes = [
        { height: startHeights[a] + 'px', opacity: startOpacities[a] },
        { height: endHeight + 'px', opacity: endOpacity },
      ];
      var animation = answers[a].animate(keyframes, ANIMATION_OPTIONS);
      animationByItem.set(items[a], animation);
      animation.onfinish = settleItem.bind(null, items[a], shouldOpen);
    }
  }

  function openTarget(hash) {
    if (hash.length < 2) return;
    var id = decodeURIComponent(hash.slice(1));
    var target = document.getElementById(id);
    if (target === null) return;
    var item = target.closest(ITEM_SELECTOR);
    if (item !== null && !isItemOpen(item)) settleItem(item, true);
  }

  function syncToggle() {
    var toggle = document.querySelector(TOGGLE_SELECTOR);
    if (toggle === null) return;
    var hasClosedItem = document.querySelector(CLOSED_ITEM_SELECTOR) !== null;
    toggle.textContent = hasClosedItem ? EXPAND_LABEL : COLLAPSE_LABEL;
  }

  function toggleAll() {
    var shouldOpen = document.querySelector(CLOSED_ITEM_SELECTOR) !== null;
    var allItems = document.querySelectorAll(ITEM_SELECTOR);
    var changingItems = Array.prototype.filter.call(allItems, function (item) {
      return isItemOpen(item) !== shouldOpen;
    });
    animateItems(changingItems, shouldOpen);
    syncToggle();
  }

  // -- capturing, so a linked question is open before the docs scroll to it
  document.addEventListener(
    'click',
    function (event) {
      if (event.target.closest(TOGGLE_SELECTOR) !== null) {
        toggleAll();
        return;
      }
      var link = event.target.closest('a[href*="#"]');
      if (link !== null) {
        var url = new URL(link.href, location.href);
        if (url.pathname === location.pathname) openTarget(url.hash);
        else pendingHash = url.hash;
        return;
      }
      var question = event.target.closest(QUESTION_SELECTOR);
      if (question === null) return;
      event.preventDefault();
      var item = question.parentElement;
      animateItems([item], !isItemOpen(item));
      syncToggle();
    },
    true
  );

  // -- toggle doesn't bubble, a capturing listener still sees every item's (find in page opens them too)
  document.addEventListener(
    'toggle',
    function (event) {
      if (event.target.matches(ITEM_SELECTOR)) syncToggle();
    },
    true
  );

  window.addEventListener('popstate', function () {
    openTarget(location.hash);
  });

  function onPageMounted() {
    var hash = pendingHash || location.hash;
    pendingHash = '';
    openTarget(hash);
    var bar = document.querySelector(BAR_SELECTOR);
    if (bar === null) return;
    bar.hidden = false;
    syncToggle();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onPageMounted);
  else onPageMounted();
  document.addEventListener('docmd:page-mounted', onPageMounted);
})();
