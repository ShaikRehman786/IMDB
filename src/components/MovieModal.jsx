import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MovieModal.css';

const MovieModal = ({ movie, isOpen, onClose, onToggleFavorite, isFavorite, onRateMovie }) => {
  const [userRating, setUserRating] = useState(movie?.userRating || 0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setUserRating(movie?.userRating || 0);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, movie]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleStarClick = (rating) => {
    setUserRating(rating);
    onRateMovie(movie.id, rating);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!movie) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button 
              className="modal-close" 
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </motion.button>

            <div className="modal-body">
              {/* Poster Section */}
              <div className="modal-poster-section">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="modal-poster"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                  }}
                />
                <div className="modal-poster-overlay">
                  <motion.button
                    className={`modal-favorite-btn ${isFavorite ? 'is-favorite' : ''}`}
                    onClick={() => onToggleFavorite(movie.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </motion.button>
                  {movie.source === 'api' && (
                    <span className="modal-api-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                      Live
                    </span>
                  )}
                </div>
              </div>

              {/* Info Section */}
              <div className="modal-info">
                <div className="modal-header">
                  <h2 className="modal-title">{movie.title}</h2>
                  {movie.imdb > 0 && (
                    <div className="modal-imdb">
                      <span className="imdb-star">★</span>
                      <span>{movie.imdb.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <div className="modal-meta">
                  <span className="modal-year">{movie.year}</span>
                  <span className="modal-dot">•</span>
                  <span className="modal-genre">{movie.genre}</span>
                  {movie.runtime && (
                    <>
                      <span className="modal-dot">•</span>
                      <span className="modal-runtime">{movie.runtime}</span>
                    </>
                  )}
                </div>

                {movie.director && (
                  <div className="modal-credit">
                    <span className="credit-label">Director</span>
                    <span className="credit-value">{movie.director}</span>
                  </div>
                )}

                {movie.actors && movie.actors !== 'Unknown' && (
                  <div className="modal-credit">
                    <span className="credit-label">Cast</span>
                    <span className="credit-value">{movie.actors}</span>
                  </div>
                )}

                {movie.plot && (
                  <div className="modal-plot">
                    <h4 className="plot-heading">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                      </svg>
                      Plot
                    </h4>
                    <p className="plot-text">{movie.plot}</p>
                  </div>
                )}

                {/* Rating */}
                <div className="modal-rating">
                  <h4 className="rating-heading">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="rating-icon">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Rate this movie
                  </h4>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        className={`star-btn ${star <= userRating ? 'star-active' : ''}`}
                        onClick={() => handleStarClick(star)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ★
                      </motion.button>
                    ))}
                  </div>
                  <span className="rating-value">{userRating > 0 ? `${userRating}/5` : 'Not rated'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MovieModal;
