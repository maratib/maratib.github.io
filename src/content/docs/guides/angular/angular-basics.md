---
title: Angular Basics
slug: guides/angular/angular-basics
description: Angular Basics
sidebar:
  order: 0
---

## **1. Components (Standalone)**

Components are the fundamental UI blocks, now predominantly created as **Standalone Components** (using `standalone: true`).

- **Details:** A component is a TypeScript class paired with an HTML template and (optional) CSS. Standalone components import their dependencies (other components, directives, pipes) directly within the `@Component` decorator, eliminating the need for `NgModules`.
- **Shortest Code Example:**

<!-- end list -->

```typescript
// app.component.ts
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  standalone: true,
  template: `<h1>Hello, {{ title }}!</h1>`,
  styles: `h1 { color: steelblue; }`,
})
export class AppComponent {
  title = "Angular 18";
}
```

---

## **2. Directives & Built-in Control Flow**

Directives manipulate the structure or behavior of DOM elements. The latest version introduces a simpler, performant syntax for structural logic, known as **Built-in Control Flow**, which compiles down to efficient JavaScript.

| Concept               | Modern Angular 18+ Syntax                        | Old (NgModule) Syntax            |
| :-------------------- | :----------------------------------------------- | :------------------------------- |
| **Conditional Logic** | **`@if (condition) { ... } @else { ... }`**      | `*ngIf="condition"`              |
| **List Rendering**    | **`@for (item of list; track item.id) { ... }`** | `*ngFor="let item of list"`      |
| **Switch/Case Logic** | **`@switch (value) { @case (1) { ... } }`**      | `[ngSwitch]` and `*ngSwitchCase` |

- **Shortest Code Example (`@for` and `@if`):**

<!-- end list -->

```html
<ul>
  @for (user of users; track user.id) {
  <li>@if (user.isAdmin) { **ADMIN:** } {{ user.name }}</li>
  }
</ul>
```

---

## 3. Component Communication

The traditional `@Input()` and `@Output()` are still available, but the modern approach leverages signal-based primitives for reactive, non-mutating data flow, and the `output()` function for clearer event emitters.

| Role                         | New (Signal) Approach                      | Old (Decorator) Approach                          |
| :--------------------------- | :----------------------------------------- | :------------------------------------------------ |
| **Input (Parent to Child)**  | **`readonly name = input<string>();`**     | `@Input() name: string;`                          |
| **Output (Child to Parent)** | **`readonly changed = output<number>();`** | `@Output() changed = new EventEmitter<number>();` |

- **Shortest Code Example (New Approach):**

<!-- end list -->

```typescript
// Child Component
import { Component, input, output } from '@angular/core';

@Component({...})
export class ChildComponent {
  // Input: Get data from parent
  productName = input.required<string>();

  // Output: Emit event to parent
  quantityChange = output<number>();

  // Method to emit the output
  updateQuantity(newQuantity: number) {
    this.quantityChange.emit(newQuantity);
  }
}
```

---

## **4. Services and Dependency Injection (DI)**

Services hold business logic. DI is the mechanism to provide them. Service scope determines where a single instance of a service is shared.

### **Service Scope: Global vs. Local**

| Scope                          | Definition                                                                                 | How to Achieve                                                                           |
| :----------------------------- | :----------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------- |
| **Global (Singleton)**         | A single instance is shared across the entire application.                                 | Use **`providedIn: 'root'`** in the `@Injectable()` decorator.                           |
| **Local (Component-Specific)** | A new instance is created for every component that provides/injects it (and its children). | Use the **`providers: [ServiceClass]`** array in the component's `@Component` decorator. |

- **Shortest Code Example (Global Service):**

<!-- end list -->

```typescript
// global-user.service.ts
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root", // <-- Global scope
})
export class UserService {
  // ...
}
```

---

## **5. Signals**

Signals are the **new reactivity primitive** for state management. They offer better performance by enabling fine-grained, zone-less change detection.

- **Details:**
  - **`signal()`**: Creates a writable value.
  - **`computed()`**: Derives a read-only value from one or more other signals (and caches the result).
  - **`effect()`**: Used for side effects that need to run when a signal changes (e.g., logging, synchronization with non-Angular code).
- **Shortest Code Example:**

<!-- end list -->

```typescript
import { signal, computed } from "@angular/core";

export class DataComponent {
  count = signal(0); // Writable signal

  // Computed signal that automatically updates when count changes
  isZero = computed(() => this.count() === 0);

  increment() {
    this.count.update((value) => value + 1);
  }
}
```

---

## **6. Pipes**

Pipes are functions used within templates to **transform data for display**. They take an input value and return a new, formatted value.

- **Types of Pipes:**
  1.  **Built-in Pipes**: Angular's default, widely-used pipes.
      - **`DatePipe`**: Formats dates (`{{ today | date: 'short' }}`).
      - **`CurrencyPipe`**: Formats numbers as currency (`{{ 100 | currency: 'USD' }}`).
      - **`AsyncPipe`**: **The most important pipe.** It automatically subscribes to an `Observable` or `Promise` and returns the latest value, handling unsubscribing when the component is destroyed.
  2.  **Custom Pipes**: Created by developers using the `@Pipe` decorator. They are **Pure** by default (only re-run when the input changes), or can be set as **Impure** (re-run on every change detection cycle - use sparingly).
- **Shortest Code Example (Built-in Pipes):**

<!-- end list -->

```html
<p>Current Time: {{ currentTime$ | async | date: 'mediumTime' }}</p>
<p>Value: {{ 12345.67 | number: '1.2-2' }}</p>
```

---

## **7. Deferrable Views**

The `@defer` block simplifies and standardizes **lazy loading** of UI chunks and their dependencies.

- **Details:** It tells Angular to load the enclosed components, directives, and pipes only when a condition or trigger is met, significantly improving initial page load speed.
- **Shortest Code Example:**

<!-- end list -->

```html
<div class="map-container">
  @defer on viewport {
  <app-heavy-map />
  } @placeholder {
  <p>Loading map...</p>
  }
</div>
```

---

## **8. Routing**

The Angular Router is responsible for navigating between different views (components) in the SPA.

- **Details:** Routes map URL paths to components. With standalone components, you can define routes using **Component-First Routing**, where the component itself is specified directly in the route configuration.
- **Shortest Code Example:**

<!-- end list -->

```typescript
// app.routes.ts
import { Routes } from "@angular/router";
import { HomeComponent } from "./home.component";
import { AboutComponent } from "./about.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "about", component: AboutComponent },
  // Lazy loading a component
  {
    path: "admin",
    loadComponent: () =>
      import("./admin.component").then((c) => c.AdminComponent),
  },
];
```

---

## **9. Decorators & Metadata**

Decorators are functions that attach metadata to a class, property, or method, telling Angular how to treat that class.

- **Details:** The most common are `@Component`, `@Injectable`, `@Directive`, and `@Pipe`. The metadata within the decorator's object (e.g., `selector`, `template`, `providers`) is what defines the building block's role and configuration.
- **Shortest Code Example:**

<!-- end list -->

```typescript
// The @Component is a class decorator
@Component({
  // The object is the metadata
  selector: "my-app",
  standalone: true,
})
export class AppComponent {}
```
