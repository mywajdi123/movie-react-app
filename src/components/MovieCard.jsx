import React, { useState } from 'react'

const MovieCard = ({ 
  movie: { title, vote_average, poster_path, release_date, original_language, overview },
  index
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Animation delay based on card index for staggered entrance
  const animationDelay = index * 0.1;

  // Format rating with proper color coding
  const getRatingColor = (rating) => {
    if (rating >= 8) return 'text-green-400 border-green-400/20 bg-green-400/10';
    if (rating >= 7) return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10';
    if (rating >= 6) return 'text-orange-400 border-orange-400/20 bg-orange-400/10';
    return 'text-red-400 border-red-400/20 bg-red-400/10';
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

  return (
    <div 
      className="movie-card group"
      style={{ 
        animationDelay: `${animationDelay}s`,
        animation: 'slideInUp 0.6s ease-out forwards'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Movie Poster with Loading State */}
      <div className="relative overflow-hidden rounded-2xl">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse rounded-2xl flex items-center justify-center">
            <div className="text-gray-600">📽️</div>
          </div>
        )}
        
        <img
          src={posterUrl}
          alt={title}
          className={`rounded-2xl h-80 w-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-110' : 'scale-100'}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = '/no-movie.png';
            setImageLoaded(true);
          }}
          loading="lazy"
        />
        
        {/* Hover Overlay with Movie Info */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent 
          transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-4 left-4 right-4">
            {overview && (
              <p className="text-white/90 text-sm line-clamp-3 mb-2">
                {overview}
              </p>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/70 bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                {release_date ? new Date(release_date).getFullYear() : 'N/A'}
              </span>
              <span className="text-xs text-white/70 bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                {formatLanguage(original_language)}
              </span>
            </div>
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4">
          <div className={`px-2 py-1 rounded-full border backdrop-blur-sm font-bold text-sm ${
            vote_average ? getRatingColor(vote_average) : 'text-gray-400 border-gray-600/20 bg-gray-600/10'
          }`}>
            ⭐ {vote_average ? vote_average.toFixed(1) : 'N/A'}
          </div>
        </div>
      </div>

      {/* Movie Information */}
      <div className="mt-6 space-y-4">
        <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 group-hover:text-indigo-300 transition-colors duration-300">
          {title}
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          {/* Rating Display */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-yellow-400 font-semibold text-sm">
              {vote_average ? `${vote_average}/10` : 'Unrated'}
            </span>
          </div>

          <span className="text-gray-500">•</span>

          {/* Release Year */}
          <span className="text-gray-300 font-medium text-sm px-2 py-1 rounded-lg bg-white/5 border border-white/10">
            {release_date ? new Date(release_date).getFullYear() : 'TBA'}
          </span>

          <span className="text-gray-500">•</span>

          {/* Language */}
          <span className="text-gray-300 font-medium text-sm px-2 py-1 rounded-lg bg-white/5 border border-white/10 capitalize">
            {formatLanguage(original_language)}
          </span>
        </div>

        {/* Interactive Elements */}
        <div className="flex items-center justify-between pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
            View Details →
          </button>
          
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors group/btn">
              <span className="text-red-400 group-hover/btn:scale-110 transition-transform">❤️</span>
            </button>
            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors group/btn">
              <span className="text-blue-400 group-hover/btn:scale-110 transition-transform">📚</span>
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    </div>
  )
}

export default MovieCard