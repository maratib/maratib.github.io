---
title: Abstract Factory
description: Java Abstract Factory Pattern (CREATIONAL PATTERN)
sidebar:
  order: 2
---

_Java Factory Pattern (CREATIONAL PATTERN)_

_Creates **families of related objects** without specifying their concrete classes._

**Abstract Factory Pattern**: Creates **matching sets of related objects** - ensures all components work together harmoniously, like furniture from the same design collection.

## **2. Real-World Analogy**

**Furniture Store**:

- You want matching furniture (Modern chair + Modern table + Modern sofa)
- Or Victorian set (Victorian chair + Victorian table + Victorian sofa)
- Abstract factory ensures all pieces match the same style

## **3. Simple Example: UI Components**

### **❌ Without Abstract Factory (Problem)**

```java
// Individual components
interface Button {
    void click();
}

interface Checkbox {
    void check();
}

// Windows versions
class WindowsButton implements Button {
    public void click() { System.out.println("Windows button clicked"); }
}

class WindowsCheckbox implements Checkbox {
    public void check() { System.out.println("Windows checkbox checked"); }
}

// Mac versions
class MacButton implements Button {
    public void click() { System.out.println("Mac button clicked"); }
}

class MacCheckbox implements Checkbox {
    public void check() { System.out.println("Mac checkbox checked"); }
}

// Problem: Client can mix mismatched components
public class Client {
    public static void main(String[] args) {
        // ❌ Mismatched UI - Windows button with Mac checkbox!
        Button button = new WindowsButton();
        Checkbox checkbox = new MacCheckbox(); // WRONG STYLE!
    }
}
```

### **✅ With Abstract Factory (Solution)**

```java
// Step 1: Abstract Factory Interface
interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

// Step 2: Concrete Factories for each family
class WindowsFactory implements GUIFactory {
    public Button createButton() {
        return new WindowsButton(); // Returns Windows family
    }

    public Checkbox createCheckbox() {
        return new WindowsCheckbox(); // Returns Windows family
    }
}

class MacFactory implements GUIFactory {
    public Button createButton() {
        return new MacButton(); // Returns Mac family
    }

    public Checkbox createCheckbox() {
        return new MacCheckbox(); // Returns Mac family
    }
}

// Step 3: Client uses abstract factory
class Application {
    private GUIFactory factory;
    private Button button;
    private Checkbox checkbox;

    // Constructor accepts ANY factory
    public Application(GUIFactory factory) {
        this.factory = factory;
    }

    public void createUI() {
        // Creates matching components
        button = factory.createButton();  // Both from same family
        checkbox = factory.createCheckbox(); // Guaranteed to match!
    }

    public void paint() {
        button.click();
        checkbox.check();
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        // Create Windows UI (all components match)
        GUIFactory windowsFactory = new WindowsFactory();
        Application windowsApp = new Application(windowsFactory);
        windowsApp.createUI();
        windowsApp.paint();

        // Create Mac UI (all components match)
        GUIFactory macFactory = new MacFactory();
        Application macApp = new Application(macFactory);
        macApp.createUI();
        macApp.paint();
    }
}
```

## **4. Structure & Key Players**

```
┌─────────────────────────────────────────┐
│          Abstract Factory                │
│         (GUIFactory Interface)          │
└─────────────┬───────────────────────────┘
              │ defines methods for
              │ creating abstract products
              ▼
┌─────────────────────────────────────────┐
│        Concrete Factories               │
│  ┌─────────────┐  ┌─────────────────┐  │
│  │WindowsFactory│  │   MacFactory    │  │
│  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────┘
         creates              creates
          ▼                    ▼
┌─────────────────────────────────────────┐
│         Product Families                │
│  WindowsButton   │     MacButton       │
│  WindowsCheckbox │     MacCheckbox     │
└─────────────────────────────────────────┘
```

## **5. Real-World Examples**

### **Example 1: Database Factory**

```java
// Abstract Factory
interface DatabaseFactory {
    Connection createConnection();
    Query createQuery();
    Transaction createTransaction();
}

// MySQL Family
class MySQLFactory implements DatabaseFactory {
    public Connection createConnection() {
        return new MySQLConnection();
    }
    public Query createQuery() {
        return new MySQLQuery();
    }
    public Transaction createTransaction() {
        return new MySQLTransaction();
    }
}

// PostgreSQL Family
class PostgreSQLFactory implements DatabaseFactory {
    public Connection createConnection() {
        return new PostgreSQLConnection();
    }
    public Query createQuery() {
        return new PostgreSQLQuery();
    }
    public Transaction createTransaction() {
        return new PostgreSQLTransaction();
    }
}

// Client
class DatabaseClient {
    private DatabaseFactory factory;

    public DatabaseClient(DatabaseFactory factory) {
        this.factory = factory;
    }

    public void executeQuery(String sql) {
        Connection conn = factory.createConnection();
        Query query = factory.createQuery();
        // All components work together
    }
}
```

