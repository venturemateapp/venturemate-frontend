'use client';

import { AuthProvider } from './AuthContext';
import { ToastProvider } from './ToastContext';
import { BusinessProvider } from './BusinessContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/lib/theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <AuthProvider>
          <BusinessProvider>
            {children}
          </BusinessProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
