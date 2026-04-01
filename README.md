# Movie Zone — Premium Cinematic Experience

A **production-grade** movie discovery application with a Netflix/Apple TV+ inspired design. Built with React, Framer Motion, and modern CSS.

![Premium UI](https://img.shields.io/badge/Design-Netflix%2FApple%20TV%2B%20Inspired-red)
![React](https://img.shields.io/badge/React-18.2-blue)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.16-purple)

---

## ✨ Design Philosophy

> *"Like a magazine for film lovers — dark, editorial, cinematic"*

**Inspired by:**
- Netflix's immersive browsing
- Apple TV+'s premium cards
- Letterboxd's editorial feel
- A24's minimalist aesthetic

**NOT inspired by:**
- Generic Material UI dashboards
- Bootstrap templates
- AI-generated placeholder designs

---

## 🎨 Premium Features

### 🔥 Hero Section
- **Cinematic backdrop** with featured movie rotation
- **Dynamic content** with smooth fade transitions
- **Action buttons**: Watch Now (primary) + My List (secondary)
- **Genre cycling** animation
- **Scroll indicator** with bounce animation

### 🎬 Movie Cards
- **Hover effects**: Scale (1.08), glow overlay, smooth transitions
- **Premium overlay**: Play button + Info button on hover
- **Rating badge**: Gold IMDb badge with glass morphism
- **Favorite button**: Heart with spring animation
- **Genre-colored glow** matching each movie's genre
- **Rounded corners** (2xl), perfect spacing

### 🔍 Floating Search Bar
- **Glass morphism** with backdrop blur
- **Icon inside** input
- **Smooth focus animation** with red glow
- **Centered** in navbar

### 🎛 Filter Bar
- **Sticky positioning** below navbar
- **Pill-shaped buttons** with glow on active
- **Smooth transitions** using Framer Motion
- **More dropdown** for overflow years
- **Active filter tags** with remove buttons
- **Results count** with visual hierarchy

### ❤️ Favorites Page
- **Premium header** with animated icon
- **Empty state** with illustration
- **Smooth page transitions**

### 🎨 Color System
```css
--bg-primary: #0B0B0F      /* Deep cinematic black */
--bg-secondary: #111118    /* Surface */
--bg-surface: #1A1A24      /* Cards */
--accent-red: #E50914      /* Netflix red */
--accent-purple: #7C3AED   /* Purple glow */
--accent-gold: #F59E0B     /* Ratings */
--text-primary: #FFFFFF
--text-secondary: #A1A1AA
```

### ✨ Animations
- **Page transitions**: Fade + slide (0.4s)
- **Card stagger**: 0.05s delay between cards
- **Hover effects**: All 0.3s ease
- **Micro-interactions**: Buttons, toggles, badges
- **Modal**: Spring animation (damping: 25, stiffness: 300)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open **http://localhost:3000** to view the app.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Floating glass navbar
│   ├── Hero.jsx            # Cinematic hero with backdrop
│   ├── FilterBar.jsx       # Sticky pill filters
│   ├── MovieCard.jsx       # Premium card with hover
│   ├── MovieGrid.jsx       # Responsive grid layout
│   ├── MovieModal.jsx      # Editorial modal
│   ├── SkeletonLoader.jsx  # Matching skeletons
│   ├── EmptyState.jsx      # Minimal empty states
│   └── Footer.jsx          # Minimal footer
├── styles/
│   └── global.css          # Premium color system
├── App.jsx                 # Main app with transitions
└── main.jsx                # Entry point
```

---

## 📱 Responsive Breakpoints

| Screen Width | Columns |
|--------------|---------|
| ≥1400px      | 7       |
| ≥1100px      | 6       |
| ≥900px       | 5       |
| ≥600px       | 4       |
| ≥400px       | 3       |
| <400px       | 2       |

---

## 🎯 Key Design Decisions

### Typography
- **Bebas Neue**: Hero headings only (bold, uppercase)
- **Inter** (400, 500, 600): Everything else
- Letter spacing: Headings -0.02em, Nav +1px

### Spacing
- Container max-width: 1400px
- Grid gap: 24px (consistent)
- Card padding: 14px 16px
- Section padding: 32px

### Cards
- Border radius: 16px (2xl)
- Aspect ratio: 2/3 (never crop posters)
- Object position: center top
- Hover transform: translateY(-8px)

### Shadows
- Cards: 0 20px 60px rgba(0,0,0,0.6)
- Modal: 0 24px 80px rgba(0,0,0,0.7)
- Glow effects: Colored shadows

---

## 🔌 API Integration

- **OMDB API** for live movie data
- **Local fallback**: movies.json
- **Search caching** for performance
- **Details endpoint** for full movie info

Get your free API key: https://www.omdbapi.com/apikey.aspx

---

## 💾 Local Storage

- `movieFavorites`: Array of favorite movie IDs
- `userRatings`: Object mapping movie IDs to ratings (1-5)

---

## 🛠️ Tech Stack

- **React 18.2** — UI library
- **Vite 5.0** — Build tool
- **Framer Motion 10.16** — Animations
- **Google Fonts** — Bebas Neue, Inter
- **OMDB API** — Movie data

---

## 📄 License

Open source for educational purposes.

---

**Built with intention. No generic AI layouts.**

*Designed like a Netflix/Apple TV+ product.*
