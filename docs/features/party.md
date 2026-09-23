---
title: "Listening Party"
description: "Listen to the same queue with other people, in sync"
---

# Listening Party

Start a room, share the code, and everyone hears the same track at the same moment. Works over the internet or on your local network.

::: callout info
Listening parties are new and still evolving, everyone in the room must run the same Namida version.
:::

### How It Works {#how}

One person hosts the room and owns the queue. Everyone else joins with a code or an invite link, and their player follows the room instead of leading it.

No audio is sent between devices. Each device plays its own copy of the track, kept in step with the room. [`🎉 Sync feature ↗`](/features/sync/)

### Starting a Party {#create}

Pick a name, then create. You get an 8 character code, an invite link and a QR code to share.

Options while creating:

- **Listen on this device**, turn it off to use the device as a remote control only
- **Require approval to join**, you accept or reject each person
- **Party password**
- **Start with current queue**, the room opens with what you are playing
- **Public room**, anyone can find it while browsing
- **Host on this device**, for people on the same network, no server or membership needed

Creating a room on the Namida server needs a `cutie` membership or higher. Joining is always free, and hosting on your own device or your own server needs no membership at all.

### Joining {#join}

Paste an invite link or type the code. Opening an invite link on a phone opens the app straight into the room.

Public rooms are listed in the lobby, tap one to join. You can hide all rooms from a host you are not interested in.

### Roles {#roles}

- **Host**, owns the queue, can do everything, and can hand the role to someone else
- **Admin**, can control playback, edit the queue, kick and ban
- **Guest**, can do whatever the host allows

The host picks what guests are allowed to do: control playback, add to queue, edit queue and chat. Each one is a separate switch.

If the host leaves without closing the room, someone else becomes host and the party continues.

### The Queue {#queue}

The room has one queue that everyone sees. Adding, removing and reordering works from the normal player queue, your action is sent to the host and comes back to everybody.

Local files are matched by fingerprint, so the same track on another device is found even in a different folder. When someone doesn't have the file, Namida finds a YouTube version and plays that instead. Until it does, the track is marked as unavailable for that person and their player skips over it. [`🎉 YouTube feature ↗`](/features/youtube/)

### Remote Control {#remote}

Turn off "Listen on this device" and the device stops playing, but still shows the queue, the current track and the controls. Handy for controlling a party from your phone while a laptop plays.

### Chat {#chat}

Every room has a chat. The host can turn it off for guests, and anyone misbehaving can be kicked or banned.

### Privacy {#privacy}

- No accounts, joining needs nothing but a room code
- No audio ever leaves your device
- The server only passes messages along, it never reads them
- Nothing is kept after a room ends, and no room lives longer than 24 hours

While a room is open, the server holds the room code and options, and for each person a display name, a device id and an IP address, used only for rate limiting and bans. All of it is deleted when the room ends: the host closes it, nobody is connected for 10 minutes, or 24 hours pass.

Other people in the room see your name, the tracks you add and your chat messages. They never see your files, their paths, or your IP. The host also sees your device id when approval is on.

Rooms are unlisted unless you make them public. A public room shows its name and how many people are in it. It shows the current track only if you turn on "Share what's playing".

A party on your local network never reaches any server.

::: callout tip
Running your own server is possible, and it needs no membership. See the [relay repo](https://github.com/namidaco/party_relay).
:::

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
