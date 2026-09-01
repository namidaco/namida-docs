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

### Slow/Broken YouTube loading/downloads (YouTube playback issues)

This can happen frequently when YouTube pushes updates that break clients.
Most YT issues are fixed asap in beta, try the latest beta from here: https://github.com/namidaco/namida-snapshots/releases.
Signing in can also provide better download speed and fix some playback issues. [`⚙️ Configure Accounts ↗`](/settings/5-youtube-settings/#accounts).
If the issue persists, try disabling VPN/DNS/Proxy if you have any enabled.
YouTube could also be restricted in certain areas, try a different VPN in that case.

### Lyrics Source

https://lrclib.net/

### Change Lyrics Source

- Not possible directly.
- You can select the LRC file (by long pressing the lyrics icon in the miniplayer -> add), or just edit tags and paste the lyrics in the lyrics field.
- You can also copy the LRC file and put it in the same directory as the song, it will appear as long as the filename is the same as the song's.
- Make sure "Prioritize embedded lyrics" is enabled/disabled depending on where you generally put the lyrics.

### Can I use a custom app icon? {#custom-app-icon}

You can pick from the icons that ship with Namida, but a fully custom one is not possible, Android requires all icons to be configured beforehand. See [App Icon](/settings/4-customization-settings/#app-icon), you can also submit an icon there, or use a launcher that supports icon packs.

### Is there a lastfm scrobble feature?

No, and not planned. Use [PanoScrobbler](https://github.com/kawaiiDango/pano-scrobbler), see [Not Planned](/not-planned/#lastfm).

### Is there a discord rich presence feature (RPC)?

No, and not planned. There are apps that work with any player, see [Not Planned](/not-planned/#discord-rpc).

### Equalizer issues or missing feature

Namida's equalizer is simple by design, system wide EQ apps are recommended instead, see [Not Planned](/not-planned/#equalizer) for the reasoning and app suggestions.

### Is Namida available on Google Play?

No, and not planned.
See [Not Planned](/not-planned/#google-play) for the reasoning, and [`📒 Installation Guide ↗`](/installation/#android) for where to get it.

### Spotify Support

Not planned. Importing your Spotify history is supported, but that's all. See [Not Planned](/not-planned/#spotify) for the reasoning and alternatives.

### Some FLAC files have no sound at some point

Check the source you got it from, and try using ffmpeg with a compression level of 5 on the file:

```bash
ffmpeg -y -i "path/to/file.flac" -map 0 -c:a flac -compression_level 5 -c:v copy "path/to/output.flac"
```
