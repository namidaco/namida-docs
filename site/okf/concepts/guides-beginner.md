---
type: guide
title: "Beginner Guides"
description: "Quick fixes and everyday tasks"
source: "https://namidaco.github.io/namida-docs/guides/beginner/"
path: /guides/beginner/
version: v6.5.0
updated: 2026-08-30
okf:
  generated_by: "@docmd/plugin-okf"
  generated_at: "2026-08-30T21:51:03.636Z"
---
---
title: "Beginner Guides"
description: "Quick fixes and everyday tasks"
---

# Beginner Guides

### An artist or genre name gets split {#separator-blacklist}

An artist like "Tyler, The Creator" showing as two artists? The comma separator is splitting it.

1. Open [`⚙️ Configure Separators ↗`](/settings/2-indexer-settings/#separators).
2. Open the blacklist and add the full name.
3. Refresh the library.

### Some artworks are wrong {#wrong-artworks}

Two different tracks share the same filename, so they share the same artwork.

1. Enable [`⚙️ Configure Unique Artwork Hash ↗`](/settings/2-indexer-settings/#unique-artwork-hash), artworks will be identified by the track's full path instead.
2. Clear the image cache and refresh, see [`⚙️ Open Clear Caches ↗`](/settings/8-advanced-settings/#clear-caches).

### Some tracks in an album are missing artwork {#album-artworks}

1. Enable [`⚙️ Configure Group Artworks by Album ↗`](/settings/2-indexer-settings/#group-artworks-by-album), the whole album shares one artwork.

### Stop after the current track {#stop-after-track}

1. Open the current track's dialog (tap the player info text, or tap menu in track tile, or long press the video card).
2. Choose "Stop after this track".

### Change or fix lyrics {#change-lyrics}

1. Long press the lyrics icon in the player.
2. From there you can pick an LRC file, search for other lyrics, or change the lyrics offset if they are early or late.
3. To force no lyrics for a track, start its embedded lyrics tag with `IGNORE`, see [`⚙️ Configure Lyrics ↗`](/settings/6-extras-settings/#lyrics).

---

<sub>by @claude</sub>
