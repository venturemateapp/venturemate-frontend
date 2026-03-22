import { apiRequest } from './client';
import type { StartupOverview } from '@/types/startup';

export interface StartupsApiResponse {
  success: boolean;
  data?: StartupOverview[];
  error?: {
    code: string;
    message: string;
  };
}

export const startupApi = {
  /**
   * Get all startups for the current user
   */
  getUserStartups: () =>
    apiRequest<StartupsApiResponse>('/startups'),

  /**
   * Get a single startup by ID
   */
  getStartup: (id: string) =>
    apiRequest<StartupsApiResponse>(`/startups/${id}`),

  /**
   * Create a new startup from blueprint
   */
  createStartup: (blueprint: unknown) =>
    apiRequest<StartupsApiResponse>('/startups', {
      method: 'POST',
      body: JSON.stringify(blueprint),
    }),
};
