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
- No emojis (except in major headings if really needed).
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

<sub>by @author</sub>
```

- Section headers are H3 (`###`), not H2.
- Every section header gets an explicit id: `### Downloads {#downloads}`. This is required, docmd prefixes auto generated ids with the page slug, which breaks cross page anchors. Explicit ids stay stable.
- The footer credits whoever wrote or meaningfully edited the file, multiple names are fine: `<sub>by @claude & @someone</sub>`.

## Chips

Two kinds of inline code chips are used:

- **Availability label**: platform restricted settings get a plain chip on its own line right under the header, like `` `Android only` ``, `` `Android 12+ only` ``, `` `Windows+Linux only` ``. Source of truth: the `NamidaFeaturesAvailablity` value declared in the setting's enum (any enum `with SettingKeysBase` in `lib/ui/widgets/settings/`).
- **Related setting link**: feature sections link their setting with a clickable chip right under the header: `` [`⚙️ Miniplayer Settings ↗`](/settings/5-youtube-settings/#miniplayer) ``. Name the setting or use a generic name, always end with the ↗ arrow. Keep a "Related Settings" list at the bottom of feature pages too.

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
- Never link an anchor that doesn't exist yet, unless you create it in the same change.

## Structure

- `docs/settings/`: one file per in-app settings section, numbered by the in-app order (1-theme ... 8-advanced). Every setting gets its own H3 with a one to three line explanation. Order inside the file follows the in-app order.
- `docs/features/`: one file per feature, sections describe what the user can do.
- `docs/pages/`: a tour of in-app pages, grouped (library / youtube / other), small description per page plus chips.
- `docs/tips.md`: not so obvious features, grouped by topic.
- Sidebar navigation is manual: every new page needs an entry in `docmd.config.json` under `navigation`.

## Sourcing from Code

When documenting from the namida codebase:

- Setting titles & subtitles: the `lookupMap` in each `lib/ui/widgets/settings/*.dart` file maps every setting to its `lang.*` keys, resolve them in `en.arb`.
- Platform availability: `NamidaFeaturesAvailablity` on the setting's enum entry.
- Document what the user can do and what happens, never how it is implemented. Implementation details (buffer sizes, algorithms, file formats) drift with refactors and don't help users.
- Don't guess. If a behavior can't be confirmed from code, the README, or the maintainer, leave it out.

## Verification

Before committing:

1. `npm run build` must pass.
2. Check that every internal link and `#anchor` you touched resolves in the built `site/` output.
3. No em/en dashes slipped in (search for `—` and `–` in your changed files).
