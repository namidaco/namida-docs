---
title: "Extras"
description: "Extra settings to fine-tune your experience"
---

# Extras

Library tabs, search, lyrics and other options.

### Use Collapsed Setting Tiles {#collapsed-tiles}

Show all settings sections in a single list, instead of opening each one in its own page.

### Enable Bottom Navigation Bar {#bottom-nav-bar}

Quick navigation between library tabs. The tabs stay in the drawer either way.

### Enable Picture-in-Picture {#pip}

`💻 Android only`

Keep the video playing in a small floating window when leaving the app.

### Floating Action Button {#fab}

Choose what the floating button does, like search, play or shuffle, or hide it.

### Default Library Tab {#default-library-tab}

The tab the app opens on.

### Library Tabs {#library-tabs}

Choose which tabs are enabled (tracks, albums, artists, genres, playlists, smart playlists, folders, the current queue, stats, listening party and more), you can reorder them too. [`📄 Library Pages ↗`](/pages/library/)

Tracks and Folders have variants, audio only or videos only for Tracks, music or videos for Folders. Tracks variants show only when [Include Videos](/settings/2-indexer-settings/#include-videos) is on. Variants of the same tab share a single slot in the navigation bar, long press it to switch between them, or press the arrow beside it in the side menu. `🆕 v7.4.0`

### Filter Tracks in Search Lists By {#filter-tracks-by}

Which fields search looks into: title, artist, album, filename, comment, even lyrics and more.

### Ignore Common Prefixes While Sorting {#ignore-prefixes}

Ignores prefixes like "The" and "A" while sorting.

### Enable Search Cleanup {#search-cleanup}

Ignores symbols and spaces while searching, so matches are easier to find.

### Lyrics {#lyrics}

- Lyrics source, auto, local only or internet only.
- Romanization, see [below](#romanization). `🆕 v7.4.0`
- Prioritize embedded lyrics over fetched ones.
- Stretch lyrics duration, adapts the timing for sped up, slowed or nightcore versions.
- Simple Lyrics Line, display the current lyrics line under the artwork. `🆕 v7.0.0`
  - Shows translations and romanizations under each line, and word synced lyrics light up word by word like in the lyrics view. `🆕 v7.5.0`
- Lyrics save location & Lyrics folders, see [below](#lyrics-save-location). `🆕 v7.5.0`

How lyrics are found: Namida looks for synced lyrics first, checking saved lyrics (the cache, files next to the track and your [lyrics folders](#lyrics-folders)), then the embedded lyrics tag, then plain `.txt` lyrics, then online databases, ending with a web search for plain lyrics. The lyrics source above limits this to only the local steps or only the internet steps.

Files next to the track can be `.lrc`, `.ttml`, `.txt` or subtitle files (`.srt`, `.vtt`, `.sbv`, `.ssa`, `.ass`), as long as they share the track's filename. Online databases are LRCLIB and KuGou. When both find lyrics, the one closest to the track duration is used, and the lyrics menu shows where each one came from.

::: callout tip
Start the embedded lyrics tag with `IGNORE` to explicitly show no lyrics for that track.
:::

Once lyrics are found they get saved, in the cache by default, and the saved copy is used first from then on. If lyrics you added later don't show up, delete the saved one, see [`📄 I added lyrics but they don't show ↗`](/faq/#lyrics-not-showing).

### Romanization {#romanization}

`🆕 v7.4.0`

Read non latin text in latin letters. Found inside the Lyrics card, press it to open the options:

- **Romanization: Lyrics**, adds the romanized text under each synced lyrics line. Plain lyrics are not romanized.
- **Romanization: Sort by**, text sorts use the romanized text, so a Japanese title like `さくら` sorts under S. [`🎉 Sorting ↗`](/features/library-indexing/#sorting)
- **Dictionary**, needed for Japanese kanji and Chinese characters. It's a one time download, and turning on either option downloads it automatically. Press it again to delete it.

Supported: Japanese (hiragana, katakana, kanji), Chinese, Korean, Greek, Cyrillic, Armenian and Georgian.
Dictionary is only needed for kanji and Chinese.

::: callout info
Lyrics that contain any Japanese kana are read as Japanese, otherwise Chinese characters become pinyin.
:::

### Lyrics Save Location {#lyrics-save-location}

`🆕 v7.5.0`

Where lyrics you add or that get fetched are saved: Cache (default), Track folder, or Lyrics folders. They are saved as `.lrc` for synced lyrics or `.txt` for plain ones, named like the track. If the location can't be written to, the cache is used.

The saved location is checked first when looking for lyrics, so your edits always win.

Press the trash icon beside a location to delete lyrics there when you delete a track from Namida. Lyrics that another track uses are kept.

### Lyrics Folders {#lyrics-folders}

`🆕 v7.5.0`

Extra folders to look for lyrics in, matched by track filename. Inside a lyrics folder, Namida first looks in the same subfolders your library has, then directly inside it. For example, with `Music` in your [library folders](/settings/2-indexer-settings/#folders-to-scan), `Music/Artist/song.mp3` finds `Lyrics/Artist/song.lrc` or `Lyrics/song.lrc`.

When Lyrics folders is the save location, lyrics are saved in the first folder, keeping your library's subfolders.

### Image Source {#image-source}

Where album and artist images come from, with separate lists for albums and artists.

### Immersive Mode {#immersive-mode}

`💻 Android only`

Hide status & navigation bars while the miniplayer is expanded.

### Swipe to Open Drawer {#swipe-drawer}

Open the side menu by swiping anywhere on the screen (like the app bar and navigation bar).

### Always Expanded Searchbar {#expanded-searchbar}

Keep the searchbar open instead of collapsing it into an icon.

### Enable Clipboard Monitoring {#clipboard-monitoring}

Links and text you copy can show up right in the searchbar.

### Vibration Type {#vibration}

`💻 Android only`

Vibration or haptic feedback for some actions, or none.

::: callout info
Vibration/Haptic feedback is only used for selected actions: expanding the miniplayer, seek magnet and seek cancel, tapping a duration in a video description, track swipe actions, long pressing play next/play last, long pressing a folder menu (opens all tracks inside), and rebuilding the queue without changing the playing item.
:::

### Extract All Color Palettes {#extract-palettes}

Extracts colors for the whole library at once, instead of when each track plays. Used by [Auto Coloring](/settings/1-theme-settings/#auto-coloring).

### Flags {#flags}

Hidden experimental options. Press the flag icon at the top of the Extras settings card to open them:

- `TAP_TO_SCROLL`, `ENHANCED_DRAG_TO_SCROLL` & `SMOOTH_SCROLLING`, scrolling behavior tweaks.
- `FLOATING_ARTWORK_EFFECT` & `TILTING_CARDS_EFFECT`, extra visual effects.
- `GRADIENT_TILES_AND_CARDS`, gradient backgrounds for tiles and cards.
- `MEDIA_WAVE_HAPTIC`, haptics that follow the audio.
- `JELLYS_INVASION` & `JELLYS_COLOR_PALETTE`, lets jellyfishes drift around the app, with a matching color palette. Can also be toggled from the jellyfish button in the theme settings.
- `KEEP_VIDEO_FRAME_ON_SWITCH`, when switching to an item whose video is already downloaded, keep the last video frame until the next one shows, instead of flashing the artwork in between. `🆕 v7.4.0`
- `SHOW_DESKTOP_TITLE_BAR` & `DESKTOP_TITLE_BAR_ICONS_TYPE`, title bar look on desktop.
- `YT_STYLE_PLAYER_BUTTON_SWITCHER`, shows a button to switch between the local style and YouTube style player.
- `RECENT_SEARCHES`, saves your searches and shows them in the search page.
- `RESUME_UI`, the resume button and the highlight on the last played item in pages like albums, playlists and queues. On by default, turn it off to hide both and stop tracking where you left off. `🆕 v7.4.0`
- `CUSTOM_EQ_PACKAGE`, open a custom equalizer app instead of the system built-in one.
- `VISUAL_TO_AUDIO_DELAY`, shift the visuals to make up for audio delay.
- `TIME_CAPSULE_YEARS`, travel back in time, or into the future.
- `PREFERRED_SEARCH_TAB`, the tab search opens on.

::: callout info
Flags are experimental, defaults are fine for most people.
:::

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
