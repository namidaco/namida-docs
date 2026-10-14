// by claude
// docmd plugin: builds the docs graph (graph page data and the connections under every page),
// and reports internal links that point to a missing page or anchor.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildContextualUrl, outputPathToPathname } from '@docmd/api';
import { GraphBuilder } from './graph-builder.js';
import { renderLocalGraph } from './local-graph.js';

export const plugin = {
  name: 'docs-graph',
  version: '1.0.0',
  capabilities: ['build', 'post-build', 'assets'],
};

const OUTPUT_FILE = 'docs-graph.json';
const GRAPH_PAGE_URL = '/graph/';
const PLUGIN_DIR = path.dirname(fileURLToPath(import.meta.url));
const FORCE_GRAPH_ENTRY = fileURLToPath(import.meta.resolve('force-graph'));
const FORCE_GRAPH_DIR = path.dirname(FORCE_GRAPH_ENTRY);

let lastFullBuild = null;

export function onBeforeBuild({ config, pages, options }) {
  // incremental dev rebuilds only pass the changed pages, the last full graph stays in use
  if (options.targetFiles) return;

  const builder = new GraphBuilder(config.navigation);
  for (const page of pages) builder.addPage(page);
  const broken = builder.resolveLinks();
  const json = builder.toJson();
  const connectionsByUrl = builder.buildPageConnections();
  lastFullBuild = { json, broken, connectionsByUrl };
}

export function onBeforeRender(pageContext) {
  if (lastFullBuild === null) return;
  const pageUrl = outputPathToPathname(pageContext.outputPath);
  const connections = lastFullBuild.connectionsByUrl.get(pageUrl);
  if (connections === undefined) return;

  const toHref = (url) => buildContextualUrl(url, pageContext.urlContext);
  const graphPageHref = toHref(GRAPH_PAGE_URL);
  const nodeQuery = encodeURIComponent(pageUrl);
  const graphHref = `${graphPageHref}?node=${nodeQuery}`;
  const localGraph = renderLocalGraph({ ...connections, toHref, graphHref });

  const html = pageContext.html;
  const footerAt = html.lastIndexOf('<hr');
  if (footerAt === -1) {
    pageContext.html = html + localGraph;
    return;
  }
  const beforeFooter = html.slice(0, footerAt);
  const footer = html.slice(footerAt);
  pageContext.html = beforeFooter + localGraph + footer;
}

export async function onPostBuild({ outputDir, log }) {
  if (lastFullBuild === null) return;
  const { json, broken } = lastFullBuild;
  for (const link of broken) log(`${link.file}:${link.line} ${link.href} (${link.reason})`, 'WARN');

  const outputPath = path.join(outputDir, OUTPUT_FILE);
  const graphJson = JSON.stringify(json);
  await fs.writeFile(outputPath, graphJson);

  const linkCount = json.links.length / 2;
  log(`${OUTPUT_FILE}: ${json.nodes.length} nodes, ${linkCount} links, ${broken.length} broken`);
}

export function getAssets() {
  return [
    { src: path.join(PLUGIN_DIR, 'client.js'), dest: 'assets/js/docs-graph.js', type: 'js', location: 'body' },
    { src: path.join(PLUGIN_DIR, 'client.css'), dest: 'assets/css/docs-graph.css', type: 'css', location: 'head' },
    { src: path.join(FORCE_GRAPH_DIR, 'force-graph.min.js'), dest: 'assets/js/force-graph.min.js', type: 'js', location: 'none' },
  ];
}
