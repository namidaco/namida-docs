// by claude
// docmd plugin: places the app screenshots listed in screenshots.json at the end of their sections, as light/dark
// variants that follow the site theme, with android/desktop tabs when both exist. settings tiles the shots contain
// (tiles.json, recorded by the namida screenshots driver) become hotspots linking to the section with the same title,
// or the one `tileAliases` names, and every such tile is a preview for links to that section (docs-shots-previews.json).
// links to other sections or pages with shots preview their first shot. screens.json (which screen opens which)
// becomes the screens map data (docs-shots-screens.json, see screens.js).
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
  screensMap = buildScreensMap((await loadAssetJson('screens.json')) ?? [], findPlacements(), screenVariantsOf);
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
  for (const problem of problems) log(problem, 'WARN');
  const source = available === null ? 'no index, every variant assumed' : 'index found';
  const previewsCount = Object.keys(previews).length;
  const summary = `${figuresCount} figures, ${spotsCount} hotspots, ${previewsCount} previews, ${screensMap.length} screens`;
  log(`docs-shots: ${summary}, ${problems.length} problems (${source}, assets @${assetsRef})`);
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
