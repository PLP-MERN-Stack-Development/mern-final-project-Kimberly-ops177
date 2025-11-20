import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../src/models/Course.js';
import Module from '../src/models/Module.js';
import Lesson from '../src/models/Lesson.js';
import User from '../src/models/User.js';

dotenv.config();

const populateDataAnalysisCourse = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB Connected');

    const course = await Course.findOne({ title: /Data Analysis/i });
    if (!course) {
      console.error('Data Analysis course not found!');
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
      // Month 1: Excel Mastery for Data Analysis
      [
        {
          title: 'Excel Fundamentals for Data Analysis',
          description: 'Essential Excel features and formulas for data analysis',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/Vl0H-qTclOg',
          duration: 35,
          content: `# Excel Fundamentals for Data Analysis

## Essential Excel Functions
\`\`\`excel
# Text Functions
=UPPER(A1)          # Convert to uppercase
=LOWER(A1)          # Convert to lowercase
=PROPER(A1)         # Capitalize first letter
=TRIM(A1)           # Remove extra spaces
=LEFT(A1, 5)        # Extract leftmost characters
=RIGHT(A1, 3)       # Extract rightmost characters
=MID(A1, 2, 5)      # Extract from middle
=CONCATENATE(A1, " ", B1)  # Combine text

# Mathematical Functions
=SUM(A1:A10)        # Sum range
=AVERAGE(A1:A10)    # Average
=MIN(A1:A10)        # Minimum value
=MAX(A1:A10)        # Maximum value
=COUNT(A1:A10)      # Count numbers
=COUNTA(A1:A10)     # Count non-empty cells
=ROUND(A1, 2)       # Round to 2 decimals

# Logical Functions
=IF(A1 > 100, "High", "Low")
=AND(A1 > 50, B1 < 100)
=OR(A1 = "Yes", B1 = "Yes")
=NOT(A1 = "Complete")
=IFERROR(A1/B1, 0)  # Handle errors
\`\`\`

## Date and Time Functions
\`\`\`excel
=TODAY()            # Current date
=NOW()              # Current date and time
=DATE(2024, 1, 15)  # Create date
=YEAR(A1)           # Extract year
=MONTH(A1)          # Extract month
=DAY(A1)            # Extract day
=WEEKDAY(A1)        # Day of week
=DATEDIF(A1, B1, "D")  # Days between dates
\`\`\`

## Data Validation
- Creating dropdown lists
- Setting numerical constraints
- Custom validation rules
- Error alerts and messages

## Conditional Formatting
- Highlight cells based on values
- Color scales and data bars
- Icon sets for quick visualization
- Custom formulas for formatting`,
          objectives: [
            'Master essential Excel functions',
            'Apply data validation',
            'Use conditional formatting'
          ],
          isFree: true
        },
        {
          title: 'VLOOKUP, INDEX-MATCH, and XLOOKUP',
          description: 'Advanced lookup functions for data retrieval',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/d3BYVQ6xIE4',
          duration: 40,
          content: `# VLOOKUP, INDEX-MATCH, and XLOOKUP

## VLOOKUP Function
\`\`\`excel
=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])

# Example
=VLOOKUP(A2, Products!A:D, 3, FALSE)
# Looks up value in A2 in Products sheet, returns value from column 3

# Common use cases
=VLOOKUP(EmployeeID, EmployeeData!A:E, 2, 0)  # Get employee name
=VLOOKUP(ProductCode, PriceList!A:C, 3, 0)     # Get product price
\`\`\`

## INDEX-MATCH (More Flexible)
\`\`\`excel
=INDEX(return_array, MATCH(lookup_value, lookup_array, 0))

# Example
=INDEX(B:B, MATCH(A2, A:A, 0))
# More powerful than VLOOKUP - can look left/right

# Two-way lookup
=INDEX(Data!$B$2:$E$100,
       MATCH($A2, Data!$A$2:$A$100, 0),
       MATCH(B$1, Data!$B$1:$E$1, 0))
\`\`\`

## XLOOKUP (Modern Alternative)
\`\`\`excel
=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode])

# Example
=XLOOKUP(A2, Products!A:A, Products!C:C, "Not Found")

# Multiple column return
=XLOOKUP(A2, Employees!A:A, Employees!B:E)

# Approximate match
=XLOOKUP(A2, ScoreRanges, Grades, , 1)  # Find closest match
\`\`\`

## Best Practices
- Use exact match (FALSE or 0) for most cases
- Sort data for approximate matches
- Use named ranges for clarity
- INDEX-MATCH for maximum flexibility
- XLOOKUP when available (Excel 365)`,
          objectives: [
            'Use VLOOKUP for data retrieval',
            'Master INDEX-MATCH combinations',
            'Apply XLOOKUP in modern Excel'
          ],
          isFree: true
        },
        {
          title: 'Pivot Tables and Pivot Charts',
          description: 'Summarizing and analyzing data with pivot tables',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/UsdedFoTA68',
          duration: 45,
          content: `# Pivot Tables and Pivot Charts

## Creating Pivot Tables
**Steps:**
1. Select your data range
2. Insert → Pivot Table
3. Choose fields for:
   - Rows: Categories to group by
   - Columns: Additional grouping
   - Values: What to calculate
   - Filters: What to filter

## Common Aggregations
- Sum
- Count
- Average
- Min/Max
- Standard Deviation
- Show Values As (% of total, % of parent, etc.)

## Calculated Fields
\`\`\`excel
# Add calculated field
1. Click on Pivot Table
2. PivotTable Analyze → Fields, Items & Sets
3. Calculated Field

# Example formulas
Profit Margin = Profit / Revenue
Average Order Value = Revenue / Orders
Growth Rate = (Current - Previous) / Previous
\`\`\`

## Pivot Table Features
### Grouping
- Group dates by year, quarter, month
- Group numbers into ranges
- Create custom groups

### Slicers
- Visual filters for quick data selection
- Connect to multiple pivot tables
- Custom formatting

### Timeline
- Filter by date ranges
- Visual date navigation
- Quarter/year selections

## Pivot Charts
- Visualize pivot table data
- Automatically update with pivot table
- Various chart types
- Interactive filtering

## Best Practices
✓ Use Table format for source data
✓ Refresh data regularly
✓ Clear field names
✓ Group dates appropriately
✓ Use calculated fields sparingly`,
          objectives: [
            'Create and customize pivot tables',
            'Use slicers and timelines',
            'Build pivot charts'
          ],
          isFree: false
        },
        {
          title: 'Power Query for Data Transformation',
          description: 'ETL operations and data cleaning with Power Query',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/0aeZX1l4JT4',
          duration: 50,
          content: `# Power Query for Data Transformation

## Getting Started with Power Query
**Accessing Power Query:**
- Data → Get Data → From File/Database/Web
- Data → Get & Transform Data

## Common Transformations

### Column Operations
- Remove columns
- Rename columns
- Change data type
- Split column (by delimiter, position)
- Merge columns
- Extract (first characters, last characters, range)

### Row Operations
- Remove duplicates
- Remove blank rows
- Sort rows
- Filter rows
- Keep top/bottom rows

### Data Cleaning
\`\`\`m
# M Language examples

# Replace values
= Table.ReplaceValue(Source, "old", "new", Replacer.ReplaceText, {"Column1"})

# Remove errors
= Table.RemoveRowsWithErrors(Source)

# Trim and clean
= Table.TransformColumns(Source, {{"Column1", Text.Trim}})

# Fill down/up
= Table.FillDown(Source, {"Column1"})
= Table.FillUp(Source, {"Column1"})
\`\`\`

## Combining Queries
### Append Queries (Union)
- Stack tables vertically
- Combine similar datasets
- Must have matching column structure

### Merge Queries (Join)
\`\`\`m
# Types of joins
- Left Outer (keep all from left)
- Right Outer (keep all from right)
- Full Outer (keep all from both)
- Inner (only matches)
- Left Anti (only from left, not in right)
- Right Anti (only from right, not in left)
\`\`\`

## Advanced Features
### Pivot and Unpivot
\`\`\`
# Unpivot: Convert columns to rows
Month1, Month2, Month3 → Month, Value

# Pivot: Convert rows to columns
Month, Value → Month1, Month2, Month3
\`\`\`

### Group By
- Sum, Average, Count, Min, Max
- Count distinct values
- All rows (create nested table)

### Custom Columns
\`\`\`m
# Add custom column
= Table.AddColumn(Source, "FullName",
    each [FirstName] & " " & [LastName])

# Conditional column
= Table.AddColumn(Source, "Category",
    each if [Sales] > 1000 then "High" else "Low")
\`\`\`

## Parameters and Functions
\`\`\`m
# Create parameter
FilePath = "C:\\Data\\Sales.xlsx"

# Create function
(StartDate as date, EndDate as date) =>
let
    Source = Sql.Database("server", "database"),
    Filtered = Table.SelectRows(Source,
        each [Date] >= StartDate and [Date] <= EndDate)
in
    Filtered
\`\`\``,
          objectives: [
            'Transform data with Power Query',
            'Combine multiple data sources',
            'Create reusable queries'
          ],
          isFree: false
        }
      ],
      // Month 2: SQL for Data Analysis
      [
        {
          title: 'SQL Fundamentals',
          description: 'Basic SQL queries and database concepts',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY',
          duration: 40,
          content: `# SQL Fundamentals

## SELECT Statements
\`\`\`sql
-- Basic SELECT
SELECT * FROM customers;

-- Select specific columns
SELECT customer_id, first_name, last_name, email
FROM customers;

-- Alias columns
SELECT
    first_name AS "First Name",
    last_name AS "Last Name"
FROM customers;

-- DISTINCT values
SELECT DISTINCT country FROM customers;

-- Calculated columns
SELECT
    product_name,
    price,
    quantity,
    price * quantity AS total_value
FROM products;
\`\`\`

## WHERE Clause Filtering
\`\`\`sql
-- Comparison operators
SELECT * FROM orders WHERE order_date > '2024-01-01';
SELECT * FROM products WHERE price < 100;

-- Logical operators
SELECT * FROM customers
WHERE country = 'USA' AND city = 'New York';

SELECT * FROM products
WHERE category = 'Electronics' OR category = 'Computers';

-- IN operator
SELECT * FROM orders
WHERE status IN ('Pending', 'Processing', 'Shipped');

-- BETWEEN
SELECT * FROM orders
WHERE order_date BETWEEN '2024-01-01' AND '2024-12-31';

-- LIKE pattern matching
SELECT * FROM customers WHERE email LIKE '%@gmail.com';
SELECT * FROM products WHERE name LIKE 'iPhone%';

-- NULL handling
SELECT * FROM customers WHERE phone IS NULL;
SELECT * FROM customers WHERE phone IS NOT NULL;
\`\`\`

## Sorting and Limiting
\`\`\`sql
-- ORDER BY
SELECT * FROM products
ORDER BY price DESC;

SELECT * FROM customers
ORDER BY last_name ASC, first_name ASC;

-- LIMIT (MySQL/PostgreSQL) or TOP (SQL Server)
SELECT * FROM products
ORDER BY sales DESC
LIMIT 10;

-- OFFSET for pagination
SELECT * FROM products
ORDER BY product_id
LIMIT 20 OFFSET 40;  -- Get rows 41-60
\`\`\`

## Aggregate Functions
\`\`\`sql
-- COUNT
SELECT COUNT(*) AS total_customers FROM customers;
SELECT COUNT(DISTINCT country) AS countries FROM customers;

-- SUM
SELECT SUM(amount) AS total_revenue FROM orders;

-- AVG
SELECT AVG(price) AS average_price FROM products;

-- MIN and MAX
SELECT MIN(price) AS cheapest, MAX(price) AS most_expensive
FROM products;
\`\`\``,
          objectives: [
            'Write SELECT queries',
            'Filter data with WHERE',
            'Use aggregate functions'
          ],
          isFree: false
        },
        {
          title: 'SQL Joins and Subqueries',
          description: 'Combining tables and nested queries',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/9yeOJ0ZMUYw',
          duration: 50,
          content: `# SQL Joins and Subqueries

## JOIN Types
### INNER JOIN
\`\`\`sql
SELECT
    o.order_id,
    c.customer_name,
    o.order_date,
    o.total_amount
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id;
\`\`\`

### LEFT JOIN
\`\`\`sql
-- Get all customers and their orders (including customers with no orders)
SELECT
    c.customer_id,
    c.customer_name,
    o.order_id,
    o.order_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id;

-- Find customers with no orders
SELECT c.*
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;
\`\`\`

### RIGHT JOIN and FULL OUTER JOIN
\`\`\`sql
-- RIGHT JOIN (less common)
SELECT *
FROM orders o
RIGHT JOIN customers c ON o.customer_id = c.customer_id;

-- FULL OUTER JOIN
SELECT *
FROM customers c
FULL OUTER JOIN orders o ON c.customer_id = o.customer_id;
\`\`\`

### Multiple Joins
\`\`\`sql
SELECT
    o.order_id,
    c.customer_name,
    p.product_name,
    oi.quantity,
    oi.unit_price
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
INNER JOIN order_items oi ON o.order_id = oi.order_id
INNER JOIN products p ON oi.product_id = p.product_id
WHERE o.order_date >= '2024-01-01';
\`\`\`

## Subqueries
### Scalar Subqueries
\`\`\`sql
-- Get products with above-average price
SELECT product_name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);
\`\`\`

### Subqueries with IN
\`\`\`sql
-- Get customers who placed orders in 2024
SELECT *
FROM customers
WHERE customer_id IN (
    SELECT DISTINCT customer_id
    FROM orders
    WHERE YEAR(order_date) = 2024
);
\`\`\`

### Correlated Subqueries
\`\`\`sql
-- Get each product's sales compared to category average
SELECT
    p.product_name,
    p.sales,
    (SELECT AVG(sales)
     FROM products p2
     WHERE p2.category = p.category) AS category_avg
FROM products p;
\`\`\`

### EXISTS
\`\`\`sql
-- Customers who have placed at least one order
SELECT c.*
FROM customers c
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.customer_id
);
\`\`\`

## Common Table Expressions (CTEs)
\`\`\`sql
WITH high_value_customers AS (
    SELECT
        customer_id,
        SUM(total_amount) AS total_spent
    FROM orders
    GROUP BY customer_id
    HAVING SUM(total_amount) > 10000
)
SELECT
    c.customer_name,
    hvc.total_spent
FROM high_value_customers hvc
JOIN customers c ON hvc.customer_id = c.customer_id
ORDER BY hvc.total_spent DESC;
\`\`\``,
          objectives: [
            'Perform various types of joins',
            'Write subqueries',
            'Use CTEs for complex queries'
          ],
          isFree: false
        },
        {
          title: 'Window Functions and Advanced SQL',
          description: 'Ranking, running totals, and analytical functions',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/Ww71knvhQ-s',
          duration: 45,
          content: `# Window Functions and Advanced SQL

## Ranking Functions
\`\`\`sql
-- ROW_NUMBER: Unique rank
SELECT
    product_name,
    sales,
    ROW_NUMBER() OVER (ORDER BY sales DESC) AS row_num
FROM products;

-- RANK: Allows ties, skips ranks
SELECT
    product_name,
    sales,
    RANK() OVER (ORDER BY sales DESC) AS rank
FROM products;

-- DENSE_RANK: Allows ties, no gaps
SELECT
    product_name,
    sales,
    DENSE_RANK() OVER (ORDER BY sales DESC) AS dense_rank
FROM products;

-- NTILE: Divide into buckets
SELECT
    product_name,
    sales,
    NTILE(4) OVER (ORDER BY sales DESC) AS quartile
FROM products;
\`\`\`

## Partition By
\`\`\`sql
-- Rank within categories
SELECT
    category,
    product_name,
    sales,
    RANK() OVER (PARTITION BY category ORDER BY sales DESC) AS category_rank
FROM products;

-- Running total by month
SELECT
    order_date,
    amount,
    SUM(amount) OVER (
        PARTITION BY DATE_TRUNC('month', order_date)
        ORDER BY order_date
    ) AS month_running_total
FROM orders;
\`\`\`

## Aggregate Window Functions
\`\`\`sql
-- Running total
SELECT
    order_date,
    amount,
    SUM(amount) OVER (ORDER BY order_date) AS running_total
FROM orders;

-- Moving average (last 7 days)
SELECT
    order_date,
    daily_sales,
    AVG(daily_sales) OVER (
        ORDER BY order_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS moving_avg_7d
FROM daily_sales;

-- Cumulative percentage
SELECT
    product_name,
    sales,
    SUM(sales) OVER (ORDER BY sales DESC) * 100.0 /
        SUM(sales) OVER () AS cumulative_pct
FROM products;
\`\`\`

## LAG and LEAD
\`\`\`sql
-- Compare to previous period
SELECT
    month,
    revenue,
    LAG(revenue) OVER (ORDER BY month) AS prev_month_revenue,
    revenue - LAG(revenue) OVER (ORDER BY month) AS month_over_month_change
FROM monthly_revenue;

-- Next value
SELECT
    date,
    price,
    LEAD(price) OVER (ORDER BY date) AS next_day_price
FROM stock_prices;
\`\`\`

## FIRST_VALUE and LAST_VALUE
\`\`\`sql
-- Compare to first value in group
SELECT
    date,
    sales,
    FIRST_VALUE(sales) OVER (
        PARTITION BY DATE_TRUNC('year', date)
        ORDER BY date
    ) AS year_start_sales,
    sales - FIRST_VALUE(sales) OVER (
        PARTITION BY DATE_TRUNC('year', date)
        ORDER BY date
    ) AS growth_from_year_start
FROM daily_sales;
\`\`\`

## CASE Statements
\`\`\`sql
SELECT
    customer_id,
    total_spent,
    CASE
        WHEN total_spent >= 10000 THEN 'VIP'
        WHEN total_spent >= 5000 THEN 'Gold'
        WHEN total_spent >= 1000 THEN 'Silver'
        ELSE 'Bronze'
    END AS customer_tier
FROM customer_spending;
\`\`\``,
          objectives: [
            'Use window functions for analytics',
            'Calculate running totals and rankings',
            'Apply LAG and LEAD functions'
          ],
          isFree: false
        },
        {
          title: 'SQL Query Optimization',
          description: 'Writing efficient queries and performance tuning',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/BHwzDmr6d7s',
          duration: 35,
          content: `# SQL Query Optimization

## Indexing Strategies
\`\`\`sql
-- Create index on frequently queried columns
CREATE INDEX idx_customer_email ON customers(email);
CREATE INDEX idx_order_date ON orders(order_date);

-- Composite index for multiple columns
CREATE INDEX idx_customer_country_city
ON customers(country, city);

-- Unique index
CREATE UNIQUE INDEX idx_username ON users(username);

-- Check existing indexes
SHOW INDEXES FROM customers;

-- Drop index if not needed
DROP INDEX idx_customer_email ON customers;
\`\`\`

## Query Optimization Techniques

### Use EXPLAIN
\`\`\`sql
-- Analyze query execution plan
EXPLAIN SELECT * FROM orders
WHERE order_date > '2024-01-01';

-- Detailed analysis
EXPLAIN ANALYZE
SELECT c.name, COUNT(o.order_id)
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.name;
\`\`\`

### Avoid SELECT *
\`\`\`sql
-- Bad
SELECT * FROM large_table;

-- Good
SELECT customer_id, name, email FROM customers;
\`\`\`

### Use WHERE Instead of HAVING When Possible
\`\`\`sql
-- Less efficient
SELECT category, SUM(sales)
FROM products
GROUP BY category
HAVING category = 'Electronics';

-- More efficient
SELECT category, SUM(sales)
FROM products
WHERE category = 'Electronics'
GROUP BY category;
\`\`\`

### Limit Results
\`\`\`sql
-- Use LIMIT for large result sets
SELECT * FROM products
ORDER BY created_at DESC
LIMIT 100;
\`\`\`

### Optimize Joins
\`\`\`sql
-- Join on indexed columns
SELECT o.*, c.name
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id;

-- Filter before joining
SELECT o.*, c.name
FROM (
    SELECT * FROM orders
    WHERE order_date >= '2024-01-01'
) o
INNER JOIN customers c ON o.customer_id = c.customer_id;
\`\`\`

## Avoid Common Anti-Patterns
\`\`\`sql
-- Avoid functions on indexed columns in WHERE
-- Bad
SELECT * FROM orders
WHERE YEAR(order_date) = 2024;

-- Good
SELECT * FROM orders
WHERE order_date >= '2024-01-01'
  AND order_date < '2025-01-01';

-- Avoid OR with different columns
-- Bad
SELECT * FROM customers
WHERE country = 'USA' OR city = 'London';

-- Good (use UNION if needed)
SELECT * FROM customers WHERE country = 'USA'
UNION
SELECT * FROM customers WHERE city = 'London';
\`\`\`

## Batch Operations
\`\`\`sql
-- Insert multiple rows at once
INSERT INTO products (name, price) VALUES
    ('Product A', 10.99),
    ('Product B', 15.99),
    ('Product C', 20.99);

-- Update in batches
UPDATE orders
SET status = 'Processed'
WHERE order_id IN (
    SELECT order_id FROM pending_orders LIMIT 1000
);
\`\`\``,
          objectives: [
            'Create and use indexes effectively',
            'Optimize query performance',
            'Avoid common performance pitfalls'
          ],
          isFree: false
        }
      ],
      // Month 3: Python & Pandas for Analysis
      [
        {
          title: 'Python Basics for Data Analysis',
          description: 'Python fundamentals and essential libraries',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
          duration: 40,
          content: `# Python Basics for Data Analysis

## Python Fundamentals
\`\`\`python
# Variables and data types
name = "Alice"
age = 30
height = 5.6
is_analyst = True

# Lists
scores = [85, 92, 78, 95, 88]
print(sum(scores) / len(scores))  # Average

# Dictionaries
person = {
    'name': 'Alice',
    'age': 30,
    'department': 'Analytics'
}

# List comprehension
squares = [x**2 for x in range(10)]
even_squares = [x**2 for x in range(10) if x % 2 == 0]
\`\`\`

## Working with Files
\`\`\`python
# Reading CSV with built-in csv module
import csv

with open('data.csv', 'r') as file:
    reader = csv.DictReader(file)
    for row in reader:
        print(row['name'], row['value'])

# Reading text files
with open('data.txt', 'r') as file:
    lines = file.readlines()
    for line in lines:
        print(line.strip())

# Writing files
with open('output.txt', 'w') as file:
    file.write("Analysis Results\\n")
    file.write(f"Total: {total}\\n")
\`\`\`

## Functions for Analysis
\`\`\`python
def calculate_statistics(data):
    """Calculate basic statistics for a list of numbers."""
    return {
        'mean': sum(data) / len(data),
        'min': min(data),
        'max': max(data),
        'count': len(data)
    }

def clean_text(text):
    """Clean and standardize text data."""
    return text.strip().lower().replace('  ', ' ')

# Using functions
sales_data = [100, 150, 200, 175, 225]
stats = calculate_statistics(sales_data)
print(f"Average sales: {stats['mean']:.2f}")
\`\`\`

## Error Handling
\`\`\`python
try:
    result = total_sales / num_transactions
except ZeroDivisionError:
    result = 0
    print("No transactions found")
except Exception as e:
    print(f"Error occurred: {e}")
finally:
    print("Analysis complete")
\`\`\``,
          objectives: [
            'Write Python code for data tasks',
            'Work with files and data structures',
            'Create reusable functions'
          ],
          isFree: false
        },
        {
          title: 'Pandas for Data Manipulation',
          description: 'DataFrame operations and data wrangling',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg',
          duration: 50,
          content: `# Pandas for Data Manipulation

## Loading Data
\`\`\`python
import pandas as pd

# Read CSV
df = pd.read_csv('sales_data.csv')

# Read Excel
df = pd.read_excel('report.xlsx', sheet_name='Sales')

# Read from SQL
import sqlite3
conn = sqlite3.connect('database.db')
df = pd.read_sql_query("SELECT * FROM sales", conn)

# First look at data
print(df.head())
print(df.info())
print(df.describe())
\`\`\`

## Data Selection and Filtering
\`\`\`python
# Select columns
names = df['customer_name']
subset = df[['customer_name', 'sales', 'region']]

# Filter rows
high_sales = df[df['sales'] > 1000]
recent = df[df['date'] >= '2024-01-01']
filtered = df[(df['region'] == 'North') & (df['sales'] > 500)]

# loc and iloc
first_row = df.iloc[0]
specific = df.loc[df['customer_name'] == 'Alice', ['sales', 'region']]
\`\`\`

## Data Cleaning
\`\`\`python
# Handle missing values
df.isnull().sum()
df.dropna()  # Remove rows with any missing values
df.dropna(subset=['sales'])  # Remove rows with missing sales
df.fillna(0)  # Fill all missing values with 0
df['sales'].fillna(df['sales'].mean())  # Fill with mean

# Remove duplicates
df.drop_duplicates()
df.drop_duplicates(subset=['customer_id'])

# Data type conversion
df['date'] = pd.to_datetime(df['date'])
df['sales'] = df['sales'].astype(float)
df['category'] = df['category'].astype('category')
\`\`\`

## Data Transformation
\`\`\`python
# Create new columns
df['profit'] = df['revenue'] - df['cost']
df['profit_margin'] = df['profit'] / df['revenue'] * 100
df['year'] = df['date'].dt.year
df['month'] = df['date'].dt.month

# Apply functions
df['upper_name'] = df['name'].str.upper()
df['price_category'] = df['price'].apply(
    lambda x: 'High' if x > 100 else 'Low'
)

# String operations
df['email_domain'] = df['email'].str.split('@').str[1]
df['clean_text'] = df['text'].str.strip().str.lower()

# Replace values
df['status'] = df['status'].replace({'Y': 'Yes', 'N': 'No'})
\`\`\`

## GroupBy Operations
\`\`\`python
# Group and aggregate
by_region = df.groupby('region')['sales'].sum()
summary = df.groupby('region').agg({
    'sales': ['sum', 'mean', 'count'],
    'profit': 'sum'
})

# Multiple groupby
monthly = df.groupby(['year', 'month'])['sales'].sum()

# Custom aggregations
def range_calc(x):
    return x.max() - x.min()

df.groupby('category')['price'].agg([
    'mean', 'median', ('range', range_calc)
])
\`\`\`

## Merging and Joining
\`\`\`python
# Merge dataframes
merged = pd.merge(sales_df, customers_df, on='customer_id', how='left')

# Concatenate
combined = pd.concat([df1, df2], axis=0, ignore_index=True)

# Join
df1.join(df2, on='key_column')
\`\`\``,
          objectives: [
            'Load and explore data with Pandas',
            'Clean and transform datasets',
            'Perform groupby and merge operations'
          ],
          isFree: false
        },
        {
          title: 'Data Visualization with Python',
          description: 'Creating charts with Matplotlib and Seaborn',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/3Xc3CA655Y4',
          duration: 40,
          content: `# Data Visualization with Python

## Matplotlib Basics
\`\`\`python
import matplotlib.pyplot as plt
import pandas as pd

# Line chart
df.plot(x='date', y='sales', kind='line', figsize=(12, 6))
plt.title('Sales Over Time')
plt.xlabel('Date')
plt.ylabel('Sales ($)')
plt.grid(True)
plt.show()

# Bar chart
df.groupby('region')['sales'].sum().plot(kind='bar')
plt.title('Sales by Region')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# Scatter plot
plt.scatter(df['advertising'], df['sales'], alpha=0.5)
plt.xlabel('Advertising Spend')
plt.ylabel('Sales')
plt.title('Advertising vs Sales')
plt.show()

# Histogram
df['sales'].plot(kind='hist', bins=30, edgecolor='black')
plt.title('Sales Distribution')
plt.show()
\`\`\`

## Seaborn Visualizations
\`\`\`python
import seaborn as sns

# Set style
sns.set_style('whitegrid')
sns.set_palette('husl')

# Box plot
sns.boxplot(x='region', y='sales', data=df)
plt.title('Sales Distribution by Region')
plt.show()

# Violin plot
sns.violinplot(x='category', y='price', data=df)
plt.xticks(rotation=45)
plt.show()

# Heatmap (correlation matrix)
corr = df[['sales', 'advertising', 'employees']].corr()
sns.heatmap(corr, annot=True, cmap='coolwarm', center=0)
plt.title('Correlation Matrix')
plt.show()

# Count plot
sns.countplot(x='category', data=df)
plt.title('Products by Category')
plt.xticks(rotation=45)
plt.show()
\`\`\`

## Multiple Subplots
\`\`\`python
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# Plot 1: Line chart
df.groupby('month')['sales'].sum().plot(ax=axes[0, 0])
axes[0, 0].set_title('Monthly Sales')

# Plot 2: Bar chart
df.groupby('region')['sales'].mean().plot(kind='bar', ax=axes[0, 1])
axes[0, 1].set_title('Average Sales by Region')

# Plot 3: Scatter
axes[1, 0].scatter(df['price'], df['quantity'])
axes[1, 0].set_xlabel('Price')
axes[1, 0].set_ylabel('Quantity')
axes[1, 0].set_title('Price vs Quantity')

# Plot 4: Histogram
df['profit_margin'].plot(kind='hist', bins=20, ax=axes[1, 1])
axes[1, 1].set_title('Profit Margin Distribution')

plt.tight_layout()
plt.show()
\`\`\`

## Customization
\`\`\`python
# Custom colors and styles
plt.figure(figsize=(10, 6))
plt.plot(df['date'], df['sales'],
         color='#2E86AB', linewidth=2, marker='o')
plt.title('Sales Trend', fontsize=16, fontweight='bold')
plt.xlabel('Date', fontsize=12)
plt.ylabel('Sales ($)', fontsize=12)
plt.grid(True, alpha=0.3)
plt.legend(['Sales'], fontsize=10)
plt.show()

# Save figure
plt.savefig('sales_chart.png', dpi=300, bbox_inches='tight')
\`\`\``,
          objectives: [
            'Create various chart types',
            'Use Seaborn for statistical plots',
            'Customize visualizations'
          ],
          isFree: false
        },
        {
          title: 'Statistical Analysis with Python',
          description: 'Descriptive statistics and hypothesis testing',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/zRUliXuwJCQ',
          duration: 35,
          content: `# Statistical Analysis with Python

## Descriptive Statistics
\`\`\`python
import pandas as pd
import numpy as np

# Basic statistics
print(df['sales'].mean())
print(df['sales'].median())
print(df['sales'].std())
print(df['sales'].var())
print(df['sales'].min())
print(df['sales'].max())

# Percentiles
print(df['sales'].quantile([0.25, 0.5, 0.75]))

# Complete summary
print(df.describe())

# Group statistics
df.groupby('region')['sales'].agg([
    'count', 'mean', 'median', 'std', 'min', 'max'
])
\`\`\`

## Correlation Analysis
\`\`\`python
# Correlation coefficient
correlation = df['advertising'].corr(df['sales'])
print(f"Correlation: {correlation:.3f}")

# Correlation matrix
corr_matrix = df[['sales', 'advertising', 'employees']].corr()
print(corr_matrix)

# Visualize correlations
import seaborn as sns
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm')
plt.show()
\`\`\`

## Hypothesis Testing
\`\`\`python
from scipy import stats

# T-test: Compare two groups
region_a = df[df['region'] == 'A']['sales']
region_b = df[df['region'] == 'B']['sales']

t_stat, p_value = stats.ttest_ind(region_a, region_b)
print(f"T-statistic: {t_stat:.3f}")
print(f"P-value: {p_value:.3f}")

if p_value < 0.05:
    print("Significant difference between regions")
else:
    print("No significant difference")

# Chi-square test: Independence of categorical variables
contingency_table = pd.crosstab(df['region'], df['product_category'])
chi2, p_value, dof, expected = stats.chi2_contingency(contingency_table)
print(f"Chi-square: {chi2:.3f}, P-value: {p_value:.3f}")

# ANOVA: Compare multiple groups
groups = [group['sales'].values for name, group in df.groupby('region')]
f_stat, p_value = stats.f_oneway(*groups)
print(f"F-statistic: {f_stat:.3f}, P-value: {p_value:.3f}")
\`\`\`

## Linear Regression
\`\`\`python
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error

# Prepare data
X = df[['advertising', 'employees']]
y = df['sales']

# Create and fit model
model = LinearRegression()
model.fit(X, y)

# Coefficients
print(f"Intercept: {model.intercept_:.2f}")
print(f"Coefficients: {model.coef_}")

# Predictions
y_pred = model.predict(X)

# Evaluate
r2 = r2_score(y, y_pred)
rmse = np.sqrt(mean_squared_error(y, y_pred))
print(f"R²: {r2:.3f}")
print(f"RMSE: {rmse:.2f}")

# Predict new values
new_data = [[5000, 50]]  # $5000 advertising, 50 employees
prediction = model.predict(new_data)
print(f"Predicted sales: {prediction[0]:.2f}")
\`\`\``,
          objectives: [
            'Calculate descriptive statistics',
            'Perform hypothesis testing',
            'Build simple regression models'
          ],
          isFree: false
        }
      ],
      // Month 4: Data Visualization & Business Intelligence
      [
        {
          title: 'Tableau Fundamentals',
          description: 'Creating interactive dashboards with Tableau',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/6xv1KvCMF1Q',
          duration: 45,
          content: `# Tableau Fundamentals

## Getting Started with Tableau
**Key Concepts:**
- **Dimensions**: Categorical fields (Region, Category, Date)
- **Measures**: Numerical fields (Sales, Profit, Quantity)
- **Sheets**: Individual visualizations
- **Dashboards**: Collection of sheets
- **Stories**: Sequence of visualizations

## Creating Basic Charts

### Bar Chart
1. Drag dimension to Rows
2. Drag measure to Columns
3. Sort by clicking sort icon
4. Color by another dimension

### Line Chart
1. Drag date to Columns
2. Drag measure to Rows
3. Add trend line (Analytics pane)
4. Forecast future values

### Scatter Plot
1. Drag measure to Columns
2. Drag another measure to Rows
3. Add dimensions to Color/Size/Detail
4. Add trend line

## Calculations

### Calculated Fields
\`\`\`
# Profit Margin
[Profit] / [Sales]

# Sales Category
IF [Sales] > 10000 THEN "High"
ELSEIF [Sales] > 5000 THEN "Medium"
ELSE "Low"
END

# Year over Year Growth
([Sales] - LOOKUP([Sales], -1)) / LOOKUP([Sales], -1)

# Running Total
RUNNING_SUM(SUM([Sales]))
\`\`\`

### Table Calculations
- Running Total
- Percent of Total
- Rank
- Moving Average
- YoY Growth

## Filters and Parameters
\`\`\`
# Create Parameter
Name: Select Year
Data Type: Integer
Allowable Values: List (2020, 2021, 2022, 2023, 2024)

# Use in Calculated Field
IF YEAR([Date]) = [Select Year] THEN [Sales] END
\`\`\`

## Dashboard Best Practices
✓ Clear title and subtitle
✓ Consistent color scheme
✓ Interactive filters
✓ Appropriate chart types
✓ Mobile-friendly layout
✓ Performance optimization`,
          objectives: [
            'Create various chart types in Tableau',
            'Build calculated fields',
            'Design interactive dashboards'
          ],
          isFree: false
        },
        {
          title: 'Power BI Essentials',
          description: 'Building reports and dashboards in Power BI',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/NNSHu0rkew8',
          duration: 50,
          content: `# Power BI Essentials

## Power BI Components
- **Power BI Desktop**: Create reports
- **Power BI Service**: Share and collaborate
- **Power BI Mobile**: View on mobile devices

## Data Modeling

### Creating Relationships
- One-to-Many (most common)
- Many-to-One
- One-to-One
- Many-to-Many (use bridge tables)

### Star Schema
\`\`\`
Fact Table (Sales):
- DateKey (FK)
- ProductKey (FK)
- CustomerKey (FK)
- Sales Amount
- Quantity

Dimension Tables:
- Date (DateKey, Year, Month, Day)
- Product (ProductKey, Name, Category)
- Customer (CustomerKey, Name, Region)
\`\`\`

## DAX (Data Analysis Expressions)

### Basic Measures
\`\`\`dax
# Total Sales
Total Sales = SUM(Sales[Amount])

# Average Sales
Avg Sales = AVERAGE(Sales[Amount])

# Count of Transactions
Transaction Count = COUNTROWS(Sales)

# Distinct Customers
Unique Customers = DISTINCTCOUNT(Sales[CustomerID])
\`\`\`

### Time Intelligence
\`\`\`dax
# Year to Date
YTD Sales = TOTALYTD([Total Sales], Date[Date])

# Previous Year
PY Sales = CALCULATE([Total Sales], SAMEPERIODLASTYEAR(Date[Date]))

# Year over Year Growth
YoY Growth =
DIVIDE(
    [Total Sales] - [PY Sales],
    [PY Sales]
)

# Moving Average
MA 3 Month =
CALCULATE(
    [Total Sales],
    DATESINPERIOD(Date[Date], LASTDATE(Date[Date]), -3, MONTH)
)
\`\`\`

### Advanced DAX
\`\`\`dax
# Customer Segmentation
Customer Segment =
SWITCH(
    TRUE(),
    [Total Sales] >= 10000, "VIP",
    [Total Sales] >= 5000, "Gold",
    [Total Sales] >= 1000, "Silver",
    "Bronze"
)

# Running Total
Running Total =
CALCULATE(
    [Total Sales],
    FILTER(
        ALL(Date[Date]),
        Date[Date] <= MAX(Date[Date])
    )
)

# Top N Products
Top 10 Products =
IF(
    RANKX(ALL(Product[Name]), [Total Sales], , DESC) <= 10,
    [Total Sales]
)
\`\`\`

## Visualizations
- Bar/Column Charts
- Line Charts
- Pie/Donut Charts
- Tables and Matrices
- Cards (KPIs)
- Slicers
- Maps
- Gauges
- Custom Visuals

## Dashboard Design
**Best Practices:**
1. Use a grid layout
2. Limit to 5-7 visuals per page
3. Use consistent colors
4. Add descriptive titles
5. Include filters and slicers
6. Test on different devices`,
          objectives: [
            'Build data models in Power BI',
            'Create DAX measures',
            'Design professional dashboards'
          ],
          isFree: false
        },
        {
          title: 'Data Storytelling',
          description: 'Presenting insights effectively to stakeholders',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/8EMW7io4rSI',
          duration: 35,
          content: `# Data Storytelling

## Elements of Data Storytelling
1. **Context**: Why does this matter?
2. **Challenge**: What problem are we solving?
3. **Data**: What does the data show?
4. **Insights**: What did we learn?
5. **Action**: What should we do?

## Structuring Your Story

### The Narrative Arc
\`\`\`
1. Set the Scene
   - Business context
   - Current situation
   - Why it matters

2. Introduce the Challenge
   - Problem statement
   - Impact on business
   - Urgency

3. Present the Data
   - Key metrics
   - Trends and patterns
   - Comparisons

4. Reveal Insights
   - What the data tells us
   - Root causes
   - Opportunities

5. Recommend Actions
   - Specific next steps
   - Expected outcomes
   - Timeline
\`\`\`

## Visualization Best Practices

### Choose the Right Chart
\`\`\`
Comparison: Bar chart, column chart
Trend over time: Line chart, area chart
Part-to-whole: Pie chart, stacked bar
Distribution: Histogram, box plot
Relationship: Scatter plot, bubble chart
Ranking: Bar chart, bullet chart
\`\`\`

### Design Principles
- **Simplicity**: Remove unnecessary elements
- **Clarity**: Clear labels and titles
- **Focus**: Highlight key insights
- **Consistency**: Use same colors/fonts
- **Accessibility**: Consider color blindness

### Color Usage
\`\`\`
Sequential: Light to dark for ordered data
Diverging: Two colors for positive/negative
Categorical: Distinct colors for categories
Highlight: One color to emphasize key data

Avoid:
❌ Too many colors (>5-7)
❌ Red/green only (color blind issues)
❌ Rainbow colors for ordered data
\`\`\`

## Presenting to Different Audiences

### Executive Summary
- High-level overview
- Key metrics only
- Clear recommendations
- One page if possible

### Management Report
- More detail on trends
- Drill-down capabilities
- Comparative analysis
- Action items

### Technical Audience
- Detailed methodology
- Statistical significance
- Data quality notes
- Assumptions documented

## Common Mistakes to Avoid
❌ Starting with conclusions
❌ Too much data, no insight
❌ Unclear chart titles
❌ No context for numbers
❌ Misleading visualizations
❌ No call to action`,
          objectives: [
            'Structure data presentations effectively',
            'Choose appropriate visualizations',
            'Present insights to different audiences'
          ],
          isFree: false
        },
        {
          title: 'KPI Design and Business Metrics',
          description: 'Defining and tracking key performance indicators',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/DmzwJ9WaK_w',
          duration: 30,
          content: `# KPI Design and Business Metrics

## What Makes a Good KPI?
**SMART Criteria:**
- **Specific**: Clearly defined
- **Measurable**: Can be quantified
- **Achievable**: Realistic targets
- **Relevant**: Aligned with goals
- **Time-bound**: Specific timeframe

## Types of KPIs

### Financial KPIs
\`\`\`
Revenue Growth Rate = (Current - Previous) / Previous × 100%
Profit Margin = (Net Profit / Revenue) × 100%
ROI = (Gain - Cost) / Cost × 100%
Cash Flow = Cash In - Cash Out
Break-even Point = Fixed Costs / (Price - Variable Cost)
\`\`\`

### Sales KPIs
\`\`\`
Conversion Rate = (Conversions / Visitors) × 100%
Average Deal Size = Total Revenue / Number of Deals
Sales Cycle Length = Average days from lead to close
Customer Acquisition Cost = Marketing Spend / New Customers
Win Rate = (Deals Won / Total Deals) × 100%
\`\`\`

### Marketing KPIs
\`\`\`
Customer Lifetime Value = Average Purchase × Purchase Frequency × Customer Lifespan
CAC Payback Period = CAC / (ARPU × Gross Margin%)
Lead-to-Customer Rate = Customers / Leads × 100%
Cost Per Lead = Marketing Spend / Leads Generated
Email Open Rate = Opens / Emails Sent × 100%
\`\`\`

### Operational KPIs
\`\`\`
On-Time Delivery = On-time Orders / Total Orders × 100%
Inventory Turnover = COGS / Average Inventory
Order Fulfillment Time = Average time from order to delivery
Capacity Utilization = Actual Output / Maximum Output × 100%
Employee Productivity = Output / Number of Employees
\`\`\`

### Customer KPIs
\`\`\`
Net Promoter Score (NPS) = % Promoters - % Detractors
Customer Retention Rate = ((CE - CN) / CS) × 100%
  CE: Customers at end
  CN: New customers
  CS: Customers at start

Customer Churn Rate = Lost Customers / Total Customers × 100%
Customer Satisfaction Score (CSAT) = Satisfied / Total Responses × 100%
\`\`\`

## KPI Dashboard Design
\`\`\`
Structure:
┌─────────────────────────────────┐
│     Executive Summary           │
│  KPI 1   KPI 2   KPI 3   KPI 4  │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│     Trend Analysis              │
│  [Line chart showing trends]    │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│     Breakdown & Details         │
│  [Bar charts, tables, etc.]     │
└─────────────────────────────────┘
\`\`\`

## Best Practices
✓ Limit to 5-7 key metrics per dashboard
✓ Show trends, not just current values
✓ Include targets and benchmarks
✓ Use traffic lights (Red/Yellow/Green)
✓ Update regularly (daily, weekly, monthly)
✓ Make it actionable

## Example KPI Card
\`\`\`
┌──────────────────────┐
│  Monthly Revenue     │
│                      │
│    $1.2M            │
│    ↑ 15% vs LM      │
│                      │
│  Target: $1.0M ✓    │
│  [Progress bar]      │
└──────────────────────┘
\`\`\``,
          objectives: [
            'Define effective KPIs',
            'Calculate business metrics',
            'Design KPI dashboards'
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

    console.log(`\n✅ Successfully populated Data Analysis course!`);
    console.log(`Total modules: ${modules.length}`);
    console.log(`Total lessons: ${lessonsData.flat().length}`);
    console.log(`Total duration: ${totalDuration} minutes (${(totalDuration / 60).toFixed(1)} hours)`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

populateDataAnalysisCourse();
