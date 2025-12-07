---
title: Decorator Pattern
description: Java Decorator Pattern (BEHAVIORAL PATTERN)
sidebar:
  order: 8
---

_Java Decorator Pattern (BEHAVIORAL PATTERN)_

_**Adds behavior dynamically** to objects without changing their class (wrapper pattern)._

**Decorator Pattern**: **Runtime wrapper** that adds new behavior to objects - like adding toppings to pizza where each topping enhances what you already have!

## **2. Real-World Analogy**

**Pizza Toppings**:

- Start with basic pizza
- Add cheese (extra cost + description)
- Add pepperoni (extra cost + description)
- Add mushrooms (extra cost + description)
- Each topping "decorates" the pizza

## **3. Simple Example: Without vs With Decorator**

### **❌ Without Decorator (Class Explosion)**

```java
// Need separate class for every combination!
class PlainPizza { double cost() { return 5.0; } }
class CheesePizza { double cost() { return 6.0; } }
class PepperoniPizza { double cost() { return 6.5; } }
class CheesePepperoniPizza { double cost() { return 7.5; } }
// ❌ 2^n classes for n toppings!
// ❌ Adding new topping = 2^n new classes!
```

### **✅ With Decorator (Flexible)**

```java
// Step 1: Component Interface
interface Pizza {
    double getCost();
    String getDescription();
}

// Step 2: Concrete Component (Base object)
class PlainPizza implements Pizza {
    public double getCost() {
        return 5.0;  // Base price
    }

    public String getDescription() {
        return "Plain pizza";
    }
}

// Step 3: Base Decorator (Abstract)
abstract class PizzaDecorator implements Pizza {
    protected Pizza pizza;  // Wrapped pizza

    public PizzaDecorator(Pizza pizza) {
        this.pizza = pizza;
    }

    public double getCost() {
        return pizza.getCost();
    }

    public String getDescription() {
        return pizza.getDescription();
    }
}

// Step 4: Concrete Decorators (Toppings)
class CheeseDecorator extends PizzaDecorator {
    public CheeseDecorator(Pizza pizza) {
        super(pizza);
    }

    public double getCost() {
        return pizza.getCost() + 1.0;  // Add cheese cost
    }

    public String getDescription() {
        return pizza.getDescription() + ", Cheese";  // Add cheese description
    }
}

class PepperoniDecorator extends PizzaDecorator {
    public PepperoniDecorator(Pizza pizza) {
        super(pizza);
    }

    public double getCost() {
        return pizza.getCost() + 1.5;  // Add pepperoni cost
    }

    public String getDescription() {
        return pizza.getDescription() + ", Pepperoni";  // Add pepperoni
    }
}

class MushroomDecorator extends PizzaDecorator {
    public MushroomDecorator(Pizza pizza) {
        super(pizza);
    }

    public double getCost() {
        return pizza.getCost() + 0.75;  // Add mushroom cost
    }

    public String getDescription() {
        return pizza.getDescription() + ", Mushrooms";  // Add mushrooms
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        // Start with plain pizza
        Pizza pizza = new PlainPizza();
        System.out.println(pizza.getDescription() + " $" + pizza.getCost());
        // Output: Plain pizza $5.0

        // Add cheese
        pizza = new CheeseDecorator(pizza);
        System.out.println(pizza.getDescription() + " $" + pizza.getCost());
        // Output: Plain pizza, Cheese $6.0

        // Add pepperoni
        pizza = new PepperoniDecorator(pizza);
        System.out.println(pizza.getDescription() + " $" + pizza.getCost());
        // Output: Plain pizza, Cheese, Pepperoni $7.5

        // Add mushrooms
        pizza = new MushroomDecorator(pizza);
        System.out.println(pizza.getDescription() + " $" + pizza.getCost());
        // Output: Plain pizza, Cheese, Pepperoni, Mushrooms $8.25

        // Can combine in any order!
        Pizza anotherPizza = new MushroomDecorator(
                              new CheeseDecorator(
                              new PlainPizza()));
        // Mushrooms + Cheese pizza!
    }
}
```

## **4. Real-World Examples**

### **Example 1: Coffee Shop**

```java
interface Coffee {
    double getCost();
    String getDescription();
}

class SimpleCoffee implements Coffee {
    public double getCost() { return 2.0; }
    public String getDescription() { return "Simple coffee"; }
}

abstract class CoffeeDecorator implements Coffee {
    protected Coffee coffee;
    public CoffeeDecorator(Coffee coffee) { this.coffee = coffee; }
}

class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) { super(coffee); }
    public double getCost() { return coffee.getCost() + 0.5; }
    public String getDescription() { return coffee.getDescription() + ", Milk"; }
}

class SugarDecorator extends CoffeeDecorator {
    public SugarDecorator(Coffee coffee) { super(coffee); }
    public double getCost() { return coffee.getCost() + 0.2; }
    public String getDescription() { return coffee.getDescription() + ", Sugar"; }
}

class WhippedCreamDecorator extends CoffeeDecorator {
    public WhippedCreamDecorator(Coffee coffee) { super(coffee); }
    public double getCost() { return coffee.getCost() + 1.0; }
    public String getDescription() { return coffee.getDescription() + ", Whipped Cream"; }
}

// Usage
Coffee coffee = new SimpleCoffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
coffee = new WhippedCreamDecorator(coffee);
System.out.println(coffee.getDescription() + " $" + coffee.getCost());
// Output: Simple coffee, Milk, Sugar, Whipped Cream $3.7
```

