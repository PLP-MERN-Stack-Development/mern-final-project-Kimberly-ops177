import api from './authService';

// Get all courses
export const getAllCourses = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/courses?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch courses' };
  }
};

// Get single course by ID
export const getCourseById = async (id) => {
  try {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch course' };
  }
};

// Create new course (instructor only)
export const createCourse = async (courseData) => {
  try {
    const response = await api.post('/courses', courseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create course' };
  }
};

// Update course (instructor only)
export const updateCourse = async (id, courseData) => {
  try {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update course' };
  }
};

// Delete course (instructor only)
export const deleteCourse = async (id) => {
  try {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete course' };
  }
};

// Get instructor's courses
export const getInstructorCourses = async () => {
  try {
    const response = await api.get('/courses/instructor/my-courses');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch your courses' };
  }
};

// Enroll in course (student only)
export const enrollInCourse = async (id) => {
  try {
    const response = await api.post(`/courses/${id}/enroll`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to enroll in course' };
  }
};

// Get enrolled courses (student only)
export const getEnrolledCourses = async () => {
  try {
    const response = await api.get('/courses/student/enrolled');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch enrolled courses' };
  }
};

// Withdraw from course (student only)
export const withdrawFromCourse = async (id) => {
  try {
    const response = await api.delete(`/courses/${id}/withdraw`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to withdraw from course' };
  }
};

// Course categories for filters
export const courseCategories = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Cybersecurity',
  'DevOps',
  'UI/UX Design',
  'Software Testing',
  'Other'
];

// Course levels
export const courseLevels = ['beginner', 'intermediate', 'advanced'];
