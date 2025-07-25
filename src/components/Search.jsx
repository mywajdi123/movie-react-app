import React, { useState, useRef, useEffect } from 'react'

const Search = ({ searchTerm, setSearchTerm }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);

  // Handle typing animation
  useEffect(() => {
    if (searchTerm.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  // Focus management
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    inputRef.current?.focus();
  };

  // Quick search suggestions
  const quickSearches = [
    "Marvel", "Action", "Comedy", "Horror", "Sci-Fi", "Drama"
  ];

  const handleQuickSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="search">
      {/* Main Search Bar */}
      <div className={`search-container ${isFocused ? 'focused' : ''} ${isTyping ? 'typing' : ''}`}>
        {/* Search Icon */}
        <div className="search-icon">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none"
            className={`transition-all duration-300 ${isFocused ? 'scale-110 text-indigo-400' : 'text-gray-400'}`}
          >
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for movies, genres, actors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="search-input"
          autoComplete="off"
          spellCheck="false"
        />

        {/* Clear Button */}
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="clear-button group"
            type="button"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none"
              className="transition-all duration-200 group-hover:rotate-90"
            >
              <path 
                d="M18 6L6 18M6 6l12 12" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}

        {/* Loading Indicator */}
        {isTyping && (
          <div className="loading-indicator">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
        )}
      </div>

      {/* Quick Search Suggestions */}
      <div className={`quick-searches ${isFocused && !searchTerm ? 'visible' : ''}`}>
        <p className="quick-search-label">Popular Searches:</p>
        <div className="quick-search-buttons">
          {quickSearches.map((term, index) => (
            <button
              key={term}
              onClick={() => handleQuickSearch(term)}
              className="quick-search-btn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Search Stats */}
      {searchTerm && (
        <div className="search-stats">
          <span className="search-term">"{searchTerm}"</span>
          <div className="search-indicator">
            <div className="pulse-ring"></div>
            <div className="pulse-dot"></div>
          </div>
        </div>
      )}

      <style jsx>{`
        .search {
          width: 100%;
          max-width: 600px;
          margin: 3rem auto 0;
          position: relative;
        }

        .search-container {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 16px 24px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .search-container.focused {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(99, 102, 241, 0.4);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.4),
            0 0 30px rgba(99, 102, 241, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .search-container.typing {
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.4),
            0 0 40px rgba(139, 92, 246, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .search-icon {
          margin-right: 12px;
          display: flex;
          align-items: center;
          pointer-events: none;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.5;
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
          transition: color 0.3s ease;
        }

        .search-input:focus::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .clear-button {
          margin-left: 12px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .clear-button:hover {
          background: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.9);
          transform: scale(1.1);
        }

        .loading-indicator {
          margin-left: 12px;
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .loading-dot {
          width: 4px;
          height: 4px;
          background: rgba(99, 102, 241, 0.8);
          border-radius: 50%;
          animation: loadingPulse 1.4s ease-in-out infinite both;
        }

        .loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes loadingPulse {
          0%, 80%, 100% { 
            transform: scale(0.8);
            opacity: 0.5; 
          }
          40% { 
            transform: scale(1);
            opacity: 1; 
          }
        }

        .quick-searches {
          margin-top: 16px;
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .quick-searches.visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .quick-search-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          margin-bottom: 12px;
          text-align: center;
        }

        .quick-search-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }

        .quick-search-btn {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0;
          animation: slideInQuick 0.5s ease forwards;
        }

        .quick-search-btn:hover {
          background: rgba(99, 102, 241, 0.2);
          border-color: rgba(99, 102, 241, 0.3);
          color: white;
          transform: translateY(-2px);
        }

        @keyframes slideInQuick {
          to {
            opacity: 1;
            transform: translateY(0);
          }
          from {
            opacity: 0;
            transform: translateY(10px);
          }
        }

        .search-stats {
          margin-top: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          animation: fadeIn 0.3s ease;
        }

        .search-term {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
        }

        .search-indicator {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pulse-ring {
          position: absolute;
          width: 12px;
          height: 12px;
          border: 2px solid rgba(99, 102, 241, 0.4);
          border-radius: 50%;
          animation: pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          background: rgba(99, 102, 241, 0.8);
          border-radius: 50%;
        }

        @keyframes pulseRing {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Mobile Responsiveness */
        @media (max-width: 640px) {
          .search {
            margin-top: 2rem;
          }
          
          .search-container {
            padding: 14px 20px;
            border-radius: 16px;
          }
          
          .search-input {
            font-size: 16px; /* Prevents zoom on iOS */
          }
          
          .quick-search-buttons {
            gap: 6px;
          }
          
          .quick-search-btn {
            padding: 6px 12px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  )
}

export default Search