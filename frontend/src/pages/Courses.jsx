import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCourses, courseCategories, courseLevels, enrollInCourse, withdrawFromCourse, getEnrolledCourses } from '../services/courseService';
import { useAuth } from '../context/AuthContext';

const Courses = () => {
  const { isAuthenticated, user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    level: ''
  });

  useEffect(() => {
    fetchCourses();
    if (isAuthenticated() && user?.role === 'student') {
      fetchEnrolledCourses();
    }
  }, []);

  const fetchCourses = async (filterParams = {}) => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllCourses(filterParams);
      if (response.success) {
        setCourses(response.data.courses);
      }
    } catch (err) {
      setError(err.message || 'Failed to load courses');
      console.error('Fetch courses error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const response = await getEnrolledCourses();
      if (response.success) {
        const enrolledIds = response.data.courses.map(course => course._id);
        setEnrolledCourseIds(enrolledIds);
      }
    } catch (err) {
      console.error('Failed to fetch enrolled courses:', err);
    }
  };

  const handleEnroll = async (e, courseId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      alert('Please login to enroll in courses');
      return;
    }

    try {
      setEnrolling(prev => ({ ...prev, [courseId]: true }));
      await enrollInCourse(courseId);
      setEnrolledCourseIds(prev => [...prev, courseId]);
      alert('Successfully enrolled in course!');
    } catch (err) {
      alert(err.message || 'Failed to enroll in course');
    } finally {
      setEnrolling(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const handleWithdraw = async (e, courseId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to withdraw from this course?')) {
      return;
    }

    try {
      setEnrolling(prev => ({ ...prev, [courseId]: true }));
      await withdrawFromCourse(courseId);
      setEnrolledCourseIds(prev => prev.filter(id => id !== courseId));
      alert('Successfully withdrawn from course');
    } catch (err) {
      alert(err.message || 'Failed to withdraw from course');
    } finally {
      setEnrolling(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const getCategoryImage = (category, courseTitle = '') => {
    // Check course title for specific keywords first
    const titleLower = courseTitle.toLowerCase();

    if (titleLower.includes('software testing') || titleLower.includes('qa') || titleLower.includes('quality assurance')) {
      return '/images/Software Testing.jpeg';
    }
    if (titleLower.includes('data engineering')) {
      return '/images/Data engineering.jpeg';
    }
    if (titleLower.includes('data analysis') || titleLower.includes('excel') || titleLower.includes('sql')) {
      return '/images/Data Analysis.jpeg';
    }
    if (titleLower.includes('machine learning') || titleLower.includes('ml fundamentals')) {
      return '/images/Machine learning.jpeg';
    }
    if (titleLower.includes('data science')) {
      return '/images/Data science.jpeg';
    }
    if (titleLower.includes('cybersecurity') || titleLower.includes('security')) {
      return '/images/Cybersecurity.jpeg';
    }
    if (titleLower.includes('devops') || titleLower.includes('deployment')) {
      return '/images/Devops.jpeg';
    }
    if (titleLower.includes('mern') || titleLower.includes('web dev') || titleLower.includes('full stack')) {
      return '/images/MERN.jpeg';
    }
    if (titleLower.includes('mobile') || titleLower.includes('android') || titleLower.includes('ios')) {
      return '/images/Mobile App Development.jpeg';
    }

    // Fall back to category mapping
    const images = {
      'Web Development': '/images/MERN.jpeg',
      'Mobile Development': '/images/Mobile App Development.jpeg',
      'Mobile App Development': '/images/Mobile App Development.jpeg',
      'Data Science': '/images/Data science.jpeg',
      'Data Analysis': '/images/Data Analysis.jpeg',
      'Data Engineering': '/images/Data engineering.jpeg',
      'Machine Learning': '/images/Machine learning.jpeg',
      'Cybersecurity': '/images/Cybersecurity.jpeg',
      'DevOps': '/images/Devops.jpeg',
      'UI/UX Design': '/images/UI-UX.jpeg',
      'Software Testing': '/images/Software Testing.jpeg',
      'Other': '/images/Software Testing.jpeg'
    };
    return images[category] || '/images/MERN.jpeg';
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filterParams = {};
    if (filters.search) filterParams.search = filters.search;
    if (filters.category) filterParams.category = filters.category;
    if (filters.level) filterParams.level = filters.level;
    fetchCourses(filterParams);
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', level: '' });
    fetchCourses();
  };

  const isEnrolled = (courseId) => enrolledCourseIds.includes(courseId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Video */}
      <div className="relative mb-8 overflow-hidden">
        {/* Video Background */}
        <div className="relative w-full" style={{ paddingBottom: '42%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full border-0"
            src="https://www.youtube.com/embed/LVbUNRwpXzw?autoplay=1&mute=1&loop=1&playlist=LVbUNRwpXzw&controls=0&showinfo=0&rel=0&modestbranding=1"
            title="Course Hero Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>

          {/* Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 flex items-center">
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto text-center text-white">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in drop-shadow-lg">
                  Discover Your Next
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                    Tech Adventure
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-100 mb-8 drop-shadow-md">
                  Master cutting-edge technologies with expert-led courses designed for the modern developer
                </p>
                <div className="flex flex-wrap justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 shadow-lg">
                    <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>100% Free Courses</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 shadow-lg">
                    <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Learn At Your Pace</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 shadow-lg">
                    <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <span>Industry-Recognized</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Browse All Courses</h2>

        {/* Filters */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search courses..."
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {courseCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              name="level"
              value={filters.level}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              {courseLevels.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              Search
            </button>
            {(filters.search || filters.category || filters.level) && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
          </div>
        ) : courses.length === 0 ? (
          /* No Courses Found */
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600">
              {filters.search || filters.category || filters.level
                ? 'Try adjusting your filters'
                : 'Check back later for new courses!'}
            </p>
          </div>
        ) : (
          /* Course Grid */
          <>
            <p className="text-gray-600 mb-6">
              Showing {courses.length} course{courses.length !== 1 ? 's' : ''}
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {courses.map((course) => {
                const enrolled = isEnrolled(course._id);
                const isEnrolling = enrolling[course._id];

                // Check if course is upcoming (starts in the future)
                const isUpcoming = course.startDate && new Date(course.startDate) > new Date();
                const startDate = course.startDate ? new Date(course.startDate) : null;

                return (
                  <div
                    key={course._id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition flex flex-col"
                  >
                    {/* Image-based header */}
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={getCategoryImage(course.category, course.title)}
                        alt={course.category}
                        className="w-full h-full object-cover"
                      />
                      {isUpcoming ? (
                        <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1 shadow-lg">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Upcoming
                        </div>
                      ) : enrolled && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1 shadow-lg">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Enrolled
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
                          {course.category}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          {course.level}
                        </span>
                      </div>

                      <Link to={`/courses/${course._id}`}>
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2 hover:text-primary-600 transition">
                          {course.title}
                        </h3>
                      </Link>

                      <p className="text-gray-600 mb-4 line-clamp-2 flex-1">
                        {course.description}
                      </p>

                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-500">
                          {course.instructor?.name || 'Unknown'}
                        </span>
                        {course.deliveryMode && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            {course.deliveryMode}
                          </span>
                        )}
                      </div>

                      <div className="mb-3">
                        <span className="text-lg font-bold text-green-600">FREE</span>
                      </div>

                      {course.averageRating > 0 && (
                        <div className="mb-3 flex items-center text-sm text-yellow-600">
                          ⭐ {course.averageRating.toFixed(1)} ({course.totalReviews} reviews)
                        </div>
                      )}

                      {/* Show start date for upcoming courses */}
                      {isUpcoming && startDate && (
                        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-yellow-800">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold">Starts: {startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </div>
                      )}

                      {/* Progress bar if enrolled */}
                      {enrolled && !isUpcoming && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>0% Completed</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-teal-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                          </div>
                        </div>
                      )}

                      {/* Enroll/Withdraw Button or Upcoming indicator */}
                      {isUpcoming ? (
                        <div className="mt-auto">
                          <div className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-center font-semibold text-sm cursor-not-allowed">
                            Enrollment Opens Soon
                          </div>
                        </div>
                      ) : isAuthenticated() && user?.role === 'student' ? (
                        <div className="mt-auto">
                          {enrolled ? (
                            <div className="flex gap-2">
                              <Link
                                to={`/courses/${course._id}`}
                                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-semibold text-center text-sm"
                              >
                                Continue Learning
                              </Link>
                              <button
                                onClick={(e) => handleWithdraw(e, course._id)}
                                disabled={isEnrolling}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-semibold text-sm disabled:opacity-50"
                              >
                                {isEnrolling ? 'Processing...' : 'Withdraw'}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => handleEnroll(e, course._id)}
                              disabled={isEnrolling}
                              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold text-sm disabled:opacity-50"
                            >
                              {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                            </button>
                          )}
                        </div>
                      ) : (
                        /* View Details button for non-students */
                        <Link
                          to={`/courses/${course._id}`}
                          className="mt-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold text-sm text-center block"
                        >
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Courses;
