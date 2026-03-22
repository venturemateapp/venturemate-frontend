import { useEffect, useState } from 'react';
import { Box, Container, Typography, Alert, CircularProgress, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { WelcomeHeader } from '@/components/WelcomeHeader';
import { GradientButton } from '@/components/GradientButton';
import { 
  HealthScoreCard, 
  ProgressOverview, 
  NextActions,
  ActivityFeed,
  StartupInfoGrid 
} from '@/components/dashboard';
import { dashboardApi } from '@/lib/api/dashboard';
import { startupApi } from '@/lib/api/startup';
import { useAuth } from '@/lib/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import type { DashboardData } from '@/types/startupStack';
import type { StartupOverview } from '@/types/startup';

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [startups, setStartups] = useState<StartupOverview[]>([]);
  const [selectedStartupId, setSelectedStartupId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's startups on mount
  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const response = await startupApi.getUserStartups();
        if (response.success && response.data) {
          setStartups(response.data);
          // Select first startup by default
          if (response.data.length > 0) {
            setSelectedStartupId(response.data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch startups:', err);
      }
    };

    fetchStartups();
  }, []);

  // Fetch dashboard data when startup changes
  useEffect(() => {
    if (!selectedStartupId) {
      setIsLoading(false);
      return;
    }

    const fetchDashboard = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await dashboardApi.getDashboard(selectedStartupId);
        if (response.success && response.data) {
          setDashboard(response.data);
        } else {
          setError(response.error?.message || 'Failed to load dashboard');
        }
      } catch (err) {
        setError('An error occurred while loading the dashboard');
        console.error('Dashboard fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, [selectedStartupId]);

  // Handle startup switch
  const handleStartupSwitch = (startupId: string) => {
    setSelectedStartupId(startupId);
  };

  // Handle action completion
  const handleMarkComplete = async (actionId: string) => {
    // TODO: Implement mark complete API call
    console.log('Mark complete:', actionId);
    // Refresh dashboard after action
    if (selectedStartupId) {
      const response = await dashboardApi.getDashboard(selectedStartupId);
      if (response.success && response.data) {
        setDashboard(response.data);
      }
    }
  };

  // Handle action click
  const handleActionClick = (action: { action_url: string }) => {
    // Navigate to the action URL
    window.location.href = action.action_url;
  };

  // Empty state - no startups
  if (!isLoading && startups.length === 0) {
    return (
      <DashboardLayout>
        <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 4,
              }}
            >
              <Typography variant="h3" sx={{ color: 'white', mb: 2, fontWeight: 700 }}>
                🚀 Ready to build your startup?
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4, maxWidth: 400 }}>
                Complete the onboarding wizard to generate your personalized startup blueprint.
              </Typography>
              <GradientButton size="lg" onClick={() => window.location.href = '/onboarding/wizard'}>
                Start Onboarding
              </GradientButton>
            </Box>
          </motion.div>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ pb: 8 }}>
        {/* Welcome Header */}
        <WelcomeHeader
          startups={startups}
          selectedStartupId={selectedStartupId}
          onStartupSwitch={handleStartupSwitch}
          user={user}
        />

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#10b981' }} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          ) : dashboard ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Grid container spacing={3}>
                {/* Top Row: Health Score & Progress */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <HealthScoreCard 
                    score={dashboard.health_score} 
                    previousScore={Math.max(0, dashboard.health_score - 5)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <ProgressOverview progress={dashboard.progress} />
                </Grid>

                {/* Middle Row: Next Actions & Activity Feed */}
                <Grid size={{ xs: 12, lg: 8 }}>
                  <NextActions
                    actions={dashboard.next_actions}
                    onMarkComplete={handleMarkComplete}
                    onActionClick={handleActionClick}
                  />
                </Grid>
                <Grid size={{ xs: 12, lg: 4 }}>
                  <ActivityFeed activities={dashboard.activity_feed} />
                </Grid>

                {/* Bottom Row: Startup Info Grid */}
                <Grid size={{ xs: 12 }}>
                  <StartupInfoGrid 
                    startup={dashboard.startup}
                    stats={dashboard.quick_stats}
                  />
                </Grid>
              </Grid>
            </motion.div>
          ) : null}
        </Container>
      </Box>
    </DashboardLayout>
  );
}
