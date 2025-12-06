---
title: Java Versions
description: Java versions and features
---

# Comprehensive Guide: Java 9 to Java 25 Changes

## **Java 9 (September 2017)**

_The beginning of the 6-month release cycle with major modularization features._

### 1. **Module System - Java 9 (Project Jigsaw)**

_Introduces a new level of abstraction above packages called modules, allowing better encapsulation and dependency management._

```java
// module-info.java - defines module name, dependencies, and exports
module com.example.myapp {
    requires java.base;           // Implicit dependency
    requires java.sql;            // Explicit dependency
    exports com.example.myapp.api; // What this module exposes
}
```

### 2. **JShell (REPL Tool) - Java 9**

_A Read-Eval-Print Loop tool for interactive Java programming, making it easier to test snippets._

```bash
# Command line usage
jshell> int x = 10
x ==> 10

jshell> String greeting = "Hello"
greeting ==> "Hello"

jshell> System.out.println(x * 2)
20

jshell> /vars  # List all variables
```

### 3. **Factory Methods for Collections - Java 9**

_Immutable collections created with concise factory methods, making code more readable._

```java
// Create immutable collections easily
List<String> list = List.of("A", "B", "C");
Set<String> set = Set.of("A", "B", "C");
Map<String, Integer> map = Map.of("A", 1, "B", 2);

// For more than 10 entries
Map<String, Integer> bigMap = Map.ofEntries(
    Map.entry("A", 1),
    Map.entry("B", 2),
    Map.entry("C", 3)
);
```

### 4. **Private Interface Methods - Java 9**

_Allows private methods in interfaces to share common code between default methods._

```java
interface Calculator {
    default void add(int a, int b) {
        log("Adding: " + a + " + " + b);
        System.out.println(a + b);
    }

    default void multiply(int a, int b) {
        log("Multiplying: " + a + " * " + b);
        System.out.println(a * b);
    }

    // Private helper method - reduces code duplication
    private void log(String message) {
        System.out.println("LOG: " + message);
    }
}
```

### 5. **Process API Improvements - Java 9**

_Better control and monitoring of operating system processes._

```java
ProcessHandle current = ProcessHandle.current();
System.out.println("PID: " + current.pid());

ProcessHandle.Info info = current.info();
info.command().ifPresent(cmd -> System.out.println("Command: " + cmd));
info.arguments().ifPresent(args -> System.out.println("Args: " + Arrays.toString(args)));

// List all running processes
ProcessHandle.allProcesses()
    .filter(ph -> ph.info().command().isPresent())
    .limit(5)
    .forEach(ph -> System.out.println(ph.pid() + " " + ph.info().command()));
```

### 6. **Stream API Enhancements - Java 9**

_New methods for better stream manipulation: takeWhile, dropWhile, and iterate._

```java
// takeWhile - takes elements while predicate is true
List<Integer> numbers = List.of(1, 2, 3, 4, 5, 1);
List<Integer> result1 = numbers.stream()
    .takeWhile(n -> n < 4)  // Takes 1, 2, 3, stops at 4
    .collect(Collectors.toList());  // [1, 2, 3]

// dropWhile - drops elements while predicate is true
List<Integer> result2 = numbers.stream()
    .dropWhile(n -> n < 3)  // Drops 1, 2, takes rest
    .collect(Collectors.toList());  // [3, 4, 5, 1]

// New iterate method with predicate
Stream.iterate(0, n -> n < 10, n -> n + 2)  // Like for-loop
    .forEach(System.out::print);  // 0 2 4 6 8
```

## **Java 10 (March 2018)**

_A feature release focusing on local variable type inference._

### 1. **Local Variable Type Inference (var) - Java 10**

_Allows declaring local variables with var instead of explicit types, improving readability._

