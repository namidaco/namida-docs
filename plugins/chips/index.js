// by claude
// docmd plugin: renders the docs' meta chips. the markdown keeps the chip text, so search, llms and the source stay readable.
// - availability (`💻 Android+iOS only`): a fixed strip of every platform icon, the supported ones lit, with version
//   limits next to their icon (`💻 iOS 17+ only`) and the wording on hover.
// - upgrade (`⬆️ iOS 16.2+`): marks a line that needs a newer system version.
// - version (`🆕 v8.5.0`): a `NEW` tag for the last releases and `SINCE` for older ones, linking to What's New.
// - update (`🔄 v8.6.0`): an `UPDATED` tag, muted for older releases, linking to What's New.
//   a topbar button (client.js) hides both kinds, a line holding only tags gets `version-tag-line` so it hides too.
// - brand link (``[`AUR`](url)``, ``[`Telegram: Chat group`](url)``): a "get it on" store badge or a social card, like the
//   namida README. the text after `: ` is the card's subtitle, a ` Beta` suffix adds the README's beta pill to a badge.
import { outputPathToPathname } from '@docmd/api';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const plugin = {
  name: 'chips',
  version: '1.4.0',
  capabilities: ['build', 'post-build', 'assets'],
};

const PLUGIN_DIR = path.dirname(fileURLToPath(import.meta.url));
// -- a `+` before a name joins platforms, otherwise it ends a version (`Android 12+`)
const ENTRY_SEPARATOR = /\+(?=[A-Za-z])/;
const ENTRY = /^(\S+)(?:\s+(.+))?$/;
// -- markdown escapes `<=`
const AT_MOST = /^&lt;=\s*/;
const AT_MOST_SIGN = '≤';
const VERSION_MARKER = /`(?:🆕|🔄) (v\d+\.\d+\.\d+)`/g;
const NEW_RELEASES_COUNT = 2;
const WHATS_NEW_URL = '/whats-new/';
const GROUPS = [
  {
    name: 'Mobile',
    platforms: [
      { id: 'android', name: 'Android' },
      { id: 'ios', name: 'iOS' },
    ],
  },
  {
    name: 'Desktop',
    platforms: [
      { id: 'windows', name: 'Windows' },
      { id: 'linux', name: 'Linux' },
      { id: 'macos', name: 'macOS' },
    ],
  },
];
const PLATFORMS = GROUPS.flatMap((group) => group.platforms);
const PLATFORM_BY_NAME = new Map(PLATFORMS.map((platform) => [platform.name, platform]));
const CHIP_KINDS = [
  { start: '<code>💻 ', regex: /<code>💻 ([^<]+?) only<\/code>/g, replace: replaceStripChip },
  { start: '<code>⬆', regex: /<code>⬆️? ([^<]+?)<\/code>/g, replace: replaceUpgradeChip },
  { start: '<code>🆕 v', regex: /<code>🆕 (v\d+\.\d+\.\d+)<\/code>/g, replace: replaceVersionChip },
  { start: '<code>🔄 v', regex: /<code>🔄 (v\d+\.\d+\.\d+)<\/code>/g, replace: replaceUpdateChip },
];
const VERSION_TAG_LINE = /<p>((?:<a class="version-tag[^>]*>(?:<span [^>]*>[^<]*<\/span>)+<\/a>\s*)+)<\/p>/g;
const VERSION_TAG_LINE_START = '<p><a class="version-tag';
const BRAND_LINK = /<a href="([^"]+)"><code>([^<:]+?)(?:: ([^<]+))?<\/code><\/a>/g;
const BRAND_LINK_START = '"><code>';
const BETA_SUFFIX = ' Beta';
const BRAND_BY_NAME = new Map([
  ['GitHub', { id: 'github', isStore: true }],
  ['Obtainium', { id: 'obtainium', isStore: true }],
  ['winget', { id: 'winget', isStore: true }],
  ['AUR', { id: 'aur', isStore: true }],
  ['AltStore', { id: 'altstore', isStore: true }],
  ['Telegram', { id: 'telegram', isStore: false }],
  ['Discord', { id: 'discord', isStore: false }],
]);

