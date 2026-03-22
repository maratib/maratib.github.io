---
title: Bun Commands
description: Bun commands for react-native
date: 2026-03-23
author: maratib
featured: true
sidebar:
  order: 0
---

Using **Bun** with **React Native** (especially via **Expo**) is becoming popular because Bun is much faster than npm/yarn for installs and scripts.

Below is a **practical command reference table** for working with React Native + Expo using Bun 👇

---

# 🚀 Bun + React Native (Expo) Command Cheat Sheet

## 🧱 1. Create Projects

| Purpose                              | Command                                             |
| ------------------------------------ | --------------------------------------------------- |
| Create Expo app (recommended)        | `bun create expo`                                   |
| Create Expo app with template        | `bun create expo myApp -t`                          |
| Create blank Expo app                | `bun create expo myApp --template blank`            |
| Create TypeScript Expo app           | `bun create expo myApp --template blank-typescript` |
| Create Expo app (specific template)  | `bun create expo myApp --template tabs`             |
| Initialize existing project with Bun | `bun init`                                          |

---

## 📦 2. Dependency Management

| Purpose                        | Command                                        |
| ------------------------------ | ---------------------------------------------- |
| Install dependencies           | `bun install`                                  |
| Add a package                  | `bun add package-name`                         |
| Add dev dependency             | `bun add -d package-name`                      |
| Remove package                 | `bun remove package-name`                      |
| Upgrade dependencies           | `bun upgrade`                                  |
| Clean install (fresh lockfile) | `rm -rf node_modules bun.lockb && bun install` |

---

## ▶️ 3. Running the App

| Purpose                | Command                 |
| ---------------------- | ----------------------- |
| Start Expo dev server  | `bunx expo start`       |
| Start with clear cache | `bunx expo start -c`    |
| Run on Android         | `bunx expo run:android` |
| Run on iOS (Mac only)  | `bunx expo run:ios`     |
| Run on web             | `bunx expo start --web` |

---

## 📱 4. Device & Emulator

| Purpose               | Command                     |
| --------------------- | --------------------------- |
| Open Android emulator | `bunx expo start --android` |
| Open iOS simulator    | `bunx expo start --ios`     |
| Show QR code          | `bunx expo start`           |

---

## 🔧 5. Development Utilities

| Purpose                       | Command                   |
| ----------------------------- | ------------------------- |
| Run any CLI (npx alternative) | `bunx <command>`          |
| Lint project                  | `bunx eslint .`           |
| Format code                   | `bunx prettier --write .` |
| Type check (TS)               | `bunx tsc --noEmit`       |

---

## 🏗️ 6. Build & Production (Expo)

| Purpose         | Command                     |
| --------------- | --------------------------- |
| Install EAS CLI | `bun add -g eas-cli`        |
| Configure build | `bunx eas build:configure`  |
| Build Android   | `bunx eas build -p android` |
| Build iOS       | `bunx eas build -p ios`     |
| Submit to store | `bunx eas submit`           |

---

## 🔄 7. Expo Maintenance

| Purpose                            | Command                       |
| ---------------------------------- | ----------------------------- |
| Install Expo dependencies properly | `bunx expo install <package>` |
| Upgrade Expo SDK                   | `bunx expo upgrade`           |
| Doctor (check issues)              | `bunx expo doctor`            |
| Prebuild (eject)                   | `bunx expo prebuild`          |

---

## ⚙️ 8. Environment & Scripts

| Purpose           | Command            |
| ----------------- | ------------------ |
| Run custom script | `bun run <script>` |
| Run dev script    | `bun run dev`      |
| Run build script  | `bun run build`    |

---

## 🧪 9. Testing

| Purpose                  | Command     |
| ------------------------ | ----------- |
| Run tests                | `bun test`  |
| Run Jest (if configured) | `bunx jest` |

---

## ⚡ Key Notes (Important)

* **`bunx` = `npx` replacement**
* **Expo CLI works seamlessly with Bun**
* Avoid using `react-native init` with Bun directly → Expo is smoother
* Bun handles installs much faster than npm/yarn

---

## 💡 Typical Workflow (Real Dev Flow)

```bash
bun create expo myApp --template blank-typescript
cd myApp
bun install
bunx expo start
```

---

## ⚠️ Limitations (as of now)

* Native modules may sometimes need fallback to npm/yarn
* iOS builds still depend on Xcode tooling (Bun doesn’t replace that)
* Some React Native CLI setups are not fully Bun-native yet


