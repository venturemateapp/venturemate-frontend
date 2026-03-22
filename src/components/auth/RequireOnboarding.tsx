/**
 * RequireOnboarding Guard Component
 * 
 * Redirects to onboarding wizard if user hasn't completed it.
 * Use this to protect dashboard routes.
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

interface RequireOnboardingProps {
  children: React.ReactNode;
}

export function RequireOnboarding({ children }: RequireOnboardingProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Not authenticated - redirect to signin
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Authenticated but onboarding not completed - redirect to onboarding
  if (user && !user.onboarding_completed) {
    // Save intended destination so we can redirect back after onboarding
    return <Navigate to="/onboarding" state={{ from: location.pathname }} replace />;
  }

  // Onboarding completed - allow access
  return <>{children}</>;
}
