import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { getMovieDetails, posterUrl } from '../api/tmdb';
import { useFavorites } from '../context/FavoritesContext';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getMovieDetails(id)
      .then((data) => {
        if (!cancelled) setMovie(data);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load this movie. It may not exist or TMDb is unavailable.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !movie) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Movie not found.'}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Back
        </Button>
      </Container>
    );
  }

  const trailer = movie.videos?.results?.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer'
  );
  const cast = movie.credits?.cast?.slice(0, 8) || [];
  const favorite = isFavorite(movie.id);

  return (
    <Container sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Box
            component="img"
            src={posterUrl(movie.poster_path)}
            alt={movie.title}
            sx={{ width: '100%', borderRadius: 2 }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 8 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
            <Typography variant="h4" component="h1">
              {movie.title}
            </Typography>
            <Button
              variant={favorite ? 'contained' : 'outlined'}
              color="error"
              startIcon={favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={() => toggleFavorite(movie)}
            >
              {favorite ? 'Favorited' : 'Add to Favorites'}
            </Button>
          </Stack>

          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {movie.release_date?.slice(0, 4)} • {movie.runtime ? `${movie.runtime} min` : 'N/A'} •
            ⭐ {movie.vote_average?.toFixed(1)}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
            {movie.genres?.map((g) => (
              <Chip key={g.id} label={g.name} size="small" />
            ))}
          </Stack>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {movie.overview || 'No overview available.'}
          </Typography>

          {cast.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Cast
              </Typography>
              <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 2, mb: 2 }}>
                {cast.map((member) => (
                  <Box key={member.cast_id ?? member.id} sx={{ textAlign: 'center', minWidth: 80 }}>
                    <Avatar
                      src={posterUrl(member.profile_path, 'w200')}
                      alt={member.name}
                      sx={{ width: 64, height: 64, mx: 'auto', mb: 0.5 }}
                    />
                    <Typography variant="caption" noWrap sx={{ display: 'block', maxWidth: 80 }}>
                      {member.name}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </>
          )}

          {trailer && (
            <>
              <Typography variant="h6" gutterBottom>
                Trailer
              </Typography>
              <Box
                sx={{
                  position: 'relative',
                  pb: '56.25%',
                  height: 0,
                  overflow: 'hidden',
                  borderRadius: 2,
                }}
              >
                <Box
                  component="iframe"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="Movie trailer"
                  allowFullScreen
                  sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                />
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
