---
title: "FAQ"
description: "Frequently Asked Questions"
---

# Frequently Asked Questions

### Do I need to pay to use YouTube? {#youtube-membership}

No. Searching, playing, liking, downloading, browsing your playlists and most other things are free.

- A membership unlocks some newly added YouTube features (on top of supporting the project). They only make sense when signed in to your account.
- Get it through [Patreon](https://patreon.com/namidaco). Donations through [kofi](https://ko-fi.com/namidaco) or [buymeacoffee](https://buymeacoffee.com/namidaco) get a coupon by email (which can take a few days).
- Sign in from Settings -> Youtube -> Manage Your Accounts -> Add account. [`⚙️ Configure Accounts ↗`](/settings/5-youtube-settings/#accounts)
- See [Membership](/membership/) for what it unlocks and how to get it.

### YouTube is slow or broken {#youtube-broken}

YouTube updates can break clients from time to time, fixes are available in beta first.

1. Try the latest [beta release](https://github.com/namidaco/namida-snapshots/releases).
2. Sign in to your account, it can improve download speed and fix some playback issues. [`⚙️ Configure Accounts ↗`](/settings/5-youtube-settings/#accounts)
3. Disable any VPN, custom DNS or proxy.
4. If YouTube is restricted in your area, try a different VPN instead.

### Sync devices can't find or connect {#sync-troubleshooting}

1. Make sure both devices run the same Namida version and are on the same network. Guest networks and some routers keep devices apart, and a VPN can get in the way too.
2. Device not found? Connect by IP instead (using the address shown under Server on the other device). [`🎉 Connect by IP ↗`](/features/sync/#connect-by-ip)
3. Found, but connecting fails or times out? A firewall on the server device is blocking Namida, allow it:
   - Windows: set your network to Private, then allow Namida in Windows Security -> Firewall & network protection -> Allow an app through firewall.
   - Linux with ufw: `sudo ufw allow 62310/tcp`
   - Linux with firewalld: `sudo firewall-cmd --permanent --add-port=62310/tcp && sudo firewall-cmd --reload`
   - If the device isn't found either, allow `5353/udp` the same way.
4. Worked before and suddenly stopped? Turn your network adapter off and on again, or restart the device.
5. Still stuck? Press Diagnostics on both devices, and share both reports in a [GitHub issue](https://github.com/namidaco/namida/issues). [`🎉 Diagnostics ↗`](/features/sync/#diagnostics)

### Where do lyrics come from? {#lyrics-source}

- [LRCLIB](https://lrclib.net)
- [KuGou](https://lyrics.kugou.com) `🆕 v7.0.0`

See [Lyrics](/settings/6-extras-settings/#lyrics) for the full lookup order.

### Can I change the lyrics source? {#change-lyrics-source}

Not directly, but you can provide your own lyrics per track:

- Long press the lyrics icon in the player and add an LRC file, or paste the lyrics in the lyrics tag using the tag editor.
- Or write and sync them yourself. `🆕 v8.0.0` [`🎉 Lyrics Editor ↗`](/features/lyrics-editor/)
- Or embed any of them into the track, from their ⋮ menu in the same list. [`🎉 Lyrics Picker ↗`](/features/playback/#lyrics-picker)
- Put an `.lrc` file next to the song with the same filename, or in one of your [lyrics folders](/settings/6-extras-settings/#lyrics-folders). Subtitle files (`.srt`, `.vtt`, `.sbv`, `.ssa`, `.ass`) and `.txt` for plain lyrics work too.
- Set [Prioritize embedded lyrics](/settings/6-extras-settings/#lyrics) depending on where you usually keep them.

### I added lyrics but they don't show (or keep showing old ones) {#lyrics-not-showing}

Namida caches the lyrics it finds for a track, and the cached copy wins over anything you add later.
Setting the [Lyrics Save Location](/settings/6-extras-settings/#lyrics-save-location) to Track folder or Lyrics folders avoids this (files there are checked before the cache). Otherwise, delete the cached copy:

1. Long press the lyrics icon in the player.
2. All lyrics found for this track are listed, labeled with its source: `Cache`, `Local`, the provider name, or the embedded tag. The ones in use are marked Active.
3. Open the ⋮ menu on the cached one and press Delete.
4. Press done, the new lyrics get picked up.

Or simply tap the lyrics you want and press Save.

If they still don't show, check [Prioritize embedded lyrics](/settings/6-extras-settings/#lyrics):

- **On**, if the file has embedded lyrics, nothing else is looked at. Turn it on if you pasted lyrics in the tag, off if you added an `.lrc` file.
- **Off**, the order is: cached lyrics -> `.lrc` file next to the track or in lyrics folders -> embedded tag -> `.txt` files -> online databases. If the Lyrics Save Location is Track folder or Lyrics folders, the `.lrc` file is checked before the cached lyrics instead.

::: callout tip
Also make sure the `.lrc` file sits next to the track and has the same filename, and that the [Lyrics Source](/settings/6-extras-settings/#lyrics) is not set to Internet only.
:::

### Can I use a custom app icon? {#custom-app-icon}

You can pick from the icons that ship with Namida, but a fully custom one is not possible (Android only allows icons that are already built into the app).
See [App Icon](/settings/4-customization-settings/#app-icon), where you can also submit an icon, or use a launcher that supports icon packs.

### Why aren't smart playlists treated as normal playlists? {#smart-playlists}

They are a different thing. A smart playlist is only a set of rules, and its tracks are found only when you open it.

- Listing them with normal playlists means finding the tracks of every smart playlist all the time, which would easily hurt performance.
- Tracks can't be added to a smart playlist manually (the rules decide what's in it). Mixing them with normal playlists would make that confusing.

See [`🎉 Smart Playlists feature ↗`](/features/smart-playlists/)

### Is there a LastFm scrobble feature? {#lastfm}

No, and not planned. Use [PanoScrobbler](https://github.com/kawaiiDango/pano-scrobbler), see [Not Planned](/not-planned/#lastfm).

### Is there a Discord Rich Presence (RPC) feature? {#discord-rpc}

No, and not planned. There are apps that work with any player, see [Not Planned](/not-planned/#discord-rpc).

### Can I use my AutoEq or Equalizer APO settings? {#equalizer}

Yes, import your `ParametricEQ.txt` file, or paste it with Import -> From clipboard in the equalizer.
For a system wide equalizer that also works for other apps, use [Equalizer314](https://f-droid.org/en/packages/com.bearinmind.equalizer314) or [RootlessJamesDSP](https://f-droid.org/en/packages/me.timschneeberger.rootlessjamesdsp) on Android (but they don't apply while USB direct access is in use). [`🎉 Equalizer ↗`](/features/playback/#equalizer)

### Android asks for USB DAC access every time I plug it in {#usb-dac-permission}

Android forgets the access once the DAC is unplugged, unless Namida is set as the DAC's default app in that dialog.
Android only offers "always" for DACs without a microphone (since Namida doesn't ask for microphone access). Nothing is wrong with your DAC. [`🎉 USB Direct Access ↗`](/features/playback/#usb-direct)

### Can't install the APK, Google blocks it {#play-protect}

Play Protect scans apps installed from outside Google Play and sometimes blocks them (the dialog says the app was blocked or wasn't scanned).

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
