import express from 'express';
import {
  getLessonsByModule,
  getUpcomingLessons,
  getLessonsByDateRange,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  markAttendance,
  getLessonAttendance
} from '../controllers/lessonController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/module/:moduleId', getLessonsByModule);
router.get('/:lessonId', getLessonById);

// Protected routes (require authentication)
router.get('/student/upcoming', protect, authorize('student'), getUpcomingLessons);
router.get('/student/calendar', protect, authorize('student'), getLessonsByDateRange);
router.post('/:lessonId/attendance', protect, authorize('student'), markAttendance);

// Instructor routes
router.post('/', protect, authorize('instructor'), createLesson);
router.put('/:lessonId', protect, authorize('instructor'), updateLesson);
router.delete('/:lessonId', protect, authorize('instructor'), deleteLesson);
router.get('/:lessonId/attendance', protect, authorize('instructor'), getLessonAttendance);

export default router;