const problems = [];
let newVersions = new Set();
let stripsCount = 0;
let upgradesCount = 0;
let versionsCount = 0;
let updatesCount = 0;
let brandLinksCount = 0;

// -- incremental dev rebuilds only pass the changed pages, the last full set stays in use
export function onBeforeBuild({ pages, options }) {
  if (options.targetFiles) return;
  const versions = new Set();
  for (const page of pages) {
    for (const [, version] of page.rawMarkdown.matchAll(VERSION_MARKER)) versions.add(version);
  }
  const newestVersions = [...versions].sort(compareVersionsDesc).slice(0, NEW_RELEASES_COUNT);
  newVersions = new Set(newestVersions);
}

export function onBeforeRender(pageContext) {
  let html = pageContext.html;
  let pageUrl = null;
  for (const kind of CHIP_KINDS) {
    if (!html.includes(kind.start)) continue;
    pageUrl ??= outputPathToPathname(pageContext.outputPath);
    html = html.replace(kind.regex, (chip, spec) => kind.replace(chip, spec, pageUrl));
  }
  if (html.includes(VERSION_TAG_LINE_START)) html = html.replace(VERSION_TAG_LINE, '<p class="version-tag-line">$1</p>');
  if (html.includes(BRAND_LINK_START)) html = html.replace(BRAND_LINK, replaceBrandLink);
  pageContext.html = html;
}

export function onPostBuild({ log }) {
  for (const problem of problems) log(problem, 'WARN');
  const newVersionsText = [...newVersions].join(' & ');
  log(
    `chips: ${stripsCount} strips, ${upgradesCount} upgrades, ${versionsCount} versions (${newVersionsText} new), ${updatesCount} updates, ${brandLinksCount} brand links, ${problems.length} problems`,
  );
  problems.length = 0;
  stripsCount = 0;
  upgradesCount = 0;
  versionsCount = 0;
  updatesCount = 0;
  brandLinksCount = 0;
}

export function getAssets() {
  return [
    { src: path.join(PLUGIN_DIR, 'client.js'), dest: 'assets/js/chips.js', type: 'js', location: 'head' },
    { src: path.join(PLUGIN_DIR, 'client.css'), dest: 'assets/css/chips.css', type: 'css', location: 'head' },
  ];
}

function replaceStripChip(chip, spec, pageUrl) {
  const versionById = parseVersionById(spec);
  if (versionById === null) {
    problems.push(`${pageUrl}: unknown platform in "${spec}"`);
    return chip;
  }
  stripsCount++;
  return renderStrip(versionById);
}

function replaceUpgradeChip(chip, spec, pageUrl) {
  const entry = parseEntry(spec);
  if (entry === null || entry.version === '') {
    problems.push(`${pageUrl}: "${spec}" needs one platform and its version`);
    return chip;
  }
  upgradesCount++;
  return renderUpgrade(entry.platform, entry.version);
}

function replaceVersionChip(chip, version) {
  versionsCount++;
  const isNew = newVersions.has(version);
  const label = isNew ? 'NEW' : 'SINCE';
  const modifier = isNew ? '' : ' version-tag--old';
  return renderVersionTag(version, label, modifier);
}

function replaceUpdateChip(chip, version) {
  updatesCount++;
  const isRecent = newVersions.has(version);
  const modifier = isRecent ? ' version-tag--updated' : ' version-tag--old';
  return renderVersionTag(version, 'UPDATED', modifier);
}

function replaceBrandLink(link, url, label, subtitle) {
  const isBeta = label.endsWith(BETA_SUFFIX);
  const name = isBeta ? label.slice(0, -BETA_SUFFIX.length) : label;
  const brand = BRAND_BY_NAME.get(name);
  if (brand === undefined || (isBeta && !brand.isStore)) return link;
  brandLinksCount++;
  if (brand.isStore) return renderStoreBadge(brand, name, isBeta, url);
  return renderBrandCard(brand, name, subtitle, url);
}

function parseVersionById(spec) {
  const versionById = new Map();
  for (const text of spec.split(ENTRY_SEPARATOR)) {
    const entry = parseEntry(text);
    if (entry === null) return null;
    versionById.set(entry.platform.id, entry.version);
  }
  return versionById;
}

