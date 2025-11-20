import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to EduHub
          </h1>
          <p className="text-xl mb-8 text-gray-200">
            Your gateway to online learning. Discover courses, track progress, and achieve your goals.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/courses"
              className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
            >
              Browse Courses
            </Link>
            <Link
              to="/register"
              className="bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition border-2 border-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose EduHub?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Quality Courses</h3>
              <p className="text-gray-600">
                Learn from expert instructors with comprehensive course materials
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your learning journey with detailed progress tracking
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
              <p className="text-gray-600">
                Engage with instructors and peers through live Q&A and discussions
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
