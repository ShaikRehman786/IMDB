import { useState } from 'react';
import { motion } from 'framer-motion';
import './MovieCard.css';

const MovieCard = ({ movie, onSelect, onToggleFavorite, isFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getGenreColor = (genre) => {
    const firstGenre = genre.split(',')[0].trim().toLowerCase();
    const genreColors = {
      action: '#FF6B35',
      adventure: '#4ECDC4',
      animation: '#A8E6CF',
      comedy: '#FFD93D',
      crime: '#FF6B9D',
      drama: '#74B9FF',
      fantasy: '#A29BFE',
      horror: '#FD79A8',
      mystery: '#E17055',
      romance: '#FD79A8',
      'sci-fi': '#00CEC9',
      scifi: '#00CEC9',
      thriller: '#6C5CE7',
    };
    return genreColors[firstGenre] || 'rgba(255,255,255,0.6)';
  };

  const getFirstGenre = (genre) => genre.split(',')[0].trim();

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(movie.id);
  };

  return (
    <motion.div
      className="movie-card"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8, scale: 1.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(movie)}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Card Background */}
      <div className="card-bg">
        {/* Loading Placeholder */}
        {!imageLoaded && <div className="poster-placeholder shimmer"></div>}
        
        {/* Poster Image */}
        <motion.img
          src={movie.poster}
          alt={movie.title}
          className={`card-image ${imageLoaded ? 'image-loaded' : ''}`}
          initial={{ scale: 1.05 }}
          animate={{ scale: isHovered ? 1.08 : 1.05 }}
          transition={{ duration: 0.5 }}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
            setImageLoaded(true);
          }}
        />

        {/* Consistent Gradient Overlay (ALL cards) */}
        <div className="card-overlay" />
      </div>

      {/* TOP: Heart (left) + Rating (right) */}
      <div className="card-top">
        {/* Heart Icon - Top Left */}
        <motion.button
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <svg viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </motion.button>

        {/* Rating Badge - Top Right */}
        {movie.imdb > 0 && (
          <motion.div
            className="rating-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <span className="badge-star">★</span>
            <span className="badge-value">{movie.imdb.toFixed(1)}</span>
          </motion.div>
        )}
      </div>

      {/* CENTER: Play Button (visible ONLY on hover) */}
      <motion.div
        className="card-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.button
          className="play-btn"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <span>Play</span>
        </motion.button>
      </motion.div>

      {/* BOTTOM: Genre + Year + Title */}
      <div className="card-bottom">
        {/* Meta: Genre + Year */}
        <div className="card-meta">
          <span 
            className="meta-genre"
            style={{ color: getGenreColor(movie.genre) }}
          >
            {getFirstGenre(movie.genre)}
          </span>
          <span className="meta-dot">•</span>
          <span className="meta-year">{movie.year}</span>
        </div>

        {/* Title */}
        <h3 className="card-title line-clamp-2">{movie.title}</h3>

        {/* User Rating */}
        {movie.userRating && (
          <div className="user-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`user-star ${star <= movie.userRating ? 'filled' : ''}`}
              >
                ★
              </span>
            ))}
          </div>
        )}
      </div>

      {/* API Badge */}
      {movie.source === 'api' && (
        <motion.div
          className="api-badge"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MovieCard;
