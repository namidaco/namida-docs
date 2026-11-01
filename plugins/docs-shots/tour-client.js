// by claude
// Tour page (data from plugins/docs-shots, stops written in tour.json): a short trailer of the app's features.
// A line runs from stop to stop like a route on a map, snaking down the rows, each chapter in its own color. The camera
// follows the line while it draws, and every stop reveals its screenshot with a caption. Smaller stops branch off under
// the line and rejoin it, a mosaic stop glides over its tiles, and pins on a shot point at its gestures one by one. It
// plays by itself once in view, and ends with credits of even smaller features rolling over the whole route. A depth
// switch (simple / medium / advanced) picks how much of it shows.
// Only does work on pages that have a [data-docs-tour] container.
// Other sites embed it (namida.app): served as embed/tour.js next to tour.css and tour.json, a public api whose paths,
// [data-docs-tour] container and --docs-tour-* colors (tour.css) must stay as they are.
(function () {
  'use strict';

  var SCRIPT_URL = new URL(document.currentScript.src);
  var SITE_ROOT = new URL('../', SCRIPT_URL);
  var DATA_URL = new URL('tour.json' + SCRIPT_URL.search, SCRIPT_URL).href;
  var APP_ICON_URL = new URL('assets/images/namida_icon.png', SITE_ROOT).href;
  var CONTAINER_SELECTOR = '[data-docs-tour]';
  // -- android/desktop is the same choice as the screenshot tabs in the pages, wide is the tour's own
  var SHARED_PLATFORM_STORAGE_KEY = 'docs-shots-platform';
  var TOUR_PLATFORM_STORAGE_KEY = 'docs-tour-platform';
  var DESKTOP_PLATFORM = 'windows';
  var ANDROID_PLATFORM = 'android';
  var WIDE_PLATFORM = 'wide';
  // -- how deep the tour goes, every stop, pin, tile and credit has the first level it shows at (tour.json `level`)
  var LEVELS = [
    { id: 'simple', label: 'Simple' },
    { id: 'medium', label: 'Medium' },
    { id: 'advanced', label: 'Advanced' },
  ];
  var DEFAULT_LEVEL_ID = 'medium';
  var TOUR_LEVEL_STORAGE_KEY = 'docs-tour-level';
  var IS_DESKTOP_AGENT = /Windows NT|Macintosh|Linux x86_64|X11/.test(navigator.userAgent) && !/Android/.test(navigator.userAgent);
  var REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');
  var DARK_SCHEME = window.matchMedia('(prefers-color-scheme: dark)');
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var CAPTIONS = {
    start: { kicker: 'Tour', title: 'A quick look at Namida', text: 'Press play to follow the line through the main features.' },
    map: { kicker: 'Tour', title: 'The whole route', text: 'Pick a screen to jump to it, or press play to go on.' },
    credits: { kicker: 'Tour', title: 'Also in Namida', text: 'Smaller features from all over the app, pick one to read about it.' },
    end: { kicker: 'Tour', title: 'That was a quick look', text: 'Free, no ads and no tracking. Made to keep what you love.\nEvery feature has more to it, and these docs cover it all.' },
  };

  // -- world pixels: every shot is a card above its stop at the shot's own ratio (height / width), its title under it
  var PHONE_CARD = { width: 230, maxHeight: 520, ratio: 20 / 9 };
  var WIDE_CARD = { width: 520, maxHeight: 380, ratio: 7 / 10 };
  var CARD_GAP = 34;
  var CARD_SPACING = 130;
  var LABEL_GAP = 24;
  var LABEL_WIDTH = 300;
  var LABEL_HEIGHT = 28;
  var ROW_GAP = 120;
  var BELOW_LINE = LABEL_GAP + LABEL_HEIGHT;
  var TURN_CLEARANCE = 45;
  var TURN_RADIUS = 56;
  var ORIGIN_CLEARANCE = 205;
  var ORIGIN_SIZE = 96;
  var STOP_RADIUS = 6;
  var CHAPTER_STOP_RADIUS = 8;
  var BRANCH_CARD_SHARE = 0.62;
  var BRANCH_DROP = 130;
  var BRANCH_RUN = 230;
  var BRANCH_SPACING = 70;
  var BRANCH_STRAIGHT = 36;
  var BRANCH_CARD_GAP = 22;
  var BRANCH_LABEL_GAP = 14;
  var BRANCH_LABEL_HEIGHT = 22;
  var BRANCH_STOP_RADIUS = 4.5;
  var BRANCH_ROW_LINE_MARGIN = 24;
  var MOSAIC_MAX_ROWS = 2;
  var MOSAIC_GAP = 10;
  var MOSAIC_PADDING = 10;
  var PIN_FRAME_WIDTH_SHARE = 0.9;
  var PIN_FRAME_HEIGHT_SHARE = 0.6;

  var FOCUS_FILL = 0.88;
  var FOCUS_MAX_CARD_SHARE = 0.7;
  var MOSAIC_MAX_WIDTH_SHARE = 0.92;
  var DETAIL_MAX_WIDTH_SHARE = 0.9;
  var MIN_SCALE = 0.3;
  var MAX_SCALE = 1.15;
  var DETAIL_MAX_SCALE = 2.6;
  var OVERVIEW_PADDING = 36;
  var OVERVIEW_MIN_SCALE = 0.01;

  var WIDE_STAGE = 640;
  var SIDE_CAPTION_SHARE = 0.38;
  var SIDE_CAPTION_MAX = 340;
  var BOTTOM_CAPTION_ROOM = 190;
  var CONTROLS_HEIGHT = 56;

  var TRAVEL_MS_PER_PX = 2.4;
  var TRAVEL_MIN_MS = 900;
  var TRAVEL_MAX_MS = 2400;
  var TRAVEL_CAMERA_CATCH_UP_SHARE = 0.45;
  var TRAVEL_REVEAL_SHARE = 0.4;
  var FLY_MS = 800;
  var DETAIL_FLY_MS = 700;
  var OUTRO_MS = 1800;
  var HOLD_BASE_MS = 2200;
  var DETAIL_HOLD_BASE_MS = 1400;
  var HOLD_MS_PER_CHAR = 32;
  var HOLD_MAX_MS = 6500;
  var DETAIL_HOLD_MAX_MS = 4500;
  var CREDITS_PX_PER_MS = 0.075;
  var CREDITS_START_SHARE = 0.45;
  var BRANCH_STEP_WEIGHT = 0.6;
  var DETAIL_STEP_WEIGHT = 0.3;
  var FIRST_FRAME_MS = 16;
  var FRAME_MAX_MS = 64;
  var PRELOAD_AHEAD = 2;
  var VISIBLE_RATIO = 0.5;
  var TEXT_ENTRY_SELECTOR = 'input, textarea, select, [contenteditable="true"]';
  var PRESSABLE_SELECTOR = 'a, button';

  var ICONS = {
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    pause: '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
    replay: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    prev: '<polygon points="19 20 9 12 19 4 19 20"/><line x1="5" x2="5" y1="19" y2="5"/>',
    next: '<polygon points="5 4 15 12 5 20 5 4"/><line x1="19" x2="19" y1="5" y2="19"/>',
    map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
    expand: '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
    shrink: '<path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/>',
  };

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
    } catch (e) { }
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
    container.classList.add('docs-tour');
    container.textContent = 'Loading the tour…';
    loadData().then(
      function (data) {
        if (!container.isConnected) return;
        if (active !== null) active.destroy();
        active = createTour(container, data);
      },
      function () {
        if (container.isConnected) container.textContent = 'Could not load the tour, try reloading the page.';
      }
    );
  }

  function createTour(container, data) {
    var platforms = Object.keys(data.platforms).filter(function (platform) {
      return data.chapters.some(function (chapter) {
        return chapter.stops.some(function (stop) {
          return isOnPlatform(stop, platform);
        });
      });
    });
    var defaultPlatform = IS_DESKTOP_AGENT ? DESKTOP_PLATFORM : ANDROID_PLATFORM;
    var sharedPlatform = readStored(SHARED_PLATFORM_STORAGE_KEY, defaultPlatform);
    var storedPlatform = readStored(TOUR_PLATFORM_STORAGE_KEY, sharedPlatform);
    var hasStoredPlatform = platforms.indexOf(storedPlatform) !== -1;
    var initialPlatform = hasStoredPlatform ? storedPlatform : platforms[0];
    var initialGeometry = geometryOf(initialPlatform);
    var storedLevelId = readStored(TOUR_LEVEL_STORAGE_KEY, DEFAULT_LEVEL_ID);
    var initialLevel = levelIndexOf(storedLevelId);
    var state = {
      platform: initialPlatform,
      level: initialLevel,
      geometry: initialGeometry,
      stops: [],
      points: [],
      lengths: [],
      expressLengths: [],
      bounds: null,
      area: null,
      focusScale: 1,
      // -- the last stop the line got to, -1 while still at the start
      reached: -1,
      // -- 0 is the stop itself, then one for each tile or pin it has
      beat: 0,
      // -- start, travel (the line draws to the next stop), fly (the camera moves), hold (on a stop), map or credits
      phase: 'start',
      isMap: false,
      isCredits: false,
      isPlaying: false,
      hasAutoStarted: false,
      isPausedByScroll: false,
      isVisible: false,
      camera: { x: initialGeometry.origin.x, y: initialGeometry.origin.y, scale: 1 },
      travel: null,
      fly: null,
      holdElapsed: 0,
      holdDuration: 1,
      holdCountdown: null,
      creditsRoll: null,
      creditsCount: 0,
      frameId: 0,
      lastFrameTime: 0,
      captionKey: null,
    };
    var views = { segments: [], expresses: [], stations: [], cards: [], images: [], details: [], labels: [], steps: [], chips: [], pulse: null };

    var toolbar = el('div', 'docs-tour__toolbar');
    var chaptersElement = el('div', 'docs-tour__chapters');
    var switchesElement = el('div', 'docs-tour__switches');
    toolbar.append(chaptersElement, switchesElement);
    var levelButtons = switchOf(LEVELS, switchLevel);
    levelButtons.element.setAttribute('aria-label', 'Tour depth');
    levelButtons.press(LEVELS[state.level].id);
    switchesElement.appendChild(levelButtons.element);
    var platformButtons = null;
    if (platforms.length > 1) {
      var platformOptions = platforms.map(function (platform) {
        return { id: platform, label: data.platforms[platform] };
      });
      platformButtons = switchOf(platformOptions, switchPlatform);
      platformButtons.element.setAttribute('aria-label', 'Platform');
      platformButtons.press(state.platform);
      switchesElement.appendChild(platformButtons.element);
    }

    var stage = el('div', 'docs-tour__stage');
    stage.tabIndex = 0;
    stage.setAttribute('role', 'region');
    stage.setAttribute('aria-label', 'Namida tour, space plays or pauses, arrows step');
    var world = el('div', 'docs-tour__world');
    var credits = el('div', 'docs-tour__credits');
    var creditsRoll = el('div', 'docs-tour__credits-roll');
    credits.appendChild(creditsRoll);
    creditsRoll.addEventListener('pointerenter', pauseCreditsRoll);
    creditsRoll.addEventListener('pointerleave', resumeCreditsRoll);
    var caption = el('div', 'docs-tour__caption');
    caption.setAttribute('aria-live', 'polite');
    var controls = el('div', 'docs-tour__controls');
    var prevButton = iconButton('prev', 'Previous stop', prev);
    var playButton = iconButton('play', 'Play', togglePlay);
    playButton.classList.add('docs-tour__button--play');
    var nextButton = iconButton('next', 'Next stop', next);
    var progressElement = el('div', 'docs-tour__progress');
    var mapButton = iconButton('map', 'Whole route', toggleMap);
    controls.append(prevButton, playButton, nextButton, progressElement, mapButton);
    var fullscreenButton = null;
    if (typeof stage.requestFullscreen === 'function') {
      fullscreenButton = iconButton('expand', 'Fullscreen', toggleFullscreen);
      controls.appendChild(fullscreenButton);
    }
    stage.append(world, credits, caption, controls);
    container.replaceChildren(toolbar, stage);

    measureStage();
    buildRoute();
    renderReached();
    showCaption('start');
    state.camera = startCamera();
    applyCamera(state.camera);

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    var resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(stage);
    var themeObserver = new MutationObserver(onThemeChange);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    DARK_SCHEME.addEventListener('change', onThemeChange);
    var visibilityObserver = new IntersectionObserver(onVisibility, { threshold: VISIBLE_RATIO });
    visibilityObserver.observe(stage);

    return {
      container: container,
      destroy: function () {
        if (state.frameId !== 0) cancelAnimationFrame(state.frameId);
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('fullscreenchange', onFullscreenChange);
        stopHoldCountdown();
        stopCredits();
        resizeObserver.disconnect();
        themeObserver.disconnect();
        DARK_SCHEME.removeEventListener('change', onThemeChange);
        visibilityObserver.disconnect();
      },
    };

    function buildRoute() {
      var geometry = state.geometry;
      var origin = geometry.origin;
      var stops = stopsOf(data, state.platform, state.level, geometry);
      var points = layoutPoints(stops, geometry);
      state.stops = stops;
      state.points = points;
      state.bounds = boundsOf(stops, points, geometry);

      var svg = svgEl('svg', 'docs-tour__lines');
      var track = svgEl('path', 'docs-tour__track');
      var trackData = '';
      views.segments = stops.map(function (stop, index) {
        var from = index === 0 ? origin : points[index - 1];
        var to = points[index];
        var segmentData = segmentPath(from, to);
        trackData += segmentData;
        var isBranchSegment = from.row === to.row && (from.isBranch || to.isBranch);
        return routePath(segmentData, stop, isBranchSegment);
      });
      views.expresses = stops.map(function (stop, index) {
        var from = points[index].expressFrom;
        if (from === null) return null;
        var expressData = 'M' + from.x + ' ' + from.y + 'H' + points[index].x;
        trackData += expressData;
        return routePath(expressData, stop, false);
      });
      track.setAttribute('d', trackData);
      views.stations = stops.map(function (stop, index) {
        var point = points[index];
        var station = svgEl('circle', 'docs-tour__station');
        station.setAttribute('cx', point.x);
        station.setAttribute('cy', point.y);
        var radius = stationRadiusOf(stop);
        station.setAttribute('r', radius);
        station.style.setProperty('--tour-color', stop.color);
        return station;
      });
      var expresses = views.expresses.filter(function (express) {
        return express !== null;
      });
      var svgChildren = [track].concat(expresses, views.segments, views.stations);
      svg.append.apply(svg, svgChildren);

      // -- an html ring the gpu can animate on its own, an animated svg circle repaints the whole route every frame
      views.pulse = el('div', 'docs-tour__pulse');

      var originElement = el('div', 'docs-tour__origin');
      originElement.style.cssText = placement(origin.x - ORIGIN_SIZE / 2, origin.y - ORIGIN_SIZE / 2, ORIGIN_SIZE, ORIGIN_SIZE);
      var originIcon = document.createElement('img');
      originIcon.src = APP_ICON_URL;
      originIcon.alt = '';
      originElement.appendChild(originIcon);

      views.cards = [];
      views.images = [];
      views.details = [];
      stops.forEach(function (stop, index) {
        var built = stop.kind === 'mosaic' ? mosaicCardOf(stop, index) : shotCardOf(stop, index);
        built.card.style.setProperty('--tour-color', stop.color);
        built.card.title = stop.title;
        built.card.addEventListener('click', function () {
          if (state.isMap || index !== state.reached) jumpTo(index, 0);
        });
        views.cards.push(built.card);
        views.images.push(built.images);
        views.details.push(built.details);
      });
      views.labels = stops.map(function (stop, index) {
        var point = points[index];
        var label = el('div', stop.isBranch ? 'docs-tour__label docs-tour__label--branch' : 'docs-tour__label', stop.title);
        var labelLeft = point.x - LABEL_WIDTH / 2;
        var labelTop = stop.isBranch ? point.y - BRANCH_LABEL_GAP - BRANCH_LABEL_HEIGHT : point.y + LABEL_GAP;
        var labelHeight = stop.isBranch ? BRANCH_LABEL_HEIGHT : LABEL_HEIGHT;
        label.style.cssText = placement(labelLeft, labelTop, LABEL_WIDTH, labelHeight);
        return label;
      });
      var worldChildren = [svg, views.pulse, originElement].concat(views.cards, views.labels);
      world.replaceChildren.apply(world, worldChildren);

      // -- lengths need the paths in the page
      state.lengths = views.segments.map(prepareDash);
      state.expressLengths = views.expresses.map(function (express) {
        return express === null ? 0 : prepareDash(express);
      });

      views.steps = stops.map(function (stop, index) {
        var isNewChapter = stop.isChapterStart && index > 0;
        var step = el('button', isNewChapter ? 'docs-tour__step docs-tour__step--chapter' : 'docs-tour__step');
        step.type = 'button';
        step.setAttribute('aria-label', stop.beats[0].kicker + ': ' + stop.title);
        step.style.setProperty('--tour-color', stop.color);
        step.style.flexGrow = String(stop.weight);
        step.appendChild(el('span', 'docs-tour__step-fill'));
        step.addEventListener('click', function () {
          jumpTo(index, 0);
        });
        return step;
      });
      progressElement.replaceChildren.apply(progressElement, views.steps);

      views.chips = [];
      var chips = [];
      stops.forEach(function (stop, index) {
        if (!stop.isChapterStart) return;
        var chip = el('button', 'docs-tour__chapter', stop.chapter);
        chip.type = 'button';
        chip.style.setProperty('--tour-color', stop.color);
        chip.addEventListener('click', function () {
          jumpTo(index, 0);
        });
        chips.push(chip);
        views.chips.push({ chip: chip, chapterIndex: stop.chapterIndex });
      });
      chaptersElement.replaceChildren.apply(chaptersElement, chips);

      buildCredits();
    }

    function shotCardOf(stop, index) {
      var point = state.points[index];
      var card = el('div', stop.isBranch ? 'docs-tour__card docs-tour__card--branch' : 'docs-tour__card');
      var left = point.x - stop.size.width / 2;
      // -- held by its top under a branch line, else by its bottom above the row's line, so its height can follow the shot
      var anchor = stop.isBranch ? 'top: ' + (point.y + BRANCH_CARD_GAP) : 'bottom: ' + (CARD_GAP - point.y);
      card.style.cssText = 'left: ' + left + 'px; ' + anchor + 'px; width: ' + stop.size.width + 'px; max-height: ' + stop.size.height + 'px;';
      var image = imageOf(stop.title);
      image.style.aspectRatio = 'auto 1 / ' + state.geometry.card.ratio;
      card.appendChild(image);
      var details = stop.pins.map(function (pin, pinIndex) {
        var pinElement = el('button', 'docs-tour__pin');
        pinElement.type = 'button';
        pinElement.setAttribute('aria-label', pin.title);
        pinElement.style.cssText = 'left: ' + pin.x * 100 + '%; top: ' + pin.y * 100 + '%;';
        pinElement.addEventListener('click', function (event) {
          event.stopPropagation();
          showDetail(index, pinIndex + 1);
        });
        card.appendChild(pinElement);
        return pinElement;
      });
      return { card: card, images: [{ image: image, themes: stop.themes }], details: details };
    }

    // -- every tile keeps the platform's shot ratio, so the grid and the camera never wait on the images
    function mosaicCardOf(stop, index) {
      var point = state.points[index];
      var tileSize = state.geometry.tile;
      var card = el('div', 'docs-tour__card docs-tour__card--mosaic');
      var left = point.x - stop.size.width / 2;
      var top = point.y - CARD_GAP - stop.size.height;
      card.style.cssText = placement(left, top, stop.size.width, stop.size.height);
      var images = [];
      var details = stop.tiles.map(function (tile, tileIndex) {
        var offset = tileOffsetOf(stop, tileIndex, tileSize);
        var tileElement = el('div', 'docs-tour__tile');
        tileElement.style.cssText = placement(offset.left, offset.top, tileSize.width, tileSize.height);
        var image = imageOf(tile.title);
        tileElement.appendChild(image);
        tileElement.addEventListener('click', function (event) {
          event.stopPropagation();
          showDetail(index, tileIndex + 1);
        });
        card.appendChild(tileElement);
        images.push({ image: image, themes: tile.themes });
        return tileElement;
      });
      return { card: card, images: images, details: details };
    }

    function routePath(pathData, stop, isBranch) {
      var path = svgEl('path', isBranch ? 'docs-tour__segment docs-tour__segment--branch' : 'docs-tour__segment');
      path.setAttribute('d', pathData);
      path.style.setProperty('--tour-color', stop.color);
      return path;
    }

    function buildCredits() {
      var allGroups = data.credits || [];
      var groups = [];
      allGroups.forEach(function (group) {
        if (!isCreditsGroupOn(group, state.platform) || group.level > state.level) return;
        var items = group.items.filter(function (item) {
          return item.level <= state.level;
        });
        if (items.length > 0) groups.push({ title: group.title, items: items });
      });
      var groupElements = groups.map(function (group) {
        var groupElement = el('div', 'docs-tour__credits-group');
        var title = el('div', 'docs-tour__credits-title', group.title);
        groupElement.appendChild(title);
        group.items.forEach(function (item) {
          var link = linkOf(item.title, item.href, 'docs-tour__credits-item');
          groupElement.appendChild(link);
        });
        return groupElement;
      });
      creditsRoll.replaceChildren.apply(creditsRoll, groupElements);
      state.creditsCount = groups.length;
    }

    function renderReached() {
      var reached = state.reached;
      var lastIndex = state.stops.length - 1;
      var isAtEnd = state.isMap && reached === lastIndex;
      state.stops.forEach(function (stop, index) {
        var isReached = index <= reached;
        var isCurrent = index === reached;
        var segment = views.segments[index];
        var dashOffset = isReached ? 0 : state.lengths[index];
        segment.classList.toggle('is-empty', !isReached);
        segment.style.strokeDashoffset = String(dashOffset);
        var express = views.expresses[index];
        if (express !== null) {
          var expressDashOffset = isReached ? 0 : state.expressLengths[index];
          express.classList.toggle('is-empty', !isReached);
          express.style.strokeDashoffset = String(expressDashOffset);
        }
        views.stations[index].classList.toggle('is-reached', isReached);
        views.stations[index].classList.toggle('is-current', isCurrent);
        views.cards[index].classList.toggle('is-visited', index < reached);
        views.cards[index].classList.toggle('is-current', isCurrent);
        views.labels[index].classList.toggle('is-reached', isReached);
        views.labels[index].classList.toggle('is-current', isCurrent);
        renderDetails(index);
        var fill = 0;
        if (isAtEnd || index < reached) fill = 1;
        else if (isCurrent) fill = currentFill();
        setStepFill(index, fill);
      });
      var current = reached === -1 ? null : state.stops[reached];
      views.pulse.classList.toggle('is-hidden', current === null);
      if (current !== null) {
        var point = state.points[reached];
        var radius = stationRadiusOf(current);
        var size = radius * 2;
        views.pulse.style.cssText = placement(point.x - radius, point.y - radius, size, size);
        views.pulse.style.setProperty('--tour-color', current.color);
      }
      var currentChapterIndex = current === null ? -1 : current.chapterIndex;
      views.chips.forEach(function (entry) {
        var isCurrentChapter = entry.chapterIndex === currentChapterIndex;
        entry.chip.setAttribute('aria-pressed', String(isCurrentChapter));
      });
      stage.classList.toggle('is-map', state.isMap);
      stage.classList.toggle('is-credits', state.isCredits);
      mapButton.setAttribute('aria-pressed', String(state.isMap));
      renderPlayButton();
    }

    function renderDetails(index) {
      var isCurrent = index === state.reached && !state.isMap;
      var beat = isCurrent ? state.beat : 0;
      views.cards[index].classList.toggle('is-detail', beat > 0);
      views.details[index].forEach(function (detail, detailIndex) {
        var detailBeat = detailIndex + 1;
        detail.classList.toggle('is-shown', beat >= detailBeat);
        detail.classList.toggle('is-current', beat === detailBeat);
      });
    }

    function currentFill() {
      var beatsCount = state.stops[state.reached].beats.length;
      var beatFraction = state.holdElapsed / state.holdDuration;
      return (state.beat + beatFraction) / beatsCount;
    }

    function setStepFill(index, fraction) {
      var fill = views.steps[index].firstChild;
      var shownFraction = Math.min(fraction, 1);
      fill.style.transform = 'scaleX(' + shownFraction + ')';
    }

    function renderPlayButton() {
      var isFinished = isFinishedNow();
      var icon = state.isPlaying ? 'pause' : isFinished ? 'replay' : 'play';
      var label = state.isPlaying ? 'Pause' : isFinished ? 'Replay' : 'Play';
      setIcon(playButton, icon);
      playButton.setAttribute('aria-label', label);
    }

    function isFinishedNow() {
      return state.isMap && !state.isCredits && state.reached === state.stops.length - 1;
    }

    function showCaption(mode) {
      var stop = mode === 'stop' ? state.stops[state.reached] : null;
      var key = stop === null ? mode : 'stop:' + stop.id + ':' + state.beat;
      if (key === state.captionKey) return;
      state.captionKey = key;
      var texts = stop === null ? CAPTIONS[mode] : stop.beats[state.beat];
      var content = el('div', 'docs-tour__caption-content');
      var kicker = el('div', 'docs-tour__kicker', texts.kicker);
      var title = el('div', 'docs-tour__title', texts.title);
      var text = el('p', 'docs-tour__text', texts.text);
      content.append(kicker, title, text);
      var links = el('div', 'docs-tour__links');
      if (stop !== null) {
        content.style.setProperty('--tour-color', stop.color);
        if (texts.href !== null) {
          var readMore = linkOf('Read more', texts.href, 'docs-tour__link');
          links.appendChild(readMore);
        }
      } else if (mode === 'credits') {
        var skip = captionButtonOf('Skip', endCredits);
        links.appendChild(skip);
      } else if (mode === 'end') {
        var replay = captionButtonOf('Replay', restart);
        var philosophy = linkOf('Philosophy', '/#philosophy', 'docs-tour__link');
        var installation = linkOf('Installation', '/installation/', 'docs-tour__link');
        var features = linkOf('All features', '/features/', 'docs-tour__link');
        var screensMap = linkOf('Screens Map', '/screens/', 'docs-tour__link');
        var docsGraph = linkOf('Docs Graph', '/graph/', 'docs-tour__link');
        links.append(replay, philosophy, installation, features, screensMap, docsGraph);
      }
      if (links.childNodes.length > 0) content.appendChild(links);
      caption.replaceChildren(content);
    }

    function hideCaption() {
      state.captionKey = null;
      var content = caption.firstChild;
      if (content) content.classList.add('is-leaving');
    }

    function captionButtonOf(text, onClick) {
      var button = el('button', 'docs-tour__link', text);
      button.type = 'button';
      button.addEventListener('click', onClick);
      return button;
    }

    function togglePlay() {
      if (state.isPlaying) {
        setPlaying(false);
        return;
      }
      state.hasAutoStarted = true;
      state.isPausedByScroll = false;
      setPlaying(true);
      if (state.phase === 'start') advance();
      else if (state.isCredits) wake();
      else if (state.isMap) {
        if (state.reached === -1 || isFinishedNow()) restart();
        else jumpTo(state.reached, 0);
      } else wake();
    }

    function advance() {
      if (state.reached >= state.stops.length - 1) startOutro();
      else startTravel(state.reached + 1);
    }

    function nextBeatOrStop() {
      var hasNextBeat = state.reached !== -1 && state.beat < state.stops[state.reached].beats.length - 1;
      if (hasNextBeat) enterBeat(state.beat + 1);
      else advance();
    }

    // -- pressed while moving to a stop, it lands that move where the camera is and goes on from there, so every press
    // -- is one smooth step forward instead of a cut. a move to the overview or the start keeps going (nothing would
    // -- carry the camera the rest of the way), the press acts on where it's heading
    function next() {
      var isFlyingToBeat = state.phase === 'fly' && state.fly.onDone === startBeat;
      if (state.phase === 'travel') landTravel();
      else if (isFlyingToBeat) landFly();
      if (state.isCredits) endCredits();
      else if (state.isMap) {
        if (state.reached < state.stops.length - 1) jumpTo(state.reached + 1, 0);
      } else nextBeatOrStop();
    }

    function prev() {
      if (state.isCredits) {
        jumpTo(state.stops.length - 1, 0);
        return;
      }
      var isOnDetail = state.phase !== 'travel' && !state.isMap && state.beat > 0;
      if (isOnDetail) {
        enterBeat(state.beat - 1);
        return;
      }
      var target = state.phase === 'travel' ? state.reached : state.reached - 1;
      if (target >= 0) jumpTo(target, 0);
      else goToStart();
    }

    function setPlaying(isPlaying) {
      state.isPlaying = isPlaying;
      var countdown = state.holdCountdown;
      if (countdown !== null) {
        if (isPlaying) countdown.play();
        else countdown.pause();
      }
      if (isPlaying) resumeCreditsRoll();
      else pauseCreditsRoll();
      renderPlayButton();
    }

    function restart() {
      setPlaying(true);
      goToStart();
    }

    function goToStart() {
      stopHoldCountdown();
      stopCredits();
      state.travel = null;
      state.isMap = false;
      state.reached = -1;
      state.beat = 0;
      renderReached();
      showCaption('start');
      flyTo(startCamera(), FLY_MS, function () {
        state.phase = 'start';
        if (state.isPlaying) advance();
      });
    }

    function jumpTo(index, beat) {
      stopHoldCountdown();
      stopCredits();
      state.travel = null;
      state.isMap = false;
      state.reached = index;
      state.beat = beat;
      state.holdElapsed = 0;
      renderReached();
      showCaption('stop');
      loadImagesAround(index);
      flyTo(beatCamera(index, beat), FLY_MS, startBeat);
    }

    function showDetail(index, beat) {
      var isOnStop = index === state.reached && !state.isMap && state.phase !== 'travel';
      if (isOnStop) enterBeat(beat);
      else jumpTo(index, beat);
    }

    function enterBeat(beat) {
      stopHoldCountdown();
      state.beat = beat;
      state.holdElapsed = 0;
      renderReached();
      showCaption('stop');
      flyTo(beatCamera(state.reached, beat), DETAIL_FLY_MS, startBeat);
    }

    function toggleMap() {
      if (state.isCredits) {
        endCredits();
        return;
      }
      if (state.isMap) {
        if (state.reached === -1) goToStart();
        else jumpTo(state.reached, 0);
        return;
      }
      stopHoldCountdown();
      state.reached = currentStopIndex();
      state.travel = null;
      setPlaying(false);
      var isLastStop = state.reached === state.stops.length - 1;
      openMap(isLastStop ? 'end' : 'map');
    }

    function startOutro() {
      if (state.creditsCount === 0) {
        setPlaying(false);
        openMap('end');
        return;
      }
      // -- credits only make sense rolling, reaching them while paused starts them. the last stop's countdown goes
      // -- first, playing would resume it and start the outro twice
      stopHoldCountdown();
      state.isCredits = true;
      setPlaying(true);
      openMap('credits');
    }

    // -- credits start rolling with the camera's move, so the screen is never empty while they fade in
    function openMap(captionMode) {
      state.isMap = true;
      renderReached();
      showCaption(captionMode);
      for (var index = 0; index < state.stops.length; index++) loadImage(index);
      if (state.isCredits) startCreditsRoll();
      flyTo(overviewCamera(), OUTRO_MS, function () {
        state.phase = state.isCredits ? 'credits' : 'map';
      });
    }

    function startCreditsRoll() {
      if (REDUCED_MOTION.matches) {
        credits.classList.add('is-static');
        return;
      }
      // -- read once when the roll starts, the roll itself runs without layout. it starts partway up, so the first
      // -- names show as the credits fade in
      var areaHeight = credits.clientHeight;
      var rollHeight = creditsRoll.offsetHeight;
      var startY = areaHeight * CREDITS_START_SHARE;
      var keyframes = [{ transform: 'translateY(' + startY + 'px)' }, { transform: 'translateY(' + -rollHeight + 'px)' }];
      var duration = (startY + rollHeight) / CREDITS_PX_PER_MS;
      var roll = creditsRoll.animate(keyframes, { duration: duration, easing: 'linear', fill: 'forwards' });
      if (!state.isPlaying) roll.pause();
      roll.onfinish = function () {
        if (state.creditsRoll === roll) endCredits();
      };
      state.creditsRoll = roll;
    }

    function pauseCreditsRoll() {
      if (state.creditsRoll !== null) state.creditsRoll.pause();
    }

    function resumeCreditsRoll() {
      if (state.creditsRoll !== null && state.isPlaying) state.creditsRoll.play();
    }

    // -- ended while the camera still moves out to the overview, the move finishes on its own and lands on the map
    function endCredits() {
      var isFlying = state.phase === 'fly';
      stopCredits();
      setPlaying(false);
      renderReached();
      showCaption('end');
      if (!isFlying) state.phase = 'map';
    }

    function stopCredits() {
      if (!state.isCredits) return;
      state.isCredits = false;
      var roll = state.creditsRoll;
      state.creditsRoll = null;
      if (roll !== null) {
        roll.onfinish = null;
        roll.cancel();
      }
      credits.classList.remove('is-static');
    }

    // -- the stop the tour is on, or heading to while the line draws
    function currentStopIndex() {
      return state.travel === null ? state.reached : state.travel.index;
    }

    function startTravel(index) {
      var length = state.lengths[index];
      var duration = clamp(length * TRAVEL_MS_PER_PX, TRAVEL_MIN_MS, TRAVEL_MAX_MS);
      state.travel = {
        index: index,
        length: length,
        expressLength: state.expressLengths[index],
        duration: duration,
        elapsed: 0,
        from: state.camera,
        target: beatCamera(index, 0),
        isRevealed: false,
      };
      // -- a travel can start during a fly (next pressed on the way back to the start), only one move runs at a time
      state.fly = null;
      state.phase = 'travel';
      stopHoldCountdown();
      if (state.reached !== -1) setStepFill(state.reached, 1);
      views.segments[index].classList.remove('is-empty');
      var express = views.expresses[index];
      if (express !== null) express.classList.remove('is-empty');
      hideCaption();
      loadImagesAround(index);
      setMoving(true);
      if (REDUCED_MOTION.matches) finishTravel();
      else wake();
    }

    function stepTravel(elapsed) {
      var travel = state.travel;
      travel.elapsed += elapsed;
      var progress = travelProgress();
      drawTravel(progress);
      if (!travel.isRevealed && progress >= TRAVEL_REVEAL_SHARE) revealTravelStop(travel);
      if (progress === 1) finishTravel();
    }

    // -- the next shot comes in while the line is still on its way, so arriving is one motion
    function revealTravelStop(travel) {
      var index = travel.index;
      travel.isRevealed = true;
      views.cards[index].classList.add('is-current');
      views.labels[index].classList.add('is-current');
      if (index === 0) return;
      views.cards[index - 1].classList.replace('is-current', 'is-visited');
      views.cards[index - 1].classList.remove('is-detail');
      views.labels[index - 1].classList.remove('is-current');
    }

    function travelProgress() {
      return Math.min(state.travel.elapsed / state.travel.duration, 1);
    }

    // -- the camera keeps its offset from the stop around the line's head, so it lands right on it
    function drawTravel(progress) {
      var travel = state.travel;
      var drawn = drawTravelLine(progress);
      var segment = views.segments[travel.index];
      var head = segment.getPointAtLength(drawn);
      var point = state.points[travel.index];
      var target = travel.target;
      var follow = { x: head.x + target.x - point.x, y: head.y + target.y - point.y, scale: target.scale };
      var catchUpProgress = Math.min(progress / TRAVEL_CAMERA_CATCH_UP_SHARE, 1);
      var catchUp = easeInOut(catchUpProgress);
      state.camera = mixCameras(travel.from, follow, catchUp);
      applyCamera(state.camera);
    }

    function drawTravelLine(progress) {
      var travel = state.travel;
      var lineProgress = easeInOut(progress);
      var drawn = travel.length * lineProgress;
      var segment = views.segments[travel.index];
      segment.style.strokeDashoffset = String(travel.length - drawn);
      var express = views.expresses[travel.index];
      if (express !== null) {
        var expressDashOffset = travel.expressLength * (1 - lineProgress);
        express.style.strokeDashoffset = String(expressDashOffset);
      }
      return drawn;
    }

    function finishTravel() {
      drawTravel(1);
      arriveFromTravel();
    }

    function landTravel() {
      drawTravelLine(1);
      arriveFromTravel();
    }

    function arriveFromTravel() {
      var index = state.travel.index;
      state.travel = null;
      state.reached = index;
      state.beat = 0;
      setMoving(false);
      startBeat();
    }

    function startBeat() {
      var stop = state.stops[state.reached];
      var beat = stop.beats[state.beat];
      var isQuick = beat.isDetail || stop.isBranch;
      var baseMS = isQuick ? DETAIL_HOLD_BASE_MS : HOLD_BASE_MS;
      var maxMS = isQuick ? DETAIL_HOLD_MAX_MS : HOLD_MAX_MS;
      state.phase = 'hold';
      state.holdElapsed = 0;
      var readingMS = baseMS + beat.text.length * HOLD_MS_PER_CHAR;
      state.holdDuration = Math.min(readingMS, maxMS);
      renderReached();
      showCaption('stop');
      loadImagesAround(state.reached);
      startHoldCountdown();
    }

    // -- the browser runs the countdown on its own, so holding on a stop takes no frames from the page
    function startHoldCountdown() {
      var beatsCount = state.stops[state.reached].beats.length;
      var fromFill = state.beat / beatsCount;
      var toFill = (state.beat + 1) / beatsCount;
      setStepFill(state.reached, toFill);
      var fill = views.steps[state.reached].firstChild;
      var keyframes = [{ transform: 'scaleX(' + fromFill + ')' }, { transform: 'scaleX(' + toFill + ')' }];
      var countdown = fill.animate(keyframes, { duration: state.holdDuration, easing: 'linear' });
      if (!state.isPlaying) countdown.pause();
      countdown.onfinish = function () {
        if (state.holdCountdown !== countdown) return;
        state.holdCountdown = null;
        nextBeatOrStop();
      };
      state.holdCountdown = countdown;
    }

    // -- keeps how far it got, so the progress bar can show it stopped there
    function stopHoldCountdown() {
      var countdown = state.holdCountdown;
      if (countdown === null) return;
      state.holdElapsed = countdown.currentTime || 0;
      countdown.onfinish = null;
      countdown.cancel();
      state.holdCountdown = null;
    }

    function flyTo(target, duration, onDone) {
      state.fly = { from: state.camera, to: target, elapsed: 0, duration: duration, onDone: onDone };
      state.phase = 'fly';
      setMoving(true);
      if (REDUCED_MOTION.matches) finishFly();
      else wake();
    }

    function stepFly(elapsed) {
      var fly = state.fly;
      fly.elapsed += elapsed;
      var progress = Math.min(fly.elapsed / fly.duration, 1);
      var eased = easeInOut(progress);
      state.camera = mixCameras(fly.from, fly.to, eased);
      applyCamera(state.camera);
      if (progress === 1) finishFly();
    }

    function finishFly() {
      var fly = state.fly;
      state.camera = fly.to;
      applyCamera(fly.to);
      landFly();
    }

    function landFly() {
      var fly = state.fly;
      state.fly = null;
      setMoving(false);
      fly.onDone();
    }

    function needsFrames() {
      return state.phase === 'travel' || state.phase === 'fly';
    }

    function wake() {
      if (state.frameId !== 0 || !needsFrames()) return;
      state.lastFrameTime = 0;
      state.frameId = requestAnimationFrame(frame);
    }

    function frame(time) {
      state.frameId = 0;
      var sinceLastFrame = Math.min(time - state.lastFrameTime, FRAME_MAX_MS);
      var elapsed = state.lastFrameTime === 0 ? FIRST_FRAME_MS : sinceLastFrame;
      state.lastFrameTime = time;
      if (state.phase === 'travel') stepTravel(elapsed);
      else if (state.phase === 'fly') stepFly(elapsed);
      if (needsFrames()) state.frameId = requestAnimationFrame(frame);
    }

    function setMoving(isMoving) {
      stage.classList.toggle('is-moving', isMoving);
    }

    // -- the stage is read here only, so animation frames never wait on layout
    function measureStage() {
      var width = stage.clientWidth;
      var height = stage.clientHeight - CONTROLS_HEIGHT;
      var isWide = width >= WIDE_STAGE;
      var side = isWide ? Math.min(width * SIDE_CAPTION_SHARE, SIDE_CAPTION_MAX) : 0;
      var routeHeight = isWide ? height : Math.max(height - BOTTOM_CAPTION_ROOM, 1);
      var area = { left: side, top: 0, width: width - side, height: routeHeight };
      var geometry = state.geometry;
      var heightScale = (area.height * FOCUS_FILL) / geometry.focusHeight;
      var widthScale = (area.width * FOCUS_MAX_CARD_SHARE) / geometry.card.width;
      var focusScale = Math.min(heightScale, widthScale);
      state.area = area;
      state.focusScale = clamp(focusScale, MIN_SCALE, MAX_SCALE);
      stage.classList.toggle('docs-tour__stage--wide', isWide);
      stage.style.setProperty('--tour-side', side + 'px');
      stage.style.setProperty('--tour-route-height', routeHeight + 'px');
    }

    function beatCamera(index, beat) {
      if (beat === 0) return stopCamera(index);
      var stop = state.stops[index];
      if (stop.kind === 'mosaic') return tileCamera(index, beat - 1);
      return pinCamera(index, beat - 1);
    }

    // -- a branch stop frames the row's line above it too, so the fork stays in view
    function stopCamera(index) {
      var stop = state.stops[index];
      var point = state.points[index];
      if (stop.isBranch) {
        var top = point.y - BRANCH_DROP - BRANCH_ROW_LINE_MARGIN;
        var bottom = point.y + BRANCH_CARD_GAP + stop.size.height;
        var branchHeightScale = (state.area.height * FOCUS_FILL) / (bottom - top);
        var branchWidthScale = (state.area.width * FOCUS_MAX_CARD_SHARE) / stop.size.width;
        var branchFitScale = Math.min(branchHeightScale, branchWidthScale);
        var branchScale = clamp(branchFitScale, MIN_SCALE, DETAIL_MAX_SCALE);
        return { x: point.x, y: (top + bottom) / 2, scale: branchScale };
      }
      var widthScale = (state.area.width * MOSAIC_MAX_WIDTH_SHARE) / stop.size.width;
      var fitScale = Math.min(state.focusScale, widthScale);
      var scale = Math.max(fitScale, MIN_SCALE);
      return { x: point.x, y: point.y - state.geometry.focusCenterAboveLine, scale: scale };
    }

    function tileCamera(index, tileIndex) {
      var stop = state.stops[index];
      var point = state.points[index];
      var tileSize = state.geometry.tile;
      var offset = tileOffsetOf(stop, tileIndex, tileSize);
      var left = point.x - stop.size.width / 2 + offset.left;
      var top = point.y - CARD_GAP - stop.size.height + offset.top;
      var centerX = left + tileSize.width / 2;
      var centerY = top + tileSize.height / 2;
      return detailCamera(centerX, centerY, tileSize.width, tileSize.height);
    }

    function pinCamera(index, pinIndex) {
      var stop = state.stops[index];
      var point = state.points[index];
      var pin = stop.pins[pinIndex];
      var image = views.images[index][0].image;
      var ratio = image.naturalWidth > 0 ? image.naturalHeight / image.naturalWidth : state.geometry.card.ratio;
      var width = stop.size.width;
      var height = Math.min(width * ratio, stop.size.height);
      var left = point.x - width / 2;
      var top = stop.isBranch ? point.y + BRANCH_CARD_GAP : point.y - CARD_GAP - height;
      var frameWidth = width * PIN_FRAME_WIDTH_SHARE;
      var frameHeight = height * PIN_FRAME_HEIGHT_SHARE;
      var pinX = left + pin.x * width;
      var pinY = top + pin.y * height;
      var centerX = clamp(pinX, left + frameWidth / 2, left + width - frameWidth / 2);
      var centerY = clamp(pinY, top + frameHeight / 2, top + height - frameHeight / 2);
      return detailCamera(centerX, centerY, frameWidth, frameHeight);
    }

    function detailCamera(centerX, centerY, width, height) {
      var area = state.area;
      var heightScale = (area.height * FOCUS_FILL) / height;
      var widthScale = (area.width * DETAIL_MAX_WIDTH_SHARE) / width;
      var scale = Math.min(heightScale, widthScale);
      return { x: centerX, y: centerY, scale: clamp(scale, MIN_SCALE, DETAIL_MAX_SCALE) };
    }

    function startCamera() {
      var origin = state.geometry.origin;
      return { x: origin.x, y: origin.y, scale: state.focusScale };
    }

    function overviewCamera() {
      var area = state.area;
      var bounds = state.bounds;
      var width = bounds.right - bounds.left;
      var height = bounds.bottom - bounds.top;
      var widthScale = (area.width - OVERVIEW_PADDING * 2) / width;
      var heightScale = (area.height - OVERVIEW_PADDING * 2) / height;
      var scale = Math.min(widthScale, heightScale);
      return { x: bounds.left + width / 2, y: bounds.top + height / 2, scale: Math.max(scale, OVERVIEW_MIN_SCALE) };
    }

    function restingCamera() {
      if (state.isMap) return overviewCamera();
      if (state.reached === -1) return startCamera();
      return beatCamera(state.reached, state.beat);
    }

    function applyCamera(camera) {
      var area = state.area;
      var x = area.left + area.width / 2 - camera.x * camera.scale;
      var y = area.top + area.height / 2 - camera.y * camera.scale;
      world.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale(' + camera.scale + ')';
    }

    function loadImagesAround(index) {
      for (var at = index - 1; at <= index + PRELOAD_AHEAD; at++) loadImage(at);
    }

    function loadImage(index) {
      if (index < 0 || index >= state.stops.length) return;
      views.images[index].forEach(function (entry) {
        if (!entry.image.hasAttribute('src')) entry.image.src = shotOf(entry.themes);
      });
    }

    function onThemeChange() {
      views.images.forEach(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.image.hasAttribute('src')) return;
          var shot = shotOf(entry.themes);
          if (entry.image.getAttribute('src') !== shot) entry.image.src = shot;
        });
      });
    }

    function switchPlatform(platform) {
      var oldStops = state.stops;
      var oldIndex = currentStopIndex();
      var isWide = platform === WIDE_PLATFORM;
      state.platform = platform;
      state.geometry = geometryOf(platform);
      store(TOUR_PLATFORM_STORAGE_KEY, isWide ? platform : '');
      if (!isWide) store(SHARED_PLATFORM_STORAGE_KEY, platform);
      platformButtons.press(platform);
      measureStage();
      rebuildRouteKeepingStop(oldStops, oldIndex);
    }

    function switchLevel(levelId) {
      var oldStops = state.stops;
      var oldIndex = currentStopIndex();
      state.level = levelIndexOf(levelId);
      store(TOUR_LEVEL_STORAGE_KEY, levelId);
      levelButtons.press(levelId);
      rebuildRouteKeepingStop(oldStops, oldIndex);
    }

    // -- stays on the same stop, or the closest one before it when this platform has no shot for it
    function rebuildRouteKeepingStop(oldStops, oldIndex) {
      stopHoldCountdown();
      stopCredits();
      if (state.frameId !== 0) cancelAnimationFrame(state.frameId);
      state.frameId = 0;
      state.travel = null;
      state.fly = null;
      setMoving(false);
      buildRoute();
      var reached = -1;
      for (var index = oldIndex; index >= 0 && reached === -1; index--) reached = indexOfStop(state.stops, oldStops[index].id);
      state.reached = reached;
      state.beat = 0;
      state.captionKey = null;
      if (state.isMap) {
        state.phase = 'map';
        for (var at = 0; at < state.stops.length; at++) loadImage(at);
        renderReached();
        showCaption(isFinishedNow() ? 'end' : 'map');
      } else if (reached === -1) {
        state.phase = 'start';
        renderReached();
        showCaption('start');
      } else {
        startBeat();
      }
      state.camera = restingCamera();
      applyCamera(state.camera);
    }

    function onResize() {
      measureStage();
      if (state.fly !== null) finishFly();
      if (state.travel !== null) {
        state.travel.from = restingCamera();
        state.travel.target = beatCamera(state.travel.index, 0);
        drawTravel(travelProgress());
        return;
      }
      state.camera = restingCamera();
      applyCamera(state.camera);
    }

    function onVisibility(entries) {
      var lastEntry = entries[entries.length - 1];
      var isVisible = lastEntry.intersectionRatio >= VISIBLE_RATIO;
      state.isVisible = isVisible;
      if (isVisible) {
        var shouldAutoStart = !state.hasAutoStarted && !REDUCED_MOTION.matches;
        if (shouldAutoStart || state.isPausedByScroll) togglePlay();
      } else if (state.isPlaying) {
        state.isPausedByScroll = true;
        setPlaying(false);
      }
    }

    // -- keys work across the page while the tour is in view, but never while typing. space on a focused button or link
    // -- is left to press it
    function onKeyDown(event) {
      if (!state.isVisible || event.defaultPrevented) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      var target = event.target instanceof Element ? event.target : null;
      if (target !== null && target.closest(TEXT_ENTRY_SELECTOR) !== null) return;
      var isOnPressable = target !== null && target.closest(PRESSABLE_SELECTOR) !== null;
      if (event.key === ' ' && !isOnPressable) togglePlay();
      else if (event.key === 'ArrowRight') next();
      else if (event.key === 'ArrowLeft') prev();
      else if (event.key === 'Escape' && state.isMap) toggleMap();
      else return;
      event.preventDefault();
    }

    function toggleFullscreen() {
      if (document.fullscreenElement === stage) document.exitFullscreen();
      else stage.requestFullscreen();
    }

    function onFullscreenChange() {
      var isFullscreen = document.fullscreenElement === stage;
      setIcon(fullscreenButton, isFullscreen ? 'shrink' : 'expand');
      fullscreenButton.setAttribute('aria-label', isFullscreen ? 'Exit fullscreen' : 'Fullscreen');
    }
  }

  // -- the docs always set data-theme, a page embedding the tour without it follows the system scheme
  function themeOf() {
    var pageTheme = document.documentElement.getAttribute('data-theme');
    if (pageTheme === 'dark' || pageTheme === 'light') return pageTheme;
    return DARK_SCHEME.matches ? 'dark' : 'light';
  }

  function shotOf(themes) {
    var theme = themeOf();
    var variant = themes[theme] || themes.light || themes.dark;
    return variant.shot;
  }

  function isOnPlatform(stop, platform) {
    if (stop.tiles === undefined) return stop.variants[platform] !== undefined;
    return stop.tiles.some(function (tile) {
      return tile.variants[platform] !== undefined;
    });
  }

  // -- the wide view is the desktop app in a wide window
  function isCreditsGroupOn(group, platform) {
    if (group.platforms === null) return true;
    var groupPlatform = platform === WIDE_PLATFORM ? DESKTOP_PLATFORM : platform;
    return group.platforms.indexOf(groupPlatform) !== -1;
  }

  function levelIndexOf(levelId) {
    var index = LEVELS.findIndex(function (level) {
      return level.id === levelId;
    });
    return index === -1 ? levelIndexOf(DEFAULT_LEVEL_ID) : index;
  }

  // -- every chapter gets a row of its own, a chapter with no stop on this platform and level gets none. a branch stop
  // -- is left out with the stop it branches from
  function stopsOf(data, platform, level, geometry) {
    var stops = [];
    var row = -1;
    data.chapters.forEach(function (chapter, chapterIndex) {
      var color = 'var(--tour-color-' + chapter.color + ')';
      var isChapterStart = true;
      var parent = null;
      chapter.stops.forEach(function (raw) {
        var isBranch = raw.isBranch === true;
        var hasParent = !isBranch || parent !== null;
        var isInLevel = raw.level <= level;
        var stop = null;
        if (isInLevel && raw.tiles !== undefined) stop = mosaicStopOf(raw, platform, level, geometry);
        else if (isInLevel && hasParent) stop = shotStopOf(raw, platform, level, geometry);
        if (!isBranch) parent = stop;
        if (stop === null) return;
        if (isChapterStart) row++;
        stop.beats[0].kicker = isBranch ? parent.title : chapter.title;
        stop.row = row;
        stop.chapter = chapter.title;
        stop.chapterIndex = chapterIndex;
        stop.color = color;
        stop.isChapterStart = isChapterStart;
        stops.push(stop);
        isChapterStart = false;
      });
    });
    return stops;
  }

  function shotStopOf(raw, platform, level, geometry) {
    var themes = raw.variants[platform];
    if (themes === undefined) return null;
    var isBranch = raw.isBranch === true;
    var card = isBranch ? geometry.branchCard : geometry.card;
    var platformPins = (raw.pins && raw.pins[platform]) || [];
    var pins = platformPins.filter(function (pin) {
      return pin.level <= level;
    });
    var detailBeats = pins.map(function (pin) {
      return { kicker: raw.title, title: pin.title, text: pin.text, href: pin.href || raw.href, isDetail: true };
    });
    var beats = [{ kicker: '', title: raw.title, text: raw.text, href: raw.href, isDetail: false }].concat(detailBeats);
    return {
      id: raw.id,
      kind: 'shot',
      isBranch: isBranch,
      title: raw.title,
      text: raw.text,
      themes: themes,
      pins: pins,
      beats: beats,
      size: { width: card.width, height: card.maxHeight },
      weight: isBranch ? BRANCH_STEP_WEIGHT : 1 + pins.length * DETAIL_STEP_WEIGHT,
    };
  }

  // -- a mosaic left with one tile (the rest on another platform or level, or still waiting for shots) is a plain stop
  function mosaicStopOf(raw, platform, level, geometry) {
    var shownTiles = raw.tiles.filter(function (tile) {
      return tile.variants[platform] !== undefined && tile.level <= level;
    });
    if (shownTiles.length === 0) return null;
    if (shownTiles.length === 1) {
      var onlyTile = shownTiles[0];
      var plainHref = raw.href || onlyTile.href;
      var plainStop = { id: raw.id, title: raw.title, text: raw.text, href: plainHref, variants: onlyTile.variants };
      return shotStopOf(plainStop, platform, level, geometry);
    }
    var tiles = shownTiles.map(function (tile) {
      return { title: tile.title, text: tile.text, href: tile.href, themes: tile.variants[platform] };
    });
    var rows = Math.min(tiles.length, MOSAIC_MAX_ROWS);
    var columns = Math.ceil(tiles.length / rows);
    var tile = geometry.tile;
    var detailBeats = tiles.map(function (entry) {
      return { kicker: raw.title, title: entry.title, text: entry.text, href: entry.href, isDetail: true };
    });
    var beats = [{ kicker: '', title: raw.title, text: raw.text, href: raw.href, isDetail: false }].concat(detailBeats);
    var width = MOSAIC_PADDING * 2 + columns * tile.width + (columns - 1) * MOSAIC_GAP;
    var height = MOSAIC_PADDING * 2 + rows * tile.height + (rows - 1) * MOSAIC_GAP;
    return {
      id: raw.id,
      kind: 'mosaic',
      isBranch: false,
      title: raw.title,
      text: raw.text,
      tiles: tiles,
      columns: columns,
      beats: beats,
      size: { width: width, height: height },
      weight: 1 + tiles.length * DETAIL_STEP_WEIGHT,
    };
  }

  function tileOffsetOf(stop, tileIndex, tileSize) {
    var column = tileIndex % stop.columns;
    var row = Math.floor(tileIndex / stop.columns);
    return {
      left: MOSAIC_PADDING + column * (tileSize.width + MOSAIC_GAP),
      top: MOSAIC_PADDING + row * (tileSize.height + MOSAIC_GAP),
    };
  }

  function stationRadiusOf(stop) {
    if (stop.isChapterStart) return CHAPTER_STOP_RADIUS;
    return stop.isBranch ? BRANCH_STOP_RADIUS : STOP_RADIUS;
  }

  // -- the start icon sits clear of the first card
  function geometryOf(platform) {
    var card = platform === WIDE_PLATFORM ? WIDE_CARD : PHONE_CARD;
    var branchCard = { width: card.width * BRANCH_CARD_SHARE, maxHeight: card.maxHeight * BRANCH_CARD_SHARE };
    var tileHeight = (card.maxHeight - MOSAIC_PADDING * 2 - MOSAIC_GAP * (MOSAIC_MAX_ROWS - 1)) / MOSAIC_MAX_ROWS;
    var aboveLine = card.maxHeight + CARD_GAP;
    return {
      card: card,
      branchCard: branchCard,
      tile: { width: tileHeight / card.ratio, height: tileHeight },
      aboveLine: aboveLine,
      rowHeight: aboveLine + BELOW_LINE + ROW_GAP,
      branchRowExtra: BRANCH_DROP + BRANCH_CARD_GAP + branchCard.maxHeight - BELOW_LINE,
      origin: { x: -(card.width / 2 + ORIGIN_CLEARANCE), y: 0, row: 0, isBranch: false },
      focusHeight: aboveLine + BELOW_LINE,
      focusCenterAboveLine: (aboveLine - BELOW_LINE) / 2,
    };
  }

  // -- rows run right then left, each one starting right under where the last one ended, so the line snakes down. a
  // -- branch leaves its stop for a line of its own under the row, and the next stop waits for it at its end, joined to
  // -- the branch's stop by a straight express line
  function layoutPoints(stops, geometry) {
    var branchRows = {};
    stops.forEach(function (stop) {
      if (stop.isBranch) branchRows[stop.row] = true;
    });
    var points = [];
    var x = 0;
    var lineY = 0;
    var mainStop = null;
    var mainPoint = null;
    stops.forEach(function (stop, index) {
      var previous = index === 0 ? null : stops[index - 1];
      var direction = stop.row % 2 === 0 ? 1 : -1;
      var isSameRow = previous !== null && previous.row === stop.row;
      var isRejoining = isSameRow && previous.isBranch && !stop.isBranch;
      if (previous !== null && !isSameRow) {
        var branchExtra = branchRows[previous.row] ? geometry.branchRowExtra : 0;
        lineY += geometry.rowHeight + branchExtra;
      } else if (isSameRow) {
        var distance = distanceBetween(previous, stop);
        x += direction * distance;
        if (isRejoining) {
          var clearDistance = distanceBetween(mainStop, stop);
          var clearX = mainPoint.x + direction * clearDistance;
          x = direction > 0 ? Math.max(x, clearX) : Math.min(x, clearX);
        }
      }
      var point = {
        x: x,
        y: stop.isBranch ? lineY + BRANCH_DROP : lineY,
        row: stop.row,
        reach: stop.size.width / 2 + TURN_CLEARANCE,
        isBranch: stop.isBranch,
        expressFrom: isRejoining ? mainPoint : null,
      };
      if (!stop.isBranch) {
        mainStop = stop;
        mainPoint = point;
      }
      points.push(point);
    });
    return points;
  }

  function distanceBetween(from, to) {
    if (from.isBranch !== to.isBranch) return BRANCH_RUN;
    var spacing = from.isBranch ? BRANCH_SPACING : CARD_SPACING;
    return from.size.width / 2 + spacing + to.size.width / 2;
  }

  function boundsOf(stops, points, geometry) {
    var left = geometry.origin.x - ORIGIN_SIZE / 2;
    var right = 0;
    var bottom = 0;
    points.forEach(function (point, index) {
      left = Math.min(left, point.x - point.reach);
      right = Math.max(right, point.x + point.reach);
      var below = point.isBranch ? BRANCH_CARD_GAP + stops[index].size.height : BELOW_LINE;
      bottom = Math.max(bottom, point.y + below);
    });
    return { left: left, right: right, top: -geometry.aboveLine, bottom: bottom };
  }

  function segmentPath(from, to) {
    if (from.row !== to.row) return turnPath(from, to);
    if (from.y !== to.y) return branchCurvePath(from, to);
    return 'M' + from.x + ' ' + from.y + 'H' + to.x;
  }

  // -- out past the row's end, down with rounded corners and back in
  function turnPath(from, to) {
    var direction = from.row % 2 === 0 ? 1 : -1;
    var turnX = from.x + direction * from.reach;
    var cornerX = turnX - direction * TURN_RADIUS;
    var sweep = direction > 0 ? 1 : 0;
    var arc = 'A' + TURN_RADIUS + ' ' + TURN_RADIUS + ' 0 0 ' + sweep + ' ';
    return (
      'M' + from.x + ' ' + from.y +
      'H' + cornerX +
      arc + turnX + ' ' + (from.y + TURN_RADIUS) +
      'V' + (to.y - TURN_RADIUS) +
      arc + cornerX + ' ' + to.y +
      'H' + to.x
    );
  }

  // -- a short straight, a smooth s-curve down to the branch (or back up) and another short straight
  function branchCurvePath(from, to) {
    var direction = to.x > from.x ? 1 : -1;
    var startX = from.x + direction * BRANCH_STRAIGHT;
    var endX = to.x - direction * BRANCH_STRAIGHT;
    var middleX = (startX + endX) / 2;
    return (
      'M' + from.x + ' ' + from.y +
      'H' + startX +
      'C' + middleX + ' ' + from.y + ' ' + middleX + ' ' + to.y + ' ' + endX + ' ' + to.y +
      'H' + to.x
    );
  }

  function prepareDash(path) {
    var length = path.getTotalLength();
    path.style.strokeDasharray = length + ' ' + length;
    return length;
  }

  function indexOfStop(stops, id) {
    for (var index = 0; index < stops.length; index++) {
      if (stops[index].id === id) return index;
    }
    return -1;
  }

  function mixCameras(from, to, amount) {
    var scaleRatio = to.scale / from.scale;
    return {
      x: from.x + (to.x - from.x) * amount,
      y: from.y + (to.y - from.y) * amount,
      scale: from.scale * Math.pow(scaleRatio, amount),
    };
  }

  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function placement(left, top, width, height) {
    return 'left: ' + left + 'px; top: ' + top + 'px; width: ' + width + 'px; height: ' + height + 'px;';
  }

  function imageOf(alt) {
    var image = document.createElement('img');
    image.alt = alt;
    image.decoding = 'async';
    return image;
  }

  function linkOf(text, href, className) {
    var link = el('a', className, text);
    var relativeHref = href.replace(/^\//, '');
    link.href = new URL(relativeHref, SITE_ROOT).href;
    if (link.hostname !== window.location.hostname) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    return link;
  }

  function iconButton(icon, label, onClick) {
    var button = el('button', 'docs-tour__button');
    button.type = 'button';
    button.setAttribute('aria-label', label);
    button.title = label;
    setIcon(button, icon);
    button.addEventListener('click', onClick);
    return button;
  }

  function setIcon(button, icon) {
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[icon] + '</svg>';
  }

  function switchOf(options, onPick) {
    var element = el('div', 'docs-tour__switch');
    element.setAttribute('role', 'group');
    var buttons = {};
    options.forEach(function (option) {
      var button = el('button', 'docs-tour__switch-button', option.label);
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

  function svgEl(tag, className) {
    var node = document.createElementNS(SVG_NS, tag);
    node.setAttribute('class', className);
    return node;
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