```java
// Old way
Map<String, List<Map<String, Object>>> complexMap = new HashMap<>();

// New way with var
var complexMap = new HashMap<String, List<Map<String, Object>>>();

// More examples
var list = new ArrayList<String>();  // Inferred as ArrayList<String>
var stream = list.stream();           // Inferred as Stream<String>
var path = Path.of("file.txt");       // Inferred as Path

// CANNOT use var for:
// - Method parameters
// - Return types
// - Fields
// - Lambda parameters
// - Without initializer
```

### 2. **Unmodifiable Collection Methods - Java 10**

_New copyOf methods to create unmodifiable copies of collections._

```java
List<String> original = new ArrayList<>();
original.add("A");
original.add("B");

List<String> copy = List.copyOf(original);  // Unmodifiable copy
Set<String> setCopy = Set.copyOf(original); // Unmodifiable set copy

// These throw UnsupportedOperationException if modified
// copy.add("C");  // ERROR!
```

### 3. **Optional.orElseThrow() - Java 10**

_Convenient method to get value or throw exception if empty._

```java
Optional<String> optional = Optional.of("Hello");

// Old way
String value1 = optional.orElseThrow(() -> new RuntimeException());

// New concise way (Java 10)
String value2 = optional.orElseThrow();  // Uses NoSuchElementException

// Equivalent to
String value3 = optional.get();  // But with better semantics
```

## **Java 11 (September 2018)**

_A Long-Term Support (LTS) release with significant features and removal of deprecated APIs._

### 1. **HTTP Client (Standard) - Java 11**

_New modern HTTP client API supporting HTTP/2 and WebSocket, replacing HttpURLConnection._

```java
HttpClient client = HttpClient.newBuilder()
    .version(HttpClient.Version.HTTP_2)
    .connectTimeout(Duration.ofSeconds(10))
    .build();

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.example.com/data"))
    .header("Content-Type", "application/json")
    .GET()
    .build();

// Synchronous request
HttpResponse<String> response = client.send(request,
    HttpResponse.BodyHandlers.ofString());
System.out.println("Status: " + response.statusCode());
System.out.println("Body: " + response.body());

// Asynchronous request
client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
    .thenApply(HttpResponse::body)
    .thenAccept(System.out::println);
```

### 2. **String Methods - Java 11**

_New helpful methods for String manipulation._

```java
String str = "  Hello World  ";

// isBlank() - checks if string is empty or only whitespace
System.out.println("".isBlank());      // true
System.out.println("   ".isBlank());   // true
System.out.println("a".isBlank());     // false

// strip() - better than trim() (Unicode aware)
System.out.println("\u2000Hello\u2000".strip());  // "Hello"
System.out.println(str.strip());                  // "Hello World"

// stripLeading() and stripTrailing()
System.out.println(str.stripLeading());   // "Hello World  "
System.out.println(str.stripTrailing());  // "  Hello World"

// repeat()
System.out.println("Java ".repeat(3));  // "Java Java Java "

// lines() - returns stream of lines
String multiline = "Line1\nLine2\r\nLine3";
multiline.lines().forEach(System.out::println);
```

### 3. **Local-Variable Syntax for Lambda Parameters - Java 11**

_Allows using var in lambda parameters for consistency._

```java
// Before Java 11
Predicate<String> oldWay = (String s) -> s.length() > 5;

// Java 11 - using var in lambda
Predicate<String> newWay = (var s) -> s.length() > 5;

// Useful when annotations are needed
BiFunction<String, String, String> function =
    (@NonNull var s1, @NonNull var s2) -> s1 + s2;
```

### 4. **Running Java Files Without Compilation - Java 11**

_Single-file source-code programs can be executed directly._

```java
// File: HelloWorld.java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

// Run directly without javac:
// java HelloWorld.java
```

### 5. **Collection.toArray() - Java 11**

_New default method to convert collections to arrays more conveniently._

```java
List<String> list = List.of("A", "B", "C");

// Old way
String[] array1 = list.toArray(new String[0]);

// Java 11 way
String[] array2 = list.toArray(String[]::new);  // Method reference
```

