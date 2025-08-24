---
title: All about React hooks
description: All about React hooks.
date: 2024-08-02
author: maratib
featured: true
order: 1
---

## 1. What Are Hooks?

- Hooks are **special functions in React** that let you use features like **state**, **side effects**, and **context** inside **function components**.
- Before hooks (pre-React 16.8), we had to use **class components** to manage state and lifecycle methods. Hooks removed that need.
- React 19 still uses the same hook concept, but it’s more **mature and optimized**.

Think of hooks as **tools** to "hook into" React's internal features.

---

## 2. Why Do We Need Hooks?

- **Simpler code**: No classes, less boilerplate.
- **Reusability**: Create your own hooks to share logic between components.
- **Better separation of concerns**: Keep stateful logic separate from UI.
- **Easier testing**: Functions are simpler to test than classes.
- **React 19 benefit**: Works seamlessly with React’s **server components** and **concurrent features**.

---

## 3. Types of Hooks

### Built-in Hooks (most common):

1. `useState` – Manage local state.
2. `useEffect` – Handle side effects (fetching data, subscriptions).
3. `useRef` – Access DOM elements or store mutable values.
4. `useContext` – Access global context values.
5. `useReducer` – More advanced state management.
6. `useCallback` & `useMemo` – Performance optimizations.
7. `useTransition`, `useDeferredValue` – Concurrent UI rendering (React 18+).

---

## 4. Real World Use Cases

### a) useState – Local State

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
    </div>
  );
}

export default Counter;
```

**Use case:** Track button clicks, form values, toggles, etc.

---

### b) useEffect – Side Effects

```tsx
import { useState, useEffect } from "react";

function UserData() {
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const data = await res.json();
      setUsers(data.map((user: any) => user.name));
    }
    fetchUsers();
  }, []); // Empty dependency → run once

  return (
    <ul>
      {users.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
}

export default UserData;
```

**Use case:** Fetch API data, subscribe to WebSockets, update document title, cleanup.

---

### c) useRef – Access DOM or Store Mutable Value

```tsx
import { useRef } from "react";

function InputFocus() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Click the button" />
      <button onClick={handleFocus}>Focus Input</button>
    </div>
  );
}

export default InputFocus;
```

**Use case:** Direct DOM access, keeping previous values, timers.

---

### d) useContext – Share Data Globally

```tsx
import { createContext, useContext } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<Theme>("light");

function Child() {
  const theme = useContext(ThemeContext);
  return <p>Current theme: {theme}</p>;
}

export default function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Child />
    </ThemeContext.Provider>
  );
}
```

**Use case:** Theme, user authentication, language settings.

---

### e) Custom Hook – Reusable Logic

```tsx
import { useState, useEffect } from "react";

function useWindowWidth(): number {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

function WidthDisplay() {
  const width = useWindowWidth();
  return <p>Window width: {width}</p>;
}

export default WidthDisplay;
```

**Use case:** Extract reusable logic like API calls, form validation, media queries.

---

## 5. Key Notes for Beginners

- Hooks **must start with `use`** (e.g., `useState`).
- Hooks **must be used inside function components or other hooks**, not in regular functions or conditionally.
- TypeScript makes hooks safer by adding type definitions.

---
