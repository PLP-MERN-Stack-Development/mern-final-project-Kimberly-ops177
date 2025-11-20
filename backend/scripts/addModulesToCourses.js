import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Course from '../src/models/Course.js';
import Module from '../src/models/Module.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const addModulesToCourses = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Get all courses
    const courses = await Course.find();

    // Find courses by title
    const dataEngineering = courses.find(c => c.title.includes('Data Engineering'));
    const dataScience = courses.find(c => c.title.includes('Data Science'));
    const dataAnalysis = courses.find(c => c.title.includes('Data Analysis'));
    const softwareTesting = courses.find(c => c.title.includes('Software Testing'));
    const flutterDart = courses.find(c => c.title.includes('Flutter'));

    // Data Engineering Bootcamp Modules (6 months)
    if (dataEngineering) {
      console.log('\nCreating modules for Data Engineering Bootcamp...');
      const deModules = [
        {
          course: dataEngineering._id,
          title: 'Month 1: Foundations of Data Engineering',
          description: 'Introduction to data engineering concepts, Python programming for data, SQL fundamentals, database design principles, and version control with Git.',
          order: 1
        },
        {
          course: dataEngineering._id,
          title: 'Month 2: Data Processing & ETL Fundamentals',
          description: 'ETL vs ELT processes, data transformation techniques, Apache Airflow basics, building data pipelines, and handling data quality issues.',
          order: 2
        },
        {
          course: dataEngineering._id,
          title: 'Month 3: Big Data Technologies',
          description: 'Introduction to Hadoop ecosystem, Apache Spark fundamentals, distributed computing concepts, processing large-scale datasets, and Spark SQL.',
          order: 3
        },
        {
          course: dataEngineering._id,
          title: 'Month 4: Data Warehousing & Cloud Platforms',
          description: 'Data warehouse architecture, star and snowflake schemas, AWS/GCP/Azure data services, cloud-based data lakes, and data partitioning strategies.',
          order: 4
        },
        {
          course: dataEngineering._id,
          title: 'Month 5: Real-time Data & Streaming',
          description: 'Kafka fundamentals, stream processing with Spark Streaming, real-time data pipelines, event-driven architecture, and monitoring streaming applications.',
          order: 5
        },
        {
          course: dataEngineering._id,
          title: 'Month 6: Advanced Topics & Capstone Project',
          description: 'Data governance and security, CI/CD for data pipelines, orchestration best practices, performance optimization, and building an end-to-end data engineering project.',
          order: 6
        }
      ];

      for (const moduleData of deModules) {
        await Module.create(moduleData);
      }
      console.log('✓ Data Engineering modules created');
    }

    // Data Science Masterclass Modules (8 months)
    if (dataScience) {
      console.log('\nCreating modules for Data Science Masterclass...');
      const dsModules = [
        {
          course: dataScience._id,
          title: 'Month 1: Python Programming & Statistics Foundation',
          description: 'Python basics, NumPy, Pandas, data manipulation, descriptive statistics, probability theory, and statistical hypothesis testing.',
          order: 1
        },
        {
          course: dataScience._id,
          title: 'Month 2: Data Visualization & Exploratory Analysis',
          description: 'Matplotlib, Seaborn, Plotly, data cleaning techniques, exploratory data analysis (EDA), feature engineering, and storytelling with data.',
          order: 2
        },
        {
          course: dataScience._id,
          title: 'Month 3: Machine Learning Fundamentals',
          description: 'Supervised vs unsupervised learning, linear/logistic regression, decision trees, random forests, model evaluation metrics, and cross-validation.',
          order: 3
        },
        {
          course: dataScience._id,
          title: 'Month 4: Advanced Machine Learning',
          description: 'Gradient boosting (XGBoost, LightGBM), ensemble methods, hyperparameter tuning, handling imbalanced data, and feature selection techniques.',
          order: 4
        },
        {
          course: dataScience._id,
          title: 'Month 5: Deep Learning & Neural Networks',
          description: 'Neural network architectures, TensorFlow/PyTorch, CNNs, RNNs, transfer learning, and building deep learning models.',
          order: 5
        },
        {
          course: dataScience._id,
          title: 'Month 6: Natural Language Processing (NLP)',
          description: 'Text preprocessing, word embeddings, sentiment analysis, named entity recognition, transformers, and BERT models.',
          order: 6
        },
        {
          course: dataScience._id,
          title: 'Month 7: Computer Vision & Time Series',
          description: 'Image classification, object detection, YOLO, time series forecasting, ARIMA, LSTM for sequences, and anomaly detection.',
          order: 7
        },
        {
          course: dataScience._id,
          title: 'Month 8: Model Deployment & Capstone Project',
          description: 'MLOps fundamentals, model deployment with Flask/FastAPI, Docker containers, cloud deployment (AWS/GCP), and building a complete data science solution.',
          order: 8
        }
      ];

      for (const moduleData of dsModules) {
        await Module.create(moduleData);
      }
      console.log('✓ Data Science modules created');
    }

    // Data Analysis Course Modules (4 months)
    if (dataAnalysis) {
      console.log('\nCreating modules for Data Analysis course...');
      const daModules = [
        {
          course: dataAnalysis._id,
          title: 'Month 1: Excel Mastery for Data Analysis',
          description: 'Excel functions (VLOOKUP, INDEX-MATCH), pivot tables, conditional formatting, data validation, Power Query, and building dynamic dashboards.',
          order: 1
        },
        {
          course: dataAnalysis._id,
          title: 'Month 2: SQL for Data Analysis',
          description: 'SQL basics, joins, subqueries, window functions, aggregations, CTEs (Common Table Expressions), query optimization, and working with real databases.',
          order: 2
        },
        {
          course: dataAnalysis._id,
          title: 'Month 3: Python & Pandas for Analysis',
          description: 'Python fundamentals, Pandas DataFrame operations, data cleaning, merging datasets, groupby operations, time series analysis, and statistical analysis.',
          order: 3
        },
        {
          course: dataAnalysis._id,
          title: 'Month 4: Data Visualization & Business Intelligence',
          description: 'Tableau fundamentals, Power BI essentials, creating interactive dashboards, data storytelling, KPI design, and presenting insights to stakeholders.',
          order: 4
        }
      ];

      for (const moduleData of daModules) {
        await Module.create(moduleData);
      }
      console.log('✓ Data Analysis modules created');
    }

    // Software Testing & QA Bootcamp Modules (5 months)
    if (softwareTesting) {
      console.log('\nCreating modules for Software Testing Bootcamp...');
      const stModules = [
        {
          course: softwareTesting._id,
          title: 'Month 1: Testing Fundamentals & Manual Testing',
          description: 'Software development lifecycle, testing principles, test planning, test case design, defect management, exploratory testing, and QA methodologies.',
          order: 1
        },
        {
          course: softwareTesting._id,
          title: 'Month 2: Automation Testing with Selenium',
          description: 'Selenium WebDriver, locator strategies, Page Object Model, TestNG framework, assertions, handling dynamic elements, and cross-browser testing.',
          order: 2
        },
        {
          course: softwareTesting._id,
          title: 'Month 3: Modern Testing with Cypress & JavaScript',
          description: 'JavaScript for testers, Cypress fundamentals, writing end-to-end tests, API testing, fixtures and mocks, CI/CD integration, and test reporting.',
          order: 3
        },
        {
          course: softwareTesting._id,
          title: 'Month 4: API Testing & Performance Testing',
          description: 'REST API concepts, Postman automation, REST Assured, API test frameworks, JMeter basics, load testing, stress testing, and performance monitoring.',
          order: 4
        },
        {
          course: softwareTesting._id,
          title: 'Month 5: Advanced QA & DevOps Integration',
          description: 'CI/CD pipelines with Jenkins/GitHub Actions, test automation best practices, mobile testing basics, security testing fundamentals, and building a comprehensive testing project.',
          order: 5
        }
      ];

      for (const moduleData of stModules) {
        await Module.create(moduleData);
      }
      console.log('✓ Software Testing modules created');
    }

    // Flutter & Dart Mobile Development Modules (6 months)
    if (flutterDart) {
      console.log('\nCreating modules for Flutter & Dart course...');
      const fdModules = [
        {
          course: flutterDart._id,
          title: 'Month 1: Dart Programming Fundamentals',
          description: 'Dart syntax, variables and data types, control flow, functions, OOP concepts, classes and objects, inheritance, and asynchronous programming.',
          order: 1
        },
        {
          course: flutterDart._id,
          title: 'Month 2: Flutter Basics & UI Development',
          description: 'Flutter architecture, widgets (Stateless vs Stateful), layouts (Row, Column, Stack), styling, Material Design, Cupertino widgets, and building responsive UIs.',
          order: 2
        },
        {
          course: flutterDart._id,
          title: 'Month 3: State Management & Navigation',
          description: 'setState, Provider, Riverpod, BLoC pattern, navigation and routing, passing data between screens, named routes, and managing app state effectively.',
          order: 3
        },
        {
          course: flutterDart._id,
          title: 'Month 4: Backend Integration & Firebase',
          description: 'REST API integration, HTTP requests, JSON parsing, Firebase Authentication, Firestore database, Cloud Storage, push notifications, and real-time data sync.',
          order: 4
        },
        {
          course: flutterDart._id,
          title: 'Month 5: Advanced Features & Native Integration',
          description: 'Local storage (SharedPreferences, SQLite), camera and gallery access, geolocation, maps integration, platform channels, native code integration, and animations.',
          order: 5
        },
        {
          course: flutterDart._id,
          title: 'Month 6: App Deployment & Capstone Project',
          description: 'App icons and splash screens, build configurations, publishing to Google Play Store, Apple App Store submission, app signing, and building a full-featured mobile application.',
          order: 6
        }
      ];

      for (const moduleData of fdModules) {
        await Module.create(moduleData);
      }
      console.log('✓ Flutter & Dart modules created');
    }

    console.log('\n✅ All modules created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addModulesToCourses();
