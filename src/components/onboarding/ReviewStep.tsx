import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import { GradientButton } from '@/components/GradientButton';
import { ArrowForward, Edit, CheckCircle, Info } from '@mui/icons-material';
import type {
  OnboardingWizardState,
  ReviewAnswers,
} from '@/types/onboardingWizard';

interface ReviewStepProps {
  answers: OnboardingWizardState['answers'];
  onComplete: (answers: ReviewAnswers) => void;
  onEdit: (step: number) => void;
  isSaving: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  answers,
  onComplete,
  onEdit,
  isSaving,
}) => {
  const [confirmed, setConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showAiDisclaimer, setShowAiDisclaimer] = useState(true);

  const handleSubmit = () => {
    onComplete({
      confirmed,
      terms_accepted: termsAccepted,
    });
  };

  const allValid = confirmed && termsAccepted;

  // Helper to get country name from code
  const getCountryDisplay = (code?: string) => {
    // In a real app, you'd look this up from the countries list
    const countryMap: Record<string, string> = {
      'NG': '🇳🇬 Nigeria',
      'KE': '🇰🇪 Kenya',
      'GH': '🇬🇭 Ghana',
      'ZA': '🇿🇦 South Africa',
      'EG': '🇪🇬 Egypt',
      'ET': '🇪🇹 Ethiopia',
      'UG': '🇺🇬 Uganda',
      'TZ': '🇹🇿 Tanzania',
      'RW': '🇷🇼 Rwanda',
      'MA': '🇲🇦 Morocco',
      'SN': '🇸🇳 Senegal',
      'CI': '🇨🇮 Ivory Coast',
      'ZM': '🇿🇲 Zambia',
      'BW': '🇧🇼 Botswana',
    };
    return countryMap[code || ''] || code || 'Not selected';
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* AI Disclaimer */}
      {showAiDisclaimer && (
        <Alert
          severity="info"
          icon={<Info />}
          onClose={() => setShowAiDisclaimer(false)}
          sx={{ backgroundColor: 'rgba(33, 150, 243, 0.15)', border: '1px solid rgba(33, 150, 243, 0.3)', color: 'white' }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Our AI will analyze your answers to create a personalized startup blueprint. 
            This takes about <strong>30 seconds</strong>.
          </Typography>
        </Alert>
      )}

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Step 1: Country */}
        <Card variant="outlined" sx={{ position: 'relative', backgroundColor: 'rgba(30, 30, 40, 0.6)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="success" fontSize="small" />
                <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Step 1: Location
                </Typography>
              </Box>
              <GradientButton
                size="sm"
                startIcon={<Edit fontSize="small" />}
                onClick={() => onEdit(1)}
                variant="outline"
              >
                Edit
              </GradientButton>
            </Box>
            <Typography variant="body1">
              {getCountryDisplay(answers.country?.country)}
            </Typography>
            {answers.country?.secondary_countries && answers.country.secondary_countries.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Also operating in:
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                  {answers.country.secondary_countries.map((c) => (
                    <Chip key={c} label={getCountryDisplay(c)} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Founder Type */}
        <Card variant="outlined" sx={{ position: 'relative', backgroundColor: 'rgba(30, 30, 40, 0.6)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="success" fontSize="small" />
                <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Step 2: Team Structure
                </Typography>
              </Box>
              <GradientButton
                size="sm"
                startIcon={<Edit fontSize="small" />}
                onClick={() => onEdit(2)}
                variant="outline"
              >
                Edit
              </GradientButton>
            </Box>
            <Typography variant="body1">
              {answers.founder_type?.founder_type === 'solo' 
                ? '👤 Solo Founder'
                : `👥 Team with ${answers.founder_type?.cofounders?.length || 0} co-founder(s)`
              }
            </Typography>
            {answers.founder_type?.cofounders && answers.founder_type.cofounders.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {answers.founder_type.cofounders.map((cofounder, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="body2">
                      • {cofounder.full_name} — {cofounder.role} ({cofounder.equity_percentage}%)
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Step 3: Business Idea */}
        <Card variant="outlined" sx={{ position: 'relative', backgroundColor: 'rgba(30, 30, 40, 0.6)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="success" fontSize="small" />
                <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Step 3: Business Idea
                </Typography>
              </Box>
              <GradientButton
                size="sm"
                startIcon={<Edit fontSize="small" />}
                onClick={() => onEdit(3)}
                variant="outline"
              >
                Edit
              </GradientButton>
            </Box>
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.8)' }}>
              "{truncateText(answers.business_idea?.business_idea || '', 200)}"
            </Typography>
          </CardContent>
        </Card>

        {/* Step 4: Context (if provided) */}
        {(answers.business_context?.industry?.length ||
          answers.business_context?.target_customers ||
          answers.business_context?.revenue_model?.length) && (
          <Card variant="outlined" sx={{ position: 'relative', backgroundColor: 'rgba(30, 30, 40, 0.6)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle color="success" fontSize="small" />
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Step 4: Additional Context
                  </Typography>
                </Box>
                <GradientButton
                  size="sm"
                  startIcon={<Edit fontSize="small" />}
                  onClick={() => onEdit(4)}
                  variant="outline"
                >
                  Edit
                </GradientButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {answers.business_context?.industry?.map((ind) => (
                  <Chip key={ind} label={ind} size="small" color="primary" variant="outlined" />
                ))}
                {answers.business_context?.target_customers && (
                  <Chip 
                    label={`Target: ${answers.business_context.target_customers.toUpperCase()}`} 
                    size="small" 
                    color="secondary" 
                    variant="outlined" 
                  />
                )}
                {answers.business_context?.current_stage && (
                  <Chip 
                    label={`Stage: ${answers.business_context.current_stage}`} 
                    size="small" 
                    variant="outlined" 
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      <Divider />

      {/* Confirmation Checkboxes */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
          }
          label={
            <Typography variant="body2">
              I'm ready! Generate my startup blueprint
            </Typography>
          }
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
          }
          label={
            <Typography variant="body2">
              I agree to the{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                Privacy Policy
              </a>
            </Typography>
          }
        />
      </Box>

      {/* Submit Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <GradientButton
          variant="contained"
          size="lg"
          endIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
          onClick={handleSubmit}
          disabled={!allValid || isSaving}
          animated
        >
          {isSaving ? 'Generating Blueprint...' : 'Generate My Startup Blueprint'}
        </GradientButton>
      </Box>

      {/* Processing note */}
      {isSaving && (
        <Alert severity="info" sx={{ mt: 2, backgroundColor: 'rgba(33, 150, 243, 0.15)', border: '1px solid rgba(33, 150, 243, 0.3)', color: 'white' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Our AI is analyzing your answers and creating your personalized startup blueprint. 
            You'll be redirected to your dashboard shortly...
          </Typography>
        </Alert>
      )}
    </Box>
  );
};