function parseEntry(text) {
  const match = ENTRY.exec(text.trim());
  if (match === null) return null;
  const platform = PLATFORM_BY_NAME.get(match[1]);
  if (platform === undefined) return null;
  const versionPre = match[2] ?? '';
  const version = versionPre.replace(AT_MOST, AT_MOST_SIGN);
  return { platform, version };
}

function compareVersionsDesc(a, b) {
  const partsA = a.slice(1).split('.');
  const partsB = b.slice(1).split('.');
  for (let i = 0; i < partsA.length; i++) {
    const diff = Number(partsB[i]) - Number(partsA[i]);
    if (diff !== 0) return diff;
  }
  return 0;
}

function renderStrip(versionById) {
  const label = describe(versionById);
  const groups = GROUPS.map((group) => renderGroup(group, versionById));
  const strip = groups.join('<span class="platforms__divider"></span>');
  return renderPlatformsChip(label, strip);
}

function renderUpgrade(platform, version) {
  const label = `Needs ${platform.name} ${version}`;
  const icon = renderIcon(platform, version);
  return renderPlatformsChip(label, `<span class="platforms__upgrade"></span>${icon}`);
}

function renderPlatformsChip(label, content) {
  return `<span class="platforms" role="img" tabindex="0" aria-label="${label}" data-tip="${label}">${content}</span>`;
}

function renderGroup(group, versionById) {
  const icons = group.platforms.map((platform) => renderIcon(platform, versionById.get(platform.id)));
  return icons.join('');
}

function renderIcon(platform, version) {
  if (version === undefined) return `<span class="platforms__icon platforms__icon--${platform.id}"></span>`;
  const versionHtml = version === '' ? '' : `<span class="platforms__version">${version}</span>`;
  return `<span class="platforms__icon platforms__icon--${platform.id} platforms__icon--on"></span>${versionHtml}`;
}

function renderVersionTag(version, label, modifier) {
  const anchor = version.replaceAll('.', '-');
  return `<a class="version-tag${modifier}" href="${WHATS_NEW_URL}#${anchor}"><span class="version-tag__label">${label}</span><span class="version-tag__version">${version}</span></a>`;
}

function renderStoreBadge(brand, name, isBeta, url) {
  const betaHtml = isBeta ? '<span class="store-badge__beta">Beta</span>' : '';
  const text = `<span class="store-badge__caption">Get it on${betaHtml}</span><span class="store-badge__name">${name}</span>`;
  return `<a class="store-badge brand--${brand.id}" href="${url}">${renderBrandTile()}<span class="store-badge__text">${text}</span></a>`;
}

function renderBrandCard(brand, name, subtitle, url) {
  const subtitleHtml = subtitle === undefined ? '' : `<span class="brand-card__subtitle">${subtitle}</span>`;
  const text = `<span class="brand-card__title">${name}</span>${subtitleHtml}`;
  return `<a class="brand-card brand--${brand.id}" href="${url}">${renderBrandTile()}<span class="brand-card__text">${text}</span><span class="brand-card__arrow"></span></a>`;
}

function renderBrandTile() {
  return '<span class="brand-tile"><span class="brand-tile__icon"></span></span>';
}

function describe(versionById) {
  const supported = [];
  const missing = [];
  let hasVersion = false;
  for (const platform of PLATFORMS) {
    const version = versionById.get(platform.id);
    if (version === undefined) {
      missing.push(platform.name);
      continue;
    }
    supported.push(version === '' ? platform.name : `${platform.name} ${version}`);
    if (version !== '') hasVersion = true;
  }
  if (!hasVersion) {
    for (const group of GROUPS) {
      const isWholeGroup = group.platforms.length === versionById.size && group.platforms.every((platform) => versionById.has(platform.id));
      if (isWholeGroup) return `${group.name} only`;
    }
    if (missing.length < supported.length) return `Not on ${joinNames(missing)}`;
  }
  return `${joinNames(supported)} only`;
}

function joinNames(names) {
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`;
}
