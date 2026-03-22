import { Box, Typography, Card, CardContent } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AIChatPage() {
  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          AI Assistant
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Get help with your startup journey
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 6, textAlign: 'center' }}>
          <AutoAwesome sx={{ fontSize: 64, color: '#4CAF50', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            AI Chat Coming Soon
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Our AI assistant will help you with business planning, compliance questions, and more.
          </Typography>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
