---
title: Desktop Apps
slug: guides/macos/desktop-apps
description: Macos Desktop Apps development
sidebar:
  order: 10
---

## Setting Up Your Development Environment <a name="setting-up"></a>

### Prerequisites

- macOS 11.0 or later
- Xcode 12.0 or later
- Basic knowledge of Swift programming

### Installation

1. Download Xcode from the Mac App Store
2. Launch Xcode and install additional required components
3. Verify installation by creating a new project

## Understanding macOS App Structure <a name="app-structure"></a>

### App Lifecycle (SwiftUI App Protocol)

```swift
import SwiftUI

@main
struct MyMacApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

### Key Components

- **App**: The main app structure using `@main`
- **Scene**: Container for your app's windows
- **WindowGroup**: Manages multiple windows of the same type
- **Views**: The actual UI components

## Core SwiftUI Concepts for macOS <a name="core-concepts"></a>

### Basic Views and Modifiers

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Text("Hello, macOS!")
                .font(.largeTitle)
                .foregroundColor(.primary)

            Button("Click Me") {
                print("Button clicked!")
            }
            .padding()

            Image(systemName: "macwindow")
                .font(.system(size: 50))
        }
        .frame(width: 400, height: 300)
    }
}
```

### Layout Systems

```swift
struct LayoutExample: View {
    var body: some View {
        HSplitView {
            // Left sidebar
            VStack {
                Text("Sidebar")
                    .font(.headline)
                List(1...10, id: \.self) { item in
                    Text("Item \(item)")
                }
            }
            .frame(minWidth: 200)

            // Main content
            VStack {
                Text("Main Content")
                    .font(.title)
                Spacer()
            }
            .frame(minWidth: 400)
        }
    }
}
```

## Building Your First macOS App <a name="first-app"></a>

### Simple Note-Taking App

```swift
import SwiftUI

@main
struct NotesApp: App {
    var body: some Scene {
        WindowGroup {
            NotesListView()
        }
        .commands {
            SidebarCommands()
            ToolbarCommands()
        }
    }
}

struct Note: Identifiable {
    let id = UUID()
    var title: String
    var content: String
    var date = Date()
}

struct NotesListView: View {
    @State private var notes: [Note] = []
    @State private var selectedNote: Note?
    @State private var showingAddSheet = false

    var body: some View {
        NavigationView {
            // Sidebar
            List(selection: $selectedNote) {
                ForEach(notes) { note in
                    NavigationLink(destination: NoteDetailView(note: binding(for: note))) {
                        VStack(alignment: .leading) {
                            Text(note.title)
                                .font(.headline)
                            Text(note.date, style: .date)
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }
                }
            }
            .listStyle(SidebarListStyle())
            .frame(minWidth: 200)

            // Detail view
            if let note = selectedNote {
                NoteDetailView(note: binding(for: note))
            } else {
                Text("Select a note or create a new one")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .toolbar {
            ToolbarItem(placement: .navigation) {
                Button(action: toggleSidebar) {
                    Image(systemName: "sidebar.left")
                }
            }

            ToolbarItem {
                Button("Add Note") {
                    showingAddSheet = true
                }
            }
        }
        .sheet(isPresented: $showingAddSheet) {
            AddNoteView(notes: $notes)
        }
    }

    private func binding(for note: Note) -> Binding<Note> {
        guard let index = notes.firstIndex(where: { $0.id == note.id }) else {
            fatalError("Note not found")
        }
        return $notes[index]
    }

    private func toggleSidebar() {
        NSApp.keyWindow?.firstResponder?
            .tryToPerform(#selector(NSSplitViewController.toggleSidebar(_:)), with: nil)
    }
}

struct NoteDetailView: View {
    @Binding var note: Note

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            TextField("Title", text: $note.title)
                .font(.largeTitle)
                .textFieldStyle(PlainTextFieldStyle())

            Divider()

            TextEditor(text: $note.content)
                .font(.body)
        }
        .padding()
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

struct AddNoteView: View {
    @Environment(\.presentationMode) var presentationMode
    @Binding var notes: [Note]
    @State private var title = ""
    @State private var content = ""

    var body: some View {
        VStack(spacing: 20) {
            Text("New Note")
                .font(.headline)

            TextField("Title", text: $title)
                .textFieldStyle(RoundedBorderTextFieldStyle())

            TextEditor(text: $content)
                .border(Color.gray, width: 1)
                .frame(height: 200)

            HStack {
                Button("Cancel") {
                    presentationMode.wrappedValue.dismiss()
                }

                Button("Save") {
                    let newNote = Note(title: title, content: content)
                    notes.append(newNote)
                    presentationMode.wrappedValue.dismiss()
                }
                .disabled(title.isEmpty)
            }
        }
        .padding()
        .frame(width: 400, height: 300)
    }
}
```

