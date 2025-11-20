import Course from '../models/Course.js';
import User from '../models/User.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getAllCourses = async (req, res) => {
  try {
    const {
      category,
      level,
      search,
      sort = '-createdAt',
      page = 1,
      limit = 12
    } = req.query;

    // Build query
    const query = { isPublished: true };

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Execute query
    const courses = await Course.find(query)
      .populate('instructor', 'name avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-modules'); // Don't include full modules in list view

    const total = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        courses,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching courses'
    });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar bio')
      .populate({
        path: 'modules',
        populate: {
          path: 'lessons',
          select: 'title duration order isFree'
        }
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { course }
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching course'
    });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Instructor only)
export const createCourse = async (req, res) => {
  try {
    // Add instructor from logged-in user
    req.body.instructor = req.user.id;

    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: { course }
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating course'
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor - owner only)
export const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Make sure user is course owner
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: { course }
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating course'
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor - owner only)
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Make sure user is course owner
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting course'
    });
  }
};

// @desc    Get instructor's courses
// @route   GET /api/courses/instructor/my-courses
// @access  Private (Instructor only)
export const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate('modules')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: {
        courses,
        count: courses.length
      }
    });
  } catch (error) {
    console.error('Get instructor courses error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching your courses'
    });
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private (Student only)
export const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }

    // Add student to course
    course.enrolledStudents.push(req.user.id);
    await course.save();

    // Add course to user's enrolledCourses
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { enrolledCourses: course._id }
    });

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: { course }
    });
  } catch (error) {
    console.error('Enroll in course error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error enrolling in course'
    });
  }
};

// @desc    Withdraw from a course
// @route   DELETE /api/courses/:id/withdraw
// @access  Private (Student only)
export const withdrawFromCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if enrolled
    if (!course.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }

    // Remove student from course
    course.enrolledStudents = course.enrolledStudents.filter(
      studentId => studentId.toString() !== req.user.id.toString()
    );
    await course.save();

    // Remove course from user's enrolledCourses
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { enrolledCourses: course._id }
    });

    res.status(200).json({
      success: true,
      message: 'Successfully withdrawn from course',
      data: { course }
    });
  } catch (error) {
    console.error('Withdraw from course error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error withdrawing from course'
    });
  }
};

// @desc    Get enrolled courses
// @route   GET /api/courses/student/enrolled
// @access  Private (Student only)
export const getEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'enrolledCourses',
      populate: {
        path: 'instructor',
        select: 'name avatar'
      }
    });

    res.status(200).json({
      success: true,
      data: {
        courses: user.enrolledCourses,
        count: user.enrolledCourses.length
      }
    });
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching enrolled courses'
    });
  }
};
