---
title: "Not Planned"
description: "Features that will not be added, and why"
---

# Not Planned

Features that will not be added to Namida, and the reasoning behind each. The only focus is local library + YouTube.

### Spotify {#spotify}

Not planned.
Importing your Spotify history is supported, but that's all.

The reason is simply that Spotify is notorious for blocking any attempt at unofficial clients. Even if Namida implements it, it will simply be hit by a DMCA and no longer have support.

What you can do as an alternative is convert your Spotify playlists to YTM, then log in inside Namida to view your YT playlists.
We are barely keeping YT support alive as is.

Alternatives: [spotiflac](https://github.com/spotbye/SpotiFLAC) or [other tools like it](https://www.reddit.com/r/FREEMEDIAHECKYEAH/wiki/audio/#wiki_.25B7_audio_ripping_tools)

### Other Streaming Services {#streaming-services}

Same story as Spotify. The only focus is local + YouTube, keeping them both polished is already a lot of work.

### LastFm Scrobbling {#lastfm}

Use [PanoScrobbler](https://github.com/kawaiiDango/pano-scrobbler), it works with any player and has lots of features.

### Discord Rich Presence (RPC) {#discord-rpc}

Use [Kizzy](https://github.com/dead8309/Kizzy) on android, or [Music Presence](https://github.com/ungive/discord-music-presence) on desktop. They work with any player.

### Advanced Equalizer Features {#equalizer}

Namida's equalizer is simple and uses native android effects, we always recommend using system wide EQ apps for a better experience and more features.
Most extra features require writing a custom audio engine, or making sure every android version supports the effect, none of these are planned.

- If you have root, you can use JamesDSP or Viper4Android.
- Otherwise use [Equalizer314](https://f-droid.org/en/packages/com.bearinmind.equalizer314) or [RootlessJamesDSP](https://f-droid.org/en/packages/me.timschneeberger.rootlessjamesdsp).

### Marquee Effect {#marquee}

Scrolling text is distracting and doesn't look so good. Long texts get faded out instead.

---

<sub>by @claude</sub>
