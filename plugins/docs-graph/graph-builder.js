// by claude
// Parses the docs pages into pages, their sections, version markers and the internal links between them.
import path from 'node:path';
import { outputPathToPathname } from '@docmd/api';

export class GraphBuilder {
  static #CATEGORY_ORDER = { features: 0, pages: 1, settings: 2, other: 3 };
  static #PAGE_LEVEL_ANCHORS = new Set(['related', 'related-settings']);

  static #FENCE = /^\s*(```|~~~)/;
  static #TITLE_HEADING = /^#\s+(.+?)\s*$/;
  static #SECTION_HEADING = /^#{2,6}\s+(.+?)\s*\{#([\w-]+)\}\s*$/;
  static #INTERNAL_LINK = /\]\(([/#][^)\s]*)\)/g;
  static #VERSION_MARKER = /`🆕 (v\d+\.\d+\.\d+)`/g;
  static #NON_PAGE_FILE = /\.(?!md$|html$)\w+$/;
  static #PAGE_FILE_EXTENSION = /\.(md|html)$/;
  static #INDEX_SUFFIX = /\/index$/;

  #pageOrderByUrl;
  #nodes = [];
  #nodeIndexByUrl = new Map();
  #anchorsByPageUrl = new Map();
  #rawLinks = [];
  #links = [];

  constructor(navigation) {
    this.#pageOrderByUrl = GraphBuilder.#buildPageOrder(navigation);
  }

