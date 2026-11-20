// by claude
// Section line: a tree line in the left gutter of each docs page, a trunk with a tick into every section heading
// and a nested line with ticks for its subsections. A `---` ends the section above it, and the headings after it get their own
// section level. Redrawn only when the page content changes size or a new page mounts.
(function () {
  'use strict';

  var ARTICLE_SELECTOR = '.summer-content';
  var HEADING_SELECTOR = ':scope > h2, :scope > h3, :scope > h4';
  var OUTLINE_SELECTOR = HEADING_SELECTOR + ', :scope > hr';
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

  function getSectionTagName(nodes, start) {
    var minLevel = 6;
    for (var i = start; i < nodes.length; i++) {
      var tagName = nodes[i].tagName;
      if (tagName === 'HR') break;
      var level = Number(tagName.charAt(1));
      if (level < minLevel) minLevel = level;
    }
    return 'H' + minLevel;
  }

  // -- reads layout only, draw() writes the svg after it so a redraw costs no extra layout
  function buildPath(article, nodes) {
    var title = article.querySelector(TITLE_SELECTOR);
    var startY = title === null ? 0 : title.offsetTop;
    var endY = getEndY(article);
    var outer = 'M' + TRUNK_X + ' ' + startY + ' V' + endY;
    var inner = '';
    var sectionTagName = getSectionTagName(nodes, 0);
    var sectionY = startY;
    var lastSubsectionY = null;

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.tagName === 'HR') {
        if (lastSubsectionY !== null) inner += getSubTrunkPath(sectionY, lastSubsectionY);
        lastSubsectionY = null;
        sectionY = node.offsetTop;
        sectionTagName = getSectionTagName(nodes, i + 1);
        continue;
      }

      var heading = node;
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
    var svg = article.querySelector(SVG_SELECTOR);
    if (article.querySelector(HEADING_SELECTOR) === null) {
      article.classList.remove(ACTIVE_CLASS);
      if (svg !== null) svg.remove();
      return;
    }

    article.classList.add(ACTIVE_CLASS);
    var line = buildPath(article, article.querySelectorAll(OUTLINE_SELECTOR));
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
