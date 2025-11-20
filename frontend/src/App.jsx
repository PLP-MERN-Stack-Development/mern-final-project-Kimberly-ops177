import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CoursePath from './pages/CoursePath';
import PathwayProgress from './pages/PathwayProgress';
import CourseDetail from './pages/CourseDetail';
import ModuleDetail from './pages/ModuleDetail';
import LessonDetail from './pages/LessonDetail';
import ClassSessions from './pages/ClassSessions';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import CreateCourse from './pages/CreateCourse';
import Certifications from './pages/Certifications';
import NotFound from './pages/NotFound';

// Context Providers
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/pathways" element={<CoursePath />} />
              <Route path="/pathway/:pathwayName" element={<PathwayProgress />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/module/:moduleId" element={<ModuleDetail />} />
              <Route path="/lesson/:lessonId" element={<LessonDetail />} />
              <Route
                path="/sessions"
                element={
                  <ProtectedRoute requiredRole="student">
                    <ClassSessions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/certifications"
                element={
                  <ProtectedRoute requiredRole="student">
                    <Certifications />
                  </ProtectedRoute>
                }
              />

              {/* Student Dashboard Routes */}
              <Route
                path="/dashboard/student"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Instructor Dashboard Routes */}
              <Route
                path="/dashboard/instructor"
                element={
                  <ProtectedRoute requiredRole="instructor">
                    <InstructorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/instructor/courses/new"
                element={
                  <ProtectedRoute requiredRole="instructor">
                    <CreateCourse />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
