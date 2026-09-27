---
title: "Subtitles"
description: "Subtitles & captions for videos"
---

# Subtitles

`🆕 v7.0.0`

Namida can show subtitles for anything it plays as a video, YouTube videos and local videos alike.

### Turning Them On {#enable}

Press the subtitle icon in the video controls, at the top of the player. The list shows every subtitle Namida found for what is playing, pick one and it starts right away. Pick "Disable" to turn them off again.

The icon only appears when the current video has subtitles.

::: callout info
The choice is remembered, once subtitles are on they stay on for the next videos too.
:::

### Where They Come From {#sources}

Three places, all listed together in the same menu:

- **YouTube captions**, every caption track the video offers, including the auto generated ones.
- **Subtitle files** sitting next to your video, with the same filename. `.srt`, `.vtt`, `.ass`, `.ssa`, `.sbv`, `.lrc`, `.xml` & `.ttml` are supported.
- **Subtitles inside the video file itself**, the ones embedded in the video.

For local music, Namida also looks next to the video linked to the track, not only next to the track file. [`🎉 Video Integration ↗`](/features/playback/#video)

Example, this video and subtitle file match:

```text
Interstellar (2014).mkv
Interstellar (2014).srt
```

### Language {#language}

Namida picks a subtitle for you when it can. It follows your app language first, then English.

Picking a language yourself moves it to the top of that list for the next videos. A normal track always wins over an auto generated one in the same language.

### Styling {#styling}

Styled subtitles (`.ass` and `.ssa`) keep their original look, fonts, colors and positioning, on Windows and Linux. Everywhere else they are shown as plain text under the video.

YouTube captions that come with colors keep them on every platform, along with bold, italic, underline and the karaoke highlight that moves along the line. `🆕 v7.4.0`

::: callout info
Image based subtitles (the kind found in some rips) can only be drawn on Windows and Linux. They still appear in the list elsewhere, but greyed out.
:::

---

### Related {#related}

- [🎉 Playback, Video Integration](/features/playback/#video)
- [🎉 YouTube feature](/features/youtube/)
- [⚙️ Extras, Lyrics](/settings/6-extras-settings/#lyrics)

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
