# Namida Docs

Documentation site for [namida](https://github.com/namidaco/namida), built with [docmd](https://github.com/docmd-io/docmd).

## Run locally

```bash
npx @docmd/core dev
```

## Structure

```
docs/
├── index.md          # home page
├── tips.md           # tips & tricks
├── faq.md            # frequently asked questions
├── features/         # one file per feature
├── pages/            # tour of in-app pages
└── settings/         # one file per settings section, numbered by in-app order
docmd.config.json     # site config + sidebar navigation
RULES.md              # writing & style rules
```

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
