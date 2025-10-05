---
title: Kotlin Fundamentals
slug: guides/kotlin/kotlin-basics
description: Kotlin Fundamentals
sidebar:
  order: 0
---

- Kotlin is a modern, **statically-typed** programming language developed by JetBrains.
- It is concise, safe, and fully **interoperable with Java**.

---

## 1\. Getting Started and Basic Syntax

### The Entry Point

The execution of a Kotlin application begins with the `main` function.

```kotlin
fun main() {
    println("Hello, Kotlin!")
}
```

- **`fun`**: Keyword to declare a function.
- **`main()`**: The name of the function, which is the program's starting point.
- **`println()`**: A standard library function to print a line to the console.

### Variables

Variables are declared using one of two keywords: `val` for read-only (immutable) and `var` for mutable. Kotlin features **type inference**, meaning you usually don't need to specify the type.

|  Keyword  | Mutability | Example              | Description                                                         |
| :-------: | :--------: | :------------------- | :------------------------------------------------------------------ |
| **`val`** | Immutable  | `val name = "Alice"` | Cannot be reassigned after initialization. Preferred for safe code. |
| **`var`** |  Mutable   | `var count = 10`     | Can be reassigned to a different value.                             |

You can explicitly specify the type like this: `val age: Int = 30`.

### Basic Data Types

Kotlin's basic types include:

|     Type      |     Example      | Description                              |
| :-----------: | :--------------: | :--------------------------------------- |
|   **`Int`**   |   `val i = 42`   | Integers (whole numbers).                |
| **`Double`**  |  `val d = 3.14`  | Double-precision floating-point numbers. |
| **`Boolean`** |  `val b = true`  | Logical values: `true` or `false`.       |
| **`String`**  | `val s = "text"` | Textual data.                            |
|  **`Char`**   |  `val c = 'A'`   | Single characters.                       |

**String Templates**: You can include variable values inside a string by prefixing the variable with a dollar sign (`$`). For expressions, wrap them in curly braces:

```kotlin
val name = "World"
println("Hello, $name!") // Output: Hello, World!

val a = 5
val b = 2
println("The sum of $a and $b is ${a + b}") // Output: The sum of 5 and 2 is 7
```

---

## 2\. Functions

Functions are declared using the `fun` keyword. The return type is placed after the parameter list, separated by a colon.

### Function Declaration

```kotlin
fun add(a: Int, b: Int): Int {
    return a + b
}
```

### Single-Expression Functions

For functions that return a single expression, you can use the assignment operator (`=`) and omit the body and return type (the return type is inferred).

```kotlin
fun multiply(x: Int, y: Int) = x * y
```

### Default and Named Arguments

You can provide default values for parameters, and you can call the function using named arguments for better readability.

```kotlin
fun greet(name: String = "Guest", greeting: String = "Hello") {
    println("$greeting, $name!")
}

// Call with default arguments:
greet() // Output: Hello, Guest!

// Call with named arguments (can be out of order):
greet(greeting = "Good morning", name = "Jane") // Output: Good morning, Jane!
```

---

## 3\. Control Flow

Control flow statements allow your program to make decisions and repeat actions.

### Conditional Expressions (`if` / `else`)

In Kotlin, `if` is an **expression**, meaning it returns a value. There is no ternary operator, as `if` can serve the same purpose.

```kotlin
val a = 10
val b = 20

val max = if (a > b) {
    println("a is greater")
    a // This is the return value of the if expression
} else {
    println("b is greater or equal")
    b // This is the return value of the else expression
}
println("Max value is $max") // Output: Max value is 20
```

### Conditional Expressions (`when`)

The `when` expression replaces the traditional `switch` statement and is very versatile. It can be used as a statement or an expression.

```kotlin
fun describe(obj: Any): String =
    when (obj) {
        1 -> "One"
        "Hello" -> "Greeting"
        is Long -> "Long" // Check the type
        !is String -> "Not a string"
        else -> "Unknown"
    }

println(describe(1))    // Output: One
println(describe(5L))   // Output: Long
println(describe("Hi")) // Output: Not a string
```

### Loops

Kotlin supports `for`, `while`, and `do-while` loops.

|    Loop     |               Example               | Description                                                                        |
| :---------: | :---------------------------------: | :--------------------------------------------------------------------------------- |
|  **`for`**  |  `for (i in 1..3) { println(i) }`   | Iterates through anything that provides an iterator (ranges, collections, arrays). |
| **`while`** | `var x = 0; while (x < 5) { x++; }` | Executes a block of code repeatedly while a condition is true.                     |

