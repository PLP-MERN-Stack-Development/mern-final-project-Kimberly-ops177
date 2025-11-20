import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../src/models/Course.js';
import Module from '../src/models/Module.js';
import Lesson from '../src/models/Lesson.js';
import User from '../src/models/User.js';

dotenv.config();

const populateSoftwareTestingCourse = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB Connected');

    const course = await Course.findOne({ title: /Software Testing/i });
    if (!course) {
      console.error('Software Testing course not found!');
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
      // Month 1: Testing Fundamentals & Manual Testing
      [
        {
          title: 'Introduction to Software Testing',
          description: 'Testing fundamentals, SDLC, and QA principles',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/aV6JCJn4VqQ',
          duration: 30,
          content: `# Introduction to Software Testing

## What is Software Testing?
Software testing is the process of evaluating and verifying that a software application works as expected.

## Software Development Life Cycle (SDLC)
1. **Requirements**: Gather and analyze requirements
2. **Design**: Create system architecture
3. **Development**: Write code
4. **Testing**: Verify functionality
5. **Deployment**: Release to production
6. **Maintenance**: Fix issues and updates

## Testing Principles
- Testing shows presence of defects, not absence
- Exhaustive testing is impossible
- Early testing saves time and cost
- Defect clustering (80/20 rule)
- Pesticide paradox (tests become ineffective)
- Testing is context-dependent
- Absence-of-errors fallacy

## Types of Testing

### By Approach
- **Manual Testing**: Human testers execute test cases
- **Automated Testing**: Scripts execute tests

### By Level
- **Unit Testing**: Individual components
- **Integration Testing**: Component interactions
- **System Testing**: Complete system
- **Acceptance Testing**: User requirements

### By Type
- **Functional**: Does it work correctly?
- **Non-Functional**: Performance, security, usability`,
          objectives: [
            'Understand testing fundamentals',
            'Learn SDLC phases',
            'Identify testing types'
          ],
          isFree: true
        },
        {
          title: 'Test Planning and Strategy',
          description: 'Creating test plans, test cases, and test strategies',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/w0P_L6bJfKI',
          duration: 35,
          content: `# Test Planning and Strategy

## Test Plan Components
1. **Test Objectives**: What we're testing
2. **Scope**: In-scope and out-of-scope features
3. **Resources**: Team, tools, environment
4. **Schedule**: Timeline and milestones
5. **Risks**: Potential issues and mitigation
6. **Deliverables**: Test reports, metrics

## Writing Test Cases
\`\`\`
Test Case ID: TC_001
Title: Login with valid credentials
Preconditions: User account exists
Steps:
  1. Navigate to login page
  2. Enter valid username
  3. Enter valid password
  4. Click Login button
Expected Result: User successfully logged in
Priority: High
Status: Pass/Fail
\`\`\`

## Test Case Design Techniques

### Equivalence Partitioning
Divide inputs into valid and invalid partitions
\`\`\`
Age field (valid: 18-100):
- Invalid partition: < 18
- Valid partition: 18-100
- Invalid partition: > 100
Test: 17, 50, 101
\`\`\`

### Boundary Value Analysis
Test at boundaries
\`\`\`
Age 18-100:
Test: 17, 18, 19, 99, 100, 101
\`\`\`

### Decision Table Testing
\`\`\`
| Username | Password | Result |
|----------|----------|--------|
| Valid    | Valid    | Login  |
| Valid    | Invalid  | Error  |
| Invalid  | Valid    | Error  |
| Invalid  | Invalid  | Error  |
\`\`\``,
          objectives: [
            'Create comprehensive test plans',
            'Write effective test cases',
            'Apply test design techniques'
          ],
          isFree: true
        },
        {
          title: 'Defect Management',
          description: 'Bug reporting, tracking, and defect lifecycle',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/M1i9l_Bvi5E',
          duration: 30,
          content: `# Defect Management

## Defect Life Cycle
1. **New**: Defect reported
2. **Assigned**: Assigned to developer
3. **Open**: Developer working on fix
4. **Fixed**: Developer claims fix
5. **Retest**: QA retests
6. **Verified**: QA confirms fix
7. **Closed**: Defect resolved

## Defect Severity vs Priority

### Severity (Impact)
- **Critical**: System crash, data loss
- **High**: Major functionality broken
- **Medium**: Feature partially works
- **Low**: Minor UI issue

### Priority (Urgency)
- **P1**: Fix immediately
- **P2**: Fix in current release
- **P3**: Fix in future release
- **P4**: Can be deferred

## Writing Good Bug Reports
\`\`\`
Bug ID: BUG-123
Title: Login button not working on mobile
Environment: iOS 16, Safari
Severity: High
Priority: P1
Steps to Reproduce:
  1. Open app on iPhone
  2. Enter credentials
  3. Tap Login button
Expected: User logs in
Actual: Button does nothing
Screenshots: [attached]
Logs: [attached]
\`\`\``,
          objectives: [
            'Understand defect lifecycle',
            'Write clear bug reports',
            'Prioritize defects effectively'
          ],
          isFree: false
        }
      ],
      // Month 2: Automation Testing with Selenium
      [
        {
          title: 'Introduction to Selenium WebDriver',
          description: 'Setting up Selenium and basic automation',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/Kq9CxhNi28o',
          duration: 40,
          content: `# Introduction to Selenium WebDriver

## Setup Selenium
\`\`\`java
// Maven dependencies
<dependency>
    <groupId>org.seleniumhq.selenium</groupId>
    <artifactId>selenium-java</artifactId>
    <version>4.15.0</version>
</dependency>

// Python
pip install selenium
\`\`\`

## Basic Selenium Test (Java)
\`\`\`java
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.By;

public class FirstTest {
    public static void main(String[] args) {
        // Initialize driver
        WebDriver driver = new ChromeDriver();

        // Navigate to URL
        driver.get("https://example.com");

        // Find element and interact
        driver.findElement(By.id("username")).sendKeys("testuser");
        driver.findElement(By.id("password")).sendKeys("password123");
        driver.findElement(By.id("login")).click();

        // Verify
        String title = driver.getTitle();
        System.out.println("Page title: " + title);

        // Close
        driver.quit();
    }
}
\`\`\`

## Locator Strategies
\`\`\`java
// ID
driver.findElement(By.id("username"));

// Name
driver.findElement(By.name("email"));

// Class Name
driver.findElement(By.className("login-btn"));

// CSS Selector
driver.findElement(By.cssSelector("#login > button"));
driver.findElement(By.cssSelector(".submit-button"));

// XPath
driver.findElement(By.xpath("//input[@id='username']"));
driver.findElement(By.xpath("//button[text()='Login']"));

// Link Text
driver.findElement(By.linkText("Forgot Password?"));
driver.findElement(By.partialLinkText("Forgot"));
\`\`\``,
          objectives: [
            'Set up Selenium WebDriver',
            'Write basic automated tests',
            'Use locator strategies'
          ],
          isFree: false
        },
        {
          title: 'Advanced Selenium Techniques',
          description: 'Handling dynamic elements, waits, and Page Object Model',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/tbVdNJLfq28',
          duration: 50,
          content: `# Advanced Selenium Techniques

## Waits
\`\`\`java
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;

// Implicit Wait
driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));

// Explicit Wait
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement element = wait.until(
    ExpectedConditions.presenceOfElementLocated(By.id("result"))
);

// Fluent Wait
Wait<WebDriver> fluentWait = new FluentWait<>(driver)
    .withTimeout(Duration.ofSeconds(30))
    .pollingEvery(Duration.ofSeconds(5))
    .ignoring(NoSuchElementException.class);
\`\`\`

## Handling Dynamic Elements
\`\`\`java
// Dropdowns
Select dropdown = new Select(driver.findElement(By.id("country")));
dropdown.selectByVisibleText("United States");
dropdown.selectByValue("US");
dropdown.selectByIndex(1);

// Alerts
driver.switchTo().alert().accept();  // Click OK
driver.switchTo().alert().dismiss();  // Click Cancel
String alertText = driver.switchTo().alert().getText();

// Frames
driver.switchTo().frame("frameName");
driver.switchTo().frame(0);  // By index
driver.switchTo().defaultContent();  // Back to main page

// Windows
String originalWindow = driver.getWindowHandle();
for (String windowHandle : driver.getWindowHandles()) {
    driver.switchTo().window(windowHandle);
}
\`\`\`

## Page Object Model
\`\`\`java
// LoginPage.java
public class LoginPage {
    WebDriver driver;

    @FindBy(id = "username")
    WebElement usernameField;

    @FindBy(id = "password")
    WebElement passwordField;

    @FindBy(id = "login")
    WebElement loginButton;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    public void login(String username, String password) {
        usernameField.sendKeys(username);
        passwordField.sendKeys(password);
        loginButton.click();
    }
}

// Test using POM
LoginPage loginPage = new LoginPage(driver);
loginPage.login("testuser", "password123");
\`\`\``,
          objectives: [
            'Implement waits properly',
            'Handle dynamic web elements',
            'Apply Page Object Model pattern'
          ],
          isFree: false
        },
        {
          title: 'TestNG Framework',
          description: 'Test organization, assertions, and reporting with TestNG',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/2iDAVZdJo8o',
          duration: 35,
          content: `# TestNG Framework

## Basic TestNG Test
\`\`\`java
import org.testng.annotations.*;
import org.testng.Assert;

public class LoginTests {
    WebDriver driver;

    @BeforeClass
    public void setup() {
        driver = new ChromeDriver();
    }

    @BeforeMethod
    public void openApp() {
        driver.get("https://example.com");
    }

    @Test(priority = 1)
    public void testValidLogin() {
        loginPage.login("validuser", "validpass");
        Assert.assertTrue(homePage.isDisplayed());
    }

    @Test(priority = 2, dependsOnMethods = {"testValidLogin"})
    public void testLogout() {
        homePage.logout();
        Assert.assertTrue(loginPage.isDisplayed());
    }

    @Test(enabled = false)
    public void skipThisTest() {
        // This test won't run
    }

    @AfterMethod
    public void clearData() {
        // Clean up after each test
    }

    @AfterClass
    public void tearDown() {
        driver.quit();
    }
}
\`\`\`

## Data-Driven Testing
\`\`\`java
@DataProvider(name = "loginData")
public Object[][] getLoginData() {
    return new Object[][] {
        {"user1", "pass1", true},
        {"user2", "wrongpass", false},
        {"invaliduser", "pass3", false}
    };
}

@Test(dataProvider = "loginData")
public void testLogin(String username, String password, boolean shouldPass) {
    loginPage.login(username, password);
    if (shouldPass) {
        Assert.assertTrue(homePage.isDisplayed());
    } else {
        Assert.assertTrue(loginPage.isErrorDisplayed());
    }
}
\`\`\`

## Assertions
\`\`\`java
// Common assertions
Assert.assertTrue(condition);
Assert.assertFalse(condition);
Assert.assertEquals(actual, expected);
Assert.assertNotEquals(actual, expected);
Assert.assertNull(object);
Assert.assertNotNull(object);

// Soft assertions (continue on failure)
SoftAssert softAssert = new SoftAssert();
softAssert.assertEquals(actual1, expected1);
softAssert.assertEquals(actual2, expected2);
softAssert.assertAll();  // Fails if any assertion failed
\`\`\``,
          objectives: [
            'Organize tests with TestNG',
            'Implement data-driven testing',
            'Use assertions effectively'
          ],
          isFree: false
        }
      ],
      // Month 3: Modern Testing with Cypress & JavaScript
      [
        {
          title: 'JavaScript for Testers',
          description: 'Essential JavaScript concepts for test automation',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
          duration: 35,
          content: `# JavaScript for Testers

## JavaScript Basics
\`\`\`javascript
// Variables
let username = "testuser";
const API_URL = "https://api.example.com";
var count = 0;  // Avoid using var

// Functions
function login(username, password) {
    return { username, loggedIn: true };
}

// Arrow functions
const logout = () => {
    console.log("User logged out");
};

// Async/Await
async function fetchData() {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
}
\`\`\`

## Arrays and Objects
\`\`\`javascript
// Arrays
const users = ["Alice", "Bob", "Charlie"];
users.push("David");
users.forEach(user => console.log(user));
const filtered = users.filter(user => user.length > 3);
const mapped = users.map(user => user.toUpperCase());

// Objects
const user = {
    name: "Alice",
    age: 30,
    email: "alice@example.com",
    login() {
        console.log(\`\${this.name} logged in\`);
    }
};

// Destructuring
const { name, email } = user;
const [first, second] = users;
\`\`\`

## Promises
\`\`\`javascript
// Creating promises
const promise = new Promise((resolve, reject) => {
    if (success) {
        resolve(data);
    } else {
        reject(error);
    }
});

// Using promises
promise
    .then(data => console.log(data))
    .catch(error => console.error(error))
    .finally(() => console.log("Done"));
\`\`\``,
          objectives: [
            'Write JavaScript for testing',
            'Work with async operations',
            'Use modern JS features'
          ],
          isFree: false
        },
        {
          title: 'Cypress Fundamentals',
          description: 'Getting started with Cypress for E2E testing',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/u8vMu7viCm8',
          duration: 45,
          content: `# Cypress Fundamentals

## Setup Cypress
\`\`\`bash
npm install cypress --save-dev
npx cypress open
\`\`\`

## Basic Cypress Test
\`\`\`javascript
describe('Login Tests', () => {
    beforeEach(() => {
        cy.visit('https://example.com/login');
    });

    it('should login with valid credentials', () => {
        cy.get('#username').type('testuser');
        cy.get('#password').type('password123');
        cy.get('#login-btn').click();

        cy.url().should('include', '/dashboard');
        cy.get('.welcome-message').should('be.visible');
    });

    it('should show error for invalid credentials', () => {
        cy.get('#username').type('invalid');
        cy.get('#password').type('wrong');
        cy.get('#login-btn').click();

        cy.get('.error-message')
            .should('be.visible')
            .and('contain', 'Invalid credentials');
    });
});
\`\`\`

## Cypress Commands
\`\`\`javascript
// Navigation
cy.visit('/products');
cy.go('back');
cy.reload();

// Querying
cy.get('.product-item');
cy.get('#submit-btn');
cy.contains('Add to Cart');
cy.get('[data-testid="product-card"]');

// Actions
cy.get('#input').type('text');
cy.get('#checkbox').check();
cy.get('#dropdown').select('option1');
cy.get('#button').click();
cy.get('#link').dblclick();

// Assertions
cy.get('#element').should('exist');
cy.get('#element').should('be.visible');
cy.get('#element').should('have.text', 'Hello');
cy.get('#element').should('have.class', 'active');
cy.get('#element').should('have.attr', 'href', '/link');
\`\`\`

## Custom Commands
\`\`\`javascript
// cypress/support/commands.js
Cypress.Commands.add('login', (username, password) => {
    cy.get('#username').type(username);
    cy.get('#password').type(password);
    cy.get('#login-btn').click();
});

// Using custom command
cy.login('testuser', 'password123');
\`\`\``,
          objectives: [
            'Write Cypress tests',
            'Use Cypress commands and assertions',
            'Create custom commands'
          ],
          isFree: false
        },
        {
          title: 'API Testing with Cypress',
          description: 'Testing REST APIs and mocking responses',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/LSe7eEY0bHo',
          duration: 40,
          content: `# API Testing with Cypress

## Basic API Testing
\`\`\`javascript
describe('API Tests', () => {
    it('should get all users', () => {
        cy.request('GET', 'https://api.example.com/users')
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.length.greaterThan(0);
                expect(response.body[0]).to.have.property('name');
            });
    });

    it('should create a new user', () => {
        cy.request({
            method: 'POST',
            url: 'https://api.example.com/users',
            body: {
                name: 'John Doe',
                email: 'john@example.com'
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('id');
            expect(response.body.name).to.eq('John Doe');
        });
    });

    it('should handle authentication', () => {
        cy.request({
            method: 'GET',
            url: 'https://api.example.com/protected',
            headers: {
                'Authorization': 'Bearer token123'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });
});
\`\`\`

## Fixtures and Mocking
\`\`\`javascript
// cypress/fixtures/users.json
{
    "users": [
        {"id": 1, "name": "Alice"},
        {"id": 2, "name": "Bob"}
    ]
}

// Using fixtures
describe('Mock API Tests', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/users', {
            fixture: 'users.json'
        }).as('getUsers');

        cy.visit('/users');
    });

    it('should display users from API', () => {
        cy.wait('@getUsers');
        cy.get('.user-item').should('have.length', 2);
        cy.contains('Alice').should('be.visible');
    });
});

// Dynamic mocking
cy.intercept('POST', '/api/users', (req) => {
    req.reply({
        statusCode: 201,
        body: { id: 3, ...req.body }
    });
});
\`\`\``,
          objectives: [
            'Test REST APIs with Cypress',
            'Use fixtures for test data',
            'Mock API responses'
          ],
          isFree: false
        }
      ],
      // Month 4: API Testing & Performance Testing
      [
        {
          title: 'API Testing with Postman',
          description: 'Testing REST APIs and automation with Postman',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/VywxIQ2ZXw4',
          duration: 40,
          content: `# API Testing with Postman

## Creating API Requests
**GET Request:**
- URL: https://api.example.com/users
- Headers: Authorization: Bearer token
- Expected: 200 OK, array of users

**POST Request:**
- URL: https://api.example.com/users
- Body (JSON):
\`\`\`json
{
    "name": "John Doe",
    "email": "john@example.com"
}
\`\`\`

## Tests in Postman
\`\`\`javascript
// Test status code
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test response time
pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// Test response body
pm.test("User created successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData.name).to.eql("John Doe");
});

// Set environment variable
pm.environment.set("userId", pm.response.json().id);
\`\`\`

## Collections and Environments
**Environment Variables:**
\`\`\`
baseUrl: https://api.example.com
apiKey: your-api-key
userId: (dynamic)
\`\`\`

**Using Variables:**
- URL: {{baseUrl}}/users/{{userId}}
- Header: Authorization: Bearer {{apiKey}}

## Newman (CLI Runner)
\`\`\`bash
# Install Newman
npm install -g newman

# Run collection
newman run collection.json -e environment.json

# Generate HTML report
newman run collection.json --reporters html
\`\`\``,
          objectives: [
            'Create and test API requests',
            'Write Postman test scripts',
            'Automate API tests with Newman'
          ],
          isFree: false
        },
        {
          title: 'Performance Testing with JMeter',
          description: 'Load testing and performance analysis',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/8FYqBXVz_14',
          duration: 45,
          content: `# Performance Testing with JMeter

## JMeter Test Plan Structure
\`\`\`
Test Plan
├── Thread Group (Virtual Users)
│   ├── HTTP Request Sampler
│   ├── Listeners (Results)
│   └── Assertions
└── Configuration Elements
\`\`\`

## Creating Load Test

### Thread Group Configuration
- Number of Threads: 100 (users)
- Ramp-Up Period: 10 seconds
- Loop Count: 10

### HTTP Request
- Protocol: https
- Server Name: api.example.com
- Path: /users
- Method: GET

## Types of Performance Tests

### Load Testing
Test system under expected load
- 100 concurrent users
- Duration: 1 hour
- Goal: Verify stable performance

### Stress Testing
Test system beyond normal load
- Start: 100 users
- Increase: +50 every 5 min
- Goal: Find breaking point

### Spike Testing
Sudden increase in load
- Normal: 50 users
- Spike: 500 users for 2 min
- Goal: Test recovery

### Endurance Testing
Sustained load over time
- 200 concurrent users
- Duration: 24 hours
- Goal: Find memory leaks

## Performance Metrics
\`\`\`
Response Time:
- Average: < 500ms
- 90th Percentile: < 1000ms
- 95th Percentile: < 1500ms

Throughput: > 100 requests/sec
Error Rate: < 1%
CPU Usage: < 80%
Memory Usage: < 85%
\`\`\``,
          objectives: [
            'Create JMeter test plans',
            'Perform different types of load tests',
            'Analyze performance metrics'
          ],
          isFree: false
        },
        {
          title: 'REST Assured Framework',
          description: 'Java-based API testing automation',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/4rK4PqrhH_s',
          duration: 35,
          content: `# REST Assured Framework

## Setup
\`\`\`xml
<dependency>
    <groupId>io.rest-assured</groupId>
    <artifactId>rest-assured</artifactId>
    <version>5.3.0</version>
</dependency>
\`\`\`

## Basic API Tests
\`\`\`java
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class APITests {
    @Test
    public void testGetUsers() {
        given()
            .baseUri("https://api.example.com")
        .when()
            .get("/users")
        .then()
            .statusCode(200)
            .body("size()", greaterThan(0))
            .body("[0].name", notNullValue());
    }

    @Test
    public void testCreateUser() {
        String requestBody = "{\\"name\\": \\"John\\", \\"email\\": \\"john@test.com\\"}";

        given()
            .contentType("application/json")
            .body(requestBody)
        .when()
            .post("/users")
        .then()
            .statusCode(201)
            .body("id", notNullValue())
            .body("name", equalTo("John"));
    }

    @Test
    public void testAuthentication() {
        given()
            .header("Authorization", "Bearer token123")
        .when()
            .get("/protected")
        .then()
            .statusCode(200);
    }
}
\`\`\`

## Response Validation
\`\`\`java
// Extract response
Response response = get("/users/1");
String name = response.path("name");
int age = response.path("age");

// JSON Path
given()
    .get("/users")
.then()
    .body("users[0].name", equalTo("Alice"))
    .body("users.size()", equalTo(5))
    .body("users.name", hasItem("Bob"));
\`\`\``,
          objectives: [
            'Write API tests with REST Assured',
            'Validate API responses',
            'Handle authentication'
          ],
          isFree: false
        }
      ],
      // Month 5: Advanced QA & DevOps Integration
      [
        {
          title: 'CI/CD Integration with Jenkins',
          description: 'Automating test execution in pipelines',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/pMO26j2OUME',
          duration: 40,
          content: `# CI/CD Integration with Jenkins

## Jenkins Pipeline for Testing
\`\`\`groovy
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/user/repo.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Unit Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Run Integration Tests') {
            steps {
                sh 'npm run test:integration'
            }
        }

        stage('Run E2E Tests') {
            steps {
                sh 'npm run test:e2e'
            }
        }

        stage('Generate Reports') {
            steps {
                publishHTML([
                    reportDir: 'test-results',
                    reportFiles: 'index.html',
                    reportName: 'Test Report'
                ])
            }
        }
    }

    post {
        always {
            junit 'test-results/*.xml'
        }
        failure {
            emailext (
                subject: "Build Failed",
                body: "Tests failed. Check console output.",
                to: "team@example.com"
            )
        }
    }
}
\`\`\`

## GitHub Actions
\`\`\`yaml
name: Test Automation

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'

    - name: Install dependencies
      run: npm install

    - name: Run tests
      run: npm test

    - name: Upload test results
      uses: actions/upload-artifact@v2
      with:
        name: test-results
        path: test-results/
\`\`\``,
          objectives: [
            'Create Jenkins pipelines for testing',
            'Integrate tests with CI/CD',
            'Set up automated reporting'
          ],
          isFree: false
        },
        {
          title: 'Mobile Testing Fundamentals',
          description: 'Testing Android and iOS applications',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/1B8ODbONEKA',
          duration: 35,
          content: `# Mobile Testing Fundamentals

## Types of Mobile Testing
- **Functional**: Features work correctly
- **Usability**: User-friendly interface
- **Performance**: Speed and responsiveness
- **Compatibility**: Different devices/OS versions
- **Security**: Data protection
- **Network**: Offline/poor connectivity

## Appium Setup
\`\`\`javascript
const { remote } = require('webdriverio');

const capabilities = {
    platformName: 'Android',
    'appium:deviceName': 'Pixel_5',
    'appium:app': '/path/to/app.apk',
    'appium:automationName': 'UiAutomator2'
};

const driver = await remote({
    hostname: 'localhost',
    port: 4723,
    capabilities
});

// Interact with app
await driver.$('~username').setValue('testuser');
await driver.$('~password').setValue('password');
await driver.$('~login-button').click();

await driver.deleteSession();
\`\`\`

## Mobile-Specific Test Cases
\`\`\`
- Orientation changes (portrait/landscape)
- Background/foreground transitions
- Interruptions (calls, notifications)
- Touch gestures (swipe, pinch, zoom)
- Different screen sizes
- Battery usage
- Network switches (WiFi to cellular)
\`\`\``,
          objectives: [
            'Understand mobile testing challenges',
            'Use Appium for automation',
            'Test mobile-specific scenarios'
          ],
          isFree: false
        },
        {
          title: 'Security Testing Basics',
          description: 'Common vulnerabilities and security testing',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/gkFnjTAt3vg',
          duration: 30,
          content: `# Security Testing Basics

## OWASP Top 10
1. **Broken Access Control**
2. **Cryptographic Failures**
3. **Injection**
4. **Insecure Design**
5. **Security Misconfiguration**
6. **Vulnerable Components**
7. **Authentication Failures**
8. **Data Integrity Failures**
9. **Logging Failures**
10. **SSRF**

## Common Security Tests

### SQL Injection
\`\`\`
Input: admin' OR '1'='1
Test: Does it bypass authentication?
\`\`\`

### XSS (Cross-Site Scripting)
\`\`\`
Input: <script>alert('XSS')</script>
Test: Is script executed?
\`\`\`

### CSRF
Test: Can actions be performed without token?

### Authentication
- Weak passwords allowed?
- Session timeout working?
- Logout properly clearing session?

## Security Testing Tools
- **OWASP ZAP**: Vulnerability scanner
- **Burp Suite**: Web security testing
- **Nikto**: Web server scanner
- **SQLMap**: SQL injection detection`,
          objectives: [
            'Identify security vulnerabilities',
            'Perform basic security tests',
            'Use security testing tools'
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

    console.log(`\n✅ Successfully populated Software Testing course!`);
    console.log(`Total modules: ${modules.length}`);
    console.log(`Total lessons: ${lessonsData.flat().length}`);
    console.log(`Total duration: ${totalDuration} minutes (${(totalDuration / 60).toFixed(1)} hours)`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

populateSoftwareTestingCourse();
