import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ClassSessions = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('month'); // month, week, day

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchLessons();
  }, [currentDate, isAuthenticated, navigate]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      // For now, always use mock data until lessons API is fully implemented
      generateMockLessons();
    } catch (error) {
      console.error('Error generating lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockLessons = () => {
    const mockLessons = [];
    const today = new Date();

    // Generate lessons for the next 30 days
    for (let i = 0; i < 30; i++) {
      const lessonDate = new Date(today);
      lessonDate.setDate(today.getDate() + i);

      // Skip weekends
      if (lessonDate.getDay() === 0 || lessonDate.getDay() === 6) continue;

      // Morning session
      const morningTime = new Date(lessonDate);
      morningTime.setHours(10, 0, 0);
      const morningEnd = new Date(morningTime);
      morningEnd.setHours(12, 0, 0);

      mockLessons.push({
        _id: `lesson-${i}-morning`,
        title: i % 3 === 0 ? 'MERN Stack Development' : i % 3 === 1 ? 'DevOps Fundamentals' : 'Cybersecurity Basics',
        type: 'live',
        scheduledDateTime: morningTime.toISOString(),
        endDateTime: morningEnd.toISOString(),
        instructor: i % 3 === 0 ? 'Dr. Amara Okonkwo' : i % 3 === 1 ? 'Dr. Kwame Mensah' : 'Dr. Zainab Hassan',
        duration: 120
      });

      // Afternoon session (every other day)
      if (i % 2 === 0) {
        const afternoonTime = new Date(lessonDate);
        afternoonTime.setHours(14, 0, 0);
        const afternoonEnd = new Date(afternoonTime);
        afternoonEnd.setHours(16, 0, 0);

        mockLessons.push({
          _id: `lesson-${i}-afternoon`,
          title: 'Hands-on Lab Session',
          type: 'reading',
          scheduledDateTime: afternoonTime.toISOString(),
          endDateTime: afternoonEnd.toISOString(),
          instructor: 'Teaching Assistant',
          duration: 120
        });
      }
    }

    setLessons(mockLessons);
  };

  const getDateRange = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of month
    const firstDay = new Date(year, month, 1);
    // Get last day of month
    const lastDay = new Date(year, month + 1, 0);

    // Adjust to show full weeks
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay()); // Go back to Sunday

    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay())); // Go forward to Saturday

    return { startDate, endDate };
  };

  const getDaysInMonth = () => {
    const { startDate, endDate } = getDateRange();
    const days = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const getLessonsForDate = (date) => {
    return lessons.filter(lesson => {
      if (!lesson.scheduledDateTime) return false;
      const lessonDate = new Date(lesson.scheduledDateTime);
      return (
        lessonDate.getDate() === date.getDate() &&
        lessonDate.getMonth() === date.getMonth() &&
        lessonDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatTimeRange = (start, end) => {
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const getLessonColor = (lesson) => {
    const colors = {
      'live': 'bg-purple-100 border-purple-300 text-purple-800',
      'recorded': 'bg-blue-100 border-blue-300 text-blue-800',
      'reading': 'bg-green-100 border-green-300 text-green-800',
      'assignment': 'bg-yellow-100 border-yellow-300 text-yellow-800',
      'quiz': 'bg-pink-100 border-pink-300 text-pink-800',
      'project': 'bg-orange-100 border-orange-300 text-orange-800'
    };
    return colors[lesson.type] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = getDaysInMonth();
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Class Sessions</h1>
          <p className="text-gray-600">View and manage your scheduled class sessions</p>
        </div>

        {/* Calendar Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-primary-600">{getMonthYear()}</h2>
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                TODAY
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={view}
                onChange={(e) => setView(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="month">MONTH</option>
                <option value="week">WEEK</option>
                <option value="day">DAY</option>
              </select>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Week Day Headers */}
            <div className="grid grid-cols-7 bg-gray-100">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="p-3 text-center font-semibold text-gray-700 border-r border-gray-200 last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 border-t border-gray-200">
                {week.map((day, dayIndex) => {
                  const dayLessons = getLessonsForDate(day);
                  const today = isToday(day);
                  const currentMonth = isCurrentMonth(day);

                  return (
                    <div
                      key={dayIndex}
                      className={`min-h-[120px] p-2 border-r border-gray-200 last:border-r-0 ${
                        !currentMonth ? 'bg-gray-50' : 'bg-white'
                      } ${today ? 'bg-blue-50' : ''}`}
                    >
                      {/* Date Number */}
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-sm font-semibold ${
                            today
                              ? 'bg-primary-600 text-white w-7 h-7 rounded-full flex items-center justify-center'
                              : currentMonth
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          }`}
                        >
                          {day.getDate()}
                        </span>
                        {day.getDate() === 1 && (
                          <span className="text-xs text-gray-500">
                            {day.toLocaleDateString('en-US', { month: 'short' })} {day.getDate()}
                          </span>
                        )}
                      </div>

                      {/* Lessons for this day */}
                      <div className="space-y-1">
                        {dayLessons.slice(0, 3).map((lesson, index) => (
                          <div
                            key={lesson._id || index}
                            className={`text-xs p-1.5 rounded border cursor-pointer hover:shadow-md transition ${getLessonColor(lesson)} group relative`}
                            onClick={() => navigate(`/lessons/${lesson._id}`)}
                          >
                            <div className="font-semibold truncate">
                              {lesson.title.length > 20 ? lesson.title.substring(0, 20) + '...' : lesson.title}
                            </div>
                            <div className="text-xs opacity-90">
                              {lesson.scheduledDateTime && lesson.endDateTime ? (
                                <span>{formatTimeRange(lesson.scheduledDateTime, lesson.endDateTime)}</span>
                              ) : (
                                <span>{formatTime(lesson.scheduledDateTime)}</span>
                              )}
                            </div>
                            {lesson.instructor && (
                              <div className="text-xs opacity-75 truncate">
                                {lesson.instructor}
                              </div>
                            )}

                            {/* Tooltip on hover */}
                            <div className="absolute hidden group-hover:block z-10 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg -left-2 top-full mt-1 w-64">
                              <div className="font-bold mb-1">{lesson.title}</div>
                              <div className="text-gray-300 mb-1">
                                {lesson.scheduledDateTime && lesson.endDateTime && (
                                  <span>{formatTimeRange(lesson.scheduledDateTime, lesson.endDateTime)}</span>
                                )}
                              </div>
                              {lesson.instructor && (
                                <div className="text-gray-300 mb-1">
                                  Instructor: {lesson.instructor}
                                </div>
                              )}
                              {lesson.duration && (
                                <div className="text-gray-300">
                                  Duration: {lesson.duration} minutes
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {dayLessons.length > 3 && (
                          <div className="text-xs text-gray-600 pl-1">
                            +{dayLessons.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Lesson Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-100 border-2 border-purple-300 rounded"></div>
              <span className="text-sm">Live Session</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
              <span className="text-sm">Recorded</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
              <span className="text-sm">Reading</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
              <span className="text-sm">Assignment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-pink-100 border-2 border-pink-300 rounded"></div>
              <span className="text-sm">Quiz</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-100 border-2 border-orange-300 rounded"></div>
              <span className="text-sm">Project</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassSessions;
