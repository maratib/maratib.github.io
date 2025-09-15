---
title: Flutter Image
slug: guides/flutter/image
description: Flutter Image
sidebar:
  order: 17
---

- The **Image** widget is used to display images in Flutter apps.
- It has **several constructors** based on where the image comes from.

---

## 1. Image.asset

- **Purpose:** Load image from your local project’s `assets/` folder.
- **Setup:** Add the image to `pubspec.yaml` under `assets:`.
- **Example:**

```dart
Image.asset(
  'assets/images/logo.png',
  width: 150,
  height: 150,
  fit: BoxFit.cover,
)
```

👉 Best for **bundled static resources** like icons or backgrounds.

---

## 2. Image.network

- **Purpose:** Load image from the internet.
- **Example:**

```dart
Image.network(
  'https://via.placeholder.com/200',
  width: 200,
  height: 200,
  fit: BoxFit.cover,
  loadingBuilder: (context, child, loadingProgress) {
    if (loadingProgress == null) return child;
    return Center(child: CircularProgressIndicator());
  },
  errorBuilder: (context, error, stackTrace) {
    return Icon(Icons.error);
  },
)
```

👉 Best for **dynamic images** like profile pictures or thumbnails.

---

## 3. Image.file

- **Purpose:** Load image from the device’s **file system**.
- **Example:**

```dart
import 'dart:io';

Image.file(
  File('/storage/emulated/0/Download/example.png'),
  width: 200,
  height: 200,
)
```

👉 Used when a user picks or saves images locally.

---

## 4. Image.memory

- **Purpose:** Load image from **raw bytes** in memory.
- **Example:**

```dart
import 'dart:typed_data';

Uint8List imageBytes = ...; // From API or local data
Image.memory(
  imageBytes,
  width: 200,
  height: 200,
  fit: BoxFit.cover,
)
```

👉 Useful when fetching image data directly (e.g., from an API returning base64 or raw bytes).

---

## 5. Image.asset (SVG/Vector Alternative)

- Flutter’s `Image` doesn’t natively support SVG.
  Use [`flutter_svg`](https://pub.dev/packages/flutter_svg) package for SVG assets:

```dart
import 'package:flutter_svg/flutter_svg.dart';

SvgPicture.asset(
  'assets/icons/example.svg',
  width: 100,
  height: 100,
)
```

👉 For scalable **vector graphics**.

---

## 🎨 Key Properties of `Image`

- `width` / `height` → Size control.
- `fit` → How the image fits its box (`BoxFit.cover`, `contain`, `fill`, `fitWidth`, etc.).
- `color` & `colorBlendMode` → Tinting the image.
- `repeat` → Repeat image pattern (`ImageRepeat.repeat`).
- `alignment` → Control alignment inside its container.

---

## 🛠️ BoxFit Options (very important!)

| `BoxFit` Value | Description                                     |
| -------------- | ----------------------------------------------- |
| **fill**       | Stretch to fill (may distort)                   |
| **contain**    | Scale to fit within box (no crop)               |
| **cover**      | Fill box (crop excess parts)                    |
| **fitWidth**   | Fit width, crop height if needed                |
| **fitHeight**  | Fit height, crop width if needed                |
| **none**       | Original size, may overflow                     |
| **scaleDown**  | Like contain but never grow beyond natural size |

Example:

```dart
Image.network(
  "https://via.placeholder.com/300x150",
  fit: BoxFit.cover,
)
```

---

## 🔄 Comparison & Use Cases

| Constructor             | Use Case                                          |
| ----------------------- | ------------------------------------------------- |
| **Image.asset**         | Static app resources (logos, backgrounds)         |
| **Image.network**       | Dynamic online content (profiles, product images) |
| **Image.file**          | Local files from storage/gallery                  |
| **Image.memory**        | Raw image data from bytes                         |
| **flutter_svg** (extra) | Vector graphics (SVG icons, illustrations)        |

---

✅ **Tips**

- Use `FadeInImage.assetNetwork` for **placeholders + network images**:

```dart
FadeInImage.assetNetwork(
  placeholder: 'assets/loading.gif',
  image: 'https://via.placeholder.com/200',
)
```

- Cache images with [`cached_network_image`](https://pub.dev/packages/cached_network_image).
- Always use `fit: BoxFit.cover` or `contain` to avoid distortion.
