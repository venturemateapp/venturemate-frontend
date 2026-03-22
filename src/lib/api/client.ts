const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function refreshToken(): Promise<string | null> {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return null;
    }

    const data = await response.json();
    if (data.success && data.data) {
      localStorage.setItem('access_token', data.data.access_token);
      localStorage.setItem('refresh_token', data.data.refresh_token);
      return data.data.access_token;
    }
    return null;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  const token = localStorage.getItem('access_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    let response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      const newToken = await refreshToken();
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, {
          ...options,
          headers,
        });
      } else {
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/signin';
        }
        throw new ApiError('UNAUTHORIZED', 'Session expired. Please sign in again.', 401);
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error?.code || 'UNKNOWN_ERROR',
        errorData.error?.message || 'An unexpected error occurred',
        response.status,
        errorData.error?.details
      );
    }

    const responseData = await response.json();
    
    // Backend wraps responses in {success, data, error} format
    if (responseData.success && responseData.data !== undefined) {
      return responseData.data;
    }
    
    // If not wrapped, return as-is
    return responseData;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('NETWORK_ERROR', 'Network error. Please check your connection.');
  }
}

// ============================================================================
// AUTH API
// ============================================================================

export const authApi = {
  signUp: (credentials: { email: string; password: string; first_name: string; last_name: string; country_code: string }) =>
    apiRequest<{ user: any; tokens: { access_token: string; refresh_token: string } }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  signIn: (credentials: { email: string; password: string; remember_me?: boolean }) =>
    apiRequest<{ user: any; tokens: { access_token: string; refresh_token: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  googleAuthUrl: () =>
    apiRequest<{ auth_url: string }>('/auth/google'),

  googleCallback: (code: string, state: string) =>
    apiRequest<{ user: any; tokens: { access_token: string; refresh_token: string } }>(`/auth/google/callback?code=${code}&state=${state}`),

  signOut: () =>
    apiRequest<void>('/auth/logout', {
      method: 'POST',
    }),

  // Password reset
  forgotPassword: (email: string) =>
    apiRequest<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, newPassword: string, confirmPassword: string) =>
    apiRequest<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, new_password: newPassword, confirm_password: confirmPassword }),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiRequest<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    }),

  // User status
  getMe: () =>
    apiRequest<{ user: any }>('/auth/status'),

  // Email verification
  verifyEmail: (token: string) =>
    apiRequest<{ message: string }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  resendVerification: (email: string) =>
    apiRequest<{ email: string; verified: boolean; resent_at?: string; can_resend_at?: string }>('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

// ============================================================================
// USERS API (NEW)
// ============================================================================

export const usersApi = {
  getProfile: () =>
    apiRequest<any>('/users/me'),

  updateProfile: (data: any) =>
    apiRequest<any>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return apiRequest<{ message: string }>('/users/me/avatar', {
      method: 'POST',
      body: formData as any,
      headers: {}, // Let browser set content-type for multipart
    });
  },

  getAvatar: () =>
    fetch(`${API_BASE_URL}/users/me/avatar`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    }).then(r => r.blob()),

  deleteAccount: () =>
    apiRequest<void>('/users/me', {
      method: 'DELETE',
    }),

  // Session management
  getSessions: () =>
    apiRequest<{ sessions: any[] }>('/users/me/sessions'),

  revokeSession: (sessionId: string) =>
    apiRequest<void>(`/users/me/sessions/${sessionId}`, {
      method: 'DELETE',
    }),
};

// ============================================================================
// AI STARTUP ENGINE API
// ============================================================================

