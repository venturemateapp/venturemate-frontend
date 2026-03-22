import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Paper,
  InputAdornment,
  CircularProgress,
  Fade,
} from '@mui/material';
import { GradientButton } from '@/components/GradientButton';
import { Email, ArrowBack } from '@mui/icons-material';
import { useToast } from '@/lib/context/ToastContext';
import { authApi } from '@/lib/api/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authApi.forgotPassword(email);
      setSubmitted(true);
      showToast({ message: 'Password reset email sent!', type: 'success' });
    } catch (error) {
      showToast({ message: 'Failed to send reset email', type: 'error' });
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
              Reset Password
            </Typography>

            {submitted ? (
              <Box sx={{ mt: 4 }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Check your email for password reset instructions.
                </Typography>
                <GradientButton
                  variant="outline"
                  size="md"
                  onClick={() => {}}
                >
                  <ArrowBack sx={{ mr: 1, fontSize: 20 }} />
                  Back to Sign In
                </GradientButton>
              </Box>
            ) : (
              <>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Enter your email and we&apos;ll send you reset instructions.
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />

                  <GradientButton
                    type="submit"
                    fullWidth
                    size="lg"
                    disabled={isLoading}
                    animated
                  >
                    {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Send Reset Link'}
                  </GradientButton>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Link
                    to="/signin"
                    style={{ color: '#4CAF50', textDecoration: 'none', fontSize: '0.875rem' }}
                  >
                    Back to sign in
                  </Link>
                </Box>
              </>
            )}
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}
