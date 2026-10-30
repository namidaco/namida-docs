# Namida Docs

Documentation site for [namida](https://github.com/namidaco/namida), built with [docmd](https://github.com/docmd-io/docmd).

Available at [docs.namida.app](https://docs.namida.app).

## Run locally

```bash
npx @docmd/core dev
```

## Structure

```
docs/
├── index.md          # home page
├── tips.md           # tips & tricks
├── permissions.md    # permissions & why
├── not-planned.md    # features that will not be added
├── guides/           # step by step guides by level
├── faq.md            # frequently asked questions
├── features/         # one file per feature
├── pages/            # tour of in-app pages
└── settings/         # one file per settings section, numbered by in-app order
docmd.config.json     # site config + sidebar navigation
RULES.md              # writing & style rules
```

## Embedding the tour

The [tour](https://docs.namida.app/tour/) can be shown on other sites (namida.app uses it). Its files are served from `embed/`, and these paths stay the same so embedding pages don't break.

```html
<link rel="stylesheet" href="https://docs.namida.app/embed/tour.css">

<div data-docs-tour></div>

<script defer src="https://docs.namida.app/embed/tour.js"></script>
```

The script fills the `data-docs-tour` element. If the script can't load, the element stays empty and takes no space.

### Colors

The tour takes its colors from CSS variables that the embedding page sets (on `:root` for example):

| Variable | Used for |
| --- | --- |
| `--docs-tour-bg` | stage and controls background |
| `--docs-tour-bg-subtle` | screenshot cards and hovered buttons |
| `--docs-tour-border` | borders and empty progress bars |
| `--docs-tour-fg` | titles and the play button |
| `--docs-tour-fg-soft` | captions and screen titles |
| `--docs-tour-fg-muted` | mixed into the chapter colors |
| `--docs-tour-fg-faint` | the dotted route and unvisited stops |
| `--docs-tour-accent` | the first chapter's color |
| `--docs-tour-accent-soft` | the selected platform button |
| `--docs-tour-ring` | focus ring of the stage (a full `box-shadow` value) |
| `--docs-tour-shadow` | screenshot cards shadow (a full `box-shadow` value) |
| `--docs-tour-radius` | stage corners |
| `--docs-tour-radius-sm` | platform switch corners |

The screenshots follow `data-theme="light"` or `data-theme="dark"` on `<html>`. Without that attribute, they follow the system color scheme.

## How to contribute

1. Edit an existing file in `docs/`, or add a new one.
2. Follow the rules in [RULES.md](RULES.md), it covers style, page anatomy and linking. It is written for humans and AI alike.
3. Adding a new page? Add its entry to `navigation` in `docmd.config.json`, the sidebar is manual.
4. Add or keep the credit footer at the bottom of the page, append your handle if you contributed to it.
5. Run `npm run build` and make sure it passes and your links work.
6. Open a pull request.

# Notes

- AI submissions are allowed, as long as all the information is correct and not hallucinated, and follows [RULES](RULES.md) properly.
- Small fixes (typos, grammar, broken links, etc) are welcomed ^^

---

> - Built by claude
> - Authored by @MSOB7YY
