import { Box, Typography, Card, CardContent, TextField } from '@mui/material';
import { GradientButton } from '@/components/GradientButton';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function NewWebsitePage() {
  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <GradientButton
          variant="outline"
          size="md"
          component={Link}
          to="/dashboard/websites"
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Back to Websites
        </GradientButton>
        <Typography variant="h4" fontWeight={700}>
          Create New Website
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Website Details
          </Typography>
          
          <TextField
            fullWidth
            label="Website Name"
            placeholder="My Business Website"
            sx={{ mb: 3 }}
          />
          
          <TextField
            fullWidth
            label="Subdomain"
            placeholder="mybusiness"
            helperText="This will be your website URL: mybusiness.venturemate.app"
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <GradientButton
              variant="outline"
              size="md"
              component={Link}
              to="/dashboard/websites"
            >
              Cancel
            </GradientButton>
            <GradientButton
              variant="contained"
              size="md"
              animated
              endIcon={<ArrowForward />}
            >
              Continue
            </GradientButton>
          </Box>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
