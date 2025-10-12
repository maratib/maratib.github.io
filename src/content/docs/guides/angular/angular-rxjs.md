---
title: Angular RxJs
slug: guides/angular/angular-rxjs
description: Angular RxJs
sidebar:
  order: 8
---

- RxJS (Reactive Extensions for JavaScript) is a library for reactive programming using Observables.
- In Angular, RxJS is fundamental for handling asynchronous operations, events, HTTP requests, and state management.

---

## 1. Basic Concepts

### Understanding Observables, Observers, and Subscriptions

Observables are the core of RxJS - they represent lazy push collections of multiple values. Observers are consumers of Observable values, and Subscriptions represent the execution of an Observable.

```typescript
import { Observable } from "rxjs";

// Creating a custom Observable
const simpleObservable = new Observable<string>((observer) => {
  // Observable execution
  observer.next("Hello"); // Emit value
  observer.next("World"); // Emit another value
  setTimeout(() => {
    observer.next("Delayed value");
    observer.complete(); // Signal completion
  }, 1000);

  // Optional cleanup function
  return () => {
    console.log("Observable teardown");
  };
});

// Subscribing to the Observable
const subscription = simpleObservable.subscribe({
  next: (value) => console.log("Received:", value),
  error: (err) => console.error("Error:", err),
  complete: () => console.log("Stream completed"),
});

// Unsubscribing to prevent memory leaks
subscription.unsubscribe();
```

### Subjects and Their Variants

Subjects are special types of Observables that allow multicasting to multiple Observers. They act as both Observable and Observer.

```typescript
import { Subject, BehaviorSubject, ReplaySubject, AsyncSubject } from "rxjs";

// Regular Subject - no initial value, only emits after subscription
const subject = new Subject<string>();
subject.next("This is missed"); // Won't be received by late subscribers
subject.subscribe((value) => console.log("Subscriber 1:", value));
subject.next("Hello"); // Received by Subscriber 1

// BehaviorSubject - requires initial value, emits current value to new subscribers
const behaviorSubject = new BehaviorSubject<number>(0);
behaviorSubject.subscribe((value) => console.log("Sub1:", value)); // Immediately gets 0
behaviorSubject.next(1);
behaviorSubject.subscribe((value) => console.log("Sub2:", value)); // Immediately gets 1

// ReplaySubject - replays specified number of previous values to new subscribers
const replaySubject = new ReplaySubject<number>(2); // Buffer size of 2
replaySubject.next(1);
replaySubject.next(2);
replaySubject.next(3);
replaySubject.subscribe((value) => console.log("Late subscriber:", value)); // Gets 2, 3

// AsyncSubject - only emits the last value when completed
const asyncSubject = new AsyncSubject<number>();
asyncSubject.next(1);
asyncSubject.next(2);
asyncSubject.subscribe((value) => console.log("Async sub:", value)); // Nothing yet
asyncSubject.complete(); // Now emits 2
```

---

## 2. Creation Operators

Creation operators are functions that create new Observables from various sources like values, arrays, promises, events, or timers.

```typescript
import { of, from, fromEvent, interval, timer, EMPTY } from "rxjs";

// of - creates Observable from fixed set of values
const numbers$ = of(1, 2, 3, 4, 5); // Emits each number synchronously

// from - creates from array, promise, or iterable
const array$ = from([10, 20, 30]); // Converts array to Observable
const promise$ = from(fetch("/api/data")); // Converts promise to Observable

// fromEvent - creates Observable from DOM events
const click$ = fromEvent(document, "click"); // Mouse clicks
const input$ = fromEvent(document.getElementById("search"), "input"); // Input events

// interval - emits sequential numbers at specified intervals
const seconds$ = interval(1000); // 0, 1, 2... every second

// timer - emits after delay, optionally repeats
const delayed$ = timer(3000); // Emits 0 after 3 seconds, then completes
const periodic$ = timer(2000, 1000); // Starts after 2s, emits every 1s

// EMPTY - immediately completes without emitting values
const empty$ = EMPTY; // Useful for cases where you need an Observable that does nothing
```

---

## 3. Transformation Operators

Transformation operators modify the values emitted by source Observables, transforming them into different values or structures.

### Fundamental Transformation Operators

