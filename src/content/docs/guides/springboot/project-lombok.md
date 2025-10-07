---
title: Project Lombok
slug: guides/spring-boot/project-lombok
description: Project Lombok
sidebar:
  order: 5
---

**Project Lombok - Complete Guide**

## What is Project Lombok?

Project Lombok is a Java library that automatically plugs into your editor and build tools, spicing up your Java code. It helps you eliminate boilerplate code like getters, setters, constructors, equals, hashCode, toString methods, and more through annotations.

## 1. Setup and Installation

### Maven Dependency

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.30</version>
    <scope>provided</scope>
</dependency>
```

### Gradle Dependency

```gradle
dependencies {
    compileOnly 'org.projectlombok:lombok:1.18.30'
    annotationProcessor 'org.projectlombok:lombok:1.18.30'
}
```

### IDE Setup

**IntelliJ IDEA:**

1. Install "Lombok" plugin from Marketplace
2. Enable annotation processing:
   - Settings → Build → Compiler → Annotation Processors → Enable annotation processing

**Eclipse:**

1. Download lombok.jar
2. Run: `java -jar lombok.jar`
3. Follow the installation wizard

## 2. Core Annotations

### @Getter and @Setter

```java
import lombok.Getter;
import lombok.Setter;

public class User {
    @Getter @Setter
    private String username;

    @Getter @Setter
    private String email;

    @Setter(AccessLevel.PROTECTED)
    private String password;

    @Getter(AccessLevel.PUBLIC)
    private final String userId = "generated-id";
}

// Without Lombok
class UserWithoutLombok {
    private String username;
    private String email;
    private String password;
    private final String userId = "generated-id";

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    protected void setPassword(String password) { this.password = password; }
    public String getUserId() { return userId; }
}
```

### @ToString

```java
import lombok.ToString;

@ToString
public class Product {
    private String name;
    private double price;
    private String category;

    @ToString.Exclude
    private String secretCode;

    @ToString.Include(name = "formattedPrice")
    private String getFormattedPrice() {
        return "$" + price;
    }
}

// Usage
Product product = new Product();
product.setName("Laptop");
product.setPrice(999.99);
product.setCategory("Electronics");
System.out.println(product);
// Output: Product(name=Laptop, price=999.99, category=Electronics, formattedPrice=$999.99)
```

### @EqualsAndHashCode

```java
import lombok.EqualsAndHashCode;

@EqualsAndHashCode
public class Employee {
    private String employeeId;
    private String name;

    @EqualsAndHashCode.Exclude
    private String temporaryCode;
}

// Equivalent to:
class EmployeeWithoutLombok {
    private String employeeId;
    private String name;
    private String temporaryCode;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EmployeeWithoutLombok that = (EmployeeWithoutLombok) o;
        return Objects.equals(employeeId, that.employeeId) &&
               Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(employeeId, name);
    }
}
```

### @NoArgsConstructor, @RequiredArgsConstructor, @AllArgsConstructor

```java
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
public class Person {
    @NonNull
    private String name;

    private int age;

    private final String country = "USA";
}

// Usage examples:
Person p1 = new Person();              // NoArgsConstructor
Person p2 = new Person("John", 25);    // AllArgsConstructor
Person p3 = new Person("Jane");        // RequiredArgsConstructor (only @NonNull fields)
```

### @Data

**The @Data annotation is a convenient shortcut that bundles:**

- @Getter
- @Setter
- @ToString
- @EqualsAndHashCode
- @RequiredArgsConstructor

```java
import lombok.Data;

@Data
public class Student {
    private final String studentId;
    private String name;
    private int age;
    private String email;
}

// Equivalent to:
class StudentWithoutLombok {
    private final String studentId;
    private String name;
    private int age;
    private String email;

    public StudentWithoutLombok(String studentId) {
        this.studentId = studentId;
    }

    // Getters and setters for all non-final fields
    // equals(), hashCode(), toString() methods
}
```

### @Builder

```java
import lombok.Builder;
import lombok.Singular;
import java.util.List;

@Builder
public class Order {
    private String orderId;
    private String customerName;
    private double totalAmount;

    @Singular
    private List<String> items;

    @Builder.Default
    private String status = "PENDING";
}

// Usage:
Order order = Order.builder()
    .orderId("ORD123")
    .customerName("John Doe")
    .totalAmount(199.99)
    .item("Laptop")
    .item("Mouse")
    .item("Keyboard")
    .build();

// Custom builder method
@Builder(builderMethodName = "internalBuilder", buildMethodName = "create")
class CustomBuilderExample {
    private String value;

