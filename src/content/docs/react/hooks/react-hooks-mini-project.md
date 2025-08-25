---
title: React Hooks Mini Project
slug: react-hooks-mini-project
description: React Hooks Mini Project
date: 2024-06-02
author: maratib
featured: true
order: 4
---

## Project Overview: User Finder with Theme Toggle

### Features

- Fetch and display a list of users (API call) – `useFetch`.
- Search users with debounce – `useDebounce`.
- Remember theme (light/dark) across reloads – `useLocalStorage`.
- Show previous search term – `usePrevious`.
- All written in **React 19 + TypeScript** with **function components**.

## Folder Structure

```
src/
  hooks/
    useFetch.ts
    useDebounce.ts
    useLocalStorage.ts
    usePrevious.ts
  components/
    ThemeToggle.tsx
    SearchInput.tsx
    UserList.tsx
  App.tsx
  main.tsx
```

---

## Step 1: Hooks

### hooks/useFetch.ts

```tsx
import { useState, useEffect } from "react";

export function useFetch<T = unknown>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        if (mounted) setData(json);
      } catch (err: any) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [url]);

  return { data, loading, error };
}
```

---

### hooks/useDebounce.ts

```tsx
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```

---

### hooks/useLocalStorage.ts

```tsx
import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

---

### hooks/usePrevious.ts

```tsx
import { useEffect, useRef } from "react";

export function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
```

---

## Step 2: Components

### components/ThemeToggle.tsx

```tsx
import { useLocalStorage } from "../hooks/useLocalStorage";

export function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      style={{
        padding: "8px 12px",
        marginBottom: "1rem",
        background: theme === "light" ? "#eee" : "#333",
        color: theme === "light" ? "#000" : "#fff",
      }}
    >
      Toggle Theme (Current: {theme})
    </button>
  );
}
```

---

### components/SearchInput.tsx

```tsx
import { useState, ChangeEvent } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { usePrevious } from "../hooks/usePrevious";

interface SearchInputProps {
  onSearch: (value: string) => void;
}

export function SearchInput({ onSearch }: SearchInputProps) {
  const [input, setInput] = useState("");
  const debouncedInput = useDebounce(input, 500);
  const previousInput = usePrevious(debouncedInput);

  // Fire onSearch whenever debounced input changes
  React.useEffect(() => {
    onSearch(debouncedInput);
  }, [debouncedInput, onSearch]);

  return (
    <div style={{ marginBottom: "1rem" }}>
      <input
        value={input}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setInput(e.target.value)
        }
        placeholder="Search users..."
      />
      {previousInput && previousInput !== debouncedInput && (
        <p style={{ fontSize: "0.8rem" }}>Previous search: {previousInput}</p>
      )}
    </div>
  );
}
```

---

### components/UserList.tsx

```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

interface UserListProps {
  users: User[];
}

export function UserList({ users }: UserListProps) {
  if (!users.length) return <p>No users found.</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} – {user.email}
        </li>
      ))}
    </ul>
  );
}
```

---

## Step 3: App.tsx

```tsx
import React from "react";
import { ThemeToggle } from "./components/ThemeToggle";
import { SearchInput } from "./components/SearchInput";
import { UserList } from "./components/UserList";
import { useFetch } from "./hooks/useFetch";

export default function App() {
  const { data, loading, error } = useFetch<
    { id: number; name: string; email: string }[]
  >("https://jsonplaceholder.typicode.com/users");

  const [filteredUsers, setFilteredUsers] = React.useState<typeof data>(data);

  React.useEffect(() => {
    setFilteredUsers(data);
  }, [data]);

  const handleSearch = (query: string) => {
    if (!data) return;
    const filtered = data.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <ThemeToggle />
      <SearchInput onSearch={handleSearch} />
      {loading && <p>Loading users...</p>}
      {error && <p>Error: {error}</p>}
      {filteredUsers && <UserList users={filteredUsers} />}
    </div>
  );
}
```

---

## Step 4: Run It

1. **Create project**:

   ```bash
   npx create-react-app user-finder --template typescript
   cd user-finder
   ```

2. **Replace** `src` with the structure above.
3. **Start app**:

   ```bash
   npm start
   ```

4. Open `http://localhost:3000` to see:

   - Theme toggle button.
   - Search bar with debounce and previous search display.
   - Filtered user list fetched from API.

---

## What You Learned

- Combining multiple hooks in a real scenario.
- Type safety with TypeScript.
- Logic separation using custom hooks.
- Clean component structure.
