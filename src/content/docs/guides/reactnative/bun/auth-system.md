---
title: Auth system (JWT + refresh + secure storage)
description: Auth system (JWT + refresh + secure storage) for building apps with Expo + Bun
date: 2026-03-23
author: maratib
featured: true
sidebar:
  order: 4
---

Here’s a **production-grade auth system** for **Expo + Bun** using:

* 🔐 JWT (access + refresh tokens)
* 🔄 Auto refresh flow
* 🔒 Secure storage (device-safe)
* 🧠 State via **Zustand**
* ⚡ API handling via **TanStack Query**

This is how real fintech / SaaS apps handle auth.

---

# 🧠 1. Architecture Overview

```
Login → Receive access + refresh token
       ↓
Store securely (SecureStore)
       ↓
Attach access token to API calls
       ↓
If expired → use refresh token
       ↓
If refresh fails → logout user
```

---

# 🔒 2. Secure Storage Layer

## 📁 `src/services/storage/secure.ts`

```ts
import * as SecureStore from 'expo-secure-store';

export const secureStorage = {
  set: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  },

  get: async (key: string) => {
    return await SecureStore.getItemAsync(key);
  },

  remove: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
};
```

---

# 🧠 3. Auth Store (Zustand)

## 📁 `src/features/auth/store.ts`

```ts
import { create } from 'zustand';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (access: string, refresh: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,

  setTokens: (access, refresh) =>
    set({ accessToken: access, refreshToken: refresh }),

  logout: () =>
    set({ accessToken: null, refreshToken: null }),
}));
```

---

# 🔌 4. API Client with Auto Token Injection

## 📁 `src/services/api/client.ts`

```ts
import axios from 'axios';
import { useAuthStore } from '@/features/auth/store';

export const apiClient = axios.create({
  baseURL: 'https://api.example.com',
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

---

# 🔄 5. Refresh Token Logic (CRITICAL)

## 📁 `src/services/api/refresh.ts`

```ts
import { apiClient } from './client';
import { useAuthStore } from '@/features/auth/store';

let isRefreshing = false;
let queue: any[] = [];

export const refreshToken = async () => {
  const { refreshToken, setTokens, logout } =
    useAuthStore.getState();

  if (!refreshToken) return logout();

  try {
    const { data } = await apiClient.post('/auth/refresh', {
      refreshToken,
    });

    setTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch (e) {
    logout();
    throw e;
  }
};

export const handleTokenRefresh = async (error: any) => {
  const originalRequest = error.config;

  if (error.response?.status !== 401) {
    return Promise.reject(error);
  }

  if (isRefreshing) {
    return new Promise((resolve) => {
      queue.push((token: string) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        resolve(apiClient(originalRequest));
      });
    });
  }

  isRefreshing = true;

  try {
    const newToken = await refreshToken();

    queue.forEach((cb) => cb(newToken));
    queue = [];

    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    return apiClient(originalRequest);
  } finally {
    isRefreshing = false;
  }
};
```

---

## 🔌 Attach to Axios

```ts
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => handleTokenRefresh(error)
);
```

---

# 🔐 6. Persist Tokens Securely

## 📁 `src/features/auth/persist.ts`

```ts
import { secureStorage } from '@/services/storage/secure';
import { useAuthStore } from './store';

const ACCESS = 'access_token';
const REFRESH = 'refresh_token';

export const saveTokens = async (access: string, refresh: string) => {
  await secureStorage.set(ACCESS, access);
  await secureStorage.set(REFRESH, refresh);
};

export const loadTokens = async () => {
  const access = await secureStorage.get(ACCESS);
  const refresh = await secureStorage.get(REFRESH);

  if (access && refresh) {
    useAuthStore.getState().setTokens(access, refresh);
  }
};

export const clearTokens = async () => {
  await secureStorage.remove(ACCESS);
  await secureStorage.remove(REFRESH);
};
```

---

# 🔑 7. Login Flow

## 📁 `src/features/auth/api.ts`

```ts
import { apiClient } from '@/services/api/client';

export const login = async (email: string, password: string) => {
  const { data } = await apiClient.post('/auth/login', {
    email,
    password,
  });

  return data;
};
```

---

## 📁 `src/features/auth/hooks.ts`

```ts
import { useMutation } from '@tanstack/react-query';
import { login } from './api';
import { saveTokens } from './persist';
import { useAuthStore } from './store';

export const useLogin = () => {
  const setTokens = useAuthStore((s) => s.setTokens);

  return useMutation({
    mutationFn: ({ email, password }: any) =>
      login(email, password),

    onSuccess: async (data) => {
      setTokens(data.accessToken, data.refreshToken);
      await saveTokens(data.accessToken, data.refreshToken);
    },
  });
};
```

---

# 🚪 8. Logout Flow

```ts
import { clearTokens } from './persist';
import { useAuthStore } from './store';

export const useLogout = () => {
  const logout = useAuthStore((s) => s.logout);

  return async () => {
    logout();
    await clearTokens();
  };
};
```

---

# 🔄 9. App Initialization (Auto Login)

## 📁 `app/_layout.tsx`

```tsx
import { useEffect, useState } from 'react';
import { loadTokens } from '@/features/auth/persist';
import { Stack } from 'expo-router';

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadTokens().finally(() => setReady(true));
  }, []);

  if (!ready) return null;

  return <Stack />;
}
```

---

# 🛡️ 10. Protect Routes

```ts
const token = useAuthStore((s) => s.accessToken);

if (!token) {
  return <Redirect href="/login" />;
}
```

---

# 🚀 Real Production Behavior

* App starts → tokens loaded from secure storage
* Requests auto include JWT
* Token expires → auto refresh
* Refresh fails → user logged out
* Offline → requests queued (if you implemented earlier system)

---

# ⚠️ Critical Best Practices

✅ Always use **refresh token rotation**
✅ Keep access token short-lived (5–15 min)
✅ Never store tokens in plain AsyncStorage
✅ Handle multi-request refresh (queue system)
✅ Log auth failures (important for security)

---

# 🔥 Senior-Level Enhancements

* Biometric unlock (FaceID / Fingerprint)
* Token binding to device
* Silent background refresh
* Role-based access control (RBAC)
* Session timeout handling

---

If you want next level (true enterprise/mobile banking level), I can show you:

* 🔥 OAuth (Google / Apple login via Expo)
* 🧠 Multi-device session management
* ⚡ Web + Mobile shared auth architecture
* 🔐 End-to-end encrypted storage strategy
