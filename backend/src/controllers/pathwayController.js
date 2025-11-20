import Course from '../models/Course.js';
import Progress from '../models/Progress.js';

// Get all pathways available
export const getAllPathways = async (req, res) => {
  try {
    // Get unique pathways from courses
    const pathways = await Course.aggregate([
      {
        $match: { 'pathway.name': { $exists: true, $ne: null } }
      },
      {
        $group: {
          _id: '$pathway.name',
          totalStages: { $first: '$pathway.totalStages' },
          courses: { $push: '$$ROOT' }
        }
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          totalStages: 1,
          courseCount: { $size: '$courses' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: { pathways }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pathways',
      error: error.message
    });
  }
};

// Get specific pathway with all its courses and user progress
export const getPathwayByName = async (req, res) => {
  try {
    const { pathwayName } = req.params;
    const userId = req.user?._id;

    // Fetch all courses in this pathway, sorted by stage
    const courses = await Course.find({
      'pathway.name': pathwayName
    })
      .sort({ 'pathway.stage': 1 })
      .populate('instructor', 'name email');

    if (!courses || courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pathway not found'
      });
    }

    // If user is authenticated, get their progress for each course
    let userProgress = {};
    if (userId) {
      const progressRecords = await Progress.find({
        student: userId,
        course: { $in: courses.map(c => c._id) }
      });

      progressRecords.forEach(progress => {
        userProgress[progress.course.toString()] = {
          completionPercentage: progress.completionPercentage,
          currentWeek: progress.currentWeek,
          totalWeeks: progress.totalWeeks,
          status: progress.status,
          pointsEarned: progress.pointsEarned,
          lastAccessedAt: progress.lastAccessedAt,
          completedAt: progress.completedAt
        };
      });
    }

    // Determine lock status for each course
    const coursesWithStatus = await Promise.all(
      courses.map(async (course) => {
        const courseObj = course.toObject();
        const progress = userProgress[course._id.toString()];

        // Check if course should be locked based on prerequisites
        let isLocked = false;
        let prerequisitesMet = true;

        if (course.prerequisites && course.prerequisites.length > 0) {
          for (const prereq of course.prerequisites) {
            const prereqProgress = await Progress.findOne({
              student: userId,
              course: prereq.courseId,
              status: 'completed'
            });

            if (!prereqProgress || prereqProgress.completionPercentage < prereq.minimumScore) {
              prerequisitesMet = false;
              isLocked = true;
              break;
            }
          }
        }

        return {
          ...courseObj,
          userProgress: progress || null,
          isLocked,
          prerequisitesMet
        };
      })
    );

    // Calculate overall pathway progress
    const totalCourses = courses.length;
    const completedCourses = coursesWithStatus.filter(
      c => c.userProgress && c.userProgress.status === 'completed'
    ).length;
    const activeCourses = coursesWithStatus.filter(
      c => c.userProgress && c.userProgress.status === 'in-progress'
    ).length;
    const lockedCourses = coursesWithStatus.filter(c => c.isLocked).length;

    const overallProgress = totalCourses > 0
      ? Math.round((completedCourses / totalCourses) * 100)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        pathway: {
          name: pathwayName,
          totalStages: courses[0].pathway.totalStages,
          courses: coursesWithStatus
        },
        stats: {
          totalCourses,
          completedCourses,
          activeCourses,
          lockedCourses,
          overallProgress
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pathway',
      error: error.message
    });
  }
};

// Check if user can unlock a course
export const checkCourseUnlock = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check prerequisites
    let canUnlock = true;
    const unmetPrerequisites = [];

    if (course.prerequisites && course.prerequisites.length > 0) {
      for (const prereq of course.prerequisites) {
        const prereqProgress = await Progress.findOne({
          student: userId,
          course: prereq.courseId,
          status: 'completed'
        });

        const prereqCourse = await Course.findById(prereq.courseId);

        if (!prereqProgress || prereqProgress.completionPercentage < prereq.minimumScore) {
          canUnlock = false;
          unmetPrerequisites.push({
            courseId: prereq.courseId,
            courseTitle: prereqCourse?.title,
            minimumScore: prereq.minimumScore,
            currentScore: prereqProgress?.completionPercentage || 0
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        canUnlock,
        unmetPrerequisites
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking course unlock status',
      error: error.message
    });
  }
};

// Get pathway progress summary for student
export const getStudentPathwayProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all progress records for the student
    const progressRecords = await Progress.find({ student: userId })
      .populate('course', 'title pathway');

    // Group by pathway
    const pathwayProgress = {};

    progressRecords.forEach(progress => {
      if (progress.course.pathway && progress.course.pathway.name) {
        const pathwayName = progress.course.pathway.name;

        if (!pathwayProgress[pathwayName]) {
          pathwayProgress[pathwayName] = {
            name: pathwayName,
            totalStages: progress.course.pathway.totalStages,
            courses: [],
            completedCount: 0,
            inProgressCount: 0,
            totalPoints: 0
          };
        }

        pathwayProgress[pathwayName].courses.push({
          courseId: progress.course._id,
          courseTitle: progress.course.title,
          stage: progress.course.pathway.stage,
          status: progress.status,
          completionPercentage: progress.completionPercentage,
          pointsEarned: progress.pointsEarned
        });

        if (progress.status === 'completed') {
          pathwayProgress[pathwayName].completedCount++;
        } else if (progress.status === 'in-progress') {
          pathwayProgress[pathwayName].inProgressCount++;
        }

        pathwayProgress[pathwayName].totalPoints += progress.pointsEarned;
      }
    });

    res.status(200).json({
      success: true,
      data: { pathways: Object.values(pathwayProgress) }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pathway progress',
      error: error.message
    });
  }
};
