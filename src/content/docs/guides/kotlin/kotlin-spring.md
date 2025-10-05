---
title: Kotlin Spring Boot
slug: guides/kotlin/kotlin-spring
description: Kotlin Spring Boot
sidebar:
  order: 2
---

## 🚀 Kotlin Essentials for Spring Boot REST APIs

Since you already know Java, we'll concentrate on the **syntax differences** and **idiomatic features** that streamline code, especially for data models and controllers.

### 1\. Variables and Data Types

| Java                           | Kotlin                | Notes                                                                                                                                    |
| :----------------------------- | :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| `final String name = "Alice";` | `val name = "Alice"`  | **`val`** (value) is for **immutable** variables (like `final` in Java). **Use this by default.**                                        |
| `String name = "Alice";`       | `var name = "Alice"`  | **`var`** (variable) is for **mutable** variables. Use sparingly.                                                                        |
| `int count = 10;`              | `val count = 10`      | Kotlin uses **type inference**, so you often don't need to specify the type. Basic types are objects (e.g., `Int`, `String`, `Boolean`). |
| `long time = 123L;`            | `val time = 123L`     |                                                                                                                                          |
| `int[] arr;`                   | `val arr: Array<Int>` |                                                                                                                                          |

### 2\. Null Safety (A Major Feature\! 🛡️)

Kotlin's type system distinguishes between references that **can** hold `null` and those that **can't**, eliminating the notorious `NullPointerException` (NPE) at compile time.

- **Non-nullable type:** `String` (Cannot be null)
- **Nullable type:** `String?` (Can be null)

| Concept                | Kotlin Example                | Notes                                                                                                                                                                |
| :--------------------- | :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Declaring Nullable** | `var city: String? = null`    | The `?` makes the type **nullable**.                                                                                                                                 |
| **Safe Call Operator** | `val length = city?.length`   | If `city` is not null, it gets the length; otherwise, `length` is `null`.                                                                                            |
| **Elvis Operator**     | `val len = city?.length ?: 0` | If `city?.length` is not null, use it; otherwise, use the value after `?:` (the default value, $0$ in this case).                                                    |
| **Non-null Assertion** | `val len = city!!.length`     | The **`!!`** operator converts a nullable type to a non-nullable type. **Avoid this\!** It throws an NPE if the value is null, defeating the purpose of null safety. |

### 3\. Data Classes (Perfect for DTOs/Entities)

In Java, a simple data class (POJO) requires fields, a constructor, getters, setters, `equals()`, `hashCode()`, and `toString()`.

In Kotlin, you use a **`data class`**:

```kotlin
// A full-featured Java POJO in ONE line of Kotlin!
data class User(
    val id: Long,
    var name: String,
    val email: String? // Nullable email
)
```

This single line automatically generates:

- **Properties** (via the primary constructor).
- **Getters** (and **Setters** if `var` is used).
- `equals()`/`hashCode()`.
- `toString()`.
- `copy()` function (useful for immutability).

### 4\. Functions (Methods)

| Java                                     | Kotlin                            | Notes                                                                          |
| :--------------------------------------- | :-------------------------------- | :----------------------------------------------------------------------------- |
| `public static void main(String[] args)` | `fun main(args: Array<String>)`   | **`fun`** keyword starts a function.                                           |
| `public int sum(int a, int b)`           | `fun sum(a: Int, b: Int): Int`    | Parameters are `name: Type`. Return type is specified _after_ the parentheses. |
| `return a + b;`                          | `fun sum(a: Int, b: Int) = a + b` | **Single-expression functions** are common.                                    |

### 5\. Classes and Constructors

- Kotlin uses a **primary constructor** defined in the class header.
- The `new` keyword is **not** used to instantiate classes: `val user = User(1, "Alice")`

<!-- end list -->

```kotlin
// Class with a primary constructor
class Customer(val id: Long, var name: String) {

    // Initialization block (runs after the primary constructor)
    init {
        println("Customer created with ID $id")
    }

    // Secondary constructor (less common)
    constructor(name: String) : this(0, name) // Calls the primary constructor
}
```

### 6\. String Templates

This is a cleaner way to inject variables into strings than Java's string concatenation or `String.format()`.

