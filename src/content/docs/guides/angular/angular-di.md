---
title: Angular DI
slug: guides/angular/angular-di
description: Angular DI
sidebar:
  order: 10
---

#### **Angular Dependency Injection**

A `design pattern` where objects receive their `dependencies from an external source` rather than `creating them internally`.

In Angular,

- DI is a framework that provides dependencies to classes rather than having classes create dependencies themselves.
- It provides loose coupling benefits.

**Without DI:**

```typescript
class Car {
  private engine: Engine;

  constructor() {
    this.engine = new Engine(); // Tight coupling
  }
}
```

**With DI:**

```typescript
class Car {
  constructor(private engine: Engine) {} // Loose coupling
}
```

---

### Why Use DI in Angular?

**_Benefits and advantages of using Dependency Injection in Angular applications_**

- **Testability**: Easy to mock dependencies in tests
- **Maintainability**: Changes to dependencies don't affect consumers
- **Reusability**: Components can be easily reused with different configurations
- **Loose Coupling**: Classes don't need to know how to create dependencies
- **Centralized Configuration**: Dependency configuration in one place

---

### DI Core Concepts

**_Fundamental building blocks of Angular's Dependency Injection system_**

#### 1. Injector

**_The container that holds dependencies and provides them when requested_**

```typescript
// Angular creates injectors automatically
constructor(private injector: Injector) {}
```

#### 2. Provider

**_Tells Angular how to create or deliver a dependency_**

```typescript
// Providers tell Angular what to inject and how
providers: [MyService, { provide: API_URL, useValue: "https://api.com" }];
```

#### 3. Dependency

**_A class, value, or factory that another class needs to function_**

```typescript
// Logger is a dependency of MyService
constructor(private logger: Logger) {}
```

---

### Provider Types

**_Different ways to configure how dependencies are provided_**

#### 1. Class Provider

**_Provides an instance of a class (most common)_**

```typescript
providers: [MyService];
// Equivalent to:
providers: [{ provide: MyService, useClass: MyService }];
```

#### 2. Value Provider

**_Provides a specific value (constants, config objects)_**

```typescript
providers: [
  { provide: API_URL, useValue: "https://api.example.com" },
  { provide: APP_CONFIG, useValue: { theme: "dark", version: "1.0" } },
];
```

#### 3. Factory Provider

**_Uses a factory function to create the dependency_**

```typescript
providers: [
  {
    provide: MyService,
    useFactory: (config: Config) => {
      return config.production
        ? new ProductionService()
        : new DevelopmentService();
    },
    deps: [Config],
  },
];
```

#### 4. Aliased Provider

**_Provides an existing token under a new token_**

```typescript
providers: [
  OldService,
  { provide: NewService, useExisting: OldService }, // Alias
];
```

#### 5. Optional Provider

