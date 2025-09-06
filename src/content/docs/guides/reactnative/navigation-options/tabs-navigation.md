---
title: Tabs Navigation
slug: tabs-navigation
description: React Native Tabs Navigation
sidebar:
  order: 2
---

### Installation

```bash
npx expo install @react-navigation/bottom-tabs
```

### Implementation

```jsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home")
              iconName = focused ? "home" : "home-outline";
            else if (route.name === "Settings")
              iconName = focused ? "settings" : "settings-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

### Pros

- Easy access to main sections of app
- Visual indication of current section
- Good for apps with distinct functional areas

### Cons

- Limited number of tabs (usually 3-5)
- Takes up screen real estate
- Not ideal for complex navigation flows

### Best Practices

- Limit to 3-5 main sections
- Use clear icons and labels
- Consider lazy loading tab screens
- Add badges for notifications if needed
