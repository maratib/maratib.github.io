---
title: Component Anatomy
slug: guides/angular/component-anatomy
description: Component Anatomy
sidebar:
  order: 1
---

- Angular **components** are the **fundamental building blocks** of Angular applications.
- Component's structure provides a clean separation of concerns while keeping all component parts tightly integrated.

### Core Files Structure

```
component-name/
├── component-name.component.ts          // Logic & Class
├── component-name.component.html        // Template
├── component-name.component.css         // Styles
└── component-name.component.spec.ts     // Tests
```

### @Component Decorator Properties:

- **`selector`**: Custom HTML tag name
- **`templateUrl`**/**`template`**: HTML content
- **`styleUrls`**/**`styles`**: CSS styles
- **`standalone`**: `true` for standalone components (modern approach)
- **`imports`**: Other components/directives needed

### Modern Angular 19+ Features:

- **Standalone Components** (recommended)
- **Signals** for reactive state management
- **New Control Flow** in templates

### Standalone Component Example:

```typescript
@Component({
  selector: "app-standalone",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h1>Standalone Component</h1>
    <a routerLink="/home">Home</a>
  `,
})
export class StandaloneComponent {
  // Uses signals for state
  count = signal(0);

  increment() {
    this.count.update((v) => v + 1);
  }
}
```

## Component Lifecycle (Common Hooks)

- `ngOnInit()` - Initialization
- `ngOnDestroy()` - Cleanup
- `ngOnChanges()` - Input changes

## Best Practices

1. Use **standalone components** for new projects
2. Use **signals** (`signal()`, `computed()`, `effect()`) for state
3. Keep components focused and single-purpose
4. Use the **new control flow** (`@if`, `@for`) in templates
