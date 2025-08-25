---
title: Drawer Navigation
slug: drawer-navigation
description: React Native Drawer Navigation
sidebar:
  order: 3
---

### Installation

```bash
npx expo install @react-navigation/drawer
npx expo install react-native-gesture-handler react-native-reanimated
```

### Implementation

```jsx
import { createDrawerNavigator } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          drawerActiveTintColor: "#6200ee",
          drawerItemStyle: { marginVertical: 5 },
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
```

### Pros

- Can accommodate many navigation items
- Doesn't take up screen space when closed
- Standard pattern for many applications

### Cons

- Hidden navigation (may reduce discoverability)
- More complex to implement than tabs
- Gesture can conflict with other UI elements

### Best Practices

- Group related items together
- Use dividers to organize content
- Consider combining with other navigators
- Provide alternative access to key features
