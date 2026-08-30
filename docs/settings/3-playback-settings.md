---
title: "Playback"
description: "Audio, video and queue behavior"
---

# Playback

Everything about how Namida plays your music and videos.

::: callout tip
This section can be accessed directly in the player by long pressing the audio button.
:::

### Enable Video Playback {#video-playback}

Play videos related to the music. Videos can be found locally or fetched from YouTube.

### Video Source {#video-source}

- Auto: gives priority to local videos, if not found it fetches from YouTube.
- Local Videos: checks if any video file inside your folders has a filename that matches the track.
- From Youtube: checks the track filename & comment tag for a matching YouTube link, videos are cached for later use.

### Video Quality {#video-quality}

Preferred qualities to pick. Keeping more alternatives is good in case a quality is not found, otherwise it falls back to the worst quality.

### Local Video Matching {#local-video-matching}

How local videos are matched with tracks, by title or filename, with an option to match inside the same directory only.

### Keep Screen Awake When {#keep-screen-awake}

Never, when miniplayer is expanded, or when miniplayer is expanded and a video is playing.

### Display Favourite Button in Notification {#fav-button-notification}

`💻 Android only`

The notification thumbnail might get displaced on some devices.

### Display Stop Button in Notification {#stop-button-notification}

`💻 Android only`

### Display Artwork on Lockscreen {#artwork-lockscreen}

`💻 Android <= 12 only`

### Kill Player After Dismissing App {#kill-player}

Stops playback completely when you swipe the app away.

### On Notification Tap {#on-notification-tap}

`💻 Android only`

Choose what opens: the app, the miniplayer or the queue.

### Dismissible Miniplayer {#dismissible-miniplayer}

Swipe the miniplayer away to stop playback and clear queue.

### Normalize Audio {#normalize-audio}

Normalizes volume by reading the replay gain tag, or the info provided by YouTube for videos.

### Skip Silence {#skip-silence}

`💻 Android only`

Skips silent parts of the audio.

### Gapless Playback {#gapless-playback}

Removes the small loading delay between tracks, useful for some albums or for those who can't wait 0.067 seconds between tracks.
Works by prefetching the next track. This is a beta feature.

### Crossfade {#crossfade}

Fades between tracks. You can set the crossfade duration and how many seconds before the end it should trigger.

### Fade Effect on Play/Pause {#fade-play-pause}

Fades audio in and out instead of an instant play or pause, with separate durations for each.

### Auto Play on Next/Previous {#auto-play-next-prev}

Start playing directly when skipping to the next or previous track.

### Infinity Queue on Next/Previous {#infinity-queue}

Pressing next on the last item jumps to the first one, and vice versa.

### On Volume 0 {#on-volume-zero}

Pause playback or do nothing when volume reaches zero, with an option to resume if it was paused for less than a set number of minutes.

### On Interruption {#on-interruption}

`💻 Android only`

Control what happens on calls and notifications: pause, duck (lower the volume) or do nothing, and whether to resume after the interruption ends.

### On Device Connect {#on-device-connect}

`💻 Android only`

Resume playback when a wired or wireless device is connected, if playback was paused by disconnecting it.

### Jump to First Track After Finishing Queue {#jump-to-first}

### Previous Button Replays {#previous-button-replays}

Pressing previous replays the current track if the position is past the seek duration, instead of going back.

### Seek Duration {#seek-duration}

How many seconds the seek buttons jump.

::: callout tip
You can tap on current duration to seek backwards, and total duration to seek forwards.
:::

### Minimum Track Duration to Restore Last Position {#restore-last-position}

Tracks longer than this will resume from where you left them, useful for podcasts and long mixes.

### Count a Listen After {#count-listen-after}

Sets the minimum seconds or percentage of a track to count it as a listen in history.

---

<sub>by @claude</sub>