## **Java 12 (March 2019)**

_A feature release with switch expressions preview and new string methods._

### 1. **Switch Expressions (Preview) - Java 12**

_New form of switch that can return values and eliminates fall-through (preview feature)._

```java
// Traditional switch statement
int day = 3;
String dayType;
switch (day) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
        dayType = "Weekday";
        break;
    case 6:
    case 7:
        dayType = "Weekend";
        break;
    default:
        dayType = "Invalid";
}

// New switch expression (preview in Java 12)
dayType = switch (day) {
    case 1, 2, 3, 4, 5 -> "Weekday";
    case 6, 7 -> "Weekend";
    default -> "Invalid";
};

// Can return values
int numLetters = switch (day) {
    case 1 -> 6;  // "Monday"
    case 2 -> 7;  // "Tuesday"
    default -> 0;
};
```

### 2. **String Methods - Java 12**

_New methods for string transformation and indentation._

```java
String text = "Hello\nWorld";

// indent() - adds or removes leading whitespace
System.out.println(text.indent(2));  // Adds 2 spaces at beginning of each line
System.out.println(text.indent(-2)); // Removes 2 spaces if present

// transform() - applies function to string
String result = "hello".transform(s -> s.toUpperCase())
                       .transform(s -> s + " WORLD");
System.out.println(result);  // "HELLO WORLD"
```

### 3. **Teeing Collector - Java 12**

_Special collector that merges two collectors' results._

```java
import static java.util.stream.Collectors.*;

List<Integer> numbers = List.of(10, 20, 30, 40);

// Calculate average and sum simultaneously
record Stats(double average, int sum) {}

Stats stats = numbers.stream()
    .collect(teeing(
        averagingInt(i -> i),      // First collector
        summingInt(i -> i),        // Second collector
        Stats::new                 // Merge function
    ));

System.out.println("Average: " + stats.average());  // 25.0
System.out.println("Sum: " + stats.sum());          // 100
```

## **Java 13 (September 2019)**

_Adds text blocks and enhances switch expressions._

### 1. **Text Blocks (Preview) - Java 13**

_Multi-line string literals that automatically format strings._

```java
// Old way - messy with escape sequences
String json = "{\n" +
              "  \"name\": \"John\",\n" +
              "  \"age\": 30\n" +
              "}";

// New way with text blocks
String jsonBlock = """
    {
      "name": "John",
      "age": 30
    }
    """;

// HTML example
String html = """
    <html>
        <body>
            <h1>Hello, World!</h1>
        </body>
    </html>
    """;

// SQL query
String query = """
    SELECT id, name, email
    FROM users
    WHERE active = true
    ORDER BY name
    """;
```

### 2. **Switch Expressions Enhancements - Java 13**

_Adds yield keyword for returning values from switch branches._

```java
int day = 2;
String dayName = switch (day) {
    case 1 -> "Monday";
    case 2 -> {
        System.out.println("It's Tuesday!");
        yield "Tuesday";  // yield returns value from block
    }
    case 3 -> "Wednesday";
    default -> "Unknown";
};

// Traditional style with yield
int length = switch (dayName) {
    case "Monday":
    case "Friday":
        yield 6;
    case "Tuesday":
        yield 7;
    default:
        yield 0;
};
```

## **Java 14 (March 2020)**

_Records, pattern matching for instanceof, and helpful NullPointerExceptions._

### 1. **Records (Preview) - Java 14**

_Concise syntax for declaring data carrier classes._

```java
// Old way - verbose
public final class Person {
    private final String name;
    private final int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // Getters, equals(), hashCode(), toString() methods...
}

// New way with record
public record Person(String name, int age) {
    // Automatically gets:
    // - Private final fields
    // - Constructor
    // - Getters (name(), age())
    // - equals(), hashCode(), toString()
}

// Usage
Person person = new Person("Alice", 30);
System.out.println(person.name());  // Alice
System.out.println(person);         // Person[name=Alice, age=30]

// Can add custom methods
record Employee(String name, int id, double salary) {
    public String toJson() {
        return String.format("{\"name\":\"%s\",\"id\":%d}", name, id);
    }
}
```

