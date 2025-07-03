import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginButton from './components/LoginButton';
import SearchBar from './components/SearchBar';
import ChatInterface from './components/ChatInterface';

function AppContent() {
  const { isAuthenticated, userId } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [messages, setMessages] = useState([]);

  // Handle search input change
  const handleInputChange = async (input) => {
    if (!isAuthenticated) return;
    try {
      const res = await fetch(`http://localhost:3001/files?userId=${userId}`);
      if (res.ok) {
        const files = await res.json();
        const filteredFiles = files.filter(f => 
          f.name.toLowerCase().includes(input.toLowerCase())
        );
        setSuggestions(filteredFiles.map(f => f.name));
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  // Handle search selection
  const handleSearch = (selection) => {
    setMessages(msgs => [...msgs, { role: 'user', text: `Search: ${selection}` }]);
  };

  // Handle chat send
  const handleSend = async (prompt) => {
    if (!isAuthenticated) return;
    setMessages(msgs => [...msgs, { role: 'user', text: prompt }]);
    
    try {
      const res = await fetch('http://localhost:3001/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, userId })
      });
      
      if (res.ok) {
        const data = await res.json();
        setMessages(msgs => [...msgs, { 
          role: 'copilot', 
          text: data.answer, 
          citations: data.citations 
        }]);
      }
    } catch (error) {
      console.error('Error sending query:', error);
      setMessages(msgs => [...msgs, { 
        role: 'copilot', 
        text: 'Sorry, there was an error processing your request.',
        citations: []
      }]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Google Drive Copilot Sidebar</h1>
          <LoginButton />
        </div>
        
        {isAuthenticated ? (
          <>
            <SearchBar 
              suggestions={suggestions} 
              onSearch={handleSearch} 
              onInputChange={handleInputChange} 
            />
            <div className="my-6" />
            <ChatInterface messages={messages} onSend={handleSend} />
          </>
        ) : (
          <div className="text-center text-gray-600">
            Please log in to access your Google Drive files.
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
