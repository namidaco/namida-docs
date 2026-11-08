// by claude
// docmd plugin: a page with `collapsible: <noun>` in its frontmatter (`questions`, `guides`) shows every H3 section as a
// collapsible card, under a bar with the count and an expand all button.
// the headings keep their ids, so links to a section still resolve and open it (see client.js).
// `cards: true` shows every H3 section as a plain card instead.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const plugin = {
  name: 'faq',
  version: '1.1.0',
  capabilities: ['build', 'assets'],
};

const PLUGIN_DIR = path.dirname(fileURLToPath(import.meta.url));
const SECTION_HEADING = /<h3\b[^>]*\bid="[^"]+"[^>]*>[\s\S]*?<\/h3>/g;
const SECTION_END = /<h[1-3][\s>]|<hr\b|<section class="docs-graph-local"/g;

export function onBeforeRender(pageContext) {
  const frontmatter = pageContext.frontmatter;
  const collapsibleNoun = frontmatter.collapsible;
  if (typeof collapsibleNoun === 'string') wrapSections(pageContext, renderItem, (count) => renderBar(count, collapsibleNoun));
  else if (frontmatter.cards === true) wrapSections(pageContext, renderCard, null);
}

export function getAssets() {
  return [
    { src: path.join(PLUGIN_DIR, 'client.js'), dest: 'assets/js/faq.js', type: 'js', location: 'body' },
    { src: path.join(PLUGIN_DIR, 'client.css'), dest: 'assets/css/faq.css', type: 'css', location: 'head' },
  ];
}

function wrapSections(pageContext, renderSection, renderBar) {
  const html = pageContext.html;
  const parts = [];
  let cursor = 0;
  let count = 0;
  let barPartIndex = -1;
  SECTION_HEADING.lastIndex = 0;
  for (let heading = SECTION_HEADING.exec(html); heading !== null; heading = SECTION_HEADING.exec(html)) {
    const headingHtml = heading[0];
    const bodyStart = heading.index + headingHtml.length;
    SECTION_END.lastIndex = bodyStart;
    const end = SECTION_END.exec(html);
    const bodyEnd = end === null ? html.length : end.index;
    const bodyHtml = html.slice(bodyStart, bodyEnd);
    parts.push(html.slice(cursor, heading.index));
    if (barPartIndex === -1) {
      barPartIndex = parts.length;
      parts.push('');
    }
    parts.push(renderSection(headingHtml, bodyHtml));
    cursor = bodyEnd;
    count++;
    SECTION_HEADING.lastIndex = bodyEnd;
  }
  if (count === 0) return;
  parts.push(html.slice(cursor));
  if (renderBar !== null) parts[barPartIndex] = renderBar(count);
  pageContext.html = parts.join('');
}

function renderItem(heading, answer) {
  return `<details class="faq-item"><summary class="faq-item__question">${heading}<span class="faq-item__icon" aria-hidden="true"></span></summary><div class="faq-item__answer"><div class="faq-item__body">${answer}</div></div></details>\n`;
}

function renderCard(heading, body) {
  return `<div class="section-card"><div class="section-card__heading">${heading}</div><div class="section-card__body">${body}</div></div>\n`;
}

// -- hidden until client.js mounts, the button needs it
function renderBar(count, noun) {
  return `<div class="faq-bar" hidden><span class="faq-bar__count">${count} ${noun}</span><button type="button" class="faq-bar__toggle"></button></div>\n`;
}
