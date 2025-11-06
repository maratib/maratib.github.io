---
title: Swift OOP
slug: guides/macos/swift-oop
description: Swift OOP
sidebar:
  order: 2
---

## 1. Classes and Objects <a name="classes-objects"></a>

_Classes are blueprints for creating objects, and objects are instances of classes_

### Basic Class Definition

```swift
class Person {
    var name: String
    var age: Int

    init(name: String, age: Int) {
        self.name = name
        self.age = age
    }
}

let person1 = Person(name: "Alice", age: 25)
print(person1.name) // "Alice"
```

### Class vs Structure

_Classes are reference types, Structures are value types_

```swift
class Dog {
    var name: String
    init(name: String) { self.name = name }
}

let dog1 = Dog(name: "Buddy")
let dog2 = dog1  // Both reference same object
dog2.name = "Max"
print(dog1.name) // "Max" (changed!)
```

## 2. Properties <a name="properties"></a>

_Properties store values in classes - can be simple stored values or computed values_

### Stored and Computed Properties

```swift
class Rectangle {
    var width: Double = 0.0  // Stored property
    var height: Double = 0.0 // Stored property

    var area: Double {       // Computed property
        return width * height
    }
}

let rect = Rectangle()
rect.width = 5.0
rect.height = 10.0
print(rect.area) // 50.0
```

### Property Observers

_Code that runs when property values change_

```swift
class BankAccount {
    var balance: Double = 0.0 {
        willSet { print("About to set balance to \(newBalance)") }
        didSet { print("Balance changed from \(oldValue) to \(balance)") }
    }
}

let account = BankAccount()
account.balance = 1000 // Triggers observers
```

## 3. Methods <a name="methods"></a>

_Functions that belong to classes and can access class properties_

### Instance Methods

_Methods called on instances of a class_

```swift
class Counter {
    var count = 0

    func increment() {
        count += 1
    }

    func increment(by amount: Int) {
        count += amount
    }
}

let counter = Counter()
counter.increment()
counter.increment(by: 5)
print(counter.count) // 6
```

### Type Methods

_Methods called on the class itself, not instances_

```swift
class MathUtils {
    static func square(_ number: Double) -> Double {
        return number * number
    }
}

print(MathUtils.square(5.0)) // 25.0 - called on class
```

## 4. Inheritance <a name="inheritance"></a>

_Creating new classes based on existing classes, inheriting their properties and methods_

### Basic Inheritance

```swift
class Animal {  // Base class
    func makeSound() {
        print("Some generic animal sound")
    }
}

class Dog: Animal {  // Subclass inherits from Animal
    override func makeSound() {  // Override base class method
        print("Woof!")
    }
}

let dog = Dog()
dog.makeSound() // "Woof!" (uses overridden method)
```

### Property Overriding

_Subclasses can override properties from parent class_

```swift
class Vehicle {
    var currentSpeed = 0.0
    var description: String {
        return "traveling at \(currentSpeed) km/h"
    }
}

class Car: Vehicle {
    override var description: String {
        return super.description + " in gear"
    }
}
```

## 5. Polymorphism <a name="polymorphism"></a>

_Objects of different types can be treated as objects of a common super type_

### Method Overriding

_Same method name, different implementations in different classes_

```swift
class Bird {
    func fly() { print("The bird is flying") }
}

class Penguin: Bird {
    override func fly() { print("Penguins can't fly!") }
}

class Eagle: Bird {
    override func fly() { print("The eagle is soaring high") }
}

let birds: [Bird] = [Bird(), Penguin(), Eagle()]
for bird in birds {
    bird.fly()  // Different behavior for each type
}
```

### Type Casting

_Checking and converting types at runtime_

```swift
if let penguin = someBird as? Penguin {
    penguin.swim()  // Only penguins can swim
}
```

## 6. Encapsulation <a name="encapsulation"></a>

_Hiding internal state and requiring all interaction through object's methods_

### Access Control

```swift
class BankAccount {
    private var balance: Double  // Hidden from outside
    public let accountHolder: String  // Visible to outside

    public func deposit(amount: Double) {  // Controlled access
        if amount > 0 { balance += amount }
    }

    public func getBalance() -> Double {  // Controlled access
        return balance
    }
}

let account = BankAccount()
account.deposit(amount: 500)    // Allowed - public method
// account.balance = 1000       // Error - private property
```

## 7. Abstraction <a name="abstraction"></a>

_Hiding complex implementation details and showing only essential features_

### Using Protocols for Abstraction

```swift
protocol Shape {  // Abstract interface
    var area: Double { get }
    func draw()
}

class Circle: Shape {  // Concrete implementation
    var radius: Double
    var area: Double { return Double.pi * radius * radius }
    func draw() { print("Drawing circle") }
}

class Rectangle: Shape {  // Another implementation
    var width, height: Double
    var area: Double { return width * height }
    func draw() { print("Drawing rectangle") }
}

let shapes: [Shape] = [Circle(radius: 5), Rectangle(width: 4, height: 6)]
for shape in shapes {
    shape.draw()  // Don't care about implementation details
}
```

## 8. Initialization <a name="initialization"></a>

_The process of preparing an instance of a class for use_

### Designated and Convenience Initializers

```swift
class Person {
    var name: String
    var age: Int

    // Designated initializer - main initializer
    init(name: String, age: Int) {
        self.name = name
        self.age = age
    }

    // Convenience initializer - calls designated initializer
    convenience init(name: String) {
        self.init(name: name, age: 0)
    }
}

let person1 = Person(name: "Alice", age: 25)  // Designated
let person2 = Person(name: "Bob")            // Convenience
```

## 9. Access Control <a name="access-control"></a>

_Controlling what code can access which properties and methods_

### Access Levels

```swift
class DataManager {
    public var apiKey: String        // Accessible anywhere
    internal var baseURL: String     // Accessible in same module (default)
    private var secretToken: String  // Accessible only in this class
    fileprivate var cache: [String]  // Accessible in same file

    public func fetchData() { }      // Public interface
    private func validate() { }      // Internal helper
}
```

## 10. Advanced OOP Patterns <a name="advanced-patterns"></a>

_Common solutions to recurring design problems_

### Singleton Pattern

_Only one instance of a class exists_

```swift
class AppSettings {
    static let shared = AppSettings()  // Single instance
    private init() {}                  // Prevent creating others

    var theme: String = "Dark"
}

let settings = AppSettings.shared  // Always get the same instance
settings.theme = "Light"
```

### Observer Pattern

_Objects notify other objects about changes_

```swift
class Observable {
    var value: String = "" {
        didSet {
            onValueChanged?(value)  // Notify observers
        }
    }

    var onValueChanged: ((String) -> Void)?  // Callback
}

let observable = Observable()
observable.onValueChanged = { newValue in
    print("Value changed to: \(newValue)")
}
observable.value = "Hello"  // Triggers notification
```

### Factory Pattern

_Creating objects without specifying exact class_

```swift
class VehicleFactory {
    static func createVehicle(type: String) -> Vehicle {
        switch type {
        case "car": return Car()
        case "bike": return Bike()
        default: return Car()
        }
    }
}

let vehicle = VehicleFactory.createVehicle(type: "car")
// Don't need to know exact class, just interface
```