    public static class CustomBuilderExampleBuilder {
        public CustomBuilderExample create() {
            // Custom validation
            if (value == null) {
                throw new IllegalStateException("Value cannot be null");
            }
            return new CustomBuilderExample(this);
        }
    }
}
```

### @Value

**@Value creates immutable classes (similar to @Data but for immutable objects)**

```java
import lombok.Value;
import lombok.With;

@Value
@Builder
public class ImmutableUser {
    String username;
    String email;
    @With
    int age;
}

// Usage:
ImmutableUser user = ImmutableUser.builder()
    .username("john")
    .email("john@example.com")
    .age(25)
    .build();

// Create a new instance with modified age
ImmutableUser olderUser = user.withAge(26);
```

## 3. Advanced Features

### @Slf4j, @Log, etc.

```java
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class LoggingExample {
    public void processData() {
        log.info("Processing started");
        try {
            // business logic
            log.debug("Debug information");
        } catch (Exception e) {
            log.error("Error occurred", e);
        }
    }
}

// Equivalent to:
class LoggingExampleWithoutLombok {
    private static final org.slf4j.Logger log =
        org.slf4j.LoggerFactory.getLogger(LoggingExampleWithoutLombok.class);

    public void processData() {
        log.info("Processing started");
        // ... same code
    }
}
```

### @SneakyThrows

```java
import lombok.SneakyThrows;
import java.io.*;

public class FileProcessor {

    @SneakyThrows(IOException.class)
    public String readFile(String path) {
        try (BufferedReader reader = new BufferedReader(new FileReader(path))) {
            return reader.readLine();
        }
    }

    @SneakyThrows // Throws any exception that occurs
    public void riskyMethod() {
        throw new Exception("This exception is sneaky!");
    }
}

