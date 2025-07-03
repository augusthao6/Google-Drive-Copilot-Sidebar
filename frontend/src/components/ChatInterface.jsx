import React from 'react';

const ChatInterface = ({ messages, onSend }) => {
  const [input, setInput] = React.useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 p-4 rounded">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <div className="font-semibold text-gray-700">{msg.role === 'user' ? 'You' : 'Copilot'}:</div>
            <div className="text-gray-900">{msg.text}</div>
            {msg.citations && msg.citations.length > 0 && (
              <div className="text-xs text-blue-600 mt-1">
                Sources: {msg.citations.map((c, i) => <span key={i}>{c}{i < msg.citations.length - 1 ? ', ' : ''}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded px-3 py-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask something..."
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface; 