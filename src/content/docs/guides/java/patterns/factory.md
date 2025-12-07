---
title: Factory Pattern
description: Java Factory Pattern (CREATIONAL PATTERN)
sidebar:
  order: 1
---

_Java Factory Pattern (CREATIONAL PATTERN)_

_Creates objects **without specifying the exact class** - delegates instantiation logic to factory methods._

**Factory Pattern**: Delegates object creation to factory classes, keeping client code clean and decoupled from concrete implementations.

## **2. When to Use?**

When object creation logic is:

- Complex
- Needs to be centralized
- Should be hidden from client
- May change frequently

## **3. Simple Example: Without vs With Factory**

### **❌ Without Factory (Direct Instantiation)**

```java
interface Vehicle {
    void drive();
}

class Car implements Vehicle {
    public void drive() { System.out.println("Driving car"); }
}

class Bike implements Vehicle {
    public void drive() { System.out.println("Riding bike"); }
}

// Problem: Client knows concrete classes
public class Client {
    public static void main(String[] args) {
        Vehicle vehicle;

        String type = "car"; // From config/user input

        // ❌ Client decides which class to instantiate
        if (type.equals("car")) {
            vehicle = new Car();  // Tight coupling!
        } else if (type.equals("bike")) {
            vehicle = new Bike();  // More if-else for new types
        } else {
            throw new IllegalArgumentException();
        }

        vehicle.drive();
    }
}
```

### **✅ With Factory (Clean)**

```java
// Same Vehicle interface and classes...

// Factory class encapsulates creation logic
class VehicleFactory {
    public static Vehicle getVehicle(String type) {
        if (type.equals("car")) {
            return new Car();
        } else if (type.equals("bike")) {
            return new Bike();
        }
        throw new IllegalArgumentException();
    }
}

// Client code
public class Client {
    public static void main(String[] args) {
        // ✅ Client doesn't know concrete classes
        Vehicle vehicle = VehicleFactory.getVehicle("car");
        vehicle.drive();  // Just uses it
    }
}
```

## **4. Three Factory Variants**

### **1. Simple Factory (Static Factory)**

```java
// Shown above - static method
class PizzaFactory {
    public static Pizza createPizza(String type) {
        switch(type.toLowerCase()) {
            case "cheese": return new CheesePizza();
            case "pepperoni": return new PepperoniPizza();
            default: throw new IllegalArgumentException();
        }
    }
}

// Usage
Pizza pizza = PizzaFactory.createPizza("cheese");
```

### **2. Factory Method Pattern**

```java
// Abstract creator with factory method
abstract class Dialog {
    // Factory method - subclasses implement
    abstract Button createButton();

    void render() {
        Button button = createButton();  // Calls subclass method
        button.onClick();
        button.render();
    }
}

// Concrete creators
class WindowsDialog extends Dialog {
    Button createButton() {
        return new WindowsButton();  // Creates Windows variant
    }
}

class WebDialog extends Dialog {
    Button createButton() {
        return new HTMLButton();  // Creates Web variant
    }
}

// Usage
Dialog dialog = new WindowsDialog();
dialog.render();  // Creates WindowsButton
```

### **3. Abstract Factory Pattern**

```java
// Factory of factories - creates families of related objects
interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

// Concrete factories
class WindowsFactory implements GUIFactory {
    public Button createButton() { return new WindowsButton(); }
    public Checkbox createCheckbox() { return new WindowsCheckbox(); }
}

class MacFactory implements GUIFactory {
    public Button createButton() { return new MacButton(); }
    public Checkbox createCheckbox() { return new MacCheckbox(); }
}

// Application uses abstract factory
class Application {
    private GUIFactory factory;

    Application(GUIFactory factory) {
        this.factory = factory;
    }

    void createUI() {
        Button button = factory.createButton();
        Checkbox checkbox = factory.createCheckbox();
        // All components match (all Windows or all Mac)
    }
}
```

