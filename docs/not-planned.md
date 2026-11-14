---
title: "Not Planned"
description: "Features that will not be added, and why"
---

# Not Planned

Features that will not be added to Namida, and the reasoning behind each. The only focus is local library + YouTube.

### Google Play {#google-play}

Namida is not on Google Play, and there are no plans to publish it there currently. A few reasons:

- All files access permission (`MANAGE_EXTERNAL_STORAGE`). Google treats it as a special permission that only file manager apps are allowed to have, while Namida needs it for tag editing, backups, saving artworks, downloads and more, see [Permissions](/permissions/#requested). The alternative is SAF (Android's Storage Access Framework), which would work but would make many features tedious to use.
- Download feature.
- Donation & [Membership](/membership/) links that don't use Google's payment system.

A separate version without these could be made, but that is extra maintenance we are not willing to take on, and these features are an important part of the Namida experience.

Get Namida from GitHub instead, or use Obtainium to keep it updated. [`📒 Installation Guide ↗`](/installation/#android)

### F-Droid and other stores {#app-stores}

- F-Droid and IzzyOnDroid only accept apps with a free license (OSI/FSF), all code public and no proprietary parts. Namida uses its own license and some of its packages are private.
- Accrescent allows the all files access permission only for file managers, same as [Google Play](#google-play).

Get Namida from GitHub instead, or use Obtainium to keep it updated. [`📒 Installation Guide ↗`](/installation/#android)

### Spotify {#spotify}

Not planned. Importing your Spotify history and favourites (liked songs) is supported, but that's all.

Spotify is notorious for blocking unofficial clients. Even if Namida added support, a DMCA takedown would end it quickly. We are barely keeping YouTube support alive as is.

As an alternative, convert your Spotify playlists to YouTube Music, then sign in inside Namida to access them.

Alternatives: [spotiflac](https://github.com/spotbye/SpotiFLAC) or [other tools like it](https://www.reddit.com/r/FREEMEDIAHECKYEAH/wiki/audio/#wiki_.25B7_audio_ripping_tools)

### Other Streaming Services {#streaming-services}

Same story as Spotify. The only focus is local + YouTube, keeping them both polished is already a lot of work.

### LastFm Scrobbling {#lastfm}

Use [PanoScrobbler](https://github.com/kawaiiDango/pano-scrobbler), it works with any player (Android, Windows and Linux) and has lots of features.
It reads the media notification, which is enough for most.
Namida also shares the MusicBrainz ids from your tags (Android), so ListenBrainz scrobbles from PanoScrobbler can match the exact recording instead of a guess from title and artist. `🆕 v8.2.0` [`🎉 Automation & Other Apps ↗`](/features/automation/#what-apps-can-do)

A built-in scrobbler isn't planned because:

- It would work the same, Namida already sends the full track info through the media session (SMTC/MPRIS on desktop).
- The battery cost of a separate app is negligible, Android delivers the media notification anyway, and a built-in scrobbler would make the same network requests.
- It doesn't stop at scrobbling. Next come other services (ListenBrainz, Libre.fm, Maloja, etc), syncing loves with favourites, scrobble edits and blocklists, a whole scrobbler app inside a player.
- Account security. A scrobbler has to store your account tokens plus an api secret that can't really be hidden in a source available app.

Namida keeps its own history and stats locally, and you can import your LastFm history into it. [`🎉 History ↗`](/features/playlists-history/#history) [`⚙️ Configure Imports ↗`](/settings/7-backup-restore-settings/#import-data)

### CUE Sheets {#cue-sheets}

Albums stored as one big file with a `.cue` sheet show as a single track. In Namida, each track is its own file, and most features are built around that (tag editing, lyrics files, deleting, sharing, waveform). A track that is only a part of a bigger file would only work halfway in most of them.
Splitting the album once doesn't lose any quality, and gives proper tracks that work everywhere. [`📒 Split a CUE album ↗`](/guides/medium/#split-cue)

### Delete Missing Tracks {#delete-missing-tracks}

Removing missing tracks from history, playlists and queues all at once goes against [preservation](/#philosophy), the main principle of Namida:

- Listens show what you played at that time, even after the file is gone.
- A playlist can keep a record of tracks, whether their files exist or not.
- A missing track isn't always deleted (moved, renamed, SD card removed, etc). Updating its path keeps its stats and listens. [`📒 Missing Tracks Guide ↗`](/guides/medium/#missing-paths)

Playing a missing track opens a dialog to update its path, and skips to the next track after a few seconds. To clean one up, remove it from the playlists and queues you find it in, and its listens from history one by one.

### Marquee Effect {#marquee}

Scrolling text is distracting and doesn't look so good. Long texts get faded out instead.

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
