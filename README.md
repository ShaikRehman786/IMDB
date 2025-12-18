IMDB Lite — Portfolio Project
=============================

Overview
--------
A fresher-friendly IMDB-like single-page app showcasing a clean UI and practical frontend features without relying on external APIs. The app uses a local `movies.json` dataset and demonstrates search, filter, sort, favorites (localStorage), personal ratings, and a details modal.

Files
-----
- [index.html](index.html): main HTML entry
- [style.css](style.css): styles
- [script.js](script.js): application logic
- [movies.json](movies.json): sample movie data

How to run
----------
Open `index.html` in your browser (double-click or use a simple static server). No build step required.

Features (good for interviews / startups)
---------------------------------------
- **Hybrid Data System**: Local movie library + live OMDB API search
- **Smart Search**: Searches both local data and external API simultaneously
- **Responsive Design**: Modern grid layout with smooth animations
- **Advanced Filtering**: Filter by genre, year, and sort options
- **Favorites System**: Persistent favorites using localStorage
- **Personal Ratings**: 5-star rating system with localStorage
- **Detailed View**: Enhanced movie details modal with API data
- **Live Data Indicators**: Visual badges showing API vs local data
- **Error Handling**: Graceful fallbacks when API is unavailable

Technical Highlights
-------------------
- **API Integration**: OMDB API with result caching and error handling
- **Modern JavaScript**: ES6+ classes, async/await, event delegation
- **Performance**: Debounced search, efficient DOM updates
- **User Experience**: Loading states, search result information
- **Data Persistence**: localStorage for user preferences and ratings

This project is intentionally simple and transparent — it looks polished but is easy to explain in interviews, showing hands-on frontend skills without advanced tooling.
