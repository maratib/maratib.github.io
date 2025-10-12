---
title: Component Binding
slug: guides/angular/component-binding
description: Component Binding
sidebar:
  order: 4
---

- **Binding in Angular** is the automatic **`synchronization of data`** between the component class and the **`template`**,
- It keeps your **UI in sync** with your **application state**.

- It connects your **TypeScript logic** with your **HTML view** through various syntaxes

  - like `{{ }}`, `[ ]`, and `( )`.

| Biding    | Name.         | Example                            |
| --------- | ------------- | ---------------------------------- |
| `{{ }}`   | Interpolation | `{{ title }}`                      |
| `[ ]`     | Property      | `[disabled]="isLoading"`           |
| `( )`     | Event         | `(click)="onSave()"`               |
| `ngModel` | Two way       | `<input [(ngModel)]="username" />` |

### 1. Interpolation Binding

**Syntax:** `{{ expression }}`

Display component data in templates

```html
<h1>{{ title() }}</h1>
<p>Welcome, {{ user().name }}!</p>
<div>Total: {{ total() }}</div>
<span>{{ items().length }} items</span>
```

```typescript
title = signal("My App");
user = signal({ name: "John", age: 30 });
items = signal([1, 2, 3]);
total = computed(() => this.items().reduce((sum, item) => sum + item, 0));
```

### 2. Property Binding

**Syntax:** `[property]="expression"` or `bind-property="expression"`

Set element properties, directives, and component inputs

#### Element Properties

```html
<img [src]="imageUrl()" [alt]="imageAlt()" />
<button [disabled]="isLoading()">Save</button>
<div [class.active]="isActive()"></div>
<input [value]="username()" />
```

#### Component Inputs

```html
<app-user [user]="currentUser()" [isAdmin]="true"></app-user>
```

```typescript
// Child component using modern inputs
user = input<User>();
isAdmin = input<boolean>(false);
```

### 3. Event Binding

**Syntax:** `(event)="handler()"` or `on-event="handler()"`

Respond to DOM events and component outputs

#### DOM Events

```html
<button (click)="onSave()">Save</button>
<input (input)="onInput($any($event).target.value)" />
<form (submit)="onSubmit($event)" (keydown.enter)="onEnter()"></form>
```

#### Component Outputs

```html
<app-user (userSaved)="onUserSaved($event)" (cancel)="onCancel()"></app-user>
```

```typescript
// Child component using modern outputs
userSaved = output<User>();
cancel = output<void>();
```

### 4. Two-Way Binding

**Syntax:** `[(ngModel)]="property"` or `[(property)]="value"`

Combine property and event binding for two-way data flow

### Traditional with FormsModule

```html
<input [(ngModel)]="username" />
<select [(ngModel)]="selectedOption">
  <option value="1">One</option>
  <option value="2">Two</option>
</select>
```

```typescript
username = "";
selectedOption = "1";
```

### Custom Two-Way Binding

**Traditional:**

```html
<app-search [(query)]="searchTerm"></app-search>
```

```typescript
// Child component
@Input() query: string = '';
@Output() queryChange = new EventEmitter<string>();
```

**Modern:**

```html
<app-search [(query)]="searchTerm"></app-search>
```

```typescript
// Child component - modern approach
query = input<string>("");
queryChange = output<string>();
```

### 5. Attribute Binding

**Syntax:** `[attr.attribute]="expression"`

Set HTML element attributes (not properties)

```html
<td [attr.colspan]="colSpan">Content</td>
<button [attr.aria-label]="buttonLabel">Action</button>
<div [attr.data-id]="itemId"></div>
<img [attr.src]="imagePath" [attr.alt]="description" />
```

### 6. Class Binding

**Syntax:** `[class.class-name]="condition"`

Conditionally apply CSS classes

```html
<div
  [class.active]="isActive()"
  [class.disabled]="isDisabled()"
  [class.loading]="isLoading()"
>
  Content
</div>
```

### 7. Style Binding

**Syntax:** `[style.property]="expression"`

Set inline styles dynamically

```html
<div
  [style.color]="textColor()"
  [style.font-size.px]="fontSize()"
  [style.width.%]="widthPercent()"
  [style.background-color]="bgColor()"
>
  Styled content
</div>
```

### 8. Template Reference Variables

**Syntax:** `#variableName` or `ref-variableName`

