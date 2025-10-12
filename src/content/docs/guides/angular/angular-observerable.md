---
title: Angular Observable
slug: guides/angular/angular-observable
description: Angular Observable
sidebar:
  order: 7
---

- In Angular 19+, **RxJS remains fundamental** for handling asynchronous operations.

- Understanding **Observable, Observer, and Subscription is crucial** for building modern, reactive Angular applications.

#### What is an Observable?

- An **Observable** represents a **stream of values** that can be **observed over time**.
- It's a **lazy collection** that can emit multiple values synchronously or asynchronously.

#### What is an Observer?

- An Observer is a consumer of values delivered by an Observable.
- It's an object with next, error, and complete methods.

#### What is a Subscription?

- A Subscription represents the execution of an Observable.
- It's used to unsubscribe from the Observable, preventing memory leaks.

### Cold vs Hot Observables

| Aspect               | Cold Observable                                   | Hot Observable                                     |
| -------------------- | ------------------------------------------------- | -------------------------------------------------- |
| **Data Production**  | Creates new data source for each subscriber       | Shares single data source among all subscribers    |
| **Execution Start**  | Starts when subscribed (`lazy`)                   | Runs immediately (eager) regardless of subscribers |
| **Data Consistency** | Each subscriber gets complete data from beginning | Late subscribers miss previous emissions           |
| **Common Examples**  | `HttpClient` requests, `of()`, `from()`           | DOM events, WebSocket connections, `Subjects`      |
| **Use Case**         | When each subscriber needs independent execution  | When subscribers should share the same data stream |

#### **Cold observables**

- `Are like YouTube videos` - each subscriber starts playback from the beginning independently,
- Cold observables create new data producers for each subscription (making HTTP calls, reading files)

#### **Hot observables**

- `Are like live TV broadcasts` - all subscribers watch the same stream simultaneously and latecomers miss what already aired.
- Whereas hot observables share a single data producer among all subscribers (DOM events, WebSockets, Subjects),

_Cold is ideal for independent data requests and hot perfect for real-time event broadcasting._

<details>
<summary>Observable</summary>
#### What is an Observable?

- An **Observable** represents a **stream of values** that can be **observed over time**.
- It's a **lazy collection** that can emit multiple values synchronously or asynchronously.

#### Creating Observables in Angular

```typescript
import { Observable } from "rxjs";

// Method 1: Using new Observable constructor
const customObservable = new Observable<string>((subscriber) => {
  console.log("Observable execution started");

  // Emit values
  subscriber.next("First value");
  subscriber.next("Second value");

  // Simulate async operation
  setTimeout(() => {
    subscriber.next("Async value");
    subscriber.complete(); // Signal completion
  }, 1000);

  // Cleanup function
  return () => {
    console.log("Observable teardown - cleanup resources");
  };
});

// Method 2: Using creation functions (common in Angular)
import { of, from, interval, fromEvent } from "rxjs";

const ofObservable = of(1, 2, 3, 4, 5); // Fixed values
const fromObservable = from([10, 20, 30]); // From array
const intervalObservable = interval(1000); // Emit every second
const eventObservable = fromEvent(document, "click"); // DOM events
```

#### Observable in Angular Services

```typescript
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class UserService {
  private users = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ];

  // Observable that emits user data
  getUsers(): Observable<User[]> {
    return new Observable<User[]>((subscriber) => {
      console.log("Fetching users...");

      // Simulate API call
      setTimeout(() => {
        subscriber.next(this.users);
        subscriber.complete();
      }, 500);

      return () => {
        console.log("User observable unsubscribed");
      };
    });
  }

  // Observable with error handling
  getUserById(id: number): Observable<User> {
    return new Observable<User>((subscriber) => {
      const user = this.users.find((u) => u.id === id);

      setTimeout(() => {
        if (user) {
          subscriber.next(user);
          subscriber.complete();
        } else {
          subscriber.error(new Error(`User with id ${id} not found`));
        }
      }, 300);
    });
  }

  // Real-world example with HTTP client
  searchUsers(searchTerm: string): Observable<User[]> {
    return new Observable<User[]>((subscriber) => {
      const filteredUsers = this.users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      subscriber.next(filteredUsers);
      subscriber.complete();
    });
  }
}
```

#### Cold vs Hot Observables

Cold observables start execution upon subscription, while hot observables emit regardless of subscriptions.

```typescript
// Cold Observable - each subscription gets its own execution
const coldObservable = new Observable((subscriber) => {
  console.log("Cold observable executed");
  subscriber.next(Math.random()); // Different value for each subscriber
});

// Hot Observable - shares execution between subscribers
import { Subject } from "rxjs";
const hotObservable = new Subject<number>();

// All subscribers get the same values
hotObservable.subscribe((value) => console.log("Sub1:", value));
hotObservable.subscribe((value) => console.log("Sub2:", value));
hotObservable.next(Math.random()); // Both get same value
```

