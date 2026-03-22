import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GradientButton } from '@/components/GradientButton';
import {
  Box,
  Typography,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, ArrowForward, CheckCircle } from '@mui/icons-material';
import { useBusiness } from '@/lib/context/BusinessContext';
import { useToast } from '@/lib/context/ToastContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { CountrySelectSimple } from '@/components/CountrySelect';

const steps = ['Basic Info', 'Details', 'Complete'];

export default function NewBusinessPage() {
  const navigate = useNavigate();
  const { createBusiness } = useBusiness();
  const { showToast } = useToast();
  
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    country_code: 'US',
    description: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.name || !formData.industry) {
        showToast({ message: 'Please fill in all required fields', type: 'warning' });
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await createBusiness({
        name: formData.name,
        industry: formData.industry,
        country_code: formData.country_code,
        description: formData.description,
      });
      showToast({ message: 'Business created successfully!', type: 'success' });
      navigate('/dashboard/businesses');
    } catch (error) {
      showToast({ message: 'Failed to create business', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Business Name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Industry"
              value={formData.industry}
              onChange={(e) => updateField('industry', e.target.value)}
              required
              placeholder="e.g., Technology, Retail, Healthcare"
              sx={{ mb: 3 }}
            />
            <CountrySelectSimple
              value={formData.country_code}
              onChange={(code) => updateField('country_code', code)}
              label="Country"
              fullWidth
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              multiline
              rows={4}
              placeholder="Describe your business idea..."
              sx={{ mb: 3 }}
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 64, color: '#4CAF50', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Ready to Create!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review your information and click Create to add your business.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <GradientButton
          variant="outline"
          size="md"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard/businesses')}
          sx={{ mb: 2 }}
        >
          Back to Businesses
        </GradientButton>
        <Typography variant="h4" fontWeight={700}>
          Create New Business
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent()}

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            {activeStep > 0 && (
              <GradientButton
                variant="outline"
                size="md"
                onClick={handleBack}
                disabled={isLoading}
                startIcon={<ArrowBack />}
              >
                Back
              </GradientButton>
            )}

            {activeStep === steps.length - 1 ? (
              <GradientButton
                variant="contained"
                size="md"
                animated
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Create Business'}
              </GradientButton>
            ) : (
              <GradientButton
                variant="contained"
                size="md"
                animated
                onClick={handleNext}
                endIcon={<ArrowForward />}
              >
                Continue
              </GradientButton>
            )}
          </Box>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
