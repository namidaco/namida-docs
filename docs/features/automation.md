---
title: "Automation & Other Apps"
description: "How other apps and tools can start, control and read Namida"
---

# Automation & Other Apps

Namida uses each platform's standard sharing and media system, so automation apps (Tasker, MacroDroid, Automate, etc), scrobblers and scripts work with it without any extra setup.
The everyday side of this is in [`🎉 System Integration ↗`](/features/system-integration/), this page covers what other apps and scripts can do.

### What Other Apps Can Do {#what-apps-can-do}

- Start playback with anything Namida accepts through "Open with" or share (files, folders, playlists, YouTube links, text with links and party invites). [`🎉 Open With & Share ↗`](/features/system-integration/#open-with)
- Control playback through the media session (play / pause / stop / next / previous / seek, plus repeat and shuffle where the app offers them). [`🎉 Media Controls ↗`](/features/system-integration/#media-controls)
- Read the current track (title, artist, album, duration and position) with media or notification access. Tasker, scrobblers (Pano Scrobbler, Last.fm apps, etc) and watch companions all use this.
- Read the ids from the file tags (MusicBrainz, ISRC, AcoustID, etc) in the media session, under keys like `org.musicbrainz.MUSICBRAINZ_TRACKID`, so scrobblers can match the exact recording (although none read them yet). `💻 Android only` `🆕 v8.2.0`
- Get every track change, play and pause with the full track info (file path, queue position, MusicBrainz ids), through broadcasts or a webhook. `🆕 v8.2.0` [See below](#broadcasts)

### Broadcasts & Webhook {#broadcasts}

`🆕 v8.2.0`

Turn them on from the flag icon of the Integrations card in Extras settings:

- `NOW_PLAYING_BROADCAST`, an Android broadcast on every track change, play and pause, for Tasker and other automation apps. `💻 Android only`
- `WEBHOOK`, posts the same events as JSON to a url, you pick which events (track changed / play / pause).

Each event has the full track info, including the file path (or video id for YouTube) and ids from the file tags (MusicBrainz, ISRC, AcoustID, etc), see the [event format](#event-format).
Broadcast actions are in the [cheat sheet](#cheat-sheet). [`⚙️ Configure Integrations ↗`](/settings/6-extras-settings/#integrations)

### Event Format {#event-format}

`🆕 v8.2.0`

Broadcasts and the webhook send the same fields:

- Sent as:
  - Webhook: JSON, like the example below.
  - Broadcasts: extras with the same names.
- `event`: `trackChanged` / `play` / `pause`
- `path` is the file path, YouTube videos have `videoId` instead.
- Tag ids (like `MUSICBRAINZ_TRACKID`) are only there when the file has them.

```json
{
  "event": "trackChanged",
  "playing": true,
  "positionMS": 0,
  "title": "Song",
  "artist": "Artist",
  "album": "Album",
  "genre": "Pop",
  "durationMS": 215000,
  "path": "/storage/emulated/0/Music/song.flac",
  "queueIndex": 4,
  "queueLength": 20,
  "MUSICBRAINZ_TRACKID": "d6118046-407d-4e06-a1ba-49c399a4c42f"
}
```

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
| One file `🆕 v8.4.0` | `android.intent.action.SEND` | Mime: `audio/*` or `video/*`, Extra `android.intent.extra.STREAM`: the uri |
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

No intent needed, use your automation app's media control action and pick Namida as the app (Tasker: "Media Control", MacroDroid: "Media Control"). Commands are play / pause / toggle / stop / next / previous. With `adb`:

```sh
adb shell cmd media_session dispatch play-pause
adb shell cmd media_session dispatch next
```

Reading the current track works through the same apps' media session or notification triggers, title and artist arrive as variables.

**Android, reading broadcasts** `🆕 v8.2.0`

| Action | Sent on |
| --- | --- |
| `com.msob7y.namida.metachanged` | Track changed |
| `com.msob7y.namida.playstatechanged` | Play and pause |

In Tasker, use the "Intent Received" event with one of these actions, the extras arrive as variables (`%title`, `%artist`, `%path`, etc). All fields are in the [event format](#event-format).

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

---

### Related {#related}

- [🎉 System Integration](/features/system-integration/)
- [🎉 Shortcuts](/features/shortcuts/)
- [🎉 Listening Party](/features/party/)
- [⚙️ Extras, Integrations](/settings/6-extras-settings/#integrations)
- [⚙️ Youtube, On Opening Youtube Link](/settings/5-youtube-settings/#on-opening-youtube-link)

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
