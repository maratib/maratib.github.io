---
title: SwiftUI App
slug: guides/macos/swift-app
description: SwiftUI App
sidebar:
  order: 5
---

Simple SwiftUI Markdown Viewer

## File Structure:

```
MarkdownViewer/
├── AppMain.swift          // Main app file
├── MarkdownContentView.swift // UI with load/clear functions
└── MarkdownData.swift     // Data model & controller
```

## 1. AppMain.swift

```swift
import SwiftUI

@main
struct MarkdownViewerApp: App {
    var body: some Scene {
        WindowGroup {
            MarkdownContentView()
        }
    }
}
```

## 2. MarkdownData.swift

````swift
import Foundation

// MARK: - Data Model
struct MarkdownTemplate {
    let title: String
    let content: String
}

// MARK: - Data Storage
struct MarkdownData {
    static let templates: [MarkdownTemplate] = [
        MarkdownTemplate(
            title: "Welcome Guide",
            content: """
            # Welcome to Markdown Viewer 🚀

            ## Features
            - **Beautiful** Markdown rendering
            - *Italic* and **bold** text support
            - Code blocks with syntax
            - Easy to use

            ```swift
            func helloWorld() {
                print("Hello, Markdown!")
            }
            ```

            > Start creating amazing content!
            """
        ),

        MarkdownTemplate(
            title: "Meeting Notes",
            content: """
            # Team Meeting 🗓️

            ## Date: \(Date().formatted(date: .abbreviated, time: .omitted))

            ### Attendees
            - John Doe
            - Jane Smith
            - Mike Johnson

            ### Agenda
            1. Project updates
            2. Technical discussions
            3. Action items

            ## Decisions
            > We decided to use SwiftUI for the new project.

            **Next meeting:** Next Monday
            """
        ),

        MarkdownTemplate(
            title: "API Documentation",
            content: """
            # API Reference 📚

            ## `UserController`
            Handles user management operations.

            **Methods:**
            - `getUser(id:)` - Fetch user by ID
            - `createUser(_:)` - Create new user
            - `updateUser(_:)` - Update user data

            ## Example Usage
            ```swift
            let controller = UserController()
            let user = try await controller.getUser(id: "123")
            ```

            ## Notes
            > All API calls require authentication.
            """
        )
    ]
}

// MARK: - Controller
class MarkdownController: ObservableObject {
    @Published var currentContent: String = ""
    @Published var isLoading: Bool = false

    // Function to load markdown - exposed to ContentView
    func loadMarkdown(template: MarkdownTemplate) {
        isLoading = true

        // Simulate loading delay for better UX
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            self.currentContent = template.content
            self.isLoading = false
        }
    }

    // Function to clear screen - exposed to ContentView
    func clearScreen() {
        currentContent = ""
    }

    // Load specific template by index
    func loadTemplate(at index: Int) {
        guard index >= 0 && index < MarkdownData.templates.count else { return }
        loadMarkdown(template: MarkdownData.templates[index])
    }

    // Load raw markdown string
    func loadRawMarkdown(_ content: String) {
        currentContent = content
    }
}
````

## 3. MarkdownContentView.swift

```swift
import SwiftUI
import MarkdownUI

struct MarkdownContentView: View {
    @StateObject private var controller = MarkdownController()

    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Header with buttons
                headerView

                Divider()

                // Content area
                contentView
            }
            .navigationTitle("Markdown Viewer")
        }
    }

    // MARK: - Header with Load/Clear buttons
    private var headerView: some View {
        VStack(spacing: 16) {
            Text("Markdown Templates")
                .font(.headline)
                .foregroundColor(.secondary)

            HStack(spacing: 12) {
                // Load Template 1
                Button("Load Welcome") {
                    loadMarkdown(template: MarkdownData.templates[0])
                }
                .buttonStyle(TemplateButtonStyle())

                // Load Template 2
                Button("Load Meeting") {
                    loadMarkdown(template: MarkdownData.templates[1])
                }
                .buttonStyle(TemplateButtonStyle())

                // Load Template 3
                Button("Load API Docs") {
                    loadMarkdown(template: MarkdownData.templates[2])
                }
                .buttonStyle(TemplateButtonStyle())
            }

            // Clear button
            Button("Clear Screen", role: .destructive) {
                clearScreen()
            }
            .buttonStyle(ClearButtonStyle())
        }
        .padding()
    }

    // MARK: - Content Display Area
    private var contentView: some View {
        Group {
            if controller.isLoading {
                ProgressView("Loading Markdown...")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else if controller.currentContent.isEmpty {
                emptyStateView
            } else {
                markdownContentView
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Empty State
    private var emptyStateView: some View {
        VStack(spacing: 20) {
            Image(systemName: "doc.text")
                .font(.system(size: 50))
                .foregroundColor(.secondary)

            Text("No Content Loaded")
                .font(.title2)
                .foregroundColor(.secondary)

            Text("Tap a template button above to load markdown content")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Markdown Content
    private var markdownContentView: some View {
        ScrollView {
            Markdown(controller.currentContent)
                .markdownTheme(.docC)
                .padding()
        }
        .background(Color(.systemBackground))
    }

    // MARK: - Exposed Functions for ContentView

    /// Load markdown content from template
    func loadMarkdown(template: MarkdownTemplate) {
        controller.loadMarkdown(template: template)
    }

    /// Load markdown by template index
    func loadMarkdown(at index: Int) {
        controller.loadTemplate(at: index)
    }

    /// Load raw markdown string
    func loadRawMarkdown(_ content: String) {
        controller.loadRawMarkdown(content)
    }

    /// Clear the current markdown content
    func clearScreen() {
        controller.clearScreen()
    }
}

// MARK: - Button Styles
struct TemplateButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.subheadline)
            .fontWeight(.medium)
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(8)
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
    }
}

struct ClearButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.subheadline)
            .fontWeight(.medium)
            .padding(.horizontal, 20)
            .padding(.vertical, 8)
            .background(Color.red)
            .foregroundColor(.white)
            .cornerRadius(8)
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
    }
}

// MARK: - Preview
struct MarkdownContentView_Previews: PreviewProvider {
    static var previews: some View {
        MarkdownContentView()
    }
}
```

## Usage Example:

```swift
// How to use the exposed functions:

let contentView = MarkdownContentView()

// Load a template by index
contentView.loadMarkdown(at: 0)

// Load specific template
let template = MarkdownData.templates[1]
contentView.loadMarkdown(template: template)

// Load custom markdown
contentView.loadRawMarkdown("# Custom Title\\nSome **bold** text")

// Clear the screen
contentView.clearScreen()
```

## Key Features:

### 🎯 **Clean Separation:**

- **AppMain**: Only app initialization
- **MarkdownData**: Pure data models & controller logic
- **MarkdownContentView**: Only UI with exposed functions

### 🔧 **Exposed Functions:**

- `loadMarkdown(template:)` - Load from template
- `loadMarkdown(at:)` - Load by index
- `loadRawMarkdown(_:)` - Load custom content
- `clearScreen()` - Clear content

### 🚀 **Simple Usage:**

1. Add MarkdownUI package
2. Copy these 3 files
3. Build and run
4. Use the exposed functions to control content
