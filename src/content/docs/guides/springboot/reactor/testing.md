---
title: Testing Reactor
slug: guides/springboot/reactor/testing
description: Testing Reactor
sidebar:
  order: 8
---

Specialized testing utilities for verifying reactive streams.

### StepVerifier Basics

```java
@Test
void testFlux() {
    Flux<String> flux = Flux.just("foo", "bar");

    StepVerifier.create(flux)
        .expectNext("foo")          // Verify next element
        .expectNextCount(1)         // Verify count of elements
        .expectComplete()           // Verify completion
        .verify(Duration.ofSeconds(5));
}

@Test
void testError() {
    Flux<String> flux = Flux.error(new RuntimeException());

    StepVerifier.create(flux)
        .expectError(RuntimeException.class)
        .verify();
}
```

### Advanced Testing

```java
// Virtual time testing
@Test
void testVirtualTime() {
    StepVerifier.withVirtualTime(() ->
        Flux.interval(Duration.ofHours(1)).take(2)
    )
    .expectSubscription()
    .thenAwait(Duration.ofHours(2)) // Skip 2 hours instantly
    .expectNext(0L, 1L)
    .verifyComplete();
}

// Context testing
@Test
void testContext() {
    Mono<String> mono = Mono.deferContextual(ctx ->
        Mono.just("Hello " + ctx.get("user"))
    );

    StepVerifier.create(mono.contextWrite(ctx -> ctx.put("user", "Alice")))
        .expectNext("Hello Alice")
        .verifyComplete();
}
```

### Test Support Utilities

```java
// TestPublisher for controlled testing
TestPublisher<String> testPublisher = TestPublisher.create();
Flux<String> testFlux = testPublisher.flux();

StepVerifier.create(testFlux)
    .then(() -> testPublisher.next("a", "b"))
    .expectNext("a", "b")
    .then(() -> testPublisher.error(new RuntimeException()))
    .expectError();
```
