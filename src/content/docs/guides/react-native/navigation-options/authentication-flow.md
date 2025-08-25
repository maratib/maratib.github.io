---
title: Authentication Flow
slug: authentication-flow
description: React Native Authentication Flow
sidebar:
  order: 8
---

### Implementation

```jsx
const Stack = createStackNavigator();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    // Check for existing token
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await AsyncStorage.getItem("userToken");
      } catch (e) {
        // Handle error
      }
      setUserToken(token);
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken ? (
          // Authenticated screens
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          // Auth screens
          <>
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{ animationTypeForReplace: userToken ? "pop" : "push" }}
            />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```
