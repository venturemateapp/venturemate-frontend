import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Fade,
  LinearProgress,
} from '@mui/material';
import { onboardingWizardApi } from '@/lib/api/client';
import { WizardContainer } from '@/components/onboarding/WizardContainer';
import { useToast } from '@/lib/context/ToastContext';
import { useAuth } from '@/lib/context/AuthContext';
import type { ResumeOnboardingResponse } from '@/types/onboardingWizard';

/**
 * Onboarding Wizard Page
 * 
 * Handles the complete 5-step onboarding flow:
 * 1. Country Selection
 * 2. Founder Type
 * 3. Business Idea
 * 4. Business Context (optional)
 * 5. Review & Confirmation
 * 
 * Features:
 * - Start new onboarding session
 * - Resume existing session (from query param or localStorage)
 * - Auto-save progress
 * - Exit and resume later
 */
export default function OnboardingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const { user, isLoading: authLoading } = useAuth();

  // Redirect to dashboard if onboarding already completed
  useEffect(() => {
    if (!authLoading && user?.onboarding_completed) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [savedAnswers, setSavedAnswers] = useState<Record<string, unknown>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initOnboarding = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check for session ID in query params (from email/notification)
        const sessionIdFromUrl = searchParams.get('session_id');
        
        // Check for session ID in localStorage (from previous session)
        const sessionIdFromStorage = localStorage.getItem('onboarding_session_id');
        
        // Check for resume flag
        const shouldResume = searchParams.get('resume') === 'true';

        let sessionIdToUse = sessionIdFromUrl || (shouldResume ? sessionIdFromStorage : null);

        if (sessionIdToUse) {
          // Try to resume existing session
          try {
            const resumeData: ResumeOnboardingResponse = await onboardingWizardApi.resumeWizard(sessionIdToUse);
            setSessionId(resumeData.session_id);
            setCurrentStep(resumeData.current_step);
            setProgress(resumeData.progress_percentage);
            setSavedAnswers(resumeData.saved_answers);
            
            showToast({
              message: resumeData.welcome_back_message,
              type: 'info',
              duration: 5000,
            });
            
            // Save to localStorage for persistence
            localStorage.setItem('onboarding_session_id', resumeData.session_id);
          } catch (err) {
            // If resume fails, start fresh
            console.warn('Failed to resume session, starting fresh:', err);
            await startNewSession();
          }
        } else {
          // Start new onboarding session
          await startNewSession();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize onboarding');
        showToast({
          message: 'Something went wrong. Please try again.',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    initOnboarding();
  }, [searchParams, showToast]);

  const startNewSession = async () => {
    const source = searchParams.get('source') || undefined;
    const response = await onboardingWizardApi.startWizard(source);
    
    setSessionId(response.session_id);
    setCurrentStep(response.current_step);
    setProgress(response.progress_percentage);
    
    // Save to localStorage for persistence
    localStorage.setItem('onboarding_session_id', response.session_id);
    
    // Clear any stale resume data
    localStorage.removeItem('onboarding_saved_answers');
  };

  const handleComplete = (_startupId: string, dashboardUrl: string) => {
    // Clear onboarding session from storage
    localStorage.removeItem('onboarding_session_id');
    localStorage.removeItem('onboarding_saved_answers');
    
    showToast({
      message: '🎉 Welcome! Your startup blueprint is being generated.',
      type: 'success',
      duration: 5000,
    });

    // Navigate to dashboard
    navigate(dashboardUrl);
  };

  const handleExit = () => {
    // Save current state to localStorage for later resume
    if (sessionId) {
      localStorage.setItem('onboarding_session_id', sessionId);
      localStorage.setItem('onboarding_exit_step', currentStep.toString());
    }
    
    showToast({
      message: 'Progress saved! You can resume anytime from your dashboard.',
      type: 'info',
      duration: 5000,
    });

    // Navigate to dashboard (will show incomplete onboarding state)
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              p: 4,
              backgroundColor: 'background.paper',
              borderRadius: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Loading your onboarding...
            </Typography>
            <LinearProgress sx={{ mt: 2, mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Just a moment while we set things up
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              p: 4,
              backgroundColor: 'background.paper',
              borderRadius: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" fontWeight="bold" color="error" gutterBottom>
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Go to Dashboard
              </button>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  if (!sessionId) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              p: 4,
              backgroundColor: 'background.paper',
              borderRadius: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Session Error
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Unable to initialize onboarding session. Please try again.
            </Typography>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Reload Page
            </button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Fade in={true} timeout={500}>
        <Container maxWidth="md">
          <Box
            sx={{
              backgroundColor: 'background.paper',
              borderRadius: 4,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              overflow: 'hidden',
            }}
          >
            {/* Header Banner */}
            <Box
              sx={{
                p: 3,
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                textAlign: 'center',
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                Welcome to VentureMate
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                Let's build your startup together in under 5 minutes
              </Typography>
            </Box>

            {/* Wizard Container */}
            <Box sx={{ p: { xs: 2, sm: 4 } }}>
              <WizardContainer
                sessionId={sessionId}
                initialStep={currentStep}
                initialProgress={progress}
                savedAnswers={savedAnswers}
                onComplete={handleComplete}
                onExit={handleExit}
              />
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" color="white" sx={{ opacity: 0.8 }}>
              Your data is secure and will only be used to personalize your experience
            </Typography>
          </Box>
        </Container>
      </Fade>
    </Box>
  );
}