### 2. **Pattern Matching for instanceof (Preview) - Java 14**

_Simplifies common pattern of instanceof check and cast._

```java
// Old way
Object obj = "Hello";
if (obj instanceof String) {
    String s = (String) obj;
    System.out.println(s.length());
}

// New way with pattern matching
if (obj instanceof String s) {  // s is automatically cast
    System.out.println(s.length());
    // Can use s here
}

// Can combine with conditions
if (obj instanceof String s && s.length() > 5) {
    System.out.println("Long string: " + s);
}
```

### 3. **Helpful NullPointerExceptions - Java 14**

_NullPointerExceptions now show which variable was null._

```java
public class HelpfulNPE {
    public static void main(String[] args) {
        Person person = null;
        // Old: NullPointerException (no details)
        // New: Cannot invoke "Person.getName()" because "person" is null
        System.out.println(person.getName());
    }
}

class Person {
    String getName() { return "John"; }
}
```

## **Java 15 (September 2020)**

_Text blocks and records become standard, sealed classes preview._

### 1. **Sealed Classes (Preview) - Java 15**

_Restricts which classes can extend or implement a class/interface._

```java
// Base sealed class
public sealed class Shape
    permits Circle, Rectangle, Triangle {  // Explicit permitted subclasses
    // Class definition
}

// Final subclass
public final class Circle extends Shape {
    private final double radius;
    // Implementation
}

// Sealed subclass
public sealed class Rectangle extends Shape
    permits Square {  // Can further restrict
    // Implementation
}

// Non-sealed subclass (allows unknown subclasses)
public non-sealed class Triangle extends Shape {
    // Implementation - can be extended by any class
}

// Records can be sealed too
public sealed interface Expr
    permits ConstantExpr, PlusExpr, TimesExpr {

    record ConstantExpr(int i) implements Expr {}
    record PlusExpr(Expr a, Expr b) implements Expr {}
    record TimesExpr(Expr a, Expr b) implements Expr {}
}
```

### 2. **Text Blocks Become Standard - Java 15**

_Text blocks are no longer preview and include new escape sequences._

```java
// Now standard feature
String json = """
    {
      "name": "John",
      "age": 30,
      "city": "New York"
    }
    """;

// New escape sequences
String singleLine = """
    This is a single line \
    that continues here \
    but appears as one line""";
// Result: "This is a single line that continues here but appears as one line"

// Escape newline
String noNewline = """
    Line 1\
    Line 2""";
// Result: "Line 1Line 2"
```

## **Java 16 (March 2021)**

_Records, pattern matching, and sealed classes become standard features._

### 1. **Records (Standard) - Java 16**

_Records are now a standard language feature._

```java
// Full featured records
public record Point(int x, int y) {
    // Compact constructor for validation
    public Point {
        if (x < 0 || y < 0) {
            throw new IllegalArgumentException("Coordinates must be non-negative");
        }
    }

    // Custom methods
    public double distanceFromOrigin() {
        return Math.sqrt(x * x + y * y);
    }
}

// Local records (inside methods)
public class Geometry {
    public double calculateArea() {
        record Dimensions(double width, double height) {}

        Dimensions dim = new Dimensions(10.5, 20.3);
        return dim.width() * dim.height();
    }
}
```

### 2. **Pattern Matching for instanceof (Standard) - Java 16**

_Pattern matching for instanceof is now a standard feature._

```java
// Widely usable now
public void process(Object obj) {
    if (obj instanceof String s) {
        System.out.println("String length: " + s.length());
    } else if (obj instanceof Integer i && i > 0) {
        System.out.println("Positive integer: " + i);
    } else if (obj instanceof List<?> list && !list.isEmpty()) {
        System.out.println("Non-empty list: " + list.get(0));
    }
}
```

