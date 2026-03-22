---
title: Production-grade, scalable folder structure
description: production-grade, scalable folder structure for building apps with Expo + Bun
date: 2026-03-23
author: maratib
featured: true
sidebar:
  order: 1
---


Here’s a **production-grade, scalable folder structure** for building apps with **Expo + Bun**, designed the way senior teams structure real-world apps (clean, modular, maintainable).

---

# 🏗️ Production-Grade Expo + Bun Structure

```
myApp/
│
├── app/                      # Expo Router (recommended)
│   ├── (auth)/               # Auth group (route grouping)
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │
│   ├── (tabs)/               # Main app tabs
│   │   ├── home.tsx
│   │   ├── profile.tsx
│   │
│   ├── _layout.tsx           # Root layout
│   └── index.tsx             # Entry route
│
├── src/                      # Core app logic
│   ├── components/           # Reusable UI components
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── ScreenWrapper.tsx
│   │   │
│   │   └── index.ts
│   │
│   ├── features/             # Feature-based modules (IMPORTANT)
│   │   ├── auth/
│   │   │   ├── api.ts
│   │   │   ├── hooks.ts
│   │   │   ├── store.ts
│   │   │   ├── types.ts
│   │   │   └── components/
│   │   │
│   │   ├── user/
│   │   │   ├── api.ts
│   │   │   ├── store.ts
│   │   │   └── types.ts
│   │
│   ├── services/             # Global services
│   │   ├── api/
│   │   │   ├── client.ts     # Axios/fetch wrapper
│   │   │   ├── interceptors.ts
│   │   │
│   │   ├── storage/          # AsyncStorage / SecureStore
│   │   │   ├── storage.ts
│   │   │
│   │   ├── analytics/
│   │   └── notifications/
│   │
│   ├── store/                # Global state (Zustand/Redux)
│   │   ├── index.ts
│   │
│   ├── hooks/                # Shared hooks
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │
│   ├── utils/                # Utility functions
│   │   ├── helpers.ts
│   │   ├── validators.ts
│   │
│   ├── constants/            # App constants
│   │   ├── colors.ts
│   │   ├── config.ts
│   │
│   ├── types/                # Global TS types
│   │   ├── global.d.ts
│   │
│   └── lib/                  # Third-party configs
│       ├── react-query.ts
│       ├── i18n.ts
│
├── assets/                   # Images, fonts, icons
│   ├── images/
│   ├── fonts/
│
├── config/                   # Environment configs
│   ├── env.ts
│   ├── eas.json
│
├── scripts/                  # Automation scripts
│
├── tests/                    # Unit & integration tests
│   ├── setup.ts
│
├── .env                      # Environment variables
├── .env.production
├── app.json                  # Expo config
├── bun.lockb
├── package.json
├── tsconfig.json
└── README.md
```

---

# 🧠 Architecture Principles (Why this works)

## 1. Feature-Based Design (Scales Better)

Instead of dumping everything in `/components`, each feature owns its logic:

```
features/
  auth/
    api.ts
    store.ts
    hooks.ts
```

👉 This keeps:

* Logic isolated
* Easy team collaboration
* Easier refactoring

---

## 2. Expo Router First (Modern Standard)

Using `/app` directory:

* File-based routing (like Next.js)
* Clean navigation separation
* Supports layouts & groups

---

## 3. Service Layer Separation

```
services/api/client.ts
```

Centralized API handling:

* Token injection
* Error handling
* Retry logic

---

## 4. Global vs Feature State

| Type             | Location               |
| ---------------- | ---------------------- |
| Global state     | `/store`               |
| Feature-specific | `/features/*/store.ts` |

---

## ⚡ Recommended Stack (Production)

Pair this structure with:

* State: Zustand (lightweight)
* API: React Query (TanStack Query)
* Styling: NativeWind (Tailwind for RN)
* Forms: React Hook Form + Zod
* Navigation: Expo Router
* Storage: SecureStore + MMKV

---

## 🔥 Example Import Style (Clean Code)

Use path aliases in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

Then:

```ts
import { Button } from '@/components/common/Button';
import { useAuth } from '@/features/auth/hooks';
```

---

## 🚀 Bun-Specific Enhancements

* Fast installs: `bun install`
* Script running: `bun run dev`
* CLI usage: `bunx expo start`

---

## ⚠️ Common Mistakes to Avoid

❌ Putting everything in `/components`
❌ Mixing API logic inside UI
❌ No feature separation
❌ Hardcoding configs instead of `/config/env.ts`
❌ Not using aliases → messy imports

---

## 💡 Senior-Level Tip

As your app grows, evolve into **domain-driven structure**:

```
features/
  payments/
  chat/
  notifications/
```

Each becomes almost like a mini app.

---

If you want next level, I can give you:

* 🔥 Full **starter repo template (copy-paste ready)**
* ⚙️ Setup with **NativeWind + Zustand + React Query**
* 🧠 Enterprise patterns (offline sync, caching, error boundaries, logging)
