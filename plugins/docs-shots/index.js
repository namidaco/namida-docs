// by claude
// docmd plugin: places the app screenshots listed in screenshots.json at the end of their sections, as light/dark
// variants that follow the site theme, with android/desktop tabs when both exist. settings tiles the shots contain
// (tiles.json, recorded by the namida screenshots driver) become hotspots linking to the section with the same title,
// or the one `tileAliases` names, and every such tile is a preview for links to that section (docs-shots-previews.json).
// links to other sections or pages with shots preview their first shot. screens.json (which screen opens which)
// becomes the screens map data (docs-shots-screens.json, see screens.js), and tour.json's stops become the tour page
// data (embed/tour.json) with their shots and the docs section showing each, every tour link checked.
// embed/ (tour.js, tour.css, tour.json) is a public api that other sites load (namida.app), so its paths never change.
// the manifest's `base` names `{commit}`: package.json's `namida.screenshotsCommit`, where `latest` (the default) is
// namida-assets' main at build time, so links never sit behind jsdelivr's @main cache and need no manual bump.
// DOCS_SHOTS_BASE=<url> replaces the manifest's `base`, to preview shots that aren't published yet.
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { outputPathToPathname } from '@docmd/api';
import { buildScreensMap } from './screens.js';

export const plugin = {
  name: 'docs-shots',
  version: '1.2.0',
  capabilities: ['build', 'post-build', 'assets'],
};

const PLUGIN_DIR = path.dirname(fileURLToPath(import.meta.url));
const DOCS_REPO_DIR = path.resolve(PLUGIN_DIR, '..', '..');
const MANIFEST_PATH = path.join(DOCS_REPO_DIR, 'screenshots.json');
const TOUR_PATH = path.join(DOCS_REPO_DIR, 'tour.json');
const PACKAGE_PATH = path.join(DOCS_REPO_DIR, 'package.json');
const ASSETS_REMOTE = 'https://github.com/namidaco/namida-assets';
const LATEST_COMMIT = 'latest';
const FALLBACK_REF = 'main';
const LS_REMOTE_TIMEOUT_MS = 20000;
const COMMIT_SHA = /^[0-9a-f]{40}$/;
// -- a namida checkout next to this repo has the assets locally, otherwise the published files are fetched
const LOCAL_ASSETS_DIR = path.resolve(DOCS_REPO_DIR, '..', 'namida', 'external', 'namida-assets', 'screenshots', 'docs');
const PREVIEWS_FILE = 'docs-shots-previews.json';
const SCREENS_FILE = 'docs-shots-screens.json';
const TOUR_FILE = 'embed/tour.json';
const TOUR_WIDE_PLATFORM = 'wide';
const TOUR_LEVELS = ['simple', 'medium', 'advanced'];
const SIMPLE_LEVEL = 0;
const MEDIUM_LEVEL = 1;
const TOUR_WIDE_LABEL = 'Wide';
const WIDE_SHOTS_PLATFORM = 'windows';
const THEMES = ['light', 'dark'];
// -- a pitch black shot stands in for both themes when it is the only one
const FALLBACK_THEMES = ['light', 'dark', 'black'];
const WIDE_SHOT_PREFIX = 'wide_';
const PAGE_TOP = '';
const FENCE = /^\s*(```|~~~)/;
const SECTION_HEADING = /^#{2,6}\s+(.+?)\s*\{#([\w-]+)\}\s*$/;
// -- a heading joining two settings ("Refresh Library & Re-index") matches either tile too
const HEADING_PARTS_SEPARATOR = /\s+&\s+/;

let manifest = null;
let base = null;
let assetsRef = null;
// -- platform -> theme -> Set of ids, null when unknown and every variant is assumed to exist
let available = null;
// -- platform -> theme -> id -> { ratio, tiles: [{ title, x, y, w, h }] } in fractions of the shot
let tilesByShot = {};
// -- page url -> normalized title -> { anchor, title }
let headingsByPage = new Map();
let previews = {};
let screensMap = [];
let tour = { chapters: [], credits: [], waitingShots: [] };
const problems = [];
let figuresCount = 0;
let spotsCount = 0;

export async function onBeforeBuild({ pages, options }) {
  if (options.targetFiles && manifest !== null) return;
  problems.length = 0;
  figuresCount = 0;
  spotsCount = 0;
  manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf8'));
  assetsRef = process.env.DOCS_SHOTS_BASE ? 'DOCS_SHOTS_BASE' : await resolveAssetsRef();
  base = process.env.DOCS_SHOTS_BASE ?? manifest.base.replace('{commit}', assetsRef);
  available = toSets(await loadAssetJson('index.json'));
  tilesByShot = (await loadAssetJson('tiles.json')) ?? {};
  headingsByPage = new Map(pages.map((page) => [outputPathToPathname(page.outputPath), readHeadings(page.rawMarkdown)]));
  addTileAliases(manifest.tileAliases ?? {});
  previews = buildPreviews();
  const placements = findPlacements();
  screensMap = buildScreensMap((await loadAssetJson('screens.json')) ?? [], placements, screenVariantsOf);
  const tourSource = JSON.parse(await fs.readFile(TOUR_PATH, 'utf8'));
  tour = buildTour(tourSource, placements);
  if (available === null) return;
  for (const [pageUrl, sections] of Object.entries(manifest.pages)) {
    for (const [anchor, entry] of Object.entries(sections)) {
      for (const id of shotIdsOf(entry)) {
        if (!Object.keys(manifest.platforms).some((platform) => hasAnyTheme(platform, id))) {
          problems.push(`${pageUrl}#${anchor} ${id} (no such shot)`);
        }
      }
    }
  }
}

