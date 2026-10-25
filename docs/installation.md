---
title: "Installation"
description: "How to install Namida on Android, Windows and Linux"
---

# Installation

Namida runs on Android, Windows and Linux. iOS and macOS are in beta, see [iOS & macOS](#ios-macos) for what they don't have yet.

There are two channels:

- [Stable releases](https://github.com/namidaco/namida/releases), for everyone.
- [Beta releases](https://github.com/namidaco/namida-snapshots/releases), new features and fixes are released here first. If YouTube or anything else stops working, try the latest beta.

::: callout warning
Namida is only available through [namida.app](https://namida.app), GitHub & Telegram.
We are not responsible for downloads from other sources.
:::

## Android {#android}

#### Which file {#android-files}

Every release has an APK per architecture, beta adds a clone variant on top.

| File | Channel | Pick it if |
| --- | --- | --- |
| `namida-vX.X.X-arm64-v8a.apk` | stable & beta | Default choice, works on any modern 64 bit device. |
| `namida-vX.X.X-armeabi-v7a.apk` | stable & beta | Old 32 bit device, or the arm64 one refuses to install. |
| `namida-vX.X.X-clone-arm64-v8a.apk` | beta only | You want the beta beside your stable Namida. Different app id, so it's a separate app with separate data. |
| `namida-vX.X.X-clone-armeabi-v7a.apk` | beta only | Same clone, for 32 bit devices. |

::: callout info
You can install beta on top of stable and vice versa, your data stays as is. The clone builds are the only separate app.
:::

#### Installing {#android-install}

1. Download the APK from the release page.
2. Open the file, Android asks to allow installing from unknown sources the first time.
3. That's it. Permissions are requested later while you use the app, and only when needed, see [Permissions](/permissions/).

If Google blocks the install, see [Can't install the APK](/faq/#play-protect).

#### Updating {#android-updates}

Installing a newer APK over the current one keeps your data, no need to uninstall.

::: callout tip
Use [Obtainium](https://apps.obtainium.imranr.dev/redirect?r=obtainium://add/https://github.com/namidaco/namida/) to get update notifications, point it at the [stable repo](https://github.com/namidaco/namida) or the [snapshots repo](https://github.com/namidaco/namida-snapshots) for beta.
:::

Namida is not on Google Play and will not be, see [Not Planned](/not-planned/#google-play) for the reasoning.

## Windows {#windows}

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

Linux builds are beta only for now, a stable one is coming.

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
| `namida-vX.X.X-beta.linux.tar.gz` | Any distro. This is what the quick install script below uses, or extract and run it yourself. |
| `namida-vX.X.X-beta.linux.deb` | Debian, Ubuntu, Mint and friends. |
| `namida-vX.X.X-beta.linux.rpm` | Fedora, RHEL and friends. |
| `Namida-x86_64-<version>.AppImage` | A single portable file, no installation. Everything is bundled so it runs on any distro, and it can update itself. |
| `Namida-x86_64-<version>.flatpak` | You already use flatpak. Ships its own mpv. |

#### Installing {#linux-install}

Quick install, downloads the latest tarball and installs it to `/opt/namida`:

```bash
curl -fsSL https://raw.githubusercontent.com/namidaco/namida/main/scripts/install_linux_tar.sh | sudo bash
```

Through a package manager:

```bash
yay -Sy namida-bin             # AUR (Arch Linux)
paru -Sy namida-bin            # AUR (Arch Linux)
sudo apt install ./namida.deb  # Debian/Ubuntu, download the .deb first
sudo dnf install ./namida.rpm  # Fedora/RHEL, download the .rpm first
```

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

## iOS & macOS {#ios-macos}

iOS and macOS are new and only have beta builds for now.

Features that only work on some platforms are labeled like `💻 Android only`. Features that work everywhere except iOS or macOS have no label, so they are listed here instead.

#### iOS {#ios-differences}

Not available on iOS:

- The [output device](/features/playback/#output-device) picker. Pick the output from the iOS Control Center instead.
- [Kill Player After Dismissing App](/settings/3-playback-settings/#kill-player).
- Sharing to Namida from other apps. Opening files with Namida still works.
- CarPlay. It needs a permission that only Apple can grant.

Works differently on iOS:

- [Sync](/features/sync/) and [Listening Party](/features/party/) pause while Namida is in the background and not playing, because iOS suspends the app.
- [Downloads](/features/youtube/#downloads) keep going for a short time after you leave the app. On iOS 26+ they continue until they finish, and iOS shows their progress.
- Music in Namida's folder in the Files app (under On My iPhone) is scanned by default. Other folders are added through the system folder picker. [`⚙️ Configure Add Folder ↗`](/settings/2-indexer-settings/#add-folder)

#### macOS {#macos-differences}

Works differently on macOS:

- Every shortcut that uses `Ctrl` on Windows and Linux uses `Cmd` instead. [`🎉 Shortcuts feature ↗`](/features/shortcuts/)
- The [tray](/features/system-integration/#tray) icon is in the menu bar, and clicking it opens its menu.

---

### Companion Apps {#companion-apps}

Community built tools around Namida:

- [Namida Sync](https://github.com/010101-sans/namida_sync), syncs Namida backups & files across Android, Windows and Linux, by [@010101-sans](https://github.com/010101-sans).
- [Namida Charts](https://github.com/DiWu17/namida_history_app), yearly, monthly & more listening stats with charts, based on Namida history, by [@DiWu17](https://github.com/DiWu17).
- [Namida Wrapped](https://namida-wrapped.vercel.app), a local web ui for generating wrapped style stats, by [@bebrriko](https://github.com/bebrriko).

Namida also has its own built in sync, see [`🎉 Sync feature ↗`](/features/sync/).

---

<sub>Author: @MSOB7YY<br>Writer: @claude</sub>
