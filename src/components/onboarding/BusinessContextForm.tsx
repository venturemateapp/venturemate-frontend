import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  TextField,
  Chip,
  Collapse,
  IconButton,
  Divider,
} from '@mui/material';
import { GradientButton } from '@/components/GradientButton';
import { ArrowForward, ExpandMore, ExpandLess, SkipNext } from '@mui/icons-material';
import type { BusinessContextAnswers } from '@/types/onboardingWizard';
import {
  REVENUE_MODEL_OPTIONS,
  INDUSTRY_OPTIONS,
  CURRENT_STAGE_OPTIONS,
  FUNDING_STATUS_OPTIONS,
  TARGET_CUSTOMER_OPTIONS,
  B2B_SEGMENT_OPTIONS,
} from '@/types/onboardingWizard';

interface BusinessContextFormProps {
  initialData?: BusinessContextAnswers;
  onComplete: (answers: BusinessContextAnswers) => void;
  onSkip: () => void;
  isSaving: boolean;
}

interface SectionState {
  target_customers: boolean;
  revenue_model: boolean;
  current_stage: boolean;
  industry: boolean;
  funding_status: boolean;
}

export const BusinessContextForm: React.FC<BusinessContextFormProps> = ({
  initialData,
  onComplete,
  onSkip,
  isSaving,
}) => {
  const [answers, setAnswers] = useState<BusinessContextAnswers>({
    target_customers: initialData?.target_customers,
    b2b_segment: initialData?.b2b_segment,
    revenue_model: initialData?.revenue_model || [],
    current_stage: initialData?.current_stage,
    industry: initialData?.industry || [],
    funding_status: initialData?.funding_status,
    funding_amount: initialData?.funding_amount,
  });

  const [expanded, setExpanded] = useState<SectionState>({
    target_customers: !!initialData?.target_customers,
    revenue_model: !!(initialData?.revenue_model && initialData.revenue_model.length > 0),
    current_stage: !!initialData?.current_stage,
    industry: !!(initialData?.industry && initialData.industry.length > 0),
    funding_status: !!initialData?.funding_status,
  });

  const toggleSection = (section: keyof SectionState) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleRadioChange = (field: keyof BusinessContextAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: 'revenue_model' | 'industry', value: string) => {
    setAnswers(prev => {
      const current = prev[field] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmit = () => {
    // Filter out empty values
    const cleanAnswers: BusinessContextAnswers = {};
    if (answers.target_customers) cleanAnswers.target_customers = answers.target_customers;
    if (answers.b2b_segment) cleanAnswers.b2b_segment = answers.b2b_segment;
    if (answers.revenue_model && answers.revenue_model.length > 0) cleanAnswers.revenue_model = answers.revenue_model;
    if (answers.current_stage) cleanAnswers.current_stage = answers.current_stage;
    if (answers.industry && answers.industry.length > 0) cleanAnswers.industry = answers.industry;
    if (answers.funding_status) cleanAnswers.funding_status = answers.funding_status;
    if (answers.funding_amount) cleanAnswers.funding_amount = answers.funding_amount;

    onComplete(cleanAnswers);
  };

  const SectionHeader: React.FC<{ title: string; section: keyof SectionState; isOptional?: boolean }> = ({
    title,
    section,
    isOptional = true,
  }) => (
    <Box
      onClick={() => toggleSection(section)}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 1.5,
        px: 2,
        backgroundColor: expanded[section] ? 'rgba(76, 175, 80, 0.15)' : 'rgba(30, 30, 40, 0.6)',
        borderRadius: 2,
        cursor: 'pointer',
        border: 1,
        borderColor: expanded[section] ? 'rgba(76, 175, 80, 0.5)' : 'rgba(255, 255, 255, 0.1)',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: expanded[section] ? 'rgba(76, 175, 80, 0.2)' : 'rgba(40, 40, 55, 0.7)',
        },
      }}
    >
      <Box>
        <Typography variant="subtitle2" fontWeight="medium">
          {title}
        </Typography>
        {isOptional && (
          <Typography variant="caption" color="text.secondary">
            Optional
          </Typography>
        )}
      </Box>
      <IconButton size="small">
        {expanded[section] ? <ExpandLess /> : <ExpandMore />}
      </IconButton>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Target Customers Section */}
      <SectionHeader title="Who will use your product?" section="target_customers" />
      <Collapse in={expanded.target_customers}>
        <Box sx={{ px: 2 }}>
          <FormControl component="fieldset">
            <RadioGroup
              value={answers.target_customers || ''}
              onChange={(e) => handleRadioChange('target_customers', e.target.value)}
            >
              {TARGET_CUSTOMER_OPTIONS.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body2">{option.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.description}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>

          {/* B2B Segment (conditional) */}
          {answers.target_customers === 'b2b' && (
            <Box sx={{ mt: 2, ml: 4 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Business size:
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={answers.b2b_segment || ''}
                  onChange={(e) => handleRadioChange('b2b_segment', e.target.value)}
                >
                  {B2B_SEGMENT_OPTIONS.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio size="small" />}
                      label={
                        <Box>
                          <Typography variant="body2">{option.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.description}
                          </Typography>
                        </Box>
                      }
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          )}
        </Box>
      </Collapse>

      {/* Revenue Model Section */}
      <SectionHeader title="How do you plan to make money?" section="revenue_model" />
      <Collapse in={expanded.revenue_model}>
        <Box sx={{ px: 2 }}>
          <FormGroup>
            {REVENUE_MODEL_OPTIONS.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={(answers.revenue_model || []).includes(option.value)}
                    onChange={() => handleCheckboxChange('revenue_model', option.value)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">{option.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.description}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </Box>
      </Collapse>

      {/* Current Stage Section */}
      <SectionHeader title="Where are you right now?" section="current_stage" />
      <Collapse in={expanded.current_stage}>
        <Box sx={{ px: 2 }}>
          <FormControl component="fieldset">
            <RadioGroup
              value={answers.current_stage || ''}
              onChange={(e) => handleRadioChange('current_stage', e.target.value)}
            >
              {CURRENT_STAGE_OPTIONS.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body2">{option.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.description}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
      </Collapse>

      {/* Industry Section */}
      <SectionHeader title="What industry are you in?" section="industry" />
      <Collapse in={expanded.industry}>
        <Box sx={{ px: 2 }}>
          <FormGroup>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {INDUSTRY_OPTIONS.map((option) => (
                <Chip
                  key={option.value}
                  label={`${option.icon} ${option.label}`}
                  onClick={() => handleCheckboxChange('industry', option.value)}
                  color={(answers.industry || []).includes(option.value) ? 'primary' : 'default'}
                  variant={(answers.industry || []).includes(option.value) ? 'filled' : 'outlined'}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </FormGroup>
        </Box>
      </Collapse>

      {/* Funding Status Section */}
      <SectionHeader title="Have you raised money?" section="funding_status" />
      <Collapse in={expanded.funding_status}>
        <Box sx={{ px: 2 }}>
          <FormControl component="fieldset">
            <RadioGroup
              value={answers.funding_status || ''}
              onChange={(e) => handleRadioChange('funding_status', e.target.value)}
            >
              {FUNDING_STATUS_OPTIONS.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body2">{option.label}</Typography>
                      {option.description && (
                        <Typography variant="caption" color="text.secondary">
                          {option.description}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>

          {/* Funding amount (conditional) */}
          {answers.funding_status && answers.funding_status !== 'bootstrapped' && (
            <Box sx={{ mt: 2, ml: 4 }}>
              <TextField
                label="Amount raised (USD)"
                type="number"
                size="small"
                value={answers.funding_amount || ''}
                onChange={(e) => handleRadioChange('funding_amount', e.target.value)}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
              />
            </Box>
          )}
        </Box>
      </Collapse>

      <Divider sx={{ my: 2 }} />

      {/* Action buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <GradientButton
          startIcon={<SkipNext />}
          onClick={onSkip}
          disabled={isSaving}
          variant="outline"
          size="md"
          color="inherit"
        >
          Skip All
        </GradientButton>

        <GradientButton
          variant="contained"
          size="lg"
          endIcon={<ArrowForward />}
          onClick={handleSubmit}
          disabled={isSaving}
          animated
        >
          {isSaving ? 'Saving...' : 'Continue'}
        </GradientButton>
      </Box>
    </Box>
  );
};