```typescript
import {
  map,
  switchMap,
  mergeMap,
  concatMap,
  exhaustMap,
  toArray,
} from "rxjs/operators";

// map - transforms each value using a projection function
const numbers$ = of(1, 2, 3).pipe(
  map((x) => x * 2) // Double each value
); // Output: 2, 4, 6

// switchMap - projects each value to Observable, cancels previous inner Observables
const search$ = fromEvent(searchInput, "input").pipe(
  map((event) => (event.target as HTMLInputElement).value),
  switchMap((searchTerm) => {
    // If new search comes, cancel previous HTTP request
    return this.http.get(`/api/search?q=${searchTerm}`);
  })
);

// mergeMap - projects each value to Observable and merges the results
const saveRequests$ = userActions$.pipe(
  mergeMap((userAction) => this.http.post("/api/users", userAction)) // All requests run in parallel
);

// concatMap - projects each value to Observable, runs sequentially
const sequentialSaves$ = userActions$.pipe(
  concatMap((userAction) => this.http.post("/api/users", userAction)) // Each request waits for previous to complete
);

// exhaustMap - ignores new values while current inner Observable is active
const loginClicks$ = fromEvent(loginButton, "click").pipe(
  exhaustMap(() => this.http.post("/api/login", credentials))
  // Ignores clicks while login request is in progress
);

// toArray - collects all emissions and emits as single array
const numberArray$ = of(1, 2, 3, 4, 5).pipe(toArray()); // Output: [1, 2, 3, 4, 5]
```

---

## 4. Filtering Operators

Filtering operators select which values from the source Observable should be emitted based on certain conditions or timing.

```typescript
import {
  filter,
  take,
  takeUntil,
  skip,
  debounceTime,
  distinctUntilChanged,
  first,
  last,
} from "rxjs/operators";

// filter - only emit values that satisfy the predicate
const evenNumbers$ = of(1, 2, 3, 4, 5).pipe(filter((x) => x % 2 === 0)); // Output: 2, 4

// take - take only the first n values, then complete
const firstThree$ = of(1, 2, 3, 4, 5).pipe(take(3)); // Output: 1, 2, 3

// takeUntil - emit values until another Observable emits
const destroy$ = new Subject<void>();
const dataStream$ = interval(1000).pipe(
  takeUntil(destroy$) // Stops when destroy$ emits
);

// skip - skip the first n values
const skipTwo$ = of(1, 2, 3, 4, 5).pipe(skip(2)); // Output: 3, 4, 5

// debounceTime - only emit after specified quiet period
const searchInput$ = fromEvent(searchInput, "input").pipe(
  debounceTime(300), // Wait 300ms after last keystroke
  map((event) => (event.target as HTMLInputElement).value)
);

// distinctUntilChanged - only emit when current value is different from previous
const distinctNumbers$ = of(1, 1, 2, 2, 3, 2).pipe(distinctUntilChanged()); // Output: 1, 2, 3, 2

// first - emit the first value that matches condition
const firstEven$ = of(1, 3, 2, 4).pipe(first((x) => x % 2 === 0)); // Output: 2

// last - emit the last value that matches condition
const lastEven$ = of(1, 2, 3, 4, 5).pipe(last((x) => x % 2 === 0)); // Output: 4
```

---

## 5. Combination Operators

Combination operators combine multiple Observables into single Observables, controlling how and when values from different sources are merged.

```typescript
import {
  combineLatest,
  forkJoin,
  merge,
  zip,
  withLatestFrom,
  startWith,
} from "rxjs";

// combineLatest - emits array of latest values whenever any input emits
const formState$ = combineLatest([username$, password$, email$]).pipe(
  map(([username, password, email]) => ({
    username,
    password,
    email,
    valid: !!username && !!password,
  }))
);

// forkJoin - waits for all Observables to complete, then emits last values
const userDashboard$ = forkJoin({
  user: this.http.get("/api/user"),
  posts: this.http.get("/api/posts"),
  settings: this.http.get("/api/settings"),
}); // Emits when all three requests complete

// merge - combines multiple Observables, emits values as they arrive
const allClicks$ = merge(
  fromEvent(button1, "click"),
  fromEvent(button2, "click"),
  fromEvent(button3, "click")
); // Emits clicks from any button

// zip - combines values in sequence, emits when all sources have new values
const zipped$ = zip(of("A", "B", "C"), of(1, 2, 3), of(true, false, true)); // Output: ['A', 1, true], ['B', 2, false], ['C', 3, true]

// withLatestFrom - combines source with latest value from another Observable
const clicksWithUser$ = fromEvent(button, "click").pipe(
  withLatestFrom(currentUser$),
  map(([clickEvent, user]) => ({ user, timestamp: Date.now() }))
);

// startWith - start stream with initial value
const dataWithLoading$ = this.http.get("/api/data").pipe(
  startWith("loading...") // Immediately emit 'loading...' before HTTP response
);
```

---

## 6. Utility Operators

