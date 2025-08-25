---
title: Creating our first project
slug: create-our-first-project
description: Setting up development environment for ReactNative
sidebar:
  order: 2
---

Let's create our first project
[rn.new for more details](https://rn.new/)

### To create latest version of expo

```bash
# expo-starter
npx rn-new@latest [project-name] options


# Following command used to create this project
npx rn-new@latest expo-starter --expo-router --tabs --nativewind --zustand --supabase --pnpm

```

### To create latest `BETA` version of expo

```bash
# expo-starter
pnpm create expo-app --template default@next expo-54-beta-plain
```

<details>
  <summary>

### Show `rn-new` help

  </summary>

```bash
npx rn-new@latest --help

Usage:
npx create-expo-stack <project-name> [options]

Options:
--help, -h Show this help message
--default, -d Skip the CLI and use the default configuration
--nonInteractive Skip the CLI and use options passed via command line
--overwrite Overwrite the target directory if it exists
--noInstall Skip installing dependencies
--noGit Skip git initialization
--publish Create a GitHub repository and push the code

Info
Creates a new configurable Expo project

Usage
$ npx create-expo-stack <project_name> [options]

Commands:
create <project-name> Create a new Expo project
publish Publish current project to GitHub

Options
-d, --default Use the default options for creating a project
--noInstall Skip installing npm packages or CocoaPods
--noGit Skip initializing a git repository
--overwrite Skip checks for an existing project directory
--blank Use the blank typescript template
--npm Use npm as the package manager
--yarn Use yarn as the package manager
--pnpm Use pnpm as the package manager
--bun Use bun as the package manager
--importAlias Enable TS path aliases
-v, --version Version number
-h, --help Usage info

Navigation Package Options
--exporouter Use Expo Router for navigation
--reactnavigation Use React Navigation for navigation
--tabs Use tabs for navigation
--drawer+tabs Use drawer + tabs for navigation

Authentication Package Options
--firebase Use Firebase for authentication
--supabase Use Supabase for authentication

Analytics Package Options
--vexo-analytics Use Vexo Analytics for analytics

Styling Package Options
--nativewind Use Nativewind for styling
--tamagui Use Tamagui for styling
--restyle Use Restyle for styling
--unistyles Use Unistyles for styling
--stylesheet Use StyleSheet for styling

Internationalization
--i18next Use i18next and react-i18next for internationalization

Opinionated Stacks
-i, --ignite Use Ignite to create an opinionated stack

Non-Interactive Usage
If you know the options you want to use, you can pass them in via the
command line. This will skip the interactive CLI and use the options
you pass in. This is also useful for CI/CD environments.

    For example:

    $ npx create-expo-stack myProject --reactnavigation --nativewind --noInstall
```

</details>

<details>
  <summary>

### Show `expo-app` help

  </summary>

```bash
pnpm create expo-app --help

Info
Creates a new Expo project

Usage
$ npx create-expo-app <path> [options]

Options
-y, --yes Use the default options for creating a project
--no-install Skip installing npm packages or CocoaPods
-t, --template
-blank
-blank-typescript
-tabs
-bare-minimum
-default

    -e, --example [name]  Example name from https://github.com/expo/examples
    -v, --version         Version number
    -h, --help            Usage info

    To choose a template pass in the --template arg:

    $ pnpx create-expo-app --template

    To choose an Expo example pass in the --example arg:

    $ pnpx create-expo-app --example
    $ pnpx create-expo-app --example with-router

    The package manager used for installing
    node modules is based on how you invoke the CLI:

     npm: npx create-expo-app
    yarn: yarn create expo-app
    pnpm: pnpm create expo-app
     bun: bun create expo-app

```

</details>
