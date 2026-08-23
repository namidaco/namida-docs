---
type: concept
title: FAQ
description: "Frequently Asked Questions"
source: "https://docs.myproject.com/faq/"
path: /faq/
updated: 2026-08-23
okf:
  generated_by: "@docmd/plugin-okf"
  generated_at: "2026-08-23T02:03:51.253Z"
---
---
title: "FAQ"
description: "Frequently Asked Questions"
---

# Frequently Asked Questions

### Do I need to pay to use youtube?

- Not really, searching, playing videos, liking or downloading, seeing your playlists (and many others) is totally free.
- getting a membership means u access newly added yt features (beside supporting), these features only make sense when you are logged in your yt account.
- you can get a membership throught patreon on https://patreon.com/namidaco
- if you have donated throught [kofi](https://ko-fi.com/namidaco) or [buymeacoffee](https://buymeacoffee.com/namidaco), you should get a coupon on ur email, altho not instant as patreon and may take more than few days
- you can log in from Settings -> Youtube -> Manage your accounts -> Add account to access your playlists and like videos/etc.
- for more info about these features https://www.patreon.com/posts/namida-yt-112913142

### Slow/Broken yt loading/downloads

This can happen frequently when youtube pushes updates that break clients.
Most yt issues are fixed asap in beta, try latest beta from here https://github.com/namidaco/namida-snapshots/releases

### Lyrics Source

https://lrclib.net/

### Change Lyrics Source

- not possible directly
- you can select the LRC file (by long pressing lyrics icon in miniplayer -> add) or just edit tags and paste the lyrics in the lyrics section
- you can also copy the LRC file and put it in the same directory as the song, it will appear as long as the filename is the same as the song
- make sure "Prioritize embedded lyrics" is enabled/disabled depending on where u put the lyrics generally

### Is there a lastfm scrobble feature?

No, and not planned use PanoScrobbler https://github.com/kawaiiDango/pano-scrobbler. works with any player and has lots of features

### Is there a discord rich presence feature (RPC)?

No, and not planned use:

- Kizzy on android https://github.com/dead8309/Kizzy
- music presence on desktop https://github.com/ungive/discord-music-presence
  they work with any player

### Equalizer issues or missing feature

namida equalizer is simple and uses native android effects, always recommend using system wide eq apps for better experience and more features.
most extra features require writing custom audio engine or make sure every android version supports this effect, none of these are planned.
if you have root you can use jamesdsp or viper4android.
otherwise use [Equalizer314](https://f-droid.org/en/packages/com.bearinmind.equalizer314) or [RootlessJamesDSP](https://f-droid.org/en/packages/me.timschneeberger.rootlessjamesdsp).

### Spotify Support

Not planned.
Importing spotify history was added recently [in beta](https://github.com/namidaco/namida-snapshots/releases)
but that's all.

Reason is simply spotify is notorious for blocking any attempts at any unofficial clients. even if namida implements that, it will simply be hit by a dmca and no longer have support.

What u can do as an alternative is convert ur spotify playlists to ytm, then login in namida to view ur yt playlists.
we barely keeping yt support alive as is.

Alternatives: [spotiflac](https://github.com/spotbye/SpotiFLAC) or [other tools like it](https://www.reddit.com/r/FREEMEDIAHECKYEAH/wiki/audio/#wiki_.25B7_audio_ripping_tools)

### Some FLAC files have no sound at some point

check the source u got it from, try using ffmpeg with a compression level of 5 on the file

```bash
ffmpeg -y -i "path/to/file.flac" -map 0 -c:a flac -compression_level 5 -c:v copy "path/to/output.flac"
```
