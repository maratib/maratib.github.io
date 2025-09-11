---
title: Flutter Create
slug: guides/flutter/flutter-create
description: Flutter Create
sidebar:
  order: 0
---

The **`flutter create`** command is the foundation of every Flutter project.

<table width="100%">

<!-- Column starts -->
<tr><td colspan="2">

`flutter create my_app`

</td></tr>
<tr><td valign="top" width="40%"><b>flutter create &lt;project_name&gt;</b></td>
<td valign="top">New project with default template</td>
</tr>
<tr><td colspan="2">&nbsp;</td></tr>

<!-- Column starts -->
<tr><td colspan="2">

`flutter create --platforms=android,ios awesome_app`

</td></tr>
<tr><td valign="top"><b>--platforms &lt;platforms></b></td>
<td valign="top">Specifies which platforms to add</td>
</tr>
<tr><td colspan="2">e.g web, windows, macos</td></tr>
<tr><td colspan="2">&nbsp;</td></tr>

<!-- Column starts -->
<tr><td colspan="2">

`flutter create --template=package awesome_app`

</td></tr>
<tr><td valign="top"><b>--template &lt;type></b></td>
<td valign="top">Creates a project based on a specific blueprint</td>
</tr>
<tr><td colspan="2">e.g package, plugin, module</td></tr>
<tr><td colspan="2">&nbsp;</td></tr>

<!-- Column starts -->
<tr><td colspan="2">

`flutter create --org com.awesome.myapp awesome_app`

</td></tr>
<tr><td valign="top"><b>--org &lt;domain></b></td>
<td valign="top">Sets the unique application ID</td>
</tr>
<tr><td colspan="2">&nbsp;</td></tr>

</table>

### Common Use Cases & Examples

#### 1. The Standard App

This is the command you will use 90% of the time. Always set your `--org`.

```bash
flutter create --org com.yourcompany.yourapp my_app
```

#### 2. Creating a Reusable Dart Package

You want to share pure Dart logic (models, utilities, APIs) across multiple projects.

```bash
flutter create --template=package --org com.yourcompany awesome_utils
```

#### 3. Creating a Plugin with Native Code

You need to write custom Kotlin/Swift code to access platform-specific APIs.

```bash
flutter create --template=plugin --org com.yourcompany --platforms=android,ios native_bridge
```

#### 4. Creating a Module for Existing Apps

You want to embed a Flutter screen inside your existing native Android/iOS app.

```bash
flutter create --template=module --org com.yourcompany flutter_feature_module
```

#### 5. Targeting Specific Platforms

You are building a desktop-only application and want to avoid mobile/web configs.

```bash
flutter create --platforms=windows,macos,linux desktop_app
```

**Pro Tip:** Always run `flutter create --help` to see the most up-to-date list of flags and options for your current Flutter SDK version. The available `--platforms` and `--template` options evolve over time.