### **Example 2: File I/O Decorators**

```java
// JDK's InputStream uses Decorator pattern!
FileInputStream fis = new FileInputStream("file.txt");
BufferedInputStream bis = new BufferedInputStream(fis);  // Adds buffering
DataInputStream dis = new DataInputStream(bis);          // Adds data reading methods

// Each decorator adds functionality
// FileInputStream → BufferedInputStream → DataInputStream
```

## **5. Java I/O: The Best Example**

```java
// java.io package is full of decorators
InputStream in = new FileInputStream("data.txt");
in = new BufferedInputStream(in);      // Adds buffering
in = new DataInputStream(in);          // Adds readInt(), readDouble(), etc.
in = new PushbackInputStream(in);      // Adds unread() capability

// Each layer adds new functionality!
```

## **6. Interview Q&A**

### **Q1: Decorator vs Inheritance?**

**A**:

- **Inheritance**: Adds behavior at **compile-time** (static)
- **Decorator**: Adds behavior at **runtime** (dynamic)

### **Q2: Decorator vs Strategy?**

**A**:

- **Decorator**: **Enhances** existing behavior (wrapping)
- **Strategy**: **Replaces** entire algorithm (swapping)

### **Q3: Decorator vs Proxy?**

**A**:

- **Decorator**: Adds **new behavior**
- **Proxy**: Controls **access** to object (may add some behavior)

### **Q4: Advantages?**

**A**:

1. **Flexible** - combine behaviors at runtime
2. **Open/Closed** - add new decorators without modifying code
3. **Single Responsibility** - each decorator does one thing
4. **Avoids class explosion** - no need for every combination

### **Q5: Disadvantages?**

**A**:

1. **Many small objects** - can be hard to debug
2. **Complex initialization** - many wrapper layers
3. **Order matters** - different order = different behavior

### **Q6: Real examples in JDK?**

**A**:

- `java.io` package (`BufferedInputStream`, `DataInputStream`)
- `java.util.Collections` (`synchronizedList()`, `unmodifiableList()`)
- `javax.servlet.http.HttpServletRequestWrapper`

## **7. Implementation Template**

```java
// 1. Component Interface
interface Component {
    void operation();
}

// 2. Concrete Component
class ConcreteComponent implements Component {
    public void operation() {
        System.out.println("Basic operation");
    }
}

// 3. Base Decorator
abstract class Decorator implements Component {
    protected Component component;

    public Decorator(Component component) {
        this.component = component;
    }

    public void operation() {
        component.operation();
    }
}

// 4. Concrete Decorators
class ConcreteDecoratorA extends Decorator {
    public ConcreteDecoratorA(Component component) {
        super(component);
    }

    public void operation() {
        super.operation();
        addedBehavior();
    }

    private void addedBehavior() {
        System.out.println("Added behavior A");
    }
}

class ConcreteDecoratorB extends Decorator {
    public ConcreteDecoratorB(Component component) {
        super(component);
    }

    public void operation() {
        super.operation();
        addedBehavior();
    }

    private void addedBehavior() {
        System.out.println("Added behavior B");
    }
}

// 5. Usage
Component component = new ConcreteComponent();
component = new ConcreteDecoratorA(component);
component = new ConcreteDecoratorB(component);
component.operation();
// Output:
// Basic operation
// Added behavior A
// Added behavior B
```

## **8. Spring Framework Example**

```java
// Request/Response wrappers in Spring MVC
@Component
class LoggingDecorator extends HttpServletRequestWrapper {

    public LoggingDecorator(HttpServletRequest request) {
        super(request);
    }

    @Override
    public String getParameter(String name) {
        String value = super.getParameter(name);
        // Add logging behavior
        System.out.println("Parameter " + name + " = " + value);
        return value;
    }
}

// Usage in filter
@Component
public class LoggingFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                   HttpServletResponse response,
                                   FilterChain chain) throws IOException, ServletException {
        // Wrap request with decorator
        HttpServletRequest wrappedRequest = new LoggingDecorator(request);
        chain.doFilter(wrappedRequest, response);
    }
}
```

## **9. Modern Java Example**

```java
// Using composition with Java 8+
interface Text {
    String content();
}

class PlainText implements Text {
    private String text;
    public PlainText(String text) { this.text = text; }
    public String content() { return text; }
}

// Functional decorator
class TextDecorator implements Text {
    private Text text;
    private Function<String, String> decorator;

    public TextDecorator(Text text, Function<String, String> decorator) {
        this.text = text;
        this.decorator = decorator;
    }

    public String content() {
        return decorator.apply(text.content());
    }
}

// Usage
Text text = new PlainText("Hello World");
text = new TextDecorator(text, String::toUpperCase);
text = new TextDecorator(text, s -> "*** " + s + " ***");
System.out.println(text.content());  // *** HELLO WORLD ***
```

## **10. Best Practices**

1. **Keep decorators lightweight** - they should add minimal overhead
2. **Ensure decorators are transparent** - client shouldn't know it's decorated
3. **Document decorator order** if it matters
4. **Consider builder pattern** for complex decoration chains
