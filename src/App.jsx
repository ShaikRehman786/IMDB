import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import MovieGrid from './components/MovieGrid';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';
import SkeletonLoader from './components/SkeletonLoader';
import EmptyState from './components/EmptyState';
import Footer from './components/Footer';
import './styles/global.css';

// Page transition variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { 
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.05
    }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

function App() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [isFavoritesView, setIsFavoritesView] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('movieFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [userRatings, setUserRatings] = useState(() => {
    const saved = localStorage.getItem('userRatings');
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filterBarRef = useRef(null);
  const [filterHeight, setFilterHeight] = useState(0);

  const API_KEY = '31bafc15';

  // Load movies
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('./movies.json');
        if (!response.ok) throw new Error('Failed to load movies');
        const data = await response.json();
        
        const moviesWithRatings = data.map(movie => ({
          ...movie,
          userRating: userRatings[movie.id] || null
        }));
        
        setMovies(moviesWithRatings);
        setFilteredMovies(moviesWithRatings);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, []);

  // Measure filter bar height
  useEffect(() => {
    const el = filterBarRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setFilterHeight(el.offsetHeight || 0);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [isFavoritesView, isLoading]);

  // Save favorites
  useEffect(() => {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save ratings
  useEffect(() => {
    localStorage.setItem('userRatings', JSON.stringify(userRatings));
  }, [userRatings]);

  // Search API
  const searchMoviesAPI = useCallback(async (term) => {
    if (!term.trim()) return [];
    
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(term)}&apikey=${API_KEY}`
      );
      const data = await response.json();

      if (data.Response === 'True' && data.Search) {
        return data.Search.map(movie => ({
          id: movie.imdbID,
          title: movie.Title,
          year: parseInt(movie.Year) || 0,
          poster: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image',
          genre: 'Unknown',
          director: 'Unknown',
          actors: 'Unknown',
          plot: 'Plot information not available.',
          imdb: 0,
          source: 'api',
          userRating: userRatings[movie.imdbID] || null
        }));
      }
      return [];
    } catch (error) {
      console.error('API search failed:', error);
      return [];
    }
  }, [userRatings]);

  // Get movie details
  const getMovieDetails = useCallback(async (imdbID) => {
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${API_KEY}`
      );
      const data = await response.json();

      if (data.Response === 'True') {
        return {
          id: data.imdbID,
          title: data.Title,
          year: parseInt(data.Year) || 0,
          poster: data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/300x450?text=No+Image',
          genre: data.Genre || 'Unknown',
          director: data.Director || 'Unknown',
          actors: data.Actors || 'Unknown',
          plot: data.Plot || 'Plot not available.',
          imdb: parseFloat(data.imdbRating) || 0,
          runtime: data.Runtime || 'Unknown',
          released: data.Released || 'Unknown',
          source: 'api',
          userRating: userRatings[data.imdbID] || null
        };
      }
    } catch (error) {
      console.error('Failed to get movie details:', error);
    }
    return null;
  }, [userRatings]);

  // Filter and search
  useEffect(() => {
    const filterAndSearch = async () => {
      let result = [...movies];

      if (searchTerm.trim()) {
        const localResults = movies.filter(movie =>
          movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movie.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movie.actors.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const apiResults = await searchMoviesAPI(searchTerm);

        const combined = [...localResults];
        apiResults.forEach(apiMovie => {
          const exists = combined.some(m =>
            m.id === apiMovie.id ||
            m.title.toLowerCase() === apiMovie.title.toLowerCase()
          );
          if (!exists) combined.push(apiMovie);
        });

        result = combined;
      }

      if (selectedGenre) {
        result = result.filter(movie =>
          movie.genre.toLowerCase().includes(selectedGenre.toLowerCase())
        );
      }

      if (selectedYear) {
        result = result.filter(movie => movie.year.toString() === selectedYear);
      }

      switch (sortBy) {
        case 'title':
          result.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'year':
          result.sort((a, b) => b.year - a.year);
          break;
        case 'rating':
          result.sort((a, b) => b.imdb - a.imdb);
          break;
        default:
          break;
      }

      setFilteredMovies(result);
    };

    filterAndSearch();
  }, [searchTerm, selectedGenre, selectedYear, sortBy, movies, searchMoviesAPI]);

  // Get unique genres
  const genres = [...new Set(movies.flatMap(movie =>
    movie.genre.split(', ').map(g => g.trim())
  ))].sort();

  // Get unique years
  const years = [...new Set(movies.map(movie => movie.year))].sort((a, b) => b - a);

  // Handlers
  const handleSearch = (term) => setSearchTerm(term);
  const handleSort = (value) => setSortBy(value);
  const handleGenreChange = (genre) => setSelectedGenre(genre);
  const handleYearChange = (year) => setSelectedYear(year);
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setSelectedYear('');
    setSortBy('title');
  };

  const handleToggleFavorites = () => setIsFavoritesView(!isFavoritesView);

  const handleToggleFavorite = (movieId) => {
    setFavorites(prev =>
      prev.includes(movieId)
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    );
  };

  const handleSelectMovie = async (movie) => {
    if (movie.source === 'api' && movie.genre === 'Unknown') {
      const detailedMovie = await getMovieDetails(movie.id);
      setSelectedMovie(detailedMovie || movie);
    } else {
      setSelectedMovie(movie);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleRateMovie = (movieId, rating) => {
    setUserRatings(prev => ({ ...prev, [movieId]: rating }));
    setMovies(prev => prev.map(movie =>
      movie.id === movieId ? { ...movie, userRating: rating } : movie
    ));
  };

  const handleWatchNow = (movie) => {
    console.log('Watch now:', movie);
    // Implement watch functionality
  };

  const handleAddToWatchlist = (movie) => {
    if (!favorites.includes(movie.id)) {
      handleToggleFavorite(movie.id);
    }
  };

  const displayMovies = isFavoritesView
    ? filteredMovies.filter(movie => favorites.includes(movie.id))
    : filteredMovies;

  return (
    <div className="app">
      <Navbar
        onSearch={handleSearch}
        onSort={handleSort}
        onToggleFavorites={handleToggleFavorites}
        isFavoritesView={isFavoritesView}
        favoritesCount={favorites.length}
      />

      <main>
        <AnimatePresence mode="wait">
          {isFavoritesView ? (
            <motion.div
              key="favorites-view"
              className="favorites-page"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="favorites-header">
                <div className="favorites-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
                <h1 className="favorites-title">Your Watchlist</h1>
                <p className="favorites-subtitle">
                  {displayMovies.length === 0 
                    ? 'Start exploring and save your favorite movies'
                    : `${displayMovies.length} movie${displayMovies.length !== 1 ? 's' : ''} saved`}
                </p>
              </div>
              
              {isLoading ? (
                <SkeletonLoader count={12} />
              ) : displayMovies.length === 0 ? (
                <EmptyState type="favorites-empty" />
              ) : (
                <MovieGrid>
                  {displayMovies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onSelect={handleSelectMovie}
                      onToggleFavorite={handleToggleFavorite}
                      isFavorite={favorites.includes(movie.id)}
                    />
                  ))}
                </MovieGrid>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="main-view"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Hero 
                onWatchNow={handleWatchNow}
                onAddToWatchlist={handleAddToWatchlist}
              />
              <div ref={filterBarRef} className="filter-bar-wrapper">
                <FilterBar
                  key="filter"
                  genres={genres}
                  selectedGenre={selectedGenre}
                  selectedYear={selectedYear}
                  years={years}
                  onGenreChange={handleGenreChange}
                  onYearChange={handleYearChange}
                  moviesCount={displayMovies.length}
                />
              </div>
              <div 
                className="movies-content-wrapper"
                style={{ paddingTop: filterHeight }}
              >
                {isLoading ? (
                  <SkeletonLoader count={12} />
                ) : displayMovies.length === 0 ? (
                  <EmptyState
                    key="empty"
                    type="no-results"
                    onClearFilters={handleClearFilters}
                  />
                ) : (
                  <MovieGrid key="grid">
                    {displayMovies.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        onSelect={handleSelectMovie}
                        onToggleFavorite={handleToggleFavorite}
                        isFavorite={favorites.includes(movie.id)}
                      />
                    ))}
                  </MovieGrid>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={selectedMovie ? favorites.includes(selectedMovie.id) : false}
        onRateMovie={handleRateMovie}
      />
    </div>
  );
}

export default App;
