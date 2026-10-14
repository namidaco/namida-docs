// by claude
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootUrl = new URL('..', import.meta.url);
const root = fileURLToPath(rootUrl);
const docsDir = join(root, 'docs');
const outPath = join(docsDir, 'whats-new.md');

const markerRegex = /`🆕 (v\d+\.\d+\.\d+)`/g;
const headingRegex = /^(#{1,6})\s+(.+?)\s*$/;
const headingIdRegex = /\s*\{#([\w-]+)\}/;
const chipsOnlyRegex = /^(`[^`]+`\s*)+$/;
const fenceRegex = /^(```|~~~)/;
const versionHeadingRegex = /^## (?:\S+ )?(v\d+\.\d+\.\d+)\b/;
const generatedStart = '<!-- generated -->';
const generatedEnd = '<!-- /generated -->';
const divider = '---';
const ungroupedTitle = 'More';
const ungroupedNavEntry = { order: Infinity, group: ungroupedTitle };
const groupEmojis = { Features: '🎉', Pages: '📄', Settings: '⚙️', Guides: '📒', [ungroupedTitle]: '📌' };

const defaultHead = `---
title: "What's New"
description: "New and changed things in each version"
---

# What's New

What each version added or changed, linked to where these docs explain it. Newest first, 🆕 marks new sections and 🔄 updated ones.

::: callout info
**Looking for every change?** This page only follows the docs. The full changelog of each version (fixes and improvements included) is on GitHub. [\`📜 Stable Releases ↗\`](https://github.com/namidaco/namida/releases) [\`🧪 Beta Releases ↗\`](https://github.com/namidaco/namida-snapshots/releases)
:::
`;
const defaultFooter = `---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
`;

const nav = readNav();
const versions = new Map();

for (const file of listMarkdownFiles(docsDir)) {
  if (file !== outPath) collectMarkers(file);
}

const existingText = existsSync(outPath) ? readFileSync(outPath, 'utf8') : null;
const { head, notes, footer } = readExisting(existingText);
const output = buildPage(head, notes, footer);
const didChange = output !== existingText;
if (didChange) writeFileSync(outPath, output);
console.log(`whats-new: ${versions.size} versions${didChange ? ', updated' : ', no changes'}`);

function collectMarkers(file) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  const url = pageUrl(file);
  const title = readTitle(lines);
  const navEntry = nav.get(url) ?? ungroupedNavEntry;
  const page = { title, url, ...navEntry };
  const headingStack = [];
  let isInFence = false;
  let hasOnlyChipsSinceHeading = false;

  for (const line of lines) {
    if (fenceRegex.test(line)) isInFence = !isInFence;
    if (isInFence) continue;

    const headingMatch = headingRegex.exec(line);
    const isHeading = headingMatch != null;
    if (isHeading) {
      const level = headingMatch[1].length;
      const headingText = headingMatch[2];
      while (headingStack.length > 0 && headingStack.at(-1).level >= level) headingStack.pop();
      const id = headingIdRegex.exec(headingText)?.[1];
      const headingTitle = cleanTitle(headingText);
      headingStack.push({ level, id, title: headingTitle, newIn: new Set() });
      hasOnlyChipsSinceHeading = true;
    }

    const trimmedLine = line.trim();
    const isChipsOnly = !isHeading && chipsOnlyRegex.test(trimmedLine);
    const isNew = isHeading || (isChipsOnly && hasOnlyChipsSinceHeading);
    for (const [, version] of line.matchAll(markerRegex)) {
      addMarker(page, headingStack, version, isNew);
    }
    if (!isHeading && trimmedLine !== '' && !isChipsOnly) hasOnlyChipsSinceHeading = false;
  }
}

