// by claude
// Docs graph page: how pages, sections and versions link to each other (data from plugins/docs-graph).
// Only does work on pages that have a [data-docs-graph] container.
(function () {
  'use strict';

  var SCRIPT_URL = new URL(document.currentScript.src);
  var SITE_ROOT = new URL('../../', SCRIPT_URL);
  var LIB_URL = siteUrl('assets/js/force-graph.min.js', true);
  var DATA_URL = siteUrl('docs-graph.json', true);
  var CONTAINER_SELECTOR = '[data-docs-graph]';
  var FOCUS_PARAM = 'node';

  var CATEGORIES = [
    { id: 'features', label: 'Features' },
    { id: 'pages', label: 'Pages' },
    { id: 'settings', label: 'Settings' },
    { id: 'other', label: 'Other' },
  ];
  var VERSION_CATEGORY = { id: 'version', label: 'Versions' };
  var LAYERS = CATEGORIES.concat([VERSION_CATEGORY]);
  var CATEGORY_ORDER = { features: 0, pages: 1, settings: 2, other: 3, version: 4 };
  var VIEWS = [
    { id: 'layers', label: 'Kasane' },
    { id: 'overview', label: 'Overview' },
    { id: 'brain', label: 'Brain' },
  ];

  var SECTION_LABELS_MIN_ZOOM = 2.2;
  var FOCUS_ZOOM = 2.5;
  var LABEL_FONT_PX = 11;
  var LAYER_FONT_PX = 12;
  var DIMMED_ALPHA = 0.15;
  var BRAIN_WARMUP_TICKS = 120;
  var OVERVIEW_WARMUP_TICKS = 300;
  var FIT_PADDING = 32;
  var GRAVITY = 0.06;
  var LAYER_WIDTH = 1400;
  var LAYER_GAP = 170;
  var LAYER_PADDING = 70;
  var LAYER_BAND_HALF_HEIGHT = 72;
  var LAYER_ZIGZAG = 24;
  var LAYER_ZIGZAG_MIN_NODES = 8;
  var SAME_LAYER_CURVATURE = 0.3;
  var CROSS_LAYER_CURVATURE = 0.12;

  var libPromise = null;
  var modelPromise = null;
  var active = null;

  function loadLib() {
    if (libPromise === null) {
      libPromise = new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.src = LIB_URL;
        script.async = true;
        script.onload = function () {
          resolve(window.ForceGraph);
        };
        script.onerror = function () {
          script.remove();
          libPromise = null;
          reject(new Error('could not load ' + LIB_URL));
        };
        document.head.appendChild(script);
      });
    }
    return libPromise;
  }

  function loadModel() {
    if (modelPromise === null) {
      modelPromise = fetch(DATA_URL)
        .then(function (res) {
          if (!res.ok) throw new Error(DATA_URL + ': HTTP ' + res.status);
          return res.json();
        })
        .then(buildModel)
        .catch(function (err) {
          modelPromise = null;
          throw err;
        });
    }
    return modelPromise;
  }

  function mount() {
    if (active !== null && !active.container.isConnected) {
      active.destroy();
      active = null;
    }

    var container = document.querySelector(CONTAINER_SELECTOR);
    if (!container || container.dataset.mounted) return;
    container.dataset.mounted = '1';
    container.textContent = 'Loading graph…';

    Promise.all([loadLib(), loadModel()]).then(
      function (results) {
        if (!container.isConnected) return;
        if (active !== null) active.destroy();
        var ForceGraph = results[0];
        var model = results[1];
        active = createGraph(container, ForceGraph, model);
      },
      function () {
        if (container.isConnected) container.textContent = 'Could not load the graph, try reloading the page.';
      }
    );
  }

  function buildModel(json) {
    var nodes = json.nodes.map(function (raw, index) {
      return createNode(index, raw.url, raw.title || raw.url, raw.category);
    });
    var nodesByUrl = new Map();
    nodes.forEach(function (node, index) {
      var raw = json.nodes[index];
      node.isPage = raw.page === undefined;
      if (node.isPage) node.order = raw.order;
      else node.page = nodes[raw.page];
      node.label = node.page ? node.page.title + ' › ' + node.title : node.title;
      node.searchText = node.label.toLowerCase();
      nodesByUrl.set(node.url, node);
    });

    var versionNodes = json.versions.map(function (version, index) {
      var node = createNode(nodes.length + index, version.announcementUrl, version.name, VERSION_CATEGORY.id);
      node.isVersion = true;
      node.order = index;
      node.searchText = version.name;
      node.addedSections = [];
      return node;
    });
    var versionNodeByName = new Map();
    versionNodes.forEach(function (node) {
      versionNodeByName.set(node.title, node);
    });

    var sectionLinks = [];
    var pageLinks = [];
    var versionLinks = [];
    var pagePairs = new Set();
    for (var i = 0; i < json.links.length; i += 2) {
      var source = nodes[json.links[i]];
      var target = nodes[json.links[i + 1]];
      sectionLinks.push({ source: source, target: target, kind: 'link' });

      var sourcePage = source.page || source;
      var targetPage = target.page || target;
      var pairKey = sourcePage.id * nodes.length + targetPage.id;
      if (sourcePage !== targetPage && !pagePairs.has(pairKey)) {
        pagePairs.add(pairKey);
        pageLinks.push({ source: sourcePage, target: targetPage, kind: 'link' });
      }
    }

    var versionPairs = new Set();
    nodes.forEach(function (node, index) {
      if (node.page) sectionLinks.push({ source: node.page, target: node, kind: 'contains' });

      var versionNames = json.nodes[index].versions;
      if (versionNames === undefined) return;
      var page = node.page || node;
      versionNames.forEach(function (name) {
        var versionNode = versionNodeByName.get(name);
        versionNode.addedSections.push(node);
        var pairKey = page.id * versionNodes.length + versionNode.order;
        if (versionPairs.has(pairKey)) return;
        versionPairs.add(pairKey);
        versionLinks.push({ source: page, target: versionNode, kind: 'version' });
      });
    });

    var pageNodes = nodes.filter(function (node) {
      return node.isPage;
    });
    var layerNodes = pageNodes.concat(versionNodes);
    var layerLinks = pageLinks.concat(versionLinks);
    return {
      nodesByUrl: nodesByUrl,
      views: {
        brain: createView(nodes, sectionLinks, false, BRAIN_WARMUP_TICKS),
        overview: createView(pageNodes, pageLinks, false, OVERVIEW_WARMUP_TICKS),
        layers: createView(layerNodes, layerLinks, true, 0),
      },
    };
  }

  function createNode(id, url, title, category) {
    var href = null;
    if (url !== null) {
      var relativeUrl = url.slice(1);
      href = siteUrl(relativeUrl, false);
    }
    return {
      id: id,
      url: url,
      href: href,
      title: title,
      category: category,
      page: null,
      isPage: false,
      isVersion: false,
      order: 0,
      label: title,
      searchText: '',
      radius: 0,
      addedSections: null,
    };
  }

  function createView(nodes, links, isFixedLayout, warmupTicks) {
    var view = {
      nodes: nodes,
      links: links,
      isFixedLayout: isFixedLayout,
      warmupTicks: warmupTicks,
      neighbors: new Map(),
      outgoing: new Map(),
      incoming: new Map(),
      children: new Map(),
      versions: new Map(),
    };
    nodes.forEach(function (node) {
      view.neighbors.set(node, []);
      view.outgoing.set(node, []);
      view.incoming.set(node, []);
      view.children.set(node, []);
      view.versions.set(node, []);
    });
    links.forEach(function (link) {
      view.neighbors.get(link.source).push(link.target);
      view.neighbors.get(link.target).push(link.source);
      if (link.kind === 'contains') {
        view.children.get(link.source).push(link.target);
      } else if (link.kind === 'version') {
        view.versions.get(link.source).push(link.target);
      } else {
        view.outgoing.get(link.source).push(link.target);
        view.incoming.get(link.target).push(link.source);
      }
    });
    return view;
  }

  function createGraph(container, ForceGraph, model) {
    var views = model.views;
    var state = {
      view: views.layers,
      liveView: null,
      hidden: {},
      matches: null,
      query: '',
      hovered: null,
      selected: null,
      highlight: null,
      pendingFocus: null,
      awaitingLiveData: false,
      colors: null,
      fontFamily: '',
      pageFont: '',
      sectionFont: '',
      layerFont: '',
      pixelSize: 1,
      zoom: 1,
      frameZoom: 1,
    };

    var viewButtons = {};
    var toolbar = el('div', 'docs-graph__toolbar');
    var viewSwitch = el('div', 'docs-graph__views');
    viewSwitch.setAttribute('role', 'group');
    VIEWS.forEach(function (option) {
      var button = el('button', null, option.label);
      button.type = 'button';
      button.addEventListener('click', function () {
        setView(option.id);
      });
      viewButtons[option.id] = button;
      viewSwitch.appendChild(button);
    });

    var legend = el('div', 'docs-graph__legend');
    var versionChip = null;
    LAYERS.forEach(function (category) {
      var chip = el('button', 'docs-graph__chip');
      chip.type = 'button';
      chip.setAttribute('aria-pressed', 'true');
      var chipDot = dot(category.id);
      chip.append(chipDot, category.label);
      chip.addEventListener('click', function () {
        toggleCategory(category.id, chip);
      });
      legend.appendChild(chip);
      if (category === VERSION_CATEGORY) versionChip = chip;
    });

    var search = el('input', 'docs-graph__search');
    search.type = 'search';
    search.placeholder = 'Search';
    search.setAttribute('aria-label', 'Search pages, sections and versions');
    search.addEventListener('input', function () {
      setQuery(search.value);
    });
    search.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') focusBestMatch();
      else if (event.key === 'Escape') {
        search.value = '';
        setQuery('');
        select(null);
      }
    });

    toolbar.append(viewSwitch, legend, search);

    var body = el('div', 'docs-graph__body');
    var stage = el('div', 'docs-graph__stage');
    var panel = el('aside', 'docs-graph__panel');
    panel.hidden = true;
    body.append(stage, panel);

    container.replaceChildren(toolbar, body);
    readTheme();

    var graph = new ForceGraph(stage)
      .width(stage.clientWidth)
      .height(stage.clientHeight)
      .nodeRelSize(1)
      .nodeVal(nodeArea)
      .nodeVisibility(isVisible)
      .nodeCanvasObject(drawNode)
      .nodePointerAreaPaint(paintPointerArea)
      .linkVisibility(isLinkVisible)
      .linkColor(linkColor)
      .linkWidth(linkWidth)
      .linkCurvature(linkCurvature)
      .linkDirectionalArrowLength(arrowLength)
      .linkDirectionalArrowRelPos(1)
      .onRenderFramePre(prepareFrame)
      .cooldownTime(3000)
      .onEngineTick(onEngineTick)
      .onEngineStop(onEngineStop)
      .onNodeHover(hover)
      .onNodeClick(function (node) {
        select(node);
      })
      .onBackgroundClick(function () {
        select(null);
      });
    graph.d3Force('charge').strength(-45);
    graph.d3Force('link').distance(function (link) {
      return link.kind === 'contains' ? 14 : 50;
    });
    var gravity = gravityForce(GRAVITY);
    graph.d3Force('gravity', gravity);
    var graphCanvas = stage.querySelector('canvas');
    var graphContext = graphCanvas.getContext('2d');


    var params = new URLSearchParams(location.search);
    var focusUrl = params.get(FOCUS_PARAM);
    var requestedNode = focusUrl === null ? undefined : model.nodesByUrl.get(focusUrl);
    if (requestedNode !== undefined) {
      if (!state.view.neighbors.has(requestedNode)) state.view = views.brain;
      state.selected = requestedNode;
      state.pendingFocus = requestedNode;
    }

    applyView();

    var resizeObserver = new ResizeObserver(function () {
      graph.width(stage.clientWidth).height(stage.clientHeight);
    });
    resizeObserver.observe(stage);

    var themeObserver = new MutationObserver(function () {
      readTheme();
      redraw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return {
      container: container,
      destroy: function () {
        resizeObserver.disconnect();
        themeObserver.disconnect();
        if (isLiveFixedLayout()) unpin(state.liveView);
        graph._destructor();
      },
    };

    // re-setting a paint accessor makes force-graph repaint while its engine is paused
    function redraw() {
      graph.nodeCanvasObject(drawNode);
    }

    function readTheme() {
      var style = getComputedStyle(container);
      function readVar(name) {
        var value = style.getPropertyValue(name);
        return value.trim();
      }
      var colors = {
        fg: readVar('--summer-fg'),
        muted: readVar('--summer-fg-muted'),
        bg: readVar('--summer-bg'),
        layerBand: readVar('--summer-bg-subtle'),
        link: readVar('--summer-border-strong'),
        containsLink: readVar('--summer-border'),
        dimmedLink: readVar('--summer-border-soft'),
        category: {},
      };
      LAYERS.forEach(function (category) {
        var varName = '--docs-graph-' + category.id;
        colors.category[category.id] = readVar(varName);
      });
      state.colors = colors;
      state.fontFamily = style.fontFamily;
    }

    function setView(id) {
      var nextView = views[id];
      if (state.view === nextView) return;
      if (isLiveFixedLayout()) unpin(state.liveView);
      state.view = nextView;
      if (state.selected !== null && !nextView.neighbors.has(state.selected)) state.selected = state.selected.page;
      state.hovered = null;
      applyView();
    }

    // the new data reaches force-graph a few frames later, until then the live view keeps drawing as it was
    function applyView() {
      var view = state.view;
      VIEWS.forEach(function (option) {
        var isPressed = views[option.id] === view;
        viewButtons[option.id].setAttribute('aria-pressed', isPressed ? 'true' : 'false');
      });
      versionChip.hidden = !view.isFixedLayout;

      var warmupTicks = view.warmupTicks;
      var cooldownTicks = view.isFixedLayout ? 0 : Infinity;
      graph.enableNodeDrag(!view.isFixedLayout).warmupTicks(warmupTicks).cooldownTicks(cooldownTicks);
      state.awaitingLiveData = true;
      graph.graphData({ nodes: view.nodes, links: view.links });
      renderPanel();
    }

    // runs inside the first engine step that has the new data, before that frame is painted
    function onViewLive() {
      var view = state.view;
      var hadLayers = isLiveFixedLayout();
      state.awaitingLiveData = false;
      state.liveView = view;
      view.nodes.forEach(function (node) {
        var degree = view.neighbors.get(node).length;
        node.radius = nodeRadius(node, degree);
      });

      var pendingFocus = state.pendingFocus;
      state.pendingFocus = null;
      if (view.isFixedLayout) {
        pinLayers(view);
        fitLayers();
      } else if (pendingFocus !== null) {
        centerOn(pendingFocus, 0);
      } else {
        graph.zoomToFit(0, FIT_PADDING);
      }
      // force-graph read the zoom before this step, this frame's labels follow the fitted zoom instead
      var fittedZoom = graph.zoom();
      updateFrameMetrics(fittedZoom);
      // this frame's background was already prepared for the previous view
      if (hadLayers) clearCanvas(graphContext);
      if (view.isFixedLayout) drawLayers(graphContext);
      updateMatches();
      updateHighlight();
    }

    function isNewViewLive() {
      return state.awaitingLiveData && gravity.nodes() === state.view.nodes;
    }

    function isLiveFixedLayout() {
      return state.liveView !== null && state.liveView.isFixedLayout;
    }

    function pinLayers(view) {
      LAYERS.forEach(function (layer, layerIndex) {
        var layerNodes = view.nodes.filter(function (node) {
          return node.category === layer.id;
        });
        layerNodes.sort(compareOrder);
        var layerY = layerIndex * LAYER_GAP;
        var zigzag = layerNodes.length >= LAYER_ZIGZAG_MIN_NODES ? LAYER_ZIGZAG : 0;
        layerNodes.forEach(function (node, index) {
          var slot = (index + 0.5) / layerNodes.length;
          var offsetY = index % 2 === 0 ? -zigzag : zigzag;
          var x = (slot - 0.5) * LAYER_WIDTH;
          var y = layerY + offsetY;
          node.fx = x;
          node.fy = y;
          node.x = x;
          node.y = y;
          node.vx = 0;
          node.vy = 0;
        });
      });
    }

    function toggleCategory(id, chip) {
      var wasHidden = state.hidden[id] === true;
      state.hidden[id] = !wasHidden;
      chip.setAttribute('aria-pressed', wasHidden ? 'true' : 'false');
      if (state.selected !== null && !isVisible(state.selected)) state.selected = null;
      if (state.hovered !== null && !isVisible(state.hovered)) state.hovered = null;
      updateMatches();
      graph.nodeVisibility(isVisible);
      renderPanel();
      updateHighlight();
    }

    function setQuery(value) {
      state.query = value.trim().toLowerCase();
      updateMatches();
      updateHighlight();
    }

    function updateMatches() {
      if (state.query === '') {
        state.matches = null;
        return;
      }
      var matching = state.view.nodes.filter(function (node) {
        return isVisible(node) && node.searchText.indexOf(state.query) !== -1;
      });
      state.matches = new Set(matching);
    }

    function focusBestMatch() {
      if (state.matches === null) return;
      var best = null;
      state.matches.forEach(function (node) {
        if (best === null || compareMatches(node, best) < 0) best = node;
      });
      if (best !== null) focusNode(best);
    }

    function compareMatches(a, b) {
      var titleRankDiff = titleMatchRank(a) - titleMatchRank(b);
      if (titleRankDiff !== 0) return titleRankDiff;
      if (a.isPage !== b.isPage) return a.isPage ? -1 : 1;
      return a.label.length - b.label.length;
    }

    function titleMatchRank(node) {
      var title = node.title.toLowerCase();
      if (title === state.query) return 0;
      if (title.indexOf(state.query) === 0) return 1;
      return 2;
    }

    function hover(node) {
      state.hovered = node;
      redraw();
    }

    function select(node) {
      state.selected = node;
      renderPanel();
      if (!state.awaitingLiveData) updateHighlight();
    }

    function focusNode(node) {
      if (!state.view.neighbors.has(node)) {
        var viewId = node.isVersion ? 'layers' : 'brain';
        state.pendingFocus = node;
        setView(viewId);
      }
      select(node);
      var waitsForLayout = state.pendingFocus === node;
      if (!waitsForLayout) centerOn(node, 600);
    }

    function centerOn(node, duration) {
      graph.centerAt(node.x, node.y, duration);
      var needsZoomIn = !isLiveFixedLayout() && graph.zoom() < FOCUS_ZOOM;
      if (needsZoomIn) graph.zoom(FOCUS_ZOOM, duration);
    }

    function onEngineTick() {
      if (isNewViewLive()) onViewLive();
    }

    function onEngineStop() {
      if (isNewViewLive()) onViewLive();
    }

    function fitLayers() {
      var bandsWidth = LAYER_WIDTH + LAYER_PADDING * 2;
      var bandsHeight = (LAYERS.length - 1) * LAYER_GAP + LAYER_BAND_HALF_HEIGHT * 2;
      var widthZoom = (stage.clientWidth - 24) / bandsWidth;
      var heightZoom = (stage.clientHeight - 24) / bandsHeight;
      var centerY = ((LAYERS.length - 1) * LAYER_GAP) / 2;
      graph.centerAt(0, centerY, 0);
      var fitZoom = Math.min(widthZoom, heightZoom);
      graph.zoom(fitZoom, 0);
    }

    function updateHighlight() {
      var selected = state.selected;
      if (selected !== null) {
        var neighbors = state.view.neighbors.get(selected);
        state.highlight = new Set(neighbors);
        state.highlight.add(selected);
      } else {
        state.highlight = state.matches;
      }
      redraw();
    }

    function isVisible(node) {
      return !state.hidden[node.category];
    }

    function isLinkVisible(link) {
      if (!isVisible(link.source) || !isVisible(link.target)) return false;
      var isSameLayer = isLiveFixedLayout() && link.source.category === link.target.category;
      return !isSameLayer || isFocusLink(link);
    }

    function isFocusLink(link) {
      var hovered = state.hovered;
      var selected = state.selected;
      var touchesHovered = hovered !== null && (link.source === hovered || link.target === hovered);
      var touchesSelected = selected !== null && (link.source === selected || link.target === selected);
      return touchesHovered || touchesSelected;
    }

    function nodeArea(node) {
      return node.radius * node.radius;
    }

    function nodeRadius(node, degree) {
      var degreeRoot = Math.sqrt(degree);
      if (node.isVersion) return 5 + degreeRoot * 0.6;
      if (node.isPage) return 4 + degreeRoot * 0.9;
      return 2.5 + degreeRoot * 0.5;
    }

    function linkColor(link) {
      if (isFocusLink(link)) return state.colors.muted;
      if (state.highlight !== null) return state.colors.dimmedLink;
      var isFaint = link.kind === 'contains' || isLiveFixedLayout();
      return isFaint ? state.colors.containsLink : state.colors.link;
    }

    function linkWidth(link) {
      var width = isFocusLink(link) ? 1.5 : 1;
      // force-graph scales widths by the zoom it read at frame start, a fit made mid-frame changed it since
      return (width * state.frameZoom) / state.zoom;
    }

    function linkCurvature(link) {
      if (!isLiveFixedLayout()) return 0;
      return link.source.category === link.target.category ? SAME_LAYER_CURVATURE : CROSS_LAYER_CURVATURE;
    }

    function arrowLength(link) {
      return link.kind === 'link' && isFocusLink(link) ? 4 : 0;
    }

    function prepareFrame(ctx, scale) {
      state.frameZoom = scale;
      updateFrameMetrics(scale);
      if (isLiveFixedLayout()) drawLayers(ctx);
    }

    function updateFrameMetrics(scale) {
      var pixelSize = 1 / scale;
      var sectionFont = LABEL_FONT_PX * pixelSize + 'px ' + state.fontFamily;
      state.zoom = scale;
      state.pixelSize = pixelSize;
      state.sectionFont = sectionFont;
      state.pageFont = '600 ' + sectionFont;
      state.layerFont = '600 ' + LAYER_FONT_PX * pixelSize + 'px ' + state.fontFamily;
    }

    function clearCanvas(ctx) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
      ctx.restore();
    }

    function drawLayers(ctx) {
      var colors = state.colors;
      var pixelSize = state.pixelSize;
      var left = -LAYER_WIDTH / 2 - LAYER_PADDING;
      var width = LAYER_WIDTH + LAYER_PADDING * 2;
      ctx.font = state.layerFont;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      LAYERS.forEach(function (layer, layerIndex) {
        if (state.hidden[layer.id]) return;
        var top = layerIndex * LAYER_GAP - LAYER_BAND_HALF_HEIGHT;
        ctx.beginPath();
        ctx.roundRect(left, top, width, LAYER_BAND_HALF_HEIGHT * 2, 12);
        ctx.fillStyle = colors.layerBand;
        ctx.fill();
        ctx.fillStyle = colors.muted;
        ctx.fillText(layer.label, left + 10 * pixelSize, top + 8 * pixelSize);
      });

      if (state.hidden[VERSION_CATEGORY.id]) return;
      var timelineY = (LAYERS.length - 1) * LAYER_GAP;
      ctx.beginPath();
      ctx.moveTo(-LAYER_WIDTH / 2, timelineY);
      ctx.lineTo(LAYER_WIDTH / 2, timelineY);
      ctx.lineWidth = 2 * pixelSize;
      ctx.strokeStyle = colors.link;
      ctx.stroke();
    }

    function drawNode(node, ctx) {
      var colors = state.colors;
      var pixelSize = state.pixelSize;
      var isHovered = node === state.hovered;
      var dimmed = !isHovered && state.highlight !== null && !state.highlight.has(node);
      ctx.globalAlpha = dimmed ? DIMMED_ALPHA : 1;

      traceNodeShape(ctx, node, node.radius);
      ctx.fillStyle = colors.category[node.category];
      ctx.fill();
      ctx.lineWidth = pixelSize;
      ctx.strokeStyle = colors.bg;
      ctx.stroke();

      var isMatch = state.matches !== null && state.matches.has(node);
      if (isHovered || node === state.selected || isMatch) {
        var ringRadius = node.radius + 2.5 * pixelSize;
        traceNodeShape(ctx, node, ringRadius);
        ctx.lineWidth = 1.5 * pixelSize;
        ctx.strokeStyle = colors.fg;
        ctx.stroke();
      }

      var hasLabel = isHovered || node.isPage || node.isVersion || state.highlight !== null || state.zoom >= SECTION_LABELS_MIN_ZOOM;
      if (!dimmed && hasLabel) {
        var labelY = node.y + node.radius + 2 * pixelSize;
        ctx.font = node.isPage || node.isVersion ? state.pageFont : state.sectionFont;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 3 * pixelSize;
        ctx.strokeStyle = colors.bg;
        ctx.strokeText(node.title, node.x, labelY);
        ctx.fillStyle = colors.fg;
        ctx.fillText(node.title, node.x, labelY);
      }

      ctx.globalAlpha = 1;
    }

    function traceNodeShape(ctx, node, radius) {
      ctx.beginPath();
      if (!node.isVersion) {
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        return;
      }
      ctx.moveTo(node.x, node.y - radius);
      ctx.lineTo(node.x + radius, node.y);
      ctx.lineTo(node.x, node.y + radius);
      ctx.lineTo(node.x - radius, node.y);
      ctx.closePath();
    }

    function paintPointerArea(node, color, ctx) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + 4 * state.pixelSize, 0, 2 * Math.PI);
      ctx.fill();
    }

    function renderPanel() {
      var node = state.selected;
      panel.hidden = node === null;
      if (node === null) return;

      var view = state.view;
      var head = el('div', 'docs-graph__panel-head');
      var close = el('button', 'docs-graph__close', '×');
      close.type = 'button';
      close.setAttribute('aria-label', 'Close');
      close.addEventListener('click', function () {
        select(null);
      });
      var headDot = dot(node.category);
      var headLabel = el('span', null, categoryLabel(node.category));
      head.append(headDot, headLabel, close);

      var children = [head, panelTitle(node)];
      if (node.page !== null) {
        var parent = el('div', 'docs-graph__parent', 'in ');
        var parentButton = nodeButton(node.page);
        parent.appendChild(parentButton);
        children.push(parent);
      }
      var outgoing = view.outgoing.get(node).filter(isVisible);
      var incoming = view.incoming.get(node).filter(isVisible);
      var sections = view.children.get(node).filter(isVisible);
      var versions = view.versions.get(node).sort(compareOrder);
      appendList(children, 'Links to', sortNodes(outgoing));
      appendList(children, 'Linked from', sortNodes(incoming));
      appendList(children, 'Sections', sections);
      appendList(children, 'New in', versions);
      if (node.isVersion) {
        var addedSections = node.addedSections.filter(isVisible);
        appendList(children, 'New sections', sortNodes(addedSections));
      }
      panel.replaceChildren.apply(panel, children);
    }

    function panelTitle(node) {
      if (node.href === null) return el('div', 'docs-graph__title', node.title);
      var titleText = node.title + ' ↗';
      var title = el('a', 'docs-graph__title', titleText);
      title.href = node.href;
      return title;
    }

    function appendList(children, heading, nodes) {
      if (nodes.length === 0) return;
      var headingText = heading + ' (' + nodes.length + ')';
      children.push(el('div', 'docs-graph__heading', headingText));
      var list = el('ul', 'docs-graph__list');
      nodes.forEach(function (node) {
        var item = el('li');
        var button = nodeButton(node);
        item.appendChild(button);
        list.appendChild(item);
      });
      children.push(list);
    }

    function nodeButton(node) {
      var button = el('button', 'docs-graph__item');
      button.type = 'button';
      var buttonDot = dot(node.category);
      var buttonLabel = el('span', null, node.label);
      button.append(buttonDot, buttonLabel);
      button.addEventListener('click', function () {
        focusNode(node);
      });
      return button;
    }
  }

  // pulls loose clusters in, forceCenter only shifts the mean so they'd stretch the fitted view
  function gravityForce(strength) {
    var nodes = [];
    function force(alpha) {
      var k = strength * alpha;
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].vx -= nodes[i].x * k;
        nodes[i].vy -= nodes[i].y * k;
      }
    }
    force.initialize = function (simulationNodes) {
      nodes = simulationNodes;
    };
    force.nodes = function () {
      return nodes;
    };
    return force;
  }

  function unpin(view) {
    view.nodes.forEach(function (node) {
      node.fx = undefined;
      node.fy = undefined;
    });
  }

  function compareOrder(a, b) {
    return a.order - b.order;
  }

  function sortNodes(nodes) {
    return nodes.sort(function (a, b) {
      var categoryDiff = CATEGORY_ORDER[a.category] - CATEGORY_ORDER[b.category];
      if (categoryDiff !== 0) return categoryDiff;
      return a.label.localeCompare(b.label);
    });
  }

  function categoryLabel(id) {
    return LAYERS[CATEGORY_ORDER[id]].label;
  }

  function siteUrl(path, isVersioned) {
    var fullPath = isVersioned ? path + SCRIPT_URL.search : path;
    return new URL(fullPath, SITE_ROOT).href;
  }

  function dot(category) {
    var span = el('span', 'docs-graph__dot');
    if (category === VERSION_CATEGORY.id) span.classList.add('docs-graph__dot--version');
    var colorVar = 'var(--docs-graph-' + category + ')';
    span.style.setProperty('--docs-graph-dot', colorVar);
    return span;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
  document.addEventListener('docmd:page-mounted', mount);
})();
