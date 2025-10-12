---
title: Angular Subjects
slug: guides/angular/angular-subjects
description: Angular Subjects
sidebar:
  order: 9
---

- **Subjects in Angular** are part of the **RxJS** library and are `essential for reactive programming`.
- A **Subject** is a special type of **Observable** that acts as both an **Observer** and an **Observable**.

- This dual nature allows it to:

1.  **Be an Observable:** You can subscribe to it.
2.  **Be an Observer:** You can manually push new values to it using the `.next(value)` method.

This makes Subjects excellent for **multicasting** (broadcasting a single stream of data to multiple subscribers) and for **inter-component communication** in an Angular application, often via a shared service.

There are **four main types** of **Subjects**, each with distinct behavior regarding when new subscribers receive values:

1. Subject -> `It acts as an event emitter and a multicast Observable`
2. BehaviorSubject -> `It has a notion of "current value"`
3. ReplaySubject -> `That can record a sequence of values and replay them to new subscribers`
4. AsyncSubject -> `that only emits the last value emitted to its subscribers, and only when the Observable completes`.

---

## 1\. Subject

The basic `Subject` is the simplest form. It acts as an event emitter and a multicast Observable.

| Feature             | Description                                                                                                    |
| :------------------ | :------------------------------------------------------------------------------------------------------------- |
| **Initial Value**   | **None**.                                                                                                      |
| **New Subscribers** | Only receive values emitted **after** they subscribe. Values emitted before the subscription are not received. |
| **Primary Use**     | Sending one-off events, like component communication (e.g., a button click event).                             |

**Conceptual Example:** Think of a Subject like a live radio broadcast. If you tune in late, you only hear the rest of the show; you miss everything that was broadcast before you started listening.

```typescript
import { Subject } from "rxjs";

const mySubject = new Subject<number>();

mySubject.next(1); // Emitted before subscription - MISSED

mySubject.subscribe((value) => {
  console.log(`Subscriber 1: ${value}`);
});

mySubject.next(2); // Subscriber 1 receives '2'
mySubject.next(3); // Subscriber 1 receives '3'

mySubject.subscribe((value) => {
  console.log(`Subscriber 2: ${value}`);
});

mySubject.next(4); // Both subscribers receive '4'

/* Output:
Subscriber 1: 2
Subscriber 1: 3
Subscriber 1: 4
Subscriber 2: 4
*/
```

---

## 2\. BehaviorSubject

A `BehaviorSubject` is an extension of `Subject` that has a notion of "current value."

| Feature                  | Description                                                                                                                                           |
| :----------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Initial Value**        | **Required**. Must be initialized with a value.                                                                                                       |
| **New Subscribers**      | Immediately receive the **last emitted value (or the initial value)** upon subscription, and then any subsequent values.                              |
| **Current Value Access** | Allows synchronous access to the current value using the `.value` property.                                                                           |
| **Primary Use**          | Managing application state where components need immediate access to the latest data (e.g., user profile, application settings, shopping cart state). |

**Conceptual Example:** Think of a BehaviorSubject like a digital thermometer. You always know the current temperature (the initial or last value), even if no new change has been reported recently.

```typescript
import { BehaviorSubject } from "rxjs";

const myBehaviorSubject = new BehaviorSubject<number>(0); // Initial value is 0

myBehaviorSubject.subscribe((value) => {
  console.log(`Subscriber 1: ${value}`);
}); // Subscriber 1 immediately receives '0'

myBehaviorSubject.next(1); // Subscriber 1 receives '1'
myBehaviorSubject.next(2); // Subscriber 1 receives '2'

myBehaviorSubject.subscribe((value) => {
  console.log(`Subscriber 2: ${value}`);
}); // Subscriber 2 immediately receives '2' (the last value)

/* Output:
Subscriber 1: 0
Subscriber 1: 1
Subscriber 1: 2
Subscriber 2: 2
*/
```

---

## 3\. ReplaySubject

A `ReplaySubject` is an extension of `Subject` that can record a sequence of values and replay them to new subscribers.

| Feature             | Description                                                                                                    |
| :------------------ | :------------------------------------------------------------------------------------------------------------- |
| **Initial Value**   | **None required**.                                                                                             |
| **New Subscribers** | Receive a **specified number of previously emitted values** upon subscription, and then any subsequent values. |
| **Primary Use**     | Scenarios where a new subscriber needs to catch up on recent history, such as a log or an event stream.        |

**Constructor takes an argument:** `ReplaySubject<T>(bufferSize, windowTime)`

- `bufferSize`: The maximum number of past values to replay.
- `windowTime` (optional): The maximum time (in milliseconds) a value can be "old" and still be replayed.

**Conceptual Example:** Think of a ReplaySubject like a DVR. It records the last few segments of a live broadcast, so if you tune in late, you can immediately watch the last few minutes of content.

```typescript
import { ReplaySubject } from "rxjs";

// Buffer size of 2: will store and replay the last 2 values
const myReplaySubject = new ReplaySubject<number>(2);

myReplaySubject.next(1); // Stored
myReplaySubject.next(2); // Stored
myReplaySubject.next(3); // Stored, 1 is removed (oldest)

myReplaySubject.subscribe((value) => {
  console.log(`Subscriber 1: ${value}`);
}); // Subscriber 1 immediately receives '2', '3'

myReplaySubject.next(4); // Subscriber 1 receives '4'

/* Output:
Subscriber 1: 2
Subscriber 1: 3
Subscriber 1: 4
*/
```

---

## 4\. AsyncSubject

An `AsyncSubject` is a specialized Subject that only emits the **last value** emitted to its subscribers, and **only when the Observable completes**.

| Feature             | Description                                                                                                                                                                                 |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Initial Value**   | **None**.                                                                                                                                                                                   |
| **New Subscribers** | Receive **only the last value** that was emitted, and _only_ after the `.complete()` method is called. If `.complete()` is not called, no value is ever emitted.                            |
| **Primary Use**     | When you are interested in the final result of an asynchronous operation, like the single successful response from an API call that should only be sent once the entire stream is finished. |

**Conceptual Example:** Think of an AsyncSubject like a project that only announces its result on the final completion ceremony. All the intermediate progress reports are ignored; only the final successful outcome matters.

```typescript
import { AsyncSubject } from "rxjs";

const myAsyncSubject = new AsyncSubject<number>();

myAsyncSubject.subscribe((value) => {
  console.log(`Subscriber 1: ${value}`);
});

myAsyncSubject.next(1); // Ignored
myAsyncSubject.next(2); // Ignored
myAsyncSubject.next(3); // Last value stored

// Value '3' is only emitted when complete() is called.
myAsyncSubject.complete(); // Subscriber 1 receives '3'

/* Output:
Subscriber 1: 3
*/
```

---

## Summary Table

| Type                | Initial Value Required? | New Subscribers Receive...                         | Key Use Case                                          |
| :------------------ | :---------------------- | :------------------------------------------------- | :---------------------------------------------------- |
| **Subject**         | No                      | Values **after** subscription                      | Basic event broadcasting/component communication.     |
| **BehaviorSubject** | **Yes**                 | The **last** value (or initial value) immediately. | State management (e.g., user profile, settings).      |
| **ReplaySubject**   | No                      | A **buffer of past values** immediately.           | Logging, catching up on recent data history.          |
| **AsyncSubject**    | No                      | **Only the last value** upon `complete()`.         | Getting the final result of a single-value operation. |
