---
title: "Medium Guides"
description: "Linking videos, syncing and smart playlists"
---

# Medium Guides

### Link a YouTube video to a track {#link-yt-video}

1. Open the track's dialog and choose "Set Youtube Link".
2. Paste the video link, done. The video plays with the track when [`⚙️ Configure Video Playback ↗`](/settings/3-playback-settings/#video-playback) is on.

It also works automatically, Namida looks up the track's comment tag (usually filled by yt-dlp) or its filename for a YouTube link. If found, the video is downloaded and cached, then plays once ready. Streaming is not used here since the priority goes to the music file itself.

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
Matching ignores casing, symbols and whitespace, and extra words around the name are fine.
:::

### Play specific tracks quickly {#play-specific-quickly}

1. Set the left swipe action to "Play After" in [`⚙️ Configure Swipe Actions ↗`](/settings/4-customization-settings/#track-tile).
2. Swipe on each track you want, they line up right after the current one.

### Sync data between devices {#sync-devices}

1. Install the same Namida version on both devices, and connect them to the same network.
2. Open the Sync page on both (Settings -> Backup & Restore -> Sync).
3. Start the server on one device, and search on the other. Not showing up? See [`📄 Sync devices can't find or connect ↗`](/faq/#sync-troubleshooting).
4. Accept the connection request, then choose the data to send & receive.
5. Press send or receive, that's it. See the [`🎉 Sync feature ↗`](/features/sync/) for what gets synced.

### Sync music files between devices {#sync-music-files}

Sync and listening parties don't send your music files for now, use another app to move them:

- [Syncthing](https://syncthing.net) ([Android](https://f-droid.org/en/packages/com.github.catfriend1.syncthingfork/)), keeps a folder the same on all your devices, new music shows up on the others automatically.
- [LocalSend](https://localsend.org), sends files and folders over the local network. Good for a one time copy.
- [Namida Sync](https://github.com/010101-sans/namida_sync), a community app made for Namida, see [Companion Apps](/installation/#companion-apps).

Then:

1. Send or sync your music folder to the other device.
2. Add that folder on the other device, and refresh the library. [`⚙️ Configure List of Folders ↗`](/settings/2-indexer-settings/#folders-to-scan)
3. Sync your data, tracks get matched even if the folders are different. [`🎉 Smart Matching ↗`](/features/sync/#matching)

### Path problems after syncing {#sync-path-problems}

Synced to another device and tracks or playlists point to the wrong paths?

1. Open Missing Tracks. [`⚙️ Open Missing Tracks ↗`](/settings/2-indexer-settings/#missing-tracks)
2. Press select all, then Update. Everything should be fixed.

For playlists, you can also make them follow your music files instead:

1. Convert your playlists to M3U, they are saved in [Namida Folder](/storage-paths/#namida-folder)`/M3U Playlists`.
2. Move the M3U files somewhere inside your music folder.
3. Refresh the playlists in Namida (pull down in the playlists page), they turn into relative playlists.
4. Sync them together with the music using [syncthing](https://f-droid.org/en/packages/com.github.catfriend1.syncthingfork/) or similar apps.

More info: [`🎉 Playlists feature ↗`](/features/playlists-history/#playlists)

### Update directory path {#update-directory-path}

Moved your music from `/storage/music` to `/storage/audio/music`?

1. Open Update Directory Path in Advanced settings. [`⚙️ Open Update Directory Path ↗`](/settings/8-advanced-settings/#update-directory-path)
2. Enter the old directory and the new one.
3. All track paths update, keeping stats and listens.

### Smart playlist examples {#smart-playlist-examples}

Some rule ideas, all in one group with All:

- 90s favourites: Year <u>is in Between</u> `1990-01-01` and `1999-12-31`, plus Favourite <u>is True</u>.
- Recent bangers: Rating <u>is Greater Than</u> `80`, plus First listen <u>is Within Last</u> `3 Months`.
- Unheard gems: Total Listens <u>is Same</u> `0`, plus Date Added <u>is not Within Last</u> `1 Months`.

More examples from easy to complex, and how rules combine, in [`🎉 Smart Playlists feature ↗`](/features/smart-playlists/#examples).

### Split a CUE album into tracks {#split-cue}

Albums saved as one big file with a `.cue` sheet show up as a single track in Namida. Split them once into separate files, it doesn't lose any quality and every feature works on the result.

Apps that read the `.cue` sheet and copy its tags to the new files:

- Windows: [foobar2000](https://www.foobar2000.org), open the `.cue` file, select all tracks, right click -> Convert -> Quick convert, and pick FLAC.
- macOS: [XLD](https://tmkk.undo.jp/xld/index_e.html).
- Linux: [Flacon](https://flacon.github.io).
- Android: [Flac Cue Splitter](https://play.google.com/store/apps/details?id=com.ex.ogg).

Prefer the command line? [FFcuesplitter](https://github.com/jeanslack/FFcuesplitter) does the same on Windows, macOS and Linux (needs Python and ffmpeg installed):

```bash
pip install ffcuesplitter
ffcuesplitter -i "album.cue" -o "output folder"
```

::: callout tip
Move the original album file out of your indexed folders (or delete it), otherwise it shows up next to the split tracks.
:::

For albums meant to play without pauses, turn on gapless playback. [`⚙️ Configure Gapless Playback ↗`](/settings/3-playback-settings/#gapless-playback)

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