</details>

<details>
<summary>Observer</summary>
#### What is an Observer?

- An Observer is a consumer of values delivered by an Observable.
- It's an object with next, error, and complete methods.

#### Observer Interface

```typescript
interface Observer<T> {
  next: (value: T) => void; // Handle next value
  error: (error: any) => void; // Handle error
  complete: () => void; // Handle completion
}
```

#### Creating Observers

```typescript
// Complete Observer object
const completeObserver: Observer<string> = {
  next: (value: string) => console.log("Received:", value),
  error: (err: any) => console.error("Error occurred:", err),
  complete: () => console.log("Observation completed"),
};

// Partial Observer (only implementing needed methods)
const partialObserver = {
  next: (value: string) => console.log("Value:", value),
  // error and complete are optional
};

// Using Observer in subscription
const observable = new Observable<string>((subscriber) => {
  subscriber.next("Hello");
  subscriber.next("World");
  subscriber.complete();
});

// Subscribe with complete Observer
observable.subscribe(completeObserver);

// Subscribe with partial Observer
observable.subscribe({
  next: (value) => console.log("Partial:", value),
});
```

#### Practical Observer Examples in Angular

```typescript
import { Component } from "@angular/core";

@Component({
  selector: "app-user-list",
  template: `
    <div *ngFor="let user of users">{{ user.name }}</div>
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="error" class="error">{{ error }}</div>
  `,
})
export class UserListComponent {
  users: User[] = [];
  loading = false;
  error = "";

  constructor(private userService: UserService) {}

  loadUsers() {
    this.loading = true;
    this.error = "";

    const userObserver: Observer<User[]> = {
      next: (users: User[]) => {
        this.users = users;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = err.message;
        this.loading = false;
        console.error("Failed to load users:", err);
      },
      complete: () => {
        console.log("User loading completed");
        this.loading = false;
      },
    };

    this.userService.getUsers().subscribe(userObserver);
  }

  // Alternative: Using separate callbacks
  loadUsersAlternative() {
    this.userService.getUsers().subscribe({
      next: (users) => (this.users = users),
      error: (err) => (this.error = err.message),
      complete: () => (this.loading = false),
    });
  }
}
```

#### Error Handling with Observers

```typescript
@Injectable({ providedIn: "root" })
export class DataService {
  fetchDataWithRetry(): Observable<string> {
    return new Observable<string>((subscriber) => {
      let attempts = 0;
      const maxAttempts = 3;

      const tryFetch = () => {
        attempts++;
        console.log(`Attempt ${attempts} to fetch data`);

        // Simulate API call that might fail
        const success = Math.random() > 0.3; // 70% success rate

        if (success) {
          subscriber.next(`Data from attempt ${attempts}`);
          subscriber.complete();
        } else if (attempts < maxAttempts) {
          console.log(`Retrying... (${attempts}/${maxAttempts})`);
          setTimeout(tryFetch, 1000);
        } else {
          subscriber.error(new Error("All retry attempts failed"));
        }
      };

      tryFetch();
    });
  }
}

// Using the retry observable
this.dataService.fetchDataWithRetry().subscribe({
  next: (data) => console.log("Success:", data),
  error: (err) => console.error("Final error:", err.message),
  complete: () => console.log("Data fetch process completed"),
});
```

</details>

<details>
<summary>Subscription</summary>

#### What is a Subscription?

- A Subscription represents the execution of an Observable.
- It's used to unsubscribe from the Observable, preventing memory leaks.

#### Creating and Managing Subscriptions

```typescript
import { Subscription } from "rxjs";

@Component({
  template: `...`,
})
export class SubscriptionComponent {
  private subscription: Subscription = new Subscription();
  private individualSubscriptions: Subscription[] = [];

  ngOnInit() {
    // Method 1: Store individual subscriptions
    const sub1 = this.userService.getUsers().subscribe();
    const sub2 = this.productService.getProducts().subscribe();

    this.individualSubscriptions.push(sub1, sub2);

    // Method 2: Use Subscription.add() (recommended)
    this.subscription.add(
      this.userService.getUsers().subscribe((users) => (this.users = users))
    );

    this.subscription.add(
      this.productService
        .getProducts()
        .subscribe((products) => (this.products = products))
    );

    // Method 3: Multiple observables in one subscription
    this.subscription.add(
      combineLatest([
        this.userService.getUsers(),
        this.settingsService.getSettings(),
      ]).subscribe(([users, settings]) => {
        this.users = users;
        this.settings = settings;
      })
    );
  }

  ngOnDestroy() {
    // Method 1: Unsubscribe individual subscriptions
    this.individualSubscriptions.forEach((sub) => sub.unsubscribe());

    // Method 2: Unsubscribe using Subscription.add() pattern
    this.subscription.unsubscribe();

    // Method 3: Using takeUntil pattern (see best practices section)
  }
}
```

