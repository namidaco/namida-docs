---
title: "System Integration"
description: "How Namida talks to the rest of your device"
---

# System Integration

What Namida can do outside of its own window.

### Open With & Share {#open-with}

Namida registers itself for a lot of things, so it shows up in the share sheet and in "Open with":

- Audio and video files, they play right away. Sharing many files at once works too, Sharing a folder works too.
- `.m3u` and `.m3u8` playlist files. [`🎉 Playlists feature ↗`](/features/playlists-history/#playlists)
- YouTube links, from any app or browser. What happens next is up to you. [`⚙️ Configure On Opening Youtube Link ↗`](/settings/5-youtube-settings/#on-opening-youtube-link)
- Shared text, useful for links copied from somewhere else.

It can also be set as your default music player, and it answers voice assistant requests to play music.

::: callout tip
NFC tags carrying a YouTube link open in Namida too.
:::

### Quick Settings Tile {#quick-settings-tile}

`💻 Android only`

Add the Namida tile to your quick settings panel to play and pause without opening anything. The tile shows the current state, so you can tell at a glance if something is playing.

### Home Screen Widget {#home-widget}

`💻 Android only`

A resizable player widget with its own settings screen, see the [`🎉 Home Screen Widget feature ↗`](/features/home-widget/).

### System Tray {#tray}

`💻 Windows+Linux only`

Namida lives in the system tray while it runs. Click the icon to hide or show the window, right click it for a small menu with the current track, previous, play/pause, next, open, mini lyrics window and exit.

Closing the window minimizes to the tray instead of quitting, unless you tell it otherwise. [`⚙️ Configure Kill Player After Dismissing App ↗`](/settings/3-playback-settings/#kill-player)

### Mini Lyrics Window {#mini-lyrics}

`🆕 v7.0.0` `💻 Windows+Linux only`

A small window showing the current lyrics line, good for keeping lyrics around while you do something else. Open it from the tray menu or with `Ctrl` + `Alt` + `L`, press `Esc` or the same shortcut to go back to the normal window.

[`🎉 Shortcuts feature ↗`](/features/shortcuts/)

### System Wide Hotkeys {#hotkeys}

`💻 Windows+Linux only`

Control playback even when Namida is not focused, see [`🎉 Shortcuts feature ↗`](/features/shortcuts/#custom-hotkeys).

---

### Related {#related}

- [🎉 Home Screen Widget](/features/home-widget/)
- [🎉 Shortcuts](/features/shortcuts/)
- [⚙️ Youtube, On Opening Youtube Link](/settings/5-youtube-settings/#on-opening-youtube-link)

---

<sub>by @claude</sub>
