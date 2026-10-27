// rewritten by claude, new one draws a zoomable canvas with three views: tree, mind map and brain
// Screens map page (data from plugins/docs-shots): every screen as its thumbnail, joined to the screen it opens from.
// - Tree: the app on the left, what opens from it branches right, then further right.
// - Mind map: every screen in the middle of what opens from it, those on rings around it, the app in the middle of all.
// - Brain: the screens float, pulled together by what opens what.
// screens that open nothing more sit together in a strip. hover a screen to see it bigger, click it to read about it.
// Only does work on pages that have a [data-docs-screens] container.
(function () {
  'use strict';

  var SCRIPT_URL = new URL(document.currentScript.src);
  var SITE_ROOT = new URL('../../', SCRIPT_URL);
  var LIB_URL = new URL('assets/js/force-graph.min.js' + SCRIPT_URL.search, SITE_ROOT).href;
  var DATA_URL = new URL('docs-shots-screens.json' + SCRIPT_URL.search, SITE_ROOT).href;
  var APP_ICON_URL = new URL('assets/images/namida_icon.png', SITE_ROOT).href;
  var CONTAINER_SELECTOR = '[data-docs-screens]';
  // -- the same choice as the screenshot tabs in the pages. choices last for the tab only, a new visit detects again
  var PLATFORM_STORAGE_KEY = 'docs-shots-platform';
  var VIEW_STORAGE_KEY = 'docs-screens-view';
  var DESKTOP_PLATFORM = 'windows';
  var ANDROID_PLATFORM = 'android';
  var IS_DESKTOP_AGENT = /Windows NT|Macintosh|Linux x86_64|X11/.test(navigator.userAgent) && !/Android/.test(navigator.userAgent);
  var APP_NODE_ID = '__app';
  var VIEWS = [
    { id: 'brain', label: 'Brain' },
    { id: 'tree', label: 'Tree' },
    { id: 'mindmap', label: 'Mind map' },
  ];

  // -- every screen gets the same phone sized box so nothing moves when images load, a shot shows whole inside it
  // -- (tall full page shots are cut at its bottom)
  var NODE_WIDTH = 30;
  var NODE_HEIGHT = (NODE_WIDTH * 20) / 9;
  var NODE_RADIUS = 1.2;
  var APP_NODE_SIZE = 40;
  var LABEL_FONT_SIZE = 4.2;
  var HEAD_LABEL_FONT_SIZE = 5;
  var LABEL_GAP = 2.5;
  var LABEL_MIN_ZOOM = 1.6;
  var COLUMN_WIDTH = 74;
  var CELL_WIDTH = 44;
  var ROW_HEIGHT = NODE_HEIGHT + 22;
  var STRIP_MAX = 6;
  var STRIP_PADDING = 5;
  var STRIP_RADIUS = 4;
  // -- a screen with its label fits this circle, the app this one
  var MIND_SCREEN_RADIUS = Math.hypot(NODE_WIDTH / 2, NODE_HEIGHT / 2 + 8);
  var MIND_APP_RADIUS = APP_NODE_SIZE / 2 + 6;
  var MIND_GAP = 6;
  var BRAIN_WARMUP_TICKS = 220;
  var BRAIN_COOLDOWN_TICKS = 160;
  var BRAIN_LINK_DISTANCE = 70;
  var BRAIN_CHARGE = -140;
  // -- the mind map's rings only seed a pass that packs every screen close to what opens it
  var MIND_COMPACT_TICKS = 400;
  var MIND_LINK_DISTANCE = 36;
  var MIND_LINK_STRENGTH = 0.3;
  var MIND_CHARGE = -30;
  // -- screens push apart as boxes with their labels, circles would leave gaps beside the tall thumbnails
  var COLLIDE_GAP = 8;
  var COLLIDE_LABEL_WIDTH = 56;
  var COLLIDE_LABEL_ROOM = 12;
  // -- views open close up around the app, a background click zooms out to all of them
  var START_ZOOM = 3.2;
  var TREE_START_MARGIN = 24;
  var FIT_PADDING = 28;

  var libPromise = null;
  var dataPromise = null;
  var active = null;

  function readStored(key, fallback) {
    try {
      return sessionStorage.getItem(key) || fallback;
    } catch (e) {
      return fallback;
    }
  }

  function store(key, value) {
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {}
  }

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

  function loadData() {
    if (dataPromise === null) {
      dataPromise = fetch(DATA_URL)
        .then(function (response) {
          if (!response.ok) throw new Error(DATA_URL + ': HTTP ' + response.status);
          return response.json();
        })
        .catch(function (error) {
          dataPromise = null;
          throw error;
        });
    }
    return dataPromise;
  }

  function mount() {
    if (active !== null && !active.container.isConnected) {
      active.destroy();
      active = null;
    }
    var container = document.querySelector(CONTAINER_SELECTOR);
    if (!container || container.dataset.mounted) return;
    container.dataset.mounted = '1';
    container.textContent = 'Loading screens…';
    Promise.all([loadLib(), loadData()]).then(
      function (results) {
        if (!container.isConnected) return;
        if (active !== null) active.destroy();
        active = createMap(container, results[0], results[1]);
      },
      function () {
        if (container.isConnected) container.textContent = 'Could not load the screens, try reloading the page.';
      }
    );
  }

  function createMap(container, ForceGraph, data) {
    var model = buildModel(data);
    var platforms = Object.keys(data.platforms).filter(function (platform) {
      return model.screens.some(function (node) {
        return node.variants[platform] !== undefined;
      });
    });
    var state = {
      view: VIEWS.some(function (view) {
        return view.id === readStored(VIEW_STORAGE_KEY, '');
      })
        ? readStored(VIEW_STORAGE_KEY, '')
        : VIEWS[0].id,
      platform: readStored(PLATFORM_STORAGE_KEY, IS_DESKTOP_AGENT ? DESKTOP_PLATFORM : ANDROID_PLATFORM),
      hovered: null,
      strips: [],
      colors: null,
      fontFamily: '',
      zoom: 1,
    };
    var images = new Map();

    var toolbar = el('div', 'docs-screens__toolbar');
    var viewButtons = switchOf(
      VIEWS.map(function (view) {
        return { id: view.id, label: view.label };
      }),
      function (id) {
        state.view = id;
        store(VIEW_STORAGE_KEY, id);
        applyView();
      }
    );
    toolbar.appendChild(viewButtons.element);
    var platformButtons = null;
    if (platforms.length > 1) {
      platformButtons = switchOf(
        platforms.map(function (platform) {
          return { id: platform, label: data.platforms[platform] };
        }),
        function (id) {
          state.platform = id;
          store(PLATFORM_STORAGE_KEY, id);
          platformButtons.press(id);
          redraw();
        }
      );
      platformButtons.press(state.platform);
      toolbar.appendChild(platformButtons.element);
    }
    var stage = el('div', 'docs-screens__stage');
    container.replaceChildren(toolbar, stage);
    readTheme();

    var graph = new ForceGraph(stage)
      .width(stage.clientWidth)
      .height(stage.clientHeight)
      .nodeId('id')
      .nodeCanvasObject(drawNode)
      .nodePointerAreaPaint(paintPointerArea)
      .nodeLabel(tooltipOf)
      .linkCanvasObjectMode(function () {
        return 'replace';
      })
      .linkCanvasObject(drawLink)
      .onRenderFramePre(drawStrips)
      .onZoom(function (transform) {
        state.zoom = transform.k;
      })
      .onNodeHover(function (node) {
        state.hovered = node && !node.isApp ? node : null;
        stage.style.cursor = node && node.href ? 'pointer' : '';
      })
      .onNodeClick(function (node) {
        if (node.href) location.href = new URL(node.href.replace(/^\//, ''), SITE_ROOT).href;
      })
      .onBackgroundClick(fit);
    graph.d3Force('collide', boxCollideForce());
    var defaultLinkStrength = graph.d3Force('link').strength();
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
        graph._destructor();
      },
    };

    function applyView() {
      viewButtons.press(state.view);
      var isBrain = state.view === 'brain';
      var isMindMap = state.view === 'mindmap';
      state.strips = isBrain || isMindMap ? [] : layoutTree(model);
      if (isMindMap) layoutMindMap(model);
      if (isBrain || isMindMap) {
        model.nodes.forEach(function (node) {
          node.fx = node.isApp ? 0 : undefined;
          node.fy = node.isApp ? 0 : undefined;
        });
      }
      graph.d3Force('charge').strength(isMindMap ? MIND_CHARGE : BRAIN_CHARGE);
      graph
        .d3Force('link')
        .distance(isMindMap ? MIND_LINK_DISTANCE : BRAIN_LINK_DISTANCE)
        .strength(isMindMap ? MIND_LINK_STRENGTH : defaultLinkStrength);
      var warmupTicks = isBrain ? BRAIN_WARMUP_TICKS : isMindMap ? MIND_COMPACT_TICKS : 0;
      graph
        .enableNodeDrag(isBrain)
        .warmupTicks(warmupTicks)
        .cooldownTicks(isBrain ? BRAIN_COOLDOWN_TICKS : 0)
        .graphData({ nodes: model.nodes, links: isBrain ? model.links : model.layoutLinks });
      startView();
    }

    // -- the app stays at 0,0 in every view: the tree keeps it at the top left, the others in the middle
    function startView() {
      graph.zoom(START_ZOOM, 0);
      if (state.view !== 'tree') {
        graph.centerAt(0, 0, 0);
        return;
      }
      var halfWidth = stage.clientWidth / 2 / START_ZOOM;
      var halfHeight = stage.clientHeight / 2 / START_ZOOM;
      graph.centerAt(halfWidth - APP_NODE_SIZE / 2 - TREE_START_MARGIN, halfHeight - APP_NODE_SIZE / 2 - TREE_START_MARGIN, 0);
    }

    function fit() {
      graph.zoomToFit(0, FIT_PADDING);
    }

    // re-setting a paint accessor makes force-graph repaint while its engine is paused
    function redraw() {
      graph.nodeCanvasObject(drawNode);
    }

    function readTheme() {
      var style = getComputedStyle(container);
      function readVar(name) {
        return style.getPropertyValue(name).trim();
      }
      state.colors = {
        fg: readVar('--summer-fg'),
        link: readVar('--summer-border-strong'),
        border: readVar('--summer-border'),
        accent: readVar('--summer-accent'),
        strip: readVar('--summer-bg-subtle'),
      };
      state.fontFamily = style.fontFamily;
    }

    function variantOf(node) {
      var theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      var byPlatform = node.variants[state.platform] || node.variants[Object.keys(node.variants)[0]];
      return byPlatform[theme] || byPlatform[Object.keys(byPlatform)[0]];
    }

    function imageOf(src) {
      var image = images.get(src);
      if (image === undefined) {
        image = new Image();
        image.onload = redraw;
        image.src = src;
        images.set(src, image);
      }
      return image;
    }

    function boxOf(node) {
      if (node.isApp) return { left: node.x - APP_NODE_SIZE / 2, top: node.y - APP_NODE_SIZE / 2, width: APP_NODE_SIZE, height: APP_NODE_SIZE };
      return { left: node.x - NODE_WIDTH / 2, top: node.y - NODE_HEIGHT / 2, width: NODE_WIDTH, height: NODE_HEIGHT };
    }

    function drawNode(node, ctx, scale) {
      var box = boxOf(node);
      if (node.isApp) {
        var icon = imageOf(APP_ICON_URL);
        if (icon.complete && icon.naturalWidth > 0) ctx.drawImage(icon, box.left, box.top, box.width, box.height);
        return;
      }
      var image = imageOf(variantOf(node).thumb);
      var isLoaded = image.complete && image.naturalWidth > 0;
      var fittedHeight = isLoaded ? (box.width * image.naturalHeight) / image.naturalWidth : box.height;
      var shotHeight = Math.min(fittedHeight, box.height);
      ctx.save();
      roundedRect(ctx, box.left, box.top, box.width, shotHeight, NODE_RADIUS);
      ctx.fillStyle = state.colors.strip;
      ctx.fill();
      if (isLoaded) {
        ctx.clip();
        var sourceHeight = (image.naturalWidth * shotHeight) / box.width;
        ctx.drawImage(image, 0, 0, image.naturalWidth, sourceHeight, box.left, box.top, box.width, shotHeight);
      }
      ctx.restore();
      var isHovered = state.hovered === node;
      roundedRect(ctx, box.left, box.top, box.width, shotHeight, NODE_RADIUS);
      ctx.lineWidth = (isHovered ? 2 : 1) / scale;
      ctx.strokeStyle = isHovered ? state.colors.accent : state.colors.border;
      ctx.stroke();
      if (!node.isHead && !isHovered && scale < LABEL_MIN_ZOOM) return;
      var fontSize = node.isHead ? HEAD_LABEL_FONT_SIZE : LABEL_FONT_SIZE;
      ctx.font = (node.isHead ? '600 ' : '') + fontSize + 'px ' + state.fontFamily;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = state.colors.fg;
      ctx.fillText(node.label, node.x, box.top + box.height + LABEL_GAP);
    }

    // -- the tree joins a screen to what opens from it with elbows, the other views with straight lines
    function drawLink(link, ctx, scale) {
      var source = boxOf(link.source);
      var target = boxOf(link.target);
      ctx.beginPath();
      if (state.view !== 'tree') {
        ctx.moveTo(link.source.x, link.source.y);
        ctx.lineTo(link.target.x, link.target.y);
      } else {
        var goesLeft = link.target.x < link.source.x;
        var startX = goesLeft ? source.left : source.left + source.width;
        var endX = goesLeft ? target.left + target.width : target.left;
        var middleX = (startX + endX) / 2;
        ctx.moveTo(startX, link.source.y);
        ctx.lineTo(middleX, link.source.y);
        ctx.lineTo(middleX, link.target.y);
        ctx.lineTo(endX, link.target.y);
      }
      ctx.lineWidth = 1 / scale;
      ctx.strokeStyle = state.colors.link;
      ctx.stroke();
    }

    function drawStrips(ctx) {
      ctx.fillStyle = state.colors.strip;
      state.strips.forEach(function (strip) {
        roundedRect(ctx, strip.left, strip.top, strip.width, strip.height, STRIP_RADIUS);
        ctx.fill();
      });
    }

    function paintPointerArea(node, color, ctx) {
      if (node.isApp) return;
      var box = boxOf(node);
      ctx.fillStyle = color;
      ctx.fillRect(box.left, box.top, box.width, box.height);
    }

    function tooltipOf(node) {
      if (node.isApp) return '';
      var variant = variantOf(node);
      var hint = node.href ? '' : '<em>not in the docs yet</em>';
      return '<div class="docs-screens__tip"><img src="' + variant.shot + '" alt=""><span>' + escapeHtml(node.label) + '</span>' + hint + '</div>';
    }
  }

  // -- the app heads every screen that opens from nowhere. layoutLinks skip strip members after each row's first
  function buildModel(data) {
    var app = { id: APP_NODE_ID, label: 'Namida', isApp: true, isHead: false, parent: null };
    var screens = data.nodes.map(function (node) {
      return Object.assign({}, node, { isHead: node.parent === null });
    });
    var nodes = [app].concat(screens);
    var childrenOf = new Map();
    nodes.forEach(function (node) {
      childrenOf.set(node.id, []);
    });
    screens.forEach(function (node) {
      childrenOf.get(node.parent === null ? APP_NODE_ID : node.parent).push(node);
    });
    var links = screens.map(function (node) {
      return { source: node.parent === null ? APP_NODE_ID : node.parent, target: node.id };
    });
    return { app: app, screens: screens, nodes: nodes, links: links, layoutLinks: [], childrenOf: childrenOf };
  }

  function layoutTree(model) {
    model.layoutLinks = [];
    var strips = [];
    placeBranch(model, model.app, 0, 0, strips);
    return strips;
  }

  // -- every screen with what opens from it is a disk: the screen in the middle, its children's disks on rings around
  // -- it, smallest first, a ring taking children until it's full and the next one starting right outside. so screens
  // -- start next to what opens them and a crowded screen grows rings instead of pushing everything onto one far
  // -- circle. the app is the outermost disk. the compaction pass then closes the gaps the circles leave.
  function layoutMindMap(model) {
    model.layoutLinks = [];
    measureDisk(model, model.app);
    placeDisk(model, model.app, 0, 0, -Math.PI / 2);
  }

  function measureDisk(model, node) {
    var children = model.childrenOf.get(node.id);
    children.forEach(function (child) {
      measureDisk(model, child);
    });
    var selfRadius = node.isApp ? MIND_APP_RADIUS : MIND_SCREEN_RADIUS;
    var sorted = children.slice().sort(function (a, b) {
      return a.disk - b.disk;
    });
    var rings = [];
    var ring = null;
    var boundary = selfRadius;
    sorted.forEach(function (child) {
      if (ring !== null) {
        var grownRadius = Math.max(ring.radius, ring.base + child.disk + MIND_GAP);
        if (ringAngle(ring.members, grownRadius) + diskAngle(child, grownRadius) <= 2 * Math.PI) {
          ring.members.push(child);
          ring.radius = grownRadius;
          return;
        }
        boundary = ring.radius + largestDisk(ring.members) + MIND_GAP;
      }
      ring = { base: boundary, radius: boundary + child.disk + MIND_GAP, members: [child] };
      rings.push(ring);
    });
    node.diskRings = rings;
    node.disk = ring === null ? selfRadius : ring.radius + largestDisk(ring.members);
  }

  // -- every other ring starts half a step around, so neighbouring rings don't line up
  function placeDisk(model, node, x, y, startAngle) {
    place(node, x, y);
    node.diskRings.forEach(function (ring, ringIndex) {
      var angles = ring.members.map(function (member) {
        return diskAngle(member, ring.radius);
      });
      var spare = (2 * Math.PI - ringAngle(ring.members, ring.radius)) / ring.members.length;
      var angle = startAngle + (ringIndex % 2 === 1 ? (angles[0] + spare) / 2 : 0);
      ring.members.forEach(function (member, index) {
        var middle = angle + angles[index] / 2;
        model.layoutLinks.push({ source: node, target: member });
        placeDisk(model, member, x + Math.cos(middle) * ring.radius, y + Math.sin(middle) * ring.radius, middle);
        angle += angles[index] + spare;
      });
    });
  }

  // -- the angle a disk takes on a ring, by the chord it covers
  function diskAngle(node, radius) {
    return 2 * Math.asin(Math.min(1, (node.disk + MIND_GAP / 2) / radius));
  }

  function ringAngle(members, radius) {
    var total = 0;
    members.forEach(function (member) {
      total += diskAngle(member, radius);
    });
    return total;
  }

  function largestDisk(members) {
    var largest = 0;
    members.forEach(function (member) {
      largest = Math.max(largest, member.disk);
    });
    return largest;
  }

  // -- returns the rows the branch used. ends (screens opening nothing) go in strips of STRIP_MAX, the rest branch on.
  // -- the app's own branches keep their order, a lone screen there is a row of its own
  function placeBranch(model, node, depth, row, strips) {
    place(node, depth * COLUMN_WIDTH, row * ROW_HEIGHT);
    var children = model.childrenOf.get(node.id);
    var ends = node.isApp
      ? []
      : children.filter(function (child) {
          return model.childrenOf.get(child.id).length === 0;
        });
    var branches = children.filter(function (child) {
      return ends.indexOf(child) === -1;
    });
    var nextRow = row;
    var stripX = (depth + 1) * COLUMN_WIDTH;
    for (var start = 0; start < ends.length; start += STRIP_MAX) {
      var rowEnds = ends.slice(start, start + STRIP_MAX);
      rowEnds.forEach(function (end, index) {
        place(end, stripX + index * CELL_WIDTH, nextRow * ROW_HEIGHT);
      });
      model.layoutLinks.push({ source: node, target: rowEnds[0] });
      strips.push({
        left: stripX - NODE_WIDTH / 2 - STRIP_PADDING,
        top: nextRow * ROW_HEIGHT - NODE_HEIGHT / 2 - STRIP_PADDING,
        width: (rowEnds.length - 1) * CELL_WIDTH + NODE_WIDTH + STRIP_PADDING * 2,
        height: ROW_HEIGHT - STRIP_PADDING,
      });
      nextRow++;
    }
    branches.forEach(function (branch) {
      model.layoutLinks.push({ source: node, target: branch });
      nextRow += placeBranch(model, branch, depth + 1, nextRow, strips);
    });
    return Math.max(1, nextRow - row);
  }

  function place(node, x, y) {
    node.x = node.fx = x;
    node.y = node.fy = y;
    node.vx = 0;
    node.vy = 0;
  }

  // -- pushes overlapping screens apart along the axis they overlap least on, the app counts as a screen
  function boxCollideForce() {
    var nodes = [];
    var minDx = Math.max(NODE_WIDTH, COLLIDE_LABEL_WIDTH) + COLLIDE_GAP;
    var minDy = NODE_HEIGHT + COLLIDE_LABEL_ROOM + COLLIDE_GAP;
    function force() {
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var a = nodes[i];
          var b = nodes[j];
          var dx = b.x - a.x;
          var dy = b.y - a.y;
          var overlapX = minDx - Math.abs(dx);
          var overlapY = minDy - Math.abs(dy);
          if (overlapX <= 0 || overlapY <= 0) continue;
          var aShare = a.fx === undefined ? (b.fx === undefined ? 0.5 : 1) : 0;
          if (overlapX < overlapY) {
            var pushX = overlapX * (dx < 0 ? -1 : 1);
            a.x -= pushX * aShare;
            b.x += pushX * (1 - aShare);
          } else {
            var pushY = overlapY * (dy < 0 ? -1 : 1);
            a.y -= pushY * aShare;
            b.y += pushY * (1 - aShare);
          }
        }
      }
    }
    force.initialize = function (initialNodes) {
      nodes = initialNodes;
    };
    return force;
  }

  function switchOf(options, onPick) {
    var element = el('div', 'docs-screens__switch');
    element.setAttribute('role', 'group');
    var buttons = {};
    options.forEach(function (option) {
      var button = el('button', 'docs-screens__switch-button', option.label);
      button.type = 'button';
      button.addEventListener('click', function () {
        onPick(option.id);
      });
      buttons[option.id] = button;
      element.appendChild(button);
    });
    return {
      element: element,
      press: function (id) {
        Object.keys(buttons).forEach(function (key) {
          buttons[key].setAttribute('aria-pressed', String(key === id));
        });
      },
    };
  }

  function roundedRect(ctx, left, top, width, height, radius) {
    ctx.beginPath();
    ctx.roundRect(left, top, width, height, radius);
  }

  function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
