---
title: "Playback"
description: "Audio, video and queue behavior"
---

# Playback

Everything about how Namida plays your music and videos.

::: callout tip
Long press the audio button in the player to open this section.
:::

### Enable Video Playback {#video-playback}

Play videos related to the music. Videos can be found locally or fetched from YouTube.

### Video Source {#video-source}

- Auto: uses local videos first, if none is found it fetches from YouTube.
- Local Videos: checks if any video file inside your folders has a filename that matches the track.
- From Youtube: checks the track filename & comment tag for a matching YouTube link, videos are cached for later use.

### Video Quality {#video-quality}

Your preferred qualities, in order. Keep a few alternatives, if none of them is available the lowest quality is used.

### Local Video Matching {#local-video-matching}

How local videos are matched with tracks, by title or filename, with an option to match inside the same directory only.

### Keep Screen Awake When {#keep-screen-awake}

Never, when the miniplayer is expanded, or when the miniplayer is expanded and a video is playing.

### Display Favourite Button in Notification {#fav-button-notification}

`💻 Android only`

Adds a favourite button to the media notification. The thumbnail might move out of place on some devices.

### Display Stop Button in Notification {#stop-button-notification}

`💻 Android only`

Adds a stop button to the media notification.

### Display Artwork on Lockscreen {#artwork-lockscreen}

`💻 Android <= 12 only`

Shows the current track's artwork on the lockscreen.

### Kill Player After Dismissing App {#kill-player}

Stops playback completely when you swipe the app away. Three modes: Always, If not playing, or Never.

On Windows & Linux this decides what closing the window does, quit the app or minimize to the tray. [`🎉 System Tray ↗`](/features/system-integration/#tray)

### On Notification Tap {#on-notification-tap}

`💻 Android only`

Choose what opens: the app, the miniplayer or the queue.

### Dismissible Miniplayer {#dismissible-miniplayer}

Swipe the miniplayer away to stop playback and clear the queue.

### Normalize Audio {#normalize-audio}

Keeps the volume consistent between tracks, using the replay gain tag, or the loudness info YouTube provides for videos. You pick how it is applied:

- Off.
- Platform default, the best option for your device.
- Loudness Enhancer, uses the system effect.
- Volume, changes the player volume instead, more stable.

### Skip Silence {#skip-silence}

`💻 Android only`

Skips silent parts of the audio.

### Gapless Playback {#gapless-playback}

Removes the small delay between tracks by loading the next one early. Useful for some albums, or for those who can't wait 0.067 seconds between tracks. `Beta feature`.

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

### Long-Press Action: Speed {#long-press-speed}

The playback speed used while long pressing the next button or the video, 1.5x by default.

### On Interruption {#on-interruption}

`💻 Android only`

Control what happens on calls and notifications: pause, duck (lower the volume) or do nothing, and whether to resume after the interruption ends.

### On Device Connect {#on-device-connect}

`💻 Android only`

Resume playback when a wired or wireless device is connected, if playback was paused by disconnecting it.

### Jump to First Track After Finishing Queue {#jump-to-first}

When the queue ends, go back to the first track instead of staying on the last one.

### Previous Button Replays {#previous-button-replays}

If the track has played longer than the seek duration, pressing previous restarts it instead of going to the previous track.

### Seek Duration {#seek-duration}

How many seconds the seek buttons jump.

::: callout tip
Tap the current position to seek backwards, and the total duration to seek forwards. Hold either one to keep seeking in that direction.
:::

### Minimum Track Duration to Restore Last Position {#restore-last-position}

Tracks longer than this resume from where you left off, useful for podcasts and long mixes.

### Count a Listen After {#count-listen-after}

How much of a track must play, in seconds or percentage, before it counts as a listen in history.

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
