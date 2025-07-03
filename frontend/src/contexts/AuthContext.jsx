import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);

  // Check for auth success/error on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = window.location.pathname === '/auth-success';
    const authError = window.location.pathname === '/auth-error';

    if (authSuccess) {
      const userId = urlParams.get('userId');
      const accessToken = urlParams.get('accessToken');
      
      if (userId && accessToken) {
        setUserId(userId);
        setAccessToken(accessToken);
        setUser({ id: userId }); // Will be populated with full user info
        fetchUserInfo(userId);
      }
      
      // Clean up URL
      window.history.replaceState({}, document.title, '/');
    } else if (authError) {
      const error = urlParams.get('error');
      console.error('Auth error:', error);
      // Clean up URL
      window.history.replaceState({}, document.title, '/');
    }
    
    setLoading(false);
  }, []);

  const fetchUserInfo = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/auth/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data.userInfo);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const login = async () => {
    try {
      const response = await fetch('http://localhost:3001/auth');
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken('');
    setUserId('');
  };

  const value = {
    user,
    accessToken,
    userId,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 