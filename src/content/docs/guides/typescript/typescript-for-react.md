---
title: Typescript for react developers
description: Typescript for react developers
---

As a React developer, you already understand component-based architecture, state management, and JSX. TypeScript enhances your React development by adding static type checking, better tooling, and improved code quality. Let's focus on the TypeScript concepts most relevant to React.

## Basic TypeScript Types for React

### Primitive Types

```typescript
const name: string = "John";
const age: number = 30;
const isActive: boolean = true;
const items: string[] = ["item1", "item2"];
```

### Union Types

```typescript
type Status = "loading" | "success" | "error";
const status: Status = "loading";
```

## Typing React Components

### Functional Components

```typescript
// Basic component with props
type Props = {
  name: string;
  age?: number; // Optional prop
};

//If no age param setting default to 18
const Greeting = ({ name, age = 18 }: Prop) => {
  return (
    <div>
      Hello {name}
      {age && <span>, you are {age} years old</span>}
    </div>
  );
};
```

### Alternative: Using React.FC vs Direct Function

```typescript
// With React.FC (includes children by default)
const Component: React.FC<Props> = ({ children }) => <div>{children}</div>;

// Without React.FC (more explicit)
const Component = ({ children }: Props & { children?: React.ReactNode }) => (
  <div>{children}</div>
);
```

## Common React Patterns with TypeScript

### useState Hook

```typescript
import { useState } from "react";

const UserProfile = () => {
  // Type inferred: string
  const [name, setName] = useState("John");

  // Explicit type for complex state
  const [user, setUser] = useState<{ name: string; age: number } | null>(null);

  // Array state with type
  const [todos, setTodos] = useState<string[]>([]);
};
```

### useEffect and useCallback

```typescript
import { useEffect, useCallback } from "react";

interface User {
  id: number;
  name: string;
}

const UserComponent = ({ userId }: { userId: number }) => {
  const [user, setUser] = useState<User | null>(null);

  // Typed callback
  const fetchUser = useCallback(async (id: number): Promise<User> => {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  }, []);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId, fetchUser]);
};
```

### useReducer Hook

```typescript
type State = {
  count: number;
};

type Action =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset"; payload: number };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return { count: action.payload };
    default:
      return state;
  }
};

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
    </div>
  );
};
```

## Event Handling

### Form Events

```typescript
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={handleEmailChange} />
      <input
        type="password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
      />
      <button type="submit">Login</button>
    </form>
  );
};
```

### Click Events

```typescript
const Button = ({ onClick }: { onClick: (e: React.MouseEvent) => void }) => {
  return <button onClick={onClick}>Click me</button>;
};
```

## Advanced Component Patterns

### Generic Components

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage
<List<{ id: number; name: string }>
  items={users}
  renderItem={(user) => <span>{user.name}</span>}
/>;
```

### Higher-Order Components

```typescript
interface WithLoadingProps {
  loading: boolean;
}

const withLoading = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & WithLoadingProps> => {
  return ({ loading, ...props }: WithLoadingProps & P) => {
    if (loading) return <div>Loading...</div>;
    return <Component {...(props as P)} />;
  };
};

// Usage
const UserProfile = ({ user }: { user: User }) => <div>{user.name}</div>;
const UserProfileWithLoading = withLoading(UserProfile);
```

## Context API with TypeScript

```typescript
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for context
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
```

## Custom Hooks with TypeScript

```typescript
interface UseLocalStorageResult<T> {
  value: T;
  setValue: (value: T) => void;
}

function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageResult<T> {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return { value, setValue };
}

// Usage
const { value: user, setValue: setUser } = useLocalStorage<User>(
  "user",
  initialUser
);
```

## Common Utility Types

```typescript
// Partial for optional props in forms
interface UserForm {
  name: string;
  email: string;
  age: number;
}

const updateUser = (updates: Partial<UserForm>) => {
  // Only some fields required
};

// Pick and Omit for specific props
type UserName = Pick<User, "name">;
type UserWithoutId = Omit<User, "id">;

// Record for object maps
const userRoles: Record<number, string> = {
  1: "admin",
  2: "user",
};
```

## Best Practices

1. **Start with interfaces for props and state**
2. **Use type aliases for union types and complex types**
3. **Leverage type inference when possible**
4. **Create custom hooks with proper return types**
5. **Use generic components for reusable logic**
6. **Always type event handlers**
7. **Use optional chaining and nullish coalescing with TypeScript**

## Common Errors and Solutions

```typescript
// Error: Object is possibly 'null'
const user = userMaybeNull?.name; // ✅ Use optional chaining

// Error: Type is not assignable
const safeUser = user as User; // ✅ Use type assertion sparingly

// Better: Type guards
function isUser(obj: any): obj is User {
  return obj && typeof obj.name === "string";
}

if (isUser(someObject)) {
  // someObject is now typed as User
}
```
