import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import LocalMoviesRoundedIcon from '@mui/icons-material/LocalMoviesRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import Brightness4RoundedIcon from '@mui/icons-material/Brightness4Rounded';
import Brightness7RoundedIcon from '@mui/icons-material/Brightness7Rounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useThemeMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import SearchBar from './SearchBar';

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { mode, toggleMode } = useThemeMode();
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const isMovieDetailsPage = location.pathname.startsWith('/movie/');

  const handleLogout = () => {
    setMenuAnchor(null);
    logout();
    navigate('/login');
  };

  // Dark mode keeps the original plain surface color; only light mode gets the gradient.
  const isDark = mode === 'dark';
  const barBackground = isDark ? theme.palette.background.paper : `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`;
  const fg = isDark ? theme.palette.text.primary : theme.palette.common.white;

  return (
    <AppBar
      position="sticky"
      elevation={isDark ? 1 : 0}
      sx={{
        background: barBackground,
        borderBottom: `1px solid ${alpha(fg, 0.12)}`,
      }}
    >
      <Toolbar sx={{ gap: { xs: 1, sm: 2 }, minHeight: { xs: 60, sm: 68 } }}>
        {(!isMobile || !mobileSearchOpen) && (
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              color: fg,
              fontWeight: 700,
              letterSpacing: 0.3,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <LocalMoviesRoundedIcon />
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Movie Explorer
            </Box>
          </Typography>
        )}

        {/* Desktop: inline pill search bar */}
        {!isMobile && !isMovieDetailsPage && (
          <Box
            sx={{
              flexGrow: 1,
              maxWidth: 520,
              mx: 'auto',
              bgcolor: alpha(fg, 0.15),
              borderRadius: 999,
              px: 2,
              transition: 'background-color 0.2s',
              '&:hover, &:focus-within': {
                bgcolor: alpha(fg, 0.25),
              },
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiInputBase-input': { color: fg },
              '& .MuiInputBase-input::placeholder': { color: alpha(fg, 0.7), opacity: 1 },
              '& .MuiSvgIcon-root': { color: fg },
            }}
          >
            <SearchBar />
          </Box>
        )}

        {/* Mobile: expandable search row */}
        {isMobile && mobileSearchOpen && !isMovieDetailsPage && (
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: alpha(fg, 0.15),
              borderRadius: 999,
              px: 2,
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiInputBase-input': { color: fg },
              '& .MuiInputBase-input::placeholder': { color: alpha(fg, 0.7), opacity: 1 },
              '& .MuiSvgIcon-root': { color: fg },
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <SearchBar autoFocus />
            </Box>
            <IconButton
              size="small"
              onClick={() => setMobileSearchOpen(false)}
              aria-label="Close search"
              sx={{ color: fg }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Box>
        )}

        {/* Grows to push the right-side icons to the edge whenever the search bar isn't the one growing */}
        <Box
          sx={{
            flexGrow: (!isMobile && isMovieDetailsPage) || (isMobile && !mobileSearchOpen) ? 1 : 0,
          }}
        />

        {!(isMobile && mobileSearchOpen) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            {isMobile && !isMovieDetailsPage && (
              <IconButton
                onClick={() => setMobileSearchOpen(true)}
                aria-label="Open search"
                sx={{ color: fg }}
              >
                <SearchRoundedIcon />
              </IconButton>
            )}

            <Tooltip title="Favorites">
              <IconButton
                component={RouterLink}
                to="/favorites"
                aria-label="Favorites"
                sx={{
                  color: fg,
                  bgcolor: location.pathname === '/favorites' ? alpha(fg, 0.2) : 'transparent',
                }}
              >
                <Badge badgeContent={favorites.length} color="error" max={99}>
                  <FavoriteRoundedIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              <IconButton onClick={toggleMode} aria-label="Toggle light/dark mode" sx={{ color: fg }}>
                {mode === 'dark' ? <Brightness7RoundedIcon /> : <Brightness4RoundedIcon />}
              </IconButton>
            </Tooltip>

            {user && (
              <>
                <Tooltip title={user.username}>
                  <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} sx={{ ml: 0.5 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: alpha(fg, 0.25),
                        color: fg,
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
                  <MenuItem disabled sx={{ opacity: '1 !important', fontWeight: 600 }}>
                    {user.username}
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
