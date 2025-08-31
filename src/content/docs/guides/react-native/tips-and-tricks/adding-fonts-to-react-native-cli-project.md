---
title: Adding fonts to react-native cli project
slug: adding-fonts-to-react-native-cli-project
description: Adding fonts to react-native cli project
sidebar:
  order: 1
---

Let's try to add custom font to react-native cli project step by step:-

### Create new project

```bash
# Create new project
npx @react-native-community/cli@latest init new-project-name

# Create folder to hold the fonts and copy the fonts files to this folder
makdir ./assets/fonts
```

### Create or update `react-native.config.js`

```javascript
module.exports = {
    projects: {
        ios: {},
        android: {},
    },
    asserts: ['./assets/fonts/'],
}
```
### Andorid Linking

```bash
# This will add the fonts to android native app
npx react-native-asset

# Check the following folder if the fonts are added 
android -> app -> src -> main -> assets -> fonts
# if it does not work try to remove `link-assets-manifest.json` from android folder and rerun the command

# Restart your application again
npx react-native start --reset-cache

# Try only fontFamily to see if it applies, some times font-weight create issues if you don't have relevant font file.
```

### iOS Linking

```bash
npx pod-install ios
```
