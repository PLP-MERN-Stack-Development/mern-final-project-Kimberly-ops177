# EduHub Setup Instructions

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)
- Git

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mern-final-project-Kimberly-ops177
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file with your configuration
# - Set MONGODB_URI to your MongoDB connection string
# - Set JWT_SECRET to a secure random string
# - Configure other environment variables as needed
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# The default values should work for local development
```

### 4. Database Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB service
# On macOS:
brew services start mongodb-community

# On Windows:
# MongoDB should start automatically as a service

# On Linux:
sudo systemctl start mongod
```

**Option B: MongoDB Atlas**
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Update MONGODB_URI in backend/.env

### 5. Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
The backend server will start on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will start on http://localhost:5173

### 6. Verify Installation

1. Open http://localhost:5173 in your browser
2. You should see the EduHub homepage
3. Check the backend API at http://localhost:5000
4. You should see a JSON response with API information

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check your connection string
- Verify network access in MongoDB Atlas

### Port Already in Use
- Backend: Change PORT in backend/.env
- Frontend: Vite will automatically try the next available port

### Dependencies Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Development Workflow

1. Make changes to code
2. Changes will hot-reload automatically
3. Test your changes
4. Commit with clear messages
5. Push to GitHub regularly

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Building for Production

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## Next Steps

1. Start building the User model and authentication system
2. Create API endpoints
3. Build frontend components
4. Test features as you build them

## Need Help?

- Check the PROJECT_PLAN.md for project structure
- Review the API documentation (to be created)
- Refer to the Week8-Assignment.md for requirements
