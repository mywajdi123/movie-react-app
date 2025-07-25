import { useEffect, useState } from 'react'
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/MovieCard.jsx'
import { useDebounce } from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite.js'

// API Configuration
const API_BASE_URL = 'https://api.themoviedb.org/3';
const DISCOVER_ENDPOINT = `${API_BASE_URL}/discover/movie`;
const SEARCH_ENDPOINT = `${API_BASE_URL}/search/movie`;

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  // State Management
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [searchTerm, setSearchTerm] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Debounce search to prevent excessive API calls
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  // Enhanced movie fetching with better error handling
  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query
        ? `${SEARCH_ENDPOINT}?query=${encodeURIComponent(query)}&include_adult=false`
        : `${DISCOVER_ENDPOINT}?sort_by=popularity.desc&include_adult=false&page=1`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.status}`);
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        setErrorMessage(query ? `No movies found for "${query}"` : 'No movies available');
        setMovieList([]);
        return;
      }

      // Filter out movies without posters for better UI
      const moviesWithPosters = data.results.filter(movie => movie.poster_path);
      setMovieList(moviesWithPosters);

      // Update search analytics
      if (query && moviesWithPosters.length > 0) {
        try {
          await updateSearchCount(query, moviesWithPosters[0]);
        } catch (error) {
          console.warn('Analytics update failed:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Unable to load movies. Please check your connection and try again.');
      setMovieList([]);
    } finally {
      setIsLoading(false);
      if (isInitialLoad) setIsInitialLoad(false);
    }
  }

  // Load trending movies from Appwrite
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies || []);
    } catch (error) {
      console.warn('Failed to load trending movies:', error);
      setTrendingMovies([]);
    }
  }

  // Effects
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  // Render helpers
  const renderMoviesSection = () => {
    if (isLoading) {
      return (
        <div className="spinner-container">
          <Spinner />
        </div>
      );
    }

    if (errorMessage) {
      return (
        <div className="error-message">
          <h3 className="text-xl font-bold mb-2">Oops! Something went wrong</h3>
          <p>{errorMessage}</p>
          <button 
            onClick={() => fetchMovies(debouncedSearchTerm)}
            className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (movieList.length === 0 && !isInitialLoad) {
      return (
        <div className="no-results">
          <h3 className="text-xl font-bold mb-2">No movies found</h3>
          <p>Try searching for a different movie or browse our trending collection above.</p>
        </div>
      );
    }

    return (
      <ul className="movie-grid">
        {movieList.map((movie, index) => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            index={index}
          />
        ))}
      </ul>
    );
  };

  const renderTrendingSection = () => {
    if (trendingMovies.length === 0) return null;

    return (
      <section className="trending">
        <div className="flex items-center justify-between mb-8">
          <h2>🔥 Most Searched Movies</h2>
          <div className="text-sm text-gray-400 font-medium">
            Based on user searches
          </div>
        </div>

        <ul>
          {trendingMovies.slice(0, 8).map((movie, index) => (
            <li key={movie.$id || movie.id || index}>
              <p>{index + 1}</p>
              <img 
                src={movie.poster_url || `https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title || movie.searchTerm}
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="ml-4">
                <h4 className="text-white font-semibold text-sm line-clamp-1">
                  {movie.title || movie.searchTerm}
                </h4>
                <p className="text-gray-400 text-xs mt-1">
                  {movie.count} {movie.count === 1 ? 'search' : 'searches'}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
  };

  return (
    <main>
      {/* Animated Background */}
      <div className="pattern" />
      
      {/* Floating Elements */}
      <div className="fixed top-20 left-10 w-2 h-2 bg-indigo-500 rounded-full opacity-60 animate-pulse" />
      <div className="fixed top-40 right-20 w-3 h-3 bg-purple-500 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="fixed bottom-40 left-20 w-1 h-1 bg-blue-500 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="wrapper">
        {/* Hero Header */}
        <header>
          <img src="./hero.png" alt="CineScope - Your Movie Discovery Platform" />
          <h1>
            Discover Amazing <span className="text-gradient">Movies</span> 
            <br />
            <span style={{ fontSize: '0.7em', opacity: 0.8 }}>
              Tailored Just for You
            </span>
          </h1>
          
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          
          {/* Stats Bar */}
          <div className="flex justify-center mt-8 gap-8 text-sm text-gray-400">
            <span>🎬 10,000+ Movies</span>
            <span>⭐ Real Reviews</span>
            <span>🚀 Lightning Fast</span>
          </div>
        </header>

        {/* Trending Movies */}
        {renderTrendingSection()}

        {/* Main Movies Section */}
        <section className="all-movies">
          <div className="flex items-center justify-between mb-8">
            <h2>
              {searchTerm ? (
                <>🔍 Search Results for "{searchTerm}"</>
              ) : (
                <>🎭 Popular Movies</>
              )}
            </h2>
            
            {movieList.length > 0 && (
              <div className="text-sm text-gray-400 font-medium">
                {movieList.length} movies found
              </div>
            )}
          </div>

          {renderMoviesSection()}
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-white/10 text-center text-gray-400">
          <p>
            Built with ❤️ using React & TMDB API
          </p>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <span>Modern Design</span>
            <span>•</span>
            <span>Real-time Search</span>
            <span>•</span>
            <span>Trending Analytics</span>
          </div>
        </footer>
      </div>
    </main>
  )
}

export default App