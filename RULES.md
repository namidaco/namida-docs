# Writing Rules

Rules for writing and editing these docs. They apply to humans and AI assistants alike.

## Goal & Audience

- Help new users understand Namida, and existing users discover more features.
- Two kinds of readers: someone looking up one specific setting, and someone browsing to learn what the app can do.

## Style

- Simple grammar, no complicated or advanced words.
- No verbose text, get to the point without much talk. Before finishing, reread each added line and cut what a reader wouldn't miss.
- Human readable, prefer prose and short bullets over walls of specs. Leave out ranges (Hz, dB, %, time limits), default preset lists and edge cases, the app has the rest.
- Group items under a generic label instead of a sentence naming each one: `Extra visualizers: mirrored bars, outline, glow & edge lights`. In summary lists, link the feature generically (`[effects & visualizers](/features/effects/)`) instead of picking a few arbitrary examples.
- To explain named items (home mixes, generation types), give each one a short phrase that says what's in it (`tracks you played only a few times and haven't heard in a while`), without numbers or thresholds. A phrase that is too vague (`tracks that deserve more listens`) or covers only part of the item doesn't work either. Obvious names share one bullet.
- Say a caveat (like a flag requirement) once on the feature page, other pages only mention it shortly.
- No em dash or en dash (—, –), use a comma instead.
- Put a side note in parentheses instead of chaining commas: `sometimes blocks them (the dialog says the app was blocked)`. Two main clauses joined by a comma are fine as is.
- No goofy or too good to be true verbs, like fixes that "reach" or "land" in beta.
- Never write "right away". Use "directly" when it skips a step, "instantly" or "immediately" for timing, or drop it.
- No vague pronouns, "It" must clearly point to something (`The tour below plays automatically`).
- Say the action first, then what it does: `tap the title area to open it`, not `open it by tapping the title area`. A line that starts with the goal is fine (`To add one, long press a line and press Add`), since readers scan for the goal.
- On the docs' own interactive pages (the tour, Screens Map and Docs Graph), give a general hint about the controls instead of explaining what each one does.
- Short copy (tour captions, taglines) is a short description of what the feature gives (`Search the whole library at once, even inside lyrics.`), not a list of features. Don't end its lines with "and more" or etc.
- For the app itself, list every option, but keep it light: give the action, then its options in parentheses, with spaced slashes when they're more than one word (`Long press a preset for more options (use for current device / save current bands / rename / delete)`). Fold small visual details into one short parenthesis instead of a sentence each.
- Literal code values (event names, keys, enum values) are listed with spaced slashes too: `` `event`: `trackChanged` / `play` / `pause` ``, not `` is `a`, `b` or `c` ``.
- A list of examples (a few apps or tools named as samples) ends with `, etc` inside the parentheses, with no dot: `(Tasker, MacroDroid, Automate, etc)`. A complete list (all accepted inputs, all controls) gets no etc.
- A single newline renders as a line break, so never hard wrap lines. Break at each topic shift (local vs online, single video vs playlists), short paragraphs included. Sentences on the same topic stay on one line, so never break per sentence or inside list items, and keep a short closing sentence on the same line.
- Don't pack unrelated points into one paragraph, list them as bullets under a short lead in (`In fullscreen:`). A paragraph is for one topic. Siblings go in one list, never explain a few items in a list and leave another one as a separate paragraph.
- No emojis (except in major headings if really needed). `docs/whats-new.md` is the exception, its emojis are intended, keep them.
- Use setting/feature titles exactly as they appear in the app (source: `external/language/translations/en.arb` in the namida repo). Descriptions can be extended beyond the in-app subtitle when helpful.
- "Namida" is written like this.
- YouTube data kept in the app is "Namida" (Namida YouTube playlists, Namida history), and data of the signed in account is "account" (account playlists, account history). "Local" only means the local library, so never write "local YouTube playlist", and don't call either side hosted, online or offline. The in-app Local / YouTube labels are used only when naming that UI (Local = Namida, YouTube = account), as explained in `docs/features/youtube.md#namida-account`.
- Hidden discoveries (easter eggs, their rewards, where they hide) get a vague teaser like `Find them all for a little gift`, never the spoiler. Don't remove the line either, readers should still know there is something to find.

## Editing Existing Text

