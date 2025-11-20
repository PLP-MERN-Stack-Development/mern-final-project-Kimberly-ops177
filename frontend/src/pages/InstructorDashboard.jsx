import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const InstructorDashboard = () => {
  const { user } = useAuth();

  // Placeholder data - will be fetched from API later
  const myCourses = [];
  const recentStudents = [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Manage your courses and engage with your students.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Courses</p>
                <p className="text-3xl font-bold text-primary-600">
                  {myCourses.length}
                </p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Students</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Published</p>
                <p className="text-3xl font-bold text-blue-600">0</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Avg Rating</p>
                <p className="text-3xl font-bold text-yellow-600">-</p>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* My Courses */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">My Courses</h2>
                <Link
                  to="/dashboard/instructor/courses/new"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition font-semibold"
                >
                  + Create Course
                </Link>
              </div>

              {myCourses.length > 0 ? (
                <div className="space-y-4">
                  {myCourses.map((course) => (
                    <div
                      key={course.id}
                      className="border rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">
                            {course.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>👥 {course.students || 0} students</span>
                            <span>⭐ {course.rating || 'N/A'}</span>
                            <span
                              className={`px-2 py-1 rounded ${
                                course.published
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {course.published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            to={`/dashboard/instructor/courses/${course.id}/edit`}
                            className="text-primary-600 hover:text-primary-700 font-semibold"
                          >
                            Edit
                          </Link>
                          <Link
                            to={`/courses/${course.id}`}
                            className="text-gray-600 hover:text-gray-700 font-semibold"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No courses yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Create your first course and start teaching!
                  </p>
                  <Link
                    to="/dashboard/instructor/courses/new"
                    className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
                  >
                    + Create Your First Course
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Students */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
              <h2 className="text-2xl font-bold mb-4">Recent Enrollments</h2>
              {recentStudents.length > 0 ? (
                <div className="space-y-3">
                  {recentStudents.map((student, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b"
                    >
                      <div>
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-sm text-gray-600">
                          Enrolled in {student.course}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {student.date}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No recent enrollments
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/dashboard/instructor/courses/new"
                  className="block w-full text-left px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition"
                >
                  + Create Course
                </Link>
                <Link
                  to="/dashboard/instructor/courses"
                  className="block w-full text-left px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                >
                  Manage Courses
                </Link>
                <Link
                  to="/dashboard/instructor/students"
                  className="block w-full text-left px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                >
                  View Students
                </Link>
                <Link
                  to="/auth/profile"
                  className="block w-full text-left px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                >
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Teaching Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Teaching Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-semibold">$0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Course Completion</span>
                  <span className="font-semibold">0%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg. Rating</span>
                  <span className="font-semibold">N/A</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-primary-50 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-primary-800 mb-2">
                💡 Teaching Tip
              </h3>
              <p className="text-sm text-primary-700">
                Engage with your students regularly through discussions and Q&A
                sessions to improve course completion rates!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
