import express from 'express';
import {
  getAllPathways,
  getPathwayByName,
  checkCourseUnlock,
  getStudentPathwayProgress
} from '../controllers/pathwayController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllPathways);
router.get('/:pathwayName', getPathwayByName);

// Protected routes (require authentication)
router.get('/unlock/check/:courseId', protect, checkCourseUnlock);
router.get('/student/progress', protect, authorize('student'), getStudentPathwayProgress);

export default router;
