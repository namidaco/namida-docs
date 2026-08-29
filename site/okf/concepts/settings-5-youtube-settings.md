---
type: concept
title: Youtube
description: "Customize Youtube experience"
source: "https://namidaco.github.io/namida_docs/settings/5-youtube-settings/"
path: /settings/5-youtube-settings/
version: v6.5.0
updated: 2026-08-29
okf:
  generated_by: "@docmd/plugin-okf"
  generated_at: "2026-08-29T01:43:41.454Z"
---
---
title: "Youtube"
description: "Customize Youtube experience"
---

# Youtube

Settings for the [YouTube](/features/youtube/) section.

### Manage Your Accounts {#accounts}

Sign in to your account, or multiple accounts, to interact with videos and get personalized content.

### SponsorBlock {#sponsorblock}

Skip sponsor segments in videos, powered by [SponsorBlock](https://sponsor.ajay.app/).

- Enable SponsorBlock.
- Hide skip button after a set time.
- Minimum segment duration, segments shorter than this are ignored.
- Categories: Sponsor, Self Promotion, Intro, Outro, Filler, Preview, Music Offtopic, Highlight and Interaction Reminder.
- Per category behavior: Auto Skip, Auto Skip Once, Show Skip button, Show in Seekbar, or disabled.

### Return Youtube Dislike {#return-youtube-dislike}

Show the dislike count on videos, data is provided by [returnyoutubedislike.com](https://returnyoutubedislike.com/).

### Miniplayer {#miniplayer}

- Youtube-style Miniplayer.
- Remember audio only mode.
- Dim miniplayer after a set number of seconds of inactivity, along with the dim intensity.
- Seekbar behavior, tap to seek and drag to seek.

### Content {#content}

- Show Shorts in & Show Mixes in, control where shorts and mix playlists appear.
- Show channel watermark in fullscreen.
- Show video endcards.
- Auto start radio, automatically adds a mix playlist when playing a single track.
- Personalized Related Videos (disabling this will increase data usage, because it means fetching another page without account info).
- Personalized Mix Playlists.
- Enable Search Cleanup, hide garbage unrelated search results.

### Comments {#comments}

- Top comments, display comments at top instead of bottom.
- Prefer new comments when possible, the cached version will only be used when there is no connection.

### Downloads {#downloads}

- Downloads Metadata tags, extract artist, title & album from video info by default.
- Default Download Location.
- Download notifications `Windows+Linux only`.

### On Opening Youtube Link {#on-opening-youtube-link}

Choose what happens when opening a YouTube link with Namida: Play, Add to Queue, Add to Playlist, Download, Always Ask, etc..

### Flags {#flags}

Hidden experimental options, opened by pressing the flag icon at the top of the Youtube settings card:

- `MARK_VIDEO_WATCHED`, mark videos as watched on your account.
- `TRY_EXTRACT_TAGS_INFO_FROM_DESCRIPTION`, pull tag info from the video description if needed.
- `INNERTUBE_CLIENT`, change the client used for requests, can fix playback issues.
- `WHITE_VIDEO_BG_IN_LIGHT_MODE`, fullscreen video will have app background color, not pure black.
- `ENABLE_DIM_IN_LIGHT_MODE`, dimming miniplayer also works in light mode.
- `ALLOW_EXPERIMENTAL_CODECS` & `PREFER_OPUS_FORMAT`, audio/video format preferences.
- `ENABLE_GIF_THUMBNAILS`, animated video thumbnails.
- `ENABLE_STREAM_SEGMENTS` & `ENABLE_SEEK_HEATMAP`, segments and heatmap on the seekbar.
- `PREFER_MIX_PLAYLIST_AS_RELATED_VIDEOS`, use mixes for the related section, useful if related videos are _unrelated_.
- `SHOW_LIKE_STATUS_ON_CARDS`, show your like status on video cards, can increase data usage.
- `LONG_PRESS_SPEED`, the playback speed used while long pressing the video.
- `MAX_PAGE_CACHE_DURATION_VALIDITY`, how long cached pages stay valid.
- `REFRESH_JS_PLAYER`, refetch the player, can fix streaming issues.
- `COPY_YT_HISTORY_TO_LOCAL_HISTORY`, add local youtube history watches into local history.

::: callout info
Flags are experimental, defaults are fine for most people.
:::

---

<sub>by @claude</sub>