## **5. Real-World Examples**

### **Example 1: Logger Factory**

```java
interface Logger {
    void log(String message);
}

class FileLogger implements Logger {
    public void log(String msg) {
        System.out.println("Writing to file: " + msg);
    }
}

class DatabaseLogger implements Logger {
    public void log(String msg) {
        System.out.println("Saving to DB: " + msg);
    }
}

class LoggerFactory {
    public static Logger getLogger(String type) {
        if (type.equals("file")) return new FileLogger();
        if (type.equals("database")) return new DatabaseLogger();
        if (type.equals("console")) return new ConsoleLogger();
        return new ConsoleLogger(); // Default
    }
}

// Usage in application
Logger logger = LoggerFactory.getLogger("file");
logger.log("Error occurred");
```

### **Example 2: Payment Processor Factory**

```java
class PaymentFactory {
    public static PaymentProcessor create(String country) {
        switch(country) {
            case "US": return new StripeProcessor();
            case "EU": return new PayPalProcessor();
            case "IN": return new RazorpayProcessor();
            default: return new DefaultProcessor();
        }
    }
}

// Client code doesn't change when adding new countries
PaymentProcessor processor = PaymentFactory.create("IN");
processor.process(1000);
```

## **6. Interview Q&A**

### **Q1: Factory Method vs Abstract Factory?**

**A**:

- **Factory Method**: One method creates one product
- **Abstract Factory**: Factory creates families of related products

### **Q2: Why not just use `new`?**

**A**: Because:

1. **Encapsulation**: Creation logic hidden
2. **Flexibility**: Easy to add new types
3. **Decoupling**: Client doesn't depend on concrete classes
4. **Single Responsibility**: Creation logic in one place

### **Q3: When to use which factory?**

**A**:

- **Simple Factory**: Basic object creation
- **Factory Method**: When subclass decides which object
- **Abstract Factory**: When need related object families

### **Q4: Real example in Java/JDK?**

**A**:

- `Calendar.getInstance()` - Factory method
- `NumberFormat.getNumberInstance()` - Factory method
- `DocumentBuilderFactory.newInstance()` - Abstract factory

### **Q5: Difference with Builder Pattern?**

**A**:

- **Factory**: Creates different **types** of objects
- **Builder**: Creates complex **single** object with many parts

## **7. Spring Framework Example**

```java
// Spring uses factory pattern extensively
@Component
public class VehicleFactory {

    @Autowired
    private Car car;

    @Autowired
    private Bike bike;

    public Vehicle getVehicle(String type) {
        if ("car".equals(type)) return car;
        if ("bike".equals(type)) return bike;
        throw new IllegalArgumentException();
    }
}

// Usage with Dependency Injection
@Service
public class TransportService {
    @Autowired
    private VehicleFactory factory;

    public void transport(String type) {
        Vehicle vehicle = factory.getVehicle(type);
        vehicle.drive();
    }
}
```

## **8. Implementation Template**

```java
// Product interface
interface Product {
    void use();
}

// Concrete products
class ConcreteProductA implements Product {
    public void use() { System.out.println("Using Product A"); }
}

class ConcreteProductB implements Product {
    public void use() { System.out.println("Using Product B"); }
}

// Factory
class ProductFactory {
    public static Product createProduct(String type) {
        if ("A".equals(type)) return new ConcreteProductA();
        if ("B".equals(type)) return new ConcreteProductB();
        throw new IllegalArgumentException();
    }
}

// Client
public class Main {
    public static void main(String[] args) {
        Product product = ProductFactory.createProduct("A");
        product.use();
    }
}
```

## **9. Advantages**

1. **Loose Coupling**: Client doesn't know concrete classes
2. **Single Responsibility**: Creation logic in one place
3. **Open/Closed**: Easy to add new types without modifying client
4. **Centralized Control**: Easy to implement caching, pooling, etc.
