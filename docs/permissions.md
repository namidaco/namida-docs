---
title: "Permissions"
description: "The permissions Namida uses and why"
---

# Permissions

The permissions Namida uses and why. Nothing is used for tracking, there are no analytics at all.

### Always Used {#always}

- `WAKE_LOCK`, `FOREGROUND_SERVICE` & `FOREGROUND_SERVICE_MEDIA_PLAYBACK`: keep the app alive for media playback, otherwise the system would kill playback randomly.
- `INTERNET`: used for many things, like artist/album images, streaming & downloading, lyrics fetching, etc.
- `READ_EXTERNAL_STORAGE` (Android <= 12): list files from indexer folders only.
- `READ_MEDIA_AUDIO` (Android 13+): list audio files from indexer folders only.
- `READ_MEDIA_VIDEO` (Android 13+): list video files from indexer folders only, for video playback.
- `READ_MEDIA_IMAGES` (Android 13+): list image files from indexer folders only, for fallback covers like `cover.jpg`.
- `VIBRATE`: vibrate/haptic feedback for some actions, can be turned off in [`⚙️ Configure Vibration ↗`](/settings/6-extras-settings/#vibration).
- `QUERY_ALL_PACKAGES`: to allow opening custom equalizer apps.

### Requested When Needed {#requested}

- `WRITE_EXTERNAL_STORAGE` (Android <= 10) & `MANAGE_EXTERNAL_STORAGE` / all files access (Android 10+): used for actions that write files, like:
  - editing audio tags
  - creating or auto restoring backups
  - saving artworks
  - deleting files
  - compressing images & fixing yt-dlp images
  - exporting playlists as M3U
  - downloading YouTube content
  - playing tracks from a root folder
  - the in-app file browser
- `POST_NOTIFICATIONS`: post notifications like history import or download progress.
- `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`: improve downloads, they can be throttled when the app is battery restricted.
- `WRITE_SETTINGS`: to set audio as ringtone, etc.

::: callout info
On Windows & Linux, none of these apply, the app works like any normal desktop app.
:::

---

<sub>by @claude</sub>
