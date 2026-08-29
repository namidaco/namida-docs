---
type: concept
title: FAQ
description: "Frequently Asked Questions"
source: "https://namidaco.github.io/namida_docs/v2/faq/"
path: /v2/faq/
version: v2
updated: 2026-08-28
okf:
  generated_by: "@docmd/plugin-okf"
  generated_at: "2026-08-28T12:46:29.888Z"
---
---
title: "FAQ"
description: "Frequently Asked Questions"
---

# Frequently Asked Questions

### Do I need to pay to use youtube?

- Not really, searching, playing videos, liking or downloading, seeing your playlists (and many others) are totally free.
- Getting a membership means you get access to newly added YT features (besides supporting), these features only make sense when you are logged in to your YT account.
- You can get a membership through Patreon on https://patreon.com/namidaco
- If you have donated through [kofi](https://ko-fi.com/namidaco) or [buymeacoffee](https://buymeacoffee.com/namidaco), you should get a coupon in your email, although it's not instant like Patreon and may take more than a few days.
- You can log in from Settings -> Youtube -> Manage your accounts -> Add account to access your playlists, like videos, etc.
- For more info about these features: https://www.patreon.com/posts/namida-yt-112913142

### Slow/Broken YouTube loading/downloads

This can happen frequently when youtube pushes updates that break clients.
Most YT issues are fixed asap in beta, try the latest beta from here: https://github.com/namidaco/namida-snapshots/releases

### Lyrics Source

https://lrclib.net/

### Change Lyrics Source

- Not possible directly.
- You can select the LRC file (by long pressing the lyrics icon in the miniplayer -> add), or just edit tags and paste the lyrics in the lyrics field.
- You can also copy the LRC file and put it in the same directory as the song, it will appear as long as the filename is the same as the song's.
- Make sure "Prioritize embedded lyrics" is enabled/disabled depending on where you generally put the lyrics.

### Is there a lastfm scrobble feature?

No, and not planned. Use [PanoScrobbler](https://github.com/kawaiiDango/pano-scrobbler), it works with any player and has lots of features.

### Is there a discord rich presence feature (RPC)?

No, and not planned. Use:

- [Kizzy](https://github.com/dead8309/Kizzy) on android
- [Music Presence](https://github.com/ungive/discord-music-presence) on desktop

They work with any player.

### Equalizer issues or missing feature

Namida's equalizer is simple and uses native android effects, we always recommend using system wide EQ apps for a better experience and more features.
Most extra features require writing a custom audio engine, or making sure every android version supports the effect, none of these are planned.
If you have root, you can use JamesDSP or Viper4Android.
Otherwise use [Equalizer314](https://f-droid.org/en/packages/com.bearinmind.equalizer314) or [RootlessJamesDSP](https://f-droid.org/en/packages/me.timschneeberger.rootlessjamesdsp).

### Spotify Support

Not planned.
Importing spotify history was added recently [in beta](https://github.com/namidaco/namida-snapshots/releases), but that's all.

The reason is simply that spotify is notorious for blocking any attempt at unofficial clients. Even if Namida implements that, it will simply be hit by a DMCA and no longer have support.

What you can do as an alternative is convert your spotify playlists to YTM, then log in inside Namida to view your YT playlists.
We are barely keeping YT support alive as is.

Alternatives: [spotiflac](https://github.com/spotbye/SpotiFLAC) or [other tools like it](https://www.reddit.com/r/FREEMEDIAHECKYEAH/wiki/audio/#wiki_.25B7_audio_ripping_tools)

### Some FLAC files have no sound at some point

Check the source you got it from, and try using ffmpeg with a compression level of 5 on the file:

```bash
ffmpeg -y -i "path/to/file.flac" -map 0 -c:a flac -compression_level 5 -c:v copy "path/to/output.flac"
```
