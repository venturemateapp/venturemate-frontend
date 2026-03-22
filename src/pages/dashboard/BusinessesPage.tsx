import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GradientButton } from '@/components/GradientButton';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
} from '@mui/material';
import { Add, Business, ArrowForward } from '@mui/icons-material';
import { useBusiness } from '@/lib/context/BusinessContext';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function BusinessesPage() {
  const { businesses, fetchBusinesses, setCurrentBusiness } = useBusiness();

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" fontWeight={700}>
            Your Businesses
          </Typography>
          <GradientButton
            component={Link}
            to="/dashboard/businesses/new"
            variant="contained"
            size="md"
            animated
            startIcon={<Add />}
          >
            Create Business
          </GradientButton>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Manage and track all your business ventures
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {businesses.map((business) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={business.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                },
              }}
              onClick={() => {
                setCurrentBusiness(business);
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      background: 'linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)',
                    }}
                  >
                    {business.name[0]}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={600} noWrap>
                      {business.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {business.industry}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip
                    label={business.stage?.replace('_', ' ') || 'Idea'}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(76, 175, 80, 0.2)',
                      color: '#4CAF50',
                      textTransform: 'capitalize',
                    }}
                  />
                  {business.city && (
                    <Chip
                      label={business.city}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>

                <GradientButton
                  component={Link}
                  to={`/dashboard/businesses/${business.id}`}
                  variant="outline"
                  size="sm"
                  endIcon={<ArrowForward />}
                  onClick={(e) => e.stopPropagation()}
                >
                  View Details
                </GradientButton>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {businesses.length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Card sx={{ p: 6, textAlign: 'center' }}>
              <Business sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                No Businesses Yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create your first business to get started
              </Typography>
              <GradientButton
                component={Link}
                to="/dashboard/businesses/new"
                variant="contained"
                size="md"
                animated
                startIcon={<Add />}
              >
                Create Business
              </GradientButton>
            </Card>
          </Grid>
        )}
      </Grid>
    </DashboardLayout>
  );
}
