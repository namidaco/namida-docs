---
title: "Installation"
description: "How to install Namida on Android, Windows, Linux, iOS and macOS"
---

# Installation

**Namida runs on Android, Windows and Linux.**
iOS and macOS are in beta, see [iOS](#ios-differences) and [macOS](#macos-differences) for what they don't have yet.

Features that only work on some platforms are labeled like `💻 Android only`. Features that work everywhere except iOS or macOS have no label, so they are listed in those two sections instead.

There are two channels:

- [Stable releases](https://github.com/namidaco/namida/releases), for everyone.
- [Beta releases](https://github.com/namidaco/namida-snapshots/releases), new features and fixes are released here first. If YouTube or anything else stops working, try the latest beta.

::: callout warning
Namida is only available through [namida.app](https://namida.app), GitHub & Telegram.
We are not responsible for downloads from other sources.
:::

## Android {#android}

Namida needs Android 8.0 or newer (Android 7 can stay on v8.4.0).

[`GitHub`](https://github.com/namidaco/namida/releases/latest) [`Obtainium`](https://apps.obtainium.imranr.dev/redirect?r=obtainium://add/https://github.com/namidaco/namida/) [`GitHub Beta`](https://github.com/namidaco/namida-snapshots/releases/latest) [`Obtainium Beta`](https://apps.obtainium.imranr.dev/redirect?r=obtainium://add/https://github.com/namidaco/namida-snapshots/)

#### Which file {#android-files}

Every release has an APK per architecture, beta adds a clone variant on top.

| File | Channel | Pick it if |
| --- | --- | --- |
| `namida-vX.X.X-arm64-v8a.apk` | stable & beta | Default choice, works on any modern 64 bit device. |
| `namida-vX.X.X-armeabi-v7a.apk` | stable & beta | Old 32 bit device, or the arm64 one refuses to install. |
| `namida-vX.X.X-clone-arm64-v8a.apk` | beta only | You want the beta beside your stable Namida. Different app id, so it's a separate app with separate data (its icon has a BETA badge). |
| `namida-vX.X.X-clone-armeabi-v7a.apk` | beta only | Same clone, for 32 bit devices. |

::: callout info
You can install beta on top of stable and vice versa, your data stays as is. The clone builds are the only separate app.
:::

See [App Size](/app-size/) for a breakdown of what the APK contains.

#### Installing {#android-install}

1. Download the APK from the release page.
2. Open the file, Android asks to allow installing from unknown sources the first time.
3. That's it. Permissions are requested later while you use the app, and only when needed, see [Permissions](/permissions/).

If the install fails, see [Can't install the APK](/faq/#cant-install-apk).

#### Updating {#android-updates}

Installing a newer APK over the current one keeps your data, no need to uninstall.

::: callout tip
Use [Obtainium](https://apps.obtainium.imranr.dev/redirect?r=obtainium://add/https://github.com/namidaco/namida/) to get update notifications, point it at the [stable repo](https://github.com/namidaco/namida) or the [snapshots repo](https://github.com/namidaco/namida-snapshots) for beta.
:::

Namida is not on Google Play and will not be, see [Not Planned](/not-planned/#google-play) for the reasoning.

## Windows {#windows}

[`GitHub`](https://github.com/namidaco/namida/releases/latest) [`winget`](https://github.com/microsoft/winget-pkgs/tree/master/manifests/n/namidaco/Namida) [`GitHub Beta`](https://github.com/namidaco/namida-snapshots/releases/latest)

#### Which file {#windows-files}

| File | Pick it if |
| --- | --- |
| `Namida-x86_64-<version>-Installer.exe` | Normal install. Creates shortcuts and updates in place, recommended. |
| `Namida-x86_64-<version>-Portable.zip` | Nothing installed on the system. Extract anywhere and run `namida.exe`, good for a usb drive. |

#### Installing {#windows-install}

Run the installer and follow it, or extract the portable zip and start `namida.exe`.

Stable installers are also published to winget:

```bash
winget install namidaco.Namida
```

## Linux {#linux}

The tarball, deb and rpm need glibc 2.39 or newer (Ubuntu 24.04, Debian 13, Fedora 40 or newer). Older distros can use the AppImage or the flatpak.

[`GitHub`](https://github.com/namidaco/namida/releases/latest) [`AUR`](https://aur.archlinux.org/packages/namida-bin) [`GitHub Beta`](https://github.com/namidaco/namida-snapshots/releases/latest) [`AUR Beta`](https://aur.archlinux.org/packages/namida-beta-bin)

#### Dependencies {#linux-dependencies}

**mpv** is required for playback. You can skip this if you install through a package manager, the AppImage or the flatpak (they handle it themselves).

```bash
sudo pacman -S mpv            # Arch/Manjaro
sudo apt install mpv libmpv2  # Debian/Ubuntu/Mint
sudo dnf install mpv mpv-libs # Fedora/RHEL
```

**webkit2gtk** is optional and only needed for YouTube login. Most distros already ship it, and the AppImage and flatpak include it.

```bash
sudo pacman -S webkit2gtk-4.1          # Arch/Manjaro
sudo apt install libwebkit2gtk-4.1-0   # Debian/Ubuntu/Mint
sudo dnf install webkit2gtk4.1         # Fedora/RHEL
```

::: callout info
Older betas had separate `_login` builds bundling wpewebkit. They are gone, every build now logs in through webkit2gtk.
:::

#### Which file {#linux-files}

| File | Pick it if |
| --- | --- |
| `namida-vX.X.X.linux.tar.gz` | Any distro. This is what the quick install script below uses, or extract and run it yourself. |
| `namida-vX.X.X.linux.deb` | Debian, Ubuntu, Mint and friends. |
| `namida-vX.X.X.linux.rpm` | Fedora, RHEL and friends. |
| `Namida-x86_64-<version>.AppImage` | A single portable file, no installation. Everything is bundled so it runs on any distro, and it can update itself. |
| `Namida-x86_64-<version>.flatpak` | You already use flatpak. Ships its own mpv. |

#### Installing {#linux-install}

Quick install, downloads the latest tarball and installs it to `/opt/namida`:

```bash
curl -fsSL https://raw.githubusercontent.com/namidaco/namida/main/scripts/install_linux_tar.sh | sudo bash               # stable
curl -fsSL https://raw.githubusercontent.com/namidaco/namida/main/scripts/install_linux_tar.sh | sudo bash -s -- --beta  # beta
```

Through a package manager:

```bash
yay -Sy namida-bin             # AUR (Arch Linux)
paru -Sy namida-bin            # AUR (Arch Linux)
yay -Sy namida-beta-bin        # AUR beta (Arch Linux)
sudo apt install ./namida.deb  # Debian/Ubuntu, download the .deb first
sudo dnf install ./namida.rpm  # Fedora/RHEL, download the .rpm first
```

::: callout info
`namida-bin` used to get the betas, it now follows stable releases. To keep getting betas, install `namida-beta-bin` (it replaces `namida-bin`).
:::

AppImage, make it executable then run it:

```bash
chmod +x Namida-x86_64-<version>.AppImage
./Namida-x86_64-<version>.AppImage
```

Flatpak:

```bash
flatpak install --user ./Namida-x86_64-<version>.flatpak
flatpak run app.namida.Namida
```

Coming from the old `com.msob7y.namida` flatpak? The id is now `app.namida.Namida` `🆕 v8.2.0`, close Namida and move your data before removing the old one:

```bash
mv ~/.var/app/com.msob7y.namida ~/.var/app/app.namida.Namida
mv ~/.var/app/app.namida.Namida/data/com.msob7y.namida ~/.var/app/app.namida.Namida/data/app.namida.Namida
flatpak uninstall --user com.msob7y.namida
```

Nix (Home Manager) is available at [namida-nix](https://codeberg.org/iWisp360/namida-nix).

## macOS {#macos}

macOS is new and only has beta builds for now, in the [beta releases](https://github.com/namidaco/namida-snapshots/releases). `🆕 v8.5.0`

[`GitHub Beta`](https://github.com/namidaco/namida-snapshots/releases/latest)

#### Which file {#macos-files}

| File | Pick it if |
| --- | --- |
| `Namida-v<version>-macos-universal.dmg` | Any Mac (Apple Silicon and Intel). |
| `Namida-v<version>-macos-arm64.dmg` | Apple Silicon Macs only, smaller than universal. |
| `Namida-v<version>-macos-x86_64.dmg` | Intel Macs only, smaller than universal. |

Each file also comes as a `.zip` with the same app inside.

#### Installing {#macos-install}

Open the dmg and drag Namida to Applications. The app isn't signed, so allow it the first time in System Settings -> Privacy & Security -> Open Anyway. If macOS says the app is damaged, run:

```bash
xattr -dr com.apple.quarantine /Applications/Namida.app
```

Installing a newer build over the old one keeps your data.

#### Differences {#macos-differences}

Works differently on macOS:

- Every shortcut that uses `Ctrl` on Windows and Linux uses `Cmd` instead, except `Ctrl` + `Space` / `H` / `Q` / `Tab` (macOS uses those with `Cmd`). [`🎉 Shortcuts feature ↗`](/features/shortcuts/)
- The [tray](/features/system-integration/#tray) icon is in the menu bar, and clicking it opens its menu.
- Closing the window follows [Kill Player After Dismissing App](/settings/3-playback-settings/#kill-player) (quit / hide to the menu bar), and clicking the Dock icon brings the window back.

## iOS {#ios}

iOS is new and only has beta builds for now, in the [beta releases](https://github.com/namidaco/namida-snapshots/releases). `🆕 v8.5.0`

Namida needs iOS 15 or newer (iPhone or iPad). The `Namida-v<version>-ios.ipa` file is unsigned, so it's installed by sideloading.

[`GitHub Beta`](https://github.com/namidaco/namida-snapshots/releases/latest) [`AltStore Beta`](https://namidaco.github.io/namida-snapshots/altstore-source.json)

#### Installing {#ios-install}

Add this source in SideStore, AltStore or Feather to install Namida and get updates:

```text
https://namidaco.github.io/namida-snapshots/altstore-source.json
```

Sideloadly (on a computer) and [TrollStore](https://github.com/opa334/TrollStore) (only for [some old iOS versions](https://ios.cfw.guide/installing-trollstore)) can also install the downloaded ipa, but they don't read sources, so install each new ipa the same way to update. TrollStore installs the ipa permanently, so it doesn't need a refresh like the other apps.

Installing a newer build over the old one keeps your data.

#### Differences {#ios-differences}

Not available on iOS:

- The [output device](/features/playback/#output-device) picker. Pick the output from the iOS Control Center instead.
- [Kill Player After Dismissing App](/settings/3-playback-settings/#kill-player).
- CarPlay. It needs a permission that only Apple can grant.

Works differently on iOS:

- [Sync](/features/sync/) and [Listening Party](/features/party/) pause while Namida is in the background and not playing, because iOS suspends the app.
- [Downloads](/features/youtube/#downloads) keep going for a short time after you leave the app.
  - `⬆️ iOS 26+` They continue until they finish, and iOS shows their progress.
- Music in Namida's folder in the Files app (under On My iPhone) is scanned by default. Other folders are added through the system folder picker. [`⚙️ Configure Add Folder ↗`](/settings/2-indexer-settings/#add-folder)

---

### Companion Apps {#companion-apps}

Community built tools around Namida:

- [Namida Sync](https://github.com/010101-sans/namida_sync), syncs Namida backups & files across Android, Windows and Linux, by [@010101-sans](https://github.com/010101-sans).
- [Namida Charts](https://github.com/DiWu17/namida_history_app), yearly, monthly & more listening stats with charts, based on Namida history, by [@DiWu17](https://github.com/DiWu17).
- [Namida Wrapped](https://namida-wrapped.vercel.app), a local web ui for generating wrapped style stats, by [@bebrriko](https://github.com/bebrriko).

Namida now has all of these built in (sync, stats charts and a yearly wrap up), see [`🎉 Sync feature ↗`](/features/sync/) [`📄 Stats Page ↗`](/pages/other/#stats) [`📄 Your Year Page ↗`](/pages/other/#your-year)

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