export function onBeforeRender(pageContext) {
  if (manifest === null) return;
  const pageUrl = outputPathToPathname(pageContext.outputPath);
  const sections = manifest.pages[pageUrl];
  if (sections === undefined) return;
  const headings = headingsByPage.get(pageUrl) ?? new Map();
  let html = pageContext.html;
  for (const [anchor, entry] of Object.entries(sections)) {
    const figure = renderFigure(entry, `${pageUrl}${anchor === PAGE_TOP ? '' : `#${anchor}`}`, headings);
    if (figure === '') continue;
    const at = findSectionEnd(html, anchor);
    if (at === -1) {
      problems.push(`${pageUrl}#${anchor} (no such section)`);
      continue;
    }
    html = html.slice(0, at) + figure + html.slice(at);
    figuresCount++;
  }
  pageContext.html = html;
}

export async function onPostBuild({ outputDir, log }) {
  if (manifest === null) return;
  await fs.writeFile(path.join(outputDir, PREVIEWS_FILE), JSON.stringify(previews));
  await fs.writeFile(path.join(outputDir, SCREENS_FILE), JSON.stringify({ platforms: manifest.platforms, nodes: screensMap }));
  const tourPlatforms = { ...manifest.platforms, [TOUR_WIDE_PLATFORM]: TOUR_WIDE_LABEL };
  const tourPath = path.join(outputDir, TOUR_FILE);
  const tourDirectory = path.dirname(tourPath);
  const tourJson = JSON.stringify({ platforms: tourPlatforms, chapters: tour.chapters, credits: tour.credits });
  await fs.mkdir(tourDirectory, { recursive: true });
  await fs.writeFile(tourPath, tourJson);
  for (const problem of problems) log(problem, 'WARN');
  const source = available === null ? 'no index, every variant assumed' : 'index found';
  const previewsCount = Object.keys(previews).length;
  const tourStopsCount = tour.chapters.reduce((count, chapter) => count + chapter.stops.length, 0);
  const summary = `${figuresCount} figures, ${spotsCount} hotspots, ${previewsCount} previews, ${screensMap.length} screens, ${tourStopsCount} tour stops`;
  log(`docs-shots: ${summary}, ${problems.length} problems (${source}, assets @${assetsRef})`);
  if (tour.waitingShots.length > 0) log(`docs-shots: tour waits for shots ${tour.waitingShots.join(', ')}`);
}

async function resolveAssetsRef() {
  const packageJson = JSON.parse(await fs.readFile(PACKAGE_PATH, 'utf8'));
  const wanted = packageJson.namida?.screenshotsCommit ?? LATEST_COMMIT;
  if (wanted !== LATEST_COMMIT) return wanted;
  const latest = await fetchLatestAssetsCommit();
  if (latest !== null) return latest;
  problems.push(`could not reach ${ASSETS_REMOTE}, shots link @${FALLBACK_REF}`);
  return FALLBACK_REF;
}

async function fetchLatestAssetsCommit() {
  try {
    const { stdout } = await promisify(execFile)('git', ['ls-remote', ASSETS_REMOTE, `refs/heads/${FALLBACK_REF}`], { timeout: LS_REMOTE_TIMEOUT_MS });
    const sha = stdout.split(/\s/)[0];
    return COMMIT_SHA.test(sha) ? sha : null;
  } catch {
    return null;
  }
}

export function getAssets() {
  return [
    { src: path.join(PLUGIN_DIR, 'client.js'), dest: 'assets/js/docs-shots.js', type: 'js', location: 'body' },
    { src: path.join(PLUGIN_DIR, 'client.css'), dest: 'assets/css/docs-shots.css', type: 'css', location: 'head' },
    { src: path.join(PLUGIN_DIR, 'screens-client.js'), dest: 'assets/js/docs-shots-screens.js', type: 'js', location: 'body' },
    { src: path.join(PLUGIN_DIR, 'tour-client.js'), dest: 'embed/tour.js', type: 'js', location: 'body' },
    { src: path.join(PLUGIN_DIR, 'tour.css'), dest: 'embed/tour.css', type: 'css', location: 'head' },
  ];
}

async function loadAssetJson(name) {
  const fromFile = await fs.readFile(path.join(LOCAL_ASSETS_DIR, name), 'utf8').catch(() => null);
  const text = fromFile ?? (await fetch(`${base}/${name}`).then((response) => (response.ok ? response.text() : null)).catch(() => null));
  return text === null ? null : JSON.parse(text);
}

function toSets(index) {
  if (index === null) return null;
  const sets = {};
  for (const [platform, themes] of Object.entries(index)) {
    sets[platform] = {};
    for (const [theme, ids] of Object.entries(themes)) sets[platform][theme] = new Set(ids);
  }
  return sets;
}

function readHeadings(markdown) {
  const headings = new Map();
  let inFence = false;
  for (const line of markdown.split('\n')) {
    if (FENCE.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const section = SECTION_HEADING.exec(line);
    if (section === null) continue;
    const [, rawTitle, anchor] = section;
    const title = rawTitle.replace(/`[^`]*`/g, '').trim();
    for (const variant of [title, ...title.split(HEADING_PARTS_SEPARATOR)]) {
      const key = normalizeTitle(variant);
      if (key !== '' && !headings.has(key)) headings.set(key, { anchor, title });
    }
  }
  return headings;
}

// -- a section listing several settings as bullets claims their tiles by title
function addTileAliases(aliasesByPage) {
  for (const [pageUrl, aliasesByAnchor] of Object.entries(aliasesByPage)) {
    const headings = headingsByPage.get(pageUrl);
    if (headings === undefined) {
      problems.push(`${pageUrl} (tileAliases for a missing page)`);
      continue;
    }
    for (const [anchor, tileTitles] of Object.entries(aliasesByAnchor)) {
      const heading = [...headings.values()].find((candidate) => candidate.anchor === anchor);
      if (heading === undefined) {
        problems.push(`${pageUrl}#${anchor} (tileAliases for a missing section)`);
        continue;
      }
      for (const tileTitle of tileTitles) headings.set(normalizeTitle(tileTitle), heading);
    }
  }
}