#### Subscription Management Patterns

```typescript
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-data-manager",
  template: `...`,
})
export class DataManagerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Pattern 1: takeUntil (Most Recommended)
  ngOnInit() {
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => (this.users = users));

    this.settingsService
      .getSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe((settings) => (this.settings = settings));

    // Auto-refresh every 30 seconds
    interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.refreshData());
  }

  // Pattern 2: Manual subscription management
  private manualSubscription = new Subscription();

  setupManualSubscriptions() {
    this.manualSubscription.add(
      this.searchService.searchResults$.subscribe((results) => {
        this.searchResults = results;
      })
    );
  }

  // Pattern 3: Async pipe in templates (Best for templates)
  users$ = this.userService.getUsers().pipe(catchError((error) => of([])));

  ngOnDestroy() {
    // Pattern 1 cleanup
    this.destroy$.next();
    this.destroy$.complete();

    // Pattern 2 cleanup
    this.manualSubscription.unsubscribe();
  }

  refreshData() {
    // Implementation
  }
}
```

#### Real-world Subscription Scenarios

```typescript
@Component({
  selector: "app-real-time-dashboard",
  template: `
    <div *ngIf="isConnected" class="status connected">Connected</div>
    <div *ngIf="!isConnected" class="status disconnected">Disconnected</div>
    <div>{{ liveData }}</div>
  `,
})
export class RealTimeDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private dataSubscription?: Subscription;
  isConnected = false;
  liveData: any;

  ngOnInit() {
    this.connectToLiveData();

    // Monitor connection status
    this.connectionService.connectionStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        this.isConnected = status === "connected";

        if (status === "connected" && !this.dataSubscription) {
          this.connectToLiveData();
        } else if (status === "disconnected") {
          this.disconnectFromLiveData();
        }
      });
  }

  connectToLiveData() {
    // Only subscribe if not already subscribed
    if (!this.dataSubscription) {
      this.dataSubscription = this.liveDataService
        .getLiveData()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.liveData = data;
            console.log("Received live data:", data);
          },
          error: (err) => {
            console.error("Live data error:", err);
            this.dataSubscription = undefined; // Allow reconnection
          },
          complete: () => {
            console.log("Live data stream completed");
            this.dataSubscription = undefined;
          },
        });
    }
  }

  disconnectFromLiveData() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
      this.dataSubscription = undefined;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnectFromLiveData();
  }
}
```

</details>

<details>
<summary>Practical Angular 19+ Patterns</summary>
#### HTTP Service with Observables

```typescript
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class ApiService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Wrapping HTTP calls with Observable
  get<T>(url: string): Observable<T> {
    return new Observable<T>((subscriber) => {
      this.loadingSubject.next(true);

      const httpSubscription = this.http.get<T>(url).subscribe({
        next: (data) => {
          subscriber.next(data);
          this.loadingSubject.next(false);
        },
        error: (error) => {
          subscriber.error(error);
          this.loadingSubject.next(false);
        },
        complete: () => {
          subscriber.complete();
          this.loadingSubject.next(false);
        },
      });

      // Return cleanup function
      return () => {
        httpSubscription.unsubscribe();
        this.loadingSubject.next(false);
      };
    });
  }

  // Real-world API service method
  searchUsers(query: string): Observable<User[]> {
    return new Observable<User[]>((subscriber) => {
      if (!query.trim()) {
        subscriber.next([]);
        subscriber.complete();
        return;
      }

      const controller = new AbortController();
      const signal = controller.signal;

      fetch(`/api/users?q=${encodeURIComponent(query)}`, { signal })
        .then((response) => {
          if (!response.ok) throw new Error("Network error");
          return response.json();
        })
        .then((data) => {
          subscriber.next(data);
          subscriber.complete();
        })
        .catch((err) => {
          subscriber.error(err);
        });

      // Cleanup: abort fetch on unsubscribe
      return () => controller.abort();
    });
  }
}
```

#### Component Communication with Subjects

