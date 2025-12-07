---
title: Template Method Pattern
description: Java Template Method Pattern (BEHAVIORAL PATTERN)
sidebar:
  order: 10
---

_Java Template Method Pattern (BEHAVIORAL PATTERN)_

_Defines **skeleton of algorithm** in base class, letting subclasses override specific steps without changing structure._

**Template Method Pattern**: **Algorithm skeleton** in base class with **customizable steps** in subclasses - like a cooking recipe where basic steps are fixed but ingredients can vary!

## **2. Real-World Analogy**

**House Construction**:

- Template: Foundation → Walls → Roof → Interior
- Each house type follows same steps
- But each step differs (wooden walls vs brick walls)

## **3. Simple Example: Without vs With Template**

### **❌ Without Template (Code Duplication)**

```java
class Tea {
    public void prepareRecipe() {
        boilWater();           // Same
        steepTeaBag();         // Tea-specific
        pourInCup();           // Same
        addLemon();            // Tea-specific
    }
}

class Coffee {
    public void prepareRecipe() {
        boilWater();           // Same (duplicated!)
        brewCoffeeGrinds();    // Coffee-specific
        pourInCup();           // Same (duplicated!)
        addSugarAndMilk();     // Coffee-specific
    }
}
// ❌ Duplicated common steps
// ❌ Hard to change common algorithm
```

### **✅ With Template (DRY Principle)**

```java
// Step 1: Abstract Class with Template Method
abstract class CaffeineBeverage {

    // TEMPLATE METHOD (final to prevent overriding)
    public final void prepareRecipe() {
        boilWater();      // Common step
        brew();           // Abstract - subclass implements
        pourInCup();      // Common step
        addCondiments();  // Abstract - subclass implements
    }

    // Common implementations
    void boilWater() {
        System.out.println("🚰 Boiling water");
    }

    void pourInCup() {
        System.out.println("☕ Pouring into cup");
    }

    // Abstract methods - subclasses MUST implement
    abstract void brew();
    abstract void addCondiments();
}

// Step 2: Concrete Subclasses
class Tea extends CaffeineBeverage {
    void brew() {
        System.out.println("🍃 Steeping the tea");
    }

    void addCondiments() {
        System.out.println("🍋 Adding lemon");
    }
}

class Coffee extends CaffeineBeverage {
    void brew() {
        System.out.println("☕ Dripping coffee through filter");
    }

    void addCondiments() {
        System.out.println("🥛 Adding sugar and milk");
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        System.out.println("Making tea:");
        CaffeineBeverage tea = new Tea();
        tea.prepareRecipe();

        System.out.println("\nMaking coffee:");
        CaffeineBeverage coffee = new Coffee();
        coffee.prepareRecipe();

        // Output:
        // Making tea:
        // 🚰 Boiling water
        // 🍃 Steeping the tea
        // ☕ Pouring into cup
        // 🍋 Adding lemon

        // Making coffee:
        // 🚰 Boiling water
        // ☕ Dripping coffee through filter
        // ☕ Pouring into cup
        // 🥛 Adding sugar and milk
    }
}
```

## **4. Hooks (Optional Override Points)**

```java
abstract class CaffeineBeverageWithHook {

    public final void prepareRecipe() {
        boilWater();
        brew();
        pourInCup();
        if (customerWantsCondiments()) {  // HOOK
            addCondiments();
        }
    }

    // Hook method - optional override
    boolean customerWantsCondiments() {
        return true;  // Default implementation
    }

    abstract void brew();
    abstract void addCondiments();

    void boilWater() { System.out.println("Boiling water"); }
    void pourInCup() { System.out.println("Pouring into cup"); }
}

// Subclass using hook
class CoffeeWithHook extends CaffeineBeverageWithHook {
    void brew() { System.out.println("Dripping coffee"); }
    void addCondiments() { System.out.println("Adding sugar and milk"); }

    // Override hook based on customer preference
    boolean customerWantsCondiments() {
        String answer = getUserInput();
        return answer.toLowerCase().startsWith("y");
    }

    private String getUserInput() {
        // Get user preference
        return "yes";
    }
}
```

## **5. Real-World Examples**

### **Example 1: Data Processing Pipeline**

```java
abstract class DataProcessor {
    // Template method
    public final void process(String fileName) {
        readData(fileName);
        processData();
        validateData();
        saveData();
        cleanup();
    }

    // Common steps
    void readData(String fileName) {
        System.out.println("Reading data from: " + fileName);
    }

    void validateData() {
        System.out.println("Validating data...");
    }

    void cleanup() {
        System.out.println("Cleaning up resources...");
    }

    // Abstract steps - subclasses define
    abstract void processData();
    abstract void saveData();
}

class CSVProcessor extends DataProcessor {
    void processData() {
        System.out.println("Processing CSV data...");
    }

    void saveData() {
        System.out.println("Saving to database...");
    }
}

class XMLProcessor extends DataProcessor {
    void processData() {
        System.out.println("Parsing XML data...");
    }

    void saveData() {
        System.out.println("Saving to XML file...");
    }
}
```

### **Example 2: Build Tools (Maven/Gradle)**

