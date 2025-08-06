import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Application, ApplicationFilters, SortConfig, PaginationState } from '../../types';

interface ApplicationsState {
  items: Record<string, Application>;
  currentApplication: Application | null;
  filters: ApplicationFilters;
  sorting: SortConfig;
  pagination: PaginationState;
  isLoading: boolean;
  error: string | null;
  submitStatus: 'idle' | 'pending' | 'success' | 'error';
}

const initialState: ApplicationsState = {
  items: {},
  currentApplication: null,
  filters: {},
  sorting: { field: 'created_at', direction: 'desc' },
  pagination: { page: 1, size: 10, total: 0 },
  isLoading: false,
  error: null,
  submitStatus: 'idle',
};

// デモデータ生成
const generateId = () => `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const saveToLocalStorage = async (key: string, data: any): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existing = JSON.parse(localStorage.getItem(key) || '{}');
      existing[data.id] = data;
      localStorage.setItem(key, JSON.stringify(existing));
      resolve();
    }, 500);
  });
};

// 非同期アクション
export const fetchApplicationsAsync = createAsyncThunk(
  'applications/fetchAll',
  async () => {
    return new Promise<Application[]>((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem('applications');
        const applications = stored ? Object.values(JSON.parse(stored)) : [];
        resolve(applications as Application[]);
      }, 1000);
    });
  }
);

export const createApplicationAsync = createAsyncThunk(
  'applications/create',
  async (applicationData: Omit<Application, 'id' | 'created_at' | 'updated_at'>) => {
    const newApplication: Application = {
      ...applicationData,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await saveToLocalStorage('applications', newApplication);
    return newApplication;
  }
);

export const updateApplicationAsync = createAsyncThunk(
  'applications/update',
  async (data: { id: string; updates: Partial<Application> }) => {
    const updatedApplication = {
      ...data.updates,
      id: data.id,
      updated_at: new Date().toISOString(),
    };

    await saveToLocalStorage('applications', updatedApplication);
    return updatedApplication;
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ApplicationFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSorting: (state, action: PayloadAction<SortConfig>) => {
      state.sorting = action.payload;
    },
    setPagination: (state, action: PayloadAction<Partial<PaginationState>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setCurrentApplication: (state, action: PayloadAction<string | null>) => {
      const applicationId = action.payload;
      state.currentApplication = applicationId ? state.items[applicationId] : null;
    },
    addApplication: (state, action: PayloadAction<Application>) => {
      state.items[action.payload.id] = action.payload;
    },
    removeApplication: (state, action: PayloadAction<string>) => {
      delete state.items[action.payload];
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSubmitStatus: (state) => {
      state.submitStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // 申請一覧取得
      .addCase(fetchApplicationsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchApplicationsAsync.fulfilled, (state, action) => {
        state.items = action.payload.reduce((acc, app) => {
          acc[app.id] = app;
          return acc;
        }, {} as Record<string, Application>);
        state.pagination.total = action.payload.length;
        state.isLoading = false;
      })
      .addCase(fetchApplicationsAsync.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch applications';
        state.isLoading = false;
      })
      // 申請作成
      .addCase(createApplicationAsync.pending, (state) => {
        state.submitStatus = 'pending';
        state.error = null;
      })
      .addCase(createApplicationAsync.fulfilled, (state, action) => {
        state.items[action.payload.id] = action.payload;
        state.submitStatus = 'success';
        state.pagination.total += 1;
      })
      .addCase(createApplicationAsync.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create application';
        state.submitStatus = 'error';
      })
      // 申請更新
      .addCase(updateApplicationAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateApplicationAsync.fulfilled, (state, action) => {
        if (state.items[action.payload.id]) {
          state.items[action.payload.id] = { ...state.items[action.payload.id], ...action.payload };
        }
        state.isLoading = false;
      })
      .addCase(updateApplicationAsync.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update application';
        state.isLoading = false;
      });
  },
});

export const {
  setFilters,
  setSorting,
  setPagination,
  setCurrentApplication,
  addApplication,
  removeApplication,
  clearError,
  resetSubmitStatus,
} = applicationsSlice.actions;

export default applicationsSlice.reducer;