// 基本データ型定義
export interface User {
  id: string;
  email: string;
  role: 'owner' | 'tenant' | 'manager' | 'broker' | 'facility_user';
  profile: UserProfile;
  permissions: string[];
  created_at: string;
  updated_at: string;
  last_login: string;
}

export interface UserProfile {
  name: string;
  company_name?: string;
  phone?: string;
  avatar_url?: string;
  department?: string;
  position?: string;
}

export interface Building {
  id: string;
  name: string;
  address: Address;
  description: string;
  total_floors: number;
  construction_year: number;
  structure_type: string;
  elevator_count: number;
  parking_spaces: number;
  amenities: string[];
  owner_id: string;
  management_company_id: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  postal_code: string;
  prefecture: string;
  city: string;
  street: string;
  building_number?: string;
}

export interface Floor {
  id: string;
  building_id: string;
  floor_number: number;
  area_sqm: number;
  layout_type: string;
  rent_amount: number;
  common_area_fee: number;
  deposit_months: number;
  key_money_months: number;
  status: 'vacant' | 'occupied' | 'under_negotiation';
  tenant_id?: string;
  features: string[];
  floor_plan_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  company_name: string;
  business_type: string;
  representative_name: string;
  contact: ContactInfo;
  employee_count: number;
  capital_amount: number;
  floor_id: string;
  contract: ContractInfo;
  status: 'active' | 'terminated' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  emergency_contact: string;
}

export interface ContractInfo {
  start_date: string;
  end_date: string;
  rent_amount: number;
  deposit_amount: number;
  contract_type: 'fixed' | 'renewable';
  renewal_date?: string;
}

export interface Application {
  id: string;
  type: ApplicationType;
  title: string;
  description: string;
  applicant_id: string;
  applicant_type: 'tenant' | 'manager' | 'broker';
  target_floor_id?: string;
  status: ApplicationStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduled_date?: string;
  estimated_cost?: number;
  attachments: FileAttachment[];
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  submitted_at?: string;
}

export type ApplicationType = 
  | 'construction'
  | 'facility_reservation'
  | 'maintenance'
  | 'repair'
  | 'cleaning'
  | 'inspection'
  | 'viewing_reservation';

export type ApplicationStatus = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'completed';

export interface FileAttachment {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  url: string;
  uploaded_at: string;
}

export interface Notification {
  id: string;
  recipient_id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: 'low' | 'medium' | 'high';
  read_status: boolean;
  action_url?: string;
  related_entity_type?: string;
  related_entity_id?: string;
  metadata: Record<string, any>;
  created_at: string;
  read_at?: string;
  expires_at?: string;
}

export type NotificationType = 
  | 'application_submitted'
  | 'approval_required'
  | 'application_approved'
  | 'application_rejected'
  | 'schedule_reminder'
  | 'system_maintenance'
  | 'emergency'
  | 'information';

// UI関連の型定義
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface DashboardStats {
  occupancy_rate: number;
  monthly_revenue: number;
  monthly_expenses: number;
  pending_applications: number;
}

export interface ApplicationFilters {
  status?: ApplicationStatus[];
  type?: ApplicationType[];
  priority?: ('low' | 'medium' | 'high' | 'urgent')[];
  applicant?: string;
  dateRange?: { start: string; end: string };
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  size: number;
  total: number;
}