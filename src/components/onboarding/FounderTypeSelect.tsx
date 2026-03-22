import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Grid,
  Chip,
} from '@mui/material';
import { GradientButton } from '@/components/GradientButton';
import { ArrowForward, Add, Delete, Person, People } from '@mui/icons-material';
import type { FounderTypeAnswers, CofounderInput } from '@/types/onboardingWizard';

interface FounderTypeSelectProps {
  initialData?: FounderTypeAnswers;
  onComplete: (answers: FounderTypeAnswers) => void;
  isSaving: boolean;
  sessionId: string;
}

export const FounderTypeSelect: React.FC<FounderTypeSelectProps> = ({
  initialData,
  onComplete,
  isSaving,
}) => {
  const [founderType, setFounderType] = useState<'solo' | 'team' | null>(
    initialData?.founder_type || null
  );
  const [cofounders, setCofounders] = useState<CofounderInput[]>(
    initialData?.cofounders || []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddCofounder = () => {
    setCofounders([
      ...cofounders,
      { email: '', full_name: '', role: '', equity_percentage: 0 },
    ]);
  };

  const handleRemoveCofounder = (index: number) => {
    setCofounders(cofounders.filter((_, i) => i !== index));
  };

  const handleCofounderChange = (
    index: number,
    field: keyof CofounderInput,
    value: string | number
  ) => {
    const updated = [...cofounders];
    updated[index] = { ...updated[index], [field]: value };
    setCofounders(updated);
    
    // Clear error for this field
    if (errors[`cofounder_${index}_${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`cofounder_${index}_${field}`];
        return newErrors;
      });
    }
  };

  const validateCofounders = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    cofounders.forEach((cofounder, index) => {
      if (!cofounder.email || !cofounder.email.includes('@')) {
        newErrors[`cofounder_${index}_email`] = 'Valid email required';
        isValid = false;
      }
      if (!cofounder.full_name.trim()) {
        newErrors[`cofounder_${index}_name`] = 'Name required';
        isValid = false;
      }
      if (!cofounder.role.trim()) {
        newErrors[`cofounder_${index}_role`] = 'Role required';
        isValid = false;
      }
      if (cofounder.equity_percentage < 0 || cofounder.equity_percentage > 100) {
        newErrors[`cofounder_${index}_equity`] = 'Must be 0-100%';
        isValid = false;
      }
    });

    const totalEquity = cofounders.reduce((sum, c) => sum + c.equity_percentage, 0);
    if (totalEquity > 100) {
      newErrors['total_equity'] = `Total equity cannot exceed 100% (currently ${totalEquity}%)`;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!founderType) {
      setErrors({ founderType: 'Please select an option' });
      return;
    }

    if (founderType === 'team' && cofounders.length > 0) {
      if (!validateCofounders()) {
        return;
      }
    }

    onComplete({
      founder_type: founderType,
      team_size: founderType === 'team' ? cofounders.length + 1 : 1,
      cofounders: founderType === 'team' && cofounders.length > 0 ? cofounders : undefined,
    });
  };

  const totalEquity = cofounders.reduce((sum, c) => sum + c.equity_percentage, 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Founder Type Cards */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            onClick={() => {
              setFounderType('solo');
              setErrors({});
            }}
            sx={{
              cursor: 'pointer',
              border: 2,
              borderColor: founderType === 'solo' ? 'primary.main' : 'transparent',
              background: founderType === 'solo' 
                ? 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)'
                : 'background.paper',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.light',
                transform: 'translateY(-2px)',
                boxShadow: 2,
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Person sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Solo Founder
              </Typography>
              <Typography variant="body2" color="text.secondary">
                I'm building this alone—for now. We'll help you build systems that scale with you.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            onClick={() => {
              setFounderType('team');
              setErrors({});
            }}
            sx={{
              cursor: 'pointer',
              border: 2,
              borderColor: founderType === 'team' ? 'primary.main' : 'transparent',
              background: founderType === 'team'
                ? 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)'
                : 'background.paper',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.light',
                transform: 'translateY(-2px)',
                boxShadow: 2,
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <People sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Team
              </Typography>
              <Typography variant="body2" color="text.secondary">
                I have co-founders or team members. We'll help you set up roles, equity, and team management from day one.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {errors.founderType && (
        <Typography color="error" variant="body2" textAlign="center">
          {errors.founderType}
        </Typography>
      )}

      {/* Team Co-founders Section */}
      {founderType === 'team' && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Co-founders
            </Typography>
            <GradientButton
              startIcon={<Add />}
              onClick={handleAddCofounder}
              variant="outline"
              size="sm"
            >
              Add Co-founder
            </GradientButton>
          </Box>

          {cofounders.length === 0 ? (
            <Box
              sx={{
                p: 4,
                textAlign: 'center',
                backgroundColor: 'rgba(30, 30, 40, 0.6)',
                borderRadius: 2,
                border: 1,
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Add your co-founders or skip for now. You can invite them later.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {cofounders.map((cofounder, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    backgroundColor: 'rgba(30, 30, 40, 0.6)',
                    borderRadius: 2,
                    border: 1,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2">
                      Co-founder #{index + 1}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveCofounder(index)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="Full Name *"
                        value={cofounder.full_name}
                        onChange={(e) => handleCofounderChange(index, 'full_name', e.target.value)}
                        error={!!errors[`cofounder_${index}_name`]}
                        helperText={errors[`cofounder_${index}_name`]}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <TextField
                        fullWidth
                        label="Email *"
                        type="email"
                        value={cofounder.email}
                        onChange={(e) => handleCofounderChange(index, 'email', e.target.value)}
                        error={!!errors[`cofounder_${index}_email`]}
                        helperText={errors[`cofounder_${index}_email`]}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <TextField
                        fullWidth
                        label="Role *"
                        value={cofounder.role}
                        onChange={(e) => handleCofounderChange(index, 'role', e.target.value)}
                        error={!!errors[`cofounder_${index}_role`]}
                        helperText={errors[`cofounder_${index}_role`]}
                        size="small"
                        placeholder="CEO, CTO, etc."
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                      <TextField
                        fullWidth
                        label="Equity %"
                        type="number"
                        value={cofounder.equity_percentage || ''}
                        onChange={(e) => handleCofounderChange(index, 'equity_percentage', parseFloat(e.target.value) || 0)}
                        error={!!errors[`cofounder_${index}_equity`]}
                        helperText={errors[`cofounder_${index}_equity`]}
                        size="small"
                        inputProps={{ min: 0, max: 100 }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}

              {/* Equity Summary */}
              {cofounders.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Equity Allocated:
                  </Typography>
                  <Chip
                    label={`${totalEquity}%`}
                    color={totalEquity > 100 ? 'error' : totalEquity === 100 ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              )}

              {errors.total_equity && (
                <Typography color="error" variant="body2">
                  {errors.total_equity}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      )}

      {/* Solo founder note */}
      {founderType === 'solo' && (
        <Box
          sx={{
            p: 2,
            backgroundColor: 'info.50',
            borderRadius: 2,
            border: 1,
            borderColor: 'info.main',
          }}
        >
          <Typography variant="body2" color="info.main">
            💡 You can always add team members later from your dashboard settings.
          </Typography>
        </Box>
      )}

      {/* Next button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <GradientButton
          variant="contained"
          size="lg"
          endIcon={<ArrowForward />}
          onClick={handleSubmit}
          disabled={!founderType || isSaving}
          animated
        >
          {isSaving ? 'Saving...' : 'Continue'}
        </GradientButton>
      </Box>
    </Box>
  );
};
