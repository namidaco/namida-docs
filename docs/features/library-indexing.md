---
title: "Library & Indexing"
description: "A powerful folder based music library"
---

# Library & Indexing

Namida builds your library from the folders you choose, with a powerful indexer powered by `taglib`.

### Folder Based Library {#folders}

Add the folders you want, exclude the ones you don't. The Folders tab browses your library like a file manager, with support for `cover.jpg` style images and `.info.txt` files for small notes. [`⚙️ Configure Folders ↗`](/settings/2-indexer-settings/#folders-to-scan)

### Separators {#separators}

A tag holding multiple values gets split into separate entries, so a track shows under each of its artists, albums, genres and so on:

- Artists, album artists and composers use the artists separators.
- Genres and styles use the genres separators.
- Moods and tags use both, plus `;` `,` `//` `\\`.
- Albums use the albums separators, only the non-breaking space (NBSP) by default.

You control all the separators and their blacklisted words. Featured artists in titles can also get their own entry. [`⚙️ Configure Separators ↗`](/settings/2-indexer-settings/#separators) [`📒 Blacklist Guide ↗`](/guides/beginner/#separator-blacklist)

### Filtering {#filtering}

Prevent duplicated tracks, set minimum file size & duration, blacklist extensions and respect `.nomedia`. [`⚙️ Configure Indexer ↗`](/settings/2-indexer-settings/)

### Videos {#videos}

Videos are indexed and playable on their own, with a dedicated videos folder view. [`⚙️ Configure Include Videos ↗`](/settings/2-indexer-settings/#include-videos)

### Missing Tracks {#missing-tracks}

If you moved or renamed files outside Namida, the missing tracks page helps you relink them without losing stats and listens. Whole directories can be updated at once with [`⚙️ Open Update Directory Path ↗`](/settings/8-advanced-settings/#update-directory-path). [`⚙️ Configure Missing Tracks ↗`](/settings/2-indexer-settings/#missing-tracks)

### Sorting & Grouping {#sorting}

Sort by almost any property of the track or the album. Most pages allow picking more than one sorter and reordering them, so you can sort by artist, then year, then title.
Albums can be identified by name alone or combined with album artist or year, and common prefixes like "The" can be ignored while sorting.

Albums, artists, genres and playlists can use several sorters too, from Advanced in their sort menu. Sort menus also have quick Reverse Order, Ignore prefixes and Romanization toggles. `🆕 v7.8.0`

Text sorting ignores accents and reads numbers by their value, so `Ànteros` sits next to `Anteros`, and `2.mp3` comes before `10.mp3`. This applies to every text sort, including playlists and folders. `🆕 v7.4.0`

Non latin titles and artists can also be sorted by their romanized form. [`⚙️ Configure Romanization ↗`](/settings/6-extras-settings/#romanization)

### File Dates {#file-dates}

Date Added and Date Modified come from the file itself. They decide the date sorts, [smart playlist](/features/smart-playlists/#date-rules) date rules, and Recently Added on the Home page (where a file that was just changed jumps to the top).

So Namida can keep file dates:

- **Tag editor**, "Keep file dates" is on by default. Turn it off and edited files get today's date. [`🎉 Keep File Dates ↗`](/features/tag-editor/#keep-file-dates)
- **Rating, moods and tags** from the track menu always keep them.
- **YouTube downloads**, "Set file last modified as video upload date" dates files by the video, so old videos don't flood Recently Added. [`🎉 Downloads ↗`](/features/youtube/#downloads)

Files copied with a tool that doesn't keep dates look newly added too.

::: callout info
Edited a file in another app that kept its dates? Refresh might miss it, re-index the track from its menu -> Advanced.
:::

### Media Servers {#media-servers}

Your library is not limited to local files, servers can be indexed too, see the [`🎉 Media Servers feature ↗`](/features/media-servers/).

---

### Related Settings {#related-settings}

- [⚙️ Indexer Settings](/settings/2-indexer-settings/)
- [⚙️ Advanced, Update Directory Path](/settings/8-advanced-settings/#update-directory-path)

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
