---
title: SwiftUI State
slug: guides/macos/swift-state
description: SwiftUI State
sidebar:
  order: 4
---

## 1. What is State Management? <a name="what-is-state"></a>

_State management is how your app handles data that changes over time and updates the UI automatically_

### Why State Management Matters:

- **Automatic UI Updates**: When data changes, views update automatically
- **Data Flow Control**: Clear paths for how data moves through your app
- **Single Source of Truth**: One place where data is stored and managed
- **Predictable Behavior**: Consistent updates across your entire app

```swift
import SwiftUI

// Simple example: When count changes, Text view updates automatically
struct CounterView: View {
    @State private var count = 0  // This is state

    var body: some View {
        VStack {
            Text("Count: \(count)")  // Updates when count changes
            Button("Increment") {
                count += 1  // Changing state triggers UI update
            }
        }
    }
}
```

## 2. @State <a name="state"></a>

_Use for simple data that belongs to a single view and shouldn't be shared_

### When to Use @State:

- **Local to one view**
- **Simple value types** (String, Int, Bool, etc.)
- **Private implementation details**
- **Temporary UI state**

```swift
struct StateExample: View {
    // Simple local state - only this view cares about these
    @State private var isOn = false
    @State private var text = ""
    @State private var sliderValue = 0.5
    @State private var selectedColor = 0

    let colors = ["Red", "Green", "Blue"]

    var body: some View {
        VStack(spacing: 20) {
            Toggle("Toggle Switch", isOn: $isOn)
                .padding()

            TextField("Enter text", text: $text)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding()

            Slider(value: $sliderValue, in: 0...1)
                .padding()

            Text("Slider: \(sliderValue, specifier: "%.2f")")

            Picker("Color", selection: $selectedColor) {
                ForEach(0..<colors.count, id: \.self) { index in
                    Text(colors[index])
                }
            }
            .pickerStyle(SegmentedPickerStyle())

            Text("You selected: \(colors[selectedColor])")

            // Derived state - computed from other state
            Text("Status: \(isOn ? "ON" : "OFF")")
                .foregroundColor(isOn ? .green : .red)
        }
        .padding()
    }
}
```

## 3. @Binding <a name="binding"></a>

_Creates a two-way connection between a parent view's state and a child view_

### When to Use @Binding:

- **Child views that need to modify parent's state**
- **Reusable components** that don't own their data
- **Forms and input controls**

```swift
// Child view that receives binding from parent
struct ToggleView: View {
    @Binding var isOn: Bool  // Doesn't own the data, just references it

    var body: some View {
        HStack {
            Text(isOn ? "ON" : "OFF")
                .foregroundColor(isOn ? .green : .red)

            Toggle("", isOn: $isOn)  // Two-way binding
        }
        .padding()
        .background(Color.gray.opacity(0.1))
        .cornerRadius(8)
    }
}

// Parent view that owns the state
struct BindingExample: View {
    @State private var isToggleOn = false
    @State private var volume: Double = 0.5

    var body: some View {
        VStack(spacing: 30) {
            Text("Parent View")
                .font(.title)

            // Pass binding to child view
            ToggleView(isOn: $isToggleOn)

            // Another child with binding
            VolumeSlider(volume: $volume)

            Text("Parent knows: \(isToggleOn ? "ON" : "OFF")")
            Text("Volume: \(volume, specifier: "%.0f")%")
        }
        .padding()
    }
}

// Another reusable component with binding
struct VolumeSlider: View {
    @Binding var volume: Double

    var body: some View {
        VStack {
            Text("Volume Control")
                .font(.headline)

            HStack {
                Image(systemName: "speaker.fill")
                Slider(value: $volume, in: 0...1)
                Image(systemName: "speaker.wave.3.fill")
            }
        }
        .padding()
        .background(Color.blue.opacity(0.1))
        .cornerRadius(8)
    }
}
```

## 4. @StateObject <a name="stateobject"></a>

_Creates and owns a reference type (class) that manages state_

