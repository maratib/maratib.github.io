---
title: Command Pattern
description: Java Command Pattern (BEHAVIORAL PATTERN)
sidebar:
  order: 9
---

_Java Command Pattern (BEHAVIORAL PATTERN)_

_**Encapsulates requests** as objects, allowing parameterization, queuing, logging, and undo operations._

**Command Pattern**: **Objectifies actions** - turns requests into objects that can be stored, queued, logged, and undone, like a restaurant order ticket system!

## **2. Real-World Analogy**

**Restaurant Order**:

- Customer gives order to waiter (command)
- Waiter writes it on paper (command object)
- Kitchen executes order (receiver)
- Can undo if wrong order
- Can queue multiple orders

## **3. Simple Example: Without vs With Command**

### **❌ Without Command (Tight Coupling)**

```java
class Light {
    void turnOn() { System.out.println("Light is ON"); }
    void turnOff() { System.out.println("Light is OFF"); }
}

class RemoteControl {
    private Light light;

    public RemoteControl(Light light) {
        this.light = light;
    }

    public void buttonPressed(String action) {
        if (action.equals("ON")) {
            light.turnOn();  // ❌ Direct call
        } else if (action.equals("OFF")) {
            light.turnOff(); // ❌ Hard to add new actions
        }
    }
}
```

### **✅ With Command (Flexible)**

```java
// Step 1: Command Interface
interface Command {
    void execute();
    void undo();
}

// Step 2: Receiver (Knows how to do the work)
class Light {
    void turnOn() {
        System.out.println("💡 Light is ON");
    }

    void turnOff() {
        System.out.println("💡 Light is OFF");
    }
}

// Step 3: Concrete Commands
class LightOnCommand implements Command {
    private Light light;

    public LightOnCommand(Light light) {
        this.light = light;
    }

    public void execute() {
        light.turnOn();
    }

    public void undo() {
        light.turnOff();  // Opposite action
    }
}

class LightOffCommand implements Command {
    private Light light;

    public LightOffCommand(Light light) {
        this.light = light;
    }

    public void execute() {
        light.turnOff();
    }

    public void undo() {
        light.turnOn();  // Opposite action
    }
}

// Step 4: Invoker (Triggers commands)
class RemoteControl {
    private Command command;
    private Command lastCommand;  // For undo

    public void setCommand(Command command) {
        this.command = command;
    }

    public void pressButton() {
        command.execute();
        lastCommand = command;  // Save for undo
    }

    public void pressUndo() {
        if (lastCommand != null) {
            lastCommand.undo();
        }
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        // Create receiver
        Light livingRoomLight = new Light();

        // Create commands
        Command lightOn = new LightOnCommand(livingRoomLight);
        Command lightOff = new LightOffCommand(livingRoomLight);

        // Create invoker
        RemoteControl remote = new RemoteControl();

        // Turn light on
        remote.setCommand(lightOn);
        remote.pressButton();  // 💡 Light is ON

        // Turn light off
        remote.setCommand(lightOff);
        remote.pressButton();  // 💡 Light is OFF

        // Undo last command
        remote.pressUndo();    // 💡 Light is ON (undoes light off)
    }
}
```

## **4. Real-World Examples**

### **Example 1: Text Editor (Undo/Redo)**

```java
interface EditorCommand {
    void execute();
    void undo();
}

class Document {
    private StringBuilder content = new StringBuilder();

    void write(String text) {
        content.append(text);
        System.out.println("Document: " + content);
    }

    void deleteLast(int chars) {
        content.setLength(content.length() - chars);
        System.out.println("Document: " + content);
    }

    String getContent() { return content.toString(); }
}

class WriteCommand implements EditorCommand {
    private Document document;
    private String text;

    public WriteCommand(Document doc, String text) {
        this.document = doc;
        this.text = text;
    }

    public void execute() {
        document.write(text);
    }

    public void undo() {
        document.deleteLast(text.length());
    }
}

class TextEditor {
    private Stack<EditorCommand> history = new Stack<>();

    public void executeCommand(EditorCommand command) {
        command.execute();
        history.push(command);
    }

    public void undo() {
        if (!history.isEmpty()) {
            EditorCommand command = history.pop();
            command.undo();
        }
    }
}

// Usage
Document doc = new Document();
TextEditor editor = new TextEditor();

editor.executeCommand(new WriteCommand(doc, "Hello "));
editor.executeCommand(new WriteCommand(doc, "World!"));
editor.undo();  // Removes "World!"
```

### **Example 2: Smart Home System**

```java
class TV {
    void turnOn() { System.out.println("📺 TV ON"); }
    void turnOff() { System.out.println("📺 TV OFF"); }
    void setChannel(int channel) { System.out.println("📺 Channel " + channel); }
}

class Stereo {
    void turnOn() { System.out.println("🔊 Stereo ON"); }
    void turnOff() { System.out.println("🔊 Stereo OFF"); }
    void setVolume(int level) { System.out.println("🔊 Volume " + level); }
}

// Macro Command (multiple commands)
class PartyModeCommand implements Command {
    private List<Command> commands = new ArrayList<>();

    public void addCommand(Command command) {
        commands.add(command);
    }

    public void execute() {
        for (Command cmd : commands) {
            cmd.execute();
        }
    }

    public void undo() {
        // Undo in reverse order
        for (int i = commands.size() - 1; i >= 0; i--) {
            commands.get(i).undo();
        }
    }
}

// Usage for party mode
PartyModeCommand partyMode = new PartyModeCommand();
partyMode.addCommand(new TVOnCommand(tv));
partyMode.addCommand(new StereoOnCommand(stereo));
partyMode.addCommand(new StereoVolumeCommand(stereo, 10));

remote.setCommand(partyMode);
remote.pressButton();  // Turns everything on for party!
```

