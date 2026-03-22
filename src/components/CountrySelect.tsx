import {
  TextField,
  MenuItem,
  Box,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import { sortedCountries, getCountryByCode } from '@/lib/utils/countries';

interface CountrySelectProps {
  value: string;
  onChange: (code: string) => void;
  label?: string;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium';
  sx?: object;
  showDialCode?: boolean;
}

// Simple Select version
export function CountrySelectSimple({
  value,
  onChange,
  label = 'Country',
  fullWidth = true,
  required = false,
  disabled = false,
  size = 'medium',
  sx = {},
}: CountrySelectProps) {
  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth={fullWidth}
      required={required}
      disabled={disabled}
      size={size}
      sx={sx}
      SelectProps={{
        renderValue: (selected: unknown) => {
          const country = getCountryByCode(selected as string);
          if (!country) return selected as string;
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>{country.flag}</span>
              <span>{country.name}</span>
            </Box>
          );
        },
      }}
    >
      {sortedCountries.map((country) => (
        <MenuItem key={country.code} value={country.code}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <span>{country.flag}</span>
            <span>{country.name}</span>
          </Box>
        </MenuItem>
      ))}
    </TextField>
  );
}

// Autocomplete version with search
export function CountrySelect({
  value,
  onChange,
  label = 'Country',
  fullWidth = true,
  required = false,
  disabled = false,
  size = 'medium',
  sx = {},
}: CountrySelectProps) {
  const selectedCountry = getCountryByCode(value);

  return (
    <Autocomplete
      options={sortedCountries}
      value={selectedCountry || null}
      onChange={(_, newValue) => onChange(newValue?.code || '')}
      getOptionLabel={(option) => `${option.flag} ${option.name}`}
      fullWidth={fullWidth}
      disabled={disabled}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            py: 1,
          }}
        >
          <span style={{ fontSize: '1.3em' }}>{option.flag}</span>
          <span>{option.name}</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', marginLeft: 'auto', fontSize: '0.9em' }}>
            {option.dialCode}
          </span>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          size={size}
          sx={sx}
          InputProps={{
            ...params.InputProps,
            startAdornment: selectedCountry ? (
              <InputAdornment position="start">
                <span style={{ fontSize: '1.3em' }}>{selectedCountry.flag}</span>
              </InputAdornment>
            ) : null,
          }}
        />
      )}
    />
  );
}

// Phone input with country code
export function CountryPhoneSelect({
  value,
  onChange,
  label = 'Phone Number',
  fullWidth = true,
  required = false,
  disabled = false,
  size = 'medium',
  sx = {},
}: CountrySelectProps) {
  const selectedCountry = getCountryByCode(value);
  const dialCodeValue = value.startsWith('+') ? value : selectedCountry?.dialCode || '';

  return (
    <TextField
      label={label}
      value={dialCodeValue}
      onChange={(e) => onChange(e.target.value)}
      fullWidth={fullWidth}
      required={required}
      disabled={disabled}
      size={size}
      sx={sx}
      InputProps={{
        startAdornment: selectedCountry ? (
          <InputAdornment position="start">
            <span style={{ fontSize: '1.2em' }}>{selectedCountry.flag}</span>
            <span style={{ marginLeft: 4, color: 'rgba(255,255,255,0.7)' }}>
              {selectedCountry.dialCode}
            </span>
          </InputAdornment>
        ) : null,
      }}
    />
  );
}

export default CountrySelectSimple;
