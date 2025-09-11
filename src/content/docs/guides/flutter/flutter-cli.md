---
title: Flutter CLI
slug: guides/flutter/flutter-cli
description: Flutter CLI
sidebar:
  order: 6
---

Knowing the Flutter CLI is like knowing the controls of a powerful machine. While there are many commands, a few form the core of daily development.

Here are the most used Flutter CLI commands, broken down by category, with explanations of what they do "under the hood."

---

### The Absolute Essentials (Daily Drivers)

#### 1. `flutter run`

**What it does:** Compiles your code and launches the application on a connected device, emulator, or simulator.

**Derivation & Flags:**

- `-d <device_id>`: Specifies which device to run on. Use `flutter devices` to get the ID.
  - **Example:** `flutter run -d emulator-5554`
- `--release`: Builds and runs a release version (optimized for performance and size).
- `--debug`: Builds and runs a debug version (includes debugging tools, hot reload, is unoptimized). This is the **default**.
- `--profile`: Builds and runs a profile version (a performance-measurable version, like release but with some debugging enabled).
- `--flavor <name>`: Used to run a specific "flavor" or variant of your app (e.g., `dev`, `staging`, `prod`).

**What it's actually doing:** This command triggers a complex pipeline:

1.  **Compilation:** The Dart compiler (`dart compile`) turns your Dart code into native machine code (for release/profile on iOS/Android) or kernel files (for debug/JIT).
2.  **Packaging:** It assembles the app bundle (`.aab`) or application package (`.apk` for Android) and the iOS `.app` bundle.
3.  **Installation:** It uses platform-specific tools (`adb install` for Android, `ios-deploy` or Xcode tools for iOS) to install the app on the target device.
4.  **Launching:** It launches the app and attaches various services, most importantly the **Dart VM Service** for debug builds, which enables Hot Reload.

---

#### 2. `flutter pub get`

**What it does:** Reads the `pubspec.yaml` file and downloads all the dependencies (packages/plugins) listed there into a `.dart_tool/` directory and creates the `pubspec.lock` file.

**Derivation:**

- `flutter pub add <package_name>`: **The most useful derivative.** This command adds a dependency to your `pubspec.yaml` and runs `flutter pub get` automatically.
  - **Example:** `flutter pub add provider`
- `flutter pub remove <package_name>`: Removes a dependency and runs `flutter pub get`.
- `flutter pub upgrade`: Upgrades your dependencies to the latest versions allowed by your `pubspec.yaml` (ignores the `pubspec.lock` file).
- `flutter pub outdated`: Shows you which of your dependencies have newer versions available.

**What it's actually doing:** It's a wrapper around Dart's `pub get` command. It resolves the dependency graph, downloads packages from [pub.dev](https://pub.dev), and stores them in a cache on your system so they can be shared across projects.

---

#### 3. Hot Reload vs. Hot Restart (`r` and `R` in the console)

While not a direct CLI command you type first, they are the most used _interactions_ with the CLI after running `flutter run`.

- **Hot Reload (Type `r` in the terminal):** Injects updated source code files into the running Dart VM (Virtual Machine). It rebuilds the widget tree **without destroying the app's state**. This is incredibly fast.
- **Hot Restart (Type `R` in the terminal):** Restarts the Flutter app without losing the connection to the device. It **clears all state** and runs the app from scratch. It's faster than a full quit-and-relaunch but slower than Hot Reload.

---

### The Crucial Maintenance & Setup Commands

#### 4. `flutter clean`

**What it does:** Deletes the `/build` and `.dart_tool` directories.

**Why it's used:** These folders contain all the temporary files and cached data from previous builds. Sometimes these files can become corrupted or outdated, leading to strange, inexplicable build errors. Running `flutter clean` gives you a "fresh start" for your next build. It's the Flutter equivalent of "turn it off and on again."

#### 5. `flutter doctor`

**What it does:** Diagnoses your development environment and reports the status of all required and optional Flutter dependencies.

**Why it's used:** This is the **first command you should run** if you have any installation or configuration issues. It will tell you if you're missing the Android SDK, Xcode, if your licenses aren't accepted, or if your connected devices are recognized. It often provides helpful links to fix the problems it finds.

---

### The Build Commands (For Release)

#### 6. `flutter build`

**What it does:** Compiles your code into a deployable artifact for a specific platform.

**Derivation & Flags:**

- `flutter build apk`: Builds a release APK for Android.
- `flutter build appbundle`: Builds an Android App Bundle (`.aab`), the required format for publishing on Google Play.
- `flutter build ipa`: Builds an iOS archive (`.ipa`) for distribution to the App Store.
- `flutter build web`: Builds a web application into the `/build/web` directory.

**What it's actually doing:** This command runs the full release compilation pipeline for the specified target platform, producing a optimized, minified, and obfuscated package ready for distribution.

---

### Summary: The Flutter CLI Workflow

Here’s how these commands fit into a typical development session:

1.  **Setup/Check:** `flutter doctor` (if something feels wrong)
2.  **Get Dependencies:** `flutter pub get` (after cloning a project or adding a new package)
3.  **Develop:**
    - `flutter run` (to start the app)
    - **Edit code -> Press `r` for Hot Reload** (repeat this cycle 100x a day)
    - **If state gets weird -> Press `R` for Hot Restart**
4.  **Troubleshoot:** `flutter clean` (if you get a bizarre build error)
5.  **Release:** `flutter build appbundle` or `flutter build ipa` (when you're ready to publish)
