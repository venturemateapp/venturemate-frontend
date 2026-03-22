// ============================================
// ONBOARDING WIZARD TYPES
// Complete implementation per specification
// ============================================

// ============================================
// 1. WIZARD FLOW TYPES
// ============================================

export interface StartOnboardingRequest {
  source?: string;
}

export interface StartOnboardingResponse {
  session_id: string;
  current_step: number;
  progress_percentage: number;
  first_step: StepContent;
}

export interface StepContent {
  step_number: number;
  title: string;
  description: string;
  helper_text?: string;
  fields: StepField[];
}

export interface StepField {
  key: string;
  label: string;
  field_type: 'text' | 'textarea' | 'select' | 'multiselect' | 'radio' | 'checkbox';
  required: boolean;
  placeholder?: string;
  options?: FieldOption[];
  validation?: FieldValidation;
  tooltip?: string;
}

export interface FieldOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface FieldValidation {
  min_length?: number;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  pattern?: string;
}

// ============================================
// 2. STEP ANSWERS
// ============================================

export interface SaveStepAnswersRequest {
  session_id: string;
  step: number;
  answers: StepAnswers;
}

export type StepAnswers =
  | { step: 1; answers: CountrySelectionAnswers }
  | { step: 2; answers: FounderTypeAnswers }
  | { step: 3; answers: BusinessIdeaAnswers }
  | { step: 4; answers: BusinessContextAnswers }
  | { step: 5; answers: ReviewAnswers };

export interface CountrySelectionAnswers {
  country: string;
  secondary_countries?: string[];
  has_physical_presence?: boolean;
  is_digital_only?: boolean;
}

export interface FounderTypeAnswers {
  founder_type: 'solo' | 'team';
  team_size?: number;
  cofounders?: CofounderInput[];
}

export interface CofounderInput {
  email: string;
  full_name: string;
  role: string;
  equity_percentage: number;
}

export interface BusinessIdeaAnswers {
  business_idea: string;
}

export interface BusinessContextAnswers {
  target_customers?: 'b2c' | 'b2b' | 'both' | 'b2g';
  b2b_segment?: 'small' | 'medium' | 'large' | 'enterprise';
  revenue_model?: string[];
  current_stage?: 'idea' | 'mvp' | 'launched' | 'growing' | 'revenue';
  industry?: string[];
  funding_status?: 'bootstrapped' | 'friends_family' | 'angel' | 'preseed' | 'seed' | 'series_a';
  funding_amount?: number;
}

export interface ReviewAnswers {
  confirmed: boolean;
  terms_accepted: boolean;
}

// ============================================
// 3. STEP RESPONSE
// ============================================

