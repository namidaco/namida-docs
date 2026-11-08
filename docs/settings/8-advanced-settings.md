---
title: "Advanced"
description: "Advanced Settings, don't touch"
---

# Advanced

Caches, fixes and performance.

### Performance Mode {#performance-mode}

One switch for the heavy visual settings (High performance / Balanced / Good looking / Custom).
It controls things like auto coloring, blur, glow and parallax at once.

It also holds the [effects and visualizer](/features/effects/) settings, High performance turns them off. `🆕 v7.8.0`

### Remove Source from History {#remove-source-history}

Remove all listens that came from a specific source (like an import) from your history. [`🎉 History Import feature ↗`](/features/playlists-history/#import)

### Update Directory Path {#update-directory-path}

Moved your music to a new folder? This updates all track paths from the old directory to the new one, keeping stats and listens. [`📒 Missing Tracks Guide ↗`](/guides/medium/#missing-paths)

### Fix yt-dlp Big Thumbnail Size {#fix-ytdlp-thumbnail}

Files downloaded by yt-dlp can have a huge embedded thumbnail (usually a re-encoded webp). This re-embeds the best available thumbnail without converting it, so files get smaller (around 1MB to 128KB per image) and artworks load faster. The audio is untouched.
Music uploads get a square cover instead (thumbnails with side bars are cropped). `🔄 v8.6.0`

::: callout warning
The files in the selected folder are replaced.
:::

### Compress Images {#compress-images}

Compress artworks and cached images to save storage, you choose the compression percentage. Moderate values save a lot with little visible loss. The audio files are untouched.
"Keep file dates" keeps the original dates on the compressed images.
Animated images are skipped and transparency is kept. `🆕 v8.2.0`

::: callout info
Namida's own image caches are replaced in place (only when the result is smaller). `🆕 v8.2.0`
Other folders go to [Namida Folder](/storage-paths/#namida-folder)`/Compressed` with the same folder structure. The selected folder is not changed, so copy the files back manually if you want to replace the originals.
:::

### Cache Limits {#cache-limits}

Maximum size for server, image, audio and video caches. Oldest and least important items get cleaned first.
Each limit is set from the wheel on its [Clear](#clear-caches) tile. `🆕 v8.2.0`

| Cache | Android & iOS | Windows, Linux & macOS |
| --- | --- | --- |
| Server `🆕 v7.4.0` | 4 GB | 12 GB |
| Image | 256 MB | 2 GB |
| Audio | 4 GB | 12 GB |
| Video | 8 GB | 24 GB |

Each cached video has a priority (VIP / High / Normal / Low / Disable). Cleaning starts from the bottom and never touches VIP items.
Change it from the video's menu, see [Caching & Offline Playback](/features/youtube/#caching).

Server tracks you cached yourself are never deleted automatically either, but they still count towards the limit. [`🎉 Offline Caching ↗`](/features/media-servers/#offline-caching)

### Clear Caches {#clear-caches}

Clear server, image, audio or video cache. Each tile shows the current size, and you pick what to delete before anything is removed.

| Cache | What you can pick |
| --- | --- |
| Server `🆕 v7.4.0` | The tracks you cached yourself (not selected by default), the other streamed files, and unfinished downloads. |
| Image | Each image folder: track artworks, video thumbnails, artist and album images, YouTube thumbnails and channel images. |
| Audio | Everything, or press Choose to pick single items, which can be sorted (auto / size / oldest watch / total listens). Auto lists what's safest to delete first (based on priority, recent listens and size), and VIP items are always last. |
| Video | Same as audio. |

When choosing audio or video items, you can also select everything of a priority at once `🆕 v7.4.0`, unfinished downloads, or files already in your local library.

::: callout warning
Clearing the image cache leaves your library without images. Only use it to rebuild the image cache.
:::

### Flags {#flags}

`🆕 v8.2.0`

Hidden options. Press the flag icon at the top of the Advanced settings card to open them:

- `PROXY_URL`, a custom HTTP proxy (like `http://user:pass@127.0.0.1:8080`). Left empty, Namida uses the system proxy, or the `http_proxy` / `https_proxy` environment variables (the only way on Linux). YouTube, lyrics, artworks and downloads go through it, but the local network (sync, parties, home servers) never does. `🆕 v8.6.0`
- `ANALYZE_RHYTHM`, analyzes the whole library ahead of time for the [crossfade styles](/features/playback/#beat-matching): where each track fades out (Smart), plus tempo, key and beats (Beat matching). The tag button writes the analyzed BPM to files that have none.
- `DETECT_FAKE_LOSSLESS_FILES`, scans your lossless files for ones made from a lossy source, upsampled or bit-padded. The results can be saved as a playlist.

Integration flags (like `WEBHOOK` and `STATUS_BAR_LYRICS`) moved to the [Integrations](/settings/6-extras-settings/#integrations) card in Extras settings. `🆕 v8.4.0`

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
