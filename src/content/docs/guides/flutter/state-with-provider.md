---
title: State with Provider
slug: guides/flutter/state-with-provider
description: State with Provider
sidebar:
  order: 9
---

A guide to state management in Flutter using the **Provider** package. It's a perfect choice for most apps because it's simple, powerful, and encourages good architecture.

---

### 1. Why Provider?

Provider is built on top of Flutter's inherited widgets and offers a straightforward way to manage and access state across your widget tree.

- **Simplicity:** Less boilerplate than BLoC.
- **Performance:** Efficiently rebuilds only the widgets that need the changed data.
- **Scalability:** Great for small to medium-sized applications.
- **Official Recommendation:** The Flutter team officially recommends it for state management.

### 2. Core Concepts

- **ChangeNotifier:** A simple class from the Flutter SDK that provides change notification to its listeners. Your "state" will extend this.
- **ChangeNotifierProvider:** The widget that provides an instance of a `ChangeNotifier` to its descendants. It's where your state "lives".
- **Consumer:** A widget that listens to changes in a provided `ChangeNotifier` and rebuilds its children when notified.
- **Provider.of:** A method to access the provided state from anywhere in the widget tree, with the option to listen or not.

---

### 3. Step-by-Step Implementation

Let's build a simple counter app to demonstrate the pattern.

#### Step 1: Add the Dependency

Add the `provider` package to your `pubspec.yaml` and run `flutter pub get`.

```yaml
dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.1 # Use the latest version
```

#### Step 2: Create Your State (Model) with ChangeNotifier

This class holds your data and the logic to change it. When the data changes, it calls `notifyListeners()`.

**lib/models/counter_model.dart**

```dart
import 'package:flutter/foundation.dart';

// Extend ChangeNotifier to become a "observable" class.
class Counter with ChangeNotifier {
  // The private state (data)
  int _count = 0;

  // A getter to allow reading the value from outside
  int get count => _count;

  // A public method to update the state
  void increment() {
    _count++;
    // This call tells all listening widgets to rebuild.
    notifyListeners();
  }

  void decrement() {
    _count--;
    notifyListeners();
  }

  void reset() {
    _count = 0;
    notifyListeners();
  }
}
```

#### Step 3: Provide the State at the Top Level

Wrap your app (or a part of it) with a `ChangeNotifierProvider`. This creates the instance of `Counter` and makes it available to all widgets below it.

**lib/main.dart**

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart'; // Import the package
import 'models/counter_model.dart'; // Import your model

void main() {
  runApp(
    // Provide the model to all widgets in the app.
    // `create` creates the instance of our Counter.
    ChangeNotifierProvider(
      create: (context) => Counter(),
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: MyHomePage(),
    );
  }
}
```

#### Step 4: Access and Use the State from a Child Widget

You have two main ways to listen to the provided state.

##### Method A: Using `Consumer<T>` (Recommended for UI rebuilds)

`Consumer` is perfect for rebuilding specific parts of your UI. It's efficient because only the builder function rebuilds, not the entire widget.

**lib/pages/home_page.dart**

```dart
class MyHomePage extends StatelessWidget {
  const MyHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Provider Counter'),
        actions: [
          // Example of using a button that needs access to state
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              // Access the state and call a method on it.
              // 'listen: false' is CRUCIAL here because we are
              // inside a build method and we don't want to
              // rebuild this whole widget if the counter changes.
              Provider.of<Counter>(context, listen: false).reset();
            },
          ),
        ],
      ),
      body: Center(
        // The Consumer widget listens for changes in the Counter model.
        // It only rebuilds the Text widget inside it when notifyListeners is called.
        child: Consumer<Counter>(
          builder: (context, counter, child) {
            return Text(
              'You have pushed the button this many times:',
              style: Theme.of(context).textTheme.headlineSmall,
            );
            return Text(
              '${counter.count}', // Read the current count
              style: Theme.of(context).textTheme.displayLarge,
            );
          },
        ),
      ),
      floatingActionButton: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          FloatingActionButton(
            onPressed: () {
              Provider.of<Counter>(context, listen: false).increment();
            },
            tooltip: 'Increment',
            child: const Icon(Icons.add),
          ),
          const SizedBox(height: 10),
          FloatingActionButton(
            onPressed: () {
              Provider.of<Counter>(context, listen: false).decrement();
            },
            tooltip: 'Decrement',
            child: const Icon(Icons.remove),
          ),
        ],
      ),
    );
  }
}
```

##### Method B: Using `Provider.of<T>(context)` (For reading data)

Use this when you need to access the state inside callbacks (like `onPressed`) or initState. **Use `listen: false` inside build methods** if you are only performing an action, not rebuilding.

```dart
// Inside a button's onPressed
onPressed: () {
  // listen: false because we are not rebuilding, just calling a method.
  final counter = Provider.of<Counter>(context, listen: false);
  counter.increment();
}

// If you use it in the build method and WANT to rebuild, omit listen:false.
// This entire widget will rebuild on notifyListeners (less efficient than Consumer).
@override
Widget build(BuildContext context) {
  final counter = Provider.of<Counter>(context); // listen: true is default
  return Text('${counter.count}');
}
```

---

### 4. Handling More Complex State (Multiple Values)

What if your state has multiple values and you want to update them independently? The pattern is the same.

**lib/models/user_model.dart**

```dart
import 'package:flutter/foundation.dart';

class UserProfile with ChangeNotifier {
  String _name = 'Guest';
  int _age = 0;
  String _themeColor = 'blue';

  String get name => _name;
  int get age => _age;
  String get themeColor => _themeColor;

  void updateName(String newName) {
    _name = newName;
    notifyListeners();
  }

  void haveBirthday() {
    _age++;
    notifyListeners();
  }

  void changeTheme(String newColor) {
    _themeColor = newColor;
    notifyListeners();
  }
}
```

You can then use `Consumer<UserProfile>` and only the parts of the UI that depend on `name`, `age`, or `themeColor` will rebuild when their respective value changes.

---

### 5. Best Practices with Provider

1.  **`listen: false` in Callbacks:** Always use `Provider.of<T>(context, listen: false)` inside event callbacks (like `onPressed`) to avoid unnecessary rebuilds and errors.
2.  **Use `Consumer` for Granular Rebuilds:** Don't rebuild large swaths of UI for a small change. Wrap only the specific widget that needs updating with `Consumer`.
3.  **Separate Logic and UI:** Keep your `ChangeNotifier` classes (like `Counter`) pure. They should contain business logic, not UI code.
4.  **Multiple Providers:** You can (and should) use multiple providers for different concerns.
    ```dart
    runApp(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => Counter()),
          ChangeNotifierProvider(create: (_) => UserProfile()),
          Provider(create: (_) => SomeOtherClass()), // For non-changing data
        ],
        child: const MyApp(),
      ),
    );
    ```
5.  **Don't Provide State You Don't Need:** Provide state at the lowest possible point in the widget tree where it is needed. This improves performance and modularity.