Utility operators perform side effects, modify timing, or add other utility functions to Observables without transforming the emitted values.

```typescript
import { tap, delay, timeout, finalize } from "rxjs/operators";

// tap - perform side effects without affecting the stream
const loggedStream$ = userActions$.pipe(
  tap((userAction) => console.log("Action performed:", userAction)),
  tap((userAction) => this.analyticsService.track(userAction)),
  tap({
    next: (value) => console.log("Value:", value),
    error: (err) => console.error("Error:", err),
    complete: () => console.log("Completed"),
  })
);

// delay - delay each emission by specified time
const delayedMessage$ = of("Hello World").pipe(
  delay(2000) // Emits after 2 seconds
);

// timeout - error if no value is emitted within specified time
const apiWithTimeout$ = this.http.get("/api/slow-data").pipe(
  timeout(5000) // Throw error if request takes longer than 5 seconds
);

// finalize - execute callback when observable completes or errors
const resource$ = this.http.get("/api/resource").pipe(
  finalize(() => {
    console.log("Request completed or failed");
    this.loading = false;
  })
);
```

---

## 7. Error Handling Operators

Error handling operators catch and handle errors in Observable streams, allowing for graceful error recovery and retry logic.

```typescript
import { catchError, retry, retryWhen, delay } from "rxjs/operators";
import { of, throwError } from "rxjs";

// catchError - handle errors by returning a new Observable
const safeApiCall$ = this.http.get("/api/data").pipe(
  catchError((error) => {
    console.error("API call failed:", error);
    // Return fallback value
    return of([]);
    // Or re-throw the error
    // return throwError(() => new Error('Custom error message'));
  })
);

// retry - automatically resubscribe specified number of times on error
const retryApiCall$ = this.http.get("/api/unreliable").pipe(
  retry(3) // Retry up to 3 times before giving up
);

// retryWhen - retry with custom logic and conditions
const retryWithBackoff$ = this.http.get("/api/data").pipe(
  retryWhen((errors) =>
    errors.pipe(
      delay(1000), // Wait 1 second between retries
      take(3) // Only retry 3 times
    )
  )
);

// Comprehensive error handling pattern
const robustApiCall$ = this.http.get("/api/data").pipe(
  timeout(5000), // Add timeout
  retry(2), // Retry twice on failure
  catchError((error) => {
    // Handle different error types
    if (error.name === "TimeoutError") {
      this.notificationService.show("Request timed out");
    } else if (error.status === 404) {
      this.notificationService.show("Data not found");
      return of({ notFound: true });
    } else if (error.status === 500) {
      this.notificationService.show("Server error");
    }

    // Re-throw for global error handler
    return throwError(() => error);
  })
);
```

---

## 8. Angular-Specific Patterns

### HTTP Service Patterns

Common patterns for handling HTTP requests in Angular services with proper error handling and transformation.

```typescript
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(private http: HttpClient) {}

  // Basic GET request with error handling
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>("/api/users").pipe(
      catchError((error) => {
        console.error("Failed to fetch users", error);
        this.notificationService.show("Failed to load users");
        return of([]); // Return empty array as fallback
      })
    );
  }

  // Multiple parallel requests
  getUserDashboard(userId: string): Observable<DashboardData> {
    return forkJoin({
      user: this.http.get<User>(`/api/users/${userId}`),
      posts: this.http.get<Post[]>(`/api/users/${userId}/posts`),
      settings: this.http.get<Settings>(`/api/users/${userId}/settings`),
    }).pipe(
      catchError((error) => {
        console.error("Dashboard load failed", error);
        return of({ user: null, posts: [], settings: null });
      })
    );
  }

  // Sequential dependent requests
  createUserWithProfile(userData: UserData): Observable<User> {
    return this.http.post<User>("/api/users", userData).pipe(
      switchMap((createdUser) =>
        this.http
          .post<Profile>(
            `/api/users/${createdUser.id}/profile`,
            userData.profile
          )
          .pipe(
            map(() => createdUser) // Return the created user
          )
      )
    );
  }

  // Search with debounce and cancellation
  searchUsers(term$: Observable<string>): Observable<User[]> {
    return term$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) =>
        term ? this.http.get<User[]>(`/api/users?search=${term}`) : of([])
      )
    );
  }
}
```

### Component Patterns with RxJS

Common RxJS patterns used in Angular components for handling user interactions, data loading, and lifecycle management.