// -- docs headings use the in-app titles, case, punctuation and notes like "(Beta)" aside
function normalizeTitle(text) {
  return text
    .replace(/\s*\([^)]*\)/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '');
}

function shotIdsOf(entry) {
  return Array.isArray(entry) ? entry : entry.shots;
}

function has(platform, theme, id) {
  if (available === null) return true;
  return available[platform]?.[theme]?.has(id) ?? false;
}

function hasAnyTheme(platform, id) {
  return FALLBACK_THEMES.some((theme) => has(platform, theme, id));
}

// -- the theme each displayed theme's image comes from, a shot taken in one theme only shows in both
function sourceThemes(platform, id) {
  return THEMES.map((theme) => (has(platform, theme, id) ? theme : FALLBACK_THEMES.find((other) => has(platform, other, id))));
}

function shotUrl(platform, theme, id) {
  return `${base}/${platform}/${theme}/${id}.webp`;
}

function thumbUrl(platform, theme, id) {
  return `${base}/thumbs/${platform}/${theme}/${id}.webp`;
}

// -- platform -> displayed theme -> what to show, null when the shot exists nowhere
function variantsOf(id, toVariant) {
  const variants = {};
  for (const platform of Object.keys(manifest.platforms)) {
    if (!hasAnyTheme(platform, id)) continue;
    const themes = sourceThemes(platform, id);
    variants[platform] = {};
    THEMES.forEach((theme, index) => {
      variants[platform][theme] = toVariant(platform, themes[index]);
    });
  }
  return Object.keys(variants).length === 0 ? null : variants;
}

