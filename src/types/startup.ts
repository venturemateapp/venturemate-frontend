export interface StartupOverview {
  id: string;
  name: string;
  status: string;
  progress_percentage: number;
  health_score: number | null;
  completed_milestones?: number;
  total_milestones?: number;
  completed_approvals?: number;
  total_approvals?: number;
  connected_services?: number;
  total_services?: number;
}

export interface Startup {
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
