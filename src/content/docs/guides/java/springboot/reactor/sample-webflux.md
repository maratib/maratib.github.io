---
title: WebFlux JPA Project
slug: guides/springboot/reactor/sample-webflux
description: WebFlux JPA Project
sidebar:
  order: 11
---

Spring Boot `WebFlux` with `JPA` and `Testing` Sample

### Project Structure

```
webflux-jpa-demo/
├── src/
│   ├── main/
│   │   ├── java/com/example/demo/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── model/
│   │   │   └── DemoApplication.java
│   │   └── resources/
│   │       └── application.yml
│   └── test/
│       └── java/com/example/demo/
└── pom.xml
```

## 1. Dependencies (pom.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>

    <groupId>com.example</groupId>
    <artifactId>webflux-jpa-demo</artifactId>
    <version>1.0.0</version>

    <properties>
        <java.version>17</java.version>
        <r2dbc-h2.version>1.0.0.RELEASE</r2dbc-h2.version>
    </properties>

    <dependencies>
        <!-- WebFlux -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-webflux</artifactId>
        </dependency>

        <!-- R2DBC (Reactive SQL) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-r2dbc</artifactId>
        </dependency>

        <!-- H2 Database -->
        <dependency>
            <groupId>io.r2dbc</groupId>
            <artifactId>r2dbc-h2</artifactId>
            <version>${r2dbc-h2.version}</version>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>io.projectreactor</groupId>
            <artifactId>reactor-test</artifactId>
            <scope>test</scope>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>
</project>
```

## 2. Configuration (application.yml)

```yaml
spring:
  r2dbc:
    url: r2dbc:h2:mem:///testdb
    username: sa
    password:
  h2:
    console:
      enabled: true
  sql:
    init:
      mode: always
      schema-locations: classpath:schema.sql
      data-locations: classpath:data.sql

logging:
  level:
    com.example.demo: DEBUG
    org.springframework.data.r2dbc: DEBUG
```

## 3. Database Schema (src/main/resources/schema.sql)

```sql
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    age INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 4. Sample Data (src/main/resources/data.sql)

```sql
INSERT INTO users (username, email, age) VALUES
('john_doe', 'john@example.com', 25),
('jane_smith', 'jane@example.com', 30),
('bob_wilson', 'bob@example.com', 35);

INSERT INTO products (name, price, category, in_stock) VALUES
('Laptop', 999.99, 'ELECTRONICS', true),
('Book', 19.99, 'EDUCATION', true),
('Headphones', 149.99, 'ELECTRONICS', false);
```

## 5. Entity Models

### User Entity

```java
package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("users")
public class User {
    @Id
    private Long id;
    private String username;
    private String email;
    private Integer age;
    private LocalDateTime createdAt;

    public User(String username, String email, Integer age) {
        this.username = username;
        this.email = email;
        this.age = age;
        this.createdAt = LocalDateTime.now();
    }
}
```

### Product Entity

```java
package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("products")
public class Product {
    @Id
    private Long id;
    private String name;
    private BigDecimal price;
    private String category;
    private Boolean inStock;
    private LocalDateTime createdAt;

    public Product(String name, BigDecimal price, String category, Boolean inStock) {
        this.name = name;
        this.price = price;
        this.category = category;
        this.inStock = inStock;
        this.createdAt = LocalDateTime.now();
    }
}
```

## 6. Reactive Repositories

### User Repository

```java
package com.example.demo.repository;

import com.example.demo.model.User;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface UserRepository extends ReactiveCrudRepository<User, Long> {

    Mono<User> findByUsername(String username);

    Mono<User> findByEmail(String email);

    Flux<User> findByAgeBetween(int minAge, int maxAge);

    @Query("SELECT * FROM users WHERE age >= :age")
    Flux<User> findUsersOlderThan(int age);

    Mono<Boolean> existsByUsername(String username);

    Mono<Boolean> existsByEmail(String email);
}
```

### Product Repository

```java
package com.example.demo.repository;

import com.example.demo.model.Product;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.math.BigDecimal;

public interface ProductRepository extends ReactiveCrudRepository<Product, Long> {

    Flux<Product> findByCategory(String category);

    Flux<Product> findByInStockTrue();

    Flux<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    @Query("SELECT * FROM products WHERE price <= :maxPrice AND in_stock = true")
    Flux<Product> findAvailableProductsUnderPrice(BigDecimal maxPrice);

    Mono<Long> countByCategory(String category);
}
```

