import { Box, Container, Typography, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { GradientButton } from '@/components/GradientButton';
import { Error as ErrorIcon } from '@mui/icons-material';

export default function AuthCodeErrorPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'rgba(20, 20, 20, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
          }}
        >
          <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Authentication Error
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We couldn&apos;t complete the authentication process. The link may have expired or is invalid.
          </Typography>
          <GradientButton variant="outline" size="md" component={Link} to="/signin">
            Back to Sign In
          </GradientButton>
        </Paper>
      </Container>
    </Box>
  );
}
