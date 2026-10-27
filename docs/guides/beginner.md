---
title: "Beginner Guides"
description: "Quick fixes and everyday tasks"
---

# Beginner Guides

### An artist, genre or album name gets split {#separator-blacklist}

An artist like "Tyler, The Creator" showing as two artists? The comma separator is splitting it.

1. Open [`⚙️ Configure Separators ↗`](/settings/2-indexer-settings/#separators) and pick a type (Artists / Genres / Albums).
2. Type the full name (the preview shows how it gets split) and tap Blacklist.

### Some artworks are wrong {#wrong-artworks}

Two different tracks share the same filename, so they share the same artwork.

1. Enable [`⚙️ Configure Unique Artwork Hash ↗`](/settings/2-indexer-settings/#unique-artwork-hash), artworks will be identified by the track's full path instead.
2. Clear the image cache and refresh, see [`⚙️ Open Clear Caches ↗`](/settings/8-advanced-settings/#clear-caches).

### Some tracks in an album are missing artwork {#album-artworks}

1. Enable [`⚙️ Configure Group Artworks by Album ↗`](/settings/2-indexer-settings/#group-artworks-by-album), the whole album shares one artwork.

No artwork in the files at all? Put a `cover.jpg` (or `folder.jpg`) in the album folder, tracks without embedded artwork use it.

### Stop after the current track {#stop-after-track}

1. Open the current track's dialog (tap the player info text / tap the menu in a track tile / long press the video card).
2. Choose "Stop after this track".

Stop after this track can also be an artwork gesture, a notification button on Android, or `Ctrl` + `Space` on desktop. `🆕 v8.2.0` [`⚙️ Configure Artwork Gestures ↗`](/settings/4-customization-settings/#miniplayer-customization) [`🎉 Shortcuts feature ↗`](/features/shortcuts/#playback)

### Change or fix lyrics {#change-lyrics}

1. Long press the lyrics icon in the player.
2. From there you can pick an LRC file, search for other lyrics, or change the lyrics offset if they are early or late. Tap the lyrics you want and press Save to use them (the ones in use are marked Active).
3. To fix the text or the timing of single lines, press their edit icon, see [`🎉 Lyrics Editor ↗`](/features/lyrics-editor/).
4. To save them inside the file, press Embed from their ⋮ menu.
   - Synced embedded lyrics are used first, change it from "Prefer embedded lyrics" at the top. `🆕 v8.2.0`
5. Wrong lyrics keep getting fetched? Press Ignore from the ⋮ menu of the cached ones, they get hidden and won't be fetched again for this track. `🆕 v8.2.0`
6. To force no lyrics for a track, start its embedded lyrics tag with `IGNORE`, see [`⚙️ Configure Lyrics ↗`](/settings/6-extras-settings/#lyrics).

Added lyrics but the old ones keep showing? A cached copy is winning, see [`📄 I added lyrics but they don't show ↗`](/faq/#lyrics-not-showing).

### Sync lyrics yourself {#sync-lyrics}

`🆕 v8.2.0`

1. Play the track, then long press the lyrics icon in the player.
2. Press Add, paste the lyrics and press Save (or press the edit icon on plain lyrics you already have).
3. Tap the first line, play, and press Sync each time a line starts.
4. Press Save at the top.

For word by word sync, duets, translations and more, see [`🎉 Lyrics Editor ↗`](/features/lyrics-editor/).

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