## 7. Service Layer

### User Service

```java
package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public Flux<User> findAll() {
        return userRepository.findAll()
            .delayElements(Duration.ofMillis(100)) // Simulate processing
            .doOnNext(user -> log.info("Found user: {}", user.getUsername()));
    }

    public Mono<User> findById(Long id) {
        return userRepository.findById(id)
            .switchIfEmpty(Mono.error(new RuntimeException("User not found with id: " + id)))
            .doOnSuccess(user -> log.info("Found user by id: {}", id));
    }

    public Mono<User> findByUsername(String username) {
        return userRepository.findByUsername(username)
            .switchIfEmpty(Mono.error(new RuntimeException("User not found: " + username)));
    }

    public Mono<User> createUser(User user) {
        return userRepository.existsByUsername(user.getUsername())
            .flatMap(exists -> {
                if (exists) {
                    return Mono.error(new RuntimeException("Username already exists"));
                }
                return userRepository.existsByEmail(user.getEmail())
                    .flatMap(emailExists -> {
                        if (emailExists) {
                            return Mono.error(new RuntimeException("Email already exists"));
                        }
                        return userRepository.save(user);
                    });
            })
            .doOnSuccess(saved -> log.info("Created user: {}", saved.getUsername()));
    }

    public Mono<User> updateUser(Long id, User user) {
        return userRepository.findById(id)
            .switchIfEmpty(Mono.error(new RuntimeException("User not found")))
            .flatMap(existing -> {
                existing.setUsername(user.getUsername());
                existing.setEmail(user.getEmail());
                existing.setAge(user.getAge());
                return userRepository.save(existing);
            })
            .doOnSuccess(updated -> log.info("Updated user: {}", updated.getUsername()));
    }

    public Mono<Void> deleteUser(Long id) {
        return userRepository.findById(id)
            .switchIfEmpty(Mono.error(new RuntimeException("User not found")))
            .flatMap(userRepository::delete)
            .doOnSuccess(v -> log.info("Deleted user with id: {}", id));
    }

    public Flux<User> findUsersOlderThan(int age) {
        return userRepository.findUsersOlderThan(age)
            .doOnComplete(() -> log.info("Completed finding users older than {}", age));
    }
}
```

### Product Service

```java
package com.example.demo.service;

import com.example.demo.model.Product;
import com.example.demo.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Flux<Product> findAll() {
        return productRepository.findAll();
    }

    public Flux<Product> findAvailableProducts() {
        return productRepository.findByInStockTrue();
    }

    public Flux<Product> findByCategory(String category) {
        return productRepository.findByCategory(category.toUpperCase());
    }

    public Flux<Product> findProductsInPriceRange(BigDecimal min, BigDecimal max) {
        return productRepository.findByPriceBetween(min, max);
    }

    public Mono<Product> findById(Long id) {
        return productRepository.findById(id)
            .switchIfEmpty(Mono.error(new RuntimeException("Product not found")));
    }

    public Mono<Product> createProduct(Product product) {
        return productRepository.save(product);
    }

    public Mono<Product> updateProductStock(Long id, Boolean inStock) {
        return productRepository.findById(id)
            .switchIfEmpty(Mono.error(new RuntimeException("Product not found")))
            .flatMap(product -> {
                product.setInStock(inStock);
                return productRepository.save(product);
            });
    }

    public Mono<Void> deleteProduct(Long id) {
        return productRepository.deleteById(id);
    }
}
```

## 8. Controller Layer

### User Controller