## Advanced macOS-Specific Components <a name="advanced-components"></a>

### Toolbars and Customization

```swift
struct ToolbarExample: View {
    @State private var searchText = ""

    var body: some View {
        NavigationView {
            List(1...20, id: \.self) { item in
                Text("Item \(item)")
            }
            .listStyle(SidebarListStyle())

            Text("Content")
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
        .toolbar {
            // Search field in toolbar
            ToolbarItem(placement: .automatic) {
                SearchField(text: $searchText)
                    .frame(width: 200)
            }

            // Custom buttons
            ToolbarItemGroup(placement: .primaryAction) {
                Button(action: {}) {
                    Image(systemName: "plus")
                }

                Button(action: {}) {
                    Image(systemName: "trash")
                }
            }
        }
    }
}

struct SearchField: NSViewRepresentable {
    @Binding var text: String

    func makeNSView(context: Context) -> NSSearchField {
        let searchField = NSSearchField()
        searchField.delegate = context.coordinator
        return searchField
    }

    func updateNSView(_ nsView: NSSearchField, context: Context) {
        nsView.stringValue = text
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, NSSearchFieldDelegate {
        let parent: SearchField

        init(_ parent: SearchField) {
            self.parent = parent
        }

        func controlTextDidChange(_ notification: Notification) {
            if let searchField = notification.object as? NSSearchField {
                parent.text = searchField.stringValue
            }
        }
    }
}
```

### Split Views and Layout

```swift
struct AdvancedLayout: View {
    @State private var selectedCategory: String?
    @State private var selectedItem: String?

    var body: some View {
        HSplitView {
            // Categories sidebar
            List(["Work", "Personal", "Archived"], id: \.self, selection: $selectedCategory) { category in
                Text(category)
            }
            .listStyle(SidebarListStyle())
            .frame(minWidth: 150, maxWidth: 200)

            // Items list
            List(["Item 1", "Item 2", "Item 3"], id: \.self, selection: $selectedItem) { item in
                Text(item)
            }
            .frame(minWidth: 200, maxWidth: 300)

            // Detail view
            VStack {
                if let item = selectedItem {
                    Text("Detail for \(item)")
                        .font(.title)
                } else {
                    Text("Select an item")
                }
            }
            .frame(minWidth: 400)
        }
    }
}
```

## Menu Bar and Toolbars <a name="menu-toolbars"></a>

### Custom Menu Commands

```swift
@main
struct MenuExampleApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .commands {
            CommandGroup(after: .newItem) {
                Button("Import...") {
                    // Handle import
                }
                .keyboardShortcut("i", modifiers: [.command, .shift])

                Divider()
            }

            CommandMenu("Custom") {
                Button("Custom Action") {
                    // Handle custom action
                }

                Menu("Submenu") {
                    Button("Option 1") { }
                    Button("Option 2") { }
                }
            }
        }
    }
}
```

### Context Menus

```swift
struct ContextMenuExample: View {
    @State private var items = ["Item 1", "Item 2", "Item 3"]

    var body: some View {
        List(items, id: \.self) { item in
            Text(item)
                .contextMenu {
                    Button("Edit") {
                        editItem(item)
                    }

                    Button("Delete", role: .destructive) {
                        deleteItem(item)
                    }

                    Divider()

                    Menu("More") {
                        Button("Duplicate") { }
                        Button("Archive") { }
                    }
                }
        }
    }

    private func editItem(_ item: String) {
        print("Editing \(item)")
    }

    private func deleteItem(_ item: String) {
        items.removeAll { $0 == item }
    }
}
```

## Document-Based Apps <a name="document-apps"></a>

### Creating a Document-Based App

