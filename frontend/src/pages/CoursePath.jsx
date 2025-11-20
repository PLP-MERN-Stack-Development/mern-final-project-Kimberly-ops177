import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCourses, getEnrolledCourses, enrollInCourse } from '../services/courseService';
import { useAuth } from '../context/AuthContext';

const CoursePath = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [enrolling, setEnrolling] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Refetch data when user navigates back to this page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated() && user?.role === 'student') {
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAuthenticated, user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const coursesResponse = await getAllCourses();

      if (coursesResponse.success) {
        setCourses(coursesResponse.data.courses);
      }

      // Fetch enrolled courses if user is authenticated and is a student
      if (isAuthenticated() && user?.role === 'student') {
        try {
          const enrolledResponse = await getEnrolledCourses();
          console.log('Enrolled courses response:', enrolledResponse);
          if (enrolledResponse.success) {
            const enrolledIds = enrolledResponse.data.courses.map(c => c._id);
            console.log('Enrolled course IDs:', enrolledIds);
            setEnrolledCourses(enrolledIds);
          }
        } catch (err) {
          console.log('Error fetching enrolled courses:', err);
        }
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    if (!isAuthenticated()) {
      alert('Please login to enroll in courses');
      navigate('/login');
      return;
    }

    if (user?.role !== 'student') {
      alert('Only students can enroll in courses');
      return;
    }

    try {
      setEnrolling(courseId);
      const response = await enrollInCourse(courseId);

      if (response.success) {
        alert('Successfully enrolled in the course!');
        // Update enrolled courses list
        setEnrolledCourses([...enrolledCourses, courseId]);
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert(error.message || 'Failed to enroll in course');
    } finally {
      setEnrolling(null);
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
    if (titleLower.includes('data science') || titleLower.includes('machine learning') || titleLower.includes('ml ')) {
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
      'Machine Learning': '/images/Data science.jpeg',
      'Cybersecurity': '/images/Cybersecurity.jpeg',
      'DevOps': '/images/Devops.jpeg',
      'Software Testing': '/images/Software Testing.jpeg',
      'Design': '/images/MERN.jpeg',
      'Business': '/images/Data Analysis.jpeg',
      'Marketing': '/images/Data Analysis.jpeg',
      'Photography': '/images/MERN.jpeg',
      'Music': '/images/MERN.jpeg',
      'Other': '/images/Software Testing.jpeg'
    };
    return images[category] || '/images/MERN.jpeg';
  };

  const getCourseStatus = (courseId) => {
    if (enrolledCourses.includes(courseId)) {
      return 'enrolled';
    }
    return 'not-started';
  };

  const getStartDate = (index) => {
    // Generate placeholder start dates
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + (index * 30)); // Each course starts 30 days apart
    return baseDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const categories = ['all', 'Cybersecurity', 'DevOps', 'Data Science', 'Mobile Development', 'Web Development'];

  const filteredCourses = selectedCategory === 'all'
    ? courses
    : courses.filter(course => course.category === selectedCategory);

  const groupedCourses = filteredCourses.reduce((acc, course) => {
    const cat = course.category;
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(course);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Learning Pathways</h1>
          <p className="text-lg text-gray-600 mb-4">
            The EduHub learning pathways empower individuals to become proficient professionals.
            Through practical, project-based learning, you'll gain industry-relevant knowledge and
            real-world problem-solving experience.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <p className="text-gray-800">
              <strong>💡 Sequential Learning:</strong> Our pathways are structured in stages. Complete each stage to unlock the next, building a strong foundation as you progress.
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === category
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category === 'all' ? 'All Pathways' : category}
            </button>
          ))}
        </div>

        {/* Course Pathways by Category */}
        {Object.entries(groupedCourses).map(([category, categoryCourses]) => (
          <div key={category} className="mb-12">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                <img
                  src={getCategoryImage(category, categoryCourses[0]?.title)}
                  alt={category}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{category}</h2>
                <p className="text-gray-600">
                  You have {categoryCourses.filter(c => getCourseStatus(c._id) === 'enrolled').length} active
                  course{categoryCourses.filter(c => getCourseStatus(c._id) === 'enrolled').length !== 1 ? 's' : ''} in this pathway
                </p>
              </div>
            </div>

            {/* Course Cards */}
            <div className="space-y-4">
              {categoryCourses.map((course, index) => {
                const status = getCourseStatus(course._id);
                const isEnrolled = status === 'enrolled';
                const monthsCount = Math.round(course.duration / 120);

                return (
                  <div
                    key={course._id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
                  >
                    <div className="flex items-start gap-6">
                      {/* Course Image */}
                      <div className="flex-shrink-0">
                        <div className={`w-28 h-28 rounded-xl overflow-hidden shadow-md ${
                          isEnrolled ? 'ring-4 ring-green-400' : ''
                        }`}>
                          <img
                            src={getCategoryImage(course.category, course.title)}
                            alt={course.category}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-2xl font-bold mb-1">{course.title}</h3>
                            {isEnrolled && (
                              <div className="flex items-center gap-2 text-green-600 mb-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-semibold">Enrolled</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              course.level === 'beginner' ? 'bg-green-100 text-green-700' :
                              course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4">{course.description}</p>

                        {/* Course Info */}
                        <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{getStartDate(index)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{monthsCount} {monthsCount === 1 ? 'month' : 'months'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            <span className="font-medium">{course.deliveryMode || 'Online'}</span>
                          </div>
                        </div>

                        {/* Pricing */}
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-2xl font-bold text-green-600">FREE</span>
                        </div>

                        {/* Action Button */}
                        <div className="flex gap-3">
                          {isEnrolled ? (
                            <>
                              <button
                                onClick={() => navigate(`/courses/${course._id}`)}
                                className="px-6 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition font-semibold"
                              >
                                Continue
                              </button>
                              <button
                                onClick={() => navigate(`/courses/${course._id}`)}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                              >
                                View Details
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => navigate(`/courses/${course._id}`)}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => handleEnroll(course._id)}
                                disabled={enrolling === course._id}
                                className="px-6 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {enrolling === course._id ? 'Enrolling...' : 'Enroll'}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600">
              Try selecting a different category
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePath;
