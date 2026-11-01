---
title: "AI Usage"
description: "How AI is used in Namida, and why"
---

# AI Usage

Namida is made by human, **not** vibe coded. AI usage is minimal and very selective.
Every design choice comes after thoughtful decisions and series of refining, down to every pixel.
Parts built with AI have a disclaimer, [see here](https://github.com/namidaco/namida/issues/945) for more info.

### Why AI at all (rant) {#why-ai-at-all}

I always felt passionate about turning code into something with life, seeing my work bloom makes me happy.
I worked on Namida daily since January 2023, almost 4 years non stop. The learning was hard but the outcome was satisfying. Every time I built a feature, took my time with it, fixed bugs all night and then saw everything work, it brought me joy. Each challenge felt rewarded.

Recently (since v6.5.0) I realized there were far more features to build than I could finish in reasonable time, or even learn in time. The challenges became easy and boring, a small feature or a small change was no challenge anymore, and the big ones needed big time. What was left was bugs, the worst and most exhausting time thief.

That's where AI came in clutch. We don't tell it to vibe code, we ask it to do the work that costs time and effort. The codebase already has its foundation and its style, and AI follows them, so Namida stays human made in the first place. It brings isolated features, does the scary big work, and fixes the annoying bugs that cost sanity and steal time that could go into something new.

AI was always a good company. It helped me learn a lot and improved many things along the way, but I still wrote every line by hand because I have this perfectionism thing. I didn't want to use AI generated code at all because I love this app and want everything under control. Then I tried a good one and realized it can write exactly like me, and even better. That is when it became an opportunity, let AI do the hard work, and let me focus on which features and changes should come to Namida instead of how hard the feature is.

Keeping up alone with demanding features and annoying bugs would take another 4 years for what AI can do in a few months. The code is still ours, the vision is still ours. AI does the part it excels at, the hard work, writing good code that would take us years to perfect and probably never to optimize. There is so much it can do better and faster, and things I would have never known were possible.

Most decisions used to be weighed by their effort cost, sometimes more than by the feature itself. Now the only question left is how cool and useful the feature is..

### Timeline {#timeline}

<div class="ai-timeline">
<div class="ai-timeline__bar"><span class="ai-timeline__hand"></span><span class="ai-timeline__ai"></span></div>
<div class="ai-timeline__labels"><span>Jan 2023, by hand</span><span>Aug 2026, with AI</span></div>
</div>

### How much is AI {#how-much-is-ai}

It works like the footer of these docs, I'm the author and AI is the writer. I decide what gets built and how it looks and behaves. AI writes the code on top of the existing foundation and follows its style. Then every part goes through the same refining as before, until it feels right.

These numbers count only the app code (no scripts, tests or translation files), as of November 2026:

- **Core**: close to 0% AI. Everything that makes Namida what it is was made by hand (library & indexing, playback & queues, playlists & history, the whole YouTube client, the video player, lyrics, the tags editor, the miniplayer & waveform, desktop support and media servers). All of it took a lot of time, dedication and love over almost 4 years.
- **Features**: about 45 out of 400 features were written by AI, and most of them are niche ones (listed below).
- **Code**: most of the code AI wrote is rewrites of existing code (cleaner or faster, but the same for the user) or the niche additions listed below.

### What AI added {#what-ai-added}

Most of what AI added sits on top of the core, and a lot of it is niche (made for a smaller group of people):

- **Used by most people**: cross device sync (its base was made by hand), stats charts & Your Year page, subtitles, search filters for YouTube, shuffle as its own toggle, chapters and bookmarks.
- **Niche (specific devices or setups)**: iOS & macOS support, YouTube Music section, listening parties, romanization for lyrics & sorting, importing server playlists, extra web folders (SAF / FTP / SFTP), options & UI for caching server tracks (the caching itself was already there), removing SponsorBlock segments & splitting by chapters for downloads, Discord Rich Presence and floating lyrics window on desktop.
- **Very niche (enthusiasts)**: parametric equalizer (on top of the simple hand made one), bit-perfect playback & USB DAC, beat matching, synced lyrics editor and sound effects.
- **Just for fun**: effects & visualizers, easter eggs, and the animations for Namiween and the jellyfish invasion (their original art is made by a human artist).

So the core is still made by hand, and AI mostly brings the extras I would never have found the time for.

### Performance {#performance}

I spent a lot of time on optimization by hand (I used to go crazy for days trying to optimize the UI and logic), and AI still did a better job. Some of what it made faster:

- Much faster YouTube downloads (multiple connections per download).
- Faster indexing (including SMB / SFTP / WebDAV folders).
- Faster search.
- Lighter and safer saving (no corrupted history, playlists or settings when the app is killed mid-save).
- Smoother UI (color changes, track switching, miniplayer animations, history scrolling, blur and glow effects).
- Faster ffmpeg on all platforms.

It also rewrote many older parts to make them cleaner and faster. W clanker.

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
