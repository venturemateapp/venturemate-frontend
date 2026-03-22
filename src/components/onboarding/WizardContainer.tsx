import React, { useState, useEffect, useCallback } from 'react';
import { Box, LinearProgress, Typography, Fade, Alert } from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { GradientButton } from '@/components/GradientButton';
import { onboardingWizardApi } from '@/lib/api/client';
import type {
  OnboardingWizardState,
  StepContent,
  CountrySelectionAnswers,
  FounderTypeAnswers,
  BusinessIdeaAnswers,
  BusinessContextAnswers,
  ReviewAnswers,
} from '@/types/onboardingWizard';
import { CountrySelect } from './CountrySelect';
import { FounderTypeSelect } from './FounderTypeSelect';
import { BusinessIdeaInput } from './BusinessIdeaInput';
import { BusinessContextForm } from './BusinessContextForm';
import { ReviewStep } from './ReviewStep';

interface WizardContainerProps {
  sessionId: string;
  initialStep?: number;
  initialProgress?: number;
  savedAnswers?: Record<string, unknown>;
  onComplete: (startupId: string, dashboardUrl: string) => void;
  onExit: () => void;
}

export const WizardContainer: React.FC<WizardContainerProps> = ({
  sessionId,
  initialStep = 1,
  initialProgress = 0,
  savedAnswers = {},
  onComplete,
  onExit,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [progress, setProgress] = useState(initialProgress);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [stepContent, setStepContent] = useState<StepContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<OnboardingWizardState['answers']>({});

  // Restore saved answers if resuming
  useEffect(() => {
    if (savedAnswers && Object.keys(savedAnswers).length > 0) {
      const restoredAnswers: OnboardingWizardState['answers'] = {};
      
      if (savedAnswers['country_selection']) {
        const countryData = savedAnswers['country_selection'] as any;
        restoredAnswers.country = {
          country: countryData.country || '',
          secondary_countries: countryData.secondary_countries || [],
          has_physical_presence: countryData.has_physical_presence,
          is_digital_only: countryData.is_digital_only,
        };
      }
      
      if (savedAnswers['founder_type']) {
        const founderData = savedAnswers['founder_type'] as any;
        restoredAnswers.founder_type = {
          founder_type: founderData.founder_type || 'solo',
          team_size: founderData.team_size,
          cofounders: founderData.cofounders,
        };
      }
      
      if (savedAnswers['business_idea']) {
        const ideaData = savedAnswers['business_idea'] as any;
        restoredAnswers.business_idea = {
          business_idea: ideaData.business_idea || '',
        };
      }
      
      if (savedAnswers['business_context']) {
        restoredAnswers.business_context = savedAnswers['business_context'] as BusinessContextAnswers;
      }
      
      setAnswers(restoredAnswers);
    }
  }, [savedAnswers]);

  // Load step content when step changes
  useEffect(() => {
    const loadStepContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const content = await onboardingWizardApi.getStepContent(currentStep, sessionId);
        setStepContent(content);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load step');
      } finally {
        setIsLoading(false);
      }
    };

    loadStepContent();
  }, [currentStep, sessionId]);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentStep > 1 && !isSaving) {
        // Track auto-save event
        onboardingWizardApi.trackEvent({
          session_id: sessionId,
          event_type: 'auto_save',
          step_number: currentStep,
        }).catch(() => {}); // Silently fail
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentStep, sessionId, isSaving]);

  const handleStepComplete = useCallback(async (stepAnswers: unknown) => {
    try {
      setIsSaving(true);
      setError(null);

      let response;
      switch (currentStep) {
        case 1:
          response = await onboardingWizardApi.saveCountrySelection(
            sessionId,
            stepAnswers as CountrySelectionAnswers
          );
          setAnswers(prev => ({ ...prev, country: stepAnswers as CountrySelectionAnswers }));
          break;
        case 2:
          response = await onboardingWizardApi.saveFounderType(
            sessionId,
            stepAnswers as FounderTypeAnswers
          );
          setAnswers(prev => ({ ...prev, founder_type: stepAnswers as FounderTypeAnswers }));
          break;
        case 3:
          response = await onboardingWizardApi.saveBusinessIdea(
            sessionId,
            stepAnswers as BusinessIdeaAnswers
          );
          setAnswers(prev => ({ ...prev, business_idea: stepAnswers as BusinessIdeaAnswers }));
          break;
        case 4:
          response = await onboardingWizardApi.saveBusinessContext(
            sessionId,
            stepAnswers as BusinessContextAnswers
          );
          setAnswers(prev => ({ ...prev, business_context: stepAnswers as BusinessContextAnswers }));
          break;
        case 5:
          response = await onboardingWizardApi.saveReviewConfirmation(
            sessionId,
            stepAnswers as ReviewAnswers
          );
          break;
        default:
          return;
      }

      if (response.success) {
        setProgress(response.progress_percentage);

        if (currentStep === 5) {
          // Complete onboarding
          const completeResponse = await onboardingWizardApi.completeWizard(sessionId);
          onComplete(completeResponse.startup_id, completeResponse.dashboard_url);
        } else if (response.next_step) {
          setCurrentStep(response.next_step);
        }
      } else if (response.validation_errors) {
        const errorMessages = response.validation_errors.map(e => e.message).join(', ');
        setError(errorMessages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save step');
    } finally {
      setIsSaving(false);
    }
  }, [currentStep, sessionId, onComplete]);

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography color="text.secondary">Loading...</Typography>
        </Box>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <CountrySelect
            initialData={answers.country}
            onComplete={handleStepComplete}
            isSaving={isSaving}
          />
        );
      case 2:
        return (
          <FounderTypeSelect
            initialData={answers.founder_type}
            onComplete={handleStepComplete}
            isSaving={isSaving}
            sessionId={sessionId}
          />
        );
      case 3:
        return (
          <BusinessIdeaInput
            initialData={answers.business_idea}
            onComplete={handleStepComplete}
            isSaving={isSaving}
          />
        );
      case 4:
        return (
          <BusinessContextForm
            initialData={answers.business_context}
            onComplete={handleStepComplete}
            onSkip={() => handleStepComplete({} as BusinessContextAnswers)}
            isSaving={isSaving}
          />
        );
      case 5:
        return (
          <ReviewStep
            answers={answers}
            onComplete={handleStepComplete}
            onEdit={(step) => setCurrentStep(step)}
            isSaving={isSaving}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            {currentStep === 5 ? 'Review' : 'Let\'s set up your startup'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {progress}% complete
            </Typography>
            {isSaving && (
              <Save sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)', animation: 'pulse 1s infinite' }} />
            )}
          </Box>
        </Box>
        
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            },
          }}
        />
        
        {/* Step indicators */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          {[1, 2, 3, 4, 5].map((step) => (
            <Box
              key={step}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: step < currentStep ? 'success.main' : step === currentStep ? 'primary.main' : 'rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Error message */}
      {error && (
        <Fade in={true}>
          <Alert severity="error" sx={{ mb: 3, backgroundColor: 'rgba(244, 67, 54, 0.15)', border: '1px solid rgba(244, 67, 54, 0.3)', color: 'white' }} onClose={() => setError(null)}>
            {error}
          </Alert>
        </Fade>
      )}

      {/* Step content */}
      <Box sx={{ minHeight: 400 }}>
        {stepContent && currentStep !== 5 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight="medium" gutterBottom>
              {stepContent.title}
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {stepContent.description}
            </Typography>
            {stepContent.helper_text && (
              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.6)' }}>
                {stepContent.helper_text}
              </Typography>
            )}
          </Box>
        )}
        
        {renderStep()}
      </Box>

      {/* Footer navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
        <GradientButton
          startIcon={<ArrowBack />}
          onClick={handleBack}
          disabled={currentStep === 1 || isSaving}
          variant="outline"
          size="md"
        >
          Back
        </GradientButton>
        
        <GradientButton
          onClick={onExit}
          disabled={isSaving}
          variant="outline"
          size="md"
          color="inherit"
        >
          Save & Exit
        </GradientButton>
      </Box>

      {/* Motivational message */}
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="caption" color="success.main" fontWeight="medium">
          {currentStep === 1 && "You're taking the first step! 🚀"}
          {currentStep === 2 && "Great! Let's understand your team. 👥"}
          {currentStep === 3 && "Tell us about that brilliant idea! 💡"}
          {currentStep === 4 && "Optional details help us serve you better. ✨"}
          {currentStep === 5 && "Almost there! Ready to create your blueprint? 🎯"}
        </Typography>
      </Box>
    </Box>
  );
};
