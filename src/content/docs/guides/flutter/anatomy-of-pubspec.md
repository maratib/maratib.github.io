---
title: Anatomy of pubspec.yaml
slug: guides/flutter/anatomy-of-pubspec
description: Anatomy of pubspec.yaml
sidebar:
  order: 20
---

The `pubspec.yaml` file is the heart of a Flutter project. It defines your app's identity, dependencies, and assets.

---

### Anatomy of `pubspec.yaml`: A Complete Reference

The file uses YAML syntax, so **indentation is critical**. Below is a fully annotated example with every major section.

```yaml
# The name of your project. Required.
# Allowed characters: lowercase letters, numbers, underscore.
# This is the name used to import your own files within your project.
# This is the name used on pub.dev if you publish.
name: my_awesome_app

# The description of your project. Optional but recommended.
# This is displayed on pub.dev if you publish.
description: A fantastic Flutter project that does amazing things.

# The published version of your project. Follows Semantic Versioning (MAJOR.MINOR.PATCH).
# +build: For pre-release builds (e.g., 1.0.0+1, 1.0.0+2).
version: 1.0.0+1

# The following two fields are used to generate the version shown in the app's UI.
# They are built from the `version` field above but can be overridden for more control.
version:
  # The version name shown to the user (e.g., "1.0.0").
  version: 1.0.0
  # The build number (an integer) used by OS app stores to identify different binaries.
  build_number: 1

# The homepage for your project. Optional.
publish_to: 'none' # This prevents accidental publishing to pub.dev.
# If you plan to publish, remove this line or set it to 'pub.dev'.

# Defines the environment your project requires.
# This is crucial for ensuring compatibility and preventing errors.
environment:
  sdk: '>=3.5.0 <4.0.0' # The version range of the Dart SDK you need.
  flutter: ">=1.17.0" # The version range of the Flutter SDK you need.

# Configuration for your application. This section is specific to Flutter apps.
flutter:
  # The following defines the application's icon and splash screen.
  # The value is set to an actual file path, not a symbol.
  uses-material-design: true # Enables the Material Icons font.

  # Specifies assets (images, fonts, data files) that should be bundled with your app.
  assets:
    - assets/images/ # A directory: includes all files in it recursively.
    - assets/images/logo.png # A single file.
    - assets/data/config.json

  # Declares fonts contained in the package.
  fonts:
    - family: Roboto # The name you use to refer to the font in your code (TextStyle(fontFamily: 'Roboto'))
      fonts:
        - asset: assets/fonts/Roboto-Regular.ttf
          weight: 400
        - asset: assets/fonts/Roboto-Bold.ttf
          weight: 700
    - family: MyCustomIconFont
      fonts:
        - asset: assets/fonts/icon_font.ttf

  # (For Plugin Projects) Exposes your plugin's platform implementation(s).
  # plugin:
  #   platforms:
  #     android:
  #       package: com.example.awesome_plugin
  #       pluginClass: AwesomePlugin
  #     ios:
  #       pluginClass: AwesomePlugin

# Dependencies are other packages that your project needs to work.
dependencies:
  flutter:
    sdk: flutter # The core Flutter framework, always included.

  # A package from the pub.dev repository. Use `flutter pub add` to get the latest version.
  cupertino_icons: ^1.0.6 # ^Caret: Auto-updates to the latest compatible version (e.g., 1.0.6 -> <2.0.0).
  provider: ^6.1.1

  # A package from a Git repository.
  awesome_package:
    git:
      url: https://github.com/someuser/awesome_package.git
      ref: main # Can be a branch name, tag, or commit hash.

  # A package from a local path on your machine (great for development).
  my_local_package:
    path: ../my_local_package/

  # A package that is included in the Dart SDK and doesn't need to be downloaded.
  http: ^1.2.0

# Dependencies that are only needed during development (tests, linters, build tools).
# These are NOT included in the final release bundle of your app.
dev_dependencies:
  flutter_test:
    sdk: flutter # The Flutter test utilities.
  flutter_lints: ^4.0.0 # A collection of recommended lints for Flutter apps.
  build_runner: ^2.4.0 # A tool for generating code (used with json_serializable, freezed, etc.).

# Scripts that can be run via `dart run <script_name>`.
# Often used for code generation or other project tasks.
executables:
  build_runner: build_runner # Lets you run `dart run build_runner` instead of `dart run build_runner build`
```

---

### CLI Commands Related to `pubspec.yaml`

These commands are used to manage everything defined in the `pubspec.yaml` file.

| Command                            | What It Does                                                                                                                              | Example & Common Flags                                                                |
| :--------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| **`flutter pub get`**              | The **most important** command. Reads `pubspec.yaml`, resolves dependencies, and downloads them. Creates/updates the `pubspec.lock` file. | `flutter pub get`                                                                     |
| **`flutter pub add <package>`**    | **Adds** a dependency to the `dependencies:` section and runs `pub get`. This is the modern, recommended way.                             | `flutter pub add provider`<br>`flutter pub add http --dev` (Adds as a dev dependency) |
| **`flutter pub remove <package>`** | **Removes** a dependency from `pubspec.yaml` and runs `pub get`.                                                                          | `flutter pub remove http`                                                             |
| **`flutter pub upgrade`**          | Upgrades dependencies to the latest versions **allowed** by the constraints in `pubspec.yaml`. Ignores the `pubspec.lock` file.           | `flutter pub upgrade`                                                                 |
| **`flutter pub outdated`**         | Analyzes your dependencies and shows which packages have newer versions available. Informs you what `pub upgrade` would do.               | `flutter pub outdated`                                                                |
| **`flutter pub downgrade`**        | The opposite of `upgrade`. Attempts to lower package versions to the lowest possible allowed by `pubspec.yaml`.                           | `flutter pub downgrade`                                                               |
| **`flutter pub deps`**             | Prints a dependency graph, showing the relationship between all your packages and their versions.                                         | `flutter pub deps`                                                                    |
| **`flutter pub publish`**          | Publishes your package (if it's a `package` or `plugin`) to [pub.dev](https://pub.dev). **Requires you to remove `publish_to: 'none'`.**  | `flutter pub publish --dry-run` (Tests without publishing)<br>`flutter pub publish`   |
| **`flutter pub run <executable>`** | Runs an executable command from one of your package's dependencies.                                                                       | `flutter pub run build_runner build` (Common for code generation)                     |

### Key Files Generated by `pub pub get`

When you run `flutter pub get`, it generates crucial files that you should **not** commit to version control (they are in your `.gitignore` by default):

1.  **`pubspec.lock`**: **DO COMMIT THIS.** This file locks your dependencies to _specific_ versions, ensuring every developer and your CI/CD system uses the exact same versions. This guarantees consistent builds.
2.  **`.dart_tool/` directory**: **DO NOT COMMIT.** This folder contains the cached downloaded packages and generated analysis data specific to your local machine.
3.  **`packages/` directory (Older projects)**: A symlink to the cached packages in `.dart_tool`. Not needed and is phased out.

### Workflow Summary

1.  **Add a package:** `flutter pub add <package_name>`
2.  **Install them:** `flutter pub get` (runs automatically after `add`/`remove`)
3.  **Check for updates:** `flutter pub outdated`
4.  **Update them:** `flutter pub upgrade`
5.  **Generate code (if needed):** `flutter pub run build_runner build --delete-conflicting-outputs`
6.  **Troubleshoot:** If you get strange dependency errors, try `flutter clean` and then `flutter pub get`.