```typescript
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-user-search",
  template: `
    <input #searchInput placeholder="Search users..." />
    <div *ngIf="loading">Loading...</div>
    <div *ngFor="let user of users$ | async">
      {{ user.name }}
    </div>
  `,
})
export class UserSearchComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchTerm = new Subject<string>();

  loading = false;
  users$ = this.searchTerm.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((term) => {
      this.loading = true;
      return this.userService
        .searchUsers(term)
        .pipe(finalize(() => (this.loading = false)));
    })
  );

  @ViewChild("searchInput") searchInput!: ElementRef;

  ngOnInit() {
    // Set up search input
    fromEvent(this.searchInput.nativeElement, "input")
      .pipe(
        map((event: any) => event.target.value),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => this.searchTerm.next(value));

    // Auto-refresh data every 30 seconds
    interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.refreshData();
      });
  }

  refreshData() {
    // Implementation for refreshing data
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Route and Parameter Handling

Using RxJS to handle route parameters, query parameters, and route data in Angular components.

```typescript
import { ActivatedRoute, Router } from '@angular/router';

@Component({...})
export class UserDetailComponent implements OnInit {
  private destroy$ = new Subject<void>();

  // Stream for user ID from route params
  userId$ = this.route.paramMap.pipe(
    map(params => params.get('id')),
    filter(id => !!id), // Filter out null values
    distinctUntilChanged() // Only emit when ID actually changes
  );

  // Stream for user data
  user$ = this.userId$.pipe(
    switchMap(id => this.userService.getUser(id!))
  );

  // Stream for query parameters
  searchQuery$ = this.route.queryParamMap.pipe(
    map(params => params.get('q') || ''),
    distinctUntilChanged()
  );

  // Combine route params and query params
  combinedParams$ = combineLatest([
    this.route.params,
    this.route.queryParams
  ]).pipe(
    map(([params, queryParams]) => ({
      userId: params['id'],
      search: queryParams['q']
    }))
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // React to parameter changes
    this.combinedParams$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(({ userId, search }) => {
      console.log('User:', userId, 'Search:', search);
    });

    // Handle query parameter changes for search
    this.searchQuery$.pipe(
      debounceTime(300),
      switchMap(query => this.searchService.search(query)),
      takeUntil(this.destroy$)
    ).subscribe(results => {
      this.searchResults = results;
    });
  }

  updateSearch(query: string) {
    // Update query params without reloading component
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: query },
      queryParamsHandling: 'merge'
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Reactive Forms with RxJS

Using RxJS with Angular reactive forms for validation, value monitoring, and auto-saving.

```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({...})
export class UserRegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  private destroy$ = new Subject<void>();

  // Form status stream
  formStatus$ = this.registrationForm.statusChanges.pipe(
    map(status => status === 'VALID')
  );

  // Form value changes with debounce for auto-save
  formChanges$ = this.registrationForm.valueChanges.pipe(
    debounceTime(1000),
    filter(() => this.registrationForm.valid),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
  );

  // Password match validation stream
  passwordsMatch$ = combineLatest([
    this.registrationForm.get('password')!.valueChanges,
    this.registrationForm.get('confirmPassword')!.valueChanges
  ]).pipe(
    map(([password, confirm]) => password === confirm),
    startWith(true)
  );

  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      newsletter: [false]
    });
  }

  ngOnInit() {
    // Auto-save form data when valid and changed
    this.formChanges$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(formValue => {
      this.autoSaveForm(formValue);
    });

    // Show/hide password mismatch error
    this.passwordsMatch$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(match => {
      const confirmPasswordControl = this.registrationForm.get('confirmPassword');
      if (!match) {
        confirmPasswordControl!.setErrors({ passwordMismatch: true });
      } else {
        if (confirmPasswordControl!.errors?.['passwordMismatch']) {
          delete confirmPasswordControl!.errors['passwordMismatch'];
          if (Object.keys(confirmPasswordControl!.errors).length === 0) {
            confirmPasswordControl!.setErrors(null);
          }
        }
      }
    });

    // Enable/disable newsletter based on user preference
    this.registrationForm.get('newsletter')!.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(newsletter => {
      this.updateNewsletterPreference(newsletter);
    });
  }

  private autoSaveForm(formValue: any) {
    // Save form data to backend or local storage
    console.log('Auto-saving form:', formValue);
    this.userService.saveFormDraft(formValue).subscribe();
  }

  private updateNewsletterPreference(enabled: boolean) {
    // Update newsletter preference
    this.userService.updateNewsletter(enabled).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## 9. Best Practices and Performance

### Memory Management and Unsubscription

Proper techniques to prevent memory leaks by managing subscriptions and implementing clean unsubscription patterns.

```typescript
import { Component, OnDestroy } from '@angular/core';

@Component({...})
export class SafeComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  // Pattern 1: Using takeUntil (recommended)
  ngOnInit() {
    this.dataService.getData().pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => this.data = data);

