import { AppBar, Toolbar, Typography, IconButton, Button, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useThemeMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { mode, toggleMode } = useThemeMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ gap: 2, flexWrap: 'wrap', py: 1 }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ textDecoration: 'none', color: 'inherit', whiteSpace: 'nowrap' }}
        >
          🎬 Movie Explorer
        </Typography>

        <Box sx={{ flexGrow: 1, minWidth: 200 }}>
          <SearchBar />
        </Box>

        <Button component={RouterLink} to="/favorites" color="inherit">
          Favorites
        </Button>

        <IconButton onClick={toggleMode} aria-label="Toggle light/dark mode">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        {user && (
          <Button
            color="inherit"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Logout ({user.username})
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