export interface SaveStepResponse {
  success: boolean;
  next_step?: number;
  progress_percentage: number;
  next_step_content?: StepContent;
  validation_errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// ============================================
// 4. COMPLETION
// ============================================

export interface CompleteOnboardingRequest {
  session_id: string;
}

export interface CompleteOnboardingResponse {
  startup_id: string;
  startup_name: string;
  dashboard_url: string;
  processing_status: string;
  estimated_completion_seconds: number;
}

// ============================================
// 5. COUNTRY TYPES
// ============================================

export interface CountryResponse {
  name: string;
  code: string;
  currency: string;
  currency_symbol?: string;
  flag_emoji?: string;
  regulatory_complexity_score?: number;
  available_services: string[];
  supports_banking: boolean;
  supports_investor_matching: boolean;
  supports_marketplace: boolean;
}

// ============================================
// 6. CO-FOUNDER TYPES
// ============================================

export interface InviteCofounderRequest {
  startup_id?: string;
  email: string;
  full_name: string;
  role: string;
  equity: number;
}

export interface FounderInvitationResponse {
  founder_id: string;
  email: string;
  status: string;
  invitation_token: string;
  invitation_url: string;
}

export interface FounderResponse {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  equity_percentage?: number;
  status: 'invited' | 'accepted' | 'declined' | 'active' | 'removed';
  joined_at?: string;
}

// ============================================
// 7. BUSINESS IDEA TYPES
// ============================================

export interface BusinessIdeaResponse {
  id: string;
  raw_idea_text: string;
  processed_idea_text?: string;
  ai_enhanced_version?: string;
  industry?: string;
  version: number;
  is_active: boolean;
  viability_score?: number;
  created_at: string;
}

// ============================================
// 8. RESUME ONBOARDING
// ============================================

export interface ResumeOnboardingResponse {
  session_id: string;
  last_completed_step: number;
  current_step: number;
  progress_percentage: number;
  saved_answers: Record<string, unknown>;
  welcome_back_message: string;
}

// ============================================
// 9. ANALYTICS
// ============================================

export interface TrackOnboardingEventRequest {
  session_id: string;
  event_type: string;
  step_number?: number;
  event_data?: Record<string, unknown>;
  time_spent_seconds?: number;
}

// ============================================
// 10. WIZARD STATE
// ============================================

export interface OnboardingWizardState {
  session_id: string | null;
  current_step: number;
  progress_percentage: number;
  answers: {
    country?: CountrySelectionAnswers;
    founder_type?: FounderTypeAnswers;
    business_idea?: BusinessIdeaAnswers;
    business_context?: BusinessContextAnswers;
  };
  is_loading: boolean;
  is_saving: boolean;
  errors: Record<string, string>;
}

// ============================================
// 11. EXAMPLE PROMPTS (for Step 3)
// ============================================

export const BUSINESS_IDEA_EXAMPLES = [
  {
    id: 'direct_connect',
    label: 'Connect buyers & sellers',
    template: 'A platform that connects [specific group A] directly with [specific group B] to eliminate middlemen and reduce costs by [X]%.'
  },
  {
    id: 'problem_solver',
    label: 'Solve a problem I faced',
    template: 'I experienced [specific problem] when trying to [activity]. I want to build [solution] that helps others avoid this issue.'
  },
  {
    id: 'automation',
    label: 'Automate a tedious process',
    template: 'A tool that automates [manual process] for [target audience], saving them [X] hours per week.'
  },
  {
    id: 'accessibility',
    label: 'Make something more accessible',
    template: 'A service that makes [product/service] more affordable/accessible for [underserved market].'
  }
];

export const REVENUE_MODEL_OPTIONS = [
  { value: 'subscription', label: 'Subscription', description: 'Recurring monthly/yearly payments' },
  { value: 'transaction', label: 'Transaction fees', description: 'Take a cut of each transaction' },
  { value: 'advertising', label: 'Advertising', description: 'Sell ad space to third parties' },
  { value: 'marketplace', label: 'Marketplace commission', description: 'Commission on sales through platform' },
  { value: 'freemium', label: 'Freemium', description: 'Free basic version, paid premium features' },
  { value: 'licensing', label: 'Licensing', description: 'License your technology/IP' },
  { value: 'consulting', label: 'Consulting/Services', description: 'Charge for expertise/services' },
  { value: 'unsure', label: 'Not sure yet', description: 'We\'ll help you figure this out' }
];

export const INDUSTRY_OPTIONS = [
  { value: 'fintech', label: 'Fintech', icon: '💰' },
  { value: 'agriculture', label: 'Agriculture', icon: '🌾' },
  { value: 'healthtech', label: 'Healthtech', icon: '🏥' },
  { value: 'edtech', label: 'Edtech', icon: '📚' },
  { value: 'ecommerce', label: 'E-commerce', icon: '🛒' },
  { value: 'saas', label: 'SaaS', icon: '☁️' },
  { value: 'logistics', label: 'Logistics', icon: '🚚' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'food', label: 'Food & Beverage', icon: '🍽️' },
  { value: 'realestate', label: 'Real Estate', icon: '🏢' },
  { value: 'travel', label: 'Travel & Hospitality', icon: '✈️' },
  { value: 'manufacturing', label: 'Manufacturing', icon: '🏭' },
  { value: 'other', label: 'Other', icon: '💡' }
];

export const CURRENT_STAGE_OPTIONS = [
  { value: 'idea', label: 'Just an idea', description: 'Exploring the concept' },
  { value: 'mvp', label: 'Building MVP', description: 'Actively building the product' },
  { value: 'launched', label: 'Launched', description: 'Product is live with users' },
  { value: 'growing', label: 'Growing', description: 'Scaling up operations' },
  { value: 'revenue', label: 'Generating revenue', description: 'Making money' }
];

export const FUNDING_STATUS_OPTIONS = [
  { value: 'bootstrapped', label: 'Bootstrapped', description: 'Self-funded' },
  { value: 'friends_family', label: 'Friends and family', description: 'Early supporters' },
  { value: 'angel', label: 'Angel investment', description: 'Individual investors' },
  { value: 'preseed', label: 'Pre-seed', description: 'Early institutional' },
  { value: 'seed', label: 'Seed', description: 'First major round' },
  { value: 'series_a', label: 'Series A+', description: 'Growth capital' }
];

export const TARGET_CUSTOMER_OPTIONS = [
  { value: 'b2c', label: 'Consumers (B2C)', description: 'Individual customers' },
  { value: 'b2b', label: 'Businesses (B2B)', description: 'Other companies' },
  { value: 'both', label: 'Both', description: 'B2B and B2C' },
  { value: 'b2g', label: 'Government (B2G)', description: 'Public sector' }
];

export const B2B_SEGMENT_OPTIONS = [
  { value: 'small', label: 'Small businesses', description: '< 50 employees' },
  { value: 'medium', label: 'Medium businesses', description: '50-250 employees' },
  { value: 'large', label: 'Large businesses', description: '250-1000 employees' },
  { value: 'enterprise', label: 'Enterprise', description: '> 1000 employees' }
];
