---
title: "Playback"
description: "Queues, effects, videos and lyrics"
---

# Playback

Everything you expect from a music player, plus some extras.

### Queue System {#queue}

A persistent and reliable queue system, your sessions are saved for later usage. Also:

- Repeat modes: Repeat All Queue, Stop on Last Track, Repeat Current Track, repeat for N times before playing the next track, and Repeat All Queue (Shuffle) which reshuffles the queue every time it ends.
- Shuffle is a toggle, separate from the repeat mode. `🆕 v7.1.0`
  - Turning it on shuffles the queue with the playing track first, turning it off restores the original order. Playback is never interrupted.
  - While on, new queues start shuffled, with the track you pressed first.
  - It persists between sessions and is the same toggle everywhere: queue, home screen widget, media controls and the desktop shortcut.
- Stop after any track, open a queued track's menu and choose "Stop after this track". `🆕 v7.0.0`
- Insert after latest inserted, for stacking several tracks in order.
- Play modes when playing from search: selected track only, search results, album, first artist or first genre.
- Recommended & Similar Release Date, add tracks you usually listen to with the current one, or released around the same time.

The queue's bottom row packs more than it looks:

- The clear button removes duplicates, everything before, everything after, or all except the current track.
- The add button generates and adds tracks:
  - Local: Random, Time Range, Moods, Ratings, Similar Release Date, Similar Discover Date, Similar Time Range and Recommended
  - YouTube: Random, Time Range, Mix, Similar Release Date, Similar Discover Date, Similar Time Range and Recommended.
- A jump button scrolls right to the current track.
- In a queue mixing tracks and videos, the add to playlist button asks whether to add the tracks or the videos.
- Tap shuffle to toggle it, the button stays highlighted while it's on. Long press it for a one time shuffle instead: Shuffle Next shuffles the upcoming tracks, Shuffle All shuffles the whole queue.

[`⚙️ Configure Playback ↗`](/settings/3-playback-settings/)

### Audio Effects {#effects}

