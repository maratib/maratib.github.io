---
title: RxJs Fundamentals
slug: guides/angular/rxjs-fundamentals
description: RxJs Fundamentals
sidebar:
  order: 20
---

- **RxJS** is a library for `reactive programming using Observables`.

- **Making it easier** to `compose asynchronous` or `callback-based code`.
- **Think of it** as a `powerful toolkit` for `handling events, API calls, timers`, and any `asynchronous operations` in a `clean and declarative way`.

**Key Benefits:**

- **Handles asynchronous operations elegantly** - No more "callback hell" or complex Promise chains
- **Provides powerful data transformation tools** - Like array methods but for streams over time
- **Enables clean, declarative code** - Describe what you want, not how to get it
- **Excellent error handling capabilities** - Centralized and predictable error management

_Imagine you're building a search feature that needs to wait for the user to stop typing, then call an API, and handle errors gracefully. RxJS makes this complex sequence simple and readable._

---

### Core Concepts

_This section covers the `five essential concepts` that form the foundation of RxJS._

#### 1. Observable

**`A representation of any set of values over any amount of time.`**

Think of an `Observable as a stream of data` that can `emit zero, one, or many values over time`. It's like a pipe that can deliver water (data) now, later, or continuously.

#### 2. Observer

**`A collection of callbacks that knows how to listen to values delivered by an Observable.`**

An Observer is simply an object with three optional methods: `next()` for values, `error()` for errors, and `complete()` for completion notification.

#### 3. Subscription

**`The execution of an Observable, primarily useful for cancelling the execution.`**

When you subscribe to an Observable, you get a Subscription object that represents that particular execution. You can use it to unsubscribe and clean up resources.

#### 4. Operators

**`Pure functions that enable functional programming style of dealing with collections.`**

Operators are methods you can chain together to transform, filter, combine, or manipulate Observables. They're like array methods (map, filter) but for asynchronous streams.

#### 5. Subject

**`The equivalent of an EventEmitter, and the only way of multicasting a value to multiple Observers.`**

A `Subject is a special type of Observable` that allows values to be `multicasted to many Observers`, making it `perfect for event bus patterns`.

---

### Observables

_This section shows how to create and consume Observables - the core data type in RxJS._

#### Creating Observables

_Different ways to create Observables from various data sources_

```typescript
import { Observable, of, from, fromEvent, interval } from "rxjs";

// Create from a single value - emits each argument immediately
const singleValue$ = of("Hello", "World"); // Emits 'Hello', then 'World', then completes

// Create from an array - emits each array item in sequence
const arrayValues$ = from([1, 2, 3, 4, 5]); // Emits 1, 2, 3, 4, 5 then completes

// Create from an event - turns DOM events into streams
const click$ = fromEvent(document, "click"); // Emits click events forever

// Create from a timer - emits sequential numbers at intervals
const timer$ = interval(1000); // emits 0, 1, 2, 3... every second

// Create custom Observable - full control over emission
const custom$ = new Observable((subscriber) => {
  subscriber.next("First value"); // Emit immediately
  subscriber.next("Second value"); // Emit immediately
  setTimeout(() => {
    subscriber.next("Delayed value"); // Emit after 1 second
    subscriber.complete(); // Signal completion
  }, 1000);
});
```

#### Subscribing to Observables

_How to listen to values from Observables and handle different scenarios_

```typescript
const observable$ = of(1, 2, 3);

// Basic subscription with full observer object
observable$.subscribe({
  next: (value) => console.log(value), // Called for each value: 1, 2, 3
  error: (err) => console.error(err), // Called if error occurs
  complete: () => console.log("Completed"), // Called when stream completes
});

// Shorthand (only next handler) - most common usage
observable$.subscribe((value) => console.log(value));

// With multiple callbacks as separate arguments
observable$.subscribe(
  (value) => console.log("Next:", value), // Success handler
  (err) => console.error("Error:", err), // Error handler
  () => console.log("Complete") // Completion handler
);
```

---

### Operators

_This section covers the powerful tools that transform, filter, and combine Observables._

#### Creation Operators

_Functions that create new Observables from various sources_

```typescript
import { of, from, interval, timer, range } from "rxjs";

of(1, 2, 3); // Creates from fixed values: emits 1, 2, 3
from([1, 2, 3]); // Creates from array/promise: emits 1, 2, 3
interval(1000); // Emits sequential numbers every second: 0, 1, 2...
timer(3000); // Emits 0 after 3 seconds delay
range(1, 5); // Emits sequence of numbers: 1, 2, 3, 4, 5
```

#### Transformation Operators

_Operators that modify or transform the values in a stream_