// Equivalent to:
class FileProcessorWithoutLombok {
    public String readFile(String path) {
        try {
            try (BufferedReader reader = new BufferedReader(new FileReader(path))) {
                return reader.readLine();
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
```

### @Synchronized

```java
import lombok.Synchronized;

public class SynchronizedExample {
    private final Object readLock = new Object();

    @Synchronized
    public void method1() {
        // synchronized on 'this'
    }

    @Synchronized("readLock")
    public void method2() {
        // synchronized on readLock object
    }
}

// Equivalent to:
class SynchronizedExampleWithoutLombok {
    private final Object readLock = new Object();

    public void method1() {
        synchronized (this) {
            // method body
        }
    }

    public void method2() {
        synchronized (readLock) {
            // method body
        }
    }
}
```

### @Cleanup

```java
import lombok.Cleanup;
import java.io.*;

public class CleanupExample {
    public void copyFile(String source, String destination) throws IOException {
        @Cleanup InputStream in = new FileInputStream(source);
        @Cleanup OutputStream out = new FileOutputStream(destination);

        byte[] buffer = new byte[1024];
        int length;
        while ((length = in.read(buffer)) != -1) {
            out.write(buffer, 0, length);
        }
    }
}

// Equivalent to:
class CleanupExampleWithoutLombok {
    public void copyFile(String source, String destination) throws IOException {
        InputStream in = new FileInputStream(source);
        try {
            OutputStream out = new FileOutputStream(destination);
            try {
                byte[] buffer = new byte[1024];
                int length;
                while ((length = in.read(buffer)) != -1) {
                    out.write(buffer, 0, length);
                }
            } finally {
                if (out != null) {
                    out.close();
                }
            }
        } finally {
            if (in != null) {
                in.close();
            }
        }
    }
}
```

## 4. Configuration and Customization

### lombok.config

Create a `lombok.config` file in your project root:

```properties
# Global configuration
lombok.anyConstructor.suppressConstructorProperties = true
lombok.addLombokGeneratedAnnotation = true

# Make @Data entities more JPA-friendly
lombok.data.ignoreNull = true

# Logging configuration
lombok.log.fieldName = LOGGER
lombok.log.fieldIsStatic = false

# Warning configuration
lombok.experimental.flagUsage = WARNING
```

### Field Name Constants

```java
import lombok.experimental.FieldNameConstants;

@FieldNameConstants
public class ConstantsExample {
    private String firstName;
    private String lastName;
    private int age;
}

// Usage:
String fieldName = ConstantsExample.Fields.firstName; // "firstName"
```

## 5. Practical Examples

### JPA Entity with Lombok

```java
import lombok.*;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {

    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    // Custom getter
    public String getDisplayName() {
        return username + " (" + email + ")";
    }
}
```

### DTO with Lombok

```java
import lombok.Value;

@Value
@Builder
public class UserDTO {
    String username;
    String email;
    boolean active;
    String displayName;

    public static UserDTO fromEntity(User user) {
        return UserDTO.builder()
            .username(user.getUsername())
            .email(user.getEmail())
            .active(user.isActive())
            .displayName(user.getDisplayName())
            .build();
    }
}
```

### Service Class with Lombok

```java
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    public User createUser(CreateUserRequest request) {
        log.info("Creating user: {}", request.getUsername());

        User user = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .password(request.getPassword())
            .build();

        User savedUser = userRepository.save(user);
        emailService.sendWelcomeEmail(savedUser.getEmail());

        return savedUser;
    }
}
```

## 6. Common Patterns and Best Practices

### Immutable Configuration Classes

```java
@Value
@Builder
@ConfigurationProperties(prefix = "app.database")
public class DatabaseConfig {
    String url;
    String username;
    String password;
    int poolSize;

    @Builder.Default
    boolean sslEnabled = false;

    @Builder.Default
    int timeout = 30;
}
```

### Builder with Validation

```java
@Data
@Builder
public class ValidatedUser {
    @NotBlank
    private String username;

    @Email
    private String email;

    @Min(18)
    private int age;

    public static class ValidatedUserBuilder {
        public ValidatedUser build() {
            ValidatedUser user = new ValidatedUser(this);
            // Custom validation
            if (user.getUsername().length() < 3) {
                throw new IllegalArgumentException("Username must be at least 3 characters");
            }
            return user;
        }
    }
}
```

### Record-like Classes (Pre-Java 16)

```java
@Value
@Builder
@AllArgsConstructor
public class Point {
    int x;
    int y;

    public Point withX(int newX) {
        return new Point(newX, this.y);
    }

    public Point withY(int newY) {
        return new Point(this.x, newY);
    }
}
```

## 7. Testing with Lombok

### Test Classes

```java
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@Slf4j
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Test
    void shouldCreateUserSuccessfully() {
        // Given
        CreateUserRequest request = CreateUserRequest.builder()
            .username("testuser")
            .email("test@example.com")
            .password("password")
            .build();

        log.info("Testing user creation with: {}", request);

        // When & Then
        // ... test implementation
    }
}
```

## 8. Common Pitfalls and Solutions

### Circular References in @ToString

```java
// Problematic:
@Data
class Department {
    private String name;
    private List<Employee> employees;
}

@Data
class Employee {
    private String name;
    private Department department; // Circular reference!
}

// Solution:
@Data
class Department {
    private String name;

    @ToString.Exclude
    private List<Employee> employees;
}

@Data
class Employee {
    private String name;

    @ToString.Exclude
    private Department department;
}
```

### Inheritance Issues

```java
// Base class
@Data
class BaseEntity {
    private Long id;
    private LocalDateTime createdAt;
}

// Child class - PROBLEMATIC
@Data
class User extends BaseEntity {
    private String username;
    // Missing BaseEntity fields in equals/hashCode/toString!
}

// Solution:
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
class User extends BaseEntity {
    private String username;
}
```

## 9. Lombok with Spring Boot

### Complete Spring Boot Example

```java
// Entity
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private BigDecimal price;

    @Builder.Default
    private Boolean active = true;
}

// Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}

// Service
@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {
    private final ProductRepository productRepository;

    public Product createProduct(ProductDTO productDTO) {
        log.info("Creating product: {}", productDTO.getName());

        Product product = Product.builder()
            .name(productDTO.getName())
            .description(productDTO.getDescription())
            .price(productDTO.getPrice())
            .build();

        return productRepository.save(product);
    }

    public ProductDTO toDTO(Product product) {
        return ProductDTO.builder()
            .id(product.getId())
            .name(product.getName())
            .description(product.getDescription())
            .price(product.getPrice())
            .active(product.getActive())
            .build();
    }
}

// DTO
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private Long id;

    @NotBlank
    private String name;

    private String description;

    @Positive
    private BigDecimal price;

    private Boolean active;
}

// Controller
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Slf4j
public class ProductController {
    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        Product product = productService.createProduct(productDTO);
        return ResponseEntity.ok(productService.toDTO(product));
    }
}
```

## 10. Migration Tips

### Before Lombok

```java
public class User {
    private String name;
    private String email;
    private int age;

    public User() {}

    public User(String name, String email, int age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }

    // 20+ lines of boilerplate...
}
```

### After Lombok

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String name;
    private String email;
    private int age;
}
```

## Benefits of Using Lombok

1. **Reduced Boilerplate**: 50-80% less code
2. **Improved Readability**: Focus on business logic
3. **Fewer Bugs**: Auto-generated methods are reliable
4. **Easy Refactoring**: Change fields, methods auto-update
5. **Better Maintenance**: Consistent code generation

## When NOT to Use Lombok

1. **Library Development**: Forces dependency on users
2. **Complex Business Logic**: Manual implementation might be better
3. **Team Resistance**: If team prefers explicit code
4. **Annotation Overload**: Too many annotations can reduce readability
