---
title: Strategy Pattern
description: Java Strategy Pattern (BEHAVIORAL PATTERN)
sidebar:
  order: 7
---

_Java Strategy Pattern (BEHAVIORAL PATTERN)_

_**Dynamic** behavior selection - like choosing payment method at checkout!_

**Strategy Pattern**:

## **2. Real-World Analogy**

**YouTube Channel**:

- Channel (Subject) uploads new video
- Subscribers (Observers) get notified automatically
- Subscribers can subscribe/unsubscribe anytime

## **3. Simple Example: Without vs With Observer**

### **❌ Without Observer (Tight Coupling)**

```java
class NewsAgency {
    private String news;

    // Direct references to subscribers - BAD!
    private CNN cnn;
    private BBC bbc;

    public void setNews(String news) {
        this.news = news;
        // Manually notify each subscriber
        cnn.update(news);  // ❌ Tight coupling!
        bbc.update(news);  // ❌ Hard to add new subscribers
    }
}
```

### **✅ With Observer (Loose Coupling)**

```java
// Step 1: Observer Interface
interface Subscriber {
    void update(String news);
}

// Step 2: Subject Interface
interface NewsChannel {
    void subscribe(Subscriber subscriber);
    void unsubscribe(Subscriber subscriber);
    void notifySubscribers();
}

// Step 3: Concrete Subject
class YouTubeChannel implements NewsChannel {
    private List<Subscriber> subscribers = new ArrayList<>();
    private String latestVideo;

    public void uploadVideo(String videoTitle) {
        this.latestVideo = videoTitle;
        notifySubscribers();  // Auto-notify all!
    }

    public void subscribe(Subscriber subscriber) {
        subscribers.add(subscriber);
    }

    public void unsubscribe(Subscriber subscriber) {
        subscribers.remove(subscriber);
    }

    public void notifySubscribers() {
        for (Subscriber subscriber : subscribers) {
            subscriber.update(latestVideo);
        }
    }
}

// Step 4: Concrete Observers
class User implements Subscriber {
    private String name;

    public User(String name) {
        this.name = name;
    }

    public void update(String videoTitle) {
        System.out.println(name + " notified: New video - " + videoTitle);
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        YouTubeChannel channel = new YouTubeChannel();

        User alice = new User("Alice");
        User bob = new User("Bob");
        User charlie = new User("Charlie");

        // Subscribe
        channel.subscribe(alice);
        channel.subscribe(bob);

        // Upload video - subscribers auto-notified
        channel.uploadVideo("Java Tutorial");
        // Output:
        // Alice notified: New video - Java Tutorial
        // Bob notified: New video - Java Tutorial

        // Unsubscribe and upload
        channel.unsubscribe(bob);
        channel.subscribe(charlie);

        channel.uploadVideo("Spring Boot Guide");
        // Output:
        // Alice notified: New video - Spring Boot Guide
        // Charlie notified: New video - Spring Boot Guide
    }
}
```

## **4. Java's Built-in Observer (Deprecated but Good to Know)**

```java
import java.util.Observable;
import java.util.Observer;

// Subject (extends Observable)
class WeatherStation extends Observable {
    private int temperature;

    public void setTemperature(int temp) {
        this.temperature = temp;
        setChanged();  // Mark as changed
        notifyObservers(temp);  // Notify observers
    }
}

// Observer (implements Observer)
class PhoneDisplay implements Observer {
    public void update(Observable o, Object arg) {
        System.out.println("Phone: Temperature is " + arg + "°C");
    }
}

// Usage
WeatherStation station = new WeatherStation();
station.addObserver(new PhoneDisplay());
station.setTemperature(25);  // Auto-notifies
```

## **5. Real-World Examples**

### **Example 1: Stock Market**

```java
interface StockObserver {
    void update(String stock, double price);
}

class StockMarket {
    private Map<String, Double> stocks = new HashMap<>();
    private List<StockObserver> observers = new ArrayList<>();

    public void setPrice(String stock, double price) {
        stocks.put(stock, price);
        notifyObservers(stock, price);
    }

    public void addObserver(StockObserver observer) {
        observers.add(observer);
    }

    private void notifyObservers(String stock, double price) {
        for (StockObserver observer : observers) {
            observer.update(stock, price);
        }
    }
}

class Trader implements StockObserver {
    private String name;

    public Trader(String name) {
        this.name = name;
    }

    public void update(String stock, double price) {
        if (price > 100) {
            System.out.println(name + ": Selling " + stock + " at $" + price);
        }
    }
}
```

### **Example 2: Event Manager in GUI**

