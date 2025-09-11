---
title: Flutter Basics
slug: guides/flutter/flutter-basics
description: Flutter Basics
sidebar:
  order: 2
---

## Project Structure

Standard Flutter project organization for maintainability.

```
lib/
├── main.dart              # App entry point
├── models/               # Data models/classes
├── widgets/              # Reusable widgets
├── screens/              # Full page widgets
├── services/             # API services, database
├── utils/                # Helper functions, constants
├── providers/            # State management providers
└── themes/               # App themes, styling
```

## Widgets

### Stateless Widget

Widget that doesn't require mutable state.

```dart
class MyWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

### Stateful Widget

Widget that maintains mutable state.

```dart
class MyWidget extends StatefulWidget {
  @override
  _MyWidgetState createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

### Basic Widgets

Commonly used built-in widgets.

```dart
Container()          # Box with decoration, padding, margins
Column()             # Vertical layout of children
Row()                # Horizontal layout of children
Stack()              # Overlapping children layout
ListView()           # Scrollable list
GridView()           # Scrollable grid
Text()               # Display text
Image()              # Display images
Icon()               # Display icons
Button()             # Various button types
TextField()          # Text input
```

## State Management

### setState (Local State)

Simple state management for local widget state.

```dart
int _counter = 0;

void _incrementCounter() {
  setState(() {
    _counter++;
  });
}
```

### Provider (Recommended)

Simple yet powerful state management solution.

```dart
// Provider setup
ChangeNotifierProvider(create: (_) => MyModel()),

// Consumer usage
Consumer<MyModel>(
  builder: (context, model, child) => Text(model.value),
)

// Provider.of usage
var model = Provider.of<MyModel>(context);
```

### Riverpod (Provider 2.0)

Improved provider pattern with compile-time safety.

```dart
final counterProvider = StateProvider<int>((ref) => 0);

class MyWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);
    return Text('$count');
  }
}
```

## Navigation

### Basic Navigation

Navigate between screens.

```dart
// Push new screen
Navigator.push(context, MaterialPageRoute(builder: (_) => SecondScreen()));

// Push with arguments
Navigator.pushNamed(context, '/details', arguments: 'data');

// Pop screen
Navigator.pop(context);

// Push and remove until
Navigator.pushAndRemoveUntil(context,
  MaterialPageRoute(builder: (_) => HomeScreen()),
  (route) => false
);
```

### Named Routes

Declare and use named routes.

```dart
// MaterialApp setup
MaterialApp(
  routes: {
    '/': (context) => HomeScreen(),
    '/details': (context) => DetailsScreen(),
  },
)

// Navigation
Navigator.pushNamed(context, '/details');
```

### GoRouter (Advanced)

Declarative routing package.

```dart
final _router = GoRouter(
  routes: [
    GoRoute(path: '/', builder: (context, state) => HomeScreen()),
    GoRoute(path: '/details', builder: (context, state) => DetailsScreen()),
  ],
);
```

## HTTP & APIs

### http Package

Make HTTP requests to APIs.

```dart
import 'package:http/http.dart' as http;

// GET request
var response = await http.get(Uri.parse('https://api.example.com/data'));

// POST request
var response = await http.post(
  Uri.parse('https://api.example.com/data'),
  body: {'key': 'value'},
);

// Handle response
if (response.statusCode == 200) {
  var data = jsonDecode(response.body);
}
```

### Dio (Advanced HTTP)

Powerful HTTP client with interceptors.

```dart
var dio = Dio();
var response = await dio.get('https://api.example.com/data');
```

### JSON Serialization

Convert JSON to Dart objects.

```dart
// Model class
class User {
  final String name;
  final int age;

  User({required this.name, required this.age});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      name: json['name'],
      age: json['age'],
    );
  }

  Map<String, dynamic> toJson() => {
    'name': name,
    'age': age,
  };
}

// Usage
var user = User.fromJson(jsonDecode(response.body));
var json = jsonEncode(user.toJson());
```

## Forms & Validation

### Form Widget

Create and validate forms.

```dart
final _formKey = GlobalKey<FormState>();
final _nameController = TextEditingController();

Form(
  key: _formKey,
  child: Column(
    children: [
      TextFormField(
        controller: _nameController,
        validator: (value) {
          if (value!.isEmpty) return 'Please enter name';
          return null;
        },
      ),
      ElevatedButton(
        onPressed: () {
          if (_formKey.currentState!.validate()) {
            // Form is valid
          }
        },
        child: Text('Submit'),
      ),
    ],
  ),
)
```

## Local Storage

### Shared Preferences

Store simple key-value pairs.

```dart
final prefs = await SharedPreferences.getInstance();
await prefs.setString('key', 'value');
var value = prefs.getString('key');
```

### SQLite (sqflite)

Local relational database.

```dart
var database = await openDatabase('my_db.db');
await database.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)');
```

### Hive (NoSQL)

Lightweight and fast key-value database.

```dart
await Hive.openBox('myBox');
var box = Hive.box('myBox');
box.put('key', 'value');
var value = box.get('key');
```

## Theming & Styling

### MaterialApp Theme

Define app-wide theme.

```dart
MaterialApp(
  theme: ThemeData(
    primarySwatch: Colors.blue,
    brightness: Brightness.light,
    textTheme: TextTheme(bodyText2: TextStyle(fontSize: 16)),
  ),
  darkTheme: ThemeData(brightness: Brightness.dark),
)
```

### Custom Themes

Create reusable theme data.

```dart
class AppThemes {
  static final light = ThemeData.light().copyWith(
    primaryColor: Colors.blue,
    accentColor: Colors.orange,
  );

  static final dark = ThemeData.dark().copyWith(
    primaryColor: Colors.blueGrey,
    accentColor: Colors.amber,
  );
}
```

## Animations

### Implicit Animations

Simple built-in animations.

```dart
AnimatedContainer(
  duration: Duration(seconds: 1),
  width: _expanded ? 200 : 100,
  height: _expanded ? 200 : 100,
)

AnimatedOpacity(
  opacity: _visible ? 1.0 : 0.0,
  duration: Duration(seconds: 1),
)
```

### Explicit Animations

Custom controlled animations.

```dart
AnimationController(
  duration: Duration(seconds: 2),
  vsync: this,
);

Animation<double> animation = CurvedAnimation(
  parent: _controller,
  curve: Curves.easeIn,
);
```

## Platform Specific

### Platform Detection

Check which platform app is running on.

```dart
import 'dart:io';

if (Platform.isIOS) {
  // iOS specific code
} else if (Platform.isAndroid) {
  // Android specific code
}
```

### Platform Channels

Communicate with native code.

```dart
// Flutter side
static const platform = MethodChannel('com.example/app');
var result = await platform.invokeMethod('nativeMethod');

// Native side (Android/iOS)
// Implement method channel handler
```

## Testing

### Widget Tests

Test individual widgets.

```dart
testWidgets('Widget test', (WidgetTester tester) async {
  await tester.pumpWidget(MyApp());
  expect(find.text('Hello'), findsOneWidget);
});
```

### Unit Tests

Test business logic.

```dart
test('Unit test', () {
  expect(1 + 1, 2);
});
```

### Integration Tests

Test complete app flows.

```dart
IntegrationTestWidgetsFlutterBinding.ensureInitialized();

testWidgets('Integration test', (tester) async {
  await tester.pumpWidget(MyApp());
  // Test complete user flows
});
```

## Debugging

### Common Debugging

Essential debugging techniques.

```dart
print('Debug message');    # Console output
debugPrint('Message');     # Flutter debug print
assert(condition);         # Runtime assertions

# DevTools - Flutter's debugging suite
# flutter run --debug
# Open DevTools in browser
```

### Logging

Structured logging.

```dart
import 'package:logger/logger.dart';

var logger = Logger();
logger.d('Debug message');
logger.i('Info message');
logger.w('Warning message');
logger.e('Error message');
```

## Performance

### Performance Best Practices

Tips for smooth app performance.

```dart
// Use const constructors
const Text('Hello')

// Avoid rebuilds with const widgets
const MyWidget()

// Use ListView.builder for long lists
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ListTile(title: Text(items[index])),
)

// Use keys wisely
Key('unique_key')

// Profile app performance
# flutter run --profile
```

## Packages

### Essential Packages

Must-have packages for Flutter development.

```yaml
dependencies:
  provider: ^6.0.0 # State management
  http: ^0.13.0 # HTTP requests
  shared_preferences: ^2.0.0 # Local storage
  hive: ^2.0.0 # NoSQL database
  flutter_hooks: ^0.18.0 # React hooks pattern
  go_router: ^5.0.0 # Declarative routing
  cached_network_image: ^3.0.0 # Image caching
  intl: ^0.17.0 # Internationalization
  flutter_bloc: ^8.0.0 # BLoC pattern
  riverpod: ^1.0.0 # Provider 2.0
```

### Dev Dependencies

Development and testing packages.

```yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0
  build_runner: ^2.0.0
  json_serializable: ^6.0.0
  hive_generator: ^1.0.0
```

## Useful Commands

### Flutter CLI

Essential Flutter commands.

```bash
flutter create project_name  # Create new project
flutter run                 # Run app
flutter build apk           # Build Android APK
flutter build ios           # Build iOS app
flutter test               # Run tests
flutter pub get            # Get packages
flutter clean             # Clean project
flutter doctor            # Check Flutter installation
```