function addMarker(page, headingStack, version, isNewPre) {
  let owner = headingStack.at(-1);
  if (owner == null) return;
  const isNew = isNewPre && (owner.id != null || owner.level === 1);
  if (!isNew) owner = headingStack.findLast((h) => h.id != null || h.level === 1);
  const isInsideNewSection = headingStack.some((h) => h !== owner && h.newIn.has(version));
  if (isInsideNewSection) return;
  if (isNew) owner.newIn.add(version);

  let pages = versions.get(version);
  if (pages == null) {
    pages = new Map();
    versions.set(version, pages);
  }
  let entry = pages.get(page.url);
  if (entry == null) {
    entry = { page, isNew: false, sections: new Map() };
    pages.set(page.url, entry);
  }

  if (owner.level === 1) {
    if (isNew) entry.isNew = true;
    return;
  }
  const section = entry.sections.get(owner.id);
  if (section == null) entry.sections.set(owner.id, { title: owner.title, isNew });
  else if (isNew) section.isNew = true;
}

function buildPage(head, notes, footer) {
  const allVersions = new Set([...versions.keys(), ...notes.keys()]);
  const blocks = [...allVersions].sort(compareVersionsDesc).map((version) => {
    const anchor = version.replaceAll('.', '-');
    const parts = [`## 🏷️ ${version} {#${anchor}}`];
    const note = notes.get(version);
    if (note) parts.push(note);
    const pages = versions.get(version);
    if (pages != null) {
      const versionList = buildVersionList(pages);
      parts.push(`${generatedStart}\n${versionList}\n${generatedEnd}`);
    }
    return parts.join('\n\n');
  });
  const headText = head.trimEnd();
  const blocksText = blocks.join(`\n\n${divider}\n\n`);
  const footerText = footer.trimStart();
  return `${headText}\n\n${blocksText}\n\n${footerText}`;
}

function buildVersionList(pages) {
  const entries = [...pages.values()].sort((a, b) => comparePages(a.page, b.page));
  const newPagesLinks = entries.filter((e) => e.isNew).map((e) => link(e.page.title, e.page.url));
  let newSectionsCount = 0;
  let updatedSectionsCount = 0;
  const groups = new Map();
  for (const entry of entries) {
    if (entry.isNew) continue;
    for (const section of entry.sections.values()) {
      if (section.isNew) newSectionsCount++;
      else updatedSectionsCount++;
    }
    const group = groups.get(entry.page.group);
    if (group == null) groups.set(entry.page.group, [entry]);
    else group.push(entry);
  }

  const parts = [];
  const statsChips = [];
  if (newPagesLinks.length > 0) statsChips.push(chip('✨', newPagesLinks.length, 'new page'));
  if (newSectionsCount > 0) statsChips.push(chip('🆕', newSectionsCount, 'new section'));
  if (updatedSectionsCount > 0) statsChips.push(chip('🔄', updatedSectionsCount, 'updated section'));
  if (statsChips.length > 0) parts.push(statsChips.join(' '));
  if (newPagesLinks.length > 0) {
    const label = newPagesLinks.length === 1 ? 'New page' : 'New pages';
    parts.push(`::: callout tip\n✨ ${label}: ${newPagesLinks.join(', ')}\n:::`);
  }
  for (const [groupTitle, groupEntries] of groups) {
    const emoji = groupEmojis[groupTitle];
    const label = emoji == null ? groupTitle : `${emoji} ${groupTitle}`;
    const groupLines = groupEntries.map(buildPageLine).join('\n');
    parts.push(`**${label}**`, groupLines);
  }
  return parts.join('\n\n');
}

function buildPageLine({ page, sections }) {
  const added = [];
  const changed = [];
  for (const [id, section] of sections) {
    const sectionUrl = `${page.url}#${id}`;
    const sectionLink = link(section.title, sectionUrl);
    if (section.isNew) added.push(sectionLink);
    else changed.push(sectionLink);
  }
  const details = [];
  if (added.length > 0) details.push(`🆕 ${added.join(', ')}`);
  if (changed.length > 0) details.push(`🔄 ${changed.join(', ')}`);
  const pageLink = link(page.title, page.url);
  if (details.length === 0) return `- ${pageLink}`;
  const detailsText = details.join(' · ');
  return `- ${pageLink}: ${detailsText}`;
}

