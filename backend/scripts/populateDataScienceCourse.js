import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../src/models/Course.js';
import Module from '../src/models/Module.js';
import Lesson from '../src/models/Lesson.js';
import User from '../src/models/User.js';

dotenv.config();

const populateDataScienceCourse = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB Connected');

    const course = await Course.findOne({ title: /Data Science/i });
    if (!course) {
      console.error('Data Science course not found!');
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
      // Month 1: Python Programming & Statistics Foundation
      [
        {
          title: 'Introduction to Data Science',
          description: 'Understanding data science, career paths, and the data science workflow',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/ua-CiDNNj30',
          duration: 30,
          content: `# Introduction to Data Science

## What is Data Science?
Data Science is an interdisciplinary field that uses scientific methods, processes, algorithms, and systems to extract knowledge and insights from structured and unstructured data.

## Data Science Lifecycle
1. **Problem Definition**: Understanding business objectives
2. **Data Collection**: Gathering relevant data
3. **Data Cleaning**: Handling missing values, outliers
4. **Exploratory Analysis**: Understanding patterns
5. **Feature Engineering**: Creating meaningful features
6. **Model Building**: Applying machine learning algorithms
7. **Model Evaluation**: Assessing performance
8. **Deployment**: Putting models into production
9. **Monitoring**: Tracking model performance

## Data Scientist vs Related Roles
| Role | Primary Focus |
|------|---------------|
| Data Scientist | Machine learning, predictive modeling |
| Data Analyst | Business insights, reporting |
| Data Engineer | Infrastructure, pipelines |
| ML Engineer | Model deployment, production |

## Required Skills
- **Programming**: Python, R, SQL
- **Statistics**: Probability, hypothesis testing
- **Machine Learning**: Algorithms, model evaluation
- **Data Visualization**: Matplotlib, Seaborn, Tableau
- **Domain Knowledge**: Understanding business context
- **Communication**: Presenting findings to stakeholders`,
          objectives: [
            'Understand the data science workflow',
            'Identify key data science skills',
            'Differentiate data science roles'
          ],
          isFree: true
        },
        {
          title: 'Python Fundamentals for Data Science',
          description: 'Essential Python programming concepts and data structures',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
          duration: 45,
          content: `# Python Fundamentals for Data Science

## Python Basics
\`\`\`python
# Variables and data types
name = "Alice"
age = 30
height = 5.6
is_student = False

# Lists
numbers = [1, 2, 3, 4, 5]
numbers.append(6)
numbers.extend([7, 8, 9])

# Dictionaries
person = {
    'name': 'Alice',
    'age': 30,
    'city': 'New York'
}

# Control flow
if age >= 18:
    print("Adult")
else:
    print("Minor")

# Loops
for num in numbers:
    print(num * 2)

# List comprehension
squares = [x**2 for x in range(10)]
\`\`\`

## Functions
\`\`\`python
def calculate_mean(numbers):
    """Calculate the mean of a list of numbers."""
    return sum(numbers) / len(numbers)

def greet(name, greeting="Hello"):
    """Greet someone with optional custom greeting."""
    return f"{greeting}, {name}!"

# Lambda functions
square = lambda x: x**2
\`\`\`

## Working with Files
\`\`\`python
# Reading files
with open('data.txt', 'r') as f:
    content = f.read()
    lines = f.readlines()

# Writing files
with open('output.txt', 'w') as f:
    f.write("Hello, World!")

# JSON handling
import json
data = {'name': 'Alice', 'age': 30}
json_string = json.dumps(data)
parsed_data = json.loads(json_string)
\`\`\``,
          objectives: [
            'Write Python code with proper syntax',
            'Use data structures effectively',
            'Create functions and handle files'
          ],
          isFree: true
        },
        {
          title: 'NumPy for Numerical Computing',
          description: 'Array operations and numerical computations with NumPy',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/QUT1VHiLmmI',
          duration: 40,
          content: `# NumPy for Numerical Computing

## Creating Arrays
\`\`\`python
import numpy as np

# 1D array
arr1d = np.array([1, 2, 3, 4, 5])

# 2D array
arr2d = np.array([[1, 2, 3], [4, 5, 6]])

# Special arrays
zeros = np.zeros((3, 4))
ones = np.ones((2, 3))
identity = np.eye(3)
random_arr = np.random.rand(3, 4)
arange = np.arange(0, 10, 2)  # [0, 2, 4, 6, 8]
linspace = np.linspace(0, 1, 5)  # 5 evenly spaced values
\`\`\`

## Array Operations
\`\`\`python
a = np.array([1, 2, 3, 4, 5])
b = np.array([10, 20, 30, 40, 50])

# Element-wise operations
print(a + b)  # [11, 22, 33, 44, 55]
print(a * 2)  # [2, 4, 6, 8, 10]
print(a ** 2)  # [1, 4, 9, 16, 25]

# Mathematical functions
print(np.sqrt(a))
print(np.exp(a))
print(np.log(a))
print(np.sin(a))

# Statistical operations
print(np.mean(a))
print(np.median(a))
print(np.std(a))
print(np.var(a))
\`\`\`

## Array Indexing and Slicing
\`\`\`python
arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

# Indexing
print(arr[0, 0])  # 1
print(arr[1, 2])  # 6

# Slicing
print(arr[:2, :2])  # First 2 rows and columns
print(arr[1:, 1:])  # Subset excluding first row/column

# Boolean indexing
print(arr[arr > 5])  # [6, 7, 8, 9]
\`\`\`

## Broadcasting
\`\`\`python
# Adding scalar to array
arr + 10

# Matrix operations
matrix = np.array([[1, 2], [3, 4]])
vector = np.array([10, 20])
result = matrix + vector  # Broadcasts vector to each row
\`\`\``,
          objectives: [
            'Create and manipulate NumPy arrays',
            'Perform vectorized operations',
            'Apply statistical functions'
          ],
          isFree: false
        }
      ],
      // Month 2: Data Visualization & Exploratory Analysis
      [
        {
          title: 'Pandas for Data Manipulation',
          description: 'Working with DataFrames and Series in Pandas',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg',
          duration: 50,
          content: `# Pandas for Data Manipulation

## Creating DataFrames
\`\`\`python
import pandas as pd

# From dictionary
data = {
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 30, 35],
    'city': ['New York', 'San Francisco', 'Los Angeles']
}
df = pd.DataFrame(data)

# From CSV
df = pd.read_csv('data.csv')

# From Excel
df = pd.read_excel('data.xlsx', sheet_name='Sheet1')
\`\`\`

## Data Selection
\`\`\`python
# Select column
ages = df['age']

# Select multiple columns
subset = df[['name', 'age']]

# Select rows by index
first_row = df.iloc[0]
first_three = df.iloc[:3]

# Select by condition
adults = df[df['age'] >= 18]
new_yorkers = df[df['city'] == 'New York']
\`\`\`

## Data Cleaning
\`\`\`python
# Handle missing values
df.isnull().sum()
df.dropna()  # Drop rows with missing values
df.fillna(0)  # Fill missing values with 0
df['age'].fillna(df['age'].mean())  # Fill with mean

# Remove duplicates
df.drop_duplicates()

# Data type conversion
df['age'] = df['age'].astype(int)
df['date'] = pd.to_datetime(df['date'])
\`\`\`

## Data Transformation
\`\`\`python
# GroupBy operations
df.groupby('city')['age'].mean()
df.groupby(['city', 'gender']).agg({
    'age': 'mean',
    'salary': ['min', 'max', 'mean']
})

# Merge DataFrames
merged = pd.merge(df1, df2, on='id', how='inner')

# Concatenate
combined = pd.concat([df1, df2], axis=0)

# Apply functions
df['age_squared'] = df['age'].apply(lambda x: x**2)
\`\`\``,
          objectives: [
            'Create and manipulate Pandas DataFrames',
            'Clean and transform data',
            'Perform groupby and merge operations'
          ],
          isFree: false
        },
        {
          title: 'Data Visualization with Matplotlib',
          description: 'Creating plots and charts with Matplotlib',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/3Xc3CA655Y4',
          duration: 35,
          content: `# Data Visualization with Matplotlib

## Basic Plots
\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

# Line plot
x = np.linspace(0, 10, 100)
y = np.sin(x)
plt.plot(x, y)
plt.title('Sine Wave')
plt.xlabel('x')
plt.ylabel('sin(x)')
plt.grid(True)
plt.show()

# Scatter plot
plt.scatter(x, y, alpha=0.5)
plt.show()

# Bar plot
categories = ['A', 'B', 'C', 'D']
values = [25, 40, 30, 55]
plt.bar(categories, values)
plt.show()

# Histogram
data = np.random.randn(1000)
plt.hist(data, bins=30, edgecolor='black')
plt.show()
\`\`\`

## Subplots
\`\`\`python
fig, axes = plt.subplots(2, 2, figsize=(12, 8))

# Plot 1
axes[0, 0].plot(x, np.sin(x))
axes[0, 0].set_title('Sine')

# Plot 2
axes[0, 1].plot(x, np.cos(x))
axes[0, 1].set_title('Cosine')

# Plot 3
axes[1, 0].scatter(x, np.random.rand(len(x)))
axes[1, 0].set_title('Random Scatter')

# Plot 4
axes[1, 1].hist(np.random.randn(1000), bins=20)
axes[1, 1].set_title('Histogram')

plt.tight_layout()
plt.show()
\`\`\`

## Customization
\`\`\`python
plt.figure(figsize=(10, 6))
plt.plot(x, y, color='red', linewidth=2, linestyle='--', label='Sine')
plt.plot(x, np.cos(x), color='blue', linewidth=2, label='Cosine')
plt.title('Trigonometric Functions', fontsize=16)
plt.xlabel('x', fontsize=12)
plt.ylabel('y', fontsize=12)
plt.legend(loc='upper right')
plt.grid(True, alpha=0.3)
plt.show()
\`\`\``,
          objectives: [
            'Create various types of plots',
            'Customize visualizations',
            'Create multi-panel figures'
          ],
          isFree: false
        },
        {
          title: 'Advanced Visualization with Seaborn',
          description: 'Statistical visualizations and attractive plots',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/6GUZXDef2U0',
          duration: 40,
          content: `# Advanced Visualization with Seaborn

## Seaborn Basics
\`\`\`python
import seaborn as sns
import pandas as pd

# Load sample dataset
tips = sns.load_dataset('tips')

# Set style
sns.set_style('whitegrid')
sns.set_palette('husl')

# Distribution plots
sns.histplot(tips['total_bill'], kde=True)
plt.show()

# Box plot
sns.boxplot(x='day', y='total_bill', data=tips)
plt.show()

# Violin plot
sns.violinplot(x='day', y='total_bill', data=tips)
plt.show()
\`\`\`

## Relationship Plots
\`\`\`python
# Scatter plot with regression line
sns.regplot(x='total_bill', y='tip', data=tips)
plt.show()

# Pair plot
iris = sns.load_dataset('iris')
sns.pairplot(iris, hue='species')
plt.show()

# Heatmap
corr = tips.corr()
sns.heatmap(corr, annot=True, cmap='coolwarm')
plt.show()
\`\`\`

## Categorical Plots
\`\`\`python
# Count plot
sns.countplot(x='day', data=tips)
plt.show()

# Bar plot with error bars
sns.barplot(x='day', y='total_bill', data=tips)
plt.show()

# Point plot
sns.pointplot(x='day', y='total_bill', hue='sex', data=tips)
plt.show()
\`\`\`

## Complex Visualizations
\`\`\`python
# FacetGrid
g = sns.FacetGrid(tips, col='time', row='smoker')
g.map(sns.scatterplot, 'total_bill', 'tip')
plt.show()

# Joint plot
sns.jointplot(x='total_bill', y='tip', data=tips, kind='hex')
plt.show()
\`\`\``,
          objectives: [
            'Create statistical visualizations',
            'Use Seaborn for attractive plots',
            'Generate complex multi-panel figures'
          ],
          isFree: false
        }
      ],
      // Month 3: Machine Learning Fundamentals
      [
        {
          title: 'Introduction to Machine Learning',
          description: 'ML concepts, types of learning, and the ML workflow',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU',
          duration: 30,
          content: `# Introduction to Machine Learning

## What is Machine Learning?
Machine Learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed.

## Types of Machine Learning
### Supervised Learning
- **Classification**: Predicting categories (spam/not spam, disease/no disease)
- **Regression**: Predicting continuous values (house prices, stock prices)

### Unsupervised Learning
- **Clustering**: Grouping similar data points (customer segmentation)
- **Dimensionality Reduction**: Reducing features (PCA, t-SNE)

### Reinforcement Learning
- Learning through rewards and penalties (game playing, robotics)

## ML Workflow
\`\`\`python
# 1. Import libraries
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# 2. Load and prepare data
X = df[['feature1', 'feature2', 'feature3']]
y = df['target']

# 3. Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 4. Train model
model = LinearRegression()
model.fit(X_train, y_train)

# 5. Make predictions
y_pred = model.predict(X_test)

# 6. Evaluate
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f"MSE: {mse}, R²: {r2}")
\`\`\`

## Key Concepts
- **Features (X)**: Input variables
- **Target (y)**: Output variable to predict
- **Training Set**: Data used to train the model
- **Test Set**: Data used to evaluate the model
- **Overfitting**: Model performs well on training but poorly on new data
- **Underfitting**: Model is too simple to capture patterns`,
          objectives: [
            'Understand ML types and concepts',
            'Implement basic ML workflow',
            'Evaluate model performance'
          ],
          isFree: false
        },
        {
          title: 'Linear and Logistic Regression',
          description: 'Fundamental regression algorithms for prediction',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/7ArmBVF2dCs',
          duration: 45,
          content: `# Linear and Logistic Regression

## Linear Regression
\`\`\`python
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

# Create sample data
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 5, 4, 5])

# Train model
model = LinearRegression()
model.fit(X, y)

# Get coefficients
print(f"Coefficient: {model.coef_}")
print(f"Intercept: {model.intercept_}")

# Predict
X_new = np.array([[6]])
y_pred = model.predict(X_new)
print(f"Prediction for x=6: {y_pred}")

# Evaluate
y_pred_all = model.predict(X)
mse = mean_squared_error(y, y_pred_all)
r2 = r2_score(y, y_pred_all)
print(f"MSE: {mse:.2f}, R²: {r2:.2f}")
\`\`\`

## Multiple Linear Regression
\`\`\`python
# Multiple features
X = df[['size_sqft', 'bedrooms', 'bathrooms', 'age']]
y = df['price']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = LinearRegression()
model.fit(X_train, y_train)

# Feature importance
for feature, coef in zip(X.columns, model.coef_):
    print(f"{feature}: {coef}")
\`\`\`

## Logistic Regression
\`\`\`python
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# Binary classification
X = df[['feature1', 'feature2']]
y = df['class']  # 0 or 1

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = LogisticRegression()
model.fit(X_train, y_train)

# Predict
y_pred = model.predict(X_test)
y_proba = model.predict_proba(X_test)[:, 1]  # Probability of class 1

# Evaluate
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.2f}")
print("\\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))
print("\\nClassification Report:")
print(classification_report(y_test, y_pred))
\`\`\``,
          objectives: [
            'Implement linear regression',
            'Apply logistic regression for classification',
            'Evaluate regression and classification models'
          ],
          isFree: false
        },
        {
          title: 'Decision Trees and Random Forests',
          description: 'Tree-based algorithms for classification and regression',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/PHxYNGo8NcI',
          duration: 40,
          content: `# Decision Trees and Random Forests

## Decision Trees
\`\`\`python
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt

# Train decision tree
clf = DecisionTreeClassifier(max_depth=3, random_state=42)
clf.fit(X_train, y_train)

# Visualize tree
plt.figure(figsize=(15, 10))
plot_tree(clf, feature_names=X.columns, class_names=['0', '1'], filled=True)
plt.show()

# Predictions
y_pred = clf.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.2f}")

# Feature importance
for feature, importance in zip(X.columns, clf.feature_importances_):
    print(f"{feature}: {importance:.4f}")
\`\`\`

## Random Forest
\`\`\`python
from sklearn.ensemble import RandomForestClassifier

# Train random forest
rf = RandomForestClassifier(
    n_estimators=100,
    max_depth=5,
    min_samples_split=10,
    random_state=42
)
rf.fit(X_train, y_train)

# Predictions
y_pred = rf.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.2f}")

# Feature importance
importance_df = pd.DataFrame({
    'feature': X.columns,
    'importance': rf.feature_importances_
}).sort_values('importance', ascending=False)
print(importance_df)
\`\`\`

## Hyperparameter Tuning
\`\`\`python
from sklearn.model_selection import GridSearchCV

param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [3, 5, 7, None],
    'min_samples_split': [2, 5, 10]
}

grid_search = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid,
    cv=5,
    scoring='accuracy'
)
grid_search.fit(X_train, y_train)

print(f"Best parameters: {grid_search.best_params_}")
print(f"Best score: {grid_search.best_score_:.2f}")

# Use best model
best_model = grid_search.best_estimator_
\`\`\``,
          objectives: [
            'Build decision tree models',
            'Implement random forests',
            'Tune hyperparameters with grid search'
          ],
          isFree: false
        }
      ],
      // Month 4: Advanced Machine Learning
      [
        {
          title: 'Gradient Boosting Algorithms',
          description: 'XGBoost, LightGBM, and CatBoost for powerful predictions',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/OtD8wVaFm6E',
          duration: 45,
          content: `# Gradient Boosting Algorithms

## XGBoost
\`\`\`python
import xgboost as xgb
from sklearn.metrics import accuracy_score, roc_auc_score

# Create DMatrix (XGBoost's data structure)
dtrain = xgb.DMatrix(X_train, label=y_train)
dtest = xgb.DMatrix(X_test, label=y_test)

# Set parameters
params = {
    'max_depth': 6,
    'eta': 0.3,
    'objective': 'binary:logistic',
    'eval_metric': 'auc'
}

# Train model
model = xgb.train(
    params,
    dtrain,
    num_boost_round=100,
    evals=[(dtrain, 'train'), (dtest, 'test')],
    early_stopping_rounds=10
)

# Predictions
y_pred_proba = model.predict(dtest)
y_pred = (y_pred_proba > 0.5).astype(int)

# Evaluate
accuracy = accuracy_score(y_test, y_pred)
auc = roc_auc_score(y_test, y_pred_proba)
print(f"Accuracy: {accuracy:.4f}, AUC: {auc:.4f}")

# Feature importance
xgb.plot_importance(model)
plt.show()
\`\`\`

## LightGBM
\`\`\`python
import lightgbm as lgb

# Create dataset
train_data = lgb.Dataset(X_train, label=y_train)
test_data = lgb.Dataset(X_test, label=y_test, reference=train_data)

# Parameters
params = {
    'objective': 'binary',
    'metric': 'auc',
    'num_leaves': 31,
    'learning_rate': 0.05,
    'feature_fraction': 0.9
}

# Train
model = lgb.train(
    params,
    train_data,
    num_boost_round=100,
    valid_sets=[train_data, test_data],
    early_stopping_rounds=10
)

# Predictions
y_pred_proba = model.predict(X_test)
y_pred = (y_pred_proba > 0.5).astype(int)
\`\`\`

## CatBoost
\`\`\`python
from catboost import CatBoostClassifier

# Initialize model
model = CatBoostClassifier(
    iterations=100,
    learning_rate=0.1,
    depth=6,
    verbose=10
)

# Train (handles categorical features automatically)
model.fit(
    X_train, y_train,
    eval_set=(X_test, y_test),
    early_stopping_rounds=10
)

# Predictions
y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)[:, 1]
\`\`\``,
          objectives: [
            'Implement XGBoost models',
            'Use LightGBM for faster training',
            'Apply CatBoost for categorical data'
          ],
          isFree: false
        },
        {
          title: 'Feature Engineering and Selection',
          description: 'Creating and selecting features for better models',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/6WDFfaYtN6s',
          duration: 40,
          content: `# Feature Engineering and Selection

## Creating New Features
\`\`\`python
import pandas as pd
import numpy as np

# Mathematical transformations
df['log_price'] = np.log1p(df['price'])
df['sqrt_area'] = np.sqrt(df['area'])
df['price_per_sqft'] = df['price'] / df['sqft']

# Interaction features
df['bed_bath_ratio'] = df['bedrooms'] / df['bathrooms']
df['total_rooms'] = df['bedrooms'] + df['bathrooms']

# Polynomial features
from sklearn.preprocessing import PolynomialFeatures
poly = PolynomialFeatures(degree=2, include_bias=False)
X_poly = poly.fit_transform(df[['feature1', 'feature2']])

# Binning
df['age_group'] = pd.cut(df['age'], bins=[0, 18, 35, 50, 100],
                          labels=['Young', 'Adult', 'Middle', 'Senior'])

# Date features
df['year'] = pd.to_datetime(df['date']).dt.year
df['month'] = pd.to_datetime(df['date']).dt.month
df['dayofweek'] = pd.to_datetime(df['date']).dt.dayofweek
df['is_weekend'] = df['dayofweek'].isin([5, 6]).astype(int)
\`\`\`

## Encoding Categorical Variables
\`\`\`python
# One-hot encoding
df_encoded = pd.get_dummies(df, columns=['category'], prefix='cat')

# Label encoding
from sklearn.preprocessing import LabelEncoder
le = LabelEncoder()
df['category_encoded'] = le.fit_transform(df['category'])

# Target encoding
category_means = df.groupby('category')['target'].mean()
df['category_target_enc'] = df['category'].map(category_means)
\`\`\`

## Feature Selection
\`\`\`python
# Correlation-based selection
corr_matrix = df.corr()
high_corr = corr_matrix['target'].abs().sort_values(ascending=False)
top_features = high_corr[high_corr > 0.5].index.tolist()

# SelectKBest
from sklearn.feature_selection import SelectKBest, f_classif
selector = SelectKBest(f_classif, k=10)
X_selected = selector.fit_transform(X, y)
selected_features = X.columns[selector.get_support()].tolist()

# Recursive Feature Elimination
from sklearn.feature_selection import RFE
from sklearn.ensemble import RandomForestClassifier
estimator = RandomForestClassifier(n_estimators=100)
rfe = RFE(estimator, n_features_to_select=10)
rfe.fit(X, y)
selected_features = X.columns[rfe.support_].tolist()
\`\`\``,
          objectives: [
            'Create meaningful features',
            'Encode categorical variables',
            'Select important features'
          ],
          isFree: false
        },
        {
          title: 'Handling Imbalanced Data',
          description: 'Techniques for dealing with class imbalance',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/JnlM4yLFNuo',
          duration: 35,
          content: `# Handling Imbalanced Data

## Identifying Imbalance
\`\`\`python
# Check class distribution
print(y.value_counts())
print(y.value_counts(normalize=True))
\`\`\`

## Resampling Techniques
\`\`\`python
from imblearn.over_sampling import SMOTE, RandomOverSampler
from imblearn.under_sampling import RandomUnderSampler
from imblearn.combine import SMOTETomek

# Random oversampling
ros = RandomOverSampler(random_state=42)
X_resampled, y_resampled = ros.fit_resample(X_train, y_train)

# Random undersampling
rus = RandomUnderSampler(random_state=42)
X_resampled, y_resampled = rus.fit_resample(X_train, y_train)

# SMOTE (Synthetic Minority Over-sampling)
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_train, y_train)

# Combined approach
smote_tomek = SMOTETomek(random_state=42)
X_resampled, y_resampled = smote_tomek.fit_resample(X_train, y_train)
\`\`\`

## Class Weights
\`\`\`python
from sklearn.ensemble import RandomForestClassifier

# Balanced class weights
model = RandomForestClassifier(class_weight='balanced')
model.fit(X_train, y_train)

# Custom class weights
from sklearn.utils.class_weight import compute_class_weight
class_weights = compute_class_weight('balanced',
                                     classes=np.unique(y_train),
                                     y=y_train)
class_weight_dict = dict(enumerate(class_weights))
\`\`\`

## Evaluation Metrics for Imbalanced Data
\`\`\`python
from sklearn.metrics import (precision_score, recall_score, f1_score,
                             roc_auc_score, average_precision_score,
                             confusion_matrix, classification_report)

y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)[:, 1]

# Precision, Recall, F1
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)

# ROC-AUC
roc_auc = roc_auc_score(y_test, y_pred_proba)

# PR-AUC (better for imbalanced data)
pr_auc = average_precision_score(y_test, y_pred_proba)

print(f"Precision: {precision:.4f}")
print(f"Recall: {recall:.4f}")
print(f"F1: {f1:.4f}")
print(f"ROC-AUC: {roc_auc:.4f}")
print(f"PR-AUC: {pr_auc:.4f}")
\`\`\``,
          objectives: [
            'Apply resampling techniques',
            'Use class weights',
            'Evaluate imbalanced datasets properly'
          ],
          isFree: false
        }
      ],
      // Month 5: Deep Learning & Neural Networks
      [
        {
          title: 'Neural Networks Fundamentals',
          description: 'Understanding neural network architecture and backpropagation',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
          duration: 40,
          content: `# Neural Networks Fundamentals

## Neural Network Architecture
\`\`\`
Input Layer → Hidden Layers → Output Layer

Neuron: y = activation(w₁x₁ + w₂x₂ + ... + wₙxₙ + b)
\`\`\`

## Activation Functions
\`\`\`python
import numpy as np

# ReLU (Rectified Linear Unit)
def relu(x):
    return np.maximum(0, x)

# Sigmoid
def sigmoid(x):
    return 1 / (1 + np.exp(-x))

# Tanh
def tanh(x):
    return np.tanh(x)

# Softmax (for multi-class output)
def softmax(x):
    exp_x = np.exp(x - np.max(x))
    return exp_x / exp_x.sum(axis=0)
\`\`\`

## Building Neural Networks with TensorFlow/Keras
\`\`\`python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# Sequential model
model = keras.Sequential([
    layers.Dense(64, activation='relu', input_shape=(input_dim,)),
    layers.Dropout(0.3),
    layers.Dense(32, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(1, activation='sigmoid')
])

# Compile model
model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# Train model
history = model.fit(
    X_train, y_train,
    epochs=50,
    batch_size=32,
    validation_split=0.2,
    verbose=1
)

# Evaluate
loss, accuracy = model.evaluate(X_test, y_test)
print(f"Test accuracy: {accuracy:.4f}")

# Predictions
y_pred = model.predict(X_test)
\`\`\`

## Monitoring Training
\`\`\`python
import matplotlib.pyplot as plt

# Plot training history
plt.figure(figsize=(12, 4))

plt.subplot(1, 2, 1)
plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.title('Model Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.title('Model Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()

plt.tight_layout()
plt.show()
\`\`\``,
          objectives: [
            'Understand neural network components',
            'Build neural networks with Keras',
            'Train and evaluate deep learning models'
          ],
          isFree: false
        },
        {
          title: 'Convolutional Neural Networks (CNNs)',
          description: 'Image classification with deep learning',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/FmpDIaiMIeA',
          duration: 45,
          content: `# Convolutional Neural Networks (CNNs)

## CNN Architecture
\`\`\`
Input Image → Conv2D → Pooling → Conv2D → Pooling → Flatten → Dense → Output
\`\`\`

## Building a CNN
\`\`\`python
from tensorflow.keras import layers, models

model = models.Sequential([
    # First convolutional block
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
    layers.MaxPooling2D((2, 2)),

    # Second convolutional block
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),

    # Third convolutional block
    layers.Conv2D(64, (3, 3), activation='relu'),

    # Flatten and dense layers
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(10, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)
\`\`\`

## Image Data Augmentation
\`\`\`python
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Create data augmentation generator
datagen = ImageDataGenerator(
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
    zoom_range=0.2,
    fill_mode='nearest'
)

# Train with augmented data
history = model.fit(
    datagen.flow(X_train, y_train, batch_size=32),
    epochs=50,
    validation_data=(X_test, y_test)
)
\`\`\`

## Transfer Learning
\`\`\`python
from tensorflow.keras.applications import VGG16

# Load pre-trained model
base_model = VGG16(
    weights='imagenet',
    include_top=False,
    input_shape=(224, 224, 3)
)

# Freeze base model layers
base_model.trainable = False

# Add custom classification head
model = models.Sequential([
    base_model,
    layers.Flatten(),
    layers.Dense(256, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(num_classes, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)
\`\`\``,
          objectives: [
            'Build CNN architectures',
            'Apply data augmentation',
            'Use transfer learning for image classification'
          ],
          isFree: false
        },
        {
          title: 'Recurrent Neural Networks (RNNs)',
          description: 'Sequence modeling with LSTM and GRU',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/WCUNPb-5EYI',
          duration: 40,
          content: `# Recurrent Neural Networks (RNNs)

## Simple RNN
\`\`\`python
from tensorflow.keras import layers, models

model = models.Sequential([
    layers.SimpleRNN(64, return_sequences=True, input_shape=(timesteps, features)),
    layers.SimpleRNN(64),
    layers.Dense(1)
])

model.compile(optimizer='adam', loss='mse')
\`\`\`

## LSTM (Long Short-Term Memory)
\`\`\`python
model = models.Sequential([
    layers.LSTM(64, return_sequences=True, input_shape=(timesteps, features)),
    layers.Dropout(0.2),
    layers.LSTM(32),
    layers.Dropout(0.2),
    layers.Dense(1)
])

model.compile(
    optimizer='adam',
    loss='mse',
    metrics=['mae']
)

history = model.fit(
    X_train, y_train,
    epochs=50,
    batch_size=32,
    validation_split=0.2
)
\`\`\`

## GRU (Gated Recurrent Unit)
\`\`\`python
model = models.Sequential([
    layers.GRU(64, return_sequences=True, input_shape=(timesteps, features)),
    layers.Dropout(0.2),
    layers.GRU(32),
    layers.Dropout(0.2),
    layers.Dense(1)
])

model.compile(optimizer='adam', loss='mse')
\`\`\`

## Bidirectional RNN
\`\`\`python
from tensorflow.keras.layers import Bidirectional

model = models.Sequential([
    Bidirectional(layers.LSTM(64, return_sequences=True),
                  input_shape=(timesteps, features)),
    Bidirectional(layers.LSTM(32)),
    layers.Dense(1)
])
\`\`\`

## Time Series Prediction Example
\`\`\`python
import numpy as np
import pandas as pd

# Prepare sequence data
def create_sequences(data, seq_length):
    X, y = [], []
    for i in range(len(data) - seq_length):
        X.append(data[i:i+seq_length])
        y.append(data[i+seq_length])
    return np.array(X), np.array(y)

# Create sequences
seq_length = 30
X, y = create_sequences(time_series_data, seq_length)

# Reshape for LSTM [samples, timesteps, features]
X = X.reshape((X.shape[0], X.shape[1], 1))

# Split data
split = int(0.8 * len(X))
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

# Train model
model.fit(X_train, y_train, epochs=50, batch_size=32)

# Predictions
predictions = model.predict(X_test)
\`\`\``,
          objectives: [
            'Build RNN and LSTM networks',
            'Apply RNNs to sequence data',
            'Predict time series with deep learning'
          ],
          isFree: false
        }
      ],
      // Month 6: Natural Language Processing (NLP)
      [
        {
          title: 'Text Preprocessing and Feature Extraction',
          description: 'Preparing text data for NLP tasks',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/fNxaJsNG3-s',
          duration: 35,
          content: `# Text Preprocessing and Feature Extraction

## Text Cleaning
\`\`\`python
import re
import string
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer, WordNetLemmatizer

def clean_text(text):
    # Lowercase
    text = text.lower()

    # Remove URLs
    text = re.sub(r'http\\S+|www\\S+|https\\S+', '', text)

    # Remove mentions and hashtags
    text = re.sub(r'@\\w+|#\\w+', '', text)

    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))

    # Remove numbers
    text = re.sub(r'\\d+', '', text)

    # Remove extra whitespace
    text = ' '.join(text.split())

    return text

# Tokenization
tokens = word_tokenize(cleaned_text)

# Remove stopwords
stop_words = set(stopwords.words('english'))
filtered_tokens = [w for w in tokens if w not in stop_words]

# Stemming
stemmer = PorterStemmer()
stemmed = [stemmer.stem(w) for w in filtered_tokens]

# Lemmatization
lemmatizer = WordNetLemmatizer()
lemmatized = [lemmatizer.lemmatize(w) for w in filtered_tokens]
\`\`\`

## TF-IDF Vectorization
\`\`\`python
from sklearn.feature_extraction.text import TfidfVectorizer

vectorizer = TfidfVectorizer(
    max_features=5000,
    ngram_range=(1, 2),
    min_df=2,
    max_df=0.8
)

# Fit and transform
X_tfidf = vectorizer.fit_transform(documents)

# Get feature names
feature_names = vectorizer.get_feature_names_out()
\`\`\`

## Word Embeddings
\`\`\`python
from gensim.models import Word2Vec

# Train Word2Vec
sentences = [text.split() for text in documents]
model = Word2Vec(
    sentences,
    vector_size=100,
    window=5,
    min_count=2,
    workers=4
)

# Get word vector
vector = model.wv['python']

# Find similar words
similar = model.wv.most_similar('python', topn=10)
\`\`\``,
          objectives: [
            'Clean and preprocess text data',
            'Create TF-IDF features',
            'Use word embeddings'
          ],
          isFree: false
        },
        {
          title: 'Sentiment Analysis',
          description: 'Building sentiment classification models',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/M7SWr5xObkA',
          duration: 40,
          content: `# Sentiment Analysis

## Traditional ML Approach
\`\`\`python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Prepare data
X = df['text']
y = df['sentiment']  # 0: negative, 1: positive

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Vectorize
vectorizer = TfidfVectorizer(max_features=5000)
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

# Train model
model = LogisticRegression()
model.fit(X_train_tfidf, y_train)

# Predictions
y_pred = model.predict(X_test_tfidf)
print(classification_report(y_test, y_pred))
\`\`\`

## Deep Learning Approach with LSTM
\`\`\`python
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras import layers, models

# Tokenization
max_words = 10000
max_len = 200

tokenizer = Tokenizer(num_words=max_words)
tokenizer.fit_on_texts(X_train)

# Convert to sequences
X_train_seq = tokenizer.texts_to_sequences(X_train)
X_test_seq = tokenizer.texts_to_sequences(X_test)

# Padding
X_train_pad = pad_sequences(X_train_seq, maxlen=max_len)
X_test_pad = pad_sequences(X_test_seq, maxlen=max_len)

# Build model
model = models.Sequential([
    layers.Embedding(max_words, 128, input_length=max_len),
    layers.LSTM(64, dropout=0.2, recurrent_dropout=0.2),
    layers.Dense(1, activation='sigmoid')
])

model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# Train
history = model.fit(
    X_train_pad, y_train,
    epochs=10,
    batch_size=32,
    validation_split=0.2
)
\`\`\`

## Using Pre-trained Models (BERT)
\`\`\`python
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers import pipeline

# Load pre-trained model
model_name = "distilbert-base-uncased-finetuned-sst-2-english"
sentiment_pipeline = pipeline("sentiment-analysis", model=model_name)

# Analyze sentiment
texts = [
    "I love this product! It's amazing!",
    "This is terrible. Waste of money."
]

results = sentiment_pipeline(texts)
for text, result in zip(texts, results):
    print(f"Text: {text}")
    print(f"Sentiment: {result['label']}, Score: {result['score']:.4f}\\n")
\`\`\``,
          objectives: [
            'Build sentiment analysis models',
            'Use LSTM for text classification',
            'Apply pre-trained models'
          ],
          isFree: false
        },
        {
          title: 'Named Entity Recognition and Topic Modeling',
          description: 'Extracting entities and discovering topics',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/TbrlRei_0h8',
          duration: 35,
          content: `# Named Entity Recognition and Topic Modeling

## Named Entity Recognition with spaCy
\`\`\`python
import spacy

# Load model
nlp = spacy.load("en_core_web_sm")

# Process text
text = "Apple Inc. was founded by Steve Jobs in Cupertino, California."
doc = nlp(text)

# Extract entities
for ent in doc.ents:
    print(f"{ent.text} ({ent.label_})")

# Output:
# Apple Inc. (ORG)
# Steve Jobs (PERSON)
# Cupertino (GPE)
# California (GPE)

# Visualize entities
from spacy import displacy
displacy.render(doc, style="ent", jupyter=True)
\`\`\`

## Custom NER Training
\`\`\`python
import spacy
from spacy.training import Example

# Create blank model
nlp = spacy.blank("en")
ner = nlp.add_pipe("ner")

# Add labels
ner.add_label("PRODUCT")
ner.add_label("BRAND")

# Training data
TRAIN_DATA = [
    ("I bought iPhone 13 from Apple Store",
     {"entities": [(9, 18, "PRODUCT"), (24, 35, "BRAND")]}),
    # More examples...
]

# Train model
nlp.begin_training()
for epoch in range(10):
    for text, annotations in TRAIN_DATA:
        doc = nlp.make_doc(text)
        example = Example.from_dict(doc, annotations)
        nlp.update([example])
\`\`\`

## Topic Modeling with LDA
\`\`\`python
from gensim import corpora
from gensim.models import LdaModel
from nltk.tokenize import word_tokenize

# Prepare documents
documents = [doc.lower().split() for doc in text_corpus]

# Create dictionary and corpus
dictionary = corpora.Dictionary(documents)
corpus = [dictionary.doc2bow(doc) for doc in documents]

# Train LDA model
lda_model = LdaModel(
    corpus=corpus,
    id2word=dictionary,
    num_topics=5,
    random_state=42,
    passes=10
)

# Print topics
for idx, topic in lda_model.print_topics(-1):
    print(f"Topic {idx}: {topic}\\n")

# Get document topics
doc_topics = lda_model.get_document_topics(corpus[0])
\`\`\`

## Topic Modeling with BERTopic
\`\`\`python
from bertopic import BERTopic

# Train model
topic_model = BERTopic()
topics, probs = topic_model.fit_transform(documents)

# Get topic info
topic_info = topic_model.get_topic_info()
print(topic_info)

# Visualize topics
topic_model.visualize_topics()
\`\`\``,
          objectives: [
            'Extract named entities from text',
            'Train custom NER models',
            'Discover topics with LDA and BERTopic'
          ],
          isFree: false
        }
      ],
      // Month 7: Computer Vision & Time Series
      [
        {
          title: 'Image Classification and Object Detection',
          description: 'Advanced computer vision techniques',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/yqkISICHH-U',
          duration: 45,
          content: `# Image Classification and Object Detection

## Image Classification with ResNet
\`\`\`python
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.resnet50 import preprocess_input, decode_predictions
import numpy as np

# Load pre-trained model
model = ResNet50(weights='imagenet')

# Load and preprocess image
img_path = 'elephant.jpg'
img = image.load_img(img_path, target_size=(224, 224))
x = image.img_to_array(img)
x = np.expand_dims(x, axis=0)
x = preprocess_input(x)

# Predict
preds = model.predict(x)
print('Predicted:', decode_predictions(preds, top=3)[0])
\`\`\`

## Object Detection with YOLO
\`\`\`python
import cv2
import numpy as np

# Load YOLO
net = cv2.dnn.readNet("yolov3.weights", "yolov3.cfg")
layer_names = net.getLayerNames()
output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]

# Load image
img = cv2.imread("image.jpg")
height, width, channels = img.shape

# Detect objects
blob = cv2.dnn.blobFromImage(img, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
net.setInput(blob)
outs = net.forward(output_layers)

# Process detections
class_ids = []
confidences = []
boxes = []

for out in outs:
    for detection in out:
        scores = detection[5:]
        class_id = np.argmax(scores)
        confidence = scores[class_id]

        if confidence > 0.5:
            # Object detected
            center_x = int(detection[0] * width)
            center_y = int(detection[1] * height)
            w = int(detection[2] * width)
            h = int(detection[3] * height)

            # Rectangle coordinates
            x = int(center_x - w / 2)
            y = int(center_y - h / 2)

            boxes.append([x, y, w, h])
            confidences.append(float(confidence))
            class_ids.append(class_id)

# Non-max suppression
indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)

# Draw bounding boxes
for i in range(len(boxes)):
    if i in indexes:
        x, y, w, h = boxes[i]
        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
\`\`\`

## Image Segmentation
\`\`\`python
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras import layers, models

# Build U-Net architecture
def unet_model(input_size=(128, 128, 3)):
    inputs = layers.Input(input_size)

    # Encoder
    conv1 = layers.Conv2D(64, 3, activation='relu', padding='same')(inputs)
    conv1 = layers.Conv2D(64, 3, activation='relu', padding='same')(conv1)
    pool1 = layers.MaxPooling2D(pool_size=(2, 2))(conv1)

    # More encoder blocks...

    # Decoder
    up1 = layers.UpSampling2D(size=(2, 2))(pool1)
    merge1 = layers.concatenate([conv1, up1], axis=3)

    # More decoder blocks...

    # Output
    outputs = layers.Conv2D(1, 1, activation='sigmoid')(merge1)

    model = models.Model(inputs=inputs, outputs=outputs)
    return model

model = unet_model()
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
\`\`\``,
          objectives: [
            'Implement image classification',
            'Use YOLO for object detection',
            'Apply image segmentation'
          ],
          isFree: false
        },
        {
          title: 'Time Series Forecasting',
          description: 'Predicting future values with statistical and ML methods',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/_vQ0W_qXMxk',
          duration: 40,
          content: `# Time Series Forecasting

## Time Series Analysis
\`\`\`python
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.seasonal import seasonal_decompose

# Load data
df = pd.read_csv('sales.csv', parse_dates=['date'], index_col='date')

# Plot time series
df['sales'].plot(figsize=(12, 4))
plt.title('Sales Over Time')
plt.show()

# Decompose time series
decomposition = seasonal_decompose(df['sales'], model='additive', period=12)
decomposition.plot()
plt.show()

# Check stationarity
from statsmodels.tsa.stattools import adfuller
result = adfuller(df['sales'])
print(f'ADF Statistic: {result[0]}')
print(f'p-value: {result[1]}')
\`\`\`

## ARIMA Model
\`\`\`python
from statsmodels.tsa.arima.model import ARIMA

# Fit ARIMA model
model = ARIMA(df['sales'], order=(1, 1, 1))
fitted_model = model.fit()

# Summary
print(fitted_model.summary())

# Forecast
forecast = fitted_model.forecast(steps=12)
print(forecast)

# Plot forecast
plt.figure(figsize=(12, 4))
plt.plot(df.index, df['sales'], label='Actual')
plt.plot(forecast.index, forecast, label='Forecast', color='red')
plt.legend()
plt.show()
\`\`\`

## LSTM for Time Series
\`\`\`python
from tensorflow.keras import layers, models
import numpy as np

# Prepare data
def create_dataset(data, look_back=12):
    X, y = [], []
    for i in range(len(data) - look_back):
        X.append(data[i:i+look_back])
        y.append(data[i+look_back])
    return np.array(X), np.array(y)

# Normalize data
from sklearn.preprocessing import MinMaxScaler
scaler = MinMaxScaler()
scaled_data = scaler.fit_transform(df[['sales']])

# Create sequences
look_back = 12
X, y = create_dataset(scaled_data, look_back)
X = X.reshape((X.shape[0], X.shape[1], 1))

# Split data
train_size = int(0.8 * len(X))
X_train, X_test = X[:train_size], X[train_size:]
y_train, y_test = y[:train_size], y[train_size:]

# Build LSTM model
model = models.Sequential([
    layers.LSTM(50, return_sequences=True, input_shape=(look_back, 1)),
    layers.LSTM(50),
    layers.Dense(1)
])

model.compile(optimizer='adam', loss='mse')

# Train
history = model.fit(
    X_train, y_train,
    epochs=50,
    batch_size=32,
    validation_data=(X_test, y_test),
    verbose=1
)

# Predictions
predictions = model.predict(X_test)
predictions = scaler.inverse_transform(predictions)
\`\`\`

## Prophet for Time Series
\`\`\`python
from prophet import Prophet

# Prepare data for Prophet
df_prophet = df.reset_index()
df_prophet.columns = ['ds', 'y']

# Create and fit model
model = Prophet(yearly_seasonality=True, weekly_seasonality=False)
model.fit(df_prophet)

# Make future dataframe
future = model.make_future_dataframe(periods=12, freq='M')

# Forecast
forecast = model.predict(future)

# Plot
model.plot(forecast)
model.plot_components(forecast)
\`\`\``,
          objectives: [
            'Analyze time series data',
            'Build ARIMA and LSTM models',
            'Use Prophet for forecasting'
          ],
          isFree: false
        },
        {
          title: 'Anomaly Detection',
          description: 'Identifying outliers and anomalies in data',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/12Xq9OLdQwQ',
          duration: 35,
          content: `# Anomaly Detection

## Statistical Methods
\`\`\`python
import numpy as np
import pandas as pd

# Z-score method
def detect_outliers_zscore(data, threshold=3):
    z_scores = np.abs((data - data.mean()) / data.std())
    return z_scores > threshold

# IQR method
def detect_outliers_iqr(data):
    Q1 = data.quantile(0.25)
    Q3 = data.quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    return (data < lower_bound) | (data > upper_bound)

# Apply methods
outliers_z = detect_outliers_zscore(df['value'])
outliers_iqr = detect_outliers_iqr(df['value'])
\`\`\`

## Isolation Forest
\`\`\`python
from sklearn.ensemble import IsolationForest

# Train model
iso_forest = IsolationForest(
    contamination=0.1,  # Expected proportion of outliers
    random_state=42
)

# Fit and predict
outliers = iso_forest.fit_predict(X)
# -1 for outliers, 1 for inliers

# Add to dataframe
df['anomaly'] = outliers
anomalies = df[df['anomaly'] == -1]
\`\`\`

## Local Outlier Factor
\`\`\`python
from sklearn.neighbors import LocalOutlierFactor

# Create detector
lof = LocalOutlierFactor(n_neighbors=20, contamination=0.1)

# Detect outliers
outliers = lof.fit_predict(X)
\`\`\`

## Autoencoder for Anomaly Detection
\`\`\`python
from tensorflow.keras import layers, models

# Build autoencoder
input_dim = X_train.shape[1]
encoding_dim = 8

# Encoder
input_layer = layers.Input(shape=(input_dim,))
encoded = layers.Dense(encoding_dim, activation='relu')(input_layer)

# Decoder
decoded = layers.Dense(input_dim, activation='sigmoid')(encoded)

# Autoencoder model
autoencoder = models.Model(input_layer, decoded)
autoencoder.compile(optimizer='adam', loss='mse')

# Train
autoencoder.fit(
    X_train, X_train,
    epochs=50,
    batch_size=32,
    validation_data=(X_test, X_test)
)

# Detect anomalies
reconstructions = autoencoder.predict(X_test)
mse = np.mean(np.power(X_test - reconstructions, 2), axis=1)

# Set threshold
threshold = np.percentile(mse, 95)
anomalies = mse > threshold
\`\`\``,
          objectives: [
            'Apply statistical anomaly detection',
            'Use Isolation Forest and LOF',
            'Build autoencoder for anomaly detection'
          ],
          isFree: false
        }
      ],
      // Month 8: Model Deployment & Capstone Project
      [
        {
          title: 'Model Deployment with Flask and FastAPI',
          description: 'Creating APIs for ML models',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/mrExsjcvF4o',
          duration: 40,
          content: `# Model Deployment with Flask and FastAPI

## Flask API
\`\`\`python
from flask import Flask, request, jsonify
import pickle
import numpy as np

app = Flask(__name__)

# Load model
with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    # Get data from request
    data = request.get_json()
    features = np.array(data['features']).reshape(1, -1)

    # Make prediction
    prediction = model.predict(features)
    probability = model.predict_proba(features)

    # Return result
    return jsonify({
        'prediction': int(prediction[0]),
        'probability': float(probability[0][1])
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
\`\`\`

## FastAPI
\`\`\`python
from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import numpy as np

app = FastAPI()

# Load model
with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

# Define request schema
class PredictionRequest(BaseModel):
    features: list

class PredictionResponse(BaseModel):
    prediction: int
    probability: float

@app.post('/predict', response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    features = np.array(request.features).reshape(1, -1)
    prediction = model.predict(features)
    probability = model.predict_proba(features)

    return PredictionResponse(
        prediction=int(prediction[0]),
        probability=float(probability[0][1])
    )

@app.get('/health')
async def health():
    return {'status': 'healthy'}

# Run with: uvicorn main:app --reload
\`\`\`

## Testing the API
\`\`\`python
import requests

# Make prediction
url = 'http://localhost:5000/predict'
data = {'features': [1.5, 2.3, 3.1, 4.2]}
response = requests.post(url, json=data)
print(response.json())
\`\`\``,
          objectives: [
            'Create Flask API for ML models',
            'Build FastAPI applications',
            'Test API endpoints'
          ],
          isFree: false
        },
        {
          title: 'Docker and Cloud Deployment',
          description: 'Containerizing and deploying ML models',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/bi0cKgmRuiA',
          duration: 45,
          content: `# Docker and Cloud Deployment

## Dockerfile for ML Application
\`\`\`dockerfile
FROM python:3.9-slim

WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

## requirements.txt
\`\`\`
fastapi==0.95.0
uvicorn==0.21.1
scikit-learn==1.2.2
pandas==1.5.3
numpy==1.24.2
pydantic==1.10.7
\`\`\`

## Build and Run Docker Container
\`\`\`bash
# Build image
docker build -t ml-api:latest .

# Run container
docker run -p 8000:8000 ml-api:latest

# Push to registry
docker tag ml-api:latest username/ml-api:latest
docker push username/ml-api:latest
\`\`\`

## Deploy to AWS
\`\`\`python
# Using AWS SageMaker
import boto3
import sagemaker
from sagemaker.sklearn import SKLearn

# Create SageMaker session
sagemaker_session = sagemaker.Session()

# Define estimator
sklearn_estimator = SKLearn(
    entry_point='train.py',
    role='SageMakerRole',
    instance_type='ml.m5.large',
    framework_version='0.23-1',
    base_job_name='sklearn-model'
)

# Train model
sklearn_estimator.fit({'train': 's3://bucket/train.csv'})

# Deploy model
predictor = sklearn_estimator.deploy(
    initial_instance_count=1,
    instance_type='ml.t2.medium'
)

# Make prediction
prediction = predictor.predict(data)
\`\`\`

## Deploy to Google Cloud
\`\`\`bash
# Deploy to Google Cloud Run
gcloud builds submit --tag gcr.io/PROJECT_ID/ml-api
gcloud run deploy ml-api \\
  --image gcr.io/PROJECT_ID/ml-api \\
  --platform managed \\
  --region us-central1 \\
  --allow-unauthenticated
\`\`\``,
          objectives: [
            'Containerize ML applications with Docker',
            'Deploy to AWS SageMaker',
            'Use Google Cloud Platform'
          ],
          isFree: false
        },
        {
          title: 'MLOps and Model Monitoring',
          description: 'Managing ML lifecycle in production',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/x3R0bM_VgQA',
          duration: 50,
          content: `# MLOps and Model Monitoring

## Experiment Tracking with MLflow
\`\`\`python
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier

# Start MLflow run
with mlflow.start_run():
    # Log parameters
    mlflow.log_param("n_estimators", 100)
    mlflow.log_param("max_depth", 10)

    # Train model
    model = RandomForestClassifier(n_estimators=100, max_depth=10)
    model.fit(X_train, y_train)

    # Evaluate
    accuracy = model.score(X_test, y_test)

    # Log metrics
    mlflow.log_metric("accuracy", accuracy)

    # Log model
    mlflow.sklearn.log_model(model, "model")

    # Log artifacts
    mlflow.log_artifact("feature_importance.png")

# Load model
model_uri = "runs:/RUN_ID/model"
loaded_model = mlflow.sklearn.load_model(model_uri)
\`\`\`

## Model Versioning
\`\`\`python
# Register model
mlflow.register_model(
    model_uri=f"runs:/{run_id}/model",
    name="fraud_detection_model"
)

# Transition model to production
from mlflow.tracking import MlflowClient

client = MlflowClient()
client.transition_model_version_stage(
    name="fraud_detection_model",
    version=1,
    stage="Production"
)
\`\`\`

## Model Monitoring
\`\`\`python
import pandas as pd
from evidently import ColumnMapping
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset

# Create monitoring report
data_drift_report = Report(metrics=[
    DataDriftPreset(),
])

# Run report
data_drift_report.run(
    reference_data=train_data,
    current_data=production_data
)

# Save report
data_drift_report.save_html("data_drift_report.html")

# Check for drift
report_dict = data_drift_report.as_dict()
if report_dict['metrics'][0]['result']['dataset_drift']:
    print("Data drift detected! Retrain model.")
\`\`\`

## CI/CD for ML
\`\`\`yaml
# .github/workflows/ml-pipeline.yml
name: ML Pipeline

on:
  push:
    branches: [ main ]

jobs:
  train:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.9

      - name: Install dependencies
        run: |
          pip install -r requirements.txt

      - name: Train model
        run: |
          python train.py

      - name: Evaluate model
        run: |
          python evaluate.py

      - name: Deploy model
        if: success()
        run: |
          python deploy.py
\`\`\``,
          objectives: [
            'Track experiments with MLflow',
            'Version and monitor models',
            'Implement CI/CD for ML'
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

    console.log(`\n✅ Successfully populated Data Science course!`);
    console.log(`Total modules: ${modules.length}`);
    console.log(`Total lessons: ${lessonsData.flat().length}`);
    console.log(`Total duration: ${totalDuration} minutes (${(totalDuration / 60).toFixed(1)} hours)`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

populateDataScienceCourse();
