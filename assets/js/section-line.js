// by claude
// Section line: a tree line in the left gutter of each docs page, a trunk with a tick into every section heading
// and a nested line with ticks for its subsections. Redrawn only when the page content changes size or a new page mounts.
(function () {
  'use strict';

  var ARTICLE_SELECTOR = '.summer-content';
  var HEADING_SELECTOR = ':scope > h2, :scope > h3, :scope > h4';
  var TITLE_SELECTOR = ':scope > h1';
  var END_SELECTOR = ':scope > hr:has(+ .docs-graph-local)';
  var SVG_SELECTOR = ':scope > .section-line';
  var ACTIVE_CLASS = 'has-section-line';
  var SVG_NS = 'http://www.w3.org/2000/svg';

  var GUTTER_WIDTH = 32;
  var CORNER_RADIUS = 7;
  var TRUNK_X = 4;
  var SUB_TRUNK_X = TRUNK_X + 2 * CORNER_RADIUS;
  var TICK_END_X = GUTTER_WIDTH - 4;
  var TURN_RIGHT = ' a' + CORNER_RADIUS + ' ' + CORNER_RADIUS + ' 0 0 0 ' + CORNER_RADIUS + ' ' + CORNER_RADIUS;
  var TURN_DOWN = ' a' + CORNER_RADIUS + ' ' + CORNER_RADIUS + ' 0 0 1 ' + CORNER_RADIUS + ' ' + CORNER_RADIUS;

  var observedArticle = null;
  var resizeObserver = new ResizeObserver(draw);

  function getHalfLineHeight(heading) {
    var lineHeight = parseFloat(getComputedStyle(heading).lineHeight);
    var height = isNaN(lineHeight) ? heading.offsetHeight : lineHeight;
    return height / 2;
  }

  function getEndY(article) {
    var endElement = article.querySelector(END_SELECTOR);
    if (endElement !== null) return endElement.offsetTop;
    var lastElement = article.lastElementChild;
    return lastElement.offsetTop + lastElement.offsetHeight;
  }

  function getTickPath(lineX, headingY) {
    var tickTop = headingY - CORNER_RADIUS;
    return ' M' + lineX + ' ' + tickTop + TURN_RIGHT + ' H' + TICK_END_X;
  }

  // -- starts where the section tick's curve ends and stops where the last subsection tick's curve starts
  function getSubTrunkPath(sectionY, lastSubsectionY) {
    var forkStartX = SUB_TRUNK_X - CORNER_RADIUS;
    var lineEndY = lastSubsectionY - CORNER_RADIUS;
    return ' M' + forkStartX + ' ' + sectionY + TURN_DOWN + ' V' + lineEndY;
  }

  // -- reads layout only, draw() writes the svg after it so a redraw costs no extra layout
  function buildPath(article, headings) {
    var minLevel = 6;
    for (var l = 0; l < headings.length; l++) {
      var tagName = headings[l].tagName;
      var level = Number(tagName.charAt(1));
      if (level < minLevel) minLevel = level;
    }
    var sectionTagName = 'H' + minLevel;

    var title = article.querySelector(TITLE_SELECTOR);
    var startY = title === null ? 0 : title.offsetTop;
    var endY = getEndY(article);
    var outer = 'M' + TRUNK_X + ' ' + startY + ' V' + endY;
    var inner = '';
    var sectionY = startY;
    var lastSubsectionY = null;

    for (var i = 0; i < headings.length; i++) {
      var heading = headings[i];
      var halfLineHeight = getHalfLineHeight(heading);
      var headingY = heading.offsetTop + halfLineHeight;
      var isSection = heading.tagName === sectionTagName;

      if (isSection) {
        if (lastSubsectionY !== null) inner += getSubTrunkPath(sectionY, lastSubsectionY);
        lastSubsectionY = null;
        sectionY = headingY;
        outer += getTickPath(TRUNK_X, headingY);
      } else {
        lastSubsectionY = headingY;
        inner += getTickPath(SUB_TRUNK_X, headingY);
      }
    }
    if (lastSubsectionY !== null) inner += getSubTrunkPath(sectionY, lastSubsectionY);

    return { outer: outer, inner: inner, height: endY };
  }

  function createSvg() {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'section-line');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', GUTTER_WIDTH);
    svg.style.left = -GUTTER_WIDTH + 'px';
    var outerPath = document.createElementNS(SVG_NS, 'path');
    var innerPath = document.createElementNS(SVG_NS, 'path');
    outerPath.setAttribute('class', 'section-line__outer');
    innerPath.setAttribute('class', 'section-line__inner');
    svg.append(outerPath, innerPath);
    return svg;
  }

  function draw() {
    var article = observedArticle;
    var headings = article.querySelectorAll(HEADING_SELECTOR);
    var svg = article.querySelector(SVG_SELECTOR);
    if (headings.length === 0) {
      article.classList.remove(ACTIVE_CLASS);
      if (svg !== null) svg.remove();
      return;
    }

    article.classList.add(ACTIVE_CLASS);
    var line = buildPath(article, headings);
    if (svg === null) {
      svg = createSvg();
      article.prepend(svg);
    }
    svg.setAttribute('height', line.height);
    svg.firstChild.setAttribute('d', line.outer);
    svg.lastChild.setAttribute('d', line.inner);
  }

  function mount() {
    var article = document.querySelector(ARTICLE_SELECTOR);
    if (article === observedArticle) {
      if (article !== null) draw();
      return;
    }
    if (observedArticle !== null) resizeObserver.unobserve(observedArticle);
    observedArticle = article;
    if (article !== null) resizeObserver.observe(article);
  }

  document.addEventListener('docmd:page-mounted', mount);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
