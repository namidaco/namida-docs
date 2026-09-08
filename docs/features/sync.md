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

One device starts a server, other devices on the same network discover it and request to connect. The server accepts, rejects or blocks each device. Once connected, you can send and receive data with that device, or all devices at once. [`⚙️ Open Sync ↗`](/settings/7-backup-restore-settings/#sync) [`📒 Sync Guide ↗`](/guides/medium/#sync-devices)

### What Gets Synced {#data}

You choose the data to send & receive, every item can be turned on and off on its own.

On by default:

- Track stats & favourites, for local and YouTube separately
- Audio configs, the per item sound settings
- History, for local and YouTube, merged without duplicated listens
- Playlists & smart playlists, plus your YouTube playlists
- Saved queues
- Last played track per source
- Cached videos priority
- YouTube subscriptions, with their groups

Off by default, they carry a lot of files and can be slow:

- Lyrics
- Audio & video cache files
- Playlist, album and artist artworks
- YouTube thumbnails, videos and channels

Off by default for another reason, they take over playback on the other device:

- The currently playing queue with its position
- Playback state

::: callout tip
Turn on the advanced view in the Sync page to see every item separately instead of the short list.
:::

### Smart Matching {#matching}

Your devices don't need identical file paths. Tracks are matched across devices using fingerprints, so stats and listens land on the right files even when libraries live in different folders. If something still ends up with a wrong path, it's an easy fix. [`📒 Path Problems Guide ↗`](/guides/medium/#sync-path-problems)

### Conflict Resolution {#conflicts}

Newest change wins for most data, while history and playlists use their own merge logic, added items are combined and duplicates are dropped.

### Auto Sync {#auto-sync}

Set an auto sync interval and let devices sync on their own whenever they see each other, with auto reconnect.

### Devices {#devices}

Devices show up by the name they broadcast, so you always know what you are sending to. You can rename your own device while the server is running, press the edit icon beside it and the new name is broadcasted right away.

Devices you don't want around can be blocked instead of just rejected, they can no longer reach you and they stop asking. Blocked devices are listed in their own section, with an unblock button.

---

### Related Settings {#related-settings}

- [⚙️ Backup & Restore, Sync](/settings/7-backup-restore-settings/#sync)

---

<sub>by @claude</sub>
