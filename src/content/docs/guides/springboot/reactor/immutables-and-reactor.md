---
title: Immutables and Reactor
slug: guides/springboot/reactor/immutables-and-reactor
description: Immutables and Reactor
sidebar:
  order: 0
---

### 1. Reactor

**In a nutshell:** Reactor is a fully non-blocking foundation for building efficient, asynchronous applications on the JVM. It's the core library that powers the reactive programming model in Spring WebFlux (the reactive web stack in Spring Boot 3).

#### What Problem Does It Solve?

Traditional Spring MVC applications are built on a thread-per-request model (using Servlet containers like Tomcat). If a request has to wait for a slow operation (like a database call or an external API call), the thread is blocked, sitting idle until a response comes back. Under high load with many slow operations, you can run out of threads, leading to request rejections or slow performance.

Reactor provides a model where you can handle many more concurrent requests with a small, fixed number of threads. Instead of blocking, you declare what should happen _when the slow operation completes_. This is much more resource-efficient.

#### Core Concepts:

Reactor provides two main types to represent asynchronous sequences of data:

1.  **`Mono`:** A publisher that emits **0 or 1** element. It's like a reactive version of `Optional<T>` or a `CompletableFuture<T>`.

    - Example: Fetching a single user by ID from a database.
    - `Mono<User> user = userRepository.findById(1);`

2.  **`Flux`:** A publisher that emits **0 to N** elements. It's a reactive stream of data.
    - Example: Fetching a list of all users, or receiving a live stream of stock ticker prices.
    - `Flux<User> users = userRepository.findAll();`

#### How It's Used in Spring Boot 3:

- **Spring WebFlux:** Your controller methods return `Mono` or `Flux` instead of `Object` or `List<Object>`.

  ```java
  @RestController
  public class UserController {

      @GetMapping("/users/{id}")
      public Mono<User> getUser(@PathVariable Long id) {
          return userRepository.findById(id); // Non-blocking call
      }

      @GetMapping("/users")
      public Flux<User> getAllUsers() {
          return userRepository.findAll(); // Non-blocking call
      }
  }
  ```

- **Reactive Data Repositories:** Spring Data provides reactive variants like `ReactiveCrudRepository` which return `Mono` and `Flux` for use with non-blocking database drivers (e.g., for MongoDB, Cassandra, or R2DBC for SQL).

#### Key Takeaway:

Reactor is the engine for building non-blocking, backpressure-ready asynchronous services in Spring Boot 3, allowing for better resource utilization and scalability under high concurrency.

---

### 2. Immutables

**In a nutshell:** Immutables is a Java library (and annotation processor) that helps you easily create **immutable** objects. Immutable objects are objects whose state cannot be changed after they are created.

#### What Problem Does It Solve?

Manually writing immutable classes in Java is verbose. You have to:

- Declare all fields as `final`.
- Create a constructor that sets all fields.
- Provide getter methods for all fields.
- Implement `equals()`, `hashCode()`, and `toString()` correctly.

The Immutables library generates all this boilerplate code for you at compile time, based on simple abstract classes or interfaces that you define.

#### Core Concepts & Usage:

1.  **Define an Abstract Type:** You define an abstract class or interface with abstract getter methods.
2.  **Add the `@Value.Immutable` Annotation:** This tells the annotation processor to generate the implementation.
3.  **Use the Generated Class:** The processor generates a class named `ImmutableYourClassName` with a builder pattern, and all the necessary methods.

**Example:**

1.  **Define it:**

    ```java
    import org.immutables.value.Value;

    @Value.Immutable // Generates ImmutableUser
    public interface User {
        long id();
        String username();
        String email();
    }
    ```

2.  **Use it:**

    ```java
    public class App {
        public static void main(String[] args) {
            // Using the builder (most common way)
            ImmutableUser user = ImmutableUser.builder()
                .id(1L)
                .username("john_doe")
                .email("john@example.com")
                .build();

            System.out.println(user.username()); // "john_doe"
            // user.username("new_name"); // DOES NOT COMPILE! Object is immutable.
        }
    }
    ```

#### Why Use Immutables with Reactor/Spring Boot?

Immutables pairs perfectly with reactive and functional-style programming:

- **Thread-Safety:** Immutable objects can be freely shared between threads and across asynchronous boundaries (like the different stages of a `Mono` or `Flux` chain) without any risk of race conditions. This is critical in reactive applications where callbacks can execute on different threads.
- **Predictability:** An object's state is fixed at creation, making your data flow easier to reason about.
- **No Side Effects:** Functions that take immutable objects as parameters cannot accidentally modify them, leading to more robust and testable code.

---

### How They Work Together in Your Stack

Imagine a reactive Spring Boot 3 service:

1.  A request comes in to the **Reactor**-based WebFlux controller.
2.  The service calls a reactive database, which returns a `Mono<ImmutableUser>`.
3.  You can then transform this data using Reactor's operators (like `map`, `flatMap`) in a functional style.
4.  Because the `ImmutableUser` object cannot change, you can be sure that the data flowing through the entire asynchronous chain is consistent and safe from concurrent modification.

**Java 21** enhances this further with features like records, which are also a form of immutable data carriers. While you could use records for simpler cases, Immutables offers more advanced features like builders, pre-computed `hashCode`, and integration with other libraries (like JSON serialization).

**Summary Table:**

| Feature               | Reactor                                     | Immutables                                         |
| :-------------------- | :------------------------------------------ | :------------------------------------------------- |
| **Primary Purpose**   | Asynchronous, non-blocking data streams     | Creating immutable data objects                    |
| **Core Abstractions** | `Mono` (0-1 item), `Flux` (0-N items)       | `@Value.Immutable` annotation, generated builders  |
| **Key Benefit**       | High concurrency & efficient resource usage | Thread-safety, predictability, reduced boilerplate |
| **Role in Stack**     | The **engine** for handling requests        | The **data model** flowing through the engine      |
