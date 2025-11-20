import api from './authService';

// Get module by ID
export const getModuleById = async (moduleId) => {
  try {
    const response = await api.get(`/modules/${moduleId}`);
    return response.data;
  } catch (error) {
    console.error('Get module error:', error.response?.data || error.message);
    throw error.response?.data || { success: false, message: 'Failed to fetch module' };
  }
};

// Get modules by course ID
export const getModulesByCourse = async (courseId) => {
  try {
    const response = await api.get(`/courses/${courseId}/modules`);
    return response.data;
  } catch (error) {
    console.error('Get modules error:', error.response?.data || error.message);
    throw error.response?.data || { success: false, message: 'Failed to fetch modules' };
  }
};

// Create new module (instructor only)
export const createModule = async (moduleData) => {
  try {
    const response = await api.post('/modules', moduleData);
    return response.data;
  } catch (error) {
    console.error('Create module error:', error.response?.data || error.message);
    throw error.response?.data || { success: false, message: 'Failed to create module' };
  }
};

// Update module (instructor only)
export const updateModule = async (moduleId, moduleData) => {
  try {
    const response = await api.put(`/modules/${moduleId}`, moduleData);
    return response.data;
  } catch (error) {
    console.error('Update module error:', error.response?.data || error.message);
    throw error.response?.data || { success: false, message: 'Failed to update module' };
  }
};

// Delete module (instructor only)
export const deleteModule = async (moduleId) => {
  try {
    const response = await api.delete(`/modules/${moduleId}`);
    return response.data;
  } catch (error) {
    console.error('Delete module error:', error.response?.data || error.message);
    throw error.response?.data || { success: false, message: 'Failed to delete module' };
  }
};
