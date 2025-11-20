import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPathwayByName } from '../services/pathwayService';
import { useAuth } from '../context/AuthContext';

const PathwayProgress = () => {
  const { pathwayName } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [pathway, setPathway] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPathwayData();
  }, [pathwayName]);

  const fetchPathwayData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getPathwayByName(pathwayName);

      if (response.success) {
        setPathway(response.data.pathway);
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching pathway:', error);
      setError(error.message || 'Failed to load pathway');
    } finally {
      setLoading(false);
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

  const getCourseStatus = (course) => {
    if (!course.userProgress) {
      return course.isLocked ? 'locked' : 'not-started';
    }
    return course.userProgress.status;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in-progress':
        return '🔄';
      case 'locked':
      case 'not-started':
        return '🔒';
      default:
        return '⏳';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'locked':
        return 'Locked';
      case 'not-started':
        return 'Not Started';
      default:
        return 'Coming Soon';
    }
  };

  const getButtonText = (status) => {
    switch (status) {
      case 'completed':
        return 'Review Course';
      case 'in-progress':
        return 'Continue Learning';
      case 'locked':
        return 'Not available yet';
      case 'not-started':
        return 'Start Course';
      default:
        return 'Coming Soon';
    }
  };

  const getButtonStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'border-2 border-gray-800 text-gray-800 hover:bg-gray-100';
      case 'in-progress':
        return 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold';
      case 'locked':
        return 'bg-gray-300 text-gray-600 cursor-not-allowed';
      case 'not-started':
        return 'bg-gray-900 text-white hover:bg-gray-800';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getDurationInWeeks = (durationMinutes) => {
    return Math.round(durationMinutes / 120);
  };

  const getPrerequisiteMessage = (course) => {
    if (!course.prerequisites || course.prerequisites.length === 0) {
      return null;
    }

    const prereq = pathway.courses.find(c => c._id === course.prerequisites[0].courseId);
    if (prereq) {
      return `Complete ${prereq.pathway.stageTitle} to unlock`;
    }
    return 'Complete previous stage to unlock';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !pathway) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pathway Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This pathway does not exist or has no courses yet.'}</p>
          <button
            onClick={() => navigate('/pathways')}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            View All Pathways
          </button>
        </div>
      </div>
    );
  }

  const pathwayImage = pathway.courses.length > 0 ? getCategoryImage(pathway.courses[0].category, pathway.courses[0].title) : '/images/MERN.jpeg';
  const displayName = pathway.name.replace(' Pathway', '');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
              <img src={pathwayImage} alt={displayName} className="w-full h-full object-cover" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">{displayName}</h1>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            {pathway.courses.length > 0 && pathway.courses[0].description
              ? `The EduHub ${displayName} programme empowers individuals to become proficient professionals. Through practical, project-based learning, you'll gain industry-relevant knowledge and real-world problem-solving experience.`
              : `Complete all ${pathway.totalStages} stages to master ${displayName}.`}
          </p>
        </div>

        {/* Progress Overview */}
        {isAuthenticated() && stats && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Your Progress</h2>
              <div className="flex items-center gap-3">
                <span className="text-3xl">🅱</span>
                <span className="text-2xl font-bold">{user?.points || 0} points</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600">{stats.completedCourses}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{stats.activeCourses}</div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-400">{stats.lockedCourses}</div>
                <div className="text-sm text-gray-600">Locked</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-600">{stats.overallProgress}%</div>
                <div className="text-sm text-gray-600">Overall</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gray-800 to-gray-900"
                  style={{ width: `${stats.overallProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Active Courses Info */}
        {isAuthenticated() && stats && (
          <div className="mb-6">
            <p className="text-gray-700 text-lg">
              You have <span className="font-bold text-yellow-600">{stats.activeCourses} active course{stats.activeCourses !== 1 ? 's' : ''}</span> in this program
            </p>
          </div>
        )}

        {/* Course Stages */}
        <div className="space-y-6">
          {pathway.courses.map((course) => {
            const status = getCourseStatus(course);
            const weeks = getDurationInWeeks(course.duration);
            const currentWeek = course.userProgress?.currentWeek || 0;
            const totalWeeks = course.userProgress?.totalWeeks || weeks;
            const completionPercentage = course.userProgress?.completionPercentage || 0;
            const prerequisiteMsg = getPrerequisiteMessage(course);

            return (
              <div
                key={course._id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                  status === 'locked' ? 'opacity-75' : ''
                }`}
              >
                <div className="p-8">
                  <div className="flex items-start gap-6">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <div className={`w-32 h-32 rounded-2xl overflow-hidden shadow-md ${
                        status === 'completed' ? 'ring-4 ring-green-400' :
                        status === 'in-progress' ? 'ring-4 ring-yellow-400' :
                        'ring-2 ring-gray-300'
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
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
                            {course.pathway.stageTitle}
                            <span className={`text-lg ${
                              status === 'completed' ? 'text-green-600' :
                              status === 'in-progress' ? 'text-blue-600' :
                              'text-gray-500'
                            }`}>
                              {getStatusIcon(status)} {getStatusText(status)}
                            </span>
                          </h3>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                        {course.description}
                      </p>

                      {/* Course Info */}
                      <div className="flex items-center gap-6 mb-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">{formatDate(course.unlockDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">{course.pathway.estimatedWeeks} weeks</span>
                        </div>
                      </div>

                      {/* Progress Bar (for in-progress courses) */}
                      {status === 'in-progress' && course.userProgress && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-semibold text-yellow-600">
                              Week {currentWeek} of {totalWeeks} • {completionPercentage}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                              style={{ width: `${completionPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Completion Info (for completed courses) */}
                      {status === 'completed' && course.userProgress && (
                        <div className="mb-4 p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 text-green-700">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold">
                              Completed: {formatDate(course.userProgress.completedAt)} •
                              Score: {course.userProgress.completionPercentage}% •
                              Points Earned: {course.userProgress.pointsEarned}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Lock Message (for locked courses) */}
                      {status === 'locked' && prerequisiteMsg && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                          <div className="flex items-center gap-2 text-gray-700">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">🔓 {prerequisiteMsg}</span>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => status !== 'locked' && navigate(`/courses/${course._id}`)}
                          disabled={status === 'locked'}
                          className={`px-8 py-3 rounded-xl font-semibold transition-all ${getButtonStyle(status)}`}
                        >
                          {getButtonText(status)}
                        </button>

                        {status === 'completed' && (
                          <button
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
                          >
                            View Certificate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions Menu */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-6 border-2 border-gray-200 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition text-center">
              <div className="text-4xl mb-2">🎓</div>
              <div className="font-semibold">Learning</div>
            </button>
            <button className="p-6 border-2 border-gray-200 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition text-center">
              <div className="text-4xl mb-2">👥</div>
              <div className="font-semibold">Community</div>
            </button>
            <button className="p-6 border-2 border-gray-200 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition text-center">
              <div className="text-4xl mb-2">🏆</div>
              <div className="font-semibold">Rewards</div>
            </button>
            <button className="p-6 border-2 border-gray-200 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition text-center">
              <div className="text-4xl mb-2">❓</div>
              <div className="font-semibold">Support</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathwayProgress;
