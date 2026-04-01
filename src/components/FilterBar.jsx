import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FilterBar.css';

const FilterBar = ({ genres, selectedGenre, selectedYear, years, onGenreChange, onYearChange, moviesCount }) => {
  const [showMoreYears, setShowMoreYears] = useState(false);

  const visibleYears = years.slice(0, 7);
  const moreYears = years.slice(7);
  const hasMoreYears = moreYears.length > 0;

  return (
    <div className="filter-bar">
      <div className="filter-container">
        {/* Row 1: Genre */}
        <div className="filter-row">
          <span className="filter-label">
            <span className="label-dot"></span>
            GENRE
          </span>
          <div className="filter-pills scrollbar-hidden">
            <FilterPill
              label="All"
              isActive={selectedGenre === ''}
              onClick={() => onGenreChange('')}
            />
            {genres.map((genre) => (
              <FilterPill
                key={genre}
                label={genre}
                isActive={selectedGenre === genre}
                onClick={() => onGenreChange(genre)}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="filter-divider"></div>

        {/* Row 2: Year */}
        <div className="filter-row">
          <span className="filter-label">
            <span className="label-dot"></span>
            YEAR
          </span>
          <div className="filter-pills scrollbar-hidden">
            <FilterPill
              label="All"
              isActive={selectedYear === ''}
              onClick={() => onYearChange('')}
            />
            {visibleYears.map((year) => (
              <FilterPill
                key={year}
                label={year.toString()}
                isActive={selectedYear === year.toString()}
                onClick={() => onYearChange(year.toString())}
              />
            ))}
            {hasMoreYears && (
              <div className="more-years-wrapper">
                <motion.button
                  className={`filter-pill more-pill ${showMoreYears ? 'more-open' : ''}`}
                  onClick={() => setShowMoreYears(!showMoreYears)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  More {showMoreYears ? '▴' : '▾'}
                </motion.button>
                <AnimatePresence>
                  {showMoreYears && (
                    <motion.div
                      className="more-years-dropdown"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {moreYears.map((year) => (
                        <FilterPill
                          key={year}
                          label={year.toString()}
                          isActive={selectedYear === year.toString()}
                          onClick={() => onYearChange(year.toString())}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Result Count */}
        <div className="filter-result-row">
          <div className="result-count">
            <span className="count-number">{moviesCount}</span>
            <span className="count-label"> movies found</span>
          </div>
          
          {/* Active Filters */}
          {(selectedGenre || selectedYear) && (
            <div className="active-filters">
              <span className="filters-separator">·</span>
              {selectedGenre && (
                <span className="active-filter-tag">
                  Genre: {selectedGenre}
                  <button className="filter-remove" onClick={() => onGenreChange('')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </span>
              )}
              {selectedYear && (
                <span className="active-filter-tag">
                  Year: {selectedYear}
                  <button className="filter-remove" onClick={() => onYearChange('')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FilterPill = ({ label, isActive, onClick }) => {
  return (
    <motion.button
      className={`filter-pill ${isActive ? 'pill-active' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      {label}
      {isActive && (
        <motion.span
          className="pill-glow"
          layoutId="pillGlow"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
};

export default FilterBar;
