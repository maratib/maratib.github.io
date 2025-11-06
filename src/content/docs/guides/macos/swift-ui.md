---
title: SwiftUI
slug: guides/macos/swift-ui
description: SwiftUI
sidebar:
  order: 3
---

Remember:

**SwiftUI is declarative** - you describe WHAT you want, not HOW to do it.
The framework handles the rest!

## 1. What is SwiftUI? <a name="what-is-swiftui"></a>

_A declarative framework that lets you build user interfaces by describing what they should look like_

### Your First SwiftUI App

```swift
import SwiftUI

// Main app structure
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()  // Your first screen
        }
    }
}

// Your first view
struct ContentView: View {
    var body: some View {
        Text("Hello, SwiftUI!")  // Display text
            .font(.largeTitle)   // Make it big
            .foregroundColor(.blue)  // Make it blue
    }
}
```

### How SwiftUI Works

- **Declarative**: You describe WHAT the UI should look like
- **Automatic Updates**: UI updates when your data changes
- **Live Preview**: See changes instantly in Xcode

## 2. Basic Views <a name="basic-views"></a>

_The fundamental components you use to build your interface_

### Text Views

```swift
struct TextView: View {
    var body: some View {
        VStack {
            Text("Simple Text")           // Basic text
            Text("Styled Text")           // Text with modifiers
                .font(.title)             // Font size
                .foregroundColor(.red)    // Text color
                .bold()                   // Make bold

            Text("Multi\nLine\nText")     // Multiple lines
            Text("Hello **World**")       // Markdown support
        }
    }
}
```

### Image Views

```swift
struct ImageView: View {
    var body: some View {
        VStack {
            Image(systemName: "heart.fill")  // SF Symbols icon
                .font(.largeTitle)
                .foregroundColor(.red)

            Image("myPhoto")                 // Your own image
                .resizable()                 // Make resizable
                .frame(width: 200, height: 200)  // Set size
                .cornerRadius(20)            // Round corners
        }
    }
}
```

### Basic Shapes

```swift
struct ShapesView: View {
    var body: some View {
        HStack {
            Circle()                    // Circle shape
                .fill(Color.blue)       // Solid color
                .frame(width: 80, height: 80)

            Rectangle()                 // Rectangle shape
                .fill(Color.red)
                .frame(width: 80, height: 80)

            RoundedRectangle(cornerRadius: 15)  // Rounded rectangle
                .fill(Color.green)
                .frame(width: 80, height: 80)
        }
    }
}
```

## 3. Layout and Stacks <a name="layout-stacks"></a>

_Containers that arrange views horizontally, vertically, or overlapped_

### VStack - Vertical Stack

```swift
struct VStackView: View {
    var body: some View {
        VStack {  // Arranges views vertically
            Text("First")
            Text("Second")
            Text("Third")
        }
        .padding()  // Add space around
    }
}
```

### HStack - Horizontal Stack

```swift
struct HStackView: View {
    var body: some View {
        HStack {  // Arranges views horizontally
            Text("Left")
            Text("Middle")
            Text("Right")
        }
        .padding()
    }
}
```

### ZStack - Overlapping Stack

```swift
struct ZStackView: View {
    var body: some View {
        ZStack {  // Arranges views on top of each other
            Circle()
                .fill(Color.blue)
                .frame(width: 100, height: 100)

            Text("Center")
                .foregroundColor(.white)
                .font(.title)
        }
    }
}
```

### Spacer and Alignment

```swift
struct SpacerView: View {
    var body: some View {
        VStack {
            HStack {
                Text("Left")
                Spacer()  // Pushes views apart
                Text("Right")
            }
            .padding()

            HStack(alignment: .top) {  // Align to top
                Text("Top")
                Text("Aligned\nTo\nTop")
            }
        }
    }
}
```

## 4. State Management <a name="state-management"></a>

_How your app remembers and responds to changes in data_

### @State - Simple Local State

