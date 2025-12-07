---
title: Singleton Pattern
description: Java Singleton Pattern (CREATIONAL PATTERN)
sidebar:
  order: 0
---

_Java Singleton Pattern (CREATIONAL PATTERN)_

_Ensures **only one instance** of a class exists and provides **global access** to it._

**Singleton Pattern**: Ensures one instance of a class exists with global access - use Bill Pugh or Enum implementation for thread safety.

## **2. When to Use?**

When you need:

- Single point of control (Logger, Config, Cache)
- Shared resource (Database connection)
- Global access point
- Expensive object to create (create once, reuse)

## **3. Simple Example: Basic Singleton**

### **❌ Problem Without Singleton**

```java
class DatabaseConnection {
    // Multiple instances can be created
}

// Different parts of code create separate instances
DatabaseConnection conn1 = new DatabaseConnection();
DatabaseConnection conn2 = new DatabaseConnection();
// conn1 != conn2 - Multiple connections!
```

### **✅ Basic Singleton Implementation**

```java
public class DatabaseConnection {
    // 1. Private static instance
    private static DatabaseConnection instance;

    // 2. Private constructor - prevents external instantiation
    private DatabaseConnection() {
        System.out.println("Database connection created");
    }

    // 3. Public static method to get instance
    public static DatabaseConnection getInstance() {
        if (instance == null) {
            instance = new DatabaseConnection(); // Lazy initialization
        }
        return instance;
    }

    public void connect() {
        System.out.println("Connected to database");
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        // Always get the same instance
        DatabaseConnection conn1 = DatabaseConnection.getInstance();
        DatabaseConnection conn2 = DatabaseConnection.getInstance();

        System.out.println(conn1 == conn2); // true - Same object!
        conn1.connect();
    }
}
```

## **4. Singleton Variations**

### **1. Eager Initialization** (Thread-safe)

```java
public class EagerSingleton {
    // Create instance when class loads
    private static final EagerSingleton instance = new EagerSingleton();

    private EagerSingleton() {}

    public static EagerSingleton getInstance() {
        return instance; // Always returns pre-created instance
    }
}
```

### **2. Lazy Initialization with Double-Check Locking** (Thread-safe & Efficient)

```java
public class ThreadSafeSingleton {
    // volatile ensures visibility across threads
    private static volatile ThreadSafeSingleton instance;

    private ThreadSafeSingleton() {}

    public static ThreadSafeSingleton getInstance() {
        if (instance == null) { // First check (no locking)
            synchronized (ThreadSafeSingleton.class) {
                if (instance == null) { // Second check (with locking)
                    instance = new ThreadSafeSingleton();
                }
            }
        }
        return instance;
    }
}
```

### **3. Bill Pugh Singleton** (Best - Thread-safe & Efficient)

```java
public class BillPughSingleton {
    private BillPughSingleton() {}

    // Static inner class - loaded only when getInstance() is called
    private static class SingletonHelper {
        private static final BillPughSingleton INSTANCE = new BillPughSingleton();
    }

    public static BillPughSingleton getInstance() {
        return SingletonHelper.INSTANCE; // Thread-safe by JVM design
    }
}
```

### **4. Enum Singleton** (Recommended by Joshua Bloch)

```java
public enum EnumSingleton {
    INSTANCE; // Single instance guaranteed by JVM

    // Add methods
    public void doSomething() {
        System.out.println("Singleton method");
    }
}

// Usage
EnumSingleton.INSTANCE.doSomething();
```

## **5. Real-World Examples**

### **Example 1: Logger Singleton**

```java
public class Logger {
    private static Logger instance;
    private List<String> logs = new ArrayList<>();

    private Logger() {} // Private constructor

    public static Logger getInstance() {
        if (instance == null) {
            instance = new Logger();
        }
        return instance;
    }

    public void log(String message) {
        logs.add(message);
        System.out.println("LOG: " + message);
    }

    public List<String> getLogs() {
        return new ArrayList<>(logs); // Return copy
    }
}

// Usage anywhere in application
Logger.getInstance().log("User logged in");
Logger.getInstance().log("File uploaded");
```

### **Example 2: Configuration Manager**

