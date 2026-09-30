# Movie Explorer

Search, browse, and discover movies using [The Movie Database (TMDb)](https://www.themoviedb.org/) API.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Get a free TMDb API key: create an account at [themoviedb.org](https://www.themoviedb.org/signup), then generate a v3 API key under **Settings → API**.
3. Copy the env template and add your key:

   ```bash
   cp .env.example .env
   ```

   Then edit `.env`:

   ```text
   REACT_APP_TMDB_API_KEY=your_key_here
   ```

4. Start the dev server:

   ```bash
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Login

There's no backend/auth service in this project's scope, so login is a local, client-side gate: enter any non-empty username and password to sign in. Your session is remembered in `localStorage` until you log out.

## API usage

All TMDb calls live in `src/api/tmdb.js`, built on a single `axios` instance:

| Function | TMDb endpoint | Used by |
| --- | --- | --- |
| `getTrendingMovies(page)` | `GET /trending/movie/week` | Home (Trending section) |
| `searchMovies(query, page)` | `GET /search/movie` | Home (search results) |
| `discoverMovies({genreId, year, minRating, page})` | `GET /discover/movie` | Home (genre/year/rating filters) |
| `getMovieDetails(id)` | `GET /movie/:id` (+ `credits`, `videos`) | Movie Details page |
| `getGenres()` | `GET /genre/movie/list` | Filter dropdown |

API errors (network failures, bad key, etc.) are caught and surfaced as plain-language messages instead of raw errors.

## Features implemented

- **Auth**: local login form, session persisted in `localStorage`, app routes gated behind it.
- **Search**: debounced-by-effect search bar, backed by `MoviesContext`; last search term persists across reloads.
- **Trending**: popular-this-week section on the home page.
- **Filters**: genre, release year, and minimum rating, applied via TMDb's `/discover` endpoint when no search term is active.
- **Movie grid**: responsive card grid (poster, title, year, rating) with both infinite scroll (`IntersectionObserver`) and a manual "Load More" button.
- **Movie details**: overview, genres, cast (with headshots), and an embedded YouTube trailer when TMDb has one.
- **Favorites**: toggle from the card or details page; list persists in `localStorage` and has its own page.
- **Light/dark mode**: toggle in the navbar, built on MUI's theming, persisted in `localStorage`.

## State management

React Context API (no Redux): `AuthContext`, `ThemeContext`, `FavoritesContext`, and `MoviesContext` (search/trending/filter/pagination state) — each a small provider + hook pair under `src/context/`.

## Project structure

```text
src/
  api/tmdb.js          # axios instance + TMDb calls
  context/             # Auth, Theme, Favorites, Movies providers
  components/          # MovieCard, MovieGrid, SearchBar, FilterBar, Navbar, ProtectedRoute
  pages/                # Login, Home, MovieDetails, Favorites
```

## Deployment

Build with `npm run build`, then deploy the `build/` folder to Vercel or Netlify. Remember to set `REACT_APP_TMDB_API_KEY` (and optionally `REACT_APP_TMDB_IMAGE_BASE_URL`) as an environment variable in your hosting provider's dashboard — it isn't read from `.env` in production builds.
