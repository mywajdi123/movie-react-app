import React, { useState } from 'react'

const MovieCard = ({ 
  movie: { title, vote_average, poster_path, release_date, original_language, overview },
  index
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Animation delay based on card index for staggered entrance
  const animationDelay = index * 0.1;

  // Format rating with proper color coding (Netflix style)
  const getRatingColor = (rating) => {
    if (rating >= 8) return '#22c55e'; // bright green
    if (rating >= 7) return '#fbbf24'; // golden yellow
    if (rating >= 6) return '#f97316'; // orange
    return '#e53e3e'; // Netflix red
  };

  // Format language display
  const formatLanguage = (lang) => {
    const languages = {
      'en': 'English',
      'es': 'Spanish', 
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
      'hi': 'Hindi',
      'ar': 'Arabic',
      'ru': 'Russian',
      'pt': 'Portuguese'
    };
    return languages[lang] || lang.toUpperCase();
  };

  // Generate poster URL with fallback
  const posterUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w500${poster_path}` 
    : '/no-movie.png';

  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Close modal when clicking outside
  const closeModal = (e) => {
    if (e.target === e.currentTarget) {
      setIsExpanded(false);
    }
  };

  return (
    <>
      {/* Main Movie Card */}
      <div 
        className="movie-card group"
        style={{ 
          animationDelay: `${animationDelay}s`,
          animation: 'slideInUp 0.6s ease-out forwards',
          cursor: 'pointer'
        }}
        onClick={toggleExpanded}
      >
        {/* Movie Poster with Loading State */}
        <div className="poster-container">
          {!imageLoaded && (
            <div className="poster-placeholder">
              <div className="placeholder-icon">🎬</div>
            </div>
          )}
          
          <img
            src={posterUrl}
            alt={title}
            className={`movie-poster ${imageLoaded ? 'loaded' : 'loading'}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = '/no-movie.png';
              setImageLoaded(true);
            }}
            loading="lazy"
          />
          
          {/* Rating Badge */}
          <div className="rating-badge">
            <span style={{ color: getRatingColor(vote_average) }}>
              ⭐ {vote_average ? vote_average.toFixed(1) : 'N/A'}
            </span>
          </div>

          {/* Hover Overlay */}
          <div className="hover-overlay">
            <div className="hover-content">
              <span className="click-hint">Click to view details</span>
            </div>
          </div>
        </div>

        {/* Movie Information */}
        <div className="movie-info">
          <h3 className="movie-title">{title}</h3>

          <div className="movie-details">
            {/* Release Year */}
            <span className="detail-chip">
              {release_date ? new Date(release_date).getFullYear() : 'TBA'}
            </span>

            <span className="separator">•</span>

            {/* Language */}
            <span className="detail-chip">
              {formatLanguage(original_language)}
            </span>

            <span className="separator">•</span>

            {/* Rating */}
            <span className="detail-chip rating-text">
              {vote_average ? `${vote_average}/10` : 'Unrated'}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Modal */}
      {isExpanded && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button className="close-button" onClick={() => setIsExpanded(false)}>
              ✕
            </button>

            <div className="modal-body">
              {/* Movie Poster */}
              <div className="modal-poster">
                <img src={posterUrl} alt={title} />
              </div>

              {/* Movie Details */}
              <div className="modal-details">
                <h2 className="modal-title">{title}</h2>
                
                <div className="modal-meta">
                  <div className="meta-item">
                    <span className="meta-label">Rating:</span>
                    <span className="meta-value" style={{ color: getRatingColor(vote_average) }}>
                      ⭐ {vote_average ? vote_average.toFixed(1) : 'N/A'}/10
                    </span>
                  </div>
                  
                  <div className="meta-item">
                    <span className="meta-label">Year:</span>
                    <span className="meta-value">
                      {release_date ? new Date(release_date).getFullYear() : 'TBA'}
                    </span>
                  </div>
                  
                  <div className="meta-item">
                    <span className="meta-label">Language:</span>
                    <span className="meta-value">{formatLanguage(original_language)}</span>
                  </div>
                </div>

                {/* Description */}
                {overview && (
                  <div className="modal-description">
                    <h3>Overview</h3>
                    <p>{overview}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="modal-actions">
                  <button className="action-btn favorite-btn">
                    ❤️ Add to Favorites
                  </button>
                  <button className="action-btn watchlist-btn">
                    📚 Watch Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        .movie-card {
          padding: 1.5rem;
          border-radius: 1.5rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(229, 62, 62, 0.15);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .movie-card:hover {
          background: rgba(229, 62, 62, 0.08);
          border-color: rgba(229, 62, 62, 0.4);
          transform: translateY(-8px) scale(1.02);
          box-shadow: 
            0 20px 50px rgba(0, 0, 0, 0.7),
            0 0 30px rgba(229, 62, 62, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .poster-container {
          position: relative;
          border-radius: 1rem;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .poster-placeholder {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 1rem;
        }

        .placeholder-icon {
          font-size: 2rem;
          color: #6b7280;
        }

        .movie-poster {
          width: 100%;
          height: 20rem;
          object-fit: cover;
          transition: all 0.3s ease;
          opacity: 0;
          border: 1px solid rgba(229, 62, 62, 0.1);
        }

        .movie-poster.loaded {
          opacity: 1;
        }

        .movie-card:hover .movie-poster {
          transform: scale(1.05);
          border-color: rgba(229, 62, 62, 0.3);
        }

        .rating-badge {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          padding: 0.5rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .hover-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: flex-end;
          padding: 1rem;
        }

        .movie-card:hover .hover-overlay {
          opacity: 1;
        }

        .hover-content {
          color: white;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .click-hint {
          background: rgba(229, 62, 62, 0.9);
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          backdrop-filter: blur(10px);
        }

        .movie-info {
          text-align: center;
        }

        .movie-title {
          color: white;
          font-weight: 700;
          font-size: 1.125rem;
          margin-bottom: 0.75rem;
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.5px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .movie-details {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .detail-chip {
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(229, 62, 62, 0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          color: #cccccc;
          font-weight: 500;
        }

        .separator {
          color: #999999;
          font-size: 0.875rem;
        }

        .rating-text {
          color: #fbbf24 !important;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(26, 0, 0, 0.95) 50%, rgba(0, 0, 0, 0.95) 100%);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(229, 62, 62, 0.2);
          border-radius: 1.5rem;
          max-width: 4xl;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          animation: slideInScale 0.3s ease;
        }

        .close-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.8);
          border: 2px solid rgba(229, 62, 62, 0.3);
          color: white;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .close-button:hover {
          background: rgba(229, 62, 62, 0.8);
          border-color: rgba(229, 62, 62, 0.6);
          transform: scale(1.1);
        }

        .modal-body {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
          padding: 2rem;
        }

        .modal-poster img {
          width: 100%;
          height: auto;
          border-radius: 1rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }

        .modal-details {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .modal-title {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          font-family: 'Bebas Neue', sans-serif;
          margin: 0;
          line-height: 1.2;
          letter-spacing: 1px;
        }

        .modal-meta {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .meta-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 0.5rem;
          border: 1px solid rgba(229, 62, 62, 0.2);
        }

        .meta-label {
          color: #cccccc;
          font-weight: 500;
        }

        .meta-value {
          color: white;
          font-weight: 600;
        }

        .modal-description h3 {
          color: white;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.5px;
        }

        .modal-description p {
          color: #e5e5e5;
          line-height: 1.6;
          font-size: 1rem;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .action-btn {
          flex: 1;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .favorite-btn {
          background: rgba(229, 62, 62, 0.2);
          border: 1px solid rgba(229, 62, 62, 0.4);
          color: #ff6b6b;
        }

        .favorite-btn:hover {
          background: rgba(229, 62, 62, 0.3);
          border-color: rgba(229, 62, 62, 0.6);
          transform: translateY(-2px);
        }

        .watchlist-btn {
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(229, 62, 62, 0.3);
          color: #cccccc;
        }

        .watchlist-btn:hover {
          background: rgba(229, 62, 62, 0.2);
          border-color: rgba(229, 62, 62, 0.5);
          color: #ffffff;
          transform: translateY(-2px);
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInScale {
          from { 
            opacity: 0; 
            transform: scale(0.9) translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .modal-body {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            padding: 1.5rem;
          }

          .modal-actions {
            flex-direction: column;
          }

          .modal-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  )
}

export default MovieCard