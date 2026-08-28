---
type: concept
title: Sync
description: "Sync app data between your devices"
source: "https://namidaco.github.io/namida_docs/features/sync/"
path: /features/sync/
updated: 2026-08-27
okf:
  generated_by: "@docmd/plugin-okf"
  generated_at: "2026-08-27T01:50:02.660Z"
---
---
title: "Sync"
description: "Sync app data between your devices"
---

# Sync

Sync your Namida data between devices over the local network, no cloud involved. Works across Android, Windows and Linux.

::: callout info
Sync is a new feature and still evolving, both devices must run the same Namida version.
:::

### How It Works {#how}

[`⚙️ Sync ↗`](/settings/7-backup-restore-settings/#sync)

One device starts a server, other devices on the same network discover it and request to connect. The server accepts, rejects or blocks each device. Once connected, you can send and receive data with that device, or all devices at once.

### What Gets Synced {#data}

You choose the data to send & receive:

- Track stats, favourites and audio configs
- Playlists & smart playlists, with their artworks
- History, merged smartly without duplicated listens
- Queues, including the currently playing queue with its position
- Lyrics, artworks and thumbnails
- Audio & video cache files
- YouTube playlists, history, likes and subscriptions

### Smart Matching {#matching}

Your devices don't need identical file paths. Tracks are matched across devices using fingerprints, so stats and listens land on the right files even when libraries live in different folders.

### Conflict Resolution {#conflicts}

Newest change wins for most data, while history and playlists use their own merge logic, added items are combined and duplicates are dropped.

### Auto Sync {#auto-sync}

Set an auto sync interval and let devices sync on their own whenever they see each other, with auto reconnect.

### Related Settings {#related-settings}

- [Backup & Restore, Sync](/settings/7-backup-restore-settings/#sync)

---

<sub>by @claude</sub>