**_Makes a dependency optional (won't throw error if not found)_**

```typescript
constructor(@Optional() private optionalService: OptionalService) {}
```

---

### Injection Tokens

**_Tokens used to identify dependencies in the DI system_**

#### 1. Type Tokens

**_Use the class itself as the token (most common)_**

```typescript
providers: [MyService]
constructor(private myService: MyService) {} // Type token
```

#### 2. InjectionToken

**_Create specific tokens for non-class dependencies_**

```typescript
// Create token
export const API_URL = new InjectionToken<string>('API_URL');

// Provide value
providers: [{ provide: API_URL, useValue: 'https://api.com' }]

// Inject using @Inject decorator
constructor(@Inject(API_URL) private apiUrl: string) {}
```

#### 3. String Tokens (Legacy)

**_String-based tokens (avoid in new code)_**

```typescript
// Not recommended - potential naming conflicts
providers: [{ provide: 'ApiUrl', useValue: 'https://api.com' }]
constructor(@Inject('ApiUrl') private apiUrl: string) {}
```

---

### Injection Scopes

**_Different lifetimes and visibility scopes for dependencies_**

#### 1. Singleton (Root Level)

**_One instance shared across entire application_**

```typescript
@Injectable({
  providedIn: "root", // Singleton service
})
export class MyService {}
```

#### 2. Module Level

**_One instance per module (deprecated in favor of 'root')_**

```typescript
@NgModule({
  providers: [MyService], // Module-level singleton
})
export class MyModule {}
```

#### 3. Component Level

**_New instance for each component instance_**

```typescript
@Component({
  providers: [MyService], // Instance per component
})
export class MyComponent {}
```

#### 4. Lazy-Loaded Module Scope

**_Separate instance for lazy-loaded modules_**

```typescript
// In lazy module
@NgModule({
  providers: [MyService], // Separate instance for lazy module
})
export class LazyModule {}
```

---

### Hierarchical Injectors

**_How Angular's injector hierarchy works and affects dependency resolution_**

```typescript
// Injector Hierarchy:
// Platform Injector (highest)
// Root Injector
// Module Injectors
// Component Injectors (lowest)
```

#### Parent-Child Resolution

**_Angular searches for dependencies up the injector tree_**

```typescript
@Component({
  selector: "parent",
  providers: [SharedService], // Available to parent and children
})
export class ParentComponent {}

@Component({
  selector: "child",
})
export class ChildComponent {
  // Gets SharedService from parent's injector
  constructor(private sharedService: SharedService) {}
}
```

#### View Providers

**_Limits service visibility to current component view only_**

```typescript
@Component({
  viewProviders: [MyService], // Only available to this component, not content children
})
export class MyComponent {}
```

---

### Advanced DI Patterns

**_Complex dependency injection scenarios and solutions_**

#### 1. Conditional Injection

**_Inject different implementations based on conditions_**

```typescript
providers: [
  {
    provide: DataService,
    useFactory: () => {
      return environment.production
        ? new ProductionDataService()
        : new MockDataService();
    },
  },
];
```

#### 2. Multi Providers

**_Provide multiple values for the same token_**

```typescript
// Multiple plugins for the same token
providers: [
  { provide: PLUGINS, useClass: LoggerPlugin, multi: true },
  { provide: PLUGINS, useClass: AnalyticsPlugin, multi: true }
]

// Inject all plugins
constructor(@Inject(PLUGINS) private plugins: Plugin[]) {}
```

#### 3. Self and SkipSelf

**_Control dependency lookup behavior_**

```typescript
// @Self - only look in current injector
constructor(@Self() private service: MyService) {}

// @SkipSelf - skip current injector, look in parent
constructor(@SkipSelf() private parentService: ParentService) {}
```

#### 4. Host Decorator

**_Limit lookup to current component and its host_**

```typescript
// Only look in current component or its host
constructor(@Host() private hostService: HostService) {}
```

#### 5. Custom Providers with useFactory

**_Complex dependency creation with dependencies_**

```typescript
providers: [
  {
    provide: ComplexService,
    useFactory: (http: HttpClient, config: Config) => {
      return new ComplexService(http, config.apiUrl);
    },
    deps: [HttpClient, Config], // Factory dependencies
  },
];
```

---

### Best Practices

**_Recommended patterns and guidelines for effective DI usage_**

#### 1. Use `providedIn: 'root'` for Services

**_Prefer root-level providers for most services_**

```typescript
@Injectable({
  providedIn: "root", // ✅ Recommended
})
export class MyService {}
```

#### 2. Use InjectionToken for Non-Class Dependencies

**_Always use InjectionToken for values, configs, and interfaces_**

```typescript
export const APP_CONFIG = new InjectionToken<Config>("APP_CONFIG"); // ✅
```

#### 3. Avoid String Tokens

**_Use InjectionToken instead of string tokens to avoid conflicts_**

```typescript
// ❌ Avoid
{ provide: 'apiUrl', useValue: '...' }

// ✅ Use instead
export const API_URL = new InjectionToken('API_URL');
```

#### 4. Keep Constructors Simple

**_Use constructor only for dependency injection_**

```typescript
// ✅ Good
constructor(
  private serviceA: ServiceA,
  private serviceB: ServiceB
) {}

// ❌ Avoid complex logic in constructor
constructor(private service: MyService) {
  this.service.initialize(); // Move to ngOnInit
}
```

#### 5. Use Interface-Based DI with InjectionToken

**_Inject implementations using interfaces_**

```typescript
export interface Logger {
  log(message: string): void;
}

export const LOGGER = new InjectionToken<Logger>('LOGGER');

providers: [{ provide: LOGGER, useClass: ConsoleLogger }]

constructor(@Inject(LOGGER) private logger: Logger) {}
```

#### 6. Proper Testing with DI

**_Test components and services with mocked dependencies_**

```typescript
// Test setup
TestBed.configureTestingModule({
  providers: [MyComponent, { provide: MyService, useClass: MockMyService }],
});
```

### Common Injection Decorators Quick Reference

| Decorator       | Purpose                   | Usage Example                               |
| --------------- | ------------------------- | ------------------------------------------- |
| `@Injectable()` | Marks class as injectable | `@Injectable({providedIn: 'root'})`         |
| `@Inject()`     | Inject using token        | `@Inject(API_URL) private url: string`      |
| `@Optional()`   | Make dependency optional  | `@Optional() private service: MyService`    |
| `@Self()`       | Only current injector     | `@Self() private service: MyService`        |
| `@SkipSelf()`   | Skip current injector     | `@SkipSelf() private parent: ParentService` |
| `@Host()`       | Current or host injector  | `@Host() private hostService: HostService`  |