### 3. **Stream.toList() - Java 16**

_Convenient method to collect stream elements to an unmodifiable list._

```java
List<String> names = List.of("Alice", "Bob", "Charlie");

// Old way
List<String> result1 = names.stream()
    .filter(n -> n.startsWith("A"))
    .collect(Collectors.toList());

// New concise way
List<String> result2 = names.stream()
    .filter(n -> n.startsWith("A"))
    .toList();  // Returns unmodifiable list

// result2.add("David");  // Throws UnsupportedOperationException
```

## **Java 17 (September 2021)**

_Long-Term Support (LTS) release with sealed classes becoming standard._

### 1. **Sealed Classes (Standard) - Java 17**

_Sealed classes are now a standard language feature._

```java
// Define a sealed hierarchy
public sealed interface Vehicle permits Car, Truck, Motorcycle {
    String getType();
}

public final class Car implements Vehicle {
    public String getType() { return "Car"; }
}

public final class Truck implements Vehicle {
    public String getType() { return "Truck"; }
}

public non-sealed class Motorcycle implements Vehicle {
    public String getType() { return "Motorcycle"; }
}

// Using with pattern matching
public void processVehicle(Vehicle v) {
    switch (v) {
        case Car c -> System.out.println("It's a car");
        case Truck t -> System.out.println("It's a truck");
        case Motorcycle m -> System.out.println("It's a motorcycle");
        // No default needed - exhaustiveness guaranteed by compiler
    }
}
```

### 2. **Pattern Matching for switch (Preview) - Java 17**

_Extends pattern matching to switch expressions and statements._

```java
// Pattern matching in switch (preview)
Object obj = "Hello";

String result = switch (obj) {
    case Integer i -> String.format("int %d", i);
    case Long l -> String.format("long %d", l);
    case Double d -> String.format("double %f", d);
    case String s -> String.format("String %s", s);
    case null -> "It was null!";
    default -> obj.toString();
};

// Guarded patterns
static String formatterPatternSwitch(Object obj) {
    return switch (obj) {
        case Integer i when i > 0 -> "Positive integer: " + i;
        case Integer i -> "Integer: " + i;
        case String s when s.length() > 5 -> "Long string: " + s;
        case String s -> "String: " + s;
        default -> "Unknown";
    };
}
```

### 3. **Strongly Encapsulate JDK Internals - Java 17**

_Restricts access to internal JDK APIs by default._

```java
// Many internal APIs now require --add-opens to access
// Old code that might break:
// sun.misc.BASE64Encoder  // Use java.util.Base64 instead
// sun.misc.Unsafe         // Limited access

// Solution: Use public APIs
import java.util.Base64;

Base64.Encoder encoder = Base64.getEncoder();
String encoded = encoder.encodeToString("data".getBytes());
```

## **Java 18 (March 2022)**

_Adds UTF-8 by default and simple web server._

### 1. **UTF-8 by Default - Java 18**

_Makes UTF-8 the default charset for all Java APIs._

```java
// Before Java 18: charset depended on platform
// After Java 18: UTF-8 always used by default

String text = "Hello 世界";
byte[] bytes = text.getBytes();  // Uses UTF-8 by default
String decoded = new String(bytes);  // Also UTF-8

// Still can specify charset explicitly
byte[] latinBytes = text.getBytes(StandardCharsets.ISO_8859_1);
```

### 2. **Simple Web Server - Java 18**

_Command-line tool and API for simple HTTP server._

```bash
# Command line usage
jwebserver -p 8000 -b localhost

# Or programmatically
```

```java
import com.sun.net.httpserver.SimpleFileServer;
import java.net.InetSocketAddress;
import java.nio.file.Path;

// Create simple file server
var server = SimpleFileServer.createFileServer(
    new InetSocketAddress(8080),
    Path.of("/var/www"),
    SimpleFileServer.OutputLevel.VERBOSE
);
server.start();
```

