---
title: "Playback"
description: "Queues, effects, videos and lyrics"
---

# Playback

Everything you expect from a music player, plus some extras.

### Queue System {#queue}

A persistent and reliable queue system, your sessions are saved for later usage. Also:

- Repeat modes, including repeat for N times and a shuffle flavor, see [below](#repeat-modes).
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

### Repeat Modes {#repeat-modes}

Press the repeat button in the player to pick one:

- **Stop on Last Track**, playback pauses after the last track. [`⚙️ Jump to First Track After Finishing Queue ↗`](/settings/3-playback-settings/#jump-to-first)
- **Repeat Current Track**, the current track plays again and again.
- **Repeat for N times**, the current track repeats N times, then the next one plays.
- **Repeat All Queue**, the queue loops.
- **Repeat All Queue (Shuffle)**, the queue is reshuffled every time it ends.

In a [listening party](/features/party/#queue), the room has its own repeat mode that everyone follows.

### Audio Effects {#effects}

Crossfade, Play/Pause fade effect, Gapless playback, Skip silence, a parametric [Equalizer](#equalizer) and Loudness Enhancer. Crossfade is part of the membership, or unlock it with an [egg](/membership/#eggs). [`⚙️ Configure Effects ↗`](/settings/3-playback-settings/#crossfade) [`📄 Membership ↗`](/membership/#benefits)

Looking for visual effects and visualizers instead? See [`🎉 Effects & Visualizers ↗`](/features/effects/)

### Sound Control {#sound-control}

Press the audio effects icon in the player, the Sound Control tile at the top of settings, or [Sound Control](/settings/3-playback-settings/#sound-control) in playback settings. From top to bottom:

- [Output device](#output-device), [Bit-perfect](#bit-perfect) and [USB direct access](#usb-direct). `🆕 v7.8.0`
- [Audio path](#audio-path), and what Bit-perfect and USB direct access turn off. `🆕 v7.8.0`
- Normalize audio. [`⚙️ Configure Normalize Audio ↗`](/settings/3-playback-settings/#normalize-audio)
- Two tabs:
  - **Global**, applies to everything you play.
  - **Item**, applies to the current track or video only (a small icon shows when it has its own settings). Press reset to fall back to global, or turn on "Force use Global Config" to ignore per item settings.
- **Mono audio**, both sides play the same sound. `🆕 v7.8.0`

Both tabs carry Skip Silence `💻 Android+Linux only`, Pitch (as a percentage or in semitones), Speed, Volume, Loudness Enhancer and the [Equalizer](#equalizer) with its presets.

::: callout tip
Tap a value icon to type it precisely instead of dragging the slider.
:::

### Equalizer {#equalizer}

`🆕 v7.8.0`

A parametric equalizer with as many bands as you want, on every platform. Old settings and presets carry over.

- Drag a band on the curve to tune it, or long press an empty spot to add one. A Sliders view is there too.
- Any band type (peak, shelf, low/high pass, notch...), on both channels or just one.
- Auto preamp and a limiter keep boosts from distorting.
- Built-in or your own presets, each can follow an [output device](#output-device). Long press a preset to use it for the current device, save the current bands into it, rename or delete it.
- Import from [AutoEq](https://autoeq.app) or Equalizer APO, or export as Equalizer APO text.

::: callout info
On Windows, only Peak bands for now.
On Android, long press "Open App" to pick an external equalizer app.
:::

### Output Device {#output-device}

`🆕 v7.8.0`

Pick where Namida plays, it's remembered for when the device reconnects.

#### Bit-perfect {#bit-perfect}

The file reaches your output device exactly as it's stored, nothing changes it on the way.

- **Android**: needs Android 14+ and an output that supports it (usually a USB DAC), or [USB direct access](#usb-direct) on any version.
- **Windows & Linux**: every effect is skipped, and only Namida uses the output device while playing.

Anything that changes the audio (like the equalizer or speed) is turned off meanwhile.

::: callout warning
With USB direct access and a DAC without its own volume control, bit-perfect tracks play at full volume. Lower the volume on your headphones or amp first.
:::

Not using it? Playback still got better for everyone, see [Audio Quality](#audio-quality).

#### USB Direct Access {#usb-direct}

`💻 Android only`

Namida drives your USB DAC itself instead of going through Android, so bit-perfect works on any Android version.

1. Connect the DAC and turn on USB direct access.
2. Allow access when Android asks. Android can also offer Namida as the default app, which skips the question next time (not offered for DACs with a microphone).

- Volume keys work as usual. DACs with their own volume control keep the audio untouched.
- Unplugging the DAC pauses playback, like unplugging headphones.
- Crossfade, Loudness Enhancer and other apps' sounds are off while the DAC is in use.

It works with or without Bit-perfect:

- **With Bit-perfect**, the audio reaches the DAC untouched.
- **Without Bit-perfect**, effects like the equalizer still work, and the audio still bypasses Android's audio system (playing at the track's own sample rate when the DAC supports it).

Asked for access every time? See the [FAQ](/faq/#usb-dac-permission).

#### Audio Path {#audio-path}

Every step the audio goes through (from the file to your device), with the ones that change it highlighted. Open it from Sound Control, or by long pressing the audio/video button in the player.

### Audio Quality {#audio-quality}

`🆕 v7.8.0`

Better sound without Bit-perfect or USB direct access:

- On Android, audio is processed in 32-bit float, so 24-bit files keep their full precision.
- The volume slider follows how loud it sounds, like a real volume knob. On Android, raise your old volume once if it sounds low now.
- On Windows & Linux, replay gain follows real decibels, see [Replay Gain](#replay-gain).

### Replay Gain {#replay-gain}

Normalizes volume across tracks by reading the replay gain tag, and the loudness info provided by YouTube for videos. [`⚙️ Configure Normalize Audio ↗`](/settings/3-playback-settings/#normalize-audio)

On Windows & Linux, replay gain and the loudness enhancer now follow real decibels, the same as Android. `🆕 v7.8.0`

### Pausing Scenarios {#pausing}

Control exactly what happens on calls, notifications, volume 0 and device disconnect, and when to resume. [`⚙️ Configure Pausing ↗`](/settings/3-playback-settings/#on-interruption)

### Video Integration {#video}

Namida can play videos related to your music. Videos are found locally by filename matching, or fetched from YouTube using the link in the track's comment tag or filename. [`⚙️ Configure Video Playback ↗`](/settings/3-playback-settings/#video-playback) [`📒 Link a YouTube Video Guide ↗`](/guides/medium/#link-yt-video) [`📒 Link a Local Video Guide ↗`](/guides/medium/#link-local-video)

### Lyrics {#lyrics}

Lyrics are fetched and shown automatically (synced or plain), with support for displaying word synced lrc/ttml files. Subtitle files next to the track (`.srt`, `.vtt`, `.sbv`, `.ssa`, `.ass`) work as lyrics too.
Online lyrics come from LRCLIB and KuGou, and the best matching result is picked using the track duration. Long press the lyrics to enter fullscreen. [`⚙️ Configure Lyrics ↗`](/settings/6-extras-settings/#lyrics)

Synced lyrics in Japanese, Chinese, Korean, Greek, Cyrillic and a few more scripts can show a romanized line under each line. `🆕 v7.4.0` [`⚙️ Configure Romanization ↗`](/settings/6-extras-settings/#romanization)

The simple lyrics line under the artwork shows translations and romanizations too, and word synced lyrics light up word by word there (like in the lyrics view). Line synced lyrics get a short reveal with the sung colors when they become current. `🆕 v7.5.0` [`⚙️ Configure Simple Lyrics Line ↗`](/settings/6-extras-settings/#lyrics)

Choose where lyrics are saved (the cache, the track folder or your own lyrics folders), and delete them along with the track. `🆕 v7.5.0` [`⚙️ Configure Lyrics Save Location ↗`](/settings/6-extras-settings/#lyrics-save-location)

#### Lyrics Picker {#lyrics-picker}

Long press the lyrics button in the player (right click on desktop) to see every lyrics found for the track. Add, search, edit or shift them from there, and: `🆕 v7.8.0`

- The ones in use are marked Active, tap others and press Save to use them instead.
- Embed (from the ⋮ menu) writes them into the track's lyrics tag.
- A "Prioritize embedded lyrics" switch shows when the track has embedded lyrics.
- Font Scale sets the lyrics size, for normal and fullscreen.

### Widescreen Player {#widescreen-player}

`🆕 v7.0.0`

On a wide window, the expanded player shows a maximize icon at its top left. It opens a two pane layout (artwork/video and controls on the left, lyrics or the queue on the right). Press the exit icon or `Esc` to go back.

Scroll away from the current track or lyrics line, and a Jump button shows up to bring you back. `🆕 v7.4.0`

### Subtitles {#subtitles}

`🆕 v7.0.0`

Videos can show subtitles, coming from a file next to the video, from inside the video file, or from YouTube. See the [`🎉 Subtitles feature ↗`](/features/subtitles/).

### Gestures {#gestures}

- Swipe the miniplayer left or right to change tracks, up and down to expand or minimize, and swipe down to dismiss when [Dismissible Miniplayer](/settings/3-playback-settings/#dismissible-miniplayer) is on.
- Artwork tap and long press actions are configurable, and double tap can toggle lyrics. [`⚙️ Configure Artwork Gestures ↗`](/settings/4-customization-settings/#miniplayer-customization)
- Swipe left or right on a track or video to execute an action (play next, open info, go to album, edit tags and more). [`⚙️ Configure Swipe Actions ↗`](/settings/4-customization-settings/#track-tile)
- Tap or long press the thumbnail of a track or video to execute an action too, off by default. `🆕 v7.5.0` [`⚙️ Configure Artwork Gestures ↗`](/settings/4-customization-settings/#track-tile)
- Tap the current position to seek backwards and the total duration to seek forwards, by your [Seek Duration](/settings/3-playback-settings/#seek-duration). Holding either one keeps seeking.
- Long press the previous button to jump to the start of the track, long press the next button to speed up playback while holding it.
- While seeking with the seekbar, swipe upwards to cancel the seek.
- Seeking very close to the starting edge snaps to the very start.
- Pinch the lyrics to change the font size, separately for normal and fullscreen. On desktop use `Ctrl` + mouse wheel, `Ctrl` + `+` / `-`, or `Ctrl` + `0` to reset. [`🎉 Shortcuts feature ↗`](/features/shortcuts/#zoom)
- Zoom in on the video to enter fullscreen.
- More hidden gestures in [`📄 Tips & Tricks ↗`](/tips/).

### Track Menu {#track-menu}

Long press any track for queue control: Play Next, Play Last, Play After latest inserted, repeat for N times, stop after this track, and adding more from the same album, artist or folder. See [`📄 Tips & Tricks ↗`](/tips/#track-menu) for the full list.

The menu also has an Advanced section for the heavier stuff (copying and moving files, setting a track as a ringtone, replacing listens and more). [`📄 Advanced Dialog Tips ↗`](/tips/#advanced-dialog)

### Sleep Timer {#sleep-timer}

Stop playback after a number of tracks or minutes. Find it in the side menu, or in the quick tiles at the top of settings (where it also shows what's left while it runs).

Presets set it in one tap, press + to add your own, or long press one to remove it. `🆕 v7.8.0`

### Waveform Seekbar {#waveform}

The seekbar is the actual waveform of the track. [`⚙️ Configure Waveform Bars ↗`](/settings/4-customization-settings/#miniplayer-customization)

---

### Related Settings {#related-settings}

- [⚙️ Playback Settings](/settings/3-playback-settings/)
- [⚙️ Playback, Sound Control](/settings/3-playback-settings/#sound-control)
- [⚙️ Extras, Lyrics](/settings/6-extras-settings/#lyrics)
- [⚙️ Customizations, Miniplayer](/settings/4-customization-settings/#miniplayer-customization)
- [🎉 Subtitles feature](/features/subtitles/)

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
