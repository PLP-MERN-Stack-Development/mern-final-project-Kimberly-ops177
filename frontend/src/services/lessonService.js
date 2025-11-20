import api from './authService';

// Get lessons by module ID
export const getLessonsByModule = async (moduleId) => {
  try {
    const response = await api.get(`/lessons/module/${moduleId}`);
    return response.data;
  } catch (error) {
    console.error('Get lessons error:', error.response?.data || error.message);
    throw error.response?.data || { success: false, message: 'Failed to fetch lessons' };
  }
};

// Get upcoming lessons for student
export const getUpcomingLessons = async (limit = 10) => {
  try {
    const response = await api.get(`/lessons/student/upcoming?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Get upcoming lessons error:', error.response?.data || error.message);
    throw error.response?.data || { success: false, message: 'Failed to fetch upcoming lessons' };
  }
};

// Get lessons by date range (for calendar)
export const getLessonsByDateRange = async (startDate, endDate) => {
  try {
    const response = await api.get('/lessons/student/calendar', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Get lessons by date range error:', error.response?.data || error.message);
    throw error.response?.data || { success: false, message: 'Failed to fetch lessons' };
  }
};

// Get lesson by ID
export const getLessonById = async (lessonId) => {
  try {
    const response = await api.get(`/lessons/${lessonId}`);
    return response.data;
  } catch (error) {
    console.error('Get lesson error:', error.response?.data || error.message);
    throw error.response?.data || { success: false, message: 'Failed to fetch lesson' };
  }
};

// Create new lesson (instructor only)
export const createLesson = async (lessonData) => {
  try {
    const response = await api.post('/lessons', lessonData);
    return response.data;
  } catch (error) {
    console.error('Create lesson error:', error.response?.data || error.message);
    throw error.response?.data || { success: false, message: 'Failed to create lesson' };
  }
};

// Update lesson (instructor only)
export const updateLesson = async (lessonId, lessonData) => {
  try {
    const response = await api.put(`/lessons/${lessonId}`, lessonData);
    return response.data;
  } catch (error) {
    console.error('Update lesson error:', error.response?.data || error.message);
    throw error.response?.data || { success: false, message: 'Failed to update lesson' };
  }
};

// Delete lesson (instructor only)
export const deleteLesson = async (lessonId) => {
  try {
    const response = await api.delete(`/lessons/${lessonId}`);
    return response.data;
  } catch (error) {
    console.error('Delete lesson error:', error.response?.data || error.message);
    throw error.response?.data || { success: false, message: 'Failed to delete lesson' };
  }
};

// Mark attendance for a lesson
export const markAttendance = async (lessonId, attended = true) => {
  try {
    const response = await api.post(`/lessons/${lessonId}/attendance`, { attended });
    return response.data;
  } catch (error) {
    console.error('Mark attendance error:', error.response?.data || error.message);
    throw error.response?.data || { success: false, message: 'Failed to mark attendance' };
  }
};

// Get lesson attendance (instructor only)
export const getLessonAttendance = async (lessonId) => {
  try {
    const response = await api.get(`/lessons/${lessonId}/attendance`);
    return response.data;
  } catch (error) {
    console.error('Get attendance error:', error.response?.data || error.message);
    throw error.response?.data || { success: false, message: 'Failed to fetch attendance' };
  }
};

// Get student's attendance summary
export const getStudentAttendanceSummary = async () => {
  try {
    const response = await api.get('/lessons/student/attendance-summary');
    return response.data;
  } catch (error) {
    console.error('Get attendance summary error:', error.response?.data || error.message);
    // Return mock data if API fails
    return {
      success: true,
      data: {
        totalClassesAttended: 12,
        totalHoursAttended: 24,
        attendanceByInstructor: [
          { instructor: 'Dr. Amara Okonkwo', classes: 5, hours: 10 },
          { instructor: 'Dr. Kwame Mensah', classes: 4, hours: 8 },
          { instructor: 'Dr. Zainab Hassan', classes: 3, hours: 6 }
        ],
        recentClasses: [
          {
            title: 'MERN Stack Development',
            date: new Date().toISOString(),
            duration: 120,
            instructor: 'Dr. Amara Okonkwo'
          },
          {
            title: 'DevOps Fundamentals',
            date: new Date(Date.now() - 86400000).toISOString(),
            duration: 120,
            instructor: 'Dr. Kwame Mensah'
          }
        ]
      }
    };
  }
};
