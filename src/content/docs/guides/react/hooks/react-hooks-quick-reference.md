---
title: React Hooks Quick Reference
description: React Hooks Quick Reference
date: 2025-08-02
author: maratib
featured: true
sidebar:
  order: 4
---

---

## Core Hooks

---

### **useState** – Manage local state

```tsx
const [state, setState] = useState<number>(0);
setState((prev) => prev + 1);
```

- **Tip:** Always provide an explicit type for non-primitive or empty initial states.
- **Use cases:** Counters, toggles, form inputs.

---

### **useEffect** – Side effects

```tsx
useEffect(() => {
  console.log("Effect runs");
  return () => console.log("Cleanup");
}, [dependencies]);
```

- **Tip:** Use `[]` for one-time effects; always clean up subscriptions or timers.
- **Use cases:** Fetching data, event listeners, animations.

---

### **useRef** – Store mutable values or access DOM

```tsx
const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();
```

- **Tip:** Great for keeping previous values or referencing DOM nodes without re-renders.
- **Use cases:** Focus input, timers, previous state tracking.

---

### **useContext** – Access context

```tsx
const ThemeContext = createContext<"light" | "dark">("light");
const theme = useContext(ThemeContext);
```

- **Tip:** Context is best for **read-heavy global state** (e.g., theme, auth).
- **Use cases:** Theme switchers, language selection.

---

### **useReducer** – Complex state logic

```tsx
type State = { count: number };
type Action = { type: "inc" | "dec" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "inc":
      return { count: state.count + 1 };
    case "dec":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: "inc" });
```

- **Tip:** Good for **multiple state transitions**.
- **Use cases:** Forms, wizards, complex UI interactions.

---

### **useCallback / useMemo** – Performance

```tsx
const memoizedCallback = useCallback(() => doSomething(id), [id]);
const memoizedValue = useMemo(() => computeExpensiveValue(data), [data]);
```

- **Tip:** Use only when performance is an issue; not for every function.
- **Use cases:** Prevent re-renders, optimize heavy calculations.

---

### **useTransition / useDeferredValue** – Concurrent UI (React 18+)

```tsx
const [isPending, startTransition] = useTransition();
startTransition(() => setFilter(value));

const deferredValue = useDeferredValue(inputValue);
```

- **Tip:** Improve UI responsiveness when dealing with large data updates.
- **Use cases:** Search, filtering, large lists.

---

## React 19 Enhancements

- React 19 refines **async rendering and server components**, but hooks usage remains consistent.
- Hooks work **client-side**; server components avoid hooks for rendering logic.

---

### Pattern

```tsx
function useCustom<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  // custom logic
  return [value, setValue] as const;
}
```

- **Tip:** Always prefix with `use` and keep logic focused.
- **Use cases:** Data fetching, local storage, debounce, auth.

---

#### Examples

**1. useFetch**

```tsx
function useFetch<T = unknown>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(url);
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

**2. useLocalStorage**

```tsx
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
```

**3. usePrevious**

```tsx
function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
```

---

## Best Practices

- **Naming:** Always start with `use`.
- **Typing:** Add generics for flexibility.
- **Cleanup:** Use `return` in effects to avoid memory leaks.
- **Atomic:** One responsibility per hook.
- **Document:** Write clear comments or JSDoc for your hooks.
- **Lint:** Enable ESLint’s “Rules of Hooks” to prevent misuse.

---
