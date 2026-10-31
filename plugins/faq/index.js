// by claude
// docmd plugin: a page with `faq: true` in its frontmatter shows every H3 section as a collapsible question card.
// the headings keep their ids, so links to a question still resolve and open it (see client.js).
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const plugin = {
  name: 'faq',
  version: '1.0.0',
  capabilities: ['build', 'assets'],
};

const PLUGIN_DIR = path.dirname(fileURLToPath(import.meta.url));
const QUESTION_HEADING = /<h3\b[^>]*\bid="[^"]+"[^>]*>[\s\S]*?<\/h3>/g;
const ANSWER_END = /<h[1-3][\s>]|<hr\b|<section class="docs-graph-local"/g;

export function onBeforeRender(pageContext) {
  if (pageContext.frontmatter.faq !== true) return;
  const html = pageContext.html;
  const parts = [];
  let cursor = 0;
  let count = 0;
  let barPartIndex = -1;
  QUESTION_HEADING.lastIndex = 0;
  for (let heading = QUESTION_HEADING.exec(html); heading !== null; heading = QUESTION_HEADING.exec(html)) {
    const headingHtml = heading[0];
    const answerStart = heading.index + headingHtml.length;
    ANSWER_END.lastIndex = answerStart;
    const end = ANSWER_END.exec(html);
    const answerEnd = end === null ? html.length : end.index;
    const answerHtml = html.slice(answerStart, answerEnd);
    parts.push(html.slice(cursor, heading.index));
    if (barPartIndex === -1) {
      barPartIndex = parts.length;
      parts.push('');
    }
    parts.push(renderItem(headingHtml, answerHtml));
    cursor = answerEnd;
    count++;
    QUESTION_HEADING.lastIndex = answerEnd;
  }
  if (count === 0) return;
  parts.push(html.slice(cursor));
  parts[barPartIndex] = renderBar(count);
  pageContext.html = parts.join('');
}

export function getAssets() {
  return [
    { src: path.join(PLUGIN_DIR, 'client.js'), dest: 'assets/js/faq.js', type: 'js', location: 'body' },
    { src: path.join(PLUGIN_DIR, 'client.css'), dest: 'assets/css/faq.css', type: 'css', location: 'head' },
  ];
}

function renderItem(heading, answer) {
  return `<details class="faq-item"><summary class="faq-item__question">${heading}<span class="faq-item__icon" aria-hidden="true"></span></summary><div class="faq-item__answer"><div class="faq-item__body">${answer}</div></div></details>\n`;
}

// -- hidden until client.js mounts, the button needs it
function renderBar(count) {
  return `<div class="faq-bar" hidden><span class="faq-bar__count">${count} questions</span><button type="button" class="faq-bar__toggle"></button></div>\n`;
}
