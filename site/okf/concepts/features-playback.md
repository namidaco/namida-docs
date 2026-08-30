---
type: concept
title: Playback
description: "Queues, effects, videos and lyrics"
source: "https://namidaco.github.io/namida-docs/features/playback/"
path: /features/playback/
version: v6.5.0
updated: 2026-08-30
okf:
  generated_by: "@docmd/plugin-okf"
  generated_at: "2026-08-30T21:51:03.630Z"
---
---
title: "Playback"
description: "Queues, effects, videos and lyrics"
---

# Playback

Everything you expect from a music player, plus some extras.

### Queue System {#queue}

A persistent and reliable queue system, your sessions are saved for later usage. Also:

- Repeat modes: all, none, one, and repeat for N times before playing the next track.
- Insert after latest inserted, for inserting multiple tracks one after each other.
- Play modes when playing from search: selected track only, search results, album, first artist or first genre.
- Recommended & Similar Release Date additions, add tracks you usually listened to with the current one, or released around the same time.

The queue bottom row packs more than it looks:

- The clear button removes duplicates, everything before, everything after, or all except the current track.
- The add button generates and adds tracks:
  - Local: Random, Time Range, Moods, Ratings, Similar Release Date, Similar Discover Date, Similar Time Range and Recommended
  - YouTube: Random, Time Range, Mix, Similar Release Date, Similar Discover Date, Similar Time Range and Recommended.
- A jump button scrolls right to the current track.
- Tap shuffle to shuffle, long press it to switch between Shuffle Next and Shuffle All.

[`⚙️ Configure Playback ↗`](/settings/3-playback-settings/)

### Audio Effects {#effects}

Crossfade, Play/Pause fade effect, Gapless playback, Skip silence, and an Equalizer with Loudness Enhancer. [`⚙️ Configure Effects ↗`](/settings/3-playback-settings/#crossfade)

Audio configs can also be set per item, check the Sound Control page by pressing the audio effects icon in the player.

### Replay Gain {#replay-gain}

Normalizes volume across tracks by reading the replay gain tag, and the loudness info provided by YouTube for videos. [`⚙️ Configure Normalize Audio ↗`](/settings/3-playback-settings/#normalize-audio)

### Pausing Scenarios {#pausing}

Control exactly what happens on calls, notifications, volume 0 and device disconnect, and when to resume. [`⚙️ Configure Pausing ↗`](/settings/3-playback-settings/#on-interruption)

### Video Integration {#video}

Namida can play videos related to your music. Videos are found locally by filename matching, or fetched from YouTube using the link in the track's comment tag or filename. [`⚙️ Configure Video Playback ↗`](/settings/3-playback-settings/#video-playback) [`📒 Link a YouTube Video Guide ↗`](/guides/medium/#link-yt-video) [`📒 Link a Local Video Guide ↗`](/guides/medium/#link-local-video)

### Lyrics {#lyrics}

Auto fetching & displaying, synced & plain, with support for word synced lrc/ttml files. Long press the lyrics to enter fullscreen. [`⚙️ Configure Lyrics ↗`](/settings/6-extras-settings/#lyrics)

### Gestures {#gestures}

- Swipe the miniplayer left or right to change tracks, up and down to expand or minimize, and swipe down to dismiss when [Dismissible Miniplayer](/settings/3-playback-settings/#dismissible-miniplayer) is on.
- Artwork tap and long press actions are configurable, and double tap can toggle lyrics. [`⚙️ Configure Artwork Gestures ↗`](/settings/4-customization-settings/#miniplayer-customization)
- Swipe left/right on a track or a video to execute actions (ex: play next, open info, go to album, edit tags, etc..) [`⚙️ Configure Swipe Actions ↗`](/settings/4-customization-settings/#track-tile)
- While seeking with the seekbar, swipe upwards to cancel the seek.
- Seeking very close to the starting edge snaps to the very start.
- Zoom in on the lyrics to change the font size.
- Zoom in on the video to enter fullscreen.
- More hidden gestures in [`📄 Tips & Tricks ↗`](/tips/).

### Track Menu {#track-menu}

Long press any track for queue control: Play Next, Play Last, Play After latest inserted, repeat for N times, stop after this track, and adding more from the same album, artist or folder. See [`📄 Tips & Tricks ↗`](/tips/#track-menu) for the full list.

### Sleep Timer {#sleep-timer}

Stop playback after a number of tracks or minutes.
Sleep Timer can be found in the app side menu.

### Waveform Seekbar {#waveform}

The seekbar is the actual waveform of the track. [`⚙️ Configure Waveform Bars ↗`](/settings/4-customization-settings/#miniplayer-customization)

---

### Related Settings {#related-settings}

- [⚙️ Playback Settings](/settings/3-playback-settings/)
- [⚙️ Extras, Lyrics](/settings/6-extras-settings/#lyrics)
- [⚙️ Customizations, Miniplayer](/settings/4-customization-settings/#miniplayer-customization)

---

<sub>by @claude</sub>
