---
type: concept
title: Indexer
description: "Manage your music Library"
source: "https://namidaco.github.io/namida_docs/settings/2-indexer-settings/"
path: /settings/2-indexer-settings/
version: v6.5.0
updated: 2026-08-29
okf:
  generated_by: "@docmd/plugin-okf"
  generated_at: "2026-08-29T01:43:41.452Z"
---
---
title: "Indexer"
description: "Manage your music Library"
---

# Indexer

Controls how Namida finds and reads your music files. The library is folders based, Namida scans only the folders you choose.

### List of Folders {#folders-to-scan}

The folders that Namida scans for music. You can add local folders, or a media server (Subsonic, Jellyfin, WebDAV, SMB) to index it like a normal folder, see [Media Servers](/features/media-servers/).

### Excluded Folders {#excluded-folders}

Folders that will be skipped while scanning, useful for excluding notification sounds or recordings folders.

### Prevent Duplicated Tracks {#prevent-duplicated-tracks}

Uses filename to uniquely identify tracks, so the same file existing in two folders will show once.

### Respect .nomedia {#respect-nomedia}

Skips folders that contain a `.nomedia` file.

### Extract feat. Artists {#extract-feat-artists}

Extracts (feat. X) and (ft. X) artists from the title, as a new artist entry. You will find the featured artists in the [Artists tab](/pages/library/#artists).

### Enable Artwork Cache {#artwork-cache}

Faster loading and improved performance, but uses more storage.

### Group Artworks by Album {#group-artworks-by-album}

Saves one artwork per album instead of one per track, saves storage.

### Unique Artwork Hash {#unique-artwork-hash}

Identifies artworks by their track's full path instead of just filename. Enable this if you see wrong duplicated artworks.

### Album Identifiers {#album-identifiers}

Choose which fields identify an album. By default the Album name + Album's Artist name, you can add Year, MusicBrainz Album ID or MusicBrainz Album Artist ID to separate albums that share the same name.

### Artists & Genres Separators {#separators}

Symbols and words used to split multiple artists or genres from a single tag, like `,` `;` `&` `ft.`. You can also blacklist words so they never get split.

::: callout tip
No need to insert spaces, unless you want a letter or symbol that can be found in a whole word (like `x` and `ft.`).
:::

### Extension (Blacklist) {#extensions-blacklist}

File extensions that will not be indexed.

### Minimum File Size & Track Duration {#minimum-size-duration}

Files smaller or shorter than these values will be skipped, useful for filtering out voice notes and notification sounds.

### Use Media Store {#use-media-store}

`Android only`

Uses the Android system index instead of Namida's own indexer. Instant indexing time, but some metadata tags will be missing, `.nomedia` is forcefully respected, and YouTube integration for local library will not work.

::: callout warning "Deprecated"
This feature is removed as of v6.5.5. With the new tagger (`taglib`) being stable and fast, and with this option lacking critical aspect of Namida and many users reporting issues after manually enabling and forgetting it, It is no longer required to keep this feature.
:::

### Include Videos {#include-videos}

Index video files as well, videos get their own folders view and can be played independently.

### Refresh on Startup {#refresh-on-startup}

Automatically checks for newly added or deleted files on every app start.

### Missing Tracks {#missing-tracks}

Lists tracks that no longer exist on storage, you can update their paths to keep stats and listens, see [Library & Indexing](/features/library-indexing/).

### Refresh Library & Re-index {#refresh-reindex}

Refresh checks for newly added or deleted music. Re-index rebuilds the whole library from scratch, artworks are kept as long as they still exist.

---

<sub>by @claude</sub>
