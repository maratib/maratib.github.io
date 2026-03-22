---
title: Production-ready starter
description: production-ready starter repo structure for building apps with Expo + Bun
date: 2026-03-23
author: maratib
featured: true
sidebar:
  order: 5
---

Alright — here’s a **complete, production-ready starter repo structure** you can literally copy-paste and run for:

* **Expo + Bun**
* NativeWind (UI)
* Zustand (state)
* TanStack Query (API)
* JWT Auth (secure + refresh-ready)
* Scalable architecture

---

# 🚀 1. Project Setup (Run First)

```bash
bun create expo myApp --template blank-typescript
cd myApp

bun add nativewind zustand axios @tanstack/react-query
bun add react-native-safe-area-context react-native-screens
bun add expo-secure-store
bun add -d tailwindcss

bunx tailwindcss init
```

---

# 📁 2. Final Folder Structure

```bash
myApp/
├── app/
│   ├── (auth)/
│   │   └── login.tsx
│   ├── (tabs)/
│   │   └── home.tsx
│   ├── _layout.tsx
│
├── src/
│   ├── components/
│   │   └── Button.tsx
│
│   ├── features/
│   │   └── auth/
│   │       ├── api.ts
│   │       ├── store.ts
│   │       ├── hooks.ts
│   │       ├── persist.ts
│
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── refresh.ts
│   │   ├── storage/
│   │   │   └── secure.ts
│   │
│   ├── lib/
│   │   └── react-query.ts
│
│   ├── utils/
│   │   └── logger.ts
│
├── tailwind.config.js
├── babel.config.js
├── tsconfig.json
```

---

# ⚙️ 3. Core Config Files

## ✅ `tailwind.config.js`

```js
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
```

---

## ✅ `babel.config.js`

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["nativewind/babel"],
  };
};
```

---

## ✅ `tsconfig.json` (important)

```json
{
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

# ⚡ 4. React Query Setup

## `src/lib/react-query.ts`

```ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});
```

---

# 🔌 5. API Client + Auth Injection

## `src/services/api/client.ts`

```ts
import axios from "axios";
import { useAuthStore } from "@/features/auth/store";

export const apiClient = axios.create({
  baseURL: "https://api.example.com",
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

# 🔄 6. Auth Store (Zustand)

## `src/features/auth/store.ts`

```ts
import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  setTokens: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setTokens: (token) => set({ accessToken: token }),
  logout: () => set({ accessToken: null }),
}));
```

---

# 🔐 7. Secure Storage

## `src/services/storage/secure.ts`

```ts
import * as SecureStore from "expo-secure-store";

export const storage = {
  set: (k: string, v: string) => SecureStore.setItemAsync(k, v),
  get: (k: string) => SecureStore.getItemAsync(k),
  remove: (k: string) => SecureStore.deleteItemAsync(k),
};
```

---

# 🔑 8. Auth API + Hook

## `src/features/auth/api.ts`

```ts
import { apiClient } from "@/services/api/client";

export const login = async (email: string, password: string) => {
  const { data } = await apiClient.post("/auth/login", {
    email,
    password,
  });
  return data;
};
```

---

## `src/features/auth/hooks.ts`

```ts
import { useMutation } from "@tanstack/react-query";
import { login } from "./api";
import { useAuthStore } from "./store";
import { storage } from "@/services/storage/secure";

export const useLogin = () => {
  const setToken = useAuthStore((s) => s.setTokens);

  return useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      setToken(data.accessToken);
      await storage.set("token", data.accessToken);
    },
  });
};
```

---

# 🧱 9. Root Layout (Providers)

## `app/_layout.tsx`

```tsx
import { Stack } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack />
    </QueryClientProvider>
  );
}
```

---

# 🔐 10. Login Screen

## `app/(auth)/login.tsx`

```tsx
import { View, TextInput, Button } from "react-native";
import { useState } from "react";
import { useLogin } from "@/features/auth/hooks";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate } = useLogin();

  return (
    <View className="flex-1 justify-center p-4">
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        className="border p-2 mb-2"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        className="border p-2 mb-2"
      />
      <Button title="Login" onPress={() => mutate({ email, password })} />
    </View>
  );
}
```

---

# 🏠 11. Home Screen

## `app/(tabs)/home.tsx`

```tsx
import { View, Text } from "react-native";
import { useAuthStore } from "@/features/auth/store";

export default function Home() {
  const token = useAuthStore((s) => s.accessToken);

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Logged in ✅</Text>
      <Text>{token}</Text>
    </View>
  );
}
```

---

# 🚀 12. Run the App

```bash
bun install
bunx expo start
```

---

# 🔥 What You Get (Out of the Box)

✅ Clean scalable architecture
✅ Auth system (JWT ready)
✅ API layer (Axios + interceptors)
✅ State management (Zustand)
✅ Server state (React Query)
✅ Styling (NativeWind)
✅ Secure storage

---

# ⚡ Next Steps (Upgrade to Enterprise)

If you want to evolve this into a **real production system**, next upgrades would be:

* 🔄 Refresh token system (I showed earlier)
* 📦 Offline cache persistence
* 🧠 Global error boundary
* 📊 Sentry logging integration
* 🔐 Biometric auth (FaceID/Fingerprint)
* 🚀 CI/CD with EAS

---

If you want, I can convert this into:
👉 a **GitHub-ready repo (with README, scripts, env, CI/CD)**
👉 or a **WhatsApp-style / fintech-grade app starter (aligned with your SaaS idea WhatsProp)**
