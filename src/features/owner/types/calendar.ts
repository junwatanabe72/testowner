export interface CalendarEvent {
  id: string;
  type: 'viewing' | 'application' | 'maintenance' | 'tenant' | 'facility';
  title: string;
  description?: string;
  startDate: string; // ISO 8601
  endDate?: string; // ISO 8601
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  location?: string; // 階数や場所
  participants?: string[]; // 関係者
  status?: string;
  color: string;
  metadata?: {
    floorNumber?: number;
    brokerCompany?: string;
    tenantName?: string;
    contractorName?: string;
    [key: string]: any;
  };
}

export type CalendarView = 'month' | 'week' | 'day';

export const EVENT_COLORS = {
  viewing: '#2196F3',      // 青系
  application: '#4CAF50',  // 緑系
  maintenance: '#FF9800',  // オレンジ系
  tenant: '#9C27B0',       // 紫系
  facility: '#757575'      // グレー系
} as const;