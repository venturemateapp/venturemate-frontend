import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import { GradientButton } from '@/components/GradientButton';
import { ArrowForward } from '@mui/icons-material';
import { onboardingWizardApi } from '@/lib/api/client';
import type { CountrySelectionAnswers, CountryResponse } from '@/types/onboardingWizard';

interface CountrySelectProps {
  initialData?: CountrySelectionAnswers;
  onComplete: (answers: CountrySelectionAnswers) => void;
  isSaving: boolean;
}

const MAX_SECONDARY_COUNTRIES = 5;

export const CountrySelect: React.FC<CountrySelectProps> = ({
  initialData,
  onComplete,
  isSaving,
}) => {
  const [countries, setCountries] = useState<CountryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string>(initialData?.country || '');
  const [secondaryCountries, setSecondaryCountries] = useState<string[]>(initialData?.secondary_countries || []);
  const [presence, setPresence] = useState<string>(
    initialData?.is_digital_only ? 'digital' : initialData?.has_physical_presence ? 'physical' : ''
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setIsLoading(true);
        const data = await onboardingWizardApi.getSupportedCountries();
        setCountries(data);
      } catch (err) {
        setError('Failed to load countries. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCountries();
  }, []);

  const handleSubmit = () => {
    if (!selectedCountry) {
      setError('Please select a country');
      return;
    }

    setError(null);
    onComplete({
      country: selectedCountry,
      secondary_countries: secondaryCountries.length > 0 ? secondaryCountries : undefined,
      has_physical_presence: presence === 'physical',
      is_digital_only: presence === 'digital',
    });
  };

  const handleSecondaryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string[];
    if (value.length <= MAX_SECONDARY_COUNTRIES) {
      setSecondaryCountries(value);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const selectedCountryData = countries.find(c => c.code === selectedCountry);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Primary Country Selection */}
      <FormControl fullWidth error={!!error && !selectedCountry}>
        <InputLabel id="country-label">Primary Country *</InputLabel>
        <Select
          labelId="country-label"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          label="Primary Country *"
          renderValue={(selected) => {
            const country = countries.find(c => c.code === selected);
            return country ? `${country.flag_emoji || '🌍'} ${country.name}` : '';
          }}
        >
          {countries.map((country) => (
            <MenuItem key={country.code} value={country.code}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{country.flag_emoji || '🌍'}</span>
                <span>{country.name}</span>
                {country.regulatory_complexity_score && (
                  <Chip
                    size="small"
                    label={`Complexity: ${country.regulatory_complexity_score}/10`}
                    color={country.regulatory_complexity_score > 7 ? 'warning' : 'default'}
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          This is where your business will be legally registered
        </FormHelperText>
      </FormControl>

      {/* Selected Country Info */}
      {selectedCountryData && (
        <Box
          sx={{
            p: 2,
            backgroundColor: 'grey.50',
            borderRadius: 2,
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Selected: {selectedCountryData.flag_emoji} {selectedCountryData.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Currency: {selectedCountryData.currency_symbol} {selectedCountryData.currency}
          </Typography>
          {selectedCountryData.supports_banking && (
            <Chip size="small" label="Banking Available" color="success" sx={{ mt: 1, mr: 1 }} />
          )}
          {selectedCountryData.supports_investor_matching && (
            <Chip size="small" label="Investor Matching" color="primary" sx={{ mt: 1, mr: 1 }} />
          )}
          {selectedCountryData.supports_marketplace && (
            <Chip size="small" label="Marketplace" color="info" sx={{ mt: 1 }} />
          )}
        </Box>
      )}

      {/* Secondary Countries */}
      <FormControl fullWidth>
        <InputLabel id="secondary-countries-label">Additional Countries (Optional)</InputLabel>
        <Select
          labelId="secondary-countries-label"
          multiple
          value={secondaryCountries}
          onChange={handleSecondaryChange as any}
          input={<OutlinedInput label="Additional Countries (Optional)" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(selected as string[]).map((value) => {
                const country = countries.find(c => c.code === value);
                return (
                  <Chip
                    key={value}
                    label={`${country?.flag_emoji || '🌍'} ${country?.name}`}
                    size="small"
                  />
                );
              })}
            </Box>
          )}
        >
          {countries
            .filter(c => c.code !== selectedCountry)
            .map((country) => (
              <MenuItem key={country.code} value={country.code}>
                <Checkbox checked={secondaryCountries.indexOf(country.code) > -1} />
                <ListItemText
                  primary={`${country.flag_emoji || '🌍'} ${country.name}`}
                  secondary={`${country.currency} ${country.supports_banking ? '• Banking' : ''}`}
                />
              </MenuItem>
            ))}
        </Select>
        <FormHelperText>
          Select up to {MAX_SECONDARY_COUNTRIES} additional countries where you'll operate
          {secondaryCountries.length > 0 && ` (${secondaryCountries.length}/${MAX_SECONDARY_COUNTRIES})`}
        </FormHelperText>
      </FormControl>

      {/* Physical Presence */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Business Presence
        </Typography>
        <RadioGroup
          value={presence}
          onChange={(e) => setPresence(e.target.value)}
        >
          <FormControlLabel
            value="physical"
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body1">Physical office/location</Typography>
                <Typography variant="caption" color="text.secondary">
                  We have or plan to have a physical location
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="digital"
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body1">Digital-only</Typography>
                <Typography variant="caption" color="text.secondary">
                  Fully online business with no physical location
                </Typography>
              </Box>
            }
          />
        </RadioGroup>
      </Box>

      {/* Error message */}
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      {/* Next button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <GradientButton
          variant="contained"
          size="lg"
          endIcon={<ArrowForward />}
          onClick={handleSubmit}
          disabled={!selectedCountry || isSaving}
          animated
        >
          {isSaving ? 'Saving...' : 'Continue'}
        </GradientButton>
      </Box>
    </Box>
  );
};
