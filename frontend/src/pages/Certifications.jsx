import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getEnrolledCourses } from '../services/courseService';

const Certifications = () => {
  const { user, isAuthenticated } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchCertificates();
    }
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await getEnrolledCourses();

      if (response.success) {
        // Filter to only show completed courses (mock data for now)
        const completedCourses = response.data.courses.filter(
          course => course.userProgress?.status === 'completed'
        );
        setCertificates(completedCourses);
      }
    } catch (err) {
      setError(err.message || 'Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryImage = (category, courseTitle = '') => {
    // Check course title for specific keywords first
    const titleLower = courseTitle.toLowerCase();

    if (titleLower.includes('software testing') || titleLower.includes('qa') || titleLower.includes('quality assurance')) {
      return '/images/Software Testing.jpeg';
    }
    if (titleLower.includes('data engineering')) {
      return '/images/Data engineering.jpeg';
    }
    if (titleLower.includes('data analysis') || titleLower.includes('excel') || titleLower.includes('sql')) {
      return '/images/Data Analysis.jpeg';
    }
    if (titleLower.includes('data science') || titleLower.includes('machine learning') || titleLower.includes('ml ')) {
      return '/images/Data science.jpeg';
    }
    if (titleLower.includes('cybersecurity') || titleLower.includes('security')) {
      return '/images/Cybersecurity.jpeg';
    }
    if (titleLower.includes('devops') || titleLower.includes('deployment')) {
      return '/images/Devops.jpeg';
    }
    if (titleLower.includes('mern') || titleLower.includes('web dev') || titleLower.includes('full stack')) {
      return '/images/MERN.jpeg';
    }
    if (titleLower.includes('mobile') || titleLower.includes('android') || titleLower.includes('ios')) {
      return '/images/Mobile App Development.jpeg';
    }

    // Fall back to category mapping
    const images = {
      'Web Development': '/images/MERN.jpeg',
      'Mobile Development': '/images/Mobile App Development.jpeg',
      'Mobile App Development': '/images/Mobile App Development.jpeg',
      'Data Science': '/images/Data science.jpeg',
      'Data Analysis': '/images/Data Analysis.jpeg',
      'Data Engineering': '/images/Data engineering.jpeg',
      'Machine Learning': '/images/Data science.jpeg',
      'Cybersecurity': '/images/Cybersecurity.jpeg',
      'DevOps': '/images/Devops.jpeg',
      'Software Testing': '/images/Software Testing.jpeg',
      'Design': '/images/MERN.jpeg',
      'Business': '/images/Data Analysis.jpeg',
      'Marketing': '/images/Data Analysis.jpeg',
      'Photography': '/images/MERN.jpeg',
      'Music': '/images/MERN.jpeg',
      'Other': '/images/Software Testing.jpeg'
    };
    return images[category] || '/images/MERN.jpeg';
  };

  const downloadCertificate = (course) => {
    // Create a canvas to generate the certificate
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1f2937');
    gradient.addColorStop(1, '#374151');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 15;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    // Inner border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

    // Title
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF COMPLETION', canvas.width / 2, 150);

    // Subtitle
    ctx.fillStyle = '#ffffff';
    ctx.font = '30px Arial';
    ctx.fillText('This is to certify that', canvas.width / 2, 250);

    // Student name
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 48px Arial';
    ctx.fillText(user?.name || 'Student', canvas.width / 2, 330);

    // Course completion text
    ctx.fillStyle = '#ffffff';
    ctx.font = '28px Arial';
    ctx.fillText('has successfully completed the course', canvas.width / 2, 400);

    // Course title
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 40px Arial';
    const maxWidth = canvas.width - 200;
    const courseTitle = course.title;
    ctx.fillText(courseTitle, canvas.width / 2, 480, maxWidth);

    // Date
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    const completionDate = course.userProgress?.completedAt
      ? new Date(course.userProgress.completedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
    ctx.fillText(`Date of Completion: ${completionDate}`, canvas.width / 2, 580);

    // Score
    if (course.userProgress?.completionPercentage) {
      ctx.fillText(
        `Final Score: ${course.userProgress.completionPercentage}%`,
        canvas.width / 2,
        620
      );
    }

    // Signature line
    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(canvas.width / 2 - 150, 720, 300, 2);

    // Instructor signature
    ctx.fillStyle = '#ffffff';
    ctx.font = '22px Arial';
    ctx.fillText(
      course.instructor?.name || 'Instructor',
      canvas.width / 2,
      750
    );
    ctx.font = '18px Arial';
    ctx.fillText('Course Instructor', canvas.width / 2, 775);

    // EduHub logo/text
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('EduHub', canvas.width / 2, 820);

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${course.title.replace(/[^a-z0-9]/gi, '_')}_Certificate.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  const viewCertificate = (course) => {
    // Open certificate in new window for viewing
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');

    // Same certificate generation code as download
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1f2937');
    gradient.addColorStop(1, '#374151');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 15;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF COMPLETION', canvas.width / 2, 150);

    ctx.fillStyle = '#ffffff';
    ctx.font = '30px Arial';
    ctx.fillText('This is to certify that', canvas.width / 2, 250);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 48px Arial';
    ctx.fillText(user?.name || 'Student', canvas.width / 2, 330);

    ctx.fillStyle = '#ffffff';
    ctx.font = '28px Arial';
    ctx.fillText('has successfully completed the course', canvas.width / 2, 400);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 40px Arial';
    const maxWidth = canvas.width - 200;
    ctx.fillText(course.title, canvas.width / 2, 480, maxWidth);

    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    const completionDate = course.userProgress?.completedAt
      ? new Date(course.userProgress.completedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
    ctx.fillText(`Date of Completion: ${completionDate}`, canvas.width / 2, 580);

    if (course.userProgress?.completionPercentage) {
      ctx.fillText(
        `Final Score: ${course.userProgress.completionPercentage}%`,
        canvas.width / 2,
        620
      );
    }

    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(canvas.width / 2 - 150, 720, 300, 2);

    ctx.fillStyle = '#ffffff';
    ctx.font = '22px Arial';
    ctx.fillText(course.instructor?.name || 'Instructor', canvas.width / 2, 750);
    ctx.font = '18px Arial';
    ctx.fillText('Course Instructor', canvas.width / 2, 775);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('EduHub', canvas.width / 2, 820);

    // Open in new window
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${course.title}</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #1f2937; }
            img { max-width: 100%; height: auto; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
          </style>
        </head>
        <body>
          <img src="${canvas.toDataURL()}" alt="Certificate" />
        </body>
      </html>
    `);
  };

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please log in to view your certificates.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center gap-3">
            <span className="text-5xl">🎓</span>
            My Certificates
          </h1>
          <p className="text-gray-600 text-lg">
            View and download certificates for all the courses you've completed
          </p>
        </div>

        {/* Certificates Grid */}
        {certificates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📜</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Certificates Yet</h3>
            <p className="text-gray-600 mb-6">
              Complete a course to earn your first certificate!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                {/* Course Image */}
                <div className="h-40 relative overflow-hidden">
                  <img
                    src={getCategoryImage(course.category, course.title)}
                    alt={course.category}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1 shadow-lg">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Completed
                  </div>
                </div>

                {/* Certificate Info */}
                <div className="p-6">
                  <div className="flex items-start gap-2 mb-3">
                    <span className="text-2xl">🏆</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600">{course.category}</p>
                    </div>
                  </div>

                  {/* Completion Details */}
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        Completed:{' '}
                        {course.userProgress?.completedAt
                          ? new Date(course.userProgress.completedAt).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                    {course.userProgress?.completionPercentage && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Score: {course.userProgress.completionPercentage}%</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => viewCertificate(course)}
                      className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-semibold text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => downloadCertificate(course)}
                      className="flex-1 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition font-semibold text-sm flex items-center justify-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Certifications;
