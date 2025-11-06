'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context with default values for SSR
const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  register: async () => ({ success: false }),
  checkAuth: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  // During SSR/build, return default context
  if (!context && typeof window === 'undefined') {
    return {
      user: null,
      loading: true,
      login: async () => ({ success: false }),
      logout: async () => {},
      register: async () => ({ success: false }),
      checkAuth: async () => {},
    };
  }
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('[AUTH] Checking authentication status...');
      const response = await fetch('/api/user/profile', {
        credentials: 'include',
      });
      
      console.log('[AUTH] Profile check response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('[AUTH] Auth check successful, user:', data.user?.email);
        setUser(data.user);
      } else {
        console.log('[AUTH] Auth check failed, status:', response.status);
        setUser(null);
      }
    } catch (error) {
      console.error('[AUTH] Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      console.log('[AUTH] Attempting login for:', email);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe }),
        credentials: 'include',
      });

      console.log('[AUTH] Login response status:', response.status);
      const data = await response.json();

      if (response.ok) {
        console.log('[AUTH] Login successful, user:', data.user?.email);
        setUser(data.user);
        return { success: true, message: data.message };
      } else {
        console.log('[AUTH] Login failed:', data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('[AUTH] Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user state even if request fails
      setUser(null);
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};