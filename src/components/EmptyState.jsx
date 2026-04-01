import { motion } from 'framer-motion';
import './EmptyState.css';

const EmptyState = ({ type = 'no-results', onClearFilters }) => {
  const config = {
    'no-results': {
      icon: '🎬',
      title: 'No movies found',
      description: 'Try adjusting your search or filters',
      action: onClearFilters ? { label: 'Clear filters', onClick: onClearFilters } : null
    },
    'favorites-empty': {
      icon: '❤️',
      title: 'Your watchlist is empty',
      description: 'Start exploring and save your favorite movies',
      action: null
    },
    'error': {
      icon: '⚠️',
      title: 'Something went wrong',
      description: 'Please try again later',
      action: { label: 'Try again', onClick: () => window.location.reload() }
    }
  };

  const { icon, title, description, action } = config[type];

  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="empty-content">
        <motion.div 
          className="empty-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          {icon}
        </motion.div>
        <motion.h2 
          className="empty-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {title}
        </motion.h2>
        <motion.p 
          className="empty-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {description}
        </motion.p>
        {action && (
          <motion.button
            className="empty-action"
            onClick={action.onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {action.label}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default EmptyState;
