import { 
  CalendarEvent, 
  ViewingReservation, 
  TenantApplication, 
  ActivityLog, 
  Floor,
  Application 
} from '../../../../../types';

// 色の定義
export const EVENT_COLORS = {
  viewing: '#2196F3', // 青
  application: '#4CAF50', // 緑
  maintenance: '#FF9800', // オレンジ
  tenant: '#9C27B0', // 紫
  facility: '#757575', // グレー
};

// 内見予約をカレンダーイベントに変換
export const transformViewingToEvent = (viewing: ViewingReservation): CalendarEvent => {
  const [startTime, endTime] = viewing.timeSlot.split('-');
  
  return {
    id: `viewing-${viewing.id}`,
    type: 'viewing',
    title: `${viewing.floorNumber}階 内見予約`,
    description: `${viewing.brokerCompany} - ${viewing.clientName || ''}`,
    startDate: viewing.reservationDate,
    startTime: startTime,
    endTime: endTime,
    location: `${viewing.floorNumber}階`,
    participants: [viewing.brokerCompany],
    status: viewing.status,
    color: EVENT_COLORS.viewing,
    metadata: {
      floorNumber: viewing.floorNumber,
      brokerCompany: viewing.brokerCompany,
      originalId: viewing.id,
    },
  };
};

// 入居申込をカレンダーイベントに変換
export const transformApplicationToEvent = (application: TenantApplication): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  
  // 申込受付日
  events.push({
    id: `app-submit-${application.id}`,
    type: 'application',
    title: `${application.floorNumber}階 入居申込受付`,
    description: `${application.companyName} - ${application.applicantName}`,
    startDate: application.applicationDate,
    location: `${application.floorNumber}階`,
    participants: [application.brokerCompany, application.companyName],
    status: application.status,
    color: EVENT_COLORS.application,
    metadata: {
      floorNumber: application.floorNumber,
      brokerCompany: application.brokerCompany,
      tenantName: application.companyName,
      originalId: application.id,
    },
  });
  
  // 希望入居日
  if (application.desiredMoveInDate) {
    events.push({
      id: `app-movein-${application.id}`,
      type: 'tenant',
      title: `${application.floorNumber}階 入居予定`,
      description: `${application.companyName}`,
      startDate: application.desiredMoveInDate,
      location: `${application.floorNumber}階`,
      participants: [application.companyName],
      status: application.status === 'approved' ? 'confirmed' : 'tentative',
      color: EVENT_COLORS.tenant,
      metadata: {
        floorNumber: application.floorNumber,
        tenantName: application.companyName,
        originalId: application.id,
      },
    });
  }
  
  return events;
};

// メンテナンス・工事関連をカレンダーイベントに変換
export const transformMaintenanceToEvent = (application: Application): CalendarEvent | null => {
  if (application.type !== 'maintenance' && application.type !== 'construction') {
    return null;
  }
  
  return {
    id: `maintenance-${application.id}`,
    type: 'maintenance',
    title: application.title,
    description: application.details || `${application.applicant}による${application.type === 'maintenance' ? 'メンテナンス' : '工事'}`,
    startDate: application.applicationDate,
    participants: [application.applicant],
    status: application.status,
    color: EVENT_COLORS.maintenance,
    metadata: {
      contractorName: application.applicant,
      originalId: application.id,
    },
  };
};

