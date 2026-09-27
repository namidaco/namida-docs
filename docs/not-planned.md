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

### Spotify {#spotify}

Not planned. Importing your Spotify history is supported, but that's all.

Spotify is notorious for blocking unofficial clients. Even if Namida added support, a DMCA takedown would end it quickly. We are barely keeping YouTube support alive as is.

As an alternative, convert your Spotify playlists to YouTube Music, then sign in inside Namida to access them.

Alternatives: [spotiflac](https://github.com/spotbye/SpotiFLAC) or [other tools like it](https://www.reddit.com/r/FREEMEDIAHECKYEAH/wiki/audio/#wiki_.25B7_audio_ripping_tools)

### Other Streaming Services {#streaming-services}

Same story as Spotify. The only focus is local + YouTube, keeping them both polished is already a lot of work.

### LastFm Scrobbling {#lastfm}

Use [PanoScrobbler](https://github.com/kawaiiDango/pano-scrobbler), it works with any player and has lots of features.

### Discord Rich Presence (RPC) {#discord-rpc}

Use [Kizzy](https://github.com/dead8309/Kizzy) on Android, or [Music Presence](https://github.com/ungive/discord-music-presence) on desktop. They work with any player.

### Advanced Equalizer Features {#equalizer}

Namida's equalizer is simple and uses native Android effects, we always recommend using system wide EQ apps for a better experience and more features.
Anything beyond that needs a custom audio engine, or making sure each Android version supports the effect, none of these are planned.

- If you have root, you can use JamesDSP or Viper4Android.
- Otherwise use [Equalizer314](https://f-droid.org/en/packages/com.bearinmind.equalizer314) or [RootlessJamesDSP](https://f-droid.org/en/packages/me.timschneeberger.rootlessjamesdsp).

### Marquee Effect {#marquee}

Scrolling text is distracting and doesn't look so good. Long texts get faded out instead.

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
