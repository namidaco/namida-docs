---
type: concept
title: "Playlists & History"
description: "Flexible playlists and a reliable history system"
source: "https://namidaco.github.io/namida_docs/features/playlists-history/"
path: /features/playlists-history/
version: v6.5.0
updated: 2026-08-29
okf:
  generated_by: "@docmd/plugin-okf"
  generated_at: "2026-08-29T01:43:41.444Z"
---
---
title: "Playlists & History"
description: "Flexible playlists and a reliable history system"
---

# Playlists & History

### Playlists {#playlists}

Normal playlists with custom order and the ability to set custom artworks. Also:

- M3U playlists, import them natively or keep them synced with the original M3U file, so changes made in Namida reach other apps too. Any playlist can be exported as M3U.
- Server playlists, auto import playlists from configured music web servers (Jellyfin, Subsonic/Navidrome and others) on library refresh.
- Custom order for playlists, Press "edit icon" at top to enable reordering.
- Custom order for playlist tracks, Press "lock icon" at top to enable reordering or removing. If a playlist has active sorters, disable them first to reorder manually.

::: callout warning
Sorting tracks by a property means your custom order will be lost. you should see a warning and approval is required before applying the new sort.
:::

### Smart Playlists {#smart-playlists}

Playlists built from rules instead of manual picking, they update themselves as your library and history change. Combine conditions like contains, starts with, is greater than, is within last, is between dates, and apply them to almost any property: artist, genre, rating, year, listen count, favourite status and more.

### History {#history}

[`⚙️ Count a Listen After ↗`](/settings/3-playback-settings/#count-listen-after)

A reliable and flexible history system. You specify the minimum seconds or percentage to count a listen, and it can be easily modified, manipulated and imported.

Open a track's listens dialog to see every single listen. Tap a listen to jump to that exact day in history, or use the button beside it to open Most Played for that time range.

[`History Tips ↗`](/tips#history-tips)

### Most Played {#most-played}

Find your top tracks based on your history record, with a custom time range to see your most beloved tracks at that time.

### Lost Memories {#lost-memories}

Meet the tracks you listened to around this time, but N years ago.

### Smort Tracks Generation {#generation}

Generate tracks related to the current one, typically the ones you often listened to in the same period, based on your history. You can also generate from a time range, moods, ratings, similar release date, or randomly.

### History Import {#import}

[`⚙️ Import Settings ↗`](/settings/7-backup-restore-settings/#import-youtube-history)

Import your listening history from YouTube, LastFm, Spotify and ListenBrainz exports, everything gets merged into your Namida history.

---

### Related Settings {#related-settings}

- [Playback, Count a Listen After](/settings/3-playback-settings/#count-listen-after)
- [Backup & Restore, History Imports](/settings/7-backup-restore-settings/#import-youtube-history)
- [Advanced, Remove Source from History](/settings/8-advanced-settings/#remove-source-history)

---

<sub>by @claude</sub>
