---
title: Adapter Pattern
description: Java Adapter Pattern (STRUCTURAL PATTERN)
sidebar:
  order: 4
---

_Java Adapter Pattern (STRUCTURAL PATTERN)_

**Adapter Pattern**: Wraps an incompatible object to make it work with your interface - like a charging adapter for different plug types.

## **1. What Problem It Solves?**

**"Incompatible interfaces"** - When you need to use a class that doesn't have the interface your code expects.

## **2. Real-World Analogy**

**Power Adapter**: US plug (3 pins) → Indian socket (2 pins). Adapter makes them compatible.

## **3. Classic Example: Media Players**

### **❌ Without Adapter (Problem)**

```java
// Existing interface our code expects
interface MediaPlayer {
    void play(String audioType, String fileName);
}

// New library with different interface
interface AdvancedMediaPlayer {
    void playMp4(String fileName);
    void playVlc(String fileName);
}

class Mp4Player implements AdvancedMediaPlayer {
    public void playMp4(String fileName) {
        System.out.println("Playing mp4: " + fileName);
    }
    public void playVlc(String fileName) { /* Can't play */ }
}

// Problem: How to use Mp4Player with MediaPlayer interface?
```

### **✅ With Adapter (Solution)**

```java
// Step 1: Target Interface (What client expects)
interface MediaPlayer {
    void play(String audioType, String fileName);
}

// Step 2: Adaptee (Existing class to adapt)
interface AdvancedMediaPlayer {
    void playMp4(String fileName);
    void playVlc(String fileName);
}

class Mp4Player implements AdvancedMediaPlayer {
    public void playMp4(String fileName) {
        System.out.println("Playing mp4: " + fileName);
    }
    public void playVlc(String fileName) {
        // Do nothing or throw exception
    }
}

// Step 3: Adapter (Bridges the gap)
class MediaAdapter implements MediaPlayer {
    private AdvancedMediaPlayer advancedPlayer;

    public MediaAdapter(String audioType) {
        if(audioType.equalsIgnoreCase("mp4")) {
            advancedPlayer = new Mp4Player();
        }
    }

    public void play(String audioType, String fileName) {
        if(audioType.equalsIgnoreCase("mp4")) {
            advancedPlayer.playMp4(fileName);  // Adapts the call
        }
    }
}

// Step 4: Client uses adapter transparently
class AudioPlayer implements MediaPlayer {
    private MediaAdapter adapter;

    public void play(String audioType, String fileName) {
        if(audioType.equalsIgnoreCase("mp3")) {
            // Built-in support
            System.out.println("Playing mp3: " + fileName);
        } else if(audioType.equalsIgnoreCase("mp4")) {
            // Use adapter for new formats
            adapter = new MediaAdapter(audioType);
            adapter.play(audioType, fileName);
        }
    }
}
```

## **4. Usage - Simple Example**

```java
public class Main {
    public static void main(String[] args) {
        AudioPlayer player = new AudioPlayer();

        player.play("mp3", "song.mp3");     // Direct support
        player.play("mp4", "video.mp4");    // Via adapter
        player.play("vlc", "movie.vlc");    // Via adapter
    }
}
```

## **5. Two Types of Adapters**

### **1. Class Adapter (Inheritance)**

```java
// Uses multiple inheritance (not in Java, but concept)
class SocketAdapter extends IndianSocket implements USPlug {
    public void giveElectricity() {
        supplyPower();  // Calls parent method
    }
}
```

### **2. Object Adapter (Composition) - PREFERRED**

```java
// Uses composition (more flexible)
class SocketAdapter implements USPlug {
    private IndianSocket socket;  // Composition

    public SocketAdapter(IndianSocket socket) {
        this.socket = socket;
    }

    public void giveElectricity() {
        socket.supplyPower();  // Delegates
    }
}
```

## **6. Lombok Can't Help Here**

**Why?** Adapter is about behavior/interface adaptation, not boilerplate reduction. But we can write clean adapters:

```java
// Clean Adapter Example
@RequiredArgsConstructor  // Lombok for constructor
public class CleanAdapter implements TargetInterface {
    private final LegacyService legacyService;  // Injected

    public void newMethod() {
        // Adapt old method to new interface
        legacyService.oldMethod();
    }
}
```

## **7. Real-World Examples**

### **Example 1: Payment Gateway Adapter**

```java
interface PaymentProcessor {
    boolean pay(double amount);
}

// Different payment providers
class PayPal {
    public boolean sendPayment(double amt) { return true; }
}

class Stripe {
    public boolean chargeCard(double amount) { return true; }
}

// Adapter for PayPal
class PayPalAdapter implements PaymentProcessor {
    private PayPal paypal = new PayPal();

    public boolean pay(double amount) {
        return paypal.sendPayment(amount);  // Adapts method name
    }
}

// Usage
PaymentProcessor processor = new PayPalAdapter();
processor.pay(100.0);  // Works with any provider
```

### **Example 2: Logging Adapter**

```java
// Modern interface
interface Logger {
    void log(Level level, String message);
}

// Old library
class LegacyLogger {
    void debug(String msg) { System.out.println("DEBUG: " + msg); }
    void error(String msg) { System.out.println("ERROR: " + msg); }
}

// Adapter
class LegacyLoggerAdapter implements Logger {
    private LegacyLogger legacy = new LegacyLogger();

    public void log(Level level, String message) {
        if(level == Level.DEBUG) {
            legacy.debug(message);
        } else if(level == Level.ERROR) {
            legacy.error(message);
        }
    }
}
```

## **8. Interview Q&A**

### **Q1: Adapter vs Decorator?**

**A**:

- **Adapter**: Changes interface (makes incompatible compatible)
- **Decorator**: Adds behavior (enhances existing interface)

### **Q2: Adapter vs Facade?**

**A**:

- **Adapter**: Makes one interface match another (one-to-one)
- **Facade**: Simplifies complex subsystem (many-to-one)

### **Q3: When to use Adapter?**

**A**: When you need to:

1. Use existing class with incompatible interface
2. Integrate legacy code
3. Use third-party libraries
4. Make classes work together that couldn't otherwise

### **Q4: Composition vs Inheritance in Adapter?**

**A**: Prefer **composition** (object adapter) because:

- More flexible (can adapt multiple classes)
- Follows "favor composition over inheritance"
- Can adapt objects at runtime

## **9. Quick Implementation Template**

```java
// 1. Target interface (client expects this)
interface Target {
    void request();
}

// 2. Adaptee (existing class)
class Adaptee {
    void specificRequest() {
        System.out.println("Adaptee's method");
    }
}

// 3. Adapter
class Adapter implements Target {
    private Adaptee adaptee = new Adaptee();

    public void request() {
        adaptee.specificRequest();  // Adapts the call
    }
}

// 4. Client
class Client {
    void use(Target target) {
        target.request();  // Works with adapter
    }
}
```
