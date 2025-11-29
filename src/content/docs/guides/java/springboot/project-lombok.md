---
title: Project Lombok
description: Project Lombok
---

Lombok is a Java library that automatically plugs into your editor and build tools, spicing up your Java code by generating boilerplate code through annotations

## Introduction to Lombok

### What is Lombok?

- **Java library** that reduces boilerplate code through annotations
- **Automatically generates** getters, setters, constructors, equals, hashCode, toString
- **Plugins available** for all major IDEs (IntelliJ, Eclipse, VS Code)

### Why Use Lombok in Spring Boot 3?

- **Reduces boilerplate** by 50-80% in typical Spring Boot applications
- **Improves readability** by keeping classes clean and focused
- **Maintains clean domain models** without cluttering business logic
- **Reduces maintenance** overhead and human error

## Setup & Configuration

### 1. Maven Configuration - _Add Lombok dependency to your project_

<details>
  <summary>Add Lombok dependency to your project</summary>
  
```xml  
<!-- pom.xml -->
<dependencies>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <excludes>
                    <exclude>
                        <groupId>org.projectlombok</groupId>
                        <artifactId>lombok</artifactId>
                    </exclude>
                </excludes>
            </configuration>
        </plugin>
    </plugins>
</build>
```
</details>

### 2. IDE Setup - _Configure your development environment_

- **Install Lombok plugin** for your IDE
- **Enable annotation processing** in compiler settings
- **For IntelliJ**: Settings → Build → Compiler → Annotation Processors → Enable
- **VSCode:** [Install Lombok extension](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-lombok)

### 3. lombok.config - _Project-specific Lombok configuration_

```properties
# Root directory lombok.config
config.stopbubbling = true
lombok.anyConstructor.addConstructorProperties = true
lombok.addLombokGeneratedAnnotation = true
lombok.experimental.flagUsage = WARNING
lombok.accessors.chain = true
```

## Core Annotations

### 1. @Data - _All-in-one annotation for POJOs_

- **Generates**: getters, setters, toString, equals, hashCode, required constructor
- **Use case**: Simple data classes and entities

```java
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
}
```

### 2. @Getter/@Setter - _Fine-grained access control_

- **Generates**: Only getters or setters as specified
- **Use case**: When you need partial code generation

```java
@Entity
@Getter
@Setter
public class Product {
    @Id
    private Long id;
    private String name;
    private BigDecimal price;
}
```

### 3. @Builder - _Implements Builder pattern_

- **Generates**: Builder class for fluent object creation
- **Use case**: Complex object construction with many parameters

```java
@Service
@RequiredArgsConstructor
public class ProductService {
    public Product createProduct() {
        return Product.builder()
            .name("Laptop")
            .price(999.99)
            .build();
    }
}
```

### 4. @AllArgsConstructor & @NoArgsConstructor - _Constructor generation_

- **@AllArgsConstructor**: Creates constructor with all fields
- **@NoArgsConstructor**: Creates no-argument constructor
- **Use case**: JPA entities, DTOs, configuration classes

```java
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Category {
    @Id
    private Long id;
    private String name;
}
```

### 5. @RequiredArgsConstructor - _Constructor injection for Spring_

- **Generates**: Constructor with final fields
- **Use case**: Spring service classes with dependency injection

```java
@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final PaymentService paymentService;
    // Constructor automatically generated
}
```

### 6. @Value - _Immutable data classes_

- **Generates**: All fields are private final, getters, equals, hashCode, toString
- **Use case**: Immutable DTOs, configuration objects, value objects

```java
@Value
@Builder
public class UserDto {
    Long id;
    String email;
    String fullName;
}
```

## Advanced Features

### 1. @With - _Immutable updates_

- **Generates**: `withFieldName(value)` methods for immutable updates
- **Use case**: Functional programming style, configuration updates

```java
@Value
@Builder
@With
public class ImmutableConfig {
    String apiKey;
    int timeout;
}

// Usage
ImmutableConfig config = new ImmutableConfig("key", 30);
ImmutableConfig updated = config.withTimeout(60);
```

### 2. @Singular - _Collection builders_

- **Generates**: Builder methods for adding single elements to collections
- **Use case**: Building objects with collections in a fluent way

