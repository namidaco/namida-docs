---
type: concept
title: "Playlists & History"
description: "Flexible playlists and a reliable history system"
source: "https://namidaco.github.io/namida-docs/features/playlists-history/"
path: /features/playlists-history/
version: v6.5.0
updated: 2026-08-30
okf:
  generated_by: "@docmd/plugin-okf"
  generated_at: "2026-08-30T21:51:03.631Z"
---
---
title: "Playlists & History"
description: "Flexible playlists and a reliable history system"
---

# Playlists & History

### Playlists {#playlists}

Normal playlists with custom order and the ability to set custom artworks. Also:

- M3U playlists, import them natively or keep them synced with the original M3U file, so changes made in Namida reach other apps too. Any playlist can be converted to M3U and back, or exported as M3U one time. Make sure the folder holding your M3U files is in the indexer folders, so they show up.
- Server playlists, auto import playlists from configured music web servers (Jellyfin, Subsonic/Navidrome and others) on library refresh.
- Custom order for playlists, press the edit icon at the top to enable reordering.
- Custom order for playlist tracks, press the lock icon at the top to enable reordering or removing. If a playlist has active sorters, disable them first to reorder manually.
- Playlists can be filtered/searched, and can have moods, usable by the player's add tracks (mood) feature.

::: callout warning
Sorting tracks by a property means your custom order will be lost. You will see a warning, and approval is required before applying the new sort.
:::

Also see the [`🎉 YouTube feature ↗`](/features/youtube/#playlists) for how local and YouTube playlists relate.

### Smart Playlists {#smart-playlists}

Playlists built from rules instead of manual picking, they update themselves as your library and history change. Combine conditions like contains, starts with, is greater than, is within last, is between dates, and apply them to almost any property: artist, genre, rating, year, listen count, favourite status and more. [`📒 Smart Playlist Examples Guide ↗`](/guides/medium/#smart-playlist-examples)

### History {#history}

A reliable and flexible history system. You specify the minimum seconds or percentage to count a listen, and it can be easily modified, manipulated and imported. [`⚙️ Configure Listen Counting ↗`](/settings/3-playback-settings/#count-listen-after)

Open a track's listens dialog to see every single listen. Tap a listen to jump to that exact day in history, or use the button beside it to open Most Played for that time range.

[`📄 History Tips ↗`](/tips/#history-tips)

### Most Played {#most-played}

Find your top tracks based on your history record, with a custom time range to see your most beloved tracks at that time.

### Lost Memories {#lost-memories}

Meet the tracks you listened to around this time, but N years ago.

### Smort Tracks Generation {#generation}

Generate tracks related to the current one, typically the ones you often listened to in the same period, based on your history. You can also generate from a time range, moods, ratings, similar release date, or randomly.

### History Import {#import}

Import your listening history from YouTube, LastFm, Spotify and ListenBrainz exports, everything gets merged into your Namida history. [`⚙️ Configure Imports ↗`](/settings/7-backup-restore-settings/#import-youtube-history)

---

### Related Settings {#related-settings}

- [⚙️ Playback, Count a Listen After](/settings/3-playback-settings/#count-listen-after)
- [⚙️ Backup & Restore, History Imports](/settings/7-backup-restore-settings/#import-youtube-history)
- [⚙️ Advanced, Remove Source from History](/settings/8-advanced-settings/#remove-source-history)

---

<sub>by @claude</sub>
