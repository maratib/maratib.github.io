---
title: NativeWind + Zustand + React Query
description: Production-ready setup for combining Expo + Bun with NativeWind, Zustand, and React Query
date: 2026-03-23
author: maratib
featured: true
sidebar:
  order: 2
---


Here’s a **production-ready setup** for combining **Expo + Bun** with:

* 🎨 **NativeWind** (styling)
* 🧠 **Zustand** (state)
* ⚡ **TanStack Query** (API + caching)

This is structured exactly how senior teams ship scalable apps.

---

# 🚀 1. Install Dependencies (Bun)

```bash
bun add nativewind react-native-reanimated react-native-safe-area-context
bun add zustand @tanstack/react-query axios
bun add -d tailwindcss
```

Then:

```bash
bunx tailwindcss init
```

---

# 🎨 2. NativeWind Setup

## ✅ `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,tsx}",
    "./src/**/*.{js,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

---

## ✅ `babel.config.js`

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel'],
  };
};
```

---

## ✅ Example Usage

```tsx
import { View, Text } from 'react-native';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Hello NativeWind 👋
      </Text>
    </View>
  );
}
```

---

# 🧠 3. Zustand Setup (Global State)

## 📁 `src/store/authStore.ts`

```ts
import { create } from 'zustand';

type AuthState = {
  user: null | { id: string; name: string };
  setUser: (user: AuthState['user']) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

---

## ✅ Usage

```ts
import { useAuthStore } from '@/store/authStore';

const user = useAuthStore((state) => state.user);
```

---

# ⚡ 4. React Query Setup (API Layer)

## 📁 `src/lib/react-query.ts`

```ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 mins
    },
  },
});
```

---

## 📁 `src/services/api/client.ts`

```ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  // attach token here
  return config;
});
```

---

## 📁 `src/features/user/api.ts`

```ts
import { apiClient } from '@/services/api/client';

export const getUser = async () => {
  const { data } = await apiClient.get('/user');
  return data;
};
```

---

## 📁 `src/features/user/hooks.ts`

```ts
import { useQuery } from '@tanstack/react-query';
import { getUser } from './api';

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
  });
};
```

---

# 🔌 5. Provider Setup (VERY IMPORTANT)

## 📁 `app/_layout.tsx`

```tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack />
    </QueryClientProvider>
  );
}
```

---

# 🧪 6. Example Screen (Everything Combined)

```tsx
import { View, Text, Button } from 'react-native';
import { useUser } from '@/features/user/hooks';
import { useAuthStore } from '@/store/authStore';

export default function Profile() {
  const { data, isLoading } = useUser();
  const setUser = useAuthStore((s) => s.setUser);

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold">
        {data?.name}
      </Text>

      <Button
        title="Save to Store"
        onPress={() => setUser(data)}
      />
    </View>
  );
}
```

---

# ⚙️ 7. Recommended Add-ons (Optional but Pro)

| Purpose     | Library                  |
| ----------- | ------------------------ |
| Forms       | react-hook-form + zod    |
| Storage     | expo-secure-store / mmkv |
| Icons       | @expo/vector-icons       |
| Animations  | react-native-reanimated  |
| Environment | expo-constants           |

---

# 🚀 Dev Workflow with Bun

```bash
bun install
bunx expo start
```

---

# 🔥 Senior Tips (Real-World)

* Keep **API logic inside features**, not global
* Use **React Query for server state ONLY**
* Use **Zustand for UI/global state**
* Don’t overuse global store → prefer feature isolation
* Add **error boundaries + retry UI** early

---

If you want next step, I can build you:

* 🔥 A **complete starter repo (copy-paste ready)**
* 🧠 Auth system (JWT + refresh + secure storage)
* 📦 Offline-first setup (React Query persistence + caching)
* 🚀 CI/CD with Expo EAS + environments