```typescript
import {
  map,
  pluck,
  scan,
  switchMap,
  mergeMap,
  concatMap,
} from "rxjs/operators";

// Map - transform each value (like Array.map)
source$.pipe(
  map((value) => value * 2) // Double each value
);

// Pluck - extract property from objects
source$.pipe(
  pluck("name") // Extract 'name' property from each object
);

// Scan - reduce over time (like reduce but emits intermediate values)
source$.pipe(
  scan((acc, curr) => acc + curr, 0) // Running total: 1, 3, 6 for inputs 1, 2, 3
);

// SwitchMap - switch to new observable, cancel previous (perfect for search)
click$.pipe(
  switchMap(() => httpRequest$) // If new click, cancel previous request
);

// MergeMap - merge multiple observables (run in parallel)
source$.pipe(
  mergeMap((value) => of(value, value * 2)) // For input 1, emits 1 and 2
);
```

#### Filtering Operators

_Operators that control which values get through the stream_

```typescript
import {
  filter,
  take,
  skip,
  debounceTime,
  distinctUntilChanged,
} from "rxjs/operators";

// Filter - only emit values that pass the test
source$.pipe(
  filter((value) => value > 10) // Only values greater than 10
);

// Take - take first N values then complete
source$.pipe(
  take(5) // Take only first 5 values then complete
);

// Skip - skip first N values
source$.pipe(
  skip(2) // Skip first 2 values, emit from 3rd onward
);

// DebounceTime - only emit after specified quiet time
input$.pipe(
  debounceTime(300) // Wait 300ms after user stops typing
);

// DistinctUntilChanged - only emit when value changes
source$.pipe(
  distinctUntilChanged() // Emit 1, 2, 2, 3 → outputs 1, 2, 3
);
```

#### Combination Operators

_Operators that combine multiple Observables in different ways_

```typescript
import { merge, concat, combineLatest, withLatestFrom, zip } from "rxjs";

// Merge - combine multiple observables (interleaved)
const merged$ = merge(obs1$, obs2$); // Values from both as they arrive

// Concat - emit values in sequence
const concatenated$ = concat(obs1$, obs2$); // First obs1$ completes, then obs2$

// CombineLatest - combine latest values from multiple observables
const combined$ = combineLatest([obs1$, obs2$]); // [value1, value2] when either changes

// WithLatestFrom - combine with latest value from another observable
source$.pipe(
  withLatestFrom(other$) // [sourceValue, latestOtherValue]
);

// Zip - combine in lock-step sequence
const zipped$ = zip(obs1$, obs2$); // [obs1Value, obs2Value] pair by pair
```

---

### Subjects

_This section covers special Observable types that can both emit and subscribe._

```typescript
import { Subject, BehaviorSubject, ReplaySubject, AsyncSubject } from "rxjs";

// Subject - basic multicast observable
const subject = new Subject();
subject.subscribe((value) => console.log("Observer A:", value));
subject.subscribe((value) => console.log("Observer B:", value));
subject.next("Hello"); // Both observers receive 'Hello'

// BehaviorSubject - requires initial value, emits current value to new subscribers
const behaviorSubject = new BehaviorSubject("Initial");
behaviorSubject.subscribe((value) => console.log("Observer:", value)); // Immediately gets 'Initial'
behaviorSubject.next("New Value"); // All subscribers get 'New Value'

// ReplaySubject - replays specified number of values to new subscribers
const replaySubject = new ReplaySubject(2); // Replays last 2 values
replaySubject.next(1);
replaySubject.next(2);
replaySubject.next(3);
replaySubject.subscribe((value) => console.log(value)); // Gets 2, 3 immediately

// AsyncSubject - only emits last value when complete
const asyncSubject = new AsyncSubject();
asyncSubject.subscribe((value) => console.log(value));
asyncSubject.next(1);
asyncSubject.next(2);
asyncSubject.next(3);
asyncSubject.complete(); // Observer gets 3 (only the last value before completion)
```

---

### Common Patterns

_This section shows practical, real-world examples of RxJS usage._

#### HTTP Request Handling

_Making API calls with proper error handling and retry logic_

```typescript
import { from } from "rxjs";
import { map, catchError, retry, switchMap } from "rxjs/operators";

const apiUrl = "https://api.example.com/data";

// Basic HTTP request with full error handling
const httpRequest$ = from(fetch(apiUrl)).pipe(
  switchMap((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return from(response.json());
  }),
  retry(3), // Retry up to 3 times on failure
  catchError((error) => {
    console.error("Request failed:", error);
    return of([]); // Return fallback value instead of breaking
  })
);

httpRequest$.subscribe((data) => console.log("Data:", data));
```

#### Search Debounce

_Implementing a search that waits for user to stop typing_

```typescript
import { fromEvent } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from "rxjs/operators";

const searchInput = document.getElementById("search");

const search$ = fromEvent(searchInput, "input").pipe(
  map((event) => event.target.value), // Extract input value
  debounceTime(300), // Wait 300ms after user stops typing
  distinctUntilChanged(), // Only emit if value changed
  switchMap((searchTerm) => {
    return searchTerm ? performSearch(searchTerm) : of([]); // Call API or return empty
  })
);

search$.subscribe((results) => displayResults(results));
```

#### Multiple API Calls

_Handling parallel API requests and waiting for all to complete_

