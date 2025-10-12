---
title: Component Communication
slug: guides/angular/component-communication
description: Component Communication
sidebar:
  order: 3
---

The modern approach provides better developer experience, improved performance, and aligns with Angular's reactive future while maintaining interoperability with traditional patterns.

### Traditional Communication Patterns

### 1. Parent → Child: @Input()

**Parent Component:**

```typescript
@Component({
  template: `<app-child [user]="currentUser" [config]="config"></app-child>`,
})
export class ParentComponent {
  currentUser = { name: "John", id: 1 };
  config = { theme: "dark", notifications: true };
}
```

**Child Component:**

```typescript
@Component({...})
export class ChildComponent {
  @Input() user: any;
  @Input() config: any;

  // Manual change detection
  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']) {
      console.log('User changed:', changes['user'].currentValue);
    }
  }
}
```

### 2. Child → Parent: @Output()

**Child Component:**

```typescript
@Component({
  template: `
    <button (click)="onSave()">Save</button>
    <input (input)="onInput($event)" />
  `,
})
export class ChildComponent {
  @Output() save = new EventEmitter<any>();
  @Output() inputChanged = new EventEmitter<string>();

  onSave() {
    this.save.emit({ data: "some data", timestamp: new Date() });
  }

  onInput(event: any) {
    this.inputChanged.emit(event.target.value);
  }
}
```

**Parent Component:**

```typescript
@Component({
  template: `
    <app-child (save)="handleSave($event)" (inputChanged)="handleInput($event)">
    </app-child>
  `,
})
export class ParentComponent {
  handleSave(data: any) {
    console.log("Saved:", data);
  }

  handleInput(value: string) {
    console.log("Input:", value);
  }
}
```

### 3. Two-way Binding (Traditional)

**Parent Component:**

```typescript
@Component({
  template: `<app-search [(value)]="searchTerm"></app-search>`,
})
export class ParentComponent {
  searchTerm = "";
}
```

**Child Component:**

```typescript
@Component({
  template: `<input
    [value]="value"
    (input)="valueChange.emit($event.target.value)"
  />`,
})
export class SearchComponent {
  @Input() value: string = "";
  @Output() valueChange = new EventEmitter<string>();
}
```

---

### Modern Communication Patterns (Angular 16+)

### 1. Signal Inputs - Parent → Child

**Child Component:**

```typescript
@Component({
  standalone: true,
  template: `
    <div>
      <h2>{{ user().name }}</h2>
      <p>Theme: {{ config().theme }}</p>
      <p>Count: {{ count() }}</p>
    </div>
  `,
})
export class ChildComponent {
  // Required input
  user = input<any>();

  // Optional input with default
  config = input<any>({ theme: "light", notifications: false });

  // Input with transformation
  count = input<number, string>(0, {
    transform: (value: string) => Number(value) || 0,
  });

  // Computed signals from inputs
  isDarkTheme = computed(() => this.config().theme === "dark");
}
```

**Parent Component:**

```typescript
@Component({
  standalone: true,
  imports: [ChildComponent],
  template: `
    <app-child [user]="currentUser()" [config]="themeConfig" [count]="'5'">
    </app-child>
  `,
})
export class ParentComponent {
  currentUser = signal({ name: "Alice", id: 2 });
  themeConfig = { theme: "dark", notifications: true };
}
```

### 2. Output as Observable/Function - Child → Parent

**Approach 1: Observable-based Outputs**

```typescript
@Component({
  standalone: true,
  template: `
    <button (click)="actions$.next('save')">Save</button>
    <input #input (input)="input$.next(input.value)" />
  `,
})
export class ChildComponent {
  private actions$ = new Subject<string>();
  private input$ = new Subject<string>();
  private data$ = new Subject<any>();

  // Expose as observable outputs
  actions = this.actions$.asObservable();
  inputChanges = this.input$.asObservable();
  data = this.data$.asObservable();

  // Complex event handling
  saveData(data: any) {
    this.data$.next({ ...data, savedAt: new Date() });
  }
}
```

**Approach 2: output() Function (Angular 17.3+)**

```typescript
@Component({
  standalone: true,
  template: `
    <button (click)="onSave.emit(userData())">Save</button>
    <input (input)="onInput.emit($any($event.target).value)" />
  `,
})
export class ChildComponent {
  userData = signal({ name: "", email: "" });

  // New output() function
  onSave = output<any>();
  onInput = output<string>();
  onCancel = output<void>(); // No payload
}
```

**Parent Component (Modern):**