### **Example 2: Theme Factory**

```java
// Abstract Factory
interface ThemeFactory {
    Button createButton();
    Dialog createDialog();
    Menu createMenu();
}

// Dark Theme Family
class DarkThemeFactory implements ThemeFactory {
    public Button createButton() {
        return new DarkButton();
    }
    public Dialog createDialog() {
        return new DarkDialog();
    }
    public Menu createMenu() {
        return new DarkMenu();
    }
}

// Light Theme Family
class LightThemeFactory implements ThemeFactory {
    public Button createButton() {
        return new LightButton();
    }
    public Dialog createDialog() {
        return new LightDialog();
    }
    public Menu createMenu() {
        return new LightMenu();
    }
}
```

## **6. Interview Q&A**

### **Q1: Abstract Factory vs Factory Method?**

**A**:
| Abstract Factory | Factory Method |
|-----------------|----------------|
| Creates **families** of related objects | Creates **one** product |
| Multiple factory methods in one interface | Single factory method |
| Composition (object has factory) | Inheritance (subclass decides) |
| "Kit" of products | Single product |

### **Q2: Abstract Factory vs Builder?**

**A**:

- **Abstract Factory**: Creates **different but related** objects
- **Builder**: Creates **one complex** object step by step

### **Q3: When to use Abstract Factory?**

**A**: When:

1. System needs multiple product families
2. Products must be used together (compatibility needed)
3. Want to hide concrete classes from client
4. Need to easily switch between families

### **Q4: Real example in Java/JDK?**

**A**:

```java
// javax.xml.parsers.DocumentBuilderFactory
DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
// Creates related XML parsing objects
```

### **Q5: How to add new product family?**

**A**: Easy! Just implement the abstract factory interface:

```java
class LinuxFactory implements GUIFactory {
    public Button createButton() { return new LinuxButton(); }
    public Checkbox createCheckbox() { return new LinuxCheckbox(); }
}
// No changes to client code!
```

### **Q6: How to add new product type?**

**A**: Hard! Need to:

1. Add method to abstract factory
2. Implement in all concrete factories
3. This violates **Open/Closed Principle**

## **7. Advantages & Disadvantages**

### **✓ Advantages**

1. **Ensures compatibility** - All products match
2. **Decouples client** from concrete classes
3. **Easy to exchange** product families
4. **Promotes consistency** across products

### **✗ Disadvantages**

1. **Hard to extend** with new product types
2. **Complex code** - Many classes/interfaces
3. **Overkill** for simple scenarios

## **8. Implementation Template**

```java
// 1. Abstract Products
interface ProductA { void useA(); }
interface ProductB { void useB(); }

// 2. Concrete Products
class ProductA1 implements ProductA { public void useA() {} }
class ProductB1 implements ProductB { public void useB() {} }

class ProductA2 implements ProductA { public void useA() {} }
class ProductB2 implements ProductB { public void useB() {} }

// 3. Abstract Factory
interface AbstractFactory {
    ProductA createProductA();
    ProductB createProductB();
}

// 4. Concrete Factories
class ConcreteFactory1 implements AbstractFactory {
    public ProductA createProductA() { return new ProductA1(); }
    public ProductB createProductB() { return new ProductB1(); }
}

class ConcreteFactory2 implements AbstractFactory {
    public ProductA createProductA() { return new ProductA2(); }
    public ProductB createProductB() { return new ProductB2(); }
}

// 5. Client
class Client {
    private AbstractFactory factory;

    Client(AbstractFactory factory) {
        this.factory = factory;
    }

    void execute() {
        ProductA a = factory.createProductA();
        ProductB b = factory.createProductB();
        // Guaranteed to be compatible
    }
}
```

## **9. Spring Framework Example**

```java
// Spring's BeanFactory is like abstract factory
public interface BeanFactory {
    Object getBean(String name);
    <T> T getBean(Class<T> requiredType);
    <T> T getBean(String name, Class<T> requiredType);
}

// Different implementations
AnnotationConfigApplicationContext context1 =
    new AnnotationConfigApplicationContext();

ClassPathXmlApplicationContext context2 =
    new ClassPathXmlApplicationContext();

// Both return compatible Spring beans
```
