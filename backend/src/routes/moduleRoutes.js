import express from 'express';
import {
  createModule,
  getCourseModules,
  getModuleById,
  updateModule,
  deleteModule
} from '../controllers/moduleController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Module-specific routes
router.get('/:id', getModuleById);
router.put('/:id', protect, authorize('instructor'), updateModule);
router.delete('/:id', protect, authorize('instructor'), deleteModule);

export default router;