```java
package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public Flux<User> getAllUsers() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<User>> getUserById(@PathVariable Long id) {
        return userService.findById(id)
            .map(ResponseEntity::ok)
            .onErrorResume(error -> Mono.just(ResponseEntity.notFound().build()));
    }

    @GetMapping("/username/{username}")
    public Mono<ResponseEntity<User>> getUserByUsername(@PathVariable String username) {
        return userService.findByUsername(username)
            .map(ResponseEntity::ok)
            .onErrorResume(error -> Mono.just(ResponseEntity.notFound().build()));
    }

    @GetMapping("/age-greater-than/{age}")
    public Flux<User> getUsersOlderThan(@PathVariable int age) {
        return userService.findUsersOlderThan(age);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<ResponseEntity<User>> createUser(@RequestBody User user) {
        return userService.createUser(user)
            .map(ResponseEntity::ok)
            .onErrorResume(error ->
                Mono.just(ResponseEntity.badRequest().build())
            );
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<User>> updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user)
            .map(ResponseEntity::ok)
            .onErrorResume(error ->
                Mono.just(ResponseEntity.notFound().build())
            );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<ResponseEntity<Void>> deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id)
            .then(Mono.just(ResponseEntity.noContent().build()))
            .onErrorResume(error ->
                Mono.just(ResponseEntity.notFound().build())
            );
    }
}
```

### Product Controller

```java
package com.example.demo.controller;

import com.example.demo.model.Product;
import com.example.demo.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public Flux<Product> getAllProducts() {
        return productService.findAll();
    }

    @GetMapping("/available")
    public Flux<Product> getAvailableProducts() {
        return productService.findAvailableProducts();
    }

    @GetMapping("/category/{category}")
    public Flux<Product> getProductsByCategory(@PathVariable String category) {
        return productService.findByCategory(category);
    }

    @GetMapping("/price-range")
    public Flux<Product> getProductsInPriceRange(
            @RequestParam BigDecimal min,
            @RequestParam BigDecimal max) {
        return productService.findProductsInPriceRange(min, max);
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Product>> getProductById(@PathVariable Long id) {
        return productService.findById(id)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mono<ResponseEntity<Product>> createProduct(@RequestBody Product product) {
        return productService.createProduct(product)
            .map(ResponseEntity::ok);
    }

    @PatchMapping("/{id}/stock")
    public Mono<ResponseEntity<Product>> updateProductStock(
            @PathVariable Long id,
            @RequestParam Boolean inStock) {
        return productService.updateProductStock(id, inStock)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteProduct(@PathVariable Long id) {
        return productService.deleteProduct(id)
            .then(Mono.just(ResponseEntity.noContent().build()))
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}
```

## 9. Main Application Class

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

## 10. Comprehensive Testing

### User Service Test

```java
package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User(1L, "testuser", "test@example.com", 25, LocalDateTime.now());
    }

    @Test
    void findAllUsers_ShouldReturnAllUsers() {
        // Given
        when(userRepository.findAll()).thenReturn(Flux.just(testUser));

        // When & Then
        StepVerifier.create(userService.findAll())
            .expectNext(testUser)
            .verifyComplete();
    }

    @Test
    void findById_WhenUserExists_ShouldReturnUser() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Mono.just(testUser));

        // When & Then
        StepVerifier.create(userService.findById(1L))
            .expectNext(testUser)
            .verifyComplete();
    }

    @Test
    void findById_WhenUserNotExists_ShouldThrowError() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Mono.empty());

        // When & Then
        StepVerifier.create(userService.findById(1L))
            .expectError(RuntimeException.class)
            .verify();
    }

    @Test
    void createUser_WhenValidUser_ShouldCreateSuccessfully() {
        // Given
        User newUser = new User("newuser", "new@example.com", 30);
        when(userRepository.existsByUsername(anyString())).thenReturn(Mono.just(false));
        when(userRepository.existsByEmail(anyString())).thenReturn(Mono.just(false));
        when(userRepository.save(any(User.class))).thenReturn(Mono.just(testUser));

        // When & Then
        StepVerifier.create(userService.createUser(newUser))
            .expectNext(testUser)
            .verifyComplete();
    }

    @Test
    void createUser_WhenUsernameExists_ShouldThrowError() {
        // Given
        User newUser = new User("existinguser", "new@example.com", 30);
        when(userRepository.existsByUsername(anyString())).thenReturn(Mono.just(true));

        // When & Then
        StepVerifier.create(userService.createUser(newUser))
            .expectError(RuntimeException.class)
            .verify();
    }
}
```

### Product Controller Test

