import { Box, Typography, Card, CardContent } from '@mui/material';
import { GradientButton } from '@/components/GradientButton';
import { Add, Folder } from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" fontWeight={700}>
            Documents
          </Typography>
          <GradientButton variant="contained" size="md" animated startIcon={<Add />}>
            Upload Document
          </GradientButton>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Manage all your business documents in one place
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 6, textAlign: 'center' }}>
          <Folder sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Document Vault
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Upload and organize your business documents here
          </Typography>
          <GradientButton variant="contained" size="md" animated startIcon={<Add />}>
            Upload First Document
          </GradientButton>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
