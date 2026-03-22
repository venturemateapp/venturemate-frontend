import { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Badge,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Business,
  Notifications,
  KeyboardArrowDown,
  Settings,
  Logout,
  Add,
} from '@mui/icons-material';

import type { StartupOverview } from '@/types/startup';

interface WelcomeHeaderProps {
  startups: StartupOverview[];
  selectedStartupId: string;
  onStartupSwitch: (startupId: string) => void;
  user?: { first_name?: string; email?: string; last_name?: string } | null;
}

export function WelcomeHeader({
  startups,
  selectedStartupId,
  onStartupSwitch,
  user: userProp,
}: WelcomeHeaderProps) {
  const [localUser, setLocalUser] = useState<{ first_name: string; email: string } | null>(null);
  
  // Use prop user if available, otherwise fall back to local user
  const user = userProp ? { 
    first_name: userProp.first_name || 'Founder', 
    email: userProp.email || '',
    last_name: userProp.last_name || ''
  } : localUser;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [startupMenuEl, setStartupMenuEl] = useState<null | HTMLElement>(null);
  const [notificationCount] = useState(3);

  // Get selected startup
  const selectedStartup = startups.find((s) => s.id === selectedStartupId);

  // Fetch user data if not provided via props
  useEffect(() => {
    if (!userProp) {
      // TODO: Replace with actual API call
      setLocalUser({
        first_name: 'Founder',
        email: 'founder@example.com',
      });
    }
  }, [userProp]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStartupMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setStartupMenuEl(event.currentTarget);
  };

  const handleStartupMenuClose = () => {
    setStartupMenuEl(null);
  };

  const handleStartupSelect = (startupId: string) => {
    onStartupSwitch(startupId);
    handleStartupMenuClose();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getWelcomeMessage = () => {
    if (!user) return 'Welcome!';
    
    // Check last visit time (would be stored in user preferences)
    const lastVisit = localStorage.getItem('lastDashboardVisit');
    const now = new Date().toISOString();
    localStorage.setItem('lastDashboardVisit', now);

    if (!lastVisit) {
      return `${getGreeting()}, ${user.first_name}! Ready to build something amazing?`;
    }

    const daysSinceVisit = Math.floor(
      (new Date(now).getTime() - new Date(lastVisit).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceVisit > 3) {
      return `We missed you, ${user.first_name}! Here's what's new.`;
    }

    return `${getGreeting()}, ${user.first_name}!`;
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: 'transparent',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 4 }, py: 2 }}>
        {/* Left: Welcome Message */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: 700,
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
            }}
          >
            {getWelcomeMessage()}
          </Typography>

          {/* Startup Switcher */}
          {selectedStartup && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
              <Chip
                icon={<Business sx={{ fontSize: 16 }} />}
                label={selectedStartup.name}
                onClick={handleStartupMenuOpen}
                onDelete={handleStartupMenuOpen}
                deleteIcon={<KeyboardArrowDown />}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '& .MuiChip-icon': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiChip-deleteIcon': { color: 'rgba(255,255,255,0.7)' },
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.15)' },
                }}
              />
              <Chip
                label={selectedStartup.status}
                size="small"
                sx={{
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  color: '#10b981',
                  fontWeight: 600,
                }}
              />
            </Box>
          )}

          {/* Startup Menu */}
          <Menu
            anchorEl={startupMenuEl}
            open={Boolean(startupMenuEl)}
            onClose={handleStartupMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: '#1a1a2e',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minWidth: 250,
              },
            }}
          >
            <Typography
              variant="caption"
              sx={{ px: 2, py: 1, color: 'rgba(255,255,255,0.5)', display: 'block' }}
            >
              Your Startups
            </Typography>
            {startups.map((startup) => (
              <MenuItem
                key={startup.id}
                onClick={() => handleStartupSelect(startup.id)}
                selected={startup.id === selectedStartupId}
                sx={{
                  color: 'white',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Business sx={{ mr: 1, fontSize: 18, color: 'rgba(255,255,255,0.6)' }} />
                {startup.name}
              </MenuItem>
            ))}
            <MenuItem
              onClick={() => {
                handleStartupMenuClose();
                window.location.href = '/onboarding/wizard';
              }}
              sx={{
                color: '#10b981',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                mt: 1,
              }}
            >
              <Add sx={{ mr: 1, fontSize: 18 }} />
              Create New Startup
            </MenuItem>
          </Menu>
        </Box>

        {/* Right: Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}
            >
              <Badge badgeContent={notificationCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Box>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                  fontWeight: 600,
                }}
              >
                {user?.first_name?.[0] || 'F'}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: '#1a1a2e',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  minWidth: 200,
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                  {user?.first_name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  {user?.email}
                </Typography>
              </Box>
              <MenuItem
                onClick={handleMenuClose}
                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                <Settings sx={{ mr: 1.5, fontSize: 18 }} />
                Settings
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  // TODO: Implement logout
                  localStorage.removeItem('token');
                  window.location.href = '/signin';
                }}
                sx={{ color: '#ef4444', '&:hover': { backgroundColor: 'rgba(239,68,68,0.1)' } }}
              >
                <Logout sx={{ mr: 1.5, fontSize: 18 }} />
                Sign Out
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
