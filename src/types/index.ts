// 物件情報
export interface Building {
  id: string;
  info: BuildingInfo;
  floors: Floor[];
}

export interface BuildingInfo {
  name: string;
  address: string;
  access: string[];
  builtYear: number;
  builtMonth: number;
  structure: string;
  totalFloors: number;
  floorArea: number;
  elevator: number;
  parking: string;
  facilities: string[];
  nearbyInfo: { [key: string]: string };
}

export interface Floor {
  id: string;
  buildingId: string;
  floorNumber: number;
  area: number;
  status: 'occupied' | 'vacant';
  tenantId?: string;
  tenantName?: string;
  rent?: number;
  commonCharge?: number;
  deposit?: string;
  keyMoney?: string;
  floorPlanUrl?: string;
  contractStartDate?: string;
  contractEndDate?: string;
}

export interface TenantContract {
  id: string;
  tenantName: string;
  floorNumber: number;
  rent: number;
  commonCharge: number;
  contractStartDate: string;
  contractEndDate: string;
  deposit: string;
  keyMoney: string;
  guarantor: string;
  emergencyContact: {
    name: string;
    phone: string;
    email: string;
  };
  paymentStatus: 'paid' | 'pending' | 'overdue';
  lastPaymentDate: string;
  nextPaymentDue: string;
  renewalStatus: 'on_time' | 'needs_renewal' | 'auto_renewal' | 'expired';
  documents: TenantDocument[];
}

export interface TenantDocument {
  id: string;
  type: 'contract' | 'application' | 'guarantor' | 'insurance' | 'other';
  name: string;
  uploadDate: string;
  fileSize?: string;
}

// 申請情報
export interface Application {
  id: string;
  title: string;
  type: 'facility' | 'cleaning' | 'maintenance' | 'construction';
  applicant: string;
  applicantType: 'tenant' | 'management';
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  details?: string;
}

// 内見予約情報
export interface ViewingReservation {
  id: string;
  floorNumber: number;
  reservationDate: string;
  timeSlot: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  brokerCompany: string;
  clientName?: string;
  notes?: string;
}

// 入居申込情報
export interface TenantApplication {
  id: string;
  floorNumber: number;
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
  companyName: string;
  employeeCount: number;
  businessType: string;
  desiredMoveInDate: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  brokerCompany: string;
  brokerName: string;
  brokerPhone: string;
  guarantor: {
    name: string;
    phone: string;
    relationship: string;
  };
  documents: ApplicationDocument[];
  notes?: string;
  rejectionReason?: string;
}

export interface ApplicationDocument {
  id: string;
  type: 'application_form' | 'company_registration' | 'financial_statement' | 'guarantor_form' | 'other';
  name: string;
  uploadDate: string;
  fileSize?: string;
}

// 活動履歴
export interface ActivityLog {
  id: string;
  date: string;
  type: 'tenant_move_in' | 'tenant_move_out' | 'maintenance' | 'application' | 'viewing';
  description: string;
  relatedId?: string;
}

// 募集条件情報
export interface RecruitmentCondition {
  id: string;
  floorNumber: number;
  rent: number;
  commonCharge: number;
  deposit: string;
  keyMoney: string;
  contractPeriod: string;
  moveInDate: string;
  features: string[];
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 仲介会社情報
export interface BrokerCompany {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: string;
}

// メールテンプレート情報
export interface EmailTemplate {
  id: string;
  type: 'vacancy_notification' | 'move_out_notification';
  subject: string;
  body: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

// ユーザー情報
export interface User {
  id: string;
  name: string;
  role: 'owner' | 'broker';
  company?: string;
}