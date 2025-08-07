import { Building, Application, ViewingReservation, ActivityLog } from '../types';
import { nanoid } from '@reduxjs/toolkit';

export const generateInitialData = () => {
  const building = generateBuilding();
  const applications = generateApplications();
  const viewings = generateViewings();
  const activities = generateActivities();
  
  return {
    building: { data: building, loading: false, error: null },
    applications,
    viewings,
    activities,
  };
};

const generateBuilding = (): Building => {
  const buildingId = 'sakura-building';
  
  return {
    id: buildingId,
    info: {
      name: 'さくらビル',
      address: '東京都港区西新橋1-8-12',
      access: ['JR新橋駅 徒歩5分', '都営三田線内幸町駅 徒歩4分'],
      builtYear: 1992,
      builtMonth: 5,
      structure: '鉄筋コンクリート造 地上6階',
      totalFloors: 6,
      floorArea: 120,
      elevator: 1,
      parking: '近1台',
      facilities: [
        'セントラル空調（各フロア温度調整可能）',
        'OAフロア一部対応',
        '光ファイバー対応',
        'エレベーター1基',
        '24時間入退館可能',
        '駐車場利用可能（月極別途）',
      ],
      nearbyInfo: {
        'コンビニ': '徒歩1分',
        '銀行': 'みずほ銀行新橋支店 徒歩2分',
        '郵便局': '新橋郵便局 徒歩3分',
        '飲食店': '多数あり',
        'ビジネスホテル': '徒歩5分圏内',
      },
    },
    floors: [
      {
        id: 'floor-6',
        buildingId,
        floorNumber: 6,
        area: 120,
        status: 'vacant',
        rent: 380000,
        commonCharge: 40000,
        deposit: '2ヶ月',
        keyMoney: '1ヶ月',
        floorPlanUrl: '6F図面.pdf',
      },
      {
        id: 'floor-5',
        buildingId,
        floorNumber: 5,
        area: 120,
        status: 'vacant',
        rent: 380000,
        commonCharge: 40000,
        deposit: '2ヶ月',
        keyMoney: '1ヶ月',
        floorPlanUrl: '5F図面.pdf',
      },
      {
        id: 'floor-4',
        buildingId,
        floorNumber: 4,
        area: 120,
        status: 'occupied', // 重要: 4階は入居中 - この状態は変更しない
        tenantId: 'tenant-4',
        tenantName: '田中商事株式会社',
        floorPlanUrl: '4F図面.pdf',
      },
      {
        id: 'floor-3',
        buildingId,
        floorNumber: 3,
        area: 120,
        status: 'occupied',
        tenantId: 'tenant-3',
        tenantName: '佐藤システムズ合同会社',
        floorPlanUrl: '3F図面.pdf',
      },
      {
        id: 'floor-2',
        buildingId,
        floorNumber: 2,
        area: 120,
        status: 'occupied',
        tenantId: 'tenant-2',
        tenantName: 'ワタナベ企画株式会社',
        floorPlanUrl: '2F図面.pdf',
      },
    ],
  };
};

const generateApplications = () => {
  const applications: Application[] = [
    {
      id: nanoid(),
      title: '会議室利用申請 (202号室)',
      type: 'facility',
      applicant: 'ワタナベ企画株式会社',
      applicantType: 'tenant',
      applicationDate: '2025-08-04',
      status: 'pending',
      details: '8月10日 14:00-16:00、社内研修のため',
    },
    {
      id: nanoid(),
      title: '清掃業務計画書',
      type: 'cleaning',
      applicant: 'A&Bメンテナンス',
      applicantType: 'management',
      applicationDate: '2025-08-03',
      status: 'pending',
      details: '8月度の定期清掃計画',
    },
    {
      id: nanoid(),
      title: 'エアコン修理依頼',
      type: 'maintenance',
      applicant: '佐藤システムズ合同会社',
      applicantType: 'tenant',
      applicationDate: '2025-08-02',
      status: 'approved',
      details: '3階エアコンの効きが悪い',
    },
    {
      id: nanoid(),
      title: '外壁補修工事申請',
      type: 'construction',
      applicant: 'A&Bメンテナンス',
      applicantType: 'management',
      applicationDate: '2025-08-01',
      status: 'pending',
      details: '北側外壁のクラック補修工事。工期：8月20日〜8月25日',
    },
    {
      id: nanoid(),
      title: 'エレベーター定期点検',
      type: 'maintenance',
      applicant: '東京エレベーター',
      applicantType: 'management',
      applicationDate: '2025-07-30',
      status: 'approved',
      details: '法定点検実施済み。次回は2026年1月予定',
    },
    {
      id: nanoid(),
      title: '共用部照明LED化工事',
      type: 'construction',
      applicant: 'A&Bメンテナンス',
      applicantType: 'management',
      applicationDate: '2025-07-28',
      status: 'rejected',
      details: '省エネ対策として共用部の照明をLED化',
    },
    {
      id: nanoid(),
      title: '会議室予約（4階会議室）',
      type: 'facility',
      applicant: '田中商事株式会社',
      applicantType: 'tenant',
      applicationDate: '2025-07-25',
      status: 'approved',
      details: '8月5日 10:00-12:00、取締役会議',
    },
    {
      id: nanoid(),
      title: '駐車場追加利用申請',
      type: 'facility',
      applicant: '佐藤システムズ合同会社',
      applicantType: 'tenant',
      applicationDate: '2025-08-05',
      status: 'pending',
      details: '来客用として追加で1台分の駐車場利用を申請',
    },
  ];

  const entities: Record<string, Application> = {};
  const ids: string[] = [];
  const byStatus: Record<string, string[]> = {
    pending: [],
    approved: [],
    rejected: [],
  };

  applications.forEach(app => {
    entities[app.id] = app;
    ids.push(app.id);
    byStatus[app.status].push(app.id);
  });

  return { entities, ids, byStatus, loading: false, error: null };
};

