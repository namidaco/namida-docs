---
title: "Backup & Restore"
description: "Backup your database and settings"
---

# Backup & Restore

Backups, imports and sync between devices.

### Create Backup {#create-backup}

Creates a backup file, you choose what to include: database, settings, playlists, history, queues, lyrics, artworks and more.

### Restore Backup {#restore-backup}

- Automatic: applies the most recent backup file found inside the backup location.
- Manual: pick a specific file.

### Default Backup Location {#backup-location}

Where backups are saved, and where Automatic restore looks for them.

### Auto Backup Interval {#auto-backup-interval}

Automatically create a backup every set number of days.

### Sync {#sync}

Sync app data between your devices over the local network, see the [Sync feature](/features/sync/) for details.

### Import Youtube History {#import-youtube-history}

Import your watch history from a YouTube takeout export (`watch-history.json` or `watch-history.html`). Watches get matched with your library or YouTube videos and merged into history.

### Import LastFm History {#import-lastfm-history}

Import your scrobbles from a LastFm csv export.

### Import Spotify History {#import-spotify-history}

Import your extended streaming history from a Spotify data export, zip or json files.

### Import ListenBrainz History {#import-listenbrainz-history}

Import your listens from a ListenBrainz data export, zip or json files.

::: callout info
Each import shows a short guide for getting the export file. You can limit it to a time range, and choose to add every matched track per entry (instead of just one).
"Backup history before importing" is on by default, it saves your history to the backup location first, as a `Namida History Backup` file. Automatic restore skips these files, use Manual restore to bring one back. `🆕 v7.4.0`
:::

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
