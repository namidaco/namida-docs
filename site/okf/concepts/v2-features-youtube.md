---
type: concept
title: YouTube
description: "Stream, download and watch YouTube inside Namida"
source: "https://namidaco.github.io/namida_docs/v2/features/youtube/"
path: /v2/features/youtube/
version: v2
updated: 2026-08-28
okf:
  generated_by: "@docmd/plugin-okf"
  generated_at: "2026-08-28T12:46:29.896Z"
---
---
title: "YouTube"
description: "Stream, download and watch YouTube inside Namida"
---

# YouTube

Namida comes with a full YouTube section, powered by a custom client. Stream, watch, download and build your own YouTube library.

### Streaming {#streaming}

[`⚙️ YouTube Settings ↗`](/settings/5-youtube-settings/)

- Best available video & audio quality, you can pick the quality manually too.
- Audio Only mode, play any video as music without loading the video.
- Data Saver mode, play audio only if video was not cached.
- Radio, auto start a queue based on the current video, using YouTube Mix playlist.

### Video View {#video-view}

Watching videos supports gestures:

- Swipe up or pinch in to enter fullscreen
- Double tap to seek
- Swipe vertically to control volume/brightness
- Swipe horizontally to seek
- Long press for 2x speed [`⚙️ Configure ↗`](/settings/5-youtube-settings/#flags)

### Miniplayer {#miniplayer}

A YouTube style miniplayer with comments, related videos and video description. It dims automatically after a few seconds to help focus & reduce eye strain. Both the delay and the dim intensity can be changed. [`⚙️ Miniplayer Settings ↗`](/settings/5-youtube-settings/#miniplayer)

### Downloads {#downloads}

[`⚙️ Downloads Settings ↗`](/settings/5-youtube-settings/#downloads)

Download any video or audio, with full control over the result:

- Metadata tags are written to the file, with optional auto title/artist/album extraction from the video title. You can edit every tag before downloading.
- Output filename builder, similar to yt-dlp format, see [all formats](#filename-formats) below.
- Both work for single downloads and batch playlist downloads, where playlist formats number the files for you.
- Default download folder, changeable per download.
- Download notifications `Windows+Linux only`.

### Filename & Tags Formats {#filename-formats}

Use these inside `%(...)s` to build the output filename, or the tags:

| Format                        | Meaning                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------ |
| `video_id`, `id`              | video identifier                                                                                 |
| `video_url`, `url`            | video full url                                                                                   |
| `video_title`, `fulltitle`    | video full title                                                                                 |
| `title`                       | extracted music title from video title (Navjaxx - **Fading Light** (Slowed))                     |
| `artist`                      | extracted music artist from video title (**Navjaxx** - Fading Light (Slowed)), or else `channel` |
| `genre`                       | music genre, automatically set to Nightcore when the video title contains "nightcore"            |
| `ext`                         | format container extension (mp4, m4a, webm), added automatically if not specified                |
| `channel_fulltitle`           | channel full name                                                                                |
| `channel`, `uploader`         | channel name (excluding " - Topic")                                                              |
| `channel_id`, `uploader_id`   | channel id                                                                                       |
| `channel_url`, `uploader_url` | channel url                                                                                      |
| `timestamp`                   | UNIX timestamp of the video, milliseconds since epoch                                            |
| `upload_date`                 | upload date of the video, converted to local time (yyyyMMdd)                                     |
| `view_count`                  | view count of the video                                                                          |
| `like_count`                  | like count of the video                                                                          |
| `description`                 | video description, links are wrapped in a markdown style                                         |
| `duration`                    | video duration in seconds (204)                                                                  |
| `duration_string`             | video duration formatted (3:24)                                                                  |
| `playlist_title`              | title of the playlist containing the video                                                       |
| `playlist_id`                 | id of the playlist containing the video                                                          |
| `playlist`                    | `playlist_title` if available, or else `playlist_id`                                             |
| `playlist_count`              | total videos count in the playlist                                                               |
| `playlist_index`              | index of the video in the playlist, starts at 0                                                  |
| `playlist_autonumber`         | position of the video in the playlist, starts at 1                                               |
| `none`                        | empty field, useful for tags to override any other settings                                      |

Examples:

```bash
# [04] music title [(channel name)]
[%(playlist_autonumber)s] %(title)s [(%(channel)s)]

# saving to separate folders
# music playlist/02. music title.m4a
%(playlist)s/%(playlist_autonumber)s. %(title)s.%(ext)s
```

### Caching & Offline Playback {#caching}

Streamed videos and audios are cached, so they play offline later without downloading. A cache priority system decides what to keep when cleaning up, so your important stuff stays.

- Set a video's cache priority to VIP to prevent auto deletion completely.
- Private and deleted YouTube videos are automatically set to VIP, so you never lose them.

### SponsorBlock {#sponsorblock}

[`⚙️ SponsorBlock Settings ↗`](/settings/5-youtube-settings/#sponsorblock)

Skips sponsor segments in videos using community data from [SponsorBlock](https://sponsor.ajay.app/). Segments and heatmap are also shown on the seekbar. You can choose which categories to skip and how.

### Return YouTube Dislike {#return-youtube-dislike}

[`⚙️ RYD Settings ↗`](/settings/5-youtube-settings/#return-youtube-dislike)

Shows the dislike count on videos using [Return YouTube Dislike](https://returnyoutubedislike.com/).

### Accounts {#accounts}

[`⚙️ Accounts Settings ↗`](/settings/5-youtube-settings/#accounts)

Sign in to your account to get personalized related videos and mix playlists, and to interact with videos. Signing in can also provide better download speed and fix some playback issues.

### Comments {#comments}

[`⚙️ Comments Settings ↗`](/settings/5-youtube-settings/#comments)

Full comments support with replies. You can prefer top comments or newest comments first.

### Takeout Import {#history-import}

[`⚙️ Import Youtube History ↗`](/settings/7-backup-restore-settings/#import-youtube-history)

You can import your watch history from YouTube takeout files, it gets merged into Namida history like any local listen. Your playlists and subscribed channels can be imported from takeout too, right in the [YouTube Channels page](/pages/youtube/#channels) & [YouTube playlists page](/pages/youtube/#playlists).

::: callout tip
Signing in your YouTube account allows you to access your Subscribed Channels and Playlists. This can be better than importing manually depending on your usage.
:::

---

### Related Settings {#related-settings}

- [YouTube Settings](/settings/5-youtube-settings/)
- [SponsorBlock](/settings/5-youtube-settings/#sponsorblock)
- [Return YouTube Dislike](/settings/5-youtube-settings/#return-youtube-dislike)
- [Backup & Restore, for history import](/settings/7-backup-restore-settings/#import-youtube-history)

---

<sub>by @claude</sub>
