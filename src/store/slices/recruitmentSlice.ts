import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecruitmentCondition, BrokerCompany, EmailTemplate } from '../../types';

interface RecruitmentState {
  conditions: RecruitmentCondition[];
  brokerCompanies: BrokerCompany[];
  emailTemplates: EmailTemplate[];
  loading: boolean;
  error: string | null;
}

const initialState: RecruitmentState = {
  conditions: [
    {
      id: 'rec-1',
      floorNumber: 5,
      rent: 350000,
      commonCharge: 30000,
      deposit: '家賃2ヶ月分',
      keyMoney: '家賃1ヶ月分',
      contractPeriod: '2年',
      moveInDate: '即入居可',
      features: ['駅近', '敷金礼金相談可', '法人契約可'],
      description: '最上階の明るいオフィスです。眺望良好で快適な作業環境を提供します。',
      isActive: true,
      createdAt: '2025-08-06 10:00:00',
      updatedAt: '2025-08-06 10:00:00',
    },
    {
      id: 'rec-2',
      floorNumber: 6,
      rent: 400000,
      commonCharge: 30000,
      deposit: '家賃2ヶ月分',
      keyMoney: 'なし',
      contractPeriod: '2年',
      moveInDate: '2025-09-01',
      features: ['最上階', 'エレベーター直結', '法人契約可'],
      description: '最上階の特等席。会議室完備で成長企業に最適です。',
      isActive: true,
      createdAt: '2025-08-05 14:30:00',
      updatedAt: '2025-08-05 14:30:00',
    },
  ],
  brokerCompanies: [
    {
      id: 'broker-1',
      name: 'エステート不動産',
      contactPerson: '田中一郎',
      email: 'tanaka@estate-fudosan.jp',
      phone: '03-1234-5678',
      address: '東京都千代田区〇〇1-2-3',
      isActive: true,
      createdAt: '2025-08-01 09:00:00',
    },
    {
      id: 'broker-2',
      name: '総合不動産サービス',
      contactPerson: '鈴木三郎',
      email: 'suzuki@sogo-fudosan.com',
      phone: '03-9876-5432',
      address: '東京都港区〇〇2-3-4',
      isActive: true,
      createdAt: '2025-07-28 15:20:00',
    },
    {
      id: 'broker-3',
      name: 'オフィス専門不動産',
      contactPerson: '佐藤花子',
      email: 'sato@office-senmon.co.jp',
      phone: '03-5555-1234',
      address: '東京都新宿区〇〇3-4-5',
      isActive: true,
      createdAt: '2025-07-25 11:45:00',
    },
    {
      id: 'broker-4',
      name: '都心不動産コンサル',
      contactPerson: '山田太郎',
      email: 'yamada@toshin-consul.net',
      phone: '03-7777-8888',
      address: '東京都中央区〇〇4-5-6',
      isActive: false,
      createdAt: '2025-07-20 16:30:00',
    },
  ],
  emailTemplates: [
    {
      id: 'template-1',
      type: 'vacancy_notification',
      subject: '【空室情報】{{buildingName}} {{floorNumber}}階 募集開始のお知らせ',
      body: `{{brokerName}}様

いつもお世話になっております。
{{ownerName}}です。

この度、以下の空室が発生いたしましたのでご連絡いたします。

■物件情報
建物名: {{buildingName}}
階数: {{floorNumber}}階
面積: {{area}}㎡
賃料: {{rent}}円/月
共益費: {{commonCharge}}円/月
敷金: {{deposit}}
礼金: {{keyMoney}}
入居可能日: {{moveInDate}}

■特徴
{{features}}

■詳細
{{description}}

ご興味をお持ちのお客様がいらっしゃいましたら、
ぜひお気軽にお問い合わせください。

よろしくお願いいたします。

{{ownerName}}
{{ownerPhone}}
{{ownerEmail}}`,
      variables: ['buildingName', 'floorNumber', 'area', 'rent', 'commonCharge', 'deposit', 'keyMoney', 'moveInDate', 'features', 'description', 'brokerName', 'ownerName', 'ownerPhone', 'ownerEmail'],
      createdAt: '2025-08-01 10:00:00',
      updatedAt: '2025-08-06 09:30:00',
    },
    {
      id: 'template-2',
      type: 'move_out_notification',
      subject: '【退去通知】{{buildingName}} {{floorNumber}}階 空室予定のお知らせ',
      body: `{{brokerName}}様

いつもお世話になっております。
{{ownerName}}です。

以下の通り、退去予定が確定いたしましたのでご連絡いたします。

■退去予定物件
建物名: {{buildingName}}
階数: {{floorNumber}}階
現テナント: {{currentTenant}}
退去予定日: {{moveOutDate}}
募集開始予定: {{recruitmentStartDate}}

詳細な募集条件については、後日改めてご連絡いたします。
先行して情報提供をさせていただきますので、
ご興味をお持ちのお客様がいらっしゃいましたら事前にお声がけください。

よろしくお願いいたします。

{{ownerName}}
{{ownerPhone}}
{{ownerEmail}}`,
      variables: ['buildingName', 'floorNumber', 'currentTenant', 'moveOutDate', 'recruitmentStartDate', 'brokerName', 'ownerName', 'ownerPhone', 'ownerEmail'],
      createdAt: '2025-08-01 10:15:00',
      updatedAt: '2025-08-01 10:15:00',
    },
  ],
  loading: false,
  error: null,
};

const recruitmentSlice = createSlice({
  name: 'recruitment',
  initialState,
  reducers: {
    addRecruitmentCondition: (state, action: PayloadAction<RecruitmentCondition>) => {
      state.conditions.push(action.payload);
    },
    updateRecruitmentCondition: (state, action: PayloadAction<RecruitmentCondition>) => {
      const index = state.conditions.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.conditions[index] = action.payload;
      }
    },
    deleteRecruitmentCondition: (state, action: PayloadAction<string>) => {
      state.conditions = state.conditions.filter(c => c.id !== action.payload);
    },
    toggleRecruitmentCondition: (state, action: PayloadAction<string>) => {
      const condition = state.conditions.find(c => c.id === action.payload);
      if (condition) {
        condition.isActive = !condition.isActive;
        condition.updatedAt = new Date().toLocaleString('ja-JP');
      }
    },
    addBrokerCompany: (state, action: PayloadAction<BrokerCompany>) => {
      state.brokerCompanies.push(action.payload);
    },
    updateBrokerCompany: (state, action: PayloadAction<BrokerCompany>) => {
      const index = state.brokerCompanies.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.brokerCompanies[index] = action.payload;
      }
    },
    deleteBrokerCompany: (state, action: PayloadAction<string>) => {
      state.brokerCompanies = state.brokerCompanies.filter(b => b.id !== action.payload);
    },
    toggleBrokerCompany: (state, action: PayloadAction<string>) => {
      const company = state.brokerCompanies.find(b => b.id === action.payload);
      if (company) {
        company.isActive = !company.isActive;
      }
    },
    updateEmailTemplate: (state, action: PayloadAction<EmailTemplate>) => {
      const index = state.emailTemplates.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.emailTemplates[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addRecruitmentCondition,
  updateRecruitmentCondition,
  deleteRecruitmentCondition,
  toggleRecruitmentCondition,
  addBrokerCompany,
  updateBrokerCompany,
  deleteBrokerCompany,
  toggleBrokerCompany,
  updateEmailTemplate,
  setLoading,
  setError,
} = recruitmentSlice.actions;

export default recruitmentSlice.reducer;