---
title: Enterprise grade patterns
description: Enterprise grade patterns for building apps with Expo + Bun
date: 2026-03-23
author: maratib
featured: true
sidebar:
  order: 3
---

Here’s how to implement **enterprise-grade patterns** in an **Expo + Bun** app using **TanStack Query + Zustand + NativeWind**.

This is the stuff that separates **mid-level apps from production SaaS/mobile systems**.

---

# 🧠 1. Offline-First Architecture (Sync Engine)

## 🎯 Goal

App works even:

* No internet
* Flaky network
* Background sync

---

## 📦 Core Idea

* Cache server data (React Query)
* Store pending mutations locally
* Sync when online

---

## 📁 `src/services/offline/queue.ts`

```ts
type QueueItem = {
  id: string;
  url: string;
  method: 'POST' | 'PUT' | 'DELETE';
  body: any;
};

let queue: QueueItem[] = [];

export const addToQueue = (item: QueueItem) => {
  queue.push(item);
};

export const processQueue = async (apiClient: any) => {
  for (const item of queue) {
    try {
      await apiClient({
        url: item.url,
        method: item.method,
        data: item.body,
      });
    } catch (e) {
      return; // stop if still offline
    }
  }
  queue = [];
};
```

---

## 📁 `src/hooks/useOnlineSync.ts`

```ts
import NetInfo from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { processQueue } from '@/services/offline/queue';
import { apiClient } from '@/services/api/client';

export const useOnlineSync = () => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        processQueue(apiClient);
      }
    });

    return unsubscribe;
  }, []);
};
```

👉 Call this once in root layout.

---

## 💡 Mutation Strategy (CRITICAL)

```ts
import { addToQueue } from '@/services/offline/queue';

const mutation = useMutation({
  mutationFn: async (data) => {
    try {
      return await apiClient.post('/todos', data);
    } catch {
      addToQueue({
        id: Date.now().toString(),
        url: '/todos',
        method: 'POST',
        body: data,
      });
    }
  },
});
```

---

# ⚡ 2. Advanced Caching Strategy

## 📁 `src/lib/react-query.ts`

```ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 60,
      retry: 2,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
  },
});
```

---

## 🔥 Persist Cache (Offline Cache)

Use storage (MMKV recommended):

```ts
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

persistQueryClient({
  queryClient,
  persister: createAsyncStoragePersister({
    storage: AsyncStorage,
  }),
});
```

---

## 💡 Cache Invalidation Pattern

```ts
queryClient.invalidateQueries({ queryKey: ['user'] });
```

👉 Always invalidate after mutations.

---

# 🛡️ 3. Error Boundaries (Crash Safety)

## 📦 Install

```bash
bun add react-error-boundary
```

---

## 📁 `src/components/ErrorBoundary.tsx`

```tsx
import { ErrorBoundary } from 'react-error-boundary';
import { View, Text, Button } from 'react-native';

function Fallback({ error, resetErrorBoundary }: any) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Something went wrong</Text>
      <Button title="Retry" onPress={resetErrorBoundary} />
    </View>
  );
}

export const AppErrorBoundary = ({ children }: any) => (
  <ErrorBoundary FallbackComponent={Fallback}>
    {children}
  </ErrorBoundary>
);
```

---

## ✅ Wrap Root

```tsx
<AppErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <Stack />
  </QueryClientProvider>
</AppErrorBoundary>
```

---

# 📊 4. Logging & Monitoring (Enterprise MUST)

## 🎯 What to log

* API failures
* App crashes
* User actions (important flows)
* Performance

---

## 📁 `src/services/logger.ts`

```ts
export const logger = {
  log: (...args: any[]) => {
    console.log('[LOG]', ...args);
  },
  error: (error: any) => {
    console.error('[ERROR]', error);
    // send to Sentry/Datadog later
  },
};
```

---

## 🔌 Axios Interceptor Logging

```ts
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    logger.error({
      url: error.config?.url,
      message: error.message,
    });
    return Promise.reject(error);
  }
);
```

---

## 🔥 Production Tools (Recommended)

| Tool               | Purpose         |
| ------------------ | --------------- |
| Sentry             | Crash reporting |
| Datadog            | Logs + APM      |
| Firebase Analytics | User behavior   |

---

# 🔄 5. Retry + Resilience Pattern

React Query already supports retry:

```ts
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  retry: 3,
  retryDelay: (attempt) => attempt * 1000,
});
```

---

# 🧱 6. Clean Architecture Layers

```
UI (app/)
↓
Hooks (features/*/hooks.ts)
↓
API (features/*/api.ts)
↓
Service (api client)
```

---

# 🔐 7. Bonus: Secure Storage Pattern

```ts
import * as SecureStore from 'expo-secure-store';

export const storage = {
  set: (key: string, value: string) =>
    SecureStore.setItemAsync(key, value),

  get: (key: string) =>
    SecureStore.getItemAsync(key),
};
```

---

# 🚀 Real Production Flow

1. User opens app → cached data loads instantly
2. API refetch runs in background
3. Offline → mutations queued
4. Online → auto sync
5. Errors → caught by boundary + logged
6. Logs → sent to monitoring

---

# ⚠️ Common Mistakes (Avoid These)

❌ Not persisting cache → bad UX offline
❌ No retry logic → fragile app
❌ Logging only console → useless in prod
❌ No queue → data loss offline
❌ Overusing Zustand for server data

---

# 💡 Senior Insight

* **React Query = server state**
* **Zustand = client/UI state**
* **Offline queue = reliability layer**
* **Error boundary = safety net**
* **Logging = visibility**

---

If you want next level (real enterprise stuff), I can show you:

* 🔥 Conflict resolution (offline edits vs server truth)
* ⚡ Background sync with Expo Task Manager
* 🧠 Event-driven architecture inside React Native
* 🚀 Full CI/CD + monitoring pipeline (Sentry + EAS + GitHub Actions)

Just tell me 👍
