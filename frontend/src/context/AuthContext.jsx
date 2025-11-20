import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  getCurrentUser,
  getUserFromStorage,
  isAuthenticated as checkAuth
} from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = getUserFromStorage();
        if (storedUser && checkAuth()) {
          setUser(storedUser);
          // Optionally fetch fresh user data
          try {
            const response = await getCurrentUser();
            if (response.success) {
              setUser(response.data.user);
            }
          } catch (err) {
            console.error('Failed to fetch current user:', err);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await registerService(userData);
      if (response.success) {
        setUser(response.data.user);
        return { success: true, data: response.data };
      }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      const response = await loginService(credentials);
      if (response.success) {
        setUser(response.data.user);
        return { success: true, data: response.data };
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    logoutService();
    setUser(null);
    setError(null);
  };

  // Update user in context
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && checkAuth();
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is student
  const isStudent = () => {
    return hasRole('student');
  };

  // Check if user is instructor
  const isInstructor = () => {
    return hasRole('instructor');
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateUser,
    isAuthenticated,
    hasRole,
    isStudent,
    isInstructor
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