```kotlin
val id = 101
val name = "Bob"
// Java: "User ID: " + id + ", Name: " + name
val message = "User ID: $id, Name: $name" // Output: User ID: 101, Name: Bob

// Embed expressions with curly braces
val result = "The sum of 2 and 3 is ${2 + 3}" // Output: The sum of 2 and 3 is 5
```

---

## 💻 Applying Kotlin to Spring Boot

You can use all your existing Spring Boot knowledge—annotations, dependencies, configuration—everything is the same\! You're just writing the code in Kotlin.

### 1\. REST Controller Example (The Core)

This looks very similar to Java, but uses Kotlin syntax and features.

```kotlin
// src/main/kotlin/com/example/demo/UserController.kt

package com.example.demo

import org.springframework.web.bind.annotation.*

// Use a data class for the request/response body (DTO)
data class UserDto(val id: Long, val name: String)

@RestController
@RequestMapping("/api/users")
class UserController {

    // Inject a service (Kotlin's syntax for constructor injection)
    // Spring (since 4.3) automatically handles injection here
    // val is used because the service reference won't change
    constructor(private val userService: UserService)

    // GET /api/users/1
    @GetMapping("/{id}")
    fun getUser(@PathVariable id: Long): UserDto {
        // Use the injected service
        val user = userService.findById(id) ?:
                   throw UserNotFoundException("User not found: $id") // Elvis operator with exception

        return UserDto(user.id, user.name)
    }

    // POST /api/users
    @PostMapping
    // The 'userDto' is automatically bound from the request body
    fun createUser(@RequestBody userDto: UserDto): UserDto {
        val newUser = userService.save(userDto.name)
        return UserDto(newUser.id, newUser.name)
    }
}
```

### 2\. Service/Repository Example

```kotlin
// src/main/kotlin/com/example/demo/UserService.kt

// Dummy repository to simulate data access
interface UserRepository {
    fun findById(id: Long): User? // Returns a nullable User!
    fun save(user: User): User
}

// Simple internal model
data class User(val id: Long, val name: String)

@Service
class UserService(private val userRepository: UserRepository) {
    // Dependency injection via primary constructor

    // Function returns a nullable User
    fun findById(id: Long): User? {
        return userRepository.findById(id)
    }

    // Function returns a non-nullable User
    fun save(name: String): User {
        val newUser = User(0, name) // id 0 will be replaced by the DB
        return userRepository.save(newUser)
    }
}
```

You've got it\! Here is a concise, complete guide to developing Spring Boot REST APIs using Kotlin, assuming your Java background.

---

## 🛠️ Kotlin Spring Boot REST API: Concise Guide

This guide covers the setup, core language features, and essential Spring Boot patterns using idiomatic Kotlin.

### 1\. Project Setup (via Spring Initializr)

When generating your project (start.spring.io), ensure you select the following:

| Field            | Value                                                      | Notes                                      |
| :--------------- | :--------------------------------------------------------- | :----------------------------------------- |
| **Project**      | Maven or Gradle                                            | Gradle with Kotlin DSL is often preferred. |
| **Language**     | **Kotlin**                                                 | Essential.                                 |
| **Dependencies** | Spring Web, Spring Data JPA, H2 Database (for quick start) | The standard components.                   |
| **JVM**          | 17+                                                        | Standard for modern Spring Boot.           |

**Key Dependencies Added Automatically:**

- **`kotlin-stdlib`**: The Kotlin standard library.
- **`kotlin-reflect`**: Required by Spring for reflection (e.g., component scanning).
- **`kotlin-maven-plugin`** or **`kotlin-gradle-plugin`**: Compiler plugins.

---

### 2\. Core Kotlin for Spring Boot

Focus on these Kotlin features that replace verbose Java boilerplate:

#### A. Data Models (Entities & DTOs)

Use **`data class`** for clean, concise models. This automatically generates getters, setters (for `var`), `equals()`, `hashCode()`, and `toString()`.

