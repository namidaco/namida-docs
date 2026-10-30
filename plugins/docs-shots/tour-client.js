// by claude
// Tour page (data from plugins/docs-shots, stops written in tour.json): a short trailer of the app's main features.
// A line runs from stop to stop like a route on a map, snaking down the rows, each chapter in its own color. The camera
// follows the line while it draws, and every stop reveals its screenshot with a caption. It plays by itself once in
// view and ends on the whole route.
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
  var IS_DESKTOP_AGENT = /Windows NT|Macintosh|Linux x86_64|X11/.test(navigator.userAgent) && !/Android/.test(navigator.userAgent);
  var REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');
  var DARK_SCHEME = window.matchMedia('(prefers-color-scheme: dark)');
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var CAPTIONS = {
    start: { chapter: 'Tour', title: 'A quick look at Namida', text: 'Press play to follow the line through the main features.' },
    map: { chapter: 'Tour', title: 'The whole route', text: 'Pick a screen to jump to it, or press play to go on.' },
    end: { chapter: 'Tour', title: 'That was a quick look', text: 'Every feature has more to it, and these docs cover it all.' },
  };

  // -- world pixels: every shot is a card above its stop at the shot's own ratio, its title under it
  var PHONE_CARD = { width: 230, maxHeight: 520, placeholderRatio: '9 / 20' };
  var WIDE_CARD = { width: 520, maxHeight: 380, placeholderRatio: '10 / 7' };
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
  var FOCUS_FILL = 0.88;
  var FOCUS_MAX_CARD_SHARE = 0.7;
  var MIN_SCALE = 0.3;
  var MAX_SCALE = 1.15;
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
  var OUTRO_MS = 1800;
  var HOLD_BASE_MS = 2200;
  var HOLD_MS_PER_CHAR = 32;
  var HOLD_MAX_MS = 6500;
  var HOLD_FILL_KEYFRAMES = [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }];
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
    } catch (e) {}
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
          return stop.variants[platform] !== undefined;
        });
      });
    });
    var defaultPlatform = IS_DESKTOP_AGENT ? DESKTOP_PLATFORM : ANDROID_PLATFORM;
    var sharedPlatform = readStored(SHARED_PLATFORM_STORAGE_KEY, defaultPlatform);
    var storedPlatform = readStored(TOUR_PLATFORM_STORAGE_KEY, sharedPlatform);
    var hasStoredPlatform = platforms.indexOf(storedPlatform) !== -1;
    var initialPlatform = hasStoredPlatform ? storedPlatform : platforms[0];
    var initialGeometry = geometryOf(initialPlatform);
    var state = {
      platform: initialPlatform,
      geometry: initialGeometry,
      stops: [],
      points: [],
      lengths: [],
      bounds: null,
      area: null,
      focusScale: 1,
      // -- the last stop the line got to, -1 while still at the start
      reached: -1,
      // -- start, travel (the line draws to the next stop), fly (the camera moves), hold (on a stop) or map
      phase: 'start',
      isMap: false,
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
      frameId: 0,
      lastFrameTime: 0,
      captionKey: null,
    };
    var views = { segments: [], stations: [], cards: [], labels: [], steps: [], chips: [], pulse: null };

    var toolbar = el('div', 'docs-tour__toolbar');
    var chaptersElement = el('div', 'docs-tour__chapters');
    toolbar.appendChild(chaptersElement);
    var platformButtons = null;
    if (platforms.length > 1) {
      var platformOptions = platforms.map(function (platform) {
        return { id: platform, label: data.platforms[platform] };
      });
      platformButtons = switchOf(platformOptions, switchPlatform);
      platformButtons.press(state.platform);
      toolbar.appendChild(platformButtons.element);
    }

    var stage = el('div', 'docs-tour__stage');
    stage.tabIndex = 0;
    stage.setAttribute('role', 'region');
    stage.setAttribute('aria-label', 'Namida tour, space plays or pauses, arrows step');
    var world = el('div', 'docs-tour__world');
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
    stage.append(world, caption, controls);
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
        resizeObserver.disconnect();
        themeObserver.disconnect();
        DARK_SCHEME.removeEventListener('change', onThemeChange);
        visibilityObserver.disconnect();
      },
    };

    function buildRoute() {
      var geometry = state.geometry;
      var origin = geometry.origin;
      var stops = stopsOf(data, state.platform);
      var points = layoutPoints(stops, geometry);
      state.stops = stops;
      state.points = points;
      state.bounds = boundsOf(points, geometry);

      var svg = svgEl('svg', 'docs-tour__lines');
      var track = svgEl('path', 'docs-tour__track');
      var trackData = '';
      views.segments = stops.map(function (stop, index) {
        var from = index === 0 ? origin : state.points[index - 1];
        var segmentData = segmentPath(from, state.points[index], geometry);
        trackData += segmentData;
        var segment = svgEl('path', 'docs-tour__segment');
        segment.setAttribute('d', segmentData);
        segment.style.setProperty('--tour-color', stop.color);
        return segment;
      });
      track.setAttribute('d', trackData);
      views.stations = stops.map(function (stop, index) {
        var point = state.points[index];
        var station = svgEl('circle', 'docs-tour__station');
        station.setAttribute('cx', point.x);
        station.setAttribute('cy', point.y);
        station.setAttribute('r', stop.isChapterStart ? CHAPTER_STOP_RADIUS : STOP_RADIUS);
        station.style.setProperty('--tour-color', stop.color);
        return station;
      });
      var svgChildren = [track].concat(views.segments, views.stations);
      svg.append.apply(svg, svgChildren);

      // -- an html ring the gpu can animate on its own, an animated svg circle repaints the whole route every frame
      views.pulse = el('div', 'docs-tour__pulse');

      var originElement = el('div', 'docs-tour__origin');
      originElement.style.cssText = placement(origin.x - ORIGIN_SIZE / 2, origin.y - ORIGIN_SIZE / 2, ORIGIN_SIZE, ORIGIN_SIZE);
      var originIcon = document.createElement('img');
      originIcon.src = APP_ICON_URL;
      originIcon.alt = '';
      originElement.appendChild(originIcon);

      var cardSpec = geometry.card;
      var placeholderRatio = 'auto ' + cardSpec.placeholderRatio;
      views.cards = stops.map(function (stop, index) {
        var point = state.points[index];
        var card = el('div', 'docs-tour__card');
        card.style.cssText = cardPlacement(point, cardSpec);
        card.style.setProperty('--tour-color', stop.color);
        card.title = stop.title;
        var image = document.createElement('img');
        image.alt = stop.title;
        image.decoding = 'async';
        image.style.aspectRatio = placeholderRatio;
        card.appendChild(image);
        card.addEventListener('click', function () {
          if (state.isMap || index !== state.reached) jumpTo(index);
        });
        return card;
      });
      views.labels = stops.map(function (stop, index) {
        var point = state.points[index];
        var label = el('div', 'docs-tour__label', stop.title);
        label.style.cssText = placement(point.x - LABEL_WIDTH / 2, point.y + LABEL_GAP, LABEL_WIDTH, LABEL_HEIGHT);
        return label;
      });
      var worldChildren = [svg, views.pulse, originElement].concat(views.cards, views.labels);
      world.replaceChildren.apply(world, worldChildren);

      // -- lengths need the paths in the page
      state.lengths = views.segments.map(function (segment) {
        var length = segment.getTotalLength();
        segment.style.strokeDasharray = length + ' ' + length;
        return length;
      });

      views.steps = stops.map(function (stop, index) {
        var step = el('button', 'docs-tour__step');
        step.type = 'button';
        step.setAttribute('aria-label', stop.chapter + ': ' + stop.title);
        step.style.setProperty('--tour-color', stop.color);
        step.appendChild(el('span', 'docs-tour__step-fill'));
        step.addEventListener('click', function () {
          jumpTo(index);
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
          jumpTo(index);
        });
        chips.push(chip);
        views.chips.push({ chip: chip, chapterIndex: stop.chapterIndex });
      });
      chaptersElement.replaceChildren.apply(chaptersElement, chips);
    }

    function renderReached() {
      var reached = state.reached;
      var isFinished = isFinishedNow();
      var currentFill = state.holdElapsed / state.holdDuration;
      state.stops.forEach(function (stop, index) {
        var isReached = index <= reached;
        var isCurrent = index === reached;
        var segment = views.segments[index];
        var dashOffset = isReached ? 0 : state.lengths[index];
        segment.classList.toggle('is-empty', !isReached);
        segment.style.strokeDashoffset = String(dashOffset);
        views.stations[index].classList.toggle('is-reached', isReached);
        views.stations[index].classList.toggle('is-current', isCurrent);
        views.cards[index].classList.toggle('is-visited', index < reached);
        views.cards[index].classList.toggle('is-current', isCurrent);
        views.labels[index].classList.toggle('is-reached', isReached);
        views.labels[index].classList.toggle('is-current', isCurrent);
        var fill = isFinished || index < reached ? 1 : isCurrent ? currentFill : 0;
        setStepFill(index, fill);
      });
      var current = reached === -1 ? null : state.stops[reached];
      views.pulse.classList.toggle('is-hidden', current === null);
      if (current !== null) {
        var point = state.points[reached];
        var radius = current.isChapterStart ? CHAPTER_STOP_RADIUS : STOP_RADIUS;
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
      mapButton.setAttribute('aria-pressed', String(state.isMap));
      renderPlayButton();
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
      return state.isMap && state.reached === state.stops.length - 1;
    }

    function showCaption(mode) {
      var stop = mode === 'stop' ? state.stops[state.reached] : null;
      var key = stop === null ? mode : 'stop:' + stop.id;
      if (key === state.captionKey) return;
      state.captionKey = key;
      var texts = stop === null ? CAPTIONS[mode] : stop;
      var content = el('div', 'docs-tour__caption-content');
      var kicker = el('div', 'docs-tour__kicker', texts.chapter);
      var title = el('div', 'docs-tour__title', texts.title);
      var text = el('p', 'docs-tour__text', texts.text);
      content.append(kicker, title, text);
      var links = el('div', 'docs-tour__links');
      if (stop !== null) {
        content.style.setProperty('--tour-color', stop.color);
        if (stop.href !== null) {
          var readMore = linkOf('Read more', stop.href);
          links.appendChild(readMore);
        }
      } else if (mode === 'end') {
        var replay = el('button', 'docs-tour__link', 'Replay');
        replay.type = 'button';
        replay.addEventListener('click', restart);
        var installation = linkOf('Installation', '/installation/');
        var features = linkOf('All features', '/features/');
        var screensMap = linkOf('Screens Map', '/screens/');
        var docsGraph = linkOf('Docs Graph', '/graph/');
        links.append(replay, installation, features, screensMap, docsGraph);
      }
      if (links.childNodes.length > 0) content.appendChild(links);
      caption.replaceChildren(content);
    }

    function hideCaption() {
      state.captionKey = null;
      var content = caption.firstChild;
      if (content) content.classList.add('is-leaving');
    }

    function linkOf(text, href) {
      var link = el('a', 'docs-tour__link', text);
      var relativeHref = href.replace(/^\//, '');
      link.href = new URL(relativeHref, SITE_ROOT).href;
      if (link.hostname !== window.location.hostname) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      return link;
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
      else if (state.isMap) {
        if (state.reached === -1 || isFinishedNow()) restart();
        else jumpTo(state.reached);
      } else wake();
    }

    function advance() {
      if (state.reached >= state.stops.length - 1) startOutro();
      else startTravel(state.reached + 1);
    }

    function next() {
      if (state.phase === 'travel') finishTravel();
      else if (state.phase === 'fly') finishFly();
      else if (state.isMap) {
        if (state.reached < state.stops.length - 1) jumpTo(state.reached + 1);
      } else advance();
    }

    function prev() {
      var target = state.phase === 'travel' ? state.reached : state.reached - 1;
      if (target >= 0) jumpTo(target);
      else goToStart();
    }

    function setPlaying(isPlaying) {
      state.isPlaying = isPlaying;
      var countdown = state.holdCountdown;
      if (countdown !== null) {
        if (isPlaying) countdown.play();
        else countdown.pause();
      }
      renderPlayButton();
    }

    function restart() {
      setPlaying(true);
      goToStart();
    }

    function goToStart() {
      stopHoldCountdown();
      state.travel = null;
      state.isMap = false;
      state.reached = -1;
      renderReached();
      showCaption('start');
      flyTo(startCamera(), FLY_MS, function () {
        state.phase = 'start';
        if (state.isPlaying) advance();
      });
    }

    function jumpTo(index) {
      stopHoldCountdown();
      state.travel = null;
      state.isMap = false;
      state.reached = index;
      state.holdElapsed = 0;
      renderReached();
      showCaption('stop');
      loadImagesAround(index);
      var target = focusCamera(state.points[index]);
      flyTo(target, FLY_MS, function () {
        arrive(index);
      });
    }

    function toggleMap() {
      if (state.isMap) {
        if (state.reached === -1) goToStart();
        else jumpTo(state.reached);
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
      setPlaying(false);
      openMap('end');
    }

    function openMap(captionMode) {
      state.isMap = true;
      renderReached();
      showCaption(captionMode);
      for (var index = 0; index < state.stops.length; index++) loadImage(index);
      flyTo(overviewCamera(), OUTRO_MS, function () {
        state.phase = 'map';
      });
    }

    // -- the stop the tour is on, or heading to while the line draws
    function currentStopIndex() {
      return state.travel === null ? state.reached : state.travel.index;
    }

    function startTravel(index) {
      var length = state.lengths[index];
      var duration = clamp(length * TRAVEL_MS_PER_PX, TRAVEL_MIN_MS, TRAVEL_MAX_MS);
      state.travel = { index: index, length: length, duration: duration, elapsed: 0, from: state.camera, isRevealed: false };
      state.phase = 'travel';
      stopHoldCountdown();
      if (state.reached !== -1) setStepFill(state.reached, 1);
      views.segments[index].classList.remove('is-empty');
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
      views.labels[index - 1].classList.remove('is-current');
    }

    function travelProgress() {
      return Math.min(state.travel.elapsed / state.travel.duration, 1);
    }

    function drawTravel(progress) {
      var travel = state.travel;
      var lineProgress = easeInOut(progress);
      var drawn = travel.length * lineProgress;
      var segment = views.segments[travel.index];
      segment.style.strokeDashoffset = String(travel.length - drawn);
      var head = segment.getPointAtLength(drawn);
      var follow = focusCamera(head);
      var catchUpProgress = Math.min(progress / TRAVEL_CAMERA_CATCH_UP_SHARE, 1);
      var catchUp = easeInOut(catchUpProgress);
      state.camera = mixCameras(travel.from, follow, catchUp);
      applyCamera(state.camera);
    }

    function finishTravel() {
      var index = state.travel.index;
      drawTravel(1);
      state.travel = null;
      arrive(index);
    }

    function arrive(index) {
      var stop = state.stops[index];
      var readingMS = HOLD_BASE_MS + stop.text.length * HOLD_MS_PER_CHAR;
      state.reached = index;
      state.phase = 'hold';
      state.holdElapsed = 0;
      state.holdDuration = Math.min(readingMS, HOLD_MAX_MS);
      setMoving(false);
      renderReached();
      showCaption('stop');
      loadImagesAround(index);
      startHoldCountdown();
    }

    // -- the browser runs the countdown on its own, so holding on a stop takes no frames from the page
    function startHoldCountdown() {
      setStepFill(state.reached, 1);
      var fill = views.steps[state.reached].firstChild;
      var countdown = fill.animate(HOLD_FILL_KEYFRAMES, { duration: state.holdDuration, easing: 'linear' });
      if (!state.isPlaying) countdown.pause();
      countdown.onfinish = function () {
        if (state.holdCountdown !== countdown) return;
        state.holdCountdown = null;
        advance();
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
      state.fly = null;
      state.camera = fly.to;
      applyCamera(fly.to);
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
    }

    function focusCamera(point) {
      return { x: point.x, y: point.y - state.geometry.focusCenterAboveLine, scale: state.focusScale };
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
      return focusCamera(state.points[state.reached]);
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
      var image = views.cards[index].firstChild;
      if (image.hasAttribute('src')) return;
      var stop = state.stops[index];
      image.src = shotOf(stop);
    }

    function onThemeChange() {
      views.cards.forEach(function (card, index) {
        var image = card.firstChild;
        if (!image.hasAttribute('src')) return;
        var stop = state.stops[index];
        var shot = shotOf(stop);
        if (image.getAttribute('src') !== shot) image.src = shot;
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

    // -- stays on the same stop, or the closest one before it when this platform has no shot for it
    function rebuildRouteKeepingStop(oldStops, oldIndex) {
      stopHoldCountdown();
      if (state.frameId !== 0) cancelAnimationFrame(state.frameId);
      state.frameId = 0;
      state.travel = null;
      state.fly = null;
      setMoving(false);
      buildRoute();
      var reached = -1;
      for (var index = oldIndex; index >= 0 && reached === -1; index--) reached = indexOfStop(state.stops, oldStops[index].id);
      state.reached = reached;
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
        arrive(reached);
      }
      state.camera = restingCamera();
      applyCamera(state.camera);
    }

    function onResize() {
      measureStage();
      if (state.fly !== null) finishFly();
      if (state.travel !== null) {
        state.travel.from = restingCamera();
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

    function shotOf(stop) {
      var theme = themeOf();
      var variant = stop.themes[theme] || stop.themes.light || stop.themes.dark;
      return variant.shot;
    }
  }

  // -- the docs always set data-theme, a page embedding the tour without it follows the system scheme
  function themeOf() {
    var pageTheme = document.documentElement.getAttribute('data-theme');
    if (pageTheme === 'dark' || pageTheme === 'light') return pageTheme;
    return DARK_SCHEME.matches ? 'dark' : 'light';
  }

  // -- every chapter gets a row of its own, a chapter with no stop on this platform gets none
  function stopsOf(data, platform) {
    var stops = [];
    var row = -1;
    data.chapters.forEach(function (chapter, chapterIndex) {
      var color = 'var(--tour-color-' + chapter.color + ')';
      var isChapterStart = true;
      chapter.stops.forEach(function (stop) {
        var themes = stop.variants[platform];
        if (themes === undefined) return;
        if (isChapterStart) row++;
        stops.push({
          row: row,
          id: stop.id,
          title: stop.title,
          text: stop.text,
          href: stop.href,
          themes: themes,
          chapter: chapter.title,
          chapterIndex: chapterIndex,
          color: color,
          isChapterStart: isChapterStart,
        });
        isChapterStart = false;
      });
    });
    return stops;
  }

  // -- the turn down to the next row passes clear of the card at the row's end, the start icon clear of the first card
  function geometryOf(platform) {
    var card = platform === WIDE_PLATFORM ? WIDE_CARD : PHONE_CARD;
    var halfCard = card.width / 2;
    var aboveLine = card.maxHeight + CARD_GAP;
    var originX = -(halfCard + ORIGIN_CLEARANCE);
    return {
      card: card,
      stopGap: card.width + CARD_SPACING,
      aboveLine: aboveLine,
      rowHeight: aboveLine + BELOW_LINE + ROW_GAP,
      turnReach: halfCard + TURN_CLEARANCE,
      origin: { x: originX, y: 0, row: 0 },
      focusHeight: aboveLine + BELOW_LINE,
      focusCenterAboveLine: (aboveLine - BELOW_LINE) / 2,
    };
  }

  // -- rows run right then left, each one starting right under where the last one ended, so the line snakes down
  function layoutPoints(stops, geometry) {
    var points = [];
    var x = 0;
    stops.forEach(function (stop, index) {
      var direction = stop.row % 2 === 0 ? 1 : -1;
      var isSameRow = index > 0 && stops[index - 1].row === stop.row;
      if (isSameRow) x += direction * geometry.stopGap;
      points.push({ x: x, y: stop.row * geometry.rowHeight, row: stop.row });
    });
    return points;
  }

  function boundsOf(points, geometry) {
    var minX = 0;
    var maxX = 0;
    var lastRow = 0;
    points.forEach(function (point) {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      lastRow = point.row;
    });
    var originLeft = geometry.origin.x - ORIGIN_SIZE / 2;
    return {
      left: Math.min(originLeft, minX - geometry.turnReach),
      right: maxX + geometry.turnReach,
      top: -geometry.aboveLine,
      bottom: lastRow * geometry.rowHeight + BELOW_LINE,
    };
  }

  // -- straight along a row, or out past the row's end, down with rounded corners and back in
  function segmentPath(from, to, geometry) {
    if (from.row === to.row) return 'M' + from.x + ' ' + from.y + 'H' + to.x;
    var direction = from.row % 2 === 0 ? 1 : -1;
    var turnX = from.x + direction * geometry.turnReach;
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

  // -- held by its bottom just above the line, so its height can follow the shot's own ratio
  function cardPlacement(point, cardSpec) {
    var left = point.x - cardSpec.width / 2;
    var bottom = CARD_GAP - point.y;
    return 'left: ' + left + 'px; bottom: ' + bottom + 'px; width: ' + cardSpec.width + 'px; max-height: ' + cardSpec.maxHeight + 'px;';
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
