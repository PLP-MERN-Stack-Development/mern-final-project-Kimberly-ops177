import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById } from '../services/courseService';
import { getModulesByCourse } from '../services/moduleService';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);

      const courseResponse = await getCourseById(id);
      if (courseResponse.success) {
        setCourse(courseResponse.data.course);
      }

      const modulesResponse = await getModulesByCourse(id);
      if (modulesResponse.success) {
        setModules(modulesResponse.data.modules);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Not Found</h2>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-5xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-gray-200 mb-6">{course.description}</p>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{course.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>{course.level}</span>
                </div>
                {course.category && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>{course.category}</span>
                  </div>
                )}
              </div>

              <div className="text-3xl font-bold">
                FREE
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Modules */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6">Course Modules</h2>

            {modules.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600">No modules available yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <div
                    key={module._id}
                    onClick={() => navigate(`/module/${module._id}`)}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-yellow-100 text-yellow-800 font-bold px-3 py-1 rounded-full text-sm">
                            Module {index + 1}
                          </span>
                          <h3 className="text-xl font-bold text-gray-800">{module.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-4">{module.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {module.duration} mins
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {module.order + 1} of {modules.length}
                          </span>
                        </div>
                      </div>
                      <svg className="w-6 h-6 text-gray-800 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-4">Course Information</h3>

              <div className="space-y-4">
                {course.learningModes && course.learningModes.length > 0 && (
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Learning Modes:</p>
                    <div className="flex flex-wrap gap-2">
                      {course.learningModes.map((mode, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-yellow-50 text-yellow-800 rounded-full text-sm font-semibold"
                        >
                          {mode}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {course.deliveryMode && (
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Delivery Mode:</p>
                    <p className="font-semibold">{course.deliveryMode}</p>
                  </div>
                )}

                <div>
                  <p className="text-gray-600 text-sm mb-1">Number of Modules:</p>
                  <p className="font-semibold">{modules.length}</p>
                </div>

                {course.instructor && (
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Instructor:</p>
                    <p className="font-semibold">{course.instructor.name}</p>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (modules.length > 0) {
                      navigate(`/module/${modules[0]._id}`);
                    }
                  }}
                  className="w-full px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition font-semibold"
                  disabled={modules.length === 0}
                >
                  {modules.length > 0 ? 'Start Learning' : 'No Modules Available'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
