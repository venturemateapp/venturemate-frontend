import { apiRequest } from './client';
import type { 
  DashboardData, 
  NextAction, 
  StartupActivity,
  ApiResponse 
} from '@/types/startupStack';

export interface DashboardApiResponse {
  success: boolean;
  data?: DashboardData;
  error?: {
    code: string;
    message: string;
  };
}

export const dashboardApi = {
  /**
   * Get complete dashboard data for a startup
   */
  getDashboard: (startupId: string) => 
    apiRequest<ApiResponse<DashboardData>>(`/dashboard/${startupId}`),

  /**
   * Get next actions only (lightweight)
   */
  getQuickActions: (startupId: string) =>
    apiRequest<ApiResponse<NextAction[]>>(`/dashboard/${startupId}/quick-actions`),

  /**
   * Get activity feed only
   */
  getActivityFeed: (startupId: string) =>
    apiRequest<ApiResponse<StartupActivity[]>>(`/dashboard/${startupId}/activity`),
};
