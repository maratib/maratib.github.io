---
title: Immutables with Reactor
slug: guides/springboot/reactor/immutables-with-reactor
description: Immutables with Reactor
sidebar:
  order: 0
---

## Why Immutables + Reactor is a Powerful Combination

### The Philosophical Alignment

**Reactor** promotes a functional, declarative programming style where data flows through a pipeline of transformations. **Immutables** ensures that the data flowing through this pipeline cannot be unexpectedly modified, making the entire system more predictable and thread-safe.

## Deep Dive with Practical Examples

### 1. Basic Setup and Configuration

First, add Immutables to your `pom.xml`:

```xml
<dependency>
    <groupId>org.immutables</groupId>
    <artifactId>value</artifactId>
    <version>2.9.3</version>
    <scope>provided</scope>
</dependency>
```

### 2. Core Immutables Patterns for Reactive Systems

#### A. Simple Data Transfer Objects (DTOs)

```java
@Value.Immutable
@Value.Style(
    // Generate builder method names like 'userId()' instead of 'setUserId()'
    typeImmutable = "Immutable*",
    // Prefer toList() for collections instead of copyOf()
    jdkOnly = true
)
public interface UserDTO {
    Long userId();
    String username();
    String email();
    @Value.Default
    default boolean active() { return true; }

    // Static factory method for Reactor compatibility
    static ImmutableUserDTO of(Long userId, String username, String email) {
        return ImmutableUserDTO.builder()
            .userId(userId)
            .username(username)
            .email(email)
            .build();
    }
}
```

#### B. Complex Domain Models with Validation

```java
@Value.Immutable
public interface Product {
    @Value.Parameter // For compact constructor-style creation
    String productId();

    String name();

    @Value.Check
    default Product validatePrice() {
        if (price().doubleValue() < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
        return this; // 'this' is actually the ImmutableProduct instance
    }

    BigDecimal price();
    Set<String> categories();

    // Reactor-friendly creation method
    static Mono<ImmutableProduct> createValidated(String id, String name, BigDecimal price) {
        return Mono.fromCallable(() ->
                ImmutableProduct.of(id, name, price)
            ).onErrorMap(IllegalArgumentException.class, e ->
                new ValidationException("Product validation failed", e)
            );
    }
}
```

### 3. Reactive Service Layer with Immutables

```java
@Service
public class UserService {
    private final ReactiveUserRepository userRepository;
    private final EmailService emailService;

    public UserService(ReactiveUserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    // REACTIVE PATTERN 1: Transformation Pipeline
    public Mono<ImmutableUserProfile> getUserProfile(Long userId) {
        return userRepository.findById(userId)
            .map(this::toDomainModel)          // Convert to immutable domain model
            .flatMap(this::enrichWithStats)    // Async enrichment
            .map(this::toProfileDTO);          // Final transformation
    }

    // REACTIVE PATTERN 2: Bulk Processing with Backpressure
    public Flux<ImmutableUserDTO> getActiveUsers(Set<Long> userIds) {
        return Flux.fromIterable(userIds)
            .parallel()                        // Process in parallel
            .runOn(Schedulers.parallel())
            .flatMap(userRepository::findById)
            .filter(user -> user.active())     // Filter before mapping to immutable
            .map(this::toDTO)                  // Convert to immutable DTO
            .ordered((u1, u2) -> u1.userId().compareTo(u2.userId())); // Maintain order
    }

    // REACTIVE PATTERN 3: Conditional Processing
    public Mono<ImmutableUserResponse> updateUser(Long userId, ImmutableUserUpdate update) {
        return userRepository.findById(userId)
            .flatMap(existingUser -> {
                // Create new immutable instance with updates
                ImmutableUser updatedUser = applyUpdate(existingUser, update);

                return userRepository.save(updatedUser)
                    .flatMap(savedUser -> {
                        if (shouldSendNotification(update, existingUser)) {
                            return sendNotification(savedUser)
                                .thenReturn(toResponse(savedUser, "Notification sent"));
                        }
                        return Mono.just(toResponse(savedUser, "Updated without notification"));
                    });
            })
            .switchIfEmpty(Mono.error(new UserNotFoundException(userId)));
    }

    private ImmutableUser applyUpdate(ImmutableUser existing, ImmutableUserUpdate update) {
        return ImmutableUser.builder()
            .from(existing)  // Copy all existing values
            .username(update.username().orElse(existing.username()))
            .email(update.email().orElse(existing.email()))
            .build();
    }

    // Conversion helpers that return immutable instances
    private ImmutableUserProfile toProfileDTO(ImmutableUser user) {
        return ImmutableUserProfile.builder()
            .userId(user.id())
            .username(user.username())
            .joinDate(user.createdAt())
            .build();
    }
}
```

### 4. Advanced Patterns: Reactive Caching with Immutables

