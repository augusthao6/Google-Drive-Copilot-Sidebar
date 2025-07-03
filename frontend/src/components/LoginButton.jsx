import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginButton = () => {
  const { user, loading, login, logout, isAuthenticated } = useAuth();

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <div className="font-semibold">{user?.name || 'User'}</div>
          <div className="text-gray-600">{user?.email}</div>
        </div>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      onClick={login}
    >
      Login with Google
    </button>
  );
};

export default LoginButton; 