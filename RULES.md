# Writing Rules

Rules for writing and editing these docs. They apply to humans and AI assistants alike.

## Goal & Audience

- Help new users understand Namida, and existing users discover more features.
- Two kinds of readers: someone looking up one specific setting, and someone browsing to learn what the app can do.

## Style

- Simple grammar, no complicated or advanced words.
- No verbose text, get to the point without much talk.
- Human readable, prefer prose and short bullets over walls of specs.
- No em dash or en dash (—, –), use a comma instead.
- Put a side note in parentheses instead of chaining commas: `sometimes blocks them (the dialog says the app was blocked)`. Two main clauses joined by a comma are fine as is.
- A single newline renders as a line break, so never hard wrap lines, and only add a break where it fits: in a long paragraph, at the point where it moves to a new topic (local vs online, single video vs playlists). Usually one per paragraph. Never one sentence per line, never inside list items, and keep a short closing sentence on the same line.
- Don't pack unrelated points into one paragraph, list them as bullets under a short lead in (`In fullscreen:`). A paragraph is for one topic.
- No emojis (except in major headings if really needed). `docs/whats-new.md` is the exception, its emojis are intended, keep them.
- Use setting/feature titles exactly as they appear in the app (source: `external/language/translations/en.arb` in the namida repo). Descriptions can be extended beyond the in-app subtitle when helpful.
- "Namida" is written like this.

## Page Anatomy

Every page follows this shape:

```markdown
---
title: "Short Name"
description: "One line about the page"
---

# Page Title

One or two intro lines.

### Section Name {#section-anchor}

Content...

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
```

- Section headers are H3 (`###`), not H2.
- Every section header gets an explicit id: `### Downloads {#downloads}`. This is required, docmd prefixes auto generated ids with the page slug, which breaks cross page anchors. Explicit ids stay stable.
- The footer names the content author and the writer of the text. Append your handle to the writer line if you meaningfully edited the file: `<sub>Author: @MSOB7YY<br>Writer: @claude & @someone</sub>`.

## Chips & Links

Two kinds of inline code chips are used:

