import { Container, Typography, Box } from '@mui/material';
import { useMovies } from '../context/MoviesContext';
import FilterBar from '../components/FilterBar';
import MovieGrid from '../components/MovieGrid';

export default function Home() {
  const {
    query,
    results,
    loading,
    error,
    hasMore,
    loadMore,
    trending,
    trendingLoading,
    trendingError,
  } = useMovies();

  const isBrowsing = !query.trim();

  return (
    <Container sx={{ py: 3 }}>
      {isBrowsing && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Trending This Week
          </Typography>
          <MovieGrid
            movies={trending}
            loading={trendingLoading}
            error={trendingError}
            hasMore={false}
            onLoadMore={() => {}}
            emptyMessage="No trending movies right now."
          />
        </Box>
      )}

      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          {query.trim() ? `Results for "${query}"` : 'Browse'}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <FilterBar />
        </Box>
        <MovieGrid
          movies={results}
          loading={loading}
          error={error}
          hasMore={hasMore}
          onLoadMore={loadMore}
          emptyMessage="No movies match your search/filters."
        />
      </Box>
    </Container>
  );
}
