---
title: Flutter Scaffold
slug: guides/flutter/scaffold
description: Flutter Scaffold
sidebar:
  order: 17
---

- Scaffold is one of the most important layout widgets in Flutter
- It provides a basic Material Design visual layout structure and implements all the fundamental UI components you need for most applications.

## What is Scaffold?

The Scaffold widget provides a framework for implementing the basic Material Design layout of your app. It offers a variety of components that you can use to build a standard app interface, including:

- App bars
- Navigation drawers
- Bottom sheets
- Floating action buttons
- Snackbars
- And more

## Basic Scaffold Structure

Here's the minimal code to create a Scaffold:

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('My First Scaffold'),
        ),
        body: const Center(
          child: Text('Hello, World!'),
        ),
      ),
    );
  }
}
```

## Most Used Scaffold Properties

Let's explore the most commonly used properties of the Scaffold widget:

### 1. appBar (AppBar)

The top app bar that typically displays the title, leading icons, and actions.

```dart
appBar: AppBar(
  title: const Text('My App'),
  backgroundColor: Colors.blue,
  actions: [
    IconButton(
      icon: const Icon(Icons.search),
      onPressed: () {},
    ),
    IconButton(
      icon: const Icon(Icons.more_vert),
      onPressed: () {},
    ),
  ],
),
```

### 2. body (Widget)

The primary content of the scaffold.

```dart
body: const Center(
  child: Text('Main Content Area'),
),
```

### 3. floatingActionButton (Widget)

A button that floats above the body in the bottom right corner.

```dart
floatingActionButton: FloatingActionButton(
  onPressed: () {},
  child: const Icon(Icons.add),
),
```

### 4. drawer (Widget)

A panel that slides in horizontally from the left side.

```dart
drawer: Drawer(
  child: ListView(
    children: [
      const DrawerHeader(
        decoration: BoxDecoration(color: Colors.blue),
        child: Text('Drawer Header'),
      ),
      ListTile(
        title: const Text('Item 1'),
        onTap: () {},
      ),
      ListTile(
        title: const Text('Item 2'),
        onTap: () {},
      ),
    ],
  ),
),
```

### 5. bottomNavigationBar (Widget)

A navigation bar displayed at the bottom of the scaffold.

```dart
bottomNavigationBar: BottomNavigationBar(
  items: const [
    BottomNavigationBarItem(
      icon: Icon(Icons.home),
      label: 'Home',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.business),
      label: 'Business',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.school),
      label: 'School',
    ),
  ],
),
```

### 6. backgroundColor (Color)

The color to use for the background of the scaffold.

```dart
backgroundColor: Colors.grey[200],
```

### 7. resizeToAvoidBottomInset (bool)

Whether the body should resize when the keyboard appears.

```dart
resizeToAvoidBottomInset: true,
```

## Complete Example

Here's a complete example that uses all the major Scaffold properties:

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: MyScaffoldExample(),
    );
  }
}

class MyScaffoldExample extends StatefulWidget {
  const MyScaffoldExample({super.key});

  @override
  State<MyScaffoldExample> createState() => _MyScaffoldExampleState();
}

class _MyScaffoldExampleState extends State<MyScaffoldExample> {
  int _selectedIndex = 0;

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scaffold Example'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {},
          ),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(color: Colors.blue),
              child: Text('Drawer Header'),
            ),
            ListTile(
              title: const Text('Item 1'),
              onTap: () {
                Navigator.pop(context);
              },
            ),
            ListTile(
              title: const Text('Item 2'),
              onTap: () {
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Main Content Area'),
            ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Button Pressed!')),
                );
              },
              child: const Text('Show Snackbar'),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        child: const Icon(Icons.add),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: BottomAppBar(
        shape: const CircularNotchedRectangle(),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            IconButton(
              icon: const Icon(Icons.home),
              onPressed: () {},
            ),
            IconButton(
              icon: const Icon(Icons.settings),
              onPressed: () {},
            ),
          ],
        ),
      ),
      backgroundColor: Colors.grey[100],
    );
  }
}
```

## Visual Guide to Scaffold Structure

![Scaffold](/img/flutter/scaffold.svg)

## Key Points to Remember

1. **Scaffold is a layout container** that provides structure to your app
2. **Only one Scaffold should be used per screen** in most cases
3. **The body property is required** - all others are optional
4. **Scaffold widgets are Material Design specific** - for Cupertino style, use CupertinoPageScaffold
5. **Use ScaffoldMessenger** to show SnackBars that persist across routes

## Common Use Cases

1. **Basic app screen** with app bar and body
2. **Navigation drawer** for app navigation
3. **Floating action button** for primary actions
4. **Bottom navigation** for switching between views
5. **SnackBars** for temporary messages
