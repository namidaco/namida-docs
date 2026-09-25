---
title: "Playlists & History"
description: "Flexible playlists and a reliable history system"
---

# Playlists & History

### Playlists {#playlists}

Normal playlists with custom order and the ability to set custom artworks. Also:

- M3U playlists, import them or keep them synced with the original file, so changes made in Namida show up in other apps too. Any playlist can be converted to M3U and back, or exported once. M3U files only show up if their folder is in the indexer folders.
  - Sharing a playlist as a file isn't possible, send its M3U file with apps like [Syncthing](https://f-droid.org/en/packages/com.github.catfriend1.syncthingfork/) or [LocalSend](https://localsend.org) instead. Converted playlists are saved in [Namida Folder](/storage-paths/#namida-folder)`/M3U Playlists`. [`📒 Syncing Playlists Guide ↗`](/guides/medium/#sync-path-problems)
  - Between Namida devices, Sync can send your playlists too, they arrive as normal playlists instead of M3U. [`🎉 Sync feature ↗`](/features/sync/#data)
- Server playlists, auto import playlists from configured music web servers (Jellyfin, Subsonic/Navidrome and others) on library refresh.
- Custom order for playlists, press the edit icon at the top to enable reordering.
- Custom order for playlist tracks, press the lock icon at the top to enable reordering or removing. If a playlist has active sorters, disable them first to reorder manually.
- Playlists can be searched, and can have moods, which the queue uses when adding tracks by mood.

::: callout warning
Sorting tracks by a property means your custom order will be lost. You will see a warning, and you need to confirm before the new sort is applied.
:::

Also see the [`🎉 YouTube feature ↗`](/features/youtube/#playlists) for how local and YouTube playlists relate.

### Smart Playlists {#smart-playlists}

Playlists built from rules instead of manual picking, they update themselves as your library and history change. Combine conditions like contains, starts with, is greater than, is within last, is between dates, and apply them to almost any property: artist, genre, rating, year, listen count, favourite status and more. Text rules suggest values from your library as you type.
They also have their own full page, reachable from the playlists page, where you can reorder them. [`📒 Smart Playlist Examples Guide ↗`](/guides/medium/#smart-playlist-examples)

Their tracks are found only when you open them, and tracks can't be added to them manually, so they are kept apart from normal playlists. [`📄 Why aren't smart playlists treated as normal playlists? ↗`](/faq/#smart-playlists)

### History {#history}

A reliable and flexible history system. You choose the minimum seconds or percentage that counts as a listen. History can be imported from other services, and listens can be replaced, never deleted. [`⚙️ Configure Listen Counting ↗`](/settings/3-playback-settings/#count-listen-after)

Open a track's listens dialog to see every single listen. Tap a listen to jump to that exact day in history, or use the button beside it to open Most Played for that time range.

[`📄 History Tips ↗`](/tips/#history-tips)

### Most Played {#most-played}

Find your top tracks based on your history record, with a custom time range to see your most beloved tracks at that time.

- Use the slider to move between adjacent periods.
- Pick a single day with a days radius around it, to see what you were into around that day.
- Ranges can be day based or clock based. Day based starts from the beginning of the day, clock based counts back from the current time.

### Stats & Your Year {#stats}

`🆕 v7.0.0`

Charts built from your history, and a yearly wrap up. See [`📄 Stats Page ↗`](/pages/other/#stats) and [`📄 Your Year Page ↗`](/pages/other/#your-year). Any album, artist, playlist or folder dialog also has a Stats entry with listen stats for just those tracks.

### Lost Memories {#lost-memories}

Meet the tracks you listened to around this time, but N years ago.

### Smort Tracks Generation {#generation}

Generate tracks related to the current one, typically the ones you often listened to in the same period, based on your history. You can also generate from a time range, moods, ratings, similar release date, or randomly.

### History Import {#import}

Import your listening history from YouTube, LastFm, Spotify and ListenBrainz exports, everything gets merged into your Namida history. [`⚙️ Configure Imports ↗`](/settings/7-backup-restore-settings/#import-youtube-history)

The Home page rebuilds itself once the import is done, so mixes and recent listens include what you just imported.

---

### Related Settings {#related-settings}

- [⚙️ Playback, Count a Listen After](/settings/3-playback-settings/#count-listen-after)
- [⚙️ Backup & Restore, History Imports](/settings/7-backup-restore-settings/#import-youtube-history)
- [⚙️ Advanced, Remove Source from History](/settings/8-advanced-settings/#remove-source-history)

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
