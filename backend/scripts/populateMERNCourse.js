import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../src/models/Course.js';
import Module from '../src/models/Module.js';
import Lesson from '../src/models/Lesson.js';
import User from '../src/models/User.js';

dotenv.config();

const populateMERNCourse = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB Connected');

    // Find the MERN Stack course
    const mernCourse = await Course.findOne({ title: /MERN/i });
    if (!mernCourse) {
      console.error('MERN Stack course not found!');
      process.exit(1);
    }

    console.log(`Found course: ${mernCourse.title}`);

    // Find the instructor
    const instructor = await User.findOne({ email: 'amara.okonkwo@eduhub.com' });
    if (!instructor) {
      console.error('Instructor not found!');
      process.exit(1);
    }

    console.log(`Instructor: ${instructor.name}\n`);

    // Delete existing modules and lessons for this course
    const existingModules = await Module.find({ course: mernCourse._id });
    for (const module of existingModules) {
      await Lesson.deleteMany({ module: module._id });
    }
    await Module.deleteMany({ course: mernCourse._id });
    console.log('Cleared existing modules and lessons\n');

    // Course structure with modules and lessons
    const courseStructure = [
      {
        title: 'Introduction to MERN Stack',
        description: 'Get started with the MERN stack and set up your development environment',
        lessons: [
          {
            title: 'What is the MERN Stack?',
            description: 'Understanding MongoDB, Express, React, and Node.js',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/7CqJlxBYj-M',
            duration: 25,
            content: `# What is the MERN Stack?

The MERN stack is a popular JavaScript stack for building modern web applications. It consists of:

## MongoDB
- NoSQL database that stores data in flexible, JSON-like documents
- Highly scalable and flexible schema design
- Perfect for handling large amounts of data

## Express.js
- Minimal and flexible Node.js web application framework
- Provides robust features for web and mobile applications
- Simplifies server-side development

## React
- JavaScript library for building user interfaces
- Component-based architecture
- Virtual DOM for optimal performance

## Node.js
- JavaScript runtime built on Chrome's V8 engine
- Allows you to run JavaScript on the server
- Non-blocking, event-driven architecture

## Why MERN?
- Full-stack JavaScript development
- Single language across the entire stack
- Large community and ecosystem
- High performance and scalability`,
            objectives: [
              'Understand what the MERN stack is',
              'Learn the role of each technology',
              'Recognize the benefits of using MERN'
            ],
            isFree: true
          },
          {
            title: 'Setting Up Your Development Environment',
            description: 'Install Node.js, MongoDB, and essential tools',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/SBB1YtwODT0',
            duration: 30,
            content: `# Development Environment Setup

## Prerequisites
Before we begin, you'll need to install several tools:

### 1. Node.js and npm
- Download from [nodejs.org](https://nodejs.org)
- Choose the LTS (Long Term Support) version
- Verify installation: \`node --version\` and \`npm --version\`

### 2. MongoDB
- Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- Install MongoDB Community Edition
- Or use MongoDB Atlas (cloud database)

### 3. Code Editor
- VS Code (recommended)
- Install useful extensions:
  - ES7+ React/Redux snippets
  - Prettier
  - ESLint
  - MongoDB for VS Code

### 4. Git
- Download from [git-scm.com](https://git-scm.com)
- Essential for version control

### 5. Postman
- Download from [postman.com](https://www.postman.com)
- For testing API endpoints

## Verify Your Setup
Run these commands in your terminal:
\`\`\`bash
node --version
npm --version
git --version
mongod --version
\`\`\``,
            objectives: [
              'Install Node.js and npm',
              'Set up MongoDB',
              'Configure your code editor',
              'Install essential development tools'
            ]
          },
          {
            title: 'Understanding JavaScript ES6+ Features',
            description: 'Modern JavaScript features you need to know',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/nZ1DMMsyVyI',
            duration: 45,
            content: `# Essential ES6+ JavaScript Features

## 1. Let and Const
\`\`\`javascript
// Use const for values that won't change
const API_URL = 'https://api.example.com';

// Use let for values that will change
let counter = 0;
counter++;
\`\`\`

## 2. Arrow Functions
\`\`\`javascript
// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;
\`\`\`

## 3. Template Literals
\`\`\`javascript
const name = 'John';
const greeting = \`Hello, \${name}!\`;
\`\`\`

## 4. Destructuring
\`\`\`javascript
// Object destructuring
const { name, age } = user;

// Array destructuring
const [first, second] = numbers;
\`\`\`

## 5. Spread Operator
\`\`\`javascript
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };
\`\`\`

## 6. Promises and Async/Await
\`\`\`javascript
// Promise
fetch(url)
  .then(response => response.json())
  .then(data => console.log(data));

// Async/Await
async function getData() {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
\`\`\`

## 7. Modules (Import/Export)
\`\`\`javascript
// Export
export const myFunction = () => {};
export default MyComponent;

// Import
import MyComponent from './MyComponent';
import { myFunction } from './utils';
\`\`\``,
            objectives: [
              'Master modern JavaScript syntax',
              'Understand arrow functions',
              'Use destructuring and spread operators',
              'Work with async/await'
            ]
          }
        ]
      },
      {
        title: 'MongoDB Fundamentals',
        description: 'Learn MongoDB database basics and CRUD operations',
        lessons: [
          {
            title: 'Introduction to MongoDB',
            description: 'Understanding NoSQL and MongoDB basics',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/ofme2o29ngU',
            duration: 35,
            content: `# MongoDB Fundamentals

## What is MongoDB?
MongoDB is a document-oriented NoSQL database that stores data in flexible, JSON-like documents.

## Key Concepts

### Documents
\`\`\`json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "address": {
    "street": "123 Main St",
    "city": "New York"
  }
}
\`\`\`

### Collections
- Collections are groups of documents
- Similar to tables in relational databases
- Don't require a fixed schema

### Databases
- Databases contain collections
- Each application typically uses one database

## MongoDB vs SQL
| MongoDB | SQL |
|---------|-----|
| Document | Row |
| Collection | Table |
| Field | Column |
| Embedded Document | Join |

## Advantages
- Flexible schema
- Horizontal scalability
- High performance
- Rich query language
- Native support for JSON`,
            objectives: [
              'Understand NoSQL databases',
              'Learn MongoDB document structure',
              'Compare MongoDB with SQL databases'
            ]
          },
          {
            title: 'CRUD Operations in MongoDB',
            description: 'Create, Read, Update, and Delete operations',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/ExcRbA7fy_A',
            duration: 40,
            content: `# MongoDB CRUD Operations

## Create Operations

### Insert One Document
\`\`\`javascript
db.users.insertOne({
  name: "John Doe",
  email: "john@example.com",
  age: 30
});
\`\`\`

### Insert Multiple Documents
\`\`\`javascript
db.users.insertMany([
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" }
]);
\`\`\`

## Read Operations

### Find All Documents
\`\`\`javascript
db.users.find();
\`\`\`

### Find with Query
\`\`\`javascript
db.users.find({ age: { $gte: 18 } });
\`\`\`

### Find One
\`\`\`javascript
db.users.findOne({ email: "john@example.com" });
\`\`\`

## Update Operations

### Update One
\`\`\`javascript
db.users.updateOne(
  { email: "john@example.com" },
  { $set: { age: 31 } }
);
\`\`\`

### Update Many
\`\`\`javascript
db.users.updateMany(
  { age: { $lt: 18 } },
  { $set: { status: "minor" } }
);
\`\`\`

## Delete Operations

### Delete One
\`\`\`javascript
db.users.deleteOne({ email: "john@example.com" });
\`\`\`

### Delete Many
\`\`\`javascript
db.users.deleteMany({ status: "inactive" });
\`\`\`

## Query Operators
- \`$eq\`: Equal to
- \`$ne\`: Not equal to
- \`$gt\`: Greater than
- \`$gte\`: Greater than or equal
- \`$lt\`: Less than
- \`$lte\`: Less than or equal
- \`$in\`: In array
- \`$nin\`: Not in array`,
            objectives: [
              'Perform Create operations',
              'Query documents effectively',
              'Update existing documents',
              'Delete documents safely'
            ]
          },
          {
            title: 'MongoDB Data Modeling',
            description: 'Design effective database schemas',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/3GHZd0zv170',
            duration: 35,
            content: `# MongoDB Data Modeling

## Schema Design Patterns

### Embedding vs Referencing

#### Embedding (Denormalization)
\`\`\`json
{
  "_id": 1,
  "name": "John Doe",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001"
  },
  "orders": [
    { "product": "Laptop", "price": 999 },
    { "product": "Mouse", "price": 29 }
  ]
}
\`\`\`

**Use embedding when:**
- Data is read together
- Related data doesn't change often
- Small arrays that won't grow indefinitely

#### Referencing (Normalization)
\`\`\`json
// User document
{
  "_id": 1,
  "name": "John Doe"
}

// Order documents
{
  "_id": 101,
  "userId": 1,
  "product": "Laptop",
  "price": 999
}
\`\`\`

**Use referencing when:**
- Data is large or grows unbounded
- Data is accessed separately
- Many-to-many relationships

## Best Practices
1. Design schema based on how data is accessed
2. Keep frequently accessed data together
3. Avoid large arrays
4. Use indexes for better performance
5. Consider document size (max 16MB)`,
            objectives: [
              'Understand embedding vs referencing',
              'Design efficient schemas',
              'Apply MongoDB best practices'
            ]
          }
        ]
      },
      {
        title: 'Node.js and Express Backend',
        description: 'Build RESTful APIs with Node.js and Express',
        lessons: [
          {
            title: 'Introduction to Node.js',
            description: 'Understanding Node.js and its core concepts',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/TlB_eWDSMt4',
            duration: 30,
            content: `# Node.js Fundamentals

## What is Node.js?
Node.js is a JavaScript runtime built on Chrome's V8 engine that allows you to run JavaScript on the server.

## Key Features
- **Asynchronous and Event-Driven**: Non-blocking I/O operations
- **Single-Threaded**: Uses event loop for concurrency
- **Fast Execution**: Built on V8 engine
- **NPM**: Largest ecosystem of open-source libraries

## Node.js Architecture
\`\`\`
┌───────────────────────────┐
│    JavaScript Code        │
├───────────────────────────┤
│    Node.js Bindings       │
├───────────────────────────┤
│       V8 Engine           │
├───────────────────────────┤
│       libuv (Event Loop)  │
└───────────────────────────┘
\`\`\`

## Core Modules
- **fs**: File system operations
- **http**: Create HTTP servers
- **path**: File path utilities
- **os**: Operating system information
- **events**: Event emitter

## Example: Creating a Simple Server
\`\`\`javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\``,
            objectives: [
              'Understand Node.js architecture',
              'Learn core modules',
              'Create a basic HTTP server'
            ]
          },
          {
            title: 'Express.js Framework',
            description: 'Building web applications with Express',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/SccSCuHhOw0',
            duration: 45,
            content: `# Express.js Framework

## What is Express?
Express is a minimal and flexible Node.js web application framework that provides robust features for web and mobile applications.

## Installation
\`\`\`bash
npm install express
\`\`\`

## Basic Express App
\`\`\`javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.post('/api/users', (req, res) => {
  const user = req.body;
  res.status(201).json(user);
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
\`\`\`

## Middleware
Middleware functions have access to request and response objects.

\`\`\`javascript
// Custom middleware
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.url}\`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
\`\`\`

## Routing
\`\`\`javascript
// Route parameters
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ id: userId });
});

// Query parameters
app.get('/search', (req, res) => {
  const query = req.query.q;
  res.json({ query });
});
\`\`\``,
            objectives: [
              'Set up Express application',
              'Create routes and endpoints',
              'Use middleware effectively',
              'Handle requests and responses'
            ]
          },
          {
            title: 'RESTful API Design',
            description: 'Design and build RESTful APIs',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/0oXYLzuucwE',
            duration: 40,
            content: `# RESTful API Design

## REST Principles
REST (Representational State Transfer) is an architectural style for designing networked applications.

## HTTP Methods
| Method | Purpose | Example |
|--------|---------|---------|
| GET | Retrieve data | GET /api/users |
| POST | Create data | POST /api/users |
| PUT | Update (replace) | PUT /api/users/123 |
| PATCH | Update (modify) | PATCH /api/users/123 |
| DELETE | Delete data | DELETE /api/users/123 |

## API Structure Example
\`\`\`javascript
// User Routes
app.get('/api/users', getAllUsers);           // Get all users
app.get('/api/users/:id', getUserById);       // Get single user
app.post('/api/users', createUser);           // Create user
app.put('/api/users/:id', updateUser);        // Update user
app.delete('/api/users/:id', deleteUser);     // Delete user

// Nested resources
app.get('/api/users/:id/posts', getUserPosts);
\`\`\`

## Status Codes
- **200 OK**: Successful GET, PUT, PATCH
- **201 Created**: Successful POST
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Invalid request
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: No permission
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Server error

## Response Format
\`\`\`javascript
// Success
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe"
  }
}

// Error
{
  "success": false,
  "message": "User not found",
  "error": "NOT_FOUND"
}
\`\`\`

## Best Practices
1. Use nouns for resource names
2. Use HTTP methods appropriately
3. Version your API (/api/v1/)
4. Use proper status codes
5. Implement pagination for large datasets
6. Filter and search capabilities
7. Proper error handling`,
            objectives: [
              'Understand REST principles',
              'Design clean API endpoints',
              'Use appropriate HTTP methods',
              'Implement proper status codes'
            ]
          },
          {
            title: 'Connecting MongoDB with Mongoose',
            description: 'Use Mongoose ODM for MongoDB operations',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/DZBGEVgL2eE',
            duration: 50,
            content: `# Mongoose ODM

## What is Mongoose?
Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.

## Installation
\`\`\`bash
npm install mongoose
\`\`\`

## Connecting to MongoDB
\`\`\`javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('Connection error:', err));
\`\`\`

## Defining Schemas
\`\`\`javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  age: {
    type: Number,
    min: 0,
    max: 120
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
\`\`\`

## CRUD Operations
\`\`\`javascript
// Create
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
});

// Read
const users = await User.find();
const user = await User.findById(id);
const user = await User.findOne({ email: 'john@example.com' });

// Update
await User.findByIdAndUpdate(id, { age: 31 });
await User.updateOne({ email }, { $set: { age: 31 } });

// Delete
await User.findByIdAndDelete(id);
await User.deleteOne({ email });
\`\`\`

## Schema Validation
\`\`\`javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  }
});
\`\`\`

## Middleware (Hooks)
\`\`\`javascript
// Pre-save hook
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Post-save hook
userSchema.post('save', function(doc) {
  console.log('User saved:', doc.name);
});
\`\`\``,
            objectives: [
              'Connect Node.js to MongoDB',
              'Define Mongoose schemas',
              'Perform CRUD operations',
              'Implement validation and middleware'
            ]
          }
        ]
      },
      {
        title: 'React Frontend Basics',
        description: 'Build user interfaces with React',
        lessons: [
          {
            title: 'Introduction to React',
            description: 'Understanding React and its core concepts',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
            duration: 35,
            content: `# React Fundamentals

## What is React?
React is a JavaScript library for building user interfaces, developed by Facebook.

## Key Concepts

### Component-Based Architecture
React applications are built using reusable components.

\`\`\`javascript
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
\`\`\`

### JSX (JavaScript XML)
JSX allows you to write HTML-like code in JavaScript.

\`\`\`javascript
const element = <h1>Hello, World!</h1>;

const user = {
  firstName: 'John',
  lastName: 'Doe'
};

const element = (
  <div>
    <h1>Hello, {user.firstName} {user.lastName}!</h1>
  </div>
);
\`\`\`

### Virtual DOM
React uses a virtual DOM for optimal performance.

1. Changes made to virtual DOM
2. React compares virtual DOM with real DOM (diffing)
3. Only changed elements are updated in real DOM

## Creating a React App
\`\`\`bash
npx create-react-app my-app
cd my-app
npm start
\`\`\`

## Functional Components
\`\`\`javascript
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Arrow function
const Greeting = ({ name }) => {
  return <h1>Hello, {name}!</h1>;
};
\`\`\`

## Props
Props are read-only data passed to components.

\`\`\`javascript
function UserCard({ user }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

// Usage
<UserCard user={{ name: 'John', email: 'john@example.com' }} />
\`\`\``,
            objectives: [
              'Understand React components',
              'Write JSX syntax',
              'Use props to pass data',
              'Create functional components'
            ],
            isFree: true
          },
          {
            title: 'React Hooks - useState and useEffect',
            description: 'Manage state and side effects in React',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/O6P86uwfdR0',
            duration: 45,
            content: `# React Hooks

## useState Hook
Manage component state in functional components.

\`\`\`javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

### Multiple State Variables
\`\`\`javascript
function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);

  return (
    <form>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
    </form>
  );
}
\`\`\`

### State with Objects
\`\`\`javascript
const [user, setUser] = useState({
  name: '',
  email: '',
  age: 0
});

// Update specific field
setUser({ ...user, name: 'John' });
\`\`\`

## useEffect Hook
Handle side effects like data fetching, subscriptions, etc.

\`\`\`javascript
import { useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Runs after component mounts
    fetchUsers();
  }, []); // Empty array = run once

  const fetchUsers = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data);
  };

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
\`\`\`

### Dependency Array
\`\`\`javascript
// Run on mount and when userId changes
useEffect(() => {
  fetchUser(userId);
}, [userId]);

// Run after every render
useEffect(() => {
  console.log('Rendered');
});

// Cleanup function
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);

  return () => clearInterval(timer);
}, []);
\`\`\``,
            objectives: [
              'Use useState for state management',
              'Understand useEffect lifecycle',
              'Handle side effects properly',
              'Implement cleanup functions'
            ]
          },
          {
            title: 'React Router',
            description: 'Implement navigation in React applications',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/Law7wfdg_ls',
            duration: 40,
            content: `# React Router

## Installation
\`\`\`bash
npm install react-router-dom
\`\`\`

## Basic Setup
\`\`\`javascript
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users">Users</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

## Route Parameters
\`\`\`javascript
import { useParams } from 'react-router-dom';

function UserDetail() {
  const { id } = useParams();

  return <h1>User ID: {id}</h1>;
}

// In Routes
<Route path="/users/:id" element={<UserDetail />} />
\`\`\`

## Nested Routes
\`\`\`javascript
<Routes>
  <Route path="/dashboard" element={<Dashboard />}>
    <Route path="profile" element={<Profile />} />
    <Route path="settings" element={<Settings />} />
  </Route>
</Routes>

// In Dashboard component
import { Outlet } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Outlet /> {/* Child routes render here */}
    </div>
  );
}
\`\`\`

## Navigation Hooks
\`\`\`javascript
import { useNavigate, useLocation } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = () => {
    // After login
    navigate('/dashboard');
    // Or go back
    navigate(-1);
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
\`\`\`

## Protected Routes
\`\`\`javascript
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

// Usage
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
\`\`\``,
            objectives: [
              'Set up React Router',
              'Create routes and navigation',
              'Use route parameters',
              'Implement protected routes'
            ]
          }
        ]
      },
      {
        title: 'Connecting Frontend and Backend',
        description: 'Integrate React with Express API',
        lessons: [
          {
            title: 'Fetching Data with Axios',
            description: 'Make HTTP requests from React to your API',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/6LyagkoRWYA',
            duration: 35,
            content: `# Axios for HTTP Requests

## Installation
\`\`\`bash
npm install axios
\`\`\`

## Basic GET Request
\`\`\`javascript
import axios from 'axios';
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
\`\`\`

## POST Request
\`\`\`javascript
const createUser = async (userData) => {
  try {
    const response = await axios.post('/api/users', userData);
    console.log('User created:', response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};
\`\`\`

## PUT/PATCH Request
\`\`\`javascript
const updateUser = async (id, updates) => {
  try {
    const response = await axios.put(\`/api/users/\${id}\`, updates);
    return response.data;
  } catch (error) {
    throw error;
  }
};
\`\`\`

## DELETE Request
\`\`\`javascript
const deleteUser = async (id) => {
  try {
    await axios.delete(\`/api/users/\${id}\`);
  } catch (error) {
    console.error('Delete failed:', error);
  }
};
\`\`\`

## Axios Instance (Recommended)
\`\`\`javascript
// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
\`\`\`

## Usage with Custom Instance
\`\`\`javascript
import api from './api';

const getUsers = () => api.get('/users');
const createUser = (data) => api.post('/users', data);
\`\`\``,
            objectives: [
              'Install and configure Axios',
              'Make GET, POST, PUT, DELETE requests',
              'Handle loading and error states',
              'Create axios instances with interceptors'
            ]
          },
          {
            title: 'CORS and Proxy Setup',
            description: 'Handle cross-origin requests between frontend and backend',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/4KHiSt0oLJ0',
            duration: 25,
            content: `# CORS and Proxy Configuration

## What is CORS?
Cross-Origin Resource Sharing (CORS) is a security feature that restricts web pages from making requests to a different domain.

## Backend CORS Setup (Express)
\`\`\`bash
npm install cors
\`\`\`

\`\`\`javascript
const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Or configure specific origins
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
\`\`\`

## Development Proxy (React)
In package.json:
\`\`\`json
{
  "proxy": "http://localhost:5000"
}
\`\`\`

Then in your React code:
\`\`\`javascript
// Instead of
fetch('http://localhost:5000/api/users')

// Use
fetch('/api/users')
\`\`\`

## Environment Variables
\`\`\`javascript
// .env
REACT_APP_API_URL=http://localhost:5000

// Usage
const API_URL = process.env.REACT_APP_API_URL;
fetch(\`\${API_URL}/api/users\`);
\`\`\`

## Production Setup
\`\`\`javascript
const express = require('express');
const path = require('path');

const app = express();

// API routes
app.use('/api', apiRoutes);

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client/build')));

// Catch-all route for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});
\`\`\``,
            objectives: [
              'Understand CORS',
              'Configure CORS in Express',
              'Set up development proxy',
              'Use environment variables'
            ]
          },
          {
            title: 'Authentication with JWT',
            description: 'Implement user authentication using JSON Web Tokens',
            type: 'recorded',
            videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4',
            duration: 60,
            content: `# JWT Authentication

## Installation
\`\`\`bash
npm install jsonwebtoken bcryptjs
\`\`\`

## Backend - User Registration
\`\`\`javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
\`\`\`

## Backend - Login
\`\`\`javascript
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
\`\`\`

## Backend - Auth Middleware
\`\`\`javascript
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Protected route
app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});
\`\`\`

## Frontend - Auth Context
\`\`\`javascript
import { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (email, password) => {
    const response = await axios.post('/api/login', { email, password });
    setToken(response.data.token);
    setUser(response.data.user);
    localStorage.setItem('token', response.data.token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
\`\`\`

## Frontend - Login Component
\`\`\`javascript
import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
\`\`\``,
            objectives: [
              'Implement user registration',
              'Create login functionality',
              'Generate and verify JWT tokens',
              'Protect routes with authentication'
            ]
          }
        ]
      },
      {
        title: 'Final Project: Full-Stack MERN Application',
        description: 'Build a complete MERN stack application from scratch',
        lessons: [
          {
            title: 'Project Planning and Setup',
            description: 'Plan your application architecture and set up the project',
            type: 'reading',
            duration: 30,
            content: `# Final Project: Task Manager Application

## Project Overview
We'll build a full-stack task management application with user authentication, CRUD operations, and real-time updates.

## Features
1. User Authentication (Register/Login)
2. Create, Read, Update, Delete tasks
3. Mark tasks as complete
4. Filter tasks by status
5. User dashboard
6. Responsive design

## Technology Stack
- **Frontend**: React, React Router, Axios, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs

## Project Structure
\`\`\`
mern-task-manager/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/                 # Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md
\`\`\`

## Database Schema

### User Model
\`\`\`javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
\`\`\`

### Task Model
\`\`\`javascript
{
  title: String,
  description: String,
  completed: Boolean,
  priority: String (low, medium, high),
  dueDate: Date,
  user: ObjectId (ref: User),
  createdAt: Date
}
\`\`\`

## API Endpoints

### Auth Routes
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### Task Routes (Protected)
- GET /api/tasks - Get all user tasks
- GET /api/tasks/:id - Get single task
- POST /api/tasks - Create new task
- PUT /api/tasks/:id - Update task
- DELETE /api/tasks/:id - Delete task

## Next Steps
1. Set up project folders
2. Initialize npm projects
3. Install dependencies
4. Configure environment variables
5. Start building!`,
            objectives: [
              'Understand project requirements',
              'Plan application architecture',
              'Set up project structure',
              'Define database schemas and API endpoints'
            ]
          },
          {
            title: 'Building the Backend API',
            description: 'Create the Express server and API endpoints',
            type: 'assignment',
            duration: 120,
            content: `# Backend Development Assignment

## Objectives
Build a complete REST API for the task manager application.

## Requirements

### 1. Project Setup
- Initialize Node.js project
- Install required dependencies
- Set up environment variables
- Configure MongoDB connection

### 2. User Authentication
- Implement user registration with password hashing
- Create login endpoint with JWT generation
- Build authentication middleware
- Add input validation

### 3. Task CRUD Operations
- Create task endpoints (GET, POST, PUT, DELETE)
- Implement user-specific task filtering
- Add task validation
- Handle error cases

### 4. Testing
- Test all endpoints using Postman
- Verify authentication works correctly
- Test error handling

## Deliverables
1. Working Express server
2. User authentication system
3. Complete task API
4. Postman collection with all endpoints

## Bonus Points
- Input validation with express-validator
- Pagination for task lists
- Search and filter functionality
- API documentation`,
            objectives: [
              'Build REST API with Express',
              'Implement authentication system',
              'Create CRUD operations',
              'Test API endpoints'
            ]
          },
          {
            title: 'Building the React Frontend',
            description: 'Create the user interface with React',
            type: 'assignment',
            duration: 150,
            content: `# Frontend Development Assignment

## Objectives
Build a responsive React application that connects to your backend API.

## Requirements

### 1. Project Setup
- Create React app
- Install dependencies (axios, react-router-dom, tailwind)
- Set up routing
- Configure API connection

### 2. Authentication Pages
- Create Login page
- Create Register page
- Implement AuthContext for state management
- Add protected routes

### 3. Task Management
- Dashboard with task list
- Create task form
- Edit task functionality
- Delete task with confirmation
- Mark tasks as complete

### 4. UI/UX
- Responsive design
- Loading states
- Error handling
- Form validation
- User feedback (toasts/alerts)

## Components to Create
1. Navbar
2. Login Form
3. Register Form
4. Task List
5. Task Item
6. Task Form
7. Dashboard
8. Protected Route wrapper

## Deliverables
1. Functional React application
2. Complete authentication flow
3. Task management interface
4. Responsive design
5. Connected to backend API

## Bonus Points
- Filter tasks by status
- Sort tasks by priority/date
- Dark mode toggle
- Task statistics dashboard`,
            objectives: [
              'Build React components',
              'Implement routing and navigation',
              'Connect frontend to backend',
              'Create responsive UI'
            ]
          },
          {
            title: 'Deployment and Best Practices',
            description: 'Deploy your MERN application to production',
            type: 'reading',
            duration: 45,
            content: `# Deployment Guide

## Preparing for Deployment

### Environment Variables
Never commit sensitive data. Use environment variables:

**.env**
\`\`\`
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NODE_ENV=production
PORT=5000
\`\`\`

### Production Build
\`\`\`bash
# Build React app
cd client
npm run build

# This creates an optimized production build in client/build
\`\`\`

## Deployment Options

### Option 1: Heroku
\`\`\`bash
# Install Heroku CLI
heroku login
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
\`\`\`

### Option 2: Render
1. Create account on render.com
2. Connect GitHub repository
3. Create web service
4. Set environment variables
5. Deploy automatically on push

### Option 3: Railway
1. Create account on railway.app
2. Create new project from GitHub
3. Add environment variables
4. Deploy

## MongoDB Atlas
1. Create cluster on mongodb.com/cloud/atlas
2. Create database user
3. Whitelist IP addresses
4. Get connection string
5. Use in MONGODB_URI

## Best Practices

### Security
- Use HTTPS in production
- Implement rate limiting
- Validate all inputs
- Use helmet.js for security headers
- Keep dependencies updated

### Performance
- Enable GZIP compression
- Minimize bundle size
- Use CDN for static assets
- Implement caching
- Optimize database queries

### Code Quality
- Follow consistent code style
- Write meaningful comments
- Use ESLint and Prettier
- Write tests
- Use version control properly

### Monitoring
- Set up error tracking (Sentry)
- Monitor application performance
- Log important events
- Set up alerts

## Post-Deployment
1. Test all features
2. Check error logs
3. Monitor performance
4. Gather user feedback
5. Plan improvements`,
            objectives: [
              'Prepare app for deployment',
              'Deploy to cloud platform',
              'Configure production environment',
              'Implement best practices'
            ]
          }
        ]
      }
    ];

    // Create modules and lessons
    let moduleOrder = 0;
    for (const moduleData of courseStructure) {
      console.log(`\nCreating module: ${moduleData.title}`);

      const module = await Module.create({
        course: mernCourse._id,
        title: moduleData.title,
        description: moduleData.description,
        order: moduleOrder++
      });

      console.log(`✓ Module created`);

      // Create lessons for this module
      let lessonOrder = 0;
      for (const lessonData of moduleData.lessons) {
        const lesson = await Lesson.create({
          module: module._id,
          course: mernCourse._id,
          instructor: instructor._id,
          title: lessonData.title,
          description: lessonData.description,
          type: lessonData.type,
          videoUrl: lessonData.videoUrl || '',
          duration: lessonData.duration,
          content: lessonData.content,
          objectives: lessonData.objectives || [],
          order: lessonOrder++,
          isFree: lessonData.isFree || false,
          status: 'published'
        });

        console.log(`  ✓ Lesson: ${lesson.title}`);
      }
    }

    // Update course with total duration
    const allLessons = await Lesson.find({ course: mernCourse._id });
    const totalDuration = allLessons.reduce((sum, lesson) => sum + lesson.duration, 0);

    await Course.findByIdAndUpdate(mernCourse._id, {
      duration: totalDuration
    });

    console.log(`\n✅ Successfully populated MERN course!`);
    console.log(`📚 Total Modules: ${courseStructure.length}`);
    console.log(`📖 Total Lessons: ${allLessons.length}`);
    console.log(`⏱️  Total Duration: ${totalDuration} minutes (${Math.round(totalDuration / 60)} hours)`);

  } catch (error) {
    console.error('Error populating course:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

populateMERNCourse();
