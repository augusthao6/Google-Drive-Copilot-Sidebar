import React from 'react';

const LoginButton = ({ onLogin }) => (
  <button
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    onClick={onLogin}
  >
    Login with Google
  </button>
);

export default LoginButton; 