import express from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  enrollInCourse,
  withdrawFromCourse,
  getEnrolledCourses
} from '../controllers/courseController.js';
import {
  createModule,
  getCourseModules
} from '../controllers/moduleController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllCourses);

// Protected routes - Student only (MUST come before /:id route)
router.get('/student/enrolled', protect, authorize('student'), getEnrolledCourses);
router.post('/:id/enroll', protect, authorize('student'), enrollInCourse);
router.delete('/:id/withdraw', protect, authorize('student'), withdrawFromCourse);

// Protected routes - Instructor only (MUST come before /:id route)
router.get('/instructor/my-courses', protect, authorize('instructor'), getInstructorCourses);
router.post('/', protect, authorize('instructor'), createCourse);
router.put('/:id', protect, authorize('instructor'), updateCourse);
router.delete('/:id', protect, authorize('instructor'), deleteCourse);

// Public route with parameter (MUST come after specific routes)
router.get('/:id', getCourseById);

// Module routes (nested under courses)
router.post('/:courseId/modules', protect, authorize('instructor'), createModule);
router.get('/:courseId/modules', getCourseModules);

export default router;
