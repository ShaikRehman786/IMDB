import './SkeletonLoader.css';

const SkeletonLoader = ({ count = 12 }) => {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-poster shimmer"></div>
    </div>
  );
};

export default SkeletonLoader;