```swift
import SwiftUI
import UniformTypeIdentifiers

struct TextDocument: FileDocument {
    static var readableContentTypes: [UTType] { [.plainText] }

    var text: String

    init(text: String = "Hello, World!") {
        self.text = text
    }

    init(configuration: ReadConfiguration) throws {
        guard let data = configuration.file.regularFileContents,
              let string = String(data: data, encoding: .utf8)
        else {
            throw CocoaError(.fileReadCorruptFile)
        }
        text = string
    }

    func fileWrapper(configuration: WriteConfiguration) throws -> FileWrapper {
        let data = text.data(using: .utf8)!
        return FileWrapper(regularFileWithContents: data)
    }
}

struct DocumentView: View {
    @Binding var document: TextDocument

    var body: some View {
        TextEditor(text: $document.text)
            .font(.system(.body, design: .monospaced))
            .padding()
    }
}

@main
struct TextEditorApp: App {
    var body: some Scene {
        DocumentGroup(newDocument: TextDocument()) { file in
            DocumentView(document: file.$document)
        }
        .commands {
            CommandGroup(replacing: .saveItem) {
                // Custom save commands if needed
            }
        }
    }
}
```

## Preferences and Settings <a name="preferences"></a>

### App Settings with AppStorage

```swift
struct SettingsView: View {
    @AppStorage("autosaveEnabled") private var autosaveEnabled = true
    @AppStorage("fontSize") private var fontSize = 14.0
    @AppStorage("theme") private var theme = "Light"

    var body: some View {
        Form {
            Toggle("Enable Autosave", isOn: $autosaveEnabled)

            Slider(value: $fontSize, in: 10...24) {
                Text("Font Size: \(Int(fontSize))")
            }

            Picker("Theme", selection: $theme) {
                Text("Light").tag("Light")
                Text("Dark").tag("Dark")
                Text("Auto").tag("Auto")
            }
            .pickerStyle(SegmentedPickerStyle())
        }
        .padding()
        .frame(width: 400, height: 200)
    }
}
```

### Settings Scene

```swift
@main
struct SettingsExampleApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }

        Settings {
            SettingsView()
        }
    }
}
```

## Advanced Topics <a name="advanced-topics"></a>

### Drag and Drop

```swift
struct DragDropExample: View {
    @State private var items = ["Item 1", "Item 2", "Item 3"]

    var body: some View {
        List {
            ForEach(items, id: \.self) { item in
                Text(item)
                    .onDrag {
                        NSItemProvider(object: item as NSString)
                    }
            }
            .onInsert(of: [.text], perform: dropItems)
        }
    }

    private func dropItems(at index: Int, items: [NSItemProvider]) {
        for item in items {
            item.loadObject(ofClass: NSString.self) { droppedString, _ in
                if let string = droppedString as? String {
                    DispatchQueue.main.async {
                        self.items.insert(string, at: index)
                    }
                }
            }
        }
    }
}
```

### Keyboard Shortcuts

```swift
struct ShortcutExample: View {
    @State private var count = 0

    var body: some View {
        VStack {
            Text("Count: \(count)")
                .font(.title)

            Button("Increment") {
                count += 1
            }
            .keyboardShortcut("+", modifiers: .command)

            Button("Decrement") {
                count -= 1
            }
            .keyboardShortcut("-", modifiers: .command)

            Button("Reset") {
                count = 0
            }
            .keyboardShortcut("0", modifiers: [.command, .shift])
        }
        .padding()
        .frame(width: 300, height: 200)
    }
}
```

### Status Bar App

```swift
@main
struct StatusBarApp: App {
    @State private var isMenuVisible = false

    var body: some Scene {
        MenuBarExtra("My App", systemImage: "star.fill") {
            Button("Show Window") {
                isMenuVisible = true
            }

            Divider()

            Button("Quit") {
                NSApplication.shared.terminate(nil)
            }
        }

        WindowGroup("Main Window", id: "main-window") {
            ContentView()
        }
        .windowStyle(.hiddenTitleBar)
    }
}
```

## Best Practices and Tips

### Performance Optimization

- Use `LazyVStack` and `LazyHStack` for large lists
- Implement `Equatable` for custom views to prevent unnecessary redraws
- Use `@StateObject` for owned observables, `@ObservedObject` for injected ones

### Architecture

- Follow MVVM pattern for complex apps
- Use `EnvironmentObject` for app-wide state
- Implement proper error handling

### macOS-Specific Considerations

- Support multiple windows
- Handle dark/light mode
- Respect user's accessibility settings
- Implement proper keyboard navigation