```typescript
import { Component, OnDestroy } from "@angular/core";
import { Subject, Observable } from "rxjs";

@Component({
  selector: "app-component-a",
  template: `
    <button (click)="sendMessage()">Send Message</button>
    <app-component-b
      [message$]="messageSubject.asObservable()"
    ></app-component-b>
  `,
})
export class ComponentA implements OnDestroy {
  private messageSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  sendMessage() {
    this.messageSubject.next(`Message at ${new Date().toISOString()}`);
  }

  ngOnDestroy() {
    this.messageSubject.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }
}

@Component({
  selector: "app-component-b",
  template: ` <div>Received: {{ lastMessage }}</div> `,
})
export class ComponentB implements OnDestroy {
  private destroy$ = new Subject<void>();
  lastMessage = "";

  @Input() set message$(message$: Observable<string>) {
    // Resubscribe when input changes
    this.destroy$.next();

    message$.pipe(takeUntil(this.destroy$)).subscribe((message) => {
      this.lastMessage = message;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

#### Form Handling with Observables

```typescript
import { Component, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-user-form",
  template: `
    <form [formGroup]="userForm">
      <input formControlName="name" placeholder="Name" />
      <input formControlName="email" placeholder="Email" />
    </form>
    <div>Form Valid: {{ formValid }}</div>
    <div>Last Saved: {{ lastSaved | date : "medium" }}</div>
  `,
})
export class UserFormComponent implements OnDestroy {
  userForm: FormGroup;
  private destroy$ = new Subject<void>();
  formValid = false;
  lastSaved?: Date;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: [""],
      email: [""],
    });

    this.setupFormObservables();
  }

  private setupFormObservables() {
    // Monitor form validity
    this.userForm.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        this.formValid = status === "VALID";
      });

    // Auto-save on form changes (with debounce)
    this.userForm.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((formValue) => {
        this.autoSave(formValue);
      });

    // Specific field monitoring
    this.userForm
      .get("email")!
      .valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((email) => {
        this.validateEmail(email);
      });
  }

  private autoSave(formValue: any) {
    if (this.formValid) {
      console.log("Auto-saving:", formValue);
      this.lastSaved = new Date();
      // Implement actual save logic here
    }
  }

  private validateEmail(email: string) {
    // Email validation logic
    console.log("Validating email:", email);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

</details>

<details>
<summary>Best Practices for Angular 19+</summary>

#### Memory Management

```typescript
@Component({
  selector: "app-best-practices",
  template: `...`,
})
export class BestPracticesComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  // ✅ GOOD: Use takeUntil pattern
  ngOnInit() {
    this.dataService
      .getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => (this.data = data));
  }

  // ✅ GOOD: Use async pipe in templates
  users$ = this.userService.getUsers().pipe(catchError((error) => of([])));

  // ❌ AVOID: Manual subscription without cleanup
  badPractice() {
    this.dataService.getData().subscribe((data) => {
      this.data = data; // Memory leak risk!
    });
  }

  // ✅ GOOD: Handle errors properly
  loadDataWithErrorHandling() {
    this.dataService
      .getData()
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error("Data load failed:", error);
          this.showError("Failed to load data");
          return of([]); // Provide fallback
        })
      )
      .subscribe((data) => (this.data = data));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

#### Performance Optimization

```typescript
@Injectable({ providedIn: "root" })
export class OptimizedService {
  private cache = new Map<string, Observable<any>>();

  // Cache expensive operations
  getCachedData(key: string): Observable<any> {
    if (!this.cache.has(key)) {
      this.cache.set(
        key,
        this.http.get(`/api/data/${key}`).pipe(
          shareReplay(1), // Share among multiple subscribers
          take(1) // Auto-complete after first emission
        )
      );
    }
    return this.cache.get(key)!;
  }

  // Efficient search with cancellation
  searchWithCancel(term$: Observable<string>): Observable<any[]> {
    return term$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) =>
        term ? this.http.get<any[]>(`/api/search?q=${term}`) : of([])
      )
    );
  }
}
```

#### Testing Observables

```typescript
import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { of, throwError } from "rxjs";

describe("UserService", () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it("should emit users observable", (done) => {
    // Arrange
    const mockUsers: User[] = [{ id: 1, name: "Test User" }];

    // Act & Assert
    service.getUsers().subscribe({
      next: (users) => {
        expect(users).toEqual(mockUsers);
        done();
      },
      error: done.fail,
    });
  });

  it("should handle errors in observable", (done) => {
    service.getUserById(999).subscribe({
      next: () => done.fail("Should have failed"),
      error: (error) => {
        expect(error.message).toContain("not found");
        done();
      },
    });
  });

  it("should complete observable", (done) => {
    let completed = false;

    service.getUsers().subscribe({
      complete: () => {
        completed = true;
        expect(completed).toBeTrue();
        done();
      },
    });
  });
});
```

</details>

### Summary

#### Key Takeaways:

1. **Observables** are lazy data streams that can emit multiple values over time
2. **Observers** consume observable values through next, error, and complete methods
3. **Subscriptions** represent observable executions and must be managed to prevent memory leaks
4. **Use `takeUntil` pattern** for subscription management in components
5. **Prefer async pipe** in templates when possible
6. **Always handle errors** in observables
7. **Use appropriate operators** for transformation, filtering, and combination

### Angular 19+ Specific Notes:

- Tree-shakable RxJS operators continue to be optimized
- Improved developer experience with stricter types
- Continued emphasis on reactive patterns with Signals coexisting with Observables
