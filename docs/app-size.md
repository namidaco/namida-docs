---
title: "App Size"
description: "What the Namida APK contains and why it is this big"
---

# App Size

What the Android APK contains, and why Namida doesn't drop features or speed to make it smaller.
The sizes come from the `arm64-v8a` APK of v8.5.0 beta, which is 55.5 MB.

### What's Inside {#whats-inside}

| Part | Size | What it's for |
| --- | ---: | --- |
| FFmpeg | 13.2 MB | Merges YouTube video and audio, removes sponsor segments, splits chapters, converts files, makes video thumbnails and compresses images. It also reads the tags that TagLib can't, and decodes audio for the [waveform seekbar](/features/playback/#waveform), tempo and key detection and the lossless check. |
| Namida's code | 12.3 MB | Every feature and screen of Namida and the libraries it uses (like the YouTube client, SFTP and SMB), with its 30 languages. |
| Flutter engine | 5.2 MB | Draws the whole interface. |
| Images | 4.4 MB | The 17 [app icon](/settings/4-customization-settings/#app-icon) styles (the launcher icons and their previews in the app), the jellyfish mascot art (1.6 MB) and other images. |
| Android code | 4.1 MB | The Android player (about a quarter of it), notifications, the [home screen widget](/features/home-widget/) and the in-app web view. |
| JavaScript engine | 3.9 MB | Runs YouTube's player code, which YouTube playback and downloads need. |
| Playback decoders | 3.4 MB | Play the formats that Android can't play on its own (like APE, WavPack, WMA, ALAC, AC3, DTS and WMV), and AV1 videos on devices without AV1 support. |
| Network client | 2.9 MB | Faster network requests for artworks, lyrics, YouTube and downloads. |
| Android resources | 1.7 MB | Layouts and texts of the Android parts. |
| Database | 1.0 MB | SQLite, which holds the library, the stats and the caches. |
| Tag reader | 0.7 MB | TagLib, reads and writes tags while indexing and in the [tag editor](/features/tag-editor/). |
| Other | 2.7 MB | Fonts, small helpers (drag and drop, Japanese romanization, USB DAC output and sound effects), licenses and packaging. |

### Why Not Smaller {#why-not-smaller}

- **FFmpeg is built for speed.** Since v8.5.0, FFmpeg is built to run fast instead of to be small. It decodes 3 to 16% faster, so waveforms, tempo and key detection and the lossless check finish sooner. It made the APK 2.6 MB bigger (52.9 MB to 55.5 MB).
- **The player has its own decoders.** The playback decoders are a separate FFmpeg build that only decodes, made for the Android player. The big FFmpeg covers everything else.

What keeps it from growing more:

- One APK per architecture. Each APK only has the code for its own device type (`arm64-v8a` or `armeabi-v7a`), see [Which file](/installation/#android-files).
- Parts that only some people use are downloaded when you turn them on. For example the dictionary for [Romanization](/settings/6-extras-settings/#romanization) is a one time download (about 13.5 MB).

### Installed Size {#installed-size}

Native code is stored compressed in the APK, which keeps the download at about 55 MB. Android unpacks that code when installing (about 100 MB) and keeps the APK too, so the installed app takes about 155 MB (before your data and cache).
Storing the code uncompressed would make both the download and the installed app about 110 MB. Namida keeps the smaller download.

### Other Platforms {#other-platforms}

The other builds have the same parts, with a few differences:

- **Windows**: the installer is about 55 MB and the installed app takes about 190 MB. Of that, FFmpeg takes 50 MB, the mpv player (which plays audio and video on desktop) 28 MB and the video renderer 18 MB.
- **iOS**: the IPA is 72 MB. The 17 app icon styles take 24 MB of it, because iOS stores every icon size of every style. Namida's code takes 18 MB and FFmpeg 8 MB.
- **macOS**: the `universal` zip is 99 MB. It runs on both Intel and Apple Silicon Macs, so it has every piece of code twice. The `arm64` zip (Apple Silicon) is about 51 MB and the `x86_64` zip (Intel) is about 54 MB.

Linux builds aren't listed, their size depends a lot on the format (some use the system's libraries and others bundle everything), but they generally follow the same rules above.

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
