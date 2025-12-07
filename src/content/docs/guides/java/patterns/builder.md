---
title: Builder Pattern
description: Java Builder Pattern (CREATIONAL PATTERN)
sidebar:
  order: 3
---

_Java Builder Pattern (CREATIONAL PATTERN)_

A **creational design pattern** that separates the construction of a complex object from its representation, allowing the same construction process to create different representations.

- **Builder Pattern**: Creates immutable objects through method chaining, solving telescoping constructor and JavaBeans problems.
- **Lombok @Builder**: Generates all boilerplate automatically.

## **1. Why Builder Pattern?**

**What Problems it solves:**

1. **Telescoping Constructor** (too many constructor overloads)
2. **JavaBeans Pattern** (mutable, inconsistent state between construction and use)

## **2. Classic Example: Without vs With Builder**

### **❌ Without Builder (Problems)**

```java
// Problem: Telescoping constructors
public class User {
    public User(String name) {...}
    public User(String name, int age) {...}
    public User(String name, int age, String phone) {...}
    // Messy and confusing!
}

// Problem: JavaBeans (setters)
User user = new User();
user.setName("John");
// Object can be half-built!
```

### **✅ With Builder (Solution)**

```java
public class User {
    private final String name;  // Immutable
    private final int age;
    private final String phone;

    // Private constructor
    private User(UserBuilder builder) {
        this.name = builder.name;
        this.age = builder.age;
        this.phone = builder.phone;
    }

    // Static Builder class
    public static class UserBuilder {
        private String name;
        private int age;
        private String phone = "";  // Default value

        public UserBuilder(String name) {
            this.name = name;
        }

        public UserBuilder age(int age) {
            this.age = age;
            return this;  // Method chaining
        }

        public UserBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public User build() {
            // Validation here
            return new User(this);
        }
    }
}
```

## **3. Usage - Clean & Readable**

```java
// Method chaining makes it readable
User user = new User.UserBuilder("John")
    .age(30)
    .phone("1234567890")
    .build();  // Immutable object created

// Only required parameters
User minimal = new User.UserBuilder("Jane").build();
```

## **4. Key Benefits**

1. **Immutable objects** (thread-safe)
2. **Method chaining** (fluent interface)
3. **Validation in build() method**
4. **Clear required vs optional parameters**
5. **Self-documenting code**

## **5. Lombok @Builder - 90% Less Code**

### **Without Lombok** (40+ lines)

```java
public class User {
    private String name;
    private int age;
    private String phone;

    // Builder class with 30+ lines...
    public static class UserBuilder { ... }
}
```

### **With Lombok** (5 lines!)

```java
import lombok.Builder;
import lombok.ToString;

@Builder
@ToString
public class User {
    private String name;
    private String email;
    private int age;

    // Lombok generates everything!
    // Constructor, builder(), build(), toString()
}
```

### **Usage with Lombok**

```java
// Simple
User user = User.builder()
    .name("John")
    .age(30)
    .email("john@example.com")
    .build();

// With custom default values
@Builder
public class User {
    @Builder.Default
    private String role = "USER";  // Default value

    @Builder.Default
    private boolean active = true;
}

// Builder on method (for DTOs)
public User createUser(String name) {
    return User.builder()
        .name(name)
        .createdAt(LocalDateTime.now())
        .build();
}
```

## **6. Lombok Builder Features**

### **Customizing Builder**

```java
@Builder
public class User {
    private String name;
    private String email;

    // Custom builder method
    public static UserBuilder builder(String name) {
        return new UserBuilder().name(name);
    }

    // Custom build logic
    public static class UserBuilder {
        public User build() {
            if (email == null) {
                email = name + "@default.com";
            }
            return new User(this);
        }
    }
}
```

### **Builder with Inheritance**

```java
@AllArgsConstructor
public class Parent {
    private String parentField;
}

@Builder
public class Child extends Parent {
    private String childField;

    // Works with @SuperBuilder for better inheritance support
}
```

## **7. Interview Questions & Answers**

### **Q1: Why use Builder over Setters?**

**A**: Builders create **immutable** objects. Setters create mutable objects that can be in inconsistent state. Builder ensures object is fully constructed and valid before use.

### **Q2: When to use Builder Pattern?**

**A**: When object has:

- Many parameters (5+)
- Optional parameters
- Need for immutability
- Complex validation rules
- Need for different object representations

### **Q3: Builder vs Constructor?**

**A**: Constructor good for few mandatory params. Builder better for many params, especially optional ones.

### **Q4: How does Lombok @Builder work?**

**A**: Lombok generates a static builder() method, inner Builder class, setter methods, and build() method at compile time via annotation processing.

### **Q5: Is Builder thread-safe?**

**A**: Builder itself is mutable during construction, but the built object is immutable and thread-safe.

## **8. Quick Cheatsheet**

```java
// 1. Manual Builder Pattern
public class Product {
    private final String name;

    private Product(Builder b) { this.name = b.name; }

    public static class Builder {
        private String name;
        public Builder name(String n) { this.name = n; return this; }
        public Product build() { return new Product(this); }
    }
}

// 2. Lombok Builder (RECOMMENDED)
@Builder
public class Product {
    private String name;
    @Builder.Default private int quantity = 1;
}

// Usage (both same)
Product p = new Product.Builder().name("Phone").build();
Product p = Product.builder().name("Phone").build();  // Lombok
```

## **9. Best Practices**

1. **Use Lombok** for less boilerplate
2. **Make fields final** for immutability
3. **Add validation** in build() method
4. **Use @Builder.Default** for default values
5. **Consider @SuperBuilder** for inheritance
