import { Card, CardActionArea, CardMedia, CardContent, Typography, IconButton, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import { posterUrl } from '../api/tmdb';
import { useFavorites } from '../context/FavoritesContext';

const FALLBACK_POSTER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750"><rect width="100%" height="100%" fill="#333"/><text x="50%" y="50%" fill="#aaa" font-size="28" text-anchor="middle" dy=".3em">No Image</text></svg>'
  );

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';
  const favorite = isFavorite(movie.id);

  return (
    <Card sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <IconButton
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(movie);
        }}
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
          bgcolor: 'rgba(0,0,0,0.5)',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
        }}
      >
        {favorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon sx={{ color: 'white' }} />}
      </IconButton>
      <CardActionArea onClick={() => navigate(`/movie/${movie.id}`)} sx={{ flexGrow: 1 }}>
        <CardMedia
          component="img"
          image={posterUrl(movie.poster_path) || FALLBACK_POSTER}
          alt={movie.title}
          sx={{ aspectRatio: '2 / 3', objectFit: 'cover' }}
        />
        <CardContent>
          <Typography variant="subtitle1" component="h3" noWrap title={movie.title}>
            {movie.title}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {year}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StarIcon fontSize="small" sx={{ color: 'gold' }} />
              <Typography variant="body2">{movie.vote_average?.toFixed(1) ?? 'N/A'}</Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
