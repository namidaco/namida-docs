---
title: "Storage Paths"
description: "Where Namida keeps its files on each platform"
---

# Storage Paths

Namida keeps its files in a few base folders. Each one is in a different place depending on the platform.

### User Data {#user-data}

Settings, playlists, history, queues, extracted artworks, lyrics, subtitles, logs and the image/audio/video caches. This is what backups read from.

| Platform           | Path                                                       |
| ------------------ | ---------------------------------------------------------- |
| Android            | `/storage/emulated/0/Android/data/com.msob7y.namida/files` |
| Windows            | `C:\Users\USERNAME\.namida`                                |
| Windows (portable) | `<namida folder>\files`                                    |
| Linux              | `~/.namida`                                                |

Notable subfolders: `Playlists`, `History`, `Queues`, `Artworks`, `Lyrics`, `Subtitles`, `Youtube`, `Recently Deleted`, `Logs`.

::: callout warning
On Android 11+ this folder is not reachable from a normal file manager. Use ADB or Shizuku if you need to open it directly.
:::

### Namida Folder {#namida-folder}

The user facing folder, everything Namida writes out for you to keep or move around.

| Platform           | Path                         |
| ------------------ | ---------------------------- |
| Android            | `/storage/emulated/0/Namida` |
| Windows            | `C:\Namida`                  |
| Windows (portable) | `<namida folder>\Namida`     |
| Linux              | `~/Namida`                   |

Subfolders: `Backups`, `Compressed`, `M3U Playlists`, `Artworks`, `Downloads`.

On Windows and Linux this sits on the first drive Namida detects, usually the one above.

`Backups` and `Downloads` are just defaults, both can be pointed anywhere you want. [`⚙️ Default Backup Location ↗`](/settings/7-backup-restore-settings/#backup-location) [`⚙️ Configure Downloads ↗`](/settings/5-youtube-settings/#downloads)

### App Cache {#app-cache}

Throwaway data like waveforms. Safe to delete, it gets rebuilt.

| Platform           | Path                                                       |
| ------------------ | ---------------------------------------------------------- |
| Android            | `/storage/emulated/0/Android/data/com.msob7y.namida/cache` |
| Windows            | `C:\Users\USERNAME\AppData\Local\com.msob7y\namida`        |
| Windows (portable) | `<namida folder>\cache`                                    |
| Linux              | `~/.cache/com.msob7y.namida`                               |

---

### Related Settings {#related-settings}

- [Default Backup Location](/settings/7-backup-restore-settings/#backup-location): where backups are written.
- [Default Downloads Location](/settings/5-youtube-settings/#downloads): default YouTube download location.
- [Create Backup](/settings/7-backup-restore-settings/#create-backup): pick exactly which User Data parts to back up.
- [Clear Caches](/settings/8-advanced-settings/#clear-caches): free space without touching folders by hand.
- [Cache Limits](/settings/8-advanced-settings/#cache-limits): cap how big the caches can grow.

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
