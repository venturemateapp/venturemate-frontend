import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Fade,
  Button,
} from '@mui/material';
import { CheckCircle, Error, Email } from '@mui/icons-material';
import { authApi } from '@/lib/api/client';
import { useToast } from '@/lib/context/ToastContext';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const [resending, setResending] = useState(false);
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await authApi.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Email verified successfully!');
        showToast({ message: 'Email verified!', type: 'success' });
      } catch (error) {
        setStatus('error');
        setMessage(
          error instanceof Error 
            ? error.message 
            : 'Failed to verify email. The link may have expired.'
        );
        showToast({ 
          message: 'Verification failed. Please try again.', 
          type: 'error' 
        });
      }
    };

    verifyEmail();
  }, [token, showToast]);

  const handleResend = async () => {
    if (!email) {
      showToast({ message: 'No email address found', type: 'error' });
      return;
    }
    
    setResending(true);
    try {
      const response = await authApi.resendVerification(email);
      if (response.verified) {
        setStatus('success');
        setMessage('Your email is already verified!');
      } else {
        showToast({ 
          message: 'Verification email sent! Check your inbox.', 
          type: 'success' 
        });
      }
    } catch (error) {
      showToast({ 
        message: 'Failed to resend verification email. Please try again later.', 
        type: 'error' 
      });
    } finally {
      setResending(false);
    }
  };

  const handleGoToSignIn = () => {
    navigate('/signin');
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

            {/* Status Icon */}
            <Box sx={{ my: 4 }}>
              {status === 'loading' && (
                <CircularProgress size={64} sx={{ color: '#4CAF50' }} />
              )}
              {status === 'success' && (
                <CheckCircle sx={{ fontSize: 64, color: '#4CAF50' }} />
              )}
              {status === 'error' && (
                <Error sx={{ fontSize: 64, color: '#f44336' }} />
              )}
            </Box>

            {/* Status Title */}
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              {status === 'loading' && 'Verifying Email'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
            </Typography>

            {/* Status Message */}
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {message}
            </Typography>

            {/* Actions */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {status === 'success' && (
                <Button
                  variant="contained"
                  onClick={handleGoToSignIn}
                  sx={{
                    background: 'linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)',
                    color: 'white',
                    borderRadius: 50,
                    py: 1.5,
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #43A047 0%, #1976D2 100%)',
                    },
                  }}
                >
                  Sign In
                </Button>
              )}

              {status === 'error' && (
                <>
                  <Button
                    variant="contained"
                    onClick={handleResend}
                    disabled={resending || !email}
                    startIcon={<Email />}
                    sx={{
                      background: 'linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)',
                      color: 'white',
                      borderRadius: 50,
                      py: 1.5,
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #43A047 0%, #1976D2 100%)',
                      },
                    }}
                  >
                    {resending ? (
                      <CircularProgress size={20} sx={{ color: 'white' }} />
                    ) : (
                      'Resend Verification Email'
                    )}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    component={Link}
                    to="/signin"
                    sx={{
                      borderRadius: 50,
                      py: 1.5,
                      fontWeight: 600,
                    }}
                  >
                    Back to Sign In
                  </Button>
                </>
              )}

              {status === 'loading' && (
                <Typography variant="body2" color="text.secondary">
                  Please wait while we verify your email address...
                </Typography>
              )}
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}