### 3. **Code Snippets in JavaDoc - Java 18**

_Enhanced JavaDoc with @snippet tag for including code examples._

```java
/**
 * A class for demonstrating snippets.
 *
 * {@snippet :
 * public class Example {
 *     public static void main(String[] args) {
 *         System.out.println("Hello");  // @highlight substring="println"
 *     }
 * }
 * }
 *
 * {@snippet file="Example.java" region="main"}
 */
public class DocumentationExample {
    // ...
}
```

## **Java 19 (September 2022)**

_Virtual threads preview and structured concurrency._

### 1. **Virtual Threads (Preview) - Java 19**

_Lightweight threads for high-throughput concurrent applications._

```java
// Creating virtual threads
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    // Submit 10,000 tasks easily
    for (int i = 0; i < 10_000; i++) {
        executor.submit(() -> {
            Thread.sleep(Duration.ofSeconds(1));
            System.out.println("Task completed");
            return i;
        });
    }
}

// Creating virtual threads directly
Thread.startVirtualThread(() -> {
    System.out.println("Running in virtual thread");
});

// Using Thread.Builder
Thread.Builder builder = Thread.ofVirtual().name("worker-", 0);
Thread virtualThread = builder.start(() -> {
    System.out.println("Virtual thread running");
});
```

### 2. **Structured Concurrency (Preview) - Java 19**

_Simplifies error handling and cancellation in concurrent code._

```java
import jdk.incubator.concurrent.StructuredTaskScope;

// Structured concurrency example
String getUserInfo() throws Exception {
    try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
        Future<String> user = scope.fork(() -> fetchUser());
        Future<String> profile = scope.fork(() -> fetchProfile());

        scope.join();           // Join both subtasks
        scope.throwIfFailed();  // Propagate any exception

        return user.resultNow() + ": " + profile.resultNow();
    }
}
```

### 3. **Pattern Matching for switch (Third Preview) - Java 19**

_Further refinements to pattern matching for switch._

```java
// Record patterns in switch (preview)
record Point(int x, int y) {}

String classify(Object obj) {
    return switch (obj) {
        case Point(int x, int y) when x > 0 && y > 0 ->
            "Point in first quadrant";
        case Point(int x, int y) when x < 0 && y > 0 ->
            "Point in second quadrant";
        case String s -> "String: " + s;
        case null -> "Null object";
        default -> "Unknown";
    };
}
```

## **Java 20 (March 2023)**

_Virtual threads and structured concurrency second preview._

### 1. **Virtual Threads (Second Preview) - Java 20**

_Enhanced virtual threads with better integration._

```java
// Using virtual threads with ExecutorService
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    List<Future<String>> futures = new ArrayList<>();

    for (int i = 0; i < 1000; i++) {
        int taskId = i;
        futures.add(executor.submit(() -> {
            Thread.sleep(100);
            return "Task " + taskId + " completed";
        }));
    }

    // Wait for all tasks
    for (Future<String> future : futures) {
        System.out.println(future.get());
    }
}
```

### 2. **Scoped Values (Preview) - Java 20**

_Immutable data that can be safely shared within and across threads._

```java
import jdk.incubator.concurrent.ScopedValue;

// Define scoped value
private static final ScopedValue<String> USERNAME = ScopedValue.newInstance();

// Set and use scoped value
ScopedValue.where(USERNAME, "alice")
           .run(() -> {
               System.out.println(USERNAME.get());  // "alice"
               // Passed to child threads automatically
           });
```

## **Java 21 (September 2023)**

_Long-Term Support (LTS) release with major concurrency features._

### 1. **Virtual Threads (Standard) - Java 21**

_Virtual threads become a standard feature._

