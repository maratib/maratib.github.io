---
title: Component Lifecycle
slug: guides/angular/component-lifecycle
description: Component Lifecycle
sidebar:
  order: 2
---

Lifecycle hooks are methods that Angular calls at specific points in a component's existence, from creation to destruction.

## Quick Reference (Most Commonly Used)

| Hook              | Purpose       | Best For                                           |
| ----------------- | ------------- | -------------------------------------------------- |
| `Constructor`     | Creation      | Not a hook method called when component is created |
| `ngOnInit`        | Initial setup | Data loading, component initialization             |
| `ngOnChanges`     | Input changes | Reacting to `@Input()` changes                     |
| `ngOnDestroy`     | Cleanup       | Unsubscribing, timer cleanup                       |
| `ngAfterViewInit` | View ready    | DOM manipulation, third-party lib initialization   |

### The Complete Lifecycle Sequence

#### 1. Creation Phase:

- **Constructor:** This is the first method called when an instance of the component class is created. It is used for basic initialization of properties and dependency injection.

- **ngOnChanges:** This hook is called before ngOnInit and whenever one or more data-bound input properties change. It receives a SimpleChanges object containing the current and previous values of the changed properties.
- **ngOnInit:** This hook is called once, after the first ngOnChanges and after Angular has initialized all data-bound properties of a directive or component. It is a common place to perform initialization logic, such as fetching data from an API.

#### 2. Content Projection and View Initialization:

- **ngDoCheck:** This hook is called during every change detection cycle, immediately after ngOnChanges and ngOnInit. It allows you to implement custom change detection logic or perform actions that need to run frequently.

- **ngAfterContentInit:** This hook is called once after Angular has projected external content into the component's view. It is used to perform initialization logic related to projected content.
- **ngAfterContentChecked:** This hook is called after Angular checks the content projected into the component. It is used to perform actions after the projected content has been checked for changes.
- **ngAfterViewInit:** This hook is called once after Angular initializes the component's view and its child views. It is typically used for DOM manipulation or interacting with child components.
- **ngAfterViewChecked:** This hook is called after Angular checks the component's view and its child views. It is used to perform actions after the view has been checked for changes.

#### 3. Destruction Phase:

- **ngOnDestroy:** This hook is called just before Angular destroys the component. It is used to perform cleanup tasks, such as unsubscribing from observables, clearing timers, or detaching event listeners, to prevent memory leaks.

#### Note on afterRenderEffect:

Angular 19 introduced **afterRenderEffect**,

- which is a new feature for executing tasks after the rendering is complete.
- While not a traditional lifecycle hook, it provides a powerful mechanism to ensure certain actions are performed once the DOM has been fully updated.
- Leading to smoother and more predictable application behavior.

### Essential Hooks (Most Commonly Used)

### 1. `ngOnInit()`

Component initialization after Angular first displays data-bound properties

```typescript
export class UserComponent implements OnInit {
  user = signal<User | null>(null);

  ngOnInit() {
    // Perfect for initial data loading
    this.loadUserData();
  }

  private loadUserData() {
    // Fetch data from API
    this.user.set({ id: 1, name: "John" });
  }
}
```

### 2. `ngOnChanges()`

Respond when Angular sets or resets data-bound input properties

```typescript
export class ProfileComponent implements OnChanges {
  @Input() userId = signal(0);
  userData = signal<any>(null);

  ngOnChanges(changes: SimpleChanges) {
    if (changes["userId"]) {
      this.loadUserProfile(changes["userId"].currentValue);
    }
  }
}
```

### 3. `ngOnDestroy()`

Cleanup just before Angular destroys the component

```typescript
export class DataComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => console.log(value));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    console.log("Component destroyed - cleanup done");
  }
}
```

## Less Common (But Important) Hooks

### 4. `ngAfterViewInit()`

Respond after Angular initializes the component's views and child views

```typescript
export class ChartComponent implements AfterViewInit {
  @ViewChild("chartContainer") chartContainer!: ElementRef;

  ngAfterViewInit() {
    // Safe to access DOM elements here
    this.initializeChart(this.chartContainer.nativeElement);
  }
}
```

### 5. `ngDoCheck()`

Detect and act upon changes that Angular can't or won't detect on its own

```typescript
export class ListComponent implements DoCheck {
  @Input() items: any[] = [];
  private previousLength = 0;

  ngDoCheck() {
    if (this.items.length !== this.previousLength) {
      console.log("Items array length changed");
      this.previousLength = this.items.length;
    }
  }
}
```

## Modern Angular 19+ with Signals

```typescript
@Component({
  standalone: true,
  template: `
    <h1>User Profile</h1>
    <p>{{ user()?.name }}</p>
  `,
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user = signal<User | null>(null);
  private timerId: any;

  ngOnInit() {
    // Initialize with signals
    this.loadUser();

    // Set up intervals
    this.timerId = setInterval(() => {
      this.refreshData();
    }, 30000);
  }

  ngOnDestroy() {
    // Cleanup
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  private loadUser() {
    // Signal-based data loading
    this.user.set({ id: 1, name: "Alice" });
  }
}
```

## Hook Execution Order Example

```typescript
export class LifecycleDemoComponent
  implements OnChanges, OnInit, DoCheck, AfterViewInit, OnDestroy
{
  @Input() data: string = "";

  constructor() {
    console.log("1. Constructor");
  }

  ngOnChanges() {
    console.log("2. ngOnChanges");
  }

  ngOnInit() {
    console.log("3. ngOnInit - Component initialized");
  }

  ngDoCheck() {
    console.log("4. ngDoCheck - Change detection");
  }

  ngAfterViewInit() {
    console.log("5. ngAfterViewInit - View ready");
  }

  ngOnDestroy() {
    console.log("6. ngOnDestroy - Cleanup");
  }
}
```

## Best Practices

1. **Use `ngOnInit`** for initialization logic (not constructor)
2. **Use `ngOnDestroy`** to unsubscribe from observables and prevent memory leaks
3. **Avoid heavy logic** in `ngDoCheck` as it runs frequently
4. **Use signals** for reactive state management in modern Angular
5. **Keep lifecycle hooks focused** on their specific purposes

**Remember:** Always implement the corresponding interface imported from `@angular/core`.