function screenVariantsOf(id) {
  return variantsOf(id, (platform, theme) => ({ shot: shotUrl(platform, theme, id), thumb: thumbUrl(platform, theme, id) }));
}

function shotPreviewOf(id) {
  const isWide = id.startsWith(WIDE_SHOT_PREFIX);
  return variantsOf(id, (platform, theme) => ({ src: shotUrl(platform, theme, id), isWide }));
}

// -- the first section showing each shot, in the manifest's order
function findPlacements() {
  const hrefById = new Map();
  for (const [pageUrl, sections] of Object.entries(manifest.pages)) {
    for (const [anchor, entry] of Object.entries(sections)) {
      const href = anchor === PAGE_TOP ? pageUrl : `${pageUrl}#${anchor}`;
      for (const id of shotIdsOf(entry)) {
        if (!hrefById.has(id)) hrefById.set(id, href);
      }
    }
  }
  return hrefById;
}

// -- a stop is a shot (with gesture `pins` per platform, and a `branch` of smaller stops after it) or a mosaic of
// -- `tiles`. ids are positions, so the same stop keeps its id on every platform. a `pendingShot` stop waits quietly
// -- until the next screenshots session publishes its shot. `level` is the first tour depth an item shows at: stops
// -- default to simple, branch stops, pins and credits to medium, tiles and credit items to their parent's, and nothing
// -- shows before its parent
function buildTour(source, placements) {
  const waitingShots = [];
  const levelOf = (item, fallbackLevel, parentLevel, owner) => {
    const levelId = item.level ?? TOUR_LEVELS[fallbackLevel];
    const level = TOUR_LEVELS.indexOf(levelId);
    if (level === -1) problems.push(`tour.json ${owner} level "${levelId}" (one of ${TOUR_LEVELS.join(' / ')})`);
    const ownLevel = level === -1 ? fallbackLevel : level;
    return Math.max(ownLevel, parentLevel);
  };
  const anchorsByPage = new Map();
  for (const [pageUrl, headings] of headingsByPage) {
    const anchors = new Set();
    for (const heading of headings.values()) anchors.add(heading.anchor);
    anchorsByPage.set(pageUrl, anchors);
  }
  const checkHref = (href, owner) => {
    if (href === null || !href.startsWith('/')) return href;
    const [pageUrl, anchor] = href.split('#');
    const anchors = anchorsByPage.get(pageUrl);
    if (anchors === undefined) problems.push(`tour.json ${owner} links ${href} (no such page)`);
    else if (anchor !== undefined && !anchors.has(anchor)) problems.push(`tour.json ${owner} links ${href} (no such section)`);
    return href;
  };
  const shotStopOf = (stop, id, level) => {
    if (stop.pendingShot === true) {
      const isPublished = available !== null && screenVariantsOf(stop.shot) !== null;
      if (!isPublished) {
        waitingShots.push(stop.shot);
        return null;
      }
      problems.push(`tour.json ${stop.shot} (shot is published, drop pendingShot)`);
    }
    const variants = tourVariantsOf(stop);
    if (variants === null) return null;
    const wantedHref = stop.href ?? placements.get(stop.shot) ?? null;
    const href = checkHref(wantedHref, stop.shot);
    const built = { id, title: stop.title, text: stop.text, href, level, variants };
    if (stop.pins !== undefined) built.pins = checkedPins(stop, level, checkHref, levelOf);
    return built;
  };
  const chapters = source.chapters.map((chapter, chapterIndex) => {
    const stops = [];
    for (const [stopIndex, stop] of chapter.stops.entries()) {
      const id = `${chapterIndex}.${stopIndex}`;
      const stopLevel = levelOf(stop, SIMPLE_LEVEL, SIMPLE_LEVEL, stop.title);
      if (stop.tiles !== undefined) {
        const tiles = [];
        for (const [tileIndex, tile] of stop.tiles.entries()) {
          const tileLevel = levelOf(tile, stopLevel, stopLevel, tile.title);
          const builtTile = shotStopOf(tile, `${id}.${tileIndex}`, tileLevel);
          if (builtTile !== null) tiles.push(builtTile);
        }
        if (tiles.length === 0) continue;
        const mosaicHref = checkHref(stop.href ?? null, stop.title);
        stops.push({ id, title: stop.title, text: stop.text, href: mosaicHref, level: stopLevel, tiles });
        continue;
      }
      const built = shotStopOf(stop, id, stopLevel);
      if (built === null) continue;
      stops.push(built);
      const branch = stop.branch ?? [];
      for (const [branchIndex, branchStop] of branch.entries()) {
        const inheritingBranchStop = { platforms: stop.platforms, ...branchStop };
        const branchLevel = levelOf(branchStop, MEDIUM_LEVEL, stopLevel, branchStop.title);
        const builtBranch = shotStopOf(inheritingBranchStop, `${id}.${branchIndex}`, branchLevel);
        if (builtBranch !== null) stops.push({ ...builtBranch, isBranch: true });
      }
    }
    return { title: chapter.title, color: chapter.color, stops };
  });
  const creditGroups = source.credits ?? [];
  const credits = creditGroups.map((group) => {
    const groupLevel = levelOf(group, MEDIUM_LEVEL, MEDIUM_LEVEL, `credits ${group.title}`);
    const items = group.items.map((item) => {
      const href = checkHref(item.href, `credits ${item.title}`);
      const itemLevel = levelOf(item, groupLevel, groupLevel, `credits ${item.title}`);
      return { title: item.title, href, level: itemLevel };
    });
    return { title: group.title, platforms: group.platforms ?? null, level: groupLevel, items };
  });
  return { chapters, credits, waitingShots };
}