### When to Use @StateObject:

- **Complex data models** that need methods and logic
- **Data that survives view updates**
- **Reference types** (classes) that conform to ObservableObject

```swift
// Data model that manages complex state
class UserSettings: ObservableObject {
    @Published var username: String = "Guest"
    @Published var isLoggedIn: Bool = false
    @Published var theme: String = "Light"

    func login() {
        isLoggedIn = true
        username = "John Doe"
    }

    func logout() {
        isLoggedIn = false
        username = "Guest"
    }

    func toggleTheme() {
        theme = theme == "Light" ? "Dark" : "Light"
    }
}

struct StateObjectExample: View {
    // StateObject creates and OWNS the instance
    @StateObject private var settings = UserSettings()

    var body: some View {
        VStack(spacing: 20) {
            Text("User Settings")
                .font(.title)

            Text("Welcome, \(settings.username)")
                .font(.headline)

            Text("Theme: \(settings.theme)")
                .foregroundColor(settings.theme == "Dark" ? .white : .black)
                .padding()
                .background(settings.theme == "Dark" ? .black : .white)
                .cornerRadius(8)

            HStack(spacing: 20) {
                Button("Login") {
                    settings.login()
                }
                .disabled(settings.isLoggedIn)

                Button("Logout") {
                    settings.logout()
                }
                .disabled(!settings.isLoggedIn)

                Button("Toggle Theme") {
                    settings.toggleTheme()
                }
            }

            Text("Status: \(settings.isLoggedIn ? "Logged In" : "Logged Out")")
                .foregroundColor(settings.isLoggedIn ? .green : .red)
        }
        .padding()
        .background(settings.theme == "Dark" ? .gray.opacity(0.3) : .clear)
    }
}
```

## 5. @ObservedObject <a name="observedobject"></a>

_Observes an external object that's created and managed elsewhere_

### When to Use @ObservedObject:

- **Data passed in from parent view**
- **Shared data models** between multiple views
- **When you don't own the data's lifecycle**

```swift
// Shared data model
class ShoppingCart: ObservableObject {
    @Published var items: [String] = []
    @Published var total: Double = 0.0

    func addItem(_ item: String, price: Double) {
        items.append(item)
        total += price
    }

    func clearCart() {
        items.removeAll()
        total = 0.0
    }
}

// Parent view that OWNS the shopping cart
struct StoreView: View {
    @StateObject private var cart = ShoppingCart()  // Owner

    var body: some View {
        NavigationView {
            VStack {
                ProductList(cart: cart)  // Pass as observed object

                CartSummary(cart: cart)  // Same object, different view
            }
            .navigationTitle("My Store")
        }
    }
}

// Child view that OBSERVES the cart
struct ProductList: View {
    @ObservedObject var cart: ShoppingCart  // Observes, doesn't own

    let products = [
        ("Apple", 1.99),
        ("Banana", 0.99),
        ("Orange", 2.49)
    ]

    var body: some View {
        List {
            ForEach(products, id: \.0) { product, price in
                HStack {
                    Text(product)
                    Spacer()
                    Text("$\(price, specifier: "%.2f")")
                    Button("Add") {
                        cart.addItem(product, price: price)
                    }
                }
            }
        }
    }
}

// Another child view observing the same cart
struct CartSummary: View {
    @ObservedObject var cart: ShoppingCart

    var body: some View {
        VStack {
            Text("Cart Items: \(cart.items.count)")
            Text("Total: $\(cart.total, specifier: "%.2f")")

            Button("Clear Cart") {
                cart.clearCart()
            }
            .disabled(cart.items.isEmpty)
        }
        .padding()
        .background(Color.gray.opacity(0.1))
        .cornerRadius(8)
        .padding()
    }
}
```

## 6. @EnvironmentObject <a name="environmentobject"></a>

_Accesses shared data from anywhere in the view hierarchy without passing it down_

### When to Use @EnvironmentObject:

