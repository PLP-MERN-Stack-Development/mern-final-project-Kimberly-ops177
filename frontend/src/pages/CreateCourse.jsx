import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse, courseCategories, courseLevels } from '../services/courseService';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    level: 'beginner',
    price: 0,
    selfPacedPrice: 0,
    learningModes: ['self-paced', 'with-tutor'],
    deliveryMode: 'online',
    language: 'English',
    requirements: '',
    whatYouWillLearn: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      // Convert comma-separated strings to arrays
      const courseData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        requirements: formData.requirements
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item),
        whatYouWillLearn: formData.whatYouWillLearn
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item)
      };

      const response = await createCourse(courseData);

      if (response.success) {
        navigate('/dashboard/instructor');
      } else {
        setError(response.message || 'Failed to create course');
      }
    } catch (err) {
      setError(err.message || 'Failed to create course');
      console.error('Create course error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Create New Course</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Course Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="e.g., Complete Web Development Bootcamp"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={loading}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Describe what students will learn in this course..."
            />
          </div>

          {/* Category and Level */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
              >
                {courseCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level *
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
              >
                {courseLevels.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price with Tutor (USD)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="Premium price with mentorship"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Self-Paced Price (USD)
              </label>
              <input
                type="number"
                name="selfPacedPrice"
                value={formData.selfPacedPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="Usually 20-30% less"
              />
              <p className="text-xs text-gray-500 mt-1">Typically 20-30% less than with-tutor price</p>
            </div>
          </div>

          {/* Language and Delivery */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="English"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Mode
              </label>
              <select
                name="deliveryMode"
                value={formData.deliveryMode}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              disabled={loading}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Enter requirements separated by commas (e.g., Basic HTML knowledge, Computer with internet)"
            />
            <p className="text-xs text-gray-500 mt-1">Separate each requirement with a comma</p>
          </div>

          {/* What You Will Learn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What Students Will Learn
            </label>
            <textarea
              name="whatYouWillLearn"
              value={formData.whatYouWillLearn}
              onChange={handleChange}
              disabled={loading}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Enter learning outcomes separated by commas (e.g., Build responsive websites, Master JavaScript, Deploy to production)"
            />
            <p className="text-xs text-gray-500 mt-1">Separate each outcome with a comma</p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Course...' : 'Create Course'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/instructor')}
              disabled={loading}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> After creating the course, you can add modules and lessons from your instructor dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
