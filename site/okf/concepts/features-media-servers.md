---
type: concept
title: "Media Servers"
description: "Index your servers like normal folders"
source: "https://namidaco.github.io/namida_docs/features/media-servers/"
path: /features/media-servers/
updated: 2026-08-27
okf:
  generated_by: "@docmd/plugin-okf"
  generated_at: "2026-08-27T01:50:02.656Z"
---
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

[`⚙️ List of Folders ↗`](/settings/2-indexer-settings/#folders-to-scan)

A server is added as a library folder in the indexer. Enter the server address and credentials, pick a library or share if the server supports it, and Namida indexes it like any other folder. Tracks appear next to your local ones in every tab.

::: callout info
For file based servers (WebDAV, SMB), files are temporarily downloaded for indexing. Make sure your connection is stable, Wi-Fi is recommended to avoid high data usage.
:::

### Server Playlists {#playlists}

Playlists from your servers can be auto imported on library refresh, see [Playlists & History](/features/playlists-history/#playlists).

### Related Settings {#related-settings}

- [Indexer, List of Folders](/settings/2-indexer-settings/#folders-to-scan)

---

<sub>by @claude</sub>