```typescript
@Component({
  standalone: true,
  imports: [ChildComponent],
  template: `
    <app-child
      (onSave)="handleSave($event)"
      (onInput)="handleInput($event)"
      (onCancel)="handleCancel()"
    >
    </app-child>
  `,
})
export class ParentComponent {
  handleSave(data: any) {
    console.log("Data saved:", data);
  }

  handleInput(value: string) {
    console.log("Input:", value);
  }

  handleCancel() {
    console.log("Operation cancelled");
  }
}
```

### 3. Model Inputs (Two-way Binding Modern)

**Modern Two-way Binding:**

```typescript
@Component({
  standalone: true,
  template: `
    <app-search [(query)]="searchQuery" />
    <p>Searching: {{ searchQuery() }}</p>
  `,
})
export class ParentComponent {
  searchQuery = signal("initial value");
}
```

**Child Component:**

```typescript
@Component({
  selector: "app-search",
  standalone: true,
  template: `
    <input
      [value]="query()"
      (input)="updateQuery($event)"
      placeholder="Search..."
    />
  `,
})
export class SearchComponent {
  query = input<string>("");
  queryChange = output<string>();

  updateQuery(event: any) {
    this.queryChange.emit(event.target.value);
  }
}
```

### 4. Service-based Communication with Signals

**Modern Service:**

```typescript
@Injectable({ providedIn: "root" })
export class DataService {
  private dataState = signal<any[]>([]);
  private loadingState = signal<boolean>(false);

  // Expose as read-only signals
  data = this.dataState.asReadonly();
  loading = this.loadingState.asReadonly();

  // Actions
  async loadData() {
    this.loadingState.set(true);
    const data = await fetchData();
    this.dataState.set(data);
    this.loadingState.set(false);
  }

  updateData(item: any) {
    this.dataState.update((items) => [...items, item]);
  }
}
```

**Component using Service:**

```typescript
@Component({
  standalone: true,
  template: `
    @if (dataService.loading()) {
    <p>Loading...</p>
    } @for (item of dataService.data(); track item.id) {
    <p>{{ item.name }}</p>
    }

    <button (click)="dataService.loadData()">Load</button>
  `,
})
export class DataComponent {
  constructor(public dataService: DataService) {}
}
```

---

## Comparison Table

| Aspect                 | Traditional Approach                   | Modern Approach                        |
| ---------------------- | -------------------------------------- | -------------------------------------- |
| **Input Declaration**  | `@Input() prop: type`                  | `prop = input<type>()`                 |
| **Reactivity**         | Manual change detection                | Automatic with signals                 |
| **Type Safety**        | Basic                                  | Enhanced generics & transforms         |
| **Default Values**     | Property assignment                    | `input<type>(default)`                 |
| **Output Declaration** | `@Output() event = new EventEmitter()` | `event = output<type>()` or Observable |
| **Event Handling**     | Direct emission                        | Observable streams or function         |
| **Two-way Binding**    | Banana-in-box `[( )]` syntax           | Model inputs + signals                 |
| **Change Detection**   | `ngOnChanges` required                 | Automatic with signal updates          |
| **Computed Values**    | Getters or methods                     | `computed()` signals                   |
| **Service State**      | Subjects/BehaviorSubjects              | Signals with automatic updates         |

## Key Benefits of Modern Approach

### 1. **Better Reactivity**

```typescript
// Traditional - manual tracking
@Input() items: any[] = [];
filteredItems: any[] = [];

ngOnChanges() {
  this.filteredItems = this.items.filter(item => item.active);
}

// Modern - automatic reactivity
items = input<any[]>([]);
filteredItems = computed(() => this.items().filter(item => item.active));
```

### 2. **Enhanced Type Safety**

```typescript
// Traditional - limited type checking
@Input() user: any;

// Modern - strict generics + transforms
user = input<User>();
count = input<number, string>(0, {
  transform: (v: string) => parseInt(v)
});
```

### 3. **Simpler Composition**

```typescript
// Modern - easy computed values
user = input<User>();
config = input<Config>();

canEdit = computed(
  () => this.user()?.role === "admin" && this.config()?.editable
);
```

### 4. **Better Performance**

- Signals provide granular updates
- No unnecessary change detection cycles
- Automatic dependency tracking

## Migration Strategy

**Traditional:**

```typescript
@Component({...})
export class TraditionalComponent {
  @Input() data: any;
  @Output() update = new EventEmitter<any>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.processData();
    }
  }
}
```

**Modern:**

```typescript
@Component({
  standalone: true,
  ...
})
export class ModernComponent {
  data = input<any>();
  update = output<any>();

  // Automatic reactivity
  processedData = computed(() => this.transformData(this.data()));

  private transformData(data: any) {
    return data; // transformation logic
  }
}
```
