import { Box, Typography, Card, CardContent } from '@mui/material';
import { GradientButton } from '@/components/GradientButton';
import { ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function DocumentViewerPage() {
  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <GradientButton
          variant="outline"
          size="md"
          component={Link}
          to="/dashboard/documents"
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Back to Documents
        </GradientButton>
        <Typography variant="h4" fontWeight={700}>
          Document Viewer
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography color="text.secondary">
            Select a document to view
          </Typography>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
