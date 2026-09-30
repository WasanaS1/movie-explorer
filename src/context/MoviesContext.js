import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getTrendingMovies, searchMovies, discoverMovies } from '../api/tmdb';

const MoviesContext = createContext(null);

const LAST_QUERY_KEY = 'movieExplorer.lastQuery';

function friendlyError(err) {
  if (!err.response) return 'Network error. Check your connection and try again.';
  if (err.response.status === 401) return 'Invalid TMDb API key. Check your .env file.';
  return 'Something went wrong talking to TMDb. Please try again.';
}

export function MoviesProvider({ children }) {
  const [query, setQuery] = useState(() => localStorage.getItem(LAST_QUERY_KEY) || '');
  const [filters, setFilters] = useState({ genreId: '', year: '', minRating: '' });

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [trendingError, setTrendingError] = useState(null);

  const hasActiveFilters = Boolean(filters.genreId || filters.year || filters.minRating);

  const fetchPage = useCallback(
    async (targetPage, { append } = { append: false }) => {
      if (!query.trim() && !hasActiveFilters) {
        setResults([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = query.trim()
          ? await searchMovies(query.trim(), targetPage)
          : await discoverMovies({ ...filters, page: targetPage });
        setResults((prev) => (append ? [...prev, ...data.results] : data.results));
        setPage(data.page);
        setTotalPages(data.total_pages);
      } catch (err) {
        setError(friendlyError(err));
      } finally {
        setLoading(false);
      }
    },
    [query, filters, hasActiveFilters]
  );

  // Re-run whenever the search term or filters change.
  useEffect(() => {
    localStorage.setItem(LAST_QUERY_KEY, query);
    fetchPage(1, { append: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filters]);

  const loadMore = () => {
    if (loading || page >= totalPages) return;
    fetchPage(page + 1, { append: true });
  };

  const loadTrending = useCallback(async () => {
    setTrendingLoading(true);
    setTrendingError(null);
    try {
      const data = await getTrendingMovies(1);
      setTrending(data.results);
    } catch (err) {
      setTrendingError(friendlyError(err));
    } finally {
      setTrendingLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrending();
  }, [loadTrending]);

  return (
    <MoviesContext.Provider
      value={{
        query,
        setQuery,
        filters,
        setFilters,
        results,
        page,
        totalPages,
        loading,
        error,
        loadMore,
        hasMore: page < totalPages,
        trending,
        trendingLoading,
        trendingError,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
}

export function useMovies() {
  const ctx = useContext(MoviesContext);
  if (!ctx) throw new Error('useMovies must be used within MoviesProvider');
  return ctx;
}