```swift
struct CounterView: View {
    @State private var count = 0  // State variable - can change

    var body: some View {
        VStack {
            Text("Count: \(count)")  // Updates automatically
                .font(.largeTitle)

            Button("Increment") {
                count += 1  // Changing state updates UI
            }
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(8)
        }
    }
}
```

### @Binding - Sharing State Between Views

```swift
struct ParentView: View {
    @State private var isOn = false  // State in parent

    var body: some View {
        VStack {
            Text("Parent: \(isOn ? "On" : "Off")")
            ToggleView(isOn: $isOn)  // Pass binding to child
        }
    }
}

struct ToggleView: View {
    @Binding var isOn: Bool  // Binding to parent's state

    var body: some View {
        Toggle("Toggle", isOn: $isOn)  // Two-way binding
            .padding()
    }
}
```

### @StateObject and @ObservedObject - Managing Complex State

```swift
class UserSettings: ObservableObject {
    @Published var username = "Guest"  // When this changes, views update
    @Published var isLoggedIn = false
}

struct SettingsView: View {
    @StateObject private var settings = UserSettings()  // Owns the object

    var body: some View {
        VStack {
            Text("Welcome, \(settings.username)")
            TextField("Username", text: $settings.username)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding()
        }
    }
}
```

## 5. User Input <a name="user-input"></a>

_Controls that let users interact with your app_

### Buttons

```swift
struct ButtonsView: View {
    @State private var message = "Press a button"

    var body: some View {
        VStack {
            Text(message)

            Button("Simple Button") {
                message = "Simple button pressed"
            }
            .padding()

            Button(action: {
                message = "Styled button pressed"
            }) {
                HStack {
                    Image(systemName: "star.fill")
                    Text("Styled Button")
                }
                .padding()
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(8)
            }
        }
    }
}
```

### Text Fields

```swift
struct TextFieldView: View {
    @State private var name = ""
    @State private var password = ""

    var body: some View {
        VStack {
            TextField("Enter your name", text: $name)  // Single-line input
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding()

            SecureField("Enter password", text: $password)  // Password field
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding()

            Text("Hello, \(name)")
        }
    }
}
```

### Toggles and Sliders

```swift
struct ControlsView: View {
    @State private var isOn = false
    @State private var volume: Double = 0.5
    @State private var rating = 3

    var body: some View {
        VStack {
            Toggle("Enable Feature", isOn: $isOn)
                .padding()

            Slider(value: $volume, in: 0...1)  // Range from 0 to 1
                .padding()

            Text("Volume: \(Int(volume * 100))%")

            Stepper("Rating: \(rating)", value: $rating, in: 1...5)
                .padding()
        }
    }
}
```

## 6. Navigation <a name="navigation"></a>

_Moving between different screens in your app_

### Basic Navigation

```swift
struct MainView: View {
    var body: some View {
        NavigationView {  // Navigation container
            VStack {
                NavigationLink("Go to Details") {  // Link to another view
                    DetailView()
                }
                .padding()

                NavigationLink(destination: SettingsView()) {
                    HStack {
                        Image(systemName: "gear")
                        Text("Settings")
                    }
                }
                .padding()
            }
            .navigationTitle("Home")  // Title for screen
        }
    }
}

struct DetailView: View {
    var body: some View {
        Text("Detail Screen")
            .navigationTitle("Details")  // Title for this screen
    }
}
```

### Lists with Navigation

```swift
struct ListNavigationView: View {
    let items = ["Apple", "Banana", "Orange", "Grapes"]

    var body: some View {
        NavigationView {
            List(items, id: \.self) { item in
                NavigationLink(destination: DetailView(item: item)) {
                    HStack {
                        Image(systemName: "circle.fill")
                        Text(item)
                    }
                }
            }
            .navigationTitle("Fruits")
        }
    }
}

struct DetailView: View {
    let item: String

    var body: some View {
        VStack {
            Text("You selected:")
            Text(item)
                .font(.largeTitle)
                .foregroundColor(.blue)
        }
        .navigationTitle(item)
    }
}
```

## 7. Lists and Data <a name="lists-data"></a>

_Displaying collections of data in scrollable lists_

### Basic Lists

