---
title: "System Integration"
description: "How Namida talks to the rest of your device"
---

# System Integration

What Namida can do outside of its own window.
For Tasker, scripts and scrobblers, see [`🎉 Automation & Other Apps ↗`](/features/automation/).

### Open With & Share {#open-with}

Any app that can "open" or "share" something can hand it to Namida:

- Audio and video files play right away, many files or whole folders (subfolders included) too.
  - To keep your queue instead, pick another action in `ON_EXTERNAL_MEDIA_FILE_OPEN` in the [Extras Flags](/settings/6-extras-settings/#flags): play keeping the queue (jumps to the file if it's already queued), play next, play last, always ask or open the menu. `🆕 v8.4.0`
  - They don't join your library, but keep their info in the queue and history. `🆕 v8.2.0`
- `.m3u` and `.m3u8` playlist files play the tracks inside them. [`🎉 Playlists feature ↗`](/features/playlists-history/#playlists)
- YouTube video links follow your "On Opening Youtube Link" choice, YouTube playlist links open the playlist page. [`⚙️ Configure On Opening Youtube Link ↗`](/settings/5-youtube-settings/#on-opening-youtube-link)
- Links inside shared text are picked up too, so a message with a few YouTube links works.
  - `.txt` files work the same, their links are opened instead of the file. `🆕 v8.4.0`
- Party invite links open the join page. [`🎉 Listening Party feature ↗`](/features/party/#join)

On Android this covers the share sheet, "Open with" and NFC tags carrying a YouTube link, and Namida can be set as your default music player.

On desktop the same works through file associations, drag & drop onto the window and the command line (`namida <files, folders or links>`). If Namida is already open, the existing window plays them.
While dragging, the window shows drop zones to Play, Play (Choose) (asks how to play, like keeping the queue or playing last) or More (opens the menu for what you dropped). `🆕 v8.2.0`

::: callout info
Voice assistants can open Namida and use the media controls below, but a spoken "play some artist" search is not handled yet, Namida just opens.
:::

### Media Controls {#media-controls}

Namida shows standard media controls wherever the system offers them:

- Notification and lock screen, with play, pause, next, previous and seek, plus buttons you pick and reorder (favourite, shuffle, repeat, chapters, sleep timer, add to playlist, etc). `🆕 v8.2.0` [`⚙️ Configure Notification Buttons ↗`](/settings/3-playback-settings/#notification-buttons)
- Headset and Bluetooth buttons.
- Android Auto and Wear OS, where Namida shows up as a media app with the current queue to play from (repeat and shuffle included). The queue can be turned off with the `ANDROID_AUTO_AND_WEAR` [flag](/settings/6-extras-settings/#integrations). `🆕 v8.2.0`
- Windows media keys and the media flyout (with a timeline you can seek on).
- Linux desktop media widgets and shell extensions, through MPRIS.

Other apps can read and control the same session too. [`🎉 Automation & Other Apps ↗`](/features/automation/)

### Quick Settings Tile {#quick-settings-tile}

`💻 Android only`

Add the Namida tile to your quick settings panel to play and pause without opening anything. The tile shows the current state, so you can tell at a glance if something is playing.

There is also a "Namida Shuffle" tile, it toggles shuffle and shows whether it's on. `🆕 v7.4.0` [`🎉 Queue System ↗`](/features/playback/#queue)

### Status Bar Lyrics {#status-bar-lyrics}

`🆕 v8.2.0` `💻 Android only`

Shows the current lyrics line in the status bar, on systems and modules that support it (ColorOS, HyperLyric, SuperLyric, Flyme and Lyricon). Pick the ones you use from `STATUS_BAR_LYRICS`, in the flags of the Integrations card in Extras settings. [`⚙️ Configure Integrations ↗`](/settings/6-extras-settings/#integrations)

### Discord Rich Presence {#discord}

`🆕 v8.4.0`

Shows what you're listening to on your Discord profile, with the title, artist and a progress bar. YouTube videos link to the video (and show its thumbnail on desktop). Local tracks show the Namida icon instead of their artwork, see [why](/faq/#discord-artwork). Pausing clears it.

- **Desktop**, works through the Discord app, which needs to be running. It uses the account signed in there.
- **Android**, the first time you turn it on, Discord asks you to sign in and allow Namida to set your status. Sign out from the same tile.

A small purple dot on the [settings icon](/settings/#settings-icon) shows while your status is shared. [`⚙️ Configure Discord Rich Presence ↗`](/settings/6-extras-settings/#integrations)

### Home Screen Widget {#home-widget}

`💻 Android only`

A resizable player widget with its own settings screen, see the [`🎉 Home Screen Widget feature ↗`](/features/home-widget/).

### System Tray {#tray}

`💻 Windows+Linux only`

Namida lives in the system tray while it runs. Click the icon to hide or show the window, right click it for a small menu with the current track, previous, play/pause, next, favourite, open, mini lyrics window and exit.

Closing the window minimizes to the tray instead of quitting, unless you tell it otherwise. [`⚙️ Configure Kill Player After Dismissing App ↗`](/settings/3-playback-settings/#kill-player)

### Mini Lyrics Window {#mini-lyrics}

`🆕 v7.0.0` `💻 Windows+Linux only`

A small window showing the current lyrics line (good for keeping lyrics around while you do something else). Open it from the tray menu or with `Ctrl` + `Alt` + `L`, press `Esc` or the same shortcut to go back to the normal window.

[`🎉 Shortcuts feature ↗`](/features/shortcuts/)

### System Wide Hotkeys {#hotkeys}

`💻 Windows+Linux only`

Control playback even when Namida is not focused, see [`🎉 Shortcuts feature ↗`](/features/shortcuts/#custom-hotkeys).

---

### Related {#related}

- [🎉 Automation & Other Apps](/features/automation/)
- [🎉 Home Screen Widget](/features/home-widget/)
- [🎉 Shortcuts](/features/shortcuts/)
- [⚙️ Playback, Notification Buttons](/settings/3-playback-settings/#notification-buttons)
- [⚙️ Extras, Integrations](/settings/6-extras-settings/#integrations)
- [⚙️ Youtube, On Opening Youtube Link](/settings/5-youtube-settings/#on-opening-youtube-link)

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
