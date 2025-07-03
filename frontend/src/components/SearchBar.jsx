import React, { useState } from 'react';

const SearchBar = ({ suggestions, onSearch, onInputChange }) => {
  const [input, setInput] = useState('');

  const handleChange = (e) => {
    setInput(e.target.value);
    onInputChange(e.target.value);
  };

  const handleSelect = (suggestion) => {
    setInput(suggestion);
    onSearch(suggestion);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={input}
        onChange={handleChange}
        placeholder="Search Drive files or folders..."
      />
      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border border-gray-200 rounded shadow mt-1 z-10">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar; 