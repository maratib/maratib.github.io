---
title: Publisher
slug: guides/springboot/reactor/publisher
description: Publisher
sidebar:
  order: 3
---

Various ways to create reactive streams from different data sources.

```java
// Mono factories
Mono<String> just = Mono.just("value");
Mono<String> error = Mono.error(new RuntimeException());
Mono<String> defer = Mono.defer(() -> Mono.just(computeValue()));

// Flux factories
Flux<Integer> range = Flux.range(1, 5);
Flux<String> generate = Flux.generate(
    () -> 0, // initial state
    (state, sink) -> {
        sink.next("Value " + state);
        if (state == 10) sink.complete();
        return state + 1;
    }
);
```

### From External Sources

```java
// From futures
Mono<String> fromFuture = Mono.fromFuture(CompletableFuture.supplyAsync(() -> "result"));

// From callable
Mono<String> fromCallable = Mono.fromCallable(() -> blockingOperation());

// From reactive streams
Flux<Integer> fromStream = Flux.fromStream(Stream.of(1, 2, 3));

// Creating from events
Flux<String> eventFlux = Flux.create(sink -> {
    eventListener.setOnData(sink::next);
    eventListener.setOnComplete(sink::complete);
    eventListener.setOnError(sink::error);
});
```

---
