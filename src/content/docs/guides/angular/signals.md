---
title: Angular Signals
slug: guides/angular/signals
description: Angular Signals
sidebar:
  order: 5
---

- **Signals** are reactive primitives introduced in Angular 16+ that contain values and notify consumers when those values change.

- They form the foundation of Angular's new reactive system, providing granular change detection and better performance.

- **Signals are the building blocks of Angular's reactivity system**. Think of them as **"reactive variables"** that automatically notify anything depending on them when their value changes.

- Unlike traditional variables, signals maintain a list of dependencies and proactively update them, making state management more predictable and efficient.

### Key Characteristics for Interview:

- **Reactive Values:** Signals hold values and automatically notify dependents when values change
- **Granular Updates:** Track dependencies at the finest level, unlike Zone.js which triggers full change detection
- **Glitch-free Execution:** Ensure consistent state without intermediate inconsistencies
- **Lazy Evaluation:** Computed signals only recalculate when their dependencies change
- **Simple Mental Model:** Easy to understand and debug compared to Observable chains

### Why Signals were introduced?

```typescript
// Traditional Angular (Zone.js based)
export class TraditionalComponent {
  count = 0; // No automatic reactivity
  items: any[] = [];

  increment() {
    this.count++; // Requires change detection run
  }
}

// Modern Angular (Signals based)
export class ModernComponent {
  count = signal(0); // Reactive by default
  items = signal<any[]>([]);

  increment() {
    this.count.update((c) => c + 1); // Automatic reactivity
  }
}
```

## 2. Core Signal APIs - Deep Dive

### Creating Signals

```typescript
import { signal, computed, effect, Signal } from "@angular/core";

// 1. WRITABLE SIGNALS - Mutable state
const count = signal(0); // Inference: Signal<number>
const title = signal<string>("Hello"); // Explicit type: Signal<string>
const user = signal({ name: "John", age: 30 }); // Signal<{name: string, age: number}>
const items = signal<string[]>([]); // Signal<string[]>
```

**Detailed Description - Writable Signals:**
Writable signals are the most basic type of signal that allow both reading and writing values. They act as the source of truth in your reactive state. When you create a writable signal, you're essentially creating a reactive container that holds a value and automatically notifies all dependents (computed signals, effects, or templates) whenever that value changes.

**Key Interview Points:**

- Created using the `signal()` function with an initial value
- Provide both read (`signal()`) and write (`set()`, `update()`, `mutate()`) operations
- Serve as the "source" signals in your reactivity graph
- Automatically track who depends on them for change notifications

### Computed Signals (Derived State)

```typescript
// 2. COMPUTED SIGNALS - Readonly derived values
const count = signal(5);
const discount = signal(0.1);

// Derived computations
const doubleCount = computed(() => count() * 2);
const finalPrice = computed(() => {
  const base = count() * 10; // $10 per item
  return base * (1 - discount());
});
const isEven = computed(() => count() % 2 === 0);

// Complex computed example
const user = signal({ firstName: "John", lastName: "Doe" });
const fullName = computed(() => `${user().firstName} ${user().lastName}`);
```

**Detailed Description - Computed Signals:**
Computed signals are **readonly derived values** that automatically update when their dependencies change. They represent pure functions of other signals - when source signals change, computed signals automatically recalculate. Computed signals are lazy and only recalculate when their value is actually read, and only if their dependencies have changed since the last calculation.

**Key Interview Points:**

- Created using `computed()` with a derivation function
- Automatically track which signals they depend on
- Only recalculate when dependencies change AND someone reads the value
- Are readonly - cannot be directly modified
- Optimize performance by avoiding unnecessary recalculations
- Perfect for derived state, transformations, and business logic

### Effects (Side Effects)

```typescript
// 3. EFFECTS - For side effects
const count = signal(0);
const user = signal({ name: "John" });

// Basic effect
effect(() => {
  console.log(`Count changed to: ${count()}`);
  // This runs whenever count changes
});

// Effect with multiple dependencies
effect(() => {
  const currentUser = user();
  const currentCount = count();
  console.log(`User: ${currentUser.name}, Count: ${currentCount}`);
  // Runs when either user or count changes
});
```

**Detailed Description - Effects:**
Effects are the mechanism for **performing side effects** in response to signal changes. They automatically track which signals are read within them and re-execute whenever any of those signals change. Effects are Angular's way of bridging reactive state with imperative code like DOM manipulation, API calls, or logging.

**Key Interview Points:**

- Created using `effect()` with a side-effect function
- Automatically track all signals read during execution
- Re-run when any tracked signal changes
- Should be used for side effects only, not for deriving values
- Automatically clean up when the surrounding context is destroyed
- Can be manually destroyed by returning a cleanup function

## 3. Signal Operations - Complete Guide

### Writable Signal Methods

