---
title: Java Collection Framework
description: Java Collection Framework
---

Method references are a powerful feature that, when used appropriately, can significantly improve the quality and readability of your Java code, especially when working with streams and functional programming patterns.

Java 8 introduced method references as a way to make code more concise and readable when using lambda expressions. Let me explain method references and related reference types in detail.

## 1. Method References

Method references are shorthand syntax for lambda expressions that call existing methods. They use the `::` operator.

### Types of Method References:

#### a) Reference to a Static Method

```java
// Lambda expression
Function<String, Integer> parser1 = s -> Integer.parseInt(s);

// Method reference
Function<String, Integer> parser2 = Integer::parseInt;

// Usage
System.out.println(parser2.apply("123")); // Output: 123
```

#### b) Reference to an Instance Method of a Particular Object

```java
List<String> list = Arrays.asList("a", "b", "c");

// Lambda expression
list.forEach(s -> System.out.println(s));

// Method reference
list.forEach(System.out::println);
```

#### c) Reference to an Instance Method of an Arbitrary Object of a Particular Type

```java
List<String> strings = Arrays.asList("apple", "banana", "cherry");

// Lambda expression
Collections.sort(strings, (s1, s2) -> s1.compareToIgnoreCase(s2));

// Method reference
Collections.sort(strings, String::compareToIgnoreCase);

// Another example
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
numbers.stream()
       .map(String::valueOf)  // Equivalent to: n -> String.valueOf(n)
       .forEach(System.out::println);
```

#### d) Reference to a Constructor

```java
// Lambda expression
Supplier<List<String>> supplier1 = () -> new ArrayList<>();

// Method reference
Supplier<List<String>> supplier2 = ArrayList::new;

// Constructor with parameters
Function<Integer, List<String>> listCreator = ArrayList::new;
List<String> list = listCreator.apply(10); // Creates ArrayList with initial capacity 10
```

## 2. Related Reference Types

### Constructor References

Similar to method references but specifically for constructors:

```java
// No-argument constructor
Supplier<StringBuilder> sbSupplier = StringBuilder::new;

// Single argument constructor
Function<String, LocalDate> dateParser = LocalDate::parse;

// Multiple arguments (using functional interfaces)
BiFunction<String, String, String> joiner = String::concat;
```

### Array Constructor References

```java
// Lambda expression
IntFunction<int[]> arrayCreator1 = size -> new int[size];

// Array constructor reference
IntFunction<int[]> arrayCreator2 = int[]::new;

int[] array = arrayCreator2.apply(5); // Creates int[5]
```

## 3. Functional Interfaces Compatibility

Method references work with functional interfaces that have compatible method signatures:

```java
// Predicate - boolean test(T t)
Predicate<String> isEmpty = String::isEmpty;

// Function - R apply(T t)
Function<String, Integer> lengthGetter = String::length;

// Consumer - void accept(T t)
Consumer<String> printer = System.out::println;

// Supplier - T get()
Supplier<Double> randomValue = Math::random;
```

## 4. Practical Examples

### Sorting with Method References

```java
List<Person> people = Arrays.asList(
    new Person("John", 25),
    new Person("Alice", 30),
    new Person("Bob", 20)
);

// Sort by age using lambda
people.sort((p1, p2) -> p1.getAge() - p2.getAge());

// Sort by age using method reference
people.sort(Comparator.comparing(Person::getAge));

// Sort by name using method reference
people.sort(Comparator.comparing(Person::getName));
```

### Stream Operations with Method References

```java
List<String> names = people.stream()
    .map(Person::getName)        // Equivalent to: p -> p.getName()
    .filter(String::isEmpty)     // Equivalent to: s -> s.isEmpty()
    .map(String::toUpperCase)    // Equivalent to: s -> s.toUpperCase()
    .collect(Collectors.toList());
```

### Method Reference with Custom Objects

```java
class Calculator {
    public static int square(int n) {
        return n * n;
    }

    public int cube(int n) {
        return n * n * n;
    }
}

// Static method reference
IntUnaryOperator squarer = Calculator::square;

// Instance method reference
Calculator calc = new Calculator();
IntUnaryOperator cuber = calc::cube;

System.out.println(squarer.applyAsInt(5)); // 25
System.out.println(cuber.applyAsInt(3));   // 27
```

## 5. When to Use Method References

### Use Method References When:

- The lambda expression simply calls an existing method
- The code becomes more readable
- You're calling static methods or constructors

### Stick with Lambda Expressions When:

- You need to perform additional operations
- The method call requires multiple parameters in a non-standard way
- Readability would suffer with method references

```java
// Lambda is better here
list.stream()
    .map(s -> {
        String trimmed = s.trim();
        return trimmed.isEmpty() ? "EMPTY" : trimmed;
    });

// Method reference is better here
list.stream()
    .map(String::trim)
    .filter(s -> !s.isEmpty());
```

## 6. Key Benefits

1. **Conciseness**: Reduces boilerplate code
2. **Readability**: Makes the intent clearer
3. **Reusability**: Encourages reuse of existing methods
4. **Maintainability**: Easier to maintain and refactor
