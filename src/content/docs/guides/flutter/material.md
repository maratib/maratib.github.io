---
title: Flutter MaterialApp
slug: guides/flutter/material
description: Flutter Container
sidebar:
  order: 16
---

Flutter's MaterialApp with global styling.

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // MaterialApp is the root widget that sets up the design system
    return MaterialApp(
      // App identification properties
      title: 'Global Styling Demo',
      debugShowCheckedModeBanner: false,

      // Global theme customization (most important for styling)
      theme: ThemeData(
        // Color scheme
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
          primary: Colors.deepPurple,
          secondary: Colors.amber,
          background: Colors.grey[50],
        ),

        // Typography
        textTheme: const TextTheme(
          bodyColor: Colors.blue,
          displayColor: Colors.red,
          displayLarge: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
          displayMedium: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
          bodyLarge: TextStyle(fontSize: 18, height: 1.5),
          bodyMedium: TextStyle(fontSize: 16, height: 1.5),
        ),

        // Component themes
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.deepPurple,
          foregroundColor: Colors.white,
          elevation: 4,
          centerTitle: true,
        ),

        buttonTheme: const ButtonThemeData(
          buttonColor: Colors.deepPurple,
          textTheme: ButtonTextTheme.primary,
        ),

        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.deepPurple,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        ),

        inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          contentPadding: const EdgeInsets.all(16),
        ),

        // Other global settings
        useMaterial3: true,
      ),

      // Dark theme variant
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
          brightness: Brightness.dark,
        ),
      ),

      // Routing and navigation
      initialRoute: '/',
      routes: {
        '/': (context) => const HomeScreen(),
        '/details': (context) => const DetailsScreen(),
      },

      // Localization
      locale: const Locale('en', 'US'),

      home: const HomeScreen(),
    );
  }
}
```

## MaterialApp Structure & Styling Flow

![App Theme Structure](/img/flutter/app_theme_structure.svg)

## Key Learning Points

### 1. ThemeData Properties

The `ThemeData` class is where you define your global styles:

```dart
ThemeData(
  colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
  textTheme: TextTheme(...),
  appBarTheme: AppBarTheme(...),
  buttonTheme: ButtonThemeData(...),
  // Plus many more properties
)
```

### 2. Applying Themes in Widgets

Access your global styles in any widget:

```dart
// Using text styles
Text('Hello', style: Theme.of(context).textTheme.headlineLarge)

// Using colors
Container(color: Theme.of(context).colorScheme.primary)

// Using component themes
ElevatedButton(
  onPressed: () {},
  child: Text('Button'),
  // Automatically uses elevatedButtonTheme
)
```

### 3. Component-Specific Theming

Customize specific UI components:

```dart
// AppBar customization
appBarTheme: AppBarTheme(
  backgroundColor: Colors.deepPurple,
  foregroundColor: Colors.white,
  elevation: 4,
)

// Button customization
elevatedButtonTheme: ElevatedButtonThemeData(
  style: ElevatedButton.styleFrom(
    padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
  )
)
```

### 4. When to Use Global vs Local Styles

| Global Styling (Theme) | Local Styling (Inline)     |
| ---------------------- | -------------------------- |
| Brand colors           | One-off design elements    |
| Typography system      | Unique compositional needs |
| Consistent components  | Experimental designs       |
| App-wide consistency   | Screen-specific needs      |

## Best Practices

1. **Define colors in ColorScheme** for consistency
2. **Create a text hierarchy** with TextTheme
3. **Use component themes** for reusable UI elements
4. **Leverage darkTheme** for dark mode support
5. **Combine global and local styles** when needed

This approach ensures your app has a consistent look and feel while maintaining flexibility for unique design needs.
