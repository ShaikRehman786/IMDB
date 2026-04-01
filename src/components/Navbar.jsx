import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = ({ onSearch, onSort, onToggleFavorites, isFavoritesView, favoritesCount }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    onSort(e.target.value);
  };

  return (
    <motion.nav
      className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="navbar-content">
        {/* Logo */}
        <motion.div 
          className="navbar-logo"
          whileHover={{ scale: 1.02 }}
        >
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="2"/>
              <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2"/>
              <line x1="7" y1="16" x2="17" y2="16" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <span className="logo-text">
            <span className="logo-movie">MOVIE</span>
            <span className="logo-zone">ZONE</span>
          </span>
        </motion.div>

        {/* Search Bar - Centered */}
        <motion.div 
          className={`search-wrapper ${isSearchFocused ? 'search-focused' : ''}`}
          animate={{ 
            width: isSearchFocused ? '100%' : 'auto',
            maxWidth: isSearchFocused ? '600px' : '450px'
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="search-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <input
            type="text"
            className="search-input"
            placeholder="Search movies, actors, genres..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            autoComplete="off"
          />
          <AnimatePresence>
            {searchTerm && (
              <motion.button
                className="search-clear"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setSearchTerm('');
                  onSearch('');
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Controls */}
        <div className="navbar-controls">
          {/* Sort Dropdown */}
          <motion.div 
            className="sort-wrapper"
            whileHover={{ scale: 1.02 }}
          >
            <select
              className="sort-select"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="title">Title</option>
              <option value="year">Year</option>
              <option value="rating">Rating</option>
            </select>
            <svg className="sort-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </motion.div>

          {/* Favorites Button */}
          <motion.button
            className={`favorites-button ${isFavoritesView ? 'favorites-active' : ''}`}
            onClick={onToggleFavorites}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.svg
              viewBox="0 0 24 24"
              fill={isFavoritesView || favoritesCount > 0 ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              animate={isFavoritesView || favoritesCount > 0 ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </motion.svg>
            <span className="favorites-label">Favorites</span>
            <AnimatePresence>
              {favoritesCount > 0 && !isFavoritesView && (
                <motion.span
                  className="favorites-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  {favoritesCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
