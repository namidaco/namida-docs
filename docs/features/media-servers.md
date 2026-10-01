---
title: "Media Servers"
description: "Index your servers like normal folders"
---

# Media Servers

Multi library support, your library can mix local files with content from your servers.

### Supported Servers {#supported}

- Subsonic (including Navidrome and compatible servers)
- Jellyfin
- WebDAV
- SMB (network shares)

### How It Works {#how}

A server is added as a library folder in the indexer. Enter the server address and credentials, pick a library or share (if the server supports it), and Namida indexes it like any other folder. Tracks appear next to your local ones in every tab. [`⚙️ Configure Folders ↗`](/settings/2-indexer-settings/#folders-to-scan)

For Subsonic servers, tracks without their own artwork fall back to the album artwork.

::: callout info
File based servers (WebDAV, SMB) download files temporarily for indexing. Use a stable connection (preferably Wi-Fi to avoid high data usage).
:::

### Server Playlists {#playlists}

Playlists from your servers can be auto imported on library refresh, see the [`🎉 Playlists & History feature ↗`](/features/playlists-history/#playlists).

### Offline Caching {#offline-caching}

`🆕 v7.4.0`

Keep server tracks on your device to play them offline. Open the menu of a track, an album, a playlist or a selection, and press "Cache". The original file is saved, even when the server streams a transcoded version (like Subsonic can).

- Server tracks that aren't cached yet show a small download icon on their artwork.
- While caching, the artwork shows a progress ring, and an icon appears in the app bar. Press it for the list of tasks, where you can pause, resume, retry or cancel them.
- On Android, a notification shows the progress. 
- On Windows and Linux, the notification when it's done follows [`⚙️ Download notifications ↗`](/settings/5-youtube-settings/#downloads).
- Tasks without a connection wait and continue once it's back.

Cached tracks play from the device, even offline. Most streamed tracks are kept too (they get cleaned up once the server cache is full), but the ones you cached yourself are never deleted automatically. [`⚙️ Configure Server Cache ↗`](/settings/8-advanced-settings/#cache-limits)

::: callout info
The server cache sits in [User Data](/storage-paths/#user-data)`/Servers Cache`. To remove a single track from it, open its menu, then Advanced, then Clear.
:::

---

### Related Settings {#related-settings}

- [⚙️ Indexer, List of Folders](/settings/2-indexer-settings/#folders-to-scan)
- [⚙️ Advanced, Cache Limits](/settings/8-advanced-settings/#cache-limits)
- [⚙️ Advanced, Clear Caches](/settings/8-advanced-settings/#clear-caches)

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
