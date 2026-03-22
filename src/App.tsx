import { Routes, Route } from 'react-router-dom';
import { RequireOnboarding, RequireAuth } from '@/components/auth';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StaticBackground } from '@/components/AnimatedBackground';
import AOSInit from '@/components/AOSInit';
import { AuthProvider } from '@/lib/context/AuthContext';
import { BusinessProvider } from '@/lib/context/BusinessContext';
import { ToastProvider } from '@/lib/context/ToastContext';

// Pages
import HomePage from '@/pages/HomePage';
import SignInPage from '@/pages/auth/SignInPage';
import SignUpPage from '@/pages/auth/SignUpPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import OnboardingPage from '@/pages/onboarding/OnboardingPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import BusinessesPage from '@/pages/dashboard/BusinessesPage';
import NewBusinessPage from '@/pages/dashboard/NewBusinessPage';
import BusinessDetailPage from '@/pages/dashboard/BusinessDetailPage';
import BankingPage from '@/pages/dashboard/BankingPage';
import BrandingPage from '@/pages/dashboard/BrandingPage';
import BusinessPlanPage from '@/pages/dashboard/BusinessPlanPage';
import CompliancePage from '@/pages/dashboard/CompliancePage';
import CreditScorePage from '@/pages/dashboard/CreditScorePage';
import CrmPage from '@/pages/dashboard/CrmPage';
import HealthScorePage from '@/pages/dashboard/HealthScorePage';
import InvestorsPage from '@/pages/dashboard/InvestorsPage';
import MarketplacePage from '@/pages/dashboard/MarketplacePage';
import PitchDeckPage from '@/pages/dashboard/PitchDeckPage';
import SocialPage from '@/pages/dashboard/SocialPage';
import TaxPage from '@/pages/dashboard/TaxPage';
import DocumentsPage from '@/pages/dashboard/DocumentsPage';
import DocumentViewerPage from '@/pages/dashboard/DocumentViewerPage';
import WebsitesPage from '@/pages/dashboard/WebsitesPage';
import NewWebsitePage from '@/pages/dashboard/NewWebsitePage';
import EditWebsitePage from '@/pages/dashboard/EditWebsitePage';
import AIChatPage from '@/pages/dashboard/AIChatPage';
import SettingsPage from '@/pages/dashboard/SettingsPage';
import AuthCallbackPage from '@/pages/auth/AuthCallbackPage';
import AuthCodeErrorPage from '@/pages/auth/AuthCodeErrorPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0a0a0f',
      paper: '#12121a',
    },
    primary: {
      main: '#4CAF50',
      dark: '#2E7D32',
      light: '#81C784',
    },
    secondary: {
      main: '#2196F3',
      dark: '#1565C0',
      light: '#64B5F6',
    },
    text: {
      primary: '#ffffff',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0a0a0f',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 50,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 20px',
          minWidth: 'unset',
        },
        text: {
          borderRadius: 50,
          padding: '8px 16px',
        },
        textPrimary: {
          borderRadius: 50,
        },
        textSecondary: {
          borderRadius: 50,
        },
        outlined: {
          borderRadius: 50,
        },
        outlinedPrimary: {
          borderRadius: 50,
        },
        outlinedSecondary: {
          borderRadius: 50,
        },
        contained: {
          borderRadius: 50,
        },
        containedPrimary: {
          borderRadius: 50,
        },
        containedSecondary: {
          borderRadius: 50,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: 50,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 50,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StaticBackground />
        <AOSInit />
        <ToastProvider>
          <AuthProvider>
            <BusinessProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
                <Route path="/auth/auth-code-error" element={<AuthCodeErrorPage />} />
                
                {/* Onboarding - Requires Auth */}
                <Route path="/onboarding" element={<RequireAuth><OnboardingPage /></RequireAuth>} />
                
                {/* Dashboard Routes - Protected by Onboarding Guard */}
                <Route path="/dashboard" element={<RequireOnboarding><DashboardPage /></RequireOnboarding>} />
                <Route path="/dashboard/businesses" element={<RequireOnboarding><BusinessesPage /></RequireOnboarding>} />
                <Route path="/dashboard/businesses/new" element={<RequireOnboarding><NewBusinessPage /></RequireOnboarding>} />
                <Route path="/dashboard/businesses/:id" element={<RequireOnboarding><BusinessDetailPage /></RequireOnboarding>} />
                <Route path="/dashboard/businesses/:id/banking" element={<RequireOnboarding><BankingPage /></RequireOnboarding>} />
                <Route path="/dashboard/businesses/:id/branding" element={<RequireOnboarding><BrandingPage /></RequireOnboarding>} />
                <Route path="/dashboard/businesses/:id/business-plan" element={<RequireOnboarding><BusinessPlanPage /></RequireOnboarding>} />
                <Route path="/dashboard/businesses/:id/compliance" element={<RequireOnboarding><CompliancePage /></RequireOnboarding>} />
                <Route path="/dashboard/businesses/:id/pitch-deck" element={<RequireOnboarding><PitchDeckPage /></RequireOnboarding>} />
                <Route path="/dashboard/businesses/:id/tax" element={<RequireOnboarding><TaxPage /></RequireOnboarding>} />
                
                {/* Phase 2: Growth Features */}
                <Route path="/dashboard/crm" element={<RequireOnboarding><CrmPage /></RequireOnboarding>} />
                <Route path="/dashboard/banking" element={<RequireOnboarding><BankingPage /></RequireOnboarding>} />
                <Route path="/dashboard/social" element={<RequireOnboarding><SocialPage /></RequireOnboarding>} />
                
                {/* Phase 3: Scale Features */}
                <Route path="/dashboard/marketplace" element={<RequireOnboarding><MarketplacePage /></RequireOnboarding>} />
                <Route path="/dashboard/investors" element={<RequireOnboarding><InvestorsPage /></RequireOnboarding>} />
                <Route path="/dashboard/credit-score" element={<RequireOnboarding><CreditScorePage /></RequireOnboarding>} />
                <Route path="/dashboard/health-score" element={<RequireOnboarding><HealthScorePage /></RequireOnboarding>} />
                
                <Route path="/dashboard/documents" element={<RequireOnboarding><DocumentsPage /></RequireOnboarding>} />
                <Route path="/dashboard/documents/viewer" element={<RequireOnboarding><DocumentViewerPage /></RequireOnboarding>} />
                <Route path="/dashboard/websites" element={<RequireOnboarding><WebsitesPage /></RequireOnboarding>} />
                <Route path="/dashboard/websites/new" element={<RequireOnboarding><NewWebsitePage /></RequireOnboarding>} />
                <Route path="/dashboard/websites/edit" element={<RequireOnboarding><EditWebsitePage /></RequireOnboarding>} />
                <Route path="/dashboard/ai-chat" element={<RequireOnboarding><AIChatPage /></RequireOnboarding>} />
                <Route path="/dashboard/settings" element={<RequireOnboarding><SettingsPage /></RequireOnboarding>} />
              </Routes>
            </BusinessProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