Reference elements in template

```html
<input #emailInput type="email" />
<button (click)="focusInput(emailInput)">Focus</button>

<app-user #userComp></app-user>
<div>{{ userComp.user?.name }}</div>
```

### Modern Angular Approach (Angular 16+)

#### 1. Signal-based Bindings

**Reactive Properties with Signals:**

```typescript
@Component({
  template: `
    <h1>{{ title() }}</h1>
    <button [disabled]="isLoading()" (click)="loadData()">
      {{ isLoading() ? "Loading..." : "Load Data" }}
    </button>

    @for (item of items(); track item.id) {
    <div
      [class.active]="selectedItemId() === item.id"
      (click)="selectItem(item.id)"
    >
      {{ item.name }}
    </div>
    }
  `,
})
export class ModernComponent {
  // Signal-based state
  title = signal("Modern Angular");
  isLoading = signal(false);
  items = signal<Item[]>([]);
  selectedItemId = signal<number | null>(null);

  // Computed values
  activeItem = computed(() =>
    this.items().find((item) => item.id === this.selectedItemId())
  );

  // Methods
  async loadData() {
    this.isLoading.set(true);
    const data = await fetchData();
    this.items.set(data);
    this.isLoading.set(false);
  }

  selectItem(id: number) {
    this.selectedItemId.set(id);
  }
}
```

#### 2. Modern Input/Output API

**Child Component:**

```typescript
@Component({
  selector: "app-user-card",
  standalone: true,
  template: `
    <div [class.admin]="isAdmin()">
      <h3>{{ user().name }}</h3>
      <p>Email: {{ user().email }}</p>
      <button (click)="onEdit.emit(user().id)">Edit</button>
      <button (click)="onDelete.emit(user().id)">Delete</button>
    </div>
  `,
})
export class UserCardComponent {
  // Modern input API
  user = input.required<User>();
  isAdmin = input<boolean>(false);

  // Modern output API
  onEdit = output<number>();
  onDelete = output<number>();
}
```

**Parent Component:**

```typescript
@Component({
  standalone: true,
  imports: [UserCardComponent],
  template: `
    <app-user-card
      [user]="selectedUser()"
      [isAdmin]="currentUser().role === 'admin'"
      (onEdit)="editUser($event)"
      (onDelete)="deleteUser($event)"
    >
    </app-user-card>
  `,
})
export class ParentComponent {
  selectedUser = signal<User>({
    id: 1,
    name: "John",
    email: "john@example.com",
  });
  currentUser = signal({ role: "admin" });

  editUser(userId: number) {
    // Handle edit
  }

  deleteUser(userId: number) {
    // Handle delete
  }
}
```

#### 3. New Control Flow with Binding

**Modern Template Syntax:**

```html
@if (isLoading()) {
<div class="loading">Loading...</div>
} @else if (items().length > 0) {
<ul>
  @for (item of items(); track item.id) {
  <li
    [class.selected]="selectedItem() === item"
    (click)="selectedItem.set(item)"
  >
    {{ item.name }}
  </li>
  }
</ul>
} @else {
<p>No items found</p>
} @for (user of users(); track user.id; let i = $index) {
<app-user-card [user]="user" [style.order]="i" (onDelete)="removeUser($event)">
</app-user-card>
}
```

#### 4. Model Inputs (Two-way Binding Modern)

**Modern Two-way Binding:**

```typescript
@Component({
  selector: "app-toggle",
  template: `
    <button [class.active]="value()" (click)="valueChange.emit(!value())">
      {{ value() ? "On" : "Off" }}
    </button>
  `,
})
export class ToggleComponent {
  value = input<boolean>(false);
  valueChange = output<boolean>();
}
```

**Usage:**

```html
<app-toggle [(value)]="isEnabled" />
<p>Status: {{ isEnabled() ? 'Enabled' : 'Disabled' }}</p>
```

### Key Benefits of Modern Approach

1. **Automatic Reactivity**: Signals trigger updates automatically
2. **Better Type Safety**: Enhanced generics and type inference
3. **Reduced Boilerplate**: Less code for common patterns
4. **Improved Performance**: Granular change detection
5. **Modern Syntax**: Cleaner, more intuitive template syntax

The modern approach maintains all binding types while making them more reactive, type-safe, and performant through signals and the new template syntax.
