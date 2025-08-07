import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TenantApplication } from '../../types';

interface TenantApplicationsState {
  applications: TenantApplication[];
  loading: boolean;
  error: string | null;
}

const initialState: TenantApplicationsState = {
  applications: [
    {
      id: 'app-1',
      floorNumber: 5,
      applicantName: '山田太郎',
      applicantPhone: '090-1234-5678',
      applicantEmail: 'yamada@abc-corp.com',
      companyName: 'ABC株式会社',
      employeeCount: 25,
      businessType: 'システム開発',
      desiredMoveInDate: '2025-09-01',
      applicationDate: '2025-08-06',
      status: 'pending',
      brokerCompany: 'エステート不動産',
      brokerName: '田中一郎',
      brokerPhone: '03-1234-5678',
      guarantor: {
        name: '山田花子',
        phone: '080-9876-5432',
        relationship: '配偶者',
      },
      documents: [
        {
          id: 'doc-1',
          type: 'application_form',
          name: '入居申込書.pdf',
          uploadDate: '2025-08-06',
          fileSize: '2.3MB',
        },
      ],
      notes: '設立5年の安定した企業です。',
    },
    {
      id: 'app-2',
      floorNumber: 6,
      applicantName: '佐藤次郎',
      applicantPhone: '080-5555-1234',
      applicantEmail: 'sato@xyz-trade.jp',
      companyName: 'XYZ商事株式会社',
      employeeCount: 15,
      businessType: '商品販売',
      desiredMoveInDate: '2025-08-20',
      applicationDate: '2025-08-05',
      status: 'approved',
      brokerCompany: '総合不動産サービス',
      brokerName: '鈴木三郎',
      brokerPhone: '03-9876-5432',
      guarantor: {
        name: '佐藤良子',
        phone: '090-1111-2222',
        relationship: '配偶者',
      },
      documents: [],
    },
  ],
  loading: false,
  error: null,
};

const tenantApplicationsSlice = createSlice({
  name: 'tenantApplications',
  initialState,
  reducers: {
    addTenantApplication: (state, action: PayloadAction<TenantApplication>) => {
      state.applications.push(action.payload);
    },
    updateApplicationStatus: (state, action: PayloadAction<{ id: string; status: TenantApplication['status']; rejectionReason?: string }>) => {
      const { id, status, rejectionReason } = action.payload;
      const application = state.applications.find(a => a.id === id);
      if (application) {
        application.status = status;
        if (status === 'rejected' && rejectionReason) {
          application.rejectionReason = rejectionReason;
        }
      }
    },
    deleteApplication: (state, action: PayloadAction<string>) => {
      state.applications = state.applications.filter(a => a.id !== action.payload);
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
  addTenantApplication,
  updateApplicationStatus,
  deleteApplication,
  setLoading,
  setError,
} = tenantApplicationsSlice.actions;

export default tenantApplicationsSlice.reducer;