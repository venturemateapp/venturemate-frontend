import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Chip,
  Collapse,
  IconButton,
  LinearProgress,
  Alert,
} from '@mui/material';
import { GradientButton } from '@/components/GradientButton';
import { ArrowForward, HelpOutline, Lightbulb, Close } from '@mui/icons-material';
import type { BusinessIdeaAnswers } from '@/types/onboardingWizard';
import { BUSINESS_IDEA_EXAMPLES } from '@/types/onboardingWizard';

interface BusinessIdeaInputProps {
  initialData?: BusinessIdeaAnswers;
  onComplete: (answers: BusinessIdeaAnswers) => void;
  isSaving: boolean;
}

const MIN_LENGTH = 50;
const MAX_LENGTH = 5000;

export const BusinessIdeaInput: React.FC<BusinessIdeaInputProps> = ({
  initialData,
  onComplete,
  isSaving,
}) => {
  const [idea, setIdea] = useState(initialData?.business_idea || '');
  const [showExamples, setShowExamples] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCharCount(idea.length);
  }, [idea]);

  const handleIdeaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setIdea(value);
      setError(null);
    }
  };

  const handleExampleClick = (template: string) => {
    setIdea(template);
    setShowExamples(false);
  };

  const handlePromptClick = (prompt: string) => {
    setIdea(prev => prev ? `${prev} ${prompt}` : prompt);
  };

  const handleSubmit = () => {
    // Validation
    if (idea.trim().length < MIN_LENGTH) {
      setError(`Hmm, that's a bit short. Tell us more about your big idea! (minimum ${MIN_LENGTH} characters)`);
      return;
    }

    // Check for gibberish
    const words = idea.trim().split(/\s+/);
    if (words.length < 5) {
      setError('Please provide a complete sentence with actual words.');
      return;
    }

    // Check for repeated characters (spam indicator)
    const repeatedPattern = /(.)\1{14,}/;
    if (repeatedPattern.test(idea)) {
      setError('Your idea appears to contain repeated characters. Please enter a valid business idea.');
      return;
    }

    onComplete({ business_idea: idea.trim() });
  };

  const getProgressColor = () => {
    if (charCount < 20) return 'error';
    if (charCount < MIN_LENGTH) return 'warning';
    return 'success';
  };

  const progress = Math.min((charCount / MIN_LENGTH) * 100, 100);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Character counter */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color={charCount < MIN_LENGTH ? 'warning.main' : 'success.main'}>
          {charCount < MIN_LENGTH 
            ? `Need ${MIN_LENGTH - charCount} more characters`
            : `${charCount} characters (Great!)`
          }
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Max: {MAX_LENGTH}
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={progress}
        color={getProgressColor() as any}
        sx={{ height: 4, borderRadius: 2 }}
      />

      {/* Text area */}
      <TextField
        multiline
        rows={6}
        fullWidth
        value={idea}
        onChange={handleIdeaChange}
        placeholder="I want to build an app that helps small farmers in Nigeria connect directly with buyers, eliminating middlemen and giving farmers 40% better prices for their crops..."
        error={!!error}
        helperText={error}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'grey.50',
            '& fieldset': {
              borderColor: charCount >= MIN_LENGTH ? 'success.main' : 'grey.300',
            },
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
              borderWidth: 2,
            },
          },
        }}
      />

      {/* Helper buttons */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <GradientButton
          size="sm"
          startIcon={<Lightbulb />}
          onClick={() => setShowExamples(!showExamples)}
          variant={showExamples ? 'contained' : 'outline'}
          color="secondary"
        >
          See Examples
        </GradientButton>
        <GradientButton
          size="sm"
          startIcon={<HelpOutline />}
          onClick={() => setShowPrompts(!showPrompts)}
          variant={showPrompts ? 'contained' : 'outline'}
        >
          Not Sure?
        </GradientButton>
      </Box>

      {/* Examples section */}
      <Collapse in={showExamples}>
        <Box
          sx={{
            p: 2,
            backgroundColor: 'grey.50',
            borderRadius: 2,
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2">Example Business Ideas</Typography>
            <IconButton size="small" onClick={() => setShowExamples(false)}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
          
          {BUSINESS_IDEA_EXAMPLES.map((example) => (
            <Box
              key={example.id}
              onClick={() => handleExampleClick(example.template)}
              sx={{
                p: 1.5,
                mb: 1,
                backgroundColor: 'background.paper',
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'primary.50',
                },
              }}
            >
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                {example.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {example.template}
              </Typography>
            </Box>
          ))}
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Click any example to use it as a starting point
          </Typography>
        </Box>
      </Collapse>

      {/* Idea prompts section */}
      <Collapse in={showPrompts}>
        <Box
          sx={{
            p: 2,
            backgroundColor: 'info.50',
            borderRadius: 2,
            border: 1,
            borderColor: 'info.main',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" color="info.main">
              Need Inspiration?
            </Typography>
            <IconButton size="small" onClick={() => setShowPrompts(false)}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
          
          <Typography variant="body2" gutterBottom>
            Answer these prompts to spark ideas:
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {[
              "What problem frustrates you daily?",
              "What do people complain about in your industry?",
              "What could be 10x faster or cheaper?",
              "What group is underserved by current solutions?",
              "What change would make your city/country better?",
            ].map((prompt) => (
              <Chip
                key={prompt}
                label={prompt}
                onClick={() => handlePromptClick(prompt)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'info.main',
                    color: 'info.contrastText',
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </Collapse>

      {/* Tips */}
      <Alert severity="info" icon={false} sx={{ backgroundColor: 'grey.50' }}>
        <Typography variant="body2" fontWeight="medium" gutterBottom>
          💡 Tips for a great business idea description:
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2 }}>
          <Typography component="li" variant="caption">
            What problem are you solving?
          </Typography>
          <Typography component="li" variant="caption">
            Who has this problem? (your target customers)
          </Typography>
          <Typography component="li" variant="caption">
            How does your solution work?
          </Typography>
          <Typography component="li" variant="caption">
            What makes your approach unique?
          </Typography>
        </Box>
      </Alert>

      {/* Next button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <GradientButton
          variant="contained"
          size="lg"
          endIcon={<ArrowForward />}
          onClick={handleSubmit}
          disabled={charCount < MIN_LENGTH || isSaving}
          animated
        >
          {isSaving ? 'Saving...' : 'Continue'}
        </GradientButton>
      </Box>
    </Box>
  );
};
