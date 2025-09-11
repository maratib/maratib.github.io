---
title: Dart language
slug: guides/flutter/dart-language
description: Dart language complete reference
sidebar:
  order: 1
---

- Dart language reference

## Hello World

The most basic Dart program that prints "Hello, World!" to the console. Every Dart application must have a `main()` function as its entry point.

```dart
void main() {
  print('Hello, World!');
}
```

## Variables & Data Types

### Variable Declaration

Different ways to declare variables in Dart with various mutability and type constraints.

```dart
var name = 'John'; // Type inferred as String
String name = 'John'; // Explicit type declaration
final age = 30; // Runtime constant (can't be reassigned)
const pi = 3.14; // Compile-time constant
dynamic dynamicVar = 'hello'; // Can hold any type, bypasses static type checking
```

### Basic Data Types

Dart's built-in primitive and core data types.

```dart
// Numbers - for integer and floating-point values
int age = 25; // Integer values
double price = 99.99; // Floating-point values
num anyNumber = 10; // Can be either int or double

// Strings - for text data
String name = 'Alice'; // Single line string
String multiLine = '''
This is a
multi-line string
'''; // Multi-line string using triple quotes

// Booleans - for true/false values
bool isActive = true;

// Runes - for representing Unicode code points
var heart = '\u2665'; // Heart symbol

// Symbols - used for reflection and metadata
#symbolName; // Symbol literal
```

## Operators

### Arithmetic Operators

Mathematical operations for performing calculations.

```dart
var a = 10, b = 3;
print(a + b); // 13 - Addition
print(a - b); // 7 - Subtraction
print(a * b); // 30 - Multiplication
print(a / b); // 3.333... - Division (returns double)
print(a ~/ b); // 3 - Integer division (truncates to integer)
print(a % b); // 1 - Modulus (remainder)
```

### Equality & Relational Operators

Operators for comparing values and determining relationships.

```dart
print(a == b); // false - Equality
print(a != b); // true - Inequality
print(a > b); // true - Greater than
print(a < b); // false - Less than
print(a >= b); // true - Greater than or equal to
print(a <= b); // false - Less than or equal to
```

### Logical Operators

Boolean logic operations for combining conditions.

```dart
bool x = true, y = false;
print(x && y); // false - Logical AND (both must be true)
print(x || y); // true - Logical OR (at least one true)
print(!x); // false - Logical NOT (inverts the value)
```

### Type Test Operators

Operators for checking types at runtime.

```dart
var value = 'hello';
print(value is String); // true - Type check
print(value is! int); // true - Negated type check
```

### Cascade Operator (..)

Allows multiple operations on the same object without repeating the object reference.

```dart
var person = Person()
  ..name = 'John' // Sets name property
  ..age = 30 // Sets age property
  ..introduce(); // Calls introduce method
```

### Null-aware Operators

Special operators for handling null values safely.

```dart
String? nullableString;
print(nullableString ?? 'default'); // 'default' - Null coalescing (returns right if left is null)
print(nullableString?.length); // null - Null-aware access (returns null if object is null)
nullableString ??= 'new value'; // Null-aware assignment (assigns only if currently null)
```

## Control Flow

### If-Else

Conditional execution based on boolean expressions.

```dart
if (age < 18) {
  print('Minor');
} else if (age < 65) {
  print('Adult');
} else {
  print('Senior');
}
```

### Switch Statement

Multi-way branch based on a single value, more efficient than multiple if-else statements.

```dart
switch (grade) {
  case 'A':
    print('Excellent');
    break; // Required to prevent fall-through
  case 'B':
    print('Good');
    break;
  default: // Handles all other cases
    print('Unknown');
}
```

### For Loops

Different ways to iterate over sequences or execute code repeatedly.

```dart
// Traditional for loop - when you need index control
for (var i = 0; i < 5; i++) {
  print(i);
}

// For-in loop - for iterating over iterables (lists, sets, etc.)
var list = [1, 2, 3];
for (var item in list) {
  print(item);
}

// forEach method - functional style iteration
list.forEach((item) => print(item));
```

### While Loops

Execute code repeatedly while a condition remains true.

```dart
// While loop - checks condition before execution
var i = 0;
while (i < 5) {
  print(i);
  i++;
}

// Do-while loop - executes at least once, then checks condition
var j = 0;
do {
  print(j);
  j++;
} while (j < 5);
```

## Functions

### Basic Function

Reusable blocks of code that perform specific tasks.

```dart
int add(int a, int b) {
  return a + b;
}

// Arrow function - shorthand for single expression functions
int multiply(int a, int b) => a * b;
```

### Optional Parameters

Parameters that can be omitted when calling a function.

