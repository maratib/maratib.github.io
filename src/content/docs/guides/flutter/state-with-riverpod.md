---
title: State with RiverPod
slug: guides/flutter/state-with-riverpod
description: State with RiverPod
sidebar:
  order: 10
---

**Riverpod** is the modern, more flexible successor to **Provider**, designed to overcome its limitations. It's compile-safe, can be used anywhere (not just in widgets), and is excellent for testing and scalability.

---

### 1. Why Riverpod?

- **Compile-Safe:** No runtime exceptions due to missing providers. Your code won't compile if you try to use a provider that isn't defined.
- **Unidirectional Data Flow:** Encourages a clean separation between state and UI.
- **Excellent Testability:** Easily mock and override providers for unit and widget tests.
- **Flexible:** Can be used for simple state, future data fetching (like API calls), stream handling, and more.
- **Not Tied to Widget Tree:** Providers are declared globally but are scoped and testable. You can read them anywhere, not just in `build` methods.

### 2. Core Concepts & Naming

The names are similar to Provider but prefixed with different types. Don't let this confuse you; the concepts map directly.

| Provider Type                | Purpose                                                                                                            | Provider Analog                                 |
| :--------------------------- | :----------------------------------------------------------------------------------------------------------------- | :---------------------------------------------- |
| **`Provider`**               | Provides an immutable object. Great for constants, repositories, or other objects that don't change.               | `Provider`                                      |
| **`StateProvider`**          | Provides a simple mutable state and a way to change it. Perfect for simple states like enums, strings, or numbers. | `ValueNotifier`                                 |
| **`StateNotifierProvider`**  | Provides a `StateNotifier` class. Best for complex state objects that have more involved business logic.           | `ChangeNotifier`                                |
| **`FutureProvider`**         | Provides the result of an asynchronous computation (e.g., an API call), handling loading and error states.         | N/A                                             |
| **`StreamProvider`**         | Provides a stream of values (e.g., from Firebase).                                                                 | N/A                                             |
| **`ConsumerWidget`**         | A `StatelessWidget` that can read providers. It has a `ref` object to interact with the provider world.            | `Consumer`                                      |
| **`ConsumerStatefulWidget`** | A `StatefulWidget` that can read providers. Its state class has a `ref` object.                                    | `Consumer`                                      |
| **`ref.watch()`**            | Listens to a provider and **rebuilds the widget** when the provided value changes.                                 | `Consumer`, `Provider.of` (with `listen: true`) |
| **`ref.read()`**             | Gets the value of a provider **once**, without listening for changes. Use in event callbacks like `onPressed`.     | `Provider.of` (with `listen: false`)            |

---

### 3. Step-by-Step Implementation (Counter App)

#### Step 1: Add the Dependencies

Add the latest Flutter Riverpod package to your `pubspec.yaml`.

```yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_riverpod: ^2.5.1 # Use the latest version

dev_dependencies:
  flutter_test:
    sdk: flutter
```

#### Step 2: Create a Simple Provider (The State)

We'll start with a `StateProvider`, which is perfect for a simple counter.

**lib/providers/counter_provider.dart**

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

// 1. Declare a Provider globally.
// This StateProvider manages an int and provides a way to increment it.
// The '((ref) => 0)' is the initialization function. It creates the initial state, which is 0.
final counterProvider = StateProvider<int>((ref) => 0);

