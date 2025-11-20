import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../src/models/Course.js';
import Module from '../src/models/Module.js';
import Lesson from '../src/models/Lesson.js';
import User from '../src/models/User.js';

dotenv.config();

const populateDataEngineeringCourse = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB Connected');

    const course = await Course.findOne({ title: /Data Engineering/i });
    if (!course) {
      console.error('Data Engineering course not found!');
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
      // Month 1: Foundations of Data Engineering
      [
        {
          title: 'Introduction to Data Engineering',
          description: 'Understanding the role and responsibilities of a data engineer',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/qWru-b6m030',
          duration: 25,
          content: `# Introduction to Data Engineering

## What is Data Engineering?
Data Engineering is the practice of designing and building systems for collecting, storing, and analyzing data at scale.

## Key Responsibilities
- Building and maintaining data pipelines
- Ensuring data quality and reliability
- Optimizing data storage and retrieval
- Implementing ETL/ELT processes
- Managing data infrastructure

## Data Engineer vs Data Scientist
| Data Engineer | Data Scientist |
|--------------|----------------|
| Builds infrastructure | Analyzes data |
| ETL/Pipeline development | Machine learning models |
| Database optimization | Statistical analysis |
| Batch and real-time processing | Predictive modeling |

## Required Skills
- Programming (Python, SQL, Scala)
- Database systems (SQL and NoSQL)
- Distributed computing
- Cloud platforms (AWS, GCP, Azure)
- Version control (Git)`,
          objectives: [
            'Understand the role of a data engineer',
            'Differentiate between data roles',
            'Identify key data engineering skills'
          ],
          isFree: true
        },
        {
          title: 'Python for Data Engineering',
          description: 'Essential Python concepts for building data pipelines',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc',
          duration: 40,
          content: `# Python for Data Engineering

## Why Python?
- Rich ecosystem of data libraries
- Easy to read and maintain
- Strong community support
- Integration with big data tools

## Essential Libraries
\`\`\`python
# Data manipulation
import pandas as pd
import numpy as np

# Database connectivity
import psycopg2
from sqlalchemy import create_engine

# API and web scraping
import requests
from bs4 import BeautifulSoup

# Date and time
from datetime import datetime, timedelta
\`\`\`

## Working with Files
\`\`\`python
# Reading CSV files
df = pd.read_csv('data.csv')

# Reading JSON
import json
with open('data.json', 'r') as f:
    data = json.load(f)

# Reading Parquet
df = pd.read_parquet('data.parquet')
\`\`\`

## Data Transformation
\`\`\`python
# Filtering data
filtered_df = df[df['age'] > 25]

# Aggregations
grouped = df.groupby('category').agg({
    'sales': 'sum',
    'quantity': 'mean'
})

# Joining dataframes
merged = pd.merge(df1, df2, on='id', how='inner')
\`\`\``,
          objectives: [
            'Use Python for data processing',
            'Work with common data formats',
            'Perform data transformations'
          ],
          isFree: true
        },
        {
          title: 'SQL Fundamentals for Data Engineers',
          description: 'Advanced SQL techniques for data manipulation',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY',
          duration: 45,
          content: `# SQL Fundamentals

## Advanced SELECT Queries
\`\`\`sql
-- Window functions
SELECT
    product_name,
    sale_amount,
    AVG(sale_amount) OVER (PARTITION BY category) as avg_category_sales,
    ROW_NUMBER() OVER (ORDER BY sale_amount DESC) as rank
FROM sales;

-- CTEs (Common Table Expressions)
WITH monthly_sales AS (
    SELECT
        DATE_TRUNC('month', sale_date) as month,
        SUM(amount) as total_sales
    FROM sales
    GROUP BY month
)
SELECT * FROM monthly_sales WHERE total_sales > 10000;
\`\`\`

## Complex Joins
\`\`\`sql
SELECT
    o.order_id,
    c.customer_name,
    p.product_name,
    od.quantity
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
INNER JOIN order_details od ON o.order_id = od.order_id
INNER JOIN products p ON od.product_id = p.id
WHERE o.order_date >= '2024-01-01';
\`\`\`

## Data Aggregation
\`\`\`sql
SELECT
    category,
    COUNT(*) as product_count,
    AVG(price) as avg_price,
    MIN(price) as min_price,
    MAX(price) as max_price
FROM products
GROUP BY category
HAVING COUNT(*) > 5;
\`\`\``,
          objectives: [
            'Write complex SQL queries',
            'Use window functions',
            'Perform advanced joins'
          ],
          isFree: false
        },
        {
          title: 'Database Design Principles',
          description: 'Normalization, indexing, and schema design',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/ztHopE5Wnpc',
          duration: 35,
          content: `# Database Design Principles

## Normalization
### First Normal Form (1NF)
- Atomic values in each cell
- Each row is unique
- No repeating groups

### Second Normal Form (2NF)
- Must be in 1NF
- All non-key attributes depend on the whole primary key

### Third Normal Form (3NF)
- Must be in 2NF
- No transitive dependencies

## Indexing Strategies
\`\`\`sql
-- B-tree index (default)
CREATE INDEX idx_customer_email ON customers(email);

-- Composite index
CREATE INDEX idx_order_date_customer
ON orders(order_date, customer_id);

-- Unique index
CREATE UNIQUE INDEX idx_user_username ON users(username);

-- Partial index
CREATE INDEX idx_active_users
ON users(email)
WHERE is_active = true;
\`\`\`

## Schema Design Patterns
- Star schema for data warehouses
- Snowflake schema for normalized warehouses
- Slowly Changing Dimensions (SCD Types 1, 2, 3)`,
          objectives: [
            'Apply normalization principles',
            'Design efficient database schemas',
            'Create appropriate indexes'
          ],
          isFree: false
        }
      ],
      // Month 2: Data Processing & ETL Fundamentals
      [
        {
          title: 'ETL vs ELT: Understanding the Difference',
          description: 'Modern approaches to data integration',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/cKGISNsZF4I',
          duration: 30,
          content: `# ETL vs ELT

## ETL (Extract, Transform, Load)
Traditional approach where data is transformed before loading.

\`\`\`python
# ETL Example
def etl_pipeline():
    # Extract
    raw_data = extract_from_source()

    # Transform
    cleaned_data = clean_data(raw_data)
    transformed_data = apply_business_logic(cleaned_data)

    # Load
    load_to_warehouse(transformed_data)
\`\`\`

**Advantages:**
- Data is clean before loading
- Less storage in destination
- Suitable for structured data

## ELT (Extract, Load, Transform)
Modern approach leveraging powerful warehouse compute.

\`\`\`sql
-- ELT Example: Transform after loading
CREATE TABLE transformed_data AS
SELECT
    user_id,
    DATE(timestamp) as date,
    SUM(amount) as total_amount
FROM raw_data
WHERE status = 'completed'
GROUP BY user_id, date;
\`\`\`

**Advantages:**
- Faster initial load
- Leverage warehouse compute
- Flexibility in transformations
- Better for unstructured data`,
          objectives: [
            'Differentiate ETL and ELT',
            'Choose appropriate approach',
            'Implement basic pipelines'
          ],
          isFree: false
        },
        {
          title: 'Introduction to Apache Airflow',
          description: 'Building data pipelines with Airflow',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/AHMm1wfGuHE',
          duration: 50,
          content: `# Apache Airflow

## What is Airflow?
Open-source platform to programmatically author, schedule, and monitor workflows.

## Core Concepts
\`\`\`python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'data-team',
    'depends_on_past': False,
    'start_date': datetime(2024, 1, 1),
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 3,
    'retry_delay': timedelta(minutes=5)
}

dag = DAG(
    'data_pipeline',
    default_args=default_args,
    description='Daily data processing pipeline',
    schedule_interval='0 2 * * *',  # 2 AM daily
    catchup=False
)

def extract_data(**context):
    # Extract logic
    pass

def transform_data(**context):
    # Transform logic
    pass

def load_data(**context):
    # Load logic
    pass

extract_task = PythonOperator(
    task_id='extract',
    python_callable=extract_data,
    dag=dag
)

transform_task = PythonOperator(
    task_id='transform',
    python_callable=transform_data,
    dag=dag
)

load_task = PythonOperator(
    task_id='load',
    python_callable=load_data,
    dag=dag
)

extract_task >> transform_task >> load_task
\`\`\``,
          objectives: [
            'Understand Airflow architecture',
            'Create DAGs',
            'Schedule and monitor pipelines'
          ],
          isFree: false
        },
        {
          title: 'Data Quality and Validation',
          description: 'Ensuring data reliability and accuracy',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/H8NqYbPvSng',
          duration: 35,
          content: `# Data Quality and Validation

## Data Quality Dimensions
- **Accuracy**: Correct representation of reality
- **Completeness**: No missing values
- **Consistency**: Data agrees across systems
- **Timeliness**: Data is up-to-date
- **Validity**: Data conforms to business rules
- **Uniqueness**: No duplicate records

## Data Validation Techniques
\`\`\`python
import pandas as pd

def validate_data(df):
    issues = []

    # Check for null values
    null_counts = df.isnull().sum()
    if null_counts.any():
        issues.append(f"Null values found: {null_counts[null_counts > 0]}")

    # Check for duplicates
    duplicates = df.duplicated().sum()
    if duplicates > 0:
        issues.append(f"Found {duplicates} duplicate rows")

    # Check data types
    if df['amount'].dtype != 'float64':
        issues.append("Amount column has incorrect data type")

    # Check value ranges
    if (df['age'] < 0).any() or (df['age'] > 120).any():
        issues.append("Invalid age values detected")

    # Check referential integrity
    invalid_refs = df[~df['category_id'].isin(valid_categories)]
    if not invalid_refs.empty:
        issues.append(f"Invalid category references: {len(invalid_refs)}")

    return issues
\`\`\`

## Great Expectations Framework
\`\`\`python
import great_expectations as ge

df_ge = ge.from_pandas(df)

# Define expectations
df_ge.expect_column_values_to_not_be_null('user_id')
df_ge.expect_column_values_to_be_unique('email')
df_ge.expect_column_values_to_be_between('age', 0, 120)
\`\`\``,
          objectives: [
            'Implement data quality checks',
            'Use validation frameworks',
            'Monitor data pipelines'
          ],
          isFree: false
        }
      ],
      // Month 3: Big Data Technologies
      [
        {
          title: 'Introduction to Hadoop Ecosystem',
          description: 'Understanding HDFS, MapReduce, and Hadoop components',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/aReuLtY0YMI',
          duration: 35,
          content: `# Hadoop Ecosystem

## Core Components
### HDFS (Hadoop Distributed File System)
- Distributed storage across cluster
- High fault tolerance through replication
- Optimized for large files
- Write once, read many

### MapReduce
- Distributed processing framework
- Map phase: Process and transform
- Reduce phase: Aggregate results

### YARN (Yet Another Resource Negotiator)
- Resource management
- Job scheduling
- Cluster resource allocation

## Hadoop Ecosystem Tools
\`\`\`
Storage Layer:
- HDFS
- HBase (NoSQL database)

Processing Layer:
- MapReduce
- Spark
- Hive (SQL-like queries)
- Pig (data flow language)

Data Ingestion:
- Sqoop (RDBMS to Hadoop)
- Flume (log aggregation)
- Kafka (streaming)

Coordination:
- ZooKeeper
\`\`\`

## When to Use Hadoop
✅ Batch processing of large datasets
✅ Long-term data storage
✅ Complex data transformations
❌ Real-time processing
❌ Small dataset processing`,
          objectives: [
            'Understand Hadoop architecture',
            'Use HDFS for storage',
            'Identify use cases'
          ],
          isFree: false
        },
        {
          title: 'Apache Spark Fundamentals',
          description: 'Fast and general-purpose cluster computing',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/_C8kWso4ne4',
          duration: 50,
          content: `# Apache Spark

## Why Spark?
- 100x faster than Hadoop MapReduce
- In-memory processing
- Unified engine for batch and streaming
- Rich APIs in Python, Scala, Java, R

## Core Concepts
\`\`\`python
from pyspark.sql import SparkSession

# Create Spark session
spark = SparkSession.builder \\
    .appName("DataProcessing") \\
    .config("spark.executor.memory", "4g") \\
    .getOrCreate()

# Read data
df = spark.read \\
    .option("header", "true") \\
    .csv("s3://bucket/data.csv")

# Transformations
filtered_df = df.filter(df['age'] > 21)
grouped_df = df.groupBy('category').count()

# Actions (trigger computation)
result = grouped_df.collect()
df.write.parquet("s3://bucket/output/")
\`\`\`

## Spark SQL
\`\`\`python
# Register as temp view
df.createOrReplaceTempView("users")

# Run SQL queries
result = spark.sql("""
    SELECT category, COUNT(*) as count
    FROM users
    WHERE age > 21
    GROUP BY category
    ORDER BY count DESC
""")
\`\`\`

## Performance Optimization
- Partitioning data
- Broadcast joins for small tables
- Caching frequently used datasets
- Avoiding shuffles`,
          objectives: [
            'Create Spark applications',
            'Process data with DataFrames',
            'Optimize Spark jobs'
          ],
          isFree: false
        },
        {
          title: 'Distributed Computing Concepts',
          description: 'Understanding parallelism and data distribution',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/rKtsbKkq0l0',
          duration: 40,
          content: `# Distributed Computing

## Key Concepts
### Partitioning
Dividing data across multiple nodes for parallel processing.

\`\`\`python
# PySpark partitioning
df = spark.read.csv("data.csv")
print(f"Number of partitions: {df.rdd.getNumPartitions()}")

# Repartition
df_repartitioned = df.repartition(10)

# Partition by column
df_partitioned = df.repartition(10, "category")
\`\`\`

### Data Locality
Processing data where it's stored to minimize network transfer.

### Fault Tolerance
- Data replication
- Lineage tracking
- Automatic recovery

## CAP Theorem
You can only have 2 of 3:
- **Consistency**: All nodes see the same data
- **Availability**: Every request gets a response
- **Partition Tolerance**: System works despite network failures

## Scalability Patterns
- Horizontal scaling (add more nodes)
- Vertical scaling (add more resources to nodes)
- Data sharding
- Load balancing`,
          objectives: [
            'Understand distributed systems',
            'Apply partitioning strategies',
            'Design fault-tolerant systems'
          ],
          isFree: false
        }
      ],
      // Month 4: Data Warehousing & Cloud Platforms
      [
        {
          title: 'Data Warehouse Architecture',
          description: 'Star schema, snowflake schema, and dimensional modeling',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/XEkHBhF5kXo',
          duration: 40,
          content: `# Data Warehouse Architecture

## What is a Data Warehouse?
A centralized repository for storing integrated data from multiple sources for analysis and reporting.

## Dimensional Modeling
### Fact Tables
Store quantitative data (measures):
\`\`\`sql
CREATE TABLE fact_sales (
    sale_id BIGINT PRIMARY KEY,
    date_key INT REFERENCES dim_date(date_key),
    customer_key INT REFERENCES dim_customer(customer_key),
    product_key INT REFERENCES dim_product(product_key),
    store_key INT REFERENCES dim_store(store_key),
    quantity INT,
    unit_price DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    discount_amount DECIMAL(10,2)
);
\`\`\`

### Dimension Tables
Describe the context (who, what, when, where):
\`\`\`sql
CREATE TABLE dim_customer (
    customer_key INT PRIMARY KEY,
    customer_id VARCHAR(50),
    customer_name VARCHAR(100),
    email VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    customer_segment VARCHAR(50)
);
\`\`\`

## Star Schema vs Snowflake Schema
**Star Schema:**
- Denormalized dimensions
- Simple queries
- Faster query performance

**Snowflake Schema:**
- Normalized dimensions
- Saves storage space
- More complex queries

## Slowly Changing Dimensions (SCD)
**Type 1:** Overwrite old data
**Type 2:** Add new row with version
**Type 3:** Add new column for old value`,
          objectives: [
            'Design star and snowflake schemas',
            'Create fact and dimension tables',
            'Handle slowly changing dimensions'
          ],
          isFree: false
        },
        {
          title: 'AWS Data Services Overview',
          description: 'S3, Redshift, Glue, and data lake architecture',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/VCJXqIYaIRE',
          duration: 45,
          content: `# AWS Data Services

## Amazon S3 (Simple Storage Service)
Object storage for data lakes:
\`\`\`python
import boto3

s3 = boto3.client('s3')

# Upload file
s3.upload_file('data.csv', 'my-bucket', 'data/data.csv')

# Download file
s3.download_file('my-bucket', 'data/data.csv', 'local_data.csv')

# List objects
response = s3.list_objects_v2(Bucket='my-bucket', Prefix='data/')
\`\`\`

## Amazon Redshift
Cloud data warehouse:
\`\`\`sql
-- Create table with distribution key
CREATE TABLE sales (
    sale_id INT,
    product_id INT,
    amount DECIMAL(10,2),
    sale_date DATE
)
DISTKEY(product_id)
SORTKEY(sale_date);

-- COPY data from S3
COPY sales FROM 's3://my-bucket/sales/'
IAM_ROLE 'arn:aws:iam::account:role/RedshiftRole'
FORMAT AS PARQUET;
\`\`\`

## AWS Glue
ETL service and data catalog:
\`\`\`python
import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext

# Glue ETL script
glueContext = GlueContext(SparkContext.getOrCreate())

# Read from catalog
datasource = glueContext.create_dynamic_frame.from_catalog(
    database="my_database",
    table_name="raw_data"
)

# Transform
transformed = ApplyMapping.apply(
    frame=datasource,
    mappings=[
        ("old_name", "string", "new_name", "string"),
        ("amount", "string", "amount", "double")
    ]
)

# Write to S3
glueContext.write_dynamic_frame.from_options(
    frame=transformed,
    connection_type="s3",
    connection_options={"path": "s3://output-bucket/"},
    format="parquet"
)
\`\`\`

## Data Lake Architecture
\`\`\`
Raw Zone → S3 (landing area)
Processed Zone → S3 (cleaned data)
Curated Zone → S3 (analytics-ready)
Warehouse → Redshift (aggregated data)
\`\`\``,
          objectives: [
            'Use AWS S3 for data storage',
            'Query data with Redshift',
            'Build ETL with Glue'
          ],
          isFree: false
        },
        {
          title: 'Data Partitioning Strategies',
          description: 'Optimizing query performance with partitioning',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/BnL-lJuuu2w',
          duration: 30,
          content: `# Data Partitioning Strategies

## Why Partition?
- Faster query performance
- Efficient data pruning
- Better data organization
- Cost optimization (scan less data)

## Partitioning Schemes
### Time-based Partitioning
\`\`\`
s3://bucket/data/
  year=2024/
    month=01/
      day=01/
        data.parquet
      day=02/
        data.parquet
    month=02/
      ...
\`\`\`

### Category-based Partitioning
\`\`\`python
# Write partitioned data with Spark
df.write \\
    .partitionBy("year", "month", "day") \\
    .parquet("s3://bucket/partitioned_data/")

# Read with partition pruning
df = spark.read.parquet("s3://bucket/partitioned_data/") \\
    .filter("year = 2024 AND month = 1")
\`\`\`

## Bucketing
\`\`\`python
# Distribute data into buckets
df.write \\
    .bucketBy(100, "user_id") \\
    .sortBy("timestamp") \\
    .saveAsTable("user_events")
\`\`\`

## Best Practices
✅ Partition by query patterns
✅ Avoid too many small files
✅ Use appropriate partition columns
✅ Consider data skew
❌ Don't over-partition
❌ Avoid high cardinality partitions`,
          objectives: [
            'Implement partitioning strategies',
            'Optimize query performance',
            'Choose appropriate partition keys'
          ],
          isFree: false
        }
      ],
      // Month 5: Real-time Data & Streaming
      [
        {
          title: 'Apache Kafka Fundamentals',
          description: 'Building real-time data pipelines with Kafka',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/aj9CDZm0Glc',
          duration: 45,
          content: `# Apache Kafka

## What is Kafka?
Distributed event streaming platform for:
- Pub/sub messaging
- Real-time data pipelines
- Event sourcing
- Stream processing

## Core Concepts
### Topics and Partitions
\`\`\`
Topic: user_events
├── Partition 0: [msg1, msg2, msg3]
├── Partition 1: [msg4, msg5]
└── Partition 2: [msg6, msg7, msg8]
\`\`\`

### Producers
\`\`\`python
from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# Send message
producer.send('user_events', {
    'user_id': 123,
    'event': 'login',
    'timestamp': '2024-01-15T10:30:00'
})

producer.flush()
\`\`\`

### Consumers
\`\`\`python
from kafka import KafkaConsumer

consumer = KafkaConsumer(
    'user_events',
    bootstrap_servers=['localhost:9092'],
    auto_offset_reset='earliest',
    group_id='analytics_group',
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)

for message in consumer:
    print(f"Received: {message.value}")
    # Process the event
\`\`\`

## Kafka Architecture
- **Brokers**: Kafka servers
- **ZooKeeper**: Coordination service
- **Consumer Groups**: Scalable consumers
- **Offsets**: Message position tracking

## Key Features
- High throughput (millions of messages/sec)
- Low latency (< 10ms)
- Fault tolerance through replication
- Horizontal scalability`,
          objectives: [
            'Understand Kafka architecture',
            'Produce and consume messages',
            'Build real-time pipelines'
          ],
          isFree: false
        },
        {
          title: 'Spark Streaming for Real-time Processing',
          description: 'Processing streaming data with Spark',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/BKKUyVhp_LI',
          duration: 50,
          content: `# Spark Streaming

## Structured Streaming
\`\`\`python
from pyspark.sql import SparkSession
from pyspark.sql.functions import *

spark = SparkSession.builder \\
    .appName("StreamProcessing") \\
    .getOrCreate()

# Read from Kafka
df = spark.readStream \\
    .format("kafka") \\
    .option("kafka.bootstrap.servers", "localhost:9092") \\
    .option("subscribe", "user_events") \\
    .load()

# Parse JSON data
parsed_df = df.select(
    from_json(col("value").cast("string"), schema).alias("data")
).select("data.*")

# Windowed aggregation
windowed_counts = parsed_df \\
    .withWatermark("timestamp", "10 minutes") \\
    .groupBy(
        window("timestamp", "5 minutes", "1 minute"),
        "event_type"
    ) \\
    .count()

# Write to sink
query = windowed_counts.writeStream \\
    .outputMode("update") \\
    .format("parquet") \\
    .option("path", "s3://bucket/output/") \\
    .option("checkpointLocation", "s3://bucket/checkpoint/") \\
    .start()

query.awaitTermination()
\`\`\`

## Windowing Operations
\`\`\`python
# Tumbling window (non-overlapping)
tumbling = df.groupBy(
    window("timestamp", "10 minutes")
).count()

# Sliding window (overlapping)
sliding = df.groupBy(
    window("timestamp", "10 minutes", "5 minutes")
).count()

# Session window
session = df.groupBy(
    session_window("timestamp", "30 minutes")
).count()
\`\`\`

## Watermarking
Handling late-arriving data:
\`\`\`python
df.withWatermark("timestamp", "1 hour") \\
    .groupBy("user_id") \\
    .count()
\`\`\``,
          objectives: [
            'Process streaming data with Spark',
            'Implement windowed aggregations',
            'Handle late data with watermarking'
          ],
          isFree: false
        },
        {
          title: 'Event-Driven Architecture',
          description: 'Designing event-driven data systems',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/STKCRSUsyP0',
          duration: 35,
          content: `# Event-Driven Architecture

## Core Principles
- Events as first-class citizens
- Loose coupling between services
- Asynchronous communication
- Event sourcing and CQRS

## Event Design
\`\`\`json
{
  "event_id": "evt_123456",
  "event_type": "order.placed",
  "event_version": "1.0",
  "timestamp": "2024-01-15T10:30:00Z",
  "source": "order-service",
  "data": {
    "order_id": "ord_789",
    "customer_id": "cust_456",
    "items": [...],
    "total_amount": 99.99
  },
  "metadata": {
    "correlation_id": "req_abc123",
    "user_id": "user_789"
  }
}
\`\`\`

## Event Processing Patterns
### Event Notification
Simple notification that something happened.

### Event-Carried State Transfer
Event contains all necessary data.

### Event Sourcing
\`\`\`python
# Store all events
events = [
    {"type": "account.created", "data": {"balance": 0}},
    {"type": "deposit", "data": {"amount": 100}},
    {"type": "withdrawal", "data": {"amount": 30}},
    {"type": "deposit", "data": {"amount": 50}}
]

# Rebuild state from events
def calculate_balance(events):
    balance = 0
    for event in events:
        if event["type"] == "deposit":
            balance += event["data"]["amount"]
        elif event["type"] == "withdrawal":
            balance -= event["data"]["amount"]
    return balance
\`\`\`

## Benefits
✅ Scalability and flexibility
✅ Real-time processing
✅ Audit trail and replay capability
✅ Decoupled systems

## Challenges
⚠ Event schema evolution
⚠ Ordering guarantees
⚠ Exactly-once processing
⚠ Error handling and dead letter queues`,
          objectives: [
            'Design event-driven systems',
            'Implement event processing patterns',
            'Handle event schema evolution'
          ],
          isFree: false
        }
      ],
      // Month 6: Advanced Topics & Capstone
      [
        {
          title: 'Data Governance and Security',
          description: 'Implementing data governance frameworks',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/wFQ8k0vLWk8',
          duration: 35,
          content: `# Data Governance and Security

## Data Governance Framework
### Data Quality
- Profiling and monitoring
- Validation rules
- Quality metrics and KPIs

### Data Lineage
Tracking data flow from source to destination:
\`\`\`
Source DB → Extraction → Transformation → Data Lake → Warehouse → BI Tool
\`\`\`

### Data Catalog
- Metadata management
- Data discovery
- Business glossary
- Data ownership

## Security Best Practices
### Encryption
\`\`\`python
# Encrypt data at rest
aws s3api put-object \\
    --bucket my-bucket \\
    --key data.parquet \\
    --server-side-encryption AES256

# Encrypt in transit (TLS/SSL)
spark.conf.set("spark.ssl.enabled", "true")
\`\`\`

### Access Control
\`\`\`sql
-- Row-level security
CREATE POLICY sales_policy ON sales
FOR SELECT
TO sales_team
USING (region = current_user_region());

-- Column-level security
GRANT SELECT (id, name, email) ON users TO analysts;
\`\`\`

### Data Masking
\`\`\`python
# Mask sensitive data
df = df.withColumn(
    "masked_ssn",
    concat(lit("XXX-XX-"), substring("ssn", -4, 4))
)
\`\`\`

## Compliance
- GDPR (data privacy)
- CCPA (California privacy)
- HIPAA (healthcare)
- SOX (financial reporting)`,
          objectives: [
            'Implement data governance',
            'Apply security best practices',
            'Ensure regulatory compliance'
          ],
          isFree: false
        },
        {
          title: 'CI/CD for Data Pipelines',
          description: 'Automating pipeline deployment and testing',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/rXRydQF2XFI',
          duration: 40,
          content: `# CI/CD for Data Pipelines

## Version Control
\`\`\`bash
# Git workflow for data pipelines
git checkout -b feature/new-pipeline
# Make changes
git add .
git commit -m "Add customer analytics pipeline"
git push origin feature/new-pipeline
# Create pull request
\`\`\`

## Pipeline Testing
\`\`\`python
import pytest
from pipelines.etl import transform_data

def test_transform_data():
    # Arrange
    input_data = [
        {"id": 1, "amount": "100.50"},
        {"id": 2, "amount": "200.75"}
    ]

    # Act
    result = transform_data(input_data)

    # Assert
    assert result[0]["amount"] == 100.50
    assert isinstance(result[0]["amount"], float)
    assert len(result) == 2

def test_data_quality():
    df = load_test_data()

    # No nulls in required columns
    assert df["user_id"].isnull().sum() == 0

    # Valid date range
    assert df["date"].min() >= "2024-01-01"
\`\`\`

## CI/CD Pipeline (GitHub Actions)
\`\`\`yaml
name: Data Pipeline CI/CD

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

      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.9

      - name: Install dependencies
        run: |
          pip install -r requirements.txt

      - name: Run tests
        run: |
          pytest tests/

      - name: Lint code
        run: |
          flake8 pipelines/

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          # Deploy Airflow DAGs
          aws s3 cp dags/ s3://airflow-dags/ --recursive
\`\`\``,
          objectives: [
            'Implement pipeline testing',
            'Set up CI/CD workflows',
            'Automate deployments'
          ],
          isFree: false
        },
        {
          title: 'Performance Optimization Techniques',
          description: 'Optimizing data pipeline performance',
          type: 'recorded',
          videoUrl: 'https://www.youtube.com/embed/daXHdFFnCCo',
          duration: 45,
          content: `# Performance Optimization

## Query Optimization
\`\`\`sql
-- Use appropriate indexes
CREATE INDEX idx_user_created ON users(created_at);

-- Avoid SELECT *
SELECT id, name, email FROM users WHERE active = true;

-- Use partitioning for large tables
SELECT * FROM sales
WHERE sale_date BETWEEN '2024-01-01' AND '2024-01-31';

-- Materialized views for complex queries
CREATE MATERIALIZED VIEW sales_summary AS
SELECT
    product_id,
    DATE_TRUNC('month', sale_date) as month,
    SUM(amount) as total_sales
FROM sales
GROUP BY product_id, month;
\`\`\`

## Spark Optimization
\`\`\`python
# Caching frequently used data
df_cached = df.cache()

# Broadcast small tables
from pyspark.sql.functions import broadcast
result = large_df.join(broadcast(small_df), "id")

# Repartition for better parallelism
df_optimized = df.repartition(200, "user_id")

# Use appropriate file formats
df.write.parquet("output/")  # Better than CSV

# Predicate pushdown
df = spark.read.parquet("data/") \\
    .filter("date >= '2024-01-01'")  # Pushes filter to file scan
\`\`\`

## Data Storage Optimization
\`\`\`python
# Columnar formats (Parquet, ORC)
# - Better compression
# - Column pruning
# - Predicate pushdown

# Compression
df.write \\
    .option("compression", "snappy") \\
    .parquet("output/")

# Partitioning
df.write \\
    .partitionBy("year", "month") \\
    .parquet("partitioned_output/")
\`\`\`

## Monitoring and Profiling
\`\`\`python
# Spark UI for performance analysis
# - Job execution timeline
# - Stage details
# - Task distribution
# - Memory usage

# Query execution plan
df.explain(extended=True)
\`\`\``,
          objectives: [
            'Optimize query performance',
            'Tune Spark applications',
            'Improve data storage efficiency'
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

    console.log(`\n✅ Successfully populated Data Engineering course!`);
    console.log(`Total modules: ${modules.length}`);
    console.log(`Total lessons: ${lessonsData.flat().length}`);
    console.log(`Total duration: ${totalDuration} minutes (${(totalDuration / 60).toFixed(1)} hours)`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

populateDataEngineeringCourse();
