// Note: This module uses the same API_BASE_URL and patterns as client.ts
// In a real implementation, apiRequest would be exported from client.ts
// For now, we define a local helper

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://139.162.170.220:8080/api/v1';

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

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error?.code || 'UNKNOWN_ERROR',
      errorData.error?.message || 'An unexpected error occurred',
      response.status
    );
  }

  return response.json();
}
import type {
  BusinessRegistration,
  TaxRegistration,
  BankAccount,
  ComplianceRequirement,
  ComplianceChecklist,
  LicensePermit,
  FilingDeadline,
  ComplianceDashboard,
  CreateRegistrationRequest,
  CreateTaxRegistrationRequest,
  LinkBankAccountRequest,
} from '@/types/compliance';

// ============================================================================
// BUSINESS REGISTRATION API
// ============================================================================

export const registrationApi = {
  // Get all registrations for a business
  getAll: (businessId: string) =>
    apiRequest<{ registrations: BusinessRegistration[] }>(
      `/businesses/${businessId}/registrations`
    ),

  // Get single registration
  getById: (businessId: string, registrationId: string) =>
    apiRequest<{ registration: BusinessRegistration }>(
      `/businesses/${businessId}/registrations/${registrationId}`
    ),

  // Create new registration
  create: (businessId: string, data: CreateRegistrationRequest) =>
    apiRequest<{ registration: BusinessRegistration }>(
      `/businesses/${businessId}/registrations`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),

  // Update registration
  update: (businessId: string, registrationId: string, data: Partial<BusinessRegistration>) =>
    apiRequest<{ registration: BusinessRegistration }>(
      `/businesses/${businessId}/registrations/${registrationId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    ),

  // Upload registration document
  uploadDocument: async (
    businessId: string,
    registrationId: string,
    file: File,
    documentType: string
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);

    return apiRequest<{ document: { id: string; url: string } }>(
      `/businesses/${businessId}/registrations/${registrationId}/documents`,
      {
        method: 'POST',
        body: formData as any,
        headers: {},
      }
    );
  },

  // Get country-specific requirements
  getRequirements: (countryCode: string, businessType: string) =>
    apiRequest<{ requirements: ComplianceRequirement[] }>(
      `/compliance/requirements?country=${countryCode}&business_type=${businessType}`
    ),
};

// ============================================================================
// TAX REGISTRATION API
// ============================================================================

export const taxApi = {
  // Get all tax registrations
  getAll: (businessId: string) =>
    apiRequest<{ taxes: TaxRegistration[] }>(`/businesses/${businessId}/taxes`),

  // Get single tax registration
  getById: (businessId: string, taxId: string) =>
    apiRequest<{ tax: TaxRegistration }>(`/businesses/${businessId}/taxes/${taxId}`),

  // Register for tax
  register: (businessId: string, data: CreateTaxRegistrationRequest) =>
    apiRequest<{ tax: TaxRegistration }>(`/businesses/${businessId}/taxes`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Update tax registration
  update: (businessId: string, taxId: string, data: Partial<TaxRegistration>) =>
    apiRequest<{ tax: TaxRegistration }>(`/businesses/${businessId}/taxes/${taxId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // File tax return
  fileReturn: (
    businessId: string,
    taxId: string,
    data: {
      period: string;
      amount: number;
      documents: string[];
    }
  ) =>
    apiRequest<{ filing: { id: string; status: string } }>(
      `/businesses/${businessId}/taxes/${taxId}/file`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),

  // Get tax calendar/deadlines
  getDeadlines: (businessId: string) =>
    apiRequest<{ deadlines: FilingDeadline[] }>(`/businesses/${businessId}/tax-deadlines`),

  // Get tax documents
  getDocuments: (businessId: string, taxId: string) =>
    apiRequest<{ documents: any[] }>(`/businesses/${businessId}/taxes/${taxId}/documents`),

  // Ghana GRA-specific
  getGRAStatus: (businessId: string) =>
    apiRequest<{
      tin?: string;
      vat_number?: string;
      status: string;
      tax_types: string[];
    }>(`/businesses/${businessId}/gra-status`),
};

// ============================================================================
// BANKING API
// ============================================================================

export const bankingApi = {
  // Get all bank accounts
  getAll: (businessId: string) =>
    apiRequest<{ accounts: BankAccount[] }>(`/businesses/${businessId}/bank-accounts`),

  // Get primary account
  getPrimary: (businessId: string) =>
    apiRequest<{ account: BankAccount | null }>(`/businesses/${businessId}/bank-accounts/primary`),

  // Link new bank account
  link: (businessId: string, data: LinkBankAccountRequest) =>
    apiRequest<{ account: BankAccount; verification_required: boolean }>(
      `/businesses/${businessId}/bank-accounts`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),

  // Verify bank account (micro-deposit or instant verification)
  verify: (businessId: string, accountId: string, data: { amounts?: [number, number]; token?: string }) =>
    apiRequest<{ account: BankAccount }>(
      `/businesses/${businessId}/bank-accounts/${accountId}/verify`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),

  // Set as primary
  setPrimary: (businessId: string, accountId: string) =>
    apiRequest<{ account: BankAccount }>(
      `/businesses/${businessId}/bank-accounts/${accountId}/primary`,
      {
        method: 'POST',
      }
    ),

  // Unlink account
  unlink: (businessId: string, accountId: string) =>
    apiRequest<void>(`/businesses/${businessId}/bank-accounts/${accountId}`, {
      method: 'DELETE',
    }),

  // Get bank list (for country)
  getBanks: (countryCode: string) =>
    apiRequest<{ banks: { code: string; name: string }[] }>(`/banks?country=${countryCode}`),

  // Get transaction history (if integrated)
  getTransactions: (businessId: string, accountId: string, page = 1) =>
    apiRequest<{
      transactions: any[];
      meta: { page: number; total: number };
    }>(`/businesses/${businessId}/bank-accounts/${accountId}/transactions?page=${page}`),
};

// ============================================================================
// COMPLIANCE CHECKLIST API
// ============================================================================

export const complianceApi = {
  // Get compliance dashboard
  getDashboard: (businessId: string) =>
    apiRequest<ComplianceDashboard>(`/businesses/${businessId}/compliance-dashboard`),

  // Get compliance checklist
  getChecklist: (businessId: string) =>
    apiRequest<{ items: ComplianceChecklist[] }>(`/businesses/${businessId}/compliance-checklist`),

  // Update checklist item
  updateItem: (
    businessId: string,
    itemId: string,
    data: Partial<ComplianceChecklist>
  ) =>
    apiRequest<{ item: ComplianceChecklist }>(
      `/businesses/${businessId}/compliance-checklist/${itemId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    ),

  // Get upcoming deadlines
  getDeadlines: (businessId: string, days = 90) =>
    apiRequest<{ deadlines: FilingDeadline[] }>(
      `/businesses/${businessId}/compliance-deadlines?days=${days}`
    ),

  // Generate AI compliance checklist
  generateChecklist: (businessId: string) =>
    apiRequest<{ checklist: ComplianceRequirement[] }>(
      `/businesses/${businessId}/generate-compliance-checklist`,
      {
        method: 'POST',
      }
    ),
};

// ============================================================================
// LICENSES & PERMITS API
// ============================================================================

export const licensesApi = {
  // Get all licenses
  getAll: (businessId: string) =>
    apiRequest<{ licenses: LicensePermit[] }>(`/businesses/${businessId}/licenses`),

  // Get single license
  getById: (businessId: string, licenseId: string) =>
    apiRequest<{ license: LicensePermit }>(`/businesses/${businessId}/licenses/${licenseId}`),

  // Apply for license
  apply: (
    businessId: string,
    data: {
      license_type: string;
      issuing_authority: string;
      documents: string[];
    }
  ) =>
    apiRequest<{ license: LicensePermit }>(`/businesses/${businessId}/licenses`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Renew license
  renew: (businessId: string, licenseId: string, data: { documents: string[] }) =>
    apiRequest<{ license: LicensePermit }>(
      `/businesses/${businessId}/licenses/${licenseId}/renew`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),

  // Upload license document
  uploadDocument: (businessId: string, licenseId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return apiRequest<{ document: { id: string } }>(
      `/businesses/${businessId}/licenses/${licenseId}/documents`,
      {
        method: 'POST',
        body: formData as any,
        headers: {},
      }
    );
  },

  // Get expiring licenses
  getExpiring: (businessId: string, days = 30) =>
    apiRequest<{ licenses: LicensePermit[] }>(
      `/businesses/${businessId}/licenses/expiring?days=${days}`
    ),
};

// ============================================================================
// AI COMPLIANCE ASSISTANT
// ============================================================================

export const aiComplianceApi = {
  // Generate country-specific compliance requirements
  generateRequirements: (businessId: string, countryCode: string) =>
    apiRequest<{ requirements: ComplianceRequirement[]; summary: string }>(
      `/ai/businesses/${businessId}/compliance-requirements`,
      {
        method: 'POST',
        body: JSON.stringify({ country_code: countryCode }),
      }
    ),

  // Get tax advice
  getTaxAdvice: (businessId: string, question: string) =>
    apiRequest<{ answer: string; sources: string[] }>(
      `/ai/businesses/${businessId}/tax-advice`,
      {
        method: 'POST',
        body: JSON.stringify({ question }),
      }
    ),

  // Calculate estimated taxes
  calculateTaxEstimate: (
    businessId: string,
    data: {
      revenue: number;
      expenses: number;
      tax_type: string;
      period: string;
    }
  ) =>
    apiRequest<{
      estimated_tax: number;
      breakdown: { label: string; amount: number }[];
      notes: string;
    }>(`/ai/businesses/${businessId}/tax-estimate`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