```dart
// Named parameters - specified by name, enclosed in {}
void greet({String name = 'Guest', int age = 0}) {
  print('Hello $name, age $age');
}
greet(name: 'John', age: 30); // Calling with named parameters

// Positional parameters - optional parameters in []
void introduce(String name, [int? age]) {
  print('I am $name${age != null ? ', $age years old' : ''}');
}
introduce('Alice', 25); // With optional parameter
introduce('Bob'); // Without optional parameter
```

### First-class Functions

Functions can be assigned to variables, passed as arguments, and returned from other functions.

```dart
void executeFunction(Function func) {
  func(); // Execute the passed function
}

var sayHello = () => print('Hello'); // Function assigned to variable
executeFunction(sayHello); // Function passed as argument
```

### Anonymous Functions

Functions without a name, often used as arguments to other functions.

```dart
var numbers = [1, 2, 3];
numbers.forEach((number) { // Anonymous function as argument
  print(number * 2);
});
```

## Classes & Objects

### Basic Class

Blueprint for creating objects with properties and methods.

```dart
class Person {
  // Fields - variables that belong to the class
  String name;
  int age;

  // Constructor - special method for creating instances
  Person(this.name, this.age); // Shorthand for assigning parameters to fields

  // Named constructor - alternative way to create instances
  Person.anonymous() : name = 'Anonymous', age = 0;

  // Method - function that belongs to the class
  void introduce() {
    print('I am $name, $age years old');
  }

  // Getter - special method that returns a value
  String get description => '$name ($age)';

  // Setter - special method that sets a value
  set updateAge(int newAge) {
    age = newAge;
  }
}

// Usage - creating and using class instances
var person = Person('John', 30);
person.introduce();
```

### Inheritance

Creating a new class based on an existing class, inheriting its properties and methods.

```dart
class Employee extends Person { // Employee inherits from Person
  String position;

  Employee(String name, int age, this.position) : super(name, age); // super calls parent constructor

  @override // Indicates method is overriding parent method
  void introduce() {
    super.introduce(); // Call parent method
    print('I work as a $position');
  }
}
```

### Abstract Classes

Classes that can't be instantiated directly, used as base classes for inheritance.

```dart
abstract class Animal { // Cannot create Animal instances directly
  void makeSound(); // Abstract method (no implementation)

  void sleep() { // Concrete method with implementation
    print('Sleeping...');
  }
}

class Dog extends Animal {
  @override
  void makeSound() { // Must implement abstract method
    print('Woof!');
  }
}
```

### Interfaces

Contracts that classes can implement, requiring them to provide specific methods.

```dart
class Logger { // Regular class used as interface
  void log(String message) => print(message);
}

class ConsoleLogger implements Logger { // Implements Logger interface
  @override
  void log(String message) { // Must implement all interface methods
    print('LOG: $message');
  }
}
```

## Null Safety

### Nullable Types

Dart's null safety feature prevents null reference errors at compile time.

```dart
String? nullableString = null; // ? indicates variable can be null
String nonNullableString = 'hello'; // Cannot be null (compile-time error if assigned null)

// Null assertion operator - tells compiler value won't be null at runtime
String definitelyString = nullableString!; // Use with caution - can cause runtime error if null

// Late initialization - variable will be initialized before use, but not at declaration
late String lateString;
void initialize() {
  lateString = 'initialized'; // Must be initialized before use
}
```

### Null-aware Operators

Operators that handle null values gracefully without causing exceptions.

```dart
String? name;
print(name?.length); // null - Safe access (returns null instead of throwing error)
print(name ?? 'default'); // 'default' - Provides default value if null
name ??= 'assigned'; // Assigns value only if variable is currently null
```

## Collections

### Lists

Ordered collections of elements (like arrays in other languages).

```dart
List<int> numbers = [1, 2, 3]; // Type-annotated list
var names = <String>['John', 'Alice']; // Type-inferred list

// List methods - operations on lists
numbers.add(4); // Add element to end
numbers.removeAt(0); // Remove element at index
print(numbers.length); // Get number of elements
print(numbers.contains(2)); // Check if element exists

// List properties - attributes of lists
print(numbers.first); // First element
print(numbers.last); // Last element
print(numbers.isEmpty); // Check if empty

// Spread operator - expands collections into other collections
var combined = [...numbers, ...names]; // Combine two lists
```

### Sets

Unordered collections of unique elements.

```dart
Set<String> countries = {'USA', 'UK', 'Canada'}; // Type-annotated set
var numbers = <int>{1, 2, 3}; // Type-inferred set

// Set operations - mathematical operations on sets
var set1 = {1, 2, 3};
var set2 = {3, 4, 5};
print(set1.union(set2)); // {1, 2, 3, 4, 5} - All elements from both sets
print(set1.intersection(set2)); // {3} - Elements common to both sets
```

### Maps

Collections of key-value pairs (like dictionaries or objects).

