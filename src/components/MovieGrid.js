import { useEffect, useRef } from 'react';
import { Grid, Box, Button, CircularProgress, Typography, Alert } from '@mui/material';
import MovieCard from './MovieCard';

export default function MovieGrid({ movies, loading, error, hasMore, onLoadMore, emptyMessage }) {
  const sentinelRef = useRef(null);

  // Infinite scroll: auto-load the next page when the sentinel enters the viewport.
  useEffect(() => {
    if (!hasMore || loading) return undefined;
    const node = sentinelRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore();
      },
      { rootMargin: '200px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  if (error) return <Alert severity="error">{error}</Alert>;

  if (!loading && movies.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
        {emptyMessage || 'No movies found.'}
      </Typography>
    );
  }

  return (
    <Box>
      <Grid container spacing={2}>
        {movies.map((movie) => (
          <Grid key={movie.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>

      <Box ref={sentinelRef} sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        {loading && <CircularProgress size={32} />}
        {!loading && hasMore && (
          <Button variant="outlined" onClick={onLoadMore}>
            Load More
          </Button>
        )}
      </Box>
    </Box>
  );
}
