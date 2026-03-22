import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { GradientButton } from '@/components/GradientButton';
import { ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function BusinessPlanPage() {
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
          Business Plan
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            AI-Generated Business Plan
          </Typography>
          <Typography color="text.secondary">
            Generate and edit your business plan with AI assistance.
          </Typography>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
