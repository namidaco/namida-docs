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
- Settings has its own search, press the Search button in settings. It finds options inside settings too, like "Sakura". `🆕 v7.8.0`
- Your recent searches can be saved and shown in the search page, enable `RECENT_SEARCHES` in the [Extras Flags](/settings/6-extras-settings/#flags).

### Player {#player}

- Tap the current position to seek backwards, tap the total duration to seek forwards (by the [Seek Duration](/settings/3-playback-settings/#seek-duration)).
  - Hold them to keep seeking (rewind/fastforward).
- Long press the previous button to jump to the very start of the track, and long press the next button to speed up playback while you hold it. [`⚙️ Configure Long Press Speed ↗`](/settings/3-playback-settings/#long-press-speed)
- While seeking, swipe upwards to cancel. Seeking near the starting edge snaps to the very start.
- Swipe the miniplayer left or right to change tracks.
- Shuffle is a toggle, it shuffles the queue itself and turning it off brings back the original order. Long press it for a one time Shuffle Next or Shuffle All. [`🎉 Queue System ↗`](/features/playback/#queue)
- The repeat button has its own shuffle flavor, Repeat All Queue (Shuffle) reshuffles the queue each time it reaches the end. [`🎉 Repeat Modes ↗`](/features/playback/#repeat-modes)
- Artwork gestures are configurable, tap and long press can do different actions, and double tap can toggle lyrics, see [Artwork Gestures](/settings/4-customization-settings/#miniplayer-customization).
- Long press the lyrics to enter fullscreen, and pinch the lyrics to change the font size. On desktop it's `Ctrl` + mouse wheel or `Ctrl` + `+` / `-`, and `Ctrl` + `0` resets it.
- Long press the audio button in the player for a quick menu with the [Audio path](/features/playback/#audio-path) and [Playback Settings](/settings/3-playback-settings/).
- Long press the video button in the player to control quality or change the audio track for videos.
- Press the subtitle icon in the video controls to pick a subtitle, the language you pick is remembered for next videos. [`🎉 Subtitles feature ↗`](/features/subtitles/)
- Long press the lyrics button (right click on desktop) to configure lyrics for the current track, or embed them into the file. [`🎉 Lyrics Picker ↗`](/features/playback/#lyrics-picker)
- Long press a sleep timer preset to remove it. [`🎉 Sleep Timer ↗`](/features/playback/#sleep-timer)
- Press the info text in the player to open the track menu, and press the album name at the top to open the album.
- Long press the heart icon to add the current track to a playlist.
- To switch the artist/title locations, toggle "Display artist before title" in [Customizations](/settings/4-customization-settings/#miniplayer-customization).
- Audio configs (speed, pitch, effects) can be set per item, open the Sound Control page with the audio effects icon in the player.
- In the equalizer's Sliders view, letting go of a band close to 0 snaps it to exactly 0.
- Long press an empty spot in the equalizer curve to add a band right there. [`🎉 Equalizer ↗`](/features/playback/#equalizer)
- Playing the current track from another list rebuilds the queue silently without interrupting playback.
- Open any track's dialog and press play to quickly start a new queue with only that track.
- Zoom in on the video in the local player to enter fullscreen.
- Namida can play loop animations, link a very short video to a track and it loops while the track plays. Embedding an animated gif or webp as the artwork works too. [`📒 Loop Animation Guide ↗`](/guides/namider/#loop-animation)

### Track Menu {#track-menu}

Long press a track (or tap its menu) for more than you might expect:

- Play Next, Play Last, and Play After (pick an exact position in the queue).
  - For a track or video that's already in the queue, long press them to move it there instead of adding it again.
- Repeat for N times before playing the next track.
- Stop after this track, works on any upcoming track in the queue, not only the playing one.
- Insert after latest inserted, for stacking multiple tracks one after another.
- Set Rating, Moods and Tags, they get their own [library pages](/pages/library/#moods-tags-rating). For many tracks at once, use the "Set Rating" icon beside Edit Tags.
- Set Youtube Link, attach a video to any local track.
- Add more from this Album, Artist or Folder to queue.

### Advanced Dialog {#advanced-dialog}

The track menu has an Advanced section:

- Copy or move the files to another folder.
- Clear specific things for that track: artwork, thumbnail, plain or synced lyrics, video cache, audio cache and server cache.
- Delete the files from storage, deleted paths are saved to a file in the app data folder just in case.
- Share the files.
- See which sources the listens came from, useful after importing a history.
- Set the track as a ringtone, a notification sound or an alarm.
- Re-index the track, good after editing it outside Namida.
- Replace all listens of a track with another track.
- Edit the color palette of the track, add or remove colors and pick a mix.
- Selecting many tracks from the same folder also shows Update Directory Path right there.

### Library Pages {#library-pages}

- Pull down to refresh: the tracks page refreshes the library, the playlists page refetches M3U & server playlists, and YouTube pages refresh their content.
- In media subpages (album tracks, artist tracks, etc), long press the filter icon to quickly open a smart playlist with that media name.
- In media pages, long press the grid icon to choose a specific count per row (higher numbers can cause performance issues).
- In the tracks page and media subpages, long press shuffle/play for advanced options.
  - Play can sort the tracks, and skip the ones below a minimum (like a rating of 75% for your top rated only). `🆕 v7.8.0`
  - Shuffle can pick a number of tracks (with a minimum too) and exclude your most recent listens. `🆕 v7.8.0`
- In an album, artist, playlist or folder dialog, the sort button beside Play All opens the same options, and so does long pressing Shuffle. `🆕 v7.8.0`
- Tap the resume button in media subpages to resume from the last played track, and long press it to jump to that track.
- In the Home page, tapping a Recent Queues card that was played from a playlist or folder opens that playlist or folder, long press it to open its dialog. [`📄 Home Page ↗`](/pages/library/#home)
- With a network image source enabled, open an album or artist dialog and press the edit icon at the top right to change its display image. Playlist artworks can always be edited.
  - This only changes the display image, the audio files and their tags are untouched.
- Open the dialog of an album, artist, playlist or folder and press Stats to see listen stats for just those tracks.
- The current queue, the stats page, smart playlists and the listening party can be library tabs of their own. [`📄 Queue Tab ↗`](/pages/library/#current-queue) [`📄 Stats Tab ↗`](/pages/library/#stats)
- Tabs with variants (like Tracks: Audio or Folders: Videos) share one slot in the navigation bar, long press it to switch. [`⚙️ Configure Library Tabs ↗`](/settings/6-extras-settings/#library-tabs)
- Press the map icon in an artist page to see where that artist sits among the rest of your library. [`📄 Artists Map ↗`](/pages/library/#artists-map)
- Tapping or long pressing a track's thumbnail can run an action of your choice, like play next or open its info. [`⚙️ Configure Artwork Gestures ↗`](/settings/4-customization-settings/#track-tile)

### Downloading {#downloading}

- While downloading from YouTube you can edit the file tags and build the output filename with [yt-dlp style formats](/features/youtube/#filename-formats), like `%(title)s [(%(channel)s)]`.
- This works for single downloads and for batch playlist downloads, where playlist formats like `%(playlist_autonumber)s` number the files for you.
- In a playlist download page, selecting the output folder automatically marks the videos that are not downloaded yet (as long as you haven't selected any manually). The long press to select in between trick works there too.
- In the download sheet, press the "show webm" icon button to show experimental qualities, see also `ALLOW_EXPERIMENTAL_CODECS` & `PREFER_OPUS_FORMAT` in [Flags](/settings/5-youtube-settings/#flags).
- The flash icon in the downloads page sets how many downloads run at once (up to 10) and how many connections each download uses. [`📄 Downloads Page ↗`](/pages/youtube/#downloads)
- Long press a chapter in the YouTube miniplayer to download only that chapter, or turn on "Split by Chapters" to save every chapter as its own file. [`🎉 Chapter Downloads ↗`](/features/youtube/#chapters-downloads)
- Use "Cache" instead of download on a video or a playlist to keep it for offline playback without saving any files. [`🎉 Caching ↗`](/features/youtube/#caching)

### YouTube {#youtube-tips}

- In the player, press the arrow down to open the current video's menu. You can add it to favourites from there, which is separate from liking (liking is tied to your YouTube account, while favourites live in Namida only).
- Long press the copy button on a video to copy specific info, like the title, link or channel.
- Signing in to your account can provide better download speed and fix some playback issues.
- You can import your history, playlists and subscriptions from a [YouTube takeout](/features/youtube/#history-import).
- Set a cached video's priority to VIP so it never gets auto deleted. Private and deleted videos become VIP automatically.
- Namida can show info of private and deleted videos, thanks to [Filmot](https://filmot.com/).
- In the YouTube search tab, offline search is very useful to find videos you watched previously. You can sort results by most played, recent listen or first listen, or turn on the "Cache" chip to see only what plays offline. Import your YouTube history for better results.
- Long press a chapter in the miniplayer to copy a link to its timestamp.
- Take a snapshot of a channel or playlist: open the videos tab, press "load all", wait, then open the menu and add to a playlist.
- Type `after:2024-01-01` or `before:2023-06` in the search text to filter by upload date, or use the filters row. [`📄 Search Filters ↗`](/pages/youtube/#search-filters)
- In a channel page, the time range icon lists only videos uploaded after or before a date.
- Extra experimental switches hide behind the flag icon in [Youtube Settings](/settings/5-youtube-settings/#flags) and [Extras Settings](/settings/6-extras-settings/#flags).

### History {#history-tips}

- Tap the calendar icon at the top to jump to a specific day.
- Tap a year chip to jump to the same day but in that year.
- Most Played supports custom time ranges, see your top tracks of any period. Use the slider to navigate adjacent periods more easily, or pick a single day with a days radius.
- Open a track's listens dialog, tap a listen to jump to that day in history, or use the button beside it to open Most Played for that range.
- Replace all listens of a track with another track, useful after re-downloading a file (Track's Dialog -> Advanced -> Replace all listens).
- Imported a wrong source? [Remove it from history](/settings/8-advanced-settings/#remove-source-history) in one go.
- The Stats page has charts for any time range, and a Your Year wrap up shows up on the Home page every December and January. [`📄 Stats Page ↗`](/pages/other/#stats)
- Long press any chart card to copy its values as text, press its share icon to save it as an image, or use the share icon in the app bar to export all of them at once.
- The Total Listens donut can be split by genres, styles, moods, tags, artists, album artists, composers or albums, press the category icon on the card.

### Info & Sorting {#info-sorting}

- Tap any item in the track info dialog to copy it.
- In a track, album or artist info dialog, tap the artwork to open it in fullscreen, then long press it to save it to storage. Double tap to zoom into a spot, or use the mouse wheel on desktop. You can zoom in until single pixels show, and they stay sharp.
- Sort by more than one property (like artist, then year, then title). Press Advanced in any sort menu to pick and reorder them. Available for tracks, and now albums, artists, genres and playlists too. `🆕 v7.8.0`
- Sort by Random (Daily) for a random order that stays the same all day, and changes the next day. `🆕 v7.8.0`
- The tag editor keeps file dates by default, so edited tracks don't jump to the top of Recently Added. [`🎉 File Dates ↗`](/features/library-indexing/#file-dates)
- Moved your files? The [Missing Tracks](/settings/2-indexer-settings/#missing-tracks) page relinks them without losing stats.

### Folders {#folders-tips}

- Put a `cover.jpg` (or similar) image inside a folder to use it as the folder artwork.
- Put a `.info.txt` file inside a folder to display small info about it. [Refresh the library](/settings/2-indexer-settings/#refresh-reindex) after editing it to see the changes.
- Set a specific folder as default, Namida opens it on app launch.
- With "Enable Folders Hierarchy" on, a folder's menu button shows only the tracks directly inside it, long press the button or the folder itself to include tracks from all subfolders. [`📄 Folders Page ↗`](/pages/library/#folders)

### Scrolling {#scrolling}

The scrollbar needs a short hold before it starts dragging. This is intentional, most apps have a big instantly draggable scrollbar (which usually causes many accidental scrolls). Namida keeps the minimal design instead.

Turn on `SCROLLBAR_THUMB_LABEL` in the [Extras Flags](/settings/6-extras-settings/#flags) to see the letter or date you're at while dragging. `🆕 v7.8.0`

### Colors {#colors-tips}

- In the color palette dialog, long press a color to remove it, and tap a mix to use it as a default color.

### About Page {#about-tips}

- Have an issue? Press "Report an issue" in Settings -> About, it fills in your version and device info and gets the logs ready. [`📄 About Page ↗`](/pages/other/#about)
- Check your version there too, and an icon appears on the app bar when there is a new version.
- Open the side menu and press the Namida logo to open the About page.
- Do NOT press the logo in the About page!! or something very scary will happen!!!1!

### Misc {#misc-tips}

- Long press or hover on any icon to see a tooltip explaining what it does.
- Pages that have a docs page show a guide icon in the app bar, it opens the matching page here.
- Tag editor and smart playlist fields suggest values from your library as you type.
- Supporter features for free? Yup, if you find the eggs Namida hid around the app, the hints are in About -> Eggs. Try reading the dialog that shows too, and maybe fight it a little. [`📄 Eggs ↗`](/membership/#eggs)

### Desktop {#desktop-tips}

- Rate the current track instantly with `Ctrl` + `Alt` + `1..9`, see all [Shortcuts](/features/shortcuts/).
- Assign your own system-wide hotkeys for playback actions from About, then Shortcuts.
- `Ctrl` + `Alt` + `L` shrinks Namida into a small lyrics window, `Esc` brings it back. [`🎉 Mini Lyrics Window ↗`](/features/system-integration/#mini-lyrics)
- On a wide window, the maximize icon at the top left of the expanded player opens a two pane layout with lyrics/queue beside the artwork/video. [`🎉 Widescreen Player ↗`](/features/playback/#widescreen-player)
- Closing the window keeps Namida in the tray, click the tray icon to bring it back. Change this in [Kill Player After Dismissing App](/settings/3-playback-settings/#kill-player).
- `Ctrl` + mouse wheel zooms, works on the lyrics font size and on the cards of a playlist download page. `Ctrl` + `0` resets it. [`🎉 Zoom Shortcuts ↗`](/features/shortcuts/#zoom)

### Android {#android-tips}

- Add the Namida tile to your quick settings panel to play and pause from anywhere, and the Namida Shuffle tile to toggle shuffle. [`🎉 Quick Settings Tile ↗`](/features/system-integration/#quick-settings-tile)
- The home screen widget can be configured. [`🎉 Home Screen Widget ↗`](/features/home-widget/)
- Namida shows up in "Open with" and in the share sheet for audio, video, m3u files and YouTube links. [`🎉 Open With & Share ↗`](/features/system-integration/#open-with)

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
