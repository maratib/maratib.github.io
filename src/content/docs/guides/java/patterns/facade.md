---
title: Facade Pattern
description: Java Facade Pattern (STRUCTURAL PATTERN)
sidebar:
  order: 4
---

_Java Facade Pattern (STRUCTURAL PATTERN)_

_A **simplified interface** to a complex subsystem - provides a **single entry point** to multiple components._

**Facade Pattern**: Provides a **simple interface** to a **complex subsystem** - like a remote control for your home theater system.

## **2. Real-World Analogy**

**Hotel Reception**:

- Complex hotel system (housekeeping, kitchen, billing, maintenance)
- You interact only with **receptionist** (facade)
- They coordinate all subsystems for you

## **3. Problem It Solves**

**Complex subsystems** with many interdependent classes make client code:

- Hard to use
- Tightly coupled
- Difficult to maintain

## **4. Simple Example: Home Theater System**

### **❌ Without Facade (Complex)**

```java
// Subsystem classes
class DVDPlayer {
    void on() { System.out.println("DVD on"); }
    void play(String movie) { System.out.println("Playing " + movie); }
    void off() { System.out.println("DVD off"); }
}

class Projector {
    void on() { System.out.println("Projector on"); }
    void setInput(DVDPlayer dvd) { System.out.println("Projector → DVD"); }
    void off() { System.out.println("Projector off"); }
}

class SoundSystem {
    void on() { System.out.println("Sound on"); }
    void setVolume(int level) { System.out.println("Volume: " + level); }
    void off() { System.out.println("Sound off"); }
}

// Problem: Client needs to know ALL steps
public class Client {
    public static void main(String[] args) {
        DVDPlayer dvd = new DVDPlayer();
        Projector projector = new Projector();
        SoundSystem sound = new SoundSystem();

        // Too many steps!
        dvd.on();
        projector.on();
        projector.setInput(dvd);
        sound.on();
        sound.setVolume(10);
        dvd.play("Inception");

        // And similarly for shutdown...
    }
}
```

### **✅ With Facade (Simple)**

```java
// Same subsystem classes as above...

// FACADE: Simplified interface
class HomeTheaterFacade {
    private DVDPlayer dvd;
    private Projector projector;
    private SoundSystem sound;

    public HomeTheaterFacade() {
        this.dvd = new DVDPlayer();
        this.projector = new Projector();
        this.sound = new SoundSystem();
    }

    // ONE method to rule them all!
    public void watchMovie(String movie) {
        System.out.println("🎬 Getting ready to watch " + movie);
        dvd.on();
        projector.on();
        projector.setInput(dvd);
        sound.on();
        sound.setVolume(10);
        dvd.play(movie);
    }

    public void endMovie() {
        System.out.println("🛑 Shutting down...");
        dvd.off();
        projector.off();
        sound.off();
    }
}

// Client code becomes trivial
public class Client {
    public static void main(String[] args) {
        HomeTheaterFacade theater = new HomeTheaterFacade();

        theater.watchMovie("Inception");  // One call!
        // Watch movie...
        theater.endMovie();               // One call!
    }
}
```

## **5. Key Benefits**

1. **Simplifies client code** (from 10+ calls to 1-2)
2. **Decouples** client from subsystem
3. **Easier to change** subsystem implementation
4. **Promotes** single responsibility principle

## **6. Structure Diagram (Mental Model)**

```
┌─────────────────┐
│     Client      │
└────────┬────────┘
         │ Simple calls
         ▼
┌─────────────────┐
│     Facade      │ ← Your simplified interface
│  (HomeTheater)  │
└────────┬────────┘
         │ Coordinates
         ▼
┌─────────────────────────────────┐
│         Subsystem               │
│  ┌─────┐ ┌──────┐ ┌────────┐   │
│  │ DVD │ │Sound │ │Projector│  │
│  └─────┘ └──────┘ └────────┘  │
└─────────────────────────────────┘
```

## **7. Real-World Examples**

### **Example 1: Database Facade**

```java
// Complex JDBC operations
class DatabaseFacade {
    public void saveUser(String name, String email) {
        // Hides complexity:
        // 1. Get connection
        // 2. Create statement
        // 3. Execute SQL
        // 4. Handle exceptions
        // 5. Close resources
        System.out.println("Saved user: " + name);
    }

    public User getUser(int id) {
        // Similar complexity hidden
        return new User(id, "John");
    }
}

// Client
DatabaseFacade db = new DatabaseFacade();
db.saveUser("John", "john@email.com");  // Simple!
```

### **Example 2: Order Processing**

```java
class OrderFacade {
    private InventoryService inventory;
    private PaymentService payment;
    private ShippingService shipping;

    public void placeOrder(String productId, int quantity,
                           String cardNumber) {
        // 1. Check inventory
        if (!inventory.checkStock(productId, quantity)) {
            throw new RuntimeException("Out of stock");
        }

        // 2. Process payment
        payment.process(cardNumber, calculateTotal());

        // 3. Ship order
        shipping.ship(productId, quantity);

        // 4. Update inventory
        inventory.reduceStock(productId, quantity);

        System.out.println("✅ Order completed!");
    }
}
```

## **8. Interview Q&A**

### **Q1: Facade vs Adapter?**

**A**:

- **Facade**: Simplifies interface to complex subsystem (many-to-one)
- **Adapter**: Makes one interface match another (one-to-one)

### **Q2: Facade vs Mediator?**

**A**:

- **Facade**: One-way communication (client → subsystem)
- **Mediator**: Two-way communication between components

### **Q3: Does Facade add new functionality?**

**A**: No! It only simplifies existing functionality. The real work is done by subsystem classes.

### **Q4: When to use Facade?**

**A**: When you have:

1. Complex subsystem with many classes
2. Need to provide simple interface for common tasks
3. Want to decouple client from subsystem
4. Need entry point to legacy system

### **Q5: Can clients still access subsystem directly?**

**A**: **Yes!** Facade provides convenience, not restriction. Clients can still use subsystem classes if needed.

## **9. Implementation Template**

```java
// 1. Complex subsystem classes
class SubsystemA { void operationA() { } }
class SubsystemB { void operationB() { } }
class SubsystemC { void operationC() { } }

// 2. Facade
class SimpleFacade {
    private SubsystemA a = new SubsystemA();
    private SubsystemB b = new SubsystemB();
    private SubsystemC c = new SubsystemC();

    public void doSimpleTask() {
        a.operationA();
        b.operationB();
        c.operationC();
    }
}

// 3. Client
public class Main {
    public static void main(String[] args) {
        SimpleFacade facade = new SimpleFacade();
        facade.doSimpleTask();  // Simple!
    }
}
```

## **10. Design Principles Applied**

1. **Law of Demeter**: Client talks only to facade
2. **Single Responsibility**: Facade's job is simplification
3. **Loosely Coupled**: Client doesn't know subsystem details