  addPage(page) {
    const pageUrl = outputPathToPathname(page.outputPath);
    const anchors = new Set();
    this.#anchorsByPageUrl.set(pageUrl, anchors);

    const inGraph = page.frontmatter?.graph !== false;
    const category = GraphBuilder.#categoryOf(pageUrl);
    const order = this.#pageOrderByUrl.get(pageUrl) ?? this.#pageOrderByUrl.size;
    const pageIndex = inGraph ? this.#addNode({ url: pageUrl, title: page.frontmatter?.title, category, order }) : -1;

    const file = path.relative(process.cwd(), page.sourcePath).replaceAll('\\', '/');
    const lines = page.rawMarkdown.split('\n');

    let sourceIndex = pageIndex;
    let inFence = false;
    for (let i = GraphBuilder.#bodyStartLine(lines); i < lines.length; i++) {
      const line = lines[i];
      if (GraphBuilder.#FENCE.test(line)) {
        inFence = !inFence;
        continue;
      }
      if (inFence) continue;

      const section = GraphBuilder.#SECTION_HEADING.exec(line);
      if (section) anchors.add(section[2]);
      if (!inGraph) continue;

      if (section) {
        const [, title, anchor] = section;
        sourceIndex = GraphBuilder.#PAGE_LEVEL_ANCHORS.has(anchor)
          ? pageIndex
          : this.#addNode({ url: `${pageUrl}#${anchor}`, title, category, page: pageIndex });
        continue;
      }

      const pageNode = this.#nodes[pageIndex];
      if (pageNode.title == null) {
        const title = GraphBuilder.#TITLE_HEADING.exec(line);
        if (title) pageNode.title = title[1];
      }

      for (const match of line.matchAll(GraphBuilder.#INTERNAL_LINK)) {
        this.#rawLinks.push({ source: sourceIndex, pageUrl, href: match[1], file, line: i + 1 });
      }
      for (const match of line.matchAll(GraphBuilder.#VERSION_MARKER)) {
        this.#addVersion(sourceIndex, match[1]);
      }
    }
  }

  resolveLinks() {
    const broken = [];
    const nodeCount = this.#nodes.length;
    const seen = new Set();
    for (const link of this.#rawLinks) {
      const target = this.#resolveTarget(link);
      if (target.brokenReason !== undefined) {
        broken.push({ file: link.file, line: link.line, href: link.href, reason: target.brokenReason });
        continue;
      }
      const targetIndex = target.nodeIndex;
      if (targetIndex === undefined || targetIndex === link.source) continue;
      const key = link.source * nodeCount + targetIndex;
      if (seen.has(key)) continue;
      seen.add(key);
      this.#links.push(link.source, targetIndex);
    }
    return broken;
  }

  toJson() {
    const versions = this.#collectVersions();
    return { nodes: this.#nodes, links: this.#links, versions };
  }

  // per page, the pages it links to and is linked from, each with the sections the links land in or come from
  buildPageConnections() {
    const connectionsByIndex = new Map();
    const getConnections = (pageIndex) => {
      let connections = connectionsByIndex.get(pageIndex);
      if (connections === undefined) {
        connections = { page: this.#nodes[pageIndex], incoming: new Map(), outgoing: new Map() };
        connectionsByIndex.set(pageIndex, connections);
      }
      return connections;
    };
    const getParts = (partsByPage, pageIndex) => {
      let parts = partsByPage.get(pageIndex);
      if (parts === undefined) {
        parts = new Set();
        partsByPage.set(pageIndex, parts);
      }
      return parts;
    };

    for (let i = 0; i < this.#nodes.length; i++) {
      if (this.#nodes[i].page === undefined) getConnections(i);
    }
    for (let i = 0; i < this.#links.length; i += 2) {
      const sourceIndex = this.#links[i];
      const targetIndex = this.#links[i + 1];
      const sourcePage = this.#pageIndexOf(sourceIndex);
      const targetPage = this.#pageIndexOf(targetIndex);
      if (sourcePage === targetPage) continue;

      const targetConnections = getConnections(targetPage);
      const sourceParts = getParts(targetConnections.incoming, sourcePage);
      if (sourceIndex !== sourcePage) sourceParts.add(sourceIndex);

      const sourceConnections = getConnections(sourcePage);
      const targetParts = getParts(sourceConnections.outgoing, targetPage);
      if (targetIndex !== targetPage) targetParts.add(targetIndex);
    }

    const compareIndices = (a, b) => GraphBuilder.#comparePages(this.#nodes[a], this.#nodes[b]);
    const toSortedConnections = (partsByPage) => {
      const pageIndices = [...partsByPage.keys()].sort(compareIndices);
      return pageIndices.map((pageIndex) => {
        const partSet = partsByPage.get(pageIndex);
        const partIndices = [...partSet].sort((a, b) => a - b);
        const parts = partIndices.map((index) => this.#nodes[index]);
        return { page: this.#nodes[pageIndex], parts };
      });
    };
    const connectionsByUrl = new Map();
    for (const connections of connectionsByIndex.values()) {
      const incoming = toSortedConnections(connections.incoming);
      const outgoing = toSortedConnections(connections.outgoing);
      connectionsByUrl.set(connections.page.url, { page: connections.page, incoming, outgoing });
    }
    return connectionsByUrl;
  }

  #resolveTarget({ pageUrl, href }) {
    const hashAt = href.indexOf('#');
    const pathPart = hashAt === -1 ? href : href.slice(0, hashAt);
    const anchor = hashAt === -1 ? '' : href.slice(hashAt + 1);
    if (pathPart !== '') {
      const lastSegment = pathPart.slice(pathPart.lastIndexOf('/') + 1);
      if (GraphBuilder.#NON_PAGE_FILE.test(lastSegment)) return {};
      pageUrl = GraphBuilder.#normalizePagePath(pathPart);
    }

    const anchors = this.#anchorsByPageUrl.get(pageUrl);
    if (anchors === undefined) return { brokenReason: 'missing page' };
    const pageIndex = this.#nodeIndexByUrl.get(pageUrl);
    if (anchor === '') return { nodeIndex: pageIndex };
    if (!anchors.has(anchor)) return { brokenReason: 'missing anchor' };

    const sectionIndex = this.#nodeIndexByUrl.get(`${pageUrl}#${anchor}`);
    return { nodeIndex: sectionIndex ?? pageIndex };
  }

  #addNode(node) {
    const index = this.#nodes.length;
    this.#nodes.push(node);
    this.#nodeIndexByUrl.set(node.url, index);
    return index;
  }

  #addVersion(nodeIndex, version) {
    const node = this.#nodes[nodeIndex];
    node.versions ??= [];
    if (!node.versions.includes(version)) node.versions.push(version);
  }

  #pageIndexOf(nodeIndex) {
    const node = this.#nodes[nodeIndex];
    return node.page ?? nodeIndex;
  }

  #collectVersions() {
    const names = new Set();
    for (const node of this.#nodes) {
      if (node.versions !== undefined) node.versions.forEach((version) => names.add(version));
    }
    const sortedNames = [...names].sort(GraphBuilder.#compareVersions);
    return sortedNames.map((name) => {
      const announcement = this.#nodes.find((node) => node.page !== undefined && node.title.endsWith(` ${name}`));
      return { name, announcementUrl: announcement?.url ?? null };
    });
  }

  static #compareVersions(a, b) {
    const partsA = a.slice(1).split('.');
    const partsB = b.slice(1).split('.');
    for (let i = 0; i < partsA.length; i++) {
      const diff = Number(partsA[i]) - Number(partsB[i]);
      if (diff !== 0) return diff;
    }
    return 0;
  }

  static #comparePages(a, b) {
    const categoryDiff = GraphBuilder.#CATEGORY_ORDER[a.category] - GraphBuilder.#CATEGORY_ORDER[b.category];
    if (categoryDiff !== 0) return categoryDiff;
    return a.order - b.order;
  }

  static #buildPageOrder(navigation) {
    const orderByUrl = new Map();
    const visit = (items) => {
      for (const item of items ?? []) {
        const isPage = item.path !== undefined && item.path.startsWith('/');
        if (isPage) {
          const url = GraphBuilder.#normalizePagePath(item.path);
          if (!orderByUrl.has(url)) orderByUrl.set(url, orderByUrl.size);
        }
        visit(item.children);
      }
    };
    visit(navigation);
    return orderByUrl;
  }

  static #bodyStartLine(lines) {
    if (lines[0]?.trim() !== '---') return 0;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') return i + 1;
    }
    return 0;
  }

  static #normalizePagePath(pathPart) {
    const withoutExtension = pathPart.replace(GraphBuilder.#PAGE_FILE_EXTENSION, '');
    const clean = withoutExtension.replace(GraphBuilder.#INDEX_SUFFIX, '');
    return clean.endsWith('/') ? clean : `${clean}/`;
  }

  static #categoryOf(pageUrl) {
    const firstSegment = pageUrl.split('/')[1];
    return Object.hasOwn(GraphBuilder.#CATEGORY_ORDER, firstSegment) ? firstSegment : 'other';
  }
}
