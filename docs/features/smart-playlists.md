---
title: "Smart Playlists"
description: "Playlists built from rules, from simple to complex"
---

# Smart Playlists

A smart playlist is a set of rules instead of a list of tracks, so it updates itself as your library and history change.

Create one from the add button in the playlists page, or from the smart playlists page. [`📄 Smart Playlists Page ↗`](/pages/library/#smart-playlists)

Tracks are found only when you open the playlist, and can't be added manually. [`📄 Why aren't smart playlists treated as normal playlists? ↗`](/faq/#smart-playlists)

### How Rules Combine {#combining}

Rules live inside groups. Each group picks **All** (every rule must match) or **Any** (one is enough) for its rules, and a separate All/Any at the top joins the groups together (shown once there are 2 groups or more):

| Setup                                     | Means                  |
| ----------------------------------------- | ---------------------- |
| One group, All                            | A and B and C          |
| One group, Any                            | A or B or C            |
| Two groups, All for rules, Any for groups | (A and B) or (C and D) |
| Two groups, Any for rules, All for groups | (A or B) and (C or D)  |

The count under the dialog title shows how many tracks match as you edit.

### Rules {#rules}

Press "Add Rule" in a group, pick a Source and a Filter Type, then fill in the value.

Sources come in 4 types: Text, Number, Date and Condition.

### Text Rules {#text-rules}

**Sources:** Title, Album, Artist, Album Artist, Composer, Genre, Style, Comment, Description, Synopsis, Language, Record Label, Release Type, Format, Channels, Lyrics, Moods, Tags, Playlist `🆕 v7.8.0`, Playlist tags `🆕 v7.8.0`, Youtube Link, Youtube ID, File Name, Filename without extension, File Full Path, Folder Name, Folder Path and Extension.

**Filters:**

- is Same, is Not Same
- Contains, does not Contain
- Starts with, Ends with
- Contains (Regex), does not Contain (Regex)
- is Before (A-Z), is After (A-Z), is in Between (A-Z), is Outside (A-Z) `🆕 v7.8.0`
- Exists, Missing (for whether the field has any value at all)

Good to know:

- **Cleanup** (on by default) ignores case, accents and symbols, so `beyonce` matches `Beyoncé`.
- Fields with several values (like artists or genres) match when any value matches. Negative filters match only when none does.
- Playlist and Playlist tags are the playlists the track is in, and their [tags](/features/playlists-history/#playlist-tags). `gym` matches `gym/cardio` too.
- A-Z filters compare alphabetically, so "is in Between A and C" includes `Coldplay`.
- Values are suggested from your library as you type.
- A value can include other fields of the same track (with the source icon beside it). Title <u>Contains</u> [Artist] finds titles that mention their own artist.
- Description, Synopsis and Lyrics can make big playlists slower.

### Number Rules {#number-rules}

**Sources:**

| Source                        | Value                                                                   |
| ----------------------------- | ----------------------------------------------------------------------- |
| Total Listens                 | listens count, never played tracks count as 0                           |
| Total Listens (Between Dates) | listens count inside a date range, see below                            |
| Listens per Month `🆕 v7.8.0` | average listens per month, since the first listen or date added         |
| Rating                        | 0 to 100                                                                |
| Last Played Position          | seconds                                                                 |
| Played Percentage             | 0 to 100, how far the track was played last time                        |
| Duration                      | seconds                                                                 |
| Size                          | bytes, the slider works in MB                                           |
| Bitrate                       | kb/s (`320`)                                                            |
| Sample Rate, Bit Depth, BPM   | as stored in the file                                                   |
| Track/Disc Number & Total     | as stored in the tags                                                   |
| Playlists Count `🆕 v7.8.0`   | how many playlists the track is in                                      |
| Total Tracks `🆕 v7.8.0`      | how many tracks the album, artist, genre or folder has, see [Per](#per) |

**Filters:** is Same, is Not Same, is Greater Than, is Smaller Than, is Greater Than + is Same (≥), is Smaller Than + is Same (≤), is in Between and is Outside. "is in Between" includes both ends.

#### Listens Between Dates {#listens-between-dates}

Adding "Total Listens (Between Dates)" also adds a "Between Dates" rule to its group, only the listens inside those dates are counted.

Example, tracks you played at least 10 times last summer:

- Total Listens (Between Dates) <u>is Greater Than + is Same</u> `10`
- Between Dates <u>is in Between</u> `2026-06-01` and `2026-08-31`

### Per & Calculation {#per}

`🆕 v7.8.0`

Number rules have a **Per** option (Track by default). Set it to Album, Artist, Genre, Folder and more, and the rule checks the whole album or artist instead (like "Total Listens per Artist"). Every track of a matching one gets in.

The **Calculation** turns their values into one number: Sum, Average, Minimum or Maximum. Unknown values (like a missing rating) are skipped.

Examples:

- Total Listens per Artist (Sum) <u>is Greater Than</u> `500`: every track of the artists you played more than 500 times in total.
- Rating per Album (Average) <u>is Greater Than + is Same</u> `80`: albums you rated high overall, including their unrated tracks.
- Rating per Album (Minimum) <u>is Greater Than + is Same</u> `80`: albums with no weak track.
- Total Tracks per Genre <u>is Smaller Than</u> `5`: tracks from your rare genres.

### Date Rules {#date-rules}

**Sources:** Date Added, Date Modified, Year, Any Listen, All Listens, First listen, Last Listen and Favourited Date.

**Filters:**

- is Same, is Not Same, is Before, is After, is in Between, is Outside. Before, After and in Between include the dates you enter.
- is Within Last, is not Within Last (a moving window like the last 3 days, counted back from now in seconds, minutes, hours, days, weeks, months or years).
- Exists, Missing.

Good to know:

- Type dates as `2024-05-20` or `2024-05-20 18:30:00`, or pick one with the calendar icon.
- **Any Listen** matches when at least one listen matches, **All Listens** only when every listen matches.
- Never played tracks have no listen dates, they match "is not Within Last", and "First listen Missing" finds exactly them.
- A year tag like `1995` counts as the first day of that year, so use <u>is in Between</u> `1990-01-01` and `1999-12-31` for a decade.
- Date Added and Date Modified come from the file dates, see [`🎉 File Dates ↗`](/features/library-indexing/#file-dates).
- **Clock Only** compares the time of day only (`HH:mm:ss`), ignoring the date. Ranges can cross midnight, so Any Listen <u>is in Between</u> `22:00:00` and `04:00:00` finds tracks you played at night.

### Condition Rules {#condition-rules}

**Sources:** Lossless, Favourite and Single.

**Filters:** is True, is False and is Unknown.

Single means the track is alone in its album.

### Limit {#limit}

`🆕 v7.8.0`

Keep only part of the matching tracks (like 25 tracks, 1 hour or 4 GB), selected by any sort, Most Played by default. Time and size limits get filled as close as possible.

Select by Random (Daily) for a new pick every day.

### Sorting {#sorting}

The sort button at the top orders the tracks (after the limit picked them). Several sorters work too (like artist, then year, then title). `🆕 v7.5.0`

Random (Daily) keeps the same random order for the whole day, it's in every tracks sort menu. `🆕 v7.8.0`

### Smart Search {#smart-search}

The same rules work as a one time search, press the filter icon at the end of the chips row in the search page. Long press it to edit the rules.

In album, artist and other media pages, long press the filter icon to start one filled with that media.

### Examples {#examples}

Rules are written as Source <u>Filter</u> `Value`. Unless said otherwise, everything is in one group with All.

#### Easy {#examples-easy}

One rule each.

- **Never played**: Total Listens <u>is Same</u> `0`.
- **Fresh additions**: Date Added <u>is Within Last</u> `30 Days`.
- **Recently changed files**: Date Modified <u>is Within Last</u> `7 Days`. Files edited outside Namida, or with [Keep file dates](/features/tag-editor/#keep-file-dates) off.
- **Loved ones**: Rating <u>is Greater Than + is Same</u> `80`.
- **Hi-res only**: Sample Rate <u>is Greater Than</u> `48000`.
- **Rock**: Genre <u>Contains</u> `rock`. Cleanup is on, so `Rock`, `ROCK` and `Hard Rock` are included.
- **One folder**: Folder Path <u>Starts with</u> `/storage/emulated/0/Music/Anime`.
- **Not in any playlist**: Playlists Count <u>is Same</u> `0`.
- **No embedded lyrics**: Lyrics <u>Missing</u>. A to-do list for the [lyrics picker](/features/playback/#lyrics-picker).
- **Unfinished tracks**: Played Percentage <u>is Greater Than</u> `0`. Tracks you stopped or skipped before the end last time.

#### Medium {#examples-medium}

A few rules, All/Any, a limit or a sort.

- **90s favourites**: Year <u>is in Between</u> `1990-01-01` and `1999-12-31`, Favourite <u>is True</u>.
- **Forgotten favourites**: Favourite <u>is True</u>, Last Listen <u>is not Within Last</u> `6 Months`.
- **Rock or metal**: set the group to Any, Genre <u>Contains</u> `rock`, Genre <u>Contains</u> `metal`.
- **Unheard gems**: Total Listens <u>is Same</u> `0`, Date Added <u>is not Within Last</u> `1 Months`.
- **Unhearted bangers**: Total Listens <u>is Greater Than</u> `30`, Favourite <u>is False</u>.
- **Fresh obsessions**: First listen <u>is Within Last</u> `2 Months`, Listens per Month <u>is Greater Than</u> `10`.
- **Timeless**: First listen <u>is not Within Last</u> `2 Years`, Last Listen <u>is Within Last</u> `7 Days`. Old tracks still in rotation.
- **One and done**: Total Listens <u>is Same</u> `1`, First listen <u>is not Within Last</u> `3 Months`. Played once, never again.
- **Late night tracks**: Any Listen <u>is in Between</u> `22:00:00` and `04:00:00` with Clock Only.
- **Night owl only**: All Listens <u>is in Between</u> `22:00:00` and `04:00:00` with Clock Only. Tracks you only ever played at night.
- **Morning tracks**: Any Listen <u>is in Between</u> `06:00:00` and `10:00:00` with Clock Only.
- **Daily hour**: Rating <u>is Greater Than + is Same</u> `70`, Limit `60 Minutes` selected by Random (Daily). A new hour of your best tracks every day.
- **Short and fast**: Duration <u>is Smaller Than</u> `180`, BPM <u>is Greater Than</u> `140`.
- **Played this week**: Total Listens (Between Dates) <u>is Greater Than</u> `0` with Between Dates <u>is Within Last</u> `7 Days`, sorted by Recent Listens.

#### Complex {#examples-complex}

Several groups, Per and field references.

- **Old gold or new heat**: two groups joined with Any.
  - Group 1 (All): Year <u>is Before</u> `1990-01-01`, Rating <u>is Greater Than + is Same</u> `80`.
  - Group 2 (All): Date Added <u>is Within Last</u> `3 Months`, Listens per Month <u>is Greater Than + is Same</u> `8`.
- **Deep cuts of big artists**: Total Listens per Artist (Sum) <u>is Greater Than</u> `300`, Total Listens <u>is Smaller Than</u> `3`. Rarely played tracks from the artists you play the most.
- **Albums worth finishing**: Total Tracks per Album <u>is Greater Than + is Same</u> `8`, Total Listens per Album (Sum) <u>is Greater Than</u> `20`, Total Listens <u>is Same</u> `0`. The tracks you never played from albums you do play.
- **Title tracks**: Title <u>is Same</u> [Album], using the Album source inside the value. Tracks named after their own album.
- **Gym, no live versions**: two groups joined with All.
  - Group 1 (Any): Playlist tags <u>is Same</u> `gym`, Genre <u>Contains</u> `workout`.
  - Group 2 (All): Title <u>does not Contain</u> `live`, Album <u>does not Contain (Regex)</u> `live|concert`.
- **Last summer on repeat, 2 hours**: Total Listens (Between Dates) <u>is Greater Than + is Same</u> `10` with Between Dates <u>is in Between</u> `2026-06-01` and `2026-08-31`, Limit `2 Hours` selected by Most Played, sorted by Random.
- **Rediscover a year**: First listen <u>is in Between</u> `2022-01-01` and `2022-12-31`, Last Listen <u>is not Within Last</u> `1 Years`, Favourite <u>is False</u>, Rating <u>is Greater Than + is Same</u> `60`.

---

### Related {#related}

- [🎉 Playlists & History feature](/features/playlists-history/)
- [📄 Smart Playlists Page](/pages/library/#smart-playlists)
- [📄 Smart Playlists FAQ](/faq/#smart-playlists)

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
