import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import Module from '../models/Module.js';

// Get all lessons for a module
export const getLessonsByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const lessons = await Lesson.find({ module: moduleId })
      .populate('instructor', 'name email')
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: { lessons }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lessons',
      error: error.message
    });
  }
};

// Get upcoming lessons for student (based on enrolled courses)
export const getUpcomingLessons = async (req, res) => {
  try {
    const studentId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;

    // Get student's enrolled courses
    const student = await req.user.populate('enrolledCourses');
    const courseIds = student.enrolledCourses.map(c => c._id);

    const lessons = await Lesson.getUpcomingLessons(courseIds, limit);

    res.status(200).json({
      success: true,
      data: { lessons }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming lessons',
      error: error.message
    });
  }
};

// Get lessons by date range (for calendar view)
export const getLessonsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const studentId = req.user._id;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide startDate and endDate'
      });
    }

    // Get student's enrolled courses
    const student = await req.user.populate('enrolledCourses');
    const courseIds = student.enrolledCourses.map(c => c._id);

    const start = new Date(startDate);
    const end = new Date(endDate);

    const lessons = await Lesson.getLessonsByDateRange(start, end, courseIds);

    res.status(200).json({
      success: true,
      data: { lessons }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lessons',
      error: error.message
    });
  }
};

// Get single lesson by ID
export const getLessonById = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId)
      .populate('course', 'title')
      .populate('module', 'title')
      .populate('instructor', 'name email avatar');

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { lesson }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lesson',
      error: error.message
    });
  }
};

// Create new lesson (instructor only)
export const createLesson = async (req, res) => {
  try {
    const instructorId = req.user._id;
    const {
      module: moduleId,
      course: courseId,
      title,
      description,
      content,
      type,
      scheduledDateTime,
      endDateTime,
      meetingLink,
      meetingId,
      meetingPassword,
      videoUrl,
      duration,
      order,
      resources,
      status,
      pointsReward,
      objectives
    } = req.body;

    // Verify module exists
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Verify course exists if provided
    if (courseId) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }
    }

    const lesson = await Lesson.create({
      module: moduleId,
      course: courseId || module.course,
      instructor: instructorId,
      title,
      description,
      content,
      type,
      scheduledDateTime,
      endDateTime,
      meetingLink,
      meetingId,
      meetingPassword,
      videoUrl,
      duration,
      order,
      resources,
      status,
      pointsReward,
      objectives
    });

    await lesson.populate('instructor', 'name email');

    res.status(201).json({
      success: true,
      data: { lesson },
      message: 'Lesson created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating lesson',
      error: error.message
    });
  }
};

// Update lesson (instructor only)
export const updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const updates = req.body;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check if user is the instructor of this lesson
    if (lesson.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this lesson'
      });
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      updates,
      { new: true, runValidators: true }
    ).populate('instructor', 'name email');

    res.status(200).json({
      success: true,
      data: { lesson: updatedLesson },
      message: 'Lesson updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating lesson',
      error: error.message
    });
  }
};

// Delete lesson (instructor only)
export const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check if user is the instructor of this lesson
    if (lesson.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this lesson'
      });
    }

    await lesson.remove();

    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting lesson',
      error: error.message
    });
  }
};

// Mark attendance for a lesson
export const markAttendance = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const studentId = req.user._id;
    const { attended = true } = req.body;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    await lesson.markAttendance(studentId, attended);

    res.status(200).json({
      success: true,
      message: 'Attendance marked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking attendance',
      error: error.message
    });
  }
};

// Get lesson attendance (instructor only)
export const getLessonAttendance = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId)
      .populate('attendees.student', 'name email');

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check if user is the instructor
    if (lesson.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view attendance'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        attendance: lesson.attendees,
        totalAttendees: lesson.attendees.length,
        attended: lesson.attendees.filter(a => a.attended).length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance',
      error: error.message
    });
  }
};