```typescript
import { forkJoin } from "rxjs";

// Parallel requests - wait for all to complete
const userData$ = getUserData();
const userPosts$ = getUserPosts();
const userFriends$ = getUserFriends();

forkJoin([userData$, userPosts$, userFriends$]).subscribe(
  ([userData, posts, friends]) => {
    // This executes only when ALL requests complete
    console.log("User:", userData);
    console.log("Posts:", posts);
    console.log("Friends:", friends);
  }
);
```

---

### Error Handling

_This section covers strategies for managing errors in reactive streams._

```typescript
import { of, throwError } from "rxjs";
import { catchError, retry, retryWhen, delay, take } from "rxjs/operators";

// Basic error handling - provide fallback value
source$.pipe(
  catchError((error) => {
    console.error("Error occurred:", error);
    return of("Fallback value"); // Continue with fallback instead of breaking
  })
);

// Retry with delay and limit
source$.pipe(
  retryWhen((errors) =>
    errors.pipe(
      delay(1000), // Wait 1 second between retries
      take(3) // Retry max 3 times then give up
    )
  )
);

// Conditional retry based on error type
source$.pipe(
  retry(2), // Retry 2 times immediately
  catchError((error) => {
    if (error.status === 500) {
      return of("Server error fallback"); // Specific handling for server errors
    }
    return throwError(error); // Re-throw other errors
  })
);
```

---

### Best Practices

_This section provides professional guidelines for writing clean, maintainable RxJS code._

#### 1. Always Unsubscribe

_Prevent memory leaks by cleaning up subscriptions_

```typescript
import { Subscription } from "rxjs";

class MyComponent {
  private subscriptions = new Subscription();

  ngOnInit() {
    // Add all subscriptions to the collection
    this.subscriptions.add(
      observable$.subscribe((value) => console.log(value))
    );

    this.subscriptions.add(
      anotherObservable$.subscribe((value) => console.log(value))
    );
  }

  ngOnDestroy() {
    // Unsubscribe from ALL subscriptions at once
    this.subscriptions.unsubscribe();
  }
}
```

#### 2. Use the `async` Pipe in Angular

_Let Angular handle subscription management automatically_

```typescript
// In component - expose Observable directly
data$ = this.http.get('/api/data');

// In template - async pipe handles subscribe/unsubscribe automatically
<div>{{ data$ | async }}</div>
```

### 3. Avoid Nested Subscriptions

_Use combination operators instead of nesting_

```typescript
// ❌ Bad - nested subscriptions (hard to read and manage)
obs1$.subscribe((value1) => {
  obs2$(value1).subscribe((value2) => {
    // Nested hell - hard to unsubscribe properly
  });
});

// ✅ Good - use combination operators (flat and clean)
obs1$.pipe(switchMap((value1) => obs2$(value1))).subscribe((value2) => {
  // Clean and manageable
});
```

#### 4. Use Proper Operators for Different Scenarios

_Choose the right operator for the job_

```typescript
// For cancellation (like search) - use switchMap
searchTerm$.pipe(
  switchMap((term) => searchApi(term)) // New search cancels previous
);

// For order preservation - use concatMap
actions$.pipe(
  concatMap((action) => saveApi(action)) // Preserve order, wait for completion
);

// For parallel execution - use mergeMap
items$.pipe(
  mergeMap((item) => processItem(item)) // Process in parallel
);
```

#### 5. Memory Management

_Use patterns that automatically clean up subscriptions_

```typescript
// Use takeUntil pattern for automatic cleanup
private destroy$ = new Subject<void>();

ngOnInit() {
  observable$.pipe(
    takeUntil(this.destroy$)  // Automatically completes when destroy$ emits
  ).subscribe();
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

---

### Common Pitfalls to Avoid

_Watch out for these common mistakes:_

1. **Forgetting to unsubscribe** - leads to memory leaks and weird bugs
2. **Nested subscriptions** - makes code hard to read, test, and maintain
3. **Using the wrong combination operator** - can cause subtle data flow bugs
4. **Not handling errors** - leads to silent failures and broken streams
5. **Overusing Subjects** - often regular Observables are more appropriate and functional

---

### Quick Reference

_A cheat sheet for common operators and when to use them_

#### Common Operators Cheat Sheet

| Category       | Operator        | Purpose                  | When to Use                    |
| -------------- | --------------- | ------------------------ | ------------------------------ |
| Creation       | `of`, `from`    | Create from values/array | Quick testing, simple data     |
| Creation       | `interval`      | Timed sequence           | Animations, polling            |
| Transformation | `map`           | Transform values         | Data formatting, calculations  |
| Transformation | `switchMap`     | Switch to new observable | Search, cancel previous        |
| Filtering      | `filter`        | Filter values            | Data validation, filtering     |
| Filtering      | `debounceTime`  | Wait for quiet period    | Search inputs, resize events   |
| Combination    | `combineLatest` | Combine latest values    | Form validation, derived state |
| Error Handling | `catchError`    | Handle errors            | API calls, network operations  |
| Utility        | `tap`           | Side effects             | Debugging, logging             |
