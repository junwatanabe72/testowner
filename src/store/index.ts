import { configureStore } from '@reduxjs/toolkit';
import buildingReducer from './slices/buildingSlice';
import applicationsReducer from './slices/applicationsSlice';
import viewingsReducer from './slices/viewingsSlice';
import activitiesReducer from './slices/activitiesSlice';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';
import loadingReducer from './slices/loadingSlice';
import errorReducer from './slices/errorSlice';
import viewingReservationsReducer from './slices/viewingReservationsSlice';
import tenantApplicationsReducer from './slices/tenantApplicationsSlice';
import recruitmentReducer from './slices/recruitmentSlice';
import { localStorageMiddleware, loadPersistedState } from './middleware';
import { generateInitialData } from '../utils/dataGenerator';

const rootReducer = {
  building: buildingReducer,
  applications: applicationsReducer,
  viewings: viewingsReducer,
  activities: activitiesReducer,
  ui: uiReducer,
  user: userReducer,
  loading: loadingReducer,
  error: errorReducer,
  viewingReservations: viewingReservationsReducer,
  tenantApplications: tenantApplicationsReducer,
  recruitment: recruitmentReducer,
};

const persistedState = loadPersistedState();
const initialData = persistedState || generateInitialData();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialData as any,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(localStorageMiddleware as any) as any,
} as any);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;