Crossfade, Play/Pause fade effect, Gapless playback, Skip silence, and an Equalizer with Loudness Enhancer. Crossfade is part of the membership, or find the easter egg to unlock it for free. [`⚙️ Configure Effects ↗`](/settings/3-playback-settings/#crossfade) [`📄 Membership ↗`](/membership/#benefits)

### Sound Control {#sound-control}

Press the audio effects icon in the player, or the Sound Control tile at the top of settings, to open the Sound Control page. It has two tabs:

- **Global**, applies to everything you play.
- **Item**, applies to the current track or video only, a small icon shows when it has its own settings. Press reset to fall back to global, or turn on "Force use global config" to ignore per item settings.

Both tabs carry Speed, Pitch (as a percentage or in semitones), Volume, Skip silence, Loudness Enhancer and the Equalizer with its presets. There is also Mono Audio for merging both channels into one.

::: callout tip
Tap a value icon to type it precisely instead of dragging the slider.
:::

### Replay Gain {#replay-gain}

Normalizes volume across tracks by reading the replay gain tag, and the loudness info provided by YouTube for videos. [`⚙️ Configure Normalize Audio ↗`](/settings/3-playback-settings/#normalize-audio)

### Pausing Scenarios {#pausing}

Control exactly what happens on calls, notifications, volume 0 and device disconnect, and when to resume. [`⚙️ Configure Pausing ↗`](/settings/3-playback-settings/#on-interruption)

### Video Integration {#video}

Namida can play videos related to your music. Videos are found locally by filename matching, or fetched from YouTube using the link in the track's comment tag or filename. [`⚙️ Configure Video Playback ↗`](/settings/3-playback-settings/#video-playback) [`📒 Link a YouTube Video Guide ↗`](/guides/medium/#link-yt-video) [`📒 Link a Local Video Guide ↗`](/guides/medium/#link-local-video)

### Lyrics {#lyrics}

Lyrics are fetched and shown automatically, synced or plain, with support for displaying word synced lrc/ttml files. Subtitle files next to the track (`.srt`, `.vtt`, `.sbv`, `.ssa`, `.ass`) work as lyrics too. Online lyrics come from LRCLIB and KuGou, and the best matching result is picked using the track duration. Long press the lyrics to enter fullscreen. [`⚙️ Configure Lyrics ↗`](/settings/6-extras-settings/#lyrics)

Synced lyrics in Japanese, Chinese, Korean, Greek, Cyrillic and a few more scripts can show a romanized line under each line. `🆕 v7.4.0` [`⚙️ Configure Romanization ↗`](/settings/6-extras-settings/#romanization)

### Widescreen Player {#widescreen-player}

`🆕 v7.0.0`

On a wide window, the expanded player shows a maximize icon at its top left. It opens a two pane layout, artwork/video and controls on the left, lyrics or the queue on the right. Press the exit icon or `Esc` to go back.

Scroll away from the current track or lyrics line, and a Jump button shows up to bring you back. `🆕 v7.4.0`

### Subtitles {#subtitles}

`🆕 v7.0.0`

Videos can show subtitles, coming from a file next to the video, from inside the video file, or from YouTube. See the [`🎉 Subtitles feature ↗`](/features/subtitles/).

### Gestures {#gestures}

- Swipe the miniplayer left or right to change tracks, up and down to expand or minimize, and swipe down to dismiss when [Dismissible Miniplayer](/settings/3-playback-settings/#dismissible-miniplayer) is on.
- Artwork tap and long press actions are configurable, and double tap can toggle lyrics. [`⚙️ Configure Artwork Gestures ↗`](/settings/4-customization-settings/#miniplayer-customization)
- Swipe left or right on a track or video to execute an action (play next, open info, go to album, edit tags and more). [`⚙️ Configure Swipe Actions ↗`](/settings/4-customization-settings/#track-tile)
- Tap the current position to seek backwards and the total duration to seek forwards, by your [Seek Duration](/settings/3-playback-settings/#seek-duration). Holding either one keeps seeking.
- Long press the previous button to jump to the start of the track, long press the next button to speed up playback while holding it.
- While seeking with the seekbar, swipe upwards to cancel the seek.
- Seeking very close to the starting edge snaps to the very start.
- Zoom in on the lyrics to change the font size. On desktop use `Ctrl` + mouse wheel, `Ctrl` + `+` / `-`, or `Ctrl` + `0` to reset. [`🎉 Shortcuts feature ↗`](/features/shortcuts/#zoom)
- Zoom in on the video to enter fullscreen.
- More hidden gestures in [`📄 Tips & Tricks ↗`](/tips/).

### Track Menu {#track-menu}

Long press any track for queue control: Play Next, Play Last, Play After latest inserted, repeat for N times, stop after this track, and adding more from the same album, artist or folder. See [`📄 Tips & Tricks ↗`](/tips/#track-menu) for the full list.

The menu also has an Advanced section for the heavier stuff, copying and moving files, setting a track as a ringtone, replacing listens and more. [`📄 Advanced Dialog Tips ↗`](/tips/#advanced-dialog)

### Sleep Timer {#sleep-timer}

Stop playback after a number of tracks or minutes. Find it in the side menu, or in the quick tiles at the top of settings, where it also shows what's left while it runs.

### Waveform Seekbar {#waveform}

The seekbar is the actual waveform of the track. [`⚙️ Configure Waveform Bars ↗`](/settings/4-customization-settings/#miniplayer-customization)

---

### Related Settings {#related-settings}

- [⚙️ Playback Settings](/settings/3-playback-settings/)
- [⚙️ Extras, Lyrics](/settings/6-extras-settings/#lyrics)
- [⚙️ Customizations, Miniplayer](/settings/4-customization-settings/#miniplayer-customization)
- [🎉 Subtitles feature](/features/subtitles/)

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
