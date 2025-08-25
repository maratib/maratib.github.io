---
title: Stack Navigation
slug: stack-navigation
description: React Native Stack Navigation
sidebar:
  order: 1
---

### Installation

```bash
npx expo install @react-navigation/stack
```

### Implementation

```jsx
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: "#6200ee" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Overview" }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={({ route }) => ({ title: route.params.name })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Pros

- Familiar navigation pattern for most users
- Provides navigation history (back button)
- Good for master-detail flows
- Built-in animations and gestures

### Cons

- Can become complex with deep nesting
- Not ideal for all app types (e.g., tab-based apps)

### Best Practices

- Keep stack depth reasonable to avoid memory issues
- Use meaningful screen names
- Pass only necessary data in params
- Consider using a deep linking strategy
