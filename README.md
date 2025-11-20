# EduHub - Learning Management System

A comprehensive MERN stack learning platform where instructors can create courses and students can enroll, learn, track progress, and interact in real-time.

## Project Overview

EduHub is a full-featured Learning Management System (LMS) built with the MERN stack that enables:
- **Instructors** to create and manage courses, modules, lessons, and quizzes
- **Students** to browse courses, enroll, learn, and track their progress
- **Real-time interaction** through live Q&A, notifications, and messaging
- **Social features** including course reviews, ratings, and discussion forums

## Features

### User Management
- JWT-based authentication and authorization
- Two user roles: Student and Instructor
- User profiles with avatar upload
- Role-based dashboards

### Course Management (Instructor)
- Create, edit, and delete courses
- Organize content with modules and lessons
- Create quizzes and assessments
- Track enrolled students and their progress

### Learning Features (Student)
- Browse course catalog with search and filters
- Enroll in courses
- Access course content (lessons, videos)
- Take quizzes and track progress
- Bookmark favorite courses

### Real-time Features
- Live Q&A sessions
- Instant notifications
- Real-time student count
- Live messaging

### Social Features
- Course reviews and ratings
- Discussion forums per course
- Comments on lessons

## Technology Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- Socket.io for real-time features
- Multer & Cloudinary for file uploads
- bcrypt for password hashing

### Frontend
- React.js with Vite
- React Router for navigation
- Context API for state management
- Axios for API calls
- Socket.io-client for real-time updates
- TailwindCSS for styling
- React Hook Form for form handling

### Testing & Deployment
- Jest & Supertest for backend testing
- React Testing Library for frontend testing
- Cypress for E2E testing
- Backend: Render/Railway
- Frontend: Vercel/Netlify
- Database: MongoDB Atlas

## Project Structure

```
mern-final-project-Kimberly-ops177/
├── backend/
│   ├── src/
│   │   ├── config/         # Database and app configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions
│   │   ├── tests/          # Test files
│   │   └── server.js       # Entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # Context providers
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Helper functions
│   │   └── assets/         # Static assets
│   ├── package.json
│   └── .env.example
├── PROJECT_PLAN.md         # Detailed project plan
├── SETUP.md               # Setup instructions
└── README.md              # This file
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-final-project-Kimberly-ops177
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   ```

4. **Start Development Servers**

   Terminal 1 (Backend):
   ```bash
   cd backend
   npm run dev
   ```

   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

For detailed setup instructions, see [SETUP.md](SETUP.md).

## Development Status

### Completed
- [x] Project planning and architecture design
- [x] Database schema design
- [x] API endpoint planning
- [x] Project structure setup
- [x] Basic frontend pages (Home, Login, Register, Courses)
- [x] Backend server configuration
- [x] Environment configuration

### In Progress
- [ ] User authentication system
- [ ] Database models implementation
- [ ] API endpoints development
- [ ] Frontend authentication flow
- [ ] Course management features

### Upcoming
- [ ] Real-time features with Socket.io
- [ ] Testing suite implementation
- [ ] Deployment configuration
- [ ] Documentation completion
- [ ] Video demonstration

## API Documentation

API documentation will be available at `/api/docs` once implemented.

### Main Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (instructor)
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/:id/enroll` - Enroll in course (student)

Full API documentation is being developed.

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## Deployment

Deployment instructions will be added once the application is ready for production.

- **Live Application**: [URL to be added]
- **Video Demo**: [URL to be added]

## Contributing

This is a student capstone project. For any questions or issues:
1. Check the [PROJECT_PLAN.md](PROJECT_PLAN.md)
2. Review the [SETUP.md](SETUP.md)
3. Refer to the assignment instructions in [Week8-Assignment.md](Week8-Assignment.md)

## License

This project is part of a course assignment.

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Socket.io Documentation](https://socket.io/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs) 