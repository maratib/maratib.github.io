---
title: Kotlin Null Safety
slug: guides/kotlin/kotlin-null
description: Kotlin Null Safety
sidebar:
  order: 1
---

Kotlin's null safety is a core feature designed to eliminate the notorious **`NullPointerException` (NPE)**, often called "the billion-dollar mistake," by making nullability an explicit part of the type system.

Instead of crashing at runtime like Java does when you try to access a method on a `null` reference, Kotlin forces you to handle potential `null` values at **compile time**.

---

## 🛡️ The Two Kinds of References

In Kotlin, every type is classified as either **non-nullable** or **nullable**.

### 1\. Non-Nullable Types (The Default)

By default, a variable cannot hold a `null` value. This is the **most common** type you'll use.

| Kotlin Code                  | Java Equivalent                | Explanation                                                                                     |
| :--------------------------- | :----------------------------- | :---------------------------------------------------------------------------------------------- |
| `val name: String = "Alice"` | `final String name = "Alice";` | This variable _must_ hold a `String` value. Assigning `null` to it is a **compile-time error**. |
| `name = null`                | (Compile Error)                | The compiler prevents this line from running.                                                   |

### 2\. Nullable Types (Explicitly Marked)

To allow a variable to hold `null`, you must explicitly mark the type with a question mark (`?`).

| Kotlin Code                 | Java Equivalent              | Explanation                                                                            |
| :-------------------------- | :--------------------------- | :------------------------------------------------------------------------------------- |
| `val email: String? = null` | `final String email = null;` | The type is **"String or null"**. The compiler knows to treat this variable specially. |

---

## 💡 Safe Call Operators (Handling Nullable Types)

Because the compiler knows an expression might be `null`, it won't let you call methods on a nullable variable directly. You must use a **safe call operator** to proceed.

### 1\. Safe Call Operator (`?.`)

The safe call operator executes the method or property access **only if** the object is not `null`. Otherwise, the entire expression evaluates to `null`.

**Example:**

```kotlin
val city: String? = "London"
val length1 = city?.length // city is "London", so length1 is 6

val address: String? = null
val length2 = address?.length // address is null, so length2 is null
```

### 2\. Elvis Operator (`?:`)

The Elvis operator (named because it looks like Elvis Presley's haircut $\text{:} \text{?}$) allows you to provide a **default value** if the expression on the left of the operator is `null`.

**Example:**

```kotlin
val address: String? = null

// If address is null, set len to 0 instead of null
val len = address?.length ?: 0 // len is 0 (Int, non-nullable)
```

This is extremely useful for providing fallbacks or throwing exceptions:

```kotlin
val user = getUserFromDb(id)
// If user is null, throw an exception instead of returning null
val safeUser = user ?: throw UserNotFoundException("ID $id not found")
```

---

## ⚠️ Non-Null Assertion Operator (`!!`)

This operator converts any nullable type (`T?`) to a non-nullable type (`T`). You are essentially telling the compiler, "Trust me, this will **not** be null."

**If the value _is_ null at runtime, it throws an NPE.**

**Example:**

```kotlin
val name: String? = getNameFromInput() // could be null

// Use this ONLY when you are absolutely certain it won't be null
val upperName = name!!.uppercase()
```

**Guideline:** **Avoid using `!!`** unless you have absolutely no other choice (e.g., when integrating with specific legacy Java libraries). Using it defeats the purpose of Kotlin's null safety.

---

## ✅ Smart Casts (Compiler Magic)

Kotlin's compiler is intelligent. It can automatically "cast" a nullable variable to its non-nullable type inside a block where it has been checked for null.

**Example:**

```kotlin
val street: String? = getStreetAddress()

if (street != null) {
    // Inside this block, the compiler treats 'street' as non-nullable String!
    // No safe call is needed.
    println("The length is ${street.length}") // direct access is allowed
}

// Same concept with a 'while' loop
if (street is String) {
    // Compiler treats 'street' as String (non-nullable)
    street.length
}
```
