import { useEffect, useState } from 'react';
import { Box, MenuItem, TextField } from '@mui/material';
import { getGenres } from '../api/tmdb';
import { useMovies } from '../context/MoviesContext';

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 40 }, (_, i) => currentYear - i);
const RATINGS = [9, 8, 7, 6, 5, 4];

export default function FilterBar() {
  const { filters, setFilters } = useMovies();
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    getGenres().then(setGenres).catch(() => setGenres([]));
  }, []);

  const update = (field) => (e) => setFilters((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <TextField
        select
        label="Genre"
        size="small"
        value={filters.genreId}
        onChange={update('genreId')}
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="">All Genres</MenuItem>
        {genres.map((g) => (
          <MenuItem key={g.id} value={g.id}>
            {g.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Year"
        size="small"
        value={filters.year}
        onChange={update('year')}
        sx={{ minWidth: 110 }}
      >
        <MenuItem value="">Any Year</MenuItem>
        {YEARS.map((y) => (
          <MenuItem key={y} value={y}>
            {y}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Min Rating"
        size="small"
        value={filters.minRating}
        onChange={update('minRating')}
        sx={{ minWidth: 130 }}
      >
        <MenuItem value="">Any Rating</MenuItem>
        {RATINGS.map((r) => (
          <MenuItem key={r} value={r}>
            {r}+ ⭐
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