```typescript
// SET - Replace the entire value
const count = signal(0);
count.set(5); // count is now 5
count.set(10); // count is now 10

// UPDATE - Transform based on current value
count.update((current) => current + 1); // Increment: 10 → 11
count.update((current) => current * 2); // Double: 11 → 22

// MUTATE - Modify object/array in place (Use cautiously!)
const user = signal({ name: "John", age: 30 });
user.mutate((current) => {
  current.age = 31; // Direct mutation
});

const items = signal([1, 2, 3]);
items.mutate((current) => {
  current.push(4); // Direct array modification
});
```

**Detailed Description - Signal Operations:**

**set()**: Completely replaces the signal's value. Use this when you have a new value that doesn't depend on the current state. It's the simplest operation and works well for primitives or complete object replacements.

**update()**: Transforms the current value using a function. This is the functional programming approach - you provide a pure function that takes the current value and returns the new value. Use this for state transitions that depend on previous state.

**mutate()**: Modifies the current value in-place. This is useful for performance with large objects or arrays where creating new copies would be expensive. However, use this cautiously as it breaks immutability principles and can lead to hard-to-debug issues if not used carefully.

### Advanced Signal Patterns

```typescript
// SIGNAL WITH EQUALITY FUNCTION
const user = signal(
  { name: "John", id: 1 },
  { equal: (a, b) => a.id === b.id } // Only notify if id changes
);

// COMPUTED WITH ERROR HANDLING
const riskyComputation = computed(() => {
  try {
    return someRiskyOperation();
  } catch (error) {
    console.error("Computation failed:", error);
    return fallbackValue;
  }
});

// EFFECT WITH CLEANUP
effect((onCleanup) => {
  const timer = setTimeout(() => {
    console.log("Delayed effect");
  }, 1000);

  onCleanup(() => {
    clearTimeout(timer); // Cleanup when effect re-runs or destroys
  });
});
```

## 4. Signals in Components - Practical Usage

### Component with Signals

```typescript
import { Component, signal, computed, effect } from "@angular/core";

@Component({
  selector: "app-user-profile",
  template: `
    <h2>{{ fullName() }}</h2>
    <p>Age: {{ age() }} | {{ ageStatus() }}</p>
    <p>Email: {{ email() }}</p>

    @if (isLoading()) {
    <p>Loading...</p>
    }

    <button (click)="incrementAge()">Happy Birthday!</button>
    <button (click)="updateEmail()">Update Email</button>
  `,
})
export class UserProfileComponent {
  // State signals
  user = signal({
    firstName: "John",
    lastName: "Doe",
    age: 25,
  });
  email = signal("john.doe@example.com");
  isLoading = signal(false);

  // Computed signals
  fullName = computed(() => `${this.user().firstName} ${this.user().lastName}`);

  age = computed(() => this.user().age);

  ageStatus = computed(() => (this.age() >= 18 ? "Adult" : "Minor"));

  // Methods
  incrementAge() {
    this.user.update((user) => ({
      ...user,
      age: user.age + 1,
    }));
  }

  updateEmail() {
    this.email.set("new.email@example.com");
  }

  // Effects for side effects
  private loggingEffect = effect(() => {
    console.log("User updated:", {
      name: this.fullName(),
      age: this.age(),
    });
  });
}
```

**Detailed Description - Component Integration:**
In Angular components, signals replace traditional class properties for reactive state. When you use signals in templates with `{{ signal() }}` syntax, Angular automatically creates a dependency and updates the view when the signal changes. This creates a direct, efficient connection between your state and UI without needing Zone.js to trigger change detection across the entire component tree.

## 5. Signals vs Traditional Approaches

### Comparison Table

| Aspect               | Traditional (RxJS)                | Signals                       |
| -------------------- | --------------------------------- | ----------------------------- |
| **Reactivity**       | Manual subscription management    | Automatic dependency tracking |
| **Change Detection** | Zone.js (full tree)               | Granular (value-level)        |
| **Mental Model**     | Streams, operators, subscriptions | Values with reactivity        |
| **Performance**      | Good, but can over-trigger        | Excellent, precise updates    |
| **Learning Curve**   | Steeper                           | Gentle                        |
| **Bundle Size**      | Larger (RxJS operators)           | Smaller                       |

### Migration Example

```typescript
// TRADITIONAL - RxJS based
export class TraditionalComponent {
  private destroy$ = new Subject<void>();

  items$ = this.dataService.getItems();
  filteredItems: any[] = [];
  searchTerm = "";

  ngOnInit() {
    this.items$
      .pipe(
        takeUntil(this.destroy$),
        map((items) => this.filterItems(items))
      )
      .subscribe((items) => (this.filteredItems = items));
  }

  onSearch(term: string) {
    this.searchTerm = term;
    // Need to trigger filtering manually
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// MODERN - Signals based
export class ModernComponent {
  items = signal<any[]>([]);
  searchTerm = signal("");

  // Automatic reactivity
  filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.items().filter((item) =>
      item.name.toLowerCase().includes(term)
    );
  });

  // No manual subscription management
  // No cleanup required
}
```

