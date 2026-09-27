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
- Remove Sponsor Segments from Downloads, cut out the chosen categories from the downloaded files. `🆕 v7.4.0` [`🎉 Removing Sponsor Segments ↗`](/features/youtube/#sponsorblock-downloads)
- Hide skip button after a set time.
- Minimum segment duration, segments shorter than this are ignored.
- Categories: Sponsor, Self Promotion, Intro, Outro, Filler, Preview, Hook, Music Offtopic, Highlight and Interaction Reminder.
- Per category behavior: Auto Skip, Auto Skip Once, Show Skip button, Show in Seekbar, or disabled.
- Per category "Remove from downloads" switch, on by default for Sponsor, Self Promotion and Interaction Reminder. Highlight can't be removed, it's a single moment instead of a segment. `🆕 v7.4.0`

### Return Youtube Dislike {#return-youtube-dislike}

Show the dislike count on videos, using data from [returnyoutubedislike.com](https://returnyoutubedislike.com/).

### Miniplayer {#miniplayer}

- Youtube-style Miniplayer.
- Remember audio only mode.
- Dim the miniplayer after a set number of seconds of inactivity, and choose how dark it gets.
- Seekbar behavior, tap to seek and drag to seek.
- Drag to seek (Video), when swiping horizontally on the video itself: Never, Expanded Miniplayer, Fullscreen or Always. `🆕 v7.0.0`

### Content {#content}

- Show Shorts in & Show Mixes in, control where shorts and mix playlists appear.
- Show channel watermark in fullscreen.
- Show video endcards.
- Auto start radio, automatically adds a mix playlist when playing a single track.
- Personalized Related Videos, turning it off fetches an extra page without account info, so it uses more data.
- Personalized Mix Playlists.
- Enable Search Cleanup, hide unrelated search results.

### Comments {#comments}

- Top comments, display comments at the top instead of the bottom. When on, more related videos load as you scroll, when off, a "Show more" button loads them.
- Prefer new comments when possible, cached comments are only used when offline.

### Downloads {#downloads}

- Downloads Metadata tags, how tags are filled by default:
  - Off: channel name as artist, video title as title.
  - On: the video title is split into "Artist - Title" (artist falls back to the channel name), the channel becomes the album, and genre is set to "Nightcore" when the title contains it.
- Default Download Location.
- Download notifications `💻 Windows+Linux only`.

Other download options live in the download sheet itself, like Split by Chapters and removing sponsor segments, while parallel downloads and threads per download are set in the Downloads page. [`🎉 Downloads feature ↗`](/features/youtube/#downloads)

### On Opening Youtube Link {#on-opening-youtube-link}

Choose what happens when opening a YouTube link with Namida: Play, Add to Queue, Add to Playlist, Download, Always Ask and more.

### Flags {#flags}

Hidden experimental options. Press the flag icon at the top of the Youtube settings card to open them:

- `MARK_VIDEO_WATCHED`, mark videos as watched on your account.
- `TRY_EXTRACT_TAGS_INFO_FROM_DESCRIPTION`, pull tag info from the video description if needed.
- `INNERTUBE_CLIENT`, change the client used for requests, can fix playback issues.
- `WHITE_VIDEO_BG_IN_LIGHT_MODE`, fullscreen video uses the app background color instead of pure black.
- `ENABLE_DIM_IN_LIGHT_MODE`, the miniplayer dim also works in light mode.
- `ALLOW_EXPERIMENTAL_CODECS` & `PREFER_OPUS_FORMAT`, audio/video format preferences.
- `ENABLE_GIF_THUMBNAILS`, animated video thumbnails.
- `ENABLE_STREAM_SEGMENTS` & `ENABLE_SEEK_HEATMAP`, segments and heatmap on the seekbar.
- `PREFER_MIX_PLAYLIST_AS_RELATED_VIDEOS`, use mixes for the related section, useful if related videos are _unrelated_.
- `SHOW_LIKE_STATUS_ON_CARDS`, show your like status on video cards, can increase data usage.
- `PREFER_LIKE_BUTTON_OVER_FAVOURITE`, show a like button instead of the heart in the notification, widgets and player while playing YouTube items, when signed in.
- `LINK_LIKE_BUTTON_WITH_FAVOURITES`, liking a video adds it to your local YouTube favourites, unliking or disliking removes it.
- `USE_NEW_NOTIFICATIONS_EXTRACTOR`, try it if new notifications don't show up, but their order might not be accurate.
- `MAX_PAGE_CACHE_DURATION_VALIDITY`, how long cached pages stay valid.
- `REFRESH_JS_PLAYER`, refetch the player, can fix streaming issues.
- `COPY_YT_HISTORY_TO_LOCAL_HISTORY`, copy your YouTube watches to the local history, as listens of the local tracks linked to the same video.

::: callout info
Flags are experimental, defaults are fine for most people.
:::

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
