---
title: How to remove ripple effect from Tabs
slug: how-to-remove-ripple-effect-from-tabs
description: How to remove ripple effect from Tabs
sidebar:
  order: 0
---

Let's remove the annoying ripple effect from Tabs for Android.

```javascript
//In your TabLayout

 screenOptions={{
    ...
        headerShown: false,
        tabBarShowLabel: false,

        //Remove the ripple effect from Tabs
        tabBarButton: (props) => (
          <PlatformPressable
            {...props}
            android_ripple={{ color: "transparent" }}
          />
        ),
        //Ripple effect ends

        //Other styling options
        tabBarItemStyle: {
          paddingTop: 4,
        },
 }

```