- **Availability label**: platform restricted settings get a plain chip on its own line right under the header, like `` `💻 Android only` ``, `` `💻 Android 12+ only` ``, `` `💻 Windows+Linux only` ``. Source of truth: the `availability:` (`NamidaFeaturesAvailablity`) of the setting's entry in `lib/ui/widgets/settings/`. A feature missing only on iOS or macOS gets no chip, list it in the iOS & macOS section of `docs/installation.md` instead.
- **Related link chip**: sections link their related setting/feature/page/guide with a clickable chip placed at the END of the line or the end of the section, never right under the header: ``[`⚙️ Configure Downloads ↗`](/settings/5-youtube-settings/#downloads)``. More than one chip is fine when applicable. Keep a "Related Settings" list at the bottom of feature pages too.

Link icons, always include the type in the name:

| Type | Icon | Naming example |
| --- | --- | --- |
| Setting | ⚙️ | `⚙️ Configure Downloads ↗` |
| Feature | 🎉 | `🎉 Sync feature ↗` |
| Page | 📄 | `📄 Tracks Page ↗` |
| Guide | 📒 | `📒 Sync Guide ↗` |
| Platform only | 💻 | used for availability context |

## Callouts

Simple form only, no title or icon:

```markdown
::: callout info
Some note.
:::
```

Types used: `info`, `tip`, `warning`.

## Linking

- Internal links use clean urls: `/settings/3-playback-settings/`, `/features/youtube/#downloads`.
- Link generously between settings, features, pages and tips. A feature should link its settings, a setting can link the feature it powers.
- Never link an anchor that doesn't exist yet, unless you create it in the same change. The build checks this, its `[docs-graph]` line lists every internal link or `#anchor` that doesn't resolve, with file and line.
- Every page gets a generated Page Connections box (pages linking to it and pages it links to, with the exact sections), so never write manual "linked from" lists.

## Structure

- `docs/settings/`: one file per in-app settings section, numbered by the in-app order (1-theme ... 8-advanced). Every setting gets its own H3 with a one to three line explanation. Order inside the file follows the in-app order.
- `docs/features/`: one file per feature, sections describe what the user can do.
- `docs/pages/`: a tour of in-app pages, grouped (library / youtube / other), small description per page plus chips.
- `docs/guides/`: step by step guides, grouped by level (beginner / medium / namider).
- `docs/tips.md`: not so obvious features, grouped by topic.
- `docs/permissions.md`: the permissions the app uses and why.
- `docs/not-planned.md`: features that will not be added and why. The FAQ keeps short answers and links here.
- `docs/whats-new.md`: generated from the `🆕` markers by `npm run whats-new` (also runs on `npm run build`). Never edit inside its `<!-- generated -->` blocks, a short note written under a version heading is kept.
- `docs/graph.md`: the interactive docs graph, built by `plugins/docs-graph` from the links, section ids and `🆕` markers of every page. Add `graph: false` to a page's frontmatter to leave it out of the graph and of Page Connections.
- Sidebar navigation is manual: every new page needs an entry in `docmd.config.json` under `navigation`. Its order is also the order of pages in the graph's Kasane view.

## Screenshots

- Never put images in the pages. `screenshots.json` maps a page and a section id to shot ids, `plugins/docs-shots` places them at the end of that section. The `""` key is the page intro, `{ "shots": [...], "collapsed": "Whole page" }` folds them.
- Shot ids are the scene ids of `scripts/screenshots/scenes.json` in the namida repo, the images live in [namida-assets](https://github.com/namidaco/namida-assets) (`screenshots/docs/<platform>/<theme>/<id>.webp`). Light/dark follow the site theme, Android and Desktop become tabs when both exist.
- Settings tiles in a shot turn into hotspots for the section with the same title on that page, and a link to such a section shows the tile while hovered. Both come from the heading titles, so keep settings headings exactly as the in-app titles (a heading like `A & B` matches both tiles).
- A link to any section or page with shots shows its first shot while hovered. The [Screens Map](/screens/) draws every screen from the `parent` each scene has in `scenes.json` (namida repo), a new screen only needs its `parent` there.
- The build's `[docs-shots]` line lists every id or section that doesn't exist, it must say `0 problems`.
- To preview shots that aren't published yet: `DOCS_SHOTS_BASE=<url> npm run build`, with that url serving a copy of `screenshots/docs`.
- Shots link to a namida-assets commit, `namida.screenshotsCommit` in `package.json`: `latest` (the default) is its main at build time, a commit sha freezes them. The build line ends with the commit it used.

## Sourcing from Code

When documenting from the namida codebase:

- Setting titles, subtitles & in-app order: the `_sections` list in each `lib/ui/widgets/settings/*.dart` file, every entry has its `title`/`subtitle` as `lang.*` keys, resolve them in `en.arb`. Each inner list is a section (shown with a divider in the app).
- Platform availability: `availability:` on the setting's entry.
- Document what the user can do and what happens, never how it is implemented. Implementation details (buffer sizes, algorithms, file formats) drift with refactors and don't help users.
- Don't guess. If a behavior can't be confirmed from code, the README, or the maintainer, leave it out.

## Updating for a New Release

The namida commit the docs are based on is stored in `package.json` under `namida.commit`.

1. In the namida repo, list what changed since then: `git log --reverse <commit>..HEAD`.
2. Inspect each commit's actual diff (`git show <hash>`), not only its message, and check the final code at HEAD since later commits can change things. New UI strings show up in `en.arb`, the translations submodule isn't pinned by namida commits, so compare it by date.
3. Update the docs. Mark new features, settings and sections with `` `🆕 vX.Y.Z` ``, on its own line under the header or at the end of the line. A marker reads as covering its whole line, so when only part of a line is new, move that part to a sub-bullet in lists, otherwise put the marker right after the new part (``turn on the "Cache" chip `🆕 v7.4.0` to see...``), or the new sentence on its own line as a last resort. Minor details (like a restriction) need no marker.
4. Set `namida.commit` and `namida.version` in `package.json` to the new HEAD, and bump `version` there and `versions` in `docmd.config.json`.
5. Run `npm run whats-new` to list the new markers in [What's New](docs/whats-new.md).

## Verification

Before committing:

1. `npm run build` must pass.
2. The `[docs-graph]` line of the build output says `0 broken`, it lists every internal link and `#anchor` that doesn't resolve.
3. The `[docs-shots]` line says `0 problems`.
4. No em/en dashes slipped in (search for `—` and `–` in your changed files).
