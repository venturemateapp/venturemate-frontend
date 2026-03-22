// Compliance & Business Registration Types

export interface BusinessRegistration {
  id: string;
  business_id: string;
  country_code: string;
  registration_type: 'sole_proprietorship' | 'partnership' | 'llc' | 'corporation' | 'nonprofit';
  registration_number?: string;
  registered_name: string;
  registration_date?: string;
  expiry_date?: string;
  status: 'draft' | 'pending' | 'submitted' | 'approved' | 'rejected' | 'expired';
  documents: RegistrationDocument[];
  authority: string; // e.g., "Registrar General's Department"
  fees_paid: number;
  currency: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RegistrationDocument {
  id: string;
  name: string;
  type: string;
  status: 'required' | 'uploaded' | 'verified' | 'rejected';
  upload_id?: string;
}

export interface TaxRegistration {
  id: string;
  business_id: string;
  tax_type: 'vat' | 'income' | 'paye' | 'withholding' | 'gst' | 'sales_tax';
  tax_number?: string;
  authority: string; // e.g., "GRA", "IRS", "HMRC"
  country_code: string;
  status: 'not_registered' | 'pending' | 'registered' | 'active' | 'suspended';
  registration_date?: string;
  effective_date?: string;
  filing_frequency: 'monthly' | 'quarterly' | 'annually' | 'on_demand';
  last_filing_date?: string;
  next_filing_date?: string;
  documents: TaxDocument[];
  created_at: string;
  updated_at: string;
}

export interface TaxDocument {
  id: string;
  name: string;
  type: 'certificate' | 'return' | 'receipt' | 'exemption';
  tax_period?: string;
  status: 'draft' | 'filed' | 'paid' | 'overdue';
  amount?: number;
  due_date?: string;
  filed_date?: string;
}

export interface BankAccount {
  id: string;
  business_id: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  bank_code?: string;
  branch?: string;
  account_type: 'checking' | 'savings' | 'merchant' | 'foreign_currency';
  currency: string;
  country_code: string;
  is_primary: boolean;
  is_verified: boolean;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  swift_code?: string;
  iban?: string;
  routing_number?: string;
  balance?: number;
  linked_at?: string;
  created_at: string;
}

export interface ComplianceRequirement {
  id: string;
  country_code: string;
  business_type: string;
  requirement_type: 'registration' | 'license' | 'tax' | 'reporting' | 'labor' | 'environmental';
  title: string;
  description: string;
  authority: string;
  deadline_days?: number; // Days from business registration
  frequency?: 'once' | 'annual' | 'quarterly' | 'monthly';
  estimated_cost?: number;
  currency: string;
  is_mandatory: boolean;
  documents_needed: string[];
  penalties?: string;
}

export interface ComplianceChecklist {
  id: string;
  business_id: string;
  requirement_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'waived';
  due_date?: string;
  completed_date?: string;
  assigned_to?: string;
  notes?: string;
  documents: string[];
  created_at: string;
  updated_at: string;
}

export interface LicensePermit {
  id: string;
  business_id: string;
  license_type: string;
  license_number?: string;
  issuing_authority: string;
  issue_date?: string;
  expiry_date?: string;
  status: 'draft' | 'applied' | 'active' | 'expired' | 'revoked';
  renewal_reminder_sent: boolean;
  documents: string[];
  restrictions?: string;
  created_at: string;
  updated_at: string;
}

export interface FilingDeadline {
  id: string;
  title: string;
  type: 'tax' | 'annual_return' | 'license_renewal' | 'compliance_report';
  due_date: string;
  status: 'upcoming' | 'due_soon' | 'overdue' | 'completed';
  authority: string;
  estimated_amount?: number;
  currency: string;
}

// Ghana-Specific Types
export interface GRARegistration {
  tin?: string; // Tax Identification Number
  vat_number?: string;
  tax_types: ('corporate_income' | 'vat' | 'paye' | 'withholding')[];
  business_office: string;
  district: string;
}

export interface GhanaBusinessRegistration {
  rgd_number?: string; // Registrar General Department
  company_type: 'private_limited' | 'public_limited' | 'sole_proprietorship' | 'partnership' | 'external_company';
  commencement_date?: string;
  annual_returns_due: string;
}

// API Request/Response Types
export interface CreateRegistrationRequest {
  country_code: string;
  registration_type: BusinessRegistration['registration_type'];
  registered_name: string;
}

export interface CreateTaxRegistrationRequest {
  tax_type: TaxRegistration['tax_type'];
  country_code: string;
  filing_frequency: TaxRegistration['filing_frequency'];
}

export interface LinkBankAccountRequest {
  bank_name: string;
  account_number: string;
  account_name: string;
  account_type: BankAccount['account_type'];
  country_code: string;
  currency: string;
  is_primary?: boolean;
}

export interface ComplianceDashboard {
  business_id: string;
  overall_status: 'compliant' | 'at_risk' | 'non_compliant';
  registration_status: BusinessRegistration['status'];
  tax_status: TaxRegistration['status'];
  active_licenses: number;
  pending_filings: number;
  upcoming_deadlines: FilingDeadline[];
  overdue_items: number;
  compliance_score: number; // 0-100
}