const generateViewings = () => {
  const viewings: ViewingReservation[] = [
    {
      id: nanoid(),
      floorNumber: 5,
      reservationDate: '2025-08-08',
      timeSlot: '14:00',
      status: 'approved',
      brokerCompany: '佐藤不動産',
      clientName: '株式会社ABC',
      notes: 'IT企業、20名規模',
    },
    {
      id: nanoid(),
      floorNumber: 5,
      reservationDate: '2025-08-10',
      timeSlot: '10:00',
      status: 'pending',
      brokerCompany: '佐藤不動産',
      clientName: '有限会社XYZ',
      notes: 'デザイン会社、10名規模',
    },
  ];

  const entities: Record<string, ViewingReservation> = {};
  const ids: string[] = [];
  const byDate: Record<string, string[]> = {};
  const byFloor: Record<number, string[]> = {};

  viewings.forEach(viewing => {
    entities[viewing.id] = viewing;
    ids.push(viewing.id);
    
    if (!byDate[viewing.reservationDate]) {
      byDate[viewing.reservationDate] = [];
    }
    byDate[viewing.reservationDate].push(viewing.id);
    
    if (!byFloor[viewing.floorNumber]) {
      byFloor[viewing.floorNumber] = [];
    }
    byFloor[viewing.floorNumber].push(viewing.id);
  });

  return { entities, ids, byDate, byFloor, loading: false, error: null };
};

const generateActivities = () => {
  const activities: ActivityLog[] = [
    {
      id: nanoid(),
      date: '2025-08-05',
      type: 'maintenance',
      description: '設備点検報告書が提出されました。',
    },
    {
      id: nanoid(),
      date: '2025-08-04',
      type: 'tenant_move_in',
      description: '新規テナント (田中商事株式会社) が4階に入居しました。',
    },
    {
      id: nanoid(),
      date: '2025-08-02',
      type: 'maintenance',
      description: 'エアコン修理の依頼が完了しました。',
    },
    {
      id: nanoid(),
      date: '2025-08-02',
      type: 'application',
      description: '「エアコン修理依頼」を承認しました',
    },
    {
      id: nanoid(),
      date: '2025-07-30',
      type: 'application',
      description: '「エレベーター定期点検」を承認しました',
    },
    {
      id: nanoid(),
      date: '2025-07-28',
      type: 'application',
      description: '「共用部照明LED化工事」を却下しました',
    },
    {
      id: nanoid(),
      date: '2025-07-25',
      type: 'viewing',
      description: '5階の内見予約が承認されました（株式会社ABC）',
    },
    {
      id: nanoid(),
      date: '2025-07-25',
      type: 'application',
      description: '「会議室予約（4階会議室）」を承認しました',
    },
  ];

  const entities: Record<string, ActivityLog> = {};
  const ids: string[] = [];
  const byDate: Record<string, string[]> = {};

  activities.forEach(activity => {
    entities[activity.id] = activity;
    ids.push(activity.id);
    
    if (!byDate[activity.date]) {
      byDate[activity.date] = [];
    }
    byDate[activity.date].push(activity.id);
  });

  return { entities, ids, byDate, loading: false, error: null };
};