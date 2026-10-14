// by claude
// The "linked from → page → links to" diagram added under every docs page, rendered at build time.
const ROW_HEIGHT = 40;
const CURVE_WIDTH = 100;

export function renderLocalGraph({ page, incoming, outgoing, toHref, graphHref }) {
  const rowCount = Math.max(incoming.length, outgoing.length, 1);
  const height = rowCount * ROW_HEIGHT;
  const incomingList = renderList(incoming, 'in', 'No pages link here', toHref);
  const outgoingList = renderList(outgoing, 'out', 'No links to other pages', toHref);
  const incomingCurves = renderCurves(incoming.length, rowCount, 'in');
  const outgoingCurves = renderCurves(outgoing.length, rowCount, 'out');
  const centerDot = renderDot(page.category);
  const title = escapeHtml(page.title);
  const graphLink = escapeHtml(graphHref);

  return `<hr>
<section class="docs-graph-local" aria-label="Page connections">
<div class="docs-graph-local__head"><span class="docs-graph-local__title">Page Connections</span><a class="docs-graph-local__open" href="${graphLink}">Open in graph ↗</a></div>
<div class="docs-graph-local__flow" style="--docs-graph-local-height: ${height}px">
<div class="docs-graph-local__caption docs-graph-local__caption--in">Linked from</div>
<div class="docs-graph-local__caption docs-graph-local__caption--out">Links to</div>
${incomingList}
${incomingCurves}
<div class="docs-graph-local__center">${centerDot}<span>${title}</span></div>
${outgoingCurves}
${outgoingList}
</div>
</section>
`;
}

function renderList(connections, side, emptyText, toHref) {
  const items = connections.map(({ page, parts }) => {
    const dot = renderDot(page.category);
    const pageLink = renderLink(page, 'docs-graph-local__page', toHref);
    const partsHtml = renderParts(parts, toHref);
    return `<li>${dot}<span class="docs-graph-local__text">${pageLink}${partsHtml}</span></li>`;
  });
  if (items.length === 0) items.push(`<li class="docs-graph-local__empty">${emptyText}</li>`);
  return `<ul class="docs-graph-local__list docs-graph-local__list--${side}">${items.join('')}</ul>`;
}

function renderParts(parts, toHref) {
  if (parts.length === 0) return '';
  const links = parts.map((part) => renderLink(part, null, toHref));
  const titles = parts.map((part) => part.title);
  const tooltip = escapeHtml(titles.join(', '));
  return `<span class="docs-graph-local__parts" title="${tooltip}">${links.join(', ')}</span>`;
}

function renderLink(node, className, toHref) {
  const contextualHref = toHref(node.url);
  const href = escapeHtml(contextualHref);
  const title = escapeHtml(node.title);
  const classAttribute = className === null ? '' : ` class="${className}"`;
  return `<a${classAttribute} href="${href}">${title}</a>`;
}

function renderCurves(count, rowCount, side) {
  const centerY = (rowCount * ROW_HEIGHT) / 2;
  const firstRowY = ((rowCount - count) * ROW_HEIGHT) / 2 + ROW_HEIGHT / 2;
  const middleX = CURVE_WIDTH / 2;
  const paths = [];
  for (let i = 0; i < count; i++) {
    const rowY = firstRowY + i * ROW_HEIGHT;
    const startY = side === 'in' ? rowY : centerY;
    const endY = side === 'in' ? centerY : rowY;
    paths.push(`<path d="M0 ${startY}C${middleX} ${startY} ${middleX} ${endY} ${CURVE_WIDTH} ${endY}"/>`);
  }
  const height = rowCount * ROW_HEIGHT;
  return `<svg class="docs-graph-local__curves docs-graph-local__curves--${side}" viewBox="0 0 ${CURVE_WIDTH} ${height}" preserveAspectRatio="none" aria-hidden="true">${paths.join('')}</svg>`;
}

function renderDot(category) {
  return `<span class="docs-graph__dot" style="--docs-graph-dot: var(--docs-graph-${category})"></span>`;
}

function escapeHtml(text) {
  return String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}