```dart
Map<String, int> ages = { // Type-annotated map (String keys, int values)
  'John': 30,
  'Alice': 25,
};

var scores = <String, int>{}; // Empty map with type inference

// Map operations - working with key-value pairs
ages['Bob'] = 28; // Add new key-value pair or update existing
print(ages['John']); // 30 - Access value by key
print(ages.containsKey('Alice')); // true - Check if key exists

// Iterating - processing each key-value pair
ages.forEach((key, value) {
  print('$key: $value');
});
```

## Exception Handling

### Try-Catch

Handling errors and exceptional situations gracefully.

```dart
try {
  var result = 10 ~/ 0; // This will throw an exception
} on IntegerDivisionByZeroException { // Catch specific exception type
  print('Cannot divide by zero');
} catch (e) { // Catch any other exception
  print('Error: $e');
} finally { // Always executes, used for cleanup
  print('This always executes');
}
```

### Throwing Exceptions

Creating and raising exceptions in your code.

```dart
void checkAge(int age) {
  if (age < 0) {
    throw ArgumentError('Age cannot be negative'); // Throw built-in exception
  }
}

// Custom exception - user-defined exception types
class CustomException implements Exception {
  final String message;
  CustomException(this.message);

  @override
  String toString() => 'CustomException: $message'; // Custom string representation
}
```

## Asynchronous Programming

### Futures

Representing a potential value or error that will be available at some time in the future.

```dart
Future<String> fetchUser() async { // async marks function as asynchronous
  await Future.delayed(Duration(seconds: 2)); // Simulate network delay
  return 'User data'; // Return value wrapped in Future
}

void main() async { // main can also be async
  print('Loading...');
  var user = await fetchUser(); // await pauses execution until Future completes
  print(user);

  // Error handling with async/await
  try {
    var data = await fetchUser();
  } catch (e) {
    print('Error: $e');
  }
}
```

### Streams

Sequences of asynchronous events that can be listened to multiple times.

```dart
Stream<int> countStream(int max) async* { // async* for generator functions
  for (int i = 1; i <= max; i++) {
    await Future.delayed(Duration(seconds: 1)); // Wait between events
    yield i; // Emit value to stream
  }
}

void main() async {
  await for (var number in countStream(5)) { // await for processes stream events
    print(number);
  }
}
```

## Generics

### Generic Classes

Classes that can work with any data type while maintaining type safety.

```dart
class Box<T> { // T is type parameter
  T value;

  Box(this.value);

  T getValue() => value;
}

var stringBox = Box<String>('hello'); // Box specialized for String
var intBox = Box<int>(42); // Box specialized for int
```

### Generic Methods

Methods that can work with different types while maintaining type safety.

```dart
T first<T>(List<T> items) { // Generic method with type parameter T
  return items[0];
}

var firstString = first<String>(['a', 'b', 'c']); // T is String
var firstInt = first<int>([1, 2, 3]); // T is int
```

## Mixins

A way to reuse code across multiple class hierarchies without using inheritance.

```dart
mixin Logger { // mixin keyword defines a mixin
  void log(String message) {
    print('LOG: $message');
  }
}

mixin Timestamp {
  String get timestamp => DateTime.now().toString();
}

class Application with Logger, Timestamp { // with keyword includes mixins
  void run() {
    log('Application started at $timestamp'); // Use mixin functionality
  }
}
```

## Extensions

Adding functionality to existing libraries or classes without modifying their source code.

```dart
extension StringExtensions on String { // Extension on String type
  String get reversed => split('').reversed.join(); // New getter property

  bool get isPalindrome {
    var clean = replaceAll(RegExp(r'[^a-zA-Z0-9]'), '').toLowerCase();
    return clean == clean.reversed;
  }
}

void main() {
  print('hello'.reversed); // 'olleh' - Using extension method
  print('racecar'.isPalindrome); // true - Using extension property
}
```

## Libraries & Imports

### Importing

Including code from other files or packages in your Dart program.

```dart
// Import entire library
import 'dart:math'; // Dart core library

// Import with prefix - avoid name conflicts
import 'package:my_package/my_library.dart' as mylib;

// Import only specific members - reduce namespace pollution
import 'package:my_package/my_library.dart' show SomeClass;

// Import except specific members - exclude certain members
import 'package:my_package/my_library.dart' hide SomeClass;

// Deferred loading - load library only when needed (lazy loading)
import 'package:heavy_library/heavy.dart' deferred as heavy;
```

### Exporting

Making library members available to other libraries that import it.

```dart
// my_library.dart
library my_library; // Library directive (optional but recommended)

export 'src/utils.dart'; // Re-export all public members
export 'src/models.dart'; // Re-export from another file
```

### Part/Part of

Splitting a library across multiple files while maintaining a single library namespace.

```dart
// main.dart
library my_library; // Main library file

part 'utils.dart'; // Include part files
part 'models.dart';

// utils.dart
part of my_library; // Declare as part of main library

// models.dart
part of my_library; // All parts share the same namespace
```
