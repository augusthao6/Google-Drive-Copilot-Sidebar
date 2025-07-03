import React, { useState } from 'react';
import LoginButton from './components/LoginButton';
import SearchBar from './components/SearchBar';
import ChatInterface from './components/ChatInterface';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [messages, setMessages] = useState([]);

  // Placeholder: handle Google OAuth login
  const handleLogin = async () => {
    // Fetch auth URL from backend
    const res = await fetch('http://localhost:3001/auth');
    const data = await res.json();
    window.location.href = data.url;
  };

  // Placeholder: handle search input change
  const handleInputChange = async (input) => {
    if (!accessToken) return;
    const res = await fetch(`http://localhost:3001/files?access_token=${accessToken}`);
    const files = await res.json();
    setSuggestions(files.map(f => f.name));
  };

  // Placeholder: handle search selection
  const handleSearch = (selection) => {
    setMessages(msgs => [...msgs, { role: 'user', text: `Search: ${selection}` }]);
  };

  // Placeholder: handle chat send
  const handleSend = async (prompt) => {
    if (!accessToken) return;
    setMessages(msgs => [...msgs, { role: 'user', text: prompt }]);
    const res = await fetch('http://localhost:3001/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, access_token: accessToken })
    });
    const data = await res.json();
    setMessages(msgs => [...msgs, { role: 'copilot', text: data.answer, citations: data.citations }]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Google Drive Copilot Sidebar</h1>
        {!isLoggedIn ? (
          <LoginButton onLogin={handleLogin} />
        ) : (
          <>
            <SearchBar suggestions={suggestions} onSearch={handleSearch} onInputChange={handleInputChange} />
            <div className="my-6" />
            <ChatInterface messages={messages} onSend={handleSend} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
