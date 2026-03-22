import type { StartupOverview } from './startup';

// Re-export from startup types
export type { StartupOverview };

// ============================================
// PROGRESS & HEALTH SCORE
// ============================================

export interface StartupProgressResponse {
  startup_id: string;
  overall_percentage: number;
  completed_milestones: number;
  total_milestones: number;
  completed_approvals: number;
  total_approvals: number;
  connected_services: number;
  total_services: number;
  health_score: number | null;
}

export interface StartupHealthScoreBreakdown {
  compliance_score: number;
  milestone_progress: number;
  document_completeness: number;
  service_integration: number;
  time_efficiency: number;
  overall_health_score: number;
}

// ============================================
// DASHBOARD COMPONENTS
// ============================================

export interface NextAction {
  action_id: string;
  action_type: 'milestone' | 'approval' | 'document' | 'service' | 'learning';
  title: string;
  description: string | null;
  priority: number; // 1 = High, 2 = Medium, 3 = Low
  due_date: string | null;
  status: string;
  action_url: string;
  metadata: string | null;
}

export interface StartupActivity {
  activity_type: 'milestone_completed' | 'approval_updated' | 'service_connected' | 'document_generated';
  description: string;
  occurred_at: string;
  metadata: Record<string, unknown>;
}

export interface UpcomingDeadline {
  startup_id: string;
  startup_name: string;
  milestone_id: string;
  milestone_title: string;
  due_date: string | null;
  status: string;
  urgency: 'overdue' | 'this_week' | 'upcoming';
}

export interface QuickStats {
  approvals_completed: number | null;
  approvals_total: number | null;
  documents_uploaded: number | null;
  documents_total: number | null;
  services_connected: number | null;
}

// ============================================
// DASHBOARD DATA
// ============================================

export interface DashboardData {
  startup: StartupOverview;
  health_score: number;
  progress: StartupProgressResponse;
  next_actions: NextAction[];
  activity_feed: StartupActivity[];
  upcoming_deadlines: UpcomingDeadline[];
  quick_stats: QuickStats;
}

// ============================================
// API RESPONSES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface StartupResponse {
  id: string;
  user_id: string;
  name: string;
  alternative_names: string[];
  tagline: string | null;
  elevator_pitch: string | null;
  mission_statement: string | null;
  vision_statement: string | null;
  industry: string | null;
  sub_industry: string | null;
  country: string;
  secondary_countries: string[];
  founder_type: string;
  business_stage: string;
  status: string;
  progress_percentage: number;
  health_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface MilestoneResponse {
  id: string;
  title: string;
  description: string | null;
  category: 'legal' | 'branding' | 'technical' | 'financial' | 'marketing' | 'operations';
  order_sequence: number;
  estimated_days: number | null;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  due_date: string | null;
  completed_at: string | null;
  dependencies: string[];
}

export interface ApprovalResponse {
  id: string;
  name: string;
  approval_type: string;
  issuing_authority: string | null;
  status: 'not_started' | 'in_progress' | 'approved' | 'rejected' | 'expired';
  priority: number;
  estimated_days: number | null;
  estimated_cost: number | null;
  submission_date: string | null;
  approval_date: string | null;
  documents_required: string[];
  documents_submitted: string[];
}

export interface ServiceResponse {
  id: string;
  service_category: string;
  service_name: string;
  service_provider: string | null;
  description: string | null;
  features: string[];
  pricing_model: string | null;
  price_range: string | null;
  website_url: string | null;
  is_partner: boolean;
  partnership_benefits: string | null;
  priority: number;
  status: 'suggested' | 'connected' | 'dismissed';
}

export interface DocumentResponse {
  id: string;
  document_type: string;
  document_name: string;
  file_url: string | null;
  version: number;
  status: 'generating' | 'ready' | 'expired' | 'archived';
  generated_at: string | null;
}

// ============================================
// REQUEST TYPES
// ============================================

export interface CreateStartupRequest {
  user_id: string;
  name: string;
  alternative_names?: string[];
  tagline?: string;
  elevator_pitch?: string;
  mission_statement?: string;
  vision_statement?: string;
  industry?: string;
  sub_industry?: string;
  country: string;
  secondary_countries?: string[];
  founder_type: string;
}

export interface UpdateStartupRequest {
  name?: string;
  tagline?: string;
  elevator_pitch?: string;
  mission_statement?: string;
  vision_statement?: string;
  industry?: string;
  sub_industry?: string;
  business_stage?: string;
  status?: string;
}

export interface UpdateMilestoneRequest {
  status?: string;
  started_at?: string;
  completed_at?: string;
  notes?: string;
}

export interface UpdateApprovalRequest {
  status?: string;
  reference_number?: string;
  submission_date?: string;
  approval_date?: string;
  actual_cost?: number;
  notes?: string;
}

export interface ConnectServiceRequest {
  integration_data?: Record<string, unknown>;
}

export interface MilestoneFilter {
  status?: string;
  category?: string;
}

export interface ServiceFilter {
  status?: string;
  category?: string;
}

// ============================================
// AI BLUEPRINT
// ============================================

export interface AiBlueprint {
  business_name: string;
  alternative_names: string[];
  tagline?: string;
  elevator_pitch?: string;
  mission_statement?: string;
  vision_statement?: string;
  industry: string;
  sub_industry?: string;
  country: string;
  milestones: AiMilestone[];
  approvals: AiApproval[];
  services: AiServiceSuggestion[];
}

export interface AiMilestone {
  title: string;
  description: string;
  category: string;
  estimated_days: number;
  dependencies: string[];
}

export interface AiApproval {
  name: string;
  approval_type: string;
  issuing_authority: string;
  estimated_days: number;
  documents_required: string[];
}

export interface AiServiceSuggestion {
  category: string;
  name: string;
  provider: string;
  description: string;
}

// ============================================
// GENERATION RESPONSES
// ============================================

export interface GenerateStartupStackResponse {
  startup_id: string;
  milestones_created: number;
  approvals_created: number;
  services_suggested: number;
  documents_queued: number;
}