function chip(emoji, count, noun) {
  const countText = count === 1 ? `${count} ${noun}` : `${count} ${noun}s`;
  return `\`${emoji} ${countText}\``;
}

function readExisting(text) {
  const notes = new Map();
  if (text == null) return { head: defaultHead, notes, footer: defaultFooter };

  const lines = text.split(/\r?\n/);
  const frontmatterEnd = lines[0] === '---' ? lines.indexOf('---', 1) : -1;
  const firstVersion = lines.findIndex((l) => versionHeadingRegex.test(l));
  const lastVersion = lines.findLastIndex((l) => versionHeadingRegex.test(l));
  const footerStart = lines.lastIndexOf(divider);
  const hasFooter = footerStart > frontmatterEnd && footerStart > lastVersion;
  const bodyEnd = hasFooter ? footerStart : lines.length;
  const headEnd = firstVersion === -1 ? bodyEnd : firstVersion;

  let version;
  let noteLines = [];
  let isInGenerated = false;
  const flushNote = () => {
    const note = noteLines.join('\n').trim();
    if (version != null && note !== '') notes.set(version, note);
  };
  for (const line of lines.slice(headEnd, bodyEnd)) {
    const versionMatch = versionHeadingRegex.exec(line);
    if (versionMatch != null) {
      flushNote();
      version = versionMatch[1];
      noteLines = [];
    } else if (line === generatedStart) isInGenerated = true;
    else if (line === generatedEnd) isInGenerated = false;
    else if (!isInGenerated && line !== divider) noteLines.push(line);
  }
  flushNote();

  const head = lines.slice(0, headEnd).join('\n');
  const footer = hasFooter ? lines.slice(bodyEnd).join('\n') : defaultFooter;
  return { head, notes, footer };
}

function readNav() {
  const configPath = join(root, 'docmd.config.json');
  const configText = readFileSync(configPath, 'utf8');
  const config = JSON.parse(configText);
  const result = new Map();
  for (const item of config.navigation) {
    if (item.external) continue;
    const group = item.children ? item.title : ungroupedTitle;
    const itemPath = normalizeNavPath(item.path);
    result.set(itemPath, { order: result.size, group });
    for (const child of item.children ?? []) {
      if (child.external) continue;
      const childPath = normalizeNavPath(child.path);
      result.set(childPath, { order: result.size, group });
    }
  }
  return result;
}

function normalizeNavPath(path) {
  const clean = path.replace(/(^|\/)index\.md$|\.md$/, '$1');
  return clean.endsWith('/') ? clean : `${clean}/`;
}

function comparePages(a, b) {
  const groupA = a.group === ungroupedTitle ? 1 : 0;
  const groupB = b.group === ungroupedTitle ? 1 : 0;
  if (groupA !== groupB) return groupA - groupB;
  return a.order !== b.order ? a.order - b.order : a.url.localeCompare(b.url);
}

function compareVersionsDesc(a, b) {
  const partsA = a.slice(1).split('.').map(Number);
  const partsB = b.slice(1).split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if (partsA[i] !== partsB[i]) return partsB[i] - partsA[i];
  }
  return 0;
}

function listMarkdownFiles(dir) {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => join(e.parentPath, e.name));
}

function pageUrl(file) {
  const relativePath = relative(docsDir, file).replaceAll('\\', '/');
  const path = relativePath.replace(/\/?index\.md$|\.md$/, '');
  return path === '' ? '/' : `/${path}/`;
}

function readTitle(lines) {
  const titleLine = lines.find((l) => l.startsWith('title:'));
  if (titleLine == null) return '';
  const rawTitle = titleLine.slice('title:'.length).trim();
  return rawTitle.replace(/^"(.*)"$/, '$1');
}

function cleanTitle(text) {
  return text
    .replace(headingIdRegex, '')
    .replace(/`[^`]*`/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .trim();
}

function link(text, url) {
  const escapedText = text.replace(/[[\]]/g, '\\$&');
  return `[${escapedText}](${url})`;
}