## **5. Interview Q&A**

### **Q1: Command vs Strategy Pattern?**

**A**:

- **Command**: Encapsulates **action + receiver** (what to do + who does it)
- **Strategy**: Encapsulates **algorithm only** (how to do it)

### **Q2: Command vs Memento (for undo)?**

**A**:

- **Command**: Stores **how to undo** (reverse operation)
- **Memento**: Stores **previous state** (snapshot)

### **Q3: Advantages?**

**A**:

1. **Decouples** invoker from receiver
2. **Easy to add** new commands
3. **Undo/Redo** support
4. **Queueing** and logging capabilities
5. **Macro commands** (combine commands)

### **Q4: Disadvantages?**

**A**:

1. **Many classes** - each command needs a class
2. **Complexity** - for simple operations
3. **Memory** - storing command history

### **Q5: Real examples in JDK?**

**A**:

- `Runnable` interface (command pattern for threads)
- `Swing Action` classes
- `javax.swing.Action`

### **Q6: When to use Command?**

**A**: When you need:

1. Undo/redo functionality
2. Queue operations
3. Log operations
4. Transactional behavior
5. Macro commands

## **6. Implementation Template**

```java
// 1. Command Interface
interface Command {
    void execute();
    void undo();
}

// 2. Receiver
class Receiver {
    void action() { System.out.println("Receiver action"); }
}

// 3. Concrete Command
class ConcreteCommand implements Command {
    private Receiver receiver;

    public ConcreteCommand(Receiver receiver) {
        this.receiver = receiver;
    }

    public void execute() {
        receiver.action();
    }

    public void undo() {
        System.out.println("Undo action");
    }
}

// 4. Invoker
class Invoker {
    private Command command;

    public void setCommand(Command command) {
        this.command = command;
    }

    public void executeCommand() {
        command.execute();
    }
}

// 5. Client
public class Main {
    public static void main(String[] args) {
        Receiver receiver = new Receiver();
        Command command = new ConcreteCommand(receiver);
        Invoker invoker = new Invoker();

        invoker.setCommand(command);
        invoker.executeCommand();
    }
}
```

## **7. Modern Java 8+ Implementation**

```java
// Using Functional Interfaces
@FunctionalInterface
interface SimpleCommand {
    void execute();

    default SimpleCommand andThen(SimpleCommand after) {
        return () -> {
            execute();
            after.execute();
        };
    }
}

// Usage with lambdas
public class ModernRemote {
    private SimpleCommand command;

    public void setCommand(SimpleCommand command) {
        this.command = command;
    }

    public void pressButton() {
        command.execute();
    }
}

// Client code
ModernRemote remote = new ModernRemote();

// Command as lambda
remote.setCommand(() -> System.out.println("Light ON"));
remote.pressButton();

// Chain commands
SimpleCommand partyMode =
    () -> System.out.println("TV ON")
    .andThen(() -> System.out.println("Music ON"))
    .andThen(() -> System.out.println("Lights dim"));

remote.setCommand(partyMode);
remote.pressButton();
```

## **8. Spring Framework Example**

```java
// Spring's @EventListener uses command pattern
@Component
class OrderService {
    @EventListener
    public void handleOrderCreated(OrderCreatedEvent event) {
        // This is a command executed by Spring
        System.out.println("Processing order: " + event.getOrderId());
    }
}

// Or using CommandLineRunner
@Component
class StartupCommand implements CommandLineRunner {
    @Override
    public void run(String... args) {
        // Executed on application startup
        System.out.println("Application started!");
    }
}

// Or using @Scheduled
@Component
class ScheduledCommand {
    @Scheduled(fixedRate = 5000)
    public void executeEvery5Seconds() {
        // Scheduled command
        System.out.println("Scheduled task executed");
    }
}
```

## **9. Undo/Redo Stack Implementation**

```java
class UndoRedoManager {
    private Stack<Command> undoStack = new Stack<>();
    private Stack<Command> redoStack = new Stack<>();

    public void execute(Command command) {
        command.execute();
        undoStack.push(command);
        redoStack.clear();  // Clear redo on new command
    }

    public void undo() {
        if (!undoStack.isEmpty()) {
            Command command = undoStack.pop();
            command.undo();
            redoStack.push(command);
        }
    }

    public void redo() {
        if (!redoStack.isEmpty()) {
            Command command = redoStack.pop();
            command.execute();
            undoStack.push(command);
        }
    }

    public boolean canUndo() { return !undoStack.isEmpty(); }
    public boolean canRedo() { return !redoStack.isEmpty(); }
}
```

## **10. Best Practices**

1. **Keep commands immutable** if possible
2. **Use composite pattern** for macro commands
3. **Consider memento** for complex undo scenarios
4. **Log commands** for debugging/audit trails
5. **Use command history** for undo/redo
