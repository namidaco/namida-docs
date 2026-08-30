---
type: concept
title: Extras
description: "Extra settings to fine-tune your experience"
source: "https://namidaco.github.io/namida-docs/settings/6-extras-settings/"
path: /settings/6-extras-settings/
version: v6.5.0
updated: 2026-08-30
okf:
  generated_by: "@docmd/plugin-okf"
  generated_at: "2026-08-30T21:51:03.653Z"
---
---
title: "Extras"
description: "Extra settings to fine-tune your experience"
---

# Extras

Library tabs, search, lyrics and other options.

### Use Collapsed Setting Tiles {#collapsed-tiles}

Show settings sections in a single list instead of each in a subpage.

### Enable Bottom Navigation Bar {#bottom-nav-bar}

Quick navigation between library tabs, the items stay inside the drawer both ways.

### Enable Picture-in-Picture {#pip}

`💻 Android only`

Keep the video playing in a small floating window when leaving the app.

### Floating Action Button {#fab}

Choose what the floating button does, like search, play or shuffle, or hide it.

### Default Library Tab {#default-library-tab}

The tab the app opens on.

### Library Tabs {#library-tabs}

Choose which tabs are enabled (tracks, albums, artists, genres, playlists, folders and more), you can reorder the activated tabs.

### Filter Tracks in Search Lists By {#filter-tracks-by}

Which fields search looks into: title, artist, album, filename, comment, even lyrics and more.

### Ignore Common Prefixes While Sorting {#ignore-prefixes}

Ignores prefixes like "The" and "A" while sorting.

### Enable Search Cleanup {#search-cleanup}

All symbols and spaces will be ignored while searching, makes matching easier.

### Lyrics {#lyrics}

- Prioritize embedded lyrics over fetched ones.
- Lyrics source, auto, local only or internet only.
- Stretch lyrics duration.
  - useful to automatically adapt duration on spedup/slowed/nightcore versions.

How lyrics are found: Namida looks for synced lyrics first, previously saved lyrics, then `.lrc` files next to the track, then the embedded lyrics tag, then online databases. If no synced lyrics are found, it repeats the same order for plain lyrics, ending with a web search. Local and internet steps can be limited with the source setting above.

::: callout tip
Start the embedded lyrics tag with `IGNORE` to explicitly show no lyrics for that track.
:::

### Image Source {#image-source}

Where album and artist images come from, with separate lists for albums and artists.

### Immersive Mode {#immersive-mode}

`💻 Android only`

Hide status & navigation bars while the miniplayer is expanded.

### Swipe to Open Drawer {#swipe-drawer}

### Always Expanded Searchbar {#expanded-searchbar}

### Enable Clipboard Monitoring {#clipboard-monitoring}

Allows pasting links and texts inside the searchbar on the go.

### Vibration Type {#vibration}

`💻 Android only`

Vibration or haptic feedback for some actions, or none.

::: callout info
Vibration/Haptic feedback is not for everything, only selective actions, like: Miniplayer expanding, seek magnet (when seeking near the starting edge), seek cancel (when swiping up), tapping duration in video description, executing track swipe action, long press play next/play last, long press folder menu (opens all tracks inside recursively), rebuilding queue without changing item playing.
:::

### Extract All Color Palettes {#extract-palettes}

Extracts colors for the whole library at once instead of on play, used by [Auto Coloring](/settings/1-theme-settings/#auto-coloring).

### Flags {#flags}

Hidden experimental options, opened by pressing the flag icon at the top of the Extras settings card:

- `TAP_TO_SCROLL`, `ENHANCED_DRAG_TO_SCROLL` & `SMOOTH_SCROLLING`, scrolling behavior tweaks.
- `FLOATING_ARTWORK_EFFECT` & `TILTING_CARDS_EFFECT`, extra visual effects.
- `GRADIENT_TILES_AND_CARDS`, gradient backgrounds for tiles and cards.
- `MEDIA_WAVE_HAPTIC`, haptics that follow the audio.
- `SHOW_DESKTOP_TITLE_BAR` & `DESKTOP_TITLE_BAR_ICONS_TYPE`, title bar look on desktop.
- `YT_STYLE_PLAYER_BUTTON_SWITCHER`, shows a button to switch between local style player and youtube style player.
- `CUSTOM_EQ_PACKAGE`, open a custom equalizer app instead of the system built-in one.
- `VISUAL_TO_AUDIO_DELAY`, offset visuals to compensate audio latency.
- `TIME_CAPSULE_YEARS`, travel back in time, or into the future.
- `PREFERRED_SEARCH_TAB`, the tab search opens on.

::: callout info
Flags are experimental, defaults are fine for most people.
:::

---

<sub>by @claude</sub>
