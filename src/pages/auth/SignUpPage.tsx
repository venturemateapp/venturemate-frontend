import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Grid,
  IconButton,
  InputAdornment,
  CircularProgress,
  Fade,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { GradientButton } from '@/components/GradientButton';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  ArrowBack,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/lib/context/ToastContext';
import { ApiError } from '@/lib/api/client';
import { CountrySelectSimple } from '@/components/CountrySelect';

const steps = ['Account', 'Personal', 'Complete'];

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { showToast } = useToast();

  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    countryCode: 'US',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.email || !formData.password) {
        showToast({ message: 'Please fill in all fields', type: 'warning' });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        showToast({ message: 'Passwords do not match', type: 'error' });
        return;
      }
      if (formData.password.length < 8) {
        showToast({ message: 'Password must be at least 8 characters', type: 'warning' });
        return;
      }
    }
    if (activeStep === 1) {
      if (!formData.firstName || !formData.lastName) {
        showToast({ message: 'Please fill in your name', type: 'warning' });
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!agreed) {
      showToast({ message: 'Please agree to the terms', type: 'warning' });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );
      if (error) {
        throw error;
      }
      showToast({ message: 'Account created successfully!', type: 'success' });
      navigate('/onboarding');
    } catch (error) {
      if (error instanceof ApiError) {
        showToast({ message: error.message, type: 'error' });
      } else if (error instanceof Error) {
        showToast({ message: error.message, type: 'error' });
      } else {
        showToast({ message: 'Failed to create account', type: 'error' });
      }
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
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.5 }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.5 }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  required
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2.5 }}>
              <CountrySelectSimple
                value={formData.countryCode}
                onChange={(code) => updateField('countryCode', code)}
                label="Country"
                fullWidth
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                This helps us provide location-specific guidance and compliance information.
              </Typography>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 64, color: '#4CAF50', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Ready to Launch!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  sx={{
                    color: 'rgba(255,255,255,0.3)',
                    '&.Mui-checked': { color: '#4CAF50' },
                  }}
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{' '}
                  <Link to="/terms" style={{ color: '#4CAF50' }}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" style={{ color: '#4CAF50' }}>
                    Privacy Policy
                  </Link>
                </Typography>
              }
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={600}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              background: 'rgba(20, 20, 20, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Header */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
              Start your startup journey today
            </Typography>

            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Step Content */}
            {renderStepContent()}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
              {activeStep > 0 && (
                <GradientButton
                  variant="outline"
                  size="md"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  <ArrowBack sx={{ mr: 1, fontSize: 20 }} />
                  Back
                </GradientButton>
              )}

              {activeStep === steps.length - 1 ? (
                <GradientButton
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isLoading || !agreed}
                  animated
                >
                  {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Create Account'}
                </GradientButton>
              ) : (
                <GradientButton
                  size="lg"
                  onClick={handleNext}
                  animated
                >
                  Continue
                  <ArrowForward sx={{ ml: 1, fontSize: 20 }} />
                </GradientButton>
              )}
            </Box>

            {/* Sign In Link */}
            <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>
              Already have an account?{' '}
              <Link to="/signin" style={{ color: '#4CAF50', textDecoration: 'none', fontWeight: 600 }}>
                Sign in
              </Link>
            </Typography>

            {/* Back to Home */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.875rem' }}>
                ← Back to home
              </Link>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}
