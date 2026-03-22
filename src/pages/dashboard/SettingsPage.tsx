import { Box, Typography, Card, CardContent, TextField, Tabs, Tab } from '@mui/material';
import { GradientButton } from '@/components/GradientButton';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/lib/context/AuthContext';

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

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account and preferences
        </Typography>
      </Box>

      <Card>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Profile" />
          <Tab label="Security" />
          <Tab label="Notifications" />
        </Tabs>

        <CardContent>
          <TabPanel value={activeTab} index={0}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Profile Information
            </Typography>
            <TextField
              fullWidth
              label="First Name"
              defaultValue={user?.first_name}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Last Name"
              defaultValue={user?.last_name}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              defaultValue={user?.email}
              disabled
              sx={{ mb: 3 }}
            />
            <GradientButton variant="contained" size="md" animated>Save Changes</GradientButton>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Security Settings
            </Typography>
            <GradientButton variant="outline" size="md">Change Password</GradientButton>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Notification Preferences
            </Typography>
            <Typography color="text.secondary">
              Notification settings coming soon
            </Typography>
          </TabPanel>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