- **App-wide global state** (user auth, app settings, etc.)
- **Deep view hierarchies** where passing data through many layers is cumbersome
- **Data needed by many unrelated views**

```swift
// Global app state
class AppState: ObservableObject {
    @Published var currentUser: String? = nil
    @Published var isDarkMode: Bool = false
    @Published var appVersion: String = "1.0.0"

    var isLoggedIn: Bool {
        currentUser != nil
    }
}

struct EnvironmentObjectExample: View {
    @StateObject private var appState = AppState()

    var body: some View {
        // Inject into environment - available to all child views
        MainView()
            .environmentObject(appState)
            .preferredColorScheme(appState.isDarkMode ? .dark : .light)
    }
}

struct MainView: View {
    var body: some View {
        TabView {
            ProfileView()
                .tabItem {
                    Image(systemName: "person")
                    Text("Profile")
                }

            SettingsView()
                .tabItem {
                    Image(systemName: "gear")
                    Text("Settings")
                }
        }
    }
}

// Any view can access the environment object without receiving it as parameter
struct ProfileView: View {
    @EnvironmentObject var appState: AppState  // Access from environment

    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                if appState.isLoggedIn {
                    Text("Welcome, \(appState.currentUser!)!")
                        .font(.title)

                    Button("Logout") {
                        appState.currentUser = nil
                    }
                } else {
                    Text("Please log in")
                        .font(.title)

                    Button("Login") {
                        appState.currentUser = "John Doe"
                    }
                }

                Text("App Version: \(appState.appVersion)")
                    .foregroundColor(.secondary)
            }
            .navigationTitle("Profile")
        }
    }
}

// Another view accessing the same environment object
struct SettingsView: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        NavigationView {
            Form {
                Section("Appearance") {
                    Toggle("Dark Mode", isOn: $appState.isDarkMode)
                }

                Section("Account") {
                    Text("User: \(appState.currentUser ?? "Not logged in")")
                }
            }
            .navigationTitle("Settings")
        }
    }
}
```

## 7. @Environment <a name="environment"></a>

_Accesses system-defined values like color scheme, size classes, locale, etc._

### When to Use @Environment:

- **Adapting to system settings**
- **Responding to device characteristics**
- **Accessing system-provided values**

```swift
struct EnvironmentExample: View {
    // Access system environment values
    @Environment(\.colorScheme) var colorScheme
    @Environment(\.horizontalSizeClass) var horizontalSizeClass
    @Environment(\.verticalSizeClass) var verticalSizeClass
    @Environment(\.locale) var locale
    @Environment(\.calendar) var calendar

    var body: some View {
        VStack(spacing: 20) {
            Text("Environment Values")
                .font(.title)

            // Adapt to color scheme
            Text("Color Scheme")
                .padding()
                .background(colorScheme == .dark ? .black : .white)
                .foregroundColor(colorScheme == .dark ? .white : .black)
                .cornerRadius(8)

            // Adapt to size class
            if horizontalSizeClass == .compact {
                VStack {
                    Text("Compact Width")
                    Text("Good for phones")
                }
            } else {
                HStack {
                    Text("Regular Width")
                    Text("Good for tablets")
                }
            }

            // System information
            Text("Locale: \(locale.identifier)")
            Text("Calendar: \(calendar.identifier.description)")

            // Custom environment values
            CustomTextView()
        }
        .padding()
    }
}

// Custom environment key
struct CustomTextColor: EnvironmentKey {
    static let defaultValue: Color = .primary
}

extension EnvironmentValues {
    var customTextColor: Color {
        get { self[CustomTextColor.self] }
        set { self[CustomTextColor.self] = newValue }
    }
}

struct CustomTextView: View {
    @Environment(\.customTextColor) var textColor

    var body: some View {
        Text("Custom Environment Text")
            .foregroundColor(textColor)
    }
}
```

## 8. @AppStorage <a name="appstorage"></a>

_Automatically saves and loads values from UserDefaults_