```swift
struct BasicListView: View {
    let simpleItems = ["Item 1", "Item 2", "Item 3"]

    var body: some View {
        List {
            Text("First Item")
            Text("Second Item")
            Text("Third Item")
        }
    }
}
```

### Dynamic Lists

```swift
struct Fruit: Identifiable {
    let id = UUID()  // Unique identifier
    let name: String
    let color: String
}

struct DynamicListView: View {
    let fruits = [
        Fruit(name: "Apple", color: "Red"),
        Fruit(name: "Banana", color: "Yellow"),
        Fruit(name: "Orange", color: "Orange")
    ]

    var body: some View {
        List(fruits) { fruit in  // Automatic row creation
            HStack {
                Circle()
                    .fill(Color(fruit.color.lowercased()))
                    .frame(width: 20, height: 20)
                Text(fruit.name)
                Spacer()
                Text(fruit.color)
                    .foregroundColor(.gray)
            }
        }
    }
}
```

### List Operations

```swift
struct EditableListView: View {
    @State private var items = ["Milk", "Eggs", "Bread"]
    @State private var newItem = ""

    var body: some View {
        NavigationView {
            VStack {
                HStack {
                    TextField("New item", text: $newItem)
                    Button("Add") {
                        if !newItem.isEmpty {
                            items.append(newItem)
                            newItem = ""
                        }
                    }
                }
                .padding()

                List {
                    ForEach(items, id: \.self) { item in
                        Text(item)
                    }
                    .onDelete(perform: deleteItems)  // Swipe to delete
                    .onMove(perform: moveItems)      // Drag to reorder
                }
                .toolbar {
                    EditButton()  // Built-in edit button
                }
            }
            .navigationTitle("Shopping List")
        }
    }

    func deleteItems(at offsets: IndexSet) {
        items.remove(atOffsets: offsets)
    }

    func moveItems(from source: IndexSet, to destination: Int) {
        items.move(fromOffsets: source, toOffset: destination)
    }
}
```

## 8. Modifiers <a name="modifiers"></a>

_Methods that customize the appearance and behavior of views_

### Appearance Modifiers

```swift
struct ModifiersView: View {
    var body: some View {
        VStack(spacing: 20) {
            Text("Hello World")
                .font(.largeTitle)           // Font size
                .foregroundColor(.blue)      // Text color
                .background(Color.yellow)    // Background color
                .padding()                   // Add space around

            Rectangle()
                .fill(Color.red)             // Fill color
                .frame(width: 200, height: 100)  // Size
                .cornerRadius(15)            // Round corners
                .shadow(radius: 10)          // Add shadow

            Button("Styled Button") { }
                .padding()
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(10)
                .overlay(                    // Add border
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(Color.black, lineWidth: 2)
                )
        }
    }
}
```

### Layout Modifiers

```swift
struct LayoutModifiersView: View {
    var body: some View {
        VStack {
            Text("Top")
                .frame(maxWidth: .infinity)  // Take full width
                .background(Color.blue)
                .foregroundColor(.white)

            Spacer()  // Push views apart

            Text("Middle")
                .padding(.horizontal, 20)    // Horizontal padding only
                .background(Color.gray)

            Spacer()

            Text("Bottom")
                .frame(width: 200, height: 50)  // Fixed size
                .background(Color.green)
        }
    }
}
```

## 9. Animation <a name="animation"></a>

_Adding motion and smooth transitions to your views_

### Basic Animations

```swift
struct BasicAnimationView: View {
    @State private var isScaled = false
    @State private var isRotated = false

    var body: some View {
        VStack(spacing: 30) {
            Circle()
                .fill(Color.blue)
                .frame(width: 100, height: 100)
                .scaleEffect(isScaled ? 1.5 : 1.0)  // Scale animation
                .animation(.easeInOut(duration: 0.5), value: isScaled)

            Rectangle()
                .fill(Color.red)
                .frame(width: 100, height: 100)
                .rotationEffect(.degrees(isRotated ? 180 : 0))  // Rotation
                .animation(.spring(), value: isRotated)

            Button("Animate") {
                isScaled.toggle()
                isRotated.toggle()
            }
            .padding()
        }
    }
}
```

