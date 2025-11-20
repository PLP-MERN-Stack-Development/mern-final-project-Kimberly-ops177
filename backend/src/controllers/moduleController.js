import Module from '../models/Module.js';
import Course from '../models/Course.js';

// @desc    Create a module for a course
// @route   POST /api/courses/:courseId/modules
// @access  Private/Instructor
export const createModule = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, order } = req.body;

    // Check if course exists and belongs to the instructor
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add modules to this course'
      });
    }

    // Create module
    const module = await Module.create({
      course: courseId,
      title,
      description,
      order: order || course.modules.length
    });

    res.status(201).json({
      success: true,
      message: 'Module created successfully',
      data: { module }
    });
  } catch (error) {
    console.error('Create module error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get all modules for a course
// @route   GET /api/courses/:courseId/modules
// @access  Public
export const getCourseModules = async (req, res) => {
  try {
    const { courseId } = req.params;

    const modules = await Module.find({ course: courseId })
      .sort({ order: 1 })
      .populate('lessons');

    res.status(200).json({
      success: true,
      count: modules.length,
      data: { modules }
    });
  } catch (error) {
    console.error('Get course modules error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get single module
// @route   GET /api/modules/:id
// @access  Public
export const getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id)
      .populate('course', 'title instructor')
      .populate('lessons');

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { module }
    });
  } catch (error) {
    console.error('Get module error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update module
// @route   PUT /api/modules/:id
// @access  Private/Instructor
export const updateModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id).populate('course');

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Check if user is the course instructor
    if (module.course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this module'
      });
    }

    const updatedModule = await Module.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Module updated successfully',
      data: { module: updatedModule }
    });
  } catch (error) {
    console.error('Update module error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete module
// @route   DELETE /api/modules/:id
// @access  Private/Instructor
export const deleteModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id).populate('course');

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Check if user is the course instructor
    if (module.course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this module'
      });
    }

    await module.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Module deleted successfully'
    });
  } catch (error) {
    console.error('Delete module error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
