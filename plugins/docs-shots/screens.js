// by claude
// The screens map: every screen of the app (screens.json from the namida screenshots, each scene and the scene it
// opens from), linked to the docs section showing it.

/**
 * @param {{ id: string, parent: string | null }[]} screens
 * @param {Map<string, string>} hrefById the first docs section showing each shot
 * @param {(id: string) => object | null} variantsOf platform -> theme -> { shot, thumb }, null when never shot
 */
export function buildScreensMap(screens, hrefById, variantsOf) {
  const nodes = [];
  for (const screen of screens) {
    const variants = variantsOf(screen.id);
    if (variants === null) continue;
    nodes.push({
      id: screen.id,
      parent: screen.parent,
      label: labelOf(screen.id, screen.parent),
      href: hrefById.get(screen.id) ?? null,
      variants,
    });
  }
  // -- a screen whose parent was never shot hangs from nothing rather than from a missing node
  const ids = new Set(nodes.map((node) => node.id));
  for (const node of nodes) {
    if (node.parent !== null && !ids.has(node.parent)) node.parent = null;
  }
  return nodes;
}

// -- `settings_indexer_separators` under `settings_indexer` reads "Separators", the map already shows where it is
function labelOf(id, parent) {
  const ownPart = parent !== null && id.startsWith(`${parent}_`) ? id.slice(parent.length + 1) : id;
  const text = ownPart.replace(/^yt_/, 'YouTube_').replaceAll('_', ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}
