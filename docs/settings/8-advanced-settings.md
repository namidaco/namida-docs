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

Files downloaded by yt-dlp can carry a huge embedded thumbnail (usually a re-encoded webp). This re-embeds the best available thumbnail quality without converting it, so files shrink (around 1MB to 128KB per image) and artworks load faster. The audio is untouched.
This modifies the files directly.

::: callout warning
Output replaces the files in the selected folder
:::

### Compress Images {#compress-images}

Compress artworks and cached images to save storage, you choose the compression percentage. Moderate values save a lot with little visible loss. The audio files are untouched.

::: callout info
Output goes to a new folder [Namida Folder](/storage-paths/#namida-folder)`/Compressed`, it won't replace the folder you selected so you need to manually copy them back.
:::

### Cache Limits {#cache-limits}

Maximum size for image, audio and video caches. Oldest and least important items get cleaned first.

Each cached video carries a priority, VIP, High, Normal, Low or GETOUT. Cleaning starts from the bottom and never touches VIP items. Change it from the video's menu, see [Caching & Offline Playback](/features/youtube/#caching).

### Clear Caches {#clear-caches}

Clear image, audio or video cache. For video and audio cache you can choose exactly what to delete.

::: callout warning
Clearing image cache results in a library without images, use only to rebuild the image cache.
:::

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
