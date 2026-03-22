import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Paper,
  IconButton,
  InputAdornment,
  CircularProgress,
  Fade,
} from '@mui/material';
import { GradientButton } from '@/components/GradientButton';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
} from '@mui/icons-material';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/lib/context/ToastContext';
import { ApiError } from '@/lib/api/client';

export default function SignInPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { showToast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        throw error;
      }
      showToast({ message: 'Welcome back!', type: 'success' });
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof ApiError) {
        showToast({ message: error.message, type: 'error' });
      } else if (error instanceof Error) {
        showToast({ message: error.message, type: 'error' });
      } else {
        showToast({ message: 'Failed to sign in', type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={600}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              background: 'rgba(20, 20, 20, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
            }}
          >
            {/* Logo */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                background: 'linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              VentureMate
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Welcome back! Sign in to continue your journey.
            </Typography>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2.5 }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <Box sx={{ textAlign: 'right', mb: 3 }}>
                <Link
                  to="/forgot-password"
                  style={{
                    color: '#4CAF50',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              <GradientButton
                type="submit"
                fullWidth
                size="lg"
                disabled={isLoading}
                animated
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: '#fff' }} />
                ) : (
                  'Sign In'
                )}
              </GradientButton>
            </Box>

            {/* Sign Up Link */}
            <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                style={{
                  color: '#4CAF50',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Sign up
              </Link>
            </Typography>

            {/* Back to Home */}
            <Box sx={{ mt: 4 }}>
              <Link
                to="/"
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                }}
              >
                ← Back to home
              </Link>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}
