import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GradientButton } from '@/components/GradientButton';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  LinearProgress,
  Chip,
  Avatar,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Business,
  Verified,
  AccountBalance,
  Palette,
  Description,
  Language,
} from '@mui/icons-material';
import { businessApi } from '@/lib/api/client';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const menuItems = [
  { label: 'Overview', icon: Business, href: '' },
  { label: 'Compliance', icon: Verified, href: 'compliance' },
  { label: 'Banking', icon: AccountBalance, href: 'banking' },
  { label: 'Branding', icon: Palette, href: 'branding' },
  { label: 'Business Plan', icon: Description, href: 'business-plan' },
  { label: 'Pitch Deck', icon: Description, href: 'pitch-deck' },
  { label: 'Website', icon: Language, href: 'website' },
];

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<any>(null);
  const [checklist, setChecklist] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBusiness = async () => {
      if (!id) return;
      try {
        const [businessData, checklistData] = await Promise.all([
          businessApi.getById(id),
          businessApi.getChecklist(id),
        ]);
        setBusiness(businessData.business);
        setChecklist(checklistData.checklist);
      } catch (error) {
        console.error('Failed to load business:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadBusiness();
  }, [id]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <Box sx={{ p: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  if (!business) {
    return (
      <DashboardLayout>
        <Box sx={{ p: 4 }}>
          <Typography>Business not found</Typography>
          <GradientButton variant="outline" size="md" component={Link} to="/dashboard/businesses" sx={{ mt: 2 }}>
            Back to Businesses
          </GradientButton>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <GradientButton
          variant="outline"
          size="md"
          component={Link}
          to="/dashboard/businesses"
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Back to Businesses
        </GradientButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              background: 'linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)',
              fontSize: '1.5rem',
            }}
          >
            {business.name[0]}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight={700}>
              {business.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {business.industry} • {business.city || 'No location set'}
            </Typography>
          </Box>
          <GradientButton variant="outline" size="md" startIcon={<Edit />}>
            Edit
          </GradientButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={business.stage?.replace('_', ' ') || 'Idea'}
            sx={{
              backgroundColor: 'rgba(76, 175, 80, 0.2)',
              color: '#4CAF50',
              textTransform: 'capitalize',
            }}
          />
          <Chip label={business.country_code || 'US'} variant="outlined" />
        </Box>
      </Box>

      <Card>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {menuItems.map((item) => (
            <Tab key={item.label} label={item.label} icon={<item.icon />} iconPosition="start" />
          ))}
        </Tabs>

        <CardContent>
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Progress Overview
                </Typography>
                {checklist ? (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Overall Progress
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color="#4CAF50">
                          {Math.round(checklist.overall_progress || 0)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={checklist.overall_progress || 0}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #4CAF50, #2196F3)',
                          },
                        }}
                      />
                    </Box>
                    {checklist.categories?.map((cat: any) => (
                      <Box key={cat.name} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">{cat.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {Math.round(cat.progress)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={cat.progress}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: 'rgba(255,255,255,0.05)',
                          }}
                        />
                      </Box>
                    ))}
                  </>
                ) : (
                  <Typography color="text.secondary">No checklist data available</Typography>
                )}
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {menuItems.slice(1).map((item) => (
                    <GradientButton
                      key={item.label}
                      component={Link}
                      to={`/dashboard/businesses/${id}/${item.href}`}
                      variant="outline"
                      size="sm"
                      startIcon={<item.icon />}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      {item.label}
                    </GradientButton>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          {menuItems.slice(1).map((item, index) => (
            <TabPanel key={item.label} value={activeTab} index={index + 1}>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  {item.label} content coming soon
                </Typography>
                <GradientButton
                  component={Link}
                  to={`/dashboard/businesses/${id}/${item.href}`}
                  variant="contained"
                  size="md"
                  animated
                  sx={{ mt: 2 }}
                >
                  Go to {item.label}
                </GradientButton>
              </Box>
            </TabPanel>
          ))}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
