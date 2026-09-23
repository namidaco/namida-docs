---
title: "FAQ"
description: "Frequently Asked Questions"
---

# Frequently Asked Questions

### Do I need to pay to use YouTube? {#youtube-membership}

No. Searching, playing, liking, downloading, browsing your playlists and most other things are free.

- A membership unlocks some newly added YouTube features, on top of supporting the project. They only make sense when signed in to your account.
- Get it through [Patreon](https://patreon.com/namidaco). Donations through [kofi](https://ko-fi.com/namidaco) or [buymeacoffee](https://buymeacoffee.com/namidaco) get a coupon by email, which can take a few days.
- Sign in from Settings -> Youtube -> Manage Your Accounts -> Add account. [`⚙️ Configure Accounts ↗`](/settings/5-youtube-settings/#accounts)
- [More about membership features](https://www.patreon.com/posts/namida-yt-112913142).

### YouTube is slow or broken {#youtube-broken}

YouTube updates can break clients from time to time, fixes are available in beta first.

1. Try the latest [beta release](https://github.com/namidaco/namida-snapshots/releases).
2. Sign in to your account, it can improve download speed and fix some playback issues. [`⚙️ Configure Accounts ↗`](/settings/5-youtube-settings/#accounts)
3. Disable any VPN, custom DNS or proxy.
4. If YouTube is restricted in your area, try a different VPN instead.

### Where do lyrics come from? {#lyrics-source}

- [LRCLIB](https://lrclib.net)
- [KuGou](https://lyrics.kugou.com) `🆕 v7.0.0`

See [Lyrics](/settings/6-extras-settings/#lyrics) for the full lookup order.

### Can I change the lyrics source? {#change-lyrics-source}

Not directly, but you can provide your own lyrics per track:

- Long press the lyrics icon in the player and add an LRC file, or paste the lyrics in the lyrics tag using the tag editor.
- Put an `.lrc` file next to the song with the same filename. Subtitle files (`.srt`, `.vtt`, `.sbv`, `.ssa`, `.ass`) work too.
- Set [Prioritize embedded lyrics](/settings/6-extras-settings/#lyrics) depending on where you usually keep them.

### I added lyrics but they don't show (or keep showing old ones) {#lyrics-not-showing}

Namida caches the lyrics it finds for a track, and the cached copy wins over anything you add later. Delete it:

1. Long press the lyrics icon in the player.
2. Every lyrics found for this track is listed, labeled with its source: `Cache`, `Local`, the provider name, or the embedded tag.
3. Press the trash icon on the cached one.
4. Press done, the new lyrics get picked up.

If they still don't show, check [Prioritize embedded lyrics](/settings/6-extras-settings/#lyrics):

- **On**, if the file has embedded lyrics, nothing else is looked at. Turn it on if you pasted lyrics in the tag, off if you added an `.lrc` file.
- **Off**, the order is: cached lyrics -> `.lrc` file next to the track -> embedded tag -> online databases.

::: callout tip
Also make sure the `.lrc` file sits next to the track and has the same filename, and that the [Lyrics Source](/settings/6-extras-settings/#lyrics) is not set to Internet only.
:::

### Can I use a custom app icon? {#custom-app-icon}

You can pick from the icons that ship with Namida, but a fully custom one is not possible, Android requires all icons to be configured beforehand. See [App Icon](/settings/4-customization-settings/#app-icon), you can also submit an icon there, or use a launcher that supports icon packs.

### Why aren't smart playlists treated as normal playlists? {#smart-playlists}

They are a different thing. A smart playlist is only a set of rules, and its tracks are found only when you open it.

- Listing them with normal playlists means finding the tracks of every smart playlist all the time, which would easily hurt performance.
- Tracks can't be added to a smart playlist manually, the rules decide what's in it. Mixing them with normal playlists would make that confusing.

See [`🎉 Smart Playlists feature ↗`](/features/playlists-history/#smart-playlists)

### Is there a LastFm scrobble feature? {#lastfm}

No, and not planned. Use [PanoScrobbler](https://github.com/kawaiiDango/pano-scrobbler), see [Not Planned](/not-planned/#lastfm).

### Is there a Discord Rich Presence (RPC) feature? {#discord-rpc}

No, and not planned. There are apps that work with any player, see [Not Planned](/not-planned/#discord-rpc).

### Equalizer issues or missing features {#equalizer}

Namida's equalizer is simple by design, system wide EQ apps are recommended instead, see [Not Planned](/not-planned/#equalizer) for the reasoning and app suggestions.

### Can't install the APK, Google blocks it {#play-protect}

Play Protect scans apps installed from outside Google Play and sometimes blocks them, the dialog says the app was blocked or wasn't scanned.

- Tap "More details" then "Install anyway" in the dialog.
- If it keeps blocking, open Play Store -> profile icon -> Play Protect -> settings icon, and turn off "Scan apps with Play Protect", then install and turn it back on.

See [`📒 Installation Guide ↗`](/installation/#android) for which file to download.

### Is Namida available on Google Play? {#google-play}

No, and not planned.
See [Not Planned](/not-planned/#google-play) for the reasoning, and [`📒 Installation Guide ↗`](/installation/#android) for where to get it.

### Is Spotify supported? {#spotify}

No, and not planned. Importing your Spotify history is supported, but that's all. See [Not Planned](/not-planned/#spotify) for the reasoning and alternatives.

### Some FLAC files go silent at some point {#flac-silent}

Check the source you got them from, or re-encode the file with ffmpeg at compression level 5:

```bash
ffmpeg -y -i "path/to/file.flac" -map 0 -c:a flac -compression_level 5 -c:v copy "path/to/output.flac"
```

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
