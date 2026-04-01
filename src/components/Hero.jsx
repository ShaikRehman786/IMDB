import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Hero.css';

// Featured movies for hero rotation
const featuredMovies = [
  {
    id: 'tt0468569',
    title: 'The Dark Knight',
    tagline: 'Why So Serious?',
    description: 'When the menace known as the Joker emerges, he causes chaos and tests Batman\'s resolve in this epic battle for Gotham\'s soul.',
    backdrop: 'https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7ZB3fC.jpg',
    genre: 'Action'
  },
  {
    id: 'tt0111161',
    title: 'The Shawshank Redemption',
    tagline: 'Fear Can Hold You Prisoner. Hope Can Set You Free.',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    backdrop: 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    genre: 'Drama'
  },
  {
    id: 'tt0137523',
    title: 'Fight Club',
    tagline: 'Mischief. Mayhem. Soap.',
    description: 'An insomniac office worker and a soap maker form an underground fight club that evolves into something much more.',
    backdrop: 'https://image.tmdb.org/t/p/original/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    genre: 'Drama'
  }
];

const genres = ['ACTION', 'DRAMA', 'COMEDY', 'THRILLER', 'SCI-FI', 'HORROR', 'ROMANCE', 'ADVENTURE'];

const Hero = ({ onWatchNow, onAddToWatchlist }) => {
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [currentGenreIndex, setCurrentGenreIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Rotate featured movies
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMovieIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Rotate genres
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGenreIndex((prev) => (prev + 1) % genres.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Initial load animation
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const currentMovie = featuredMovies[currentMovieIndex];

  return (
    <section className="hero">
      {/* Cinematic Background */}
      <div className="hero-background">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovieIndex}
            className="hero-backdrop"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              backgroundImage: `url(${currentMovie.backdrop})`
            }}
          />
        </AnimatePresence>
        <div className="hero-gradient" />
        <div className="hero-grid-overlay" />
      </div>

      {/* Content */}
      <div className="hero-content">
        {/* Featured Badge */}
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="badge-icon">🎬</span>
          <span className="badge-text">Featured</span>
        </motion.div>

        {/* Title with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovieIndex}
            className="hero-title-wrapper"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              {currentMovie.title}
            </h1>
            <p className="hero-tagline">{currentMovie.tagline}</p>
          </motion.div>
        </AnimatePresence>

        {/* Description */}
        <motion.p
          className="hero-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {currentMovie.description}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.button
            className="btn-primary"
            onClick={() => onWatchNow?.(currentMovie)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="btn-icon">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Watch Now
          </motion.button>
          <motion.button
            className="btn-secondary"
            onClick={() => onAddToWatchlist?.(currentMovie)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-icon">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            My List
          </motion.button>
        </motion.div>

        {/* Genre Cycling */}
        <motion.div
          className="hero-genres"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <span className="genres-label">Trending in</span>
          <div className="genres-wrapper">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentGenreIndex}
                className="genre-tag"
                initial={{ y: 20, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -20, opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                {genres[currentGenreIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.div
            className="scroll-mouse"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="scroll-wheel" />
          </motion.div>
          <span>Scroll to explore</span>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="hero-decorative">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
      </div>
    </section>
  );
};

export default Hero;
