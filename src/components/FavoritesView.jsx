import { motion } from 'framer-motion';
import './FavoritesView.css';

const FavoritesView = ({ children, count }) => {
  return (
    <motion.div
      className="favorites-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Favorites Hero */}
      <div className="favorites-hero">
        <motion.div
          className="favorites-hero-content"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="favorites-icon-wrapper"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <div className="favorites-icon-bg"></div>
            <i className="fas fa-heart"></i>
          </motion.div>
          
          <h1 className="favorites-title">Your Watchlist</h1>
          <p className="favorites-subtitle">
            {count > 0 
              ? `${count} movie${count !== 1 ? 's' : ''} saved for later`
              : 'Start exploring and save your favorite movies'}
          </p>
        </motion.div>

        {/* Decorative Elements */}
        <div className="favorites-decorative">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="floating-heart"
              initial={{ 
                y: 100,
                opacity: 0,
                scale: 0 
              }}
              animate={{ 
                y: [null, -20 + Math.random() * -30],
                opacity: [0, 0.3, 0],
                scale: [0, 1, 0.5],
                rotate: Math.random() * 360
              }}
              transition={{
                delay: 0.5 + i * 0.2,
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2
              }}
              style={{
                left: `${10 + i * 20}%`,
                animationDelay: `${i * 0.5}s`
              }}
            >
              <i className="fas fa-heart"></i>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      <div className="favorites-content">
        {children}
      </div>
    </motion.div>
  );
};

export default FavoritesView;
