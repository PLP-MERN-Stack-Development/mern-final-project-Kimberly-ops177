import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getModuleById } from '../services/moduleService';
import { getLessonsByModule } from '../services/lessonService';
import { useAuth } from '../context/AuthContext';

const ModuleDetail = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [module, setModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('curriculum'); // curriculum, overview, instructor

  useEffect(() => {
    fetchModuleData();
  }, [moduleId]);

  const fetchModuleData = async () => {
    try {
      setLoading(true);

      const moduleResponse = await getModuleById(moduleId);
      if (moduleResponse.success) {
        setModule(moduleResponse.data.module);
      }

      const lessonsResponse = await getLessonsByModule(moduleId);
      if (lessonsResponse.success) {
        setLessons(lessonsResponse.data.lessons);
      }
    } catch (error) {
      console.error('Error fetching module:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupLessonsByWeek = () => {
    const weeks = {};
    lessons.forEach(lesson => {
      // Extract week number from lesson title or use order
      const weekMatch = lesson.title.match(/Week (\d+)/i);
      const weekNum = weekMatch ? parseInt(weekMatch[1]) : Math.ceil((lesson.order + 1) / 5);

      if (!weeks[weekNum]) {
        weeks[weekNum] = [];
      }
      weeks[weekNum].push(lesson);
    });
    return weeks;
  };

  const getDurationInWeeks = () => {
    // Based on the curriculum structure (4 weeks for Python Fundamentals)
    return 4;
  };

  // Get module-specific content based on module title
  const getModuleContent = () => {
    const title = module?.title?.toLowerCase() || '';

    if (title.includes('python')) {
      return {
        icon: '🐍',
        subject: 'Python Programming',
        gradient: 'from-gray-900 via-gray-800 to-teal-900',
        learningPoints: [
          { title: 'Python Syntax & Fundamentals', desc: 'Master variables, data types, and control flow' },
          { title: 'Data Structures', desc: 'Work with lists, dictionaries, tuples, and sets' },
          { title: 'Functions & Modules', desc: 'Write reusable code and organize projects' },
          { title: 'File Operations', desc: 'Read, write, and manipulate files' }
        ]
      };
    } else if (title.includes('javascript') || title.includes('js')) {
      return {
        icon: '⚡',
        subject: 'JavaScript Development',
        gradient: 'from-gray-900 via-gray-800 to-yellow-900',
        learningPoints: [
          { title: 'JavaScript Fundamentals', desc: 'Variables, functions, and ES6+ syntax' },
          { title: 'DOM Manipulation', desc: 'Interactive web pages and event handling' },
          { title: 'Async Programming', desc: 'Promises, async/await, and API calls' },
          { title: 'Modern Frameworks', desc: 'React, Vue, or Angular basics' }
        ]
      };
    } else if (title.includes('web') || title.includes('html') || title.includes('css')) {
      return {
        icon: '🌐',
        subject: 'Web Development',
        gradient: 'from-gray-900 via-gray-800 to-blue-900',
        learningPoints: [
          { title: 'HTML5 Structure', desc: 'Semantic markup and accessibility' },
          { title: 'CSS3 Styling', desc: 'Flexbox, Grid, and responsive design' },
          { title: 'Web Design Principles', desc: 'UX/UI fundamentals and best practices' },
          { title: 'Modern Workflows', desc: 'Tools, frameworks, and deployment' }
        ]
      };
    } else if (title.includes('data') || title.includes('analytics')) {
      return {
        icon: '📊',
        subject: 'Data Science',
        gradient: 'from-gray-900 via-gray-800 to-purple-900',
        learningPoints: [
          { title: 'Data Analysis', desc: 'Pandas, NumPy, and statistical methods' },
          { title: 'Data Visualization', desc: 'Matplotlib, Seaborn, and Plotly' },
          { title: 'Machine Learning Basics', desc: 'Scikit-learn and model building' },
          { title: 'Real-world Projects', desc: 'Apply skills to practical datasets' }
        ]
      };
    } else if (title.includes('devops') || title.includes('deployment')) {
      return {
        icon: '⚙️',
        subject: 'DevOps & Deployment',
        gradient: 'from-gray-900 via-gray-800 to-cyan-900',
        learningPoints: [
          { title: 'CI/CD Pipelines', desc: 'Automated testing and deployment' },
          { title: 'Docker & Containers', desc: 'Containerization and orchestration' },
          { title: 'Cloud Platforms', desc: 'AWS, Azure, or Google Cloud basics' },
          { title: 'Infrastructure as Code', desc: 'Terraform and configuration management' }
        ]
      };
    } else {
      // Default/Generic content
      return {
        icon: '💻',
        subject: 'Programming',
        gradient: 'from-gray-900 via-gray-800 to-gray-900',
        learningPoints: [
          { title: 'Core Concepts & Fundamentals', desc: 'Master the essential building blocks' },
          { title: 'Hands-on Projects', desc: 'Build real-world applications' },
          { title: 'Best Practices', desc: 'Industry-standard techniques' },
          { title: 'Problem Solving', desc: 'Develop critical thinking skills' }
        ]
      };
    }
  };

  // Get curriculum based on module title
  const getModuleCurriculum = () => {
    const title = module?.title?.toLowerCase() || '';

    // MERN Stack Curriculum
    if (title.includes('mern') || title.includes('full stack') || title.includes('node') || title.includes('react')) {
      return [
        {
          lessonId: '2.1',
          title: 'Introduction to MERN Stack & Node.js Fundamentals',
          type: 'video',
          topics: [
            'What is the MERN Stack',
            'Node.js installation and setup',
            'NPM and package management',
            'Understanding async JavaScript'
          ]
        },
        {
          lessonId: '2.2',
          title: 'Express.js & Building RESTful APIs',
          type: 'video',
          topics: [
            'Express.js framework basics',
            'Routing and middleware',
            'Creating RESTful APIs',
            'Error handling in Express'
          ]
        },
        {
          lessonId: '2.3',
          title: 'MongoDB & Mongoose - Database Management',
          type: 'reading',
          topics: [
            'MongoDB installation and setup',
            'Mongoose ODM basics',
            'Schema design and models',
            'CRUD operations'
          ]
        },
        {
          lessonId: '2.4',
          title: 'React Fundamentals & Building User Interfaces',
          type: 'video',
          topics: [
            'React setup with Vite',
            'Components and JSX',
            'State and Props',
            'Hooks (useState, useEffect)'
          ]
        }
      ];
    }

    // DevOps Curriculum
    if (title.includes('devops') || title.includes('deployment') || title.includes('ci/cd')) {
      return [
        {
          lessonId: '3.1',
          title: 'Introduction to DevOps & CI/CD Pipelines',
          type: 'video',
          topics: [
            'What is DevOps',
            'Git version control',
            'GitHub Actions basics',
            'Continuous Integration concepts'
          ]
        },
        {
          lessonId: '3.2',
          title: 'Docker & Containerization',
          type: 'video',
          topics: [
            'Docker installation and setup',
            'Creating Dockerfiles',
            'Docker Compose',
            'Container networking'
          ]
        },
        {
          lessonId: '3.3',
          title: 'Cloud Deployment & AWS Fundamentals',
          type: 'reading',
          topics: [
            'AWS EC2 basics',
            'S3 for static hosting',
            'RDS for databases',
            'Deploying Node.js apps'
          ]
        }
      ];
    }

    // Cybersecurity Curriculum
    if (title.includes('cybersecurity') || title.includes('security') || title.includes('hacking')) {
      return [
        {
          lessonId: '4.1',
          title: 'Introduction to Cybersecurity & Security Fundamentals',
          type: 'video',
          topics: [
            'CIA Triad basics',
            'Common cyber threats',
            'Security best practices',
            'Password security and MFA'
          ]
        },
        {
          lessonId: '4.2',
          title: 'Network Security & Cryptography',
          type: 'reading',
          topics: [
            'Firewalls and VPNs',
            'Symmetric vs Asymmetric encryption',
            'Hashing algorithms',
            'SSL/TLS protocols'
          ]
        },
        {
          lessonId: '4.3',
          title: 'Ethical Hacking & Penetration Testing Basics',
          type: 'video',
          topics: [
            'Phases of penetration testing',
            'Network scanning with Nmap',
            'Web application vulnerabilities',
            'Legal and ethical considerations'
          ]
        }
      ];
    }

    // Python Curriculum (default)
    return [
      {
        lessonId: '1.1',
        title: 'Introduction & Set Up, Why Python Wins! 🤘',
        type: 'reading',
        topics: [
          'What is Python and why it\'s popular',
          'Installing Python and setting up your development environment',
          'Your first Python program: "Hello, World!"',
          'Understanding Python syntax and indentation'
        ]
      },
      {
        lessonId: '1.2',
        title: 'All About Python Variables 🧠💡',
        type: 'video',
        topics: [
          'What are variables and how to create them',
          'Variable naming conventions and best practices',
          'Understanding variable assignment and reassignment',
          'Working with different types of variables'
        ]
      },
      {
        lessonId: '1.3',
        title: 'Python Data Types',
        type: 'reading',
        topics: [
          'Integers, floats, and numeric operations',
          'Strings and string manipulation',
          'Booleans and logical operations',
          'Type conversion and casting'
        ]
      }
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Module Not Found</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const weeks = groupLessonsByWeek();
  const weekNumbers = Object.keys(weeks).sort((a, b) => a - b);
  const moduleContent = getModuleContent();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="flex items-start gap-8">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{module.title}</h1>
              <p className="text-lg text-teal-100 mb-4">{module.description}</p>
              <p className="text-sm">Language: English</p>
              <button className="mt-6 px-8 py-3 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition font-semibold text-lg">
                View Content →
              </button>
            </div>

            {/* Module Icon */}
            <div className="hidden lg:block">
              <div className="w-64 h-64 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
                <div className="text-center">
                  <div className="text-8xl mb-4">{moduleContent.icon}</div>
                  <p className="text-sm font-semibold text-teal-100">{moduleContent.subject}</p>
                </div>
              </div>
            </div>

            {/* Video Preview */}
            <div className="w-96 bg-teal-800 rounded-lg overflow-hidden">
              <div className="aspect-video bg-teal-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                  <p className="text-sm text-teal-300">Preview Video</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 max-w-6xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`pb-3 px-1 font-semibold transition ${
                    activeTab === 'curriculum'
                      ? 'border-b-2 border-teal-600 text-teal-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Curriculum
                </button>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 px-1 font-semibold transition ${
                    activeTab === 'overview'
                      ? 'border-b-2 border-teal-600 text-teal-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('instructor')}
                  className={`pb-3 px-1 font-semibold transition ${
                    activeTab === 'instructor'
                      ? 'border-b-2 border-teal-600 text-teal-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Instructor
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'curriculum' && (
              <div>
                <div className="mb-6">
                  <div className="text-sm font-semibold text-gray-600 mb-2">0% Completed</div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-600" style={{ width: '0%' }}></div>
                  </div>
                </div>

                {/* Real Lessons from API */}
                <div className="space-y-4">
                  {lessons.length === 0 ? (
                    <div className="bg-white rounded-lg p-8 text-center">
                      <p className="text-gray-600">No lessons available yet.</p>
                    </div>
                  ) : (
                    lessons.map((lesson, index) => (
                      <div
                        key={lesson._id}
                        onClick={() => navigate(`/lesson/${lesson._id}`)}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                                  {index + 1}
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900">{lesson.title}</h3>
                                  {lesson.description && (
                                    <p className="text-sm text-gray-600">{lesson.description}</p>
                                  )}
                                </div>
                              </div>

                              <div className="ml-13 mt-3 flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {lesson.duration} mins
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  lesson.type === 'recorded' || lesson.type === 'live' ? 'bg-purple-100 text-purple-700' :
                                  lesson.type === 'reading' ? 'bg-blue-100 text-blue-700' :
                                  lesson.type === 'assignment' ? 'bg-yellow-100 text-yellow-700' :
                                  lesson.type === 'quiz' ? 'bg-pink-100 text-pink-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {lesson.type}
                                </span>
                                {lesson.isFree && (
                                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                    FREE
                                  </span>
                                )}
                              </div>

                              {lesson.objectives && lesson.objectives.length > 0 && (
                                <div className="ml-13 mt-3">
                                  <p className="text-sm font-semibold text-gray-700 mb-1">Learning Objectives:</p>
                                  <ul className="text-sm text-gray-600 space-y-1">
                                    {lesson.objectives.slice(0, 3).map((objective, idx) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <span className="text-primary-600 mt-0.5">•</span>
                                        <span>{objective}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'overview' && (
              <div>
                {/* Module Overview Banner */}
                <div className={`relative bg-gradient-to-r ${moduleContent.gradient} rounded-2xl p-8 mb-8 overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-lg transform rotate-12"></div>
                    <div className="absolute bottom-5 right-20 w-24 h-24 bg-white rounded-full"></div>
                    <div className="absolute top-20 right-10 w-16 h-16 bg-white rounded-lg transform -rotate-45"></div>
                  </div>
                  <div className="relative z-10 flex items-center justify-between gap-6">
                    <div className="flex-1 text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <span className="text-4xl">{moduleContent.icon}</span>
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold">{module.title}</h2>
                          <p className="text-white/80">Master {moduleContent.subject} from Scratch</p>
                        </div>
                      </div>
                      <p className="text-white/90 leading-relaxed">
                        {module.description || `Transform from a novice to a confident ${moduleContent.subject} expert through hands-on projects and real-world applications!`}
                      </p>
                    </div>
                    <div className="hidden lg:flex gap-3">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                        <div className="text-3xl font-bold text-white">{getDurationInWeeks()}</div>
                        <div className="text-xs text-white/80">Weeks</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                        <div className="text-3xl font-bold text-white">{lessons.length}+</div>
                        <div className="text-xs text-white/80">Lessons</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                        <div className="text-3xl font-bold text-white">10+</div>
                        <div className="text-xs text-white/80">Projects</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Learning Objectives */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4">What You'll Learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {moduleContent.learningPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-3 bg-green-50 p-4 rounded-lg">
                        <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="font-semibold text-gray-800">{point.title}</p>
                          <p className="text-sm text-gray-600">{point.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Resources */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4">📚 Learning Resources</h3>

                  {/* Video Resources */}
                  <div className="mb-6">
                    <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                      Video Tutorials
                    </h4>
                    <div className="space-y-3">
                      <a
                        href="https://www.youtube.com/watch?v=rfscVS0vtbw"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-800 mb-1">Python Tutorial - Full Course for Beginners</h5>
                            <p className="text-sm text-gray-600 mb-2">freeCodeCamp.org • 4.5M views</p>
                            <p className="text-sm text-gray-500">Comprehensive introduction covering all the basics you need to get started</p>
                          </div>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </a>
                      <a
                        href="https://www.youtube.com/watch?v=_uQrJ0TkZlc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-800 mb-1">Python for Everybody</h5>
                            <p className="text-sm text-gray-600 mb-2">Dr. Chuck • 2.1M views</p>
                            <p className="text-sm text-gray-500">University-level course perfect for beginners</p>
                          </div>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* Reading Materials */}
                  <div className="mb-6">
                    <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Recommended Reading
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded flex items-center justify-center flex-shrink-0">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-800 mb-1">Python Crash Course (3rd Edition)</h5>
                            <p className="text-sm text-gray-600 mb-2">by Eric Matthes</p>
                            <p className="text-sm text-gray-500 mb-2">A hands-on, project-based introduction to programming with comprehensive exercises</p>
                            <div className="flex gap-2">
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Beginner-Friendly</span>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Highly Recommended</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded flex items-center justify-center flex-shrink-0">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-800 mb-1">Automate the Boring Stuff with Python</h5>
                            <p className="text-sm text-gray-600 mb-2">by Al Sweigart</p>
                            <p className="text-sm text-gray-500 mb-2">Learn to write programs that do in minutes what would take hours to do by hand</p>
                            <div className="flex gap-2">
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Practical</span>
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Free Online</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Online Resources */}
                  <div className="mb-6">
                    <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      Online Documentation & Resources
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <a
                        href="https://docs.python.org/3/tutorial/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-xl">📘</span>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-800 text-sm">Official Python Tutorial</h5>
                          <p className="text-xs text-gray-500">docs.python.org</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      <a
                        href="https://realpython.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition"
                      >
                        <div className="w-10 h-10 bg-orange-100 rounded flex items-center justify-center">
                          <span className="text-xl">🐍</span>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-800 text-sm">Real Python</h5>
                          <p className="text-xs text-gray-500">Tutorials & Articles</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      <a
                        href="https://www.w3schools.com/python/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition"
                      >
                        <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
                          <span className="text-xl">💻</span>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-800 text-sm">W3Schools Python</h5>
                          <p className="text-xs text-gray-500">Interactive Examples</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      <a
                        href="https://www.codecademy.com/learn/learn-python-3"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition"
                      >
                        <div className="w-10 h-10 bg-purple-100 rounded flex items-center justify-center">
                          <span className="text-xl">⚡</span>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-800 text-sm">Codecademy Python</h5>
                          <p className="text-xs text-gray-500">Interactive Lessons</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Practice Resources */}
                  <div>
                    <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Practice & Coding Challenges
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <a
                        href="https://www.hackerrank.com/domains/python"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition text-center"
                      >
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl">🎯</span>
                        </div>
                        <h5 className="font-semibold text-gray-800 text-sm mb-1">HackerRank</h5>
                        <p className="text-xs text-gray-500">Python Challenges</p>
                      </a>
                      <a
                        href="https://leetcode.com/problemset/all/?difficulty=EASY&page=1&topicSlugs=python"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition text-center"
                      >
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl">💡</span>
                        </div>
                        <h5 className="font-semibold text-gray-800 text-sm mb-1">LeetCode</h5>
                        <p className="text-xs text-gray-500">Coding Problems</p>
                      </a>
                      <a
                        href="https://www.codewars.com/?language=python"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition text-center"
                      >
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl">⚔️</span>
                        </div>
                        <h5 className="font-semibold text-gray-800 text-sm mb-1">Codewars</h5>
                        <p className="text-xs text-gray-500">Kata Challenges</p>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'instructor' && (
              <div>
                {/* Instructor Profile Card */}
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-8 mb-8">
                  <div className="flex items-start gap-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-white shadow-lg">
                      <img
                        src="https://ui-avatars.com/api/?name=Dr+Amara+Okonkwo&size=128&background=0D9488&color=fff&bold=true"
                        alt="Dr. Amara Okonkwo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold mb-2 text-gray-800">Dr. Amara Okonkwo</h3>
                      <p className="text-teal-700 font-semibold mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                        Lead Python Instructor & Software Engineer
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-white text-teal-700 rounded-full text-sm font-semibold shadow-sm">
                          🎓 PhD in Computer Science
                        </span>
                        <span className="px-3 py-1 bg-white text-blue-700 rounded-full text-sm font-semibold shadow-sm">
                          💼 15+ Years Experience
                        </span>
                        <span className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm font-semibold shadow-sm">
                          ⭐ 4.9/5.0 Rating
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          50,000+ Students
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          45 Courses
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    About the Instructor
                  </h3>
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Dr. Amara Okonkwo is a passionate educator and seasoned software engineer with over 15 years of experience in the tech industry. She holds a PhD in Computer Science from the University of Lagos and has worked with leading tech companies across Africa, Europe, and North America, including Andela, Microsoft, and several innovative African tech startups.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Amara specializes in making programming accessible to beginners while maintaining professional standards. Her teaching philosophy centers on hands-on learning, real-world projects, and building confidence through incremental challenges. She is particularly passionate about empowering African developers and bridging the tech skills gap across the continent.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      When she's not teaching, Amara contributes to open-source projects, mentors aspiring developers, and speaks at international tech conferences about education, software development best practices, and the growing African tech ecosystem.
                    </p>
                  </div>
                </div>

                {/* Expertise & Qualifications */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Areas of Expertise
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="text-2xl">🐍</span>
                        Python Development
                      </h4>
                      <p className="text-sm text-gray-600">Full-stack development, data analysis, automation, and web scraping</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="text-2xl">🤖</span>
                        Machine Learning
                      </h4>
                      <p className="text-sm text-gray-600">AI/ML algorithms, neural networks, and practical applications</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="text-2xl">🌐</span>
                        Web Development
                      </h4>
                      <p className="text-sm text-gray-600">Django, Flask, RESTful APIs, and modern web technologies</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="text-2xl">📊</span>
                        Data Science
                      </h4>
                      <p className="text-sm text-gray-600">Data visualization, pandas, NumPy, and statistical analysis</p>
                    </div>
                  </div>
                </div>

                {/* Student Reviews */}
                <div>
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    Student Reviews
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                          MK
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Michael Kim</p>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                            <span className="text-xs text-gray-500">2 weeks ago</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        "Dr. Okonkwo is an amazing instructor! Her explanations are clear and she breaks down complex concepts into digestible pieces. The hands-on projects really helped solidify my understanding of Python."
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold">
                          AP
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Aisha Patel</p>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                            <span className="text-xs text-gray-500">1 month ago</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        "As a complete beginner, I was nervous about learning programming. Dr. Okonkwo's patient teaching style and encouraging feedback made all the difference. I now feel confident writing Python code!"
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center text-white font-bold">
                          JR
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">James Rodriguez</p>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                            <span className="text-xs text-gray-500">3 weeks ago</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        "The best programming course I've taken online. Dr. Okonkwo's industry experience shines through in every lesson. The real-world examples and projects are incredibly valuable."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-4">Course Overview</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <div>
                    <p className="text-gray-600 text-sm">Skill Level:</p>
                    <p className="font-semibold">Beginner</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-gray-600 text-sm">Duration:</p>
                    <p className="font-semibold">{getDurationInWeeks()} Weeks</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <div>
                    <p className="text-gray-600 text-sm">Learning Mode:</p>
                    <p className="font-semibold">Online</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-gray-600 text-sm">Hours:</p>
                    <p className="font-semibold">15 hours per week</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <div>
                    <p className="text-gray-600 text-sm">Certificate:</p>
                    <p className="font-semibold">Yes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;
