import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { GradientButton } from '@/components/GradientButton';
import { ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function TaxPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <GradientButton
          variant="outline"
          size="md"
          component={Link}
          to={`/dashboard/businesses/${id}`}
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Back to Business
        </GradientButton>
        <Typography variant="h4" fontWeight={700}>
          Tax Management
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Tax Information
          </Typography>
          <Typography color="text.secondary">
            Manage your tax documents and compliance requirements here.
          </Typography>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