```java
abstract class BuildTool {
    // Template for build process
    public final void build() {
        compile();
        runTests();
        packageApplication();
        if (shouldDeploy()) {  // Hook
            deploy();
        }
    }

    void compile() {
        System.out.println("Compiling source code...");
    }

    void runTests() {
        System.out.println("Running tests...");
    }

    // Hook
    boolean shouldDeploy() {
        return false;  // Default: don't deploy
    }

    abstract void packageApplication();
    abstract void deploy();
}

class MavenBuild extends BuildTool {
    void packageApplication() {
        System.out.println("Creating JAR with Maven...");
    }

    void deploy() {
        System.out.println("Deploying to Maven Central...");
    }
}

class ProductionBuild extends BuildTool {
    void packageApplication() {
        System.out.println("Creating WAR file...");
    }

    void deploy() {
        System.out.println("Deploying to production server...");
    }

    // Override hook for production
    boolean shouldDeploy() {
        return true;  // Always deploy in production
    }
}
```

## **6. Interview Q&A**

### **Q1: Template Method vs Strategy?**

**A**:

- **Template Method**: Inheritance-based, **controls algorithm flow** (Hollywood Principle: "Don't call us, we'll call you")
- **Strategy**: Composition-based, **replaces entire algorithm**

### **Q2: Template Method vs Factory Method?**

**A**:

- **Template Method**: Defines **algorithm skeleton**
- **Factory Method**: Defines **object creation** (specialized template method)

### **Q3: Why make template method `final`?**

**A**: To prevent subclasses from changing the **algorithm structure**. They can only override specific steps.

### **Q4: Hook methods vs abstract methods?**

**A**:

- **Abstract methods**: MUST be implemented
- **Hook methods**: CAN be implemented (optional)

```java
// Abstract - subclasses MUST implement
abstract void requiredStep();

// Hook - subclasses CAN override
void optionalHook() { /* default impl */ }
```

### **Q5: Real examples in JDK?**

**A**:

- `java.io.InputStream/OutputStream` (read()/write() methods)
- `java.util.AbstractList` (get(), set(), add())
- `javax.servlet.http.HttpServlet` (doGet(), doPost())
- `java.awt.Component` (paint() method)

### **Q6: Advantages?**

**A**:

1. **Code reuse** - Common code in base class
2. **Consistent algorithm** - Structure fixed
3. **Flexible** - Subclasses customize specific steps
4. **Inversion of Control** - Base class calls subclass methods

## **7. Implementation Template**

```java
abstract class AbstractClass {
    // Template method (FINAL)
    public final void templateMethod() {
        primitiveOperation1();
        primitiveOperation2();
        concreteOperation();
        hook();
    }

    // Abstract methods - subclasses implement
    abstract void primitiveOperation1();
    abstract void primitiveOperation2();

    // Concrete method - common implementation
    void concreteOperation() {
        System.out.println("Common operation");
    }

    // Hook method - optional override
    void hook() { }
}

class ConcreteClass extends AbstractClass {
    void primitiveOperation1() {
        System.out.println("Implementation 1");
    }

    void primitiveOperation2() {
        System.out.println("Implementation 2");
    }

    // Optional: override hook
    void hook() {
        System.out.println("Custom hook");
    }
}
```

## **8. Spring Framework Example**

```java
// Spring's JdbcTemplate is perfect example!
public abstract class JdbcDaoSupport {

    // Template method for query
    public final <T> T execute(ConnectionCallback<T> action) {
        Connection con = getConnection();
        try {
            return action.doInConnection(con);  // Callback
        } finally {
            releaseConnection(con);
        }
    }

    protected abstract Connection getConnection();
    protected abstract void releaseConnection(Connection con);
}

// Subclass implements specific steps
public class MyDao extends JdbcDaoSupport {

    public User getUser(int id) {
        return execute(connection -> {
            // Only write business logic
            PreparedStatement ps = connection.prepareStatement(
                "SELECT * FROM users WHERE id = ?");
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            // Map result to User object
            return new User();
        });
    }

    protected Connection getConnection() {
        return dataSource.getConnection();
    }

    protected void releaseConnection(Connection con) {
        // Custom connection release logic
    }
}
```

## **9. Hollywood Principle**

**"Don't call us, we'll call you"**

- Base class calls subclass methods
- Subclasses don't call base class methods (except via `super`)
- Inversion of control

## **10. Best Practices**

1. **Make template method `final`** to preserve algorithm structure
2. **Minimize abstract methods** - only what truly varies
3. **Use hooks** for optional customization points
4. **Document** which methods are hooks vs required
5. **Consider strategy pattern** if too many variations

## **11. Common Pitfalls**

```java
// ❌ BAD: Too many abstract methods
abstract class BadTemplate {
    abstract void step1();
    abstract void step2();
    abstract void step3();
    abstract void step4();
    // Hard to implement subclasses!
}

// ✅ GOOD: Balance between abstract and concrete
abstract class GoodTemplate {
    public final void process() {
        commonStep();
        variableStep();
        anotherCommonStep();
    }

    void commonStep() { /* common */ }
    void anotherCommonStep() { /* common */ }
    abstract void variableStep();  // Only what varies
}
```
