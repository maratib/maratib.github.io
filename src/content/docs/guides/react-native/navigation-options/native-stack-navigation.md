---
title: Native Stack Navigation
slug: native-stack-navigation
description: React Native Native Stack Navigation
sidebar:
  order: 4
---

### Installation

```bash
npx expo install @react-navigation/native-stack
```

### Implementation

```jsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const NativeStack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <NativeStack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerLargeTitle: true,
          headerTransparent: true,
        }}
      >
        <NativeStack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Overview" }}
        />
        <NativeStack.Screen
          name="Details"
          component={DetailsScreen}
          options={{ presentation: "modal" }}
        />
      </NativeStack.Navigator>
    </NavigationContainer>
  );
}
```

### Pros

- Better performance (uses native components)
- Native look and feel on each platform
- Smoother animations and gestures

### Cons

- Less customizable than JS-based stack
- Platform differences may require more code

### Best Practices

- Use for performance-critical parts of your app
- Leverage platform-specific options
- Test on both iOS and Android
