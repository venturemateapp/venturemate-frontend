import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Business,
  AutoAwesome,
  Folder,
  Language,
  Settings,
  Logout,
  ChevronLeft,
  Add,
  People,
  AccountBalance,
  Share,
  Store,
  TrendingUp,
  Assessment,
  Favorite,
} from '@mui/icons-material';
import { useAuth } from '@/lib/context/AuthContext';
import { useBusiness } from '@/lib/context/BusinessContext';

const drawerWidth = 260;

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: Dashboard },
  { label: 'My Businesses', href: '/dashboard/businesses', icon: Business },
  { label: 'AI Assistant', href: '/dashboard/ai-chat', icon: AutoAwesome },
  { label: 'Documents', href: '/dashboard/documents', icon: Folder },
  { label: 'Websites', href: '/dashboard/websites', icon: Language },
];

// Phase 2: Growth
const growthNavItems = [
  { label: 'CRM', href: '/dashboard/crm', icon: People },
  { label: 'Banking', href: '/dashboard/banking', icon: AccountBalance },
  { label: 'Social Media', href: '/dashboard/social', icon: Share },
  { label: 'Marketplace', href: '/dashboard/marketplace', icon: Store },
];

// Phase 3: Scale
const scaleNavItems = [
  { label: 'Investors', href: '/dashboard/investors', icon: TrendingUp },
  { label: 'Credit Score', href: '/dashboard/credit-score', icon: Assessment },
  { label: 'Health Score', href: '/dashboard/health-score', icon: Favorite },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user, signOut, isLoading: authLoading } = useAuth();
  const { currentBusiness, fetchBusinesses } = useBusiness();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pathname = location.pathname;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchBusinesses();
    }
  }, [user, fetchBusinesses]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut();
    handleProfileMenuClose();
    navigate('/');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          VentureMate
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ ml: 'auto' }}>
            <ChevronLeft />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ mx: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Business Selector */}
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', px: 1, display: 'block', mb: 1 }}>
          Current Business
        </Typography>
        {currentBusiness ? (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Typography variant="body2" fontWeight={600} noWrap>
              {currentBusiness.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {currentBusiness.industry}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px dashed rgba(255,255,255,0.2)',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/dashboard/businesses/new')}
          >
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Add fontSize="small" />
              Create Business
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ mx: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Navigation */}
      <List sx={{ flex: 1, py: 1, overflow: 'auto' }}>
        {/* Core Items */}
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                to={item.href}
                selected={isActive}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(76, 175, 80, 0.15)',
                    '&:hover': {
                      backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#4CAF50' : 'text.secondary', minWidth: 40 }}>
                  <item.icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#4CAF50' : 'text.primary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}

        {/* Phase 2: Growth */}
        <Typography variant="caption" sx={{ color: 'text.secondary', px: 2, pt: 2, pb: 0.5, display: 'block', fontWeight: 600 }}>
          Growth
        </Typography>
        {growthNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                to={item.href}
                selected={isActive}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(76, 175, 80, 0.15)',
                    '&:hover': {
                      backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#4CAF50' : 'text.secondary', minWidth: 40 }}>
                  <item.icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#4CAF50' : 'text.primary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}

        {/* Phase 3: Scale */}
        <Typography variant="caption" sx={{ color: 'text.secondary', px: 2, pt: 2, pb: 0.5, display: 'block', fontWeight: 600 }}>
          Scale
        </Typography>
        {scaleNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                to={item.href}
                selected={isActive}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(76, 175, 80, 0.15)',
                    '&:hover': {
                      backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#4CAF50' : 'text.secondary', minWidth: 40 }}>
                  <item.icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#4CAF50' : 'text.primary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mx: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Bottom Actions */}
      <List sx={{ py: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/dashboard/settings"
            sx={{ mx: 1, borderRadius: 2 }}
          >
            <ListItemIcon sx={{ color: 'text.secondary', minWidth: 40 }}>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleSignOut}
            sx={{ mx: 1, borderRadius: 2 }}
          >
            <ListItemIcon sx={{ color: 'text.secondary', minWidth: 40 }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'rgba(20, 20, 20, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flex: 1 }} />

          {/* User Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Account settings">
              <IconButton onClick={handleProfileMenuOpen} size="small">
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    background: 'linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {user.first_name?.[0]}{user.last_name?.[0]}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            mt: 1.5,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {user.first_name} {user.last_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <MenuItem component={Link} to="/dashboard/settings" onClick={handleProfileMenuClose}>
          <Settings fontSize="small" sx={{ mr: 1 }} />
          Settings
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <Logout fontSize="small" sx={{ mr: 1 }} />
          Sign Out
        </MenuItem>
      </Menu>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: 'rgba(15, 15, 15, 0.98)',
              backdropFilter: 'blur(10px)',
              borderRight: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: 'rgba(15, 15, 15, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRight: '1px solid rgba(255,255,255,0.1)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
