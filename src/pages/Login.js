import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import LocalMoviesRoundedIcon from '@mui/icons-material/LocalMoviesRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const theme = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(username, password);
    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Brand panel: hidden on mobile, shown from md up */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          p: 6,
          color: 'common.white',
          textAlign: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: `repeating-linear-gradient(45deg, ${alpha(
              theme.palette.common.white,
              0.04
            )} 0, ${alpha(theme.palette.common.white, 0.04)} 2px, transparent 2px, transparent 14px)`,
          },
        }}
      >
        <LocalMoviesRoundedIcon sx={{ fontSize: 88, zIndex: 1 }} />
        <Typography variant="h3" fontWeight={700} sx={{ zIndex: 1 }}>
          Movie Explorer
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 420, opacity: 0.9, zIndex: 1, fontWeight: 400 }}>
          Search millions of titles, track what's trending, and build your own list of favorites.
        </Typography>
      </Grid>

      {/* Form panel */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          p: { xs: 2, sm: 4 },
          bgcolor: 'background.default',
        }}
      >
        {/* Compact brand header: only needed on mobile, since md+ shows the full brand panel */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 0.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
            <LocalMoviesRoundedIcon fontSize="large" />
            <Typography variant="h4" fontWeight={700} color="text.primary">
              Movie Explorer
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
            Search, track trending titles, and save your favorites.
          </Typography>
        </Box>

        <Paper
          elevation={4}
          sx={{
            width: '100%',
            maxWidth: 420,
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            animation: 'loginCardFloat 5s ease-in-out infinite',
            '@keyframes loginCardFloat': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-12px)' },
            },
            '@media (prefers-reduced-motion: reduce)': {
              animation: 'none',
            },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                mb: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              }}
            >
              <LocalMoviesRoundedIcon />
            </Avatar>
            <Typography variant="h5" component="h1" fontWeight={700}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 0.5 }}>
              Sign in to continue exploring movies
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              fullWidth
              InputProps={{
                sx: { borderRadius: 2 },
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonRoundedIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              InputProps={{
                sx: { borderRadius: 2 },
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                py: 1.3,
                borderRadius: 2,
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '1rem',
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.dark})`,
                },
              }}
            >
              Log In
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 3 }}>
            Enter any username &amp; password to continue.
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
