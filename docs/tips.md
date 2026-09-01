---
title: "Tips & Tricks"
description: "Not so obvious features you might have missed"
---

# Tips & Tricks

Not so obvious features you might have missed.

### Selection {#selection}

- Long press a track to start selecting, long press another one to select everything in between.
- Selection is global, you can keep adding tracks from different pages and albums into the same list, then act on all of them at once.
- The select all icon in the bottom row selects everything in the current page.
- On desktop, holding `Shift` and clicking works like a long press.

### Search {#search}

- Swipe up on the search button to open the keyboard, swipe down to close it.
- Pasting a YouTube link or a playlist link in the searchbar automatically opens it.
- When playing from search, you can choose the [Play Mode](/pages/library/#search): selected track only, search results, album, first artist or first genre.
- Links and texts you copy can appear right in the searchbar, enable [Clipboard Monitoring](/settings/6-extras-settings/#clipboard-monitoring).
- Settings has its own search, press the search icon at the top of settings.

### Player {#player}

- Tap the current position to seek backwards, tap the total duration to seek forwards, by the [Seek Duration](/settings/3-playback-settings/#seek-duration).
- Long press the current position to seek to start, long press the total duration to keep seeking forwards.
- While seeking, swipe upwards to cancel. Seeking near the starting edge snaps to the very start.
- Swipe the miniplayer left or right to change tracks.
- Artwork gestures are configurable, tap and long press can do different actions, and double tap can toggle lyrics, see [Artwork Gestures](/settings/4-customization-settings/#miniplayer-customization).
- Long press the lyrics to enter fullscreen, and zoom in/out on the lyrics to change the font size.
- Long press the audio button in the player to open [Playback Settings](/settings/3-playback-settings/) directly.
- Long press the video button in the player to control quality or change audio track for videos.
- Long press lyrics button to configure lyrics for the current track.
- Press the info text in the player to open the track menu, and press the album name at the top to open the album.
- Long press the heart icon to add the current track to a playlist.
- To switch the artist/title locations, toggle "Display artist before title" in [Customizations](/settings/4-customization-settings/#miniplayer-customization).
- Audio configs (speed, pitch, effects) can be set per item, open the Sound Control page with the audio effects icon in the player.
- Pressing an item that is already playing, from another queue, silently rebuilds the queue without stopping playback.
- Open any track's dialog and press play to quickly start a new queue with only that track.
- Zoom in on the video in the local player to enter fullscreen.
- Namida can play loop animations, link a very short video to a track and it loops while the track plays. Embedding an animated gif or webp as the artwork works too. [`📒 Loop Animation Guide ↗`](/guides/namider/#loop-animation)

### Track Menu {#track-menu}

Long press a track (or tap its menu) for more than you might expect:

- Play Next, Play Last, and Play After, pick an exact position in the queue.
- Repeat for N times before playing the next track.
- Stop after this track.
- Insert after latest inserted, for stacking multiple tracks one after each other.
- Set Rating, Moods and Tags, they get their own [library pages](/pages/library/#moods-tags-rating).
- Set Youtube Link, attach a video to any local track.
- Add more from this Album, Artist or Folder to queue.

### Library Pages {#library-pages}

- Pull down to refresh: the tracks page refreshes the library, the playlists page refetches M3U & server playlists, and YouTube pages refresh their content.
- In media subpages (album tracks, artist tracks, etc), long press the filter icon to quickly open a smart playlist with that media name.
- In media pages, long press the grid icon to choose a specific count per row (higher numbers can cause performance issues).
- In the tracks page and media subpages, long press shuffle/play for advanced options.
- Tap the resume button in media subpages to resume from the last played track, and long press it to jump to that track.
- If a network image source is enabled, you can edit an album/artist display image by opening its dialog and pressing the artwork edit icon at the top right. Playlist artworks can always be edited.
  - Note that this is different from editing tags for all tracks inside. Editing artwork from here just edits the display image and doesn't touch the audio files.

### Downloading {#downloading}

- While downloading from YouTube you can edit the file tags and build the output filename with [yt-dlp style formats](/features/youtube/#filename-formats), like `%(title)s [(%(channel)s)]`.
- This works for single downloads and for batch playlist downloads, where playlist formats like `%(playlist_autonumber)s` number the files for you.
- In a playlist download page, selecting the output folder automatically marks the videos that are not downloaded yet, as long as you haven't selected any manually. The long press to select in between trick works there too.
- In the download sheet, press the "show webm" icon button to show experimental qualities, related: `ALLOW_EXPERIMENTAL_CODECS` & `PREFER_OPUS_FORMAT` in [Flags](/settings/5-youtube-settings/#flags).

### YouTube {#youtube-tips}

- In the player, press the arrow down to open the menu for the current video. You can add it to favourites from there, which is separate from liking (liking is tied to your YouTube account, while favourites live in Namida only).
- Long press the copy button on a video to copy specific info, like the title, link or channel.
- Signing in to your account can provide better download speed and fix some playback issues.
- You can import your history, playlists and subscriptions from a [YouTube takeout](/features/youtube/#history-import).
- Set a cached video's priority to VIP so it never gets auto deleted. Private and deleted videos become VIP automatically.
- Namida can show info of private and deleted videos, thanks to [Filmot](https://filmot.com/).
- In the youtube search tab, offline search is very useful to find videos you watched previously. You can sort results by most played, recent listen or first listen. Import your YouTube history for better results.
- Take a snapshot of a channel or playlist: open the videos tab, press "load all", wait, then open the menu and add to a playlist.
- Extra experimental switches hide behind the flag icon in [Youtube Settings](/settings/5-youtube-settings/#flags) and [Extras Settings](/settings/6-extras-settings/#flags).

### History {#history-tips}

- Tap calendar icon at top to jump to a specific day.
- Tap a year chip to jump to the same day but in that year.
- Most Played supports custom time ranges, see your top tracks of any period. Use the slider to navigate adjacent periods easier.
- Open a track's listens dialog, tap a listen to jump to that day in history, or use the button beside it to open Most Played for that range.
- Replace all listens of a track with another track, useful after re-downloading a file (Track's Dialog -> Advanced -> Replace all listens).
- Imported a wrong source? [Remove it from history](/settings/8-advanced-settings/#remove-source-history) in one go.

### Info & Sorting {#info-sorting}

- Tap any item in the track info dialog to copy it.
- In a track, album or artist info dialog, tap the artwork to open it in fullscreen, then long press it to save it to storage.
- Most sort menus allow choosing more than one sorter, and reordering them.
- Moved your files? The [Missing Tracks](/settings/2-indexer-settings/#missing-tracks) page relinks them without losing stats.

### Folders {#folders-tips}

- Put a `cover.jpg` (or similar) image inside a folder to use it as the folder artwork.
- Put a `.info.txt` file inside a folder to display small info about it.
- Set a specific folder as default, Namida opens it on app launch.

### Scrolling {#scrolling}

The scrollbar needs a small hold, plus dragging slightly outwards, before it starts scrolling. This is intentional: android usually ignores vertical drags close to the edge, and most apps compensate with a big instantly draggable scrollbar, which usually causes many accidental scrolls. Namida keeps the minimal design instead.

### Colors {#colors-tips}

- In the color palette dialog, long press a color to remove it, and tap a mix to use it as a default color.

### About Page {#about-tips}

- Have an issue? Share logs from Settings -> About.
- Check your version there too, and an icon appears on the app bar when there is a new version.
- Open the side menu and press the Namida logo to open the About page.
- Do NOT press the logo in the About page!! or something very scary will happen!!!1!

### Misc {#misc-tips}

- Long press/Hover on any icon to show a tooltip explaining what it does
- Did you know you can unlock crossfade and party mode for free? Try reading the dialog that shows, and maybe fight it.

### Desktop {#desktop-tips}

- Rate the current track instantly with `Ctrl` + `Alt` + `1..9`, see all [Shortcuts](/features/shortcuts/).
- Assign your own system-wide hotkeys for playback actions from About, then Shortcuts.

---

<sub>by @claude</sub>
