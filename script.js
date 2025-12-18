// Application State Management
class MovieApp {
    constructor() {
        this.movies = [];
        this.filteredMovies = [];
        this.favorites = JSON.parse(localStorage.getItem('movieFavorites')) || [];
        this.userRatings = JSON.parse(localStorage.getItem('userRatings')) || {};
        this.currentView = 'all'; // 'all' or 'favorites'
        this.apiKey = '31bafc15';
        this.searchCache = new Map(); // Cache API results
        this.init();
    }

    // Initialize the application
    async init() {
        this.bindEvents();
        await this.loadMovies();
        this.populateFilters();
        this.displayMovies();
    }

    // Load movies from local JSON file (fallback data)
    async loadMovies() {
        try {
            this.showLoading(true);
            const response = await fetch('./movies.json');
            if (!response.ok) throw new Error('Failed to load movies');
            
            this.movies = await response.json();
            this.filteredMovies = [...this.movies];
            
            // Add a small delay for better UX
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            console.error('Error loading movies:', error);
            this.showError('Failed to load movies. Please try again later.');
        } finally {
            this.showLoading(false);
        }
    }

    // Search movies using OMDB API
    async searchMoviesAPI(searchTerm) {
        // Check cache first
        if (this.searchCache.has(searchTerm)) {
            return this.searchCache.get(searchTerm);
        }

        try {
            const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=${this.apiKey}`);
            const data = await response.json();
            
            if (data.Response === "True" && data.Search) {
                // Transform API data to match our local format
                const apiMovies = data.Search.map(movie => ({
                    id: movie.imdbID,
                    title: movie.Title,
                    year: parseInt(movie.Year),
                    poster: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image',
                    genre: movie.Type === 'movie' ? 'Unknown' : 'Unknown',
                    director: 'Unknown',
                    actors: 'Unknown',
                    plot: 'Plot information not available in search results.',
                    imdb: 0,
                    source: 'api' // Mark as API result
                }));
                
                // Cache the results
                this.searchCache.set(searchTerm, apiMovies);
                return apiMovies;
            }
            return [];
        } catch (error) {
            console.error('API search failed:', error);
            return [];
        }
    }

    // Get detailed movie info from API
    async getMovieDetails(imdbID) {
        try {
            const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${this.apiKey}`);
            const data = await response.json();
            
            if (data.Response === "True") {
                return {
                    id: data.imdbID,
                    title: data.Title,
                    year: parseInt(data.Year),
                    poster: data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/300x450?text=No+Image',
                    genre: data.Genre || 'Unknown',
                    director: data.Director || 'Unknown',
                    actors: data.Actors || 'Unknown',
                    plot: data.Plot || 'Plot not available.',
                    imdb: parseFloat(data.imdbRating) || 0,
                    runtime: data.Runtime || 'Unknown',
                    released: data.Released || 'Unknown',
                    source: 'api'
                };
            }
        } catch (error) {
            console.error('Failed to get movie details:', error);
        }
        return null;
    }

    // Bind event listeners
    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
        searchBtn.addEventListener('click', this.handleSearch.bind(this));
        
        // Enter key for search
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        // Sorting
        document.getElementById('sortSelect').addEventListener('change', this.handleSort.bind(this));

        // Filtering
        document.getElementById('genreFilter').addEventListener('change', this.handleFilter.bind(this));
        document.getElementById('yearFilter').addEventListener('change', this.handleFilter.bind(this));
        document.getElementById('clearFilters').addEventListener('click', this.clearFilters.bind(this));

        // Favorites toggle
        document.getElementById('favoritesBtn').addEventListener('click', this.toggleFavoritesView.bind(this));

        // Modal events
        document.getElementById('closeModal').addEventListener('click', this.closeModal.bind(this));
        document.getElementById('movieModal').addEventListener('click', (e) => {
            if (e.target.id === 'movieModal') this.closeModal();
        });

        // Movie container events (event delegation)
        document.getElementById('moviesContainer').addEventListener('click', this.handleMovieClick.bind(this));
    }

    // Debounce function for search input
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Handle search functionality
    async handleSearch() {
        const searchTerm = document.getElementById('searchInput').value.trim();
        
        if (searchTerm === '') {
            // Show local movies when search is empty
            this.filteredMovies = [...this.movies];
            this.applyFilters();
            this.displayMovies();
            return;
        }

        // Show loading for API search
        this.showLoading(true);
        
        try {
            // Search local movies first
            const localResults = this.movies.filter(movie => 
                movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                movie.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
                movie.actors.toLowerCase().includes(searchTerm.toLowerCase())
            );

            // Search API for additional results
            const apiResults = await this.searchMoviesAPI(searchTerm);
            
            // Combine results, avoiding duplicates
            const combinedResults = [...localResults];
            apiResults.forEach(apiMovie => {
                const exists = combinedResults.some(movie => 
                    movie.id === apiMovie.id || 
                    movie.title.toLowerCase() === apiMovie.title.toLowerCase()
                );
                if (!exists) {
                    combinedResults.push(apiMovie);
                }
            });

            this.filteredMovies = combinedResults;
            
            // Show search results info
            this.showSearchInfo(searchTerm, localResults.length, apiResults.length);
            
        } catch (error) {
            console.error('Search failed:', error);
            // Fallback to local search only
            this.filteredMovies = this.movies.filter(movie => 
                movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                movie.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
                movie.actors.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } finally {
            this.showLoading(false);
            this.displayMovies();
        }
    }

    // Show search results information
    showSearchInfo(searchTerm, localCount, apiCount) {
        const container = document.getElementById('moviesContainer');
        if (localCount > 0 || apiCount > 0) {
            const infoDiv = document.createElement('div');
            infoDiv.className = 'search-info';
            infoDiv.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 10px; margin-bottom: 1rem;';
            infoDiv.innerHTML = `
                <p style="margin: 0; color: #4ecdc4;">
                    Found ${localCount + apiCount} results for "${searchTerm}"
                    ${localCount > 0 ? `(${localCount} from library` : ''}
                    ${apiCount > 0 ? `${localCount > 0 ? ', ' : '('}${apiCount} from search)` : localCount > 0 ? ')' : ''}
                </p>
            `;
            container.insertBefore(infoDiv, container.firstChild);
        }
    }

    // Handle sorting
    handleSort() {
        const sortBy = document.getElementById('sortSelect').value;
        
        this.filteredMovies.sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'year':
                    return b.year - a.year; // Newest first
                case 'rating':
                    return b.imdb - a.imdb; // Highest first
                default:
                    return 0;
            }
        });
        
        this.displayMovies();
    }

    // Handle filtering
    handleFilter() {
        this.applyFilters();
        this.displayMovies();
    }

    // Apply genre and year filters
    applyFilters() {
        const genreFilter = document.getElementById('genreFilter').value;
        const yearFilter = document.getElementById('yearFilter').value;
        
        let filtered = [...this.filteredMovies];
        
        if (genreFilter) {
            filtered = filtered.filter(movie => 
                movie.genre.toLowerCase().includes(genreFilter.toLowerCase())
            );
        }
        
        if (yearFilter) {
            filtered = filtered.filter(movie => 
                movie.year.toString() === yearFilter
            );
        }
        
        this.filteredMovies = filtered;
    }

    // Clear all filters
    clearFilters() {
        document.getElementById('searchInput').value = '';
        document.getElementById('genreFilter').value = '';
        document.getElementById('yearFilter').value = '';
        document.getElementById('sortSelect').value = 'title';
        
        this.filteredMovies = [...this.movies];
        this.displayMovies();
    }

    // Populate filter dropdowns
    populateFilters() {
        // Populate genre filter
        const genres = [...new Set(this.movies.flatMap(movie => 
            movie.genre.split(', ').map(g => g.trim())
        ))].sort();
        
        const genreSelect = document.getElementById('genreFilter');
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreSelect.appendChild(option);
        });

        // Populate year filter
        const years = [...new Set(this.movies.map(movie => movie.year))].sort((a, b) => b - a);
        const yearSelect = document.getElementById('yearFilter');
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        });
    }

    // Toggle between all movies and favorites view
    toggleFavoritesView() {
        const favBtn = document.getElementById('favoritesBtn');
        
        if (this.currentView === 'all') {
            this.currentView = 'favorites';
            this.filteredMovies = this.movies.filter(movie => this.favorites.includes(movie.id));
            favBtn.innerHTML = '<i class="fas fa-arrow-left"></i><span>All Movies</span>';
            favBtn.style.background = '#ff6b6b';
            favBtn.style.color = 'white';
        } else {
            this.currentView = 'all';
            this.filteredMovies = [...this.movies];
            favBtn.innerHTML = '<i class="fas fa-heart"></i><span>Favorites</span>';
            favBtn.style.background = 'rgba(255, 107, 107, 0.2)';
            favBtn.style.color = '#ff6b6b';
        }
        
        this.displayMovies();
    }

    // Display movies in the grid
    displayMovies() {
        const container = document.getElementById('moviesContainer');
        const noResults = document.getElementById('noResults');
        
        // Remove any existing search info
        const existingInfo = container.querySelector('.search-info');
        if (existingInfo) {
            existingInfo.remove();
        }
        
        if (this.filteredMovies.length === 0) {
            container.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';
        
        container.innerHTML = this.filteredMovies.map(movie => `
            <div class="movie-card ${movie.source === 'api' ? 'api-movie' : ''}" data-id="${movie.id}">
                <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" 
                     onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <p class="movie-year">${movie.year}</p>
                    <p class="movie-genre">${movie.genre}</p>
                    <div class="movie-rating">
                        <span class="stars">${movie.imdb > 0 ? this.generateStars(movie.imdb) : '<i class="fas fa-question"></i>'}</span>
                        <span>${movie.imdb > 0 ? `${movie.imdb}/10` : 'Not rated'}</span>
                    </div>
                    ${this.userRatings[movie.id] ? `
                        <div class="user-rating-display">
                            <small>Your rating: ${this.generateStars(this.userRatings[movie.id], true)}</small>
                        </div>
                    ` : ''}
                    ${movie.source === 'api' ? `
                        <div class="api-badge">
                            <small><i class="fas fa-globe"></i> Live</small>
                        </div>
                    ` : ''}
                    <div class="movie-actions">
                        <button class="favorite-btn ${this.favorites.includes(movie.id) ? 'active' : ''}" 
                                data-action="favorite" data-id="${movie.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="view-details" data-action="details" data-id="${movie.id}">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Generate star rating display
    generateStars(rating, isUserRating = false) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        // Half star
        if (hasHalfStar && !isUserRating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    // Handle movie card clicks
    handleMovieClick(e) {
        const movieId = e.target.closest('[data-id]')?.dataset.id;
        if (!movieId) return;

        const action = e.target.closest('[data-action]')?.dataset.action;
        
        switch (action) {
            case 'favorite':
                this.toggleFavorite(movieId);
                break;
            case 'details':
                this.showMovieDetails(movieId);
                break;
            default:
                // Click on movie card itself
                if (e.target.closest('.movie-card')) {
                    this.showMovieDetails(movieId);
                }
        }
    }

    // Toggle favorite status
    toggleFavorite(movieId) {
        const index = this.favorites.indexOf(movieId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(movieId);
        }
        
        localStorage.setItem('movieFavorites', JSON.stringify(this.favorites));
        this.displayMovies();
    }

    // Show movie details in modal
    async showMovieDetails(movieId) {
        let movie = this.movies.find(m => m.id === movieId) || 
                   this.filteredMovies.find(m => m.id === movieId);
        
        if (!movie) return;

        const modalBody = document.getElementById('modalBody');
        const userRating = this.userRatings[movieId] || 0;
        
        // Show loading in modal
        modalBody.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #4ecdc4;"></i>
                <p>Loading movie details...</p>
            </div>
        `;
        document.getElementById('movieModal').style.display = 'block';

        // If it's an API movie with limited info, fetch full details
        if (movie.source === 'api' && movie.genre === 'Unknown') {
            const detailedMovie = await this.getMovieDetails(movieId);
            if (detailedMovie) {
                movie = detailedMovie;
            }
        }
        
        modalBody.innerHTML = `
            <div class="movie-detail">
                <div class="movie-detail-poster">
                    <img src="${movie.poster}" alt="${movie.title}" 
                         onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">
                </div>
                <div class="movie-detail-info">
                    <h2 class="movie-detail-title">${movie.title}</h2>
                    <div class="movie-detail-meta">
                        <div class="meta-item">
                            <span class="meta-label">Year</span>
                            <span class="meta-value">${movie.year}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Genre</span>
                            <span class="meta-value">${movie.genre}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Director</span>
                            <span class="meta-value">${movie.director}</span>
                        </div>
                        ${movie.runtime ? `
                        <div class="meta-item">
                            <span class="meta-label">Runtime</span>
                            <span class="meta-value">${movie.runtime}</span>
                        </div>
                        ` : ''}
                        <div class="meta-item">
                            <span class="meta-label">IMDB Rating</span>
                            <span class="meta-value">
                                ${movie.imdb > 0 ? `${movie.imdb}/10 ${this.generateStars(movie.imdb)}` : 'Not rated'}
                            </span>
                        </div>
                    </div>
                    <div class="movie-detail-cast">
                        <h4>Cast</h4>
                        <p>${movie.actors}</p>
                    </div>
                    <div class="movie-plot">
                        <h4>Plot</h4>
                        <p>${movie.plot}</p>
                    </div>
                    ${movie.source === 'api' ? `
                        <div style="background: rgba(78, 205, 196, 0.1); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                            <small style="color: #4ecdc4;">
                                <i class="fas fa-globe"></i> Live data from OMDB API
                            </small>
                        </div>
                    ` : ''}
                    <div class="rating-section">
                        <h3>Rate this movie</h3>
                        <div class="user-rating">
                            <span>Your rating:</span>
                            <div class="star-rating" data-movie-id="${movieId}">
                                ${[1,2,3,4,5].map(star => `
                                    <span class="star ${star <= userRating ? 'active' : ''}" 
                                          data-rating="${star}">★</span>
                                `).join('')}
                            </div>
                            <span class="rating-text">${userRating > 0 ? `${userRating}/5` : 'Not rated'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add star rating functionality
        const starRating = modalBody.querySelector('.star-rating');
        starRating.addEventListener('click', (e) => {
            if (e.target.classList.contains('star')) {
                const rating = parseInt(e.target.dataset.rating);
                this.setUserRating(movieId, rating);
                this.updateStarDisplay(starRating, rating);
            }
        });
    }

    // Set user rating for a movie
    setUserRating(movieId, rating) {
        this.userRatings[movieId] = rating;
        localStorage.setItem('userRatings', JSON.stringify(this.userRatings));
        
        // Update the rating text
        const ratingText = document.querySelector('.rating-text');
        if (ratingText) {
            ratingText.textContent = `${rating}/5`;
        }
        
        // Refresh the main view to show updated rating
        this.displayMovies();
    }

    // Update star display in modal
    updateStarDisplay(container, rating) {
        const stars = container.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    // Close modal
    closeModal() {
        document.getElementById('movieModal').style.display = 'none';
    }

    // Show/hide loading indicator
    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'block' : 'none';
    }

    // Show error message
    showError(message) {
        const container = document.getElementById('moviesContainer');
        container.innerHTML = `
            <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ff6b6b; margin-bottom: 1rem;"></i>
                <h3>${message}</h3>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #4ecdc4; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Try Again
                </button>
            </div>
        `;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MovieApp();
});