function checkedPins(stop, stopLevel, checkHref, levelOf) {
  const pinsByPlatform = {};
  for (const [platform, pins] of Object.entries(stop.pins)) {
    pinsByPlatform[platform] = pins.map((pin) => {
      const isInside = pin.x >= 0 && pin.x <= 1 && pin.y >= 0 && pin.y <= 1;
      if (!isInside) problems.push(`tour.json ${stop.shot} ${platform} pin "${pin.title}" (x/y must be fractions of the shot)`);
      if (pin.href !== undefined) checkHref(pin.href, `${stop.shot} pin "${pin.title}"`);
      const pinLevel = levelOf(pin, MEDIUM_LEVEL, stopLevel, `${stop.shot} pin "${pin.title}"`);
      return { ...pin, level: pinLevel };
    });
  }
  return pinsByPlatform;
}

// -- a platform without its own shot borrows another one's, unless the stop's `platforms` leaves it out (a desktop
// -- only feature). only stops with a `wide` shot are in the Wide view
function tourVariantsOf(stop) {
  const ownVariants = screenVariantsOf(stop.shot);
  if (ownVariants === null) {
    problems.push(`tour.json ${stop.shot} (no such shot)`);
    return null;
  }
  const borrowedVariant = Object.values(ownVariants)[0];
  const platforms = stop.platforms ?? Object.keys(manifest.platforms);
  const variants = {};
  for (const platform of platforms) variants[platform] = ownVariants[platform] ?? borrowedVariant;
  if (stop.wide === undefined) return variants;
  const wideVariants = screenVariantsOf(stop.wide);
  if (wideVariants === null) problems.push(`tour.json ${stop.wide} (no such shot)`);
  else variants[TOUR_WIDE_PLATFORM] = wideVariants[WIDE_SHOTS_PLATFORM];
  return variants;
}

function tilesOf(platform, theme, id) {
  return tilesByShot[platform]?.[theme]?.[id] ?? null;
}

function matchTiles(shotTiles, headings) {
  if (shotTiles === null) return [];
  const matched = [];
  for (const tile of shotTiles.tiles) {
    const heading = headings.get(normalizeTitle(tile.title));
    if (heading !== undefined) matched.push({ tile, heading });
  }
  return matched;
}

function buildPreviews() {
  const built = {};
  for (const [pageUrl, sections] of Object.entries(manifest.pages)) {
    const headings = headingsByPage.get(pageUrl);
    if (headings === undefined) continue;
    for (const entry of Object.values(sections)) {
      for (const id of shotIdsOf(entry)) {
        for (const platform of Object.keys(manifest.platforms)) {
          const themes = sourceThemes(platform, id);
          THEMES.forEach((theme, index) => {
            const sourceTheme = themes[index];
            if (sourceTheme === undefined) return;
            const shotTiles = tilesOf(platform, sourceTheme, id);
            for (const { tile, heading } of matchTiles(shotTiles, headings)) {
              const variants = (built[`${pageUrl}#${heading.anchor}`] ??= {});
              const themesOfPlatform = (variants[platform] ??= {});
              themesOfPlatform[theme] ??= { src: shotUrl(platform, sourceTheme, id), ratio: shotTiles.ratio, x: tile.x, y: tile.y, w: tile.w, h: tile.h };
            }
          });
        }
      }
    }
  }
  // -- a section without a matching tile shows its first shot, a page link the page's first one
  for (const [pageUrl, sections] of Object.entries(manifest.pages)) {
    for (const [anchor, entry] of Object.entries(sections)) {
      const key = anchor === PAGE_TOP ? pageUrl : `${pageUrl}#${anchor}`;
      const preview = shotPreviewOf(shotIdsOf(entry)[0]);
      if (preview === null) continue;
      built[key] ??= preview;
      built[pageUrl] ??= preview;
    }
  }
  return built;
}

