---
title: "Backup & Restore"
description: "Backup your database and settings"
---

# Backup & Restore

Backups, imports and sync between devices.

### Create Backup {#create-backup}

Creates a backup file, you choose what to include (database / settings / playlists / history / queues / lyrics / artworks, etc).

### Restore Backup {#restore-backup}

- Automatic, applies the most recent backup file found inside the backup location.
- Manual, pick a specific file.

Restoring merges the backup into your current data instead of replacing it (if something exists in both, the backup's version is kept). Backups from another device get matched to your local tracks, like [Sync](/features/sync/#matching) does. `🆕 v8.2.0`

On a fresh install, the first page has Restore Backup and Sync buttons too. `🆕 v8.2.0`

### Default Backup Location {#backup-location}

Where backups are saved, and where Automatic restore looks for them.

### Auto Backup Interval {#auto-backup-interval}

Automatically create a backup every set number of days.

### Sync {#sync}

Sync app data between your devices over the local network, see the [Sync feature](/features/sync/) for details.

### Import data {#import-data}

Pick a source, then choose what to import from its export (history / favourites / playlists) `🆕 v8.2.0`

- YouTube, a takeout export (zip files or the extracted folder), for watch history, favourites (liked videos) and playlists. Watches get matched with your library or YouTube videos and merged into history.
  - Subscriptions too, they become your subscribed channels in Namida (include them when exporting the takeout). `🆕 v8.4.0`
- LastFm, a csv export of your scrobbles.
- Spotify, a data export (zip or json files), for your extended streaming history and favourites (liked songs).
- ListenBrainz, a data export (zip or json files), for your listens and favourites (loved tracks).

::: callout info
Each import shows a short guide for getting the export file.
You can limit it to a time range, and choose to add every matched track per entry (instead of just one).
"Backup history before importing" is on by default, it saves your history (and favourites or playlists if picked) to the backup location first (as a `Namida History Backup` file). Automatic restore skips these files, use Manual restore to bring one back. `🆕 v7.4.0`
:::

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