- Make the lightest fix. Only change what is actually wrong or hard to read: grammar errors, passive phrasing that hides the action, confusing logic, real jargon, repeated words, or a wrong or vague description (check it against code). When unsure whether a change helps, don't make it.
- Don't swap fine words for "plainer" ones ("vice versa", "alternatives", "should trigger" and "will always use" stay), and don't restructure a sentence that is already clear.
- Simplify, never add details that weren't there (like "at the top of settings").
- Check what a wordy phrase actually says before shortening it. "with support for displaying word synced lrc/ttml" can't become "including", since those formats are displayed, not fetched.
- Never drop a correct fact to make a line shorter. A bullet that looks like a duplicate of another list can still have its own unique part, so only remove it when it adds nothing.
- The author's voice stays as is (the ai usage paragraph, philosophy, jokes).
- Existing link lead ins stay as written (`or see more ways here: [chip]`, `More hidden gestures in [chip]`). `See [chip] for X` is only for new link lines.
- Place a new sentence after the sentences it relates to, never between two that belong together (on its own line when it's a different topic).

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

Three kinds of inline code chips are used:

- **Availability label**: platform restricted settings get a plain chip on its own line right under the header, like `` `💻 Android only` ``, `` `💻 Android 12+ only` ``, `` `💻 Windows+Linux only` ``. Source of truth: the `availability:` (`NamidaFeaturesAvailablity`) of the setting's entry in `lib/ui/widgets/settings/`. A feature missing only on iOS or macOS gets no chip, list it in the iOS & macOS section of `docs/installation.md` instead.
  - Platforms are written exactly as Android, iOS, Windows, Linux and macOS, joined with `+`. A version can follow a name (`Android 12+`, `Android <= 12`).
  - The build (`plugins/chips`) turns the chip into a strip of platform icons, and its `chips:` log line must say `0 problems`.
  - A flag gets its own chip right after its name: `` `MEDIA_WAVE_HAPTIC` `💻 Android+iOS only` ``.
- **Upgrade label**: a line that needs a newer system version starts with `` `⬆️ iOS 16.2+` `` (one platform and its version) instead of saying "On iOS 16.2+" in the sentence. It covers its whole line, so in lists move that part to a sub-bullet. A version mentioned in passing (like a limitation on older versions) stays plain text.
- **Related link chip**: sections link their related setting/feature/page/guide with a clickable chip placed at the END of the line or the end of the section, never right under the header: ``[`⚙️ Configure Downloads ↗`](/settings/5-youtube-settings/#downloads)``. More than one chip is fine when applicable. An end of line chip is only for a reference that directly relates to that line (a feature, then the setting for it). A link to something the line isn't about gets its own line saying what it's for: ``See [`📄 Screens Map ↗`](/screens/) for all screens and where they open from.`` Keep a "Related Settings" list at the bottom of feature pages too.

Link icons, always include the type in the name:

| Type | Icon | Naming example |
| --- | --- | --- |
| Setting | ⚙️ | `⚙️ Configure Downloads ↗` |
| Feature | 🎉 | `🎉 Sync feature ↗` |
| Page | 📄 | `📄 Tracks Page ↗` |
| Guide | 📒 | `📒 Sync Guide ↗` |
| Platform only | 💻 | used for availability context |
| Newer system version | ⬆️ | used for upgrade labels |

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
- `docs/features/`: one file per feature, sections describe what the user can do. Feature pages showcase, so a list of items is a few grouped bullets with the last one ending in `etc`. Explaining each item belongs in `docs/pages/` or `docs/settings/` (the home mixes are explained in `docs/pages/library.md`).
- `docs/pages/`: a tour of in-app pages, grouped (library / youtube / other), small description per page plus chips.
- `docs/guides/`: step by step guides, grouped by level (beginner / medium / namider).
- `docs/tips.md`: not so obvious features, grouped by topic.
- `docs/permissions.md`: the permissions the app uses and why.
- `docs/faq.md`: one H3 per question. Its `faq: true` frontmatter shows every H3 section as a collapsible card (`plugins/faq`).
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

## Interactive Pages

The docs' own interactive pages (the tour, Screens Map and Docs Graph) should look calm:

- Muted colors mixed from the site's warm palette toward gray (`color-mix(in srgb, var(--summer-accent) 70%, var(--summer-fg-muted))`), no off palette colors like bright blue.
- Thin lines (around 3 to 5px), soft glows and subtle animations.
- Keep the tour's ending, it zooms out to the whole route with a closing line.

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
3. Update the docs. Mark new features, settings and sections with `` `🆕 vX.Y.Z` ``, on its own line under the header or at the end of the line. A small extension of an existing feature (another kind, platform or detail) merges into that feature's line and keeps its old marker, never a line of its own only to carry the newer marker. A marker reads as covering its whole line, so when a separate new feature shares a line, move it to a sub-bullet in lists, otherwise put the marker right after the new part (``turn on the "Cache" chip `🆕 v7.4.0` to see...``), or the new sentence on its own line as a last resort. Minor details (like a restriction) need no marker. The build (`plugins/chips`) shows markers of the last 2 versions as `NEW` tags and older ones as `SINCE` tags, both linking to What's New.
   - Use one marker version for the whole update, the one that gets released. A pubspec bump in namida isn't a release (v8.0.0 was never released, so its content is marked `v8.2.0`). Ask the maintainer when unsure which versions were published.
4. Set `namida.commit` and `namida.version` in `package.json` to the new HEAD, and bump `version` there and `versions` in `docmd.config.json`.
5. Run `npm run whats-new` to list the new markers in [What's New](docs/whats-new.md).

## Verification

Before committing:

1. `npm run build` must pass.
2. The `[docs-graph]` line of the build output says `0 broken`, it lists every internal link and `#anchor` that doesn't resolve.
3. The `[docs-shots]` line says `0 problems`.
4. No em/en dashes slipped in (search for `—` and `–` in your changed files).
