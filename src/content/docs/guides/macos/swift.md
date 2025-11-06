---
title: Swift Fundamentals
slug: guides/macos/swift
description: Swift Fundamentals
sidebar:
  order: 1
---

### What is Swift?

- **Developed by Apple** in 2014
- **Modern, safe, fast** programming language
- **Open-source** and cross-platform
- Used for iOS, macOS, watchOS, tvOS, and server-side development

### Key Features

- **Type-safe** with type inference
- **Memory-safe** with Automatic Reference Counting (ARC)
- **Protocol-oriented** programming
- **Expressive** and concise syntax
- **Functional programming** patterns

## Setting Up Your Environment <a name="setup"></a>

### Option 1: Xcode (Recommended)

```bash
# Download from Mac App Store
# Includes Swift compiler, iOS simulator, and full IDE
```

### Option 2: Swift Playgrounds

- iPad app for learning Swift
- Interactive coding environment

### Option 3: Online Compilers

- [Online Swift Playground](https://swiftfiddle.com)
- [Repl.it](https://repl.it/languages/swift)

### Option 4: Command Line (macOS/Linux)

```bash
# Install Swift from swift.org
# Verify installation
swift --version

# Create and run Swift files
echo 'print("Hello, Swift!")' > hello.swift
swift hello.swift
```

## Basic Syntax and Fundamentals <a name="basics"></a>

### Hello World

```swift
// Simple print statement
print("Hello, World!")

// Multi-line string
print("""
Hello,
World!
""")
```

### Variables and Constants

```swift
// Variables (mutable)
var name = "John"
var age = 25
var height = 1.75
var isStudent = true

// Constants (immutable)
let firstName = "Jane"
let maxAttempts = 3
let pi = 3.14159

// Type annotations (explicit typing)
var score: Int = 100
var temperature: Double = 23.5
var message: String = "Welcome"
var isActive: Bool = false

// Multiple declarations
var x = 0, y = 0, z = 0
let red, green, blue: Double
red = 1.0
green = 0.5
blue = 0.2
```

### Comments

```swift
// Single-line comment

/*
 Multi-line
 comment
*/

/// Documentation comment
/// - Parameter name: The name to greet
/// - Returns: A greeting string
func greet(name: String) -> String {
    return "Hello, \(name)!"
}
```

### String Interpolation

```swift
let name = "Alice"
let age = 30

// Basic interpolation
let message = "Hello, my name is \(name) and I'm \(age) years old."

// Expressions in interpolation
let calculation = "5 + 3 = \(5 + 3)"

// Multi-line with interpolation
let bio = """
Name: \(name)
Age: \(age)
Next year: \(age + 1)
"""
```

## Data Types and Collections <a name="data-types"></a>

### Basic Data Types

```swift
// Integers
let minInt8 = Int8.min    // -128
let maxInt8 = Int8.max    // 127
let minInt = Int.min      // Platform-dependent
let maxInt = Int.max      // Platform-dependent

// Floating-point numbers
let doubleValue: Double = 3.14159  // 64-bit
let floatValue: Float = 3.14       // 32-bit

// Boolean
let isTrue = true
let isFalse = false

// Character
let letter: Character = "A"
let emoji: Character = "😀"

// String
let greeting = "Hello, Swift!"
let emptyString = ""
```

### Collections

#### Arrays

```swift
// Creating arrays
var numbers = [1, 2, 3, 4, 5]
var names: [String] = ["Alice", "Bob", "Charlie"]
var emptyArray: [Int] = []
var repeatedArray = Array(repeating: 0, count: 5)

// Accessing and modifying
print(numbers[0])           // 1
numbers[1] = 20            // Modify
numbers.append(6)          // Add to end
numbers.insert(0, at: 0)   // Insert at beginning
numbers.removeLast()        // Remove last
numbers.remove(at: 2)      // Remove at index

// Array properties and methods
print(numbers.count)       // Number of elements
print(numbers.isEmpty)     // Check if empty
print(numbers.contains(3)) // Check if contains value

// Iteration
for number in numbers {
    print(number)
}

for (index, number) in numbers.enumerated() {
    print("Index \(index): \(number)")
}

// Functional methods
let doubled = numbers.map { $0 * 2 }
let evenNumbers = numbers.filter { $0 % 2 == 0 }
let sum = numbers.reduce(0, +)
```

#### Dictionaries

```swift
// Creating dictionaries
var ages = ["Alice": 25, "Bob": 30, "Charlie": 35]
var scores: [String: Int] = [:]
var coordinates: [String: Double] = ["x": 10.5, "y": 20.3]

// Accessing and modifying
print(ages["Alice"]!)                    // Force unwrap (dangerous)
print(ages["Alice"] ?? 0)               // Safe with default
ages["David"] = 28                      // Add new key-value
ages["Alice"] = 26                      // Update existing
ages["Bob"] = nil                       // Remove key

// Dictionary properties and methods
print(ages.count)
print(ages.isEmpty)
print(ages.keys)     // All keys
print(ages.values)   // All values

// Iteration
for (name, age) in ages {
    print("\(name) is \(age) years old")
}

for name in ages.keys {
    print(name)
}
```

#### Sets

```swift
// Creating sets
var uniqueNumbers: Set<Int> = [1, 2, 3, 4, 5]
var colors = Set(["red", "green", "blue"])
var emptySet: Set<String> = []

// Set operations
let oddNumbers: Set = [1, 3, 5, 7, 9]
let evenNumbers: Set = [2, 4, 6, 8, 10]
let primeNumbers: Set = [2, 3, 5, 7]

let union = oddNumbers.union(evenNumbers)          // All elements
let intersection = oddNumbers.intersection(primeNumbers) // Common elements
let difference = oddNumbers.subtracting(primeNumbers)    // In A but not B
let symmetricDiff = oddNumbers.symmetricDifference(primeNumbers) // Not in both

// Set methods
uniqueNumbers.insert(6)
uniqueNumbers.remove(3)
print(uniqueNumbers.contains(2))
```

### Tuples

```swift
// Creating tuples
let person = (name: "Alice", age: 25, isStudent: true)
let coordinates = (x: 10.5, y: 20.3)
let simpleTuple = ("Hello", 42)

// Accessing tuple elements
print(person.name)        // "Alice"
print(person.0)           // "Alice" - by index
print(coordinates.x)      // 10.5

// Decomposition
let (name, age, isStudent) = person
print(name)               // "Alice"

// Ignoring elements
let (_, justAge, _) = person
print(justAge)            // 25

// Returning multiple values from function
func calculateStats(_ numbers: [Int]) -> (min: Int, max: Int, sum: Int) {
    let min = numbers.min() ?? 0
    let max = numbers.max() ?? 0
    let sum = numbers.reduce(0, +)
    return (min, max, sum)
}

let stats = calculateStats([1, 5, 3, 8, 2])
print("Min: \(stats.min), Max: \(stats.max), Sum: \(stats.sum)")
```

## Control Flow <a name="control-flow"></a>

### Conditional Statements

#### If-Else

```swift
let temperature = 25

// Basic if
if temperature > 30 {
    print("It's hot!")
}

// If-else
if temperature > 25 {
    print("Warm")
} else {
    print("Cool")
}

// Else-if
if temperature > 30 {
    print("Hot")
} else if temperature > 20 {
    print("Warm")
} else if temperature > 10 {
    print("Cool")
} else {
    print("Cold")
}

// Multiple conditions
let isSunny = true
if temperature > 25 && isSunny {
    print("Perfect beach weather!")
}

if temperature < 10 || temperature > 35 {
    print("Extreme weather")
}

// Optional binding in conditions
var optionalName: String? = "John"
if let name = optionalName {
    print("Hello, \(name)")
}

// Multiple optional bindings
var optionalAge: Int? = 25
if let name = optionalName, let age = optionalAge {
    print("\(name) is \(age) years old")
}

// Guard statement (early return)
func processUser(name: String?, age: Int?) {
    guard let name = name, let age = age, age >= 18 else {
        print("Invalid user data")
        return
    }
    print("Processing \(name), age \(age)")
}
```

#### Switch Statement

```swift
let grade = "B"

// Basic switch
switch grade {
case "A":
    print("Excellent!")
case "B":
    print("Good")
case "C":
    print("Average")
case "D":
    print("Below average")
case "F":
    print("Fail")
default:
    print("Invalid grade")
}

// Multiple values
let character = "a"
switch character {
case "a", "e", "i", "o", "u":
    print("Vowel")
case "b", "c", "d", "f", "g", "h", "j", "k", "l", "m",
     "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z":
    print("Consonant")
default:
    print("Not a letter")
}

// Range matching
let score = 85
switch score {
case 90...100:
    print("A")
case 80..<90:
    print("B")
case 70..<80:
    print("C")
case 60..<70:
    print("D")
case 0..<60:
    print("F")
default:
    print("Invalid score")
}

// Tuple matching
let point = (1, 1)
switch point {
case (0, 0):
    print("Origin")
case (_, 0):
    print("On x-axis")
case (0, _):
    print("On y-axis")
case (-2...2, -2...2):
    print("Inside 2x2 square")
case let (x, y) where x == y:
    print("On diagonal line y = x")
case let (x, y):
    print("Point at (\(x), \(y))")
}

// Value binding
let anotherPoint = (2, 0)
switch anotherPoint {
case (let x, 0):
    print("On x-axis with x = \(x)")
case (0, let y):
    print("On y-axis with y = \(y)")
case let (x, y):
    print("Somewhere else at (\(x), \(y))")
}
```

### Loops

#### For Loops

```swift
// Range-based loops
for i in 1...5 {
    print(i)  // 1, 2, 3, 4, 5
}

for i in 1..<5 {
    print(i)  // 1, 2, 3, 4
}

// Iterating over arrays
let names = ["Alice", "Bob", "Charlie"]
for name in names {
    print(name)
}

// Iterating with index
for (index, name) in names.enumerated() {
    print("\(index): \(name)")
}

// Iterating over dictionaries
let ages = ["Alice": 25, "Bob": 30]
for (name, age) in ages {
    print("\(name) is \(age)")
}

// Stride for custom increments
for i in stride(from: 0, to: 10, by: 2) {
    print(i)  // 0, 2, 4, 6, 8
}

for i in stride(from: 10, through: 0, by: -2) {
    print(i)  // 10, 8, 6, 4, 2, 0
}
```

#### While Loops

```swift
// While loop
var counter = 5
while counter > 0 {
    print(counter)
    counter -= 1
}

// Repeat-while (do-while equivalent)
var number = 1
repeat {
    print(number)
    number += 1
} while number <= 5

// Break and continue
for i in 1...10 {
    if i == 3 {
        continue  // Skip 3
    }
    if i == 8 {
        break     // Stop at 8
    }
    print(i)      // 1, 2, 4, 5, 6, 7
}

// Labeled statements
outerLoop: for i in 1...3 {
    innerLoop: for j in 1...3 {
        if i == 2 && j == 2 {
            break outerLoop
        }
        print("i: \(i), j: \(j)")
    }
}
```

## Functions <a name="functions"></a>

### Function Basics

```swift
// Basic function
func greet() {
    print("Hello!")
}

// Function with parameters
func greet(person: String) {
    print("Hello, \(person)!")
}

// Function with return value
func square(number: Int) -> Int {
    return number * number
}

// Multiple parameters
func add(_ a: Int, _ b: Int) -> Int {
    return a + b
}

// Multiple return values (using tuple)
func minMax(array: [Int]) -> (min: Int, max: Int)? {
    if array.isEmpty { return nil }
    var currentMin = array[0]
    var currentMax = array[0]
    for value in array[1..<array.count] {
        if value < currentMin {
            currentMin = value
        } else if value > currentMax {
            currentMax = value
        }
    }
    return (currentMin, currentMax)
}

// Using the functions
greet()
greet(person: "Alice")
let result = square(number: 5)
let sum = add(3, 4)

if let bounds = minMax(array: [8, 3, 9, 2, 7]) {
    print("Min: \(bounds.min), Max: \(bounds.max)")
}
```

### Parameter Variations

```swift
// Default parameters
func greet(_ person: String, nicely: Bool = true) {
    if nicely {
        print("Hello, \(person)!")
    } else {
        print("Oh, it's \(person) again...")
    }
}

greet("Alice")                    // Uses default
greet("Bob", nicely: false)       // Override default

// Variadic parameters
func average(_ numbers: Double...) -> Double {
    var total: Double = 0
    for number in numbers {
        total += number
    }
    return numbers.isEmpty ? 0 : total / Double(numbers.count)
}

print(average(1, 2, 3, 4, 5))    // 3.0

// In-out parameters
func swapTwoInts(_ a: inout Int, _ b: inout Int) {
    let temporaryA = a
    a = b
    b = temporaryA
}

var x = 5
var y = 10
swapTwoInts(&x, &y)
print("x: \(x), y: \(y)")        // x: 10, y: 5
```

### Function Types

```swift
// Function types
func add(_ a: Int, _ b: Int) -> Int {
    return a + b
}

func multiply(_ a: Int, _ b: Int) -> Int {
    return a * b
}

// Assigning functions to variables
var mathFunction: (Int, Int) -> Int = add
print(mathFunction(2, 3))        // 5

mathFunction = multiply
print(mathFunction(2, 3))        // 6

// Function types as parameter types
func printMathResult(_ mathFunction: (Int, Int) -> Int, _ a: Int, _ b: Int) {
    print("Result: \(mathFunction(a, b))")
}

printMathResult(add, 5, 3)       // Result: 8

// Function types as return types
func chooseStepFunction(backward: Bool) -> (Int) -> Int {
    func stepForward(_ input: Int) -> Int { return input + 1 }
    func stepBackward(_ input: Int) -> Int { return input - 1 }

    return backward ? stepBackward : stepForward
}

var currentValue = 3
let moveNearerToZero = chooseStepFunction(backward: currentValue > 0)

while currentValue != 0 {
    print("\(currentValue)...")
    currentValue = moveNearerToZero(currentValue)
}
print("zero!")
```

### Closures

```swift
// Closure expressions
let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]

// Function as parameter
func backward(_ s1: String, _ s2: String) -> Bool {
    return s1 > s2
}
var reversedNames = names.sorted(by: backward)

// Closure syntax
reversedNames = names.sorted(by: { (s1: String, s2: String) -> Bool in
    return s1 > s2
})

// Type inference
reversedNames = names.sorted(by: { s1, s2 in return s1 > s2 })

// Implicit returns
reversedNames = names.sorted(by: { s1, s2 in s1 > s2 })

// Shorthand argument names
reversedNames = names.sorted(by: { $0 > $1 })

// Operator methods
reversedNames = names.sorted(by: >)

// Trailing closures
reversedNames = names.sorted { $0 > $1 }

// Capturing values
func makeIncrementer(forIncrement amount: Int) -> () -> Int {
    var runningTotal = 0
    func incrementer() -> Int {
        runningTotal += amount
        return runningTotal
    }
    return incrementer
}

let incrementByTen = makeIncrementer(forIncrement: 10)
print(incrementByTen())  // 10
print(incrementByTen())  // 20
print(incrementByTen())  // 30
```

## Optionals <a name="optionals"></a>

### Understanding Optionals

```swift
// Optional types
var optionalString: String? = "Hello"
var optionalInt: Int? = 42
var optionalDouble: Double? = nil

// Forced unwrapping (dangerous)
let forcedString = optionalString!

// Optional binding (safe)
if let string = optionalString {
    print("String is: \(string)")
} else {
    print("String is nil")
}

// Multiple optional binding
if let string = optionalString, let int = optionalInt {
    print("String: \(string), Int: \(int)")
}

// Guard statement
func processOptional(_ value: String?) {
    guard let value = value else {
        print("Value is nil")
        return
    }
    print("Processing: \(value)")
}

// Nil-coalescing operator
let actualString = optionalString ?? "Default Value"
let actualInt = optionalInt ?? 0

// Optional chaining
struct Person {
    var name: String
    var address: Address?
}

struct Address {
    var street: String
    var city: String
}

let person: Person? = Person(name: "Alice", address: Address(street: "123 Main St", city: "Springfield"))
let city = person?.address?.city  // Optional("Springfield")

// Implicitly unwrapped optionals
let assumedString: String! = "Implicitly unwrapped"
let implicitString: String = assumedString  // No need for !

// Optional mapping
let number: Int? = 5
let squared = number.map { $0 * $0 }  // Optional(25)

let nilNumber: Int? = nil
let nilSquared = nilNumber.map { $0 * $0 }  // nil
```

### Practical Optional Patterns

```swift
// Function returning optional
func findFirstEven(in numbers: [Int]) -> Int? {
    for number in numbers {
        if number % 2 == 0 {
            return number
        }
    }
    return nil
}

let numbers = [1, 3, 5, 7, 8, 9]
if let firstEven = findFirstEven(in: numbers) {
    print("First even number: \(firstEven)")
}

// Optional in switch
let someOptional: Int? = 42
switch someOptional {
case .some(let value):
    print("Value is \(value)")
case .none:
    print("Value is nil")
}

// Compact map for optionals
let strings = ["1", "2", "three", "4"]
let numbers = strings.compactMap { Int($0) }  // [1, 2, 4]

// Optional with enums
enum NetworkResult {
    case success(String)
    case failure(Error?)
}

let result: NetworkResult = .success("Data loaded")
switch result {
case .success(let data):
    print("Success: \(data)")
case .failure(let error):
    print("Error: \(error?.localizedDescription ?? "Unknown error")")
}
```

## Structures and Classes <a name="structures-classes"></a>

### Structures

```swift
// Basic structure
struct Point {
    var x: Double
    var y: Double

    // Computed property
    var description: String {
        return "(\(x), \(y))"
    }

    // Method
    func distance(to other: Point) -> Double {
        let deltaX = x - other.x
        let deltaY = y - other.y
        return sqrt(deltaX * deltaX + deltaY * deltaY)
    }

    // Mutating method
    mutating func moveBy(x deltaX: Double, y deltaY: Double) {
        x += deltaX
        y += deltaY
    }
}

// Using structures
var point1 = Point(x: 0, y: 0)
let point2 = Point(x: 3, y: 4)

print(point1.description)                    // (0.0, 0.0)
print(point1.distance(to: point2))          // 5.0
point1.moveBy(x: 1, y: 1)
print(point1.description)                    // (1.0, 1.0)

// Memberwise initializer
let point3 = Point(x: 5, y: 5)

// Value type behavior
var pointA = Point(x: 1, y: 1)
var pointB = pointA  // Copy
pointB.x = 2
print(pointA.x)      // 1.0 (unchanged)
print(pointB.x)      // 2.0
```

### Classes

```swift
// Basic class
class Vehicle {
    var currentSpeed = 0.0
    var description: String {
        return "traveling at \(currentSpeed) miles per hour"
    }

    func makeNoise() {
        // Do nothing - override in subclasses
    }
}

// Inheritance
class Bicycle: Vehicle {
    var hasBasket = false

    override func makeNoise() {
        print("Ring ring!")
    }
}

class Car: Vehicle {
    var gear = 1
    override var description: String {
        return super.description + " in gear \(gear)"
    }
}

// Using classes
let bicycle = Bicycle()
bicycle.hasBasket = true
bicycle.currentSpeed = 15.0
print(bicycle.description)  // traveling at 15.0 miles per hour
bicycle.makeNoise()         // Ring ring!

let car = Car()
car.currentSpeed = 60.0
car.gear = 4
print(car.description)      // traveling at 60.0 miles per hour in gear 4

// Reference type behavior
let vehicle1 = Vehicle()
let vehicle2 = vehicle1     // Reference to same instance
vehicle2.currentSpeed = 50.0
print(vehicle1.currentSpeed) // 50.0 (changed)

// Identity operators
print(vehicle1 === vehicle2) // true (same instance)
print(vehicle1 !== bicycle)  // true (different instances)
```

### Properties

```swift
struct Temperature {
    // Stored properties
    var celsius: Double

    // Computed properties
    var fahrenheit: Double {
        get {
            return celsius * 9 / 5 + 32
        }
        set {
            celsius = (newValue - 32) * 5 / 9
        }
    }

    var kelvin: Double {
        return celsius + 273.15
    }
}

var temp = Temperature(celsius: 25)
print(temp.fahrenheit)  // 77.0
temp.fahrenheit = 100
print(temp.celsius)     // 37.777...

// Property observers
class StepCounter {
    var totalSteps: Int = 0 {
        willSet(newTotalSteps) {
            print("About to set totalSteps to \(newTotalSteps)")
        }
        didSet {
            if totalSteps > oldValue {
                print("Added \(totalSteps - oldValue) steps")
            }
        }
    }
}

let stepCounter = StepCounter()
stepCounter.totalSteps = 200
stepCounter.totalSteps = 360

// Lazy properties
class DataImporter {
    var filename = "data.txt"
    // Data importing would happen here
}

class DataManager {
    lazy var importer = DataImporter()
    var data: [String] = []
}

let manager = DataManager()
manager.data.append("Some data")
// importer hasn't been created yet
print(manager.importer.filename)  // Now importer is created
```

### Initialization

```swift
struct Fahrenheit {
    var temperature: Double

    init() {
        temperature = 32.0
    }
}

// Default initializer
var f = Fahrenheit()

// Custom initializers
struct Celsius {
    var temperatureInCelsius: Double

    init(fromFahrenheit fahrenheit: Double) {
        temperatureInCelsius = (fahrenheit - 32.0) / 1.8
    }

    init(fromKelvin kelvin: Double) {
        temperatureInCelsius = kelvin - 273.15
    }

    init(_ celsius: Double) {
        temperatureInCelsius = celsius
    }
}

let boilingPoint = Celsius(fromFahrenheit: 212.0)
let freezingPoint = Celsius(fromKelvin: 273.15)
let bodyTemperature = Celsius(37.0)

// Class inheritance and initialization
class Person {
    var name: String

    init(name: String) {
        self.name = name
    }

    convenience init() {
        self.init(name: "Unknown")
    }
}

class Student: Person {
    var major: String

    init(name: String, major: String) {
        self.major = major
        super.init(name: name)
    }

    override convenience init(name: String) {
        self.init(name: name, major: "Undeclared")
    }
}

let student1 = Student(name: "Alice", major: "Computer Science")
let student2 = Student(name: "Bob")  // Uses convenience initializer
```

## Protocols and Extensions <a name="protocols"></a>

### Protocols

```swift
// Protocol definition
protocol Vehicle {
    var numberOfWheels: Int { get }
    var maxSpeed: Double { get }

    func start()
    func stop()
    func describe() -> String
}

// Protocol inheritance
protocol Electric {
    var batteryLevel: Double { get set }
    func charge()
}

// Protocol composition
protocol ElectricVehicle: Vehicle, Electric {
    var chargingTime: Double { get }
}

// Adopting protocols
struct Car: Vehicle {
    let numberOfWheels = 4
    let maxSpeed = 120.0

    func start() {
        print("Car started")
    }

    func stop() {
        print("Car stopped")
    }

    func describe() -> String {
        return "A car with \(numberOfWheels) wheels and max speed \(maxSpeed) km/h"
    }
}

class ElectricCar: ElectricVehicle {
    let numberOfWheels = 4
    let maxSpeed = 150.0
    let chargingTime = 8.0
    var batteryLevel: Double = 100.0

    func start() {
        print("Electric car started silently")
    }

    func stop() {
        print("Electric car stopped")
    }

    func describe() -> String {
        return "An electric car with \(batteryLevel)% battery"
    }

    func charge() {
        batteryLevel = 100.0
        print("Car charged to 100%")
    }
}

// Using protocols
func operateVehicle(_ vehicle: Vehicle) {
    vehicle.start()
    print(vehicle.describe())
    vehicle.stop()
}

let car = Car()
let electricCar = ElectricCar()

operateVehicle(car)
operateVehicle(electricCar)
```

### Protocol Extensions

```swift
// Protocol with extension
protocol Describable {
    func describe() -> String
}

extension Describable {
    func describe() -> String {
        return "This is a describable object"
    }

    func detailedDescription() -> String {
        return "Detailed: \(describe())"
    }
}

struct Book: Describable {
    let title: String
    let author: String

    func describe() -> String {
        return "Book: \(title) by \(author)"
    }
}

let book = Book(title: "Swift Guide", author: "Apple")
print(book.describe())           // "Book: Swift Guide by Apple"
print(book.detailedDescription()) // "Detailed: Book: Swift Guide by Apple"

// Conditional conformance
extension Array: Describable where Element: Describable {
    func describe() -> String {
        let descriptions = self.map { $0.describe() }
        return "Array: [\(descriptions.joined(separator: ", "))]"
    }
}

let books = [Book(title: "Book 1", author: "Author 1"), Book(title: "Book 2", author: "Author 2")]
print(books.describe())
```

### Extensions

```swift
// Extending existing types
extension String {
    // Computed properties
    var isPalindrome: Bool {
        let cleaned = self.lowercased().filter { $0.isLetter }
        return cleaned == String(cleaned.reversed())
    }

    var wordCount: Int {
        return self.components(separatedBy: .whitespacesAndNewlines).count
    }

    // Methods
    func withEmphasis() -> String {
        return "**\(self)**"
    }

    mutating func addEmphasis() {
        self = self.withEmphasis()
    }

    // Subscripts
    subscript(bounds: CountableClosedRange<Int>) -> String {
        let start = index(startIndex, offsetBy: bounds.lowerBound)
        let end = index(startIndex, offsetBy: bounds.upperBound)
        return String(self[start...end])
    }
}

let testString = "A man a plan a canal Panama"
print(testString.isPalindrome)  // true
print(testString.wordCount)     // 7
print(testString.withEmphasis()) // "**A man a plan a canal Panama**"
print(testString[0...5])        // "A man "

// Extending with protocols
extension Int: Describable {
    func describe() -> String {
        return "This is the number \(self)"
    }
}

let number = 42
print(number.describe())  // "This is the number 42"
```

## Error Handling <a name="error-handling"></a>

### Defining and Throwing Errors

```swift
// Error protocol
enum NetworkError: Error {
    case invalidURL
    case noInternetConnection
    case requestTimeout
    case serverError(Int)
    case unknown
}

enum ValidationError: Error {
    case emptyField
    case invalidEmail
    case passwordTooShort
    case ageRestriction
}

// Throwing functions
func validateUser(email: String, password: String, age: Int) throws {
    guard !email.isEmpty && !password.isEmpty else {
        throw ValidationError.emptyField
    }

    guard email.contains("@") && email.contains(".") else {
        throw ValidationError.invalidEmail
    }

    guard password.count >= 8 else {
        throw ValidationError.passwordTooShort
    }

    guard age >= 13 else {
        throw ValidationError.ageRestriction
    }
}

// Function that can throw multiple errors
func fetchData(from urlString: String) throws -> String {
    guard let url = URL(string: urlString) else {
        throw NetworkError.invalidURL
    }

    // Simulate network request
    let isSuccess = Bool.random()

    if isSuccess {
        return "Data from \(urlString)"
    } else {
        throw NetworkError.serverError(500)
    }
}
```

### Handling Errors

```swift
// Do-try-catch
do {
    try validateUser(email: "user@example.com", password: "password123", age: 25)
    print("Validation successful!")
} catch ValidationError.emptyField {
    print("Please fill in all fields")
} catch ValidationError.invalidEmail {
    print("Please enter a valid email address")
} catch ValidationError.passwordTooShort {
    print("Password must be at least 8 characters")
} catch ValidationError.ageRestriction {
    print("You must be at least 13 years old")
} catch {
    print("An unexpected error occurred: \(error)")
}

// Try? (convert to optional)
if let data = try? fetchData(from: "https://example.com") {
    print("Data received: \(data)")
} else {
    print("Failed to fetch data")
}

// Try! (force try - use carefully)
let data = try! fetchData(from: "https://example.com")  // Will crash if throws

// Propagating errors
func processUserRegistration(email: String, password: String, age: Int) throws -> Bool {
    try validateUser(email: email, password: password, age: age)
    // Additional processing...
    return true
}

// Error handling in async code
func fetchDataAsync(from urlString: String) async throws -> String {
    // Simulate async network call
    try await Task.sleep(nanoseconds: 1_000_000_000) // 1 second

    guard let url = URL(string: urlString) else {
        throw NetworkError.invalidURL
    }

    return "Async data from \(urlString)"
}

// Using async/await with error handling
Task {
    do {
        let data = try await fetchDataAsync(from: "https://example.com")
        print("Async data: \(data)")
    } catch {
        print("Async error: \(error)")
    }
}
```

## Concurrency <a name="concurrency"></a>

### Async/Await

```swift
// Async functions
func fetchUserData() async throws -> String {
    try await Task.sleep(nanoseconds: 2_000_000_000) // 2 seconds
    return "User data"
}

func fetchUserSettings() async throws -> String {
    try await Task.sleep(nanoseconds: 1_000_000_000) // 1 second
    return "User settings"
}

// Using async functions
Task {
    do {
        let userData = try await fetchUserData()
        let userSettings = try await fetchUserSettings()
        print("\(userData) and \(userSettings)")
    } catch {
        print("Error: \(error)")
    }
}

// Parallel execution
Task {
    async let userData = fetchUserData()
    async let userSettings = fetchUserSettings()

    do {
        let (data, settings) = try await (userData, userSettings)
        print("Both completed: \(data), \(settings)")
    } catch {
        print("Error in parallel tasks: \(error)")
    }
}

// Async sequences
func numberStream() async -> AsyncStream<Int> {
    AsyncStream { continuation in
        Task {
            for i in 1...5 {
                try await Task.sleep(nanoseconds: 500_000_000) // 0.5 seconds
                continuation.yield(i)
            }
            continuation.finish()
        }
    }
}

Task {
    for await number in numberStream() {
        print("Received: \(number)")
    }
    print("Stream finished")
}
```

### Actors

```swift
// Actor for thread-safe data access
actor BankAccount {
    private var balance: Double
    private let accountNumber: String

    init(accountNumber: String, initialBalance: Double) {
        self.accountNumber = accountNumber
        self.balance = initialBalance
    }

    func deposit(amount: Double) {
        balance += amount
        print("Deposited \(amount). New balance: \(balance)")
    }

    func withdraw(amount: Double) -> Bool {
        if amount <= balance {
            balance -= amount
            print("Withdrew \(amount). New balance: \(balance)")
            return true
        } else {
            print("Insufficient funds. Balance: \(balance)")
            return false
        }
    }

    func getBalance() -> Double {
        return balance
    }
}

// Using actors
Task {
    let account = BankAccount(accountNumber: "12345", initialBalance: 1000.0)

    // All actor method calls are async
    await account.deposit(amount: 500.0)
    let success = await account.withdraw(amount: 200.0)
    let balance = await account.getBalance()

    print("Withdrawal successful: \(success), Final balance: \(balance)")
}

// Multiple tasks accessing actor
Task {
    let account = BankAccount(accountNumber: "67890", initialBalance: 500.0)

    await withTaskGroup(of: Void.self) { group in
        for _ in 1...10 {
            group.addTask {
                await account.deposit(amount: 100.0)
            }
        }
    }

    let finalBalance = await account.getBalance()
    print("Final balance after multiple deposits: \(finalBalance)")
}
```

## SwiftUI Introduction <a name="swiftui"></a>

### Basic SwiftUI Views

```swift
import SwiftUI

struct ContentView: View {
    @State private var name = ""
    @State private var isOn = false
    @State private var selectedColor = 0
    let colors = ["Red", "Green", "Blue"]

    var body: some View {
        VStack(spacing: 20) {
            Text("Hello, SwiftUI!")
                .font(.largeTitle)
                .foregroundColor(.blue)

            TextField("Enter your name", text: $name)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding()

            Toggle("Enable feature", isOn: $isOn)
                .padding()

            Picker("Select a color", selection: $selectedColor) {
                ForEach(0..<colors.count, id: \.self) { index in
                    Text(colors[index])
                }
            }
            .pickerStyle(SegmentedPickerStyle())
            .padding()

            Button("Submit") {
                print("Name: \(name), Toggle: \(isOn), Color: \(colors[selectedColor])")
            }
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(8)

            Spacer()
        }
        .padding()
    }
}
```

### List and Navigation

```swift
struct Item: Identifiable {
    let id = UUID()
    let name: String
    let description: String
}

struct ListView: View {
    let items = [
        Item(name: "Apple", description: "A fruit"),
        Item(name: "Banana", description: "Yellow fruit"),
        Item(name: "Orange", description: "Citrus fruit")
    ]

    var body: some View {
        NavigationView {
            List(items) { item in
                NavigationLink(destination: DetailView(item: item)) {
                    HStack {
                        Image(systemName: "circle.fill")
                            .foregroundColor(.blue)
                        VStack(alignment: .leading) {
                            Text(item.name)
                                .font(.headline)
                            Text(item.description)
                                .font(.subheadline)
                                .foregroundColor(.gray)
                        }
                    }
                }
            }
            .navigationTitle("Fruits")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Add") {
                        print("Add button tapped")
                    }
                }
            }
        }
    }
}

struct DetailView: View {
    let item: Item

    var body: some View {
        VStack {
            Text(item.name)
                .font(.title)
            Text(item.description)
                .font(.body)
                .padding()
            Spacer()
        }
        .navigationTitle(item.name)
    }
}
```

## Advanced Topics <a name="advanced"></a>

### Generics

```swift
// Generic functions
func swapTwoValues<T>(_ a: inout T, _ b: inout T) {
    let temporaryA = a
    a = b
    b = temporaryA
}

var string1 = "hello"
var string2 = "world"
swapTwoValues(&string1, &string2)
print("string1: \(string1), string2: \(string2)") // string1: world, string2: hello

// Generic types
struct Stack<Element> {
    private var elements: [Element] = []

    mutating func push(_ element: Element) {
        elements.append(element)
    }

    mutating func pop() -> Element? {
        return elements.popLast()
    }

    func peek() -> Element? {
        return elements.last
    }

    var isEmpty: Bool {
        return elements.isEmpty
    }
}

var intStack = Stack<Int>()
intStack.push(1)
intStack.push(2)
intStack.push(3)
print(intStack.pop()) // 3

// Generic constraints
func findIndex<T: Equatable>(of valueToFind: T, in array: [T]) -> Int? {
    for (index, value) in array.enumerated() {
        if value == valueToFind {
            return index
        }
    }
    return nil
}

let strings = ["cat", "dog", "llama"]
if let foundIndex = findIndex(of: "dog", in: strings) {
    print("Found at index \(foundIndex)") // Found at index 1
}
```

### Memory Management

```swift
// Reference cycles and weak references
class Person {
    let name: String
    var apartment: Apartment?

    init(name: String) {
        self.name = name
        print("\(name) is being initialized")
    }

    deinit {
        print("\(name) is being deinitialized")
    }
}

class Apartment {
    let unit: String
    weak var tenant: Person?  // Weak reference to break cycle

    init(unit: String) {
        self.unit = unit
        print("Apartment \(unit) is being initialized")
    }

    deinit {
        print("Apartment \(unit) is being deinitialized")
    }
}

var john: Person? = Person(name: "John")
var unit4A: Apartment? = Apartment(unit: "4A")

john?.apartment = unit4A
unit4A?.tenant = john

john = nil
unit4A = nil
// Both are deallocated properly

// Unowned references
class Customer {
    let name: String
    var card: CreditCard?

    init(name: String) {
        self.name = name
    }

    deinit {
        print("\(name) is being deinitialized")
    }
}

class CreditCard {
    let number: UInt64
    unowned let customer: Customer  // Unowned reference

    init(number: UInt64, customer: Customer) {
        self.number = number
        self.customer = customer
    }

    deinit {
        print("Card #\(number) is being deinitialized")
    }
}

var customer: Customer? = Customer(name: "Alice")
customer?.card = CreditCard(number: 1234_5678_9012_3456, customer: customer!)
customer = nil
// Both are deallocated
```

## Practice Projects <a name="projects"></a>

### Project 1: Todo List App

```swift
import SwiftUI

struct TodoItem: Identifiable, Codable {
    let id = UUID()
    var title: String
    var isCompleted = false
}

class TodoStore: ObservableObject {
    @Published var items: [TodoItem] = [] {
        didSet {
            saveItems()
        }
    }

    init() {
        loadItems()
    }

    func addItem(_ title: String) {
        let newItem = TodoItem(title: title)
        items.append(newItem)
    }

    func toggleItem(_ item: TodoItem) {
        if let index = items.firstIndex(where: { $0.id == item.id }) {
            items[index].isCompleted.toggle()
        }
    }

    func deleteItem(_ item: TodoItem) {
        items.removeAll { $0.id == item.id }
    }

    private func saveItems() {
        if let encoded = try? JSONEncoder().encode(items) {
            UserDefaults.standard.set(encoded, forKey: "todoItems")
        }
    }

    private func loadItems() {
        if let data = UserDefaults.standard.data(forKey: "todoItems"),
           let decoded = try? JSONDecoder().decode([TodoItem].self, from: data) {
            items = decoded
        }
    }
}

struct TodoListView: View {
    @StateObject private var store = TodoStore()
    @State private var newItemTitle = ""

    var body: some View {
        NavigationView {
            VStack {
                HStack {
                    TextField("New todo item", text: $newItemTitle)
                        .textFieldStyle(RoundedBorderTextFieldStyle())

                    Button("Add") {
                        if !newItemTitle.isEmpty {
                            store.addItem(newItemTitle)
                            newItemTitle = ""
                        }
                    }
                    .disabled(newItemTitle.isEmpty)
                }
                .padding()

                List {
                    ForEach(store.items) { item in
                        HStack {
                            Image(systemName: item.isCompleted ? "checkmark.circle.fill" : "circle")
                                .foregroundColor(item.isCompleted ? .green : .gray)
                                .onTapGesture {
                                    store.toggleItem(item)
                                }

                            Text(item.title)
                                .strikethrough(item.isCompleted)
                                .foregroundColor(item.isCompleted ? .gray : .primary)

                            Spacer()
                        }
                    }
                    .onDelete(perform: deleteItems)
                }
                .listStyle(PlainListStyle())
            }
            .navigationTitle("Todo List")
            .toolbar {
                EditButton()
            }
        }
    }

    private func deleteItems(at offsets: IndexSet) {
        for index in offsets {
            store.deleteItem(store.items[index])
        }
    }
}
```

### Project 2: Weather App

```swift
import SwiftUI

struct WeatherData: Codable {
    let name: String
    let main: Main
    let weather: [Weather]

    struct Main: Codable {
        let temp: Double
        let humidity: Int
    }

    struct Weather: Codable {
        let description: String
        let icon: String
    }
}

class WeatherService: ObservableObject {
    @Published var weather: WeatherData?
    @Published var isLoading = false
    @Published var error: String?

    func fetchWeather(for city: String) async {
        DispatchQueue.main.async {
            self.isLoading = true
            self.error = nil
        }

        // Note: You'll need to replace with a real API key from OpenWeatherMap
        let apiKey = "YOUR_API_KEY"
        let urlString = "https://api.openweathermap.org/data/2.5/weather?q=\(city)&appid=\(apiKey)&units=metric"

        guard let url = URL(string: urlString) else {
            DispatchQueue.main.async {
                self.error = "Invalid URL"
                self.isLoading = false
            }
            return
        }

        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            let weatherData = try JSONDecoder().decode(WeatherData.self, from: data)

            DispatchQueue.main.async {
                self.weather = weatherData
                self.isLoading = false
            }
        } catch {
            DispatchQueue.main.async {
                self.error = "Failed to fetch weather: \(error.localizedDescription)"
                self.isLoading = false
            }
        }
    }
}

struct WeatherView: View {
    @StateObject private var service = WeatherService()
    @State private var city = ""

    var body: some View {
        VStack(spacing: 20) {
            Text("Weather App")
                .font(.largeTitle)
                .bold()

            HStack {
                TextField("Enter city name", text: $city)
                    .textFieldStyle(RoundedBorderTextFieldStyle())

                Button("Get Weather") {
                    Task {
                        await service.fetchWeather(for: city)
                    }
                }
                .disabled(city.isEmpty)
            }
            .padding()

            if service.isLoading {
                ProgressView("Loading...")
            } else if let error = service.error {
                Text("Error: \(error)")
                    .foregroundColor(.red)
            } else if let weather = service.weather {
                VStack(spacing: 10) {
                    Text(weather.name)
                        .font(.title)

                    Text("\(Int(weather.main.temp))°C")
                        .font(.system(size: 48, weight: .bold))

                    if let weatherDescription = weather.weather.first {
                        Text(weatherDescription.description.capitalized)
                            .font(.title2)
                    }

                    Text("Humidity: \(weather.main.humidity)%")
                        .font(.body)
                }
                .padding()
            }

            Spacer()
        }
        .padding()
    }
}
```

## Learning Resources

### Official Documentation

- [Swift.org](https://swift.org)
- [Apple Developer Documentation](https://developer.apple.com/documentation/swift)
- [Swift Programming Language Book](https://docs.swift.org/swift-book/)

### Practice Platforms

- [HackerRank Swift challenges](https://www.hackerrank.com/domains/tutorials/10-days-of-swift)
- [LeetCode Swift problems](https://leetcode.com)
- [Exercism Swift track](https://exercism.org/tracks/swift)

### Next Steps

1. **Build projects** - Start with simple apps and gradually increase complexity
2. **Learn design patterns** - MVC, MVVM, Coordinator pattern
3. **Study Apple's frameworks** - UIKit, SwiftUI, Core Data, Combine
4. **Practice algorithms** - Focus on common interview problems
5. **Join communities** - Swift forums, GitHub open-source projects