```java
// Button click listeners are observers!
class Button {
    private List<ClickListener> listeners = new ArrayList<>();

    public void addClickListener(ClickListener listener) {
        listeners.add(listener);
    }

    public void click() {
        System.out.println("Button clicked!");
        for (ClickListener listener : listeners) {
            listener.onClick();
        }
    }
}

interface ClickListener {
    void onClick();
}

class SaveButtonListener implements ClickListener {
    public void onClick() {
        System.out.println("Saving document...");
    }
}
```

## **6. Spring Framework Example**

```java
// Spring's ApplicationEvent and ApplicationListener
@Component
class OrderPlacedEvent extends ApplicationEvent {
    private String orderId;

    public OrderPlacedEvent(Object source, String orderId) {
        super(source);
        this.orderId = orderId;
    }
}

@Component
class EmailService implements ApplicationListener<OrderPlacedEvent> {
    @Override
    public void onApplicationEvent(OrderPlacedEvent event) {
        System.out.println("Sending email for order: " + event.getOrderId());
    }
}

@Component
class InventoryService implements ApplicationListener<OrderPlacedEvent> {
    @Override
    public void onApplicationEvent(OrderPlacedEvent event) {
        System.out.println("Updating inventory for order: " + event.getOrderId());
    }
}

// Publisher
@Service
class OrderService {
    @Autowired
    private ApplicationEventPublisher eventPublisher;

    public void placeOrder(String orderId) {
        // Process order...
        eventPublisher.publishEvent(new OrderPlacedEvent(this, orderId));
    }
}
```

## **7. Interview Q&A**

### **Q1: Observer vs Pub-Sub?**

**A**:

- **Observer**: Direct relationship (subject knows observers)
- **Pub-Sub**: Indirect via message broker (decoupled)

### **Q2: Push vs Pull Model?**

**A**:

- **Push**: Subject sends all data to observers
- **Pull**: Observers fetch data from subject when notified

```java
// Push model (shown above) - subject sends data
void update(String data);

// Pull model - observer fetches data
void update();  // Observer calls subject.getData()
```

### **Q3: Real examples in Java?**

**A**:

- `java.util.Observer/Observable` (deprecated)
- `PropertyChangeListener` in Swing
- `Event Listeners` in AWT/Swing
- `ApplicationListener` in Spring
- `Reactive Streams` (RxJava, Reactor)

### **Q4: Advantages?**

**A**:

1. **Loose coupling** - Subject doesn't know observer details
2. **Dynamic relationships** - Can add/remove observers at runtime
3. **Broadcast communication** - One change notifies many
4. **Open/Closed** - Easy to add new observers

### **Q5: Disadvantages?**

**A**:

1. **Memory leaks** - Forgot to unsubscribe
2. **Unexpected updates** - Cascading notifications
3. **Performance** - Many observers can be slow
4. **Debugging hard** - Chain of notifications

### **Q6: How to prevent memory leaks?**

**A**: Use **WeakReference** or ensure unsubscribe:

```java
// Method 1: Auto-unsubscribe
try {
    subject.subscribe(observer);
    // Do work
} finally {
    subject.unsubscribe(observer);
}

// Method 2: WeakReference
private List<WeakReference<Observer>> observers = new ArrayList<>();
```

## **8. Modern Implementation with Java 8+**

```java
// Using Functional Interfaces
class EventBus {
    private List<Consumer<String>> handlers = new ArrayList<>();

    public void subscribe(Consumer<String> handler) {
        handlers.add(handler);
    }

    public void publish(String event) {
        handlers.forEach(handler -> handler.accept(event));
    }
}

// Usage with lambdas
EventBus bus = new EventBus();
bus.subscribe(event -> System.out.println("Handler 1: " + event));
bus.subscribe(event -> System.out.println("Handler 2: " + event));
bus.publish("Event occurred!");
```

## **9. Implementation Template**

```java
// 1. Observer Interface
interface Observer {
    void update(Object data);
}

// 2. Subject Interface
interface Subject {
    void attach(Observer observer);
    void detach(Observer observer);
    void notifyObservers();
}

// 3. Concrete Subject
class ConcreteSubject implements Subject {
    private List<Observer> observers = new ArrayList<>();
    private Object state;

    public void setState(Object state) {
        this.state = state;
        notifyObservers();
    }

    public void attach(Observer observer) {
        observers.add(observer);
    }

    public void detach(Observer observer) {
        observers.remove(observer);
    }

    public void notifyObservers() {
        for (Observer observer : observers) {
            observer.update(state);
        }
    }
}

// 4. Concrete Observer
class ConcreteObserver implements Observer {
    public void update(Object data) {
        System.out.println("Received: " + data);
    }
}
```
