import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getEnrolledCourses } from '../services/courseService';
import { getStudentAttendanceSummary } from '../services/lessonService';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const recentActivity = [];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch enrolled courses
      const coursesResponse = await getEnrolledCourses();
      if (coursesResponse.success) {
        setEnrolledCourses(coursesResponse.data.courses);
      }

      // Fetch attendance summary
      const attendanceResponse = await getStudentAttendanceSummary();
      if (attendanceResponse.success) {
        setAttendanceData(attendanceResponse.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Continue your learning journey and track your progress.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Enrolled Courses</p>
                <p className="text-3xl font-bold text-primary-600">
                  {enrolledCourses.length}
                </p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed Courses</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">In Progress</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {enrolledCourses.length}
                </p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Enrolled Courses */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">My Courses</h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading your courses...</p>
                </div>
              ) : enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <div
                      key={course._id}
                      className="border rounded-lg p-4 hover:shadow-md transition"
                    >
                      <h3 className="font-semibold text-lg mb-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {course.duration} mins
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {course.level}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Progress: 0%
                        </div>
                        <Link
                          to={`/courses/${course._id}`}
                          className="text-primary-600 hover:text-primary-700 font-semibold"
                        >
                          Continue →
                        </Link>
                      </div>
                      {/* Progress Bar */}
                      <div className="mt-3 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: '0%' }}
                        ></div>
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
                    Start your learning journey by browsing our course catalog
                  </p>
                  <Link
                    to="/courses"
                    className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
                  >
                    Browse Courses
                  </Link>
                </div>
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
                  to="/courses"
                  className="block w-full text-left px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition"
                >
                  Browse Courses
                </Link>
                <Link
                  to="/dashboard/student/bookmarks"
                  className="block w-full text-left px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                >
                  My Bookmarks
                </Link>
                <Link
                  to="/auth/profile"
                  className="block w-full text-left px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                >
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {activity.message}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No recent activity</p>
              )}
            </div>

            {/* Attendance Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Class Attendance</h3>
              {attendanceData ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Classes Attended</span>
                    <span className="font-semibold text-green-600">{attendanceData.totalClassesAttended}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Hours</span>
                    <span className="font-semibold text-blue-600">{attendanceData.totalHoursAttended}h</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="text-xs font-semibold text-gray-700 mb-2">By Instructor:</div>
                    {attendanceData.attendanceByInstructor && attendanceData.attendanceByInstructor.map((item, index) => (
                      <div key={index} className="flex justify-between text-xs mb-2">
                        <span className="text-gray-600">{item.instructor}</span>
                        <span className="font-medium">{item.classes} classes ({item.hours}h)</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">Loading attendance data...</div>
              )}
            </div>

            {/* Learning Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Learning Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Hours</span>
                  <span className="font-semibold">{attendanceData?.totalHoursAttended || 0}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Lessons Completed</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Quizzes Passed</span>
                  <span className="font-semibold">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Classes Section */}
        {attendanceData && attendanceData.recentClasses && attendanceData.recentClasses.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-4">Recent Classes Attended</h3>
            <div className="space-y-4">
              {attendanceData.recentClasses.map((cls, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">{cls.title}</h4>
                      <p className="text-sm text-gray-600">Instructor: {cls.instructor}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(cls.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">{cls.duration} mins</div>
                      <div className="text-xs text-gray-500">Duration</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
