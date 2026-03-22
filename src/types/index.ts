// VentureMate Type Definitions

// ==================== AUTH TYPES ====================

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  email_verified: boolean;
  phone?: string;
  country_code: string;
  timezone: string;
  subscription_tier?: string;
  onboarding_completed: boolean;
  businesses_count: number;
  created_at: string;
  updated_at: string;
  // Extended profile fields
  job_title?: string;
  company_name?: string;
  industry?: string;
  profile_visibility: 'public' | 'private' | 'connections_only';
}

export interface UserProfile {
  id: string;
  user_id: string;
  date_of_birth?: string;
  city?: string;
  job_title?: string;
  company_name?: string;
  industry?: string;
  years_of_experience?: number;
  founder_type?: 'solo_founder' | 'co_founder' | 'team_member';
  startup_experience_level?: 'first_time' | 'experienced' | 'serial';
  language_preference: string;
  email_notifications_enabled: boolean;
  marketing_emails_enabled: boolean;
  profile_visibility: 'public' | 'private' | 'connections_only';
  has_avatar: boolean;
  avatar_mime_type?: string;
}

export interface UserSession {
  id: string;
  device_info?: string;
  ip_address?: string;
  created_at: string;
  last_used_at: string;
  is_current: boolean;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface AuthResponse {
  user: User;
  tokens: TokenPair;
}

export interface SignInCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface TokenRefreshResponse {
  access_token: string;
  expires_in: number;
}

export interface VerificationStatusResponse {
  email: string;
  verified: boolean;
  resent_at?: string;
  can_resend_at?: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  timezone?: string;
  date_of_birth?: string;
  city?: string;
  job_title?: string;
  company_name?: string;
  industry?: string;
  years_of_experience?: number;
  founder_type?: 'solo_founder' | 'co_founder' | 'team_member';
  startup_experience_level?: 'first_time' | 'experienced' | 'serial';
  language_preference?: string;
  email_notifications_enabled?: boolean;
  marketing_emails_enabled?: boolean;
  profile_visibility?: 'public' | 'private' | 'connections_only';
}

export interface PasswordUpdateRequest {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  country_code: string;
}

export interface GoogleOAuthRequest {
  id_token: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordUpdateRequest {
  token: string;
  new_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

// ==================== BUSINESS TYPES ====================

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  industry: string;
  sub_industry?: string;
  country_code: string;
  city?: string;
  status: 'draft' | 'active' | 'archived' | 'deleted';
  stage: 'idea' | 'validation' | 'mvp' | 'early_traction' | 'growth' | 'scaling';
  legal_structure?: string;
  registration_number?: string;
  founded_date?: string;
  tax_id?: string;
  website_url?: string;
  custom_domain?: string;
  health_score?: number;
  logo_url?: string;
  brand_colors?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface CreateBusinessRequest {
  name: string;
  industry: string;
  country_code: string;
  description?: string;
}

export interface UpdateBusinessRequest {
  name?: string;
  tagline?: string;
  description?: string;
  industry?: string;
  city?: string;
  website_url?: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  notes?: string;
}

export interface ChecklistCategory {
  name: string;
  progress: number;
  items: ChecklistItem[];
}

export interface BusinessChecklist {
  overall_progress: number;
  categories: ChecklistCategory[];
}

// ==================== AI STARTUP ENGINE TYPES ====================

export interface ProcessStartupRequest {
  business_id?: string;
  onboarding_data: OnboardingData;
}

export interface OnboardingData {
  business_idea: string;
  country: string;
  founder_type: string;
  optional_context?: OptionalContext;
}

export interface OptionalContext {
  target_customers?: string;
  industry?: string;
  revenue_model?: string;
  problem_statement?: string;
  solution_description?: string;
}

export interface ProcessStartupResponse {
  generation_id: string;
  status: string;
  estimated_time: number;
  message: string;
}

export interface GenerationStatusResponse {
  generation_id: string;
  status: string;
  blueprint?: StartupBlueprint;
  created_at: string;
  completed_at?: string;
}

export interface StartupBlueprint {
  business_identity: BusinessIdentity;
  market_intelligence: MarketIntelligence;
  business_model: BusinessModel;
  compliance_requirements: ComplianceRequirements;
  ai_confidence: AiConfidence;
  suggested_next_steps: string[];
  generation_metadata: GenerationMetadata;
}

export interface BusinessIdentity {
  business_name: string;
  alternative_names: string[];
  tagline: string;
  elevator_pitch: string;
  mission_statement: string;
  vision_statement: string;
}

export interface MarketIntelligence {
  industry: string;
  sub_industry?: string;
  value_proposition: string;
  problem_statement: string;
  solution_description: string;
  target_customers: string;
  target_customer_description: string;
  market_size_estimate: string;
  competitive_advantage: string;
  key_challenges: string[];
}

export interface BusinessModel {
  primary_revenue_model: string;
  primary_model_description: string;
  secondary_revenue_models: RevenueModel[];
  pricing_suggestions?: Record<string, any>;
}

export interface RevenueModel {
  model: string;
  description: string;
}

export interface ComplianceRequirements {
  country: string;
  registrations: RegistrationRequirement[];
  total_estimated_timeline: number;
  total_estimated_cost: number;
}

export interface RegistrationRequirement {
  name: string;
  authority: string;
  timeline_days: number;
  cost_estimate: number;
  priority: number;
  documents_required: string[];
  condition?: string;
}

export interface AiConfidence {
  overall_score: number;
  industry_classification: number;
  revenue_model: number;
  business_name: number;
}

export interface GenerationMetadata {
  model_used: string;
  processing_time_ms: number;
  tokens_used: number;
  generated_at: string;
}

export interface RegenerateFieldRequest {
  startup_id: string;
  field: string;
  context?: string;
}

export interface IndustryDefinition {
  id: string;
  industry_code: string;
  industry_name: string;
  description?: string;
  classification_keywords: string[];
  primary_revenue_models: string[];
  secondary_revenue_models: string[];
  typical_startup_costs?: {
    min: number;
    max: number;
    currency: string;
  };
  average_time_to_revenue_months?: number;
}

export interface RegulatoryRequirement {
  id: string;
  country_code: string;
  country_name: string;
  requirement_type: 'registration' | 'license' | 'permit' | 'tax' | 'compliance' | 'certification';
  requirement_name: string;
  description?: string;
  applicable_industries: string[];
  applicable_business_types: string[];
  estimated_time_days?: number;
  estimated_cost_min?: number;
  estimated_cost_max?: number;
  currency?: string;
  required_documents: string[];
  authority_name?: string;
  authority_website?: string;
  authority_contact_email?: string;
  authority_contact_phone?: string;
  is_mandatory: boolean;
  priority: number;
  condition_note?: string;
}

// ==================== ONBOARDING TYPES ====================

export interface OnboardingSession {
  session_id: string;
  current_step: string;
  progress_percentage: number;
  steps: OnboardingStep[];
}

export interface OnboardingStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface IdeaIntakeRequest {
  session_id: string;
  business_idea: string;
  problem_statement: string;
  target_customers: string;
  country_code: string;
  city: string;
  founder_type: 'solo' | 'team';
  team_size: number;
  has_cofounder: boolean;
}

export interface AiAnalysis {
  industry: string;
  sub_industry: string;
  market_size: string;
  complexity: 'low' | 'medium' | 'high';
  estimated_launch_time: string;
  suggested_business_models: string[];
}

export interface IdeaIntakeResponse {
  session_id: string;
  ai_analysis: AiAnalysis;
  next_step: string;
  progress_percentage: number;
}

export interface FounderProfileRequest {
  session_id: string;
  experience_level: 'first_time' | 'some' | 'experienced';
  background: string;
  skills: string[];
  availability: 'full_time' | 'part_time' | 'side_hustle';
  funding_preference: 'bootstrap' | 'seeking_investment';
  motivation: string;
  challenges: string[];
}

export interface BusinessDetailsRequest {
  session_id: string;
  preferred_business_name: string;
  alternative_names: string[];
  business_model: string;
  revenue_streams: string[];
  initial_funding: number;
  currency: string;
  timeline: string;
  legal_structure_preference: string;
}

// ==================== AI TYPES ====================

export interface AIJob {
  id: string;
  job_type: 'business_plan' | 'pitch_deck' | 'one_pager' | 'logo' | 'branding_kit' | 'website' | 'content';
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  result?: any;
  created_at: string;
  completed_at?: string;
}

export interface GenerateBusinessPlanRequest {
  template?: string;
  sections?: string[];
  language?: string;
  include_financials?: boolean;
}

export interface GeneratePitchDeckRequest {
  template?: string;
  audience?: string;
  slides_count?: number;
  include_financials?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

// ==================== DOCUMENT TYPES ====================

export interface Document {
  id: string;
  business_id?: string;
  user_id: string;
  blob_id?: string;
  name: string;
  mime_type?: string;
  file_size?: number;
  folder_id?: string;
  description?: string;
  document_type?: string;
  visibility: 'private' | 'shared' | 'public';
  created_at: string;
  updated_at: string;
}

export interface Folder {
  id: string;
  business_id: string;
  name: string;
  parent_id?: string;
  document_count: number;
  created_at: string;
}

export interface DocumentShare {
  id: string;
  upload_id: string;
  share_token: string;
  allow_download: boolean;
  allow_preview: boolean;
  expires_at?: string;
  max_downloads?: number;
  download_count: number;
  created_at: string;
}

export interface ShareDocumentRequest {
  expiry_days?: number;
  password?: string;
  allow_download?: boolean;
  allow_preview?: boolean;
  max_downloads?: number;
}

// ==================== WEBSITE TYPES ====================

export interface Website {
  id: string;
  business_id: string;
  subdomain: string;
  custom_domain?: string;
  domain_status: 'not_connected' | 'pending_dns' | 'active' | 'ssl_pending' | 'error';
  template_id?: string;
  template_config?: Record<string, any>;
  global_styles?: Record<string, any>;
  status: 'draft' | 'published' | 'unpublished';
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  analytics_config?: Record<string, any>;
  pages: WebsitePage[];
  published_at?: string;
  last_modified_at: string;
  created_at: string;
}

export interface WebsitePage {
  id: string;
  page_key: string;
  name: string;
  slug: string;
  sections: PageSection[];
  is_enabled: boolean;
  is_homepage: boolean;
  seo_title?: string;
  seo_description?: string;
}

export interface PageSection {
  id: string;
  type: string;
  content: Record<string, any>;
}

export interface WebsiteTemplate {
  id: string;
  code: string;
  name: string;
  description?: string;
  category?: string;
  features: string[];
  is_premium: boolean;
}

// ==================== SUBSCRIPTION TYPES ====================

export interface SubscriptionPlan {
  id: string;
  code: string;
  name: string;
  description?: string;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  features: string[];
  limits: {
    businesses: number;
    ai_generations_per_month: number;
    storage_gb: number;
    website_pages: number;
  };
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid' | 'trialing';
  billing_interval: 'month' | 'year';
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  description?: string;
  subtotal: number;
  tax_amount: number;
  total: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  invoice_date: string;
  due_date?: string;
  paid_at?: string;
  pdf_url?: string;
}

// ==================== CRM TYPES (Phase 2) ====================

export interface Contact {
  id: string;
  business_id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  job_title?: string;
  contact_type: 'lead' | 'customer' | 'partner' | 'investor';
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed_won' | 'closed_lost';
  source?: string;
  notes?: string;
  tags: string[];
  custom_fields: Record<string, any>;
  last_contacted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  business_id: string;
  contact_id?: string;
  title: string;
  description?: string;
  value?: number;
  currency: string;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  probability: number;
  expected_close_date?: string;
  actual_close_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  business_id: string;
  contact_id?: string;
  deal_id?: string;
  activity_type: 'call' | 'email' | 'meeting' | 'task' | 'note';
  title: string;
  description?: string;
  scheduled_at?: string;
  completed_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CrmDashboardStats {
  total_contacts: number;
  total_deals: number;
  total_pipeline_value: number;
  deals_by_stage: StageCount[];
  recent_activities: Activity[];
}

export interface StageCount {
  stage: string;
  count: number;
  total_value: number;
}

// ==================== BANKING TYPES (Phase 2) ====================

export interface BankAccount {
  id: string;
  business_id: string;
  bank_name: string;
  bank_code?: string;
  account_type: 'checking' | 'savings' | 'merchant';
  account_number: string;
  account_name: string;
  currency: string;
  country_code: string;
  balance?: number;
  status: 'pending' | 'active' | 'frozen' | 'closed';
  is_verified: boolean;
  created_at: string;
}

export interface PaymentTransaction {
  id: string;
  business_id: string;
  transaction_type: 'incoming' | 'outgoing' | 'transfer';
  amount: number;
  currency: string;
  description?: string;
  reference?: string;
  counterparty_name?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'reversed';
  processed_at?: string;
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  business_id: string;
  invoice_number: string;
  customer_name: string;
  customer_email?: string;
  amount_total: number;
  currency: string;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
  issue_date: string;
  due_date: string;
  paid_at?: string;
}

export interface BankingDashboard {
  total_balance: number;
  currency: string;
  accounts: BankAccount[];
  recent_transactions: PaymentTransaction[];
  pending_invoices: number;
  overdue_invoices: number;
  monthly_revenue: number;
  monthly_expenses: number;
}

// ==================== SOCIAL MEDIA TYPES (Phase 2) ====================

export interface SocialMediaAccount {
  id: string;
  business_id: string;
  platform: 'instagram' | 'twitter' | 'linkedin' | 'facebook' | 'tiktok';
  account_handle?: string;
  account_url?: string;
  status: 'pending' | 'connected' | 'disconnected';
  follower_count?: number;
  post_count?: number;
  engagement_rate?: number;
  ai_content_enabled: boolean;
  content_tone?: string;
  created_at: string;
}

export interface ContentCalendarItem {
  id: string;
  business_id: string;
  social_account_id?: string;
  content_type: 'post' | 'story' | 'reel' | 'thread';
  status: 'draft' | 'scheduled' | 'published' | 'cancelled';
  title?: string;
  content?: string;
  scheduled_at?: string;
  published_at?: string;
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  created_at: string;
}

export interface AiGeneratedPost {
  content: string;
  hashtags: string[];
  suggested_images: string[];
  best_posting_time: string;
  predicted_engagement: string;
}

export interface SocialDashboard {
  total_accounts: number;
  total_followers: number;
  scheduled_posts: number;
  published_posts: number;
  engagement_rate: number;
}

// ==================== MARKETPLACE TYPES (Phase 2 & 3) ====================

export interface ServiceProvider {
  id: string;
  user_id?: string;
  company_name: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  email: string;
  phone?: string;
  country_code: string;
  city?: string;
  is_verified: boolean;
  rating: number;
  review_count: number;
  completed_projects: number;
}

export interface MarketplaceService {
  id: string;
  provider_id: string;
  title: string;
  description?: string;
  category: string;
  pricing_model?: string;
  price_from?: number;
  price_to?: number;
  currency: string;
  delivery_time_days?: number;
  images: string[];
  is_active: boolean;
  order_count: number;
}

export interface ServiceBooking {
  id: string;
  business_id: string;
  service_id: string;
  user_id: string;
  requirements: string;
  agreed_price?: number;
  currency?: string;
  status: 'inquiry' | 'quoted' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  requested_at: string;
  deadline?: string;
}

// ==================== INVESTOR TYPES (Phase 3) ====================

export interface InvestorProfile {
  id: string;
  user_id: string;
  investor_type: 'angel' | 'vc' | 'family_office' | 'corporate' | 'accelerator';
  firm_name?: string;
  bio?: string;
  website_url?: string;
  linkedin_url?: string;
  location?: string;
  preferred_countries: string[];
  investment_stage: string[];
  check_size_min?: number;
  check_size_max?: number;
  currency: string;
  preferred_industries: string[];
  thesis?: string;
  value_add?: string;
  is_verified: boolean;
}

export interface InvestorMatch {
  id: string;
  business_id: string;
  investor_id: string;
  match_score: number;
  match_reasons: string[];
  status: 'pending' | 'viewed' | 'interested' | 'passed' | 'connected' | 'pitched' | 'invested';
  business_pitch?: string;
  investor_notes?: string;
  meeting_scheduled_at?: string;
  created_at: string;
}

export interface DataRoom {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  access_code?: string;
  is_public: boolean;
  expires_at?: string;
  view_count: number;
  download_count: number;
  created_at: string;
}

export interface MatchmakingStats {
  total_investors: number;
  matched_investors: number;
  pending_pitches: number;
  interested_investors: number;
  meetings_scheduled: number;
  match_rate: number;
}

// ==================== CREDIT SCORE TYPES (Phase 3) ====================

export interface CreditScore {
  id: string;
  business_id: string;
  overall_score: number;
  score_grade: string;
  risk_level: 'low' | 'moderate' | 'high' | 'very_high';
  payment_history_score: number;
  financial_stability_score: number;
  business_viability_score: number;
  compliance_score: number;
  market_position_score: number;
  suggested_credit_limit?: number;
  currency: string;
  calculated_at: string;
  expires_at: string;
}

export interface CreditScoreHistory {
  id: string;
  business_id: string;
  score: number;
  score_grade: string;
  change_from_previous: number;
  reason?: string;
  recorded_at: string;
}

export interface FinancingOffer {
  id: string;
  provider_name: string;
  provider_type: 'bank' | 'fintech' | 'investor';
  offer_type: 'loan' | 'credit_line' | 'invoice_financing' | 'revenue_based';
  title: string;
  description?: string;
  min_amount?: number;
  max_amount: number;
  currency: string;
  interest_rate_min?: number;
  interest_rate_max?: number;
  term_months_min?: number;
  term_months_max?: number;
  required_credit_score_min?: number;
}

export interface FinancingApplication {
  id: string;
  business_id: string;
  offer_id: string;
  requested_amount: number;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'funded';
  submitted_at?: string;
  decision_at?: string;
}

// ==================== HEALTH SCORE TYPES (Phase 3) ====================

export interface StartupHealthScore {
  id: string;
  business_id: string;
  overall_score: number;
  grade: string;
  components: HealthComponents;
  recommendations: HealthRecommendation[];
  priority_actions: PriorityAction[];
  calculated_at: string;
}

export interface HealthComponents {
  compliance: ComponentScore;
  revenue_viability: ComponentScore;
  market_fit: ComponentScore;
  team_structure: ComponentScore;
  financial_sustainability: ComponentScore;
  digital_presence: ComponentScore;
}

export interface ComponentScore {
  score: number;
  max_score: number;
  grade: string;
  status: 'excellent' | 'good' | 'needs_work' | 'critical';
}

export interface HealthRecommendation {
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'easy' | 'medium' | 'hard';
}

export interface PriorityAction {
  action_id: string;
  title: string;
  description: string;
  urgency: 'urgent' | 'high' | 'medium' | 'low';
  estimated_time: string;
  action_type: string;
  action_url?: string;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page: number;
    per_page: number;
    total: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// ==================== UI TYPES ====================

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: number;
  children?: NavItem[];
}
