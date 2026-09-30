import { Container, Typography } from '@mui/material';
import { useFavorites } from '../context/FavoritesContext';
import MovieGrid from '../components/MovieGrid';

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Your Favorites
      </Typography>
      <MovieGrid
        movies={favorites}
        loading={false}
        error={null}
        hasMore={false}
        onLoadMore={() => {}}
        emptyMessage="You haven't saved any favorites yet."
      />
    </Container>
  );
}