```java
public class ConfigManager {
    private static ConfigManager instance;
    private Properties config = new Properties();

    private ConfigManager() {
        // Load configuration once
        loadConfig();
    }

    public static ConfigManager getInstance() {
        if (instance == null) {
            synchronized (ConfigManager.class) {
                if (instance == null) {
                    instance = new ConfigManager();
                }
            }
        }
        return instance;
    }

    private void loadConfig() {
        // Load from file/database
        config.setProperty("db.url", "localhost:3306");
        config.setProperty("app.name", "MyApp");
    }

    public String getProperty(String key) {
        return config.getProperty(key);
    }
}

// Usage
String dbUrl = ConfigManager.getInstance().getProperty("db.url");
```

## **6. Interview Q&A**

### **Q1: Why is basic singleton not thread-safe?**

**A**: Two threads can both pass `if (instance == null)` check and create separate instances. Use double-check locking or Bill Pugh method.

### **Q2: Which singleton implementation is best?**

**A**:

1. **Bill Pugh**: Clean, thread-safe, efficient (no synchronization)
2. **Enum**: Simplest, thread-safe, serialization-safe
3. **Double-check locking**: Efficient for multi-threaded

### **Q3: How to prevent Singleton from cloning?**

**A**: Override `clone()` method:

```java
@Override
protected Object clone() throws CloneNotSupportedException {
    throw new CloneNotSupportedException();
}
```

### **Q4: How to prevent Singleton from serialization?**

**A**: Implement `readResolve()` method:

```java
protected Object readResolve() {
    return getInstance(); // Return existing instance
}
```

### **Q5: Singleton vs Static Class?**

**A**:
| Singleton | Static Class |
|-----------|--------------|
| Can implement interfaces | Cannot implement interfaces |
| Can be passed as parameter | Cannot be passed |
| Can inherit from other classes | Cannot inherit |
| Lazy initialization possible | Eager initialization only |
| Can have state | Stateless |

### **Q6: Real Singleton in JDK?**

**A**:

- `Runtime.getRuntime()` - Singleton
- `Desktop.getDesktop()` - Singleton
- `System.getSecurityManager()` - Singleton

## **7. Common Pitfalls & Solutions**

### **1. Reflection Attack Prevention**

```java
public class ReflectionSafeSingleton {
    private static ReflectionSafeSingleton instance;
    private static boolean created = false;

    private ReflectionSafeSingleton() {
        if (created) {
            throw new RuntimeException("Use getInstance() method");
        }
        created = true;
    }

    public static ReflectionSafeSingleton getInstance() {
        if (instance == null) {
            instance = new ReflectionSafeSingleton();
        }
        return instance;
    }
}
```

### **2. Serializable Singleton**

```java
public class SerializableSingleton implements Serializable {
    private static final long serialVersionUID = 1L;

    private static SerializableSingleton instance = new SerializableSingleton();

    private SerializableSingleton() {}

    public static SerializableSingleton getInstance() {
        return instance;
    }

    // This method preserves singleton during deserialization
    protected Object readResolve() {
        return getInstance();
    }
}
```

## **8. Spring Framework & Singleton**

```java
// Spring beans are singletons by default
@Component  // Spring manages as singleton
public class UserService {
    // All injections get same instance
}

// Different scopes available
@Scope("singleton")  // Default - one per container
@Scope("prototype")  // New instance each time
@Scope("request")    // One per HTTP request
@Scope("session")    // One per HTTP session
```

## **9. Implementation Template**

```java
// Best Practice: Bill Pugh Singleton
public class MySingleton {
    // 1. Private constructor
    private MySingleton() {
        // Initialization code
    }

    // 2. Static inner class
    private static class SingletonHolder {
        private static final MySingleton INSTANCE = new MySingleton();
    }

    // 3. Public access method
    public static MySingleton getInstance() {
        return SingletonHolder.INSTANCE;
    }

    // 4. Business methods
    public void businessMethod() {
        // Your logic
    }
}
```

## **10. When NOT to Use Singleton**

1. **Testing**: Hard to mock
2. **Global state**: Can lead to hidden dependencies
3. **Concurrency issues**: If not properly implemented
4. **Memory leaks**: Singleton holds references
5. **Flexibility**: Can't extend or change behavior easily
