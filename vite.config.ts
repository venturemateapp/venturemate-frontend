import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'vendor-charts': ['recharts'],
          'vendor-animation': ['framer-motion', 'aos'],
          'vendor-query': ['@tanstack/react-query'],
          // Feature chunks
          'feature-auth': ['./src/pages/auth/SignInPage', './src/pages/auth/SignUpPage', './src/pages/auth/ForgotPasswordPage'],
          'feature-dashboard': ['./src/pages/dashboard/DashboardPage', './src/pages/dashboard/BusinessesPage'],
          'feature-onboarding': ['./src/pages/onboarding/OnboardingPage', './src/components/onboarding'],
        },
      },
    },
  },
})
