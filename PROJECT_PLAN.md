# EduHub - Learning Platform Project Plan

## Project Overview
EduHub is a comprehensive MERN stack learning management system where instructors can create courses and students can enroll, learn, track progress, and interact in real-time.

## Core Features

### User Management
- User registration/login (JWT authentication)
- Two user roles: Student and Instructor
- User profiles with avatar upload
- Role-based dashboards

### Course Management (Instructor)
- Create, edit, delete courses
- Add course modules and lessons
- Create quizzes/assessments
- View enrolled students
- Track student progress

### Learning Features (Student)
- Browse course catalog with search/filter
- Enroll in courses
- View course content (lessons, videos)
- Take quizzes
- Track personal progress
- Bookmark/favorite courses

### Real-time Features (Socket.io)
- Live Q&A sessions
- Real-time notifications
- Live student count
- Instant messaging

### Social Features
- Course reviews and ratings
- Discussion forums
- Comments on lessons

## Technology Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- Socket.io for real-time features
- Multer for file uploads
- bcrypt for password hashing

### Frontend
- React.js (with Vite)
- React Router for routing
- Context API for state management
- Axios for API calls
- Socket.io-client for real-time
- TailwindCSS for styling
- React Hook Form for forms

### Testing
- Jest for unit tests
- Supertest for API testing
- React Testing Library
- Cypress for E2E tests

### Deployment
- Backend: Render/Railway
- Frontend: Vercel/Netlify
- Database: MongoDB Atlas
- File storage: Cloudinary

## Database Schema

### Collections
1. Users (name, email, password, role, avatar, bio)
2. Courses (title, description, instructor, thumbnail, category, level)
3. Modules (course, title, description, order)
4. Lessons (module, title, content, videoUrl, duration, order)
5. Progress (user, course, completedLessons, percentage)
6. Quizzes (lesson, title, questions, passingScore)
7. QuizAttempts (user, quiz, answers, score, passed)
8. Reviews (course, user, rating, comment)
9. Discussions (course, lesson, user, title, content, replies)

## API Endpoints

### Auth Routes (/api/auth)
- POST /register - Register user
- POST /login - Login user
- GET /me - Get current user
- PUT /profile - Update profile

### Course Routes (/api/courses)
- GET / - Get all courses
- GET /:id - Get single course
- POST / - Create course (instructor)
- PUT /:id - Update course (instructor)
- DELETE /:id - Delete course (instructor)
- POST /:id/enroll - Enroll in course (student)
- GET /my-courses - Get user's courses

### Module/Lesson Routes
- POST /api/modules - Create module
- POST /api/lessons - Create lesson
- GET /api/lessons/:id - Get lesson
- POST /api/lessons/:id/complete - Mark complete

### Progress Routes (/api/progress)
- GET /course/:courseId - Get progress
- PUT /course/:courseId - Update progress

### Quiz Routes (/api/quizzes)
- POST / - Create quiz
- GET /:id - Get quiz
- POST /:id/attempt - Submit attempt
- GET /attempts/:quizId - Get attempts

### Review Routes (/api/reviews)
- POST /course/:courseId - Add review
- GET /course/:courseId - Get reviews

### Discussion Routes (/api/discussions)
- POST / - Create discussion
- GET /course/:courseId - Get discussions
- POST /:id/reply - Reply to discussion

## Development Roadmap

### Phase 1: Backend Foundation (Week 1)
- [x] Project setup and structure
- [ ] Database models and schemas
- [ ] Authentication system (JWT)
- [ ] User CRUD operations
- [ ] Basic error handling

### Phase 2: Course Management (Week 2)
- [ ] Course CRUD operations
- [ ] Module and Lesson management
- [ ] File upload integration
- [ ] Quiz system
- [ ] API testing

### Phase 3: Frontend Foundation (Week 3)
- [x] React project setup
- [x] Basic routing
- [x] Auth pages (login/register)
- [ ] Auth context and protected routes
- [ ] Course catalog page
- [ ] Course detail page

### Phase 4: Dashboards & Real-time (Week 4)
- [ ] Student dashboard
- [ ] Instructor dashboard
- [ ] Course learning interface
- [ ] Socket.io integration
- [ ] Real-time notifications
- [ ] Live Q&A feature

### Phase 5: Polish & Deploy (Week 5)
- [ ] Testing (unit, integration, E2E)
- [ ] Code review and refactoring
- [ ] Accessibility improvements
- [ ] Performance optimization
- [ ] Deployment (backend + frontend)
- [ ] CI/CD setup
- [ ] Documentation
- [ ] Video demonstration

## Next Steps
1. Set up MongoDB database (local or Atlas)
2. Create environment variables
3. Install dependencies
4. Start backend development
5. Build authentication system
