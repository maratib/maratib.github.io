---
title: SwiftUI iOS
slug: guides/macos/swift-ios
description: SwiftUI iOS
sidebar:
  order: 6
---

1. [SwiftUI Fundamentals](#fundamentals) - _Core concepts and syntax_
2. [Project Structure](#project-structure) - _Folder organization for small apps_
3. [Scalable Architecture](#scalable-architecture) - _Folder structure for large apps_
4. [State Management](#state-management) - _Data flow and state handling_
5. [Navigation](#navigation) - _Moving between screens_
6. [Animations](#animations) - _Adding motion and transitions_
7. [Best Practices](#best-practices) - _Production-ready patterns_

---

## 1. SwiftUI Fundamentals <a name="fundamentals"></a>

_Understanding the basic building blocks of SwiftUI_

### Views - The Basic Building Blocks

```swift
import SwiftUI

// All UI components are Views
struct ContentView: View {
    var body: some View {
        VStack {  // Vertical stack
            Text("Hello, SwiftUI!")  // Text view
                .font(.title)        // Modifier
                .foregroundColor(.blue)

            Image(systemName: "star.fill")  // SF Symbols
                .font(.largeTitle)
                .foregroundColor(.yellow)

            Button("Tap Me") {       // Button with action
                print("Button tapped!")
            }
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(8)
        }
    }
}
```

### Modifiers - Customizing Views

```swift
struct ModifiersView: View {
    var body: some View {
        VStack(spacing: 20) {
            Text("Styled Text")
                .font(.largeTitle)           // Font
                .foregroundColor(.primary)   // Color
                .padding()                   // Spacing
                .background(Color.blue)      // Background
                .cornerRadius(10)            // Rounded corners
                .shadow(radius: 5)           // Shadow

            Rectangle()
                .fill(Color.red)             // Fill color
                .frame(width: 100, height: 100) // Size
                .overlay(                    // Overlay content
                    Text("Overlay")
                        .foregroundColor(.white)
                )
        }
    }
}
```

### Stacks - Layout Containers

```swift
struct StacksView: View {
    var body: some View {
        VStack {  // Vertical
            HStack {  // Horizontal
                Text("Left")
                Spacer()  // Pushes views apart
                Text("Right")
            }
            .padding()

            ZStack {  // Overlapping
                Circle()
                    .fill(Color.blue)
                    .frame(width: 100, height: 100)

                Text("Center")
                    .foregroundColor(.white)
            }
        }
    }
}
```

---

## 2. Project Structure <a name="project-structure"></a>

_Organizing small to medium-sized apps_

### Basic Folder Structure

```
MyApp/
├── Models/           # Data models
│   ├── User.swift
│   └── Product.swift
├── Views/            # SwiftUI views
│   ├── ContentView.swift
│   ├── ProfileView.swift
│   └── Components/   # Reusable components
├── ViewModels/       # Business logic
│   ├── UserViewModel.swift
│   └── ProductViewModel.swift
├── Services/         # API calls, database
│   └── APIService.swift
└── Utilities/        # Helpers, extensions
    └── Extensions.swift
```

### Example File Structure

**Models/User.swift**

```swift
struct User: Identifiable, Codable {
    let id: String
    var name: String
    var email: String
    var isVerified: Bool = false
}
```

**Views/ContentView.swift**

```swift
struct ContentView: View {
    @StateObject private var viewModel = ContentViewModel()

    var body: some View {
        NavigationView {
            List(viewModel.users) { user in
                UserRow(user: user)
            }
            .navigationTitle("Users")
        }
    }
}

// Reusable component
struct UserRow: View {
    let user: User

    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text(user.name)
                    .font(.headline)
                Text(user.email)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            Spacer()
            Image(systemName: user.isVerified ? "checkmark.circle.fill" : "circle")
                .foregroundColor(user.isVerified ? .green : .gray)
        }
    }
}
```

**ViewModels/ContentViewModel.swift**

```swift
class ContentViewModel: ObservableObject {
    @Published var users: [User] = []
    private let service = APIService()

    @MainActor
    func loadUsers() async {
        do {
            users = try await service.fetchUsers()
        } catch {
            print("Error loading users: \(error)")
        }
    }
}
```

---

## 3. Scalable Architecture <a name="scalable-architecture"></a>

_Folder structure for large, maintainable apps_

### Feature-Based Structure (Recommended)

```
MyLargeApp/
├── App/                          # App-level setup
│   ├── AppMain.swift
│   ├── AppDelegate.swift
│   └── AppConfiguration.swift
├── Features/                     # Feature modules
│   ├── Authentication/
│   │   ├── Models/
│   │   ├── Views/
│   │   ├── ViewModels/
│   │   └── Services/
│   ├── Dashboard/
│   │   ├── Models/
│   │   ├── Views/
│   │   └── ViewModels/
│   └── Profile/
│       ├── Models/
│       ├── Views/
│       └── ViewModels/
├── Core/                         # Shared components
│   ├── Networking/
│   ├── Database/
│   ├── UIComponents/
│   └── Utilities/
├── Shared/                       # Cross-feature models
│   ├── Models/
│   └── Services/
└── Resources/
    ├── Assets.xcassets
    └── Info.plist
```

### Feature Module Example

**Features/Authentication/Models/LoginModel.swift**

```swift
struct LoginCredentials {
    var email: String = ""
    var password: String = ""
}

enum LoginError: Error {
    case invalidCredentials
    case networkError
}
```

**Features/Authentication/Views/LoginView.swift**

```swift
struct LoginView: View {
    @StateObject private var viewModel = LoginViewModel()

    var body: some View {
        VStack(spacing: 20) {
            TextField("Email", text: $viewModel.credentials.email)
                .textFieldStyle(RoundedBorderTextFieldStyle())

            SecureField("Password", text: $viewModel.credentials.password)
                .textFieldStyle(RoundedBorderTextFieldStyle())

            Button("Login") {
                Task {
                    await viewModel.login()
                }
            }
            .disabled(!viewModel.isFormValid)
        }
        .padding()
    }
}
```

**Features/Authentication/ViewModels/LoginViewModel.swift**

```swift
@MainActor
class LoginViewModel: ObservableObject {
    @Published var credentials = LoginCredentials()
    @Published var isLoading = false
    @Published var error: LoginError?

    var isFormValid: Bool {
        !credentials.email.isEmpty &&
        !credentials.password.isEmpty
    }

    func login() async {
        isLoading = true
        defer { isLoading = false }

        // Authentication logic here
    }
}
```

### Core UI Components

**Core/UIComponents/PrimaryButton.swift**

```swift
struct PrimaryButton: View {
    let title: String
    let action: () -> Void
    var isEnabled: Bool = true

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.headline)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding()
                .background(isEnabled ? Color.blue : Color.gray)
                .cornerRadius(8)
        }
        .disabled(!isEnabled)
    }
}
```

---

## 4. State Management <a name="state-management"></a>

_Handling data flow in SwiftUI apps_

### @State - Local View State

```swift
struct StateExample: View {
    @State private var count = 0
    @State private var isOn = false
    @State private var text = ""

    var body: some View {
        VStack {
            Text("Count: \(count)")
            Toggle("Toggle", isOn: $isOn)
            TextField("Text", text: $text)

            Button("Increment") {
                count += 1
            }
        }
    }
}
```

### @StateObject & @ObservedObject - Complex State

```swift
class CounterViewModel: ObservableObject {
    @Published var count = 0
    @Published var history: [Int] = []

    func increment() {
        count += 1
        history.append(count)
    }
}

struct CounterView: View {
    @StateObject private var viewModel = CounterViewModel() // Owner

    var body: some View {
        VStack {
            Text("Count: \(viewModel.count)")
            Button("Increment") {
                viewModel.increment()
            }

            HistoryView(viewModel: viewModel) // Pass as observed
        }
    }
}

struct HistoryView: View {
    @ObservedObject var viewModel: CounterViewModel // Observer

    var body: some View {
        List(viewModel.history, id: \.self) { item in
            Text("\(item)")
        }
    }
}
```

### @EnvironmentObject - App-Wide State

```swift
class AppState: ObservableObject {
    @Published var currentUser: User?
    @Published var isLoggedIn: Bool = false
}

struct AppMain: View {
    @StateObject private var appState = AppState()

    var body: some View {
        MainView()
            .environmentObject(appState) // Inject into environment
    }
}

struct MainView: View {
    @EnvironmentObject var appState: AppState // Access anywhere

    var body: some View {
        if appState.isLoggedIn {
            DashboardView()
        } else {
            LoginView()
        }
    }
}
```

---

## 5. Navigation <a name="navigation"></a>

_Moving between screens in SwiftUI_

### Basic Navigation

```swift
struct NavigationExample: View {
    var body: some View {
        NavigationView {
            List {
                NavigationLink("Go to Details") {
                    DetailView()
                }

                NavigationLink("Go to Settings") {
                    SettingsView()
                }
            }
            .navigationTitle("Home")
        }
    }
}

struct DetailView: View {
    var body: some View {
        Text("Detail Screen")
            .navigationTitle("Details")
    }
}
```

### Programmatic Navigation

```swift
struct ProgrammaticNavigation: View {
    @State private var isShowingDetail = false
    @State private var selectedItem: String?

    var body: some View {
        NavigationView {
            VStack {
                Button("Show Detail") {
                    isShowingDetail = true
                }

                List(["Item 1", "Item 2", "Item 3"], id: \.self) { item in
                    NavigationLink(
                        destination: DetailView(item: item),
                        tag: item,
                        selection: $selectedItem
                    ) {
                        Text(item)
                    }
                }
            }
            .navigationTitle("Programmatic Nav")
            .sheet(isPresented: $isShowingDetail) {
                DetailView(item: "From Sheet")
            }
        }
    }
}
```

### Tab-Based Navigation

```swift
struct TabNavigation: View {
    var body: some View {
        TabView {
            HomeView()
                .tabItem {
                    Image(systemName: "house")
                    Text("Home")
                }

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
```

---

## 6. Animations <a name="animations"></a>

_Adding motion and transitions to your app_

### Implicit Animations

```swift
struct ImplicitAnimation: View {
    @State private var isScaled = false

    var body: some View {
        VStack {
            Circle()
                .fill(Color.blue)
                .frame(width: 100, height: 100)
                .scaleEffect(isScaled ? 1.5 : 1.0)
                .animation(.easeInOut(duration: 0.5), value: isScaled)

            Button("Animate") {
                isScaled.toggle()
            }
        }
    }
}
```

### Explicit Animations

```swift
struct ExplicitAnimation: View {
    @State private var rotation = 0.0

    var body: some View {
        VStack {
            Rectangle()
                .fill(Color.red)
                .frame(width: 100, height: 100)
                .rotationEffect(.degrees(rotation))

            Button("Rotate") {
                withAnimation(.spring(response: 0.6, dampingFraction: 0.8)) {
                    rotation += 360
                }
            }
        }
    }
}
```

### Transitions

```swift
struct TransitionExample: View {
    @State private var isShowing = false

    var body: some View {
        VStack {
            Button("Toggle") {
                withAnimation {
                    isShowing.toggle()
                }
            }

            if isShowing {
                RoundedRectangle(cornerRadius: 25)
                    .fill(Color.blue)
                    .frame(height: 200)
                    .transition(.asymmetric(
                        insertion: .scale.combined(with: .opacity),
                        removal: .slide
                    ))
            }
        }
    }
}
```

### Advanced Animation

```swift
struct AdvancedAnimation: View {
    @State private var progress: CGFloat = 0.0

    var body: some View {
        VStack {
            ZStack {
                Circle()
                    .stroke(Color.gray.opacity(0.3), lineWidth: 10)

                Circle()
                    .trim(from: 0, to: progress)
                    .stroke(Color.blue, lineWidth: 10)
                    .rotationEffect(.degrees(-90))
                    .animation(.easeInOut(duration: 1.0), value: progress)
            }
            .frame(width: 100, height: 100)

            Slider(value: $progress, in: 0...1)
                .padding()
        }
    }
}
```

---

## 7. Best Practices <a name="best-practices"></a>

_Production-ready patterns and tips_

### MVVM Architecture

```swift
// Model
struct Product: Identifiable {
    let id = UUID()
    let name: String
    let price: Double
}

// ViewModel
@MainActor
class ProductsViewModel: ObservableObject {
    @Published var products: [Product] = []
    @Published var isLoading = false

    private let service: ProductService

    init(service: ProductService = ProductService()) {
        self.service = service
    }

    func loadProducts() async {
        isLoading = true
        defer { isLoading = false }

        do {
            products = try await service.fetchProducts()
        } catch {
            print("Error: \(error)")
        }
    }
}

// View
struct ProductsView: View {
    @StateObject private var viewModel = ProductsViewModel()

    var body: some View {
        NavigationView {
            Group {
                if viewModel.isLoading {
                    ProgressView()
                } else {
                    List(viewModel.products) { product in
                        ProductRow(product: product)
                    }
                }
            }
            .navigationTitle("Products")
            .task {
                await viewModel.loadProducts()
            }
        }
    }
}
```

### Dependency Injection

```swift
protocol DataService {
    func fetchData() async throws -> [String]
}

class ProductionService: DataService {
    func fetchData() async throws -> [String] {
        // Real implementation
        return ["Item 1", "Item 2"]
    }
}

class MockService: DataService {
    func fetchData() async throws -> [String] {
        return ["Mock Item 1", "Mock Item 2"]
    }
}

class MyViewModel: ObservableObject {
    @Published var items: [String] = []
    private let service: DataService

    init(service: DataService = ProductionService()) {
        self.service = service
    }

    func loadData() async {
        items = try! await service.fetchData()
    }
}
```

### Error Handling

```swift
enum AppError: LocalizedError {
    case networkError
    case decodingError
    case unknownError

    var errorDescription: String? {
        switch self {
        case .networkError: return "Network connection failed"
        case .decodingError: return "Failed to decode data"
        case .unknownError: return "An unknown error occurred"
        }
    }
}

struct ErrorHandlingView: View {
    @State private var error: AppError?

    var body: some View {
        VStack {
            Button("Simulate Error") {
                error = .networkError
            }
        }
        .alert("Error", isPresented: .constant(error != nil)) {
            Button("OK") {
                error = nil
            }
        } message: {
            Text(error?.errorDescription ?? "")
        }
    }
}
```

### Performance Optimization

```swift
// Use Equatable for expensive views
struct ExpensiveView: View, Equatable {
    let data: [String]

    var body: some View {
        List(data, id: \.self) { item in
            Text(item)
        }
    }

    static func == (lhs: ExpensiveView, rhs: ExpensiveView) -> Bool {
        lhs.data == rhs.data
    }
}

// Lazy loading for large lists
struct LazyLoadingView: View {
    let items = Array(1...1000)

    var body: some View {
        ScrollView {
            LazyVStack {  // Only renders visible items
                ForEach(items, id: \.self) { item in
                    Text("Item \(item)")
                        .padding()
                        .onAppear {
                            print("Item \(item) appeared")
                        }
                }
            }
        }
    }
}
```
