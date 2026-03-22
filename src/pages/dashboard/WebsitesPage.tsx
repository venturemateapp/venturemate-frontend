import { Box, Typography, Card, Grid } from '@mui/material';
import { GradientButton } from '@/components/GradientButton';
import { Add, Language } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function WebsitesPage() {
  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" fontWeight={700}>
            Websites
          </Typography>
          <GradientButton
            component={Link}
            to="/dashboard/websites/new"
            variant="contained"
            size="md"
            animated
            startIcon={<Add />}
          >
            Create Website
          </GradientButton>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Build and manage your business websites
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: 6, textAlign: 'center' }}>
            <Language sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No Websites Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first website to establish your online presence
            </Typography>
            <GradientButton
              component={Link}
              to="/dashboard/websites/new"
              variant="contained"
              size="md"
              animated
              startIcon={<Add />}
            >
              Create Website
            </GradientButton>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
