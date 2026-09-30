import { InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useMovies } from '../context/MoviesContext';

export default function SearchBar({ autoFocus = false }) {
  const { query, setQuery } = useMovies();

  return (
    <TextField
      fullWidth
      autoFocus={autoFocus}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search for a movie..."
      variant="outlined"
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
        sx: { py: 0.25 },
      }}
    />
  );
}
