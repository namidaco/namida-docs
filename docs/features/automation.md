---
title: "Automation & Other Apps"
description: "How other apps and tools can start, control and read Namida"
---

# Automation & Other Apps

Namida uses each platform's standard sharing and media system, so automation apps (Tasker, MacroDroid, Automate, etc), scrobblers and scripts work with it without any extra setup.
The everyday side of this is in [`🎉 System Integration ↗`](/features/system-integration/), this page covers what other apps and scripts can do.

### What Other Apps Can Do {#what-apps-can-do}

- Start playback with anything Namida accepts through "Open with" or share (files, folders, playlists, YouTube links, text with links and party invites). [`🎉 Open With & Share ↗`](/features/system-integration/#open-with)
- Control playback through the media session (play, pause, stop, next, previous and seek, plus repeat and shuffle where the app offers them). [`🎉 Media Controls ↗`](/features/system-integration/#media-controls)
- Read the current track (title, artist, album, duration and position) with media or notification access. Tasker, scrobblers (Pano Scrobbler, Last.fm apps, etc) and watch companions all use this.

### Cheat Sheet {#cheat-sheet}

The exact values to type into Tasker's "Send Intent", MacroDroid's "Launch Intent", `adb` or a script. Namida needs nothing custom, these are the normal Android intents every app understands.

**Android, starting things**

| What | Action | Data / Extras |
| --- | --- | --- |
| Package | `com.msob7y.namida` | Target: Activity (`com.msob7y.namida.NamidaMainActivity`) |
| Play a file | `android.intent.action.VIEW` | Data: `file:///storage/emulated/0/Music/song.mp3` (or a `content://` uri), Mime: `audio/*` or `video/*` |
| Play a playlist file | `android.intent.action.VIEW` | Data: a `.m3u` or `.m3u8` path, Mime: `*/*` |
| Open a YouTube link | `android.intent.action.VIEW` | Data: `https://youtu.be/VIDEO_ID` or any youtube.com link |
| Share text with links | `android.intent.action.SEND` | Mime: `text/plain`, Extra `android.intent.extra.TEXT`: the text |
| Several files | `android.intent.action.SEND_MULTIPLE` | Mime: `audio/*`, Extra `android.intent.extra.STREAM`: list of uris |
| Join a party | `android.intent.action.VIEW` | Data: `namida://party?c=CODE` |
| Just open Namida | `android.intent.action.MUSIC_PLAYER` | nothing |

The same from a computer with `adb`:

```sh
adb shell am start -a android.intent.action.VIEW -d "file:///sdcard/Music/song.mp3" -t "audio/*" com.msob7y.namida
adb shell am start -a android.intent.action.VIEW -d "https://youtu.be/dQw4w9WgXcQ" com.msob7y.namida
adb shell am start -a android.intent.action.SEND -t text/plain --es android.intent.extra.TEXT "https://youtu.be/dQw4w9WgXcQ" com.msob7y.namida
```

**Android, controlling playback**

No intent needed, use your automation app's media control action and pick Namida as the app (Tasker: "Media Control", MacroDroid: "Media Control"). Commands are play, pause, toggle, stop, next and previous. Reading the current track works through the same apps' media session or notification triggers, title and artist arrive as variables. With `adb`:

```sh
adb shell cmd media_session dispatch play-pause
adb shell cmd media_session dispatch next
```

**Windows**

```sh
namida.exe "C:\Music\song.mp3"
namida.exe "C:\Music\Some Album"
namida.exe "https://youtu.be/dQw4w9WgXcQ"
```

Playback control goes through the media keys, there is no command line for it.

**Linux**

```sh
namida ~/Music/song.flac
playerctl -p namida play-pause
playerctl -p namida next
playerctl -p namida position 30
playerctl -p namida shuffle on
playerctl -p namida loop Track
playerctl -p namida metadata
playerctl -p namida open file:///home/me/Music/song.flac
```

The MPRIS name is `org.mpris.MediaPlayer2.namida`, `playerctl -l` lists it while Namida runs.

### Not Available Yet {#not-yet}

There is no plugin API, no broadcast on track change and no webhook, so outside apps only get what the media session carries (no file path, no MusicBrainz ids). These are tracked in [#27](https://github.com/namidaco/namida/issues/27), [#948](https://github.com/namidaco/namida/issues/948) and [#1040](https://github.com/namidaco/namida/issues/1040).

---

### Related {#related}

- [🎉 System Integration](/features/system-integration/)
- [🎉 Shortcuts](/features/shortcuts/)
- [🎉 Listening Party](/features/party/)
- [⚙️ Youtube, On Opening Youtube Link](/settings/5-youtube-settings/#on-opening-youtube-link)

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