// 施設利用関連をカレンダーイベントに変換
export const transformFacilityToEvent = (application: Application): CalendarEvent | null => {
  if (application.type !== 'facility') {
    return null;
  }
  
  // 施設利用の場合、詳細から日時を抽出する試み
  const dateMatch = application.details?.match(/(\d{1,2})月(\d{1,2})日/);
  const timeMatch = application.details?.match(/(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/);
  
  let eventDate = application.applicationDate;
  let startTime = undefined;
  let endTime = undefined;
  
  if (dateMatch) {
    const currentYear = new Date().getFullYear();
    const month = parseInt(dateMatch[1], 10);
    const day = parseInt(dateMatch[2], 10);
    
    // 日付が過去の場合は来年とする
    const today = new Date();
    const matchedDate = new Date(currentYear, month - 1, day);
    const targetYear = matchedDate < today ? currentYear + 1 : currentYear;
    
    eventDate = `${targetYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }
  
  if (timeMatch) {
    startTime = timeMatch[1];
    endTime = timeMatch[2];
  }
  
  return {
    id: `facility-${application.id}`,
    type: 'facility',
    title: application.title,
    description: application.details || '',
    startDate: eventDate,
    startTime,
    endTime,
    location: application.title.match(/(\d+)階/)?.[0] || '',
    participants: [application.applicant],
    status: application.status,
    color: EVENT_COLORS.facility,
    metadata: {
      originalId: application.id,
    },
  };
};

// 活動ログをカレンダーイベントに変換
export const transformActivityToEvent = (activity: ActivityLog): CalendarEvent | null => {
  let type: CalendarEvent['type'] = 'facility';
  let color = EVENT_COLORS.facility;
  
  switch (activity.type) {
    case 'tenant_move_in':
    case 'tenant_move_out':
      type = 'tenant';
      color = EVENT_COLORS.tenant;
      break;
    case 'maintenance':
      type = 'maintenance';
      color = EVENT_COLORS.maintenance;
      break;
    case 'viewing':
      type = 'viewing';
      color = EVENT_COLORS.viewing;
      break;
    case 'application':
      type = 'application';
      color = EVENT_COLORS.application;
      break;
  }
  
  return {
    id: `activity-${activity.id}`,
    type,
    title: activity.description,
    startDate: activity.date,
    color,
    metadata: {
      originalId: activity.id,
    },
  };
};

// テナント契約情報から更新・退去予定イベントを生成
export const transformTenantContractToEvents = (floor: Floor): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  
  if (floor.status === 'occupied' && floor.contractEndDate) {
    // 契約更新予定日（契約終了3ヶ月前）
    const contractEnd = new Date(floor.contractEndDate);
    const renewalDate = new Date(contractEnd);
    renewalDate.setMonth(renewalDate.getMonth() - 3);
    
    events.push({
      id: `contract-renewal-${floor.id}`,
      type: 'tenant',
      title: `${floor.floorNumber}階 契約更新確認`,
      description: `${floor.tenantName} - 契約期限: ${floor.contractEndDate}`,
      startDate: renewalDate.toISOString().split('T')[0],
      location: `${floor.floorNumber}階`,
      participants: [floor.tenantName || ''],
      color: EVENT_COLORS.tenant,
      metadata: {
        floorNumber: floor.floorNumber,
        tenantName: floor.tenantName,
      },
    });
    
    // 契約終了日
    events.push({
      id: `contract-end-${floor.id}`,
      type: 'tenant',
      title: `${floor.floorNumber}階 契約期限`,
      description: `${floor.tenantName}`,
      startDate: floor.contractEndDate,
      location: `${floor.floorNumber}階`,
      participants: [floor.tenantName || ''],
      color: EVENT_COLORS.tenant,
      metadata: {
        floorNumber: floor.floorNumber,
        tenantName: floor.tenantName,
      },
    });
  }
  
  return events;
};

// 今日の予定を取得
export const getTodayEvents = (events: CalendarEvent[]): CalendarEvent[] => {
  const today = new Date().toISOString().split('T')[0];
  return events
    .filter(event => event.startDate === today)
    .sort((a, b) => {
      if (!a.startTime || !b.startTime) return 0;
      return a.startTime.localeCompare(b.startTime);
    });
};

// 今週の予定を取得
export const getWeekEvents = (events: CalendarEvent[]): CalendarEvent[] => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  const startStr = startOfWeek.toISOString().split('T')[0];
  const endStr = endOfWeek.toISOString().split('T')[0];
  
  return events.filter(event => 
    event.startDate >= startStr && event.startDate <= endStr
  );
};

// 月の予定を取得
export const getMonthEvents = (events: CalendarEvent[], year: number, month: number): CalendarEvent[] => {
  const startOfMonth = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const endOfMonth = new Date(year, month, 0).toISOString().split('T')[0];
  
  return events.filter(event => 
    event.startDate >= startOfMonth && event.startDate <= endOfMonth
  );
};