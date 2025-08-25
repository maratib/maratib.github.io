---
title: Custom React hooks
description: Custom React hooks
date: 2025-08-02
author: maratib
featured: true
sidebar:
  order: 2
---

## 1. What Are Hooks in React 19?

- Hooks are **functions** provided by React that let you “hook into” React’s features (like **state**, **effects**, **context**) **inside function components**.
- Before hooks, you needed **class components** to manage state and lifecycle methods. Hooks removed that limitation.
- React 19 continues using hooks, but now they integrate better with **Server Components**, **Concurrent Rendering**, and **modern TypeScript features**.

---

## 2. Why Are Hooks Needed?

- **Cleaner code**: Less boilerplate compared to classes.
- **Reusability**: You can write **custom hooks** to reuse logic across components.
- **Separation of concerns**: Keep logic independent of UI.
- **Testability**: Logic is easier to isolate and test.
- **React 19**: Hooks work with both **client and server components** and support **suspense and streaming**.

---

## 3. Built-in Hooks Recap (Quick Overview)

- `useState` – Local component state.
- `useEffect` – Side effects like fetching data.
- `useRef` – Direct DOM access or mutable values.
- `useContext` – Share data across components.
- `useReducer` – Complex state management.
- `useCallback` / `useMemo` – Performance optimization.
- `useTransition` / `useDeferredValue` – Concurrent rendering.

---

## 4. What Are Custom Hooks? (Main Focus)

**Definition:**
A **custom hook** is just a **JavaScript/TypeScript function that starts with `use`** and internally uses one or more React hooks.

**Why Custom Hooks?**

- **Reuse logic**: For example, fetch users from an API in multiple places.
- **Abstract complexity**: Hide implementation details inside a simple function.
- **Consistency**: Make your codebase easier to maintain.

**Rules:**

- Must **start with `use`** (e.g., `useAuth`, `useFetch`).
- Must **only call hooks** at the top level (not inside loops or conditions).
- Must **follow React’s Rules of Hooks**.

---

## 5. Custom Hooks Examples (React 19 + TypeScript)

### `useFetch` – Reusable API Fetching

```tsx
import { useState, useEffect } from "react";

interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T = unknown>(url: string): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // avoid state updates if unmounted
    setLoading(true);

    async function fetchData() {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        const result: T = await response.json();
        if (isMounted) setData(result);
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
}

// Usage
function UsersList() {
  const { data, loading, error } = useFetch<{ name: string }[]>(
    "https://jsonplaceholder.typicode.com/users"
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {data?.map((user) => (
        <li key={user.name}>{user.name}</li>
      ))}
    </ul>
  );
}

export default UsersList;
```

**Use case:** Any component can fetch data without repeating `useEffect` logic.

---

### `useLocalStorage` – Persistent State

```tsx
import { useState, useEffect } from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

// Usage
function ThemeSwitcher() {
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Toggle Theme (Current: {theme})
    </button>
  );
}

export default ThemeSwitcher;
```

**Use case:** Store data (theme, tokens) across page reloads.

---

### `usePrevious` – Track Previous Value

```tsx
import { useEffect, useRef } from "react";

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// Usage
function Counter() {
  const [count, setCount] = React.useState<number>(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>
        Current: {count}, Previous: {prevCount}
      </p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}

export default Counter;
```

**Use case:** Compare old and new values (useful for animations, analytics).

---

### `useDebounce` – Control Frequent Updates

```tsx
import { useState, useEffect } from "react";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function SearchInput() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      console.log("Searching for:", debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}

export default SearchInput;
```

**Use case:** Search inputs, auto-save, API throttling.

---

## 6. Best Practices for Custom Hooks in TypeScript

- **Always prefix with `use`** (for React’s lint rules).
- **Add generic types** for flexibility.
- **Return immutable values** or `[value, setter]` pattern.
- **Keep hooks small and focused** (one job per hook).
- **Document the hook’s behavior** for your team.

---

## Summary

- Hooks simplify React development by replacing classes with functions.
- Custom hooks are where the **real power lies**: they let you create reusable, self-contained logic.
- With **React 19 and TypeScript**, you get **type safety**, **better DX**, and **optimized performance**.
- Start with small hooks (e.g., `usePrevious`, `useLocalStorage`) and gradually build complex ones (`useAuth`, `useInfiniteScroll`, etc.).

---