### State-Based Animations

```swift
struct StateAnimationView: View {
    @State private var isVisible = false

    var body: some View {
        VStack {
            Button("Toggle") {
                withAnimation(.easeInOut(duration: 1.0)) {  // Explicit animation
                    isVisible.toggle()
                }
            }
            .padding()

            if isVisible {
                RoundedRectangle(cornerRadius: 25)
                    .fill(Color.green)
                    .frame(height: 200)
                    .transition(.slide)  // Slide in/out
            }

            Circle()
                .fill(Color.blue)
                .frame(width: 100, height: 100)
                .opacity(isVisible ? 1.0 : 0.3)  // Fade animation
                .animation(.easeInOut(duration: 0.5), value: isVisible)
        }
    }
}
```

## 10. Advanced Topics <a name="advanced-topics"></a>

_Taking your SwiftUI skills to the next level_

### Custom Views

```swift
struct UserCard: View {
    let name: String
    let email: String

    var body: some View {
        HStack {
            Image(systemName: "person.circle.fill")
                .font(.largeTitle)
                .foregroundColor(.blue)

            VStack(alignment: .leading) {
                Text(name)
                    .font(.headline)
                Text(email)
                    .font(.subheadline)
                    .foregroundColor(.gray)
            }

            Spacer()
        }
        .padding()
        .background(Color.white)
        .cornerRadius(10)
        .shadow(radius: 5)
    }
}

struct CustomViewExample: View {
    var body: some View {
        VStack {
            UserCard(name: "John Doe", email: "john@example.com")
            UserCard(name: "Jane Smith", email: "jane@example.com")
        }
        .padding()
    }
}
```

### ViewModifier for Reusable Styles

```swift
struct CardStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding()
            .background(Color.white)
            .cornerRadius(10)
            .shadow(radius: 5)
            .padding()
    }
}

extension View {
    func cardStyle() -> some View {
        self.modifier(CardStyle())
    }
}

struct ViewModifierExample: View {
    var body: some View {
        VStack {
            Text("Card 1")
                .cardStyle()  // Reusable style

            Text("Card 2")
                .cardStyle()
        }
    }
}
```

### Building a Complete App

```swift
struct TodoItem: Identifiable {
    let id = UUID()
    var title: String
    var isCompleted = false
}

struct TodoApp: View {
    @State private var items: [TodoItem] = []
    @State private var newItemTitle = ""

    var body: some View {
        NavigationView {
            VStack {
                HStack {
                    TextField("New todo", text: $newItemTitle)
                        .textFieldStyle(RoundedBorderTextFieldStyle())

                    Button("Add") {
                        let newItem = TodoItem(title: newItemTitle)
                        items.append(newItem)
                        newItemTitle = ""
                    }
                    .disabled(newItemTitle.isEmpty)
                }
                .padding()

                List {
                    ForEach(items) { item in
                        HStack {
                            Image(systemName: item.isCompleted ? "checkmark.circle.fill" : "circle")
                                .foregroundColor(item.isCompleted ? .green : .gray)
                            Text(item.title)
                                .strikethrough(item.isCompleted)
                            Spacer()
                        }
                        .onTapGesture {
                            if let index = items.firstIndex(where: { $0.id == item.id }) {
                                items[index].isCompleted.toggle()
                            }
                        }
                    }
                    .onDelete(perform: deleteItems)
                }
            }
            .navigationTitle("Todo List")
            .toolbar {
                EditButton()
            }
        }
    }

    func deleteItems(at offsets: IndexSet) {
        items.remove(atOffsets: offsets)
    }
}
```

## Next Steps for Learning SwiftUI

1. **Practice Daily**: Build small projects every day
2. **Apple Tutorials**: Complete Apple's SwiftUI tutorials
3. **Modifier Reference**: Keep a cheat sheet of common modifiers
4. **Build Real Apps**: Start with simple ideas and make them real
5. **Join Communities**: Learn from other SwiftUI developers