function renderFigure(entry, onlineHref, headings) {
  const ids = shotIdsOf(entry);
  const collapsedLabel = Array.isArray(entry) ? null : entry.collapsed ?? null;
  const platforms = Object.keys(manifest.platforms).filter((platform) => ids.some((id) => hasAnyTheme(platform, id)));
  if (platforms.length === 0) return '';
  const rows = platforms.map((platform) => {
    const shots = ids.filter((id) => hasAnyTheme(platform, id)).map((id) => renderShot(platform, id, headings)).join('');
    return `<div class="docs-shots__row" data-platform="${platform}">${shots}</div>`;
  });
  const tabs = platforms.length < 2 ? '' : `<div class="docs-shots__tabs" role="tablist">${platforms.map(renderTab).join('')}</div>`;
  const inner = tabs + rows.join('');
  if (collapsedLabel !== null) {
    return `<details class="docs-shots docs-shots--collapsed" data-href="${onlineHref}"><summary>${escapeHtml(collapsedLabel)}</summary>${inner}</details>`;
  }
  return `<figure class="docs-shots" data-href="${onlineHref}">${inner}</figure>`;
}

function renderTab(platform) {
  return `<button type="button" class="docs-shots__tab" role="tab" data-platform="${platform}">${escapeHtml(manifest.platforms[platform])}</button>`;
}

function renderShot(platform, id, headings) {
  const themes = sourceThemes(platform, id);
  const alt = escapeHtml(id.replaceAll('_', ' '));
  const images = THEMES.map((theme, index) => {
    return `<img class="docs-shot__${theme}" src="${shotUrl(platform, themes[index], id)}" alt="${alt}" loading="lazy" decoding="async">`;
  });
  // -- both themes share one layout, so the first theme's tiles place the spots. bigger ones first, a group's own
  // -- tiles then sit on top of it
  const spots = matchTiles(tilesOf(platform, themes[0], id), headings)
    .sort((a, b) => b.tile.w * b.tile.h - a.tile.w * a.tile.h)
    .map(({ tile, heading }) => renderSpot(tile, heading));
  spotsCount += spots.length;
  const wideClass = id.startsWith(WIDE_SHOT_PREFIX) ? ' docs-shot--wide' : '';
  return `<span class="docs-shot${wideClass}">${images.join('')}${spots.join('')}</span>`;
}

function renderSpot(tile, heading) {
  const percent = (fraction) => `${(fraction * 100).toFixed(3)}%`;
  const style = `left: ${percent(tile.x)}; top: ${percent(tile.y)}; width: ${percent(tile.w)}; height: ${percent(tile.h)};`;
  const title = escapeHtml(heading.title);
  return `<a class="docs-shot__spot" href="#${heading.anchor}" data-anchor="${heading.anchor}" style="${style}" title="${title}" aria-label="${title}"></a>`;
}

// -- right before the next heading of the same or a higher level, a divider or the page connections box
function findSectionEnd(html, anchor) {
  let searchFrom = 0;
  if (anchor !== PAGE_TOP) {
    const heading = new RegExp(`<h[1-6]\\b[^>]*\\bid="${anchor}"[^>]*>`).exec(html);
    if (heading === null) return -1;
    searchFrom = heading.index + heading[0].length;
  } else {
    const title = /<h1\b[^>]*>[\s\S]*?<\/h1>/.exec(html);
    if (title === null) return 0;
    searchFrom = title.index + title[0].length;
  }
  // -- before the next heading of any level, so a parent's shots stay above its subsections
  const rest = html.slice(searchFrom);
  const end = /<h[1-6][\s>]|<hr\b|<section class="docs-graph-local"/.exec(rest);
  return end === null ? html.length : searchFrom + end.index;
}

function escapeHtml(text) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}
