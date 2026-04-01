import { motion } from 'framer-motion';
import './MovieGrid.css';

const MovieGrid = ({ children }) => {
  return (
    <motion.div
      className="movie-grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

export default MovieGrid;
