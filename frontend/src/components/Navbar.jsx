import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold hover:text-yellow-300 transition">
            EduHub
          </Link>

          <div className="flex gap-6 items-center">
            <Link to="/courses" className="hover:text-yellow-300 transition">
              Courses
            </Link>
            <Link to="/pathways" className="hover:text-yellow-300 transition">
              Learning Pathways
            </Link>

            {isAuthenticated() ? (
              <>
                {/* Class Sessions link for students */}
                {user?.role === 'student' && (
                  <>
                    <Link to="/sessions" className="hover:text-yellow-300 transition">
                      Class Sessions
                    </Link>
                    <Link to="/certifications" className="hover:text-yellow-300 transition">
                      Certifications
                    </Link>
                  </>
                )}

                {/* Dashboard link based on role */}
                {user?.role === 'instructor' ? (
                  <Link
                    to="/dashboard/instructor"
                    className="hover:text-yellow-300 transition"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard/student"
                    className="hover:text-yellow-300 transition"
                  >
                    My Learning
                  </Link>
                )}

                {/* User info */}
                <div className="flex items-center gap-3">
                  <span className="text-sm">
                    Welcome, <span className="font-semibold text-yellow-300">{user?.name}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-300 transition font-semibold"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-yellow-300 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-300 transition font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