```java
// Production-ready virtual threads
ThreadFactory virtualThreadFactory = Thread.ofVirtual().factory();
ExecutorService executor = Executors.newThreadPerTaskExecutor(virtualThreadFactory);

// Platform threads vs virtual threads
Thread platformThread = Thread.ofPlatform()
    .name("platform-thread")
    .start(() -> System.out.println("Platform thread"));

Thread virtualThread = Thread.ofVirtual()
    .name("virtual-thread")
    .start(() -> System.out.println("Virtual thread"));

// Characteristics
System.out.println("Virtual: " + virtualThread.isVirtual());  // true
System.out.println("Daemon: " + virtualThread.isDaemon());    // true
```

### 2. **Structured Concurrency (Standard) - Java 21**

_Structured concurrency becomes a standard feature._

```java
import java.util.concurrent.StructuredTaskScope;

Response handle() throws ExecutionException, InterruptedException {
    try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
        Future<String> user = scope.fork(() -> findUser());
        Future<Integer> order = scope.fork(() -> fetchOrder());

        scope.join();           // Wait for both
        scope.throwIfFailed();  // Throw if any failed

        return new Response(user.resultNow(), order.resultNow());
    }
}

// Different shutdown policies
try (var scope = new StructuredTaskScope.ShutdownOnSuccess<String>()) {
    scope.fork(() -> fetchFromSource1());
    scope.fork(() -> fetchFromSource2());
    scope.fork(() -> fetchFromSource3());

    scope.join();
    String result = scope.result();  // First successful result
}
```

### 3. **Pattern Matching for switch (Standard) - Java 21**

_Pattern matching for switch becomes a standard feature._

```java
// Exhaustive patterns with sealed hierarchies
sealed interface Shape permits Circle, Rectangle, Triangle {
    double area();
}

record Circle(double radius) implements Shape {
    public double area() { return Math.PI * radius * radius; }
}

record Rectangle(double width, double height) implements Shape {
    public double area() { return width * height; }
}

record Triangle(double base, double height) implements Shape {
    public double area() { return 0.5 * base * height; }
}

String describe(Shape s) {
    return switch (s) {
        case Circle c -> "Circle with area " + c.area();
        case Rectangle r -> "Rectangle with area " + r.area();
        case Triangle t -> "Triangle with area " + t.area();
        // No default needed - compiler knows all cases covered
    };
}
```

### 4. **Record Patterns - Java 21**

_Deconstruct record values directly in patterns._

```java
record Point(int x, int y) {}
record Line(Point start, Point end) {}

// Nested record patterns
double length(Object obj) {
    return switch (obj) {
        case Point(int x, int y) -> Math.sqrt(x * x + y * y);
        case Line(Point(var x1, var y1), Point(var x2, var y2)) ->
            Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        default -> 0.0;
    };
}

// Usage with instanceof
if (obj instanceof Line(Point p1, Point p2)) {
    System.out.println("Line from " + p1 + " to " + p2);
}
```

## **Java 22 (March 2024)**

_Adds string templates and unnamed patterns._

### 1. **String Templates (Preview) - Java 22**

_Interpolates values into strings with validation._

```java
// STR template processor (implicit import)
String name = "Alice";
int age = 30;

String message = STR."Hello \{name}, you are \{age} years old";
// Result: "Hello Alice, you are 30 years old"

// FMT for formatted strings
double price = 19.99;
String formatted = FMT."Price: %8.2f\{price}";
// Result: "Price:    19.99"

// Custom template processors
var INTER = StringTemplate.Processor.of(
    (StringTemplate st) -> st.interpolate().toUpperCase()
);

String shout = INTER."Important: \{name}";
// Result: "IMPORTANT: ALICE"
```

### 2. **Unnamed Patterns and Variables - Java 22**

_Use underscore for unused patterns and variables._

