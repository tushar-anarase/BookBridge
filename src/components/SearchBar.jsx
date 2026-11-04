import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ value, onChange, onClear, placeholder = 'Search by book title or author...' }) => {
  return (
    <div className="search-bar-container">
      <Search size={18} className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={onClear}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