### When to Use @AppStorage:

- **User preferences and settings**
- **Simple persistent data**
- **Data that should survive app restarts**

```swift
struct AppStorageExample: View {
    // Automatically persists in UserDefaults
    @AppStorage("username") var username: String = "Guest"
    @AppStorage("isOnboardingCompleted") var isOnboardingCompleted: Bool = false
    @AppStorage("volume") var volume: Double = 0.5
    @AppStorage("theme") var theme: String = "Light"
    @AppStorage("loginCount") var loginCount: Int = 0

    var body: some View {
        VStack(spacing: 20) {
            Text("App Storage Demo")
                .font(.title)

            Text("Welcome, \(username)")
                .font(.headline)

            TextField("Username", text: $username)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding()

            Toggle("Onboarding Completed", isOn: $isOnboardingCompleted)
                .padding()

            Slider(value: $volume, in: 0...1)
                .padding()
            Text("Volume: \(volume, specifier: "%.0f")%")

            Picker("Theme", selection: $theme) {
                Text("Light").tag("Light")
                Text("Dark").tag("Dark")
                Text("Auto").tag("Auto")
            }
            .pickerStyle(SegmentedPickerStyle())
            .padding()

            HStack {
                Text("Login Count: \(loginCount)")
                Button("Increment") {
                    loginCount += 1
                }
            }

            Button("Reset All") {
                username = "Guest"
                isOnboardingCompleted = false
                volume = 0.5
                theme = "Light"
                loginCount = 0
            }
            .foregroundColor(.red)
        }
        .padding()
    }
}
```

## 9. Best Practices <a name="best-practices"></a>

### Choosing the Right Tool:

| Use Case                   | Property Wrapper     | Example                                    |
| -------------------------- | -------------------- | ------------------------------------------ |
| **Local view state**       | `@State`             | `@State private var isExpanded = false`    |
| **Child modifying parent** | `@Binding`           | `Toggle(isOn: $isOn)`                      |
| **Complex owned data**     | `@StateObject`       | `@StateObject var dataModel = DataModel()` |
| **External shared data**   | `@ObservedObject`    | `@ObservedObject var user: User`           |
| **Global app state**       | `@EnvironmentObject` | `@EnvironmentObject var appState`          |
| **System settings**        | `@Environment`       | `@Environment(\.colorScheme)`              |
| **User preferences**       | `@AppStorage`        | `@AppStorage("theme") var theme`           |

### Golden Rules:

```swift
struct BestPractices: View {
    // ✅ GOOD: Simple local state
    @State private var isAnimating = false

    // ✅ GOOD: Own complex data
    @StateObject private var dataManager = DataManager()

    // ❌ AVOID: Using StateObject for simple values
    // @StateObject private var counter = Counter() // Overkill

    var body: some View {
        VStack {
            // ✅ GOOD: Pass binding to child
            CustomToggle(isOn: $isAnimating)

            // ✅ GOOD: Use observed object for shared data
            DataView(dataManager: dataManager)
        }
    }
}

// Keep state as close as possible to where it's used
struct CustomToggle: View {
    @Binding var isOn: Bool  // ✅ Doesn't own the data

    var body: some View {
        Toggle("", isOn: $isOn)
    }
}

// Use ObservableObject for complex logic
class DataManager: ObservableObject {
    @Published var items: [String] = []

    func complexOperation() {
        // Business logic here
    }
}

struct DataView: View {
    @ObservedObject var dataManager: DataManager  // ✅ Observes external data

    var body: some View {
        List(dataManager.items, id: \.self) { item in
            Text(item)
        }
    }
}
```

### Key Takeaways:

1. **Start with @State** for simple local needs
2. **Use @Binding** for child components
3. **Choose @StateObject** when you own complex data
4. **Use @ObservedObject** for data passed from parent
5. **@EnvironmentObject** for truly global state
6. **@AppStorage** for user preferences
7. **Keep state as local as possible**
8. **Single source of truth** for each piece of data