// That's it. This provider handles the state and the logic (`.notifier` gives you the StateController to modify it).
// No need for a separate ChangeNotifier class!
```

#### Step 3: Wrap Your App in a `ProviderScope`

This is a required widget that stores the state of all your providers.

**lib/main.dart**

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart'; // Import Riverpod
import 'package:riverpod_guide/pages/home_page.dart';

void main() {
  runApp(
    // ProviderScope is essential. It must be an ancestor of any widget that uses Riverpod.
    const ProviderScope(
      child: MyApp(),
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

#### Step 4: Create a `ConsumerWidget` to Read the State

**lib/pages/home_page.dart**

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/counter_provider.dart'; // Import the provider

// 2. Extend ConsumerWidget instead of StatelessWidget.
// This gives us a 'WidgetRef ref' object in the build method.
class MyHomePage extends ConsumerWidget {
  const MyHomePage({super.key});

  @override
  // The build method now has an extra 'WidgetRef ref' parameter.
  Widget build(BuildContext context, WidgetRef ref) {
    // 3. Use ref.watch() to listen to the provider and rebuild when it changes.
    // This line gets the current state of the counterProvider.
    final counter = ref.watch(counterProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Riverpod Counter'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              // 4. Use ref.read() to get the provider's "notifier" (StateController)
              // without listening. Then call .state to reset the value.
              // This is safe inside callbacks.
              ref.read(counterProvider.notifier).state = 0;
            },
          ),
        ],
      ),
      body: Center(
        child: Text(
          // Use the watched value directly in the UI.
          '$counter',
          style: Theme.of(context).textTheme.displayLarge,
        ),
      ),
      floatingActionButton: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          FloatingActionButton(
            onPressed: () {
              // 5. Again, use ref.read() in callbacks.
              // .notifier gives us the StateController, which has an increment method.
              // Alternatively, we can just update the state directly:
              // ref.read(counterProvider.notifier).state++;
              ref.read(counterProvider.notifier).update((state) => state + 1);
            },
            tooltip: 'Increment',
            child: const Icon(Icons.add),
          ),
          const SizedBox(height: 10),
          FloatingActionButton(
            onPressed: () {
              ref.read(counterProvider.notifier).state--; // Direct state modification
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

---

### 4. Handling Complex State with `StateNotifierProvider`

For more complex state (e.g., a user profile with multiple fields and methods), use `StateNotifierProvider` with a `StateNotifier` class. This is the recommended pattern for most non-trivial state.

**lib/providers/user_profile_provider.dart**

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

// The state object. It's immutable. When we want to change it, we emit a new one.
class UserProfile {
  final String name;
  final int age;
  final String themeColor;

  const UserProfile({this.name = 'Guest', this.age = 0, this.themeColor = 'blue'});

  // Helper method for creating a new UserProfile when one property changes.
  UserProfile copyWith({String? name, int? age, String? themeColor}) {
    return UserProfile(
      name: name ?? this.name,
      age: age ?? this.age,
      themeColor: themeColor ?? this.themeColor,
    );
  }
}

// The StateNotifier class holds the state and contains the business logic.
class UserProfileNotifier extends StateNotifier<UserProfile> {
  // Initialize the state with the default UserProfile
  UserProfileNotifier() : super(const UserProfile());

  // Methods to update the state. Call `state = new_state` to change it.
  void updateName(String newName) {
    state = state.copyWith(name: newName);
  }

  void haveBirthday() {
    state = state.copyWith(age: state.age + 1);
  }

  void changeTheme(String newColor) {
    state = state.copyWith(themeColor: newColor);
  }
}

// The Provider that gives access to the StateNotifier and its state.
final userProfileProvider = StateNotifierProvider<UserProfileNotifier, UserProfile>((ref) {
  return UserProfileNotifier();
});
```

**Using it in a Widget:**

```dart
class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Watch the state
    final userProfile = ref.watch(userProfileProvider);
    // Read the notifier to call methods
    final profileNotifier = ref.read(userProfileProvider.notifier);

    return Scaffold(
      body: Column(
        children: [
          Text('Name: ${userProfile.name}'),
          Text('Age: ${userProfile.age}'),
          ElevatedButton(
            onPressed: profileNotifier.haveBirthday,
            child: const Text('Have Birthday'),
          ),
        ],
      ),
    );
  }
}
```

### 5. Key Riverpod Syntax Cheat Sheet

| Action                        | Syntax                                  | Example                                                    |
| :---------------------------- | :-------------------------------------- | :--------------------------------------------------------- |
| **Watch** (rebuild on change) | `ref.watch(provider)`                   | `final value = ref.watch(myProvider);`                     |
| **Read** (get value once)     | `ref.read(provider)`                    | `ref.read(myProvider.notifier).method();`                  |
| **Listen** (react to changes) | `ref.listen(provider, (prev, next) {})` | `ref.listen(provider, (_, newValue) => print(newValue));`  |
| **Read in callbacks**         | `ref.read(provider)`                    | `onPressed: () => ref.read(myProvider.notifier).update();` |
