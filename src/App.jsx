import { useEffect, useState } from 'react'
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/MovieCard.jsx'
import { useDebounce } from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite.js'

// Fixed API endpoints
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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [searchTerm, setSearchTerm] = useState('');

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState([]);

  // Debounce the search term to prevent making too many API requests
  // by waiting for the user to stop typing for 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Fixed: Use correct endpoints for search vs discover
      const endpoint = query
        ? `${SEARCH_ENDPOINT}?query=${encodeURIComponent(query)}`
        : `${DISCOVER_ENDPOINT}?sort_by=popularity.desc`;

      console.log('Fetching from:', endpoint); // Debug log

      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Fixed: TMDB API structure is different from OMDB
      // TMDB returns results array, not Response: 'False'
      if(!data.results) {
        setErrorMessage('No results found');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      // Update search count for successful searches
      if(query && data.results.length > 0) {
        try {
          await updateSearchCount(query, data.results[0]);
        } catch (error) {
          console.error('Error updating search count:', error);
          // Don't break the main flow if this fails
        }
      }
    } catch (error) {
      console.error(`Error fetching movies:`, error);
      setErrorMessage('Error fetching movies. Please try again later.');
      setMovieList([]);
    } finally {
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      console.log('Trending movies loaded:', movies); // Debug log
      setTrendingMovies(movies || []); // Ensure it's always an array
    } catch (error) {
      console.error(`Error fetching trending movies:`, error);
      setTrendingMovies([]); // Set empty array on error
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  // Debug: Log environment variables
  useEffect(() => {
    console.log('API Key loaded:', API_KEY ? 'Yes' : 'No');
    console.log('Project ID:', import.meta.env.VITE_APPWRITE_PROJECT_ID);
  }, []);

  return (
    <main>
      <div className="pattern"/>

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You Will Enjoy Without the Hassle</h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id || movie.id || index}>
                  <p>{index + 1}</p>
                  <img 
                    src={movie.poster_url || `https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                    alt={movie.title}
                    onError={(e) => {
                      e.target.src = '/placeholder-movie.jpg'; // fallback image
                    }}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : movieList.length === 0 ? (
            <p>No movies found. Try searching for something!</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App