export const aiStartupApi = {
  processStartup: (data: {
    business_id?: string;
    onboarding_data: {
      business_idea: string;
      country: string;
      founder_type: string;
      optional_context?: {
        target_customers?: string;
        industry?: string;
        revenue_model?: string;
      };
    };
  }) =>
    apiRequest<{
      generation_id: string;
      status: string;
      estimated_time: number;
      message: string;
    }>('/ai/process-startup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getStatus: (generationId: string) =>
    apiRequest<{
      generation_id: string;
      status: string;
      blueprint?: {
        business_identity: {
          business_name: string;
          alternative_names: string[];
          tagline: string;
          elevator_pitch: string;
          mission_statement: string;
          vision_statement: string;
        };
        market_intelligence: {
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
        };
        business_model: {
          primary_revenue_model: string;
          primary_model_description: string;
          secondary_revenue_models: { model: string; description: string }[];
        };
        compliance_requirements: {
          country: string;
          registrations: {
            name: string;
            authority: string;
            timeline_days: number;
            cost_estimate: number;
            priority: number;
            documents_required: string[];
            condition?: string;
          }[];
          total_estimated_timeline: number;
          total_estimated_cost: number;
        };
        ai_confidence: {
          overall_score: number;
          industry_classification: number;
          revenue_model: number;
          business_name: number;
        };
        suggested_next_steps: string[];
      };
      created_at: string;
      completed_at?: string;
    }>(`/ai/status/${generationId}`),

  regenerateField: (field: string, data: {
    startup_id: string;
    context?: string;
  }) =>
    apiRequest<any>(`/ai/regenerate/${field}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  listIndustries: () =>
    apiRequest<{ industries: any[] }>('/ai/industries'),

  getRegulatoryRequirements: (countryCode: string, industry?: string) => {
    const query = industry ? `?industry=${encodeURIComponent(industry)}` : '';
    return apiRequest<{
      country: string;
      industry?: string;
      requirements: any[];
    }>(`/ai/regulatory/${countryCode}${query}`);
  },
};

// ============================================================================
// BUSINESS API
// ============================================================================

export const businessApi = {
  getAll: (page = 1, perPage = 20) =>
    apiRequest<{ businesses: any[]; meta: any }>(`/businesses?page=${page}&per_page=${perPage}`),

  getById: (id: string) =>
    apiRequest<{ business: any }>(`/businesses/${id}`),

  // Note: Backend doesn't have slug endpoint - may need to add
  getBySlug: (slug: string) =>
    apiRequest<{ business: any }>(`/businesses/slug/${slug}`),

  create: (data: { name: string; industry: string; country_code: string; description?: string }) =>
    apiRequest<{ business: any }>('/businesses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest<{ business: any }>(`/businesses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<void>(`/businesses/${id}`, {
      method: 'DELETE',
    }),

  getChecklist: (id: string) =>
    apiRequest<{ checklist: any }>(`/businesses/${id}/checklist`),

  // FIXED: Backend uses /businesses/{id}/checklist/{item_id} (no /items/)
  updateChecklistItem: (id: string, itemId: string, data: { completed: boolean; notes?: string }) =>
    apiRequest<{ item: any }>(`/businesses/${id}/checklist/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // NEW: List industries
  getIndustries: () =>
    apiRequest<{ industries: string[] }>('/businesses/industries'),
};

// ============================================================================
// ONBOARDING API
// ============================================================================

export const onboardingApi = {
  start: () =>
    apiRequest<{ session: any }>('/onboarding/start', {
      method: 'POST',
    }),

  submitIdeaIntake: (data: any) =>
    apiRequest<{ ai_analysis: any; next_step: string; progress_percentage: number }>('/onboarding/idea-intake', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  submitFounderProfile: (data: any) =>
    apiRequest<{ next_step: string; progress_percentage: number }>('/onboarding/founder-profile', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  submitBusinessDetails: (data: any) =>
    apiRequest<{ business: any; ai_recommendations: any; next_step: string; progress_percentage: number }>('/onboarding/business-details', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // NEW: Complete onboarding review
  completeOnboarding: (data: { session_id: string; confirm: boolean }) =>
    apiRequest<{ business: any; onboarding_completed: boolean }>('/onboarding/review', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getStatus: () =>
    apiRequest<{ session: any }>('/onboarding/status'),
};

// ============================================================================
// AI GENERATION API
// ============================================================================

export const aiApi = {
  // Business plan, pitch deck, one-pager are under /businesses/{id}/generate/
  generateBusinessPlan: (businessId: string, data?: any) =>
    apiRequest<{ content: any; status: string }>(`/businesses/${businessId}/generate/business-plan`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    }),

  generatePitchDeck: (businessId: string, data?: any) =>
    apiRequest<{ content: any; status: string }>(`/businesses/${businessId}/generate/pitch-deck`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    }),

  generateOnePager: (businessId: string, data?: any) =>
    apiRequest<{ content: any; status: string }>(`/businesses/${businessId}/generate/one-pager`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    }),

  regenerateSection: (businessId: string, data: { section: string; prompt?: string }) =>
    apiRequest<{ content: any }>(`/businesses/${businessId}/generate/regenerate`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Branding endpoints under /businesses/{id}/branding/
  generateLogoOptions: (businessId: string, data?: any) =>
    apiRequest<{ logos: any[] }>(`/businesses/${businessId}/branding/generate-logos`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    }),

  selectLogo: (businessId: string, logoId: string) =>
    apiRequest<{ logo_url: string }>(`/businesses/${businessId}/branding/select-logo`, {
      method: 'POST',
      body: JSON.stringify({ logo_id: logoId }),
    }),

  generateColorPalette: (businessId: string, mood?: string, baseColor?: string) =>
    apiRequest<{ palette: any }>(`/businesses/${businessId}/branding/generate-colors`, {
      method: 'POST',
      body: JSON.stringify({ mood, base_color: baseColor }),
    }),

  updateBrandColors: (businessId: string, colors: Record<string, string>) =>
    apiRequest<{ colors: any }>(`/businesses/${businessId}/branding/colors`, {
      method: 'PUT',
      body: JSON.stringify(colors),
    }),

  getBrandGuidelines: (businessId: string) =>
    apiRequest<{ guidelines: any }>(`/businesses/${businessId}/branding/guidelines`),

  // Job status under /generation-jobs/
  // FIXED: Backend uses /generation-jobs/{job_id}
  getJobStatus: (jobId: string) =>
    apiRequest<{ job_id: string; status: string; progress: number }>(`/generation-jobs/${jobId}`),

  // AI Chat - NOT IMPLEMENTED IN BACKEND
  // These are stub implementations that will fail until backend adds them
  sendChatMessage: async (_businessId: string, _message: string, _conversationId?: string) => {
    console.warn('AI Chat not implemented in backend yet');
    return { response: 'AI Chat coming soon!', conversation_id: 'stub' };
  },

  getChatHistory: async (_businessId: string, _conversationId?: string) => {
    console.warn('AI Chat not implemented in backend yet');
    return { messages: [], conversation_id: 'stub' };
  },
};

// ============================================================================
// DOCUMENT VAULT API - FIXED PATHS
// Backend uses: /businesses/{business_id}/documents
// ============================================================================

export const documentsApi = {
  // FIXED: Backend uses /businesses/{id}/documents (not /documents)
  getAll: (businessId: string, page = 1, perPage = 20) =>
    apiRequest<{ documents: any[]; meta: any }>(`/businesses/${businessId}/documents?page=${page}&per_page=${perPage}`),

  // FIXED: Backend uses /businesses/{id}/documents/{doc_id}
  getById: (businessId: string, documentId: string) =>
    apiRequest<{ document: any }>(`/businesses/${businessId}/documents/${documentId}`),

  // FIXED: Backend uses /businesses/{id}/documents with multipart
  uploadFile: async (businessId: string, file: File, folderId?: string, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) formData.append('folder_id', folderId);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            onProgress((e.loaded / e.total) * 100);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new ApiError('UPLOAD_ERROR', 'Failed to upload file'));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new ApiError('UPLOAD_ERROR', 'Failed to upload file'));
      });

      xhr.open('POST', `${API_BASE_URL}/businesses/${businessId}/documents`);
      const token = localStorage.getItem('access_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.send(formData);
    });
  },

  // FIXED: Backend uses PATCH (not PUT)
  update: (businessId: string, documentId: string, data: { name?: string; folder_id?: string; description?: string }) =>
    apiRequest<{ document: any }>(`/businesses/${businessId}/documents/${documentId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // FIXED: Backend uses /businesses/{id}/documents/{doc_id}
  delete: (businessId: string, documentId: string) =>
    apiRequest<void>(`/businesses/${businessId}/documents/${documentId}`, {
      method: 'DELETE',
    }),

  // FIXED: Backend uses /businesses/{id}/documents/{doc_id}/download
  download: (businessId: string, documentId: string) =>
    apiRequest<{ url: string }>(`/businesses/${businessId}/documents/${documentId}/download`),

  // Folders - FIXED paths
  getFolders: (businessId: string, parentId?: string) => {
    const query = parentId ? `?parent_id=${parentId}` : '';
    return apiRequest<{ folders: any[] }>(`/businesses/${businessId}/documents/folders${query}`);
  },

  createFolder: (businessId: string, name: string, parentId?: string) =>
    apiRequest<{ folder: any }>(`/businesses/${businessId}/documents/folders`, {
      method: 'POST',
      body: JSON.stringify({ name, parent_id: parentId }),
    }),

  deleteFolder: (businessId: string, folderId: string) =>
    apiRequest<void>(`/businesses/${businessId}/documents/folders/${folderId}`, {
      method: 'DELETE',
    }),

  // Tags
  getTags: (businessId: string) =>
    apiRequest<{ tags: any[] }>(`/businesses/${businessId}/documents/tags`),

  createTag: (businessId: string, name: string, color?: string) =>
    apiRequest<{ tag: any }>(`/businesses/${businessId}/documents/tags`, {
      method: 'POST',
      body: JSON.stringify({ name, color }),
    }),

  // Sharing
  share: (businessId: string, documentId: string, data: { expiry_days?: number; password?: string; allow_download?: boolean }) =>
    apiRequest<{ share_token: string; share_url: string; expires_at?: string }>(`/businesses/${businessId}/documents/${documentId}/share`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Access shared document (public)
  accessShared: (token: string, password?: string) =>
    apiRequest<any>(`/share/${token}${password ? `?password=${password}` : ''}`),

  // Templates
  getTemplates: (countryCode?: string) =>
    apiRequest<{ templates: any[] }>(`/businesses/${countryCode || 'US'}/documents/templates`),
};

// ============================================================================
// WEBSITE BUILDER API - FIXED PATHS
// Backend uses: /businesses/{business_id}/website
// ============================================================================

export const websiteApi = {
  // FIXED: Backend uses /businesses/{id}/website (not /websites)
  getByBusinessId: (businessId: string) =>
    apiRequest<{ website: any }>(`/businesses/${businessId}/website`),

  // FIXED: Backend uses /businesses/{id}/website (POST)
  create: (businessId: string, data: { template_code?: string; subdomain?: string; custom_domain?: string }) =>
    apiRequest<{ website: any }>(`/businesses/${businessId}/website`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // FIXED: Backend uses PATCH (not PUT)
  update: (businessId: string, data: any) =>
    apiRequest<{ website: any }>(`/businesses/${businessId}/website`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // FIXED: Backend uses /businesses/{id}/website (DELETE)
  delete: (businessId: string) =>
    apiRequest<void>(`/businesses/${businessId}/website`, {
      method: 'DELETE',
    }),

  // Publishing
  publish: (businessId: string, subdomain?: string) =>
    apiRequest<{ website: any }>(`/businesses/${businessId}/website/publish`, {
      method: 'POST',
      body: JSON.stringify({ subdomain }),
    }),

  unpublish: (businessId: string) =>
    apiRequest<{ website: any }>(`/businesses/${businessId}/website/unpublish`, {
      method: 'POST',
    }),

  // Domain management
  connectDomain: (businessId: string, domain: string) =>
    apiRequest<{ domain_status: string }>(`/businesses/${businessId}/website/domain`, {
      method: 'POST',
      body: JSON.stringify({ domain }),
    }),

  checkDomainStatus: (businessId: string) =>
    apiRequest<{ status: string; ssl_status?: string }>(`/businesses/${businessId}/website/domain/status`),

  // Pages
  getPage: (businessId: string, pageId: string) =>
    apiRequest<{ page: any }>(`/businesses/${businessId}/website/pages/${pageId}`),

  updatePage: (businessId: string, pageId: string, data: any) =>
    apiRequest<{ page: any }>(`/businesses/${businessId}/website/pages/${pageId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Asset upload
  uploadAsset: async (businessId: string, file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            onProgress((e.loaded / e.total) * 100);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new ApiError('UPLOAD_ERROR', 'Failed to upload asset'));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new ApiError('UPLOAD_ERROR', 'Failed to upload asset'));
      });

      xhr.open('POST', `${API_BASE_URL}/businesses/${businessId}/website/assets`);
      const token = localStorage.getItem('access_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.send(formData);
    });
  },

  // Templates - These are at /website/templates (not business-scoped)
  getTemplates: () =>
    apiRequest<{ templates: any[] }>('/website/templates'),

  getTemplate: (code: string) =>
    apiRequest<{ template: any }>(`/website/templates/${code}`),

  // Preview (public)
  preview: (subdomain: string) =>
    fetch(`${API_BASE_URL}/preview/${subdomain}`).then(r => r.text()),
};

// ============================================================================
// SUBSCRIPTION API - FIXED PATHS
// ============================================================================

export const subscriptionApi = {
  getPlans: () =>
    apiRequest<{ plans: any[] }>('/subscriptions/plans'),

  // FIXED: Backend uses /subscriptions/me (not /subscriptions/current)
  getCurrent: () =>
    apiRequest<{ subscription: any }>('/subscriptions/me'),

  // FIXED: Backend uses /subscriptions (not /subscriptions/checkout)
  create: (planCode: string, interval: 'month' | 'year') =>
    apiRequest<{ subscription: any }>('/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ plan_code: planCode, interval }),
    }),

  // NEW: Cancel subscription
  cancel: (cancelAtPeriodEnd = true) =>
    apiRequest<{ message: string }>(`/subscriptions?cancel_at_period_end=${cancelAtPeriodEnd}`, {
      method: 'DELETE',
    }),

  getInvoices: () =>
    apiRequest<{ invoices: any[] }>('/subscriptions/invoices'),

  // NEW: Get payment methods
  getPaymentMethods: () =>
    apiRequest<{ methods: any[] }>('/subscriptions/payment-methods'),
};

// ============================================================================
// CRM API - Phase 2
// ============================================================================

export const crmApi = {
  getDashboard: () =>
    apiRequest<{ total_contacts: number; total_deals: number; total_pipeline_value: number; deals_by_stage: any[]; recent_activities: any[] }>('/crm/dashboard'),

  // Contacts
  getContacts: (page = 1, perPage = 20) =>
    apiRequest<{ data: any[]; meta: any }>(`/crm/contacts?page=${page}&per_page=${perPage}`),

  createContact: (data: { name: string; email?: string; phone?: string; company?: string; job_title?: string; contact_type: string; source?: string; notes?: string }) =>
    apiRequest<{ data: any }>('/crm/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateContact: (id: string, data: any) =>
    apiRequest<{ data: any }>(`/crm/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteContact: (id: string) =>
    apiRequest<void>(`/crm/contacts/${id}`, { method: 'DELETE' }),

  // Deals
  getDeals: (page = 1, perPage = 20) =>
    apiRequest<{ data: any[]; meta: any }>(`/crm/deals?page=${page}&per_page=${perPage}`),

  createDeal: (data: { title: string; contact_id?: string; value?: number; currency?: string; stage: string; probability?: number; expected_close_date?: string }) =>
    apiRequest<{ data: any }>('/crm/deals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateDeal: (id: string, data: any) =>
    apiRequest<{ data: any }>(`/crm/deals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateDealStage: (id: string, stage: string) =>
    apiRequest<{ data: any }>(`/crm/deals/${id}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({ stage }),
    }),

  // Activities
  getActivities: (page = 1, perPage = 20) =>
    apiRequest<{ data: any[]; meta: any }>(`/crm/activities?page=${page}&per_page=${perPage}`),

  createActivity: (data: { contact_id?: string; deal_id?: string; activity_type: string; title: string; description?: string; scheduled_at?: string }) =>
    apiRequest<{ data: any }>('/crm/activities', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  completeActivity: (id: string) =>
    apiRequest<{ data: any }>(`/crm/activities/${id}/complete`, { method: 'POST' }),
};

// ============================================================================
// BANKING API - Phase 2
// ============================================================================

export const bankingApi = {
  getDashboard: () =>
    apiRequest<{ total_balance: number; currency: string; accounts: any[]; recent_transactions: any[]; pending_invoices: number; overdue_invoices: number; monthly_revenue: number; monthly_expenses: number }>('/banking/dashboard'),

  // Accounts
  getAccounts: () =>
    apiRequest<{ data: any[] }>('/banking/accounts'),

  createAccount: (data: { bank_name: string; bank_code?: string; account_type: string; account_number: string; account_name: string; currency: string; country_code: string; branch_code?: string; swift_code?: string; iban?: string }) =>
    apiRequest<{ data: any }>('/banking/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteAccount: (id: string) =>
    apiRequest<void>(`/banking/accounts/${id}`, { method: 'DELETE' }),

  // Transactions
  getTransactions: (page = 1, perPage = 20) =>
    apiRequest<{ data: any[]; meta: any }>(`/banking/transactions?page=${page}&per_page=${perPage}`),

  // Integrations
  getIntegrations: () =>
    apiRequest<{ data: any[] }>('/banking/integrations'),

  connectIntegration: (data: { provider: string; api_key: string; webhook_secret?: string; settings?: any }) =>
    apiRequest<{ data: any }>('/banking/integrations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  disconnectIntegration: (id: string) =>
    apiRequest<void>(`/banking/integrations/${id}`, { method: 'DELETE' }),

  // Invoices
  getInvoices: (page = 1, perPage = 20) =>
    apiRequest<{ data: any[]; meta: any }>(`/banking/invoices?page=${page}&per_page=${perPage}`),

  createInvoice: (data: { customer_name: string; customer_email?: string; customer_address?: string; due_date: string; line_items: any[]; notes?: string }) =>
    apiRequest<{ data: any }>('/banking/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  sendInvoice: (id: string) =>
    apiRequest<{ data: any }>(`/banking/invoices/${id}/send`, { method: 'POST' }),

  recordPayment: (id: string, data: { amount: number; payment_method: string; reference?: string }) =>
    apiRequest<{ data: any }>(`/banking/invoices/${id}/record-payment`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Supported options
  getSupportedBanks: () =>
    apiRequest<{ data: any[] }>('/banking/supported-banks'),

  getSupportedProviders: () =>
    apiRequest<{ data: any[] }>('/banking/supported-providers'),
};

// ============================================================================
// SOCIAL MEDIA API - Phase 2
// ============================================================================

export const socialApi = {
  getDashboard: () =>
    apiRequest<{ total_accounts: number; total_followers: number; scheduled_posts: number; published_posts: number; engagement_rate: number }>('/social/dashboard'),

  // Accounts
  getAccounts: () =>
    apiRequest<{ data: any[] }>('/social/accounts'),

  connectAccount: (data: { platform: string; auth_code: string; redirect_uri: string }) =>
    apiRequest<{ data: any }>('/social/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  disconnectAccount: (id: string) =>
    apiRequest<void>(`/social/accounts/${id}`, { method: 'DELETE' }),

  toggleAiContent: (id: string) =>
    apiRequest<{ data: any }>(`/social/accounts/${id}/toggle-ai`, { method: 'POST' }),

  // Content Calendar
  getContentCalendar: (status?: string) => {
    const query = status ? `?status=${status}` : '';
    return apiRequest<{ data: any[] }>(`/social/content-calendar${query}`);
  },

  createContent: (data: { social_account_id?: string; content_type: string; topic?: string; tone?: string; ai_generate?: boolean }) =>
    apiRequest<{ data: any }>('/social/content-calendar', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  scheduleContent: (id: string, data: { scheduled_at: string; timezone: string }) =>
    apiRequest<{ data: any }>(`/social/content-calendar/${id}/schedule`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  publishContent: (id: string) =>
    apiRequest<{ data: any }>(`/social/content-calendar/${id}/publish`, { method: 'POST' }),

  deleteContent: (id: string) =>
    apiRequest<void>(`/social/content-calendar/${id}`, { method: 'DELETE' }),

  // AI Content Generation
  generateAiContent: (data: { social_account_id?: string; content_type: string; topic?: string; tone?: string }) =>
    apiRequest<{ content: string; hashtags: string[]; suggested_images: string[]; best_posting_time: string; predicted_engagement: string }>('/social/generate-content', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================================================
// MARKETPLACE API - Phase 2 & 3
// ============================================================================

export const marketplaceApi = {
  // Services
  getServices: (category?: string) => {
    const query = category ? `?category=${category}` : '';
    return apiRequest<{ data: any[] }>(`/marketplace/services${query}`);
  },

  getService: (id: string) =>
    apiRequest<{ data: any }>(`/marketplace/services/${id}`),

  createService: (data: { service_id: string; requirements: string; attachments?: string[]; agreed_price?: number; deadline?: string }) =>
    apiRequest<{ data: any }>('/marketplace/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  bookService: (id: string, data: { requirements: string; attachments?: string[]; agreed_price?: number; deadline?: string }) =>
    apiRequest<{ data: any }>(`/marketplace/services/${id}/book`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCategories: () =>
    apiRequest<{ data: any[] }>('/marketplace/categories'),

  // Bookings
  getBookings: () =>
    apiRequest<{ data: any[] }>('/marketplace/bookings'),

  getBooking: (id: string) =>
    apiRequest<{ data: any }>(`/marketplace/bookings/${id}`),

  updateBookingStatus: (id: string, status: string) =>
    apiRequest<{ data: any }>(`/marketplace/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Providers
  getProviders: () =>
    apiRequest<{ data: any[] }>('/marketplace/providers'),

  // My listings
  getMyServices: () =>
    apiRequest<{ data: any[] }>('/marketplace/my-services'),

  getMyBookings: () =>
    apiRequest<{ data: any[] }>('/marketplace/my-bookings'),
};

// ============================================================================
// INVESTOR MATCHMAKING API - Phase 3
// ============================================================================

export const investorApi = {
  getProfile: () =>
    apiRequest<{ data: any }>('/investors/profile'),

  createProfile: (data: { investor_type: string; firm_name?: string; bio: string; website_url?: string; linkedin_url?: string; location?: string; preferred_countries: string[]; investment_stage: string[]; check_size_min?: number; check_size_max?: number; currency?: string; preferred_industries: string[]; thesis?: string; value_add?: string }) =>
    apiRequest<{ data: any }>('/investors/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProfile: (data: any) =>
    apiRequest<{ data: any }>('/investors/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  searchInvestors: (data?: { stages?: string[]; industries?: string[]; countries?: string[]; min_check_size?: number; max_check_size?: number }) =>
    apiRequest<{ data: any[] }>('/investors/search', {
      method: 'POST',
      body: JSON.stringify(data || {}),
    }),

  getMatches: () =>
    apiRequest<{ data: any[] }>('/investors/matches'),

  submitPitch: (id: string, data: { pitch_message: string }) =>
    apiRequest<{ data: any }>(`/investors/matches/${id}/pitch`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateMatchStatus: (id: string, status: string) =>
    apiRequest<{ data: any }>(`/investors/matches/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getStats: () =>
    apiRequest<{ total_investors: number; matched_investors: number; pending_pitches: number; interested_investors: number; meetings_scheduled: number; match_rate: number }>('/investors/stats'),

  // Data Rooms
  getDataRooms: () =>
    apiRequest<{ data: any[] }>('/investors/data-rooms'),

  createDataRoom: (data: { name: string; description?: string; is_public?: boolean; expires_at?: string }) =>
    apiRequest<{ data: any }>('/investors/data-rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  addDocumentToDataRoom: (id: string, data: { document_id: string; folder_path?: string }) =>
    apiRequest<{ data: any }>(`/investors/data-rooms/${id}/documents`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  grantAccess: (id: string, data: { investor_id?: string; email?: string; access_type?: string; expires_at?: string }) =>
    apiRequest<{ data: any }>(`/investors/data-rooms/${id}/grant-access`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================================================
// CREDIT SCORING API - Phase 3
// ============================================================================

export const creditApi = {
  getDashboard: () =>
    apiRequest<{ current_score: any; score_history: any[]; available_offers: any[]; active_applications: any[]; credit_utilization: any }>('/credit/dashboard'),

  getCreditScore: () =>
    apiRequest<{ data: any }>('/credit/score'),

  calculateScore: (force = false) =>
    apiRequest<{ data: any }>('/credit/score/calculate', {
      method: 'POST',
      body: JSON.stringify({ force_recalculate: force }),
    }),

  getScoreHistory: () =>
    apiRequest<{ data: any[] }>('/credit/history'),

  getCreditReport: () =>
    apiRequest<{ data: any }>('/credit/report'),

  // Financing Offers
  getFinancingOffers: () =>
    apiRequest<{ data: any[] }>('/credit/offers'),

  // Applications
  getApplications: () =>
    apiRequest<{ data: any[] }>('/credit/applications'),

  getApplication: (id: string) =>
    apiRequest<{ data: any }>(`/credit/applications/${id}`),

  applyForFinancing: (data: { offer_id: string; requested_amount: number; application_data?: any }) =>
    apiRequest<{ data: any }>('/credit/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================================================
// HEALTH SCORE API - Phase 3
// ============================================================================

export const healthApi = {
  getHealthScore: () =>
    apiRequest<{ data: any }>('/health/score'),

  calculateHealthScore: () =>
    apiRequest<{ data: any }>('/health/score/calculate', { method: 'POST' }),

  getRecommendations: () =>
    apiRequest<{ data: any[] }>('/health/recommendations'),

  dismissRecommendation: (id: string, reason: string) =>
    apiRequest<{ data: any }>(`/health/recommendations/${id}/dismiss`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  takeRecommendationAction: (id: string, params?: any) =>
    apiRequest<{ data: any }>(`/health/recommendations/${id}/action`, {
      method: 'POST',
      body: JSON.stringify({ action_params: params || {} }),
    }),

  getDashboardSummary: () =>
    apiRequest<{ data: any }>('/health/dashboard'),
};

// ============================================================================
// ONBOARDING WIZARD API - Full Implementation per Spec
// ============================================================================

import type {
  StartOnboardingResponse,
  StepContent,
  SaveStepResponse,
  CountrySelectionAnswers,
  FounderTypeAnswers,
  BusinessIdeaAnswers,
  BusinessContextAnswers,
  ReviewAnswers,
  CompleteOnboardingResponse,
  ResumeOnboardingResponse,
  CountryResponse,
  InviteCofounderRequest,
  FounderInvitationResponse,
  FounderResponse,
  TrackOnboardingEventRequest,
} from '@/types/onboardingWizard';

export const onboardingWizardApi = {
  // Start onboarding wizard
  startWizard: (source?: string) =>
    apiRequest<StartOnboardingResponse>('/onboarding/wizard/start', {
      method: 'POST',
      body: JSON.stringify({ source }),
    }),

  // Resume existing onboarding session
  resumeWizard: (sessionId: string) =>
    apiRequest<ResumeOnboardingResponse>(`/onboarding/wizard/resume?session_id=${sessionId}`),

  // Get step content
  getStepContent: (stepNumber: number, sessionId: string) =>
    apiRequest<StepContent>(`/onboarding/wizard/step/${stepNumber}?session_id=${sessionId}`),

  // Save step 1: Country selection
  saveCountrySelection: (sessionId: string, answers: CountrySelectionAnswers) =>
    apiRequest<SaveStepResponse>('/onboarding/wizard/step', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        step: 1,
        answers: { country: answers.country, secondary_countries: answers.secondary_countries, has_physical_presence: answers.has_physical_presence, is_digital_only: answers.is_digital_only }
      }),
    }),

  // Save step 2: Founder type
  saveFounderType: (sessionId: string, answers: FounderTypeAnswers) =>
    apiRequest<SaveStepResponse>('/onboarding/wizard/step', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        step: 2,
        answers: { founder_type: answers.founder_type, team_size: answers.team_size, cofounders: answers.cofounders }
      }),
    }),

  // Save step 3: Business idea
  saveBusinessIdea: (sessionId: string, answers: BusinessIdeaAnswers) =>
    apiRequest<SaveStepResponse>('/onboarding/wizard/step', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        step: 3,
        answers: { business_idea: answers.business_idea }
      }),
    }),

  // Save step 4: Business context (optional)
  saveBusinessContext: (sessionId: string, answers: BusinessContextAnswers) =>
    apiRequest<SaveStepResponse>('/onboarding/wizard/step', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        step: 4,
        answers: {
          target_customers: answers.target_customers,
          b2b_segment: answers.b2b_segment,
          revenue_model: answers.revenue_model,
          current_stage: answers.current_stage,
          industry: answers.industry,
          funding_status: answers.funding_status,
          funding_amount: answers.funding_amount,
        }
      }),
    }),

  // Save step 5: Review & confirm
  saveReviewConfirmation: (sessionId: string, answers: ReviewAnswers) =>
    apiRequest<SaveStepResponse>('/onboarding/wizard/step', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        step: 5,
        answers: { confirmed: answers.confirmed, terms_accepted: answers.terms_accepted }
      }),
    }),

  // Complete onboarding
  completeWizard: (sessionId: string) =>
    apiRequest<CompleteOnboardingResponse>('/onboarding/wizard/complete', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    }),

  // Get supported countries
  getSupportedCountries: () =>
    apiRequest<CountryResponse[]>('/onboarding/countries'),

  // Invite co-founder
  inviteCofounder: (data: InviteCofounderRequest) =>
    apiRequest<FounderInvitationResponse>('/onboarding/invite-cofounder', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Get co-founders for startup
  getCofounders: (startupId: string) =>
    apiRequest<FounderResponse[]>(`/onboarding/cofounders?startup_id=${startupId}`),

  // Track analytics event
  trackEvent: (data: TrackOnboardingEventRequest) =>
    apiRequest<{ tracked: boolean }>('/onboarding/wizard/track', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================================================
// STARTUP STACK GENERATOR API - Full Implementation
// ============================================================================

import type {
  AiBlueprint,
  ApprovalResponse,
  ConnectServiceRequest,
  DocumentResponse,
  GenerateStartupStackResponse,
  MilestoneFilter,
  MilestoneResponse,
  ServiceFilter,
  ServiceResponse,
  StartupOverview,
  StartupProgressResponse,
  StartupResponse,
  UpdateApprovalRequest,
  UpdateMilestoneRequest,
  UpdateStartupRequest,
  UpcomingDeadline,
} from '@/types/startupStack';

export const startupStackApi = {
  // Startup CRUD
  createStartup: (blueprint: AiBlueprint) =>
    apiRequest<GenerateStartupStackResponse>('/startups', {
      method: 'POST',
      body: JSON.stringify(blueprint),
    }),

  listStartups: () =>
    apiRequest<StartupOverview[]>('/startups'),

  getStartup: (id: string) =>
    apiRequest<StartupResponse>(`/startups/${id}`),

  updateStartup: (id: string, data: UpdateStartupRequest) =>
    apiRequest<StartupResponse>(`/startups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getStartupProgress: (id: string) =>
    apiRequest<StartupProgressResponse>(`/startups/${id}/progress`),

  // Milestones
  getMilestones: (startupId: string, filter?: MilestoneFilter) =>
    apiRequest<MilestoneResponse[]>(
      `/startups/${startupId}/milestones${filter?.status ? `?status=${filter.status}` : ''}`
    ),

  updateMilestone: (startupId: string, milestoneId: string, data: UpdateMilestoneRequest) =>
    apiRequest<MilestoneResponse>(`/startups/${startupId}/milestones/${milestoneId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  completeMilestone: (startupId: string, milestoneId: string) =>
    apiRequest<MilestoneResponse>(`/startups/${startupId}/milestones/${milestoneId}/complete`, {
      method: 'POST',
    }),

  // Approvals
  getApprovals: (startupId: string) =>
    apiRequest<ApprovalResponse[]>(`/startups/${startupId}/approvals`),

  updateApproval: (startupId: string, approvalId: string, data: UpdateApprovalRequest) =>
    apiRequest<ApprovalResponse>(`/startups/${startupId}/approvals/${approvalId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Services
  getServices: (startupId: string, filter?: ServiceFilter) =>
    apiRequest<ServiceResponse[]>(
      `/startups/${startupId}/services${filter?.category ? `?category=${filter.category}` : ''}`
    ),

  connectService: (startupId: string, serviceId: string, data?: ConnectServiceRequest) =>
    apiRequest<ServiceResponse>(`/startups/${startupId}/services/${serviceId}/connect`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    }),

  // Documents
  getDocuments: (startupId: string) =>
    apiRequest<DocumentResponse[]>(`/startups/${startupId}/documents`),

  // Dashboard
  getUpcomingDeadlines: () =>
    apiRequest<UpcomingDeadline[]>('/startups/upcoming-deadlines'),
};

// ============================================================================
// BRANDING API - Phase 2
// ============================================================================

export const brandingApi = {
  generate: (data: { business_id: string; brand_personality?: string; custom_prompt_additions?: string }) =>
    apiRequest<{ generation_id: string; status: string; estimated_seconds: number }>('/branding/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getStatus: (businessId: string) =>
    apiRequest<{
      status: string;
      assets?: {
        id: string;
        logo_url?: string;
        color_palette: any;
        font_pairings: any;
        brand_guidelines_available: boolean;
      };
      progress_percent?: number;
    }>(`/branding/status/${businessId}`),

  regenerateLogo: (data: { business_id: string; custom_prompt?: string; style_preference?: string }) =>
    apiRequest<{ generation_id: string; status: string; estimated_seconds: number }>('/branding/regenerate-logo', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  download: (businessId: string) =>
    fetch(`${API_BASE_URL}/branding/${businessId}/download`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    }).then(r => r.blob()),

  getColorPresets: (category?: string) => {
    const query = category ? `?category=${category}` : '';
    return apiRequest<{ presets: any[] }>(`/branding/color-presets${query}`);
  },

  getFontPresets: (category?: string) => {
    const query = category ? `?category=${category}` : '';
    return apiRequest<{ presets: any[] }>(`/branding/font-presets${query}`);
  },

  getLogs: (businessId: string) =>
    apiRequest<{ logs: any[] }>(`/branding/logs/${businessId}`),
};

// ============================================================================
// DOCUMENT GENERATION API - Phase 2
// ============================================================================

export const documentGenerationApi = {
  generateBusinessPlan: (data: { business_id: string; include_financials?: boolean; years_projection?: number }) =>
    apiRequest<{ generation_id: string; status: string; estimated_seconds: number }>('/documents/business-plan/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  generatePitchDeck: (data: { business_id: string; template?: string }) =>
    apiRequest<{ generation_id: string; status: string; estimated_seconds: number }>('/documents/pitch-deck/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getStatus: (documentId: string) =>
    apiRequest<{
      status: string;
      document?: {
        id: string;
        document_type: string;
        document_name: string;
        download_url: string;
      };
      progress_percent?: number;
    }>(`/documents/status/${documentId}`),

  list: (businessId: string, type?: string) => {
    const query = type ? `?type=${type}` : '';
    return apiRequest<{ documents: any[] }>(`/documents/business/${businessId}${query}`);
  },

  download: (documentId: string) =>
    fetch(`${API_BASE_URL}/documents/${documentId}/download`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    }).then(r => r.blob()),

  getPitchDeckTemplates: () =>
    apiRequest<{ templates: any[] }>('/documents/pitch-deck/templates'),
};

// ============================================================================
// DATA ROOM API - Phase 2
// ============================================================================

export const dataRoomApi = {
  create: (data: { business_id: string; name: string; description?: string }) =>
    apiRequest<{ id: string; name: string; shareable_link?: string }>('/data-rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  get: (dataRoomId: string) =>
    apiRequest<any>(`/data-rooms/${dataRoomId}`),

  list: (businessId: string) =>
    apiRequest<{ data_rooms: any[] }>(`/data-rooms/business/${businessId}`),

  update: (dataRoomId: string, data: { name?: string; description?: string; is_active?: boolean }) =>
    apiRequest<any>(`/data-rooms/${dataRoomId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (dataRoomId: string) =>
    apiRequest<void>(`/data-rooms/${dataRoomId}`, { method: 'DELETE' }),

  share: (dataRoomId: string, data: { expires_in_days?: number; password?: string; download_limit?: number; watermark_text?: string }) =>
    apiRequest<{ share_link: string; expires_at?: string; password_protected: boolean }>(`/data-rooms/${dataRoomId}/share`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  accessShared: (token: string, data?: { password?: string; email?: string }) =>
    apiRequest<any>(`/data-rooms/access/${token}`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    }),

  getAccessLogs: (dataRoomId: string) =>
    apiRequest<{ access_logs: any[] }>(`/data-rooms/${dataRoomId}/access-logs`),

  addFile: (dataRoomId: string, data: { folder: string; file_name: string; description?: string; file_data: string; mime_type: string }) =>
    apiRequest<any>(`/data-rooms/${dataRoomId}/files`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteFile: (dataRoomId: string, fileId: string) =>
    apiRequest<void>(`/data-rooms/${dataRoomId}/files/${fileId}`, { method: 'DELETE' }),

  downloadFile: (dataRoomId: string, fileId: string) =>
    fetch(`${API_BASE_URL}/data-rooms/${dataRoomId}/files/${fileId}/download`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    }).then(r => r.blob()),
};

// ============================================================================
// HEALTH SCORE API - Phase 4
// ============================================================================

export const healthScoreApi = {
  get: (businessId: string) =>
    apiRequest<{
      id: string;
      overall_score: number;
      compliance_score: number;
      revenue_score: number;
      market_fit_score: number;
      team_score: number;
      operations_score: number;
      funding_readiness_score: number;
      contributing_factors: { positive: string[]; negative: string[] };
    }>(`/health-score/${businessId}`),

  refresh: (businessId: string) =>
    apiRequest<any>(`/health-score/${businessId}/refresh`, { method: 'POST' }),

  getHistory: (businessId: string, days?: number) => {
    const query = days ? `?days=${days}` : '';
    return apiRequest<{ history: any[] }>(`/health-score/${businessId}/history${query}`);
  },

  analyzeWebsite: (businessId: string, websiteUrl: string) =>
    apiRequest<{
      clarity_score: number;
      design_score: number;
      messaging_score: number;
      trust_score: number;
      overall_score: number;
      recommendations: string[];
    }>(`/health-score/${businessId}/analyze-website`, {
      method: 'POST',
      body: JSON.stringify({ website_url: websiteUrl }),
    }),
};

// ============================================================================
// RECOMMENDATIONS API - Phase 4
// ============================================================================

export const recommendationsApi = {
  list: (businessId: string, status?: string) => {
    const query = status ? `?status=${status}` : '';
    return apiRequest<{
      recommendations: any[];
      dismissed_count: number;
      total_pending: number;
    }>(`/recommendations/${businessId}${query}`);
  },

  refresh: (businessId: string) =>
    apiRequest<{ new_recommendations_count: number; message: string }>(`/recommendations/${businessId}/refresh`, { method: 'POST' }),

  dismiss: (recommendationId: string, reason?: string) =>
    apiRequest<{ success: boolean; message: string }>(`/recommendations/${recommendationId}/dismiss`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  act: (recommendationId: string, metadata?: any) =>
    apiRequest<{ success: boolean; message: string }>(`/recommendations/${recommendationId}/act`, {
      method: 'POST',
      body: JSON.stringify({ metadata }),
    }),
};

// ============================================================================
// EXTENDED MARKETPLACE API - Phase 4
// ============================================================================

export const extendedMarketplaceApi = {
  // Service Listings
  listServices: (category?: string) => {
    const query = category ? `?category=${category}` : '';
    return apiRequest<{ listings: any[]; categories: any[] }>(`/marketplace/listings${query}`);
  },

  // Order Management
  createOrder: (data: { service_id: string; requirements: string; attachments?: string[] }) =>
    apiRequest<{ order_id: string; status: string; total_amount: number; message: string }>('/marketplace/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  listOrders: (businessId: string) =>
    apiRequest<{ orders: any[] }>(`/marketplace/orders/${businessId}`),

  submitReview: (orderId: string, data: { rating: number; review_text?: string }) =>
    apiRequest<any>(`/marketplace/orders/${orderId}/review`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMessages: (orderId: string) =>
    apiRequest<{ messages: any[] }>(`/marketplace/orders/${orderId}/messages`),

  sendMessage: (orderId: string, data: { message: string; attachment_url?: string }) =>
    apiRequest<any>(`/marketplace/orders/${orderId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // AI Content Generation
  generateAiContent: (data: { business_id: string; content_type: string; days?: number; platform?: string }) =>
    apiRequest<{ generation_id: string; status: string; estimated_seconds: number }>('/marketplace/ai-content/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getContentCalendar: (businessId: string) =>
    apiRequest<{ content_calendar: any[] }>(`/marketplace/ai-content/${businessId}`),

  updateContent: (contentId: string, data: { content: string; hashtags?: string[] }) =>
    apiRequest<any>(`/marketplace/ai-content/${contentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  scheduleContent: (contentId: string, scheduledDate: string) =>
    apiRequest<any>(`/marketplace/ai-content/${contentId}/schedule`, {
      method: 'POST',
      body: JSON.stringify({ scheduled_date: scheduledDate }),
    }),
};

export { ApiError };