**Detailed Description - Signals vs RxJS:**
While both Signals and RxJS handle reactivity, they solve different problems. RxJS is excellent for handling **event streams and asynchronous operations** - things that happen over time like HTTP requests, user events, or WebSocket messages. Signals are perfect for **synchronous state management** - the current value of something right now.

The key difference is in the mental model: RxJS thinks in streams and time, while Signals think in values and reactivity. In modern Angular, you'll often use both together - Signals for component state and RxJS for async operations.

## 6. Advanced Signal Patterns

### Signal Composition

```typescript
// STORE-LIKE PATTERN WITH SIGNALS
export class UserStore {
  private users = signal<User[]>([]);
  private selectedUserId = signal<string | null>(null);

  // Public readonly signals
  readonly userList = this.users.asReadonly();
  readonly selectedUser = computed(() => {
    const userId = this.selectedUserId();
    return this.users().find((user) => user.id === userId) || null;
  });

  // Actions
  setUsers(users: User[]) {
    this.users.set(users);
  }

  selectUser(userId: string) {
    this.selectedUserId.set(userId);
  }

  updateUser(userId: string, updates: Partial<User>) {
    this.users.update((users) =>
      users.map((user) => (user.id === userId ? { ...user, ...updates } : user))
    );
  }
}
```

**Detailed Description - Advanced Patterns:**
As applications grow, you can build sophisticated state management patterns using signals. The store pattern shown above demonstrates how to encapsulate state and provide controlled access through methods. The `asReadonly()` method is particularly important for exposing signals without allowing external modification, maintaining encapsulation.

## 7. Interview Questions & Answers

### Q1: What problem do Signals solve in Angular?

**A:** Signals solve several problems:

- **Granular change detection** - Unlike Zone.js which triggers change detection for the entire component tree, signals only update what actually changed
- **Simplified reactive state management** - Much easier mental model than complex RxJS chains with subscriptions
- **Better performance** - Precise updates mean less work for Angular's change detection
- **Reduced boilerplate** - No more manual subscription management and cleanup

### Q2: When should you use computed() vs effect()?

**A:**

- Use `computed()` for **derived values** that need to be reactive - when you're calculating a value based on other signals
- Use `effect()` for **side effects** like logging, DOM updates, or API calls - when you need to perform an action in response to signal changes
- **Golden Rule:** If you're computing a value → `computed()`, if you're performing an action → `effect()`

### Q3: How do Signals compare to RxJS Observables?

**A:**

- **Signals:** Synchronous values with reactivity, simpler mental model, perfect for component state
- **Observables:** Asynchronous streams of values, powerful operators, ideal for events and HTTP
- **They complement each other:** Use Signals for synchronous state, Observables for asynchronous operations

### Q4: What's the difference between set(), update(), and mutate()?

**A:**

- `set()`: Replace the entire value - use for primitives or complete replacements
- `update()`: Transform based on current value - use for functional, immutable updates
- `mutate()`: Modify in-place - use carefully for performance with large objects/arrays

### Q5: How do Signals integrate with Angular's change detection?

**A:** Signals automatically mark components as dirty when they change. When a signal used in a template changes, Angular knows exactly which components need updating, making change detection much more efficient than Zone.js which would check the entire application.

## 8. Best Practices & Pitfalls

### Do's and Don'ts

```typescript
// ✅ GOOD PRACTICES
const user = signal({ name: "John", age: 30 });

// Use computed for derived state
const canDrink = computed(() => user().age >= 21);

// Use update for functional updates
user.update((u) => ({ ...u, age: u.age + 1 }));

// Use effects sparingly for side effects
effect(() => {
  document.title = `Hello ${user().name}`;
});

// ❌ BAD PRACTICES
const count = signal(0);

// Don't use mutate with primitives
count.mutate((c) => c++); // ❌ Wrong!

// Don't create effects for derived state
effect(() => {
  const double = count() * 2; // ❌ Should be computed!
});

// Don't forget to use .asReadonly() for public API
```

**Detailed Description - Best Practices:**

- **Use computed for derivations:** This is the most important rule. Computed signals are optimized and only recalculate when needed.
- **Minimize effects:** Effects should be your last resort. Ask yourself: "Can this be a computed signal instead?"
- **Prefer update over mutate:** Functional updates are easier to reason about and debug.
- **Use asReadonly for public API:** When exposing signals from services, use `asReadonly()` to prevent external modification.
- **Avoid signal calls in loops:** Reading signals in loops can cause performance issues.