| Kotlin Feature   | Example                                            | Use Case                                                                                                                    |
| :--------------- | :------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| **`data class`** | `data class User(val id: Long?, var name: String)` | Perfect for **DTOs** and **JPA Entities**. Use **`val`** for immutable fields (like `id`), **`var`** for mutable fields.    |
| **Null Safety**  | `val id: Long?`                                    | The **`?`** denotes a **nullable** type. Use this for optional fields (like a DTO field) or IDs that are generated on save. |

#### B. Dependency Injection

Use **Primary Constructors** for idiomatic dependency injection. The `@Autowired` annotation is usually optional.

| Java (Field Injection)                                                 | Kotlin (Primary Constructor Injection)                     |
| :--------------------------------------------------------------------- | :--------------------------------------------------------- |
| `@Autowired private UserService userService;`                          | `class MyController(private val userService: UserService)` |
| _Note:_ Use **`val`** since the reference to the service is immutable. |

---

### 3\. REST Controller Implementation

Kotlin's syntax makes controllers concise and highly readable.

```kotlin
// DTOs and other classes would be defined elsewhere
data class UserDto(val id: Long, val name: String)

@RestController
@RequestMapping("/api/users")
class UserController(private val userService: UserService) { // Primary Constructor Injection

    // GET /api/users/{id}
    @GetMapping("/{id}")
    fun getUser(@PathVariable id: Long): UserDto {
        // Use the Elvis Operator (?:) for safe handling of nullable service returns
        val user = userService.findById(id)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "User $id not found")

        // Auto-converts to JSON
        return UserDto(user.id, user.name)
    }

    // POST /api/users
    @PostMapping
    fun createUser(@RequestBody userDto: UserDto): UserDto {
        // Safe access to DTO properties
        val savedUser = userService.save(userDto.name)

        // String templates for simple logging (better than concatenation)
        println("User created: ${savedUser.name}")

        return UserDto(savedUser.id, savedUser.name)
    }
}
```

---

### 4\. Service and Repository Layer

When working with repositories, embrace Kotlin's null-safe types.

```kotlin
// Assume User is a JPA Entity class (data class)

@Service
class UserService(private val userRepository: UserRepository) { // Injection

    // The return type 'User?' explicitly states the result might be null
    fun findById(id: Long): User? {
        // Use .orElse(null) or .orElseGet(null) to convert Java's Optional<T>
        // return type (from JpaRepository) into Kotlin's T?
        return userRepository.findById(id).orElse(null)
    }

    fun save(name: String): User {
        val newUser = User(id = null, name = name) // Use named arguments for clarity
        return userRepository.save(newUser)
    }
}
```

---

### 5\. Essential Kotlin Spring Boot Plugins

For real-world development, ensure your build file includes the following compiler plugins (automatically handled by Initializr):

| Plugin              | Purpose                                                                                                                                                                                                                                            |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`kotlin-spring`** | Automatically opens classes and methods annotated with Spring annotations (like `@Component`, `@Service`, `@Entity`) so that Spring's AOP (e.g., for transactions, proxies) can work without requiring you to manually add the **`open`** keyword. |
| **`kotlin-jpa`**    | Automatically provides a no-argument constructor for classes annotated with `@Entity`, which is required by JPA/Hibernate.                                                                                                                         |

## 💡 Quick Tips for the Kotlin/Spring Transition

1.  **Use `val` by default:** Favor immutability. Only use `var` if you genuinely need a mutable variable.
2.  **Primary Constructor Injection:** In Kotlin, dependency injection is clean and idiomatic by using the primary constructor:
    ```kotlin
    @Service
    class MyService(private val repository: MyRepository) { ... }
    ```
    This replaces field injection (`@Autowired private var repository: MyRepository`) and traditional constructor injection in Java.
3.  **No `new` keyword:** Class instantiation is direct: `val customer = Customer(name, email)`.
4.  **Java/Kotlin Interoperability:** Spring Data JPA entities, which often use reflection, work seamlessly. You might need to add the **`open`** keyword to your Kotlin classes and methods if they need to be subclassed or proxied by frameworks (like Spring's transactions), or use the **`all-open`** Gradle/Maven plugin, which automatically applies `open` to classes with Spring annotations.

**In summary, your main shift is from verbose POJOs and explicit null-checking to concise `data class` usage and relying on Kotlin's built-in null safety (`?`, `?:`).**