```java
@Data
@Builder
public class ShoppingCart {
    private Long id;

    @Singular
    private List<CartItem> items;

    @Singular("tag")
    private Set<String> tags;
}
```

### 3. @Slf4j, @CommonsLog, @Log4j2 - _Logger injection_

- **Generates**: Logger field automatically
- **Use case**: Any class that needs logging

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    public void processPayment() {
        log.info("Processing payment");
        // Business logic
    }
}
```

### 4. Customizing @ToString - _Control toString output_

- **Controls**: Which fields to include in toString
- **Use case**: Excluding sensitive data, circular references

```java
@Entity
@Data
@ToString(onlyExplicitlyIncluded = true)
public class Employee {
    @Id
    @ToString.Include
    private Long id;

    private String ssn; // Sensitive - excluded automatically
}
```

### 5. @EqualsAndHashCode - _Control equality comparison_

- **Controls**: Which fields to use in equals and hashCode
- **Use case**: Business key equality, excluding certain fields

```java
@Entity
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Product {
    @Id
    @EqualsAndHashCode.Include
    private Long id;

    @EqualsAndHashCode.Include
    private String sku; // Business key
}
```

## Spring Boot Integration

### 1. Configuration Properties - _Type-safe configuration_

- **Combines**: Lombok with Spring's @ConfigurationProperties
- **Use case**: Application configuration classes

```java
@ConfigurationProperties(prefix = "app.security")
@Data
@Validated
public class SecurityConfigProperties {
    @NotBlank
    private String secretKey;

    @Min(1)
    private int tokenExpirationMinutes = 30;
}
```

### 2. JPA Entities with Lombok - _Clean entity definitions_

- **Combines**: Lombok with JPA annotations
- **Use case**: Database entities with minimal boilerplate

```java
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    private Long id;

    @OneToMany(mappedBy = "order")
    @ToString.Exclude
    private List<OrderItem> items;
}
```

### 3. DTO Pattern with Lombok - _Data transfer objects_

- **Separates**: API layer from persistence layer
- **Use case**: Request/response objects in REST APIs

```java
// Request DTO
@Data
@Builder
public class CreateUserRequest {
    @NotBlank
    private String email;
    private String firstName;
    private String lastName;
}

// Response DTO
@Value
@Builder
public class UserResponse {
    Long id;
    String email;
    String fullName;
}
```

### 4. Service Layer with Constructor Injection - _Dependency injection_

- **Uses**: @RequiredArgsConstructor for automatic constructor injection
- **Use case**: Spring service classes

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;

    // No explicit constructor needed
    public User createUser(User user) {
        return userRepository.save(user);
    }
}
```

### 5. Controller Layer - _REST endpoint definitions_

- **Combines**: Lombok with Spring MVC annotations
- **Use case**: REST controller classes

```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping
    public UserResponse createUser(@RequestBody CreateUserRequest request) {
        return userService.createUser(request);
    }
}
```

## Best Practices

### 1. Entity Best Practices - _JPA and Lombok compatibility_

- **Always include**: @NoArgsConstructor for JPA compliance
- **Exclude**: Bidirectional relationships from toString and equals
- **Use**: @Builder for complex entity creation

```java
@Entity
@Data
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Product {
    @Id
    @EqualsAndHashCode.Include
    private Long id;

    @OneToMany(mappedBy = "product")
    @ToString.Exclude
    private List<OrderItem> orderItems;
}
```

### 2. Builder Pattern Best Practices - _Effective object building_

- **Use**: @Builder(toBuilder = true) for immutable updates
- **Add**: Custom builder methods for common scenarios
- **Validate**: In custom build() methods

```java
@Value
@Builder(toBuilder = true)
public class ApiResponse<T> {
    boolean success;
    String message;
    T data;

    // Predefined success response
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
            .success(true)
            .message("Success")
            .data(data)
            .build();
    }
}
```

### 3. Configuration Best Practices - _Application configuration_

- **Combine**: @ConfigurationProperties with @Data
- **Use**: Nested classes for complex configurations
- **Validate**: Configuration with Bean Validation