```java
package com.example.demo.controller;

import com.example.demo.model.Product;
import com.example.demo.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@WebFluxTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private ProductService productService;

    private Product createTestProduct() {
        return new Product(1L, "Test Product", BigDecimal.valueOf(99.99), "TEST", true, null);
    }

    @Test
    void getAllProducts_ShouldReturnProducts() {
        // Given
        Product product = createTestProduct();
        when(productService.findAll()).thenReturn(Flux.just(product));

        // When & Then
        webTestClient.get()
            .uri("/api/products")
            .exchange()
            .expectStatus().isOk()
            .expectBodyList(Product.class)
            .hasSize(1)
            .contains(product);
    }

    @Test
    void getProductById_WhenExists_ShouldReturnProduct() {
        // Given
        Product product = createTestProduct();
        when(productService.findById(1L)).thenReturn(Mono.just(product));

        // When & Then
        webTestClient.get()
            .uri("/api/products/1")
            .exchange()
            .expectStatus().isOk()
            .expectBody(Product.class)
            .isEqualTo(product);
    }

    @Test
    void getProductById_WhenNotExists_ShouldReturnNotFound() {
        // Given
        when(productService.findById(1L)).thenReturn(Mono.empty());

        // When & Then
        webTestClient.get()
            .uri("/api/products/1")
            .exchange()
            .expectStatus().isNotFound();
    }

    @Test
    void createProduct_ShouldCreateSuccessfully() {
        // Given
        Product newProduct = new Product("New Product", BigDecimal.valueOf(49.99), "NEW", true);
        Product savedProduct = createTestProduct();
        when(productService.createProduct(any(Product.class))).thenReturn(Mono.just(savedProduct));

        // When & Then
        webTestClient.post()
            .uri("/api/products")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(newProduct)
            .exchange()
            .expectStatus().isOk()
            .expectBody(Product.class)
            .isEqualTo(savedProduct);
    }

    @Test
    void deleteProduct_WhenExists_ShouldReturnNoContent() {
        // Given
        when(productService.deleteProduct(1L)).thenReturn(Mono.empty());

        // When & Then
        webTestClient.delete()
            .uri("/api/products/1")
            .exchange()
            .expectStatus().isNoContent();
    }
}
```

### Integration Test

```java
package com.example.demo;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.time.LocalDateTime;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class DemoApplicationIntegrationTest {

    @Autowired
    private WebTestClient webTestClient;

    @Autowired
    private UserRepository userRepository;

    @Test
    void contextLoads() {
        // Basic context loading test
    }

    @Test
    void createAndRetrieveUser_IntegrationTest() {
        // Create user
        User newUser = new User("integration_test", "integration@test.com", 28);

        webTestClient.post()
            .uri("/api/users")
            .body(Mono.just(newUser), User.class)
            .exchange()
            .expectStatus().isOk();

        // Retrieve user
        webTestClient.get()
            .uri("/api/users/username/integration_test")
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.username").isEqualTo("integration_test")
            .jsonPath("$.email").isEqualTo("integration@test.com");
    }

    @Test
    void userRepository_SaveAndFind_ShouldWork() {
        // Given
        User user = new User("repo_test", "repo@test.com", 30);

        // When
        Mono<User> savedUser = userRepository.save(user);
        Mono<User> foundUser = userRepository.findByUsername("repo_test");

        // Then
        StepVerifier.create(savedUser.then(foundUser))
            .expectNextMatches(u -> u.getUsername().equals("repo_test"))
            .verifyComplete();
    }
}
```

### Test Configuration

```java
package com.example.demo;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.r2dbc.core.DatabaseClient;
import io.r2dbc.spi.ConnectionFactory;

@TestConfiguration
public class TestConfig {

    @Bean
    public DatabaseClient databaseClient(ConnectionFactory connectionFactory) {
        return DatabaseClient.create(connectionFactory);
    }
}
```

## 11. Running the Application

### Application Properties for Different Environments

```yaml
# application-test.yml
spring:
  r2dbc:
    url: r2dbc:h2:mem:///testdb
  sql:
    init:
      mode: always
```

### Running Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=UserServiceTest

# Run with coverage
mvn jacoco:report
```

This complete example demonstrates:

- **Reactive controllers** with proper error handling
- **Reactive repositories** using R2DBC
- **Service layer** with business logic
- **Comprehensive testing** including unit, WebFlux, and integration tests
- **Proper error handling** and validation
- **Reactive streaming** with backpressure support

The application provides a fully functional reactive REST API with proper testing strategies for each layer.
