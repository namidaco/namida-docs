---
title: "Library"
description: "The main library pages"
---

# Library Pages

The main tabs of your library. You choose which ones are enabled and their order in [`⚙️ Configure Library Tabs ↗`](/settings/6-extras-settings/#library-tabs).

### Home {#home}

Your personalized start page: mixes generated from your history, recent listens, recently added, top recent albums & artists, and Lost Memories, tracks you listened to around this time years ago. Sections can be toggled and reordered.

The mixes are: Recommended, Supremacy (built around what is playing right now), Top Recents, Underrated, Lost Partners, Discover, Favourites and Random Picks. Empty ones move to the end.

### Tracks {#tracks}

All your tracks, sortable by almost any property. Recently added tracks get their own subpage. Pull down to refresh the library. [`⚙️ Configure Indexer ↗`](/settings/2-indexer-settings/)

With [Include Videos](/settings/2-indexer-settings/#include-videos) on, the tab can also show audio only or videos only, as "Tracks: Audio" and "Tracks: Videos". They share one tab slot, and a switcher next to the tracks count moves between them. `🆕 v7.4.0` [`⚙️ Configure Library Tabs ↗`](/settings/6-extras-settings/#library-tabs)

### Albums {#albums}

Your albums as a list or grid. What counts as one album is controlled by [`⚙️ Configure Album Identifiers ↗`](/settings/2-indexer-settings/#album-identifiers). [`⚙️ Configure Album Tiles ↗`](/settings/4-customization-settings/#album-tile)

An album shows the year of its oldest track.

### Artists {#artists}

Browse by Artists, Album Artists or Composers, press the type at the top left to switch. Multiple artists and composers in one tag get split by separators, and featured artists from titles can get their own entry. [`⚙️ Configure Separators ↗`](/settings/2-indexer-settings/#separators)

An artist page shows the years range of the artist's tracks, and a map icon that opens the [Artists Map](#artists-map) centered on that artist. `🆕 v7.4.0`

### Discover {#discover}

`🆕 v7.0.0`

Your artists laid out as a constellation, each one connected to related artists through shared albums, features on the same track and shared genres. Press an artist to open it, or shuffle for a fresh set. Open it from the Artists page.

### Artists Map {#artists-map}

`🆕 v7.4.0`

Your whole library of artists on one map. Related artists sit next to each other, and each group gets its own color. Zoomed out you see colored dots, bigger for artists with more tracks, with the names of the biggest ones. Zoom in and the dots turn into artist tiles, tap one to open it, or long press for its dialog.

Open it with the map icon in the Discover page, or from an artist page to start centered on that artist. The buttons at the top switch between the graph and a grid layout, and fit everything back on screen.

### Genres {#genres}

Your genres, split from tags using the genre separators. Press the type at the top left to switch between Genres and Styles.

### Playlists {#playlists}

Your playlists, along with the built-in ones: History, Most Played and Favourites. Normal, M3U synced and smart playlists all live here. Pull down to refetch M3U and server playlists. Smart playlists also have their own full page, press the arrow next to their section, or enable it as a library tab of its own. [`🎉 Playlists & History feature ↗`](/features/playlists-history/)

The tags row above the list filters playlists by their tags, pinned playlists stay at the top, and the checklist icon selects many at once. `🆕 v7.8.0` [`🎉 Playlist Tags ↗`](/features/playlists-history/#playlist-tags)

### Folders {#folders}

Browse your library exactly like your file manager, with separate views for music and videos. Supports folders hierarchy, `cover.jpg` style folder images, and `.info.txt` for displaying small info. [`⚙️ Configure Folders ↗`](/settings/2-indexer-settings/#folders-to-scan)

- The header shows the folder name with its `.info.txt` text, and the path above it. Tap it to go up one folder.
- The music and videos views ("Folders: Tracks" and "Folders: Videos") share one tab slot with the normal Folders view, use the switcher in the header to move between them. `🆕 v7.4.0`
- Set a specific folder as default, Namida will open it on app launch.
- Edits to a `.info.txt` file show up after refreshing the library. [`⚙️ Refresh Library ↗`](/settings/2-indexer-settings/#refresh-reindex)
- In the tracks sort menu, disable "Enable folders hierarchy" to show all folders in a single list instead of a tree view.

### Queues {#queues}

Every listening session is saved automatically, so you can jump back to any previous queue. Press the delete icon at the top to clear unimportant queues, or swipe one left to quickly remove it. Inside a queue, the resume button continues from the track you last played in it.

Only the newest 20 queues load at first, press "Load all" at the bottom for the rest. `🆕 v7.4.0`

### Queue {#current-queue}

`🆕 v7.0.0`

The currently playing queue as a library tab, so you can keep it a swipe away instead of opening the player. Enable it in [`⚙️ Configure Library Tabs ↗`](/settings/6-extras-settings/#library-tabs).

### Stats {#stats}

`🆕 v7.0.0`

Your listening stats and charts as a library tab, the same page you get from the chart icon on the Home page. Enable it in [`⚙️ Configure Library Tabs ↗`](/settings/6-extras-settings/#library-tabs). [`📄 Stats Page ↗`](/pages/other/#stats)

### Smart Playlists {#smart-playlists}

`🆕 v7.4.0`

The full smart playlists page as a library tab. Enable it in [`⚙️ Configure Library Tabs ↗`](/settings/6-extras-settings/#library-tabs). [`🎉 Smart Playlists feature ↗`](/features/smart-playlists/)

### Listening Party {#party}

`🆕 v7.4.0`

The listening party page as a library tab, to create or join a room and follow it. [`🎉 Listening Party feature ↗`](/features/party/)

### Moods, Tags & Rating {#moods-tags-rating}

Browse tracks grouped by the moods, tags and ratings you assign. Assign them from the track menu, for many tracks at once too, they also power mood based [track generation](/features/playlists-history/#generation). On desktop you can rate the current track with a key press, see [`🎉 Shortcuts feature ↗`](/features/shortcuts/).

### Search {#search}

Global search across your library. You choose which fields it looks into: title, artist, album, filename, even lyrics. Playing from search supports play modes: selected track only, search results, album, first artist or first genre. [`⚙️ Configure Search ↗`](/settings/6-extras-settings/#filter-tracks-by)

Results are ranked by a match score:

- Exact matches score the highest, then close matches. For fields with multiple values, like artists or genres, matching any single value counts.
- The more of your typed words a track matches, the higher it ranks. Small typos are forgiven in the title, artist, album and filename.
- Title counts the most, then artist and album, then filename. Other fields like genre, comment or lyrics are only checked when these don't match.
- Tracks you listen to more get a small boost.

This ranking is the "Auto" sort in the search sort menu, pick any other sort to order the results by it instead. Searching inside an album, artist, playlist or any other media page orders the results by best match too.

---

### Related Settings {#related-settings}

- [⚙️ Extras, Library Tabs](/settings/6-extras-settings/#library-tabs)
- [⚙️ Indexer Settings](/settings/2-indexer-settings/)
- [⚙️ Customizations](/settings/4-customization-settings/)

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
