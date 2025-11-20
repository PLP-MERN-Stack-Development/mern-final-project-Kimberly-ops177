import api from './authService';

// Get all available pathways
export const getAllPathways = async () => {
  try {
    const response = await api.get('/pathways');
    return response.data;
  } catch (error) {
    console.error('Get all pathways error:', error.response?.data || error.message);
    throw error.response?.data || { success: false, message: 'Failed to fetch pathways' };
  }
};

// Get specific pathway by name with user progress
export const getPathwayByName = async (pathwayName) => {
  try {
    const response = await api.get(`/pathways/${pathwayName}`);
    return response.data;
  } catch (error) {
    console.error('Get pathway error:', error.response?.data || error.message);
    throw error.response?.data || { success: false, message: 'Failed to fetch pathway' };
  }
};

// Check if a course can be unlocked
export const checkCourseUnlock = async (courseId) => {
  try {
    const response = await api.get(`/pathways/unlock/check/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Check unlock error:', error.response?.data || error.message);
    throw error.response?.data || { success: false, message: 'Failed to check unlock status' };
  }
};

// Get student's pathway progress
export const getStudentPathwayProgress = async () => {
  try {
    const response = await api.get('/pathways/student/progress');
    return response.data;
  } catch (error) {
    console.error('Get student progress error:', error.response?.data || error.message);
    throw error.response?.data || { success: false, message: 'Failed to fetch progress' };
  }
};