```java
@ConfigurationProperties(prefix = "app.database")
@Validated
@Data
public class DatabaseProperties {
    @NotBlank
    private String url;

    @Valid
    private Pool pool = new Pool();

    @Data
    public static class Pool {
        @Min(1)
        private int maxSize = 10;
    }
}
```

### 4. Testing with Lombok - _Clean test code_

- **Use**: Builders for test data creation
- **Leverage**: @Builder in test fixtures
- **Keep**: Test classes clean and readable

```java
@Data
@Builder
class TestUser {
    private Long id;
    private String username;
}

class UserServiceTest {
    @Test
    void shouldCreateUser() {
        TestUser testUser = TestUser.builder()
            .id(1L)
            .username("testuser")
            .build();

        // Test logic
    }
}
```

## Common Pitfalls

### 1. JPA and Lombok Compatibility - _Avoid JPA issues_

- **Problem**: Missing proper constructors for JPA
- **Solution**: Always include @NoArgsConstructor(access = AccessLevel.PROTECTED)

```java
// ✅ Correct
@Entity
@Data
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class CorrectEntity {
    @Id
    private Long id;
}
```

### 2. Circular Dependency in toString() - _Avoid StackOverflowError_

- **Problem**: Bidirectional relationships cause infinite recursion
- **Solution**: Use @ToString.Exclude on relationship fields

```java
@Entity
@Data
@ToString(onlyExplicitlyIncluded = true)
public class Order {
    @Id
    @ToString.Include
    private Long id;

    @OneToMany(mappedBy = "order")
    @ToString.Exclude
    private List<OrderItem> items;
}
```

### 3. Immutable Objects with @With - _Safe object updates_

- **Use case**: Functional updates without modifying original object
- **Benefit**: Thread-safe and predictable behavior

```java
@Value
@Builder
@With
public class Configuration {
    String host;
    int port;

    public Configuration withHttpsPort() {
        return this.withPort(443);
    }
}
```

### 4. Handling Optional Fields in Builders - _Flexible object creation_

- **Use**: @Builder.Default for default values
- **Add**: Custom validation in builder

```java
@Data
@Builder
public class ProductFilter {
    @Builder.Default
    private Optional<String> category = Optional.empty();

    public static class ProductFilterBuilder {
        public ProductFilter build() {
            // Custom validation
            return new ProductFilter(category);
        }
    }
}
```

## Performance Considerations

### 1. Lazy Getter - _Optimize expensive computations_

- **Use case**: Fields that require heavy computation
- **Benefit**: Computation happens only once when first accessed

```java
@Data
public class ExpensiveResource {
    @Getter(lazy = true)
    private final String expensiveData = computeExpensively();
}
```

### 2. @EqualsAndHashCode Cache - _Optimize frequent comparisons_

- **Use case**: Objects with expensive equality computation
- **Benefit**: Caches hashCode for better performance

```java
@EqualsAndHashCode(cacheStrategy = EqualsAndHashCode.CacheStrategy.LAZY)
@Data
public class LargeObject {
    private String field1;
    // ... many fields
}
```

## Migration Strategy

### From Traditional Java to Lombok - _Gradual adoption_

- **Start with**: New classes using Lombok
- **Refactor**: Existing classes gradually
- **Benefits**: Immediate boilerplate reduction

```java
// Before: 50+ lines of boilerplate
public class TraditionalUser {
    private Long id;
    private String name;
    // ... getters, setters, constructors, equals, hashCode, toString
}

// After: 5 lines with same functionality
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModernUser {
    private Long id;
    private String name;
}
```

## Conclusion

### Key Takeaways:

- **Lombok dramatically reduces** boilerplate code in Spring Boot applications
- **Proper configuration** ensures compatibility with Spring Boot and JPA
- **Best practices** prevent common issues and improve code quality
- **Advanced features** provide powerful tools for complex scenarios
- **Gradual migration** allows smooth adoption in existing projects

### Recommended Approach:

1. **Start with** @Data and @Builder for new entities
2. **Use** @RequiredArgsConstructor for Spring services
3. **Apply** @Value for immutable DTOs
4. **Configure** lombok.config for project consistency
5. **Follow** best practices to avoid common pitfalls
