import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
   try {
     const { name, email, password, role } = req.body;
     console.log(`[${new Date().toISOString()}] Registration attempt for email: ${email}, name: ${name}, role: ${role || 'student'}`);

     // Validate input
     if (!name || !email || !password) {
       console.log(`[${new Date().toISOString()}] Registration failed: Missing required fields - name: ${!!name}, email: ${!!email}, password: ${!!password}`);
       return res.status(400).json({
         success: false,
         message: 'Please provide name, email, and password'
       });
     }

     // Check if user already exists
     console.log(`[${new Date().toISOString()}] Checking if user exists for email: ${email}`);
     const userExists = await User.findOne({ email });
     console.log(`[${new Date().toISOString()}] User exists check result: ${!!userExists}`);
     if (userExists) {
       console.log(`[${new Date().toISOString()}] Registration failed: User already exists with email: ${email}`);
       return res.status(400).json({
         success: false,
         message: 'User already exists with this email'
       });
     }

     // Create user
     console.log(`[${new Date().toISOString()}] Creating new user with email: ${email}`);
     const user = await User.create({
       name,
       email,
       password,
       role: role || 'student' // Default to student if not provided
     });
     console.log(`[${new Date().toISOString()}] User created successfully with ID: ${user._id}, hashed password length: ${user.password ? user.password.length : 'undefined'}`);

    // Generate token
    const token = generateToken(user._id);
    console.log(`[${new Date().toISOString()}] JWT token generated for user: ${user._id}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio
        },
        token
      }
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Register error:`, error.message, error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Error registering user'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
   try {
     const { email, password } = req.body;
     console.log(`[${new Date().toISOString()}] Login attempt for email: ${email}, password length: ${password ? password.length : 'undefined'}`);

     // Validate input
     if (!email || !password) {
       console.log(`[${new Date().toISOString()}] Login failed: Missing email or password - email: ${!!email}, password: ${!!password}`);
       return res.status(400).json({
         success: false,
         message: 'Please provide email and password'
       });
     }

     // Find user and include password for comparison
     console.log(`[${new Date().toISOString()}] Querying database for user with email: ${email}`);
     const user = await User.findOne({ email }).select('+password');
     console.log(`[${new Date().toISOString()}] User query result: ${!!user}, user ID: ${user ? user._id : 'null'}, hashed password length: ${user && user.password ? user.password.length : 'undefined'}`);

     if (!user) {
       console.log(`[${new Date().toISOString()}] Login failed: User not found for email: ${email}`);
       return res.status(401).json({
         success: false,
         message: 'Invalid credentials'
       });
     }

     // Check password
     console.log(`[${new Date().toISOString()}] Checking password for user: ${user._id}`);
     const isPasswordCorrect = await user.comparePassword(password);
     console.log(`[${new Date().toISOString()}] Password comparison result: ${isPasswordCorrect}`);

     if (!isPasswordCorrect) {
       console.log(`[${new Date().toISOString()}] Login failed: Incorrect password for user: ${user._id}`);
       return res.status(401).json({
         success: false,
         message: 'Invalid credentials'
       });
     }

    // Generate token
    const token = generateToken(user._id);
    console.log(`[${new Date().toISOString()}] Login successful, JWT token generated for user: ${user._id}`);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio
        },
        token
      }
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Login error:`, error.message, error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Error logging in'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
          enrolledCourses: user.enrolledCourses,
          createdCourses: user.createdCourses
        }
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error getting user data'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile'
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isPasswordCorrect = await user.comparePassword(currentPassword);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error changing password'
    });
  }
};
