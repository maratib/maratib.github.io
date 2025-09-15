---
title: Flutter Clip
slug: guides/flutter/clip
description: Flutter Clip
sidebar:
  order: 17
---

## 1. **ClipRRect**

- **Purpose:** Clips its child using a **rounded rectangle**.
- **Usage:** Commonly used to create rounded corners for widgets like `Container`, `Image`, or `Card`.
- **Key Property:**

  - `borderRadius` → Defines the corner radius.

- **Example:**

```dart
ClipRRect(
  borderRadius: BorderRadius.circular(20),
  child: Image.network(
    "https://via.placeholder.com/200",
    width: 200,
    height: 200,
    fit: BoxFit.cover,
  ),
)
```

👉 This produces an image with **smooth rounded corners**.

---

## 2. **ClipOval**

- **Purpose:** Clips child into an **oval or circle**.
- **Use case:** Perfect for circular profile pictures.
- **Example:**

```dart
ClipOval(
  child: Image.network(
    "https://via.placeholder.com/150",
    width: 100,
    height: 100,
    fit: BoxFit.cover,
  ),
)
```

👉 Creates a circular cropped image.

---

## 3. **ClipRect**

- **Purpose:** Clips child into a **rectangle**, usually used with a custom `CustomClipper<Rect>`.
- **Use case:** When you only want to show part of a widget (like cropping an image).
- **Example:**

```dart
ClipRect(
  child: Align(
    alignment: Alignment.topCenter,
    heightFactor: 0.5, // show only top half
    child: Image.network(
      "https://via.placeholder.com/200x100",
      width: 200,
      height: 100,
    ),
  ),
)
```

👉 Shows only the top half of the image.

---

## 4. **ClipPath**

- **Purpose:** Clips child into **custom shapes** using a `CustomClipper<Path>`.
- **Use case:** Wavy headers, triangle cuts, diagonal clipping.
- **Example:**

```dart
class DiagonalClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    Path path = Path();
    path.lineTo(0, size.height);
    path.lineTo(size.width, size.height * 0.75);
    path.lineTo(size.width, 0);
    path.close();
    return path;
  }

  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) => false;
}

ClipPath(
  clipper: DiagonalClipper(),
  child: Container(
    color: Colors.blue,
    height: 200,
  ),
)
```

👉 Clips a container into a **diagonal shape**.

---

## 5. **Comparison & Use Cases**

| Widget        | Shape Type        | Common Use                               |
| ------------- | ----------------- | ---------------------------------------- |
| **ClipRRect** | Rounded rectangle | Rounded corners for containers/images    |
| **ClipOval**  | Circle or oval    | Profile pictures, avatars                |
| **ClipRect**  | Rectangle         | Cropping part of a widget                |
| **ClipPath**  | Custom path/shape | Wavy headers, triangles, creative shapes |

---

✅ **Tips:**

- Clipping can be expensive for performance if overused, especially in scrollable lists.
- For simple rounded corners on `Container`/`Card`, you can often use `decoration` with `borderRadius` instead of `ClipRRect`.
- Use `ClipPath` for creative designs like waves, diagonals, or polygons.
