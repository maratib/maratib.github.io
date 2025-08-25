---
title: Material Bottom Tabs
slug: material-bottom-tabs
description: React Native Material Bottom Tabs
sidebar:
  order: 6
---

### Installation

```bash
npx expo install @react-navigation/material-bottom-tabs
npx expo install react-native-paper
```

### Implementation

```jsx
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Tab = createMaterialBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        activeColor="#e91e63"
        inactiveColor="#3e2465"
        barStyle={{ backgroundColor: "#fff" }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

### Pros

- Material Design compliant
- Attractive animation and styling
- Good integration with other Material components

### Cons

- Android-focused design
- Less customization than regular bottom tabs

### Best Practices

- Use in apps following Material Design guidelines
- Combine with other Material Design components
- Customize colors to match your brand
