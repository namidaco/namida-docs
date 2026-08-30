---
type: guide
title: "Medium Guides"
description: "Linking videos, syncing and smart playlists"
source: "https://namidaco.github.io/namida-docs/guides/medium/"
path: /guides/medium/
version: v6.5.0
updated: 2026-08-30
okf:
  generated_by: "@docmd/plugin-okf"
  generated_at: "2026-08-30T21:51:03.638Z"
---
---
title: "Medium Guides"
description: "Linking videos, syncing and smart playlists"
---

# Medium Guides

### Link a YouTube video to a track {#link-yt-video}

1. Open the track's dialog and choose "Set Youtube Link".
2. Paste the video link, done. The video plays with the track when [`⚙️ Configure Video Playback ↗`](/settings/3-playback-settings/#video-playback) is on.

It also works automatically, Namida looks up the track's comment tag (mostly filled by yt-dlp) or its filename for any matching YouTube link. If found, the video is downloaded, cached, and plays once ready. Streaming is not used here, the priority goes to the music file itself.

- In the comment tag, any url format gets matched, example: `https://youtu.be/video_id`
- In filenames, it should contain `v=video_id` or `id=video_id` to get matched.

### Link a local video to a track {#link-local-video}

1. Put the video inside one of your indexed folders.
2. Name it so the filename contains at least one of these:
   - the music filename
   - the title & first artist of the track
   - the track's YouTube id (in the comment tag or filename)
3. Set the [`⚙️ Configure Video Source ↗`](/settings/3-playback-settings/#video-source) to Local or Auto.

Example, this track and video match:

```text
Alan walker - Faded.m4a
video alAn WaLkER - faDed (480p).mp4
```

::: callout info
Some cleanup is made to improve the matching, all symbols & whitespaces are ignored, so casing and extra words don't break it.
:::

### Play specific tracks quickly {#play-specific-quickly}

1. Set the left swipe action to "Play After" in [`⚙️ Configure Swipe Actions ↗`](/settings/4-customization-settings/#track-tile).
2. Swipe on each track you want, they line up right after the current one.

### Sync data between devices {#sync-devices}

1. Install the same Namida version on both devices, and connect them to the same network.
2. Open the Sync page on both (Settings -> Backup & Restore -> Sync).
3. Start the server on one device, and search on the other.
4. Accept the connection request, then choose the data to send & receive.
5. Press send or receive, that's it. See the [`🎉 Sync feature ↗`](/features/sync/) for what gets synced.

### Update directory path {#update-directory-path}

Moved your music from `/storage/music` to `/storage/audio/music`?

1. Open Update Directory Path in Advanced settings. [`⚙️ Open Update Directory Path ↗`](/settings/8-advanced-settings/#update-directory-path)
2. Enter the old directory and the new one.
3. All track paths update, keeping stats and listens.

### Smart playlist examples {#smart-playlist-examples}

Some rule ideas for [`🎉 Smart Playlists feature ↗`](/features/playlists-history/#smart-playlists):

- 90s favourites: Year is between 1990 and 1999, plus Favourite is true.
- Recent bangers: Rating is greater than 80, plus First listen is within last 3 months.
- Unheard gems: Listen count is 0, plus Date added is not within last month.

---

<sub>by @claude</sub>