**Ranges**: You can easily create ranges of values:

- `1..5`: Inclusive range (1, 2, 3, 4, 5)
- `1 until 5`: Half-open range (1, 2, 3, 4)
- `5 downTo 1`: Reverse range
- `1..5 step 2`: Step through the range (1, 3, 5)

---

## 4\. Null Safety (The Question Mark)

Kotlin's **null safety** is a core feature that aims to eliminate the dreaded `NullPointerException` (NPE). By default, variables cannot hold a `null` value.

### Nullable Types

To allow a variable to hold `null`, you must explicitly declare its type as **nullable** by adding a question mark (`?`) at the end.

```kotlin
var nonNull: String = "Hello"
// nonNull = null // This would cause a compilation error

var nullable: String? = "World"
nullable = null // This is allowed
```

### Safe Call Operator (`?.`)

To access a property or function on a nullable variable, you must use the **safe call operator** (`?.`). It executes the operation only if the variable is non-null; otherwise, it returns `null`.

```kotlin
val length = nullable?.length // length will be Int? (nullable Int) or null
```

### Elvis Operator (`?:`)

The **Elvis operator** provides a default value to use if the preceding expression is `null`.

```kotlin
val name: String? = null
val length = name?.length ?: 0 // If name is null, length will be 0
println(length) // Output: 0
```

### Non-null Assertion Operator (`!!`)

If you are certain a nullable variable is not null, you can force the non-null type using the **non-null assertion operator** (`!!`). **Use this sparingly**, as it throws an NPE if the value _is_ null.

```kotlin
val nonNullName: String? = "John"
val sureLength = nonNullName!!.length // Be absolutely sure nonNullName is not null!
```

---

## 5\. Classes and Objects (OOP)

Kotlin is an Object-Oriented Language. Classes are declared with the `class` keyword.

### Class Declaration

```kotlin
class Person(val firstName: String, var age: Int) {
    // Member function (method)
    fun getInfo() {
        println("Name: $firstName, Age: $age")
    }
}

// Creating an object (instance)
val john = Person("John", 35)
john.getInfo() // Output: Name: John, Age: 35

// Accessing properties
john.age = 36 // OK, because age is a 'var'
println(john.firstName) // OK, reading a 'val'
```

### Data Classes

`data class` is used to create classes whose primary purpose is to hold data. The compiler automatically generates useful functions like `equals()`, `hashCode()`, `toString()`, and `copy()`.

```kotlin
data class User(val id: Int, val name: String)

val user1 = User(1, "Alice")
val user2 = user1.copy(name = "Bob") // Creates a new object with changes

println(user1.toString()) // Output: User(id=1, name=Alice)
```

### Inheritance

In Kotlin, classes are **final** by default (cannot be inherited). To allow inheritance, you must mark the class with the `open` keyword.

```kotlin
open class Animal(val name: String) {
    open fun speak() {
        println("$name makes a sound")
    }
}

class Dog(name: String) : Animal(name) {
    override fun speak() {
        println("$name barks")
    }
}

val dog = Dog("Buddy")
dog.speak() // Output: Buddy barks
```

---

## 6\. Collections

Kotlin provides an extensive collection library, differentiating between **immutable (read-only)** and **mutable** collections.

| Collection Type |  Creation (Immutable)  |    Creation (Mutable)     | Description                                           |
| :-------------: | :--------------------: | :-----------------------: | :---------------------------------------------------- |
|   **`List`**    |   `listOf(1, 2, 3)`    |   `mutableListOf(1, 2)`   | Ordered collection of items (can contain duplicates). |
|    **`Set`**    | `setOf("a", "b", "a")` | `mutableSetOf("a", "b")`  | Unique, unordered collection of items.                |
|    **`Map`**    |   `mapOf("k1" to 1)`   | `mutableMapOf("k2" to 2)` | A collection of key-value pairs (keys are unique).    |

```kotlin
// Immutable List
val numbers = listOf(1, 2, 3, 4)
// numbers.add(5) // ERROR!

// Mutable List
val mutableNumbers = mutableListOf(10, 20)
mutableNumbers.add(30) // OK
println(mutableNumbers) // Output: [10, 20, 30]
```
