---
title: "Playback"
description: "Audio, video and queue behavior"
---

# Playback

Everything about how Namida plays your music and videos.

::: callout tip
Long press the audio button in the player, then press Playback, to open this section.
:::

### Enable Video Playback {#video-playback}

Play videos related to the music. Videos can be found locally or fetched from YouTube.

### Video Source {#video-source}

- Auto, uses local videos first, if none is found it fetches from YouTube.
- Local Videos, checks if any video file inside your folders has a filename that matches the track.
- From Youtube, checks the track filename & comment tag for a matching YouTube link, videos are cached for later use.

### Video Quality {#video-quality}

Your preferred qualities, in order. Keep a few alternatives (if none of them is available the lowest quality is used).

### Local Video Matching {#local-video-matching}

How local videos are matched with tracks (title / filename), with an option to match inside the same directory only.

### Keep Screen Awake When {#keep-screen-awake}

Three modes (Never / when the miniplayer is expanded / when the miniplayer is expanded and a video is playing).

### Notification Buttons {#notification-buttons}

`🆕 v8.2.0` `💻 Android only`

Pick and reorder the media notification buttons (favourite / stop / shuffle / repeat / seek / chapters / sleep timer / stop after this track / add to playlist / bookmark). For add to playlist, you pick the playlist it adds to.
On Android 11 and below, the thumbnail might move out of place with 5 buttons.

### Display Artwork on Lockscreen {#artwork-lockscreen}

`💻 Android <= 12 only`

Shows the current track's artwork on the lockscreen.

### Kill Player After Dismissing App {#kill-player}

Stops playback completely when you swipe the app away. Three modes (Always / If not playing / Never).

On Windows & Linux this decides what closing the window does (quit the app / minimize to the tray). [`🎉 System Tray ↗`](/features/system-integration/#tray)

### On Notification Tap {#on-notification-tap}

`💻 Android only`

Choose what opens (the app / the miniplayer / the queue).

### Dismissible Miniplayer {#dismissible-miniplayer}

Swipe the miniplayer away to stop playback and clear the queue.

### Sound Control {#sound-control}

`🆕 v7.8.0`

Opens the Sound Control page (output device / bit-perfect / equalizer / speed / pitch, etc). [`🎉 Sound Control ↗`](/features/playback/#sound-control)

### Normalize Audio {#normalize-audio}

Keeps the volume consistent between tracks (using the replay gain tag, or the loudness info YouTube provides for videos). You pick how it is applied:

- Off.
- Platform default, the best option for your device.
- Loudness Enhancer, uses the system effect.
- Volume, changes the player volume instead (more stable).

### Skip Silence {#skip-silence}

`💻 Android+Linux only`

Skips silent parts anywhere in the track, with or without crossfade (not for YouTube).
The Smart [crossfade](#crossfade) style is a different thing, it only changes where automatic crossfades start.

### Gapless Playback {#gapless-playback}

Removes the small delay between tracks by loading the next one early. Useful for some albums, or for those who can't wait 0.067 seconds between tracks. `Beta feature`.

### Crossfade {#crossfade}

Fades between tracks. You can set the crossfade duration and how many seconds before the end it should trigger.
Part of the membership, or unlock it with an egg. [`📄 Membership ↗`](/membership/#benefits) [`📄 Eggs ↗`](/membership/#eggs)

The Style option changes how automatic crossfades happen. `🆕 v8.2.0` [`🎉 Smart & Beat Matching ↗`](/features/playback/#beat-matching)

- **Default**, starts the crossfade the set amount of seconds before the track ends.
- **Smart**, starts the crossfade where the track fades out or ends, and skips the silence at the start of the next one.
- **Beat matching**, does what Smart does, and also matches the tempo and lines up the beats of both tracks.

Smart and Beat matching analyze upcoming tracks in the background, the `ANALYZE_RHYTHM` flag analyzes the whole library ahead of time. [`⚙️ Analyze Rhythm Flag ↗`](/settings/8-advanced-settings/#flags)

Turned off while [Bit-perfect](/features/playback/#bit-perfect), [USB direct access](/features/playback/#usb-direct) or [Exclusive mode](/features/playback/#exclusive-mode) is on. `🆕 v7.8.0`

### Fade Effect on Play/Pause {#fade-play-pause}

Fades audio in and out instead of an instant play or pause, with separate durations for each. Turned off while [Bit-perfect](/features/playback/#bit-perfect) is on.

### Auto Play on Next/Previous {#auto-play-next-prev}

Start playing directly when skipping to the next or previous track.

### Infinity Queue on Next/Previous {#infinity-queue}

Pressing next on the last item jumps to the first one, and vice versa.

### On Volume 0 {#on-volume-zero}

Choose what happens when volume reaches zero (pause playback / do nothing), with an option to resume if it was paused for less than a set number of minutes.

### Long-Press Action: Speed {#long-press-speed}

The playback speed used while long pressing the next button or the video (1.5x by default).

### On Interruption {#on-interruption}

`💻 Android only`

Control what happens on calls and notifications (pause / duck, which lowers the volume / do nothing), and whether to resume after the interruption ends.

### On Device Connect {#on-device-connect}

`💻 Android only`

Resume playback when a wired or wireless device is connected, if playback was paused by disconnecting it.

### Jump to First Track After Finishing Queue {#jump-to-first}

When the queue ends, go back to the first track instead of staying on the last one.

### Previous Button Replays {#previous-button-replays}

If the track has played longer than the seek duration, pressing previous restarts it instead of going to the previous track.

### Next/Previous Jump Between Chapters {#skip-buttons-chapters}

`🆕 v8.2.0`

In a track or video with chapters, next and previous jump between its chapters instead of changing the track. [`🎉 Chapters ↗`](/features/playback/#chapters)

### Seek Duration {#seek-duration}

How many seconds the seek buttons jump.

::: callout tip
Tap the current position to seek backwards, and the total duration to seek forwards. Hold either one to keep seeking in that direction.
:::

### Minimum Track Duration to Restore Last Position {#restore-last-position}

Tracks longer than this resume from where you left off, useful for podcasts and long mixes.

### Count a Listen After {#count-listen-after}

How much of a track must play (in seconds or percentage) before it counts as a listen in history.

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