```java
@Component
public class UserCacheService {
    private final Cache<Long, ImmutableUserProfile> userCache;
    private final ReactiveUserRepository userRepository;

    public UserCacheService(ReactiveUserRepository userRepository) {
        this.userCache = Caffeine.newBuilder()
            .maximumSize(10_000)
            .expireAfterWrite(Duration.ofHours(1))
            .build();
        this.userRepository = userRepository;
    }

    // THREAD-SAFE CACHE PATTERN: Immutables makes this safe
    public Mono<ImmutableUserProfile> getCachedUserProfile(Long userId) {
        // Safe to check cache from any thread
        ImmutableUserProfile cached = userCache.getIfPresent(userId);
        if (cached != null) {
            return Mono.just(cached);
        }

        return userRepository.findById(userId)
            .map(this::toProfileDTO)
            .doOnNext(profile -> {
                // Safe to cache because object is immutable
                userCache.put(userId, profile);
            });
    }
}
```

### 5. Error Handling and Validation in Reactive Chains

```java
@Value.Immutable
public interface ValidationResult {
    boolean valid();
    Optional<String> errorMessage();

    // Helper methods for Reactor integration
    default Mono<ValidationResult> toMono() {
        return valid() ? Mono.just(this) : Mono.error(new ValidationException(errorMessage().orElse("Invalid")));
    }

    static ValidationResult valid() {
        return ImmutableValidationResult.builder()
            .valid(true)
            .build();
    }

    static ValidationResult invalid(String message) {
        return ImmutableValidationResult.builder()
            .valid(false)
            .errorMessage(message)
            .build();
    }
}

@Service
public class UserRegistrationService {

    public Mono<ImmutableUser> registerUser(ImmutableUserRegistration request) {
        return validateUserRequest(request)
            .flatMap(validation -> validation.toMono())  // Convert to Mono, error if invalid
            .then(validateEmailUniqueness(request.email()))
            .then(createUserEntity(request))
            .flatMap(userRepository::save)
            .doOnNext(user -> sendWelcomeEmail(user).subscribe()); // Fire and forget
    }

    private Mono<ValidationResult> validateUserRequest(ImmutableUserRegistration request) {
        return Mono.fromCallable(() -> {
            if (request.username().length() < 3) {
                return ValidationResult.invalid("Username too short");
            }
            if (!isValidEmail(request.email())) {
                return ValidationResult.invalid("Invalid email format");
            }
            return ValidationResult.valid();
        });
    }
}
```

### 6. Testing Patterns

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private ReactiveUserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void getUserProfile_returnsImmutableProfile() {
        // Given
        Long userId = 1L;
        ImmutableUser mockUser = ImmutableUser.builder()
            .id(userId)
            .username("testuser")
            .email("test@example.com")
            .createdAt(Instant.now())
            .build();

        when(userRepository.findById(userId)).thenReturn(Mono.just(mockUser));

        // When
        StepVerifier.create(userService.getUserProfile(userId))
            .expectNextMatches(profile ->
                profile instanceof ImmutableUserProfile &&
                profile.userId().equals(userId) &&
                profile.username().equals("testuser")
            )
            .verifyComplete();

        // Thread-safety verification
        ImmutableUserProfile result = userService.getUserProfile(userId).block();
        assertThrows(UnsupportedOperationException.class,
            () -> result.categories().add("new-category")); // Collections are immutable too!
    }
}
```

## Key Benefits and Reasoning

### 1. **Thread Safety by Design**

```java
// This is SAFE with Immutables
Flux.range(1, 1000)
    .parallel(10)
    .flatMap(i -> processUser(immutableUser)) // Can be called from any thread
    .subscribe();
```

### 2. **Predictable State in Async Operations**

```java
public Mono<ImmutableOrder> processOrder(ImmutableOrder order) {
    return validateOrder(order)
        .delayElement(Duration.ofSeconds(1)) // Some async operation
        .map(validated -> {
            // 'order' cannot be modified by other threads during the delay
            return applyBusinessRules(validated);
        });
}
```

### 3. **Functional Transformation Clarity**

```java
public Flux<ImmutableUserDTO> transformUsers(Flux<ImmutableUser> users) {
    return users
        .map(user -> ImmutableUserDTO.builder()
            .from(user)  // Clear transformation
            .displayName(user.firstName() + " " + user.lastName())
            .build())
        .map(this::addCalculatedFields);
}
```

### 4. **Debugging and Maintenance**

```java
// Each step produces a new immutable instance - easy to debug
return fetchUserData(userId)
    .map(data -> addTimestamps(data))         // New immutable instance
    .map(data -> applyFormatting(data))       // New immutable instance
    .map(data -> enrichWithExternalData(data))// New immutable instance
    .doOnNext(finalData -> log.debug("Final: {}", finalData));
```

## Best Practices

1. **Use builders over constructors** for complex objects in reactive flows
2. **Leverage `@Value.Default`** for optional fields with sensible defaults
3. **Implement `@Value.Check`** for validation logic that's synchronous and fast
4. **Use static factory methods** for Reactor-compatible object creation
5. **Prefer `copyOf()` and `from()`** for transformations in reactive pipelines
