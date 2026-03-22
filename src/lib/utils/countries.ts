/**
 * Countries utility with flags, dial codes, and country codes
 * Used throughout the app for country selection dropdowns
 */

export interface Country {
  code: string;        // ISO 3166-1 alpha-2 (e.g., 'US', 'GB')
  name: string;        // Full country name
  dialCode: string;    // International dialing code (e.g., '+1', '+44')
  flag: string;        // Emoji flag
  currency: string;    // Default currency code
  region: string;      // Geographic region
}

// All countries with flags and dial codes
export const countries: Country[] = [
  // Africa
  { code: 'DZ', name: 'Algeria', dialCode: '+213', flag: '🇩🇿', currency: 'DZD', region: 'Africa' },
  { code: 'AO', name: 'Angola', dialCode: '+244', flag: '🇦🇴', currency: 'AOA', region: 'Africa' },
  { code: 'BJ', name: 'Benin', dialCode: '+229', flag: '🇧🇯', currency: 'XOF', region: 'Africa' },
  { code: 'BW', name: 'Botswana', dialCode: '+267', flag: '🇧🇼', currency: 'BWP', region: 'Africa' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫', currency: 'XOF', region: 'Africa' },
  { code: 'BI', name: 'Burundi', dialCode: '+257', flag: '🇧🇮', currency: 'BIF', region: 'Africa' },
  { code: 'CV', name: 'Cabo Verde', dialCode: '+238', flag: '🇨🇻', currency: 'CVE', region: 'Africa' },
  { code: 'CM', name: 'Cameroon', dialCode: '+237', flag: '🇨🇲', currency: 'XAF', region: 'Africa' },
  { code: 'CF', name: 'Central African Republic', dialCode: '+236', flag: '🇨🇫', currency: 'XAF', region: 'Africa' },
  { code: 'TD', name: 'Chad', dialCode: '+235', flag: '🇹🇩', currency: 'XAF', region: 'Africa' },
  { code: 'KM', name: 'Comoros', dialCode: '+269', flag: '🇰🇲', currency: 'KMF', region: 'Africa' },
  { code: 'CG', name: 'Congo', dialCode: '+242', flag: '🇨🇬', currency: 'XAF', region: 'Africa' },
  { code: 'CD', name: 'Congo (DRC)', dialCode: '+243', flag: '🇨🇩', currency: 'CDF', region: 'Africa' },
  { code: 'CI', name: "Cote d'Ivoire", dialCode: '+225', flag: '🇨🇮', currency: 'XOF', region: 'Africa' },
  { code: 'DJ', name: 'Djibouti', dialCode: '+253', flag: '🇩🇯', currency: 'DJF', region: 'Africa' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬', currency: 'EGP', region: 'Africa' },
  { code: 'GQ', name: 'Equatorial Guinea', dialCode: '+240', flag: '🇬🇶', currency: 'XAF', region: 'Africa' },
  { code: 'ER', name: 'Eritrea', dialCode: '+291', flag: '🇪🇷', currency: 'ERN', region: 'Africa' },
  { code: 'SZ', name: 'Eswatini', dialCode: '+268', flag: '🇸🇿', currency: 'SZL', region: 'Africa' },
  { code: 'ET', name: 'Ethiopia', dialCode: '+251', flag: '🇪🇹', currency: 'ETB', region: 'Africa' },
  { code: 'GA', name: 'Gabon', dialCode: '+241', flag: '🇬🇦', currency: 'XAF', region: 'Africa' },
  { code: 'GM', name: 'Gambia', dialCode: '+220', flag: '🇬🇲', currency: 'GMD', region: 'Africa' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭', currency: 'GHS', region: 'Africa' },
  { code: 'GN', name: 'Guinea', dialCode: '+224', flag: '🇬🇳', currency: 'GNF', region: 'Africa' },
  { code: 'GW', name: 'Guinea-Bissau', dialCode: '+245', flag: '🇬🇼', currency: 'XOF', region: 'Africa' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪', currency: 'KES', region: 'Africa' },
  { code: 'LS', name: 'Lesotho', dialCode: '+266', flag: '🇱🇸', currency: 'LSL', region: 'Africa' },
  { code: 'LR', name: 'Liberia', dialCode: '+231', flag: '🇱🇷', currency: 'LRD', region: 'Africa' },
  { code: 'LY', name: 'Libya', dialCode: '+218', flag: '🇱🇾', currency: 'LYD', region: 'Africa' },
  { code: 'MG', name: 'Madagascar', dialCode: '+261', flag: '🇲🇬', currency: 'MGA', region: 'Africa' },
  { code: 'MW', name: 'Malawi', dialCode: '+265', flag: '🇲🇼', currency: 'MWK', region: 'Africa' },
  { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱', currency: 'XOF', region: 'Africa' },
  { code: 'MR', name: 'Mauritania', dialCode: '+222', flag: '🇲🇷', currency: 'MRU', region: 'Africa' },
  { code: 'MU', name: 'Mauritius', dialCode: '+230', flag: '🇲🇺', currency: 'MUR', region: 'Africa' },
  { code: 'MA', name: 'Morocco', dialCode: '+212', flag: '🇲🇦', currency: 'MAD', region: 'Africa' },
  { code: 'MZ', name: 'Mozambique', dialCode: '+258', flag: '🇲🇿', currency: 'MZN', region: 'Africa' },
  { code: 'NA', name: 'Namibia', dialCode: '+264', flag: '🇳🇦', currency: 'NAD', region: 'Africa' },
  { code: 'NE', name: 'Niger', dialCode: '+227', flag: '🇳🇪', currency: 'XOF', region: 'Africa' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬', currency: 'NGN', region: 'Africa' },
  { code: 'RW', name: 'Rwanda', dialCode: '+250', flag: '🇷🇼', currency: 'RWF', region: 'Africa' },
  { code: 'ST', name: 'Sao Tome and Principe', dialCode: '+239', flag: '🇸🇹', currency: 'STN', region: 'Africa' },
  { code: 'SN', name: 'Senegal', dialCode: '+221', flag: '🇸🇳', currency: 'XOF', region: 'Africa' },
  { code: 'SC', name: 'Seychelles', dialCode: '+248', flag: '🇸🇨', currency: 'SCR', region: 'Africa' },
  { code: 'SL', name: 'Sierra Leone', dialCode: '+232', flag: '🇸🇱', currency: 'SLE', region: 'Africa' },
  { code: 'SO', name: 'Somalia', dialCode: '+252', flag: '🇸🇴', currency: 'SOS', region: 'Africa' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦', currency: 'ZAR', region: 'Africa' },
  { code: 'SS', name: 'South Sudan', dialCode: '+211', flag: '🇸🇸', currency: 'SSP', region: 'Africa' },
  { code: 'SD', name: 'Sudan', dialCode: '+249', flag: '🇸🇩', currency: 'SDG', region: 'Africa' },
  { code: 'TZ', name: 'Tanzania', dialCode: '+255', flag: '🇹🇿', currency: 'TZS', region: 'Africa' },
  { code: 'TG', name: 'Togo', dialCode: '+228', flag: '🇹🇬', currency: 'XOF', region: 'Africa' },
  { code: 'TN', name: 'Tunisia', dialCode: '+216', flag: '🇹🇳', currency: 'TND', region: 'Africa' },
  { code: 'UG', name: 'Uganda', dialCode: '+256', flag: '🇺🇬', currency: 'UGX', region: 'Africa' },
  { code: 'ZM', name: 'Zambia', dialCode: '+260', flag: '🇿🇲', currency: 'ZMW', region: 'Africa' },
  { code: 'ZW', name: 'Zimbabwe', dialCode: '+263', flag: '🇿🇼', currency: 'ZWL', region: 'Africa' },

  // North America
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', currency: 'CAD', region: 'North America' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', currency: 'USD', region: 'North America' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽', currency: 'MXN', region: 'North America' },

  // Central America & Caribbean
  { code: 'AG', name: 'Antigua and Barbuda', dialCode: '+1268', flag: '🇦🇬', currency: 'XCD', region: 'Caribbean' },
  { code: 'BS', name: 'Bahamas', dialCode: '+1242', flag: '🇧🇸', currency: 'BSD', region: 'Caribbean' },
  { code: 'BB', name: 'Barbados', dialCode: '+1246', flag: '🇧🇧', currency: 'BBD', region: 'Caribbean' },
  { code: 'BZ', name: 'Belize', dialCode: '+501', flag: '🇧🇿', currency: 'BZD', region: 'Central America' },
  { code: 'CR', name: 'Costa Rica', dialCode: '+506', flag: '🇨🇷', currency: 'CRC', region: 'Central America' },
  { code: 'CU', name: 'Cuba', dialCode: '+53', flag: '🇨🇺', currency: 'CUP', region: 'Caribbean' },
  { code: 'DM', name: 'Dominica', dialCode: '+1767', flag: '🇩🇲', currency: 'XCD', region: 'Caribbean' },
  { code: 'DO', name: 'Dominican Republic', dialCode: '+1809', flag: '🇩🇴', currency: 'DOP', region: 'Caribbean' },
  { code: 'SV', name: 'El Salvador', dialCode: '+503', flag: '🇸🇻', currency: 'USD', region: 'Central America' },
  { code: 'GD', name: 'Grenada', dialCode: '+1473', flag: '🇬🇩', currency: 'XCD', region: 'Caribbean' },
  { code: 'GT', name: 'Guatemala', dialCode: '+502', flag: '🇬🇹', currency: 'GTQ', region: 'Central America' },
  { code: 'HT', name: 'Haiti', dialCode: '+509', flag: '🇭🇹', currency: 'HTG', region: 'Caribbean' },
  { code: 'HN', name: 'Honduras', dialCode: '+504', flag: '🇭🇳', currency: 'HNL', region: 'Central America' },
  { code: 'JM', name: 'Jamaica', dialCode: '+1876', flag: '🇯🇲', currency: 'JMD', region: 'Caribbean' },
  { code: 'NI', name: 'Nicaragua', dialCode: '+505', flag: '🇳🇮', currency: 'NIO', region: 'Central America' },
  { code: 'PA', name: 'Panama', dialCode: '+507', flag: '🇵🇦', currency: 'PAB', region: 'Central America' },
  { code: 'KN', name: 'Saint Kitts and Nevis', dialCode: '+1869', flag: '🇰🇳', currency: 'XCD', region: 'Caribbean' },
  { code: 'LC', name: 'Saint Lucia', dialCode: '+1758', flag: '🇱🇨', currency: 'XCD', region: 'Caribbean' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', dialCode: '+1784', flag: '🇻🇨', currency: 'XCD', region: 'Caribbean' },
  { code: 'TT', name: 'Trinidad and Tobago', dialCode: '+1868', flag: '🇹🇹', currency: 'TTD', region: 'Caribbean' },

  // South America
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷', currency: 'ARS', region: 'South America' },
  { code: 'BO', name: 'Bolivia', dialCode: '+591', flag: '🇧🇴', currency: 'BOB', region: 'South America' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', currency: 'BRL', region: 'South America' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱', currency: 'CLP', region: 'South America' },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴', currency: 'COP', region: 'South America' },
  { code: 'EC', name: 'Ecuador', dialCode: '+593', flag: '🇪🇨', currency: 'USD', region: 'South America' },
  { code: 'GY', name: 'Guyana', dialCode: '+592', flag: '🇬🇾', currency: 'GYD', region: 'South America' },
  { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: '🇵🇾', currency: 'PYG', region: 'South America' },
  { code: 'PE', name: 'Peru', dialCode: '+51', flag: '🇵🇪', currency: 'PEN', region: 'South America' },
  { code: 'SR', name: 'Suriname', dialCode: '+597', flag: '🇸🇷', currency: 'SRD', region: 'South America' },
  { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: '🇺🇾', currency: 'UYU', region: 'South America' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪', currency: 'VES', region: 'South America' },

  // Europe
  { code: 'AL', name: 'Albania', dialCode: '+355', flag: '🇦🇱', currency: 'ALL', region: 'Europe' },
  { code: 'AD', name: 'Andorra', dialCode: '+376', flag: '🇦🇩', currency: 'EUR', region: 'Europe' },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹', currency: 'EUR', region: 'Europe' },
  { code: 'BY', name: 'Belarus', dialCode: '+375', flag: '🇧🇾', currency: 'BYN', region: 'Europe' },
  { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪', currency: 'EUR', region: 'Europe' },
  { code: 'BA', name: 'Bosnia and Herzegovina', dialCode: '+387', flag: '🇧🇦', currency: 'BAM', region: 'Europe' },
  { code: 'BG', name: 'Bulgaria', dialCode: '+359', flag: '🇧🇬', currency: 'BGN', region: 'Europe' },
  { code: 'HR', name: 'Croatia', dialCode: '+385', flag: '🇭🇷', currency: 'EUR', region: 'Europe' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420', flag: '🇨🇿', currency: 'CZK', region: 'Europe' },
  { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰', currency: 'DKK', region: 'Europe' },
  { code: 'EE', name: 'Estonia', dialCode: '+372', flag: '🇪🇪', currency: 'EUR', region: 'Europe' },
  { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮', currency: 'EUR', region: 'Europe' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', currency: 'EUR', region: 'Europe' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', currency: 'EUR', region: 'Europe' },
  { code: 'GR', name: 'Greece', dialCode: '+30', flag: '🇬🇷', currency: 'EUR', region: 'Europe' },
  { code: 'HU', name: 'Hungary', dialCode: '+36', flag: '🇭🇺', currency: 'HUF', region: 'Europe' },
  { code: 'IS', name: 'Iceland', dialCode: '+354', flag: '🇮🇸', currency: 'ISK', region: 'Europe' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪', currency: 'EUR', region: 'Europe' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹', currency: 'EUR', region: 'Europe' },
  { code: 'LV', name: 'Latvia', dialCode: '+371', flag: '🇱🇻', currency: 'EUR', region: 'Europe' },
  { code: 'LI', name: 'Liechtenstein', dialCode: '+423', flag: '🇱🇮', currency: 'CHF', region: 'Europe' },
  { code: 'LT', name: 'Lithuania', dialCode: '+370', flag: '🇱🇹', currency: 'EUR', region: 'Europe' },
  { code: 'LU', name: 'Luxembourg', dialCode: '+352', flag: '🇱🇺', currency: 'EUR', region: 'Europe' },
  { code: 'MT', name: 'Malta', dialCode: '+356', flag: '🇲🇹', currency: 'EUR', region: 'Europe' },
  { code: 'MD', name: 'Moldova', dialCode: '+373', flag: '🇲🇩', currency: 'MDL', region: 'Europe' },
  { code: 'MC', name: 'Monaco', dialCode: '+377', flag: '🇲🇨', currency: 'EUR', region: 'Europe' },
  { code: 'ME', name: 'Montenegro', dialCode: '+382', flag: '🇲🇪', currency: 'EUR', region: 'Europe' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱', currency: 'EUR', region: 'Europe' },
  { code: 'MK', name: 'North Macedonia', dialCode: '+389', flag: '🇲🇰', currency: 'MKD', region: 'Europe' },
  { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴', currency: 'NOK', region: 'Europe' },
  { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱', currency: 'PLN', region: 'Europe' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹', currency: 'EUR', region: 'Europe' },
  { code: 'RO', name: 'Romania', dialCode: '+40', flag: '🇷🇴', currency: 'RON', region: 'Europe' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺', currency: 'RUB', region: 'Europe' },
  { code: 'SM', name: 'San Marino', dialCode: '+378', flag: '🇸🇲', currency: 'EUR', region: 'Europe' },
  { code: 'RS', name: 'Serbia', dialCode: '+381', flag: '🇷🇸', currency: 'RSD', region: 'Europe' },
  { code: 'SK', name: 'Slovakia', dialCode: '+421', flag: '🇸🇰', currency: 'EUR', region: 'Europe' },
  { code: 'SI', name: 'Slovenia', dialCode: '+386', flag: '🇸🇮', currency: 'EUR', region: 'Europe' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸', currency: 'EUR', region: 'Europe' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪', currency: 'SEK', region: 'Europe' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭', currency: 'CHF', region: 'Europe' },
  { code: 'UA', name: 'Ukraine', dialCode: '+380', flag: '🇺🇦', currency: 'UAH', region: 'Europe' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', currency: 'GBP', region: 'Europe' },
  { code: 'VA', name: 'Vatican City', dialCode: '+379', flag: '🇻🇦', currency: 'EUR', region: 'Europe' },

  // Asia
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳', currency: 'CNY', region: 'Asia' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', currency: 'INR', region: 'Asia' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩', currency: 'IDR', region: 'Asia' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', currency: 'JPY', region: 'Asia' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷', currency: 'KRW', region: 'Asia' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬', currency: 'SGD', region: 'Asia' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭', currency: 'THB', region: 'Asia' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳', currency: 'VND', region: 'Asia' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾', currency: 'MYR', region: 'Asia' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭', currency: 'PHP', region: 'Asia' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪', currency: 'AED', region: 'Asia' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦', currency: 'SAR', region: 'Asia' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷', currency: 'TRY', region: 'Asia' },
  { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱', currency: 'ILS', region: 'Asia' },
  { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦', currency: 'QAR', region: 'Asia' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼', currency: 'KWD', region: 'Asia' },
  { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭', currency: 'BHD', region: 'Asia' },
  { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲', currency: 'OMR', region: 'Asia' },
  { code: 'JO', name: 'Jordan', dialCode: '+962', flag: '🇯🇴', currency: 'JOD', region: 'Asia' },
  { code: 'LB', name: 'Lebanon', dialCode: '+961', flag: '🇱🇧', currency: 'LBP', region: 'Asia' },
  { code: 'IQ', name: 'Iraq', dialCode: '+964', flag: '🇮🇶', currency: 'IQD', region: 'Asia' },
  { code: 'IR', name: 'Iran', dialCode: '+98', flag: '🇮🇷', currency: 'IRR', region: 'Asia' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰', currency: 'PKR', region: 'Asia' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩', currency: 'BDT', region: 'Asia' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰', currency: 'LKR', region: 'Asia' },
  { code: 'NP', name: 'Nepal', dialCode: '+977', flag: '🇳🇵', currency: 'NPR', region: 'Asia' },
  { code: 'MM', name: 'Myanmar', dialCode: '+95', flag: '🇲🇲', currency: 'MMK', region: 'Asia' },
  { code: 'KH', name: 'Cambodia', dialCode: '+855', flag: '🇰🇭', currency: 'KHR', region: 'Asia' },
  { code: 'LA', name: 'Laos', dialCode: '+856', flag: '🇱🇦', currency: 'LAK', region: 'Asia' },
  { code: 'MN', name: 'Mongolia', dialCode: '+976', flag: '🇲🇳', currency: 'MNT', region: 'Asia' },
  { code: 'KZ', name: 'Kazakhstan', dialCode: '+7', flag: '🇰🇿', currency: 'KZT', region: 'Asia' },
  { code: 'UZ', name: 'Uzbekistan', dialCode: '+998', flag: '🇺🇿', currency: 'UZS', region: 'Asia' },
  { code: 'KG', name: 'Kyrgyzstan', dialCode: '+996', flag: '🇰🇬', currency: 'KGS', region: 'Asia' },
  { code: 'TJ', name: 'Tajikistan', dialCode: '+992', flag: '🇹🇯', currency: 'TJS', region: 'Asia' },
  { code: 'TM', name: 'Turkmenistan', dialCode: '+993', flag: '🇹🇲', currency: 'TMT', region: 'Asia' },
  { code: 'AF', name: 'Afghanistan', dialCode: '+93', flag: '🇦🇫', currency: 'AFN', region: 'Asia' },
  { code: 'MV', name: 'Maldives', dialCode: '+960', flag: '🇲🇻', currency: 'MVR', region: 'Asia' },
  { code: 'BT', name: 'Bhutan', dialCode: '+975', flag: '🇧🇹', currency: 'BTN', region: 'Asia' },
  { code: 'BN', name: 'Brunei', dialCode: '+673', flag: '🇧🇳', currency: 'BND', region: 'Asia' },
  { code: 'TL', name: 'Timor-Leste', dialCode: '+670', flag: '🇹🇱', currency: 'USD', region: 'Asia' },

  // Oceania
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', currency: 'AUD', region: 'Oceania' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿', currency: 'NZD', region: 'Oceania' },
  { code: 'FJ', name: 'Fiji', dialCode: '+679', flag: '🇫🇯', currency: 'FJD', region: 'Oceania' },
  { code: 'PG', name: 'Papua New Guinea', dialCode: '+675', flag: '🇵🇬', currency: 'PGK', region: 'Oceania' },
  { code: 'SB', name: 'Solomon Islands', dialCode: '+677', flag: '🇸🇧', currency: 'SBD', region: 'Oceania' },
  { code: 'VU', name: 'Vanuatu', dialCode: '+678', flag: '🇻🇺', currency: 'VUV', region: 'Oceania' },
  { code: 'WS', name: 'Samoa', dialCode: '+685', flag: '🇼🇸', currency: 'WST', region: 'Oceania' },
  { code: 'TO', name: 'Tonga', dialCode: '+676', flag: '🇹🇴', currency: 'TOP', region: 'Oceania' },
  { code: 'KI', name: 'Kiribati', dialCode: '+686', flag: '🇰🇮', currency: 'AUD', region: 'Oceania' },
  { code: 'NR', name: 'Nauru', dialCode: '+674', flag: '🇳🇷', currency: 'AUD', region: 'Oceania' },
  { code: 'TV', name: 'Tuvalu', dialCode: '+688', flag: '🇹🇻', currency: 'AUD', region: 'Oceania' },
  { code: 'PW', name: 'Palau', dialCode: '+680', flag: '🇵🇼', currency: 'USD', region: 'Oceania' },
  { code: 'FM', name: 'Micronesia', dialCode: '+691', flag: '🇫🇲', currency: 'USD', region: 'Oceania' },
  { code: 'MH', name: 'Marshall Islands', dialCode: '+692', flag: '🇲🇭', currency: 'USD', region: 'Oceania' },
];

// Sort countries alphabetically by name
export const sortedCountries = [...countries].sort((a, b) => a.name.localeCompare(b.name));

// Get country by code
export function getCountryByCode(code: string): Country | undefined {
  return countries.find(c => c.code === code.toUpperCase());
}

// Get country by dial code
export function getCountryByDialCode(dialCode: string): Country | undefined {
  return countries.find(c => c.dialCode === dialCode);
}

// Get countries by region
export function getCountriesByRegion(region: string): Country[] {
  return countries.filter(c => c.region === region);
}

// Get all regions
export const regions = [...new Set(countries.map(c => c.region))].sort();

// Popular countries for quick selection
export const popularCountries: Country[] = [
  getCountryByCode('US')!,
  getCountryByCode('GB')!,
  getCountryByCode('CA')!,
  getCountryByCode('AU')!,
  getCountryByCode('DE')!,
  getCountryByCode('FR')!,
  getCountryByCode('IN')!,
  getCountryByCode('SG')!,
  getCountryByCode('JP')!,
  getCountryByCode('BR')!,
  getCountryByCode('ZA')!,
  getCountryByCode('NG')!,
  getCountryByCode('GH')!,
  getCountryByCode('KE')!,
];

// Default country
export const defaultCountry = getCountryByCode('US')!;

// Country dropdown options for Select components
export const countrySelectOptions = sortedCountries.map(country => ({
  value: country.code,
  label: `${country.flag} ${country.name} (${country.dialCode})`,
  ...country
}));

// Phone country options with dial codes
export const phoneCountryOptions = sortedCountries.map(country => ({
  value: country.code,
  label: `${country.flag} ${country.dialCode}`,
  dialCode: country.dialCode,
  flag: country.flag,
  name: country.name,
}));

// Currency options
export const currencyOptions = [...new Set(countries.map(c => c.currency))].sort().map(currency => ({
  value: currency,
  label: currency,
}));

// Countries with phone validation patterns (simplified)
export const phoneValidationPatterns: Record<string, RegExp> = {
  US: /^\+1\d{10}$/,
  GB: /^\+44\d{10}$/,
  CA: /^\+1\d{10}$/,
  AU: /^\+61\d{9}$/,
  DE: /^\+49\d{10}$/,
  FR: /^\+33\d{9}$/,
  IN: /^\+91\d{10}$/,
  SG: /^\+65\d{8}$/,
  JP: /^\+81\d{9}$/,
  BR: /^\+55\d{11}$/,
  ZA: /^\+27\d{9}$/,
  NG: /^\+234\d{10}$/,
  GH: /^\+233\d{9}$/,
  KE: /^\+254\d{9}$/,
};

// Validate phone number for country
export function validatePhoneForCountry(phone: string, countryCode: string): boolean {
  const pattern = phoneValidationPatterns[countryCode.toUpperCase()];
  if (!pattern) return /^\+\d{7,15}$/.test(phone); // Generic validation
  return pattern.test(phone);
}

// Format phone number with country code
export function formatPhoneWithCountry(phone: string, countryCode: string): string {
  const country = getCountryByCode(countryCode);
  if (!country) return phone;
  
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.startsWith(country.dialCode.replace('+', ''))) {
    return `+${cleanPhone}`;
  }
  return `${country.dialCode}${cleanPhone}`;
}

// Export individual country groups for convenience
export const africanCountries = getCountriesByRegion('Africa').sort((a, b) => a.name.localeCompare(b.name));
export const asianCountries = getCountriesByRegion('Asia').sort((a, b) => a.name.localeCompare(b.name));
export const europeanCountries = getCountriesByRegion('Europe').sort((a, b) => a.name.localeCompare(b.name));
export const northAmericanCountries = getCountriesByRegion('North America').sort((a, b) => a.name.localeCompare(b.name));
export const southAmericanCountries = getCountriesByRegion('South America').sort((a, b) => a.name.localeCompare(b.name));
export const oceaniaCountries = getCountriesByRegion('Oceania').sort((a, b) => a.name.localeCompare(b.name));
