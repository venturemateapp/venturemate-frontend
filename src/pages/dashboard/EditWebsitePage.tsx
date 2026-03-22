import { Box, Typography, Card, CardContent } from '@mui/material';
import { GradientButton } from '@/components/GradientButton';
import { ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function EditWebsitePage() {
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
          Edit Website
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Website Editor
          </Typography>
          <Typography color="text.secondary">
            Customize your website content and design here.
          </Typography>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
