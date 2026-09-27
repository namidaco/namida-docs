---
title: "Advanced"
description: "Advanced Settings, don't touch"
---

# Advanced

Caches, fixes and performance.

### Performance Mode {#performance-mode}

One switch for the heavy visual settings: High performance, Balanced, Good looking, or Custom.
It controls things like auto coloring, blur, glow and parallax at once.

### Re-scan Videos {#rescan-videos}

Rebuilds the local videos index.

### Remove Source from History {#remove-source-history}

Remove all listens that came from a specific source (like an import) from your history. [`🎉 History Import feature ↗`](/features/playlists-history/#import)

### Update Directory Path {#update-directory-path}

Moved your music to a new folder? This updates all track paths from the old directory to the new one, keeping stats and listens. [`📒 Update Directory Path Guide ↗`](/guides/medium/#update-directory-path)

### Fix yt-dlp Big Thumbnail Size {#fix-ytdlp-thumbnail}

Files downloaded by yt-dlp can have a huge embedded thumbnail (usually a re-encoded webp). This re-embeds the best available thumbnail without converting it, so files get smaller (around 1MB to 128KB per image) and artworks load faster. The audio is untouched.

::: callout warning
The files in the selected folder are replaced.
:::

### Compress Images {#compress-images}

Compress artworks and cached images to save storage, you choose the compression percentage. Moderate values save a lot with little visible loss. The audio files are untouched.

::: callout info
Output goes to a new folder [Namida Folder](/storage-paths/#namida-folder)`/Compressed`. The selected folder is not changed, so copy the files back manually if you want to replace the originals.
:::

### Cache Limits {#cache-limits}

Maximum size for server, image, audio and video caches. Oldest and least important items get cleaned first.

| Cache                   | Android | Windows & Linux |
| ----------------------- | ------- | --------------- |
| Server `🆕 v7.4.0`      | 4 GB    | 12 GB           |
| Image                   | 256 MB  | 2 GB            |
| Audio                   | 4 GB    | 12 GB           |
| Video                   | 8 GB    | 24 GB           |

Each cached video has a priority: VIP, High, Normal, Low or Disable. Cleaning starts from the bottom and never touches VIP items. Change it from the video's menu, see [Caching & Offline Playback](/features/youtube/#caching).

Server tracks you cached yourself are never deleted automatically either, but they still count towards the limit. [`🎉 Offline Caching ↗`](/features/media-servers/#offline-caching)

### Clear Caches {#clear-caches}

Clear server, image, audio or video cache. Each tile shows the current size, and you pick what to delete before anything is removed.

| Cache              | What you can pick                                                                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Server `🆕 v7.4.0` | The tracks you cached yourself (not selected by default), the other streamed files, and unfinished downloads.                                 |
| Image              | Each image folder: track artworks, video thumbnails, artist and album images, YouTube thumbnails and channel images.                          |
| Audio              | Everything, or press Choose to pick single items, which can be sorted by size, oldest watch or total listens.                                  |
| Video              | Same as audio.                                                                                                                                 |

When choosing audio or video items, you can also select everything of a priority at once `🆕 v7.4.0`, unfinished downloads, or files already in your local library.

::: callout warning
Clearing the image cache leaves your library without images. Only use it to rebuild the image cache.
:::

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
