import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { Application } from '../../types';

interface ApplicationsState {
  entities: Record<string, Application>;
  ids: string[];
  byStatus: Record<string, string[]>;
  loading: boolean;
  error: string | null;
}

const initialState: ApplicationsState = {
  entities: {},
  ids: [],
  byStatus: {
    pending: [],
    approved: [],
    rejected: [],
  },
  loading: false,
  error: null,
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    initializeApplications: (state, action: PayloadAction<ApplicationsState>) => {
      Object.assign(state, action.payload);
    },
    
    addApplication: {
      reducer: (state, action: PayloadAction<Application>) => {
        const application = action.payload;
        state.entities[application.id] = application;
        state.ids.push(application.id);
        state.byStatus[application.status].push(application.id);
      },
      prepare: (applicationData: Omit<Application, 'id' | 'applicationDate'>) => ({
        payload: {
          id: nanoid(),
          applicationDate: new Date().toISOString().split('T')[0],
          ...applicationData,
        },
      }),
    },
    
    updateApplicationStatus: (state, action: PayloadAction<{ id: string; status: 'pending' | 'approved' | 'rejected'; comment?: string }>) => {
      const { id, status, comment } = action.payload;
      const application = state.entities[id];
      if (application && application.status !== status) {
        // Remove from old status array
        state.byStatus[application.status] = state.byStatus[application.status].filter(appId => appId !== id);
        // Add to new status array
        state.byStatus[status].push(id);
        // Update status
        application.status = status;
        // Add comment if provided
        if (comment) {
          (application as any).comment = comment;
        }
      }
    },
    
    removeApplication: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const application = state.entities[id];
      if (application) {
        delete state.entities[id];
        state.ids = state.ids.filter(appId => appId !== id);
        state.byStatus[application.status] = state.byStatus[application.status].filter(appId => appId !== id);
      }
    },
  },
});

export const { initializeApplications, addApplication, updateApplicationStatus, removeApplication } = applicationsSlice.actions;
export default applicationsSlice.reducer;