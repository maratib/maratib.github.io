---
title: Spring WebFlux Integration
slug: guides/springboot/reactor/webflux
description: Spring WebFlux Integration
sidebar:
  order: 9
---

Spring's reactive web framework built on Reactor.

### Reactive Controllers

```java
@RestController
public class UserController {

    @GetMapping("/users/{id}")
    public Mono<User> getUser(@PathVariable String id) {
        return userService.findById(id);
    }

    @GetMapping("/users")
    public Flux<User> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return userService.findAll(page, size);
    }

    @PostMapping("/users")
    public Mono<User> createUser(@RequestBody @Valid Mono<User> user) {
        return user.flatMap(userService::save);
    }
}
```

### WebClient (Reactive REST Client)

```java
@Service
public class ApiService {
    private final WebClient webClient;

    public ApiService(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("https://api.example.com").build();
    }

    public Flux<User> fetchUsers() {
        return webClient.get()
            .uri("/users")
            .retrieve()
            .bodyToFlux(User.class)
            .timeout(Duration.ofSeconds(5))
            .retryWhen(Retry.backoff(3, Duration.ofSeconds(1)));
    }

    public Mono<User> createUser(User user) {
        return webClient.post()
            .uri("/users")
            .bodyValue(user)
            .retrieve()
            .bodyToMono(User.class);
    }
}
```

### Reactive Security

```java
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityFilterChain(ServerHttpSecurity http) {
        return http
            .authorizeExchange(exchanges -> exchanges
                .pathMatchers("/public/**").permitAll()
                .anyExchange().authenticated()
            )
            .httpBasic(withDefaults())
            .formLogin(withDefaults())
            .build();
    }
}
```

---

## 10. Advanced Patterns

### Caching with Reactor

```java
@Component
public class UserService {
    private final Cache<String, User> cache =
        Caffeine.newBuilder().expireAfterWrite(10, TimeUnit.MINUTES).build();

    public Mono<User> getUserWithCache(String id) {
        return Mono.fromCallable(() -> cache.getIfPresent(id))
            .filter(Objects::nonNull)
            .switchIfEmpty(
                userRepository.findById(id)
                    .doOnNext(user -> cache.put(id, user))
            );
    }
}
```

### Circuit Breaker Pattern

```java
@Service
public class ResilientService {
    private final CircuitBreaker circuitBreaker;

    public ResilientService() {
        this.circuitBreaker = CircuitBreaker.ofDefaults("external-service");
    }

    public Flux<Data> getDataWithResilience() {
        return externalService.getData()
            .transformDeferred(CircuitBreakerOperator.of(circuitBreaker))
            .timeout(Duration.ofSeconds(10))
            .retryWhen(Retry.backoff(3, Duration.ofSeconds(1)))
            .onErrorResume(throwable -> getFallbackData());
    }
}
```

### Hot vs Cold Publishers

```java
// Cold publisher (creates new data for each subscriber)
Flux<Integer> cold = Flux.defer(() ->
    Flux.fromIterable(fetchFreshData())); // New data each time

// Hot publisher (shares data among subscribers)
ConnectableFlux<Integer> hot = Flux.interval(Duration.ofSeconds(1))
    .publish(); // Shares among subscribers

hot.connect(); // Start emitting

// Replaying hot publisher
Flux<Integer> replay = hot.autoConnect().replay(10).autoConnect();
```

### Backpressure Strategies

```java
Flux.range(1, 1000)
    .onBackpressureBuffer(100)              // Buffer up to 100 items
    .onBackpressureDrop(dropped -> {        // Drop excess items
        log.warn("Dropped: {}", dropped);
    })
    .onBackpressureLatest()                 // Keep only latest
    .subscribe(new BaseSubscriber<Integer>() {
        @Override
        protected void hookOnSubscribe(Subscription subscription) {
            request(1); // Controlled demand
        }

        @Override
        protected void hookOnNext(Integer value) {
            process(value);
            request(1); // Request next after processing
        }
    });
```

### Metrics and Monitoring

```java
@Configuration
public class MetricsConfig {

    @Bean
    public MicrometerFluxMetrics micrometerFluxMetrics(MeterRegistry registry) {
        return new MicrometerFluxMetrics(registry);
    }
}

// Using metrics
Flux<String> monitoredFlux = dataFlux
    .name("data.processing")
    .tag("source", "kafka")
    .metrics()
    .map(this::processData);
```