    this.userService.getUser().pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => this.user = user);
  }

  // Pattern 2: Using async pipe in templates (best practice)
  data$ = this.dataService.getData().pipe(
    catchError(error => of(null))
  );

  // Pattern 3: Manual subscription management (avoid if possible)
  private subscriptions = new Subscription();

  alternativeInit() {
    const sub1 = this.service1.getData().subscribe();
    const sub2 = this.service2.getData().subscribe();

    this.subscriptions.add(sub1);
    this.subscriptions.add(sub2);
  }

  ngOnDestroy() {
    // Cleanup for takeUntil pattern
    this.destroy$.next();
    this.destroy$.complete();

    // Cleanup for manual subscriptions
    this.subscriptions.unsubscribe();
  }
}
```

### Performance Optimization Patterns

Techniques to optimize RxJS performance in Angular applications, including caching, debouncing, and efficient data handling.

```typescript
// Share expensive operations across multiple subscribers
@Injectable()
export class DataService {
  private usersCache$: Observable<User[]>;

  getUsers(): Observable<User[]> {
    if (!this.usersCache$) {
      this.usersCache$ = this.http.get<User[]>('/api/users').pipe(
        shareReplay(1) // Cache and replay to all subscribers
      );
    }
    return this.usersCache$;
  }
}

// Efficient search with cancellation
searchProducts(term: string): Observable<Product[]> {
  return this.http.get<Product[]>(`/api/products?search=${term}`).pipe(
    timeout(5000),
    retry(2),
    catchError(error => of([]))
  );
}

// Lazy loading with conditional requests
getUserData(userId$: Observable<string>): Observable<UserData> {
  return userId$.pipe(
    filter(id => !!id), // Only proceed if ID exists
    distinctUntilChanged(), // Only if ID changed
    switchMap(id => this.http.get<UserData>(`/api/users/${id}`))
  );
}
```

### Common RxJS Patterns Cheat Sheet

Reusable RxJS patterns that solve common problems in Angular applications.

```typescript
// 1. Search with debounce and cancellation
createSearch(term$: Observable<string>): Observable<SearchResult[]> {
  return term$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term =>
      term ? this.searchService.search(term) : of([])
    ),
    catchError(error => {
      console.error('Search failed:', error);
      return of([]);
    })
  );
}

// 2. Polling with exponential backoff
pollWithBackoff(initialDelay: number, maxDelay: number): Observable<Data> {
  return timer(0, initialDelay).pipe(
    switchMap((_, attempt) =>
      this.api.getData().pipe(
        retryWhen(errors => errors.pipe(
          delayWhen(() => timer(Math.min(initialDelay * Math.pow(2, attempt), maxDelay)))
        ))
      )
    ),
    shareReplay(1)
  );
}

// 3. Dependent data loading
loadUserWithRelatedData(userId: string): Observable<{user: User, posts: Post[]}> {
  return this.api.getUser(userId).pipe(
    switchMap(user =>
      forkJoin({
        posts: this.api.getUserPosts(userId),
        settings: this.api.getUserSettings(userId)
      }).pipe(
        map(({ posts, settings }) => ({ user, posts, settings }))
      )
    )
  );
}

// 4. Loading state management
withLoadingState<T>(source$: Observable<T>): Observable<{data?: T, loading: boolean, error?: any}> {
  return merge(
    source$.pipe(
      map(data => ({ data, loading: false, error: undefined })),
      catchError(error => of({ data: undefined, loading: false, error }))
    ),
    of({ data: undefined, loading: true, error: undefined })
  );
}

// 5. Form auto-save with validation
autoSaveForm(form: FormGroup): Observable<void> {
  return form.valueChanges.pipe(
    debounceTime(1000),
    filter(() => form.valid && form.dirty),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    switchMap(formValue => this.api.saveForm(formValue)),
    tap(() => form.markAsPristine())
  );
}
```

---

## Summary

This comprehensive guide covers the essential RxJS operators and patterns used in Angular development. Key takeaways:

1. **Use `takeUntil` pattern** for subscription management
2. **Prefer async pipe** in templates when possible
3. **Use appropriate combination operators** for different scenarios
4. **Always handle errors** with `catchError`
5. **Optimize performance** with `debounceTime`, `distinctUntilChanged`, and `shareReplay`
6. **Choose the right flattening operator** (`switchMap`, `mergeMap`, `concatMap`, `exhaustMap`) based on your use case
