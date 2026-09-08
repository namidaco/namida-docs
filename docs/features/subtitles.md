---
title: "Subtitles"
description: "Subtitles & captions for videos"
---

# Subtitles

`🆕 v7.0.0`

Namida can show subtitles for anything it plays as a video, YouTube videos and local videos alike.

### Turning Them On {#enable}

Press the subtitle icon in the video controls, at the top of the player. The list shows every subtitle Namida found for what is playing, pick one and it starts right away. Pick "Disable" to turn them off again.

The icon only appears when the current video can actually have subtitles, so an empty top row means there is nothing to show.

::: callout info
The choice is remembered, once subtitles are on they stay on for the next videos too.
:::

### Where They Come From {#sources}

Three places, all listed together in the same menu:

- **YouTube captions**, every caption track the video offers, including the auto generated ones.
- **Subtitle files** sitting next to your video, with the same filename. `.srt`, `.vtt`, `.ass`, `.ssa`, `.sbv`, `.lrc`, `.xml` & `.ttml` are supported.
- **Subtitles inside the video file itself**, the ones muxed into the container.

For local music, Namida also looks next to the video linked to the track, not only next to the track file. [`🎉 Video Integration ↗`](/features/playback/#video)

Example, this video and subtitle file match:

```text
Interstellar (2014).mkv
Interstellar (2014).srt
```

### Language {#language}

Namida picks a subtitle for you when it can. It follows your app language first, then English.

Every time you pick a language yourself, it moves to the top of that list, so the next videos follow your taste. A normal track always wins over an auto generated one of the same language.

### Styling {#styling}

Styled subtitles (`.ass` and `.ssa`) keep their original look, fonts, colors and positioning, on Windows and Linux. Everywhere else they are shown as plain text under the video.

::: callout info
Image based subtitles (the kind found in some rips) can only be drawn on Windows and Linux. They still appear in the list elsewhere, but greyed out.
:::

---

### Related {#related}

- [🎉 Playback, Video Integration](/features/playback/#video)
- [🎉 YouTube feature](/features/youtube/)
- [⚙️ Extras, Lyrics](/settings/6-extras-settings/#lyrics)

---

<sub>by @claude</sub>
