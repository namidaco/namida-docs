---
type: concept
title: "Backup & Restore"
description: "Backup your database and settings"
source: "https://namidaco.github.io/namida_docs/settings/7-backup-restore-settings/"
path: /settings/7-backup-restore-settings/
updated: 2026-08-27
okf:
  generated_by: "@docmd/plugin-okf"
  generated_at: "2026-08-27T01:50:02.675Z"
---
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

Where backups are saved and looked up.

### Auto Backup Interval {#auto-backup-interval}

Automatically create a backup every set number of days.

### Sync {#sync}

Sync app data between your devices over local network, see the [Sync feature](/features/sync/) for details.

### Import Youtube History {#import-youtube-history}

Import your watch history from a YouTube takeout export (`watch-history.json`). Watches get matched with your library or YouTube videos and merged into history.

### Import LastFm History {#import-lastfm-history}

Import your scrobbles from a LastFm csv export.

### Import Spotify History {#import-spotify-history}

Import your extended streaming history from a Spotify data export, zip or json files.

### Import ListenBrainz History {#import-listenbrainz-history}

Import your listens from a ListenBrainz data export, zip or json files.

::: callout info
Each import shows a small guide for getting the export file. You can limit the import to a time range, and optionally match against all tracks in your library for better results, which can be slower.
:::

---

<sub>by @claude</sub>
