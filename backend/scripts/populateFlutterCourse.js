import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../src/models/Course.js';
import Module from '../src/models/Module.js';
import Lesson from '../src/models/Lesson.js';
import User from '../src/models/User.js';

dotenv.config();

const populateFlutterCourse = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB Connected');

    const course = await Course.findOne({ title: /Flutter/i });
    if (!course) {
      console.error('Flutter course not found!');
      process.exit(1);
    }

    console.log(`Found course: ${course.title}`);

    const instructor = await User.findOne({ role: 'instructor' });
    if (!instructor) {
      console.error('Instructor not found!');
      process.exit(1);
    }

    console.log(`Instructor: ${instructor.name}\n`);

    // Delete existing lessons
    const existingModules = await Module.find({ course: course._id });
    for (const module of existingModules) {
      await Lesson.deleteMany({ module: module._id });
    }
    console.log('Cleared existing lessons\n');

    // Get modules in order
    const modules = await Module.find({ course: course._id }).sort({ order: 1 });

    const lessonsData = [
      // Month 1: Dart Programming Fundamentals
      [
        {
          title: 'Introduction to Dart Programming',
          description: 'Dart syntax, variables, and basic programming concepts',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/Fqcsow_7go4',
          duration: 35,
          content: `# Introduction to Dart Programming

## What is Dart?
Dart is a client-optimized programming language for developing fast apps on any platform. It's the language used by Flutter.

## Setting Up Dart
\`\`\`bash
# Install Dart SDK
# Visit https://dart.dev/get-dart

# Check installation
dart --version

# Run Dart code
dart run filename.dart
\`\`\`

## Basic Syntax
\`\`\`dart
void main() {
  // Variables
  var name = 'Alice';
  String greeting = 'Hello';
  int age = 30;
  double height = 5.6;
  bool isActive = true;

  // Type inference
  var number = 42;  // int
  var message = 'Hi';  // String

  // Final and const
  final city = 'New York';  // Runtime constant
  const pi = 3.14159;  // Compile-time constant

  // Null safety
  String? nullableString;  // Can be null
  String nonNullable = 'Must have value';

  // Print
  print('$greeting, $name!');
  print('Age: $age, Height: $height');
}
\`\`\`

## Data Types
\`\`\`dart
// Numbers
int count = 10;
double price = 99.99;
num value = 42;  // Can be int or double

// Strings
String name = 'Alice';
String multiline = '''
  This is a
  multi-line string
''';

// Interpolation
print('My name is $name');
print('Sum: ${1 + 2}');

// Booleans
bool isLoggedIn = true;

// Lists
List<String> fruits = ['apple', 'banana', 'orange'];
var numbers = [1, 2, 3, 4, 5];
fruits.add('grape');

// Sets
Set<int> uniqueNumbers = {1, 2, 3, 3};  // {1, 2, 3}

// Maps
Map<String, int> ages = {
  'Alice': 30,
  'Bob': 25
};
\`\`\``,
          objectives: [
            'Understand Dart fundamentals',
            'Work with variables and data types',
            'Use null safety'
          ],
          isFree: true
        },
        {
          title: 'Control Flow and Functions',
          description: 'Conditionals, loops, and function definitions',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/71xacFdlD_Y',
          duration: 40,
          content: `# Control Flow and Functions

## Control Flow
\`\`\`dart
// If-else
int age = 18;
if (age >= 18) {
  print('Adult');
} else if (age >= 13) {
  print('Teenager');
} else {
  print('Child');
}

// Ternary operator
String status = age >= 18 ? 'Adult' : 'Minor';

// Switch case
String grade = 'A';
switch (grade) {
  case 'A':
    print('Excellent');
    break;
  case 'B':
    print('Good');
    break;
  default:
    print('Needs improvement');
}

// Loops
for (int i = 0; i < 5; i++) {
  print(i);
}

List<String> names = ['Alice', 'Bob', 'Charlie'];
for (String name in names) {
  print(name);
}

int count = 0;
while (count < 3) {
  print(count);
  count++;
}
\`\`\`

## Functions
\`\`\`dart
// Basic function
void greet(String name) {
  print('Hello, $name!');
}

// Return values
int add(int a, int b) {
  return a + b;
}

// Arrow functions
int multiply(int a, int b) => a * b;

// Optional parameters
void introduce(String name, [int? age]) {
  if (age != null) {
    print('I am $name, $age years old');
  } else {
    print('I am $name');
  }
}

// Named parameters
void createUser({required String name, int age = 18}) {
  print('User: $name, Age: $age');
}

createUser(name: 'Alice', age: 25);
createUser(name: 'Bob');  // Uses default age

// Anonymous functions
var numbers = [1, 2, 3, 4, 5];
numbers.forEach((number) {
  print(number * 2);
});
\`\`\``,
          objectives: [
            'Use control flow statements',
            'Define and call functions',
            'Work with parameters'
          ],
          isFree: true
        },
        {
          title: 'Object-Oriented Programming in Dart',
          description: 'Classes, objects, inheritance, and polymorphism',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/hEq0OBo_wAw',
          duration: 45,
          content: `# Object-Oriented Programming in Dart

## Classes and Objects
\`\`\`dart
class Person {
  // Properties
  String name;
  int age;

  // Constructor
  Person(this.name, this.age);

  // Named constructor
  Person.guest() : name = 'Guest', age = 0;

  // Method
  void introduce() {
    print('Hi, I am $name, $age years old');
  }

  // Getter
  String get info => '$name ($age)';

  // Setter
  set updateAge(int newAge) {
    if (newAge > 0) age = newAge;
  }
}

// Creating objects
var person1 = Person('Alice', 30);
var person2 = Person.guest();
person1.introduce();
\`\`\`

## Inheritance
\`\`\`dart
class Animal {
  String name;
  Animal(this.name);

  void makeSound() {
    print('Some sound');
  }
}

class Dog extends Animal {
  String breed;

  Dog(String name, this.breed) : super(name);

  @override
  void makeSound() {
    print('Woof!');
  }

  void fetch() {
    print('$name is fetching');
  }
}

var dog = Dog('Buddy', 'Golden Retriever');
dog.makeSound();  // Woof!
dog.fetch();
\`\`\`

## Abstract Classes and Interfaces
\`\`\`dart
abstract class Shape {
  double calculateArea();
  void display();
}

class Circle implements Shape {
  double radius;

  Circle(this.radius);

  @override
  double calculateArea() {
    return 3.14 * radius * radius;
  }

  @override
  void display() {
    print('Circle with area: \${calculateArea()}');
  }
}

// Mixins
mixin Swimmer {
  void swim() => print('Swimming');
}

class Duck extends Animal with Swimmer {
  Duck(String name) : super(name);
}
\`\`\``,
          objectives: [
            'Create classes and objects',
            'Implement inheritance',
            'Use abstract classes and mixins'
          ],
          isFree: false
        }
      ],
      // Month 2: Flutter Basics & UI Development
      [
        {
          title: 'Introduction to Flutter',
          description: 'Flutter architecture, widgets, and first app',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/1ukSR1GRtMU',
          duration: 40,
          content: `# Introduction to Flutter

## What is Flutter?
Flutter is Google's UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase.

## Setup Flutter
\`\`\`bash
# Install Flutter SDK
# Download from https://flutter.dev

# Check installation
flutter doctor

# Create new app
flutter create my_app
cd my_app

# Run app
flutter run
\`\`\`

## First Flutter App
\`\`\`dart
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'My First App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Home Page'),
      ),
      body: Center(
        child: Text(
          'Hello, Flutter!',
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}
\`\`\`

## Widget Tree Concept
\`\`\`
MaterialApp
└── Scaffold
    ├── AppBar
    └── Body
        └── Center
            └── Text
\`\`\`

## Stateless vs Stateful Widgets
**Stateless:** Immutable, cannot change
**Stateful:** Can change state and rebuild`,
          objectives: [
            'Understand Flutter architecture',
            'Create first Flutter app',
            'Differentiate widget types'
          ],
          isFree: false
        },
        {
          title: 'Basic Flutter Widgets',
          description: 'Text, Image, Button, Container, and common widgets',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/b_sQ9bMltGU',
          duration: 50,
          content: `# Basic Flutter Widgets

## Text Widget
\`\`\`dart
Text(
  'Hello, Flutter!',
  style: TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: Colors.blue,
    fontFamily: 'Roboto',
  ),
  textAlign: TextAlign.center,
  maxLines: 2,
  overflow: TextOverflow.ellipsis,
)
\`\`\`

## Container Widget
\`\`\`dart
Container(
  width: 200,
  height: 100,
  padding: EdgeInsets.all(16),
  margin: EdgeInsets.symmetric(horizontal: 20),
  decoration: BoxDecoration(
    color: Colors.blue,
    borderRadius: BorderRadius.circular(10),
    boxShadow: [
      BoxShadow(
        color: Colors.grey,
        blurRadius: 5,
        offset: Offset(0, 2),
      ),
    ],
  ),
  child: Text('Container'),
)
\`\`\`

## Image Widget
\`\`\`dart
// Network image
Image.network('https://example.com/image.jpg')

// Asset image (add to pubspec.yaml)
Image.asset('assets/images/logo.png')

// With properties
Image.network(
  'https://example.com/image.jpg',
  width: 200,
  height: 200,
  fit: BoxFit.cover,
)
\`\`\`

## Button Widgets
\`\`\`dart
// Elevated Button
ElevatedButton(
  onPressed: () {
    print('Button pressed');
  },
  child: Text('Click Me'),
  style: ElevatedButton.styleFrom(
    backgroundColor: Colors.blue,
    padding: EdgeInsets.symmetric(horizontal: 30, vertical: 15),
  ),
)

// Text Button
TextButton(
  onPressed: () {},
  child: Text('Text Button'),
)

// Icon Button
IconButton(
  icon: Icon(Icons.favorite),
  onPressed: () {},
)

// Floating Action Button
FloatingActionButton(
  onPressed: () {},
  child: Icon(Icons.add),
)
\`\`\`

## Icon Widget
\`\`\`dart
Icon(
  Icons.home,
  color: Colors.blue,
  size: 30,
)
\`\`\``,
          objectives: [
            'Use basic Flutter widgets',
            'Style widgets with properties',
            'Handle button interactions'
          ],
          isFree: false
        },
        {
          title: 'Layout Widgets',
          description: 'Row, Column, Stack, and responsive layouts',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/RJEnTRBxaSg',
          duration: 45,
          content: `# Layout Widgets

## Row and Column
\`\`\`dart
// Row (horizontal)
Row(
  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
  crossAxisAlignment: CrossAxisAlignment.center,
  children: [
    Text('Item 1'),
    Text('Item 2'),
    Text('Item 3'),
  ],
)

// Column (vertical)
Column(
  mainAxisAlignment: MainAxisAlignment.center,
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    Text('Line 1'),
    Text('Line 2'),
    Text('Line 3'),
  ],
)
\`\`\`

## Stack
\`\`\`dart
Stack(
  children: [
    Container(
      width: 200,
      height: 200,
      color: Colors.blue,
    ),
    Positioned(
      top: 50,
      left: 50,
      child: Text('Positioned Text'),
    ),
    Align(
      alignment: Alignment.bottomRight,
      child: Icon(Icons.star),
    ),
  ],
)
\`\`\`

## ListView
\`\`\`dart
ListView(
  children: [
    ListTile(
      leading: Icon(Icons.person),
      title: Text('Alice'),
      subtitle: Text('Developer'),
      trailing: Icon(Icons.arrow_forward),
      onTap: () {},
    ),
    ListTile(
      leading: Icon(Icons.person),
      title: Text('Bob'),
      subtitle: Text('Designer'),
    ),
  ],
)

// ListView.builder for dynamic lists
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return ListTile(
      title: Text(items[index]),
    );
  },
)
\`\`\`

## GridView
\`\`\`dart
GridView.count(
  crossAxisCount: 2,
  children: List.generate(10, (index) {
    return Card(
      child: Center(
        child: Text('Item $index'),
      ),
    );
  }),
)
\`\`\`

## Expanded and Flexible
\`\`\`dart
Row(
  children: [
    Expanded(
      flex: 2,
      child: Container(color: Colors.red),
    ),
    Expanded(
      flex: 1,
      child: Container(color: Colors.blue),
    ),
  ],
)
\`\`\``,
          objectives: [
            'Create layouts with Row and Column',
            'Use Stack for overlapping widgets',
            'Build scrollable lists and grids'
          ],
          isFree: false
        }
      ],
      // Month 3: State Management & Navigation
      [
        {
          title: 'Stateful Widgets and setState',
          description: 'Managing state with StatefulWidget',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/p5dkB3Mrxdo',
          duration: 40,
          content: `# Stateful Widgets and setState

## Creating Stateful Widget
\`\`\`dart
class Counter extends StatefulWidget {
  @override
  _CounterState createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _count = 0;

  void _increment() {
    setState(() {
      _count++;
    });
  }

  void _decrement() {
    setState(() {
      _count--;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Counter')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Count: $_count',
              style: TextStyle(fontSize: 48),
            ),
            SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(
                  onPressed: _decrement,
                  child: Icon(Icons.remove),
                ),
                SizedBox(width: 20),
                ElevatedButton(
                  onPressed: _increment,
                  child: Icon(Icons.add),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
\`\`\`

## Lifecycle Methods
\`\`\`dart
class MyWidget extends StatefulWidget {
  @override
  _MyWidgetState createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  @override
  void initState() {
    super.initState();
    // Called once when widget is created
    print('initState called');
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Called after initState and when dependencies change
  }

  @override
  Widget build(BuildContext context) {
    // Called every time setState is called
    return Container();
  }

  @override
  void dispose() {
    super.dispose();
    // Called when widget is removed
    print('dispose called');
  }
}
\`\`\``,
          objectives: [
            'Create stateful widgets',
            'Manage state with setState',
            'Understand widget lifecycle'
          ],
          isFree: false
        },
        {
          title: 'Navigation and Routing',
          description: 'Navigating between screens in Flutter',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/nyvwx7o277U',
          duration: 35,
          content: `# Navigation and Routing

## Basic Navigation
\`\`\`dart
// Navigate to new screen
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => SecondScreen()),
);

// Go back
Navigator.pop(context);

// Navigate with data
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (context) => DetailScreen(item: selectedItem),
  ),
);

// Return data
Navigator.pop(context, result);
\`\`\`

## Named Routes
\`\`\`dart
MaterialApp(
  initialRoute: '/',
  routes: {
    '/': (context) => HomeScreen(),
    '/details': (context) => DetailsScreen(),
    '/settings': (context) => SettingsScreen(),
  },
)

// Navigate using named route
Navigator.pushNamed(context, '/details');

// With arguments
Navigator.pushNamed(
  context,
  '/details',
  arguments: {'id': 123},
);

// Retrieve arguments
final args = ModalRoute.of(context)!.settings.arguments as Map;
\`\`\`

## Bottom Navigation
\`\`\`dart
class MainScreen extends StatefulWidget {
  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;

  final _screens = [
    HomeScreen(),
    SearchScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.search),
            label: 'Search',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
\`\`\``,
          objectives: [
            'Navigate between screens',
            'Use named routes',
            'Implement bottom navigation'
          ],
          isFree: false
        },
        {
          title: 'Provider State Management',
          description: 'Managing app state with Provider package',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/d_m5csmrf7I',
          duration: 45,
          content: `# Provider State Management

## Setup Provider
\`\`\`yaml
# pubspec.yaml
dependencies:
  provider: ^6.0.0
\`\`\`

## Create Provider
\`\`\`dart
import 'package:flutter/foundation.dart';

class CounterProvider extends ChangeNotifier {
  int _count = 0;

  int get count => _count;

  void increment() {
    _count++;
    notifyListeners();
  }

  void decrement() {
    _count--;
    notifyListeners();
  }

  void reset() {
    _count = 0;
    notifyListeners();
  }
}
\`\`\`

## Setup Provider in App
\`\`\`dart
import 'package:provider/provider.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => CounterProvider(),
      child: MyApp(),
    ),
  );
}

// Multiple providers
void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => CounterProvider()),
        ChangeNotifierProvider(create: (_) => UserProvider()),
      ],
      child: MyApp(),
    ),
  );
}
\`\`\`

## Consume Provider
\`\`\`dart
class CounterScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Watch for changes
    final counter = Provider.of<CounterProvider>(context);

    // Or use Consumer
    return Scaffold(
      appBar: AppBar(title: Text('Counter')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              '\${counter.count}',
              style: TextStyle(fontSize: 48),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(
                  onPressed: counter.decrement,
                  child: Icon(Icons.remove),
                ),
                ElevatedButton(
                  onPressed: counter.increment,
                  child: Icon(Icons.add),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// Using Consumer (rebuilds only this widget)
Consumer<CounterProvider>(
  builder: (context, counter, child) {
    return Text('\${counter.count}');
  },
)
\`\`\``,
          objectives: [
            'Set up Provider package',
            'Create change notifiers',
            'Consume provider state'
          ],
          isFree: false
        }
      ],
      // Month 4: Backend Integration & Firebase
      [
        {
          title: 'HTTP Requests and REST APIs',
          description: 'Making API calls and handling JSON data',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/D8hRZQHzI38',
          duration: 40,
          content: `# HTTP Requests and REST APIs

## Setup
\`\`\`yaml
dependencies:
  http: ^1.1.0
\`\`\`

## Making API Calls
\`\`\`dart
import 'package:http/http.dart' as http;
import 'dart:convert';

// GET request
Future<List<User>> fetchUsers() async {
  final response = await http.get(
    Uri.parse('https://api.example.com/users'),
  );

  if (response.statusCode == 200) {
    List jsonData = json.decode(response.body);
    return jsonData.map((json) => User.fromJson(json)).toList();
  } else {
    throw Exception('Failed to load users');
  }
}

// POST request
Future<User> createUser(String name, String email) async {
  final response = await http.post(
    Uri.parse('https://api.example.com/users'),
    headers: {'Content-Type': 'application/json'},
    body: json.encode({
      'name': name,
      'email': email,
    }),
  );

  if (response.statusCode == 201) {
    return User.fromJson(json.decode(response.body));
  } else {
    throw Exception('Failed to create user');
  }
}
\`\`\`

## Model Class
\`\`\`dart
class User {
  final int id;
  final String name;
  final String email;

  User({
    required this.id,
    required this.name,
    required this.email,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['name'],
      email: json['email'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
    };
  }
}
\`\`\`

## Using FutureBuilder
\`\`\`dart
FutureBuilder<List<User>>(
  future: fetchUsers(),
  builder: (context, snapshot) {
    if (snapshot.connectionState == ConnectionState.waiting) {
      return CircularProgressIndicator();
    } else if (snapshot.hasError) {
      return Text('Error: \${snapshot.error}');
    } else if (!snapshot.hasData) {
      return Text('No data');
    } else {
      return ListView.builder(
        itemCount: snapshot.data!.length,
        itemBuilder: (context, index) {
          final user = snapshot.data![index];
          return ListTile(
            title: Text(user.name),
            subtitle: Text(user.email),
          );
        },
      );
    }
  },
)
\`\`\``,
          objectives: [
            'Make HTTP requests',
            'Parse JSON data',
            'Use FutureBuilder'
          ],
          isFree: false
        },
        {
          title: 'Firebase Authentication',
          description: 'User authentication with Firebase',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/rWamixHIKmQ',
          duration: 50,
          content: `# Firebase Authentication

## Setup Firebase
\`\`\`yaml
dependencies:
  firebase_core: ^2.24.0
  firebase_auth: ^4.15.0
\`\`\`

## Initialize Firebase
\`\`\`dart
import 'package:firebase_core/firebase_core.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(MyApp());
}
\`\`\`

## Authentication Service
\`\`\`dart
import 'package:firebase_auth/firebase_auth.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;

  // Sign up
  Future<UserCredential?> signUp(String email, String password) async {
    try {
      return await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
    } catch (e) {
      print('Sign up error: $e');
      return null;
    }
  }

  // Sign in
  Future<UserCredential?> signIn(String email, String password) async {
    try {
      return await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
    } catch (e) {
      print('Sign in error: $e');
      return null;
    }
  }

  // Sign out
  Future<void> signOut() async {
    await _auth.signOut();
  }

  // Get current user
  User? getCurrentUser() {
    return _auth.currentUser;
  }

  // Auth state changes
  Stream<User?> get authStateChanges => _auth.authStateChanges();
}
\`\`\`

## Login Screen
\`\`\`dart
class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _authService = AuthService();

  Future<void> _signIn() async {
    final result = await _authService.signIn(
      _emailController.text,
      _passwordController.text,
    );

    if (result != null) {
      Navigator.pushReplacementNamed(context, '/home');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Login')),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _emailController,
              decoration: InputDecoration(labelText: 'Email'),
            ),
            TextField(
              controller: _passwordController,
              decoration: InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _signIn,
              child: Text('Sign In'),
            ),
          ],
        ),
      ),
    );
  }
}
\`\`\``,
          objectives: [
            'Set up Firebase in Flutter',
            'Implement user authentication',
            'Handle auth state changes'
          ],
          isFree: false
        },
        {
          title: 'Firestore Database',
          description: 'Cloud database operations with Firestore',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/ErP_xomHKTw',
          duration: 45,
          content: `# Firestore Database

## Setup
\`\`\`yaml
dependencies:
  cloud_firestore: ^4.13.0
\`\`\`

## Firestore Service
\`\`\`dart
import 'package:cloud_firestore/cloud_firestore.dart';

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // Create
  Future<void> addUser(String name, String email) async {
    await _db.collection('users').add({
      'name': name,
      'email': email,
      'createdAt': FieldValue.serverTimestamp(),
    });
  }

  // Read (once)
  Future<List<Map<String, dynamic>>> getUsers() async {
    QuerySnapshot snapshot = await _db.collection('users').get();
    return snapshot.docs.map((doc) {
      return {'id': doc.id, ...doc.data() as Map<String, dynamic>};
    }).toList();
  }

  // Read (stream)
  Stream<List<Map<String, dynamic>>> getUsersStream() {
    return _db.collection('users').snapshots().map((snapshot) {
      return snapshot.docs.map((doc) {
        return {'id': doc.id, ...doc.data() as Map<String, dynamic>};
      }).toList();
    });
  }

  // Update
  Future<void> updateUser(String id, Map<String, dynamic> data) async {
    await _db.collection('users').doc(id).update(data);
  }

  // Delete
  Future<void> deleteUser(String id) async {
    await _db.collection('users').doc(id).delete();
  }

  // Query
  Future<List<Map<String, dynamic>>> searchUsers(String name) async {
    QuerySnapshot snapshot = await _db
        .collection('users')
        .where('name', isGreaterThanOrEqualTo: name)
        .orderBy('name')
        .limit(10)
        .get();

    return snapshot.docs.map((doc) {
      return {'id': doc.id, ...doc.data() as Map<String, dynamic>};
    }).toList();
  }
}
\`\`\`

## Using StreamBuilder
\`\`\`dart
StreamBuilder<List<Map<String, dynamic>>>(
  stream: FirestoreService().getUsersStream(),
  builder: (context, snapshot) {
    if (snapshot.connectionState == ConnectionState.waiting) {
      return CircularProgressIndicator();
    }

    if (!snapshot.hasData || snapshot.data!.isEmpty) {
      return Text('No users');
    }

    return ListView.builder(
      itemCount: snapshot.data!.length,
      itemBuilder: (context, index) {
        final user = snapshot.data![index];
        return ListTile(
          title: Text(user['name']),
          subtitle: Text(user['email']),
          trailing: IconButton(
            icon: Icon(Icons.delete),
            onPressed: () {
              FirestoreService().deleteUser(user['id']);
            },
          ),
        );
      },
    );
  },
)
\`\`\``,
          objectives: [
            'Perform CRUD operations with Firestore',
            'Use real-time data streams',
            'Query Firestore data'
          ],
          isFree: false
        }
      ],
      // Month 5: Advanced Features & Native Integration
      [
        {
          title: 'Local Storage with SharedPreferences and SQLite',
          description: 'Persisting data locally in Flutter apps',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/szOllHT1S7Y',
          duration: 40,
          content: `# Local Storage

## SharedPreferences
\`\`\`yaml
dependencies:
  shared_preferences: ^2.2.0
\`\`\`

\`\`\`dart
import 'package:shared_preferences/shared_preferences.dart';

class PreferencesService {
  // Save data
  Future<void> saveString(String key, String value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(key, value);
  }

  Future<void> saveInt(String key, int value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(key, value);
  }

  Future<void> saveBool(String key, bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(key, value);
  }

  // Retrieve data
  Future<String?> getString(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(key);
  }

  Future<int?> getInt(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(key);
  }

  // Remove data
  Future<void> remove(String key) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(key);
  }

  // Clear all
  Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}
\`\`\`

## SQLite
\`\`\`yaml
dependencies:
  sqflite: ^2.3.0
  path: ^1.8.3
\`\`\`

\`\`\`dart
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._init();
  static Database? _database;

  DatabaseHelper._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('app.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB,
    );
  }

  Future _createDB(Database db, int version) async {
    await db.execute('''
      CREATE TABLE tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER NOT NULL
      )
    ''');
  }

  Future<int> create(Map<String, dynamic> task) async {
    final db = await instance.database;
    return await db.insert('tasks', task);
  }

  Future<List<Map<String, dynamic>>> readAll() async {
    final db = await instance.database;
    return await db.query('tasks');
  }

  Future<int> update(int id, Map<String, dynamic> task) async {
    final db = await instance.database;
    return await db.update(
      'tasks',
      task,
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<int> delete(int id) async {
    final db = await instance.database;
    return await db.delete(
      'tasks',
      where: 'id = ?',
      whereArgs: [id],
    );
  }
}
\`\`\``,
          objectives: [
            'Use SharedPreferences for simple data',
            'Implement SQLite for complex data',
            'Perform database operations'
          ],
          isFree: false
        },
        {
          title: 'Camera, Gallery, and File Picker',
          description: 'Accessing device camera and files',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/MSv38jO4EJk',
          duration: 35,
          content: `# Camera, Gallery, and File Picker

## Image Picker
\`\`\`yaml
dependencies:
  image_picker: ^1.0.0
\`\`\`

\`\`\`dart
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class ImagePickerService {
  final ImagePicker _picker = ImagePicker();

  // Pick from camera
  Future<File?> pickFromCamera() async {
    final XFile? image = await _picker.pickImage(
      source: ImageSource.camera,
      maxWidth: 1920,
      maxHeight: 1080,
      imageQuality: 85,
    );

    if (image != null) {
      return File(image.path);
    }
    return null;
  }

  // Pick from gallery
  Future<File?> pickFromGallery() async {
    final XFile? image = await _picker.pickImage(
      source: ImageSource.gallery,
    );

    if (image != null) {
      return File(image.path);
    }
    return null;
  }

  // Pick video
  Future<File?> pickVideo() async {
    final XFile? video = await _picker.pickVideo(
      source: ImageSource.gallery,
    );

    if (video != null) {
      return File(video.path);
    }
    return null;
  }
}
\`\`\`

## Usage in Widget
\`\`\`dart
class ImagePickerScreen extends StatefulWidget {
  @override
  _ImagePickerScreenState createState() => _ImagePickerScreenState();
}

class _ImagePickerScreenState extends State<ImagePickerScreen> {
  File? _image;
  final _imageService = ImagePickerService();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Image Picker')),
      body: Center(
        child: Column(
          children: [
            if (_image != null)
              Image.file(_image!, height: 300)
            else
              Text('No image selected'),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton.icon(
                  icon: Icon(Icons.camera),
                  label: Text('Camera'),
                  onPressed: () async {
                    final image = await _imageService.pickFromCamera();
                    setState(() => _image = image);
                  },
                ),
                ElevatedButton.icon(
                  icon: Icon(Icons.photo_library),
                  label: Text('Gallery'),
                  onPressed: () async {
                    final image = await _imageService.pickFromGallery();
                    setState(() => _image = image);
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
\`\`\``,
          objectives: [
            'Access device camera',
            'Pick images from gallery',
            'Handle file permissions'
          ],
          isFree: false
        },
        {
          title: 'Maps and Geolocation',
          description: 'Integrating Google Maps and location services',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/CUHh7x_7UKI',
          duration: 40,
          content: `# Maps and Geolocation

## Geolocation
\`\`\`yaml
dependencies:
  geolocator: ^10.0.0
\`\`\`

\`\`\`dart
import 'package:geolocator/geolocator.dart';

class LocationService {
  Future<Position?> getCurrentLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    // Check if location services are enabled
    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return null;
    }

    // Check permissions
    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return null;
      }
    }

    // Get position
    return await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );
  }

  Stream<Position> getPositionStream() {
    return Geolocator.getPositionStream(
      locationSettings: LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 10,
      ),
    );
  }
}
\`\`\`

## Google Maps
\`\`\`yaml
dependencies:
  google_maps_flutter: ^2.5.0
\`\`\`

\`\`\`dart
import 'package:google_maps_flutter/google_maps_flutter.dart';

class MapScreen extends StatefulWidget {
  @override
  _MapScreenState createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  late GoogleMapController mapController;
  final LatLng _center = const LatLng(37.7749, -122.4194);
  Set<Marker> _markers = {};

  void _onMapCreated(GoogleMapController controller) {
    mapController = controller;
    setState(() {
      _markers.add(
        Marker(
          markerId: MarkerId('marker_1'),
          position: _center,
          infoWindow: InfoWindow(
            title: 'San Francisco',
            snippet: 'Welcome!',
          ),
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Map')),
      body: GoogleMap(
        onMapCreated: _onMapCreated,
        initialCameraPosition: CameraPosition(
          target: _center,
          zoom: 11.0,
        ),
        markers: _markers,
      ),
    );
  }
}
\`\`\``,
          objectives: [
            'Get device location',
            'Integrate Google Maps',
            'Add markers to maps'
          ],
          isFree: false
        }
      ],
      // Month 6: App Deployment & Capstone Project
      [
        {
          title: 'App Icons and Splash Screens',
          description: 'Customizing app branding and launch screens',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/Q87y_7_p0PU',
          duration: 30,
          content: `# App Icons and Splash Screens

## App Icon
\`\`\`yaml
dev_dependencies:
  flutter_launcher_icons: ^0.13.0

flutter_launcher_icons:
  android: true
  ios: true
  image_path: "assets/icon/icon.png"
  adaptive_icon_background: "#ffffff"
  adaptive_icon_foreground: "assets/icon/icon.png"
\`\`\`

\`\`\`bash
flutter pub get
flutter pub run flutter_launcher_icons
\`\`\`

## Splash Screen
\`\`\`yaml
dev_dependencies:
  flutter_native_splash: ^2.3.0

flutter_native_splash:
  color: "#ffffff"
  image: assets/splash/splash.png
  android: true
  ios: true
\`\`\`

\`\`\`bash
flutter pub run flutter_native_splash:create
\`\`\`

## Manual Android Setup
\`\`\`xml
<!-- android/app/src/main/res/drawable/launch_background.xml -->
<layer-list>
    <item android:drawable="@android:color/white" />
    <item>
        <bitmap
            android:gravity="center"
            android:src="@drawable/splash" />
    </item>
</layer-list>
\`\`\``,
          objectives: [
            'Create app icons',
            'Design splash screens',
            'Configure branding'
          ],
          isFree: false
        },
        {
          title: 'Building and Releasing Apps',
          description: 'Preparing apps for Google Play and App Store',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/fB7KCsIRSvs',
          duration: 45,
          content: `# Building and Releasing Apps

## Android Release Build

### Update App Info
\`\`\`gradle
// android/app/build.gradle
android {
    defaultConfig {
        applicationId "com.example.myapp"
        versionCode 1
        versionName "1.0.0"
    }
}
\`\`\`

### Generate Signing Key
\`\`\`bash
keytool -genkey -v -keystore ~/key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias key
\`\`\`

### Configure Signing
\`\`\`properties
# android/key.properties
storePassword=your_password
keyPassword=your_password
keyAlias=key
storeFile=/path/to/key.jks
\`\`\`

### Build APK/AAB
\`\`\`bash
# APK
flutter build apk --release

# App Bundle (for Play Store)
flutter build appbundle --release
\`\`\`

## iOS Release Build

### Update Info
\`\`\`xml
<!-- ios/Runner/Info.plist -->
<key>CFBundleVersion</key>
<string>1</string>
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
\`\`\`

### Build iOS App
\`\`\`bash
flutter build ios --release
\`\`\`

## Publishing Checklist
- [ ] App icon and splash screen
- [ ] Privacy policy URL
- [ ] App screenshots (various sizes)
- [ ] App description and keywords
- [ ] Target API level (Android)
- [ ] Test on physical devices
- [ ] Handle permissions properly
- [ ] Remove debug code
- [ ] Optimize app size`,
          objectives: [
            'Build release versions',
            'Configure app signing',
            'Prepare for app stores'
          ],
          isFree: false
        },
        {
          title: 'Flutter Best Practices and Performance',
          description: 'Optimizing Flutter apps for production',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/PKGguGUwSYE',
          duration: 40,
          content: `# Flutter Best Practices and Performance

## Code Organization
\`\`\`
lib/
├── models/
├── providers/
├── screens/
├── services/
├── widgets/
└── main.dart
\`\`\`

## Performance Tips

### Use const Constructors
\`\`\`dart
// Good
const Text('Hello');
const SizedBox(height: 20);

// Avoid
Text('Hello');
SizedBox(height: 20);
\`\`\`

### Avoid Rebuilds
\`\`\`dart
// Use keys for lists
ListView.builder(
  itemBuilder: (context, index) {
    return ListTile(
      key: ValueKey(items[index].id),
      title: Text(items[index].name),
    );
  },
)

// Extract widgets
class MyWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ExpensiveWidget();  // Won't rebuild unnecessarily
  }
}
\`\`\`

### Lazy Loading
\`\`\`dart
// Use ListView.builder instead of ListView
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return ItemWidget(items[index]);
  },
)
\`\`\`

### Image Optimization
\`\`\`dart
Image.network(
  'url',
  cacheWidth: 400,  // Resize for display
  cacheHeight: 400,
)

// Use cached_network_image
CachedNetworkImage(
  imageUrl: 'url',
  placeholder: (context, url) => CircularProgressIndicator(),
)
\`\`\`

## Best Practices
✓ Use null safety
✓ Follow naming conventions
✓ Keep widgets small and focused
✓ Use async/await properly
✓ Handle errors gracefully
✓ Test on multiple devices
✓ Use DevTools for profiling`,
          objectives: [
            'Optimize app performance',
            'Follow best practices',
            'Use profiling tools'
          ],
          isFree: false
        }
      ]
    ];

    let totalDuration = 0;
    for (let i = 0; i < modules.length; i++) {
      const module = modules[i];
      const lessons = lessonsData[i];

      console.log(`\nProcessing module: ${module.title}`);

      for (let j = 0; j < lessons.length; j++) {
        const lessonData = lessons[j];
        const lesson = await Lesson.create({
          ...lessonData,
          module: module._id,
          course: course._id,
          instructor: instructor._id,
          order: j + 1
        });

        totalDuration += lessonData.duration;
        console.log(`  ✓ Created: ${lesson.title} (${lesson.duration} min)`);
      }
    }

    console.log(`\n✅ Successfully populated Flutter course!`);
    console.log(`Total modules: ${modules.length}`);
    console.log(`Total lessons: ${lessonsData.flat().length}`);
    console.log(`Total duration: ${totalDuration} minutes (${(totalDuration / 60).toFixed(1)} hours)`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

populateFlutterCourse();
