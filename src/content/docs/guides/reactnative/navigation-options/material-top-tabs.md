---
title: Material Top Tabs
slug: material-top-tabs
description: React Native Material Top Tabs
sidebar:
  order: 5
---

### Installation

```bash
npx expo install @react-navigation/material-top-tabs
npx expo install react-native-tab-view
```

### Implementation

```jsx
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#e91e63",
          tabBarInactiveTintColor: "#555",
          tabBarIndicatorStyle: { backgroundColor: "#e91e63" },
          tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
        }}
      >
        <Tab.Screen name="Tab1" component={Tab1Screen} />
        <Tab.Screen name="Tab2" component={Tab2Screen} />
        <Tab.Screen name="Tab3" component={Tab3Screen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

### Pros

- Good for categorized content
- Horizontal scrolling for many tabs
- Visual indicator of current position

### Cons

- Limited vertical space for content
- Can be awkward with many tabs

### Best Practices

- Use for content that needs to be swiped between
- Limit number of tabs or make them scrollable
- Consider combining with other navigation patterns