```java
// Unnamed pattern variable
if (obj instanceof Point(_, int y)) {  // Don't care about x
    System.out.println("Y coordinate: " + y);
}

// Unnamed variable
try {
    int _ = Integer.parseInt("123");  // Result not needed
} catch (NumberFormatException _) {   // Exception not needed
    System.out.println("Invalid number");
}

// In for loops
for (int i = 0, _ = getInitialCount(); i < 10; i++) {
    System.out.println(i);  // Don't need the initial count
}

// Multiple unnamed
record Triple(Object a, Object b, Object c) {}

Triple triple = new Triple("A", "B", "C");
if (triple instanceof Triple(_, String b, _)) {
    System.out.println("Middle is: " + b);  // "B"
}
```

## **Java 23 (September 2024)**

_Latest features including primitive types in patterns._

### 1. **Primitive Types in Patterns - Java 23**

_Pattern matching for primitive values._

```java
// Pattern matching with primitives
Object obj = 42;

if (obj instanceof int i) {
    System.out.println("It's an int: " + i);
}

// In switch expressions
String describeNumber(Object n) {
    return switch (n) {
        case byte b -> "tiny number: " + b;
        case short s -> "small number: " + s;
        case int i -> "integer: " + i;
        case long l -> "big integer: " + l;
        case float f -> "floating point: " + f;
        case double d -> "double precision: " + d;
        default -> "not a number";
    };
}
```

### 2. **Stream Gatherers - Java 23**

_Custom intermediate operations for streams._

```java
// Custom stream operations
List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6);

// Built-in gatherers
List<List<Integer>> windows = numbers.stream()
    .gather(Gatherers.windowSliding(3))
    .toList();
// Result: [[1,2,3], [2,3,4], [3,4,5], [4,5,6]]

// Custom gatherer
Gatherer<Integer, ?, Integer> runningMax = Gatherer.of(
    () -> new int[]{Integer.MIN_VALUE},
    (state, element, downstream) -> {
        state[0] = Math.max(state[0], element);
        downstream.push(state[0]);
        return true;
    }
);

List<Integer> maxSoFar = numbers.stream()
    .gather(runningMax)
    .toList();
// Result: [1, 2, 3, 4, 5, 6]
```

## **Java 24 & 25 (Future Releases)**

_Upcoming features (subject to change)._

### Expected Features:

1. **Value Objects** - Immutable identity-less objects
2. **Enhanced Generics** - Better generic type inference
3. **Foreign Function & Memory API** - Final version
4. **Vector API** - For SIMD operations
5. **Project Loom** - Continued concurrency improvements

---

## **Summary of Key Changes by Version**

| Version | Year | Type    | Key Features                                       |
| ------- | ---- | ------- | -------------------------------------------------- |
| **9**   | 2017 | Major   | Modules, JShell, Factory Collections               |
| **10**  | 2018 | Feature | Local variable type inference (var)                |
| **11**  | 2018 | LTS     | HTTP Client, Launch single-file programs           |
| **12**  | 2019 | Feature | Switch expressions (preview), Teeing collector     |
| **13**  | 2019 | Feature | Text blocks (preview), Switch expressions enhanced |
| **14**  | 2020 | Feature | Records (preview), Pattern matching instanceof     |
| **15**  | 2020 | Feature | Text blocks (standard), Sealed classes (preview)   |
| **16**  | 2021 | Feature | Records (standard), Pattern matching (standard)    |
| **17**  | 2021 | LTS     | Sealed classes (standard), Pattern matching switch |
| **18**  | 2022 | Feature | UTF-8 default, Simple web server                   |
| **19**  | 2022 | Feature | Virtual threads (preview), Structured concurrency  |
| **20**  | 2023 | Feature | Virtual threads (2nd preview), Scoped values       |
| **21**  | 2023 | LTS     | Virtual threads (standard), Record patterns        |
| **22**  | 2024 | Feature | String templates, Unnamed patterns                 |
| **23**  | 2024 | Feature | Primitive patterns, Stream gatherers               |
